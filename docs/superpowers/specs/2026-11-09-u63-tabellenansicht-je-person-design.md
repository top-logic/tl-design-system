# U63: Tabellenansicht je Person — Spec

Ticket #30102 (UI-Durchgang 2), Engine-Branch `CWS/CWS_30102_ui_pass_2_filter_columns`, Worktree
`_Working-Tree/tl8-wt-30102`. Entschieden mit Hendrik am 09.11.2026; Anlass: Hendrik und Bernhard (Teams, 06.11.),
`docs/ui-durchgang.md` U63.

## 1. Warum

Dichte, Zebrastreifen und Spaltenlinien stellt eine Person einmal ein und erwartet sie an **jeder** Tabelle. Heute
speichert das Popover „Ansicht“ sie im `TableViewState` der einen Tabelle; an der nächsten Tabelle ist alles wieder
ab Werk. Das ist eine persönliche Vorliebe für das Lesen von Tabellen, keine Eigenschaft einer Tabelle.

Was die Tabelle **selbst** betrifft — welche Spalten, in welcher Reihenfolge, wie breit, wie viele fixiert —, bleibt
je Tabelle. Diese Trennung ist der Kern der Änderung.

## 2. Ziele

1. **Drei Werte je Person, für alle Tabellen:** Tabellendichte, Zebra, Spaltenlinien.
2. **Tabellendichte bleibt unabhängig von der Dichte der Anwendung** (Benutzermenü, `react.density`). Ab Werk folgt
   sie der Anwendung („wie Anwendung“, leerer Wert); wählt die Person `normal` oder `kompakt`, gilt das für alle
   Tabellen, der Rest der Anwendung bleibt, wie er ist. (So schon vorher entschieden; Hendrik 09.11.: „dichte unabhängig
   für tabellen vom rest des themes“.)
3. **Eine Änderung wirkt sofort** auf jede offene Tabelle im selben Browserfenster, ohne Neuladen. Ein anderes
   Fenster oder ein anderer Browser-Tab zeigt sie nach dem Neuladen (der Speicher der Bridge, 6.3, gilt je Seite).
   *(Claudes Entscheidung nach dem Builder-Check.)*
4. **Eingestellt wird nur im Popover „Ansicht“** einer Tabelle (Hendrik 09.11.: „nur im Popover“). Kein Eintrag im
   Benutzermenü.
5. **„Zurücksetzen“ betrifft nur die Tabelle, in der geklickt wird,** und heißt danach so, wie es wirkt:
   **„Spalten zurücksetzen“** / „Reset columns“. Es setzt alles zurück, was diese Tabelle anordnet — Spaltenauswahl,
   Reihenfolge, Breiten, Fixierung, Sortierung, Gruppierung (wie `resetToDefaults` heute, ohne die drei Werte); die drei
   persönlichen Werte lässt es in Ruhe (Hendrik 09.11., wegen der Erwartung der Nutzer).
6. **Jede Tabelle bietet die drei Werte an,** nicht nur eine gespeicherte (`isPersonalized`): das Zahnrad mit dem
   Popover „Ansicht“ erscheint an jeder Tabelle. „Spalten zurücksetzen“ steht nur, wo die Tabelle ihren Zustand
   speichert (Hendrik 09.11.).

## 3. Nicht-Ziele

- Kein neuer Eintrag im Benutzermenü, keine Einstellungsseite.
- Keine Vorgaben je Tabelle durch die Anwendung (etwa „diese Tabelle ab Werk mit Zebra“). Gibt es heute nicht, kommt
  nicht dazu.
- Keine Übernahme der bisher je Tabelle gespeicherten Werte. Die Felder kamen mit #30102 und waren nie auf master
  (`git show origin/master:…/TableViewState.java` kennt `_striped` nicht); sie werden abgeschnitten, ohne Alias und ohne
  Migration.
- Nichts an den Spaltenfiltern (U64: warten auf Bernhards Semantik).
- Keine Änderung an Aussehen oder Tokens von Zebra, Spaltenlinien, Dichte (`table.css`, `table.contract.md` bleiben in
  ihren Regeln gleich).

## 4. Anti-Ziele (wäre ein Fehlschlag, auch wenn es läuft)

