'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, Badge } from '@uniprint/ui';
import type { User } from '@uniprint/types';

const ROLE_LABELS: Record<string, string> = {
  owner: 'Учредитель', production_chief: 'Нач. цеха', printer: 'Печатник',
  laser: 'Лазерщик', mounter: 'Монтажник', carpenter: 'Плотник', designer: 'Дизайнер',
  warehouse_keeper: 'Складщик', manager_office: 'Менеджер (офис)',
  manager_field: 'Менеджер (выезд)', driver: 'Водитель', admin: 'Админ', client: 'Клиент',
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => { fetch('/api/users').then((r) => r.json()).then((d) => setUsers(d.items)); }, []);
  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="text-2xl font-bold">Пользователи и роли</h1>
      <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
        BR-21: биометрические согласия для производственных ролей фиксируются отдельно (152-ФЗ ст. 11).
      </p>
      <Card className="mt-6"><CardContent className="p-0">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-bg)]">
            <tr><th className="p-3 text-left">ФИО</th><th className="p-3 text-left">Роль</th><th className="p-3 text-left">Телефон</th><th className="p-3 text-left">Биометрия</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-[var(--color-border)]">
                <td className="p-3">{u.fullName}</td>
                <td className="p-3">{ROLE_LABELS[u.role] ?? u.role}</td>
                <td className="p-3 font-mono text-xs">{u.phone}</td>
                <td className="p-3">
                  {u.faceTemplateId
                    ? <Badge variant="success">Согласие 152-ФЗ ст. 11</Badge>
                    : <Badge variant="outline">—</Badge>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent></Card>
    </main>
  );
}
