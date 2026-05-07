import { cn } from '../lib/utils';

export interface RoleOption {
  key: string;
  label: string;
  href: string;
}

export interface RoleSwitcherProps {
  current: string;
  roles: RoleOption[];
  protoTag?: string;
  className?: string;
}

/**
 * RoleSwitcher — sticky top bar for switching between the 6 UniPrint cabinets.
 * Used in prototype to allow owner to navigate across apps.
 * Server component (pure <a> navigation, no state).
 */
export const RoleSwitcher = ({
  current,
  roles,
  protoTag = 'PROTOTYPE · MOCK DATA',
  className,
}: RoleSwitcherProps) => (
  <nav
    aria-label="Переключение кабинета"
    className={cn(className)}
    style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(26,20,16,.97)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      color: '#EFE6D6',
      padding: '10px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      flexWrap: 'wrap',
      borderBottom: '1px solid rgba(255,255,255,.08)',
    }}
  >
    {/* ── Brand lockup ── */}
    <div
      style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        fontSize: 14,
        color: '#FAF6EF',
        letterSpacing: '-0.01em',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        paddingRight: 14,
        borderRight: '1px solid rgba(255,255,255,.1)',
        marginRight: 4,
        flexShrink: 0,
      }}
    >
      {/* Brand mark */}
      <span
        aria-hidden="true"
        style={{
          width: 24,
          height: 24,
          borderRadius: 6,
          background: 'var(--color-brand-500)',
          display: 'grid',
          placeItems: 'center',
          fontSize: 11,
          fontWeight: 700,
          color: '#fff',
          fontFamily: 'var(--font-display)',
          letterSpacing: '-0.04em',
          flexShrink: 0,
        }}
      >
        UP
      </span>
      UniPrint
    </div>

    {/* ── "Кабинет:" label — hidden on mobile ── */}
    <span
      className="max-[720px]:hidden"
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: 11.5,
        color: '#7A6E58',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        fontWeight: 500,
        marginRight: 4,
        flexShrink: 0,
      }}
    >
      Кабинет:
    </span>

    {/* ── Role pills ── */}
    {roles.map((role) => {
      const isActive = role.key === current;
      return (
        <a
          key={role.key}
          href={role.href}
          aria-current={isActive ? 'page' : undefined}
          style={{
            background: isActive ? 'var(--color-brand-500)' : 'rgba(255,255,255,.04)',
            border: isActive
              ? '1px solid transparent'
              : '1px solid rgba(255,255,255,.08)',
            color: isActive ? '#fff' : '#C9BDA6',
            padding: '7px 13px',
            borderRadius: 99,
            fontSize: 12.5,
            fontWeight: 500,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            whiteSpace: 'nowrap',
            boxShadow: isActive ? '0 4px 14px -4px rgba(217,83,30,.5)' : undefined,
            transition: 'all 0.15s',
            flexShrink: 0,
          }}
        >
          {/* Dot indicator */}
          <span
            aria-hidden="true"
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: isActive ? '#fff' : 'currentColor',
              opacity: isActive ? 1 : 0.7,
              flexShrink: 0,
            }}
          />
          {role.label}
        </a>
      );
    })}

    {/* ── Proto tag — right-aligned, hidden on mobile ── */}
    {protoTag && (
      <span
        className="max-[720px]:hidden"
        style={{
          marginLeft: 'auto',
          fontFamily: 'var(--font-mono)',
          fontSize: 10.5,
          background: 'rgba(201,132,42,.15)',
          color: '#E5BA70',
          border: '1px solid rgba(201,132,42,.3)',
          padding: '4px 10px',
          borderRadius: 99,
          letterSpacing: '0.06em',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        {protoTag}
      </span>
    )}
  </nav>
);
RoleSwitcher.displayName = 'RoleSwitcher';
