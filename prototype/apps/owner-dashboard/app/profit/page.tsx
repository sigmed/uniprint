import { ComingSoon } from '@uniprint/ui';

export default function ProfitPage() {
  return (
    <ComingSoon
      variant="planned"
      title="Прибыль по заказам"
      subtitle="Drill-down по топ заказам"
      description="Детализация маржи по каждому заказу: выручка, прямые расходы (материалы + работа), косвенные (амортизация + накладные), итоговая прибыль. Фильтры по типу (BR-07), периоду, клиенту."
      badge="ЗАПЛАНИРОВАНО · ФАЗА 2"
      homeHref="/"
      homeLabel="На сводку"
    />
  );
}
