# Installation Guide

Complete guide for setting up NeuralDeploy ML Platform on AWS EC2.

## Prerequisites

- AWS Account
- EC2 instance (t3.medium or larger, Ubuntu 22.04)
- Domain name (optional, for SSL)
- SSH key pair

## Option 1: Automated Setup (Recommended)

### Step 1: Launch EC2 Instance

1. Log into AWS Console → EC2 → Launch Instance
2. Choose **Ubuntu Server 22.04 LTS**
3. Instance type: **t3.medium** (2 vCPU, 4GB RAM)
4. Create or select key pair
5. Security Group: Allow SSH (22), HTTP (80), HTTPS (443)
6. Storage: 20GB gp3
7. Launch instance

### Step 2: Connect to Instance

```bash
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@<EC2-PUBLIC-IP>
```

### Step 3: Run Setup Script

```bash
git clone https://github.com/YOUR_USERNAME/ml-platform.git
cd ml-platform
chmod +x deploy/ec2-setup.sh
./deploy/ec2-setup.sh
```

The script installs Node.js, Nginx, PM2, builds the frontend, configures everything, and optionally sets up SSL.

### Step 4: Access Application

Open browser: `http://<EC2-PUBLIC-IP>`

Demo credentials: `demo@example.com` / `demo123`

## Option 2: Manual Setup

### Install Dependencies

```bash
# Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Nginx & PM2
sudo apt install -y nginx
sudo npm install -g pm2
```

### Build & Deploy Frontend

```bash
cd /home/ubuntu/ml-platform
npm install
npm run build
sudo mkdir -p /var/www/ml-platform
sudo cp -r dist/* /var/www/ml-platform/
```

### Start Backend

```bash
cd backend && npm install && cd ..
pm2 start deploy/pm2.config.js
pm2 save && pm2 startup
```

### Configure Nginx

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/ml-platform
sudo ln -s /etc/nginx/sites-available/ml-platform /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

### Firewall

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

### SSL (Optional)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Verification

```bash
sudo systemctl status nginx    # Nginx running
pm2 status                     # Backend running
curl http://localhost           # Frontend serves HTML
curl http://localhost/api/health # Backend returns JSON
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Frontend not loading | `sudo systemctl status nginx` and check `/var/log/nginx/error.log` |
| Backend not responding | `pm2 logs ml-backend` |
| Port blocked | `sudo ufw status` - ensure Nginx Full is allowed |
| Cannot SSH | Check Security Group allows port 22 |

## Updating

```bash
cd /home/ubuntu/ml-platform
git pull origin main
npm install && npm run build
sudo cp -r dist/* /var/www/ml-platform/
cd backend && npm install && cd ..
pm2 restart ml-backend
```

## Cost Estimate

- EC2 t3.medium: ~$30/month (on-demand)
- Data transfer: First 100GB/month free
- **Total: ~$30-50/month**
