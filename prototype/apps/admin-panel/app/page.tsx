import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@uniprint/ui';

export default function AdminHome() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="text-3xl font-bold">Админ-панель</h1>
      <div className="mt-6 grid grid-cols-3 gap-4">
        <Link href="/users"><Card className="hover:border-[var(--color-primary)]"><CardHeader><CardTitle>Пользователи</CardTitle></CardHeader><CardContent>RBAC + биометрия</CardContent></Card></Link>
        <Link href="/catalog/services"><Card className="hover:border-[var(--color-primary)]"><CardHeader><CardTitle>Услуги</CardTitle></CardHeader><CardContent>Справочник (R3-track)</CardContent></Card></Link>
        <Link href="/catalog/materials"><Card className="hover:border-[var(--color-primary)]"><CardHeader><CardTitle>Материалы</CardTitle></CardHeader><CardContent>200 SKU</CardContent></Card></Link>
      </div>
    </main>
  );
}
