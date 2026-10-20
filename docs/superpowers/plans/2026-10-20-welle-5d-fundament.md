# Welle 5d · Fundament und Abschluss — Umsetzungsplan (#29914)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `tlReactControls.css` ist gelöscht; Fundament, Tooltip, Compact field, Wysiwyg, Diagramme, Editoren und die
fremden Stylesheets lesen das Paket; die Dichte ist im Benutzermenü wählbar.

**Architecture:** Das Paket bekommt zwei Ebenen (`layer-tooltip`, `layer-drag`), die Rollen `surface-inverse`/
`text-inverse` und die Blöcke `tl-tooltip`, `tl-rich-text`, `tl-compact-field`, die Regeln für Füllen, Viewport, Anker,
Ziehen, Picker und „Aktion beim Zeigen“. Die Engine zieht Stück für Stück um; die Bridge exportiert die Menü-Bausteine,
damit das Wysiwyg-Modul Paketmenüs bauen kann. Am Ende wird die alte Datei gelöscht und die Ratsche zur Wache.

**Tech Stack:** Paket: CSS, `node --test`, `tools/*.mjs`, Chrome über CDP. Engine: React/TSX über `tl-react-bridge`,
TypeScript, Vite, Java 17, Maven, Vitest im MUI-Modul, Tiptap 3 (headless), Chart.js, CodeMirror.

**Spec:** `docs/superpowers/specs/2026-10-20-welle-5d-fundament-design.md` (freigegeben 20.10.); Begründungen in
`docs/skalen.md` „Welle 5d“; Befunde in `docs/migration/altlast.md` „Welle 5“ (V13, V15, V16, V17, V21, V31–V40).

## Plan-Review 20.10. (Fable) — Korrekturen K1–K16, verbindlich

Geprüft gegen `main` 7b44038 (597/597) und Worktree `3ec1eb2ad8`, mit Lint-Probe der geplanten Regeln, ALT-Regex über
den Worktree und `derive` am Probe-Theme. Ergebnis „nicht ausführungsreif“; die Befunde sind unten entschieden. **Wo
eine Korrektur dem Task-Text widerspricht, gilt die Korrektur.**

- **K1 (Task 2, 4) Viewport und Mount bleiben Engine-Seitenrahmen.** `html, body { height:100%; overflow:hidden }`,
  `.is-control`, `.is-control > .tl-stack` und `[data-react-module]` stehen in `tlReactBase.css` (Engine), nicht in
  `baseCss`: `.is-control` bricht das BEM-Gate, und `overflow:hidden` am `body` machte die Specimen-Seiten unscrollbar.
  Ins Paket zieht nur das Füllen (`tl-fill`). `tlReactBase.css` liest danach kein altes Token außer `background-image`.
- **K2 (Task 2) Anker-Aufblitzen als Hof**, nicht als Ring: `box-shadow: 0 0 0 var(--tl-focus-width)
  var(--tl-surface-state-hover-strong)` → `transparent` (Hof-Muster, lint-konform; der Ring aus `--tl-focus-ring` brach
  `lint-css` bzw. `focus.test.mjs:21–24`). Spec §3 nachgezogen.
- **K3 (Task 3, 9) `tl-rich-text` ohne Bibliotheksklassen.** Das Paket trägt nur Regeln an `.tl-rich-text`, `.tl-prose`
  und Elementen (`th`, `img`). `.ProseMirror`, `.ProseMirror-selectednode`, `.column-resize-handle` bleiben im
  Engine-Sheet `TLWysiwygEditor.css` (Bildauswahl dort als `outline` aus `--tl-focus-width`/`--tl-focus-ring`; das Audit
  liest `tokens.css` mit, Task 9).
- **K4 (Task 3) Tooltip-Schatten** als `box-shadow: var(--tl-shadow-popover)` am Tooltip, der Pfeil ohne Schatten
  (`drop-shadow()` nimmt die zweischichtige Liste nicht); `test/popover.test.mjs:30–36` nimmt `tooltip/tooltip.css` als
  Leser von `shadow-popover` aus.
- **K5 (Task 3) `tools/lint-css.mjs`:** `MODIFIERS['tl-toolbar'] = new Set(['wrap'])`; neue Blöcke mit leeren Sets:
  `tl-tooltip`, `tl-rich-text`, `tl-compact-field`, `tl-chart` (K12).
- **K6 (Task 2, 6) „Aktion beim Zeigen“ einmal:** Die Regel `tl-reveal-on-hover` übernimmt, was `reorder-list.css` heute
  für Griff und Knöpfe (`__actions > .tl-button`) hat: `opacity`-Übergang mit `background-color`, sichtbar bei `:hover`
  und `:has(:focus-visible)` des direkten Elternteils, bei `.tl-table__row:hover`, bei eigenem `:focus-visible`, immer
  unter `@media (hover: none)`. `test/drag.test.mjs:95–121` wird umgeschrieben (prüft die Reveal-Regel und dass
  `reorder-list.css` keine eigene Einblendung mehr hat). Die Engine setzt die Klasse am Griff und an den Knöpfen
  (`controls/TLColumnSelect.tsx`) in Task 6.
- **K7 (Task 9, 10) Vitest erreicht Tiptap und Chart.js:** `com.top_logic.layout.react.mui/vitest.config.ts`
  `server.deps.inline` um `/@tiptap/`, `/react-chartjs-2/`, `/chart\.js/`; in `test-setup.ts` Polyfills
  `Range.prototype.getClientRects`/`getBoundingClientRect` für ProseMirror. Review Focus 3 über
  `renderHook(useThemeDefaults)` mit `document.documentElement.style.setProperty('--tl-category-1-surface', …)` und
  Attributwechsel, nicht über das Canvas (jsdom hat keinen 2D-Kontext).
- **K8 (Task 7) Dichte wie die Themewahl:** zwei Einträge „Normal“ und „Kompakt“, der gewählte mit `setActive`
  (`aria-current`) — derselbe Pfad wie die Theme-Einträge; kein `checked` durch `ButtonState`. Spec §6a nachgezogen.
