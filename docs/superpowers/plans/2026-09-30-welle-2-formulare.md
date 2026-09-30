# Welle 2 — Formulare: Implementierungsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Die zwölf Formular-Blöcke in `tlReactControls.css` sind leer und aus der Ratsche gestrichen; Feld, Auswahl, Select, Formular und Upload lesen einen Feldrahmen `tl-field` aus dem Paket, Zustände sind Attribute; Alert, Badge, Divider, Skeleton stehen im Paket.

**Architecture:** Zuerst das Paket (`design-system/`, Repo `main`): Rand-Rollen, dann je Gruppe CSS unter `src/components/<name>/`, Vertrag, Specimen, Gate. Danach die Engine (Worktree, Branch `CWS/CWS_29617_design_system_welle_2` auf dem Avatar-Branch von !1695): `dist/` hineinkopieren, TSX je Gruppe umstellen, alten Block löschen, Ratsche senken. Ein PR für die ganze Welle, Commits nach Gruppen.

**Tech Stack:** Paket: Node 22+, `node:test`, keine Abhängigkeit. Engine: React 19 + TypeScript (Vite, Bundle eingecheckt unter `src/main/webapp/script/`), Java 17 + Maven offline.

**Spec:** `docs/superpowers/specs/2026-09-30-welle-2-formulare-design.md`; Begründungen `docs/skalen.md` „Formulare: ein Feldrahmen, Zustände als Attribute“ und „Wellen überlappen, gemergt wird der Reihe nach“.

## Global Constraints

- Pfade: Paket `P=/Users/hendrik/Claude/TopLogic-v8-DesignSystem/design-system`, Worktree `WT=/Users/hendrik/Claude/TopLogic-v8-DesignSystem/_Working-Tree/tl8-wt-29584`, Modul `M=$WT/com.top_logic.layout.react`. Die Sandbox sieht nur den Projektordner und `~/.m2`; nichts unter `~/git` anfassen.
- Öffentliche Namen Englisch, kebab-case, Präfix `tl`. Klassen BEM `tl-block__element--modifier`. Kategorien geschlossen: `surface`, `text`, `icon`, `border`, `focus`, `shadow`, `space`, `radius`, `size`, `font`, `duration`, `easing`, `layer`, `status`.
- **Zustände sind Attribute, nie Klassen:** `:disabled`, `:checked`, `:indeterminate`, `[aria-invalid="true"]`, `[aria-checked]`, `[aria-pressed]`, `[aria-expanded]`, `[aria-busy]`, `:focus-visible`, `:hover`; ohne ARIA-Gegenstück `data-tl-state~="<wort>"` (Wortliste: `error`, `warning`, `dirty`, `dragover`, `dragging`, `drop-before`, `drop-after`, `highlighted`). Fehler ist `aria-invalid="true"`, wo ARIA es erlaubt (`textbox`, `combobox`, `checkbox`, `switch`, `radiogroup`, `listbox`, natives `input`/`select`/`textarea`), sonst `data-tl-state~="error"`. Warnung nur ohne Fehler.
- Kein Literal in einer Komponentendatei außer den Werten in `ALLOWED` von `tools/lint-css.mjs`; Maße, Farben, Dauern, Kurven, Ebenen nur aus `var(--tl-*)`. `font-size`/`font-weight`/`line-height` nur in `.tl-type-*`/`.tl-icon-*` in `base.css`; die Schrift setzt das Control von außen (`tl-type-body`, `tl-type-label` …).
- Kein `:focus` ohne `-visible`, kein `outline: none`. Den Ring liefert `base.css`.
- Kontrast: Text 4,5, Linie/Icon/Fläche 3,0 — in beiden Modi, gegen jede Fläche, auf der das Element liegt (Paarliste `tools/lib/pairs.mjs`, gilt auch für jedes `derive`-Theme). Disabled ist vom Gate ausgenommen.
- Komponenten lesen Rollen, nie Primitive: neue Maße sind Tokens in `src/tokens.json` (`measure`), die auf Primitive zeigen. Ein Wert in `tokens.json` ist ein Fehler. Keine Primitive ohne Leser.
- Nach jeder Änderung an `src/`: `cd $P && node tools/generate.mjs && node --test && node tools/lint-css.mjs` — alle grün vor dem Commit. `dist/` ist eingecheckt und byte-identisch.
- Altlast wird abgeschnitten, nicht übersetzt: keine Aliase alter Klassen, kein Übergang.
- Commits: Präfix `Ticket #29617: `, Trailer des ausführenden Modells (`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` bzw. `Claude Sonnet 5.5`). Paket-Commits deutsch; Engine-Commits englisch (Code, JavaDoc, Kommentare englisch).
- Engine vor jedem Push: `$P/tools/check-messages-en.sh` ohne Diff. Scheitert es offline an fehlenden Modulen, erst `cd $WT && mvn -o -q install -DskipTests -pl <Module mit Java-Änderungen seit master>` in **einem** Aufruf.
- Keine Zeitangaben in Docs. Änderungen an `docs/skalen.md` ziehen `docs/praesentation.md` und `STATUS.md` mit.
- `messages_en.properties` nie von Hand.

## Review Focus

1. **Lange Werte in schmalen Spalten:** ein Pill oder Linktext im Lesemodus in einer 120-px-Zelle endet mit Ellipse, nicht hart abgeschnitten — Specimen-Fall „schmale Zelle“ in Task 3, Sichtprüfung Task 12.
2. **Kompakte Dichte:** Feldhöhe, Innenabstand und die Trefferfläche von Checkbox/Radio folgen `data-tl-density="compact"`, die Schrift bleibt — Specimen-Schalter in jeder Paket-Task, Test prüft, dass Felder `size-control` und `space-control-*` lesen (Task 3, 4).
3. **Feld im Dialog, dunkel:** Rand, Fehler- und Warnrand halten 3,0 auf `surface-overlay` — Paarliste Task 1.
4. **Fehler und Warnung zugleich:** nur der Fehler wird gezeigt (Rand und Text) — Vertrag Feld (Task 3) nennt es, TSX-Regel in Task 8 und Task 11 (`hasError` gewinnt).
5. **Tastatur im Select:** Pfeiltasten bewegen `aria-activedescendant` und `data-tl-state~="highlighted"`, Enter wählt, Escape schließt, Rücktaste entfernt den letzten Chip — Vertrag Select (Task 5) listet es als Konformität, Sichtprüfung Task 12 spielt es durch.

---

## Dateiübersicht

**Paket `$P`**

| Datei | Aufgabe |
|---|---|
| `src/primitives.json`, `src/tokens.json` | Task 1: Rand-Rollen auf 3,0 gegen jeden Feldgrund. Tasks 3–7: neue Maße. |
| `tools/lib/pairs.mjs` | Task 1: Feldpaare. |
| `tools/generate.mjs` | Task 3: `.tl-visually-hidden` in `base.css`. |
| `tools/lint-css.mjs` | Tasks 3–7: `MODIFIERS` je neuem Block; `STATE_MODIFIER` um `error|warning|immutable|dragover|dragging|highlighted|collapsed`. |
| `test/lib/component.mjs` | Task 2: gemeinsame Helfer für Komponententests. |
| `src/components/field/` | Task 3: `field.css` (`tl-field`, `tl-field-group`, `tl-field-value`), Vertrag, Specimen. |
| `src/components/choice/` | Task 4: `choice.css` (`tl-checkbox`, `tl-radio`, `tl-choice`, `tl-choice-group`, `tl-segmented`, `tl-chip`), Vertrag, Specimen. |
| `src/components/select/` | Task 5: `select.css` (`tl-select` und Popup), Vertrag, Specimen. |
| `src/components/form/` | Task 6: `form.css` (`tl-form-field`, `tl-form-group`, `tl-form-layout`, `tl-field-list`), `upload.css` (`tl-upload`, `tl-file-upload`), Verträge, Specimen. |
| `src/components/{alert,badge,divider,skeleton}/` | Task 7. |
| `test/field.test.mjs`, `test/choice.test.mjs`, `test/select.test.mjs`, `test/form.test.mjs`, `test/feedback.test.mjs` | Gates je Gruppe. |
| `test/engine-classes.test.mjs` | Task 11: keine alte Klasse mehr in der Engine. |
| `test/ratchet.json` | Tasks 8–11: gestrichene Blöcke. |
| `specimen/index.html` | Links auf die neuen Specimen. |

**Engine `$M`** (Branch `CWS/CWS_29617_design_system_welle_2`)

| Datei | Task |
|---|---|
| `react-src/controls/TLTextInput.tsx`, `TLPasswordInput.tsx`, `TLNumberInput.tsx`, `TLDatePicker.tsx`, `TLSelect.tsx` | 8 |
| `react-src/controls/TLCheckbox.tsx`, `TLBooleanChoice.tsx`, `TLSegmentedChoice.tsx`, `TLOptionChips.tsx`, `TLColumnSelect.tsx` (nur Zeile 137) | 9 |
| `react-src/controls/TLDropdownSelect.tsx`, `selectOptions.tsx`, `TLResourceCell.tsx` | 10 |
| `react-src/controls/TLFormField.tsx`, `TLFormGroup.tsx`, `TLFormLayout.tsx`, `TLFieldList.tsx`, `TLPanel.tsx` (Zeilen 197–198), `TLFileUpload.tsx`, `TLBinaryField.tsx`, `TLUploadButton.tsx` | 11 |
| `src/main/webapp/style/tlReactControls.css` | 8–11: Blöcke löschen, Zell-Regeln im TableView-Block umbenennen |
| `src/main/webapp/style/tl-design-system/*.css` | 8: Kopie aus `$P/dist` (`publish-to-worktree.mjs`) |
| `src/main/webapp/script/tl-react-controls.js` | 8–11: erzeugtes Bundle, mit `mvn -o -q compile` |

Java bleibt unverändert: Alle Zustände kommen schon an (`hasError`, `hasWarnings`, `mandatory`, `editable`, `colorRole`). Ergibt sich doch eine Java-Änderung, gilt das `messages_en`-Gate.

---

### Task 1: Rand-Rollen halten 3,0 auf jedem Feldgrund

**Modell:** Opus implementiert, Opus reviewt (Rechenkern der Werte).

**Befund (gemessen am 30.09.):** hell `border-control` 2,94, `status-error-border` 2,86, `status-warning-border` 2,85 gegen `surface-field` (`gray-3`); dunkel 2,79 / 2,85 / 2,87 gegen `surface-overlay` (`gray-70`, Dialoge). Die Paarliste prüft diese Ränder bisher nur gegen `surface-base`/`-layer`.

**Files:**
- Modify: `$P/tools/lib/pairs.mjs`
- Modify: `$P/src/primitives.json`, `$P/src/tokens.json`
- Modify: `docs/skalen.md` im Repo-Wurzelverzeichnis (Tabellen „Rahmen: vier Stufen“ und „Semantik“), `docs/praesentation.md` falls Werte genannt, `STATUS.md`
- Regenerate: `$P/dist/*`, `$P/specimen/probe.theme.css`

**Interfaces:**
- Produces: `GRUENDE_FELD` in `pairs.mjs`; Primitive `gray-43`, `red-41`, `amber-36`, `amber-43`; `gray-35` entfällt.

- [ ] **Step 1: Paare ergänzen (failing test)**

In `tools/lib/pairs.mjs` unter `GRUENDE_FOKUS`:

```js
// Wo ein Feld liegt: auf dem Grund, auf Panels, verschachtelt, im Dialog — und seine eigene Fläche,
// denn der Rand grenzt beides ab (WCAG 1.4.11, „angrenzende Farben“).
const GRUENDE_FELD = ['surface-field', 'surface-base', 'surface-layer', 'surface-layer-nested', 'surface-overlay'];
```

In `kontrastPaare` vor `for (const bg of GRUENDE_FOKUS)`:

```js
  for (const bg of GRUENDE_FELD) {
    paar('border-control', bg, 3.0);
    paar('status-error-border', bg, 3.0);
    paar('status-warning-border', bg, 3.0);
  }
  paar('text-primary', 'surface-field', 4.5); paar('icon-secondary', 'surface-field', 3.0); // Schalterknopf
  paar('border-interactive', 'surface-brand-subtle', 3.0); // gewählter Chip, gewähltes Segment
```

**Nicht** in diese Task: `surface-brand` gegen `surface-overlay` (dunkel 2,31 — der angekreuzte Kasten und der Primär-Button im Dialog). Das ist der offene Punkt „`surface-overlay` ins Kontrast-Gate (Welle 4)“ aus STATUS; er betrifft die Markenfläche, nicht die Ränder, und bleibt dort. In `docs/skalen.md` beim Nachziehen (Step 6) als gemessenen Wert nennen.

Die bestehende Zeile `paar('border-control', 'surface-base', 3.0);` streichen (jetzt doppelt).

- [ ] **Step 2: Test laufen lassen — muss scheitern**

Run: `cd $P && node --test test/pairs.test.mjs 2>&1 | grep -E "^not ok|< 3|surface-(field|overlay)" | head`
Expected: FAIL in `pairs.test.mjs` (es prüft jedes Paar der Liste gegen das Paket) mit `border-control`, `status-error-border`, `status-warning-border` auf `surface-field` (hell) und `surface-overlay` (dunkel). `tokens.test.mjs` führt daneben eine eigene, kürzere Liste `forderung` — sie bleibt unverändert.

- [ ] **Step 3: Werte nachziehen**

`src/primitives.json`, `color`: hinzufügen
```json
"gray-43": "#75787D", "red-41": "#DC3B32", "amber-36": "#B28600", "amber-43": "#98720C"
```
und `"gray-35"` entfernen (einziger Leser war `border-control` hell). Einsortieren nach Stufe wie die Nachbarn.

`src/tokens.json`, `color.light`: `border-control` `{gray-35}` → `{gray-36}`, `status-error-border` `{red-32}` → `{red-35}`, `status-warning-border` `{amber-34}` → `{amber-36}`.
`color.dark`: `border-control` `{gray-45}` → `{gray-43}`, `status-error-border` `{red-42}` → `{red-41}`, `status-warning-border` `{amber-44}` → `{amber-43}`.

Begründung der Wahl (für den Commit und `skalen.md`): je die kleinste Verschiebung, die alle fünf Feldgründe trägt (`aufKontrast` aus `tools/lib/color.mjs`, Schritt 0,005 in L); hell nimmt `gray-36` und `red-35` eine vorhandene Stufe (`red-35` trägt dunkel `status-error-surface` — anderer Modus, keine Doppelrolle in einem Modus), sonst neue Stufen. Die Namen folgen `tools/lib/naming.mjs` (`stufe()`; `amber-35` ist belegt, darum rückt `#B28600` auf `amber-36`).

- [ ] **Step 4: Namen und Gates prüfen**

Run: `cd $P && node --input-type=module -e 'import {stufe,familie} from "./tools/lib/naming.mjs"; for (const h of ["#75787D","#DC3B32","#B28600","#98720C"]) console.log(h, familie(h), stufe(h))'`
Expected: `gray 43`, `red 41`, `amber 35` (rückt auf 36), `amber 43`.

Run: `cd $P && node tools/generate.mjs && node --test && node tools/lint-css.mjs`
Expected: alles grün. Scheitert `border-emphasis`-Abstand oder ein anderer Test an den neuen Werten, den Test lesen und die Ursache im Commit nennen — nicht den Test aufweichen.

- [ ] **Step 5: `derive` nachziehen**

Run: `cd $P && node tools/derive.mjs test/fixtures/probe.primitives.json specimen/probe.theme.css && node --test test/derive.test.mjs`
Expected: grün. Ändert sich die Zahl der Befunde im Kopf von `probe.theme.css`, ist das korrekt, solange jeder Befund aus einem *gelieferten* Wert stammt (Test „Entschuldigt ist ein Paar nur …“). Neue Befunde aus gerechneten Rollen sind ein Fehler im Nachführ-Pass — dann stoppen und berichten.

