# Kairen DealRail PRD

**Version:** 3.0
**Date:** 2026-03-22
**Status:** Current product record
**Live frontend:** `https://dealrail.kairen.xyz/`
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

A useful operator surface also needs:
- structured request intake
- provider competition
- stablecoin-oriented settlement rails
- escrow for non-instant work
- evaluator-mediated completion or rejection
- a clear receipt and audit trail

## Product Goals

### Primary
- Let a human or agent request a service from a clean command surface
- Return ranked or simulated provider options quickly
- Support escrow-backed settlement on Ethereum testnets
- Present a demoable, credible operator experience for both judges and builders

### Secondary
- Expose a stable CLI/SDK surface for agent runtimes
- Keep demo mode usable without forcing wallet connection
- Preserve a path to real wallet-driven settlement when needed

### Non-goals for the current repo state
- production-grade dispute resolution
- live multi-provider discovery at internet scale
- guaranteed live x402 settlement evidence across third-party providers
- overstating sponsor integrations that are still mock-first or partial

## Target Users

### Human operator
- wants a product-like browser experience
- wants to understand the workflow quickly
- may want to simulate service procurement before connecting a wallet

### Agent runtime
- wants a stable package install path
- wants machine-readable JSON output
- wants a small number of reliable commands

### Backend integrator
- wants a simple API and chain-aware settlement services
- wants Base Sepolia and Celo Sepolia support without pulling in a heavy data layer

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
- published CLI package on npm
- Base Sepolia escrow evidence
- Celo Sepolia happy path evidence
- Celo Sepolia reject path evidence
- ERC-8004 verifier and hook integration
- frontend-only simulation path for demo use

### Partial or mock-first
- market competition supply
- x402 machine-payment execution against third-party services
- Locus live payout flow
- delegation execution beyond payload construction

## Architecture Summary

```text
browser desk or npm cli
  -> backend coordination layer
  -> provider scan / machine payment / escrow lifecycle
  -> Base Sepolia or Celo Sepolia
  -> receipt and status surfaces
```

Core implementation areas:
- `frontend/` for human operator UX
- `cli/` for agent and terminal UX
- `backend/src/index-simple.ts` for the canonical demo API
- `contracts/` for escrow, hooks, and verifier logic

## Success Criteria

The current product is successful if:
- a judge can understand the system in under two minutes
- a human can run the browser terminal demo without wallet friction
- an agent can run the package with `--json`
- the repo truthfully shows what is live, what is simulated, and what is partial

## Distribution

### Browser
- `https://dealrail.kairen.xyz/`

### Package
```bash
npx @kairenxyz/dealrail help
npx @kairenxyz/dealrail doctor --json
```

## Canonical Supporting Docs

- `README.md`
- `AGENT.md`
- `STATUS.md`
- `docs/submission/00_START_HERE.md`
- `docs/submission/02_ARCHITECTURE.md`
- `backend/TRANSACTION_LEDGER.md`

## Product Truth Rules

When updating docs or demos, preserve these constraints:
- do not claim third-party integrations as live without ledger or runtime proof
- treat `docs/submission` as the canonical judging story
- keep `STATUS.md`, `backend/src/config.ts`, and `frontend/src/lib/contracts.ts` aligned
- keep the browser desk and npm CLI as first-class surfaces
