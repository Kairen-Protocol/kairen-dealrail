# Track Fit Matrix (Submission QA)

Date: 2026-03-22
Project: Kairen DealRail

Purpose: map implemented features to currently selected Synthesis tracks and keep claims grounded in repository evidence.

## Selected tracks (10)

1. Synthesis Open Track
2. Agents With Receipts — ERC-8004
3. 🤖 Let the Agent Cook — No Humans Required
4. ERC-8183 Open Build
5. Best Agent on Celo
6. Agent Services on Base
7. Escrow Ecosystem Extensions
8. Agentic Finance (Best Uniswap API Integration)
9. Best Use of Locus
10. Agents that pay

## Evidence mapping

### ERC-8183 Open Build
- README standards table references ERC-8183 implementation
- Contracts: `contracts/src/EscrowRail.sol`, `contracts/src/EscrowRailERC20.sol`

### Agents With Receipts — ERC-8004
- README standards table references ERC-8004 integration
- Contracts: `contracts/src/identity/ERC8004Verifier.sol`, `contracts/src/DealRailHook.sol`

### Agent Services on Base
- Base Sepolia deployments and explorer links documented in README and STATUS
- Backend lifecycle and API routes operational around Base deployment

### Best Agent on Celo
- Celo Sepolia deployment addresses in STATUS
- Smoke script: `backend/tests/test-lifecycle-celo-sepolia.ts`

### Escrow Ecosystem Extensions / Agents that pay
- Escrow lifecycle and payment states implemented (`create/fund/submit/complete/reject/refund`)
- Transaction ledger: `backend/TRANSACTION_LEDGER.md`

### Agentic Finance (Uniswap)
- Service implementation: `backend/src/services/uniswap.service.ts`
- README notes quote + tx builder endpoint support

### Best Use of Locus
- Service implementation: `backend/src/services/locus.service.ts`
- README notes Locus payment bridge endpoint (mock/live)

### Let the Agent Cook / Synthesis Open Track
- End-to-end autonomous flow with human guardrails captured in docs
- Collaboration/process narrative available in project docs and submission conversation log

## Risk notes
- Keep claims limited to implemented/tested scope.
- For any sponsor-specific requirement changes, update this matrix and submission copy together.
