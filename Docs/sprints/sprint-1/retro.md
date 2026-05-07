# Sprint 1 Retro — Redesign 2026-05-06

## Цель спринта

Заменить визуальный слой прототипа на дизайн, подтверждённый владельцем
2026-05-06 (warm cream + coral + Fraunces). Сохранить всю архитектуру
(Turborepo, MSW, types, packages structure). Предыдущий дизайн «Press × Calm»
был отклонён владельцем 2026-05-05.

## Result — DONE

- 9 новых компонентов в `packages/ui`: PhoneFrame, RoleSwitcher, BRCallout,
  StatPill, KanbanBoard/Column/Card, BarRow, AdminTile, PnlCard, BigButton,
  PwaTaskCard, ShiftBar, AnimatedCounter
- 12 существующих компонентов отрефакторены: AppShell (dark sidebar),
  KpiCard, OrderStatusBadge (pulse), Button, Input, Select, PageHeader,
  EmptyState, MockBanner, Skeleton, Badge, Card primitives
- 6 кабинетов переписаны под новый DOM
- Анимации добавлены без framer-motion (pure CSS + IntersectionObserver + rAF):
  page-fade-in, BarRow fill-on-view, card hover-lift, AnimatedCounter count-up,
  pulse-amber/green, face-control scan
- AnimatedCounter интегрирован в KPI на 4 дашбордах (client-portal, manager-web,
  owner-dashboard, admin-panel)
- E2E тесты адаптированы под новый DOM (30 → 0 failures → 44/44 PASS)

## Test results (Rule C)

| Step | Result | Time |
|------|--------|------|
| typecheck | 10/10 PASS | 56ms (cached) |
| lint | 10/10 PASS | 51ms (cached) |
| build | 6/6 apps PASS | 5.1s (cached) |
| test | 9/9 unit PASS | 1.9s |
| test:e2e | 44/44 PASS | 24.8s |

## Что хорошо

