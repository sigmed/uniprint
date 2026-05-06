import type { OrderStatus } from '@uniprint/types';
import { cn } from '../lib/utils';

type StatusSize = 'sm' | 'md';

interface StatusConfig {
  label: string;
  tokenKey: string;
  pulse: boolean;
}

const STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  draft:           { label: 'Черновик',                  tokenKey: 'draft',           pulse: false },
  lead:            { label: 'Лид',                       tokenKey: 'lead',            pulse: false },
  measured:        { label: 'Замер сделан',              tokenKey: 'measured',        pulse: false },
  designing:       { label: 'На дизайне',                tokenKey: 'designing',       pulse: true  },
  design_review:   { label: 'Проверка макета',           tokenKey: 'design-review',   pulse: false },
  client_approval: { label: 'Согласование с клиентом',  tokenKey: 'client-approval', pulse: true  },
  queued:          { label: 'В очереди',                 tokenKey: 'queued',          pulse: false },
  in_production:   { label: 'В производстве',            tokenKey: 'in-production',   pulse: true  },
  in_qc:           { label: 'На контроле',               tokenKey: 'in-qc',           pulse: false },
  defect_rework:   { label: 'Брак / переделка',          tokenKey: 'defect',          pulse: true  },
  ready:           { label: 'Готов',                     tokenKey: 'ready',           pulse: false },
  delivered:       { label: 'Выдан',                     tokenKey: 'delivered',       pulse: false },
  closed:          { label: 'Закрыт',                    tokenKey: 'closed',          pulse: false },
  cancelled:       { label: 'Отменён',                   tokenKey: 'cancelled',       pulse: false },
};

export interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: StatusSize;
  withDot?: boolean;
  className?: string;
}

const sizeClasses: Record<StatusSize, string> = {
  sm: 'text-[var(--text-2xs)] px-2   py-0.5 gap-1',
  md: 'text-[var(--text-xs)]  px-2.5 py-1   gap-1.5',
};

const dotSizeClasses: Record<StatusSize, string> = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2   h-2',
};

export const OrderStatusBadge = ({
  status,
  size = 'md',
  withDot = true,
  className,
}: OrderStatusBadgeProps) => {
  // biome-ignore lint/style/noNonNullAssertion: STATUS_CONFIG is exhaustive over OrderStatus
  const config = STATUS_CONFIG[status]!;
  const key = config.tokenKey;

  return (
    <span
      data-status={status}
      className={cn(
        'inline-flex items-center rounded-[var(--radius-full)] font-[var(--font-weight-semibold)] leading-none select-none',
        sizeClasses[size],
        className,
      )}
      style={{
        background: `var(--status-${key}-bg)`,
        color: `var(--status-${key}-fg)`,
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: `var(--status-${key}-border)`,
      }}
    >
      {withDot && (
        <span
          className={cn(
            'inline-block rounded-full shrink-0 bg-current',
            dotSizeClasses[size],
            config.pulse && '[animation:pulse-amber_1.8s_infinite]',
          )}
          aria-hidden="true"
        />
      )}
      {config.label}
    </span>
  );
};
OrderStatusBadge.displayName = 'OrderStatusBadge';
