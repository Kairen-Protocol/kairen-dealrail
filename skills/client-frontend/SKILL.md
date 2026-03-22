---
name: client-frontend
description: Use for frontend UX operation: simple human navigation and agent-mode tooling with explicit state visibility.
---

# Client Frontend Operations

## Navigation Model
- Human Mode:
  - Start with `/docs` and select the human toggle.
  - Run deal pipeline first (policy -> negotiation -> confirmation -> tracking).
  - Manage jobs second.
  - Keep discovery/integrations in advanced section.
- Agent Mode:
  - Start with `/SKILL.md` or the agent toggle in `/docs`.
  - Move to `/base`, provider discovery, or terminal depending on the task.
  - Use integrations workbench for payload ops.
  - Validate final onchain state in jobs list.

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
- Never ask for raw private keys, seed phrases, or mnemonics in the UI copy or helper flow.

## Required Panels
- Human Mode: Deal pipeline + Jobs list
- Agent Mode: Discovery + Integration workbench + Jobs list
- Shared reference: `/SKILL.md` public index + `/base` public Base service directory

## Checkpoints
- Connected wallet visible.
- Active chain visible.
- Error state is actionable.
- At least one happy path and one failure path can be run end-to-end.
