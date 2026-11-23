# Plan: `radius-mark` — die Checkbox bleibt eckig (#30502, U69)

**Ziel:** Ein Kundentheme mit weichem `corner-1` macht das Kästchen nicht mehr rund. Die Checkbox liest eine eigene
Rolle `radius-mark` auf eigener Primitivfamilie `bevel-1` (entschieden 23.11., Hendrik). Wert bei TopLogic 4 px wie
bisher, sichtbar ändert sich in TopLogic nichts. Radio bleibt `radius-round`.

**Branch:** `CWS/CWS_30502_checkbox_radius_mark` von `origin/master` (Worktree `_Working-Tree/tl8-wt-30502`).
Doku auf `doku/30502` (Worktree `_Working-Tree/doku-30502`). Kein Push ohne Hendriks Freigabe.

## Befund aus der Erkundung

* Nur **eine** Stelle zeichnet die Auswahlmarke als Kästchen: `.tl-checkbox` in `src/components/choice/choice.css:29–31`
  (`border-radius: var(--tl-radius-sm)`). Die Auswahlspalte der Tabelle (`table.css:534`) und der Haken in
  `layout.css:135` nutzen dieselbe Klasse bzw. zeichnen keinen eigenen Radius. Segmente (`choice.css:230, 245`) sind
  Bedienteile und bleiben `radius-sm`. Der Farbwähler-Griff ist `radius-full` und bleibt.
* `derive` übernimmt gelieferte Maß-Primitive ohne Familienliste (`tools/lib/theme-input.mjs:65–71` prüft nur
  `Object.hasOwn(P.measure, stufe)`), eine neue Stufe `bevel-1` ist damit ohne Änderung lieferbar. Rollen, die
  abweichen, landen in `rollen.measure` (`derive.mjs:297`).
* Befunde in `derive` sind heute nur Kontrastpaare (`derive.mjs:299–317`, Form `{mode, fg, bg, ist, soll, …}`);
  Kopf `Findings: N pairs below its threshold` wird in `test/derive.test.mjs:205, 328` geprüft.
* `test/fixtures/probe.primitives.json` setzt `corner-1`/`corner-2` auf `0`, nicht `bevel-1`:
  `specimen/probe.theme.css` bleibt byte-identisch (`derive.test.mjs:24`).

## Task 1 — Paket (Engine-Commit, `Ticket #30502:`)

Dateien unter `tl-design-system/`:

1. `src/primitives.json`, `measure`: hinter `"corner-4": "50%"` eintragen `"bevel-1": "0.25rem"`.
2. `src/tokens.json`, `measure`: hinter `"radius-round": "{corner-4}"` eintragen `"radius-mark": "{bevel-1}"`.
3. `src/components/choice/choice.css`: `.tl-checkbox { border-radius: var(--tl-radius-mark); }`.
4. `src/components/choice/choice.contract.md`: Zeile „Kästchen, Kreis“ → Ecke `--tl-radius-mark` bzw.
   `--tl-radius-round`; Zeile „Halo“ → „Quadrat mit `--tl-radius-mark`“.
5. `tools/derive.mjs`, neuer Schritt 7b nach den Kontrastbefunden — **Form-Befunde**:
   * Grenze: `radius-mark` muss **kleiner** als ein Drittel von `size-choice` sein (beide aus `Rk.measure`).
   * Umrechnung in px: `rem` × 16, `px` direkt, `%` als Anteil der Kante (`size-choice`), `0` = 0.
     Andere Einheiten (z. B. `calc(…)`, `em`) → **Hinweis** `radius-mark not checked: <wert>`, kein Befund.
   * Verfehlt: Eintrag in neuem Array `formBefunde` als `{ rolle: 'radius-mark', ist: '<Wert wie geliefert>',
     grenze: '<px, 2 Nachkommastellen>px', bezug: 'size-choice' }`.
   * Rückgabe von `derive` bekommt `formBefunde`.
   * `css()`: Report-Zeile `   finding  measure: radius-mark = <ist>, required below <grenze> (a third of size-choice)`;
     der Report-Block erscheint, wenn `befunde`, `formBefunde` oder `hinweise` nicht leer sind.
   * Kopf: unverändert `Findings: N pairs below its threshold`, bei `formBefunde.length > 0` angehängt
     `, M shape(s) beyond its limit` vor `(see report …)`. Damit bleiben `derive.test.mjs:205` und `:328` grün.
   * CLI: Zeile `Befund  Maß: radius-mark = <ist>, gefordert unter <grenze> (ein Drittel von size-choice)`;
     `--strict` bricht ab, wenn `befunde.length + formBefunde.length > 0` (Zählung in der Meldung: Summe).
