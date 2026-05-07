# UniPrint

> ERP и клиентская платформа для типографии + производства наружной
> рекламы. Greenfield, РФ-юрисдикция (допущение до подтверждения), 6
> ролевых кабинетов на едином API.

## О проекте

UniPrint объединяет **6 контуров** в одну систему:

1. **Продажи (CRM)** — лиды, заказы, клиенты, согласования, антидубль
   контрагентов по телефону.
2. **Производство** — три потока (цех наружки / офис-полиграфия / продажа
   готового товара со склада) с разными статус-машинами, сдельной оплатой
   и Face Control.
3. **Склад** — материалы (антидубль SKU), списания **только на заказ**,
   фиксация брака **только складщиком**.
4. **Финансы** — себестоимость, ЗП, баланс сотрудника (займы от
   компании при недоборе), амортизация, налоги, логистика.
5. **HR** — KPI, сдельная оплата, Face Control с письменным согласием
   (152-ФЗ ст. 11).
6. **Клиентский кабинет** — заказ, статус, документы, оплата, фид.

Полный спек — `Docs/00-summary.md` и далее `01-…10-…`. Бизнес-правила
(BR-XXX) — `BUSINESS_RULES.md`. Исходные ТЗ заказчика —
`Docs/tz-po-uniprint.md` + `Docs/tz-dop-modules.md`.

## Стек

| Слой | Phase-0 (прототип) | Prod (после ADR) |
| --- | --- | --- |
| Web | **Next.js 16** + React 19 + TS + Tailwind + shadcn/ui | то же |
| Mobile (сотрудники) | **PWA mobile-first** (Service Worker + manifest) | PWA |
| Backend | mock через **MSW** | DRF / NestJS — TBD |
| БД | — | PostgreSQL 15+ |
| Кеш / WS | — | Redis 7 |
| Карты | — | Yandex Maps |
| S3 макетов | — | Yandex Object Storage |
| Хостинг прототипа | Vercel preview | TBD (Yandex.Cloud / Selectel — РФ-юрисдикция) |
| Нотификации | UI mock | WebPush + SMS + Email (без Telegram в продукте) |
| Tracker | GitHub Issues | GitHub Issues |

## Структура репо

- `Docs/` — единая папка документации (спека + ТЗ + ADR + PRD + sprints).
- `prototype/` — Turborepo: 6 apps (`client-portal`, `manager-web`,
  `production-mobile`, `warehouse-mobile`, `admin-panel`,
  `owner-dashboard`) + 4 packages (`ui`, `mocks`, `tokens`, `types`)
  + Playwright e2e.
- `BUSINESS_RULES.md` — инварианты BR-01..BR-36.
- `CLAUDE.md` — правила работы с Claude Code (Context7, doc-first, TDD).

## Команды

```bash
cd prototype
pnpm install
pnpm dev          # 6 apps на :3001..:3006
pnpm build        # production-сборка всех apps
pnpm test:e2e     # Playwright golden-path + a11y (44 tests)
pnpm typecheck    # TS check на всех packages
pnpm lint         # Biome
```

Локалка после `pnpm dev`:

| Кабинет | URL |
| --- | --- |
| Клиент | http://localhost:3001 |
| Менеджер | http://localhost:3002 |
| Производство (PWA) | http://localhost:3003 |
| Склад (PWA) | http://localhost:3004 |
| Админ | http://localhost:3005 |
| Учредитель | http://localhost:3006 |

## Текущий статус

**Phase-0** (discovery + спека + прототип на моках). By-cabinet roadmap
S0-S7 закрыт 2026-05-07. **Прототип в проде на Vercel** — 6 кабинетов:

- https://uniprint-client.vercel.app (Клиент)
- https://uniprint-manager.vercel.app (Менеджер)
- https://uniprint-production.vercel.app (Производство · PWA)
- https://uniprint-warehouse.vercel.app (Склад · PWA)
- https://uniprint-admin.vercel.app (Админ)
- https://uniprint-owner.vercel.app (Учредитель)

Auto-deploy на push в `main`. Все данные синтетические, реальные ПДн
вводить запрещено (PROTOTYPE banner на каждом экране).

Pipeline: typecheck 10/10 · lint 10/10 0 warnings · build 6/6
· **e2e 44/44 PASS** на feature-ветке.

**Открытые блокеры (ответы заказчика):** Q1 юрисдикция, Q2 Face
Control vendor, Q3 хостинг, Q4 миграция legacy, Q5 эквайринг.

Подробности — `CLAUDE.md` § «Текущий статус» и `Docs/log.md`.

## Compliance

При запуске пилота (РФ): уведомление РКН, политика обработки ПДн,
**отдельное согласие на биометрию** (Face Control, 152-ФЗ ст. 11),
audit-log на доступы к ПДн, 5-летнее хранение первичных документов
(402-ФЗ), онлайн-чеки через ОФД для B2C-оплат (54-ФЗ). Полный список —
`Docs/09-compliance.md`.

## Документация

- [CLAUDE.md](CLAUDE.md) — правила работы с Claude Code и текущий статус
- [BUSINESS_RULES.md](BUSINESS_RULES.md) — инварианты BR-XXX
- [Docs/00-summary.md](Docs/00-summary.md) — executive summary
- [Docs/01-vision.md](Docs/01-vision.md) … [10-bpmn.md](Docs/10-bpmn.md) — спецификация
- [Docs/log.md](Docs/log.md) — журнал изменений
- [Docs/team-structure.md](Docs/team-structure.md) — команда + agent routing
- [Docs/DESIGN_SYSTEM.md](Docs/DESIGN_SYSTEM.md) — токены и UI-компоненты
