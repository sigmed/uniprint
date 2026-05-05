import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';
import { cn } from '../lib/utils.js';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-[var(--color-primary)] text-[var(--color-primary-fg)]',
        secondary: 'border-transparent bg-[var(--color-bg)] text-[var(--color-fg)]',
        success: 'border-transparent bg-[var(--color-success)] text-white',
        danger: 'border-transparent bg-[var(--color-danger)] text-white',
        warning: 'border-transparent bg-[var(--color-warning)] text-white',
        outline: 'text-[var(--color-fg)]',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = ({ className, variant, ...props }: BadgeProps) => (
  <span className={cn(badgeVariants({ variant }), className)} {...props} />
);
