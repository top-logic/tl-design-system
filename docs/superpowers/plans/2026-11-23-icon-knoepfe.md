# Plan #30528: Icon-Knöpfe folgen der Semantik

Engine-Worktree `_Working-Tree/tl8-wt-30528`, Branch `CWS/CWS_30528_icon_button_size` (ab master). Schon
committet: `44cb9869ac` — `.tl-button--icon { flex-shrink: 0 }` + Test in `square.test.mjs`; Löschen/Detail in
`RowSetTableControl` `GHOST`+`SMALL`; `ConfigListEditorControl` ▲▼✕✓ `SMALL`.

Grundlage: Audit aller Icon-Knöpfe der Demo (23.11.) und Hendriks Entscheidungen (23.11.). Regel (`skalen.md`
„Button“, `button.contract.md`): Icon-Knöpfe `ghost`; `secondary` nur Fensterfuß, Panel-Buttonleiste,
Medienknöpfe; `sm` (24 px) nur Tabellenzeile, Kopfknopf, Knopf im Feld. **Der Container wählt** (kein Selektor
von außen, `ButtonDefaults`).

## Aufgaben (Reihenfolge)

### 1. `ButtonDefaults` kennt `small`; die Tabellenzeile setzt es (U3, Regel „sm in Tabellenzeilen“)

Nach Plan-Review (23.11.): der **Part** liest den Kontext, nicht jeder Aufrufer.

- `R/bridge/button-defaults.ts`: `ButtonDefaultsValue.small?: boolean` (JSDoc: „a table row says `true`: every icon
  button inside is drawn small“), `value.small` in die `useMemo`-Abhängigkeiten.
- `R/controls/button/ButtonPart.tsx` (~Z. 27–29) und `R/controls/button/MenuTriggerPart.tsx` (~Z. 22):
  `iconOnly` heißt icon-only **mit Bild** (Vertrag: ohne `image` Rückfall auf `label-only`); `smallIcon =
  iconOnly && (small === true || useButtonDefaults().small === true)`. Ein `icon-only` ohne Bild bekommt kein `--sm`
  mehr.
- `com.top_logic.layout.react.mui/react-src/adapters/MuiButtonAdapter.tsx` (~Z. 99): dieselbe Regel.
- `R/controls/TLTableView.tsx`: **ein** `<ButtonDefaults small>` um das `rows.map` der Körperzeilen (~Z. 2249), nicht
  um Kopf und Fuß.
  **Konfliktschutz zum Stapel 30234…30232:** Zeile 1 (Import aus `tl-react-bridge`) nicht anfassen, sondern eine eigene
  Zeile `import { ButtonDefaults } from 'tl-react-bridge';`; der Wrapper liegt eng um `rows.map`, ohne die Zeilen
  dazwischen neu einzurücken (Stapel-Hunks bei ~2163–2182 und ~2392). `TLTableView.test.tsx` und
  `table-view-options.test.tsx` nicht ändern.
- Portale erben den Kontext: in `R/controls/TLPopover.tsx` (~Z. 218) den Inhalt der Fläche in
  `<ButtonDefaults small={false}>` hüllen. Dann `git grep createPortal` unter `R/` und `.mui/react-src/` durchgehen:
  jede Fläche, die aus einer Zeile öffnen kann (Menüs, Picker, Popover), setzt `small={false}` an ihrer Wurzel;
  Liste der Stellen im Bericht.
- `R/controls/TLBinaryField.tsx` Upload-Knopf (~Z. 154): `appearance` `ghost`, wenn `useButtonDefaults().small`,
  sonst wie bisher. Download braucht nichts (Part liest den Kontext).
- `tl-design-system/src/components/button/button.contract.md`: Zeile `size` und Abschnitt „Container-Kontext“ um
  `small` ergänzen (Tabellenzeile, Kopf).
- Tests: `R/controls/TLButton.test.tsx` — in `<ButtonDefaults small>`: icon-only mit Bild → `tl-button--sm`;
  label-only → nicht; icon-only ohne Bild → nicht; außerhalb → nicht. Dasselbe für `MenuTrigger` in
  `.mui/react-src/adapters/TLPopover.test.tsx` und für `MuiButtonAdapter.test.tsx` (neben ~Z. 373–383). Popover-Fläche
  aus `<ButtonDefaults small>` heraus: Knopf darin nicht `--sm`.

### 2. Spaltenwahl überall `sm` (U2) — **nicht in diesem PR**

Der Stapel !2228–!2231 (Branches 30234 … 30232) schreibt `TableViewButton` um und behält `small={inCell}`. Die
Entscheidung „überall `sm`“ geht als Übergabe an den Stapel (`docs/ui-durchgang.md`), nicht in #30528, sonst
kollidiert der Merge. In diesem PR `TableViewOptions.tsx` nicht anfassen. Hinweis: Aufgabe 1 (`small` in
Körperzellen) betrifft die Spaltenwahl nicht, sie sitzt im Kopf bzw. Rahmen.

### 3. Kopfknöpfe von Formulargruppe und Karte: `ghost sm` (V3, Regel „Kopfknopf“)

- `R/controls/TLFormGroup.tsx` ~Z. 77: Inhalt von `tl-form-group__actions` in `<ButtonDefaults appearance="ghost" small>`.
- `R/controls/TLCard.tsx` ~Z. 35: Inhalt von `tl-titlebar__actions` ebenso.
- `com.top_logic.layout.configedit/.../ConfigListEditorControl.java` ~Z. 400/408/418/473/485: ▲ ▼ ✕ ✓ sind heute
  Glyphen als Label ohne Bild. Jeder bekommt ein Bild (`ThemeImage`, vorhandene Icons-Klasse des Moduls oder
  `css:fa-solid fa-chevron-up|chevron-down|xmark|check`, nach Muster von `Icons.CONFIG_LIST_ADD`) und ein echtes
  Label aus `I18NConstants` des Moduls (vorhandene Konstanten zuerst suchen; neue mit `@en`-JavaDoc, danach
  `tools/check-messages-en.sh` und `messages_de.properties` von Hand). Die `setSize(SMALL)` aus `44cb9869ac` dürfen
  bleiben oder fallen (der Container setzt `small`).