- Ein Klick auf „Spalten zurücksetzen“ ändert Dichte, Zebra oder Spaltenlinien — in dieser oder einer anderen Tabelle.
- Die Tabellendichte zieht die Dichte der Anwendung mit oder umgekehrt.
- Eine andere offene Tabelle zeigt nach einer Änderung den alten Wert, bis man neu lädt.
- Ein zweiter Speicherort: die Werte stehen danach in der persönlichen Konfiguration **und** noch im `TableViewState`.

## 5. Entschieden (Hendrik 09.11.)

| Punkt | Entscheidung |
|---|---|
| Was je Person gilt | Tabellendichte, Zebra, Spaltenlinien |
| Was je Tabelle bleibt | Spaltenauswahl, Reihenfolge, Breiten, Fixierung, Sortierung, Gruppierung |
| Welche Tabellen die Werte anbieten | jede; „Spalten zurücksetzen“ nur bei gespeichertem Zustand |
| Was „Spalten zurücksetzen“ zurücksetzt | die ganze Anordnung der Tabelle samt Sortierung und Gruppierung |
| Tabellendichte gegen Anwendungsdichte | unabhängig; ab Werk „wie Anwendung“ |
| Ort der Einstellung | nur Popover „Ansicht“ |
| Bisherige Werte je Tabelle | entfallen ersatzlos |
| „Zurücksetzen“ | nur diese Tabelle, nur Spalten; heißt „Spalten zurücksetzen“ |
| Ort von „Spalten zurücksetzen“ | zweite Seite „Spalten“ des Popovers, am Ende der Spaltenliste |
| Erste Seite von „Ansicht“ | nur noch Dichte, Zebra, Spaltenlinien und der Eintrag „Spalten“ |

## 6. Wie es gebaut wird (Orchestrator, mit Begründung)

Diese Punkte hat Claude als Orchestrator entschieden, nicht Hendrik; sie folgen dem Muster, das die Dichte der
Anwendung seit 5d hat.

**6.1 Speicher.** Die drei Werte stehen in der `PersonalConfiguration`, neben `react.density`, unter
`react.table.density` (leer, `normal`, `compact`), `react.table.striped` und `react.table.columnLines` (boolesch).
Ein unbekannter oder fehlender Wert gilt als ab Werk (leer bzw. aus). Gelesen und geschrieben wird an **einer**
Stelle (ein kleiner Dienst oder statische Helfer neben `UIThemeService`; Name und Ort entscheidet der Bauende).

**6.2 Weg auf die Seite: Startwerte am Wurzelelement, live über einen Speicher der Bridge** *(geändert beim
Planen, 09.11.: klassische Seiten haben kein `window.tlTheme`, ein SSE-Aufruf käme dort nie an).* Der Server schreibt
die drei Werte ins erste HTML als Attribute an das Element, das auch `data-tl-density` trägt: am `html` der React-Seite
(`ViewServlet`) und am `div.tlReactHost` der klassischen Seite (`ReactViewComponent`). Attribute:
`data-tl-table-view` (immer, leer — die Marke, an der die Bridge sie findet), `data-tl-table-density` (nur bei
`normal`/`compact`), `data-tl-table-striped` und `data-tl-table-column-lines` (vorhanden = an). Das CSS liest sie nicht.

**6.3 Lesen im Client.** Ein Modul der Bridge hält die drei Werte für die Seite: beim ersten Lesen aus dem Element mit
`data-tl-table-view`, danach im Speicher. Eine Änderung im Popover schreibt zuerst in diesen Speicher — jede
`TLTableView` der Seite rendert sofort neu (`useSyncExternalStore`) — und schickt dann den Befehl, der speichert.
`TLTableView` setzt daraus wie bisher `data-tl-density`, `data-tl-striped` und `data-tl-column-lines` an seiner Wurzel
— **CSS und Vertrag des Pakets bleiben unverändert**, auch alles, was die Tabelle aus der Dichte misst. Andere Fenster
lesen beim Neuladen den gespeicherten Stand.

**6.4 Befehl.** Das Popover schickt weiter `setViewOptions` (`density`, `striped`, `columnLines`) an die Tabelle, in der
es offen ist. Der Handler speichert in der persönlichen Konfiguration; er fasst `TableView`/`TableViewState` nicht mehr
an und schickt nichts zurück. Die Zustandsschlüssel `viewDensity`, `striped`, `columnLines` der Tabelle und
`pushViewOptions` entfallen; `viewOptions` sagt künftig nur noch, ob die Tabelle ihren Zustand speichert (dann steht
„Spalten zurücksetzen“ da).

