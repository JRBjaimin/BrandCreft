import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import type { AuthedRequest } from '../auth/auth.types';

/**
 * The business id proven by TenantGuard. Using this decorator on a route that is
 * not protected by TenantGuard is a programming error and fails loudly.
 */
export const BusinessId = createParamDecorator((_data: unknown, ctx: ExecutionContext): string => {
  const req = ctx.switchToHttp().getRequest<AuthedRequest>();
  if (!req.businessId) {
    throw new InternalServerErrorException('BusinessId used without TenantGuard');
  }
  return req.businessId;
});
