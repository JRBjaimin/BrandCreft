import { ForbiddenException } from '@nestjs/common';
import type { AuthPrincipal } from '../auth/auth.types';
import {
  accessibleBusinessIds,
  ALL_BUSINESSES,
  assertBusinessAccess,
  canAccessBusiness,
} from './tenant-access';

const member: AuthPrincipal = {
  userId: 'u1',
  email: 'a@ex.com',
  isSuperAdmin: false,
  memberships: [{ businessId: 'biz-a', role: 'BUSINESS_OWNER' }],
};

const superAdmin: AuthPrincipal = {
  userId: 'u0',
  email: 'root@ex.com',
  isSuperAdmin: true,
  memberships: [],
};

describe('tenant-access', () => {
  it('member can access their own business only', () => {
    expect(canAccessBusiness(member, 'biz-a')).toBe(true);
    expect(canAccessBusiness(member, 'biz-b')).toBe(false);
  });

  it('super admin can access any business', () => {
    expect(canAccessBusiness(superAdmin, 'biz-a')).toBe(true);
    expect(canAccessBusiness(superAdmin, 'anything')).toBe(true);
  });

  it('assertBusinessAccess throws 403 for a non-member', () => {
    expect(() => assertBusinessAccess(member, 'biz-a')).not.toThrow();
    expect(() => assertBusinessAccess(member, 'biz-b')).toThrow(ForbiddenException);
  });

  it('accessibleBusinessIds returns memberships, or ALL for super admin', () => {
    expect(accessibleBusinessIds(member)).toEqual(['biz-a']);
    expect(accessibleBusinessIds(superAdmin)).toBe(ALL_BUSINESSES);
  });
});
