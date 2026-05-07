'use client';
import { PhoneFrame, ComingSoon, PwaTabBar } from '@uniprint/ui';
import { PRODUCTION_TABS } from '../_tabs';

export default function HistoryPage() {
  return (
    <PhoneFrame showStatusBar={false}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
        <ComingSoon
          variant="planned"
          title="История"
          subtitle="Закрытые задачи · фильтр по периоду"
          description="Список задач, закрытых сотрудником за выбранный период. Детализация: что делал, сколько времени, сколько заработал. Привязка к расчётному листу."
          badge="ЗАПЛАНИРОВАНО · ФАЗА 2"
          homeHref="/"
          homeLabel="К задачам"
        />
      </div>
      <PwaTabBar tabs={PRODUCTION_TABS} />
    </PhoneFrame>
  );
}
