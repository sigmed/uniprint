import type { Metadata } from 'next';
import { Manrope, Inter_Tight, JetBrains_Mono } from 'next/font/google';
import { AppShell, MockBanner } from '@uniprint/ui';
import { Home, Package, FileText } from 'lucide-react';
import { MSWInit } from './msw-init';
import './globals.css';

export const metadata: Metadata = {
  title: 'UniPrint · Кабинет клиента',
  description: 'Заказы, статус, документы',
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
  { href: '/', label: 'Главная', icon: <Home className="h-4 w-4" /> },
  { href: '/orders', label: 'Мои заказы', icon: <Package className="h-4 w-4" /> },
  { href: '/orders/new', label: 'Новый заказ', icon: <FileText className="h-4 w-4" /> },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${manrope.variable} ${interTight.variable} ${jetbrains.variable}`}>
      <body>
        <MSWInit>
          <AppShell
            appName="Кабинет клиента"
            nav={nav}
            banner={<MockBanner />}
            density="comfortable"
            user={{ name: 'Иван Петров', role: 'Клиент' }}
          >
            {children}
          </AppShell>
        </MSWInit>
      </body>
    </html>
  );
}
