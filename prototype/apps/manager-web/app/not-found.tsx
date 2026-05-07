import { ComingSoon } from '@uniprint/ui';

export default function NotFound() {
  return (
    <ComingSoon
      variant="not-found"
      subtitle="Менеджер офиса"
      description="Похоже, эта страница ещё не реализована или была перемещена. Вернитесь на дашборд — там доступны KPI, Канбан активных заказов и таблица за день."
      homeHref="/"
      homeLabel="На дашборд"
    />
  );
}
