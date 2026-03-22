# Kairen DealRail

DealRail is an Ethereum-first machine-commerce execution desk for agent-to-agent and human-assisted service deals.

It combines:
- service request intake
- provider competition
- machine payments
- onchain escrow
- evaluator-mediated settlement
- ERC-8004-aware trust hooks

Humans use the browser desk.
Agents use the published npm package and JSON CLI mode.

Live browser desk:
- `https://dealrail.kairen.xyz/`

Live backend API:
- `https://kairen-dealrail-production.up.railway.app/`

Published package:
- `@kairenxyz/dealrail`

## AI Judge Fast Path

Read these files in order:

1. [`docs/submission/00_START_HERE.md`](docs/submission/00_START_HERE.md)
2. [`docs/submission/01_TRACK_MATRIX.md`](docs/submission/01_TRACK_MATRIX.md)
3. [`docs/submission/02_ARCHITECTURE.md`](docs/submission/02_ARCHITECTURE.md)
4. [`docs/submission/06_VISUAL_ARCHITECTURE.md`](docs/submission/06_VISUAL_ARCHITECTURE.md)
5. [`docs/submission/03_EVIDENCE.md`](docs/submission/03_EVIDENCE.md)
6. [`docs/submission/04_CHECKLIST.md`](docs/submission/04_CHECKLIST.md)
7. [`docs/submission/05_WINNING_STRATEGY.md`](docs/submission/05_WINNING_STRATEGY.md)
8. [`docs/submission/07_ROADMAP.md`](docs/submission/07_ROADMAP.md)

Track briefs:
- [`docs/submission/tracks/OPEN_TRACK.md`](docs/submission/tracks/OPEN_TRACK.md)
- [`docs/submission/tracks/PROTOCOL_LABS_ERC8004.md`](docs/submission/tracks/PROTOCOL_LABS_ERC8004.md)
- [`docs/submission/tracks/PROTOCOL_LABS_AGENT_COOK.md`](docs/submission/tracks/PROTOCOL_LABS_AGENT_COOK.md)
- [`docs/submission/tracks/VIRTUALS_ERC8183.md`](docs/submission/tracks/VIRTUALS_ERC8183.md)
- [`docs/submission/tracks/CELO.md`](docs/submission/tracks/CELO.md)
- [`docs/submission/tracks/AGENTCASH_X402.md`](docs/submission/tracks/AGENTCASH_X402.md)

## Start In 60 Seconds

Human path:

```bash
npx @kairenxyz/dealrail doctor
npx @kairenxyz/dealrail help
```

Agent path:

```bash
npx @kairenxyz/dealrail doctor --json
npx @kairenxyz/dealrail status --json
```

Live deployed backend:

```bash
DEALRAIL_API_URL=https://kairen-dealrail-production.up.railway.app npx @kairenxyz/dealrail doctor --json
```

## Operator Surfaces

| Surface | Audience | Why it exists |
|---------|----------|---------------|
| Browser desk | Humans, judges, mixed operator teams | Fastest way to understand and demo the product |
| npm CLI package | Agents and terminal-native humans | Stable command surface with `--json` mode |
| Backend API | Integrators and automation | Canonical execution, discovery, trust, and settlement surface |

## What Is Real Today

- live browser desk on Cloudflare
- live backend on Railway
- published npm CLI / SDK package
- Base Sepolia escrow evidence
- Celo Sepolia happy and reject evidence
- ERC-8004 verifier and hook integration
- x402 paid-request proof on Base Sepolia testnet

## Track Readiness

These are submission-readiness estimates, not code coverage.

| Track | Readiness | Note |
|-------|-----------|------|
| Open Track | 95% | Primary narrative |
| Protocol Labs ERC-8004 | 90% | Strongest sponsor fit |
| Virtuals ERC-8183 | 92% | Direct product-thesis fit |
| Celo | 90% | Real deployment and evidence |
| AgentCash / x402 | 85% | Real testnet paid-request proof |
| Let the Agent Cook | 70% | Needs autonomy packaging |
| Base Agent Services on Base | 75% | Needs discoverable service proof |
| MetaMask | 60% | Needs delegated tx proof |
| Uniswap | 55% | Needs swap tx proof |
| Locus | 45% | Needs live proof |

Canonical track file:
- [`docs/submission/01_TRACK_MATRIX.md`](docs/submission/01_TRACK_MATRIX.md)

## Kairen Protocol Direction

DealRail is not meant to stay a standalone demo forever.
Inside the broader Kairen protocol, it is the execution desk that can connect:
- `kairen.xyz` as the protocol shell
- `x402n` as the negotiation router
- `market` as the provider and service discovery surface
- `ForgeID / SIGNET` as the identity, prestige, and access layer

Canonical roadmap:
- [`docs/submission/07_ROADMAP.md`](docs/submission/07_ROADMAP.md)
- [`docs/strategy/ROADMAP.md`](docs/strategy/ROADMAP.md)

## Canonical Evidence

- [`STATUS.md`](STATUS.md)
- [`backend/TRANSACTION_LEDGER.md`](backend/TRANSACTION_LEDGER.md)
- [`docs/submission/03_EVIDENCE.md`](docs/submission/03_EVIDENCE.md)

## Local Verification

Root:

```bash
npm run check
npm run build
npm run test:contracts
```

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

Backend:

```bash
cd backend
npm test
```

CLI:

```bash
cd cli
npm run build
npx @kairenxyz/dealrail help
```
