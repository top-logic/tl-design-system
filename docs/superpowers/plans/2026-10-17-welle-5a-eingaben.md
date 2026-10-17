# Welle 5a · Eingaben — Umsetzungsplan (#29875)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Farbfeld, Icon-Feld und Slider der React-Schicht lesen das Paket; ihre Blöcke (rund 900 Zeilen) fallen aus
`tlReactControls.css`.

**Architecture:** Das Paket bekommt `tl-swatch` (ein Block für Feldknopf, lesende Anzeige, Palettenzelle, Vorschau und
Icon-Feld), `tl-picker` (Hülle auf `tl-popover`), `tl-color-picker`, `tl-icon-picker`, `tl-slider` und zwei Rollen für
den Griff des Mischers. In der Engine teilen beide Picker eine Komponente `PickerPopover` (Lage über `usePopover`,
Fokusfalle, Schließen, `role="dialog"`) und einen Hook `useTabList`, den auch `TLTabBar` nutzt; Palette und Icon-Raster
gehen über `useRovingFocus`, der Mischer wird zwei `role="slider"`.

**Tech Stack:** Paket: CSS, `node --test`, `tools/*.mjs`, Chrome über CDP. Engine: React/TSX über `tl-react-bridge`,
TypeScript, Vite, Java 17, Maven, Vitest im MUI-Modul.

**Spec:** `docs/superpowers/specs/2026-10-17-welle-5a-eingaben-design.md` (freigegeben 17.10.); Begründungen in
`docs/skalen.md` „Welle 5a: Eingaben“; Prognose in `docs/migration/altlast.md` „Welle 5“.

## Global Constraints

- Ticket **#29875**; Commits beider Repos mit Präfix `Ticket #29875:`, Paket-Commits deutsch, Engine-Commits englisch,
  Trailer `Co-Authored-By: <Modell des Ausführenden> <noreply@anthropic.com>`.
- Engine-Branch `CWS/CWS_29875_design_system_welle_5a` im Worktree `_Working-Tree/tl8-wt-29584`, angelegt auf
  `CWS/CWS_29870_design_system_welle_4c` (Head `79c141432d`). **Kein Push** — Subagenten committen lokal und melden.
- Paket: `tokens.json` nur Referenzen; im CSS nur Tokens; `dist/` nur über `node tools/generate.mjs`, danach
  `node tools/publish-to-worktree.mjs` (Kopie versiegelt, `test/published.test.mjs`, `TestDesignSystemCopy`).
- **Kein neues Bedienkonzept** (Hendrik 17.10.): nur Umzug, Zusammenlegen, Tastatur, Fokus, Feldzustand. Keine neuen
  Funktionen (zuletzt benutzte Farben, Kategorien, Pipette, `#RGB`).
- Zustände sind Attribute (`aria-selected`, `aria-invalid`, `aria-required`, `data-tl-state`), nie Klassen
  `--active`, `--selected`, `--empty`, `--noColor`, `--immutable`, `--error`, `--warning`.
- **Datenfarben inline im TSX** (Wert, reiner Farbton, Weiß→Farbe, Farbe→Schwarz, Farbtonspektrum); das CSS des
  Pakets zeichnet nur Geometrie, Rahmen, Griffe aus Tokens. Das Lint bekommt **keine** neue Ausnahme.
- Maße: Zelle von Palette und Icon-Raster `--tl-size-control`; Mischfeld `--tl-size-12`; Farbtonregler
  `--tl-size-control-sm` breit; Icon-Popup `--tl-size-13` × `--tl-size-13`, `resize: both`; Farb-Popup ohne feste
  Breite; Slider-Daumen `--tl-size-choice`.
- Jeder Block, der `display` setzt, setzt direkt danach `.tl-x[hidden] { display: none; }` (`test/hidden.test.mjs`).
- Jeder Pflichtbegriff eines Vertrags steht unmittelbar nach einem Backtick, eine Klasse je Backtick-Paar
  (`missingInContract`).
- Die Lage eines Parts (`Button`, `TextInput`, `Spinner`) steht am Element um das Part, nie an seiner `className`.
- React in Controls nur aus `'tl-react-bridge'`; in `bridge/*.ts` aus `'react'` wie die Nachbardateien.
- `messages_en.properties` nie von Hand; `design-system/tools/check-messages-en.sh` vor dem Abschluss jeder Task mit
  Java; Deutsch in `messages_de.properties` von Hand, sortiert.
- Keine Zeitangaben in Docs und Commits.

## Review Focus

1. **Escape im Filterfeld mit Text** schließt das Icon-Popup und gibt den Fokus an den Feldknopf; das `TextInput`-Part
   verschluckt Escape nicht. Vitest in Task 6.
2. **Ein Picker in einem Fenster (`TLWindow`)**: Escape schließt nur den Picker, das Fenster bleibt offen (der Scope des
   Pickers ist der neuere). Vitest in Task 4.
