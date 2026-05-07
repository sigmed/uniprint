'use client';
import { PhoneFrame, ComingSoon, PwaTabBar } from '@uniprint/ui';
import { WAREHOUSE_TABS } from './_tabs';

export default function NotFound() {
  return (
    <PhoneFrame showStatusBar={false}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
        <ComingSoon
          variant="not-found"
          subtitle="Склад · PWA"
          description="Похоже, эта страница ещё не реализована или была перемещена. Вернитесь на главную — там доступны действия складщика."
          homeHref="/"
          homeLabel="На главную"
        />
      </div>
      <PwaTabBar tabs={WAREHOUSE_TABS} />
    </PhoneFrame>
  );
}
