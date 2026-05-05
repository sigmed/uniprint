'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@uniprint/ui';
import type { Client, OrderType } from '@uniprint/types';

export default function NewOrderPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [type, setType] = useState<OrderType>('cex');
  const [title, setTitle] = useState('');
  const [itemsCount, setItemsCount] = useState(1);

  useEffect(() => {
    if (!search) { setClients([]); return; }
    fetch(`/api/clients?q=${encodeURIComponent(search)}`).then((r) => r.json()).then((d) => setClients(d.items));
  }, [search]);

  const submit = async () => {
    if (!selectedClient) return;
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, title, itemsCount, clientId: selectedClient.id, priceTotal: itemsCount * 5000 }),
    });
    const created = await res.json();
    router.push('/orders');
    void created; // в реальном коде — переход на /orders/[created.id]
  };

  return (
    <main className="mx-auto max-w-2xl px-6 py-8">
      <h1 className="text-2xl font-bold">Новый заказ</h1>
      <Card className="mt-6">
        <CardHeader><CardTitle>Шаг 1: клиент (BR-02 — антидубль по телефону)</CardTitle></CardHeader>
        <CardContent>
          <Input placeholder="Поиск по имени или телефону" value={search} onChange={(e) => setSearch(e.target.value)} />
          {clients.length > 0 && (
            <ul className="mt-3 max-h-64 overflow-auto rounded-md border border-[var(--color-border)]">
              {clients.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    className="w-full cursor-pointer border-b border-[var(--color-border)] p-2 text-left hover:bg-[var(--color-bg)]"
                    onClick={() => setSelectedClient(c)}
                  >
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-[var(--color-fg-muted)]">{c.phone} · {c.type}</div>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {selectedClient && (
            <p className="mt-3 text-sm">Выбран: <strong>{selectedClient.name}</strong> ({selectedClient.phone})</p>
          )}
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader><CardTitle>Шаг 2: параметры</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <select className="h-10 rounded-md border border-[var(--color-border)] px-3" value={type} onChange={(e) => setType(e.target.value as OrderType)}>
              <option value="cex">Цех</option>
              <option value="office">Офис</option>
              <option value="goods">Товар</option>
            </select>
            <Input placeholder="Что заказываем" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Input type="number" min={1} value={itemsCount} onChange={(e) => setItemsCount(Number(e.target.value))} />
          </div>
        </CardContent>
      </Card>

      <Button className="mt-6" disabled={!selectedClient || !title} onClick={submit} size="lg">
        Создать заказ
      </Button>
    </main>
  );
}
