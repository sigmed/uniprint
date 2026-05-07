'use client';
import { useEffect, useState } from 'react';
import {
  AdminTile,
  AnimatedCounter,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  KpiCard,
  PageHeader,
  RoleTag,
  Skeleton,
  StatPill,
} from '@uniprint/ui';
import {
  Briefcase,
  Camera,
  FileText,
  List,
  Package,
  Plus,
  Shield,
  Users,
} from 'lucide-react';
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

/** Human-friendly last-login: «Сейчас» / «HH:MM сегодня» / «Вчера HH:MM» / DD.MM.YYYY. */
function formatLastLogin(iso?: string): string {
  if (!iso) return '—';
  const date = new Date(iso);
  const now = new Date();
  const diffMin = Math.round((now.getTime() - date.getTime()) / 60_000);
  if (diffMin < 2) return 'Сейчас';
  const time = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) return `${time} сегодня`;
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return `Вчера ${time}`;
  return date.toLocaleDateString('ru-RU');
}

const AVATAR_COLORS = [
  'linear-gradient(135deg,#7AAB54,#3F6E22)',
  'linear-gradient(135deg,#5A8AA8,#2E5470)',
  'linear-gradient(135deg,#D9A84A,#A06C18)',
  'linear-gradient(135deg,#C8923A,#8C5818)',
  'linear-gradient(135deg,#8C6FA8,#5A4070)',
];

export default function AdminHome() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users')
      .then((r) => r.json())
      .then((d) => {
        setUsers(d.items);
        setLoading(false);
      });
  }, []);

  // Show top-5 users by last-login recency (per admin.png reference order:
  // Мария / Алексей / Дмитрий / Сергей / Виктор). Users без lastLoginAt — в конец.
  const previewUsers = [...users]
    .sort((a, b) => {
      const ta = a.lastLoginAt ? new Date(a.lastLoginAt).getTime() : 0;
      const tb = b.lastLoginAt ? new Date(b.lastLoginAt).getTime() : 0;
      return tb - ta;
    })
    .slice(0, 5);

  return (
    <div className="py-6 md:py-8">
      <RoleTag tone="admin">Администратор</RoleTag>

      <PageHeader
        title="Управление системой"
        accentText="системой"
        description="Пользователи, роли, справочники услуг и материалов, нормативы. Все изменения попадают в audit-log (152-ФЗ)."
        border={false}
        className="px-0 pb-6"
      />

      {/* KPI row — hardcoded baseline per admin.png reference */}
      <div className="mb-6 grid grid-cols-2 gap-3.5 md:grid-cols-4">
        <KpiCard
          label="Пользователей"
          value={<AnimatedCounter value={28} />}
          icon={<Users className="h-4 w-4" />}
          trend="flat"
          delta="из 30 лимит"
        />
        <KpiCard
          label="Активных ролей"
          value={<AnimatedCounter value={9} />}
          icon={<Shield className="h-4 w-4" />}
          trend="flat"
          delta="RBAC"
        />
        <KpiCard
          label="SKU материалов"
          value={<AnimatedCounter value={200} />}
          icon={<Package className="h-4 w-4" />}
          trend="up"
          trendIsGood
          delta="+3 за неделю"
        />
        <KpiCard
          label="Услуг в каталоге"
          value={<AnimatedCounter value={47} />}
          icon={<Briefcase className="h-4 w-4" />}
          trend="flat"
          delta="R3-track"
        />
      </div>

      {/* Section title */}
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 500,
          fontSize: '20px',
          letterSpacing: '-0.01em',
          marginBottom: '14px',
          color: 'var(--color-ink)',
        }}
      >
        Разделы управления
      </h2>

      {/* AdminTile grid */}
      <div className="mb-6 grid grid-cols-1 gap-3.5 md:grid-cols-3">
        <AdminTile
          href="/users"
          icon={<Users size={18} />}
          tone="users"
          title="Пользователи"
          description="RBAC, биометрические согласия, сброс паролей"
          stats={{ left: '28 учёток', right: '9 ролей' }}
        />
        <AdminTile
          href="/catalog/services"
          icon={<Briefcase size={18} />}
          tone="svc"
          title="Справочник услуг"
          description="Каталог R3-track, цены, нормы материалов и времени"
          stats={{ left: '47 позиций', right: 'BR-04 · enforced' }}
        />
        <AdminTile
          href="/catalog/materials"
          icon={<Package size={18} />}
          tone="mat"
          title="Материалы"
          description="SKU, единицы, поставщики, минимальные остатки"
          stats={{ left: '200 SKU', right: '14 категорий' }}
        />
        <AdminTile
          href="/norms"
          icon={<List size={18} />}
          tone="norm"
          title="Нормативы"
          description="Расход материалов и время операций (модуль 6.10)"
          stats={{ left: '312 строк', right: 'обновлено вчера' }}
        />
        <AdminTile
          href="/audit-log"
          icon={<FileText size={18} />}
          tone="audit"
          title="Audit-log"
          description="152-ФЗ · все доступы к ПДн, изменения, авторизации"
          stats={{ left: '2 184 события', right: 'хранение 5 лет' }}
        />
        <AdminTile
          href="/face-control"
          icon={<Camera size={18} />}
          tone="face"
          title="Face Control"
          description="Биометрия + согласия 152-ФЗ ст. 11. BR-06 · read-only."
          stats={{ left: '22 шаблона', right: 'vendor TBD' }}
        />
      </div>

      {/* Users preview table */}
      <Card>
        <CardHeader className="flex-row items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2.5">
            Пользователи системы
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
                fontSize: 11,
                background: 'var(--color-surface-2)',
                color: 'var(--color-ink-3)',
                padding: '3px 8px',
                borderRadius: 99,
              }}
            >
              {loading ? '…' : users.length}
            </span>
          </CardTitle>
          <Button size="sm" leftIcon={<Plus size={14} />}>
            Добавить
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6">
              <Skeleton variant="rect" className="h-24" />
            </div>
          ) : (
            <section
              className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0"
              aria-label="Пользователи системы — таблица"
              tabIndex={0}
            >
              <table className="w-full min-w-[700px] text-sm">
                <thead>
                  <tr style={{ background: 'var(--color-surface-3)' }}>
                    <th className="p-3 text-left font-medium" style={{ color: 'var(--color-ink-3)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>ФИО</th>
                    <th className="p-3 text-left font-medium" style={{ color: 'var(--color-ink-3)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Роль · RBAC</th>
                    <th className="p-3 text-left font-medium" style={{ color: 'var(--color-ink-3)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Face Control</th>
                    <th className="p-3 text-left font-medium" style={{ color: 'var(--color-ink-3)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Последний вход</th>
                    <th className="p-3 text-left font-medium" style={{ color: 'var(--color-ink-3)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {previewUsers.map((u, idx) => (
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
                          <div>
                            <div style={{ fontWeight: 500, fontSize: '13px' }}>{u.fullName}</div>
                            {u.email && (
                              <div style={{ fontSize: '11px', color: 'var(--color-ink-3)' }}>{u.email}</div>
                            )}
                          </div>
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
                      {/* Face Control */}
                      <td className="p-3">
                        {u.faceTemplateId ? (
                          <StatPill tone="done">Согласие ст. 11</StatPill>
                        ) : (
                          <StatPill tone="neutral" withDot={false}>—</StatPill>
                        )}
                      </td>
                      {/* Last login */}
                      <td className="p-3" style={{ fontSize: '12px', color: 'var(--color-ink-3)' }}>
                        {formatLastLogin(u.lastLoginAt)}
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
            </section>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
