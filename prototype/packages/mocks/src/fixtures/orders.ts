import type { Order, OrderType, OrderStatus } from '@uniprint/types';

const TYPES: OrderType[] = ['cex', 'office', 'goods'];
const STATUSES: OrderStatus[] = [
  'queued', 'in_production', 'in_qc', 'ready', 'delivered', 'closed',
  'designing', 'client_approval', 'in_production', 'defect_rework',
];

export const ordersFixture: Order[] = Array.from({ length: 30 }, (_, i) => ({
  id: `ord_${String(i + 1).padStart(4, '0')}`,
  number: `UNI-2026-${String(i + 1).padStart(5, '0')}`,
  // biome-ignore lint/style/noNonNullAssertion: TYPES.length === 3, index never out of bounds
  type: TYPES[i % 3]!,
  // biome-ignore lint/style/noNonNullAssertion: STATUSES is non-empty, modulo keeps index in range
  status: STATUSES[i % STATUSES.length]!,
  clientId: `cli_${String((i % 50) + 1).padStart(3, '0')}`,
  managerId: 'usr_012',
  ...(i % 3 === 0 ? { designerId: 'usr_009' } : {}),
  branchId: 'main' as const,
  title: i % 3 === 0 ? `Баннер ${3 + i % 5}×${1 + i % 3} м` :
         i % 3 === 1 ? `Визитки ${100 * (i + 1)} шт` :
         `Готовый стенд тип ${(i % 4) + 1}`,
  itemsCount: 1 + (i % 10),
  priceTotal: 5000 + i * 1500,
  costEstimate: 3000 + i * 800,
  ...(i % 3 === 1 ? { costActual: 3500 + i * 850 } : {}),
  dueDate: new Date(2026, 4, 10 + (i % 14)).toISOString(),
  createdAt: new Date(2026, 4, 1 + (i % 5)).toISOString(),
  updatedAt: new Date(2026, 4, 5 + (i % 5)).toISOString(),
}));
