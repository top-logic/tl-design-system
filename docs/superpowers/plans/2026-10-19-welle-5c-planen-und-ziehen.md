# Welle 5c · Planen und Ziehen — Umsetzungsplan (#29906)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Kalender, Kanban, Dashboard und Werteliste lesen das Paket; ihre fünf Blöcke (631 Zeilen) fallen aus
`tlReactControls.css`.

**Architecture:** Das Paket bekommt die gefüllten Kategorie-Rollen (`category-N-surface`, gerechnete Schrift, `derive`)
und die Blöcke `tl-calendar`, `tl-board`, `tl-dashboard`, `tl-value-list`, `tl-drop-hint`, dazu Zellregeln in
`table.css`. In der Engine wird Gemeinsames zusammengelegt (Interaktiv-Prüfung, Auswahl-Hook, Name → Kategorie, Schrift
auf Datenfarbe, Ablehnungshinweis); danach ziehen Werteliste, Dashboard, Kanban und Kalender um.

**Tech Stack:** Paket: CSS, `node --test`, `tools/*.mjs`, Chrome über CDP. Engine: React/TSX über `tl-react-bridge`,
TypeScript, Vite, Java 17, Maven, Vitest im MUI-Modul.

**Spec:** `docs/superpowers/specs/2026-10-19-welle-5c-planen-und-ziehen-design.md` (freigegeben 19.10.); Begründungen in
`docs/skalen.md` „Welle 5c: Planen und Ziehen“; Prognose in `docs/migration/altlast.md` „Welle 5“ (V5, V6, V8, V12,
V19, V20, V21, V23–V30). Bestand: Scratchpad-Notiz `5c-inventory.md` (nur Orchestrator).

**Plan-Review** 19.10. durch einen frischen Agenten (Fable), Probelauf von Task 1 in einer Paketkopie (`generate`, Lint
grün; `node --test` 533/555 mit vier erwarteten Brüchen), `ALT_5C` gegen 1378 Engine-Quellen (trifft nur die sieben
Dateien der Welle), jsdom-Probe für `textOn`. **Befunde 1–24 eingearbeitet** (Tasks 1–9): u. a. `--strict` nicht in der
Kette, drei bestehende Tests in Task 1, Fokusring der Kachel über `base.css`, `handleProps` für Alt+Pfeil am Dashboard,
`isInteractiveWithin` an allen drei Kanban-Stellen, Tastatur-`drop` mit `selection: false` und Zielregel, keine
Ziehen-Zustände in `calendar.css`, `textOn` liest am `<html>`, `categoryOf` ohne Verhaltensänderung.

## Global Constraints

- Ticket **#29906**; Commits beider Repos mit Präfix `Ticket #29906:`, Paket-Commits deutsch, Engine-Commits englisch,
  Trailer `Co-Authored-By: <Modell des Ausführenden> <noreply@anthropic.com>`.
- Engine-Branch `CWS/CWS_29906_design_system_welle_5c` im Worktree `_Working-Tree/tl8-wt-29584` (auf dem 5b-Branch,
  Head `be1d0851ae`). **Kein Push** — Subagenten committen lokal und melden.
- Paket: `tokens.json` nur Referenzen; im CSS nur Tokens; `dist/` nur über `node tools/generate.mjs`, danach
  `node tools/publish-to-worktree.mjs` (Kopie versiegelt, `test/published.test.mjs`, `TestDesignSystemCopy`).
- **Kein neues Bedienkonzept** (Hendrik 19.10.): Umzug, Zusammenlegen, Fokus, Ansage. Tastatur nur: Termine wählen
  (Pfeile, Enter), Tag öffnen, Mini-Monat mit Pfeilen, Kanban-Karten und Dashboard-Kacheln mit Alt+Pfeil verschieben.
  Kein Verschieben, Längenändern oder Anlegen von Terminen per Tastatur. Die Ablageposition im Kanban rechnet wie heute.
- Zustände sind Attribute (`aria-selected`, `aria-checked`, `aria-current`, `aria-disabled`, `data-tl-state`), nie
  Klassen `--active`, `--selected`, `--dragging`, `--preview`, `--today`, `--nonworking`, `--other`, `--event`,
  `--dragover`, `--dropRefused`, `--dropBefore`, `--dropAfter`, `--dropEnd`, `--edit`, `--disabled`.
- Typo nur über Typo-Klassen (`tl-type-*`); `font-size`, `font-weight`, `line-height` im Komponenten-CSS bricht das Lint.
- Jeder Block, der `display` setzt, setzt direkt danach `.tl-x[hidden] { display: none; }` (`test/hidden.test.mjs`).
- Jeder Pflichtbegriff eines Vertrags steht unmittelbar nach einem Backtick, eine Klasse je Backtick-Paar.
- Die Lage eines Parts (`Button`, `Badge`) steht am Element um das Part, nie an seiner `className` (die ist nur Marke).
- React in Controls nur aus `'tl-react-bridge'`; in `bridge/*.ts` aus `'react'` wie die Nachbardateien.
- Glyphen nur über Konstanten in `bridge/icons.ts`. Kein englisches Literal als `aria-label` oder sichtbarer Text; alles
  über `useI18N` und `I18NConstants` (`messages_en` erzeugt, Deutsch von Hand, sortiert).
- **Inline bleibt nur, was Daten sind:** Stundenhöhe, Lage und Größe der Termine, Spaltenzahl der Raster, Serverfarbe,
  Packung des Dashboards. Keine Custom Property `--tl-…` außerhalb von `dist/`.
- Keine Zeitangaben in Docs und Commits.

## Review Focus

1. **Klick auf ein Bedienelement in einer Kanban-Karte** (Link, Knopf in der Kartenansicht): wählt die Karte nicht aus.
   Heute über `isInteractiveTarget`; als `role="option"` zählt die Karte selbst als interaktiv — die Prüfung muss die
   Karte ausnehmen (`isInteractiveWithin(target, card)`). Vitest in Task 7.
2. **Alt+Pfeil in einer Spalte, deren Board kein `dragEnabled` hat oder ohne `reorder`** (hoch/runter): nichts wird
   gesendet, der Fokus bleibt; Pfeile ohne Alt bewegen nur den Fokus. Vitest in Task 7.
3. **Termin ohne Kategorie und ohne Farbe; Serverfarbe als `rgb(…)` oder Name; nicht auflösbare Farbe:** Marke bzw.
   Fläche inline mit lesbarer Schrift bzw. Rückfall auf Kategorie/Marke, nie weiße Schrift auf Weiß. Vitest in Task 4
   (`textOn`) und Task 8.
4. **Escape im Anlegen-Feld eines Kalenders in einem Fenster (`TLWindow`):** verwirft nur den Platzhalter, das Fenster
   bleibt. Vitest in Task 8.
5. **`TLTableView` nach dem Zusammenlegen der Interaktiv-Prüfung:** Klick in einen Zelleditor, auf einen deaktivierten
   Knopf in einer Zeile, auf einen Link in einer Zelle verhalten sich wie vorher. Vitest in Task 4.

---

### Task 1: Paket — gefüllte Kategorie-Rollen, Kandidaten-Rollen, `derive`

**Files:**
- Modify: `design-system/src/tokens.json`, `design-system/tools/lib/color.mjs` (`kategorieRollen`, neue Konstante),
  `design-system/tools/derive.mjs`, `design-system/specimen/probe.theme.css` (neu erzeugt)
