import { config } from '@/config/environment';
import type { TokenPayload } from '../../application/dto/AuthDTO';

// Using @fastify/jwt approach — app instance passed in at startup
// This service handles token logic; actual signing is done via fastify.jwt

export class JWTService {
  private fastifyJwt: { sign: (payload: object, options?: object) => string; verify: (token: string) => TokenPayload };

  constructor(fastifyJwt: { sign: (payload: object, options?: object) => string; verify: (token: string) => TokenPayload }) {
    this.fastifyJwt = fastifyJwt;
  }

  signAccessToken(payload: TokenPayload): string {
    return this.fastifyJwt.sign(payload, { expiresIn: config.JWT_EXPIRES_IN });
  }

  signRefreshToken(payload: Pick<TokenPayload, 'userId'>): string {
    return this.fastifyJwt.sign(
      { userId: payload.userId, type: 'refresh' },
      { expiresIn: config.JWT_REFRESH_EXPIRES_IN }
    );
  }

  verifyToken(token: string): TokenPayload {
    return this.fastifyJwt.verify(token);
  }
}
