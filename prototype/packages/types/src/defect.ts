export type DefectStage = 'design' | 'production' | 'material' | 'unknown';

export interface Defect {
  id: string;
  orderId: string;
  reportedByUserId: string;
  qty: number;
  stage: DefectStage;
  responsibleUserId?: string;
  photos: string[];
  reason: string;
  reportedAt: string;
  reworkOrderId?: string;
}
