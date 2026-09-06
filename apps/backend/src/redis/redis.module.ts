import { Global, Module, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { Redis } from 'ioredis';
import type { AppConfig } from '../config/configuration';

export const REDIS = Symbol('REDIS');

@Global()
@Module({
  providers: [
    {
      provide: REDIS,
      inject: [ConfigService],
      useFactory: (config: ConfigService): Redis => {
        const redis = config.getOrThrow<AppConfig>('app').redis;
        return new Redis({
          host: redis.host,
          port: redis.port,
          password: redis.password,
          maxRetriesPerRequest: null,
          lazyConnect: false,
        });
      },
    },
  ],
  exports: [REDIS],
})
export class RedisModule implements OnApplicationShutdown {
  constructor(private readonly moduleRef: ModuleRef) {}

  async onApplicationShutdown(): Promise<void> {
    const client = this.moduleRef.get<Redis>(REDIS, { strict: false });
    await client?.quit();
  }
}
