# UniPrint Prototype

Кликабельный демо-прототип на моках. Цель — валидация UX и BPMN-схем перед sprint-1.

## 6 кабинетов

| # | Кабинет | Локально | Vercel preview |
| --- | --- | --- | --- |
| 1 | client-portal (B2B/SMB external) | http://localhost:3001 | _TBD после `vercel deploy`_ |
| 2 | manager-web (CRM офисного менеджера) | http://localhost:3002 | _TBD_ |
| 3 | production-mobile (PWA) | http://localhost:3003 | _TBD_ |
| 4 | warehouse-mobile (PWA) | http://localhost:3004 | _TBD_ |
| 5 | admin-panel | http://localhost:3005 | _TBD_ |
| 6 | owner-dashboard | http://localhost:3006 | _TBD_ |

> Vercel preview URLs появятся после ручного `vercel link` + `vercel --prod=false` владельцем — в каждом из `apps/*/` подкаталогов. См. соответствующие `vercel.json`.

## Запуск локально

```bash
cd prototype
pnpm install            # установить deps + сгенерить mockServiceWorker для всех apps
pnpm dev                # все 6 кабинетов параллельно (Turborepo)
```

После старта открыть любой `localhost:300X` — вверху должен быть жёлтый MockBanner («PROTOTYPE — данные синтетические…»), если он виден — MSW работает.

## E2E smoke

```bash
pnpm test:e2e           # Playwright golden-path × 6 кабинетов + BR-01 functional
```

8 тестов × 2 профиля (desktop + iPhone 14) = 16 проверок. Все должны пройти за ~30-40 секунд.

## Архитектура

Подробно — `Docs/03-architecture.md` (корень репо). Кратко:

- **Turborepo + pnpm workspaces** — `apps/*` (6 Next.js 16 приложений) + `packages/*` (4 общих пакета: `tokens`, `ui`, `mocks`, `types`)
- **MSW 2** — все `fetch('/api/...')` перехватываются handlers'ами в `packages/mocks/`
- **Tailwind 4 + shadcn/ui-style components** — токены через `@theme` директиву в `packages/tokens/src/tokens.css`
- **PWA** — `production-mobile` и `warehouse-mobile` mobile-first (`Viewport` export + manifest + Service Worker)
- **Tests** — Playwright smoke в `playwright/golden-path.spec.ts`

## Закреплённые бизнес-инварианты в коде

- **BR-01** — материалы списываются ТОЛЬКО на заказ (handler `mocks/handlers/materials.ts` валидирует `orderId`)
- **BR-02** — антидублирование клиентов по нормализованному телефону (`mocks/handlers/clients.ts`)
- **BR-09** — FIFO списание партий (тот же handler)
- **BR-21** — биометрические согласия (152-ФЗ ст. 11) видны в admin-panel `/users` как Badge
- **BR-31** — двойная формула сдельной ЗП (поле `payMode` в `types/payroll.ts`)

## Маркировка моков

См. `MOCK_NOTICE.txt`. Каждый кабинет показывает MockBanner вверху страницы — это сделано чтобы на демо клиенту нельзя было перепутать прототип с реальной системой.

## Что НЕ в прототипе

- Реальный backend (после ADR-0004)
- Реальные интеграции Face Control / эквайринг / ОФД / Yandex Maps / Yandex Object Storage (ждут ответов 🔴 Q2/Q5/Q3)
- Authentication / sessions (одна mock-сессия `usr_001` или `cli_001`)
- Audit-log UI (есть в `types/order.ts` `OrderHistoryEntry` — UI в sprint-1)
- Real WebPush / SMS / Email (моки только UI-уровня)

## Структура

```
prototype/
├── apps/
│   ├── client-portal/          # 3001 — внешний клиент
│   ├── manager-web/            # 3002 — CRM
│   ├── production-mobile/      # 3003 — PWA производство
│   ├── warehouse-mobile/       # 3004 — PWA склад
│   ├── admin-panel/            # 3005 — RBAC + справочники
│   └── owner-dashboard/        # 3006 — KPI + P&L
├── packages/
│   ├── tokens/                 # CSS-токены Tailwind 4
│   ├── ui/                     # Button, Card, Badge, Input, OrderStatusBadge, MockBanner
│   ├── mocks/                  # MSW handlers + fixtures
│   └── types/                  # Domain types (Order, Client, Material, ...)
├── playwright/
│   └── golden-path.spec.ts     # smoke per cabinet
├── playwright.config.ts        # 6 webServer + 2 projects
├── MOCK_NOTICE.txt             # маркировка
└── README.md                   # этот файл
```
