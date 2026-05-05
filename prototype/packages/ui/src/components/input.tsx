import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../lib/utils';

type InputSize = 'sm' | 'md' | 'lg' | 'touch';

const heightMap: Record<InputSize, string> = {
  sm:    'h-8  text-[var(--text-sm)]  px-2.5',
  md:    'h-9  text-[var(--text-sm)]  px-3',
  lg:    'h-11 text-[var(--text-base)] px-4',
  touch: 'min-h-[var(--size-touch-min)] text-[var(--text-base)] px-4',
};

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize;
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  prefix?: string;
  suffix?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      size = 'md',
      label,
      hint,
      error,
      required = false,
      leftIcon,
      rightIcon,
      prefix,
      suffix,
      id: idProp,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = idProp ?? generatedId;
    const hintId = `${inputId}-hint`;
    const errorId = `${inputId}-error`;
    const hasError = error != null && error.length > 0;
    const hasHint = hint != null && hint.length > 0;

    const described: string[] = [];
    if (hasHint) described.push(hintId);
    if (hasError) described.push(errorId);
    const describedBy = described.length > 0 ? described.join(' ') : undefined;

    const sizeClasses = heightMap[size];

    return (
      <div className="flex flex-col gap-1">
        {label != null && (
          <label
            htmlFor={inputId}
            className="text-[var(--text-sm)] font-[var(--font-weight-medium)] text-[var(--color-fg-subtle)]"
          >
            {label}
            {required && (
              <span className="ml-0.5 text-[var(--color-danger-500)]" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon != null && (
            <span className="absolute left-3 flex items-center text-[var(--color-fg-muted)] pointer-events-none" aria-hidden="true">
              {leftIcon}
            </span>
          )}
          {prefix != null && (
            <span className="flex items-center rounded-l-[var(--radius-md)] border border-r-0 border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3 text-[var(--text-sm)] text-[var(--color-fg-muted)] self-stretch">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            required={required}
            aria-invalid={hasError}
            {...(describedBy != null ? { 'aria-describedby': describedBy } : {})}
            className={cn(
              'flex w-full rounded-[var(--radius-md)] border bg-[var(--color-surface)]',
              'placeholder:text-[var(--color-fg-disabled)]',
              'transition-colors',
              'focus-visible:outline-none focus-visible:ring-[var(--focus-ring-width)] focus-visible:ring-[var(--focus-ring-color)]',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--color-bg-subtle)]',
              hasError
                ? 'border-[var(--color-danger-500)] focus-visible:ring-[var(--color-danger-500)]'
                : 'border-[var(--color-border)] focus-visible:ring-[var(--color-primary)]',
              prefix != null ? 'rounded-l-none' : '',
              suffix != null ? 'rounded-r-none' : '',
              leftIcon != null ? 'pl-9' : '',
              rightIcon != null ? 'pr-9' : '',
              sizeClasses,
              className,
            )}
            {...props}
          />
          {suffix != null && (
            <span className="flex items-center rounded-r-[var(--radius-md)] border border-l-0 border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3 text-[var(--text-sm)] text-[var(--color-fg-muted)] self-stretch">
              {suffix}
            </span>
          )}
          {rightIcon != null && (
            <span className="absolute right-3 flex items-center text-[var(--color-fg-muted)] pointer-events-none" aria-hidden="true">
              {rightIcon}
            </span>
          )}
        </div>
        {hasHint && !hasError && (
          <p id={hintId} className="text-[var(--text-xs)] text-[var(--color-fg-muted)]">
            {hint}
          </p>
        )}
        {hasError && (
          <p id={errorId} role="alert" className="text-[var(--text-xs)] text-[var(--color-danger-600)]">
            {error}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';
