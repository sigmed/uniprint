'use client';
import { Card, CardContent } from '@uniprint/ui';

export default function ServicesPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="text-2xl font-bold">Справочник услуг</h1>
      <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
        BR-14: справочник меняет ТОЛЬКО администратор. История изменений сохраняется (audit-log).
      </p>
      <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
        Q15 ✅: справочник наполняется с нуля параллельным треком sprint-0
        (типограф-консультант R3 + владелец).
      </p>
      <Card className="mt-6"><CardContent className="p-6">
        <p className="text-center text-[var(--color-fg-muted)]">
          [В прототипе — заглушка. Реальный справочник — после sprint-0 R3-track.]
        </p>
      </CardContent></Card>
    </main>
  );
}
