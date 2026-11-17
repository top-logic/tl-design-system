# Plan PR 2: Pflicht in der bearbeiteten Tabellenzeile (#30383)

Spec: `docs/superpowers/specs/2026-11-17-row-edit-felder-design.md`, Abschnitt „PR 2“. Baut auf PR 1
(`CWS/CWS_30383_row_edit_fields`, lokal, drei Commits). Kette höchstens zwei.

Zwei Teile, beide entschieden mit Hendrik am 17.11.:

- **Teil A — Stern im Spaltenkopf** für ein Attribut, das **immer** Pflicht ist. Nur solange die Tabelle bearbeitet
  wird. Farbe `status-error-text`, als Symbol mit **3:1** gepaart (WCAG 1.4.11, wie der Markenblau-Trichter im Kopf):
  gemessen hell 4,29 auf `surface-layer-muted`, 3,85 auf `surface-interactive-strong`; dunkel 4,89 / 3,63; auf
  getönten Köpfen (`*-subtle`) überall ≥ 3,94.
- **Teil B — Marke in der Zelle** für jedes Feld, das in **dieser Zeile** Pflicht ist, auch bedingt (dynamische
  Sichtbarkeit, z. B. Demo „Begründung“ bei „abgelehnt“). Variante **Z3** (Hendrik 17.11., Demo
  `row-edit-required-demo.html`): eine rote Ecke (Dreieck) oben rechts im Feld, an jedem Pflichtfeld, gefüllt oder leer. Grundlage: Das Feld in der Zelle trägt `aria-required` heute schon pro Zeile —
  `AttributeFieldModel` setzt `mandatory` aus dem Attribut, `AttributeCellEditing.CellMode` aus dem dynamischen Modus,
  `fieldStateAttrs` (`fieldState.ts`) macht daraus `aria-required`.

Geklärt aus der Spec („Zu klären im Plan“):

- **`state.proto`:** nein. Die Spalten des Tabellenzustands stehen nicht in `state.proto`; `required` geht wie
  `pinnedEnd` und `headerRole` als Schlüssel der Spalten-Map (`TableViewControl.columnsState()`). Der MUI-Adapter
  bleibt unberührt (`mui-adapter-nur-vertrag`).
- **Spalten über verbundene Objekte (!1487) und dynamische Spalten:** Sie werden nicht von `AttributeColumn`
  erzeugt und bekommen keinen Stern (`Column.required()` ist `false`). Ihre Felder tragen trotzdem `aria-required`,
  also greift Teil B.
- **Spaltengruppen:** Der Stern steht am Kopf der einzelnen Spalte, nie am Gruppenkopf.
- **Zeilen verschiedener Typen:** Ein Stern erscheint nur, wenn das Attribut in **jedem** Zeilentyp, der es hat,
  Pflicht ist. Sonst trägt die Pflicht Teil B.
- **Attribut mit dynamischer Sichtbarkeit:** kein Stern, auch wenn es statisch Pflicht ist (der Modus entscheidet
  pro Zeile). Teil B trägt die Pflicht.

Commits englisch, Präfix `Ticket #30383:`. **Nicht pushen** — melden, Hendrik gibt frei.

## Schritt 0: Branch und Ausgangslage

1. Im Worktree `_Working-Tree/tl8-wt-30383`: `git status` muss sauber sein, HEAD = `CWS/CWS_30383_row_edit_fields`
   (Commit `7444448256`). Dann `git switch -c CWS/CWS_30383_row_edit_required`.
2. `cd tl-design-system && node tools/generate.mjs && npm test && npm run test:dom && node tools/lint-css.mjs` —
   alles grün (Stand PR 1: 716/0, 17/0). Ist etwas rot, anhalten und melden.

**Fertig, wenn:** Branch steht auf PR 1, Gates grün.

## Schritt 1: `Column.required()` bis `ColumnView` (Modul `com.top_logic`)

Dateien: `com.top_logic/src/main/java/com/top_logic/table/Column.java`, `…/table/impl/DelegatingColumn.java`,
`…/table/ColumnView.java`, `…/table/impl/DefaultTableView.java`.