- [ ] **Step 6: `docs/skalen.md` nachziehen**

In „Rahmen: vier Stufen“: Zeile `border-control` auf `#888B90` / `#75787D`, Verhältnisse gegen `surface-base` neu rechnen und eintragen; Absatz anhängen:

```markdown
**Nachgezogen 30.09. (Welle 2):** Das Gate prüfte `border-control` gegen den Grund, nicht gegen die
Feldfläche und nicht im Dialog. Gemessen verfehlte er hell auf `surface-field` (2,94) und dunkel auf
`surface-overlay` (2,79). Jetzt prüft die Paarliste jeden Rand eines Felds gegen fünf Gründe —
Feldfläche, Grund, Panel, verschachteltes Panel, Dialog —, und `border-control`, `status-error-border`,
`status-warning-border` sind je um die kleinste Stufe verschoben, die alle fünf trägt. Gemessen, aber
offen gelassen für Welle 4 (Dialog): `surface-brand` auf `surface-overlay` dunkel 2,31 — der angekreuzte
Kasten und der Primär-Button im Dialog heben sich dort nur über Haken bzw. Beschriftung ab.
```

In „Semantik“ die Zeilen `border` für Fehler und Warnung auf die neuen Werte und Verhältnisse. `STATUS.md`: eine Zeile unter Welle 2.

- [ ] **Step 7: Commit**

```bash
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem && git add -A design-system docs STATUS.md && git commit -m "Ticket #29617: Rand-Rollen halten 3,0 auf jedem Feldgrund (Feldflaeche, Dialog)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Testhelfer für Komponenten

**Modell:** Sonnet implementiert, Sonnet reviewt.

**Files:**
- Create: `$P/test/lib/component.mjs`
- Create: `$P/test/component-lib.test.mjs`

**Interfaces:**
- Produces:
  - `readComponent(dir: string, file: string): string` — liest `src/components/<dir>/<file>`.
  - `varsOf(css: string): Set<string>` — alle `--tl-*` aus `var(...)`.
  - `colorVarsOf(css: string): string[]` — nur Farbrollen (`surface|text|icon|border|status|focus|category`), ohne `border-width-*`, sortiert, ohne `--tl-`-Präfix.
  - `declarationsOf(css: string, selector: string): string | null` — Rumpf der ersten Regel, deren Selektorliste `selector` exakt enthält.
  - `specimenProblems(html: string): string[]` — fehlende Schalter `id="mode"`/`id="density"`, fehlendes `/dist/components.css`, Inline-`style="` außerhalb `<style>`/`<script>`.
  - `missingInContract(md: string, names: string[]): string[]` — Namen, die im Vertrag nicht in Backticks vorkommen.
  - `contrastProblems(R, mode, pairs: {fg,bg,soll}[]): string[]` — gemessene Verfehlungen.

- [ ] **Step 1: Test schreiben**

`test/component-lib.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { varsOf, colorVarsOf, declarationsOf, specimenProblems, missingInContract } from './lib/component.mjs';

const CSS = `/* Kopf — steht vor dem ersten Selektor, wie in jeder Komponentendatei. */
.tl-a, .tl-a--x { color: var(--tl-text-primary); border: var(--tl-border-width-sm) solid var(--tl-border-control); }
.tl-a:hover { background: var(--tl-surface-interactive-hover); }`;

test('varsOf und colorVarsOf lesen Tokens, colorVarsOf ohne Maß-Rollen', () => {
  assert.deepEqual([...varsOf(CSS)].sort(), ['--tl-border-control', '--tl-border-width-sm', '--tl-surface-interactive-hover', '--tl-text-primary']);
  assert.deepEqual(colorVarsOf(CSS), ['border-control', 'surface-interactive-hover', 'text-primary']);
});

test('declarationsOf findet eine Regel über ein Glied der Selektorliste, auch hinter einem Kommentar', () => {
  assert.match(declarationsOf(CSS, '.tl-a'), /text-primary/);
  assert.match(declarationsOf(CSS, '.tl-a--x'), /text-primary/);
  assert.equal(declarationsOf(CSS, '.tl-b'), null);
});

test('specimenProblems meldet fehlende Schalter und Inline-Styles', () => {
  const ok = '<link href="/dist/components.css"><input id="mode"><input id="density"><style>.x{}</style>';
  assert.deepEqual(specimenProblems(ok), []);
  assert.equal(specimenProblems('<div style="color:red"></div>').length, 4);
});

test('missingInContract nennt, was nicht in Backticks steht', () => {
  assert.deepEqual(missingInContract('liest `--tl-text-primary`', ['--tl-text-primary', 'aria-invalid']), ['aria-invalid']);
});
```

- [ ] **Step 2: Laufen lassen — muss scheitern**

Run: `cd $P && node --test test/component-lib.test.mjs`
Expected: FAIL, `Cannot find module './lib/component.mjs'`.

- [ ] **Step 3: Implementieren**

`test/lib/component.mjs`:

```js
// Gemeinsame Helfer der Komponententests: lesen, was eine Komponente liest, zeigt und verspricht.
import { readFileSync } from 'node:fs';
import { ratio } from '../../tools/lib/contrast.mjs';

export const readComponent = (dir, file) =>
  readFileSync(new URL(`../../src/components/${dir}/${file}`, import.meta.url), 'utf8');

export const varsOf = (css) => new Set([...css.matchAll(/var\((--tl-[a-z0-9-]+)\)/g)].map((m) => m[1]));

export const colorVarsOf = (css) => [...varsOf(css)]
  .map((v) => v.replace(/^--tl-/, ''))
  .filter((v) => /^(surface|text|icon|border|status|focus|category)-/.test(v) && !/^border-width-/.test(v))
  .sort();

export function declarationsOf(css, selector) {
  // Kommentare zuerst weg — sonst hängt der Kopfkommentar der Datei vor dem ersten Selektor.
  const ohne = css.replace(/\/\*[\s\S]*?\*\//g, '');
  for (const m of ohne.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
    const selectors = m[1].split(',').map((s) => s.trim());
    if (selectors.includes(selector)) return m[2];
  }
  return null;
}

export function specimenProblems(html) {
  const p = [];
  if (!html.includes('id="mode"')) p.push('Schalter id="mode" fehlt');
  if (!html.includes('id="density"')) p.push('Schalter id="density" fehlt');
  if (!html.includes('/dist/components.css')) p.push('lädt /dist/components.css nicht');
  const ohne = html.replace(/<style>[\s\S]*?<\/style>/g, '').replace(/<script>[\s\S]*?<\/script>/g, '');
  if (/style="/.test(ohne)) p.push('Inline-Style im Specimen');
  return p;
}

export const missingInContract = (md, names) => names.filter((n) => !md.includes('`' + n) );

export function contrastProblems(R, mode, pairs) {
  const C = { ...R.color[mode], ...R.derived[mode] };
  const out = [];
  for (const { fg, bg, soll } of pairs) {
    if (!C[fg] || !C[bg]) { out.push(`${mode}: ${!C[fg] ? fg : bg} fehlt`); continue; }
    const r = ratio(C[fg], C[bg]);
    if (r < soll) out.push(`${mode}: ${fg} auf ${bg} ${r.toFixed(2)} < ${soll}`);
  }
  return out;
}
```

Hinweis: `missingInContract` prüft auf öffnenden Backtick plus Namen, damit `` `aria-invalid="true"` `` den Namen `aria-invalid` deckt.

- [ ] **Step 4: Laufen lassen — muss bestehen**

Run: `cd $P && node --test test/component-lib.test.mjs && node --test`
Expected: PASS, Gesamtzahl +4.

- [ ] **Step 5: Commit**

```bash
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem && git add design-system/test && git commit -m "Ticket #29617: Testhelfer fuer Komponenten (Tokens, Regeln, Specimen, Vertrag, Kontrast)

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Feld — `tl-field`, `tl-field-group`, `tl-field-value`, `tl-visually-hidden`

**Modell:** Opus implementiert, Opus reviewt (Vorlage für alle weiteren).

**Abweichung von Spec §3a, hier festgelegt:** Icon und Löschen sitzen nicht in einem Wrapper-`span.tl-field` mit rahmenlosem Input — der Fokusring läge dann innen um den Input, und ein `outline: none` ist verboten. Stattdessen trägt das echte `input` den Rahmen `tl-field`, ein Wrapper `span.tl-field-group` legt Icon (`__icon`) und Endknopf (`__action`: Löschen oder Öffnen) absolut darüber, und das Feld reserviert den Platz über `:has()`. Beim Commit Spec §3a in diesem Sinn berichtigen.

**Files:**
- Create: `$P/src/components/field/field.css`, `field.contract.md`, `field.spec.html`
- Create: `$P/test/field.test.mjs`
- Modify: `$P/tools/generate.mjs` (Regel `.tl-visually-hidden` in `base.css`), `$P/tools/lint-css.mjs`, `$P/specimen/index.html`

**Interfaces:**
- Consumes: Helfer aus Task 2; Paare aus Task 1.
- Produces (Klassen, von Tasks 5, 6, 8–11 benutzt): `tl-field`, `tl-field--multiline`, `tl-field-group`, `tl-field-group__icon`, `tl-field-group__action`, `tl-field-value`, `tl-field-value__text`, `tl-visually-hidden`.

- [ ] **Step 1: Gate schreiben**

`test/field.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from '../tools/resolve.mjs';
import { readComponent, colorVarsOf, declarationsOf, specimenProblems, missingInContract, varsOf } from './lib/component.mjs';

const P = JSON.parse(readFileSync(new URL('../src/primitives.json', import.meta.url)));
const T = JSON.parse(readFileSync(new URL('../src/tokens.json', import.meta.url)));
const css = readComponent('field', 'field.css');

test('field.css liest genau die Farbrollen des Feldes', () => {
  assert.deepEqual(colorVarsOf(css), [
    'border-control', 'border-disabled', 'border-emphasis', 'icon-secondary',
    'status-error-border', 'status-warning-border', 'surface-disabled', 'surface-field',
    'surface-interactive-hover', 'text-disabled', 'text-link', 'text-link-hover',
    'text-placeholder', 'text-primary',
  ]);
});

test('der Rahmen folgt der Dichte und hat keine Schriftregel', () => {
  const d = declarationsOf(css, '.tl-field');
  assert.ok(d, '.tl-field fehlt');
  for (const t of ['--tl-size-control', '--tl-space-control-x', '--tl-space-control-y', '--tl-radius-sm', '--tl-border-width-sm'])
    assert.ok(d.includes(t), `.tl-field liest ${t} nicht`);
  assert.doesNotMatch(css, /font(-size|-weight)?\s*:|line-height\s*:/);
});

test('Fehler liest aria-invalid und data-tl-state, Warnung data-tl-state, Deaktiviert :disabled', () => {
  assert.match(declarationsOf(css, '.tl-field[aria-invalid="true"]') ?? '', /status-error-border/);
  assert.match(declarationsOf(css, '.tl-field[data-tl-state~="error"]') ?? '', /status-error-border/);
  assert.match(declarationsOf(css, '.tl-field[data-tl-state~="warning"]') ?? '', /status-warning-border/);
  assert.match(declarationsOf(css, '.tl-field:disabled') ?? '', /surface-disabled/);
});

test('der Lesewert endet mit Ellipse und lässt seine Kinder schrumpfen', () => {
  assert.match(declarationsOf(css, '.tl-field-value') ?? '', /min-width:\s*0/);
  assert.match(declarationsOf(css, '.tl-field-value__text') ?? '', /text-overflow:\s*ellipsis/);
  assert.match(declarationsOf(css, '.tl-field-value > *') ?? '', /min-width:\s*0/);
});

test('tl-visually-hidden steht in base.css, ohne Maß-Literal', () => {
  const base = readFileSync(new URL('../dist/base.css', import.meta.url), 'utf8');
  const d = declarationsOf(base, '.tl-visually-hidden');
  assert.ok(d, '.tl-visually-hidden fehlt in base.css');
  assert.match(d, /clip-path:\s*inset\(50%\)/);
  assert.match(d, /position:\s*absolute/);
});

test('das Feld-Specimen zeigt jeden Zustand, jede Form, beide Flächen und eine schmale Zelle', () => {
  const html = readComponent('field', 'field.spec.html');
  assert.deepEqual(specimenProblems(html), []);
  for (const s of ['aria-invalid="true"', 'data-tl-state="warning"', 'disabled', 'placeholder=', 'tl-field--multiline',
    'tl-field-group__icon', 'tl-field-group__action', 'tl-field-value', 'tl-pill', 'specimen__cell', 'surface-layer', 'surface-overlay'])
    assert.ok(html.includes(s), `Specimen zeigt ${s} nicht`);
});

test('der Feld-Vertrag nennt jedes Token, jede Klasse und jedes Zustandsattribut', () => {
  const md = readComponent('field', 'field.contract.md');
  const names = [...varsOf(css), 'tl-field', 'tl-field--multiline', 'tl-field-group', 'tl-field-value',
    'aria-invalid', 'data-tl-state', 'disabled', 'aria-required', 'hasError', 'hasWarnings', 'editable'];
  assert.deepEqual(missingInContract(md, names), []);
});
```

- [ ] **Step 2: Laufen lassen — muss scheitern**

Run: `cd $P && node --test test/field.test.mjs`
Expected: FAIL, `ENOENT … field.css`.

- [ ] **Step 3: `field.css` schreiben**

```css
/* Feld — docs/skalen.md „Formulare: ein Feldrahmen, Zustände als Attribute“.
   Ein Rahmen für jedes Eingabefeld: Text, Passwort, Zahl, Datum, Select, die Wurzel des
   DropdownSelect. Der Rahmen folgt der Dichte; die Schrift setzt das Control von außen
   (tl-type-body), das Feld hat keine Schriftregel. Zustände sind Attribute: aria-invalid ist der
   Fehler — dasselbe Attribut für Screenreader und Bild —, data-tl-state~="error" dort, wo ARIA
   aria-invalid nicht erlaubt, data-tl-state~="warning" die Warnung, :disabled der deaktivierte
   Zustand. Schreibgeschützt ist kein Zustand, sondern ein anderes Element: tl-field-value. */

.tl-field {
  box-sizing: border-box;
  display: block;
  width: 100%;
  min-width: 0;
  min-height: var(--tl-size-control);
  margin: 0;
  padding: var(--tl-space-control-y) var(--tl-space-control-x);
  border: var(--tl-border-width-sm) solid var(--tl-border-control);
  border-radius: var(--tl-radius-sm);
  background: var(--tl-surface-field);
  color: var(--tl-text-primary);
}

.tl-field::placeholder {
  color: var(--tl-text-placeholder);
}

.tl-field:hover {
  border-color: var(--tl-border-emphasis);
}

.tl-field[aria-invalid="true"],
.tl-field[data-tl-state~="error"] {
  border-color: var(--tl-status-error-border);
}

.tl-field[data-tl-state~="warning"] {
  border-color: var(--tl-status-warning-border);
}

.tl-field:disabled {
  border-color: var(--tl-border-disabled);
  background: var(--tl-surface-disabled);
  color: var(--tl-text-disabled);
  cursor: not-allowed;
}

.tl-field--multiline {
  resize: vertical;
}

/* --- Feld mit Icon oder Endknopf ------------------------------------------------- */

/* Das echte Eingabefeld trägt den Rahmen und den Fokusring; Icon und Endknopf liegen darüber, das
   Feld reserviert ihren Platz. */
.tl-field-group {
  position: relative;
  display: block;
  min-width: 0;
}

.tl-field-group__icon,
.tl-field-group__action {
  position: absolute;
  inset-block: 0;
  display: flex;
  align-items: center;
  color: var(--tl-icon-secondary);
}

.tl-field-group__icon {
  inset-inline-start: var(--tl-space-control-x);
  pointer-events: none;
}

.tl-field-group__action {
  inset-inline-end: var(--tl-space-2xs);
  margin-block: var(--tl-space-2xs);
  padding: 0 var(--tl-space-xs);
  border: 0;
  border-radius: var(--tl-radius-sm);
  background: transparent;
  cursor: pointer;
}

.tl-field-group__action:hover {
  background: var(--tl-surface-interactive-hover);
}

.tl-field-group:has(> .tl-field-group__icon) > .tl-field {
  padding-inline-start: calc(var(--tl-space-control-x) + var(--tl-size-icon-sm) + var(--tl-space-xs));
}

.tl-field-group:has(> .tl-field-group__action) > .tl-field {
  padding-inline-end: calc(var(--tl-size-icon-sm) + var(--tl-space-sm) + var(--tl-space-2xs));
}

/* --- Lesewert ---------------------------------------------------------------------- */

/* Schreibgeschützt: kein Rahmen, eine Zeile, Ellipse. Kinder (Pill, Icon) dürfen schrumpfen, damit
   ein langer Wert in einer schmalen Zelle mit Ellipse endet statt hart abgeschnitten zu werden. */
.tl-field-value {
  display: inline-flex;
  align-items: center;
  gap: var(--tl-space-xs);
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  color: var(--tl-text-primary);
}

.tl-field-value > * {
  min-width: 0;
}

.tl-field-value__text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

a.tl-field-value {
  color: var(--tl-text-link);
}

a.tl-field-value:hover {
  color: var(--tl-text-link-hover);
}
```

