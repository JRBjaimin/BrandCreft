import { Test } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthService,
          useValue: {
            check: jest.fn().mockResolvedValue({
              status: 'ok',
              uptimeSeconds: 1,
              version: '0.1.0',
              checks: { database: 'up', redis: 'up' },
            }),
          },
        },
      ],
    }).compile();

    controller = moduleRef.get(HealthController);
  });

  it('liveness returns ok', () => {
    expect(controller.live()).toEqual({ status: 'ok' });
  });

  it('readiness aggregates dependency checks', async () => {
    await expect(controller.get()).resolves.toMatchObject({
      status: 'ok',
      checks: { database: 'up', redis: 'up' },
    });
  });
});
