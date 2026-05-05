'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Card, CardContent, KpiCard, OrderStatusBadge, PageHeader, EmptyState, Skeleton } from '@uniprint/ui';
import { Sparkles, Package, Inbox } from 'lucide-react';
import type { Order, Lead } from '@uniprint/types';

export default function ManagerDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/orders').then((r) => r.json()),
      fetch('/api/leads').then((r) => r.json()),
    ]).then(([o, l]) => { setOrders(o.items); setLeads(l.items); setLoading(false); });
  }, []);

  const newLeads = leads.filter((l) => l.status === 'new');
  const inProduction = orders.filter((o) => o.status === 'in_production');

  return (
    <div className="mx-auto max-w-6xl py-8">
      <PageHeader title="Менеджер · UniPrint" description="Обзор активности на сегодня" />

      <div className="mt-6 grid grid-cols-3 gap-4">
        {loading ? (
          <Skeleton variant="rect" className="h-24" />
        ) : (
          <>
            <KpiCard
              label="Новых лидов"
              value={newLeads.length}
              icon={<Sparkles className="h-4 w-4" />}
              trend="up"
              trendIsGood={true}
            />
            <KpiCard
              label="В производстве"
              value={inProduction.length}
              icon={<Package className="h-4 w-4" />}
            />
            <KpiCard
              label="Всего заказов"
              value={orders.length}
            />
          </>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        <Link href="/leads"><Button variant="outline">Лиды</Button></Link>
        <Link href="/orders"><Button variant="outline">Заказы</Button></Link>
        <Link href="/orders/new"><Button>+ Новый заказ</Button></Link>
      </div>

      <h2 className="mt-12 text-xl font-semibold">Активные заказы</h2>
      <div className="mt-4 grid gap-2">
        {loading ? (
          <Skeleton variant="text" lines={8} />
        ) : orders.length === 0 ? (
          <EmptyState
            icon={<Inbox className="h-6 w-6" />}
            title="Заказов пока нет"
            description="Создайте новый заказ, чтобы он появился здесь."
          />
        ) : (
          orders.slice(0, 8).map((o) => (
            <Card key={o.id}>
              <CardContent className="flex justify-between p-4">
                <div><div className="font-semibold">{o.number} — {o.title}</div></div>
                <OrderStatusBadge status={o.status} />
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
