# UI-Durchgang 1: Tabelle mit Tiefe, Ansicht je Tabelle, eine Auswahl-Form für alles Wählbare

**Datum:** 2026-10-26 · **Ticket:** offen (wird am 27.10. angelegt, Commits bis dahin `#TBD-UI`) ·
**Entschieden von:** Hendrik, im Gespräch 26.10. (Mockups `.superpowers/brainstorm/…/tabelle-richtung.html`,
`chips-ueberlauf.html`)

## Warum

Die Wellen 0–5 haben das technische Fundament gelegt; jetzt soll TopLogic gut aussehen und sich gut bedienen lassen
(Prämisse: modern und großartig zu bedienen, auch bei komplexen Views). Die Tabelle ist in echten Anwendungen die
meistgenutzte Komponente — was hier besser wird, wirkt auf fast jede Ansicht.

Hendrik nach seinem Rundgang durch die Demo: Tabellen wirken **flach und langweilig**; die Filter-Chips sind schon ein
guter Anfang, die Tabelle spürbar zu modernisieren; das Zahnrad sollte mehr können als Spalten wählen.

Die Bestandsaufnahme (`docs/ui-durchgang.md`, 26.10.) belegt es: gewählt und Hover sind zwei fast gleiche Grautöne
(U25), Zahlen stehen links (U28, U36), jede Spalte zeigt dauernd Trichter, Gruppierung und Pfeil und schneidet dafür
ihren Titel ab (U29), Gruppenzeilen haben keine Hierarchie (U31).

## Ziel und Erfolg

Eine Tabelle in TopLogic sieht aus wie eine abgesetzte, ruhige Fläche, in der man sofort sieht, was gewählt ist,
welche Spalte gefiltert ist und wie viele Zeilen gerade zählen. Jede Person kann die Ansicht einer Tabelle für sich
einstellen, und die Einstellung bleibt.

Erfolg heißt:

1. Neben der heutigen Demo-Tabelle (Objektliste, Tabellenspalten, Projekte) wirkt die neue in beiden Modi und beiden
   Dichten klar hochwertiger — Hendriks Sichtprüfung entscheidet.
2. Eine gewählte Zeile ist ohne Fokusring und ohne Hover eindeutig zu erkennen — in Tabelle, Baum, Listen, Board und
   Navigation in derselben Form.
3. Die Einstellungen aus „Ansicht“ überstehen Abmelden und Anmelden.

## Nicht-Ziele

- **Navigation links** (zu flach, Einklapp-Knopf unten unverständlich) und **Dialog-Abschnitte** (Bearbeiten-Dialog
  wirkt wie eine langweilige Liste) — Hendriks Befunde vom 26.10., eigene Pakete danach.
- **Filter als Popover am Spaltenkopf** statt Dialog (U27) — eigener Baustein, eigenes Paket. Dieses Paket ändert nur,
  wie der Kopf einen aktiven Filter zeigt.
- Die übrigen Zustände der Zustandssprache: Haken in Menüs (U14), „in Kraft“ ohne ARIA (U13), Palettenring (U3) —
  eigenes kleines Paket.
- Eine dritte Dichte („locker“). Es bleibt bei normal und kompakt (Hendrik).
- Bewegung über das Nötige hinaus (U6 bleibt eigenes Paket).

## Anti-Ziele — woran es scheitern würde, auch wenn es technisch läuft

- Zwei Auswahl-Formen nebeneinander: die Tabelle in Markenfarbe, der Baum noch grau.
- Ein Menü „Ansicht“, das Einstellungen anbietet, die nach dem Neuladen weg sind.
- Ein aktiver Filter oder ein aktives Preset, das man nicht sieht (weggescrollt, im Menü versteckt, nur als
  Werkzeug-Symbol bei Hover).
- Ein Token mit zwei Aufgaben (wiederkehrendes Muster, siehe Memory „Ein Token, mehrere Aufgaben“):
  `surface-interactive-selected` wird heute auch von Fortschritt, Skeleton, Avatar, Pill, Feld und Drag gelesen — die
  neue Auswahl darf diese Leser nicht mitfärben.

