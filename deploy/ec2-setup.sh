#!/bin/bash
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}ML Platform - EC2 Setup Script${NC}"
echo -e "${GREEN}========================================${NC}"

if [[ $EUID -eq 0 ]]; then
   echo -e "${RED}This script should not be run as root${NC}"
   exit 1
fi

read -p "Enter your domain name (press Enter to skip): " DOMAIN

# Update system
echo -e "${YELLOW}Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
echo -e "${YELLOW}Installing Node.js 20.x...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
echo -e "${GREEN}Node.js installed: $(node --version)${NC}"

# Install Nginx
echo -e "${YELLOW}Installing Nginx...${NC}"
sudo apt install -y nginx

# Install PM2
echo -e "${YELLOW}Installing PM2...${NC}"
sudo npm install -g pm2

# Install Git if not present
if ! command -v git &> /dev/null; then
    echo -e "${YELLOW}Installing Git...${NC}"
    sudo apt install -y git
fi

# Clone repository
echo -e "${YELLOW}Setting up application...${NC}"
cd /home/ubuntu
if [ -d "ml-platform-frontend" ]; then
    echo -e "${YELLOW}Repository already exists, pulling latest...${NC}"
    cd ml-platform-frontend
    git pull origin main
else
    git clone https://github.com/Abhiram-Rakesh/ml-platform-frontend.git
    cd ml-platform-frontend
fi

# Setup Frontend
echo -e "${YELLOW}Building frontend...${NC}"
npm install
npm run build

# Deploy frontend
echo -e "${YELLOW}Deploying frontend...${NC}"
sudo mkdir -p /var/www/ml-platform
sudo cp -r dist/* /var/www/ml-platform/
sudo chown -R www-data:www-data /var/www/ml-platform

# Setup Backend
echo -e "${YELLOW}Setting up backend...${NC}"
cd backend
npm install
cd ..

# Create log directory
mkdir -p /home/ubuntu/logs

# Start backend with PM2
echo -e "${YELLOW}Starting backend with PM2...${NC}"
pm2 delete ml-backend 2>/dev/null || true
pm2 start deploy/pm2.config.cjs
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu | tail -n 1 | sudo bash 2>/dev/null || true

# Configure Nginx
echo -e "${YELLOW}Configuring Nginx...${NC}"
sudo cp deploy/nginx.conf /etc/nginx/sites-available/ml-platform
sudo ln -sf /etc/nginx/sites-available/ml-platform /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
sudo systemctl enable nginx

# Configure firewall
echo -e "${YELLOW}Configuring firewall...${NC}"
sudo ufw --force enable
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH

# Setup SSL if domain provided
if [ -n "$DOMAIN" ]; then
    echo -e "${YELLOW}Setting up SSL for $DOMAIN...${NC}"
    sudo apt install -y certbot python3-certbot-nginx
    sudo certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --email "admin@$DOMAIN"
fi

# Get public IP
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo "YOUR_IP")

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Installation Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Frontend: http://$PUBLIC_IP${NC}"
if [ -n "$DOMAIN" ]; then
    echo -e "${GREEN}Domain: https://$DOMAIN${NC}"
fi
echo -e "${GREEN}Backend API: http://$PUBLIC_IP/api/health${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo -e "1. Open browser: http://$PUBLIC_IP"
echo -e "2. Check PM2 status: pm2 status"
echo -e "3. View logs: pm2 logs ml-backend"
echo -e "${GREEN}========================================${NC}"
