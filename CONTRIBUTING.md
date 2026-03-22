# Contributing

This repository is organized as a production-grade project, not a scratchpad.

## Ground Rules

1. Keep one canonical story.
2. Do not introduce sponsor claims that are not backed by code or evidence.
3. Keep deployment truth aligned across:
   - `STATUS.md`
   - `backend/TRANSACTION_LEDGER.md`
   - `backend/src/config.ts`
   - `frontend/src/lib/contracts.ts`
4. Treat `docs/submission` as canonical for external readers and judges.
5. Treat `docs/strategy` and older docs as planning/history unless explicitly promoted.

## Repository Layout

- `contracts/`: Solidity contracts and Foundry tests
- `backend/`: API, integrations, transaction ledger, smoke tests
- `frontend/`: Next.js application and demo UI
- `cli/`: command-line interface
- `docs/submission/`: canonical submission and judging pack
- `docs/strategy/`: planning and historical strategy
- `skills/`: operational role guides for agents

## Before Opening A PR

Run the relevant checks:

```bash
npm run build
npm run test:contracts
```

If you only touched one package, run the package-local build as well.

## Documentation Rules

- Update `docs/submission` first for any change that affects external understanding.
- Mark historical docs as historical instead of silently letting them drift.
- Prefer exact file paths, exact addresses, and exact tx hashes over prose claims.

## PR Rules

- Keep PRs scoped.
- Summarize user-facing impact and evidence impact.
- If a PR changes addresses, tx references, or track claims, update the canonical files in the same PR.
- Do not merge stale PRs once a superseding branch exists.
