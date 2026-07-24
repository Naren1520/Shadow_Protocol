import bcrypt from 'bcryptjs';
import { prisma } from '@/config/database';
import { UnauthorizedException } from '@/shared/domain/exceptions';
import type { LoginDTO, AuthResponseDTO } from '../dto/AuthDTO';

export class LoginUseCase {
  async execute(dto: LoginDTO, signToken: (payload: object, opts?: object) => string): Promise<AuthResponseDTO> {
    // Find user by email (using a system_users table or mapping officer email)
    const user = await prisma.systemUser.findUnique({
      where: { email: dto.email },
      include: {
        officer: {
          include: {
            unit: true,
            rank: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated. Contact your administrator.');
    }

    // Update last login
    await prisma.systemUser.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      kgId: user.officer?.kgId ?? '',
    };

    const accessToken = signToken(payload, { expiresIn: '1h' });
    const refreshToken = signToken({ userId: user.id, type: 'refresh' }, { expiresIn: '7d' });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.officer?.firstName ?? user.email,
        role: user.role,
        kgId: user.officer?.kgId ?? '',
        unit: {
          unitId: user.officer?.unit?.unitId ?? 0,
          unitName: user.officer?.unit?.unitName ?? 'Unknown',
        },
      },
    };
  }
}