`inset-block`, `inset-inline-start`, `inset-inline-end`, `pointer-events`, `margin-block` tragen nur Tokens, `0` oder `none` und bestehen das Lint. In Task 4 gilt dasselbe für `rotate(45deg)` (ein Winkel, kein Maß) und `opacity`-Anteile. `a.tl-field-value` ist ein Selektor mit Elementtyp — das Lint prüft nur die Klasse.

- [ ] **Step 4: `.tl-visually-hidden` in `base.css`**

In `tools/generate.mjs` bei den übrigen Grundklassen von `base.css` (dort, wo `.tl-nums` oder die Icon-Klassen erzeugt werden) anhängen:

```js
// Sichtbar nur für Screenreader: ohne Maß, das Clipping verbirgt das Element, absolute Lage nimmt es
// aus dem Fluss. Ersetzt tlVisuallyHidden des Altbestands.
const VISUALLY_HIDDEN = `.tl-visually-hidden {
  position: absolute;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  margin: 0;
  padding: 0;
  border: 0;
}
`;
```

und in die Ausgabe von `base.css` aufnehmen. `test/generate.test.mjs` hält `dist/` byte-identisch — nach `node tools/generate.mjs` ist das erfüllt. `inset(50%)` ist ein Anteil, kein Maß; das Lint prüft Maß-Literale nur mit Einheit hinter Leerraum und lässt es durch — im Kommentar der Regel so benennen, damit niemand es für ein Versehen hält.

- [ ] **Step 5: Lint kennt die Blöcke**

In `tools/lint-css.mjs`:

```js
const STATE_MODIFIER = /--(active|disabled|loading|hover|focus|focused|pressed|selected|open|closed|checked|busy|invalid|dirty|immutable|readonly|dragover|dragging|highlighted|collapsed)$/;
```

`error` und `warning` gehören **nicht** in diese Liste: an Pill und Alert sind sie Bedeutungen (`tl-pill--error`), kein Zustand. Dass `tl-field--error` kein Feld-Zustand sein darf, sichert die Modifier-Liste je Block (`tl-field` erlaubt nur `multiline`).

In `MODIFIERS`:

```js
  'tl-field': new Set(['multiline']),
  'tl-field-group': new Set([]),
  'tl-field-value': new Set([]),
```

`test/lint-css.test.mjs` um einen Fall ergänzen:

```js
test('ein Zustand als Modifier des Feldes bricht das Gate — als Zustandswort oder als fremder Modifier', () => {
  const known = new Set(['--tl-text-primary']);
  for (const m of ['immutable', 'readonly', 'dragover'])
    assert.ok(lint(`.tl-field--${m} { color: var(--tl-text-primary); }`, { known, file: 'x.css' })
      .some((v) => v.includes('Zustand als Modifier')), m);
  for (const m of ['error', 'warning'])
    assert.ok(lint(`.tl-field--${m} { color: var(--tl-text-primary); }`, { known, file: 'x.css' })
      .some((v) => v.includes('kein Modifier von tl-field')), m);
  assert.deepEqual(lint('.tl-pill--error { color: var(--tl-text-primary); }', { known, file: 'x.css' }), [], 'Bedeutung an der Pill bleibt erlaubt');
});
```

(Import von `lint` wie in den bestehenden Fällen der Datei.)

- [ ] **Step 6: Specimen `field.spec.html`**

Kopf, Schalter und Skript wie `src/components/progress/progress.spec.html` (Modus- und Dichte-Schalter, `/dist/components.css`), Klasse `tl-type-body` an jedem Feld. Inhalt, je einmal in `<section class="specimen__panel">` (Klasse liest `surface-layer`, Überschrift nennt `surface-layer`), einmal auf dem Grund und einmal in einem Abschnitt `.specimen__overlay` (liest `surface-overlay`, Überschrift nennt `surface-overlay`):

```html
<input class="tl-field tl-type-body" placeholder="Platzhalter">
<input class="tl-field tl-type-body" value="Wert">
<input class="tl-field tl-type-body" value="Fehler" aria-invalid="true">
<input class="tl-field tl-type-body" value="Warnung" data-tl-state="warning">
<input class="tl-field tl-type-body" value="deaktiviert" disabled>
<select class="tl-field tl-type-body"><option>Auswahl</option></select>
<textarea class="tl-field tl-field--multiline tl-type-body" rows="3">mehrzeilig</textarea>
<span class="tl-field-group">
  <span class="tl-field-group__icon"><i class="tl-icon-sm fa-solid fa-magnifying-glass" aria-hidden="true"></i></span>
  <input class="tl-field tl-type-body" value="mit Icon und Löschen">
  <button type="button" class="tl-field-group__action" aria-label="Löschen"><i class="tl-icon-sm fa-solid fa-xmark" aria-hidden="true"></i></button>
</span>
<span class="tl-field-value tl-type-body"><span class="tl-field-value__text">Lesewert</span></span>
<a href="#" class="tl-field-value tl-type-body"><span class="tl-field-value__text">root (Link)</span></a>
<div class="specimen__cell"><span class="tl-field-value tl-type-body"><span class="tl-pill tl-pill--warning"><span class="tl-pill__label">Ein sehr langer Statuswert</span></span></span></div>
```

`.specimen__cell { width: 7.5rem; }` (120 px) steht im `<style>` des Specimens — Specimen-Styles sind vom Gate ausgenommen. Jede Zeile mit Beschriftung links wie im Progress-Specimen.

`specimen/index.html`: Link `<a href="/src/components/field/field.spec.html">Feld</a>` neben den bestehenden Komponentenlinks.

- [ ] **Step 7: Vertrag `field.contract.md`**

Aufbau wie `src/components/button/button.contract.md`: Überschrift „Vertrag: Feld“, Absatz zum Zweck (TopLogic-Namen `TLTextInput`, `TLPasswordInput`, `TLNumberInput`, `TLDatePicker`, `TLSelect`), dann:

- `## Zustand` — Tabelle der Schlüssel aus `ReactFormFieldControl`: `value`, `editable`, `mandatory`, `hasError`, `errorMessage`, `hasWarnings`, `placeholder`, `icon`, `clearable`, `multiline`, `rows`; je Control die Zusätze (`inputType`, `inputMode`, `displayValue`, `options`).
- `## Aktionen` — `valueChanged` (bei Eingabe, entprellt `debounceMs`), `commit` (Blur bei `commitOnBlur`), `submit` (Enter bei `submitOnEnter`).
- `## Tokens` — Tabelle Teil → Token, alle Tokens aus `field.css` mit `--tl-`-Präfix in Backticks.
- `## Attribute` — `aria-invalid="true"` bei `hasError`; `data-tl-state="warning"` bei `hasWarnings && !hasError`; `disabled` bei `state.disabled`; `aria-required="true"` bei `mandatory`; bei `editable: false` kein Eingabefeld, sondern `tl-field-value`; Klassen `tl-field`, `tl-field--multiline`, `tl-field-group`, `tl-field-group__icon`, `tl-field-group__action`, `tl-field-value`, `tl-field-value__text`; `:focus-visible` aus `base.css`.
- `## Konformität` — Text wie beim Button: besteht, wenn jeder Zustand sein Attribut trägt, Fehler die Warnung verdrängt, `editable: false` kein `input` rendert, und das Klassen-Gate keine Klasse ohne `tl-` findet.

- [ ] **Step 8: Gates**

Run: `cd $P && node tools/generate.mjs && node --test && node tools/lint-css.mjs`
Expected: alles grün, `field.test.mjs` 7/7.

Dann im Browser: `cd $P && node tools/serve.mjs` (läuft im Hintergrund), `http://localhost:8137/src/components/field/field.spec.html` öffnen, hell/dunkel und kompakt umschalten; Bildschirmfoto hell und dunkel an den Review-Bericht hängen.

- [ ] **Step 9: Commit**

```bash
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem && git add -A design-system docs/superpowers/specs/2026-09-30-welle-2-formulare-design.md && git commit -m "Ticket #29617: Feld -- tl-field, tl-field-group, tl-field-value, tl-visually-hidden; Vertrag, Specimen, Gate

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Auswahl — Checkbox, Radio, Schalter, Segmente, Chips

**Modell:** Opus implementiert, Sonnet reviewt.

**Files:**
- Create: `$P/src/components/choice/choice.css`, `choice.contract.md`, `choice.spec.html`
- Create: `$P/test/choice.test.mjs`
- Modify: `$P/src/tokens.json` (`measure`), `$P/tools/lint-css.mjs`, `$P/specimen/index.html`

**Interfaces:**
- Consumes: Helfer Task 2.
- Produces: Klassen `tl-checkbox`, `tl-checkbox--switch`, `tl-radio`, `tl-choice`, `tl-choice-group`, `tl-segmented`, `tl-segmented__segment`, `tl-chip-group`, `tl-chip`; Tokens `size-choice` (`{size-4}`), `size-switch` (`{size-7}`), `size-switch-knob` (`{size-3}`).

- [ ] **Step 1: Gate schreiben**

`test/choice.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readComponent, colorVarsOf, declarationsOf, specimenProblems, missingInContract, varsOf } from './lib/component.mjs';

const T = JSON.parse(readFileSync(new URL('../src/tokens.json', import.meta.url)));
const css = readComponent('choice', 'choice.css');

test('drei Maße der Auswahl sind Tokens der Skala und folgen nicht der Dichte', () => {
  assert.equal(T.measure['size-choice'], '{size-4}');
  assert.equal(T.measure['size-switch'], '{size-7}');
  assert.equal(T.measure['size-switch-knob'], '{size-3}');
  for (const d of Object.values(T.density)) for (const k of ['size-choice', 'size-switch', 'size-switch-knob']) assert.ok(!(k in d), k);
});

test('choice.css liest genau diese Farbrollen', () => {
  assert.deepEqual(colorVarsOf(css), [
    'border-control', 'border-disabled', 'border-emphasis', 'border-interactive', 'icon-secondary',
    'status-error-border', 'status-warning-border', 'surface-brand', 'surface-brand-subtle',
    'surface-disabled', 'surface-field', 'surface-interactive-hover', 'text-disabled', 'text-on-brand', 'text-primary',
  ]);
});

