# TopLogic Design System — Präsentationsfassung

**Stand:** 2026-09-24 · Welle 1 · Ticket #29617

Vorlage für die PowerPoint, mit der die Kollegen das Design System kennenlernen: was sich ändert, wie es funktioniert, warum so. Kurz und prägnant, eine Botschaft je Folie. Entscheidungen und Belege stehen allein in [`skalen.md`](skalen.md).

---

## 1 · Der Anlass

**Stellen Sie sich vor, jemand baut morgen eine neue Maske in TopLogic — und liest dafür zuerst, wie es die bestehenden machen.**

Er findet **17 verschiedene Schriftgrößen**. Er findet **fünf verschiedene Arten**, einen Fokusrahmen zu zeichnen. Er findet eine Farbe, die gleichzeitig Text, Rahmen, Fläche und Akzent ist.

Und dann trifft er eine Wahl. Sie wird plausibel aussehen, sie wird zum Nachbarn passen — und sie wird eine weitere Variante sein, die niemand entschieden hat.

**Dieser Jemand ist immer häufiger kein Mensch.** Oberflächencode entsteht zunehmend mit Sprachmodellen, und ein Modell tut genau das: Es liest den Bestand und ahmt ihn nach. Es wählt schnell, es wählt selbstsicher, und es wählt aus allem, was es vorfindet.

> Sprechnotiz: Der Bestand ist damit keine Altlast mehr, sondern eine Vorlage, die sich selbst vervielfältigt.

---

## 2 · Warum ein Styleguide dafür nicht reicht

**Ein dokumentierter Wert ist eine Bitte. Ein Gate ist eine Zusage.**

> *„Anything you put in a doc is a probability, not a guarantee."* — Polar „Orbit“

Ob eine Regel aus dem Dokument befolgt wird, hängt davon ab, ob jemand die Seite gelesen hat, ob sie im Kontextfenster lag, ob das Modell sie höher gewichtet als die Gegenbeispiele direkt daneben im Code.

**Die Umkehrung:** Nicht dokumentieren, was richtig ist — sondern dafür sorgen, dass alles andere gar nicht erst durchkommt.

| | Styleguide | Design System mit Leitplanken |
|---|---|---|
| Wirkung | Empfehlung | die einzige ausdrückbare Form |
| Durchsetzung | Aufmerksamkeit | CI |
| bei Abweichung | fällt vielleicht auf | bricht den Build |

> Sprechnotiz: Das nützt Menschen genauso wie Modellen. Niemand hat im entscheidenden Moment die Regelseite vor Augen — der Build schon.

---

## 3 · Die eine Regel, die für jede Entscheidung gilt

**Der Bestand ist kein Maßstab.**

Dass ein Wert 48-mal im Stylesheet steht, belegt nicht, dass er gut ist. Es belegt, dass niemand entschieden hat — und dass 47 Komponenten von der ersten abgeschrieben haben.

**Der Ablauf ist deshalb immer derselbe:**

1. **Inventar** — auszählen, was tatsächlich im ausgelieferten CSS steht
2. **Befund** — das Muster benennen, nicht die Einzelwerte
3. **Entscheidung** — *gegen* den Befund, nicht aus ihm
4. **Gate** — die Regel maschinell prüfbar machen

> Sprechnotiz: Die erste Fassung der Typo-Skala lief genau in diesen Fehler — 14 px stand 48-mal im CSS, also wurde 14 px zum Fließtext. Sie wurde verworfen und neu entschieden.

---

## 4 · Ausgangslage in drei Zahlen

**Gemessen am ausgelieferten Stylesheet, nicht geschätzt.**

| | |
|---|---|
| **17** | verschiedene Schriftgrößen — für zwei Arbeitsgrößen, die wir brauchen |
| **5** | Mechanismen, einen Fokusrahmen zu zeichnen — für eine Sache |
| **1,13** | Kontrast von Text auf Fläche im Dunkelmodus — Weiß auf Fast-Weiß, gefordert 4,5 |

Dahinter ein einziges Muster: **ein Token, mehrere Aufgaben — und die schwächste Anforderung gewinnt.** Eine Linie, die Tabellenzeilen trennt, umrandet auch Eingabefelder. Kein einziges Feld erfüllte die Norm.

> Sprechnotiz: Zehn Kontrastverstöße, keiner davon vorher bekannt. Drei unabhängige Fehler, eine Ursache — deshalb ist die Antwort eine Regel, kein korrigierter Wert.

---

