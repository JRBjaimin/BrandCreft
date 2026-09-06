import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import {
  updateBusinessSettingsSchema,
  type UpdateBusinessSettingsInput,
} from '@brandcraft/validation';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthPrincipal } from '../auth/auth.types';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { BusinessId } from '../tenancy/business-id.decorator';
import { TenantGuard } from '../tenancy/tenant.guard';
import { BusinessesService } from './businesses.service';

@Controller('businesses')
export class BusinessesController {
  constructor(private readonly businesses: BusinessesService) {}

  /** Self-scoping list — returns only what the caller may see. */
  @Get()
  list(@CurrentUser() user: AuthPrincipal) {
    return this.businesses.listForPrincipal(user);
  }

  @Get(':businessId')
  @UseGuards(TenantGuard)
  get(@BusinessId() businessId: string) {
    return this.businesses.getById(businessId);
  }

  @Get(':businessId/members')
  @UseGuards(TenantGuard)
  members(@BusinessId() businessId: string) {
    return this.businesses.listMembers(businessId);
  }

  @Patch(':businessId/settings')
  @UseGuards(TenantGuard)
  updateSettings(
    @BusinessId() businessId: string,
    @Body(new ZodValidationPipe(updateBusinessSettingsSchema))
    body: UpdateBusinessSettingsInput,
  ) {
    return this.businesses.updateSettings(businessId, body);
  }
}
