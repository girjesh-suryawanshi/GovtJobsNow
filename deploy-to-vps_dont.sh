#!/bin/bash

# GovtJobsNow Complete VPS Deployment Script
# Run this script in your project directory where code is already pulled

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_step() { echo -e "${BLUE}[STEP]${NC} $1"; }
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️ $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }

# Script configuration
DOMAIN=""
DB_PASSWORD=""
SESSION_SECRET=""
PROJECT_DIR=$(pwd)

echo "🚀 GovtJobsNow Complete VPS Deployment"
echo "======================================"
echo "Project directory: $PROJECT_DIR"
echo ""

# Check if running as root
check_root() {
    if [ "$EUID" -ne 0 ]; then
        print_error "This script must be run as root (use sudo)"
        exit 1
    fi
    print_success "Running as root"
}

# Get configuration from user
get_configuration() {
    print_step "Getting deployment configuration..."
    
    echo -n "Enter your domain name (e.g., govtjobnow.com): "
    read DOMAIN
    
    if [ -z "$DOMAIN" ]; then
        print_error "Domain name is required"
        exit 1
    fi
    
    # Generate secure passwords
    DB_PASSWORD=$(openssl rand -base64 20)
    SESSION_SECRET=$(openssl rand -base64 32)
    
    print_success "Configuration set for domain: $DOMAIN"
}

# Update system
update_system() {
    print_step "Updating system packages..."
    apt update && apt upgrade -y
    apt install -y curl wget git nano htop ufw openssl
    print_success "System updated"
}

# Setup firewall
setup_firewall() {
    print_step "Configuring firewall..."
    ufw allow OpenSSH
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw --force enable
    print_success "Firewall configured"
}

# Install Docker
install_docker() {
    print_step "Installing Docker..."
    
    if command -v docker &> /dev/null; then
        print_success "Docker already installed"
        return
    fi
    
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
    
    print_success "Docker installed"
}

# Install Nginx
install_nginx() {
    print_step "Installing Nginx..."
    
    apt install -y nginx
    systemctl enable nginx
    systemctl start nginx
    
    # Remove default site
    rm -f /etc/nginx/sites-enabled/default
    
    print_success "Nginx installed"
}

# Create environment file
setup_environment() {
    print_step "Setting up environment configuration..."
    
    cat > $PROJECT_DIR/.env << EOF
# Database Configuration (IMPORTANT: Use 'postgres' as host for Docker)
POSTGRES_PASSWORD=$DB_PASSWORD
DATABASE_URL=postgresql://postgres:$DB_PASSWORD@postgres:5432/govtjobnow
PGHOST=postgres
PGPORT=5432
PGDATABASE=govtjobnow
PGUSER=postgres
PGPASSWORD=$DB_PASSWORD

# Application Configuration
NODE_ENV=production
PORT=3000
TZ=Asia/Kolkata

# Security Configuration
SESSION_SECRET=$SESSION_SECRET

# Domain Configuration
DOMAIN=$DOMAIN
BASE_URL=https://$DOMAIN

# Logging
LOG_LEVEL=info
EOF
    
    chmod 600 $PROJECT_DIR/.env
    print_success "Environment file created with secure passwords"
    
    print_warning "IMPORTANT: Database password: $DB_PASSWORD"
    print_warning "IMPORTANT: Session secret: $SESSION_SECRET"
    print_warning "Please save these passwords securely!"
}

# Prepare application directories
prepare_directories() {
    print_step "Preparing application directories..."
    
    cd $PROJECT_DIR
    
    # Create necessary directories
    mkdir -p logs uploads db-backup
    
    # Set correct permissions for Docker user (1001)
    chown -R 1001:1001 logs uploads
    chmod 755 logs uploads db-backup
    
    print_success "Directories prepared with correct permissions"
}

# Build and start application
start_application() {
    print_step "Building and starting application..."
    
    cd $PROJECT_DIR
    
    # Stop any running containers
    docker compose down 2>/dev/null || true
    
    # Build application
    print_step "Building Docker containers..."
    docker compose build --no-cache
    
    # Start services
    print_step "Starting services..."
    docker compose up -d
    
    # Wait for services to be ready
    print_step "Waiting for services to start..."
    sleep 30
    
    # Check if services are running
    docker compose ps
    
    print_success "Application containers started"
}

