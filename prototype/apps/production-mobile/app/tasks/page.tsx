'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, OrderStatusBadge } from '@uniprint/ui';
import type { Order } from '@uniprint/types';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Order[]>([]);
  useEffect(() => {
    fetch('/api/orders?status=in_production').then((r) => r.json()).then((d) => setTasks(d.items));
  }, []);
  return (
    <main className="mx-auto max-w-md px-4 py-6">
      <h1 className="text-2xl font-bold">Мои задачи</h1>
      <div className="mt-4 grid gap-2">
        {tasks.map((o) => (
          <Link key={o.id} href={`/tasks/${o.id}` as `/tasks/${string}`}>
            <Card className="active:scale-[0.98] transition">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold">{o.number}</div>
                    <div className="text-sm text-[var(--color-fg-muted)]">{o.title}</div>
                    <div className="mt-1 text-xs">
                      Срок: {o.dueDate ? new Date(o.dueDate).toLocaleDateString('ru-RU') : '—'}
                    </div>
                  </div>
                  <OrderStatusBadge status={o.status} />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
