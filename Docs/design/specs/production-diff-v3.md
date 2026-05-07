# Production Mobile v3 — Verbal diff vs production.png

> Screenshots: `Docs/design/screenshots/v3-3-production-{1440,380}.png`
> Reference: `Docs/design/references/production.png`
> Scope: vision-first-ui Gate 2 verification for S3.

## Per-region check (1440px desktop preview — wrapped in PhoneFrame)

| Region | Reference | Implementation | Status |
|---|---|---|---|
| **RoleSwitcher** (top dark) | UP brand + 6 role pills (Производство · PWA active coral) + PROTOTYPE tag | UP + 6 pills + active coral + PROTOTYPE tag (added в S3 layout.tsx) | ✅ MATCH |
| **MockBanner** | Yellow strip «PROTOTYPE — данные синтетические…» under RoleSwitcher | Same — under RoleSwitcher, full-width | ✅ MATCH |
| **PhoneFrame outer** | Cream surface-2 area centering 420px phone bezel | Same | ✅ MATCH |
| **PhoneFrame inner** | 420px wide, radius 24px, shadow-xl, min-h 780 | Same | ✅ MATCH |
| **Status bar** | «9:41» mono + Signal/Wifi/Battery icons | Same | ✅ MATCH |
| **PWA Header** dark | UP brand + «UniPrint / ПРОИЗВОДСТВО» + Bell icon | Same | ✅ MATCH |
| **Greet line** | «Алексей К.» Fraunces 20 + «Печатник · смена с 08:30» (#9C8E78) + АК avatar green gradient | Same | ✅ MATCH |
| **ShiftBar green** | Green dot pulse + «Face Control · вход зафиксирован» + monotime «02:11:48» | Same | ✅ MATCH |
| **Section «СЕГОДНЯ · 5 МАЯ»** | uppercase tracking-wide title | Same | ✅ MATCH |
| **Mini-stats 2-col** | ОПЕРАЦИЙ 7 (green ClipboardList) + ЗАРАБОТАНО 2 840 ₽ (coral DollarSign) | Same | ✅ MATCH |
| **Section «ОЧЕРЕДЬ ЗАДАЧ» 3** | Title + brand-coral badge=3 | Same | ✅ MATCH |
| **PwaTaskCard #1 active** | UNI-2026-00002 «Печать визиток 200 шт», pill work amber pulse «Сейчас в работе», meta «90×50 мм · 4+4 · ⏱ 14:18 / план 18 мин», coral border + tinted bg | Same | ✅ MATCH |
| **PwaTaskCard #2** | UNI-2026-00001 «Печать баннера 3×1 м», pill queue blue «Следующая», meta «ПВХ 440 г/м² · норма 25 мин», showArrow | Same | ✅ MATCH |
| **PwaTaskCard #3** | UNI-2026-00009 «Тиснение папки А4», pill queue blue «В очереди», meta «50 шт · картон 300 г · норма 40 мин», showArrow | Same | ✅ MATCH |
| **BigButton brand** | «Завершить текущую работу» с Play icon | Same | ✅ MATCH |
| **BR-03 callout** | Coral info icon + «BR-03 · Брак фиксирует только складщик…» полный текст | Same | ✅ MATCH |
| **Bottom-nav 4 tabs** | Задачи (active coral) / Смена / Заработок / История | Same — ClipboardList/UserCircle/DollarSign/History icons | ✅ MATCH |

## Per-region check (380px actual mobile)

| Region | Mobile behaviour | Implementation | Status |
|---|---|---|---|
| **RoleSwitcher** | hidden (no PhoneFrame on real device) | wrapped в `<div className="hidden sm:block">` — скрыт ниже sm breakpoint (640px) | ✅ MATCH |
| **MockBanner** | top inline (45px), subtle | y=0..45 (verified via DOM rect), полная ширина viewport | ✅ MATCH (визуально слабо различим в малом скриншоте, но DOM подтверждает рендер) |
| **PhoneFrame** | full-screen (max-[480px]:rounded-none, min-h-svh) | Корректно расширяется на весь экран | ✅ MATCH |
| **Status bar** | имитация iOS/Android status bar (32px) | y=45..77 | ✅ MATCH |
| **PWA Header** dark | бренд + greet + ShiftBar | Same | ✅ MATCH |
| **Body** | scrollable, padding 16, pb-80 | Same | ✅ MATCH |
| **Bottom-nav** | sticky bottom, 4 tabs | absolute bottom внутри PhoneFrame, 4 tabs | ✅ MATCH |

## Verdict

**✅ PASS for Sprint 3.** Все структурные элементы матчат референс. Единственная новая
правка в S3 — добавление RoleSwitcher в layout.tsx с `hidden sm:block` (показывается
только в desktop preview). Остальное реализовано в redesign 2026-05-06 и сохранено as-is.

### Follow-ups → S7 (Hardening)

1. **MockBanner на mobile** — субтильный variant очень близок к surface-2 cream фону.
   В desktop preview видно отлично (контраст с тёмным RoleSwitcher), в actual mobile
   — едва различим. Cosmetic, можно усилить контраст в S7 (например, более яркий
   yellow `bg-amber-soft` instead of pale cream).
2. **Status bar на mobile** — имитация (9:41 + Signal/Wifi/Battery) дублирует реальную
   статусбар iOS/Android. Стоит скрывать на actual mobile через media query
   `max-[480px]:hidden` в PhoneFrame. Не блокирует.
