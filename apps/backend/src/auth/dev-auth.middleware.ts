import { Injectable, Logger, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import type { NextFunction, Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthedRequest, AuthPrincipal } from './auth.types';

/**
 * DEVELOPMENT / TEST ONLY.
 *
 * Resolves the caller from an `x-dev-user-id` header so tenant isolation can be
 * built and tested before Phase 3 delivers real authentication. It is wired only
 * when NODE_ENV !== 'production' (see AuthModule); in production the app boots
 * without any principal source until the Phase 3 JWT middleware replaces it.
 *
 * It never trusts the client for anything beyond "which user am I" — every
 * membership and the super-admin flag are loaded fresh from the database.
 */
@Injectable()
export class DevAuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(DevAuthMiddleware.name);

  constructor(private readonly prisma: PrismaService) {}

  async use(req: AuthedRequest, _res: Response, next: NextFunction): Promise<void> {
    const userId = req.header('x-dev-user-id');
    if (!userId) {
      next();
      return;
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: { include: { role: true } },
        businessUsers: true,
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Unknown or inactive dev user');
    }

    const principal: AuthPrincipal = {
      userId: user.id,
      email: user.email,
      isSuperAdmin: user.roles.some((r) => r.role.name === 'SUPER_ADMIN'),
      memberships: user.businessUsers.map((bu) => ({
        businessId: bu.businessId,
        role: bu.role,
      })),
    };

    req.principal = principal;
    this.logger.debug(`dev auth: ${principal.email} (${principal.memberships.length} memberships)`);
    next();
  }
}
