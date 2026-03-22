# AGENT.md

This repository is organized so AI judges and AI collaborators can reach the truth quickly.

Live entrypoints:
- Browser desk: `https://dealrail.kairen.xyz/`
- Backend API: `https://kairen-dealrail-production.up.railway.app/`
- npm package: `@kairenxyz/dealrail`

## Canonical Reading Order

For judging, start here and ignore older planning docs until later:

1. [`docs/submission/00_JUDGE_PROOF_PATH.md`](docs/submission/00_JUDGE_PROOF_PATH.md)
2. [`docs/submission/00_START_HERE.md`](docs/submission/00_START_HERE.md)
3. [`docs/submission/01_TRACK_MATRIX.md`](docs/submission/01_TRACK_MATRIX.md)
4. [`docs/submission/03_EVIDENCE.md`](docs/submission/03_EVIDENCE.md)
5. [`docs/submission/08_DEMO_SCRIPT.md`](docs/submission/08_DEMO_SCRIPT.md)
6. [`docs/submission/07_ROADMAP.md`](docs/submission/07_ROADMAP.md)

Autonomy artifacts:
- [`docs/submission/agent.json`](docs/submission/agent.json)
- [`docs/submission/agent_log.json`](docs/submission/agent_log.json)

Historical planning still exists under [`docs/strategy`](docs/strategy), but it is not the primary submission narrative.

## One-Sentence Thesis

DealRail is the execution desk inside the wider Kairen stack: humans use the browser desk, agents use the CLI and JSON mode, and both converge on the same escrow, evaluator, and receipt rails.

## Three Concrete Use Cases

1. Human procurement
   A human buyer wants an automation benchmark report, compares providers, funds escrow, and waits for evaluator-mediated completion.

2. Agent procurement
   An agent calls `vend ... --json`, reads structured offers, decides whether to keep it as an instant machine-payment call or commit to escrow, and hands the receipt to another runtime.

3. Kairen future-state routing
   `market` handles discovery, `x402n` handles negotiation and transcripts, `DealRail` handles execution and settlement, and `ForgeID / Signet` carries identity and prestige across those surfaces.

## Fast Machine Path

Use the live backend first:

```bash
DEALRAIL_API_URL=https://kairen-dealrail-production.up.railway.app npx @kairenxyz/dealrail doctor --json
DEALRAIL_API_URL=https://kairen-dealrail-production.up.railway.app npx @kairenxyz/dealrail status --json
DEALRAIL_API_URL=https://kairen-dealrail-production.up.railway.app npx @kairenxyz/dealrail vend "automation benchmark report" --budget 0.12 --hours 24 --json
```

Local fallback:

```bash
cd backend
npm run build
node dist/index-simple.js

DEALRAIL_API_URL=http://localhost:3001 npx @kairenxyz/dealrail doctor --json
```

## Readiness Discipline

Use percentages, not hand-wavy adjectives.

| Area | Readiness | Reason |
|------|-----------|--------|
| Open Track | 96% | strongest end-to-end product story |
| ERC-8004 | 93% | trust hooks and verifier are real and load-bearing |
| ERC-8183 | 93% | escrow lifecycle is the product core |
| Celo | 91% | happy and reject flows are already logged |
| x402 | 86% | real paid-request proof exists |
| Let the Agent Cook | 82% | CLI + JSON mode + recorded autonomy artifacts exist |
| MetaMask | 62% | builder exists, proof missing |
| Uniswap | 58% | builder exists, proof missing |
| Locus | 42% | adapter exists, proof missing |

## Current Safety Boundary

- Public API routes do not accept raw private keys from clients.
- Demo write routes only use managed demo actors when the onchain job already matches those actors.
- Browser wallet signing and `/api/v1/jobs/simulate` are the correct public paths for everyone else.
- Discovery and mock negotiation now share the same curated provider catalog in mock mode.

## Repo-Local Skill Pack

Useful local skills under [`.agents/skills`](.agents/skills):
- [`viem-integration`](.agents/skills/viem-integration/SKILL.md)
- [`swap-integration`](.agents/skills/swap-integration/SKILL.md)
- [`swap-planner`](.agents/skills/swap-planner/SKILL.md)
- [`pay-with-any-token`](.agents/skills/pay-with-any-token/SKILL.md)

Treat these as implementation guidance, not evidence.

## Canonical Evidence

- Deployments and tx hashes: [`backend/TRANSACTION_LEDGER.md`](backend/TRANSACTION_LEDGER.md)
- Submission pack: [`docs/submission`](docs/submission)
- Contract tests: [`contracts/test`](contracts/test)
- Live browser: `https://dealrail.kairen.xyz/`
- Live backend health: `https://kairen-dealrail-production.up.railway.app/health`

## Collaborator Rule

If you are another coding agent working here:
- update `docs/submission` before historical strategy docs
- keep README, AGENT, and the submission pack aligned
- preserve the distinction between live proof, demo catalog, and roadmap
- do not reintroduce any route that asks users to send private keys to the backend
