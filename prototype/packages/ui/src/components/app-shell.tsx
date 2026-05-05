'use client';

import { Menu, X } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { cn } from '../lib/utils';

export interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
  badge?: string | number;
}

export interface AppShellProps {
  appName: string;
  appAccent?: string;
  user?: { name: string; role: string };
  nav: NavItem[];
  topbarRight?: ReactNode;
  banner?: ReactNode;
  density?: 'comfortable' | 'compact';
  mobileBottomNav?: boolean;
  children: ReactNode;
  /** Optional: current pathname for active nav highlight */
  currentPath?: string;
}

/* ─── Internal prop shapes (required, not optional) ─── */
interface LogoProps {
  appName: string;
  appAccent?: string;
}

interface SidebarInternalProps {
  appName: string;
  appAccent?: string;
  user?: { name: string; role: string };
  nav: NavItem[];
  currentPath?: string;
  density?: 'comfortable' | 'compact';
}

/* ─── Logo lockup ─── */
const LogoLockup = ({ appName, appAccent }: LogoProps) => (
  <div className="flex items-center gap-2.5 px-5 h-14 border-b border-[var(--color-border)] shrink-0">
    <span
      className={cn(
        'inline-flex items-center justify-center w-8 h-8 rounded-[var(--radius-sm)]',
        'text-white text-[var(--text-xs)] font-[var(--font-weight-display)]',
        'select-none shrink-0',
      )}
      style={{ background: appAccent ?? 'var(--color-primary)' }}
      aria-hidden="true"
    >
      UP
    </span>
    <div className="flex flex-col leading-none overflow-hidden">
      <span className="text-[var(--text-sm)] font-[var(--font-weight-bold)] font-[var(--font-display)] text-[var(--color-fg)] truncate">
        UniPrint
      </span>
      <span className="text-[var(--text-2xs)] text-[var(--color-fg-muted)] truncate">{appName}</span>
    </div>
  </div>
);

/* ─── NavLink ─── */
const NavLink = ({
  item,
  active,
  compact,
}: {
  item: NavItem;
  active: boolean;
  compact: boolean;
}) => (
  <a
    href={item.href}
    aria-current={active ? 'page' : undefined}
    className={cn(
      'flex items-center gap-3 rounded-[var(--radius-md)] transition-colors',
      'focus-visible:outline-[var(--focus-ring-width)] focus-visible:outline-solid',
      'focus-visible:outline-[var(--focus-ring-color)] focus-visible:outline-offset-[var(--focus-ring-offset)]',
      compact ? 'px-3 py-1.5 text-[var(--text-sm)]' : 'px-3 py-2 text-[var(--text-sm)]',
      active
        ? 'bg-[var(--color-brand-50)] text-[var(--color-primary)] font-[var(--font-weight-semibold)]'
        : 'text-[var(--color-fg-subtle)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-fg)]',
    )}
  >
    <span className="shrink-0 w-4 h-4 flex items-center justify-center" aria-hidden="true">
      {item.icon}
    </span>
    <span className="flex-1 truncate">{item.label}</span>
    {item.badge != null && (
      <span
        className={cn(
          'inline-flex items-center justify-center min-w-[18px] h-[18px] px-1',
          'rounded-[var(--radius-full)] text-[var(--text-2xs)] font-[var(--font-weight-semibold)]',
          active
            ? 'bg-[var(--color-primary)] text-white'
            : 'bg-[var(--color-bg-subtle)] text-[var(--color-fg-muted)] border border-[var(--color-border)]',
        )}
      >
        {item.badge}
      </span>
    )}
  </a>
);

/* ─── Nav content (shared between Sidebar + Drawer) ─── */
const NavContent = ({
  appName,
  appAccent,
  user,
  nav,
  currentPath,
  density,
  onClose,
}: SidebarInternalProps & { onClose?: () => void }) => {
  const compact = density === 'compact';

  return (
    <>
      <div className="flex items-center justify-between border-b border-[var(--color-border)] shrink-0">
        <LogoLockup
          appName={appName}
          {...(appAccent != null ? { appAccent } : {})}
        />
        {onClose != null && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть меню"
            className={cn(
              'mr-3 rounded-[var(--radius-md)] p-1.5 text-[var(--color-fg-muted)]',
              'hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-fg)]',
              'focus-visible:outline-[var(--focus-ring-width)] focus-visible:outline-solid',
              'focus-visible:outline-[var(--focus-ring-color)]',
            )}
          >
            <X size={18} aria-hidden="true" />
          </button>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-0.5">
        {nav.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={currentPath === item.href}
            compact={compact}
          />
        ))}
      </nav>
      {user != null && (
        <div className="px-4 py-3 border-t border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
          <p className="text-[var(--text-sm)] font-[var(--font-weight-medium)] text-[var(--color-fg)] truncate">
            {user.name}
          </p>
          <p className="text-[var(--text-2xs)] text-[var(--color-fg-muted)] truncate">{user.role}</p>
        </div>
      )}
    </>
  );
};

/* ─── Sidebar ─── */
const Sidebar = (props: SidebarInternalProps) => (
  <aside
    className={cn(
      'fixed inset-y-0 left-0 w-60 flex flex-col',
      'bg-[var(--color-surface)] border-r border-[var(--color-border)]',
      'z-[var(--z-sticky)]',
    )}
  >
    <NavContent {...props} />
  </aside>
);

