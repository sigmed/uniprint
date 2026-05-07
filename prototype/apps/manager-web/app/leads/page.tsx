'use client';
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  StatPill,
  PageHeader,
  EmptyState,
  Skeleton,
} from '@uniprint/ui';
import type { StatPillTone } from '@uniprint/ui';
import { Inbox, Sparkles } from 'lucide-react';
import type { Lead } from '@uniprint/types';

const STATUS_LABELS: Record<Lead['status'], string> = {
  new: 'Новый',
  measured: 'Замер сделан',
  quoted: 'КП отправлено',
  converted: 'В заказ',
  lost: 'Потерян',
};

const STATUS_TONES: Record<Lead['status'], StatPillTone> = {
  new: 'new',
  measured: 'queue',
  quoted: 'review',
  converted: 'done',
  lost: 'defect',
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leads')
      .then((r) => r.json())
      .then((d) => { setLeads(d.items ?? []); setLoading(false); });
  }, []);

  return (
    <div className="py-6 md:py-8">
      <PageHeader
        title="Лиды"
        description="Входящие обращения от клиентов и выездных менеджеров."
        border={false}
        className="px-0 pb-6"
      />

      <Card>
        <CardHeader>
          <CardTitle className="gap-2">
            <Sparkles className="h-4 w-4 text-[var(--color-ink-3)]" />
            Входящие лиды
          </CardTitle>
          <span className="text-[11px] font-semibold text-[var(--color-ink-3)]">
            {loading ? '…' : `${leads.length} шт`}
          </span>
        </CardHeader>

        {loading ? (
          <CardContent><Skeleton variant="text" lines={5} /></CardContent>
        ) : leads.length === 0 ? (
          <CardContent>
            <EmptyState
              icon={<Inbox className="h-6 w-6" />}
              title="Лидов пока нет"
              description="Создайте лида от выездной команды или ручным вводом."
            />
          </CardContent>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  {['#', 'Источник', 'Замер', 'Статус'].map((col) => (
                    <th
                      key={col}
                      className="border-b border-[var(--color-line)] bg-[var(--color-surface-3)] px-[22px] py-[11px] text-left text-[10.5px] font-semibold uppercase tracking-[.08em] text-[var(--color-ink-3)]"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr
                    key={l.id}
                    className="border-b border-[var(--color-line)] last:border-none hover:bg-[var(--color-surface-3)]"
                  >
                    <td className="px-[22px] py-[13px]">
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-ink-2)', fontWeight: 500 }}>
                        {l.id}
                      </span>
                    </td>
                    <td className="px-[22px] py-[13px] text-[var(--color-ink)]">
                      {l.source}
                    </td>
                    <td className="px-[22px] py-[13px] text-[var(--color-ink-3)]">
                      {l.measurements
                        ? `${l.measurements.width} × ${l.measurements.height} м`
                        : '—'}
                    </td>
                    <td className="px-[22px] py-[13px]">
                      <StatPill tone={STATUS_TONES[l.status]}>
                        {STATUS_LABELS[l.status]}
                      </StatPill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