- **K9 (Task 7) Erstes HTML:** `UIThemeService.writeModeAttribute` (`UIThemeService.java:308–310`, aufgerufen in
  `com.top_logic.layout.view/.../ViewServlet.java:905–907`) schreibt `data-tl-density` aus der `PersonalConfiguration`;
  das Inline-Skript (`:502–504`) setzt nur den Rückfall `normal`. Test in `TestUIThemeService.java`.
- **K10 (Task 8) Bridge-Exporte vollständig:** `Menu`, `MenuItem`, `useRovingMenu`, `MenuHeader`, `MenuSeparator`,
  `menuItemClassName`. Leser: `TLToolbar.tsx:3`, `TLMenu.tsx:3`, `TLSidebar.tsx:7`, `TLTableView.tsx:5`,
  `button/buttonClassName.ts:2`. `Menu.tsx` importiert nur Bridge-Teile — Umzug ohne Zyklus, Importe relativ, `React`
  aus `'react'`.
- **K11 (Task 9) Bundle:** Das Audit liest das gebündelte `src/main/webapp/script/tl-react-wysiwyg.css` (in Git). Nach
  dem Umbau `npm run build` im Wysiwyg-Modul (bzw. der Maven-Lauf, der es tut) und das Bundle mit committen; `ALT_5D`
  scannt das Bundle mit.
- **K12 (Task 3, 9, 10, 11, 12) Namen und `ALT_5D`:** Wysiwyg-Wurzel und -Teile fallen (`tlWysiwygEditor*` →
  `tl-field tl-rich-text`, Inhalt `tl-prose`); das Diagramm bekommt einen Paketblock `tl-chart` (`__tooltip` mit der
  Fläche von `tl-popover`, `__zoom-reset`), `tlReactChart*` fällt. Code- und Script-Editor behalten ihre Wurzelklassen
  `tlCodeEditor`, `tlCodeEditorSurface`, `tlScriptEditor` als Geltungsbereich der CodeMirror-Regeln (Engine-Sheet), nur
  der Zustand `--error` fällt (→ `aria-invalid`). `ALT_5D =
  /\btlFill\b|data-touch-drag|\btlDragShield\b|\btlTouchDragImage\b|\btlPick--active\b|\btlAnchor--flash\b|\btl-tooltip-(popover|caption|body|arrow)\b|\btlCompactField|\btl(WysiwygEditor|WysiwygToolbar|ReactChart)(__|--|\b)|\btl(CodeEditor|ScriptEditor)--|--tl-(tt-|wysiwyg-)/`
  (vor dem Einsatz je Alternative ein Treffer und ein Fehltreffer). `tl-docs/view-layer/{layout,basics}.md` nennen
  `tlFill` — in Task 4 nachziehen.
- **K13 (Task 5) `foreignTl` leer:** `test/ratchet.json` `foreignTl` streicht `--tl-tt-padding` (sonst
  `ratchet.test.mjs:61–65` rot).
- **K14 (Task 12) Wache:** Skip in `ratchet.test.mjs:20,28,56,61` nur bei `!existsSync(MODULE)`; neuer Test
  „`tlReactControls.css` existiert nicht“; `foreignTl` liest nur noch `react-src` und Engine-Sheets; `inventory.mjs` meldet
  „gelöscht“ statt zu werfen.
- **K15 (Task 4) Ziehen mit dem Finger:** `dragging` kommt über den bestehenden `dragstart`-Pfad der Controls (React
  besitzt `data-tl-state` an diesen Elementen: `TLTableView.tsx:1519`, `TLKanbanBoard.tsx:604`, `TLCalendar.tsx:797`,
  `list-reorder.ts:190`) — `touch-drag.ts` setzt es nicht von Hand. „Bereit“ setzt die Bridge an einem **eigenen**
  Attribut `data-tl-armed` (ein Re-Render verwirft es nicht); `drag.css` zeichnet `[data-tl-armed]`. `data-touch-drag`
  fällt. Vitest prüft `data-tl-armed` und dass `data-tl-state` unberührt bleibt.
- **K16 (Task 1, 2, 4, 5) Kleines:** `derive`-Test so formulieren, wie `derive` schreibt (Rolle in beiden Blöcken, hell
  ggf. `#FFFFFF`); Nachführung von `text-inverse` (`derive.mjs:214`) im Bericht vermerken. `form.css:206` (`tlFill`)
  mitziehen. `TLChart.tsx` liegt in `react-src/controls/`. `tokens.test.mjs:213`. Picker-Escape über
  `bridge/keyboard-dispatcher.ts:33–46` (`createScope`, `registerScope`); im Vitest `initKeyboardDispatcher()`. Tooltip:
  zuerst `anchoring()` (`TooltipPopover.tsx:60–78`) und die Referenz im Layout-Effekt prüfen; im Test
  `getBoundingClientRect` beider Anker mocken (wie `MuiSliderAdapter.test.tsx:48`), `ResizeObserver` stubben,
  `vi.useFakeTimers` über `HOVER_DELAY_MS`.

## Global Constraints

- Ticket **#29914**; Commits beider Repos mit Präfix `Ticket #29914:`, Paket-Commits deutsch, Engine-Commits englisch,
  Trailer `Co-Authored-By: <Modell des Ausführenden> <noreply@anthropic.com>`.
- Engine-Branch `CWS/CWS_29914_design_system_welle_5d` im Worktree `_Working-Tree/tl8-wt-29584` (auf 5c, Head
  `3ec1eb2ad8`). **Kein Push** — Subagenten committen lokal und melden.
- Paket: `tokens.json` nur Referenzen; im CSS nur Tokens; `dist/` nur über `node tools/generate.mjs`, danach
  `node tools/publish-to-worktree.mjs` (Kopie versiegelt).
