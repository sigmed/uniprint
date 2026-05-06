'use client';
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  OrderStatusBadge,
  PageHeader,
  EmptyState,
  Skeleton,
} from '@uniprint/ui';
import { Inbox } from 'lucide-react';
import type { Order, OrderType } from '@uniprint/types';

const ORDER_TYPE_LABELS: Record<OrderType, string> = {
  cex: 'Цех',
  office: 'Офис',
  goods: 'Товар',
};

type FilterType = OrderType | 'all';

const FILTER_OPTIONS: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'cex', label: 'Цех' },
  { value: 'office', label: 'Офис' },
  { value: 'goods', label: 'Товар' },
];

export default function OrdersListPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const url = filter === 'all' ? '/api/orders' : `/api/orders?type=${filter}`;
    fetch(url)
      .then((r) => r.json())
      .then((d) => { setOrders(d.items ?? []); setLoading(false); });
  }, [filter]);

  return (
    <div className="py-6 md:py-8">
      <PageHeader
        title="Заказы"
        description="Все заказы с фильтром по типу (BR-07 — три типа с разными статус-машинами)."
        border={false}
        className="px-0 pb-6"
      />

      {/* Filter pills */}
      <div className="mb-4 flex flex-wrap gap-2">
        {FILTER_OPTIONS.map((f) => (
          <Button
            key={f.value}
            size="sm"
            variant={filter === f.value ? 'brand' : 'outline'}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {filter === 'all' ? 'Все заказы' : `Заказы: ${ORDER_TYPE_LABELS[filter as OrderType]}`}
          </CardTitle>
          <span className="text-[11px] font-semibold text-[var(--color-ink-3)]">
            {loading ? '…' : `${orders.length} шт`}
          </span>
        </CardHeader>

        {loading ? (
          <CardContent><Skeleton variant="text" lines={6} /></CardContent>
        ) : orders.length === 0 ? (
          <CardContent>
            <EmptyState
              icon={<Inbox className="h-6 w-6" />}
              title="Заказов нет"
              description="Попробуйте другой фильтр или создайте новый заказ."
            />
          </CardContent>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  {['№', 'Заказ', 'Тип (BR-07)', 'Статус', 'Срок', 'Сумма'].map((col) => (
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
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-ink-2)', fontWeight: 500 }}>
                        {o.number}
                      </span>
                    </td>
                    <td className="px-[22px] py-[13px]">
                      <div className="font-semibold text-[var(--color-ink)]">{o.title}</div>
                      <div className="mt-0.5 text-xs text-[var(--color-ink-3)]">{o.itemsCount} шт</div>
                    </td>
                    <td className="px-[22px] py-[13px]">
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', color: 'var(--color-ink-2)' }}>
                        {ORDER_TYPE_LABELS[o.type]}
                      </span>
                    </td>
                    <td className="px-[22px] py-[13px]">
                      <OrderStatusBadge status={o.status} />
                    </td>
                    <td className="px-[22px] py-[13px] text-[var(--color-ink-3)]">
                      {o.dueDate ? new Date(o.dueDate).toLocaleDateString('ru-RU') : '—'}
                    </td>
                    <td className="px-[22px] py-[13px]">
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '14.5px', letterSpacing: '-0.01em' }}>
                        {o.priceTotal.toLocaleString('ru-RU')} ₽
                      </span>
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
