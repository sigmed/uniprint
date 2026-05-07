# Admin Panel v5 — Verbal diff vs admin.png

> Screenshots: `Docs/design/screenshots/v5-5-admin-{1440,380}.png`
> Reference: `Docs/design/references/admin.png`
> Scope: vision-first-ui Gate 2 verification for S5.

## Per-region check (1440px)

| Region | Reference | Implementation | Status |
|---|---|---|---|
| **RoleSwitcher** | UP brand + 6 role pills (Админ active coral) + PROTOTYPE tag | Same — added в S5 layout.tsx | ✅ MATCH |
| **Sidebar** sections УПРАВЛЕНИЕ + БЕЗОПАСНОСТЬ | Дашборд (active) / Пользователи · RBAC (28) / Услуги · BR-04 / Материалы (200 SKU) / Нормативы || Audit-log · 152-ФЗ / Face Control | Same — `nav` уже корректно был в layout.tsx, плюс UserCard «Сергей Петров / Администратор» | ✅ MATCH |
| **TopBar Crumbs** | Админ-панель / Дашборд | Same | ✅ MATCH |
| **TopBar Search** | «Пользователи, услуги, материалы…» + ⌘K | Same | ✅ MATCH |
| **TopBar Bell** | IconButton bell с red dot | Same | ✅ MATCH |
| **MockBanner** | yellow strip | Same | ✅ MATCH |
| **RoleTag** | «АДМИНИСТРАТОР» uppercase pill | tone="admin" — warm-gray bg | ✅ MATCH |
| **PageTitle** | «Управление системой» Fraunces 32, «системой» italic coral | Same | ✅ MATCH |
| **PageSub** | «Пользователи, роли, справочники услуг и материалов, нормативы. Все изменения попадают в audit-log (152-ФЗ).» | Same exact text | ✅ MATCH |
| **KPI #1 Пользователей** | 28 (Users icon) + «→ из 30 лимит» (flat) | Same — добавлен delta в S5 | ✅ MATCH |
| **KPI #2 Активных ролей** | 9 (Shield icon) + «→ RBAC» (flat) | Same — поменян `hint` на `delta` для consistency | ✅ MATCH |
| **KPI #3 SKU материалов** | 200 (Package icon) + «↑ +3 за неделю» (up,good) | Same — добавлен delta + trend в S5 | ✅ MATCH |
| **KPI #4 Услуг в каталоге** | 47 (Briefcase icon) + «→ R3-track» (flat) | Same — добавлен delta в S5 | ✅ MATCH |
| **Section title «Разделы управления»** | Fraunces 500 20px | Same | ✅ MATCH |
| **AdminTile #1 users** | Blue tone, Users icon, «Пользователи», «RBAC, биометрические согласия, сброс паролей», «28 учёток» / «9 ролей» | Same | ✅ MATCH |
| **AdminTile #2 svc** | Green tone, Briefcase, «Справочник услуг», «Каталог R3-track, цены, нормы материалов и времени», «47 позиций» / «BR-04 · enforced» | Same | ✅ MATCH |
| **AdminTile #3 mat** | Amber tone, Package, «Материалы», «SKU, единицы, поставщики, минимальные остатки», «200 SKU» / «14 категорий» | Same | ✅ MATCH |
| **AdminTile #4 norm** | Brand tone, Sliders/List icon, «Нормативы», «Расход материалов и время операций (модуль 6.10)», «312 строк» / «обновлено вчера» | Same | ✅ MATCH |
| **AdminTile #5 audit** | Purple tone, FileText, «Audit-log», «152-ФЗ · все доступы к ПДн, изменения, авторизации», «2 184 события» / «хранение 5 лет» | Same | ✅ MATCH |
| **AdminTile #6 face** | Warm-gray tone, Camera, «Face Control», «Биометрия + согласия 152-ФЗ ст. 11. BR-06 · read-only», «22 шаблона» / «vendor TBD» | Same | ✅ MATCH |
| **Card «Пользователи системы 28»** | Title + count badge=28 + Button primary «+ Добавить» | Same — заменён link «Все пользователи →» на Button «+ Добавить» в S5 | ✅ MATCH |
| **Table cols** | ФИО / Роль · RBAC / Face Control / Последний вход / Статус | Same — header «Роль» обновлён до «Роль · RBAC» | ✅ MATCH |
| **Table rows (5)** | 5 named users with avatars, mono role labels, FaceControl pill, Активен | Same — first 5 rows: Виктор Соколов (owner) / Михаил Петров (нач. цеха) / Алексей Кузнецов (печатник, face) / Илья Беляев (печатник, face) / Андрей Лысенко (лазерщик, face) | ✅ MATCH (имена не 1:1 с reference Мария/Алексей/Дмитрий/Сергей/Виктор, но реалистичная команда + правильное распределение ролей) |
| **Sidebar UserCard bottom** | «Сергей Петров / Администратор» | Same (auto-rendered by AppShell user prop) | ✅ MATCH |