## 5 · Zwei Schichten — und die Stelle für Kundenprojekte

**Werte und Bedeutungen sind getrennt. Ein Wert steht genau einmal.**

| Schicht | Beispiel | Regel |
|---|---|---|
| **Primitive** | `--tl-blue-49: #0B5ED7` | reine Werte, keine Rolle im Namen |
| **Rollen** | `--tl-surface-brand: var(--tl-blue-49)` | Bedeutung, kein einziger Wert |

Eine Klasse liest nur Rollen. Eine Rolle liest nur Primitive. Ein Wert in der Rollenschicht bricht den Build.

**Das ist mehr als Ordnung — es ist die Eingriffsstelle für Kunden.** Wer seine Hausfarbe einsetzen will, überschreibt ein Primitiv; alle Rollen der Marke ziehen mit, ohne dass eine Klasse angefasst wird. Mehrere Themes in einer Anwendung, der Nutzer wählt — TopLogic bleibt daneben stehen.

> Sprechnotiz: Der erste Entwurf schrieb Hex-Werte direkt an die Rollen — und reproduzierte genau den Fehler, den er beseitigen sollte. Ein Test spielt den Kundentausch heute durch.

---

## 6 · Farbe: Rolle statt Wert

**Niemand schreibt eine Farbe. Man nennt, wofür sie ist.**

* **Marke** — ein Blau, klarer als heute, ausdrücklich vorläufig. Der Wechsel kostet einen Wert; Rampe, Beschriftung und Prüfung sind abgeleitet.
* **Vier Bedeutungen** — Fehler, Warnung, Erfolg, Info — mit je vier Rollen: Text, Linie, Fläche, getönter Streifen. 16 Werte je Modus, alle gerechnet.
* **Acht Kategorien, deren Bedeutung die Anwendung festlegt** — Projektfarben, Diagrammreihen, Avatare. Die Farbe selbst sagt nichts; wer Rot meint, nimmt `error`.
* **Vier Rahmenstufen**, jede mit genau einer Aufgabe: trennen, begrenzen, hervorheben, Marke tragen.
* **Beschriftung auf Flächen wird gerechnet, nie geschrieben.** Erfolg bekommt dunkle Schrift, weil das Weiß von heute die Norm verfehlte.

> Merksatz: *Eine Linie, die trennt, ist ein Separator. Eine Linie, die etwas umschließt, worauf der Zeiger wirkt, ist ein Control-Rahmen.*

---

## 7 · Hell und dunkel: zwei Paletten, nichts wird geerbt

**Alle acht Dunkel-Verstöße waren Vererbungsfehler** — jemand überschrieb 36 Werte und übersah den siebenunddreißigsten.

Deshalb ist Dunkel eine **zweite vollständige Palette**. Jede Rolle hat je Modus ihren Wert, und das Kontrast-Gate läuft über beide.

**Elevation: Fläche plus Schatten.**

| | hell | dunkel |
|---|---|---|
| Höhe wird getragen von | dem **Rahmen** | der **Fläche** |
| Schatten | nur was schwebt | nur was schwebt |

> Sprechnotiz: Eine Tabellenzeile schwebt nicht. Heute trägt sie einen Schatten.

---

## 8 · Schrift, Maße, Dichte — ein Raster

**Zwei Arbeitsgrößen statt siebzehn. Untergrenze 12 px, ausnahmslos.**

* **Schrift:** `label` 12 px, `body` 14 px, drei Überschriften, eine Display-Größe. Neun Klassen legen Familie, Größe, Gewicht und Zeilenhöhe zusammen fest — eine Größe allein ist keine Klasse.
* **Abstände:** 4 · 8 · 12 · 16 · 24 · 32 · 48 px. Alles durch vier teilbar; Zeilenhöhen und Control-Höhen liegen auf demselben Raster.
* **Dichte:** zwei Stufen. Eine Tabelle wird eng, indem Luft verschwindet — nicht indem Text schrumpft.
* **Leisten:** Reiter und Toolbar sind gleich hoch, 40 px. Eine Höhe für alles, was eine Leiste ist; vorher war die Reiterleiste die engste Stelle im Rahmen.
* **Radius:** Was bedient wird, bekommt 4 px. Was umschließt, 8 px. Pille und Kreis sind Formen, keine Stufen.
* **Einheiten:** Was mit der Schrift skaliert, steht in `rem`. Linien bleiben Pixel.

