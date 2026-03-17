export interface X402ProxyRequest {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
  paymentHeader?: string;
}

export interface X402ProxyResult {
  success: boolean;
  status: number;
  paid: boolean;
  requiresPayment: boolean;
  challenge?: {
    paymentRequiredHeader: string | null;
    wwwAuthenticate: string | null;
  };
  responseHeaders: Record<string, string>;
  body: unknown;
}

class X402Service {
  async proxyRequest(payload: X402ProxyRequest): Promise<X402ProxyResult> {
    const method = payload.method ?? 'GET';

    const headers: Record<string, string> = {
      Accept: 'application/json, text/plain, */*',
      ...(payload.headers || {}),
    };

    if (payload.paymentHeader) {
      headers['X-PAYMENT'] = payload.paymentHeader;
    }

    if (payload.body !== undefined && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(payload.url, {
      method,
      headers,
      body: payload.body !== undefined ? JSON.stringify(payload.body) : undefined,
    });

    const text = await response.text();
    let parsedBody: unknown = text;
    try {
      parsedBody = text ? JSON.parse(text) : null;
    } catch {
      parsedBody = text;
    }

    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    const paymentRequiredHeader =
      response.headers.get('payment-required') ?? response.headers.get('Payment-Required');

    return {
      success: response.ok,
      status: response.status,
      paid: !!payload.paymentHeader,
      requiresPayment: response.status === 402,
      challenge:
        response.status === 402
          ? {
              paymentRequiredHeader,
              wwwAuthenticate: response.headers.get('www-authenticate'),
            }
          : undefined,
      responseHeaders,
      body: parsedBody,
    };
  }
}

export const x402Service = new X402Service();
