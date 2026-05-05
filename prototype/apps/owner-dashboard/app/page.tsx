'use client';
import { useEffect, useState } from 'react';
import { KpiCard, PageHeader, Skeleton } from '@uniprint/ui';
import { Package, Factory, CheckCircle2, AlertTriangle, Banknote, TrendingDown, TrendingUp } from 'lucide-react';
import type { Order } from '@uniprint/types';

export default function OwnerDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/orders').then((r) => r.json()).then((d) => { setOrders(d.items); setLoading(false); });
  }, []);

  const total = orders.length;
  const inProduction = orders.filter((o) => o.status === 'in_production').length;
  const delivered = orders.filter((o) => o.status === 'delivered' || o.status === 'closed').length;
  const defects = orders.filter((o) => o.status === 'defect_rework').length;
  const revenue = orders.filter((o) => ['delivered', 'closed'].includes(o.status))
    .reduce((s, o) => s + o.priceTotal, 0);
  const costActual = orders.filter((o) => o.costActual).reduce((s, o) => s + (o.costActual ?? 0), 0);
  const profit = revenue - costActual;
  const margin = revenue > 0 ? Math.round((profit / revenue) * 100) : 0;

  return (
    <div className="mx-auto max-w-6xl py-8">
      <PageHeader title="Дашборд учредителя" description="Данные за период (mock)" />

      {loading ? (
        <div className="mt-6">
          <Skeleton variant="rect" className="h-32" />
        </div>
      ) : (
        <>
          {/* Operations KPIs */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard
              label="Заказов"
              value={total}
              icon={<Package className="h-4 w-4" />}
            />
            <KpiCard
              label="В производстве"
              value={inProduction}
              icon={<Factory className="h-4 w-4" />}
            />
            <KpiCard
              label="Выдано"
              value={delivered}
              trend="up"
              trendIsGood={true}
              icon={<CheckCircle2 className="h-4 w-4" />}
            />
            <KpiCard
              label="Брак"
              value={defects}
              trend={defects > 0 ? 'up' : 'flat'}
              trendIsGood={false}
              icon={<AlertTriangle className="h-4 w-4" />}
            />
          </div>

          {/* P&L — hero card for profit */}
          <h2 className="mt-12 text-xl font-semibold">P&L</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <KpiCard
              label="Прибыль"
              value={profit.toLocaleString('ru-RU')}
              unit="₽"
              delta={`${margin}% маржа`}
              trend={profit >= 0 ? 'up' : 'down'}
              trendIsGood={profit >= 0}
              icon={profit >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              size="lg"
            />
            <KpiCard
              label="Выручка"
              value={revenue.toLocaleString('ru-RU')}
              unit="₽"
              icon={<Banknote className="h-4 w-4" />}
            />
            <KpiCard
              label="Себестоимость"
              value={costActual.toLocaleString('ru-RU')}
              unit="₽"
              trend="flat"
              icon={<TrendingDown className="h-4 w-4" />}
            />
          </div>

          {/* By type */}
          <h2 className="mt-12 text-xl font-semibold">Доходимость по типам</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['cex', 'office', 'goods'] as const).map((t) => {
              const cnt = orders.filter((o) => o.type === t).length;
              const sum = orders.filter((o) => o.type === t).reduce((s, o) => s + o.priceTotal, 0);
              return (
                <KpiCard
                  key={t}
                  label={t === 'cex' ? 'Цех (наружка)' : t === 'office' ? 'Офис-полиграфия' : 'Готовый товар'}
                  value={`${cnt} шт`}
                  hint={`${sum.toLocaleString('ru-RU')} ₽`}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
