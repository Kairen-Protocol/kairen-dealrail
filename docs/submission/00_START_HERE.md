# Start Here

This is the canonical submission entry point for DealRail.

## One-Line Thesis

DealRail is an Ethereum machine-commerce desk for humans and agents:
- request work
- compare providers
- pay instantly or commit to escrow
- settle with receipts
- score counterparties through ERC-8004-aware trust hooks

Live browser desk:
- `https://dealrail.kairen.xyz/`

Live backend API:
- `https://kairen-dealrail-production.up.railway.app/`

Published operator package:
- `@kairenxyz/dealrail`
- binary: `dealrail`

## Judge-Readiness Snapshot

These percentages are submission-readiness estimates, not code coverage.

| Track | Readiness | Meaning |
|------|-----------|---------|
| Synthesis Open Track | 95% | Primary narrative, evidence-backed |
| Protocol Labs: Agents With Receipts / ERC-8004 | 90% | Strongest sponsor-specific fit |
| Virtuals: ERC-8183 Open Build | 92% | Direct protocol-thesis fit |
| Celo: Best Agent on Celo | 90% | Real testnet deployment + proofs |
| AgentCash / x402 | 85% | Real paid-request proof on testnet |
| Protocol Labs: Let the Agent Cook | 70% | Good architecture fit, packaging gap remains |
| Base: Agent Services on Base | 75% | Good evidence, discoverability proof gap |
| MetaMask Delegations | 60% | Builder exists, execution proof missing |
| Uniswap | 55% | Builder exists, swap proof missing |
| Locus | 45% | Bridge exists, live proof missing |

## What Makes This Repo Competitive

- Real escrow contracts deployed on Base Sepolia and Celo Sepolia
- Recorded happy-path and reject-path transactions
- ERC-8004 verifier and reputation hook integration
- Published npm CLI package for agent operators
- Live browser desk and live backend deployment
- AI-judge-friendly docs that distinguish shipped evidence from upgrade paths

## Human And Agent Fast Path

Human evaluator:

```bash
npx @kairenxyz/dealrail doctor
npx @kairenxyz/dealrail help
```

Or open the live site directly:
- `https://dealrail.kairen.xyz/`

Agent evaluator:

```bash
npx @kairenxyz/dealrail doctor --json
npx @kairenxyz/dealrail status --json
```

Live API check:

```bash
DEALRAIL_API_URL=https://kairen-dealrail-production.up.railway.app npx @kairenxyz/dealrail doctor --json
```

## Best Track Lock Right Now

The current highest-confidence submission set is:

1. Synthesis Open Track
2. Protocol Labs: Agents With Receipts / ERC-8004
3. Virtuals: ERC-8183 Open Build
4. Celo: Best Agent on Celo
5. AgentCash / x402 on a testnet-only basis

The current highest-ROI stretch track is:

6. Protocol Labs: Let the Agent Cook

## Read Order

1. [`01_TRACK_MATRIX.md`](01_TRACK_MATRIX.md)
2. [`02_ARCHITECTURE.md`](02_ARCHITECTURE.md)
3. [`06_VISUAL_ARCHITECTURE.md`](06_VISUAL_ARCHITECTURE.md)
4. [`03_EVIDENCE.md`](03_EVIDENCE.md)
5. [`04_CHECKLIST.md`](04_CHECKLIST.md)
6. [`05_WINNING_STRATEGY.md`](05_WINNING_STRATEGY.md)
7. [`07_ROADMAP.md`](07_ROADMAP.md)

Track briefs:
- [`tracks/OPEN_TRACK.md`](tracks/OPEN_TRACK.md)
- [`tracks/PROTOCOL_LABS_ERC8004.md`](tracks/PROTOCOL_LABS_ERC8004.md)
- [`tracks/PROTOCOL_LABS_AGENT_COOK.md`](tracks/PROTOCOL_LABS_AGENT_COOK.md)
- [`tracks/VIRTUALS_ERC8183.md`](tracks/VIRTUALS_ERC8183.md)
- [`tracks/CELO.md`](tracks/CELO.md)
- [`tracks/AGENTCASH_X402.md`](tracks/AGENTCASH_X402.md)
- [`tracks/METAMASK_DELEGATIONS.md`](tracks/METAMASK_DELEGATIONS.md)
- [`tracks/UNISWAP.md`](tracks/UNISWAP.md)
- [`tracks/LOCUS.md`](tracks/LOCUS.md)

## Important Evaluation Rule

This pack is intentionally conservative.

- 85%+ means submit confidently.
- 70-84% means valid stretch track with clear remaining work.
- below 70% means code exists, but sponsor-grade proof is still missing.
- live URLs and tx hashes outrank planned integrations.

## Official Resources Used For This Pass

- `https://synthesis.md/`
- `https://synthesis.md/hack/`
- `https://synthesis.devfolio.co/catalog?page=1&limit=100`
- local Kairen protocol repos under `/Users/sarthiborkar/Build/kairen-protocol`
