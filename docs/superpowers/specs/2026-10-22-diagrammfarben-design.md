# Diagrammfarben: Reihen aus den Kategorien, gerechnet für Diagramme

**Datum:** 2026-10-22 · **Ticket:** #29914 (Welle 5d, PR !1939) · **Entschieden von:** Hendrik, im Gespräch 22.10.

## Warum

Bernhard hat !1939 freigegeben, mit dem Satz „Die Farben in …/view/charts sind aber kein Gewinn“. Er hat recht. Die
Diagramme lesen seit 5d `category-N-surface`, die gefüllten Kategorien der Kalendertermine (Spec 5c §4). Diese Stufen
sind für weiße Schrift abgedunkelt und liegen alle auf derselben Helligkeit (OKLCH L 0,52–0,54). Ein Token, zwei
Aufgaben: Schrift tragen und Reihen unterscheiden. Die zweite Aufgabe erfüllt er nicht.

Gemessen mit dem Palettenprüfer (Machado 2009, OKLab-ΔE ×100, benachbarte Reihen):

| Palette | Rot-Grün-Schwäche (Ziel ≥ 8) | normales Sehen (Ziel ≥ 15) | Kontrast zum Grund (Ziel ≥ 3:1) |
|---|---|---|---|
| 5d heute (`category-N-surface`) | 2,4 (Ocker ↔ Oliv) | 5,9 (Violett ↔ Magenta) | erfüllt |
| master (Tableau 10, fremd) | 11,9 | 14,0 | hell 1,6–2,4 bei Gelb, Pink, Orange, Petrol |

Dazu sind 5/6 beide blau und 7/8 beide magenta, und die Reihenfolge der Kategorien folgt dem Farbkreis: Nachbarn im
Diagramm sind Nachbarn auf dem Kreis, das ungünstigste denkbare Ordnen.

Hendrik: !1939 wird erst gemergt, wenn die Diagrammfarben drin sind (Hinweis an Bernhard im PR, 22.10.).

## Das Ziel

Diagramme bekommen eigene Farben, die das Design System rechnet, aus denselben acht Kategorietönen wie Kalender, Pill und
Avatar, im Kundentheme aus dessen Marke. Erfolg heißt: Jede Palette, die das Paket oder `derive` ausgibt, besteht die
Prüfung in beiden Modi, ohne dass jemand eine Farbe von Hand wählt, und die Diagramme in
`…/view/charts` lesen sich hell und dunkel klar besser als heute und als master.

Leitlinie aus NN/g („Data Visualizations for Dashboards“): Farbe ist ein Signal, also gedeckt statt grell; dieselbe
Kategorie hat überall dieselbe Farbe; Bedeutungsfarben (Rot, Gelb, Grün) nur für Status; Farbe nie allein, die Legende
bleibt.

## Entschieden

### 1. Ein Satz Töne für alles (Hendrik)

Die acht Kategorietöne sind die einzige Quelle. Kalender, Pill, Avatar und Diagramm lesen denselben Ton je Kategorie;
nur die Stufe (Helligkeit, Chroma) unterscheidet sich je Aufgabe. Es gibt keine eigene Diagramm-Palette mit eigenen
Tönen und keine fremde Palette.

### 2. Neue Rolle `category-N-mark`, je Modus

Eine vierte Rolle je Kategorie: die Farbe einer Datenmarke (Balken, Linie, Punkt, Segment). Sie steht in beiden Modi in
`tokens.json` als Referenz auf eine Primitive, wie jede Farbrolle. `subtle`, `border` und `surface` bleiben, wie sie sind.

Was `mark` erfüllt, in jedem Modus:
- Kontrast mindestens 3:1 gegen `surface-base` und `surface-layer` (WCAG 1.4.11, grafische Objekte).
- Benachbarte Reihen bei Protanopie und Deuteranopie (Machado 2009, Schwere 1,0) ΔE ≥ 8, bei normalem Sehen ΔE ≥ 15.
  „Benachbart“ heißt: N und N+1, und zusätzlich Reihe 1 gegen jede Reihe ab 3, weil sich im Ring das letzte Segment an
  das erste legt, bei jeder Anzahl.
- Chroma mindestens 0,10 (darunter liest sich ein Ton als Grau).
- Kein gemeinsamer Wert mit einer Bedeutungsfarbe (`status-*`).

### 3. Helligkeit gestaffelt, je Modus eigene Stufen

Die Unterscheidbarkeit kommt vor allem aus gestaffelter Helligkeit, nicht aus dem Ton allein; bei Rot-Grün-Schwäche ist
Helligkeit das, was bleibt. Hell und dunkel bekommen eigene Stufen.

