# U63 Tabellenansicht je Person — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tabellendichte, Zebra und Spaltenlinien gelten je Person für alle Tabellen; „Zurücksetzen“ wird zu „Spalten zurücksetzen“ und betrifft nur die Anordnung der einen Tabelle.

**Architecture:** Der Server speichert die drei Werte in der `PersonalConfiguration` und schreibt sie als Startwerte an das Wurzelelement der Seite (`html` bzw. `div.tlReactHost`). Ein Speicher der Bridge liest sie einmal von dort, nimmt Änderungen aus dem Popover sofort auf und lässt jede `TLTableView` der Seite neu rendern; der Befehl `setViewOptions` speichert nur noch. Die drei Felder fallen aus `TableViewState`, `TableView` und dem Codec.

**Tech Stack:** Java 21 (TopLogic, JUnit 4, Maven), React/TypeScript (`tl-react-bridge`, Vitest), MUI-Vitest.

**Spec:** `docs/superpowers/specs/2026-11-09-u63-tabellenansicht-je-person-design.md` (dieses Repo). Alle Engine-Pfade relativ zum Worktree `_Working-Tree/tl8-wt-30102`, Branch `CWS/CWS_30102_ui_pass_2_filter_columns`.

## Global Constraints

- Schlüssel der `PersonalConfiguration`: `react.table.density` (String: `""`, `normal`, `compact`), `react.table.striped`, `react.table.columnLines` (Boolean). Unbekannt oder fehlend = ab Werk (`""`, `false`, `false`).
- Attribute am Wurzelelement: `data-tl-table-view` (immer, leer), `data-tl-table-density` (nur `normal`/`compact`), `data-tl-table-striped`, `data-tl-table-column-lines` (vorhanden = an).
- Message-Schlüssel `js.table.viewReset` wird `js.table.columnsReset`; de „Spalten zurücksetzen“, en „Reset columns“. Kein Alias.
- Kein Wert im CSS; Paket (`tl-design-system/`) bleibt unverändert.
- `messages_en.properties` nie von Hand: JavaDoc/I18N-Konstante schreiben, `tools/check-messages-en.sh` (im Doku-Repo) laufen lassen, Diff committen, Deutsch nachziehen. Die `js.table.*`-Texte des Clients stehen in `I18NConstants` von `com.top_logic.layout.react` mit `@en`-JavaDoc — dort umbenennen.
- Maven immer `mvn -B -o clean install` aus `tl-parent-engine/` mit `-pl ../<modul>`; `JAVA_HOME` = JDK 21.
- Commits: `Ticket #30102: …`, englisch, ohne Attribution. **Jeder Commit, der einen Sonderfall berührt, nennt ihn im Text** (Hendrik 09.11.): Tabelle ohne Spaltenseite, klassische Seiten (`tlReactHost`), andere Fenster erst nach Neuladen, alte gespeicherte Zustände.
- Nichts pushen. Eclipse-Metadaten (`.settings/`, `.factorypath`) nie committen.

## Review Focus

1. **Alter gespeicherter Zustand mit `density`/`striped`/`columnLines` im JSON** → wird ohne Fehler gelesen, die Felder ignoriert (Task 2, Codec-Test).
2. **Seite ohne Marke `data-tl-table-view`** (Test, fremder Host) → Speicher liefert ab Werk, kein Fehler (Task 3).
3. **Person ohne `PersonalConfiguration`** (anonym) → Lesen liefert ab Werk, Schreiben tut nichts, Befehl scheitert nicht (Task 1).
4. **Tabelle ohne Spaltenwahl, aber mit gespeichertem Zustand** → „Spalten zurücksetzen“ letzter Eintrag der ersten Seite; **ohne gespeicherten Zustand** → kein Rücksetzen, die drei Werte trotzdem da (Task 4).
5. **Zwei Tabellen auf einer Seite** → Zebra in der einen schaltet die andere ohne Server-Antwort mit (Task 3/4).

---

### Task 1: Server — Speicher und Startwerte