test('Kästchen und Kreis zeichnen sich selbst, ohne Bild und ohne accent-color', () => {
  assert.match(declarationsOf(css, '.tl-checkbox') ?? '', /appearance:\s*none/);
  assert.doesNotMatch(css, /accent-color|url\(/);
  assert.match(declarationsOf(css, '.tl-checkbox:checked') ?? '', /surface-brand/);
  assert.ok(declarationsOf(css, '.tl-checkbox:indeterminate'), 'gemischter Zustand fehlt');
  assert.ok(declarationsOf(css, '.tl-radio:checked::after'), 'Punkt des Radio fehlt');
});

test('gewählt ist ein Attribut: aria-checked am Segment, aria-pressed am Chip', () => {
  assert.match(declarationsOf(css, '.tl-segmented__segment[aria-checked="true"]') ?? '', /surface-brand-subtle/);
  assert.match(declarationsOf(css, '.tl-segmented__segment[aria-pressed="true"]') ?? '', /surface-brand-subtle/);
  assert.match(declarationsOf(css, '.tl-chip[aria-pressed="true"]') ?? '', /border-interactive/);
  assert.doesNotMatch(css, /__marker|--selected/);
});

test('Fehler an Gruppen: aria-invalid an radiogroup, data-tl-state an group', () => {
  assert.ok(declarationsOf(css, '.tl-choice-group[aria-invalid="true"] .tl-radio'), 'radiogroup-Fehler fehlt');
  assert.ok(declarationsOf(css, '.tl-segmented[aria-invalid="true"]'), 'Segmente als radiogroup');
  assert.ok(declarationsOf(css, '.tl-chip-group[data-tl-state~="error"] .tl-chip'), 'Chip-Gruppe (role=group) fehlt');
});

test('die Trefferfläche ist eine Control-Höhe und folgt der Dichte', () => {
  assert.match(declarationsOf(css, '.tl-choice') ?? '', /min-height:\s*var\(--tl-size-control\)/);
});

test('das Auswahl-Specimen zeigt jede Form in jedem Zustand', () => {
  const html = readComponent('choice', 'choice.spec.html');
  assert.deepEqual(specimenProblems(html), []);
  for (const s of ['tl-checkbox', 'tl-checkbox--switch', 'role="switch"', 'tl-radio', 'role="radiogroup"', 'checked',
    'indeterminate', 'aria-invalid="true"', 'data-tl-state="warning"', 'disabled', 'tl-segmented', 'aria-checked="true"',
    'tl-chip', 'aria-pressed="true"', 'data-tl-state="error"'])
    assert.ok(html.includes(s), `Specimen zeigt ${s} nicht`);
});

test('der Auswahl-Vertrag nennt jedes Token, jede Klasse und jedes Attribut', () => {
  const md = readComponent('choice', 'choice.contract.md');
  const names = [...varsOf(css), 'tl-checkbox', 'tl-checkbox--switch', 'tl-radio', 'tl-choice', 'tl-choice-group',
    'tl-segmented', 'tl-chip', 'aria-checked', 'aria-pressed', 'aria-invalid', 'data-tl-state', 'role="switch"', 'role="radiogroup"'];
  assert.deepEqual(missingInContract(md, names), []);
});
```

- [ ] **Step 2: Laufen lassen — muss scheitern**

Run: `cd $P && node --test test/choice.test.mjs`
Expected: FAIL (`size-choice` fehlt, `choice.css` fehlt).

- [ ] **Step 3: Tokens**

`src/tokens.json`, `measure`, nach `size-progress`:
```json
"size-choice": "{size-4}", "size-switch": "{size-7}", "size-switch-knob": "{size-3}",
```

- [ ] **Step 4: `choice.css` schreiben**

```css
/* Auswahl — docs/skalen.md „Formulare: ein Feldrahmen, Zustände als Attribute“.
   Checkbox, Radio und Schalter zeichnen sich aus Tokens (appearance: none), nicht aus Browser-
   Standard und accent-color. Angekreuzt ist die Marke, der Haken die Beschriftung auf der Marke.
   Gewählt ist, was das Attribut sagt: :checked, :indeterminate, aria-checked, aria-pressed. Die
   Trefferfläche ist eine Control-Höhe; das Label gehört dazu. */

.tl-checkbox,
.tl-radio {
  appearance: none;
  box-sizing: border-box;
  flex: 0 0 auto;
  display: inline-grid;
  place-content: center;
  width: var(--tl-size-choice);
  height: var(--tl-size-choice);
  margin: 0;
  border: var(--tl-border-width-sm) solid var(--tl-border-control);
  background: var(--tl-surface-field);
  cursor: pointer;
}

.tl-checkbox {
  border-radius: var(--tl-radius-sm);
}

.tl-radio {
  border-radius: var(--tl-radius-round);
}

.tl-checkbox:hover,
.tl-radio:hover {
  border-color: var(--tl-border-emphasis);
}

.tl-checkbox:checked,
.tl-checkbox:indeterminate,
.tl-radio:checked {
  border-color: var(--tl-surface-brand);
  background: var(--tl-surface-brand);
}

/* Der Haken: zwei Ränder eines gedrehten Rechtecks, Anteile des Kästchens. */
.tl-checkbox:checked::after {
  content: "";
  width: calc(var(--tl-size-choice) * 0.3);
  height: calc(var(--tl-size-choice) * 0.55);
  border: solid var(--tl-text-on-brand);
  border-width: 0 var(--tl-border-width-md) var(--tl-border-width-md) 0;
  transform: translateY(calc(var(--tl-size-choice) * -0.06)) rotate(45deg);
}

.tl-checkbox:indeterminate::after {
  content: "";
  width: calc(var(--tl-size-choice) * 0.5);
  height: var(--tl-border-width-md);
  background: var(--tl-text-on-brand);
}

.tl-radio:checked::after {
  content: "";
  width: calc(var(--tl-size-choice) * 0.4);
  height: calc(var(--tl-size-choice) * 0.4);
  border-radius: var(--tl-radius-round);
  background: var(--tl-text-on-brand);
}

/* --- Schalter ---------------------------------------------------------------- */

.tl-checkbox--switch {
  width: var(--tl-size-switch);
  border-radius: var(--tl-radius-full);
  justify-content: start;
}

.tl-checkbox--switch::after,
.tl-checkbox--switch:checked::after {
  content: "";
  width: var(--tl-size-switch-knob);
  height: var(--tl-size-switch-knob);
  margin-inline-start: calc((var(--tl-size-choice) - var(--tl-size-switch-knob)) / 2 - var(--tl-border-width-sm));
  border: 0;
  border-radius: var(--tl-radius-round);
  background: var(--tl-icon-secondary);
  transform: none;
  transition: transform var(--tl-duration-fast) var(--tl-easing-standard);
}

.tl-checkbox--switch:checked::after {
  background: var(--tl-text-on-brand);
  transform: translateX(calc(var(--tl-size-switch) - var(--tl-size-choice)));
}

/* --- Zustände ----------------------------------------------------------------- */

.tl-checkbox[aria-invalid="true"],
.tl-radio[aria-invalid="true"],
.tl-choice-group[aria-invalid="true"] .tl-radio {
  border-color: var(--tl-status-error-border);
}

.tl-checkbox[data-tl-state~="warning"],
.tl-choice-group[data-tl-state~="warning"] .tl-radio {
  border-color: var(--tl-status-warning-border);
}

.tl-checkbox:disabled,
.tl-radio:disabled {
  border-color: var(--tl-border-disabled);
  background: var(--tl-surface-disabled);
  cursor: not-allowed;
}

.tl-checkbox:disabled:checked,
.tl-radio:disabled:checked {
  background: var(--tl-border-disabled);
}

/* --- Label und Gruppe ------------------------------------------------------------ */

.tl-choice {
  display: inline-flex;
  align-items: center;
  gap: var(--tl-space-xs);
  min-height: var(--tl-size-control);
  color: var(--tl-text-primary);
  cursor: pointer;
}

.tl-choice:has(:disabled) {
  color: var(--tl-text-disabled);
  cursor: not-allowed;
}

.tl-choice-group {
  display: flex;
  flex-wrap: wrap;
  column-gap: var(--tl-space-control-gap);
}

/* --- Segmente ----------------------------------------------------------------- */

/* Einfachwahl: role="radiogroup", Segmente role="radio" mit aria-checked. Mehrfachwahl:
   role="group", Segmente mit aria-pressed. Das gewählte Segment trägt die Fläche selbst. */
.tl-segmented {
  display: inline-flex;
  min-width: 0;
  border: var(--tl-border-width-sm) solid var(--tl-border-control);
  border-radius: var(--tl-radius-sm);
  background: var(--tl-surface-field);
}

.tl-segmented__segment {
  flex: 1 1 auto;
  min-width: 0;
  min-height: calc(var(--tl-size-control) - 2 * var(--tl-border-width-sm));
  padding: 0 var(--tl-space-control-x);
  border: var(--tl-border-width-sm) solid transparent;
  border-radius: var(--tl-radius-sm);
  background: transparent;
  color: var(--tl-text-primary);
  cursor: pointer;
}

.tl-segmented__segment:hover {
  background: var(--tl-surface-interactive-hover);
}

.tl-segmented__segment[aria-checked="true"],
.tl-segmented__segment[aria-pressed="true"] {
  border-color: var(--tl-border-interactive);
  background: var(--tl-surface-brand-subtle);
}

.tl-segmented[aria-invalid="true"],
.tl-segmented[data-tl-state~="error"] {
  border-color: var(--tl-status-error-border);
}

.tl-segmented[data-tl-state~="warning"] {
  border-color: var(--tl-status-warning-border);
}

.tl-segmented__segment:disabled {
  color: var(--tl-text-disabled);
  cursor: not-allowed;
}

/* --- Chips -------------------------------------------------------------------- */

.tl-chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--tl-space-xs);
}

.tl-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--tl-space-2xs);
  min-height: var(--tl-size-control-sm);
  padding: 0 var(--tl-space-sm);
  border: var(--tl-border-width-sm) solid var(--tl-border-control);
  border-radius: var(--tl-radius-full);
  background: var(--tl-surface-field);
  color: var(--tl-text-primary);
  cursor: pointer;
}

.tl-chip:hover {
  background: var(--tl-surface-interactive-hover);
}

.tl-chip[aria-pressed="true"] {
  border-color: var(--tl-border-interactive);
  background: var(--tl-surface-brand-subtle);
}

.tl-chip-group[aria-invalid="true"] .tl-chip,
.tl-chip-group[data-tl-state~="error"] .tl-chip {
  border-color: var(--tl-status-error-border);
}

.tl-chip-group[data-tl-state~="warning"] .tl-chip {
  border-color: var(--tl-status-warning-border);
}

.tl-chip:disabled {
  border-color: var(--tl-border-disabled);
  background: var(--tl-surface-disabled);
  color: var(--tl-text-disabled);
  cursor: not-allowed;
}
```

Der Test erwartet `.tl-chip-group[data-tl-state~="error"] .tl-chip` als eigenes Glied einer Selektorliste — so steht es oben.

- [ ] **Step 5: Lint**

`MODIFIERS` in `tools/lint-css.mjs`:
```js
  'tl-checkbox': new Set(['switch']),
  'tl-radio': new Set([]),
  'tl-choice': new Set([]),
  'tl-choice-group': new Set([]),
  'tl-segmented': new Set([]),
  'tl-chip-group': new Set([]),
  'tl-chip': new Set([]),
```

- [ ] **Step 6: Specimen und Vertrag**

`choice.spec.html` wie Task 3 Step 6 (Kopf, Schalter, beide Flächen). Inhalt je Fläche:

```html
<label class="tl-choice tl-type-body"><input type="checkbox" class="tl-checkbox"> aus</label>
<label class="tl-choice tl-type-body"><input type="checkbox" class="tl-checkbox" checked> an</label>
<label class="tl-choice tl-type-body"><input type="checkbox" class="tl-checkbox" aria-checked="mixed" data-indeterminate> gemischt</label>
<label class="tl-choice tl-type-body"><input type="checkbox" class="tl-checkbox" aria-invalid="true"> Fehler</label>
<label class="tl-choice tl-type-body"><input type="checkbox" class="tl-checkbox" data-tl-state="warning"> Warnung</label>
<label class="tl-choice tl-type-body"><input type="checkbox" class="tl-checkbox" disabled checked> deaktiviert</label>
<label class="tl-choice tl-type-body"><input type="checkbox" role="switch" class="tl-checkbox tl-checkbox--switch"> Schalter aus</label>
<label class="tl-choice tl-type-body"><input type="checkbox" role="switch" class="tl-checkbox tl-checkbox--switch" checked> Schalter an</label>
<span class="tl-choice-group" role="radiogroup" aria-label="Aktiv">
  <label class="tl-choice tl-type-body"><input type="radio" name="r1" class="tl-radio" checked> Ja</label>
  <label class="tl-choice tl-type-body"><input type="radio" name="r1" class="tl-radio"> Nein</label>
</span>
<span class="tl-choice-group" role="radiogroup" aria-label="Fehler" aria-invalid="true">
  <label class="tl-choice tl-type-body"><input type="radio" name="r2" class="tl-radio"> Ja</label>
  <label class="tl-choice tl-type-body"><input type="radio" name="r2" class="tl-radio"> Nein</label>
</span>
<div class="tl-segmented" role="radiogroup" aria-label="Ansicht">
  <button type="button" role="radio" aria-checked="true" class="tl-segmented__segment tl-type-label">Liste</button>
  <button type="button" role="radio" aria-checked="false" class="tl-segmented__segment tl-type-label">Kacheln</button>
</div>
<div class="tl-segmented" role="group" aria-label="Filter">
  <button type="button" aria-pressed="true" class="tl-segmented__segment tl-type-label">offen</button>
  <button type="button" aria-pressed="false" class="tl-segmented__segment tl-type-label">erledigt</button>
</div>
<div class="tl-chip-group" role="group" aria-label="Tags">
  <button type="button" aria-pressed="true" class="tl-chip tl-type-label">gewählt</button>
  <button type="button" aria-pressed="false" class="tl-chip tl-type-label">frei</button>
</div>
<div class="tl-chip-group" role="group" aria-label="Tags mit Fehler" data-tl-state="error">
  <button type="button" aria-pressed="false" class="tl-chip tl-type-label">frei</button>
</div>
```

Das Skript des Specimens setzt `indeterminate = true` an jedem `input[data-indeterminate]` (die Eigenschaft gibt es nicht als HTML-Attribut); dazu im Test-String `indeterminate` — er steht im Skript.

`choice.contract.md` nach dem Muster aus Task 3 Step 7; TopLogic-Namen `TLCheckbox`, `TLBooleanChoice`, `TLSegmentedChoice`, `TLOptionChips`. Zustand: Basisschlüssel plus `triState`, `display` (`switch`), `presentation`, `options`, `multiSelect`. Aktionen: `valueChanged`. Attribute: `:checked`, `:indeterminate` + `aria-checked="mixed"`, `role="switch"` + `aria-checked`, `role="radiogroup"` an der Radio- und Segmentgruppe (Einfachwahl), `role="group"` an Chips und Segmenten mit Mehrfachwahl, `aria-checked` bzw. `aria-pressed` am Segment, `aria-pressed` am Chip, Fehler `aria-invalid="true"` (Checkbox, Schalter, radiogroup) bzw. `data-tl-state="error"` (group), Warnung `data-tl-state="warning"`, roving `tabIndex` in Segmenten. Tokens: alle aus `choice.css`.

`specimen/index.html`: Link „Auswahl“.

- [ ] **Step 7: Gates und Sicht**

Run: `cd $P && node tools/generate.mjs && node --test && node tools/lint-css.mjs`
Expected: grün, `choice.test.mjs` 8/8. Specimen im Browser hell/dunkel/kompakt prüfen: Haken sitzt mittig, Schalterknopf wandert ganz nach rechts und bleibt in der Spur, Radio-Punkt rund. Bildschirmfotos an den Bericht.

- [ ] **Step 8: Commit**

```bash
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem && git add -A design-system && git commit -m "Ticket #29617: Auswahl -- Checkbox, Radio, Schalter aus Tokens; Segmente und Chips waehlen per Attribut

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Select — `tl-select` und Popup

**Modell:** Opus implementiert, Opus reviewt (Overlay, Tastatur).

**Files:**
- Create: `$P/src/components/select/select.css`, `select.contract.md`, `select.spec.html`
- Create: `$P/test/select.test.mjs`
- Modify: `$P/tools/lint-css.mjs`, `$P/specimen/index.html`

**Interfaces:**
- Consumes: `tl-field` (Task 3), `tl-pill` (Welle 1), `tl-progress` (Welle 1).
- Produces: `tl-select` (an derselben Wurzel wie `tl-field`), Elemente `tl-select__values`, `tl-select__value`, `tl-select__chip`, `tl-select__chip-remove`, `tl-select__controls`, `tl-select__clear`, `tl-select__arrow`, `tl-select__placeholder`, `tl-select__popup`, `tl-select__search`, `tl-select__list`, `tl-select__option`, `tl-select__status`, `tl-select__drag-handle`.

- [ ] **Step 1: Gate schreiben**

`test/select.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readComponent, colorVarsOf, declarationsOf, specimenProblems, missingInContract, varsOf } from './lib/component.mjs';

const css = readComponent('select', 'select.css');

test('select.css liest genau diese Farbrollen', () => {
  assert.deepEqual(colorVarsOf(css), [
    'border-interactive', 'border-separator', 'icon-secondary', 'status-error-text', 'surface-interactive-hover',
    'surface-interactive-selected', 'surface-overlay', 'text-placeholder', 'text-primary', 'text-secondary',
  ]);
});

test('das Popup schwebt: Overlay-Fläche, Popover-Schatten, Popover-Ebene, umschließender Radius', () => {
  const d = declarationsOf(css, '.tl-select__popup') ?? '';
  for (const t of ['--tl-surface-overlay', '--tl-shadow-popover', '--tl-layer-popover', '--tl-radius-md'])
    assert.ok(d.includes(t), `Popup liest ${t} nicht`);
  assert.doesNotMatch(css, /z-index:\s*\d/);
});

test('Hervorhebung und Ziehen sind data-tl-state, gewählt ist aria-selected', () => {
  assert.ok(declarationsOf(css, '.tl-select__option[data-tl-state~="highlighted"]'), 'Hervorhebung fehlt');
  assert.ok(declarationsOf(css, '.tl-select__chip[data-tl-state~="dragging"]'), 'Ziehen fehlt');
  assert.doesNotMatch(css, /--highlighted|--dragging|--open|--drop/);
});

test('eine Option ist eine Zeile hoch, ein Treffer ist fett über die Typo-Klasse', () => {
  assert.match(declarationsOf(css, '.tl-select__option') ?? '', /min-height:\s*var\(--tl-size-row\)/);
  const ohneKommentare = css.replace(/\/\*[\s\S]*?\*\//g, '');
  assert.doesNotMatch(ohneKommentare, /\bstrong\b|font-weight/);
});

test('Wurzel und Suchfeld schalten den Fokusring nicht ab', () => {
  assert.doesNotMatch(css, /outline\s*:\s*(none|0)/);
});

test('das Select-Specimen zeigt leer, einzeln mit Pill, mehrfach, offen, laden, Fehler, keine Treffer, Lesewert', () => {
  const html = readComponent('select', 'select.spec.html');
  assert.deepEqual(specimenProblems(html), []);
  for (const s of ['tl-select__placeholder', 'tl-select__value', 'tl-pill', 'tl-select__chip', 'aria-expanded="true"',
    'tl-select__popup', 'data-tl-state="highlighted"', 'aria-busy="true"', 'tl-select__status', 'aria-invalid="true"',
    'tl-field-value', 'aria-activedescendant'])
    assert.ok(html.includes(s), `Specimen zeigt ${s} nicht`);
});

test('der Select-Vertrag nennt Tokens, Klassen, Attribute und die Tastatur', () => {
  const md = readComponent('select', 'select.contract.md');
  const names = [...varsOf(css), 'tl-select', 'tl-field', 'role="combobox"', 'aria-expanded', 'aria-activedescendant',
    'aria-selected', 'role="listbox"', 'role="option"', 'data-tl-state', 'aria-invalid', 'colorRole',
    'ArrowDown', 'ArrowUp', 'Enter', 'Escape', 'Backspace', 'valueChanged', 'loadOptions', 'goto'];
  assert.deepEqual(missingInContract(md, names), []);
});
```

