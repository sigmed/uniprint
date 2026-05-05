import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../lib/utils';

/* ─── Card ─── */

const cardVariants = cva(
  'rounded-[var(--radius-lg)] bg-[var(--color-surface)] overflow-hidden',
  {
    variants: {
      variant: {
        flat:        'border border-[var(--color-border)]',
        raised:      'border border-[var(--color-border)] shadow-[var(--shadow-md)]',
        interactive: [
          'border border-[var(--color-border)] shadow-[var(--shadow-sm)]',
          'transition-shadow hover:shadow-[var(--shadow-md)] cursor-pointer',
        ].join(' '),
        outlined:    'border-2 border-[var(--color-border-strong)]',
      },
      tone: {
        default: '',
        success: 'border-l-4 border-l-[var(--color-success-500)]',
        warning: 'border-l-4 border-l-[var(--color-warning-500)]',
        danger:  'border-l-4 border-l-[var(--color-danger-500)]',
        accent:  'border-l-4 border-l-[var(--color-accent-500)]',
      },
    },
    defaultVariants: { variant: 'flat', tone: 'default' },
  },
);

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, tone, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, tone }), className)}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

/* ─── CardHeader ─── */

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-1.5 px-6 pt-6 pb-0', className)} {...props} />
  ),
);
CardHeader.displayName = 'CardHeader';

/* ─── CardTitle ─── */

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'font-[var(--font-display)] text-[var(--text-lg)] font-[var(--font-weight-semibold)]',
        'leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-fg)]',
        className,
      )}
      {...props}
    />
  ),
);
CardTitle.displayName = 'CardTitle';

/* ─── CardDescription ─── */

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-[var(--text-sm)] text-[var(--color-fg-muted)] leading-[var(--leading-normal)]', className)}
      {...props}
    />
  ),
);
CardDescription.displayName = 'CardDescription';

/* ─── CardContent ─── */

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6', className)} {...props} />
  ),
);
CardContent.displayName = 'CardContent';

/* ─── CardFooter ─── */

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center px-6 py-4 border-t border-[var(--color-border)] bg-[var(--color-bg-subtle)]',
        className,
      )}
      {...props}
    />
  ),
);
CardFooter.displayName = 'CardFooter';

/* ─── KpiCard ─── */

type TrendDirection = 'up' | 'down' | 'flat';

export interface KpiCardProps {
  label: string;
  value: ReactNode;
  unit?: string;
  delta?: string;
  trend?: TrendDirection;
  trendIsGood?: boolean;
  icon?: ReactNode;
  hint?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const trendColors: Record<TrendDirection, (isGood: boolean) => string> = {
  up:   (good) => good ? 'text-[var(--color-success-600)]' : 'text-[var(--color-danger-600)]',
  down: (good) => good ? 'text-[var(--color-danger-600)]' : 'text-[var(--color-success-600)]',
  flat: (_)    => 'text-[var(--color-fg-muted)]',
};

const trendArrows: Record<TrendDirection, string> = {
  up:   '↑',
  down: '↓',
  flat: '→',
};

const kpiSizeMap = {
  sm: {
    wrapper: 'p-4',
    label:   'text-[var(--text-2xs)]',
    value:   'text-[var(--text-xl)] font-[var(--font-weight-bold)]',
    delta:   'text-[var(--text-xs)]',
  },
  md: {
    wrapper: 'p-5',
    label:   'text-[var(--text-xs)]',
    value:   'text-[var(--text-2xl)] font-[var(--font-weight-bold)]',
    delta:   'text-[var(--text-sm)]',
  },
  lg: {
    wrapper: 'p-6',
    label:   'text-[var(--text-sm)]',
    value:   'text-[var(--text-3xl)] font-[var(--font-weight-display)]',
    delta:   'text-[var(--text-base)]',
  },
} as const;

export const KpiCard = ({
  label,
  value,
  unit,
  delta,
  trend = 'flat',
  trendIsGood = true,
  icon,
  hint,
  size = 'md',
  className,
}: KpiCardProps) => {
  const sz = kpiSizeMap[size];
  // biome-ignore lint/style/noNonNullAssertion: kpiSizeMap is exhaustive over size keys
  const trendColor = trendColors[trend]!(trendIsGood);

  return (
    <div
      className={cn(
        'rounded-[var(--radius-lg)] border border-[var(--color-border)]',
        'bg-[var(--color-surface)] shadow-[var(--shadow-xs)]',
        sz.wrapper,
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className={cn('overline', sz.label)}>{label}</span>
        {icon != null && (
          <span className="text-[var(--color-fg-muted)] shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}
      </div>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className={cn('tabular font-[var(--font-display)] text-[var(--color-fg)]', sz.value)}>
          {value}
        </span>
        {unit != null && (
          <span className="text-[var(--text-sm)] text-[var(--color-fg-muted)]">{unit}</span>
        )}
      </div>
      {delta != null && (
        <div className={cn('mt-1.5 flex items-center gap-1', sz.delta, trendColor)}>
          <span aria-hidden="true">{trendArrows[trend]}</span>
          <span>{delta}</span>
        </div>
      )}
      {hint != null && (
        <p className="mt-2 text-[var(--text-2xs)] text-[var(--color-fg-muted)]">{hint}</p>
      )}
    </div>
  );
};
KpiCard.displayName = 'KpiCard';
