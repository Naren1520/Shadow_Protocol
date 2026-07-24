import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { authenticate } from '@/shared/middleware/authMiddleware';
import { prisma } from '@/config/database';
import { NotFoundException } from '@/shared/domain/exceptions';

const QuerySchema = z.object({
  page: z.coerce.number().positive().optional(),
  limit: z.coerce.number().positive().max(100).optional(),
  name: z.string().optional(),
  personId: z.string().optional(),
  caseMasterId: z.coerce.number().optional(),
});

export async function accusedRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.addHook('preHandler', authenticate);

  // GET /accused
  fastify.get('/accused', async (request, reply) => {
    const { page = 1, limit = 20, name, personId, caseMasterId } = QuerySchema.parse(request.query);
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (name) where.accusedName = { contains: name, mode: 'insensitive' };
    if (personId) where.personId = personId;
    if (caseMasterId) where.caseMasterId = caseMasterId;

    const [total, accused] = await Promise.all([
      prisma.accused.count({ where }),
      prisma.accused.findMany({
        where,
        skip,
        take: limit,
        orderBy: { accusedMasterId: 'desc' },
        include: {
          crimeFIR: {
            select: {
              crimeNo: true,
              caseNo: true,
              majorHead: { select: { crimeGroupName: true } },
            },
          },
          arrestRecords: {
            select: { arrestDate: true },
            orderBy: { arrestDate: 'desc' },
            take: 1,
          },
        },
      }),
    ]);

    return reply.send({
      success: true,
      data: accused,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  });

  // GET /accused/:id
  fastify.get('/accused/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    const accused = await prisma.accused.findUnique({
      where: { accusedMasterId: Number(id) },
      include: {
        crimeFIR: {
          include: {
            policeStation: true,
            majorHead: true,
            minorHead: true,
          },
        },
        arrestRecords: {
          include: {
            investigatingOfficer: { include: { rank: true } },
            court: true,
          },
        },
      },
    });

    if (!accused) {
      throw new NotFoundException('Accused', id);
    }

    return reply.send({ success: true, data: accused });
  });
}
