import type { Client } from '@uniprint/types';

export const clientsFixture: Client[] = Array.from({ length: 50 }, (_, i) => {
  const isB2b = i % 3 === 0;
  return {
    id: `cli_${String(i + 1).padStart(3, '0')}`,
    type: isB2b ? 'b2b' : i % 5 === 0 ? 'smb' : 'individual',
    name: isB2b ? `ООО «Пример-${i + 1}»` : `Клиент ${i + 1}`,
    phone: `+79${String(200000000 + i).padStart(9, '0')}`,
    ...(i % 2 === 0 ? { email: `client${i + 1}@example.ru` } : {}),
    ...(isB2b ? { inn: `77${String(10000000 + i).padStart(8, '0')}` } : {}),
    address: `г. Москва, ул. Пример, д. ${i + 1}`,
    createdAt: new Date(2025, 0, i + 1).toISOString(),
  };
});
