import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, PageHeader } from '@uniprint/ui';

export default function AdminHome() {
  return (
    <div className="mx-auto max-w-5xl py-8">
      <PageHeader title="Админ-панель" description="Управление пользователями, ролями и справочниками" />
      <div className="mt-6 grid grid-cols-3 gap-4">
        <Link href="/users"><Card className="hover:border-[var(--color-primary)]"><CardHeader><CardTitle>Пользователи</CardTitle></CardHeader><CardContent>RBAC + биометрия</CardContent></Card></Link>
        <Link href="/catalog/services"><Card className="hover:border-[var(--color-primary)]"><CardHeader><CardTitle>Услуги</CardTitle></CardHeader><CardContent>Справочник (R3-track)</CardContent></Card></Link>
        <Link href="/catalog/materials"><Card className="hover:border-[var(--color-primary)]"><CardHeader><CardTitle>Материалы</CardTitle></CardHeader><CardContent>200 SKU</CardContent></Card></Link>
      </div>
    </div>
  );
}
