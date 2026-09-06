import type { Env } from './env.validation';

/**
 * Structured, typed view of configuration. Injected via ConfigService<AppConfig>.
 */
export interface AppConfig {
  env: Env['NODE_ENV'];
  http: {
    port: number;
    host: string;
    globalPrefix: string;
    corsOrigins: string[];
  };
  database: { url: string };
  redis: { host: string; port: number; password: string | undefined };
  jwt: {
    accessSecret: string;
    refreshSecret: string;
    accessTtl: number;
    refreshTtl: number;
  };
}

export function buildConfig(env: Env): AppConfig {
  return {
    env: env.NODE_ENV,
    http: {
      port: env.API_PORT,
      host: env.API_HOST,
      globalPrefix: env.API_GLOBAL_PREFIX,
      corsOrigins: env.CORS_ORIGINS.split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    },
    database: { url: env.DATABASE_URL },
    redis: {
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      password: env.REDIS_PASSWORD || undefined,
    },
    jwt: {
      accessSecret: env.JWT_ACCESS_SECRET,
      refreshSecret: env.JWT_REFRESH_SECRET,
      accessTtl: env.JWT_ACCESS_TTL,
      refreshTtl: env.JWT_REFRESH_TTL,
    },
  };
}
