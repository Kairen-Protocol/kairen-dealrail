// Configuration loader
import dotenv from 'dotenv';
import { Config } from './types';

dotenv.config();

function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const config: Config = {
  database: {
    url: getEnv('DATABASE_URL'),
  },
  blockchain: {
    rpcUrl: getEnv('RPC_URL', 'https://sepolia.base.org'),
    chainId: parseInt(getEnv('CHAIN_ID', '84532')),
    escrowAddress: getEnv('ESCROW_ADDRESS'),
    privateKey: getEnv('PRIVATE_KEY'),
  },
  bankr: {
    apiKey: getEnv('BANKR_API_KEY', ''),
    apiUrl: getEnv('BANKR_API_URL', 'https://api.bankr.bot'),
  },
  ipfs: {
    pinataJwt: getEnv('PINATA_JWT', ''),
    gateway: getEnv('PINATA_GATEWAY', 'https://gateway.pinata.cloud'),
  },
  server: {
    port: parseInt(getEnv('PORT', '3000')),
    nodeEnv: getEnv('NODE_ENV', 'development'),
  },
  identity: {
    verifierAddress: getEnv('IDENTITY_VERIFIER_ADDRESS', ''),
    courtAccessAddress: getEnv('COURT_ACCESS_ADDRESS', '0x251026B235Ab65fBC28674984e43F6AC9cF4d79A'),
  },
};

export default config;
