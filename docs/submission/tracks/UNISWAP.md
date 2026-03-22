# Uniswap

## Current Status

Partial.

The repo contains a Base-first treasury-routing preview after settlement. It is intentionally scoped as a Base extension, not a generic multichain ingress story, and the canonical ledger does not yet include an executed Uniswap swap tx.

## Core File

- [`backend/src/services/uniswap.service.ts`](../../../backend/src/services/uniswap.service.ts)

## What Exists

- Base-first payout-routing preview from completed Base jobs
- approve payload builder
- exact-input-single swap payload builder
- official current Uniswap docs show Trading API support for Base Sepolia (`84532`)
- Celo remains a settlement rail, but this Uniswap extension is not enabled for Celo jobs

## What Is Missing For A Strong Claim

Add one real sponsor-grade artifact:

1. one executed swap
2. one tx hash
3. one short explanation of why post-settlement swapping matters inside DealRail
4. if using the Trading API path, a real `UNISWAP_API_KEY`-backed quote/swap flow

## Recommendation

Do not center the submission on Uniswap unless a real swap is performed and recorded.
