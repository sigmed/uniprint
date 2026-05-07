export type ClientType = 'b2b' | 'smb' | 'individual';

export interface Client {
  id: string;
  type: ClientType;
  name: string;
  phone: string;
  email?: string;
  inn?: string;
  ogrn?: string;
  address?: string;
  notes?: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  clientId?: string;
  source: 'cold' | 'referral' | 'inbound' | 'tender';
  status: 'new' | 'measured' | 'quoted' | 'converted' | 'lost';
  measurements?: { width: number; height: number; notes: string };
  photos: string[];
  managerId: string;
  resultOrderId?: string;
  createdAt: string;
}
