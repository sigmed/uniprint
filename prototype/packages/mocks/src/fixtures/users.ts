import type { User, Role } from '@uniprint/types';

const ROLES: Role[] = [
  'owner', 'production_chief', 'printer', 'printer', 'laser', 'mounter',
  'mounter', 'carpenter', 'designer', 'designer', 'warehouse_keeper',
  'manager_office', 'manager_office', 'manager_field', 'manager_field',
  'driver', 'driver', 'admin',
  ...Array(12).fill('printer'),
] as Role[];

/**
 * Имена сотрудников, привязанные к индексам в ROLES — ради консистентности
 * между кабинетами:
 *   - usr_011 (warehouse_keeper) = Дмитрий Сорокин — отображается в warehouse-mobile
 *   - usr_012 (manager_office)   = Мария Иванова   — отображается в manager-web
 *   - usr_018 (admin)            = Сергей Петров   — отображается в admin-panel
 *
 * Первые 5 имён (видимы на дашборде admin-panel) — реалистичная команда.
 */
const NAMED: Record<number, string> = {
  0: 'Виктор Соколов',     // owner
  1: 'Михаил Петров',       // production_chief (нач. цеха)
  2: 'Алексей Кузнецов',    // printer (печатник)
  3: 'Илья Беляев',         // printer
  4: 'Андрей Лысенко',      // laser (лазерщик)
  10: 'Дмитрий Сорокин',    // warehouse_keeper
  11: 'Мария Иванова',      // manager_office
  17: 'Сергей Петров',      // admin
};

/**
 * Last-login timestamps для admin-table — варьированные per reference (Сейчас /
 * 14:52 / 08:30 / Вчера 19:14 / etc.). Index → ISO string. Используется fixture date
 * 2026-05-07 (today) и 2026-05-06 (yesterday).
 */
const TODAY = '2026-05-07';
const YESTERDAY = '2026-05-06';
const LAST_LOGINS: Record<number, string> = {
  0: `${TODAY}T14:52:00Z`,        // Виктор (owner)
  1: `${TODAY}T08:30:00Z`,        // Михаил (production_chief)
  2: `${TODAY}T09:00:00Z`,        // Алексей (printer)
  3: new Date().toISOString(),     // Илья (printer) — «Сейчас»
  4: `${YESTERDAY}T19:14:00Z`,    // Андрей (laser)
};

export const usersFixture: User[] = ROLES.map((role, i) => {
  const hasFace = ['printer', 'laser', 'mounter', 'warehouse_keeper'].includes(role);
  return {
    id: `usr_${String(i + 1).padStart(3, '0')}`,
    fullName: NAMED[i] ?? `Сотрудник ${i + 1}`,
    role,
    phone: `+79${String(100000000 + i).padStart(9, '0')}`,
    ...(i < 5 ? { email: `user${i + 1}@uniprint.local` } : {}),
    active: true,
    hiredAt: '2024-01-15T00:00:00Z',
    ...(hasFace ? { faceTemplateId: `face_${i + 1}` } : {}),
    ...(hasFace ? { faceConsentAt: '2024-01-15T09:00:00Z' } : {}),
    createdAt: '2024-01-15T00:00:00Z',
    ...(LAST_LOGINS[i] ? { lastLoginAt: LAST_LOGINS[i] } : {}),
  };
});
