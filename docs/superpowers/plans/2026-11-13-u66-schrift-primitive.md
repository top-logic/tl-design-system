# U66 — Schriftstärke, Zeilenhöhe, Laufweite und Druckgrößen als Primitive (#30322)

**Ziel:** `tokens.json` trägt keinen Wert mehr. Die Typo-Klassen `.tl-type-*` und die Druckklassen `.tl-print-*`
lesen nur Rollen, die auf Primitive verweisen. Das gerechnete Ergebnis jeder Klasse bleibt **gleich**.
Ein Test über alle Gruppen von `tokens.json` verhindert neue Literale.

**Ort:** Engine-Worktree `_Working-Tree/tl8-wt-30322`, Branch `CWS/CWS_30322_font_primitives` (von master
`97d7bb1037`), Modul `tl-design-system/`. Commit-Präfix `Ticket #30322:`, Nachrichten englisch. **Kein Push.**

**Ausgangslage (gemessen 13.11.):** `npm test` 687 grün.

## Entscheidungen (Orchestrator, fest)

### Primitive (`src/primitives.json`)

Gruppe `font` bekommt (Werte als Zeichenketten, wie `depth-*`):

| Primitive | Wert |
|---|---|
| `weight-1` | `400` |
| `weight-2` | `600` |
| `leading-1` | `1.25` |
| `leading-2` | `1.3333` |
| `leading-3` | `1.35` |
| `leading-4` | `1.4` |
| `leading-5` | `1.4286` |
| `leading-6` | `1.5` |
| `tracking-1` | `-0.01em` |
| `tracking-2` | `-0.005em` |
| `tracking-3` | `0` |
| `tracking-4` | `0.01em` |
| `tracking-5` | `0.04em` |

Gruppe `measure` bekommt `print-1` `8pt`, `print-2` `10pt`, `print-3` `12pt`, `print-4` `18pt`.

So kann eine Theme-Eingabe sie über die bestehenden Familien `font` und `measure` setzen (`tools/lib/theme-input.mjs`
`FAMILIEN`), ohne Änderung dort.

### Rollen (`src/tokens.json`, Gruppe `measure`, Kategorie `font`)

| Rolle | Referenz |
|---|---|
| `font-weight-regular` | `{weight-1}` |
| `font-weight-strong` | `{weight-2}` |
| `font-line-height-label` | `{leading-2}` |
| `font-line-height-body` | `{leading-5}` |
| `font-line-height-heading-sm` | `{leading-6}` |
| `font-line-height-heading-md` | `{leading-4}` |
| `font-line-height-heading-lg` | `{leading-2}` |
| `font-line-height-display` | `{leading-1}` |
| `font-letter-spacing-tight` | `{tracking-1}` |
| `font-letter-spacing-snug` | `{tracking-2}` |
| `font-letter-spacing-normal` | `{tracking-3}` |
| `font-letter-spacing-wide` | `{tracking-4}` |
| `font-letter-spacing-wider` | `{tracking-5}` |
| `font-size-print-title` | `{print-4}` |
| `font-size-print-heading` | `{print-3}` |
| `font-size-print-body` | `{print-2}` |
| `font-size-print-caption` | `{print-1}` |
| `font-line-height-print-title` | `{leading-1}` |
| `font-line-height-print-heading` | `{leading-3}` |
| `font-line-height-print-body` | `{leading-4}` |
| `font-line-height-print-caption` | `{leading-3}` |

### Typo- und Druckklassen lesen Rollen über Namen

Wie heute schon `family` und `size`: ein Feld nennt den Rollennamen ohne Präfix.

