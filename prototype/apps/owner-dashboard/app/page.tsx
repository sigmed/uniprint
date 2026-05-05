'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@uniprint/ui';
import type { Order } from '@uniprint/types';

export default function OwnerDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => { fetch('/api/orders').then((r) => r.json()).then((d) => setOrders(d.items)); }, []);

  const total = orders.length;
  const inProduction = orders.filter((o) => o.status === 'in_production').length;
  const delivered = orders.filter((o) => o.status === 'delivered' || o.status === 'closed').length;
  const defects = orders.filter((o) => o.status === 'defect_rework').length;
  const revenue = orders.filter((o) => ['delivered', 'closed'].includes(o.status))
    .reduce((s, o) => s + o.priceTotal, 0);
  const costActual = orders.filter((o) => o.costActual).reduce((s, o) => s + (o.costActual ?? 0), 0);
  const profit = revenue - costActual;

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="text-3xl font-bold">Дашборд учредителя</h1>
      <p className="mt-1 text-sm text-[var(--color-fg-muted)]">Данные за период (mock).</p>

      <div className="mt-6 grid grid-cols-4 gap-4">
        <Card><CardHeader><CardTitle>Заказов</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{total}</CardContent></Card>
        <Card><CardHeader><CardTitle>В производстве</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{inProduction}</CardContent></Card>
        <Card><CardHeader><CardTitle>Выдано</CardTitle></CardHeader><CardContent className="text-3xl font-bold text-[var(--color-success)]">{delivered}</CardContent></Card>
        <Card><CardHeader><CardTitle>Брак</CardTitle></CardHeader><CardContent className="text-3xl font-bold text-[var(--color-danger)]">{defects}</CardContent></Card>
      </div>

      <h2 className="mt-12 text-2xl font-semibold">P&L</h2>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <Card><CardHeader><CardTitle>Выручка</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{revenue.toLocaleString('ru-RU')} ₽</CardContent></Card>
        <Card><CardHeader><CardTitle>Себестоимость</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{costActual.toLocaleString('ru-RU')} ₽</CardContent></Card>
        <Card><CardHeader><CardTitle>Прибыль</CardTitle></CardHeader><CardContent className={`text-2xl font-bold ${profit >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>{profit.toLocaleString('ru-RU')} ₽</CardContent></Card>
      </div>

      <h2 className="mt-12 text-2xl font-semibold">Доходимость по типам</h2>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {(['cex', 'office', 'goods'] as const).map((t) => {
          const cnt = orders.filter((o) => o.type === t).length;
          const sum = orders.filter((o) => o.type === t).reduce((s, o) => s + o.priceTotal, 0);
          return (
            <Card key={t}>
              <CardHeader><CardTitle>{t === 'cex' ? 'Цех (наружка)' : t === 'office' ? 'Офис-полиграфия' : 'Готовый товар'}</CardTitle></CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cnt} шт</div>
                <div className="text-sm text-[var(--color-fg-muted)]">{sum.toLocaleString('ru-RU')} ₽</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
