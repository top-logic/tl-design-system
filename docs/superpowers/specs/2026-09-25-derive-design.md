# `tl-ds derive` — ein Kundentheme aus einer Primitivdatei

**Stand:** 2026-09-25 · Ticket #29617
**Baut auf:** [`2026-09-17-design-system-neuaufbau-design.md`](2026-09-17-design-system-neuaufbau-design.md) §3 Stufe A,
`docs/skalen.md` „Zwei Schichten“, „Kategorien folgen der Marke“, „Themes: eine dritte Achse“

---

## Was `derive` ist

Das Werkzeug der Kundenstufe A. Ein Kunde legt eine JSON mit seinen Werten neben das Paket;
`derive` rechnet daraus alles Fehlende und schreibt eine CSS-Datei, die als Theme neben TopLogic
steht. Der Kunde fasst kein TopLogic-CSS an, und ein Update des Pakets ändert seine Dateien nicht.

**Was der Kunde schreibt, gilt. Was er nicht schreibt, wird gerechnet. Was gerechnet oder
geschrieben wurde, wird geprüft — und gemeldet, nicht verboten.**

## Entscheidungen dieser Spec

Drei Punkte weichen von früheren Festlegungen ab. Jeder ist in `docs/skalen.md` mit Begründung
nachgetragen; hier die Kurzform.

| Bisher | Jetzt | Warum |
|---|---|---|
| Die Theme-Datei überschreibt Primitive (`--tl-blue-49`). | Die Theme-Datei schreibt **Rollen** (`--tl-surface-brand`). | Die Familie `blue` trägt Marke und die Kategorien 5 und 6 zugleich; eine Familie ist keine Rolle. Rollennamen sind der Vertrag, Stufennamen nicht: Nummerieren wir eine Stufe um, überlebt die Rollen-Datei, die Primitiv-Datei verliert die Marke lautlos. |
| Ein Theme, das ein Kontrastpaar verfehlt, wird nicht erzeugt. | Es wird erzeugt, der **Befund reist mit** (Konsole und Dateikopf). `--strict` macht ihn zum Fehler. | Ein Kunde mit eigenem Styleguide bekommt seinen Styleguide, mit Hinweis. Gerechnetes hält die Regel immer; nur Geliefertes darf sie brechen. |
| Grau ist eine feste neutrale Rampe. | Grau ist eine **Temperatur** (`warm`, `neutral`, `cool`) auf unseren 28 Helligkeiten. | Ein frei gewähltes Grau kippt Kontraste; die Temperatur ändert Farbton und eine kleine Chroma, nie die Helligkeit. Sie hält damit jede Helligkeit der TopLogic-Rampe — aber nicht von selbst jedes Paar: OKLCH-Helligkeit ist nicht die WCAG-Leuchtdichte, unser eigenes `status-warning-text` auf `surface-base` steht bei 4,500011. Was danach noch fehlt, führt der Nachführ-Pass in der Helligkeit nach, mit Hinweis. |

## Eingabe

Eine Datei `<theme>.primitives.json`. Familien und Stufennamen sind die des Pakets
(`src/primitives.json`); fremde Namen übersetzt der Token-Mapper (eigenes Miniprojekt), nicht
`derive`.

```json
{
  "theme": "acme",
  "color":   { "brand": "#E8541E", "gray": "warm" },
  "font":    { "font-1": "'Acme Sans', system-ui, sans-serif" },
  "measure": { "corner-1": "0", "corner-2": "0" }
}
```

