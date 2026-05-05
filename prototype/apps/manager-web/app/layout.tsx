import type { Metadata } from 'next';
import { Manrope, Inter_Tight, JetBrains_Mono } from 'next/font/google';
import { AppShell, MockBanner } from '@uniprint/ui';
import { LayoutDashboard, Sparkles, Package } from 'lucide-react';
import { MSWInit } from './msw-init';
import './globals.css';

export const metadata: Metadata = {
  title: 'UniPrint · Менеджер',
  description: 'CRM офисного менеджера',
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
  { href: '/', label: 'Дашборд', icon: <LayoutDashboard className="h-4 w-4" /> },
  { href: '/leads', label: 'Лиды', icon: <Sparkles className="h-4 w-4" /> },
  { href: '/orders', label: 'Заказы', icon: <Package className="h-4 w-4" /> },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${manrope.variable} ${interTight.variable} ${jetbrains.variable}`}>
      <body>
        <MSWInit>
          <AppShell
            appName="Менеджер"
            nav={nav}
            banner={<MockBanner />}
            density="compact"
            user={{ name: 'Мария Иванова', role: 'Менеджер офиса' }}
          >
            {children}
          </AppShell>
        </MSWInit>
      </body>
    </html>
  );
}
