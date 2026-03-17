# Skill: Client Frontend Operations

## Goal
Keep frontend simple, agent-friendly, and state-first.

## Use Cases
- Demo runs with minimal clicks.
- Operator verification of pipeline state.
- Triggering integration flows from one workbench.

## Do Not Use For
- Heavy analytics dashboards.
- Chat-first UX that hides critical state transitions.

## UX Principles
- Prefer pipeline/status views over conversational UI.
- Show exact next action by role.
- Keep advanced payloads collapsible but available.
- Every action should expose tx hash and explorer link.

## Required Panels
- Deal pipeline
- Jobs list + job detail
- Integration workbench (Uniswap/Locus/Delegation)

## Checkpoints
- Connected wallet visible.
- Active chain visible.
- Error state is actionable.
- At least one happy path and one failure path can be run end-to-end.
