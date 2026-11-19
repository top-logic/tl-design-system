# Ansicht-Popover: Spalten zuerst, Seiten getauscht (#30234, !2228)

Anlass: Review von Bernhard an !2226 (18.11.): „Ich glaube nicht, dass das wichtigste, was man an einer Tabelle
einstellen will, ob diese eine Tabelle Zebrastreifen hat oder nicht.“ Hendrik 19.11.: Spaltenwahl direkt hinter dem
Zahnrad, Popover bleibt, Seiten getauscht. !2226 und !2227 haben nur eine Seite: dort steht „Spalten …“ zuerst
(ac7b59ca68). Ab !2228 gibt es zwei Seiten, und dort werden sie getauscht.

Basis: lokaler Branch `CWS/CWS_30234_ui_pass_2_column_selection` nach dem Merge von `30102_menus` (Worktree
`_Working-Tree/tl8-wt-30102`). Betroffen: `com.top_logic.layout.react/react-src/controls/table/TableViewOptions.tsx`
(`TableViewOptions`, `TableViewButton`), sein Test `com.top_logic.layout.react.mui/react-src/table-view-options.test.tsx`
(und weitere Tests, die das Popover öffnen: `grep -rl "js.table.view\|TableViewButton" react-src`),
`tl-design-system/src/components/table/table.contract.md` (Abschnitt „Ansicht“), `table.spec.html` (Specimen des
Popovers), gegebenenfalls `table.css` (Kopf mit Rückweg) und die Paket-Tests, die den Vertrag lesen.

## Soll

| | heute (30234) | neu |
|---|---|---|
| Zahnrad mit `columnSelect` | öffnet Seite „Ansicht“ (Menü) | öffnet Seite „Spalten“: Titel „Spalten“ **ohne** Rückweg, darunter die Spaltenwahl (Kindcontrol des Servers), am Fuß eine Navigationszeile „Ansicht ›“ (`tl-menu__item tl-menu__item--nav`, Chevron am Zeilenende wie heute „Spalten n von m ›“, ohne Wert) |
| Zahnrad ohne `columnSelect` | Seite „Ansicht“ | unverändert: nur Seite „Ansicht“, ohne Rückweg, ohne Navigationszeile |
| Seite „Ansicht“ hinter „Ansicht ›“ | – | Kopf mit Rückweg (der heutige Kopf der Spaltenseite: `tl-table-view-options__back`, `ICON_PREVIOUS`, Beschriftung `js.table.viewBack`) und Titel „Ansicht“; darunter das heutige Menü ohne die Zeile „Spalten n von m ›“: Dichte, Streifen, Spaltenlinien, Zurücksetzen |
| Zeile „Spalten n von m ›“ | auf Seite „Ansicht“ | entfällt (die Spalten sind die erste Seite); `columnsShown`/`columnsTotal` und `js.table.viewColumnsCount` fallen weg, wenn sie sonst niemand liest — sonst stehen lassen und melden |
| Beschriftung des Zahnrads | „Ansicht“ | mit `columnSelect` „Spalten“ (`js.table.columns`), sonst „Ansicht“; `aria-haspopup="dialog"` bleibt |
| `aria-label` des Popovers | Name der gezeigten Seite | unverändert: Name der gezeigten Seite |

## Lebenszyklus der Spaltenwahl auf dem Server

Heute: `onColumns()` beim Wechsel auf Seite 2, `onColumnsClose()` beim Verlassen (Rückweg, Escape, Klick außen,
Unmount), dazu `released`/`pending`/`arrived`, damit eine schnelle Folge Eintrag–Rückweg–Eintrag nicht die alte
Auswahl zeigt.