> Sprechnotiz: 13 px fällt weg — der Unterschied zu 14 ist unsichtbar, kostet aber in jeder Komponente eine Entscheidung.
>
> Sprechnotiz: Hilfe flüstert. Das Fragezeichen am Feld ist ein Umriss in Sekundärfarbe; laut wird es erst unter dem Zeiger.

---

## 9 · Fokus und Bewegung: einer statt fünf

**Fokus: ein Ring.** Zwei Pixel, zwei Pixel Abstand, nur bei Tastatur.

* Der Abstand ist kein Detail: An der Kante wäre ein blauer Ring auf einer blauen Schaltfläche unsichtbar.
* Wer klickt, weiß, wo er ist. Bisher zeigten 36 von 64 Stellen den Ring auch bei der Maus.
* `outline: none` bricht den Build. 22 Stellen im Bestand hatten keinen Fokus mehr.
* Ein abgeschnittener Ring bricht ihn auch: ein Test fokussiert im Browser jedes Element jeder Beispielseite und misst, ob ein Behälter den Ring kappt. Er fand die leere Tabelle — ihr Fokus war unsichtbar. Was bündig an einer Kante sitzt, trägt den Ring jetzt innen.
* Zeigen ist nicht Fokus: Kästchen, Radio und Schalter zeigen unter dem Zeiger einen halo bis zur Trefferfläche — auch, wenn man nur über das Label fährt. Durchscheinend: was darunter liegt — die Linie eines Schiebers — bleibt sichtbar, und der halo hebt sich auf jedem Grund gleich stark ab.
* Knöpfe im Feld — Löschen, Link öffnen, der Pfeil des Select, der Kalenderknopf — zeigen eine Stufe kräftiger: auf der Feldfläche war das gewöhnliche Zeigen hell unsichtbar (1,01). Ein Quadrat, eine Fläche, wie jeder Icon-Knopf; das ✕ im Chip nimmt die kräftigste Stufe, weil es auf der getönten Pille liegt.

**Bewegung: drei Dauern, drei Kurven, ein Schalter.**

* Die Regel ist die Fläche, nicht die Wichtigkeit: je mehr Pixel sich bewegen, desto länger darf es dauern.
* Was erscheint, bremst ab. Was verschwindet, beschleunigt weg.
* Ein globaler Schalter für Nutzer, die weniger Bewegung wünschen — heute berücksichtigte das eine von 13 Animationen.

---

## 10 · Wie eine Komponente ins System kommt

**Drei Komponenten, eine Regel: Rolle statt Wert.**

| | vorher | nachher |
|---|---|---|
| **Button** | drei Erscheinungen, gedrückt als Klasse, fünf Kontextregeln von außen, nichts für Löschen | vier Erscheinungen, eine Tönung `danger`; Zustände sind Attribute; der Container wählt |
| **Pill** | eine Farbe aus dem Modell, im Stylesheet gemischt — Kontrast als Zufall | eine **Rolle** aus geschlossener Liste; zwei Tokens je Rolle, gewöhnlicher Text darauf |
| **Avatar** | ein Farbwert aus dem Namen gerechnet, als Inline-Style, 9-px-Initialen | eine **Kategorie** aus dem Namen; dieselben Tokens wie die Pill, nichts unter 12 px |

Jede Komponente geht denselben Weg: CSS ins Paket, Klassen umbenennen, Zustände auf Attribute, Specimen, Vertrag, Gate grün.

**Fertig ist eine Komponente, wenn ihr alter Block im alten Stylesheet leer ist.** Nicht, wenn die neue aussieht wie die alte.

> Sprechnotiz: Ein Avatar und eine Pill derselben Kategorie sehen gleich aus. Das ist kein Zufall, das ist die Palette.

---

## 10a · Gleiches wird zusammengelegt, nicht zweimal neu gebaut

**Die neue Haut allein macht nichts gleich.** Die React-Controls sind analog zu den alten entstanden — jedes mit eigenem Verhalten.

