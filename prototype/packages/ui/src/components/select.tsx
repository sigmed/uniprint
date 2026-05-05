import { forwardRef, useId, type SelectHTMLAttributes } from 'react';
import { cn } from '../lib/utils';

type SelectSize = 'sm' | 'md' | 'lg' | 'touch';

const heightMap: Record<SelectSize, string> = {
  sm:    'h-8  text-[var(--text-sm)]   px-2.5',
  md:    'h-9  text-[var(--text-sm)]   px-3',
  lg:    'h-11 text-[var(--text-base)] px-4',
  touch: 'min-h-[var(--size-touch-min)] text-[var(--text-base)] px-4',
};

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: SelectOption[];
  size?: SelectSize;
  label?: string;
  hint?: string;
  error?: string;
  placeholder?: string;
  /** Accepted but deferred — native select used; real searchable select is Phase 2 */
  searchable?: boolean;
  id?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      options,
      size = 'md',
      label,
      hint,
      error,
      placeholder,
      // searchable intentionally accepted and not used — deferred to Phase 2
      searchable: _searchable,
      id: idProp,
      required,
      className,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const selectId = idProp ?? generatedId;
    const hintId = `${selectId}-hint`;
    const errorId = `${selectId}-error`;
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
            htmlFor={selectId}
            className="text-[var(--text-sm)] font-[var(--font-weight-medium)] text-[var(--color-fg-subtle)]"
          >
            {label}
            {required === true && (
              <span className="ml-0.5 text-[var(--color-danger-500)]" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            required={required}
            aria-invalid={hasError}
            {...(describedBy != null ? { 'aria-describedby': describedBy } : {})}
            className={cn(
              'flex w-full appearance-none rounded-[var(--radius-md)] border bg-[var(--color-surface)]',
              'pr-8 transition-colors cursor-pointer',
              'focus-visible:outline-none focus-visible:ring-[var(--focus-ring-width)] focus-visible:ring-[var(--focus-ring-color)]',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--color-bg-subtle)]',
              hasError
                ? 'border-[var(--color-danger-500)] focus-visible:ring-[var(--color-danger-500)]'
                : 'border-[var(--color-border)] hover:border-[var(--color-border-strong)]',
              'text-[var(--color-fg)]',
              sizeClasses,
              className,
            )}
            {...props}
          >
            {placeholder != null && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled === true}
              >
                {opt.label}
              </option>
            ))}
          </select>
          {/* ChevronDown arrow via inline SVG — no extra import, no bg-image URL tricks */}
          <span
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-fg-muted)]"
            aria-hidden="true"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
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
Select.displayName = 'Select';
