# Demo Script

This is the locked 2-4 minute demo path.

## 0:00 - 0:20

Show:
- `https://dealrail.kairen.xyz/`

Say:
- DealRail is the execution desk for agent commerce.
- Humans use the browser desk. Agents use the CLI and JSON path.

## 0:20 - 0:45

Frame the first scenario:
- a buyer needs an automation benchmark report
- they want conditional settlement, not a blind payment

## 0:45 - 1:10

Show the machine path:

```bash
DEALRAIL_API_URL=https://kairen-dealrail-production.up.railway.app npx @kairenxyz/dealrail doctor --json
```

Visible outcome:
- live backend reachable
- chain posture visible
- operator lane is real

## 1:10 - 1:45

Show Base Sepolia happy path from:
- [`../../backend/TRANSACTION_LEDGER.md`](../../backend/TRANSACTION_LEDGER.md)

Reference:
- create `0xc88a6bcef436cad6fefb0e012bf7ccf57ea991905f6b22615287701692952430`
- fund `0xb0de61acee165e1e86a587edec2f8ab4c89a3ceae9e101d23a012b31ef9f66e5`
- complete `0xfe06fa5f1c85d2c33f2c78c5d38fc03a2ab72628c292d3378830cd591f4cc519`

## 1:45 - 2:10

Show Celo reject path from:
- [`../../backend/TRANSACTION_LEDGER.md`](../../backend/TRANSACTION_LEDGER.md)

Reference:
- create `0x772b595b728a565098a0d68567792dbff2bb71c3a524427c896ab440c7a9f3f1`
- reject `0xb94efcdcfc41f7e3da223b9068e649797a575039d4e2e15b71b9beb19e31efb3`

## 2:10 - 2:35

Show the agents-that-pay proof:
- [`../progress/X402_TESTNET_PROOF_2026-03-22.md`](../progress/X402_TESTNET_PROOF_2026-03-22.md)

Reference:
- settlement `0x8dfabc6a77205b0740aa7bc48e230b7516acc76295536d18a6a30db19476940c`

## 2:35 - 3:00

Close on the standards:
- ERC-8183-style evaluator commerce flow
- ERC-8004 verifier + hook
- live browser + live backend + live CLI

## Final Track Statement

Primary:
- Open Track
- Protocol Labs ERC-8004
- Virtuals ERC-8183
- Celo
- x402 on testnet

Stretch:
- Let the Agent Cook
