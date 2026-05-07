'use client';

import { Tabs } from '@uniprint/ui';
import type { TabItem } from '@uniprint/ui';
import { useState } from 'react';

const PERIOD_TABS: TabItem[] = [
  { value: 'today', label: 'Сегодня' },
  { value: 'week', label: 'Неделя' },
  { value: 'month', label: 'Месяц' },
  { value: 'year', label: 'Год' },
];

/**
 * Период переключения для дашборда учредителя.
 * UI-only стейт — данные не пересчитываются (mock-данные на «неделю»).
 */
export function PeriodTabs() {
  const [period, setPeriod] = useState('week');
  return (
    <Tabs items={PERIOD_TABS} value={period} onChange={setPeriod} ariaLabel="Период" />
  );
}
