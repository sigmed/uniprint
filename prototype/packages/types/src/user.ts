export type Role =
  | 'owner' | 'production_chief' | 'printer' | 'laser' | 'mounter' | 'carpenter'
  | 'designer' | 'warehouse_keeper' | 'manager_office' | 'manager_field'
  | 'driver' | 'admin' | 'client';

export interface User {
  id: string;
  fullName: string;
  role: Role;
  phone: string;
  email?: string;
  active: boolean;
  hiredAt: string;
  faceTemplateId?: string;
  faceConsentAt?: string;
  createdAt: string;
  /** Last successful login timestamp. Optional — для legacy users. */
  lastLoginAt?: string;
}
