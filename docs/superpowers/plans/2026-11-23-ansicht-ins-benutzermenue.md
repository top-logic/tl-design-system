# Plan: Tabellenansicht ins Benutzermenü (#30233, !2230)

**Anlass:** bhu-Review auf !2230 (18.11.): „Die Option wirkt auf alle Tabellen gleichzeitig. Das stellt man bestenfalls
einmal um – irgendwo in den persönlichen Einstellungen? – das will man nicht in jeder Tabelle immer und überall sehen.“
Hendrik 23.11.: **Dichte, Zebra und Spaltenlinien ins Benutzermenü.** Die Seite „Ansicht“ im Popover der Tabelle
fällt weg.

**Ziel:** Das Popover am Zahnrad der Tabelle ist nur noch die Spaltenliste mit „Spalten zurücksetzen“ im Fuß. Die
Dichte stellt die globale Gruppe „Dichte“ des Benutzermenüs ein (gibt es seit 5d); die Tabelle hat keine eigene
Dichte mehr. Zebra und Spaltenlinien sind zwei Schalter in einer neuen Gruppe „Tabellen“ des Benutzermenüs,
gespeichert je Person wie bisher (`TableViewPreferences`), wirksam an jeder Tabelle der Seite ohne Neuladen.

**Ort:** Engine-Worktree `_Working-Tree/tl8-wt-30102`, Branch `CWS/CWS_30233_ui_pass_2_view_per_person` (Stand
`626024d9c3` = origin). Danach Merge nach `CWS/CWS_30232_ui_pass_2_filter_popover` (Abschnitt 6). Commits
englisch, Präfix `Ticket #30233:` (auf 30232 der Merge mit `Ticket #30232:`). **Nicht pushen.**

## Entscheidungen (fest, nicht neu verhandeln)

1. **Keine Dichte an der Tabelle.** `KEY_DENSITY`, `ATTR_DENSITY` (`data-tl-table-density`), `TableDensity`, das
   Feld `density` im Store, `data-tl-density` an `tl-table` aus `TLTableView` — alles entfernt. Die Tabelle erbt die
   Dichte von `<html data-tl-density>`; `token-px.ts` beobachtet die Wurzel schon (`TOKEN_SWITCHES`), die
   Zeilenhöhe folgt also dem Umschalten im Benutzermenü. Der Mechanismus „Element nennt eigene Dichte“
   (`DENSITY_SWITCH` in `token-px.ts`, Paket-CSS für `[data-tl-density]` unterhalb der Wurzel) **bleibt** — ihn
   nutzen auch Views.
2. **Schalter im Menü sind echte Schalter:** `role="menuitemcheckbox"`, `aria-checked`, Klasse
   `tl-menu__item--check`, rechts die Zeichnung `<span class="tl-checkbox tl-checkbox--switch" aria-hidden="true">`
   — genau die Form, die die Seite „Ansicht“ heute zeichnet (`TableViewOptions.tsx` um Zeile 185–205). Kein
   `aria-current`, keine fette Schrift für einen Schalter. Paket-CSS für `tl-menu__item--check` und
   `tl-checkbox--switch` gibt es schon; prüfen, dass sie im Kontext `.tl-menu` (Benutzermenü, nicht nur
   `.tl-table-view-options`) greifen, sonst den Selektor im Paket auf `.tl-menu` verallgemeinern.
