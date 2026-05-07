import { http, HttpResponse } from 'msw';
import type { Client } from '@uniprint/types';
import { clientsFixture } from '../fixtures/clients';

const clients: Client[] = [...clientsFixture];

export const normalizePhone = (raw: string): string => {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('8')) return `+7${digits.slice(1)}`;
  if (digits.length === 11 && digits.startsWith('7')) return `+${digits}`;
  if (digits.length === 10) return `+7${digits}`;
  return raw;
};

export const clientHandlers = [
  http.get('/api/clients', ({ request }) => {
    const q = new URL(request.url).searchParams.get('q')?.toLowerCase() ?? '';
    const filtered = q
      ? clients.filter((c) =>
          c.name.toLowerCase().includes(q) || c.phone.includes(q),
        )
      : clients;
    return HttpResponse.json({ items: filtered.slice(0, 50), total: filtered.length });
  }),

  http.post('/api/clients', async ({ request }) => {
    const body = (await request.json()) as Partial<Client>;
    if (!body.phone || !body.name) {
      return HttpResponse.json({ error: 'phone, name required' }, { status: 400 });
    }
    const phone = normalizePhone(body.phone);
    // BR-02 — антидублирование по телефону
    const existing = clients.find((c) => c.phone === phone);
    if (existing) {
      return HttpResponse.json(
        { error: 'BR-02 — клиент с таким телефоном уже существует', existing },
        { status: 409 },
      );
    }
    const created: Client = {
      id: `cli_${String(clients.length + 1).padStart(3, '0')}`,
      type: body.type ?? 'individual',
      name: body.name,
      phone,
      ...(body.email !== undefined ? { email: body.email } : {}),
      ...(body.inn !== undefined ? { inn: body.inn } : {}),
      ...(body.ogrn !== undefined ? { ogrn: body.ogrn } : {}),
      ...(body.address !== undefined ? { address: body.address } : {}),
      createdAt: new Date().toISOString(),
    };
    clients.push(created);
    return HttpResponse.json(created, { status: 201 });
  }),
];