- **Kein neues Bedienkonzept** (Hendrik 20.10.): Umzug, Zusammenlegen, Fokus, Ansage; kaputte Bedienung wird repariert.
  Einzige neue Einstellung: „Kompakt“ im Benutzermenü (Spec §6a).
- Alte Theme-Tokens (`--text-primary`, `--layer-01` …) und `UIThemeService`-Werte bleiben als Brücke (V17); 5d liest
  sie nur nicht mehr. `data-tl-theme`, Versionsstempel, Glass-Theme der Demo: nicht in 5d.
- Zustände sind Attribute (`aria-*`, `data-tl-state`), nie Modifier-Klassen wie `--active`, `--flash`, `--edit`,
  `--view`, `--interactive`, `--error`, `--noData`.
- Typo nur über Typo-Klassen (`tl-type-*`) im Paket-CSS; Bibliotheks-CSS (`.cm-*`, `.ProseMirror`) darf
  `--tl-font-size-*` und `--tl-font-family-*` lesen, wo keine Klasse angebracht werden kann.
- Jeder Block, der `display` setzt, setzt danach `.tl-x[hidden] { display: none; }`.
- Jeder Pflichtbegriff eines Vertrags steht unmittelbar nach einem Backtick, eine Klasse je Backtick-Paar.
- React in Controls nur aus `'tl-react-bridge'`; in `bridge/*.ts` aus `'react'` wie die Nachbardateien.
- Glyphen nur über Konstanten in `bridge/icons.ts` (Font Awesome). Kein englisches Literal als `aria-label` oder
  sichtbarer Text; alles über `useI18N`/`I18NConstants` (`messages_en` erzeugt, Deutsch von Hand, sortiert).
- Keine Custom Property `--tl-…` außerhalb von `dist/` (auch nicht lokal in fremden Stylesheets).
- Keine Zeitangaben in Docs und Commits.

## Review Focus

1. **Tooltip beim Wechsel des Ankers** (Spaltenkopf → nächster Spaltenkopf, Zeiger bleibt auf den Köpfen): der Tooltip
   steht am neuen Element, nicht am alten. Vitest in Task 5.
2. **Wysiwyg: Enter/Leertaste auf „Fett“ mit markiertem Text** wendet Fett auf die Markierung an und lässt Markierung und
   Fokus im Text; Klick ebenso. Vitest in Task 9.
3. **Diagramm mit zehn Reihen und Wechsel hell → dunkel:** Reihe 9 und 10 nehmen Kategorie 1 und 2; nach dem Wechsel
   haben Reihen, Gitter und Beschriftung die Werte des dunklen Modus, ohne Neuladen; eine Reihe mit eigener Farbe vom
   Server behält sie. Vitest in Task 10.
4. **Dichte „Kompakt“ nach Neuladen:** `html` trägt `data-tl-density="compact"` schon im ersten HTML (kein Springen);
   Umschalten wirkt sofort, Tabellenzeilen (über `useTokenPx`) folgen. Test in Task 7.
5. **Escape im Element-Picker innerhalb eines offenen Dialogs** beendet nur den Picker, der Dialog bleibt; **Ablehnung
   beim Ziehen mit dem Finger**: der Hinweis liegt über dem Zieh-Bild. Vitest in Task 4.

---

### Task 1: Paket — Ebenen und inverse Rollen

**Korrekturen aus dem Plan-Review: K16** (Abschnitt oben; sie gehen dem Task-Text vor).

**Files:**
- Modify: `design-system/src/primitives.json` (`depth-6` = `"1300"`, `depth-7` = `"1400"`), `design-system/src/tokens.json`
  (`layer.layer-tooltip` = `{depth-6}`, `layer.layer-drag` = `{depth-7}`; Farben hell `surface-inverse` = `{gray-77}`,
  `text-inverse` = `{gray-0}`, dunkel `surface-inverse` = `{gray-1}`, `text-inverse` = `{gray-77}`),
  `design-system/tools/lib/pairs.mjs` (Paar `text-inverse`/`surface-inverse`, Soll 4.5)
- Modify (bestehende Tests): `test/tokens.test.mjs:214` (Ebenenliste um `layer-tooltip`, `layer-drag`), weitere Zähltests
  nach Lauf
- Test: `design-system/test/fundament.test.mjs` (neu), `design-system/test/derive.test.mjs`

**Interfaces:**
- Produces: `--tl-layer-tooltip`, `--tl-layer-drag`, `--tl-surface-inverse`, `--tl-text-inverse`.

- [ ] **Step 1: Failing tests** in `fundament.test.mjs`: `Ebenen: tooltip über toast, drag über tooltip` (Werte
  1200 < 1300 < 1400 aus `dist/primitives.css`/`tokens.css`); `inverse Rollen halten 4,5:1 in beiden Modi`;
  in `derive.test.mjs`: `das Probe-Theme trägt surface-inverse und text-inverse aus seiner Grauwahl` (warm: `gray-77`
  und `gray-0` der warmen Rampe) und `das Paar text-inverse/surface-inverse steht in der Paarliste`.
- [ ] **Step 2: Run** `node --test test/fundament.test.mjs test/derive.test.mjs` — FAIL.
- [ ] **Step 3: Implement** die Werte oben; `derive` braucht keinen eigenen Schritt (die Rollen zeigen auf die Grau-
  Rampe, die `derive` rechnet) — prüfen, dass `derive` sie schreibt; falls nicht, im Bericht nennen.
- [ ] **Step 4: Run** `node tools/generate.mjs && node tools/lint-css.mjs && node tools/derive.mjs
  test/fixtures/probe.primitives.json specimen/probe.theme.css && node tools/publish-to-worktree.mjs && node --test` —
  grün (angepasste Zähltests im Bericht nennen).
- [ ] **Step 5: Commit** Paket „Ticket #29914: Paket -- Ebenen tooltip und drag, inverse Rollen“; Engine (Kopie)
  „Ticket #29914: Design system package -- tooltip and drag layers, inverse roles.“

