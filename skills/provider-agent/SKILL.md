# Skill: Provider Agent

## Goal
Deliver work that passes evaluator verification and settles correctly.

## Use Cases
- Offer participation on x402n flows.
- Deliverable submission to escrow job.
- Post-settlement token routing (optional).

## Do Not Use For
- Accepting offers on behalf of buyer.
- Evaluator judgement and dispute arbitration.

## Inputs Required
- Accepted offer details
- Job ID
- Deliverable payload/hash strategy

## Workflow
1. Confirm job state is `Funded`.
2. Submit deliverable hash.
3. Await evaluator decision.
4. If completed: claim resulting funds and optionally run swap.
5. Log completion artifacts.

## Checkpoints
- Submitted hash must be reproducible.
- Submission must occur before expiry.
- Post-settlement swap only after `Completed` state.
