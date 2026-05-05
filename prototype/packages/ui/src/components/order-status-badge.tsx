import type { OrderStatus } from '@uniprint/types';
import { Badge } from './badge';

const STATUS_LABELS: Record<OrderStatus, string> = {
  draft: 'Черновик',
  lead: 'Лид',
  measured: 'Замер сделан',
  designing: 'На дизайне',
  design_review: 'Проверка макета',
  client_approval: 'Согласование с клиентом',
  queued: 'В очереди',
  in_production: 'В производстве',
  in_qc: 'На контроле',
  defect_rework: 'Брак / переделка',
  ready: 'Готов',
  delivered: 'Выдан',
  closed: 'Закрыт',
  cancelled: 'Отменён',
};

const STATUS_VARIANTS: Record<OrderStatus, 'default' | 'secondary' | 'success' | 'danger' | 'warning' | 'outline'> = {
  draft: 'secondary',
  lead: 'outline',
  measured: 'outline',
  designing: 'default',
  design_review: 'warning',
  client_approval: 'warning',
  queued: 'secondary',
  in_production: 'default',
  in_qc: 'warning',
  defect_rework: 'danger',
  ready: 'success',
  delivered: 'success',
  closed: 'secondary',
  cancelled: 'outline',
};

export const OrderStatusBadge = ({ status }: { status: OrderStatus }) => (
  <Badge variant={STATUS_VARIANTS[status]!}>{STATUS_LABELS[status]!}</Badge>
);
