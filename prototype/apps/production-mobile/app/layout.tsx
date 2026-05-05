import type { Metadata, Viewport } from 'next';
import { MockBanner } from '@uniprint/ui';
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
