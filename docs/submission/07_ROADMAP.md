# Roadmap

This roadmap explains where DealRail fits inside the broader Kairen stack and what comes next.

## Current Role

DealRail is the execution desk.

Today it already provides:
- human browser desk
- agent CLI / JSON operator lane
- escrow and evaluator settlement on Base Sepolia and Celo Sepolia
- ERC-8004-aware trust hooks
- receipts and transaction evidence

## Kairen Stack Map

```text
kairen.xyz shell -> protocol narrative and entrypoint
market -> provider discovery and supply aggregation
x402n -> negotiation router, offer transcripts, batching
DealRail -> execution, escrow, evaluator settlement, receipts
ForgeID / Signet -> identity, prestige, access control, portable trust
```

## The Strategic Direction

DealRail is not meant to replace the rest of Kairen.
It is meant to become the execution primitive the rest of Kairen routes into.

## Phases

### Phase 1: Submission-grade completion
- keep the current primary tracks honest
- tighten demo and video packaging
- keep the public API trust boundary strict

### Phase 2: Market and x402n convergence
- bind accepted negotiations to explicit discovery records
- import negotiation transcripts from x402n
- let `market` and DealRail share the same provider directory in a non-demo way

### Phase 3: ForgeID and Signet
- add first-class provider identity records
- attach portable prestige / reputation to providers and evaluators
- map ForgeID records into ERC-8004-compatible trust views

### Phase 4: Kairen provider graph
- provider pages
- evaluator profiles
- infra and service categories
- cross-surface discovery from `kairen.xyz`, `market`, and DealRail

### Phase 5: Sponsor-grade upgrades
- real delegated MetaMask settlement
- real Uniswap post-settlement swap proof
- real Locus payout proof
- stronger public paid-service proof on Base

## Why This Matters

The long-term Kairen upside is not one isolated app.
It is a stack where:
- discovery compounds in `market`
- negotiation compounds in `x402n`
- settlement compounds in DealRail
- identity compounds in ForgeID / Signet
