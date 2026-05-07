# Admin Panel · Spec из admin.png

> Reference: `Docs/design/references/admin.png`
> App: `prototype/apps/admin-panel/`

## Layout (top → bottom)

1. **RoleSwitcher** (sticky top, dark)
2. **TopBar** (sticky top-49, 62px):
   - Crumbs: `Админ-панель / Дашборд`
   - SearchInput: «Пользователи, услуги, материалы…» + ⌘K
   - IconButton bell
3. **MockBanner**
4. **PageHead** (padding 30px):
   - RoleTag admin tone: «Администратор»
   - PageTitle Fraunces 32 «Управление системой» — em accent «системой» italic coral
   - PageSub: «Пользователи, роли, справочники услуг и материалов, нормативы. Все изменения попадают в audit-log (152-ФЗ).»
5. **Stats grid (cols-4)**:
   - «ПОЛЬЗОВАТЕЛЕЙ» 28 (Users icon) + trend «из 30 лимит» (flat)
   - «АКТИВНЫХ РОЛЕЙ» 9 (Shield icon) + trend «RBAC» (flat)
   - «SKU МАТЕРИАЛОВ» 200 (Package icon) + trend «+3 за неделю» (up,good)
   - «УСЛУГ В КАТАЛОГЕ» 47 (Briefcase icon) + trend «R3-track» (flat)
6. **Section title** Fraunces 500 20px «Разделы управления» (margin-bottom 14)
7. **AdminTile grid (cols-3 gap 14)** — 6 tiles:
   - **users** (blue tone): Users icon + «Пользователи» + «RBAC, биометрические согласия, сброс паролей» + stats {left: «28 учёток», right: «9 ролей»}
   - **svc** (green tone): Briefcase icon + «Справочник услуг» + «Каталог R3-track, цены, нормы материалов и времени» + stats {«47 позиций», «BR-04 · enforced»}
   - **mat** (amber tone): Package icon + «Материалы» + «SKU, единицы, поставщики, минимальные остатки» + stats {«200 SKU», «14 категорий»}
   - **norm** (brand tone): Sliders icon + «Нормативы» + «Расход материалов и время операций (модуль 6.10)» + stats {«312 строк», «обновлено вчера»}
   - **audit** (purple tone): FileText icon + «Audit-log» + «152-ФЗ · все доступы к ПДн, изменения, авторизации» + stats {«2 184 события», «хранение 5 лет»}
   - **face** (warm-gray tone): Camera icon + «Face Control» + «Биометрия + согласия 152-ФЗ ст. 11. BR-06 · read-only.» + stats {«22 шаблона», «vendor TBD»}
8. **Card «Пользователи системы 28»**:
   - Header right: Button primary «+ Добавить»
   - Table cols: ФИО (avatar + name + email small) | Роль · RBAC (mono) | Face Control | Последний вход | Статус
   - 5 rows:
     - Сотрудник 1 / user1@uniprint.local / role «учредитель» / Face Control «—» / «14:52 сегодня» / StatPill done «Активен»
     - Сотрудник 2 / user2@uniprint.local / role «нач. цеха» / «—» / «08:30 сегодня» / Активен
     - Сотрудник 3 / user3@uniprint.local / role «печатник» / «Согласие · ст. 11» / «09:00 сегодня» / Активен
     - Сотрудник 4 / user4@uniprint.local / role «печатник» / «Согласие · ст. 11» / «Сейчас» / Активен
     - Сотрудник 5 / user5@uniprint.local / role «лазерщик» / «Согласие · ст. 11» / «Вчера 19:14» / Активен

## User context

- Name: Сергей Петров
- Role: Администратор
- Avatar tone: dark, initials «СП»

## Sidebar nav (with sections)

- Section «УПРАВЛЕНИЕ»:
  - Дашборд (active, LayoutDashboard icon)
  - Пользователи · RBAC (Users icon, badge=28)
  - Услуги · BR-04 (Briefcase icon)
  - Материалы (200 SKU) (Package icon)
  - Нормативы (Sliders icon)
- Section «БЕЗОПАСНОСТЬ»:
  - Audit-log · 152-ФЗ (FileText icon)
  - Face Control (Camera icon)

## BR-XX visible on screen

- BR-04: AdminTile «Справочник услуг» + stat «BR-04 · enforced»
- BR-06: AdminTile «Face Control» + sub «BR-06 · read-only»
- 152-ФЗ ст. 11: AdminTile «Face Control» + AdminTile «Audit-log»
