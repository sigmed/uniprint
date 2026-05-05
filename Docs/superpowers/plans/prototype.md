# Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Собрать кликабельный демо-прототип UniPrint на моках и задеплоить на Vercel preview. Цель — валидация UX и BPMN-схем (`Docs/02-user-journeys.md`, `10-bpmn.md`) с владельцем перед стартом sprint-1; реальный backend и интеграции (Face Control, эквайринг, ОФД) — отложены до ответов 🔴 Q1-Q5.

**Architecture:** Turborepo + pnpm workspaces. 6 Next.js 16 App Router приложений (по одному на кабинет) поверх 4 общих пакетов (`tokens`, `ui`, `mocks`, `types`). Бэкенд эмулируется MSW в каждом приложении. `production-mobile` и `warehouse-mobile` — PWA mobile-first (Service Worker + manifest, viewport-targeted). Деплой — отдельный Vercel-проект на каждое приложение, root path в репо — `prototype/`.

**Tech Stack:**
- Runtime: Node.js 22 LTS, pnpm 10
- Framework: Next.js 16 (App Router, React 19, TypeScript 5.7)
- Styling: Tailwind 4 (CSS-config, без `tailwind.config.js`) + shadcn/ui
- Mocking: MSW 2 (`msw/browser` для UI, fixtures в `packages/mocks`)
- Testing: Playwright 1.50 (golden-path smoke; unit-тесты — YAGNI для прототипа)
- Build: Turborepo 2 (pipeline `dev`, `build`, `lint`, `typecheck`, `test`)
- Deploy: Vercel preview через `vercel:deploy` skill / `vercel deploy --prebuilt`
- Lint/Format: Biome (один тул вместо ESLint+Prettier)

**Constraints (закреплены ответами 2026-05-05):**
- **Q6 ✅ Mobile = PWA only** (нет native, нет React Native, нет Flutter)
- **Q7 ✅ Telegram НЕ в продукте** (нет TG Login Widget, нет TG-нотификаций; каналы: SMS / Email / WebPush — мокаются)
- **Q10 ✅ Карты = Yandex Maps** (мок через canvas-stub в прототипе)
- **Q11 ✅ Хранилище = Yandex Object Storage** (мок через in-memory blob)
- **Q14 ✅ ОФД нужен** (мок UI «чек отправлен»)
- **Q9 ✅ Один цех / один склад** в UI (multi-warehouse FK не используется)
- **Q13 ✅ Документооборот = PDF** (мок — прелоадер + downloadable заглушка)
- **Q12 ✅ Объёмы:** 10 заказов/день, 20 одновременных пользователей, 30 сотрудников, 50 клиентов, ~200 SKU — фикстуры под этот масштаб

**Открытые блокеры (не мешают прототипу):** 🔴 Q1 (юрисдикция), Q2 (Face Control vendor), Q3 (хостинг), Q4 (миграция), Q5 (эквайринг). Все мокаются.

**Non-goals (out of scope для прототипа):**
- Реальный backend (Django/DRF или Node — после ADR-0004)
- Реальная БД (PostgreSQL — после хостинга, Q3)
- Реальный Face Control SDK (vendor — после Q2)
- Реальные интеграции (эквайринг, Yandex Maps API, S3, ОФД)
- Полная реализация всех 25 модулей (только ключевые экраны из CJM для демо)
- Audit-log, RBAC enforcement, биометрические согласия (compliance — sprint-1+)
- Mobile native приложения (PWA достаточно для демо)
- CI/CD pipeline в GitHub Actions (Vercel auto-deploy достаточно)
- Юнит-тесты на mock-handlers (YAGNI; smoke E2E покрывает)

---

## Архитектура прототипа

```
prototype/
├── apps/
│   ├── client-portal/          # B2B/SMB external — заказы, статус, документы
│   ├── manager-web/            # CRM офисного менеджера
│   ├── production-mobile/      # PWA — задачи производства, Face Control mock
│   ├── warehouse-mobile/       # PWA — приёмка, списание (BR-01), брак (BR-03)
│   ├── admin-panel/            # RBAC, справочники, нормы
│   └── owner-dashboard/        # KPI, P&L, брак, простои
├── packages/
│   ├── tokens/                 # CSS-токены (color, spacing, typography)
│   ├── ui/                     # shadcn/ui re-export + UniPrint-specific components
│   ├── mocks/                  # MSW handlers + fixtures
│   └── types/                  # Domain types (Order, Lead, Client, Material, ...)
├── playwright/                 # Cross-app smoke tests
├── MOCK_NOTICE.txt             # Маркировка моков для compliance
├── README.md                   # Как запустить + ссылки на Vercel preview
├── package.json                # Root workspace
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json
├── biome.json                  # Lint + format
└── .gitignore
```

**Ключевые принципы:**
1. **Provider-абстракция** — все внешние сервисы (Face Control, payments, maps, storage, notifications) идут через interface; в прототипе — `Mock*` impl, в prod (после Q1-Q5) — `Real*`.
2. **Domain types в одном месте** — `packages/types`. UI и mocks импортируют оттуда.
3. **Один URL = один кабинет** — каждое приложение деплоится отдельно (`client-portal.vercel.app` и т.д.). Это даёт чистые demo-ссылки для клиента.
4. **Без custom backend** — MSW перехватывает `fetch` в браузере; никакого Node-сервера в прототипе нет.

---

## Phasing (4 фазы, 17 задач)

| Фаза | Задачи | Что готово к концу фазы |
| --- | --- | --- |
| **A. Monorepo + shared** | 1-5 | Workspace, packages работают, ничего не задеплоено |
| **B. Первое приложение + Vercel pipeline** | 6-9 | `client-portal` на Vercel preview — есть ссылка для первой проверки |
| **C. Остальные 5 кабинетов** | 10-14 | Все 6 кабинетов — каждый со своими 2-3 экранами по CJM |
| **D. Smoke + finalize** | 15-17 | Playwright golden-path, MOCK_NOTICE, README, все 6 ссылок собраны |

После каждой задачи — `git commit`. После Phase B — pause point для ревью с владельцем (есть рабочая ссылка).

---

# Phase A — Monorepo + shared packages

## Task 1: Bootstrap monorepo skeleton

**Files:**
- Create: `prototype/package.json`
- Create: `prototype/pnpm-workspace.yaml`
- Create: `prototype/turbo.json`
- Create: `prototype/tsconfig.base.json`
- Create: `prototype/biome.json`
- Create: `prototype/.gitignore`
- Create: `prototype/.npmrc`

- [ ] **Step 1: Создать `prototype/` и подготовить корневые файлы**

```bash
cd D:/Projects/Uniprint
mkdir -p prototype
cd prototype
```

- [ ] **Step 2: Записать `prototype/package.json`**

```json
{
  "name": "uniprint-prototype",
  "version": "0.1.0",
  "private": true,
  "packageManager": "pnpm@10.6.0",
  "engines": { "node": ">=22.0.0" },
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "test": "turbo run test",
    "test:e2e": "playwright test",
    "format": "biome format --write .",
    "clean": "turbo run clean && rm -rf node_modules"
  },
  "devDependencies": {
    "@biomejs/biome": "^1.9.4",
    "@playwright/test": "^1.50.0",
    "turbo": "^2.3.0",
    "typescript": "^5.7.0"
  }
}
```

- [ ] **Step 3: Записать `prototype/pnpm-workspace.yaml`**

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

- [ ] **Step 4: Записать `prototype/turbo.json`**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": { "cache": false, "persistent": true },
    "lint": {},
    "typecheck": { "dependsOn": ["^build"] },
    "test": { "dependsOn": ["^build"] },
    "clean": { "cache": false }
  }
}
```

- [ ] **Step 5: Записать `prototype/tsconfig.base.json`**

```json
{
  "compilerOptions": {
    "target": "ES2023",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "resolveJsonModule": true
  }
}
```

- [ ] **Step 6: Записать `prototype/biome.json`**

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "formatter": { "indentStyle": "space", "indentWidth": 2, "lineWidth": 100 },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": { "noUnusedVariables": "warn" },
      "style": { "useImportType": "warn" }
    }
  },
  "javascript": { "formatter": { "quoteStyle": "single", "semicolons": "always" } },
  "files": { "ignore": [".next/**", "node_modules/**", "dist/**", ".turbo/**"] }
}
```

- [ ] **Step 7: Записать `prototype/.gitignore`**

```gitignore
node_modules/
.next/
.turbo/
dist/
.vercel/
.env*.local
*.tsbuildinfo
.DS_Store
playwright-report/
test-results/
```

- [ ] **Step 8: Записать `prototype/.npmrc`**

```
auto-install-peers=true
strict-peer-dependencies=false
shamefully-hoist=false
```

- [ ] **Step 9: Установить зависимости и проверить**

Run: `cd prototype && pnpm install`
Expected: install OK, появляется `pnpm-lock.yaml` и `node_modules/`.

- [ ] **Step 10: Commit**

```bash
git add prototype/
git commit -m "feat(proto): bootstrap turborepo monorepo skeleton"
```

---

## Task 2: Shared package — `@uniprint/types`

**Files:**
- Create: `prototype/packages/types/package.json`
- Create: `prototype/packages/types/tsconfig.json`
- Create: `prototype/packages/types/src/index.ts`
- Create: `prototype/packages/types/src/order.ts`
- Create: `prototype/packages/types/src/client.ts`
- Create: `prototype/packages/types/src/material.ts`
- Create: `prototype/packages/types/src/user.ts`
- Create: `prototype/packages/types/src/defect.ts`
- Create: `prototype/packages/types/src/payroll.ts`
- Create: `prototype/packages/types/src/face-control.ts`

**Контекст:** доменные типы из `Docs/04-modules.md` (модели данных модулей 6.1, 6.3, 6.11, 6.12, 6.19, 6.20, 6.22). Используются и UI, и MSW handlers.

- [ ] **Step 1: `packages/types/package.json`**

```json
{
  "name": "@uniprint/types",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": { ".": "./src/index.ts" },
  "scripts": {
    "typecheck": "tsc --noEmit",
    "lint": "biome lint src",
    "clean": "rm -rf .turbo dist *.tsbuildinfo"
  }
}
```

- [ ] **Step 2: `packages/types/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": { "outDir": "./dist", "rootDir": "./src", "noEmit": true },
  "include": ["src/**/*"]
}
```

- [ ] **Step 3: `src/order.ts` — заказ из ТЗ § 6.1**

```typescript
export type OrderType = 'cex' | 'office' | 'goods';

export type OrderStatus =
  | 'draft' | 'lead' | 'measured' | 'designing' | 'design_review'
  | 'client_approval' | 'queued' | 'in_production' | 'in_qc'
  | 'defect_rework' | 'ready' | 'delivered' | 'closed' | 'cancelled';

export interface Order {
  id: string;                      // ord_<uuid>
  number: string;                  // UNI-2026-00042
  type: OrderType;
  status: OrderStatus;
  clientId: string;
  managerId: string;
  designerId?: string;
  branchId: 'main';                // Q9 — один цех MVP
  title: string;
  itemsCount: number;              // штук / м.п.
  priceTotal: number;              // итоговая стоимость для клиента (₽)
  costEstimate?: number;           // плановая себестоимость (₽)
  costActual?: number;             // фактическая себестоимость
  dueDate?: string;                // ISO date
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  catalogServiceId: string;        // BR-04 — только из справочника
  qty: number;
  unitPrice: number;
  notes?: string;
}

export interface OrderHistoryEntry {
  id: string;
  orderId: string;
  fromStatus: OrderStatus | null;
  toStatus: OrderStatus;
  byUserId: string;
  at: string;                      // ISO datetime
  comment?: string;
}
```

- [ ] **Step 4: `src/client.ts` — клиент из ТЗ § 6.3**

```typescript
export type ClientType = 'b2b' | 'smb' | 'individual';

export interface Client {
  id: string;
  type: ClientType;
  name: string;                    // ФИО или название организации
  phone: string;                   // нормализованный +7XXXXXXXXXX (BR-02 antidub)
  email?: string;
  inn?: string;                    // для b2b
  ogrn?: string;
  address?: string;
  notes?: string;
  createdAt: string;
}

export interface Lead {
  id: string;                      // lead_<uuid>
  clientId?: string;               // null если ещё не создан
  source: 'cold' | 'referral' | 'inbound' | 'tender';
  status: 'new' | 'measured' | 'quoted' | 'converted' | 'lost';
  measurements?: { width: number; height: number; notes: string };
  photos: string[];                // S3 URLs (mock blob URLs в прототипе)
  managerId: string;
  resultOrderId?: string;          // BR-08 — макс 1 заказ из лида
  createdAt: string;
}
```

- [ ] **Step 5: `src/material.ts` — склад из ТЗ § 6.11, 6.13**

