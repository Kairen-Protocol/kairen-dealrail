#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ROOT_ENV_FILE="$REPO_ROOT/.env"
OUTPUT_FILE="${1:-$REPO_ROOT/backend/.env.railway.local}"

if [[ ! -f "$ROOT_ENV_FILE" ]]; then
  echo "Missing root .env at $ROOT_ENV_FILE" >&2
  exit 1
fi

set -a
source "$ROOT_ENV_FILE"
set +a

umask 077

write_if_set() {
  local key="$1"
  local value="${!key-}"
  if [[ -n "$value" ]]; then
    printf '%s=%q\n' "$key" "$value" >> "$OUTPUT_FILE"
  fi
}

: > "$OUTPUT_FILE"

cat >> "$OUTPUT_FILE" <<'EOF'
# Generated from the repo root .env for Railway backend deployment.
# Safe to keep local. Do not commit.

NODE_ENV=production
HOST=0.0.0.0
ACTIVE_CHAIN=baseSepolia
X402N_MOCK_MODE=true
LOCUS_MOCK_MODE=true
DISCOVERY_X402N_ENABLED=true
DISCOVERY_VIRTUALS_ENABLED=false
DISCOVERY_NEAR_ENABLED=false
EOF

write_if_set BASE_SEPOLIA_RPC
write_if_set CELO_SEPOLIA_RPC
write_if_set DEPLOYER_PRIVATE_KEY
write_if_set AGENT_PRIVATE_KEY
write_if_set EVALUATOR_PRIVATE_KEY

write_if_set ESCROW_RAIL_BASE_SEPOLIA
write_if_set ESCROW_RAIL_ERC20_BASE_SEPOLIA
write_if_set DEALRAIL_HOOK_BASE_SEPOLIA
write_if_set ERC8004_VERIFIER_BASE_SEPOLIA
write_if_set NULL_VERIFIER_BASE_SEPOLIA

write_if_set ESCROW_RAIL_CELO_SEPOLIA
write_if_set ESCROW_RAIL_ERC20_CELO_SEPOLIA
write_if_set DEALRAIL_HOOK_CELO_SEPOLIA
write_if_set ERC8004_VERIFIER_CELO_SEPOLIA
write_if_set CELO_SEPOLIA_STABLE_TOKEN

write_if_set BASE_MAINNET_RPC
write_if_set ERC8004_IDENTITY_REGISTRY
write_if_set ERC8004_REPUTATION_REGISTRY
write_if_set BANKR_API_KEY
write_if_set LOCUS_API_KEY
write_if_set PINATA_JWT
write_if_set X402N_API_KEY

echo "Wrote Railway backend env file: $OUTPUT_FILE"
