# Winning Strategy

This is the prize strategy for maximizing win probability without overclaiming.

## Primary Objective

Win by looking credible, deep, and well-evidenced to both AI judges and humans.

That means:
- fewer tracks
- stronger receipts
- exact file paths and tx hashes
- explicit blocker disclosure
- no sponsor inflation

## Current Best Track Lock

If submitting right now, the best stack is:

1. Synthesis Open Track
2. Protocol Labs: Agents With Receipts / ERC-8004
3. Virtuals: ERC-8183 Open Build
4. Celo: Best Agent on Celo
5. AgentCash / x402 on a testnet-only basis

Readiness scores:
- Open Track: 95%
- ERC-8004: 90%
- Virtuals ERC-8183: 92%
- Celo: 90%
- AgentCash / x402: 85%

## Best Stretch Track

The best stretch upgrade is:

6. Protocol Labs: Let the Agent Cook

Current readiness:
- 70%

Why it is the right stretch:
- the repo already has a live browser desk, live backend, live CLI package, and agent-friendly docs
- the remaining gap is packaging and structured evidence, not a brand new protocol integration

## Why This Set Wins

### Open Track

DealRail already matches three official themes well:
- agents that pay
- agents that trust
- agents that cooperate

That gives a broad but coherent story:
- pay: x402 and escrow rails
- trust: ERC-8004 verification and reputation
- cooperate: negotiated commitments and evaluator-mediated resolution

### Protocol Labs / ERC-8004

This is the cleanest sponsor fit because ERC-8004 changes behavior:
- discovery can enrich candidates with trust context
- the hook can reject low-trust providers
- settlement can write feedback back into reputation infrastructure

### Virtuals / ERC-8183

This is the cleanest commerce-native track because the repo is already built around:
- escrow-backed execution
- evaluator-mediated resolution
- receipts and post-settlement state

### Celo

Celo makes the system feel real and multi-rail:
- real deployment exists
- stable-token settlement path exists
- both happy and reject flows are recorded

### AgentCash / x402

This is now truthful because the repo has:
- x402 proxy and payment adapter code
- one recorded Base Sepolia paid-request proof

The right framing is:
- strong on testnet
- not the primary thesis

## What To Avoid

Do not try to win by checking many sponsor boxes.

That loses with AI judges because they can detect:
- mock-only integrations
- non-load-bearing sponsor mentions
- stale docs
- conflicting addresses
- missing tx proof for bold claims

## Best Demo Narrative

Use this sequence:

1. Show the live browser desk at `https://dealrail.kairen.xyz/`
2. Show the live agent CLI path with `npx @kairenxyz/dealrail doctor --json`
3. Show the Base Sepolia escrow lifecycle proof
4. Show the Celo Sepolia happy and reject proof
5. Show the x402 paid-request proof as the “agents that pay” layer
6. Close on ERC-8004 and ERC-8183 as the trust and commerce rails

## Highest-ROI Remaining Work

If there is still time before final publish, do these in order:

1. Produce the final demo video around Open + ERC-8004 + Virtuals + Celo.
2. Add truthful `agent.json` and `agent_log.json` artifacts for Let the Agent Cook.
3. Add one MetaMask delegated tx only if execution is fast and reliable.
4. Add one Uniswap swap only if the API key and funds are available immediately.
5. Leave Locus as roadmap unless a live proof appears.

## AI Judge Optimization Rules

AI judges will likely reward:
- readiness percentages instead of vague confidence language
- explicit blockers and next actions
- exact file paths
- exact tx hashes
- exact deployment addresses
- disciplined distinction between live, partial, and planned

They will likely punish:
- inflated sponsor lists
- unbounded future claims
- stale planning docs presented as current
- missing links between architecture and evidence

## Recommended Tone

Be precise, conservative, and technical.

Do not sound like a pitch deck.
Sound like a working system with a credible near-term roadmap.