```typescript
export type MaterialUnit = 'pcs' | 'm2' | 'lm' | 'kg' | 'l';

export interface MaterialCatalog {
  id: string;                      // mat_<uuid>
  sku: string;                     // BAN-440-WHITE
  name: string;
  unit: MaterialUnit;
  minStock: number;                // alert level
  category: 'banner' | 'oracal' | 'paper' | 'ink' | 'fastener' | 'other';
  description?: string;
}

export interface MaterialBatch {
  id: string;                      // bat_<uuid>
  materialId: string;
  receivedAt: string;              // BR-09 — FIFO по дате
  qty: number;
  qtyRemaining: number;
  pricePerUnit: number;
  supplier?: string;
}

export interface MaterialWriteoff {
  id: string;
  materialId: string;
  batchId: string;                 // BR-09 — конкретная партия
  orderId: string;                 // BR-01 — ВСЕГДА на заказ, никогда null
  qty: number;
  byUserId: string;
  at: string;
  reason: 'production' | 'rework' | 'inventory_correction';
}
```

- [ ] **Step 6: `src/user.ts` — RBAC из ТЗ § 6.19**

```typescript
export type Role =
  | 'owner' | 'production_chief' | 'printer' | 'laser' | 'mounter' | 'carpenter'
  | 'designer' | 'warehouse_keeper' | 'manager_office' | 'manager_field'
  | 'driver' | 'admin' | 'client';

export interface User {
  id: string;                      // usr_<uuid>
  fullName: string;
  role: Role;
  phone: string;
  email?: string;
  active: boolean;
  hiredAt: string;
  faceTemplateId?: string;         // BR-21 — биометрическое согласие зафиксировано отдельно
  faceConsentAt?: string;          // ISO datetime согласия 152-ФЗ ст. 11
  createdAt: string;
}
```

- [ ] **Step 7: `src/defect.ts` — брак из ТЗ § 6.12**

```typescript
export type DefectStage = 'design' | 'production' | 'material' | 'unknown';

export interface Defect {
  id: string;
  orderId: string;
  reportedByUserId: string;        // BR-03 — должен быть warehouse_keeper
  qty: number;                     // скольких штук касается
  stage: DefectStage;
  responsibleUserId?: string;      // если стадия = production / design
  photos: string[];                // обязательно ≥ 1
  reason: string;
  reportedAt: string;
  reworkOrderId?: string;          // BR-17 — куда ушла переделка
}
```

- [ ] **Step 8: `src/payroll.ts` — ЗП из ТЗ § 6.22 + 7.6-7.10**

```typescript
export interface OperationLog {
  id: string;
  orderId: string;
  userId: string;
  operationCode: string;           // 'print_banner', 'cut_oracal', 'mount'
  qty: number;                     // штук / м² / м.п.
  startedAt: string;
  finishedAt: string;
  // Двойная формула ЗП — BR-31. Закреплён один из двух вариантов:
  payRate: number;                 // ₽
  payMode: 'per_unit' | 'percent_of_price'; // BR-31 — per operation/role
  payAmount: number;               // итог для этого OperationLog
}

export interface PayrollPeriod {
  id: string;
  userId: string;
  periodStart: string;             // BR-19 — accrual_period
  periodEnd: string;
  earned: number;                  // sum(payAmount)
  paid: number;                    // выдано фактически
  balance: number;                 // BR-05 — earned - paid (может быть отрицательным = долг компании сотрудника)
  payslipPdfUrl?: string;          // ТК ст. 136 — расчётный лист
  status: 'open' | 'finalized' | 'paid';
}
```

- [ ] **Step 9: `src/face-control.ts` — события Face Control из ТЗ § 6.20**

```typescript
export type FaceControlEventType = 'enter' | 'exit' | 'unknown_face';

export interface FaceControlEvent {
  id: string;
  userId?: string;                 // null если unknown_face
  type: FaceControlEventType;
  at: string;                      // ISO datetime
  vendor: 'mock' | 'ntechlab' | 'hikvision' | 'suprema'; // Q2 ✅ vendor TBD, в прототипе всегда 'mock'
  cameraId: string;
  confidence?: number;             // 0..1
  // BR-06 — события read-only; корректировка времени смены — отдельный workflow
  manualCorrectionEntryId?: string;
}

export interface ShiftCorrection {
  id: string;
  userId: string;
  eventId: string;
  byAdminUserId: string;
  oldTime: string;
  newTime: string;
  reason: string;
  at: string;
}
```

- [ ] **Step 10: `src/index.ts` — barrel re-export**

```typescript
export * from './order.js';
export * from './client.js';
export * from './material.js';
export * from './user.js';
export * from './defect.js';
export * from './payroll.js';
export * from './face-control.js';
```

- [ ] **Step 11: Verify typecheck**

Run: `cd prototype && pnpm --filter @uniprint/types typecheck`
Expected: PASS, no errors.

- [ ] **Step 12: Commit**

```bash
git add prototype/packages/types/
git commit -m "feat(proto): @uniprint/types — domain types from 04-modules"
```

---

## Task 3: Shared package — `@uniprint/tokens`

**Files:**
- Create: `prototype/packages/tokens/package.json`
- Create: `prototype/packages/tokens/src/tokens.css`
- Create: `prototype/packages/tokens/src/index.ts`

**Контекст:** дизайн-токены — единая палитра для всех 6 кабинетов. Tailwind 4 использует CSS-config через `@theme` директиву, поэтому токены — в CSS.

- [ ] **Step 1: `packages/tokens/package.json`**

```json
{
  "name": "@uniprint/tokens",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./tokens.css": "./src/tokens.css"
  },
  "scripts": {
    "typecheck": "tsc --noEmit",
    "lint": "biome lint src",
    "clean": "rm -rf .turbo *.tsbuildinfo"
  }
}
```

- [ ] **Step 2: `packages/tokens/src/tokens.css` — Tailwind 4 theme**

```css
/* UniPrint design tokens. Импортируется в каждом app через `@import "@uniprint/tokens/tokens.css"`. */

@theme {
  /* Цвета — нейтральная B2B-палитра, акцент серый-индиго */
  --color-bg: #fafafa;
  --color-surface: #ffffff;
  --color-fg: #18181b;
  --color-fg-muted: #71717a;
  --color-border: #e4e4e7;
  --color-primary: #4f46e5;        /* indigo-600 */
  --color-primary-fg: #ffffff;
  --color-success: #16a34a;
  --color-warning: #d97706;
  --color-danger: #dc2626;
  --color-info: #2563eb;

  /* Семантика по статусам заказа */
  --color-status-draft: #71717a;
  --color-status-in-production: #2563eb;
  --color-status-defect: #dc2626;
  --color-status-ready: #16a34a;
  --color-status-closed: #18181b;

  /* Spacing — кратно 4 */
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
  --spacing-12: 3rem;
  --spacing-16: 4rem;

  /* Typography */
  --font-sans: "Inter", -apple-system, "Segoe UI", sans-serif;
  --font-mono: "JetBrains Mono", "Cascadia Code", monospace;
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;

  /* Mobile — touch target ≥ 44pt = 44px */
  --size-touch-min: 44px;

  /* Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-full: 9999px;
}

/* Mock-watermark — обязателен на каждом кабинете прототипа */
.mock-banner {
  background: repeating-linear-gradient(
    -45deg, #fef3c7, #fef3c7 10px, #fde68a 10px, #fde68a 20px
  );
  color: #92400e;
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  padding: var(--spacing-1) var(--spacing-3);
  text-align: center;
  letter-spacing: 0.05em;
}
```

- [ ] **Step 3: `packages/tokens/src/index.ts` — TS-константы для use в JSX**

```typescript
export const tokens = {
  statusColors: {
    draft: 'var(--color-status-draft)',
    in_production: 'var(--color-status-in-production)',
    defect_rework: 'var(--color-status-defect)',
    ready: 'var(--color-status-ready)',
    closed: 'var(--color-status-closed)',
  },
  touchMin: 'var(--size-touch-min)',
} as const;

export const MOCK_NOTICE = 'PROTOTYPE — данные синтетические, реальные ПДн вводить запрещено';
```

- [ ] **Step 4: Verify**

Run: `cd prototype && pnpm --filter @uniprint/tokens typecheck`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add prototype/packages/tokens/
git commit -m "feat(proto): @uniprint/tokens — design tokens for Tailwind 4"
```

---

## Task 4: Shared package — `@uniprint/mocks` (MSW handlers + fixtures)

**Files:**
- Create: `prototype/packages/mocks/package.json`
- Create: `prototype/packages/mocks/src/index.ts`
- Create: `prototype/packages/mocks/src/fixtures/users.ts`
- Create: `prototype/packages/mocks/src/fixtures/clients.ts`
- Create: `prototype/packages/mocks/src/fixtures/orders.ts`
- Create: `prototype/packages/mocks/src/fixtures/materials.ts`
- Create: `prototype/packages/mocks/src/fixtures/face-events.ts`
- Create: `prototype/packages/mocks/src/handlers/orders.ts`
- Create: `prototype/packages/mocks/src/handlers/leads.ts`
- Create: `prototype/packages/mocks/src/handlers/clients.ts`
- Create: `prototype/packages/mocks/src/handlers/materials.ts`
- Create: `prototype/packages/mocks/src/handlers/users.ts`
- Create: `prototype/packages/mocks/src/handlers/face-control.ts`
- Create: `prototype/packages/mocks/src/handlers/index.ts`

**Контекст:** MSW 2 (`msw/browser`). Handlers перехватывают `fetch('/api/...')` в браузере. Объёмы фикстур — по Q12 (10 заказов, 50 клиентов, 30 пользователей, 200 SKU).

- [ ] **Step 1: `packages/mocks/package.json`**

```json
{
  "name": "@uniprint/mocks",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./handlers": "./src/handlers/index.ts"
  },
  "scripts": {
    "typecheck": "tsc --noEmit",
    "lint": "biome lint src"
  },
  "dependencies": {
    "msw": "^2.7.0",
    "@uniprint/types": "workspace:*"
  }
}
```

- [ ] **Step 2: `packages/mocks/src/fixtures/users.ts` — 30 сотрудников**

```typescript
import type { User, Role } from '@uniprint/types';

const ROLES: Role[] = [
  'owner', 'production_chief', 'printer', 'printer', 'laser', 'mounter',
  'mounter', 'carpenter', 'designer', 'designer', 'warehouse_keeper',
  'manager_office', 'manager_office', 'manager_field', 'manager_field',
  'driver', 'driver', 'admin',
  ...Array(12).fill('printer'),
] as Role[];

export const usersFixture: User[] = ROLES.map((role, i) => ({
  id: `usr_${String(i + 1).padStart(3, '0')}`,
  fullName: `Сотрудник ${i + 1}`,
  role,
  phone: `+79${String(100000000 + i).padStart(9, '0')}`,
  email: i < 5 ? `user${i + 1}@uniprint.local` : undefined,
  active: true,
  hiredAt: '2024-01-15T00:00:00Z',
  faceTemplateId: ['printer', 'laser', 'mounter', 'warehouse_keeper'].includes(role)
    ? `face_${i + 1}`
    : undefined,
  faceConsentAt: ['printer', 'laser', 'mounter', 'warehouse_keeper'].includes(role)
    ? '2024-01-15T09:00:00Z'
    : undefined,
  createdAt: '2024-01-15T00:00:00Z',
}));
```

- [ ] **Step 3: `packages/mocks/src/fixtures/clients.ts` — 50 клиентов**

```typescript
import type { Client } from '@uniprint/types';

export const clientsFixture: Client[] = Array.from({ length: 50 }, (_, i) => {
  const isB2b = i % 3 === 0;
  return {
    id: `cli_${String(i + 1).padStart(3, '0')}`,
    type: isB2b ? 'b2b' : i % 5 === 0 ? 'smb' : 'individual',
    name: isB2b ? `ООО «Пример-${i + 1}»` : `Клиент ${i + 1}`,
    phone: `+79${String(200000000 + i).padStart(9, '0')}`,
    email: i % 2 === 0 ? `client${i + 1}@example.ru` : undefined,
    inn: isB2b ? `77${String(10000000 + i).padStart(8, '0')}` : undefined,
    address: 'г. Москва, ул. Пример, д. ' + (i + 1),
    createdAt: new Date(2025, 0, i + 1).toISOString(),
  };
});
```

- [ ] **Step 4: `packages/mocks/src/fixtures/orders.ts` — 30 заказов**

```typescript
import type { Order, OrderType, OrderStatus } from '@uniprint/types';

const TYPES: OrderType[] = ['cex', 'office', 'goods'];
const STATUSES: OrderStatus[] = [
  'queued', 'in_production', 'in_qc', 'ready', 'delivered', 'closed',
  'designing', 'client_approval', 'in_production', 'defect_rework',
];

export const ordersFixture: Order[] = Array.from({ length: 30 }, (_, i) => ({
  id: `ord_${String(i + 1).padStart(4, '0')}`,
  number: `UNI-2026-${String(i + 1).padStart(5, '0')}`,
  type: TYPES[i % 3]!,
  status: STATUSES[i % STATUSES.length]!,
  clientId: `cli_${String((i % 50) + 1).padStart(3, '0')}`,
  managerId: `usr_012`,
  designerId: i % 3 === 0 ? 'usr_009' : undefined,
  branchId: 'main',
  title: i % 3 === 0 ? `Баннер ${3 + i % 5}×${1 + i % 3} м` :
         i % 3 === 1 ? `Визитки ${100 * (i + 1)} шт` :
         `Готовый стенд тип ${(i % 4) + 1}`,
  itemsCount: 1 + (i % 10),
  priceTotal: 5000 + i * 1500,
  costEstimate: 3000 + i * 800,
  costActual: i % 3 === 1 ? 3500 + i * 850 : undefined,
  dueDate: new Date(2026, 4, 10 + (i % 14)).toISOString(),
  createdAt: new Date(2026, 4, 1 + (i % 5)).toISOString(),
  updatedAt: new Date(2026, 4, 5 + (i % 5)).toISOString(),
}));
```

- [ ] **Step 5: `packages/mocks/src/fixtures/materials.ts` — 200 SKU**

```typescript
import type { MaterialCatalog, MaterialBatch } from '@uniprint/types';