```json
"type": {
  "display":      { "family": "sans", "size": "display",    "weight": "strong",  "lineHeight": "display",    "tracking": "tight" },
  "heading-lg":   { "family": "sans", "size": "heading-lg", "weight": "strong",  "lineHeight": "heading-lg", "tracking": "snug" },
  "heading-md":   { "family": "sans", "size": "heading-md", "weight": "strong",  "lineHeight": "heading-md", "tracking": "normal" },
  "heading-sm":   { "family": "sans", "size": "heading-sm", "weight": "strong",  "lineHeight": "heading-sm", "tracking": "normal" },
  "body":         { "family": "sans", "size": "body",       "weight": "regular", "lineHeight": "body",       "tracking": "normal" },
  "body-strong":  { "family": "sans", "size": "body",       "weight": "strong",  "lineHeight": "body",       "tracking": "normal" },
  "label":        { "family": "sans", "size": "label",      "weight": "regular", "lineHeight": "label",      "tracking": "wide" },
  "label-strong": { "family": "sans", "size": "label",      "weight": "strong",  "lineHeight": "label",      "tracking": "wide" },
  "overline":     { "family": "sans", "size": "label",      "weight": "regular", "lineHeight": "label",      "tracking": "wider" },
  "code":         { "family": "mono", "size": "body",       "weight": "regular", "lineHeight": "body",       "tracking": "normal" }
},
"print": {
  "title":   { "size": "print-title",   "weight": "strong",  "lineHeight": "print-title" },
  "heading": { "size": "print-heading", "weight": "strong",  "lineHeight": "print-heading" },
  "body":    { "size": "print-body",    "weight": "regular", "lineHeight": "print-body" },
  "caption": { "size": "print-caption", "weight": "regular", "lineHeight": "print-caption" }
}
```

Der `_`-Kommentar von `type` bleibt und nennt zusätzlich: Felder sind Rollennamen ohne Präfix
(`weight` → `--tl-font-weight-<w>`, `lineHeight` → `--tl-font-line-height-<l>`, `tracking` → `--tl-font-letter-spacing-<t>`).
`print` bekommt einen `_`-Kommentar derselben Art; jede Stelle, die `T.print` liest, überspringt `_`-Schlüssel.

Erzeugt (`tools/generate.mjs` `baseCss`):

```css
.tl-type-display {
  font-family: var(--tl-font-family-sans);
  font-size: var(--tl-font-size-display);
  font-weight: var(--tl-font-weight-strong);
  line-height: var(--tl-font-line-height-display);
  letter-spacing: var(--tl-font-letter-spacing-tight);
}
…
  .tl-print-title {
    font-size: var(--tl-font-size-print-title);
    font-weight: var(--tl-font-weight-strong);
    line-height: var(--tl-font-line-height-print-title);
  }
```

Ein Feld, dessen Rolle in `T.measure` fehlt, bricht die Erzeugung mit einer Meldung ab (Klasse, Feld, Rollenname) —
kein stilles `var()` auf eine unbekannte Variable.

## Task 1 — Werte verschieben, Erzeugung und DTCG umstellen (Sonnet)

**Dateien:** `src/primitives.json`, `src/tokens.json`, `tools/generate.mjs`, `tools/dtcg.mjs`,
`test/generate.test.mjs`, `test/dtcg.test.mjs`, `tools/lint-css.mjs`, ggf. `test/lint-css.test.mjs`.

