'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '../lib/utils';

export interface BarRowProps {
  label: string;
  hint?: string;
  percent: number;
  value: ReactNode;
  unit?: string;
  className?: string;
}

export const BarRow = ({
  label,
  hint,
  percent,
  value,
  unit,
  className,
}: BarRowProps) => {
  const target = Math.min(Math.max(percent, 0), 100);
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      setAnimatedPercent(target);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setAnimatedPercent(target);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [target]);

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        display:      'flex',
        alignItems:   'center',
        gap:          '14px',
        padding:      '12px 0',
        borderBottom: '1px solid var(--color-line)',
      }}
    >
      {/* Label section */}
      <div style={{ flex: '0 0 160px' }}>
        <span
          style={{
            fontSize:   '13px',
            fontWeight: 500,
            color:      'var(--color-ink)',
            display:    'block',
          }}
        >
          {label}
        </span>
        {hint != null && (
          <span
            style={{
              display:    'block',
              fontSize:   '11px',
              color:      'var(--color-ink-3)',
              fontWeight: 400,
              marginTop:  '1px',
            }}
          >
            {hint}
          </span>
        )}
      </div>

      {/* Track */}
      <div
        style={{
          flex:         '1',
          height:       '10px',
          background:   'var(--color-surface-2)',
          borderRadius: '99px',
          overflow:     'hidden',
          position:     'relative',
        }}
      >
        {/* Fill */}
        <div
          style={{
            height:       '100%',
            borderRadius: '99px',
            background:   'linear-gradient(90deg, var(--color-brand-500), var(--color-gold))',
            width:        `${animatedPercent}%`,
            transition:   'width 600ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>

      {/* Value section */}
      <div
        style={{
          flex:      '0 0 100px',
          textAlign: 'right',
        }}
      >
        <span
          style={{
            fontFamily:  'var(--font-display)',
            fontWeight:  500,
            fontSize:    '14px',
            color:       'var(--color-ink)',
            display:     'block',
          }}
        >
          {value}
        </span>
        {unit != null && (
          <span
            style={{
              display:    'block',
              fontFamily: 'var(--font-sans)',
              fontSize:   '11px',
              color:      'var(--color-ink-3)',
              fontWeight: 500,
              marginTop:  '1px',
            }}
          >
            {unit}
          </span>
        )}
      </div>
    </div>
  );
};
BarRow.displayName = 'BarRow';
