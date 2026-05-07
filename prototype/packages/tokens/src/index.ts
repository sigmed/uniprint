export const tokens = {
  statusColors: {
    draft: 'var(--color-status-draft)',
    in_production: 'var(--color-status-in-production)',
    defect_rework: 'var(--color-status-defect)',
    ready: 'var(--color-status-ready)',
    closed: 'var(--color-status-closed)',
  },
  touchMin: 'var(--size-touch-min)',
} as const;

export const MOCK_NOTICE = 'PROTOTYPE — данные синтетические, реальные ПДн вводить запрещено';