### Task 2: Paket — Fundament, Ziehen, Picker, „Aktion beim Zeigen“

**Korrekturen aus dem Plan-Review: K1, K2, K6, K15, K16** (Abschnitt oben; sie gehen dem Task-Text vor).

**Files:**
- Modify: `design-system/tools/generate.mjs` (baseCss: `html, body { height: 100%; overflow: hidden }`,
  `.is-control { height: 100% }`, `.is-control > .tl-stack { height: 100% }`, `[data-react-module] { width: 100%;
  height: 100% }`; Anker-Aufblitzen `[data-tl-anchor][data-tl-state~="flash"]` mit `@keyframes tl-anchor-flash`
  aus `box-shadow: 0 0 0 var(--tl-focus-width) var(--tl-focus-ring)` → `transparent`, Dauer `--tl-duration-loop`,
  Ecke `--tl-radius-sm`), `src/components/layout/layout.{css,contract.md}` (`.tl-fill { flex: 1; min-height: 0 }`,
  `.tl-item:has(> .tl-fill) { flex: 1 }`; Kommentar „bis Welle 5 im alten Stylesheet“ weg),
  `src/components/drag/drag.{css,contract.md}` (`tl-drag-shield`: `position: fixed; inset: 0; z-index:
  var(--tl-layer-drag); user-select: none`; `tl-drag-image`: `z-index: var(--tl-layer-drag)`, `opacity: 0.9`,
  `box-shadow: var(--tl-shadow-drag)`; `[data-tl-state~="drag-armed"]`: `box-shadow: var(--tl-shadow-drag)`,
  `transform: scale(1.02)`, `transition` über `--tl-duration-fast`; `@media (pointer: coarse)
  { [draggable="true"] { -webkit-touch-callout: none; user-select: none } }`; `.tl-popover.tl-drop-hint` liest
  `z-index: var(--tl-layer-drag)`; `tl-pick-highlight`: `position: fixed; pointer-events: none; z-index:
  var(--tl-layer-drag); border: var(--tl-border-width-md) solid var(--tl-border-interactive); background:
  var(--tl-surface-brand-subtle); opacity` einheitenlos; `body[data-tl-state~="picking"], body[data-tl-state~="picking"] *
  { cursor: crosshair }`), `src/components/reorder-list/reorder-list.css` (Griff liest `tl-reveal-on-hover`),
  `specimen/index.html`
- Create: Regel `tl-reveal-on-hover` (in `layout.css` oder eigenem Block `reveal`, Vertrag): verborgen (`opacity: 0`,
  Übergang `--tl-duration-fast`), sichtbar bei `.tl-table__row:hover .tl-reveal-on-hover`, `:hover > .tl-reveal-on-hover`
  des direkten Elternteils, `.tl-reveal-on-hover:focus-visible`, und immer unter `@media (hover: none)`
- Test: `test/fundament.test.mjs`, `test/contracts-5d.test.mjs` (neu, Aufbau wie `contracts-5c.test.mjs`)

**Interfaces:**
- Produces (Klassen/Zustände): `tl-fill`, `tl-drag-shield`, `tl-drag-image`, `data-tl-state~="drag-armed"`,
  `tl-pick-highlight`, `body[data-tl-state~="picking"]`, `[data-tl-anchor][data-tl-state~="flash"]`,
  `tl-reveal-on-hover`.

- [ ] **Step 1: Failing tests** (`fundament.test.mjs`): je Regel oben ein Test, der die Deklarationen liest (Muster wie
  `planen.test.mjs`); `drag.css` bleibt der einzige Block mit Ziehen-Zuständen (`drag.test.mjs` grün halten); kein
  `z-index: \d`, kein `#hex`, kein `rgba(` in den geänderten Dateien; der Griff der Liste und `tl-reveal-on-hover` haben
  genau eine Einblende-Regel (keine zweite Fassung in `reorder-list.css`). `contracts-5d`: `layout` (`tl-fill`),
  `drag` (`tl-drag-shield`, `tl-drag-image`, `drag-armed`, `tl-pick-highlight`, `--tl-layer-drag`).
- [ ] **Step 2: Run** — FAIL.
- [ ] **Step 3: Implement** die Regeln und Verträge (Leser: `pointer-drag.ts`, `touch-drag.ts`, `element-picker.ts`,
  `scroll.ts`, `fill.ts`).
- [ ] **Step 4: Run** Kette wie Task 1 und `node --test` — grün (auch `focus-clip`, `hidden`, `drag`).
- [ ] **Step 5: Commit** Paket „Ticket #29914: Paket -- Füllen, Viewport, Anker, Ziehen, Picker, Aktion beim Zeigen“;
  Engine (Kopie).

### Task 3: Paket — `tl-tooltip`, `tl-rich-text`, `tl-compact-field`, Menü und Leiste

**Korrekturen aus dem Plan-Review: K3, K4, K5, K12** (Abschnitt oben; sie gehen dem Task-Text vor).

**Files:**
- Create: `design-system/src/components/tooltip/tooltip.{css,contract.md,spec.html}`,
  `src/components/rich-text/rich-text.{css,contract.md,spec.html}`,
  `src/components/compact-field/compact-field.{css,contract.md,spec.html}`
- Modify: `src/components/menu/menu.contract.md` (`menuitemradio` mit `aria-checked`, Gruppe über `ButtonDefaults`
  `radio`), `src/components/toolbar/toolbar.{css,contract.md}` (`tl-toolbar--wrap`: nur `flex-wrap: wrap`),
  `src/components/select/select.css` (Öffner-Regel als gemeinsamer Selektor mit `tl-compact-field__opener`),
  `src/components/popover/popover.contract.md` (Rückgabeziel: Auslöser oder vom Aufrufer genanntes Ziel),
  `tools/lint-css.mjs` (neue Blöcke), `specimen/index.html`
