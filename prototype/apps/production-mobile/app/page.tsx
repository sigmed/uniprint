'use client';

import { PhoneFrame, ShiftBar, BigButton, PwaTaskCard, BRCallout, StatPill } from '@uniprint/ui';
import { Bell, ClipboardList, Clock, DollarSign, History, Play, UserCircle } from 'lucide-react';
import Link from 'next/link';

/* ── Bottom-nav tabs ── */
const TABS: { href: string; label: string; icon: React.ComponentType<{ size?: number; strokeWidth?: number }>; active: boolean }[] = [
  { href: '/tasks', label: 'Задачи', icon: ClipboardList, active: true },
  { href: '/',     label: 'Смена',   icon: UserCircle,    active: false },
  { href: '/',     label: 'Заработок', icon: DollarSign,  active: false },
  { href: '/',     label: 'История',  icon: History,      active: false },
];

/* ── Mini-stat card ── */
function MiniStat({
  label,
  value,
  suffix,
  iconBg,
  icon,
}: {
  label: string;
  value: string;
  suffix?: string;
  iconBg: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-line)',
        borderRadius: 14,
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <div
          style={{
            fontSize: 11,
            color: 'var(--color-ink-3)',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 500,
            fontSize: 22,
            letterSpacing: '-0.02em',
            marginTop: 2,
            color: 'var(--color-ink)',
          }}
        >
          {value}
          {suffix && (
            <sup
              style={{ fontSize: 11, color: 'var(--color-ink-3)', fontWeight: 400 }}
            >
              {suffix}
            </sup>
          )}
        </div>
      </div>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: iconBg,
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
    </div>
  );
}

/* ── Section title ── */
function SectionTitle({
  children,
  badge,
}: {
  children: React.ReactNode;
  badge?: React.ReactNode;
}) {
  return (
    <div
      style={{
        fontSize: '10.5px',
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--color-ink-3)',
        margin: '14px 4px 10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <span>{children}</span>
      {badge}
    </div>
  );
}

/* ── Page ── */
export default function ProductionHomePage() {
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
                fontFamily: 'var(--font-serif)',
                letterSpacing: '-0.04em',
              }}
            >
              UP
            </div>
            <div
              style={{
                fontFamily: 'var(--font-serif)',
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
                Производство
              </small>
            </div>
          </div>
          <Bell size={18} strokeWidth={1.8} style={{ color: '#9C8E78', cursor: 'pointer' }} />
        </div>

        {/* Greet line */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-serif)',
                fontWeight: 500,
                fontSize: 20,
                letterSpacing: '-0.01em',
                lineHeight: 1.1,
              }}
            >
              Алексей К.
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
              Печатник · смена с 08:30
            </small>
          </div>
          {/* Avatar */}
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #7AAB54, #3F6E22)',
              display: 'grid',
              placeItems: 'center',
              fontWeight: 700,
              color: '#fff',
              fontSize: 13,
              flexShrink: 0,
              letterSpacing: '0.02em',
            }}
          >
            АК
          </div>
        </div>

        {/* ShiftBar */}
        <div style={{ margin: '10px -18px -16px' }}>
          <ShiftBar
            text="Face Control · вход зафиксирован"
            duration="02:11:48"
            variant="green"
          />
        </div>
      </div>

      {/* ── PWA Body ── */}
      <div style={{ padding: '16px 16px 80px', flex: 1, overflowY: 'auto' }}>
        {/* Date section */}
        <SectionTitle>Сегодня · 5 мая</SectionTitle>

        {/* Mini-stats 2-col */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 4 }}>
          <MiniStat
            label="Операций"
            value="7"
            iconBg="var(--color-green-soft)"
            icon={<ClipboardList size={16} strokeWidth={1.8} style={{ color: 'var(--color-green)' }} />}
          />
          <MiniStat
            label="Заработано"
            value="2 840"
            suffix="₽"
            iconBg="var(--color-brand-50)"
            icon={<DollarSign size={16} strokeWidth={1.8} style={{ color: 'var(--color-brand-500)' }} />}
          />
        </div>

        {/* Task queue section */}
        <SectionTitle
          badge={
            <span
              style={{
                background: 'var(--color-brand-500)',
                color: '#fff',
                fontSize: 10,
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: 99,
              }}
            >
              3
            </span>
          }
        >
          Очередь задач
        </SectionTitle>

        {/* Task cards */}
        <PwaTaskCard
          id="UNI-2026-00002"
          tone="active"
          status={<StatPill tone="work" pulse>Сейчас в работе</StatPill>}
          title="Печать визиток 200 шт"
          meta="90×50 мм · 4+4 · ⏱ 14:18 / план 18 мин"
          showArrow={false}
        />

        <PwaTaskCard
          href="/tasks/ord_001"
          id="UNI-2026-00001"
          status={<StatPill tone="queue">Следующая</StatPill>}
          title="Печать баннера 3×1 м"
          meta="ПВХ 440 г/м² · норма 25 мин"
          showArrow
        />

        <PwaTaskCard
          href="/tasks/ord_009"
          id="UNI-2026-00009"
          status={<StatPill tone="queue">В очереди</StatPill>}
          title="Тиснение папки А4"
          meta="50 шт · картон 300 г · норма 40 мин"
          showArrow
        />

        {/* Main action */}
        <BigButton
          variant="brand"
          icon={<Play size={20} strokeWidth={2} fill="currentColor" />}
          style={{ marginBottom: 14 }}
        >
          Завершить текущую работу
        </BigButton>

        {/* BR callout */}
        <BRCallout
          rules={[
            {
              code: 'BR-03',
              text: 'Брак фиксирует только складщик. Передайте изделие на склад через кнопку «Завершить»: складщик проверит качество и при необходимости зафиксирует брак.',
            },
          ]}
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
