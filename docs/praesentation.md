# TopLogic Design System — Präsentationsfassung

**Stand:** 2026-09-17 · Welle 0 · Ticket #29617

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

## 19 · Abstände und Dichte

**Die Abstandsskala hatte ein Loch — zwischen 8 und 16 px lag nichts.** Genau dort stehen heute **18 literale Abstände**: 12 px sechsmal, 6 px siebenmal, dazu 10 und 5 px.

Neu: 4 · 8 · **12** · 16 · 24 · 32 · 48 px. Alle durch vier teilbar — Abstände, Zeilenhöhen und Control-Höhen liegen damit auf **einem** Raster.

**Dichte: zwei Stufen. Die Schriftgröße bleibt in beiden gleich.**

| | Standard | Kompakt |
|---|---|---|
| Control-Höhe | 32 px | 28 px |
| Tabellenzeile | 36 px | 32 px |
| Polsterung | 12 / 8 px | 8 / 4 px |
| Schrift | 12 / 14 px | **12 / 14 px** |

*Eine Tabelle wird eng, indem Luft verschwindet — nicht indem Text schrumpft.*

**Der Bestand hatte schon drei Dichten** — je eine in Stack, Grid und Card, keine davon wirkt auf die anderen. Eine Maske mit allen dreien steht nach dem Umschalten in drei verschiedenen Dichten.

---

## 20 · Eine Einheitenregel für alles

**Was mit der Schrift skalieren soll, steht in `rem`. Linien stehen in `px`.**

| | Einheit |
|---|---|
| Schriftgrößen, Abstände, Polsterung | `rem` |
| Control- und Zeilenhöhen, Radius | `rem` |
| Rahmenbreite, Fokusring und -offset | `px` |

**Warum das zählt:** Wer die Browserschrift auf 20 px stellt, tut das, weil er es braucht. Eine in `px` festgelegte Oberfläche ignoriert das — die Schrift wächst, die Luft nicht, und es wird enger statt lesbarer.

Umgekehrt soll eine 1-px-Trennlinie eine Linie bleiben und nicht bei großer Schrift zu 1,25 px werden, die der Bildschirm unsauber rastert.

> Sprechnotiz: Jeder `rem`-Wert im System ist ein glattes Sechzehntel — bei Standardeinstellung also ein ganzes Pixel.

---

## 21 · Die letzten beiden Skalen

**Rahmenbreiten: zwei.** 1 px ist der Regelfall, 2 px markiert Aktives und Betontes. Die `1.5px` aus dem Bestand fällt ersatzlos — ein halbes Pixel rastert auf keinem Bildschirm sauber.

**Und ein breiter Balken ist kein Rahmen:** Die `0.4rem` und `0.65rem` im Bestand sind farbige Akzentbalken an Karten und Hinweisen. Sie tragen eine Bedeutung, sie umranden nichts — und bekommen deshalb eine eigene Rolle.

**Die Marke bekommt keine Stufen, sondern zwei fehlende Rollen:** `brand-subtle` und `brand-subtle-hover` für markig getönte Flächen — aktiver Navigationspunkt, ausgewählter Reiter, getönter Streifen.

| gemessen | hell | dunkel |
|---|---|---|
| Text auf `brand-subtle` | 15,71 | 14,35 |
| Linktext darauf | 4,86 | 5,29 |

**Eine volle Rampe mit zehn Stufen schied aus.** Die Hälfte hätte keine Aufgabe — und ein Token ohne Aufgabe ist genau die Beliebigkeit, die das System abstellen soll.

---

## 22 · Ein Befund, und ein falsches Maß

**Marke und Info sahen gleich aus** — ein markig getönter Reiter und ein Info-Hinweis, hell wie dunkel nicht zu unterscheiden.

**Zuerst war das Maß falsch gewählt.** Notiert stand ein Kontrastverhältnis von 1,06 — daraus lässt sich nichts schließen, denn **das WCAG-Verhältnis misst Helligkeit.** Zwei gleich helle Flächen kommen immer auf rund 1,0, auch blau gegen orange. Der Gegencheck machte es sichtbar: Ein deutlich anders aussehender türkiser Kandidat kam auf 1,02 — einen noch kleineren Wert.

Das richtige Maß ist der **Farbtonabstand**:

| | ΔH |
|---|---|
| Marke ↔ Info, vorher | **1,5°** |
| Info ↔ Erfolg | 96,8° |
| Marke ↔ Info, **jetzt** | **48,5°** |

