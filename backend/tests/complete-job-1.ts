// Complete the lifecycle for Job #1
import { ethers } from 'ethers';
import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../../.env') });

const BASE_SEPOLIA_RPC = process.env.BASE_SEPOLIA_RPC || 'https://sepolia.base.org';
const ESCROW_ADDRESS = process.env.ESCROW_RAIL_ERC20_BASE_SEPOLIA || '';

const AGENT_KEY = process.env.AGENT_PRIVATE_KEY || '';
const EVALUATOR_KEY = process.env.EVALUATOR_PRIVATE_KEY || '';

const ESCROW_ABI = [
  'function submit(uint256 jobId, bytes32 deliverable)',
  'function complete(uint256 jobId, bytes32 reason)',
  'function getJob(uint256 jobId) view returns (tuple(address client, address provider, address evaluator, uint256 budget, uint256 expiry, uint8 state, bytes32 deliverable, address hook))',
];

async function main() {
  if (!ESCROW_ADDRESS || !AGENT_KEY || !EVALUATOR_KEY) {
    throw new Error(
      'Missing required env values. Expected ESCROW_RAIL_ERC20_BASE_SEPOLIA, AGENT_PRIVATE_KEY, EVALUATOR_PRIVATE_KEY.'
    );
  }

  console.log('🔄 Completing Job #1 Lifecycle\n');

  const provider = new ethers.JsonRpcProvider(BASE_SEPOLIA_RPC);
  const agent = new ethers.Wallet(AGENT_KEY, provider);
  const evaluator = new ethers.Wallet(EVALUATOR_KEY, provider);

  const escrow = new ethers.Contract(ESCROW_ADDRESS, ESCROW_ABI, provider);
  const jobId = 1;

  // Check current state
  console.log('📊 Current State:');
  const jobBefore = await escrow.getJob(jobId);
  const stateNames = ['Open', 'Funded', 'Submitted', 'Completed', 'Rejected', 'Expired'];
  console.log(`  State: ${stateNames[Number(jobBefore.state)]} (${jobBefore.state})`);
  console.log(`  Budget: ${ethers.formatUnits(jobBefore.budget, 6)} USDC`);
  console.log();

  // STEP 1: Submit Deliverable (as agent/provider)
  console.log('📤 STEP 1: Submitting Deliverable (as agent)...');
  console.log('  Agent address:', agent.address);
  const escrowAsAgent = escrow.connect(agent);
  const deliverableHash = ethers.keccak256(ethers.toUtf8Bytes('Test deliverable content - Job #1'));
  
  const tx1 = await escrowAsAgent.submit(jobId, deliverableHash);
  console.log('  TX submitted:', tx1.hash);
  const receipt1 = await tx1.wait();
  console.log('  ✅ Deliverable submitted! Gas used:', receipt1.gasUsed.toString());
  console.log('  Hash:', deliverableHash);
  console.log('  Explorer:', `https://sepolia.basescan.org/tx/${tx1.hash}\n`);

  // Verify state change
  const jobAfterSubmit = await escrow.getJob(jobId);
  console.log('  State after submit:', stateNames[Number(jobAfterSubmit.state)]);
  console.log('  Deliverable stored:', jobAfterSubmit.deliverable);
  console.log();

  // STEP 2: Complete Job (as evaluator)
  console.log('✅ STEP 2: Completing Job (as evaluator)...');
  console.log('  Evaluator address:', evaluator.address);
  const escrowAsEvaluator = escrow.connect(evaluator);
  const reasonHash = ethers.keccak256(ethers.toUtf8Bytes('Quality verified - excellent work'));
  
  const tx2 = await escrowAsEvaluator.complete(jobId, reasonHash);
  console.log('  TX submitted:', tx2.hash);
  const receipt2 = await tx2.wait();
  console.log('  ✅ Job completed! Gas used:', receipt2.gasUsed.toString());
  console.log('  Reason:', reasonHash);
  console.log('  Explorer:', `https://sepolia.basescan.org/tx/${tx2.hash}\n`);

  // STEP 3: Verify Final State
  console.log('🔍 STEP 3: Verifying Final State...');
  const finalJob = await escrow.getJob(jobId);
  console.log('  Job ID:', jobId);
  console.log('  Client:', finalJob.client);
  console.log('  Provider:', finalJob.provider);
  console.log('  Evaluator:', finalJob.evaluator);
  console.log('  Budget:', ethers.formatUnits(finalJob.budget, 6), 'USDC');
  console.log('  State:', stateNames[Number(finalJob.state)], `(${finalJob.state})`);
  console.log('  Deliverable:', finalJob.deliverable);
  console.log();

  console.log('🎉 FULL LIFECYCLE TEST COMPLETE!');
  console.log('View job on BaseScan:');
  console.log(`https://sepolia.basescan.org/address/${ESCROW_ADDRESS}#readContract\n`);
}

main().catch(console.error);
