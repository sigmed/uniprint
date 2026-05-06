import type { Metadata } from 'next';
import { AppShell, MockBanner, fontVariables } from '@uniprint/ui';
import { LayoutDashboard, Sparkles, Package } from 'lucide-react';
import { MSWInit } from './msw-init';
import './globals.css';

export const metadata: Metadata = {
  title: 'UniPrint · Менеджер',
  description: 'CRM офисного менеджера',
};

const nav = [
  { href: '/', label: 'Дашборд', icon: <LayoutDashboard className="h-4 w-4" /> },
  { href: '/leads', label: 'Лиды', icon: <Sparkles className="h-4 w-4" /> },
  { href: '/orders', label: 'Заказы', icon: <Package className="h-4 w-4" /> },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={fontVariables}>
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
