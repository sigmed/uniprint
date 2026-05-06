export type OrderType = 'cex' | 'office' | 'goods';

export type OrderStatus =
  | 'draft' | 'lead' | 'measured' | 'designing' | 'design_review'
  | 'client_approval' | 'queued' | 'in_production' | 'in_qc'
  | 'defect_rework' | 'ready' | 'delivered' | 'closed' | 'cancelled';

export interface Order {
  id: string;
  number: string;
  type: OrderType;
  status: OrderStatus;
  clientId: string;
  managerId: string;
  designerId?: string;
  branchId: 'main';
  title: string;
  itemsCount: number;
  priceTotal: number;
  costEstimate?: number;
  costActual?: number;
  dueDate?: string;
  /** Optional human meta для display в orders table (например «люверсы, ПВХ 440 г/м²»). */
  metaText?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  catalogServiceId: string;
  qty: number;
  unitPrice: number;
  notes?: string;
}

export interface OrderHistoryEntry {
  id: string;
  orderId: string;
  fromStatus: OrderStatus | null;
  toStatus: OrderStatus;
  byUserId: string;
  at: string;
  comment?: string;
}
