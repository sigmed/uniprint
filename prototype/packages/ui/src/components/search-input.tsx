'use client';

import { Search } from 'lucide-react';
import { type ChangeEvent, type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../lib/utils';

export interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  /** Optional kbd shortcut hint (e.g. "⌘K"). Hidden if undefined. */
  kbdHint?: string;
  className?: string;
}

/**
 * SearchInput — глобальный поиск в TopBar.
 * Search icon left + input + ⌘K kbd hint right (опционально).
 * Mockup `.search` block.
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    { value, onChange, placeholder = 'Поиск', kbdHint = '⌘K', className, ...rest },
    ref,
  ) => (
    <div
      className={cn('flex items-center gap-2', className)}
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-line)',
        borderRadius: 8,
        padding: '7px 12px',
        minWidth: 260,
        color: 'var(--color-ink-3)',
      }}
    >
      <Search size={14} aria-hidden="true" style={{ flexShrink: 0 }} />
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="flex-1 min-w-0 bg-transparent border-none outline-none"
        style={{
          color: 'var(--color-ink)',
          font: 'inherit',
        }}
        {...rest}
      />
      {kbdHint && (
        <kbd
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10.5,
            background: 'var(--color-surface-2)',
            padding: '2px 6px',
            borderRadius: 4,
            color: 'var(--color-ink-3)',
            border: '1px solid var(--color-line)',
            flexShrink: 0,
          }}
        >
          {kbdHint}
        </kbd>
      )}
    </div>
  ),
);
SearchInput.displayName = 'SearchInput';
