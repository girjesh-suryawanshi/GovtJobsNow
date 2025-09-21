#!/bin/bash

# GovtJobsNow VPS Update Script
# Run this script to deploy your latest changes to production

set -e

echo "🚀 GovtJobsNow VPS Update Script"
echo "================================"

# Configuration - CHANGE THESE VALUES
VPS_IP="YOUR_VPS_IP_HERE"        # Replace with your actual VPS IP
VPS_USER="root"                   # Your VPS username
VPS_PATH="/opt/govtjobnow"       # Path where your app is installed

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() { echo -e "${GREEN}✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️ $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }

# Check if VPS_IP is configured
if [ "$VPS_IP" = "YOUR_VPS_IP_HERE" ]; then
    print_error "Please configure VPS_IP in this script first!"
    echo "Edit vps-update.sh and replace YOUR_VPS_IP_HERE with your actual VPS IP address"
    exit 1
fi

# Test VPS connection
print_status "Testing VPS connection..."
if ! ssh -o ConnectTimeout=10 "$VPS_USER@$VPS_IP" "echo 'Connection successful'" >/dev/null 2>&1; then
    print_error "Cannot connect to VPS!"
    echo "Make sure SSH keys are set up and VPS is accessible"
    exit 1
fi

# Create deployment package
print_status "Creating deployment package..."
tar --exclude=node_modules \
    --exclude=.git \
    --exclude=dist \
    --exclude=logs \
    --exclude=uploads \
    --exclude=db-backup \
    --exclude='*.tar.gz' \
    -czf govtjobnow-latest.tar.gz .

# Upload to VPS
print_status "Uploading files to VPS..."
scp govtjobnow-latest.tar.gz "$VPS_USER@$VPS_IP:/tmp/"

# Deploy on VPS
print_status "Deploying on VPS..."
ssh "$VPS_USER@$VPS_IP" << 'EOF'
set -e

echo "📦 Extracting files..."
cd /opt/govtjobnow
tar -xzf /tmp/govtjobnow-latest.tar.gz
rm /tmp/govtjobnow-latest.tar.gz

echo "🔧 Setting permissions..."
chown -R 1001:1001 logs uploads 2>/dev/null || true
chmod +x deploy.sh

echo "🛑 Stopping services..."
docker compose down

echo "🏗️ Rebuilding application..."
docker compose build --no-cache app

echo "🚀 Starting services..."
docker compose up -d

echo "⏳ Waiting for services..."
sleep 20

echo "🗄️ Initializing database..."
docker compose exec -T app npm run db:push || docker compose exec -T app npx drizzle-kit push --force

echo "✅ Checking application health..."
for i in {1..10}; do
    if docker compose exec -T app curl -f http://localhost:3000/api/stats >/dev/null 2>&1; then
        echo "✅ Application is healthy!"
        break
    fi
    echo "Waiting... ($i/10)"
    sleep 5
done

echo "📊 Service status:"
docker compose ps

echo "🎉 Update completed successfully!"
EOF

# Cleanup
rm govtjobnow-latest.tar.gz

# Final test
print_status "Testing deployment..."
sleep 5
if curl -s "https://govtjobnow.com/api/stats" >/dev/null 2>&1; then
    print_status "✅ Website is responding at https://govtjobnow.com"
elif curl -s "http://$VPS_IP/api/stats" >/dev/null 2>&1; then
    print_status "✅ Website is responding at http://$VPS_IP"
else
    print_warning "⚠️ Website might still be starting. Check in a few minutes."
fi

echo ""
print_status "🎉 VPS update completed!"
echo "📱 Admin Dashboard: https://govtjobnow.com/admin/login"
echo "🖥️ Main Website: https://govtjobnow.com"
echo ""
echo "To check logs: ssh $VPS_USER@$VPS_IP 'cd $VPS_PATH && docker compose logs -f'"