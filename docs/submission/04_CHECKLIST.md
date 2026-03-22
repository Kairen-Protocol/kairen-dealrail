# Submission Checklist

This is the final submission checklist with percentage-based track posture.

## Submission Metadata Lock

Use these values consistently across Devfolio, README, demo, and video.

| Field | Locked value |
|------|--------------|
| Live frontend | `https://dealrail.kairen.xyz/` |
| Live backend | `https://kairen-dealrail-production.up.railway.app/` |
| npm package | `@kairenxyz/dealrail` |
| Primary thesis | Ethereum agent commerce execution desk |
| Core standards | ERC-8183-style escrow flow + ERC-8004 trust hooks |
| Human path | browser desk |
| Agent path | CLI / `--json` |

## Official Submission Requirements

| Item | Status | Note |
|------|--------|------|
| Public repo | Done | this repo |
| Live product URL | Done | frontend deployed |
| Live API URL | Done | backend deployed |
| Description and problem statement | Ready | use the locked wording from README and `05_WINNING_STRATEGY.md` |
| Conversation log | Required | keep truthful |
| Submission metadata consistency | Required | use the table above |
| Video URL | Pending | still the main final blocker |

## Repo Readiness

| Item | Status | Evidence |
|------|--------|----------|
| Base Sepolia evidence | Done | [`../../backend/TRANSACTION_LEDGER.md`](../../backend/TRANSACTION_LEDGER.md) |
| Celo Sepolia evidence | Done | [`../../backend/TRANSACTION_LEDGER.md`](../../backend/TRANSACTION_LEDGER.md) |
| x402 proof | Done on testnet | [`../progress/X402_TESTNET_PROOF_2026-03-22.md`](../progress/X402_TESTNET_PROOF_2026-03-22.md) |
| Contract tests reproducible | Done | `npm run test:contracts` |
| Public API trust boundary fixed | Done | raw-key routes removed from public contract |
| Judge pack | Done | `docs/submission` |
| Agent pack | Done | `agent.json`, `agent_log.json` |

## Prize Readiness

| Track | Readiness | Blocker |
|------|-----------|---------|
| Open Track | 96% | final video |
| Protocol Labs ERC-8004 | 93% | better identity-facing demo moment |
| Virtuals ERC-8183 | 93% | packaging only |
| Celo | 91% | packaging only |
| AgentCash / x402 | 86% | only one canonical paid proof |
| Let the Agent Cook | 82% | no autonomous onchain write run yet |
| Base Agent Services | 78% | public paid service proof still light |
| MetaMask | 62% | delegated tx missing |
| Uniswap | 58% | swap tx missing |
| Locus | 42% | live proof missing |

## Final Remaining Items

1. Publish or attach the final demo video.
2. Keep only the locked primary tracks unless new proof is recorded.
3. If stretching for more prizes, upgrade MetaMask or Uniswap with one real tx, not more docs.
