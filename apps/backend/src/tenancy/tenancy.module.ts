import { Global, Module } from '@nestjs/common';
import { TenantGuard } from './tenant.guard';
import { TenantPrismaService } from './tenant-prisma.service';

/**
 * Tenant isolation primitives shared across every feature module:
 * - TenantGuard: proves the caller may touch the target business
 * - TenantPrismaService: hands back a business-bound Prisma client
 *
 * See tenant-access.ts for the pure membership helpers used by list endpoints.
 */
@Global()
@Module({
  providers: [TenantGuard, TenantPrismaService],
  exports: [TenantGuard, TenantPrismaService],
})
export class TenancyModule {}
