# Backend Test Scripts

This folder contains practical testnet lifecycle scripts used during integration and demo validation.

## Prerequisites
- Node.js 20+
- Dependencies installed (`npm install` in `backend/`)
- `.env` configured (RPC URL, private keys, contract addresses)

## Core flows
- `test-lifecycle.ts` — end-to-end happy path (`create -> fund -> submit -> complete`)
- `test-reject-lifecycle.ts` — rejection/failure path
- `test-lifecycle-celo-sepolia.ts` — Celo Sepolia smoke path

## Utility scripts
- `check-all-balances.ts`
- `check-escrow-balance.ts`
- `check-job-state.ts`
- `fund-wallets.ts`
- `recycle-usdc.ts`
- `complete-funded-jobs.ts`

## Example usage
From `backend/`:

```bash
npx tsx tests/test-lifecycle.ts
npx tsx tests/test-reject-lifecycle.ts
npx tsx tests/test-lifecycle-celo-sepolia.ts
```

## Notes
- Some flows require a short delay between `submit` and `complete` due to state propagation.
- Use small budgets and test wallets on testnets only.
