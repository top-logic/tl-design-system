# UI-Durchgang 1: Tabelle mit Tiefe, Ansicht je Tabelle, eine Auswahl-Form — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Die React-Tabelle bekommt die Richtung „Tiefe“, ein Popover „Ansicht“ mit gespeicherten Einstellungen je Person
und Tabelle, Presets mit „+ n weitere“, und alles Wählbare im Paket zeigt „gewählt“ in einer Form (Markenton + Kante).

**Architecture:** Teil A im Design-System-Paket (`design-system/`, Repo `TopLogic/tl-design-system`, Branch `main`):
Rollen, Dichte-Block, Komponenten-CSS, Tests. Teil B in der Engine (Worktree `_Working-Tree/tl8-wt-29584`): Zustand
und Kommandos am Server, Spalten-Ausrichtung, Client `TLTableView.tsx`. Teil A wird mit `publish-to-worktree` in die
Engine kopiert, bevor Teil B die neuen Klassen und Attribute nutzt.

**Tech Stack:** Node (Paket-Werkzeuge, `node --test`), CSS mit Tokens; Java 21 + Maven (Engine), React/TSX über
`tl-react-bridge`, Vitest in `com.top_logic.layout.react.mui`.

**Spec:** `docs/superpowers/specs/2026-10-26-ui-durchgang-1-tabelle-design.md`

## Global Constraints

- Werte nur in `src/primitives.json`, `src/tokens.json` nur Referenzen; nach jeder Änderung an `src/`:
  `node tools/generate.mjs`, dann `node tools/publish-to-worktree.mjs` (Siegel, `TestDesignSystemCopy`).
- `node --test` und `node tools/lint-css.mjs` grün am Ende jedes Paket-Tasks; keine Literale, nur `--tl-*`,
  `:focus-visible`, kein `outline: none`, Zustände als Attribute (`aria-*`, `data-tl-*`), keine Zustands-Modifier.
- Kein Alias alter Namen. Öffentliche Namen Englisch, `tl`-Präfix.
- `messages_en.properties` nie von Hand: JavaDoc schreiben, `tools/check-messages-en.sh`, Diff committen, Deutsch
  in `messages_de.properties` nachziehen.
- **Bis zum Ticket (27.10.) nur lokal:** Paket-Commits auf `main` mit Präfix `Ticket #TBD-UI:`; Engine auf lokalem
  Branch `local/ui-durchgang-1` (von `origin/master`), Commits englisch `Ticket #TBD-UI: …`. Kein Push, kein Trac, kein
  Gitea. Subagenten pushen nie.
- Engine bauen vom Root `tl-parent-engine` mit `-pl ../<modul>`, `JAVA_HOME=$(/usr/libexec/java_home -v 21)`; Tests
  mit `-DskipTests=false -Dtest=<FQN>`.
- Zebrastreifen ab Werk **aus**; zwei Dichten (normal, kompakt), keine dritte.
- Jeder `mvn install` mit `-Dtl.javadoc.skipTranslate=true` (sonst übersetzt der Build JavaDoc, `tl-parent-build/pom.xml:34`).
- Vitest immer als `NODE_OPTIONS=--no-experimental-webstorage npx vitest run …` in `com.top_logic.layout.react.mui`.
- `test/published.test.mjs` verlangt `dist/` byte-gleich im Worktree: **jeder** Paket-Task publiziert in Step 4
  (`node tools/publish-to-worktree.mjs`) auf den Engine-Branch aus Task 0; die Kopie wird in Task 5 committet.

## Entscheidungen des Plans (Hendrik prüft beim Lesen)

1. **Neue Rollen** `surface-selected`, `surface-selected-hover`, `border-selected`. Hell `{blue-6}`, `{blue-9}`,
   `{blue-49}`; dunkel `{blue-69}`, nächste Stufe heller für `-hover`, `{blue-32}`. Dunkel bewusst eine Stufe kräftiger
   als `surface-brand-subtle` (`blue-74` läge mit 1,04 kaum über `surface-layer`); Test: `surface-selected` gegen
   `surface-layer` ≥ 1,1 in beiden Modi. `derive` rechnet alle drei aus der Kundenmarke (`markenRollen`).
6. **Neue Rolle `surface-layer-muted`** für Kopfzeile, Zebra und Gruppenzeile der Tabelle: hell und dunkel die
   nächstliegende Grau-Stufe, die gegen `surface-layer` ≥ 1,1 hält (hell sind `surface-layer` und `-nested` beide
   `gray-0`). Text darauf in der Paarliste.
7. **Kopftitel in Großbuchstaben mit Sperrung** über eine neue Typo-Klasse `overline` in `tokens.json` `type`
   (Sperrung als `tracking`, z. B. `0.04em`, Größe/Gewicht wie `label`), `text-transform: uppercase` in `table.css`.