**Files:**
- Create: `com.top_logic.layout.react/src/main/java/com/top_logic/layout/react/control/table/TableViewPreferences.java`
- Modify: `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/ViewServlet.java:1092` (neben `writeDensityAttribute`)
- Modify: `tl-chat-classic/src/main/java/com/top_logic/ai/chat/classic/ReactViewComponent.java:166` (neben `DS_DENSITY_ATTRIBUTE`)
- Test: `com.top_logic.layout.react/src/test/java/test/com/top_logic/layout/react/control/table/TestTableViewPreferences.java`

**Interfaces:**
- Produces: `final class TableViewPreferences` mit
  - Konstanten `KEY_DENSITY = "react.table.density"`, `KEY_STRIPED = "react.table.striped"`, `KEY_COLUMN_LINES = "react.table.columnLines"`, `ATTR_MARK = "data-tl-table-view"`, `ATTR_DENSITY = "data-tl-table-density"`, `ATTR_STRIPED = "data-tl-table-striped"`, `ATTR_COLUMN_LINES = "data-tl-table-column-lines"`
  - `static String density()` / `static boolean striped()` / `static boolean columnLines()` — lesen aus `PersonalConfiguration.getPersonalConfiguration()`; ohne PC oder bei fremdem Wert ab Werk
  - `static String densityOf(Object stored)` — `"normal"`/`"compact"`, sonst `""`
  - `static void store(String density, boolean striped, boolean columnLines)` — schreibt alle drei, dann `PersonalConfiguration.storePersonalConfiguration()`; ohne PC nichts
  - `static void writeAttributes(TagWriter out)` — schreibt die vier Attribute nach Global Constraints

- [ ] **Step 1: Failing test** `TestTableViewPreferences`: `testDensityOf` (`"compact"`→`"compact"`, `"normal"`→`"normal"`, `"huge"`/`null`/`Integer 1`→`""`); `testNoPersonalConfiguration` (ohne PC: `density()==""`, `striped()==false`, `store(...)` wirft nicht); `testAttributes` (Ausgabe von `writeAttributes` enthält `data-tl-table-view=""`, bei Startwerten **kein** `data-tl-table-density`/`-striped`/`-column-lines`). Muster für einen Test ohne PC: `TestUIThemeService.testNoDensityWithoutPersonalConfiguration`.
- [ ] **Step 2:** `mvn -B -o clean install -DskipTests=false -pl ../com.top_logic.layout.react -Dtest=test.com.top_logic.layout.react.control.table.TestTableViewPreferences` → FAIL (Klasse fehlt).
- [ ] **Step 3:** `TableViewPreferences` implementieren (Klassen-JavaDoc mit SPDX-Kopf wie Nachbarklassen); `ViewServlet` und `ReactViewComponent` rufen `TableViewPreferences.writeAttributes(out)` direkt nach der Dichte.
- [ ] **Step 4:** Test → PASS; `mvn … install -pl ../com.top_logic.layout.react,../com.top_logic.layout.view,../tl-chat-classic` grün.
- [ ] **Step 5: Commit** — Text nennt: klassische Seiten tragen die Startwerte am Host.

### Task 2: Server — Felder abschneiden, Befehl speichert

**Files:**
- Modify: `com.top_logic/src/main/java/com/top_logic/table/TableViewState.java` (Felder `_density`, `_striped`, `_columnLines`, `DENSITY_*`-Konstanten, Getter/Setter weg)
- Modify: `com.top_logic/src/main/java/com/top_logic/table/TableView.java:438-456` (`setViewOptions` weg; JavaDoc `resetToDefaults`: Anordnung samt Sortierung und Gruppierung)
- Modify: `com.top_logic/src/main/java/com/top_logic/table/impl/DefaultTableView.java`, `.../impl/TableViewStateCodec.java`
- Modify: `com.top_logic.layout.react/src/main/java/com/top_logic/layout/react/control/table/TableViewControl.java` (Schlüssel `VIEW_DENSITY`, `STRIPED`, `COLUMN_LINES`, `pushViewOptions` weg; `handleSetViewOptions` → `TableViewPreferences.store(...)`; `handleResetView` ohne `pushViewOptions`; `VIEW_OPTIONS`-JavaDoc: „ob die Tabelle ihren Zustand speichert“)
- Test: `com.top_logic/src/test/java/test/com/top_logic/table/TestTableViewStateCodec.java`, `TestDefaultTableView.java`; `com.top_logic.layout.react/src/test/java/test/com/top_logic/layout/react/control/table/TestTableViewOptions.java`