- Modify (bestehende Tests, die sonst brechen — Plan-Review 2–4): `test/tokens.test.mjs:283–288` („eine Kategorie hat
  genau zwei Rollen“ → drei: 24, Regex `(subtle|border|surface)`, Kommentar `:244–246`), `test/generate.test.mjs:90`
  (Ausnahme-Regex `--tl-(text|icon)-on-[a-z0-9-]+`, sonst zählen `text-on-category-N` als 16 Farbliterale)
- Test: `design-system/test/planen.test.mjs` (neu), `design-system/test/derive.test.mjs`

**Interfaces:**
- Produces: Rollen `--tl-category-N-surface` (N = 1…8), `--tl-text-on-category-N`, `--tl-text-contrast-light`,
  `--tl-text-contrast-dark`; `kategorieRollen(tonGrad, gruende, hellerKandidat)` liefert je Modus
  `{ subtle, border, surface }`.

- [ ] **Step 1: Failing tests** in `test/planen.test.mjs` (Helfer wie `test/medien.test.mjs`):
  - `kategorie: gefüllte Fläche je Kategorie in beiden Modi` — `tokens.json` `color.light['category-N-surface']` und
    `color.dark['category-N-surface']` für N = 1…8 gleich: `{red-46}`, `{amber-47}`, `{green-48}`, `{teal-48}`,
    `{blue-48}`, `{blue-46}`, `{magenta-46}`, `{magenta-47}` (die heutigen dunklen `-border`-Stufen; weiße Schrift hält
    dort 5,3–5,4:1).
  - `kategorie: Schrift gerechnet` — `derived.light` und `derived.dark` enthalten `text-on-category-N` mit
    `{ "surface": "category-N-surface" }`; in `dist/tokens.css` ist `--tl-text-on-category-1` in beiden Modi `gray-0`.
  - `kandidaten: als Rollen` — `color.light/dark['text-contrast-light'] === T.derived.candidates.light` (`{gray-0}`),
    `text-contrast-dark === candidates.dark` (`{gray-77}`).
  - In der `derive`-Testdatei: `kategorieRollen(ton, gruende, '#ffffff')` liefert `surface` mit
    `ratio('#ffffff', surface) >= 4.5` in beiden Modi; eine eigene Kategorie (`color.category['category-3']`) bewegt
    auch `category-3-surface`; ein Theme mit Kundengrau schreibt `text-contrast-light/-dark` als die Kandidaten des
    Kundengraus; das Probe-Theme trägt `--tl-category-N-surface` und `--tl-text-contrast-dark`; der bestehende
    derive-Test zu `--strict` (Exit 1 auf dem Fixture, `derive.test.mjs:214`) und „Beschriftung, die niemand tragen
    kann → Exit 3“ (`:132`) bleiben grün.
- [ ] **Step 2: Run** `cd design-system && node --test test/planen.test.mjs test/derive.test.mjs` — FAIL.
- [ ] **Step 3: Rollen.** In `tokens.json` je Modus `category-N-surface` (Werte oben) und `text-contrast-light`,
  `text-contrast-dark` (Kommentar in `color._`: „Kandidaten der Beschriftung als Rollen — `textOn` wählt im Browser
  zwischen denselben zwei Farben wie `derive` (Spec 5c §4, §8)“); unter `derived.light/dark` die acht
  `text-on-category-N`. Muss ein Rollen-Test die Kandidaten als „Text ohne Paar“ kennen, dort mit demselben Kommentar
  eintragen.
- [ ] **Step 4: `derive`.** `color.mjs`: `KATEGORIE_SURFACE = { L: 0.54, C: 0.13 }` (die TopLogic-Stufe der Füllung,
  beide Modi); `kategorieRollen(tonGrad, gruende, hellerKandidat)` gibt zusätzlich
  `surface: aufKontrast(oklchZuHex({ ...KATEGORIE_SURFACE, H }).hex, [hellerKandidat], 4.5, 'dunkler').hex` je Modus.
  `derive.mjs`: Kandidaten (`kandidaten`) vor dem Kategorie-Schritt berechnen; `setze(mode, 'category-${k}-surface', …)`
  wie `subtle`/`border`. **Die Abdunkelung steht in `derive.mjs` in `try … catch`** wie Schritt 5 (`derive.mjs:224`):
  scheitert `aufKontrast`, bleibt die ungeprüfte Stufe, der Befund entsteht später als Code 3 an `text-on-category-N`
  (sonst wirft ein nackter `Error` vor Schritt 7, `derive.test.mjs:132` rot). Dunkelt sie ab (Ergebnis ≠ Rohstufe),
  Hinweis „`<mode>`: category-N-surface abgedunkelt, damit die helle Schrift 4,5:1 hält“. `kategorieRollen` liefert
  dafür `surface` als Rohstufe, die Abdunkelung macht `derive.mjs`. `text-contrast-light/-dark` braucht kein `setze`:
  die Rollen referenzieren `{gray-0}`/`{gray-77}`, `resolve(Pk, T)` löst sie über die Kundenrampe auf. Die
  Trennungs-Prüfung (3b) bleibt bei `-subtle`.
- [ ] **Step 5: Run** `node tools/generate.mjs && node tools/lint-css.mjs && node tools/derive.mjs
  test/fixtures/probe.primitives.json specimen/probe.theme.css && node tools/publish-to-worktree.mjs && node --test` —
  grün (Kontrast-Gate prüft die acht neuen Paare in beiden Modi und im Probe-Theme). **Ohne `--strict`:** das Fixture
  liefert absichtlich `red-42` mit vier gelieferten Befunden, `--strict` schriebe nichts.
- [ ] **Step 6: Commit** Paket „Ticket #29906: Paket -- gefüllte Kategorie-Rollen, Kandidaten als Rollen, derive
  rechnet beide“; Engine (Kopie) „Ticket #29906: Design system package -- filled category roles and contrast candidates.“

**Review:** `derive` ist ein Rechenkern — der Orchestrator lässt diesen Task zusätzlich von einem frischen Opus-Agenten
reviewen.

### Task 2: Paket — `tl-calendar`

**Files:**
- Create: `design-system/src/components/calendar/calendar.{css,contract.md,spec.html}`
- Modify: `tools/lint-css.mjs` (Blockliste `'tl-calendar': new Set([])`), `src/components/choice/choice.contract.md`
  (Leser `TLCalendar` von `tl-segmented`), `src/components/toolbar/toolbar.contract.md` (Leser), `src/components/drag/
  drag.contract.md` (Leser), `specimen/index.html`
- Test: `test/planen.test.mjs`, `test/contracts-5c.test.mjs` (neu, Aufbau wie `contracts-5b.test.mjs`)

