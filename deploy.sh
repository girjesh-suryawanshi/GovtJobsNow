#!/bin/bash

# GovtJobsNow Deployment Script for Hostinger VPS
# This script helps deploy the application step by step

set -e  # Exit on any error

echo "🚀 GovtJobsNow Deployment Script"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️ $1${NC}"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed!"
        echo "Please install Docker first: https://docs.docker.com/engine/install/"
        exit 1
    fi
    print_status "Docker is installed"
}

# Check for port conflicts with existing applications
check_port_conflicts() {
    print_info "Checking for port conflicts..."
    
    # Check if ports 8080 and 8443 are in use (try netstat, fallback to ss)
    PORT_CHECK_CMD="netstat -tulpn"
    if ! command -v netstat &> /dev/null; then
        if command -v ss &> /dev/null; then
            PORT_CHECK_CMD="ss -tulpn"
        else
            print_warning "Neither netstat nor ss available - skipping port check"
            return
        fi
    fi
    
    if $PORT_CHECK_CMD 2>/dev/null | grep -q ":8080 "; then
        print_error "Port 8080 is already in use!"
        print_info "Current processes using port 8080:"
        $PORT_CHECK_CMD | grep ":8080 "
        print_warning "Please stop the service using port 8080 or edit docker-compose.yml to use a different port"
        exit 1
    fi
    
    if $PORT_CHECK_CMD 2>/dev/null | grep -q ":8443 "; then
        print_warning "Port 8443 is already in use - HTTPS will not be available"
        print_info "Current processes using port 8443:"
        $PORT_CHECK_CMD | grep ":8443 "
    fi
    
    # Check if standard web ports are in use (existing web server)
    if $PORT_CHECK_CMD 2>/dev/null | grep -q ":80 "; then
        print_status "Port 80 in use (existing web server detected)"
        print_info "You can integrate GovtJobsNow with your existing web server"
        print_info "See server-integration.conf for integration instructions"
    fi
    
    if $PORT_CHECK_CMD 2>/dev/null | grep -q ":443 "; then
        print_status "Port 443 in use (existing HTTPS server detected)"
    fi
    
    print_status "Port conflict check completed"
}

# Check system resources
check_system_resources() {
    print_info "Checking system resources..."
    
    # Check available memory (need at least 1GB free)
    available_mem=$(free -m | awk 'NR==2{printf "%.0f", $7}')
    if [ "$available_mem" -lt 1024 ]; then
        print_warning "Low available memory: ${available_mem}MB (recommended: 1GB+)"
        print_info "Consider stopping some services or adding swap space"
    else
        print_status "Available memory: ${available_mem}MB"
    fi
    
    # Check disk space (need at least 2GB free)
    available_disk=$(df -BM . | awk 'NR==2 {print $4}' | sed 's/M//')
    if [ "$available_disk" -lt 2048 ]; then
        print_warning "Low disk space: ${available_disk}MB (recommended: 2GB+)"
    else
        print_status "Available disk space: ${available_disk}MB"
    fi
}

# Check if Docker Compose is installed
check_docker_compose() {
    # Check for docker compose (v2 plugin) or docker-compose (v1 legacy)
    if command -v docker &> /dev/null && docker compose version &> /dev/null; then
        COMPOSE_CMD="docker compose"
        print_status "Docker Compose v2 (plugin) is installed"
    elif command -v docker-compose &> /dev/null; then
        COMPOSE_CMD="docker-compose"
        print_status "Docker Compose v1 (legacy) is installed"
    else
        print_error "Docker Compose is not installed!"
        echo "Please install Docker Compose: https://docs.docker.com/compose/install/"
        exit 1
    fi
}

# Check if .env file exists and has required values
check_env_file() {
    if [ ! -f ".env" ]; then
        print_warning ".env file not found!"
        print_info "Copying .env.example to .env"
        cp .env.example .env
        print_error "CRITICAL: Please edit .env file with a STRONG database password before continuing!"
        print_info "1. Generate strong password: openssl rand -base64 32"
        print_info "2. Edit file: nano .env"
        print_info "3. Replace CHANGE_THIS_TO_STRONG_PASSWORD_NOW with your password"
        exit 1
    fi
    
    # Check if default password is still being used
    if grep -q "CHANGE_THIS_TO_STRONG_PASSWORD_NOW" .env; then
        print_error "SECURITY RISK: Default password found in .env file!"
        print_info "Please replace CHANGE_THIS_TO_STRONG_PASSWORD_NOW with a strong password"
        print_info "Generate one with: openssl rand -base64 32"
        exit 1
    fi
    
    print_status ".env file exists and configured"
}

