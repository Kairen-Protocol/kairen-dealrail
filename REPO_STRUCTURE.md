# Repository Structure

This file describes the current canonical repository layout.

## Top Level

```text
kairen-dealrail/
├── contracts/           Solidity contracts and Foundry tests
├── backend/             API, integrations, smoke tests, tx ledger
├── frontend/            Next.js app and demo UI
├── cli/                 Command-line interface
├── docs/                Submission docs, strategy, guides, history
├── skills/              Agent operation guides
├── scripts/             Utility scripts
├── research/            Research artifacts and briefs
├── README.md            Canonical project overview
├── AGENT.md             AI judge and collaborator navigation
├── STATUS.md            Canonical deployment and build status
├── CONTRIBUTING.md      Repo maintenance and PR rules
└── package.json         Root scripts for builds and checks
```

## Canonical External-Facing Docs

- `README.md`
- `AGENT.md`
- `docs/submission/`
- `STATUS.md`
- `backend/TRANSACTION_LEDGER.md`

## Canonical Truth Files

If deployments or claims change, keep these aligned:

1. `STATUS.md`
2. `backend/TRANSACTION_LEDGER.md`
3. `backend/src/config.ts`
4. `frontend/src/lib/contracts.ts`

## Package Responsibilities

### contracts
- escrow contracts
- trust hooks
- identity verifiers
- Foundry tests and deployment scripts

### backend
- lifecycle API
- provider discovery
- negotiation bridge
- execution adapters
- smoke tests and tx evidence

### frontend
- operator UI
- judge-facing demo experience
- architecture and workflow views

### cli
- command-line access to health, discovery, negotiation, jobs, and rails

## Docs Responsibilities

### docs/submission
- canonical judging and submission pack

### docs/strategy
- planning, roadmaps, and historical track analysis

### docs/architecture
- legacy and historical architecture docs unless referenced from `docs/submission`

### docs/guides
- setup, deployment, and testing instructions
