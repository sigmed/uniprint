import type { Metadata, Viewport } from 'next';
import { MockBanner, fontVariables } from '@uniprint/ui';
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
  themeColor: '#1A1410',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={fontVariables}>
      <body style={{ margin: 0, padding: 0, background: 'var(--color-surface-2)' }}>
        <MSWInit>
          {/* MockBanner floats above PhoneFrame on desktop */}
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}>
            <MockBanner variant="subtle" />
          </div>
          {children}
        </MSWInit>
      </body>
    </html>
  );
}