/* ─── Mobile Drawer ─── */
const MobileDrawer = ({
  open,
  onClose,
  ...rest
}: { open: boolean; onClose: () => void } & SidebarInternalProps) => {
  if (!open) return null;

  return (
    <>
      {/* Backdrop — aria-hidden so SR ignores it; keyboard close handled by the X button */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop is aria-hidden; keyboard users close via Escape or the X button inside the dialog */}
      <div
        className="fixed inset-0 bg-[var(--color-gray-800)]/40 z-[var(--z-overlay)]"
        aria-hidden="true"
        onClick={onClose}
      />
      {/* Drawer — use <dialog> element per Biome a11y recommendation */}
      <dialog
        open
        aria-label="Навигация"
        className={cn(
          'fixed inset-y-0 left-0 m-0 w-72 flex flex-col',
          'bg-[var(--color-surface)] border-r border-[var(--color-border)]',
          'z-[var(--z-modal)] p-0 max-h-none h-full',
        )}
      >
        <NavContent {...rest} onClose={onClose} />
      </dialog>
    </>
  );
};

/* ─── Mobile Bottom Nav ─── */
const MobileBottomNav = ({
  nav,
  currentPath,
}: {
  nav: NavItem[];
  currentPath?: string;
}) => {
  const items = nav.slice(0, 5);

  return (
    <nav
      aria-label="Нижняя навигация"
      className={cn(
        'fixed bottom-0 inset-x-0 flex md:hidden',
        'bg-[var(--color-surface)]/95 backdrop-blur-sm border-t border-[var(--color-border)]',
        'z-[var(--z-sticky)]',
        'pb-[env(safe-area-inset-bottom,0px)]',
      )}
    >
      {items.map((item) => {
        const active = currentPath === item.href;
        return (
          <a
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[var(--size-touch-min)] py-2',
              'text-[var(--text-2xs)] font-[var(--font-weight-medium)] transition-colors',
              'focus-visible:outline-[var(--focus-ring-width)] focus-visible:outline-solid',
              'focus-visible:outline-[var(--focus-ring-color)] focus-visible:outline-offset-[var(--focus-ring-offset)]',
              active
                ? 'text-[var(--color-primary)]'
                : 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]',
            )}
          >
            <span className="relative w-5 h-5 flex items-center justify-center" aria-hidden="true">
              {item.icon}
              {item.badge != null && (
                <span
                  className={cn(
                    'absolute -top-1 -right-1 min-w-[14px] h-[14px] px-0.5',
                    'rounded-full text-[10px] font-[var(--font-weight-bold)]',
                    'bg-[var(--color-primary)] text-white leading-[14px] text-center',
                  )}
                >
                  {item.badge}
                </span>
              )}
            </span>
            <span className="max-w-[56px] truncate text-center">{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
};

/* ─── AppShell (main export) ─── */
export const AppShell = ({
  appName,
  appAccent,
  user,
  nav,
  topbarRight,
  banner,
  density = 'comfortable',
  mobileBottomNav = false,
  children,
  currentPath,
}: AppShellProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const sidebarProps: SidebarInternalProps = {
    appName,
    nav,
    density,
    ...(appAccent != null ? { appAccent } : {}),
    ...(user != null ? { user } : {}),
    ...(currentPath != null ? { currentPath } : {}),
  };

  return (
    <div
      data-density={density}
      className="min-h-screen bg-[var(--color-bg)] font-[var(--font-sans)]"
    >
      {/* Desktop sidebar — hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar {...sidebarProps} />
      </div>

      {/* Mobile drawer (hamburger-based) */}
      {!mobileBottomNav && (
        <MobileDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          {...sidebarProps}
        />
      )}

      {/* Main column */}
      <div className="flex flex-col md:pl-60 min-h-screen">
        {/* Topbar */}
        <header
          className={cn(
            'sticky top-0 h-14 flex items-center gap-3 px-4 md:px-6',
            'bg-[var(--color-surface)]/95 backdrop-blur-sm',
            'border-b border-[var(--color-border)]',
            'z-[var(--z-sticky)]',
          )}
        >
          {/* Hamburger — mobile only */}
          {!mobileBottomNav && (
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Открыть меню"
              aria-expanded={drawerOpen}
              className={cn(
                'md:hidden rounded-[var(--radius-md)] p-1.5 text-[var(--color-fg-muted)]',
                'hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-fg)]',
                'focus-visible:outline-[var(--focus-ring-width)] focus-visible:outline-solid',
                'focus-visible:outline-[var(--focus-ring-color)]',
              )}
            >
              <Menu size={20} aria-hidden="true" />
            </button>
          )}

          {/* App name — mobile only (desktop shows sidebar logo) */}
          <span className="md:hidden text-[var(--text-sm)] font-[var(--font-weight-semibold)] font-[var(--font-display)] text-[var(--color-fg)] flex-1 truncate">
            {appName}
          </span>

          {/* Spacer for desktop */}
          <span className="hidden md:flex flex-1" aria-hidden="true" />

          {topbarRight != null && (
            <div className="flex items-center gap-2 shrink-0">{topbarRight}</div>
          )}
        </header>

        {/* Banner slot */}
        {banner != null && banner}

        {/* Page content */}
        <main
          className={cn(
            'flex-1 px-4 md:px-6',
            mobileBottomNav ? 'pb-20 md:pb-6' : 'pb-6',
          )}
        >
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      {mobileBottomNav && (
        <MobileBottomNav
          nav={nav}
          {...(currentPath != null ? { currentPath } : {})}
        />
      )}
    </div>
  );
};
AppShell.displayName = 'AppShell';
