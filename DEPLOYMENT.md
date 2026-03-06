# Deployment Guide for Transparent Politics

This guide covers building the application **locally on your machine** and deploying it to an Ubuntu server on AWS with the domain `www.transparentpolitics.us`.

**Key Strategy:** Build the frontend on your local machine (fast), then transfer only the built files to the server (no need to build on server).

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Part A: Local Build Process](#part-a-local-build-process)
3. [Part B: AWS Server Setup](#part-b-aws-server-setup)
4. [Part C: Deploy to Server](#part-c-deploy-to-server)
5. [Part D: Configure Services](#part-d-configure-services)
6. [Verification & Testing](#verification--testing)
7. [Updating the Application](#updating-the-application)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

**On Your Local Machine:**

- Node.js 18.x or higher
- npm package manager
- SSH client (Terminal on Mac/Linux, PowerShell/PuTTY on Windows)

**For AWS:**

- AWS Account
- Domain `transparentpolitics.us` registered and configured

---

# Part A: Local Build Process

## Step 1: Build Frontend Locally

### 1.1 Navigate to Frontend Directory

```bash
cd /Users/aakritidhakal/Documents/Projects/transparentPolitics/frontend
```

### 1.2 Create Production Environment File

Create `frontend/.env.production`:

```bash
nano .env.production
```

Add this content:

```env
REACT_APP_API_URL=https://www.transparentpolitics.us/api/v1
```

Save and exit (Ctrl+X, Y, Enter).

### 1.3 Install Dependencies (if not already done)

```bash
npm install
```

### 1.4 Build the Application

```bash
npm run build
```

**Expected output:** A `build` folder will be created containing:

- `index.html`
- `static/` folder with CSS, JS, and media files
- `asset-manifest.json`
- `manifest.json`

**Build time on local machine:** 2-5 minutes (much faster than building on server!)

### 1.5 Verify Build

```bash
ls -lh build/
du -sh build/
```

You should see the build folder is around 1-5 MB in total size.

**✓ Local build complete!** You now have production-ready static files.

---

# Part B: AWS Server Setup

## Step 2: Launch EC2 Instance

### 2.1 Create EC2 Instance

1. Log in to AWS Console → EC2
2. Click **Launch Instance**
3. Configure:
   - **Name:** `transparent-politics-server`
   - **OS:** Ubuntu Server 22.04 LTS (64-bit x86)
   - **Instance Type:** `t2.small` (recommended) or `t2.medium`
   - **Key Pair:** Create new or use existing
     - Name: `transparent-politics-key`
     - Type: RSA
     - Format: `.pem`
     - **Download and save securely**

### 2.2 Configure Security Group

Add these **Inbound Rules**:

| Type  | Protocol | Port | Source    | Description        |
| ----- | -------- | ---- | --------- | ------------------ |
| SSH   | TCP      | 22   | Your IP   | SSH access         |
| HTTP  | TCP      | 80   | 0.0.0.0/0 | Web traffic        |
| HTTPS | TCP      | 443  | 0.0.0.0/0 | Secure web traffic |

4. Click **Launch Instance**

### 2.3 Allocate Elastic IP

1. Go to **Elastic IPs** in EC2 console
2. Click **Allocate Elastic IP address**
3. Click **Associate Elastic IP address**
4. Select your instance
5. **Note the Elastic IP** - you'll need it for DNS and SSH

**Example:** `54.123.45.67`

---

## Step 3: Configure Domain DNS

Go to your domain registrar (GoDaddy, Namecheap, etc.) and add these DNS records:

| Type | Name | Value             | TTL |
| ---- | ---- | ----------------- | --- |
| A    | @    | [Your Elastic IP] | 600 |
| A    | www  | [Your Elastic IP] | 600 |

**DNS Propagation:** Wait 15-30 minutes (can take up to 24 hours).

Verify with:

```bash
nslookup www.transparentpolitics.us
```

---

## Step 4: Initial Server Setup

### 4.1 Connect to Server

```bash
chmod 400 transparent-politics-key.pem
ssh -i transparent-politics-key.pem ubuntu@[YOUR_ELASTIC_IP]
```

Replace `[YOUR_ELASTIC_IP]` with your actual IP.

### 4.2 Update System

```bash
sudo apt update
sudo apt upgrade -y
```

### 4.3 Install Required Software

```bash
# Install Python 3.11
sudo apt install -y python3.11 python3.11-venv python3-pip

# Install Nginx (web server)
sudo apt install -y nginx

# Install other utilities
sudo apt install -y git curl ufw

# Verify installations
python3.11 --version
nginx -v
```

### 4.4 Configure Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
sudo ufw status
```

### 4.5 Create Application Directory

```bash
sudo mkdir -p /var/www/transparentpolitics
sudo chown -R ubuntu:ubuntu /var/www/transparentpolitics
cd /var/www/transparentpolitics
```

---

# Part C: Deploy to Server

## Step 5: Transfer Built Files

You can use FileZilla (GUI) or command-line tools to transfer files. Choose the method you prefer.

### Method A: Using FileZilla (Recommended for beginners)

#### 5.1 Install FileZilla

Download from: https://filezilla-project.org/download.php?type=client

#### 5.2 Configure SFTP Connection

1. Open FileZilla
2. Go to **File → Site Manager** (or press Ctrl+S / Cmd+S)
3. Click **New Site** button
4. Configure the connection:
   - **Protocol:** SFTP - SSH File Transfer Protocol
   - **Host:** [YOUR_ELASTIC_IP] (e.g., 54.123.45.67)
   - **Port:** 22
   - **Logon Type:** Key file
   - **User:** ubuntu
   - **Key file:** Browse and select your `transparent-politics-key.pem` file
5. Click **Connect**

**Note:** If FileZilla asks to convert the `.pem` file to `.ppk` format, click Yes and save it.

#### 5.3 Transfer Frontend Build Files

Once connected:

**Left side (Local):** Navigate to:

```
/Users/aakritidhakal/Documents/Projects/transparentPolitics/frontend/
```

**Right side (Remote):** Navigate to:

```
/var/www/transparentpolitics/
```

**Transfer steps:**

1. On the left side, find the `build` folder inside `frontend/`
2. Right-click on the `build` folder
3. Select **Upload** or drag it to the right side
4. Wait for the transfer to complete
5. On the right side, rename `build` to `frontend-build` (right-click → Rename)

#### 5.4 Transfer Backend Files

**Left side (Local):** Navigate to:

```
/Users/aakritidhakal/Documents/Projects/transparentPolitics/
```

**Right side (Remote):** Should still be at:

```
/var/www/transparentpolitics/
```

**Transfer steps:**

1. On the left side, find the `backend` folder
2. Right-click on the `backend` folder
3. Select **Upload** or drag it to the right side
4. Wait for the transfer to complete

**✓ Files transferred!** Now switch back to your SSH session.

---

### Method B: Using Command Line (SCP)

If you prefer command-line tools, use these commands from your local machine.

#### Navigate to Project Root

```bash
cd /Users/aakritidhakal/Documents/Projects/transparentPolitics
```

#### Transfer Frontend Build Files

```bash
# Transfer the built frontend
scp -i transparent-politics-key.pem -r frontend/build ubuntu@[YOUR_ELASTIC_IP]:/var/www/transparentpolitics/frontend-build
```

**Example:**

```bash
scp -i transparent-politics-key.pem -r frontend/build ubuntu@54.123.45.67:/var/www/transparentpolitics/frontend-build
```

#### Transfer Backend Files

```bash
# Transfer backend (excluding virtual environment and cache)
scp -i transparent-politics-key.pem -r backend ubuntu@[YOUR_ELASTIC_IP]:/var/www/transparentpolitics/
```

**Alternative using rsync (better for updates):**

```bash
rsync -avz -e "ssh -i transparent-politics-key.pem" \
  --exclude='__pycache__' --exclude='.env' --exclude='*.pyc' \
  backend/ ubuntu@[YOUR_ELASTIC_IP]:/var/www/transparentpolitics/backend/
```

**✓ Files transferred!**

---

## Step 6: Setup Backend on Server

Return to your **SSH session** (server terminal).

### 6.1 Navigate to Backend

```bash
cd /var/www/transparentpolitics/backend
```

### 6.2 Create Python Virtual Environment

```bash
python3.11 -m venv venv
source venv/bin/activate
```

You should see `(venv)` in your prompt.

### 6.3 Install Python Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 6.4 Create Backend Environment File

```bash
nano .env
```

Add:

```env
# API Configuration
API_PORT=8000

# CORS Configuration
FRONTEND_URL=https://www.transparentpolitics.us
```

Save and exit (Ctrl+X, Y, Enter).

### 6.5 Test Backend

```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Open another terminal and SSH in again, then test:

```bash
curl http://127.0.0.1:8000/health
```

You should see a response like `{"status":"healthy"}`.

Press Ctrl+C in the first terminal to stop the test server.

### 6.6 Create Systemd Service for Backend

```bash
sudo nano /etc/systemd/system/transparentpolitics-api.service
```

Paste this content:

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
ExecStart=/var/www/transparentpolitics/backend/venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000 --workers 2
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Save and exit.

### 6.7 Start Backend Service

```bash
sudo systemctl daemon-reload
sudo systemctl enable transparentpolitics-api
sudo systemctl start transparentpolitics-api
sudo systemctl status transparentpolitics-api
```

You should see "active (running)" in green.

To exit the status view, press `q`.

---

# Part D: Configure Services

## Step 7: Configure Nginx

### 7.1 Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/transparentpolitics
```

Paste this configuration:

```nginx
# Redirect HTTP to HTTPS (after SSL setup)
server {
    listen 80;
    listen [::]:80;
    server_name transparentpolitics.us www.transparentpolitics.us;

    # For Let's Encrypt certificate validation
    location /.well-known/acme-challenge/ {
        root /var/www/transparentpolitics/frontend-build;
    }

    # Temporarily serve the site (will redirect to HTTPS after SSL setup)
    root /var/www/transparentpolitics/frontend-build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

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
}
```

Save and exit.

### 7.2 Enable the Configuration

```bash
# Remove default configuration
sudo rm /etc/nginx/sites-enabled/default

# Enable our configuration
sudo ln -s /etc/nginx/sites-available/transparentpolitics /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t
```

You should see "test is successful".

### 7.3 Start Nginx

```bash
sudo systemctl restart nginx
sudo systemctl status nginx
```

---

## Step 8: Setup SSL Certificate

### 8.1 Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 8.2 Obtain SSL Certificate

```bash
sudo certbot --nginx -d transparentpolitics.us -d www.transparentpolitics.us
```

Follow the prompts:

1. Enter your email address
2. Agree to terms (Y)
3. Choose whether to share email with EFF (your choice)
4. Certbot will automatically configure HTTPS redirect

### 8.3 Verify SSL

Visit: `https://www.transparentpolitics.us`

Your site should now load with HTTPS!

### 8.4 Test Auto-Renewal

```bash
sudo certbot renew --dry-run
```

This verifies that auto-renewal is configured (happens automatically every 90 days).

---

# Verification & Testing

## Check All Services

```bash
# Check backend
sudo systemctl status transparentpolitics-api

# Check Nginx
sudo systemctl status nginx

# Check backend API
curl https://www.transparentpolitics.us/api/v1/health

# Check frontend
curl -I https://www.transparentpolitics.us
```

## View Logs

```bash
# Backend logs
sudo journalctl -u transparentpolitics-api -f

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

Press Ctrl+C to stop following logs.

---

# Updating the Application

## Quick Update Process

When you make changes and need to deploy:

### 1. Build Locally (on your machine)

```bash
cd /Users/aakritidhakal/Documents/Projects/transparentPolitics/frontend
npm run build
```

### 2. Deploy Updated Files

#### Option A: Using FileZilla

1. Open FileZilla and connect to your server (use saved site from Site Manager)
2. **Update Frontend:**

   - **Left side:** Navigate to `/Users/aakritidhakal/Documents/Projects/transparentPolitics/frontend/`
   - **Right side:** Navigate to `/var/www/transparentpolitics/`
   - Upload the `build` folder (it will overwrite files in `frontend-build`)
   - Or delete `frontend-build` on the server first, then upload `build` and rename it

3. **Update Backend (if needed):**

   - **Left side:** Navigate to `/Users/aakritidhakal/Documents/Projects/transparentPolitics/`
   - **Right side:** Navigate to `/var/www/transparentpolitics/`
   - Upload the `backend` folder (select "Overwrite" when prompted)

4. **Restart Services via SSH:**

   ```bash
   ssh -i transparent-politics-key.pem ubuntu@[YOUR_ELASTIC_IP]

   # Reload Nginx (for frontend changes)
   sudo systemctl reload nginx

   # Restart backend (if backend changed)
   cd /var/www/transparentpolitics/backend
   source venv/bin/activate
   pip install -r requirements.txt  # If dependencies changed
   sudo systemctl restart transparentpolitics-api
   ```

#### Option B: Using Command Line

```bash
# Transfer new build
scp -i transparent-politics-key.pem -r frontend/build ubuntu@[YOUR_ELASTIC_IP]:/var/www/transparentpolitics/frontend-build-new

# SSH into server
ssh -i transparent-politics-key.pem ubuntu@[YOUR_ELASTIC_IP]

# Replace old build with new build
cd /var/www/transparentpolitics
rm -rf frontend-build-old
mv frontend-build frontend-build-old
mv frontend-build-new frontend-build

# Reload Nginx
sudo systemctl reload nginx
```

### 3. Update Backend (Command Line Method)

```bash
# From local machine
rsync -avz -e "ssh -i transparent-politics-key.pem" \
  --exclude='__pycache__' --exclude='.env' --exclude='*.pyc' \
  backend/ ubuntu@[YOUR_ELASTIC_IP]:/var/www/transparentpolitics/backend/

# On server
ssh -i transparent-politics-key.pem ubuntu@[YOUR_ELASTIC_IP]
cd /var/www/transparentpolitics/backend
source venv/bin/activate
pip install -r requirements.txt  # If dependencies changed
sudo systemctl restart transparentpolitics-api
```

---

# Troubleshooting

## Backend Not Working

```bash
# Check service status
sudo systemctl status transparentpolitics-api

# View logs
sudo journalctl -u transparentpolitics-api -n 50

# Restart service
sudo systemctl restart transparentpolitics-api

# Check if port 8000 is in use
sudo ss -tlnp | grep 8000
```

## Frontend Not Loading

```bash
# Check if build files exist
ls -la /var/www/transparentpolitics/frontend-build/

# Check Nginx status
sudo systemctl status nginx

# Check Nginx config
sudo nginx -t

# View error logs
sudo tail -n 50 /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

## API Calls Failing

Check the API URL in your frontend build:

```bash
# On your local machine before building
cat frontend/.env.production
```

Should be: `REACT_APP_API_URL=https://www.transparentpolitics.us/api/v1`

If wrong, fix it and rebuild:

```bash
npm run build
# Then redeploy as described above
```

## SSL Certificate Issues

```bash
# Check certificate
sudo certbot certificates

# Renew manually
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

## DNS Not Resolving

```bash
# Check DNS
nslookup www.transparentpolitics.us
dig www.transparentpolitics.us

# Check from different location
# Visit: https://www.whatsmydns.net/
```

---

## Common Commands Reference

### FileZilla Quick Setup

**Connection Settings:**

- Protocol: SFTP
- Host: [YOUR_ELASTIC_IP]
- Port: 22
- User: ubuntu
- Key file: transparent-politics-key.pem

**Important Paths:**

- Local frontend build: `/Users/aakritidhakal/Documents/Projects/transparentPolitics/frontend/build`
- Remote location: `/var/www/transparentpolitics/frontend-build`
- Remote backend: `/var/www/transparentpolitics/backend`

### Command Line Reference

```bash
# === File Transfer ===
# SCP (secure copy)
scp -i key.pem -r local/path ubuntu@IP:/remote/path

# rsync (better for updates)
rsync -avz -e "ssh -i key.pem" local/ ubuntu@IP:/remote/

# === Service Management ===
sudo systemctl start transparentpolitics-api
sudo systemctl stop transparentpolitics-api
sudo systemctl restart transparentpolitics-api
sudo systemctl status transparentpolitics-api

# === Nginx ===
sudo nginx -t                    # Test config
sudo systemctl reload nginx      # Reload config
sudo systemctl restart nginx     # Full restart

# === Logs ===
sudo journalctl -u transparentpolitics-api -f
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# === System ===
df -h          # Disk usage
free -h        # Memory usage
htop           # Process monitor
```

---

## Security Checklist

- [x] Firewall (UFW) enabled
- [x] SSH key-based authentication
- [x] SSL certificate installed
- [x] Backend only accessible from localhost
- [x] Regular security updates: `sudo apt update && sudo apt upgrade`

---

## Support Resources

- **FastAPI:** https://fastapi.tiangolo.com/
- **Nginx:** https://nginx.org/en/docs/
- **Let's Encrypt:** https://letsencrypt.org/
- **AWS EC2:** https://docs.aws.amazon.com/ec2/

---

## Notes

- Always replace `[YOUR_ELASTIC_IP]` with your actual Elastic IP address
- Store your SSH key securely (never commit to version control)
- The key file path is: `transparent-politics-key.pem`
- Build locally to save time and server resources
- Backend runs on localhost:8000 (not exposed to internet)
- Frontend is served as static files by Nginx
- All traffic goes through Nginx on ports 80/443

### Deployment Process

Part 1: Build Frontend Locally

cd /Users/aakritidhakal/Documents/Projects/transparentPolitics/f
rontend  
 npm run build

---

Part 2: FileZilla Transfer

Open FileZilla & Connect

- Protocol: SFTP
- Host: 34.199.100.225
- Port: 22
- User: ubuntu
- Key file:  
  /Users/aakritidhakal/Documents/Projects/transparent-politics.pem

Transfer Frontend

Local (Left): /Users/aakritidhakal/Documents/Projects/transparen
tPolitics/frontend/  
 Server (Right): /var/www/transparentpolitics/

1. Delete frontend-build-new on server (if exists)
2. Upload build folder
3. Rename uploaded build to frontend-build-new  


Transfer Backend (Optional - only if backend changed)

Local (Left): /Users/aakritidhakal/Documents/Projects/transparen
tPolitics/backend/  
 Server (Right): /var/www/transparentpolitics/backend/

Upload these folders/files:

- app/ folder
- data/ folder
- scripts/ folder
- requirements.txt  


Don't upload: venv/, **pycache**/, .env

---

Part 3: SSH Deployment Commands

ssh -i  
 /Users/aakritidhakal/Documents/Projects/transparent-politics.pem
ubuntu@34.199.100.225

Deploy Frontend

cd /var/www/transparentpolitics  
 rm -rf frontend-build-old  
 mv frontend-build frontend-build-old  
 mv frontend-build-new frontend-build

Update Backend (if backend files changed)

cd /var/www/transparentpolitics/backend  
 source venv/bin/activate  
 pip install -r requirements.txt

Restart Services

sudo systemctl restart transparentpolitics-api  
 sudo systemctl reload nginx

Verify

sudo systemctl status transparentpolitics-api  
 sudo systemctl status nginx

---

Part 4: Database Setup (One-time or when data changes)

cd /var/www/transparentpolitics/backend  
 source venv/bin/activate

# Create tables

rm politics.db  
 python -c "from app.database import engine, Base; from  
 app.db_models import \*; Base.metadata.create_all(bind=engine)"

# Load data

python scripts/load_sample_data.py

# Restart

sudo systemctl restart transparentpolitics-api  
 exit

---
