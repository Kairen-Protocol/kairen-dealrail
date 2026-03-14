// Type definitions for DealRail backend

import { JobState, ArtifactKind } from '@prisma/client';

// ============ EIP-8183 Types ============

export enum State {
  Open = 0,
  Funded = 1,
  Submitted = 2,
  Completed = 3,
  Rejected = 4,
  Expired = 5,
}

export interface Job {
  client: string;
  provider: string;
  evaluator: string;
  budget: bigint;
  expiry: bigint;
  state: State;
  deliverable: string; // bytes32
  hook: string;
}

// ============ API Types ============

export interface CreateJobRequest {
  provider: string;
  evaluator: string;
  expiryTimestamp: number;
  hook?: string;
}

export interface CreateJobResponse {
  jobId: number;
  txHash: string;
  client: string;
  provider: string;
  evaluator: string;
  expiry: string;
}

export interface FundJobRequest {
  jobId: number;
  amount: string; // Wei as string
}

export interface SubmitWorkRequest {
  jobId: number;
  deliverableHash: string; // bytes32
  ipfsCid?: string;
  file?: Buffer;
}

export interface GetJobResponse {
  id: number;
  jobId: number;
  chainId: number;
  client: string;
  provider: string;
  evaluator: string;
  budget: string;
  expiry: string;
  state: JobState;
  deliverable: string | null;
  hook: string | null;
  createdAt: string;
  updatedAt: string;
  artifacts: ArtifactResponse[];
  proof: SettlementProofResponse | null;
}

export interface ArtifactResponse {
  id: number;
  seq: number;
  contentHash: string;
  kind: ArtifactKind;
  author: string;
  ipfsCid: string | null;
  createdAt: string;
}

export interface SettlementProofResponse {
  jobId: number;
  proofJson: any;
  ipfsCid: string | null;
  signature: string | null;
  txHash: string;
  blockNumber: number;
  createdAt: string;
}

// ============ BankrBot Types ============

export interface BankrPromptRequest {
  prompt: string;
  threadId?: string;
}

export interface BankrPromptResponse {
  jobId: string;
  threadId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  response?: string;
}

export interface BankrSubmitRequest {
  transaction: {
    to: string;
    chainId: number;
    data?: string;
    value?: string;
  };
  waitForConfirmation?: boolean;
}

export interface BankrSubmitResponse {
  txHash: string;
  status: 'pending' | 'confirmed' | 'failed';
}

// ============ Identity Types ============

export interface VerificationResult {
  isVerified: boolean;
  reputationScore: number;
  tier: string;
  isSuspended: boolean;
}

export interface IdentityVerificationRequest {
  address: string;
}

export interface IdentityVerificationResponse extends VerificationResult {
  verifierName: string;
  lastChecked: string;
}

// ============ Event Types ============

export interface ContractEvent {
  eventName: string;
  blockNumber: number;
  transactionHash: string;
  logIndex: number;
  args: any;
}

export interface JobCreatedEvent {
  jobId: bigint;
  client: string;
  provider: string;
  evaluator: string;
  expiry: bigint;
  hook: string;
}

export interface JobFundedEvent {
  jobId: bigint;
  amount: bigint;
}

export interface JobSubmittedEvent {
  jobId: bigint;
  deliverable: string;
}

export interface JobCompletedEvent {
  jobId: bigint;
  reason: string;
}

export interface JobRejectedEvent {
  jobId: bigint;
  reason: string;
}

export interface JobExpiredEvent {
  jobId: bigint;
}

// ============ WebSocket Types ============

export interface WSMessage {
  type: 'job_created' | 'job_funded' | 'job_submitted' | 'job_completed' | 'job_rejected' | 'job_expired' | 'proof_ready';
  jobId: number;
  data: any;
}

// ============ Config Types ============

export interface Config {
  database: {
    url: string;
  };
  blockchain: {
    rpcUrl: string;
    chainId: number;
    escrowAddress: string;
    privateKey: string;
  };
  bankr: {
    apiKey: string;
    apiUrl: string;
  };
  ipfs: {
    pinataJwt: string;
    gateway: string;
  };
  server: {
    port: number;
    nodeEnv: string;
  };
  identity: {
    verifierAddress: string;
    courtAccessAddress: string;
  };
}
