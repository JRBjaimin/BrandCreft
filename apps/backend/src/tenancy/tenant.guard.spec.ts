import { BadRequestException, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import type { AuthedRequest, AuthPrincipal } from '../auth/auth.types';
import { TenantGuard } from './tenant.guard';

const ctxFor = (req: Partial<AuthedRequest>): ExecutionContext =>
  ({
    switchToHttp: () => ({ getRequest: () => req }),
  }) as unknown as ExecutionContext;

const member: AuthPrincipal = {
  userId: 'u1',
  email: 'a@ex.com',
  isSuperAdmin: false,
  memberships: [{ businessId: 'biz-a', role: 'BUSINESS_OWNER' }],
};

describe('TenantGuard', () => {
  const guard = new TenantGuard();

  it('rejects unauthenticated requests', () => {
    expect(() => guard.canActivate(ctxFor({ params: { businessId: 'biz-a' } }))).toThrow(
      UnauthorizedException,
    );
  });

  it('rejects when no business id is present', () => {
    expect(() => guard.canActivate(ctxFor({ principal: member, params: {} }))).toThrow(
      BadRequestException,
    );
  });

  it('allows a member and stashes the proven id on the request', () => {
    const req: Partial<AuthedRequest> = { principal: member, params: { businessId: 'biz-a' } };
    expect(guard.canActivate(ctxFor(req))).toBe(true);
    expect(req.businessId).toBe('biz-a');
  });

  it('rejects a non-member with 403', () => {
    expect(() =>
      guard.canActivate(ctxFor({ principal: member, params: { businessId: 'biz-b' } })),
    ).toThrow(ForbiddenException);
  });

  it('reads the business id from the body when there is no route param', () => {
    const req: Partial<AuthedRequest> = { principal: member, params: {}, body: { businessId: 'biz-a' } };
    expect(guard.canActivate(ctxFor(req))).toBe(true);
    expect(req.businessId).toBe('biz-a');
  });
});