Neu: Die Spaltenwahl lebt, solange das Popover offen ist. `onColumns()` beim Öffnen (mit `columnSelect`),
`onColumnsClose()` beim Schließen und beim Unmount des offenen Popovers. Der Wechsel auf „Ansicht“ und zurück gibt sie
**nicht** frei: Die Spaltenseite bleibt dabei verborgen gemountet (`hidden`), wie heute die Ansichtsseite. Die
Mechanik `released`/`pending`/`arrived` bleibt, ihr Anlass ist jetzt Öffnen–Schließen–Öffnen innerhalb eines
Roundtrips (zweiter Druck aufs Zahnrad). Gibt der Server die Auswahl selbst frei (`null`, ohne offene Anforderung),
bleibt die Spaltenseite stehen und zeigt nichts, bis eine neue kommt — es gibt keine Seite mehr, auf die man
„zurückfallen“ könnte; das Schließen entscheidet die Person.

## Fokus

- Öffnen mit `columnSelect`: Die Auswahl kommt erst nach einem Roundtrip. Bis dahin liegt der Fokus auf der
  Navigationszeile „Ansicht ›“ (die einzige bedienbare Stelle). Kommt die Auswahl an und liegt der Fokus noch dort
  (die Person hat ihn nicht bewegt), wandert er auf das erste fokussierbare Element der Spaltenwahl (Suchfeld, wenn
  es eins gibt, sonst die erste Zeile — `TLColumnSelect` entscheidet, was fokussierbar ist; nichts dort ändern).
  Danach nie wieder automatisch.
- „Ansicht ›“ → Seite „Ansicht“: Fokus auf den Rückweg (wie heute auf der Spaltenseite).
- Rückweg → Seite „Spalten“: Fokus auf „Ansicht ›“ (wie heute auf „Spalten …“).
- Öffnen ohne `columnSelect`: Fokus auf die geltende Dichte (heutiges `selectedSegment`).
- Escape und Klick außen schließen auf jeder Seite, Fokus zurück aufs Zahnrad (unverändert).
- Das Menü der Ansichtsseite behält seine Roving-Tastatur; „Zurücksetzen“ handelt und schließt (unverändert).

## Tests (Vitest, `table-view-options.test.tsx` und wo das Popover sonst geöffnet wird)

Bestehende Tests an das neue Soll anpassen, nicht löschen. Neu oder umgeschrieben, jeweils zuerst rot gegen den
alten Code:
1. Mit `columnSelect` zeigt das Öffnen die Seite „Spalten“ (Popover-Name „Spalten“) und sendet `openColumnSelect`
   genau einmal; die Seite „Ansicht“ ist nicht sichtbar.
2. „Ansicht ›“ zeigt die Ansichtsseite mit Rückweg, sendet **kein** Schließen der Spaltenwahl; Rückweg zeigt die
   Spalten wieder, ohne erneutes `openColumnSelect`; Fokus wie oben.
3. Schließen (Escape) von jeder der beiden Seiten sendet das Schließen der Spaltenwahl genau einmal.
4. Ohne `columnSelect`: nur die Ansichtsseite, kein Rückweg, kein „Ansicht ›“, kein `openColumnSelect`; Fokus auf der
   geltenden Dichte.
5. Startfokus: auf „Ansicht ›“ vor Ankunft der Auswahl, nach Ankunft im ersten fokussierbaren Element der
   Spaltenwahl; hat die Person den Fokus vorher bewegt, bleibt er.
6. Zahnrad heißt mit `columnSelect` „Spalten“, sonst „Ansicht“.
7. Öffnen–Schließen–Öffnen innerhalb eines Roundtrips zeigt nicht die freigegebene alte Auswahl (heutiger Test
   „Eintrag–Rückweg–Eintrag“ auf diesen Anlass umgeschrieben).

## Paket

- `table.contract.md`, Abschnitt „Ansicht“: Reihenfolge und Seiten wie im Soll; Satz „Die Spaltenwahl steht zuerst
  …“ aus ac7b59ca68 auf die Seiten übertragen. Klassen nur, wo es sie gibt; neue Klassen nur, wenn das CSS sie
  braucht, dann in `tools/lint-css.mjs` MODIFIERS eintragen.
- `table.spec.html`: Specimen zeigt zwei Popover nebeneinander: Seite „Spalten“ (mit Platzhalter-Liste und „Ansicht ›“)
  und Seite „Ansicht“ (Kopf mit Rückweg, Menü ohne Spaltenzeile).
