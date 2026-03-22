import { ethers } from 'ethers';
import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../../.env') });

const BASE_SEPOLIA_RPC = process.env.BASE_SEPOLIA_RPC || 'https://sepolia.base.org';
const ESCROW_ADDRESS = process.env.ESCROW_RAIL_ERC20_BASE_SEPOLIA || '';
const EVALUATOR_KEY = process.env.EVALUATOR_PRIVATE_KEY || '';

const ESCROW_ABI = ['function complete(uint256 jobId, bytes32 reason)'];

async function main() {
  if (!ESCROW_ADDRESS || !EVALUATOR_KEY) {
    throw new Error(
      'Missing required env values. Expected ESCROW_RAIL_ERC20_BASE_SEPOLIA and EVALUATOR_PRIVATE_KEY.'
    );
  }

  const provider = new ethers.JsonRpcProvider(BASE_SEPOLIA_RPC);
  const evaluator = new ethers.Wallet(EVALUATOR_KEY, provider);
  const escrow = new ethers.Contract(ESCROW_ADDRESS, ESCROW_ABI, evaluator);

  console.log('✅ Completing Job #4...');
  const reasonHash = ethers.keccak256(ethers.toUtf8Bytes('Approved'));
  const tx = await escrow.complete(4, reasonHash);
  console.log('  TX:', tx.hash);
  await tx.wait();
  console.log('  ✅ Done!');
}

main().catch(console.error);
