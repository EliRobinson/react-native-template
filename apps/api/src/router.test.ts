import type { User } from '@repo/api-contracts';

import type { Context, UserStore } from './context';
import { appRouter } from './router';

const sampleUser: User = {
  id: '00000000-0000-4000-8000-000000000001',
  email: 'a@example.com',
  name: 'Ada',
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
};

function createCaller(users: UserStore) {
  const ctx: Context = { userId: null, users };
  return appRouter.createCaller(ctx);
}

describe('appRouter', () => {
  it('health check reports ok', async () => {
    const caller = createCaller({
      list: jest.fn(),
      create: jest.fn(),
    });

    await expect(caller.health()).resolves.toMatchObject({ ok: true });
  });

  it.each([
    {
      name: 'lists users from the user store',
      run: async (users: UserStore) => createCaller(users).users.list(),
      users: {
        list: jest.fn().mockResolvedValue([sampleUser]),
        create: jest.fn(),
      },
      expected: [sampleUser],
      assertStore: (users: UserStore) => {
        expect(users.list).toHaveBeenCalledTimes(1);
        expect(users.create).not.toHaveBeenCalled();
      },
    },
    {
      name: 'creates a user through the user store',
      run: async (users: UserStore) =>
        createCaller(users).users.create({ email: sampleUser.email, name: sampleUser.name }),
      users: {
        list: jest.fn(),
        create: jest.fn().mockResolvedValue(sampleUser),
      },
      expected: sampleUser,
      assertStore: (users: UserStore) => {
        expect(users.create).toHaveBeenCalledWith({
          email: sampleUser.email,
          name: sampleUser.name,
        });
        expect(users.list).not.toHaveBeenCalled();
      },
    },
  ])('$name', async ({ run, users, expected, assertStore }) => {
    await expect(run(users)).resolves.toEqual(expected);
    assertStore(users);
  });
});
