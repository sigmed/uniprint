import type { Metadata } from 'next';
import { headers } from 'next/headers';
import {
  AppShell,
  IconButton,
  MockBanner,
  RoleSwitcher,
  SearchInput,
  fontVariables,
  getRoles,
} from '@uniprint/ui';
import { AdminCrumbs } from './_crumbs';
import type { NavItem } from '@uniprint/ui';
import {
  Bell,
  Briefcase,
  Camera,
  FileText,
  LayoutDashboard,
  List,
  Package,
  Users,
} from 'lucide-react';
import { MSWInit } from './msw-init';
import './globals.css';

export const metadata: Metadata = {
  title: 'UniPrint · Админ-панель',
  description: 'RBAC, справочники, нормы',
};

const nav: NavItem[] = [
  { section: 'Управление', href: '/',                  label: 'Дашборд',              icon: <LayoutDashboard className="h-4 w-4" /> },
  { section: 'Управление', href: '/users',             label: 'Пользователи · RBAC',  icon: <Users className="h-4 w-4" />, badge: '28' },
  { section: 'Управление', href: '/catalog/services',  label: 'Услуги · BR-04',       icon: <Briefcase className="h-4 w-4" /> },
  { section: 'Управление', href: '/catalog/materials', label: 'Материалы (200 SKU)',  icon: <Package className="h-4 w-4" /> },
  { section: 'Управление', href: '/norms',             label: 'Нормативы',            icon: <List className="h-4 w-4" /> },
  { section: 'Безопасность', href: '/audit-log',       label: 'Audit-log · 152-ФЗ',   icon: <FileText className="h-4 w-4" /> },
  { section: 'Безопасность', href: '/face-control',    label: 'Face Control',         icon: <Camera className="h-4 w-4" /> },
];

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const host = (await headers()).get('host');
  const roles = getRoles(host);
  return (
    <html lang="ru" className={fontVariables}>
      <body>
        <MSWInit>
          <RoleSwitcher current="admin" roles={roles} />
          <AppShell
            appName="Админ-панель"
            nav={nav}
            stickyTopOffset={49}
            topbarLeft={<AdminCrumbs />}
            topbarRight={
              <>
                <SearchInput placeholder="Пользователи, услуги, материалы…" />
                <IconButton icon={<Bell size={16} />} ariaLabel="Уведомления" withDot />
              </>
            }
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
