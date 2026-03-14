# Kairen DealRail — Technical Blueprint (MVP)

> Version: 0.1 | Author: Coder Agent | Date: 2026-03-14
> Status: Build-Ready for Hackathon

---

## 0. Scope Boundary

DealRail is an **on-chain escrow + negotiation rail** for real-world deals (contracts, services, physical goods). The MVP ships:

1. **EscrowRail** — smart contract with a typed state machine
2. **NegotiationLog** — on-chain artifact anchoring for negotiation history
3. **SettlementProof** — cryptographic receipt + on-chain finalization
4. **DealRail API** — thin JSON-RPC layer bridging frontend ↔ contracts
5. **React mini-UI** — initiate deal, accept, dispute, settle

No governance, no token, no DAO in MVP.

---

## 1. Contract / API Boundaries

### 1.1 Escrow State Machine

```
                         ┌──────────┐
                         │  CREATED │ ← deposit (buyer)
                         └────┬─────┘
                              │ fund()
                         ┌────▼─────┐
                         │  FUNDED  │
                         └────┬─────┘
                    ┌─────────┴──────────┐
              accept()             dispute()
                    │                    │
             ┌──────▼──────┐    ┌───────▼──────┐
             │  ACCEPTED   │    │   DISPUTED   │
             └──────┬──────┘    └───────┬──────┘
              release()          arbitrate()
                    │                   │
             ┌──────▼──────┐    ┌───────▼──────┐
             │  COMPLETED  │    │   RESOLVED   │
             └─────────────┘    └──────────────┘
                    ↑ cancel() available from CREATED/FUNDED → CANCELLED
```

**States enum:**
```solidity
enum State {
  CREATED,    // 0
  FUNDED,     // 1
  ACCEPTED,   // 2
  DISPUTED,   // 3
  COMPLETED,  // 4
  RESOLVED,   // 5
  CANCELLED   // 6
}
```

**Transitions table:**

| Fn | From | To | Auth | Side-Effect |
|----|------|----|------|-------------|
| fund() | CREATED | FUNDED | buyer | msg.value == amount |
| accept() | FUNDED | ACCEPTED | seller | emits DealAccepted |
| release() | ACCEPTED | COMPLETED | buyer | transfers to seller |
| dispute() | FUNDED|ACCEPTED | DISPUTED | buyer|seller | locks funds |
| arbitrate(winner) | DISPUTED | RESOLVED | arbitrator | splits or awards |
| cancel() | CREATED|FUNDED | CANCELLED | buyer | refunds buyer |
| expire() | FUNDED | CANCELLED | anyone | after deadline |

---

### 1.2 Contract: IEscrowRail.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IEscrowRail {
    event DealCreated(uint256 indexed dealId, address buyer, address seller, uint256 amount, bytes32 termsHash);
    event DealFunded(uint256 indexed dealId, uint256 amount);
    event DealAccepted(uint256 indexed dealId, uint64 deadline);
    event DealReleased(uint256 indexed dealId);
    event DealDisputed(uint256 indexed dealId, address initiator, bytes32 evidenceHash);
    event DealResolved(uint256 indexed dealId, address winner, uint256 buyerAmt, uint256 sellerAmt);
    event DealCancelled(uint256 indexed dealId);

    struct Deal {
        address buyer;
        address seller;
        address arbitrator;
        uint256 amount;
        uint64  deadline;
        bytes32 termsHash;
        bytes32 evidenceHash;
        State   state;
        uint8   buyerSplit;
    }

    function createDeal(address seller, address arbitrator, uint256 amount, bytes32 termsHash, uint64 ttl) external returns (uint256 dealId);
    function fund(uint256 dealId) external payable;
    function accept(uint256 dealId) external;
    function release(uint256 dealId) external;
    function dispute(uint256 dealId, bytes32 evidenceHash) external;
    function arbitrate(uint256 dealId, uint8 buyerSplit) external;
    function cancel(uint256 dealId) external;
    function expire(uint256 dealId) external;
    function getDeal(uint256 dealId) external view returns (Deal memory);
    function dealCount() external view returns (uint256);
}
```

---

### 1.3 Contract: INegotiationLog.sol

```solidity
interface INegotiationLog {
    event ArtifactAnchored(uint256 indexed dealId, uint256 indexed seq, bytes32 contentHash, address author, uint64 ts);

    struct Artifact {
        bytes32 contentHash;
        address author;
        uint64  timestamp;
        ArtifactKind kind;
    }

    enum ArtifactKind { TERMS_DRAFT, COUNTER_OFFER, ACCEPTANCE, EVIDENCE, AMENDMENT }

