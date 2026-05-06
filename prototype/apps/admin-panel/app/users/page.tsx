'use client';
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  PageHeader,
  StatPill,
  Button,
} from '@uniprint/ui';
import { UserPlus } from 'lucide-react';
import type { User } from '@uniprint/types';

const ROLE_LABELS: Record<string, string> = {
  owner: 'Учредитель',
  production_chief: 'Нач. цеха',
  printer: 'Печатник',
  laser: 'Лазерщик',
  mounter: 'Монтажник',
  carpenter: 'Плотник',
  designer: 'Дизайнер',
  warehouse_keeper: 'Складщик',
  manager_office: 'Менеджер (офис)',
  manager_field: 'Менеджер (выезд)',
  driver: 'Водитель',
  admin: 'Администратор',
  client: 'Клиент',
};

/** Get initials from a name (max 2 chars) */
function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase();
}

const AVATAR_COLORS = [
  'linear-gradient(135deg,#7AAB54,#3F6E22)',
  'linear-gradient(135deg,#5A8AA8,#2E5470)',
  'linear-gradient(135deg,#D9A84A,#A06C18)',
  'linear-gradient(135deg,#C8923A,#8C5818)',
  'linear-gradient(135deg,#8C6FA8,#5A4070)',
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch('/api/users')
      .then((r) => r.json())
      .then((d) => setUsers(d.items));
  }, []);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Пользователи"
        accentText="и роли"
        description="BR-21: биометрические согласия для производственных ролей фиксируются отдельно (152-ФЗ ст. 11)."
        actions={
          <Button variant="brand" size="md" leftIcon={<UserPlus size={15} />}>
            Добавить пользователя
          </Button>
        }
      />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Все учётные записи</CardTitle>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--color-ink-3)',
            }}
          >
            {users.length} учёток
          </span>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr style={{ background: 'var(--color-surface-3)' }}>
                  <th className="p-3 text-left font-medium" style={{ color: 'var(--color-ink-3)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>ФИО</th>
                  <th className="p-3 text-left font-medium" style={{ color: 'var(--color-ink-3)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Роль</th>
                  <th className="p-3 text-left font-medium" style={{ color: 'var(--color-ink-3)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Телефон</th>
                  <th className="p-3 text-left font-medium" style={{ color: 'var(--color-ink-3)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Биометрия</th>
                  <th className="p-3 text-left font-medium" style={{ color: 'var(--color-ink-3)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Статус</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, idx) => (
                  <tr key={u.id} className="border-t border-[var(--color-border)]">
                    {/* Avatar + Name */}
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <span
                          aria-hidden="true"
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: '50%',
                            background: AVATAR_COLORS[idx % AVATAR_COLORS.length],
                            display: 'grid',
                            placeItems: 'center',
                            fontWeight: 700,
                            color: '#fff',
                            fontSize: 11,
                            flexShrink: 0,
                            letterSpacing: '0.02em',
                          }}
                        >
                          {getInitials(u.fullName)}
                        </span>
                        <span style={{ fontWeight: 500 }}>{u.fullName}</span>
                      </div>
                    </td>
                    {/* Role */}
                    <td className="p-3">
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11.5px',
                          color: 'var(--color-ink-2)',
                        }}
                      >
                        {ROLE_LABELS[u.role] ?? u.role}
                      </span>
                    </td>
                    {/* Phone */}
                    <td className="p-3">
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11.5px',
                          color: 'var(--color-ink-3)',
                        }}
                      >
                        {u.phone}
                      </span>
                    </td>
                    {/* Face Control */}
                    <td className="p-3">
                      {u.faceTemplateId ? (
                        <StatPill tone="done">Согласие 152-ФЗ ст. 11</StatPill>
                      ) : (
                        <StatPill tone="neutral" withDot={false}>—</StatPill>
                      )}
                    </td>
                    {/* Status */}
                    <td className="p-3">
                      {u.active ? (
                        <StatPill tone="done">Активен</StatPill>
                      ) : (
                        <StatPill tone="neutral">Неактивен</StatPill>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