- [ ] **Step 2: Laufen lassen — muss scheitern**

Run: `cd $P && node --test test/select.test.mjs`
Expected: FAIL (`ENOENT … select.css`).

- [ ] **Step 3: `select.css` schreiben**

Die Wurzel ist `div.tl-field.tl-select[role="combobox"]` — Rahmen, Zustände (Fehler, Warnung, deaktiviert) und Fokusring kommen aus `field.css`; `select.css` legt nur Innenaufbau und Popup fest. Regeln (jede Zeile ein Selektor, rechts die Deklarationen; nur Tokens):

| Selektor | Deklarationen |
|---|---|
| `.tl-select` | `display: flex; align-items: center; gap: var(--tl-space-xs); cursor: pointer;` |
| `.tl-select__values` | `display: flex; flex: 1 1 auto; flex-wrap: wrap; align-items: center; gap: var(--tl-space-2xs); min-width: 0;` |
| `.tl-select__value` | `display: inline-flex; align-items: center; gap: var(--tl-space-xs); min-width: 0; overflow: hidden;` |
| `.tl-select__value > *` | `min-width: 0;` |
| `.tl-select__placeholder` | `color: var(--tl-text-placeholder);` |
| `.tl-select__chip` | `display: inline-flex; align-items: center; gap: var(--tl-space-2xs); min-width: 0;` (der Chip ist ein `tl-pill` plus Knopf; Fläche und Linie kommen aus der Pill) |
| `.tl-select__chip-remove`, `.tl-select__clear` | `display: inline-flex; align-items: center; padding: 0; border: 0; border-radius: var(--tl-radius-sm); background: transparent; color: var(--tl-icon-secondary); cursor: pointer;` |
| `.tl-select__chip-remove:hover`, `.tl-select__clear:hover` | `background: var(--tl-surface-interactive-hover);` |
| `.tl-select__drag-handle` | `color: var(--tl-icon-secondary); cursor: grab;` |
| `.tl-select__chip[data-tl-state~="dragging"]` | `opacity: 0.4;` |
| `.tl-select__chip[data-tl-state~="drop-before"]` | `box-shadow: inset var(--tl-border-width-accent) 0 0 0 var(--tl-border-interactive);` (das Gate erlaubt `box-shadow` nur als `--tl-shadow-*` oder als `inset`-Linie) |
| `.tl-select__chip[data-tl-state~="drop-after"]` | `box-shadow: inset calc(-1 * var(--tl-border-width-accent)) 0 0 0 var(--tl-border-interactive);` |
| `.tl-select__controls` | `display: flex; flex: 0 0 auto; align-items: center; gap: var(--tl-space-2xs);` |
| `.tl-select__arrow` | `color: var(--tl-icon-secondary);` |
| `.tl-select__popup` | `position: fixed; z-index: var(--tl-layer-popover); display: flex; flex-direction: column; box-sizing: border-box; max-height: calc(8 * var(--tl-size-row) + var(--tl-size-control) + 2 * var(--tl-space-xs)); overflow: hidden; padding: var(--tl-space-xs); border: var(--tl-border-width-sm) solid var(--tl-border-separator); border-radius: var(--tl-radius-md); background: var(--tl-surface-overlay); box-shadow: var(--tl-shadow-popover); color: var(--tl-text-primary);` |
| `.tl-select__search` | `flex: 0 0 auto; margin-bottom: var(--tl-space-xs);` (das Suchfeld trägt zusätzlich `tl-field`) |
| `.tl-select__list` | `flex: 1 1 auto; overflow-y: auto; margin: 0; padding: 0;` |
| `.tl-select__option` | `display: flex; align-items: center; gap: var(--tl-space-xs); min-height: var(--tl-size-row); padding: 0 var(--tl-space-control-x); border-radius: var(--tl-radius-sm); cursor: pointer;` |
| `.tl-select__option:hover` | `background: var(--tl-surface-interactive-hover);` |
| `.tl-select__option[data-tl-state~="highlighted"]` | `background: var(--tl-surface-interactive-selected); box-shadow: inset var(--tl-border-width-accent) 0 0 0 var(--tl-border-interactive);` |
| `.tl-select__status` | `display: flex; align-items: center; gap: var(--tl-space-xs); min-height: var(--tl-size-row); padding: 0 var(--tl-space-control-x); color: var(--tl-text-secondary);` |
| `.tl-select__status[role="alert"]` | `color: var(--tl-status-error-text);` |

Vor dem Schreiben prüfen: `--tl-layer-popover` ist eine Zahl (`depth-*`), `z-index: var(...)` besteht das Gate; `max-height` mit `calc` aus Tokens ist kein Literal (die `8` ist eine Anzahl Zeilen, einheitenlos — im Kommentar so begründen). `status-error-text` auf `surface-overlay`: Paar in `pairs.mjs` ergänzen (`paar('status-error-text', 'surface-overlay', 4.5); paar('text-secondary', 'surface-overlay', 4.5);`) und prüfen, dass es in beiden Modi hält; sonst stoppen und berichten. Kopf-Kommentar der Datei nach dem Muster von `field.css` mit Verweis auf `docs/skalen.md` und Begründung „Popup schwebt, darum Schatten“.

- [ ] **Step 4: Lint**

```js
  'tl-select': new Set([]),
```

- [ ] **Step 5: Specimen und Vertrag**

`select.spec.html`: statische Nachbildungen (kein Skript nötig außer Modus/Dichte), je als `div.tl-field.tl-select.tl-type-body[role="combobox"][tabindex="0"]`:
leer mit `span.tl-select__placeholder`; einzeln mit `span.tl-select__value` > `tl-pill tl-pill--warning`; mehrfach mit drei `span.tl-select__chip` (Pill + `button.tl-select__chip-remove` mit `<i class="tl-icon-sm fa-solid fa-xmark" aria-hidden="true">`), einer davon `data-tl-state="dragging"`; mit Fehler `aria-invalid="true"`; offen `aria-expanded="true"` mit einem direkt darunter stehenden `div.tl-select__popup` (im Specimen `position: static` über eine Specimen-Klasse, damit es im Fluss steht) samt `input.tl-field.tl-select__search[aria-activedescendant="opt-2"]`, `div.tl-select__list[role="listbox"]` und drei `div.tl-select__option[role="option"]` (eine `data-tl-state="highlighted"`, eine `aria-selected="true"`, Treffer als `<span class="tl-type-body-strong">`); ein Popup mit `div.tl-select__status` und `div.tl-progress[aria-busy="true"]`; eines mit `div.tl-select__status[role="alert"]` „Laden fehlgeschlagen“; eines „Keine Treffer“. Dazu ein Lesewert `span.tl-field-value` mit Pill. Beide Flächen, beide Modi, beide Dichten.

`select.contract.md` (TopLogic-Name `TLDropdownSelect`, Anzeigen `TLOptionChips`/`TLSegmentedChoice` verweisen auf den Auswahl-Vertrag): Zustand `value` (Liste von `OptionDescriptor {value,label,image?,colorRole?,link?}`), `options`, `optionsLoaded`, `multiSelect`, `customOrder`, `mandatory`, `emptyOptionLabel`, `editable`, `hasError`, `hasWarnings`. Aktionen: `valueChanged`, `loadOptions` (beim ersten Öffnen), `selectByKey`, `goto` (Link im Lesemodus). Tastatur (Konformität): `ArrowDown`/`ArrowUp` bewegen die Hervorhebung, `Enter` wählt, `Escape` schließt, `Backspace` im leeren Suchfeld entfernt den letzten Chip, Tippen filtert. Attribute: `role="combobox"`, `aria-expanded`, `aria-haspopup="listbox"`, `aria-controls` auf die Liste, `aria-activedescendant` am Suchfeld, `role="listbox"`, `role="option"` mit `aria-selected` nur für Gewähltes, `data-tl-state="highlighted"`, `aria-invalid="true"`, `data-tl-state="warning"`, `aria-busy="true"` am Fortschritt. Pill: ein Wert mit `colorRole` erscheint als `tl-pill` — gewählt, im Chip und im Lesewert.

- [ ] **Step 6: Gates und Sicht**

Run: `cd $P && node tools/generate.mjs && node --test && node tools/lint-css.mjs`
Expected: grün, `select.test.mjs` 7/7. Specimen im Browser, hell/dunkel/kompakt, Bildschirmfotos.

- [ ] **Step 7: Commit**

```bash
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem && git add -A design-system && git commit -m "Ticket #29617: Select -- tl-select mit schwebendem Popup; Hervorhebung und Ziehen als Attribut, Einzelwert als Pill

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Formular und Upload

**Modell:** Sonnet implementiert, Opus reviewt.

**Files:**
- Create: `$P/src/components/form/form.css`, `form.contract.md`, `form.spec.html`, `upload.css`, `upload.contract.md`
- Create: `$P/test/form.test.mjs`
- Modify: `$P/src/primitives.json`, `$P/src/tokens.json`, `$P/tools/lint-css.mjs`, `$P/specimen/index.html`

**Interfaces:**
- Consumes: `tl-field`, `tl-visually-hidden` (Task 3), `tl-checkbox` (Task 4), `tl-button` (Welle 1).
- Produces: Klassen `tl-form-field` (`--side|--top|--after|--hidden|--full`, Elemente `__label`, `__label-text`, `__required`, `__dirty`, `__help`, `__input`, `__message`, `__help-text`), `tl-form-group` (`--separator|--outlined|--full`, Elemente `__header`, `__toggle`, `__title`, `__actions`, `__body`), `tl-form-layout` (`--fill`, Elemente `__empty`), `tl-field-list` (`__title`, `__fields`, `__item`), `tl-upload`, `tl-file-upload` (`__status`); Tokens `size-indicator` (`{size-2}`), `size-field-label-min` (`{size-10}`), `size-field-label-max` (`{size-11}`); Primitive `size-10: 6rem`, `size-11: 10rem`.

- [ ] **Step 1: Gate schreiben**

`test/form.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readComponent, colorVarsOf, declarationsOf, specimenProblems, missingInContract, varsOf } from './lib/component.mjs';

const P = JSON.parse(readFileSync(new URL('../src/primitives.json', import.meta.url)));
const T = JSON.parse(readFileSync(new URL('../src/tokens.json', import.meta.url)));
const form = readComponent('form', 'form.css');
const upload = readComponent('form', 'upload.css');

test('die Label-Spalte und der Geändert-Punkt sind Tokens auf der Skala', () => {
  assert.equal(P.measure['size-10'], '6rem');
  assert.equal(P.measure['size-11'], '10rem');
  assert.equal(T.measure['size-field-label-min'], '{size-10}');
  assert.equal(T.measure['size-field-label-max'], '{size-11}');
  assert.equal(T.measure['size-indicator'], '{size-2}');
});

test('form.css liest genau diese Farbrollen, layer-accent nicht mehr', () => {
  assert.deepEqual(colorVarsOf(form), [
    'border-control', 'border-separator', 'status-error-text', 'status-warning-text', 'surface-brand',
    'surface-interactive-hover', 'text-helper', 'text-primary', 'text-secondary',
  ]);
});

test('die Seitenlage nimmt die Label-Spalte aus Tokens, kein Literal', () => {
  const d = declarationsOf(form, '.tl-form-field--side') ?? '';
  assert.match(d, /minmax\(var\(--tl-size-field-label-min\),\s*var\(--tl-size-field-label-max\)\)/);
});

test('geändert und eingeklappt sind Attribute', () => {
  assert.ok(declarationsOf(form, '.tl-form-field[data-tl-state~="dirty"] .tl-form-field__dirty'), 'dirty fehlt');
  assert.ok(declarationsOf(form, '.tl-form-group__body[hidden]'), 'eingeklappt fehlt');
  assert.doesNotMatch(form, /--collapsed|--dirty|--error|--warning|--readonly/);
});

test('upload.css: die Drop-Zone zeigt dragover als Attribut, gestrichelt in der Markenlinie', () => {
  const d = declarationsOf(upload, '.tl-file-upload[data-tl-state~="dragover"]') ?? '';
  assert.match(d, /dashed/);
  assert.match(d, /--tl-border-interactive/);
  assert.ok(declarationsOf(upload, '.tl-upload'), 'tl-upload fehlt');
  assert.doesNotMatch(upload, /outline\s*:\s*(none|0)/);
});

test('das Formular-Specimen zeigt jede Label-Lage, Pflicht, Hilfe, Fehler, Warnung, geändert, Gruppe, Upload', () => {
  const html = readComponent('form', 'form.spec.html');
  assert.deepEqual(specimenProblems(html), []);
  for (const s of ['tl-form-field--side', 'tl-form-field--top', 'tl-form-field--after', 'tl-visually-hidden',
    'tl-form-field__required', 'aria-required="true"', 'tl-form-field__help-text', 'role="alert"', 'aria-live="polite"',
    'data-tl-state="dirty"', 'tl-form-group--outlined', 'aria-expanded="false"', 'hidden', 'tl-form-layout',
    'tl-field-list', 'tl-upload', 'tl-file-upload', 'data-tl-state="dragover"', 'aria-busy="true"'])
    assert.ok(html.includes(s), `Specimen zeigt ${s} nicht`);
});

