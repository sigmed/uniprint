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
      'rounded-[var(--radius-lg)] border border-dashed border-[var(--color-line-2)]',
      'bg-[var(--color-surface-3)]',
      variant === 'default' ? 'px-8 py-16 gap-4' : 'px-6 py-10 gap-3',
      className,
    )}
  >
    {icon != null && (
      <div
        className={cn(
          'flex items-center justify-center rounded-full',
          'bg-[var(--color-surface)] border border-[var(--color-line)]',
          'text-[var(--color-ink-3)]',
          variant === 'default' ? 'w-16 h-16' : 'w-12 h-12',
        )}
        aria-hidden="true"
      >
        {icon}
      </div>
    )}
    <div className={cn('flex flex-col gap-1', variant === 'compact' && 'gap-0.5')}>
      <p
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: variant === 'default' ? 500 : 400,
          fontSize:   variant === 'default' ? '20px' : '16px',
          color:      'var(--color-ink)',
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </p>
      {description != null && (
        <p
          className={cn(
            'text-[var(--color-ink-3)] max-w-xs',
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
