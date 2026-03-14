# 03 — TX Specialist Opinion: Kairen DealRail Transaction Safety

**Role:** TX Specialist Agent  
**Date:** 2026-03-14  
**Scope:** Onchain transaction risk, safety model, chain strategy, demo reliability

---

## Executive Summary

DealRail orchestrates multi-party deal execution across buyer agents, seller agents, escrow contracts, and arbiters. From a TX perspective, the highest-risk moments are approval grants, fund movements, and settlement finalization. This document stress-tests every transaction touchpoint and provides a practical safety framework for the MVP.

**Bottom line:** Base mainnet for demo, with a strictly scoped tx safety model that gates every action through preflight simulation. Never move funds without deterministic confirmation. Fail loudly, recover gracefully.

---

## 1. TX Safety Model for Deal Execution

### 1.1 Transaction Lifecycle

Every deal action that touches the chain goes through five mandatory stages:

```
[Preflight] → [Approval] → [Simulation] → [Broadcast] → [Settlement Check]
```

No step can be skipped. Each stage has explicit pass/fail criteria.

---

### Stage 1: Preflight Checks

Before constructing any transaction:

| Check | Description | Failure Action |
|---|---|---|
| Balance sufficiency | Sender has >= (value + estimatedGas x maxFeePerGas x 1.2 buffer) | BLOCK — do not construct tx |
| Nonce staleness | Pending nonce == expected nonce (no stuck txs in mempool) | CAUTION — detect and surface stuck tx |
| Contract existence | Target contract address has code (not EOA, not self-destructed) | ESCALATE — halt deal flow |
| ABI match | Function selector exists in verified contract ABI | ESCALATE — potential contract upgrade/migration |
| Allowance check | For token transfers: current allowance >= required amount | CAUTION — trigger approval flow first |
| Token balance | ERC-20 balance >= transfer amount (not just native ETH) | BLOCK |
| Paused state | Contract not paused (if pausable) | ESCALATE |
| Blacklist/sanctions | Neither sender nor recipient on OFAC/Chainalysis block list | ESCALATE — legal halt |

---

### Stage 2: Approval Management

For any ERC-20 deal (most DealRail flows will involve token escrow):

```
RULE: Never grant unlimited (max uint256) approvals in production.
      Grant exact-amount approvals only.
      Revoke after settlement.
```

**Approval Sequence:**
1. Check current allowance
2. If allowance > 0 AND allowance < required: reset to 0 first (USDT-style reentrancy protection)
3. Grant exact-amount approval
4. Verify allowance on-chain before proceeding
5. Post-settlement: call approve(spender, 0) to revoke

**Approval Safety Flags:**
- If requested approval > deal value x 2 → ESCALATE
- If spender is not the known escrow contract → ESCALATE
- If approval persists > 48h without deal completion → auto-revoke via keeper

---

### Stage 3: Simulation

Before broadcasting any state-changing transaction, run eth_call simulation on latest block.

Simulation Rules:
- Simulation must succeed with identical calldata before broadcast
- If simulation succeeds but broadcast fails → flag as chain-state race, retry once
- If simulation reverts → decode revert reason, NEVER broadcast
- For high-value txs (>$10k USD equivalent): require Tenderly fork simulation

State Freshness:
- Simulation block must be <= 2 blocks old at broadcast time
- If block drift > 2: re-simulate before broadcasting

Gas Estimation: Use estimateGas result x 1.2 as gasLimit. Never hardcode gas limits.

---

### Stage 4: Broadcast & Monitoring

Broadcast Strategy:
- Use EIP-1559 (Base supports it natively)
- Set maxFeePerGas = baseFee x 1.5 (safe, not wasteful)
- Set maxPriorityFeePerGas = 0.001 gwei (Base is cheap enough)
- Store txHash immediately on broadcast
- Never "fire and forget"

Monitoring Loop (poll every 2s, max 60s):
- tx mined with status=1 → SUCCESS → proceed to settlement check
- tx mined with status=0 → REVERT → decode logs, ESCALATE
- 60s timeout with no mine → mark PENDING_TIMEOUT → alert operator
- tx dropped from mempool → ESCALATE, re-evaluate

Replace/Speed-up Policy:
- Do NOT auto-speed-up in MVP (risk of double-execution)
- After timeout: surface to human operator, not auto-retry

---

### Stage 5: Settlement Checks

After on-chain confirmation, verify the expected state change actually happened:

| Verification | Method | Failure Action |
|---|---|---|
| Escrow received funds | balanceOf(escrowAddress) == expected | ESCALATE — funds lost in transit |
| Deal state updated | escrow.getDealState(dealId) == FUNDED/SETTLED | ESCALATE |
| Event emitted | Scan receipt logs for expected event signature | CAUTION — state may be inconsistent |
| Recipient balance increased | Check buyer/seller token delta on final settlement | ESCALATE if mismatch |
| No leftover allowance | allowance(sender, escrow) == 0 post-settlement | CAUTION — trigger revoke |

