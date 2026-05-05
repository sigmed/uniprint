'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle, OrderStatusBadge } from '@uniprint/ui';
import type { Order, Lead } from '@uniprint/types';

export default function ManagerDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  useEffect(() => {
    Promise.all([
      fetch('/api/orders').then((r) => r.json()),
      fetch('/api/leads').then((r) => r.json()),
    ]).then(([o, l]) => { setOrders(o.items); setLeads(l.items); });
  }, []);
  const newLeads = leads.filter((l) => l.status === 'new');
  const inProduction = orders.filter((o) => o.status === 'in_production');
  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="text-3xl font-bold">Менеджер · UniPrint</h1>
      <div className="mt-6 grid grid-cols-3 gap-4">
        <Card><CardHeader><CardTitle>Новых лидов</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{newLeads.length}</CardContent></Card>
        <Card><CardHeader><CardTitle>В производстве</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{inProduction.length}</CardContent></Card>
        <Card><CardHeader><CardTitle>Всего заказов</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{orders.length}</CardContent></Card>
      </div>
      <div className="mt-6 flex gap-3">
        <Link href="/leads"><Button variant="outline">Лиды</Button></Link>
        <Link href="/orders"><Button variant="outline">Заказы</Button></Link>
        <Link href="/orders/new"><Button>+ Новый заказ</Button></Link>
      </div>
      <h2 className="mt-12 text-xl font-semibold">Активные заказы</h2>
      <div className="mt-4 grid gap-2">
        {orders.slice(0, 8).map((o) => (
          <Card key={o.id}><CardContent className="flex justify-between p-4">
            <div><div className="font-semibold">{o.number} — {o.title}</div></div>
            <OrderStatusBadge status={o.status} />
          </CardContent></Card>
        ))}
      </div>
    </main>
  );
}
