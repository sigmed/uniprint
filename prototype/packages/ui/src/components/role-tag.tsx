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

/**
 * Все 6 ролей используют единый coral-стиль per reference (User.png, manager.png,
 * admin.png, owner.png, production.png, Storage.png) — RoleTag это
 * брендированный «вы здесь» индикатор, не семантический tone.
 *
 * Tone API сохранён для будущей дифференциации (data-tone attribute остаётся для
 * tests / e2e), но визуально все идентичны.
 */
const CORAL = { bg: 'var(--color-brand-50)', fg: 'var(--color-brand-700)' };

const TONE_CONFIG: Record<RoleTagTone, { bg: string; fg: string }> = {
  client:     CORAL,
  manager:    CORAL,
  production: CORAL,
  warehouse:  CORAL,
  admin:      CORAL,
  owner:      CORAL,
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
