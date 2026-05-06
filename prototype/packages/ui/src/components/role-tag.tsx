import type { ReactNode } from 'react';
import { cn } from '../lib/utils';

export type RoleTagTone =
  | 'client'
  | 'manager'
  | 'production'
  | 'warehouse'
  | 'admin'
  | 'owner';

export interface RoleTagProps {
  tone: RoleTagTone;
  children: ReactNode;
  className?: string;
}

/**
 * RoleTag — uppercase pill с цветной точкой для обозначения роли пользователя
 * и контекста (например «Клиент · ООО Рассвет»). Стоит над PageHeader.
 *
 * Match `.role-tag.{tone}` из mockup. Server component.
 */

const TONE_CONFIG: Record<RoleTagTone, { bg: string; fg: string }> = {
  client:     { bg: 'var(--color-brand-50)',  fg: 'var(--color-brand-700)' },
  manager:    { bg: 'var(--color-blue-soft)', fg: 'var(--color-blue-ink)' },
  production: { bg: 'var(--color-green-soft)', fg: 'var(--color-green-ink)' },
  warehouse:  { bg: 'var(--color-amber-soft)', fg: 'var(--color-amber-ink)' },
  admin:      { bg: '#E8E1D3',                fg: '#5D5448' },
  owner:      { bg: '#EFE3D6',                fg: '#5A4030' },
};

export const RoleTag = ({ tone, children, className }: RoleTagProps) => {
  const cfg = TONE_CONFIG[tone];

  return (
    <span
      data-tone={tone}
      className={cn(
        'inline-flex items-center gap-[7px] rounded-full select-none',
        'mb-[14px] font-[var(--font-weight-semibold)]',
        className,
      )}
      style={{
        background: cfg.bg,
        color: cfg.fg,
        padding: '5px 11px',
        fontSize: 11,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: 'currentColor',
          flexShrink: 0,
        }}
      />
      {children}
    </span>
  );
};
RoleTag.displayName = 'RoleTag';
