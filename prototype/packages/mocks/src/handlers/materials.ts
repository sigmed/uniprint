import { http, HttpResponse } from 'msw';
import type { MaterialBatch, MaterialWriteoff } from '@uniprint/types';
import { materialsFixture, batchesFixture } from '../fixtures/materials.js';

const materials = [...materialsFixture];
const batches: MaterialBatch[] = [...batchesFixture];
const writeoffs: MaterialWriteoff[] = [];

export const materialHandlers = [
  http.get('/api/materials', () => HttpResponse.json({ items: materials, total: materials.length })),

  http.get('/api/materials/:id/stock', ({ params }) => {
    const matBatches = batches
      .filter((b) => b.materialId === params.id && b.qtyRemaining > 0)
      .sort((a, b) => a.receivedAt.localeCompare(b.receivedAt)); // FIFO
    const total = matBatches.reduce((s, b) => s + b.qtyRemaining, 0);
    return HttpResponse.json({ total, batches: matBatches });
  }),

  http.post('/api/writeoffs', async ({ request }) => {
    const body = (await request.json()) as {
      materialId: string; orderId: string; qty: number; byUserId: string;
    };
    // BR-01 — orderId обязателен
    if (!body.orderId) {
      return HttpResponse.json({ error: 'BR-01 — orderId обязателен, материалы списываются ТОЛЬКО на заказ' }, { status: 400 });
    }
    // BR-09 — FIFO по партиям
    const fifo = batches
      .filter((b) => b.materialId === body.materialId && b.qtyRemaining > 0)
      .sort((a, b) => a.receivedAt.localeCompare(b.receivedAt));
    let remaining = body.qty;
    const created: MaterialWriteoff[] = [];
    for (const batch of fifo) {
      if (remaining <= 0) break;
      const take = Math.min(remaining, batch.qtyRemaining);
      batch.qtyRemaining -= take;
      remaining -= take;
      const w: MaterialWriteoff = {
        id: `wo_${String(writeoffs.length + created.length + 1).padStart(5, '0')}`,
        materialId: body.materialId,
        batchId: batch.id,
        orderId: body.orderId,
        qty: take,
        byUserId: body.byUserId,
        at: new Date().toISOString(),
        reason: 'production',
      };
      created.push(w);
    }
    if (remaining > 0) {
      return HttpResponse.json({ error: 'Недостаточно остатков на складе', shortBy: remaining }, { status: 409 });
    }
    writeoffs.push(...created);
    return HttpResponse.json({ writeoffs: created }, { status: 201 });
  }),
];
