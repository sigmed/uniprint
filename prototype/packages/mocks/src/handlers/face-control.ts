import { http, HttpResponse } from 'msw';
import { faceEventsFixture } from '../fixtures/face-events.js';

export const faceControlHandlers = [
  http.get('/api/face-control/events', ({ request }) => {
    const userId = new URL(request.url).searchParams.get('userId');
    const events = userId
      ? faceEventsFixture.filter((e) => e.userId === userId)
      : faceEventsFixture;
    return HttpResponse.json({ items: events.slice(-50), total: events.length });
  }),
  http.post('/api/face-control/login', async ({ request }) => {
    const { userId } = (await request.json()) as { userId: string };
    return HttpResponse.json({
      ok: true,
      userId,
      eventId: `fce_mock_${Date.now()}`,
      at: new Date().toISOString(),
      message: 'Mock Face Control: вход зафиксирован (BR-21 — биометрическое согласие предполагается)',
    });
  }),
];
