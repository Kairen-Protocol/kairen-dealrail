# Start Here

This is the canonical submission entry point for DealRail.

## One-Line Thesis

DealRail is an Ethereum machine-commerce execution desk:
- discover providers
- negotiate or shortlist
- pay instantly or commit to escrow
- submit work
- complete or reject
- keep a receipt and trust trail

Live surfaces:
- Browser desk: `https://dealrail.kairen.xyz/`
- Backend API: `https://kairen-dealrail-production.up.railway.app/`
- npm package: `@kairenxyz/dealrail`

## The Fastest Way To Understand It

Think in scenarios, not standards.

1. Human buyer
   A startup founder needs an automation benchmark report, funds a stablecoin escrow, and only releases payment after evaluator approval.

2. Agent buyer
   An agent runs `vend ... --json`, gets structured offers, and hands a machine-readable receipt to another runtime.

3. Future Kairen stack
   `market` discovers, `x402n` negotiates, `DealRail` settles, and `ForgeID / Signet` becomes the cross-surface trust layer.

## Judge Snapshot

These are readiness percentages, not code coverage.

| Track | Readiness | Meaning |
|------|-----------|---------|
| Synthesis Open Track | 96% | submit confidently |
| Protocol Labs: Agents With Receipts / ERC-8004 | 93% | strong sponsor fit |
| Virtuals: ERC-8183 Open Build | 93% | direct protocol fit |
| Celo: Best Agent on Celo | 91% | strong third track |
| AgentCash / x402 | 86% | strong on testnet |
| Protocol Labs: Let the Agent Cook | 82% | now packaged credibly |
| Base: Agent Services on Base | 78% | credible stretch |
| MetaMask Delegations | 62% | builder exists, tx proof missing |
| Uniswap | 58% | builder exists, swap proof missing |
| Locus | 42% | adapter exists, live proof missing |

## Read In This Order

1. [`00_JUDGE_PROOF_PATH.md`](00_JUDGE_PROOF_PATH.md)
2. [`01_TRACK_MATRIX.md`](01_TRACK_MATRIX.md)
3. [`03_EVIDENCE.md`](03_EVIDENCE.md)
4. [`08_DEMO_SCRIPT.md`](08_DEMO_SCRIPT.md)
5. [`07_ROADMAP.md`](07_ROADMAP.md)
6. [`agent.json`](agent.json)
7. [`agent_log.json`](agent_log.json)

## Human And Agent Quick Path

Human:

```bash
npx @kairenxyz/dealrail help
npx @kairenxyz/dealrail doctor
```

Agent:

```bash
DEALRAIL_API_URL=https://kairen-dealrail-production.up.railway.app npx @kairenxyz/dealrail doctor --json
DEALRAIL_API_URL=https://kairen-dealrail-production.up.railway.app npx @kairenxyz/dealrail status --json
```

## Important Boundary

- Public API routes do not accept raw private keys.
- Demo execution routes only use managed demo actors for matching demo jobs.
- Wallet signing and `/api/v1/jobs/simulate` remain the correct public execution paths.
- In mock mode, discovery and negotiation share the same provider catalog.
