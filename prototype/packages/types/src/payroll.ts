export interface OperationLog {
  id: string;
  orderId: string;
  userId: string;
  operationCode: string;
  qty: number;
  startedAt: string;
  finishedAt: string;
  payRate: number;
  payMode: 'per_unit' | 'percent_of_price';
  payAmount: number;
}

export interface PayrollPeriod {
  id: string;
  userId: string;
  periodStart: string;
  periodEnd: string;
  earned: number;
  paid: number;
  balance: number;
  payslipPdfUrl?: string;
  status: 'open' | 'finalized' | 'paid';
}
