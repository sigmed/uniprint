import { Info } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../lib/utils';

export interface BRRule {
  code: string;
  text: string;
}

export interface BRCalloutProps {
  rules: BRRule[];
  icon?: ReactNode;
  className?: string;
}

/**
 * BRCallout — inline business-rule reminder used in warehouse and production PWA cabinets.
 * Renders one or more BR-XX badges with their descriptions.
 * Server component (no state, no interaction).
 */
export const BRCallout = ({ rules, icon, className }: BRCalloutProps) => (
  <div
    role="note"
    aria-label="Бизнес-правила"
    className={cn(className)}
    style={{
      background: 'linear-gradient(135deg, rgba(217,83,30,.06), rgba(201,132,42,.06))',
      border: '1px solid var(--color-line-2)',
      borderRadius: 'var(--radius-lg)',
      padding: '12px 14px',
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start',
      fontSize: 12.5,
      color: 'var(--color-ink-2)',
      lineHeight: 1.45,
    }}
  >
    {/* Icon — default to lucide Info */}
    <span
      aria-hidden="true"
      style={{
        color: 'var(--color-brand-500)',
        flexShrink: 0,
        marginTop: 1,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {icon ?? <Info size={16} strokeWidth={2} />}
    </span>

    {/* Rules content */}
    <span>
      {rules.length === 1 ? (
        /* Single rule — one line */
        <>
          <BRCode>{rules[0]?.code}</BRCode>
          {' · '}
          {rules[0]?.text}
        </>
      ) : (
        /* Multiple rules — one per line */
        rules.map((rule, idx) => (
          <span key={rule.code}>
            {idx > 0 && <br />}
            <BRCode>{rule.code}</BRCode>
            {' · '}
            {rule.text}
          </span>
        ))
      )}
    </span>
  </div>
);
BRCallout.displayName = 'BRCallout';

/* ── Internal helper ── */
const BRCode = ({ children }: { children: ReactNode }) => (
  <b
    style={{
      fontFamily: 'var(--font-mono)',
      fontWeight: 600,
      color: 'var(--color-brand-700)',
      fontSize: 12,
      marginRight: 2,
    }}
  >
    {children}
  </b>
);
