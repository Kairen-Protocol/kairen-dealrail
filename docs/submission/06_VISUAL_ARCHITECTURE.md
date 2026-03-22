# Visual Architecture

This file is the quickest visual explanation of how DealRail works.

## One-Line Flow

```text
intent -> discovery -> offer ranking -> payment or escrow -> evaluation -> receipt -> trust feedback
```

## System Overview

```mermaid
flowchart LR
  subgraph Operators
    H[Human desk]
    B[Buyer agent]
    P[Provider agent]
    E[Evaluator agent]
  end

  subgraph Entry
    UI[Browser desk]
    CLI[npm CLI / SDK]
  end

  subgraph DealRail
    API[Backend API]
    DISC[Provider discovery]
    NEG[Offer ranking]
    PAY[Machine payments]
    ESC[Escrow lifecycle]
    TRUST[ERC-8004 trust layer]
    ADAPT[Preview / adapter zone]
  end

  subgraph Chains
    BASE[Base Sepolia]
    CELO[Celo Sepolia]
  end

  subgraph Extensions
    X4[x402]
    UNI[Uniswap preview]
    DEL[Delegation builder]
    LOC[Locus adapter]
  end

  H --> UI
  B --> CLI
  P --> CLI
  E --> CLI
  UI --> API
  CLI --> API
  API --> DISC
  DISC --> NEG
  API --> PAY
  API --> ESC
  API --> TRUST
  API --> ADAPT
  PAY --> X4
  ESC --> BASE
  ESC --> CELO
  ADAPT --> UNI
  ADAPT --> DEL
  ADAPT --> LOC
```

## Deal Flow

```mermaid
flowchart TD
  A[1. Buyer defines task] --> B[2. DealRail scans supply]
  B --> C[3. Offers are ranked]
  C --> D{4. Which execution posture fits}
  D -->|Immediate call| E[5A. x402 payment path]
  D -->|Scoped service| F[5B. Escrow-backed job]
  F --> G[6. Buyer funds escrow]
  G --> H[7. Provider submits]
  H --> I{8. Evaluator decision}
  I -->|Complete| J[9. Release funds]
  I -->|Reject| K[9. Reject job]
  J --> L[10. Trust feedback can be written]
  K --> M[10. Refund or retry posture]
  J --> N[11. Optional Base routing preview]
  E --> O[6A. Paid response + receipt]
```

## Confidence Map

```mermaid
flowchart LR
  subgraph High
    H1[Open Track]
    H2[ERC-8004]
    H3[Let the Agent Cook]
    H4[Virtuals ERC-8183]
    H5[Celo]
    H6[x402]
  end

  subgraph Medium
    M1[Base Agent Services on Base]
  end

  subgraph Low
    L1[MetaMask]
    L2[Uniswap]
    L3[Locus]
  end
```

## Kairen Stack Map

```mermaid
flowchart LR
  SITE[kairen.xyz]
  MARKET[market]
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
- `market` becomes public discovery
- `x402n` becomes live negotiation and transcripts
- `ForgeID / SIGNET` deepens trust and access
- `DealRail` stays the execution, settlement, and receipt desk