- Test: `test/fundament.test.mjs`, `test/contracts-5d.test.mjs`

**Interfaces:**
- Produces: `tl-tooltip` (`__caption` mit `tl-type-label-strong`, `__body` mit `tl-type-label`, `__arrow`),
  `data-tl-state~="interactive"` am Tooltip; `tl-rich-text` (am Editorrahmen `tl-field`; Fläche mit `tl-prose`;
  Regeln: Innenabstand `--tl-space-sm`/`--tl-space-md`, Mindesthöhe `--tl-size-10`, `th` Fläche
  `--tl-surface-layer-nested`, Bildauswahl `.ProseMirror-selectednode` mit Ring aus `--tl-focus-*`, Spaltengriff
  `--tl-border-interactive`); `tl-compact-field` (`__preview`, `__opener`; bearbeitbar `tl-field` und
  `data-tl-state~="edit"`); `tl-toolbar--wrap`; `menuitemradio`.

- [ ] **Step 1: Failing tests:** `tooltip: Fläche surface-inverse, Schrift text-inverse, Pfeil gleich gefüllt,
  layer-tooltip, Breite size-13, Ecke radius-md, drop-shadow aus shadow-popover, keine Schriftgröße im CSS`;
  `rich-text: Regeln oben, kein outline: none`; `compact-field: Öffner teilt die Regel mit tl-select (ein Selektor),
  liest tl-reveal-on-hover`; `toolbar--wrap`; Verträge (`menuitemradio` nach Backtick, `tl-tooltip`, `tl-rich-text`,
  `tl-compact-field`); `SPECIMEN` um die drei neuen Seiten.
- [ ] **Step 2: Run** — FAIL.
- [ ] **Step 3: Implement**; Specimen: Tooltip mit Überschrift, Text, Pfeil, interaktiv, hell/dunkel; Editor mit
  Überschrift, Liste, Tabelle mit Kopf, Code, Zitat, ausgewähltem Bild, Fehler; Compact field lesend und bearbeitbar in
  einer Tabellenzeile.
- [ ] **Step 4: Run** Kette und `node --test` — grün; Specimen ansehen (headless Screenshot, hell und dunkel).
- [ ] **Step 5: Commit** Paket „Ticket #29914: Paket -- tl-tooltip, tl-rich-text, tl-compact-field, menuitemradio,
  Leiste mit Umbruch“; Engine (Kopie).

### Task 4: Engine — Fundament: Füllen, Anker, Picker, Ziehen

**Korrekturen aus dem Plan-Review: K1, K12, K15, K16** (Abschnitt oben; sie gehen dem Task-Text vor).

**Files:**
- Modify: `com.top_logic.layout.react/react-src/bridge/fill.ts:18` (`FILL_CLASS = 'tl-fill'`), `bridge/scroll.ts`
  (Zustand `flash` statt Klasse), `bridge/element-picker.ts` (`tl-pick-highlight` als Klasse statt `#tl-pick-highlight`,
  `data-tl-state~="picking"` am `body`, Escape über `createScope`/`registerScope` aus `bridge/tl-react-bridge.ts:775–783`
  statt Capture-Listener `:100–106,122,131`), `bridge/pointer-drag.ts:29,103` (`tl-drag-shield`), `bridge/touch-drag.ts`
  (`ATTR_TOUCH_DRAG` fällt: Quelle `data-tl-state~="dragging"`, bereit `~="drag-armed"`, Bild `tl-drag-image`; die
  Zustände an `data-tl-state` anhängen und entfernen, ohne andere Wörter zu verlieren), `controls/DropHint.tsx` (im DOM
  nach dem Zieh-Bild), `tlReactControls.css` (Blöcke „Viewport-filling layout“, „Fill contract“, „Repeated items“,
  „React mount point“, „Drag shield“, „Touch drag“, „Element picker“, Anker-Regeln löschen), `tlReactBase.css` (nur
  `background-image` bleibt), `design-system/test/ratchet.json`
- Modify (Tests, die `tlFill` als Ausnahme filtern): `com.top_logic.layout.react.mui/react-src/adapters/planen.test.tsx`,
  `media.test.tsx`, `MuiTabBarAdapter.test.tsx` (Ausnahme fällt; Paketklasse)
- Test: `com.top_logic.layout.react.mui/react-src/adapters/fundament.test.tsx` (neu; Registry wie `planen.test.tsx`)

**Interfaces:**
- Consumes: Klassen und Zustände aus Task 2.

- [ ] **Step 1: Failing Vitest:** `fill marks with tl-fill`; `anchor flash sets and clears data-tl-state flash`;
  `picker: highlight has class tl-pick-highlight, body carries data-tl-state picking while active`; **`picker: Escape
  inside an open dialog stops only the picker`** (Review Focus 5; Dialog bleibt, sein Escape-Handler läuft nicht);
  `pointer drag shield has class tl-drag-shield`; `touch drag: source gets data-tl-state dragging, armed gets
  drag-armed, existing state words are kept, image has class tl-drag-image`; **`drop hint lies after the touch drag
  image in the DOM`** (Review Focus 5).
- [ ] **Step 2: Run** `NODE_OPTIONS=--no-experimental-webstorage npx vitest run react-src/adapters/fundament.test.tsx`
  im MUI-Modul — FAIL.
- [ ] **Step 3: Implement**; alte Blöcke löschen; Ratsche auf Messwert (`node tools/inventory.mjs`), Vermerk.
- [ ] **Step 4: Run** Vitest gesamt, `tsc` (`layout.react`, `.mui`), Paket `node --test`, Maven `layout.react` `test`
  (`-DskipTests=false`, JDK 21) — grün.
- [ ] **Step 5: Commit** Engine „Ticket #29914: Fill, anchor, element picker and drag read the design system package;
  the picker's Escape goes through the keyboard dispatcher.“; Paket „Ticket #29914: Ratsche -- Fundament gestrichen“.

### Task 5: Engine — Tooltip

