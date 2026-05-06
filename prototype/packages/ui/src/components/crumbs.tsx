import { Fragment } from 'react';
import { cn } from '../lib/utils';

export interface CrumbItem {
  label: string;
  href?: string;
}

export interface CrumbsProps {
  items: CrumbItem[];
  className?: string;
}

/**
 * Crumbs — breadcrumb navigation для TopBar. Last item bold.
 * Iconless, slash separator, mockup `.crumbs` style.
 * Server component.
 */
export const Crumbs = ({ items, className }: CrumbsProps) => (
  <nav
    aria-label="Breadcrumb"
    className={cn('flex items-center gap-2 text-[13px]', className)}
    style={{ color: 'var(--color-ink-3)' }}
  >
    {items.map((item, idx) => {
      const isLast = idx === items.length - 1;
      return (
        <Fragment key={`${item.label}-${idx}`}>
          {idx > 0 && (
            <span aria-hidden="true" style={{ color: 'var(--color-ink-4)' }}>
              /
            </span>
          )}
          {isLast || !item.href ? (
            <span
              style={{
                color: isLast ? 'var(--color-ink)' : 'var(--color-ink-3)',
                fontWeight: isLast ? 500 : 400,
              }}
              aria-current={isLast ? 'page' : undefined}
            >
              {item.label}
            </span>
          ) : (
            <a
              href={item.href}
              style={{
                color: 'var(--color-ink-3)',
                textDecoration: 'none',
              }}
            >
              {item.label}
            </a>
          )}
        </Fragment>
      );
    })}
  </nav>
);
Crumbs.displayName = 'Crumbs';
