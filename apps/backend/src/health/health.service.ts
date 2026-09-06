import { Inject, Injectable } from '@nestjs/common';
import type { Redis } from 'ioredis';
import type { HealthResponse } from '@brandcraft/types';
import { PrismaService } from '../prisma/prisma.service';
import { REDIS } from '../redis/redis.module';

const startedAt = Date.now();

@Injectable()
export class HealthService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(REDIS) private readonly redis: Redis,
  ) {}

  async check(): Promise<HealthResponse> {
    const [db, cache] = await Promise.all([this.checkDb(), this.checkRedis()]);
    const checks = { database: db, redis: cache };
    const allUp = Object.values(checks).every((s) => s === 'up');

    return {
      status: allUp ? 'ok' : 'degraded',
      uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
      version: process.env.npm_package_version ?? '0.1.0',
      checks,
    };
  }

  private async checkDb(): Promise<'up' | 'down'> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return 'up';
    } catch {
      return 'down';
    }
  }

  private async checkRedis(): Promise<'up' | 'down'> {
    try {
      const pong = await this.redis.ping();
      return pong === 'PONG' ? 'up' : 'down';
    } catch {
      return 'down';
    }
  }
}