**Korrekturen aus dem Plan-Review: K13, K16** (Abschnitt oben; sie gehen dem Task-Text vor).

**Files:**
- Modify: `com.top_logic.layout.react/react-src/bridge/TooltipPopover.tsx:117–147` (Klassen `tl-tooltip`,
  `tl-tooltip__caption`, `__body`, `__arrow`; `data-tl-state~="interactive"` statt `--interactive`),
  `bridge/tooltip-host.ts` (Ankerwechsel), `tlReactControls.css` (Block „Tooltip“ löschen), `design-system/test/ratchet.json`
- Test: `com.top_logic.layout.react.mui/react-src/adapters/fundament.test.tsx`

- [ ] **Step 1: Reproduce** den Ankerfehler (superpowers:systematic-debugging): Vitest `tooltip follows the new anchor
  when the pointer moves to the next element while open` — zwei Elemente mit `data-tooltip`, Zeiger auf A, Tooltip
  offen, Zeiger auf B; erwartet: Inhalt von B **und** Referenz/Lage an B (über die Referenz, die floating-ui bekommt,
  oder `getBoundingClientRect` des Ankers in der Lageberechnung). Ursache im Bericht mit Datei:Zeile.
- [ ] **Step 2: Failing Vitest** für die Klassen: Wurzel `tl-tooltip` mit `role="tooltip"`, `__caption`, `__body`,
  `__arrow`; interaktiv `data-tl-state~="interactive"`; keine Klasse `tl-tooltip-popover*`.
- [ ] **Step 3: Implement** Ursache beheben, Klassen umstellen, Block löschen, Ratsche.
- [ ] **Step 4: Run** Vitest, `tsc`, Paket `node --test` — grün.
- [ ] **Step 5: Commit** Engine „Ticket #29914: The tooltip reads the design system package and follows the anchor the
  pointer moves to.“; Paket Ratsche.

### Task 6: Engine — Compact field

**Korrekturen aus dem Plan-Review: K6** (Abschnitt oben; sie gehen dem Task-Text vor).

**Files:**
- Modify: `com.top_logic.layout.react/src/main/java/com/top_logic/layout/react/control/form/ReactCompactFieldControl.java:161–176,
  250, 264, 342` (Klassen `tl-compact-field`, `__preview`, `__opener` mit `tl-reveal-on-hover` im Lesemodus; bearbeitbar
  `tl-field` + `data-tl-state~="edit"` statt `--edit`/`--view`), `com.top_logic.layout.react/src/test/java/test/com/top_logic/layout/react/field/TestCompactField.java:406–433`,
  `tlReactControls.css` (Block „Compact field“), `design-system/test/ratchet.json` (Block war `unlisted`: Vermerk)

- [ ] **Step 1: Failing test:** `TestCompactField` erwartet die neuen Klassen und den Zustand.
- [ ] **Step 2: Run** Maven `-Dtest=test.com.top_logic.layout.react.field.TestCompactField` — FAIL.
- [ ] **Step 3: Implement**; Block löschen.
- [ ] **Step 4: Run** Maven `layout.react` `test`, Paket `node --test` — grün.
- [ ] **Step 5: Commit** Engine „Ticket #29914: The compact field reads the design system package.“

### Task 7: Engine — Dichte im Benutzermenü

**Korrekturen aus dem Plan-Review: K8, K9** (Abschnitt oben; sie gehen dem Task-Text vor).

**Files:**
- Modify: `com.top_logic.layout.react/src/main/java/com/top_logic/layout/react/theme/UIThemeService.java:83–89,449–512`
  (gewählte Dichte je Person aus `PersonalConfiguration`, Schlüssel `react.density`, Werte `normal`/`compact`; Server
  schreibt `data-tl-density` ins erste HTML am `html`; Client-API `window.tlTheme.density(value)` neben `select`),
  `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/command/ThemeCommands.java` (Umschalter „Kompakt“
  als `menuitemcheckbox` hinter den Themes), neu `com.top_logic.layout.view/.../command/SetDensityCommand.java` (wie
  `SetThemeCommand.applyTheme`: speichern, per `JSSnipplet` anwenden), `I18NConstants` (`DENSITY_COMPACT`: „Compact“ /
  „Kompakt“), `messages_de.properties`
- Test: Java-Test neben den Tests von `SetThemeCommand`/`UIThemeService` (Name nach Nachbarn) und Vitest für
  `window.tlTheme.density` in `fundament.test.tsx`

- [ ] **Step 1: Failing tests:** gespeicherte Dichte `compact` → die Seite trägt `data-tl-density="compact"` im ersten
  HTML (**Review Focus 4**); ohne Wahl `normal`; der Befehl speichert und schickt `density('compact')`; der Client setzt
  das Attribut sofort, und ein Wert über `useTokenPx` (`--tl-size-row`) ändert sich ohne Neuladen.
- [ ] **Step 2: Run** — FAIL.
- [ ] **Step 3: Implement**; `messages_en` über `check-messages-en.sh`.
- [ ] **Step 4: Run** Maven `layout.react`, `layout.view` (englische Locale per `-DargLine="-Duser.language=en
  -Duser.country=US"`), Vitest, `check-messages-en.sh` — grün.
- [ ] **Step 5: Commit** Engine „Ticket #29914: The user menu offers a compact density, stored per person.“

### Task 8: Engine — Menü-Bausteine in der Bridge, Radio-Einträge

**Korrekturen aus dem Plan-Review: K10** (Abschnitt oben; sie gehen dem Task-Text vor).

**Files:**
- Move: `com.top_logic.layout.react/react-src/controls/menu/Menu.tsx` → `bridge/menu.tsx` (Importe wie die
  Nachbardateien in `bridge/`); Leser im Controls-Bundle importieren aus `'tl-react-bridge'`