6. Tests:
   * `test/choice.test.mjs`: `T.measure['radius-mark'] === '{bevel-1}'`; `.tl-checkbox` liest `--tl-radius-mark`,
     nicht `--tl-radius-sm`; `.tl-radio` bleibt `--tl-radius-round`; aufgelöst gilt `bevel-1` (px) < `size-choice` (px) / 3.
   * `test/derive.test.mjs`:
     * `measure: { 'corner-1': '0.75rem' }` → `rollen.measure` hat `radius-sm`, **nicht** `radius-mark`; keine Form-Befunde
       (der Kern von U69).
     * `measure: { 'bevel-1': '0.5rem' }` → ein Form-Befund (8 px ≥ 5,33 px), Report-Zeile im CSS, Kopf nennt `1 shape`.
     * `measure: { 'bevel-1': '50%' }` → Form-Befund.
     * `measure: { 'bevel-1': '0.3rem' }` (4,8 px) → kein Form-Befund, `radius-mark` in `rollen.measure`.
     * `measure: { 'bevel-1': 'calc(1px + 1px)' }` → Hinweis, kein Befund.
     * CLI mit `--strict` und `bevel-1: 0.5rem` → Exit 1, nichts geschrieben (Muster der vorhandenen CLI-Tests).
   * Bestehender Test `derive.test.mjs:99–103` („eine Datei ohne Farbe …“, `corner-1: 0`) bleibt unverändert grün.

**Gates (Fertig-Bedingung):** im Modul `tl-design-system/`: `node tools/generate.mjs`, `npm test`,
`npm run test:dom`, `node tools/lint-css.mjs` — alle grün. `specimen/probe.theme.css` unverändert.
Sichtprüfung: Specimen `choice` hell/dunkel, Kästchen 4 px wie vorher; mit `data-tl-theme` eines Probethemes, das
`corner-1: 0.75rem` liefert, bleibt das Kästchen eckig, Feld und Knopf werden rund.

## Task 2 — Doku (`doku/30502`, `Ticket #30502:`)

* `docs/skalen.md` „Radius: zwei Stufen, zwei Formen“: Zeile `radius-sm` ohne „Checkbox“; neue Zeile
  `radius-mark` | `0.25rem` (4 px), Primitiv `bevel-1` | Kästchen der Checkbox; Absatz mit Begründung (Grenztest
  `weich`, Kreis liest sich als Radio, „eckig = mehrere, rund = eins“, Grenze ein Drittel der Kante, `derive` meldet).
* `docs/ui-durchgang.md` U69: als erledigt mit Ticket markieren (Form der anderen erledigten Einträge).
* `STATUS.md`: Punkt 1 unter „Weiter“ durch den PR-Stand ersetzen.

## Nicht in diesem Plan

Figma-Variable `bevel-1`/`radius-mark` (Figma-Doku-Durchgang), Dichte im Theme-Vertrag (U70), Abstandsfamilie (U71).

## Korrekturen aus dem Plan-Review (23.11., frischer Agent)

Gehen den Schritten oben vor.

1. CSS-Tests über `declarationsOfAll(css, '.tl-checkbox')` / `'.tl-radio'`, nicht `declarationsOf` (die erste Regel
   ist der gemeinsame Block ohne Radius). Zusätzlich über `dist/components.css`: `--tl-radius-mark` steht nur in der
   Regel `.tl-checkbox`.
2. Kopf: Verweis „(see report …)“, sobald Paare **oder** Formen gefunden sind; `shape`/`shapes` wie `pair`/`pairs`.
3. Einheiten: Regex `/^(-?\d*\.?\d+)(rem|px|%)$/i`, `0` = 0. Alles andere bei `radius-mark` **oder** `size-choice`
   (auch einheitenlose Zahl, `calc`) → Hinweis, kein Befund. `%` braucht keine Kante: Anteil < 1/3.
4. Hinweis deutsch wie der Bestand: `radius-mark nicht geprüft: <rolle> = <wert>`. Report-Zeile `finding` bleibt
   englisch wie die Paar-Zeilen.
5. Weitere Tests: `{'size-4': '0.5rem'}` → Form-Befund (`ist: '0.25rem'`, `grenze: '2.67px'`); `{'size-4': 'calc(1rem)'}`
   → Hinweis; `{'bevel-1': '.5rem'}` → Befund; Theme ohne Maße → kein Form-Befund, kein Hinweis; CLI **ohne**
   `--strict` → Exit 0, Datei da, stdout mit `Befund  Maß: radius-mark`. Der px-Vergleich in `choice.test.mjs`
   entfällt, die Grenze prüft `derive` am leeren Theme.
6. `test/fixtures/probe.primitives.json` bekommt `"bevel-1": "0"` (probe ist durchgehend eckig);
   `specimen/probe.theme.css` neu erzeugen.
7. Sichtprüfung: Probetheme mit `corner-1: 0.75rem` per `derive` in eine Scratch-Datei, im choice-Specimen von Hand
   laden, `data-tl-theme` setzen; nichts davon committen.
8. Doku zusätzlich: `docs/skalen.md:2147` (Halo „Quadrat mit `radius-mark`“), `:899` und
   `docs/uebersicht-design-system.md:56` je ein Satz zum Form-Befund. `layout.css`: `.tl-item__check` ist ein Kreis
   (`radius-round`), kein Kästchen.
