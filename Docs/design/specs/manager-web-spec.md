# Manager Web · Spec из manager.png

> Reference: `Docs/design/references/manager.png`
> App: `prototype/apps/manager-web/`

## Layout (top → bottom)

1. **RoleSwitcher** (sticky top, dark)
2. **TopBar** (sticky top-49, 62px):
   - Crumbs: `Менеджер / Дашборд`
   - SearchInput: «Заказ, клиент, телефон…» + ⌘K
   - Button primary «+ Новый заказ»
   - IconButton bell (с red dot)
3. **MockBanner**
4. **PageHead** (padding 30px):
   - RoleTag manager tone: «Менеджер офиса»
   - PageTitle Fraunces 32 «Сегодня, 14:32» — em accent «14:32» italic coral
   - PageSub: «Обзор активности на сегодня — лиды, заказы, согласования. Уведомления приходят через WebPush + Email.»
5. **Stats grid (cols-5)**:
   - «Новых лидов» 3 + trend «конверсия 62%» (up,good)
   - «В производстве» 6 + trend «из 30 заказов» (flat)
   - «Всего заказов» 30 (CalendarCheck icon) + trend «+4 сегодня» (up,good)
   - «Согласование» 2 (Clock icon) + trend «просрочены 0» (down,good)
   - «Выручка дня» 160 ₽ (sup k) + trend «+18% к плану» (up,good)
6. **Card «Активные заказы 8»** (margin-bottom 18):
   - Tabs right: Канбан(active) / Список / Календарь
   - **Kanban 4 cols** (gap 14):
     - Col 1 «Лиды / Дизайн» 2:
       - UNI-00007 «Баннер 4×1 м» / ИП Соколов / avatar ЕС purple
       - UNI-00008 «Визитки 800 шт» / StatPill design «Согласование» / avatar МИ blue
     - Col 2 «В очереди» 2 (blue dot):
       - UNI-00001 «Баннер 3×1 м» / ООО «Рассвет» / avatar ИП green
       - UNI-00009 «Папка А4 с тиснением» / 50 шт · цех / avatar АК green
     - Col 3 «В производстве» 2 (amber dot):
       - UNI-00002 «Визитки 200 шт» / StatPill work «Печать» / avatar АК green
       - UNI-00003 «Готовый стенд тип 3» / StatPill review «На контроле» / avatar ДС amber
     - Col 4 «Готовы / Выданы» 2 (green dot):
       - UNI-00004 «Баннер 6×1 м» / StatPill done «Готов» / avatar ДС amber
       - UNI-00005 «Визитки 500 шт» / StatPill delivered «Выдан» / avatar МИ blue
7. **Card «Все заказы за сегодня 8»**:
   - Header right: Button ghost + Download icon «Экспорт»
   - Table cols: № | Заказ (name only) | Клиент | Тип · BR-07 (mono span) | Статус (StatPill) | Сумма (right)
   - 8 rows матчат Kanban orders + UNI-00006 «Готовый стенд тип 2» / ООО «Север» / продажа-товар / closed «Закрыт» / 7 200 ₽

## User context

- Name: Мария Иванова
- Role: Менеджер офиса
- Avatar tone: blue, initials «МИ»

## Sidebar nav

- Section «Продажи»: Дашборд (active), Лиды (badge=3), Заказы, Клиенты, Каталог · BR-04
- Section «Документы»: Счета и акты, Постобслуживание (badge muted=2)