| Schlüssel | Form | Bedeutung |
|---|---|---|
| `theme` | Pflicht, `[a-z][a-z0-9-]*` | Wert von `data-tl-theme`; nie `tl`. |
| `color.brand` | Hex **oder** Objekt Stufe → Hex | Hex: Saat, alle 12 Markenstufen werden gerechnet. Objekt: vorhandene Stufen gelten, fehlende werden aus der Stufe 49 gerechnet; fehlt auch 49, ist es ein Fehler. |
| `color.gray` | `warm` \| `neutral` \| `cool` **oder** Objekt Stufe → Hex | Temperatur: 28 Stufen auf unseren Helligkeiten, warm bei 70°, cool bei 250°, jeweils Chroma 0,008; neutral ohne Chroma. Objekt: gelieferte Stufen gelten, fehlende bleiben TopLogic. |
| `color.category` | fehlt **oder** Objekt `category-1` … `category-8` → Hex | Fehlt: die acht Kategorien werden um die Marke neu verteilt, **sofern die Eingabe überhaupt Farbe anfasst** (`color.brand`, `color.gray` oder `color.category`); eine Datei, die nur `font` oder `measure` ändert, lässt jede Farbrolle in Ruhe. Objekt: jeder gelieferte Ton wird auf `subtle` und `border` je Modus gebracht, fehlende werden verteilt. |
| `color.red`, `.amber`, `.green`, `.teal` | Objekt Stufe → Hex | Bedeutungen werden nie gerechnet: geliefert oder gelassen. |
| `font`, `measure`, `motion`, `effect` | Objekt Stufe → Wert | Übernahme je Stufe, keine Rechnung. |

Unbekannter Schlüssel, unbekannte Stufe, ungültiger Hex, fehlendes `theme`: Fehler mit Pfad in der
JSON, Exit 2, keine Ausgabe. Dichte wird nicht gelesen; `data-tl-density` bleibt orthogonal.

## Rechnung

Alles in `design-system/tools/lib/`, ohne Abhängigkeiten, OKLCH wie bisher.

| Schritt | Funktion | Was sie tut |
|---|---|---|
| Marke | `markenRollen(saatHex, gruende)` (neu) | Aus der Saat die Stufen für `surface-brand`, `-hover`, `-active`, `-subtle`, `-subtle-hover`, `text-link`, `-hover`, `border-interactive`, `focus-ring`, beide Modi. Die Regeln (Hover-, Active-, Dunkel-Schritte, Link-Regel) bleiben, wie in `color.mjs` dokumentiert. |
| Grau | `grauRampe(temperatur, stufen)` (neu) | Für jede der 28 Stufen: L aus unserer Rampe, H = 70° (warm) oder 250° (cool), C = 0,008 konstant, bei `neutral` C = 0 und kein Ton. |
| Kategorien | `kategorienVerteilen(blockiert, anzahl, mindest)` und `kategorieRollen(tonGrad, gruende)` (neu) | Acht Farbtöne auf dem Kreis, mindestens 20° zueinander, zur Marke und zu jeder der vier Bedeutungen (Rot, Gelb, Grün, Cyan bleiben fest). Je Ton `subtle` auf L 0,955 hell / 0,27 dunkel, `border` als hellster Wert mit 3,0 auf `surface-base` und `surface-layer`. Findet der Kreis keine acht Plätze mit 20°, wird der Abstand schrittweise gesenkt und das gemeldet. |
| Beschriftungen | `beschriftungAbleiten` (bestehend) | Für jede `derived`-Rolle aus `tokens.json`, deren Fläche sich ändert, mit denselben Kandidaten wie dort. |
| Nachführen | `aufKontrast` (bestehend) | Zum Schluss, über Marke, Grau, Kategorien und Beschriftungen hinweg: jede **gerechnete** Farbrolle, die ein Paar der Paarliste noch verfehlt, wird um den kleinsten Helligkeitsschritt geschoben, bis es hält; jede Verschiebung ist ein Hinweis. **Gelieferte Werte werden nie geschoben** — sie bleiben stehen und werden zum Befund. Ein Durchgang genügt: kein Vordergrund der Paarliste ist anderswo Grund (`pairs.test.mjs` hält das fest). |

Die drei Altnamen in `color.mjs` (`markenRampe`, `rampeAnwenden`, `nurHex`) sind entfernt — sie
hatten keinen Aufrufer mehr; `markenRollen` ersetzt sie. Damit ist der Offenpunkt aus `STATUS.md`
erledigt.

## Ausgabe

Eine Datei `<theme>.theme.css`, Pfad als zweites Argument, Standard neben der JSON.

