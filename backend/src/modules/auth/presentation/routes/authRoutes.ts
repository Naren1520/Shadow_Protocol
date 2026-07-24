import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { LoginSchema, RefreshTokenSchema } from '../../application/dto/AuthDTO';
import { LoginUseCase } from '../../application/usecases/LoginUseCase';
import { authenticate, getUser } from '@/shared/middleware/authMiddleware';

const loginUseCase = new LoginUseCase();

export async function authRoutes(fastify: FastifyInstance): Promise<void> {
  // POST /auth/login
  fastify.post(
    '/auth/login',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Login with email and password',
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8 },
          },
        },
      },
    },
    async (request, reply) => {
      const dto = LoginSchema.parse(request.body);
      const result = await loginUseCase.execute(dto, fastify.jwt.sign.bind(fastify.jwt));
      return reply.status(200).send({ success: true, data: result });
    }
  );

  // POST /auth/refresh
  fastify.post(
    '/auth/refresh',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Refresh access token',
      },
    },
    async (request, reply) => {
      const { refreshToken } = RefreshTokenSchema.parse(request.body);

      let payload: { userId: number; type: string };
      try {
        payload = fastify.jwt.verify<{ userId: number; type: string }>(refreshToken);
      } catch {
        return reply.status(401).send({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Invalid refresh token' },
        });
      }

      if (payload.type !== 'refresh') {
        return reply.status(401).send({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Invalid token type' },
        });
      }

      const newAccessToken = fastify.jwt.sign(
        { userId: payload.userId },
        { expiresIn: '1h' }
      );

      return reply.status(200).send({
        success: true,
        data: { accessToken: newAccessToken },
      });
    }
  );

  // GET /auth/me
  fastify.get(
    '/auth/me',
    {
      preHandler: [authenticate],
      schema: {
        tags: ['Auth'],
        summary: 'Get current user profile',
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const user = getUser(request);
      return reply.status(200).send({
        success: true,
        data: {
          userId: user.userId,
          email: user.email,
          role: user.role,
          kgId: user.kgId,
        },
      });
    }
  );

  // POST /auth/logout
  fastify.post(
    '/auth/logout',
    {
      preHandler: [authenticate],
      schema: {
        tags: ['Auth'],
        summary: 'Logout (client should discard tokens)',
        security: [{ bearerAuth: [] }],
      },
    },
    async (_request, reply) => {
      // Stateless JWT — client discards tokens
      // For production: add token to a Redis denylist
      return reply.status(200).send({ success: true, message: 'Logged out successfully' });
    }
  );
}
