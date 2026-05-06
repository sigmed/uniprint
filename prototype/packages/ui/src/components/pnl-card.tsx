import type { ReactNode } from 'react';
import { cn } from '../lib/utils';

/* ─── Types ─── */

export type PnlCardTone = 'profit' | 'revenue' | 'cost';

export interface PnlCardProps {
  tone: PnlCardTone;
  label: string;
  value: ReactNode;
  unit?: string;
  trend?: ReactNode;
  className?: string;
}

/* ─── Tone maps ─── */

const CARD_BG: Record<PnlCardTone, string> = {
  profit:  'linear-gradient(135deg, #F0F5E5, var(--color-green-soft))',
  revenue: 'linear-gradient(135deg, #E5EDF3, var(--color-blue-soft))',
  cost:    'linear-gradient(135deg, var(--color-brand-50), #F8D5BF)',
};

const CARD_BORDER: Record<PnlCardTone, string> = {
  profit:  '#C7D9A8',
  revenue: '#B5CCD9',
  cost:    '#E8B89E',
};

/* ─── Component ─── */

export const PnlCard = ({
  tone,
  label,
  value,
  unit,
  trend,
  className,
}: PnlCardProps) => (
  <div
    className={cn(className)}
    style={{
      background:    CARD_BG[tone],
      border:        `1px solid ${CARD_BORDER[tone]}`,
      borderRadius:  '14px',
      padding:       '18px 20px',
      position:      'relative',
      overflow:      'hidden',
    }}
  >
    {/* Label */}
    <div
      style={{
        fontSize:      '10.5px',
        fontWeight:    700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color:         'var(--color-ink-3)',
      }}
    >
      {label}
    </div>

    {/* Value */}
    <div
      style={{
        fontFamily:    'var(--font-serif)',
        fontWeight:    500,
        fontSize:      '34px',
        letterSpacing: '-0.02em',
        margin:        '6px 0 4px',
        lineHeight:    1.05,
      }}
    >
      {unit && (
        <sup
          style={{
            fontSize:   '17px',
            color:      'var(--color-ink-2)',
            fontWeight: 400,
          }}
        >
          {unit}
        </sup>
      )}
      {value}
    </div>

    {/* Trend */}
    {trend && (
      <div
        style={{
          display:    'inline-flex',
          alignItems: 'center',
          gap:        '5px',
          fontSize:   '12px',
          fontWeight: 600,
          color:      'var(--color-ink-2)',
        }}
      >
        {trend}
      </div>
    )}
  </div>
);

PnlCard.displayName = 'PnlCard';
