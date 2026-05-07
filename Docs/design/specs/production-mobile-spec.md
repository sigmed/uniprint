# Production Mobile (PWA) · Spec из production.png

> Reference: `Docs/design/references/production.png`
> App: `prototype/apps/production-mobile/`

## Layout (PhoneFrame wrapper для desktop preview, full-screen на mobile)

1. **RoleSwitcher** (только desktop, hidden sm:flex — mobile primary без него)
2. **PhoneFrame outer** (cream surface-2 background, padding 24px 0)
3. **PhoneFrame inner** (420px, radius 24px, shadow-xl, min-h 780):
   - **Status bar** (32px, #0E0A07 dark): «9:41» mono left + signal/wifi/battery icons right
   - **PWA Header** (var(--color-ink) bg, padding 14px 18px 16px):
     - Top row: brand-mini «UP UniPrint Производство» (Fraunces 16) + Bell icon
     - Greet line:
       - Left: «Алексей К.» Fraunces 20 medium + small «Печатник · смена с 08:30» (#9C8E78)
       - Right: avatar 40×40 round green gradient «АК»
     - **ShiftBar green** (margin-bottom -16, padding 10 18):
       - Dot 7×7 #8FBE5F + box-shadow + animation pulse-shift-green
       - Text «Face Control · вход зафиксирован» (#C5DDA8)
       - Right: monotime «02:11:48» #FAF6EF semibold
   - **Body** (padding 16 16 80, scroll):
     - Section title «СЕГОДНЯ · 5 МАЯ» (10.5px uppercase tracking-wide)
     - **2-col mini-stats** (gap 10):
       - «ОПЕРАЦИЙ» 7 + green icon (Check, green-soft bg + green-ink color)
       - «ЗАРАБОТАНО» 2 840₽ + coral icon (DollarSign, brand-soft bg + brand-2 color)
     - Section title «ОЧЕРЕДЬ ЗАДАЧ» + count badge brand 3
     - **3 PwaTaskCard**:
       - tone="active" (brand border + tinted bg #FFF7F1):
         - id «UNI-2026-00002», status pill work (amber pulse) «Сейчас в работе»
         - title «Печать визиток 200 шт»
         - meta «90×50 мм · 4+4 · ⏱ 14:18 / план 18 мин» (mono для timer)
       - tone="default":
         - id «UNI-2026-00001», status pill queue «Следующая»
         - title «Печать баннера 3×1 м»
         - meta «ПВХ 440 г/м² · норма 25 мин»
         - showArrow ChevronRight
       - tone="default":
         - id «UNI-2026-00009», status pill queue «В очереди»
         - title «Тиснение папки А4»
         - meta «50 шт · картон 300 г · норма 40 мин»
         - showArrow
     - **BigButton brand** (margin-top 14):
       - Play icon left
       - «Завершить текущую работу»
     - **BRCallout BR-03** (margin-top 14):
       - Info icon coral
       - «BR-03 · Брак фиксирует только складщик. Передайте изделие на склад через кнопку «Завершить»: складщик проверит качество и при необходимости зафиксирует брак.»
   - **Bottom-nav** (sticky bottom внутри PhoneFrame, 4 tabs):
     - Задачи (active, ListTodo icon)
     - Смена (Clock icon)
     - Заработок (DollarSign icon)
     - История (LayoutGrid icon)

## User context

- Name: Алексей Кузнецов
- Role: Печатник, смена с 08:30
- Avatar tone: green (#7AAB54 → #3F6E22 gradient), initials «АК»
- Face Control: зафиксирован, длительность 02:11:48

## BR-XX visible on screen

- BR-03: callout про fixation брака только складщиком