**Info wandert ins Türkise** und bleibt damit kühl, ohne mit der Marke zu kollidieren.

**Und das Gate bekommt eine Regel mehr:** Getönte Flächen verschiedener Bedeutung müssen mindestens 30° im Farbton auseinanderliegen.

> Sprechnotiz: Das war kein falscher Wert, sondern eine fehlende Prüfung — genau der Unterschied, um den es in diesem Projekt geht.

---

## 23 · Icons — und ein Verstoß, der dabei auffiel

**Icons sind Font-Glyphen: Ihre Größe ist eine `font-size`.** Ohne Regel ist ein Icon so groß wie der Text, neben dem es zufällig steht. 22 Deklarationen auf acht Werten — und drei Ladeanzeigen messen **14, 20 und 24 px**, weil keine der drei Komponenten von den anderen wusste.

| Stufe | px | Gilt für |
|---|---|---|
| `sm` | 16 | Text daneben — der Regelfall |
| `md` | 20 | kein Text daneben, das Icon ist das Bedienelement |
| `lg` | 24 | nicht bedienbar, eine Aussage |
| `glyph` | 12 | Richtungszeichen **im** Control (geschlossene Liste) |

> *Ein Zeichen, das etwas benennt, ist ein Icon. Ein Zeichen, das eine Richtung anzeigt, ist ein Glyph.*

**Der eigentliche Fund ist ein anderer:** `.tlTableView__treeToggle` ist **20 × 20 px** und unterschreitet damit die 24 CSS-Pixel aus **WCAG 2.5.8**. Zwei andere Umschalter mit derselben Aufgabe haben 24 px — drei Komponenten haben je für sich entschieden, und eine hat falsch entschieden.

**Die Lösung ist kein Wert, sondern ein Mechanismus:** Die Trefferfläche bekommt kein Icon-Token, sondern eine **Control-Höhe** aus der Dichte. Die kleine liegt bei genau 24 px — solange eine Icon-Schaltfläche eine nimmt, kann sie die Norm nicht verfehlen.

> Sprechnotiz: Der einzige Verstoß im Bestand ist genau der, der keine Control-Höhe nimmt.

Die vier Stufen stehen als Klassen `.tl-icon-glyph|sm|md|lg` in `base.css`; `font-size` ist nur dort erlaubt.

---

## 24 · Zwei Schichten — und die Stelle für Kundenprojekte

**Der erste Entwurf schrieb Hex-Werte direkt an die Rollen — und reproduzierte genau den Befund, den er beseitigen sollte.**

| Wert | Rollen, die ihn als Literal trugen |
|---|---|
| `#0B5ED7` | `border-interactive`, `focus-ring`, `surface-brand`, `text-link` |
| `#FFFFFF` | `surface-layer`, `surface-layer-nested`, `surface-overlay` |

Bei einem Markenwechsel wären vier Stellen nachzuziehen — und die vergessene fünfte wäre der Vererbungsfehler, der die acht Dunkel-Verstöße erzeugt hat.

| Schicht | Beispiel | Regel |
|---|---|---|
| **1 · Primitive** | `--tl-blue-49: #0B5ED7` | reine Werte, **keine** Rolle im Namen |
| **2 · Rollen** | `--tl-surface-brand: var(--tl-blue-49)` | Bedeutung, **kein einziger Wert** |

**Das ist mehr als Ordnung — es ist die Eingriffsstelle für Kundenprojekte.** Wer seine Hausfarbe einsetzen will, überschreibt `--tl-blue-49`; alle vier markenbezogenen Rollen ziehen mit, ohne dass eine Klasse angefasst wird. Deshalb löst das erzeugte CSS die Referenzen **nicht** auf.

> Sprechnotiz: Ein Test spielt genau diesen Tausch durch — das ist die Zusage an Kundenprojekte, in ausführbarer Form.

---

## 25 · Wie das geprüft wird

**Die Regeln stehen nicht nur im Dokument — sie laufen als Tests.** 79 Stück, `node --test` im Paket.

