import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../lib/utils';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 font-medium transition-colors',
    'rounded-[var(--radius-md)] select-none whitespace-nowrap',
    'disabled:pointer-events-none disabled:opacity-40',
    'active:scale-[0.98]',
    'focus-visible:outline-[var(--focus-ring-width)] focus-visible:outline-solid',
    'focus-visible:outline-[var(--focus-ring-color)] focus-visible:outline-offset-[var(--focus-ring-offset)]',
  ].join(' '),
  {
    variants: {
      variant: {
        brand: [
          'bg-[var(--color-primary)] text-[var(--color-primary-fg)]',
          'hover:bg-[var(--color-primary-hover)] active:bg-[var(--color-primary-active)]',
        ].join(' '),
        secondary: [
          'bg-[var(--color-bg-subtle)] text-[var(--color-fg)]',
          'border border-[var(--color-border)]',
          'hover:bg-[var(--color-gray-200)] hover:border-[var(--color-border-strong)]',
        ].join(' '),
        outline: [
          'bg-transparent text-[var(--color-primary)]',
          'border border-[var(--color-primary)]',
          'hover:bg-[var(--color-brand-50)]',
        ].join(' '),
        ghost: [
          'bg-transparent text-[var(--color-fg-subtle)]',
          'hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-fg)]',
        ].join(' '),
        danger: [
          'bg-[var(--color-danger-500)] text-white',
          'hover:bg-[var(--color-danger-600)] active:bg-[var(--color-danger-700)]',
        ].join(' '),
        link: [
          'bg-transparent text-[var(--color-primary)] underline-offset-4',
          'hover:underline hover:text-[var(--color-primary-hover)]',
          'p-0 h-auto font-normal',
        ].join(' '),
      },
      size: {
        xs:    'h-7 px-2.5 text-[var(--text-xs)]',
        sm:    'h-8 px-3 text-[var(--text-sm)]',
        md:    'h-9 px-4 text-[var(--text-sm)]',
        lg:    'h-11 px-5 text-[var(--text-base)]',
        touch: 'min-h-[var(--size-touch-min)] px-4 py-2 text-[var(--text-base)]',
        icon:  'h-9 w-9 p-0',
      },
      block: {
        true:  'w-full',
        false: '',
      },
    },
    defaultVariants: { variant: 'brand', size: 'md', block: false },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  loadingText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      block,
      loading = false,
      loadingText,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      disabled={disabled ?? loading}
      aria-busy={loading}
      className={cn(buttonVariants({ variant, size, block }), className)}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" size={14} aria-hidden="true" />
          {loadingText ?? children}
        </>
      ) : (
        <>
          {leftIcon != null && <span aria-hidden="true">{leftIcon}</span>}
          {children}
          {rightIcon != null && <span aria-hidden="true">{rightIcon}</span>}
        </>
      )}
    </button>
  ),
);
Button.displayName = 'Button';
