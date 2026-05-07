import { ComingSoon } from '@uniprint/ui';

export default function DefectsPage() {
  return (
    <ComingSoon
      variant="planned"
      title="Отчёт по браку и потерям"
      subtitle="Журнал инцидентов · BR-03"
      description="Полный журнал брака за период с разбивкой по этапам производства, виновникам, потерям. Фиксацию делает только складщик (BR-03). Связь с заказом, фото, причина, сумма списания."
      badge="ЗАПЛАНИРОВАНО · ФАЗА 2"
      homeHref="/"
      homeLabel="На сводку"
    />
  );
}