3. **Palette ohne gefüllte Zelle** (`palette` nur `null`): das Raster hat keinen Tab-Halt und wirft nicht; Tab geht zum
   nächsten Element. Vitest in Task 5.
4. **Mischer bei Schwarz** (`#000000`): Pfeil hoch hebt die Helligkeit mit dem gemerkten Farbton, nicht mit Rot;
   Pfeile an der Grenze bleiben bei 0 bzw. 100. Vitest in Task 5.
5. **Lesend und deaktiviert** öffnen kein Popup; lesend ist der Swatch ein `span` ohne Knopf, deaktiviert ein
   `button[disabled]`. Vitest in Task 5 (Farbe) und Task 6 (Icon).

---

### Task 1: Paket — Swatch, Picker-Hülle, Griff-Rollen

**Files:**
- Create: `design-system/src/components/swatch/swatch.{css,contract.md,spec.html}`
- Create: `design-system/src/components/picker/picker.{css,contract.md,spec.html}`
- Modify: `design-system/src/tokens.json` (Farben `light`/`dark`: zwei Rollen), `tools/lib/pairs.mjs`,
  `tools/lint-css.mjs` (Blockliste), `src/components/{tabs,popover,button-bar}/*.contract.md` (Leser),
  `specimen/index.html`
- Create: `design-system/test/eingaben.test.mjs`, `test/contracts-5a.test.mjs`

**Interfaces:**
- Produces (Klassen): `tl-swatch`, `tl-swatch--color`, `tl-swatch--wide`, Zustand `data-tl-state~="empty"`;
  `tl-picker`, `tl-picker__tabs`, `tl-picker__actions`. Rollen `--tl-border-handle-light`, `--tl-border-handle-dark`.

- [ ] **Step 0: Branch** — im Worktree `git switch -c CWS/CWS_29875_design_system_welle_5a
  CWS/CWS_29870_design_system_welle_4c` (vorher `git fetch`; der 4c-Branch steht auf `79c141432d` oder weiter, dann
  auf seinem Head).
- [ ] **Step 1: Failing tests** in `test/eingaben.test.mjs` (Helfer wie in `test/behaelter.test.mjs`: `decl`,
  `readGenerated`, `ohneKommentar` aus `test/lib/component.mjs`):
  - `swatch: Maß size-control, Rahmen border-control, keine px` — `decl('swatch', '.tl-swatch')` enthält
    `inline-size: var(--tl-size-control)`, `block-size: var(--tl-size-control)`, `var(--tl-border-control)`;
    `ohneKommentar(readGenerated('swatch','swatch.css'))` ohne `/\d+px|#[0-9a-f]{3,6}\b/i`.
  - `swatch: keine Farbe ist ein Schachbrett aus Tokens, nur am Farb-Swatch` — Regel
    `.tl-swatch--color[data-tl-state~="empty"]` liest `--tl-surface-field` und `--tl-border-separator` und
    `--tl-space-xs`; die Regel steht nicht am bloßen `.tl-swatch[data-tl-state~="empty"]`.
  - `swatch: Fehler und Warnung am Rahmen` — `.tl-swatch[aria-invalid="true"]` liest `--tl-status-error-border`,
    `.tl-swatch[data-tl-state~="warning"]` liest `--tl-status-warning-border`.
  - `picker: Hülle liegt auf tl-popover, keine feste Breite` — `.tl-picker` ohne `width`/`inline-size`;
    `picker.contract.md` nennt `tl-popover`.
  - `tokens: Griff-Rollen in beiden Modi gleich` — `tokens.json` `color.light['border-handle-light']` ===
    `color.dark['border-handle-light']` und ebenso `-dark`.
  - In `test/contracts-5a.test.mjs` (Aufbau wie `contracts-4c.test.mjs`): `SOLL` für `swatch` (`tl-swatch`,
    `tl-swatch--color`, `tl-swatch--wide`, `data-tl-state~="empty"`, `aria-invalid`, `aria-required`,
    `--tl-border-control`), `picker` (`tl-picker`, `tl-popover`, `role="dialog"`, `aria-label`, `tl-tabs`,
    `tl-button-bar`, `useTabList`, `PickerPopover`, `Escape`), `tabs` (`useTabList`), `popover` (`tl-picker`),
    `button-bar` (`tl-picker`); `SPECIMEN = ['swatch', 'picker']`.
- [ ] **Step 2: Run** `cd design-system && node --test test/eingaben.test.mjs test/contracts-5a.test.mjs` — Expected:
  FAIL (Dateien fehlen).
- [ ] **Step 3: Rollen und Paare.** `tokens.json`: `border-handle-light` = `{gray-0}`, `border-handle-dark` =
  `{gray-77}` in `light` **und** `dark`. `pairs.mjs`: `paar('border-handle-light', 'border-handle-dark', 9.0)`;
  `border-control` auf `surface-overlay` und `surface-field` ≥ 3.0 (nur ergänzen, was `GRUENDE_FELD` nicht schon misst).
  Kommentar: „Griff des Mischers auf jeder Datenfarbe: 9:1 zwischen den Ringen sichert auf jeder Farbe einen Ring mit
  3:1 (Spec 5a §4).“
