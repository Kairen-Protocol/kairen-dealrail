'use client';

import { FormEvent, ReactNode, useEffect, useMemo, useState } from 'react';
import {
  DealConfirmation,
  Job,
  NegotiationActivity,
  NegotiationBatch,
  NegotiationOffer,
  NegotiationSession,
  SavingsReceipt,
  getErrorMessage,
  jobsApi,
  x402nApi,
} from '@/lib/api';

const stepLabels = [
  'Policy Set',
  'Auction Running',
  'Batch Prepared',
  'Deal Confirmed',
  'Escrow Funded',
  'Delivery + Evaluation',
];

type NetworkMode = 'demo' | 'testnet' | 'mainnet';

function Step({ label, active }: { label: string; active: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`h-3 w-3 rounded-full ${
          active ? 'bg-emerald-400 shadow-[0_0_0_4px_rgba(16,185,129,0.20)]' : 'bg-gray-600'
        }`}
      />
      <span className={active ? 'text-emerald-300' : 'text-gray-400'}>{label}</span>
    </div>
  );
}

function FieldLabel({ title, hint, children }: { title: string; hint: string; children: ReactNode }) {
  return (
    <label className="text-xs text-[var(--terminal-muted)]">
      <span className="block">{title}</span>
      <span className="mb-1 mt-0.5 block text-[10px]">{hint}</span>
      {children}
    </label>
  );
}

