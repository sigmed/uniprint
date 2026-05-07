import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import { MockBanner, RoleSwitcher, fontVariables, getRoles } from '@uniprint/ui';
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
  themeColor: '#1A1410',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const host = (await headers()).get('host');
  const roles = getRoles(host);
  return (
    <html lang="ru" className={fontVariables}>
      <body style={{ margin: 0, padding: 0, background: 'var(--color-surface-2)' }}>
        <MSWInit>
          {/* RoleSwitcher: hidden on actual mobile; shown on desktop preview */}
          <div className="hidden sm:block">
            <RoleSwitcher current="warehouse" roles={roles} />
          </div>
          <MockBanner variant="subtle" />
          {children}
        </MSWInit>
      </body>
    </html>
  );
}
