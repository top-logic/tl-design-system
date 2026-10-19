# Welle 5c · Planen und Ziehen — Design

**Ticket:** Trac #29906 · **Branch:** `CWS/CWS_29906_design_system_welle_5c` auf `CWS/CWS_29904_design_system_welle_5b`
(gestapelt auf 5a und dem 4c-Branch von !1911) · **Grundlage:** Prognose in `docs/migration/altlast.md` „Welle 5“ (V5,
V6, V8, V12, V19, V20, V21; von Hendrik am 17.10. entschieden), dazu die Nachprüfung vor dieser Spec (V23–V30, am
19.10. entschieden: alle wie vorgeschlagen, V25 mit gefüllten Kategorie-Tokens) · **Freigegeben:** 19.10.2026 von Hendrik
(Abschnitte 1–9 einzeln abgestimmt, Builder-Prüfung in §13 eingearbeitet).

## 1 · Ziel und Abgrenzung

Kalender, Kanban, Dashboard und Werteliste lesen das Paket; ihre Blöcke fallen aus `tlReactControls.css`:

| Block (Ratsche) | Zeilen | Control |
|---|---|---|
| TLCalendar | 254 | `TLCalendar.tsx` (Leiste, Zeitraster für Tag/Arbeitswoche/Woche, Monat, Jahr mit Mini-Monaten, Anlegen) |
| TLKanbanBoard | 147 | `TLKanbanBoard.tsx` — steht nicht in `test/ratchet.json` („unlisted“), die Welle trägt ihn ein und streicht ihn |
| Dashboard | 96 | `TLDashboard.tsx` |
| TLValueList | 91 | `TLValueList.tsx` |
| Table cells holding legacy controls (until waves 4 and 5) | 43 | Zellregeln für Werteliste, Zeile mit Zusatzknopf, Befehlsspalte |

Zusammen 631 Zeilen. Alle TSX unter `com.top_logic.layout.react/react-src/controls/`. Bestand mit Zeilenangaben:
Scratchpad-Notiz `5c-inventory.md` (nur Orchestrator; die Pläne tragen die nötigen Stellen selbst).

**Hendrik, 19.10.: kein neues Bedienkonzept, wie 5b.** Die Welle zieht ins Paket, legt Gleiches zusammen und schließt
Lücken in Fokus und Ansage. Tastatur kommt nur dazu, wo V6 sie entschieden hat: Mini-Monat mit Pfeiltasten,
Kanban-Karten und Dashboard-Kacheln mit Alt+Pfeil verschieben. Dazu macht die Welle bestehende Klick-Bedienung mit der
Tastatur erreichbar (Termine wählen, Tag öffnen) — dieselbe Handlung, kein neuer Weg.

**Nicht in 5c:** Termine per Tastatur verschieben, in der Länge ändern oder anlegen (neue Bedienung →
`docs/ui-durchgang.md`); Touch drag, Drag shield, Compact field, Element-Picker (5d); eine Paketform für die
Packrechnung des Dashboards.

**Java ändert sich nur an einer Stelle:** `RowCommandColumn` (`layout.view`) setzt `tl-table__cell--command` statt
`tlRowCommandCell` (§7). Zustände und Befehle von Kalender, Kanban, Dashboard und Werteliste bleiben. Neue
i18n-Schlüssel entstehen über JavaDoc in `I18NConstants`, `messages_en` wird erzeugt, Deutsch von Hand.

**Paket und `derive`:** neu sind die gefüllten Kategorie-Rollen (§4); `derive` rechnet sie für Kundenthemes mit. Das ist
ein Rechenkern: Code-Review durch Opus (CLAUDE.md „Modelle“).

**Demo:** Kalender („calendar“), Board („board“) und Ziehen („dnd-demo“) haben Ansichten; das Dashboard steht im
Projekt-Cockpit („projects“) und in der Flow-Demo („flow-diagram“); die Werteliste an jedem mehrwertigen Attribut. Keine
neue Demo-Ansicht.

**Außerhalb des Pakets nachzuziehen:** `inline-buttons.test.tsx` (MUI, Werteliste) prüft die neuen Klassen;
`TestKanbanBoardCards`, `TestKanbanBoardDragDrop`, `TestDashboardElement`, `TestReactValueListControl` bleiben grün
(sie prüfen Zustände und Befehle, nicht Klassen — prüfen, nicht annehmen).

## 2 · Wie die Welle geliefert wird

