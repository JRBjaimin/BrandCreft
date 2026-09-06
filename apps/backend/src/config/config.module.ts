import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { buildConfig } from './configuration';
import { validateEnv } from './env.validation';

/**
 * Wraps @nestjs/config: validates process.env with zod on boot and exposes the
 * structured AppConfig under the `app` namespace.
 */
@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      // Root .env is the single source of truth for the monorepo.
      envFilePath: ['../../.env', '.env'],
      validate: (raw) => {
        const env = validateEnv(raw);
        return { ...env, app: buildConfig(env) };
      },
    }),
  ],
})
export class ConfigModule {}
