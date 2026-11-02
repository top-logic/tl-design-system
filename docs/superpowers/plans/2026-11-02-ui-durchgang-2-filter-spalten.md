# UI-Durchgang 2: Filter und Spaltenwahl am Ort — Umsetzungsplan

> **Für ausführende Agenten:** Pflicht-Skill superpowers:subagent-driven-development (empfohlen) oder
> superpowers:executing-plans. Schritte mit `- [ ]`.

**Ziel:** Spaltenfilter als nicht modales Popover am Trichter, sofort wirksam; Spaltenwahl als zweite Seite von
„Ansicht“, sofort wirksam; ganze Zeile als Klickfläche (U27, U42).

**Aufbau:** Beide Popovers sind Client-Flächen der Tabelle (`PickerPopover`, wie „Ansicht“ heute), ihr Inhalt sind
Server-Kinder, die `TableViewControl` in seinen State legt (`putState(key, control)`, Client `<TLChild>`). Jede
Änderung im Inhalt ruft auf dem Server sofort `_view.filter(...)` bzw. die Spaltenänderung und
`rebuildAfterRowChange()`. Die Werteliste bekommt ein eigenes Control; Text-, Bereichs- und Boolean-Filter behalten
ihre `FilterEditor`-Felder; `ColumnFilterUI` behält „Anwenden“. Die Dialoge entfallen.

**Technik:** Java 21, React/TSX (Vite, Vitest), Paket `tl-design-system` (Node, `node --test`).

**Plan-Review:** 02.11., frischer Agent (Fable): 13 Befunde, alle eingearbeitet.

**Spec:** `docs/superpowers/specs/2026-11-02-ui-durchgang-2-filter-spalten-design.md` (freigegeben 02.11.), Mockup
`.superpowers/brainstorm/25838-1793614286/content/u27-filter-popover.html`. **Ticket:** #30102.

## Global Constraints

- **Start erst nach dem Merge von !2101 (Paket als Modul `tl-design-system`) und !2014 (UI-Durchgang 1).** Basis:
  `origin/master` danach. Paketpfade: `tl-design-system/src/components/…`; kein `publish-to-worktree` mehr.
- Engine-Worktree `_Working-Tree/tl8-wt-30102`, Branch `CWS/CWS_30102_ui_pass_2_filter_columns`. Commits englisch,
  Präfix `Ticket #30102:`. Kein Push ohne Hendriks Freigabe; Subagenten pushen nie.
- `messages_en.properties` nie von Hand: JavaDoc an `I18NConstants`, dann `tools/check-messages-en.sh`
  (`TL_WORKTREE` auf den Worktree), Deutsch in `messages_de.properties` nachziehen.
- Paket: nur Tokens, kein Literal, kein `:focus` ohne `-visible`, kein `outline: none` (Klassen-Gate); jede neue
  Klasse mit Vertrag (`*.contract.md`) und Specimen.
- Kein Nachbau: die Spaltenseite ist `TLColumnSelect` + `ReactColumnSelectControl`; das Popover ist `PickerPopover`.
- JDK 21. Maven aus der Repo-Wurzel mit `-pl` (Engine-`CLAUDE.md`, nie in ein Modul `cd`-en), `-B`, Tests mit
  `-DskipTests=false` und vollqualifiziertem `-Dtest`. Das workspace-lokale Maven-Repo nach Engine-`CLAUDE.md`
  (`.claude/scripts/local-m2.sh`) einmal je Worktree erzeugen.
- Kein neues `--tl-…` außerhalb des Pakets, kein `var()`-Rückfall (Klassen-Gate `lint-css.mjs:189,247`, Ratsche
  über `react-src`).
- Konstante `FILTER_TYPING_PAUSE_MS = 400` (Spec E4).
- Suche der Werteliste ab **8** Werten (Spec E3); die Spaltenwahl behält ihre Schwelle (> 10).

## Entscheidungen des Orchestrators

