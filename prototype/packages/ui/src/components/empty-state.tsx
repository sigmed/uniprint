import type { ReactNode } from 'react';
import { cn } from '../lib/utils';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  secondaryAction?: ReactNode;
  variant?: 'default' | 'compact';
  className?: string;
}

export const EmptyState = ({
  icon,
  title,
  description,
  action,
  secondaryAction,
  variant = 'default',
  className,
}: EmptyStateProps) => (
  <div
    className={cn(
      'flex flex-col items-center justify-center text-center',
      'rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)]',
      'bg-[var(--color-bg-subtle)]',
      variant === 'default' ? 'px-8 py-16 gap-4' : 'px-6 py-10 gap-3',
      className,
    )}
  >
    {icon != null && (
      <div
        className={cn(
          'flex items-center justify-center rounded-full',
          'bg-[var(--color-bg)] border border-[var(--color-border)]',
          'text-[var(--color-fg-muted)]',
          variant === 'default' ? 'w-14 h-14' : 'w-10 h-10',
        )}
        aria-hidden="true"
      >
        {icon}
      </div>
    )}
    <div className={cn('flex flex-col gap-1', variant === 'compact' && 'gap-0.5')}>
      <p
        className={cn(
          'font-[var(--font-display)] font-[var(--font-weight-semibold)] text-[var(--color-fg)]',
          variant === 'default' ? 'text-[var(--text-base)]' : 'text-[var(--text-sm)]',
        )}
      >
        {title}
      </p>
      {description != null && (
        <p
          className={cn(
            'text-[var(--color-fg-muted)] max-w-xs',
            variant === 'default' ? 'text-[var(--text-sm)]' : 'text-[var(--text-xs)]',
          )}
        >
          {description}
        </p>
      )}
    </div>
    {(action != null || secondaryAction != null) && (
      <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
        {action}
        {secondaryAction}
      </div>
    )}
  </div>
);
EmptyState.displayName = 'EmptyState';