Wie 5b: **Welle 5 kommt als ein PR** (Hendrik 17.10.), gepusht wird erst nach 5d mit Freigabe. Das Paket entsteht auf
`main` von `TopLogic/tl-design-system` und wird mit `tools/publish-to-worktree.mjs` in den Worktree kopiert
(versiegelt). Commits tragen `Ticket #29906:`; Paket deutsch, Engine englisch. Subagenten committen lokal.

## 3 · Kalender (V8, V24, V25, V26, V27, V6)

Neuer Block **`tl-calendar`** im Paket (Datei `calendar/calendar.{css,contract.md,spec.html}`); die Klassen `tlCal*`
fallen. Elementnamen legt der Plan fest, nach dem Muster `tl-calendar__toolbar`, `__title`, `__grid`, `__day-head`,
`__day`, `__event`, `__now`, `__mini` …

**Leiste (V24).** `tl-toolbar` (`role="toolbar"`, Name) mit Part `Button` für Heute, zurück, vor; der Titel
`tl-calendar__title` mit Typo-Klasse; die Ansichtswahl (Tag, Arbeitswoche, Woche, Monat, Jahr) als **`tl-segmented`**
(`role="radiogroup"`, `tl-segmented__segment` mit `aria-checked`) statt der eigenen Knöpfe `tlCalBtn--active`. Befehl
`switchGranularity` bleibt.

**Termine (V8, V25).**
- Gefüllt in ihrer Kategorie: `data-tl-role="category-N"` liest `--tl-category-N-surface` und die gerechnete Schrift
  `--tl-text-on-category-N` (§4). Die Kategorie kommt aus `categoryOf(category)` (§8) — dieselbe Zuordnung wie heute
  (Hash des Kategorienamens auf 8), nur einmal geschrieben.
- **Serverfarbe** (`color`, Hex): bleibt eine Datenfarbe und steht inline als Fläche; die Schrift darauf wählt
  `textOn(hex)` (§8). Keine Custom Property im Namensraum `--tl` außerhalb des Pakets (heute `--cal-ev-bg`, fällt).
- **Ausgewählt:** Ring wie `tl-item[aria-selected]` (`border-width-md`, `border-interactive`), Fläche bleibt die
  Kategorie. Der Fokusring kommt aus `base.css`.
- Ein Rand innen statt `rgba(255,255,255,0.35)` (Literal) — Token wählt der Plan (`border-separator` oder kein Rand,
  wenn das Kontrastpaar genügt).
- **Ohne Kategorie und ohne Serverfarbe** (heute `tlCalEvent--default`, blau): die Marke — `surface-brand` mit
  `text-on-brand`.
- **Termine im Monat mit Uhrzeit** bleiben, was sie heute sind: Punkt in der Farbe des Termins und Text auf der
  Tageszelle (keine Füllung). Der Punkt liest `category-N-surface` bzw. die Serverfarbe bzw. `surface-brand`; ganztägige
  und mehrtägige Balken im Monat sind gefüllt wie im Zeitraster.

**Fokus und Ansage.**
- Die Termine eines Rasters (Ganztagszeile, Zeitraster, Monat) sind eine Auswahlliste: Behälter `role="listbox"` mit
  Namen, Termine `role="option"` mit `aria-selected`, **ein Tab-Halt** je Liste, Pfeiltasten über `useRovingFocus` in
  der Reihenfolge der Zeit; Enter/Leertaste wählt (`selectEvent`). Der Name nennt Zeit und Titel (Ganztags: Titel und
  „ganztägig“, `js.calendar.allDay`).
- Tageskopf im Zeitraster, Tageszahl im Monat, „+n weitere“, Titel und Tage des Mini-Monats werden **Knöpfe** (heute
  `div` mit `onClick`); ihr Name nennt das volle Datum (Intl, Locale aus dem Zustand). Befehle wie heute (`goto`).
- Ziehen, Verschieben, Länge ändern, Anlegen durch Ziehen bleiben Zeiger-Bedienung (nicht in 5c, §1).

**Eine Tageszelle (V26).** Zeitraster-Kopf, Monat und Mini-Monat zeichnen „heute“, „arbeitsfrei“ und „anderer Monat“
gleich:
- heute: `aria-current="date"`; ein Kreis auf `surface-brand` mit `text-on-brand` um die Tageszahl — auch im
  Mini-Monat (heute Rechteck);
