'use client';
import { AutoCrumbs, type CrumbsResolver } from '@uniprint/ui';

const resolve: CrumbsResolver = (pathname) => {
  if (pathname === '/' || pathname === '') return [{ label: 'Сводка' }];
  if (pathname === '/profit') return [{ label: 'Прибыль по заказам' }];
  if (pathname === '/defects') return [{ label: 'Брак и потери' }];
  return [];
};

export function OwnerCrumbs() {
  return <AutoCrumbs rootLabel="Учредитель" resolve={resolve} />;
}
