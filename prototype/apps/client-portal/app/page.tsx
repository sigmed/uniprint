'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Route } from 'next';
import {
  AnimatedCounter,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  EmptyState,
  Input,
  KpiCard,
  OrderStatusBadge,
  PageHeader,
  RoleTag,
  Select,
  Skeleton,
  Tabs,
} from '@uniprint/ui';
import type { SelectOption, TabItem } from '@uniprint/ui';
import { ChevronRight, FileText, Package, Upload } from 'lucide-react';
import type { Order, OrderType } from '@uniprint/types';

const ORDER_TYPE_OPTIONS: SelectOption[] = [
  { value: 'office', label: 'Услуга офис (оперативная полиграфия)' },
  { value: 'cex', label: 'Услуга цех (наружная реклама)' },
  { value: 'goods', label: 'Готовый товар со склада' },
];

const DUE_OPTIONS: SelectOption[] = [
  { value: 'standard', label: 'Стандарт (3–5 дн.)' },
  { value: 'urgent', label: 'Срочно (24 ч)' },
];

const ORDER_TABS: TabItem[] = [
  { value: 'all', label: 'Все' },
  { value: 'work', label: 'В работе' },
  { value: 'done', label: 'Готовы' },
  { value: 'archive', label: 'Архив' },
];

const WORK_STATUSES = new Set([
  'queued',
  'in_production',
  'in_qc',
  'designing',
  'design_review',
  'client_approval',
]);
const DONE_STATUSES = new Set(['ready', 'delivered']);
const ARCHIVE_STATUSES = new Set(['closed', 'cancelled']);

