import type { Metadata } from 'next';
import {
  AppShell,
  Button,
  Crumbs,
  IconButton,
  MockBanner,
  ROLES,
  RoleSwitcher,
  SearchInput,
  fontVariables,
} from '@uniprint/ui';
import {
  Bell,
  FileText,
  LayoutDashboard,
  LayoutGrid,
  LifeBuoy,
  Package,
  Plus,
  Sparkles,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { MSWInit } from './msw-init';
import './globals.css';

export const metadata: Metadata = {
  title: 'UniPrint · Менеджер',
  description: 'CRM офисного менеджера',
};

const nav = [
  { section: 'Продажи', href: '/', label: 'Дашборд', icon: <LayoutDashboard className="h-4 w-4" /> },
  { section: 'Продажи', href: '/leads', label: 'Лиды', icon: <Sparkles className="h-4 w-4" />, badge: 3 },
  { section: 'Продажи', href: '/orders', label: 'Заказы', icon: <Package className="h-4 w-4" /> },
  { section: 'Продажи', href: '/clients', label: 'Клиенты', icon: <Users className="h-4 w-4" /> },
  { section: 'Продажи', href: '/catalog', label: 'Каталог · BR-04', icon: <LayoutGrid className="h-4 w-4" /> },
  { section: 'Документы', href: '/invoices', label: 'Счета и акты', icon: <FileText className="h-4 w-4" /> },
  { section: 'Документы', href: '/support', label: 'Постобслуживание', icon: <LifeBuoy className="h-4 w-4" />, badge: 2 },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={fontVariables}>
      <body>
        <MSWInit>
          <RoleSwitcher current="manager" roles={ROLES} />
          <AppShell
            appName="Менеджер офиса"
            nav={nav}
            stickyTopOffset={49}
            topbarLeft={
              <Crumbs items={[{ label: 'Менеджер' }, { label: 'Дашборд' }]} />
            }
            topbarRight={
              <>
                <SearchInput placeholder="Заказ, клиент, телефон…" />
                <Link href="/orders/new">
                  <Button variant="brand" size="md" leftIcon={<Plus size={16} />}>
                    Новый заказ
                  </Button>
                </Link>
                <IconButton icon={<Bell size={16} />} ariaLabel="Уведомления" withDot />
              </>
            }
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