Eine Reihe soll in beiden Modi ähnlich gewichtet wirken: Reihe 1 der Orange-Probe war hell ein dunkles Weinrot und dunkel
ein helles Rosa. Das ist **ein Ziel der Suche, kein Gate** (meine Entscheidung nach dem Builder-Check): Gemessen wird je
Reihe der Sprung der Helligkeit, normiert auf den zulässigen Bereich des Modus (0 = dunkelste, 1 = hellste zulässige
Stufe); die Suche hält den größten Sprung klein (Abschnitt 11). Eine harte Hälften-Regel hätte die gewählte Richtung C
selbst verletzt (Reihe 2 und 3 wechseln dort die Hälfte, sichtbar unauffällig).

**Nachtrag 23.10. (Hendrik, Sichtabnahme): Rot und warme Töne nicht zu dunkel.** Im hellen Modus wurden Rot zu Weinrot
und Orange zu Braun, weil die Suche sie dunkel setzte. Seitdem beginnt die Helligkeit im hellen Modus je Ton:
Rot (Ton ≥ 345° oder < 30°) bei L 0,50, warme Töne (30° bis 110°, Orange bis Gelb) bei L 0,54, alle anderen bei L 0,46
(vorher 0,43 für alle). Der dunkle Modus bleibt. Gerechnet: TopLogic Abstand 1,27 (vorher 1,34), Reihenfolge 238°, 2°,
285°, 186°, 56°, 311°, 123°, 337°; über alle Markentöne in 5°-Schritten kein Befund. Strenger (allgemein ab 0,50)
kippten 8 von 72 Marken unter die Schwelle. Verworfen: Handwerte für die zwei Reihen.

### 4. Reihenfolge gerechnet, Kategorien neu nummeriert

Die Kategorien werden so nummeriert, dass Kategorie N die Reihe N ist: Die Nummer folgt nicht mehr dem Farbkreis, sondern
der Rechnung, die benachbarte Reihen weit auseinanderlegt (Abschnitt 2). Eine Reihenfolge gilt für beide Modi: Reihe 3
hat hell und dunkel denselben Ton.

Kategorie 1 ist der Kategorieton, der der Marke am nächsten liegt. Die Marke selbst wird keine Reihe: Kategorien halten
20° Abstand zur Marke (`skalen.md` „Kategorien folgen der Marke“, 25.09.), weil die Marke in TopLogic „klickbar,
ausgewählt“ bedeutet. Eine Reihe in Markenfarbe sähe aus wie eine Auswahl. Reihe 1 steht also neben der Marke, nicht auf
ihr. Bei TopLogic ist das 238° (Marke 260°).

Folge: Kalender, Pill und Avatar zeigen nach dem Umnummerieren für dieselbe Nummer einen anderen Ton als vorher. Das ist
gewollt und betrifft nur Welle-5-Arbeit, die noch nicht auf master liegt (Kalender 5c, Avatar und Pill bestehen länger,
tragen aber keine Bedeutung je Nummer: „Kategorien, deren Bedeutung die Anwendung festlegt“).

### 5. Gerechnet, nie gewählt; dieselbe Rechnung für TopLogic und Kunden

Eine Funktion in `tools/lib/color.mjs` nimmt die acht Töne, die Marke und die Gründe beider Modi und gibt Reihenfolge und
`mark` je Modus zurück. Dieselbe Funktion
- liefert die Werte für TopLogic; ein Test hält `primitives.json` und `tokens.json` gleich ihrem Ergebnis für unsere Töne
  (keine Handwerte);
- läuft in `derive` nach der Verteilung der Töne (`kategorienVerteilen`) und schreibt `category-N-mark` beider Modi.

Gleiche Eingabe gibt gleiche Ausgabe (kein Zufall, keine Abhängigkeit von der Laufreihenfolge).

### 6. Chroma folgt der Marke, gedeckt bleibt

Das Chroma der Marken liegt zwischen 0,10 und 0,15: die Marke des Themes, auf diesen Bereich begrenzt. Eine gedeckte Marke
gibt gedeckte Diagramme, eine kräftige Marke höchstens 0,15. Das ist „gedeckt statt grell“ (NN/g). Wo der Farbraum bei
einer Helligkeit weniger hergibt, sinkt das Chroma dort (wie `oklchZuHex` heute).

### 7. Bedeutungsfarben bleiben draußen

Die Diagramme lesen nie `status-*`. Die Kategorietöne liegen weiterhin zwischen den Bedeutungen (Regel von 25.09.,
unverändert). Wer in einem Diagramm Fehler oder Erfolg meint, setzt die Farbe am Server selbst.

### 8. Kundenthemes