- arbeitsfrei: `data-tl-state~="nonworking"`, Fläche `surface-base`;
- anderer Monat: `data-tl-state~="other"`, Schrift `text-secondary`;
- Tage mit Terminen im Mini-Monat: `data-tl-state~="event"` (Markierung aus Tokens, heute eigene Regel).

**Flächen.** Arbeitszeit-Band auf `surface-layer`, die übrige Spalte auf `surface-base` (statt `rgba(127,127,127,0.09)`);
Stundenlinien `border-separator`; Jetzt-Linie aus `status-error` (Linie `status-error-border`, `border-width-md`) statt
`#da1e28`.

**Ziehen (V5).** Der gezogene Termin `data-tl-state~="dragging"` (0,4 aus `drag.css`, heute 0,7); die Vorschau am
Zielort als `data-tl-state~="preview"` im Kalender-Block. Im Monat zeigt der Zieltag `data-tl-state~="drop-onto"`
(`drag.css`), solange ein Termin darüber gezogen wird; heute fehlt jede Anzeige. Die Nutzlast des Monats bleibt
`text/plain` (kein Bridge-Drag, Termine verlassen den Kalender nicht).

**Anlegen-Feld (V27, V21).** Der Platzhalter-Termin beim Anlegen hält ein Feld des Pakets wie der Zelleditor der
Tabelle (randlos auf der Terminfläche, Fokusring aus `base.css`, kein `outline: none`); Enter übernimmt, Escape verwirft
über `useStandaloneKeyboardScope` (Dispatcher), Verlassen verwirft wie heute.

**Mini-Monat (V6).** Je Mini-Monat ein Raster mit **einem Tab-Halt**; Pfeiltasten (zeilenweise hoch/runter, Pos1/Ende)
über `useRovingFocus`; Enter springt zum Tag (`goto`).

**Maße.** Literale gehen auf Tokens: Stundenspalte (56 px) auf eine Größenstufe, die die Stundenbeschriftung trägt;
Mindestbreite des Mini-Monats (220 px) auf eine Größenstufe; Schriftgrößen (13 Literale) auf Typo-Klassen
(`label`, `body`, `heading-*`); Abstände auf `space-*`; `z-index` (2, 4, 5, 6) auf Ebenen der Skala oder Reihenfolge im
Stapel. **Inline bleibt, was Daten sind:** Stundenhöhe, Lage und Größe der Termine, Spaltenzahl des Rasters.

## 4 · Gefüllte Kategorie-Tokens (V25)

- **Rollen:** `category-N-surface` (N = 1…8) in `light` und `dark` in `tokens.json`, als Referenz auf eine Primitive der
  jeweiligen Kategorie-Rampe. **Helle Schrift in beiden Modi, wie heute** (gesättigte Termine mit weißer Schrift): die
  Stufe ist die dunkle mittlere, an der der helle Kandidat 4,5:1 hält (heute die Stufen der dunklen `-border`, etwa
  46–48; der Plan rechnet je Kategorie nach).
- **Beschriftung:** `derived.light/dark` bekommen `text-on-category-N` mit `{ "surface": "category-N-surface" }` —
  gerechnet, nie geschrieben (wie `text-on-brand`). Das Kontrast-Gate (`pairs.mjs`) prüft sie damit von selbst (4,5).
- **`derive`:** `kategorieRollen` liefert neben `subtle` und `border` die gefüllte Fläche — **der Ton der Kategorie
  (verteilt oder aus `color.category`) bei Helligkeit und Buntheit der TopLogic-Stufe**, wie `subtle` und `border` heute;
  eine gelieferte Kategorie-Farbe wird nicht selbst zur Fläche. Hält der helle Kandidat 4,5:1 nicht, dunkelt `derive`
  die Fläche ab (`aufKontrast`), bis er hält — die Schrift bleibt hell; ein Hinweis nennt es. Die Verteilung der Töne um
  die Kundenmarke bleibt unverändert. Die Trennungs-Prüfung (3b in
  `derive.mjs`) bleibt bei `-subtle`. Probe-Theme (`test/fixtures/probe.primitives.json`) bekommt die neuen Rollen;
  kein gerechneter Befund (Exit 3) — das Fixture liefert absichtlich Befunde, `--strict` bleibt dort Exit 1.
- **Nur eine Stufe:** kein Zeigen/Drücken je Kategorie — Termine wechseln beim Zeigen nicht die Farbe, die Auswahl ist
  der Ring (§3).
