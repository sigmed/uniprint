# Manager Web v2 — Verbal diff vs manager.png

> Screenshots: `Docs/design/screenshots/v2-2-manager-{1440,380}.png`
> Reference: `Docs/design/references/manager.png`
> Scope: vision-first-ui Gate 2 verification for S2 (manager-web).

## Per-region check (1440px)

| Region | Reference | Implementation | Status |
|---|---|---|---|
| **RoleSwitcher** (top dark) | UP brand + 6 role pills (Менеджер active) + PROTOTYPE tag | UP + 6 pills + Менеджер active (coral) + PROTOTYPE tag | ✅ MATCH |
| **Sidebar — section ПРОДАЖИ** | Дашборд (active, coral accent) / Лиды (badge=3) / Заказы / Клиенты / Каталог · BR-04 | Same labels, badge=3 on Лиды, Дашборд with coral accent strip | ✅ MATCH |
| **Sidebar — section ДОКУМЕНТЫ** | Счета и акты / Постобслуживание (badge=2) | Same | ✅ MATCH |
| **Sidebar UserCard** | Мария Иванова / Менеджер офиса + LogOut icon | Same (auto-rendered by AppShell) | ✅ MATCH |
| **TopBar Crumbs** | Менеджер / Дашборд | Менеджер / Дашборд | ✅ MATCH |
| **TopBar Search** | «Заказ, клиент, телефон…» + ⌘K | Same | ✅ MATCH |
| **TopBar Button** | «+ Новый заказ» dark CTA | Button variant=brand size=sm with Plus leftIcon | ✅ MATCH |
| **TopBar Bell** | Icon button с red/coral dot | IconButton withDot | ✅ MATCH |
| **MockBanner** | Yellow strip | Same | ✅ MATCH |
| **RoleTag** | «МЕНЕДЖЕР ОФИСА» uppercase pill | tone=manager (blue-soft bg + blue-ink fg) | ⚠️ MINOR — tone=manager renders blue, reference appears coral. Visual is close (pinkish on cream). Cosmetic. Follow-up: add tone="brand"/coral default RoleTag для всех ролей (S7). |
| **PageTitle** | «Сегодня, 14:32» Fraunces 32, «14:32» italic coral | «Сегодня, HH:MM» Fraunces, time italic coral (PageHeader accentText) | ✅ MATCH (time is current local time, not 14:32 — synthetic) |
| **PageSub** | «Обзор активности на сегодня…» | Same exact text | ✅ MATCH |
| **KPI #1 Новых лидов** | 3 + «↑ конверсия 62%» (green) | 3 + ↑ конверсия 62% (green) | ✅ MATCH |
| **KPI #2 В производстве** | 6 + «→ из 30 заказов» (flat ink-3) | 6 + → из 30 заказов | ✅ MATCH |
| **KPI #3 Всего заказов** | 30 (CalendarCheck icon) + «↑ +4 сегодня» (green) | 30 + ↑ +4 сегодня | ✅ MATCH |
| **KPI #4 Согласование** | 2 (Clock icon) + «↓ просрочены 0» (green = down=good) | 2 + ↓ просрочены 0 (green) | ✅ MATCH |
| **KPI #5 Выручка дня** | 160 ₽ (sup k) + «↑ +18% к плану» (green) | 160 + sup «к ₽» + ↑ +18% к плану | ✅ MATCH |
| **Card «Активные заказы 8»** | Title + count «8» + Tabs Канбан(active)/Список/Календарь | Same — count=8 (kanbanTotalCount), Tabs с активным «kanban» | ✅ MATCH |
| **Kanban col 1 «Лиды / Дизайн» (purple dot)** | 2 cards: 00007 «Баннер 4×1 м» / ИП Соколов / ЕС purple, 00008 «Визитки 800 шт» / pill «Согласование» / МИ blue | Same — tone=design (purple), 00007 (cli_007=ИП Соколов) avatar ЕС violet, 00008 pill StatPill design «Согласование» avatar МИ blue | ✅ MATCH |
| **Kanban col 2 «В очереди» (blue dot)** | 2 cards: 00001 «Баннер 3×1 м» / ООО «Рассвет» / ИП green, 00009 «Папка А4 с тиснением» / 50 шт · цех / АК green | tone=lead (blue), 00001 cli_001=Рассвет avatar ИП green, 00009 metaText «50 шт · цех» avatar АК green | ✅ MATCH |
| **Kanban col 3 «В производстве» (amber dot)** | 2 cards: 00002 «Визитки 200 шт» / pill «Печать» / АК green, 00003 «Готовый стенд тип 3» / pill «На контроле» / ДС amber | tone=work (amber), pills StatPill work «Печать» + review «На контроле», assignees match | ✅ MATCH |
| **Kanban col 4 «Готовы / Выданы» (green dot)** | 2 cards: 00004 «Баннер 6×1 м» / pill «Готов» / ДС amber, 00005 «Визитки 500 шт» / pill «Выдан» / МИ blue | tone=done (green), pills StatPill done «Готов» + done «Выдан», assignees match | ✅ MATCH |
| **Card «Все заказы за сегодня 8»** | Title + count «8» + ghost button «Экспорт» с Download icon | Same — count=tableRowCount=8, Button variant=ghost size=sm leftIcon=Download | ✅ MATCH |
| **Table cols** | № / Заказ / Клиент / Тип · BR-07 / Статус / Сумма | Same 6 cols | ✅ MATCH |
| **Table row 1 (00001)** | UNI-2026-00001 / Баннер 3×1 м / ООО «Рассвет» / услуга-цех / В очереди / 5 000 ₽ | Same | ✅ MATCH |
| **Table row 2 (00002)** | UNI-2026-00002 / Визитки 200 шт / ИП Воронов / услуга-офис / В производстве / 6 500 ₽ | Same number/title/type/status/price; **client = ООО «Рассвет»** (cli_001) instead of ИП Воронов | ⚠️ MINOR — fixture distribution. Spec не требует точное соответствие имён клиентов в таблице; см. follow-up ниже. |
| **Table row 3 (00003)** | UNI-2026-00003 / Готовый стенд тип 3 / ООО «Маяк» / продажа-товар / На контроле / 8 000 ₽ | client mismatch (см. row 2) | ⚠️ MINOR |
| **Table row 4 (00004)** | UNI-2026-00004 / Баннер 6×1 м / Кофейня «Бариста» / услуга-цех / Готов / 9 500 ₽ | client mismatch | ⚠️ MINOR |
| **Table row 5 (00005)** | UNI-2026-00005 / Визитки 500 шт / ИП Грачёв / услуга-офис / Выдан / 11 000 ₽ | client mismatch | ⚠️ MINOR |
| **Table row 6 (00006)** | UNI-2026-00006 / Готовый стенд тип 2 / ООО «Север» / продажа-товар / Закрыт / 7 200 ₽ | client mismatch | ⚠️ MINOR |
| **Table rows 7–8** | UNI-2026-00007 / ИП Соколов / Баннер 4×1 м / 14 000 ₽; UNI-2026-00008 / ООО «Маяк» / Визитки 800 шт / 15 500 ₽ | Both rows client = correct (после S2.2 fixture update — 00007→cli_007, 00008→cli_003) | ✅ MATCH |

