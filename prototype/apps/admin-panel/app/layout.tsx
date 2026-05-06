import type { Metadata } from 'next';
import { AppShell, MockBanner, fontVariables } from '@uniprint/ui';
import { LayoutDashboard, Users, Briefcase, Package } from 'lucide-react';
import { MSWInit } from './msw-init';
import './globals.css';

export const metadata: Metadata = {
  title: 'UniPrint · Админ-панель',
  description: 'RBAC, справочники, нормы',
};

const nav = [
  { href: '/', label: 'Дашборд', icon: <LayoutDashboard className="h-4 w-4" /> },
  { href: '/users', label: 'Пользователи', icon: <Users className="h-4 w-4" /> },
  { href: '/catalog/services', label: 'Услуги', icon: <Briefcase className="h-4 w-4" /> },
  { href: '/catalog/materials', label: 'Материалы', icon: <Package className="h-4 w-4" /> },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={fontVariables}>
      <body>
        <MSWInit>
          <AppShell
            appName="Админ-панель"
            nav={nav}
            banner={<MockBanner />}
            density="compact"
            user={{ name: 'Сергей Петров', role: 'Администратор' }}
          >
            {children}
          </AppShell>
        </MSWInit>
      </body>
    </html>
  );
}