test('die Verträge nennen Tokens, Klassen und Attribute', () => {
  const md = readComponent('form', 'form.contract.md');
  assert.deepEqual(missingInContract(md, [...varsOf(form), 'tl-form-field', 'tl-form-group', 'tl-form-layout',
    'tl-field-list', 'data-tl-state', 'aria-required', 'aria-expanded', 'role="alert"', 'aria-live', 'labelPosition']), []);
  const up = readComponent('form', 'upload.contract.md');
  assert.deepEqual(missingInContract(up, [...varsOf(upload), 'tl-upload', 'tl-file-upload', 'tl-button',
    'aria-busy', 'data-tl-state']), []);
});
```

- [ ] **Step 2: Laufen lassen — muss scheitern**

Run: `cd $P && node --test test/form.test.mjs`
Expected: FAIL.

- [ ] **Step 3: Primitive und Tokens**

`src/primitives.json`, `measure`: nach `size-9` `"size-10": "6rem", "size-11": "10rem"`.
`src/tokens.json`, `measure`: `"size-indicator": "{size-2}", "size-field-label-min": "{size-10}", "size-field-label-max": "{size-11}"`.

- [ ] **Step 4: `form.css`**

Kopf-Kommentar mit Verweis auf `docs/skalen.md` und Spec §6. Regeln (nur Tokens):

| Selektor | Deklarationen |
|---|---|
| `.tl-form-field` | `display: grid; gap: var(--tl-space-2xs); min-width: 0;` |
| `.tl-form-field--side` | `grid-template-columns: minmax(var(--tl-size-field-label-min), var(--tl-size-field-label-max)) minmax(0, 1fr); column-gap: var(--tl-space-sm); align-items: start;` |
| `.tl-form-field--side > .tl-form-field__message`, `.tl-form-field--side > .tl-form-field__help-text` | `grid-column: 2;` |
| `.tl-form-field--after` | `grid-template-columns: auto minmax(0, 1fr); column-gap: var(--tl-space-xs); align-items: center;` |
| `.tl-form-field--after > .tl-form-field__input` | `grid-column: 1; grid-row: 1;` |
| `.tl-form-field--after > .tl-form-field__label` | `grid-column: 2; grid-row: 1;` |
| `.tl-form-field--full` | `grid-column: 1 / -1;` |
| `.tl-form-field__label` | `display: flex; align-items: center; gap: var(--tl-space-2xs); min-height: var(--tl-size-control); min-width: 0; color: var(--tl-text-secondary);` |
| `.tl-form-field--top > .tl-form-field__label` | `min-height: 0;` |
| `.tl-form-field__label-text` | `min-width: 0; overflow: hidden; text-overflow: ellipsis;` |
| `.tl-form-field__required` | `color: var(--tl-status-error-text);` |
| `.tl-form-field__dirty` | `display: none; width: var(--tl-size-indicator); height: var(--tl-size-indicator); border-radius: var(--tl-radius-round); background: var(--tl-surface-brand);` |
| `.tl-form-field[data-tl-state~="dirty"] .tl-form-field__dirty` | `display: inline-block;` |
| `.tl-form-field__input` | `min-width: 0;` |
| `.tl-form-field__message` | `display: flex; align-items: start; gap: var(--tl-space-2xs);` |
| `.tl-form-field__message[role="alert"]` | `color: var(--tl-status-error-text);` |
| `.tl-form-field__message[aria-live="polite"]` | `color: var(--tl-status-warning-text);` |
| `.tl-form-field__help-text` | `color: var(--tl-text-helper);` |
| `.tl-form-group` | `display: grid; gap: var(--tl-space-sm); min-width: 0;` |
| `.tl-form-group--separator` | `padding-top: var(--tl-space-sm); border-top: var(--tl-border-width-sm) solid var(--tl-border-separator);` |
| `.tl-form-group--outlined` | `padding: var(--tl-space-md); border: var(--tl-border-width-sm) solid var(--tl-border-control); border-radius: var(--tl-radius-md);` |
| `.tl-form-group__header` | `display: flex; align-items: center; gap: var(--tl-space-xs); min-height: var(--tl-size-control); color: var(--tl-text-primary);` |
| `.tl-form-group__toggle` | `display: inline-flex; align-items: center; justify-content: center; width: var(--tl-size-control); height: var(--tl-size-control); padding: 0; border: 0; border-radius: var(--tl-radius-sm); background: transparent; color: inherit; cursor: pointer;` |
| `.tl-form-group__toggle:hover` | `background: var(--tl-surface-interactive-hover);` |
| `.tl-form-group__title` | `flex: 1 1 auto; min-width: 0;` |
| `.tl-form-group__actions` | `display: flex; gap: var(--tl-space-2xs);` |
| `.tl-form-group__body[hidden]` | `display: none;` |
| `.tl-form-group--full` | `grid-column: 1 / -1;` |
| `.tl-form-layout` | `display: grid; gap: var(--tl-space-md); min-width: 0;` |
| `.tl-form-layout__empty` | `color: var(--tl-text-secondary);` |
| `.tl-form-layout--fill` | die Deklarationen des alten `.tlFormLayout--fill` (lesen in `$M/src/main/webapp/style/tlReactControls.css`, Block TLFormLayout), jedes Literal durch ein Token ersetzt; ist dort nichts außer `flex`/`min-height: 0`, genau das |
| `.tl-field-list` | `display: grid; gap: var(--tl-space-sm);` |
| `.tl-field-list__title` | `margin: 0; padding-bottom: var(--tl-space-xs); border-bottom: var(--tl-border-width-sm) solid var(--tl-border-separator); color: var(--tl-text-primary);` |
| `.tl-field-list__fields` | `display: grid; gap: var(--tl-space-sm);` |

`border-control` am umrandeten Gruppenrahmen ist Absicht: er begrenzt ein Bedienfeld (skalen.md „Rahmen“). Der Hilfe-Knopf ist ein `tl-button tl-button--ghost tl-button--sm` mit `ThemeIcon` — keine eigene Regel. Die Spaltenbreite von `tl-form-layout` setzt das Control inline (Daten, Spec §6).

- [ ] **Step 5: `upload.css`**

| Selektor | Deklarationen |
|---|---|
| `.tl-upload` | `display: inline-flex; align-items: center; gap: var(--tl-space-control-gap);` |
| `.tl-file-upload` | `display: inline-flex; align-items: center; gap: var(--tl-space-xs); min-width: 0; border-radius: var(--tl-radius-sm);` |
| `.tl-file-upload[data-tl-state~="dragover"]` | `outline: var(--tl-border-width-md) dashed var(--tl-border-interactive); outline-offset: var(--tl-focus-offset);` |
| `.tl-file-upload__status` | `color: var(--tl-text-secondary);` |
| `.tl-file-upload__status[role="alert"]` | `color: var(--tl-status-error-text);` |

`outline` mit `dashed` schaltet den Ring nicht ab (Lint prüft nur `none|hidden|0`); die Drop-Markierung ist kein Fokusring, darum nicht `focus-ring`. Der Knopf ist ein `tl-button tl-button--secondary`, Hochladen `aria-busy="true"` am Knopf.

- [ ] **Step 6: Lint**

```js
  'tl-form-field': new Set(['side', 'top', 'after', 'hidden', 'full']),
  'tl-form-group': new Set(['separator', 'outlined', 'full']),
  'tl-form-layout': new Set(['fill']),
  'tl-field-list': new Set([]),
  'tl-upload': new Set([]),
  'tl-file-upload': new Set([]),
```

- [ ] **Step 7: Specimen und Verträge**

`form.spec.html`: ein `div.tl-form-layout` (Inline-Grid im Specimen über die `<style>`-Klasse `.specimen__grid`, nicht inline) mit Feldern je Label-Lage: `--side` mit Pflicht (`__required` „*“, `aria-hidden="true"`, Eingabefeld `aria-required="true"`), mit Hilfe (`tl-button--ghost tl-button--sm` + `__help-text`), mit Fehler (`__message[role="alert"]` + Icon `tl-icon-sm fa-solid fa-circle-exclamation`, Feld `aria-invalid="true"`), mit Warnung (`__message[aria-live="polite"]`, Feld `data-tl-state="warning"`), geändert (`data-tl-state="dirty"` an der Wurzel); `--top`; `--after` mit Checkbox; `--hidden` mit Label in `tl-visually-hidden`. Eine `tl-form-group--outlined` offen (`aria-expanded="true"`) und eine eingeklappt (`aria-expanded="false"`, Körper `hidden`), Chevron `tl-icon-sm fa-solid fa-chevron-down` bzw. `fa-chevron-right`. Eine `tl-field-list` mit Titel `tl-type-heading-sm`. Upload: `span.tl-upload` mit `tl-button tl-button--secondary`; `div.tl-file-upload` normal, eine mit `data-tl-state="dragover"`, eine mit Knopf `aria-busy="true"`, eine mit `__status[role="alert"]`.

`form.contract.md`: Namen `TLFormField`, `TLFormGroup`, `TLFormLayout`, `TLFieldList`. Zustand FormField: `label`, `required`, `error`, `errorIcon`, `warnings`, `warningIcon`, `helpText`, `dirty`, `labelPosition` (`side|top|after|hidden`), `fullLine`, `visible`, `field`; FormGroup: `headerControl`, `headerActions`, `collapsible`, `collapsed`, `border` (`none|subtle|outlined` → keine Klasse / `--separator` / `--outlined`), `fullLine`, `children`; FormLayout: `maxColumns`, `labelPosition`, `readOnly`, `children`, `noModelMessage`; FieldList: `title`, `fields`. Aktionen: FormGroup `toggleCollapse`. Attribute: wie oben, dazu „Fehler verdrängt Warnung; im Lesemodus weder Pflichtstern noch Meldungen noch Hilfe“.

`upload.contract.md`: Namen `TLFileUpload`, `TLBinaryField`, `TLUploadButton`; Zustand `status`, `error`, `accept`, `maxSize` bzw. Button-Schlüssel plus `accept`, `multiple`; Aktionen wie heute im TSX (Upload über den Upload-Kanal, `clear`); Attribute `aria-busy="true"` am `tl-button` während des Hochladens, `data-tl-state="dragover"` an der Drop-Zone, `disabled`.

`specimen/index.html`: Link „Formular“.

- [ ] **Step 8: Gates und Sicht**

Run: `cd $P && node tools/generate.mjs && node --test && node tools/lint-css.mjs`
Expected: grün, `form.test.mjs` 7/7. Specimen im Browser, Bildschirmfotos.

- [ ] **Step 9: Commit**

```bash
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem && git add -A design-system && git commit -m "Ticket #29617: Formular und Upload -- tl-form-field, -group, -layout, tl-field-list, tl-upload; Label-Spalte als Token

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Alert, Badge, Divider, Skeleton — nur im Paket

**Modell:** Sonnet implementiert, Sonnet reviewt. Unabhängig von Tasks 3–6 außer Task 2; darf parallel zu Tasks 8–11 laufen.

**Files:**
- Create: `$P/src/components/{alert,badge,divider,skeleton}/<name>.css`, `<name>.contract.md`, `<name>.spec.html`
- Create: `$P/test/feedback.test.mjs`
- Modify: `$P/tools/lint-css.mjs`, `$P/specimen/index.html`

**Interfaces:**
- Produces: `tl-alert` (`--error|--warning|--success|--info`, Elemente `__icon`, `__body`, `__title`), `tl-badge`, `tl-divider` (`--vertical`), `tl-skeleton`. Kein TSX.

- [ ] **Step 1: Gate schreiben**

`test/feedback.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from '../tools/resolve.mjs';
import { readComponent, colorVarsOf, declarationsOf, specimenProblems, missingInContract, varsOf, contrastProblems } from './lib/component.mjs';

const R = resolve(JSON.parse(readFileSync(new URL('../src/primitives.json', import.meta.url))),
  JSON.parse(readFileSync(new URL('../src/tokens.json', import.meta.url))));
const STATUS = ['error', 'warning', 'success', 'info'];

test('Alert: je Bedeutung subtle-Fläche, border-Linie, Text text-primary, Icon status-text', () => {
  const css = readComponent('alert', 'alert.css');
  for (const s of STATUS) {
    const d = declarationsOf(css, `.tl-alert--${s}`) ?? '';
    assert.ok(d.includes(`--tl-status-${s}-subtle`) && d.includes(`--tl-status-${s}-border`), s);
    assert.ok((declarationsOf(css, `.tl-alert--${s} .tl-alert__icon`) ?? '').includes(`--tl-status-${s}-text`), `${s} Icon`);
  }
  for (const mode of ['light', 'dark'])
    assert.deepEqual(contrastProblems(R, mode, STATUS.map((s) => ({ fg: `status-${s}-text`, bg: `status-${s}-subtle`, soll: 3.0 }))), []);
});

test('Badge: Marke mit abgeleiteter Beschriftung, Ziffern tabellarisch über tl-nums, Pille', () => {
  const css = readComponent('badge', 'badge.css');
  assert.deepEqual(colorVarsOf(css), ['surface-brand', 'text-on-brand']);
  assert.match(declarationsOf(css, '.tl-badge') ?? '', /--tl-radius-full/);
});

test('Divider: Trennlinie ohne Kontrastschuld, horizontal und vertikal', () => {
  const css = readComponent('divider', 'divider.css');
  assert.deepEqual(colorVarsOf(css), ['border-separator']);
  assert.ok(declarationsOf(css, '.tl-divider--vertical'));
});

test('Skeleton: vertiefte Fläche, Puls über duration-loop, keine eigene Reduced-Motion-Regel', () => {
  const css = readComponent('skeleton', 'skeleton.css');
  assert.deepEqual(colorVarsOf(css), ['surface-interactive-selected']);
  assert.match(css, /--tl-duration-loop/);
  assert.doesNotMatch(css, /prefers-reduced-motion/);
});

for (const name of ['alert', 'badge', 'divider', 'skeleton']) {
  test(`${name}: Specimen und Vertrag`, () => {
    assert.deepEqual(specimenProblems(readComponent(name, `${name}.spec.html`)), []);
    const css = readComponent(name, `${name}.css`);
    const md = readComponent(name, `${name}.contract.md`);
    assert.deepEqual(missingInContract(md, [...varsOf(css), `tl-${name}`]), []);
    assert.match(md, /kein Control/i, `${name}: Vertrag sagt nicht, dass es noch kein Control gibt`);
  });
}
```

Das Paar `status-*-text` auf `status-*-subtle` mit 3,0 gilt dem Icon (Nicht-Text). Scheitert es, stoppen und berichten — nicht die Schwelle senken.

- [ ] **Step 2: Laufen lassen — muss scheitern**

Run: `cd $P && node --test test/feedback.test.mjs`
Expected: FAIL (`ENOENT`).

- [ ] **Step 3: CSS**

`alert.css`: `.tl-alert { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: var(--tl-space-xs); padding: var(--tl-space-sm) var(--tl-space-md); border: var(--tl-border-width-sm) solid transparent; border-inline-start-width: var(--tl-border-width-accent); border-radius: var(--tl-radius-md); color: var(--tl-text-primary); }`, je Bedeutung `.tl-alert--<s> { background: var(--tl-status-<s>-subtle); border-color: var(--tl-status-<s>-border); }` und `.tl-alert--<s> .tl-alert__icon { color: var(--tl-status-<s>-text); }`, `.tl-alert__body { min-width: 0; }`. Der Modifier ist Pflicht: ein Alert ohne Bedeutung gibt es nicht, der Vertrag sagt es, und `alert.css` hat keine Fläche ohne Modifier.

`badge.css`: `.tl-badge { display: inline-flex; align-items: center; justify-content: center; box-sizing: border-box; min-width: var(--tl-size-icon-sm); height: var(--tl-size-icon-sm); padding: 0 var(--tl-space-2xs); border-radius: var(--tl-radius-full); background: var(--tl-surface-brand); color: var(--tl-text-on-brand); }` — die Schrift von außen (`tl-type-label-strong tl-nums`).

`divider.css`: `.tl-divider { margin: 0; border: 0; border-top: var(--tl-border-width-sm) solid var(--tl-border-separator); }`, `.tl-divider--vertical { align-self: stretch; border-top: 0; border-inline-start: var(--tl-border-width-sm) solid var(--tl-border-separator); }`.

`skeleton.css`: `.tl-skeleton { display: block; min-height: var(--tl-size-icon-sm); border-radius: var(--tl-radius-sm); background: var(--tl-surface-interactive-selected); animation: tl-skeleton-pulse var(--tl-duration-loop) var(--tl-easing-standard) infinite alternate; }`, `@keyframes tl-skeleton-pulse { from { opacity: 1; } to { opacity: 0.5; } }`. Der globale Reduced-Motion-Schalter aus `base.css` beendet die Animation nach einem Durchlauf; `alternate` endet bei `opacity: 0.5` — darum `animation-fill-mode` nicht setzen, damit die Ruhelage `opacity: 1` gilt (wie beim Progress-Sweep begründet).

- [ ] **Step 4: Lint, Specimen, Verträge**

`MODIFIERS`: `'tl-alert': new Set(['error', 'warning', 'success', 'info'])`, `'tl-badge': new Set([])`, `'tl-divider': new Set(['vertical'])`, `'tl-skeleton': new Set([])`.

Specimen je Komponente wie Task 3 Step 6: Alert in vier Bedeutungen mit Titel (`tl-type-body-strong`) und Text, `role="alert"` bei error, sonst `role="status"`; Badge an einem Icon und an einem Reiter-Text, Zahlen 1, 12, 999; Divider horizontal zwischen zwei Absätzen und vertikal in einer Werkzeugleiste (`role="separator"`, `aria-orientation="vertical"`); Skeleton als Textzeile, als Block, als Avatar-Kreis (Specimen-Klasse setzt Maße), `aria-hidden="true"`.

Verträge: je „Vertrag: <Name>“, Satz „Es gibt noch kein Control; ein Control entsteht, wenn eine Ansicht es braucht, und trägt dann diese Klassen und Attribute.“, Tokens, Klassen, Attribute (Alert `role="alert"`/`status`; Divider `role="separator"`, `aria-orientation`; Skeleton `aria-hidden="true"`, der Behälter trägt `aria-busy="true"`).

