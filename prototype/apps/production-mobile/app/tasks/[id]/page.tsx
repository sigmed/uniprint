'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  PhoneFrame,
  BigButton,
  BRCallout,
  StatPill,
  Select,
} from '@uniprint/ui';
import type { SelectOption } from '@uniprint/ui';
import { ArrowLeft, Play, Square } from 'lucide-react';
import type { Order } from '@uniprint/types';

const OPERATION_OPTIONS: SelectOption[] = [
  { value: 'print', label: 'Печать' },
  { value: 'cut',   label: 'Резка оракала' },
  { value: 'lam',   label: 'Ламинация' },
  { value: 'mount', label: 'Монтаж' },
];

/* ── Elapsed timer formatter ── */
function fmtMs(ms: number) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  return h > 0
    ? `${h}:${String(m % 60).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
    : `${m}:${String(s % 60).padStart(2, '0')}`;
}

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then(setOrder);
  }, [id]);

  useEffect(() => {
    if (!startedAt) return;
    const t = setInterval(() => setElapsedMs(Date.now() - startedAt.getTime()), 500);
    return () => clearInterval(t);
  }, [startedAt]);

  return (
    <PhoneFrame showStatusBar={false}>
      {/* ── Dark header ── */}
      <div
        style={{
          background: 'var(--color-ink)',
          color: '#EFE6D6',
          padding: '14px 18px 18px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {/* Back row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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

        {/* Order info */}
        {order ? (
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  color: '#9C8E78',
                  marginBottom: 4,
                }}
              >
                {order.number}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 500,
                  fontSize: 18,
                  letterSpacing: '-0.01em',
                  lineHeight: 1.2,
                }}
              >
                {order.title}
              </div>
            </div>
            <StatPill tone={order.status === 'in_production' ? 'work' : 'queue'} pulse={order.status === 'in_production'}>
              {order.status === 'in_production' ? 'В работе' : 'Ожидает'}
            </StatPill>
          </div>
        ) : (
          <div style={{ color: '#9C8E78', fontSize: 14 }}>Загрузка…</div>
        )}
      </div>

      {/* ── Body ── */}
      <div style={{ padding: '16px 16px 24px', flex: 1, overflowY: 'auto' }}>
        {order && (
          <>
            {/* Operation selector */}
            <div
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-line)',
                borderRadius: 14,
                padding: '14px',
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  fontSize: '10.5px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--color-ink-3)',
                  marginBottom: 10,
                }}
              >
                Операция
              </div>

              <Select
                placeholder="— выберите операцию —"
                options={OPERATION_OPTIONS}
                size="touch"
                value={op ?? ''}
                onChange={(e) => setOp(e.target.value || null)}
                disabled={startedAt !== null}
              />

              {/* Timer display */}
              {startedAt && (
                <div
                  style={{
                    marginTop: 16,
                    textAlign: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 36,
                    fontWeight: 600,
                    color: 'var(--color-ink)',
                    letterSpacing: '0.04em',
                  }}
                >
                  {fmtMs(elapsedMs)}
                </div>
              )}
            </div>

            {/* Duedate info */}
            {order.dueDate && (
              <div
                style={{
                  fontSize: 12.5,
                  color: 'var(--color-ink-3)',
                  marginBottom: 14,
                }}
              >
                Срок: {new Date(order.dueDate).toLocaleDateString('ru-RU')}
              </div>
            )}

            {/* Actions */}
            {!startedAt ? (
              <BigButton
                variant="brand"
                icon={<Play size={20} strokeWidth={2} fill="currentColor" />}
                disabled={!op}
                onClick={() => setStartedAt(new Date())}
                style={{ marginBottom: 14 }}
              >
                Начать работу
              </BigButton>
            ) : (
              <BigButton
                variant="danger"
                icon={<Square size={20} strokeWidth={2} fill="currentColor" />}
                onClick={() => {
                  // In production — would POST to /api/operations
                  alert(`Зафиксировано: ${op}, ${fmtMs(elapsedMs)} (mock)`);
                  setStartedAt(null);
                  setElapsedMs(0);
                  setOp(null);
                }}
                style={{ marginBottom: 14 }}
              >
                Завершить работу
              </BigButton>
            )}

            <BRCallout
              rules={[
                {
                  code: 'BR-03',
                  text: 'Брак фиксирует только складщик. Если обнаружили брак — передайте изделие на склад.',
                },
              ]}
            />
          </>
        )}
      </div>
    </PhoneFrame>
  );
}