- [ ] **Step 4: `swatch.css`.** Block mit `display` → `[hidden]`-Regel; Rundung `--tl-radius-sm`; `--wide`
  `inline-size: 100%`. Schachbrett als `repeating-conic-gradient(var(--tl-surface-field) 0deg 90deg,
  var(--tl-border-separator) 90deg 180deg)` mit `background-size: calc(2 * var(--tl-space-xs)) calc(2 *
  var(--tl-space-xs))` (Grad statt Prozent — das Lint kennt `25%` nicht als Literal). Zeigen auf `button.tl-swatch`:
  halo `0 0 0 var(--tl-space-2xs) var(--tl-surface-state-hover)`; Fokus aus `base.css`.
- [ ] **Step 5: `picker.css`.** `.tl-picker`: Spalte, `gap: var(--tl-space-sm)`; `.tl-picker__tabs` ohne eigenen Rand
  (der kommt aus `tl-tabs`). Keine Breite.
- [ ] **Step 6: Lint.** In der Blockliste von `tools/lint-css.mjs`: `'tl-swatch': new Set(['color', 'wide'])`,
  `'tl-picker': new Set([])`, mit Kommentar „Leer, Fehler, Warnung: Attribute.“
- [ ] **Step 7: Verträge und Specimen.** `swatch.spec.html`: gefüllt (Inline-Farbe), leer, lesend (`span`), Fehler,
  Warnung, `--wide`. `picker.spec.html`: Hülle mit `tl-tabs` (zwei Tabs, einer `aria-selected="true"`) und
  `tl-button-bar` mit drei Knöpfen, `role="dialog"` mit deutschem `aria-label`. Links in `specimen/index.html`.
- [ ] **Step 8: Run** `node tools/generate.mjs && node tools/lint-css.mjs && node --test` — Expected: alles grün außer
  `published` (Kopie folgt in Step 9).
- [ ] **Step 9:** `node tools/publish-to-worktree.mjs`, `node --test` grün; Commit Paket „Ticket #29875: Paket --
  tl-swatch, tl-picker, Griff-Rollen des Mischers“, Engine (Kopie) „Ticket #29875: Design system package -- swatch,
  picker shell, handle roles.“

### Task 2: Paket — Farb-Picker, Icon-Picker, Slider

**Files:**
- Create: `design-system/src/components/color-picker/color-picker.{css,contract.md,spec.html}`
- Create: `design-system/src/components/icon-picker/icon-picker.{css,contract.md,spec.html}`
- Create: `design-system/src/components/slider/slider.{css,contract.md,spec.html}`
- Modify: `tools/lint-css.mjs`, `tools/lib/pairs.mjs`, `test/eingaben.test.mjs`, `test/contracts-5a.test.mjs`,
  `specimen/index.html`

**Interfaces:**
- Consumes: `tl-swatch`, `tl-picker`, Rollen aus Task 1.
- Produces (Klassen): `tl-color-picker__palette`, `__mixer`, `__field`, `__hue`, `__handle`, `__preview`,
  `__inputs`; `tl-icon-picker__filter`, `__grid`, `__cell`, `__advanced`, `__preview`; `tl-slider`,
  `tl-slider__track`, `__fill`, `__input`, `__value`, `__text`, `__sizer`.

- [ ] **Step 1: Failing tests** an `eingaben.test.mjs`:
  - `color-picker: Mischfeld size-12, Farbtonregler size-control-sm breit` — `.tl-color-picker__field` mit
    `var(--tl-size-12)` für Breite und Höhe; `.tl-color-picker__hue` mit `inline-size: var(--tl-size-control-sm)`.
  - `color-picker: Griff ist ein Doppelring aus den Griff-Rollen` — `.tl-color-picker__handle` liest
    `--tl-border-handle-light` und `--tl-border-handle-dark`; kein `box-shadow` außer `inset`.
  - `color-picker: keine Farbe im CSS` — ohne `#[0-9a-f]{3,6}` und ohne `rgb(`; das Spektrum steht nicht im CSS.
  - `icon-picker: Zelle size-control, gewählt in surface-interactive-selected, Popup size-13 mit resize` —
    `.tl-icon-picker__cell` `var(--tl-size-control)`; `[aria-selected="true"]` liest
    `--tl-surface-interactive-selected`; `.tl-picker.tl-icon-picker` mit `var(--tl-size-13)` und `resize: both`;
    keine `scrollbar`-Regel.
  - `slider: Füllung ist ein Element, Spur des range durchsichtig, kein outline:none` — `.tl-slider__fill` existiert;
    `ohneKommentar(slider.css)` ohne `--tlSlider`, ohne `outline: none`; Daumen-Pseudoelemente lesen
    `--tl-size-choice`.
  - `slider: Zustand als Attribut` — `.tl-slider[data-tl-state~="warning"]` und `.tl-slider__input[aria-invalid="true"]`
    existieren; keine `--error`/`--warning`-Klasse.
  - `contracts-5a`: `SOLL` für `color-picker` (`role="listbox"`, `role="option"`, `role="slider"`, `aria-valuetext`,
    `aria-orientation`, `useRovingFocus`, `valueChanged`, `paletteChanged`, `tl-swatch`), `icon-picker`
    (`role="listbox"`, `role="option"`, `aria-selected`, `tl-status`, `loadIcons`, `valueChanged`, `useRovingFocus`),
    `slider` (`tl-slider`, `tl-slider__fill`, `aria-valuetext`, `aria-invalid`, `aria-required`,
    `data-tl-state~="warning"`, `valueChanged`); `SPECIMEN` um `color-picker`, `icon-picker`, `slider`; ein Test,
    dass im Specimen von Palette und Icon-Raster genau eine Option `tabindex="0"` trägt.
