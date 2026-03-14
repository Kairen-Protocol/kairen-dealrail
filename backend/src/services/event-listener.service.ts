// Blockchain event listener for EscrowRail contract
import { ethers } from 'ethers';
import { PrismaClient } from '@prisma/client';
import { config } from '../config';

const prisma = new PrismaClient();

// EIP-8183 state mapping (for future use)
// const STATE_MAP: Record<number, JobState> = {
//   0: 'OPEN',
//   1: 'FUNDED',
//   2: 'SUBMITTED',
//   3: 'COMPLETED',
//   4: 'REJECTED',
//   5: 'EXPIRED',
// };

// Minimal ABI for events
const ESCROW_ABI = [
  'event JobCreated(uint256 indexed jobId, address indexed client, address indexed provider, address evaluator, uint256 expiry, address hook)',
  'event JobFunded(uint256 indexed jobId, uint256 amount)',
  'event JobSubmitted(uint256 indexed jobId, bytes32 deliverable)',
  'event JobCompleted(uint256 indexed jobId, bytes32 reason)',
  'event JobRejected(uint256 indexed jobId, bytes32 reason)',
  'event JobExpired(uint256 indexed jobId)',
  'function getJob(uint256 jobId) view returns (tuple(address client, address provider, address evaluator, uint256 budget, uint256 expiry, uint8 state, bytes32 deliverable, address hook))',
];