- **Leser:** Termine im Kalender. Pill und Avatar bleiben bei `-subtle`/`-border`.
- **Die beiden Kandidaten werden öffentlich** (für `textOn`, §8): Rollen `text-contrast-light` und `text-contrast-dark`
  in `tokens.json`, je der Kandidat aus `derived.candidates` (`{gray-0}`, `{gray-77}`); `derive` schreibt sie aus dem
  Kundengrau wie die Kandidaten, aus denen es rechnet. So wählt der Browser zwischen denselben zwei Farben wie `derive`,
  auch im Kundentheme.
- **Review:** der `derive`-Teil durch einen frischen Opus-Agenten (Rechenkern).

## 5 · Kanban (V23, V5, V6, V29)

Neuer Block **`tl-board`** im Paket (`board/board.{css,contract.md,spec.html}`; Elemente `__column`, `__header`,
`__label`, `__cards` …, der Plan legt sie fest); die Klassen `tlKanbanBoard*` fallen.

- **Spalte:** `section` mit Namen wie heute; die Karten-Liste wird `role="listbox"` (`aria-multiselectable`, wo der
  Zustand es sagt) mit **einem Tab-Halt**; Pfeil hoch/runter über `useRovingFocus`.
- **Auswahl (V23):** Karten sind `tl-item` mit `role="option"` und `aria-selected` (Ring und check badge aus
  `layout.css`, Q24) statt `li role="listitem" aria-current`. Klick, Strg/Cmd, Umschalt, Enter/Leertaste, langes
  Drücken über den gemeinsamen Auswahl-Hook (§8); der Befehl `selectCard{card, toggle, range}` bleibt.
- **Verschieben mit Tastatur (V6):** auf der fokussierten Karte
  - Alt+Pfeil hoch/runter: eine Stelle früher/später in der Spalte, wo `reorder` an ist;
  - Alt+Pfeil links/rechts: in die Nachbarspalte an dieselbe Stelle (gibt es sie nicht, ans Ende).
  Beides schickt **denselben `drop`-Befehl** wie das Ziehen (Quelle, Schlüssel, Zielspalte, Karte davor bzw. Ende); eine
  Ablehnung des Servers kommt als seine Warnung wie beim Ziehen. Ausgewählte Karten gehen mit, wie beim Ziehen. Ansage
  der neuen Lage (Spalte, Position) in einem Live-Bereich und Fokus auf der verschobenen Karte, Texte wie
  `js.reorder.*`.
- **Ziehen (V5):** Einfügelinie und Spalte zeichnet `drag.css` über `data-tl-state` (`drop-before`, `drop-after`,
  `drop-onto` für „ans Ende/in die Spalte“, `drop-refused`, `dragging`) statt `--dropBefore/--dropAfter/--dropEnd/
  --dragover/--dropRefused`. **Die Position bleibt, wie sie heute gerechnet wird** (nächste Kartengrenze irgendwo in der
  Spalte, auch in Lücken und unter der letzten Karte) — `dropZoneAt` allein machte aus Lücken „ans Ende“, das wäre eine
  Verhaltensänderung; die Rechnung zieht als benannte Funktion neben `dropZoneAt` in `bridge/drag-drop.ts`. Der Ablehnungshinweis
  wird `DropHint` (Popover wie Tabelle und Baum); `controls/drop-hint.ts`, `.tlKanbanBoard__dropHint` und
  `z-index: 13000` fallen. Die Probe-Buchhaltung (`dropProbe`, Urteile) bleibt.
- **Zähler (V29):** `tl-badge`.
- **Maße:** Spaltenbreiten 16 und 24 rem auf `size-12`/`size-13`; Abstände und Flächen aus Tokens (heute gemischt mit
  `--border-radius-02`, `--shadow-raised`, `--spacing-*`).

## 6 · Dashboard (V5, V6, V12, V20)

Neuer Block **`tl-dashboard`** im Paket (`dashboard/dashboard.{css,contract.md,spec.html}`); die Klassen `tlDashboard*`
fallen.

- **Kachel:** `tl-card` (Fläche, Rand, Ecke); der Schatten `--shadow-raised` fällt.
- **Aktion der Kachel:** der Knopf trägt `tl-visually-hidden` (V12) statt `.tlDashboard__tileAction` (12
  Deklarationen); hat er den Fokus, trägt die Kachel den Fokusring (`:has(:focus-visible)`, Ring aus den Fokus-Tokens).
  Deaktiviert: `aria-disabled`/`disabled` am Knopf, Darstellung über das Attribut, keine Klasse `--disabled`. Klick auf
  die Kachel löst die Aktion aus wie heute.
