import type { MaterialCatalog, MaterialBatch } from '@uniprint/types';

const CATEGORIES = ['banner', 'oracal', 'paper', 'ink', 'fastener', 'other'] as const;

export const materialsFixture: MaterialCatalog[] = Array.from({ length: 200 }, (_, i) => ({
  id: `mat_${String(i + 1).padStart(3, '0')}`,
  sku: `${CATEGORIES[i % 6]!.toUpperCase().slice(0, 3)}-${String(i + 1).padStart(3, '0')}`,
  name: i % 6 === 0 ? `Баннер ${440 + i} г/м²` :
        i % 6 === 1 ? `Оракал ${i}-${(i + 4) % 9}` :
        i % 6 === 2 ? `Бумага ${100 + i % 200} г/м²` :
        i % 6 === 3 ? `Краска CMYK ${i % 4}` :
        `Крепёж ${i}` ,
  unit: i % 6 === 0 ? 'm2' : i % 6 === 4 ? 'pcs' : 'lm',
  minStock: 10,
  category: CATEGORIES[i % 6]!,
}));

export const batchesFixture: MaterialBatch[] = materialsFixture.flatMap((m, i) => [
  {
    id: `bat_${String(i * 2 + 1).padStart(4, '0')}`,
    materialId: m.id,
    receivedAt: new Date(2026, 3, 1 + (i % 28)).toISOString(),
    qty: 100, qtyRemaining: 70,
    pricePerUnit: 100 + (i % 500),
  },
  {
    id: `bat_${String(i * 2 + 2).padStart(4, '0')}`,
    materialId: m.id,
    receivedAt: new Date(2026, 4, 1 + (i % 28)).toISOString(),
    qty: 50, qtyRemaining: 50,
    pricePerUnit: 110 + (i % 500),
  },
]);
