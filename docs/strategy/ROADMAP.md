# Kairen DealRail Roadmap

This is the current roadmap for DealRail after the live deployment pass.

It replaces the older day-by-day hackathon planning version.

## Current Baseline

Live now:
- browser desk on Cloudflare at `https://dealrail.kairen.xyz/`
- backend API on Railway at `https://kairen-dealrail-production.up.railway.app/`
- npm package `@kairenxyz/dealrail`
- Base Sepolia and Celo Sepolia escrow evidence
- ERC-8004 verifier and hook integration
- x402 paid-request proof on Base Sepolia testnet

## Product Readiness

| Area | Readiness | Main blocker |
|------|-----------|--------------|
| Browser desk | 95% | final demo polish |
| CLI / agent path | 92% | more canonical agent artifacts |
| Backend API | 90% | deeper live integrations |
| ERC-8004 trust layer | 90% | richer identity enrollment examples |
| x402 proof | 85% | only one canonical proof so far |
| Let the Agent Cook packaging | 70% | missing `agent.json` and `agent_log.json` |
| MetaMask | 60% | missing delegated tx |
| Uniswap | 55% | missing swap tx |
| Locus | 45% | missing live proof |

## Strategic Direction

DealRail should evolve into the execution desk within the Kairen protocol stack:
- `kairen.xyz` -> protocol shell
- `x402n` -> negotiation and transcript layer
- `market` -> provider and service discovery
- `ForgeID / SIGNET` -> identity, prestige, access verification
- `DealRail` -> execution, settlement, and receipts

## Delivery Phases

## Phase 1: Final Submission Hardening

Target:
- immediate

Deliverables:
- lock final docs and track strategy
- record final demo video
- add truthful `agent.json` and `agent_log.json`
- keep security hygiene and no-secret posture intact

Success signal:
- judges can navigate the repo and live app without confusion

## Phase 2: Agent Packaging And Autonomy

Target:
- next sprint

Deliverables:
- canonical `agent.json`
- canonical `agent_log.json`
- structured autonomous run from the live backend
- explicit guardrails and tool-budget notes

Success signal:
- Let the Agent Cook readiness rises from 70% to 85%+

## Phase 3: x402n-Native Negotiation

Grounding from local repo:
- `x402n` already models `RFO -> offer -> deal`
- it already has transcript and ledger concepts

Deliverables:
- route DealRail requests into real x402n RFOs
- attach accepted offer metadata to escrow creation
- expose negotiation transcripts in browser and CLI

Success signal:
- provider competition moves from mock-first to live negotiation

## Phase 4: Market Discovery Integration

Grounding from local repo:
- `market` is already the public service discovery surface

Deliverables:
- sync provider and service catalogs from Market
- expose public provider/service feeds in DealRail
- support discoverable paid services for Base-facing tracks

Success signal:
- Base service discovery becomes canonical, not implied

## Phase 5: ForgeID / SIGNET Trust Upgrade

Grounding from local repo:
- local ForgeID materials already describe ERC-8004-compatible identity and reputation layers
- local sources include `SignetRing.sol`, `PrestigeOracle.sol`, and ERC-8004 interfaces

Deliverables:
- map DealRail operators and providers to Kairen identity
- mirror or attach prestige signals to provider trust
- use tiered access and partner attestations in execution policy

Success signal:
- DealRail becomes deeply Kairen-native on the trust side

## Phase 6: ERC-8183 Productization

Deliverables:
- publish canonical job, receipt, and deliverable schemas
- keep browser, CLI, and backend outputs aligned
- make the ERC-8183 commerce mapping explicit for integrators

Success signal:
- stronger reuse by third-party agent runtimes and protocols

## Phase 7: Production Hardening

Deliverables:
- auth and rate limiting
- observability and alerting
- robust secrets rotation
- more live sponsor-grade proofs where they matter
- mainnet readiness review

Success signal:
- the system can be pitched as infrastructure, not just a hackathon demo

## What We Will Not Fake

We will not present these as done until there is proof:
- live x402n negotiation routing
- Market-backed public supply
- ForgeID-enrolled operators in the live DealRail flow
- delegated MetaMask execution
- Uniswap swap proof
- live Locus proof