### 4. Einzelstellen

- Specimens mitziehen: `tl-design-system/src/components/calendar/calendar.spec.html:70-72` (ghost),
  `form/form.spec.html:263` (Chip-Knopf ghost).
- V1 `controls/TLCalendar.tsx` Z. ~296–313: alle drei Knöpfe der Kalender-Toolbar `appearance="ghost"` (Toolbar-Regel;
  auch „Heute“).
- V2 `controls/TLFileChips.tsx` Z. ~179: `appearance={compact ? 'ghost' : 'secondary'}`.
- V6 `controls/TLFileUpload.tsx` Z. ~84–98: den handgebauten `<button>` durch das Part `Button` ersetzen
  (`display="icon-only"`, `appearance="ghost"`, `image={ICON_UPLOAD}`, `label={buttonLabel}`, `id`, `labelProps`,
  `aria-busy`, `disabled`), wie in `TLBinaryField.tsx` Z. ~148–158. Danach unbenutzte Importe entfernen.
- U1 `com.top_logic.layout.react/src/main/java/com/top_logic/layout/react/control/form/I18NEditorDialog.java` Z. ~159 (`editLanguages`) und Z. ~344
  (`createTranslateButton`): `setAppearance(ButtonAppearance.GHOST)`; Größe bleibt Control-Höhe.
- V4 `com.top_logic.demo.react/.../views/demo/popover-demo.view.xml` Z. ~121–130: `<trigger><theme-icon …/></trigger>`
  entfernen, stattdessen Attribut `image="css:bi bi-info-circle"` am `<popover>` (Config `PopoverElement.IMAGE`);
  XML mit `XMLPrettyPrinter` normalisieren. Im Browser prüfen, ob beim Hover-Auslöser Tooltip und Popover zugleich
  erscheinen; falls ja, bekommt ein Auslöser mit `data-tl-trigger="hover"` keinen Tooltip (`MenuTriggerPart`).
- V5 `com.top_logic.demo.react/.../views/demo/badge-demo.view.xml` Z. ~104–111: am `<button>` der Glocke
  `appearance="ghost"` (Syntax wie `ticket-card.view.xml:34`).

### 5. Nicht ändern

- Bild-Editor Blättern/Schließen (`TLImageField.tsx` 357, 361, 633) bleibt `secondary` (Knopf über Bild, Ausnahme).
- Medienknöpfe bleiben `secondary`. `tl-chat` bleibt (eigenes Thema).

## Gates (Fertig-Bedingung)

1. `tl-design-system`: `npm run build`, `npm test`, `npm run test:dom`, `node tools/lint-css.mjs` grün.
2. Vitest in `com.top_logic.layout.react` **und** `com.top_logic.layout.react.mui` (`--no-experimental-webstorage`) grün; `tsc` ohne neue Fehler.
3. `mvn -B clean install -pl tl-design-system,com.top_logic.layout.react,com.top_logic.layout.react.mui,com.top_logic.layout.react.wysiwyg,com.top_logic.layout.view,com.top_logic.layout.configedit,com.top_logic.demo.react`
   (JDK 21, vorher `rebuild-stale.sh`) BUILD SUCCESS.
4. `tools/check-messages-en.sh` (Projekt-Repo) mit `TL_WORKTREE` grün.
5. Sichtprüfung Demo 8095, hell + dunkel, normal + kompakt: Constraint-Test „Neu“ (Löschen in Zeile 24 ghost),
   „Icons aus Bildern“ (Download in Zelle 24 ghost), Kalender (Toolbar ghost), Editierbare Tabelle (Chip-Knopf
   kompakt ghost sm), Konfigurationseditor (Gruppenkopf ghost), mehrsprachiges Feld (Sprachknopf ghost, quadratisch,
   Feldhöhe), Popover-Demo (Auslöser 24/32 quadratisch mit Tooltip), Badges (Glocke ghost),
   Karte mit Kopfknöpfen. **In Tabellenzellen** (Spalten über Zahnrad einblenden, Zeile bearbeiten, #30414):
   Sprachknopf, Binary-Upload/Download, Popover-Auslöser, Medienknopf → 24 px; ein Popover/Menü, das aus einer Zeile
   öffnet, zeigt normale Knöpfe. Gegenprobe: Formularfelder und Toolbars außerhalb Tabellen unverändert.
6. Ein Commit je Aufgabe, Präfix `Ticket #30528:`, englisch.

## Doku (Orchestrator, `doku/30528`)

`skalen.md` Abschnitt „Icon-Knöpfe: Semantik nachgezogen (23.11.)“: `sm` auch für Reiterleisten-Pfeile, Toolbar im
Feld, Reorder-Liste; Tabellenzelle setzt `small` über `ButtonDefaults`; Spaltenwahl immer `sm`; Sprachknopf neben dem
Feld `ghost` in Control-Höhe; Ausnahme `secondary` über Bildern; **kein Icon-Knopf**: Aufklapper (`tl-toggle`),
eingeklappte Sidebar (Menüeinträge), Symbol- und Farbraster (Auswahlzellen). `button.contract.md` im Paket: `small`
im Container-Kontext ergänzen (Aufgabe 1). STATUS nachziehen.
