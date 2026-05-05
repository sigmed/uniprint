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

// ── Новые тесты ──────────────────────────────────────────────────────────────

test('client-portal: страница деталей заказа отображает номер, Сводку и статус-бейдж', async ({ page }) => {
  await page.goto('http://localhost:3001/orders/ord_0001');
  await expect(page.locator('h1')).toContainText('UNI-2026-', { timeout: 8000 });
  await expect(page.getByText('Сводка')).toBeVisible();
  // OrderStatusBadge для ord_0001 (status=queued) рендерится как span с текстом статуса
  // span рядом с h1 имеет inline-flex + rounded-full — ищем по тексту статуса
  await expect(page.getByText('В очереди')).toBeVisible();
});

test('manager-web: поиск клиента (BR-02 антидубль) показывает список и выбор', async ({ page }) => {
  await page.goto('http://localhost:3002/orders/new');
  const input = page.getByPlaceholder('Поиск по имени или телефону');
  await expect(input).toBeVisible();
  await input.fill('Клиент 1');
  // ожидаем появления выпадающего списка
  const list = page.locator('ul');
  await expect(list).toBeVisible({ timeout: 5000 });
  // должен быть хотя бы один элемент
  await expect(list.locator('li').first()).toBeVisible();
  // кликаем первый элемент
  await list.locator('li').first().click();
  // ожидаем текст "Выбран:"
  await expect(page.getByText(/Выбран:/)).toBeVisible();
});

test('production-mobile: Face Control мок-логин → редирект на /tasks', async ({ page }) => {
  await page.goto('http://localhost:3003');
  const loginBtn = page.getByRole('button', { name: /Войти на смену/ });
  await expect(loginBtn).toBeVisible();
  await loginBtn.click();
  // мок делает setTimeout 1500ms + запрос → ждём до 4 секунд
  await page.waitForURL('**/tasks', { timeout: 4000 });
  await expect(page.locator('h1')).toContainText('Мои задачи');
});

test('production-mobile: таймер работы — старт, отсчёт, стоп (BR-03)', async ({ page }) => {
  // ord_0002 (index 1) → status = in_production по fixtures
  await page.goto('http://localhost:3003/tasks/ord_0002');
  await expect(page.locator('h1')).toBeVisible({ timeout: 8000 });
  // выбираем первую операцию (Печать баннера)
  const opSelect = page.locator('select');
  await opSelect.selectOption({ index: 1 });
  // нажимаем "Начать работу"
  await page.getByRole('button', { name: /Начать работу/ }).click();
  // таймер должен появиться и показывать 0:00
  const timer = page.locator('div.font-mono');
  await expect(timer).toBeVisible();
  await expect(timer).toContainText('0:');
  // ждём 1.2 секунды — таймер должен продвинуться
  await page.waitForTimeout(1200);
  const timerText = await timer.textContent();
  expect(timerText).not.toBe('0:00');
  // устанавливаем обработчик диалога перед нажатием стоп
  page.on('dialog', (d) => d.accept());
  await page.getByRole('button', { name: /Завершить работу/ }).click();
});

test('admin-panel: таблица пользователей — 30 строк, роли и бейдж биометрии', async ({ page }) => {
  await page.goto('http://localhost:3005/users');
  await expect(page.locator('h1')).toContainText('Пользователи и роли');
  // ждём загрузки таблицы
  const rows = page.locator('tbody tr');
  await expect(rows).toHaveCount(30, { timeout: 8000 });
  // проверяем наличие бейджа биометрии (152-ФЗ)
  await expect(page.getByText('Согласие 152-ФЗ ст. 11').first()).toBeVisible();
  // проверяем наличие роли "Печатник"
  await expect(page.getByText('Печатник').first()).toBeVisible();
});

test('owner-dashboard: KPI-карточки и P&L с рублёвыми суммами', async ({ page }) => {
  await page.goto('http://localhost:3006');
  await expect(page.locator('h1')).toContainText('Дашборд учредителя');
  // 4 KPI карточки
  for (const title of ['Заказов', 'В производстве', 'Выдано', 'Брак']) {
    await expect(page.getByText(title)).toBeVisible({ timeout: 8000 });
  }
  // P&L секция
  for (const title of ['Выручка', 'Себестоимость', 'Прибыль']) {
    await expect(page.getByText(title)).toBeVisible();
  }
  // хотя бы одно значение содержит символ рубля
  await expect(page.getByText(/₽/).first()).toBeVisible();
});

test('warehouse-mobile: форма брака — кнопка заблокирована без фото', async ({ page }) => {
  await page.goto('http://localhost:3004/defect');
  // ожидаем загрузку формы
  await expect(page.locator('h1')).toContainText('Фиксация брака');
  // выбираем первый заказ в списке (in_qc из фикстур есть — ord_0003)
  const orderSelect = page.locator('select').first();
  await orderSelect.waitFor();
  await orderSelect.selectOption({ index: 1 });
  // заполняем причину
  await page.getByPlaceholder('Причина').fill('Тестовая причина');
  // кнопка должна быть disabled — фото не загружено
  const submitBtn = page.getByRole('button', { name: /Зафиксировать брак/ });
  await expect(submitBtn).toBeDisabled();
});

test('client-portal: 404 на несуществующий заказ показывает not-found UI', async ({ page }) => {
  await page.goto('http://localhost:3001/orders/ord_does_not_exist');
  await expect(page.locator('h1')).toContainText('Заказ не найден');
  await expect(page.getByRole('button', { name: /К списку заказов/ })).toBeVisible();
});
