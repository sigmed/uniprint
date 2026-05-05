import { http, HttpResponse } from 'msw';
import type { Lead } from '@uniprint/types';

const leads: Lead[] = Array.from({ length: 12 }, (_, i) => ({
  id: `lead_${String(i + 1).padStart(3, '0')}`,
  source: i % 3 === 0 ? 'inbound' : i % 3 === 1 ? 'cold' : 'referral',
  status: ['new', 'measured', 'quoted', 'converted', 'lost'][i % 5] as Lead['status'],
  ...(i % 2 === 0 ? { measurements: { width: 3 + i, height: 1 + (i % 3), notes: 'фасад' } } : {}),
  photos: [],
  managerId: i % 2 === 0 ? 'usr_014' : 'usr_015',
  ...(i < 3 ? { resultOrderId: `ord_${String(i + 1).padStart(4, '0')}` } : {}),
  createdAt: new Date(2026, 4, 1 + i).toISOString(),
}));

export const leadHandlers = [
  http.get('/api/leads', () => HttpResponse.json({ items: leads, total: leads.length })),
  http.get('/api/leads/:id', ({ params }) => {
    const lead = leads.find((l) => l.id === params.id);
    return lead ? HttpResponse.json(lead) : new HttpResponse(null, { status: 404 });
  }),
];
