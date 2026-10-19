# TopLogic Design System — Überblick

**Stand:** 2026-10-19 · Version 2 der Präsentation

Vorlage für eine kurze PowerPoint für alle Kolleginnen und Kollegen, auch ohne Frontend-Hintergrund: **was das neue
Design System ist, wie es funktioniert und was es bringt.** Oberflächlich und leicht verständlich, eine Botschaft je
Folie, keine Komponentenliste. Die ausführliche Fassung mit allen Details bleibt als Backup in
[`praesentation.md`](praesentation.md); Entscheidungen und Belege stehen allein in [`skalen.md`](skalen.md).

---

## 1 · Worum es geht

**Ein gemeinsamer Baukasten für das Aussehen und Verhalten jeder TopLogic-Oberfläche.**

Farben, Schrift, Abstände, Knöpfe, Felder, Tabellen, Dialoge: Alles kommt aus einer Quelle. Wer eine Maske baut,
setzt sie aus diesen Bausteinen zusammen, statt jedes Detail neu zu erfinden.

> Sprechnotiz: Ein Design System ist für die Oberfläche, was eine Normteile-Bibliothek für den Maschinenbau ist.
> Niemand dreht seine Schrauben selbst.

---

## 2 · Warum wir es brauchen

**Bisher hat jede Stelle ihre eigene Lösung gebaut — und es sah man.**

* 17 verschiedene Schriftgrößen, wo zwei gebraucht werden
* fünf verschiedene Arten, das aktive Feld zu markieren
* im Dunkelmodus Schrift, die man kaum lesen konnte

Niemand hat das so entschieden. Jede neue Maske hat von der vorigen abgeschrieben — und heute schreibt immer öfter
eine KI ab, schneller und gründlicher als jeder Mensch.

> Sprechnotiz: Uneinheitlichkeit ist kein Geschmacksproblem. Sie kostet Zeit beim Bauen, beim Testen und beim
> Kunden.

---

## 3 · Die Grundidee: Bedeutung statt Farbe

**Niemand schreibt mehr „Rot“. Man schreibt „Fehler“.**

Eine Komponente sagt, *wofür* eine Farbe da ist: Hintergrund, Hinweis, Fehler, Marke. Welcher Farbton das ist,
entscheidet das Design System — an genau einer Stelle.

Ändert sich die Hausfarbe, ändert sich ein Wert, und die ganze Anwendung zieht mit.

> Sprechnotiz: Wie bei einer Ampel. Rot heißt „Halt“, egal welcher Hersteller die Lampe gebaut hat.

---

## 4 · Wie es funktioniert

**Zwei Ebenen: die Grundwerte und ihre Bedeutungen.**

1. **Grundwerte** — die Palette: Farbtöne, Maße, Schriften. Hier steht jeder Wert genau einmal.
2. **Bedeutungen** — „Fläche“, „Text“, „Fehler“, „Abstand mittel“. Sie zeigen nur auf Grundwerte.
3. **Bausteine** — Knopf, Feld, Tabelle. Sie lesen nur Bedeutungen.

Kundenprojekte greifen unten an: Sie tauschen Grundwerte aus. Alles darüber passt sich an.

> Sprechnotiz: Drei Stockwerke. Wer im Keller die Farbe tauscht, muss oben nichts streichen.

---

## 5 · Ein eigenes Paket, an einer Stelle gepflegt

**Das Design System lebt als eigenes Paket neben der Engine.**

* Es wird an einer Stelle entwickelt und geprüft, mit einer Musterseite, die jeden Baustein hell und dunkel zeigt.
* In die Engine kommt eine versiegelte Kopie. Wer sie von Hand ändert, bricht das Siegel, und der Build schlägt
  fehl.
* Das alte Stylesheet wird Baustein für Baustein abgeschnitten, nicht weiter gepflegt.

> Sprechnotiz: Es gibt genau eine Wahrheit. Abweichungen schleichen sich nicht ein, weil der Build sie nicht
> durchlässt.

---

## 6 · Leitplanken statt Regelwerk

**Eine Regel auf Papier ist eine Bitte. Eine automatische Prüfung ist eine Zusage.**

Bei jedem Build prüft das System selbst:

* Ist jede Schrift auf ihrer Fläche gut lesbar, hell und dunkel?
* Steht irgendwo ein frei erfundener Wert statt einer Bedeutung?
* Ist jedes Bedienelement mit der Tastatur erreichbar und sichtbar markiert?

Was nicht passt, kommt nicht durch — egal ob es ein Mensch oder eine KI geschrieben hat.

> Sprechnotiz: Niemand muss sich alle Regeln merken. Der Build merkt sie sich.

---

## 7 · Vorteil für Kunden: die eigene Marke mit einer Datei

**Der Kunde liefert seine Hausfarbe, seinen Grauton, seine Schrift. Den Rest rechnet das System.**

* Dunkelmodus, Hover-Farben, Farben für Kategorien und Diagramme: alles abgeleitet.
* Lesbarkeit ist garantiert: Wo die Hausfarbe zu hell oder zu dunkel wäre, gleicht das System selbst aus und sagt
  es.
* Bringt der Kunde einen eigenen Styleguide mit, gilt der Styleguide.

