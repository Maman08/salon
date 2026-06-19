# Deploying Grenix on a Hostinger VPS

Full stack on **one Hostinger VPS (KVM)**, all in Docker. No AWS, no native installs.

```
Internet → Nginx (80/443, SSL)
              ├── grenix.store / www   → Next.js  (127.0.0.1:3000)
              ├── api.grenix.store     → FastAPI   (127.0.0.1:8000)
              └── media.grenix.store   → MinIO     (127.0.0.1:9000)   ← replaces S3
                       ↓
                   Postgres + MinIO (Docker volumes, on the same VPS)
```

**Recommended plan:** KVM 2 (2 vCPU / 8 GB) on **Ubuntu 24.04**.

---

## Step 0 — Hostinger panel (do these two things first)

1. **Buy the VPS.** hPanel → VPS → KVM 2 → OS template **Ubuntu 24.04**. Set a
   root password. Note the **VPS IP**.
2. **DNS** (Hostinger DNS / your registrar) — add **A records** to the VPS IP:

   | Type | Name   | Value   |
   |------|--------|---------|
   | A    | `@`    | VPS_IP  |
   | A    | `www`  | VPS_IP  |
   | A    | `api`  | VPS_IP  |
   | A    | `media`| VPS_IP  |

   Do this early — propagation can take up to a few hours, and SSL needs it.

---

## Step 1 — Prepare the VPS

```bash
ssh root@VPS_IP

apt update && apt upgrade -y
curl -fsSL https://get.docker.com | sh          # skip if you chose a Docker template
apt install -y git nginx certbot python3-certbot-nginx ufw

ufw allow OpenSSH && ufw allow 'Nginx Full' && ufw --force enable
```

> Only ports 80/443 (Nginx) and SSH are open. App ports (3000/8000/9000) are
> bound to `127.0.0.1` and never exposed directly.

## Step 2 — Get the code

```bash
cd /opt
git clone <YOUR_REPO_URL> grenix
cd grenix/backend
```

## Step 3 — Create the production env file

```bash
cp .env.prod.example .env.prod
# Generate secrets:
echo "JWT:   $(openssl rand -hex 32)"
echo "DB PW: $(openssl rand -hex 16)"
echo "MINIO: $(openssl rand -hex 16)"
nano .env.prod
```

Fill in `.env.prod`:
- `POSTGRES_PASSWORD` and the password inside `DATABASE_URL` — **must match**.
- `JWT_SECRET_KEY`, `S3_SECRET_KEY` — the generated values.
- Leave `RAZORPAY_*` blank for now.
- Keep the `grenix.store` domains as-is.

## Step 4 — Build & launch all services

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
docker compose -f docker-compose.prod.yml ps      # all should be healthy/up
```

This starts Postgres, MinIO, creates the `grenix-media` bucket (public-read),
the FastAPI backend, and the Next.js frontend.

## Step 5 — Initialize the database

```bash
docker compose -f docker-compose.prod.yml exec backend alembic upgrade head
docker compose -f docker-compose.prod.yml exec backend python seed.py
```

`seed.py` loads product data and uploads the product images to MinIO.

## Step 6 — Nginx + SSL

```bash
sudo cp nginx/grenix.conf /etc/nginx/sites-available/grenix.conf
sudo ln -s /etc/nginx/sites-available/grenix.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

sudo certbot --nginx -d grenix.store -d www.grenix.store \
             -d api.grenix.store -d media.grenix.store
```

Certbot adds the HTTPS (443) blocks and auto-renews via systemd timer.

## Step 7 — Verify

```bash
curl https://api.grenix.store/health      # {"status":"ok","version":"1.0.0"}
```

Open `https://grenix.store` — site loads, product images come from
`https://media.grenix.store/...`.

---

## Going live with Razorpay (later)

1. Edit `backend/.env.prod` → set `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` (live).
2. Rebuild just the backend:
   ```bash
   docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build backend
   ```

## Updating the app after a code change

```bash
cd /opt/grenix && git pull
cd backend
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
docker compose -f docker-compose.prod.yml exec backend alembic upgrade head   # if new migrations
```

## Backups (recommended)

```bash
# Database
docker compose -f docker-compose.prod.yml exec db \
  pg_dump -U grenix grenix > backup-$(date +%F).sql

# MinIO media is in the `minio_data` Docker volume — snapshot it or use
# `docker run --rm -v backend_minio_data:/data -v $PWD:/b alpine tar czf /b/media.tgz /data`
```

## Troubleshooting

```bash
docker compose -f docker-compose.prod.yml logs -f backend     # API logs
docker compose -f docker-compose.prod.yml logs -f frontend
docker compose -f docker-compose.prod.yml logs createbuckets  # bucket creation
```

- **502 on the site** → a container isn't healthy: `docker compose ... ps`.
- **Images 404 / not loading** → check `media.grenix.store` SSL resolved and
  `S3_PUBLIC_URL=https://media.grenix.store` in `.env.prod`.
- **CORS errors in browser** → `CORS_ORIGINS` must list the exact frontend
  origins; rebuild backend after changing.
- **DB connection refused** → `POSTGRES_PASSWORD` and the password in
  `DATABASE_URL` don't match.
