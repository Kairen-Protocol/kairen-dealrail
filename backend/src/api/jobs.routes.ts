// API routes for jobs
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

// Validation schemas
const createJobSchema = z.object({
  provider: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  evaluator: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  expiryTimestamp: z.number().int().positive(),
  hook: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
});

// Future endpoints
// const fundJobSchema = z.object({
//   jobId: z.number().int().positive(),
//   amount: z.string().regex(/^[0-9]+$/), // Wei as string
// });

// const submitWorkSchema = z.object({
//   jobId: z.number().int().positive(),
//   deliverableHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
//   ipfsCid: z.string().optional(),
// });

/**
 * GET /jobs
 * List all jobs (with optional filters)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { client, provider, state, limit = '50', offset = '0' } = req.query;

    const where: any = {};
    if (client) where.client = client as string;
    if (provider) where.provider = provider as string;
    if (state) where.state = state as string;

    const jobs = await prisma.job.findMany({
      where,
      include: {
        artifacts: true,
        proof: true,
      },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      jobs,
      pagination: {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        total: await prisma.job.count({ where }),
      },
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

/**
 * GET /jobs/:id
 * Get job details by database ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        artifacts: {
          orderBy: { seq: 'asc' },
        },
        proof: true,
      },
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    return res.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    return res.status(500).json({ error: 'Failed to fetch job' });
  }
});

/**
 * GET /jobs/onchain/:jobId
 * Get job by on-chain job ID
 */
router.get('/onchain/:jobId', async (req: Request, res: Response) => {
  try {
    const jobId = parseInt(req.params.jobId);

    const job = await prisma.job.findUnique({
      where: { jobId },
      include: {
        artifacts: {
          orderBy: { seq: 'asc' },
        },
        proof: true,
      },
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    return res.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    return res.status(500).json({ error: 'Failed to fetch job' });
  }
});

/**
 * POST /jobs
 * Create a new job (this endpoint is informational only)
 * Actual job creation happens via smart contract
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const data = createJobSchema.parse(req.body);

    return res.json({
      message: 'Job creation request received',
      note: 'Please use the smart contract to create the job on-chain',
      data,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Error processing job creation:', error);
    return res.status(500).json({ error: 'Failed to process job creation' });
  }
});

/**
 * GET /jobs/:id/artifacts
 * Get all artifacts for a job
 */
router.get('/:id/artifacts', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    const artifacts = await prisma.artifact.findMany({
      where: { jobId: id },
      orderBy: { seq: 'asc' },
    });

    res.json({ artifacts });
  } catch (error) {
    console.error('Error fetching artifacts:', error);
    res.status(500).json({ error: 'Failed to fetch artifacts' });
  }
});

/**
 * GET /jobs/:id/proof
 * Get settlement proof for a job
 */
router.get('/:id/proof', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    const proof = await prisma.settlementProof.findUnique({
      where: { jobId: id },
    });

    if (!proof) {
      return res.status(404).json({ error: 'Settlement proof not found' });
    }

    return res.json(proof);
  } catch (error) {
    console.error('Error fetching proof:', error);
    return res.status(500).json({ error: 'Failed to fetch proof' });
  }
});

export default router;