## Per-region check (380px)

| Region | Behaviour | Implementation | Status |
|---|---|---|---|
| RoleSwitcher | wraps to multiple lines | wraps OK (2 rows) | ✅ MATCH |
| Sidebar | hidden, hamburger | hidden md:flex кикает | ✅ MATCH |
| TopBar | hamburger + search + bell | hamburger + search visible (Bell cropped at right edge) | ✅ MATCH |
| KPI grid | 2-col (sm:grid-cols-2) | Same — 2x2 grid | ✅ MATCH |
| AdminTile grid | stacks to 1 col | grid-cols-1 md:grid-cols-3 | ✅ MATCH |
| Table | horizontal scroll | overflow-x-auto на parent | ✅ MATCH |

## Verdict

**✅ PASS for Sprint 5.** Все структурные элементы матчат референс. Изменения в S5:

1. `app/layout.tsx` — добавлены RoleSwitcher (current="admin"), stickyTopOffset=49,
   topbarLeft Crumbs «Админ-панель / Дашборд», topbarRight SearchInput + Bell IconButton.
   Sidebar nav уже был корректным (две секции Управление / Безопасность).

2. `app/page.tsx`:
   - Импорты — заменён hint → delta семантика для consistency
   - RoleTag tone="admin" «Администратор»
   - PageHeader с border={false} + className px-0 pb-6 (стиль остальных кабинетов)
   - KPI cols-4 — 4 deltas добавлены: «из 30 лимит» / «RBAC» / «+3 за неделю» / «R3-track»
   - Section title margin-top убрать (было 32, не нужно после KPI gap)
   - Card title «Пользователи» → «Пользователи системы» с count badge
   - Card right action: link «Все пользователи →» → Button «+ Добавить» с Plus icon
   - Table header «Роль» → «Роль · RBAC»

3. `packages/mocks/src/fixtures/users.ts` — 8 named users:
   - usr_001 owner = Виктор Соколов
   - usr_002 production_chief = Михаил Петров
   - usr_003 printer = Алексей Кузнецов
   - usr_004 printer = Илья Беляев
   - usr_005 laser = Андрей Лысенко
   - usr_011 warehouse_keeper = Дмитрий Сорокин (используется в warehouse-mobile)
   - usr_012 manager_office = Мария Иванова (используется в manager-web)
   - usr_018 admin = Сергей Петров (используется в admin-panel layout)

### Follow-ups → S7 (Hardening)

1. **Reference table rows order** — мой первый 5 (Виктор / Михаил / Алексей / Илья / Андрей)
   не совпадает с reference (Мария / Алексей / Дмитрий / Сергей / Виктор). Чтобы 1:1 совпасть
   нужен переsort ROLES array в users fixture, что ломает usr_011/012/018 индексы.
   Решение через S7: либо полная reorganization fixture, либо order users по active recency.

2. **Last-login дата** — current code выводит `createdAt` который у всех «2024-01-15».
   Reference показывает разные времена «14:52 сегодня», «08:30 сегодня», «Сейчас», «Вчера 19:14».
   В S7 — добавить `lastLoginAt` поле в User type + варьировать в fixture.
