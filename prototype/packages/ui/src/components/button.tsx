import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../lib/utils';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 font-medium transition-all',
    'rounded-[var(--radius-md)] select-none whitespace-nowrap',
    'disabled:pointer-events-none disabled:opacity-40',
    'active:scale-[0.98]',
    'focus-visible:outline-[var(--focus-ring-width)] focus-visible:outline-solid',
    'focus-visible:outline-[var(--focus-ring-color)] focus-visible:outline-offset-[var(--focus-ring-offset)]',
  ].join(' '),
  {
    variants: {
      variant: {
        /** primary: ink bg, cream text; hover → coral + glow + lift. */
        brand: [
          'bg-[var(--color-ink)] [color:var(--color-bg)]',
          'hover:bg-[var(--color-brand-500)] hover:-translate-y-px hover:shadow-[var(--shadow-coral-glow)]',
          'active:bg-[var(--color-brand-600)] active:translate-y-0',
        ].join(' '),
        /** secondary / ghost: bordered, muted */
        secondary: [
          'bg-transparent text-[var(--color-ink-2)]',
          'border border-[var(--color-line)]',
          'hover:bg-[var(--color-surface-2)] hover:border-[var(--color-line-2)]',
        ].join(' '),
        outline: [
          'bg-transparent text-[var(--color-brand-500)]',
          'border border-[var(--color-brand-500)]',
          'hover:bg-[var(--color-brand-50)]',
        ].join(' '),
        ghost: [
          'bg-transparent text-[var(--color-ink-2)]',
          'border border-[var(--color-line)]',
          'hover:bg-[var(--color-surface-2)]',
        ].join(' '),
        danger: [
          'bg-[var(--color-red)] text-white',
          'hover:bg-[var(--color-red-ink)] hover:-translate-y-px',
          'active:translate-y-0',
        ].join(' '),
        link: [
          'bg-transparent text-[var(--color-brand-500)] underline-offset-4',
          'hover:underline hover:text-[var(--color-brand-600)]',
          'p-0 h-auto font-normal',
        ].join(' '),
      },
      size: {
        // NB: `length:` hint inside arbitrary value disambiguates from color hint.
        // Without it Tailwind 4 also generates a color rule that overrides variant fg.
        xs:    'h-7 px-2.5 text-[length:var(--text-xs)]',
        sm:    'h-8 px-3 text-[length:var(--text-sm)]',
        md:    'h-9 px-4 text-[length:var(--text-sm)]',
        lg:    'h-11 px-5 text-[length:var(--text-base)]',
        touch: 'min-h-[var(--size-touch-min)] px-4 py-2 text-[length:var(--text-base)]',
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
