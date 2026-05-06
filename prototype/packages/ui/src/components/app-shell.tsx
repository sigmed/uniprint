'use client';

import { LogOut, Menu, X } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { cn } from '../lib/utils';

export interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
  badge?: string | number;
  /** Optional section header. If any item has this, items are grouped by section. */
  section?: string;
}

export interface AppShellProps {
  appName: string;
  appAccent?: string;
  user?: { name: string; role: string };
  nav: NavItem[];
  /** TopBar slot — left side (e.g. <Crumbs>). */
  topbarLeft?: ReactNode;
  /** TopBar slot — center (e.g. <Tabs>). Optional. */
  topbarCenter?: ReactNode;
  /** TopBar slot — right side (search, actions, bell). */
  topbarRight?: ReactNode;
  banner?: ReactNode;
  density?: 'comfortable' | 'compact';
  mobileBottomNav?: boolean;
  children: ReactNode;
  /** Optional: current pathname for active nav highlight */
  currentPath?: string;
  /** Top offset для sticky sidebar+topbar. Default 0; pass 49 если есть RoleSwitcher выше. */
  stickyTopOffset?: number;
}

/* ─── Internal prop shapes ─── */
interface SidebarInternalProps {
  appName: string;
  appAccent?: string;
  user?: { name: string; role: string };
  nav: NavItem[];
  currentPath?: string;
  density?: 'comfortable' | 'compact';
  stickyTopOffset?: number;
}

/* ─── Helpers ─── */

/** Get initials from a name (max 2 chars) */
function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase();
}

/** Group nav items by section. Items without section are placed in a unnamed group. */
function groupNavItems(nav: NavItem[]): Array<{ section: string | null; items: NavItem[] }> {
  const hasSections = nav.some((item) => item.section != null);
  if (!hasSections) return [{ section: null, items: nav }];

  const groups: Array<{ section: string | null; items: NavItem[] }> = [];
  const seen = new Map<string | null, NavItem[]>();

  for (const item of nav) {
    const key = item.section ?? null;
    if (!seen.has(key)) {
      seen.set(key, []);
      groups.push({ section: key, items: seen.get(key) ?? [] });
    }
    seen.get(key)?.push(item);
  }
  return groups;
}

/* ─── BrandLockup ─── */
const BrandLockup = ({ appName }: { appName: string }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '0 6px',
    }}
  >
    {/* Brand mark square */}
    <span
      aria-hidden="true"
      style={{
        width: 36,
        height: 36,
        borderRadius: 9,
        background: 'var(--color-brand-500)',
        color: '#fff',
        display: 'grid',
        placeItems: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 16,
        letterSpacing: '-0.03em',
        boxShadow: 'inset 0 -2px 0 rgba(0,0,0,.18)',
        flexShrink: 0,
      }}
    >
      UP
    </span>
    {/* Brand text */}
    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1, overflow: 'hidden' }}>
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          fontSize: 18,
          letterSpacing: '-0.01em',
          color: '#EFE6D6',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        UniPrint
      </span>
      <small
        style={{
          display: 'block',
          fontFamily: 'var(--font-sans)',
          fontWeight: 400,
          fontSize: 10.5,
          color: '#9C8E78',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginTop: 2,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {appName}
      </small>
    </div>
  </div>
);

/* ─── NavLink (dark sidebar variant) ─── */
const NavLink = ({
  item,
  active,
}: {
  item: NavItem;
  active: boolean;
}) => (
  <a
    href={item.href}
    aria-current={active ? 'page' : undefined}
    className={cn(
      'flex items-center gap-[11px] px-3 py-[9px] rounded-lg',
      'text-[13px] font-medium transition-all duration-150',
      'focus-visible:outline-[var(--focus-ring-width)] focus-visible:outline-solid',
      'focus-visible:outline-[var(--focus-ring-color)] focus-visible:outline-offset-[var(--focus-ring-offset)]',
      'relative no-underline',
    )}
    style={
      active
        ? {
            background: 'rgba(217,83,30,.14)',
            color: '#FFE8D9',
          }
        : {
            color: '#C9BDA6',
          }
    }
    onMouseEnter={
      !active
        ? (e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.04)';
            (e.currentTarget as HTMLElement).style.color = '#F4EBD9';
          }
        : undefined
    }
    onMouseLeave={
      !active
        ? (e) => {
            (e.currentTarget as HTMLElement).style.background = '';
            (e.currentTarget as HTMLElement).style.color = '#C9BDA6';
          }
        : undefined
    }
  >
    {/* Active accent strip */}
    {active && (
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: -18,
          top: 8,
          bottom: 8,
          width: 3,
          background: 'var(--color-brand-500)',
          borderRadius: '0 3px 3px 0',
        }}
      />
    )}
    {/* Icon */}
    <span
      className="shrink-0 flex items-center justify-center"
      aria-hidden="true"
      style={{ width: 15, height: 15, opacity: 0.85 }}
    >
      {item.icon}
    </span>
    {/* Label */}
    <span className="flex-1 truncate">{item.label}</span>
    {/* Badge */}
    {item.badge != null && (
      <span
        style={
          active
            ? {
                background: 'var(--color-brand-500)',
                color: '#fff',
                fontSize: 10,
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: 99,
                marginLeft: 'auto',
              }
            : {
                background: 'rgba(255,255,255,.08)',
                color: '#C9BDA6',
                fontSize: 10,
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: 99,
                marginLeft: 'auto',
              }
        }
      >
        {item.badge}
      </span>
    )}
  </a>
);

