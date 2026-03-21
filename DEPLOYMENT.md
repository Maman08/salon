# 🚀 Grenix — Production Deployment Guide (AWS EC2)

## Architecture Overview

```
                    ┌──────────────┐
                    │   Domain     │  (DNS → Elastic IP)
                    │  grenix.store   │
                    └──────┬───────┘
                           │
               ┌───────────┴───────────┐
               │                       │
        grenix.store              api.grenix.store
               │                       │
    ┌──────────▼───────────────────────▼──────────┐
    │              EC2 (Ubuntu 24.04)              │
    │                                              │
    │  ┌──────────┐  ┌────────────┐  ┌──────────┐ │
    │  │ Nginx    │  │ Frontend   │  │ Backend  │ │
    │  │ :80/:443 │→ │ Next.js    │  │ FastAPI  │ │
    │  │ (SSL)    │  │ :3000      │  │ :8000    │ │
    │  └──────────┘  └────────────┘  └────┬─────┘ │
    │                                     │        │
    │  ┌──────────────────┐               │        │
    │  │ PostgreSQL 16    │◄──────────────┘        │
    │  │ (native service) │                        │
    │  │ :5432 localhost  │                        │
    │  └──────────────────┘                        │
    └──────────────────────────────────────────────┘
                           │
                    ┌──────┴───────┐
                    │   AWS S3     │
                    │  grenix-media│
                    └──────────────┘
```

**Everything on ONE EC2 instance:**
- PostgreSQL → installed natively (systemd service, not Docker)
- Backend + Frontend → Docker containers
- Nginx → reverse proxy + SSL

---

## Step-by-Step Deployment

### Phase 1: AWS Setup (One-time)

#### 1.1 — Create EC2 Instance
1. Go to **EC2** → **Launch Instance**
2. Settings:
   - **Name**: `grenix-server`
   - **AMI**: Ubuntu 24.04 LTS
   - **Instance type**: `t3.small` (2 vCPU, 2 GB RAM) — ₹1,500/mo
   - **Key pair**: Create new → name `grenix-key` → download `.pem` (KEEP SAFE!)
   - **Storage**: 30 GB gp3
   - **Security group**: Create new → name `grenix-sg`
     - ✅ SSH (22) — from My IP only
     - ✅ HTTP (80) — from Anywhere
     - ✅ HTTPS (443) — from Anywhere
     - ❌ Do NOT open port 5432
3. Click **Launch Instance**
4. Go to **Elastic IPs** → Allocate → Associate with your instance

#### 1.2 — Create S3 Bucket
1. Go to **S3** → **Create bucket**
2. Bucket name: `grenix-media`
3. Region: `ap-south-1`
4. **Uncheck** "Block all public access"
5. Create bucket, then go to **Permissions** → **Bucket Policy**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicRead",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::grenix-media/*"
    }
  ]
}
```
6. Go to **IAM** → **Users** → Create user `grenix-s3` → Attach `AmazonS3FullAccess`
7. Create **Access Key** → Save Access Key ID + Secret

---

### Phase 2: Domain DNS

Point your domain to the VPS IP (`195.35.6.196`):
```
A    @               → 195.35.6.196
A    www             → 195.35.6.196
A    api             → 195.35.6.196
```

(Do this in Hostinger → Domains → grenix.store → DNS / Nameservers → DNS Records)

---

### Phase 3: Server Setup

#### 3.1 — SSH into EC2
```bash
chmod 400 grenix-key.pem
ssh -i grenix-key.pem ubuntu@<ELASTIC_IP>
```

#### 3.2 — Update System
```bash
sudo apt update && sudo apt upgrade -y
```

#### 3.3 — Install PostgreSQL 16
```bash
# Add PostgreSQL repo
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt update

# Install
sudo apt install postgresql-16 -y

# Verify
sudo systemctl status postgresql
# Should show "active (running)"
```

#### 3.4 — Configure PostgreSQL
```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user (CHANGE THE PASSWORD!)
CREATE USER grenix WITH PASSWORD 'YourStrongPassword123!';
CREATE DATABASE grenix OWNER grenix;
GRANT ALL PRIVILEGES ON DATABASE grenix TO grenix;
\q
```

Configure PostgreSQL to accept connections from Docker:
```bash
# Edit pg_hba.conf
sudo nano /etc/postgresql/16/main/pg_hba.conf

