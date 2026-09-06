import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DevAuthMiddleware } from './dev-auth.middleware';

/**
 * Phase 2 authentication seam.
 *
 * Only the dev-header resolver is registered, and only outside production.
 * Phase 3 adds the real JWT middleware here (and can keep DevAuthMiddleware for
 * local/e2e use behind the same NODE_ENV check).
 */
@Module({
  providers: [DevAuthMiddleware],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    if (process.env.NODE_ENV !== 'production') {
      consumer.apply(DevAuthMiddleware).forRoutes('*');
    }
  }
}