```css
/* Generated by TopLogic/tl-design-system, tools/derive.mjs, from acme.primitives.json.
   Do not edit — edit the JSON and regenerate. Loaded after tokens.css; applies under data-tl-theme="acme".
   Findings: 2 pairs below its threshold (see report at the end of this file). */
[data-tl-theme="acme"] {
  --tl-surface-brand: #E8541E;
  --tl-category-1-subtle: #FFF0EA;
  --tl-text-on-brand: #FFFFFF;
  …
  --tl-font-family-sans: 'Acme Sans', system-ui, sans-serif;
  --tl-radius-sm: 0;
}
[data-tl-theme="acme"][data-tl-mode="dark"] {
  --tl-surface-brand: #F0783F;
  …
}

/* Report
   finding  light: status-error-text on surface-base = 2.77, required 4.5, suggestion #C4484C
   finding  light: status-error-text on surface-layer = 2.89, required 4.5, suggestion #C94D50
   note     light: text-link in der Helligkeit nachgeführt, damit 4,5 auf dem Grund hält (#E8541E → #BE3B00)
*/
```

Regeln:

* **Beide Blöcke tragen dieselben Farbrollen:** eine Rolle, die in einem Modus abweicht, steht in
  beiden, sonst gälte ihr heller Wert auch im Dunkeln. Der erste Block ordnet Farbrollen zuerst,
  Maß-Rollen zuletzt.
* Die **Kategorien** werden nur neu verteilt, wenn die Eingabe `color.brand`, `color.gray` oder
  `color.category` trägt; eine gelieferte Bedeutungsfamilie (`color.red` …) zieht ihre Farbrollen
  sehr wohl nach, ohne die Kategorien zu bewegen. Eine Datei mit nur `font` oder `measure` schreibt
  keine Farbrolle.
* Effektrollen (Schatten, Scrim) stehen wie Farbrollen in beiden Blöcken, sobald sie abweichen.
* Nur Rollen, deren Wert von TopLogic abweicht. Was der Kunde nicht anfasst, fehlt und fällt über
  die Kaskade auf `:root` zurück. Kein `var()`, nur Werte.
* Welche Rollen betroffen sind, liest `derive` aus `tokens.json`: jede Rolle, die eine geänderte
  Primitive referenziert, plus jede `derived`-Beschriftung, deren Fläche sich ändert. Hängen wir
  Rollen um, folgt die Datei beim nächsten Lauf.
* Dichte-Rollen werden nie geschrieben. Druck-Werte werden nie geschrieben.
* Die Datei wird **nach** `tokens.css` geladen. Die Ladereihenfolge ist Teil des Vertrags.

## Bericht und Exit-Code

Der Bericht steht auf der Konsole und als Kommentarblock am Ende der Datei. In der Datei stehen die
Zeilen unter `/* Report`, als `finding  …` und `note     …`:

```
finding  light: status-error-text on surface-base = 2.77, required 4.5, suggestion #C4484C
note     light: text-link in der Helligkeit nachgeführt, damit 4,5 auf dem Grund hält (…)
```

Auf der Konsole heißen dieselben Zeilen `Befund …` und `Hinweis …`, gefolgt von
`geschrieben: <pfad>`.

**Befunde** (verfehlte Paare): für jedes Paar aus der Paarliste des Kontrast-Tests, das unter
seiner Schwelle liegt: beide Rollen, Modus, Verhältnis, Schwelle, Vorschlag (nächste Stufe der
Rampe, die besteht). Befunde können nur aus gelieferten Werten entstehen; ein Befund aus einem
gerechneten Wert ist ein Fehler in `derive` und bricht mit Exit 3 ab.

**Auch die Beschriftung einer gelieferten Fläche ist geliefert.** Liefert der Kunde eine Saat
mittlerer Helligkeit (`#808080`), erreicht auf `surface-brand` weder der helle noch der dunkle
Kandidat 4,5 — die Fläche steht fest, also gibt es keinen Ausweg. `text-on-brand`, `-hover`,
`-active` und `icon-on-brand` auf den drei Markenflächen zählen darum als **geliefert** und werden
gemeldet, nicht abgebrochen. Für jedes andere gerechnete Paar bleibt es bei Exit 3.

**Hinweise** (kein Fehlercharakter): Chroma einer Stufe reduziert, Marke näher als 20° an einer
Bedeutung, Kategorienabstand unter 20° gesenkt, gelieferte Stufe identisch mit ihrer Nachbarstufe.

| Lage | Exit | Datei |
|---|---|---|
| ohne Befund | 0 | geschrieben |
| Befund, ohne `--strict` | 0 | geschrieben, Befund im Kopf und am Ende |
| Befund, mit `--strict` | 1 | nicht geschrieben |
| ungültige Eingabe, unbekannte `--option`, nicht schreibbarer Ausgabepfad | 2 | nicht geschrieben |
| Befund aus gerechnetem Wert | 3 | nicht geschrieben |