`specimen/index.html`: vier Links.

- [ ] **Step 5: Gates**

Run: `cd $P && node tools/generate.mjs && node --test && node tools/lint-css.mjs`
Expected: grün, `feedback.test.mjs` 8/8.

- [ ] **Step 6: Commit**

```bash
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem && git add -A design-system && git commit -m "Ticket #29617: Alert, Badge, Divider, Skeleton im Paket -- CSS, Vertrag, Specimen, Gate; noch kein Control

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Engine — Branch, Paket einspielen, Feld-Controls

**Modell:** Opus implementiert, Opus reviewt.

**Files:**
- Modify: `$M/react-src/controls/TLTextInput.tsx`, `TLPasswordInput.tsx`, `TLNumberInput.tsx`, `TLDatePicker.tsx`, `TLSelect.tsx`
- Modify: `$M/src/main/webapp/style/tlReactControls.css` (Blöcke „Simple input controls“, „Error / Warning states for simple inputs“ löschen; Zell-Regeln im Block TLTableView umbenennen)
- Modify: `$M/src/main/webapp/style/tl-design-system/*.css` (Kopie), `$M/src/main/webapp/script/tl-react-controls.js` (erzeugt)
- Modify: `$P/test/ratchet.json`

**Interfaces:**
- Consumes: Klassen aus Task 3 (`tl-field`, `tl-field--multiline`, `tl-field-group`, `tl-field-group__icon`, `tl-field-group__action`, `tl-field-value`, `tl-field-value__text`).
- Produces: Hilfsfunktion `fieldStateAttrs(state): { 'aria-invalid'?: 'true'; 'data-tl-state'?: 'warning'; 'aria-required'?: 'true' }` in neuer Datei `$M/react-src/controls/form/fieldState.ts` — von Tasks 9–11 benutzt.

- [ ] **Step 1: Branch**

```bash
cd $WT && git fetch -q origin && git status -sb | head -2
git checkout -b CWS/CWS_29617_design_system_welle_2 CWS/CWS_29617_design_system_welle_1_avatar
```

Ist !1695 inzwischen gemergt (`git branch -r --merged origin/master | grep welle_1_avatar`), stattdessen von `origin/master` abzweigen. Der unversionierte Ordner `com.top_logic.demo.react.corporate/` bleibt unangetastet.

- [ ] **Step 2: Paket einspielen**

Run: `cd $P && node tools/publish-to-worktree.mjs && cd $WT && git status -s com.top_logic.layout.react/src/main/webapp/style/tl-design-system/`
Expected: `components.css`, `base.css`, `tokens.css`, `primitives.css` geändert.

- [ ] **Step 3: `fieldState.ts`**

```ts
/**
 * The state attributes of a form field, from the field model's state. Error wins over warning:
 * a field with an error shows no warning. The design system reads exactly these attributes
 * (tl-field, tl-checkbox, tl-choice-group); a class for a state does not exist.
 *
 * @param state the control state with the keys of ReactFormFieldControl
 * @param ariaInvalidAllowed false for elements whose role does not allow aria-invalid (role="group"),
 *        which then carry data-tl-state="error"
 */
export function fieldStateAttrs(
  state: { hasError?: unknown; hasWarnings?: unknown; mandatory?: unknown },
  ariaInvalidAllowed = true,
): Record<string, string> {
  const attrs: Record<string, string> = {};
  if (state.hasError === true) {
    if (ariaInvalidAllowed) attrs['aria-invalid'] = 'true';
    else attrs['data-tl-state'] = 'error';
  } else if (state.hasWarnings === true) {
    attrs['data-tl-state'] = 'warning';
  }
  if (state.mandatory === true) attrs['aria-required'] = 'true';
  return attrs;
}
```

- [ ] **Step 4: TSX umstellen**

Je Datei die Klassen nach dieser Tabelle ersetzen, `fieldStateAttrs(state)` auf das Eingabeelement spreizen, jede `--error`/`--warning`/`--immutable`-Logik entfernen, `tl-type-body` setzen:

| Alt | Neu |
|---|---|
| `input/textarea.tlReactTextInput` (+ `--multiline`) | `input/textarea.tl-field tl-type-body` (+ `tl-field--multiline`) |
| `span.tlReactTextInput__row` mit `__icon`, `__clear`, `__open` | `span.tl-field-group` mit `span.tl-field-group__icon`, `button.tl-field-group__action` (Löschen, `aria-label`), `a.tl-field-group__action` (Öffnen) — nur wenn Icon/Löschen/Öffnen da sind, sonst das Feld ohne Wrapper |
| `--withIcon`, `--clearable` | entfallen (`:has()` im Paket) |
| `span/a.tlReactTextInput--immutable` (+ `--multiline`, `--link`) | `span/a.tl-field-value tl-type-body` > `span.tl-field-value__text`; mehrzeilig: der Text in `span.tl-field-value__text` mit `white-space: pre-wrap` ist kein Stil des Pakets — mehrzeilige Lesewerte rendern `<div class="tl-field-value tl-type-body">` mit einem `<span class="tl-field-value__text">` je Zeile |
| `input.tlReactNumberInput` / `--immutable` | `input.tl-field tl-type-body` / `span.tl-field-value tl-type-body` |
| `input.tlReactDatePicker` / `--immutable` | wie Zahl |
| `select.tlReactSelect` / `--immutable` | `select.tl-field tl-type-body` / `span.tl-field-value tl-type-body` |
| Icons (`OPEN_ICON`, `CLEAR_ICON` …) | `ThemeIcon` mit `size="sm"`-Klasse `tl-icon-sm` (Welle 1) |

`rootClassName(state, …)` bzw. `className`-Durchreichung bleibt, wie in Welle 1. `TLPasswordInput` folgt `TLTextInput`.

- [ ] **Step 5: CSS der Engine**

In `tlReactControls.css`:
1. Den Block von `/* --- Simple input controls --- */` bis vor den nächsten `/* ---`-Kopf löschen, ebenso `/* --- Error / Warning states for simple inputs --- */`.
2. Im Block TLTableView die Zell-Regeln (heute um die Zeilen 3473–3553, `grep -n "tlReactTextInput\|tlReactNumberInput\|tlReactDatePicker\|tlReactSelect" tlReactControls.css`) auf die neuen Namen umstellen: `.tlReactTextInput, .tlReactNumberInput, .tlReactDatePicker, .tlReactSelect` → `.tl-field`; `--error`/`--warning` → `[aria-invalid="true"]` / `[data-tl-state~="warning"]`; `--immutable` → `.tl-field-value`. Kein neuer Selektor, keine neue Zeile — der Block darf nicht wachsen. Die dortigen `outline: none` bleiben (Welle 3, Ratsche `outlineNone` darf nicht steigen).

- [ ] **Step 6: Bauen und prüfen**

```bash
cd $M && npx tsc --noEmit -p tsconfig.json 2>&1 | grep -E "TL(TextInput|PasswordInput|NumberInput|DatePicker|Select)\.tsx|fieldState\.ts" ; echo "tsc-Befunde oben (leer = gut)"
cd $M && mvn -o -q compile 2>&1 | tail -20
cd $M && mvn -o -q test 2>&1 | tail -20
```
Expected: keine tsc-Zeile; `compile` erzeugt `src/main/webapp/script/tl-react-controls.js` neu; Modul-Tests grün (Stand vor der Welle: 395).

- [ ] **Step 7: Ratsche**

Run: `cd $P && node tools/inventory.mjs | head -40`
Die zwei gelöschten Blöcke aus `test/ratchet.json` `blocks` streichen, TLTableView auf den gemessenen Wert (≤ vorher), `lines` = Summe, `literals` auf die gemessenen Werte (dürfen nur sinken). Run: `cd $P && node --test test/ratchet.test.mjs` → grün.

- [ ] **Step 8: Commits**

```bash
cd $WT && git add -A com.top_logic.layout.react && git commit -m "Ticket #29617: Design System wave 2 -- fields read tl-field; state is aria-invalid / data-tl-state, read-only is tl-field-value

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem && git add design-system/test/ratchet.json && git commit -m "Ticket #29617: Ratsche -- Feld-Bloecke der Welle 2 gestrichen

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Engine — Auswahl-Controls

**Modell:** Opus implementiert, Sonnet reviewt.

**Files:**
- Modify: `$M/react-src/controls/TLCheckbox.tsx`, `TLBooleanChoice.tsx`, `TLSegmentedChoice.tsx`, `TLOptionChips.tsx`, `TLColumnSelect.tsx:137`
- Modify: `$M/src/main/webapp/style/tlReactControls.css` (Blöcke Checkbox, TLBooleanChoice, TLSegmentedChoice, TLOptionChips)
- Modify: `$M/src/main/webapp/script/tl-react-controls.js`, `$P/test/ratchet.json`

**Interfaces:**
- Consumes: `fieldStateAttrs` (Task 8), Klassen aus Task 4.

- [ ] **Step 1: TSX**

| Datei | Alt | Neu |
|---|---|---|
| `TLCheckbox.tsx` | `input.tlReactCheckbox` (+ `--switch`, `--error`, `--warning`, `--immutable`) | `input.tl-checkbox` (+ `tl-checkbox--switch` bei `display === 'switch'`, dann `role="switch"`); `fieldStateAttrs(state)`; schreibgeschützt: dasselbe Element mit `disabled` (heute schon so) — keine eigene Klasse |
| `TLBooleanChoice.tsx` Radio | `span.tlBooleanChoice--radio[role=radiogroup]` > `span.__option` > `input` + `label.__label` | `span.tl-choice-group[role="radiogroup"]` mit `fieldStateAttrs(state)` (erlaubt) > je Option `label.tl-choice tl-type-body` > `input[type=radio].tl-radio` + Text |
| `TLBooleanChoice.tsx` Select | `select.tlBooleanChoice.tlReactSelect` | `select.tl-field tl-type-body` mit `fieldStateAttrs(state)` |
| `TLSegmentedChoice.tsx` | `div.tlSegmentedChoice` (+ Modifier), `span.__marker`, `button.__segment`, `__segment--selected`, `__segmentLabel` | `div.tl-segmented` (`role="radiogroup"` → `fieldStateAttrs(state)`, `role="group"` → `fieldStateAttrs(state, false)`), `button.tl-segmented__segment tl-type-label` mit `aria-checked` bzw. `aria-pressed`; Marker, `useLayoutEffect`/Messung und Inline-`left`/`width` löschen; Lesewert: `span.tl-field-value` |
| `TLOptionChips.tsx` | `div.tlOptionChips` (+ Modifier), `button.__chip`, `__chip--selected`, `__chipLabel` | `div.tl-chip-group[role="group"]` mit `fieldStateAttrs(state, false)`, `button.tl-chip tl-type-label` mit `aria-pressed`; Lesewert `span.tl-field-value` |
| `TLColumnSelect.tsx:137` | `className="tlReactCheckbox"` | `className="tl-checkbox"` |

`indeterminate` bei `triState` bleibt eine DOM-Eigenschaft (heute gesetzt) plus `aria-checked="mixed"`. Die Label-Verknüpfung über `useFieldLabelProps` bleibt.

- [ ] **Step 2: CSS der Engine** — die vier Blöcke von ihrem Kopf bis vor den nächsten löschen. `grep -n "tlReactCheckbox\|tlBooleanChoice\|tlSegmentedChoice\|tlOptionChips" tlReactControls.css` → leer.

- [ ] **Step 3: Bauen und prüfen** — wie Task 8 Step 6, tsc-Filter auf die fünf Dateien.

- [ ] **Step 4: Ratsche** — vier Blöcke streichen, wie Task 8 Step 7.

- [ ] **Step 5: Commits**

```bash
cd $WT && git add -A com.top_logic.layout.react && git commit -m "Ticket #29617: Design System wave 2 -- checkbox, radio, switch, segments and chips; selected is aria-checked / aria-pressed, no sliding marker

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem && git add design-system/test/ratchet.json && git commit -m "Ticket #29617: Ratsche -- Auswahl-Bloecke der Welle 2 gestrichen

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Engine — DropdownSelect, Lesewert, Ressourcen-Zelle

**Modell:** Opus implementiert, Opus reviewt (Tastatur, Portal, Aufzeichnung).

**Files:**
- Modify: `$M/react-src/controls/TLDropdownSelect.tsx`, `selectOptions.tsx`, `TLResourceCell.tsx`
- Modify: `$M/src/main/webapp/style/tlReactControls.css` (Block TLDropdownSelect; Regeln `.tlOptionValue`, `.tlResourceCell` wo sie stehen)
- Modify: `$M/src/main/webapp/script/tl-react-controls.js`, `$P/test/ratchet.json`

**Interfaces:**
- Consumes: `fieldStateAttrs` (Task 8), Klassen aus Tasks 3 und 5, `TLPill`/`withPill` (Welle 1), `TLProgress`-Markup (Welle 1).

- [ ] **Step 1: Vorher prüfen, wer die alten Klassen liest**

Run: `cd $WT && git grep -n -E "tlDropdownSelect|tlOptionValue|tlResourceCell|aria-selected" -- '*.java' '*.ts' '*.tsx' ':!*.js' | grep -v "react-src/controls/TLDropdownSelect.tsx\|selectOptions.tsx\|TLResourceCell.tsx"`
Expected: leer (Stand 30.09.: keine Java- und keine Testleser). Findet sich ein Leser (Skript-Aufzeichnung `ReactOptionByLabelNaming`, `ModelResolver`), ihn mit umstellen und im Commit nennen.

- [ ] **Step 2: TSX `TLDropdownSelect.tsx`**

| Alt | Neu |
|---|---|
| `div.tlDropdownSelect[role=combobox]` (+ `--open`, `--disabled`) | `div.tl-field tl-select tl-type-body[role="combobox"]` + `fieldStateAttrs(state)`; offen nur `aria-expanded`; deaktiviert `aria-disabled="true"` (ein `div` hat kein `disabled`). Kein Formular-Control sendet `disabled` heute (Spec §3b); `aria-disabled` bekommt darum in dieser Welle keine Regel, der Select-Vertrag nennt es als offen |
| `__chips` | `tl-select__values` |
| `span.__value` > `OptionImage` + `__valueLabel` | `span.tl-select__value` > `withPill(option.colorRole, <>OptionImage + span.tl-field-value__text</>)` — **Einzelwert mit Rolle als Pill** |
| `span.__chip`, `__dragHandle` (⋮⋮), `__chipLabel`, `button.__chipRemove` (×) | `span.tl-select__chip` > `ThemeIcon` `css:fa-solid fa-grip-vertical` in `span.tl-select__drag-handle` + `withPill(colorRole, label)` (ohne Rolle: `TLPill` neutral) + `button.tl-select__chip-remove[aria-label]` mit `ThemeIcon` `css:fa-solid fa-xmark` |
| `__chip--dragging`, `--dropBefore`, `--dropAfter` | `data-tl-state="dragging"`, `"drop-before"`, `"drop-after"` (Wortliste zusammensetzen) |
| `__controls`, `__clearAll` (×), `__arrow` (▲/▼) | `tl-select__controls`, `button.tl-select__clear[aria-label]` mit `fa-xmark`, `span.tl-select__arrow` mit `ThemeIcon` `css:fa-solid fa-chevron-down` / `fa-chevron-up` |
| `span.__placeholder` | `span.tl-select__placeholder` |
| Portal `div.__dropdown` (Inline `position/left/width/top`, `z-index` im CSS) | `div.tl-select__popup` — Lage bleibt inline (Daten aus `getBoundingClientRect`), `z-index` kommt aus dem Paket |
| `__searchWrapper`, `__searchIcon` (🔍), `input.__search` | `span.tl-field-group` > `span.tl-field-group__icon` mit `css:fa-solid fa-magnifying-glass` + `input.tl-field tl-select__search tl-type-body` mit `aria-activedescendant={id der hervorgehobenen Option}`, `aria-controls={id der Liste}` |
| `div.__list[role=listbox]` | `div.tl-select__list[role="listbox"]` mit `id` |
| `div.__option[aria-selected=highlighted]`, `--highlighted`, `__optionLabel`, `<strong>` | `div.tl-select__option[role="option"]` mit eindeutiger `id`, `data-tl-state="highlighted"` für die Hervorhebung, `aria-selected` nur, wenn gewählt (in der Liste stehen nur ungewählte Optionen, also `aria-selected="false"`); Treffer `<span class="tl-type-body-strong">` |
| `__loading` + `__spinner` | `div.tl-select__status` > `TLProgress`-Markup unbestimmt (`div.tl-progress[role=progressbar][aria-busy="true"]` > Spur/Füllung) + Text |
| `__error` + Retry-Link | `div.tl-select__status[role="alert"]` + `button.tl-button tl-button--link tl-type-label` „Erneut versuchen“ |
| `__noResults` | `div.tl-select__status` |
| `--immutable` > `ReadonlyValue` | Liste von `ReadonlyValue` in `span.tl-select__values` ohne `tl-field` |

Tastatur unverändert lassen (Pfeile, Enter, Escape, Rücktaste, Tippen); nur die Hervorhebung zusätzlich über `aria-activedescendant` spiegeln.

- [ ] **Step 3: `selectOptions.tsx` und `TLResourceCell.tsx`**

`ReadonlyValue`: `span.tlOptionValue` → `span.tl-field-value tl-type-body`; mit Link `a.tlOptionValue.tlResourceCell[href="#"]` → `a.tl-field-value tl-type-body[href="#"]`; Text in `span.tl-field-value__text`, Pill über `withPill` innerhalb. `OptionImage`: `img.tlOptionImage` → `img.tl-icon-sm`, `ThemeIcon.tlOptionIcon` → `ThemeIcon` mit Klasse `tl-icon-sm`.
`TLResourceCell.tsx:51`: `rootClassName(state, 'tlResourceCell')` → `rootClassName(state, 'tl-field-value tl-type-body')`, Text in `span.tl-field-value__text`; ist es ein Link, `a.tl-field-value`.

- [ ] **Step 4: CSS der Engine** — Block TLDropdownSelect löschen; die Regeln `.tlOptionValue`, `.tlOptionImage`, `.tlOptionIcon`, `.tlResourceCell` löschen, wo immer sie stehen (`grep -n`); die Zell-Regel für den unveränderlichen Select im TableView-Block (`.tlDropdownSelect--immutable`, heute um Zeile 3479) auf `.tl-select__values` bzw. `.tl-field-value` umstellen, ohne Zuwachs.

- [ ] **Step 5: Bauen und prüfen** — wie Task 8 Step 6, tsc-Filter auf die drei Dateien.

- [ ] **Step 6: Ratsche** — Block streichen, betroffene Blöcke nachmessen.

- [ ] **Step 7: Commits**

```bash
cd $WT && git add -A com.top_logic.layout.react && git commit -m "Ticket #29617: Design System wave 2 -- dropdown select on tl-field; a chosen value with a role is a pill; theme icons instead of text glyphs; highlight via aria-activedescendant

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem && git add design-system/test/ratchet.json && git commit -m "Ticket #29617: Ratsche -- DropdownSelect-Block der Welle 2 gestrichen

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 11: Engine — Formular und Upload; Gate „keine alte Klasse“

