# Roadmap: 6 кабинетов by-sprint workflow (2026-05-06+)

> **Принят 2026-05-06** после владельческой оценки 3/10 на per-feature workflow.
> Реструктурировано в per-cabinet sprints: каждый кабинет = изолированный спринт.
> Workflow строго sequential, не параллельный (общая инфраструктура → по одному
> кабинету → cleanup → closure).
>
> **Документация-источник правды:** `Docs/DESIGN_SYSTEM.md`, `Docs/AGENT_BRIEF.md`,
> `Docs/UI_TICKET_TEMPLATE.md`, `Docs/design/references/*.png`.
> **Глобальный enforcement:** `~/.claude/skills/vision-first-ui/SKILL.md`
> + правило A1 в `CLAUDE.md`.

---

## 4 фазы, 8 спринтов, ~95 атомарных task'ов, ~25-30 часов

| Phase | Sprint | Cabinet / Theme | Tasks | Est. | Зависимости |
|---|---|---|---|---|---|
| **0 · Foundation** | S0 | Shared infra (5 components + ROLES + topbar slots + on-dark tokens) | 11 | ~3-4 ч | блокирует S1-6 |
| **1 · Cabinets** | S1 | **Клиент** (`client-portal`, ref `User.png`) | 13 | ~3-4 ч | после S0 |
|  | S2 | **Менеджер** (`manager-web`, ref `manager.png`) | 13 | ~3-4 ч | после S0 |
|  | S3 | **Производство PWA** (`production-mobile`, ref `production.png`) | 8 | ~2 ч | после S0 |
|  | S4 | **Склад PWA** (`warehouse-mobile`, ref `Storage.png`) | 8 | ~2 ч | после S0 |
|  | S5 | **Админ** (`admin-panel`, ref `admin.png`) | 11 | ~2-3 ч | после S0 |
|  | S6 | **Учредитель** (`owner-dashboard`, ref `owner.png`) | 13 | ~3 ч | после S0 |
| **2 · Hardening** | S7 | Tech debt + Stylelint + Storybook + e2e updates | 19 | ~5-6 ч | после S1-6 |
| **3 · Closure** | S8 | Pipeline + docs + decisions | 7 | ~2 ч | после S7 |
| **Backlog** | — | Hooks, template, fonts, regression CI, ESLint, dead-comp | 7 | TBD | независимо |

---

## Per-cabinet sprint pattern (S1-S6)

Каждый cabinet sprint следует одной структуре, ~10-13 атомарных task'ов:

1. **Read reference + gap analysis** — Read PNG + текущий page.tsx → `Docs/design/specs/<cabinet>-gap.md`
2. **Update mocks** — fixtures под demo сценарий из референса (orders, users, KPI numbers, BR data)
3. **Integrate RoleSwitcher** в layout.tsx
4. **Wire TopBar** (crumbs + search + actions per cabinet)
5. **Add RoleTag** в page-header
6. **Polish KPI** trends текст per референсу
7. **Polish content** (tabs / kanban / table data / form fields per cabinet)
8. **Pipeline check** (typecheck + lint + filter build)
9. **Playwright screenshot** at correct viewport(s)
10. **Verbal diff vs reference** by region
11. **Commit** или iterate (если diff > 20%)

---

## Sprint 0 · Foundation (11 tasks)

**Goal:** Shared infrastructure для всех cabinet sprints. Без S0 cabinet sprints не запустятся.

| # | Task | Files |
|---|---|---|
| S0.1 | Read all 6 references + extract per-cabinet specs | `Docs/design/specs/*.md` |
| S0.2 | ROLES config | `packages/ui/src/lib/roles.ts` |
| S0.3 | RoleTag component | `packages/ui/src/components/role-tag.tsx` |
| S0.4 | Crumbs component | `packages/ui/src/components/crumbs.tsx` |
| S0.5 | SearchInput component | `packages/ui/src/components/search-input.tsx` |
| S0.6 | IconButton component | `packages/ui/src/components/icon-button.tsx` |
| S0.7 | Tabs component (если не существует) | `packages/ui/src/components/tabs.tsx` |
| S0.8 | AppShell topbar slots (topbarLeft/Center/Right) | `packages/ui/src/components/app-shell.tsx` |
| S0.9 | Sticky offset (topbar top-0 → top-[49px]) | `app-shell.tsx` |
| S0.10 | on-dark color tokens | `tokens.css`, `colors.ts` |
| S0.11 | Pipeline + commit foundation | — |