    function anchor(uint256 dealId, bytes32 contentHash, ArtifactKind kind) external;
    function getArtifacts(uint256 dealId) external view returns (Artifact[] memory);
    function latestHash(uint256 dealId) external view returns (bytes32);
}
```

---

### 1.4 Settlement Proof Schema

```typescript
interface SettlementProof {
  version: "1.0";
  dealId: number;
  chainId: number;
  contractAddress: string;
  finalState: "COMPLETED" | "RESOLVED" | "CANCELLED";
  buyer: string;
  seller: string;
  amount: string;            // wei
  buyerReceived: string;
  sellerReceived: string;
  termsHash: string;
  settlementTxHash: string;
  settlementBlock: number;
  timestamp: number;
  arbitratorSignature?: string;  // EIP-712 if disputed
  artifacts: ArtifactRef[];
}

interface ArtifactRef {
  seq: number;
  contentHash: string;
  kind: string;
  author: string;
  ipfsCid?: string;
}
```

---

### 1.5 DealRail REST API

Base: `https://api.dealrail.xyz/v1`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /deals | JWT | Create deal metadata + get termsHash |
| GET | /deals/:id | — | Deal state + artifact list |
| POST | /deals/:id/artifacts | JWT | Upload artifact, get hash to anchor |
| GET | /deals/:id/proof | — | Settlement proof |
| POST | /deals/:id/evidence | JWT | Upload dispute evidence |
| GET | /health | — | Liveness |

WebSocket: `wss://api.dealrail.xyz/v1/deals/:id/events` — real-time state transitions.

---

## 2. Repo Structure

```
kairen-dealrail/
├── contracts/
│   ├── src/
│   │   ├── EscrowRail.sol
│   │   ├── EscrowRailERC20.sol
│   │   ├── NegotiationLog.sol
│   │   └── interfaces/
│   │       ├── IEscrowRail.sol
│   │       └── INegotiationLog.sol
│   ├── test/
│   │   ├── unit/
│   │   │   ├── EscrowRail.t.sol
│   │   │   └── NegotiationLog.t.sol
│   │   ├── fuzz/
│   │   │   └── FuzzEscrow.t.sol
│   │   └── fork/
│   │       └── ForkIntegration.t.sol
│   ├── script/
│   │   ├── Deploy.s.sol
│   │   └── Seed.s.sol
│   └── foundry.toml
├── backend/
│   ├── src/
│   │   ├── api/          # Express routes
│   │   ├── listeners/    # ethers.js event listeners
│   │   ├── proofs/       # SettlementProof generator
│   │   └── db/           # Prisma schema + migrations
│   ├── prisma/schema.prisma
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CreateDeal.tsx
│   │   │   ├── DealStatus.tsx
│   │   │   ├── NegotiatePanel.tsx
│   │   │   └── SettlementView.tsx
│   │   ├── hooks/
│   │   │   ├── useEscrow.ts
│   │   │   └── useWebSocket.ts
│   │   └── wagmi.config.ts
│   └── package.json
├── docs/
│   ├── ARCHITECTURE.md
│   └── API.md
├── research/
│   ├── 01-idea.md
│   └── 02-technical-blueprint.md
└── README.md
```

---

## 3. Milestones (Day 1-7)

### Day 1 — Foundation
**Deliverables:**
- Foundry project scaffolded, CI pipeline (GitHub Actions: `forge test`)
- IEscrowRail.sol + INegotiationLog.sol interfaces finalized
- State machine diagram locked (feature freeze after this)
- Prisma schema: Deal, Artifact, SettlementProof tables

**Acceptance Criteria:**
- `forge build` passes with 0 warnings
- DB migrations run cleanly on SQLite (local) + Postgres (prod)

---

### Day 2 — Core Contract
**Deliverables:**
- EscrowRail.sol fully implemented (all 8 state transitions)
- Unit tests for all happy-path transitions
- Re-entrancy guard + CEI pattern verified
- NegotiationLog.sol implemented + unit tests

**Acceptance Criteria:**
- `forge test` green, 100% branch coverage on state machine
- All invalid transition paths verified to revert

---

### Day 3 — Fuzz + Hardening
**Deliverables:**
- FuzzEscrow.t.sol with 3 core invariants
- EscrowRailERC20.sol (shared base)
- Fork test against mainnet USDC (stretch goal)

**Acceptance Criteria:**
- Forge fuzz: 10k+ iterations per invariant, no breaks
- ERC20 variant passes same unit suite

---

### Day 4 — Backend API
**Deliverables:**
- Express API: all 5 endpoints live
- ethers.js event listener indexes to DB
- SettlementProof generator on DealReleased/DealResolved
- WebSocket push for state transitions

**Acceptance Criteria:**
- Happy-path flow works end-to-end via curl
- Proof generated within 2 confirmations of final event
- Jest integration tests pass

---

### Day 5 — Frontend
**Deliverables:**
- Wagmi + RainbowKit wallet connection
- CreateDeal flow: form → createDeal() → fund() tx
- DealStatus page with live WebSocket updates
- NegotiatePanel: upload artifact → anchor hash
- SettlementView: render proof + download

**Acceptance Criteria:**
- Full flow works on Anvil local fork
- No uncaught React errors
- Mobile-friendly (375px+)

---

