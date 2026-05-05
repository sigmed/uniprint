'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, OrderStatusBadge } from '@uniprint/ui';
import type { Order } from '@uniprint/types';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => {
    fetch('/api/orders').then((r) => r.json()).then((d) => setOrders(d.items));
  }, []);
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-2xl font-bold">Все заказы</h1>
      <div className="mt-6 grid gap-3">
        {orders.map((o) => (
          <Link key={o.id} href={`/orders/${o.id}` as `/orders/${string}`}>
            <Card className="transition hover:border-[var(--color-primary)]">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <div className="font-semibold">{o.number} — {o.title}</div>
                  <div className="text-sm text-[var(--color-fg-muted)]">
                    {o.itemsCount} шт · {o.priceTotal.toLocaleString('ru-RU')} ₽
                  </div>
                </div>
                <OrderStatusBadge status={o.status} />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
