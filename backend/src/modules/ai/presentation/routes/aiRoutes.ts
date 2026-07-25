import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { config } from '@/config/environment';

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
  const targetUrl = `${config.AI_SERVICE_URL}${path}`;
  const headers = buildProxyHeaders(request.headers);

  const init: RequestInit = {
    method: request.method,
    headers: {
      ...headers,
      accept: 'application/json',
      'content-type': 'application/json',
    },
  };

  if (!['GET', 'HEAD'].includes(request.method) && request.body !== undefined) {
    init.body = JSON.stringify(request.body);
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
  fastify.all('/ai', proxyAiRequest);
  fastify.all('/ai/*', proxyAiRequest);
}
