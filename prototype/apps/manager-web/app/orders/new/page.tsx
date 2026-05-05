'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Select, PageHeader } from '@uniprint/ui';
import type { SelectOption } from '@uniprint/ui';
import type { Client, OrderType } from '@uniprint/types';

const ORDER_TYPE_OPTIONS: SelectOption[] = [
  { value: 'cex', label: 'Цех (наружная реклама)' },
  { value: 'office', label: 'Офис (оперативная полиграфия)' },
  { value: 'goods', label: 'Готовый товар' },
];

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
    // I11: /orders/[id] page not yet in manager-web — redirect to list
    // TODO: create /orders/[id] and redirect to created.id when available
    void created;
    router.push('/orders');
  };

  return (
    <div className="mx-auto max-w-2xl py-8">
      <PageHeader title="Новый заказ" />
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
            <Select
              label="Тип заказа"
              options={ORDER_TYPE_OPTIONS}
              value={type}
              onChange={(e) => setType(e.target.value as OrderType)}
            />
            <Input placeholder="Что заказываем" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Input type="number" min={1} value={itemsCount} onChange={(e) => setItemsCount(Number(e.target.value))} />
          </div>
        </CardContent>
      </Card>

      <Button className="mt-6" disabled={!selectedClient || !title} onClick={submit} size="lg">
        Создать заказ
      </Button>
    </div>
  );
}
