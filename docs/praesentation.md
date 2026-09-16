# TopLogic Design System — Präsentationsfassung

**Stand:** 2026-09-16 · Stufe A · Ticket #29108

Eine Folie je Abschnitt. Belege stehen in [`skalen.md`](skalen.md), Zahlen sind am echten Stylesheet gemessen, nicht geschätzt.

---

## 1 · Der Anlass

**Stellen Sie sich vor, jemand baut morgen eine neue Maske in TopLogic — und liest dafür zuerst, wie es die bestehenden machen.**

Er findet **17 verschiedene Schriftgrößen**. Er findet **fünf verschiedene Arten**, einen Fokusrahmen zu zeichnen. Er findet eine Farbe, die gleichzeitig Text, Rahmen, Fläche und Akzent ist.

Und dann trifft er eine Wahl. Sie wird plausibel aussehen, sie wird zum Nachbarn passen — und sie wird eine weitere Variante sein, die niemand entschieden hat.

**Dieser Jemand ist immer häufiger kein Mensch.** Oberflächencode entsteht zunehmend mit Sprachmodellen, und ein Modell tut genau das: Es liest den Bestand und ahmt ihn nach. Es wählt schnell, es wählt selbstsicher, und es wählt aus allem, was es vorfindet.

> Sprechnotiz: Der Bestand ist damit keine Altlast mehr, sondern eine Vorlage, die sich selbst vervielfältigt.

---

## 2 · Warum ein Styleguide dafür nicht reicht

**Der Ansatz folgt Polar „Orbit" — einem Design System, das für genau diese Lage gebaut wurde.**

> *„Anything you put in a doc is a probability, not a guarantee."*

Ein dokumentierter Wert ist eine Bitte. Ob sie befolgt wird, hängt davon ab, ob jemand die Seite gelesen hat, ob sie im Kontextfenster lag, ob das Modell sie höher gewichtet als die Gegenbeispiele, die im Code direkt daneben stehen.

**Die Umkehrung:** Nicht dokumentieren, was richtig ist — sondern dafür sorgen, dass alles andere gar nicht erst durchkommt.

| | Styleguide | Design System mit Leitplanken |
|---|---|---|
| Wirkung | Empfehlung | die einzige ausdrückbare Form |
| Durchsetzung | Aufmerksamkeit | CI |
| bei Abweichung | fällt vielleicht auf | bricht den Build |

