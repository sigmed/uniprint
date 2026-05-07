import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from 'react';
import { cn } from '../lib/utils';

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  icon: ReactNode;
  ariaLabel: string;
  /** Show small notification dot indicator (top-right). */
  withDot?: boolean;
  /** Dot color (default: brand). */
  dotColor?: string;
  type?: 'button' | 'submit' | 'reset';
}

/**
 * IconButton — 36×36 квадратная кнопка с иконкой (lucide). Опциональный dot
 * индикатор для notification. Используется в TopBar (bell, settings и т.д.).
 * Mockup `.icon-btn` block.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, ariaLabel, withDot, dotColor, type = 'button', className, ...rest }, ref) => (
    <button
      ref={ref}
      type={type}
      aria-label={ariaLabel}
      className={cn('relative shrink-0 grid place-items-center', className)}
      style={{
        width: 36,
        height: 36,
        borderRadius: 8,
        background: 'var(--color-surface)',
        border: '1px solid var(--color-line)',
        color: 'var(--color-ink-2)',
        cursor: 'pointer',
      }}
      {...rest}
    >
      {icon}
      {withDot && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: dotColor ?? 'var(--color-brand-500)',
            border: '1.5px solid var(--color-surface)',
          }}
        />
      )}
    </button>
  ),
);
IconButton.displayName = 'IconButton';
