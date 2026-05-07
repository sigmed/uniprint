'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import type { Route } from 'next';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  OrderStatusBadge,
  PageHeader,
} from '@uniprint/ui';
import { ArrowLeft, FileText } from 'lucide-react';
import type { Order, OrderType } from '@uniprint/types';

const ORDER_TYPE_LABELS: Record<OrderType, string> = {
  cex: 'Цех (наружная реклама)',
  office: 'Офис-полиграфия',
  goods: 'Готовый товар',
};

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

  if (order === null) {
    return (
      <div className="flex items-center justify-center py-24 text-[var(--color-ink-3)]">
        Загрузка…
      </div>
    );
  }

  if (order === 'not-found') {
    return (
      <div className="py-6 md:py-8">
        <div className="mx-auto max-w-lg py-16 text-center">
          <div
            className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-[14px]"
            style={{ background: 'var(--color-surface-2)' }}
          >
            <FileText className="h-6 w-6 text-[var(--color-ink-3)]" />
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 500,
              fontSize: '24px',
              letterSpacing: '-0.01em',
              color: 'var(--color-ink)',
            }}
          >
            Заказ не найден
          </h1>
          <p className="mt-2 text-sm text-[var(--color-ink-3)]">
            Возможно, ссылка устарела или заказ был удалён.
          </p>
          <Link href={'/orders' as Route<'/orders'>}>
            <Button variant="outline" className="mt-6 gap-2">
              <ArrowLeft className="h-4 w-4" /> К списку заказов
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 md:py-8">
      {/* Back link */}
      <Link href={'/orders' as Route<'/orders'>}>
        <button
          type="button"
          className="mb-4 flex items-center gap-1.5 text-[13px] text-[var(--color-ink-3)] transition-colors hover:text-[var(--color-ink)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Мои заказы
        </button>
      </Link>

      <PageHeader
        title={order.title}
        description={`Заказ ${order.number}`}
        border={false}
        className="px-0 pb-6"
        meta={<OrderStatusBadge status={order.status} />}
      />

      <div className="mx-auto max-w-3xl grid gap-4">
        {/* Summary */}
        <Card>
          <CardHeader><CardTitle>Сводка</CardTitle></CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-y-3 sm:grid-cols-2">
              {[
                { label: 'Номер заказа', value: (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 500 }}>
                    {order.number}
                  </span>
                )},
                { label: 'Тип заказа (BR-07)', value: ORDER_TYPE_LABELS[order.type] },
                { label: 'Количество', value: `${order.itemsCount} шт` },
                { label: 'Сумма', value: (
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '15px', letterSpacing: '-0.01em' }}>
                    {order.priceTotal.toLocaleString('ru-RU')} ₽
                  </span>
                )},
                { label: 'Срок', value: order.dueDate ? new Date(order.dueDate).toLocaleDateString('ru-RU') : '—' },
                { label: 'Создан', value: new Date(order.createdAt).toLocaleDateString('ru-RU') },
                { label: 'Обновлён', value: new Date(order.updatedAt).toLocaleDateString('ru-RU') },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <dt className="text-[11.5px] font-semibold uppercase tracking-[.06em] text-[var(--color-ink-3)]">{label}</dt>
                  <dd className="text-sm text-[var(--color-ink)]">{value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader><CardTitle className="gap-2"><FileText className="h-4 w-4 text-[var(--color-ink-3)]" /> Документы</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--color-ink-3)]">
              PDF-документы (счёт / договор-оферта / акт / ТТН) будут доступны после
              подтверждения заказа.{' '}
              <span
                className="rounded px-1 text-[10.5px] font-semibold"
                style={{ fontFamily: 'var(--font-mono)', background: 'var(--color-surface-2)', color: 'var(--color-ink-3)' }}
              >
                Q13 ✅
              </span>{' '}
              простая генерация PDF.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
