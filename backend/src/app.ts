import 'reflect-metadata';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import jwt from '@fastify/jwt';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { config } from './config/environment';
import { registerRoutes } from './bootstrap/registerRoutes';
import { errorHandler } from './shared/middleware/errorHandler';

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: config.LOG_LEVEL,
      transport:
        config.NODE_ENV === 'development'
          ? { target: 'pino-pretty', options: { colorize: true } }
          : undefined,
    },
    requestIdLogLabel: 'reqId',
    disableRequestLogging: false,
    requestTimeout: 30000,
  });

  // Security headers
  await app.register(helmet, {
    contentSecurityPolicy: false,
    frameguard: { action: 'deny' },
    noSniff: true,
    xssFilter: true,
  });

  // CORS
  await app.register(cors, {
    origin: config.ALLOWED_ORIGINS.split(',').map((s) => s.trim()),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  // Rate limiting
  await app.register(rateLimit, {
    max: config.RATE_LIMIT_MAX,
    timeWindow: config.RATE_LIMIT_WINDOW,
    errorResponseBuilder: () => ({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please wait before retrying.',
      },
    }),
  });

  // JWT
  await app.register(jwt, {
    secret: config.JWT_SECRET,
    sign: { expiresIn: config.JWT_EXPIRES_IN },
  });

  // Swagger documentation
  await app.register(swagger, {
    openapi: {
      info: {
        title: 'ShadowProtocol API',
        description: 'Crime Intelligence Platform API for Karnataka Police',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      tags: [
        { name: 'Auth', description: 'Authentication endpoints' },
        { name: 'Crimes', description: 'FIR and crime record management' },
        { name: 'Cases', description: 'Case management' },
        { name: 'Analytics', description: 'Crime analytics and insights' },
        { name: 'Accused', description: 'Accused person management' },
      ],
    },
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'none',
      deepLinking: true,
    },
  });

  // Register all routes
  await registerRoutes(app);

  // Global error handler
  app.setErrorHandler(errorHandler);

  // Not found handler
  app.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Route ${request.method} ${request.url} not found`,
      },
    });
  });

  return app;
}
