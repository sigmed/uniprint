import { http, HttpResponse } from 'msw';
import { usersFixture } from '../fixtures/users';

export const userHandlers = [
  http.get('/api/users', ({ request }) => {
    const role = new URL(request.url).searchParams.get('role');
    const users = role ? usersFixture.filter((u) => u.role === role) : usersFixture;
    return HttpResponse.json({ items: users, total: users.length });
  }),
  // biome-ignore lint/style/noNonNullAssertion: usersFixture is non-empty by construction
  http.get('/api/users/me', () => HttpResponse.json(usersFixture[0]!)),
];
