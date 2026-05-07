import type { RoleOption } from '../components/role-switcher';

export type RoleKey = 'client' | 'manager' | 'production' | 'warehouse' | 'admin' | 'owner';

interface RoleConfig {
  key: RoleKey;
  label: string;
  /** Local dev port (3001..3006). */
  port: number;
  /** Vercel project subdomain (uniprint-{subdomain}.vercel.app). */
  vercelSubdomain: string;
}

/**
 * 6 кабинетов UniPrint в порядке отображения:
 * Клиент → Менеджер → Производство → Склад → Админ → Учредитель.
 *
 * Vercel project naming convention: `uniprint-{subdomain}` → `uniprint-{subdomain}.vercel.app`.
 */
const ROLE_CONFIGS: RoleConfig[] = [
  { key: 'client',     label: 'Клиент',              port: 3001, vercelSubdomain: 'client' },
  { key: 'manager',    label: 'Менеджер',            port: 3002, vercelSubdomain: 'manager' },
  { key: 'production', label: 'Производство · PWA',  port: 3003, vercelSubdomain: 'production' },
  { key: 'warehouse',  label: 'Склад · PWA',         port: 3004, vercelSubdomain: 'warehouse' },
  { key: 'admin',      label: 'Админ',               port: 3005, vercelSubdomain: 'admin' },
  { key: 'owner',      label: 'Учредитель',          port: 3006, vercelSubdomain: 'owner' },
];

/**
 * Резолвит URL'ы для всех 6 кабинетов на основе текущего host.
 *
 * - На localhost (или без host) → `http://localhost:300X`
 * - На *.vercel.app → `https://uniprint-{subdomain}.vercel.app` (production)
 * - Для preview deploys (`uniprint-owner-abc123.vercel.app`) — линки идут на
 *   production URL'ы соседних кабинетов. Cross-preview navigation не
 *   поддержано (Phase-0 prototype).
 *
 * Использовать в layout.tsx через `await headers()`:
 *
 *     const headersList = await headers();
 *     const roles = getRoles(headersList.get('host'));
 *     <RoleSwitcher current="owner" roles={roles} />
 */
export function getRoles(host?: string | null): RoleOption[] {
  const isVercel = host?.endsWith('.vercel.app') ?? false;
  return ROLE_CONFIGS.map(({ key, label, port, vercelSubdomain }) => ({
    key,
    label,
    href: isVercel
      ? `https://uniprint-${vercelSubdomain}.vercel.app`
      : `http://localhost:${port}`,
  }));
}

/**
 * Backwards-compat дефолт (localhost). Используется когда host недоступен —
 * например в Storybook или unit-тестах. В production предпочитайте `getRoles(host)`.
 */
export const ROLES: RoleOption[] = getRoles();