- **Bearbeiten:** Zustand `data-tl-state~="edit"` an der Wurzel statt `tlDashboard--edit`. Der Ausblenden-Knopf (Part
  `Button` ghost icon-only) sitzt in einer Ebene `tl-overlay__layer--top-right` über der Kachel, in
  `tl-overlay__action` (5b); `.tlDashboard__hide` mit `z-index: 6` fällt. Die Abdeckung, die im Bearbeiten den Klick
  auf den Inhalt sperrt (`__overlay`, `cursor: move`), wird eine Ebene von `tl-overlay` (Plan prüft, ob
  `tl-overlay__layer--fill` reicht).
- **Verschieben:** Ziehen zeigt die waagrechte Einfügelinie aus `drag.css` (`data-tl-axis="horizontal"`,
  `drop-before`/`drop-after`) statt des leuchtenden 8-px-Balkens; die gezogene Kachel `dragging`. Mit Tastatur (V6): im
  Bearbeiten ist jede Kachel fokussierbar; Alt+Pfeil links/rechts schiebt sie eine Stelle früher/später in der
  Reihenfolge, über `useListReorder({ axis: 'horizontal' })` mit Ansage „Position n von m“; Befehl `reorder` wie
  heute. Die Seite (vorher/nachher) rechnet der Hook statt der Mitte von Hand.
- **Raster (V20):** die Packrechnung (`computeLayout`) bleibt — das Paket hat dafür nichts Gleiches. Ein Abstand
  `space-md` statt zweier (0,75 rem im CSS, 1 rem inline), gelesen über `useTokenPx`; `parseLengthPx` fällt, wo
  `useTokenPx` reicht (Breiten aus dem Zustand wie `16rem` liest der Plan wie bisher). Innenabstand `tl-inset`.
- **Tooltip** der Aktion über `tooltipProps` statt `data-tooltip` von Hand.

## 7 · Werteliste und Tabellenzellen (V28, V30)

- **Block `tl-value-list`** (`value-list/…`) mit Variante `--block` (untereinander), Standard in einer Zeile; die Klassen
  `tlValueList*` fallen. Lesend `span`, bearbeitend `div role="group"` wie heute; `useListReorder` bleibt.
- **Griff (V28):** Part `Button` ghost, klein, Icon (`ICON_HANDLE`), wie der Griff der Spaltenwahl
  (`tl-reorder-list__handle`); Name und Ansage wie heute (`js.valueList.move`, `js.reorder.*`). Die doppelte Regel
  `.tlValueList__handle` fällt.
- **Trenner (V28):** „, “ zwischen Lesewerten liest `tl-select__separator`.
- **In der Tabellenzelle:** `table.css` füllt `tl-value-list` wie jeden Lesewert (ganze Breite, Ellipse); die Variante
  `--block` steht in der Zelle in einer Zeile; die Zeile mit Zusatzknopf (`tl-stack--row` mit `tl-stack--grow-first`)
  bekommt ihre Ellipse aus `table.css`.
- **Befehlsspalte (V30):** `RowCommandColumn.CSS_CLASS` wird `tl-table__cell--command` (Kopf- und Datenzelle: Innenabstand
  0, mittig); Regel in `table.css`, Vertrag nennt den Modifier. Danach ist der Zellen-Block leer.

## 8 · Gemeinsame Technik (V19, V23, V5, V25)

- **Eine Interaktiv-Prüfung (V19):** `controls/interactive.ts` fällt; `bridge/interactive.ts` trägt danach beide
  Fragen: ob ein Ziel interaktiv ist (heute `isInteractiveWithin` und `isInteractiveTarget`) und ob es bedienbar ist
  (`isOperableTarget`, die Prüfung auf deaktiviert/lesend in `TLTableView`). Die Fassungen unterscheiden sich darin, ob
  das Element selbst zählt und ob interaktive Vorfahren außerhalb der Fläche zählen; **jeder Aufrufer behält genau sein
  heutiges Verhalten** (Parameter, Tests je Fall). Aufrufer: Kanban, Dashboard, `TLTableView`, `items.tsx`, `TLPanel`,
  `touch-drag.ts`.