---

## Sprint 1 · Клиент (13 tasks)

**Reference:** `Docs/design/references/User.png`
**App:** `prototype/apps/client-portal/`
**Mock data scenario:** ООО «Рассвет» (B2B), 3 active orders + 1 280₽ бонус

| # | Task |
|---|---|
| S1.1 | Read User.png + gap analysis |
| S1.2 | Update mocks orders (8 шт UNI-2026-00001..00008 с реалистичной meta) |
| S1.3 | Update client mock user (ООО «Рассвет», KPI 3/2/42 800₽/1 280₽) |
| S1.4 | Integrate RoleSwitcher (current="client") |
| S1.5 | Wire topbar (crumbs «Кабинет клиента / Главная» + search + bell) |
| S1.6 | Add RoleTag «Клиент · ООО Рассвет» |
| S1.7 | Add Tabs «Все/В работе/Готовы/Архив» в orders card |
| S1.8 | KPI trends per референс (+1 за неделю, готовность ≈ 78%, −12% к прошлому, истекает 01.07) |
| S1.9 | Order meta enrich (люверсы, ПВХ 440 г/м² etc) |
| S1.10 | Form-card polish (Срочно option, upload zone hints) |
| S1.11 | Pipeline check |
| S1.12 | Playwright screenshot 1440 + 380 |
| S1.13 | Verbal diff vs User.png + commit или iterate |

---

## Sprint 2 · Менеджер (13 tasks)

**Reference:** `Docs/design/references/manager.png`
**App:** `prototype/apps/manager-web/`
**Mock data scenario:** Мария Иванова, 30 заказов, 3 лида, Kanban с 8 cards (по 2 на колонку)

| # | Task |
|---|---|
| S2.1 | Read manager.png + gap analysis |
| S2.2 | Update mocks: leads + orders distributed по статусам |
| S2.3 | Update mocks: assignees + avatar tones для Kanban |
| S2.4 | Integrate RoleSwitcher (current="manager") |
| S2.5 | Wire topbar (crumbs + search + + Новый заказ button + bell) |
| S2.6 | Add RoleTag «Менеджер офиса» |
| S2.7 | KPI trends cols-5 (конверсия 62%, +18% к плану etc) |
| S2.8 | Tabs «Канбан/Список/Календарь» в active orders card |
| S2.9 | Limit Kanban cards to 2 per column |
| S2.10 | Pass assignee data to KanbanCard |
| S2.11 | Pipeline check |
| S2.12 | Playwright screenshot 1440 + 380 |
| S2.13 | Verbal diff vs manager.png + commit или iterate |

---

## Sprint 3 · Производство PWA (8 tasks)

**Reference:** `Docs/design/references/production.png`
**App:** `prototype/apps/production-mobile/`
**Mock data scenario:** Алексей К. (printer, AK green), 7 операций, 2 840₽ заработано, 3 задачи в очереди
**Note:** уже mostly OK — только RoleSwitcher отсутствует и cosmetic divergences

| # | Task |
|---|---|
| S3.1 | Read production.png + gap analysis |
| S3.2 | Integrate RoleSwitcher (current="production", hidden sm:flex для mobile) |
| S3.3 | Verify mocks (Алексей К. + tasks UNI-00002/00001/00009 + meta) |
| S3.4 | Verify ShiftBar green + Face Control 02:11:48 |
| S3.5 | Verify mini-stats (Операций 7 green, Заработано 2 840₽ coral) |
| S3.6 | Pipeline check |
| S3.7 | Playwright screenshot 380 (PWA primary) + 1440 (desktop preview) |
| S3.8 | Verbal diff vs production.png + commit или iterate |

