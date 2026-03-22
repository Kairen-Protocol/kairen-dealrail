# Protocol Labs: Let the Agent Cook

## Current Readiness

70%

This track is credible, but not yet fully packaged.

## Why It Already Fits

DealRail already has the right execution shape:
- agents can use the published CLI and SDK
- the CLI has stable `--json` output
- the browser and CLI both target the same live backend
- the product already follows a real loop:
  - discover
  - compare
  - execute
  - verify
  - record

## What Already Exists

- live agent package: `@kairenxyz/dealrail`
- stable machine path:
  - `npx @kairenxyz/dealrail doctor --json`
  - `npx @kairenxyz/dealrail status --json`
  - `npx @kairenxyz/dealrail vend ... --json`
- live backend API at `https://kairen-dealrail-production.up.railway.app/`
- real onchain receipts and settlement evidence
- AI-judge-friendly docs and local skill pack

## Main Blockers

The gap is not “does the agent path exist?”
The gap is “have we packaged it into the exact autonomy artifacts judges want?”

Missing canonical artifacts:
1. `agent.json`
2. `agent_log.json`
3. one structured autonomous run linked to real evidence
4. one explicit explanation of safety boundaries and compute/tool limits

## Fastest Resolution Path

To raise this track from 70% to 85%+:

1. add a truthful `agent.json`
2. add a truthful `agent_log.json`
3. capture one canonical run:
   - doctor
   - status
   - vend
   - evidence lookup
4. link the run to the live backend and ledger evidence

## Recommendation

This is the best stretch track because the remaining work is packaging, not inventing a new sponsor integration from scratch.
