# Protocol Labs: Let the Agent Cook

## Current Readiness

82%

## Why It Fits

DealRail already gives an agent:
- a published CLI package
- stable JSON output
- a live backend target
- a recorded autonomous operator run
- real onchain evidence the run can point to

## Strongest Files

- [`../../../cli/src/cli.ts`](../../../cli/src/cli.ts)
- [`../../../cli/src/types.ts`](../../../cli/src/types.ts)
- [`../agent.json`](../agent.json)
- [`../agent_log.json`](../agent_log.json)

## Main Remaining Blocker

The current recorded run is read-heavy and negotiation-heavy.
The missing proof is a fully autonomous write path that accepts and settles without a human wallet step.

## Honest Positioning

This is a credible stretch track now, not a placeholder.
The right claim is:
- agents can already inspect, query, and negotiate through the live stack
- autonomous settlement can go further, but it is not yet the strongest proof in the repo
