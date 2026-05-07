import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

/* ─── Types ─── */

export type PwaTaskCardTone = 'default' | 'active' | 'queued';

export interface PwaTaskCardProps {
  href?: string;
  id: string;
  status?: ReactNode;
  title: string;
  meta?: ReactNode;
  showArrow?: boolean;
  tone?: PwaTaskCardTone;
  className?: string;
}

/* ─── Tone map ─── */

const TONE_STYLE: Record<PwaTaskCardTone, React.CSSProperties> = {
  default: {},
  active: {
    borderColor: 'var(--color-brand-500)',
    background:  'linear-gradient(135deg, #FFF7F1, var(--color-surface))',
  },
  queued: {},
};

/* ─── Inner content ─── */

const Inner = ({
  id,
  status,
  title,
  meta,
  showArrow,
  hasHref,
}: {
  id: string;
  status?: ReactNode;
  title: string;
  meta?: ReactNode;
  showArrow: boolean;
  hasHref: boolean;
}) => (
  <>
    {/* Head row: id + status */}
    <div
      style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        gap:            '10px',
        marginBottom:   '8px',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize:   '11.5px',
          fontWeight: 600,
          color:      'var(--color-ink-3)',
        }}
      >
        {id}
      </span>
      {status}
    </div>

    {/* Title */}
    <div
      style={{
        fontWeight:   600,
        fontSize:     '15px',
        color:        'var(--color-ink)',
        lineHeight:   1.3,
        marginBottom: '4px',
        paddingRight: hasHref && showArrow ? '24px' : 0,
      }}
    >
      {title}
    </div>

    {/* Meta */}
    {meta && (
      <div
        style={{
          fontSize:   '12.5px',
          color:      'var(--color-ink-3)',
          display:    'flex',
          alignItems: 'center',
          gap:        '8px',
          flexWrap:   'wrap',
        }}
      >
        {meta}
      </div>
    )}

    {/* Arrow */}
    {hasHref && showArrow && (
      <div
        style={{
          position:  'absolute',
          right:     '14px',
          top:       '50%',
          transform: 'translateY(-50%)',
          color:     'var(--color-ink-4)',
        }}
      >
        <ChevronRight size={18} strokeWidth={2} />
      </div>
    )}
  </>
);

/* ─── Component ─── */

const baseStyle: React.CSSProperties = {
  background:    'var(--color-surface)',
  border:        '1px solid var(--color-line)',
  borderRadius:  '14px',
  padding:       '14px',
  marginBottom:  '10px',
  display:       'block',
  textDecoration: 'none',
  color:         'inherit',
  transition:    'all 150ms',
  position:      'relative',
};

export const PwaTaskCard = ({
  href,
  id,
  status,
  title,
  meta,
  showArrow = true,
  tone = 'default',
  className,
}: PwaTaskCardProps) => {
  const mergedStyle: React.CSSProperties = {
    ...baseStyle,
    ...TONE_STYLE[tone],
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    if (tone !== 'active') el.style.borderColor = 'var(--color-line-2)';
    el.style.transform = 'translateY(-1px)';
    el.style.boxShadow = 'var(--shadow-sm)';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    el.style.borderColor = tone === 'active' ? 'var(--color-brand-500)' : 'var(--color-line)';
    el.style.transform   = '';
    el.style.boxShadow   = '';
  };

  const innerProps = { id, status, title, meta, showArrow, hasHref: Boolean(href) };

  if (href) {
    return (
      <a
        href={href}
        className={cn(className)}
        style={mergedStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Inner {...innerProps} />
      </a>
    );
  }

  return (
    <div
      className={cn(className)}
      style={mergedStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Inner {...innerProps} />
    </div>
  );
};

PwaTaskCard.displayName = 'PwaTaskCard';
