import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { config } from '@/config/environment';

function skipAuthForLocalDev(request: FastifyRequest): boolean {
  const origin = request.headers.origin;
  return origin === 'http://localhost:3000' || request.headers['x-local-dev'] === 'true';
}

function buildProxyHeaders(headers: FastifyRequest['headers']): Record<string, string> {
  return Object.entries(headers).reduce<Record<string, string>>((acc, [key, value]) => {
    if (!value || key.toLowerCase() === 'host') {
      return acc;
    }

    if (Array.isArray(value)) {
      acc[key] = value.join(', ');
    } else {
      acc[key] = String(value);
    }

    return acc;
  }, {});
}

async function proxyAiRequest(request: FastifyRequest, reply: FastifyReply) {
  const originalUrl = request.raw.url ?? request.url;
  const path = originalUrl.replace(/^\/api\/v1\/ai/, '') || '/';
  const targetPath = path === '/' ? '/api/v1/chat' : `/api/v1${path}`;
  const targetUrl = `${config.AI_SERVICE_URL}${targetPath}`;
  const headers = buildProxyHeaders(request.headers);

  const init: RequestInit = {
    method: request.method,
    headers: {
      ...headers,
      accept: 'application/json',
      'content-type': 'application/json',
    },
  };

  if (!['GET', 'HEAD'].includes(request.method)) {
    const rawBody = request.body;
    if (rawBody !== undefined) {
      const parsedBody = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody;
      init.body = JSON.stringify(parsedBody);
    }
  }

  const response = await fetch(targetUrl, init);
  const responseText = await response.text();
  const contentType = response.headers.get('content-type') || 'application/json';

  reply.header('content-type', contentType);
  reply.status(response.status);

  if (contentType.includes('application/json')) {
    try {
      return reply.send(JSON.parse(responseText));
    } catch {
      return reply.send(responseText);
    }
  }

  return reply.send(responseText);
}

export async function aiRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.addHook('preHandler', async (request, reply) => {
    if (skipAuthForLocalDev(request)) {
      return;
    }

    if (!request.headers.authorization) {
      reply.code(401).send({ message: 'Unauthorized' });
      return;
    }
  });

  fastify.route({
    method: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    url: '/ai',
    handler: proxyAiRequest,
  });

  fastify.route({
    method: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    url: '/ai/*',
    handler: proxyAiRequest,
  });
}
