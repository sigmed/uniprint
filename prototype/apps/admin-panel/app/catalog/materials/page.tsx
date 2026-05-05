'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, PageHeader } from '@uniprint/ui';
import type { MaterialCatalog } from '@uniprint/types';

export default function MaterialsPage() {
  const [items, setItems] = useState<MaterialCatalog[]>([]);
  useEffect(() => { fetch('/api/materials').then((r) => r.json()).then((d) => setItems(d.items)); }, []);
  return (
    <div className="mx-auto max-w-5xl py-8">
      <PageHeader title={`Справочник материалов (${items.length} SKU)`} />
      <Card className="mt-6">
        <CardContent className="p-0">
          {/* C5: mobile table overflow fix */}
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-[var(--color-bg)]">
                <tr>
                  <th className="p-3 text-left">SKU</th>
                  <th className="p-3 text-left">Название</th>
                  <th className="p-3 text-left">Категория</th>
                  <th className="p-3 text-left">Ед. изм.</th>
                </tr>
              </thead>
              <tbody>
                {items.slice(0, 50).map((m) => (
                  <tr key={m.id} className="border-t border-[var(--color-border)]">
                    <td className="p-3 font-mono text-xs">{m.sku}</td>
                    <td className="p-3">{m.name}</td>
                    <td className="p-3"><span className="rounded bg-[var(--color-bg)] px-2 py-0.5 text-xs">{m.category}</span></td>
                    <td className="p-3">{m.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="p-3 text-xs text-[var(--color-fg-muted)]">показано 50 из {items.length}</p>
        </CardContent>
      </Card>
    </div>
  );
}