- [ ] **Step 2: Run** — Expected: FAIL.
- [ ] **Step 3: CSS der drei Blöcke** nach Spec §4–§6 und den Interfaces oben. Slider: Spur des `range`
  (`::-webkit-slider-runnable-track`, `::-moz-range-track`) durchsichtig; `__track` liegt darunter, eingerückt um die
  halbe Daumenbreite, Ruhe in `--tl-border-control`, `__fill` in `--tl-surface-brand`; Daumen in `--tl-surface-brand`,
  halo beim Zeigen/Drücken wie heute; `prefers-reduced-motion` ohne Übergang.
- [ ] **Step 4: Paare** (nur fehlende ergänzen): `surface-brand` auf `surface-field` 3.0 (Daumen, Füllung);
  `text-primary` und `icon-primary` auf `surface-interactive-selected` 4.5/3.0 (gewählte Icon-Zelle).
- [ ] **Step 5: Lint** — `'tl-color-picker': new Set([])`, `'tl-icon-picker': new Set([])`, `'tl-slider': new Set([])`.
- [ ] **Step 6: Verträge, Specimen** — Palette mit gefüllten und leeren Zellen, Mischer (Inline-Spektrum im Specimen
  ist erlaubt: Specimen ist Daten), Raster mit gewählter Zelle, `tl-status` für lädt/leer/Fehler, Slider in Ruhe, Fehler,
  Warnung, deaktiviert.
- [ ] **Step 7: Run** `node tools/generate.mjs && node tools/lint-css.mjs && node tools/publish-to-worktree.mjs &&
  node --test` — Expected: alles grün, `focus-clip` misst die neuen Seiten mit.
- [ ] **Step 8: Commit** Paket „Ticket #29875: Paket -- tl-color-picker, tl-icon-picker, tl-slider“, Engine (Kopie)
  englisch.

### Task 3: Engine — Hook `useTabList`, `TLTabBar` darauf

**Files:**
- Create: `com.top_logic.layout.react/react-src/bridge/tab-list.ts`
- Modify: `react-src/bridge-entry.ts` (Export), `react-src/controls/TLTabBar.tsx` (Zeilen 40–57 und die Tab-Attribute)
- Create: `com.top_logic.layout.react.mui/react-src/adapters/pickers.test.tsx`

Alle Engine-Pfade relativ zu `_Working-Tree/tl8-wt-29584/`.

**Interfaces:**
- Produces (aus `'tl-react-bridge'`):
  `useTabList(options: { idPrefix: string; ids: string[]; selected: string; onSelect: (id: string) => void }):
  { onListKeyDown: (e: React.KeyboardEvent) => void; tabProps: (id: string) => TabProps; panelProps: (id: string) =>
  PanelProps }` mit `TabProps = { id; role: 'tab'; 'aria-selected': boolean; 'aria-controls': string; tabIndex: 0 | -1;
  type: 'button'; onClick: () => void }`, `PanelProps = { id; role: 'tabpanel'; 'aria-labelledby': string; hidden:
  boolean }`. Ids: `${idPrefix}-tab-${id}`, `${idPrefix}-panel-${id}`.
- Tastatur wie heute in `TLTabBar`: Pfeil rechts/links zyklisch, Pos1, Ende — fokussieren **und** wählen.

- [ ] **Step 1: Failing Vitest** `pickers.test.tsx`, `describe('useTabList')` über eine kleine Testkomponente:
  Pfeil rechts auf dem letzten Tab fokussiert und wählt den ersten (`onSelect` mit dessen id); Pos1/Ende; nur der
  gewählte Tab hat `tabIndex 0`; `aria-controls` zeigt auf das Panel mit passender `aria-labelledby`. Und
  `describe('TLTabBar')`: Pfeil rechts sendet `selectTab` mit der nächsten id (wie heute).
- [ ] **Step 2: Run** `cd com.top_logic.layout.react.mui && NODE_OPTIONS=--no-experimental-webstorage npx vitest run
  react-src/adapters/pickers.test.tsx` — Expected: FAIL (`useTabList` fehlt).
