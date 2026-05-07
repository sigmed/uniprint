import { http, HttpResponse } from 'msw';
import type { MaterialBatch, MaterialWriteoff } from '@uniprint/types';
import { materialsFixture, batchesFixture } from '../fixtures/materials';

const materials = [...materialsFixture];
const batches: MaterialBatch[] = [...batchesFixture];
const writeoffs: MaterialWriteoff[] = [];

/**
 * BR-01 + BR-09: pure FIFO writeoff helper.
 * Mutates qtyRemaining on each batch in-place (mirrors DB behaviour in the handler).
 * Returns created writeoff records and shortBy (0 = fully satisfied).
 */
export const applyFifoWriteoff = (
  allBatches: MaterialBatch[],
  qty: number,
  orderId: string,
  byUserId: string,
): { writeoffs: MaterialWriteoff[]; shortBy: number } => {
  // BR-09 — sort by receivedAt ascending (oldest first)
  // Shallow-copy the array for stable sort; batch objects are shared refs so mutations propagate
  const fifo = allBatches
    .filter((b) => b.qtyRemaining > 0)
    .sort((a, b) => a.receivedAt.localeCompare(b.receivedAt));

  let remaining = qty;
  const created: MaterialWriteoff[] = [];

  for (const batch of fifo) {
    if (remaining <= 0) break;
    const take = Math.min(remaining, batch.qtyRemaining);
    // Mutate in-place — same reference as in caller's array (handler's batches store)
    batch.qtyRemaining -= take;
    remaining -= take;
    created.push({
      id: `wo_${String(Date.now() + created.length).slice(-5)}`,
      materialId: batch.materialId,
      batchId: batch.id,
      orderId,
      qty: take,
      byUserId,
      at: new Date().toISOString(),
      reason: 'production',
    });
  }

  return { writeoffs: created, shortBy: remaining };
};

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
    // BR-09 — FIFO по партиям (delegates to pure helper)
    const matBatches = batches.filter((b) => b.materialId === body.materialId);
    const { writeoffs: created, shortBy } = applyFifoWriteoff(
      matBatches,
      body.qty,
      body.orderId,
      body.byUserId,
    );
    if (shortBy > 0) {
      return HttpResponse.json({ error: 'Недостаточно остатков на складе', shortBy }, { status: 409 });
    }
    // Assign stable IDs based on global writeoffs store length
    for (const w of created) {
      w.id = `wo_${String(writeoffs.length + 1).padStart(5, '0')}`;
      writeoffs.push(w);
    }
    return HttpResponse.json({ writeoffs: created }, { status: 201 });
  }),
];
