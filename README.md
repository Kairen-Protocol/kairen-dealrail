# Kairen DealRail

DealRail is an Ethereum-first execution desk for agent commerce.

It helps a buyer or operator:
- define a task
- scan a provider market
- compare offers
- choose machine payment or escrow
- settle with an evaluator
- leave a reusable receipt and trust trail

Live product:
- Browser desk: `https://dealrail.kairen.xyz/`
- Backend API: `https://kairen-dealrail-production.up.railway.app/`
- Agent package: `@kairenxyz/dealrail`
- Base service directory: `https://dealrail.kairen.xyz/base`

## What This Repo Really Is

DealRail is strongest today as:
- a real multi-chain escrow and receipts system
- a polished operator surface for humans and agents
- an ERC-8004-aware trust and reputation hook demo
- an Ethereum machine-commerce desk with a truthful x402 proof

It is not yet a fully live open provider marketplace.

Discovery and competition are currently:
- coherent
- usable
- clearly marked as curated demo supply when in mock mode

## Fast Paths

Human:
- open `https://dealrail.kairen.xyz/`
- or run `npx @kairenxyz/dealrail doctor`

Agent:

```bash
npx @kairenxyz/dealrail doctor --json
npx @kairenxyz/dealrail services --json
npx @kairenxyz/dealrail status --json
npx @kairenxyz/dealrail vend "automation benchmark report" --budget 0.12 --hours 24 --json
```

Explicit live backend:

```bash
DEALRAIL_API_URL=https://kairen-dealrail-production.up.railway.app npx @kairenxyz/dealrail doctor --json
```

## Judge Fast Path

Read these in order:

1. [`docs/submission/00_START_HERE.md`](docs/submission/00_START_HERE.md)
2. [`docs/submission/00_JUDGE_PROOF_PATH.md`](docs/submission/00_JUDGE_PROOF_PATH.md)
3. [`docs/submission/01_TRACK_MATRIX.md`](docs/submission/01_TRACK_MATRIX.md)
4. [`docs/submission/02_ARCHITECTURE.md`](docs/submission/02_ARCHITECTURE.md)
5. [`docs/submission/03_EVIDENCE.md`](docs/submission/03_EVIDENCE.md)
6. [`docs/submission/04_CHECKLIST.md`](docs/submission/04_CHECKLIST.md)
7. [`docs/submission/05_WINNING_STRATEGY.md`](docs/submission/05_WINNING_STRATEGY.md)
8. [`docs/submission/06_VISUAL_ARCHITECTURE.md`](docs/submission/06_VISUAL_ARCHITECTURE.md)
9. [`docs/submission/07_ROADMAP.md`](docs/submission/07_ROADMAP.md)

## Three Scenarios

### Scenario 1: Buyer agent needs a benchmark report

1. The buyer runs `vend "automation benchmark report"`.
2. DealRail scans a curated provider catalog and ranks offers.
3. The buyer chooses a winner.
4. The buyer either pays immediately through x402 or creates an escrowed job.
5. The provider submits work and the evaluator completes or rejects the job.
6. The receipt and trust outcome become reusable evidence.

### Scenario 2: Human operator wants a safer services desk

1. The operator opens the browser desk.
2. They inspect live jobs on Base Sepolia or Celo Sepolia.
3. They can fund, submit, approve, or reject directly from their wallet on the job’s recorded chain.
4. The UI blocks wrong-chain signing instead of silently defaulting to Base.

### Scenario 3: Treasury wants a routing preview after settlement

1. A Base Sepolia job completes.
2. DealRail can build a Base-only Uniswap routing preview.
3. The preview shows candidate payloads and slippage assumptions.
4. It is intentionally labeled as preview-only until a real swap proof exists.

### Scenario 4: Judge wants the Base-facing public surface

1. Open `/base` or call `GET /api/v1/base/agent-services`.
2. Inspect the public Base service directory, visible supply, and settlement rail.
3. Verify that the surface is real and public, while still clearly labeled as curated when discovery is in mock mode.

## Readiness Model

Use these labels throughout the repo:

- `High`: evidence-backed and safe to emphasize in judging
- `Medium`: meaningful implementation exists, but proof or packaging is incomplete
- `Low`: preview-only, weakly evidenced, or roadmap-grade

Current track posture:

| Track | Readiness | Note |
|------|-----------|------|
| Open Track | High | Primary story |
| Protocol Labs ERC-8004 | High | Strongest sponsor fit |
| Protocol Labs Let the Agent Cook | High | Canonical agent artifacts and live CLI path |
| Virtuals ERC-8183 | High | Core commerce thesis |
| Celo | High | Real happy and reject proofs |
| AgentCash / x402 | High | Real Base Sepolia paid-request proof |
| Base Agent Services on Base | Medium | Public Base service directory exists, but supply is still not a public open market |
| MetaMask Delegations | Low | Builder and signing path only |
| Uniswap | Low | Base-only routing preview, no recorded swap tx |
| Locus | Low | Adapter exists, live proof absent |

Canonical track matrix:
- [`docs/submission/01_TRACK_MATRIX.md`](docs/submission/01_TRACK_MATRIX.md)

## Safety Boundary

The public backend does not ask clients to send raw private keys.

Public mutating backend routes now work in two ways only:
- managed demo actors configured on the deployment
- direct wallet signing from the browser or external agent wallet paths

That boundary matters for both judges and integrators.

## Kairen Stack Direction

DealRail is the execution desk inside the broader Kairen stack:
- `kairen.xyz` -> protocol shell
- `market` -> service discovery
- `x402n` -> negotiation and transcript layer
- `ForgeID / SIGNET` -> identity, prestige, access
- `DealRail` -> execution, settlement, and receipts

Canonical roadmap:
- [`docs/submission/07_ROADMAP.md`](docs/submission/07_ROADMAP.md)
- [`docs/strategy/ROADMAP.md`](docs/strategy/ROADMAP.md)

## Canonical Evidence

- [`STATUS.md`](STATUS.md)
- [`backend/TRANSACTION_LEDGER.md`](backend/TRANSACTION_LEDGER.md)
- [`docs/submission/03_EVIDENCE.md`](docs/submission/03_EVIDENCE.md)
- [`docs/submission/agent.json`](docs/submission/agent.json)
- [`docs/submission/agent_log.json`](docs/submission/agent_log.json)

## Verification

Root:

```bash
npm run check
npm run build
```

Backend:

```bash
cd backend
npm test
```

Frontend:

```bash
cd frontend
npm run lint
npm run type-check
npm run build
```

CLI:

```bash
cd cli
npm run build
npx @kairenxyz/dealrail help
```