8. **Zebra-Parität** kommt aus `row.index`, nicht aus dem DOM (Zeilen sind virtualisiert): Zustandswort `even` in
   `data-tl-state` der Zeile.
9. **CodeMirror-Zeilenmarke** (`cm-activeLine` in `tlScriptEditor.css`, `tlCodeEditor.css`) liest künftig
   `surface-interactive-strong` — sie ist weder Auswahl noch Hover.
2. **`surface-interactive-selected` wird umbenannt in `surface-interactive-strong`** (Werte gleich). Nach dem Umzug der
   Auswahl liest es nur noch Hover auf Knöpfen in Feldern, Segment- und Chip-Hover, Spur, Spinner, Skeleton, Pill,
   Avatar, Ablageziel — keine Auswahl mehr. Der alte Name wäre falsch; kein Alias.
3. **Kante** als `box-shadow: inset var(--tl-border-width-accent) 0 0 0 var(--tl-border-selected)` (Anfangsseite links;
   RTL ist im Paket nirgends gelöst und bleibt draußen).
4. **Ausrichtung** nur `start`/`end`; `end` automatisch für Zahlen (`ColumnKind.NUMBER`), Datum bleibt `start`.
5. **Dichte je Tabelle** gespeichert als `""` (wie überall), `"normal"`, `"compact"`.

## Konsolidierungs-Prognose der Auswahl-Stellen (Hendrik kreuzt an, bevor Task 3 startet)

| Stelle | heute gewählt/aktuell | danach | UX-Gewinn | Urteil |
|---|---|---|---|---|
| Tabellenzeile `table.css:335` | Grau `gray-7`/`gray-64` | Fläche + Kante | gewählt ohne Fokus sichtbar (U25) | lohnt |
| Baumknoten `tree.css:49` | Grau, „kein Balken links“ | Fläche + Kante | wie Tabelle; Baum und Tabelle sprechen gleich | lohnt |
| Navigation `sidebar.css:83` (`aria-current`, `contains-current`) | Grau | Fläche + Kante; `contains-current` nur Fläche | man sieht, wo man ist; Hendriks „Navigation zu flach“ | lohnt |
| Bottom-Bar `bottom-bar.css:55` (Icon-Fläche) | Grau | Fläche `surface-selected`, keine Kante (Icon-Kapsel) | gleiche Farbe wie Seitenleiste | lohnt |
| Icon-Picker-Zelle `icon-picker.css:46` | Grau | Fläche + Ring `border-selected` (Zelle im Raster, keine Kante) | Auswahl im Raster klar | lohnt |
| Kalendertermin `calendar.css:268` | Ring `border-interactive` | Ring `border-selected` (Termin trägt Kategorie-Fläche) | nur Name, Bild gleich | lohnt mit der Welle |
| Karten `tl-item`, `tl-columns__column` `layout.css:98` | Ring `border-interactive` + Haken | Ring `border-selected`, Fläche `surface-selected`, Haken bleibt | Karte wirkt gewählt, nicht nur umrandet | lohnt (Hendrik 26.10.) |
| Select-Option, Tastaturposition `select.css:200` | Grau + Akzentlinie | `surface-interactive-hover`, keine Linie; gewählt bleibt Haken | Tönung+Kante heißt nur noch „gewählt“ | lohnt (Hendrik 26.10.) |
| Reiter, Segment, Chip, Knopf `aria-pressed`, Steps | eigene Formen | unverändert | — | lohnt nicht (Spec) |

## Review Focus

1. **Fixierte und angeheftete Zellen** (`frozen`, `pinned`) haben eine eigene Fläche und überdecken Zeilenfläche und
   Kante — eine gewählte Zeile muss auch dort getönt sein und die Kante zeigen (Test in Task 3).
2. **Gewählt + Hover + Fokus** zugleich, in beiden Modi: Fläche `surface-selected-hover`, Kante bleibt, Fokusring
   bleibt sichtbar (Kontrastpaare in Task 1, CSS-Test in Task 3).
3. **Dichte-Wechsel an der Tabelle** bei global kompakter Seite: Zeilenhöhe und Scroll-Fenster folgen sofort, ohne
   Neuladen (Task 2 Normal-Block, Task 9 `useTokenSwitch` mit Ziel-Element).
4. **Alter gespeicherter Zustand** ohne die neuen Schlüssel liest sich als „ab Werk“; Zurücksetzen stellt auch die
   Ansicht zurück, Filter bleiben (Task 6).
5. **Zebra beim Scrollen** bleibt stabil (Parität aus `row.index`, Task 9).
6. **Presets bei wechselnder Breite**, aktives Preset im Menü, kein aktives Preset, eigenes Preset im Menü löschen
   (Task 11).

---

## Task 0: Engine-Branch anlegen

- [ ] Im Worktree `_Working-Tree/tl8-wt-29584`: `git fetch -q && git switch -c local/ui-durchgang-1 origin/master`.
  Danach publizieren die Paket-Tasks dorthin; committet wird die Kopie in Task 5.

