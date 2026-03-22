'use client';

import { FormEvent, KeyboardEvent, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { keccak256, toBytes } from 'viem';
import { healthCheck, integrationsApi, jobsApi } from '@/lib/api';
import { pushTerminalRun, TerminalActionKind } from '@/lib/terminalLedger';

type LineTone = 'system' | 'user' | 'ok' | 'warn';

type TerminalLine = {
  tone: LineTone;
  text: string;
};

export type TerminalAction = {
  kind: TerminalActionKind;
  command: string;
  note: string;
};

type Props = {
  compact?: boolean;
  onAction?: (action: TerminalAction) => void;
};

const EXAMPLES = [
  'doctor',
  'services',
  'vend benchmark report under 0.12 usdc in 24h',
  'vend image generation under 0.08 usdc in 6h',
  'providers compliance checks',
  'rails',
  'status',
];

const DEMO_SERVICES = [
  {
    id: 'image-generation',
    name: 'Image generation',
    description: 'Generate editorial product visuals, launch images, and prompt-tuned campaign assets.',
    startingPriceUsdc: 0.08,
    deliveryHours: 6,
    settlementRail: 'Base Sepolia USDC',
    providerAddress: '0xef9C7E3Fea4f54CB3C6c8fa0978a0C8aB8f28fcF',
  },
  {
    id: 'web-fetch',
    name: 'Fetch and extract',
    description: 'Fetch URLs, extract structured text, and normalize web data into machine-readable output.',
    startingPriceUsdc: 0.03,
    deliveryHours: 2,
    settlementRail: 'Base Sepolia USDC',
    providerAddress: '0x77712e28F7A4a2EeD0bd7f9F8B8486332a38892e',
  },
  {
    id: 'finding-agent',
    name: 'Finding and research',
    description: 'Search, shortlist, and summarize sources for procurement, diligence, or market discovery tasks.',
    startingPriceUsdc: 0.05,
    deliveryHours: 4,
    settlementRail: 'Celo Sepolia stablecoin',
    providerAddress: '0xe872Bd6d99452C87BA54c7618FEc71f0DB23d4f2',
  },
  {
    id: 'benchmark-report',
    name: 'Automation benchmark report',
    description: 'Compare providers, summarize tradeoffs, and return a scored recommendation sheet.',
    startingPriceUsdc: 0.09,
    deliveryHours: 20,
    settlementRail: 'Base Sepolia USDC',
    providerAddress: '0xef9C7E3Fea4f54CB3C6c8fa0978a0C8aB8f28fcF',
  },
] as const;

export function HomeCommandTerminal({ compact = false, onAction }: Props) {
  const { address } = useAccount();
  const [input, setInput] = useState('');
  const [running, setRunning] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [lines, setLines] = useState<TerminalLine[]>([
    { tone: 'system', text: 'DEALRAIL READY' },
    { tone: 'system', text: 'start: doctor | vend <need> under <budget> usdc in <hours>h | providers <need> | rails' },
    { tone: 'system', text: 'agent path: npx @kairenxyz/dealrail doctor --json' },
  ]);

  const statusLabel = useMemo(() => (running ? 'RUNNING' : 'IDLE'), [running]);

  function findDemoServices(query: string) {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [...DEMO_SERVICES];
    return DEMO_SERVICES.filter((service) =>
      `${service.name} ${service.description} ${service.id}`.toLowerCase().includes(normalized)
    );
  }

  function mockTxHash(seed: string) {
    return keccak256(toBytes(`${seed}:${Date.now()}:${Math.random().toString(36).slice(2)}`));
  }

  function appendSimulationReceipt(service: (typeof DEMO_SERVICES)[number], command: string) {
    const approveTx = mockTxHash(`${command}:approve:${service.id}`);
    const fundTx = mockTxHash(`${command}:fund:${service.id}`);
    const receiptId = `sim_${service.id}_${Date.now().toString(36)}`;

    appendMany([
      { tone: 'ok', text: `demo service=${service.name} | price=${service.startingPriceUsdc.toFixed(2)} USDC | eta=${service.deliveryHours}h` },
      { tone: 'ok', text: `settlement rail=${service.settlementRail} | provider=${service.providerAddress}` },
      { tone: 'system', text: `sim approve tx=${approveTx}` },
      { tone: 'system', text: `sim settle tx=${fundTx}` },
      { tone: 'ok', text: `receipt=${receiptId} | mode=frontend simulation | wallet=${address ? address : 'optional'}` },
      { tone: 'system', text: address ? 'wallet is connected, so this can graduate to a live client/provider path later.' : 'wallet is optional for demo mode; connect it only when you want real client/provider execution.' },
    ]);
  }

  function append(tone: LineTone, text: string) {
    setLines((prev) => [...prev, { tone, text }]);
  }

  function appendMany(entries: TerminalLine[]) {
    setLines((prev) => [...prev, ...entries]);
  }

  function emit(kind: TerminalActionKind, command: string, note: string) {
    const action: TerminalAction = { kind, command, note };
    pushTerminalRun({ action: kind, command, note });
    onAction?.(action);
  }

  function prefillFlow(text: string) {
    const lower = text.toLowerCase();
    const budgetMatch = lower.match(/(\d+(?:\.\d+)?)\s*usdc/);
    const hoursMatch = lower.match(/(\d+)\s*(?:h|hr|hrs|hour|hours)/);
    window.localStorage.setItem('dealrail.prefill.serviceRequirement', text);
    if (budgetMatch?.[1]) window.localStorage.setItem('dealrail.prefill.maxBudgetUsdc', budgetMatch[1]);
    if (hoursMatch?.[1]) window.localStorage.setItem('dealrail.prefill.maxDeliveryHours', hoursMatch[1]);
  }

  function parseBudget(command: string) {
    const match = command.toLowerCase().match(/(\d+(?:\.\d+)?)\s*usdc/);
    return match ? Number(match[1]) : undefined;
  }

  function parseDeliveryHours(command: string) {
    const match = command.toLowerCase().match(/(\d+)\s*(?:h|hr|hrs|hour|hours)/);
    return match ? Number(match[1]) : undefined;
  }

  function normalizeBuyerQuery(command: string) {
    return stripVerb(command, ['buy', 'buyer', 'vend', 'procure'])
      .replace(/\bunder\s+\d+(?:\.\d+)?\s*usdc\b/gi, '')
      .replace(/\bin\s+\d+\s*(?:h|hr|hrs|hour|hours)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function stripVerb(command: string, verbs: string[]) {
    let next = command.trim();
    for (const verb of verbs) {
      const regex = new RegExp(`^${verb}\\s*:?\s*`, 'i');
      next = next.replace(regex, '');
    }
    return next.trim();
  }

  async function showHelp(command: string) {
    const note = 'Command map loaded';
    appendMany([
      { tone: 'system', text: 'GRAMMAR' },
      { tone: 'system', text: 'doctor' },
      { tone: 'system', text: 'services' },
      { tone: 'system', text: 'scan automation' },
      { tone: 'system', text: 'providers benchmark report' },
      { tone: 'system', text: 'vend benchmark report under 0.12 usdc in 24h' },
      { tone: 'system', text: 'rails' },
      { tone: 'system', text: 'status' },
      { tone: 'system', text: 'services now loads the Base-facing service directory and visible provider supply' },
      { tone: 'system', text: 'agent lane: use the CLI with --json after doctor confirms posture' },
      { tone: 'system', text: 'human lane: use services or vend here, then inspect the board and settlement rails' },
    ]);
    emit('help', command, note);
  }

  async function showServices(command: string) {
    try {
      const directory = await integrationsApi.getBaseAgentServices();
      const note =
        directory.catalogMode === 'curated_demo'
          ? 'Base service directory loaded with curated demo supply'
          : 'Base service directory loaded';

      appendMany([
        { tone: directory.catalogMode === 'curated_demo' ? 'warn' : 'ok', text: `base service directory | chain=${directory.chainId} | mode=${directory.catalogMode}` },
        { tone: 'ok', text: `public surfaces=${directory.publicSurfaces.length} | visible supply=${directory.discovery.providerCount}` },
        ...directory.publicSurfaces.slice(0, 4).map((surface) => ({
          tone: 'system' as LineTone,
          text: `${surface.name} | ${surface.method} ${surface.endpoint} | ${surface.access}`,
        })),
        { tone: 'system', text: 'visible supply' },
        ...directory.supplyPreview.slice(0, 4).map((service) => ({
          tone: 'system' as LineTone,
          text: `${service.serviceName} | ${service.basePriceUsdc ?? 'n/a'} USDC | rep ${service.reputationScore ?? 'n/a'} | ${service.source}`,
        })),
        { tone: 'system', text: 'next: providers <need> or vend <need> under <budget> usdc in <hours>h' },
      ]);
      emit('market_scan', command, note);
      return;
    } catch {
      const note = 'Fallback service catalog loaded';
      appendMany([
        { tone: 'warn', text: 'base service directory is unavailable; showing fallback demo catalog' },
        ...DEMO_SERVICES.map((service) => ({
          tone: 'system' as LineTone,
          text: `${service.name} | ${service.startingPriceUsdc.toFixed(2)} USDC | ${service.deliveryHours}h | ${service.settlementRail}`,
        })),
        { tone: 'system', text: 'try: vend image generation under 0.08 usdc in 6h' },
      ]);
      emit('market_scan', command, note);
    }
  }

  async function runDoctor(command: string) {
    try {
      const [health, sources, providers, execution, locus, jobs] = await Promise.all([
        healthCheck(),
        integrationsApi.listDiscoverySources().catch(() => ({ sources: [] })),
        integrationsApi.listProviders().catch(() => ({ providers: [] })),
        integrationsApi.listExecutionProviders().catch(() => ({ providers: [] })),
        integrationsApi.listLocusTools().catch(() => ({ tools: { mode: 'fallback' as const } })),
        jobsApi.list({ limit: 4 }).catch(() => ({ jobs: [], pagination: { limit: 4, totalOnchain: 0 } })),
      ]);

      const enabledSources = sources.sources.filter((source) => source.enabled).map((source) => source.id);
      const providerCount = providers.providers.length;
      const liveProviderCount = providers.providers.filter((provider) => provider.source !== 'mock').length;
      const locusMode = Array.isArray(locus.tools) ? 'live' : locus.tools?.mode || 'fallback';
      const note = health.integrations?.x402nMockMode
        ? 'Doctor complete: desk is reachable but competition is still demo/mock'
        : 'Doctor complete: desk is reachable and ready for live routing';

      appendMany([
        { tone: 'ok', text: `api=reachable | chain=${health.blockchain.chainId} | escrow=${health.blockchain.escrowAddress}` },
        { tone: health.integrations?.x402nMockMode ? 'warn' : 'ok', text: `market competition=${health.integrations?.x402nMockMode ? 'demo/mock' : 'live'}` },
        { tone: 'ok', text: `machine payments=${health.integrations?.machinePaymentsPrimary ?? 'x402'}` },
        { tone: enabledSources.length > 0 ? 'ok' : 'warn', text: `enabled discovery=${enabledSources.join(', ') || 'none'}` },
        { tone: liveProviderCount > 0 ? 'ok' : 'warn', text: `provider supply=${providerCount} total | ${liveProviderCount} live | ${providerCount - liveProviderCount} mock` },
        { tone: locusMode === 'live' ? 'ok' : 'warn', text: `locus payout=${locusMode}` },
        { tone: 'ok', text: `execution adapters=${execution.providers.length} | onchain jobs=${jobs.pagination?.totalOnchain ?? jobs.jobs.length}` },
        { tone: 'system', text: 'next human: vend automation benchmark report under 0.12 usdc in 24h' },
        { tone: 'system', text: 'next agent: dealrail doctor --json && dealrail vend "automation benchmark report" --budget 0.12 --hours 24 --json' },
      ]);

      emit('doctor', command, note);
    } catch {
      const note = 'Doctor failed: backend is unreachable';
      appendMany([
        { tone: 'warn', text: note },
        { tone: 'warn', text: 'check NEXT_PUBLIC_API_URL, backend startup, and local port forwarding before testing flows' },
      ]);
      emit('doctor', command, note);
    }
  }

  async function runStatus(command: string) {
    try {
      const health = await healthCheck();
      const note = `Backend online on chain ${health.blockchain.chainId}`;
      appendMany([
        { tone: 'ok', text: note },
        { tone: 'ok', text: `escrow=${health.blockchain.escrowAddress}` },
        { tone: health.integrations?.x402nMockMode ? 'warn' : 'ok', text: `market competition=${health.integrations?.x402nMockMode ? 'demo/mock' : 'live'}` },
        { tone: 'ok', text: `machine payments=${health.integrations?.machinePaymentsPrimary ?? 'x402'}` },
      ]);
      emit('status', command, note);
    } catch {
      const note = 'Backend offline or miswired';
      append('warn', `${note}. Check NEXT_PUBLIC_API_URL and restart the frontend after env changes.`);
      emit('status', command, note);
    }
  }

  async function runScan(command: string) {
    const query = stripVerb(command, ['scan', 'market', 'find providers', 'providers']);
    const demoMatches = findDemoServices(query);

    if (demoMatches.length > 0) {
      const note = `Demo service scan returned ${demoMatches.length} catalog entries`;
      appendMany([
        { tone: 'ok', text: `scan query=${query || 'all demo services'}` },
        { tone: 'ok', text: 'source posture=frontend demo catalog' },
        ...demoMatches.slice(0, 4).map((service) => ({
          tone: 'system' as LineTone,
          text: `${service.name} | ${service.startingPriceUsdc.toFixed(2)} USDC | ${service.deliveryHours}h | ${service.settlementRail}`,
        })),
      ]);
      emit('market_scan', command, note);
      return;
    }

    try {
      const result = await integrationsApi.listProviders({ query: query || undefined });
      const top = result.providers.slice(0, 4);
      const allMock = result.providers.length > 0 && result.providers.every((provider) => provider.source === 'mock');
      const note = `Supply scan returned ${result.providers.length} providers`;

      appendMany([
        { tone: 'ok', text: `scan query=${query || 'all supply'}` },
        { tone: allMock ? 'warn' : 'ok', text: `source posture=${allMock ? 'demo/mock only' : 'mixed/live'}` },
        ...top.map((provider) => ({
          tone: (provider.source === 'mock' ? 'warn' : 'ok') as LineTone,
          text: `${provider.serviceName} | ${provider.basePriceUsdc ?? 'n/a'} USDC | rep ${provider.reputationScore ?? 'n/a'} | ${provider.source}`,
        })),
      ]);

      if (top.length === 0) {
        append('warn', 'No provider supply matched. Add imported providers or point discovery to a live marketplace feed.');
      }

      emit('market_scan', command, note);
    } catch {
      const note = 'Supply scan failed';
      append('warn', `${note}. Discovery endpoint did not respond.`);
      emit('market_scan', command, note);
    }
  }

  async function runBuy(command: string) {
    const query = normalizeBuyerQuery(command);
    const maxBasePriceUsdc = parseBudget(command);
    const maxDeliveryHours = parseDeliveryHours(command);
    const demoMatches = findDemoServices(query);

    prefillFlow(query || command);

    if (demoMatches.length > 0) {
      const service = demoMatches[0];
      const note = `Frontend simulation staged for ${service.name}`;

      appendMany([
        { tone: 'ok', text: 'role=buyer' },
        { tone: 'ok', text: `objective=${query || service.name}` },
        ...(typeof maxBasePriceUsdc === 'number' ? [{ tone: 'ok' as LineTone, text: `budget ceiling=${maxBasePriceUsdc} USDC` }] : []),
        ...(typeof maxDeliveryHours === 'number' ? [{ tone: 'ok' as LineTone, text: `delivery target=${maxDeliveryHours}h` }] : []),
        { tone: 'ok', text: 'supply posture=frontend demo simulation' },
        { tone: 'ok', text: `candidate=${service.name} | price=${service.startingPriceUsdc.toFixed(2)} | eta=${service.deliveryHours}h | demo catalog` },
      ]);
      appendSimulationReceipt(service, command);
      emit('role_buyer', command, note);
      return;
    }

    try {
      const result = await integrationsApi.listProviders({
        query: query || undefined,
        maxBasePriceUsdc,
      });
      const shortlist = result.providers.slice(0, 3);
      const allMock = result.providers.length > 0 && result.providers.every((provider) => provider.source === 'mock');
      const note = `Buyer flow staged with ${result.providers.length} candidate providers`;

      appendMany([
        { tone: 'ok', text: 'role=buyer' },
        { tone: 'ok', text: `objective=${query || 'service request'}` },
        ...(typeof maxBasePriceUsdc === 'number' ? [{ tone: 'ok' as LineTone, text: `budget ceiling=${maxBasePriceUsdc} USDC` }] : []),
        ...(typeof maxDeliveryHours === 'number' ? [{ tone: 'ok' as LineTone, text: `delivery target=${maxDeliveryHours}h` }] : []),
        { tone: allMock ? 'warn' : 'ok', text: `supply posture=${allMock ? 'demo/mock' : 'mixed/live'}` },
        ...shortlist.map((provider) => ({
          tone: (provider.source === 'mock' ? 'warn' : 'ok') as LineTone,
          text: `candidate=${provider.serviceName} | price=${provider.basePriceUsdc ?? 'n/a'} | rep=${provider.reputationScore ?? 'n/a'} | ${provider.source}`,
        })),
      ]);

      if (shortlist.length === 0) {
        const queued = await integrationsApi.createOpportunity({
          requestText: command,
          normalizedQuery: query || command,
          maxBudgetUsdc: typeof maxBasePriceUsdc === 'number' ? maxBasePriceUsdc : null,
          maxDeliveryHours: typeof maxDeliveryHours === 'number' ? maxDeliveryHours : null,
          matchesAtCreate: result.providers.length,
          source: 'terminal',
        });
        append('warn', 'No matching supply yet. Demand was stored in the opportunity book instead of being dropped.');
        append('ok', `opportunity=${queued.opportunity.id} | providers can pick this up later from the dashboard`);
      } else {
        append('ok', 'next: compare the shortlist, run competition if needed, then choose machine payment or escrow commit');
      }

      emit('role_buyer', command, note);
    } catch {
      const note = 'Buyer flow staged but supply lookup failed';
      appendMany([
        { tone: 'ok', text: 'role=buyer' },
        { tone: 'warn', text: note },
      ]);
      emit('role_buyer', command, note);
    }
  }

  async function runSell(command: string) {
    const query = stripVerb(command, ['sell', 'provider', 'offer']);
    const note = 'Provider onboarding guidance loaded';

    appendMany([
      { tone: 'ok', text: 'role=provider' },
      { tone: 'ok', text: `service=${query || 'unspecified service'}` },
      { tone: 'ok', text: 'to appear in scans: publish to a market adapter or import your provider feed into DealRail discovery' },
      { tone: 'ok', text: 'next: expose endpoint + base price + evaluator path, then respond to active demand' },
    ]);

    emit('role_provider', command, note);
  }

  async function runRails(command: string) {
    try {
      const [health, execution, locus, discovery] = await Promise.all([
        healthCheck().catch(() => null),
        integrationsApi.listExecutionProviders().catch(() => ({ providers: [] })),
        integrationsApi.listLocusTools().catch(() => ({ tools: { mode: 'fallback' as const } })),
        integrationsApi.listProviders().catch(() => ({ providers: [] })),
      ]);

      const locusMode = Array.isArray(locus.tools) ? 'live' : locus.tools?.mode || 'fallback';
      const discoveryMode = discovery.providers.every((provider) => provider.source === 'mock') ? 'demo/mock' : 'mixed/live';
      const note = 'Rail status loaded';

      appendMany([
        { tone: 'ok', text: note },
        { tone: health?.integrations?.x402nMockMode ? 'warn' : 'ok', text: `market competition=${health?.integrations?.x402nMockMode ? 'demo/mock' : 'live'}` },
        { tone: 'ok', text: `machine payments=${health?.integrations?.machinePaymentsPrimary ?? 'x402'}` },
        { tone: discoveryMode === 'demo/mock' ? 'warn' : 'ok', text: `provider market=${discoveryMode}` },
        { tone: locusMode === 'live' ? 'ok' : 'warn', text: `locus payout=${locusMode}` },
        { tone: execution.providers.some((provider) => provider.id === 'wallet') ? 'ok' : 'warn', text: 'delegation builder=ready' },
        { tone: 'ok', text: 'uniswap tx builder=ready' },
      ]);

      emit('open_integrations', command, note);
    } catch {
      const note = 'Rail status failed to load';
      append('warn', note);
      emit('open_integrations', command, note);
    }
  }

  async function runCommand(raw: string) {
    const command = raw.trim();
    if (!command) return;

    setRunning(true);
    append('user', `dealrail$ ${command}`);

    const normalized = command.toLowerCase();

    try {
      if (normalized === 'help' || normalized === '?') {
        await showHelp(command);
        return;
      }

      if (normalized === 'services' || normalized === 'catalog') {
        await showServices(command);
        return;
      }

      if (normalized === 'clear') {
        setLines([
          { tone: 'system', text: 'DEALRAIL READY' },
          { tone: 'system', text: 'start: doctor | vend <need> under <budget> usdc in <hours>h | providers <need> | rails' },
          { tone: 'system', text: 'agent path: npx @kairenxyz/dealrail doctor --json' },
        ]);
        emit('clear', command, 'Terminal output cleared');
        return;
      }

      if (normalized === 'doctor' || normalized === 'preflight' || normalized === 'check') {
        await runDoctor(command);
        return;
      }

      if (normalized === 'status') {
        await runStatus(command);
        return;
      }

      if (/^(scan|market|providers)\b/i.test(command) || normalized.includes('find providers')) {
        await runScan(command);
        return;
      }

      if (/^(buy|buyer|vend|procure)\b/i.test(command) || /^need\b/i.test(command)) {
        await runBuy(command);
        return;
      }

      if (/^(sell|provider|offer)\b/i.test(command)) {
        await runSell(command);
        return;
      }

      if (/^(rails|integrations)\b/i.test(command) || normalized.includes('x402') || normalized.includes('locus')) {
        await runRails(command);
        return;
      }

      if (/^(auction|flow)\b/i.test(command)) {
        prefillFlow(command);
        append('ok', 'Auction path staged. Use `buy ...` first so the desk knows what supply it is comparing.');
        emit('start_flow', command, 'Auction path staged');
        return;
      }

      append('warn', 'Unknown command. Use `help`, `scan`, `providers`, `buy`, `vend`, `sell`, `rails`, or `status`.');
      emit('unknown', command, 'Command not mapped');
    } finally {
      setRunning(false);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const current = input.trim();
    setHistory((prev) => [...prev, current]);
    setHistoryIndex(-1);
    setInput('');
    await runCommand(current);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!history.length) return;
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const nextIndex = historyIndex < 0 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(history[nextIndex] || '');
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = historyIndex < 0 ? -1 : Math.min(history.length - 1, historyIndex + 1);
      setHistoryIndex(nextIndex);
      setInput(nextIndex < 0 ? '' : history[nextIndex] || '');
    }
  }

  return (
    <section className="terminal-frame overflow-hidden rounded-[1.6rem]">
      <div className="flex items-center justify-between border-b border-[var(--terminal-border)] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--terminal-danger)]/85" />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--terminal-warn)]/85" />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--terminal-good)]/85" />
          </div>
          <div>
            <div className="terminal-kicker">Command Desk</div>
            <div className="terminal-mono text-[11px] text-[var(--terminal-muted)]">doctor / vend / providers / rails / status</div>
          </div>
        </div>
        <div className="terminal-mono text-[11px] text-[var(--terminal-muted)]">{statusLabel}</div>
      </div>

      <div className="p-4">
        <div className="terminal-console terminal-screen overflow-hidden rounded-[1.2rem]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--terminal-border)] px-4 py-3">
            <div className="terminal-mono text-[11px] uppercase tracking-[0.24em] text-[var(--terminal-accent)]">
              DealRail / operator terminal
            </div>
            <div className="terminal-mono text-[10px] text-[var(--terminal-muted)]">
              Human: `doctor` -&gt; `vend` | Agent: `doctor --json` -&gt; `vend --json`
            </div>
          </div>

          <div className="p-4">
            <div className={`terminal-mono overflow-auto space-y-2 text-xs leading-6 ${compact ? 'h-64' : 'h-[25rem]'}`}>
              {lines.map((line, idx) => (
                <div
                  key={`${line.text}-${idx}`}
                  className={
                    line.tone === 'system'
                      ? 'break-words whitespace-pre-wrap text-[var(--terminal-muted)]'
                      : line.tone === 'ok'
                        ? 'break-words whitespace-pre-wrap text-[var(--terminal-good)]'
                        : line.tone === 'warn'
                          ? 'break-words whitespace-pre-wrap text-[var(--terminal-warn)]'
                          : 'break-words whitespace-pre-wrap text-[var(--terminal-fg)]'
                  }
                >
                  {line.text}
                </div>
              ))}
            </div>

            <form onSubmit={onSubmit} className="mt-4 flex items-center gap-2">
              <span className="terminal-mono text-xs text-[var(--terminal-accent)]">dealrail$</span>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                className="terminal-input terminal-mono"
                placeholder='Try: vend benchmark report under 0.12 usdc in 24h'
              />
              <button type="submit" className="terminal-btn terminal-btn-accent" disabled={running}>
                Run
              </button>
            </form>

            <div className="mt-4 flex flex-wrap gap-2">
              {EXAMPLES.map((example) => (
                <button key={example} type="button" onClick={() => setInput(example)} className="terminal-command">
                  {example}
                </button>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="rounded-[1rem] border border-[var(--terminal-border)] bg-black/10 px-4 py-3">
                <div className="terminal-label">Human path</div>
                <div className="mt-2 text-sm text-[var(--terminal-muted)]">
                  Run the desk interactively, inspect live posture, then choose whether the request should stay as a
                  machine-paid call or move into escrow.
                </div>
              </div>
              <div className="rounded-[1rem] border border-[var(--terminal-border)] bg-black/10 px-4 py-3">
                <div className="terminal-label">Agent path</div>
                <div className="mt-2 text-sm text-[var(--terminal-muted)]">
                  Use the same verbs from the published CLI in JSON mode when another service needs deterministic
                  posture and receipt output.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