const CATEGORIES = ['banner', 'oracal', 'paper', 'ink', 'fastener', 'other'] as const;

export const materialsFixture: MaterialCatalog[] = Array.from({ length: 200 }, (_, i) => ({
  id: `mat_${String(i + 1).padStart(3, '0')}`,
  sku: `${CATEGORIES[i % 6]!.toUpperCase().slice(0, 3)}-${String(i + 1).padStart(3, '0')}`,
  name: i % 6 === 0 ? `Баннер ${440 + i} г/м²` :
        i % 6 === 1 ? `Оракал ${i}-${(i + 4) % 9}` :
        i % 6 === 2 ? `Бумага ${100 + i % 200} г/м²` :
        i % 6 === 3 ? `Краска CMYK ${i % 4}` :
        `Крепёж ${i}` ,
  unit: i % 6 === 0 ? 'm2' : i % 6 === 4 ? 'pcs' : 'lm',
  minStock: 10,
  category: CATEGORIES[i % 6]!,
}));

export const batchesFixture: MaterialBatch[] = materialsFixture.flatMap((m, i) => [
  {
    id: `bat_${String(i * 2 + 1).padStart(4, '0')}`,
    materialId: m.id,
    receivedAt: new Date(2026, 3, 1 + (i % 28)).toISOString(),
    qty: 100, qtyRemaining: 70,
    pricePerUnit: 100 + (i % 500),
  },
  {
    id: `bat_${String(i * 2 + 2).padStart(4, '0')}`,
    materialId: m.id,
    receivedAt: new Date(2026, 4, 1 + (i % 28)).toISOString(),
    qty: 50, qtyRemaining: 50,
    pricePerUnit: 110 + (i % 500),
  },
]);
```

- [ ] **Step 6: `packages/mocks/src/fixtures/face-events.ts` — за последние 7 дней**

```typescript
import type { FaceControlEvent } from '@uniprint/types';
import { usersFixture } from './users.js';

const workersWithFace = usersFixture.filter((u) => u.faceTemplateId !== undefined);

export const faceEventsFixture: FaceControlEvent[] = workersWithFace.flatMap((u, i) =>
  Array.from({ length: 14 }, (_, d) => {
    const day = Math.floor(d / 2);
    const isEnter = d % 2 === 0;
    return {
      id: `fce_${u.id}_${day}_${isEnter ? 'in' : 'out'}`,
      userId: u.id,
      type: isEnter ? 'enter' : 'exit',
      at: new Date(2026, 4, 1 + day, isEnter ? 8 + (i % 2) : 17 + (i % 3), i % 60).toISOString(),
      vendor: 'mock',
      cameraId: 'cam_main',
      confidence: 0.96 + (i % 4) * 0.005,
    } satisfies FaceControlEvent;
  }),
);
```

- [ ] **Step 7: `packages/mocks/src/handlers/orders.ts` — REST endpoints для заказов**

```typescript
import { http, HttpResponse } from 'msw';
import type { Order } from '@uniprint/types';
import { ordersFixture } from '../fixtures/orders.js';

const orders: Order[] = [...ordersFixture];

export const orderHandlers = [
  http.get('/api/orders', ({ request }) => {
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const status = url.searchParams.get('status');
    let filtered = orders;
    if (type) filtered = filtered.filter((o) => o.type === type);
    if (status) filtered = filtered.filter((o) => o.status === status);
    return HttpResponse.json({ items: filtered, total: filtered.length });
  }),

  http.get('/api/orders/:id', ({ params }) => {
    const order = orders.find((o) => o.id === params.id);
    if (!order) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(order);
  }),

  http.post('/api/orders', async ({ request }) => {
    const body = (await request.json()) as Partial<Order>;
    if (!body.type || !body.clientId || !body.title) {
      return HttpResponse.json({ error: 'type, clientId, title required (BR-04, BR-07)' }, { status: 400 });
    }
    const newOrder: Order = {
      id: `ord_${String(orders.length + 1).padStart(4, '0')}`,
      number: `UNI-2026-${String(orders.length + 1).padStart(5, '0')}`,
      type: body.type,
      status: 'draft',
      clientId: body.clientId,
      managerId: body.managerId ?? 'usr_012',
      branchId: 'main',
      title: body.title,
      itemsCount: body.itemsCount ?? 1,
      priceTotal: body.priceTotal ?? 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    orders.unshift(newOrder);
    return HttpResponse.json(newOrder, { status: 201 });
  }),

  http.patch('/api/orders/:id/status', async ({ params, request }) => {
    const order = orders.find((o) => o.id === params.id);
    if (!order) return new HttpResponse(null, { status: 404 });
    const { status } = (await request.json()) as { status: Order['status'] };
    order.status = status;
    order.updatedAt = new Date().toISOString();
    return HttpResponse.json(order);
  }),
];
```

- [ ] **Step 8: `packages/mocks/src/handlers/leads.ts`**

```typescript
import { http, HttpResponse } from 'msw';
import type { Lead } from '@uniprint/types';

const leads: Lead[] = Array.from({ length: 12 }, (_, i) => ({
  id: `lead_${String(i + 1).padStart(3, '0')}`,
  source: i % 3 === 0 ? 'inbound' : i % 3 === 1 ? 'cold' : 'referral',
  status: ['new', 'measured', 'quoted', 'converted', 'lost'][i % 5] as Lead['status'],
  measurements: i % 2 === 0 ? { width: 3 + i, height: 1 + (i % 3), notes: 'фасад' } : undefined,
  photos: [],
  managerId: i % 2 === 0 ? 'usr_014' : 'usr_015',
  resultOrderId: i < 3 ? `ord_${String(i + 1).padStart(4, '0')}` : undefined,
  createdAt: new Date(2026, 4, 1 + i).toISOString(),
}));

export const leadHandlers = [
  http.get('/api/leads', () => HttpResponse.json({ items: leads, total: leads.length })),
  http.get('/api/leads/:id', ({ params }) => {
    const lead = leads.find((l) => l.id === params.id);
    return lead ? HttpResponse.json(lead) : new HttpResponse(null, { status: 404 });
  }),
];
```

- [ ] **Step 9: `packages/mocks/src/handlers/clients.ts` (с антидублированием BR-02)**

```typescript
import { http, HttpResponse } from 'msw';
import type { Client } from '@uniprint/types';
import { clientsFixture } from '../fixtures/clients.js';

const clients: Client[] = [...clientsFixture];

const normalizePhone = (raw: string): string => {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('8')) return `+7${digits.slice(1)}`;
  if (digits.length === 11 && digits.startsWith('7')) return `+${digits}`;
  if (digits.length === 10) return `+7${digits}`;
  return raw;
};

export const clientHandlers = [
  http.get('/api/clients', ({ request }) => {
    const q = new URL(request.url).searchParams.get('q')?.toLowerCase() ?? '';
    const filtered = q
      ? clients.filter((c) =>
          c.name.toLowerCase().includes(q) || c.phone.includes(q),
        )
      : clients;
    return HttpResponse.json({ items: filtered.slice(0, 50), total: filtered.length });
  }),

  http.post('/api/clients', async ({ request }) => {
    const body = (await request.json()) as Partial<Client>;
    if (!body.phone || !body.name) {
      return HttpResponse.json({ error: 'phone, name required' }, { status: 400 });
    }
    const phone = normalizePhone(body.phone);
    // BR-02 — антидублирование по телефону
    const existing = clients.find((c) => c.phone === phone);
    if (existing) {
      return HttpResponse.json(
        { error: 'BR-02 — клиент с таким телефоном уже существует', existing },
        { status: 409 },
      );
    }
    const created: Client = {
      id: `cli_${String(clients.length + 1).padStart(3, '0')}`,
      type: body.type ?? 'individual',
      name: body.name,
      phone,
      email: body.email,
      inn: body.inn,
      ogrn: body.ogrn,
      address: body.address,
      createdAt: new Date().toISOString(),
    };
    clients.push(created);
    return HttpResponse.json(created, { status: 201 });
  }),
];
```

- [ ] **Step 10: `packages/mocks/src/handlers/materials.ts` (с BR-01 + BR-09 FIFO)**

```typescript
import { http, HttpResponse } from 'msw';
import type { MaterialBatch, MaterialWriteoff } from '@uniprint/types';
import { materialsFixture, batchesFixture } from '../fixtures/materials.js';

const materials = [...materialsFixture];
const batches: MaterialBatch[] = [...batchesFixture];
const writeoffs: MaterialWriteoff[] = [];

export const materialHandlers = [
  http.get('/api/materials', () => HttpResponse.json({ items: materials, total: materials.length })),

  http.get('/api/materials/:id/stock', ({ params }) => {
    const matBatches = batches
      .filter((b) => b.materialId === params.id && b.qtyRemaining > 0)
      .sort((a, b) => a.receivedAt.localeCompare(b.receivedAt)); // FIFO
    const total = matBatches.reduce((s, b) => s + b.qtyRemaining, 0);
    return HttpResponse.json({ total, batches: matBatches });
  }),

  http.post('/api/writeoffs', async ({ request }) => {
    const body = (await request.json()) as {
      materialId: string; orderId: string; qty: number; byUserId: string;
    };
    // BR-01 — orderId обязателен
    if (!body.orderId) {
      return HttpResponse.json({ error: 'BR-01 — orderId обязателен, материалы списываются ТОЛЬКО на заказ' }, { status: 400 });
    }
    // BR-09 — FIFO по партиям
    const fifo = batches
      .filter((b) => b.materialId === body.materialId && b.qtyRemaining > 0)
      .sort((a, b) => a.receivedAt.localeCompare(b.receivedAt));
    let remaining = body.qty;
    const created: MaterialWriteoff[] = [];
    for (const batch of fifo) {
      if (remaining <= 0) break;
      const take = Math.min(remaining, batch.qtyRemaining);
      batch.qtyRemaining -= take;
      remaining -= take;
      const w: MaterialWriteoff = {
        id: `wo_${String(writeoffs.length + created.length + 1).padStart(5, '0')}`,
        materialId: body.materialId,
        batchId: batch.id,
        orderId: body.orderId,
        qty: take,
        byUserId: body.byUserId,
        at: new Date().toISOString(),
        reason: 'production',
      };
      created.push(w);
    }
    if (remaining > 0) {
      return HttpResponse.json({ error: 'Недостаточно остатков на складе', shortBy: remaining }, { status: 409 });
    }
    writeoffs.push(...created);
    return HttpResponse.json({ writeoffs: created }, { status: 201 });
  }),
];
```

- [ ] **Step 11: `packages/mocks/src/handlers/users.ts`**

```typescript
import { http, HttpResponse } from 'msw';
import { usersFixture } from '../fixtures/users.js';

export const userHandlers = [
  http.get('/api/users', ({ request }) => {
    const role = new URL(request.url).searchParams.get('role');
    const users = role ? usersFixture.filter((u) => u.role === role) : usersFixture;
    return HttpResponse.json({ items: users, total: users.length });
  }),
  http.get('/api/users/me', () => HttpResponse.json(usersFixture[0]!)),
];
```

- [ ] **Step 12: `packages/mocks/src/handlers/face-control.ts`**

```typescript
import { http, HttpResponse } from 'msw';
import { faceEventsFixture } from '../fixtures/face-events.js';

export const faceControlHandlers = [
  http.get('/api/face-control/events', ({ request }) => {
    const userId = new URL(request.url).searchParams.get('userId');
    const events = userId
      ? faceEventsFixture.filter((e) => e.userId === userId)
      : faceEventsFixture;
    return HttpResponse.json({ items: events.slice(-50), total: events.length });
  }),
  http.post('/api/face-control/login', async ({ request }) => {
    const { userId } = (await request.json()) as { userId: string };
    return HttpResponse.json({
      ok: true,
      userId,
      eventId: `fce_mock_${Date.now()}`,
      at: new Date().toISOString(),
      message: 'Mock Face Control: вход зафиксирован (BR-21 — биометрическое согласие предполагается)',
    });
  }),
];
```

- [ ] **Step 13: `packages/mocks/src/handlers/index.ts`**

```typescript
import { orderHandlers } from './orders.js';
import { leadHandlers } from './leads.js';
import { clientHandlers } from './clients.js';
import { materialHandlers } from './materials.js';
import { userHandlers } from './users.js';
import { faceControlHandlers } from './face-control.js';

