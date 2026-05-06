import type { ReactNode } from 'react';
import { cn } from '../lib/utils';

export type StatPillTone =
  | 'done'
  | 'work'
  | 'queue'
  | 'new'
  | 'review'
  | 'design'
  | 'defect'
  | 'neutral';

interface ToneConfig {
  bg: string;
  fg: string;
  dot: string;
}

const TONE_CONFIG: Record<StatPillTone, ToneConfig> = {
  done:    { bg: 'var(--color-green-soft)',  fg: 'var(--color-green-ink)',  dot: 'var(--color-green)'     },
  work:    { bg: 'var(--color-amber-soft)',  fg: 'var(--color-amber-ink)',  dot: 'var(--color-amber)'     },
  queue:   { bg: 'var(--color-blue-soft)',   fg: 'var(--color-blue-ink)',   dot: 'var(--color-blue)'      },
  new:     { bg: 'var(--color-brand-50)',    fg: 'var(--color-brand-700)',  dot: 'var(--color-brand-500)' },
  review:  { bg: '#EAE2D2',                  fg: '#5D5448',                 dot: '#9C8E73'                },
  design:  { bg: '#E8DFEC',                  fg: '#4A3158',                 dot: '#7B5896'                },
  defect:  { bg: 'var(--color-red-soft)',    fg: 'var(--color-red-ink)',    dot: 'var(--color-red)'       },
  neutral: { bg: 'var(--color-surface-2)',   fg: 'var(--color-ink-3)',      dot: 'var(--color-ink-4)'     },
};

export interface StatPillProps {
  tone: StatPillTone;
  pulse?: boolean;
  withDot?: boolean;
  children: ReactNode;
  className?: string;
}

export const StatPill = ({
  tone,
  pulse = false,
  withDot = true,
  children,
  className,
}: StatPillProps) => {
  const config = TONE_CONFIG[tone];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full',
        'font-semibold text-[11.5px] leading-none whitespace-nowrap select-none',
        className,
      )}
      style={{ background: config.bg, color: config.fg }}
    >
      {withDot && (
        <span
          className={cn(
            'inline-block w-1.5 h-1.5 rounded-full shrink-0',
            pulse && '[animation:pulse-amber_1.8s_infinite]',
          )}
          style={{ background: config.dot }}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
};
StatPill.displayName = 'StatPill';
