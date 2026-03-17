import { ethers } from 'ethers';
import { config } from '../config';

type TokenSymbol = 'USDC' | 'WETH';

const TOKENS: Record<TokenSymbol, { address: string; decimals: number }> = {
  USDC: {
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    decimals: 6,
  },
  WETH: {
    address: '0x4200000000000000000000000000000000000006',
    decimals: 18,
  },
};

const QUOTER_V2_ABI = [
  'function quoteExactInputSingle((address tokenIn,address tokenOut,uint256 amountIn,uint24 fee,uint160 sqrtPriceLimitX96) params) returns (uint256 amountOut, uint160 sqrtPriceX96After, uint32 initializedTicksCrossed, uint256 gasEstimate)',
];

const ERC20_ABI = [
  'function approve(address spender,uint256 amount) returns (bool)',
];

const SWAP_ROUTER_ABI = [
  'function exactInputSingle((address tokenIn,address tokenOut,uint24 fee,address recipient,uint256 amountIn,uint256 amountOutMinimum,uint160 sqrtPriceLimitX96) params) payable returns (uint256 amountOut)',
];

export interface QuoteInput {
  tokenIn: TokenSymbol;
  tokenOut: TokenSymbol;
  amountIn: string;
  fee: number;
}

export interface QuoteOutput {
  tokenIn: TokenSymbol;
  tokenOut: TokenSymbol;
  amountIn: string;
  amountInRaw: string;
  amountOut: string;
  amountOutRaw: string;
  fee: number;
  quoter: string;
  router: string;
}

export interface BuildApproveTxInput {
  token: TokenSymbol;
  amount: string;
}

export interface BuildSwapTxInput {
  tokenIn: TokenSymbol;
  tokenOut: TokenSymbol;
  amountIn?: string;
  amountInRaw?: string;
  amountOutMinimum?: string;
  amountOutMinimumRaw?: string;
  fee: number;
  recipient: string;
  deadlineSeconds?: number;
}

class UniswapService {
  private provider = new ethers.JsonRpcProvider(config.integrations.uniswap.baseMainnetRpc);
  private quoter = new ethers.Contract(
    config.integrations.uniswap.quoterV2,
    QUOTER_V2_ABI,
    this.provider
  ) as any;
  private erc20Interface = new ethers.Interface(ERC20_ABI);
  private swapRouterInterface = new ethers.Interface(SWAP_ROUTER_ABI);

  async quoteExactInputSingle(input: QuoteInput): Promise<QuoteOutput> {
    const inToken = TOKENS[input.tokenIn];
    const outToken = TOKENS[input.tokenOut];

    const amountInRaw = ethers.parseUnits(input.amountIn, inToken.decimals);

    const [amountOutRaw] = await this.quoter.quoteExactInputSingle.staticCall({
      tokenIn: inToken.address,
      tokenOut: outToken.address,
      amountIn: amountInRaw,
      fee: input.fee,
      sqrtPriceLimitX96: 0,
    });

    const amountOutFormatted = ethers.formatUnits(amountOutRaw, outToken.decimals);

    return {
      tokenIn: input.tokenIn,
      tokenOut: input.tokenOut,
      amountIn: input.amountIn,
      amountInRaw: amountInRaw.toString(),
      amountOut: amountOutFormatted,
      amountOutRaw: amountOutRaw.toString(),
      fee: input.fee,
      quoter: config.integrations.uniswap.quoterV2,
      router: config.integrations.uniswap.universalRouter,
    };
  }

  buildApproveTx(input: BuildApproveTxInput): {
    to: string;
    data: string;
    value: string;
    chainId: number;
    token: string;
    spender: string;
    amountRaw: string;
    amount: string;
  } {
    const token = TOKENS[input.token];
    const amountRaw = ethers.parseUnits(input.amount, token.decimals);
    const data = this.erc20Interface.encodeFunctionData('approve', [
      config.integrations.uniswap.swapRouter02,
      amountRaw,
    ]);

    return {
      to: token.address,
      data,
      value: '0',
      chainId: 8453,
      token: token.address,
      spender: config.integrations.uniswap.swapRouter02,
      amountRaw: amountRaw.toString(),
      amount: input.amount,
    };
  }

  buildExactInputSingleTx(input: BuildSwapTxInput): {
    to: string;
    data: string;
    value: string;
    chainId: number;
    router: string;
  } {
    const tokenIn = TOKENS[input.tokenIn];
    const tokenOut = TOKENS[input.tokenOut];

    const amountInRaw = input.amountInRaw
      ? BigInt(input.amountInRaw)
      : ethers.parseUnits(input.amountIn || '0', tokenIn.decimals);
    const amountOutMinRaw = input.amountOutMinimumRaw
      ? BigInt(input.amountOutMinimumRaw)
      : ethers.parseUnits(input.amountOutMinimum || '0', tokenOut.decimals);

    const data = this.swapRouterInterface.encodeFunctionData('exactInputSingle', [
      {
        tokenIn: tokenIn.address,
        tokenOut: tokenOut.address,
        fee: input.fee,
        recipient: input.recipient,
        amountIn: amountInRaw,
        amountOutMinimum: amountOutMinRaw,
        sqrtPriceLimitX96: 0,
      },
    ]);

    return {
      to: config.integrations.uniswap.swapRouter02,
      data,
      value: '0',
      chainId: 8453,
      router: config.integrations.uniswap.swapRouter02,
    };
  }

  getTokenMeta(symbol: TokenSymbol): { address: string; decimals: number } {
    return TOKENS[symbol];
  }
}

export const uniswapService = new UniswapService();
