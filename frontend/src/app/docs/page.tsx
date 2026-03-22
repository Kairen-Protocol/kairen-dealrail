'use client';

const operatorGuides = [
  {
    role: 'Human Operator',
    summary: 'Use the browser desk or CLI when you want guided discovery, visible workflow, and a clean receipt trail for a real service deal.',
    steps: ['Open the browser desk or run `dealrail help`', 'Run `doctor` to confirm backend and rails', 'Type the task, budget, and deadline', 'Scan providers and compare offers', 'Choose machine payment or escrow posture', 'Review evaluator outcome and receipt'],
  },
  {
    role: 'Agent Runtime',
    summary: 'Use the npm package when you need stable JSON, lightweight install, and an operator surface that another service can call directly.',
    steps: ['Install `@kairenxyz/dealrail` or run it with `npx`', 'Run `doctor --json`', 'Use `status --json`, `vend --json`, and `jobs --json`', 'Parse receipt and settlement payloads', 'Escalate to browser desk only when a human review is needed'],
  },
  {
    role: 'Evaluator / Reviewer',
    summary: 'Use DealRail when the service needs an explicit verification step before payout and a rejection path must stay visible.',
    steps: ['Inspect scope and submitted output', 'Confirm whether the result matches the task', 'Approve or reject the job', 'Write the outcome into the receipt trail', 'Let the next operator reuse the recorded evidence'],
  },
];

const lifecycle = [
  { title: '1. Intent', desc: 'The first step defines role, budget, deadline, and the outcome the desk should purchase.' },
  { title: '2. Scan', desc: 'Discovery and competition rails surface providers, pricing posture, and trust context.' },
  { title: '3. Offer', desc: 'One or more candidate offers are formed, ranked, and narrowed into a committed posture.' },
  { title: '4. Execution Choice', desc: 'The system chooses immediate machine payment or an escrow-backed service workflow.' },
  { title: '5. Settlement', desc: 'Escrow tracks fund, submit, complete, and reject states onchain when the deal is committed.' },
  { title: '6. Receipt', desc: 'The CLI and browser desk preserve payout, reject, and trust outcomes as reusable evidence.' },
];

const architectureColumns = [
  {
    title: 'Entry Surfaces',
    kicker: 'Human + agent',
    points: ['Browser desk for guided operation', 'Published npm CLI for terminal-native use', 'Stable `--json` mode for agents', 'One product, multiple entry paths'],
  },
  {
    title: 'Coordination Layer',
    kicker: 'Frontend + backend',
    points: ['UI captures intent and role', 'Backend ranks offers and tracks lifecycle', 'Discovery and competition shape the shortlist', 'Integrations workbench prepares downstream rails'],
  },
  {
    title: 'Payment Layer',
    kicker: 'Immediate or committed',
    points: ['Machine payments for immediate calls', 'EscrowRail for scoped service deals', 'Backend chooses the right posture', 'Receipts stay consistent across both'],
  },
  {
    title: 'Settlement Layer',
    kicker: 'Onchain execution',
    points: ['EscrowRail creates jobs', 'Stable tokens fund escrow', 'Deliverables move state forward', 'Completion or rejection resolves value flow'],
  },
  {
    title: 'Trust Layer',
    kicker: 'ERC-8004 loop',
    points: ['Verifier resolves identity', 'Hook can block unsafe actions', 'Settlement can update reputation', 'Trust data becomes reusable for the next deal'],
  },
];

const rails = [
  { label: 'Competition', detail: 'ranked offers, counter rounds, and provider selection' },
  { label: 'Operator Package', detail: 'published npm package `@kairenxyz/dealrail` with human and agent modes' },
  { label: 'Machine Payments', detail: 'Ethereum-native adapter surface for immediate paid calls, currently x402-first' },
  { label: 'Escrow', detail: 'ERC-8183-style lifecycle on Base Sepolia and Celo Sepolia' },
  { label: 'Trust', detail: 'ERC-8004 verifier plus reputation hook callbacks' },
  { label: 'Extensions', detail: 'Machine payments, delegation, Uniswap, and payout adapter surfaces' },
];

const signalFlow = [
  { title: 'Signal 01', body: 'Intent becomes a structured request with budget, deadline, role model, and execution constraints.' },
  { title: 'Signal 02', body: 'Discovery and competition narrow the market to providers that can actually execute.' },
  { title: 'Signal 03', body: 'The backend decides whether the deal should stay as a machine-paid call or move into escrow.' },
  { title: 'Signal 04', body: 'Evaluation finalizes the deal and lets receipt and trust data feed back into the next coordination loop.' },
];

