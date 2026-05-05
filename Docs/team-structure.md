# Команда UniPrint — маппинг ролей на агентов и скиллы

> Виртуальная команда «как-если-бы» для проекта UniPrint. Каждой
> человеческой роли соответствует один или несколько агентов / скиллов
> из `claude-skills/` и плагинов. Используется в основной сессии
> Claude Code для делегирования задач профильным специалистам.
>
> **Правило:** задача делегируется **профильному агенту**, который
> применяет **профильный скилл**. Не пытайся сделать всё в основной
> сессии — это единая точка отказа и шум в контексте.

---

## Model-routing (всегда явно в `Agent` tool)

| Тип задачи | Модель | `model:` |
| --- | --- | --- |
| Planning, architecture, management, design, research, brainstorming, UX, маркетинг-стратегия, compliance, finance, BPMN, **DevOps architecture** (CI/CD design, deploy strategy, hosting choice, troubleshooting) | **Opus 4.7** | `"opus"` |
| Написание кода: страницы, компоненты, hooks, тесты, mock-handlers, миграции, скаффолдинг, рефакторинг, **DevOps execution** (Dockerfile, terraform .tf, helm chart, GHA workflow yaml) | **Sonnet 4.6** | `"sonnet"` |

> **Правило большого пальца:** если агент **думает** — Opus. Если агент
> **печатает** по уже принятому решению — Sonnet.
>
> При каждом вызове `Agent` указывай `model:` явно — иначе агент
> унаследует модель родителя, и роутинг сломается.

---

## Содержание

**Основные роли (1-18):**