- Modify: `bridge-entry.ts` (Export `Menu`, `MenuItem`, `useRovingMenu`), `bridge/button-defaults.ts:50–53`
  (`ButtonDefaultsValue.radio?: boolean` → Rolle `menuitemradio`), `bridge/parts.ts:958–970` (`aria-checked` auch für
  Radio)
- Test: `com.top_logic.layout.react.mui/react-src/adapters/fundament.test.tsx`

**Interfaces:**
- Produces: `import { Menu, MenuItem, useRovingMenu } from 'tl-react-bridge'`; `<ButtonDefaults appearance="menu-item"
  radio>` → Einträge `role="menuitemradio"` mit `aria-checked` aus `checked`.

- [ ] **Step 1: Failing Vitest:** Menü aus der Bridge montiert, Pfeile bewegen den Fokus, Escape schließt; Radio-Gruppe
  hat genau einen Eintrag `aria-checked="true"`.
- [ ] **Step 2: Run** — FAIL. **Step 3: Implement.** **Step 4: Run** Vitest gesamt (bestehende Menütests grün), `tsc`.
- [ ] **Step 5: Commit** Engine „Ticket #29914: Menu, menu item and roving menu are bridge API; menu entries can be
  radio items.“

### Task 9: Engine — Wysiwyg

**Korrekturen aus dem Plan-Review: K3, K7, K11, K12** (Abschnitt oben; sie gehen dem Task-Text vor).

**Files:**
- Modify: `com.top_logic.layout.react.wysiwyg/react-src/controls/WysiwygToolbar.tsx` (ganz), `TLWysiwygEditor.tsx:55–61,
  196–215` (Fläche `tl-prose`, Rahmen `tl-field tl-rich-text`, Fehler `aria-invalid`), `TLWysiwygEditor.css` (nur noch,
  was die Bibliothek braucht und das Paket nicht hat; keine `--tl-*`-Definition, kein `outline: none`, kein z-index),
  `package.json` (Radix raus), `com.top_logic.layout.react/react-src/bridge/icons.ts` (Glyphen der Leiste),
  Wysiwyg-`I18NConstants` und `messages_de.properties` (Name der Leiste u. a.), `TestWysiwygStylesheetTokens.java`
  (liest `tl-design-system/tokens.css` mit, wie `TestReactStylesheetTokens`)
- Test: `com.top_logic.layout.react.mui/react-src/adapters/wysiwyg.test.tsx` (neu; bindet `TLWysiwygEditor` über die
  Registry ein)

**Interfaces:**
- Consumes: `Menu`, `MenuItem`, `useRovingMenu`, `ButtonDefaults radio` (Task 8); `tl-toolbar--wrap`, `tl-rich-text`,
  `menuitemradio` (Task 3); `usePopover`, `useFocusTrap`, `useCloseOnOutsidePress`, Part `Button`, `MenuTrigger`.

- [ ] **Step 1: Failing Vitest:** Leiste `tl-toolbar tl-toolbar--wrap` mit `role="toolbar"` und übersetztem Namen,
  Gruppen `tl-toolbar__group`, Trenner `tl-divider`; Umschalter mit `aria-pressed`; **Enter und Leertaste auf „Fett“
  wenden Fett auf die Markierung an, Fokus und Markierung bleiben im Text** (Review Focus 2); Absatzformat-Menü mit
  `menuitemradio` (genau einer `aria-checked`); Link-Popup `tl-popover` mit `label`+`tl-field` (verbunden über `id`),
  „Übernehmen“ deaktiviert bei leerem Feld, nach dem Schließen Fokus im Text; Fläche `.ProseMirror.tl-prose`; keine
  Klasse `tlWysiwyg*`, kein Element mit `data-radix-*`.
- [ ] **Step 2: Run** — FAIL.
- [ ] **Step 3: Implement**; `npm`-Abhängigkeiten offline prüfen (Radix entfernen, `package-lock.json` mitziehen,
  wie es das Modul vorsieht).
- [ ] **Step 4: Run** Vitest, `tsc` (Wysiwyg-Modul), Maven `layout.react.wysiwyg` `test` (Audit), `check-messages-en.sh`.
- [ ] **Step 5: Commit** Engine „Ticket #29914: The rich text editor builds its toolbar, menus and link popup from the
  design system's parts; Radix is gone.“

### Task 10: Engine — Diagramme

**Korrekturen aus dem Plan-Review: K7, K12** (Abschnitt oben; sie gehen dem Task-Text vor).

**Files:**
- Modify: `com.top_logic.layout.react.chartjs/react-src/controls/chart/useThemeDefaults.ts:15–88` (Farben aus
  `--tl-category-N-surface` am `<html>`, Gitter `--tl-border-separator`, Text `--tl-text-secondary`; neu lesen bei
  Wechsel von `data-tl-mode`/`data-tl-theme` über `MutationObserver` am `html`; Alpha weiter als Hex-Suffix, die Tokens
  sind `#RRGGBB`), `TLChart.tsx:110–151` (leer/Fehler `tl-status` mit `role="status"`/`role="alert"`, Canvas
  `role="img"` mit Namen über I18N), `chart/ChartTooltip.tsx` (Klassen `tl-popover tl-chart__tooltip`, Lage absolut
  am Punkt), `src/main/webapp/style/tl-react-chartjs.css` (Paket-Tokens; `layer-sticky`/`layer-raised`),
  `src/main/java/.../chartjs/Icons.java:25–109` und `ReactChartJsControl.java:40,112` (Palette und `themeColors`
  entfallen), Audit-Test des Moduls (liest `tokens.css` mit)
- Test: `com.top_logic.layout.react.mui/react-src/adapters/chart.test.tsx` (neu)

- [ ] **Step 1: Failing Vitest:** **zehn Reihen → Reihe 9/10 = Kategorie 1/2; nach `data-tl-mode="dark"` neue Werte
  ohne Neuladen; eigene Serverfarbe bleibt** (Review Focus 3; Custom Properties in jsdom am `documentElement` setzen,
  wie `textOn` in 5c); leer → `tl-status` `role="status"`; Fehler → `role="alert"`; Canvas `role="img"`.
