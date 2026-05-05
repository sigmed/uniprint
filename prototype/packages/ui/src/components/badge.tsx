import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import type { HTMLAttributes, MouseEvent } from 'react';
import { cn } from '../lib/utils';

export type BadgeVariant =
  | 'neutral'
  | 'brand'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'success-soft'
  | 'warning-soft'
  | 'danger-soft'
  | 'info-soft'
  | 'outline';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-[var(--radius-full)] font-medium leading-none select-none',
  {
    variants: {
      variant: {
        neutral:      'bg-[var(--color-bg-subtle)] text-[var(--color-fg-subtle)] border border-[var(--color-border)]',
        brand:        'bg-[var(--color-primary)] text-[var(--color-primary-fg)]',
        accent:       'bg-[var(--color-accent-500)] text-white',
        success:      'bg-[var(--color-success-500)] text-white',
        warning:      'bg-[var(--color-warning-500)] text-white',
        danger:       'bg-[var(--color-danger-500)] text-white',
        info:         'bg-[var(--color-info-500)] text-white',
        'success-soft': 'bg-[var(--color-success-50)] text-[var(--color-success-700)] border border-[var(--color-success-100)]',
        'warning-soft': 'bg-[var(--color-warning-50)] text-[var(--color-warning-700)] border border-[var(--color-warning-100)]',
        'danger-soft':  'bg-[var(--color-danger-50)]  text-[var(--color-danger-700)]  border border-[var(--color-danger-100)]',
        'info-soft':    'bg-[var(--color-info-50)]    text-[var(--color-info-700)]    border border-[var(--color-info-100)]',
        outline:      'border border-[var(--color-border-strong)] text-[var(--color-fg)] bg-transparent',
      } satisfies Record<BadgeVariant, string>,
      size: {
        sm: 'text-[var(--text-2xs)] px-2 py-0.5',
        md: 'text-[var(--text-xs)]  px-2.5 py-1',
      },
    },
    defaultVariants: { variant: 'neutral', size: 'md' },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  withDot?: boolean;
  removable?: boolean;
  onRemove?: (e: MouseEvent<HTMLButtonElement>) => void;
}

export const Badge = ({
  className,
  variant,
  size,
  withDot = false,
  removable = false,
  onRemove,
  children,
  ...props
}: BadgeProps) => (
  <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
    {withDot && (
      <span
        className="inline-block rounded-full w-1.5 h-1.5 shrink-0 bg-current opacity-70"
        aria-hidden="true"
      />
    )}
    {children}
    {removable && (
      <button
        type="button"
        onClick={onRemove}
        aria-label="Удалить метку"
        className="ml-0.5 -mr-0.5 rounded-full p-0.5 opacity-60 hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current"
      >
        <X size={10} strokeWidth={2.5} aria-hidden="true" />
      </button>
    )}
  </span>
);
Badge.displayName = 'Badge';
