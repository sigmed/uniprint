'use client';
import { useEffect, useState } from 'react';
import {
  PageHeader,
  KpiCard,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  PnlCard,
  BarRow,
  StatPill,
  Button,
  Skeleton,
} from '@uniprint/ui';
import {
  Package,
  Factory,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Banknote,
  FileBarChart,
} from 'lucide-react';
import type { Order } from '@uniprint/types';

/* ─── Static top-orders mock (week) ─── */
const TOP_ORDERS = [
  { id: 'UNI-2026-00004', title: 'Баннер 3×6 м · Стройка на Ленина', revenue: 18500, profit: 3800 },
  { id: 'UNI-2026-00005', title: 'Визитки + листовки · Ромашка Кафе', revenue: 12400, profit: 3100 },
  { id: 'UNI-2026-00003', title: 'Полиграфия А4 1000 шт · НПО Сигнал', revenue: 9800, profit: 2100 },
  { id: 'UNI-2026-00002', title: 'Световая вывеска · ИП Козлов', revenue: 24000, profit: -240 },
];

/* ─── Static defect mock (week) ─── */
const DEFECTS = [
  { id: 'd1', label: 'Перерасход баннерной ткани', loss: -1800 },
  { id: 'd2', label: 'Брак тиража визиток', loss: -1600 },
  { id: 'd3', label: 'Сбой ламинации', loss: -800 },
];

