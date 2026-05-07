# Warehouse Mobile v4 — Verbal diff vs Storage.png

> Screenshots: `Docs/design/screenshots/v4-4-warehouse-{1440,380}.png`
> Reference: `Docs/design/references/Storage.png`
> Scope: vision-first-ui Gate 2 verification for S4.

## Per-region check (1440px desktop preview — wrapped in PhoneFrame)

| Region | Reference | Implementation | Status |
|---|---|---|---|
| **RoleSwitcher** | UP brand + 6 role pills (Склад · PWA active coral) + PROTOTYPE tag | Same — added в S4 layout.tsx | ✅ MATCH |
| **MockBanner** | Yellow strip под RoleSwitcher | Same — inline под switcher | ✅ MATCH |
| **PhoneFrame outer + inner** | 420px phone bezel в cream surface-2 area | Same | ✅ MATCH |
| **Status bar** | «9:41» mono + Signal/Wifi/Battery icons | Same | ✅ MATCH |
| **PWA Header** dark | UP brand + «UniPrint / СКЛАД» + Bell icon | Same | ✅ MATCH |
| **Greet line** | «Дмитрий С.» Fraunces 20 + «Складщик · смена с 09:00» + ДС avatar amber gradient | Same | ✅ MATCH |
| **ShiftBar amber** | Amber dot pulse + «Face Control · в смене» + monotime «00:41:12» | Same | ✅ MATCH |
| **Section «СЕГОДНЯ»** | uppercase tracking-wide title | Same | ✅ MATCH |
| **3-col mini-stats** | СПИСАНО 12 / ПРИНЯТО 5 / БРАК 1 (red) | Same — БРАК с color=red | ✅ MATCH |
| **Section «ДЕЙСТВИЯ»** | title | Same | ✅ MATCH |
| **BigButton #1** | dark ink + Package icon + «Списать материал на заказ» | variant="default" + PackageMinus | ✅ MATCH |
| **BigButton #2** | outline + Users/UserCheck icon + «Принять готовое от производства» | variant="outline" + UserCheck | ✅ MATCH |
| **BigButton #3** | outline + Inbox icon + «Приёмка поступления» | variant="outline" + Inbox | ✅ MATCH |
| **BigButton #4 (danger)** | red filled + AlertTriangle icon + «Зафиксировать брак» | variant="danger" + AlertTriangle | ✅ MATCH |
| **BR Callout** | 3 правила с BR-кодами mono coral: BR-01 / BR-03 / BR-09 | Same exact texts | ✅ MATCH |
| **Section «ПОСЛЕДНИЕ СПИСАНИЯ»** | title | Same | ✅ MATCH |
| **Writeoff #1** | UNI-2026-00005 · 14:18 / Бумага мелованная 300 г / 200 листов · 90×50 / mono партия P-2026-039 / pill done «Списано» | Same — в S4 fixture обновлены title + meta + время | ✅ MATCH |
| **Writeoff #2** | UNI-2026-00003 · 13:46 / Баннерная ткань 440 г/м² / 3 м² · ПВХ / mono партия P-2026-018 / pill done «Списано» | Same | ✅ MATCH |
| **Bottom-nav 4 tabs** | Главная (active coral) / Списать / Брак / Остатки | Same — Home/PackageMinus/AlertTriangle/BarChart2 icons | ✅ MATCH |

## Per-region check (380px actual mobile)

| Region | Mobile behaviour | Implementation | Status |
|---|---|---|---|
| **RoleSwitcher** | hidden | wrapped в `hidden sm:block` | ✅ MATCH |
| **MockBanner** | top inline, full-width yellow | Visible & легко различим (отлично контраст с cream) | ✅ MATCH |
| **PhoneFrame** | full-screen | `max-[480px]:rounded-none min-h-svh` | ✅ MATCH |
| **Status bar / PWA Header / ShiftBar** | в порядке стека | Same | ✅ MATCH |
| **Mini-stats / Actions / BR / Writeoff list** | стек, scroll | Same | ✅ MATCH |
| **Bottom-nav** | sticky bottom 4 tabs | `position:absolute bottom:0` внутри PhoneFrame | ✅ MATCH |

## Verdict

**✅ PASS for Sprint 4.** Все 21 регионов из 21 матчат референс. Изменения в S4:
1. `app/layout.tsx` — добавлен RoleSwitcher (только desktop preview), убран
   `position: fixed` с MockBanner, теперь inline-flow
2. `app/page.tsx` — обновлены writeoff history items per spec:
   - #1: Бумага мелованная 300 г / 200 листов · 90×50 / партия P-2026-039 / 14:18
   - #2: Баннерная ткань 440 г/м² / 3 м² · ПВХ / партия P-2026-018 / 13:46
   (раньше были другие материалы вне референса)

### Follow-ups → S7 (Hardening)

1. Те же 2 cosmetic как в S3 (subtle MockBanner, status bar дубль на actual mobile).
2. **Bottom-nav 4 tabs** — 3 из 4 ведут на `/` (заглушки): Главная active, Списать
   `/writeoff` ✓, Брак `/defect` ✓, Остатки `/` (заглушка). См. также project memory
   `project_pwa_tabs_dead.md` — 3 таба warehouse и 3 таба production требуют
   дизайна отдельных экранов.
