import Link from 'next/link';
import { Button, Card, CardContent, PageHeader } from '@uniprint/ui';
import { PackageMinus, AlertTriangle } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="mx-auto max-w-md py-6">
      <PageHeader title="Склад" description="Управление материалами и фиксация брака" />
      <div className="mt-4 grid gap-3">
        <Link href="/writeoff">
          <Button size="touch" className="w-full">
            <PackageMinus className="mr-2 h-5 w-5" />
            Списать материал на заказ
          </Button>
        </Link>
        <Link href="/defect">
          <Button size="touch" variant="danger" className="w-full">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Зафиксировать брак
          </Button>
        </Link>
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
    </div>
  );
}