export default function OwnerDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/orders')
      .then((r) => r.json())
      .then((d) => {
        setOrders(d.items);
        setLoading(false);
      });
  }, []);

  /* ─── Derived KPIs from live MSW data ─── */
  const total = orders.length;
  const inProduction = orders.filter((o) => o.status === 'in_production').length;
  const delivered = orders.filter((o) => ['delivered', 'closed'].includes(o.status)).length;
  const defects = orders.filter((o) => o.status === 'defect_rework').length;

  /* ─── P&L — use static week values for coherence with mockup ─── */
  const weekRevenue = 160_500;
  const weekCost = 158_250;
  const weekProfit = weekRevenue - weekCost;
  const weekMargin = Math.round((weekProfit / weekRevenue) * 100);

  /* ─── By-type bar data ─── */
  const barData = [
    { label: 'Цех (наружка)', hint: '10 шт · услуга-цех', percent: 78, value: '252 500', unit: '₽' },
    { label: 'Офис-полиграфия', hint: '10 шт · услуга-офис', percent: 83, value: '267 500', unit: '₽' },
    { label: 'Готовый товар', hint: '10 шт · продажа-товар', percent: 88, value: '282 500', unit: '₽' },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Сводка за"
        accentText="неделю"
        description="Я хочу открыть телефон утром и за 2 минуты понять, заработал я вчера или потерял."
      />

      {loading ? (
        <div className="mt-6">
          <Skeleton variant="rect" className="h-32" />
        </div>
      ) : (
        <>
          {/* Operations KPIs */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3.5">
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
              trendIsGood
              delta="за неделю"
              icon={<CheckCircle2 className="h-4 w-4" />}
            />
            <KpiCard
              label="Брак"
              value={defects}
              trend={defects > 0 ? 'up' : 'flat'}
              trendIsGood={false}
              icon={<AlertTriangle className="h-4 w-4" />}
              className="border-[var(--color-red)] border-l-4"
            />
          </div>

          {/* P&L */}
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 500,
              fontSize: '20px',
              letterSpacing: '-0.01em',
              marginTop: '32px',
              marginBottom: '14px',
              color: 'var(--color-ink)',
            }}
          >
            P&L
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <PnlCard
              tone="profit"
              label="Прибыль"
              value="2 250"
              unit="₽"
              trend={
                <span style={{ color: 'var(--color-green-ink)' }}>
                  <TrendingUp size={13} style={{ display: 'inline', marginRight: 4 }} />
                  +{weekMargin}% маржа
                </span>
              }
            />
            <PnlCard
              tone="revenue"
              label="Выручка"
              value={weekRevenue.toLocaleString('ru-RU')}
              unit="₽"
              trend={
                <span>
                  <Banknote size={13} style={{ display: 'inline', marginRight: 4 }} />
                  за неделю
                </span>
              }
            />
            <PnlCard
              tone="cost"
              label="Себестоимость"
              value={weekCost.toLocaleString('ru-RU')}
              unit="₽"
              trend={
                <span>
                  <TrendingDown size={13} style={{ display: 'inline', marginRight: 4 }} />
                  материалы + работа + амортизация
                </span>
              }
            />
          </div>

          {/* Bar chart by order type */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>
                Доходимость по типам заказов · BR-07
              </CardTitle>
              <span
                style={{
                  fontSize: '12px',
                  color: 'var(--color-ink-3)',
                }}
              >
                три потока
              </span>
            </CardHeader>
            <CardContent>
              {barData.map((row) => (
                <BarRow
                  key={row.label}
                  label={row.label}
                  hint={row.hint}
                  percent={row.percent}
                  value={row.value}
                  unit={row.unit}
                />
              ))}
            </CardContent>
          </Card>

          {/* Bottom row: top-orders + brak panel */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-3.5">
            {/* Top orders */}
            <Card>
              <CardHeader>
                <CardTitle>Топ заказов</CardTitle>
                <span style={{ fontSize: '12px', color: 'var(--color-ink-3)' }}>за неделю</span>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                  <table className="w-full min-w-[420px] text-sm">
                    <thead>
                      <tr style={{ background: 'var(--color-surface-3)' }}>
                        <th className="p-3 text-left font-medium" style={{ color: 'var(--color-ink-3)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>№</th>
                        <th className="p-3 text-left font-medium" style={{ color: 'var(--color-ink-3)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Заказ</th>
                        <th className="p-3 text-right font-medium" style={{ color: 'var(--color-ink-3)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Выручка</th>
                        <th className="p-3 text-right font-medium" style={{ color: 'var(--color-ink-3)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Прибыль</th>
                      </tr>
                    </thead>
                    <tbody>
                      {TOP_ORDERS.map((order) => (
                        <tr key={order.id} className="border-t border-[var(--color-border)]">
                          <td className="p-3">
                            <span
                              style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '10.5px',
                                color: 'var(--color-ink-3)',
                              }}
                            >
                              {order.id}
                            </span>
                          </td>
                          <td className="p-3" style={{ fontWeight: 500, fontSize: '12.5px' }}>
                            {order.title}
                          </td>
                          <td className="p-3 text-right">
                            <span
                              style={{
                                fontFamily: 'var(--font-display)',
                                fontWeight: 500,
                                fontSize: '13px',
                              }}
                            >
                              {order.revenue.toLocaleString('ru-RU')}
                            </span>
                            <span style={{ fontSize: '11px', color: 'var(--color-ink-3)' }}> ₽</span>
                          </td>
                          <td className="p-3 text-right">
                            <span
                              style={{
                                fontFamily: 'var(--font-display)',
                                fontWeight: 600,
                                fontSize: '13px',
                                color: order.profit >= 0 ? 'var(--color-green)' : 'var(--color-red)',
                              }}
                            >
                              {order.profit >= 0 ? '+' : ''}{order.profit.toLocaleString('ru-RU')}
                            </span>
                            <span style={{ fontSize: '11px', color: 'var(--color-ink-3)' }}> ₽</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Brak panel */}
            <Card>
              <CardHeader>
                <CardTitle>Брак и потери</CardTitle>
                <StatPill tone="defect">3 факта</StatPill>
              </CardHeader>
              <CardContent className="flex flex-col gap-0 pb-4">
                {DEFECTS.map((d) => (
                  <div
                    key={d.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 0',
                      borderBottom: '1px solid var(--color-line)',
                    }}
                  >
                    <span style={{ fontSize: '13px', color: 'var(--color-ink-2)', fontWeight: 500 }}>
                      {d.label}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: 'var(--color-red)',
                        flexShrink: 0,
                        marginLeft: 12,
                      }}
                    >
                      {d.loss.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                ))}

                <Button
                  variant="ghost"
                  size="md"
                  block
                  className="mt-4"
                  leftIcon={<FileBarChart size={14} />}
                >
                  Открыть отчёт по браку
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