> Quelle: [polar.sh/blog/orbit-llm-safe-design-system](https://polar.sh/blog/orbit-llm-safe-design-system)

---

## 3 · Was daraus für TopLogic folgt

**Leitplanken statt Empfehlungen — und das nützt Menschen genauso wie Modellen.**

1. **Jede Skala braucht ein Gate.** Eine Regel, die nur im Dokument steht, wird bei der nächsten Komponente umgangen — nicht aus Nachlässigkeit, sondern weil niemand sie im entscheidenden Moment vor Augen hat.
2. **Werte werden abgeleitet, nicht geschrieben.** Was gerechnet wird, kann nicht falsch abgeschrieben werden.
3. **Keine Fremdpaletten, keine Fallbacks.** Jeder Design-Wert in TopLogic wird an einer Stelle definiert. Ein hartkodierter Wert ist eine Stelle, die auch ein Kunde mit eigenem Theme nicht erreicht.

**Das Ergebnis ist kein Stilproblem weniger, sondern ein Qualitätsproblem weniger:** Kontrastverstöße, unlesbare Zustände und Oberflächen, die auf jedem Rechner anders aussehen, sind Folgen derselben Lücke.

> Sprechnotiz: Stufe A legt die Skalen fest. Stufe B setzt sie in der Anwendung um.

---

## 4 · Ausgangslage in Zahlen

**Gemessen an den beiden React-Stylesheets, die TopLogic ausliefert.**

| | Bestand |
|---|---|
| Schriftgrößen | 113 Deklarationen auf **17 verschiedenen Werten** |
| Schriftgewichte | 44 Literale, dahinter faktisch **2 Schnitte** |
| Radius | 4 Formen, dazu 2 Ausreißer |
| Fokus | **5 Mechanismen** für dieselbe Sache |
| Motion | 19 Übergänge, 13 Animationen, **0 Tokens** |
| Barrierefreiheit | 1× `prefers-reduced-motion` bei 13 Animationen |

> Sprechnotiz: Keine dieser Zahlen war vorher bekannt.

---

## 5 · Das wiederkehrende Muster

**Ein Token, mehrere Aufgaben — und die schwächste Anforderung gewinnt.**

| Token | Aufgaben | Folge |
|---|---|---|
| `border-subtle` | trennt Tabellenzeilen **und** umrandet Eingabefelder | **kein** Eingabefeld erfüllte WCAG 1.4.11 |
| `text-on-color` | Beschriftung auf heller **und** dunkler Fläche | strukturell unlösbar, kein Wert besteht beide |
| `support-warning` | Text, Rahmen, Fläche, Akzent | als Text **2,27** statt 4,5 |

> Sprechnotiz: Drei unabhängige Fehler, eine Ursache. Deshalb ist die Antwort eine Regel, kein
> korrigierter Wert.

---

## 6 · Was die automatische Prüfung fand

**Zehn Kontrastverstöße, keiner davon vorher bekannt.**

| Befund | gemessen | gefordert |
|---|---|---|
| `text-inverse` auf `background-inverse`, dunkel | **1,13** | 4,5 |
| Feldumrandung `border-subtle`, beide Modi | 1,70 / 1,63 | 3,0 |
| `support-warning` als Text, hell | 2,27 | 4,5 |
| `text-placeholder` auf `field`, hell | 2,04 | 4,5 |
| Snackbar-Erfolg, hartkodiertes `#fff` | 3,17 | 4,5 |

**1,13 heißt: Weiß auf Fast-Weiß.** Der Text war unsichtbar, nicht nur schlecht lesbar.

---

## 7 · Die eine Regel, die für jede Entscheidung gilt

**Der Bestand ist kein Maßstab.**

Dass ein Wert 48-mal im Stylesheet steht, belegt nicht, dass er gut ist. Es belegt, dass niemand entschieden hat — und dass 47 Komponenten von der ersten abgeschrieben haben.

**Der Ablauf ist deshalb immer derselbe:**

| Schritt | Was passiert |
|---|---|
| 1. Inventar | auszählen, was tatsächlich im ausgelieferten CSS steht |
| 2. Befund | das Muster benennen, nicht die Einzelwerte |
| 3. Entscheidung | **gegen** den Befund, nicht aus ihm |
| 4. Gate | die Regel maschinell prüfbar machen |

> Sprechnotiz: Die erste Fassung der Typo-Skala lief genau in diesen Fehler — 14 px stand 48-mal im CSS, also wurde 14 px zum Fließtext. Sie wurde verworfen und neu entschieden.

---

## 8 · Überblick: was entschieden ist

| Skala | Entscheidung |
|---|---|
| Marke | `#0B5ED7`, ausdrücklich vorläufig |
| Grundfläche | `#FAFAFA` statt Weiß |
| Neutrale | nach Anforderung gestuft, nicht nach gleichem Abstand |
| Rahmen | vier Stufen, jede mit genau einer Aufgabe |
| Semantik | vier Bedeutungen × vier Rollen |
| Dark | zweite vollständige Palette, nichts wird geerbt |
| Elevation | Fläche plus Schatten, drei Stufen |
| Typo | sechs Größen, neun Klassen, zwei Familien |
| Radius | zwei Stufen, zwei Formen |
| Fokus | ein Ring, außen, nur bei Tastatur |
| Motion | drei Dauern, drei Kurven, ein Schalter |

---

## 9 · Farbe: die Marke

**`#0B5ED7` — klarer als heute, ohne die Farbfamilie zu wechseln.**

| | heute | neu |
|---|---|---|
| Chroma | 0,163 | **0,200** |
| Kontrast als Linkfarbe | — | 5,84 auf Weiß, 5,59 auf `#FAFAFA` |

* Hellere Blautöne fielen als Linkfarbe durch (4,49 und 4,19).
* *Frisch wird ein Blau über Chroma, nicht über Helligkeit* — Chroma kostet keinen Kontrast, Helligkeit sofort.
* **Vorläufig, und das kostet nichts:** Rampe, Beschriftung und Prüfung sind abgeleitet. Der Wechsel ist ein einziger Wert.

---

## 10 · Farbe: Grundfläche und Rahmen

**Reines Weiß entfällt — `#FAFAFA` trägt eine Oberfläche, in der man stundenlang arbeitet.**

Die Rahmen bekommen vier Stufen, weil eine nicht reichen kann:

| Stufe | Verhältnis | Aufgabe |
|---|---|---|
| `border-separator` | ~1,5 | **trennt**, schuldet keinen Kontrast |
| `border-control` | ~3,0 | **begrenzt ein Bedienelement** — WCAG-pflichtig |
| `border-emphasis` | ~4,55 | **hebt hervor** |
| `border-interactive` | ~5,6 | **trägt die Marke** — Fokus, aktiver Zustand |

> Merksatz: *Eine Linie, die trennt, ist ein Separator. Eine Linie, die etwas umschließt, worauf der
> Zeiger wirkt, ist ein Control-Rahmen.*

---

## 11 · Farbe: Semantik

**Vier Bedeutungen — Fehler, Warnung, Erfolg, Info — mit je vier Rollen.**

| Rolle | Aufgabe | Zielkontrast |
|---|---|---|
| `text` | der Zustand als Text | 4,5 |
| `border` | die Linie, die ihn trägt | 3,0 |
| `surface` | gefüllte Fläche, Beschriftung **abgeleitet** | — |
| `subtle` | getönter Hinweisstreifen | trägt gewöhnlichen Text |

**16 Werte je Modus, alle gerechnet.** Das korrigiert nebenbei die Snackbar: Erfolg bekommt dunkle Schrift, nicht das hartkodierte Weiß mit 3,17.

---

## 12 · Dark und Elevation

**Dark ist eine zweite vollständige Palette. Nichts wird geerbt.**

Grund: Alle acht Dunkel-Verstöße waren Vererbungsfehler — jemand überschrieb 36 Werte und übersah den siebenunddreißigsten.

**Elevation: Fläche plus Schatten.**

| | hell | dunkel |
|---|---|---|
| Höhe wird getragen von | dem **Rahmen** | der **Fläche** |
| Schatten | nur was schwebt | nur was schwebt |

**Schatten bekommt ausschließlich, was über der Oberfläche liegt** — Popover, Dialog, Toast. Der Bestand verletzt das vierfach; `--shadow-raised` liegt heute auf Tabellenzeilen. Eine Tabellenzeile schwebt nicht.

---

## 13 · Typografie: die Entscheidung

**Zwei Arbeitsgrößen, nicht drei. Untergrenze 12 px, ausnahmslos.**

| Token | px | Aufgabe |
|---|---|---|
| `label` | 12 | Beschriftung, Spaltenkopf |
| `body` | 14 | alles Gelesene |
| `heading-sm/md/lg` | 16 / 20 / 24 | Abschnitt, Dialog, Seite |
| `display` | 32 | Login, Leerbild, Deckblatt |

* **13 px fällt weg** — der Unterschied zu 14 ist unsichtbar, kostet aber in jeder Komponente eine Entscheidung. Dichter wird eine Tabelle über die **Dichte**, nicht über kleinere Schrift.
* **Untergrenze 12 px** wegen BITV 2.0 und EN 301 549. Sieben Bestandswerte zwischen 9 und 11,52 px fallen darauf zusammen.
* Alle Zeilenhöhen liegen auf dem **4-px-Raster** — Typografie rastet in dasselbe Raster wie Abstände und Control-Höhen.

---

## 14 · Typografie: Klassen statt Größen

**Eine Größe ist keine Klasse.** Eine Klasse legt Familie, Größe, Gewicht, Zeilenhöhe, Laufweite und die Einsatzregel zusammen fest — sonst entscheidet jede Komponente das Gewicht neu, und genau so entstanden die 44 Literale.

**Neun Klassen** aus sechs Größen und zwei Gewichten. Mehr Gewichte gibt es nicht: Inter liefert nur Regular und SemiBold.

**Zahlen sind eine Eigenschaft, keine Klasse:** `tnum` und `zero` sind in Zahlenspalten **Pflicht**. Heute nutzt TopLogic `tabular-nums` genau zweimal — und nicht in der Datentabelle. Die Zahlenspalten fluchten also nicht, obwohl Inter das Merkmal mitbringt.

---

## 15 · Typografie: die Schriften

| | Stack |
|---|---|
| Text | `'Inter', ui-sans-serif, system-ui, 'Segoe UI', Roboto, sans-serif` |
| Code | `'JetBrains Mono', ui-monospace, SFMono-Regular, Consolas, monospace` |

**Beide lokal ausgeliefert.** TopLogic läuft in Installationen ohne Internetzugang — eine von außen nachgeladene Schrift ist ein Datenschutz- **und** ein Verfügbarkeitsproblem.

Zwei Bestandsfehler fallen damit:

* `font-family: 'Inter'` hatte **keinen Fallback**. Lädt Inter nicht, rendert TopLogic in Times.
* `font-family-mono: monospace` ist keine Entscheidung, sondern der Verzicht darauf — auf Windows also Courier New. Für eine Plattform mit TL-Script, XML und Stacktraces zu wenig.

**Der System-Font-Stack schied aus:** dieselbe Tabelle würde auf Windows, macOS und Linux verschieden breit. Ein System, das Maße als Tokens festlegt, verlöre seine Grundlage.

---

## 16 · Radius

**Zwei Stufen, zwei Formen — bewusst am zurückhaltenden Ende.**

| Token | Wert | Gilt für |
|---|---|---|
| `radius-sm` | 4 px | Feld, Schaltfläche, Reiter, Zelle |
| `radius-md` | 8 px | Karte, Dialog, Popover, Drawer |
| `radius-full` | Pille | Badge, Zähler, Umschalter |
| `radius-round` | 50 % | Avatar, Statuspunkt |

**Die Regel ist die Rolle, nicht die Größe:** Was bedient wird, bekommt `sm`. Was umschließt, bekommt `md`. Dieselbe Form wie die Rahmenregel — und dasselbe Niveau wie Carbon und Fluent, weil TopLogic in Konzernen im Tagesbetrieb steht.

---

## 17 · Fokus

**Der unordentlichste Teil des Bestands: fünf Mechanismen für dieselbe Sache.**

| Mechanismus | Stellen |
|---|---|
| `outline` | 29 |
| Inset-`box-shadow` | 8 |
| äußerer `box-shadow` (drei Breiten) | 7 |
| `border-color` | 5 |
| halbe Inset-Ringe | 5 |

**Neu: ein Ring. `outline` 2 px solid, Offset 2 px, nur `:focus-visible`.**

* Der **Offset** ist kein Detail: An der Kante wäre ein blauer Ring auf einer blauen Schaltfläche unsichtbar. Zwei Pixel Luft setzen ihn auf die Fläche dahinter.
* **Nur Tastatur** — wer klickt, weiß, wo er ist. Bislang zeigten 36 von 64 Stellen den Ring auch bei der Maus.
* **Offener Befund:** 22× `outline: none` ohne erkennbaren Ersatz — jeder ein Kandidat für einen vollständig fehlenden Fokus (WCAG 2.4.7).

---

## 18 · Motion

**Motion gab es schon — nur kein System: acht Dauern, vier Browser-Defaults, null Tokens.**

| Dauer | Wert | Gilt für |
|---|---|---|
| `fast` | 100 ms | Hover, Aktiv, Fokus |
| `base` | 150 ms | Normalfall |
| `slow` | 250 ms | Popover, Dialog, Drawer |

**Die Regel ist die Fläche, nicht die Wichtigkeit.** Je mehr Pixel sich bewegen, desto länger darf es dauern.

Drei eigene Kurven statt `ease`: **was erscheint, bremst ab — was verschwindet, beschleunigt weg.**

**Ein globaler Schalter für `prefers-reduced-motion`**, nicht je Komponente. Der Bestand zeigt, warum: 13 Animationen, davon sechs endlos laufend, und **eine** Stelle, die die Systemeinstellung berücksichtigt.

---

## 19 · Wie das geprüft wird

**Das Specimen — eine lauffähige Probe auf dem echten Stylesheet.**

* Kontrastrechnung über **23 Paare**, beide Modi, gegen die WCAG-Schwellen.
* OKLCH-Ableitung der Markenrampe samt Gamut-Mapping.
* Regler für Marke und Grundfläche: Ein Ton wird gewechselt, die gesamte Oberfläche und alle Prüfungen rechnen mit.
* Fragmente aus der **laufenden** Demo-Anwendung, nicht nachgebaut.
* 15 Tests.

> Sprechnotiz: Deshalb sind die Zahlen in dieser Präsentation gemessen und nicht geschätzt.

---

## 20 · Was noch offen ist

| Skala | Zu entscheiden |
|---|---|
| **Dichte** | wie viele Stufen, und was genau variiert |
| **Komponenten-Maße** | Control-Höhen — belegt nötig, nicht vermutet |
| Marke | wie viele Stufen die Rampe hat |
| Rahmen | die Breiten |

**Warum die Dichte mehr Gewicht trägt als geplant:** Die Typo-Entscheidung hat ihr die Zeilenhöhe und die Polsterung zugewiesen. Eine Tabelle wird eng, indem Luft verschwindet, nicht indem Text schrumpft.

**Und ein Beleg, dass Komponenten-Tokens nötig sind:** Bei 12, 13 und 14 px Schriftgröße misst die Tabellenzeile jeweils 33 px. Ursache ist ein Button mit `height: 2rem` — gekoppelt an die Wurzelschriftgröße, nicht an die der Tabelle. Eine Dichte, die nur Abstände und Schriftgrößen regelt, ändert an dieser Zeile nichts.

---

## 21 · Wie es weitergeht

**Stufe A** — die Skalen festlegen und am Specimen belegen. *Läuft, vier Punkte offen.*

**Stufe B** — die Skalen in der Anwendung umsetzen:

1. Die Paarliste des Java-Gates auf die des Specimens ziehen (sechs Umbenennungen, eine Ergänzung).
2. Die gefundenen Verstöße abräumen — Kontraste, 22× fehlender Fokus, `overflow: hidden` an Behältern mit fokussierbaren Kindern.
3. Die Tokens in Figma spiegeln, damit Design und Code dieselbe Quelle haben.
4. Kunden-Theming, Storybook und Accessibility als eigene Stränge (Issue #13).

> Sprechnotiz: Stufe A entscheidet, Stufe B räumt auf. Die Reihenfolge ist wichtig — aufräumen ohne
> Regel erzeugt denselben Zustand noch einmal.