### Day 6 — Integration + Testnet Deploy
**Deliverables:**
- Deploy to Base Sepolia
- E2E test: create → fund → accept → release → proof
- Dispute flow: fund → dispute → arbitrate → resolved
- README with deploy addresses + demo video

**Acceptance Criteria:**
- All transactions confirmed on block explorer
- Settlement proof verifiable
- Demo video < 3 minutes

---

### Day 7 — Polish + Submission
**Deliverables:**
- Audit checklist run
- Gas optimization pass
- Pitch deck / one-pager
- Submission filed before deadline

**Acceptance Criteria:**
- No HIGH/CRITICAL items open in risk register
- forge snapshot gas numbers recorded
- Submission submitted with all required links

---

## 4. Risk Register

| ID | Risk | Likelihood | Impact | Mitigation |
|----|------|-----------|--------|------------|
| R1 | Re-entrancy on release()/arbitrate() | Med | CRIT | CEI + ReentrancyGuard |
| R2 | Centralized arbitrator | High | High | Multisig arbitrator; dispute DAO post-hackathon |
| R3 | Funds locked if deadline not enforced | Med | High | expire() callable by anyone; backend cron |
| R4 | Off-chain artifact lost (IPFS pin expiry) | Med | Med | Postgres blob fallback; Pinata pin |
| R5 | Front-running on accept()/release() | Low | Med | Deadline checks; commit-reveal for sensitive params |
| R6 | ERC20 fee-on-transfer tokens | Low | High | Use balanceOf diff to capture real amount |
| R7 | WebSocket drops mid-negotiation | Med | Low | Client-side reconnect + REST polling fallback |
| R8 | Proof not generated (listener crash) | Med | High | Idempotent proof gen + retry queue |
| R9 | Testnet RPC outage before demo | Med | Med | Alchemy + Infura fallback RPC |
| R10 | Scope creep kills velocity | High | High | Feature freeze Day 3 — backlog only |

---

## 5. Testing Strategy

### 5.1 Unit Tests (Foundry)
- Every state transition: valid + all invalid paths
- Access control: non-authorized callers revert
- Edge cases: zero amount, zero address, deadline=0
- NegotiationLog: anchor ordering, per-deal isolation

### 5.2 Fuzz Tests

```solidity
// Invariant 1: funded balance == sum of FUNDED deal amounts
function invariant_balanceMatchesFundedDeals() public { ... }

// Invariant 2: COMPLETED deal → seller balance increased
function invariant_sellerPaidOnComplete() public { ... }

// Invariant 3: no deal can be in two terminal states
function invariant_singleTerminalState() public { ... }
```

Run: `forge test --fuzz-runs 50000`

### 5.3 Fork Tests
- Fork Base mainnet at pinned block
- Full ERC20 escrow flow with real USDC
- Test permit() for gasless approve

Run: `forge test --fork-url $BASE_RPC_URL --match-path "*/fork/*"`

### 5.4 Backend (Jest + Supertest)
- Unit: proof generator with mocked events
- Integration: full API against Anvil + in-memory DB

### 5.5 Frontend (Vitest + Playwright)
- Component unit tests
- E2E happy-path on Anvil with injected wallet

### 5.6 Failure Scenarios

| Scenario | Expected Behavior |
|----------|------------------|
| fund() with wrong ETH amount | Revert AmountMismatch |
| release() before accept() | Revert InvalidState |
| Arbitrator calls release() | Revert Unauthorized |
| dispute() after COMPLETED | Revert InvalidState |
| Double cancel() | Revert on second call |
| expire() before deadline | Revert NotExpired |
| Backend listener crashes mid-block | Restart replays from last indexed block |
| IPFS fetch fails | Serve from Postgres fallback |
| Frontend wallet disconnects | Graceful error + reconnect prompt |

---

## 6. Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Contract framework | Foundry | Faster tests, native fuzz, forge snapshot |
| Chain | Base Sepolia | Low fees, EVM-compatible, Coinbase ecosystem |
| Escrow currency | ETH + ERC20 variant | Cover native + stablecoin demos |
| Arbitration | Trusted EOA (hackathon) | Simplest; swap for multisig post-hackathon |
| Off-chain storage | IPFS + Postgres fallback | Decentralized ideals, practical reliability |
| API auth | SIWE → JWT | Sign-In With Ethereum pattern |
| Frontend | Next.js + Wagmi v2 + shadcn | Fast to build, batteries included |
| Indexer | Custom ethers.js listener | Simpler than The Graph for hackathon |

---

## 7. Definition of Done (MVP)

- [ ] All contracts deployed to public testnet
- [ ] Unit coverage ≥ 90% lines, 100% state machine branches
- [ ] Fuzz: 10k+ runs, no broken invariants
- [ ] Backend returns correct settlement proof
- [ ] Frontend: create → fund → accept → release works with MetaMask
- [ ] Dispute → arbitrate → resolve works end-to-end
- [ ] Settlement proof downloadable as JSON
- [ ] README includes deploy addresses, demo video, setup instructions