- [ ] **Step 2: Run** — FAIL. **Step 3: Implement.**
- [ ] **Step 4: Run** Vitest, `tsc` (chartjs), Maven `layout.react.chartjs` `test`, `check-messages-en.sh`.
- [ ] **Step 5: Commit** Engine „Ticket #29914: Charts take their series colours from the theme's categories and follow
  mode changes.“

### Task 11: Engine — Editoren, Flow, Demo, MUI-Text

**Korrekturen aus dem Plan-Review: K12** (Abschnitt oben; sie gehen dem Task-Text vor).

**Files:**
- Modify: `com.top_logic.layout.react.codeedit/src/main/webapp/style/tlCodeEditor.css`, `TLCodeEditor.tsx:105–106`
  (Rahmen `tl-field`, Fehler `aria-invalid`), `com.top_logic.model.search.react/src/main/webapp/style/tlScriptEditor.css`,
  `TLScriptEditor.tsx:310` (Fehlerzustand neu, wie der Code-Editor), `tl-model-search-react.conf.config.xml:38–42`
  (`requires="tl-code-editor-css"`), `com.top_logic.react.flow.server/src/main/webapp/style/tl-react-flow.css`,
  `com.top_logic.demo.react/src/main/webapp/style/tl-demo-react.css` (bis auf Glass),
  `com.top_logic.layout.react.mui/react-src/adapters/MuiTextAdapter.tsx:43` (`--tl-text-on-brand`), die Audit-Tests
  `TestCodeEditorStylesheetTokens`, `TestScriptEditorStylesheetTokens`, `TestFlowStylesheetTokens` (lesen `tokens.css`
  mit); `tlReactBase.css` gehört zu Task 4
- Zuordnung alt → neu: Spec §10; Schrift der Editoren über `tl-type-code` am Editor-Element

- [ ] **Step 1: Failing tests:** Audits schlagen bei `var(--tl-…)` ohne `tokenStylesheets()` fehl → erst die Tests
  erweitern, dann umstellen; Vitest: Script-Editor mit Fehler trägt `aria-invalid`; kein altes Token mehr in den sieben
  Dateien außer `background-image`/Glass (Grep-Test in `design-system/test/engine-classes.test.mjs`).
- [ ] **Step 2: Run** — FAIL. **Step 3: Implement.**
- [ ] **Step 4: Run** Maven der fünf Module `test`, Vitest, `tsc`, `check-messages-en.sh`.
- [ ] **Step 5: Commit** Engine „Ticket #29914: Editors, flow, demo and base styles read the design system's roles.“

### Task 12: Löschen, Wache, Gate

**Korrekturen aus dem Plan-Review: K12, K14** (Abschnitt oben; sie gehen dem Task-Text vor).

**Files:**
- Delete: `com.top_logic.layout.react/src/main/webapp/style/tlReactControls.css`
- Modify: `tl-layout-react.conf.config.xml:92–96` (Eintrag weg), `com.top_logic.demo.react/.../demoReactConf.config.xml:711–714`
  (`requires` → `tl-design-system-components`), `TestReactStylesheetTokens.java` (Datei nicht mehr prüfen),
  Engine-Doku (`tl-docs`, Grep `tlReactControls`), `design-system/test/ratchet.test.mjs:20,28` (skip nur ohne Worktree;
  fehlt die Datei im vorhandenen Worktree, ist das der Sollzustand; legt sie jemand wieder an, schlägt der Test fehl),
  `test/ratchet.json` (leer, Vermerk), `tools/inventory.mjs` (meldet „gelöscht“),
  `design-system/test/engine-classes.test.mjs` (`ALT_5D` = `/\btlFill\b|data-touch-drag|\btlDragShield\b|\btlTouchDragImage\b|\btlPick--active\b|\btlAnchor--flash\b|\btl-tooltip-popover\b|\btlCompactField|\btlWysiwygToolbar|\btlReactChart__tooltip\b|--tl-(tt-|wysiwyg-)/`
  über react-src samt Vitest-Dateien, Stylesheets, Java, tl-docs, Views; Regex vorher gegen ein Beispiel je
  Alternative prüfen), `docs/migration/altlast.md` (Abschnitt „Welle 5d“)
- [ ] **Step 1:** Gate `ALT_5D` und Wache schreiben — sie scheitern, solange Datei und alte Namen da sind.
- [ ] **Step 2:** Löschen und nachziehen.
- [ ] **Step 3: Run** alle Gates: Paket `generate`/`lint-css`/`publish`/`node --test`; `tsc` aller React-Module; Vitest;
  Maven `layout.react`, `.wysiwyg`, `.chartjs`, `.codeedit`, `model.search.react`, `react.flow.server`, `layout.view`
  (englische Locale), `demo.react`; `check-messages-en.sh`.
- [ ] **Step 4: Commit** Engine „Ticket #29914: tlReactControls.css is gone.“; Paket „Ticket #29914: Ratsche wird
  Wache, Gate Welle 5d, altlast“.

### Task 13: Sichtprüfung lokal (Orchestrator)

Lokale Demo neu bauen und starten; hell/dunkel/kompakt: Tooltip (auch Ankerwechsel über Spaltenköpfe), Ziehen mit
Maus, Element-Picker mit Escape, Compact field in einer Tabelle, Wysiwyg (Leiste mit Tastatur, Menüs, Link), Diagramm
(Moduswechsel), Code- und Script-Editor, Benutzermenü „Kompakt“. Befunde nach `docs/ui-durchgang.md` oder sofort beheben.

### Task 14: Abschluss (Orchestrator)

Trac #29914 Lösung und Migration (`RequiresMigration`), `skalen.md`, STATUS, Präsentation v2 nur bei Änderung des
Gesamtbilds; dann Welle 5 als ein PR — Push nur nach Hendriks Freigabe.
