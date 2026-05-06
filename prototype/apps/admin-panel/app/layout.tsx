import type { Metadata } from 'next';
import { AppShell, MockBanner, fontVariables } from '@uniprint/ui';
import type { NavItem } from '@uniprint/ui';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Package,
  List,
  FileText,
  Camera,
} from 'lucide-react';
import { MSWInit } from './msw-init';
import './globals.css';

export const metadata: Metadata = {
  title: 'UniPrint · Админ-панель',
  description: 'RBAC, справочники, нормы',
};

const nav: NavItem[] = [
  {
    href: '/',
    label: 'Дашборд',
    icon: <LayoutDashboard className="h-4 w-4" />,
    section: 'Управление',
  },
  {
    href: '/users',
    label: 'Пользователи · RBAC',
    icon: <Users className="h-4 w-4" />,
    badge: '28',
    section: 'Управление',
  },
  {
    href: '/catalog/services',
    label: 'Услуги · BR-04',
    icon: <Briefcase className="h-4 w-4" />,
    section: 'Управление',
  },
  {
    href: '/catalog/materials',
    label: 'Материалы (200 SKU)',
    icon: <Package className="h-4 w-4" />,
    section: 'Управление',
  },
  {
    href: '/norms',
    label: 'Нормативы',
    icon: <List className="h-4 w-4" />,
    section: 'Управление',
  },
  {
    href: '/audit-log',
    label: 'Audit-log · 152-ФЗ',
    icon: <FileText className="h-4 w-4" />,
    section: 'Безопасность',
  },
  {
    href: '/face-control',
    label: 'Face Control',
    icon: <Camera className="h-4 w-4" />,
    section: 'Безопасность',
  },
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