Settlement Finality Rule (Base):
- 2 block confirmations = sufficient for deal state updates
- 12 block confirmations = required for final fund release
- Never release funds on 0-confirmation (pending) state

---

## 2. SAFE / CAUTION / ESCALATE Matrix

### Action Classification

| Action | Level | Rationale |
|---|---|---|
| Read deal state (getDealState) | SAFE | Read-only, no risk |
| Read balances / allowances | SAFE | Read-only |
| Simulate transaction (eth_call) | SAFE | No state change |
| Emit off-chain intent / match | SAFE | No onchain action |
| Grant exact-amount ERC-20 approval | CAUTION | Irreversible if wrong address |
| Deposit to escrow (deal funded) | CAUTION | Funds locked — needs simulation + confirmation |
| Update deal terms (pre-fund) | CAUTION | Verify both parties signed |
| Execute partial settlement | CAUTION | Check amounts precisely |
| Revoke approval | CAUTION | Confirm timing (not mid-settlement) |
| Final settlement release | ESCALATE | Irreversible fund movement |
| Dispute / arbiter override | ESCALATE | Manual review required |
| Grant unlimited approval (max uint256) | ESCALATE | Never in MVP — hard block |
| Interact with unverified contract | ESCALATE | Hard block |
| Deal cancellation with refund | ESCALATE | Requires both-party confirmation |
| Emergency pause | ESCALATE | Human operator only |
| Contract upgrade / migration | ESCALATE | Out of scope for MVP |

### Decision Logic

```
SAFE     → proceed automatically, log for audit
CAUTION  → proceed WITH: (1) simulation, (2) pre/post balance check, (3) confirmation wait
ESCALATE → HALT, alert operator, require explicit human re-approval before proceeding
```

---

## 3. Chain Strategy: Base vs Alternatives

### Recommendation: Base Mainnet for Demo

#### Why Base

| Factor | Assessment |
|---|---|
| Gas cost | ~$0.001–0.01 per tx (negligible for demo) |
| Finality | ~2s block time, near-instant UX |
| EVM compatibility | Full — all standard tooling works (ethers.js, viem, hardhat) |
| Token availability | USDC native (Circle), real liquidity |
| Bridge risk | Coinbase-backed, mature and battle-tested bridge |
| Tooling | Basescan, Tenderly support, good RPC (Alchemy, QuickNode, public) |
| Demo credibility | "Real mainnet" story without Ethereum L1 gas anxiety |
| Testnet parity | Base Sepolia — identical environment for pre-demo rehearsal |

Risk: Base is an L2 with sequencer centralization. If sequencer goes down, txs won't confirm.
Mitigation: Use Alchemy or QuickNode as RPC (they have sequencer fallback logic). Monitor Base status page.

---

#### Alternatives Compared

| Chain | Pros | Cons | Verdict |
|---|---|---|---|
| Ethereum L1 | Maximum credibility | $5–50 gas per tx — demo-killing UX | SKIP for demo |
| Polygon PoS | Cheap, established | Bridge complexity, MATIC friction | Backup option |
| Arbitrum One | Low gas, high credibility | More complex infra, less USDC clarity | Acceptable alternative |
| Optimism | Similar to Base | Less Coinbase ecosystem synergy | Acceptable |
| Base Sepolia | Free, identical to Base | Not "real money" — lower demo impact | Use for dev/staging |
| Anvil (local) | Full control, free, instant | Not convincing to investors | Use for unit tests only |

---

### Chain Strategy by Environment

```
LOCAL DEV     → Anvil (hardhat node) — instant, free, fully scriptable
CI / TESTING  → Base Sepolia — real L2 behavior, free faucet ETH
DEMO / PROD   → Base Mainnet — real USDC, real deal, low cost, strong story
```

---

### Cost Model for a Full Demo Deal (Base Mainnet)

| Operation | Gas Estimate | Cost at 0.1 gwei base fee |
|---|---|---|
| Deploy escrow contract | ~500,000 gas | ~$0.020 |
| Approve USDC (buyer) | ~50,000 gas | ~$0.002 |
| Fund escrow | ~80,000 gas | ~$0.003 |
| Confirm deal (seller) | ~60,000 gas | ~$0.002 |
| Release settlement | ~70,000 gas | ~$0.003 |
| Revoke approval | ~50,000 gas | ~$0.002 |
| Total per deal | ~810,000 gas | ~$0.034 |

For a 5-deal demo: ~$0.17 total. Negligible. Zero gas anxiety.

---

## 4. Transaction Checklist Template