## Entschieden

### 1. Richtung „Tiefe“ (Hendrik: B aus dem Mockup)

- Die Tabelle steht auf einer **abgesetzten Fläche**: `surface-layer`, Rundung, leichter Schatten, Rand
  `border-separator`. Eine Tabelle, die eine ganze Fläche füllt (Panel ohne anderen Inhalt), bekommt die Fläche ohne
  Außenabstand — die Tiefe kommt dann vom abgesetzten Kopf, nicht von einer schwebenden Karte. *(Meine Festlegung;
  der Bauer prüft beide Fälle in der Demo.)*
- **Kopfzeile abgesetzt:** eigene Fläche (`surface-layer-nested`), Titel in leiserer Schrift (Großbuchstaben, Sperrung,
  `text-secondary` wie im Mockup), Trennlinie unten. Spaltenlinien sind aus (umschaltbar, §3).
- **Werkzeuge im Kopf nur bei Hover und Fokus der Kopfzelle** (Sortieren, Filter, Gruppieren). Sichtbar bleiben, was
  **in Kraft** ist: die Sortierrichtung der sortierten Spalte und die Marke einer gefilterten Spalte in Markenfarbe. Der
  Titel bekommt dadurch die Breite zurück (U29). Mit Tastatur müssen die Werkzeuge erreichbar bleiben wie heute.
- **Zahlen und Beträge rechtsbündig mit `tabular-nums`**, Kopf mit ausgerichtet (U28, U36). Die Spalte braucht dafür
  eine Aussage über ihren Typ; wo der Server sie hat (Zahl, Betrag, Datum), schickt er sie mit.
- **Gruppenzeile als eigene Zeilenform:** Fläche `surface-layer-nested`, Gruppenwert halbfett, Zähler als kleine
  Kapsel daneben (U31).
- **Fußzeile nennt Zeilen und Filter:** „8 von 16 Zeilen · 1 Filter aktiv“ bzw. mit Namen des Presets — damit ist ein
  aktiver Filter immer sichtbar, auch wenn sein Chip im Menü steckt.

### 2. Filter-Presets: was passt, steht da; der Rest hinter „+ n weitere“ (Hendrik: Variante 3)

- Die Chips stehen in einer Zeile. Was nicht passt, liegt hinter einem Chip **„+ n weitere ▾“**, der ein Menü der
  übrigen Presets öffnet. Kein seitliches Scrollen, kein Fade. (Fade und Chevron verworfen: Mausrad ohne Seitwärtsrad
  scrollt nicht seitlich, der aktive Chip kann aus dem Bild laufen.)
- **Wie viele sichtbar sind, rechnet die Breite**, nicht eine feste Zahl — auch beim Ändern der Fensterbreite.
- **Das aktive Preset steht immer in der sichtbaren Reihe**; ist es eines aus dem Menü, rückt es in die Reihe und das
  letzte sichtbare wandert ins Menü. *(Meine Festlegung, von Hendrik nicht widersprochen.)*
- Mit Tastatur: Tab erreicht die sichtbaren Chips und „+ n weitere“; das Menü ist ein Paket-Menü mit `menuitemradio`-Einträgen —
  höchstens eines gilt; es kann auch keines gelten (Klick auf den aktiven Chip hebt den Filter auf, Kriterien von Hand
  passen zu keinem Preset). Ein eigenes Preset trägt im Menü wie als Chip seine Entfernen-Aktion (am Ende des Eintrags).
  *(Meine Festlegung.)*

### 3. Das Zahnrad wird „Ansicht“ — Einstellungen je Person und Tabelle

Das Zahnrad öffnet ein Popover „Ansicht dieser Tabelle“ (Mockup B rechts) statt direkt den Spalten-Dialog:

