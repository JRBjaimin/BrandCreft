import { BadRequestException, PipeTransform } from '@nestjs/common';
import type { ZodSchema } from 'zod';

/**
 * Validates a handler argument against a Zod schema. Pair with the shared
 * schemas in @brandcraft/validation so the API and the frontends enforce the
 * same contract.
 *
 *   @Body(new ZodValidationPipe(updateBusinessSettingsSchema)) body: UpdateBusinessSettingsInput
 */
export class ZodValidationPipe<T> implements PipeTransform<unknown, T> {
  constructor(private readonly schema: ZodSchema<T>) {}

  transform(value: unknown): T {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw new BadRequestException({
        error: 'ValidationError',
        message: result.error.issues
          .map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`)
          .join('; '),
      });
    }
    return result.data;
  }
}
