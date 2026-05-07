'use client';
import { PhoneFrame, ComingSoon, PwaTabBar } from '@uniprint/ui';
import { PRODUCTION_TABS } from '../_tabs';

export default function ShiftPage() {
  return (
    <PhoneFrame showStatusBar={false}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
        <ComingSoon
          variant="planned"
          title="Экран смены"
          subtitle="Печатник · текущая смена"
          description="События Face Control (read-only · BR-06), список операций за смену, метрики времени и количества выполненной работы. Корректировка времени смены через отдельный workflow с журналом."
          badge="ЗАПЛАНИРОВАНО · ФАЗА 2"
          homeHref="/"
          homeLabel="К задачам"
        />
      </div>
      <PwaTabBar tabs={PRODUCTION_TABS} />
    </PhoneFrame>
  );
}
