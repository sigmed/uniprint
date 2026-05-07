import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../lib/utils';

/* ─── Card ─── */

const cardVariants = cva(
  /* base: mockup .card — white surface, warm border, 16px radius */
  'bg-[var(--color-surface)] border border-[var(--color-line)] rounded-[var(--radius-xl)] overflow-hidden',
  {
    variants: {
      variant: {
        flat:        '',
        raised:      'shadow-[var(--shadow-sm)]',
        interactive: [
          'shadow-[var(--shadow-xs)]',
          'transition-[box-shadow,transform] duration-150',
          'hover:shadow-[var(--shadow-sm)] hover:-translate-y-px cursor-pointer',
        ].join(' '),
        outlined:    'border-2 border-[var(--color-line-2)]',
      },
      tone: {
        default: '',
        success: 'border-l-4 border-l-[var(--color-green)]',
        warning: 'border-l-4 border-l-[var(--color-amber)]',
        danger:  'border-l-4 border-l-[var(--color-red)]',
        accent:  'border-l-4 border-l-[var(--color-blue)]',
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
    <div
      ref={ref}
      className={cn(
        'flex items-center justify-between gap-3 flex-wrap',
        'px-[22px] py-4 border-b border-[var(--color-line)]',
        className,
      )}
      {...props}
    />
  ),
);
CardHeader.displayName = 'CardHeader';

/* ─── CardTitle ─── */

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, style, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('flex items-center gap-2', className)}
      style={{
        fontFamily:    'var(--font-display)',
        fontWeight:    500,
        fontSize:      '18px',
        letterSpacing: '-0.01em',
        color:         'var(--color-ink)',
        lineHeight:    1.25,
        ...style,
      }}
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
      className={cn('text-[13px] text-[var(--color-ink-3)] leading-[var(--leading-normal)]', className)}
      {...props}
    />
  ),
);
CardDescription.displayName = 'CardDescription';

/* ─── CardContent ─── */

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-[22px]', className)} {...props} />
  ),
);
CardContent.displayName = 'CardContent';

/* ─── CardFooter ─── */

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center px-[22px] py-4',
        'border-t border-[var(--color-line)] bg-[var(--color-surface-3)]',
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

const trendArrows: Record<TrendDirection, string> = {
  up:   '↑',
  down: '↓',
  flat: '→',
};

/**
 * Returns inline color for trend indicator.
 *
 * Semantics: `isGood` = «is the OUTCOME good for the business», independent
 * from direction. Direction только влияет на arrow (↑↓→), цвет — от isGood.
 *
 *  - flat                 → neutral (ink-3)
 *  - any direction + good → green
 *  - any direction + !good → coral/red (brand-600)
 *
 * Resolves three prior incidents where down+good was rendered coral
 * (cost decrease) and down+!good was rendered green (loss with downward trend).
 */
function trendColor(direction: TrendDirection, isGood: boolean): string {
  if (direction === 'flat') return 'var(--color-ink-3)';
  return isGood ? 'var(--color-green)' : 'var(--color-brand-600)';
}

const kpiSizeMap = {
  sm: {
    padding:     '12px 14px',
    labelSize:   '10px',
    valueSize:   '22px',
    deltaSize:   '10.5px',
  },
  md: {
    padding:     '16px 18px',
    labelSize:   '10.5px',
    valueSize:   '28px',
    deltaSize:   '11.5px',
  },
  lg: {
    padding:     '20px 22px',
    labelSize:   '11px',
    valueSize:   '36px',
    deltaSize:   '12px',
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
  const color = trendColor(trend, trendIsGood);

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={{
        background:   'var(--color-surface)',
        border:       '1px solid var(--color-line)',
        borderRadius: '14px',
        padding:      sz.padding,
      }}
    >
      {/* Decorative radial glow — mockup .stat::after */}
      <span
        aria-hidden="true"
        style={{
          position:     'absolute',
          right:        '-20px',
          top:          '-20px',
          width:        '80px',
          height:       '80px',
          borderRadius: '50%',
          background:   'radial-gradient(circle, var(--color-surface-2), transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Label row */}
      <div
        style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          fontSize:       sz.labelSize,
          color:          'var(--color-ink-3)',
          fontWeight:     600,
          letterSpacing:  '0.08em',
          textTransform:  'uppercase',
        }}
      >
        <span>{label}</span>
        {icon != null && (
          <span style={{ opacity: 0.5 }} aria-hidden="true">
            {icon}
          </span>
        )}
      </div>

      {/* Value row */}
      <div
        className="tabular"
        style={{
          marginTop:    '4px',
          lineHeight:   1.1,
          display:      'flex',
          alignItems:   'baseline',
          gap:          '2px',
        }}
      >
        <span
          style={{
            fontFamily:    'var(--font-display)',
            fontWeight:    500,
            fontSize:      sz.valueSize,
            letterSpacing: '-0.02em',
            color:         'var(--color-ink)',
          }}
        >
          {value}
        </span>
        {unit != null && (
          <sup
            style={{
              fontSize:   '13px',
              color:      'var(--color-ink-3)',
              fontWeight: 400,
              marginLeft: '3px',
            }}
          >
            {unit}
          </sup>
        )}
      </div>

      {/* Trend / delta */}
      {delta != null && (
        <div
          style={{
            display:    'inline-flex',
            alignItems: 'center',
            gap:        '4px',
            marginTop:  '6px',
            fontSize:   sz.deltaSize,
            fontWeight: 600,
            color,
          }}
        >
          <span aria-hidden="true">{trendArrows[trend]}</span>
          <span>{delta}</span>
        </div>
      )}

      {/* Hint */}
      {hint != null && (
        <p
          style={{
            marginTop: '6px',
            fontSize:  '11px',
            color:     'var(--color-ink-3)',
          }}
        >
          {hint}
        </p>
      )}
    </div>
  );
};
KpiCard.displayName = 'KpiCard';
