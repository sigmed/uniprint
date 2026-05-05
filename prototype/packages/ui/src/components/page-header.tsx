import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  meta?: ReactNode;
  border?: boolean;
  className?: string;
}

export const PageHeader = ({
  title,
  description,
  breadcrumbs,
  actions,
  meta,
  border = true,
  className,
}: PageHeaderProps) => (
  <header
    className={cn(
      'py-6 md:py-8',
      border && 'border-b border-[var(--color-border)]',
      className,
    )}
  >
    {breadcrumbs != null && breadcrumbs.length > 0 && (
      <nav aria-label="Хлебные крошки" className="mb-2">
        <ol className="flex flex-wrap items-center gap-1">
          {breadcrumbs.map((crumb, idx) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: breadcrumbs have no stable id; idx is safe here
            <li key={idx} className="flex items-center gap-1">
              {idx > 0 && (
                <ChevronRight
                  size={14}
                  className="text-[var(--color-fg-muted)] shrink-0"
                  aria-hidden="true"
                />
              )}
              {crumb.href != null ? (
                <a
                  href={crumb.href}
                  className={cn(
                    'text-[var(--text-sm)] text-[var(--color-fg-muted)]',
                    'hover:text-[var(--color-fg)] transition-colors',
                    'focus-visible:outline-none focus-visible:ring-[var(--focus-ring-width)] focus-visible:ring-[var(--focus-ring-color)]',
                  )}
                >
                  {crumb.label}
                </a>
              ) : (
                <span
                  className="text-[var(--text-sm)] text-[var(--color-fg-muted)]"
                  aria-current={idx === breadcrumbs.length - 1 ? 'page' : undefined}
                >
                  {crumb.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    )}

    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h1
          className={cn(
            'font-[var(--font-display)] text-[var(--text-2xl)]',
            'font-[var(--font-weight-bold)] tracking-[var(--tracking-tight)]',
            'text-[var(--color-fg)] leading-[var(--leading-tight)]',
          )}
        >
          {title}
        </h1>
        {description != null && (
          <p className="text-[var(--text-sm)] text-[var(--color-fg-muted)] leading-[var(--leading-normal)]">
            {description}
          </p>
        )}
        {meta != null && <div className="mt-2 flex flex-wrap items-center gap-2">{meta}</div>}
      </div>
      {actions != null && (
        <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>
      )}
    </div>
  </header>
);
PageHeader.displayName = 'PageHeader';
