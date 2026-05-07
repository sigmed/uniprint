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
        neutral:        'bg-[var(--color-surface-2)] text-[var(--color-ink-2)] border border-[var(--color-line)]',
        brand:          'bg-[var(--color-brand-500)] text-white',
        accent:         'bg-[var(--color-blue)] text-white',
        success:        'bg-[var(--color-green)] text-white',
        warning:        'bg-[var(--color-amber)] text-white',
        danger:         'bg-[var(--color-red)] text-white',
        info:           'bg-[var(--color-blue)] text-white',
        'success-soft': 'bg-[var(--color-green-soft)] text-[var(--color-green-ink)] border border-[var(--color-green-soft)]',
        'warning-soft': 'bg-[var(--color-amber-soft)] text-[var(--color-amber-ink)] border border-[var(--color-amber-soft)]',
        'danger-soft':  'bg-[var(--color-red-soft)]   text-[var(--color-red-ink)]   border border-[var(--color-red-soft)]',
        'info-soft':    'bg-[var(--color-blue-soft)]  text-[var(--color-blue-ink)]  border border-[var(--color-blue-soft)]',
        outline:        'border border-[var(--color-line-2)] text-[var(--color-ink)] bg-transparent',
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
