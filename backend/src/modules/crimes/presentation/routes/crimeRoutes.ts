import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { GetCrimesUseCase } from '../../application/usecases/GetCrimesUseCase';
import { GetCrimeDetailUseCase } from '../../application/usecases/GetCrimeDetailUseCase';
import { authenticate } from '@/shared/middleware/authMiddleware';
import { prisma } from '@/config/database';

const getCrimesUseCase = new GetCrimesUseCase();
const getCrimeDetailUseCase = new GetCrimeDetailUseCase();

const CrimeQuerySchema = z.object({
  page: z.coerce.number().positive().optional(),
  limit: z.coerce.number().positive().max(100).optional(),
  crimeNo: z.string().optional(),
  policeStationId: z.coerce.number().optional(),
  crimeMajorHeadId: z.coerce.number().optional(),
  caseStatusId: z.coerce.number().optional(),
  gravityOffenceId: z.coerce.number().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  districtId: z.coerce.number().optional(),
});

export async function crimeRoutes(fastify: FastifyInstance): Promise<void> {
  // All crime routes require authentication
  fastify.addHook('preHandler', authenticate);

  // GET /crimes/dashboard  (must be before /:caseMasterId)
  fastify.get(
    '/crimes/dashboard',
    {
      schema: {
        tags: ['Crimes'],
        summary: 'Crime dashboard metrics',
        security: [{ bearerAuth: [] }],
      },
    },
    async (_request, reply) => {
      const [total, open, charged, heinous] = await Promise.all([
        prisma.crimeFIR.count(),
        prisma.crimeFIR.count({ where: { caseStatusId: 1 } }),
        prisma.crimeFIR.count({ where: { caseStatusId: 3 } }),
        prisma.crimeFIR.count({ where: { gravityOffenceId: 1 } }),
      ]);

      return reply.status(200).send({
        success: true,
        data: {
          totalFIRs: total,
          openCases: open,
          chargedCases: charged,
          heinousOffences: heinous,
        },
      });
    }
  );

  // GET /crimes/search
  fastify.get(
    '/crimes/search',
    {
      schema: {
        tags: ['Crimes'],
        summary: 'Search crimes by various criteria',
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const filters = CrimeQuerySchema.parse(request.query);
      const result = await getCrimesUseCase.execute(filters);
      return reply.status(200).send({ success: true, ...result });
    }
  );

  // GET /crimes
  fastify.get(
    '/crimes',
    {
      schema: {
        tags: ['Crimes'],
        summary: 'List FIR records with filtering and pagination',
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const filters = CrimeQuerySchema.parse(request.query);
      const result = await getCrimesUseCase.execute(filters);
      return reply.status(200).send({ success: true, ...result });
    }
  );

  // GET /crimes/:caseMasterId
  fastify.get(
    '/crimes/:caseMasterId',
    {
      schema: {
        tags: ['Crimes'],
        summary: 'Get FIR details by case master ID',
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          required: ['caseMasterId'],
          properties: {
            caseMasterId: { type: 'integer' },
          },
        },
      },
    },
    async (request, reply) => {
      const { caseMasterId } = request.params as { caseMasterId: string };
      const crime = await getCrimeDetailUseCase.execute(Number(caseMasterId));
      return reply.status(200).send({ success: true, data: crime });
    }
  );
}
