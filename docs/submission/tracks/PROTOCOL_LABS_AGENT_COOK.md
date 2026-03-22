# Protocol Labs: Let the Agent Cook

## Readiness

High

## Why It Fits

DealRail already has the right shape for an agent-native product:
- published CLI package
- stable JSON outputs
- live backend
- live browser desk that matches the same backend
- a reproducible operator loop

That loop is:
- preflight
- inspect state
- create negotiation
- verify receipts

## Canonical Proof

- package: `@kairenxyz/dealrail`
- live backend: `https://kairen-dealrail-production.up.railway.app/`
- agent descriptor: [`../agent.json`](../agent.json)
- agent log: [`../agent_log.json`](../agent_log.json)
- validated CLI run: [`../../progress/DEMO_VALIDATION_2026-03-22.md`](../../progress/DEMO_VALIDATION_2026-03-22.md)

## Honest Boundary

The agent path is real.
What it does not yet claim is a fully autonomous live onchain settlement loop for arbitrary third-party wallets through the public backend.

That is acceptable because the current proof is about:
- a real operator surface
- a real machine-readable interface
- a truthful autonomous workflow artifact pack
