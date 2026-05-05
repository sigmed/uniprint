'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, Button, OrderStatusBadge, PageHeader } from '@uniprint/ui';
import type { Order, OrderType } from '@uniprint/types';

export default function OrdersListPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<OrderType | 'all'>('all');
  useEffect(() => {
    const url = filter === 'all' ? '/api/orders' : `/api/orders?type=${filter}`;
    fetch(url).then((r) => r.json()).then((d) => setOrders(d.items));
  }, [filter]);
  return (
    <div className="mx-auto max-w-5xl py-8">
      <PageHeader title="Заказы" />
      <div className="mt-4 flex gap-2">
        {(['all', 'cex', 'office', 'goods'] as const).map((f) => (
          <Button key={f} size="sm" variant={filter === f ? 'brand' : 'outline'} onClick={() => setFilter(f)}>
            {f === 'all' ? 'Все' : f === 'cex' ? 'Цех' : f === 'office' ? 'Офис' : 'Товар'}
          </Button>
        ))}
      </div>
      <div className="mt-6 grid gap-2">
        {orders.map((o) => (
          <Card key={o.id}><CardContent className="flex justify-between p-4">
            <div>
              <div className="font-semibold">{o.number} — {o.title}</div>
              <div className="text-sm text-[var(--color-fg-muted)]">{o.priceTotal.toLocaleString('ru-RU')} ₽</div>
            </div>
            <OrderStatusBadge status={o.status} />
          </CardContent></Card>
        ))}
      </div>
    </div>
  );
}
