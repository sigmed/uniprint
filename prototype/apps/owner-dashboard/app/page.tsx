'use client';
import {
  AnimatedCounter,
  BarRow,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  KpiCard,
  PageHeader,
  PnlCard,
  RoleTag,
  StatPill,
} from '@uniprint/ui';
import {
  AlertTriangle,
  Banknote,
  ChevronRight,
  CheckCircle2,
  FileBarChart,
  Factory,
  Package,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

/**
 * TOP-orders — per owner.png reference. Same UNI-xxx что в orders fixture (manager).
 * Profit вычислен от ordersFixture priceTotal × marg + округлён.
 */
const TOP_ORDERS = [
  { id: 'UNI-2026-00004', title: 'Баннер 6×1 м', revenue: 9_500, profit: 3_800 },
  { id: 'UNI-2026-00005', title: 'Визитки 500 шт', revenue: 11_000, profit: 3_100 },
  { id: 'UNI-2026-00003', title: 'Готовый стенд тип 3', revenue: 8_000, profit: 2_100 },
  { id: 'UNI-2026-00002', title: 'Визитки 200 шт', revenue: 6_500, profit: -240 },
];

/**
 * Defects — per owner.png reference. Каждый brak имеет meta «UNI-xxx · этап»
 * + amount + meta «фикс. ДС» (фиксировал Дмитрий Сорокин = warehouse_keeper, BR-03).
 */
const DEFECTS = [
  {
    id: 'd1',
    label: 'Перерасход баннерной ткани',
    meta: 'UNI-2026-00001 · этап «Печать»',
    loss: -1_800,
  },
  { id: 'd2', label: 'Брак тиража визиток', meta: 'UNI-2026-00002 · BR-03', loss: -1_600 },
  { id: 'd3', label: 'Сбой ламинации', meta: 'UNI-2026-00008 · этап «Постпечать»', loss: -800 },
];

export default function OwnerDashboard() {
  /* ─── KPIs hardcoded baseline per owner.png reference ─── */
  const weekRevenue = 160_500;
  const weekCost = 158_250;
  const weekProfit = weekRevenue - weekCost;
  const weekMargin = Math.round((weekProfit / weekRevenue) * 100);

  /* ─── By-type bar data ─── */
  const barData = [
    {
      label: 'Цех (наружка)',
      hint: '10 шт · услуга-цех',
      percent: 78,
      value: '252 500',
      unit: '₽',
    },
    {
      label: 'Офис-полиграфия',
      hint: '10 шт · услуга-офис',
      percent: 83,
      value: '267 500',
      unit: '₽',
    },
    {
      label: 'Готовый товар',
      hint: '10 шт · продажа-товар',
      percent: 88,
      value: '282 500',
      unit: '₽',
    },
  ];

  return (
    <div className="py-6 md:py-8">
      <RoleTag tone="owner">Учредитель</RoleTag>

      <PageHeader
        title="Сводка за неделю"
        accentText="неделю"
        description="Я хочу открыть телефон утром и за 2 минуты понять, заработал я вчера или потерял."
        border={false}
        className="px-0 pb-6"
      />

      {/* Operations KPIs — hardcoded per reference */}
      <div className="mb-6 grid grid-cols-2 gap-3.5 md:grid-cols-4">
        <KpiCard
          label="Заказов"
          value={<AnimatedCounter value={30} />}
          icon={<Package className="h-4 w-4" />}
          trend="up"
          trendIsGood
          delta="+18% к плану"
        />
        <KpiCard
          label="В производстве"
          value={<AnimatedCounter value={6} />}
          icon={<Factory className="h-4 w-4" />}
          trend="flat"
          delta="загрузка ровная"
        />
        <KpiCard
          label="Выдано"
          value={<AnimatedCounter value={6} />}
          icon={<CheckCircle2 className="h-4 w-4" />}
          trend="up"
          trendIsGood
          delta="в срок 100%"
        />
        <KpiCard
          label="Брак"
          value={<AnimatedCounter value={3} />}
          icon={<AlertTriangle className="h-4 w-4" />}
          trend="down"
          trendIsGood={false}
          delta="потери 4 200 ₽"
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
          marginBottom: '14px',
          color: 'var(--color-ink)',
        }}
      >
        P&L
      </h2>

      <div className="mb-6 grid grid-cols-1 gap-3.5 md:grid-cols-3">
        <PnlCard
          tone="profit"
          label="Прибыль"
          value="2 250"
          unit="₽"
          trend={
            <span style={{ color: 'var(--color-green-ink)' }}>
              <TrendingUp size={13} style={{ display: 'inline', marginRight: 4 }} />+{weekMargin}%
              маржа
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
      <Card className="mb-6">
        <CardHeader className="flex-row items-center justify-between gap-3">
          <CardTitle>Доходимость по типам заказов · BR-07</CardTitle>
          <span style={{ fontSize: '12px', color: 'var(--color-ink-3)' }}>три потока</span>
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
      <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-[1.5fr_1fr]">
        {/* Top orders */}
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-3">
            <CardTitle>Топ заказов по прибыльности</CardTitle>
            <Button variant="ghost" size="sm" rightIcon={<ChevronRight size={14} />}>
              drill-down
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <section
              className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0"
              aria-label="Топ заказов по прибыльности — таблица"
              tabIndex={0}
            >
              <table className="w-full min-w-[420px] text-sm">
                <thead>
                  <tr style={{ background: 'var(--color-surface-3)' }}>
                    <th
                      className="p-3 text-left font-medium"
                      style={{
                        color: 'var(--color-ink-3)',
                        fontSize: '11px',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                      }}
                    >
                      №
                    </th>
                    <th
                      className="p-3 text-left font-medium"
                      style={{
                        color: 'var(--color-ink-3)',
                        fontSize: '11px',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Заказ
                    </th>
                    <th
                      className="p-3 text-right font-medium"
                      style={{
                        color: 'var(--color-ink-3)',
                        fontSize: '11px',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Выручка
                    </th>
                    <th
                      className="p-3 text-right font-medium"
                      style={{
                        color: 'var(--color-ink-3)',
                        fontSize: '11px',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Прибыль
                    </th>
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
                          {order.profit >= 0 ? '+' : ''}
                          {order.profit.toLocaleString('ru-RU')}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--color-ink-3)' }}> ₽</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </CardContent>
        </Card>

        {/* Brak panel */}
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-3">
            <CardTitle>Брак и потери</CardTitle>
            <StatPill tone="defect">3 факта</StatPill>
          </CardHeader>
          <CardContent className="flex flex-col gap-0 pb-4">
            {DEFECTS.map((d) => (
              <div
                key={d.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 12,
                  padding: '10px 0',
                  borderBottom: '1px solid var(--color-line)',
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '13px', color: 'var(--color-ink-2)', fontWeight: 500 }}>
                    {d.label}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--color-ink-3)',
                      marginTop: 2,
                    }}
                  >
                    {d.meta}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 600,
                      fontSize: '14px',
                      color: 'var(--color-red)',
                    }}
                  >
                    {d.loss.toLocaleString('ru-RU')} ₽
                  </div>
                  <div style={{ fontSize: '10.5px', color: 'var(--color-ink-3)', marginTop: 2 }}>
                    фикс. ДС
                  </div>
                </div>
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
    </div>
  );
}
