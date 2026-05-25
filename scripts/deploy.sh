#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="${1:-/opt/qfx-finance}"
BRANCH="${2:-main}"
DOMAIN="${3:-https://qfx-finance.com}"

cd "$ROOT_DIR"

git fetch origin "$BRANCH"
git checkout "$BRANCH"
git pull --ff-only origin "$BRANCH"

docker compose -f docker-compose.yml build api client
docker compose -f docker-compose.yml up -d api client

docker compose -f docker-compose.yml ps
curl -fsS "$DOMAIN" >/dev/null && echo 'web ok'
curl -fsS "$DOMAIN/api/health" >/dev/null && echo 'api health ok'
