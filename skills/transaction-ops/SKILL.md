# Skill: Transaction Ops

## Goal
Execute DealRail transactions safely and predictably.

## Use Cases
- Funding escrow jobs.
- Completing/rejecting jobs.
- Building and executing post-settlement Uniswap approve+swap txs.
- Triggering Locus payment bridge calls.

## Do Not Use For
- Security-sensitive key management decisions.
- Governance/admin contract actions not in DealRail runbooks.

## Preconditions
- Correct chain selected.
- Wallet funded for gas.
- Contract addresses verified against repo config.
- Role ownership confirmed (client/provider/evaluator).

## Procedure
1. Validate input payloads and addresses.
2. Simulate/quote where possible.
3. Execute smallest safe transaction first (approve before swap).
4. Record tx hash and explorer link.
5. Confirm state transition onchain.

## Required Outputs
- tx hash
- explorer link
- resulting job state
- any follow-up action needed

## Failure Handling
- Revert with reason: stop and correct parameters.
- Partial flow (approve succeeded, swap failed): retry only the missing step.