- **Ein Auswahl-Hook (V23):** die Auswahl aus `useItems` (Klick mit Strg/Cmd und Umschalt, Umschalt-Mausdruck ohne
  Textauswahl, Enter/Leertaste, langes Drücken, Klick auf Inneres gehört dem Inneren) wird ein Hook in der Bridge mit
  dem Befehl als Parameter; `useItems` und Kanban nutzen ihn. Verhalten von `useItems` unverändert (MUI- und
  Java-Tests grün).
- **Ein Ablehnungshinweis (V5):** `DropHint` für Tabelle, Baum, Kanban; `controls/drop-hint.ts` fällt, seine übrigen
  Exporte (`DropVerdict`, `NO_DRAG_IMAGE`, die Tabelle und Baum nutzen) ziehen zu `DropHint`. Die Klasse des Hinweises
  gehört nicht mehr der Tabelle: `tl-table__hint` wird **`tl-drop-hint`** im Block `drag` (Vertrag `drag`, Leser Tabelle,
  Baum, Kanban; Migrationseintrag).
- **Name → Kategorie einmal (V25):** `categoryOf(name)` in der Bridge; `avatar.ts` und der Kalender nutzen sie. Die
  Zuordnung bleibt (`1 + |hash| mod 8`, Hash wie heute).
- **Schrift auf Datenfarbe:** `textOn(color)` in der Bridge liefert die lesbare Schrift auf einer Serverfarbe, nach der
  Regel von `derive` (`beschriftungAbleiten`: höherer Kontrast der beiden Kandidaten) zwischen `text-contrast-light` und
  `text-contrast-dark` (§4, zur Laufzeit gelesen). Die Serverfarbe ist laut Java „die CSS-Farbe“ (auch `rgb()`, Namen):
  `textOn` löst sie über den Browser auf (berechneter Stil); Alpha zählt als deckend; lässt sie sich nicht auflösen,
  zeichnet der Termin seine Kategorie bzw. die Marke. Leser: Kalender.
- **Escape über den Dispatcher (V21, Teil Kalender):** das Anlegen-Feld; der Element-Picker bleibt 5d.

## 9 · Bedien-Gewinne

- **G1** Kalender, Kanban und Dashboard sind ohne Maus bis zur Auswahl bedienbar; Karten und Kacheln mit Alt+Pfeil
  verschiebbar, die neue Lage wird angesagt.
- **G2** „Hier ablegen“ sieht in Tabelle, Baum, Kanban, Dashboard und Kalender gleich aus; eine Ablehnung erklärt
  dasselbe Popover.
- **G3** Kalenderfarben folgen dem Kundentheme und halten den Kontrast; „heute“ sieht überall gleich aus.
- **G4** Eine Kanban-Karte wird ausgewählt wie jeder Eintrag: Ring und Haken.

Mehr nicht — der Rest gehört in den UI-Durchgang.

## 10 · Gates

- **Klassen (Lint):** kennt `tl-calendar`, `tl-board`, `tl-dashboard`, `tl-value-list` (Modifier je Block im Plan),
  `tl-table__cell--command`; keine Zustandsklasse (`--active`, `--selected`, `--dragging`, `--preview`, `--today`,
  `--nonworking`, `--other`, `--event`, `--dragover`, `--dropRefused`, `--dropBefore`, `--dropAfter`, `--dropEnd`,
  `--edit`, `--disabled`); keine Literale (Hex, px, `z-index`-Zahlen, Schriftgrößen); kein `outline: none`.
- **Kontrast:** `text-on-category-N` auf `category-N-surface` (4,5) in beiden Modi und im Probe-Theme; heute-Kreis
  (`text-on-brand` auf `surface-brand`, vorhanden); Jetzt-Linie und Auswahl-Ring als Nicht-Text (3,0) auf
  `surface-layer` und `surface-base`.
- **`derive`:** Probe-Theme mit den neuen Rollen, kein gerechneter Befund; Test, dass eine eigene Kategorie (`color.category`)
  auch die gefüllte Fläche bewegt.
- **`focus-clip.test.mjs`** misst die neuen Specimen-Seiten (Termin-Liste, Mini-Monat, Kanban-Spalte, Dashboard-Kachel
  mit Aktion und Ausblenden-Knopf, Werteliste in einer Zelle).
- **Verträge:** `calendar`, `board`, `dashboard`, `value-list` neu; `drag` (Leser Kanban, Dashboard, Kalender),
  `overlay` (Leser Dashboard), `layout` (Leser Kanban), `table` (`--command`, Werteliste), `choice` (`tl-segmented` im
  Kalender), `toolbar`, `badge`, `card`, `pill`/`avatar` (`categoryOf`) nachgezogen.
