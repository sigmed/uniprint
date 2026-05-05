'use client';
import { useEffect, useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@uniprint/ui';
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
      setResult(`❌ ${data.error}`);
      return;
    }
    setResult(`✅ Списано ${qty} ед. (${data.writeoffs.length} партий, FIFO)`);
  };

  return (
    <main className="mx-auto max-w-md px-4 py-6">
      <h1 className="text-2xl font-bold">Списание материала</h1>
      <Card className="mt-4">
        <CardHeader><CardTitle>На заказ (BR-01)</CardTitle></CardHeader>
        <CardContent className="grid gap-3">
          <select
            className="h-12 rounded-md border border-[var(--color-border)] px-3"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          >
            <option value="">— заказ —</option>
            {orders.map((o) => <option key={o.id} value={o.id}>{o.number} · {o.title}</option>)}
          </select>

          <select
            className="h-12 rounded-md border border-[var(--color-border)] px-3"
            value={materialId}
            onChange={(e) => setMaterialId(e.target.value)}
          >
            <option value="">— материал —</option>
            {materials.map((m) => <option key={m.id} value={m.id}>{m.sku} · {m.name}</option>)}
          </select>

          <Input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            placeholder="Количество"
          />

          <Button size="touch" disabled={!orderId || !materialId} onClick={submit}>
            📤 Списать
          </Button>

          {result && (
            <p className={`text-sm ${result.startsWith('✅') ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
              {result}
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
