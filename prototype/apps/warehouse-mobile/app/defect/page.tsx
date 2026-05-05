'use client';
import { useEffect, useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Select, PageHeader } from '@uniprint/ui';
import type { SelectOption } from '@uniprint/ui';
import { AlertTriangle } from 'lucide-react';
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

  const orderOptions: SelectOption[] = orders.map((o) => ({ value: o.id, label: o.number }));
  const stageOptions: SelectOption[] = [
    { value: 'design', label: 'Дизайн' },
    { value: 'production', label: 'Производство' },
    { value: 'material', label: 'Материал' },
    { value: 'unknown', label: 'Неизвестно' },
  ];

  return (
    <div className="mx-auto max-w-md py-6">
      <PageHeader title="Фиксация брака" description="BR-03: фиксирует только складщик. BR-17: брак → автоматическая переделка." />
      <Card className="mt-4">
        <CardHeader><CardTitle>Заполните данные</CardTitle></CardHeader>
        <CardContent className="grid gap-3">
          <Select
            placeholder="— заказ на проверке —"
            options={orderOptions}
            size="touch"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />

          <Select
            label="Этап"
            options={stageOptions}
            size="touch"
            value={stage}
            onChange={(e) => setStage(e.target.value as DefectStage)}
          />

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
            <AlertTriangle className="mr-2 h-5 w-5" />
            {submitted ? 'Отправка…' : 'Зафиксировать брак'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