- Subagent-driven подход ускорил рефакторинг (~22 task'а с reviews за 1 день)
- Bridge aliases в tokens.css позволили атомарный commit без breakage
- PhoneFrame даёт visual cue для desktop preview PWA-кабинетов
- AnimatedCounter + BarRow реализованы без framer-motion (pure rAF + IntersectionObserver)
- prefers-reduced-motion поддержан во всех анимациях
- E2E тесты теперь используют role/text-based селекторы (не class-based) — устойчивее к рефакторингу

## Что улучшить

- Bundle size: variable fonts (Fraunces, Manrope) загружают полный диапазон
  весов — для production нужен subsetting
- Fraunces не поддерживает Cyrillic — Russian заголовки fallback на Georgia
  (acceptable для прототипа, для production может потребоваться Cyrillic serif)
- BigButton использует `'use client'` для hover-handlers — лучше на CSS :hover
- ShiftBar inject `@keyframes` через inline `<style>` — дублирует tokens.css

## Process improvements (lessons learned)

> Владелец оценил визуал на **3/10** после первого «закрытого» спринта несмотря на pipeline 44/44 PASS. Эта секция — формальное заключение, чтобы не повторить.

### Корневые причины провала (root cause analysis)

1. **Референсы не открыты ни разу.** В `design/` лежали 6 PNG-мокапов
   (по одному на кабинет), `DESIGN_SYSTEM.md` (430 строк правил),
   `AGENT_BRIEF.md` (240 строк инструкций для AI-агента), `tokens-colors.ts`
   (полная палитра), `UI_TICKET_TEMPLATE.md`. Я работал по HTML-mockup
   из чата, не открыл ни одного файла из `design/` за 22 task'а.

2. **Pipeline-green = task done.** Финальный отчёт содержал 5 PASS-строк
   (typecheck/lint/build/test/test:e2e) — закрыл sprint с уверенностью.
   Тесты проверяли что кнопки кликаются, не что страницы выглядят как референс.
   E2E использует role/text-селекторы, computed CSS не assertится.

3. **Компоненты-сироты.** Создал `<RoleSwitcher>` (Task 5), экспортнул из
   `packages/ui/index.ts`, написал в плане «интегрировать в layout.tsx» — забыл.
   Через 17 task'ов и e2e PASS владелец указал на отсутствие role-switcher
   во всех 6 кабинетах. Компонент лежал мёртвым грузом.

4. **Subagent dispatch без vision.** Отправлял subagent'ам промпты «верни
   верстку как в mockup-секции X», но не прикреплял PNG/screenshot к промпту.
   Subagent работал по HTML-фрагменту, тоже не открывал референсы.

5. **Tailwind v4 monorepo silent failure.** `packages/ui/**/*.tsx` не сканировались
   Tailwind'ом → классы AppShell (`flex-col`, `flex-1`, `w-60`) молча отсутствовали
   в bundle → layout сломался во всех 6 apps (sidebar 182px вместо 240px,
   flex-direction:row вместо column). Pipeline всё равно PASS — никто не assertил
   computed CSS. Поймано только через Playwright screenshot после фикса.

### Превентивные меры (применимы ко всем UI-проектам)

#### Слой 1 · Skill-level (cross-project)

- **`vision-first-ui` skill** создан в `C:\Users\Max\.claude\plugins\personal\skills\vision-first-ui\SKILL.md`
  + копия в `C:\Users\Max\.claude\skills\vision-first-ui\SKILL.md` для auto-discovery.
  Глобально работает на любом проекте. Триггеры: `design / UI / screen / page /
  frontend / верстка / макет / редизайн / дизайн / компонент / стилизация`.
  Содержит 2 gate'а:
  - **Gate 1 (entry):** обязательный Glob+Read всех референсов и DESIGN-документов
    перед написанием кода
  - **Gate 2 (exit):** обязательный Playwright screenshot + verbal diff vs
    reference image перед `TaskUpdate status=completed`

#### Слой 2 · Project-level (UniPrint-специфично)

- **CLAUDE.md правило A1** добавлено (через `CLAUDE_MD_PATCH.md` от владельца):
  жёсткие запреты UI, layout-правила по кабинетам, BR-XX в UI mapping
- **Design-System документы** перенесены в `Docs/`:
  - `Docs/DESIGN_SYSTEM.md` — токены, типографика, компоненты, layout
  - `Docs/AGENT_BRIEF.md` — алгоритм UI-задачи для агента
  - `Docs/UI_TICKET_TEMPLATE.md` — шаблон GitHub-issue для UI-фичи
- **Reference PNG** в `Docs/design/references/*.png` — 6 эталонных мокапов
- **`packages/tokens/src/colors.ts`** — token-source-of-truth (TS-типизированный)
- **DoD расширен дизайн-секцией** (10 пунктов в CLAUDE.md, правило A1)

#### Слой 3 · Memory (UniPrint-локально, грузится в каждой сессии)

3 feedback-меморий записаны в `~/.claude/projects/D--Projects-Uniprint/memory/`:

- `feedback_visual_diff_required_for_ui.md` — UI task не closed без Playwright vs reference
- `feedback_check_design_folder_first.md` — Glob design/ + Read DESIGN_SYSTEM перед UI
- `feedback_no_orphan_components.md` — создал компонент → grep import перед закрытием task

### Изменения в workflow

| Раньше | Теперь |
|---|---|
| Subagent prompt «верни верстку как в mockup» | Prompt включает обязательный `reference_image_path`, агент Read'ит изображение перед кодом |
| Visual review в конце спринта | Visual review после каждого экрана (per-task), не накапливаем drift |
| `TaskUpdate completed` после имплементации | `TaskUpdate completed` только после Gate 2 (screenshot vs reference) |
| Pipeline 5/5 PASS = sprint closed | Pipeline 5/5 + visual diff acceptable for **all** screens = sprint closed |
| Создал компонент → закрыл task | Создал компонент → grep import in apps/ → если 0 → task НЕ closed |

### Phase A/B/C — план фикса (3/10 → 9/10)

Плана интеграции в этом спринте не сделано — оставлено как отдельная work-item.
Владелец выбирает дальнейшие шаги:
- **Phase A** (~6 ч): RoleSwitcher integration + TopBar contents + RoleTag — закрывает критичный gap
- **Phase B** (~10 ч): Page polish per-cabinet против `Docs/design/references/*.png`
- **Phase C** (~4 ч): Tech debt + Storybook + stylelint design-rules

## Next

- Финальный visual polish + manual Vercel preview deploy + демо владельцу
- ADR-0001 (Mobile=PWA — закрыт ответом Q6, оформить документ)
- Merge `feature/prototype` → `main` после ревью владельца
- ADR-0002/0003/0004/0005 — после ответов 🔴 Q1-Q5