export class EventListenerService {
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;
  private isRunning: boolean = false;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(config.blockchain.rpcUrl);
    this.contract = new ethers.Contract(
      config.blockchain.escrowAddress,
      ESCROW_ABI,
      this.provider
    );
  }

  /**
   * Start listening to events from the contract
   * @param fromBlock Block number to start from (default: latest)
   */
  async start(fromBlock: number | 'latest' = 'latest'): Promise<void> {
    if (this.isRunning) {
      console.log('⚠️  Event listener already running');
      return;
    }

    this.isRunning = true;
    console.log(`🎧 Starting event listener from block: ${fromBlock}`);

    // Sync historical events if starting from a specific block
    if (typeof fromBlock === 'number') {
      await this.syncHistoricalEvents(fromBlock);
    }

    // Listen to real-time events
    this.setupEventListeners();

    console.log('✅ Event listener started');
  }

  /**
   * Stop listening to events
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    this.contract.removeAllListeners();
    console.log('🛑 Event listener stopped');
  }

  /**
   * Sync historical events from a specific block
   * @param fromBlock Starting block number
   */
  private async syncHistoricalEvents(fromBlock: number): Promise<void> {
    console.log(`📜 Syncing historical events from block ${fromBlock}...`);

    const currentBlock = await this.provider.getBlockNumber();
    const events = await this.contract.queryFilter('*', fromBlock, currentBlock);

    console.log(`📦 Found ${events.length} historical events`);

    for (const event of events) {
      await this.handleEvent(event);
    }

    console.log('✅ Historical sync complete');
  }

  /**
   * Setup listeners for all contract events
   */
  private setupEventListeners(): void {
    this.contract.on('JobCreated', async (jobId, client, provider, evaluator, expiry, hook, event) => {
      await this.handleJobCreated(jobId, client, provider, evaluator, expiry, hook, event);
    });

    this.contract.on('JobFunded', async (jobId, amount, event) => {
      await this.handleJobFunded(jobId, amount, event);
    });

    this.contract.on('JobSubmitted', async (jobId, deliverable, event) => {
      await this.handleJobSubmitted(jobId, deliverable, event);
    });

    this.contract.on('JobCompleted', async (jobId, reason, event) => {
      await this.handleJobCompleted(jobId, reason, event);
    });

    this.contract.on('JobRejected', async (jobId, reason, event) => {
      await this.handleJobRejected(jobId, reason, event);
    });

    this.contract.on('JobExpired', async (jobId, event) => {
      await this.handleJobExpired(jobId, event);
    });
  }

  /**
   * Generic event handler that routes to specific handlers
   */
  private async handleEvent(event: ethers.Log | ethers.EventLog): Promise<void> {
    // Type guard to ensure we have an EventLog
    if (!('eventName' in event)) {
      console.log('⚠️  Skipping non-EventLog');
      return;
    }

    const eventName = event.eventName;

    try {
      switch (eventName) {
        case 'JobCreated':
          await this.handleJobCreated(
            event.args![0],
            event.args![1],
            event.args![2],
            event.args![3],
            event.args![4],
            event.args![5],
            event
          );
          break;
        case 'JobFunded':
          await this.handleJobFunded(event.args![0], event.args![1], event);
          break;
        case 'JobSubmitted':
          await this.handleJobSubmitted(event.args![0], event.args![1], event);
          break;
        case 'JobCompleted':
          await this.handleJobCompleted(event.args![0], event.args![1], event);
          break;
        case 'JobRejected':
          await this.handleJobRejected(event.args![0], event.args![1], event);
          break;
        case 'JobExpired':
          await this.handleJobExpired(event.args![0], event);
          break;
        default:
          console.log(`❓ Unknown event: ${eventName}`);
      }
    } catch (error) {
      console.error(`❌ Error handling event ${eventName}:`, error);
    }
  }

  /**
   * Handle JobCreated event
   */
  private async handleJobCreated(
    jobId: bigint,
    client: string,
    provider: string,
    evaluator: string,
    expiry: bigint,
    hook: string,
    event: ethers.EventLog
  ): Promise<void> {
    const jobIdNum = Number(jobId);
    console.log(`📝 JobCreated: #${jobIdNum} by ${client}`);

    // Check if event already processed (reorg handling)
    const existing = await prisma.processedEvent.findUnique({
      where: {
        txHash_logIndex: {
          txHash: event.transactionHash,
          logIndex: event.index,
        },
      },
    });

    if (existing) {
      console.log(`⏭️  Event already processed: ${event.transactionHash}:${event.index}`);
      return;
    }

    // Create job record
    await prisma.job.create({
      data: {
        jobId: jobIdNum,
        chainId: config.blockchain.chainId,
        client: client.toLowerCase(),
        provider: provider.toLowerCase(),
        evaluator: evaluator.toLowerCase(),
        budget: '0',
        expiry: new Date(Number(expiry) * 1000),
        state: 'OPEN',
        hook: hook === ethers.ZeroAddress ? null : hook.toLowerCase(),
        txHash: event.transactionHash,
      },
    });

    // Mark event as processed
    await prisma.processedEvent.create({
      data: {
        txHash: event.transactionHash,
        logIndex: event.index,
        blockNumber: event.blockNumber,
        eventName: 'JobCreated',
      },
    });

    console.log(`✅ Job #${jobIdNum} created in database`);
  }

  /**
   * Handle JobFunded event
   */
  private async handleJobFunded(jobId: bigint, amount: bigint, event: ethers.EventLog): Promise<void> {
    const jobIdNum = Number(jobId);
    console.log(`💰 JobFunded: #${jobIdNum} with ${ethers.formatEther(amount)} ETH`);

    // Check if already processed
    const existing = await prisma.processedEvent.findUnique({
      where: {
        txHash_logIndex: {
          txHash: event.transactionHash,
          logIndex: event.index,
        },
      },
    });

    if (existing) {
      return;
    }

    // Update job
    await prisma.job.update({
      where: { jobId: jobIdNum },
      data: {
        budget: amount.toString(),
        state: 'FUNDED',
        fundedAt: new Date(),
      },
    });

    // Mark event as processed
    await prisma.processedEvent.create({
      data: {
        txHash: event.transactionHash,
        logIndex: event.index,
        blockNumber: event.blockNumber,
        eventName: 'JobFunded',
      },
    });

    console.log(`✅ Job #${jobIdNum} funded`);
  }

  /**
   * Handle JobSubmitted event
   */
  private async handleJobSubmitted(jobId: bigint, deliverable: string, event: ethers.EventLog): Promise<void> {
    const jobIdNum = Number(jobId);
    console.log(`📤 JobSubmitted: #${jobIdNum}`);

    const existing = await prisma.processedEvent.findUnique({
      where: {
        txHash_logIndex: {
          txHash: event.transactionHash,
          logIndex: event.index,
        },
      },
    });

    if (existing) {
      return;
    }

    await prisma.job.update({
      where: { jobId: jobIdNum },
      data: {
        deliverable,
        state: 'SUBMITTED',
        submittedAt: new Date(),
      },
    });

    await prisma.processedEvent.create({
      data: {
        txHash: event.transactionHash,
        logIndex: event.index,
        blockNumber: event.blockNumber,
        eventName: 'JobSubmitted',
      },
    });

    console.log(`✅ Job #${jobIdNum} submitted`);
  }

  /**
   * Handle JobCompleted event
   */
  private async handleJobCompleted(jobId: bigint, _reason: string, event: ethers.EventLog): Promise<void> {
    const jobIdNum = Number(jobId);
    console.log(`✅ JobCompleted: #${jobIdNum}`);

    const existing = await prisma.processedEvent.findUnique({
      where: {
        txHash_logIndex: {
          txHash: event.transactionHash,
          logIndex: event.index,
        },
      },
    });

    if (existing) {
      return;
    }

    await prisma.job.update({
      where: { jobId: jobIdNum },
      data: {
        state: 'COMPLETED',
        completedAt: new Date(),
      },
    });

    await prisma.processedEvent.create({
      data: {
        txHash: event.transactionHash,
        logIndex: event.index,
        blockNumber: event.blockNumber,
        eventName: 'JobCompleted',
      },
    });

    console.log(`✅ Job #${jobIdNum} completed`);
  }

  /**
   * Handle JobRejected event
   */
  private async handleJobRejected(jobId: bigint, _reason: string, event: ethers.EventLog): Promise<void> {
    const jobIdNum = Number(jobId);
    console.log(`❌ JobRejected: #${jobIdNum}`);

    const existing = await prisma.processedEvent.findUnique({
      where: {
        txHash_logIndex: {
          txHash: event.transactionHash,
          logIndex: event.index,
        },
      },
    });

    if (existing) {
      return;
    }

    await prisma.job.update({
      where: { jobId: jobIdNum },
      data: {
        state: 'REJECTED',
        completedAt: new Date(),
      },
    });

    await prisma.processedEvent.create({
      data: {
        txHash: event.transactionHash,
        logIndex: event.index,
        blockNumber: event.blockNumber,
        eventName: 'JobRejected',
      },
    });

    console.log(`❌ Job #${jobIdNum} rejected`);
  }

  /**
   * Handle JobExpired event
   */
  private async handleJobExpired(jobId: bigint, event: ethers.EventLog): Promise<void> {
    const jobIdNum = Number(jobId);
    console.log(`⏰ JobExpired: #${jobIdNum}`);

    const existing = await prisma.processedEvent.findUnique({
      where: {
        txHash_logIndex: {
          txHash: event.transactionHash,
          logIndex: event.index,
        },
      },
    });

    if (existing) {
      return;
    }

    await prisma.job.update({
      where: { jobId: jobIdNum },
      data: {
        state: 'EXPIRED',
        completedAt: new Date(),
      },
    });

    await prisma.processedEvent.create({
      data: {
        txHash: event.transactionHash,
        logIndex: event.index,
        blockNumber: event.blockNumber,
        eventName: 'JobExpired',
      },
    });

    console.log(`⏰ Job #${jobIdNum} expired`);
  }
}

export const eventListenerService = new EventListenerService();
