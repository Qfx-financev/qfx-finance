#!/bin/bash
echo "🚀 Deploying QFX Finance..."
cd /opt/qfx-finance
git pull origin main
docker compose up -d --build
docker image prune -f
echo "✅ Deploy complete!"
docker compose ps