---

## Sprint 4 · Склад PWA (8 tasks)

**Reference:** `Docs/design/references/Storage.png`
**App:** `prototype/apps/warehouse-mobile/`
**Mock data scenario:** Дмитрий С. (warehouse, ДС amber), Списано 12 / Принято 5 / Брак 1

| # | Task |
|---|---|
| S4.1 | Read Storage.png + gap analysis |
| S4.2 | Integrate RoleSwitcher (current="warehouse", hidden sm:flex) |
| S4.3 | Verify mocks (Дмитрий С. + counters 12/5/1) |
| S4.4 | Verify ShiftBar amber + Face Control 00:41:12 |
| S4.5 | Verify 4 BigButtons (icons + labels per референс) |
| S4.6 | Pipeline check |
| S4.7 | Playwright screenshot 380 + 1440 |
| S4.8 | Verbal diff vs Storage.png + commit или iterate |

---

## Sprint 5 · Админ (11 tasks)

**Reference:** `Docs/design/references/admin.png`
**App:** `prototype/apps/admin-panel/`
**Mock data scenario:** Сергей Петров (admin), 28 пользователей / 9 ролей / 200 SKU / 47 услуг + 6 admin tiles

| # | Task |
|---|---|
| S5.1 | Read admin.png + gap analysis |
| S5.2 | Update mocks: 5 users + roles + Face Control consents |
| S5.3 | Integrate RoleSwitcher (current="admin") |
| S5.4 | Wire topbar (crumbs + search + bell) |
| S5.5 | Add RoleTag «Администратор» |
| S5.6 | KPI trends per референс |
| S5.7 | Verify 6 AdminTile tones + stats |
| S5.8 | Add «+ Добавить» button в users-card head |
| S5.9 | Mono-font роли + email под именем в users table |
| S5.10 | Pipeline check + screenshots |
| S5.11 | Verbal diff vs admin.png + commit или iterate |

---

## Sprint 6 · Учредитель (13 tasks)

**Reference:** `Docs/design/references/owner.png`
**App:** `prototype/apps/owner-dashboard/`
**Mock data scenario:** Виктор Соколов (owner), Прибыль 2 250₽ + Выручка 160 500₽ + Себестоимость 158 250₽, 3 BarRow по типам, 4 top-orders, 3 brak facts

| # | Task |
|---|---|
| S6.1 | Read owner.png + gap analysis |
| S6.2 | Update mocks: P&L weekly numbers + brak 3 facts |
| S6.3 | Integrate RoleSwitcher (current="owner") |
| S6.4 | Wire topbar (crumbs + period tabs + Export + bell) |
| S6.5 | Add RoleTag «Учредитель» |
| S6.6 | KPI Брак trend «потери 4 200 ₽» (red) |
| S6.7 | Other KPI trends per референс |
| S6.8 | Fix AnimatedCounter format «₽ перед» → «2 250 ₽» |
| S6.9 | Verify 3 PnlCard tones (profit green / revenue blue / cost coral) |
| S6.10 | Verify 3 BarRow по типам (BR-07): 78%/83%/88% |
| S6.11 | Update Brak panel: 3 факта с UNI-IDs + «фикс. ДС» |
| S6.12 | Pipeline check + screenshots |
| S6.13 | Verbal diff vs owner.png + commit или iterate |

---

## Sprint 7 · Hardening (19 tasks)

**Goal:** Tech debt cleanup + Storybook + Stylelint + e2e updates после всех cabinet sprints