- [ ] **Step 3: Implement** `useTabList` in `bridge/tab-list.ts`; `TLTabBar` nutzt ihn (`onSelect` sendet
  `selectTab`), `data-tab-id` und `focusTab` entfallen.
- [ ] **Step 4: Run** Vitest (Datei und alle), `npx tsc --noEmit -p tsconfig.json` in `com.top_logic.layout.react` —
  Expected: grün, 0.
- [ ] **Step 5: Commit** „Ticket #29875: One keyboard for tab lists -- useTabList in the bridge, the tab bar on it.“

### Task 4: Engine — `PickerPopover`

**Files:**
- Create: `com.top_logic.layout.react/react-src/controls/picker/PickerPopover.tsx`
- Modify: `com.top_logic.layout.react.mui/react-src/adapters/pickers.test.tsx`

**Interfaces:**
- Consumes: `usePopover`, `useFocusTrap`, `useStandaloneKeyboardScope`, `useCloseOnOutsidePress`,
  `anchoredOverlayProps`, `createPortal` (alle aus `'tl-react-bridge'`).
- Produces: `PickerPopover: React.FC<{ anchor: HTMLElement | null; label: string; className?: string;
  initialFocus: 'first' | ((root: HTMLElement) => HTMLElement | null); onClose: () => void; children: React.ReactNode }>`
  — rendert per Portal `div.tl-popover.tl-picker[.className][role="dialog"][aria-label={label}]` mit
  `{...anchoredOverlayProps}`, Lage `usePopover({ open: true, anchor, placement: 'bottom-start' })`, Fokusfalle
  `useFocusTrap(true, ref, initialFocus)`, Escape und Druck außerhalb rufen `onClose`. Nach dem Schließen steht der Fokus
  auf `anchor` (wenn `useFocusTrap` ihn nicht schon dorthin zurückgibt, explizit `anchor.focus()`).
- Tabs und Aktionen setzen die Aufrufer als Kinder ein (`useTabList`, `div.tl-button-bar.tl-picker__actions`).

- [ ] **Step 1: Failing Vitest** `describe('PickerPopover')`: rendert unter `document.body` mit `role="dialog"` und
  Namen; der erste fokussierbare Inhalt hat beim Öffnen den Fokus (`'first'`), eine Funktion als `initialFocus` gewinnt;
  Tab vom letzten Element landet auf dem ersten (Falle); Escape ruft `onClose` einmal; Druck außerhalb ruft `onClose`;
  nach dem Abbauen ist `document.activeElement` der Anker. **Review Focus 2:** in einem gerenderten `TLWindow` schließt
  Escape nur den Picker — `onClose` einmal, kein `close` des Fensters gesendet.
- [ ] **Step 2: Run** — Expected: FAIL.
- [ ] **Step 3: Implement** `PickerPopover`.
- [ ] **Step 4: Run** Vitest, `tsc` — grün.
- [ ] **Step 5: Commit** „Ticket #29875: One shell for the color and icon pickers -- popover position, focus trap and
  return, Escape, outside press, dialog role.“

### Task 5: Engine — Farbfeld

**Files:**
- Modify: `react-src/controls/TLColorInput.tsx`, `controls/color/ColorPopup.tsx`, `color/ColorPalette.tsx`,
  `color/ColorMixer.tsx` (`colorUtils.ts` nur, wenn der Mischer den Farbton dort braucht)
- Modify: `com.top_logic.layout.react/src/main/java/com/top_logic/layout/react/I18NConstants.java`,
  `src/main/java/META-INF/messages_de.properties`
- Modify: `com.top_logic.layout.react/src/main/webapp/style/tlReactControls.css` (Block „TLColorInput“ löschen),
  `design-system/test/ratchet.json`
- Modify: `com.top_logic.layout.react.mui/react-src/adapters/pickers.test.tsx`

**Interfaces:**
- Consumes: `PickerPopover` (Task 4), `useTabList` (Task 3), `useRovingFocus(containerRef, itemSelector, count,
  preferred)` (`controls/useRovingFocus.ts`), `fieldStateAttrs`, `showsValueOnly` (`controls/form/fieldState.ts`),
  Parts `Button`, `TextInput`.
- Neue i18n (JavaDoc in `I18NConstants`, `messages_en` erzeugt): `JS_COLOR_INPUT_COLORS` „Colors“ (Name der Palette),
  `JS_COLOR_INPUT_SATURATION_BRIGHTNESS` „Saturation and brightness“, `JS_COLOR_INPUT_SATURATION_BRIGHTNESS_VALUE`
  „Saturation {0} %, brightness {1} %“, `JS_COLOR_INPUT_HUE` „Hue“. `JS_COLOR_INPUT_NO_COLOR` wird genutzt (Name und
  Tooltip des leeren Swatches).
- Zustand, Befehle und Commit-Modell bleiben (`valueChanged`, `paletteChanged`, Entwurf „Neu“, OK trägt in die erste
  freie Zelle ein).

