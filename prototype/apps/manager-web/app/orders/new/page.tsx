'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Select,
  PageHeader,
  BRCallout,
} from '@uniprint/ui';
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
    fetch(`/api/clients?q=${encodeURIComponent(search)}`)
      .then((r) => r.json())
      .then((d) => setClients(d.items ?? []));
  }, [search]);

  const submit = async () => {
    if (!selectedClient) return;
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type, title, itemsCount,
        clientId: selectedClient.id,
        priceTotal: itemsCount * 5000,
      }),
    });
    const created = await res.json();
    void created;
    router.push('/orders');
  };

  return (
    <div className="py-6 md:py-8">
      <PageHeader
        title="Новый заказ"
        description="Найдите клиента и укажите параметры заказа."
        border={false}
        className="px-0 pb-6"
      />

      <div className="mx-auto max-w-2xl grid gap-4">
        {/* Step 1: client search with BR-02 */}
        <Card>
          <CardHeader>
            <CardTitle>Шаг 1: Клиент</CardTitle>
          </CardHeader>
          <CardContent>
            <BRCallout
              rules={[
                { code: 'BR-02', text: 'Антидублирование клиентов по номеру телефона — система предупредит о совпадении.' },
              ]}
              className="mb-4"
            />
            <Input
              placeholder="Поиск по имени или телефону"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {clients.length > 0 && (
              <ul className="mt-3 max-h-64 overflow-auto rounded-[var(--radius-md)] border border-[var(--color-line)]">
                {clients.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      className="w-full cursor-pointer border-b border-[var(--color-line)] p-3 text-left last:border-none hover:bg-[var(--color-surface-3)]"
                      onClick={() => { setSelectedClient(c); setClients([]); setSearch(c.name); }}
                    >
                      <div className="font-semibold text-[var(--color-ink)]">{c.name}</div>
                      <div className="text-xs text-[var(--color-ink-3)]">
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{c.phone}</span>
                        {' · '}
                        {c.type}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {selectedClient && (
              <div className="mt-3 flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--color-green)] bg-[var(--color-green-soft)] px-3 py-2">
                <div>
                  <div className="text-sm font-semibold text-[var(--color-green-ink)]">{selectedClient.name}</div>
                  <div className="text-xs text-[var(--color-green-ink)] opacity-70">
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{selectedClient.phone}</span>
                    {' · '}
                    {selectedClient.type}
                  </div>
                </div>
                <button
                  type="button"
                  className="text-xs text-[var(--color-green-ink)] opacity-60 hover:opacity-100"
                  onClick={() => { setSelectedClient(null); setSearch(''); }}
                >
                  ✕
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 2: order parameters */}
        <Card>
          <CardHeader>
            <CardTitle>Шаг 2: Параметры</CardTitle>
          </CardHeader>
          <CardContent>
            <BRCallout
              rules={[
                { code: 'BR-07', text: 'Тип заказа определяет статус-машину: Цех / Офис-полиграфия / Готовый товар.' },
              ]}
              className="mb-4"
            />
            <div className="grid gap-3">
              <Select
                label="Тип заказа (BR-07)"
                options={ORDER_TYPE_OPTIONS}
                value={type}
                onChange={(e) => setType(e.target.value as OrderType)}
              />
              <label htmlFor="new-order-title-mgr" className="grid gap-1.5">
                <span className="text-[11.5px] font-semibold text-[var(--color-ink-2)]">
                  Что заказываем <span className="text-[var(--color-brand-500)]">*</span>
                </span>
                <Input
                  id="new-order-title-mgr"
                  placeholder="Что заказываем"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </label>
              <label htmlFor="new-order-qty-mgr" className="grid gap-1.5">
                <span className="text-[11.5px] font-semibold text-[var(--color-ink-2)]">Количество, шт</span>
                <Input
                  id="new-order-qty-mgr"
                  type="number"
                  min={1}
                  value={itemsCount}
                  onChange={(e) => setItemsCount(Number(e.target.value))}
                />
              </label>
            </div>
          </CardContent>
        </Card>

        <Button
          className="w-full"
          disabled={!selectedClient || !title}
          onClick={submit}
          size="lg"
        >
          Создать заказ
        </Button>
      </div>
    </div>
  );
}
