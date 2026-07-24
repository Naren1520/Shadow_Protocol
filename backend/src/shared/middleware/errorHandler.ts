import type { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { AppException } from '@/shared/domain/exceptions';
import { ZodError } from 'zod';

interface FastifyErrorWithStatus extends Error {
  statusCode?: number;
  validation?: unknown[];
}

export function errorHandler(
  error: FastifyError | Error,
  request: FastifyRequest,
  reply: FastifyReply
): void {
  const err = error as FastifyErrorWithStatus;

  // App domain exceptions
  if (error instanceof AppException) {
    reply.status(error.statusCode).send({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    });
    return;
  }

  // Zod validation errors
  if (error instanceof ZodError) {
    reply.status(422).send({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: error.errors,
      },
    });
    return;
  }

  // Fastify schema validation errors
  if (err.validation) {
    reply.status(400).send({
      success: false,
      error: {
        code: 'BAD_REQUEST',
        message: error.message,
        details: err.validation,
      },
    });
    return;
  }

  // JWT / 401 errors
  if (err.statusCode === 401) {
    reply.status(401).send({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' },
    });
    return;
  }

  // Unhandled — log and return 500
  request.log.error(error);
  reply.status(500).send({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message:
        process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
    },
  });
}
