'use client';

import { useEffect, useState } from 'react';
import {
  PhoneFrame,
  BigButton,
  BRCallout,
  Input,
  Select,
} from '@uniprint/ui';
import type { SelectOption } from '@uniprint/ui';
import { ArrowLeft, PackageMinus, CheckCircle2, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Order, MaterialCatalog } from '@uniprint/types';

export default function WriteoffPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [materials, setMaterials] = useState<MaterialCatalog[]>([]);
  const [orderId, setOrderId] = useState('');
  const [materialId, setMaterialId] = useState('');
  const [qty, setQty] = useState(1);
  const [result, setResult] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/orders?status=in_production')
      .then((r) => r.json())
      .then((d) => setOrders(d.items ?? []));
    fetch('/api/materials')
      .then((r) => r.json())
      .then((d) => setMaterials((d.items ?? []).slice(0, 30)));
  }, []);

  const submit = async () => {
    setResult(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/writeoffs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, materialId, qty, byUserId: 'usr_011' }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult(`ERR: ${data.error}`);
      } else {
        setResult(`Списано ${qty} ед. (${data.writeoffs.length} партий, FIFO)`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const orderOptions: SelectOption[] = orders.map((o) => ({
    value: o.id,
    label: `${o.number} · ${o.title}`,
  }));
  const materialOptions: SelectOption[] = materials.map((m) => ({
    value: m.id,
    label: `${m.sku} · ${m.name}`,
  }));

  const resultIsSuccess = result != null && !result.startsWith('ERR');

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
          Списание материала
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
          BR-01 · только на конкретный заказ
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
            На заказ (BR-01)
          </div>

          <Select
            placeholder="— выберите заказ —"
            options={orderOptions}
            size="touch"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />

          <Select
            placeholder="— выберите материал —"
            options={materialOptions}
            size="touch"
            value={materialId}
            onChange={(e) => setMaterialId(e.target.value)}
          />

          <Input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            placeholder="Количество"
          />

          {/* FIFO hint */}
          {materialId && (
            <div
              style={{
                background: 'var(--color-amber-soft)',
                border: '1px solid rgba(201,132,42,0.25)',
                borderRadius: 10,
                padding: '8px 12px',
                fontSize: 12,
                color: 'var(--color-amber-ink)',
              }}
            >
              BR-09 · Будет списана самая старая партия (FIFO)
            </div>
          )}

          {/* Result message */}
          {result && (
            <p
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 13,
                color: resultIsSuccess ? 'var(--color-green)' : 'var(--color-red)',
              }}
            >
              {resultIsSuccess
                ? <CheckCircle2 size={16} />
                : <XCircle size={16} />}
              {result}
            </p>
          )}
        </div>

        <div style={{ marginBottom: 14 }}>
          <BRCallout
            rules={[
              {
                code: 'BR-01',
                text: 'Материалы списываются только на конкретный заказ. Списание "в цех" без заказа недопустимо.',
              },
              {
                code: 'BR-09',
                text: 'Списание FIFO — сначала идёт самая старая партия поступления.',
              },
            ]}
          />
        </div>

        <BigButton
          variant="brand"
          icon={<PackageMinus size={20} strokeWidth={2} />}
          disabled={!orderId || !materialId || submitting}
          onClick={submit}
        >
          {submitting ? 'Списание…' : 'Списать'}
        </BigButton>
      </div>
    </PhoneFrame>
  );
}