- Kein Literal, kein neues Token; `node tools/generate.mjs && npm test && npm run test:dom` grün.

## Gates

`tl-design-system`: `node tools/generate.mjs && npm test && npm run test:dom`; `com.top_logic.layout.react`:
`npx tsc --noEmit && npx vitest run`; `com.top_logic.layout.react.mui`: `npx tsc --noEmit;
NODE_OPTIONS=--no-experimental-webstorage npx vitest run`; `tools/check-messages-en.sh` (Projekt-Repo) mit
`TL_WORKTREE=$PWD/_Working-Tree/tl8-wt-30102`, JDK 21. Neue i18n-Schlüssel nur in `I18N_KEYS` der TSX (das sind
JS-Schlüssel); wird ein Java-`I18NConstants`-Schlüssel nötig, JavaDoc schreiben und das Gate erzeugen lassen.

## Fertig, wenn

Ein Commit `Ticket #30234: …` (englisch) auf dem lokalen Branch, alle Gates grün, kein Push. Danach wird der Tausch
mit den Merges in 30235, 30233 (dort wandert „Spalten zurücksetzen“ auf die Spaltenseite — auf die jetzt erste Seite,
an ihren Fuß über „Ansicht ›“) und 30232 weitergetragen.

## Korrekturen aus dem Plan-Review (19.11., Fable) — gehen dem Text oben vor

Basis ist jetzt `ce0f87586c` (lokal, `CWS/CWS_30234_ui_pass_2_column_selection`, nach dem Merge von `30102_menus`):
Namen und Zeilen nach dem Merge neu suchen (`firstEntry` statt `selectedSegment`, Test „puts the column selection
first…“ für die Navigationszeile).

1. **Kopf der Ansichtsseite (B1, entschieden: a).** Der Kopf mit Rückweg und Titel steht **außerhalb** des
   `role="menu"`; das Menü ist ein inneres Element, benannt über `aria-labelledby` auf den Titel (nur den Text, nicht den
   Knopf). Dafür ein neues Element `tl-table-view-options__menu` (Flex-Spalte mit der Lücke der Seite), in
   `tools/lint-css.mjs` eintragen, `tabellenmenues.test.mjs:216-224` anpassen. `menu.contract.md:77` nachziehen
   (Beispiel „Spalten in Ansicht“ wird „Ansicht in Spalten“, die Zeile ist kein `menuitem`, wo die Seite kein Menü ist).
2. **Navigationszeile „Ansicht ›“** ist ein schlichter `<button class="tl-menu__item tl-menu__item--nav tl-type-body">`
   ohne Rolle (die Spaltenseite ist kein Menü; so macht es 30233 mit „Spalten zurücksetzen“). Darüber eine Trennlinie
   (`tl-divider`).
3. **Befehle (S1)** heißen `openColumns` / `closeColumns` (`TableViewControl.java`, `TLTableView.tsx`), nicht
   `openColumnSelect`. `openColumns` im Öffnen-Handler senden, nicht in einem Effekt; `closeColumns` senden, wenn
   `openColumns` gesendet wurde (Ref), nicht nach dem aktuellen `columnSelect`.
4. **„n von m“ entfällt ganz (S2, S3, entschieden: alles weg).** Client-Props `columnsShown`/`columnsTotal`, die
   Server-Schlüssel `COLUMNS_SHOWN`/`COLUMNS_TOTAL` und ihr Schreiben in `TableViewControl.java`, ihre Assertions in
   `TestColumnSelectionApply.java`, die Zeilen in `table.contract.md` (Zustandstabelle) und in
   `tabellenmenues.test.mjs:230-249`; die i18n-Konstanten `js.table.viewColumnsCount` und `js.table.viewColumns` in
   `I18NConstants.java` löschen, `messages_en` über das Gate erzeugen lassen, die `messages_de`-Zeilen von Hand löschen.
   Das Zahnrad heißt mit `columnSelect` „Spalten“ (`js.table.columns`, gibt es schon), sonst „Ansicht“.
