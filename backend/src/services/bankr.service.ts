// BankrBot payment integration service
import { config } from '../config';
import { BankrPromptRequest, BankrPromptResponse, BankrSubmitRequest, BankrSubmitResponse } from '../types';

export class BankrService {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = config.bankr.apiKey;
    this.apiUrl = config.bankr.apiUrl;
  }

  /**
   * Submit a natural language prompt to BankrBot
   * @param request Prompt request with optional thread ID
   * @returns Job ID and status
   */
  async prompt(request: BankrPromptRequest): Promise<BankrPromptResponse> {
    const response = await fetch(`${this.apiUrl}/agent/prompt`, {
      method: 'POST',
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: request.prompt,
        threadId: request.threadId,
      }),
    });

    if (!response.ok) {
      throw new Error(`BankrBot API error: ${response.statusText}`);
    }

    return (await response.json()) as BankrPromptResponse;
  }

  /**
   * Submit a raw transaction via BankrBot
   * @param request Transaction details
   * @returns Transaction hash and status
   */
  async submitTransaction(request: BankrSubmitRequest): Promise<BankrSubmitResponse> {
    const response = await fetch(`${this.apiUrl}/agent/submit`, {
      method: 'POST',
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transaction: request.transaction,
        waitForConfirmation: request.waitForConfirmation ?? true,
      }),
    });

    if (!response.ok) {
      throw new Error(`BankrBot submit error: ${response.statusText}`);
    }

    return (await response.json()) as BankrSubmitResponse;
  }

  /**
   * Poll for job status
   * @param jobId BankrBot job ID
   * @returns Job status and response
   */
  async getJobStatus(jobId: string): Promise<BankrPromptResponse> {
    const response = await fetch(`${this.apiUrl}/agent/job/${jobId}`, {
      method: 'GET',
      headers: {
        'X-API-Key': this.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`BankrBot job status error: ${response.statusText}`);
    }

    return (await response.json()) as BankrPromptResponse;
  }

  /**
   * Helper: Wait for job completion with polling
   * @param jobId Job ID to wait for
   * @param maxAttempts Maximum poll attempts (default: 30)
   * @param intervalMs Poll interval in ms (default: 2000)
   * @returns Completed job response
   */
  async waitForJobCompletion(
    jobId: string,
    maxAttempts: number = 30,
    intervalMs: number = 2000
  ): Promise<BankrPromptResponse> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const status = await this.getJobStatus(jobId);

      if (status.status === 'completed' || status.status === 'failed') {
        return status;
      }

      // Wait before next poll
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }

    throw new Error(`Job ${jobId} did not complete within ${maxAttempts} attempts`);
  }
}

export const bankrService = new BankrService();
