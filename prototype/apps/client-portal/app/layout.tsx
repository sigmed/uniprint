import type { Metadata } from 'next';
import {
  AppShell,
  IconButton,
  MockBanner,
  ROLES,
  RoleSwitcher,
  SearchInput,
  fontVariables,
} from '@uniprint/ui';
import { Bell, FileText, HelpCircle, Home, LayoutGrid, Package } from 'lucide-react';
import { ClientPortalCrumbs } from './_crumbs';
import { MSWInit } from './msw-init';
import './globals.css';

export const metadata: Metadata = {
  title: 'UniPrint · Кабинет клиента',
  description: 'Заказы, статус, документы',
};

const nav = [
  { href: '/', label: 'Главная', icon: <Home className="h-4 w-4" /> },
  { href: '/orders/new', label: 'Новый заказ', icon: <FileText className="h-4 w-4" /> },
  { href: '/orders', label: 'Мои заказы', icon: <Package className="h-4 w-4" />, badge: 3 },
  { href: '/catalog', label: 'Каталог услуг', icon: <LayoutGrid className="h-4 w-4" /> },
  { href: '/documents', label: 'Документы', icon: <FileText className="h-4 w-4" /> },
  { href: '/support', label: 'Поддержка', icon: <HelpCircle className="h-4 w-4" /> },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={fontVariables}>
      <body>
        <MSWInit>
          <RoleSwitcher current="client" roles={ROLES} />
          <AppShell
            appName="Кабинет клиента"
            nav={nav}
            stickyTopOffset={49}
            topbarLeft={<ClientPortalCrumbs />}
            topbarRight={
              <>
                <SearchInput placeholder="Поиск по заказам и услугам" />
                <IconButton icon={<Bell size={16} />} ariaLabel="Уведомления" withDot />
              </>
            }
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
