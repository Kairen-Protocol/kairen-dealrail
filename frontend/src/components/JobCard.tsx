'use client';

import { Job } from '@/lib/api';
import { formatEther } from 'viem';
import { formatDistanceToNow } from 'date-fns';

interface JobCardProps {
  job: Job;
  currentAddress?: string;
}

const stateColors: Record<string, string> = {
  OPEN: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  FUNDED: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  SUBMITTED: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  COMPLETED: 'bg-green-500/20 text-green-400 border-green-500/30',
  REJECTED: 'bg-red-500/20 text-red-400 border-red-500/30',
  EXPIRED: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export function JobCard({ job, currentAddress }: JobCardProps) {
  const isClient = job.client.toLowerCase() === currentAddress?.toLowerCase();
  const isProvider =
    job.provider.toLowerCase() === currentAddress?.toLowerCase();
  const isEvaluator =
    job.evaluator.toLowerCase() === currentAddress?.toLowerCase();

  const budgetEth = job.budget !== '0' ? formatEther(BigInt(job.budget)) : '0';
  const expiryDate = new Date(job.expiry);
  const timeUntilExpiry = formatDistanceToNow(expiryDate, { addSuffix: true });

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 hover:border-gray-600 transition-all p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-gray-400">Job #{job.jobId}</div>
          <div className="mt-1 flex items-center gap-2">
            <span
              className={`px-2 py-1 text-xs font-semibold rounded border ${
                stateColors[job.state]
              }`}
            >
              {job.state}
            </span>
            {isClient && (
              <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded border border-blue-500/30">
                You're Client
              </span>
            )}
            {isProvider && (
              <span className="px-2 py-1 text-xs bg-cyan-500/20 text-cyan-400 rounded border border-cyan-500/30">
                You're Provider
              </span>
            )}
            {isEvaluator && (
              <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded border border-purple-500/30">
                You're Evaluator
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Budget */}
      <div className="border-t border-gray-700 pt-4">
        <div className="text-sm text-gray-400">Budget</div>
        <div className="text-2xl font-bold text-white mt-1">
          {budgetEth} ETH
        </div>
      </div>

      {/* Parties */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Client</span>
          <span className="font-mono text-gray-200">
            {job.client.slice(0, 6)}...{job.client.slice(-4)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Provider</span>
          <span className="font-mono text-gray-200">
            {job.provider.slice(0, 6)}...{job.provider.slice(-4)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Evaluator</span>
          <span className="font-mono text-gray-200">
            {job.evaluator.slice(0, 6)}...{job.evaluator.slice(-4)}
          </span>
        </div>
      </div>

      {/* Expiry */}
      <div className="border-t border-gray-700 pt-4">
        <div className="text-sm text-gray-400">Expiry</div>
        <div className="text-sm text-gray-200 mt-1">{timeUntilExpiry}</div>
      </div>

      {/* Actions */}
      <div className="border-t border-gray-700 pt-4">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
}
