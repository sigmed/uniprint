import type { Metadata } from 'next';
import { Manrope, Inter_Tight, JetBrains_Mono } from 'next/font/google';
import { AppShell, MockBanner } from '@uniprint/ui';
import { BarChart3, TrendingUp, Users, FileBarChart } from 'lucide-react';
import { MSWInit } from './msw-init';
import './globals.css';

export const metadata: Metadata = {
  title: 'UniPrint · Дашборд учредителя',
  description: 'KPI и P&L учредителя',
};

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-display',
  display: 'swap',
});
const interTight = Inter_Tight({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
  display: 'swap',
});
const jetbrains = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-mono',
  display: 'swap',
});

const nav = [
  { href: '/', label: 'Сводка', icon: <BarChart3 className="h-4 w-4" /> },
  { href: '/profit', label: 'P&L', icon: <TrendingUp className="h-4 w-4" /> },
  { href: '/staff', label: 'Команда', icon: <Users className="h-4 w-4" /> },
  { href: '/reports', label: 'Отчёты', icon: <FileBarChart className="h-4 w-4" /> },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${manrope.variable} ${interTight.variable} ${jetbrains.variable}`}>
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
