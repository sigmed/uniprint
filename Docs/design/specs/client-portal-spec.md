# Client Portal · Spec из User.png

> Reference: `Docs/design/references/User.png`
> App: `prototype/apps/client-portal/`

## Layout (top → bottom)

1. **RoleSwitcher** (sticky top, dark, 49px)
2. **TopBar** (sticky top-49, 62px, cream/85 + backdrop-blur)
   - Crumbs: `Кабинет клиента / Главная` (last bold)
   - SearchInput right: «Поиск по заказам и услугам» + ⌘K
   - IconButton bell (с red dot)
3. **MockBanner** (yellow stripe «PROTOTYPE — данные синтетические…»)
4. **PageHead** (padding 30px):
   - RoleTag client tone: «Клиент · ООО «Рассвет»»
   - PageTitle Fraunces 32px medium «Здравствуйте, Иван» — em accent «Иван» italic coral
   - PageSub: «Создавайте заказы, отслеживайте статусы печати и получайте документы — всё в одном месте.»
5. **Stats grid (cols-4)**:
   - «Активные заказы» 3 (Package icon) + trend «+1 за неделю» (up,good)
   - «В производстве» 2 + trend «готовность ≈ 78%» (flat)
   - «Расходы за месяц» 42 800 ₽ + trend «−12% к прошлому» (down,good)
   - «Бонусный баланс» 1 280 ₽ + trend «истекает 01.07» (up,neutral)
6. **client-grid (1fr 380px)**:
   - **Left**: Card «Последние заказы 12»
     - Tabs: Все(active) / В работе / Готовы / Архив
     - Table cols: № (mono UNI-2026-XXXXX) | Заказ (name + meta) | Статус (StatPill) | Сдача (date) | Сумма (Fraunces) | →
     - 5 rows: UNI-00001 «Баннер 3×1 м / люверсы, ПВХ 440 г/м²» (StatPill queue), UNI-00002 «Визитки 200 шт / 90×50 мм · 4+4 · ламинация» (work), UNI-00003 «Готовый стенд тип 3 / самосборный, А-формат» (review), UNI-00004 «Баннер 6×1 м / баннерная ткань, монт. карманы» (done), UNI-00005 «Визитки 500 шт / 90×50 мм · мел. 300 г» (delivered)
   - **Right**: form-card sticky top-130:
     - Form-icon (gradient brand-soft) + title «Новый заказ» + sub «Менеджер уточнит детали»
     - Field «Тип заказа *» Select: Услуга офис / Услуга цех / Готовый товар со склада
     - Field «Что заказываете *» Input + chips: Визитки, Листовки, Баннер, Каталог
     - Field-row 2 cols: Срок Select [Стандарт (3-5 дн.), Срочно (24 ч)] + Кол-во Input (number, min=1)
     - Field «Макет»: upload zone (Upload icon coral, «Загрузите файл или перетащите», small «PDF, AI, PSD · до 2 ГБ · S3»)
     - price-box (gradient + radial glow): label «ПРЕДВАРИТЕЛЬНАЯ СТОИМОСТЬ», value Fraunces 34px «1 500 ₽», note «Уточняется по справочнику BR-04» (BR-04 mono)
     - Button primary «Создать заказ» + arrow icon
     - Button secondary «Сохранить как черновик»

## User context

- Name: Иван Петров
- Company: ООО «Рассвет»
- Role: Клиент B2B
- Avatar tone: brand (gold→coral gradient), initials «ИП»

## Sidebar nav

- Главная (active, Home icon)
- Новый заказ (FileText)
- Мои заказы (Package, badge=3)
- Каталог услуг (LayoutGrid)
- Документы (FileText)
- Поддержка (HelpCircle)
