'use client';

import { useEffect, useState } from 'react';
import { PhoneFrame, BigButton, BRCallout, Input, Select } from '@uniprint/ui';
import type { SelectOption } from '@uniprint/ui';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Order, DefectStage } from '@uniprint/types';

const STAGE_OPTIONS: SelectOption[] = [
  { value: 'design',     label: 'Дизайн' },
  { value: 'production', label: 'Производство' },
  { value: 'material',   label: 'Материал' },
  { value: 'unknown',    label: 'Неизвестно' },
];

export default function DefectPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderId, setOrderId] = useState('');
  const [stage, setStage] = useState<DefectStage>('production');
  const [qty, setQty] = useState(1);
  const [reason, setReason] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch('/api/orders?status=in_qc')
      .then((r) => r.json())
      .then((d) => setOrders(d.items ?? []));
  }, []);

  const submit = () => {
    setSubmitted(true);
    setTimeout(() => {
      alert(
        `Брак зафиксирован (mock):\nЗаказ: ${orderId}\nЭтап: ${stage}\nКол-во: ${qty}\nПричина: ${reason}\nФото: ${photo?.name ?? 'нет'}\nПеределка создана автоматически (BR-17).`
      );
      setSubmitted(false);
    }, 800);
  };

  const orderOptions: SelectOption[] = orders.map((o) => ({
    value: o.id,
    label: o.number,
  }));

  const canSubmit = Boolean(orderId && reason && photo && !submitted);

  return (
    <PhoneFrame showStatusBar={false}>
      {/* ── Dark header ── */}
      <div
        style={{
          background: 'var(--color-ink)',
          color: '#EFE6D6',
          padding: '14px 18px 20px',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <button
            type="button"
            onClick={() => router.back()}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              padding: '6px 10px',
              color: '#C9BDA6',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            <ArrowLeft size={14} strokeWidth={2} />
            Назад
          </button>
        </div>

        <div
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 500,
            fontSize: 20,
            letterSpacing: '-0.01em',
          }}
        >
          Фиксация брака
        </div>
        <small
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 12,
            color: '#9C8E78',
            fontWeight: 500,
            letterSpacing: '0.02em',
          }}
        >
          BR-03 · только складщик · BR-17 → автопеределка
        </small>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: '16px 16px 24px', flex: 1, overflowY: 'auto' }}>
        {/* Form card */}
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-line)',
            borderRadius: 14,
            padding: 16,
            marginBottom: 14,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div
            style={{
              fontSize: '10.5px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-ink-3)',
              marginBottom: 2,
            }}
          >
            Заполните данные
          </div>

          <Select
            placeholder="— заказ на проверке —"
            options={orderOptions}
            size="touch"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />

          <Select
            label="Этап выявления"
            options={STAGE_OPTIONS}
            size="touch"
            value={stage}
            onChange={(e) => setStage(e.target.value as DefectStage)}
          />

          <Input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            placeholder="Количество брака"
          />

          <Input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Причина брака"
          />

          {/* Photo capture */}
          <label
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              fontSize: 12.5,
              color: 'var(--color-ink-2)',
              fontWeight: 500,
            }}
          >
            Фото брака (обязательно):
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
              style={{ fontSize: 13 }}
            />
          </label>

          {/* Loss amount (optional) */}
          <Input
            type="number"
            min={0}
            placeholder="Сумма потерь (₽, необязательно)"
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <BRCallout
            rules={[
              {
                code: 'BR-03',
                text: 'Брак фиксирует только складщик. Производство НЕ может самостоятельно фиксировать брак.',
              },
            ]}
          />
        </div>

        <BigButton
          variant="danger"
          icon={<AlertTriangle size={20} strokeWidth={2} />}
          disabled={!canSubmit}
          onClick={submit}
        >
          {submitted ? 'Отправка…' : 'Зафиксировать брак'}
        </BigButton>
      </div>
    </PhoneFrame>
  );
}