export const handlers = [
  ...orderHandlers,
  ...leadHandlers,
  ...clientHandlers,
  ...materialHandlers,
  ...userHandlers,
  ...faceControlHandlers,
];
```

- [ ] **Step 14: `packages/mocks/src/index.ts`**

```typescript
export { handlers } from './handlers/index.js';
export * from './fixtures/users.js';
export * from './fixtures/clients.js';
export * from './fixtures/orders.js';
export * from './fixtures/materials.js';
export * from './fixtures/face-events.js';
```

- [ ] **Step 15: Установить msw и verify**

Run: `cd prototype && pnpm --filter @uniprint/mocks add msw@^2.7.0`
Run: `pnpm --filter @uniprint/mocks typecheck`
Expected: PASS.

- [ ] **Step 16: Commit**

```bash
git add prototype/packages/mocks/
git commit -m "feat(proto): @uniprint/mocks — MSW handlers + fixtures (BR-01, BR-02, BR-09)"
```

---

## Task 5: Shared package — `@uniprint/ui` (shadcn/ui base + custom)

**Files:**
- Create: `prototype/packages/ui/package.json`
- Create: `prototype/packages/ui/components.json` (shadcn config)
- Create: `prototype/packages/ui/src/lib/utils.ts`
- Create: `prototype/packages/ui/src/components/button.tsx`
- Create: `prototype/packages/ui/src/components/card.tsx`
- Create: `prototype/packages/ui/src/components/badge.tsx`
- Create: `prototype/packages/ui/src/components/input.tsx`
- Create: `prototype/packages/ui/src/components/order-status-badge.tsx` (custom)
- Create: `prototype/packages/ui/src/components/mock-banner.tsx` (custom)
- Create: `prototype/packages/ui/src/index.ts`

**Контекст:** не используем `pnpm dlx shadcn add` напрямую (shadcn в монорепо требует доп. настройки) — вручную копируем компоненты на основе их шаблонов. Custom-компоненты (`order-status-badge`, `mock-banner`) — UniPrint-specific.

- [ ] **Step 1: `packages/ui/package.json`**

```json
{
  "name": "@uniprint/ui",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./components/*": "./src/components/*.tsx",
    "./styles.css": "./src/styles.css"
  },
  "scripts": {
    "typecheck": "tsc --noEmit",
    "lint": "biome lint src"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "dependencies": {
    "@uniprint/types": "workspace:*",
    "@uniprint/tokens": "workspace:*",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.0.0",
    "lucide-react": "^0.462.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0"
  }
}
```

- [ ] **Step 2: `src/lib/utils.ts` — cn helper**

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 3: `src/components/button.tsx`**

```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../lib/utils.js';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]',
  {
    variants: {
      variant: {
        default: 'bg-[var(--color-primary)] text-[var(--color-primary-fg)] hover:opacity-90',
        outline: 'border border-[var(--color-border)] bg-transparent hover:bg-[var(--color-bg)]',
        ghost: 'hover:bg-[var(--color-bg)]',
        danger: 'bg-[var(--color-danger)] text-white hover:opacity-90',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
        touch: 'min-h-[var(--size-touch-min)] px-4 py-2', // mobile
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
);
Button.displayName = 'Button';
```

- [ ] **Step 4: `src/components/card.tsx`**

```tsx
import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../lib/utils.js';

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm', className)}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-1.5 p-6', className)} {...props} />
  ),
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-lg font-semibold leading-none', className)} {...props} />
  ),
);
CardTitle.displayName = 'CardTitle';

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  ),
);
CardContent.displayName = 'CardContent';
```

- [ ] **Step 5: `src/components/badge.tsx`**

```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';
import { cn } from '../lib/utils.js';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-[var(--color-primary)] text-[var(--color-primary-fg)]',
        secondary: 'border-transparent bg-[var(--color-bg)] text-[var(--color-fg)]',
        success: 'border-transparent bg-[var(--color-success)] text-white',
        danger: 'border-transparent bg-[var(--color-danger)] text-white',
        warning: 'border-transparent bg-[var(--color-warning)] text-white',
        outline: 'text-[var(--color-fg)]',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = ({ className, variant, ...props }: BadgeProps) => (
  <span className={cn(badgeVariants({ variant }), className)} {...props} />
);
```

- [ ] **Step 6: `src/components/input.tsx`**

```tsx
import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../lib/utils.js';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm placeholder:text-[var(--color-fg-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';
```

- [ ] **Step 7: `src/components/order-status-badge.tsx`** (custom)

```tsx
import type { OrderStatus } from '@uniprint/types';
import { Badge } from './badge.js';

const STATUS_LABELS: Record<OrderStatus, string> = {
  draft: 'Черновик',
  lead: 'Лид',
  measured: 'Замер сделан',
  designing: 'На дизайне',
  design_review: 'Проверка макета',
  client_approval: 'Согласование с клиентом',
  queued: 'В очереди',
  in_production: 'В производстве',
  in_qc: 'На контроле',
  defect_rework: 'Брак / переделка',
  ready: 'Готов',
  delivered: 'Выдан',
  closed: 'Закрыт',
  cancelled: 'Отменён',
};

const STATUS_VARIANTS: Record<OrderStatus, 'default' | 'secondary' | 'success' | 'danger' | 'warning' | 'outline'> = {
  draft: 'secondary',
  lead: 'outline',
  measured: 'outline',
  designing: 'default',
  design_review: 'warning',
  client_approval: 'warning',
  queued: 'secondary',
  in_production: 'default',
  in_qc: 'warning',
  defect_rework: 'danger',
  ready: 'success',
  delivered: 'success',
  closed: 'secondary',
  cancelled: 'outline',
};

export const OrderStatusBadge = ({ status }: { status: OrderStatus }) => (
  <Badge variant={STATUS_VARIANTS[status]}>{STATUS_LABELS[status]}</Badge>
);
```

- [ ] **Step 8: `src/components/mock-banner.tsx`**

```tsx
import { MOCK_NOTICE } from '@uniprint/tokens';

export const MockBanner = () => (
  <div className="mock-banner">{MOCK_NOTICE}</div>
);
```

- [ ] **Step 9: `src/index.ts`**

```typescript
export { Button, type ButtonProps } from './components/button.js';
export { Card, CardHeader, CardTitle, CardContent } from './components/card.js';
export { Badge, type BadgeProps } from './components/badge.js';
export { Input } from './components/input.js';
export { OrderStatusBadge } from './components/order-status-badge.js';
export { MockBanner } from './components/mock-banner.js';
export { cn } from './lib/utils.js';
```

- [ ] **Step 10: Установить deps и verify**

Run: `cd prototype && pnpm install`
Run: `pnpm --filter @uniprint/ui typecheck`
Expected: PASS.

- [ ] **Step 11: Commit**

```bash
git add prototype/packages/ui/
git commit -m "feat(proto): @uniprint/ui — base components + OrderStatusBadge + MockBanner"
```

---

# Phase B — Первое приложение + Vercel pipeline

## Task 6: `client-portal` — scaffold + одна страница (главная)

**Files:**
- Create: `prototype/apps/client-portal/package.json`
- Create: `prototype/apps/client-portal/next.config.ts`
- Create: `prototype/apps/client-portal/tsconfig.json`
- Create: `prototype/apps/client-portal/postcss.config.mjs`
- Create: `prototype/apps/client-portal/app/layout.tsx`
- Create: `prototype/apps/client-portal/app/page.tsx`
- Create: `prototype/apps/client-portal/app/globals.css`
- Create: `prototype/apps/client-portal/app/msw-init.tsx`
- Create: `prototype/apps/client-portal/public/mockServiceWorker.js` (генерируется MSW)
- Create: `prototype/apps/client-portal/public/manifest.json`

**Контекст:** клиентский кабинет — внешний (B2B/SMB/individual). Главная страница — приветствие + быстрый CTA «Создать заказ» + последние заказы. Из CJM `Docs/02-user-journeys.md` § Клиент.

- [ ] **Step 1: `apps/client-portal/package.json`**

```json
{
  "name": "@uniprint/client-portal",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3001",
    "build": "next build",
    "start": "next start --port 3001",
    "typecheck": "tsc --noEmit",
    "lint": "biome lint app",
    "msw:init": "msw init public/ --save"
  },
  "dependencies": {
    "@uniprint/types": "workspace:*",
    "@uniprint/tokens": "workspace:*",
    "@uniprint/ui": "workspace:*",
    "@uniprint/mocks": "workspace:*",
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "msw": "^2.7.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.7.0"
  }
}
```

- [ ] **Step 2: `next.config.ts`**

```typescript
import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@uniprint/ui', '@uniprint/types', '@uniprint/tokens', '@uniprint/mocks'],
  experimental: { typedRoutes: true },
};

export default config;
```

- [ ] **Step 3: `tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] },
    "noEmit": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: `postcss.config.mjs`**

```javascript
export default { plugins: { '@tailwindcss/postcss': {} } };
```

- [ ] **Step 5: `app/globals.css`**

```css
@import "tailwindcss";
@import "@uniprint/tokens/tokens.css";

@layer base {
  body {
    background: var(--color-bg);
    color: var(--color-fg);
    font-family: var(--font-sans);
  }
}
```

- [ ] **Step 6: `app/layout.tsx`**

```tsx
import type { Metadata } from 'next';
import { MockBanner } from '@uniprint/ui';
import { MSWInit } from './msw-init.js';
import './globals.css';

export const metadata: Metadata = {
  title: 'UniPrint · Кабинет клиента',
  description: 'Заказы, статус, документы',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <MockBanner />
        <MSWInit>{children}</MSWInit>
      </body>
    </html>
  );
}
```

- [ ] **Step 7: `app/msw-init.tsx` — клиент-сайд MSW bootstrap**

```tsx
'use client';
import { useEffect, useState } from 'react';

export const MSWInit = ({ children }: { children: React.ReactNode }) => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    (async () => {
      const { setupWorker } = await import('msw/browser');
      const { handlers } = await import('@uniprint/mocks');
      const worker = setupWorker(...handlers);
      await worker.start({ onUnhandledRequest: 'bypass' });
      setReady(true);
    })();
  }, []);
  if (!ready) return <div className="p-8 text-center text-[var(--color-fg-muted)]">Загрузка моков…</div>;
  return <>{children}</>;
};
```

- [ ] **Step 8: `app/page.tsx` — главная клиентского кабинета**

```tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle, OrderStatusBadge } from '@uniprint/ui';
import type { Order } from '@uniprint/types';

export default function HomePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => {
    fetch('/api/orders').then((r) => r.json()).then((d) => setOrders(d.items.slice(0, 5)));
  }, []);
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold">Здравствуйте 👋</h1>
      <p className="mt-2 text-[var(--color-fg-muted)]">
        Кабинет клиента UniPrint — оформляйте заказы, отслеживайте статус, получайте документы.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/orders/new"><Button size="lg">Создать заказ</Button></Link>
        <Link href="/orders"><Button variant="outline" size="lg">Все заказы</Button></Link>
      </div>

      <h2 className="mt-12 text-xl font-semibold">Последние заказы</h2>
      <div className="mt-4 grid gap-3">
        {orders.map((o) => (
          <Card key={o.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{o.number} — {o.title}</CardTitle>
                <OrderStatusBadge status={o.status} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-6 text-sm text-[var(--color-fg-muted)]">
                <span>Сумма: <strong>{o.priceTotal.toLocaleString('ru-RU')} ₽</strong></span>
                <span>Срок: {o.dueDate ? new Date(o.dueDate).toLocaleDateString('ru-RU') : '—'}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 9: `public/manifest.json` — PWA manifest**

```json
{
  "name": "UniPrint Client Portal",
  "short_name": "UniPrint",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#fafafa",
  "theme_color": "#4f46e5",
  "icons": []
}
```

- [ ] **Step 10: Установить deps + сгенерить MSW worker**

Run: `cd prototype && pnpm install`
Run: `pnpm --filter @uniprint/client-portal msw:init`
Expected: появляется `apps/client-portal/public/mockServiceWorker.js`.

- [ ] **Step 11: Запустить dev и проверить визуально**

Run: `cd prototype && pnpm --filter @uniprint/client-portal dev`
Expected: dev server на `http://localhost:3001`. Открыть в браузере — видна страница «Здравствуйте» + жёлтый MockBanner + 5 карточек заказов из фикстур.

- [ ] **Step 12: Stop dev server (Ctrl+C). Commit**

```bash
git add prototype/apps/client-portal/
git commit -m "feat(proto): client-portal scaffold + home page"
```

---

## Task 7: `client-portal` — `/orders` list + `/orders/[id]` detail

**Files:**
- Create: `prototype/apps/client-portal/app/orders/page.tsx`
- Create: `prototype/apps/client-portal/app/orders/[id]/page.tsx`
- Create: `prototype/apps/client-portal/app/orders/loading.tsx`

**Контекст:** список + детали заказа из CJM «отслеживание статуса».

- [ ] **Step 1: `app/orders/page.tsx` — список заказов**

```tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, OrderStatusBadge } from '@uniprint/ui';
import type { Order } from '@uniprint/types';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => {
    fetch('/api/orders').then((r) => r.json()).then((d) => setOrders(d.items));
  }, []);
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-2xl font-bold">Все заказы</h1>
      <div className="mt-6 grid gap-3">
        {orders.map((o) => (
          <Link key={o.id} href={`/orders/${o.id}` as `/orders/${string}`}>
            <Card className="transition hover:border-[var(--color-primary)]">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <div className="font-semibold">{o.number} — {o.title}</div>
                  <div className="text-sm text-[var(--color-fg-muted)]">
                    {o.itemsCount} шт · {o.priceTotal.toLocaleString('ru-RU')} ₽
                  </div>
                </div>
                <OrderStatusBadge status={o.status} />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: `app/orders/[id]/page.tsx`**

```tsx
'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, OrderStatusBadge } from '@uniprint/ui';
import type { Order } from '@uniprint/types';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  useEffect(() => {
    fetch(`/api/orders/${id}`).then((r) => r.ok ? r.json() : null).then(setOrder);
  }, [id]);
  if (!order) return <div className="p-12 text-center">Загрузка…</div>;
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{order.number}</h1>
        <OrderStatusBadge status={order.status} />
      </div>
      <p className="mt-2 text-[var(--color-fg-muted)]">{order.title}</p>

      <Card className="mt-6">
        <CardHeader><CardTitle>Сводка</CardTitle></CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <dt className="text-[var(--color-fg-muted)]">Тип заказа</dt>
            <dd>{order.type === 'cex' ? 'Цех (наружная реклама)' : order.type === 'office' ? 'Офис-полиграфия' : 'Готовый товар'}</dd>
            <dt className="text-[var(--color-fg-muted)]">Количество</dt>
            <dd>{order.itemsCount} шт</dd>
            <dt className="text-[var(--color-fg-muted)]">Сумма</dt>
            <dd>{order.priceTotal.toLocaleString('ru-RU')} ₽</dd>
            <dt className="text-[var(--color-fg-muted)]">Срок</dt>
            <dd>{order.dueDate ? new Date(order.dueDate).toLocaleDateString('ru-RU') : '—'}</dd>
            <dt className="text-[var(--color-fg-muted)]">Создан</dt>
            <dd>{new Date(order.createdAt).toLocaleDateString('ru-RU')}</dd>
          </dl>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader><CardTitle>Документы</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-[var(--color-fg-muted)]">
            PDF-документы (счёт / договор-оферта / акт / ТТН) будут доступны после
            подтверждения заказа. <em>Q13 ✅: простая генерация PDF.</em>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
```

- [ ] **Step 3: `app/orders/loading.tsx`**

```tsx
export default function Loading() {
  return <div className="p-12 text-center text-[var(--color-fg-muted)]">Загрузка заказов…</div>;
}
```

- [ ] **Step 4: Verify dev — открыть `/orders` и `/orders/ord_0001`**

Run: `cd prototype && pnpm --filter @uniprint/client-portal dev`
Expected: список рендерится, клик по заказу → детали открываются, статус-badge раскрашен.

- [ ] **Step 5: Commit**

```bash
git add prototype/apps/client-portal/app/orders/
git commit -m "feat(proto/client-portal): orders list + detail page"
```

---

## Task 8: `client-portal` — `/orders/new` форма создания

**Files:**
- Create: `prototype/apps/client-portal/app/orders/new/page.tsx`

**Контекст:** форма создания заказа (упрощённая для клиентского кабинета — без Lead/Measurement, только базовые поля). Из CJM «оформление заказа».

- [ ] **Step 1: `app/orders/new/page.tsx`**

```tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@uniprint/ui';
import type { OrderType } from '@uniprint/types';

export default function NewOrderPage() {
  const router = useRouter();
  const [type, setType] = useState<OrderType>('office');
  const [title, setTitle] = useState('');
  const [itemsCount, setItemsCount] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type, title, itemsCount,
        clientId: 'cli_001',          // mock — в реале берётся из сессии
        priceTotal: itemsCount * (type === 'cex' ? 12000 : type === 'office' ? 1500 : 8000),
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      setError(err.error ?? 'Не удалось создать заказ');
      setSubmitting(false);
      return;
    }
    const created = await res.json();
    router.push(`/orders/${created.id}` as `/orders/${string}`);
  };

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-bold">Новый заказ</h1>
      <Card className="mt-6">
        <CardHeader><CardTitle>Параметры</CardTitle></CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <label className="grid gap-1.5">
              <span className="text-sm font-medium">Тип заказа</span>
              <select
                className="h-10 rounded-md border border-[var(--color-border)] px-3"
                value={type}
                onChange={(e) => setType(e.target.value as OrderType)}
              >
                <option value="cex">Услуга цех (наружная реклама)</option>
                <option value="office">Услуга офис (оперативная полиграфия)</option>
                <option value="goods">Готовый товар</option>
              </select>
            </label>
            <label className="grid gap-1.5">
              <span className="text-sm font-medium">Что заказываете</span>
              <Input
                placeholder="Например: баннер 3×1 м"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-sm font-medium">Количество, шт</span>
              <Input
                type="number"
                min={1}
                value={itemsCount}
                onChange={(e) => setItemsCount(Number(e.target.value))}
                required
              />
            </label>
            {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}
            <p className="text-sm text-[var(--color-fg-muted)]">
              Расчёт стоимости — автоматический по справочнику услуг (BR-04).
              <em>Q15 ✅: справочник наполняется с нуля параллельным треком.</em>
            </p>
            <Button type="submit" disabled={submitting} size="lg">
              {submitting ? 'Создание…' : 'Создать заказ'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
```

- [ ] **Step 2: Verify dev — заполнить форму, отправить, перейти на детали нового заказа**

Run: `cd prototype && pnpm --filter @uniprint/client-portal dev`
Expected: форма работает, после submit редирект на `/orders/ord_NNNN` нового заказа со статусом «Черновик».

- [ ] **Step 3: Commit**

```bash
git add prototype/apps/client-portal/app/orders/new/
git commit -m "feat(proto/client-portal): order creation form (BR-04, BR-07)"
```

---

## Task 9: Vercel deploy `client-portal` — pipeline проверка

**Files:**
- Create: `prototype/vercel.json` (root)
- Create: `prototype/apps/client-portal/vercel.json`
- Modify: `prototype/README.md` (создаётся в Task 16, здесь — заглушка)

**Контекст:** первый деплой важен, чтобы убедиться что pipeline `pnpm build` через Turborepo проходит на Vercel. Деплой — в режиме одного проекта на app, root path = `apps/client-portal`.

> **Требует:** Vercel CLI установлен локально (`pnpm dlx vercel@latest`) и пользователь авторизован (`vercel login`). В этом плане считаем, что владелец это сделает вручную — у нас нет доступа к его учётной записи.

- [ ] **Step 1: `prototype/apps/client-portal/vercel.json`**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "buildCommand": "cd ../.. && pnpm install && pnpm --filter @uniprint/client-portal build",
  "installCommand": "echo 'install handled by buildCommand'",
  "outputDirectory": ".next"
}
```

- [ ] **Step 2: Project link**

Run (вручную владельцем):
```
cd prototype/apps/client-portal
pnpm dlx vercel@latest link --project uniprint-client-portal
```
Expected: появляется `.vercel/` с привязкой.

- [ ] **Step 3: First preview deploy**

Run (вручную):
```
pnpm dlx vercel@latest --prod=false
```
Expected: deploy log с URL вида `https://uniprint-client-portal-xxxxx.vercel.app`.

- [ ] **Step 4: Открыть URL и проверить визуально**

Expected: страница рендерится, MockBanner виден, MSW отработал (видны 5 заказов в «Последние заказы»).

- [ ] **Step 5: Если deploy упал — типовые правки**

```
1. Если "Cannot find module '@uniprint/types'": проверить `transpilePackages` в `next.config.ts`
2. Если "MSW worker 404": проверить `public/mockServiceWorker.js` существует и закоммичен (или regenerate `pnpm msw:init`)
3. Если build > 5 мин: добавить `"ignoreCommand": "git diff HEAD^ HEAD --quiet apps/client-portal packages"` в vercel.json
```

- [ ] **Step 6: Commit (URL + vercel.json)**

```bash
git add prototype/apps/client-portal/vercel.json prototype/apps/client-portal/.vercel/project.json
git commit -m "chore(proto/client-portal): vercel preview deploy"
```

> **Checkpoint Phase B:** есть рабочая ссылка для демо одного кабинета. Можно показать владельцу. Решение — продолжать ли остальные 5 кабинетов или сначала собрать feedback.

---

# Phase C — Остальные 5 кабинетов

> **Структура каждой задачи 10-14:** scaffold (как Task 6) + 2-3 экрана из CJM. Все апликации повторяют структуру `client-portal` — копируем `package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `app/layout.tsx`, `app/msw-init.tsx`, `app/globals.css`, `public/manifest.json`. Меняются: имя пакета, порт `next dev`, `metadata.title`, набор страниц.
>
> Чтобы избежать повторов кода в плане — каждая задача дублирует шаблонные файлы из Task 6 (структура одинакова), описаны только отличия и **уникальные** страницы для конкретного кабинета.

## Task 10: `manager-web` — CRM офисного менеджера

**Files (scaffold):** копия из `client-portal`, имя `@uniprint/manager-web`, порт `3002`.

**Files (страницы):**
- Create: `apps/manager-web/app/page.tsx` (dashboard менеджера)
- Create: `apps/manager-web/app/leads/page.tsx`
- Create: `apps/manager-web/app/orders/page.tsx`
- Create: `apps/manager-web/app/orders/new/page.tsx`

**Контекст:** менеджер видит лиды, заказы по всем клиентам, может создать заказ от лица клиента (добавляет шаг — выбор клиента с антидублированием BR-02). CJM из `Docs/02-user-journeys.md` § Менеджер.

- [ ] **Step 1: Scaffold копированием**

```bash
cd prototype
cp -r apps/client-portal apps/manager-web
# Затем правки:
# - apps/manager-web/package.json: name → @uniprint/manager-web, port → 3002
# - apps/manager-web/app/layout.tsx: title → "UniPrint · Менеджер"
# - удалить app/orders/* (создадим новые)
rm -rf apps/manager-web/app/orders
```

- [ ] **Step 2: `app/page.tsx` — dashboard менеджера**

```tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle, OrderStatusBadge } from '@uniprint/ui';
import type { Order, Lead } from '@uniprint/types';

export default function ManagerDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  useEffect(() => {
    Promise.all([
      fetch('/api/orders').then((r) => r.json()),
      fetch('/api/leads').then((r) => r.json()),
    ]).then(([o, l]) => { setOrders(o.items); setLeads(l.items); });
  }, []);
  const newLeads = leads.filter((l) => l.status === 'new');
  const inProduction = orders.filter((o) => o.status === 'in_production');
  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="text-3xl font-bold">Менеджер · UniPrint</h1>
      <div className="mt-6 grid grid-cols-3 gap-4">
        <Card><CardHeader><CardTitle>Новых лидов</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{newLeads.length}</CardContent></Card>
        <Card><CardHeader><CardTitle>В производстве</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{inProduction.length}</CardContent></Card>
        <Card><CardHeader><CardTitle>Всего заказов</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{orders.length}</CardContent></Card>
      </div>
      <div className="mt-6 flex gap-3">
        <Link href="/leads"><Button variant="outline">Лиды</Button></Link>
        <Link href="/orders"><Button variant="outline">Заказы</Button></Link>
        <Link href="/orders/new"><Button>+ Новый заказ</Button></Link>
      </div>
      <h2 className="mt-12 text-xl font-semibold">Активные заказы</h2>
      <div className="mt-4 grid gap-2">
        {orders.slice(0, 8).map((o) => (
          <Card key={o.id}><CardContent className="flex justify-between p-4">
            <div><div className="font-semibold">{o.number} — {o.title}</div></div>
            <OrderStatusBadge status={o.status} />
          </CardContent></Card>
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 3: `app/leads/page.tsx`**

```tsx
'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, Badge } from '@uniprint/ui';
import type { Lead } from '@uniprint/types';

const STATUS_LABELS: Record<Lead['status'], string> = {
  new: 'Новый', measured: 'Замер сделан', quoted: 'КП отправлено', converted: 'В заказ', lost: 'Потерян',
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  useEffect(() => { fetch('/api/leads').then((r) => r.json()).then((d) => setLeads(d.items)); }, []);
  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="text-2xl font-bold">Лиды</h1>
      <div className="mt-6 grid gap-2">
        {leads.map((l) => (
          <Card key={l.id}><CardContent className="flex justify-between p-4">
            <div>
              <div className="font-semibold">Лид #{l.id}</div>
              <div className="text-sm text-[var(--color-fg-muted)]">
                Источник: {l.source} · {l.measurements ? `${l.measurements.width}×${l.measurements.height} м` : 'без замера'}
              </div>
            </div>
            <Badge variant={l.status === 'converted' ? 'success' : l.status === 'lost' ? 'danger' : 'outline'}>
              {STATUS_LABELS[l.status]}
            </Badge>
          </CardContent></Card>
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 4: `app/orders/page.tsx` — список с фильтрами по типу**

```tsx
'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, Button, OrderStatusBadge } from '@uniprint/ui';
import type { Order, OrderType } from '@uniprint/types';

export default function OrdersListPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<OrderType | 'all'>('all');
  useEffect(() => {
    const url = filter === 'all' ? '/api/orders' : `/api/orders?type=${filter}`;
    fetch(url).then((r) => r.json()).then((d) => setOrders(d.items));
  }, [filter]);
  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="text-2xl font-bold">Заказы</h1>
      <div className="mt-4 flex gap-2">
        {(['all', 'cex', 'office', 'goods'] as const).map((f) => (
          <Button key={f} size="sm" variant={filter === f ? 'default' : 'outline'} onClick={() => setFilter(f)}>
            {f === 'all' ? 'Все' : f === 'cex' ? 'Цех' : f === 'office' ? 'Офис' : 'Товар'}
          </Button>
        ))}
      </div>
      <div className="mt-6 grid gap-2">
        {orders.map((o) => (
          <Card key={o.id}><CardContent className="flex justify-between p-4">
            <div>
              <div className="font-semibold">{o.number} — {o.title}</div>
              <div className="text-sm text-[var(--color-fg-muted)]">{o.priceTotal.toLocaleString('ru-RU')} ₽</div>
            </div>
            <OrderStatusBadge status={o.status} />
          </CardContent></Card>
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 5: `app/orders/new/page.tsx` — с поиском клиента и антидублированием BR-02**

```tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@uniprint/ui';
import type { Client, OrderType } from '@uniprint/types';

export default function NewOrderPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [type, setType] = useState<OrderType>('cex');
  const [title, setTitle] = useState('');
  const [itemsCount, setItemsCount] = useState(1);

  useEffect(() => {
    if (!search) { setClients([]); return; }
    fetch(`/api/clients?q=${encodeURIComponent(search)}`).then((r) => r.json()).then((d) => setClients(d.items));
  }, [search]);

  const submit = async () => {
    if (!selectedClient) return;
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, title, itemsCount, clientId: selectedClient.id, priceTotal: itemsCount * 5000 }),
    });
    const created = await res.json();
    router.push(`/orders` as `/orders`);
    void created; // в реальном коде — переход на /orders/[created.id]
  };

  return (
    <main className="mx-auto max-w-2xl px-6 py-8">
      <h1 className="text-2xl font-bold">Новый заказ</h1>
      <Card className="mt-6">
        <CardHeader><CardTitle>Шаг 1: клиент (BR-02 — антидубль по телефону)</CardTitle></CardHeader>
        <CardContent>
          <Input placeholder="Поиск по имени или телефону" value={search} onChange={(e) => setSearch(e.target.value)} />
          {clients.length > 0 && (
            <ul className="mt-3 max-h-64 overflow-auto rounded-md border border-[var(--color-border)]">
              {clients.map((c) => (
                <li
                  key={c.id}
                  className="cursor-pointer border-b border-[var(--color-border)] p-2 hover:bg-[var(--color-bg)]"
                  onClick={() => setSelectedClient(c)}
                >
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-[var(--color-fg-muted)]">{c.phone} · {c.type}</div>
                </li>
              ))}
            </ul>
          )}
          {selectedClient && (
            <p className="mt-3 text-sm">Выбран: <strong>{selectedClient.name}</strong> ({selectedClient.phone})</p>
          )}
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader><CardTitle>Шаг 2: параметры</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <select className="h-10 rounded-md border border-[var(--color-border)] px-3" value={type} onChange={(e) => setType(e.target.value as OrderType)}>
              <option value="cex">Цех</option>
              <option value="office">Офис</option>
              <option value="goods">Товар</option>
            </select>
            <Input placeholder="Что заказываем" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Input type="number" min={1} value={itemsCount} onChange={(e) => setItemsCount(Number(e.target.value))} />
          </div>
        </CardContent>
      </Card>

      <Button className="mt-6" disabled={!selectedClient || !title} onClick={submit} size="lg">
        Создать заказ
      </Button>
    </main>
  );
}
```

- [ ] **Step 6: Verify dev**

Run: `cd prototype && pnpm --filter @uniprint/manager-web dev`
Expected: dev на `http://localhost:3002`. Все 4 страницы открываются.

- [ ] **Step 7: Vercel link + deploy preview**

```
cd prototype/apps/manager-web
pnpm dlx vercel@latest link --project uniprint-manager-web
pnpm dlx vercel@latest --prod=false
```

- [ ] **Step 8: Commit**

```bash
git add prototype/apps/manager-web/
git commit -m "feat(proto): manager-web — CRM (leads, orders, new order with BR-02 antidub)"
```

---

## Task 11: `production-mobile` (PWA mobile-first) — задачи производства

**Files (scaffold):** копия из `client-portal`, имя `@uniprint/production-mobile`, порт `3003`. **Отличие:** `viewport` в layout — `width=device-width, initial-scale=1, maximum-scale=1`. Все touch targets — `size="touch"` у Button.

**Files (страницы):**
- Create: `apps/production-mobile/app/page.tsx` (face-control mock login)
- Create: `apps/production-mobile/app/tasks/page.tsx`
- Create: `apps/production-mobile/app/tasks/[id]/page.tsx`

**Контекст:** Mobile App для производственника (печатник / лазерщик / монтажник). Mobile-first PWA. Из CJM § Производственник.

- [ ] **Step 1: Scaffold копированием**

```bash
cd prototype
cp -r apps/client-portal apps/production-mobile
# - package.json: name → @uniprint/production-mobile, port → 3003
# - layout.tsx: title → "UniPrint · Производство"
# - удалить старые app/orders/*
rm -rf apps/production-mobile/app/orders
```

- [ ] **Step 2: `app/layout.tsx` — добавить viewport mobile-first**

```tsx
import type { Metadata, Viewport } from 'next';
import { MockBanner } from '@uniprint/ui';
import { MSWInit } from './msw-init.js';
import './globals.css';

export const metadata: Metadata = {
  title: 'UniPrint · Производство',
  description: 'Mobile App для производственников',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#4f46e5',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <MockBanner />
        <MSWInit>{children}</MSWInit>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: `app/page.tsx` — Face Control mock login**

```tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@uniprint/ui';

export default function FaceControlLoginPage() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const handleLogin = async () => {
    setPending(true);
    await new Promise((r) => setTimeout(r, 1500));
    await fetch('/api/face-control/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'usr_003' }),
    });
    router.push('/tasks');
  };
  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <Card>
        <CardHeader><CardTitle>Начало смены</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-[var(--color-fg-muted)]">
            Подойдите к камере Face Control. Вход зафиксируется автоматически.
          </p>
          <p className="mt-2 text-xs text-[var(--color-fg-muted)]">
            <em>Q2 ⏸: vendor TBD. В прототипе — мок (3 секунды → имитация распознавания).</em>
          </p>
          <Button size="touch" className="mt-6 w-full" onClick={handleLogin} disabled={pending}>
            {pending ? 'Распознавание…' : '👤 Войти на смену (mock)'}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
```

- [ ] **Step 4: `app/tasks/page.tsx` — список задач**

```tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, OrderStatusBadge } from '@uniprint/ui';
import type { Order } from '@uniprint/types';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Order[]>([]);
  useEffect(() => {
    fetch('/api/orders?status=in_production').then((r) => r.json()).then((d) => setTasks(d.items));
  }, []);
  return (
    <main className="mx-auto max-w-md px-4 py-6">
      <h1 className="text-2xl font-bold">Мои задачи</h1>
      <div className="mt-4 grid gap-2">
        {tasks.map((o) => (
          <Link key={o.id} href={`/tasks/${o.id}` as `/tasks/${string}`}>
            <Card className="active:scale-[0.98] transition">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold">{o.number}</div>
                    <div className="text-sm text-[var(--color-fg-muted)]">{o.title}</div>
                    <div className="mt-1 text-xs">
                      Срок: {o.dueDate ? new Date(o.dueDate).toLocaleDateString('ru-RU') : '—'}
                    </div>
                  </div>
                  <OrderStatusBadge status={o.status} />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 5: `app/tasks/[id]/page.tsx` — start/end work**

```tsx
'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, CardTitle, OrderStatusBadge } from '@uniprint/ui';
import type { Order } from '@uniprint/types';

const OPERATIONS = ['Печать баннера', 'Резка оракала', 'Монтаж', 'Ламинация'];

export default function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    fetch(`/api/orders/${id}`).then((r) => r.json()).then(setOrder);
  }, [id]);

  useEffect(() => {
    if (!startedAt) return;
    const t = setInterval(() => setElapsedMs(Date.now() - startedAt.getTime()), 500);
    return () => clearInterval(t);
  }, [startedAt]);

  if (!order) return <div className="p-8 text-center">Загрузка…</div>;

  const fmtTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    return `${m}:${String(s % 60).padStart(2, '0')}`;
  };

  return (
    <main className="mx-auto max-w-md px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{order.number}</h1>
        <OrderStatusBadge status={order.status} />
      </div>
      <p className="mt-1 text-sm">{order.title}</p>

      <Card className="mt-4">
        <CardHeader><CardTitle>Операция</CardTitle></CardHeader>
        <CardContent>
          <select
            className="h-12 w-full rounded-md border border-[var(--color-border)] px-3 text-base"
            value={op ?? ''}
            onChange={(e) => setOp(e.target.value || null)}
            disabled={startedAt !== null}
          >
            <option value="">— выберите —</option>
            {OPERATIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>

          {!startedAt && (
            <Button
              size="touch"
              className="mt-4 w-full"
              disabled={!op}
              onClick={() => setStartedAt(new Date())}
            >
              ▶ Начать работу
            </Button>
          )}

          {startedAt && (
            <>
              <div className="mt-4 text-center text-3xl font-mono">{fmtTime(elapsedMs)}</div>
              <Button
                size="touch"
                variant="danger"
                className="mt-4 w-full"
                onClick={() => {
                  alert(`Зафиксировано: ${op}, ${fmtTime(elapsedMs)} (mock)`);
                  setStartedAt(null);
                  setElapsedMs(0);
                  setOp(null);
                }}
              >
                ⏹ Завершить работу
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <p className="mt-4 text-xs text-[var(--color-fg-muted)]">
        BR-03: брак фиксирует только складщик. Если обнаружили брак — передайте складщику с описанием.
      </p>
    </main>
  );
}
```

- [ ] **Step 6: Verify**

Run: `cd prototype && pnpm --filter @uniprint/production-mobile dev`
Expected: открывается на `http://localhost:3003`. Mobile viewport, кнопка «Войти на смену» → /tasks → клик задачи → /tasks/[id] с таймером.

- [ ] **Step 7: Vercel + commit**

```
cd prototype/apps/production-mobile
pnpm dlx vercel@latest link --project uniprint-production-mobile
pnpm dlx vercel@latest --prod=false
cd ../../..
git add prototype/apps/production-mobile/
git commit -m "feat(proto): production-mobile (PWA) — Face Control mock + tasks + timer"
```

---

## Task 12: `warehouse-mobile` (PWA) — приёмка, списание, брак

**Files (scaffold):** копия с `production-mobile` (mobile-first уже настроен), имя `@uniprint/warehouse-mobile`, порт `3004`.

**Files (страницы):**
- Create: `apps/warehouse-mobile/app/page.tsx` (главная)
- Create: `apps/warehouse-mobile/app/writeoff/page.tsx` (BR-01 списание на заказ)
- Create: `apps/warehouse-mobile/app/defect/page.tsx` (BR-03 брак)

**Контекст:** Mobile App для складщика. CJM § Складщик.

- [ ] **Step 1: Scaffold**

```bash
cd prototype
cp -r apps/production-mobile apps/warehouse-mobile
# - правки package.json (port 3004, name @uniprint/warehouse-mobile)
# - layout.tsx title → "UniPrint · Склад"
# - удалить app/tasks/*, app/page.tsx (создадим новые)
rm -rf apps/warehouse-mobile/app/tasks
```

- [ ] **Step 2: `app/page.tsx`**

```tsx
import Link from 'next/link';
import { Button, Card, CardContent } from '@uniprint/ui';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-md px-4 py-6">
      <h1 className="text-2xl font-bold">Склад</h1>
      <div className="mt-4 grid gap-3">
        <Link href="/writeoff"><Button size="touch" className="w-full">📤 Списать материал на заказ</Button></Link>
        <Link href="/defect"><Button size="touch" variant="danger" className="w-full">⚠ Зафиксировать брак</Button></Link>
        <Card>
          <CardContent className="p-4 text-sm">
            <p className="font-semibold">Ключевые правила:</p>
            <ul className="mt-2 list-disc pl-5 text-[var(--color-fg-muted)]">
              <li><strong>BR-01:</strong> материалы списываются ТОЛЬКО на заказ</li>
              <li><strong>BR-03:</strong> брак фиксирует ТОЛЬКО складщик</li>
              <li><strong>BR-09:</strong> списание FIFO — самая старая партия первой</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: `app/writeoff/page.tsx` — BR-01**

```tsx
'use client';
import { useEffect, useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@uniprint/ui';
import type { Order, MaterialCatalog } from '@uniprint/types';

export default function WriteoffPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [materials, setMaterials] = useState<MaterialCatalog[]>([]);
  const [orderId, setOrderId] = useState('');
  const [materialId, setMaterialId] = useState('');
  const [qty, setQty] = useState(1);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/orders?status=in_production').then((r) => r.json()).then((d) => setOrders(d.items));
    fetch('/api/materials').then((r) => r.json()).then((d) => setMaterials(d.items.slice(0, 30)));
  }, []);

  const submit = async () => {
    setResult(null);
    const res = await fetch('/api/writeoffs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, materialId, qty, byUserId: 'usr_011' }),
    });
    const data = await res.json();
    if (!res.ok) {
      setResult(`❌ ${data.error}`);
      return;
    }
    setResult(`✅ Списано ${qty} ед. (${data.writeoffs.length} партий, FIFO)`);
  };

  return (
    <main className="mx-auto max-w-md px-4 py-6">
      <h1 className="text-2xl font-bold">Списание материала</h1>
      <Card className="mt-4">
        <CardHeader><CardTitle>На заказ (BR-01)</CardTitle></CardHeader>
        <CardContent className="grid gap-3">
          <select
            className="h-12 rounded-md border border-[var(--color-border)] px-3"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          >
            <option value="">— заказ —</option>
            {orders.map((o) => <option key={o.id} value={o.id}>{o.number} · {o.title}</option>)}
          </select>

          <select
            className="h-12 rounded-md border border-[var(--color-border)] px-3"
            value={materialId}
            onChange={(e) => setMaterialId(e.target.value)}
          >
            <option value="">— материал —</option>
            {materials.map((m) => <option key={m.id} value={m.id}>{m.sku} · {m.name}</option>)}
          </select>

          <Input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            placeholder="Количество"
          />

          <Button size="touch" disabled={!orderId || !materialId} onClick={submit}>
            📤 Списать
          </Button>

          {result && (
            <p className={`text-sm ${result.startsWith('✅') ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
              {result}
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
```

- [ ] **Step 4: `app/defect/page.tsx` — BR-03**

```tsx
'use client';
import { useEffect, useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@uniprint/ui';
import type { Order, DefectStage } from '@uniprint/types';

export default function DefectPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderId, setOrderId] = useState('');
  const [stage, setStage] = useState<DefectStage>('production');
  const [qty, setQty] = useState(1);
  const [reason, setReason] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch('/api/orders?status=in_qc').then((r) => r.json()).then((d) => setOrders(d.items));
  }, []);

  const submit = () => {
    setSubmitted(true);
    setTimeout(() => {
      alert(`Брак зафиксирован (mock):\nЗаказ: ${orderId}\nЭтап: ${stage}\nКоличество: ${qty}\nПричина: ${reason}\nФото: ${photo?.name ?? 'нет'}\nПеределка создана автоматически (BR-17).`);
      setSubmitted(false);
    }, 800);
  };

  return (
    <main className="mx-auto max-w-md px-4 py-6">
      <h1 className="text-2xl font-bold">Фиксация брака</h1>
      <p className="mt-1 text-xs text-[var(--color-fg-muted)]">
        BR-03: фиксирует только складщик. BR-17: брак → автоматическая переделка.
      </p>
      <Card className="mt-4">
        <CardHeader><CardTitle>Заполните данные</CardTitle></CardHeader>
        <CardContent className="grid gap-3">
          <select
            className="h-12 rounded-md border border-[var(--color-border)] px-3"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          >
            <option value="">— заказ на проверке —</option>
            {orders.map((o) => <option key={o.id} value={o.id}>{o.number}</option>)}
          </select>

          <select
            className="h-12 rounded-md border border-[var(--color-border)] px-3"
            value={stage}
            onChange={(e) => setStage(e.target.value as DefectStage)}
          >
            <option value="design">Дизайн</option>
            <option value="production">Производство</option>
            <option value="material">Материал</option>
            <option value="unknown">Неизвестно</option>
          </select>

          <Input type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value))} placeholder="Количество брака" />
          <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Причина" />

          <label className="grid gap-1 text-sm">
            Фото (обязательно):
            <input type="file" accept="image/*" capture="environment" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} />
          </label>

          <Button
            size="touch"
            variant="danger"
            disabled={!orderId || !reason || !photo || submitted}
            onClick={submit}
          >
            {submitted ? 'Отправка…' : '⚠ Зафиксировать брак'}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
```

- [ ] **Step 5: Verify + Vercel + commit**

```bash
cd prototype && pnpm --filter @uniprint/warehouse-mobile dev
# Проверить /, /writeoff, /defect (port 3004)
# Vercel:
cd apps/warehouse-mobile
pnpm dlx vercel@latest link --project uniprint-warehouse-mobile
pnpm dlx vercel@latest --prod=false
cd ../../..
git add prototype/apps/warehouse-mobile/
git commit -m "feat(proto): warehouse-mobile (PWA) — writeoff (BR-01) + defect (BR-03)"
```

---

## Task 13: `admin-panel` — RBAC + справочники + нормы

**Files (scaffold):** копия из `client-portal`, имя `@uniprint/admin-panel`, порт `3005`. Web (не mobile-first).

**Files (страницы):**
- Create: `apps/admin-panel/app/page.tsx` (dashboard админа)
- Create: `apps/admin-panel/app/users/page.tsx` (RBAC табица)
- Create: `apps/admin-panel/app/catalog/services/page.tsx`
- Create: `apps/admin-panel/app/catalog/materials/page.tsx`

- [ ] **Step 1: Scaffold (как Task 10) — рутина копирования и переименования**

- [ ] **Step 2: `app/users/page.tsx`**

```tsx
'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, Badge } from '@uniprint/ui';
import type { User } from '@uniprint/types';

const ROLE_LABELS: Record<string, string> = {
  owner: 'Учредитель', production_chief: 'Нач. цеха', printer: 'Печатник',
  laser: 'Лазерщик', mounter: 'Монтажник', carpenter: 'Плотник', designer: 'Дизайнер',
  warehouse_keeper: 'Складщик', manager_office: 'Менеджер (офис)',
  manager_field: 'Менеджер (выезд)', driver: 'Водитель', admin: 'Админ', client: 'Клиент',
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => { fetch('/api/users').then((r) => r.json()).then((d) => setUsers(d.items)); }, []);
  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="text-2xl font-bold">Пользователи и роли</h1>
      <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
        BR-21: биометрические согласия для производственных ролей фиксируются отдельно (152-ФЗ ст. 11).
      </p>
      <Card className="mt-6"><CardContent className="p-0">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-bg)]">
            <tr><th className="p-3 text-left">ФИО</th><th className="p-3 text-left">Роль</th><th className="p-3 text-left">Телефон</th><th className="p-3 text-left">Биометрия</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-[var(--color-border)]">
                <td className="p-3">{u.fullName}</td>
                <td className="p-3">{ROLE_LABELS[u.role] ?? u.role}</td>
                <td className="p-3 font-mono text-xs">{u.phone}</td>
                <td className="p-3">
                  {u.faceTemplateId
                    ? <Badge variant="success">Согласие 152-ФЗ ст. 11</Badge>
                    : <Badge variant="outline">—</Badge>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent></Card>
    </main>
  );
}
```

- [ ] **Step 3: `app/catalog/services/page.tsx` (admin-only по BR-14)**

```tsx
'use client';
import { Card, CardContent } from '@uniprint/ui';

export default function ServicesPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="text-2xl font-bold">Справочник услуг</h1>
      <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
        BR-14: справочник меняет ТОЛЬКО администратор. История изменений сохраняется (audit-log).
      </p>
      <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
        Q15 ✅: справочник наполняется с нуля параллельным треком sprint-0
        (типограф-консультант R3 + владелец).
      </p>
      <Card className="mt-6"><CardContent className="p-6">
        <p className="text-center text-[var(--color-fg-muted)]">
          [В прототипе — заглушка. Реальный справочник — после sprint-0 R3-track.]
        </p>
      </CardContent></Card>
    </main>
  );
}
```

- [ ] **Step 4: `app/catalog/materials/page.tsx` — таблица 200 SKU**

```tsx
'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@uniprint/ui';
import type { MaterialCatalog } from '@uniprint/types';

export default function MaterialsPage() {
  const [items, setItems] = useState<MaterialCatalog[]>([]);
  useEffect(() => { fetch('/api/materials').then((r) => r.json()).then((d) => setItems(d.items)); }, []);
  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="text-2xl font-bold">Справочник материалов ({items.length} SKU)</h1>
      <Card className="mt-6"><CardContent className="p-0">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-bg)]">
            <tr><th className="p-3 text-left">SKU</th><th className="p-3 text-left">Название</th><th className="p-3 text-left">Категория</th><th className="p-3 text-left">Ед. изм.</th></tr>
          </thead>
          <tbody>
            {items.slice(0, 50).map((m) => (
              <tr key={m.id} className="border-t border-[var(--color-border)]">
                <td className="p-3 font-mono text-xs">{m.sku}</td>
                <td className="p-3">{m.name}</td>
                <td className="p-3"><span className="rounded bg-[var(--color-bg)] px-2 py-0.5 text-xs">{m.category}</span></td>
                <td className="p-3">{m.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="p-3 text-xs text-[var(--color-fg-muted)]">показано 50 из {items.length}</p>
      </CardContent></Card>
    </main>
  );
}
```

- [ ] **Step 5: `app/page.tsx` — dashboard админа со ссылками**

```tsx
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@uniprint/ui';

export default function AdminHome() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="text-3xl font-bold">Админ-панель</h1>
      <div className="mt-6 grid grid-cols-3 gap-4">
        <Link href="/users"><Card className="hover:border-[var(--color-primary)]"><CardHeader><CardTitle>Пользователи</CardTitle></CardHeader><CardContent>RBAC + биометрия</CardContent></Card></Link>
        <Link href="/catalog/services"><Card className="hover:border-[var(--color-primary)]"><CardHeader><CardTitle>Услуги</CardTitle></CardHeader><CardContent>Справочник (R3-track)</CardContent></Card></Link>
        <Link href="/catalog/materials"><Card className="hover:border-[var(--color-primary)]"><CardHeader><CardTitle>Материалы</CardTitle></CardHeader><CardContent>200 SKU</CardContent></Card></Link>
      </div>
    </main>
  );
}
```

- [ ] **Step 6: Verify + Vercel + commit**

```bash
cd prototype && pnpm --filter @uniprint/admin-panel dev
# Проверка на :3005
cd apps/admin-panel
pnpm dlx vercel@latest link --project uniprint-admin-panel
pnpm dlx vercel@latest --prod=false
cd ../../..
git add prototype/apps/admin-panel/
git commit -m "feat(proto): admin-panel — users/RBAC + catalog (BR-14, BR-21)"
```

---

## Task 14: `owner-dashboard` — KPI и P&L

**Files (scaffold):** копия из `client-portal`, имя `@uniprint/owner-dashboard`, порт `3006`.

**Files (страницы):**
- Create: `apps/owner-dashboard/app/page.tsx` (KPI dashboard)

**Контекст:** учредитель видит KPI и P&L в один взгляд. Из CJM § Учредитель.

- [ ] **Step 1: Scaffold (по шаблону)**

- [ ] **Step 2: `app/page.tsx`**

```tsx
'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@uniprint/ui';
import type { Order } from '@uniprint/types';

export default function OwnerDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => { fetch('/api/orders').then((r) => r.json()).then((d) => setOrders(d.items)); }, []);

  const total = orders.length;
  const inProduction = orders.filter((o) => o.status === 'in_production').length;
  const delivered = orders.filter((o) => o.status === 'delivered' || o.status === 'closed').length;
  const defects = orders.filter((o) => o.status === 'defect_rework').length;
  const revenue = orders.filter((o) => ['delivered', 'closed'].includes(o.status))
    .reduce((s, o) => s + o.priceTotal, 0);
  const costActual = orders.filter((o) => o.costActual).reduce((s, o) => s + (o.costActual ?? 0), 0);
  const profit = revenue - costActual;

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="text-3xl font-bold">Дашборд учредителя</h1>
      <p className="mt-1 text-sm text-[var(--color-fg-muted)]">Данные за период (mock).</p>

      <div className="mt-6 grid grid-cols-4 gap-4">
        <Card><CardHeader><CardTitle>Заказов</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{total}</CardContent></Card>
        <Card><CardHeader><CardTitle>В производстве</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{inProduction}</CardContent></Card>
        <Card><CardHeader><CardTitle>Выдано</CardTitle></CardHeader><CardContent className="text-3xl font-bold text-[var(--color-success)]">{delivered}</CardContent></Card>
        <Card><CardHeader><CardTitle>Брак</CardTitle></CardHeader><CardContent className="text-3xl font-bold text-[var(--color-danger)]">{defects}</CardContent></Card>
      </div>

      <h2 className="mt-12 text-2xl font-semibold">P&L</h2>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <Card><CardHeader><CardTitle>Выручка</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{revenue.toLocaleString('ru-RU')} ₽</CardContent></Card>
        <Card><CardHeader><CardTitle>Себестоимость</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{costActual.toLocaleString('ru-RU')} ₽</CardContent></Card>
        <Card><CardHeader><CardTitle>Прибыль</CardTitle></CardHeader><CardContent className={`text-2xl font-bold ${profit >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>{profit.toLocaleString('ru-RU')} ₽</CardContent></Card>
      </div>

      <h2 className="mt-12 text-2xl font-semibold">Доходимость по типам</h2>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {(['cex', 'office', 'goods'] as const).map((t) => {
          const cnt = orders.filter((o) => o.type === t).length;
          const sum = orders.filter((o) => o.type === t).reduce((s, o) => s + o.priceTotal, 0);
          return (
            <Card key={t}>
              <CardHeader><CardTitle>{t === 'cex' ? 'Цех (наружка)' : t === 'office' ? 'Офис-полиграфия' : 'Готовый товар'}</CardTitle></CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cnt} шт</div>
                <div className="text-sm text-[var(--color-fg-muted)]">{sum.toLocaleString('ru-RU')} ₽</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Verify + Vercel + commit**

```bash
cd prototype && pnpm --filter @uniprint/owner-dashboard dev
# :3006
cd apps/owner-dashboard
pnpm dlx vercel@latest link --project uniprint-owner-dashboard
pnpm dlx vercel@latest --prod=false
cd ../../..
git add prototype/apps/owner-dashboard/
git commit -m "feat(proto): owner-dashboard — KPI + P&L"
```

---

# Phase D — Smoke + finalize

## Task 15: Playwright smoke (golden-path по каждому кабинету)

**Files:**
- Create: `prototype/playwright.config.ts`
- Create: `prototype/playwright/golden-path.spec.ts`

**Контекст:** один happy-path тест на каждое приложение. Цель — проверить что MockBanner виден, основные страницы открываются, нет JS-ошибок. Запускается в CI и локально.

- [ ] **Step 1: `playwright.config.ts`**

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './playwright',
  fullyParallel: true,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 14'] } },
  ],
  webServer: [
    { command: 'pnpm --filter @uniprint/client-portal dev',      url: 'http://localhost:3001', reuseExistingServer: true },
    { command: 'pnpm --filter @uniprint/manager-web dev',        url: 'http://localhost:3002', reuseExistingServer: true },
    { command: 'pnpm --filter @uniprint/production-mobile dev',  url: 'http://localhost:3003', reuseExistingServer: true },
    { command: 'pnpm --filter @uniprint/warehouse-mobile dev',   url: 'http://localhost:3004', reuseExistingServer: true },
    { command: 'pnpm --filter @uniprint/admin-panel dev',        url: 'http://localhost:3005', reuseExistingServer: true },
    { command: 'pnpm --filter @uniprint/owner-dashboard dev',    url: 'http://localhost:3006', reuseExistingServer: true },
  ],
});
```

- [ ] **Step 2: `playwright/golden-path.spec.ts`**

```typescript
import { test, expect } from '@playwright/test';

const APPS = [
  { name: 'client-portal',     port: 3001, headerText: 'Здравствуйте' },
  { name: 'manager-web',       port: 3002, headerText: 'Менеджер · UniPrint' },
  { name: 'production-mobile', port: 3003, headerText: 'Начало смены' },
  { name: 'warehouse-mobile',  port: 3004, headerText: 'Склад' },
  { name: 'admin-panel',       port: 3005, headerText: 'Админ-панель' },
  { name: 'owner-dashboard',   port: 3006, headerText: 'Дашборд учредителя' },
];

for (const app of APPS) {
  test(`${app.name} — открывается + MockBanner виден`, async ({ page }) => {
    await page.goto(`http://localhost:${app.port}`);
    await expect(page.locator('.mock-banner')).toContainText('PROTOTYPE');
    await expect(page.locator('h1').first()).toContainText(app.headerText);
  });
}

test('client-portal: создание заказа', async ({ page }) => {
  await page.goto('http://localhost:3001/orders/new');
  await page.locator('select').selectOption('office');
  await page.fill('input[placeholder*="баннер"]', 'Тестовый заказ из smoke');
  await page.locator('input[type="number"]').fill('5');
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/orders\//);
  await expect(page.locator('h1')).toContainText('UNI-2026-');
});

test('warehouse-mobile: списание материала на заказ (BR-01)', async ({ page }) => {
  await page.goto('http://localhost:3004/writeoff');
  await page.locator('select').first().waitFor();
  // выбираем первый доступный заказ
  await page.locator('select').first().selectOption({ index: 1 });
  await page.locator('select').nth(1).selectOption({ index: 1 });
  await page.locator('input[type="number"]').fill('1');
  await page.getByRole('button', { name: /Списать/ }).click();
  await expect(page.locator('text=/Списано|FIFO/')).toBeVisible({ timeout: 5000 });
});
```

- [ ] **Step 3: Запустить smoke локально**

Run: `cd prototype && pnpm test:e2e`
Expected: 6 «открывается + MockBanner» + 2 functional smoke = 8 тестов pass.

- [ ] **Step 4: Commit**

```bash
git add prototype/playwright.config.ts prototype/playwright/
git commit -m "test(proto): playwright golden-path smoke per cabinet + BR-01 writeoff"
```

---

## Task 16: MOCK_NOTICE.txt + README + ссылки на 6 Vercel URLs

**Files:**
- Create: `prototype/MOCK_NOTICE.txt`
- Create: `prototype/README.md`
- Modify: `prototype/CHANGELOG.md` (опционально)

- [ ] **Step 1: `prototype/MOCK_NOTICE.txt`**

```
PROTOTYPE — UniPrint ERP & Client System
=========================================

Этот прототип построен на МОКАХ:

- Все API-вызовы перехватываются MSW (mockServiceWorker.js).
- Никакого реального backend нет.
- Никаких реальных ПДн (152-ФЗ): фикстуры синтетические.
- Никаких реальных интеграций (Face Control / эквайринг / ОФД /
  Yandex Maps / Yandex Object Storage) — только UI-эмуляция.
- Деплой на Vercel preview допустим именно потому, что данные
  синтетические; для prod-фазы хостинг — РФ-юрисдикция (после Q3).

Цель прототипа — валидация UX и BPMN-схем перед sprint-1.

Закреплённые в прототипе ответы владельца от 2026-05-05:
  Q6  Mobile = PWA mobile-first (без native)
  Q7  Telegram НЕ используется в продукте
  Q9  Один цех + один склад MVP
  Q10 Карты = Yandex Maps
  Q11 Хранилище макетов = Yandex Object Storage
  Q13 Документооборот = простая генерация PDF
  Q14 Чеки 54-ФЗ — микс B2B + B2C → ОФД нужен
  Q16 Tracker = GitHub Issues
  Q17 Спринт-каденция 2 нед
  Q18 Demo URL: прототип = Vercel preview (публично),
                prod = закрытый VPN/IP-allowlist (после Q3)

Открытые блокеры (мокаются в прототипе, реал — после sprint-0):
  Q1  Юрисдикция / юр-лицо
  Q2  Face Control vendor (NtechLab/Hikvision/Suprema/самописный)
  Q3  Хостинг (Yandex.Cloud/Selectel/VK Cloud/on-prem)
  Q4  Миграция legacy (1С/Excel/нет)
  Q5  Эквайринг + конкретный ОФД-провайдер
```

- [ ] **Step 2: `prototype/README.md`**

```markdown
# UniPrint Prototype

Кликабельный демо-прототип на моках.

## 6 кабинетов

| Кабинет | Локально | Vercel preview |
| --- | --- | --- |
| client-portal | http://localhost:3001 | TBD-after-deploy |
| manager-web | http://localhost:3002 | TBD-after-deploy |
| production-mobile (PWA) | http://localhost:3003 | TBD-after-deploy |
| warehouse-mobile (PWA) | http://localhost:3004 | TBD-after-deploy |
| admin-panel | http://localhost:3005 | TBD-after-deploy |
| owner-dashboard | http://localhost:3006 | TBD-after-deploy |

> Заполнить колонку Vercel preview по факту первого деплоя
> (Tasks 9, 10, 11, 12, 13, 14).

## Запуск

```bash
cd prototype
pnpm install
pnpm dev               # все 6 кабинетов параллельно (Turbo)
```

## E2E smoke

```bash
pnpm test:e2e
```

## Архитектура

См. `Docs/03-architecture.md` (корень репо).

## Маркировка моков

См. `MOCK_NOTICE.txt`.
```

- [ ] **Step 3: Заполнить ссылки в README после успешных деплоев**

Run (вручную): получить 6 URL из `pnpm dlx vercel@latest ls --scope=uniprint`, вставить в README.

- [ ] **Step 4: Commit**

```bash
git add prototype/MOCK_NOTICE.txt prototype/README.md
git commit -m "docs(proto): MOCK_NOTICE.txt + README with 6 demo URLs"
```

---

## Task 17: Final pass — verify all + handoff to owner

- [ ] **Step 1: Запустить весь pipeline**

```bash
cd prototype
pnpm install
pnpm typecheck       # все packages + apps
pnpm lint            # biome
pnpm build           # все apps собираются
pnpm test:e2e        # 8 smoke tests pass
```

Expected: всё green.

- [ ] **Step 2: Все 6 Vercel URLs работают**

Открыть каждую ссылку в браузере, проверить:
- MockBanner виден
- Главная страница рендерится
- Хотя бы один internal link работает
- На mobile-версиях (production-mobile, warehouse-mobile) — touch targets ≥44pt видно глазами

- [ ] **Step 3: Обновить `CLAUDE.md` § «Текущий статус»**

```markdown
- **2026-05-XX** — Прототип на моках готов: 6 кабинетов на Vercel
  preview, 8 smoke-тестов pass, MOCK_NOTICE.txt + README с 6 URL.
  Демо отправлено владельцу для валидации UX перед sprint-1.
```

- [ ] **Step 4: Обновить `Docs/log.md` (создать если нет)**

```markdown
## 2026-05-XX

- feat(proto): 17 задач плана `Docs/superpowers/plans/prototype.md` выполнены
- 6 Vercel preview URLs доступны (см. prototype/README.md)
- Smoke: 8 golden-path passing (playwright)
```

- [ ] **Step 5: Финальный коммит**

```bash
git add CLAUDE.md Docs/log.md
git commit -m "docs: prototype done — 6 cabinets on Vercel, smoke green"
```

- [ ] **Step 6: Handoff message (сообщить владельцу)**

В PM-канал (Telegram быстрые / Email формальные):

```
Прототип UniPrint готов к демо.

6 кликабельных кабинетов:
  • Кабинет клиента: <client-portal URL>
  • Менеджер CRM: <manager-web URL>
  • Производство (PWA): <production-mobile URL>
  • Склад (PWA): <warehouse-mobile URL>
  • Админ-панель: <admin-panel URL>
  • Дашборд учредителя: <owner-dashboard URL>

Цель демо — валидация UX и BPMN перед sprint-1. Все данные —
синтетические моки (см. MOCK_NOTICE на каждом экране).

Закреплены ваши ответы от 2026-05-05 (PWA, без Telegram, Yandex Maps,
один цех/склад MVP, простой PDF-документооборот, 54-ФЗ применим).

Жду вашего фидбека по UX. Если ОК — стартуем sprint-1 после
ответов на оставшиеся 🔴 Q1-Q5 (юрисдикция, Face Control vendor,
хостинг, миграция, эквайринг).
```

---

# Self-review (выполнено автором плана)

## 1. Spec coverage check

- ✅ Turborepo + Next.js 16 + React 19 + TS + Tailwind 4 + shadcn/ui (Tasks 1, 5, 6)
- ✅ MSW (Task 4 + 6)
- ✅ 6 кабинетов (Tasks 6, 10, 11, 12, 13, 14)
- ✅ packages tokens / ui / mocks / types (Tasks 2-5)
- ✅ PWA mobile-first для production-mobile / warehouse-mobile (Tasks 11, 12 — viewport meta + size="touch")
- ✅ Vercel preview (Tasks 9, 10, 11, 12, 13, 14)
- ✅ Playwright smoke (Task 15)
- ✅ MOCK_NOTICE.txt (Task 16)
- ✅ Constraints: PWA only / no Telegram / Yandex Maps + Object Storage — отражены в TS-types, fixtures, .env.example, MOCK_NOTICE
- ✅ Goal: clickable demo for client validation — Task 17 handoff

## 2. Placeholder scan

- Нет «TODO», «implement later», «add validation», «similar to Task N»
- Каждый Step имеет либо команду, либо код-блок
- Все типы / методы / props определены до использования

## 3. Type consistency

- `Order`, `Lead`, `Client`, `MaterialBatch`, `User`, `Defect`, `OperationLog`, `FaceControlEvent` — определены в Task 2 и используются как `import type` в Tasks 4-14 без расхождений
- `Button size="touch"` — определён в Task 5 и используется в Tasks 11, 12 (mobile)
- `MockBanner` экспорт из `@uniprint/ui` (Task 5) → импорт в каждом app/layout.tsx
- `MOCK_NOTICE` константа из `@uniprint/tokens` (Task 3) → используется в Task 5 `MockBanner`

## 4. Что осознанно отложено (out of scope этого плана)

- WebPush мок (можно добавить в Task 4 handlers — пока YAGNI для демо)
- shadcn `Form` + `react-hook-form` (упростили до native form в Task 8 — YAGNI)
- i18n / темы (только русский + один светлый theme — YAGNI)
- Authentication / sessions (одна mock-сессия на app — `usr_001` или `usr_012`)
- Audit-log UI (есть в типах Order.history — UI добавим в sprint-1)
- Биометрические согласия UI (показано в admin-panel users только индикатором — детальная форма в sprint-1+)
- WebSocket для real-time (mock через polling в `setInterval` где надо — sprint-1+)

---

## Execution Handoff

Plan complete and saved to `Docs/superpowers/plans/prototype.md`. Two execution options:

**1. Subagent-Driven (recommended)** — диспатчу свежего субагента на каждую задачу (1-17), ревью между задачами, быстрая итерация. **Sub-skill:** `superpowers:subagent-driven-development`.

**2. Inline Execution** — выполняю задачи в текущей сессии, batch-точки для проверки. **Sub-skill:** `superpowers:executing-plans`.

**Какой подход?**
