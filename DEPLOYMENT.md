# GovtJobsNow Production Deployment Guide

## Overview
This guide covers deploying GovtJobsNow to your Hostinger VPS with Docker and the custom domain `govtjobnow.com`.

## Prerequisites

### System Requirements
- Ubuntu/Debian VPS with at least 2GB RAM
- Docker and Docker Compose installed
- Nginx installed on the host system
- Domain `govtjobnow.com` pointing to your VPS IP
- SSL certificate (we'll set up Let's Encrypt)

### Pre-deployment Setup

1. **Update system packages**:
```bash
sudo apt update && sudo apt upgrade -y
```

2. **Install Docker** (if not installed):
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

3. **Install Docker Compose** (if not installed):
```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

## Deployment Steps

### Step 1: Clone and Prepare Application

```bash
# Clone your repository
cd /opt
sudo git clone YOUR_REPOSITORY_URL govtjobsnow
sudo chown -R $USER:$USER govtjobsnow
cd govtjobsnow
```

### Step 2: Environment Configuration

Create `.env.production` file:
```bash
cp .env.production.example .env.production
nano .env.production
```

Required environment variables:
```env
NODE_ENV=production
PORT=3000
BASE_URL=https://govtjobnow.com
DATABASE_URL=postgresql://postgres:YOUR_STRONG_PASSWORD@postgres:5432/govtjobsnow
PGHOST=postgres
PGPORT=5432
PGUSER=postgres
PGPASSWORD=YOUR_STRONG_PASSWORD
PGDATABASE=govtjobsnow
SESSION_SECRET=YOUR_32_CHAR_SECRET_KEY
POSTGRES_PASSWORD=YOUR_STRONG_PASSWORD
```

### Step 3: Deploy with Docker

```bash
# Make deploy script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

The deployment script will:
- Check prerequisites
- Create necessary directories
- Build and start containers
- Run database migrations
- Display status

### Step 4: Configure Nginx Reverse Proxy

1. **Copy Nginx configuration**:
```bash
sudo cp nginx-govtjobnow.conf /etc/nginx/sites-available/govtjobnow.com
```

2. **Enable the site**:
```bash
sudo ln -s /etc/nginx/sites-available/govtjobnow.com /etc/nginx/sites-enabled/
```

3. **Add rate limiting to main Nginx config**:
```bash
sudo nano /etc/nginx/nginx.conf
```

Add inside the `http` block:
```nginx
# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

# File upload limits
client_max_body_size 10M;
```

4. **Test and reload Nginx**:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Step 5: SSL Certificate with Let's Encrypt

1. **Install Certbot**:
```bash
sudo apt install certbot python3-certbot-nginx -y
```

2. **Obtain SSL certificate**:
```bash
sudo certbot --nginx -d govtjobnow.com -d www.govtjobnow.com
```

3. **Verify auto-renewal**:
```bash
sudo certbot renew --dry-run
```

### Step 6: DNS Configuration

Point your domain to the VPS:
```
A Record: govtjobnow.com → YOUR_VPS_IP
A Record: www.govtjobnow.com → YOUR_VPS_IP
```

## Post-Deployment

### Verify Deployment
1. Check containers: `docker-compose ps`
2. View logs: `docker-compose logs -f`
3. Test website: `https://govtjobnow.com`
4. Test API: `https://govtjobnow.com/api/stats`

### Monitoring and Maintenance

#### Container Management
```bash
# View status
docker-compose ps

# View logs
docker-compose logs -f app
docker-compose logs -f postgres

# Restart services
docker-compose restart app

# Stop all services
docker-compose down

# Update and rebuild
git pull
docker-compose down
docker-compose up -d --build
```

#### Database Management
```bash
# Database backup
docker-compose exec postgres pg_dump -U postgres govtjobsnow > backup_$(date +%Y%m%d).sql

# Restore database
docker-compose exec -T postgres psql -U postgres govtjobsnow < backup_file.sql

# Run migrations
docker-compose exec app npx drizzle-kit push
```

#### Log Management
```bash
# View application logs
docker-compose logs -f app

# Clean up old logs
docker system prune -f

# Rotate logs (add to crontab)
0 2 * * 0 docker-compose exec app find /app/logs -name "*.log" -mtime +7 -delete
```

## Security Considerations

1. **Firewall Configuration**:
```bash
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

2. **Regular Updates**:
- Keep Docker images updated
- Update system packages monthly
- Monitor security logs

3. **Backup Strategy**:
- Daily database backups
- Weekly full application backups
- Store backups off-site

## Troubleshooting

### Common Issues

1. **Port Conflicts**: 
   - Check if port 4007 is available: `sudo netstat -tulpn | grep 4007`
   - Change port in docker-compose.yml if needed

2. **Database Connection Issues**:
   - Check postgres container: `docker-compose logs postgres`
   - Verify DATABASE_URL format

3. **Nginx 502 Errors**:
   - Check app container: `docker-compose logs app`
   - Verify app is listening on port 3000

4. **SSL Issues**:
   - Check certificate: `sudo certbot certificates`
   - Renew if needed: `sudo certbot renew`

### Useful Commands

```bash
# Check disk space
df -h

# Monitor resources
docker stats

# Check nginx status  
sudo systemctl status nginx

# Check SSL certificate
openssl s_client -connect govtjobnow.com:443 -servername govtjobnow.com
```

## Performance Optimization

1. **Enable Nginx caching**
2. **Configure Gzip compression** (already in config)
3. **Set up CDN** for static assets
4. **Database optimization**:
   - Regular VACUUM ANALYZE
   - Monitor query performance
   - Index optimization

## Support

For deployment issues:
1. Check logs: `docker-compose logs`
2. Verify configuration files
3. Check system resources: `free -h` and `df -h`
4. Review firewall settings: `sudo ufw status`

Remember to keep your environment variables secure and never commit them to version control!