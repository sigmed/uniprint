import type { Metadata, Viewport } from 'next';
import { Manrope, Inter_Tight, JetBrains_Mono } from 'next/font/google';
import { AppShell, MockBanner } from '@uniprint/ui';
import { ClipboardList, UserCircle, History } from 'lucide-react';
import { MSWInit } from './msw-init';
import './globals.css';

export const metadata: Metadata = {
  title: 'UniPrint · Производство',
  description: 'Mobile App для производственников',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#4f46e5',
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
  { href: '/', label: 'Смена', icon: <UserCircle className="h-5 w-5" /> },
  { href: '/tasks', label: 'Задачи', icon: <ClipboardList className="h-5 w-5" /> },
  { href: '/history', label: 'История', icon: <History className="h-5 w-5" /> },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${manrope.variable} ${interTight.variable} ${jetbrains.variable}`}>
      <body>
        <MSWInit>
          <AppShell
            appName="Производство"
            nav={nav}
            banner={<MockBanner variant="subtle" />}
            density="comfortable"
            mobileBottomNav={true}
            user={{ name: 'Алексей Кузнецов', role: 'Печатник' }}
          >
            {children}
          </AppShell>
        </MSWInit>
      </body>
    </html>
  );
}
