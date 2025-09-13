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

# Check if Docker Compose is installed
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed!"
        echo "Please install Docker Compose first"
        exit 1
    fi
    print_status "Docker Compose is installed"
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
    docker-compose pull postgres nginx
    print_status "Images pulled successfully"
}

# Build and start services
start_services() {
    print_info "Building and starting services..."
    docker-compose up -d --build
    print_status "Services started successfully"
}

# Wait for services to be ready
wait_for_services() {
    print_info "Waiting for services to be ready..."
    
    # Wait for database
    echo "Waiting for PostgreSQL to be ready..."
    for i in {1..30}; do
        if docker-compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
            break
        fi
        echo -n "."
        sleep 2
    done
    print_status "PostgreSQL is ready"
    
    # Wait for application
    echo "Waiting for application to be ready..."
    for i in {1..30}; do
        if docker-compose exec -T app curl -fsS http://localhost:5000/api/stats > /dev/null 2>&1; then
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
    docker-compose exec -T app npm run db:push
    print_status "Database migrations completed"
}

# Show service status
show_status() {
    echo ""
    print_info "Service Status:"
    docker-compose ps
    
    echo ""
    print_info "Application URLs:"
    echo "🌐 Main Application: http://your-domain.com (via Nginx)"
    echo "📊 Health Check: http://your-domain.com/health"
    echo "⚠️  Note: App only accessible through Nginx (ports 80/443) for security"
    
    echo ""
    print_info "Useful Commands:"
    echo "📋 View logs: docker-compose logs -f"
    echo "🔄 Restart services: docker-compose restart"
    echo "🛑 Stop services: docker-compose down"
    echo "🔧 Rebuild: docker-compose up -d --build"
}

# Main execution
main() {
    echo "Starting deployment process..."
    echo ""
    
    check_docker
    check_docker_compose
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
    echo "1. Configure your domain DNS to point to this server"
    echo "2. Update nginx.conf with your actual domain name"
    echo "3. Get SSL certificates (Let's Encrypt recommended)"
    echo "4. Set up SSL certificates in the ssl/ directory"
    echo "5. Enable HTTPS in nginx.conf"
    echo "6. Restart nginx: docker-compose restart nginx"
    echo "7. Set up firewall: ufw allow 80,443 && ufw enable"
    echo ""
    print_info "SSL Certificate Setup:"
    echo "# Install certbot"
    echo "apt install certbot"
    echo "# Get certificate"
    echo "certbot certonly --standalone -d your-domain.com"
    echo "# Copy to ssl directory"
    echo "cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ./ssl/cert.pem"
    echo "cp /etc/letsencrypt/live/your-domain.com/privkey.pem ./ssl/key.pem"
}

# Handle script arguments
case "${1:-}" in
    "start")
        start_services
        ;;
    "stop")
        docker-compose down
        ;;
    "restart")
        docker-compose restart
        ;;
    "logs")
        docker-compose logs -f
        ;;
    "status")
        show_status
        ;;
    *)
        main
        ;;
esac