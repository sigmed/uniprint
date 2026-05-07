'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentType } from 'react';
import { cn } from '../lib/utils';

export interface PwaTabItem {
  /** Route path для Link href. */
  href: string;
  label: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  /**
   * Optional пути, которые тоже считаются «активным» для этого таба.
   * Если не передан — работает только href (с startsWith логикой).
   * Используется когда tab href = '/', но также активен на /tasks.
   */
  matches?: string[];
}

export interface PwaTabBarProps {
  tabs: PwaTabItem[];
  className?: string;
}

/**
 * PwaTabBar — bottom-nav для PWA-кабинетов (production, warehouse).
 * Sticky absolute bottom внутри PhoneFrame. Active определяется через usePathname.
 */
function isActive(currentPath: string, tab: PwaTabItem): boolean {
  const candidates = [tab.href, ...(tab.matches ?? [])];
  return candidates.some((p) => {
    if (p === '/') return currentPath === '/';
    return currentPath === p || currentPath.startsWith(`${p}/`);
  });
}

export const PwaTabBar = ({ tabs, className }: PwaTabBarProps) => {
  const pathname = usePathname() ?? '/';

  return (
    <nav
      aria-label="Нижняя навигация"
      className={cn(className)}
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(255,255,255,0.96)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--color-line)',
        display: 'grid',
        gridTemplateColumns: `repeat(${tabs.length}, 1fr)`,
        padding: '8px 8px 12px',
        zIndex: 5,
      }}
    >
      {tabs.map((tab) => {
        const { href, label, icon: Icon } = tab;
        const active = isActive(pathname, tab);
        return (
          <Link
            key={`${href}-${label}`}
            href={href as '/'}
            aria-current={active ? 'page' : undefined}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              padding: '7px 4px',
              borderRadius: 10,
              color: active ? 'var(--color-brand-500)' : 'var(--color-ink-3)',
              textDecoration: 'none',
              fontSize: '10.5px',
              fontWeight: 600,
              letterSpacing: '0.02em',
            }}
          >
            <Icon size={20} strokeWidth={1.8} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
};
PwaTabBar.displayName = 'PwaTabBar';
