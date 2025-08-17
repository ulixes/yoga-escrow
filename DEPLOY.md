# Yoga Escrow Platform Deployment Guide

This guide provides complete instructions for deploying the Yoga Escrow platform to staging and production environments.

## 🏗️ Architecture Overview

The platform consists of three main components:
- **Student App**: React frontend for students to book yoga classes (Port 5174)
- **Teacher App**: React frontend for teachers to manage classes (Port 5173) 
- **API Service**: Node.js backend for Instagram scraping and data processing (Port 3002 staging / 3001 production)

## 📋 Prerequisites

### Server Requirements
- Ubuntu 22.04+ LTS
- 2GB+ RAM
- 20GB+ disk space
- Root access or sudo privileges

### Software Dependencies
- Node.js 22.17.1+ (via nvm)
- Bun 1.2.19+
- Nginx 1.26.0+
- Certbot (for SSL)
- Git

### Environment Setup
1. **Install Node.js via nvm:**
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   source ~/.bashrc
   nvm install 22.17.1
   nvm use 22.17.1
   ```

2. **Install Bun:**
   ```bash
   curl -fsSL https://bun.sh/install | bash
   source ~/.bashrc
   ```

3. **Install Nginx and Certbot:**
   ```bash
   sudo apt update
   sudo apt install -y nginx certbot python3-certbot-nginx
   ```

## 🚀 Deployment Steps

### 1. Clone and Setup Repository
```bash
cd /root/dev3/ulyx
git clone <repository-url> yoga-escrow
cd yoga-escrow
bun install
```

### 2. Environment Configuration

#### Staging Environment Files

**Student App** (`apps/student/.env.staging`):
```env
# Staging Environment
VITE_APIFY_TOKEN=<your-api-token>
VITE_PRIVY_APP_ID=<your-privy-app-id>
VITE_PRIVY_CLIENT_ID=<your-privy-client-id>

# Network Configuration (baseSepolia testnet)
VITE_NETWORK=baseSepolia
VITE_ESCROW_ADDRESS=0x9711d952dD0C47891eEE92Dd1aB920FD1517321f
VITE_CHAIN_ID=84532

# API Configuration
VITE_API_BASE_URL=https://stage.api.ulyxes.xyz

# External API Endpoints
VITE_ETH_PRICE_API=https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd
VITE_GAS_PRICE_API=https://api.etherscan.io/api?module=gastracker&action=gasoracle
```

**Teacher App** (`apps/teacher/.env.staging`):
```env
# Staging Environment
VITE_APIFY_TOKEN=<your-api-token>
VITE_PRIVY_APP_ID=<your-teacher-privy-app-id>
VITE_PRIVY_CLIENT_ID=<your-teacher-privy-client-id>

# Network Configuration (baseSepolia testnet)
VITE_NETWORK=baseSepolia
VITE_ESCROW_ADDRESS=0x9711d952dD0C47891eEE92Dd1aB920FD1517321f
VITE_CHAIN_ID=84532

# External API Endpoints
VITE_ETH_PRICE_API=https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd
VITE_GAS_PRICE_API=https://api.etherscan.io/api?module=gastracker&action=gasoracle
```

**API Service** (`apps/api/.env.staging`):
```env
# API Configuration
APIFY_TOKEN=<your-api-token>
PORT=3002
```

#### Production Environment Files

**Student App** (`apps/student/.env.production`):
```env
# Production Environment
VITE_NETWORK=base
VITE_ESCROW_ADDRESS=0x756cf904B2dFFe5008e82DFB34B9B7f081A5cF33
VITE_CHAIN_ID=8453

# Privy Configuration
VITE_PRIVY_APP_ID=<your-prod-privy-app-id>
VITE_PRIVY_CLIENT_ID=<your-prod-privy-client-id>

# API Configuration
VITE_API_BASE_URL=https://api.ulyxes.xyz

# External API Endpoints
VITE_ETH_PRICE_API=https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd
VITE_GAS_PRICE_API=https://api.etherscan.io/api?module=gastracker&action=gasoracle
```

**Teacher App** (`apps/teacher/.env.production`):
```env
# Production Environment
VITE_NETWORK=base
VITE_ESCROW_ADDRESS=0x756cf904B2dFFe5008e82DFB34B9B7f081A5cF33
VITE_CHAIN_ID=8453

