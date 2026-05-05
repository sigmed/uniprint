'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { Button, Card, CardContent, CardHeader, CardTitle, OrderStatusBadge } from '@uniprint/ui';
import type { Order } from '@uniprint/types';

export default function HomePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => {
    fetch('/api/orders').then((r) => r.json()).then((d) => setOrders(d.items.slice(0, 5)));
  }, []);
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold">Здравствуйте 👋</h1>
      <p className="mt-2 text-[var(--color-fg-muted)]">
        Кабинет клиента UniPrint — оформляйте заказы, отслеживайте статус, получайте документы.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href={'/orders/new' as Route<'/orders/new'>}><Button size="lg">Создать заказ</Button></Link>
        <Link href={'/orders' as Route<'/orders'>}><Button variant="outline" size="lg">Все заказы</Button></Link>
      </div>

      <h2 className="mt-12 text-xl font-semibold">Последние заказы</h2>
      <div className="mt-4 grid gap-3">
        {orders.map((o) => (
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
        ))}
      </div>
    </main>
  );
}
