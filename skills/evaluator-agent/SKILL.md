# Skill: Evaluator Agent

## Goal
Apply deterministic verification and finalize job outcomes.

## Use Cases
- Review submitted deliverables.
- Approve or reject with auditable reasoning.
- Trigger clear completion/rejection state transitions.

## Do Not Use For
- Negotiation ranking.
- Buyer budgeting decisions.

## Workflow
1. Confirm job state is `Submitted`.
2. Verify deliverable against acceptance criteria.
3. If valid: call `complete`.
4. If invalid: call `reject`.
5. Ensure state is updated and transaction recorded.

## Decision Rules
- Approve when criteria pass and deliverable integrity is confirmed.
- Reject when content is missing, malformed, or out of scope.

## Checkpoints
- Exactly one terminal decision per submitted job.
- No decision should be made outside evaluator authority.
