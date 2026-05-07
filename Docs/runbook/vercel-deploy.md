# Vercel deploy (Phase-0 prototype)

> Runbook для деплоя 6 кабинетов прототипа на Vercel preview.
> Phase-0 = моки без реальных ПДн, поэтому Vercel допустим (см.
> `prototype/MOCK_NOTICE.txt`).
>
> **Status:** Готово 2026-05-07. Все 6 кабинетов в проде на
> `*.vercel.app`. Auto-deploy на push в `main`. Конфиг зафиксирован
> в `vercel.json` per app + `getRoles(host)` resolver для
> RoleSwitcher.
>
> **Каждый кабинет = отдельный Vercel project** на одном GitHub repo.

## Предусловия

- [x] GitHub repo: `github.com/SigmeD/uniprint`
- [x] Ветка: `feature/prototype` (актуальная разработка прототипа)
- [x] Vercel аккаунт (scope `maxeroxinllm-5214`)
- [x] Vercel CLI v51.6.1+ (опционально для последующих deployments)

## Соответствие app → project

| Кабинет | Vercel project | Root Directory | Local port |
| --- | --- | --- | --- |
| Клиент | `uniprint-client` | `prototype/apps/client-portal` | 3001 |
| Менеджер | `uniprint-manager` | `prototype/apps/manager-web` | 3002 |
| Производство (PWA) | `uniprint-production` | `prototype/apps/production-mobile` | 3003 |
| Склад (PWA) | `uniprint-warehouse` | `prototype/apps/warehouse-mobile` | 3004 |
| Админ | `uniprint-admin` | `prototype/apps/admin-panel` | 3005 |
| Учредитель | `uniprint-owner` | `prototype/apps/owner-dashboard` | 3006 |

После деплоя auto-домены: `uniprint-{client|manager|...}.vercel.app`.

## Шаги (повторить 6 раз — по одному на app)

### 1. Открыть New Project