## Teil A — Paket

### Task 1: Auswahl-Rollen, Umbenennung, Kontrastpaare

**Files:**
- Modify: `design-system/src/tokens.json` (`color.light` ab :5, `color.dark` ab :44)
- Modify: `design-system/tools/lib/pairs.mjs` (`GRUENDE_TEXT` :5–6, `kontrastPaare` :20–97)
- Modify: alle Leser von `surface-interactive-selected` (Liste in der Prognose + `select.css:126,148`,
  `field.css:70,121`, `choice.css:240,315`, `drag.css:54`, `progress.css:24,67`, `skeleton.css:13`, `pill.css:16`,
  `avatar.css:17`) und Tests, die den Namen nennen (`table.test.mjs:17`, `tree.test.mjs:11`, `navigation.test.mjs:77,96`,
  `eingaben.test.mjs:111`, `choice.test.mjs:245`, `field.test.mjs:120,126`, `drag.test.mjs:35`, `feedback.test.mjs:36`,
  `components.test.mjs:151,295`); Contracts, die ihn nennen
- Modify: Engine-Stellen außerhalb der Paketkopie, die `--tl-surface-interactive-selected` lesen
  (`grep -rn surface-interactive-selected` im Worktree ohne `style/tl-design-system/`)
- Modify: `design-system/tools/lib/color.mjs` `markenRollen` (:376–416) und `test/color.test.mjs:142–148` („alle neun“ → zwölf)
- Modify (Lücken laut Plan-Review): `test/tokens.test.mjs:40,329,332,345–347,355,404–405`, `select.test.mjs:14,111,117`,
  `choice.test.mjs:23`, `field.test.mjs:15`, `tree.test.mjs:15`, `pairs.test.mjs:54–60`; Contracts `sidebar:46`,
  `tree:72`, `bottom-bar:27`, `progress:27,70`, `skeleton:24,28`, `pill:28`, `choice:52,54`, `icon-picker:36`,
  `field:70,71`, `drag:18`, `avatar:32`, `table:170`, `compact-field:36`, `select:90,91,100,119`
- Modify (Engine, im Branch aus Task 0, committet in Task 5): `tlScriptEditor.css:73,78`, `tlCodeEditor.css:92,97`,
  `com.top_logic.layout.react.mui/…/MuiAvatarAdapter.tsx:59` + `.test.tsx:79`, `themeProperties.ts:59`
  (`surfaceInteractiveSelected` → `surfaceInteractiveStrong`)
- Test: `design-system/test/tokens.test.mjs` (neuer Testfall)

**Interfaces:**
- Produces: Rollen `--tl-surface-selected`, `--tl-surface-selected-hover`, `--tl-border-selected`,
  `--tl-surface-interactive-strong`; kein `--tl-surface-interactive-selected` mehr.

- [ ] **Step 1: Failing test** in `tokens.test.mjs`:

```js
test('Auswahl hat eigene Rollen, der alte Name ist weg', () => {
  for (const mode of ['light', 'dark']) {
    for (const r of ['surface-selected', 'surface-selected-hover', 'border-selected', 'surface-interactive-strong'])
      assert.ok(T.color[mode][r], `${mode}: ${r}`);
    assert.equal(T.color[mode]['surface-interactive-selected'], undefined);
    for (const r of ['surface-selected', 'surface-layer-muted'])
      assert.ok(ratio(R.color[mode][r], R.color[mode]['surface-layer']) >= 1.1, `${mode}: ${r} gegen surface-layer`);
  }
});
```
- [ ] **Step 2:** `node --test test/tokens.test.mjs` → FAIL.
- [ ] **Step 3:** Rollen eintragen (Werte aus „Entscheidungen“ 1, `surface-interactive-strong` = bisherige Werte
  `{gray-7}`/`{gray-64}`); alle Leser und Tests auf `surface-interactive-strong` umstellen (die künftigen
  Auswahl-Leser ebenfalls vorerst auf `-strong`, Task 3 zieht sie um). Paare: `surface-selected`,
  `surface-selected-hover` in `GRUENDE_TEXT` aufnehmen und `surface-interactive-selected` dort durch
  `surface-interactive-strong` ersetzen. Die bestehenden **Auswahl**-Paare ziehen auf `surface-selected` und
  `surface-selected-hover` um, nicht auf `-strong`: `pairs.mjs:63` (`border-interactive`, Zelleditor-Linie), `:76`
  (`focus-ring`), `:80–83` (Status-Ränder im Zelleditor), `:88` (Toggle-Glyph); dazu `icon-primary`/`icon-secondary`
  und `border-selected` (3,0) auf beiden Auswahlflächen, `text-primary` und `text-secondary` auf `surface-layer-muted`.
  `border-selected` ist nur Vordergrund (Regel `pairs.test.mjs:33`). `markenRollen` liefert zusätzlich
  `surface-selected` (wie subtle, dunkel eine Stufe kräftiger), `surface-selected-hover`, `border-selected`
  (= `border-interactive`). `surface-layer-muted` eintragen (Entscheidung 6). Typo-Klasse `overline` (Entscheidung 7).
