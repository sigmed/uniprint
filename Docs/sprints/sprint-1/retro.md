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

## Next

- Финальный visual polish + manual Vercel preview deploy + демо владельцу
- ADR-0001 (Mobile=PWA — закрыт ответом Q6, оформить документ)
- Merge `feature/prototype` → `main` после ревью владельца
- ADR-0002/0003/0004/0005 — после ответов 🔴 Q1-Q5