**Interfaces:**
- Produces (Klassen; Wurzel, Leiste, Raster): `tl-calendar`, `tl-calendar__toolbar` (am `tl-toolbar`),
  `tl-calendar__title`, `tl-calendar__body`; Zeitraster `tl-calendar__time-grid`, `__gutter`, `__head`,
  `__day-head` (Knopf), `__weekday`, `__day-number`, `__all-day`, `__all-day-label`, `__all-day-cell`, `__scroll`,
  `__time-body`, `__hours`, `__hour`, `__columns`, `__column`, `__hour-line`, `__work`, `__now`; Termine
  `tl-calendar__events` (Liste, `role="listbox"`), `__event` (gefüllt, Zeitraster, Ganztagszeile, Monatsbalken; Lage
  inline),
  `__event-time`, `__event-title`, `__resize`, `__create`; Monat `__month`, `__month-head`, `__month-weekday`,
  `__month-body`, `__week`, `__days`, `__day`, `__overlay`, `__chip`, `__chip-dot`, `__more`; Jahr `__year`, `__mini`,
  `__mini-title`, `__mini-grid`, `__mini-weekday`, `__mini-day`. Zustände: `aria-current="date"`,
  `data-tl-state~="nonworking"`, `~="other"`, `~="event"`, `~="preview"`, `aria-selected="true"`; Kategorie
  `data-tl-role="category-N"`. `dragging` und `drop-onto` setzt das TSX, **gezeichnet werden sie nur von `drag.css`**
  (`drag.test.mjs:43–50`: kein anderer Block zeichnet Ziehen-Zustände).

- [ ] **Step 1: Failing tests** in `test/planen.test.mjs`:
  - `calendar: Termin gefüllt in der Kategorie` — für N = 1…8 liest `.tl-calendar__event[data-tl-role="category-N"]`
    `--tl-category-N-surface` und `--tl-text-on-category-N` (die 16 Regeln nicht von Hand: der Generator bekommt eine
    dritte Marker-Art in `expandRoles`, `/* @tl-roles: category-surface .tl-calendar__event */` → Fläche und Schrift je
    Kategorie, wie die vorhandenen `-subtle`/`-border`-Marker; Test in `roles.test.mjs`; ebenso für `__chip-dot` nur die
    Fläche, falls der Marker es hergibt, sonst acht Regeln mit Begründung im Bericht); `.tl-calendar__event` ohne Rolle liest `--tl-surface-brand`
    und `--tl-text-on-brand`; der Punkt `.tl-calendar__chip-dot[data-tl-role="category-N"]` liest
    `--tl-category-N-surface`.
  - `calendar: ausgewählt ist ein Ring` — `.tl-calendar__event[aria-selected="true"]::after` liest
    `--tl-border-width-md` und `--tl-border-interactive` (dieselbe Form wie `tl-item[aria-selected]::after`,
    `layout.css:97–105`: `inset: 0`, `border-radius: inherit`, `pointer-events: none`); kein `outline` in
    `calendar.css` (`focus.test.mjs:13`).
  - `calendar: heute überall derselbe Kreis` — die Regeln für `__day-head[aria-current="date"] .tl-calendar__day-number`,
    `__day[aria-current="date"] .tl-calendar__day-number` und `.tl-calendar__mini-day[aria-current="date"]` lesen
    `--tl-surface-brand`, `--tl-text-on-brand` und `--tl-radius-full`.
  - `calendar: Flächen` — `.tl-calendar__column` liest `--tl-surface-base`, `.tl-calendar__work` `--tl-surface-layer`;
    `.tl-calendar__now` liest `--tl-status-error-border` und `--tl-border-width-md`; `__hour-line` `--tl-border-separator`;
    `[data-tl-state~="nonworking"]` `--tl-surface-base`; `[data-tl-state~="other"]` `--tl-text-secondary`.
  - `calendar: keine Literale` — `calendar.css` ohne Kommentare enthält kein `#[0-9a-f]{3,6}`, kein `rgba(`, kein
    `\d+px`, kein `z-index: \d`, kein `font-size`, kein `data-tl-state~="(drop-|dragging)`.
  - `contracts-5c`: `SOLL` für `calendar` (`tl-calendar`, `tl-calendar__event`, `tl-toolbar`, `tl-segmented`,
    `role="listbox"`, `role="option"`, `aria-selected`, `aria-current="date"`, `data-tl-role`, `useRovingFocus`,
    `textOn`, `categoryOf`, `useStandaloneKeyboardScope`), `choice` (`TLCalendar`), `drag` (`TLCalendar`); `SPECIMEN =
    ['calendar']`.
- [ ] **Step 2: Run** — FAIL.
- [ ] **Step 3: `calendar.css`** nach dem alten Block `TLCalendar` (`tlReactControls.css:522–775`), Regel für Regel mit
  den neuen Namen, nach diesen Entscheidungen:
  - Literale → Tokens: Stundenspalte 56 px → `--tl-size-8` (3 rem; reicht die Beschriftung „23:00“ in `label` nicht,
    `--tl-size-9`, im Bericht nennen); Mini-Monat `minmax(220px, 1fr)` → `minmax(var(--tl-size-12), 1fr)`; 1–10 px →
    `--tl-space-*`/`--tl-border-width-*`; Ganztagszeile `min-height 22px`/`max-height 88px` → `--tl-size-6`/`--tl-size-10`;
    Monats-Überlagerung `top: 24px`, `grid-auto-rows: 19px` → `--tl-size-6` und `--tl-size-5` (liest das TSX eine dieser
    Zahlen, bleibt sie inline und der Bericht nennt die Stelle); Punkt 8 px → `--tl-size-2`, Markierung 4 px →
    `--tl-size-1`; „heute“-Kreis 1,6 em → `--tl-size-icon-lg`.
  - Schriftgrößen weg: Titel `tl-type-heading-sm`, Tageszahl `tl-type-heading-sm`, Wochentag/Stunde/Chip/Termin
    `tl-type-label`, Titel des Termins `tl-type-label-strong` — die Klassen setzt das TSX (Task 8); das CSS setzt keine
    Schrift. `text-transform: uppercase` am Wochentag bleibt.
  - `z-index` 2/4/5/6 → Reihenfolge im Stapel (`position: relative` + Quellreihenfolge) oder `--tl-layer-raised`; keine
    Zahl.
  - Monatszelle anderer Monat heute `text-disabled` → `text-secondary` (lesbarer Text, wie 5b „Keine Datei“).
  - Der weiße Innenrand der Termine fällt (Paar hält ohne ihn); Vorschau `.tl-calendar__event[data-tl-state~="preview"]`
    auf `--tl-surface-brand` mit eigener Deckkraft (einheitenlos, erlaubt); `dragging`/`drop-onto` ohne Regel hier.
  - Weitere Maße (Plan-Review 22): Punkt der Jetzt-Linie `--tl-size-2`, Versatz über `calc(-1 * …)` aus
    `--tl-space-2xs`/`--tl-border-width-*`; Griff zum Längenändern `--tl-space-xs` hoch (heute 6 px); `gap: 2px` →
    `--tl-space-2xs`; `line-height`-Literale entfallen (Typo-Klasse); `opacity` einheitenlos bleibt.
  - `[hidden]` nach jeder Regel, die `display` setzt.
- [ ] **Step 4: Vertrag und Specimen.** `calendar.contract.md`: Klassen, Zustände, Rollen (Leiste `role="toolbar"`,
  Ansichtswahl `tl-segmented` `role="radiogroup"`, Termine `role="listbox"`/`role="option"`, Tage als `button` mit Datum
  als Name), Tokens, Leser `TLCalendar`. `calendar.spec.html`: Leiste, Woche mit Ganztagszeile, Terminen aller acht
  Kategorien, einem ausgewählten, einer Jetzt-Linie und heute; Monat mit Balken, Chip, „+2“, anderem Monat und
  arbeitsfreien Tagen; drei Mini-Monate mit heute und Termintagen. Kein `style`-Attribut außer Daten (Lage der Termine).
  Link in `specimen/index.html`.
