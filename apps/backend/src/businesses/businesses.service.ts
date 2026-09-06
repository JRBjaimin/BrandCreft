import { Injectable, NotFoundException } from '@nestjs/common';
import type { UpdateBusinessSettingsInput } from '@brandcraft/validation';
import type { AuthPrincipal } from '../auth/auth.types';
import { PrismaService } from '../prisma/prisma.service';
import { accessibleBusinessIds, ALL_BUSINESSES } from '../tenancy/tenant-access';
import { TenantPrismaService } from '../tenancy/tenant-prisma.service';

@Injectable()
export class BusinessesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantPrisma: TenantPrismaService,
  ) {}

  /** Businesses the caller may see. Self-scoping: no TenantGuard needed. */
  listForPrincipal(principal: AuthPrincipal) {
    const ids = accessibleBusinessIds(principal);
    return this.prisma.business.findMany({
      where: ids === ALL_BUSINESSES ? {} : { id: { in: ids } },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, slug: true, status: true, categoryId: true },
    });
  }

  /** Single business. `businessId` has already been access-checked by TenantGuard. */
  async getById(businessId: string) {
    const business = await this.prisma.business.findFirst({
      where: { id: businessId },
      include: { settings: true, category: { select: { key: true, label: true } } },
    });
    if (!business) throw new NotFoundException('Business not found');
    return business;
  }

  /** Members of the business, read through the tenant-bound client. */
  listMembers(businessId: string) {
    return this.tenantPrisma.forBusiness(businessId).businessUser.findMany({
      // businessId filter is injected by the tenant-scope extension
      include: { user: { select: { id: true, email: true, name: true, isActive: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  /** Create-or-update settings, written through the tenant-bound client. */
  updateSettings(businessId: string, input: UpdateBusinessSettingsInput) {
    const data = {
      brandColors: input.brandColors ?? undefined,
      brandTone: input.brandTone ?? undefined,
      timezone: input.timezone ?? undefined,
      locale: input.locale ?? undefined,
    };
    return this.tenantPrisma.forBusiness(businessId).businessSetting.upsert({
      where: { businessId },
      // The tenant-scope extension also stamps businessId; passing it here keeps
      // the Prisma types happy and makes the scoping explicit at the call site.
      create: { businessId, ...data },
      update: data,
    });
  }
}