**Interfaces:**
- Consumes: `TableViewPreferences.store(String, boolean, boolean)` (Task 1)
- Produces: State-Schlüssel der Tabelle ohne `viewDensity`/`striped`/`columnLines`; `viewOptions` (boolean) bleibt.

- [ ] **Step 1: Failing tests:** Codec — `testDecodeIgnoresFormerViewOptions`: ein gespeicherter JSON-Stand mit `"density":"compact","striped":true,"columnLines":true` plus einer Spaltenreihenfolge wird gelesen, die Reihenfolge stimmt, kein Fehler. `TestTableViewOptions` — `setViewOptions` speichert in der PC (`TableViewPreferences.striped()` danach `true`) und ändert den `TableViewState` nicht; `resetView` lässt die drei PC-Werte stehen und setzt Spaltenreihenfolge, Sortierung, Gruppierung zurück.
- [ ] **Step 2:** Tests laufen lassen → FAIL (Kompilat oder Assertion).
- [ ] **Step 3:** Abschneiden wie unter Files; wo `TestDefaultTableView` die Optionen prüft, Tests entfernen.
- [ ] **Step 4:** `mvn -B -o clean install -DskipTests=false -pl ../com.top_logic,../com.top_logic.layout.react` → grün (Tests `TestDefaultTableView`, `TestTableViewStateCodec`, `TestTableViewOptions`); `layout.view` bauen.
- [ ] **Step 5: Commit** — Text nennt: alte gespeicherte Zustände mit den drei Feldern werden gelesen, die Felder übergangen.

### Task 3: Bridge — Speicher der Seite

**Files:**
- Create: `com.top_logic.layout.react/react-src/bridge/table-view-preferences.ts`
- Modify: `com.top_logic.layout.react/react-src/bridge/tl-react-bridge.ts` (Export)
- Test: `com.top_logic.layout.react/react-src/bridge/table-view-preferences.test.ts`

**Interfaces:**
- Produces:
  - `export type TableDensity = '' | 'normal' | 'compact'` (zieht aus `TableViewOptions.tsx` hierher; dort re-importieren)
  - `export interface TableViewPreferences { density: TableDensity; striped: boolean; columnLines: boolean }`
  - `export function useTableViewPreferences(): TableViewPreferences` — `useSyncExternalStore`; beim ersten Lesen aus `document.querySelector('[data-tl-table-view]')`, ohne Marke ab Werk
  - `export function setTableViewPreferences(next: TableViewPreferences): void` — setzt den Speicher, benachrichtigt alle Abonnenten
  - `export function resetTableViewPreferencesForTest(): void` — vergisst den Speicher (nur Tests)

- [ ] **Step 1: Failing tests:** liest Startwerte vom Element mit Marke (`density` aus `data-tl-table-density`, `striped` aus Vorhandensein); ohne Marke ab Werk; fremder Dichtewert → `''`; zwei Komponenten mit dem Hook rendern nach `setTableViewPreferences` beide den neuen Wert.
- [ ] **Step 2:** `npx vitest run react-src/bridge/table-view-preferences.test.ts` (in `com.top_logic.layout.react`) → FAIL.
- [ ] **Step 3:** Implementieren; Snapshot-Objekt nur bei Änderung neu (sonst rendert `useSyncExternalStore` endlos).
- [ ] **Step 4:** Test → PASS; `npm run typecheck`.
- [ ] **Step 5: Commit.**

### Task 4: Tabelle und Popover

**Files:**
- Modify: `com.top_logic.layout.react/react-src/controls/TLTableView.tsx` (Zeilen um 493, 516, 1663-1695, 1833, 1845, 2051-2053, 2075, 2486)
- Modify: `com.top_logic.layout.react/react-src/controls/table/TableViewOptions.tsx`
- Modify: `com.top_logic.layout.react/src/main/java/com/top_logic/layout/react/I18NConstants.java` (`js.table.viewReset` → `js.table.columnsReset`), `messages_de.properties`
- Test: `com.top_logic.layout.react.mui/react-src/table-view-options.test.tsx`, `table-view-attributes.test.tsx`

