import { locusService, LocusSendUsdcInput } from './locus.service';

export type ExecutionProvider = 'wallet' | 'locus' | 'bankr';

export interface WalletExecutionInput {
  to: string;
  data: string;
  value: string;
  chainId: number;
}

export interface ExecutionRequest {
  provider: ExecutionProvider;
  operation: 'send-usdc' | 'send-tx';
  payload: Record<string, unknown>;
}

class ExecutionService {
  listProviders(): Array<{ id: ExecutionProvider; mode: 'live' | 'bridge' | 'mock'; useCase: string }> {
    return [
      { id: 'wallet', mode: 'live', useCase: 'Client-side signed transaction execution' },
      { id: 'locus', mode: 'bridge', useCase: 'USDC operations through Locus MCP' },
      { id: 'bankr', mode: 'mock', useCase: 'Bankr-compatible execution abstraction' },
    ];
  }

  async execute(request: ExecutionRequest): Promise<unknown> {
    switch (request.provider) {
      case 'wallet':
        return this.walletPassthrough(request);
      case 'locus':
        return this.locusExecute(request);
      case 'bankr':
        return this.bankrMock(request);
      default:
        throw new Error('Unsupported provider');
    }
  }

  private walletPassthrough(request: ExecutionRequest): unknown {
    if (request.operation !== 'send-tx') {
      throw new Error('Wallet provider supports send-tx only');
    }
    const payload = request.payload as Record<string, unknown>;
    if (
      typeof payload.to !== 'string' ||
      typeof payload.data !== 'string' ||
      typeof payload.value !== 'string' ||
      typeof payload.chainId !== 'number'
    ) {
      throw new Error('Invalid wallet payload shape');
    }
    const tx: WalletExecutionInput = {
      to: payload.to,
      data: payload.data,
      value: payload.value,
      chainId: payload.chainId,
    };
    return {
      provider: 'wallet',
      mode: 'passthrough',
      tx,
    };
  }

  private async locusExecute(request: ExecutionRequest): Promise<unknown> {
    if (request.operation !== 'send-usdc') {
      throw new Error('Locus provider supports send-usdc only');
    }
    const payload = request.payload as unknown as LocusSendUsdcInput;
    const result = await locusService.sendUsdc(payload);
    return {
      provider: 'locus',
      result,
    };
  }

  private bankrMock(request: ExecutionRequest): unknown {
    return {
      provider: 'bankr',
      mode: 'mock',
      accepted: true,
      operation: request.operation,
      payload: request.payload,
      note: 'Bankr neutral adapter scaffold (connect real SDK/API key later).',
    };
  }
}

export const executionService = new ExecutionService();
