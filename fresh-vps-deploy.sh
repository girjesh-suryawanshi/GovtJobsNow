#!/bin/bash

# GovtJobsNow Fresh VPS Deployment Script
# Complete deployment for brand new VPS hosting

set -e

echo "🚀 GovtJobsNow Fresh VPS Deployment"
echo "==================================="
echo "This script will set up GovtJobsNow on a fresh VPS"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_step() { echo -e "${BLUE}[STEP]${NC} $1"; }
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️ $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }

# Configuration
APP_DIR="/opt/govtjobnow"
APP_USER="govtjobs"
DOMAIN=""  # Will be set during setup

# Function to check if running as root
check_root() {
    if [ "$EUID" -ne 0 ]; then
        print_error "This script must be run as root (use sudo)"
        exit 1
    fi
    print_success "Running as root"
}

# Update system packages
update_system() {
    print_step "Updating system packages..."
    apt update && apt upgrade -y
    apt install -y curl wget git nano htop ufw
    print_success "System updated"
}

# Install Docker
install_docker() {
    print_step "Installing Docker..."
    
    if command -v docker &> /dev/null; then
        print_success "Docker already installed"
        return
    fi
    
    # Remove old Docker versions
    apt-get remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true
    
    # Install Docker from official repository
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
    
    # Add current user to docker group
    usermod -aG docker $SUDO_USER 2>/dev/null || true
    
    print_success "Docker installed successfully"
}

# Install Docker Compose
install_docker_compose() {
    print_step "Installing Docker Compose..."
    
    if docker compose version &> /dev/null; then
        print_success "Docker Compose already installed"
        return
    fi
    
    # Docker Compose is included with Docker by default in newer versions
    print_success "Docker Compose available"
}

# Configure firewall
setup_firewall() {
    print_step "Configuring firewall..."
    
    # Enable UFW
    ufw --force enable
    
    # Allow SSH, HTTP, HTTPS
    ufw allow ssh
    ufw allow 80/tcp
    ufw allow 443/tcp
    
    # Allow application port (optional, behind nginx)
    ufw allow 4007/tcp
    
    print_success "Firewall configured"
}

# Install Nginx
install_nginx() {
    print_step "Installing and configuring Nginx..."
    
    apt install -y nginx
    systemctl enable nginx
    systemctl start nginx
    
    # Remove default site
    rm -f /etc/nginx/sites-enabled/default
    
    print_success "Nginx installed"
}

# Install SSL tools
install_ssl_tools() {
    print_step "Installing SSL certificate tools..."
    
    apt install -y snapd
    snap install core; snap refresh core
    snap install --classic certbot
    
    # Create symlink for certbot
    ln -sf /snap/bin/certbot /usr/bin/certbot
    
    print_success "SSL tools installed"
}

# Create application user
create_app_user() {
    print_step "Creating application user..."
    
    if id "$APP_USER" &>/dev/null; then
        print_success "User $APP_USER already exists"
    else
        useradd -r -s /bin/bash -d $APP_DIR $APP_USER
        print_success "User $APP_USER created"
    fi
}

# Create application directory
setup_app_directory() {
    print_step "Setting up application directory..."
    
    mkdir -p $APP_DIR
    chown -R $APP_USER:$APP_USER $APP_DIR
    
    # Create necessary subdirectories
    mkdir -p $APP_DIR/{logs,uploads,db-backup,ssl}
    chown -R 1001:1001 $APP_DIR/logs $APP_DIR/uploads
    
    print_success "Application directory ready"
}

