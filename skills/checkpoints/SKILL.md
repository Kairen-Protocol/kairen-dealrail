# Skill: Deal Checkpoints

## Goal
Ensure every deal run reaches verifiable checkpoints for judging and operations.

## Use Cases
- Hackathon demo readiness checks.
- Runbook for human + agent collaboration.
- Preventing “almost works” flows.

## Do Not Use For
- Detailed threat modeling.
- Protocol governance process.

## Phase Checkpoints

### Before Deal
1. Wallets funded and roles assigned (buyer/provider/evaluator).
2. Chain + contract addresses confirmed.
3. Policy bounds set (budget, delivery time, min reputation).

### Negotiation
1. RFO created.
2. Ranked offers visible.
3. Accepted offer persisted with provider/evaluator addresses.

### Escrow Execution
1. Job created onchain.
2. Job funded with expected amount.
3. Provider submit action succeeds.

### Decision
1. Evaluator approves or rejects exactly once.
2. Final state observed onchain (`Completed` or `Rejected`).

### Post-Settlement
1. Optional Uniswap payloads generated from completed job.
2. Optional swap executed by wallet.
3. Explorer links captured for every critical tx.

## Exit Criteria
- Happy path completed end-to-end.
- Failure path demonstrated (reject and refund path).
- README/docs include standards, addresses, and links.