export default function HomePage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('all');

  // New-order form state
  const [type, setType] = useState<OrderType>('office');
  const [title, setTitle] = useState('');
  const [itemsCount, setItemsCount] = useState(1);
  const [dueOption, setDueOption] = useState('standard');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/orders?clientId=cli_001')
      .then((r) => r.json())
      .then((d) => {
        setOrders(d.items ?? []);
        setLoading(false);
      });
  }, []);

  const computedPrice = itemsCount * (type === 'cex' ? 12000 : type === 'office' ? 1500 : 8000);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, title, itemsCount, clientId: 'cli_001', priceTotal: computedPrice }),
    });
    if (!res.ok) {
      const err = await res.json();
      setFormError(err.error ?? 'Не удалось создать заказ');
      setSubmitting(false);
      return;
    }
    const created = await res.json();
    router.push(`/orders/${created.id}` as `/orders/${string}`);
  };

  // KPI baseline values (per client-portal-spec.md)
  const filteredOrders = useMemo(() => {
    if (activeTab === 'all') return orders;
    if (activeTab === 'work') return orders.filter((o) => WORK_STATUSES.has(o.status));
    if (activeTab === 'done') return orders.filter((o) => DONE_STATUSES.has(o.status));
    if (activeTab === 'archive') return orders.filter((o) => ARCHIVE_STATUSES.has(o.status));
    return orders;
  }, [orders, activeTab]);

  return (
    <div className="py-6 md:py-8">
      {/* Role tag — Клиент · ООО «Рассвет» */}
      <RoleTag tone="client">Клиент · ООО «Рассвет»</RoleTag>

      {/* Page header */}
      <PageHeader
        title="Здравствуйте, Иван"
        accentText="Иван"
        description="Создавайте заказы, отслеживайте статусы печати и получайте документы — всё в одном месте."
        border={false}
        className="px-0 pb-6"
      />

      {/* KPI row — 4 cards (per references — hardcoded baseline для demo) */}
      <div className="mb-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-4">
        {loading ? (
          <>
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} variant="rect" className="h-24" />
            ))}
          </>
        ) : (
          <>
            <KpiCard
              label="Активные заказы"
              value={<AnimatedCounter value={3} />}
              icon={<Package className="h-4 w-4" />}
              trend="up"
              trendIsGood
              delta="+1 за неделю"
            />
            <KpiCard
              label="В производстве"
              value={<AnimatedCounter value={2} />}
              icon={<FileText className="h-4 w-4" />}
              trend="flat"
              delta="готовность ≈ 78%"
            />
            <KpiCard
              label="Расходы за месяц"
              value={<AnimatedCounter value={42800} format={(n) => n.toLocaleString('ru-RU')} />}
              unit="₽"
              trend="down"
              trendIsGood
              delta="−12% к прошлому"
            />
            <KpiCard
              label="Бонусный баланс"
              value={<AnimatedCounter value={1280} format={(n) => n.toLocaleString('ru-RU')} />}
              unit="₽"
              trend="up"
              trendIsGood={false}
              delta="истекает 01.07"
            />
          </>
        )}
      </div>

      {/* Client grid: orders table + sticky form card */}
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[1fr_380px]">
        {/* Left: last orders table */}
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2.5">
              Последние заказы
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 600,
                  fontSize: 11,
                  background: 'var(--color-surface-2)',
                  color: 'var(--color-ink-3)',
                  padding: '3px 8px',
                  borderRadius: 99,
                }}
              >
                {orders.length}
              </span>
            </CardTitle>
            <Tabs items={ORDER_TABS} value={activeTab} onChange={setActiveTab} />
          </CardHeader>

          {loading ? (
            <CardContent>
              <Skeleton variant="text" lines={5} />
            </CardContent>
          ) : filteredOrders.length === 0 ? (
            <CardContent>
              <EmptyState
                icon={<Package className="h-6 w-6" />}
                title="Заказов в этой вкладке нет"
                description="Создайте первый заказ с помощью формы справа."
              />
            </CardContent>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    {['№', 'Заказ', 'Статус', 'Сдача', 'Сумма', ''].map((col) => (
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
                  {filteredOrders.slice(0, 8).map((o) => (
                    <tr
                      key={o.id}
                      className="group border-b border-[var(--color-line)] last:border-none hover:bg-[var(--color-surface-3)]"
                    >
                      <td className="px-[22px] py-[13px]">
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '12px',
                            color: 'var(--color-ink-2)',
                            fontWeight: 500,
                          }}
                        >
                          {o.number}
                        </span>
                      </td>
                      <td className="px-[22px] py-[13px]">
                        <div className="font-semibold text-[var(--color-ink)]">{o.title}</div>
                        <div className="mt-0.5 text-xs text-[var(--color-ink-3)]">
                          {o.metaText ?? `${o.itemsCount} шт`}
                        </div>
                      </td>
                      <td className="px-[22px] py-[13px]">
                        <OrderStatusBadge status={o.status} />
                      </td>
                      <td className="px-[22px] py-[13px] text-[var(--color-ink-3)]">
                        {o.dueDate ? new Date(o.dueDate).toLocaleDateString('ru-RU') : '—'}
                      </td>
                      <td className="px-[22px] py-[13px]">
                        <span
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontWeight: 500,
                            fontSize: '14.5px',
                            letterSpacing: '-0.01em',
                          }}
                        >
                          {o.priceTotal.toLocaleString('ru-RU')} ₽
                        </span>
                      </td>
                      <td className="px-[22px] py-[13px]">
                        <Link href={`/orders/${o.id}` as `/orders/${string}`}>
                          <button
                            type="button"
                            aria-label="Открыть заказ"
                            className="grid h-7 w-7 cursor-pointer place-items-center rounded-md text-[var(--color-ink-3)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <CardFooter className="justify-end">
            <Link href={'/orders' as Route<'/orders'>}>
              <Button variant="outline" size="sm">
                Смотреть все
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Right: sticky new-order form card */}
        <div className="sticky top-[calc(49px+62px+18px)]">
          <Card className="shadow-[var(--shadow-sm)]">
            {/* Form head */}
            <div className="flex items-center gap-2.5 border-b border-[var(--color-line)] px-[22px] py-4">
              <span
                className="grid h-9 w-9 shrink-0 place-items-center rounded-[9px]"
                style={{
                  background: 'linear-gradient(135deg, var(--color-brand-50), #F8D5BF)',
                  color: 'var(--color-brand-700)',
                }}
                aria-hidden="true"
              >
                <FileText className="h-4 w-4" />
              </span>
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 500,
                    fontSize: '18px',
                    letterSpacing: '-0.01em',
                    lineHeight: 1.1,
                    color: 'var(--color-ink)',
                  }}
                >
                  Новый заказ
                </div>
                <div className="mt-0.5 text-[11.5px] text-[var(--color-ink-3)]">
                  Менеджер уточнит детали
                </div>
              </div>
            </div>

            <CardContent className="pt-5">
              <form onSubmit={handleCreate} className="grid gap-3.5">
                <Select
                  label="Тип заказа"
                  options={ORDER_TYPE_OPTIONS}
                  value={type}
                  onChange={(e) => setType(e.target.value as OrderType)}
                />

                <label htmlFor="home-order-title" className="grid gap-1.5">
                  <span className="text-[11.5px] font-semibold text-[var(--color-ink-2)]">
                    Что заказываете <span className="text-[var(--color-brand-500)]">*</span>
                  </span>
                  <Input
                    id="home-order-title"
                    placeholder="Например: баннер 3×1 м"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                  {/* Chips */}
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {['Визитки', 'Листовки', 'Баннер', 'Каталог'].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        className="rounded-full border border-[var(--color-line)] bg-[var(--color-bg)] px-2.5 py-1 text-[11.5px] text-[var(--color-ink-2)] transition-colors hover:border-[var(--color-brand-500)] hover:text-[var(--color-brand-500)]"
                        onClick={() => setTitle(chip)}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </label>

                {/* Срок + Количество row */}
                <div className="grid grid-cols-[1fr_110px] gap-2.5">
                  <Select
                    label="Срок"
                    options={DUE_OPTIONS}
                    value={dueOption}
                    onChange={(e) => setDueOption(e.target.value)}
                  />
                  <label htmlFor="home-order-qty" className="grid gap-1.5">
                    <span className="text-[11.5px] font-semibold text-[var(--color-ink-2)]">Кол-во, шт</span>
                    <Input
                      id="home-order-qty"
                      type="number"
                      min={1}
                      value={itemsCount}
                      onChange={(e) => setItemsCount(Number(e.target.value))}
                    />
                  </label>
                </div>

                {/* Upload zone */}
                <label
                  htmlFor="home-order-file"
                  className="cursor-pointer rounded-[10px] border-[1.5px] border-dashed border-[var(--color-line-2)] bg-[var(--color-surface-3)] p-3.5 text-center text-[12.5px] text-[var(--color-ink-3)] transition-colors hover:border-[var(--color-brand-500)] hover:bg-[var(--color-brand-50)] hover:text-[var(--color-brand-500)]"
                >
                  <Upload className="mx-auto mb-1 h-5 w-5" style={{ color: 'var(--color-brand-500)' }} />
                  <div>
                    <strong className="text-[var(--color-ink-2)]">Загрузите файл</strong> или перетащите
                  </div>
                  <div className="mt-0.5 text-[11px] text-[var(--color-ink-4)]">PDF, AI, PSD · до 2 ГБ · S3</div>
                  <input id="home-order-file" type="file" className="hidden" />
                </label>

                {/* Price box */}
                <div
                  className="relative mt-1 overflow-hidden rounded-[12px] border p-4"
                  style={{
                    background: 'linear-gradient(135deg, #FBF1E2, #F7E5CC)',
                    borderColor: '#E8D3AE',
                  }}
                >
                  {/* Decorative glow */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-7 -right-7 h-[120px] w-[120px] rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(217,83,30,.1), transparent 70%)' }}
                  />
                  <div
                    className="text-[10.5px] font-bold uppercase tracking-[.14em]"
                    style={{ color: 'var(--color-amber-ink)' }}
                  >
                    Предварительная стоимость
                  </div>
                  <div
                    className="relative mt-1 leading-none"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 500,
                      fontSize: '34px',
                      letterSpacing: '-0.02em',
                      color: 'var(--color-ink)',
                    }}
                  >
                    {computedPrice.toLocaleString('ru-RU')}
                    <sup
                      className="ml-0.5"
                      style={{ fontSize: '17px', color: 'var(--color-ink-2)', fontWeight: 400 }}
                    >
                      ₽
                    </sup>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-[11.5px] text-[var(--color-ink-3)]">
                    <span>Уточняется по справочнику</span>
                    <code
                      className="rounded px-1 text-[10.5px]"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        background: 'rgba(0,0,0,.05)',
                      }}
                    >
                      BR-04
                    </code>
                  </div>
                </div>

                {formError && <p className="text-sm text-[var(--color-red)]">{formError}</p>}

                <button
                  type="submit"
                  disabled={submitting || !title}
                  className="mt-1 flex w-full items-center justify-center gap-2 rounded-[10px] px-3 py-3 text-sm font-semibold tracking-[.01em] transition-all disabled:opacity-50"
                  style={{
                    background: 'var(--color-ink)',
                    color: 'var(--color-bg)',
                  }}
                  onMouseEnter={(e) => {
                    if (!submitting && title) (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-brand-500)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-ink)';
                  }}
                >
                  {submitting ? 'Создание…' : 'Создать заказ'}
                  {!submitting && <ChevronRight className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-[10px] border border-[var(--color-line)] px-3 py-2.5 text-[13px] font-medium text-[var(--color-ink-2)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
                >
                  Сохранить как черновик
                </button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