- [ ] **Step 5: Run** `node tools/generate.mjs && node tools/lint-css.mjs && node tools/publish-to-worktree.mjs &&
  node --test` — grün (auch `focus-clip`, `contrast`).
- [ ] **Step 6: Commit** Paket „Ticket #29906: Paket -- tl-calendar“; Engine (Kopie) „Ticket #29906: Design system
  package -- calendar.“

### Task 3: Paket — `tl-board`, `tl-dashboard`, `tl-value-list`, `tl-drop-hint`, Zellregeln

**Files:**
- Create: `design-system/src/components/{board,dashboard,value-list}/<name>.{css,contract.md,spec.html}`
- Modify: `src/components/drag/drag.{css,contract.md}` (`tl-drop-hint`), `src/components/table/table.{css,contract.md}`
  (`tl-table__hint` → weg; `tl-table__cell--command`, Werteliste und Zeile mit Zusatzknopf in der Zelle),
  `test/table.test.mjs:49` (prüft künftig `.tl-drop-hint`), `src/components/{layout,overlay,card,badge,select}/
  *.contract.md` (Leser), `tools/lint-css.mjs`, `specimen/index.html`, `test/ratchet.json` (Block `TLKanbanBoard: 147`
  eintragen, Vermerk an `_blocks`)
- Modify (Engine): `com.top_logic.layout.react/react-src/controls/DropHint.tsx:34` (`tl-drop-hint` statt
  `tl-table__hint`)
- Test: `test/planen.test.mjs`, `test/contracts-5c.test.mjs`

**Interfaces:**
- Produces: `tl-board`, `tl-board__column`, `__header`, `__label`, `__cards` (`role="listbox"`), `__card` (Marke am
  `tl-item`), `__live`; `tl-dashboard` (`data-tl-state~="edit"`), `__grid`, `__tile` (mit `tl-card`, `tl-overlay`),
  `__action` (mit `tl-visually-hidden`), `__cover`; `tl-value-list`, `tl-value-list--block`, `__item`, `__row`;
  `tl-drop-hint` (am `tl-popover`); `tl-table__cell--command`.

- [ ] **Step 1: Failing tests:**
  - `board: Spalten und Karten aus Tokens` — `.tl-board__column` liest `--tl-size-12` (Breite) und `--tl-size-13`
    (Höchstbreite), `--tl-surface-layer-nested`, `--tl-radius-md`; `board.css` ohne `999px`, `z-index`, Hex.
  - `board: Ziehen nur über drag.css` — `board.css` enthält kein `drop-before`, `drop-after`, `drop-onto`,
    `drop-refused` (die zeichnet `drag.css`); Vertrag nennt `data-tl-state`, `tl-drop-hint`, `tl-item`, `tl-badge`.
  - `dashboard: Kachel ist eine Karte` — Vertrag nennt `tl-card`, `tl-overlay__action`, `tl-overlay__layer--top-right`,
    `tl-visually-hidden`, `data-tl-axis="horizontal"`; `.tl-dashboard__tile` setzt keinen `box-shadow`;
    `.tl-dashboard__cover` setzt `cursor: move`; die gezeigte Kachel mit Aktion (nicht im Bearbeiten, nicht
    `aria-disabled`) liest `--tl-border-interactive`; **der Fokusring der Kachel kommt aus `base.css`:** die eine
    Ring-Regel in `tools/generate.mjs` (baseCss) bekommt die Alternative
    `.tl-dashboard__tile:has(> .tl-dashboard__action:focus-visible)` (`focus.test.mjs:9–35` erlaubt den Ring nur dort;
    prüfen, dass der Parser die zusätzliche Alternative annimmt); `dashboard.css` liest `--tl-focus-ring` nicht. Der
    verborgene Knopf steht `position: absolute` mit Abstand `--tl-space-sm` zur Kachelkante (`focus-clip` misst ihn).
  - `value-list: Block und Zelle` — `.tl-value-list--block` setzt `flex-direction: column`;
    `.tl-table__cell > .tl-value-list` in `table.css` setzt `text-overflow: ellipsis`, `overflow: hidden` und
    `white-space: nowrap` in derselben Regel (`ellipsis.test.mjs:8–20`);
    `.tl-table__cell .tl-value-list--block` setzt `display: inline` an den Einträgen;
    `.tl-table__cell > .tl-stack--row` setzt `inline-size: 100%`; `.tl-table__cell--command` setzt `padding: 0` und
    `justify-content: center` — Selektor `.tl-table__cell--command, .tl-table__header-cell.tl-table__cell--command`
    (die Java-Klasse landet an Kopf- und Datenzelle; der Vertrag erklärt es).
  - `drop-hint: im Block drag` — `.tl-drop-hint` in `drag.css` liest `--tl-status-error-border`; `table.css` enthält kein
    `tl-table__hint`.
  - `contracts-5c`: `board`, `dashboard`, `value-list`, `drag` (`tl-drop-hint`, `TLKanbanBoard`, `TLDashboard`),
    `table` (`tl-table__cell--command`, `tl-value-list`), `layout` (`TLKanbanBoard`), `overlay` (`TLDashboard`);
    `SPECIMEN` + `board`, `dashboard`, `value-list`.
- [ ] **Step 2: Run** — FAIL.
- [ ] **Step 3: Implement** nach den alten Blöcken `TLKanbanBoard` (`tlReactControls.css:776–922`), `Dashboard`
  (`385–480`), `TLValueList` (`134–224`), Zellen (`285–327`): Literale → Tokens; Zustandsklassen → Attribute (Ziehen
  ausschließlich `drag.css`); der leuchtende Balken und `--color-drop-zone` fallen; `.tlDashboard__tileAction` fällt
  zugunsten `tl-visually-hidden` (`dist/base.css`); Kachel-Zeigen wie heute `border-interactive`, ohne Schatten; der
  Griff der Werteliste ist ein Part (keine eigene Regel). **Dashboard-Abdeckung:** `div.tl-overlay__layer
  .tl-overlay__layer--fill > div.tl-dashboard__cover` (nimmt den Zeiger, `cursor: move`), im DOM **vor** der Ebene
  `--top-right` mit dem Ausblenden-Knopf (die spätere liegt oben); `.tl-overlay` ist `position: relative`.
  `tl-drop-hint`: die Regel von `.tl-table__hint` zieht nach
  `drag.css` (Werte gleich). Lint: `'tl-board': new Set([])`, `'tl-dashboard': new Set([])`,
  `'tl-value-list': new Set(['block'])`, `'tl-drop-hint': new Set([])`.
