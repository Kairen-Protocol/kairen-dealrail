'use client';

import { FormEvent, useMemo, useState } from 'react';
import { Job, getErrorMessage, jobsApi, NegotiationOffer, NegotiationSession, x402nApi } from '@/lib/api';

const stepLabels = [
  'Policy Set',
  'x402n Negotiation',
  'Offer Accepted',
  'Escrow Funded',
  'Delivery Submitted',
  'Evaluator Decision',
];

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

export function DealPipelineDashboard() {
  const [serviceRequirement, setServiceRequirement] = useState('Generate a verified benchmark report for model latency and cost.');
  const [maxBudgetUsdc, setMaxBudgetUsdc] = useState('0.12');
  const [maxDeliveryHours, setMaxDeliveryHours] = useState('24');
  const [minReputationScore, setMinReputationScore] = useState('700');

  const [session, setSession] = useState<NegotiationSession | null>(null);
  const [acceptedOffer, setAcceptedOffer] = useState<NegotiationOffer | null>(null);
  const [trackedJobId, setTrackedJobId] = useState('');
  const [trackedJob, setTrackedJob] = useState<Job | null>(null);

  const [loading, setLoading] = useState(false);
  const [tracking, setTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = useMemo(() => {
    const stateCode = trackedJob?.stateCode ?? -1;
    return [
      !!session,
      !!session,
      !!acceptedOffer,
      stateCode >= 1,
      stateCode >= 2,
      stateCode >= 3 || stateCode === 4 || stateCode === 5,
    ];
  }, [session, acceptedOffer, trackedJob]);

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
      });
      setSession(result);
      setAcceptedOffer(null);
      setTrackedJob(null);
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
    <section className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Deal Pipeline (Human Policy → Agent Execution)</h2>
        <p className="text-sm text-gray-400 mt-1">
          Configure policy bounds, run x402n negotiation, accept an offer, then track onchain escrow state.
        </p>
      </div>

      <form onSubmit={handleCreateRfo} className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          value={serviceRequirement}
          onChange={(e) => setServiceRequirement(e.target.value)}
          className="md:col-span-4 bg-gray-900/60 border border-gray-600 rounded px-3 py-2 text-white"
          placeholder="Service requirement"
        />
        <input
          type="number"
          step="0.01"
          min="0.01"
          value={maxBudgetUsdc}
          onChange={(e) => setMaxBudgetUsdc(e.target.value)}
          className="bg-gray-900/60 border border-gray-600 rounded px-3 py-2 text-white"
          placeholder="Max budget (USDC)"
        />
        <input
          type="number"
          min="1"
          value={maxDeliveryHours}
          onChange={(e) => setMaxDeliveryHours(e.target.value)}
          className="bg-gray-900/60 border border-gray-600 rounded px-3 py-2 text-white"
          placeholder="Max delivery hours"
        />
        <input
          type="number"
          min="0"
          max="1000"
          value={minReputationScore}
          onChange={(e) => setMinReputationScore(e.target.value)}
          className="bg-gray-900/60 border border-gray-600 rounded px-3 py-2 text-white"
          placeholder="Min reputation"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-semibold rounded px-4 py-2"
        >
          {loading ? 'Negotiating...' : 'Run x402n RFO'}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {stepLabels.map((label, idx) => (
          <Step key={label} label={label} active={steps[idx]} />
        ))}
      </div>

      {session && (
        <div className="space-y-3">
          <div className="text-sm text-gray-400">
            Negotiation ID: <span className="font-mono text-gray-200">{session.negotiationId}</span> ({session.mode} mode)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {session.offers.map((offer) => (
              <div key={offer.offerId} className="rounded border border-gray-600 p-3 bg-gray-900/40 space-y-2">
                <div className="text-sm text-gray-300 font-semibold">{offer.offerId}</div>
                <div className="text-sm text-gray-400">Price: <span className="text-gray-200">{offer.priceUsdc} USDC</span></div>
                <div className="text-sm text-gray-400">Delivery: <span className="text-gray-200">{offer.deliveryHours}h</span></div>
                <div className="text-sm text-gray-400">Rep: <span className="text-gray-200">{offer.reputationScore}</span></div>
                <div className="text-sm text-gray-400">Score: <span className="text-emerald-300">{offer.score}</span></div>
                <button
                  onClick={() => handleAcceptOffer(offer.offerId)}
                  disabled={loading}
                  className="w-full text-sm bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 text-white font-medium rounded px-3 py-2"
                >
                  Accept Offer
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {acceptedOffer && (
        <div className="rounded border border-emerald-500/40 bg-emerald-500/10 p-4 space-y-2">
          <div className="text-emerald-300 font-semibold">Accepted Offer</div>
          <div className="text-sm text-gray-300">Provider: <span className="font-mono">{acceptedOffer.provider}</span></div>
          <div className="text-sm text-gray-300">Evaluator: <span className="font-mono">{acceptedOffer.evaluator}</span></div>
          <div className="text-sm text-gray-300">
            Use these addresses in Create Job, then fund and progress the job lifecycle onchain.
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="number"
          min="1"
          value={trackedJobId}
          onChange={(e) => setTrackedJobId(e.target.value)}
          placeholder="Track Job ID"
          className="bg-gray-900/60 border border-gray-600 rounded px-3 py-2 text-white w-44"
        />
        <button
          onClick={trackJob}
          disabled={tracking}
          className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white rounded px-4 py-2"
        >
          {tracking ? 'Tracking...' : 'Track'}
        </button>
        {trackedJob && (
          <div className="text-sm text-gray-300 self-center">
            State: <span className="font-semibold">{trackedJob.state}</span>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </div>
      )}
    </section>
  );
}