Ein Kunde liefert Kategorien wie bisher als `color.category.category-N` (ein Hex, aus dem der Ton kommt). Eine gelieferte
Kategorie behält ihre Nummer; gerechnet und geordnet werden nur die übrigen um sie herum. Ihre `mark`-Stufen rechnet
`derive` aus dem gelieferten Ton. Verfehlt die Palette dadurch eine Schwelle aus Abschnitt 2, ist das ein Befund im Kopf
der Datei, kein Abbruch (Regel von `derive`: Geliefertes darf verfehlen, Gerechnetes nie).

**Keine Lösung für eine Marke:** Auch ohne gelieferte Kategorie kann eine Marke den Kreis so füllen, dass keine Palette
die ΔE-Schwellen hält (`kategorienVerteilen` senkt dann schon heute den Abstand unter 20°). Ursache ist die gelieferte
Marke, also gilt dieselbe Regel wie bei der Beschriftung einer mittelhellen Marke (`derive.mjs`, `MARKEN_FLAECHEN`):
**Befund, kein Abbruch.** `derive` schreibt die beste gefundene Palette und nennt im Kopf das schwächste Paar mit Wert
und Schwelle. Kontrast 3:1 und Chroma ≥ 0,10 bleiben dabei hart (sie hängen nur an Gründen und Helligkeit, nicht am
Gedränge auf dem Kreis). Es wird kein Ton verschoben und das Chroma nicht über 0,15 gehoben, um eine Schwelle zu retten.
Ein Test läuft über Markentöne von 0° bis 355° in 5°-Schritten (TopLogic-Grau, Chroma der TopLogic-Marke) und hält fest,
für welche Töne ein Befund entsteht; für TopLogic und die Probe-Marke entsteht keiner. (Meine Entscheidung nach dem
Builder-Check, aus der bestehenden Regel abgeleitet.)

### 9. Was das Diagramm malt, ist, was geprüft ist

- Flächen (Balken, Segmente) in `mark` ohne Deckkraftabschlag; die geprüften Werte sind die gemalten.
- Linien in `mark`, Punkte gefüllt in `mark` (`pointBackgroundColor`, deckend).
- **Ausnahme Fläche unter einer Linie oder einem Radar** (nur wenn der Server `fill` einschaltet): `mark` mit 20 %
  Deckkraft wie heute, sonst verdecken sich gefüllte Reihen. Die Identität trägt dort die Linie, nicht die Fläche;
  geprüft ist die Linie. (Meine Entscheidung nach dem Builder-Check.)
- Ring, Torte, Polar: zwischen den Segmenten eine Fuge in der Farbe des Grunds (`--tl-surface-layer`), damit sich
  Nachbarn auch dort trennen, wo sie sich berühren.
- Gitter und Beschriftung wie heute (`--tl-border-separator`, `--tl-text-secondary`).
- Was der Server an Farben mitgibt, gewinnt weiter (Vertrag `chart.contract.md`, unverändert).

### 10. Der Prüfer ist ein Gate

Die Prüfung aus Abschnitt 2 läuft als Test im Paket über die TopLogic-Palette und über `derive` mit
`test/fixtures/probe.primitives.json`, je Modus. Das Simulationsmodell (Machado 2009, Schwere 1,0) und die Schwellen
gehören zum Gate; sie stehen in `tools/lib`, ohne Abhängigkeit.

### 11. Was die Suche optimiert

Unter allen Paletten, die Kontrast und Chroma halten, gewinnt die mit dem größten **kleinsten Abstand zur Schwelle**,
über beide Modi und alle Paare aus Abschnitt 2: `min(ΔE_Rot-Grün / 8, ΔE_normal / 15)`. Das ist das Ziel, mit dem der
Prototyp C gefunden hat. Den Helligkeitssprung (Abschnitt 3) hält eine Vorauswahl klein: je Ton nur Stufenpaare mit
normiertem Sprung ≤ 0,5; hält die Suche damit die Schwellen nicht, läuft sie ohne diese Grenze. Bei Gleichstand gilt die
erste optimale Belegung in Rasterreihenfolge. Reihe 1 ist vorab festgelegt (Abschnitt 4); bei einer unbunten Marke ist es
der kleinste freie Ton. (Meine Entscheidung nach Builder-Check und Plan-Review: eine zweite lexikographische Auswahl über
Sprung und Chroma war im Verfahren teuer und nicht prüfbar.)

Die Funktion findet deterministisch womöglich eine andere Palette als C, mit mindestens so viel Abstand. Abgenommen wird
sie von Hendrik im Specimen hell und dunkel, bevor die Engine sie liest.

## Machbarkeit (Prototyp, nicht normativ)

Ein Prototyp mit zufälliger Suche fand für unsere unveränderten Töne (2°, 56°, 123°, 186°, 238°, 285°, 311°, 337°) eine
Lösung, die alle Schwellen erfüllt; Hendrik hat diese Richtung im Browser gewählt („C trifft die Richtung“):