- **Popover-Mechanik (Spec §1 überlässt sie dem Bauenden):** nicht `ReactPopoverControl` erweitern, sondern
  `PickerPopover` mit einem Server-Kind im State der Tabelle — so wie „Ansicht“ heute schon am Zahnrad hängt. Grund:
  der Anker (Trichter, Zahnrad) wird vom Client gezeichnet; `ReactPopoverControl` zeichnet seinen Trigger immer
  selbst und hat kein Anker-Feld. Kosten bei Irrtum: eine zweite Art verankertes Popover neben `TLPopover`.
- **„Alle abgehakt“ (Spec §1, offen):** gespeichert als `NegatedFilterState(OptionsFilterState(alle Werte))` — „alle
  außer allen“. Konsistent mit E2 (ein später neuer Wert erscheint) und ohne neues Speicherformat. Zellen ohne Wert
  (`null`), die keine Option sind, bleiben sichtbar; Test benennt das. Voraussetzung: `OptionsColumnFilter.predicate`
  verträgt `null` (heute NPE über `Set.copyOf(...).contains(null)`, Review-Befund 2).
- **Popover-Höhe (Review-Befund 1):** keine Custom Property. `usePopover` setzt per floating-ui `size` direkt
  `maxHeight` am schwebenden Element; im Paket ist `.tl-popover` eine Flex-Spalte, der Rollbereich wächst mit
  `min-height: 0`.
- **Textfelder (Review-Befund 3):** vorhandene Mechanik, keine neue Option: `ReactFormFieldControl.setDebounce(
  FILTER_TYPING_PAUSE_MS)` und `setCommitListener(...)` (Enter flusht und schickt `commit`); der Server filtert in
  `FieldModel.addListener` (`onValueChanged`).
- **ARIA der Werteliste:** Gruppe von `checkbox`-Zeilen (`role="group"` mit Namen der Spalte), keine `listbox` —
  jede Zeile ist ein eigenständiger Schalter mit sofortiger Wirkung, Pfeiltasten wandern zwischen den Zeilen
  (Roving). Fokus beim Öffnen: Suche, wenn vorhanden, sonst die erste Zeile bzw. das erste Feld.
- **Anker sichtbar halten:** Trichter mit `aria-expanded`, Paketregel `.tl-reveal-on-hover[aria-expanded="true"]`
  zeigt ihn, solange sein Popover offen ist (sonst verschwindet der Anker ohne aktiven Filter).
- **Nicht modal (E1):** `PickerPopover` bekommt `trapFocus?: boolean` (Standard `true`); beide neuen Popovers
  setzen `false`. Esc und Klick daneben schließen wie heute.

## Review Focus

1. **Alte gespeicherte Filter:** `OptionsFilterState({Offen})` aus der persönlichen Konfiguration zeigt „Offen“
   angehakt, Rest abgehakt; die erste Änderung speichert die neue Form. (Test in Task 2.)
2. **Neuer Wert nach Abhaken:** abgehakt {Erledigt}, dann kommt „Neu“ in die Daten → „Neu“ ist sichtbar.
   (Test in Task 2.)
3. **Zeilen ändern sich unter offenem Popover:** der eigene Filter blendet Zeilen aus, die Tabelle zeichnet neu —
   Popover bleibt offen, Anker bleibt der Trichter, Fokus bleibt im Popover. (Vitest Task 5.)
4. **Letzte sichtbare Spalte bei sofortiger Wirkung:** Server-Guard bleibt, Tabelle bekommt nie 0 Spalten.
   (Java Task 6.)
5. **Popover in niedrigem Fenster (600 px):** bleibt im Fenster, Rollbereich rollt. (Sichtprüfung Task 8.)

---

### Task 1: Worktree

- [ ] Nach beiden Merges: im Hauptrepo `git fetch origin`,
      `git worktree add ../tl8-wt-30102 -b CWS/CWS_30102_ui_pass_2_filter_columns origin/master`.
