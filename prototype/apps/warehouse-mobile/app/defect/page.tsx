'use client';
import { useEffect, useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@uniprint/ui';
import type { Order, DefectStage } from '@uniprint/types';

export default function DefectPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderId, setOrderId] = useState('');
  const [stage, setStage] = useState<DefectStage>('production');
  const [qty, setQty] = useState(1);
  const [reason, setReason] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch('/api/orders?status=in_qc').then((r) => r.json()).then((d) => setOrders(d.items));
  }, []);

  const submit = () => {
    setSubmitted(true);
    setTimeout(() => {
      alert(`Брак зафиксирован (mock):\nЗаказ: ${orderId}\nЭтап: ${stage}\nКоличество: ${qty}\nПричина: ${reason}\nФото: ${photo?.name ?? 'нет'}\nПеределка создана автоматически (BR-17).`);
      setSubmitted(false);
    }, 800);
  };

  return (
    <main className="mx-auto max-w-md px-4 py-6">
      <h1 className="text-2xl font-bold">Фиксация брака</h1>
      <p className="mt-1 text-xs text-[var(--color-fg-muted)]">
        BR-03: фиксирует только складщик. BR-17: брак → автоматическая переделка.
      </p>
      <Card className="mt-4">
        <CardHeader><CardTitle>Заполните данные</CardTitle></CardHeader>
        <CardContent className="grid gap-3">
          <select
            className="h-12 rounded-md border border-[var(--color-border)] px-3"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          >
            <option value="">— заказ на проверке —</option>
            {orders.map((o) => <option key={o.id} value={o.id}>{o.number}</option>)}
          </select>

          <select
            className="h-12 rounded-md border border-[var(--color-border)] px-3"
            value={stage}
            onChange={(e) => setStage(e.target.value as DefectStage)}
          >
            <option value="design">Дизайн</option>
            <option value="production">Производство</option>
            <option value="material">Материал</option>
            <option value="unknown">Неизвестно</option>
          </select>

          <Input type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value))} placeholder="Количество брака" />
          <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Причина" />

          <label className="grid gap-1 text-sm">
            Фото (обязательно):
            <input type="file" accept="image/*" capture="environment" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} />
          </label>

          <Button
            size="touch"
            variant="danger"
            disabled={!orderId || !reason || !photo || submitted}
            onClick={submit}
          >
            {submitted ? 'Отправка…' : '⚠ Зафиксировать брак'}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
