# Submission Checklist

This checklist combines official submission requirements with repo-state verification.

## Official Submission Requirements

Derived from `https://synthesis.devfolio.co/submission/skill.md`.

| Item | Status | Evidence / Note |
|------|--------|-----------------|
| Registered participant identity | User-stated | User indicated registration is already done; not independently verified in repo |
| Self-custody transfer complete for publish | User-stated | Confirm in submission dashboard before publish |
| Team exists | User-stated | Official flow says a team is auto-created at registration |
| At least one track selected | Done | Track lock is documented in [`01_TRACK_MATRIX.md`](01_TRACK_MATRIX.md) |
| Public repo | Done | This GitHub repo is submission-ready |
| Description and problem statement | Ready | Use [`05_WINNING_STRATEGY.md`](05_WINNING_STRATEGY.md) |
| Conversation log | Required | Must be truthful and complete in submission payload |
| Submission metadata | Required | Must accurately list tools, skills, resources actually used |
| Deployed URL | Done | Frontend and backend are both live |
| Video URL | Pending | Still the biggest remaining publish blocker |

## Repo Readiness

| Item | Status | Evidence |
|------|--------|----------|
| Canonical deployment addresses aligned | Done | [`STATUS.md`](../../STATUS.md), [`backend/src/config.ts`](../../backend/src/config.ts), [`frontend/src/lib/contracts.ts`](../../frontend/src/lib/contracts.ts) |
| Base Sepolia onchain evidence | Done | [`backend/TRANSACTION_LEDGER.md`](../../backend/TRANSACTION_LEDGER.md) |
| Celo Sepolia onchain evidence | Done | [`backend/TRANSACTION_LEDGER.md`](../../backend/TRANSACTION_LEDGER.md) |
| x402 paid request evidence | Done on testnet | [`backend/TRANSACTION_LEDGER.md`](../../backend/TRANSACTION_LEDGER.md), [`docs/progress/X402_TESTNET_PROOF_2026-03-22.md`](../progress/X402_TESTNET_PROOF_2026-03-22.md) |
| Happy path demonstrated | Done | Base and Celo tx hashes recorded |
| Reject path demonstrated | Done | Celo reject flow recorded |
| Contract hardening tests | Done | [`contracts/test/EscrowRailERC20Hook.t.sol`](../../contracts/test/EscrowRailERC20Hook.t.sol) |
| Browser desk live | Done | `https://dealrail.kairen.xyz/` |
| Backend live | Done | `https://kairen-dealrail-production.up.railway.app/` |
| Agent install path live | Done | `@kairenxyz/dealrail` |
| Judge-facing docs aligned | Done | `docs/submission`, `README.md`, `AGENT.md` |

## Prize Readiness

These percentages are submission-readiness estimates.

| Track | Readiness | Current blocker | Resolution path |
|-------|-----------|-----------------|-----------------|
| Open Track | 95% | Final demo packaging | Record one clean live walkthrough |
| Protocol Labs ERC-8004 | 90% | Could use one clearer identity artifact in the evidence pack | Add one explicit identity lookup or registration artifact |
| Virtuals ERC-8183 Open Build | 92% | Could use tighter protocol mapping language | Keep the ERC-8183 mapping explicit in the final narrative |
| Celo | 90% | Mostly packaging, not implementation | Show the Celo happy + reject flow in the demo |
| AgentCash / x402 | 85% | Only one canonical paid proof so far | Add one more paid request if time allows |
| Protocol Labs Let the Agent Cook | 70% | Missing `agent.json` and `agent_log.json` | Add truthful autonomy artifacts |
| Base Agent Services on Base | 75% | Discoverable service proof is not canonical yet | Expose and log a clear public paid service on Base |
| MetaMask | 60% | No delegated tx in the ledger | Execute one delegated transaction |
| Uniswap | 55% | No real swap tx in the ledger | Execute one Base Sepolia swap with a real API key |
| Locus | 45% | No live Locus proof | Only claim if one live operation is captured |

## Final Remaining Blockers

1. Publish or link the final demo video.
2. Confirm self-custody transfer status in the submission system.
3. If claiming Let the Agent Cook, add honest `agent.json` and `agent_log.json`.
4. Do not claim MetaMask, Uniswap, or Locus beyond the percentages shown unless new proof is recorded.

## Recommended Final Track Lock

Lock these unless new sponsor-specific evidence is added:

1. Synthesis Open Track
2. Protocol Labs: Agents With Receipts / ERC-8004
3. Virtuals: ERC-8183 Open Build
4. Celo: Best Agent on Celo
5. AgentCash / x402 on a testnet-only basis
