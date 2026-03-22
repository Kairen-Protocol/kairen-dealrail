# DealRail Status

Last updated: 2026-03-22 (UTC)

## Live Product Status

- Frontend: live at `https://dealrail.kairen.xyz/`
- Backend: live at `https://kairen-dealrail-production.up.railway.app/`
- CLI package: published as `@kairenxyz/dealrail`
- Contracts: canonical testnet deployment set active on Base Sepolia and Celo Sepolia

## Capability Readiness

| Capability | Readiness | Note |
|-----------|-----------|------|
| Browser desk | 95% | Live and judge-ready |
| CLI / agent path | 92% | Published package plus `--json` mode |
| Backend API | 90% | Live and chain-aware |
| Base Sepolia escrow flow | 95% | Canonical testnet proof exists |
| Celo Sepolia escrow flow | 90% | Happy and reject proofs exist |
| ERC-8004 trust hooks | 90% | Verifier, hook, tests, deployments |
| x402 paid-request path | 85% | Real testnet proof exists |
| MetaMask delegation execution | 60% | Builder exists, no tx proof |
| Uniswap execution proof | 55% | Builder exists, no swap proof |
| Locus live proof | 45% | Bridge exists, proof missing |

## Track Readiness

| Track | Readiness | Current blocker |
|-------|-----------|-----------------|
| Open Track | 95% | final demo packaging |
| Protocol Labs ERC-8004 | 90% | one clearer identity artifact would help |
| Virtuals ERC-8183 | 92% | mostly packaging and protocol explanation |
| Celo | 90% | better demo emphasis |
| AgentCash / x402 | 85% | only one canonical paid proof so far |
| Let the Agent Cook | 70% | missing `agent.json` and `agent_log.json` |
| Base Agent Services on Base | 75% | discoverable service proof not canonical yet |
| MetaMask | 60% | no delegated tx proof |
| Uniswap | 55% | no swap tx proof |
| Locus | 45% | no live proof |

## Current Canonical Testnet Addresses

### Base Sepolia
- NullVerifier: `0xA61a57fF5570bF989a3a565B87b6421413995317`
- ERC8004Verifier: `0xDB23657606957B32B385eC0A917d2818156668AC`
- EscrowRail (native): `0x8c55C2BB6A396D3654f214726230D81e6fa22b69`
- EscrowRailERC20: `0xE25B10057556e9714d2ac60992b68f4E61481cF9`
- DealRailHook: `0x5fA109A74a688a49D254a21C2F3ab238E2A7F62e`

### Celo Sepolia
- NullVerifier: `0x8728dDDD3c1D7B901c62E9D6a232F17462a931E2`
- ERC8004Verifier: `0x2700e5B26909301967DFeECE9cb931B9bA3bA2df`
- EscrowRail (native): `0x684D32E03642870B88134A3722B0b094666EF42e`
- EscrowRailERC20: `0xB9dfa53326016415ca6fb9eb16A0f050c8d15C74`
- DealRailHook: `0x04B0D16f790A5F83dc48c7e4D05467ff2eA57519`

## Canonical Entry Points

### Human
- browser desk: `https://dealrail.kairen.xyz/`
- browser terminal: `/terminal`
- docs desk: `/docs`

### Agent

```bash
npx @kairenxyz/dealrail doctor --json
npx @kairenxyz/dealrail vend "automation benchmark report" --budget 0.12 --hours 24 --json
```

### Backend
- canonical server: `backend/src/index-simple.ts`
- chain-aware service layer: `backend/src/services/contract.service.ts`

## Verification Snapshot

Most recent verified repo checks:
- root `npm run check`
- backend `npm test`
- frontend `npm run lint`
- frontend `npm run type-check`
- frontend `npm run build`
- frontend `npm run build:worker`
- cli `npm run check`
- cli `npm run build`

## Canonical Evidence Sources

- `backend/TRANSACTION_LEDGER.md`
- `docs/progress/DEMO_VALIDATION_2026-03-22.md`
- `docs/progress/X402_TESTNET_PROOF_2026-03-22.md`
- `docs/submission/03_EVIDENCE.md`

## Next Product Priorities

1. add truthful `agent.json` and `agent_log.json`
2. tighten the final demo package for Open + ERC-8004 + Virtuals + Celo
3. upgrade only the tracks that can be backed by new recorded evidence
4. continue the Kairen stack integration roadmap through x402n, Market, and ForgeID
