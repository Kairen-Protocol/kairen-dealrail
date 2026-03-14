# DealRail Backend

Backend API for DealRail - EIP-8183 compliant agentic commerce platform with BankrBot payments.

## Architecture

- **Framework**: Express.js + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Blockchain**: ethers.js v6 (Base Sepolia)
- **Payments**: BankrBot API integration
- **Storage**: IPFS via Pinata

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Setup Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Or run migrations (for production)
npm run db:migrate
```

### 4. Start Development Server

```bash
npm run dev
```

Server will start on `http://localhost:3000`

## API Endpoints

### Health Check

```bash
GET /health
```

Returns server status and blockchain configuration.

### Jobs

```bash
# List all jobs
GET /api/v1/jobs?client=0x...&state=OPEN&limit=50&offset=0

# Get job by database ID
GET /api/v1/jobs/:id

# Get job by on-chain job ID
GET /api/v1/jobs/onchain/:jobId

# Get job artifacts
GET /api/v1/jobs/:id/artifacts

# Get settlement proof
GET /api/v1/jobs/:id/proof
```

## Services

### Event Listener Service

Listens to blockchain events from the EscrowRail contract and syncs job state to the database.

**Features:**
- Real-time event monitoring for all job state changes
- Reorg-safe event processing with deduplication
- Historical event sync from specific block numbers
- Automatic state updates for jobs

**Events tracked:**
- `JobCreated` - New job created
- `JobFunded` - Job funded with escrow
- `JobSubmitted` - Work submitted by provider
- `JobCompleted` - Job approved by evaluator
- `JobRejected` - Job rejected (refund issued)
- `JobExpired` - Job expired past deadline

The event listener starts automatically when the server starts and syncs from the latest block. To sync from a specific block, modify the start parameter in `src/index.ts`.

### BankrBot Service

Handles payment execution via BankrBot API.

```typescript
import { bankrService } from './services/bankr.service';

// Submit transaction
const result = await bankrService.submitTransaction({
  transaction: {
    to: escrowAddress,
    chainId: 84532,
    data: encodedData,
    value: amount,
  },
  waitForConfirmation: true,
});
```

### IPFS Service

Uploads artifacts and proofs to IPFS via Pinata.

```typescript
import { ipfsService } from './services/ipfs.service';

// Pin JSON data
const cid = await ipfsService.pinJSON({
  jobId: 1,
  deliverable: '...',
});

// Pin file
const fileCid = await ipfsService.pinFile(buffer, 'deliverable.pdf');
```

## Database Schema

### Models

- **Job**: Main job/deal record (synced from blockchain events)
- **Artifact**: Negotiation artifacts and evidence
- **SettlementProof**: Generated settlement proofs
- **IdentityCache**: Cached identity verification results
- **ProcessedEvent**: Event processing tracker for reorg handling

### Enums

- **JobState**: `OPEN | FUNDED | SUBMITTED | COMPLETED | REJECTED | EXPIRED`
- **ArtifactKind**: `TERMS_DRAFT | COUNTER_OFFER | ACCEPTANCE | EVIDENCE | AMENDMENT | OTHER`

## Development

### Scripts

```bash
npm run dev          # Start dev server with hot reload
npm run build        # Build TypeScript
npm run start        # Run production build
npm run db:studio    # Open Prisma Studio
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Environment Variables

See `.env.example` for all required variables.

Key variables:
- `DATABASE_URL`: PostgreSQL connection string
- `RPC_URL`: Base Sepolia RPC endpoint
- `ESCROW_ADDRESS`: Deployed EscrowRail contract address
- `BANKR_API_KEY`: BankrBot API key
- `PINATA_JWT`: Pinata IPFS JWT

## Deployment

### Railway/Render

1. Create PostgreSQL addon
2. Set environment variables
3. Deploy from GitHub
4. Run migrations: `npm run db:migrate`

### Docker (Optional)

```bash
docker build -t dealrail-backend .
docker run -p 3000:3000 --env-file .env dealrail-backend
```

## Next Steps

- [x] Implement event listener for contract events
- [ ] Add WebSocket support for real-time updates
- [ ] Implement settlement proof generation
- [ ] Add identity verification endpoints
- [ ] Add rate limiting and authentication
- [ ] Deploy contracts to Base Sepolia
- [ ] Test full integration with BankrBot

## License

MIT
