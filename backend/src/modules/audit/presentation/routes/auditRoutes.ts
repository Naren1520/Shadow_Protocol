import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { authenticate, authorize } from '@/shared/middleware/authMiddleware';
import { prisma } from '@/config/database';
import { buildPagination, buildPaginatedResponse } from '@/shared/utils/pagination';

const QuerySchema = z.object({
  page: z.coerce.number().positive().optional(),
  limit: z.coerce.number().positive().max(200).optional(),
  employeeId: z.coerce.number().optional(),
  action: z.string().optional(),
  resource: z.string().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
});

export async function auditRoutes(fastify: FastifyInstance): Promise<void> {
  // Audit log routes require INSPECTOR+ role
  fastify.addHook('preHandler', authenticate);
  fastify.addHook('preHandler', authorize('SUPER_ADMIN', 'SP', 'DSP', 'INSPECTOR'));

  // GET /audit-logs
  fastify.get(
    '/audit-logs',
    {
      schema: {
        tags: ['Audit'],
        summary: 'List audit logs (admin/inspector only)',
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const q = QuerySchema.parse(request.query);
      const { page, limit, skip } = buildPagination(q);

      const where: Record<string, unknown> = {};
      if (q.employeeId) where.employeeId = q.employeeId;
      if (q.action) where.action = q.action.toUpperCase();
      if (q.resource) where.resource = { contains: q.resource, mode: 'insensitive' };
      if (q.fromDate || q.toDate) {
        where.timestamp = {
          ...(q.fromDate ? { gte: new Date(q.fromDate) } : {}),
          ...(q.toDate ? { lte: new Date(q.toDate) } : {}),
        };
      }

      const [total, logs] = await Promise.all([
        prisma.auditLog.count({ where }),
        prisma.auditLog.findMany({
          where,
          skip,
          take: limit,
          orderBy: { timestamp: 'desc' },
        }),
      ]);

      return reply.send({
        success: true,
        ...buildPaginatedResponse(logs, total, page, limit),
      });
    }
  );

  // POST /audit-logs  — internal: create an audit entry
  fastify.post(
    '/audit-logs',
    {
      schema: {
        tags: ['Audit'],
        summary: 'Create audit log entry (internal)',
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const body = z
        .object({
          employeeId: z.number(),
          action: z.enum(['CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN']),
          resource: z.string(),
          resourceId: z.string(),
          changes: z.unknown().optional(),
          ipAddress: z.string(),
          userAgent: z.string(),
        })
        .parse(request.body);

      const log = await prisma.auditLog.create({
        data: {
          employeeId: body.employeeId,
          action: body.action,
          resource: body.resource,
          resourceId: body.resourceId,
          changes: body.changes as Parameters<typeof prisma.auditLog.create>[0]['data']['changes'],
          ipAddress: body.ipAddress,
          userAgent: body.userAgent,
        },
      });

      return reply.status(201).send({ success: true, data: log });
    }
  );
}
