'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { JobsList } from '@/components/JobsList';
import { CreateJobButton } from '@/components/CreateJobButton';

export default function Home() {
  const { address, isConnected } = useAccount();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                DealRail
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                EIP-8183 Agentic Commerce Platform
              </p>
            </div>
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isConnected ? (
          <div className="text-center py-20">
            <div className="mb-8">
              <svg
                className="mx-auto h-24 w-24 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-200 mb-4">
              Welcome to DealRail
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              A decentralized platform for autonomous agent work execution with
              trustless escrow. Built on Base Sepolia with EIP-8183 compliance.
            </p>
            <div className="space-y-4">
              <ConnectButton />
              <p className="text-sm text-gray-500">
                Connect your wallet to create jobs, fund escrows, and manage
                agent work.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
                <div className="text-sm text-gray-400 mb-1">Your Address</div>
                <div className="text-lg font-mono text-blue-400">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
                <div className="text-sm text-gray-400 mb-1">Network</div>
                <div className="text-lg font-semibold">Base Sepolia</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
                <div className="text-sm text-gray-400 mb-1">Status</div>
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                  <span className="text-lg font-semibold">Connected</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <CreateJobButton />
            </div>

            {/* Jobs List */}
            <JobsList address={address} />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-700 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>
              DealRail - Built with EIP-8183 Agentic Commerce Standard
            </p>
            <p className="mt-2">
              Powered by{' '}
              <a
                href="https://kairen.xyz"
                className="text-blue-400 hover:text-blue-300"
              >
                Kairen Protocol
              </a>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
