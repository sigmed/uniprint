import { ComingSoon } from '@uniprint/ui';

export default function NotFound() {
  return (
    <ComingSoon
      variant="not-found"
      subtitle="Кабинет клиента"
      description="Похоже, эта страница ещё не реализована или была перемещена. Вернитесь на главную — там доступны заказы и форма создания."
      homeHref="/"
      homeLabel="На главную"
    />
  );
}