# Add this line at the end (for Docker containers to connect):
host    grenix    grenix    172.16.0.0/12    md5

# Edit postgresql.conf
sudo nano /etc/postgresql/16/main/postgresql.conf

# Find listen_addresses and change to:
listen_addresses = 'localhost,172.17.0.1'

# Restart PostgreSQL
sudo systemctl restart postgresql
```

#### 3.5 — Install Docker
```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker ubuntu

# Install Docker Compose plugin
sudo apt install docker-compose-plugin -y

# Logout and login for group to take effect
exit
```

```bash
# Login again
ssh -i grenix-key.pem ubuntu@<ELASTIC_IP>

# Verify
docker --version
docker compose version
```

#### 3.6 — Install Nginx
```bash
sudo apt install nginx -y
```

#### 3.7 — Install Certbot (SSL)
```bash
sudo apt install certbot python3-certbot-nginx -y
```

---

### Phase 4: Deploy the App

#### 4.1 — Clone Project
```bash
cd ~
git clone <your-repo-url> grenix
cd grenix/backend
```

#### 4.2 — Create .env.prod
```bash
cp .env.prod.example .env.prod
nano .env.prod
```

Fill in these values:
```bash
# Database (PostgreSQL on same machine via Docker host)
DATABASE_URL=postgresql+asyncpg://grenix:YourStrongPassword123!@host.docker.internal:5432/grenix

# JWT (generate with: openssl rand -hex 32)
JWT_SECRET_KEY=<paste_generated_key_here>
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# S3
S3_ENDPOINT_URL=https://s3.ap-south-1.amazonaws.com
S3_ACCESS_KEY=<your_aws_access_key>
S3_SECRET_KEY=<your_aws_secret_key>
S3_BUCKET_NAME=grenix-media
S3_REGION=ap-south-1

# Razorpay (add later when client provides)
RAZORPAY_KEY_ID=rzp_test_placeholder
RAZORPAY_KEY_SECRET=placeholder

# App
APP_ENV=production
APP_DEBUG=false
CORS_ORIGINS=https://grenix.store,https://www.grenix.store

# Frontend
NEXT_PUBLIC_API_URL=https://api.grenix.store/api/v1
```

#### 4.3 — Build & Start Containers
```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
```

#### 4.4 — Run Database Migrations
```bash
docker compose -f docker-compose.prod.yml exec backend alembic upgrade head
```

#### 4.5 — Seed Initial Data
```bash
docker compose -f docker-compose.prod.yml exec backend python seed.py
```

#### 4.6 — Upload Product Images to S3
From your local machine:
```bash
# Install AWS CLI if not already
brew install awscli

# Configure
aws configure
# Enter: Access Key, Secret Key, Region: ap-south-1, Output: json

# Upload images
cd ~/Desktop/Learning/tn/backend
aws s3 sync ./seed_images s3://grenix-media/products/ --acl public-read
```

#### 4.7 — Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/grenix
```

Paste this:
```nginx
# Frontend — grenix.store
server {
    listen 80;
    server_name grenix.store www.grenix.store;

    location / {
        proxy_pass http://127.0.0.1:3000;
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

# Backend API — api.grenix.store
server {
    listen 80;
    server_name api.grenix.store;

    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable it:
```bash
sudo ln -s /etc/nginx/sites-available/grenix /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

#### 4.8 — Get SSL Certificate (after DNS is pointed)
```bash
sudo certbot --nginx -d grenix.store -d www.grenix.store -d api.grenix.store
# Follow prompts, enter email, agree to terms
# Auto-renewal is configured automatically
```

#### 4.9 — Verify Everything
```bash
# Check containers
docker compose -f docker-compose.prod.yml ps

# Check backend health
curl http://localhost:8000/health

# Check PostgreSQL
sudo systemctl status postgresql

# Check Nginx
sudo systemctl status nginx

# From browser:
# https://grenix.store
# https://api.grenix.store/health
```

