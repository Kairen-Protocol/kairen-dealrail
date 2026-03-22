# Architecture

This document describes the canonical architecture currently supported by the repo.

For the visual version, read [`06_VISUAL_ARCHITECTURE.md`](06_VISUAL_ARCHITECTURE.md).

## System Shape

DealRail has five layers:

1. Operator surfaces
2. Coordination and market competition
3. Machine payment and escrow commitment
4. Trust and reputation hooks
5. Optional downstream execution adapters

## High-Level System Map

```mermaid
flowchart LR
  H[Human operator] --> UI[Browser desk]
  BA[Buyer agent] --> CLI[npm CLI / SDK]
  PA[Provider agent] --> CLI
  EA[Evaluator agent] --> CLI

  UI --> API[Backend API]
  CLI --> API

  API --> NEG[Market competition]
  API --> PAY[Machine payment adapter]
  API --> DISC[Provider discovery]
  API --> ESC[Escrow lifecycle]
  API --> EXEC[Execution adapters]

  DISC --> ERC[ERC-8004 identity and reputation]
  PAY --> X4[x402-first provider]
  ESC --> CHAIN[(Base Sepolia / Celo Sepolia)]
  EXEC --> UNI[Uniswap]
  EXEC --> LOC[Locus]
  EXEC --> DEL[Delegation builder]
```

## Canonical Demo Path

The clearest demo path uses:

- frontend: [`frontend/src/app`](../../frontend/src/app)
- simplified backend API: [`backend/src/index-simple.ts`](../../backend/src/index-simple.ts)
- contract interaction service: [`backend/src/services/contract.service.ts`](../../backend/src/services/contract.service.ts)
- escrow contracts: [`contracts/src/EscrowRailERC20.sol`](../../contracts/src/EscrowRailERC20.sol) and [`contracts/src/EscrowRail.sol`](../../contracts/src/EscrowRail.sol)

## Component Map

### Frontend

The frontend is a Next.js operator UI that:
- displays jobs and lifecycle state
- creates jobs
- surfaces negotiation and integrations workbench flows
- provides a docs desk and demo terminal for human operators and judges
- points users to onchain actions and backend adapters

Important files:
- [`frontend/src/app/page.tsx`](../../frontend/src/app/page.tsx)
- [`frontend/src/app/docs/page.tsx`](../../frontend/src/app/docs/page.tsx)
- [`frontend/src/app/terminal/page.tsx`](../../frontend/src/app/terminal/page.tsx)
- [`frontend/src/app/jobs/[jobId]/page.tsx`](../../frontend/src/app/jobs/[jobId]/page.tsx)
- [`frontend/src/lib/contracts.ts`](../../frontend/src/lib/contracts.ts)
- [`frontend/src/lib/api.ts`](../../frontend/src/lib/api.ts)

### CLI / SDK

The published package gives agent-first and terminal-first access to the same backend:
- stable JSON output with `--json`
- human-readable ASCII mode
- preflight `doctor` command
- lightweight SDK import for custom automation

Important files:
- [`cli/package.json`](../../cli/package.json)
- [`cli/src/cli.ts`](../../cli/src/cli.ts)
- [`cli/src/client.ts`](../../cli/src/client.ts)
- [`cli/src/types.ts`](../../cli/src/types.ts)

### Backend

The canonical submission backend is the simplified API server:
- no database required for the main escrow demo path
- reads directly from chain
- exposes lifecycle endpoints
- exposes negotiation, discovery, delegation, Uniswap, Locus, and machine-payment surfaces

Important files:
- [`backend/src/index-simple.ts`](../../backend/src/index-simple.ts)
- [`backend/src/services/machine-payments.service.ts`](../../backend/src/services/machine-payments.service.ts)
- [`backend/src/services/x402n.service.ts`](../../backend/src/services/x402n.service.ts)
- [`backend/src/services/discovery.service.ts`](../../backend/src/services/discovery.service.ts)
- [`backend/src/services/delegation.service.ts`](../../backend/src/services/delegation.service.ts)
- [`backend/src/services/uniswap.service.ts`](../../backend/src/services/uniswap.service.ts)
- [`backend/src/services/locus.service.ts`](../../backend/src/services/locus.service.ts)
- [`backend/src/services/execution.service.ts`](../../backend/src/services/execution.service.ts)

### Contracts

The smart contract layer provides:
- escrow state machine
- hook callbacks before and after key actions
- pluggable identity verification
- ERC-8004-aware trust gating and reputation writes

Important files:
- [`contracts/src/EscrowRail.sol`](../../contracts/src/EscrowRail.sol)
- [`contracts/src/EscrowRailERC20.sol`](../../contracts/src/EscrowRailERC20.sol)
- [`contracts/src/DealRailHook.sol`](../../contracts/src/DealRailHook.sol)
- [`contracts/src/identity/ERC8004Verifier.sol`](../../contracts/src/identity/ERC8004Verifier.sol)
- [`contracts/test/EscrowRailERC20Hook.t.sol`](../../contracts/test/EscrowRailERC20Hook.t.sol)

## Runtime Sequence

```text
human browser or agent CLI -> backend coordination -> provider scan and offer competition
then -> machine payment for immediate calls OR createJob + fund onchain escrow
provider submit -> evaluator complete/reject -> payout or refund posture
after settlement -> DealRailHook can write ERC-8004 reputation
optional -> prepare downstream Uniswap / Locus / delegation operations
```

## Canonical Settlement Flow

```mermaid
sequenceDiagram
  participant Human as Human desk
  participant Agent as Agent CLI
  participant Frontend
  participant Backend
  participant Payment as Machine payment adapter
  participant Escrow as EscrowRailERC20
  participant Hook as DealRailHook
  participant Evaluator

  Human->>Frontend: define task, budget, deadline
  Agent->>Backend: or call CLI/SDK directly
  Frontend->>Backend: create negotiation session
  Backend-->>Frontend: ranked offers + trust context
  Human->>Frontend: confirm selected provider
  alt Immediate machine call
    Backend->>Payment: proxy provider request
    Payment-->>Backend: paid response
    Backend-->>Frontend: receipt payload
  else Escrow-backed deal
    Frontend->>Backend: create job
    Backend->>Escrow: createJob
    Human->>Frontend: fund escrow
    Frontend->>Backend: fund job
    Backend->>Escrow: fund
  end
  Escrow->>Hook: beforeAction / afterAction
  Frontend->>Backend: submit deliverable
  Backend->>Escrow: submit
  Evaluator->>Backend: complete or reject
  Backend->>Escrow: complete or reject
  Escrow->>Hook: beforeAction / afterAction
  Hook->>Hook: optional ERC-8004 reputation update
```

## What Is Implemented Versus Optional

### Implemented and evidenced
- Base Sepolia escrow flow
- Celo Sepolia escrow flow
- reject path on Celo
- ERC-8004 verifier and hook integration
- discovery enrichment against ERC-8004 registries
- published npm CLI package and install path

### Implemented but not core-evidenced
- reverse-auction style negotiation sessions
- delegation payload building
- Uniswap quote and tx building
- Locus bridge
- x402 proxy path

## Chain Topology

### Base Sepolia
- primary testnet for canonical escrow evidence
- current default backend target

### Celo Sepolia
- secondary testnet with stable-token rail
- used for sponsor-specific Celo evidence

## Architectural Truthfulness Notes

- The simplified backend is the canonical demo server for this submission.
- The browser desk and published CLI package are both canonical operator surfaces.
- Database-backed and IPFS-heavy paths exist in the repo but are not required to understand the demonstrated prize path.
- Optional sponsor adapters are documented separately so they do not muddy the core story.