| Datei | Was sie durchsetzt |
|---|---|
| `src/primitives.json`, `src/tokens.json` | der entschiedene Soll-Zustand, zweischichtig |
| `tools/generate.mjs` | erzeugt daraus `primitives.css`, `tokens.css`, `base.css`, `tokens.dtcg.json` |
| `test/tokens.test.mjs` | Kontraste, Farbabstände, das 4-px-Raster, die 12-px-Untergrenze |
| `test/layers.test.mjs` | kein Wert in der Rollenschicht, keine Primitive ohne Leser, geschlossene Kategorien, der Kundentausch |
| `test/lint-css.test.mjs` | das Klassen-Gate: kein Literal, kein `:focus`, kein `outline: none`, nur Tokens |
| `test/ratchet.test.mjs` | kein Block des alten Stylesheets darf wachsen; ein abgeschnittener wird gestrichen |
| `test/dist.test.mjs` | `dist/` ist byte-identisch mit dem Erzeugnis aus `src/` |

**Ein Beispiel dafür, warum das nötig ist:** Beim ersten Lauf widersprach das Inventar den von Hand gezählten Zahlen — 14 px kam auf 7 statt 48. Ursache war ein zu enger Leser der Theme-Konfiguration. **Der Test dazu war grün und trotzdem falsch**, weil er nur den Fall prüfte, den der Leser beherrschte.

> Sprechnotiz: Deshalb sind die Zahlen hier gemessen und nicht geschätzt — und bleiben es, weil ein eigener Test sie gegen das echte Stylesheet hält.

---

## 26 · Stufe A ist am Ziel

**Alle elf Skalen sind entschieden und begründet.**

| | |
|---|---|
| Farbe | Marke, Grundfläche, Neutrale, Semantik, Rahmen |
| Struktur | Dark, Elevation, Radius, Abstände, Dichte |
| Text und Verhalten | Typografie, Fokus, Motion |

**Was offen bleibt, ist genau ein Punkt** — und er lässt sich nicht am Schreibtisch klären, sondern nur am Bild: die Abgrenzung von Marke und Info.

> Sprechnotiz: Der Markenton selbst kann sich noch ändern, sobald die Tokens in Figma liegen. Das kostet nichts — Rampe, Beschriftung und Prüfung sind abgeleitet, der Wechsel ist ein Wert.

---

## 27 · Die Skala am echten Material — und was dabei auffiel

**Dieselben Fragmente aus der laufenden Anwendung, zweimal:** links das heutige Theme, rechts die Skala.

Damit das geht, nimmt die Skala den Rückweg — das ausgelieferte Stylesheet kennt nur die heutigen Tokennamen. **Der Umweg ist die Probe:** Was sich nicht zurückführen lässt, ist eine Änderung am Stylesheet, keine an der Skala.

**Der Befund:** Von den zwölf mehrdeutigen Tokens sind nur neun eine Wahl.

| Natur | Anzahl | Was zu tun ist |
|---|---|---|
| Alternative | 9 | An jeder Stelle gilt genau eines. Die Regel entscheidet. |
| **Aufteilung** | **3** | An derselben Stelle gelten **beide gleichzeitig** — hier ist nichts zu wählen. |

Die drei sind die Umriss-Schaltfläche: Ein Token trägt heute ihre Linie **und** ihre Beschriftung. Mit `border-control` wird die Schrift grau, mit `surface-brand` verliert die Linie ihren Kontrast. **Beides ist falsch** — erst getrennte Tokens im Stylesheet lösen es.

> Sprechnotiz: Das ist der Wert der Ansicht. Auf dem Papier sah der Eintrag aus wie die anderen elf. An der Fläche war in zwei Sekunden zu sehen, dass dort gar keine Entscheidung ansteht, sondern eine Aufgabe.

---

## 28 · 131 Stellen, 0 offen

**Die Abbildung entscheidet je Token. Bei den mehrdeutigen entscheidet erst die Stelle.**

Das ausgelieferte CSS liest die zwölf mehrdeutigen Tokens an **131 Stellen**. Jede trägt jetzt eine Entscheidung, und ein Test hält fest, dass keine ohne bleibt.

| | |
|---|---|
| 131 Lesestellen | **129 zugeordnet · 2 zweckfremd · 0 ohne Entscheidung** |
| `border-subtle` | 51 trennen → `border-separator`, **14 werden bedient → `border-control`** |
| Semantikfarben | 26 — allein die Eigenschaft entscheidet: `color`, `border`, `background` |

**Der Einzelfund, der Stufe B am meisten spart:** Der Bestand baut die Umriss-Schaltfläche an 25 Stellen nicht mit `border`, sondern mit `box-shadow: inset 0 0 0 2px`. Damit wird die Aufteilung **mechanisch** — eine Ersetzungsregel statt 25 Einzelfallentscheidungen.

