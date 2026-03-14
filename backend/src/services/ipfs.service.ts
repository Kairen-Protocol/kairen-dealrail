// IPFS storage service using Pinata
import { config } from '../config';

export class IPFSService {
  private jwt: string;
  private gateway: string;

  constructor() {
    this.jwt = config.ipfs.pinataJwt;
    this.gateway = config.ipfs.gateway;
  }

  /**
   * Pin JSON data to IPFS via Pinata
   * @param data JSON object to pin
   * @param name Optional name for the pin
   * @returns IPFS CID
   */
  async pinJSON(data: any, name?: string): Promise<string> {
    if (!this.jwt) {
      console.warn('IPFS: Pinata JWT not configured, skipping upload');
      return '';
    }

    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.jwt}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pinataContent: data,
        pinataMetadata: {
          name: name || 'DealRail Data',
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Pinata API error: ${response.statusText}`);
    }

    const result = (await response.json()) as { IpfsHash: string };
    return result.IpfsHash;
  }

  /**
   * Pin a file buffer to IPFS
   * @param buffer File buffer
   * @param filename Filename
   * @returns IPFS CID
   */
  async pinFile(buffer: Buffer, filename: string): Promise<string> {
    if (!this.jwt) {
      console.warn('IPFS: Pinata JWT not configured, skipping upload');
      return '';
    }

    const formData = new FormData();
    const blob = new Blob([buffer]);
    formData.append('file', blob, filename);

    const metadata = JSON.stringify({
      name: filename,
    });
    formData.append('pinataMetadata', metadata);

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.jwt}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Pinata file upload error: ${response.statusText}`);
    }

    const result = (await response.json()) as { IpfsHash: string };
    return result.IpfsHash;
  }

  /**
   * Fetch content from IPFS via gateway
   * @param cid IPFS CID
   * @returns Content as JSON
   */
  async fetchJSON(cid: string): Promise<any> {
    const url = `${this.gateway}/ipfs/${cid}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`IPFS fetch error: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get gateway URL for a CID
   * @param cid IPFS CID
   * @returns Full gateway URL
   */
  getGatewayUrl(cid: string): string {
    return `${this.gateway}/ipfs/${cid}`;
  }
}

export const ipfsService = new IPFSService();
