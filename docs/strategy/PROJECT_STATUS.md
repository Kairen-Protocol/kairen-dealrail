# DealRail Project Status

This is the current internal status view after the live deployment and documentation cleanup.

## Current Baseline

- frontend live on Cloudflare
- backend live on Railway
- npm package live as `@kairenxyz/dealrail`
- Base Sepolia escrow proof recorded
- Celo Sepolia happy and reject proofs recorded
- x402 paid-request proof recorded on Base Sepolia

## Readiness Snapshot

| Area | Readiness | Note |
|------|-----------|------|
| Product narrative | 95% | coherent for judges and agents |
| Browser desk | 95% | live and polished |
| CLI / SDK | 92% | live package and JSON mode |
| Backend API | 90% | live and chain-aware |
| ERC-8004 trust layer | 90% | contracts, hooks, tests, evidence |
| x402 proof | 85% | one canonical paid proof |
| Let the Agent Cook packaging | 70% | missing autonomy artifacts |
| MetaMask / Uniswap / Locus | 45-60% | upgrade zones only |

## Main Remaining Work

1. add truthful `agent.json` and `agent_log.json`
2. record the final demo video
3. only upgrade additional sponsor tracks if real proof is captured
4. continue the broader Kairen integration roadmap

## Truth Rule

If a feature does not have:
- code
- a working path
- and durable proof

it should stay below the confident-submission threshold.
