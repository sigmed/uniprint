'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Select, PageHeader } from '@uniprint/ui';
import type { SelectOption } from '@uniprint/ui';
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
    <div className="mx-auto max-w-2xl py-8">
      <PageHeader title="Новый заказ" />
      <Card className="mt-6">
        <CardHeader><CardTitle>Параметры</CardTitle></CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <Select
              label="Тип заказа"
              options={ORDER_TYPE_OPTIONS}
              value={type}
              onChange={(e) => setType(e.target.value as OrderType)}
            />
            <label htmlFor="order-title-input" className="grid gap-1.5">
              <span className="text-sm font-medium">Что заказываете</span>
              <Input
                id="order-title-input"
                placeholder="Например: баннер 3×1 м"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </label>
            <label htmlFor="order-qty-input" className="grid gap-1.5">
              <span className="text-sm font-medium">Количество, шт</span>
              <Input
                id="order-qty-input"
                type="number"
                min={1}
                value={itemsCount}
                onChange={(e) => setItemsCount(Number(e.target.value))}
                required
              />
            </label>

            {/* Price preview (C6) */}
            <Card variant="flat" tone="accent" className="bg-[var(--color-bg-subtle)]">
              <CardContent className="p-4">
                <div className="overline text-xs uppercase tracking-wide text-[var(--color-fg-muted)]">Предварительная стоимость</div>
                <div className="mt-1 font-display text-2xl font-bold tabular-nums text-[var(--color-fg)]">
                  {computedPrice.toLocaleString('ru-RU')}&nbsp;₽
                </div>
                <div className="mt-1 text-xs text-[var(--color-fg-muted)]">
                  Итог уточнит менеджер по справочнику услуг (BR-04).
                </div>
              </CardContent>
            </Card>

            {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}
            {/* Q15 note moved to comment — serves no purpose in client-facing UI */}
            <Button type="submit" disabled={submitting} size="lg">
              {submitting ? 'Создание…' : 'Создать заказ'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
