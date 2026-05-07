import { Construction, Hammer } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../lib/utils';

export type ComingSoonVariant = 'planned' | 'not-found';

export interface ComingSoonProps {
  /** Заголовок. Default: «Скоро здесь будет…» (planned) или «Страница не найдена» (404). */
  title?: string;
  /** Подзаголовок (имя фичи или route). */
  subtitle?: string;
  /** Описание — что планируется на этом экране. */
  description?: string;
  /** Бейдж-статус под заголовком. Default подобран по variant. */
  badge?: string;
  /** Иконка в круге. Default подобран по variant. */
  icon?: ReactNode;
  /** Действие — кнопка-ссылка. */
  homeHref?: string;
  /** Текст action button. */
  homeLabel?: string;
  /** «planned» — для известных будущих фич; «not-found» — для произвольных 404. */
  variant?: ComingSoonVariant;
  className?: string;
}

const DEFAULTS: Record<ComingSoonVariant, { title: string; badge: string; icon: ReactNode }> = {
  planned: {
    title: 'Скоро здесь будет',
    badge: 'В РАЗРАБОТКЕ',
    icon: <Hammer size={28} strokeWidth={1.6} />,
  },
  'not-found': {
    title: 'Страница не найдена',
    badge: '404 · НЕТ ТАКОЙ СТРАНИЦЫ',
    icon: <Construction size={28} strokeWidth={1.6} />,
  },
};

/**
 * ComingSoon — заглушка для запланированных фич и 404. Используется в:
 * - PWA табах-плейсхолдерах (production: смена/заработок/история; warehouse: остатки)
 * - not-found.tsx всех 6 кабинетов
 *
 * Дизайн-консистентность: cream surface card с coral icon + Fraunces title + Manrope body.
 * Не зависит от layout (PWA или AppShell).
 */
export const ComingSoon = ({
  title,
  subtitle,
  description,
  badge,
  icon,
  homeHref = '/',
  homeLabel = 'Вернуться на главную',
  variant = 'planned',
  className,
}: ComingSoonProps) => {
  const def = DEFAULTS[variant];
  const finalTitle = title ?? def.title;
  const finalBadge = badge ?? def.badge;
  const finalIcon = icon ?? def.icon;

  return (
    <div
      className={cn('flex flex-col items-center justify-center text-center', className)}
      style={{
        padding: '40px 24px',
        gap: 14,
        minHeight: '60vh',
      }}
    >
      {/* Icon circle */}
      <div
        aria-hidden="true"
        style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--color-brand-50), #F8D5BF)',
          color: 'var(--color-brand-600)',
          display: 'grid',
          placeItems: 'center',
          marginBottom: 6,
        }}
      >
        {finalIcon}
      </div>

      {/* Badge pill */}
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10.5,
          letterSpacing: '0.12em',
          color: 'var(--color-brand-700)',
          background: 'var(--color-brand-50)',
          padding: '4px 10px',
          borderRadius: 99,
          fontWeight: 600,
        }}
      >
        {finalBadge}
      </span>

      {/* Title */}
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 500,
          fontSize: 28,
          letterSpacing: '-0.02em',
          color: 'var(--color-ink)',
          lineHeight: 1.15,
          margin: 0,
          maxWidth: 320,
        }}
      >
        {finalTitle}
      </h1>

      {/* Subtitle */}
      {subtitle != null && (
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            fontStyle: 'italic',
            fontSize: 16,
            color: 'var(--color-brand-600)',
            margin: 0,
            maxWidth: 320,
          }}
        >
          {subtitle}
        </p>
      )}

      {/* Description */}
      {description != null && (
        <p
          style={{
            fontSize: 13.5,
            color: 'var(--color-ink-3)',
            lineHeight: 1.5,
            maxWidth: 320,
            margin: 0,
          }}
        >
          {description}
        </p>
      )}

      {/* Home action */}
      {homeHref != null && (
        <a
          href={homeHref}
          style={{
            marginTop: 8,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'var(--color-ink)',
            color: 'var(--color-bg)',
            padding: '10px 18px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'background 150ms',
          }}
        >
          {homeLabel}
        </a>
      )}
    </div>
  );
};
ComingSoon.displayName = 'ComingSoon';
