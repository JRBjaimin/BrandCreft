import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import type { AuthedRequest, AuthPrincipal } from './auth.types';

/**
 * Injects the authenticated principal. Throws 401 if the request is
 * unauthenticated, so controllers can rely on a non-null value.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthPrincipal => {
    const req = ctx.switchToHttp().getRequest<AuthedRequest>();
    if (!req.principal) {
      throw new UnauthorizedException('Authentication required');
    }
    return req.principal;
  },
);
