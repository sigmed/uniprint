'use client';
import { PhoneFrame, ComingSoon, PwaTabBar } from '@uniprint/ui';
import { PRODUCTION_TABS } from './_tabs';

export default function NotFound() {
  return (
    <PhoneFrame showStatusBar={false}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
        <ComingSoon
          variant="not-found"
          subtitle="Производство · PWA"
          description="Похоже, эта страница ещё не реализована или была перемещена. Вернитесь к задачам — там доступны текущая работа и очередь."
          homeHref="/"
          homeLabel="К задачам"
        />
      </div>
      <PwaTabBar tabs={PRODUCTION_TABS} />
    </PhoneFrame>
  );
}
