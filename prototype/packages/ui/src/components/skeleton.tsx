import type { CSSProperties } from 'react';
import { cn } from '../lib/utils';

type SkeletonVariant = 'text' | 'title' | 'rect' | 'circle' | 'button';

export interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  lines?: number;
  className?: string;
}

const shimmerClass = [
  'bg-gradient-to-r',
  'from-[var(--color-gray-100)] via-[var(--color-gray-200)] to-[var(--color-gray-100)]',
  'bg-[length:200%_100%]',
  '[animation:shimmer_1.6s_ease-in-out_infinite]',
  'rounded-[var(--radius-sm)]',
].join(' ');

const toStyleValue = (v: string | number | undefined): string | undefined =>
  v == null ? undefined : typeof v === 'number' ? `${v}px` : v;

const variantClasses: Record<SkeletonVariant, string> = {
  text:   'h-4 w-full',
  title:  'h-6 w-3/4',
  rect:   'h-20 w-full',
  circle: 'rounded-full h-10 w-10',
  button: 'h-9 w-24',
};

interface SingleSkeletonProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  className?: string;
}

const SingleSkeleton = ({
  variant = 'rect',
  width,
  height,
  className,
}: SingleSkeletonProps) => {
  const w = toStyleValue(width);
  const h = toStyleValue(height);

  const style: CSSProperties = {
    ...(w != null ? { width: w } : {}),
    ...(h != null ? { height: h } : {}),
  };

  return (
    <span
      aria-hidden="true"
      className={cn(shimmerClass, variantClasses[variant], className)}
      style={style}
    />
  );
};

export const Skeleton = ({
  variant = 'rect',
  width,
  height,
  lines,
  className,
}: SkeletonProps) => {
  if (variant === 'text' && lines != null && lines > 1) {
    return (
      <output
        aria-label="Загрузка..."
        className="flex flex-col gap-2"
      >
        {Array.from({ length: lines }, (_, i) => {
          const isLast = i === lines - 1;
          const lineKey = `skeleton-line-${i}`;
          return (
            <SingleSkeleton
              key={lineKey}
              variant="text"
              {...(isLast ? { width: '60%' } : {})}
              {...(className != null ? { className } : {})}
            />
          );
        })}
      </output>
    );
  }

  return (
    <output aria-label="Загрузка..." className="inline-block">
      <SingleSkeleton
        variant={variant}
        {...(width != null ? { width } : {})}
        {...(height != null ? { height } : {})}
        {...(className != null ? { className } : {})}
      />
    </output>
  );
};
Skeleton.displayName = 'Skeleton';
