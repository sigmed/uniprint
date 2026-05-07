'use client';

import {
  PhoneFrame,
  ShiftBar,
  BigButton,
  PwaTaskCard,
  BRCallout,
  StatPill,
} from '@uniprint/ui';
import {
  Bell,
  Home,
  PackageMinus,
  AlertTriangle,
  BarChart2,
  Inbox,
  UserCheck,
} from 'lucide-react';
import Link from 'next/link';

/* ── Bottom-nav tabs ── */
const TABS: { href: string; label: string; icon: React.ComponentType<{ size?: number; strokeWidth?: number }>; active: boolean }[] = [
  { href: '/',          label: 'Главная',  icon: Home,        active: true  },
  { href: '/writeoff',  label: 'Списать',  icon: PackageMinus, active: false },
  { href: '/defect',    label: 'Брак',     icon: AlertTriangle, active: false },
  { href: '/',          label: 'Остатки',  icon: BarChart2,   active: false },
];

/* ── Mini-stat card ── */
function MiniStat({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-line)',
        borderRadius: 14,
        padding: '12px 14px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: 'var(--color-ink-3)',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginBottom: 2,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 500,
          fontSize: 22,
          letterSpacing: '-0.02em',
          color: color ?? 'var(--color-ink)',
        }}
      >
        {value}
      </div>
    </div>
  );
}

/* ── Section title ── */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: '10.5px',
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--color-ink-3)',
        margin: '14px 4px 10px',
      }}
    >
      {children}
    </div>
  );
}

export default function WarehouseHomePage() {
  return (
    <PhoneFrame showStatusBar time="9:41">
      {/* ── PWA Header ── */}
      <div
        style={{
          background: 'var(--color-ink)',
          color: '#EFE6D6',
          padding: '14px 18px 16px',
          flexShrink: 0,
        }}
      >
        {/* Top row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 14,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                background: 'var(--color-brand-500)',
                display: 'grid',
                placeItems: 'center',
                fontSize: 11,
                fontWeight: 700,
                color: '#fff',
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.04em',
              }}
            >
              UP
            </div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: 16,
                lineHeight: 1.1,
              }}
            >
              UniPrint
              <small
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 10,
                  color: '#9C8E78',
                  fontWeight: 400,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginTop: 1,
                }}
              >
                Склад
              </small>
            </div>
          </div>
          <Bell size={18} strokeWidth={1.8} style={{ color: '#9C8E78' }} />
        </div>

        {/* Greet line */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 500,
                fontSize: 20,
                letterSpacing: '-0.01em',
                lineHeight: 1.1,
              }}
            >
              Дмитрий С.
            </div>
            <small
              style={{
                display: 'block',
                fontFamily: 'var(--font-sans)',
                fontWeight: 500,
                fontSize: 12,
                color: '#9C8E78',
                marginTop: 3,
                letterSpacing: '0.02em',
              }}
            >
              Складщик · смена с 09:00
            </small>
          </div>
          {/* Amber avatar */}
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #D9A84A, #A06C18)',
              display: 'grid',
              placeItems: 'center',
              fontWeight: 700,
              color: '#fff',
              fontSize: 13,
              flexShrink: 0,
            }}
          >
            ДС
          </div>
        </div>

        {/* ShiftBar — amber */}
        <div style={{ margin: '10px -18px -16px' }}>
          <ShiftBar
            text="Face Control · в смене"
            duration="00:41:12"
            variant="amber"
          />
        </div>
      </div>

      {/* ── PWA Body ── */}
      <div style={{ padding: '16px 16px 80px', flex: 1, overflowY: 'auto' }}>

        <SectionTitle>Сегодня</SectionTitle>

        {/* 3-col mini-stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 4 }}>
          <MiniStat label="Списано" value={12} />
          <MiniStat label="Принято" value={5} />
          <MiniStat label="Брак" value={1} color="var(--color-red)" />
        </div>

        <SectionTitle>Действия</SectionTitle>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
          <Link href="/writeoff" style={{ textDecoration: 'none' }}>
            <BigButton
              variant="default"
              icon={<PackageMinus size={20} strokeWidth={2} />}
            >
              Списать материал на заказ
            </BigButton>
          </Link>

          <BigButton
            variant="outline"
            icon={<UserCheck size={20} strokeWidth={2} />}
          >
            Принять готовое от производства
          </BigButton>

          <BigButton
            variant="outline"
            icon={<Inbox size={20} strokeWidth={2} />}
          >
            Приёмка поступления
          </BigButton>

          <Link href="/defect" style={{ textDecoration: 'none' }}>
            <BigButton
              variant="danger"
              icon={<AlertTriangle size={20} strokeWidth={2} />}
            >
              Зафиксировать брак
            </BigButton>
          </Link>
        </div>

        {/* BR callout — 3 rules */}
        <div style={{ marginBottom: 14 }}>
          <BRCallout
            rules={[
              { code: 'BR-01', text: 'Материалы списываются только на конкретный заказ.' },
              { code: 'BR-03', text: 'Брак фиксирует только складщик, не производство.' },
              { code: 'BR-09', text: 'Списание FIFO — самая старая партия первой.' },
            ]}
          />
        </div>

        <SectionTitle>Последние списания</SectionTitle>

        <PwaTaskCard
          id="UNI-2026-00005 · 14:18"
          status={<StatPill tone="done">Списано</StatPill>}
          title="Бумага мелованная 300 г"
          meta={
            <>
              <span>200 листов · 90×50</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-ink-2)' }}>
                партия P-2026-039
              </span>
            </>
          }
          showArrow={false}
        />

        <PwaTaskCard
          id="UNI-2026-00003 · 13:46"
          status={<StatPill tone="done">Списано</StatPill>}
          title="Баннерная ткань 440 г/м²"
          meta={
            <>
              <span>3 м² · ПВХ</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-ink-2)' }}>
                партия P-2026-018
              </span>
            </>
          }
          showArrow={false}
        />
      </div>

      {/* ── Bottom tab-bar ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderTop: '1px solid var(--color-line)',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          padding: '8px 8px 12px',
          zIndex: 5,
        }}
      >
        {TABS.map(({ href, label, icon: Icon, active }) => (
          <Link
            key={label}
            href={href as '/'}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              padding: '7px 4px',
              borderRadius: 10,
              color: active ? 'var(--color-brand-500)' : 'var(--color-ink-3)',
              textDecoration: 'none',
              fontSize: '10.5px',
              fontWeight: 600,
              letterSpacing: '0.02em',
            }}
          >
            <Icon size={20} strokeWidth={1.8} />
            {label}
          </Link>
        ))}
      </div>
    </PhoneFrame>
  );
}
