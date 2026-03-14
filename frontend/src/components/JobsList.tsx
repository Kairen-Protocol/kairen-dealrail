'use client';

import { useEffect, useState } from 'react';
import { jobsApi, Job } from '@/lib/api';
import { JobCard } from './JobCard';

interface JobsListProps {
  address?: string;
}

export function JobsList({ address }: JobsListProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'client' | 'provider'>('all');

  useEffect(() => {
    loadJobs();
  }, [address, filter]);

  async function loadJobs() {
    try {
      setLoading(true);
      const params: any = { limit: 50, offset: 0 };

      if (address) {
        if (filter === 'client') {
          params.client = address.toLowerCase();
        } else if (filter === 'provider') {
          params.provider = address.toLowerCase();
        }
      }

      const response = await jobsApi.list(params);
      setJobs(response.jobs);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-700 pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-t-lg transition-colors ${
            filter === 'all'
              ? 'bg-gray-700 text-white'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          All Jobs
        </button>
        <button
          onClick={() => setFilter('client')}
          className={`px-4 py-2 rounded-t-lg transition-colors ${
            filter === 'client'
              ? 'bg-gray-700 text-white'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          My Jobs (Client)
        </button>
        <button
          onClick={() => setFilter('provider')}
          className={`px-4 py-2 rounded-t-lg transition-colors ${
            filter === 'provider'
              ? 'bg-gray-700 text-white'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          My Work (Provider)
        </button>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto" />
          <p className="text-gray-400 mt-4">Loading jobs...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/30 rounded-lg border border-gray-700">
          <svg
            className="mx-auto h-12 w-12 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="mt-4 text-lg font-semibold text-gray-300">
            No jobs found
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {filter === 'all'
              ? 'No jobs have been created yet.'
              : `You don't have any jobs as ${filter}.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} currentAddress={address} />
          ))}
        </div>
      )}
    </div>
  );
}
