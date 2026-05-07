import { ComingSoon } from '@uniprint/ui';

export default function NotFound() {
  return (
    <ComingSoon
      variant="not-found"
      subtitle="Админ-панель"
      description="Похоже, эта страница ещё не реализована или была перемещена. Вернитесь на дашборд — там доступны разделы управления (RBAC, услуги, материалы, нормативы, audit-log, Face Control)."
      homeHref="/"
      homeLabel="На дашборд"
    />
  );
}