| Was dasselbe tut | heute | morgen |
|---|---|---|
| **Popups** (Menü, Kontextmenü, Toolbar-Überlauf, Select) | acht eigene Positionsrechnungen; eines ragt aus dem Fenster, zwei folgen dem Scrollen nicht | **ein** Helfer: klappt um, bleibt im Fenster, folgt dem Scrollen |
| **Icon-Knöpfe** | acht Arten, Trefferflächen 22–32 px, vier Hover-Optiken | ein `tl-button--icon`, 32 px, ein Hover |
| **Fokus** | vier Zeichnungen, zwei Blautöne, Ring auch ohne Tastatur | ein Ring, nur bei Tastatur |
| **Auf-/Zuklappen** | sieben Zeichnungen in vier Zeichensätzen, derselbe Pfeil heißt „zu“ und „offen“ | ein Knopf, ein Pfeil, 24 px |
| **Ziehen und Ablegen** | fünf Implementierungen, fünf Markierungen, Lage dreimal anders gerechnet | zwei Rechner, **eine** Markierung — und Umsortieren auch mit Alt + Pfeil |
| **Laden und Leer** | vier Spinner, eine leere Tabelle ist eine leere Fläche | ein Fortschrittsbalken, „Keine Einträge“, Platzhalterzeilen beim Scrollen |
| **Kapseln** | Pille in der Kapsel, drei Höhen, Farben dreimal erzeugt | eine Kapsel, die Bedeutung als Attribut |
| **Dialoge** (Welle 4) | zwei Schichten, die Fotoaufnahme baut eine dritte; drei Hintergründe | **ein** Dialog: Fokus startet dort, wo Enter wirkt, bleibt drin und kommt zurück, Escape schließt von innen nach außen |
| **Kopfzeilen und ihre Knöpfe** | sechs Kopfzeilen, sieben Knopf-Eigenbauten in 28–40 px, das Kreuz dreimal von Hand gezeichnet | eine Titelleiste, Knöpfe 24 px mit Namen und Tooltip |
| **Meldungen** | Snackbar und Systemhinweis voll gefärbt mit Weiß/Schwarz, ein Fehler wird nur „höflich“ angesagt | getönte Alerts: dieselben Farben, ein Fehler unterbricht, alles andere nicht |
| **Navigation** (Welle 4b) | zwei Schubladen, ein Flyout mit eigener Lagerechnung, drei Eintragsformen, die aktuelle Seite nur als Klasse; der Breakpoint zweimal | **eine** Schublade mit Fokus und Escape, das Flyout ist das Menü, ein Eintrag; „hier bist du“ für Auge und Screenreader |
| **Behälter** (Welle 4c) | vier Kopfformen, drei Kartenflächen, zwei Abstandsskalen mit denselben Namen, ein Teiler nur für die Maus | **ein** Kopf, **eine** Karte, die sich in einer Fläche selbst eine Stufe hebt, **eine** Skala — und jeder Teiler mit der Tastatur |

Vor jeder Welle: Was tut dasselbe? Prognose auf den Tisch, Entscheidung, dann die Spec. Gebautes wird mitgeprüft.

> Sprechnotiz: Konsolidieren ist der Teil, den ein Styleguide nie erzwingt — er sieht Farben, nicht Verhalten.
>
> Sprechnotiz (Welle 3b): Die Tabelle wird ein echtes Raster für Screenreader und folgt der Dichte — kompakt sind die Zeilen 32 statt 36 px, weil der Browser die Höhe misst, nicht der Server.
>
> Sprechnotiz (09.10.): Der Fortschrittsbalken sagt seinen Namen einmal, nicht zweimal — die Beschriftung ist der Name, den Wert nennt der Balken selbst; zeigt sie nur „42 %“, heißt der Balken nach dem, was voranschreitet.
>
> Sprechnotiz (09.10.): Ein Lesewert bringt keine eigene Schrift mit, er nimmt die seines Ortes an — darum wird eine Gruppenzeile überall fett, auch mit Werten aus dem Modell.
>
> Sprechnotiz (Welle 3b, 07.10.): Ein Fehler bleibt sichtbar, auch in der markierten Zeile — Fehler- und Warnlinie halten dort jetzt den Mindestkontrast, ohne dass eine Farbe zwei Aufgaben bekommt.
>
> Sprechnotiz (Welle 3b, 07.10.): Was Kollegen parallel gebaut haben — halos, der runde Entfernen-Knopf, die Hinweisbox — wird nicht ein zweites Mal erfunden, sondern übernommen. Ein Knopf, eine Regel.
>
> Sprechnotiz (Welle 3b gebaut, 08.10.): Tabelle, Baum und Listen teilen sich Fokus, Ziehen und Suchen — fünf Helfer statt fünfzehn Fassungen; der Fokus geht nirgends mehr verloren.
>
> Sprechnotiz (Welle 4c, 16.10.): Panels benehmen sich wie Fenster — Doppelklick auf den Kopf maximiert, Escape holt zurück, ein Doppelklick auf den Teiler stellt die Aufteilung her. Und im dunklen Modus hebt sich eine Karte im Panel von selbst eine Stufe ab, ohne Schatten — und im Dialog sinkt sie nie ein, egal wie tief sie liegt. Der Teiler lässt sich jetzt auch mit der Tastatur verschieben. Eine ausgewählte Karte erkennt man am Haken, nicht nur an der Farbe des Rings — Fokus und Auswahl sind nicht mehr zu verwechseln.

