import type { FastifyInstance } from 'fastify';
import { authenticate } from '@/shared/middleware/authMiddleware';
import { prisma } from '@/config/database';

export async function analyticsRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.addHook('preHandler', authenticate);

  // GET /analytics/overview
  fastify.get(
    '/analytics/overview',
    { schema: { tags: ['Analytics'], summary: 'Crime KPI overview', security: [{ bearerAuth: [] }] } },
    async (_request, reply) => {
      const [totalFIRs, openCases, chargedCases, heinous, totalArrests] = await Promise.all([
        prisma.crimeFIR.count(),
        prisma.crimeFIR.count({ where: { caseStatusId: 1 } }),
        prisma.crimeFIR.count({ where: { caseStatusId: 3 } }),
        prisma.crimeFIR.count({ where: { gravityOffenceId: 1 } }),
        prisma.arrestRecord.count(),
      ]);

      const detectionRate =
        totalFIRs > 0 ? ((chargedCases / totalFIRs) * 100).toFixed(1) : '0.0';

      return reply.send({
        success: true,
        data: {
          totalFIRs,
          openCases,
          chargedCases,
          heinousOffences: heinous,
          totalArrests,
          detectionRate: `${detectionRate}%`,
        },
      });
    }
  );

  // GET /analytics/crimes-by-district
  fastify.get(
    '/analytics/crimes-by-district',
    { schema: { tags: ['Analytics'], summary: 'FIR count by district', security: [{ bearerAuth: [] }] } },
    async (_request, reply) => {
      const results = await prisma.$queryRaw<
        Array<{ district_id: number; district_name: string; count: bigint }>
      >`
        SELECT d.district_id, d.district_name, COUNT(f.case_master_id)::int AS count
        FROM districts d
        LEFT JOIN police_stations ps ON ps.district_id = d.district_id
        LEFT JOIN case_masters f ON f.police_station_id = ps.unit_id
        GROUP BY d.district_id, d.district_name
        ORDER BY count DESC
        LIMIT 20
      `;

      return reply.send({
        success: true,
        data: results.map((r) => ({
          districtId: r.district_id,
          districtName: r.district_name,
          count: Number(r.count),
        })),
      });
    }
  );

  // GET /analytics/crimes-by-head
  fastify.get(
    '/analytics/crimes-by-head',
    { schema: { tags: ['Analytics'], summary: 'FIR count by crime head', security: [{ bearerAuth: [] }] } },
    async (_request, reply) => {
      const results = await prisma.$queryRaw<
        Array<{ crime_group_name: string; count: bigint }>
      >`
        SELECT ch.crime_group_name, COUNT(f.case_master_id)::int AS count
        FROM crime_heads ch
        LEFT JOIN case_masters f ON f.crime_major_head_id = ch.crime_head_id
        GROUP BY ch.crime_head_id, ch.crime_group_name
        ORDER BY count DESC
        LIMIT 10
      `;

      return reply.send({
        success: true,
        data: results.map((r) => ({
          name: r.crime_group_name,
          count: Number(r.count),
        })),
      });
    }
  );

  // GET /analytics/monthly-trend
  fastify.get(
    '/analytics/monthly-trend',
    { schema: { tags: ['Analytics'], summary: 'Monthly FIR trend', security: [{ bearerAuth: [] }] } },
    async (request, reply) => {
      const { year = new Date().getFullYear() } = request.query as { year?: number };

      const results = await prisma.$queryRaw<
        Array<{ month: number; count: bigint }>
      >`
        SELECT EXTRACT(MONTH FROM crime_registered_date)::int AS month,
               COUNT(*)::int AS count
        FROM case_masters
        WHERE EXTRACT(YEAR FROM crime_registered_date) = ${Number(year)}
        GROUP BY month
        ORDER BY month
      `;

      const monthMap: Record<number, number> = {};
      results.forEach((r) => {
        monthMap[r.month] = Number(r.count);
      });

      const monthly = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        count: monthMap[i + 1] ?? 0,
      }));

      return reply.send({ success: true, data: monthly });
    }
  );

  // GET /analytics/hotspots
  fastify.get(
    '/analytics/hotspots',
    { schema: { tags: ['Analytics'], summary: 'Crime hotspots', security: [{ bearerAuth: [] }] } },
    async (_request, reply) => {
      // Return FIRs with geo coordinates
      const hotspots = await prisma.crimeFIR.findMany({
        where: {
          latitude: { not: null },
          longitude: { not: null },
        },
        select: {
          caseMasterId: true,
          crimeNo: true,
          latitude: true,
          longitude: true,
          policeStation: { select: { unitName: true } },
          majorHead: { select: { crimeGroupName: true } },
          gravityOffence: { select: { lookupValue: true } },
        },
        take: 500,
        orderBy: { crimeRegisteredDate: 'desc' },
      });

      return reply.send({ success: true, data: hotspots });
    }
  );
}
