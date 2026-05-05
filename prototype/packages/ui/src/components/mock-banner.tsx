'use client';

import { Construction, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';

const MOCK_NOTICE = 'PROTOTYPE — данные синтетические, реальные ПДн вводить запрещено';
const DISMISSED_KEY = 'uniprint:mock-banner-dismissed';

export interface MockBannerProps {
  message?: string;
  dismissible?: boolean;
  variant?: 'subtle' | 'striped';
}

export const MockBanner = ({
  message = MOCK_NOTICE,
  dismissible = false,
  variant = 'subtle',
}: MockBannerProps) => {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissible) {
      setDismissed(localStorage.getItem(DISMISSED_KEY) === '1');
    }
  }, [dismissible]);

  if (dismissed) return null;

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, '1');
    setDismissed(true);
  };

  return (
    <output
      aria-label="Баннер прототипа"
      className={cn(
        'flex items-center gap-2 px-4 py-1.5',
        variant === 'striped' ? 'mock-banner--striped' : 'mock-banner',
      )}
    >
      <Construction size={12} aria-hidden="true" className="shrink-0" />
      <span className="flex-1 text-center">{message}</span>
      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Закрыть баннер"
          className="ml-2 shrink-0 rounded opacity-60 hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current"
        >
          <X size={12} strokeWidth={2.5} aria-hidden="true" />
        </button>
      )}
    </output>
  );
};
MockBanner.displayName = 'MockBanner';