- [ ] **Step 1: Failing Vitest** `describe('TLColorInput')` (Parts wie in `containers.test.tsx` per `replacePart`):
  - Feldknopf ist `button.tl-swatch.tl-swatch--color`; ohne Wert `data-tl-state="empty"` und Name enthält
    „js.colorInput.noColor“; mit `hasError` `aria-invalid="true"`, mit `mandatory` `aria-required="true"`.
  - **Review Focus 5:** `editable: false` → `span.tl-swatch`, kein `button`; `disabled: true` → `button[disabled]`,
    Klick öffnet nichts.
  - Klick öffnet `role="dialog"`; Fokus auf dem gewählten Tab; Pfeil rechts wechselt zu „Mischer“.
  - Palette: genau eine Option mit `tabIndex 0`; Pfeil rechts bewegt den Fokus; Leertaste setzt „Neu“ (kein Befehl);
    Enter sendet `valueChanged` mit der Farbe und schließt; danach Fokus auf dem Feldknopf.
  - **Review Focus 3:** `palette: [null, null, null]` → keine Option, kein Fehler, Tab verlässt die Palette.
  - Mischer: Feld `role="slider"` mit `aria-valuetext` „js.colorInput.saturationBrightnessValue…“; Pfeil rechts
    hebt die Sättigung um 1 %. **Review Focus 4:** Wert `#000000`, zuerst Farbton auf 120° (Pfeile am Farbtonregler),
    dann Pfeil hoch am Feld → „Neu“ ist grün getönt (Hue bleibt 120°), nicht rot; Pfeil runter bei 0 bleibt 0.
  - U1: Enter im Hex-Feld mit gültigem Wert sendet `valueChanged` und schließt.
- [ ] **Step 2: Run** — Expected: FAIL.
- [ ] **Step 3: Implement** nach Spec §4: Swatch für Feld, lesend, Zellen, Vorschau (`--wide`); Popup über
  `PickerPopover` mit `label` aus `js.colorInput.chooseColor`, Tabs über `useTabList`, Aktionen Part `Button` in
  `tl-button-bar` (Leeren ghost+danger am Anfang, Abbrechen, OK primary); Palette `role="listbox"` mit
  `useRovingFocus` über `[role="option"]` (nur gefüllte Zellen), Spalten inline
  `gridTemplateColumns: repeat(n, var(--tl-size-control))`; Mischer zwei `role="slider"` (Feld: `aria-valuenow` =
  Sättigung, `aria-valuetext` beide; Farbton `aria-orientation="vertical"`, 0–360), Pfeile 1, Bild auf/ab 10, Pos1/Ende;
  Farbton in eigenem Zustand gemerkt; Spektrum und Verläufe inline; Zugbild ein `tl-swatch tl-swatch--color` statt des
  Inline-`div`.
- [ ] **Step 4: Alt löschen** — Block „TLColorInput“ in `tlReactControls.css`; in `ratchet.json` streichen, Literale auf
  den Messwert (`node tools/inventory.mjs`), Vermerk an `_blocks`.
- [ ] **Step 5: Run** Vitest (alle), `tsc`, Vite-Build (`npm run build`), `node --test` im Paket,
  `design-system/tools/check-messages-en.sh` — grün; Messages-Diff committen, Deutsch nachziehen.
- [ ] **Step 6: Commit** Engine „Ticket #29875: The color input reads the design system package -- one swatch, the
  picker shell, palette and mixer by keyboard, field state; the mixer keeps its hue.“; Paket „Ticket #29875: Ratsche --
  TLColorInput gestrichen“.

### Task 6: Engine — Icon-Feld

**Files:**
- Modify: `react-src/controls/TLIconSelect.tsx`, `controls/icon/IconSelectPopup.tsx`, `react-src/bridge/icons.ts`
  (`ICON_CHOOSE_ICON = 'css:fa-solid fa-icons'`)
- Modify: `I18NConstants.java` (`JS_ICON_SELECT_ICONS` „Icons“, `JS_ICON_SELECT_RETRY` „Load again“;
  `JS_ICON_SELECT_LOAD_ERROR` wird „The icons could not be loaded.“), `messages_de.properties` (auch die kaputte
  deutsche Fassung „Klicken Sie auf , um…“ ersetzen)
- Modify: `tlReactControls.css` (Block „TLIconSelect“ löschen; die Regeln `.tl-tooltip-*` bleiben unter neuer
  Überschrift `/* --- Tooltip ---…--- */`, gleiche Form wie die anderen Köpfe), `design-system/test/ratchet.json`
  (Block „Tooltip“ mit Messwert, Vermerk „bis 5d, V15“)
- Modify: `com.top_logic.layout.react.mui/react-src/adapters/busy-indicators.test.tsx` (Zeile 183: statt
  `.tlIconSelect__loading` die Hülle `.tl-status`), `pickers.test.tsx`

**Interfaces:**
- Consumes: wie Task 5; Part `Spinner`; Paketblock `tl-status`.
- Zustand und Befehle bleiben (`valueChanged`, `loadIcons`, Filter im Client).

