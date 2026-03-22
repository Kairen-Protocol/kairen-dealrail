# Protocol Labs: Agents With Receipts / ERC-8004

## Readiness

High

## Why It Fits

ERC-8004 is not cosmetic in this repo.
It affects system behavior through:
- verifier reads
- hook gates
- post-settlement trust writes
- discovery enrichment

## Proof

- verifier: [`../../contracts/src/identity/ERC8004Verifier.sol`](../../contracts/src/identity/ERC8004Verifier.sol)
- hook: [`../../contracts/src/DealRailHook.sol`](../../contracts/src/DealRailHook.sol)
- tests: [`../../contracts/test/EscrowRailERC20Hook.t.sol`](../../contracts/test/EscrowRailERC20Hook.t.sol)
- architecture note: [`../02_ARCHITECTURE.md`](../02_ARCHITECTURE.md)
