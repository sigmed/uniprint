'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { Button, Card, CardContent, CardHeader, CardTitle, OrderStatusBadge, PageHeader, EmptyState, Skeleton } from '@uniprint/ui';
import { Package } from 'lucide-react';
import type { Order } from '@uniprint/types';

export default function HomePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/orders')
      .then((r) => r.json())
      .then((d) => { setOrders(d.items.slice(0, 5)); setLoading(false); });
  }, []);

  return (
    <div className="mx-auto max-w-5xl py-8">
      <PageHeader
        title="Кабинет клиента"
        description="Оформляйте заказы, отслеживайте статус, получайте документы."
      />
      <div className="mt-6 flex gap-3">
        <Link href={'/orders/new' as Route<'/orders/new'>}><Button size="lg">Создать заказ</Button></Link>
        <Link href={'/orders' as Route<'/orders'>}><Button variant="outline" size="lg">Все заказы</Button></Link>
      </div>

      <h2 className="mt-12 text-xl font-semibold">Последние заказы</h2>
      <div className="mt-4 grid gap-3">
        {loading ? (
          <Skeleton variant="text" lines={5} />
        ) : orders.length === 0 ? (
          <EmptyState
            icon={<Package className="h-6 w-6" />}
            title="Заказов пока нет"
            description="Создайте первый заказ, чтобы он появился здесь."
          />
        ) : (
          orders.map((o) => (
            <Card key={o.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{o.number} — {o.title}</CardTitle>
                  <OrderStatusBadge status={o.status} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6 text-sm text-[var(--color-fg-muted)]">
                  <span>Сумма: <strong>{o.priceTotal.toLocaleString('ru-RU')} ₽</strong></span>
                  <span>Срок: {o.dueDate ? new Date(o.dueDate).toLocaleDateString('ru-RU') : '—'}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
