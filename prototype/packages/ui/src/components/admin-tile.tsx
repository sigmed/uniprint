import type { ReactNode } from 'react';
import { cn } from '../lib/utils';

/* ─── Types ─── */

export type AdminTileTone = 'users' | 'svc' | 'mat' | 'norm' | 'audit' | 'face';

export interface AdminTileProps {
  href: string;
  icon: ReactNode;
  tone: AdminTileTone;
  title: string;
  description: string;
  stats?: { left: string; right: string };
  className?: string;
}

/* ─── Tone maps ─── */

const ICON_BG: Record<AdminTileTone, string> = {
  users: 'var(--color-blue-soft)',
  svc:   'var(--color-green-soft)',
  mat:   'var(--color-amber-soft)',
  norm:  'var(--color-brand-50)',
  audit: '#E8DFEC',
  face:  '#E0DBD0',
};

const ICON_COLOR: Record<AdminTileTone, string> = {
  users: 'var(--color-blue-ink)',
  svc:   'var(--color-green-ink)',
  mat:   'var(--color-amber-ink)',
  norm:  'var(--color-brand-700)',
  audit: '#4A3158',
  face:  'var(--color-ink-2)',
};

/* ─── Component ─── */

export const AdminTile = ({
  href,
  icon,
  tone,
  title,
  description,
  stats,
  className,
}: AdminTileProps) => (
  <a
    href={href}
    className={cn(className)}
    style={{
      background:    'var(--color-surface)',
      border:        '1px solid var(--color-line)',
      borderRadius:  '14px',
      padding:       '18px',
      display:       'flex',
      flexDirection: 'column',
      gap:           '10px',
      transition:    'all 150ms',
      textDecoration: 'none',
      color:         'inherit',
    }}
    onMouseEnter={e => {
      const el = e.currentTarget;
      el.style.borderColor = 'var(--color-line-2)';
      el.style.transform    = 'translateY(-1px)';
      el.style.boxShadow    = 'var(--shadow-sm)';
    }}
    onMouseLeave={e => {
      const el = e.currentTarget;
      el.style.borderColor = 'var(--color-line)';
      el.style.transform   = '';
      el.style.boxShadow   = '';
    }}
  >
    {/* Icon */}
    <div
      style={{
        width:          '40px',
        height:         '40px',
        borderRadius:   '10px',
        display:        'grid',
        placeItems:     'center',
        flexShrink:     0,
        background:     ICON_BG[tone],
        color:          ICON_COLOR[tone],
      }}
    >
      {icon}
    </div>

    {/* Title */}
    <div
      style={{
        fontFamily:    'var(--font-display)',
        fontWeight:    500,
        fontSize:      '17px',
        letterSpacing: '-0.01em',
      }}
    >
      {title}
    </div>

    {/* Description */}
    <div
      style={{
        fontSize: '12.5px',
        color:    'var(--color-ink-3)',
      }}
    >
      {description}
    </div>

    {/* Stats */}
    {stats && (
      <div
        style={{
          fontFamily:     'var(--font-mono)',
          fontSize:       '11px',
          color:          'var(--color-ink-3)',
          fontWeight:     600,
          marginTop:      'auto',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            background:   'var(--color-surface-2)',
            padding:      '3px 8px',
            borderRadius: '99px',
          }}
        >
          {stats.left}
        </span>
        <span
          style={{
            background:   'var(--color-surface-2)',
            padding:      '3px 8px',
            borderRadius: '99px',
          }}
        >
          {stats.right}
        </span>
      </div>
    )}
  </a>
);

AdminTile.displayName = 'AdminTile';
