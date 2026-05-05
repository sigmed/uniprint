import Link from 'next/link';
import { Button, Card, CardContent } from '@uniprint/ui';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-md px-4 py-6">
      <h1 className="text-2xl font-bold">Склад</h1>
      <div className="mt-4 grid gap-3">
        <Link href="/writeoff"><Button size="touch" className="w-full">📤 Списать материал на заказ</Button></Link>
        <Link href="/defect"><Button size="touch" variant="danger" className="w-full">⚠ Зафиксировать брак</Button></Link>
        <Card>
          <CardContent className="p-4 text-sm">
            <p className="font-semibold">Ключевые правила:</p>
            <ul className="mt-2 list-disc pl-5 text-[var(--color-fg-muted)]">
              <li><strong>BR-01:</strong> материалы списываются ТОЛЬКО на заказ</li>
              <li><strong>BR-03:</strong> брак фиксирует ТОЛЬКО складщик</li>
              <li><strong>BR-09:</strong> списание FIFO — самая старая партия первой</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
