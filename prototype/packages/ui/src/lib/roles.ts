import type { RoleOption } from '../components/role-switcher';

/**
 * ROLES — список 6 кабинетов UniPrint для RoleSwitcher.
 * Hardcoded localhost ports для dev. В production — env-driven.
 *
 * Order matches owner's cabinet order: Клиент → Менеджер → Производство → Склад → Админ → Учредитель
 */
export const ROLES: RoleOption[] = [
  { key: 'client', label: 'Клиент', href: 'http://localhost:3001' },
  { key: 'manager', label: 'Менеджер', href: 'http://localhost:3002' },
  { key: 'production', label: 'Производство · PWA', href: 'http://localhost:3003' },
  { key: 'warehouse', label: 'Склад · PWA', href: 'http://localhost:3004' },
  { key: 'admin', label: 'Админ', href: 'http://localhost:3005' },
  { key: 'owner', label: 'Учредитель', href: 'http://localhost:3006' },
];

export type RoleKey = (typeof ROLES)[number]['key'];
