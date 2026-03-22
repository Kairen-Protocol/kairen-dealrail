# Uniswap

## Current Readiness

55%

## Current State

The repo contains quote and transaction-building logic, and current official Uniswap docs now support Base Sepolia through the Trading API, but the canonical ledger does not yet include an executed Uniswap swap tx.

## Core File

- [`backend/src/services/uniswap.service.ts`](../../../backend/src/services/uniswap.service.ts)

## Main Blocker

No sponsor-grade swap artifact exists yet:
- no executed swap
- no tx hash
- no `UNISWAP_API_KEY`-backed proof in the ledger

## Fastest Resolution

Add the API key, execute one Base Sepolia swap, and record the tx hash plus a short explanation of why post-settlement swapping matters in DealRail.
