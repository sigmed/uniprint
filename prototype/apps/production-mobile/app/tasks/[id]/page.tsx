'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, CardTitle, OrderStatusBadge, Select } from '@uniprint/ui';
import type { SelectOption } from '@uniprint/ui';
import { Play, Square } from 'lucide-react';
import type { Order } from '@uniprint/types';

const OPERATION_OPTIONS: SelectOption[] = [
  { value: 'Печать баннера', label: 'Печать баннера' },
  { value: 'Резка оракала', label: 'Резка оракала' },
  { value: 'Монтаж', label: 'Монтаж' },
  { value: 'Ламинация', label: 'Ламинация' },
];

export default function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    fetch(`/api/orders/${id}`).then((r) => r.json()).then(setOrder);
  }, [id]);

  useEffect(() => {
    if (!startedAt) return;
    const t = setInterval(() => setElapsedMs(Date.now() - startedAt.getTime()), 500);
    return () => clearInterval(t);
  }, [startedAt]);

  if (!order) return <div className="p-8 text-center">Загрузка…</div>;

  const fmtTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    return `${m}:${String(s % 60).padStart(2, '0')}`;
  };

  return (
    <div className="mx-auto max-w-md py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{order.number}</h1>
        <OrderStatusBadge status={order.status} />
      </div>
      <p className="mt-1 text-sm">{order.title}</p>

      <Card className="mt-4">
        <CardHeader><CardTitle>Операция</CardTitle></CardHeader>
        <CardContent>
          <Select
            placeholder="— выберите операцию —"
            options={OPERATION_OPTIONS}
            size="touch"
            value={op ?? ''}
            onChange={(e) => setOp(e.target.value || null)}
            disabled={startedAt !== null}
          />

          {!startedAt && (
            <Button
              size="touch"
              className="mt-4 w-full"
              disabled={!op}
              onClick={() => setStartedAt(new Date())}
            >
              <Play className="mr-2 h-5 w-5" />
              Начать работу
            </Button>
          )}

          {startedAt && (
            <>
              <div className="mt-4 text-center text-3xl font-mono">{fmtTime(elapsedMs)}</div>
              <Button
                size="touch"
                variant="danger"
                className="mt-4 w-full"
                onClick={() => {
                  alert(`Зафиксировано: ${op}, ${fmtTime(elapsedMs)} (mock)`);
                  setStartedAt(null);
                  setElapsedMs(0);
                  setOp(null);
                }}
              >
                <Square className="mr-2 h-5 w-5 fill-current" />
                Завершить работу
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <p className="mt-4 text-xs text-[var(--color-fg-muted)]">
        BR-03: брак фиксирует только складщик. Если обнаружили брак — передайте складщику с описанием.
      </p>
    </div>
  );
}
