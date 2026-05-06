# Warehouse Mobile (PWA) · Spec из Storage.png

> Reference: `Docs/design/references/Storage.png`
> App: `prototype/apps/warehouse-mobile/`

## Layout (PhoneFrame wrapper)

1. **RoleSwitcher** (только desktop, hidden sm:flex)
2. **PhoneFrame outer + inner** (как в production)
3. **Status bar 32px**: 9:41 + icons
4. **PWA Header** (var(--color-ink) bg):
   - Top row: brand-mini «UP UniPrint Склад» (Fraunces 16) + Bell icon
   - Greet line:
     - Left: «Дмитрий С.» Fraunces 20 + small «Складщик · смена с 09:00»
     - Right: avatar 40×40 amber gradient «ДС»
   - **ShiftBar amber**:
     - Dot 7×7 amber + animation pulse-shift-amber
     - Text «Face Control · в смене» (#E5BA70)
     - Right: monotime «00:41:12»
5. **Body**:
   - Section title «СЕГОДНЯ»
   - **3-col mini-stats** (compact, padding 10 12):
     - «СПИСАНО» 12
     - «ПРИНЯТО» 5
     - «БРАК» 1 (red color)
   - Section title «ДЕЙСТВИЯ»
   - **4 BigButton** (gap 10):
     - default ink: Package icon + «Списать материал на заказ»
     - outline: Users icon + «Принять готовое от производства»
     - outline: Inbox icon + «Приёмка поступления»
     - **danger** red: AlertTriangle icon + «Зафиксировать брак»
   - **BRCallout** (3 правила):
     - BR-01 · Материалы списываются только на конкретный заказ.
     - BR-03 · Брак фиксирует только складщик, не производство.
     - BR-09 · Списание FIFO — самая старая партия первой.
   - Section title «ПОСЛЕДНИЕ СПИСАНИЯ»
   - **2 PwaTaskCard** (writeoff history):
     - id «UNI-2026-00005» + время «14:18»
     - title «Бумага мелованная 300 г»
     - meta «200 листов · 90×50» + mono «партия P-2026-039»
     - StatPill done «Списано»
     - id «UNI-2026-00003» + время «13:46»
     - title «Баннерная ткань 440 г/м²»
     - meta «3 м² · ПВХ» + mono «партия P-2026-018»
     - StatPill done «Списано»
6. **Bottom-nav** (4 tabs):
   - Главная (active, Home icon)
   - Списать (Package icon)
   - Брак (AlertTriangle icon)
   - Остатки (BarChart3 icon)

## User context

- Name: Дмитрий Сорокин
- Role: Складщик, смена с 09:00
- Avatar tone: amber (#D9A84A → #A06C18 gradient), initials «ДС»
- Face Control: в смене, длительность 00:41:12

## BR-XX visible on screen

- BR-01: callout про списания только на заказ
- BR-03: callout про брак только складщиком
- BR-09: callout про FIFO partii списание
