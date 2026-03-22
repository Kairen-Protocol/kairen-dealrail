# Celo

## Current Readiness

90%

## Why This Is Strong

DealRail is actually deployed and tested on Celo Sepolia.

That matters because the Celo story is not hypothetical:
- stable-token settlement path exists
- happy path exists
- reject path exists
- tx hashes are recorded

## Core Files

- [`contracts/script/DeployCeloSepolia.s.sol`](../../../contracts/script/DeployCeloSepolia.s.sol)
- [`backend/tests/test-lifecycle-celo-sepolia.ts`](../../../backend/tests/test-lifecycle-celo-sepolia.ts)
- [`backend/TRANSACTION_LEDGER.md`](../../../backend/TRANSACTION_LEDGER.md)
- [`frontend/src/lib/contracts.ts`](../../../frontend/src/lib/contracts.ts)

## Main Blocker

This is mostly a packaging blocker, not an implementation blocker.

## Fastest Resolution

Show the Celo happy and reject flows clearly in the final demo and submission.
