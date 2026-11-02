# UI-Durchgang 2: Filter und Spaltenwahl am Ort

**Datum:** 2026-11-02 · **Ticket:** #30102 (angenommen, CC bhu) · **Befunde:** U27, U42 (`docs/ui-durchgang.md`) ·
**Mockup:** `.superpowers/brainstorm/25838-1793614286/content/u27-filter-popover.html` (bedienbar, von Hendrik am
02.11. durchgeklickt) · **Baut auf:** UI-Durchgang 1 (#30000, !2014) und dem Umzug des Pakets ins Engine-Repo
(#30098, !2101)

## Warum

Die Tabelle ist die meistgenutzte Komponente. Wer eine Spalte filtert, bekommt heute einen modalen Dialog: Die
Seite dunkelt ab, die Häkchen wirken erst mit „Ok“, eine lange Werteliste hat keine Suche, und der Dialog steht
fern von der Spalte, die er filtert. Die Spaltenwahl ist ein zweiter modaler Dialog mit 70 % Fensterhöhe, erreicht
über das Popover „Ansicht“ aus UI-Durchgang 1, ebenfalls mit „Ok“. Im Popover „Ansicht“ reagiert bei den Schaltern
nur Kästchen und Text auf einen Klick, nicht die Zeile (U42).

## Ziel

1. Filtern geschieht am Spaltenkopf, ohne die Seite zu sperren, und wirkt, während man klickt.
2. Die Spaltenwahl ist eine Seite im Popover „Ansicht“ und wirkt sofort.
3. In Popovers und Menüs ist die ganze Zeile die Klickfläche eines Häkchens oder Schalters.

## Nicht-Ziele

- Mehrstufiges Gruppieren und Gruppen durch Ziehen (#29827, bei Bernhard).
- U26 (Seite springt beim Wählen), U30 (letzte Spalte füllt die Breite), U39/U40/U41: eigene Pakete danach.
- Neue Filterarten. Es bleiben die Filter, die `FilterEditors` heute baut, und `ColumnFilterUI` der Anwendungen.

## Entschieden (Hendrik, 02.11., am Mockup)

| # | Entscheidung |
|---|---|
| E1 | Der Trichter öffnet ein **nicht modales Popover am Spaltenkopf**. Kein Abdunkeln, kein Fokus-Gefängnis; Esc oder Klick daneben schließt, der Filter bleibt. |
| E2 | **Werteliste: angehakt = angezeigt, abgehakt = ausgeblendet** (Hendrik 02.11., nach Builder-Check). Ohne Filter sind alle Werte angehakt. Jedes Häkchen wirkt sofort. Je Wert steht seine Anzahl rechts (die `MatchCounts`, die es heute gibt); Werte ohne Treffer sind leise, aber wählbar. Oben „Alle“ (hakt alle an oder ab; alle ab zeigt keine Zeile — so wählt man danach gezielt einen Wert). |
| E3 | **Suche in der Werteliste ab 8 Werten**, filtert die Liste im Client; „Alle“ entfällt, solange gesucht wird. |
| E4 | **Text-, Zahl- und Datumsfelder** wirken nach einer Tipp-Pause oder sofort mit Enter, nicht bei jedem Tastendruck. Kein „Ok“. |
| E5 | **Filter-UI der Anwendung** (`ColumnFilterUI`) steht im selben Popover, behält aber „Anwenden“: ihre Auswertung kann teuer sein. |
| E6 | Im Fuß des Filter-Popovers: „Filter entfernen“ (hakt alles an; ohne aktiven Filter deaktiviert). |
| E15 | **„Auswahl umkehren“** in der Werteliste: eine Aktion, kein Schalter — sie dreht alle Häkchen um, danach gilt wieder E2. (Hendrik wollte einen Schalter „umkehren“; ein Schalter mit Zustand hieße „angehakt = ausgeblendet“, solange er an ist, und bräche E2. Vorschlag des Orchestrators, Hendrik kann widersprechen.) |
| E7 | **Spaltenwahl = zweite Seite von „Ansicht“** („Spalten · n von m ›“), mit Zurück-Pfeil. Kein Dialog mehr. Alles wirkt sofort auf die Tabelle. |
| E16 | **Ein „Zurücksetzen“**, auf der ersten Seite von „Ansicht“ wie heute (`resetView`); die Spaltenseite hat keins (Hendrik 02.11.). |
| E8 | Klick auf die **Zeile** blendet ein und aus; das Auge zeigt den Zustand. Die **letzte sichtbare Spalte** lässt sich nicht ausblenden (gesperrt, Tooltip „Mindestens eine Spalte bleibt sichtbar“ — wie heute). |
| E9 | **Griff zieht** und ordnet; Tastatur: Griff fokussieren, Alt+↑/↓. Während des Ziehens bleibt das gezogene Element dasselbe (die Liste wird erst nach dem Loslassen neu aufgebaut). Gezogen wird nur innerhalb eines Blocks. |
| E10 | **Nadel fixiert.** Fixierte Spalten bilden einen Block vorn (so fixiert die Tabelle heute: bis zur letzten markierten, `frozenPrefixOf`). Fixieren hängt ans Ende des Blocks, Lösen an den Anfang der übrigen. Sichtbar dauerhaft, wenn fixiert, sonst beim Zeigen. **Ausgeblendete Spalten lassen sich mit einem Klick einblenden und fixieren** (heute schon: `js.table.columnShowLock`). |
| E11 | **Gruppieren bleibt in der Spaltenwahl** (#29967): beim Zeigen sichtbar, dauerhaft, solange es gilt; auch nach ausgeblendeten Spalten. |
| E12 | Die Spaltenseite hat **einen Rollbereich** für angezeigte und ausgeblendete Spalten; die Suche steht fest darüber. Der Abschnitt „Ausgeblendet“ entfällt, wenn keine Spalte ausgeblendet ist. |
| E13 | Jedes Popover **bleibt im Fenster**: es wächst mit dem Inhalt bis an den Fensterrand, dann rollt sein Rollbereich; reicht der Platz unten nicht, steht es oben (flip) oder rückt ein (shift). |
| E14 | **U42:** In Popovers und Menüs ist die ganze Zeile die Klickfläche eines Häkchens oder Schalters, mit Hover wie ein Menüeintrag. Gilt für die Werteliste, die Spaltenwahl und die Schalter in „Ansicht“. |

## Bestand, auf dem aufgebaut wird

- **Filter:** `TableViewControl.handleOpenFilter` (Zeile ~1566) baut den Dialog: `FilterEditors.create(...)` liefert
  `FilterField`s, `ReactFormBuilder` legt je Feld ein Control an (`fieldControl`: Select, Checkbox, Text), „Ok“ ruft
  `_view.filter(column, readState.get())` und `rebuildAfterRowChange()`. `OptionsFilterEditor` macht je Wert ein
  Häkchen-Feld und schreibt die Anzahl in die Beschriftung (`OPTION_LABEL__NAME_COUNT`).
- **Spaltenwahl:** `ReactColumnSelectControl` (Server) und `TLColumnSelect.tsx` (Client, Ebenen-Panel seit #29825)
  können schon alles aus E8–E11 außer „sofort“: Kommandos `columnVisible`, `columnLock`, `columnReorder`, `group`
  bearbeiten eine Arbeitskopie, `handleOpenColumnSelect` übernimmt sie mit „Ok“ über `applyColumns`. Suche,
  gesperrte letzte Spalte und „einblenden und fixieren“ sind vorhanden.
- **„Ansicht“:** `TableViewOptions.tsx` (Client), `onColumns` schickt heute `openColumnSelect`.
- **Positionierung:** `bridge/popover.ts` (`usePopover`, floating-ui mit `offset`, `flip`, `shift`); eine
  Höhenbegrenzung (`size`) fehlt.
- **Speichern:** `DefaultTableView.filter` und die Spaltenänderungen rufen `persist()` → `PersonalConfigViewStateStore`
  → `PersonalConfiguration.setJSONValue` (im Speicher). Sofort anwenden schreibt je Klick dorthin; das kostet nichts
  Neues (geprüft 02.11.).
- **Last:** `_view.filter` filtert serverseitig alle Zeilen wie heute bei „Ok“; zum Client gehen höchstens
  `MAX_VIEWPORT_ROWS` (200) Zeilen.

## Was gebaut wird

### 1. Filter-Popover am Spaltenkopf

- Der Server baut den Inhalt wie heute (gleiche `FilterEditor`-Pipeline), zeigt ihn aber in einer **nicht modalen
  Fläche, verankert am Trichter** der Spalte statt über den `DialogManager`. Der Mechanismus ist dem Bauenden
  überlassen, mit diesen Bedingungen: dieselbe Positionierung wie alle Popovers (`usePopover`, E13); eine Fläche je
  Tabelle zur Zeit; schließt bei Esc, Klick daneben, Rollen der Tabelle weg vom Anker ist erlaubt; Fokus geht beim
  Öffnen in die Suche bzw. das erste Feld und beim Schließen zurück zum Trichter. Vorzug: `ReactPopoverControl`
  um einen Anker erweitern, den nicht das Popover selbst zeichnet, statt einer zweiten Popover-Art (Konsolidieren
  statt neu bauen).
- **Werteliste** (`OptionsFilterEditor`): eine eigene Listen-Darstellung statt N Formularfelder — Zustand je Wert
  Name, Anzahl, angehakt; Kommandos „Wert umschalten“, „alle“, „keiner“, „umkehren“.
- **Abbildung auf das bestehende Filtermodell, ohne neues Speicherformat:** Häkchen nach E2 werden als
  „alle außer den abgehakten“ gespeichert — `NegatedFilterState(OptionsFilterState(abgehakt))`, die Form, die die
  Umkehrung heute schon speichert. Alle angehakt = kein Filter (`null`). Alle abgehakt = keine Zeile (die Form
  „nur diese“ mit leerer Menge ist heute „kein Filter“ und taugt dafür nicht — der Bauende wählt eine eindeutige
  Darstellung und belegt sie mit Test). Ein später neuer Wert ist damit sichtbar. Vorhandene gespeicherte Filter
  der Form „nur diese“ (`OptionsFilterState(S)`) werden als „S angehakt, Rest abgehakt“ angezeigt; sobald man
  ändert, wird in der neuen Form gespeichert. Keine Migration.
- Der heutige Umkehren-Schalter des `InvertingFilterEditor` entfällt für die Werteliste (E15); für andere
  umkehrbare Filter bleibt er. Jede Änderung ruft `_view.filter` und
  `rebuildAfterRowChange()`. Die Anzahl steht als eigenes Feld (nicht mehr in der Beschriftung). Suche ab 8 Werten
  im Client (E3).
- **Felder** (Text, Zahl, Datum, Auswahl, Checkbox anderer Editoren): Änderung wirkt nach Tipp-Pause bzw. sofort
  bei Auswahl/Checkbox; Enter wirkt sofort (E4). Pause: Vorschlag 400 ms, als Konstante benannt.
- **`ColumnFilterUI`:** Inhalt wie heute, Fuß mit „Anwenden“ (E5).
- Der Dialog `handleOpenFilter` und seine Knöpfe entfallen; `I18NConstants` neu/entfallend über JavaDoc,
  `messages_en` nie von Hand.

### 2. Spaltenwahl als Seite von „Ansicht“

- `TableViewOptions` bekommt eine zweite Seite. Ihr Inhalt ist die bestehende Spaltenwahl (`TLColumnSelect` mit
  `ReactColumnSelectControl`), nicht ein Nachbau. Der Server hält sie als Kind der Tabelle, solange „Ansicht“ offen
  ist.
- **Sofort:** jedes Kommando der Spaltenwahl wirkt auf die Tabelle (`applyColumns` bzw. die Einzelschritte), keine
  Arbeitskopie mehr. „Zurücksetzen“ wie heute (`resetToDefaults`).
- E8–E12 im Client; Ziehen nach E9. Ein Rollbereich, Suche fest darüber (E12). Kein „Zurücksetzen“ auf der
  Spaltenseite (E16).
- Der Dialog `handleOpenColumnSelect` entfällt, mit ihm `CMD_OPEN_COLUMN_SELECT`, falls nichts anderes ihn ruft
  (prüfen, nicht annehmen).

### 3. Zeile als Klickfläche (U42)

- Schalter und Häkchen in „Ansicht“, Werteliste und Spaltenwahl: die Zeile trägt Klick und Hover. Im Paket eine
  Regel für die Zeile (z. B. `tl-menu__item` mit Häkchen bzw. Schalter), nicht `tl-choice` mit `inline-flex`.

### 4. Paket

- Popover-Inhalte (Werteliste, Spaltenseite, Fuß, Seitenwechsel) als Paketblöcke mit Vertrag; Klassen-Gate grün.
- Höhenbegrenzung: `usePopover` liefert den verfügbaren Platz (floating-ui `size`) als Höchsthöhe des Rollbereichs.

## Verträge und andere Darstellungen

- `state.proto`-Änderungen (Werteliste, verankertes Popover, Spaltenseite) gelten auch für die MUI-Adapter: sie
  folgen dem Vertrag, nicht unseren CSS-Konventionen. Ein Adapter, der den Dialog heute ersetzt, muss nachziehen —
  vor dem Bau `git grep` nach `openFilter`, `openColumnSelect`, `ColumnSelect` in `layout.react.mui`.
- Tastatur: Popover-Inhalt per Tab erreichbar; Pfeiltasten in der Werteliste wie in einer Liste; Esc schließt.
  ARIA: Popover `role="dialog"` ohne `aria-modal`, Werteliste `listbox` mit `aria-multiselectable` oder Gruppe
  von `checkbox` — der Bauende wählt und begründet.

## Erfolg

- Demo `tl-demo-react`, Tickets-Tabelle: Status filtern ohne „Ok“, Fußzeile und Trichter folgen jedem Häkchen; bei
  einer Spalte mit mehr als 8 Werten erscheint die Suche.
- Titel filtern: wirkt nach der Pause und mit Enter.
- Ein Wert, der nach dem Abhaken eines anderen neu in die Daten kommt, ist sichtbar.
- Ein vor dem Umbau gespeicherter Filter „nur Offen“ zeigt „Offen“ angehakt, alle anderen abgehakt.
- Eine Ansicht mit `ColumnFilterUI` zeigt „Anwenden“.
- Spalten: ein-/ausblenden per Zeile, ziehen, Alt+↑/↓, fixieren auch aus „Ausgeblendet“, gruppieren — alles ohne
  Dialog, alles sofort in der Tabelle; letzte Spalte bleibt.
- In „Ansicht“ schaltet ein Klick irgendwo in der Zeile.
- Popover in einem 600 px hohen Fenster: bleibt im Fenster.
- Gates: Paket, Java (`control/table`), Vitest `layout.react` und `layout.react.mui`, `check-messages-en`.

## Offen

- **Was eine Werteliste mit „alle abgehakt“ speichert:** siehe Abschnitt 1, Entscheidung beim Bau mit Test.
- **Reihenfolge zu !2014 und !2101:** gebaut wird auf dem Stand nach beiden Merges (Paket im Modul
  `tl-design-system`). Bis dahin nur Spec und Plan.
- Wer den Trichter fokussiert, wenn die Tabelle während eines offenen Popovers neu zeichnet (Zeilen ändern sich
  durch den eigenen Filter): Anker bleibt der Kopf der Spalte, nicht eine Zeile — im Plan prüfen.
