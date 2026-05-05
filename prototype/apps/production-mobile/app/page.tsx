'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@uniprint/ui';

export default function FaceControlLoginPage() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const handleLogin = async () => {
    setPending(true);
    await new Promise((r) => setTimeout(r, 1500));
    await fetch('/api/face-control/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'usr_003' }),
    });
    router.push('/tasks');
  };
  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <Card>
        <CardHeader><CardTitle>Начало смены</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-[var(--color-fg-muted)]">
            Подойдите к камере Face Control. Вход зафиксируется автоматически.
          </p>
          <p className="mt-2 text-xs text-[var(--color-fg-muted)]">
            <em>Q2 ⏸: vendor TBD. В прототипе — мок (3 секунды → имитация распознавания).</em>
          </p>
          <Button size="touch" className="mt-6 w-full" onClick={handleLogin} disabled={pending}>
            {pending ? 'Распознавание…' : '👤 Войти на смену (mock)'}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
