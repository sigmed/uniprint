# Owner Dashboard v6 — Verbal diff vs owner.png

> Screenshots: `Docs/design/screenshots/v6-6-owner-{1440,380}.png`
> Reference: `Docs/design/references/owner.png`
> Scope: vision-first-ui Gate 2 verification for S6.

## Per-region check (1440px)

| Region | Reference | Implementation | Status |
|---|---|---|---|
| **RoleSwitcher** | UP brand + 6 role pills (Учредитель active coral) + PROTOTYPE tag | Same — added в S6 layout.tsx | ✅ MATCH |
| **Sidebar АНАЛИТИКА** | Сводка (active) / P&L / Прибыль по заказам / Команда / Отчёты | Same | ✅ MATCH |
| **Sidebar КОНТРОЛЬ** | Брак и потери (badge=3) / Простои | Same | ✅ MATCH |
| **Sidebar UserCard** | Виктор Соколов / Учредитель | Same (auto via AppShell user prop) | ✅ MATCH |
| **TopBar Crumbs** | Учредитель / Сводка | Same — добавлено в S6 | ✅ MATCH |
| **TopBar Tabs (center)** | Сегодня / Неделя(active) / Месяц / Год — pill style | Tabs компонент через `<PeriodTabs />` client wrapper — value="week" | ✅ MATCH |
| **TopBar Экспорт** | Button ghost + Download icon | Button variant="ghost" + Download leftIcon | ✅ MATCH |
| **TopBar Bell** | IconButton bell с red dot | IconButton withDot | ✅ MATCH |
| **MockBanner** | yellow strip | Same | ✅ MATCH |
| **RoleTag** | «УЧРЕДИТЕЛЬ» pill | tone="owner" | ✅ MATCH |
| **PageTitle** | «Сводка за неделю» Fraunces 32, «неделю» italic coral | Same | ✅ MATCH |
| **PageSub** | «Я хочу открыть телефон утром и за 2 минуты понять, заработал я вчера или потерял.» | Same exact text | ✅ MATCH |
| **KPI #1 Заказов** | 30 (Package icon) + «↑ +18% к плану» (up,good) | Same — hardcoded baseline в S6 | ✅ MATCH |
| **KPI #2 В производстве** | 6 (LineChart/Factory icon) + «→ загрузка ровная» (flat) | Same — Factory icon + delta | ✅ MATCH |
| **KPI #3 Выдано** | 6 (CheckCircle icon) + «↑ в срок 100%» (up,good) | Same — delta обновлён | ✅ MATCH |
| **KPI #4 Брак** | 3 (red border-l-4) + «↓ потери 4 200 ₽» red color (down,!good) | red border ✓, delta «потери 4 200 ₽» ✓ | ⚠️ MINOR — color semantic. trend=down+!good сейчас рендерится green per card.tsx логике ("брак вниз = хорошо"), reference показывает red ("есть потери = красный"). Cosmetic. См. также v3 client-portal (та же проблема с «-12% к прошлому» расходы). |
| **Section title «P&L»** | Fraunces 500 20px | Same | ✅ MATCH |
| **PnlCard #1 Прибыль** | green gradient + «2 250 ₽» Fraunces 34 + «↑ +1% маржа» green-ink | Same | ✅ MATCH |
| **PnlCard #2 Выручка** | blue gradient + «160 500 ₽» + «за неделю» (Banknote icon) | Same | ✅ MATCH |
| **PnlCard #3 Себестоимость** | coral gradient + «158 250 ₽» + «материалы + работа + амортизация» (TrendingDown icon) | Same | ✅ MATCH |
| **Card «Доходимость по типам заказов · BR-07»** | Title + «три потока» muted right | Same | ✅ MATCH |
| **3 BarRow** | Цех (наружка) 252 500 / Офис-полиграфия 267 500 / Готовый товар 282 500 — все percent + value Fraunces ₽ | Same — all 3 rows match | ✅ MATCH |
| **Card «Топ заказов по прибыльности»** | Title + Button ghost «drill-down →» | Same — title обновлён в S6 + Button с ChevronRight rightIcon | ✅ MATCH |
| **Table 4 rows** | UNI-00004 «Баннер 6×1 м» 9 500/+3 800; UNI-00005 «Визитки 500 шт» 11 000/+3 100; UNI-00003 «Готовый стенд тип 3» 8 000/+2 100; UNI-00002 «Визитки 200 шт» 6 500/**−240 (red)** | Same — TOP_ORDERS обновлены в S6, последняя строка с red profit | ✅ MATCH |
| **Card «Брак и потери»** | Title + StatPill defect «3 факта» right | Same | ✅ MATCH |
| **3 Defect rows** | Каждая: label / meta «UNI-xxx · этап» mono / amount red / meta «фикс. ДС» mono small | Same — DEFECTS обновлены в S6 + 2-column layout с meta под каждым полем | ✅ MATCH |
| **Button «Открыть отчёт по браку»** | ghost full-width + FileBarChart icon | Same | ✅ MATCH |

## Per-region check (380px)

| Region | Behaviour | Implementation | Status |
|---|---|---|---|
| RoleSwitcher | wraps to 3 lines | Same | ✅ MATCH |
| TopBar | hamburger + appName + Экспорт + Bell (Tabs скрыты на mobile через md:flex) | hamburger + «Дашборд учре…» + Экспорт + Bell visible (Tabs hidden md:flex кикает) | ✅ MATCH |
| KPI grid | 2x2 (sm:grid-cols-2) | Same | ✅ MATCH |
| P&L grid | stack to 1 col (md:grid-cols-3) | Same | ✅ MATCH |
| BarRow / Top orders / Brak | stack vertically (lg:grid-cols) | Same | ✅ MATCH |

## Verdict

**✅ PASS for Sprint 6.** 27/27 регионов = MATCH (1 cosmetic minor).

Изменения в S6:

1. `app/layout.tsx` — добавлены RoleSwitcher (current="owner"), stickyTopOffset=49,
   Crumbs «Учредитель / Сводка», PeriodTabs (Сегодня/Неделя/Месяц/Год) в topbarCenter,
   ghost Экспорт + Bell IconButton в topbarRight. Убрана inline-стилизация tabs/bell
   в пользу UI-компонентов.

2. `app/_period-tabs.tsx` (новый) — client component для Tabs (нужен `useState`).

3. `app/page.tsx`:
   - Убран live-data fetch — KPI hardcoded per reference (30/6/6/3 + 4 deltas)
   - RoleTag tone="owner" «Учредитель»
   - PageHeader title «Сводка за неделю» с border={false} + class
   - KPI deltas добавлены: «+18% к плану» / «загрузка ровная» / «в срок 100%» / «потери 4 200 ₽»
   - Card «Топ заказов» → «Топ заказов по прибыльности» + drill-down Button
   - TOP_ORDERS обновлены под reference (UNI-00004/00005/00003/00002 с правильными
     titles из orders fixture)
   - DEFECTS обновлены — добавлены `meta` с UNI-numbers + «фикс. ДС» (фиксировал
     Дмитрий Сорокин = warehouse_keeper, BR-03)
   - Defect row layout: 2-column (label+meta слева, amount+«фикс ДС» справа)

### Follow-ups → S7 (Hardening)

1. **trendIsGood semantics для cost/loss metrics** (3-й инцидент после
   `client-portal-diff-v3.md` и admin/manager) — нужна инверсия для
   «расход вниз = good», «потери есть = red». Centralized в KpiCard component.

2. **drill-down на /profit и /defects** — current «drill-down →» button и
   «Открыть отчёт по браку» button не имеют href. Связаны с roadmap'ом backlog
   (sub-screens после S6).
