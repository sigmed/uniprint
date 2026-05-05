'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import type { Route } from 'next';
import { Button, Card, CardContent, CardHeader, CardTitle, OrderStatusBadge } from '@uniprint/ui';
import type { Order } from '@uniprint/types';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null | 'not-found'>(null);
  useEffect(() => {
    fetch(`/api/orders/${id}`).then(async (r) => {
      if (r.status === 404) { setOrder('not-found'); return; }
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setOrder(await r.json());
    }).catch(() => setOrder('not-found'));
  }, [id]);
  if (order === null) return <div className="p-12 text-center">Загрузка…</div>;
  if (order === 'not-found') {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12 text-center">
        <h1 className="text-2xl font-bold">Заказ не найден</h1>
        <p className="mt-2 text-[var(--color-fg-muted)]">
          Возможно, ссылка устарела или заказ был удалён.
        </p>
        <Link href={'/orders' as Route<'/orders'>}>
          <Button variant="outline" className="mt-6">К списку заказов</Button>
        </Link>
      </main>
    );
  }
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{order.number}</h1>
        <OrderStatusBadge status={order.status} />
      </div>
      <p className="mt-2 text-[var(--color-fg-muted)]">{order.title}</p>

      <Card className="mt-6">
        <CardHeader><CardTitle>Сводка</CardTitle></CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <dt className="text-[var(--color-fg-muted)]">Тип заказа</dt>
            <dd>{order.type === 'cex' ? 'Цех (наружная реклама)' : order.type === 'office' ? 'Офис-полиграфия' : 'Готовый товар'}</dd>
            <dt className="text-[var(--color-fg-muted)]">Количество</dt>
            <dd>{order.itemsCount} шт</dd>
            <dt className="text-[var(--color-fg-muted)]">Сумма</dt>
            <dd>{order.priceTotal.toLocaleString('ru-RU')} ₽</dd>
            <dt className="text-[var(--color-fg-muted)]">Срок</dt>
            <dd>{order.dueDate ? new Date(order.dueDate).toLocaleDateString('ru-RU') : '—'}</dd>
            <dt className="text-[var(--color-fg-muted)]">Создан</dt>
            <dd>{new Date(order.createdAt).toLocaleDateString('ru-RU')}</dd>
          </dl>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader><CardTitle>Документы</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-[var(--color-fg-muted)]">
            PDF-документы (счёт / договор-оферта / акт / ТТН) будут доступны после
            подтверждения заказа. <em>Q13 ✅: простая генерация PDF.</em>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
