import { BatteryFull, Signal, Wifi } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../lib/utils';

export interface PhoneFrameProps {
  children: ReactNode;
  showStatusBar?: boolean;
  time?: string;
  className?: string;
}

/**
 * PhoneFrame — wrapper for PWA mobile cabinets.
 * On desktop: renders a visual phone bezel (420px wide) for demo/preview.
 * On mobile (≤480px): full-screen, no chrome.
 * Server component (no state).
 */
export const PhoneFrame = ({
  children,
  showStatusBar = true,
  time = '9:41',
  className,
}: PhoneFrameProps) => (
  /* Outer centering wrapper */
  <div
    className={cn(
      // desktop: centered container with surface-2 bg
      'flex justify-center min-h-screen',
      'bg-[var(--color-surface-2)]',
      'py-6 px-0',
      // mobile (≤480px): no padding
      'max-[480px]:py-0 max-[480px]:px-0',
      className,
    )}
  >
    {/* Inner phone bezel */}
    <div
      className={cn(
        // sizing
        'flex flex-col',
        // desktop chrome
        'rounded-[var(--radius-2xl)] border border-[var(--color-line)]',
        'overflow-hidden',
        'shadow-[var(--shadow-xl)]',
        // mobile: no chrome
        'max-[480px]:rounded-none max-[480px]:border-0 max-[480px]:shadow-none max-[480px]:min-h-svh',
      )}
      style={{
        width: 'min(420px, 100vw)',
        background: 'var(--color-bg)',
        minHeight: 780,
        position: 'relative',
      }}
    >
      {/* Status bar — desktop preview only (на actual mobile дублирует системную) */}
      {showStatusBar && (
        <div
          aria-hidden="true"
          className="max-[480px]:hidden"
          style={{
            height: 32,
            background: '#0E0A07',
            color: '#EFE6D6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 18px',
            fontSize: 11,
            fontWeight: 600,
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.04em',
            flexShrink: 0,
          }}
        >
          {/* Time — left */}
          <span>{time}</span>
          {/* Status icons — right */}
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Signal size={13} strokeWidth={2} />
            <Wifi size={13} strokeWidth={2} />
            <BatteryFull size={13} strokeWidth={2} />
          </span>
        </div>
      )}

      {/* Page content fills the rest */}
      {children}
    </div>
  </div>
);
PhoneFrame.displayName = 'PhoneFrame';
