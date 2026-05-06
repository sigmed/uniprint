# Client Portal — Gap analysis (vs User.png)

> Прочитано current `apps/client-portal/app/page.tsx`, `layout.tsx`, mocks.
> Source-of-truth для S1: `Docs/design/specs/client-portal-spec.md` + `Docs/design/references/User.png`.

## Что есть ✓

- AppShell с dark sidebar, nav (Главная / Мои заказы / Новый заказ)
- PageHeader «Здравствуйте, Иван» + accent «Иван»
- KPI 4 cards (responsive grid)
- Card «Последние заказы» с таблицей (8 rows, OrderStatusBadge, ChevronRight)
- Sticky form-card right (Type Select + Title Input + chips + Срок+Кол-во row + Upload zone + price-box gradient + 2 buttons)
- BR-04 callout в price-note
- MockBanner

## Что отсутствует / неверно ✗

### Layout / Navigation chrome
- ❌ RoleSwitcher отсутствует в body (см. S1.4)
- ❌ TopBar пустой (только hamburger на mobile + spacer + topbarRight=null) → wire crumbs + search + bell (см. S1.5)
- ❌ Sidebar nav не содержит «Каталог услуг» / «Документы» / «Поддержка» (out of S1 — backlog)

### Page header
- ❌ RoleTag «Клиент · ООО «Рассвет»» — отсутствует (см. S1.6)
- ✓ PageTitle «Здравствуйте, Иван» — match
- ✓ PageSub — match

### KPI (mocks → values mismatch)
- ❌ «Активные заказы» = `activeOrders.length` (живая агрегация, ~6+) → должно быть **3** (см. S1.3 mock fix)
- ❌ «В производстве» = `inProduction.length` → должно быть **2**
- ❌ «Расходы за месяц» = `monthlySpend` (sum всех orders) → должно быть **42 800 ₽**
- ❌ «Бонусный баланс» = 0 → должно быть **1 280 ₽**
- ❌ Все trends `flat` без текста → должны быть «+1 за неделю» / «готовность ≈ 78%» / «−12% к прошлому» / «истекает 01.07» (см. S1.8)

### Orders card
- ❌ Нет Tabs «Все/В работе/Готовы/Архив» в CardHead (см. S1.7)
- ❌ CardTitle «Последние заказы» — без count badge «12»
- ❌ Order meta = `{ORDER_TYPE_LABELS[type]} · {count} шт` (generic) → должно быть `люверсы, ПВХ 440 г/м²` / `90×50 мм · 4+4 · ламинация` etc (см. S1.9)
- ❌ Order titles в mock — generic procedural (`Баннер 5×3 м`) → должны быть specific (Баннер 3×1 м UNI-00001, Визитки 200 шт UNI-00002, etc) (см. S1.2)
- ❌ CardFooter «Смотреть все» — стиль кнопки match? Reference показывает «Все заказы →» в right header
- ❌ Status pills color сейчас от OrderStatusBadge tokens — match references

### Form-card
- ❌ Field «Срок» = `<Input type="date">` → должен быть Select с options [Стандарт (3–5 дн.), Срочно (24 ч)] (см. S1.10)
- ✓ Form-icon, title, chips, price-box, BR-04 — match
- ❌ Submit button hover handler через onMouse — это будет cleanup в S7.4 (BigButton pattern)

### Mocks (cli_001 — primary B2B клиент)
- ❌ `cli_001` в текущем fixture = isB2b? `i % 3 === 0` → cli_001 (i=0) — да, B2B, name = «ООО «Пример-1»» → должно быть **«ООО «Рассвет»»** (см. S1.3)
- ❌ Order type поле `metaText` отсутствует в Order типе — нужно добавить optional field

## План S1 (13 tasks)

S1.2 → mock orders 8 шт UNI-00001..00008 + metaText
S1.3 → cli_001 = ООО «Рассвет» + KPI baseline values
S1.4 → RoleSwitcher
S1.5 → TopBar wire
S1.6 → RoleTag
S1.7 → Tabs в orders card
S1.8 → KPI trend texts hardcoded
S1.9 → Order meta render через `o.metaText ?? fallback`
S1.10 → Срок Select + upload zone hint
S1.11 → pipeline
S1.12 → screenshots
S1.13 → diff vs User.png + commit