5. **Ohne `viewOptions`, mit `columnSelect`:** keine Navigationszeile; „Zurücksetzen“ steht direkt am Fuß der
   Spaltenseite (nach einer Trennlinie), als schlichter Knopf. Es gibt keine Ansichtsseite, die nur „Zurücksetzen“ hielte.
   Mit `viewOptions`: „Zurücksetzen“ bleibt auf der Ansichtsseite (30233 verlegt es später an den Fuß der Spaltenseite).
6. **Startfokus (S4).** `initialFocus` liest das lebende DOM, nicht den Zustand `page`: „auf der Seite ohne `[hidden]`:
   das gewählte Segment, sonst das Suchfeld der Spaltenwahl, sonst der erste aktivierbare Knopf“. Vor Ankunft der
   Auswahl ist das die Navigationszeile (bzw. „Zurücksetzen“). Kommt die Auswahl an (Layout-Effekt in
   `TableViewButton`, Schlüssel die angekommene ID) und liegt der Fokus noch auf der Navigationszeile, wandert er
   **nur ins Suchfeld**, wenn es eins gibt (mehr als 10 Spalten); ohne Suchfeld bleibt er auf der Navigationszeile —
   der Ziehgriff der ersten Zeile ist `tl-reveal-on-hover` und nach einem Mausklick unsichtbar, darauf kein Fokus.
   `TLChild` nicht umhüllen (`table.css`: `__page > .tl-reorder-list__host`); die Auswahl über
   `document.getElementById(controlId)` finden. `firstFocusable` ist nicht exportiert — nicht exportieren, die drei
   Fälle direkt abfragen.
7. **Auswahl verschwindet mit Fokus darin (S5).** Wird die Auswahl entfernt, während sie den Fokus hält, geht der
   Fokus auf die Navigationszeile (bzw. „Zurücksetzen“); für die nächste ID gilt die Ankunftsregel aus 6 neu. Test 7
   bekommt die Variante öffnen – schließen vor Ankunft – öffnen (A, null, B).
8. **Specimen (S6).** Die echte Listen-Auszeichnung des heutigen Specimens bleibt (`specimen__capped`, Suche,
   `tl-reorder-list`, `__title`); die Navigationszeile kommt an den Fuß, das DOM-Gate
   `tabellenmenues-dom.test.mjs:95-114` prüft, dass sie im gedeckelten Popover sichtbar bleibt. Daneben die Ansichtsseite
   mit Kopf und Rückweg. Das dritte Specimen (Tabelle ohne Speicher, `table.spec.html` ~338-344) wird die Spaltenseite
   mit „Zurücksetzen“ am Fuß.
9. **Weitere Texte (S7, Nits).** `table.contract.md:58,59,82,83`, `reorder-list.contract.md:42`, die Kommentare
   `table.css:91-95,119-120`, `TLTableView.tsx:1488` und das JavaDoc `TableViewControl.java:400-404,1702-1729` auf die
   neue Reihenfolge bringen. Erneutes Öffnen beginnt immer auf „Spalten“.
10. **Tests (Liste aus dem Review, alle anpassen, keiner fällt weg ohne Ersatz):** `table-view-options.test.tsx` —
    Helfer `gear()`/`openView()`, `COLUMNS_ENTRY`/`COLUMNS_VALUE`, Name des Zahnrads, „opens … without sending
    anything“ kehrt sich um, die Fälle „keeps no view“, der Block „the first page as a menu“ (wird die Ansichtsseite
    hinter „Ansicht ›“), der Block 'the page "Columns"' (drei Fälle kehren sich um, zwei neu); in
    `adapters/inline-buttons.test.tsx` die Beschriftungen, „opens the column selection from the view of the gear“ und
    der Block „the gear of a table as the trigger of its view“. Für Test 6 (Ankunft mit Suchfeld) `childControl(id,
    text, true)` bzw. eine Auswahl mit mehr als 10 Spalten.
