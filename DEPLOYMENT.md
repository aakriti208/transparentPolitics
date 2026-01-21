# Deployment Guide for Transparent Politics

This guide covers deploying the Transparent Politics application to an Ubuntu server on AWS with the domain `www.transparentpolitics.us`.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [AWS EC2 Setup](#aws-ec2-setup)
3. [Domain Configuration](#domain-configuration)
4. [Server Initial Setup](#server-initial-setup)
5. [File Transfer via SSH](#file-transfer-via-ssh)
6. [Backend Deployment](#backend-deployment)
7. [Frontend Deployment](#frontend-deployment)
8. [Nginx Configuration](#nginx-configuration)
9. [SSL Certificate Setup](#ssl-certificate-setup)
10. [Final Steps](#final-steps)

---

## Prerequisites

- AWS Account
- Domain name: `transparentpolitics.us` registered and ready to configure
- SSH client installed on your local machine
- Basic knowledge of Linux commands

---

## AWS EC2 Setup

### 1. Launch EC2 Instance

1. Log in to AWS Console and navigate to EC2
2. Click "Launch Instance"
3. Configure the instance:
   - **Name**: `transparent-politics-server`
   - **OS**: Ubuntu Server 22.04 LTS (64-bit)
   - **Instance Type**: t2.medium (or t2.small for testing)
   - **Key Pair**: Create new key pair or use existing
     - Name: `transparent-politics-key`
     - Type: RSA
     - Format: .pem
     - Download and save securely
   - **Network Settings**:
     - Allow SSH (port 22) from your IP
     - Allow HTTP (port 80) from anywhere
     - Allow HTTPS (port 443) from anywhere
   - **Storage**: 20-30 GB gp3
4. Launch the instance

### 2. Configure Security Group

Ensure the following inbound rules are set:
```
Type            Protocol    Port Range    Source
SSH             TCP         22            Your IP/0.0.0.0/0
HTTP            TCP         80            0.0.0.0/0
HTTPS           TCP         443           0.0.0.0/0
Custom TCP      TCP         8000          127.0.0.1/32 (backend - localhost only)
```

### 3. Allocate Elastic IP

1. Go to "Elastic IPs" in EC2 console
2. Click "Allocate Elastic IP address"
3. Associate it with your EC2 instance
4. Note the IP address for DNS configuration

---

## Domain Configuration

### Configure DNS Records

Add the following DNS records in your domain registrar (e.g., GoDaddy, Namecheap):

```
Type    Name    Value                       TTL
A       @       [Your Elastic IP]           600
A       www     [Your Elastic IP]           600
```

Wait for DNS propagation (can take 5 minutes to 48 hours, typically 15-30 minutes).

Verify with: `nslookup www.transparentpolitics.us`

---

## Server Initial Setup

### 1. Connect to Server

```bash
chmod 400 transparent-politics-key.pem
ssh -i transparent-politics-key.pem ubuntu@[ELASTIC_IP]
```

### 2. Update System

```bash
sudo apt update
sudo apt upgrade -y
```

### 3. Install Required Software

```bash
# Install Python 3.11
sudo apt install -y python3.11 python3.11-venv python3-pip

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx
sudo apt install -y nginx

# Install other utilities
sudo apt install -y git curl ufw
```

### 4. Configure Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 5. Create Application Directory

```bash
sudo mkdir -p /var/www/transparentpolitics
sudo chown -R ubuntu:ubuntu /var/www/transparentpolitics
```

---

## File Transfer via SSH

### Method 1: SCP (Secure Copy)

From your local machine (in the project directory):

```bash
# Transfer backend
scp -i transparent-politics-key.pem -r backend ubuntu@[ELASTIC_IP]:/var/www/transparentpolitics/

# Transfer frontend
scp -i transparent-politics-key.pem -r frontend ubuntu@[ELASTIC_IP]:/var/www/transparentpolitics/

# Transfer specific files
scp -i transparent-politics-key.pem README.md ubuntu@[ELASTIC_IP]:/var/www/transparentpolitics/
```

### Method 2: SFTP (Interactive)

```bash
sftp -i transparent-politics-key.pem ubuntu@[ELASTIC_IP]
# Then use SFTP commands:
cd /var/www/transparentpolitics
put -r backend
put -r frontend
exit
```

### Method 3: rsync (Recommended for updates)

```bash
# Sync backend
rsync -avz -e "ssh -i transparent-politics-key.pem" \
  --exclude='venv' --exclude='__pycache__' --exclude='.env' \
  backend/ ubuntu@[ELASTIC_IP]:/var/www/transparentpolitics/backend/

# Sync frontend
rsync -avz -e "ssh -i transparent-politics-key.pem" \
  --exclude='node_modules' --exclude='build' --exclude='.env' \
  frontend/ ubuntu@[ELASTIC_IP]:/var/www/transparentpolitics/frontend/
```

---

## Backend Deployment

### 1. SSH into Server

```bash
ssh -i transparent-politics-key.pem ubuntu@[ELASTIC_IP]
cd /var/www/transparentpolitics/backend
```

### 2. Create Virtual Environment

```bash
python3.11 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Configure Environment

```bash
nano .env
```

Add the following:
```env
# API Configuration
API_PORT=8000

# CORS Configuration
FRONTEND_URL=https://www.transparentpolitics.us
```

### 5. Test Backend

```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Test in another terminal:
```bash
curl http://127.0.0.1:8000/health
```

Press Ctrl+C to stop.

### 6. Create Systemd Service

```bash
sudo nano /etc/systemd/system/transparentpolitics-api.service
```

Add:
```ini
[Unit]
Description=Transparent Politics FastAPI Application
After=network.target

[Service]
Type=simple
User=ubuntu
Group=ubuntu
WorkingDirectory=/var/www/transparentpolitics/backend
Environment="PATH=/var/www/transparentpolitics/backend/venv/bin"
ExecStart=/var/www/transparentpolitics/backend/venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000 --workers 4
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### 7. Start Backend Service

```bash
sudo systemctl daemon-reload
sudo systemctl enable transparentpolitics-api
sudo systemctl start transparentpolitics-api
sudo systemctl status transparentpolitics-api
```

### 8. Check Logs

```bash
sudo journalctl -u transparentpolitics-api -f
```

---

## Frontend Deployment

### 1. Build Frontend

On the server:

```bash
cd /var/www/transparentpolitics/frontend
```

### 2. Configure Environment

```bash
nano .env
```

Add:
```env
REACT_APP_API_URL=https://www.transparentpolitics.us/api/v1
```

### 3. Install Dependencies and Build

```bash
npm install
npm run build
```

This creates a `build` directory with production-ready static files.

### 4. Verify Build

```bash
ls -la build/
```

You should see `index.html`, `static/`, etc.

---

## Nginx Configuration

### 1. Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/transparentpolitics
```

Add:
```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name transparentpolitics.us www.transparentpolitics.us;

    # For Let's Encrypt certificate validation
    location /.well-known/acme-challenge/ {
        root /var/www/transparentpolitics/frontend/build;
    }

    # Redirect all other traffic to HTTPS
    location / {
        return 301 https://www.transparentpolitics.us$request_uri;
    }
}

# HTTPS Configuration (will be updated after SSL setup)
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name transparentpolitics.us www.transparentpolitics.us;

    # SSL certificates (will be added by Certbot)
    # ssl_certificate /etc/letsencrypt/live/www.transparentpolitics.us/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/www.transparentpolitics.us/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;

    # Root directory for React build
    root /var/www/transparentpolitics/frontend/build;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files caching
    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # React Router support - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Favicon
    location = /favicon.ico {
        log_not_found off;
        access_log off;
    }

    # Robots.txt
    location = /robots.txt {
        log_not_found off;
        access_log off;
    }
}
```

### 2. Enable Configuration

```bash
sudo ln -s /etc/nginx/sites-available/transparentpolitics /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # Remove default config
```

### 3. Test Nginx Configuration

```bash
sudo nginx -t
```

### 4. Restart Nginx

```bash
sudo systemctl restart nginx
sudo systemctl status nginx
```

---

## SSL Certificate Setup

### 1. Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 2. Obtain SSL Certificate

```bash
sudo certbot --nginx -d transparentpolitics.us -d www.transparentpolitics.us
```

Follow the prompts:
- Enter email address
- Agree to terms of service
- Choose whether to redirect HTTP to HTTPS (recommended: Yes)

### 3. Verify SSL

Visit: `https://www.transparentpolitics.us`

### 4. Auto-renewal Setup

Certbot automatically sets up auto-renewal. Test it:

```bash
sudo certbot renew --dry-run
```

---

## Final Steps

### 1. Verify Deployment

Test the following:

```bash
# Health check
curl https://www.transparentpolitics.us/api/v1/health

# Frontend
curl https://www.transparentpolitics.us

# Check services
sudo systemctl status transparentpolitics-api
sudo systemctl status nginx
```

### 2. Monitor Logs

```bash
# Backend logs
sudo journalctl -u transparentpolitics-api -f

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### 3. Set Up Log Rotation

Create log rotation config:

```bash
sudo nano /etc/logrotate.d/transparentpolitics
```

Add:
```
/var/www/transparentpolitics/backend/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 ubuntu ubuntu
    sharedscripts
}
```

### 4. Create Deployment Script

For easy updates, create a deployment script:

```bash
nano /var/www/transparentpolitics/deploy.sh
```

Add:
```bash
#!/bin/bash
set -e

echo "Starting deployment..."

# Update backend
cd /var/www/transparentpolitics/backend
source venv/bin/activate
git pull  # If using git
pip install -r requirements.txt
sudo systemctl restart transparentpolitics-api

# Update frontend
cd /var/www/transparentpolitics/frontend
npm install
npm run build
sudo systemctl reload nginx

echo "Deployment completed successfully!"
```

Make executable:
```bash
chmod +x /var/www/transparentpolitics/deploy.sh
```

---

## Updating the Application

### From Local Machine (Using rsync)

```bash
# Sync backend
rsync -avz -e "ssh -i transparent-politics-key.pem" \
  --exclude='venv' --exclude='__pycache__' --exclude='.env' \
  backend/ ubuntu@[ELASTIC_IP]:/var/www/transparentpolitics/backend/

# Sync frontend
rsync -avz -e "ssh -i transparent-politics-key.pem" \
  --exclude='node_modules' --exclude='build' --exclude='.env' \
  frontend/ ubuntu@[ELASTIC_IP]:/var/www/transparentpolitics/frontend/
```

### On Server

```bash
ssh -i transparent-politics-key.pem ubuntu@[ELASTIC_IP]
cd /var/www/transparentpolitics

# Restart backend
cd backend
source venv/bin/activate
pip install -r requirements.txt  # If dependencies changed
sudo systemctl restart transparentpolitics-api

# Rebuild frontend
cd ../frontend
npm install  # If dependencies changed
npm run build
sudo systemctl reload nginx
```

---

## Troubleshooting

### Backend Issues

```bash
# Check if service is running
sudo systemctl status transparentpolitics-api

# View recent logs
sudo journalctl -u transparentpolitics-api -n 100

# Restart service
sudo systemctl restart transparentpolitics-api

# Check if port 8000 is in use
sudo netstat -tlnp | grep 8000
```

### Frontend Issues

```bash
# Check Nginx status
sudo systemctl status nginx

# Test Nginx configuration
sudo nginx -t

# Check Nginx error logs
sudo tail -n 50 /var/log/nginx/error.log

# Reload Nginx
sudo systemctl reload nginx
```

### SSL Issues

```bash
# Check certificate status
sudo certbot certificates

# Renew certificate manually
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

### DNS Issues

```bash
# Check DNS propagation
nslookup www.transparentpolitics.us
dig www.transparentpolitics.us

# Check from external service
# Visit: https://www.whatsmydns.net/
```

---

## Security Checklist

- [ ] Firewall (UFW) is enabled and configured
- [ ] SSH key-based authentication is used (not password)
- [ ] SSL certificate is installed and auto-renews
- [ ] Backend runs on localhost only (not exposed to internet)
- [ ] Security headers are configured in Nginx
- [ ] Regular system updates are scheduled
- [ ] Logs are monitored and rotated
- [ ] Environment variables are properly secured
- [ ] CORS is properly configured in backend

---

## Maintenance Tasks

### Weekly
- Check application logs for errors
- Verify SSL certificate status

### Monthly
- Update system packages: `sudo apt update && sudo apt upgrade`
- Review security updates
- Check disk space: `df -h`

### Quarterly
- Review and update dependencies
- Check for security vulnerabilities
- Backup application data

---

## Useful Commands

```bash
# System info
uname -a
df -h  # Disk usage
free -h  # Memory usage
htop  # Process monitor

# Service management
sudo systemctl start transparentpolitics-api
sudo systemctl stop transparentpolitics-api
sudo systemctl restart transparentpolitics-api
sudo systemctl status transparentpolitics-api

# Nginx
sudo nginx -t  # Test config
sudo systemctl reload nginx  # Reload config
sudo systemctl restart nginx  # Full restart

# Logs
sudo journalctl -u transparentpolitics-api -f  # Follow backend logs
sudo tail -f /var/log/nginx/access.log  # Follow Nginx access
sudo tail -f /var/log/nginx/error.log  # Follow Nginx errors

# File transfer
scp -i transparent-politics-key.pem file.txt ubuntu@[IP]:/path/
rsync -avz -e "ssh -i key.pem" local/ ubuntu@[IP]:/remote/
```

---

## Support and Documentation

- FastAPI Documentation: https://fastapi.tiangolo.com/
- Nginx Documentation: https://nginx.org/en/docs/
- Let's Encrypt: https://letsencrypt.org/docs/
- AWS EC2 Documentation: https://docs.aws.amazon.com/ec2/

---

## Notes

- Replace `[ELASTIC_IP]` with your actual Elastic IP address throughout this guide
- Store your SSH key securely and never commit it to version control
- Regularly backup your data and configuration files
- Monitor your AWS costs and set up billing alerts
- Consider setting up CloudWatch for advanced monitoring
