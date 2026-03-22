# DealRail Architecture

This file is the current technical architecture note for the working product.

For the judge-facing architecture narrative, use `docs/submission/02_ARCHITECTURE.md`.

## Current System Shape

DealRail has four practical layers:

1. operator surfaces
2. backend coordination
3. settlement rails
4. trust and receipt rails

```text
browser desk or npm cli
  -> backend api
  -> discovery / negotiation / simulation / lifecycle services
  -> escrow contracts on Base Sepolia or Celo Sepolia
  -> receipt, status, and reputation surfaces
```

## Operator Surfaces

### Browser desk
- implementation: `frontend/`
- live domain: `https://dealrail.kairen.xyz/`
- primary purpose: human onboarding, browser terminal, architecture, workflow, and demo mode

### npm CLI / SDK
- implementation: `cli/`
- package: `@kairenxyz/dealrail`
- primary purpose: agent-friendly execution, terminal-native human use, and machine-readable JSON mode

## Frontend

The frontend is a Next.js app deployed through OpenNext on Cloudflare Workers.

Key responsibilities:
- present the product and workflow clearly
- provide a browser terminal demo surface
- optionally connect wallets for real flows
- show chain-aware jobs and lifecycle state
- explain current architecture and product posture

Important files:
- `frontend/src/app/page.tsx`
- `frontend/src/app/terminal/page.tsx`
- `frontend/src/app/docs/page.tsx`
- `frontend/src/components/HomeCommandTerminal.tsx`
- `frontend/src/lib/api.ts`
- `frontend/src/lib/contracts.ts`
- `frontend/src/lib/wagmi.ts`

## CLI and SDK

The CLI is the agent-first surface for DealRail.

Key responsibilities:
- provide stable commands for health, jobs, services, rails, and vend flows
- expose `--json` for automation
- mirror the browser terminal concepts without UI dependencies
- support a recordable demo flow

Important files:
- `cli/src/cli.ts`
- `cli/src/client.ts`
- `cli/src/types.ts`
- `cli/src/ascii.ts`
- `cli/demo/dealrail-demo.sh`

## Backend

The canonical backend for the current product is the simplified Node/Express server in `backend/src/index-simple.ts`.

This server is intentionally direct:
- reads from chain instead of relying on a required database
- exposes lifecycle operations and simulations
- provides provider discovery, negotiation, machine-payments, and adapter endpoints
- supports multiple settlement chains

Important files:
- `backend/src/index-simple.ts`
- `backend/src/config.ts`
- `backend/src/services/contract.service.ts`
- `backend/src/services/machine-payments.service.ts`
- `backend/src/services/x402n.service.ts`
- `backend/src/services/discovery.service.ts`
- `backend/src/services/delegation.service.ts`
- `backend/src/services/uniswap.service.ts`
- `backend/src/services/locus.service.ts`

## Contracts

The contract layer is the strongest technical core of the repo.

Responsibilities:
- create and fund jobs
- lock settlement in escrow
- allow provider submission
- allow evaluator completion or rejection
- invoke trust hooks before and after key actions
- write ERC-8004-aware reputation updates where configured

Important files:
- `contracts/src/EscrowRail.sol`
- `contracts/src/EscrowRailERC20.sol`
- `contracts/src/DealRailHook.sol`
- `contracts/src/identity/ERC8004Verifier.sol`
- `contracts/test/EscrowRailERC20Hook.t.sol`

## Chain Topology

### Base Sepolia
- primary canonical settlement rail
- primary frontend and backend default

### Celo Sepolia
- secondary settlement rail
- used for stablecoin-oriented alternative demo flows

## Runtime Modes

### 1. Frontend-only simulation mode

Used for the cleanest demo experience.

Properties:
- no wallet required
- hardcoded services catalog
- simulated transaction hashes and receipt output
- designed for judges, product demos, and onboarding

### 2. Escrow-backed operator mode

Used when the flow should reflect real settlement mechanics.

Properties:
- creates or reads jobs against deployed contracts
- supports Base Sepolia and Celo Sepolia
- uses evaluator-mediated completion and rejection

## Current Request Flow

```text
user intent
  -> browser terminal or CLI
  -> service lookup or provider scan
  -> vend decision
  -> simulate receipt or create escrow-backed job
  -> submit deliverable
  -> evaluator complete or reject
  -> receipt and status output
```

## Truthfulness Rules

When describing architecture, keep these distinctions:

### Core and evidenced
- browser desk
- npm CLI
- simplified backend
- Base Sepolia and Celo Sepolia settlement rails
- escrow lifecycle contracts
- ERC-8004 verifier and hook integration

### Present but partial
- live negotiation depth
- third-party machine payment execution
- Locus payout operations
- delegated execution beyond payload generation

## Deployment Shape

### Frontend
- platform: Cloudflare Workers
- build path: OpenNext
- root directory for Git builds: `frontend`

### Backend
- platform: separate Node host
- posture: env-driven API target for the frontend and CLI

### CLI
- distribution: npm package
- install path: `@kairenxyz/dealrail`

## Canonical Truth Files

Keep these aligned when deployments or claims change:

1. `STATUS.md`
2. `backend/TRANSACTION_LEDGER.md`
3. `backend/src/config.ts`
4. `frontend/src/lib/contracts.ts`