| Eintrag | Form | Ab Werk |
|---|---|---|
| Dichte | Segmente „Wie überall“ · „Normal“ · „Kompakt“ | Wie überall |
| Zebrastreifen | Schalter | **aus** (Hendrik) |
| Spaltenlinien | Schalter | aus |
| Spalten wählen und ordnen … | öffnet die heutige Spaltenwahl (nur wo die Tabelle sie anbietet) | — |
| Zurücksetzen | wie der heutige Reset (Spalten, Breiten, Fixierung, Sortierung, Gruppierung) plus die Einträge oben; Filter bleiben | — |

Zusammengelegt statt doppelt *(meine Festlegung nach dem Builder-Check)*: **Fixieren** bleibt, wo es heute ist (Schloss
in der Spaltenwahl, „bis hier fixieren“ im Kontextmenü, gespeichert als Anzahl `frozenCount`); **Gruppieren** bleibt im
Spaltenkopf (#29967 hat es aus der Spaltenwahl genommen). Das Popover dupliziert beides nicht. **Zeilen umbrechen**
entfällt: die Tabelle virtualisiert mit fester Zeilenhöhe (`scrollTop / rowHeight` → `start`/`count` an den Server),
umbrechende Zeilen bräuchten einen Umbau des Scroll-Protokolls — eigenes Thema, falls es je gebraucht wird.

**Jede Tabelle** bekommt „Ansicht“ (Dichte und Darstellung betreffen alle); der Eintrag „Spalten …“ erscheint nur, wo
`columnSelect` gilt. Der Spalten-Dialog behält seinen Zurücksetzen-Knopf. *(Meine Festlegung.)*

- **„Wie überall“** folgt der globalen Dichte aus dem Benutzermenü; „Normal“/„Kompakt“ halten diese Tabelle fest,
  egal was global gilt. Technisch: `data-tl-density` auf der Tabelle selbst. **Heute wirkt das nur für „Kompakt“:**
  die Normalwerte stehen allein unter `:root, [data-tl-mode]`, eine Regel `[data-tl-density="normal"]` gibt es nicht —
  `generate.mjs` braucht einen Normal-Block (mit Test), damit „Normal“ eine global kompakte Seite überstimmt. Und
  `useTokenSwitch` (`bridge/token-px.ts`) beobachtet nur `document.documentElement`; die virtualisierte Tabelle muss
  ihre Zeilenhöhe am eigenen Element lesen und bei Wechsel neu lesen.
- **Gespeichert je Person und Tabelle auf dem Server**, im selben Zustand wie Spaltenreihenfolge, Breiten, Sortierung
  (`com.top_logic.table.TableViewState`); ein alter gespeicherter Zustand liest sich als „alles ab Werk“.
- Änderungen wirken **sofort**, ohne „Ok“ — es ist eine Ansicht, kein Formular.
- „Als Standard für mich speichern“ aus dem Mockup entfällt: weil jede Änderung sofort gespeichert wird, gibt es nichts
  zusätzlich zu speichern. *(Meine Festlegung.)*

### 4. Eine Auswahl-Form für alles Wählbare (Hendrik: gleich für alle)

**Gewählt** heißt überall: Fläche im Markenton (`surface-brand-subtle`, bei Hover `-subtle-hover`) und eine **Kante in
Markenfarbe** an der Anfangsseite (Breite `border-width-accent`). Der Fokusring bleibt davon getrennt und unverändert.
Hover auf nicht gewählten Dingen bleibt das neutrale `surface-interactive-hover`.

- Dafür gibt es **eigene Rollen** (Namen dem Bauer überlassen, Kategorie `surface`/`border`), nicht eine Umdeutung von
  `surface-interactive-selected` — dessen andere Leser (laut Builder-Check u. a. Choice-Hover, Select-Knöpfe und
  -Hervorhebung, Compact-Field-Öffner, Endknopf im Feld, Fortschritt, Skeleton, Avatar, Pill, Drag) prüft der Bauer
  einzeln: bleibt die Bedeutung dort „gewählt“, ziehen sie mit; ist es nur eine graue Fläche, bekommen sie eine
  passende eigene Rolle. `derive` rechnet die neuen Rollen für Kundenthemes mit; die Kontrastpaare (Text auf der
  Auswahl-Fläche, Kante gegen Fläche) kommen in die Paarliste.
- **Betroffen** (Stand Paket, zu bestätigen): Tabellenzeile, Baumknoten (hebt die Festlegung „kein Balken links“ in
  `tree.css` bewusst auf), Navigationseintrag (`aria-current`), Kalendertermin, Bottom-Bar, Icon-Picker-Zelle —
  Board/`tl-item` und Select siehe unten. Die Liste ist
  vor dem Bau als **Konsolidierungs-Prognose** vorzulegen (sichtbarer Unterschied heute, UX-Gewinn, Urteil), Hendrik
  kreuzt an — Regel „Gleiches wird zusammengelegt“.
- **Nicht betroffen:** Reiter (Tabs) behalten ihren Unterstrich — ein Reiter zeigt, wo man ist, nicht was man gewählt
  hat; Menüeinträge (U14, eigenes Paket); Palettenzelle des Farb-Pickers (U3, eigenes Paket). *(Meine Festlegung.)*
- Kalendertermine tragen eine Kategorie-Farbe; ob die Kante dort frei ist, zeigt die Prognose.

## Randbedingungen

- Alle Gates des Pakets: `node --test`, `tools/lint-css.mjs` (keine Literale, nur Tokens, `:focus-visible`),
  `dist/` per `generate` erzeugt, `publish-to-worktree` mit Siegel. Werte nur in `primitives.json`, Referenzen in
  `tokens.json`.
- Zustände sind Attribute (`aria-selected`, `aria-current`, `data-tl-state`, `data-tl-density`), keine Klassen.
- Kein Alias alter Namen; Klassen und Tokens auf Englisch mit `tl`-Präfix.
- Engine-Seite (Zustand speichern, Spaltentyp, Popover statt Dialog am Zahnrad) läuft auf einem eigenen
  `CWS/CWS_<ticket>_…`-Branch; `messages_en.properties` nur über `tools/check-messages-en.sh`.
- Bis 27.10.: nur lokal (kein Trac, kein Gitea, kein Push).
- Beide Modi, beide Dichten, und die Kompaktbreite (App-Shell schmal) gehören zur Sichtprüfung.

## Dem Bauer überlassen

- Namen der neuen Rollen und Klassen, die genaue Schatten-Stufe und Rundung (aus der bestehenden Skala).
- Wie die Spalte ihren Typ für die Ausrichtung meldet: `com.top_logic.table.Column` kennt keinen Werttyp; eine neue
  Default-Methode mit „Text“ als Vorgabe, gesetzt zuerst für Modell-Attribute (`AbstractTableElement`), dazu eine
  optionale Ausrichtung in der Spalten-Konfiguration für Skript- und Formelspalten. *(Meine Festlegung.)*
- Wie das Ansicht-Popover gebaut wird — aus vorhandenen Teilen (Popover, Menü, Schalter, Segmente), nicht neu.
- Die Reihenfolge der Tasks, solange jeder Task mit grünen Gates endet.

## Nach dem Builder-Check entschieden (Hendrik, 26.10.)

- **Select und aufklappende Listen:** die Tastaturposition (`data-tl-state~="highlighted"`) wird neutral wie Hover
  (`surface-interactive-hover`, keine Akzentlinie); „gewählt“ bleibt dort der Haken. Tönung plus Kante heißt damit im
  ganzen Paket nur noch „gewählt“.
- **Karten (`tl-item`: Board, Spaltenliste `tl-columns__column`):** behalten Ring plus Haken (4c, S2); Ring und Fläche
  bekommen den Markenton der Auswahl-Rollen statt der heutigen Farben. Keine Kante an der Anfangsseite.