- [ ] **Step 4:** `node tools/generate.mjs && node tools/derive.mjs test/fixtures/probe.primitives.json specimen/probe.theme.css && node tools/publish-to-worktree.mjs && node --test && node tools/lint-css.mjs` → alles grün.
- [ ] **Step 5:** Commit `Ticket #TBD-UI: Paket -- eigene Auswahl-Rollen (surface-selected, border-selected), surface-interactive-selected heißt surface-interactive-strong`.

### Task 2: Dichte „normal“ als eigener Block

**Files:**
- Modify: `design-system/tools/generate.mjs` `tokensCss` (:88–118)
- Test: `design-system/test/generate.test.mjs` (bei :40)

- [ ] **Step 1: Failing test:**

```js
test('normal ist als Attribut setzbar und überstimmt kompakt im Teilbaum', () => {
  const i = tok.indexOf('[data-tl-density="normal"] {'), j = tok.indexOf('[data-tl-density="compact"] {');
  assert.ok(i > 0 && j > i, 'normal-Block steht vor dem kompakt-Block');
  assert.match(tok.slice(i, j), /--tl-size-row:/);
});
```
- [ ] **Step 2:** Test läuft rot.
- [ ] **Step 3:** In `tokensCss` nach dem `:root,[data-tl-mode="light"]`-Block `[data-tl-density="normal"] {\n${block(T.density.normal)}\n}` ausgeben. Die Normalwerte bleiben zusätzlich im `:root`-Block (Standard ohne Attribut).
- [ ] **Step 4:** `generate`, `publish-to-worktree`, `node --test`, `lint-css` grün; `tokens.dtcg.json` unverändert erwartet.
- [ ] **Step 5:** Commit `Ticket #TBD-UI: Paket -- Dichte normal als Attribut, damit eine Tabelle eine kompakte Seite überstimmt`.

### Task 3: Eine Auswahl-Form (nach Hendriks Kreuzen der Prognose)

**Files:**
- Modify: `table.css:331–337` und fixierte/angeheftete Zellen `:381–398`; `tree.css:1–11,49–51`; `sidebar.css:83–86`;
  `bottom-bar.css:55–57`; `icon-picker.css:46–48`; `calendar.css:268–280`; `layout.css:98–106`; `select.css:196–203`
- Modify: Contracts dieser Komponenten (Abschnitt Zustände), Specimen nur wenn ein Zustand fehlt
- Test: `table.test.mjs`, `tree.test.mjs`, `navigation.test.mjs:77–79,96`, `eingaben.test.mjs:111`,
  `behaelter.test.mjs:130–142`, `select.test.mjs:31`, Kalender-Test

**Interfaces:**
- Consumes: Rollen aus Task 1.

- [ ] **Step 1: Failing tests** — je Stelle die Erwartung aus der Prognose, z. B.:

```js
assert.match(declarationsOf(css, ':where(.tl-table__row[aria-selected="true"])'), /background:\s*var\(--tl-surface-selected\)/);
assert.match(declarationsOf(css, ':where(.tl-table__row[aria-selected="true"]:hover)'), /surface-selected-hover/);
assert.match(declarationsOf(css, '.tl-table__row[aria-selected="true"] > .tl-table__cell:first-child') ?? '',
  /box-shadow:\s*inset var\(--tl-border-width-accent\) 0 0 0 var\(--tl-border-selected\)/);
// fixierte Zellen erben die Fläche: bestehende Prüfung background: inherit (table.test.mjs:21) bleibt grün
// Reihenfolge: die Hover-auf-gewählt-Regel steht nach der Auswahlregel
```
  Baum: Fläche + Kante, der Satz „kein Balken links“ in `tree.css:4` fällt. Navigation: `navigation.test.mjs:79` kehrt
  sich um (Kante erwartet für `aria-current="page"`, nicht für `contains-current`). Karten: `behaelter.test.mjs:142`
  erwartet jetzt `surface-selected` und `border-selected`. Select: `highlighted` liest `surface-interactive-hover` und
  kein `box-shadow`. Hover auf gewählt: `surface-selected-hover` (Tabelle, Baum, Navigation).