# Create necessary directories
create_directories() {
    print_info "Creating necessary directories..."
    mkdir -p logs
    mkdir -p db-backup
    mkdir -p ssl
    # Ensure logs directory is writable by the app user (uid 1001)
    chmod 755 logs
    print_status "Directories created with proper permissions"
}

# Pull latest images
pull_images() {
    print_info "Pulling latest Docker images..."
    $COMPOSE_CMD pull postgres nginx
    print_status "Images pulled successfully"
}

# Build and start services
start_services() {
    print_info "Building and starting services..."
    $COMPOSE_CMD up -d --build
    print_status "Services started successfully"
}

# Wait for services to be ready
wait_for_services() {
    print_info "Waiting for services to be ready..."
    
    # Wait for database
    echo "Waiting for PostgreSQL to be ready..."
    for i in {1..30}; do
        if $COMPOSE_CMD exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
            break
        fi
        echo -n "."
        sleep 2
    done
    print_status "PostgreSQL is ready"
    
    # Wait for application
    echo "Waiting for application to be ready..."
    for i in {1..30}; do
        if $COMPOSE_CMD exec -T app curl -fsS http://localhost:5000/api/stats > /dev/null 2>&1; then
            break
        fi
        echo -n "."
        sleep 2
    done
    print_status "Application is ready"
}

# Run database migrations
run_migrations() {
    print_info "Running database migrations..."
    $COMPOSE_CMD exec -T app npm run db:push
    print_status "Database migrations completed"
}

# Show service status
show_status() {
    echo ""
    print_info "Service Status:"
    $COMPOSE_CMD ps
    
    echo ""
    print_info "Application URLs:"
    echo "🌐 Main Application: http://your-server-ip:8080"
    echo "🌐 HTTPS (when SSL configured): https://your-server-ip:8443"
    echo "📊 Health Check: http://your-server-ip:8080/health"
    echo ""
    print_info "Integration Options:"
    echo "• Standalone: Access directly via port 8080"
    echo "• With existing web server: See server-integration.conf"
    echo "• Subdomain: Point subdomain to this server on port 8080"
    
    echo ""
    print_info "Useful Commands:"
    echo "📋 View logs: $COMPOSE_CMD logs -f"
    echo "🔄 Restart services: $COMPOSE_CMD restart"
    echo "🛑 Stop services: $COMPOSE_CMD down"
    echo "🔧 Rebuild: $COMPOSE_CMD up -d --build"
}

# Main execution
main() {
    echo "Starting deployment process for multi-app VPS..."
    echo ""
    
    check_docker
    check_docker_compose
    check_port_conflicts
    check_system_resources
    check_env_file
    create_directories
    pull_images
    start_services
    wait_for_services
    run_migrations
    show_status
    
    echo ""
    print_status "🎉 Deployment completed successfully!"
    print_info "Your GovtJobsNow application is now running!"
    
    echo ""
    print_warning "Next Steps:"
    echo "1. Open firewall ports: ufw allow 8080 && ufw allow 8443"
    echo "2. Test application: curl http://localhost:8080"
    echo "3. OPTION A - Standalone Access:"
    echo "   • Access via http://your-server-ip:8080"
    echo "4. OPTION B - Integrate with existing web server:"
    echo "   • Follow instructions in server-integration.conf"
    echo "   • Add location block to existing Nginx/Apache config"
    echo "5. OPTION C - Use subdomain:"
    echo "   • Point subdomain DNS to server IP"
    echo "   • Access via http://subdomain.yourdomain.com:8080"
    echo "6. For SSL/HTTPS:"
    echo "   • Get certificates and place in ssl/ directory"
    echo "   • Update nginx.conf with your domain"
    echo "   • Access via https://your-server-ip:8443"
    echo ""
    print_info "SSL Certificate Setup (Optional):"
    echo "# Stop nginx temporarily"
    echo "$COMPOSE_CMD stop nginx"
    echo "# Install certbot"
    echo "apt install certbot"
    echo "# Get certificate (use port 80 temporarily)"
    echo "certbot certonly --standalone -d your-domain.com"
    echo "# Copy to ssl directory"
    echo "cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ./ssl/cert.pem"
    echo "cp /etc/letsencrypt/live/your-domain.com/privkey.pem ./ssl/key.pem"
    echo "# Restart services"
    echo "$COMPOSE_CMD start nginx"
}

# Handle script arguments
case "${1:-}" in
    "start")
        check_docker_compose
        start_services
        ;;
    "stop")
        check_docker_compose
        $COMPOSE_CMD down
        ;;
    "restart")
        check_docker_compose
        $COMPOSE_CMD restart
        ;;
    "logs")
        check_docker_compose
        $COMPOSE_CMD logs -f
        ;;
    "status")
        show_status
        ;;
    *)
        main
        ;;
esac