'use client';
import { PhoneFrame, ComingSoon, PwaTabBar } from '@uniprint/ui';
import { WAREHOUSE_TABS } from '../_tabs';

export default function StocksPage() {
  return (
    <PhoneFrame showStatusBar={false}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
        <ComingSoon
          variant="planned"
          title="Остатки"
          subtitle="SKU · партии · минимальные остатки"
          description="Складские позиции с разрезом по партиям (FIFO per BR-09), минимальные остатки и алерты, поиск по SKU/материалу. Полный CRUD над материалами — в admin-panel «Материалы (200 SKU)»."
          badge="ЗАПЛАНИРОВАНО · ФАЗА 2"
          homeHref="/"
          homeLabel="На главную"
        />
      </div>
      <PwaTabBar tabs={WAREHOUSE_TABS} />
    </PhoneFrame>
  );
}