export function DealPipelineDashboard() {
  const [serviceRequirement, setServiceRequirement] = useState(
    'Generate a verified benchmark report for model latency and cost.'
  );
  const [maxBudgetUsdc, setMaxBudgetUsdc] = useState('0.12');
  const [maxDeliveryHours, setMaxDeliveryHours] = useState('24');
  const [minReputationScore, setMinReputationScore] = useState('700');
  const [maxRounds, setMaxRounds] = useState('3');
  const [batchSize, setBatchSize] = useState('2');
  const [autoCounterStepBps, setAutoCounterStepBps] = useState('500');
  const [networkMode, setNetworkMode] = useState<NetworkMode>('testnet');

  const [session, setSession] = useState<NegotiationSession | null>(null);
  const [acceptedOffer, setAcceptedOffer] = useState<NegotiationOffer | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<NegotiationBatch | null>(null);
  const [confirmation, setConfirmation] = useState<DealConfirmation | null>(null);
  const [receipt, setReceipt] = useState<SavingsReceipt | null>(null);
  const [activities, setActivities] = useState<NegotiationActivity[]>([]);

  const [trackedJobId, setTrackedJobId] = useState('');
  const [trackedJob, setTrackedJob] = useState<Job | null>(null);

  const [loading, setLoading] = useState(false);
  const [tracking, setTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const prefServiceRequirement = window.localStorage.getItem('dealrail.prefill.serviceRequirement');
    const prefMaxBudget = window.localStorage.getItem('dealrail.prefill.maxBudgetUsdc');
    const prefMaxHours = window.localStorage.getItem('dealrail.prefill.maxDeliveryHours');

    if (prefServiceRequirement) setServiceRequirement(prefServiceRequirement);
    if (prefMaxBudget) setMaxBudgetUsdc(prefMaxBudget);
    if (prefMaxHours) setMaxDeliveryHours(prefMaxHours);
  }, []);

  useEffect(() => {
    if (!session) return;

    const interval = setInterval(async () => {
      try {
        const feed = await x402nApi.getActivities(session.negotiationId, 30);
        setActivities(feed.activities);
      } catch {
        // non-blocking
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [session]);

  const steps = useMemo(() => {
    const stateCode = trackedJob?.stateCode ?? -1;
    return [
      !!session,
      !!session && (session.roundsCompleted > 0 || session.offers.length > 0),
      !!selectedBatch,
      !!confirmation,
      stateCode >= 1,
      stateCode >= 2,
    ];
  }, [session, selectedBatch, confirmation, trackedJob]);

  async function handleCreateRfo(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await x402nApi.createRfo({
        serviceRequirement,
        maxBudgetUsdc: Number(maxBudgetUsdc),
        maxDeliveryHours: Number(maxDeliveryHours),
        minReputationScore: Number(minReputationScore),
        auctionMode: 'reverse_auction',
        maxRounds: Number(maxRounds),
        batchSize: Number(batchSize),
        autoCounterStepBps: Number(autoCounterStepBps),
        networkMode,
      });
      setSession(result);
      setAcceptedOffer(null);
      setSelectedBatch(null);
      setConfirmation(null);
      setReceipt(null);
      setTrackedJob(null);
      setActivities(result.activities || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleCounterRound() {
    if (!session) return;
    setLoading(true);
    setError(null);
    try {
      const result = await x402nApi.runCounterRound(session.negotiationId);
      setSession(result.negotiation);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleAcceptOffer(offerId: string) {
    if (!session) return;

    setLoading(true);
    setError(null);
    try {
      const result = await x402nApi.acceptOffer(session.negotiationId, offerId);
      setSession(result.negotiation);
      setAcceptedOffer(result.acceptedOffer);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateBatch() {
    if (!session) return;
    setLoading(true);
    setError(null);

    try {
      const selectedOfferIds = acceptedOffer ? [acceptedOffer.offerId] : undefined;
      const result = await x402nApi.createBatch(session.negotiationId, selectedOfferIds);
      setSession(result.negotiation);
      setSelectedBatch(result.batch);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmBatch() {
    if (!session || !selectedBatch) return;
    setLoading(true);
    setError(null);

    try {
      const result = await x402nApi.confirmBatch(
        session.negotiationId,
        selectedBatch.batchId,
        acceptedOffer?.offerId
      );
      setSession(result.negotiation);
      setConfirmation(result.confirmation);
      setReceipt(result.receipt);
      setAcceptedOffer(result.selectedOffer);

      const latestReceipt = await x402nApi.getReceipt(session.negotiationId);
      setReceipt(latestReceipt.receipt);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function trackJob() {
    if (!trackedJobId) return;
    setTracking(true);
    setError(null);
    try {
      const job = await jobsApi.getByJobId(Number(trackedJobId));
      setTrackedJob(job);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setTracking(false);
    }
  }

  return (
    <section className="terminal-panel rounded-lg p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Deal Pipeline (Reverse Auction + Confirmation)</h2>
        <p className="mt-1 text-sm text-[var(--terminal-muted)]">
          Human or agent defines policy. Agents run reverse-auction rounds, batch offers, confirm one deal, then settle
          onchain.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['demo', 'testnet', 'mainnet'] as NetworkMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setNetworkMode(mode)}
            className={`terminal-mono px-3 py-1 rounded text-xs border ${
              networkMode === mode
                ? 'border-[var(--terminal-accent)] bg-[var(--terminal-accent)]/15 text-[var(--terminal-accent)]'
                : 'border-[var(--terminal-border)] bg-black/20 text-[var(--terminal-muted)]'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      <form onSubmit={handleCreateRfo} className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <FieldLabel title="Service requirement" hint="Describe output you want from provider.">
          <input
            value={serviceRequirement}
            onChange={(e) => setServiceRequirement(e.target.value)}
            className="terminal-input md:col-span-4"
            placeholder="Generate benchmark report for model latency and cost."
          />
        </FieldLabel>
        <FieldLabel title="Max budget (USDC)" hint="Hard ceiling for accepted offers.">
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={maxBudgetUsdc}
            onChange={(e) => setMaxBudgetUsdc(e.target.value)}
            className="terminal-input"
            placeholder="0.12"
          />
        </FieldLabel>
        <FieldLabel title="Max delivery (hours)" hint="Reject offers above this time.">
          <input
            type="number"
            min="1"
            value={maxDeliveryHours}
            onChange={(e) => setMaxDeliveryHours(e.target.value)}
            className="terminal-input"
            placeholder="24"
          />
        </FieldLabel>
        <FieldLabel title="Min reputation" hint="Filter weak providers (0-1000).">
          <input
            type="number"
            min="0"
            max="1000"
            value={minReputationScore}
            onChange={(e) => setMinReputationScore(e.target.value)}
            className="terminal-input"
            placeholder="700"
          />
        </FieldLabel>
        <FieldLabel title="Max rounds" hint="How many counter rounds to run.">
          <input
            type="number"
            min="1"
            max="10"
            value={maxRounds}
            onChange={(e) => setMaxRounds(e.target.value)}
            className="terminal-input"
            placeholder="3"
          />
        </FieldLabel>
        <FieldLabel title="Batch size" hint="Number of top offers to package.">
          <input
            type="number"
            min="1"
            max="8"
            value={batchSize}
            onChange={(e) => setBatchSize(e.target.value)}
            className="terminal-input"
            placeholder="2"
          />
        </FieldLabel>
        <FieldLabel title="Counter step (bps)" hint="Auto price reduction per round (100 bps = 1%).">
          <input
            type="number"
            min="50"
            max="2000"
            value={autoCounterStepBps}
            onChange={(e) => setAutoCounterStepBps(e.target.value)}
            className="terminal-input"
            placeholder="500"
          />
        </FieldLabel>
        <button
          type="submit"
          disabled={loading}
          className="terminal-btn terminal-btn-accent mt-5"
        >
          {loading ? 'Negotiating...' : 'Start Reverse Auction'}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {stepLabels.map((label, idx) => (
          <Step key={label} label={label} active={steps[idx]} />
        ))}
      </div>

      {session && (
        <div className="space-y-3">
          <div className="text-sm text-[var(--terminal-muted)]">
            Negotiation ID (technical reference for API calls):{' '}
            <span className="terminal-mono text-[var(--terminal-fg)]">{session.negotiationId}</span> ({session.mode} |{' '}
            {session.policy.networkMode})
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleCounterRound}
              disabled={loading || session.roundsCompleted >= session.maxRounds}
              className="terminal-btn"
            >
              Run Counter Round ({session.roundsCompleted}/{session.maxRounds})
            </button>
            <button
              onClick={handleCreateBatch}
              disabled={loading || session.offers.length === 0}
              className="terminal-btn"
            >
              Create Offer Batch
            </button>
            <button
              onClick={handleConfirmBatch}
              disabled={loading || !selectedBatch}
              className="terminal-btn terminal-btn-good"
            >
              Confirm Deal
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {session.offers.map((offer) => (
              <div key={offer.offerId} className="rounded border border-[var(--terminal-border)] p-3 bg-black/15 space-y-2">
                <div className="text-sm text-[var(--terminal-fg)] font-semibold">{offer.offerId}</div>
                <div className="text-sm text-[var(--terminal-muted)]">
                  Current Price: <span className="text-[var(--terminal-fg)]">{offer.priceUsdc} USDC</span>
                </div>
                <div className="text-sm text-[var(--terminal-muted)]">
                  Initial: <span className="text-gray-200">{offer.initialPriceUsdc} USDC</span>
                </div>
                <div className="text-sm text-[var(--terminal-muted)]">
                  Round: <span className="text-[var(--terminal-fg)]">{offer.round}</span>
                </div>
                <div className="text-sm text-[var(--terminal-muted)]">
                  Delivery: <span className="text-[var(--terminal-fg)]">{offer.deliveryHours}h</span>
                </div>
                <div className="text-sm text-[var(--terminal-muted)]">
                  Reputation: <span className="text-[var(--terminal-fg)]">{offer.reputationScore}</span>
                </div>
                <div className="text-sm text-[var(--terminal-muted)]">
                  Ranking Score: <span className="text-[var(--terminal-good)]">{offer.score}</span>
                </div>
                <button
                  onClick={() => handleAcceptOffer(offer.offerId)}
                  disabled={loading}
                  className="terminal-btn terminal-btn-good w-full"
                >
                  Select Offer
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedBatch && (
        <div className="rounded border border-[var(--terminal-border)] bg-black/20 p-4 space-y-2 text-sm">
          <div className="font-semibold text-[var(--terminal-accent)]">Active Batch</div>
          <div className="text-[var(--terminal-muted)]">Batch ID (technical reference): <span className="terminal-mono text-[var(--terminal-fg)]">{selectedBatch.batchId}</span></div>
          <div className="text-[var(--terminal-muted)]">Offers included: {selectedBatch.offerIds.join(', ')}</div>
          <div className="text-[var(--terminal-muted)]">Status: {selectedBatch.status}</div>
        </div>
      )}

      {confirmation && (
        <div className="rounded border border-[var(--terminal-border)] bg-black/20 p-4 space-y-2 text-sm">
          <div className="font-semibold text-[var(--terminal-good)]">Deal Confirmation</div>
          <div className="text-[var(--terminal-muted)]">Confirmation ID (technical reference): <span className="terminal-mono text-[var(--terminal-fg)]">{confirmation.confirmationId}</span></div>
          <div className="text-[var(--terminal-muted)]">Provider: <span className="terminal-mono text-[var(--terminal-fg)]">{confirmation.provider}</span></div>
          <div className="text-[var(--terminal-muted)]">Evaluator: <span className="terminal-mono text-[var(--terminal-fg)]">{confirmation.evaluator}</span></div>
          <div className="text-[var(--terminal-muted)]">Expected Delivery: {confirmation.expectedDeliveryHours}h</div>
        </div>
      )}

      {receipt && (
        <div className="rounded border border-[var(--terminal-border)] bg-black/20 p-4 space-y-2 text-sm">
          <div className="font-semibold text-[var(--terminal-good)]">Savings Receipt</div>
          <div className="text-[var(--terminal-muted)]">Receipt ID (technical reference): <span className="terminal-mono text-[var(--terminal-fg)]">{receipt.receiptId}</span></div>
          <div className="text-[var(--terminal-muted)]">Baseline: {receipt.baselinePriceUsdc} USDC</div>
          <div className="text-[var(--terminal-muted)]">Settled: {receipt.settledPriceUsdc} USDC</div>
          <div className="text-[var(--terminal-muted)]">Saved: {receipt.savedUsdc} USDC ({receipt.savedPct}%)</div>
          <div className="text-[var(--terminal-muted)]">Mode: {receipt.networkMode}</div>
        </div>
      )}

      <div className="space-y-2">
        <div className="text-sm font-medium">Live Activity Feed</div>
        <div className="max-h-48 overflow-auto space-y-2">
          {activities.map((activity) => (
            <div key={activity.id} className="rounded border border-[var(--terminal-border)] bg-black/15 p-2 text-xs">
              <div>{activity.message}</div>
              <div className="text-[var(--terminal-muted)]">{new Date(activity.timestamp).toLocaleTimeString()}</div>
            </div>
          ))}
          {activities.length === 0 && <div className="text-xs text-[var(--terminal-muted)]">No activity yet.</div>}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <input
          type="number"
          min="1"
          value={trackedJobId}
          onChange={(e) => setTrackedJobId(e.target.value)}
          placeholder="Job ID from createJob event"
          className="terminal-input w-56"
        />
        <button
          onClick={trackJob}
          disabled={tracking}
          className="terminal-btn"
        >
          {tracking ? 'Tracking...' : 'Track'}
        </button>
        {trackedJob && (
          <div className="self-center text-sm text-[var(--terminal-muted)]">
            State: <span className="font-semibold">{trackedJob.state}</span>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded border p-3 text-sm text-[var(--terminal-danger)]" style={{ borderColor: 'color-mix(in srgb, var(--terminal-danger) 50%, transparent)', background: 'color-mix(in srgb, var(--terminal-danger) 10%, transparent)' }}>{error}</div>
      )}
    </section>
  );
}
