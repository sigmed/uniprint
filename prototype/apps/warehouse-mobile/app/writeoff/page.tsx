'use client';
import { useEffect, useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Select, PageHeader } from '@uniprint/ui';
import type { SelectOption } from '@uniprint/ui';
import { PackageMinus, CheckCircle2, XCircle } from 'lucide-react';
import type { Order, MaterialCatalog } from '@uniprint/types';

export default function WriteoffPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [materials, setMaterials] = useState<MaterialCatalog[]>([]);
  const [orderId, setOrderId] = useState('');
  const [materialId, setMaterialId] = useState('');
  const [qty, setQty] = useState(1);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/orders?status=in_production').then((r) => r.json()).then((d) => setOrders(d.items));
    fetch('/api/materials').then((r) => r.json()).then((d) => setMaterials(d.items.slice(0, 30)));
  }, []);

  const submit = async () => {
    setResult(null);
    const res = await fetch('/api/writeoffs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, materialId, qty, byUserId: 'usr_011' }),
    });
    const data = await res.json();
    if (!res.ok) {
      setResult(`ERR: ${data.error}`);
      return;
    }
    setResult(`Списано ${qty} ед. (${data.writeoffs.length} партий, FIFO)`);
  };

  const orderOptions: SelectOption[] = orders.map((o) => ({ value: o.id, label: `${o.number} · ${o.title}` }));
  const materialOptions: SelectOption[] = materials.map((m) => ({ value: m.id, label: `${m.sku} · ${m.name}` }));

  const resultIsSuccess = result != null && !result.startsWith('ERR');

  return (
    <div className="mx-auto max-w-md py-6">
      <PageHeader title="Списание материала" />
      <Card className="mt-4">
        <CardHeader><CardTitle>На заказ (BR-01)</CardTitle></CardHeader>
        <CardContent className="grid gap-3">
          <Select
            placeholder="— заказ —"
            options={orderOptions}
            size="touch"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />

          <Select
            placeholder="— материал —"
            options={materialOptions}
            size="touch"
            value={materialId}
            onChange={(e) => setMaterialId(e.target.value)}
          />

          <Input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            placeholder="Количество"
          />

          <Button size="touch" disabled={!orderId || !materialId} onClick={submit}>
            <PackageMinus className="mr-2 h-5 w-5" />
            Списать
          </Button>

          {result && (
            <p className={`flex items-center gap-2 text-sm ${resultIsSuccess ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
              {resultIsSuccess
                ? <CheckCircle2 className="h-4 w-4 shrink-0" />
                : <XCircle className="h-4 w-4 shrink-0" />}
              {result}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