- **Vitest (MUI-Modul):** Kalender (Termin-Liste ein Tab-Halt, Pfeile, Enter wählt, Name mit Zeit; Ansichtswahl
  `aria-checked`; heute `aria-current="date"`; Escape im Anlegen-Feld verwirft über den Dispatcher; Serverfarbe mit
  lesbarer Schrift), Kanban (Auswahl wie `useItems`; Alt+Pfeil hoch/runter und links/rechts schickt `drop` mit den
  richtigen Argumenten; Fokus und Ansage; Ablehnung zeigt `DropHint`), Dashboard (Alt+Pfeil sendet `reorder`; Aktion
  der Kachel per Enter; Ausblenden-Knopf in `tl-overlay__action`), Werteliste (Griff als Part, Trenner), `useItems`
  unverändert, `isInteractiveWithin` mit und ohne das Element selbst, `categoryOf`, `textOn`.
- **Java:** `layout.view` (`RowCommandColumn`, Kanban- und Dashboard-Tests), `layout.react` (`TestReactValueListControl`,
  `TestReactStylesheetTokens`, `TestDesignSystemCopy`).
- **Ratsche:** Kanban eintragen und mit den vier anderen streichen.
- **Engine:** `engine-classes.test.mjs` (`ALT_5C`) meldet `tlCal…`, `tlKanbanBoard`, `tlDashboard`, `tlValueList`,
  `tlRowCommandCell`, `--cal-ev-bg` in `react-src` jedes Moduls samt Vitest-Dateien, im alten Stylesheet, in Java,
  Views, tl-docs und der Demo. Modul-Tests `layout.react`, `layout.view`, `layout.configedit`, `demo.react` grün;
  MUI-Vitest grün; `tsc` 0; Vite grün; `check-messages-en.sh` ohne Diff; `published.test.mjs` und
  `TestDesignSystemCopy` grün.

## 11 · Reihenfolge mit Fertig-Bedingungen

1. **Paket: Kategorie-Tokens und `derive`.** Rollen, abgeleitete Schrift, `derive`, Probe-Theme. Fertig: Kontrast grün,
   `derive` ohne gerechneten Befund, Opus-Review des Rechenkerns.
2. **Paket: Blöcke.** `tl-calendar`, `tl-board`, `tl-dashboard`, `tl-value-list`, `tl-table__cell--command`, Zellregeln in
   `table.css`. Fertig: Specimen hell und dunkel, beide Dichten; Lint, Verträge, `focus-clip` grün.
3. **Engine: gemeinsame Technik.** Interaktiv-Prüfung, Auswahl-Hook, `categoryOf`, `textOn`. Fertig: Vitest, `useItems`
   unverändert.
4. **Engine: Werteliste und Zellen.** `TLValueList`, `RowCommandColumn`. Fertig: Blöcke TLValueList und Zellen leer.
5. **Engine: Dashboard.** Fertig: Block Dashboard leer, Vitest.
6. **Engine: Kanban.** Fertig: Block TLKanbanBoard leer, `drop-hint.ts` weg, Vitest, Java-Tests grün.
7. **Engine: Kalender.** Fertig: Block TLCalendar leer, Vitest.
8. **Gates gesamt** nach §10, i18n mit `check-messages-en.sh`, `altlast.md` „Welle 5c“.
9. **Sichtprüfung lokal** (`tl-demo-react`, hell und dunkel, beide Dichten): Kalender in allen Ansichten (Termin wählen
   per Tastatur, ziehen, anlegen, Escape), Board und Drag-Demo (Auswahl, ziehen, Alt+Pfeil, Ablehnung), Projekt-Cockpit
   (Kachel-Aktion, Bearbeiten, ausblenden, verschieben), Werteliste in Formular und Tabelle.
10. **Lokal committen, melden.** Kein Push (Welle 5 als ein PR nach 5d). Trac #29906 bekommt Solution,
    `== Migration ==` und `RequiresMigration`.

Vor dem Start: Plan-Review durch einen frischen Agenten gegen die Gates (CLAUDE.md), dann SDD.

## 12 · Was das für die Anwendungen heißt

Steht im Trac-Text unter `== Migration ==` und als Alt→neu-Liste in `altlast.md`:

- Die Klassen `tlCal*`, `tlKanbanBoard*`, `tlDashboard*`, `tlValueList*`, `tlRowCommandCell` gibt es nicht mehr; die
  Custom Property `--cal-ev-bg` ebenso. Der Ablehnungshinweis beim Ziehen heißt `tl-drop-hint` statt `tl-table__hint`. Zustände sind Attribute (`aria-selected`, `aria-current="date"`,
  `data-tl-state`).
- Sichtbar: Termine in Kategoriefarben des Themes; „heute“ auch im Mini-Monat als Kreis; Arbeitszeit heller als der
  Rest des Tages; Jetzt-Linie in der Fehlerfarbe des Themes; ausgewählte Karte mit Ring und Haken; Einfügelinie in
  Kanban und Dashboard wie in Tabelle und Baum; Ablehnung als Popover; Dashboard-Kacheln ohne Schatten; Zähler der
  Kanban-Spalte als Badge.

## 13 · Offen und entschieden

Mit Hendrik entschieden (19.10.): kein neues Bedienkonzept (§1); V23–V30 wie vorgeschlagen; V25 mit gefüllten
Kategorie-Tokens (§4); Abschnitte 1–9 abgestimmt.

Beim Schreiben entschieden (Orchestrator, Hendrik prüft beim Lesen):

1. **Termine als Auswahlliste** (`listbox`/`option`, ein Tab-Halt je Raster) — Auswahl gibt es schon (`selectEvent`), sie
   wird nur mit der Tastatur erreichbar; eine Liste von Knöpfen hätte Dutzende Tab-Halte in einer Woche.
2. **Arbeitszeit auf `surface-layer`, übrige Zeit auf `surface-base`** — eine Stufe der vorhandenen Flächen statt eines
   grauen `rgba`-Bands.
3. **Serverfarbe bleibt Datenfarbe inline**, die Schrift darauf rechnet `textOn` — wie die Datenfarben in 5a; kein
   `--tl`-Name außerhalb des Pakets.
4. **Monat: Zieltag `drop-onto`**, Nutzlast bleibt `text/plain` — Termine verlassen den Kalender nicht, ein Bridge-Drag
   wäre neue Bedienung.
5. **Kanban Alt+links/rechts an dieselbe Stelle** der Nachbarspalte (sonst ans Ende) und **über `drop`** — kein neuer
   Befehl; die Prüfung des Servers gilt für Tastatur wie Zeiger.
6. **Neue Blöcke statt Einordnung in vorhandene** (`tl-calendar`, `tl-board`, `tl-dashboard`, `tl-value-list`) — kein
   Paketblock zeichnet heute ein Zeitraster, ein Board oder eine Packung von Kacheln; Gemeinsames (Karte, Eintrag,
   Ziehen, Overlay, Badge) liest das Vorhandene.
7. **Gefüllte Kategorie nur in einer Stufe** (kein Zeigen/Drücken) — der Ring trägt die Auswahl, ein Farbwechsel beim
   Zeigen wäre eine zweite Ansage.
8. **Dashboard-Packrechnung bleibt in der Engine** — eine Paketform dafür wäre neues Layout, nicht Umzug.

Aus der Builder-Prüfung (19.10., Orchestrator; keine Frage blieb, die nur Hendrik beantworten kann):

9. **Helle Schrift auf gefüllten Kategorien in beiden Modi** — wie heute; die Stufe folgt daraus (§4).
10. **`derive` füllt mit dem Ton bei TopLogic-Helligkeit**, nicht mit der gelieferten Farbe selbst; verfehlt der helle
    Kandidat 4,5:1, wird die Fläche dunkler, nicht die Schrift dunkel (§4).
11. **Kandidaten als Rollen `text-contrast-light`/`-dark`** — sonst wählte `textOn` im Kundentheme zwischen TopLogic-
    Grautönen oder zwischen festen Farben im Engine-Code (keine Fremdpaletten).
12. **`textOn` nimmt jede CSS-Farbe** (Java-Vertrag), ohne den Java-Vertrag zu verengen.
13. **Monat: Termine mit Uhrzeit bleiben Punkt und Text**, Termine ohne Kategorie und Farbe in der Marke (§3).
14. **Kanban: Ablageposition wie heute**, nur die Optik aus `drag.css` (§5).
15. **Interaktiv-Prüfung ohne Verhaltensänderung je Aufrufer;** `tl-table__hint` → `tl-drop-hint` (§8).