**Dreimal war die Regel am Schreibtisch zu eng:** `border-subtle` kannte den umschließenden Rahmen um etwas *Unbedientes* nicht (Karte, Popover, Ladering). `button-danger` hatte keine Linie. `layer-accent` stand an keiner der Stellen, für die die Regel gemacht war.

> Sprechnotiz: Zwei Stellen sind als zweckfremd vermerkt statt in die Regel gebogen. Für beide steht ein Vorschlag daneben, und der Test verlangt ihn. Eine Regel, die überall passt, hat meist aufgehört, etwas zu behaupten.

---

## 29 · Der Schnitt

**Der Rückweg ins alte Stylesheet war reparierbar — aber er führte an einen Ort, an den niemand will: alte Namen mit neuen Werten.**

Die Prüfung vor der Ersetzung fand drei Lücken: Die Abbildung deckte nur die Farbschicht, 31 gelesene Maß-, Schatten- und Typo-Tokens hatten kein Ziel. Die gerechneten Beschriftungen existierten nicht als CSS. Und die Skala schrieb Attribute, die die Anwendung nicht setzt.

**Entschieden:** Altlasten abschneiden, nicht übersetzen. Die Skalen bleiben, das Ziel wird ein eigenes Paket, die Namen werden neu.

| Alt | Neu |
|---|---|
| `layer-01` | `--tl-surface-layer` |
| `support-error` | `--tl-status-error-text` · `-border` · `-surface` · `-subtle` |
| `button-primary` | `--tl-surface-brand` |
| `.tlReactButton--primary` | `.tl-button--primary` |
| `data-theme="dark"` | `data-tl-mode="dark"` |

Englisch, kebab-case, Präfix `tl`, BEM für Klassen, geschlossene Kategorien für Tokens. Zustände als Attribute, nicht als Klassen.

> Sprechnotiz: Was die Abbildung gefunden hat, ist nicht verloren — es steht als Arbeitsliste in `docs/migration/altlast.md`. Die Werkzeuge dahinter sind gelöscht.

---

## 30 · Welle 0 steht

**Das Paket `@toplogic/design-system` liefert, was jede Klasse liest.**

| | |
|---|---|
| `primitives.css` | 125 Zeilen — Werte, die Stelle für Kundenprojekte |
| `tokens.css` | 189 Zeilen — nur Referenzen, hell als Standard, `[data-tl-mode="dark"]`, `[data-tl-density="compact"]` |
| `base.css` | Typografieklassen, Fokusring, Reduced Motion, Zahlenklasse, Druck |
| `tokens.dtcg.json` | W3C-Format für Figma und Kundenwerkzeuge |
| 81 Tests | Schichten, Kontrast, Maße, Farbton, Erzeugtes, Klassen-Gate, Ratsche, Namensraum |

**Das Klassen-Gate** bricht bei jedem Literal, jedem `:focus` ohne `-visible`, jedem `outline: none`, jedem `z-index` ohne Ebene. **Die Ratsche** zählt das alte Stylesheet je Block: keiner wächst, ein abgeschnittener wird gestrichen — Fremdzuwachs bleibt seinem Block und seinem Absender zugeordnet.

Die Demo-App lädt die drei Dateien und setzt `data-tl-mode` und `data-tl-density` am `html`.

**Wie es weitergeht — fünf Wellen, jede Komponente nach demselben Rhythmus:** CSS ins Paket, Klassen im TSX umbenennen, Zustände auf Attribute, Specimen, Vertrag, Gate grün, alter Block gelöscht.

| Welle | Komponenten |
|---|---|
| 1 | Button, ToggleButton, Pill, Avatar, Progress, FontIcon |
| 2 | Felder, Checkbox, BooleanChoice, DropdownSelect, FormField, FormGroup, FormLayout |
| 3 | TableView, TreeView, Menu, Toolbar, TabBar, Breadcrumb |
| 4 | Dialog, Window, Drawer, Snackbar, NoticeBar, Shell, Layoutcontainer |
| 5 | Calendar, ColorInput, IconSelect, Medien, Dashboard |

> Sprechnotiz: Eine Komponente ist fertig, wenn ihr alter Block leer ist. Nicht früher.

## 31 · Der Namensraum

**`--tl` gehört dem Paket. Außerhalb von `dist/` wird darin nichts definiert; gelesen werden darf, was das Paket definiert — eine Übergangsregel im alten Stylesheet liest Tokens, definiert sie aber nicht.**