1. **Regressionstest zuerst** (in `test/generate.test.mjs`; er ist vorher **und** nachher grün und sichert, dass sich
   nichts ändert): Für jede Typo- und Druckklasse wird in `dist/base.css`
   die Deklaration gelesen und jedes `var(--tl-…)` über `dist/primitives.css` + `dist/tokens.css` bis zum Literal
   verfolgt (Muster: Helfer in `test/fundament.test.mjs` Zeile 15 ff., dort wiederverwenden oder nach `test/lib/`
   ziehen, nicht kopieren). Erwartet wird die feste Tabelle der heutigen Werte:

   | Klasse | weight | line-height | letter-spacing |
   |---|---|---|---|
   | display | 600 | 1.25 | -0.01em |
   | heading-lg | 600 | 1.3333 | -0.005em |
   | heading-md | 600 | 1.4 | 0 |
   | heading-sm | 600 | 1.5 | 0 |
   | body | 400 | 1.4286 | 0 |
   | body-strong | 600 | 1.4286 | 0 |
   | label | 400 | 1.3333 | 0.01em |
   | label-strong | 600 | 1.3333 | 0.01em |
   | overline | 400 | 1.3333 | 0.04em |
   | code | 400 | 1.4286 | 0 |

   | Druck | font-size | weight | line-height |
   |---|---|---|---|
   | title | 18pt | 600 | 1.25 |
   | heading | 12pt | 600 | 1.35 |
   | body | 10pt | 400 | 1.4 |
   | caption | 8pt | 400 | 1.35 |

   Test einchecken, mit `npm run build && npm test` **grün auf dem alten Stand** zeigen, committen.
2. Primitive und Rollen wie oben eintragen; `type` und `print` umschreiben.
3. `generate.mjs`: Typo- und Druckregeln aus Rollennamen erzeugen (siehe oben), mit Abbruch bei unbekannter Rolle.
4. `test/generate.test.mjs` „jede Typo-Klasse setzt fünf Eigenschaften aus Variablen“: prüft jetzt
   `font-weight: var(--tl-font-weight-${k.weight})`, `line-height: var(--tl-font-line-height-${k.lineHeight})`,
   `letter-spacing: var(--tl-font-letter-spacing-${k.tracking})`; dazu dieselbe Prüfung für jede Druckklasse.
5. `dtcg.mjs`: `measureType` ordnet zu — `font-weight-*` → `fontWeight`, `font-line-height-*` → `number`,
   `font-letter-spacing-*` → `dimension`, `font-size-print-*` → `dimension` (bleibt `dimension` über den Standardfall;
   prüfen, dass `pt` als Einheit durchgeht, sonst melden). Die zusammengesetzten Typografie-Tokens tragen Aliase:
   `fontWeight: {semantic.measure.font-weight-<w>}`, `lineHeight: {semantic.measure.font-line-height-<l>}`,
   `letterSpacing: {semantic.measure.font-letter-spacing-<t>}`. `test/dtcg.test.mjs` Zeilen 80–82 entsprechend.
   **Bekannte Stelle:** die Wertform `number` verlangt `typeof $value === 'number'` (dtcg.test Zeile 49) — die
   Primitive `leading-*` und `weight-*` müssen im DTCG-Primitivteil als Zahl erscheinen (`1.4286`, nicht `"1.4286"`);
   wie `depth-*` heute zu `number` wird, steht in `dtcg.mjs` Zeile 11 (`/^\d+$/` — trifft `1.4286` **nicht**, und
   `tracking-3` = `0` würde `number` statt `dimension`). Die Zuordnung der Primitive darum nach Name, nicht nach Wert:
   `weight-*` → `fontWeight`, `leading-*` → `number`, `tracking-*` → `dimension`, `print-*` → `dimension`;
   `depth-*` bleibt `number`. `dimension` von `0` → `{ value: 0, unit: 'px' }` oder wie der Standardfall `0` heute
   behandelt (`depth-0` ist `number`) — vor dem Ändern in `dtcg.mjs` nachsehen und melden, wenn es keine Form gibt.
6. `tools/lint-css.mjs` Zeile 261: die Ausnahme für Maß-Literale in `base.css` gilt nur noch für `.tl-icon-`
   (`line-height: 1`, `1em`). `.tl-print-`, `line-height`, `letter-spacing` fallen heraus. Wenn danach `node tools/lint-css.mjs`
   ein Literal in `base.css` meldet, das **nicht** aus den Typo-/Druckklassen stammt: nicht lösen, melden.

