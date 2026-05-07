import { AlertTriangle, BarChart2, Home, PackageMinus } from 'lucide-react';
import type { PwaTabItem } from '@uniprint/ui';

/**
 * Bottom-nav tabs для warehouse-mobile.
 * «Главная» = root `/`. «Списать» = /writeoff. «Брак» = /defect. «Остатки» = /stocks (placeholder).
 *
 * «Остатки» пока заглушка — экран не реализован, см. project memory `project_pwa_tabs_dead.md`.
 */
export const WAREHOUSE_TABS: PwaTabItem[] = [
  { href: '/',         label: 'Главная',  icon: Home },
  { href: '/writeoff', label: 'Списать',  icon: PackageMinus },
  { href: '/defect',   label: 'Брак',     icon: AlertTriangle },
  { href: '/stocks',   label: 'Остатки',  icon: BarChart2 },
];
