import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import type { AppConfig } from '../config/configuration';
import { QUEUE, type QueueName } from './queue.constants';

export const QUEUES = Symbol('QUEUES');
export type QueueRegistry = Record<QueueName, Queue>;

/**
 * Registers one BullMQ Queue instance per known queue name, sharing a single
 * Redis connection config. Producers inject QUEUES and pick the queue they need.
 */
@Global()
@Module({
  providers: [
    {
      provide: QUEUES,
      inject: [ConfigService],
      useFactory: (config: ConfigService): QueueRegistry => {
        const redis = config.getOrThrow<AppConfig>('app').redis;
        const connection = { host: redis.host, port: redis.port, password: redis.password };
        const entries = Object.values(QUEUE).map(
          (name) => [name, new Queue(name, { connection })] as const,
        );
        return Object.fromEntries(entries) as QueueRegistry;
      },
    },
  ],
  exports: [QUEUES],
})
export class QueueModule {}