- [ ] **Step 4: Engine `DropHint.tsx`** auf `tl-drop-hint` (MUI-Tests suchen die Klasse nicht).
- [ ] **Step 5: Ratsche** `TLKanbanBoard` mit dem Messwert (`node tools/inventory.mjs`) eintragen, Vermerk „19.10. Welle 5c:
  TLKanbanBoard (147, #29730) eingetragen, fällt in Task 7“.
- [ ] **Step 6: Run** Paket `node tools/generate.mjs && node tools/lint-css.mjs && node tools/publish-to-worktree.mjs &&
  node --test`; Engine MUI-Vitest, `tsc --noEmit` — grün.
- [ ] **Step 7: Commit** Paket „Ticket #29906: Paket -- tl-board, tl-dashboard, tl-value-list, tl-drop-hint,
  Zellregeln“; Engine „Ticket #29906: The drop refusal hint reads tl-drop-hint; design system copy with board,
  dashboard and value list.“

### Task 4: Engine — gemeinsame Technik

**Files:**
- Modify: `com.top_logic.layout.react/react-src/bridge/interactive.ts`, `bridge/avatar.ts` (Funktion umbenannt und
  verschoben), `bridge-entry.ts:107`, `controls/useRovingFocus.ts`, `controls/items.tsx`, `controls/DropHint.tsx`,
  `controls/TLTableView.tsx`, `controls/TLTreeView.tsx`, `controls/TLKanbanBoard.tsx` und `controls/TLDashboard.tsx` (nur
  Importe), `controls/TLAvatar.tsx`; im MUI-Modul `react-src/adapters/MuiAvatarAdapter.tsx` und
  `MuiAvatarAdapter.test.tsx` (lesen `avatarCategory`)
- Create: `bridge/category.ts` (`categoryOf`), `bridge/text-on.ts` (`textOn`), `controls/option-selection.ts`
  (`useOptionSelection`)
- Delete: `controls/interactive.ts`, `controls/drop-hint.ts`
- Test: `com.top_logic.layout.react.mui/react-src/adapters/planen.test.tsx` (neu; Testregistry wie `media.test.tsx`)

**Interfaces:**
- Produces:
  ```ts
  // bridge/interactive.ts (alle über tl-react-bridge)
  export function isInteractiveWithin(target: EventTarget | null, surface: Element): boolean; // unverändert
  export function isInteractiveTarget(target: EventTarget | null): boolean;  // closest(INTERACTIVE_SELECTOR), Element selbst zählt
  export function isOperableTarget(target: EventTarget | null): boolean;     // interaktiv und nicht :disabled/[readonly]/aria-disabled/aria-readonly
  // bridge/category.ts
  export function categoryOf(name: string): number; // 1..8, genau avatarCategory (leer → 1 wie heute); der Kalender
  //   prüft „keine Kategorie“ selbst (category null oder '') und ruft categoryOf nur mit Namen
  // bridge/text-on.ts
  export function textOn(color: string): string | null;
  //   'var(--tl-text-contrast-light)' oder 'var(--tl-text-contrast-dark)' — der höhere WCAG-Kontrast zur aufgelösten
  //   Farbe; Kandidaten aus getComputedStyle(document.documentElement) (wie tokenPx; tokens.css deklariert am <html>,
  //   jsdom liefert Custom Properties nur am deklarierenden Element); Auflösung über ein Probe-Element:
  //   style.color = color, '' → null, sonst berechnetes rgb()/rgba() parsen (Hex, #rgb, rgb() auch direkt)
  // controls/useRovingFocus.ts
  export function useRovingFocus(containerRef, itemSelector, count, preferred, options?: { linear?: boolean }): RovingFocus;
  //   linear: Pfeil hoch/runter = vorheriges/nächstes wie links/rechts
  // controls/option-selection.ts
  export interface OptionProps { role: 'option'; 'aria-selected': boolean; onMouseDown; onClick; onKeyDown; /* + data-tl-item, Long-Press-Attribut */ }
  export function useOptionSelection(
    containerRef: React.RefObject<HTMLElement | null>,
    select: (key: string, toggle: boolean, range: boolean) => void,
    multiSelect: boolean,
  ): { optionProps(key: string, selected: boolean): OptionProps };
  // controls/DropHint.tsx — zusätzlich: DropVerdict, placeDropHint?, NO_DRAG_IMAGE (aus drop-hint.ts)
  ```
- Callers keep their behaviour: Kanban, Dashboard, `TLTableView` nutzen bisher `isInteractiveTarget(event)` bzw.
  `isOperableTarget(event)` → jetzt `isInteractiveTarget(event.target)` bzw. `isOperableTarget(event.target)`.

- [ ] **Step 1: Failing Vitest** `planen.test.tsx`:
  - `isInteractiveTarget` zählt das Element selbst und Vorfahren (`<button><span/></button>`: Span → true; `div` → false);
    `isInteractiveWithin(span, option)` ist für ein `div role="option"` ohne inneres Bedienelement false;
    `isOperableTarget` false für `button[disabled]`, `input[readonly]`, `[aria-disabled="true"]`.
  - **Review Focus 5:** `TLTableView` (Testmuster aus den vorhandenen Tabellen-Tests): Klick auf einen Link in einer Zelle
    wählt die Zeile nicht; Klick auf einen deaktivierten Knopf in einer Zeile wählt sie (wie heute — vorher prüfen, was
    heute gilt, und genau das festschreiben).
  - `categoryOf('Alice') === avatarCategory('Alice')` von heute (Wert vorher notieren und im Test festschreiben);
    `categoryOf('') === 1` (wie heute; der Avatar ohne Namen bleibt `category-1`).
  - `textOn('#ffffff')` → `var(--tl-text-contrast-dark)`; `textOn('#003366')` → `…-light`; `textOn('rgb(0, 0, 0)')` →
    `…-light`; `textOn('red')` → eine der beiden; `textOn('kein-farbwert')` → `null` (Kandidaten im Test mit
    `document.documentElement.style.setProperty('--tl-text-contrast-light', '#ffffff')` und `-dark` gesetzt).
  - `useRovingFocus` mit `{ linear: true }`: Pfeil runter vom ersten geht zum zweiten, auch wenn beide in einer Spalte
    übereinander stehen.
  - `useItems` unverändert: die vorhandenen Tests (`containers.test.tsx` u. a.) grün.
- [ ] **Step 2: Run** — FAIL.
- [ ] **Step 3: Implement.** `isInteractiveTarget`/`isOperableTarget` aus `controls/interactive.ts` nach
  `bridge/interactive.ts` (Signatur `target` statt `event`), Datei gelöscht, Aufrufer umgestellt (`TLTableView` an
  allen Stellen, Kanban, Dashboard). `avatarCategory` → `categoryOf` in `bridge/category.ts` (kein Alias; Leser
  umgestellt, auch im MUI-Modul). `textOn` in `bridge/text-on.ts`. `useOptionSelection` aus dem Optionsteil von `useItems`
  (`items.tsx:170–200`: Umschalt-Mausdruck, Klick, Enter/Leertaste, Langdruck-Ereignis am Behälter, Inneres über
  `isInteractiveWithin(target, option)`); `useItems` nutzt ihn. `drop-hint.ts` in `DropHint.tsx` aufgehen lassen
  (Exporte gleich benannt), Importe in `TLTableView`, `TLTreeView`, `TLKanbanBoard` umstellen. Export der neuen
  Bridge-Funktionen in `bridge-entry.ts`.
- [ ] **Step 4: Run** MUI-Vitest (alle), `tsc --noEmit` in `layout.react` und `layout.react.mui`, Maven `install`
  `layout.react` (Vite-Build) — grün.
- [ ] **Step 5: Commit** Engine „Ticket #29906: One interactive-target check, one option selection, one category
  mapping, readable text on data colours, one drop hint module.“

### Task 5: Engine — Werteliste, Tabellenzellen, Befehlsspalte

**Files:**
- Modify: `react-src/controls/TLValueList.tsx`, `tlReactControls.css` (Blöcke „TLValueList“, „Table cells holding legacy
  controls (until waves 4 and 5)“ löschen), `design-system/test/ratchet.json`
- Modify (Java): `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/table/RowCommandColumn.java:75`
  (`CSS_CLASS = "tl-table__cell--command"`, JavaDoc)
- Test: `planen.test.tsx`; `inline-buttons.test.tsx:160–190` bleibt grün

**Interfaces:**
- Consumes: Klassen aus Task 3 (`tl-value-list`, `--block`, `__item`, `__row`; `tl-select__separator`).

- [ ] **Step 1: Failing Vitest:** lesend `span.tl-value-list` (bzw. `--block`) mit `span.tl-select__separator` „, “
  zwischen den Werten; bearbeitend `div.tl-value-list[role="group"]`; der Griff ist das Part `Button` (ghost, small,
  icon-only, `ICON_HANDLE`, Name `js.valueList.move`) mit den `handleProps`; Alt+Pfeil runter auf dem Griff sendet
  `moveElement` wie heute; kein Element mit Klasse `tlValueList*` (positiv: Wurzel-`className` genau
  `tl-value-list` bzw. `tl-value-list tl-value-list--block`, plus Serverklasse).
- [ ] **Step 2: Run** — FAIL.
- [ ] **Step 3: Implement** `TLValueList.tsx`; `RowCommandColumn.CSS_CLASS`. `inline-buttons.test.tsx` prüft über
  Rollen und Namen — nur nachziehen, wenn er rot wird.
- [ ] **Step 4: Alt löschen** — zwei Blöcke; Ratsche auf den Messwert, Vermerk.
- [ ] **Step 5: Run** Vitest, `tsc`, Paket `node --test`, Maven `layout.react` `test` (`TestReactValueListControl`,
  `TestReactStylesheetTokens`, `TestDesignSystemCopy`), `layout.view` `install` und `test`
  (`-Dtest=` die Tests von `RowCommandColumn`/Tabellen-Spalten, englische Locale), `check-messages-en.sh` — grün.
- [ ] **Step 6: Commit** Engine „Ticket #29906: The value list and the row command column read the design system
  package.“; Paket „Ticket #29906: Ratsche -- TLValueList und Tabellenzellen gestrichen“.

### Task 6: Engine — Dashboard

**Files:**
- Modify: `react-src/controls/TLDashboard.tsx`, `com.top_logic.layout.react/src/main/java/com/top_logic/layout/react/
  I18NConstants.java` (`JS_DASHBOARD_TILE` „Tile {0}“, deutsch „Kachel {0}“), `messages_de.properties`,
  `tlReactControls.css` (Block „Dashboard“), `design-system/test/ratchet.json`
- Test: `planen.test.tsx`

**Interfaces:**
- Consumes: `tl-dashboard*` (Task 3), `tl-card`, `tl-overlay*`, `tl-visually-hidden`; `useListReorder({ axis:
  'horizontal', onMove, enabled: editMode, handle: false, count, labelOf, keyOf })`, `reorderState`; `useTokenPx`;
  `isInteractiveTarget` (Task 4); `tooltipProps`.

- [ ] **Step 1: Failing Vitest:**
  - Ansicht: Wurzel `tl-dashboard` ohne `data-tl-state`; Kachel `div.tl-card.tl-dashboard__tile.tl-overlay` mit
    `tl-overlay__base` um den Inhalt; Aktion `button.tl-dashboard__action.tl-visually-hidden` mit dem Namen aus dem
    Zustand, Enter sendet `activate`; deaktiviert `disabled`/`aria-disabled`, kein `activate`.
  - Bearbeiten: Wurzel `data-tl-state="edit"`; Ebene `tl-overlay__layer--top-right` > `tl-overlay__action` > Part
    `Button` (Name `js.dashboard.hideTile`) sendet `hide`; Alt+Pfeil rechts auf der zweiten von drei Kacheln sendet
    `reorder` mit der neuen Reihenfolge; Ansage im Live-Bereich ist `js.reorder.moved` (`'{0}, position {1} of {2}'`,
    englisch im Test: „Tile 2, position 3 of 3“ bzw. der Name der Aktion); nach dem neuen Zustand hat die verschobene
    Kachel den Fokus; Raster `data-tl-axis="horizontal"`.
  - Kein inline `gap: '1rem'`; der Abstand kommt aus `useTokenPx('--tl-space-md')`.
- [ ] **Step 2: Run** — FAIL.
- [ ] **Step 3: Implement** nach Spec §6. Die Packrechnung (`computeLayout`, `calcMaxColumns`) bleibt; `parseLengthPx`
  nur noch für Breiten aus dem Zustand (`16rem`). `labelOf(i)` = Name der Aktion, sonst `js.dashboard.tile` mit der
  Position; `keyOf(i)` = Kachel-Id. **Alt+Pfeil kommt nur über `handleProps`** (`list-reorder.ts:386–423`; `handle:
  false` ändert nur den Zeigerdruck): im Bearbeiten trägt die fokussierbare Kachel `{...reorder.itemProps(i)}
  {...reorder.handleProps(i)}`; `handleProps` bringt `aria-label` („Move …“), `aria-describedby` und einen `ref`-Callback
  — ein eigenes `ref` der Kachel damit zusammenführen. Der eigene Zug (`draggedId`, `dropTarget`, `commitReorder`)
  fällt zugunsten `useListReorder`.
- [ ] **Step 4: Alt löschen** — Block „Dashboard“; Ratsche.
- [ ] **Step 5: Run** Vitest, `tsc`, Paket `node --test`, Maven `layout.view` `test`
  (`-Dtest=test.com.top_logic.layout.view.element.TestDashboardElement`), `check-messages-en.sh` — grün; Messages-Diff
  committen, Deutsch nachziehen.
- [ ] **Step 6: Commit** Engine „Ticket #29906: The dashboard reads the design system package -- tiles are cards, the
  hide button floats over the tile, tiles move with Alt+arrow.“; Paket „Ticket #29906: Ratsche -- Dashboard gestrichen“.

### Task 7: Engine — Kanban

**Files:**
- Modify: `react-src/controls/TLKanbanBoard.tsx`, `react-src/bridge/drag-drop.ts` (Grenzsuche als benannte Funktion),
  `I18NConstants.java` (`JS_KANBAN_BOARD_MOVED` „Moved to {0}, position {1} of {2}.“, deutsch „Verschoben nach {0},
  Position {1} von {2}.“), `messages_de.properties`, `tlReactControls.css` (Block „TLKanbanBoard“),
  `design-system/test/ratchet.json`
- Test: `planen.test.tsx`; Java `TestKanbanBoardCards`, `TestKanbanBoardDragDrop` (unverändert grün)

**Interfaces:**
- Consumes: `tl-board*`, `tl-item`, `tl-badge` (Part `Badge`, falls vorhanden, sonst Klasse), `tl-drop-hint` (Task 3);
  `useOptionSelection`, `useRovingFocus`, `isInteractiveWithin`, `DropHint` (Task 4).
- Produces: `boundaryAt(clientY: number, items: readonly Element[]): { item: Element; side: 'before' | 'after' } | null`
  in `bridge/drag-drop.ts` — die heutige Rechnung von `dropTargetAt` (nächste Grenze nach der Mitte jeder Karte, auch in
  Lücken und unter der letzten).

- [ ] **Step 1: Failing Vitest:**
  - Struktur: Spalte `section.tl-board__column` mit Namen; Karten-Liste `div.tl-board__cards[role="listbox"]`
    (`aria-multiselectable` bei `multiSelect`), Karten `div.tl-item.tl-board__card[role="option"]` mit `aria-selected`;
    genau ein Tab-Halt je Spalte; Pfeil runter fokussiert die nächste Karte; Zähler `tl-badge`.
  - Auswahl: Klick sendet `selectCard{card, toggle:false, range:false}`, Strg-Klick `toggle:true`, Umschalt-Klick
    `range:true`, Enter auf der Karte wie Klick; ausgewählte Karte enthält `span.tl-item__check[aria-hidden]` (Markup wie
    `items.tsx:201`, nicht CSS). **Review Focus 1:** Klick auf einen Knopf in der Karte sendet nichts; `dragstart` auf der
    Karte selbst schreibt die Nutzlast (die Karte ist als `option` selbst „interaktiv“ — `isInteractiveWithin(target,
    card)` an allen drei Stellen: `TLKanbanBoard.tsx:183` Drag, `:363` Umschalt-Mausdruck, `:369` Klick).
  - Tastatur-Verschieben (`dragEnabled`, `reorder`), **immer `selection: false` mit der Schlüsselliste wie beim Ziehen**
    (`TLKanbanBoard.tsx:188–192`; `selection: true` nähme serverseitig einen anderen Pfad, `DropSupport.java:244`).
    Bewegte Menge: die gewählten Karten der Spalte, wenn die fokussierte gewählt ist, sonst nur sie. Zielregel nach
    `placeOf` (`ReactKanbanBoardControl.java:745–767`): Alt+runter → `targetKey` = erste Karte nach der letzten bewegten,
    `zone: 'lower'`, gibt es keine → nichts senden; Alt+hoch → Karte vor der ersten bewegten, `zone: 'upper'`, keine →
    nichts; Alt+links/rechts → Nachbarspalte, Karte am Index der fokussierten, `zone: 'upper'`, sonst Spaltenschlüssel
    und `'none'`. Fälle: Spalte A = [`a1`, `a2`, `a3`], Fokus `a1` → Alt+runter `drop{source: <controlId>, keys: 'a1',
    selection: false, targetKey: 'a2', zone: 'lower'}`; Alt+rechts mit B = [`b1`, `b2`] → `targetKey: 'b1', zone:
    'upper'`; B leer → `targetKey: 'B', zone: 'none'`; `a1` und `a2` gewählt, Fokus `a1` → Alt+runter `keys: 'a1,a2',
    targetKey: 'a3', zone: 'lower'`. Fokus nach dem Zug: die Karten sind nach `card.key` gekeyt, React versetzt den
    Knoten → Fokus geht verloren; wie `list-reorder.ts:356–382` ein `pendingFocusRef` und `useLayoutEffect` auf
    `columns`, der die Karte nach Schlüssel fokussiert und den Live-Bereich setzt (`js.kanbanBoard.moved`); lehnt der
    Server ab (Warnung, kein neuer Zustand), bleibt der Fokus.
  - **Review Focus 2:** ohne `dragEnabled` sendet Alt+Pfeil nichts; ohne `reorder` sendet Alt+Pfeil hoch/runter nichts,
    Alt+Pfeil links/rechts schon; Pfeile ohne Alt senden nie.
  - Ziehen: `dragover` über der oberen Hälfte einer Karte setzt `data-tl-state="drop-before"` an ihr; über einer Lücke
    die nächste Grenze (wie heute); abgelehnt (Urteil mit Grund) → Spalte `drop-refused` und `DropHint` mit dem Grund;
    gezogene Karte `dragging`.
- [ ] **Step 2: Run** — FAIL.
- [ ] **Step 3: Implement** nach Spec §5. `dropTargetAt` → `boundaryAt` (Bridge). Alt+Pfeil vor `roving.onKeyDown`
  behandeln (sonst bewegt Alt+Pfeil den Fokus). Die Probe-Buchhaltung (`dropProbe`, `probesRef`, Urteile) bleibt.
- [ ] **Step 4: Alt löschen** — Block „TLKanbanBoard“; Ratsche.
- [ ] **Step 5: Run** Vitest, `tsc`, Paket `node --test`, Maven `layout.view` `test` (`TestKanbanBoardCards`,
  `TestKanbanBoardDragDrop`), `check-messages-en.sh` — grün; Messages-Diff committen, Deutsch nachziehen.
- [ ] **Step 6: Commit** Engine „Ticket #29906: The kanban board reads the design system package -- cards are
  selectable items, one tab stop per column, Alt+arrow moves cards, drop feedback and refusal hint as in tables.“; Paket
  „Ticket #29906: Ratsche -- TLKanbanBoard gestrichen“.

### Task 8: Engine — Kalender

**Files:**
- Modify: `react-src/controls/TLCalendar.tsx`, `I18NConstants.java` (`JS_CALENDAR_TOOLBAR` „Calendar“,
  `JS_CALENDAR_VIEW` „View“, `JS_CALENDAR_EVENTS` „Events“; deutsch „Kalender“, „Ansicht“, „Termine“),
  `messages_de.properties`, `tlReactControls.css` (Block „TLCalendar“), `design-system/test/ratchet.json`
- Test: `planen.test.tsx`

**Interfaces:**
- Consumes: `tl-calendar*` (Task 2), `tl-toolbar`, `tl-segmented`; `categoryOf`, `textOn`, `useRovingFocus` (mit
  `linear` für das Zeitraster), `isInteractiveWithin` (Task 4); `useStandaloneKeyboardScope`; Part `Button`.

- [ ] **Step 1: Failing Vitest** (Zustand nach `CalendarViewControl`: `granularity`, `title`, `rangeStart`, `rangeEnd`,
  `anchor`, `now`, `firstDayOfWeek`, `dayStartHour`, `dayEndHour`, `nonWorkingDays`, `locale`, `editable`, `events[]`):
  - Leiste: `div.tl-toolbar.tl-calendar__toolbar[role="toolbar"]` mit Namen `js.calendar.toolbar`; Ansichtswahl
    `div.tl-segmented[role="radiogroup"]` (Name `js.calendar.view`), gewählte Ansicht `aria-checked="true"`, Klick auf
    „Monat“ sendet `switchGranularity{granularity: 'MONTH'}`.
  - Woche: Termine `div.tl-calendar__event[role="option"]` in einem `[role="listbox"]` (Name `js.calendar.events`),
    genau ein Tab-Halt, Pfeil runter fokussiert den nächsten in Zeitordnung, Enter sendet `selectEvent{eventId}`; Name
    des Termins enthält Uhrzeit und Titel; ausgewählt `aria-selected="true"`; Kategorie `data-tl-role="category-N"` mit
    `N = categoryOf(category)`.
  - **Review Focus 3:** Termin ohne Kategorie (`null` oder `''`) und ohne Farbe: kein `data-tl-role`, keine
    Inline-Farbe; mit `color: 'rgb(0, 51, 102)'`: Inline-`background` diese Farbe und
    `color: var(--tl-text-contrast-light)` (Kandidaten am `document.documentElement` gesetzt); mit
    `color: 'kein-farbwert'`: keine Inline-Farbe, Kategorie bzw. Marke.
  - Tageskopf ist ein `button` mit dem vollen Datum als Name, Klick sendet `goto`; heute `aria-current="date"`;
    arbeitsfreier Tag `data-tl-state` enthält `nonworking`.
  - Monat: Tageszahl ist ein `button`; ganztägiger Termin als gefüllter `tl-calendar__event`; Termin mit Uhrzeit als
    `tl-calendar__chip` mit `tl-calendar__chip-dot`; `dragover` mit einem Termin über einem Tag setzt dort
    `drop-onto`, `drop` sendet `moveEvent` wie heute.
  - Jahr: Mini-Monat ist ein Raster mit einem Tab-Halt; Pfeil rechts fokussiert den nächsten Tag; Enter sendet `goto`.
  - Anlegen: nach `create.open` hat das Feld den Fokus; Enter sendet `createSlot` mit dem Titel; **Review Focus 4:** in
    einem `TLWindow` verwirft Escape nur den Platzhalter (kein `createSlot`), das Fenster bleibt offen. Dafür muss der
    heutige `onKeyDown`-Zweig für Escape (`TLCalendar.tsx:299–307`) weg (sonst setzt `defaultPrevented` den Dispatcher
    aus, `keyboard-dispatcher.ts:188–192`); die Bindung gibt `true` zurück und ist nur aktiv, solange der Platzhalter
    existiert.
  - Kein Element mit Klasse `tlCal*`; keine Custom Property `--cal-ev-bg` (positiv: Klassen der Wurzel genau
    `tl-calendar` plus Serverklasse).
- [ ] **Step 2: Run** — FAIL.
- [ ] **Step 3: Implement** nach Spec §3: Klassen nach Task 2, Typo-Klassen im TSX, Kategorie über `categoryOf`,
  Serverfarbe über `textOn(color)` (inline `background` und `color`; `null` → Kategorie bzw. Marke), `categoryClass`/`eventStyle`
  mit Hex-Palette fallen; Termin-Listen mit `useRovingFocus` (Zeitraster `linear`); Tage und „+n weitere“ als Part
  `Button` oder `button` mit Typo-Klasse; Anlegen-Feld mit Escape über `useStandaloneKeyboardScope`; Ansichtswahl als
  `tl-segmented` (Muster `TLSegmentedChoice.tsx`, Pfeiltasten in der Gruppe).
- [ ] **Step 4: Alt löschen** — Block „TLCalendar“; Ratsche.
- [ ] **Step 5: Run** Vitest, `tsc`, Paket `node --test`, Maven `layout.react` `install` (Vite), `check-messages-en.sh` —
  grün; Messages-Diff committen, Deutsch nachziehen.
- [ ] **Step 6: Commit** Engine „Ticket #29906: The calendar reads the design system package -- events in theme
  categories with computed text, one tab stop per event list, days as buttons, today marked alike in every view.“;
  Paket „Ticket #29906: Ratsche -- TLCalendar gestrichen“.

### Task 9: Gates gesamt, altlast

**Files:**
- Modify: `design-system/test/engine-classes.test.mjs`, `design-system/test/ratchet.json`,
  `docs/migration/altlast.md` (Abschnitt „## Welle 5c · Planen und Ziehen — gebaut <Datum>“ nach „Welle 5b“)

- [ ] **Step 1: Engine-Gate** — Test „keine alte Klasse der Welle 5c …“ nach dem Muster von `ALT_5B` über dieselben
  Quellen (react-src samt Vitest-Dateien, Stylesheets, Java, tl-docs, Views) mit
  `const ALT_5C = /\btl(Cal[A-Z]\w*|Calendar|KanbanBoard|Dashboard|ValueList|RowCommandCell)(__|--|\b)|--cal-ev-bg|\btl-table__hint\b/;`
  — vorher prüfen, dass `register('TLCalendar', …)` und Java-Klassennamen (`CalendarViewControl`, `DashboardElement`)
  nicht treffen. Und „Welle 5c im TSX“: `controls/interactive.ts` und `controls/drop-hint.ts` existieren nicht; in
  `TLCalendar.tsx` kein `#[0-9a-f]{6}`; in `TLKanbanBoard.tsx`, `TLDashboard.tsx`, `TLCalendar.tsx` kein
  `aria-label="[A-Za-z]`.
- [ ] **Step 2: Ratsche** — `node tools/inventory.mjs`; Budgets = Messwert; Vermerk der Welle.
- [ ] **Step 3: Paket-Gates** `node tools/generate.mjs && node tools/lint-css.mjs && node tools/publish-to-worktree.mjs
  && node --test` — grün.
- [ ] **Step 4: Maven und Messages** (JDK 21) — `install` für `layout.react`, `layout.view`, `layout.configedit`;
  `test` für `layout.react`, `layout.view` (englische Locale), `layout.configedit`, `demo.react`; danach
  `check-messages-en.sh` ohne Diff.
- [ ] **Step 5: `altlast.md`** — gestrichene Blöcke, „Neu im Paket“ (Rollen, Blöcke, `tl-drop-hint`,
  `tl-table__cell--command`; Bridge `categoryOf`, `textOn`, `isInteractiveTarget`/`isOperableTarget`, `boundaryAt`;
  `useOptionSelection`), Alt → neu für Anwendungs-Stylesheets (`tlCal*` → `tl-calendar__*`, `tlKanbanBoard*` →
  `tl-board__*`, `tlDashboard*` → `tl-dashboard__*`, `tlValueList*` → `tl-value-list*`, `tlRowCommandCell` →
  `tl-table__cell--command`, `tl-table__hint` → `tl-drop-hint`, Zustandsklassen → Attribute), Offenes.
- [ ] **Step 6: Commit** Paket „Ticket #29906: Ratsche und Engine-Gate Welle 5c; altlast Welle 5c“; Engine (nur bei
  Messages-Diff) englisch.

### Task 10: Sichtprüfung lokal (Orchestrator)

- [ ] Demo `tl-demo-react` wie Memory „Lokale Demo statt Docker“, hell und dunkel, beide Dichten: „calendar“ in allen
  Ansichten (Termin per Tastatur wählen, ziehen, anlegen, Escape, heute, Jetzt-Linie, Kategorien), „board“ und
  „dnd-demo“ (Auswahl, Tastatur, Alt+Pfeil, ziehen, Ablehnung), Projekt-Cockpit (Kachel-Aktion, Bearbeiten,
  ausblenden, verschieben), Werteliste in Formular und Tabelle. Befunde in `altlast.md` „Welle 5c“, Korrekturen als
  eigene Commits; was in den UI-Durchgang gehört, nach `docs/ui-durchgang.md`.

### Task 11: Abschluss (Orchestrator)

- [ ] Trac #29906: Solution, `== Migration ==` (Spec §12 und die Tabelle aus Task 9) und `RequiresMigration`;
  `skalen.md` („Beim Bauen entschieden“), Präsentation, STATUS nachziehen; Hendrik melden. **Kein Push** — Welle 5 kommt
  als ein PR nach 5d.
