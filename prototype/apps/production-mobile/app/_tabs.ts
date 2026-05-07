import { ClipboardList, DollarSign, History, UserCircle } from 'lucide-react';
import type { PwaTabItem } from '@uniprint/ui';

/**
 * Bottom-nav tabs для production-mobile.
 * «Задачи» совпадает с root `/` AND `/tasks` (роуты-дубли — root рендерит ту же страницу).
 *
 * Three tabs (Смена / Заработок / История) пока заглушки — экраны не реализованы,
 * см. project memory `project_pwa_tabs_dead.md`.
 */
export const PRODUCTION_TABS: PwaTabItem[] = [
  { href: '/',          label: 'Задачи',     icon: ClipboardList, matches: ['/tasks'] },
  { href: '/shift',     label: 'Смена',      icon: UserCircle },
  { href: '/earnings',  label: 'Заработок',  icon: DollarSign },
  { href: '/history',   label: 'История',    icon: History },
];
