import type { Metadata, Viewport } from 'next';
import { AppShell, MockBanner, fontVariables } from '@uniprint/ui';
import { Home, PackageMinus, AlertTriangle } from 'lucide-react';
import { MSWInit } from './msw-init';
import './globals.css';

export const metadata: Metadata = {
  title: 'UniPrint · Склад',
  description: 'Mobile App для складщика',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#4f46e5',
};

const nav = [
  { href: '/', label: 'Главная', icon: <Home className="h-5 w-5" /> },
  { href: '/writeoff', label: 'Списать', icon: <PackageMinus className="h-5 w-5" /> },
  { href: '/defect', label: 'Брак', icon: <AlertTriangle className="h-5 w-5" /> },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={fontVariables}>
      <body>
        <MSWInit>
          <AppShell
            appName="Склад"
            nav={nav}
            banner={<MockBanner variant="subtle" />}
            density="comfortable"
            mobileBottomNav={true}
            user={{ name: 'Дмитрий Сорокин', role: 'Складщик' }}
          >
            {children}
          </AppShell>
        </MSWInit>
      </body>
    </html>
  );
}
