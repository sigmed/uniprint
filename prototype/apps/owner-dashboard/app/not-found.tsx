import { ComingSoon } from '@uniprint/ui';

export default function NotFound() {
  return (
    <ComingSoon
      variant="not-found"
      subtitle="Дашборд учредителя"
      description="Похоже, эта страница ещё не реализована или была перемещена. Вернитесь на сводку — там доступны KPI, P&L и доходимость по типам заказов."
      homeHref="/"
      homeLabel="На сводку"
    />
  );
}