- [ ] Workspace-lokales Maven-Repo (`.claude/scripts/local-m2.sh`), dann aus der Wurzel `mvn -B -N install -pl tl-bom`
      (Falle aus #30098) und `mvn -B install -pl tl-design-system,com.top_logic.layout.react`.
- [ ] Fertig, wenn beides grün ist.

### Task 2: Abbildung Häkchen ↔ Filterzustand (Java, rein)

**Dateien:** neu `com.top_logic/src/main/java/com/top_logic/table/filter/OptionChecks.java`,
Test `com.top_logic/src/test/java/test/com/top_logic/table/TestOptionChecks.java`.

**Interfaces — Produces:**
- `static Set<Object> OptionChecks.checked(List<Option> options, FilterState state)` — angehakte Werte.
- `static FilterState OptionChecks.state(List<Option> options, Set<Object> checked)` — `null` wenn alle angehakt.

- [ ] Tests zuerst:
  - `testNoFilterChecksAll`: `checked(opts, null)` = alle Werte.
  - `testLegacyIncludeForm`: `checked(opts, new OptionsFilterState(Set.of("Offen")))` = `{Offen}`.
  - `testNegatedForm`: `checked(opts, new NegatedFilterState(new OptionsFilterState(Set.of("Erledigt"))))` = alle
    außer Erledigt.
  - `testAllCheckedIsNoFilter`: `state(opts, alle)` == `null`.
  - `testUncheckStoresNegated`: `state(opts, alle außer Erledigt)` equals
    `new NegatedFilterState(new OptionsFilterState(Set.of("Erledigt")))`.
  - `testNoneCheckedHidesEverything`: Prädikat von `state(opts, Set.of())` über `OptionsColumnFilter` +
    `ColumnLogic` lässt keinen Optionswert durch, lässt `null` durch.
  - `testNewValueStaysVisible`: Zustand aus `testUncheckStoresNegated`, Wert `"Neu"` (keine Option) passiert.
  - `testEmptyIncludeIsNoFilter`: `checked(opts, new OptionsFilterState(Set.of()))` = alle.
  - `testNoOptionsMeansNoFilter`: leere Optionsliste, `state(List.of(), Set.of())` == `null` (Randfall benannt).
  - `testPredicateToleratesNull`: `OptionsColumnFilter.predicate(new OptionsFilterState(Set.of("a"))).test(null)`
    ist `false`, ohne Ausnahme.
- [ ] `OptionsColumnFilter.predicate`: `value != null && selected.contains(value)`.
- [ ] Implementieren; JavaDoc (Englisch) begründet die Negated-Form. `Option` = `com.top_logic.table.Option`
      (`record Option(Object value, ResKey label)`), Werte über `option.value()`.
- [ ] `mvn -B install -pl com.top_logic -DskipTests=false -Dtest=test.com.top_logic.table.TestOptionChecks` grün.
- [ ] Commit.

### Task 3: Paket — Werteliste, Zeile als Klickfläche, Popover-Höhe, Seitenwechsel

**Dateien:** `tl-design-system/src/components/` — neu `filter-list/filter-list.css`, `filter-list.contract.md`,
`filter-list.spec.html`; ändern `menu/menu.css` + Vertrag (Zeile mit Häkchen/Schalter), `table/table.css` +
`table.contract.md` (Abschnitt „Ansicht“: zweite Seite, Kopf mit Zurück; Filter-Popover am Trichter),
`popover/popover.css` + Vertrag (Höchsthöhe aus `--tl-popover-available-height`, Rollbereich `tl-popover__scroll`);
Tests in `tl-design-system/test/`.

- [ ] Tests zuerst (`node --test`), je Regel ein Test im Stil der vorhandenen Komponenten-Tests:
  - `tl-menu__item--check` (Name im Vertrag festlegen): `display:flex`, volle Breite, Hover-Fläche wie `tl-menu__item`;
    `tl-choice` darin wird nicht mehr `inline-flex` (U42).
  - `tl-filter-list`: Zeile = `tl-menu__item--check`, Anzahl rechts `tl-filter-list__count` mit `tl-nums`, leiser
    Wert (`data-tl-state~="empty"`) in `text-helper`, Kopfzeile „Alle“ mit Trennlinie, Fuß mit zwei Aktionen.
  - `.tl-popover` als Flex-Spalte; `.tl-popover__scroll`: `flex: 1 1 auto; min-height: 0; overflow-y: auto` (kein
    `var()`-Rückfall, keine neue Variable; die Höhe setzt `usePopover` als `maxHeight`).
  - `.tl-reveal-on-hover[aria-expanded="true"]` ist sichtbar (Anker des offenen Filter-Popovers).
  - `.tl-table-view-options__page` und `__back`: Kopf mit Zurück-Knopf.
- [ ] CSS + Verträge + Specimen; `node tools/generate.mjs`, `node tools/lint-css.mjs`, `npm test` und
      `npm run test:dom` im Modul grün.
- [ ] Commit.

### Task 4: Popover-Höhe und nicht modales Picker-Popover (Client)

**Dateien:** `com.top_logic.layout.react/react-src/bridge/popover.ts`,
`react-src/controls/picker/PickerPopover.tsx`; Vitest in `com.top_logic.layout.react.mui/react-src/adapters/pickers.test.tsx`.

**Produces:** `usePopover` setzt am schwebenden Element `style.maxHeight = availableHeight + 'px'` (floating-ui
`size`, in 0.27.20 vorhanden); `PickerPopover` Prop `trapFocus?: boolean` (Standard `true`) → bei `false`
`useFocusTrap(…, { trap: false, restore: 'from-inside' })`.

- [ ] Vitest zuerst: `PickerPopover trapFocus={false}` lässt Tab aus dem Popover heraus; Esc schließt weiterhin.
- [ ] `size`-Middleware an `popoverMiddleware` anhängen (nach `flip`, `shift`); Vitest: das schwebende Element
      trägt `maxHeight`.
- [ ] Vitest `layout.react.mui` grün (`NODE_OPTIONS=--no-experimental-webstorage`), Typecheck grün.
- [ ] Commit.

### Task 5: Filter-Popover

**Dateien:** neu `com.top_logic.layout.react/src/main/java/com/top_logic/layout/react/control/table/ReactFilterListControl.java`,
neu `react-src/controls/table/TLFilterList.tsx` (+ Registrierung wie andere Controls); ändern
`TableViewControl.java` (`handleOpenFilter`, neu `handleCloseFilter`, `fieldControl`), `TLTableView.tsx`
(Trichter, Popover), `I18NConstants.java` (layout.react); Tests: neu
`src/test/java/test/com/top_logic/layout/react/control/table/TestTableFilterPopover.java`, Vitest in
`layout.react.mui/react-src/adapters/inline-buttons.test.tsx` (Filter-Teil) und neu `filter-popover.test.tsx`.

**Interfaces:**
- Consumes: `OptionChecks` (Task 2), `PickerPopover trapFocus` (Task 4), Paketklassen (Task 3).
- Produces: State-Key `filterPopover` an `TLTableView` = `{ column: string, content: <child> } | null`;
  Kommandos `openFilter {column}` (bleibt), neu `closeFilter`. `ReactFilterListControl(ReactContext,
  List<Option> options, MatchCounts counts, FilterState current, Consumer<FilterState> apply)`, Modul
  `TLFilterList`, State `entries: [{key, label, count?, checked}]`, `searchable` (≥ 8), Kommandos `toggle {key}`,
  `all {checked}`, `invert`, `clear`.

- [ ] Java-Tests zuerst (`TestTableFilterPopover`):
  - `openFilter` legt `filterPopover` mit `column` und Inhalt an; ein zweites `openFilter` ersetzt ihn; `closeFilter`
    setzt `null` und gibt das Kind frei.
  - Werteliste: `toggle` eines Werts filtert sofort (`_view.state().getFilters()` hat die Negated-Form,
    `filterActive` der Spalte wahr), `all {checked:true}` löscht den Filter, `invert` dreht die Menge, `clear` = alle.
  - Textfilter: Setzen des Feldwerts filtert ohne weiteres Kommando.
  - `ColumnFilterUI`: Feldänderung filtert **nicht**; das Kommando des Knopfs „Anwenden“ filtert.
  - Kein `DialogManager`-Aufruf mehr (Test mit einem Kontext ohne Dialogmanager filtert trotzdem).
- [ ] Ersetzen und Schließen geben das alte Kind mit `cleanupTree()` frei (`putState` entsorgt nichts; Review-Befund 5).
- [ ] Server: `handleOpenFilter` baut je Filterart den Inhalt — `FilterInput.Options` (ohne `InvertingFilterEditor`)
      → `ReactFilterListControl`; sonst `FilterEditors.create` + `ReactFormBuilder` wie heute, je `FieldModel` ein
      Listener, der `_view.filter(column, editor.read())` + `rebuildAfterRowChange()` ruft; `ColumnFilterUI` →
      `buildForm` + Knopf „Anwenden“. Inhalt in einen Container mit Fuß „Filter entfernen“ (`JS_TABLE_CLEAR`).
      Dialogcode entfernen.
- [ ] Textfelder (E4): je Textfeld `setDebounce(FILTER_TYPING_PAUSE_MS)` und `setCommitListener(v -> HandlerResult.DEFAULT_RESULT)`
      (heute: 300 ms Debounce im Client, Enter schickt ohne Commit-Listener nichts — `TLTextInput.tsx:91-97`);
      Java-Test: Commit-Kommando filtert.
- [ ] Client: `TLTableView` merkt sich die Trichter-Elemente je Spalte; bei `filterPopover` ein
      `PickerPopover` (`trapFocus={false}`, Anker = Trichter der Spalte, `className` aus Task 3) mit
      `<TLChild control={filterPopover.content}/>`; `onClose` → `closeFilter`; Trichter mit `aria-expanded`; Fokus
      beim Öffnen nach „ARIA der Werteliste“, beim Schließen zurück zum Trichter. `TLFilterList` registrieren in
      `controls-entry.ts` (`register('TLFilterList', …)`); MUI braucht keinen Adapter (`install.ts:80-92`). `TLFilterList`: Suche ab 8 (Client), „Alle“ (entfällt bei Suche), Anzahl, leise Werte,
      „Auswahl umkehren“, ganze Zeile klickbar, Pfeiltasten auf/ab, ARIA nach Entscheidung oben.
- [ ] Vitest: „Filter entfernen“ ist ohne aktiven Filter deaktiviert (E6); Trichter öffnet das Popover ohne Abdunkeln; Klick daneben schließt und schickt `closeFilter`;
      Review-Focus 3 (neuer State mit weniger Zeilen, Popover bleibt, Fokus bleibt); Suche erscheint ab 8 Werten.
- [ ] I18N (JavaDoc): „Alle“, „Auswahl umkehren“, „Werte suchen …“, „Anwenden“, „Kein Wert passt“;
      `JS_TABLE_FILTER`/`JS_TABLE_CLEAR` weiter nutzen. `check-messages-en.sh`, Deutsch.
- [ ] Gates: Java `control.table` (`-Dtest=test.com.top_logic.layout.react.control.table.Test*`), `TestFilterEditors`,
      Vitest beide Module, Typecheck. Commit.

### Task 6: Spaltenwahl als Seite von „Ansicht“

**Dateien:** `ReactColumnSelectControl.java` (Änderungs-Rückruf), `TableViewControl.java` (neu
`handleOpenColumns`/`handleCloseColumns`, `handleOpenColumnSelect` und `CMD_OPEN_COLUMN_SELECT` entfernen),
`TableViewOptions.tsx` (zweite Seite), `TLTableView.tsx` (Handler); Tests `TestColumnSelectionApply.java`,
`TestReactColumnSelect.java`, Vitest `table-view-options.test.tsx`, `inline-buttons.test.tsx` (Spaltenteil).

**Produces:** `ReactColumnSelectControl#setOnChange(Runnable)` (nach jedem Kommando, das etwas geändert hat);
State-Key `columnSelection` an `TLTableView` (Kind oder `null`); Kommandos `openColumns`, `closeColumns`.

- [ ] Java-Tests zuerst:
  - `openColumns` legt `columnSelection` an; `columnVisible`/`columnLock`/`columnReorder`/`group` am Kind ändern
    die Tabelle sofort (`_view.columns()`, `frozenColumnCount()`, Gruppierung); `closeColumns` gibt das Kind frei.
  - Review-Focus 4: zweimal `columnVisible false` bis eine Spalte bleibt → Tabelle hat ≥ 1 Spalte.
  - „Einblenden und fixieren“ einer ausgeblendeten Spalte in einem Kommando (`columnLock locked:true`).
  - `TestColumnSelectionApply` an das Wegfallen der Arbeitskopie anpassen, Aussage beibehalten.
- [ ] Server: `onChange` → `applyColumns(sel.visibleColumns(), sel.lockedColumns(), sel.groupedColumn())`.
      Ersetzen/Schließen: altes Kind mit `cleanupTree()` freigeben.
- [ ] Client `TLColumnSelect`: Klick auf die Zeile (nicht auf Griff, Nadel, Gruppieren, Auge) sendet `columnVisible`
      (E8, E14; heute schaltet nur das Auge, `TLColumnSelect.tsx:194-205`); die gesperrte letzte Spalte reagiert
      nicht. Vitest dazu.
- [ ] Client: `TableViewOptions` Seite 2 „Spalten“ (Eintrag „Spalten · n von m ›“ statt „Spalten wählen …“), Kopf
      mit Zurück, Inhalt `<TLChild control={columnSelection}/>` — **kein** zusätzlicher `tl-popover__scroll`: `.tl-reorder-list`
      rollt schon selbst (`reorder-list.css:10-16`); im Flex-Layout mit `min-height: 0` an die Popover-Höhe hängen; Seitenwechsel schickt
      `openColumns`/`closeColumns`; Schließen des Popovers schickt `closeColumns`. „Zurücksetzen“ nur auf Seite 1
      (E16). Ziehen (E9) mit dem vorhandenen `useListReorder` im Browser prüfen; bleibt das gezogene Element nach dem
      Loslassen halbtransparent, Ursache im Hook beheben (Mockup-Befund 02.11.: Liste nicht während des Ziehens neu
      aufbauen).
- [ ] Vitest: Seite 2 öffnet und schließt, Zurück fokussiert den Eintrag „Spalten“; kein Dialog.
- [ ] I18N: „Spalten · {0} von {1}“, „Zurück“; `JS_TABLE_VIEW_CHOOSE_COLUMNS` (Client-Schlüssel
      `js.table.viewChooseColumns`, nach diesem greppen) und `TABLE_COLUMNS_RESET` (nur in `handleOpenColumnSelect`)
      entfernen; Deutsch in `messages_de.properties` von Hand nachziehen. MUI-Tests `table-view-options.test.tsx`
      und `inline-buttons.test.tsx` erwarten heute `openColumnSelect` — anpassen. Gates wie Task 5. Commit.

### Task 7: Zeile als Klickfläche in „Ansicht“ (U42)

**Dateien:** `TableViewOptions.tsx`, Vitest `table-view-options.test.tsx`.

- [ ] Vitest zuerst: Klick auf die Zeile (nicht auf Kästchen oder Text) von „Streifen“ schaltet.
- [ ] Schalter in `tl-menu__item--check` (Task 3) statt `tl-table-view-options__switch` mit `tl-choice`.
- [ ] Gates, Commit.

### Task 8: Sichtprüfung und Abschluss

- [ ] Demo `tl-demo-react` (`-Pide,with-h2`, eigener Port), Prüfung per Subagent im Browser, alle Punkte aus
      Spec „Erfolg“ in hell und dunkel, normal und kompakt, plus Review-Focus 5 (Fenster 600 px).
- [ ] `docs/ui-durchgang.md` (Paket-Repo): U27, U42 auf ✅; `docs/skalen.md` Abschnitt „UI-Durchgang 2“;
      `STATUS.md`.
- [ ] Alle Gates: Paket, Java `control.table` + `TestOptionChecks` + `TestFilterEditors`, Vitest beide Module,
      `check-messages-en.sh`. **Nicht pushen** — Bericht.
