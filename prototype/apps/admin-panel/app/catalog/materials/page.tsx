'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, PageHeader, StatPill } from '@uniprint/ui';
import type { MaterialCatalog } from '@uniprint/types';

const CATEGORY_TONES: Record<string, 'work' | 'queue' | 'done' | 'neutral' | 'new'> = {
  paper: 'queue',
  vinyl: 'work',
  fabric: 'work',
  ink: 'new',
  film: 'done',
  consumable: 'neutral',
};

export default function MaterialsPage() {
  const [items, setItems] = useState<MaterialCatalog[]>([]);

  useEffect(() => {
    fetch('/api/materials')
      .then((r) => r.json())
      .then((d) => setItems(d.items));
  }, []);

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Материалы"
        accentText={` (${items.length} SKU)`}
        description="Справочник SKU с единицами измерения, категориями и минимальными остатками. BR-01: списание только на заказ."
      />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Каталог материалов</CardTitle>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--color-ink-3)',
            }}
          >
            {items.length} SKU · 14 категорий
          </span>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr style={{ background: 'var(--color-surface-3)' }}>
                  <th className="p-3 text-left font-medium" style={{ color: 'var(--color-ink-3)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>SKU</th>
                  <th className="p-3 text-left font-medium" style={{ color: 'var(--color-ink-3)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Название</th>
                  <th className="p-3 text-left font-medium" style={{ color: 'var(--color-ink-3)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Категория</th>
                  <th className="p-3 text-left font-medium" style={{ color: 'var(--color-ink-3)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Ед. изм.</th>
                </tr>
              </thead>
              <tbody>
                {items.slice(0, 50).map((m) => (
                  <tr key={m.id} className="border-t border-[var(--color-border)]">
                    <td className="p-3">
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          color: 'var(--color-ink-3)',
                        }}
                      >
                        {m.sku}
                      </span>
                    </td>
                    <td className="p-3" style={{ fontWeight: 500 }}>{m.name}</td>
                    <td className="p-3">
                      <StatPill
                        tone={CATEGORY_TONES[m.category] ?? 'neutral'}
                        withDot={false}
                      >
                        {m.category}
                      </StatPill>
                    </td>
                    <td className="p-3" style={{ color: 'var(--color-ink-3)', fontSize: '12px' }}>{m.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="p-3 text-xs" style={{ color: 'var(--color-ink-3)' }}>
            показано 50 из {items.length}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