**Fertig, wenn:** `npm run build && npm test` grün (Zahl melden), `node tools/lint-css.mjs` grün, `npm run test:dom` grün,
der Regressionstest aus Schritt 1 unverändert grün, `node tools/derive.mjs test/fixtures/probe.primitives.json
<scratch>/probe.theme.css` läuft durch. Zwei Commits (Test, Umstellung).

## Task 2 — Wache über alle Gruppen (Sonnet)

**Datei:** `test/tokens.test.mjs` (oder `test/generate.test.mjs`, wo der bestehende Test „tokens.css enthält keinen Wert“
steht — dort daneben).

Neuer Test „tokens.json trägt keinen Wert, nur Referenzen und Rollennamen“:

- `color.light`, `color.dark`, `effect.light`, `effect.dark`, `measure`, `density.normal`, `density.compact`, `layer`,
  `derived.candidates`: jedes Blatt, dessen Schlüssel nicht mit `_` beginnt, passt auf `/^\{[a-z0-9-]+\}$/` und nennt
  eine vorhandene Primitive.
- `derived.light`/`derived.dark`: jedes `surface` ist ein Schlüssel von `color.<modus>` (kein Wert).
- `type`, `print`: jedes Feld ist ein Name `/^[a-z][a-z0-9-]*$/`, und die zusammengesetzte Rolle
  (`font-family-<f>`, `font-size-<s>`, `font-weight-<w>`, `font-line-height-<l>`, `font-letter-spacing-<t>`) steht in `measure`.
- `prose`: Werte sind Arrays von Elementnamen `/^[a-z][a-z0-9]*$/`.
- **Jede oberste Gruppe** von `tokens.json` (außer `_`) muss in dieser Aufzählung vorkommen — eine neue Gruppe ohne Regel
  lässt den Test scheitern („Gruppe X ohne Literalprüfung“).

Gegenprobe im Commit-Text belegen: ein Literal (z. B. `"weight": 600`) vorübergehend in `type.body` → Test rot mit Pfad
`type.body.weight`; zurücknehmen.

**Fertig, wenn:** `npm test` grün, Gegenprobe rot gesehen, ein Commit.

## Task 3 — Doku (Orchestrator)

- `tl-design-system`: Vertragsdokumente, die Schriftstärke oder Zeilenhöhe als Zahl nennen, nur wenn sie falsch werden
  (`grep -rn "600\|1.4286" src/components/**/*.md`).
- Projekt-Repo: `docs/skalen.md` (Abschnitt Typografie: Werte jetzt Primitive), `docs/ui-durchgang.md` U66 erledigt,
  `STATUS.md`.

## Prüfung zum Schluss (Orchestrator)

- Gates selbst nachlaufen lassen; `dist/base.css` vorher/nachher: jede Typo-/Druckregel liest nur `var()`.
- Lokale Demo nicht nötig: der Regressionstest beweist gleiche Werte. Specimen `node tools/serve.mjs` einmal ansehen.
- `tools/check-messages-en.sh` nicht nötig (kein Java), trotzdem vor dem Push laufen lassen.

## Korrekturen aus dem Plan-Review (Fable, 13.11.) — gelten vor dem Text oben

Erprobt in einer Kopie: mit diesen Korrekturen `npm test` 687 grün, `lint-css` grün, `test:dom` 8 grün, `derive` auf
dem Probe-Fixture identisch, aufgelöste Werte aller 14 Klassen gleich. Patch-Skripte als Vorlage (nicht blind
anwenden, lesen): `/private/tmp/claude-501/-Users-hendrik-Claude-TopLogic-v8-DesignSystem/31df8c30-1a2c-44e1-b279-11e7428416d8/scratchpad/fix-dtcg.mjs`, `fix-tests.mjs`, `fix-lint.mjs`.

**Task 1, ergänzt:**

- **B1** `tools/dtcg.mjs:66` `parseDimension`: Einheiten `(rem|px|em|pt|%|vh|dvw|dvh)`; für `pt` eine Notiz nach dem
  Muster von `%`: `$extensions: {'com.top-logic.note': 'print unit, not a DTCG dimension'}`. Ohne das bricht schon `npm run build`.
