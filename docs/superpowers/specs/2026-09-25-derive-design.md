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
| Grau ist eine feste neutrale Rampe. | Grau ist eine **Temperatur** (`warm`, `neutral`, `cool`) auf unseren 28 Helligkeiten. | Ein frei gewähltes Grau kippt Kontraste; die Temperatur ändert Farbton und eine kleine Chroma, nie die Helligkeit, und jedes Paar hält. |

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
| `color.gray` | `warm` \| `neutral` \| `cool` **oder** Objekt Stufe → Hex | Temperatur: 28 Stufen auf unseren Helligkeiten, warm in Richtung des Markentons, cool gegenüber, neutral ohne Chroma. Objekt: gelieferte Stufen gelten, fehlende bleiben TopLogic. |
| `color.category` | fehlt **oder** Objekt `category-1` … `category-8` → Hex | Fehlt: die acht Kategorien werden um die Marke neu verteilt. Objekt: jeder gelieferte Ton wird auf `subtle` und `border` je Modus gebracht, fehlende werden verteilt. |
| `color.red`, `.amber`, `.green`, `.teal` | Objekt Stufe → Hex | Bedeutungen werden nie gerechnet: geliefert oder gelassen. |
| `font`, `measure`, `motion`, `effect` | Objekt Stufe → Wert | Übernahme je Stufe, keine Rechnung. |

Unbekannter Schlüssel, unbekannte Stufe, ungültiger Hex, fehlendes `theme`: Fehler mit Pfad in der
JSON, Exit 2, keine Ausgabe. Dichte wird nicht gelesen; `data-tl-density` bleibt orthogonal.

## Rechnung

Alles in `design-system/tools/lib/`, ohne Abhängigkeiten, OKLCH wie bisher.

| Schritt | Funktion | Was sie tut |
|---|---|---|
| Marke | `markenRampe` (bestehend, umbenannt) | Aus der Saat die Stufen für `surface-brand`, `-hover`, `-active`, `-subtle`, `-subtle-hover`, `text-link`, `-hover`, `border-interactive`, `focus-ring`, beide Modi. Die Regeln (Hover-, Active-, Dunkel-Schritte, Link-Regel) bleiben, wie in `color.mjs` dokumentiert. |
| Grau | `grauRampe(temperatur, markenTon)` (neu) | Für jede der 28 Stufen: L aus unserer Rampe, H = Markenton (warm) oder Markenton + 180° (cool), C klein und konstant, bei `neutral` 0. |
| Kategorien | `kategorienVerteilen(markenTon, bedeutungsToene)` (neu) | Acht Farbtöne auf dem Kreis, mindestens 20° zueinander, zur Marke und zu jeder der vier Bedeutungen (Rot, Gelb, Grün, Cyan bleiben fest). Je Ton `subtle` auf L 0,955 hell / 0,27 dunkel, `border` als hellster Wert mit 3,0 auf `surface-base` und `surface-layer`. Findet der Kreis keine acht Plätze mit 20°, wird der Abstand schrittweise gesenkt und das gemeldet. |
| Beschriftungen | `beschriftungAbleiten` (bestehend) | Für jede `derived`-Rolle aus `tokens.json`, deren Fläche sich ändert, mit denselben Kandidaten wie dort. |

Die drei Altnamen in `color.mjs` (`markenRampe`, `rampeAnwenden`, `nurHex`) werden vorher auf die
heutigen Rollennamen gebracht; das war ein offener Punkt in `STATUS.md`.

## Ausgabe

Eine Datei `<theme>.theme.css`, Pfad als zweites Argument, Standard neben der JSON.

```css
/* Generated by TopLogic/tl-design-system, tools/derive.mjs, from acme.primitives.json.
   Do not edit — edit the JSON and regenerate.
   Findings: 1 pair below AA (see report at the end of this file). */
[data-tl-theme="acme"] {
  --tl-surface-brand: #E8541E;
  --tl-text-on-brand: #FFFFFF;
  --tl-category-1-subtle: #FFF0EA;
  --tl-font-family-sans: 'Acme Sans', system-ui, sans-serif;
  --tl-radius-sm: 0;
}
[data-tl-theme="acme"][data-tl-mode="dark"] {
  --tl-surface-brand: #F0783F;
  …
}
```

Regeln:

* Nur Rollen, deren Wert von TopLogic abweicht. Was der Kunde nicht anfasst, fehlt und fällt über
  die Kaskade auf `:root` zurück. Kein `var()`, nur Werte.
* Welche Rollen betroffen sind, liest `derive` aus `tokens.json`: jede Rolle, die eine geänderte
  Primitive referenziert, plus jede `derived`-Beschriftung, deren Fläche sich ändert. Hängen wir
  Rollen um, folgt die Datei beim nächsten Lauf.
* Dichte-Rollen werden nie geschrieben. Druck-Werte werden nie geschrieben.
* Die Datei wird **nach** `tokens.css` geladen. Die Ladereihenfolge ist Teil des Vertrags.

## Bericht und Exit-Code

Der Bericht steht auf der Konsole und als Kommentarblock am Ende der Datei.

**Befunde** (verfehlte Paare): für jedes Paar aus der Paarliste des Kontrast-Tests, das unter
seiner Schwelle liegt: beide Rollen, Modus, Verhältnis, Schwelle, Vorschlag (nächste Stufe der
Rampe, die besteht). Befunde können nur aus gelieferten Werten entstehen; ein Befund aus einem
gerechneten Wert ist ein Fehler in `derive` und bricht mit Exit 3 ab.

**Hinweise** (kein Fehlercharakter): Chroma einer Stufe reduziert, Marke näher als 20° an einer
Bedeutung, Kategorienabstand unter 20° gesenkt, gelieferte Stufe identisch mit ihrer Nachbarstufe.

| Lage | Exit | Datei |
|---|---|---|
| ohne Befund | 0 | geschrieben |
| Befund, ohne `--strict` | 0 | geschrieben, Befund im Kopf und am Ende |
| Befund, mit `--strict` | 1 | nicht geschrieben |
| ungültige Eingabe | 2 | nicht geschrieben |
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
2. Jede gerechnete Rolle besteht die Paarliste unter `probe` × hell und `probe` × dunkel.
3. Die acht Kategorien halten 20° zueinander, zur Marke und zu jeder Bedeutung (derselbe Test wie
   `tokens.test.mjs` „Kategorien trennen sich“, über die erzeugten Werte).
4. Die gelieferte Stufe unter AA steht in der Datei **und** im Bericht; mit `--strict` bricht der
   Lauf mit Exit 1 ab und schreibt nichts.
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
