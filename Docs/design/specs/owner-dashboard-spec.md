# Owner Dashboard · Spec из owner.png

> Reference: `Docs/design/references/owner.png`
> App: `prototype/apps/owner-dashboard/`

## Layout (top → bottom)

1. **RoleSwitcher** (sticky top, dark)
2. **TopBar** (sticky top-49, 62px):
   - Crumbs: `Учредитель / Сводка`
   - topbarCenter: Tabs Сегодня / Неделя(active) / Месяц / Год — pill style
   - Button ghost: Download icon + «Экспорт»
   - IconButton bell (с red dot)
3. **MockBanner**
4. **PageHead** (padding 30px):
   - RoleTag owner tone: «Учредитель»
   - PageTitle Fraunces 32 «Сводка за неделю» — em accent «неделю» italic coral
   - PageSub: «Я хочу открыть телефон утром и за 2 минуты понять, заработал я вчера или потерял.»
5. **Stats grid (cols-4)**:
   - «ЗАКАЗОВ» 30 (Package icon) + trend «+18% к плану» (up,good)
   - «В ПРОИЗВОДСТВЕ» 6 (LineChart icon) + trend «загрузка ровная» (flat)
   - «ВЫДАНО» 6 (CheckCircle icon) + trend «в срок 100%» (up,good)
   - «БРАК» 3 RED (AlertTriangle icon) + trend «потери 4 200 ₽» (down,!good = red)
6. **Section title** Fraunces 500 20px «P&L» (margin 8 0 14)
7. **PnlCard grid (cols-3 gap 14)**:
   - **profit** (green gradient): label «ПРИБЫЛЬ» + value Fraunces 34 «2 250 ₽» + trend «↑ +1% маржа»
   - **revenue** (blue gradient): label «ВЫРУЧКА» + value «160 500 ₽» + trend «за неделю»
   - **cost** (coral gradient): label «СЕБЕСТОИМОСТЬ» + value «158 250 ₽» + trend «материалы + работа + амортизация»
8. **Card «Доходимость по типам заказов · BR-07»** (margin-bottom 18):
   - Header right: muted text «три потока»
   - **3 BarRow** (padding 12 0):
     - label «Цех (наружка)» + hint «10 шт · услуга-цех» + percent 78 + value Fraunces «252 500» + unit «₽»
     - label «Офис-полиграфия» + hint «10 шт · услуга-офис» + percent 83 + value «267 500» + unit «₽»
     - label «Готовый товар» + hint «10 шт · продажа-товар» + percent 88 + value «282 500» + unit «₽»
9. **Bottom row (1.5fr 1fr gap 14)**:
   - **Card «Топ заказов по прибыльности»**:
     - Header right: Button ghost «drill-down →»
     - Table cols: № | Заказ | Выручка (right) | Прибыль (right, цвет green/red)
     - 4 rows:
       - UNI-00004 «Баннер 6×1 м» / 9 500 ₽ / +3 800 ₽ green-ink
       - UNI-00005 «Визитки 500 шт» / 11 000 ₽ / +3 100 ₽ green-ink
       - UNI-00003 «Готовый стенд тип 3» / 8 000 ₽ / +2 100 ₽ green-ink
       - UNI-00002 «Визитки 200 шт» / 6 500 ₽ / **−240 ₽ red-ink**
   - **Card «Брак и потери»**:
     - Header right: StatPill defect «3 факта»
     - 3 rows (padding 10 0, border-bottom):
       - «Перерасход баннерной ткани» / meta «UNI-2026-00001 · этап «Печать»» / amount red −1 800 ₽ + meta «фикс. ДС»
       - «Брак тиража визиток» / meta «UNI-2026-00002 · BR-03» / amount red −1 600 ₽ + meta «фикс. ДС»
       - «Сбой ламинации» / meta «UNI-2026-00008 · этап «Постпечать»» / amount red −800 ₽ + meta «фикс. ДС»
     - Button ghost «Открыть отчёт по браку» (margin-top 10, full-width)

## User context

- Name: Виктор Соколов
- Role: Учредитель
- Avatar tone: dark, initials «ВС»

## Sidebar nav (with sections)

- Section «АНАЛИТИКА»:
  - Сводка (active, BarChart3 icon)
  - P&L (DollarSign icon)
  - Прибыль по заказам (TrendingUp icon)
  - Команда (Users icon)
  - Отчёты (FileText icon)
- Section «КОНТРОЛЬ»:
  - Брак и потери (AlertTriangle icon, badge brand=3)
  - Простои (Clock icon)

## BR-XX visible on screen

- BR-07: Card «Доходимость по типам заказов · BR-07» с 3 BarRow
- BR-03: Brak panel mention «UNI-2026-00002 · BR-03»