- [ ] **Step 2:** Tests rot.
- [ ] **Step 3:** CSS umsetzen. In der Tabelle liegt die Kante auf der ersten Zelle der Zeile (`.tl-table__row[aria-selected="true"] > .tl-table__cell:first-child`); fixierte Zellen erben die Fläche per `background: inherit` (`table.css:384–392`), keine eigene Regel. Hover-auf-gewählt als eigene Regel **nach** der Auswahlregel (heute steht Hover davor, `:331–337`).
- [ ] **Step 4:** `generate`, `publish-to-worktree`, `node --test`, `lint-css` grün; Specimen `table`, `tree`, `sidebar`, `board` hell/dunkel im Browser (`node tools/serve.mjs`) ansehen — auch: ohne fixierte Spalte scrollt die Kante mit dem Inhalt seitlich weg (hinnehmen und in `skalen.md` notieren, oder auf die Zeile legen, wenn keine Zelle fixiert ist).
- [ ] **Step 5:** Commit `Ticket #TBD-UI: Paket -- gewählt heißt überall Markenton und Kante; Karten Ring und Fläche; Select-Tastaturposition neutral`.

### Task 4: Tabelle mit Tiefe

**Files:**
- Modify: `design-system/src/components/table/table.css` (Kopf `:90–182`, Zellen `:347–361`, Gruppe `:557–585`,
  Fußzeile `:593–618`, neue Regeln für Fläche, Zebra, Spaltenlinien, Ausrichtung), `table.contract.md`, `table.spec.html`
- Modify: `design-system/tools/lint-css.mjs` nur falls ein neues Element (`tl-table__more`) eine Modifier-Freigabe braucht (keine erwartet)
- Test: `design-system/test/table.test.mjs`

**Interfaces:**
- Produces (für Task 9–11): Attribute an `.tl-table`: `data-tl-density="normal|compact"` (Paket-Dichte),
  `data-tl-striped` (vorhanden = an), `data-tl-column-lines` (vorhanden = an); an Kopf- und Datenzelle
  `data-tl-align="end"`; an der Zeile die Zustandswörter `group` und `even` in `data-tl-state`; Typo-Klasse
  `tl-type-overline`; Element
  `.tl-table__more` (Chip „+ n weitere“, nutzt `tl-chip`).

- [ ] **Step 1: Failing tests** (`declarationsOf`/`rulesOf`):
  - `.tl-table:not(.tl-fill)` hat `background: var(--tl-surface-layer)`, `border-radius`, Rand `border-separator`, `box-shadow: var(--tl-shadow-…)`; `.tl-table.tl-fill` hat keinen Schatten.
  - `.tl-table__header-row` liest `surface-layer-muted`; `.tl-table__label` hat `color: var(--tl-text-secondary)` und `text-transform: uppercase` (die Typo-Klasse `tl-type-overline` setzt das TSX, Task 9).
  - Werkzeuge: `.tl-table__filter` und `.tl-table__mark` ohne Zustand haben `opacity: 0`; sichtbar bei `.tl-table__header-cell:hover`, `:focus-within`, `[data-tl-state~="filtered"] .tl-table__filter`, und der Sortierpfeil immer, wenn vorhanden (`.tl-table__sort .tl-table__mark` sichtbar).
  - Spaltenlinien: `.tl-table__cell` und `.tl-table__header-cell` ohne `border-right`; mit `.tl-table[data-tl-column-lines]` wieder `border-right: var(--tl-border-width-sm) solid var(--tl-border-separator)`.
  - Zebra: `.tl-table[data-tl-striped] .tl-table__row[data-tl-state~="even"]` liest `surface-layer-muted` (kein `nth-child`: Zeilen sind virtualisiert); gewählt und Hover gewinnen.
  - Ausrichtung: `[data-tl-align="end"]` hat `text-align: end`, `justify-content: flex-end` und `font-variant-numeric: tabular-nums`.
  - Gruppe: `.tl-table__row[data-tl-state~="group"]` liest `surface-layer-muted`; `.tl-table__count` als Kapsel (`radius-full`, `surface-interactive-strong`, Schrift `text-primary` — `text-secondary` hält dunkel nur 4,27; Paar in `pairs.mjs`).
- [ ] **Step 2:** rot. **Step 3:** CSS. **Step 4:** `generate`, `publish-to-worktree`, `node --test`, `lint-css`, Specimen `table.spec.html` mit allen Attributen ansehen (hell/dunkel/kompakt).
- [ ] **Step 5:** Commit `Ticket #TBD-UI: Paket -- Tabelle mit Tiefe: Fläche, leiser Kopf, Werkzeuge bei Hover, Zebra und Spaltenlinien als Attribut, Zahlen rechts, Gruppenzeile`.

### Task 5: In die Engine kopieren

- [ ] **Step 1:** `node tools/publish-to-worktree.mjs`; `node --test test/published.test.mjs` grün.
- [ ] **Step 2:** `grep -rn surface-interactive-selected` im Worktree (ohne `node_modules`, `target`) liefert nichts mehr.
- [ ] **Step 3:** `mvn -B install -Dtl.javadoc.skipTranslate=true -pl ../com.top_logic.layout.react,../com.top_logic.layout.react.mui -DskipTests=false -Dtest=test.com.top_logic.layout.react.TestDesignSystemCopy` grün; MUI-Vitest grün.
- [ ] **Step 4:** **Ein** Commit im Worktree mit Kopie und Engine-Umbenennungen aus Task 1: `Ticket #TBD-UI: Copy the design system package (selection roles, density normal, table with depth) and read surface-interactive-strong.`

