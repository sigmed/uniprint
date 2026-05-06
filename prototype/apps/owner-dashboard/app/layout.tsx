import type { Metadata } from 'next';
import { AppShell, MockBanner, fontVariables, Button } from '@uniprint/ui';
import type { NavItem } from '@uniprint/ui';
import {
  BarChart3,
  DollarSign,
  TrendingUp,
  Users,
  FileText,
  AlertTriangle,
  Clock,
  Download,
  Bell,
} from 'lucide-react';
import { MSWInit } from './msw-init';
import './globals.css';

export const metadata: Metadata = {
  title: 'UniPrint · Дашборд учредителя',
  description: 'KPI и P&L учредителя',
};

const nav: NavItem[] = [
  {
    href: '/',
    label: 'Сводка',
    icon: <BarChart3 className="h-4 w-4" />,
    section: 'Аналитика',
  },
  {
    href: '/profit',
    label: 'P&L',
    icon: <DollarSign className="h-4 w-4" />,
    section: 'Аналитика',
  },
  {
    href: '/orders-profit',
    label: 'Прибыль по заказам',
    icon: <TrendingUp className="h-4 w-4" />,
    section: 'Аналитика',
  },
  {
    href: '/staff',
    label: 'Команда',
    icon: <Users className="h-4 w-4" />,
    section: 'Аналитика',
  },
  {
    href: '/reports',
    label: 'Отчёты',
    icon: <FileText className="h-4 w-4" />,
    section: 'Аналитика',
  },
  {
    href: '/defects',
    label: 'Брак и потери',
    icon: <AlertTriangle className="h-4 w-4" />,
    badge: '3',
    section: 'Контроль',
  },
  {
    href: '/downtime',
    label: 'Простои',
    icon: <Clock className="h-4 w-4" />,
    section: 'Контроль',
  },
];

const topbarRight = (
  <>
    {/* Period tabs */}
    <div
      style={{
        display: 'flex',
        gap: 2,
        background: 'var(--color-surface)',
        border: '1px solid var(--color-line)',
        borderRadius: 8,
        padding: 3,
      }}
    >
      {(['Сегодня', 'Неделя', 'Месяц', 'Год'] as const).map((tab) => (
        <button
          key={tab}
          type="button"
          style={{
            padding: '4px 10px',
            borderRadius: 6,
            fontSize: '12px',
            fontWeight: tab === 'Неделя' ? 600 : 400,
            background: tab === 'Неделя' ? 'var(--color-ink)' : 'transparent',
            color: tab === 'Неделя' ? '#FAF6EF' : 'var(--color-ink-3)',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 150ms',
          }}
        >
          {tab}
        </button>
      ))}
    </div>

    {/* Export button */}
    <Button variant="secondary" size="sm" leftIcon={<Download size={13} />}>
      Экспорт
    </Button>

    {/* Bell */}
    <button
      type="button"
      aria-label="Уведомления"
      style={{
        width: 36,
        height: 36,
        borderRadius: 8,
        background: 'var(--color-surface)',
        border: '1px solid var(--color-line)',
        display: 'grid',
        placeItems: 'center',
        cursor: 'pointer',
        color: 'var(--color-ink-2)',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      <Bell size={16} />
    </button>
  </>
);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={fontVariables}>
      <body>
        <MSWInit>
          <AppShell
            appName="Дашборд учредителя"
            nav={nav}
            topbarRight={topbarRight}
            banner={<MockBanner />}
            density="compact"
            user={{ name: 'Виктор Соколов', role: 'Учредитель' }}
          >
            {children}
          </AppShell>
        </MSWInit>
      </body>
    </html>
  );
}
