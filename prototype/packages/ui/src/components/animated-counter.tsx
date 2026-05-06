'use client';

import { useEffect, useState } from 'react';

export interface AnimatedCounterProps {
  value: number;
  duration?: number;
  format?: (n: number) => string;
  className?: string;
}

const defaultFormat = (n: number) => n.toLocaleString('ru-RU');

export const AnimatedCounter = ({
  value,
  duration = 800,
  format = defaultFormat,
  className,
}: AnimatedCounterProps) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    // Respect prefers-reduced-motion — skip animation entirely
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setCurrent(value);
      return;
    }

    let raf: number;
    let startTs: number | null = null;

    const step = (ts: number) => {
      if (!startTs) startTs = ts;
      const progress = Math.min((ts - startTs) / duration, 1);
      // easeOutCubic
      const eased = 1 - (1 - progress) ** 3;
      setCurrent(Math.floor(eased * value));
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      }
    };

    raf = requestAnimationFrame(step);

    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <span className={className}>{format(current)}</span>;
};
AnimatedCounter.displayName = 'AnimatedCounter';
