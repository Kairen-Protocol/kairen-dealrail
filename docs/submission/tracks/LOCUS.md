# Locus

## Current Readiness

45%

## Current State

The bridge exists, but the canonical evidence pack does not include a live Locus payment artifact and the default posture remains mock-first.

## Core Files

- [`backend/src/services/locus.service.ts`](../../../backend/src/services/locus.service.ts)
- [`backend/src/services/execution.service.ts`](../../../backend/src/services/execution.service.ts)

## Main Blocker

No live operation proof is recorded, and the current demo does not depend on Locus.

## Fastest Resolution

Only upgrade this track if a real Locus operation is executed and logged with a durable proof artifact.
