# AgentCash / x402

## Current Readiness

85%

This is strong on a truthful testnet basis.

## Why It Counts

The repo now includes canonical proof of a real paid x402 request on Base Sepolia testnet, in addition to the existing x402 proxy path and x402n negotiation surfaces.

## Core Files

- [`backend/src/services/x402n.service.ts`](../../../backend/src/services/x402n.service.ts)
- [`backend/src/services/x402.service.ts`](../../../backend/src/services/x402.service.ts)
- [`backend/src/index-simple.ts`](../../../backend/src/index-simple.ts)
- [`backend/tests/proof-x402-testnet.ts`](../../../backend/tests/proof-x402-testnet.ts)
- [`backend/TRANSACTION_LEDGER.md`](../../../backend/TRANSACTION_LEDGER.md)

## Canonical Proof

1. paid request sent on `eip155:84532`
2. payment completed successfully
3. settlement tx recorded in the canonical ledger:
   - `0x8dfabc6a77205b0740aa7bc48e230b7516acc76295536d18a6a30db19476940c`

## Main Blocker

The main gap to 100% is not basic functionality.
It is breadth:
- only one canonical paid proof is recorded
- the story is still testnet-first

## Fastest Resolution

Add one more paid request or a clearly discoverable public paid service proof.