**Modell:** Opus implementiert, Opus reviewt.

**Files:**
- Modify: `$M/react-src/controls/TLFormField.tsx`, `TLFormGroup.tsx`, `TLFormLayout.tsx`, `TLFieldList.tsx`, `TLPanel.tsx:197-198`, `TLFileUpload.tsx`, `TLBinaryField.tsx`, `TLUploadButton.tsx`
- Modify: `$M/src/main/webapp/style/tlReactControls.css` (Blöcke TLFormField, TLFormGroup, TLFormLayout, TLFieldList, TLFileUpload; Regel `.tlVisuallyHidden`)
- Create: `$P/test/engine-classes.test.mjs`
- Modify: `$P/test/ratchet.json`

**Interfaces:**
- Consumes: Klassen aus Tasks 3, 4, 6; `fieldStateAttrs` (Task 8); `buttonClassName` (Welle 1, `react-src/controls/button/ButtonDefaults.tsx`).

- [ ] **Step 1: Gate zuerst (failing)**

`$P/test/engine-classes.test.mjs`:

```js
// Welle 2 ist fertig, wenn keine alte Formular-Klasse mehr in der Engine steht — weder im TSX noch
// im alten Stylesheet. Ohne Worktree (Kundenrechner, CI des Pakets) wird der Test übersprungen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const WT = process.env.TL_WORKTREE ?? fileURLToPath(new URL('../../_Working-Tree/tl8-wt-29584', import.meta.url));
const M = join(WT, 'com.top_logic.layout.react');
// Kein schließendes \b: vor `__` und `--` liegt keine Wortgrenze, tlFormField__error muss treffen.
const ALT = /\b(tlReactTextInput|tlReactNumberInput|tlReactDatePicker|tlReactSelect|tlReactCheckbox|tlBooleanChoice|tlSegmentedChoice|tlOptionChips|tlDropdownSelect|tlOptionValue|tlOptionImage|tlOptionIcon|tlResourceCell|tlFormField|tlFormGroup|tlFormLayout|tlFieldList|tlFileUpload|tlVisuallyHidden)/;

function* files(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) yield* files(p);
    else if (/\.(tsx?|css)$/.test(f)) yield p;
  }
}

test('keine alte Formular-Klasse in react-src und tlReactControls.css', { skip: !existsSync(M) && 'kein Worktree' }, () => {
  const hits = [];
  for (const p of [...files(join(M, 'react-src')), join(M, 'src/main/webapp/style/tlReactControls.css')]) {
    readFileSync(p, 'utf8').split('\n').forEach((line, i) => { if (ALT.test(line)) hits.push(`${p.slice(M.length + 1)}:${i + 1}`); });
  }
  assert.deepEqual(hits, []);
});
```

Run: `cd $P && node --test test/engine-classes.test.mjs`
Expected: FAIL mit Treffern in `TLFormField.tsx`, `TLFormGroup.tsx`, `TLFormLayout.tsx`, `TLFieldList.tsx`, `TLPanel.tsx`, `TLFileUpload.tsx`, `TLBinaryField.tsx` und im Stylesheet.

- [ ] **Step 2: TSX**

| Datei | Alt | Neu |
|---|---|---|
| `TLFormField.tsx` | `div.tlFormField--{side\|top\|after\|hidden}`, `--readonly`, `--fullLine`, `--error`, `--warning`, `--dirty` | `div.tl-form-field tl-form-field--<lage>` (+ `tl-form-field--full`), `data-tl-state="dirty"` bei `dirty`; `--readonly`, `--error`, `--warning` entfallen |
| | `__label`, `label.__labelText`, `__required` („*“), `__dirtyDot`, `__helpIcon` (Inline-SVG) | `div.tl-form-field__label tl-type-label`, `label.tl-form-field__label-text`, `span.tl-form-field__required[aria-hidden="true"]`, `span.tl-form-field__dirty[aria-hidden="true"]`, Hilfe als `button` mit `buttonClassName({ appearance: 'ghost', small: true })` und `ThemeIcon` `css:fa-solid fa-circle-question`, `aria-expanded` |
| | `__input`, `__error` + `__errorIcon`, `__warnings` + `__warning` + `__warningIcon`, `__helpText` | `div.tl-form-field__input`, `div.tl-form-field__message[role="alert"] tl-type-label` + `ThemeIcon` `tl-icon-sm`, `div.tl-form-field__message[aria-live="polite"] tl-type-label` je Warnung, `div.tl-form-field__help-text tl-type-label` |
| | `span.tlVisuallyHidden` | `span.tl-visually-hidden` |
| | Zeilen 146/154: `ThemeIcon encoded={…}` mit `string \| undefined` | nur rendern, wenn der Wert ein String ist (`typeof state.errorIcon === 'string' && …`) — behebt den `tsc`-Befund |
| `TLPanel.tsx:197-198` | `tlFormField__error tlPanel__error`, `tlFormField__errorIcon` | `tl-form-field__message tl-type-label tlPanel__error` mit `role="alert"`, Icon `tl-icon-sm` — `tlPanel__error` bleibt bis Welle 4 |
| `TLFormGroup.tsx` | `div.tlFormGroup--border-{none\|subtle\|outlined}`, `--fullLine`, `--collapsed`, `__chevron` / `__chevron--collapsed` | `div.tl-form-group` (+ `tl-form-group--separator` bei `subtle`, `--outlined` bei `outlined`, `--full` bei `fullLine`); eingeklappt: `aria-expanded` am `button.tl-form-group__toggle`, `hidden` am `div.tl-form-group__body`, Chevron `ThemeIcon` `fa-chevron-down` / `fa-chevron-right`; Titel `span.tl-form-group__title tl-type-heading-sm` |
| `TLFormLayout.tsx` | `div.tlFormLayout`, `--readonly`, `--fill`, `--empty`, `__noModel` | `div.tl-form-layout` (Inline-`gridTemplateColumns` bleibt, Spec §6), `--fill` → `tl-form-layout--fill`, `div.tl-form-layout__empty tl-type-body` |
| `TLFieldList.tsx` | `tlFieldList`, `h3.__title`, `__fields`, `__item` | `tl-field-list`, `h3.tl-field-list__title tl-type-heading-sm`, `tl-field-list__fields`, `tl-field-list__item` |
| `TLFileUpload.tsx`, `TLBinaryField.tsx` | `div.tlFileUpload`, `--dragover`, `button.__button`, `--uploading`, `svg.__icon`, `span.__status--error` | `div.tl-file-upload` mit `data-tl-state="dragover"`, Knopf `buttonClassName({ appearance: 'secondary' })` mit `aria-busy="true"` beim Hochladen und `ThemeIcon` `css:fa-solid fa-upload` statt Inline-SVG, `span.tl-file-upload__status tl-type-label` (Fehler `role="alert"`) |
| `TLUploadButton.tsx` | `span.tl-upload` | unverändert — die Klasse ist jetzt definiert |

Der Hilfetext, der Pflichtstern und die Meldungen erscheinen im Lesemodus nicht (heute schon so); Warnungen nur ohne Fehler.

- [ ] **Step 3: CSS der Engine**

Die Blöcke TLFormField, TLFormGroup, TLFormLayout, TLFieldList, TLFileUpload löschen; die Regel `.tlVisuallyHidden` (heute um Zeile 114) löschen. Der Kommentar um Zeile 261, der `.tlFormLayout` nennt, auf `.tl-form-layout` umschreiben (keine Zeile mehr).

- [ ] **Step 4: Gate grün**

Run: `cd $P && node --test test/engine-classes.test.mjs`
Expected: PASS.

- [ ] **Step 5: Bauen, testen, messages_en**

```bash
cd $M && npx tsc --noEmit -p tsconfig.json 2>&1 | grep -E "TL(FormField|FormGroup|FormLayout|FieldList|Panel|FileUpload|BinaryField|UploadButton)\.tsx" ; echo "tsc-Befunde oben (leer = gut)"
cd $M && mvn -o -q compile 2>&1 | tail -20 && mvn -o -q test 2>&1 | tail -20
cd $WT/com.top_logic.layout.view && mvn -o -q test 2>&1 | tail -20
cd $WT/com.top_logic.demo.react && mvn -o -q test 2>&1 | tail -20
$P/tools/check-messages-en.sh
```
Expected: kein tsc-Befund in den acht Dateien; alle Modul-Tests grün (Stand: layout.react 395, layout.view 927, demo.react 11); `check-messages-en.sh` ohne Diff.

- [ ] **Step 6: Ratsche** — fünf Blöcke streichen, übrige nachmessen; `node --test` im Paket grün.

- [ ] **Step 7: Commits**

```bash
cd $WT && git add -A com.top_logic.layout.react && git commit -m "Ticket #29617: Design System wave 2 -- form field, group, layout, field list and upload on the package; the last old form class is gone

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem && git add design-system/test && git commit -m "Ticket #29617: Welle 2 -- Gate keine alte Formular-Klasse in der Engine; Ratsche ohne die zwoelf Bloecke

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 12: Sichtprüfung, Altlast, PR

**Modell:** Orchestrator mit Hendrik (Push, PR, Login sind nach außen gerichtet).

- [ ] **Step 1: Abschluss-Review** — ein frischer Opus-Reviewer über den ganzen Branch `CWS/CWS_29617_design_system_welle_2` und die Paket-Commits dieser Welle gegen Spec und Review Focus.

- [ ] **Step 2: Push und PR** — nach Hendriks Ja: `check-messages-en.sh`, Trac #29617 angenommen (Hook), `git push -u origin CWS/CWS_29617_design_system_welle_2`; PR gegen `CWS/CWS_29617_design_system_welle_1_avatar` (bzw. `master`, wenn !1695 gemergt ist), englisch, Abschnitte wie !1695 (finding, decision, Java, React, package, migration table old → new class, verification), Reviewer `bhu`, Trac #29617 CC, Begründung der Pill-Regel („a role that disappears when chosen is no role“).

- [ ] **Step 3: Sichtprüfung** in der Docker-Instanz des PRs (`http://docker:80NN/<Kontext>/`, Port aus `WEB_PORT` im Build-Log; Hendrik loggt ein), hell und dunkel:
  1. Dialog „Neues Demo-Objekt“: Feldränder sichtbar, Radio „Aktiv (Radio)“ gezeichnet, Checkbox, Fehler nach leerem Pflichtfeld.
  2. Objektliste: Filter „Status“ zeigt den gewählten Wert als Pill; Tabelle „Geschlossen“, Spalte „Status“ endet mit Ellipse; Spalte „Eigentümer“ Link lesbar.
  3. Select öffnen, Pfeiltasten, Enter, Escape, Rücktaste; Mehrfachauswahl ziehen.
  4. Formulargruppe einklappen; Hilfe öffnen; Upload in einer Binär-Eigenschaft.
  5. `data-tl-density="compact"` über die Theme-Wahl.

- [ ] **Step 4: Altlast und STATUS** — in `docs/migration/altlast.md` „Sichtbare Befunde“ die Zeilen der Welle 2 als erledigt markieren (mit PR-Nummer), Abschnitt „Welle 2 · Formulare“ nach dem Muster von Welle 1; `STATUS.md` „Jetzt“ auf Welle 3; `docs/praesentation.md` §14 Stand Welle 2. Commit.

---

## Selbstprüfung gegen die Spec

| Spec | Task |
|---|---|
| §1 zwölf Blöcke leer | 8–11, Gate `engine-classes.test.mjs`, Ratsche |
| §2 ein PR, gestapelt | 8 Step 1, 12 Step 2 |
| §3a Rahmen `tl-field` | 3 (Abweichung Icon/Endknopf begründet), 8 |
| §3b Zustände als Attribute | 3, 4, 5, `fieldStateAttrs` in 8 |
| §3c `tl-field-value`, zwei Befunde | 3, 8, 10, Sicht 12 |
| §3d Tabellenzellen umbenannt | 8 Step 5, 10 Step 4 |
| §4 Auswahl, Marker fällt, Fehler an Gruppen | 4, 9 |
| §5 Select, Pill-Einzelwert, Icons, Fortschritt | 5, 10 |
| §6 Formular, Label-Spalte, Dirty, Upload | 6, 11 |
| §7 Alert, Badge, Divider, Skeleton | 7 |
| §8 Gates (Kontrast, Klassen, Verträge, Ratsche, Engine) | 1, 3–7, 11 |
| §9 Reihenfolge, Sicht | Reihenfolge der Tasks, 12 |
| §10 `tsc`-Befund TLFormField | 11 Step 2 |
