# TX Agent Wallet Setup (EVM + Solana)

## Current Wallets (Public Addresses)
- EVM (tx-agent): `0xCfd9Ca200d969876fcb6EDCB5cF8eEF097013d53`
- Solana (tx-agent): `HpvjXahfAduXQQG4rANBcBorQnxTzpKEoSiTb662Wbk2`

## Security
- Private keys are stored locally at:
  - `~/.openclaw/secrets/tx-agent-wallets.json`
- File permissions: `600`
- Never print secret keys in logs/chat.

## Operating Mode
- Start with **testnets** only:
  - EVM: Base Sepolia (or equivalent testnet)
  - Solana: Devnet
- Run mock/test transactions before mainnet enablement.

## Mainnet Readiness Checklist
1. Funding caps configured
2. Explicit tx confirmation gates active
3. Simulation required before broadcast
4. Risk tier = SAFE/CAUTION/ESCALATE enforced
5. Audit logging enabled
6. Secrets backup + recovery drill complete

## Funding Guidance (initial)
- Keep low-risk initial balances only
- Increase limits gradually after successful test cycles
