'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, Badge } from '@uniprint/ui';
import type { Lead } from '@uniprint/types';

const STATUS_LABELS: Record<Lead['status'], string> = {
  new: 'Новый', measured: 'Замер сделан', quoted: 'КП отправлено', converted: 'В заказ', lost: 'Потерян',
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  useEffect(() => { fetch('/api/leads').then((r) => r.json()).then((d) => setLeads(d.items)); }, []);
  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="text-2xl font-bold">Лиды</h1>
      <div className="mt-6 grid gap-2">
        {leads.map((l) => (
          <Card key={l.id}><CardContent className="flex justify-between p-4">
            <div>
              <div className="font-semibold">Лид #{l.id}</div>
              <div className="text-sm text-[var(--color-fg-muted)]">
                Источник: {l.source} · {l.measurements ? `${l.measurements.width}×${l.measurements.height} м` : 'без замера'}
              </div>
            </div>
            <Badge variant={l.status === 'converted' ? 'success' : l.status === 'lost' ? 'danger' : 'outline'}>
              {STATUS_LABELS[l.status]}
            </Badge>
          </CardContent></Card>
        ))}
      </div>
    </main>
  );
}
