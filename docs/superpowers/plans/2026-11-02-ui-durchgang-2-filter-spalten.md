# UI-Durchgang 2: Filter und Spaltenwahl am Ort — Umsetzungsplan

> **Für ausführende Agenten:** Pflicht-Skill superpowers:subagent-driven-development (empfohlen) oder
> superpowers:executing-plans. Schritte mit `- [ ]`.

**Ziel:** Spaltenfilter als nicht modales Popover am Trichter, sofort wirksam; Spaltenwahl als zweite Seite von
„Ansicht“, sofort wirksam; ganze Zeile als Klickfläche (U27, U42); **ein Verhalten für alle Menüs der Tabelle (K1–K6, Spec-Nachtrag
04.11.)** — Bedingung, unter der Bernhard den PR überhaupt ansieht.

**Aufbau:** Beide Popovers sind Client-Flächen der Tabelle (`PickerPopover`, wie „Ansicht“ heute), ihr Inhalt sind
Server-Kinder, die `TableViewControl` in seinen State legt (`putState(key, control)`, Client `<TLChild>`). Jede
Änderung im Inhalt ruft auf dem Server sofort `_view.filter(...)` bzw. die Spaltenänderung und
`rebuildAfterRowChange()`. Die Werteliste bekommt ein eigenes Control; Text-, Bereichs- und Boolean-Filter behalten
ihre `FilterEditor`-Felder; `ColumnFilterUI` behält „Anwenden“. Die Dialoge entfallen.

**Technik:** Java 21, React/TSX (Vite, Vitest), Paket `tl-design-system` (Node, `node --test`).

**Plan-Review:** 02.11., frischer Agent (Fable): 13 Befunde, alle eingearbeitet. **Nachtrag 04.11.** (Tasks 1, 4, 7–10
neu oder erweitert) braucht ein neues Plan-Review vor dem Start.

**Spec:** `docs/superpowers/specs/2026-11-02-ui-durchgang-2-filter-spalten-design.md` (freigegeben 02.11.), Mockup
`.superpowers/brainstorm/25838-1793614286/content/u27-filter-popover.html`. **Ticket:** #30102.

## Global Constraints

- **Basis (04.11.):** Kopf von !2014 (`75bf7aee41`) plus `4cce1551c2` und `4e1984ee42` (Reverts, „Ansicht“ ist
  wieder da, Client und Server). Nach dem Merge von !2014: `git merge origin/master`. Paketpfade:
  `tl-design-system/src/components/…`; kein `publish-to-worktree` mehr.
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
- **Hülle (K2):** ein Hook `usePopupSurface({ open, anchor, placement, onClose, initialFocus, trapFocus, inside })`
  in `bridge/popup-surface.ts` bündelt `usePopover`, `useCloseOnOutsidePress`, `useStandaloneKeyboardScope` (Esc),
  `useFocusTrap` und die Rückgabe an den Anker; liefert `{ setFloating, style }`. `Menu`, `PickerPopover` und die
  Toolbar-`MenuGroup` nutzen ihn; `useRovingMenu` verliert seinen Esc-Zweig (der Scope übernimmt). Kein neuer
  sichtbarer Baustein. Grund: drei Esc-Wege, drei Auslöser, eine fehlende Höhe — Fehler, die je Baustein einzeln
  wiederkämen.
- **Fokus am Zeigerpunkt (K2):** findet die Falle beim Öffnen kein Ziel, weil die Fläche erst im nächsten Frame
  steht, versucht die Hülle es einmal per `requestAnimationFrame` erneut (wie `MuiMenuAdapter` heute).
- **Auslöser (K2):** Hook `usePopupTrigger(open, setOpen, kind: 'menu' | 'dialog')` → `{ onClick, 'aria-haspopup',
  'aria-expanded' }`; `onClick` schaltet um und ignoriert den Druck, der gerade geschlossen hat (`pressClosedSurface`).
  Zahnrad, „+ n weitere“, Trichter, Toolbar-`MenuGroup` (die behält ihr `onMouseDown preventDefault`, Grund im
  Kommentar dort).
- **Höhe (K2/E13):** `usePopover` hängt `size()` an und setzt `maxHeight` = freie Höhe; die CSS-Kappe
  `max-height: var(--tl-size-popover-max)` an `.tl-popover` bleibt als Obergrenze (das Inline-`maxHeight` greift nur,
  wo der Platz kleiner ist: der Hook setzt `min(verfügbar, Kappe)`, die Kappe aus dem Token gelesen).
- **„Ansicht“ als Menü (K4):** die erste Seite ist `role="menu"` mit `useRovingMenu`; Dichte als drei
  `menuitemradio`, Streifen und Spaltenlinien als `menuitemcheckbox`, „Spalten“ und „Zurücksetzen“ als `menuitem`.
  Die Fläche bleibt `PickerPopover` (`role="dialog"`), weil Seite 2 kein Menü ist.

## Review Focus

0. **Jedes Menü der Tabelle** nach der Liste „Erfolg zusätzlich“ der Spec (Esc ohne Fokus in der Fläche, zweiter
   Klick schließt, Höhe am unteren Rand, Shift+F10, Pfeile in „Ansicht“, Suche vor Chip). (Tasks 4, 7–9, Task 10.)
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

- [x] **04.11.:** Branch auf `75bf7aee41` vorgespult, „Ansicht“ per Revert zurück (`4cce1551c2`, `4e1984ee42`;
      Konflikt in `table-view-attributes.test.tsx` gelöst, beide Testblöcke bleiben).
