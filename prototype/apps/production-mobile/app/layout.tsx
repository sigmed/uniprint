import type { Metadata, Viewport } from 'next';
import { AppShell, MockBanner, fontVariables } from '@uniprint/ui';
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

const nav = [
  { href: '/', label: 'Смена', icon: <UserCircle className="h-5 w-5" /> },
  { href: '/tasks', label: 'Задачи', icon: <ClipboardList className="h-5 w-5" /> },
  { href: '/history', label: 'История', icon: <History className="h-5 w-5" /> },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={fontVariables}>
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
