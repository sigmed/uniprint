# Devlog UniPrint

> Журнал ключевых изменений по дате. Append-only. Для каждого
> изменения — короткая запись + commit-хеш.

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