Der Anlass: Beim Nachziehen auf `master` wuchs das alte Stylesheet um 23 Zeilen — legitim, aus einem fremden Ticket. Dabei fielen vier Custom Properties mit unserem Präfix im Altbestand auf: `--tl-item-index`, `--tlGrid-gap`, `--tlPill-color`, `--tl-tt-padding`.

| | |
|---|---|
| Regel | Jede Custom Property, die mit `--tl` beginnt, ist Design System |
| Gate | Die Ratsche listet Fremdgut unter `foreignTl`; Neues bricht, Eingefangenes wird gestrichen |
| Budget | Fremdzuwachs wird vermerkt und gehoben (6065 → 6088), nicht eingerechnet |

> Sprechnotiz: Die Konvention ist im Team noch nicht bekannt. Die vier Namen werden in ihren Wellen eingefangen — als Token mit Kategorie oder unter anderem Namen.

## 32 · Welle 1 · der Button — gemerged (!1649, 23.09.)

**Vier Erscheinungen, eine Tönung, keine Größe — und kein Selektor von außen.**

| | |
|---|---|
| Erscheinung | `primary` gefüllt · `secondary` Umriss (Default) · `ghost` ohne Rahmen · `link` |
| Tönung | `danger` färbt die Erscheinung um, liest die Status-Rollen; nicht mit `link` |
| Größe | aus der Dichte; nur die Icon-Schaltfläche kennt `sm` für Tabellenzeilen |
| Zustände | `:disabled`, `aria-pressed`, `aria-busy="true"`, `:focus-visible` — Klassen dafür brechen das Gate |
| Kontext | der Container wählt die Erscheinung; die AppBar ist keine Markenfläche mehr — umgesetzt mit Welle 1 als Übergangsregel im alten AppBar-Block, Welle 4 schreibt die Shell neu |
| Kollaps | entscheidet die Toolbar nach ihrem Platz (#29626), nicht der Button und kein Breakpoint |
| Umgesetzt | 320 Zeilen weniger im alten Stylesheet; Kontrasttest 22 Erscheinungen × 2 Modi grün; auf `master` seit 23.09. (!1649, drei Build-Nachbesserungen, zwei Merges von master) |

Der Befund dahinter: drei Erscheinungen, zwei kaum genutzte Größen, ein gedrückter Zustand als Klasse, die Primary dupliziert, fünf Kontextblöcke mit Literalen, nichts für Destruktives.

> Sprechnotiz: Warum Tönung statt fünfter Erscheinung — Löschen ist mal Umriss, mal gefüllt. Eine Erscheinung müsste beides sein: die nächste Dublette.

> Sprechnotiz: `button.css` steht, das Gate verbietet Zustands-Modifier und fremde Modifier am Block. Entschieden: Danger füllt sich mit `status-error-surface`/`-active` beim Zeigen (statt `status-error-subtle`), `border-control` dunkel auf `gray-45`, alle vier `status-*-text` dunkel auf `surface-layer` angehoben (Fehler auf `red-32`, Warnung `amber-34`, Erfolg `green-36`, Info `teal-35`), dasselbe für die Linien (Fehler `red-42`, Warnung `amber-44`, Erfolg `green-46`, Info `teal-45`) — die Regel gilt jetzt für beide Flächen, als Test festgeschrieben. Alle Kontrastbefunde aus Task 3 sind entschieden.

## 32a · Die Ratsche misst Blöcke

**Ein Budget über der ganzen Datei kennt keinen Absender.**

| | |
|---|---|
| Befund | dreimal in fünf Tagen Hebung für fremden Zuwachs: 5766 → 6692 → 7390 → 7405 (#29626, #29523, #29596, #29497, #29615) |
| Entschieden | `ratchet.json` führt jeden Block `/* --- Name --- */` mit seinem Zeilenstand; kein Block wächst, ein abgeschnittener wird gestrichen |
| Fremdzuwachs | hebt einen Block mit Ticketvermerk, nicht die Datei; neue Blöcke stehen unter `unlisted`, bis ihre Welle sie holt |
| Verworfen | Eichung je Welle gegen master — misst weiter die Datei |

> Sprechnotiz: Das ist zugleich der Fertig-Nachweis je Komponente: Der Block fällt aus der Liste, wenn er aus der Datei gefallen ist.