Include in IDEA.md or deal execution runbook:

---

### Deal Transaction Checklist

#### Pre-Deal Setup
- [ ] Escrow contract deployed and verified on Basescan
- [ ] Contract ABI stored and hash-verified in agent config
- [ ] RPC endpoint configured with fallback (primary + backup provider)
- [ ] Gas price oracle integrated (or hardcoded safe defaults for demo)
- [ ] Sanctions screening hook connected (or mocked for MVP)
- [ ] All agent wallet addresses funded with gas (10x estimated requirement)

#### Buyer Funding Flow
- [ ] Preflight: buyer ETH balance >= gas buffer
- [ ] Preflight: buyer USDC balance >= deal amount
- [ ] Preflight: escrow contract is live (has code at address)
- [ ] Simulation: eth_call approval tx → passes
- [ ] Execute: exact-amount USDC approval to escrow
- [ ] Verify: allowance(buyer, escrow) == deal amount on-chain
- [ ] Simulation: eth_call fund tx → passes
- [ ] Execute: fund escrow with deal amount
- [ ] Verify: escrow USDC balance increased by deal amount
- [ ] Verify: deal state == FUNDED
- [ ] Confirm: wait 2 blocks before proceeding

#### Seller Confirmation Flow
- [ ] Seller agent receives deal ID and validates terms match
- [ ] Seller signs confirmation (on-chain tx or EIP-712 off-chain)
- [ ] Simulation: eth_call confirm tx → passes
- [ ] Execute: seller confirms deal
- [ ] Verify: deal state == CONFIRMED
- [ ] Confirm: wait 2 blocks

#### Settlement Release Flow
- [ ] Both parties confirmed OR arbiter resolved dispute
- [ ] Simulation: eth_call release tx → passes
- [ ] Execute: release funds to seller (or split per deal terms)
- [ ] Verify: seller USDC balance increased correctly
- [ ] Verify: escrow USDC balance == 0
- [ ] Verify: deal state == SETTLED
- [ ] Confirm: wait 12 blocks (finality buffer)
- [ ] Execute: revoke buyer approval (approve(escrow, 0))
- [ ] Verify: allowance(buyer, escrow) == 0

#### Post-Deal Audit
- [ ] All tx hashes stored in deal record with block numbers
- [ ] All state transitions logged with timestamps
- [ ] Receipt logs scanned and archived
- [ ] No pending approvals remain for any deal participant
- [ ] Deal marked COMPLETE in off-chain database
- [ ] Gas costs recorded for cost-model validation

#### Failure Escalation Protocol
- [ ] CAUTION trigger → log + alert, continue with extra confirmation
- [ ] ESCALATE trigger → HALT deal, alert operator, wait for manual approval
- [ ] Tx revert → decode revert reason, log, do NOT retry automatically
- [ ] Timeout (>60s unconfirmed) → alert operator, do NOT auto-speed-up
- [ ] Mismatch on settlement verification → freeze deal, human review required

---

## 5. Key Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Simulation succeeds, broadcast reverts | Low | High | Re-simulate within 2 blocks of broadcast; detect chain-state race |
| Stuck nonce / pending tx | Medium | Medium | Nonce management per address; detect before constructing new tx |
| Escrow contract bug | Low | Critical | Use audited template (OpenZeppelin Escrow); no custom logic in MVP |
| RPC outage during demo | Low | High | Dual RPC providers; failover configured |
| Gas spike during demo | Very Low (Base) | Low | Pre-fund wallets with 10x estimated gas |
| Approval to wrong address | Very Low | Critical | Address whitelist in agent config; simulation catches wrong-contract reverts |
| Double-execution (retry bug) | Medium | Critical | Idempotency keys per deal action; check on-chain state before executing |
| Base sequencer downtime | Very Low | High | Monitor Base status; have Arbitrum as emergency demo fallback |
| Token contract blacklisting | Very Low | High | Preflight sanctions check; use USDC (known-good) |

---

## 6. MVP Scope Boundaries (TX Perspective)

### In Scope for MVP
- Single-escrow, two-party deals (one buyer agent + one seller agent)
- USDC on Base as the settlement token
- Exact-amount ERC-20 approvals, revoked post-settlement
- Basic dispute flag — escalates to human arbiter
- Synchronous deal flow (no async partial fills)

### Out of Scope for MVP (defer to v2+)
- Multi-party or multi-hop settlements
- Cross-chain deals (bridge risk is too high for demo reliability)
- Streaming payments (Superfluid, Sablier etc.)
- MEV protection (Flashbots Protect, private mempools)
- Unlimited approval patterns — permanently hard-blocked
- On-chain governance of deal terms
- Gas sponsorship / meta-transactions (adds relay complexity)

---

*Document authored by TX Specialist Agent — stress-test complete.*
