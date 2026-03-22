# Evidence

This file points judges to the strongest proof artifacts in the repository.

## Canonical Sources

- [`STATUS.md`](../../STATUS.md)
- [`backend/TRANSACTION_LEDGER.md`](../../backend/TRANSACTION_LEDGER.md)
- [`docs/progress/DEMO_VALIDATION_2026-03-22.md`](../progress/DEMO_VALIDATION_2026-03-22.md)
- [`docs/progress/X402_TESTNET_PROOF_2026-03-22.md`](../progress/X402_TESTNET_PROOF_2026-03-22.md)
- [`docs/submission/agent.json`](agent.json)
- [`docs/submission/agent_log.json`](agent_log.json)

## Strongest Onchain Proofs

### Base Sepolia escrow flow

- create: `0xc6f49d1fa0cd024852ea3651317b9ff31918abf02637fc73c8c5feac9ffd310c`
- approve: `0x711ad623f80f0b11114ff6dc8a9ab0a79984736b2d4204bbfb284ef8e7eef1e8`
- fund: `0x7b08af64c1137c6ebcc94d3ba428a4f7a7e2fa1559b159d298e8934e985dc2c2`
- submit: `0x162d040320623aab308a1dc96f776637efe9c6a96ea04603dc035a66d9c76299`
- complete: `0x5e44b634e6a85dbc096c4ee8cf72b7b6ad3bb0c853218ed1870cc042c031fcb4`

### Celo Sepolia happy path

- create: `0xa256e0a6010897ab6eb2377aebcd12265ea81a147423d42d92a37d7c86db9de0`
- approve: `0x3093d227710f4f9d811d3fe74637de2c6d2ce3f1b73faa360edd9c459b61388b`
- fund: `0x25331c72df3ba3f7e297c3abbe4b496c0d5dd48259d52423971aec746e714761`
- submit: `0x14cb79f543e152d19bc12459dd7c8cde40242f342672250b77512b2aa6d445a6`
- complete: `0x0bbf3cd7388dce58fe5ef0e58a0b854bfe12a58d14237e1c49b30d26f20fb0b8`

### Celo Sepolia reject path

- create: `0xde835a7f2805fb4fae137f68df3dcc1b583e953d7742212604edb3e2b0a7ec0e`
- approve: `0x7882010329019bea497ec4e2c61f64b19a7c7848f38927aaf7822bb8acd3213e`
- fund: `0x86030983f61549d91e72c798f3ae0d133fa69278b3123c1df2d2e185edf4f5a5`
- submit: `0x1ae3a9a65a0bc5037ccc539cf81522c662f8c372d535a05e6734d4b8a9051b22`
- reject: `0x70970f5155186d17d93f1510fc18afd300da80ea43b076d7563feeac923b9519`

### x402 Base Sepolia paid request

- settlement tx: `0x8dfabc6a77205b0740aa7bc48e230b7516acc76295536d18a6a30db19476940c`
- network: `eip155:84532`
- price: `0.01 USDC`

## Trust Evidence

Strong ERC-8004 proof lives in:
- [`contracts/src/identity/ERC8004Verifier.sol`](../../contracts/src/identity/ERC8004Verifier.sol)
- [`contracts/src/DealRailHook.sol`](../../contracts/src/DealRailHook.sol)
- [`contracts/test/EscrowRailERC20Hook.t.sol`](../../contracts/test/EscrowRailERC20Hook.t.sol)

Why this is strong:
- trust data is read before sensitive actions
- hook logic affects execution
- settlement can write reusable trust feedback

## Agent Evidence

The strongest Let the Agent Cook proof is:
- published package `@kairenxyz/dealrail`
- live CLI path against the deployed backend
- canonical agent descriptors in [`agent.json`](agent.json) and [`agent_log.json`](agent_log.json)

## Evidence Posture By Track

| Track | Readiness | Strongest evidence | Missing proof |
|------|-----------|--------------------|---------------|
| Open Track | High | live product plus Base and Celo txs | final video only |
| Protocol Labs ERC-8004 | High | hook, verifier, tests, deployments | optional stronger identity artifact |
| Protocol Labs Let the Agent Cook | High | package + CLI run + agent artifacts | final packaging only |
| Virtuals ERC-8183 | High | commerce loop is the core product | mostly explanatory polish |
| Celo | High | happy and reject tx sets | none beyond demo emphasis |
| AgentCash / x402 | High | paid-request tx proof | more proofs optional |
| Base Agent Services on Base | Medium | Base evidence plus public Base service directory | public open-market proof |
| MetaMask | Low | builder/signing path | delegated tx hash |
| Uniswap | Low | Base-only preview payload builder | swap tx hash |
| Locus | Low | adapter exists | live proof |