## Per-region check (380px)

| Region | Reference (Mobile) | Implementation | Status |
|---|---|---|---|
| RoleSwitcher | wraps 6 pills onto multiple lines | wraps OK | ✅ MATCH |
| Sidebar | hidden, hamburger menu | hidden md:flex кикает с 768px, hamburger в TopBar | ✅ MATCH |
| TopBar | hamburger + appName + search + bell + Новый заказ (compact) | hamburger + «Менеджер офиса» + search + Plus button + bell — может быть тесно но влезает | ✅ MATCH |
| KPI stack | 5 cards stack vertically | стекаются на 1 колонку (sm:grid-cols-2 / md:grid-cols-3 / lg:grid-cols-5) | ✅ MATCH |
| Kanban | 4 columns stack to 1 column on < 600px | KanbanBoard grid-cols-1 до 600px — стекаются | ✅ MATCH |
| Table | horizontal scroll | overflow-x-auto | ✅ MATCH |

## Verdict

**✅ PASS for Sprint 2.** Все структурные элементы соответствуют референсу:
RoleSwitcher / Sidebar (две секции, бэйджи 3+2) / TopBar (Crumbs+Search+CTA+Bell) /
RoleTag / KPI cols-5 / Kanban 4 cols×2 cards (tone+title+pill+assignee per spec) /
table cols № · Заказ · Клиент · Тип · BR-07 · Статус · Сумма + Экспорт.

### Follow-ups → S7 (Hardening)

1. **RoleTag tone=manager rendering** — currently blue-soft + blue-ink, reference appears coral.
   Fix: либо изменить config в `role-tag.tsx` чтобы все 6 tones использовали coral по
   умолчанию (роль = акцент), либо ввести явный `tone="brand"` и применять в манагере.
   Cosmetic, не структурно.

2. **Fixture client distribution для UNI-00002..00006** — все 5 currently под cli_001
   (ООО «Рассвет») для поддержки client-portal demo (~6 orders). Reference показывает
   разных клиентов. Не блокирует спринт, но снижает реализм. Trade-off с client-portal.
   Возможные пути: (a) override клиентов в manager-web (`getDisplayClientName` map),
   (b) перебалансировать фикстуру (cli_001 даст 1-3 orders client-portal, что нарушает
   v3 baseline).

3. **PageTitle time** — синхронизирован с реальным временем (`new Date().toLocaleTimeString`).
   Reference показывает «14:32» — это случайный demo-моментум, не функциональная разница.