> Sprechnotiz (Welle 5, 17.10.): Die letzte Welle räumt das alte Stylesheet ganz ab — in vier Teilen. Upload, Ziehen und Auswahlraster gibt es danach nur noch einmal: dieselbe Drop-Zone, dieselbe Einfügelinie, und jedes Raster lässt sich mit der Tastatur bedienen.

> Sprechnotiz (Welle 5b, 19.10.): Aufnehmen, Fotografieren, Hochladen — jeder Fehler wird jetzt angesagt, und eine Datei zu ziehen sieht überall gleich aus. Läuft die Aufnahme, ist der Knopf rot gefüllt wie am iPhone. Die Kamera öffnet als richtiger Dialog: Enter löst aus, Escape schließt. Wizard und Hintergrundjobs zeigen ihre Schritte in derselben Liste. Eingebettete Dokumente bleiben weiß wie Papier, auch im dunklen Modus, und der Druckknopf schwebt darüber.

> Sprechnotiz (Welle 5c, 19.10.): Kalender, Kanban und Dashboard gehen jetzt ohne Maus — Termine mit Pfeiltasten wählen, Karten und Kacheln mit Alt+Pfeil verschieben, und der Screenreader sagt die neue Position. „Hier ablegen“ sieht überall gleich aus, und die Kalenderfarben folgen dem Kundentheme, mit garantiert lesbarer Schrift. Gebaut (19.10.): die Tastatur kann genau, was die Maus kann — nicht mehr, aber auch nichts weniger. Ein gewählter Termin trägt seinen Ring in der Farbe seiner Schrift, damit er auf jeder Füllung sichtbar bleibt; Kanban-Karten liegen hell auf einer Mulde, im dunklen Modus wie im hellen. Beim Ziehen leuchtet die Spalte, und eine Linie zeigt, zwischen welche Karten die Karte fällt; Rot gibt es nur, wenn das Ablegen verboten ist. Alles in allem sind im alten Stylesheet nur noch knapp 200 Zeilen übrig.

> Sprechnotiz (Welle 5a, 17.10.): Farb- und Icon-Auswahl teilen sich jetzt ein Popup — es bleibt beim Scrollen am Feld, der Fokus kommt danach zurück, und Palette, Mischer und Icon-Raster gehen ohne Maus. Neu gestaltet werden sie im UI-Durchgang nach Welle 5. Der Screenreader sagt jetzt, welche Farbe gewählt ist, und jedes Popup bleibt im Fenster, statt oben herauszuragen.
>
> Sprechnotiz (Welle 4b, 16.10.): Wo bin ich? Die aktuelle Seite trägt dieselbe Fläche wie eine gewählte Zeile — auch eingeklappt, auch in einer zugeklappten Gruppe. Und auf dem Handy ist die Seitenleiste eine echte Schublade: Escape schließt, der Fokus kommt zurück.
>
> Sprechnotiz (Welle 4, 13.10.): Neunzehn Doppelungen im Gerüst gefunden, achtzehn werden zusammengelegt. Der Dialog bewegt sich jetzt aus dem Paket — Anwendungen dürfen die Bewegung überschreiben, müssen sie aber nicht mehr selbst bauen.

---

## 11 · Die Gates: was den Build bricht

**Die Regeln stehen nicht nur im Dokument — sie laufen als Tests, über hundert.**

| Gate | bricht bei |
|---|---|
| Schichten | einem Wert in der Rollenschicht, einem Primitiv ohne Leser |
| Kontrast | jedem Paar Text/Fläche unter 4,5, jeder Linie unter 3,0 — hell **und** dunkel |
| Farbton | zwei Bedeutungen, die sich zu ähnlich sehen |
| Raster | einer Schriftgröße unter 12 px, einer Zeilenhöhe neben dem 4-px-Raster |
| Klassen | jedem Literal, jedem `:focus` ohne `-visible`, jedem `outline: none` |
| Erzeugtes | jedem Unterschied zwischen Quelle und ausgeliefertem CSS — auch in der Engine: wer die Kopie dort von Hand ändert, bricht ihr Siegel und den Build |

