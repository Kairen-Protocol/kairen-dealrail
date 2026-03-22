# Base: Agent Services on Base

## Readiness

Medium

## Why It Fits

DealRail now exposes an explicit Base-facing service surface instead of leaving the Base story buried in generic discovery internals.

That surface includes:
- a public Base service directory at `GET /api/v1/base/agent-services`
- public provider discovery and opportunity-board endpoints
- a public x402 paid-request proxy surface
- a public Base Sepolia job board

## Canonical Proof

- browser directory: `/base`
- API directory: `GET /api/v1/base/agent-services`
- Base settlement rail: Base Sepolia escrow and job endpoints
- discovery + opportunity surfaces: `GET /api/v1/discovery/providers`, `GET/POST /api/v1/discovery/opportunities`

## Honest Boundary

This is a public Base-facing service directory, not proof of a fully open live marketplace.

The remaining blocker is the same one as before:
- provider supply can still be curated demo supply while x402n mock mode is enabled
- the directory makes the Base service surface explicit, but it does not by itself turn discovery into market-backed proof
