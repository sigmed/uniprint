import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  /** Optional substring of title to italicize in coral (Fraunces <em> accent) */
  accentText?: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  meta?: ReactNode;
  border?: boolean;
  className?: string;
}

/** Wraps accentText portion in <em> with coral color if found in title */
function renderTitle(title: string, accentText?: string): ReactNode {
  if (accentText == null || accentText.length === 0) return title;
  const idx = title.indexOf(accentText);
  if (idx === -1) return title;
  const before = title.slice(0, idx);
  const after = title.slice(idx + accentText.length);
  return (
    <>
      {before}
      <em
        style={{
          fontStyle:  'italic',
          fontWeight: 400,
          color:      'var(--color-brand-500)',
        }}
      >
        {accentText}
      </em>
      {after}
    </>
  );
}

export const PageHeader = ({
  title,
  accentText,
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
      border && 'border-b border-[var(--color-line)]',
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
                  className="text-[var(--color-ink-4)] shrink-0"
                  aria-hidden="true"
                />
              )}
              {crumb.href != null ? (
                <a
                  href={crumb.href}
                  className={cn(
                    'text-[var(--text-sm)] text-[var(--color-ink-3)]',
                    'hover:text-[var(--color-ink)] transition-colors',
                    'focus-visible:outline-none focus-visible:ring-[var(--focus-ring-width)] focus-visible:ring-[var(--focus-ring-color)]',
                  )}
                >
                  {crumb.label}
                </a>
              ) : (
                <span
                  className="text-[var(--text-sm)] text-[var(--color-ink-3)]"
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
          style={{
            fontFamily:    'var(--font-display)',
            fontWeight:    500,
            fontSize:      '32px',
            letterSpacing: '-0.02em',
            lineHeight:    1.05,
            color:         'var(--color-ink)',
          }}
        >
          {renderTitle(title, accentText)}
        </h1>
        {description != null && (
          <p
            style={{
              fontSize:  '13.5px',
              color:     'var(--color-ink-3)',
              marginTop: '8px',
              maxWidth:  '560px',
              lineHeight: 1.5,
            }}
          >
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
