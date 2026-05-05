'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@uniprint/ui';
import type { OrderType } from '@uniprint/types';

export default function NewOrderPage() {
  const router = useRouter();
  const [type, setType] = useState<OrderType>('office');
  const [title, setTitle] = useState('');
  const [itemsCount, setItemsCount] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type, title, itemsCount,
        clientId: 'cli_001',          // mock — в реале берётся из сессии
        priceTotal: itemsCount * (type === 'cex' ? 12000 : type === 'office' ? 1500 : 8000),
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
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-bold">Новый заказ</h1>
      <Card className="mt-6">
        <CardHeader><CardTitle>Параметры</CardTitle></CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <label className="grid gap-1.5">
              <span className="text-sm font-medium">Тип заказа</span>
              <select
                className="h-10 rounded-md border border-[var(--color-border)] px-3"
                value={type}
                onChange={(e) => setType(e.target.value as OrderType)}
              >
                <option value="cex">Услуга цех (наружная реклама)</option>
                <option value="office">Услуга офис (оперативная полиграфия)</option>
                <option value="goods">Готовый товар</option>
              </select>
            </label>
            <label className="grid gap-1.5">
              <span className="text-sm font-medium">Что заказываете</span>
              <Input
                placeholder="Например: баннер 3×1 м"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-sm font-medium">Количество, шт</span>
              <Input
                type="number"
                min={1}
                value={itemsCount}
                onChange={(e) => setItemsCount(Number(e.target.value))}
                required
              />
            </label>
            {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}
            <p className="text-sm text-[var(--color-fg-muted)]">
              Расчёт стоимости — автоматический по справочнику услуг (BR-04).
              <em>Q15 ✅: справочник наполняется с нуля параллельным треком.</em>
            </p>
            <Button type="submit" disabled={submitting} size="lg">
              {submitting ? 'Создание…' : 'Создать заказ'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