1. `Column.java`, neben `pinnedEnd()`:

   ```java
   /**
    * Whether a value is required in every cell of this column the user edits, so that its heading
    * marks the column as mandatory.
    *
    * <p>
    * Only a column that edits its cells can require a value. A value that is required in some rows
    * only is marked at the input of the cell, not at the heading.
    * </p>
    */
   default boolean required() {
       return false;
   }
   ```

2. `DelegatingColumn.java`: `required()` reicht an `_inner` durch, wie `pinnedEnd()`.
3. `ColumnView.java`: Komponente `boolean required` **direkt nach `boolean pinnedEnd`**, JavaDoc-`@param required`
   „Whether the column {@link Column#required() requires a value} in the cells the user edits.“
4. `DefaultTableView.java:377`: `column.required()` direkt nach `column.pinnedEnd()` übergeben. Es gibt nur diesen
   einen `new ColumnView(`-Aufruf (`git grep -n 'new ColumnView('` vorher und nachher prüfen; ein weiterer Treffer,
   z. B. in Tests, wird mit `false` ergänzt).

**Fertig, wenn:** `mvn -B clean install -pl com.top_logic` grün.

## Schritt 2: Pflicht aus dem Attribut (Modul `com.top_logic.layout.view`)

Dateien: `…/layout/view/table/CellEditing.java`, `…/table/AttributeCellEditing.java`, `…/table/AttributeColumn.java`,
`…/layout/view/form/RowSetTableControl.java`.

1. `CellEditing.java`:

   ```java
   /**
    * Whether every row this editing {@link #canEdit(Object) edits} requires a value, so that the
    * heading of the column marks it as mandatory.
    */
   default boolean required() {
       return false;
   }
   ```

2. `AttributeCellEditing.java`: Feld `private final boolean _required;`, Konstruktor
   `AttributeCellEditing(String attribute, boolean required)` (JavaDoc `@param required` „Whether every row type
   holding the attribute requires a value for it.“), `required()` gibt `_required` zurück. Der bisherige
   Ein-Parameter-Konstruktor hat genau einen Aufrufer (`AttributeColumn.java:124`) und entfällt.
3. `AttributeColumn.resolve`: `new AttributeCellEditing(attribute, alwaysRequired(scope, attribute))` mit

   ```java
   /**
    * Whether every row type of the table holding the given attribute requires a value for it, and
    * no row decides that by a {@link DynamicVisibility dynamic mode}.
    */
   private static boolean alwaysRequired(ColumnResolution scope, String attribute) {
       boolean held = false;
       for (TLStructuredType type : scope.rowTypes()) {
           TLStructuredTypePart part = type.getPart(attribute);
           if (part == null) {
               continue;
           }
           if (!part.isMandatory() || part.isDerived() || DynamicVisibility.modeSelector(part) != null) {
               return false;
           }
           held = true;
       }
       return held;
   }
   ```

   Imports (`DynamicVisibility` wie in `AttributeCellEditing`) prüfen.
4. `RowSetTableControl.EditAwareColumn`:

   ```java
   @Override
   public boolean required() {
       return _editable && _setup != null && _setup.editing() != null && _setup.editing().required();
   }
   ```

   `_setup` kann `null` sein (`TestRowSetTableAlignment` baut die Spalte so).

**Fertig, wenn:** `mvn -B clean install -pl com.top_logic.layout.view` grün (nach Schritt 3, falls
`com.top_logic.layout.react` vorher gebaut werden muss — Reihenfolge `com.top_logic,com.top_logic.layout.react,
com.top_logic.layout.view`).

## Schritt 3: Zustand an den Client (Modul `com.top_logic.layout.react`)

Datei: `…/layout/react/control/table/TableViewControl.java`.

1. Konstante neben `COLUMN_PINNED_END`:

   ```java
   /**
    * Per-column state key telling whether the column {@link ColumnView#required() requires a value}
    * in the cells the user edits. Absent for a column that does not.
    */
   private static final String COLUMN_REQUIRED = "required";
   ```

2. `columnsState()`, nach `COLUMN_PINNED_END`: `if (column.required()) { columnState.put(COLUMN_REQUIRED,
   Boolean.TRUE); }` — nur gesetzt, wenn wahr, wie `headerRole`.

## Schritt 4: Stern im Kopf (TSX)

Dateien: `com.top_logic.layout.react/react-src/controls/TLTableView.tsx`, `…/controls/TLTableView.test.tsx`.

1. `interface ColumnState` (Zeile ~163), nach `pinnedEnd`:

   ```ts
   /**
    * Whether the column requires a value in the cells the user edits: its heading shows the
    * required mark. Absent for a column that does not.
    */
   required?: boolean;
   ```

2. Kopfzelle (Zeile ~1955): Die Konstante `label` wird ein Fragment aus Titel und Stern, damit der Stern im
   sortierbaren Knopf **und** in der nicht sortierbaren Kopfzelle steht:

   ```tsx
   const label = (
     <>
       <span className="tl-table__label tl-type-overline" {...tooltipProps(col.tooltip)}>{col.label}</span>
       {col.required && <span className="tl-table__required" aria-hidden="true">*</span>}
     </>
   );
   ```

   Der Stern ist `aria-hidden` wie im Formular (`TLFormField.tsx:194`); die Pflicht nennt das Feld selbst über
   `aria-required`.
3. Vitest in `TLTableView.test.tsx` nach dem Muster der vorhandenen Kopf-Tests: Spalte mit `required: true` zeigt
   `.tl-table__required` mit `aria-hidden="true"` im Kopf, sortierbar und nicht sortierbar; ohne `required` keiner.

**Fertig, wenn:** `mvn -B clean install -pl com.top_logic.layout.react` grün (der Build führt Vitest aus; sonst im
Modul `npx vitest run controls/TLTableView.test.tsx` — wie in den Nachbarmodulen, ggf. mit
`--no-experimental-webstorage`, siehe Memory „Parts seit #29787“).

## Schritt 5: Paket (`tl-design-system`)

Dateien: `src/components/table/table.css`, `table.contract.md`, `table.spec.html`, `tools/lib/pairs.mjs`,
`test/pairs.test.mjs`, `test/table.test.mjs`.

1. `table.css`, nach der Regel für `.tl-table__label` (Zeile ~180):

   ```css
   /* Pflicht (#30383): ein Stern hinter dem Titel, solange die Tabelle bearbeitet wird — wie im Formular
      (tl-form-field__required). Er gibt nie nach: nur der Titel endet mit Ellipse. Symbol, darum 3:1 (pairs.mjs). */
   .tl-table__required {
     flex: none;
     color: var(--tl-status-error-text);
   }
   ```

2. **Teil B (Z3)** — direkt nach der PR-1-Regel `.tl-table__cell .tl-field:not(:disabled, [readonly],
   [aria-disabled="true"]) { background: var(--tl-surface-field); … }`:

   ```css
   /* Pflicht in der Zelle (#30383): eine Ecke in status-error-text oben rechts im Feld, an jedem Feld, das in dieser
      Zeile Pflicht ist — auch bedingt (das Feld trägt aria-required pro Zeile). Ein Hintergrundbild statt ::after:
      ein input hat kein Pseudo-Element, und die Zelle bleibt ohne position (fixierte Zellen sind sticky). Der
      Radius des Felds rundet die Ecke mit. Symbol, darum 3:1 gegen surface-field (pairs.mjs). */
   .tl-table__cell .tl-field[aria-required="true"]:not(:disabled, [readonly], [aria-disabled="true"]) {
     background-image: linear-gradient(to bottom left, var(--tl-status-error-text) 50%, transparent 50%);
     background-size: var(--tl-space-xs) var(--tl-space-xs);
     background-position: top right;
     background-repeat: no-repeat;
   }
   ```

   Nur Longhands — das `background`-Shorthand der PR-1-Regel davor setzt die Farbe, diese Regel das Bild. Prüfen
   (Specimen, Chrome): (a) Der Datumsfeld-Fall `.tl-field-group` — trägt das `input` den Rahmen (PR 1:
   `box-shadow` am `.tl-field`), sitzt die Ecke an der Feldecke links vom Löschknopf. Liegt sie dort sichtbar falsch,
   anhalten und melden, nicht umbauen. (b) `tl-select` (`role="combobox"`): Ecke über dem Pfeil, nicht verdeckt von
   `.tl-select__controls`. (c) Fehlerzustand (`aria-invalid`) und Warnung: Ecke bleibt, Rahmen wie PR 1. (d) Ein
   Kästchen (`tl-checkbox`) ist kein `.tl-field` und bekommt keine Ecke — so gewollt. (e) Der Fokusring liegt
   außen (PR 1 `outline-offset`) und überdeckt die Ecke nicht.
3. `tools/lib/pairs.mjs`, bei den Paaren auf `surface-layer-muted` (Zeile ~94):

   ```js
   // Pflichtstern im Kopf (#30383): Symbol, 3:1 wie der Trichter; auch beim Zeigen auf die Kopfzelle.
   for (const bg of ['surface-layer-muted', 'surface-interactive-strong']) paar('status-error-text', bg, 3.0);
   ```

   Direkt darunter für Teil B:

   ```js
   // Pflichtecke im Feld der Tabellenzeile (#30383): Symbol, 3:1 gegen die Feldfläche (gemessen hell 4,29, dunkel 4,89).
   paar('status-error-text', 'surface-field', 3.0);
   ```

   Vorher prüfen, ob `status-error-text`/`surface-field` schon mit höherer Schwelle in der Liste steht — dann nichts
   ergänzen (ein Paar doppelt mit niedrigerer Schwelle ist sinnlos).
4. `test/pairs.test.mjs`: Test „#30383: der Pflichtstern im Kopf ist gegen Kopf und gezeigten Kopf geprüft“
   — beide Paare stehen in `kontrastPaare(T)` mit `soll === 3.0`; dazu `status-error-text` auf `surface-field` mit
   `soll >= 3.0`.
5. `test/table.test.mjs`: `.tl-table__required` liest `--tl-status-error-text` und setzt `flex: none`; die Regel
   mit `[aria-required="true"]` liest `--tl-status-error-text` und `--tl-space-xs` und schließt `:disabled`,
   `[readonly]`, `[aria-disabled="true"]` aus.
6. `table.contract.md`: Zeile in der Klassentabelle nach `tl-table__label`: „`tl-table__required` | der
   Pflichtstern hinter dem Titel, solange die Tabelle bearbeitet wird: `--tl-status-error-text`, `aria-hidden`; gibt
   nie nach“. In der Farbtabelle (Zeile ~171) den Stern mit 3:1 als Symbol nennen. Für Teil B: „Pflichtfeld in der bearbeiteten Zeile: Ecke `--tl-status-error-text`, `--tl-space-xs` breit, oben
   rechts im Feld, an `[aria-required="true"]`; nicht an read-only oder inaktiven Feldern“.
7. `table.spec.html`, Panel `#ed-panel`: Kopf „Name“ bekommt den Stern nach dem Titel, die Felder der Spalte
   „Name“ `aria-required="true"`; für Teil B trägt zusätzlich ein Feld einer anderen Spalte (Status, `tl-select`) in einer Zeile `aria-required`
   (bedingte Pflicht) und das Datumsfeld einer Zeile (Fall `.tl-field-group`). `test/row-edit.test.mjs` (PR 1): ein
   Test, dass die Ecke in normal und kompakt innerhalb des Feldrechtecks liegt (berechnetes `background-image` ≠
   `none` am Pflichtfeld, `none` am Nicht-Pflichtfeld).

**Fertig, wenn:** `node tools/generate.mjs && npm test && npm run test:dom && node tools/lint-css.mjs` grün.

## Schritt 6: Java-Tests (Modul `com.top_logic.layout.view`)

Neue Klasse `test.com.top_logic.layout.view.form.TestRowSetTableRequired extends AbstractModelAccessTest`, Muster
`TestRowSetTableAlignment` (Spalten-JSON per `columnState(name)`), Edit-Modus wie `TestRowSetEditSession`
(`form.enterEditMode()`). Pflichtattribut des Testmodells: `name` von `Item` (Komposition `items` eines `Step`,
`AbstractModelAccessTest` Zeile 76). Gibt die Fixture keinen Step mit Items, im Test einen anlegen.

1. Im Edit-Modus trägt die Spalte `name` `"required":true`, eine Spalte eines nicht verpflichtenden Attributs nicht.
2. Ohne Edit-Modus trägt keine Spalte `"required"`.
3. Nach `enterEditMode()` erscheint `required` ohne Neuaufbau der Tabelle von außen (die Spalten werden beim
   Moduswechsel neu gesendet) — falls das nicht so ist: anhalten und melden, nicht selbst einbauen.
4. In `TestRowSetTableAlignment.testAdaptedColumnKeepsPinningAndCssClass` zusätzlich `assertFalse(adapted.required())`
   (Spalte ohne Setup).

`mvn -B test -DskipTests=false -pl com.top_logic.layout.view -Dtest=test.com.top_logic.layout.view.form.TestRowSetTableRequired`
und dasselbe für `TestRowSetTableAlignment`. Neue `.java`: SPDX-Kopf und Klassen-JavaDoc.

## Schritt 7: Gates der Engine

1. `tools/check-messages-en.sh` aus dem Doku-Repo mit `TL_WORKTREE=_Working-Tree/tl8-wt-30383` — muss ohne Diff
   enden; erzeugt es einen Diff, ihn committen (nie von Hand schreiben). Deutsch nachziehen, falls neue Schlüssel.
2. `git diff origin/master --stat` lesen: nur die Dateien dieses Plans und PR 1.

## Schritt 8: Prüfung an der laufenden Instanz

Demo `tl-demo-react` neu bauen und starten (`mvn clean install` der berührten Module und `com.top_logic.demo.react`;
alte Paket-Kopie im `target` prüfen, Memory „Alte Paket-Kopie im target“). Ein Neustart löst auch die Sperren aus
PR 1. Soll-Liste, hell und dunkel, normal und kompakt:

1. `attributes` → „Editierbare Tabelle“ und „Alle Zeilen editierbar“: im Lesen kein Stern; nach „Bearbeiten“ Stern
   hinter „Name“ und „Priorität“, sonst keiner. Der Stern bleibt sichtbar, wenn die Spalte so schmal ist, dass der
   Titel mit Ellipse endet.
2. Felder der Spalten „Name“ und „Priorität“ tragen `aria-required="true"` (DevTools/JS) — auch Auswahl (combobox)
   und Kästchen, sofern ihre Rolle es erlaubt.
3. Teil B: „Begründung“ (`rejected`) und Fälligkeit (`dueDateRequired`) zeigen die Marke genau in den Zeilen, in
   denen der Schalter gesetzt ist, und folgen dem Umschalten ohne Neuladen.
4. Baumtabelle (`tree-grid-demo`) bearbeiten: Stern und Marke wie oben, wo die Typen Pflicht tragen.
5. Formulare unverändert (Stern am Label wie bisher).

## Bekannte Fallen

- Die Ein-Parameter-Variante von `AttributeCellEditing` nicht stehen lassen — sonst bekommt ein künftiger Aufrufer
  stillschweigend keinen Stern.
- `ColumnView` ist ein Record: die neue Komponente ändert den kanonischen Konstruktor. Muster-Dekonstruktionen
  (`case ColumnView(…)`) suchen: `git grep -n 'ColumnView(' -- '*.java'`.
- `TLTableView.tsx` setzt `label` an zwei Stellen ein (Knopf und nicht sortierbar) — das Fragment deckt beide.
- `lint-css`: keine Pixel, kein `:focus` ohne `-visible`.
- Nicht pushen. Eine Push-Frage nennt `tl-engine-7` und `CWS/CWS_30383_row_edit_required`.
