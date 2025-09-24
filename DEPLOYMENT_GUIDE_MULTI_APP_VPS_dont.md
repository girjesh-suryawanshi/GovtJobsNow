# GovtJobsNow Deployment Guide for Multi-Application VPS

This guide helps you deploy GovtJobsNow on a VPS that already has other applications running.

## 🔍 Pre-Deployment Check

Before starting, let's check what's already running:

```bash
# Check running services
sudo netstat -tulpn | grep LISTEN

# Check memory usage
free -h

# Check disk space
df -h

# Check Docker networks (if Docker is already used)
docker network ls
```

## 🚀 Quick Start

1. **Clone and enter project directory:**
   ```bash
   cd /var/www/
   git clone <your-repo> govtjobsnow
   cd govtjobsnow
   ```

2. **Run the automated deployment:**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

The script will automatically:
- ✅ Check for port conflicts
- ✅ Verify system resources
- ✅ Use safe ports (8080, 8443)
- ✅ Create isolated Docker network
- ✅ Deploy without disrupting existing apps

## 🔧 Port Configuration

**Our Application Uses:**
- `8080` - Main HTTP access
- `8443` - HTTPS access (when SSL enabled)
- `5433` - PostgreSQL (if external access needed)

**Doesn't Conflict With:**
- `80/443` - Your existing web server
- `3000/3001` - Node.js apps  
- `8000` - Python apps
- `5432` - Existing PostgreSQL

## 🌐 Access Options

### Option 1: Direct Access
- URL: `http://your-server-ip:8080`
- Simple, works immediately
- Good for testing and development

### Option 2: Integrate with Existing Web Server

#### For Existing Nginx:
Add to your existing server block:
```nginx
location /jobs/ {
    rewrite ^/jobs/(.*)$ /$1 break;
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

#### For Existing Apache:
Add to your VirtualHost:
```apache
ProxyPreserveHost On
ProxyPass /jobs/ http://127.0.0.1:8080/
ProxyPassReverse /jobs/ http://127.0.0.1:8080/
```

### Option 3: Subdomain
- Point `jobs.yourdomain.com` to your server IP
- Access via: `http://jobs.yourdomain.com:8080`

## 🔒 Security & Firewall

**Open only necessary ports:**
```bash
# For direct access
ufw allow 8080
ufw allow 8443

# Don't open these (they're handled internally)
# ufw allow 5432  # PostgreSQL
# ufw allow 5000  # App server
```

## 🚨 Troubleshooting Common Issues

### Port Already in Use
```bash
# Check what's using the port
sudo lsof -i :8080

# If you need to use different ports, edit docker-compose.yml:
# Change "8080:80" to "8081:80" (or any available port)
```

### Low Memory
```bash
# Check memory usage
free -h

# Add swap space if needed
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### Docker Network Conflicts
```bash
# List existing networks
docker network ls

# Our app uses subnet 172.25.0.0/16
# If it conflicts, edit docker-compose.yml and change the subnet
```

## 📊 Monitoring & Management

**Check application status:**
```bash
# Use docker compose (v2) or docker-compose (v1) depending on your system
docker compose ps          # or: docker-compose ps
docker compose logs -f     # or: docker-compose logs -f
```

**Application URLs:**
- Main app: `http://your-server-ip:8080`
- Health check: `http://your-server-ip:8080/health`
- Admin panel: `http://your-server-ip:8080/admin`

**Database management:**
```bash
# Access database
docker compose exec postgres psql -U postgres -d govtjobsnow

# Backup database
docker compose exec postgres pg_dump -U postgres govtjobsnow > backup.sql
```

## 🔄 Updates & Maintenance

**Update application:**
```bash
git pull
docker compose up -d --build
```

**Restart services:**
```bash
docker compose restart
```

**Stop application (doesn't affect other apps):**
```bash
docker compose down
```

## 💡 Best Practices for Multi-App VPS

1. **Resource Allocation**: Monitor CPU and memory usage
2. **Logs Management**: Regular log rotation to save space
3. **Backup Strategy**: Backup database and important files
4. **SSL Certificates**: Share certificates between apps when possible
5. **Monitoring**: Set up alerts for resource usage
6. **Updates**: Update during low-traffic periods

## 📞 Support

If you encounter issues:
1. Check logs: `docker-compose logs app`
2. Verify ports: `netstat -tulpn | grep 8080`
3. Check resources: `free -h && df -h`
4. Test database: `docker compose exec postgres pg_isready`

The application is designed to coexist peacefully with your existing applications! 🤝