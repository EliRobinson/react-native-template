import { appRouter } from '@repo/api-contracts';

describe('appRouter', () => {
  it('health check reports ok', async () => {
    const caller = appRouter.createCaller({ userId: null });

    const result = await caller.health();

    expect(result.ok).toBe(true);
  });
});
