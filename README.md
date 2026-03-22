# Kairen DealRail

DealRail is an Ethereum-first execution desk for agent commerce. It gives humans and agents a shared way to discover a provider, compare offers, lock stablecoins in escrow, settle on delivery, and attach trust signals through ERC-8004-aware hooks.

Live surfaces:
- Browser desk: `https://dealrail.kairen.xyz/`
- Backend API: `https://kairen-dealrail-production.up.railway.app/`
- npm package: `@kairenxyz/dealrail`

## What This Feels Like

Three scenarios explain the product faster than the standards do.

1. Human buyer
   A founder needs an automation benchmark report. They open the browser desk, inspect the provider lane, fund a job in testnet USDC, wait for a deliverable, and let an evaluator complete or reject the work.

2. Agent buyer
   An agent runs `dealrail vend ... --json`, reads ranked offers, decides whether to pay instantly or move into escrow, and keeps a structured receipt trail it can hand to another system.

3. Kairen stack future state
   `market` discovers supply, `x402n` handles negotiation and transcripts, `DealRail` settles and records receipts, and `ForgeID / Signet` becomes the portable identity and prestige layer behind ERC-8004-compatible trust.

## Judge Fast Path

Read these in order:

1. [`docs/submission/00_JUDGE_PROOF_PATH.md`](docs/submission/00_JUDGE_PROOF_PATH.md)
2. [`docs/submission/00_START_HERE.md`](docs/submission/00_START_HERE.md)
3. [`docs/submission/01_TRACK_MATRIX.md`](docs/submission/01_TRACK_MATRIX.md)
4. [`docs/submission/03_EVIDENCE.md`](docs/submission/03_EVIDENCE.md)
5. [`docs/submission/08_DEMO_SCRIPT.md`](docs/submission/08_DEMO_SCRIPT.md)
6. [`docs/submission/07_ROADMAP.md`](docs/submission/07_ROADMAP.md)

Agent-specific navigation:
- [`AGENT.md`](AGENT.md)
- [`docs/submission/agent.json`](docs/submission/agent.json)
- [`docs/submission/agent_log.json`](docs/submission/agent_log.json)

## Human And Agent Quickstart

Human path:

```bash
npx @kairenxyz/dealrail help
npx @kairenxyz/dealrail doctor
```

Agent path:

```bash
DEALRAIL_API_URL=https://kairen-dealrail-production.up.railway.app npx @kairenxyz/dealrail doctor --json
DEALRAIL_API_URL=https://kairen-dealrail-production.up.railway.app npx @kairenxyz/dealrail status --json
DEALRAIL_API_URL=https://kairen-dealrail-production.up.railway.app npx @kairenxyz/dealrail vend "automation benchmark report" --budget 0.12 --hours 24 --json
```

Local backend fallback:

```bash
cd backend
npm run build
node dist/index-simple.js

DEALRAIL_API_URL=http://localhost:3001 npx @kairenxyz/dealrail doctor --json
```

## What Is Proven Now

The project is strongest when described as a real escrow-and-receipts system with a polished operator surface.

| Track | Readiness | What is actually proven | Main blocker |
|------|-----------|--------------------------|--------------|
| Synthesis Open Track | 96% | Browser desk, CLI, backend, Base + Celo evidence | Final video packaging |
| Protocol Labs: Agents With Receipts / ERC-8004 | 93% | Verifier, hook, hook tests, live deployments | Better identity-facing demo artifact |
| Virtuals: ERC-8183 Open Build | 93% | ERC-8183-style escrow lifecycle and evaluator flow | Packaging only |
| Celo: Best Agent on Celo | 91% | Celo Sepolia happy + reject paths | Packaging only |
| AgentCash / x402 | 86% | Real paid-request proof on Base Sepolia | Only one canonical proof |
| Protocol Labs: Let the Agent Cook | 82% | Published CLI, JSON mode, agent artifacts, recorded run | More autonomous write-path evidence |
| Base: Agent Services on Base | 78% | Base settlement rails and x402 proof | Public service discovery proof still light |
| MetaMask Delegations | 62% | Delegation payload builder | No delegated tx in ledger |
| Uniswap | 58% | Quote and transaction builders | No swap tx in ledger |
| Locus | 42% | Bridge adapter exists | No live proof in ledger |

Full matrix:
- [`docs/submission/01_TRACK_MATRIX.md`](docs/submission/01_TRACK_MATRIX.md)

## Important Truths

- Public API routes no longer ask clients to send raw private keys.
- Demo settlement routes use server-managed demo actors only when the onchain job matches those configured actors.
- For everyone else, the correct path is browser wallet signing or `/api/v1/jobs/simulate`.
- In mock mode, provider discovery and negotiation now use the same curated demo catalog, so the vend story and the discovery story do not contradict each other.

## Proof Anchors

- Base Sepolia and Celo Sepolia tx ledger: [`backend/TRANSACTION_LEDGER.md`](backend/TRANSACTION_LEDGER.md)
- Deployment summary: [`STATUS.md`](STATUS.md)
- Contract addresses used by backend: [`backend/src/config.ts`](backend/src/config.ts)
- Contract addresses used by frontend: [`frontend/src/lib/contracts.ts`](frontend/src/lib/contracts.ts)
- Contract tests: [`contracts/test`](contracts/test)
- x402 proof: [`docs/progress/X402_TESTNET_PROOF_2026-03-22.md`](docs/progress/X402_TESTNET_PROOF_2026-03-22.md)
- Agent autonomy artifacts: [`docs/submission/agent.json`](docs/submission/agent.json), [`docs/submission/agent_log.json`](docs/submission/agent_log.json)

## Architecture In One Pass

```text
human -> browser desk ----\
                           -> discovery -> negotiation -> escrow or machine payment -> evaluator -> receipt
agent -> npm cli / json --/

future Kairen stack:
kairen.xyz shell -> market discovery -> x402n negotiation -> DealRail execution -> ForgeID / Signet trust
```

Detailed docs:
- [`docs/submission/02_ARCHITECTURE.md`](docs/submission/02_ARCHITECTURE.md)
- [`docs/submission/06_VISUAL_ARCHITECTURE.md`](docs/submission/06_VISUAL_ARCHITECTURE.md)

## Verification

Root:

```bash
npm run check
npm run build
npm run test:contracts
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

Contracts:

```bash
npm run test:contracts
```

Expected contract result:
- `22 tests passed`

## Repo Map

- [`frontend`](frontend): live Cloudflare browser desk
- [`backend`](backend): Railway API and testnet execution surface
- [`cli`](cli): published npm package and JSON operator mode
- [`contracts`](contracts): escrow, hook, verifier, and Foundry tests
- [`docs/submission`](docs/submission): canonical judge pack
- [`docs/strategy`](docs/strategy): planning and future-state material