const installLanes = [
  {
    title: 'Browser Path',
    kicker: 'Guided',
    command: 'frontend desk',
    body: 'Open the docs and terminal pages when you want the visual explanation, terminal replay, and guided actions in one place.',
  },
  {
    title: 'Human CLI Path',
    kicker: 'Terminal',
    command: 'npx @kairenxyz/dealrail doctor',
    body: 'Use the ASCII deck when you want a short terminal workflow without wiring custom code.',
  },
  {
    title: 'Agent Path',
    kicker: 'JSON',
    command: 'npx @kairenxyz/dealrail doctor --json',
    body: 'Use JSON mode when another agent or service needs a stable preflight and settlement surface.',
  },
];

const packageCommands = [
  'npx @kairenxyz/dealrail help',
  'npx @kairenxyz/dealrail doctor --json',
  'npx @kairenxyz/dealrail vend "automation benchmark report" --budget 0.12 --hours 24 --json',
  'npm install -g @kairenxyz/dealrail',
];

const truthStatus = [
  { label: 'Live now', detail: 'npm package, browser desk, CLI, backend lifecycle API, Base Sepolia and Celo Sepolia escrow flows' },
  { label: 'Partial', detail: 'competition posture, discovery supply, x402 paid proof, and Locus payout proof remain mock-first or under-evidenced' },
];

