#!/usr/bin/env bash
# Deploy the backend to vpstotal: rsync ./server -> /opt/xvariational, rebuild, restart.
#   ./server/deploy.sh
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
rsync -az --delete --exclude node_modules --exclude .env --exclude docker-compose.yml --exclude data \
  "$HERE/" vpstotal:/opt/xvariational/
ssh vpstotal 'cd /opt/xvariational && docker compose up -d --build --remove-orphans && docker compose ps'
sleep 3
curl -sf https://api.ghzcreative.ai/xvariational/health && echo && echo "==> OK"
