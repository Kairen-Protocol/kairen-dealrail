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
    ESC[Escrow Contracts]
    TRUST[ERC-8004 Trust Layer]
    ADAPT[Optional Adapters]
  end

  subgraph Chains
    BASE[Base Sepolia]
    CELO[Celo Sepolia]
  end

  subgraph Extensions
    UNI[Uniswap]
    LOC[Locus]
    DEL[MetaMask Delegations]
    X4[x402 / AgentCash]
  end

  H --> UI
  B --> CLI
  P --> CLI
  E --> CLI

  UI --> API
  CLI --> API
  API --> NEG
  API --> PAY
  API --> ESC
  API --> TRUST
  API --> ADAPT

  PAY --> X4
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

## 4. Canonical Deal Flow

```mermaid
flowchart TD
  A[1. Human or agent defines intent] --> B[2. Backend scans supply and competition]
  B --> C[3. Providers are ranked]
  C --> D{4. Which execution posture fits}
  D -->|Immediate paid call| E[5A. Machine payment adapter proxies request]
  D -->|Scoped service deal| F[5B. Onchain job created]
  F --> G[6. Escrow funded]
  G --> H[7. Provider submits deliverable]
  H --> I{8. Evaluator decision}
  I -->|Complete| J[9. Funds released]
  I -->|Reject| K[9. Job rejected]
  J --> L[10. Reputation feedback can be written]
  K --> M[10. Refund or retry posture remains]
  E --> N[6A. Response and receipt returned]
```

## 5. Trust Loop

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

## 6. Readiness Map

```mermaid
flowchart LR
  subgraph 85% Plus
    S1[Open Track 95%]
    S2[ERC-8004 90%]
    S3[Virtuals ERC-8183 92%]
    S4[Celo 90%]
    S5[x402 85%]
  end

  subgraph 70% To 84%
    M1[Let the Agent Cook 70%]
    M2[Base Agent Services on Base 75%]
  end

  subgraph Below 70%
    P1[MetaMask 60%]
    P2[Uniswap 55%]
    P3[Locus 45%]
  end
```

## 7. Future Kairen Stack

```mermaid
flowchart LR
  SITE[kairen.xyz]
  MARKET[Market]
  X402[x402n]
  DEAL[DealRail]
  ID[ForgeID / SIGNET]

  SITE --> MARKET
  SITE --> X402
  SITE --> DEAL
  SITE --> ID
  MARKET --> X402
  X402 --> DEAL
  ID --> DEAL
```

Meaning:
- `Market` becomes public provider and service discovery
- `x402n` becomes the live negotiation and transcript router
- `ForgeID / SIGNET` becomes deeper identity, prestige, and access control
- `DealRail` remains the execution, settlement, and receipts layer

## 8. Why The Repo Is Organized This Way

The repo is split so two audiences can navigate it quickly:

- humans need a simple visual story and direct evidence
- AI judges need structured markdown, exact file paths, tx hashes, and claim discipline
- agents need a stable install and JSON command surface

That is why:
- `docs/submission` is the canonical judging pack
- `backend/TRANSACTION_LEDGER.md` is the canonical proof log
- `STATUS.md` is the canonical deployment summary
- `@kairenxyz/dealrail` is the canonical agent package name
