import { cn } from '../lib/utils';

/* ─── Types ─── */

export interface ShiftBarProps {
  text: string;
  duration: string;
  variant?: 'green' | 'amber';
  className?: string;
}

/* ─── Variant maps ─── */

const BAR_BG: Record<'green' | 'amber', string> = {
  green: 'rgba(92, 138, 58, 0.15)',
  amber: 'rgba(201, 132, 42, 0.15)',
};

const BAR_BORDER: Record<'green' | 'amber', string> = {
  green: '1px solid rgba(92, 138, 58, 0.3)',
  amber: '1px solid rgba(201, 132, 42, 0.3)',
};

const BAR_COLOR: Record<'green' | 'amber', string> = {
  green: '#C5DDA8',
  amber: '#E5BA70',
};

const DOT_BG: Record<'green' | 'amber', string> = {
  green: '#8FBE5F',
  amber: '#E0AA6A',
};

const DOT_SHADOW: Record<'green' | 'amber', string> = {
  green: '0 0 0 3px rgba(143, 190, 95, 0.25)',
  amber: '0 0 0 3px rgba(224, 170, 106, 0.25)',
};

const DOT_ANIMATION: Record<'green' | 'amber', string> = {
  green: 'pulse-shift-green 2s infinite',
  amber: 'pulse-shift-amber 1.8s infinite',
};

/* ─── Component ─── */

export const ShiftBar = ({
  text,
  duration,
  variant = 'green',
  className,
}: ShiftBarProps) => (
  <>
    {/* Keyframes injected inline via a style tag — avoids global CSS dependency */}
    <style>{`
      @keyframes pulse-shift-green {
        0%, 100% { box-shadow: 0 0 0 3px rgba(143,190,95,.25); }
        50%       { box-shadow: 0 0 0 5px rgba(143,190,95,0);   }
      }
      @keyframes pulse-shift-amber {
        0%, 100% { box-shadow: 0 0 0 3px rgba(224,170,106,.25); }
        50%       { box-shadow: 0 0 0 5px rgba(224,170,106,0);  }
      }
    `}</style>

    <div
      className={cn(className)}
      style={{
        padding:    '10px 18px',
        background: BAR_BG[variant],
        borderTop:  BAR_BORDER[variant],
        display:    'flex',
        alignItems: 'center',
        gap:        '9px',
        fontSize:   '12.5px',
        fontWeight: 500,
        color:      BAR_COLOR[variant],
      }}
    >
      {/* Animated dot */}
      <span
        aria-hidden="true"
        style={{
          display:      'inline-block',
          width:        '7px',
          height:       '7px',
          borderRadius: '50%',
          flexShrink:   0,
          background:   DOT_BG[variant],
          boxShadow:    DOT_SHADOW[variant],
          animation:    DOT_ANIMATION[variant],
        }}
      />

      {/* Text */}
      <span style={{ flex: 1 }}>{text}</span>

      {/* Duration */}
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize:   '12px',
          color:      'var(--color-bg)',
          fontWeight: 600,
        }}
      >
        {duration}
      </span>
    </div>
  </>
);

ShiftBar.displayName = 'ShiftBar';
