import type { Metadata } from 'next';
import { MockBanner } from '@uniprint/ui';
import { MSWInit } from './msw-init';
import './globals.css';

export const metadata: Metadata = {
  title: 'UniPrint · Кабинет клиента',
  description: 'Заказы, статус, документы',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <MockBanner />
        <MSWInit>{children}</MSWInit>
      </body>
    </html>
  );
}
