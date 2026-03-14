// API client for DealRail backend
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface Job {
  id: number;
  jobId: number;
  chainId: number;
  client: string;
  provider: string;
  evaluator: string;
  budget: string;
  expiry: string;
  state: 'OPEN' | 'FUNDED' | 'SUBMITTED' | 'COMPLETED' | 'REJECTED' | 'EXPIRED';
  deliverable: string | null;
  hook: string | null;
  createdAt: string;
  updatedAt: string;
  fundedAt: string | null;
  submittedAt: string | null;
  completedAt: string | null;
  txHash: string | null;
  artifacts?: Artifact[];
  proof?: SettlementProof;
}

export interface Artifact {
  id: number;
  jobId: number;
  seq: number;
  contentHash: string;
  kind: 'TERMS_DRAFT' | 'COUNTER_OFFER' | 'ACCEPTANCE' | 'EVIDENCE' | 'AMENDMENT' | 'OTHER';
  author: string;
  ipfsCid: string | null;
  metadata: any;
  createdAt: string;
}

export interface SettlementProof {
  id: number;
  jobId: number;
  proofJson: any;
  ipfsCid: string | null;
  signature: string | null;
  txHash: string;
  blockNumber: number;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  jobs: T[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

// API functions
export const jobsApi = {
  // List all jobs
  list: async (params?: {
    client?: string;
    provider?: string;
    state?: string;
    limit?: number;
    offset?: number;
  }): Promise<PaginatedResponse<Job>> => {
    const response = await api.get('/jobs', { params });
    return response.data;
  },

  // Get job by database ID
  getById: async (id: number): Promise<Job> => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  // Get job by on-chain job ID
  getByJobId: async (jobId: number): Promise<Job> => {
    const response = await api.get(`/jobs/onchain/${jobId}`);
    return response.data;
  },

  // Get artifacts for a job
  getArtifacts: async (id: number): Promise<{ artifacts: Artifact[] }> => {
    const response = await api.get(`/jobs/${id}/artifacts`);
    return response.data;
  },

  // Get settlement proof
  getProof: async (id: number): Promise<SettlementProof> => {
    const response = await api.get(`/jobs/${id}/proof`);
    return response.data;
  },
};

// Health check
export const healthCheck = async (): Promise<{
  status: string;
  timestamp: string;
  blockchain: { chainId: number; escrowAddress: string };
}> => {
  const response = await axios.get(`${API_URL}/health`);
  return response.data;
};
