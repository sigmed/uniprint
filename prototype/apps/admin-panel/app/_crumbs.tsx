'use client';
import { AutoCrumbs, type CrumbsResolver } from '@uniprint/ui';

const resolve: CrumbsResolver = (pathname) => {
  if (pathname === '/' || pathname === '') return [{ label: 'Дашборд' }];
  if (pathname === '/users') return [{ label: 'Пользователи' }];
  if (pathname === '/catalog/services')
    return [{ label: 'Справочники' }, { label: 'Услуги' }];
  if (pathname === '/catalog/materials')
    return [{ label: 'Справочники' }, { label: 'Материалы' }];
  if (pathname === '/norms') return [{ label: 'Нормативы' }];
  if (pathname === '/audit-log') return [{ label: 'Audit-log' }];
  if (pathname === '/face-control') return [{ label: 'Face Control' }];
  return [];
};

export function AdminCrumbs() {
  return <AutoCrumbs rootLabel="Админ-панель" resolve={resolve} />;
}
