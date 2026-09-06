import { Controller, Get } from '@nestjs/common';
import type { HealthResponse } from '@brandcraft/types';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly health: HealthService) {}

  @Get()
  get(): Promise<HealthResponse> {
    return this.health.check();
  }

  /** Liveness probe: process is up, no dependency checks. */
  @Get('live')
  live(): { status: 'ok' } {
    return { status: 'ok' };
  }
}
