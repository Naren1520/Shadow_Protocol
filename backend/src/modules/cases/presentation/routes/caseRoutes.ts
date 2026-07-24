import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { authenticate } from '@/shared/middleware/authMiddleware';
import { prisma } from '@/config/database';
import { NotFoundException } from '@/shared/domain/exceptions';
import { buildPagination, buildPaginatedResponse } from '@/shared/utils/pagination';

const QuerySchema = z.object({
  page: z.coerce.number().positive().optional(),
  limit: z.coerce.number().positive().max(100).optional(),
  caseNo: z.string().optional(),
  crimeNo: z.string().optional(),
  caseStatusId: z.coerce.number().optional(),
  policeStationId: z.coerce.number().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
});

export async function caseRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.addHook('preHandler', authenticate);

  // GET /cases
  fastify.get(
    '/cases',
    {
      schema: {
        tags: ['Cases'],
        summary: 'List cases with filtering and pagination',
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const q = QuerySchema.parse(request.query);
      const { page, limit, skip } = buildPagination(q);

      const where: Record<string, unknown> = {};
      if (q.caseNo) where.caseNo = { contains: q.caseNo, mode: 'insensitive' };
      if (q.crimeNo) where.crimeNo = { contains: q.crimeNo, mode: 'insensitive' };
      if (q.caseStatusId) where.caseStatusId = q.caseStatusId;
      if (q.policeStationId) where.policeStationId = q.policeStationId;
      if (q.fromDate || q.toDate) {
        where.crimeRegisteredDate = {
          ...(q.fromDate ? { gte: new Date(q.fromDate) } : {}),
          ...(q.toDate ? { lte: new Date(q.toDate) } : {}),
        };
      }

      const [total, cases] = await Promise.all([
        prisma.crimeFIR.count({ where }),
        prisma.crimeFIR.findMany({
          where,
          skip,
          take: limit,
          orderBy: { crimeRegisteredDate: 'desc' },
          include: {
            policeStation: { select: { unitId: true, unitName: true } },
            caseStatus: { select: { caseStatusId: true, caseStatusName: true } },
            majorHead: { select: { crimeHeadId: true, crimeGroupName: true } },
            minorHead: { select: { crimeSubHeadId: true, crimeHeadName: true } },
            court: { select: { courtId: true, courtName: true } },
            chargesheet: { select: { chargeshtId: true, chargeshtDate: true, chargeshtType: true } },
            registeredBy: {
              select: {
                employeeId: true,
                firstName: true,
                rank: { select: { rankName: true } },
              },
            },
            _count: {
              select: { accused: true, victims: true, arrests: true },
            },
          },
        }),
      ]);

      return reply.send({
        success: true,
        ...buildPaginatedResponse(cases, total, page, limit),
      });
    }
  );

  // GET /cases/summary  — court-deadline focused view
  fastify.get(
    '/cases/summary',
    {
      schema: {
        tags: ['Cases'],
        summary: 'Case summary counts by status',
        security: [{ bearerAuth: [] }],
      },
    },
    async (_request, reply) => {
      const statuses = await prisma.caseStatus.findMany({
        include: { _count: { select: { crimeFIRs: true } } },
        orderBy: { caseStatusId: 'asc' },
      });

      return reply.send({
        success: true,
        data: statuses.map((s) => ({
          statusId: s.caseStatusId,
          statusName: s.caseStatusName,
          count: s._count.crimeFIRs,
        })),
      });
    }
  );

  // GET /cases/:caseMasterId
  fastify.get(
    '/cases/:caseMasterId',
    {
      schema: {
        tags: ['Cases'],
        summary: 'Get case details',
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          required: ['caseMasterId'],
          properties: { caseMasterId: { type: 'integer' } },
        },
      },
    },
    async (request, reply) => {
      const { caseMasterId } = request.params as { caseMasterId: string };

      const caseRecord = await prisma.crimeFIR.findUnique({
        where: { caseMasterId: Number(caseMasterId) },
        include: {
          policeStation: true,
          caseStatus: true,
          majorHead: true,
          minorHead: true,
          gravityOffence: true,
          caseCategory: true,
          court: true,
          registeredBy: { include: { rank: true, designation: true } },
          complainants: { include: { occupation: true, religion: true, caste: true } },
          victims: true,
          accused: true,
          actSections: { include: { act: true, section: true } },
          arrests: {
            include: {
              accused: true,
              investigatingOfficer: { include: { rank: true } },
              court: true,
            },
          },
          chargesheet: true,
        },
      });

      if (!caseRecord) throw new NotFoundException('Case', caseMasterId);

      return reply.send({ success: true, data: caseRecord });
    }
  );
}
