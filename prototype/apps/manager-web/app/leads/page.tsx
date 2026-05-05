'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, Badge, PageHeader, EmptyState, Skeleton } from '@uniprint/ui';
import { Inbox } from 'lucide-react';
import type { Lead } from '@uniprint/types';

const STATUS_LABELS: Record<Lead['status'], string> = {
  new: 'Новый', measured: 'Замер сделан', quoted: 'КП отправлено', converted: 'В заказ', lost: 'Потерян',
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leads').then((r) => r.json()).then((d) => { setLeads(d.items); setLoading(false); });
  }, []);

  return (
    <div className="mx-auto max-w-5xl py-8">
      <PageHeader title="Лиды" description="Входящие обращения от клиентов и выездных менеджеров" />
      <div className="mt-6 grid gap-2">
        {loading ? (
          <Skeleton variant="text" lines={5} />
        ) : leads.length === 0 ? (
          <EmptyState
            icon={<Inbox className="h-6 w-6" />}
            title="Лидов пока нет"
            description="Создайте лида от выездной команды или ручным вводом."
          />
        ) : (
          leads.map((l) => (
            <Card key={l.id}>
              <CardContent className="flex justify-between p-4">
                <div>
                  <div className="font-semibold">Лид #{l.id}</div>
                  <div className="text-sm text-[var(--color-fg-muted)]">
                    Источник: {l.source} · {l.measurements ? `${l.measurements.width}×${l.measurements.height} м` : 'без замера'}
                  </div>
                </div>
                <Badge variant={l.status === 'converted' ? 'success' : l.status === 'lost' ? 'danger' : 'outline'}>
                  {STATUS_LABELS[l.status]}
                </Badge>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
