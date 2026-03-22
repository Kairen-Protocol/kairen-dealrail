# Virtuals: ERC-8183 Open Build

## Current Status

Ready for a strong claim.

DealRail is directly inside the ERC-8183 design space: negotiated machine commerce, onchain escrow, evaluator-mediated settlement, and recorded receipt flow. This is not an adjacent fit or a sponsor-name stretch.

## Why The Fit Is Strong

- ERC-8183-style escrow is core to the product, not a side demo.
- The repo contains real testnet evidence on Base Sepolia and Celo Sepolia.
- The browser desk, backend API, and published CLI all route into the same commerce rail.

## Core Files

- [`contracts/src/EscrowRail.sol`](../../../contracts/src/EscrowRail.sol)
- [`contracts/src/EscrowRailERC20.sol`](../../../contracts/src/EscrowRailERC20.sol)
- [`backend/src/index-simple.ts`](../../../backend/src/index-simple.ts)
- [`backend/TRANSACTION_LEDGER.md`](../../../backend/TRANSACTION_LEDGER.md)
- [`docs/submission/02_ARCHITECTURE.md`](../02_ARCHITECTURE.md)

## Canonical Evidence

- Base Sepolia happy-path escrow flow in the ledger
- Celo Sepolia happy-path and reject-path flows in the ledger
- live browser desk at `https://dealrail.kairen.xyz/`
- published npm package `@kairenxyz/dealrail`

## Recommendation

Use this as one of the top sponsor-specific tracks.

This is a cleaner fit than MetaMask, Uniswap, or Locus because the ERC-8183-style commerce rail is already core and evidenced.