- [ ] **Step 1: Failing Vitest** `describe('TLIconSelect')`:
  - Feldknopf `button.tl-swatch`; leer zeigt `ICON_CHOOSE_ICON` (kein `<i class="fa-solid fa-icons">` von Hand);
    Feldzustand als Attribut. **Review Focus 5:** lesend `span.tl-swatch`; deaktiviert öffnet nichts.
  - Öffnen: Fokus im Filterfeld, sobald `iconsLoaded` (wie `text-inputs.test.tsx`, das grün bleiben muss).
  - Raster `role="listbox"` mit genau einem Tab-Halt; Pfeil rechts bewegt; Enter im Tab „Einfach“ sendet
    `valueChanged` und schließt; im Tab „Erweitert“ füllt Enter das Klassenfeld, OK sendet.
  - Gewählte Zelle `aria-selected="true"`.
  - Ladefehler: `tl-status` mit Part `Button` „js.iconSelect.retry“ (kein `<a href="#">`); Klick sendet `loadIcons`.
  - **Review Focus 1:** Text im Filter, Escape → Popup zu, `valueChanged` nicht gesendet, Fokus auf dem Feldknopf.
- [ ] **Step 2: Run** — Expected: FAIL.
- [ ] **Step 3: Implement** nach Spec §5: `PickerPopover` mit `className="tl-icon-picker"` und `initialFocus` = Filter;
  Raster mit `useRovingFocus`; `tl-status` für lädt (Part `Spinner`), leer, Fehler; Aktionen nur im Tab „Erweitert“.
- [ ] **Step 4: Alt löschen**, Tooltip-Regeln unter eigener Überschrift, Ratsche, `busy-indicators.test.tsx`.
- [ ] **Step 5: Run** Vitest (alle, `text-inputs.test.tsx` und `busy-indicators.test.tsx` eingeschlossen), `tsc`, Vite,
  `node --test`, `check-messages-en.sh` — grün.
- [ ] **Step 6: Commit** Engine „Ticket #29875: The icon select reads the design system package -- the picker shell,
  one tab stop in the grid, status rows, a retry button.“; Paket „Ticket #29875: Ratsche -- TLIconSelect gestrichen,
  Tooltip als eigener Block bis 5d“.

### Task 7: Engine — Slider

**Files:**
- Modify: `react-src/controls/TLSlider.tsx`
- Modify: `tlReactControls.css` (Block „TLSlider“ löschen), `design-system/test/ratchet.json` (Block, `foreignTl`
  ohne `--tlSlider-thumb`, `--tlSlider-fill`, `--tlSlider-fill-color`, `--tlSlider-rest-color`)
- Modify: `com.top_logic.layout.react.mui/react-src/adapters/pickers.test.tsx`

**Interfaces:**
- Consumes: `fieldStateAttrs` (Fehler `aria-invalid`, Warnung `data-tl-state="warning"`, Pflicht `aria-required`).
- Zustand und Befehl bleiben (`valueChanged`, Entprellung, Flush bei Loslassen, Taste, Blur).

- [ ] **Step 1: Failing Vitest** `describe('TLSlider')`: `span.tl-slider` mit `span.tl-slider__fill`, dessen
  `style.inlineSize` bei `min 0, max 100, value 25` „25%“ ist; kein Inline-`--tlSlider-fill`; `hasError` →
  `aria-invalid="true"` am `input`, `hasWarnings` → `data-tl-state="warning"` an der Wurzel, `mandatory` →
  `aria-required="true"`; keine Klasse `tlSlider--error`. `field-values.test.tsx` (lesend) bleibt grün.
- [ ] **Step 2: Run** — Expected: FAIL.
- [ ] **Step 3: Implement** nach Spec §6.
- [ ] **Step 4: Alt löschen**, Ratsche, `foreignTl`.
- [ ] **Step 5: Run** Vitest (alle, `MuiSliderAdapter.test.tsx` eingeschlossen), `tsc`, Vite, `node --test` — grün.
- [ ] **Step 6: Commit** Engine „Ticket #29875: The slider reads the design system package -- the fill is an element,
  field state as attributes.“; Paket „Ticket #29875: Ratsche -- TLSlider gestrichen, foreignTl ohne --tlSlider-*“.

### Task 8: Gates gesamt, altlast

