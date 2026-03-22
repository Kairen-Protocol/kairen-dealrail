# Visual Architecture

This file is the human-friendly visual explanation of how DealRail works.

Use this if you want the quickest visual understanding of the system without reading every implementation note.

## 1. One-Line Thesis

DealRail turns an agent deal into a verifiable execution loop:

```text
intent -> scan -> offer -> machine payment or escrow -> evaluation -> receipt -> reputation
```

## 2. System Overview

```mermaid
flowchart LR
  subgraph Operators
    H[Human desk]
    B[Buyer agent]
    P[Provider agent]
    E[Evaluator agent]
  end

  subgraph EntrySurfaces
    UI[Browser desk]
    CLI[npm CLI / SDK]
  end

  subgraph DealRail
    API[Backend API]
    NEG[Competition + discovery]
    PAY[Machine payments]
    DISC[Discovery]
    ESC[Escrow Contracts]
    TRUST[ERC-8004 Trust Layer]
    ADAPT[Optional Execution Adapters]
  end

  subgraph Chains
    BASE[Base Sepolia]
    CELO[Celo Sepolia]
  end

  subgraph Extensions
    UNI[Uniswap]
    LOC[Locus]
    DEL[MetaMask Delegation Builder]
    X4[x402 / AgentCash Path]
  end

  H --> UI
  B --> CLI
  P --> CLI
  E --> CLI

  UI --> API
  CLI --> API
  API --> NEG
  API --> PAY
  API --> DISC
  API --> ESC
  API --> TRUST
  API --> ADAPT

  DISC --> TRUST
  PAY --> X4[x402-first provider]
  ESC --> BASE
  ESC --> CELO

  ADAPT --> UNI
  ADAPT --> LOC
  ADAPT --> DEL
```

## 3. What Each Layer Does

| Layer | Purpose | Main Files |
|-------|---------|------------|
| Browser desk | Human and judge-facing UI | `frontend/src/app`, `frontend/src/components` |
| CLI / SDK | Agent and terminal-native operator surface | `cli/src/cli.ts`, `cli/src/client.ts`, `cli/src/types.ts` |
| Backend | Lifecycle API and integration adapters | `backend/src/index-simple.ts`, `backend/src/services` |
| Escrow | Locks funds and enforces state transitions | `contracts/src/EscrowRail.sol`, `contracts/src/EscrowRailERC20.sol` |
| Trust layer | Checks identity/reputation and writes feedback | `contracts/src/DealRailHook.sol`, `contracts/src/identity/ERC8004Verifier.sol` |

## 4. Operator Modes

| Mode | Best for | First command or surface |
|------|----------|--------------------------|
| Human browser flow | Demo, judging, guided operation | `frontend/src/app/page.tsx` and `frontend/src/app/terminal/page.tsx` |
| Human terminal flow | Direct operator control | `npx @kairenxyz/dealrail doctor` |
| Agent runtime | Structured automation | `npx @kairenxyz/dealrail doctor --json` |
| Embedded integration | Custom orchestration | `import { DealRailClient } from '@kairenxyz/dealrail'` |

## 5. Canonical Deal Flow

```mermaid
flowchart TD
  A[1. Human or agent defines intent] --> B[2. Backend scans supply and competition]
  B --> C[3. Providers are ranked]
  C --> D{4. What execution posture fits}
  D -->|Immediate paid call| E[5A. Machine payment adapter proxies request]
  D -->|Scoped service deal| F[5B. Onchain job created]
  F --> G[6. Escrow funded]
  G --> H[7. Provider submits deliverable]
  H --> I{8. Evaluator decision}
  I -->|Complete| J[9. Funds released]
  I -->|Reject| K[9. Job rejected]
  J --> L[10. Reputation feedback can be written]
  K --> M[10. Refund path remains available]
  E --> N[6A. Response and receipt returned]
```

## 6. Trust Loop

This is the part that makes the Protocol Labs / ERC-8004 story strong.

```mermaid
flowchart LR
  REG[ERC-8004 identity registry] --> VER[ERC8004Verifier]
  REP[ERC-8004 reputation registry] --> VER
  VER --> DISC[discovery enrichment]
  VER --> HOOK[DealRailHook]
  HOOK --> FUND[allow or block action]
  SETTLE[successful settlement] --> HOOK
  HOOK --> FEED[write feedback to reputation registry]
```

## 7. What Is Actually Demonstrated

```mermaid
flowchart LR
  subgraph Strongly Demonstrated
    S1[Base Sepolia happy path]
    S2[Celo Sepolia happy path]
    S3[Celo Sepolia reject path]
    S4[ERC-8004 verifier and hook tests]
    S5[npm package install and CLI execution]
  end

  subgraph Partial But Present
    P1[MetaMask delegation builder]
    P2[Uniswap tx builder]
    P3[Locus bridge]
    P4[x402 and x402n adapters]
    P5[market competition currently mock-first]
  end
```

## 8. Why The Repo Is Organized This Way

The repo is split so two audiences can navigate it quickly:

- humans need a simple visual story and direct evidence
- AI judges need structured markdown, exact file paths, tx hashes, and claim discipline
- agents need a stable install and JSON command surface

That is why:
- `docs/submission` is the canonical submission pack
- `backend/TRANSACTION_LEDGER.md` is the canonical proof log
- `STATUS.md` is the canonical deployment summary
- `@kairenxyz/dealrail` is the canonical agent package name

## 9. Best Reading Order For Humans

1. [`00_START_HERE.md`](00_START_HERE.md)
2. [`06_VISUAL_ARCHITECTURE.md`](06_VISUAL_ARCHITECTURE.md)
3. [`01_TRACK_MATRIX.md`](01_TRACK_MATRIX.md)
4. [`03_EVIDENCE.md`](03_EVIDENCE.md)
5. [`05_WINNING_STRATEGY.md`](05_WINNING_STRATEGY.md)
