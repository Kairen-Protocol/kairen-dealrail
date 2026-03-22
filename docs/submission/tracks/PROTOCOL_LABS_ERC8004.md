# Protocol Labs: ERC-8004

## Current Readiness

90%

## Why This Is Strong

This is the strongest sponsor-specific fit in the repo.

ERC-8004 is not decorative here:
- provider identity can be resolved through the registry
- provider reputation can be read before key actions
- post-settlement feedback can be written back through the hook

## Core Files

- [`contracts/src/identity/ERC8004Verifier.sol`](../../../contracts/src/identity/ERC8004Verifier.sol)
- [`contracts/src/DealRailHook.sol`](../../../contracts/src/DealRailHook.sol)
- [`backend/src/services/discovery.service.ts`](../../../backend/src/services/discovery.service.ts)
- [`contracts/test/EscrowRailERC20Hook.t.sol`](../../../contracts/test/EscrowRailERC20Hook.t.sol)

## Main Blocker

The remaining gap to 100% is packaging clarity:
- one clearer operator identity artifact would help judges

## Fastest Resolution

Add one canonical identity lookup or registration artifact alongside the existing hook and verifier evidence.