/* ─── UserCard ─── */
const UserCard = ({ user }: { user: { name: string; role: string } }) => (
  <div
    style={{
      marginTop: 'auto',
      background: 'rgba(255,255,255,.04)',
      border: '1px solid rgba(255,255,255,.06)',
      borderRadius: 10,
      padding: 12,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
    }}
  >
    {/* Avatar with initials */}
    <span
      aria-hidden="true"
      style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--color-gold), var(--color-brand-500))',
        display: 'grid',
        placeItems: 'center',
        fontWeight: 700,
        color: '#fff',
        fontSize: 13,
        flexShrink: 0,
        letterSpacing: '0.02em',
      }}
    >
      {getInitials(user.name)}
    </span>
    {/* User info */}
    <div style={{ flex: 1, minWidth: 0 }}>
      <p
        style={{
          fontWeight: 600,
          fontSize: 13,
          color: '#F4EBD9',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {user.name}
      </p>
      <p
        style={{
          fontSize: 11,
          color: '#8B7E68',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {user.role}
      </p>
    </div>
    {/* Logout icon (optional action) */}
    <button
      type="button"
      aria-label="Выйти"
      style={{
        color: '#8B7E68',
        padding: 4,
        display: 'grid',
        placeItems: 'center',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        borderRadius: 6,
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.color = '#F4EBD9';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.color = '#8B7E68';
      }}
    >
      <LogOut size={15} aria-hidden="true" />
    </button>
  </div>
);

/* ─── NavContent (shared between Sidebar + Drawer) ─── */
const NavContent = ({
  appName,
  user,
  nav,
  currentPath,
  onClose,
}: SidebarInternalProps & { onClose?: () => void }) => {
  const groups = groupNavItems(nav);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        flex: 1,
        overflow: 'hidden',
      }}
    >
      {/* Brand lockup + close button row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <BrandLockup appName={appName} />
        {onClose != null && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть меню"
            style={{
              color: '#9C8E78',
              padding: 6,
              display: 'grid',
              placeItems: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              borderRadius: 8,
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = '#EFE6D6';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = '#9C8E78';
            }}
          >
            <X size={18} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Nav groups */}
      <nav
        aria-label="Навигация"
        style={{ display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto', flex: 1 }}
      >
        {groups.map((group, gi) => (
          <div key={group.section ?? `group-${gi}`}>
            {group.section != null && (
              <p
                style={{
                  fontSize: 10.5,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#7A6E58',
                  padding: '0 12px',
                  marginBottom: 6,
                  fontWeight: 600,
                }}
              >
                {group.section}
              </p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {group.items.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  active={currentPath === item.href}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User card */}
      {user != null && <UserCard user={user} />}
    </div>
  );
};

/* ─── Sidebar (desktop) ─── */
const Sidebar = (props: SidebarInternalProps) => {
  const offset = props.stickyTopOffset ?? 0;
  return (
    <aside
      style={{
        background: 'var(--color-ink)',
        color: 'var(--color-on-dark-1)',
        padding: '22px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        borderRight: '1px solid var(--color-line)',
        position: 'sticky',
        top: offset,
        height: `calc(100vh - ${offset}px)`,
        overflowY: 'auto',
      }}
      className={cn('hidden md:flex w-60 shrink-0', 'z-[var(--z-sticky)]')}
    >
      <NavContent {...props} />
    </aside>
  );
};

/* ─── Mobile Drawer ─── */
const MobileDrawer = ({
  open,
  onClose,
  ...rest
}: { open: boolean; onClose: () => void } & SidebarInternalProps) => {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop is aria-hidden; keyboard users close via Escape or the X button inside the dialog */}
      <div
        className="fixed inset-0 z-[var(--z-overlay)]"
        style={{ background: 'rgba(0,0,0,.4)' }}
        aria-hidden="true"
        onClick={onClose}
      />
      {/* Drawer */}
      <dialog
        open
        aria-label="Навигация"
        className="fixed inset-y-0 left-0 m-0 w-72 z-[var(--z-modal)] p-0 max-h-none h-full border-none outline-none"
        style={{
          background: 'var(--color-ink)',
          color: '#EFE6D6',
          display: 'flex',
          flexDirection: 'column',
          padding: '22px 18px',
          gap: 24,
          overflowY: 'auto',
          borderRight: '1px solid rgba(255,255,255,.08)',
        }}
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
              'text-[var(--text-2xs)] font-[var(--font-weight-medium)] transition-colors no-underline',
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
  topbarLeft,
  topbarCenter,
  topbarRight,
  banner,
  density = 'comfortable',
  mobileBottomNav = false,
  children,
  currentPath,
  stickyTopOffset = 0,
}: AppShellProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const sidebarProps: SidebarInternalProps = {
    appName,
    nav,
    density,
    ...(appAccent != null ? { appAccent } : {}),
    ...(user != null ? { user } : {}),
    ...(currentPath != null ? { currentPath } : {}),
    stickyTopOffset,
  };

  return (
    <div
      data-density={density}
      className="min-h-screen bg-[var(--color-bg)] font-[var(--font-sans)]"
      style={{ display: 'flex' }}
    >
      {/* Desktop sidebar — hidden on mobile */}
      <Sidebar {...sidebarProps} />

      {/* Mobile drawer (hamburger-based) */}
      {!mobileBottomNav && (
        <MobileDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          {...sidebarProps}
        />
      )}

      {/* Main column */}
      <div className="flex flex-col flex-1 min-w-0 min-h-screen">
        {/* Topbar */}
        <header
          className={cn(
            'sticky flex items-center gap-3 px-4 md:px-[30px]',
            'border-b border-[var(--color-border)]',
            'z-[var(--z-sticky)]',
          )}
          style={{
            top: stickyTopOffset,
            height: 62,
            background: 'rgba(250,246,239,.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
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

          {/* topbarLeft slot — desktop (e.g. Crumbs). Mobile fallback = appName. */}
          {topbarLeft != null ? (
            <div className="hidden md:flex items-center shrink-0">{topbarLeft}</div>
          ) : (
            <span className="hidden md:flex" aria-hidden="true" />
          )}

          {/* App name — mobile only (desktop shows topbarLeft) */}
          <span
            className="md:hidden flex-1 truncate"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: 16,
              color: 'var(--color-ink)',
              letterSpacing: '-0.01em',
            }}
          >
            {appName}
          </span>

          {/* Spacer */}
          <span className="hidden md:flex flex-1" aria-hidden="true" />

          {/* topbarCenter slot (optional) — e.g. period Tabs */}
          {topbarCenter != null && (
            <div className="hidden md:flex items-center shrink-0">{topbarCenter}</div>
          )}

          {/* topbarRight slot — actions, search, bell */}
          {topbarRight != null && (
            <div className="flex items-center gap-2 shrink-0">{topbarRight}</div>
          )}
        </header>

        {/* Banner slot */}
        {banner != null && banner}

        {/* Page content */}
        <main
          className={cn(
            'flex-1 px-4 md:px-[30px]',
            mobileBottomNav ? 'pb-20 md:pb-[60px]' : 'pb-[60px]',
            'pt-[30px]',
            'animate-[fadeIn_0.2s_ease-out]',
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
