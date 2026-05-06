'use client';

import { useEffect, useState } from 'react';
import {
  PhoneFrame,
  ShiftBar,
  PwaTaskCard,
  BRCallout,
  StatPill,
  EmptyState,
} from '@uniprint/ui';
import {
  Bell,
  ClipboardList,
  DollarSign,
  History,
  UserCircle,
  ListChecks,
} from 'lucide-react';
import Link from 'next/link';
import type { Order } from '@uniprint/types';

/* ── Bottom-nav tabs ── */
const TABS: { href: string; label: string; icon: React.ComponentType<{ size?: number; strokeWidth?: number }>; active: boolean }[] = [
  { href: '/tasks', label: 'Задачи',    icon: ClipboardList, active: true  },
  { href: '/',     label: 'Смена',      icon: UserCircle,    active: false },
  { href: '/',     label: 'Заработок',  icon: DollarSign,    active: false },
  { href: '/',     label: 'История',    icon: History,       active: false },
];

/* ── Map order status → StatPill tone ── */
function statusPill(status: string): React.ReactNode {
  if (status === 'in_production') {
    return <StatPill tone="work" pulse>В работе</StatPill>;
  }
  if (status === 'new') {
    return <StatPill tone="new">Новая</StatPill>;
  }
  return <StatPill tone="queue">В очереди</StatPill>;
}

/* ── Section title ── */
function SectionTitle({ children, badge }: { children: React.ReactNode; badge?: React.ReactNode }) {
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

export default function TasksPage() {
  const [tasks, setTasks] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/orders?status=in_production')
      .then((r) => r.json())
      .then((d) => setTasks(d.items ?? []))
      .finally(() => setLoading(false));
  }, []);

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

        {/* Greet */}
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
              Мои задачи
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
              Алексей К. · Печатник
            </small>
          </div>
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
            }}
          >
            АК
          </div>
        </div>

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
        <SectionTitle
          badge={
            tasks.length > 0 ? (
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
                {tasks.length}
              </span>
            ) : undefined
          }
        >
          Очередь задач
        </SectionTitle>

        {loading && (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--color-ink-3)', fontSize: 14 }}>
            Загрузка…
          </div>
        )}

        {!loading && tasks.length === 0 && (
          <EmptyState
            icon={<ListChecks size={32} />}
            title="Нет задач в работе"
            description="Новые задачи появятся здесь"
          />
        )}

        {tasks.map((o, idx) => (
          <PwaTaskCard
            key={o.id}
            href={`/tasks/${o.id}`}
            id={o.number}
            tone={idx === 0 ? 'active' : 'default'}
            status={statusPill(o.status)}
            title={o.title}
            meta={
              o.dueDate
                ? `Срок: ${new Date(o.dueDate).toLocaleDateString('ru-RU')}`
                : undefined
            }
            showArrow
          />
        ))}

        <BRCallout
          rules={[
            {
              code: 'BR-03',
              text: 'Брак фиксирует только складщик. Завершив задачу — передайте изделие на склад.',
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
