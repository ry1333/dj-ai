#!/usr/bin/env bash
set -euo pipefail
echo "▶ apt + ffmpeg"
sudo apt-get update -y && sudo apt-get install -y ffmpeg
echo "▶ corepack + deps"
corepack enable || true
if command -v pnpm >/dev/null 2>&1; then pnpm i || true; else npm i; fi
echo "▶ playwright"
npx playwright install --with-deps || true
echo "▶ gitleaks"
curl -sSL https://raw.githubusercontent.com/gitleaks/gitleaks/master/install.sh | sudo bash -s -- -b /usr/local/bin
echo "▶ env template"
[ -f .env.example ] || cat > .env.example <<'ENVEOF'
VITE_APP_NAME=RMXR
VITE_API_BASE=/api
VITE_POST_MAX_SECONDS=40
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
ENVEOF
echo "✅ postCreate complete"