| Reihe | Ton | hell | dunkel |
|---|---|---|---|
| 1 | 238° | `#005F8A` | `#007AB0` |
| 2 | 2° | `#DE698E` | `#B4446B` |
| 3 | 56° | `#B85F00` | `#EA8839` |
| 4 | 285° | `#7C73D8` | `#8A82E9` |
| 5 | 186° | `#00A296` | `#00C1B4` |
| 6 | 311° | `#B378D8` | `#C387E9` |
| 7 | 123° | `#7B9A17` | `#739100` |
| 8 | 337° | `#CE6EB6` | `#EC8AD4` |

Rot-Grün ΔE hell 9,2 / dunkel 8,6, normal 16,0 / 15,6, Kontrast überall ≥ 3:1. Für die orange Probe-Marke ebenso
(11,3 / 8,8 und 16,7 / 16,7), dort aber mit dem großen Helligkeitssprung von Reihe 1 (Abschnitt 3). Die Werte zeigen,
dass es geht; die endgültigen kommen aus der Funktion.

## Nicht in diesem Paket

- **Mengenskala** (ein Ton hell → dunkel, aus der Marke): Kein Diagramm in TopLogic braucht sie heute (Chart.js ohne
  Heatmap-Plugin). Eintrag in `docs/ui-durchgang.md`.
- **Hervorheben** (alle Reihen grau, eine in Farbe; NN/g „Highlighter“): braucht eine Aussage des Servers, welche Reihe
  zählt. Eintrag in `docs/ui-durchgang.md`.
- **Neue Tonleitern** (Orange, Violett als eigene Familien): Die Prüfung besteht ohne sie.
- **Mehr als acht Reihen:** Die neunte nimmt wieder die erste, wie heute (Vertrag). Keine erfundene neunte Farbe.

## Anti-Ziele

- Eine Palette, die jemand von Hand pflegt.
- Eine Reihe in exakter Markenfarbe.
- Grell: Chroma über 0,15.
- Hell und dunkel mit verschiedener Reihenfolge.
- Ein Diagramm, das eine Bedeutungsfarbe als „Reihe 4“ zeigt.

## Was mitzieht

Paket:
- `tools/lib/color.mjs` (Funktion, Prüfer), `tools/derive.mjs` (Schritt nach der Verteilung), `src/primitives.json`,
  `src/tokens.json` (Rolle `category-N-mark`, neue Nummerierung), `dist/` über `generate.mjs`.
- Tests: Gate aus Abschnitt 10; „eine Kategorie hat genau drei Rollen“ wird vier; `planen.test.mjs` (Sollwerte der
  Kalenderflächen nach dem Umnummerieren); `derive.test.mjs`; `contracts-5d.test.mjs`.
- Verträge: `chart.contract.md` (Reihe N liest `--tl-category-N-mark`, Fuge, keine Deckkraft), Kategorietabelle in
  `skalen.md`; Pill und Avatar nur, soweit sie Töne je Nummer nennen.
- Specimen: Diagramm hell und dunkel; Kategorien (Pill, Avatar, Kalender) nach dem Umnummerieren.
- `docs/skalen.md` neuer Abschnitt „Diagramme rechnen ihre Reihen“, `STATUS.md`, `docs/ui-durchgang.md` (zwei Einträge
  oben). `docs/praesentation-v2.md` nicht (das Gesamtbild ändert sich nicht).

Engine (Branch `CWS/CWS_29914_design_system_welle_5d`, PR !1939):
- `com.top_logic.layout.react.chartjs/react-src/controls/chart/useThemeDefaults.ts`: Reihen aus `--tl-category-N-mark`,
  ohne Deckkraft, Punkte gefüllt, Fuge an Ring/Torte/Polar; Tests des Moduls.
- Kopie des Pakets neu publizieren (`publish-to-worktree.mjs`), Siegel.
- Danach der vierte master-Merge (!1966) und ein Jenkins-Build; Push nur mit Hendriks Freigabe.

## Dem Bauenden überlassen

- Das Suchverfahren der Funktion (erschöpfend, Branch-and-Bound, feste Helligkeitsraster …), solange es deterministisch
  ist und die Schwellen hält. Fürs Ordnen bei acht Tönen reichen 7! = 5040 Reihenfolgen.
- Die Schrittweite der Helligkeit (die Gleichstand-Grenze in Abschnitt 11 setzt voraus, dass sie fein genug ist).
- Ob die Fuge im Ring über `borderColor` oder `spacing` von Chart.js entsteht.
- Die Namen der neuen Primitiven (`naming.mjs` leitet sie ab).
