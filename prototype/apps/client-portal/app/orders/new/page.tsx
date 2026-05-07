'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Select,
  PageHeader,
  BRCallout,
} from '@uniprint/ui';
import type { SelectOption } from '@uniprint/ui';
import { Upload } from 'lucide-react';
import type { OrderType } from '@uniprint/types';

const ORDER_TYPE_OPTIONS: SelectOption[] = [
  { value: 'cex', label: 'Услуга цех (наружная реклама)' },
  { value: 'office', label: 'Услуга офис (оперативная полиграфия)' },
  { value: 'goods', label: 'Готовый товар' },
];

export default function NewOrderPage() {
  const router = useRouter();
  const [type, setType] = useState<OrderType>('office');
  const [title, setTitle] = useState('');
  const [itemsCount, setItemsCount] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const computedPrice = itemsCount * (type === 'cex' ? 12000 : type === 'office' ? 1500 : 8000);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type, title, itemsCount,
        clientId: 'cli_001',
        priceTotal: computedPrice,
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      setError(err.error ?? 'Не удалось создать заказ');
      setSubmitting(false);
      return;
    }
    const created = await res.json();
    router.push(`/orders/${created.id}` as `/orders/${string}`);
  };

  return (
    <div className="py-6 md:py-8">
      <PageHeader
        title="Новый заказ"
        description="Заполните параметры — менеджер уточнит детали и подтвердит стоимость."
        border={false}
        className="px-0 pb-6"
      />

      <div className="mx-auto max-w-2xl">
        <BRCallout
          rules={[
            { code: 'BR-04', text: 'Производство не создаёт услуги вручную — только выбирает из справочника. Итоговую стоимость подтвердит менеджер.' },
          ]}
          className="mb-5"
        />

        <Card>
          <CardHeader><CardTitle>Параметры заказа</CardTitle></CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <Select
                label="Тип заказа"
                options={ORDER_TYPE_OPTIONS}
                value={type}
                onChange={(e) => setType(e.target.value as OrderType)}
              />

              <label htmlFor="new-order-title" className="grid gap-1.5">
                <span className="text-[11.5px] font-semibold text-[var(--color-ink-2)]">
                  Что заказываете <span className="text-[var(--color-brand-500)]">*</span>
                </span>
                <Input
                  id="new-order-title"
                  placeholder="Например: баннер 3×1 м"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                {/* Quick chips */}
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {['Баннер', 'Визитки', 'Листовки', 'Наклейка', 'Штендер', 'Брошюра'].map((chip) => (
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

              {/* Срок + Количество */}
              <div className="grid grid-cols-[1fr_120px] gap-3">
                <label htmlFor="new-order-due" className="grid gap-1.5">
                  <span className="text-[11.5px] font-semibold text-[var(--color-ink-2)]">Срок</span>
                  <Input id="new-order-due" type="date" />
                </label>
                <label htmlFor="new-order-qty" className="grid gap-1.5">
                  <span className="text-[11.5px] font-semibold text-[var(--color-ink-2)]">Кол-во, шт</span>
                  <Input
                    id="new-order-qty"
                    type="number"
                    min={1}
                    value={itemsCount}
                    onChange={(e) => setItemsCount(Number(e.target.value))}
                    required
                  />
                </label>
              </div>

              {/* Upload zone */}
              <div
                className="cursor-pointer rounded-[10px] border-[1.5px] border-dashed border-[var(--color-line-2)] bg-[var(--color-surface-3)] p-4 text-center text-[12.5px] text-[var(--color-ink-3)] transition-colors hover:border-[var(--color-brand-500)] hover:bg-[var(--color-brand-50)] hover:text-[var(--color-brand-500)]"
              >
                <Upload className="mx-auto mb-1.5 h-5 w-5" />
                <strong className="text-[var(--color-ink-2)]">Загрузить макет</strong>
                <span className="text-[var(--color-ink-3)]"> или перетащите файл</span>
              </div>

              {/* Price box */}
              <div
                className="relative overflow-hidden rounded-[12px] border p-4"
                style={{
                  background: 'linear-gradient(135deg, #FBF1E2, #F7E5CC)',
                  borderColor: '#E8D3AE',
                }}
              >
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
                <div className="mt-2 flex items-center gap-1 text-[11.5px] text-[var(--color-ink-3)]">
                  <span>Итог уточнит менеджер по справочнику услуг (</span>
                  <code
                    className="rounded px-1 text-[10.5px]"
                    style={{ fontFamily: 'var(--font-mono)', background: 'rgba(0,0,0,.05)' }}
                  >
                    BR-04
                  </code>
                  <span>)</span>
                </div>
              </div>

              {error && <p className="text-sm text-[var(--color-red)]">{error}</p>}

              <Button type="submit" disabled={submitting || !title} size="lg" className="mt-1">
                {submitting ? 'Создание…' : 'Создать заказ'}
              </Button>
              <button
                type="button"
                className="flex w-full items-center justify-center rounded-[10px] border border-[var(--color-line)] px-3 py-2.5 text-[13px] font-medium text-[var(--color-ink-2)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
              >
                Сохранить как черновик
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
