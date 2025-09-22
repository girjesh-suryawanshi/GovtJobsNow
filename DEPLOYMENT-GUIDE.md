# GovtJobsNow Fresh VPS Deployment Guide

Complete step-by-step guide to deploy GovtJobsNow on a new VPS hosting provider.

## 📋 Prerequisites

- Fresh VPS with Ubuntu 20.04+ or Debian 11+
- Domain name pointing to your VPS IP
- SSH access to VPS (as root or sudo user)
- Basic command line knowledge

## 🚀 Deployment Steps

### Step 1: Prepare Your Local Files

1. **Download deployment files** from your Replit project:
   ```bash
   # Download these files from your project:
   - fresh-vps-deploy.sh (main deployment script)
   - docker-compose.yml (container configuration)
   - Dockerfile (application build)
   - env.template (environment template)
   - setup-database.sql (database setup)
   - nginx-govtjobnow.conf (web server config)
   ```

2. **Prepare application code**:
   ```bash
   # Create a deployment package
   tar -czf govtjobnow-app.tar.gz \
     --exclude=node_modules \
     --exclude=.git \
     --exclude=dist \
     --exclude=logs \
     --exclude=uploads \
     --exclude=db-backup \
     client/ server/ shared/ package.json drizzle.config.ts vite.config.ts tailwind.config.ts
   ```

### Step 2: Initial VPS Setup

1. **Connect to your VPS**:
   ```bash
   ssh root@YOUR_VPS_IP
   ```

2. **Upload deployment script**:
   ```bash
   # From your local machine:
   scp fresh-vps-deploy.sh root@YOUR_VPS_IP:/root/
   ```

3. **Make script executable and run**:
   ```bash
   # On VPS:
   chmod +x fresh-vps-deploy.sh
   ./fresh-vps-deploy.sh
   ```

### Step 3: Follow the Automated Setup

The deployment script will guide you through:

1. ✅ System updates and security setup
2. ✅ Docker and Docker Compose installation  
3. ✅ Nginx web server installation
4. ✅ SSL certificate tools setup
5. ✅ Application directory creation
6. ✅ Firewall configuration

### Step 4: Upload Your Application Code

When prompted by the script:

1. **Upload application files**:
   ```bash
   # From your local machine:
   scp govtjobnow-app.tar.gz root@YOUR_VPS_IP:/opt/govtjobnow/
   
   # On VPS, extract files:
   cd /opt/govtjobnow
   tar -xzf govtjobnow-app.tar.gz
   rm govtjobnow-app.tar.gz
   ```

2. **Upload Docker configuration**:
   ```bash
   # From local machine:
   scp docker-compose.yml Dockerfile root@YOUR_VPS_IP:/opt/govtjobnow/
   ```

### Step 5: Configure Environment

1. **Set up environment file**:
   ```bash
   # On VPS:
   cd /opt/govtjobnow
   cp env.template .env
   nano .env
   ```

2. **Update these values in .env**:
   ```bash
   # Generate secure password:
   openssl rand -base64 32
   
   # Update .env file:
   DATABASE_URL=postgresql://govtjobs:YOUR_SECURE_PASSWORD@localhost:5432/govtjobnow
   POSTGRES_PASSWORD=YOUR_SECURE_PASSWORD
   PGPASSWORD=YOUR_SECURE_PASSWORD
   SESSION_SECRET=YOUR_SUPER_SECURE_SESSION_SECRET
   DOMAIN=your-domain.com
   BASE_URL=https://your-domain.com
   ```

### Step 6: Domain and SSL Setup

When prompted by the script:

1. **Enter your domain name** (e.g., govtjobnow.com)
2. **Wait for SSL certificate** to be automatically installed
3. **Verify DNS** is pointing to your VPS IP

### Step 7: Application Startup

The script will automatically:

1. ✅ Build Docker containers
2. ✅ Start PostgreSQL database
3. ✅ Initialize database tables
4. ✅ Start the application
5. ✅ Configure Nginx proxy
6. ✅ Test the deployment

## 🔍 Verification

After deployment completes:

1. **Check services**:
   ```bash
   cd /opt/govtjobnow
   docker compose ps
   ```

2. **Test website**:
   - Main site: https://your-domain.com
   - Admin panel: https://your-domain.com/admin/login
   - API health: https://your-domain.com/api/stats

3. **View logs**:
   ```bash
   # Application logs
   docker compose logs -f app
   
   # Database logs  
   docker compose logs -f postgres
   
   # Nginx logs
   tail -f /var/log/nginx/govtjobnow_access.log
   ```

## 🔧 Post-Deployment Setup

### Create First Admin User

1. **Access admin registration** (first time only):
   - Go to: https://your-domain.com/admin/login
   - Create your first admin account

2. **Or create via database** (if needed):
   ```bash
   # Connect to database
   docker compose exec -T postgres psql -U postgres -d govtjobnow
   
   # Create admin user (replace with your details)
   INSERT INTO admin_users (username, email, password, role) 
   VALUES ('admin', 'your@email.com', '$2a$10$encrypted_password', 'admin');
   ```

### Configure Regular Backups

1. **Database backup script**:
   ```bash
   # Create backup script
   cat > /opt/govtjobnow/backup.sh << 'EOF'
   #!/bin/bash
   cd /opt/govtjobnow
   docker compose exec -T postgres pg_dump -U postgres govtjobnow > db-backup/backup-$(date +%Y%m%d-%H%M%S).sql
   find db-backup/ -name "backup-*.sql" -mtime +7 -delete
   EOF
   
   chmod +x /opt/govtjobnow/backup.sh
   
   # Add to crontab for daily backups
   echo "0 2 * * * /opt/govtjobnow/backup.sh" | crontab -
   ```

### Monitor and Maintain

1. **System monitoring**:
   ```bash
   # Check disk space
   df -h
   
   # Check memory usage
   free -h
   
   # Check Docker resource usage
   docker stats
   ```

2. **Keep system updated**:
   ```bash
   # Update system packages
   apt update && apt upgrade -y
   
   # Update Docker images
   cd /opt/govtjobnow
   docker compose pull
   docker compose up -d --build
   ```

## 🆘 Troubleshooting

### Database Issues

```bash
# Reset database if needed
cd /opt/govtjobnow
docker compose down
docker volume rm govtjobnow_postgres_data
docker compose up -d
sleep 20
docker compose exec -T app npm run db:push --force
```

### Application Not Starting

```bash
# Check logs
docker compose logs -f app

# Restart services
docker compose restart

# Rebuild containers
docker compose down
docker compose build --no-cache
docker compose up -d
```

### SSL Certificate Issues

```bash
# Renew certificate manually
certbot renew --force-renewal

# Check certificate status
certbot certificates
```

### Domain Not Working

1. Verify DNS points to your VPS IP
2. Check Nginx configuration:
   ```bash
   nginx -t
   systemctl reload nginx
   ```
3. Check firewall:
   ```bash
   ufw status
   ```

## 🎯 Success Indicators

✅ **Your deployment is successful when:**

- Website loads at https://your-domain.com
- Admin panel accessible at https://your-domain.com/admin/login
- SSL certificate shows as valid
- All Docker services running
- Database tables created
- API responding correctly

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review application logs: `docker compose logs -f`
3. Verify all environment variables are set correctly
4. Ensure domain DNS is properly configured

Your GovtJobsNow application is now ready for production use! 🎉