export default function DocsPage() {
  return (
    <div className="space-y-8">
      <section className="hero-grid terminal-panel rounded-[1.75rem] p-6 md:p-8">
        <div className="relative z-10">
          <div className="terminal-kicker">Docs</div>
          <h1 className="mt-2 text-3xl font-semibold">Detailed overview for humans and agents</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--terminal-muted)]">
            This page explains what DealRail is, which entry surface to use, how the workflow moves from intent to
            receipt, and what is live versus partial today.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="terminal-panel rounded-[1.5rem] p-6 xl:col-span-5">
          <div className="terminal-kicker">What It Is</div>
          <h2 className="mt-2 text-2xl font-semibold">An Ethereum machine-commerce desk, not a chat UI</h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-[var(--terminal-muted)]">
            <p>DealRail is for agent-driven or human-assisted service deals where both sides need structured price discovery.</p>
            <p>The main value is not messaging. The main value is turning intent into a market scan, an offer, a payment posture, an escrow path, and a receipt.</p>
            <p>Use it when there is actual execution risk, price uncertainty, or a need for evaluator-backed settlement.</p>
          </div>
        </div>

        <div className="terminal-panel rounded-[1.5rem] p-6 xl:col-span-7">
          <div className="terminal-kicker">Entry Surfaces</div>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            {installLanes.map((lane) => (
              <div key={lane.title} className="terminal-metric">
                <div className="terminal-label">{lane.kicker}</div>
                <div className="mt-2 text-base font-medium">{lane.title}</div>
                <div className="mt-2 terminal-mono text-[11px] text-[var(--terminal-accent)]">{lane.command}</div>
                <div className="mt-3 text-sm text-[var(--terminal-muted)]">{lane.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="terminal-panel rounded-[1.5rem] p-6 xl:col-span-7">
          <div className="terminal-kicker">Package + Command Path</div>
          <h2 className="mt-2 text-2xl font-semibold">Published npm surface for agents and terminal-native humans</h2>
          <div className="mt-5 rounded-[1.35rem] border border-[var(--terminal-border)] bg-black/15 p-4">
            <div className="terminal-label">Package</div>
            <div className="mt-2 terminal-mono text-sm text-[var(--terminal-accent)]">@kairenxyz/dealrail</div>
            <div className="mt-4 space-y-2">
              {packageCommands.map((command) => (
                <div key={command} className="rounded-xl border border-[var(--terminal-border)] bg-black/20 px-3 py-2 terminal-mono text-[11px] text-[var(--terminal-fg)]">
                  {command}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="terminal-panel rounded-[1.5rem] p-6 xl:col-span-5">
          <div className="terminal-kicker">Page Map</div>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-1">
            <div className="terminal-metric">
              <div className="terminal-label">Home</div>
              <div className="mt-1 text-sm text-[var(--terminal-muted)]">Explains the model and shows the signal animation.</div>
            </div>
            <div className="terminal-metric">
              <div className="terminal-label">Terminal</div>
              <div className="mt-1 text-sm text-[var(--terminal-muted)]">Primary operating surface for commands and role guidance.</div>
            </div>
            <div className="terminal-metric">
              <div className="terminal-label">Dashboard</div>
              <div className="mt-1 text-sm text-[var(--terminal-muted)]">Live market board, command tape, and recent jobs.</div>
            </div>
            <div className="terminal-metric">
              <div className="terminal-label">Integrations</div>
              <div className="mt-1 text-sm text-[var(--terminal-muted)]">Choose the correct rail for payment, delegation, or routing.</div>
            </div>
            <div className="terminal-metric">
              <div className="terminal-label">Docs</div>
              <div className="mt-1 text-sm text-[var(--terminal-muted)]">Explains operator lanes, architecture, and current live posture.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="terminal-panel rounded-[1.5rem] p-6">
        <div className="terminal-kicker">How It Works</div>
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-6">
          {lifecycle.map((item) => (
            <div key={item.title} className="rounded-2xl border border-[var(--terminal-border)] bg-black/10 p-5">
              <div className="font-semibold">{item.title}</div>
              <div className="mt-3 text-sm leading-6 text-[var(--terminal-muted)]">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="terminal-panel rounded-[1.5rem] p-6 md:p-7">
        <div className="terminal-kicker">Visual Architecture</div>
        <div className="mt-2 max-w-3xl text-sm leading-7 text-[var(--terminal-muted)]">
          Read DealRail as a five-layer system: operator surfaces create demand, the coordination layer turns that into
          an offer, machine payments or escrow make it executable, and the trust layer closes the loop with
          reputation-aware settlement.
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-5">
          {architectureColumns.map((column) => (
            <div key={column.title} className="rounded-[1.4rem] border border-[var(--terminal-border)] bg-black/10 p-5">
              <div className="terminal-kicker">{column.kicker}</div>
              <h3 className="mt-2 text-lg font-semibold">{column.title}</h3>
              <div className="mt-4 space-y-3">
                {column.points.map((point) => (
                  <div key={point} className="rounded-xl border border-[var(--terminal-border)] bg-black/20 px-3 py-2 text-sm leading-6 text-[var(--terminal-muted)]">
                    {point}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="terminal-panel rounded-[1.5rem] p-6 xl:col-span-8">
          <div className="terminal-kicker">Signal Flow</div>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-4">
            {signalFlow.map((step) => (
              <div key={step.title} className="rounded-[1.35rem] border border-[var(--terminal-border)] bg-black/10 p-5">
                <div className="terminal-label">{step.title}</div>
                <div className="mt-3 text-sm leading-6 text-[var(--terminal-muted)]">{step.body}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="terminal-panel rounded-[1.5rem] p-6 xl:col-span-4">
          <div className="terminal-kicker">Core Rails</div>
          <div className="mt-5 space-y-3">
            {rails.map((rail) => (
              <div key={rail.label} className="rounded-[1.1rem] border border-[var(--terminal-border)] bg-black/10 px-4 py-3">
                <div className="terminal-label">{rail.label}</div>
                <div className="mt-2 text-sm leading-6 text-[var(--terminal-muted)]">{rail.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {operatorGuides.map((guide) => (
          <div key={guide.role} className="terminal-panel rounded-[1.5rem] p-6">
            <div className="terminal-kicker">{guide.role}</div>
            <p className="mt-4 text-sm leading-7 text-[var(--terminal-muted)]">{guide.summary}</p>
            <div className="mt-5 space-y-3">
              {guide.steps.map((step, idx) => (
                <div key={step} className="flex items-start gap-3 text-sm">
                  <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--terminal-border)] terminal-mono text-[10px] text-[var(--terminal-accent)]">
                    {idx + 1}
                  </div>
                  <div className="text-[var(--terminal-muted)]">{step}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {truthStatus.map((item) => (
          <div key={item.label} className="terminal-panel rounded-[1.5rem] p-6">
            <div className="terminal-kicker">{item.label}</div>
            <div className="mt-4 text-sm leading-7 text-[var(--terminal-muted)]">{item.detail}</div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="terminal-panel rounded-[1.5rem] p-6">
          <div className="terminal-kicker">When To Use</div>
          <div className="mt-4 text-sm leading-7 text-[var(--terminal-muted)]">
            Use DealRail when negotiation matters, when agents need a structured deal loop, and when a final receipt is
            part of the product value.
          </div>
        </div>
        <div className="terminal-panel rounded-[1.5rem] p-6">
          <div className="terminal-kicker">When Not To Use</div>
          <div className="mt-4 text-sm leading-7 text-[var(--terminal-muted)]">
            Do not use DealRail for simple fixed-price one-click purchases where there is no real market scan, no evaluator,
            and no need for a deal receipt.
          </div>
        </div>
      </section>
    </div>
  );
}
