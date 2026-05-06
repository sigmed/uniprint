'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  KpiCard,
  KanbanBoard,
  KanbanColumn,
  KanbanCard,
  OrderStatusBadge,
  PageHeader,
  EmptyState,
  Skeleton,
} from '@uniprint/ui';
import { Sparkles, Package, CircleDollarSign, Clock, CheckSquare, Inbox } from 'lucide-react';
import { AnimatedCounter } from '@uniprint/ui';
import type { Order, Lead, OrderType } from '@uniprint/types';

const ORDER_TYPE_LABELS: Record<OrderType, string> = {
  cex: 'Цех',
  office: 'Офис',
  goods: 'Товар',
};

/** Maps order status to Kanban column */
function orderToColumn(status: Order['status']): 'lead' | 'design' | 'work' | 'done' | null {
  if (['draft', 'lead', 'measured'].includes(status)) return 'lead';
  if (['designing', 'design_review', 'client_approval'].includes(status)) return 'design';
  if (['queued', 'in_production', 'in_qc', 'defect_rework'].includes(status)) return 'work';
  if (['ready', 'delivered', 'closed'].includes(status)) return 'done';
  return null;
}

export default function ManagerDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/orders').then((r) => r.json()),
      fetch('/api/leads').then((r) => r.json()),
    ]).then(([o, l]) => {
      setOrders(o.items ?? []);
      setLeads(l.items ?? []);
      setLoading(false);
    });
  }, []);

  const newLeads = leads.filter((l) => l.status === 'new');
  const inProduction = orders.filter((o) => o.status === 'in_production');
  const pendingApproval = orders.filter((o) => ['client_approval', 'design_review'].includes(o.status));
  const dayRevenue = orders.reduce((s, o) => s + o.priceTotal, 0);

  const kanbanColumns: { id: 'lead' | 'design' | 'work' | 'done'; title: string }[] = [
    { id: 'lead', title: 'Лиды / Дизайн' },
    { id: 'design', title: 'В очереди' },
    { id: 'work', title: 'В производстве' },
    { id: 'done', title: 'Готовы / Выданы' },
  ];

  const columnOrders = (col: 'lead' | 'design' | 'work' | 'done') =>
    orders.filter((o) => orderToColumn(o.status) === col).slice(0, 6);

  // current time for accent
  const timeLabel = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="py-6 md:py-8">
      <PageHeader
        title={`Сегодня, ${timeLabel}`}
        accentText={timeLabel}
        description="Обзор активности на сегодня — лиды, заказы, согласования. Уведомления приходят через WebPush + Email."
        border={false}
        className="px-0 pb-6"
        actions={
          <div className="flex items-center gap-2">
            <Link href="/leads"><Button variant="outline" size="sm">Лиды</Button></Link>
            <Link href="/orders"><Button variant="outline" size="sm">Заказы</Button></Link>
            <Link href="/orders/new"><Button size="sm">+ Новый заказ</Button></Link>
          </div>
        }
      />

      {/* KPI cols-5 */}
      <div className="mb-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {loading ? (
          [0, 1, 2, 3, 4].map((i) => <Skeleton key={i} variant="rect" className="h-24" />)
        ) : (
          <>
            <KpiCard
              label="Новых лидов"
              value={<AnimatedCounter value={newLeads.length} />}
              icon={<Sparkles className="h-4 w-4" />}
              trend={newLeads.length > 0 ? 'up' : 'flat'}
              trendIsGood
            />
            <KpiCard
              label="В производстве"
              value={<AnimatedCounter value={inProduction.length} />}
              icon={<Package className="h-4 w-4" />}
              trend={inProduction.length > 0 ? 'up' : 'flat'}
              trendIsGood
            />
            <KpiCard
              label="Всего заказов"
              value={<AnimatedCounter value={orders.length} />}
              icon={<CheckSquare className="h-4 w-4" />}
            />
            <KpiCard
              label="Согласование"
              value={<AnimatedCounter value={pendingApproval.length} />}
              icon={<Clock className="h-4 w-4" />}
              trend={pendingApproval.length > 0 ? 'up' : 'flat'}
              trendIsGood={false}
            />
            <KpiCard
              label="Выручка дня"
              value={<AnimatedCounter value={dayRevenue} format={(n) => n.toLocaleString('ru-RU')} />}
              unit="₽"
              icon={<CircleDollarSign className="h-4 w-4" />}
              trend="up"
              trendIsGood
            />
          </>
        )}
      </div>

      {/* Kanban board */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Активные заказы</CardTitle>
          <span className="text-[11px] font-semibold text-[var(--color-ink-3)]">
            {loading ? '…' : `${orders.length} шт`}
          </span>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton variant="rect" className="h-48" />
          ) : orders.length === 0 ? (
            <EmptyState
              icon={<Inbox className="h-6 w-6" />}
              title="Заказов пока нет"
              description="Создайте новый заказ, чтобы он появился здесь."
            />
          ) : (
            <KanbanBoard>
              {kanbanColumns.map((col) => {
                const colOrders = columnOrders(col.id);
                return (
                  <KanbanColumn
                    key={col.id}
                    title={col.title}
                    tone={col.id}
                    count={colOrders.length}
                  >
                    {colOrders.length === 0 ? (
                      <p className="py-4 text-center text-[11.5px] text-[var(--color-ink-4)]">Пусто</p>
                    ) : (
                      colOrders.map((o) => (
                        <KanbanCard
                          key={o.id}
                          id={o.number}
                          title={o.title}
                          meta={
                            <span>
                              {o.itemsCount} шт · {(o.priceTotal / 1000).toFixed(0)}к ₽
                            </span>
                          }
                        />
                      ))
                    )}
                  </KanbanColumn>
                );
              })}
            </KanbanBoard>
          )}
        </CardContent>
      </Card>

      {/* All orders table */}
      <Card>
        <CardHeader>
          <CardTitle>Все заказы за сегодня</CardTitle>
          <Link href="/orders">
            <Button variant="ghost" size="sm">Смотреть все</Button>
          </Link>
        </CardHeader>
        {loading ? (
          <CardContent><Skeleton variant="text" lines={6} /></CardContent>
        ) : orders.length === 0 ? (
          <CardContent>
            <EmptyState
              icon={<Inbox className="h-6 w-6" />}
              title="Заказов нет"
              description="Создайте новый заказ."
            />
          </CardContent>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  {['№', 'Заказ', 'Клиент', 'Тип', 'Статус', 'Сумма'].map((col) => (
                    <th
                      key={col}
                      className="border-b border-[var(--color-line)] bg-[var(--color-surface-3)] px-[22px] py-[11px] text-left text-[10.5px] font-semibold uppercase tracking-[.08em] text-[var(--color-ink-3)]"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 10).map((o) => (
                  <tr
                    key={o.id}
                    className="border-b border-[var(--color-line)] last:border-none hover:bg-[var(--color-surface-3)]"
                  >
                    <td className="px-[22px] py-[13px]">
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-ink-2)', fontWeight: 500 }}>
                        {o.number}
                      </span>
                    </td>
                    <td className="px-[22px] py-[13px]">
                      <div className="font-semibold text-[var(--color-ink)]">{o.title}</div>
                      <div className="mt-0.5 text-xs text-[var(--color-ink-3)]">{o.itemsCount} шт</div>
                    </td>
                    <td className="px-[22px] py-[13px] text-[var(--color-ink-3)] text-xs">
                      {o.clientId}
                    </td>
                    <td className="px-[22px] py-[13px]">
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11.5px',
                          color: 'var(--color-ink-2)',
                        }}
                      >
                        {ORDER_TYPE_LABELS[o.type]}
                      </span>
                    </td>
                    <td className="px-[22px] py-[13px]">
                      <OrderStatusBadge status={o.status} />
                    </td>
                    <td className="px-[22px] py-[13px]">
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '14.5px', letterSpacing: '-0.01em' }}>
                        {o.priceTotal.toLocaleString('ru-RU')} ₽
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
