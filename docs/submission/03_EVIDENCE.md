# Evidence

This file maps claims to the strongest proof artifacts.

## Canonical Sources

- [`../../STATUS.md`](../../STATUS.md)
- [`../../backend/TRANSACTION_LEDGER.md`](../../backend/TRANSACTION_LEDGER.md)
- [`../../backend/src/config.ts`](../../backend/src/config.ts)
- [`../../frontend/src/lib/contracts.ts`](../../frontend/src/lib/contracts.ts)
- [`agent_log.json`](agent_log.json)

## Best Onchain Proofs

### Base Sepolia happy path
- create: `0xc88a6bcef436cad6fefb0e012bf7ccf57ea991905f6b22615287701692952430`
- approve: `0xae617b8867bb6739bf13e9aedde6045ebd8d8e49690f02175ffedb4b8abfb02d`
- fund: `0xb0de61acee165e1e86a587edec2f8ab4c89a3ceae9e101d23a012b31ef9f66e5`
- submit: `0x7ceaed4c8f145be9978289f0eea39cab4f92aa8417a33d1a06a98e8243de7f88`
- complete: `0xfe06fa5f1c85d2c33f2c78c5d38fc03a2ab72628c292d3378830cd591f4cc519`

### Celo Sepolia happy path
- create: `0x5424798f49767904187831f74c1aff76ca173f05cf24522e49e10f206a1813e5`
- fund: `0x16603b8ae114379ccb440b931c1e59e5f06037fe66b461b2cd588bb133627a1d`
- complete: `0x33a7fbf3c45f9c12a43c59c344d7ae1aaaf3e0928cd157c3dd63feb0d737ce24`

### Celo Sepolia reject path
- create: `0x772b595b728a565098a0d68567792dbff2bb71c3a524427c896ab440c7a9f3f1`
- reject: `0xb94efcdcfc41f7e3da223b9068e649797a575039d4e2e15b71b9beb19e31efb3`

### x402 paid request
- settlement: `0x8dfabc6a77205b0740aa7bc48e230b7516acc76295536d18a6a30db19476940c`
- proof script: [`../../backend/tests/proof-x402-testnet.ts`](../../backend/tests/proof-x402-testnet.ts)
- note: [`../progress/X402_TESTNET_PROOF_2026-03-22.md`](../progress/X402_TESTNET_PROOF_2026-03-22.md)

## Contract Proof

- escrow lifecycle: [`../../contracts/src/EscrowRail.sol`](../../contracts/src/EscrowRail.sol)
- ERC-20 escrow lifecycle: [`../../contracts/src/EscrowRailERC20.sol`](../../contracts/src/EscrowRailERC20.sol)
- verifier: [`../../contracts/src/identity/ERC8004Verifier.sol`](../../contracts/src/identity/ERC8004Verifier.sol)
- trust hook: [`../../contracts/src/DealRailHook.sol`](../../contracts/src/DealRailHook.sol)
- hook tests: [`../../contracts/test/EscrowRailERC20Hook.t.sol`](../../contracts/test/EscrowRailERC20Hook.t.sol)

## Runtime Safety Proof Added After Review

- public API no longer accepts raw private keys
- public chain metadata omits RPC URLs
- mock discovery and mock negotiation are now aligned
- browser writes are chain-pinned to the job chain

These behaviors are now covered by backend runtime tests:
- [`../../backend/src/index-simple.test.ts`](../../backend/src/index-simple.test.ts)

## Reproducibility

Root command:

```bash
npm run test:contracts
```

Expected result:
- `22 tests passed`

Node stack:

```bash
cd ../../backend && npm test
cd ../../frontend && npm run lint && npm run type-check && npm run build
cd ../../cli && npm run check && npm run build
```

Foundry fallback if local `forge` is not on PATH:

```bash
bash scripts/forgew.sh test -vvv --root contracts
```

## Autonomy Evidence

- agent manifest: [`agent.json`](agent.json)
- recorded agent run: [`agent_log.json`](agent_log.json)
- source note for that run: [`../progress/DEMO_VALIDATION_2026-03-22.md`](../progress/DEMO_VALIDATION_2026-03-22.md)
