import { forwardRef, useId, type SelectHTMLAttributes } from 'react';
import { cn } from '../lib/utils';

type SelectSize = 'sm' | 'md' | 'lg' | 'touch';

const heightMap: Record<SelectSize, string> = {
  sm:    'h-8  text-[var(--text-sm)]   px-2.5',
  md:    'h-9  text-[13.5px]           px-3',
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
            className="text-[11.5px] font-[var(--font-weight-semibold)] text-[var(--color-ink-2)] tracking-[0.01em]"
          >
            {label}
            {required === true && (
              <span className="ml-0.5 text-[var(--color-brand-500)]" aria-hidden="true">
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
              /* base */
              'flex w-full appearance-none rounded-[9px] border',
              'bg-[var(--color-bg)] text-[var(--color-ink)]',
              'pr-9 transition-[border-color,box-shadow,background] duration-150 cursor-pointer',
              /* hover */
              'hover:border-[var(--color-line-2)]',
              /* focus */
              'focus-visible:outline-none',
              'focus-visible:border-[var(--color-brand-500)]',
              'focus-visible:bg-[var(--color-surface)]',
              'focus-visible:shadow-[0_0_0_3px_rgba(217,83,30,0.12)]',
              /* disabled */
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--color-surface-2)]',
              /* error vs normal border */
              hasError
                ? 'border-[var(--color-red)] focus-visible:shadow-[0_0_0_3px_rgba(184,64,26,0.12)]'
                : 'border-[var(--color-line)]',
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
          {/* ChevronDown arrow — inline SVG, matches mockup chevron color var(--color-ink-3) */}
          <span
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-3)]"
            aria-hidden="true"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>
        {hasHint && !hasError && (
          <p id={hintId} className="text-[var(--text-xs)] text-[var(--color-ink-3)]">
            {hint}
          </p>
        )}
        {hasError && (
          <p id={errorId} role="alert" className="text-[var(--text-xs)] text-[var(--color-red-ink)]">
            {error}
          </p>
        )}
      </div>
    );
  },
);
Select.displayName = 'Select';
