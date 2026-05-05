import type { User, Role } from '@uniprint/types';

const ROLES: Role[] = [
  'owner', 'production_chief', 'printer', 'printer', 'laser', 'mounter',
  'mounter', 'carpenter', 'designer', 'designer', 'warehouse_keeper',
  'manager_office', 'manager_office', 'manager_field', 'manager_field',
  'driver', 'driver', 'admin',
  ...Array(12).fill('printer'),
] as Role[];

export const usersFixture: User[] = ROLES.map((role, i) => {
  const hasFace = ['printer', 'laser', 'mounter', 'warehouse_keeper'].includes(role);
  return {
    id: `usr_${String(i + 1).padStart(3, '0')}`,
    fullName: `Сотрудник ${i + 1}`,
    role,
    phone: `+79${String(100000000 + i).padStart(9, '0')}`,
    ...(i < 5 ? { email: `user${i + 1}@uniprint.local` } : {}),
    active: true,
    hiredAt: '2024-01-15T00:00:00Z',
    ...(hasFace ? { faceTemplateId: `face_${i + 1}` } : {}),
    ...(hasFace ? { faceConsentAt: '2024-01-15T09:00:00Z' } : {}),
    createdAt: '2024-01-15T00:00:00Z',
  };
});
