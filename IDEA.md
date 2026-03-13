# Kairen DealRail

## One-liner
A trust-minimized deal execution layer where AI agents negotiate service terms within human-defined boundaries, lock escrow onchain, and settle only when verifiable delivery conditions are met.

---

## Problem
AI agents can discover services and even negotiate, but actual deal execution is fragile:
- payment relies on centralized rails
- commitments can be changed by platforms
- humans lack enforceable spend boundaries
- disputes have no neutral, transparent enforcement
- post-hoc auditability is poor

This creates a trust gap exactly where money and commitments matter most.

---

## Vision
**Kairen DealRail** is the onchain execution backbone for agent-to-agent and human-to-agent deals.

It combines:
1. **Identity layer** (agent identity + attestations)
2. **Negotiation layer** (bounded offer/counter-offer flow)
3. **Escrow settlement layer** (contract-enforced milestones)
4. **Audit layer** (verifiable timeline of all commitments and outcomes)

Goal: move from "chat agreement" to **enforceable machine-native contracts**.

---

## Core Product Thesis
### "Negotiate offchain, commit onchain, settle by proof."

- Negotiation can happen quickly offchain (lower latency, richer UX)
- Final terms are committed onchain as canonical truth
- Funds are escrowed and released only on condition checks
- Every phase is auditable by the human principal

---

## Hackathon Theme Fit (Synthesis)

### Primary: Agents that cooperate
- smart contract commitments
- transparent, enforceable deal terms
- neutral dispute pathway

### Secondary: Agents that pay
- scoped spend permissions
- onchain settlement
- conditional escrow release

### Secondary: Agents that trust
- portable agent identity (ERC-8004 compatible posture)
- verifiable counterparties and deal history

---

## MVP Scope (Hackathon-realistic)

### 1) Deal Intent Schema
A standard structure for machine-readable intents:
- service type
- deliverables
- SLA/deadline
- budget and tolerance
- acceptable counterparties/chains
- verification rules

### 2) Bounded Negotiation Engine
Agent can counter within policy windows set by human:
- price bands
- deadline ranges
- quality floor
- chain/payment constraints

### 3) Escrow Contract (MVP)
- lock funds
- store hashed deal terms
- support milestone statuses
- release/refund based on verifiable state transition

### 4) Verification + Settlement
- submit delivery proof reference (URI/hash/attestation)
- human or policy module confirms acceptance
- settlement executes and emits full event trail

### 5) Audit Timeline
Human-readable and machine-readable timeline:
- intent created
- negotiation rounds
- final commitment
- escrow lock
- proof submitted
- settlement/dispute outcome

---

## System Architecture (MVP)

### Components
1. **Deal Planner (agent service)**
   - turns user objective into structured deal intent
2. **Negotiation Service (agent service)**
   - handles bounded counter-offers
3. **DealRail Contract (onchain)**
   - escrow + commitment state machine
4. **Verifier Adapter**
   - maps proof signals to settlement decisions
5. **Audit Indexer**
   - builds timeline from onchain events + signed negotiation messages

### Data Model
- `DealIntent`
- `Offer`
- `CounterOffer`
- `DealCommitment`
- `SettlementProof`
- `DealStateTransition`

---

## Why This Wins
- It’s not an abstract infra deck; it’s a working end-to-end flow
- Strong alignment with real user pain (trust + settlement)
- Leverages existing Kairen strengths rather than rebuilding everything
- Produces clear onchain artifacts judges can verify
- Opens path to production product after hackathon

---

## Go-to-Demo Story

1. Human defines policy: “Find a provider for X under $Y by date Z.”
2. Agent discovers providers and negotiates terms within bounds.
3. Final terms are committed onchain; escrow locks.
4. Provider delivers proof.
5. Human/verification policy accepts or disputes.
6. Funds settle automatically; full audit trail shown.

Demo should include one success settlement and one dispute/refund path.

---

## Non-goals (for hackathon)
- Full universal arbitration court
- Multi-chain bridging complexity
- Advanced privacy/ZK integration (optional stretch)
- Full production tokenomics

Stay focused on a reliable core rail.

---

## Risks and Mitigations

### Risk: Over-scoping
Mitigation: strict MVP checklist and frozen feature scope by day 2.

### Risk: Smart contract edge-case bugs
Mitigation: minimal contract surface, invariant tests, narrow state machine.

### Risk: weak demo clarity
Mitigation: pre-scripted scenarios + timeline visualizer.

### Risk: negotiation complexity explosion
Mitigation: fixed policy dimensions in MVP (price/deadline/quality only).

---

## 7-Day Build Plan

### Day 1
- finalize spec and interfaces
- scaffold repo and modules

### Day 2
- implement escrow/state machine contract
- local tests

### Day 3
- implement negotiation policy engine
- signed message schema

### Day 4
- wire planner + contract integration
- event indexing timeline

### Day 5
- build demo UI/CLI flow
- add happy path + dispute path

### Day 6
- hardening, testnet deploy, dry-run demo

### Day 7
- submission polish: docs, architecture, video, conversation log

---

## Repo Structure Proposal

```txt
kairen-dealrail/
  IDEA.md
  README.md
  contracts/
    DealRail.sol
    test/
  services/
    planner/
    negotiator/
    verifier/
  apps/
    demo-ui/
  packages/
    sdk/
    types/
  docs/
    architecture.md
    protocol.md
    demo-script.md
```

---

## Success Criteria (Hackathon)
- Working demo with onchain escrow + settlement
- Human policy constraints demonstrably enforced
- Verifiable deal timeline
- Clean, comprehensible architecture and open-source code

---

## Future Roadmap (Post-hackathon)
- richer attestation providers
- programmable dispute modules
- reputation-weighted negotiation strategies
- privacy-preserving verification pathways
- full Kairen-native layer integration (ForgeID/AgentNet/Market/x402n)

