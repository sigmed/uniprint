import { ChevronRight, Home } from 'lucide-react';
import { Fragment, type ReactNode } from 'react';
import { cn } from '../lib/utils';

export interface CrumbItem {
  label: string;
  href?: string;
  /** Optional иконка перед label — показываем только в первом сегменте по умолчанию. */
  icon?: ReactNode;
}

export interface CrumbsProps {
  items: CrumbItem[];
  className?: string;
  /** Показать <Home> иконку в первом сегменте, если у него нет своей `icon`. */
  withHomeIcon?: boolean;
  /**
   * Max-width для каждого item в px. Длинные labels truncate с ellipsis.
   * Default 180.
   */
  itemMaxWidth?: number;
}

/**
 * Crumbs — breadcrumb navigation для TopBar. Last item bold, parents — links.
 * ChevronRight separator. Server component (без usePathname).
 *
 * Динамическая резолюция пути — через `<AutoCrumbs>` (client wrapper).
 */
export const Crumbs = ({
  items,
  className,
  withHomeIcon = false,
  itemMaxWidth = 180,
}: CrumbsProps) => (
  <nav
    aria-label="Breadcrumb"
    className={cn('flex min-w-0 items-center gap-1.5 text-[13px]', className)}
    style={{ color: 'var(--color-ink-3)' }}
  >
    {items.map((item, idx) => {
      const isLast = idx === items.length - 1;
      const isFirst = idx === 0;
      const icon = item.icon ?? (isFirst && withHomeIcon ? <Home size={13} /> : null);

      const labelEl = (
        <span
          className="truncate"
          style={{ maxWidth: itemMaxWidth, display: 'inline-block', verticalAlign: 'bottom' }}
        >
          {item.label}
        </span>
      );

      const baseStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        minWidth: 0,
      } as const;

      const content = isLast || !item.href ? (
        <span
          style={{
            ...baseStyle,
            color: isLast ? 'var(--color-ink)' : 'var(--color-ink-3)',
            fontWeight: isLast ? 500 : 400,
          }}
          aria-current={isLast ? 'page' : undefined}
        >
          {icon != null && <span aria-hidden="true">{icon}</span>}
          {labelEl}
        </span>
      ) : (
        <a
          href={item.href}
          style={{
            ...baseStyle,
            color: 'var(--color-ink-3)',
            textDecoration: 'none',
            transition: 'color 120ms',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-ink)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-ink-3)';
          }}
        >
          {icon != null && <span aria-hidden="true">{icon}</span>}
          {labelEl}
        </a>
      );

      return (
        <Fragment key={`${item.label}-${idx}`}>
          {idx > 0 && (
            <ChevronRight
              size={13}
              aria-hidden="true"
              style={{ color: 'var(--color-ink-4)', flexShrink: 0 }}
            />
          )}
          {content}
        </Fragment>
      );
    })}
  </nav>
);
Crumbs.displayName = 'Crumbs';
