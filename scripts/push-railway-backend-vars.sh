#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="${1:-$REPO_ROOT/backend/.env.railway.local}"
SERVICE_NAME="${2:-}"
ENVIRONMENT_NAME="${3:-}"
RAILWAY_BIN="${RAILWAY_BIN:-/opt/homebrew/bin/railway}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing env file: $ENV_FILE" >&2
  echo "Run scripts/render-railway-backend-env.sh first." >&2
  exit 1
fi

if [[ ! -x "$RAILWAY_BIN" ]]; then
  echo "Railway CLI not found at $RAILWAY_BIN" >&2
  exit 1
fi

"$RAILWAY_BIN" whoami >/dev/null

args=(variables --skip-deploys)

if [[ -n "$SERVICE_NAME" ]]; then
  args+=(--service "$SERVICE_NAME")
fi

if [[ -n "$ENVIRONMENT_NAME" ]]; then
  args+=(--environment "$ENVIRONMENT_NAME")
fi

while IFS= read -r line || [[ -n "$line" ]]; do
  [[ -z "$line" ]] && continue
  [[ "$line" =~ ^# ]] && continue
  "$RAILWAY_BIN" "${args[@]}" --set "$line" >/dev/null
done < "$ENV_FILE"

echo "Railway variables uploaded from $ENV_FILE"
echo "Redeploy the backend service or run:"
if [[ -n "$SERVICE_NAME" ]]; then
  echo "  $RAILWAY_BIN redeploy --service \"$SERVICE_NAME\""
else
  echo "  $RAILWAY_BIN redeploy"
fi
