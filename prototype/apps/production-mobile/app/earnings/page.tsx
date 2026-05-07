'use client';
import { PhoneFrame, ComingSoon, PwaTabBar } from '@uniprint/ui';
import { PRODUCTION_TABS } from '../_tabs';

export default function EarningsPage() {
  return (
    <PhoneFrame showStatusBar={false}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
        <ComingSoon
          variant="planned"
          title="Заработок"
          subtitle="Сделка · баланс · расчётный лист"
          description="Расчёт сдельной оплаты по операциям (модуль 6.22). Баланс сотрудника по BR-05: компания доплачивает в долг при заработке меньше минимума, не уход в минус по ТК ст. 137. Расчётный лист (ТК ст. 136)."
          badge="ЗАПЛАНИРОВАНО · ФАЗА 2"
          homeHref="/"
          homeLabel="К задачам"
        />
      </div>
      <PwaTabBar tabs={PRODUCTION_TABS} />
    </PhoneFrame>
  );
}
