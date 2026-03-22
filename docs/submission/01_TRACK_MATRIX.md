# Track Matrix

This matrix maps the official Synthesis prize directions to the current DealRail repo state.

The percentages below are practical submission-readiness scores:
- `90-100%`: submit confidently
- `75-89%`: good stretch track if the story is framed carefully
- `50-74%`: real implementation exists, but sponsor-grade proof is incomplete
- `<50%`: keep as roadmap only

## Priority Summary

Submit confidently:
- Open Track
- Protocol Labs: Agents With Receipts / ERC-8004
- Virtuals: ERC-8183 Open Build
- Celo
- AgentCash / x402 on a testnet-only basis

Best stretch track:
- Protocol Labs: Let the Agent Cook

Keep out of the main submission unless new proof is added:
- Base Agent Services on Base
- MetaMask Delegations
- Uniswap
- Locus

## Matrix

| Sponsor / Track | Readiness | What Judges Want | Current Repo Coverage | Main Blocker | Fastest Resolution |
|-----------------|-----------|------------------|----------------------|--------------|--------------------|
| Synthesis Open Track | 95% | Clear system, real utility, coherent story | Full product narrative across browser, CLI, backend, escrow, and receipts | Final video packaging | Record one polished live walkthrough using Cloudflare + Railway |
| Protocol Labs: Agents With Receipts / ERC-8004 | 90% | Identity, trust, receipts, reputation | ERC-8004 verifier, hook gates, reputation writes, discovery enrichment, tests, deployments | No canonical registered agent identity artifact in the submission pack yet | Add one operator-facing identity registration artifact or explicit registry lookup proof |
| Virtuals: ERC-8183 Open Build | 92% | Real ERC-8183 commerce implementation | Escrow-first commerce loop is core to the product on Base Sepolia and Celo Sepolia | Could use one tighter ERC-8183 schema/receipt explanation for judges | Add a concise protocol mapping note and keep pointing to live flows |
| Celo: Best Agent on Celo | 90% | Real utility on Celo rails | Celo Sepolia deployment, happy path, and reject path all evidenced | Needs only better demo packaging, not code | Include the Celo flow prominently in the final demo and submission text |
| AgentCash / x402 | 85% | Real paid x402 request | x402 proxy path plus real Base Sepolia paid-request proof in the ledger | Only one canonical paid proof so far, testnet only | Add one more paid request or public service proof if time permits |
| Protocol Labs: Let the Agent Cook | 70% | Discover -> plan -> execute -> verify -> submit, plus `agent.json` and `agent_log.json` | Multi-step agent path exists, CLI exists, docs are agent-friendly, but autonomy artifacts are not yet canonical | Missing `agent.json`, `agent_log.json`, and an honest agent-run package | Add truthful manifests and one structured end-to-end execution log |
| Base: Agent Services on Base | 75% | Discoverable paid service on Base | Base Sepolia escrow evidence and x402 proof exist | Public discoverable service proof on Base is not yet canonical | Expose a clear public service endpoint and log one discoverable paid request |
| MetaMask: Best Use of Delegations | 60% | Real delegated authorization flow | Delegation payload builder and signing path exist in backend/frontend | No delegated transaction hash in the ledger | Execute one delegated funding or settlement transaction and log it |
| Uniswap: Agentic Finance | 55% | Real swap tx ids and sponsor-grade use | Quote and tx builder code exist; Base Sepolia is now documented as supported | No executed swap tx and no `UNISWAP_API_KEY`-backed live proof | Add the API key, perform one swap, and record the tx hash |
| Locus: Best Use of Locus | 45% | Locus must be core and live | Live/mock bridge exists, mock mode is the default | No live Locus proof and no reason to claim it as core yet | Only upgrade if a real Locus operation is executed and logged |
| Bankr / MoonPay / EigenCloud / others | 10-25% | Sponsor-specific core use | Not load-bearing in the current demo path | No meaningful evidence | Keep out of the submission unless built for real |

## Recommended Track Lock

Primary set:
1. Synthesis Open Track
2. Protocol Labs: Agents With Receipts / ERC-8004
3. Virtuals: ERC-8183 Open Build
4. Celo: Best Agent on Celo
5. AgentCash / x402 on a testnet-only basis

Stretch set:
6. Protocol Labs: Let the Agent Cook

## Why The Top 5 Are Best

### Open Track
- strongest overall system story
- broadest evidence base
- least dependent on one sponsor-specific artifact

### Protocol Labs / ERC-8004
- trust is part of execution, not just profile display
- verifier and hook change system behavior
- strongest sponsor-to-product fit in the repo

### Virtuals / ERC-8183
- the commerce rail is already the core product thesis
- this track rewards the thing the repo is actually built around

### Celo
- real testnet deployment breadth
- both success and failure flows are already recorded

### AgentCash / x402
- now backed by a real paid-request settlement proof
- useful as a truthful “agents that pay” extension

## Upgrade Order For The Last Stretch Hours

1. Package `agent.json` and `agent_log.json` to raise Let the Agent Cook.
2. Add one delegated MetaMask tx if the flow is executable quickly.
3. Add one Uniswap swap only if the API key and testnet funds are available.
4. Leave Locus as roadmap unless a live tool run happens.