**6.5 Abschneiden.** Aus `TableViewState` fallen `density`, `striped`, `columnLines` samt Konstanten; aus `TableView`
`setViewOptions`; aus `TableViewStateCodec` deren Kodierung; `resetToDefaults` setzt nur noch die Anordnung zurück (samt Sortierung und Gruppierung).
Ein gespeicherter Zustand, der die alten Felder noch trägt, wird gelesen, ohne zu scheitern (die Felder werden
übergangen); das prüft ein Test des Codecs.

**6.6 „Spalten zurücksetzen“.** Der Befehl `resetView` bleibt in seiner Wirkung auf die Anordnung (jetzt ohne
Optionen). Der Eintrag zieht aus der ersten Seite auf die Seite „Spalten“, ans Ende der Liste; Schlüssel
`js.table.viewReset` wird zu `js.table.columnsReset` (Deutsch „Spalten zurücksetzen“, Englisch „Reset columns“),
ohne Alias. Verhalten nach dem Klick wie heute (Befehl senden, Popover schließen) — ob er auf der Spaltenseite
stattdessen offen bleibt und die Liste neu zeigt, entscheidet der Bauende nach dem, was die Tastaturführung
(`ViewStop`, Fokus nach dem Schließen) einfacher hält; beides ist recht.

## 7. Bedingungen

- Paket-Gates (`npm test`, `npm run test:dom`, `lint-css`) grün; das Paket ändert sich voraussichtlich nicht.
- Vitest `layout.react` und MUI, `tsc`; Maven `com.top_logic` und `com.top_logic.layout.react` mit Tests
  (`TestDefaultTableView`, `TestTableViewStateCodec`, `TestTableViewOptions` nachziehen), `layout.view`.
- `messages_en.properties` nur über JavaDoc und `tools/check-messages-en.sh`; Deutsch von Hand.
- Entwicklerdoku: wo `view-layer/tables.md` (oder ein anderes Kapitel) die Ansichtsoptionen beschreibt, je Person statt
  je Tabelle; der Bauende sucht die Stelle.
- Lokale Sichtprüfung (`tl-demo-react`): zwei Tabellen in zwei Reitern, in der einen Zebra an → die andere zeigt es ohne
  Neuladen; Tabellendichte kompakt → Anwendung bleibt normal; Neuladen hält alles; „Spalten zurücksetzen“ lässt die drei
  Werte stehen und stellt die Spalten zurück.
- Alles lokal committet (`Ticket #30102:`), nichts gepusht, bis Bernhard !2014 freigibt (Hendrik 09.11.).

## 8. Dem Bauenden überlassen

- Name und Ort des Lese-/Schreibhelfers (6.1) und der Bridge-Funktion (6.3).
- Verhalten des Popovers direkt nach „Spalten zurücksetzen“ (6.6).
- Ob `TestTableViewOptions` umgebaut oder durch einen neuen Test ersetzt wird.

## 9. Nach dem Builder-Check (Claudes Entscheidungen)

- **Ohne Seite „Spalten“** (Tabelle ohne `columnSelect`): „Spalten zurücksetzen“ bleibt auf der ersten Seite, als
  letzter Eintrag hinter den drei Werten. Auch ohne Spaltenwahl ändert die Person Breiten und Fixierung.
- **Klassische Seiten** (`tlReactHost`, z. B. tl-chat-classic): `ReactViewComponent` schreibt die Attribute an den
  Host (6.2); die Bridge findet sie dort über `data-tl-table-view`. Kein SSE-Aufruf, also nichts, was ohne
  `window.tlTheme` scheitert.
- **Commits nennen die Sonderfälle** (Hendrik 09.11.): Tabelle ohne Spaltenseite, klassische Seiten, andere Fenster
  erst nach Neuladen, alte gespeicherte Zustände.
- **Sichtprüfung:** „zwei Reiter“ heißt zwei Reiter der Anwendung im selben Fenster, nicht zwei Browser-Tabs.
- **Tests im MUI-Modul:** `com.top_logic.layout.react.mui/react-src/table-view-options.test.tsx` und
  `table-view-attributes.test.tsx` speisen heute `viewDensity`, `striped`, `columnLines` als Zustand ein; sie ziehen auf
  die Attribute am `html` um.
- Der Codec übergeht unbekannte Felder schon heute (`TableViewStateCodec.java:218-226`); 6.5 braucht dort nur den
  Test, keinen neuen Code.
