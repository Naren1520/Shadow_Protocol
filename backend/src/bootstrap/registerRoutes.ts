import type { FastifyInstance } from 'fastify';
import { authRoutes } from '@/modules/auth/presentation/routes/authRoutes';
import { crimeRoutes } from '@/modules/crimes/presentation/routes/crimeRoutes';
import { caseRoutes } from '@/modules/cases/presentation/routes/caseRoutes';
import { analyticsRoutes } from '@/modules/analytics/presentation/routes/analyticsRoutes';
import { accusedRoutes } from '@/modules/accused/presentation/routes/accusedRoutes';
import { auditRoutes } from '@/modules/audit/presentation/routes/auditRoutes';

export async function registerRoutes(app: FastifyInstance): Promise<void> {
  const API_PREFIX = '/api/v1';

  await app.register(authRoutes,      { prefix: API_PREFIX });
  await app.register(crimeRoutes,     { prefix: API_PREFIX });
  await app.register(caseRoutes,      { prefix: API_PREFIX });
  await app.register(analyticsRoutes, { prefix: API_PREFIX });
  await app.register(accusedRoutes,   { prefix: API_PREFIX });
  await app.register(auditRoutes,     { prefix: API_PREFIX });

  // Health check
  app.get('/health', async () => ({
    status: 'ok',
    service: 'ShadowProtocol Backend',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  }));

  app.get('/', async () => ({
    message: 'ShadowProtocol API v1',
    docs: '/docs',
    health: '/health',
  }));
}
