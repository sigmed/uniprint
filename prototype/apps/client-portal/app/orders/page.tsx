'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  OrderStatusBadge,
  PageHeader,
  EmptyState,
  Skeleton,
} from '@uniprint/ui';
import { Package, ChevronRight } from 'lucide-react';
import type { Order, OrderType } from '@uniprint/types';

const ORDER_TYPE_LABELS: Record<OrderType, string> = {
  cex: 'Цех',
  office: 'Офис',
  goods: 'Товар',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/orders')
      .then((r) => r.json())
      .then((d) => { setOrders(d.items ?? []); setLoading(false); });
  }, []);

  return (
    <div className="py-6 md:py-8">
      <PageHeader
        title="Мои заказы"
        description="Все ваши заказы — статус, сроки и суммы."
        border={false}
        className="px-0 pb-6"
      />

      <Card>
        <CardHeader>
          <CardTitle>Заказы</CardTitle>
          <span className="text-[11px] font-semibold text-[var(--color-ink-3)]">
            {loading ? '…' : `${orders.length} шт`}
          </span>
        </CardHeader>

        {loading ? (
          <CardContent><Skeleton variant="text" lines={6} /></CardContent>
        ) : orders.length === 0 ? (
          <CardContent>
            <EmptyState
              icon={<Package className="h-6 w-6" />}
              title="Заказов пока нет"
              description="Создайте первый заказ, чтобы он появился здесь."
            />
          </CardContent>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  {['№', 'Заказ', 'Статус', 'Срок', 'Сумма', ''].map((col) => (
                    <th
                      key={col}
                      className="border-b border-[var(--color-line)] bg-[var(--color-surface-3)] px-[22px] py-[11px] text-left text-[10.5px] font-semibold uppercase tracking-[.08em] text-[var(--color-ink-3)]"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr
                    key={o.id}
                    className="border-b border-[var(--color-line)] last:border-none hover:bg-[var(--color-surface-3)]"
                  >
                    <td className="px-[22px] py-[13px]">
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '12px',
                          color: 'var(--color-ink-2)',
                          fontWeight: 500,
                        }}
                      >
                        {o.number}
                      </span>
                    </td>
                    <td className="px-[22px] py-[13px]">
                      <div className="font-semibold text-[var(--color-ink)]">{o.title}</div>
                      <div className="mt-0.5 text-xs text-[var(--color-ink-3)]">
                        {ORDER_TYPE_LABELS[o.type]} · {o.itemsCount} шт
                      </div>
                    </td>
                    <td className="px-[22px] py-[13px]">
                      <OrderStatusBadge status={o.status} />
                    </td>
                    <td className="px-[22px] py-[13px] text-[var(--color-ink-3)]">
                      {o.dueDate ? new Date(o.dueDate).toLocaleDateString('ru-RU') : '—'}
                    </td>
                    <td className="px-[22px] py-[13px]">
                      <span
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontWeight: 500,
                          fontSize: '14.5px',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {o.priceTotal.toLocaleString('ru-RU')} ₽
                      </span>
                    </td>
                    <td className="px-[22px] py-[13px]">
                      <Link href={`/orders/${o.id}` as `/orders/${string}`}>
                        <button
                          type="button"
                          aria-label="Открыть заказ"
                          className="grid h-7 w-7 cursor-pointer place-items-center rounded-md text-[var(--color-ink-3)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
