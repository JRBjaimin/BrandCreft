import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { AuthedRequest } from '../auth/auth.types';
import { assertBusinessAccess } from './tenant-access';

/**
 * Protects every route scoped to a single business.
 *
 * 1. Requires an authenticated principal (401 otherwise).
 * 2. Resolves the target business id from `:businessId` route param, then body,
 *    then query string.
 * 3. Rejects with 403 unless the principal is a super admin or a member.
 * 4. Stashes the proven id on `req.businessId` for `@BusinessId()` to read, so
 *    downstream code can never accidentally act on an unchecked id.
 */
@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<AuthedRequest>();

    if (!req.principal) {
      throw new UnauthorizedException('Authentication required');
    }

    const businessId = this.resolveBusinessId(req);
    if (!businessId) {
      throw new BadRequestException('Missing business id');
    }

    assertBusinessAccess(req.principal, businessId);
    req.businessId = businessId;
    return true;
  }

  private resolveBusinessId(req: AuthedRequest): string | undefined {
    const fromParams = (req.params as Record<string, string | undefined>)?.businessId;
    const fromBody = (req.body as Record<string, unknown> | undefined)?.businessId;
    const fromQuery = (req.query as Record<string, unknown> | undefined)?.businessId;
    const candidate = fromParams ?? fromBody ?? fromQuery;
    return typeof candidate === 'string' && candidate.length > 0 ? candidate : undefined;
  }
}
