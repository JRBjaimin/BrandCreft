import { Module } from '@nestjs/common';
import { BusinessesController } from './businesses.controller';
import { BusinessesService } from './businesses.service';

/**
 * Phase 2 demonstrator: every business-scoped route here is protected by
 * TenantGuard and reads/writes through TenantPrismaService, and the isolation
 * e2e suite exercises exactly these endpoints. Phase 4 grows this module into
 * full business management.
 */
@Module({
  controllers: [BusinessesController],
  providers: [BusinessesService],
})
export class BusinessesModule {}