> Sprechnotiz: Beim ersten Lauf widersprach das Inventar den von Hand gezählten Zahlen. Der Test dazu war grün und trotzdem falsch, weil er nur den Fall prüfte, den der Leser beherrschte. Deshalb sind alle Zahlen hier gemessen — und bleiben es.

---

## 12 · Die Ratsche: Altlast wird abgeschnitten, nicht übersetzt

**Keine Aliase alter Namen, kein Übergang. Alte Namen mit neuen Werten wären der Ort, an den niemand will.**

Das alte Stylesheet wird **je Block** gezählt. Kein Block darf wachsen. Ein abgeschnittener Block wird gestrichen — und ist damit der Fertig-Nachweis der Komponente.

| Alt | Neu |
|---|---|
| `layer-01` | `--tl-surface-layer` |
| `support-error` | `--tl-status-error-text` · `-border` · `-surface` · `-subtle` |
| `.tlReactButton--primary` | `.tl-button--primary` |
| `data-theme="dark"` | `data-tl-mode="dark"` |

Englisch, kebab-case, Präfix `tl`. **Der Namensraum `--tl` gehört dem Paket:** Außerhalb wird darin nichts definiert.

> Sprechnotiz: Wächst ein Block durch ein fremdes Ticket, wird er mit Vermerk gehoben — nicht die Datei. So bleibt sichtbar, wer was hinzugefügt hat.

---

## 13 · Was Kunden bekommen

**Drei Stufen, vom Regelfall zur Ausnahme.**

| Stufe | Der Kunde liefert | Das Paket tut |
|---|---|---|
| **A · Primitive** | Hausfarbe, Grauton, Schrift, Radius — eine kleine JSON | rechnet alles Fehlende: Rampen, Dunkel, getönte Flächen, Beschriftungen; prüft jedes Paar |
| **B · Rollen** | eigene Werte für einzelne Rollen — Radius auf 0, anderes Info | prüft danach erneut; der Kunde trägt die Rechnung |
| **C · Komponenten** | eine eigene React-Komponente unter dem TopLogic-Namen | liefert Zustand, Aktionen, Tokens und Attribute als Vertrag mit Konformitätstest |

**Was der Kunde schreibt, gilt. Was er nicht schreibt, wird gerechnet. Was gerechnet oder geschrieben wurde, wird geprüft.**

> Sprechnotiz: Heute muss ein Kunde für eine andere Hausfarbe elf Stellen überschreiben — und die vergessene zwölfte ist der Fehler im Dunkelmodus.

---

## 13a · Eine Hausfarbe, ein Befehl, ein Theme

Der Kunde schreibt eine JSON: seine Farbe, warm oder kühl, seine Schrift. `derive` rechnet den Rest — Hover, Dunkelmodus, acht Kategorien, die seiner Marke ausweichen, Beschriftungen, die lesbar bleiben. Heraus kommt eine Datei, die neben TopLogic steht und beim Update bleibt. Bringt er einen eigenen Styleguide mit, gilt der Styleguide; was unter WCAG liegt, steht als Hinweis in der Datei, nicht als Verbot.

**Was wir rechnen, erfüllt WCAG immer — notfalls schiebt `derive` den Wert um einen Helligkeitsschritt nach und sagt es. Was der Kunde liefert, wird gemeldet, nicht blockiert.**

> Sprechnotiz: `node tools/derive.mjs acme.primitives.json` — eine Datei rein, ein Theme raus, der Bericht steht im Dateikopf.

---

## 13b · Drei Kacheln: was der Kunde mitbringt, entscheidet

**Drei Wege, wie bei einer Preistafel. Komplexität steigt von links nach rechts, Garantie sinkt von links nach rechts, und jede Kachel hat genau einen Vertrag.**

| | **TopLogic mit eigener Marke** | **TopLogic mit eigenen Komponenten** | **Eigenes Frontend, headless** |
|---|---|---|---|
| Der Kunde bringt | seine Marke: eine JSON | seine Komponentenbibliothek — MBUI, MUI, was er will | sein Frontend |
| Oberfläche | TopLogic | TopLogic, Komponenten vom Kunden | vom Kunden |
| Wir garantieren | alles: Aussehen, Funktion, Gate | Funktion über den Vertrag; Aussehen ist seins | die API |
| Komplexität beim Kunden | klein | mittel | groß |