**Interfaces:**
- Consumes: `useTableViewPreferences`, `setTableViewPreferences`, `TableDensity` (Task 3)
- Produces: `TableViewOptionsProps.viewOptions` heißt `canReset` (gespeicherter Zustand); `TableViewOptions` hat keinen `onReset` mehr auf der ersten Seite, außer `!columnSelect && canReset`.

- [ ] **Step 1: Failing tests (MUI):**
  - `table-view-attributes`: die Wurzel trägt `data-tl-density`/`data-tl-striped`/`data-tl-column-lines` aus dem Speicher (vorher `setTableViewPreferences`), nicht aus dem State; zwei Tabellen, Zebra im Popover der ersten → zweite trägt `data-tl-striped` ohne Server-Antwort.
  - `table-view-options`: erste Seite hat immer Dichte, Zebra, Spaltenlinien (auch `canReset: false`); mit `columnSelect` steht „Spalten zurücksetzen“ (`js.table.columnsReset`) auf der Spaltenseite am Ende, nicht auf der ersten; ohne `columnSelect`, mit `canReset` letzter Eintrag der ersten Seite; ohne `canReset` nirgends; Klick sendet `resetView` und schließt das Popover; das Zahnrad steht an einer Tabelle mit `viewOptions: false, columnSelect: false`.
- [ ] **Step 2:** `NODE_OPTIONS=--no-experimental-webstorage npx vitest run react-src/table-view-options.test.tsx react-src/table-view-attributes.test.tsx` (in `com.top_logic.layout.react.mui`) → FAIL.
- [ ] **Step 3:** `TLTableView`: Werte aus `useTableViewPreferences()`; `handleViewChange` ruft zuerst `setTableViewPreferences(values)`, dann `sendCommand('setViewOptions', …)`; Zahnrad-Bedingungen (1833, 1845, 2486) ohne `viewOptions || columnSelect` — immer; `canReset={viewOptions}`. `TableViewOptions`: Stops `['density','stripes','columnLines', …(columnSelect ? ['columns'] : []), …(!columnSelect && canReset ? ['reset'] : [])]`; Spaltenseite in `TableViewButton` bekommt unter `TLChild` den Eintrag „Spalten zurücksetzen“ (nur `canReset`), `role="menuitem"`, Klasse wie heute. I18N umbenennen, Deutsch „Spalten zurücksetzen“.
- [ ] **Step 4:** MUI-Vitest komplett, react-Vitest komplett, `npm run typecheck` → grün; `tools/check-messages-en.sh` → Diff committen.
- [ ] **Step 5: Commit** — Text nennt: Tabelle ohne Spaltenseite (Rücksetzen auf der ersten Seite), andere Fenster erst nach Neuladen.

### Task 5: Doku, Gates, Sichtprüfung

**Files:**
- Modify: `com.top_logic.layout.view/src/main/java/META-INF/tl-docs/view-layer/tables.md` (Abschnitt zu den Ansichtsoptionen: je Person, Startwerte am Wurzelelement, „Spalten zurücksetzen“)
- Modify (Doku-Repo): `docs/ui-durchgang.md` U63 erledigt, `STATUS.md`

- [ ] **Step 1:** `tables.md` nachziehen; `TestDocumentation` von `layout.view` grün.
- [ ] **Step 2:** Gates: Paket `npm test` + `npm run test:dom` + `lint-css` (unverändert grün); Maven `com.top_logic`, `layout.react`, `layout.view`, `tl-chat-classic` mit Tests; react- und MUI-Vitest; `tools/check-messages-en.sh` ohne Diff.
- [ ] **Step 3: Sichtprüfung** in `tl-demo-react` (lokal, selbst anmelden): zwei Tabellen in zwei Reitern der Anwendung — Zebra an in der einen → andere zeigt es ohne Neuladen; Tabellendichte kompakt → Anwendung bleibt normal (Benutzermenü); Neuladen hält alle drei; „Spalten zurücksetzen“ stellt Spalten, Sortierung, Gruppierung zurück und lässt die drei Werte stehen; Tabelle ohne Spaltenwahl zeigt den Eintrag auf der ersten Seite.
- [ ] **Step 4: Commit** (Engine: Doku; Doku-Repo: ui-durchgang, STATUS).
