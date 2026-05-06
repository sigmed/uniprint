import type { Metadata } from 'next';
import { AppShell, MockBanner, fontVariables } from '@uniprint/ui';
import { BarChart3, TrendingUp, Users, FileBarChart } from 'lucide-react';
import { MSWInit } from './msw-init';
import './globals.css';

export const metadata: Metadata = {
  title: 'UniPrint · Дашборд учредителя',
  description: 'KPI и P&L учредителя',
};

const nav = [
  { href: '/', label: 'Сводка', icon: <BarChart3 className="h-4 w-4" /> },
  { href: '/profit', label: 'P&L', icon: <TrendingUp className="h-4 w-4" /> },
  { href: '/staff', label: 'Команда', icon: <Users className="h-4 w-4" /> },
  { href: '/reports', label: 'Отчёты', icon: <FileBarChart className="h-4 w-4" /> },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={fontVariables}>
      <body>
        <MSWInit>
          <AppShell
            appName="Дашборд учредителя"
            nav={nav}
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