| # | Task |
|---|---|
| S7.1 | Drop bridge aliases from tokens.css |
| S7.2 | AppShell hover handlers JS → CSS :hover |
| S7.3 | AdminTile hover handlers JS → CSS :hover |
| S7.4 | BigButton: assess CSS :hover replacement |
| S7.5 | ShiftBar inline @keyframes → tokens.css |
| S7.6 | Replace hardcoded on-dark hex с on-dark tokens |
| S7.7 | Install Stylelint + stylelint-config-standard |
| S7.8 | Configure Stylelint: color-no-hex (whitelist tokens/) |
| S7.9 | Add `lint:design` script + run + fix violations |
| S7.10 | Install Storybook for packages/ui |
| S7.11 | Stories — primitives batch (10 components) |
| S7.12 | Stories — status/badge batch |
| S7.13 | Stories — KPI/data viz batch |
| S7.14 | Stories — Kanban batch |
| S7.15 | Stories — navigation batch |
| S7.16 | Stories — PWA batch |
| S7.17 | Stories — misc batch |
| S7.18 | Update e2e selectors для нового DOM |
| S7.19 | Pipeline full Rule C run + commit S7 |

---

## Sprint 8 · Closure (7 tasks)

**Goal:** Финальный pass + docs + decisions

| # | Task |
|---|---|
| S8.1 | Final Rule C pipeline + capture numbers |
| S8.2 | Final 6-cabinet visual diff vs all references |
| S8.3 | Update Docs/log.md |
| S8.4 | Update CLAUDE.md § Текущий статус |
| S8.5 | Update sprint-1 retro: final results |
| S8.6 | Decision log: Vercel preview deploy timing |
| S8.7 | Decision log: Merge feature/prototype → main timing |

---

## Backlog (не активный спринт, но из памяти не пропадает)

| # | Task | Triggered by |
|---|---|---|
| B.1 | Hook `~/.claude/hooks/ui-task-detector.sh` (UserPromptSubmit) | Cross-project защита |
| B.2 | Project template для новых frontend-проектов | Cross-project setup |
| B.3 | Variable font subsetting для production | После prod-ADR (Q3) |
| B.4 | Cyrillic serif alternative для Fraunces | Owner decision |
| B.5 | Chromatic / Percy visual regression CI | После Storybook (S7.10-17) |
| B.6 | Dead-component detector в CI | Защита от RoleSwitcher orphan повтора |
| B.7 | ESLint `react/forbid-component-props` против inline style | Tech debt prevention |

---

## Workflow rules

1. **Только последовательно.** Не запускать S2 пока S1 не закрыт. Не запускать ни один cabinet sprint без S0.
2. **vision-first-ui Gate 2 обязателен** на каждой visual diff task'е (S1.13, S2.13, ..., S6.13). Без screenshot-vs-reference task не закрывается.
3. **Owner approval перед каждым sprint commit.** Если visual diff > 20% — НЕ commit, открыть follow-up task с описанием divergence.
4. **Pipeline-green ≠ sprint done.** Sprint done = pipeline-green + visual diff acceptable + commit.
5. **Каждый sprint = отдельный commit с префиксом `feat(proto/<cabinet>): SX polish per <reference>.png`.**
6. **Follow-up tasks** при divergence записываем в TaskCreate сразу — не «потом».

## Open questions to confirm with owner before S0 kickoff

- **OQ.1** Sprint duration: одна сессия на каждый sprint или несколько?
- **OQ.2** Subagent dispatch policy: каждая task через subagent или inline?
- **OQ.3** Visual diff acceptance criteria: % similarity или per-region binary check?
- **OQ.4** Backlog items в одном из cabinet sprints или отдельный sprint после S8?
- **OQ.5** Phase A/B/C из предыдущего плана (~3-9 hours) — superseded этим roadmap или дополняет?

## Status

- **Phase 0:** не запущено (ждёт owner approval)
- **Tasks created:** 88-197 (95 active + 7 backlog)
- **Roadmap saved:** `Docs/superpowers/plans/2026-05-06-roadmap-by-cabinet.md`
- **Vision-first-ui skill:** установлен (`~/.claude/skills/vision-first-ui/SKILL.md` + plugin copy)
- **CLAUDE.md правило A1:** применено (commit `41165fd`)
- **Design docs:** перенесены в `Docs/` (commit `41165fd`)
- **Reference PNGs:** в `Docs/design/references/` (6 файлов)