- **B2** Die Primitive-Typisierung steht in `tools/dtcg.mjs:8` (`primType`), nicht Zeile 11 — `font` ist dort pauschal
  `fontFamily`. Neu: in der Gruppe `font` `weight-*` → `fontWeight`, `leading-*` → `number`, `tracking-*` → `dimension`,
  sonst `fontFamily`. In `primValue`: `case 'number': case 'fontWeight': return { $value: Number(raw) };`.
  `test/dtcg.test.mjs:58` (`Array.isArray` für jede `font`-Primitive) und `:99` (`fontFamily` für alle) prüfen je
  Namenspräfix bzw. `$type`. Der Satz zu `dtcg.test:49` oben ist hinfällig.
- **B3** `parseDimension`: `if (raw.trim() === '0') return { value: 0, unit: 'px' };` als erste Zeile (Entscheidung: `px`).
- **B4** `test/tokens.test.mjs:209` rechnet `… * 16 * k.lineHeight` → ``Number(R.measure[`font-line-height-${k.lineHeight}`])``.
- **B5** `test/tokens.test.mjs:431` → ``assert.equal(R.measure[`font-letter-spacing-${o.tracking}`], '0.04em')``.
- **H1** `print` bekommt einen `_`-Kommentar; beide Leser filtern `_`: `tools/generate.mjs:131` und `test/generate.test.mjs:81`.
- **H2** Der Helfer in `test/fundament.test.mjs:16–27` (`ebene`) gibt `Number(...)` zurück. Als String-Auflöser
  (Deklarationswert, Literal oder `var()` bis zum Literal) nach `test/lib/component.mjs` ziehen; `ebene` ruft ihn mit
  `Number(...)`. Der Regressionstest nutzt den String-Auflöser.
- **H3, entschieden: ja, neue Regel.** `tools/lint-css.mjs:261` Ausnahme nur noch `/\.tl-icon-/.test(sel)`. Dazu: in
  `base.css` müssen bei Selektoren `/\.tl-(type|print)-/` die Eigenschaften `font-family|font-size|font-weight|line-height|letter-spacing`
  auf `/^var\(--tl-font-[a-z0-9-]+\)$/` passen. `test/lint-css.test.mjs:117` (erlaubt heute `line-height: 1.4`) auf
  `var(--tl-font-line-height-body)` umstellen; je ein Lint-Test für: Literal `font-weight: 600` in `.tl-type-x` rot,
  `18pt` in `.tl-print-x` rot, `line-height: 1` in `.tl-icon-sm` grün. Pflicht, nicht „ggf.“.
- **H5** `test/dtcg.test.mjs:88–94` prüft Aliase auch in den Feldern von `$value` der Typografie-Tokens; Test für den
  Abbruch der Erzeugung bei unbekannter Rolle (`type.body.weight = 'bold'` → wirft, Meldung nennt Klasse, Feld, Rolle).
  `measureType` braucht nur `font-weight` → `fontWeight`, `font-line-height` → `number`; der Rest fällt auf `dimension`.
- Nicht im Umfang: Notiz für `em` (keine DTCG-Einheit, läuft heute ohne Notiz) — bleibt so.

**Task 2, ersetzt den Ort:** Die bestehende Wache steht in `test/layers.test.mjs:23–35` (`semantisch()` mit fünf
Gruppen, `leaves`). Dort erweitern, keinen zweiten Test. Zusätzlich schließen: `color`/`effect` genau `light, dark`;
`density` genau `normal, compact`; `derived` genau `light, dark, candidates`; Einträge unter `derived.<modus>` genau
`{surface}`; Feldmenge `type` = `family, size, weight, lineHeight, tracking`, `print` = `size, weight, lineHeight`.
Oberste Gruppen heute: `color, derived, effect, measure, density, layer, type, prose, print`.
