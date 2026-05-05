import { test, expect } from '@playwright/test';

const APPS = [
  { name: 'client-portal',     port: 3001, headerText: 'Здравствуйте' },
  { name: 'manager-web',       port: 3002, headerText: 'Менеджер · UniPrint' },
  { name: 'production-mobile', port: 3003, headerText: 'Начало смены' },
  { name: 'warehouse-mobile',  port: 3004, headerText: 'Склад' },
  { name: 'admin-panel',       port: 3005, headerText: 'Админ-панель' },
  { name: 'owner-dashboard',   port: 3006, headerText: 'Дашборд учредителя' },
];

for (const app of APPS) {
  test(`${app.name} — открывается + MockBanner виден`, async ({ page }) => {
    await page.goto(`http://localhost:${app.port}`);
    await expect(page.locator('.mock-banner')).toContainText('PROTOTYPE');
    await expect(page.locator('h1').first()).toContainText(app.headerText);
  });
}

test('client-portal: создание заказа', async ({ page }) => {
  await page.goto('http://localhost:3001/orders/new');
  await page.locator('select').selectOption('office');
  await page.fill('input[placeholder*="баннер"]', 'Тестовый заказ из smoke');
  await page.locator('input[type="number"]').fill('5');
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/orders\//);
  await expect(page.locator('h1')).toContainText('UNI-2026-');
});

test('warehouse-mobile: списание материала на заказ (BR-01)', async ({ page }) => {
  await page.goto('http://localhost:3004/writeoff');
  await page.locator('select').first().waitFor();
  // выбираем первый доступный заказ
  await page.locator('select').first().selectOption({ index: 1 });
  await page.locator('select').nth(1).selectOption({ index: 1 });
  await page.locator('input[type="number"]').fill('1');
  await page.getByRole('button', { name: /Списать/ }).click();
  await expect(page.locator('text=/Списано|FIFO/')).toBeVisible({ timeout: 5000 });
});
