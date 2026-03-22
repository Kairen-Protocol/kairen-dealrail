# Track Matrix

This matrix is the current submission truth.

Scoring guide:
- `90-100%`: submit confidently
- `75-89%`: strong stretch track
- `50-74%`: real build exists, but sponsor-grade proof is incomplete
- below `50%`: roadmap only

| Track | Readiness | Core claim | Strongest files | Proof anchor | Main blocker | Next upgrade |
|------|-----------|------------|-----------------|--------------|--------------|--------------|
| Synthesis Open Track | 96% | DealRail is a real execution desk for agent commerce | `README.md`, `docs/submission/02_ARCHITECTURE.md`, `backend/src/index-simple.ts` | Base + Celo ledger flows | final video packaging | use locked demo script |
| Protocol Labs: Agents With Receipts / ERC-8004 | 93% | ERC-8004 changes execution behavior through hooks and verifier reads/writes | `contracts/src/identity/ERC8004Verifier.sol`, `contracts/src/DealRailHook.sol`, `contracts/test/EscrowRailERC20Hook.t.sol` | hook tests + deployments | clearer identity-facing proof artifact | add lookup / identity walkthrough |
| Virtuals: ERC-8183 Open Build | 93% | DealRail is built around an ERC-8183-style commerce flow | `contracts/src/EscrowRail.sol`, `contracts/src/EscrowRailERC20.sol`, `docs/submission/02_ARCHITECTURE.md` | Base + Celo escrow lifecycle | packaging only | keep protocol mapping explicit |
| Celo: Best Agent on Celo | 91% | multi-step settlement already works on Celo Sepolia | `contracts/script/DeployCeloSepolia.s.sol`, `backend/tests/test-lifecycle-celo-sepolia.ts` | Celo happy + reject txs | packaging only | show both flows in demo |
| AgentCash / x402 | 86% | DealRail proves a real paid request on testnet | `backend/tests/proof-x402-testnet.ts`, `docs/progress/X402_TESTNET_PROOF_2026-03-22.md` | settlement `0x8dfabc...` | only one canonical paid proof | add a second paid request if time remains |
| Protocol Labs: Let the Agent Cook | 82% | agents can operate the system from a published CLI and JSON mode | `cli/src/cli.ts`, `cli/src/types.ts`, `agent.json`, `agent_log.json` | recorded CLI run + existing onchain evidence | no fully autonomous onchain write loop yet | add one canonical autonomous accept/settle run |
| Base: Agent Services on Base | 78% | Base settlement and x402 paths are real | `backend/src/index-simple.ts`, `backend/TRANSACTION_LEDGER.md` | Base happy path + x402 proof | public service discovery proof is still demo-backed | expose a public paid service with canonical receipt |
| MetaMask Delegations | 62% | delegation payload builder exists and browser signing path is cleaner | `backend/src/services/delegation.service.ts`, `frontend/src/components/IntegrationsWorkbench.tsx` | payload builder only | no delegated tx hash | execute one delegated tx |
| Uniswap | 58% | post-settlement quote and tx builders exist | `backend/src/services/uniswap.service.ts`, `frontend/src/app/jobs/[jobId]/page.tsx` | build-only flow | no swap tx proof | execute one swap and log it |
| Locus | 42% | payout adapter exists | `backend/src/services/locus.service.ts`, `backend/src/services/execution.service.ts` | adapter surface only | no live proof | capture one real bridge call |

## Recommended Lock

Primary:
1. Synthesis Open Track
2. Protocol Labs: Agents With Receipts / ERC-8004
3. Virtuals: ERC-8183 Open Build
4. Celo: Best Agent on Celo
5. AgentCash / x402 on a testnet-only basis

Stretch:
6. Protocol Labs: Let the Agent Cook