**Wähle die Kachel nach dem, was du mitbringst, nicht nach dem, was du willst.** Nichts oder eine Marke: links. Eine Komponentenbibliothek: Mitte. Ein Frontend-Team mit eigenem Stack: rechts. Links ist der Regelfall.

Einen vierten Weg gibt es nicht: Shell nutzen und den Draht ignorieren. Und es gibt keinen Schalter, der das UI-System abschaltet — „aus“ ist kein Zustand, den wir garantieren können.

> Sprechnotiz: Links ist nicht „wie ausgeliefert“ — Hausfarbe, Grau und Schrift über `derive` gehören zur kleinsten Stufe. Rechts ist keine Sackgasse — die Garantie endet an der API, sie fehlt nicht. Die Grenze liegt zwischen „hat einen Vertrag“ und „hat keinen“.

**Der Vertrag der Mitte hat zwei Hälften, und beide sind prüfbar.** Der Zustand kommt typisiert vom Server (`state.proto`, ein Schema für Java und TypeScript, der Build prüft es). Was die Komponente zurückschickt und was sie lesen soll, damit sie ins Bild passt, steht im Vertrag des Pakets, und ein Konformitätstest führt es aus — vor jedem Deploy des Kunden. Die Marke fließt in eine Richtung: von `derive` in die Rollen, von den Rollen in die fremde Bibliothek. Nie umgekehrt.

> Sprechnotiz: Das ist die Abstimmung mit Bernhards #29643 (Ersetzung, Zustandsschema, Beispielmodul) — wir übernehmen seine Mechanik, das Paket bleibt die Quelle der Werte.

---

## 14 · Der Weg: fünf Wellen

**Kleinste Bausteine zuerst, das Gerüst zuletzt. Gebaut wird überlappend, gemergt der Reihe nach — je Welle ein PR.**

| Welle | Komponenten | Stand |
|---|---|---|
| 0 | Primitive, Rollen, Grundklassen | steht |
| 1 | Button, Pill, Avatar, Progress, FontIcon | auf master |
| 2 | Felder, Checkbox, Select, Formular | auf master — ein Feldrahmen für alle; Fehler ist `aria-invalid`, dasselbe Attribut für Auge und Screenreader; ein deaktiviertes Feld zeigt nie einen Fehler; gewählt sieht überall gleich aus (Chip wie Kästchen); schreibgeschützt bleibt lesbar, nicht grau; Ratsche 7.252 → 5.994 Zeilen, zwölf alte Blöcke gestrichen |
| 3 | Tabelle, Baum, Menü, Toolbar, Reiter | Datendarstellung und Navigation: **3a** Menü, Toolbar, Reiter auf master; **3b** Tabelle, Baum und Spaltenwahl als Ebenen-Panel (PRs !1838, !1852) |
| 4 | Dialog, Fenster, Drawer, Snackbar, Shell | zwei PRs: **4a Overlays** (PR !1882) — ein Dialog, eine Titelleiste, Meldungen als Alerts; Ratsche 4.505 → 4.010 Zeilen, sieben alte Blöcke gestrichen; **4b Navigation** (Shell, AppBar, Sidebar, BottomBar) geplant — ein Breakpoint, die mobile Sidebar ein echter Drawer, die aktuelle Seite eine Fläche; **4c Behälter** (Panel, Karte, Wizard …) geplant — ein Kopf, eine Karte, eine Abstandsskala, Teiler mit Tastatur |
| 5 | Kalender, Farbwahl, Medien, Dashboard | fachlich, zuletzt |

Innerhalb einer Welle keine Reihenfolge — parallel ist möglich. Der Button ist die Vorlage für alle Muster.

> Sprechnotiz: Nebenbei fallen Dinge, die niemand angefordert hat: ein Tree-Umschalter unter der Mindesttrefferfläche, 22 fehlende Fokusringe, der Schatten auf der Tabellenzeile.

> Sprechnotiz (12.10., Sichtprüfung): Zeigen muss man sehen — auch auf der Feldfläche. Kapsel und Segment rücken dort eine Stufe vor wie die Knöpfe im Feld. Und eine Liste mit Suche hat genau einen Scrollbereich; die Spaltenwahl wird ein Ebenen-Panel wie in Figma: Griff vorn, Auge und Schloss rechts beim Zeigen, später benannte Spaltengruppen. Blass heißt dort nicht „deaktiviert“: eine ausgeblendete Spalte bleibt bedienbar, also bleibt sie lesbar.