1. [Продуктовый директор (CPO)](#1-продуктовый-директор-head-of-product--cpo)
2. [Продукт-менеджер (PM)](#2-продукт-менеджер-pm)
3. [Проектный менеджер (Scrum Master)](#3-проектный-менеджер-pm-delivery--scrum-master)
4. [Архитектор / Tech Lead (system-level)](#4-архитектор--tech-lead)
5. [Engineering Lead (team-level)](#5-engineering-lead-team-level-technical-management)
6. [Senior Backend (TBD-стек)](#6-senior-backend-разработчик-tbd-стек-после-adr)
7. [Senior Frontend (Next.js + React 19)](#7-senior-frontend-разработчик-nextjs-16--react-19)
8. [**Mobile Developer (основная роль)**](#8-mobile-developer--основная-роль-для-uniprint)
9. [QA / Тестировщик](#9-qa--тестировщик)
10. [DevOps / SRE](#10-devops--sre)
11. [Security / SecOps](#11-security--secops)
12. [UX-исследователь / UI-дизайнер](#12-ux-исследователь--ui-дизайнер)
13. [Маркетолог B2B (для клиентского кабинета и продаж)](#13-маркетолог-b2b--для-клиентского-кабинета-и-продаж)
14. [Growth / RevOps (retention B2B + activation CRO)](#14-growth--revops-retention-b2b--activation-cro)
15. [Финансовый аналитик / CFO-advisor](#15-финансовый-аналитик--cfo-advisor)
16. [**Compliance / RA-QM (РФ + биометрия 152-ФЗ ст. 11)**](#16-compliance--ra-qm-рф--биометрия-152-фз-ст-11)
17. [Доменный wiki-куратор](#17-доменный-wiki-куратор)
18. [Оркестрация / координация (Chief of Staff)](#18-оркестрация--координация-chief-of-staff)

**Резервные роли (фаза 2+ или по требованию):**

- [R1. Data Engineer](#r1-data-engineer-фаза-2-когда-analytics-выйдет-за-pg)
- [R2. AI / ML Engineer](#r2-ai--ml-engineer-фаза-2-когда-появятся-llm-фичи)
- [R3. Полиграфическая доменная экспертиза](#r3-полиграфическая-доменная-экспертиза-on-demand)

**Меты:**

- [Doc Writer / TechWriter — почему нет отдельной роли](#doc-writer--techwriter--почему-нет-отдельной-роли)
- [Out of scope для UniPrint-платформы](#out-of-scope-для-uniprint-платформы)
- [Как делегировать в одну строку](#как-делегировать-в-одну-строку)
- [Антипаттерны](#антипаттерны)
- [Model-routing — справочник по всем агентам](#model-routing--справочник-по-всем-агентам)

---

## 1. Продуктовый директор (Head of Product / CPO)

**Кому:** учредитель типографии + CEO UniPrint-как-продукта.

**Когда вызывать:** OKR на квартал, продуктовое видение v2/v3,
конкурентный анализ (1С:Полиграфия, ASystem, prinTrak, AsanaPrint
и т.п.), решения «делать / не делать» крупных фичей, эскалация
трейдоффов «ERP-функция vs клиентский кабинет vs HR-модуль».

| Что | Агент / скилл |
| --- | --- |
| Стратегия и OKR | `cs-product-strategist` агент |
| Продуктовое видение | `product-strategist` скилл |
| Конкурентный анализ | `competitive-teardown` скилл |
| RICE-приоритизация бэклога | `product-manager-toolkit` (RICE prioritizer) |
| Метрики и KPI продукта | `product-analytics` скилл |

**Артефакты:** `Docs/01-vision.md` (живой), квартальные OKR в
`Docs/okr/` (создаётся при первом OKR).

---

## 2. Продукт-менеджер (PM)

**Когда вызывать:** PRD на новую фичу (модуль ТЗ → PRD), customer
interview (учредитель, нач. цеха, складщик), decomposition бэклога
в спринты, пересборка приоритетов после нового вводного, owner-questions
follow-up.

| Что | Агент / скилл |
| --- | --- |
| PRD, ICE, RICE | `cs-product-manager` агент |
| Customer interviews | `product-discovery` скилл |
| User story + acceptance | `cs-agile-product-owner` агент / `agile-product-owner` скилл |
| Roadmap-коммуникация | `roadmap-communicator` скилл |
| Эксперименты и A/B (после прототипа) | `experiment-designer` скилл |
| PRD-генератор | `/prd` команда |
| User stories | `/user-story` команда |

**Артефакты:** `Docs/prd/<feature>.md`, `Docs/stories/`
(создаётся при первой user-story).

---

## 3. Проектный менеджер (PM Delivery / Scrum Master)

**Когда вызывать:** планирование спринта, фасилитация ретро,
sprint-health чек, статус-репорт стейкхолдерам, риск-лог,
управление task-tracker'ом.

| Что | Агент / скилл |
| --- | --- |
| Спринт-планирование | `cs-project-manager` агент / `senior-pm` скилл |
| Tracker задач | TodoWrite (in-session) или GitHub Issues; ClickUp / Notion / Jira — после 🔴 #16 |
| Scrum ceremonies | `scrum-master` скилл |
| Health-check спринта | `/sprint-health` команда |
| Sprint plan | `/sprint-plan` команда |
| Retro | `/retro` команда |
| Статус для стейкхолдеров | `team-communications` скилл |
| Jira / Confluence / ClickUp | `jira-expert` / `confluence-expert` / `clickup` скиллы (после 🔴 #16) |

**Артефакты:** `Docs/sprints/<NN>/plan.md` + `retro.md` (создаются с
sprint-0); еженедельный апдейт учредителю.

---

## 4. Архитектор / Tech Lead

**Зона:** **system-level** — крупные архитектурные решения, влияющие
на структуру кода (модули, API контракты, БД схема, выбор провайдера).

**Когда вызывать:** ADR на крупное решение (mobile-стек, Face Control
vendor, хостинг, эквайринг), дизайн нового модуля (`apps/notifications`,
`apps/audit_log`, `apps/face_control_adapter`), миграция БД,
verification структуры.

| Что | Агент / скилл |
| --- | --- |
| Архитектурные решения | `cs-senior-engineer` агент |
| Дизайн новой фичи | `feature-dev:code-architect` агент |
| Анализ кодовой базы (когда появится) | `feature-dev:code-explorer` агент |
| Системный архитектор | `senior-architect` скилл |
| Оценка стека | `tech-stack-evaluator` скилл |
| Дизайн БД | `database-designer` / `database-schema-designer` скиллы |
| API-дизайн | `api-design-reviewer` скилл |
| Spec-driven workflow | `spec-driven-workflow` скилл |
| Pre-mortem решения | `/challenge` команда |

**Артефакты:** ADR в `Docs/adr/NNNN-<slug>.md` (формат Майкла Найгардта),
spec'и в `Docs/spec/<feature>.md` (создаётся по мере), live-обновления
в `Docs/03-architecture.md`.

**Запланированные ADR (после ответов 🔴 1–7):**
- ADR-0001 — Mobile-стек (native vs RN vs Flutter vs PWA)
- ADR-0002 — Face Control vendor + хранение биометрических шаблонов
- ADR-0003 — Хостинг и юрисдикция (152-ФЗ ст. 18 ч. 5)
- ADR-0004 — Backend-стек (Django/DRF vs Node/NestJS)
- ADR-0005 — Эквайринг и приём оплат
- ADR-0006 — Стратегия многоплощадочности (multi-warehouse, фаза 2)

---

## 5. Engineering Lead (team-level technical management)

**Зона:** **team-level** — управление инженерной практикой, не отдельные
архитектурные решения. Граница с Section 4: Tech Lead отвечает за «как
устроена система», Engineering Lead — за «как работает команда».

**Когда вызывать:** sprint-0 onboarding, tech debt strategy / реестр /
sprint-аллокация, incident response coordination, hiring decisions для
tech-ролей, выбор технологий уровня команды (не отдельного модуля),
технические health-checks.

| Что | Агент / скилл |
| --- | --- |
| Engineering Lead (главный) | `cs-engineering-lead` агент |
| Tech debt management | `tech-debt-tracker` скилл / `/tech-debt` команда |
| Incident response | `incident-commander` агент / `incident-response` скилл |
| Engineering culture | `culture-architect` скилл |
| Карьерные / leadership | `executive-mentor` скилл |
| CTO-уровень advisory | `cs-cto-advisor` агент / `cto-advisor` скилл |

**Артефакты:** `Docs/onboarding/tech-lead-day-1.md` (создаётся в
sprint-0), `Docs/tech-debt.md` (live), `Docs/runbook/incidents/<NNN>-<slug>.md`,
квартальный engineering health report.

---

## 6. Senior Backend разработчик (TBD-стек после ADR)

**Текущий стек:** **отсутствует** (Phase-0 — прототип на MSW-моках).
Финал — после ADR-0004 (Django+DRF vs Node/NestJS — выбор зависит от
команды и нагрузки 6.9.1 «20+ одновременных пользователей»).

**Когда вызывать (после ADR-0004):** реализация модуля, REST endpoint,
WebSocket для real-time прогресса заказа / Face Control события,
background-задача (расчёт ЗП, амортизация), миграция, оптимизация
запросов.

| Что | Агент / скилл |
| --- | --- |
| Бэкенд-имплементация | `senior-backend` скилл |
| Fullstack-задачи (бэк-фронт) | `senior-fullstack` скилл — см. ниже |
| TDD-флоу | `superpowers:test-driven-development` |
| SQL / индексы | `sql-database-assistant` скилл |
| Stripe-аналог (YooKassa) | `stripe-integration-expert` (как референс паттернов) |
| Karpathy-чек качества | `cs-karpathy-reviewer` агент / `/karpathy-check` |
| Симплификация | `code-simplifier:code-simplifier` агент |

> **Fullstack disambiguation:** задачи затрагивающие и backend, и
> frontend, попадают в Section 6 если backend-heavy (миграция +
> простая UI-страница), в Section 7 если frontend-heavy (новый
> экран + minor backend tweak).

**Артефакты (после ADR-0004):** код в `backend/apps/<name>/` (или
эквивалентная структура в выбранном стеке), тесты в
`backend/apps/<name>/tests/`.

---

## 7. Senior Frontend разработчик (Next.js 16 + React 19)

**Текущий стек:**
- **Прототип** (`prototype/apps/*`): Next.js **16** App Router,
  React 19, MSW для моков, Tailwind 4, shadcn/ui, deployed на Vercel
  preview
- **Production** (после ADR-0004): тот же фронт, поднимается над
  выбранным backend

**Когда вызывать:** страница / экран в любом из 6 кабинетов (client-portal,
manager-web, production-mobile, warehouse-mobile, admin-panel,
owner-dashboard), формы заказа / расчёта стоимости, dashboard
учредителя, mock-handlers MSW, service worker для offline (Mobile-PWA).

| Что | Агент / скилл |
| --- | --- |
| Frontend-имплементация | `senior-frontend` скилл |
| Distinctive UI | `frontend-design:frontend-design` агент |
| Next.js App Router | `vercel:nextjs` скилл |
| React best-practices | `vercel:react-best-practices` скилл |
| shadcn/ui | `vercel:shadcn` скилл |
| A11y-аудит | `a11y-audit` скилл / `/a11y-audit` |
| Cache Components (Next 16) | `vercel:next-cache-components` скилл |
| Vercel deploy / env / cli | `vercel:vercel-cli`, `vercel:env-vars`, `vercel:deployments-cicd` |

**Артефакты:**
- **Прототип**: `prototype/apps/{client-portal, manager-web,
  production-mobile, warehouse-mobile, admin-panel, owner-dashboard}/`,
  `prototype/packages/{tokens, ui, mocks, types}/`
- **Production** (после ADR-0004): продакшн-форки тех же apps поверх
  реального backend

---

## 8. Mobile Developer — **основная роль для UniPrint**

**Зона:** Mobile App для сотрудников — **ключевой канал** взаимодействия
для производства, склада, монтажников, водителей. Не «реактивная
поддержка POS-bridge как в Zira», а **активная разработка** Mobile App
в каждом спринте начиная с фазы 2.

**В Phase-0 / прототипе:** имитация через PWA mobile-first
(`prototype/apps/{production-mobile, warehouse-mobile}/`) — для демо
клиенту.

**После ADR-0001 (mobile-стек):** активная разработка native
(Kotlin Android + Swift iOS) **или** cross-platform (React Native /
Flutter) — выбор по результату ответа клиента 🔴 #6.

**Когда вызывать:** сценарий начала смены сотрудника + Face Control,
скан штрих-кода материала на складе, mobile-форма фиксации брака с
фото и геометкой, push-нотификации, offline-mode для производства
(сценарий «вышел из зоны Wi-Fi»), фотофиксация выполненной работы,
GPS-трек водителя для логистики (модуль 6.24).

| Что | Агент / скилл |
| --- | --- |
| Mobile architecture (Clean / MVI / Feature Modules) | `senior-architect` + `cs-senior-engineer` (architecture) |
| Cross-platform implementation (RN / Flutter — sonnet) | `general-purpose` (sonnet) с domain context — **до появления dedicated mobile skill** |
| Native Android (Kotlin) | `general-purpose` (sonnet) с domain context |
| Native iOS (Swift) | `general-purpose` (sonnet) с domain context + `apple-hig-expert` для UX-консистентности |
| Offline-mode (sync, queue) | `senior-backend` для протокола sync + Mobile-impl |
| PWA-имитация в прототипе | `senior-frontend` (мобильно-first layout, viewport, touch-target ≥44pt) |
| Push-notifications (FCM / APNs) | `general-purpose` (sonnet) + `notification-channel-design` через `senior-backend` |
| Crash reporting | `observability-designer` (стратегия) |
| ASO (фаза 3+, при дистрибуции через store) | `app-store-optimization` скилл |

> **Если объём mobile-разработки превысит skills-stack** (нет dedicated
> mobile skills для RN/Flutter/Swift — полагаемся на general-purpose +
> ручную ревью): рассмотреть привлечение специалиста-человека и/или
> разработку custom skill через `skill-creator:skill-creator`.

**Артефакты:**
- **Phase-0 / прототип**: `prototype/apps/production-mobile/`,
  `prototype/apps/warehouse-mobile/` (PWA mobile-first)
- **Phase 2+ (после ADR-0001)**: `mobile/` (RN/Flutter monorepo) или
  `mobile-android/`, `mobile-ios/` (если native)
- Runbook'и: `Docs/runbook/mobile/<scenario>.md` (offline-mode,
  Face-Control sync, обновление приложений на устройствах сотрудников)

---

## 9. QA / Тестировщик

**Когда вызывать:** unit-тесты, e2e-сценарии, regression-набор,
golden-path smoke перед демо клиенту, тест offline-сценариев
(Mobile App без Wi-Fi на цехе), тест «Face Control vendor down» —
graceful degradation, тест сдельной ЗП при крайних значениях
(0 операций / отрицательный баланс).

| Что | Агент / скилл |
| --- | --- |
| Генерация тестов | `senior-qa` скилл |
| **Playwright pipeline** (e2e) | `pw:*` скиллы (sub-skills: `init`, `generate`, `coverage`, `fix`, `migrate`, `review`, `report`) + `mcp__plugin_playwright_playwright__*` MCP |
| API test-suite | `api-test-suite-builder` скилл |
| Cross-browser BrowserStack | `pw:browserstack` скилл (фаза 2+) |
| TestRail-синхронизация | `pw:testrail` скилл (фаза 2+) |

**Артефакты:**
- **Phase-0 / прототип**: `prototype/playwright/`,
  `prototype/apps/*/__tests__/`
- **Production (после ADR-0004)**: `backend/apps/<name>/tests/` (или
  эквивалент), `<service>/e2e/`

---

## 10. DevOps / SRE

**Особенность:** задачи DevOps делятся на **Architecture** (думает) и
**Execution** (печатает) — модель выбирается соответственно.

### 10a. DevOps Architecture (Opus 4.7)

**Когда вызывать:** дизайн CI/CD pipeline, выбор хостинга (ADR-0003),
scaling strategy для пиковой нагрузки конца месяца (расчёт ЗП),
observability стратегия, выбор secrets vault, troubleshooting «почему
деплой ломается», постановка SLO/SLI.

| Что | Агент / скилл |
| --- | --- |
| Стратегические решения | `cs-cto-advisor` агент / `cto-advisor` скилл |
| Architecture review | `senior-devops` skill через `general-purpose` (`opus`) |
| CI/CD design | `ci-cd-pipeline-builder` скилл (architecture часть) |
| Observability strategy | `observability-designer` скилл |
| Secrets strategy | `secrets-vault-manager` скилл (Yandex Lockbox / sops / Vault) |
| Cloud architecture | `aws-solution-architect` / `gcp-cloud-architect` / `azure-cloud-architect` (резерв; для **РФ** — `cloud-security` + manual recipe для Yandex.Cloud / Selectel / VK Cloud) |

### 10b. DevOps Execution (Sonnet 4.6)

**Когда вызывать:** написание Dockerfile, terraform .tf, GHA workflow
yaml, helm chart, k8s manifests, env files, runbook script.

| Что | Агент / скилл |
| --- | --- |
| Dockerfile / compose | `docker-multitenancy` скилл (за общим reverse proxy) + `docker-development` |
| Terraform IaC | `terraform-patterns` скилл |
| Helm / Kubernetes | `helm-chart-builder` скилл (если перейдём на K8s) |
| GitHub Actions / GitLab CI | `senior-devops` skill (через `general-purpose` `sonnet`) |
| Runbook generation | `runbook-generator` скилл |
| Env / secrets file management | `env-secrets-manager` скилл |
| Performance profiling | `performance-profiler` скилл |
| Incident response (execution) | `incident-commander` агент + `incident-response` скилл |

**Артефакты:**
- Корень: `docker-compose.{yml,dev.yml,prod.yml}` (после ADR-0004)
- `infra/` (фаза 2+): `terraform/`, `traefik/`, `monitoring/`
- `.github/workflows/` (CI для прототипа уже работает)
- Runbook'и в `Docs/runbook/`

---

## 11. Security / SecOps

**Когда вызывать:** threat-model, аудит безопасности перед релизом,
проверка endpoint'ов на OWASP top-10, ротация секретов, аудит RBAC
(11+ ролей по ТЗ — учредитель, нач. цеха, печатник, лазерщик, плотник,
монтажник, дизайнер, складщик, менеджер, водитель, администратор,
клиент), incident response (security side), **отдельно — защита
биометрических шаблонов Face Control**.

| Что | Агент / скилл |
| --- | --- |
| Application security | `senior-security` скилл |
| SecOps / vulnerability mgmt | `senior-secops` скилл |
| Pen-testing | `security-pen-testing` скилл |
| Cloud security (Yandex.Cloud / Selectel) | `cloud-security` скилл |
| Threat detection | `threat-detection` скилл |
| Red team (фаза 3 при необходимости) | `red-team` скилл |
| AI-security (для Face Control CV-моделей) | `ai-security` скилл |
| Security review of skills before install | `skill-security-auditor` скилл |
| /security-review команда | `/security-review` |

**Артефакты:** `Docs/security/threat-model.md` (создаётся в sprint-1),
`SECURITY.md` (responsible disclosure), `Docs/security/biometry-storage.md`
(шаблоны Face Control — шифрование, ключи, ротация).

---

## 12. UX-исследователь / UI-дизайнер

**Когда вызывать:** UX-аудит на дискавери, прототипы экранов 6 кабинетов,
персоны (учредитель, нач. цеха, печатник, складщик, менеджер, монтажник,
водитель, клиент), customer journey мап (3 типа заказа: цех /
офис-полиграфия / продажа товара), проектирование форм согласия ПДн +
**отдельная форма биометрического согласия** (152-ФЗ ст. 11), дизайн-система,
адаптация под mobile-touch (production-mobile, warehouse-mobile).

| Что | Агент / скилл |
| --- | --- |
| UX-research | `cs-ux-researcher` агент / `ux-researcher-designer` скилл |
| UI Design System | `ui-design-system` скилл |
| Apple HIG / iOS-нюансы | `apple-hig-expert` скилл (для PWA на iOS + native iOS) |
| Frontend-design (визуальный язык) | `frontend-design:frontend-design` агент |
| Persona generation | `/persona` команда |
| User interview analysis | `meeting-analyzer` скилл |

**Артефакты (создаются по мере):** `Docs/ux/personas/`,
`Docs/ux/journeys/`, дизайн-токены в `prototype/packages/tokens/`,
гайдлайны в `prototype/packages/ui/`.

---

## 13. Маркетолог B2B — для клиентского кабинета и продаж

**Зона:** **B2B-acquisition** для клиентского кабинета UniPrint
(внешние заказчики типографии — корпоративные клиенты, дизайн-студии,
рекламные агентства, частные SMB) + **внутренний enablement**
(онбординг новых сотрудников типографии в систему).

> Граница с Zira: UniPrint — **внутренний ERP**, не consumer-facing
> бренд. Acquisition-задачи приземистее: лендинг клиентского кабинета,
> промо-материалы для отдела продаж, email-рассылка по базе клиентов
> «теперь заказы можно через личный кабинет».

**Когда вызывать:** запуск клиентского кабинета с реактивацией
текущих клиентов, лендинг для входящих лидов, email-кампания
«new in client portal», описание услуг типографии в каталоге для
SEO, контент академии для онбординга сотрудников в Mobile App.

| Что | Агент / скилл |
| --- | --- |
| Контент-стратегия | `cs-content-creator` агент / `content-strategy` скилл |
| Demand generation (B2B) | `cs-demand-gen-specialist` агент |
| Лендинги | `landing-page-generator` скилл |
| Copywriting | `copywriting` / `content-humanizer` скиллы |
| Email-sequences (re-activation существующих клиентов) | `email-sequence` скилл |
| Cold email (B2B новых клиентов) | `cold-email` скилл |
| Launch-стратегия (запуск клиентского кабинета) | `launch-strategy` скилл |
| AI-SEO (citation в LLM для типография-запросов) | `ai-seo` скилл |
| Программный SEO (по типам услуг) | `programmatic-seo` скилл |

**Артефакты:** `Docs/10-marketing.md` (создаётся при первом
маркетинг-плане для клиентского кабинета), лендинги в `landing/`.

---

## 14. Growth / RevOps (retention B2B + activation CRO)

**Зона:** удержание B2B-клиентов в клиентском кабинете и оптимизация
ключевых конверсионных точек.

**Когда вызывать:** дизайн программы лояльности (скидки за объём, частоту
заказа), оптимизация формы заказа в клиентском кабинете, сценарий
«клиент не размещал заказ 60 дней» (re-engagement email), retention
клиентов через персональные предложения от менеджера, активация после
первого заказа.

| Что | Агент / скилл |
| --- | --- |
| Growth strategy (главный) | `cs-growth-strategist` агент |
| Retention / churn prevention | `churn-prevention` скилл |
| Pricing strategy | `pricing-strategy` скилл |
| Activation / signup CRO | `signup-flow-cro` / `onboarding-cro` скиллы |
| Form CRO (форма заказа в клиентском кабинете) | `form-cro` скилл |
| Page CRO | `page-cro` скилл |
| A/B test setup и анализ | `ab-test-setup` скилл / `experiment-designer` |
| Analytics / KPI | `product-analytics` скилл (overlap с Section 1) |
| Customer success monitoring | `customer-success-manager` скилл |
| Revenue operations | `revenue-operations` скилл |

**Артефакты:** `Docs/growth/<experiment>.md` (по мере), обновления
`Docs/10-marketing.md` в части воронки и LTV B2B-клиента.

---

## 15. Финансовый аналитик / CFO-advisor

**Когда вызывать:** юнит-экономика заказа (себестоимость материалов
+ ЗП + амортизация оборудования + накладные → прибыль), расчёт ROI
инвестиций учредителя в платформу, P&L прогноз типографии,
расчёт TCO разработки + поддержки в смете, **верификация формулы
сдельной ЗП** (ТК ст. 136 + долговой баланс BR-05),
**амортизация оборудования** (модуль 6.24 + расчёт 7.18).

| Что | Агент / скилл |
| --- | --- |
| Финансовый аналитик | `cs-financial-analyst` агент |
| CFO-advisor | `cfo-advisor` скилл |
| SaaS-метрики (если будет SaaS-расширение, фаза 3+) | `saas-metrics-coach` скилл / `/saas-health` |
| Бизнес-инвестиции | `business-investment-advisor` скилл |
| Sales engineering (B2B продажа платформы другим типографиям) | `sales-engineer` скилл |
| Контракты и предложения (наше КП клиенту) | `contract-and-proposal-writer` скилл |
| Statistical analysis (анализ KPI сотрудников) | `statistical-analyst` скилл |

**Артефакты:** `Docs/finance/unit-economics.md` (создаётся при первом
ЮЭ-расчёте), `Docs/06-estimate.md` (живой), `Docs/kp/kp-with-cost.md`
(коммерческое предложение клиенту — после ответов 🔴 1–7).

---

## 16. Compliance / RA-QM (РФ + биометрия 152-ФЗ ст. 11)

**Зона:** настройка хранения ПДн под 152-ФЗ, **отдельный фокус на
биометрии Face Control** (152-ФЗ ст. 11), audit-log для финансов под
402-ФЗ (хранение первички 5 лет), **сдельная ЗП по ТК РФ**
(ст. 136 расчётный лист, ст. 137 ограничения по удержаниям —
не уходить в минус по BR-05), 54-ФЗ ОФД (если B2C-оплаты), уведомление
в РКН.

> **Ключевое отличие от Zira:** биометрические ПДн (Face Control) —
> **отдельная категория** в 152-ФЗ ст. 11, требующая **письменного
> согласия** сотрудника отдельно от общего согласия на ПДн.
> Шаблоны Face Control хранятся в защищённом storage (см. Section 11).

**HoReCa-специфика убрана:** ХАССП / ТР ТС 022/2011 (БЖУ + аллергены) /
ЕГАИС / МДЛП / маркетинг-vs-транзакционные SMS — **не применимы** к
типографии.

| Что | Агент / скилл |
| --- | --- |
| Регуляторика и compliance (главный) | `cs-quality-regulatory` агент |
| GDPR / DSGVO (паттерны для 152-ФЗ + биометрия) | `gdpr-dsgvo-expert` скилл |
| ISMS / ISO 27001 (фаза 2+) | `information-security-manager-iso27001` скилл |
| ISMS-audit | `isms-audit-expert` скилл |
| Risk management | `risk-management-specialist` скилл |
| SOC 2 (для будущей корп. продажи как SaaS, фаза 3+) | `soc2-compliance` скилл |

**Артефакты:**
- `Docs/09-compliance.md` (живой)
- `Docs/compliance/policies/privacy.md` (политика ПДн)
- `Docs/compliance/policies/biometry-consent.md` (отдельное согласие
  на биометрию для Face Control — **обязательно для каждого сотрудника**)
- `Docs/compliance/rkn-notification.md` (шаблон уведомления в РКН)
- `Docs/compliance/payroll-tk-compliance.md` (соответствие сдельной ЗП
  ТК РФ)

---

## 17. Доменный wiki-куратор

**Когда вызывать:** ингест статей по 54-ФЗ / 152-ФЗ ст. 11 (биометрия) /
ТК РФ ст. 136-137 / 402-ФЗ в локальную вики, поиск ответов на
регуляторные вопросы, аудит вики на устаревание.

| Что | Агент / скилл |
| --- | --- |
| Bootstrap | `wiki-init` скилл / `/wiki-init` |
| Ингест источника | `cs-wiki-ingestor` агент / `/wiki-ingest` |
| Запрос к вики | `cs-wiki-librarian` агент / `/wiki-query` |
| Аудит вики | `cs-wiki-linter` агент / `/wiki-lint` |
| LLM-wiki framework | `llm-wiki` скилл |

> **Wiki vs spec граница:** Wiki — для **исследовательских**
> материалов (статьи, разборы законов, цитаты, оригиналы PDF).
> `Docs/09-compliance.md` и другие `Docs/0X-*.md` — для **операционных**
> требований (что нам делать, какие endpoint'ы, какие согласия).
> Wiki кормит spec'и, но не заменяет их.

**Артефакты:** `wiki/` (создаётся через `/wiki-init` при первой
потребности), регистр источников в `wiki/index.md`.

---

## 18. Оркестрация / координация (Chief of Staff)

**Когда вызывать:** многоэтапные задачи, требующие нескольких агентов;
советы board-уровня по продуктовой или операционной стратегии; **когда
не знаешь, к какому C-suite advisor идти**.

| Что | Агент / скилл |
| --- | --- |
| Chief of Staff (router C-suite) | `chief-of-staff` скилл |
| CEO-advisor | `cs-ceo-advisor` агент |
| CTO-advisor | `cs-cto-advisor` агент |
| CMO-advisor | `cmo-advisor` скилл |
| CFO-advisor | `cfo-advisor` скилл |
| COO-advisor | `coo-advisor` скилл |
| CHRO-advisor | `chro-advisor` скилл |
| CISO-advisor | `ciso-advisor` скилл |
| CPO-advisor | `cpo-advisor` скилл |
| CRO-advisor | `cro-advisor` скилл |
| Board meeting | `board-meeting` скилл |
| Параллельные агенты | `superpowers:dispatching-parallel-agents` |
| Scenario war-room (cross-functional what-if) | `scenario-war-room` скилл |
| Strategic alignment cascade | `strategic-alignment` скилл |

> **Когда использовать `chief-of-staff` vs прямое делегирование:**
> - **Прямо** — если знаешь конкретный advisor (например, «нужен CMO
>   для positioning'а лендинга клиентского кабинета» → `cmo-advisor`)
> - **Через CoS** — если задача неоднозначна или затрагивает 2+
>   функции (например, «у нас падает retention B2B клиентов, что делать»
>   → CoS решит, нужен Growth-стратег, CMO или CPO)

---

## R1. Data Engineer (фаза 2+, когда analytics выйдет за PG)

**Триггер активации:** объём данных в `apps/analytics/` превышает
PG-комфорт (≈ 10 GB), нужны realtime-агрегации (KPI сотрудников
в дашборде учредителя — модуль 6.21), или появляется DWH (Snowflake /
ClickHouse / Greenplum в РФ).

| Что | Агент / скилл |
| --- | --- |
| Data engineering | `senior-data-engineer` скилл |
| Snowflake | `snowflake-development` скилл |
| Data quality audit | `data-quality-auditor` скилл |
| RAG architecture (если будет AI-поиск по заказам) | `rag-architect` скилл |
| ETL/ELT pipelines | `senior-data-engineer` (etl части) |

**Артефакты (когда роль активирована):** `apps/analytics/`
DWH-адаптер, dbt-проект в `analytics/dbt/`, pipeline-runs в
Airflow / Dagster.

---

## R2. AI / ML Engineer (фаза 2+, когда появятся LLM-фичи)

**Триггер активации:** появление LLM/ML-фич в продукте — **Computer
Vision для контроля макетов** (распознавание шрифтов / разрешения
изображений / выходов за поля припуска), chatbot для клиента
в кабинете (FAQ + статус заказа), **prediction производственного
времени** на основе истории, **OCR для накладных и актов**
(documatic-flow, модуль 6.23).

| Что | Агент / скилл |
| --- | --- |
| ML engineering | `senior-ml-engineer` скилл |
| Computer vision (для CV макетов и Face Control-моделей) | `senior-computer-vision` скилл |
| Data scientist | `senior-data-scientist` скилл |
| Prompt engineering | `senior-prompt-engineer` скилл / `prompt-engineer-toolkit` |
| Prompt governance (production) | `prompt-governance` скилл |
| Claude API integration | `claude-api` скилл |
| Agent design | `agent-designer` скилл |
| Agent workflow | `agent-workflow-designer` скилл |
| LLM cost optimization | `llm-cost-optimizer` скилл |

**Артефакты:** `apps/ai/` или отдельный микросервис, `Docs/ai/prompts/<feature>.md`
(versioned), `Docs/ai/eval-results/`.

---

## R3. Полиграфическая доменная экспертиза (on-demand)

**Триггер активации:** вопросы по типографическим нюансам, на которых
ломается общая экспертиза:
- припуски на резку (bleed 3-5 мм для офсета, для широкоформата
  отдельные правила)
- цветопроба, calibration, ICC-профили, Pantone-библиотеки
- «оракал» (плёнка для наружной рекламы) — типы (литой/каландрированный),
  сроки эксплуатации, особенности нанесения
- m.п. (метры погонные) для роллов широкоформатной печати
- расходники по операциям резки / биговки / ламинации
- стандартные форматы (СРА, А-серия, ROLL), CMYK vs RGB workflow
- особенности печати на разных материалах (бумага плотностью X г/м²,
  картон, плёнка, баннерная ткань)

**Кто:** доменный консультант-человек (не агент). В отсутствие —
`general-purpose` (opus) с явным контекстом «полиграфия / наружная
реклама» + проверка ответов через консультанта при принятии
проектных решений.

**Когда привлекать:** дизайн справочника услуг (модуль 6.6), модуль
расчёта себестоимости (раздел 7), модуль контроля макетов клиента
(валидация при загрузке файла в клиентский кабинет).

**Артефакты:** `Docs/domain/printing-glossary.md`,
`Docs/domain/material-catalog-template.md`,
`Docs/domain/cost-formulas.md`.

---

## Doc Writer / TechWriter — почему нет отдельной роли

**Решение:** документация — **часть DoD каждой роли**, не отдельный
человек / агент. Это закреплено в CLAUDE.md правило **B**.

- ADR пишет **Tech Lead** (после решения)
- Runbook пишет **DevOps** (после deploy/incident)
- README пишет **владелец фичи** (тот кто закрыл feature)
- CHANGELOG пишет **PM Delivery** (при релизе)
- PRD пишет **PM** (до фичи)
- API spec пишет **Tech Lead** (или тот кто проектирует endpoint)
- Compliance docs пишет **Compliance** (при изменении регуляторики)
- General docs (`Docs/01-…10-…`) обновляет **тот кто меняет scope**
  (PM или Tech Lead в зависимости от фактуры)

**PR-review checks:** ревьюер обязан проверить, что соответствующие
docs обновлены — иначе PR не merge'ится. Это enforce'ится через
`Stop` hook (`docs-sync-check.sh`) и checklist в DoD.

**Если потребуется** dedicated TechWriter (фаза 3+ при scale —
несколько типографий на платформе или public API docs): использовать
`general-purpose` (sonnet) с `senior-pm` skill для consolidation-задач.

---

## Out of scope для UniPrint-платформы

UniPrint — это **технологическая платформа** для типографии. Бизнес-вопросы
владельца типографии как такового — out of scope:

| Не наша зона | Куда обратиться |
| --- | --- |
| HR типографии (наём печатников / монтажников) | Прямо `cs-ceo-advisor` агент / `chro-advisor` скилл |
| Закупка оборудования (печатные станки, лазер, плоттер) | Прямо `cs-ceo-advisor` / `coo-advisor` |
| Закупка материалов (бумага / плёнка / краски) | Прямо `cs-ceo-advisor` / `coo-advisor` |
| Дизайн макетов клиентов | Не агентский вопрос — дизайнер типографии |
| Цветопроба / Pantone-калибровка | R3 — доменный консультант + сервисы калибровки оборудования |
| Аренда производственного помещения | Out of scope |
| Бухгалтерия / налоги (не платформенно) | Аутсорс-бухгалтерия (1С / СБИС / Контур) |
| Юр-сопровождение (договоры, политика ПДн, согласия) | Юрист-аутсорс (~80–150 тыс ₽) |

UniPrint закрывает: автоматизацию операций типографии через софт.
Всё «вокруг бизнеса» — отдельная зона ответственности владельца как
ИП/ООО.

---

## Как делегировать в одну строку

```
Делегируй <agent> (model: <opus|sonnet>). Задача: <что>.
Acceptance: <что считается готовым>. Применить: <скиллы>.
Файлы / контекст: <ссылки>. Отчитаться: file:line.
```

**Пример:** «Делегируй `cs-senior-engineer` (model: opus). Задача:
спроектировать `apps/face_control_adapter` с провайдер-абстракцией.
Acceptance: ADR в `Docs/adr/0002-face-control-vendor.md` + sequence
diagram + миграция-стаб + interface для подключения 3 vendor'ов
(Hikvision / Suprema / NtechLab). Применить: `senior-architect`,
`api-design-reviewer`, `gdpr-dsgvo-expert` (для биометрии).
Контекст: `Docs/03-architecture.md` (§ apps/face_control_adapter),
`Docs/05-integrations.md` (§ Face Control), `Docs/09-compliance.md`
(§ 152-ФЗ ст. 11 биометрия). Отчитаться: file:line.»

---

## Антипаттерны

| ❌ Не делать | ✅ Делать вместо |
| --- | --- |
| Реализовывать фичу в основной сессии | Делегировать `cs-senior-engineer` или `senior-backend`/`senior-frontend` |
| **Edit/Write кода с использованием библиотеки/SDK без Context7** | Сначала `mcp__plugin_context7_context7__resolve-library-id` → `query-docs` → потом код (правило **A**) |
| Закрыть фичу без обновления docs | Пройти DoD-чеклист (правило **B**): CLAUDE.md «Текущий статус», PRD статус, ADR (если архитектурное), CHANGELOG (если релизное), затронутые `Docs/0X-*.md` |
| **Хранить биометрические шаблоны Face Control без согласия 152-ФЗ ст. 11** | Прежде интеграции — фиксировать в `Docs/compliance/policies/biometry-consent.md`, реализовать форму согласия в Mobile App, audit-log на доступ |
| **Создавать услуги «вручную» в производстве** | Только из справочника (BR-04) — enforce на бэке + UI запрет |
| **Списывать материалы «в цех» без заказа** | Списание только на конкретный заказ (BR-01) — enforce на бэке |
| Игнорировать compliance до запуска | Делегировать `cs-quality-regulatory` на каждой фазе |
| Запускать всех параллельных агентов отдельными сообщениями | Один message с несколькими `Agent` tool uses (`superpowers:dispatching-parallel-agents`) |
| **Не указывать `model:` при вызове `Agent`** | Всегда явно: `model: "opus"` для planning/design, `"sonnet"` для кода |
| Использовать `chief-of-staff` для очевидных задач | Прямо вызвать профильный advisor (`cmo-advisor`, `cfo-advisor` и т.д.) |
| DevOps execution (Dockerfile, .tf, GHA yaml) на Opus | Sonnet — это **печатание** по принятому решению (Section 10b) |
| Архитектурные решения «на ходу» в коде | ADR через `cs-senior-engineer` (Section 4) **до** написания кода |
| Принимать дизайн-решения без проверки полиграфической специфики | Привлечь R3 (доменный консультант) до фиксации в спеке — припуски, цветопроба, m.п. — детали ломают модель данных |

---

## Model-routing — справочник по всем агентам

> Группировка по принципу «думает vs печатает». При любом вызове
> `Agent` параметр `model:` указывается **явно**.

### Always Opus (думают — стратегия / дизайн / анализ)

| Группа | Агенты / скиллы | Почему |
| --- | --- | --- |
| **C-suite advisors** | `cs-ceo-advisor`, `cs-cto-advisor`, `cmo-advisor`, `cfo-advisor`, `coo-advisor`, `chro-advisor`, `ciso-advisor`, `cpo-advisor`, `cro-advisor`, `chief-of-staff` | Board-уровень, стратегия |
| **Product** | `cs-product-strategist`, `cs-product-manager`, `cs-agile-product-owner`, `cs-product-analyst`, `cs-growth-strategist` | OKR, PRD, RICE, метрики, growth-стратегия |
| **PM Delivery** | `cs-project-manager` | Спринт-планирование, фасилитация, риск-лог |
| **Architecture** | `cs-senior-engineer`, `feature-dev:code-architect`, `senior-architect`, `senior-data-scientist`, `senior-ml-engineer` (architecture части) | ADR, дизайн систем, выбор стека |
| **Engineering Lead** | `cs-engineering-lead`, `tech-debt-tracker` (стратегия) | Технологические решения уровня команды |
| **DevOps Architecture** | `senior-devops` skill (architecture части), `ci-cd-pipeline-builder` (design), `observability-designer`, `secrets-vault-manager` | См. Section 10a |
| **Security strategy** | `senior-security` (strategy), `senior-secops` (strategy), threat-modeling, `cloud-security` (architecture) | Threat models, risk decisions |
| **UX/UI** | `cs-ux-researcher`, `ui-design-system`, `frontend-design:frontend-design`, `apple-hig-expert` | Дизайн-концепции, персоны, journey maps |
| **Marketing strategy** | `cs-content-creator`, `cs-demand-gen-specialist`, `marketing-strategy-pmm`, `competitive-intel`, `competitive-teardown` | Стратегия, позиционирование, конкуренты |
| **Finance** | `cs-financial-analyst`, `cfo-advisor`, `business-investment-advisor`, `saas-metrics-coach` | Юнит-экономика, P&L, валидация моделей |
| **Compliance** | `cs-quality-regulatory`, `gdpr-dsgvo-expert`, `information-security-manager-iso27001`, `risk-management-specialist`, `soc2-compliance` | Регуляторные решения, политики |
| **Code Explorer (deep)** | `feature-dev:code-explorer` | Глубокий анализ паттернов кодовой базы |
| **Plan tool** | `Plan` | Implementation-план — это дизайн |
| **Skill creator** | `skill-creator:skill-creator`, `superpowers:writing-skills` | Дизайн нового скилла |
| **Wiki agents** | `cs-wiki-ingestor`, `cs-wiki-librarian`, `cs-wiki-linter` | Синтез знаний, кросс-ссылки |
| **Decision frameworks** | `executive-mentor:*` (challenge / postmortem / hard-call / stress-test / board-prep) | Cognitive lift |

### Always Sonnet (печатают — код / тесты / артефакты по принятому решению)

| Группа | Агенты / скиллы | Почему |
| --- | --- | --- |
| **Senior Engineer (имплементация)** | `general-purpose` с `senior-frontend`/`senior-backend`/`senior-fullstack`/`senior-qa`/`senior-secops`/`senior-security`/`senior-data-engineer`/`senior-ml-engineer` skills | Написание кода, тесты, миграции, конфиги |
| **DevOps Execution** | `general-purpose` с `senior-devops`/`docker-multitenancy`/`docker-development`/`terraform-patterns`/`helm-chart-builder`/`runbook-generator`/`env-secrets-manager` skills | Dockerfile, .tf, helm yaml, GHA workflow, runbook scripts |
| **Code Reviewers** | `feature-dev:code-reviewer`, `cs-karpathy-reviewer`, `pr-review-expert`, `adversarial-reviewer`, `api-design-reviewer` (review часть) | Анализ существующего кода |
| **Code Simplifier** | `code-simplifier:code-simplifier` | Рефакторинг существующего кода |
| **Marketing execution** | `general-purpose` пишущий конкретные тексты лендинга / email / soc / ads (с `landing-page-generator`/`copywriting`/`email-sequence`/`ad-creative` skills) | Производство контента по бренду |
| **Workspace admin** | `cs-workspace-admin` | Конкретные команды gws CLI |
| **Quick search** | `Explore` | Быстрый поиск кода (для глубокого анализа — `feature-dev:code-explorer` opus) |

### Context-dependent

| Агент | Когда Opus | Когда Sonnet |
| --- | --- | --- |
| `general-purpose` | Research, brainstorming, audit | Имплементация по плану |
| `senior-prompt-engineer` skill | Дизайн нового prompt'а | Минорные правки existing prompts |
| `claude-api` skill | Архитектура AI-приложения | Скаффолдинг по принятой архитектуре |

---

## Эволюция этого документа

| Триггер | Что обновить |
| --- | --- |
| Новая роль появилась в команде | Section N + Содержание + Model-routing справочник |
| Скилл переехал между ролями | Соответствующая Section + Антипаттерны если поменялась модель |
| Появился новый MCP / agent / skill | Релевантная Section + при необходимости Model-routing справочник |
| Изменилась модель для группы | Model-routing справочник + соответствующие Sections + CLAUDE.md правило 5 |
| Активирована резервная роль (R1, R2, R3) | Переместить из Резервных в основные (Section 19, 20, 21) |
| Out-of-scope изменился | Section «Out of scope» |

После обновления — короткая запись в `CLAUDE.md` § «Текущий статус»
(правило **B**).
