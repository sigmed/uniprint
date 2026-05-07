import type { Metadata } from 'next';
import {
  AppShell,
  Button,
  IconButton,
  MockBanner,
  ROLES,
  RoleSwitcher,
  fontVariables,
} from '@uniprint/ui';
import { OwnerCrumbs } from './_crumbs';
import type { NavItem } from '@uniprint/ui';
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Clock,
  DollarSign,
  Download,
  FileText,
  TrendingUp,
  Users,
} from 'lucide-react';
import { MSWInit } from './msw-init';
import { PeriodTabs } from './_period-tabs';
import './globals.css';

export const metadata: Metadata = {
  title: 'UniPrint · Дашборд учредителя',
  description: 'KPI и P&L учредителя',
};

const nav: NavItem[] = [
  { section: 'Аналитика', href: '/',              label: 'Сводка',              icon: <BarChart3 className="h-4 w-4" /> },
  { section: 'Аналитика', href: '/profit',        label: 'P&L',                 icon: <DollarSign className="h-4 w-4" /> },
  { section: 'Аналитика', href: '/orders-profit', label: 'Прибыль по заказам',  icon: <TrendingUp className="h-4 w-4" /> },
  { section: 'Аналитика', href: '/staff',         label: 'Команда',             icon: <Users className="h-4 w-4" /> },
  { section: 'Аналитика', href: '/reports',       label: 'Отчёты',              icon: <FileText className="h-4 w-4" /> },
  { section: 'Контроль',  href: '/defects',       label: 'Брак и потери',       icon: <AlertTriangle className="h-4 w-4" />, badge: '3' },
  { section: 'Контроль',  href: '/downtime',      label: 'Простои',             icon: <Clock className="h-4 w-4" /> },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={fontVariables}>
      <body>
        <MSWInit>
          <RoleSwitcher current="owner" roles={ROLES} />
          <AppShell
            appName="Дашборд учредителя"
            nav={nav}
            stickyTopOffset={49}
            topbarLeft={<OwnerCrumbs />}
            topbarCenter={<PeriodTabs />}
            topbarRight={
              <>
                <Button variant="ghost" size="sm" leftIcon={<Download size={13} />}>
                  Экспорт
                </Button>
                <IconButton icon={<Bell size={16} />} ariaLabel="Уведомления" withDot />
              </>
            }
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
