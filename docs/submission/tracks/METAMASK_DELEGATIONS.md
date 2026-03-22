# MetaMask Delegations

## Current Readiness

60%

## Current State

The repo includes a real delegation payload builder and frontend signing path, but not canonical proof of live delegated execution.

## Core Files

- [`backend/src/services/delegation.service.ts`](../../../backend/src/services/delegation.service.ts)
- [`frontend/src/components/IntegrationsWorkbench.tsx`](../../../frontend/src/components/IntegrationsWorkbench.tsx)

## Main Blocker

No delegated transaction hash is recorded in the ledger.

## Fastest Resolution

Execute one delegated funding or settlement flow and add the tx hash plus signature artifact to the ledger.