# Initialize database
setup_database() {
    print_step "Initializing database..."
    
    cd $PROJECT_DIR
    
    # Wait for database to be ready
    print_step "Waiting for database to be ready..."
    sleep 10
    
    # Run database migrations
    docker compose exec -T app npm run db:push --force || {
        print_warning "First migration attempt failed, trying alternative..."
        docker compose exec -T app npx drizzle-kit push --force
    }
    
    print_success "Database initialized"
}

# Setup Nginx configuration
setup_nginx() {
    print_step "Setting up Nginx configuration..."
    
    # Create HTTP-only configuration first (for SSL certificate)
    cat > /etc/nginx/sites-available/$DOMAIN << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    # Allow Let's Encrypt ACME challenges
    location ^~ /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    # Proxy to application
    location / {
        proxy_pass http://127.0.0.1:4007;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Static file caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        proxy_pass http://127.0.0.1:4007;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF
    
    # Enable site
    ln -s /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
    
    # Test and reload Nginx
    nginx -t
    systemctl reload nginx
    
    print_success "Nginx configured for HTTP"
}

# Install SSL certificate
setup_ssl() {
    print_step "Installing SSL certificate..."
    
    # Install Certbot
    apt install -y certbot python3-certbot-nginx
    
    # Get SSL certificate
    certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
    
    # Test auto-renewal
    certbot renew --dry-run
    
    print_success "SSL certificate installed and configured"
}

# Test deployment
test_deployment() {
    print_step "Testing deployment..."
    
    # Test Docker services
    echo "Docker services status:"
    docker compose ps
    
    # Test application health
    sleep 5
    if curl -f http://127.0.0.1:4007/api/stats >/dev/null 2>&1; then
        print_success "Application is responding locally"
    else
        print_warning "Application not responding locally, checking logs..."
        docker compose logs --tail=20 app
    fi
    
    # Test domain
    if curl -f http://$DOMAIN >/dev/null 2>&1; then
        print_success "Domain is accessible via HTTP"
    else
        print_warning "Domain not accessible via HTTP yet"
    fi
    
    # Test HTTPS
    sleep 5
    if curl -f https://$DOMAIN >/dev/null 2>&1; then
        print_success "Domain is accessible via HTTPS"
    else
        print_warning "HTTPS might still be setting up"
    fi
    
    print_success "Deployment testing completed"
}

# Create admin user (optional)
create_admin_user() {
    print_step "Setting up admin user..."
    
    print_warning "To create your first admin user, visit: https://$DOMAIN/admin/login"
    print_warning "Or you can create it manually via the database if needed"
}

# Main deployment function
main() {
    print_step "Starting complete VPS deployment..."
    
    check_root
    get_configuration
    update_system
    setup_firewall
    install_docker
    install_nginx
    setup_environment
    prepare_directories
    start_application
    setup_database
    setup_nginx
    setup_ssl
    test_deployment
    create_admin_user
    
    echo ""
    echo "🎉 GovtJobsNow Deployment Completed Successfully!"
    echo "=============================================="
    echo ""
    echo "🌐 Website: https://$DOMAIN"
    echo "👨‍💼 Admin Panel: https://$DOMAIN/admin/login"
    echo "📊 API Health: https://$DOMAIN/api/stats"
    echo ""
    echo "📁 Project Directory: $PROJECT_DIR"
    echo "🔑 Database Password: $DB_PASSWORD"
    echo ""
    echo "🔧 Useful Commands:"
    echo "   cd $PROJECT_DIR"
    echo "   docker compose ps                    # Check services"
    echo "   docker compose logs -f app          # View logs"
    echo "   docker compose restart              # Restart services"
    echo "   systemctl status nginx              # Check Nginx"
    echo ""
    echo "🔄 To update your application later:"
    echo "   git pull origin main"
    echo "   docker compose build --no-cache"
    echo "   docker compose up -d"
    echo ""
    echo "🎯 Your GovtJobsNow is now live and ready!"
}

# Run main function
main "$@"