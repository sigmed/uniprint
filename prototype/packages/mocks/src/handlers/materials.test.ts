import { describe, expect, test } from 'vitest';
import type { MaterialBatch } from '@uniprint/types';
import { applyFifoWriteoff } from './materials.js';

const makeBatch = (id: string, receivedAt: string, qtyRemaining: number): MaterialBatch => ({
  id, materialId: 'mat_001', receivedAt, qty: qtyRemaining, qtyRemaining, pricePerUnit: 100,
});

describe('BR-01 + BR-09 — writeoff FIFO on order', () => {
  test('BR-09: depletes oldest batch first', () => {
    const batches = [
      makeBatch('bat_new', '2026-05-10T00:00:00Z', 50),
      makeBatch('bat_old', '2026-05-01T00:00:00Z', 30),
    ];
    const { writeoffs, shortBy } = applyFifoWriteoff(batches, 20, 'ord_0001', 'usr_011');
    expect(shortBy).toBe(0);
    expect(writeoffs).toHaveLength(1);
    // biome-ignore lint/style/noNonNullAssertion: length asserted above
    expect(writeoffs[0]!.batchId).toBe('bat_old');
    // biome-ignore lint/style/noNonNullAssertion: length asserted above
    expect(writeoffs[0]!.qty).toBe(20);
    // biome-ignore lint/style/noNonNullAssertion: bat_old is in batches by construction
    expect(batches.find((b) => b.id === 'bat_old')!.qtyRemaining).toBe(10);
  });

  test('BR-09: spills to next batch when oldest exhausted', () => {
    const batches = [
      makeBatch('bat_old', '2026-05-01T00:00:00Z', 30),
      makeBatch('bat_new', '2026-05-10T00:00:00Z', 50),
    ];
    const { writeoffs, shortBy } = applyFifoWriteoff(batches, 40, 'ord_0001', 'usr_011');
    expect(shortBy).toBe(0);
    expect(writeoffs).toHaveLength(2);
    // biome-ignore lint/style/noNonNullAssertion: length asserted above
    expect(writeoffs[0]!.batchId).toBe('bat_old');
    // biome-ignore lint/style/noNonNullAssertion: length asserted above
    expect(writeoffs[0]!.qty).toBe(30);
    // biome-ignore lint/style/noNonNullAssertion: length asserted above
    expect(writeoffs[1]!.batchId).toBe('bat_new');
    // biome-ignore lint/style/noNonNullAssertion: length asserted above
    expect(writeoffs[1]!.qty).toBe(10);
  });

  test('reports shortage when stock insufficient', () => {
    const batches = [makeBatch('bat_1', '2026-05-01T00:00:00Z', 5)];
    const { shortBy } = applyFifoWriteoff(batches, 10, 'ord_0001', 'usr_011');
    expect(shortBy).toBe(5);
  });

  test('all writeoffs reference the order (BR-01)', () => {
    const batches = [makeBatch('bat_1', '2026-05-01T00:00:00Z', 100)];
    const { writeoffs } = applyFifoWriteoff(batches, 30, 'ord_0042', 'usr_011');
    expect(writeoffs.every((w) => w.orderId === 'ord_0042')).toBe(true);
  });
});
