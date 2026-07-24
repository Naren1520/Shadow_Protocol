import type { FastifyRequest, FastifyReply } from 'fastify';
import { UnauthorizedException, ForbiddenException } from '@/shared/domain/exceptions';

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  kgId: string;
  iat?: number;
  exp?: number;
}

// Extend FastifyRequest with typed user — use declaration merging carefully
// @fastify/jwt sets request.user, we cast it to JWTPayload after verification
export async function authenticate(
  request: FastifyRequest,
  _reply: FastifyReply
): Promise<void> {
  try {
    await request.jwtVerify();
  } catch {
    throw new UnauthorizedException('Invalid or expired access token');
  }
}

export function authorize(...roles: string[]) {
  return async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
    const user = request.user as JWTPayload | undefined;
    if (!user) {
      throw new UnauthorizedException();
    }
    if (roles.length > 0 && !roles.includes((user as JWTPayload).role)) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${roles.join(', ')}`
      );
    }
  };
}

/** Helper to get the typed JWT payload from request */
export function getUser(request: FastifyRequest): JWTPayload {
  return request.user as unknown as JWTPayload;
}