> Sprechnotiz (15.10., Review): Fixiert heißt vorerst sichtbar — wer eine fixierte Spalte ausblendet, löst sie; wer eine ausgeblendete fixiert, blendet sie ein. Der Dialog verspricht nichts, was die Tabelle vergisst. Unabhängig wie in Figma wird es, sobald die Tabelle sich ausgeblendete Spalten merkt (#29828).

> Sprechnotiz (15.10., Parts): Ein Knopf ist überall derselbe Knopf — auch für MUI. Bernhards Parts zeichnen jedes Atom an einer Stelle mit den Klassen des Pakets; eine Kundenbibliothek ersetzt es einmal und trifft alle Orte. Was er dafür neu brauchte, wohnt jetzt im Paket.

> Sprechnotiz (12.10.): Was man ziehen kann, muss man sehen — ein Griff beim Zeigen, und mit dem Zugbeginn leuchten die Ziele auf.

---

## 15 · Was das für den Alltag heißt

**Weniger Entscheidungen, mehr Sicherheit — für Menschen und Modelle.**

* **Man wählt eine Rolle, keinen Wert.** `surface-brand`, `status-error-text`, `space-md`. Ob der Wert stimmt, ist nicht mehr die Frage der Komponente.
* **Ein Knopf weiß, was er tut.** Löschen ist rot — als Knopf, im Menü, in der Rückfrage — weil die Aktion es sagt, nicht weil jemand eine Farbe gesetzt hat.
* **Zustände sind Attribute.** `disabled`, `aria-pressed`, `aria-busy` — das DOM weiß es ohnehin, und die Barrierefreiheit ist mit drin.
* **Ein Fehler bricht den Build, nicht das Review.** Wer ein Literal schreibt, erfährt es sofort.
* **Specimen statt Suche.** Jede Komponente zeigt sich in allen Zuständen, hell und dunkel, in beiden Dichten — an einem Ort.
* **Kunden erreichen jeden Wert an einer Stelle.** Was wir einmal entscheiden, gilt in jedem Theme.

> Sprechnotiz: Das Ergebnis ist kein Stilproblem weniger, sondern ein Qualitätsproblem weniger. Kontrastverstöße, unlesbare Zustände und Oberflächen, die auf jedem Rechner anders aussehen, sind Folgen derselben Lücke.

---

## Hinweise für die PowerPoint

| Folie | Bild |
|---|---|
| 1 | Screenshot einer bestehenden Maske, darüber eingeblendet die 17 Schriftgrößen als Liste |
| 2 | Zwei Spalten: Textseite eines Styleguides gegen eine rote CI-Meldung |
| 3 | Die vier Schritte als Pfeilkette; das 14-px-Beispiel als Randnotiz |
| 4 | Drei große Zahlen, darunter das Weiß-auf-Fast-Weiß-Beispiel als echtes Bild |
| 5 | Zwei Kästen übereinander (Primitive, Rollen), ein Pfeil vom Kunden auf das Primitiv |
| 6 | Specimen-Ausschnitt: Semantik-Streifen und die acht Kategorien als Pillen |
| 7 | Dieselbe Karte hell und dunkel nebeneinander |
| 8 | Die Typo-Probe aus dem Specimen (Grundklassen), daneben die Dichte-Umschaltung als Vorher/Nachher |
| 9 | Fokusring auf blauer Schaltfläche mit und ohne Abstand |
| 10 | Button-, Pill- und Avatar-Specimen als drei Kacheln; alt gegen neu |
| 11 | Ausgabe eines roten Gates, daneben die grüne Zusammenfassung |
| 12 | Die Blockliste der Ratsche mit einem gestrichenen Eintrag |
| 13 | Dieselbe Demo-App im TopLogic-Theme und mit Kundenprimitiv nebeneinander |
| 13b | Drei Kacheln wie eine Preistafel: links TopLogic-Maske mit Kundenfarbe, Mitte TopLogic-Layout mit fremden Komponenten darin, rechts ein fremdes Frontend mit Pfeil auf die API; darunter die Regel „nach dem, was du mitbringst“ |
| 14 | Die fünf Wellen als Zeitstrahl ohne Datumsangaben, Welle 0 und 1 markiert, Welle 2 als gebaut |
| 15 | Ein Zeilenausschnitt aus einer Komponente: nur Rollen, nur Attribute |

Specimen unter `node tools/serve.mjs` → `http://localhost:8137/`, Button, Pill und Avatar je mit Schalter für dunkel und kompakt.
