'use client';
import { usePathname } from 'next/navigation';
import { Crumbs, type CrumbItem } from './crumbs';

/**
 * Resolver-функция для одного path. Возвращает массив сегментов,
 * **не включая** root (root добавляет AutoCrumbs автоматически).
 *
 * Получает текущий pathname (например `/orders/abc-123`). Может вернуть
 * пустой массив (тогда показан только root crumb) или цепочку с href'ами
 * на parent-сегменты.
 */
export type CrumbsResolver = (pathname: string) => CrumbItem[];

export interface AutoCrumbsProps {
  /** Label для root crumb (имя кабинета: «Админ-панель» / «Кабинет клиента»). */
  rootLabel: string;
  /** Href root crumb. Default `/`. */
  rootHref?: string;
  /** Резолвер цепочки от root. Получает pathname, возвращает segments. */
  resolve: CrumbsResolver;
  /** Показать Home icon в root crumb. Default true. */
  withHomeIcon?: boolean;
  className?: string;
}

/**
 * AutoCrumbs — клиентский wrapper над Crumbs, резолвит цепочку из текущего
 * `usePathname()`. Рендерится в `topbarLeft` slot AppShell.
 *
 * Каждый кабинет передаёт свой resolver (см. `app/_crumbs.tsx`):
 *
 *   <AutoCrumbs
 *     rootLabel="Админ-панель"
 *     resolve={(p) => p === '/users' ? [{ label: 'Пользователи' }] : []}
 *   />
 */
export const AutoCrumbs = ({
  rootLabel,
  rootHref = '/',
  resolve,
  withHomeIcon = true,
  className,
}: AutoCrumbsProps) => {
  const pathname = usePathname() ?? '/';
  const segments = resolve(pathname);

  // Root всегда первый. Если segments непуст, root становится clickable.
  const rootItem: CrumbItem =
    segments.length > 0 ? { label: rootLabel, href: rootHref } : { label: rootLabel };

  return (
    <Crumbs
      items={[rootItem, ...segments]}
      withHomeIcon={withHomeIcon}
      className={className ?? ''}
    />
  );
};
AutoCrumbs.displayName = 'AutoCrumbs';