# Privy Configuration
VITE_PRIVY_APP_ID=<your-teacher-prod-privy-app-id>
VITE_PRIVY_CLIENT_ID=<your-teacher-prod-privy-client-id>

# External API Endpoints
VITE_ETH_PRICE_API=https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd
VITE_GAS_PRICE_API=https://api.etherscan.io/api?module=gastracker&action=gasoracle
```

**API Service** (`apps/api/.env.production`):
```env
# Production Configuration
APIFY_TOKEN=<your-api-token>
PORT=3001
```

### Important: CORS Configuration

The API service includes CORS configuration that allows requests from:
- `http://localhost:5173` (local teacher app)
- `http://localhost:5174` (local student app) 
- `http://localhost:5175` (alternative local port)
- `https://stage.ulyxes.xyz` (staging student app)
- `https://stage.yogie.ulyxes.xyz` (staging teacher app)
- `https://ulyxes.xyz` (production student app)
- `https://yogie.ulyxes.xyz` (production teacher app)

If deploying to different domains, update the CORS origins in `apps/api/src/index.ts`.

### 3. Build Applications

```bash
# Build all applications for staging
bun --filter @yoga/student build --mode staging
bun --filter @yoga/teacher build --mode staging
bun --filter @yoga-escrow/api build

# Or for production
bun --filter @yoga/student build --mode production
bun --filter @yoga/teacher build --mode production
bun --filter @yoga-escrow/api build
```

### 4. Create Systemd Services

#### Student App Service (`/etc/systemd/system/yoga-student-staging.service`):
```ini
[Unit]
Description=Yoga Escrow Student App (Staging)
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/dev3/ulyx/yoga-escrow
Environment=NODE_ENV=production
ExecStart=/root/.nvm/versions/node/v22.17.1/bin/bun --filter @yoga/student preview --port 5174 --host --mode staging
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal
SyslogIdentifier=yoga-student-staging

[Install]
WantedBy=multi-user.target
```

#### Teacher App Service (`/etc/systemd/system/yoga-teacher-staging.service`):
```ini
[Unit]
Description=Yoga Escrow Teacher App (Staging)
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/dev3/ulyx/yoga-escrow
Environment=NODE_ENV=production
ExecStart=/root/.nvm/versions/node/v22.17.1/bin/bun --filter @yoga/teacher preview --port 5173 --host --mode staging
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal
SyslogIdentifier=yoga-teacher-staging

[Install]
WantedBy=multi-user.target
```

#### API Service (`/etc/systemd/system/yoga-api-staging.service`):
```ini
[Unit]
Description=Yoga Escrow API Service (Staging)
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/dev3/ulyx/yoga-escrow/apps/api
Environment=NODE_ENV=production
Environment=APIFY_TOKEN=<your-api-token>
Environment=PORT=3002
ExecStart=/root/.nvm/versions/node/v22.17.1/bin/node dist/index.js
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal
SyslogIdentifier=yoga-api-staging

[Install]
WantedBy=multi-user.target
```

**Enable and start services:**
```bash
sudo systemctl daemon-reload
sudo systemctl enable yoga-student-staging yoga-teacher-staging yoga-api-staging
sudo systemctl start yoga-student-staging yoga-teacher-staging yoga-api-staging
```

### 5. Configure Nginx