---

### Phase 5: Database Backup (Weekly → S3)

```bash
# Create backup script
nano /home/ubuntu/backup-db.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/ubuntu/backups"
mkdir -p $BACKUP_DIR

# Dump database
sudo -u postgres pg_dump grenix > $BACKUP_DIR/grenix_$DATE.sql

# Upload to S3
aws s3 cp $BACKUP_DIR/grenix_$DATE.sql s3://grenix-media/backups/grenix_$DATE.sql

# Keep only last 7 local backups
ls -t $BACKUP_DIR/grenix_*.sql | tail -n +8 | xargs rm -f

echo "Backup complete: grenix_$DATE.sql"
```

```bash
chmod +x /home/ubuntu/backup-db.sh

# Schedule weekly backup (every Sunday 3 AM)
crontab -e
# Add this line:
0 3 * * 0 /home/ubuntu/backup-db.sh >> /home/ubuntu/backups/backup.log 2>&1
```

---

## 💰 Estimated Monthly Cost

| Service | Cost/month |
|---------|------------|
| EC2 (t3.small) | ~₹1,500 |
| S3 (< 5GB) | ~₹50 |
| Elastic IP | ₹0 (if attached) |
| Domain (.in) | ~₹500/year |
| SSL (Certbot) | ₹0 |
| PostgreSQL (on EC2) | ₹0 |
| **Total** | **~₹1,550/mo** |

---

## 🔄 Updating the Site (Future Deploys)

```bash
# SSH into EC2
ssh -i grenix-key.pem ubuntu@<ELASTIC_IP>

# Pull latest code
cd ~/grenix
git pull

# Rebuild and restart
cd backend
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build

# If there are new DB migrations:
docker compose -f docker-compose.prod.yml exec backend alembic upgrade head
```

---

## 🔄 Migrate to RDS Later (When Business Grows)

When you have 100+ users and want managed database:
```bash
# 1. Dump from EC2 PostgreSQL
sudo -u postgres pg_dump grenix > grenix_full.sql

# 2. Create RDS instance on AWS Console

# 3. Import to RDS
psql -h <RDS_ENDPOINT> -U grenix -d grenix < grenix_full.sql

# 4. Update .env.prod — change DATABASE_URL to RDS endpoint

# 5. Restart backend
docker compose -f docker-compose.prod.yml restart backend
```

---

## 🛡️ Security Checklist

- [ ] SSH key (.pem) stored safely, NOT shared
- [ ] JWT_SECRET_KEY changed (use `openssl rand -hex 32`)
- [ ] PostgreSQL only listens on localhost + Docker network (not 0.0.0.0)
- [ ] Port 5432 NOT open in EC2 security group
- [ ] S3 bucket: only GetObject is public (not PutObject)
- [ ] .env.prod is NOT in git (.gitignore covers it)
- [ ] Razorpay live keys kept secret
- [ ] CORS_ORIGINS only allows your domains
- [ ] APP_DEBUG=false
- [ ] SSH (port 22) restricted to your IP only
- [ ] Weekly database backups to S3
- [ ] SSL auto-renewal via Certbot

---

## 🆘 Troubleshooting

**Backend not starting:**
```bash
docker compose -f docker-compose.prod.yml logs backend
```

**Database connection error:**
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection manually
sudo -u postgres psql -d grenix -c "SELECT 1;"
```

**Nginx 502 Bad Gateway:**
```bash
# Check containers
docker compose -f docker-compose.prod.yml ps

# Check Nginx config
sudo nginx -t
```

**SSL not working:**
```bash
# Make sure DNS is pointed first, then:
sudo certbot --nginx -d grenix.store -d www.grenix.store -d api.grenix.store
```

**Razorpay (when ready):**
1. Client creates Razorpay account → Complete KYC
2. Get Live Key ID (`rzp_live_...`) + Key Secret
3. Update `.env.prod` on EC2
4. `docker compose -f docker-compose.prod.yml restart backend`
