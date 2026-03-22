# Judge Proof Path

This is the shortest defensible path through the project.

## 1. Problem

Agents can already send payments, but they still do not have a neutral way to:
- compare providers
- hold funds conditionally
- resolve disputes
- carry trust and receipts forward

DealRail fills that execution gap.

## 2. What Is Live

- browser desk: `https://dealrail.kairen.xyz/`
- backend API: `https://kairen-dealrail-production.up.railway.app/`
- npm package: `@kairenxyz/dealrail`
- Base Sepolia escrow proof
- Celo Sepolia happy and reject proof
- Base Sepolia x402 paid-request proof

## 3. Three Proof Scenarios

### Scenario A: buyer hires a provider
- open `https://dealrail.kairen.xyz/`
- show the browser desk and terminal path
- cite Base Sepolia happy-path tx hashes in [`../../backend/TRANSACTION_LEDGER.md`](../../backend/TRANSACTION_LEDGER.md)

### Scenario B: evaluator rejects work
- cite Celo Sepolia reject-path tx hashes in [`../../backend/TRANSACTION_LEDGER.md`](../../backend/TRANSACTION_LEDGER.md)

### Scenario C: agent uses the machine path
- show the CLI command surface
- cite [`agent_log.json`](agent_log.json)
- cite the x402 proof in [`../progress/X402_TESTNET_PROOF_2026-03-22.md`](../progress/X402_TESTNET_PROOF_2026-03-22.md)

## 4. Exact Anchors

### Base Sepolia
- create: `0xc88a6bcef436cad6fefb0e012bf7ccf57ea991905f6b22615287701692952430`
- fund: `0xb0de61acee165e1e86a587edec2f8ab4c89a3ceae9e101d23a012b31ef9f66e5`
- complete: `0xfe06fa5f1c85d2c33f2c78c5d38fc03a2ab72628c292d3378830cd591f4cc519`

### Celo Sepolia reject flow
- create: `0x772b595b728a565098a0d68567792dbff2bb71c3a524427c896ab440c7a9f3f1`
- reject: `0xb94efcdcfc41f7e3da223b9068e649797a575039d4e2e15b71b9beb19e31efb3`

### x402 paid request
- settlement: `0x8dfabc6a77205b0740aa7bc48e230b7516acc76295536d18a6a30db19476940c`

## 5. Track Links

- Open Track: [`tracks/OPEN_TRACK.md`](tracks/OPEN_TRACK.md)
- Protocol Labs ERC-8004: [`tracks/PROTOCOL_LABS_ERC8004.md`](tracks/PROTOCOL_LABS_ERC8004.md)
- Protocol Labs Let the Agent Cook: [`tracks/PROTOCOL_LABS_AGENT_COOK.md`](tracks/PROTOCOL_LABS_AGENT_COOK.md)
- Celo: [`tracks/CELO.md`](tracks/CELO.md)
- AgentCash / x402: [`tracks/AGENTCASH_X402.md`](tracks/AGENTCASH_X402.md)

## 6. What Changed After Review

- public API no longer asks clients to send raw private keys
- public chain metadata no longer leaks RPC URLs
- mock discovery and mock negotiation now use the same provider catalog
- browser writes now target the job chain instead of silently falling back to Base