> Sprechnotiz: Früher waren es elf Stellen, die man für eine andere Hausfarbe anfassen musste — und die vergessene
> zwölfte war der Fehler im Dunkelmodus.

---

## 8 · Vorteil für Kunden: unabhängig von der Basisversion

**Das Kundenthem hängt nicht an einer TopLogic-Version.**

Der Kunde beschreibt nur seine Grundwerte, nicht einzelne Masken oder Klassen. Kommt eine neue TopLogic-Version mit
neuen oder überarbeiteten Bausteinen, tragen sie automatisch seine Marke. Sein Theme muss dafür nicht angepasst
werden.

* Kein Nachziehen von Stylesheets bei jedem Update
* Neue Komponenten sehen beim Kunden sofort richtig aus
* Mehrere Themes in einer Anwendung, der Nutzer wählt

> Sprechnotiz: Bisher hat ein Kundenprojekt alte Klassennamen überschrieben, und jedes Update konnte das
> zerbrechen. Jetzt gibt es einen festen Vertrag: die Grundwerte.

---

## 9 · Drei Wege, je nachdem, was der Kunde mitbringt

| | **Eigene Marke** | **Eigene Komponenten** | **Eigenes Frontend** |
|---|---|---|---|
| Der Kunde bringt | Farben und Schrift | seine Komponentenbibliothek (z. B. MUI) | sein ganzes Frontend |
| Wir garantieren | Aussehen und Funktion | die Funktion | die Schnittstelle |
| Aufwand beim Kunden | klein | mittel | groß |

**Der Regelfall ist links.** Die anderen Wege sind möglich, und jeder hat einen klaren Vertrag.

> Sprechnotiz: Man wählt den Weg nach dem, was man mitbringt, nicht nach dem, was man sich wünscht.

---

## 10 · Vorteil für Anwender

**Alles sieht gleich aus und verhält sich gleich.**

* Ein Knopf ist überall derselbe Knopf, ein Fehler überall derselbe Fehler.
* Hell und dunkel, normal und kompakt: auf Knopfdruck, ohne Lücken.
* Bedienbar mit der Tastatur und mit dem Screenreader, auch in Kalender, Kanban und Dashboard.
* Gute Lesbarkeit nach der Norm (WCAG), geprüft statt gehofft.

> Sprechnotiz: Barrierefreiheit ist nicht nachgerüstet. Sie steckt in jedem Baustein, weil der Baustein sie
> mitbringt.

---

## 11 · Vorteil für uns in der Entwicklung

**Weniger entscheiden, schneller bauen, weniger nacharbeiten.**

* Man wählt eine Bedeutung, keinen Wert. Die Frage „Welches Grau?“ stellt sich nicht mehr.
* Fehler fallen sofort im Build auf, nicht erst im Review oder beim Kunden.
* Eine Musterseite zeigt jeden Baustein in jedem Zustand, statt im Code zu suchen.
* Auch KI-Werkzeuge bauen richtig, weil es nur eine richtige Form gibt.

> Sprechnotiz: Weniger Varianten heißt weniger zu testen und weniger zu erklären.

---

## 12 · Wo wir stehen

**Schritt für Schritt umgebaut, Baustein für Baustein.**

In fünf Wellen kamen die Bausteine ins System: zuerst Knöpfe und Felder, dann Tabellen und Navigation, dann Dialoge
und Rahmen, zuletzt Kalender, Medien und Dashboard. Das alte Stylesheet ist von über 7.000 Zeilen auf unter 200
geschrumpft. Mit dem letzten Teil fällt es ganz weg.

Danach folgt ein Durchgang über die ganze Oberfläche: Bewegung, Feinschliff, das Ziel einer Oberfläche, die
begeistert.

> Sprechnotiz: Der Umbau ändert vor allem, was unter der Oberfläche liegt. Sichtbar wird er als Einheitlichkeit.

---

## Hinweise für die PowerPoint

| Folie | Bild |
|---|---|
| 1 | Ein Baukasten: einzelne Bausteine (Knopf, Feld, Tabelle), daraus zusammengesetzt eine Maske |
| 2 | Eine alte Maske, darüber die 17 Schriftgrößen als Liste |
| 3 | Eine Ampel neben einem Knopf „Löschen“ in Rot |
| 4 | Drei Stockwerke: Palette unten, Bedeutungen in der Mitte, Bausteine oben; ein Pfeil vom Kunden auf das untere |
| 5 | Die Musterseite (Specimen), daneben ein Siegel auf der Kopie in der Engine |
| 6 | Eine rote Build-Meldung neben einem grünen Haken |
| 7 | Dieselbe Maske im TopLogic-Theme und mit Kundenfarbe nebeneinander |
| 8 | Zeitstrahl mit drei TopLogic-Versionen, darunter durchgehend dasselbe Kundenthem |
| 9 | Drei Kacheln wie eine Preistafel |
| 10 | Dieselbe Maske hell, dunkel und kompakt |
| 11 | Ein Ausschnitt Code mit nur Bedeutungen, keinen Werten |
| 12 | Ein Balken, der von über 7.000 auf unter 200 Zeilen schrumpft |

Musterseite unter `node tools/serve.mjs` → `http://localhost:8137/`, jeder Baustein mit Schalter für dunkel und
kompakt.