## Aufruf

```
node tools/derive.mjs <theme>.primitives.json [<ausgabe>.css] [--strict]
```

Kein Maven-Wrapper, keine Abhängigkeit, Node ≥ 22 wie das übrige Paket.

## Gate

`node --test` bekommt `test/derive.test.mjs` und eine Beispieldatei
`test/fixtures/probe.primitives.json` (orangefarbene Marke, warmes Grau, Radius 0, eine gelieferte
Stufe bewusst unter AA). Geprüft wird:

1. Die Ausgabe trägt genau die Rollen, deren Wert abweicht, unter beiden Selektoren; `:root` und
   `dist/tokens.css` sind unberührt.
2. Jede gerechnete Rolle besteht die Paarliste unter `probe` × hell und `probe` × dunkel —
   notfalls durch Nachführung in der Helligkeit, die als Hinweis im Bericht steht.
3. Die acht Kategorien halten 20° zueinander, zur Marke und zu jeder Bedeutung (derselbe Test wie
   `tokens.test.mjs` „Kategorien trennen sich“, über die erzeugten Werte).
4. Die gelieferte Stufe unter AA steht in der Datei **und** im Bericht — zwei Befunde,
   `status-error-text` auf `surface-base` und auf `surface-layer`; mit `--strict` bricht der Lauf
   mit Exit 1 ab und schreibt nichts.
5. `neutral` liefert Grau ohne Chroma; `warm` und `cool` liegen auf denselben Helligkeiten wie
   TopLogic-Grau.
6. Ungültige Eingaben (fremder Schlüssel, fehlende Stufe 49, schlechter Hex, `theme: "tl"`)
   enden mit Exit 2 und Pfadangabe.
7. `derive` ist deterministisch: zweimal laufen, byte-identisch.

Das Specimen bekommt einen Umschalter `data-tl-theme` (`tl` / `probe`), damit das Beispieltheme in
beiden Modi im Browser sichtbar ist.

## Nicht Teil dieser Spec

* `UIThemeService` setzt `data-tl-theme` noch nicht und kennt die Liste der Themes nicht; das ist
  die Engine-Welle mit Issue #16. Bis dahin ist ein Kundentheme im Specimen sichtbar, nicht in
  der Demo-App.
* Token-Mapper (fremde Namen, Figma-Export, DTCG-Import) — Miniprojekt der Spec vom 17.09.
* Stufe B (`customer.tokens.css`) und Stufe C (eigene Komponenten) bleiben, wie sie sind.

## Doku, die mitzieht

* `docs/skalen.md`: „Themes: eine dritte Achse“ (Rollen statt Primitive, Befund statt Verbot,
  Test umformuliert), „Kategorien folgen der Marke“ (wie verteilt wird), neu „Graurampe:
  Temperatur statt Farbe“.
* Spec 17.09. §3 Stufe A: Ausgabe ist `<theme>.theme.css` mit Theme-Selektor, Verweis hierher.
* `docs/praesentation.md`: eine Folie „Eine Hausfarbe, ein Befehl, ein Theme“.
* `STATUS.md`: `derive` von offen auf laufend; Offenpunkte Altnamen, dritte Achse, derive
  zusammengezogen.
* `CLAUDE.md`: `node tools/derive.mjs` in der Werkzeugtabelle.

## Reihenfolge und Fertig-Bedingung

1. Altnamen in `color.mjs` umbenennen, Tests grün.
2. `grauRampe` mit Test.
3. `kategorienVerteilen` mit Test.
4. Eingabe lesen und prüfen, Fehlerpfade mit Test.
5. Betroffene Rollen aus `tokens.json` bestimmen, Datei schreiben, Test 1, 2, 7.
6. Bericht, `--strict`, Exit-Codes, Test 4, 6.
7. Specimen-Umschalter.
8. Doku nachziehen.

**Fertig, wenn:** `node tools/derive.mjs test/fixtures/probe.primitives.json` eine Datei
schreibt, `node --test` grün ist einschließlich `derive.test.mjs`, das Specimen `probe` in beiden
Modi zeigt, die Doku nachgezogen ist und alles committet ist.