1. Перейти на https://vercel.com/new
2. **Import Git Repository** → выбрать `SigmeD/uniprint`
   - Если репо не виден — нажать **Adjust GitHub App Permissions**,
     добавить repo в Vercel GitHub App (https://github.com/apps/vercel)

### 2. Configure Project

**Project Name** — из таблицы выше (`uniprint-<кабинет>`).

**Framework Preset** — `Next.js` (auto-detect должен сработать).

**Root Directory** — нажать `Edit` → выбрать `prototype/apps/<app>` из таблицы.

> Vercel при выборе пути увидит `prototype/turbo.json` и `prototype/pnpm-workspace.yaml` — automatically включит Turborepo + pnpm support.
> Опция **«Include source files outside of the Root Directory in the Build Step»** должна включиться сама (workspace packages в `prototype/packages/` нужны для сборки).

> ⚠️ **Важно** (lesson learned 2026-05-07): Vercel auto-detect для pnpm
> Turborepo НЕ работает корректно — он запускает `npm install` в Root
> Directory, не находит `pnpm-lock.yaml` (он в `prototype/`, не в app
> dir), → 0 packages → "No Next.js version detected". Поэтому в репо
> закоммичены **`vercel.json` per app** с явными install/build
> командами (см. ниже). Vercel читает `vercel.json` и использует наши
> команды вместо auto-detect.

**Build & Output Settings** — оставить defaults в UI (vercel.json
переопределяет их при деплое):
- Build Command: `cd ../.. && pnpm turbo build --filter=@uniprint/<app>`
  (Vercel сам подставит правильный filter из `package.json`'s `name`
  поля. Если не подставит — указать вручную)
- Output Directory: `.next`
- Install Command: `cd ../.. && pnpm install --frozen-lockfile`

**Environment Variables** — пусто (прототип на моках, реальные ENV
появятся позже после ADR на backend и интеграции).

**Production Branch** (Settings → Git):
- Установить `main` — стабильный URL `uniprint-<app>.vercel.app`.
- Если работаете на `feature/<branch>` — пуш создаст preview deploy
  на отдельном URL, не трогая production.

### 3. Deploy

Нажать **Deploy**. Build займёт ~30-60 сек:
- Vercel клонирует repo
- `pnpm install` на workspace root → resolve workspace deps
- `turbo build --filter=@uniprint/<app>` собирает app + его packages
  (`@uniprint/ui`, `tokens`, `types`, `mocks`)
- Static optimization, deploy на edge

### 4. Verify

После Ready:
- Открыть выданный URL
- Проверить:
  - [ ] PROTOTYPE banner виден сверху
  - [ ] MSW моки работают (данные на дашборде, не loading state)
  - [ ] Хлебные крошки кликабельны
  - [ ] Crumbs Home icon рендерится (Lucide ChevronRight, не plain `/`)
  - [ ] Sub-routes работают: `/users` (admin), `/profit` (owner),
        `/orders/new` (manager) — нет 500
  - [ ] PWA-кабинеты (production/warehouse) показывают phone-frame на
        desktop и full-screen на mobile

### 5. Repeat × 6

Повторить шаги 1-4 для оставшихся 5 apps.

## Постдеплой

После всех 6:

- [ ] Проверить все 6 URL'ов (https://uniprint-{client,manager,...}.vercel.app)
- [ ] Зафиксировать URL'ы в `Docs/log.md`
- [ ] Обновить `CLAUDE.md` § «Среды» с таблицей реальных URL
- [ ] (опц.) Кастомные домены через **Settings → Domains** проекта
- [ ] (опц.) `vercel link` на локальной машине для последующих
      `vercel deploy` через CLI без UI

## Troubleshooting (lessons learned 2026-05-07)

| Симптом | Причина | Фикс |
| --- | --- | --- |
| `No Next.js version detected` despite Next в package.json | Vercel auto-detect запускает `npm install` (не pnpm) → 0 packages → нет node_modules/next/ | Закоммитить **`vercel.json`** в app dir с явным `installCommand: "cd ../.. && pnpm install --frozen-lockfile"` |
| `installCommand: "echo ..."` + install в `buildCommand` ломает детект | Vercel pipeline: install → framework detection → build. С пустым install детект фейлит ДО buildCommand | Реальный `pnpm install` в `installCommand`, а в `buildCommand` только `pnpm --filter ... build` |
| Root Directory `" prototype/apps/owner-dashboard"` не найдена | Ведущий пробел при copy/paste | В UI поля очистить, набрать руками `prototype/apps/owner-dashboard` без пробелов |
| Vercel deploy с `main`, builds без кода | Production Branch на main, но main был docs-only | Merge feature/prototype → main или сменить Production Branch на ветку с кодом |
| Framework Preset = "Other" | По умолчанию Vercel может не распознать Next.js | Settings → General → Framework Preset → **Next.js** → Save |
| RoleSwitcher → localhost:300X на проде | Ссылки захардкожены в SSR | Использовать `getRoles(host)` через `await headers()` в layouts (см. `packages/ui/src/lib/roles.ts`) |
| CLI `vercel deploy` падает с doubled path (`apps/owner/prototype/apps/owner`) | `.vercel/` в app dir + Root Directory в Vercel project settings → двойное применение | Не использовать CLI deploy для проектов с Root Directory. Положиться на GitHub auto-deploy |
| `ERR_PNPM_OUTDATED_LOCKFILE` | Lockfile разошёлся | Локально `pnpm install`, commit `pnpm-lock.yaml`, push |
| `Cannot find module '@uniprint/ui'` | Workspace не подцепился | В Project Settings включить «Include source files outside Root Directory» |
| pnpm warning «Ignored build scripts: msw...» | pnpm 9+ безопасности ради не запускает postinstall | Не блокер если `public/mockServiceWorker.js` уже закоммичен (генерится локально через `pnpm msw:init`) |
| 404 на `/users` etc. | Build Output не включил route | Проверить что `app/users/page.tsx` в репо, не в `.gitignore` |

## Subsequent deployments

После первичной настройки auto-deploy работает на каждый push в `main`
(Production Branch). Force re-deploy:

```bash
# Re-deploy последней версии (через Dashboard)
# Project → Deployments → 3-точечное меню на любом deploy → Redeploy

# Trigger через empty commit:
git commit --allow-empty -m "chore: trigger Vercel redeploy"
git push
```

CLI deploy **не рекомендуется** для проектов с Root Directory —
из-за doubling path bug. Используйте Dashboard или git push.

## Конфигурация vercel.json (зафиксированная)

Каждый из 6 apps имеет свой `vercel.json`:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "installCommand": "cd ../.. && pnpm install --frozen-lockfile",
  "buildCommand": "cd ../.. && pnpm --filter @uniprint/<app-name> build",
  "outputDirectory": ".next"
}
```

Где `<app-name>` — имя из `package.json` каждого app (например
`@uniprint/owner-dashboard`).

**Что делает:**
- `installCommand` — `cd` в workspace root (`prototype/`), запускает
  `pnpm install` со всеми workspace deps. **Все** 4 packages
  (`@uniprint/ui`, `tokens`, `types`, `mocks`) ставятся как
  symlinks через workspace protocol. После этого `node_modules/next/`
  есть в каждом app.
- `buildCommand` — `cd` в workspace root, запускает `pnpm --filter`
  build только для нужного app (его deps уже сбилжены через `^build`
  в turbo.json).
- `outputDirectory: ".next"` — относительно Root Directory (т.е.
  `prototype/apps/<app>/.next`).

## Host-based ROLES resolver

`packages/ui/src/lib/roles.ts` экспортирует `getRoles(host)` —
резолвит URL'ы кабинетов из текущего host:

- На `localhost` → `http://localhost:300X`
- На `*.vercel.app` → `https://uniprint-{role}.vercel.app`

Каждый layout берёт host через `await headers()` (Next.js Server
Component pattern) и передаёт `roles={getRoles(host)}` в `<RoleSwitcher>`.

## Compliance reminder

⚠️ Прототип на Vercel допустим **только** потому, что:
1. Все данные — синтетические (см. PROTOTYPE banner на каждом экране)
2. Реальные ПДн вводить запрещено (правило enforcedя в UI)
3. Это Phase-0 (discovery), не пилот

Для production (Phase-1+) хостинг должен быть в РФ-юрисдикции по
152-ФЗ ст. 18 ч. 5 — кандидаты Yandex.Cloud / Selectel / VK Cloud
(финал после ответа владельца 🔴 Q3).
