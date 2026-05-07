export type MaterialUnit = 'pcs' | 'm2' | 'lm' | 'kg' | 'l';

export interface MaterialCatalog {
  id: string;
  sku: string;
  name: string;
  unit: MaterialUnit;
  minStock: number;
  category: 'banner' | 'oracal' | 'paper' | 'ink' | 'fastener' | 'other';
  description?: string;
}

export interface MaterialBatch {
  id: string;
  materialId: string;
  receivedAt: string;
  qty: number;
  qtyRemaining: number;
  pricePerUnit: number;
  supplier?: string;
}

export interface MaterialWriteoff {
  id: string;
  materialId: string;
  batchId: string;
  orderId: string;
  qty: number;
  byUserId: string;
  at: string;
  reason: 'production' | 'rework' | 'inventory_correction';
}
