'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../lib/utils';

/* ─── Types ─── */

export type BigButtonVariant = 'default' | 'brand' | 'danger' | 'success' | 'outline';

export interface BigButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BigButtonVariant;
  icon?: ReactNode;
  children: ReactNode;
}

/* ─── Variant styles ─── */

const VARIANT_STYLE: Record<BigButtonVariant, React.CSSProperties> = {
  default: {
    background: 'var(--color-ink)',
    color:      'var(--color-bg)',
    border:     'none',
  },
  brand: {
    background: 'var(--color-brand-500)',
    color:      '#fff',
    border:     'none',
  },
  danger: {
    background: 'var(--color-red)',
    color:      '#fff',
    border:     'none',
  },
  success: {
    background: 'var(--color-green)',
    color:      '#fff',
    border:     'none',
  },
  outline: {
    background: 'var(--color-surface)',
    color:      'var(--color-ink)',
    border:     '1.5px solid var(--color-line-2)',
  },
};

const VARIANT_HOVER_BG: Record<BigButtonVariant, string> = {
  default: 'var(--color-brand-500)',
  brand:   'var(--color-brand-600)',
  danger:  'var(--color-red)',
  success: 'var(--color-green)',
  outline: 'var(--color-surface-2)',
};

/* ─── Component ─── */

export const BigButton = forwardRef<HTMLButtonElement, BigButtonProps>(
  ({ variant = 'default', icon, type = 'button', disabled, children, className, style, onMouseEnter, onMouseLeave, ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={cn(className)}
      style={{
        width:          '100%',
        minHeight:      '56px',
        borderRadius:   'var(--radius-lg, 14px)',
        padding:        '18px 20px',
        fontSize:       '16px',
        fontWeight:     600,
        letterSpacing:  '0.01em',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        gap:            '10px',
        transition:     'all 150ms',
        cursor:         disabled ? 'not-allowed' : 'pointer',
        opacity:        disabled ? 0.5 : 1,
        fontFamily:     'inherit',
        ...VARIANT_STYLE[variant],
        ...style,
      }}
      onMouseEnter={e => {
        if (disabled) return;
        e.currentTarget.style.background = VARIANT_HOVER_BG[variant];
        onMouseEnter?.(e);
      }}
      onMouseLeave={e => {
        if (disabled) return;
        e.currentTarget.style.background = VARIANT_STYLE[variant].background as string;
        onMouseLeave?.(e);
      }}
      {...props}
    >
      {icon && (
        <span
          style={{
            width:      '20px',
            height:     '20px',
            display:    'flex',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </span>
      )}
      {children}
    </button>
  )
);

BigButton.displayName = 'BigButton';