---

## Teil B — Engine (Branch `local/ui-durchgang-1`)

### Task 6: Ansicht-Zustand speichern

**Files:**
- Modify: `com.top_logic/src/main/java/com/top_logic/table/TableViewState.java` (Felder :34–56, `copy()` :249–263)
- Modify: `.../table/impl/TableViewStateCodec.java` (Keys :43–65, `toJson` :82–124, `readInto` :140–201)
- Modify: `.../table/impl/DefaultTableView.java` (`restore()` :1193–1276, `resetToDefaults()` :1098–1112, Setter mit `persist()` :1304)
- Modify: `com.top_logic/src/main/java/com/top_logic/table/TableView.java` (Interface)
- Test: `test.com.top_logic.table.TestTableViewStateCodec`, `test.com.top_logic.table.TestDefaultTableView`

**Interfaces:**
- Produces: `TableViewState#getDensity(): String` (`""|"normal"|"compact"`), `isStriped(): boolean`,
  `isColumnLines(): boolean` + Setter; Codec-Keys `density`, `striped`, `columnLines` (weggelassen, wenn Standard);
  `TableView#setViewOptions(String density, boolean striped, boolean columnLines)` (persistiert);
  `resetToDefaults()` setzt die drei auf Standard, Filter bleiben.

- [ ] **Step 1: Failing tests:** `testViewOptionsRoundTrip` (Codec: compact/true/true schreiben und lesen), `testMissingViewOptionsAreDefaults` (JSON ohne Keys → `""`, false, false), in `TestDefaultTableView`: `testPersistsAndRestoresViewOptions` (Muster `testPersistsAndRestoresPersonalization` :531 mit `MapViewStateStore`), `testResetRestoresViewOptionsButKeepsFilters`.
- [ ] **Step 2:** `mvn -B test -DskipTests=false -pl ../com.top_logic -Dtest=test.com.top_logic.table.TestTableViewStateCodec` → FAIL; ebenso `TestDefaultTableView`.
- [ ] **Step 3:** Implementieren (sechs Stellen wie oben). Unbekannter Dichte-Wert beim Lesen → `""`.
- [ ] **Step 4:** Beide Tests grün; `mvn -B install -Dtl.javadoc.skipTranslate=true -pl ../com.top_logic`.
- [ ] **Step 5:** Commit `Ticket #TBD-UI: The table view state keeps the view options density, stripes and column lines per person.`

### Task 7: Spalten-Ausrichtung

**Files:**
- Create: `com.top_logic/src/main/java/com/top_logic/table/ColumnAlignment.java` (`enum ColumnAlignment { START, END }`)
- Modify: `.../table/Column.java` (neue Default-Methode), `.../table/impl/DelegatingColumn.java` (:56–141), `DefaultColumn` + Builder (Muster `pinnedEnd`/`cssClass` :347–357), `ColumnView.java:40–50`, `DefaultTableView.columns()` :356–379
- Modify: `com.top_logic.layout.view/.../table/ColumnSetup.java` (`decorate()` :141–174), `ColumnProviderService.java` (neue Methode `static boolean isNumeric(ColumnType)` über das private `columnKind` :512), `AbstractColumnDeclaration.Config` (:82–106, neue Eigenschaft `align`, `setup(...)` :364–371)
- Modify: `com.top_logic.layout.react/.../control/table/ColumnDef.java` (`toStateMap`: Key `align` nur bei END)
- Test: `test.com.top_logic.table.TestDefaultTableView` (Spaltenansicht trägt die Ausrichtung), ein View-Test für `ColumnSetup` (Zahlenattribut → END, Text → START, `align="end"` an einer Skriptspalte → END)

**Interfaces:**
- Produces: `Column#alignment(): ColumnAlignment` (default `START`); `ColumnView#alignment()`; Client-Key `align: "end"`.

- [ ] **Step 1:** Failing tests wie oben. **Step 2:** rot. **Step 3:** umsetzen; `Config#getAlign(): ColumnAlignment` mit `@Name("align")`, JavaDoc (wird zu `messages_en`). **Step 4:** Tests grün, `tools/check-messages-en.sh` ohne Diff nach Commit des erzeugten Diffs, `messages_de` nachgezogen.
- [ ] **Step 5:** Commit `Ticket #TBD-UI: A table column reports its alignment; numbers align to the end, a column declaration may set it.`

### Task 8: Kommandos und Zustand am TableViewControl