# Deploy application code
deploy_application() {
    print_step "Deploying application code..."
    
    cd $APP_DIR
    
    print_warning "Please upload your application code to $APP_DIR"
    print_warning "You can use: scp -r /path/to/GovtJobsNow/* root@your-vps-ip:$APP_DIR/"
    print_warning "Or clone from git repository"
    
    echo "Press Enter when code is uploaded..."
    read
    
    # Set permissions
    chown -R $APP_USER:$APP_USER $APP_DIR
    chmod +x $APP_DIR/*.sh 2>/dev/null || true
    
    print_success "Application code deployed"
}

# Setup environment file
setup_environment() {
    print_step "Setting up environment configuration..."
    
    if [ ! -f "$APP_DIR/.env" ]; then
        cat > $APP_DIR/.env << 'EOF'
# Database Configuration
DATABASE_URL=postgresql://govtjobs:your_secure_password@localhost:5432/govtjobnow
PGHOST=localhost
PGPORT=5432
PGDATABASE=govtjobnow
PGUSER=govtjobs
PGPASSWORD=your_secure_password

# Application Configuration
NODE_ENV=production
PORT=3000

# Security
SESSION_SECRET=your_super_secure_session_secret_key_here

# Domain Configuration
DOMAIN=your-domain.com
EOF
        
        chown $APP_USER:$APP_USER $APP_DIR/.env
        chmod 600 $APP_DIR/.env
        
        print_warning "IMPORTANT: Edit $APP_DIR/.env with your actual values:"
        print_warning "1. Set secure database password"
        print_warning "2. Set secure session secret"
        print_warning "3. Set your domain name"
        echo "Press Enter when .env is configured..."
        read
    fi
    
    print_success "Environment configured"
}

# Configure domain and SSL
setup_domain_ssl() {
    print_step "Setting up domain and SSL..."
    
    echo "Enter your domain name (e.g., govtjobnow.com): "
    read DOMAIN
    
    if [ -z "$DOMAIN" ]; then
        print_warning "No domain provided, skipping SSL setup"
        return
    fi
    
    # Create Nginx site configuration
    cat > /etc/nginx/sites-available/$DOMAIN << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    # Redirect to HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;
    
    # SSL Configuration (will be added by certbot)
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
    
    # Gzip compression
    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    gzip_comp_level 9;
    
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
    ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
    
    # Test Nginx configuration
    nginx -t
    systemctl reload nginx
    
    print_success "Nginx configured for $DOMAIN"
    
    # Get SSL certificate
    print_step "Getting SSL certificate..."
    certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
    
    print_success "SSL certificate installed"
}

# Build and start application
start_application() {
    print_step "Building and starting application..."
    
    cd $APP_DIR
    
    # Build and start with Docker Compose
    docker compose down 2>/dev/null || true
    docker compose build --no-cache
    docker compose up -d
    
    print_step "Waiting for services to start..."
    sleep 30
    
    # Initialize database
    print_step "Initializing database..."
    docker compose exec -T app npm run db:push || docker compose exec -T app npx drizzle-kit push --force
    
    print_success "Application started"
}

# Verify deployment
verify_deployment() {
    print_step "Verifying deployment..."
    
    # Check Docker services
    echo "Docker services status:"
    docker compose ps
    
    # Test application health
    if curl -f http://localhost:4007/api/stats >/dev/null 2>&1; then
        print_success "Application is responding on port 4007"
    else
        print_warning "Application not responding on port 4007"
    fi
    
    # Test domain (if configured)
    if [ ! -z "$DOMAIN" ]; then
        if curl -f https://$DOMAIN/api/stats >/dev/null 2>&1; then
            print_success "Domain $DOMAIN is working with SSL"
        else
            print_warning "Domain might still be propagating"
        fi
    fi
    
    print_success "Deployment verification completed"
}

# Main deployment function
main() {
    print_step "Starting fresh VPS deployment..."
    
    check_root
    update_system
    install_docker
    install_docker_compose
    setup_firewall
    install_nginx
    install_ssl_tools
    create_app_user
    setup_app_directory
    deploy_application
    setup_environment
    setup_domain_ssl
    start_application
    verify_deployment
    
    echo ""
    echo "🎉 GovtJobsNow Deployment Completed!"
    echo "=================================="
    echo ""
    echo "📱 Admin Dashboard: https://$DOMAIN/admin/login"
    echo "🌐 Main Website: https://$DOMAIN"
    echo "🔧 Application Directory: $APP_DIR"
    echo ""
    echo "📋 Useful Commands:"
    echo "   cd $APP_DIR && docker compose ps"
    echo "   cd $APP_DIR && docker compose logs -f app"
    echo "   cd $APP_DIR && docker compose restart"
    echo "   systemctl status nginx"
    echo "   certbot renew --dry-run"
    echo ""
    echo "🔒 Security Notes:"
    echo "   - Change default passwords in .env file"
    echo "   - Configure regular backups"
    echo "   - Monitor application logs"
    echo "   - Keep system updated"
}

# Run main function
main "$@"