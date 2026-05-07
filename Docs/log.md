# Devlog UniPrint

> Журнал ключевых изменений по дате. Append-only. Для каждого
> изменения — короткая запись + commit-хеш.

## 2026-05-07

### Sprint 4 · Склад PWA (warehouse-mobile) per `Storage.png`

`feature/prototype` — S4 из by-cabinet roadmap'а. Аналогично S3, большая часть была
реализована в redesign 2026-05-06 (PhoneFrame, ShiftBar amber, 4 BigButton, BR-01/03/09
callout, bottom-nav 4 tabs). Доработки в S4:

**Layout (`app/layout.tsx`):**
- RoleSwitcher current="warehouse", `<div className="hidden sm:block">` (desktop preview only)
- MockBanner перенесён из `position: fixed` в inline-flow

**Page (`app/page.tsx`):**
- Обновлены writeoff history cards под Storage.png референс:
  - #1: «Бумага мелованная 300 г», meta «200 листов · 90×50» + mono «партия P-2026-039»,
    id «UNI-2026-00005 · 14:18»
  - #2: «Баннерная ткань 440 г/м²», meta «3 м² · ПВХ» + mono «партия P-2026-018»,
    id «UNI-2026-00003 · 13:46»
  (раньше материалы и метаданные не совпадали с референсом)

**Vision-first-ui Gate 2:**
- `Docs/design/screenshots/v4-4-warehouse-1440.png` — desktop preview, RoleSwitcher
  + MockBanner + PhoneFrame с полным контентом, 21/21 регион MATCH
- `Docs/design/screenshots/v4-4-warehouse-380.png` — actual mobile, RoleSwitcher
  скрыт, MockBanner ясно виден, PhoneFrame full-screen
- `Docs/design/specs/warehouse-diff-v4.md` — verbal diff vs reference, PASS

**Pipeline:** typecheck 10/10, build warehouse-mobile PASS.

### Sprint 3 · Производство PWA (production-mobile) per `production.png`

`feature/prototype` — S3 из by-cabinet roadmap'а. Большая часть production-mobile уже
была реализована в redesign 2026-05-06 (PhoneFrame + ShiftBar + PwaTaskCard + BigButton
+ BR-03 callout + bottom-nav 4 tabs). В S3 — добавление RoleSwitcher для desktop preview:

**Layout (`app/layout.tsx`):**
- Импорт `RoleSwitcher`, `ROLES` из `@uniprint/ui`
- RoleSwitcher current="production", обёрнут в `<div className="hidden sm:block">` —
  показывается только на desktop preview (выше sm breakpoint = 640px), скрыт на
  actual mobile где PhoneFrame занимает весь viewport
- MockBanner перенесён из `position: fixed` в обычный inline-flow (теперь стек:
  RoleSwitcher → MockBanner → PhoneFrame на desktop, MockBanner → PhoneFrame на mobile)

**Vision-first-ui Gate 2:**
- `Docs/design/screenshots/v3-3-production-1440.png` (desktop preview) — RoleSwitcher
  + yellow MockBanner + PhoneFrame с полным контентом
- `Docs/design/screenshots/v3-3-production-380.png` (actual mobile) — RoleSwitcher
  скрыт, PhoneFrame на весь экран
- `Docs/design/specs/production-diff-v3.md` — verbal diff vs reference, PASS, 2 cosmetic
  follow-ups в S7 (subtle MockBanner на mobile, status bar дубль на actual mobile).

**Pipeline:** typecheck 10/10, lint 10/10, build production-mobile PASS.

### S2 follow-up · Button readability + global OrderStatusBadge colors

`feature/prototype` — Найдены и исправлены два визуальных бага сразу после S2 review:

**Баг 1 (Button «+ Новый заказ» нечитаема):** Tailwind 4 без явного `length:`-hint
интерпретирует `text-[var(--text-sm)]` ambivalently — генерирует и `font-size`,
и `color: var(--text-sm)` (= length, невалидный color → fallback inherit → ink).
Итог: brand variant пытался поставить cream-on-ink, но size variant сверху ставил
color = ink. Текст стал невидим. Фикс — в `packages/ui/src/components/button.tsx`:
- size variants: `text-[var(--text-*)]` → `text-[length:var(--text-*)]`
- brand variant: `text-[var(--color-bg)]` → `[color:var(--color-bg)]`
  (arbitrary-property syntax, чтобы tailwind-merge не схлопывал с size'овой).

**Баг 2 (статусы в client-portal/manager-web таблицах не цветные):** OrderStatusBadge
использовал `--status-{key}-bg` токены, для 6 из 14 статусов это был блёклый
`#EAE2D2` или `#F0ECEA` (warm gray) — статусы выглядели одинаково. Глобальный фикс
в `packages/ui/src/components/order-status-badge.tsx`: компонент теперь wrap'ит StatPill
через `STATUS_TO_PILL` маппинг (queue/work/done/design/review/defect/neutral) — те же
яркие токены, что в Kanban. Изменение глобальное — все 6 кабинетов получили цветные
статусы автоматически без правок в apps/.

**Также:**
- `apps/manager-web/app/layout.tsx`: Button size sm→md + Plus icon 14→16 (ещё лучше readability)
- `apps/manager-web/app/page.tsx`: убран дубль `statusToPill` helper (логика ушла в OrderStatusBadge)

**Pipeline:** typecheck 10/10, lint 10/10 (2 pre-existing warnings), unit 9/9,
build manager-web + client-portal PASS.

**Screenshots:** `v2-4-manager-viewport.png` (button читаемая), `v2-4-manager-table.png`
(таблица с цветными статусами), `v2-4-client-statuses.png` (client-portal таблица — те же
цветные статусы автоматически).

### Sprint 2 · Менеджер (manager-web) polish per `manager.png`

`feature/prototype` — Реализован Sprint 2 из by-cabinet roadmap'а
(`Docs/superpowers/plans/2026-05-06-roadmap-by-cabinet.md`).

**Layout (`app/layout.tsx`):**
- `RoleSwitcher current="manager"` поверх AppShell
- `stickyTopOffset={49}`
- `topbarLeft` = Crumbs «Менеджер / Дашборд»
- `topbarRight` = SearchInput «Заказ, клиент, телефон…» + Button «+ Новый заказ»
  (Plus leftIcon) + IconButton Bell с red dot
- Sidebar nav 2 секции: «Продажи» (Дашборд / Лиды badge=3 / Заказы / Клиенты /
  Каталог · BR-04) + «Документы» (Счета и акты / Постобслуживание badge=2)

**Dashboard (`app/page.tsx`):**
- RoleTag «Менеджер офиса» + PageHeader «Сегодня, HH:MM» (time italic coral)
- KPI cols-5 (hardcoded baseline): 3 / 6 / 30 / 2 / 160 sup«к ₽» с дельтами
  «конверсия 62%» / «из 30 заказов» / «+4 сегодня» / «просрочены 0» / «+18% к плану»
- Card «Активные заказы» с Tabs «Канбан/Список/Календарь», count badge=8
- Kanban 4 cols ×2 cards (col tones: design→queue/lead→work→done):
  «Лиды/Дизайн» (00007 ИП Соколов avatar ЕС, 00008 pill «Согласование» avatar МИ),
  «В очереди» (00001 Рассвет ИП, 00009 «50 шт · цех» АК),
  «В производстве» (00002 pill «Печать» АК, 00003 pill «На контроле» ДС),
  «Готовы/Выданы» (00004 pill «Готов» ДС, 00005 pill «Выдан» МИ)
- Card «Все заказы за сегодня 8» с Button ghost «Экспорт» (Download icon)
- Table 6 cols: № · Заказ · Клиент · Тип · BR-07 · Статус (OrderStatusBadge) · Сумма

**Mocks (`fixtures/orders.ts`):**
- 00007 reassigned cli_001 → cli_007 (ИП Соколов) per Kanban reference
- 00008 reassigned cli_001 → cli_003 (ООО «Маяк») per Kanban reference
- Header comment обновлён: 6 orders для cli_001 (client-portal), 14 total

**Vision-first-ui Gate 2:**
- `Docs/design/screenshots/v2-2-manager-1440.png` (full page)
- `Docs/design/screenshots/v2-2-manager-380.png` (mobile)
- `Docs/design/specs/manager-diff-v2.md` — verbal diff vs reference, PASS

**Pipeline (S2.4):** typecheck 10/10, lint 10/10 (2 pre-existing warnings в
tabs.tsx про type-only-import + stale biome-ignore — не из S2), build manager-web PASS.

**Follow-ups → S7 (Hardening):**
1. RoleTag tone=manager rendering — currently blue, reference appears coral
2. Fixture client distribution для UNI-00002..00006 — все cli_001 vs reference's varied
3. Tabs.tsx 2 lint warnings (cleanup)

## 2026-05-06

### Redesign 2026-05-06 — визуальный пересмотр прототипа

`feature/prototype` — Полный визуальный пересмотр после отказа от «Press × Calm»
(см. `Docs/log.md` 2026-05-05). Дизайн-концепция подтверждена владельцем
single-file HTML mockup (`Docs/design/mockup-2026-05-06.html`).

**Палитра / шрифты:** warm cream `#FAF6EF` + coral `#D9531E` + Fraunces serif
headings + JetBrains Mono для ID/цен + Manrope body. Dark sidebar, status pills
с pulse-анимацией, BR-callouts inline в UI, PWA phone-frame для mobile.

**Component library:** 9 новых компонентов (PhoneFrame, RoleSwitcher, BRCallout,
StatPill, KanbanBoard/Column/Card, BarRow, AdminTile, PnlCard, BigButton,
PwaTaskCard, ShiftBar, AnimatedCounter) + рефакторинг 12 существующих
(AppShell, KpiCard, OrderStatusBadge, Button, Input, Select, PageHeader,
EmptyState, MockBanner, Skeleton, Badge, Card primitives).

**Все 6 кабинетов** переписаны под новый DOM: client-portal (KPI + sticky
form-card), manager-web (KPI cols-5 + Kanban 4 cols), production-mobile
(PhoneFrame + ShiftBar + PwaTaskCard), warehouse-mobile (4 BigButton + BR-01/03/09
callout), admin-panel (6 AdminTile grid), owner-dashboard (3 PnlCard + 3 BarRow).

**Анимации:** page-fade-in (AppShell `<main>`), BarRow fill-on-view
(IntersectionObserver), card hover-lift (interactive variant), count-up KPI
(AnimatedCounter в 4 кабинетах), pulse-amber на «work» статусах,
pulse-green на ShiftBar, scan на face-control камере. Уважает `prefers-reduced-motion`.

**MSW handlers + types:** не тронуты — данные слой полностью сохранён.
**API всех компонентов** сохранён (backward-compat для всех 6 apps).

**Pipeline (Rule C):**
- typecheck: 10/10 PASS (56ms cached)
- lint:      10/10 PASS (51ms cached)
- build:     6/6 apps PASS (5.1s cached)
- test:      9/9 unit PASS (1.9s)
- test:e2e:  44/44 PASS in 24.8s (адаптированы под новый DOM)

Подробнее — `Docs/sprints/sprint-1/retro.md` § «Test results».

Commits: `47a6baf` (tokens) → `43e597e` (gold variants) → `7726cd5` (bridge aliases)
→ `4e22659` (next/font) → `2bf929b` (AppShell dark) → `a2cbf9c` (PhoneFrame+RoleSwitcher+BRCallout)
→ `04f6646` (StatPill+AnimatedCounter+KpiCard+OrderStatusBadge) → `365ae76` (Kanban+BarRow)
→ `19c105a` (5 components + Kanban responsive) → `4ee6e1c` (8 base refactors)
→ `4eb4da7` (client-portal+manager-web pages) → `1adda31` (production+warehouse-mobile)
→ `024af33` (admin-panel+owner-dashboard) → `e742d69` (animations polish + e2e adapt).

## 2026-05-05

### Design system overhaul — Phase 1+2+3 complete

Применён Claude-inspired design system во все 6 кабинетов. Бренд: warm
cream + coral primary + Manrope/Inter Tight типографика. 12 компонентов
(6 переписаны, 6 новых). Заменено 15+ эмодзи на lucide-react иконки.
Каждый кабинет обёрнут в AppShell с семантической навигацией (sidebar +
mobile drawer/bottom-nav). Исправлены UX C5 (mobile-tables overflow-x-auto),
C6 (price preview client-portal), I11 (manager-web redirect TODO).

Исправлены 2 реальных бага Phase 2 (двойной disabled-placeholder в `<Select>`
warehouse-mobile/writeoff и warehouse-mobile/defect — опции `{ value: '', disabled: true }`
дублировались в массиве `options` и в `placeholder`-проп Select-компонента).

Pipeline (Rule C):
- typecheck: 10/10 packages PASS (1.6s)
- lint:      10/10 packages PASS (0.4s)
- build:     6/6 apps PASS (11.7s)
- unit:      9/9 mocks tests PASS (0.5s)
- e2e:       44/44 playwright PASS in 13.4s

Коммиты:
- `970303d` feat(proto/design): tokens + 12 components
- `add9af1` feat(proto/client-portal): integrate design system + AppShell + price preview
- `e5db381` feat(proto/manager-web): integrate design system + AppShell + redirect fix
- `9925269` feat(proto/production-mobile): integrate design system + AppShell mobile bottom-nav
- `ab806d7` feat(proto/warehouse-mobile): integrate design system + AppShell mobile bottom-nav
- `a16d238` feat(proto/admin-panel): integrate design system + AppShell + mobile tables
- `3c2f4dc` feat(proto/owner-dashboard): integrate design system + AppShell + KpiCard hero
- + Phase 3 commit (smoke updates + bug fixes)

### Прототип на моках готов (feature/prototype)

17 задач плана `Docs/superpowers/plans/prototype.md` выполнены через
subagent-driven-development. Pipeline: 10 packages typecheck PASS,
6 apps build PASS, 16/16 Playwright smoke PASS.

**Структура прототипа** (`prototype/`):
- 4 shared packages: `tokens` (Tailwind 4 CSS-config), `types` (domain),
  `mocks` (MSW + fixtures), `ui` (Button/Card/Badge/Input/OrderStatusBadge/MockBanner)
- 6 cabinets: client-portal (3001), manager-web (3002), production-mobile
  PWA (3003), warehouse-mobile PWA (3004), admin-panel (3005),
  owner-dashboard (3006)
- Playwright smoke: 8 tests × 2 profiles (desktop + iPhone 14)
- MOCK_NOTICE.txt + README с 6 demo URL placeholders

**Бизнес-инварианты в коде:**
- BR-01 (списание только на заказ) — `mocks/handlers/materials.ts`
- BR-02 (антидублирование клиентов) — `mocks/handlers/clients.ts` с
  нормализацией +7/8/7-prefix
- BR-09 (FIFO partybatch) — тот же handler
- BR-21 (биометрические согласия) — `users/page.tsx` admin-panel
- BR-31 (двойная формула ЗП) — `types/payroll.ts`
- BR-03 (брак фиксирует только складщик) — UI-уровень (warehouse-mobile only)

**Коммиты** (на `feature/prototype`, 18 шт):
- `83a2c5f` bootstrap turborepo + `884cafd` gitignore fix
- `838a22a` types
- `3f318e3` tokens
- `e518125` mocks
- `47dbdd7` ui + `089ba7d` styles.css fix
- `cb2a284` client-portal scaffold (с .js→ext fix Phase A)
- `f931d41` /orders + /orders/[id]
- `e69c66f` /orders/new
- `e4e3168` vercel.json client-portal
- `2d2e887` manager-web
- `bd78e8c` production-mobile (PWA)
- `e7f7a10` warehouse-mobile (PWA)
- `5d84481` admin-panel
- `aa00e78` owner-dashboard
- `c26b8fd` playwright smoke
- `9e993e4` MOCK_NOTICE + README

**Что осталось вручную для владельца:**
1. `cd prototype/apps/<cabinet> && pnpm dlx vercel link && pnpm dlx vercel --prod=false`
   для каждого из 6 кабинетов
2. Вписать 6 preview-URL в `prototype/README.md`
3. Ревью UX в браузере → fb или approve → merge `feature/prototype` → `main`

### Spec pack (на main)

7 документов спецификации + BUSINESS_RULES + 3 скелета:
- `e553309` spec pack (7 файлов спеки + 3 скелета + BUSINESS_RULES)
- `eb1e352` prototype implementation plan

Делегировано cs-product-strategist (opus, 5 файлов) + cs-product-manager
(opus, 2 файла) + cs-senior-engineer (opus, 3 скелета). Закреплены
ответы owner от 2026-05-05 (PWA, без Telegram в продукте, Yandex stack,
B2B+B2C → ОФД, double payroll formula).

### Owner answers + bootstrap (на main)

- `2145c27` CLAUDE.md + team-structure.md + owner-questions.md
- Owner answers получены, обновлены: owner-questions.md (✅/⏸ маркеры),
  CLAUDE.md, скелеты 03/05/09 под фиксированные решения

## 2026-05-04

- `9d0aae2` docs: convert ТЗ to markdown
- `adc2960` Initial commit: ТЗ от заказчика (`.docx` → `.md`)
- git init, remote `github.com/SigmeD/uniprint.git`
