# Kairen DealRail PRD

**Version:** 4.0
**Date:** 2026-03-22
**Status:** Current product record
**Live frontend:** `https://dealrail.kairen.xyz/`
**Live backend:** `https://kairen-dealrail-production.up.railway.app/`
**Published package:** `@kairenxyz/dealrail`

## Product Summary

DealRail is an Ethereum-first machine-commerce desk for service procurement between humans and agents.

It gives two entry lanes into the same execution model:
- humans use the browser desk
- agents use the CLI and SDK package

Both lanes converge on the same core flow:

```text
request -> compete -> pay or escrow -> deliver -> evaluate -> receipt
```

## Problem

Machine payments alone are not enough for real service transactions.

Useful agent commerce also needs:
- structured request intake
- provider competition
- stablecoin-oriented settlement rails
- escrow for non-instant work
- evaluator-mediated completion or rejection
- a clear receipt and audit trail
- portable trust signals

## Product Goals

### Primary
- Let a human or agent request a service from a clean command surface
- Return ranked or simulated provider options quickly
- Support escrow-backed settlement on Ethereum testnets
- Present a credible operator experience for both judges and builders
- Keep the browser path and agent path equally first-class

### Secondary
- Expose a stable CLI/SDK surface for agent runtimes
- Keep demo mode usable without forcing wallet connection
- Preserve a path to real wallet-driven execution when needed
- Make the product legible to AI judges as well as humans

### Non-goals in the current repo state
- production-grade dispute operations
- global live provider supply
- overstated sponsor integrations without proof
- pretending roadmap layers are already live

## Target Users

### Human operator
- wants a product-like browser experience
- wants to understand the workflow quickly
- may want to simulate service procurement before connecting a wallet

### Agent runtime
- wants a stable package install path
- wants machine-readable JSON output
- wants a small number of reliable commands

### Integrator
- wants a simple API and chain-aware settlement services
- wants a path from hackathon demo into a larger protocol stack

## Operator Surfaces

### 1. Browser desk
- route: `/`
- live site: `https://dealrail.kairen.xyz/`
- purpose: human onboarding, demo terminal, architecture, workflow, docs

### 2. Terminal desk
- route: `/terminal`
- purpose: operator-first CLI-style demo in the browser
- supports frontend-only simulation with hardcoded services and simulated stablecoin transaction receipts

### 3. npm CLI / SDK
- package: `@kairenxyz/dealrail`
- binary: `dealrail`
- audience: agents and terminal-native humans
- supports human-readable output and `--json`

## Current Product Flow

### Demo mode
1. user opens the browser desk or CLI
2. user runs `doctor`, `services`, or `vend ...`
3. the system shows hardcoded service inventory and simulated settlement output
4. no wallet is required

### Escrow mode
1. buyer defines task, budget, and deadline
2. backend coordinates provider competition or provider selection
3. buyer commits the deal onchain through escrow
4. provider submits a deliverable
5. evaluator completes or rejects the job
6. receipt and onchain evidence become the record of execution

## Supported Chains

Current supported settlement rails:
- Base Sepolia
- Celo Sepolia

Current token posture:
- stablecoin-oriented settlement for the canonical demo path

## What Is Real Today

### Verified
- frontend deployed to Cloudflare Workers at `dealrail.kairen.xyz`
- backend deployed to Railway
- published CLI package on npm
- Base Sepolia escrow evidence
- Celo Sepolia happy path evidence
- Celo Sepolia reject path evidence
- ERC-8004 verifier and hook integration
- frontend-only simulation path for demo use
- x402 paid-request proof on Base Sepolia testnet

### Still upgrade zones
- market competition supply depth
- x402n live negotiation routing
- discoverable Base-facing public paid service proof
- delegated execution beyond payload construction
- Uniswap and Locus sponsor-grade proof

## Product Readiness Snapshot

| Area | Readiness |
|------|-----------|
| Browser desk | 95% |
| CLI / SDK | 92% |
| Backend API | 90% |
| Base Sepolia flow | 95% |
| Celo flow | 90% |
| ERC-8004 trust layer | 90% |
| x402 testnet proof | 85% |

## Kairen Protocol Future State

DealRail is intended to become the execution desk inside the wider Kairen stack:
- `kairen.xyz` as the protocol shell
- `x402n` as the negotiation router
- `market` as provider and service discovery
- `ForgeID / SIGNET` as identity, prestige, and access verification
- DealRail as execution, settlement, and receipts

That roadmap is grounded in the local Kairen protocol repos and is documented in:
- `docs/submission/07_ROADMAP.md`
- `docs/strategy/ROADMAP.md`

## Success Criteria

The current product is successful if:
- a judge can understand the system in under two minutes
- a human can run the browser terminal demo without wallet friction
- an agent can run the package with `--json`
- the repo truthfully shows what is live, what is simulated, and what is still being upgraded

## Product Truth Rules

When updating docs or demos, preserve these constraints:
- do not claim third-party integrations as live without ledger or runtime proof
- treat `docs/submission` as the canonical judging story
- keep `STATUS.md`, `backend/src/config.ts`, and `frontend/src/lib/contracts.ts` aligned
- keep the browser desk and npm CLI as first-class surfaces