**Files:**
- Modify: `com.top_logic.layout.react/src/main/java/com/top_logic/layout/react/control/table/TableViewControl.java` (State-Keys :189–445, Kommandos :448–524, `refreshSelectionCounts()` :1201–1238, Konstruktor :637–648)
- Create: `.../control/table/SetViewOptionsArguments.java` (Muster `SetFrozenColumnCountArguments`)
- Modify: `com.top_logic.layout.react/src/main/java/com/top_logic/layout/react/I18NConstants.java` (Fußzeile, Muster `…__NAME` :887–902)
- Test: neu `test.com.top_logic.layout.react.control.table.TestTableViewOptions`; `TestTableRowCount` erweitern

**Interfaces:**
- Consumes: Task 6 `setViewOptions`, Task 7 `align`.
- Produces: State-Keys `viewDensity` (String), `striped` (boolean), `columnLines` (boolean), `viewOptions` (boolean, true für jede Tabelle); Kommandos `setViewOptions` `{density, striped, columnLines}` und `resetView` `{}` (ruft dieselbe Zeile wie der Spaltendialog, `rearrange(_view::resetToDefaults)`, `TableViewControl.java:1536`); Fußzeile `rowCount` endet bei aktivem Filter mit „ · Filter: <Preset-Name>“ bzw. „ · n Filter aktiv“ (neue `ResKey`s `TABLE_FILTER_PRESET__NAME`, `TABLE_FILTERS_ACTIVE__COUNT`).

- [ ] **Step 1: Failing tests:** `testSetViewOptionsUpdatesStateAndPersists`, `testResetViewRestoresOptions`, `testRowCountNamesActivePreset`, `testRowCountCountsColumnFilters`.
- [ ] **Step 2:** `mvn -B test -DskipTests=false -pl ../com.top_logic.layout.react -Dtest=test.com.top_logic.layout.react.control.table.TestTableViewOptions` → FAIL.
- [ ] **Step 3:** Handler mit `@ReactCommandHandler`, State per `putState`; JavaDoc für Argumente und ResKeys.
- [ ] **Step 4:** Tests grün; `tools/check-messages-en.sh`; Diff committen; Deutsch nachziehen.
- [ ] **Step 5:** Commit `Ticket #TBD-UI: The React table accepts view options and a view reset; its footer names the active filter.`

### Task 9: Client — Attribute, Ausrichtung, Dichte je Tabelle

**Files:**
- Modify: `com.top_logic.layout.react/react-src/bridge/token-px.ts` (`useTokenSwitch` :65–91, `useTokenPx` :101–103)
- Modify: `com.top_logic.layout.react/react-src/controls/TLTableView.tsx` (Wurzel :1616–1624, `ColumnState` :107–133, Kopfzellen :1747–1843, Datenzellen/Gruppenzeile :1894–1989)
- Test: `com.top_logic.layout.react.mui/react-src/table-view-attributes.test.tsx` (Vitest, Helfer `mountAdapter` aus `adapters/wire-test-support.tsx:109`)

**Interfaces:**
- Consumes: Task 4 Attribute, Task 8 State-Keys.
- Produces: `useTokenSwitch(read, initial, same?, deps?, target?: RefObject<Element>)` beobachtet zusätzlich
  `data-tl-density` am Ziel; `useTokenPx(ref, name, fallback)` übergibt `ref` als Ziel.

- [ ] **Step 1: Failing tests:** Wurzel trägt `data-tl-density="compact"` nur bei `viewDensity:"compact"`, keines bei `""`; `data-tl-striped`/`data-tl-column-lines` folgen dem State; Zelle und Kopf einer Spalte mit `align:"end"` tragen `data-tl-align="end"`; Gruppenzeile trägt `group`, Zeilen mit geradem `row.index` tragen `even` in `data-tl-state`; Kopf-Label trägt `tl-type-overline`; nach State-Wechsel `viewDensity` liest die Tabelle `--tl-size-row` neu (Test mit gestubbtem `getComputedStyle`, Review Focus 3).
- [ ] **Step 2:** `cd com.top_logic.layout.react.mui && NODE_OPTIONS=--no-experimental-webstorage npx vitest run react-src/table-view-attributes.test.tsx` → FAIL.
- [ ] **Step 3:** umsetzen; Farbe und Großschrift kommen aus CSS.
- [ ] **Step 4:** Test grün, `npx vitest run` gesamt grün, `npx tsc --noEmit -p ../com.top_logic.layout.react` 0.
- [ ] **Step 5:** Commit `Ticket #TBD-UI: The React table carries density, stripes, column lines, alignment and group rows as attributes.`

### Task 10: Popover „Ansicht“ am Zahnrad

**Files:**
- Modify: `TLTableView.tsx` (`ColumnsButton` :303–324, Zahnrad-Orte :1818–1820, :2014–2016)
- Create: `com.top_logic.layout.react/react-src/controls/table/TableViewOptions.tsx` (Popover-Inhalt)
- Reuse: `controls/picker/PickerPopover.tsx` (Anker, Fokus, Escape), Part `Checkbox` mit `display:'switch'`, Markup `tl-segmented`/`tl-segmented__segment` mit Pfeiltasten wie `TLSegmentedChoice.tsx:89–108`, Part `MenuTrigger` mit `haspopup:'dialog'`
- Test: `com.top_logic.layout.react.mui/react-src/table-view-options.test.tsx`

