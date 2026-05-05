import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './playwright',
  fullyParallel: true,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 14'] } },
  ],
  webServer: [
    { command: 'pnpm --filter @uniprint/client-portal dev',      url: 'http://localhost:3001', reuseExistingServer: true },
    { command: 'pnpm --filter @uniprint/manager-web dev',        url: 'http://localhost:3002', reuseExistingServer: true },
    { command: 'pnpm --filter @uniprint/production-mobile dev',  url: 'http://localhost:3003', reuseExistingServer: true },
    { command: 'pnpm --filter @uniprint/warehouse-mobile dev',   url: 'http://localhost:3004', reuseExistingServer: true },
    { command: 'pnpm --filter @uniprint/admin-panel dev',        url: 'http://localhost:3005', reuseExistingServer: true },
    { command: 'pnpm --filter @uniprint/owner-dashboard dev',    url: 'http://localhost:3006', reuseExistingServer: true },
  ],
});
