import { ethers } from 'ethers';

export interface BuildDelegationInput {
  delegator: string;
  delegate: string;
  escrowTarget: string;
  maxUsdc: string;
  expiryUnix: number;
  allowedMethods: string[];
}

export interface DelegationPayload {
  standard: 'ERC-7710';
  caveats: Array<{
    enforcer: string;
    terms: string;
    description: string;
  }>;
  meta: {
    delegator: string;
    delegate: string;
    target: string;
    maxUsdc: string;
    expiryUnix: number;
  };
}

const ENFORCERS = {
  allowedTargets: '0x0000000000000000000000000000000000001001',
  allowedMethods: '0x0000000000000000000000000000000000001002',
  erc20TransferAmount: '0x0000000000000000000000000000000000001003',
  timestamp: '0x0000000000000000000000000000000000001004',
};

class DelegationService {
  buildDelegation(input: BuildDelegationInput): DelegationPayload {
    const coder = ethers.AbiCoder.defaultAbiCoder();
    const maxAmountRaw = ethers.parseUnits(input.maxUsdc, 6);

    const methodSelectors = input.allowedMethods.map((sig) =>
      ethers.dataSlice(ethers.id(sig), 0, 4)
    );

    return {
      standard: 'ERC-7710',
      caveats: [
        {
          enforcer: ENFORCERS.allowedTargets,
          terms: coder.encode(['address[]'], [[input.escrowTarget]]),
          description: 'Allow only calls to EscrowRail target',
        },
        {
          enforcer: ENFORCERS.allowedMethods,
          terms: coder.encode(['bytes4[]'], [methodSelectors]),
          description: 'Allow only whitelisted function selectors',
        },
        {
          enforcer: ENFORCERS.erc20TransferAmount,
          terms: coder.encode(['address', 'uint256'], [input.escrowTarget, maxAmountRaw]),
          description: 'Cap ERC-20 transfer amount (USDC)',
        },
        {
          enforcer: ENFORCERS.timestamp,
          terms: coder.encode(['uint256'], [BigInt(input.expiryUnix)]),
          description: 'Delegation expiry timestamp',
        },
      ],
      meta: {
        delegator: input.delegator,
        delegate: input.delegate,
        target: input.escrowTarget,
        maxUsdc: input.maxUsdc,
        expiryUnix: input.expiryUnix,
      },
    };
  }
}

export const delegationService = new DelegationService();