3. **Protokoll:** `MenuState.Entry` in `com.top_logic.layout.react/src/main/java/com/top_logic/layout/react/state/state.proto`
   bekommt `bool toggle;` mit JavaDoc: „Whether the item switches a setting on and off: shown as a switch whose
   {@link #active} tells whether the setting is on. Absent: an ordinary item, {@link #active} marking the choice in
   force.“ Java-/TS-Klassen werden aus dem Proto erzeugt — wie im Modul üblich neu erzeugen, nicht von Hand. Der
   MUI-Adapter bleibt unberührt (optionales Feld, Vertrag).
4. **Server-Modell:** `CommandModel` bekommt `default boolean isToggle() { return false; }` (JavaDoc: ein Befehl,
   der eine Einstellung an- und ausschaltet; `isActive()` sagt dann, ob sie an ist). `SimpleCommandModel` bekommt
   einen Setter `setToggle(boolean)` im Stil von `setActive`. `ReactMenuControl.MenuEntry` trägt `toggle`, die
   Serialisierung schreibt `TOGGLE__PROP` nur, wenn wahr (wie `ACTIVE__PROP`, Zeile ~89). Die Stelle, die Befehle
   zu Einträgen macht (`ContextMenuOpener.java:285`, `cmd.isActive()`), reicht `cmd.isToggle()` durch. Weitere
   Aufrufer der `item(...)`-Fabriken von `MenuEntry` per `grep` finden und mitziehen (Überladung mit Default
   `false` statt jeden Aufrufer zu ändern, wenn das kürzer ist).
5. **Client-Menü:** `MenuItem` in `react-src/bridge/menu.tsx` bekommt `checked?: boolean`. Ist es gesetzt:
   Rolle `menuitemcheckbox`, `aria-checked={checked}`, Klasse `tl-menu__item--check`, Typo `tl-type-body`, kein
   `aria-current`, nach dem Label die Schalter-Zeichnung. `TLMenu.tsx` übergibt
   `checked={item.toggle ? item.active === true : undefined}` und `current` nur, wenn nicht `toggle`. Die
   Pfeilnavigation des Menüs kennt `menuitemcheckbox` schon (`ITEM`, Zeile 12).
6. **Neue Befehlsquelle `TableViewCommands`** in `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/command/`,
   Tag `<table-view-commands/>`, gebaut wie `DensityCommands` (gleicher Aufbau, `@InApp`, Config, Label-Default aus
   `I18NConstants`). Gruppe „Tables“/„Tabellen“, zwei Befehle mit `setToggle(true)`:
   - „Striped rows“ / „Zebrastreifen“, aktiv = `TableViewPreferences.striped()`
   - „Column lines“ / „Spaltenlinien“, aktiv = `TableViewPreferences.columnLines()`

   Ausführen: Wert umkehren, speichern, und per `JSSnipplet` über `context.getSSEQueue()` (wie
   `SetDensityCommand.applyDensity`) im Browser am Element `[data-tl-table-view]` das Attribut setzen oder
   entfernen (`data-tl-table-striped` bzw. `data-tl-table-column-lines`; Namen aus den Konstanten von
   `TableViewPreferences`, Strings mit `TagUtil.writeJsString`). Ohne Element tut das Skript nichts.
   Eintragen in `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/user-menu.view.xml` nach
   `<density-commands/>`; den Kommentar darüber nachziehen (Gruppe „Tabellen“, zwei Schalter).
7. **`TableViewPreferences` (Java):** ohne Dichte; `store(density, striped, columnLines)` ersetzt durch
   `setStriped(boolean)` und `setColumnLines(boolean)` (gleiche Schutzlogik: ohne `TLContext` oder
   `PersonalConfiguration` nichts tun; danach `storePersonalConfiguration()`). `writeAttributes` schreibt Marke,
   Zebra, Linien. JavaDoc nachziehen (Klassentext nennt das Benutzermenü als Ort der Einstellung).
8. **Store (TS) `bridge/table-view-preferences.ts`:** ohne Dichte. `subscribe` hängt beim ersten Zuhörer einen
   `MutationObserver` an das markierte Element (`attributeFilter` auf die zwei Attribute), liest bei Änderung neu
   (`current = readDom()`) und benachrichtigt; beim letzten Abmelden trennen. `setTableViewPreferences` entfällt
   (kein Schreiber mehr auf dem Client), `resetTableViewPreferencesForTest` bleibt. Exporte in `bridge-entry.ts`
   nachziehen (`TableDensity` weg).
9. **Popover `controls/table/TableViewOptions.tsx`:** die Komponente `TableViewOptions` (Seite „Ansicht“), der Typ
   `ViewPage`, `viewShown`, `backRef`, die Zeile „Ansicht ›“ im Fuß und alle Seitenwechsel-Logik entfallen;
   `TableViewValues`, `onChange` und die Werte-Props von `TableViewButton` ebenso. Das Zahnrad erscheint, wenn
   `columnSelect || canReset`; das Popover zeigt die Spaltenauswahl, wenn `columnSelect`, und im Fuß
   „Spalten zurücksetzen“, wenn `canReset`. Beschriftung des Zahnrads und des Popovers immer „Spalten“
   (`js.table.columns`). Der Fokus wartet bis zur Ankunft der Auswahl auf dem Knopf „Spalten zurücksetzen“
   (ersetzt die Zeile „Ansicht“ als `footRef`); ohne Reset-Knopf auf dem Popover selbst (`initialFocus` anpassen).
   `layoutKey` nur noch aus der Auswahl-ID. Nicht mehr gebrauchte I18N-Schlüssel (`js.table.view*`) entfernen.
   Wenn die Datei danach nur noch `TableViewButton` trägt, den Dateinamen lassen (kein Umbenennen in diesem Paket).
10. **`TLTableView.tsx`:** liest nur noch `striped`/`columnLines` aus `useTableViewPreferences()`; kein
    `data-tl-density` an der Tabelle, kein `densityKey={viewDensity}` (prüfen, was `densityKey` speist; ist es nur
    für die Tabellendichte da, entfällt es, sonst auf den Wurzelwert umstellen und das melden); kein
    `handleViewOptions` / `setViewOptions`-Befehl.
11. **Server-Tabelle:** Befehl `setViewOptions` in `TableViewControl` und `SetViewOptionsArguments` entfernen;
    I18N-Konstanten, die nur dafür da waren, entfernen. `canReset` (`state.viewOptions`) bleibt, falls es den Reset
    steuert — Namen nicht anfassen.
12. **Paket `tl-design-system`:** `table.contract.md` (Popover: eine Seite; Zebra/Linien/Dichte kommen aus dem
    Benutzermenü, die Attribute an `tl-table` bleiben), `table.spec.html` (Seite „Ansicht“ raus, falls gezeigt),
    `table.css` (Regeln nur für die Seite „Ansicht“ — Kopf mit Rückweg, Seitenwechsel — entfernen; `size-popover-view`
    bleibt als Breite des Popovers), Menü-Vertrag (`menu.contract.md` o. ä.): Eintrag als Schalter
    (`tl-menu__item--check`), Specimen des Menüs mit einem Schalter-Eintrag. Tests `test/tabellenmenues.test.mjs`,
    `test/table.test.mjs` und die DOM-Gates an den neuen Stand anpassen; Prüfungen, die die Seite „Ansicht“
    festschrieben, werden zu Prüfungen, dass es sie nicht mehr gibt, bzw. auf das Menü umgezogen.
13. **Doku in der Engine:** `com.top_logic.layout.view/.../tl-docs/view-layer/tables.md` (oder wo die Tabellenansicht
    beschrieben ist) nachziehen.

## Reihenfolge und Fertig-Bedingungen

1. **Menü-Schalter** (Entscheidungen 3–5): Proto, `CommandModel`, `SimpleCommandModel`, `ReactMenuControl`,
   `ContextMenuOpener`, `menu.tsx`, `TLMenu.tsx`, Paket-Menü-Vertrag/Specimen. Tests: Java-Test, dass ein
   Toggle-Befehl `toggle` und `active` serialisiert und ein normaler Befehl kein `toggle`; Vitest, dass `MenuItem`
   mit `checked` Rolle, `aria-checked`, Klasse und Schalter zeigt und ohne `checked` unverändert bleibt.
   *Fertig:* die Tests grün, Commit.
2. **`TableViewCommands` + `TableViewPreferences` ohne Dichte** (6, 7, 11 Server): Java-Test für
   `TableViewCommands` (zwei Befehle, Toggle, aktiv folgt dem gespeicherten Wert, Ausführen kehrt um und speichert;
   Skript setzt/entfernt das richtige Attribut), `TestTableViewPreferences` und `TestTableViewOptions` nachziehen.
   `tools/check-messages-en.sh` (Projektrepo, `TL_WORKTREE` setzen) für jedes Modul mit Java-Änderung, erzeugten
   Diff committen, `messages_de.properties` von Hand nachziehen (sortiert). *Fertig:* Maven-Tests der berührten
   Module grün, Skript grün, Commit.
3. **Client** (8–10): Store mit Beobachter, Popover ohne Seite „Ansicht“, `TLTableView`. Vitest
   `table-view-options.test.tsx`, `table-view-attributes.test.tsx`, `bridge/table-view-preferences.test.tsx`
   (Beobachter: Attribut am markierten Element ändern → Hook liefert neuen Wert) und alle anderen, die die
   entfernten Props/Exporte nutzen (`wire-test-support.tsx` und die Adapter-Tests aus dem Diff von !2230).
   *Fertig:* Vitest `layout.react` und `layout.react.mui` grün, `tsc` ohne neue Fehler, Commit.
4. **Paket** (12, 13): *Fertig:* `npm test` und `npm run test:dom` im Modul `tl-design-system` grün,
   `node tools/lint-css.mjs` grün, Commit.
5. **Gesamtlauf:** `mvn clean install` der berührten Module (JDK 21) mit Tests, Ergebnis berichten.

## Bekannte Fallen

- zsh: `git show "${B}:pfad"` mit Klammern schreiben — `$B:c…` frisst zsh als Modifier.
- `messages_en.properties` nie von Hand; nach JavaDoc-Änderung das Skript laufen lassen.
- Lokale Builds immer `mvn clean install`; JDK 21 setzen.
- Klassen-Gate: kein Literal im CSS, kein `:focus` ohne `-visible`, nur Tokens.
- Untracked Dateien im Worktree (`PowerpointExportHandler…ppt`, `dynamicMessages_de.properties`) nicht committen.

## 6. Stapel nachziehen (eigener Auftrag nach Abschluss von 1–5)

`CWS/CWS_30233_ui_pass_2_view_per_person` nach `CWS/CWS_30232_ui_pass_2_filter_popover` mergen. Konflikte zugunsten
des neuen Stands (keine Seite „Ansicht“, keine Tabellendichte) lösen; was 30232 zusätzlich baut (Filter-Popover),
bleibt. Danach im 30232-Stand alle Gates aus 3–5 noch einmal. *Fertig:* grün, Merge-Commit `Ticket #30232: Merge
CWS_30233_ui_pass_2_view_per_person into CWS_30232_ui_pass_2_filter_popover.`

## Nicht in diesem Plan

- Sichtprüfung an der lokalen Demo und Docs in diesem Repo (`skalen.md`, `ui-durchgang.md`, `STATUS.md`) — macht
  der Orchestrator.
- PR-Text !2230 und Trac #30233 nachziehen — Orchestrator, nach Hendriks Freigabe zum Push.

## Korrekturen aus dem Plan-Review (Fable, 23.11.) — gehen den Abschnitten oben vor

Kürzel: `R` = `com.top_logic.layout.react`, `V` = `com.top_logic.layout.view`, `M` = `com.top_logic.layout.react.mui`,
`DS` = `tl-design-system`.

1. **Store (8):** beim letzten Abmelden `disconnect()` **und** `current = null`, sonst liest die nächste Tabelle einen
   veralteten Cache. Vitest-Fall: abmelden, Attribut ändern, neu mounten → neuer Wert. Observer-Tests mit
   `await waitFor` (Muster `M/react-src/adapters/fundament.test.tsx:508-520`).
2. **`MenuEntry` ist ein Record:** außer den `item(...)`-Fabriken auch jeden `new MenuEntry(` mitziehen —
   `R/.../control/overlay/ReactMenuControl.java:240,247,256` und `R/src/test/java/test/com/top_logic/layout/react/state/TestControlStateSchema.java:647`;
   `testMenuKeys` (:607) um einen Toggle-Eintrag erweitern.
3. **An `tl-table` bleiben nur `data-tl-striped` und `data-tl-column-lines`.** `data-tl-density` an der Tabelle
   verschwindet auch aus dem Vertrag: `table.contract.md:273` streichen, Kopfkommentar `table.css:9-10` nachziehen,
   `DS/test/table.test.mjs:295` im selben Commit ändern. Paket-Tests, die die zwei Seiten bzw. die Dichte-Segmente
   festschreiben: `DS/test/tabellenmenues.test.mjs:69, 141-160, 209-243, 249-280, 286-300`,
   `DS/test/tabellenmenues-dom.test.mjs:96-108`.
4. **I18N:** die `js.table.view*`-Konstanten sind Java (`R/.../I18NConstants.java:939-981`, `@CustomKey`) — in
   Schritt 2 zusammen mit `SetViewOptionsArguments` löschen und `check-messages-en.sh` danach laufen lassen;
   nach Schritt 3 das Skript noch einmal. In Abschnitt 6 Konflikte in `I18NConstants.java`/`messages_*.properties`
   durch Neuerzeugen lösen, nicht von Hand.
5. **Fokus (9, Entscheidung Orchestrator):** der Fokus wartet **immer auf dem Popover selbst**, nie auf
   „Spalten zurücksetzen“ (`table.contract.md:189` bleibt gültig). Die Auswahl nimmt ihn bei Ankunft in ihre Suche,
   wenn sie eine hat.
6. **Ohne Zahnrad kein Streifen:** `buttonReserve = 0` und kein `viewButton`, wenn `!columnSelect && !canReset`
   (`R/react-src/controls/TLTableView.tsx:1841, 1850-1857, 2159, 2210, 2282, 2342, 2375, 2449, 2500`). Der
   `<hr class="tl-divider">` im Popover nur bei `canReset`.
7. **`densityKey`** bleibt, gespeist aus `String(rowHeight)` (`TLTableView.tsx:479`) — `FilterPresets.tsx:99,167-171`
   braucht ihn für die Chip-Breiten.
8. **MUI (Entscheidung Orchestrator): mitziehen.** `M/react-src/adapters/MuiMenuAdapter.tsx:212-219`: bei `toggle`
   `role="menuitemcheckbox"`, `aria-checked`, kein `selected`/`aria-current`; Feldliste im Kommentar (:117-119)
   ergänzen; Fall in `MuiMenuAdapter.test.tsx`.
9. **tl-chat-classic:** `ReactViewComponent.java:167-170` — nur den Kommentar „the table density acts at the table
   root instead“ nachziehen (die Dichte bleibt dort fest `normal`). Keine weitere Änderung.
10. **Altlast abschneiden (Entscheidung Orchestrator):** was nach dem Umbau niemand mehr nutzt, fliegt raus:
    `tl-menu__item--nav`, `tl-menu__value`, `tl-menu__chevron` (`DS/src/components/menu/menu.css:85-95`,
    `DS/tools/lint-css.mjs:204`, Vertrag `menu.contract.md:77`, Tests), `ICON_VIEW_SETTINGS`
    (`R/react-src/bridge/icons.ts:75`) und der dritte Parameter von `useRovingMenu` samt Test
    (`popup-surface.test.tsx:529`). Vorher per `git grep` bestätigen, dass es keinen anderen Nutzer gibt; gibt es
    einen, bleibt es und wird gemeldet. Kommentare `token-px.ts:53,61` („a table carries its own“) nachziehen.
11. **Proto erzeugen:** `mvn -pl com.top_logic.layout.react generate-sources` (JDK 21). Eingecheckt erzeugt:
    `R/.../state/MenuState.java`, `R/.../state/impl/MenuState_Impl.java`, `R/react-src/state/control-state.ts` — mit
    dem Proto committen. Diffs in anderen erzeugten Dateien (`sse.proto`, `answer.proto`) melden, nicht committen.
12. **Tests zusätzlich:** `M/react-src/table-view-options.test.tsx` (großteils neu), `M/react-src/table-view-attributes.test.tsx:66-156, 332-355`,
    `R/react-src/bridge/table-view-preferences.test.tsx:82-92`, `R/react-src/bridge/menu.test.tsx` (neu: `checked`),
    `R/src/test/.../control/table/TestTableViewOptions.java:176-242, 322-326`, `TestTableViewPreferences.java:28-105`,
    `V/src/test/.../command/TestContextMenuOpener.java` (Toggle durchgereicht). `tsc` nur in `R`
    (`npm run typecheck`).
13. Pfade: `R/.../control/button/CommandModel.java`, `R/.../control/overlay/ContextMenuOpener.java`.
    `handleViewOptions` heißt `handleViewChange` (`TLTableView.tsx:1660`); JavaDoc von `CMD_RESET_VIEW`
    (`TableViewControl.java:646-648`) ohne „and the view options“.
14. Menü-Specimen und -Vertrag haben den Schalter-Eintrag schon (`menu.spec.html:58-59`, `menu.contract.md:76`): nur
    den Wortlaut „Schalter der Ansicht“ verallgemeinern.
15. `TableViewCommands`: statische `clientCode(String attribute, boolean on)` wie `SetDensityCommand.clientCode`, im Test
    geprüft; Personenkontext im Test wie `inContext` in `TestTableViewOptions`.