#### Student App (`/etc/nginx/sites-available/stage.ulyxes.xyz`):
```nginx
server {
    listen 80;
    server_name stage.ulyxes.xyz;
    
    location / {
        proxy_pass http://localhost:5174;
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

#### Teacher App (`/etc/nginx/sites-available/stage.yogie.ulyxes.xyz`):
```nginx
server {
    listen 80;
    server_name stage.yogie.ulyxes.xyz;
    
    location / {
        proxy_pass http://localhost:5173;
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

#### API Service (`/etc/nginx/sites-available/stage.api.ulyxes.xyz`):
```nginx
server {
    listen 80;
    server_name stage.api.ulyxes.xyz;
    
    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_Set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Enable sites:**
```bash
sudo ln -sf /etc/nginx/sites-available/stage.ulyxes.xyz /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/stage.yogie.ulyxes.xyz /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/stage.api.ulyxes.xyz /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. Configure SSL Certificates

```bash
sudo certbot --nginx -d stage.ulyxes.xyz -d stage.yogie.ulyxes.xyz -d stage.api.ulyxes.xyz --non-interactive --agree-tos --email noreply@ulyxes.xyz
```

### 7. Update Vite Configuration

Update `vite.config.ts` files to allow staging domains:

**Student App** (`apps/student/vite.config.ts`):
```typescript
export default defineConfig({
  plugins: [react()],
  server: { 
    port: 5174,
    headers: {
      'Content-Security-Policy': "frame-ancestors 'self' https://www.yoga.ulyxes.xyz https://yoga.ulyxes.xyz http://localhost:5174 http://localhost:5175 https://auth.privy.io"
    }
  },
  preview: {
    allowedHosts: ['stage.ulyxes.xyz', 'localhost']
  },
  optimizeDeps: {
    include: ['buffer']
  }
})
```

**Teacher App** (`apps/teacher/vite.config.ts`):
```typescript
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  preview: {
    allowedHosts: ['stage.yogie.ulyxes.xyz', 'localhost']
  },
})
```

## 🌐 DNS Configuration

Add these A records to your DNS:

### Staging
- `stage.ulyxes.xyz` → Server IP
- `stage.yogie.ulyxes.xyz` → Server IP  
- `stage.api.ulyxes.xyz` → Server IP

### Production
- `ulyxes.xyz` → Server IP
- `yogie.ulyxes.xyz` → Server IP
- `api.ulyxes.xyz` → Server IP

## 📊 Monitoring and Maintenance

### Service Status
```bash
# Check all services
sudo systemctl status yoga-student-staging yoga-teacher-staging yoga-api-staging

# View logs
sudo journalctl -u yoga-student-staging -f
sudo journalctl -u yoga-teacher-staging -f
sudo journalctl -u yoga-api-staging -f
```

### Deployment Updates
```bash
# Pull latest changes
cd /root/dev3/ulyx/yoga-escrow
git pull

# Install dependencies
bun install

# Rebuild applications
bun --filter @yoga/student build --mode staging
bun --filter @yoga/teacher build --mode staging
bun --filter @yoga-escrow/api build

# Restart services
sudo systemctl restart yoga-student-staging yoga-teacher-staging yoga-api-staging
```

### SSL Certificate Renewal
SSL certificates auto-renew via Certbot. Check renewal:
```bash
sudo certbot renew --dry-run
```

## 🔧 Production Deployment

For production deployment, follow the same steps but:

1. Use `.env.production` files instead of `.env.staging`
2. Change service names to `yoga-*-production`
3. Update ports: Student (5174), Teacher (5173), API (3001)
4. Use production domains without "stage." prefix
5. Update nginx configurations with production domains
6. Build with `--mode production` flag

## 🚨 Troubleshooting

### Common Issues

**Service won't start:**
```bash
# Check service status and logs
sudo systemctl status yoga-student-staging
sudo journalctl -u yoga-student-staging --no-pager -n 20

# Common fixes
sudo systemctl daemon-reload
sudo systemctl restart yoga-student-staging
```

**Port conflicts:**
```bash
# Check what's using ports
sudo ss -tulpn | grep -E ":517[34]|:300[12]"

# Kill conflicting processes
sudo pkill -f "port.*5174"
```

**SSL issues:**
```bash
# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx

# Renew certificates
sudo certbot renew
```

**Environment variable issues:**
- Ensure `.env.staging` or `.env.production` files exist
- Rebuild applications after changing environment files
- Restart services after rebuilding

### Health Checks

**Test endpoints:**
```bash
# Frontend apps
curl -I https://stage.ulyxes.xyz
curl -I https://stage.yogie.ulyxes.xyz

# API service
curl -s https://stage.api.ulyxes.xyz/health
```

## 📝 Notes

- All services run as systemd services for persistence
- Services automatically restart on failure
- SSL certificates auto-renew every 90 days
- Applications use environment-specific configuration
- API endpoints are configurable via environment variables
- All services log to systemd journal

This deployment guide ensures a robust, maintainable, and scalable deployment suitable for both staging and production environments.