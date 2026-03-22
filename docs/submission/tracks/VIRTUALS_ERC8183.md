# Virtuals: ERC-8183 Open Build

## Current Readiness

92%

## Why The Fit Is Strong

DealRail is directly inside the ERC-8183 design space:
- negotiated machine commerce
- onchain escrow
- evaluator-mediated settlement
- recorded receipt flow

This is not an adjacent fit or a sponsor-name stretch.

## Core Files

- [`contracts/src/EscrowRail.sol`](../../../contracts/src/EscrowRail.sol)
- [`contracts/src/EscrowRailERC20.sol`](../../../contracts/src/EscrowRailERC20.sol)
- [`backend/src/index-simple.ts`](../../../backend/src/index-simple.ts)
- [`backend/TRANSACTION_LEDGER.md`](../../../backend/TRANSACTION_LEDGER.md)
- [`docs/submission/02_ARCHITECTURE.md`](../02_ARCHITECTURE.md)

## Main Blocker

The remaining gap is mostly judge packaging:
- one tighter explanation of how the current state machine maps to ERC-8183-style commerce objects

## Fastest Resolution

Keep the ERC-8183 mapping explicit in the final demo and roadmap docs.