**Files:**
- Modify: `design-system/test/engine-classes.test.mjs` (anfügen), `design-system/test/ratchet.json`
- Modify: `docs/migration/altlast.md` (Abschnitt „## Welle 5a · Eingaben — gebaut <Datum>“ vor „## Konsolidierung“)

- [ ] **Step 1: Engine-Gate** — Test `keine alte Klasse der Welle 5a in react-src, Stylesheets, Java, tl-docs und Views`
  nach dem Muster von `ALT_4C` mit
  `const ALT_5A = /\btl(ColorInput|IconSelect|Slider)(__|--|\b)|--tlSlider-/;` über dieselben Quellen wie `ALT_4C`
  (MUI-Tests eingeschlossen, keine Ausnahme). Und `Welle 5a im TSX`: `PickerPopover.tsx` enthält `role="dialog"` und
  `usePopover`; `TLTabBar.tsx` enthält `useTabList`; in `TLColorInput.tsx`, `ColorPopup.tsx`, `TLIconSelect.tsx`,
  `IconSelectPopup.tsx`, `TLSlider.tsx` kein `aria-label="[A-Za-z]`.
- [ ] **Step 2: Ratsche** — `node tools/inventory.mjs`; Budgets = Messwert; ein Vermerk „17.10. Welle 5a (#29875):
  TLColorInput, TLIconSelect, TLSlider gestrichen; Tooltip (aus dem IconSelect-Block) eigener Block bis 5d; foreignTl
  ohne --tlSlider-*. Literale … lines = <n>.“ (nur, was die Vermerke der Tasks 5–7 nicht schon sagen).
- [ ] **Step 3: Paket-Gates** `node tools/generate.mjs && node tools/lint-css.mjs && node tools/publish-to-worktree.mjs
  && node --test` — alles grün.
- [ ] **Step 4: Maven und Messages** (JDK 21, englische Locale) — `install` für `layout.react`, `layout.view`,
  `layout.configedit`; `test` für `layout.react`, `layout.view`, `layout.configedit`, `demo.react`; danach
  `check-messages-en.sh` ohne Diff. Bei veralteten Modulen im lokalen Repo `mvn -o install -pl <Modul> -am
  -DskipTests`, Tests mit `-DskipTests=false`.
- [ ] **Step 5: `altlast.md`** — „Gestrichene Blöcke“, „Neu im Paket“ (fünf Blöcke, zwei Rollen, `useTabList`,
  `PickerPopover`), „Alt → neu für Anwendungs-Stylesheets“:

| Alt | Neu |
|---|---|
| `.tlColorInput`, `__swatch`, `--noColor`, `--immutable` | `.tl-swatch.tl-swatch--color`, `[data-tl-state~="empty"]`, lesend `span` |
| `.tlColorInput__popup`, `__tabs`, `__tab--active` | `.tl-popover.tl-picker`, `.tl-tabs`, `[aria-selected="true"]` |
| `.tlColorInput__palette`, `__paletteCell`, `--empty` | `.tl-color-picker__palette`, `.tl-swatch.tl-swatch--color[role="option"]`, `[data-tl-state~="empty"]` |
| `.tlColorInput__mixer`, `__svField`, `__hueSlider`, `__svHandle`, `__hueHandle` | `.tl-color-picker__mixer`, `__field`, `__hue`, `__handle` |
| `.tlColorInput__previewSwatch`, `__inputRow` | `.tl-swatch--wide`, `.tl-color-picker__inputs` |
| `.tlColorInput__actions`, `__btn--ok/cancel/reset` | `.tl-button-bar.tl-picker__actions`, Part `Button` |
| `.tlIconSelect`, `__swatch`, `--empty`, `--immutable` | `.tl-swatch`, `[data-tl-state~="empty"]`, lesend `span` |
| `.tlIconSelect__popup`, `__grid`, `__iconCell--selected` | `.tl-popover.tl-picker.tl-icon-picker`, `.tl-icon-picker__grid`, `__cell[aria-selected="true"]` |
| `.tlIconSelect__loading`, `__noResults` | `.tl-status` |
| `.tlSlider`, `--error`, `--warning`, `__input`, `__value` | `.tl-slider`, `[aria-invalid]`, `[data-tl-state~="warning"]`, `__input`, `__value` |
| `--tlSlider-*` | — (Füllung `.tl-slider__fill`) |

- [ ] **Step 6: Commit** Paket „Ticket #29875: Ratsche und Engine-Gate Welle 5a; altlast Welle 5a“; Engine (nur bei
  Messages-Diff) englisch.

### Task 9: Sichtprüfung lokal (Orchestrator)

- [ ] Demo `tl-demo-react` wie Memory „Lokale Demo statt Docker“, hell und dunkel, beide Dichten: Farbe und Icon im
  Formular „Attribute“ (Zeile wählen, Bearbeiten), Slider unter „Gestaltung“; Popup bleibt beim Scrollen am Feld;
  Tastatur durch Tabs, Palette, Mischer, Icon-Raster; Fokus kehrt zurück; Feldfehler sichtbar; im Konfigurationseditor
  einmal Farbe und Icon. Befunde in `altlast.md` „Welle 5a“, Korrekturen als eigene Commits.

### Task 10: Abschluss (Orchestrator)

- [ ] Trac #29875: `== Migration ==` (Spec §10 und die Tabelle aus Task 8) und `RequiresMigration`; `skalen.md`,
  Präsentation, STATUS nachziehen; Hendrik melden. **Push nur nach seiner Freigabe**, je Repo und Branch benannt; PR
  gegen den 4c-Branch (nach dessen Merge gegen master), Reviewer bhu.
