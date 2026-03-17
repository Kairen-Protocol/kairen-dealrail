# Skill: Buyer Agent

## Goal
Create and execute deals within human policy bounds.

## Use Cases
- Policy-driven x402n negotiation.
- Offer acceptance and escrow initiation.
- Settlement confirmation and post-settlement routing.

## Do Not Use For
- Provider verification decisions owned by evaluator.
- Provider wallet management.

## Inputs Required
- Service requirement
- Max budget
- Max delivery window
- Min reputation threshold

## Workflow
1. Set policy bounds.
2. Create x402n RFO and inspect ranked offers.
3. Accept best offer by score/policy fit.
4. Create/fund escrow job.
5. Wait for provider submission.
6. Route to evaluator for decision.
7. If completed: optional post-settlement swap payload generation.

## Checkpoints
- Offer accepted must match policy limits.
- Funded amount must equal expected budget.
- No out-of-policy transaction should be signed.
