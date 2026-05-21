#!/bin/bash
# QFX Finance — VPS Setup Script
# Run as root on Ubuntu 22.04: bash setup-vps.sh

set -e
echo "🚀 Setting up QFX Finance VPS..."

# ─── System Update ───────────────────────────────────────
apt-get update -y && apt-get upgrade -y
apt-get install -y curl git ufw fail2ban nginx certbot python3-certbot-nginx

# ─── Docker ──────────────────────────────────────────────
curl -fsSL https://get.docker.com | sh
systemctl enable docker && systemctl start docker

# Docker Compose plugin
apt-get install -y docker-compose-plugin
docker compose version

# ─── Firewall ────────────────────────────────────────────
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp     # SSH
ufw allow 80/tcp     # HTTP
ufw allow 443/tcp    # HTTPS
ufw --force enable
echo "✅ Firewall configured"

# ─── fail2ban ────────────────────────────────────────────
systemctl enable fail2ban && systemctl start fail2ban
echo "✅ fail2ban active"

# ─── App Directory ───────────────────────────────────────
mkdir -p /opt/qfx-finance
cd /opt/qfx-finance

# ─── Nginx ───────────────────────────────────────────────
rm -f /etc/nginx/sites-enabled/default
cp /opt/qfx-finance/nginx/qfx-finance.conf /etc/nginx/sites-available/qfx-finance.conf
ln -sf /etc/nginx/sites-available/qfx-finance.conf /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
echo "✅ Nginx configured"

# ─── SSL ─────────────────────────────────────────────────
certbot --nginx \
  -d qfx-finance.com \
  -d www.qfx-finance.com \
  -d api.qfx-finance.com \
  -d admin.qfx-finance.com \
  --non-interactive --agree-tos -m admin@qfx-finance.com
echo "✅ SSL certificates installed"

# ─── Auto-renew SSL ──────────────────────────────────────
(crontab -l 2>/dev/null; echo "0 3 * * * /usr/bin/certbot renew --quiet && systemctl reload nginx") | crontab -
echo "✅ SSL auto-renewal configured"

echo ""
echo "════════════════════════════════════════"
echo "✅ VPS setup complete!"
echo "Next steps:"
echo "  1. Copy your .env file to /opt/qfx-finance/.env"
echo "  2. Run: cd /opt/qfx-finance && docker compose up -d"
echo "  3. Add GitHub Secrets: VPS_HOST, VPS_USER, VPS_SSH_KEY"
echo "════════════════════════════════════════"
