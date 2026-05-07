import type { Client } from '@uniprint/types';

/**
 * Demo clients fixture. Первые 8 — реальные имена из `Docs/design/references`
 * (User.png + manager.png). Остальные 42 — procedural для seed-данных.
 *
 * cli_001 = ООО «Рассвет» — primary B2B клиент для client-portal demo.
 */

interface DemoClient {
  type: Client['type'];
  name: string;
  phone: string;
  email?: string;
  inn?: string;
}

const NAMED: DemoClient[] = [
  { type: 'b2b',         name: 'ООО «Рассвет»',      phone: '+79991110001', email: 'orders@rassvet.ru', inn: '7710000001' },
  { type: 'individual',  name: 'ИП Воронов',         phone: '+79991110002', email: 'voronov@example.ru' },
  { type: 'b2b',         name: 'ООО «Маяк»',         phone: '+79991110003', email: 'info@mayak.ru',     inn: '7710000003' },
  { type: 'smb',         name: 'Кофейня «Бариста»',   phone: '+79991110004', email: 'hello@barista.ru' },
  { type: 'individual',  name: 'ИП Грачёв',          phone: '+79991110005', email: 'gr@example.ru' },
  { type: 'b2b',         name: 'ООО «Север»',         phone: '+79991110006', email: 'office@sever.ru',   inn: '7710000006' },
  { type: 'individual',  name: 'ИП Соколов',         phone: '+79991110007' },
  { type: 'smb',         name: 'Студия «Линия»',      phone: '+79991110008', email: 'linia@example.ru' },
];

export const clientsFixture: Client[] = Array.from({ length: 50 }, (_, i) => {
  const named = NAMED[i];
  if (named != null) {
    const client: Client = {
      id: `cli_${String(i + 1).padStart(3, '0')}`,
      type: named.type,
      name: named.name,
      phone: named.phone,
      address: `г. Москва, ул. Пример, д. ${i + 1}`,
      createdAt: new Date(2025, 0, i + 1).toISOString(),
    };
    if (named.email != null) client.email = named.email;
    if (named.inn != null) client.inn = named.inn;
    return client;
  }
  const isB2b = i % 3 === 0;
  const client: Client = {
    id: `cli_${String(i + 1).padStart(3, '0')}`,
    type: isB2b ? 'b2b' : i % 5 === 0 ? 'smb' : 'individual',
    name: isB2b ? `ООО «Пример-${i + 1}»` : `Клиент ${i + 1}`,
    phone: `+79${String(200000000 + i).padStart(9, '0')}`,
    address: `г. Москва, ул. Пример, д. ${i + 1}`,
    createdAt: new Date(2025, 0, i + 1).toISOString(),
  };
  if (i % 2 === 0) client.email = `client${i + 1}@example.ru`;
  if (isB2b) client.inn = `77${String(10000000 + i).padStart(8, '0')}`;
  return client;
});