**Interfaces:**
- Consumes: Task 8 `setViewOptions`, `resetView`, `openColumnSelect`, `viewOptions`, `columnSelect`.
- Produces: `TableViewOptions` Props `{ density: ''|'normal'|'compact'; striped: boolean; columnLines: boolean; columnSelect: boolean; onChange(o: {density, striped, columnLines}): void; onColumns(): void; onReset(): void }`.

- [ ] **Step 1: Failing tests:** Zahnrad ist bei jeder Tabelle da (`viewOptions:true`), öffnet `role="dialog"` mit Titel „Ansicht“; Segment „Kompakt“ sendet sofort `setViewOptions {density:'compact', striped:false, columnLines:false}`; Schalter Zebrastreifen sendet `striped:true`; „Spalten wählen und ordnen …“ nur bei `columnSelect`, sendet `openColumnSelect`; „Zurücksetzen“ sendet `resetView`; Escape schließt und gibt den Fokus ans Zahnrad.
- [ ] **Step 2:** rot. **Step 3:** umsetzen; Texte als `@CustomKey`-ResKeys `js.table.*` mit `@en`-JavaDoc in `I18NConstants.java` (Muster :717–733), `tools/check-messages-en.sh`, erzeugten Diff committen, `messages_de` nachziehen. **Step 4:** Vitest gesamt (mit `NODE_OPTIONS`), `tsc` grün.
- [ ] **Step 5:** Commit `Ticket #TBD-UI: The gear of the React table opens the view options: density, stripes, column lines, columns, reset.`

### Task 11: Presets mit „+ n weitere“

**Files:**
- Modify: `TLTableView.tsx` Filterleiste (:1633–1707, Chip-Klick :1360–1366, Löschen :1382–1387)
- Reuse: Messmuster `TLToolbar.tsx` (~:603, `tokenPx`), `Menu`/`ButtonDefaults` mit `radio` (`button-defaults.ts:17–25`), `useFocusAfterRemove`
- Test: `com.top_logic.layout.react.mui/react-src/adapters/chips.test.tsx` (ab :283) erweitern

**Interfaces:**
- Consumes: `namedFilters`, `activeNamedFilter`, Kommandos `applyNamedFilter`, `clearFilter`, `deleteNamedFilter`.

- [ ] **Step 1: Failing tests** (Breite per `ResizeObserver`-Stub): passen 3 von 8 → 3 Chips + „+ 5 weitere“; aktives Preset aus dem Menü steht in der Reihe, das letzte sichtbare wandert ins Menü; kein aktives → erste n in Reihenfolge; Menü-Einträge sind `menuitemradio` mit `aria-checked` am aktiven; eigenes Preset im Menü hat eine Entfernen-Aktion, die `deleteNamedFilter` sendet; Breitenänderung rechnet neu.
- [ ] **Step 2:** rot. **Step 3:** umsetzen; Text „+ n weitere“ als ResKey wie in Task 10. **Step 4:** Vitest (mit `NODE_OPTIONS`), `tsc` grün, `check-messages-en.sh`.
- [ ] **Step 5:** Commit `Ticket #TBD-UI: Filter presets that do not fit move behind "+ n more"; the active preset stays visible.`

### Task 12: Docs und Sichtprüfung

**Files:**
- Modify: `docs/skalen.md` (Abschnitt „UI-Durchgang 1“: Auswahl-Rollen, Umbenennung, Dichte normal, Ansicht, Presets, Ausrichtung), `STATUS.md`, `docs/ui-durchgang.md` (U25, U28, U29, U31, U36 erledigt), `docs/migration/altlast.md` (Umbenennung `surface-interactive-selected` → `-strong`)
- Engine: Doku `com.top_logic.layout.view/src/main/java/META-INF/tl-docs/view-layer/tables.md` (Ansicht, `align`)

- [ ] **Step 1:** Demo bauen (`mvn -B install -Dtl.javadoc.skipTranslate=true -pl ../com.top_logic,../com.top_logic.layout.view,../com.top_logic.layout.react,../com.top_logic.layout.react.mui,../com.top_logic.demo.react`) und starten (Memory „Lokale Demo statt Docker“).
- [ ] **Step 2:** Objektliste, Tabellenspalten, Projekte, Baum-Demo, Board, Navigation — hell/dunkel, normal/kompakt, global kompakt + Tabelle normal; Screenshots für Hendrik.
- [ ] **Step 3:** Paket- und Engine-Gates gesamt grün, `tools/check-messages-en.sh` ohne Diff.
- [ ] **Step 4:** Commits `Ticket #TBD-UI: skalen/STATUS -- UI-Durchgang 1` (Paket) und `Ticket #TBD-UI: Document the view options and column alignment of the React table.` (Engine).
