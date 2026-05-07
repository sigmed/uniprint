'use client';
import { AutoCrumbs, type CrumbsResolver } from '@uniprint/ui';

const resolve: CrumbsResolver = (pathname) => {
  if (pathname === '/' || pathname === '') return [];
  if (pathname === '/orders') return [{ label: 'Заказы' }];
  if (pathname === '/orders/new')
    return [{ label: 'Заказы', href: '/orders' }, { label: 'Новый заказ' }];
  if (pathname.startsWith('/orders/')) {
    // /orders/[id] — детали заказа
    return [{ label: 'Заказы', href: '/orders' }, { label: 'Детали заказа' }];
  }
  return [];
};

export function ClientPortalCrumbs() {
  return <AutoCrumbs rootLabel="Кабинет клиента" resolve={resolve} />;
}
