'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, CardTitle, PageHeader } from '@uniprint/ui';
import { UserCircle } from 'lucide-react';

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
    <div className="mx-auto max-w-md py-8">
      <PageHeader title="Начало смены" />
      <Card className="mt-6">
        <CardHeader><CardTitle>Face Control</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-[var(--color-fg-muted)]">
            Подойдите к камере Face Control. Вход зафиксируется автоматически.
          </p>
          {/* Q2: vendor TBD. В прототипе — мок (3 секунды → имитация распознавания). */}
          <Button size="touch" className="mt-6 w-full" onClick={handleLogin} disabled={pending}>
            <UserCircle className="mr-2 h-5 w-5" />
            {pending ? 'Распознавание…' : 'Войти на смену (mock)'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
