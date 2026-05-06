import type { Order, OrderType, OrderStatus } from '@uniprint/types';

/**
 * Demo orders fixture — 8 заказов клиента ООО «Рассвет» (cli_001) точно по
 * `Docs/design/references/User.png` + manager.png. UNI-2026-00001..00008.
 *
 * Status distribution для KPI:
 *   - active (queued + in_production + designing + client_approval) = 3 orders
 *   - in_production = 2 orders
 *   - ready/delivered = 4 orders (включая «Готов» + «Выдан»)
 *
 * Plus 6 extra orders для manager-web demo (assignees различные, разные клиенты).
 * Всего 14 orders (8 client demo + 6 manager extra).
 */

interface DemoOrder {
  number: string;
  type: OrderType;
  status: OrderStatus;
  clientId: string;
  managerId: string;
  designerId?: string;
  title: string;
  metaText: string;
  itemsCount: number;
  priceTotal: number;
  dueDay: number; // day of May 2026
  createdDay: number;
}

const DEMO: DemoOrder[] = [
  // ── Client demo (8 orders for cli_001 = ООО «Рассвет») ──
  {
    number: 'UNI-2026-00001',
    type: 'cex',
    status: 'queued',
    clientId: 'cli_001',
    managerId: 'usr_012',
    designerId: 'usr_009',
    title: 'Баннер 3×1 м',
    metaText: 'люверсы, ПВХ 440 г/м²',
    itemsCount: 1,
    priceTotal: 5000,
    dueDay: 10,
    createdDay: 1,
  },
  {
    number: 'UNI-2026-00002',
    type: 'office',
    status: 'in_production',
    clientId: 'cli_001',
    managerId: 'usr_012',
    title: 'Визитки 200 шт',
    metaText: '90×50 мм · 4+4 · ламинация',
    itemsCount: 200,
    priceTotal: 6500,
    dueDay: 11,
    createdDay: 2,
  },
  {
    number: 'UNI-2026-00003',
    type: 'goods',
    status: 'in_qc',
    clientId: 'cli_001',
    managerId: 'usr_012',
    title: 'Готовый стенд тип 3',
    metaText: 'самосборный, А-формат',
    itemsCount: 3,
    priceTotal: 8000,
    dueDay: 12,
    createdDay: 3,
  },
  {
    number: 'UNI-2026-00004',
    type: 'cex',
    status: 'ready',
    clientId: 'cli_001',
    managerId: 'usr_012',
    designerId: 'usr_009',
    title: 'Баннер 6×1 м',
    metaText: 'баннерная ткань, монтажные карманы',
    itemsCount: 4,
    priceTotal: 9500,
    dueDay: 13,
    createdDay: 4,
  },
  {
    number: 'UNI-2026-00005',
    type: 'office',
    status: 'delivered',
    clientId: 'cli_001',
    managerId: 'usr_012',
    title: 'Визитки 500 шт',
    metaText: '90×50 мм · мел. 300 г',
    itemsCount: 500,
    priceTotal: 11000,
    dueDay: 14,
    createdDay: 5,
  },
  {
    number: 'UNI-2026-00006',
    type: 'goods',
    status: 'closed',
    clientId: 'cli_001',
    managerId: 'usr_012',
    title: 'Готовый стенд тип 2',
    metaText: 'самосборный',
    itemsCount: 6,
    priceTotal: 7200,
    dueDay: 15,
    createdDay: 6,
  },
  {
    number: 'UNI-2026-00007',
    type: 'cex',
    status: 'designing',
    clientId: 'cli_001',
    managerId: 'usr_012',
    designerId: 'usr_009',
    title: 'Баннер 4×1 м',
    metaText: 'ПВХ',
    itemsCount: 7,
    priceTotal: 14000,
    dueDay: 16,
    createdDay: 7,
  },
  {
    number: 'UNI-2026-00008',
    type: 'office',
    status: 'client_approval',
    clientId: 'cli_001',
    managerId: 'usr_012',
    title: 'Визитки 800 шт',
    metaText: 'мел. 250 г',
    itemsCount: 800,
    priceTotal: 15500,
    dueDay: 17,
    createdDay: 8,
  },
  // ── Manager extra (other clients, для cols-5 KPI и Kanban distribution) ──
  {
    number: 'UNI-2026-00009',
    type: 'cex',
    status: 'queued',
    clientId: 'cli_002',
    managerId: 'usr_012',
    title: 'Папка А4 с тиснением',
    metaText: '50 шт · цех',
    itemsCount: 50,
    priceTotal: 17000,
    dueDay: 18,
    createdDay: 9,
  },
  {
    number: 'UNI-2026-00010',
    type: 'cex',
    status: 'defect_rework',
    clientId: 'cli_003',
    managerId: 'usr_012',
    title: 'Баннер 7×1 м',
    metaText: 'переделка после брака',
    itemsCount: 10,
    priceTotal: 18500,
    dueDay: 19,
    createdDay: 9,
  },
  {
    number: 'UNI-2026-00011',
    type: 'office',
    status: 'in_production',
    clientId: 'cli_004',
    managerId: 'usr_012',
    title: 'Визитки 1100 шт',
    metaText: 'мел. 350 г',
    itemsCount: 1100,
    priceTotal: 20000,
    dueDay: 20,
    createdDay: 10,
  },
  {
    number: 'UNI-2026-00012',
    type: 'office',
    status: 'in_production',
    clientId: 'cli_005',
    managerId: 'usr_012',
    title: 'Каталог 24 стр',
    metaText: 'А4 · клееное',
    itemsCount: 100,
    priceTotal: 21500,
    dueDay: 21,
    createdDay: 11,
  },
  {
    number: 'UNI-2026-00013',
    type: 'goods',
    status: 'ready',
    clientId: 'cli_006',
    managerId: 'usr_012',
    title: 'Готовый стенд тип 1',
    metaText: 'роллап',
    itemsCount: 9,
    priceTotal: 17500,
    dueDay: 22,
    createdDay: 12,
  },
  {
    number: 'UNI-2026-00014',
    type: 'office',
    status: 'delivered',
    clientId: 'cli_007',
    managerId: 'usr_012',
    title: 'Визитки 1400 шт',
    metaText: '90×50 · мел. 300 г',
    itemsCount: 1400,
    priceTotal: 25000,
    dueDay: 23,
    createdDay: 13,
  },
];

export const ordersFixture: Order[] = DEMO.map((d, i) => {
  const order: Order = {
    id: `ord_${String(i + 1).padStart(4, '0')}`,
    number: d.number,
    type: d.type,
    status: d.status,
    clientId: d.clientId,
    managerId: d.managerId,
    branchId: 'main' as const,
    title: d.title,
    metaText: d.metaText,
    itemsCount: d.itemsCount,
    priceTotal: d.priceTotal,
    costEstimate: Math.floor(d.priceTotal * 0.6),
    dueDate: new Date(2026, 4, d.dueDay).toISOString(),
    createdAt: new Date(2026, 4, d.createdDay).toISOString(),
    updatedAt: new Date(2026, 4, d.createdDay + 1).toISOString(),
  };
  if (d.designerId != null) {
    order.designerId = d.designerId;
  }
  return order;
});
