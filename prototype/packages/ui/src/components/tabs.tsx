'use client';

import { type KeyboardEvent } from 'react';
import { cn } from '../lib/utils';

export interface TabItem {
  value: string;
  label: string;
}

export interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  ariaLabel?: string;
}

/**
 * Tabs — pill-style controlled tabs для CardHead (Все/В работе/Готовы/Архив,
 * Канбан/Список/Календарь, Сегодня/Неделя/Месяц/Год).
 * Mockup `.tabs` block: bg surface-2 padding 3, item rounded-md, active bg-surface.
 * Keyboard: arrows для навигации, Enter/Space — select.
 */
export const Tabs = ({
  items,
  value,
  onChange,
  className,
  ariaLabel = 'Вкладки',
}: TabsProps) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const idx = items.findIndex((it) => it.value === value);
    if (idx < 0) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const next = items[(idx + 1) % items.length];
      if (next) onChange(next.value);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = items[(idx - 1 + items.length) % items.length];
      if (prev) onChange(prev.value);
    }
  };

  return (
    // biome-ignore lint/a11y/useSemanticElements: tablist role on div is correct ARIA pattern
    <div
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className={cn('inline-flex gap-[2px]', className)}
      style={{
        background: 'var(--color-surface-2)',
        padding: 3,
        borderRadius: 8,
      }}
    >
      {items.map((item) => {
        const isActive = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(item.value)}
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              fontSize: 12.5,
              fontWeight: 500,
              color: isActive ? 'var(--color-ink)' : 'var(--color-ink-3)',
              background: isActive ? 'var(--color-surface)' : 'transparent',
              boxShadow: isActive ? '0 1px 2px rgba(0,0,0,.04)' : undefined,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};
Tabs.displayName = 'Tabs';
