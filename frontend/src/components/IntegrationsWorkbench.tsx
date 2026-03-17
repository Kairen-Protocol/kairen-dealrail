'use client';

import { useState } from 'react';
import { integrationsApi, getErrorMessage } from '@/lib/api';
import { useAccount } from 'wagmi';

export function IntegrationsWorkbench() {
  const { address } = useAccount();

  const [uniswapOut, setUniswapOut] = useState<string>('');
  const [locusOut, setLocusOut] = useState<string>('');
  const [delegationOut, setDelegationOut] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [swapAmountIn, setSwapAmountIn] = useState('10');
  const [swapMinOut, setSwapMinOut] = useState('0.001');
  const [locusAgentId, setLocusAgentId] = useState('buyer-agent');
  const [locusTo, setLocusTo] = useState('0xef9C7E3Fea4f54CB3C6c8fa0978a0C8aB8f28fcF');
  const [locusAmount, setLocusAmount] = useState('1');
  const [delegate, setDelegate] = useState('0xef9C7E3Fea4f54CB3C6c8fa0978a0C8aB8f28fcF');
  const [maxUsdc, setMaxUsdc] = useState('25');

  async function buildUniswapTxs() {
    setLoading(true);
    setError(null);
    try {
      const approve = await integrationsApi.buildUniswapApproveTx({
        token: 'USDC',
        amount: swapAmountIn,
      });
      const swap = await integrationsApi.buildUniswapSwapTx({
        tokenIn: 'USDC',
        tokenOut: 'WETH',
        amountIn: swapAmountIn,
        amountOutMinimum: swapMinOut,
        fee: 3000,
        recipient: address || '0x77712e28F7A4a2EeD0bd7f9F8B8486332a38892e',
      });
      setUniswapOut(JSON.stringify({ approve, swap }, null, 2));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function sendLocus() {
    setLoading(true);
    setError(null);
    try {
      const result = await integrationsApi.sendLocusUsdc({
        fromAgentId: locusAgentId,
        toAddress: locusTo,
        amountUsdc: locusAmount,
        chain: 'base-sepolia',
        memo: 'DealRail hackathon payment',
      });
      setLocusOut(JSON.stringify(result, null, 2));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function buildDelegation() {
    setLoading(true);
    setError(null);
    try {
      const result = await integrationsApi.buildDelegation({
        delegator: address || '0x77712e28F7A4a2EeD0bd7f9F8B8486332a38892e',
        delegate,
        escrowTarget: '0x53d368b5467524F7d674B70F00138a283e1533ce',
        maxUsdc,
        expiryUnix: Math.floor(Date.now() / 1000) + 24 * 3600,
        allowedMethods: ['fund(uint256,uint256)', 'createJob(address,address,uint256,address)'],
      });
      setDelegationOut(JSON.stringify(result, null, 2));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 space-y-6">
      <h2 className="text-xl font-semibold text-white">Integration Workbench (Uniswap, Locus, MetaMask)</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900/40 border border-gray-700 rounded p-4 space-y-3">
          <div className="font-semibold text-white">1. Uniswap Tx Builder</div>
          <input value={swapAmountIn} onChange={(e) => setSwapAmountIn(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white" placeholder="Amount in USDC" />
          <input value={swapMinOut} onChange={(e) => setSwapMinOut(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white" placeholder="Min out WETH" />
          <button onClick={buildUniswapTxs} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white rounded px-3 py-2">Build Approve + Swap</button>
        </div>

        <div className="bg-gray-900/40 border border-gray-700 rounded p-4 space-y-3">
          <div className="font-semibold text-white">2. Locus Bridge</div>
          <input value={locusAgentId} onChange={(e) => setLocusAgentId(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white" placeholder="From agent ID" />
          <input value={locusTo} onChange={(e) => setLocusTo(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white" placeholder="Recipient address" />
          <input value={locusAmount} onChange={(e) => setLocusAmount(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white" placeholder="USDC amount" />
          <button onClick={sendLocus} disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 text-white rounded px-3 py-2">Send via Locus</button>
        </div>

        <div className="bg-gray-900/40 border border-gray-700 rounded p-4 space-y-3">
          <div className="font-semibold text-white">3. ERC-7710 Delegation</div>
          <input value={delegate} onChange={(e) => setDelegate(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white" placeholder="Delegate address" />
          <input value={maxUsdc} onChange={(e) => setMaxUsdc(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white" placeholder="Max USDC" />
          <button onClick={buildDelegation} disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white rounded px-3 py-2">Build Delegation</button>
        </div>
      </div>

      {error && <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded p-3">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <pre className="bg-black/40 border border-gray-800 rounded p-3 overflow-auto max-h-64 text-gray-300">{uniswapOut || 'Uniswap tx payload appears here'}</pre>
        <pre className="bg-black/40 border border-gray-800 rounded p-3 overflow-auto max-h-64 text-gray-300">{locusOut || 'Locus response appears here'}</pre>
        <pre className="bg-black/40 border border-gray-800 rounded p-3 overflow-auto max-h-64 text-gray-300">{delegationOut || 'Delegation payload appears here'}</pre>
      </div>
    </section>
  );
}