- [ ] Gates des Ausgangsstands: Paket `npm test`, Java `layout.react` + `TestDefaultTableView` +
      `TestTableViewStateCodec`, Vitest beide Module — grün, bevor Task 2 beginnt.
- [ ] (alt) Nach beiden Merges: im Hauptrepo `git fetch origin`,
      `git worktree add ../tl8-wt-30102 -b CWS/CWS_30102_ui_pass_2_filter_columns origin/master`.
      **Vorgezogen 03.11. (Hendrik):** Worktree und Branch stehen schon, auf `origin/CWS/CWS_30000_ui_durchgang_1`
      (`a8426306e7`, ohne Upstream). Nach dem Merge von !2014: `git merge origin/master` (bringt den Merge-Commit), dann
      Task 2. Änderungen aus Bernhards Review an !2014 kommen auf demselben Weg.
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

### Task 4: Eine Hülle, ein Auslöser, Höhe, nicht modal (Client, K2)

**Dateien:** `com.top_logic.layout.react/react-src/bridge/popover.ts`, neu `bridge/popup-surface.ts` und
`bridge/popup-trigger.ts` (+ Export in `bridge-entry.ts`), `bridge/menu.tsx`, `controls/picker/PickerPopover.tsx`,
`controls/TLToolbar.tsx` (`MenuGroup`), Auslöser in `controls/table/TableViewOptions.tsx` (Zahnrad) und
`controls/table/FilterPresets.tsx`; Vitest in `com.top_logic.layout.react.mui/react-src/adapters/pickers.test.tsx` und
neu `popup-surface.test.tsx`.

- [ ] Vitest zuerst, je Baustein (`Menu`, `PickerPopover`, `MenuGroup`): Esc schließt, auch wenn der Fokus noch am
      Auslöser liegt; Klick daneben schließt; zweiter Klick auf den Auslöser schließt und öffnet nicht neu; Auslöser
      trägt `aria-haspopup` und `aria-expanded`; Fokus kehrt an den Auslöser zurück; ein `Menu` am Zeigerpunkt
      bekommt Fokus auf den ersten Eintrag. In einem `TLWindow` schließt Esc nur das Menü, nicht das Fenster.
- [ ] `usePopupSurface` und `usePopupTrigger` nach „Entscheidungen“; die drei Bausteine darauf umstellen, ohne
      ihre öffentlichen Props zu brechen (alle Aufrufer per `git grep` prüfen, auch `layout.react.mui`).

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

- [ ] Vitest zuerst: Klick auf die Zeile (nicht auf Kästchen oder Text) von „Streifen“ schaltet; Pfeile, Home, End
      wandern über alle Einträge der ersten Seite (K4); „Zurücksetzen“ schickt `resetView` und schließt (K5).
- [ ] Schalter in `tl-menu__item--check` (Task 3) statt `tl-table-view-options__switch` mit `tl-choice`; Rollen nach
      „‚Ansicht‘ als Menü“.
- [ ] Gates, Commit.

### Task 8: Kopfmenü per Tastatur (K4)

**Dateien:** `TLTableView.tsx` (Kontextmenü des Spaltenkopfs), Vitest in `layout.react.mui`.

- [ ] Vitest zuerst: Shift+F10 und `ContextMenu` auf dem fokussierten Kopf öffnen das Kopfmenü, verankert am Kopf
      (nicht an einem Zeigerpunkt), Fokus auf dem ersten Eintrag; Esc schließt, Fokus zurück am Kopf.
- [ ] Umsetzen wie `TLMenuRegion` (gleiche Tasten); Gates, Commit.

### Task 9: Tabellensuche verliert nichts (K6)

**Dateien:** `TLTableView.tsx` (Suche), Vitest in `layout.react.mui`.

- [ ] Vitest zuerst: Tippen, dann innerhalb der Pause Klick auf einen Vorlagen-Chip bzw. einen Sortierkopf → erst
      `search`, dann das andere Kommando; Tippen, dann Blur → `search` ohne Warten; Tippen, dann Aushängen → `search`
      wird gesendet.
- [ ] Eine Funktion `flushSearch()`; jeder andere `sendCommand` der Tabelle ruft sie vorher (eine Hülle um
      `sendCommand`, nicht je Aufrufer), dazu `onBlur` und das Unmount-Cleanup. Gates, Commit.

### Task 10: Sichtprüfung und Abschluss

- [ ] Demo `tl-demo-react` (`-Pide,with-h2`, eigener Port; CSS-Kopf „tl-design-system (src/“ prüfen), **der
      Orchestrator prüft selbst** im Browser alle Punkte aus Spec „Erfolg“ und „Erfolg zusätzlich“ in hell und
      dunkel, normal und kompakt, plus Review-Focus 5 (Fenster 600 px). Jeder Formbruch gegen Spec und Mockup ist
      ein Befund, nicht nur ein Funktionsfehler.
- [ ] `docs/ui-durchgang.md` (Paket-Repo): U27, U42 auf ✅; `docs/skalen.md` Abschnitt „UI-Durchgang 2“;
      `STATUS.md`.
- [ ] Alle Gates: Paket, Java `control.table` + `TestOptionChecks` + `TestFilterEditors`, Vitest beide Module,
      `check-messages-en.sh`. **Nicht pushen** — Bericht.
