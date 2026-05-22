# Production Deployment Guide (VPS)

This guide covers deploying the QFX Finance monorepo on a Linux VPS using Node.js, PM2, and Nginx.

## 1) Prerequisites

- Ubuntu/Debian VPS with sudo access
- Domain names pointed to your VPS IP
- Git installed

Install dependencies:

```bash
sudo apt update
sudo apt install -y curl git nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

## 2) Clone and install

```bash
git clone <YOUR_REPO_URL> qfx-finance
cd qfx-finance
npm install
npm run check:manifests
```

## 3) Configure environment

Create environment files from examples:

- `apps/api/apps_api_env.example`
- `apps/admin/apps_admin_env.example`
- `apps/client/apps_client_env.example`

Add strong production secrets (JWT keys, DB URL, API keys), and ensure they are not committed.

## 4) Database migrations (Prisma)

```bash
npx prisma migrate deploy
npx prisma generate
```

(Optional) seed:

```bash
npx prisma db seed
```

## 5) Build workspaces

```bash
npm run build
```

The root `build` script runs manifest validation first, then workspace builds.

## 6) Run with PM2

Create `ecosystem.config.cjs` in repo root:

```js
module.exports = {
  apps: [
    {
      name: 'qfx-api',
      cwd: '/var/www/qfx-finance/apps/api',
      script: 'npm',
      args: 'run start:dev',
      env: { NODE_ENV: 'production', PORT: 3002 }
    },
    {
      name: 'qfx-client',
      cwd: '/var/www/qfx-finance/apps/client',
      script: 'npm',
      args: 'run start',
      env: { NODE_ENV: 'production', PORT: 3000 }
    },
    {
      name: 'qfx-admin',
      cwd: '/var/www/qfx-finance/apps/admin',
      script: 'npm',
      args: 'run start',
      env: { NODE_ENV: 'production', PORT: 3001 }
    }
  ]
};
```

Start and persist:

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

## 7) Nginx reverse proxy

Use `nginx/qfx-finance.conf` as a base and adapt upstream host/ports/domains.

Enable and reload:

```bash
sudo cp nginx/qfx-finance.conf /etc/nginx/sites-available/qfx-finance
sudo ln -s /etc/nginx/sites-available/qfx-finance /etc/nginx/sites-enabled/qfx-finance
sudo nginx -t
sudo systemctl reload nginx
```

## 8) TLS (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d <CLIENT_DOMAIN> -d <ADMIN_DOMAIN> -d <API_DOMAIN>
```

## 9) Post-deploy checks

- Client app loads
- Admin app loads
- API responds
- Login and a key money flow succeeds
- `pm2 logs` shows no crash loops

## 10) Updates

```bash
cd /var/www/qfx-finance
git pull
npm install
npm run build
pm2 restart all
```
