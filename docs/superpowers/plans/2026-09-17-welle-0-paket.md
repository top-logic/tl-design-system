# Welle 0 — Paket, Tokens, Grundklassen

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Das Paket `@toplogic/design-system` steht mit `primitives.css`, `tokens.css`, `base.css`, DTCG-Export, allen Gates und einem Specimen der Grundklassen; die Altwerkzeuge sind exportiert und gelöscht; die Docs sprechen die neuen Namen.

**Architecture:** Zwei JSON-Quellen (`primitives.json` mit Werten, `tokens.json` mit Referenzen) werden von `tools/generate.mjs` in vier CSS-Dateien und eine DTCG-Datei übersetzt. Jede Regel aus `skalen.md` ist ein Test unter `test/`. Ein Klassen-Gate (`tools/lint-css.mjs`) prüft jede CSS-Datei des Pakets; eine Ratsche zählt das alte Stylesheet im Worktree und lässt es nur schrumpfen.

**Tech Stack:** Node 22, `node:test`, kein npm-Paket als Abhängigkeit. Die Rechenkerne `brand.mjs` (OKLCH), `contrast.mjs` (WCAG), `primitive.mjs` (Namensableitung) werden unverändert übernommen.

**Spec:** `docs/superpowers/specs/2026-09-17-design-system-neuaufbau-design.md`

## Global Constraints

- Alle öffentlichen Namen Englisch, kebab-case, Präfix `tl`: Variablen `--tl-…`, Klassen `.tl-…`, Attribute `data-tl-…`.
- Semantische Tokens tragen keine Werte, nur Referenzen `{name}` auf Primitive.
- Kategorien geschlossen: `surface`, `text`, `icon`, `border`, `focus`, `shadow`, `space`, `radius`, `size`, `font`, `duration`, `easing`, `layer`, `status`.
- Beschriftungen auf Flächen (`text-on-*`, `icon-on-*`) werden erzeugt, nie geschrieben.
- Wurzelattribute: `data-tl-mode="light|dark"`, `data-tl-density="normal|compact"`.
- `dist/` ist eingecheckt und byte-identisch mit dem Erzeugnis aus `src/`.
- Kein Literal in einer Klasse außer `0`, `1`, `auto`, `none`, `100%`, `currentColor`, `inherit`, `!important` (nur Reduced Motion).
- Kein `:focus` ohne `-visible`, kein `outline: none`.
- 12 px Untergrenze, 4-px-Raster, glatte Sechzehntel bei `rem`, Linien in `px`.
- Kontrast: Text 4,5, Icon und Linie 3,0, getönte Flächen 30° Farbtonabstand.
- Commit-Messages beginnen mit `Ticket #29108:`, enden mit `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.
- Keine Zeitangaben in Docs.
- `docs/praesentation.md` und `STATUS.md` werden mit jeder Doc-Änderung mitgezogen.

---

## Dateistruktur nach Welle 0

```
design-system/
  package.json                   name, version 0.1.0, "type": "module", scripts test/build/lint
  src/
    primitives.json              Werte
    tokens.json                  Referenzen, Modi, Dichte, Typo, Druck, Ebenen
  dist/
    primitives.css
    tokens.css
    base.css
    tokens.dtcg.json
  tools/
    lib/color.mjs                = specimen/brand.mjs, unverändert
    lib/contrast.mjs             = specimen/contrast.mjs, unverändert
    lib/naming.mjs               = specimen/primitive.mjs, unverändert
    lib/css.mjs                  Deklarationen aus CSS lesen (aus inventar.mjs herausgelöst)
    resolve.mjs                  Referenzen auflösen, Beschriftungen erzeugen
    generate.mjs                 dist/* schreiben
    lint-css.mjs                 Klassen-Gate
    inventory.mjs                = specimen/inventar.mjs, auf lib/css.mjs umgestellt
    serve.mjs                    Specimen auf :8137
  specimen/
    index.html                   Grundklassen in beiden Modi, beiden Dichten
  test/
    color.test.mjs               = brand-Tests (übernommen)
    contrast.test.mjs            übernommen
    naming.test.mjs              übernommen
    layers.test.mjs              Schichten
    tokens.test.mjs              Kontrast, Maße, Farbton
    generate.test.mjs            erzeugtes CSS
    dtcg.test.mjs                Export
    dist.test.mjs                byte-identisch
    lint-css.test.mjs            Klassen-Gate
    ratchet.test.mjs             Altbestand schrumpft
    ratchet.json                 Budget
docs/
  migration/altlast.md           einmaliger Export, Arbeitsliste für Welle 1–5
  skalen.md, praesentation.md    umgeschrieben
STATUS.md, CLAUDE.md, README.md  umgeschrieben
```

`specimen/` auf Repo-Ebene verschwindet vollständig (Task 12).

---

### Task 1: Migrationsliste exportieren

Bevor etwas gelöscht wird, wird alles, was die alten Werkzeuge über den Altbestand wissen, in ein Dokument geschrieben. Es ist die Arbeitsliste der Wellen 1 bis 5.

**Files:**
- Create: `specimen/export-migration.mjs` (Einmalwerkzeug, wird in Task 12 gelöscht)
- Create: `docs/migration/altlast.md`

**Interfaces:**
- Consumes: `stellenBericht(css, abbildung, entscheidungen)` aus `specimen/stellen.mjs`; `inventar`-Funktionen aus `specimen/inventar.mjs`; `abbildung.json`, `stellen.json`, `tokens.json`
- Produces: `docs/migration/altlast.md` mit drei Tabellen: alte Rolle → neue Rolle; Lesestelle → Ziel; Literalbestand je Kategorie

- [ ] **Step 1: Namenszuordnung alt → neu als Tabelle festlegen**

Erzeuge `specimen/export-migration.mjs`:

```js
// Einmaliger Export: Was die Altwerkzeuge über den Altbestand wissen, als Arbeitsliste.
// Wird nach dem Lauf zusammen mit den Altwerkzeugen gelöscht (Task 12).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { stellenBericht } from './stellen.mjs';

const MODUL = join(process.env.TL_WORKTREE ?? join(homedir(), 'git/tl8-wt-29584'),
  'com.top_logic.layout.react/src/main/webapp/style');
const css = ['tlReactBase.css', 'tlReactControls.css']
  .map((d) => readFileSync(join(MODUL, d), 'utf8')).join('\n');
const abbildung = JSON.parse(readFileSync(new URL('./abbildung.json', import.meta.url)));
const entscheidungen = JSON.parse(readFileSync(new URL('./stellen.json', import.meta.url)));

/** Alte Skalen-Rolle → neuer Tokenname. Die Entscheidung dahinter steht in skalen.md. */
export const NEU = {
  'background': 'surface-base',
  'layer-01': 'surface-layer',
  'layer-02': 'surface-layer-nested',
  'layer-overlay': 'surface-overlay',
  'layer-hover': 'surface-interactive-hover',
  'layer-selected': 'surface-interactive-selected',
  'layer-active': 'surface-interactive-active',
  'field': 'surface-field',
  'text-primary': 'text-primary',
  'text-secondary': 'text-secondary',
  'text-helper': 'text-helper',
  'text-placeholder': 'text-placeholder',
  'border-separator': 'border-separator',
  'border-control': 'border-control',
  'border-emphasis': 'border-emphasis',
  'border-interactive': 'border-interactive',
  'focus': 'focus-ring',
  'brand-primary': 'surface-brand',
  'brand-primary-hover': 'surface-brand-hover',
  'brand-primary-active': 'surface-brand-active',
  'brand-link': 'text-link',
  'brand-link-hover': 'text-link-hover',
  'brand-subtle': 'surface-brand-subtle',
  'brand-subtle-hover': 'surface-brand-subtle-hover',
  ...Object.fromEntries(['error', 'warning', 'success', 'info'].flatMap((s) =>
    ['text', 'border', 'surface', 'subtle'].map((r) => [`support-${s}-${r}`, `status-${s}-${r}`]))),
  'shadow-popover': 'shadow-popover', 'shadow-dialog': 'shadow-dialog', 'shadow-drag': 'shadow-drag',
};

const zeilen = ['# Altlast — Arbeitsliste für die Wellen 1 bis 5', '',
  'Einmalig exportiert aus abbildung.json, stellen.json und dem Inventar am ' + new Date().toISOString().slice(0, 10) + '.',
  'Die Werkzeuge dahinter sind gelöscht; diese Datei ist ihr Erbe.', '',
  '## Alte Theme-Tokens → neue Tokens', '', '| Alt (tl-react-theme.config.xml) | Art | Neu (`--tl-…`) | Regel |', '|---|---|---|---|'];
for (const [alt, e] of Object.entries(abbildung.farbe)) {
  const ziel = e.ziel ? NEU[e.ziel] ?? e.ziel : e.ziele ? e.ziele.map((z) => NEU[z] ?? z).join(' / ') : e.art;
  zeilen.push(`| \`${alt}\` | ${e.art} | \`${ziel}\` | ${(e.regel ?? e.warum ?? '').replace(/\|/g, '\\|')} |`);
}
zeilen.push('', '## Lesestellen der mehrdeutigen Tokens', '', '| Selektor | Eigenschaft | Alt | Neu |', '|---|---|---|---|');
for (const [alt, b] of Object.entries(stellenBericht(css, abbildung, entscheidungen)))
  for (const s of b.stellen) {
    const ziel = s.ziel ? NEU[s.ziel] ?? s.ziel : s.zweckfremd ? `zweckfremd → ${NEU[s.zweckfremd.vorschlag] ?? s.zweckfremd.vorschlag}` : 'OFFEN';
    zeilen.push(`| \`${s.selektor}\` | \`${s.eigenschaft}\` | \`${alt}\` | \`${ziel}\` |`);
  }
zeilen.push('', '## Nicht abgebildete Alt-Tokens (Maße, Schatten, Typo)', '',
  'Diese 31 Tokens las das alte CSS ohne Ziel in der Skala. Sie fallen mit ihrer Komponente:', '',
  '| Alt | Neu |', '|---|---|',
  '| `spacing-01` … `spacing-06` | `space-2xs`, `space-xs`, `space-md`, `space-lg`, `space-xl`, `space-2xl` (Lücke 12 px = `space-sm`) |',
  '| `corner-radius` | `radius-sm` |', '| `border-radius-02` | `radius-md` |',
  '| `body-compact-01-*`, `body-02-*` | Klasse `.tl-type-body` |',
  '| `label-01-font-size` | Klasse `.tl-type-label` |',
  '| `heading-compact-02-*` | Klasse `.tl-type-body-strong` (14/600) |',
  '| `heading-compact-03-font-size` | Klasse `.tl-type-heading-sm` |',
  '| `heading-03-font-size` | Klasse `.tl-type-heading-md` |',
  '| `shadow-raised` | entfällt (Elevation nur für Schwebendes) |',
  '| `shadow-menu` | `shadow-popover` |', '| `shadow-dialog` | `shadow-dialog` |',
  '| `overlay` | `surface-scrim` |', '| `font-family`, `font-family-mono` | `font-family-sans`, `font-family-mono` |',
  '| `border-subtle-01`, `border-color`, `color-border` | `border-separator` |',
  '| `text-muted` | `text-secondary` |', '| `link-color` | `text-link` |',
  '| `color-drop-zone` | `surface-brand-subtle` |');
mkdirSync(new URL('../docs/migration/', import.meta.url), { recursive: true });
writeFileSync(new URL('../docs/migration/altlast.md', import.meta.url), zeilen.join('\n') + '\n');
console.log('geschrieben: docs/migration/altlast.md');
```

- [ ] **Step 2: Export laufen lassen**

Run: `cd specimen && node export-migration.mjs && wc -l ../docs/migration/altlast.md`
Expected: `geschrieben: docs/migration/altlast.md`, mehr als 190 Zeilen (54 Tokens + 131 Stellen + Kopf).

- [ ] **Step 3: Stichprobe**

Run: `grep -c "surface-brand" ../docs/migration/altlast.md; grep "tlReactTextInput" ../docs/migration/altlast.md | head -2`
Expected: Zähler größer 5; die TextInput-Zeile zeigt `border-control`.

- [ ] **Step 4: Commit**

```bash
git add specimen/export-migration.mjs docs/migration/altlast.md
git commit -m "Ticket #29108: Altlast als Arbeitsliste exportiert -- das Erbe der Abbildung

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 2: Paketgerüst und Rechenkerne

**Files:**
- Create: `design-system/package.json`
- Create: `design-system/tools/lib/color.mjs` (Kopie von `specimen/brand.mjs`)
- Create: `design-system/tools/lib/contrast.mjs` (Kopie von `specimen/contrast.mjs`)
- Create: `design-system/tools/lib/naming.mjs` (Kopie von `specimen/primitive.mjs`, Import auf `./color.mjs`)
- Create: `design-system/test/contrast.test.mjs`, `design-system/test/naming.test.mjs` (Kopien der alten Tests, Importpfade angepasst)

**Interfaces:**
- Produces: `hexZuOklch`, `oklchZuHex`, `beschriftungAbleiten(flaecheHex, {dunklerKandidat, hellerKandidat})`, `farbtonAbstand`, `FARBTON_ABSTAND_MIN` aus `tools/lib/color.mjs`; `ratio`, `AA_TEXT`, `AA_NON_TEXT` aus `tools/lib/contrast.mjs`; `primitiveAbleiten`, `familie`, `stufe` aus `tools/lib/naming.mjs`

- [ ] **Step 1: Verzeichnisse und package.json**

```bash
mkdir -p design-system/{src,dist,tools/lib,test,specimen}
cat > design-system/package.json <<'EOF'
{
  "name": "@toplogic/design-system",
  "version": "0.1.0",
  "description": "TopLogic Design System: Primitive, semantische Tokens, Grundklassen, Komponenten. Quelle in src/, Erzeugnis in dist/.",
  "type": "module",
  "license": "UNLICENSED",
  "files": ["dist"],
  "scripts": {
    "build": "node tools/generate.mjs",
    "lint": "node tools/lint-css.mjs",
    "test": "node --test test/",
    "serve": "node tools/serve.mjs"
  },
  "engines": { "node": ">=22" }
}
EOF
```

- [ ] **Step 2: Rechenkerne kopieren**

```bash
cp specimen/brand.mjs design-system/tools/lib/color.mjs
cp specimen/contrast.mjs design-system/tools/lib/contrast.mjs
cp specimen/primitive.mjs design-system/tools/lib/naming.mjs
sed -i '' "s#from './brand.mjs'#from './color.mjs'#" design-system/tools/lib/naming.mjs
grep -n "import" design-system/tools/lib/color.mjs
```

Expected: `color.mjs` importiert nur aus `./contrast.mjs` (falls es `./contrast.mjs` importiert, liegt die Datei daneben, Pfad stimmt).

- [ ] **Step 3: Tests kopieren und Pfade anpassen**

```bash
cp specimen/contrast.test.mjs design-system/test/contrast.test.mjs
cp specimen/primitive.test.mjs design-system/test/naming.test.mjs
sed -i '' "s#from './contrast.mjs'#from '../tools/lib/contrast.mjs'#" design-system/test/contrast.test.mjs
sed -i '' "s#from './primitive.mjs'#from '../tools/lib/naming.mjs'#; s#from './brand.mjs'#from '../tools/lib/color.mjs'#" design-system/test/naming.test.mjs
```

- [ ] **Step 4: Tests laufen lassen**

Run: `cd design-system && node --test test/`
Expected: alle Tests grün (die Zahl steht in der Ausgabe; `fail 0`).

- [ ] **Step 5: Commit**

```bash
git add design-system
git commit -m "Ticket #29108: Paketgeruest @toplogic/design-system mit den uebernommenen Rechenkernen

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 3: Primitive und Tokens unter neuen Namen

Die Werte kommen aus `specimen/skala.json`, die Namen aus der Spec. Neu gegenüber der Skala: `surface-scrim`, die vier `disabled`-Rollen, `icon-primary`/`icon-secondary`, die Ebenen (`layer-*`). Entfallen: die `leading-*`-Primitive (Zeilenhöhen stehen einheitenlos in den Typo-Klassen).

**Files:**
- Create: `design-system/src/primitives.json`
- Create: `design-system/src/tokens.json`
- Create: `design-system/test/layers.test.mjs`

**Interfaces:**
- Produces: `primitives.json` mit Gruppen `color`, `measure`, `font`, `motion`, `effect`; `tokens.json` mit `color.light`, `color.dark`, `effect.light`, `effect.dark`, `measure`, `density.normal`, `density.compact`, `layer`, `type`, `print`, `derived`

- [ ] **Step 1: Schichten-Test schreiben (rot)**

`design-system/test/layers.test.mjs`:

```js
// Die Trennung der Schichten ist die Stelle, an der ein Kundenprojekt eingreift.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const P = JSON.parse(readFileSync(new URL('../src/primitives.json', import.meta.url)));
const T = JSON.parse(readFileSync(new URL('../src/tokens.json', import.meta.url)));
const REF = /^\{([a-z0-9-]+)\}$/;
const KATEGORIEN = ['surface', 'text', 'icon', 'border', 'focus', 'shadow', 'space', 'radius',
  'size', 'font', 'duration', 'easing', 'layer', 'status'];

export const primitive = () => Object.assign({}, ...Object.values(P).filter((g) => typeof g === 'object'));

function leaves(o, path = '') {
  const out = [];
  for (const [k, v] of Object.entries(o)) {
    if (k.startsWith('_')) continue;
    if (v && typeof v === 'object') out.push(...leaves(v, `${path}${k}.`));
    else out.push([`${path}${k}`, v]);
  }
  return out;
}
const semantisch = () => [...leaves(T.color), ...leaves(T.effect), ...leaves(T.measure),
  ...leaves(T.density), ...leaves(T.layer)];

test('kein Wert in der semantischen Schicht, nur Referenzen', () => {
  for (const [path, v] of semantisch())
    assert.match(String(v), REF, `${path} = ${v} — Werte gehören in primitives.json`);
});

test('jede Referenz zeigt auf eine vorhandene Primitive', () => {
  const known = new Set(Object.keys(primitive()));
  for (const [path, v] of semantisch())
    assert.ok(known.has(REF.exec(v)[1]), `${path} zeigt auf unbekanntes ${v}`);
});

test('keine Primitive ohne Leser', () => {
  const used = new Set(semantisch().map(([, v]) => REF.exec(v)[1]));
  for (const [, v] of leaves(T.type)) { const m = REF.exec(String(v)); if (m) used.add(m[1]); }
  for (const name of Object.keys(primitive()))
    assert.ok(used.has(name), `${name} wird von keinem Token gelesen`);
});

test('Primitivnamen sind Familie plus Stufe und tragen keine Rolle', () => {
  const rolle = /(primary|secondary|brand|focus|border|surface|status|field|helper|placeholder|control|row|padding|gap|link|hover|active|selected|disabled)/;
  for (const name of Object.keys(primitive())) {
    assert.match(name, /^[a-z]+-\d+$/, `${name}: Form ist familie-stufe`);
    assert.ok(!rolle.test(name), `${name} trägt eine Rolle im Namen`);
  }
});

test('jeder Tokenname beginnt mit einer der geschlossenen Kategorien', () => {
  const names = [...Object.keys(T.color.light), ...Object.keys(T.effect.light),
    ...Object.keys(T.measure), ...Object.keys(T.density.normal), ...Object.keys(T.layer),
    ...Object.keys(T.derived.light)];
  for (const n of names)
    assert.ok(KATEGORIEN.some((k) => n === k || n.startsWith(`${k}-`)),
      `${n}: keine bekannte Kategorie (${KATEGORIEN.join(', ')})`);
});

test('beide Modi belegen dieselben Rollen, nichts wird geerbt', () => {
  assert.deepEqual(Object.keys(T.color.dark).sort(), Object.keys(T.color.light).sort());
  assert.deepEqual(Object.keys(T.effect.dark).sort(), Object.keys(T.effect.light).sort());
  assert.deepEqual(Object.keys(T.derived.dark).sort(), Object.keys(T.derived.light).sort());
});

test('kompakt überschreibt dieselben Maße wie normal, und nie eine Schriftgröße', () => {
  assert.deepEqual(Object.keys(T.density.compact).sort(), Object.keys(T.density.normal).sort());
  for (const n of Object.keys(T.density.normal)) assert.ok(!n.startsWith('font-'), n);
});

test('Beschriftungen auf Flächen stehen nur unter derived, nie als Referenz', () => {
  for (const n of Object.keys(T.color.light))
    assert.ok(!/^(text|icon)-on-/.test(n), `${n} gehört unter derived`);
  for (const [n, v] of Object.entries(T.derived.light))
    assert.ok(Object.keys(T.color.light).includes(v.surface), `${n}: Fläche ${v.surface} unbekannt`);
});

test('ein Kunde tauscht eine Primitive und alle Rollen ziehen mit', async () => {
  const { resolve } = await import('../tools/resolve.mjs');
  const kunde = structuredClone({ P, T });
  const marke = REF.exec(T.color.light['surface-brand'])[1];
  kunde.P.color[marke] = '#7A1FA2';
  const r = resolve(kunde.P, kunde.T);
  for (const rolle of ['surface-brand', 'text-link', 'focus-ring', 'border-interactive'])
    assert.equal(r.color.light[rolle], '#7A1FA2', `${rolle} ist nicht gefolgt`);
});
```

- [ ] **Step 2: Test laufen lassen, rot**

Run: `cd design-system && node --test test/layers.test.mjs`
Expected: FAIL, `primitives.json` fehlt.

- [ ] **Step 3: primitives.json schreiben**

Die Farbwerte sind die aus `specimen/skala.json` (`primitiv.farbe`), unverändert. Maße bekommen einstellige Stufen. Neu: `scrim-1`, `scrim-2`, `depth-0…5`, `curve-1…3`, `dur-1…3`, `font-1`, `font-2`, `shadow-1…6`.

`design-system/src/primitives.json`:

```json
{
  "_": "Reine Werte ohne Bedeutung. Einzige Stelle mit Zahlen. Hier greift ein Kundenprojekt ein.",
  "color": {
    "amber-4": "#FEEFCF", "amber-20": "#EAB532", "amber-25": "#D9A514", "amber-34": "#B88A00",
    "amber-40": "#A27A00", "amber-44": "#936E00", "amber-49": "#805F00", "amber-76": "#281C02",
    "blue-6": "#DFEBFF", "blue-9": "#CEE1FF", "blue-21": "#95BDFF", "blue-27": "#75A9FF",
    "blue-32": "#5394FF", "blue-43": "#2471EC", "blue-49": "#0B5ED7", "blue-55": "#004DBA",
    "blue-62": "#003A8F", "blue-69": "#1E2F4B", "blue-74": "#162338",
    "gray-0": "#FFFFFF", "gray-1": "#FAFAFA", "gray-3": "#F0F4F9", "gray-4": "#F0F2F6",
    "gray-5": "#F0F3F9", "gray-7": "#E5E8ED", "gray-10": "#D9DDE3", "gray-18": "#C1C4C9",
    "gray-29": "#A0A3A8", "gray-34": "#8E9196", "gray-35": "#8C8F94", "gray-36": "#888B90",
    "gray-39": "#7F8286", "gray-45": "#6F7277", "gray-46": "#6B6E73", "gray-48": "#676A6F",
    "gray-49": "#64676B", "gray-55": "#54565B", "gray-66": "#34383C", "gray-67": "#343A3F",
    "gray-69": "#2B3034", "gray-70": "#2B2F33", "gray-72": "#27292D", "gray-73": "#22262A",
    "gray-74": "#242729", "gray-76": "#1D2023", "gray-77": "#1B1D21", "gray-79": "#16181B",
    "green-5": "#DCF8E9", "green-24": "#60C99A", "green-34": "#3DA97B", "green-36": "#36A376",
    "green-41": "#1E9266", "green-46": "#008459", "green-51": "#00734D", "green-77": "#0C2319",
    "red-4": "#FFEBE8", "red-32": "#FB594D", "red-35": "#F14F43", "red-37": "#E8463C",
    "red-42": "#D7352D", "red-45": "#CC2823", "red-47": "#C51E1C", "red-77": "#35110D",
    "teal-6": "#CEF3FB", "teal-25": "#33C1DB", "teal-35": "#159FB6", "teal-41": "#008DA2",
    "teal-45": "#007F92", "teal-51": "#006E80", "teal-75": "#002830"
  },
  "measure": {
    "size-1": "0.25rem", "size-2": "0.5rem", "size-3": "0.75rem", "size-4": "1rem",
    "size-5": "1.25rem", "size-6": "1.5rem", "size-7": "2rem", "size-8": "3rem",
    "text-1": "0.75rem", "text-2": "0.875rem", "text-3": "1rem", "text-4": "1.25rem",
    "text-5": "1.5rem", "text-6": "2rem",
    "height-1": "1.5rem", "height-2": "1.75rem", "height-3": "2rem", "height-4": "2.25rem",
    "line-1": "1px", "line-2": "2px", "line-3": "4px",
    "corner-1": "0.25rem", "corner-2": "0.5rem", "corner-3": "999px", "corner-4": "50%",
    "depth-0": "0", "depth-1": "10", "depth-2": "100", "depth-3": "1000", "depth-4": "1100", "depth-5": "1200"
  },
  "font": {
    "font-1": "'Inter', ui-sans-serif, system-ui, 'Segoe UI', Roboto, sans-serif",
    "font-2": "'JetBrains Mono', ui-monospace, SFMono-Regular, Consolas, monospace"
  },
  "motion": {
    "dur-1": "100ms", "dur-2": "150ms", "dur-3": "250ms",
    "curve-1": "cubic-bezier(0.2, 0, 0.38, 0.9)", "curve-2": "cubic-bezier(0, 0, 0.38, 0.9)",
    "curve-3": "cubic-bezier(0.2, 0, 1, 0.9)", "curve-4": "linear"
  },
  "effect": {
    "shadow-1": "0 2px 8px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)",
    "shadow-2": "0 8px 24px rgba(0,0,0,0.16)",
    "shadow-3": "0 12px 32px rgba(0,0,0,0.20)",
    "shadow-4": "0 2px 8px rgba(0,0,0,0.40)",
    "shadow-5": "0 8px 24px rgba(0,0,0,0.56)",
    "shadow-6": "0 12px 32px rgba(0,0,0,0.64)",
    "scrim-1": "rgba(22, 24, 27, 0.48)",
    "scrim-2": "rgba(0, 0, 0, 0.64)"
  }
}
```

- [ ] **Step 4: tokens.json schreiben**

`design-system/src/tokens.json`:

```json
{
  "_": "Semantische Tokens. Nur Referenzen {name} auf primitives.json. Begründung: docs/skalen.md",
  "color": {
    "light": {
      "surface-base": "{gray-1}", "surface-layer": "{gray-0}", "surface-layer-nested": "{gray-0}",
      "surface-overlay": "{gray-0}", "surface-field": "{gray-3}",
      "surface-interactive-hover": "{gray-4}", "surface-interactive-selected": "{gray-7}",
      "surface-interactive-active": "{gray-10}", "surface-disabled": "{gray-7}",
      "surface-brand": "{blue-49}", "surface-brand-hover": "{blue-55}", "surface-brand-active": "{blue-62}",
      "surface-brand-subtle": "{blue-6}", "surface-brand-subtle-hover": "{blue-9}",
      "text-primary": "{gray-77}", "text-secondary": "{gray-55}", "text-helper": "{gray-48}",
      "text-placeholder": "{gray-46}", "text-disabled": "{gray-29}",
      "text-link": "{blue-49}", "text-link-hover": "{blue-55}",
      "icon-primary": "{gray-77}", "icon-secondary": "{gray-55}", "icon-disabled": "{gray-29}",
      "border-separator": "{gray-18}", "border-control": "{gray-35}", "border-emphasis": "{gray-45}",
      "border-interactive": "{blue-49}", "border-disabled": "{gray-18}",
      "focus-ring": "{blue-49}",
      "status-error-text": "{red-42}", "status-error-border": "{red-32}", "status-error-surface": "{red-45}", "status-error-subtle": "{red-4}",
      "status-warning-text": "{amber-44}", "status-warning-border": "{amber-34}", "status-warning-surface": "{amber-25}", "status-warning-subtle": "{amber-4}",
      "status-success-text": "{green-46}", "status-success-border": "{green-36}", "status-success-surface": "{green-34}", "status-success-subtle": "{green-5}",
      "status-info-text": "{teal-45}", "status-info-border": "{teal-35}", "status-info-surface": "{teal-25}", "status-info-subtle": "{teal-6}"
    },
    "dark": {
      "surface-base": "{gray-79}", "surface-layer": "{gray-76}", "surface-layer-nested": "{gray-74}",
      "surface-overlay": "{gray-70}", "surface-field": "{gray-72}",
      "surface-interactive-hover": "{gray-73}", "surface-interactive-selected": "{gray-69}",
      "surface-interactive-active": "{gray-67}", "surface-disabled": "{gray-69}",
      "surface-brand": "{blue-32}", "surface-brand-hover": "{blue-27}", "surface-brand-active": "{blue-43}",
      "surface-brand-subtle": "{blue-74}", "surface-brand-subtle-hover": "{blue-69}",
      "text-primary": "{gray-5}", "text-secondary": "{gray-29}", "text-helper": "{gray-36}",
      "text-placeholder": "{gray-34}", "text-disabled": "{gray-49}",
      "text-link": "{blue-27}", "text-link-hover": "{blue-21}",
      "icon-primary": "{gray-5}", "icon-secondary": "{gray-29}", "icon-disabled": "{gray-49}",
      "border-separator": "{gray-66}", "border-control": "{gray-49}", "border-emphasis": "{gray-39}",
      "border-interactive": "{blue-32}", "border-disabled": "{gray-66}",
      "focus-ring": "{blue-32}",
      "status-error-text": "{red-37}", "status-error-border": "{red-47}", "status-error-surface": "{red-35}", "status-error-subtle": "{red-77}",
      "status-warning-text": "{amber-40}", "status-warning-border": "{amber-49}", "status-warning-surface": "{amber-20}", "status-warning-subtle": "{amber-76}",
      "status-success-text": "{green-41}", "status-success-border": "{green-51}", "status-success-surface": "{green-24}", "status-success-subtle": "{green-77}",
      "status-info-text": "{teal-41}", "status-info-border": "{teal-51}", "status-info-surface": "{teal-25}", "status-info-subtle": "{teal-75}"
    }
  },
  "derived": {
    "_": "Beschriftungen auf Flächen: gerechnet, nie geschrieben. candidates nennt die Rollen, aus denen der Kontrast wählt.",
    "light": {
      "text-on-brand": { "surface": "surface-brand" },
      "text-on-brand-hover": { "surface": "surface-brand-hover" },
      "text-on-brand-active": { "surface": "surface-brand-active" },
      "icon-on-brand": { "surface": "surface-brand" },
      "text-on-status-error": { "surface": "status-error-surface" },
      "text-on-status-warning": { "surface": "status-warning-surface" },
      "text-on-status-success": { "surface": "status-success-surface" },
      "text-on-status-info": { "surface": "status-info-surface" }
    },
    "dark": {
      "text-on-brand": { "surface": "surface-brand" },
      "text-on-brand-hover": { "surface": "surface-brand-hover" },
      "text-on-brand-active": { "surface": "surface-brand-active" },
      "icon-on-brand": { "surface": "surface-brand" },
      "text-on-status-error": { "surface": "status-error-surface" },
      "text-on-status-warning": { "surface": "status-warning-surface" },
      "text-on-status-success": { "surface": "status-success-surface" },
      "text-on-status-info": { "surface": "status-info-surface" }
    },
    "candidates": { "dark": "{gray-77}", "light": "{gray-0}" }
  },
  "effect": {
    "light": { "shadow-popover": "{shadow-1}", "shadow-dialog": "{shadow-2}", "shadow-drag": "{shadow-3}", "surface-scrim": "{scrim-1}" },
    "dark":  { "shadow-popover": "{shadow-4}", "shadow-dialog": "{shadow-5}", "shadow-drag": "{shadow-6}", "surface-scrim": "{scrim-2}" }
  },
  "measure": {
    "font-size-label": "{text-1}", "font-size-body": "{text-2}", "font-size-heading-sm": "{text-3}",
    "font-size-heading-md": "{text-4}", "font-size-heading-lg": "{text-5}", "font-size-display": "{text-6}",
    "font-family-sans": "{font-1}", "font-family-mono": "{font-2}",
    "space-2xs": "{size-1}", "space-xs": "{size-2}", "space-sm": "{size-3}", "space-md": "{size-4}",
    "space-lg": "{size-6}", "space-xl": "{size-7}", "space-2xl": "{size-8}",
    "radius-sm": "{corner-1}", "radius-md": "{corner-2}", "radius-full": "{corner-3}", "radius-round": "{corner-4}",
    "size-icon-glyph": "{size-3}", "size-icon-sm": "{size-4}", "size-icon-md": "{size-5}", "size-icon-lg": "{size-6}",
    "border-width-sm": "{line-1}", "border-width-md": "{line-2}", "border-width-accent": "{line-3}",
    "focus-width": "{line-2}", "focus-offset": "{line-2}",
    "duration-fast": "{dur-1}", "duration-base": "{dur-2}", "duration-slow": "{dur-3}",
    "easing-standard": "{curve-1}", "easing-entrance": "{curve-2}", "easing-exit": "{curve-3}", "easing-linear": "{curve-4}"
  },
  "density": {
    "normal":  { "size-control": "{height-3}", "size-control-sm": "{height-1}", "size-row": "{height-4}",
                 "space-control-x": "{size-3}", "space-control-y": "{size-2}", "space-control-gap": "{size-4}" },
    "compact": { "size-control": "{height-2}", "size-control-sm": "{height-1}", "size-row": "{height-3}",
                 "space-control-x": "{size-2}", "space-control-y": "{size-1}", "space-control-gap": "{size-3}" }
  },
  "layer": {
    "layer-base": "{depth-0}", "layer-raised": "{depth-1}", "layer-sticky": "{depth-2}",
    "layer-overlay": "{depth-3}", "layer-popover": "{depth-4}", "layer-toast": "{depth-5}"
  },
  "type": {
    "_": "Klassen .tl-type-*. Zeilenhöhe einheitenlos, ergibt bei Standardwurzel 16/20/24/28/32/40 px.",
    "display":       { "family": "sans", "size": "display",    "weight": 600, "lineHeight": 1.25,   "tracking": "-0.01em" },
    "heading-lg":    { "family": "sans", "size": "heading-lg", "weight": 600, "lineHeight": 1.3333, "tracking": "-0.005em" },
    "heading-md":    { "family": "sans", "size": "heading-md", "weight": 600, "lineHeight": 1.4,    "tracking": "0" },
    "heading-sm":    { "family": "sans", "size": "heading-sm", "weight": 600, "lineHeight": 1.5,    "tracking": "0" },
    "body":          { "family": "sans", "size": "body",       "weight": 400, "lineHeight": 1.4286, "tracking": "0" },
    "body-strong":   { "family": "sans", "size": "body",       "weight": 600, "lineHeight": 1.4286, "tracking": "0" },
    "label":         { "family": "sans", "size": "label",      "weight": 400, "lineHeight": 1.3333, "tracking": "0.01em" },
    "label-strong":  { "family": "sans", "size": "label",      "weight": 600, "lineHeight": 1.3333, "tracking": "0.01em" },
    "code":          { "family": "mono", "size": "body",       "weight": 400, "lineHeight": 1.4286, "tracking": "0" }
  },
  "print": {
    "title":   { "size": "18pt", "weight": 600, "lineHeight": 1.25 },
    "heading": { "size": "12pt", "weight": 600, "lineHeight": 1.35 },
    "body":    { "size": "10pt", "weight": 400, "lineHeight": 1.4 },
    "caption": { "size": "8pt",  "weight": 400, "lineHeight": 1.35 }
  }
}
```

- [ ] **Step 5: resolve.mjs schreiben**

`design-system/tools/resolve.mjs`:

```js
// Löst Referenzen auf Werte auf und erzeugt die Beschriftungen auf Flächen.
// Gebraucht zum Rechnen (Kontrast, DTCG) — das erzeugte CSS löst NICHT auf,
// dort bleibt var(--tl-blue-49) stehen, damit ein Kunde die Primitive tauschen kann.
import { beschriftungAbleiten } from './lib/color.mjs';

const REF = /^\{([a-z0-9-]+)\}$/;

export function primitives(P) {
  return Object.assign({}, ...Object.entries(P).filter(([k]) => !k.startsWith('_')).map(([, g]) => g));
}

export function deref(value, prim) {
  const m = REF.exec(String(value));
  if (!m) return value;
  if (!(m[1] in prim)) throw new Error(`unbekannte Primitive: ${m[1]}`);
  return prim[m[1]];
}

function walk(o, prim) {
  return Object.fromEntries(Object.entries(o).filter(([k]) => !k.startsWith('_'))
    .map(([k, v]) => [k, v && typeof v === 'object' ? walk(v, prim) : deref(v, prim)]));
}

/** @returns { color:{light,dark}, derived:{light,dark}, effect, measure, density, layer } mit Werten */
export function resolve(P, T) {
  const prim = primitives(P);
  const color = walk(T.color, prim);
  const kandidaten = {
    dunklerKandidat: deref(T.derived.candidates.dark, prim),
    hellerKandidat: deref(T.derived.candidates.light, prim),
  };
  const derived = {};
  for (const mode of ['light', 'dark']) {
    derived[mode] = {};
    for (const [name, { surface }] of Object.entries(T.derived[mode])) {
      if (!(surface in color[mode])) throw new Error(`${name}: Fläche ${surface} unbekannt`);
      derived[mode][name] = beschriftungAbleiten(color[mode][surface], kandidaten).hex;
    }
  }
  return {
    color, derived,
    effect: walk(T.effect, prim), measure: walk(T.measure, prim),
    density: walk(T.density, prim), layer: walk(T.layer, prim),
  };
}
```

- [ ] **Step 6: Tests laufen lassen, grün**

Run: `cd design-system && node --test test/layers.test.mjs`
Expected: 9 Tests, `fail 0`.

- [ ] **Step 7: Commit**

```bash
git add design-system/src design-system/tools/resolve.mjs design-system/test/layers.test.mjs
git commit -m "Ticket #29108: Primitive und Tokens unter neuen Namen -- zwei Schichten, geschlossene Kategorien

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 4: Kontrast-, Maß- und Farbton-Gates

**Files:**
- Create: `design-system/test/tokens.test.mjs`

**Interfaces:**
- Consumes: `resolve(P, T)` aus `tools/resolve.mjs`; `ratio` aus `tools/lib/contrast.mjs`; `farbtonAbstand`, `FARBTON_ABSTAND_MIN` aus `tools/lib/color.mjs`

- [ ] **Step 1: Test schreiben**

`design-system/test/tokens.test.mjs`:

```js
// Jede Regel aus docs/skalen.md als Test. Gerechnet auf den aufgelösten Werten.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ratio } from '../tools/lib/contrast.mjs';
import { farbtonAbstand, FARBTON_ABSTAND_MIN } from '../tools/lib/color.mjs';
import { resolve } from '../tools/resolve.mjs';

const P = JSON.parse(readFileSync(new URL('../src/primitives.json', import.meta.url)));
const T = JSON.parse(readFileSync(new URL('../src/tokens.json', import.meta.url)));
const R = resolve(P, T);
const MODES = ['light', 'dark'];
const HEX = /^#[0-9A-F]{6}$/;

test('jeder Farbwert ist ein großgeschriebenes 6-stelliges Hex', () => {
  for (const [n, v] of Object.entries(P.color)) assert.match(v, HEX, `${n} = ${v}`);
});

test('Text und Linien erfüllen ihre Anforderung gegen die richtige Fläche', () => {
  const forderung = [
    ['text-primary', 'surface-base', 16.0], ['text-secondary', 'surface-base', 7.0],
    ['text-helper', 'surface-base', 5.2], ['text-placeholder', 'surface-field', 4.6],
    ['text-link', 'surface-base', 4.5], ['text-link-hover', 'surface-base', 4.5],
    ['icon-primary', 'surface-base', 3.0], ['icon-secondary', 'surface-base', 3.0],
    ['border-emphasis', 'surface-base', 4.6], ['border-control', 'surface-base', 3.0],
    ['border-interactive', 'surface-base', 3.0], ['focus-ring', 'surface-base', 3.0],
    ['text-link', 'surface-brand-subtle', 4.5], ['text-primary', 'surface-brand-subtle', 4.5],
  ];
  for (const m of MODES) for (const [fg, bg, soll] of forderung) {
    const ist = ratio(R.color[m][fg], R.color[m][bg]);
    assert.ok(ist >= soll, `${m}: ${fg} auf ${bg} = ${ist.toFixed(2)}, gefordert ${soll}`);
  }
});

test('Text steht auf jeder Fläche, auf der er liegen kann', () => {
  for (const m of MODES) for (const bg of ['surface-layer', 'surface-layer-nested', 'surface-overlay',
    'surface-interactive-hover', 'surface-interactive-selected', 'surface-interactive-active']) {
    const ist = ratio(R.color[m]['text-primary'], R.color[m][bg]);
    assert.ok(ist >= 4.5, `${m}: text-primary auf ${bg} = ${ist.toFixed(2)}`);
  }
});

test('border-separator trennt nur und schuldet keinen Kontrast', () => {
  for (const m of MODES) {
    const ist = ratio(R.color[m]['border-separator'], R.color[m]['surface-base']);
    assert.ok(ist < 3.0, `${m}: ein Separator mit ${ist.toFixed(2)} wäre ein Control-Rahmen`);
  }
});

test('jede Statusbedeutung erfüllt text 4,5 und border 3,0 auf dem Grund', () => {
  for (const m of MODES) for (const s of ['error', 'warning', 'success', 'info']) {
    const bg = R.color[m]['surface-base'];
    const t = ratio(R.color[m][`status-${s}-text`], bg);
    const b = ratio(R.color[m][`status-${s}-border`], bg);
    assert.ok(t >= 4.5, `${m}: status-${s}-text = ${t.toFixed(2)}`);
    assert.ok(b >= 3.0, `${m}: status-${s}-border = ${b.toFixed(2)}`);
    const sub = ratio(R.color[m]['text-primary'], R.color[m][`status-${s}-subtle`]);
    assert.ok(sub >= 4.5, `${m}: text-primary auf status-${s}-subtle = ${sub.toFixed(2)}`);
  }
});

test('auf jeder gefüllten Fläche trägt die erzeugte Beschriftung', () => {
  for (const m of MODES) for (const [name, { surface }] of Object.entries(T.derived[m])) {
    const soll = name.startsWith('icon-') ? 3.0 : 4.5;
    const ist = ratio(R.derived[m][name], R.color[m][surface]);
    assert.ok(ist >= soll, `${m}: ${name} auf ${surface} = ${ist.toFixed(2)}`);
  }
});

test('der Fokusring erreicht 3,0 gegen jede Fläche, auf der er liegen kann', () => {
  for (const m of MODES) for (const bg of ['surface-base', 'surface-layer', 'surface-layer-nested',
    'surface-overlay', 'surface-field', 'surface-brand-subtle']) {
    const ist = ratio(R.color[m]['focus-ring'], R.color[m][bg]);
    assert.ok(ist >= 3.0, `${m}: focus-ring auf ${bg} = ${ist.toFixed(2)}`);
  }
});

test('getönte Flächen verschiedener Bedeutung trennen sich im Farbton', () => {
  for (const m of MODES) {
    const subtle = ['surface-brand-subtle', 'status-error-subtle', 'status-warning-subtle',
      'status-success-subtle', 'status-info-subtle'].map((n) => [n, R.color[m][n]]);
    for (let i = 0; i < subtle.length; i++) for (let j = i + 1; j < subtle.length; j++) {
      const d = farbtonAbstand(subtle[i][1], subtle[j][1]);
      assert.ok(d >= FARBTON_ABSTAND_MIN, `${m}: ${subtle[i][0]} ↔ ${subtle[j][0]} = ${d.toFixed(1)}°`);
    }
  }
});

test('Schatten trägt nur, was schwebt — drei Stufen je Modus, keine raised', () => {
  for (const m of MODES) {
    const names = Object.keys(R.effect[m]).filter((n) => n.startsWith('shadow-')).sort();
    assert.deepEqual(names, ['shadow-dialog', 'shadow-drag', 'shadow-popover']);
  }
});

test('jede rem-Größe ist ein glattes Sechzehntel', () => {
  for (const [n, v] of Object.entries(P.measure)) {
    const m = /^([\d.]+)rem$/.exec(v);
    if (m) assert.ok(Number.isInteger(parseFloat(m[1]) * 16), `${n} = ${v} ist kein ganzes Pixel`);
  }
});

test('Abstände, Zeilen- und Control-Höhen liegen auf dem 4-px-Raster', () => {
  for (const [n, v] of Object.entries(P.measure)) {
    if (!/^(size|height)-/.test(n)) continue;
    const px = parseFloat(v) * 16;
    assert.equal(px % 4, 0, `${n} = ${px}px`);
  }
});

test('keine Schriftgröße unterschreitet 12 px', () => {
  for (const [n, v] of Object.entries(P.measure))
    if (n.startsWith('text-')) assert.ok(parseFloat(v) * 16 >= 12, `${n} = ${v}`);
});

test('Linien stehen in px, Maße in rem', () => {
  for (const [n, v] of Object.entries(P.measure)) {
    if (n.startsWith('line-')) assert.match(v, /px$/, n);
    if (/^(size|text|height)-/.test(n)) assert.match(v, /rem$/, n);
  }
});

test('die kleine Control-Höhe trägt die Trefferfläche aus WCAG 2.5.8', () => {
  for (const d of ['normal', 'compact'])
    assert.ok(parseFloat(R.density[d]['size-control-sm']) * 16 >= 24, d);
});

test('Zeilenhöhen der Typo-Klassen liegen auf dem 4-px-Raster', () => {
  for (const [n, k] of Object.entries(T.type)) {
    if (n.startsWith('_')) continue;
    const px = parseFloat(R.measure[`font-size-${k.size}`]) * 16 * k.lineHeight;
    assert.ok(Math.abs(px - Math.round(px)) < 0.01 && Math.round(px) % 4 === 0, `${n}: ${px}px`);
  }
});

test('die Ebenen steigen streng', () => {
  const v = ['layer-base', 'layer-raised', 'layer-sticky', 'layer-overlay', 'layer-popover', 'layer-toast']
    .map((n) => Number(R.layer[n]));
  for (let i = 1; i < v.length; i++) assert.ok(v[i] > v[i - 1], v.join(' < '));
});
```

- [ ] **Step 2: Laufen lassen**

Run: `cd design-system && node --test test/tokens.test.mjs`
Expected: `fail 0`. Schlägt `text-link auf surface-brand-subtle` oder ein `disabled`-Paar fehl, ist die Zuordnung in `tokens.json` zu prüfen, nicht der Test zu lockern; `disabled`-Rollen haben absichtlich kein Kontrastpaar.

- [ ] **Step 3: Commit**

```bash
git add design-system/test/tokens.test.mjs
git commit -m "Ticket #29108: Kontrast-, Mass- und Farbton-Gates auf den neuen Tokens

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 5: Generator für primitives.css, tokens.css, base.css

**Files:**
- Create: `design-system/tools/generate.mjs`
- Create: `design-system/test/generate.test.mjs`

**Interfaces:**
- Consumes: `resolve`, `primitives`, `deref` aus `tools/resolve.mjs`
- Produces: `generate(P, T)` → `{ 'primitives.css', 'tokens.css', 'base.css' }` als Strings; CLI schreibt nach `dist/`

- [ ] **Step 1: Test schreiben (rot)**

`design-system/test/generate.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { generate } from '../tools/generate.mjs';

const P = JSON.parse(readFileSync(new URL('../src/primitives.json', import.meta.url)));
const T = JSON.parse(readFileSync(new URL('../src/tokens.json', import.meta.url)));
const out = generate(P, T);
const prim = out['primitives.css'], tok = out['tokens.css'], base = out['base.css'];

test('primitives.css trägt jede Primitive als --tl-Variable mit ihrem Wert', () => {
  for (const g of Object.values(P)) if (typeof g === 'object')
    for (const [n, v] of Object.entries(g)) assert.ok(prim.includes(`--tl-${n}: ${v};`), n);
});

test('tokens.css enthält keinen Wert, nur var()-Referenzen', () => {
  const decls = tok.match(/--tl-[a-z0-9-]+:\s*[^;]+;/g);
  for (const d of decls) {
    if (/^--tl-(text|icon)-on-/.test(d)) continue; // erzeugte Beschriftungen tragen Hex
    assert.match(d, /:\s*var\(--tl-[a-z0-9-]+\);$/, d);
  }
});

test('jede Farbrolle steht in beiden Modi', () => {
  const light = tok.slice(0, tok.indexOf('[data-tl-mode="dark"]'));
  const dark = tok.slice(tok.indexOf('[data-tl-mode="dark"]'));
  for (const n of Object.keys(T.color.light)) {
    assert.ok(light.includes(`--tl-${n}:`), `${n} fehlt hell`);
    assert.ok(dark.includes(`--tl-${n}:`), `${n} fehlt dunkel`);
  }
});

test('die erzeugten Beschriftungen stehen als Hex in beiden Modi', () => {
  for (const mode of ['light', 'dark']) {
    const block = mode === 'light' ? tok.slice(0, tok.indexOf('[data-tl-mode="dark"]')) : tok.slice(tok.indexOf('[data-tl-mode="dark"]'));
    for (const n of Object.keys(T.derived[mode]))
      assert.match(block, new RegExp(`--tl-${n}: #[0-9A-F]{6};`), `${n} ${mode}`);
  }
});

test('hell ist der Standard, dunkel und kompakt sind Attribute', () => {
  assert.ok(tok.includes(':root,\n[data-tl-mode="light"]'));
  assert.ok(tok.includes('[data-tl-mode="dark"] {'));
  assert.ok(tok.includes('[data-tl-density="compact"] {'));
  assert.ok(!tok.includes('data-modus'), 'alte Attribute');
});

test('color-scheme folgt dem Modus', () => {
  assert.ok(tok.includes('color-scheme: light;'));
  assert.ok(tok.includes('color-scheme: dark;'));
});

test('base.css: jede Typo-Klasse setzt fünf Eigenschaften aus Variablen', () => {
  for (const [n, k] of Object.entries(T.type)) {
    if (n.startsWith('_')) continue;
    const i = base.indexOf(`.tl-type-${n} {`);
    assert.ok(i >= 0, `.tl-type-${n} fehlt`);
    const rule = base.slice(i, base.indexOf('}', i));
    assert.ok(rule.includes(`font-family: var(--tl-font-family-${k.family})`), n);
    assert.ok(rule.includes(`font-size: var(--tl-font-size-${k.size})`), n);
    assert.ok(rule.includes(`font-weight: ${k.weight}`), n);
    assert.ok(rule.includes(`line-height: ${k.lineHeight}`), n);
    assert.ok(rule.includes(`letter-spacing: ${k.tracking}`), n);
  }
});

test('base.css: Zahlenklasse, Fokusring, Reduced Motion, Druckklassen', () => {
  assert.ok(base.includes('.tl-nums {'));
  assert.ok(base.includes('font-variant-numeric: tabular-nums slashed-zero'));
  assert.equal((base.match(/:focus-visible/g) ?? []).length, 1, 'genau ein Fokusring');
  assert.ok(base.includes('outline: var(--tl-focus-width) solid var(--tl-focus-ring)'));
  assert.ok(base.includes('outline-offset: var(--tl-focus-offset)'));
  assert.ok(!/:focus\b(?!-visible)/.test(base), 'kein :focus ohne -visible');
  assert.ok(base.includes('@media (prefers-reduced-motion: reduce)'));
  assert.ok(base.includes('transition-duration: 0.01ms !important'));
  assert.ok(base.includes('@media print'));
  for (const n of Object.keys(T.print)) assert.ok(base.includes(`.tl-print-${n} {`), n);
});

test('base.css: der Body liest Grund, Text und Schrift aus Tokens', () => {
  assert.ok(base.includes('background: var(--tl-surface-base)'));
  assert.ok(base.includes('color: var(--tl-text-primary)'));
  assert.ok(base.includes('font-family: var(--tl-font-family-sans)'));
});

test('außerhalb von primitives.css steht keine Farbe und keine Dauer als Literal', () => {
  const text = tok.replace(/--tl-(text|icon)-on-[a-z-]+: #[0-9A-F]{6};/g, '') + base;
  assert.equal((text.match(/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/g) ?? []).length, 0, 'Farbliteral');
  assert.equal((text.replace(/0\.01ms/g, '').match(/\b\d+m?s\b/g) ?? []).length, 0, 'Dauer-Literal');
});
```

- [ ] **Step 2: Rot**

Run: `cd design-system && node --test test/generate.test.mjs`
Expected: FAIL, `generate.mjs` fehlt.

- [ ] **Step 3: generate.mjs schreiben**

`design-system/tools/generate.mjs`:

```js
// Erzeugt dist/ aus src/. Was hier nicht herauskommt, gibt es im Design System nicht.
import { resolve, primitives } from './resolve.mjs';

const REF = /^\{([a-z0-9-]+)\}$/;
const line = (n, v) => `  --tl-${n}: ${v};`;
const asVar = (v) => { const m = REF.exec(String(v)); return m ? `var(--tl-${m[1]})` : v; };
const block = (o) => Object.entries(o).filter(([k]) => !k.startsWith('_')).map(([n, v]) => line(n, asVar(v))).join('\n');
const HEAD = `/* Erzeugt aus src/ mit tools/generate.mjs. Nicht von Hand ändern.
   Begründung zu jedem Wert: docs/skalen.md */\n\n`;

function primitivesCss(P) {
  return `${HEAD}/* Schicht 1: Primitive. Reine Werte ohne Bedeutung — die Stelle, an der ein
   Kundenprojekt eingreift. Wer hier einen Wert überschreibt, ändert jede Rolle mit. */
:root {
${block(primitives(P))}
}
`;
}

function tokensCss(P, T, R) {
  const derived = (mode) => Object.entries(R.derived[mode]).map(([n, v]) => line(n, v)).join('\n');
  return `${HEAD}/* Schicht 2: Rollen. Jede verweist auf eine Primitive, keine trägt einen Wert.
   Ausnahme: Beschriftungen auf Flächen (--tl-text-on-*, --tl-icon-on-*) sind gerechnet. */
:root,
[data-tl-mode="light"] {
  color-scheme: light;
${block(T.measure)}
${block(T.layer)}

${block(T.color.light)}
${derived('light')}

${block(T.effect.light)}

${block(T.density.normal)}
}

[data-tl-mode="dark"] {
  color-scheme: dark;
${block(T.color.dark)}
${derived('dark')}

${block(T.effect.dark)}
}

[data-tl-density="compact"] {
${block(T.density.compact)}
}
`;
}

function baseCss(T) {
  const type = Object.entries(T.type).filter(([k]) => !k.startsWith('_')).map(([n, k]) => `.tl-type-${n} {
  font-family: var(--tl-font-family-${k.family});
  font-size: var(--tl-font-size-${k.size});
  font-weight: ${k.weight};
  line-height: ${k.lineHeight};
  letter-spacing: ${k.tracking};
}`).join('\n\n');
  const print = Object.entries(T.print).map(([n, k]) => `  .tl-print-${n} {
    font-size: ${k.size};
    font-weight: ${k.weight};
    line-height: ${k.lineHeight};
  }`).join('\n');
  return `${HEAD}/* Grundklassen. Jede liest nur Variablen. */
html {
  -webkit-text-size-adjust: 100%;
}

body {
  margin: 0;
  background: var(--tl-surface-base);
  color: var(--tl-text-primary);
  font-family: var(--tl-font-family-sans);
  font-size: var(--tl-font-size-body);
  line-height: 1.4286;
}

*, *::before, *::after {
  box-sizing: border-box;
}

/* Typografie: eine Größe ist keine Klasse. Die Klasse legt alles fest. */
${type}

/* Zahlen in Spalten fluchten nur mit tabellarischen Ziffern. Pflicht, nicht Option. */
.tl-nums {
  font-feature-settings: "tnum" 1, "zero" 1;
  font-variant-numeric: tabular-nums slashed-zero;
}

/* Der Ring gehört der Tastatur. Ein Mechanismus, außen, nur :focus-visible. */
:where(a, button, input, select, textarea, summary, [tabindex], [contenteditable]):focus-visible {
  outline: var(--tl-focus-width) solid var(--tl-focus-ring);
  outline-offset: var(--tl-focus-offset);
}

/* Wer Bewegung abbestellt hat, hat sie abbestellt. 0.01ms statt 0, sonst feuert transitionend nie. */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Druck: rem hat im Druck keine Wurzel. Eigene Leiter in pt. */
@media print {
${print}
  .tl-print-title, .tl-print-heading, .tl-print-body, .tl-print-caption {
    font-variant-numeric: tabular-nums;
  }
}
`;
}

export function generate(P, T) {
  const R = resolve(P, T);
  return { 'primitives.css': primitivesCss(P), 'tokens.css': tokensCss(P, T, R), 'base.css': baseCss(T) };
}

if (typeof process !== 'undefined' && import.meta.url === `file://${process.argv[1]}`) {
  const { readFileSync, writeFileSync, mkdirSync } = await import('node:fs');
  const P = JSON.parse(readFileSync(new URL('../src/primitives.json', import.meta.url)));
  const T = JSON.parse(readFileSync(new URL('../src/tokens.json', import.meta.url)));
  const dist = new URL('../dist/', import.meta.url);
  mkdirSync(dist, { recursive: true });
  for (const [name, text] of Object.entries(generate(P, T))) {
    writeFileSync(new URL(name, dist), text);
    console.log(`geschrieben: dist/${name}`);
  }
  const { dtcg } = await import('./dtcg.mjs').catch(() => ({ dtcg: null }));
  if (dtcg) { writeFileSync(new URL('tokens.dtcg.json', dist), JSON.stringify(dtcg(P, T), null, 2) + '\n'); console.log('geschrieben: dist/tokens.dtcg.json'); }
}
```

- [ ] **Step 4: Grün**

Run: `cd design-system && node --test test/generate.test.mjs`
Expected: `fail 0`.

- [ ] **Step 5: dist erzeugen und ansehen**

Run: `cd design-system && node tools/generate.mjs && wc -l dist/*.css && grep -c "var(--tl-" dist/tokens.css`
Expected: drei Dateien, `tokens.css` mit über 150 `var(`.

- [ ] **Step 6: Commit**

```bash
git add design-system/tools/generate.mjs design-system/test/generate.test.mjs design-system/dist
git commit -m "Ticket #29108: Generator -- primitives.css, tokens.css, base.css aus zwei JSON-Quellen

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 6: DTCG-Export und byte-identisches dist

**Files:**
- Create: `design-system/tools/dtcg.mjs`
- Create: `design-system/test/dtcg.test.mjs`
- Create: `design-system/test/dist.test.mjs`

**Interfaces:**
- Consumes: `primitives`, `resolve` aus `tools/resolve.mjs`; `generate` aus `tools/generate.mjs`
- Produces: `dtcg(P, T)` → Objekt nach W3C Design Tokens Format (2025.10): Gruppen, `$type`, `$value`, Aliase als `{group.name}`; Modi über `$extensions["com.top-logic.mode"]`

- [ ] **Step 1: Tests schreiben (rot)**

`design-system/test/dtcg.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dtcg } from '../tools/dtcg.mjs';

const P = JSON.parse(readFileSync(new URL('../src/primitives.json', import.meta.url)));
const T = JSON.parse(readFileSync(new URL('../src/tokens.json', import.meta.url)));
const D = dtcg(P, T);

function tokens(o, path = []) {
  const out = [];
  for (const [k, v] of Object.entries(o)) {
    if (k.startsWith('$')) continue;
    if (v && typeof v === 'object' && '$value' in v) out.push([[...path, k].join('.'), v]);
    else if (v && typeof v === 'object') out.push(...tokens(v, [...path, k]));
  }
  return out;
}

test('jedes Token hat $value und $type', () => {
  for (const [path, t] of tokens(D)) {
    assert.ok('$value' in t, path);
    assert.ok(typeof t.$type === 'string', `${path} ohne $type`);
  }
});

test('Primitive tragen Werte, Rollen tragen Aliase in geschweiften Klammern', () => {
  for (const [path, t] of tokens(D.primitive)) assert.ok(!String(t.$value).startsWith('{'), path);
  for (const [path, t] of tokens(D.semantic.light.color))
    assert.match(String(t.$value), /^\{primitive\.color\.[a-z]+-\d+\}$/, path);
});

test('jeder Alias zeigt auf ein vorhandenes Token', () => {
  const all = new Set(tokens(D).map(([p]) => p));
  for (const [path, t] of tokens(D)) {
    const m = /^\{(.+)\}$/.exec(String(t.$value));
    if (m) assert.ok(all.has(m[1]), `${path} → ${m[1]} fehlt`);
  }
});

test('Farben sind $type color, Maße dimension, Schriften fontFamily, Dauern duration, Kurven cubicBezier', () => {
  for (const [p, t] of tokens(D.primitive.color)) assert.equal(t.$type, 'color', p);
  for (const [p, t] of tokens(D.primitive.measure)) assert.ok(['dimension', 'number'].includes(t.$type), p);
  for (const [p, t] of tokens(D.primitive.font)) assert.equal(t.$type, 'fontFamily', p);
  for (const [p, t] of tokens(D.primitive.motion)) assert.ok(['duration', 'cubicBezier'].includes(t.$type), p);
});

test('beide Modi sind vollständig und die Blattnamen sind die Tokennamen', () => {
  const light = tokens(D.semantic.light).map(([p]) => p.replace('semantic.light.', '')).sort();
  const dark = tokens(D.semantic.dark).map(([p]) => p.replace('semantic.dark.', '')).sort();
  assert.deepEqual(dark, light);
  assert.ok(light.some((p) => p.endsWith('.surface-brand')));
});
```

`design-system/test/dist.test.mjs`:

```js
// dist/ ist eingecheckt, damit TopLogic ohne Node-Build einbindet. Es darf nie veraltet sein.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { generate } from '../tools/generate.mjs';
import { dtcg } from '../tools/dtcg.mjs';

const P = JSON.parse(readFileSync(new URL('../src/primitives.json', import.meta.url)));
const T = JSON.parse(readFileSync(new URL('../src/tokens.json', import.meta.url)));

test('dist/ ist byte-identisch mit dem Erzeugnis aus src/', () => {
  for (const [name, text] of Object.entries(generate(P, T)))
    assert.equal(readFileSync(new URL(`../dist/${name}`, import.meta.url), 'utf8'), text,
      `dist/${name} ist veraltet — node tools/generate.mjs`);
  assert.equal(readFileSync(new URL('../dist/tokens.dtcg.json', import.meta.url), 'utf8'),
    JSON.stringify(dtcg(P, T), null, 2) + '\n', 'dist/tokens.dtcg.json ist veraltet');
});
```

- [ ] **Step 2: Rot**

Run: `cd design-system && node --test test/dtcg.test.mjs test/dist.test.mjs`
Expected: FAIL, `dtcg.mjs` fehlt.

- [ ] **Step 3: dtcg.mjs schreiben**

```js
// W3C Design Tokens (DTCG). Quelle für Figma und Kundenwerkzeuge. Aliase bleiben Aliase.
const REF = /^\{([a-z0-9-]+)\}$/;

function primType(group, name, value) {
  if (group === 'color') return 'color';
  if (group === 'font') return 'fontFamily';
  if (group === 'motion') return name.startsWith('dur-') ? 'duration' : 'cubicBezier';
  if (group === 'effect') return name.startsWith('shadow-') ? 'shadow' : 'color';
  return /^\d+$/.test(value) ? 'number' : 'dimension';
}

function primGroupOf(P, name) {
  for (const [g, o] of Object.entries(P)) if (typeof o === 'object' && name in o) return g;
  throw new Error(`Primitive ${name} in keiner Gruppe`);
}

function alias(P, v) {
  const m = REF.exec(String(v));
  return m ? { alias: `{primitive.${primGroupOf(P, m[1])}.${m[1]}}`, name: m[1] } : null;
}

function semantic(P, o, typeOf) {
  const out = {};
  for (const [n, v] of Object.entries(o)) {
    if (n.startsWith('_')) continue;
    const a = alias(P, v);
    out[n] = { $type: typeOf(n, a?.name), $value: a ? a.alias : v };
  }
  return out;
}

export function dtcg(P, T) {
  const primitive = {};
  for (const [g, o] of Object.entries(P)) {
    if (typeof o !== 'object') continue;
    primitive[g] = {};
    for (const [n, v] of Object.entries(o)) primitive[g][n] = { $type: primType(g, n, v), $value: v };
  }
  const colorType = () => 'color';
  const measureType = (n) => n.startsWith('font-family') ? 'fontFamily' : n.startsWith('duration') ? 'duration' : n.startsWith('easing') ? 'cubicBezier' : 'dimension';
  const effectType = (n) => n.startsWith('shadow') ? 'shadow' : 'color';
  const mode = (m) => ({
    $extensions: { 'com.top-logic.mode': m },
    color: semantic(P, T.color[m], colorType),
    effect: semantic(P, T.effect[m], effectType),
  });
  const measure = semantic(P, T.measure, measureType);
  const layer = semantic(P, T.layer, () => 'number');
  const density = {
    normal: semantic(P, T.density.normal, () => 'dimension'),
    compact: semantic(P, T.density.compact, () => 'dimension'),
  };
  return {
    $description: 'TopLogic Design System. Quelle: design-system/src. Erzeugt, nicht von Hand ändern.',
    primitive,
    semantic: { light: mode('light'), dark: mode('dark'), measure, layer, density },
  };
}
```

- [ ] **Step 4: Erzeugen und grün**

Run: `cd design-system && node tools/generate.mjs && node --test test/`
Expected: `dist/tokens.dtcg.json` geschrieben, alle Tests `fail 0`.

- [ ] **Step 5: Commit**

```bash
git add design-system/tools/dtcg.mjs design-system/test/dtcg.test.mjs design-system/test/dist.test.mjs design-system/dist
git commit -m "Ticket #29108: DTCG-Export und byte-identisches dist als Gate

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 7: Klassen-Gate (lint-css)

Prüft jede CSS-Datei des Pakets außer `primitives.css`. In Welle 0 trifft es `base.css` und `tokens.css`; ab Welle 1 jede `components/*.css`.

**Files:**
- Create: `design-system/tools/lib/css.mjs` (Deklarationen lesen; Kern aus `specimen/inventar.mjs` übernommen)
- Create: `design-system/tools/lint-css.mjs`
- Create: `design-system/test/lint-css.test.mjs`

**Interfaces:**
- Produces: `declarations(css)` → `[{selector, property, value, line}]` aus `tools/lib/css.mjs`; `lint(css, {known, file})` → `string[]` Verstöße aus `tools/lint-css.mjs`

- [ ] **Step 1: css.mjs aus inventar.mjs herauslösen**

Die Funktion `lesestellen` in `specimen/inventar.mjs` liest bereits Regeln samt `@media`, Kommentaren und Kurzformen. Übernimm ihren Parser als `declarations`:

```js
// Deklarationen aus CSS lesen: Selektor, Eigenschaft, Wert, Zeile. Kein vollständiger Parser —
// genug für Stylesheets, die wir selbst schreiben. Kommentare werden vorher entfernt.
export function declarations(css) {
  const out = [];
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(clean))) {
    const selector = m[1].trim().replace(/\s+/g, ' ');
    if (selector.startsWith('@') && !selector.startsWith('@media') && !selector.startsWith('@font-face')) continue;
    if (selector.startsWith('@media')) continue; // der Block darin wird durch die Regex nicht erfasst; siehe unten
    const line = clean.slice(0, m.index).split('\n').length;
    for (const d of m[2].split(';')) {
      const i = d.indexOf(':');
      if (i < 0) continue;
      out.push({ selector, property: d.slice(0, i).trim(), value: d.slice(i + 1).trim(), line });
    }
  }
  // Regeln in @media: den Medienblock aufklappen und innen erneut lesen.
  const media = /@media[^{]+\{([\s\S]*?)\n\}/g;
  while ((m = media.exec(clean))) for (const d of declarations(m[1])) out.push({ ...d, media: true });
  return out;
}
```

- [ ] **Step 2: Test schreiben (rot)**

`design-system/test/lint-css.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { lint, knownVariables } from '../tools/lint-css.mjs';

const dist = new URL('../dist/', import.meta.url);
const known = knownVariables(readFileSync(new URL('primitives.css', dist), 'utf8') + readFileSync(new URL('tokens.css', dist), 'utf8'));

test('ein Literal in einer Klasse ist ein Verstoß', () => {
  const v = lint('.tl-x { color: #fff; padding: 12px; transition: all 0.2s; }', { known, file: 'x.css' });
  assert.equal(v.length, 3, v.join('\n'));
});

test('erlaubte Literale: 0, 1, auto, none, 100%, currentColor, inherit', () => {
  assert.deepEqual(lint('.tl-x { margin: 0; flex: 1; width: auto; border: none; max-width: 100%; color: currentColor; font: inherit; }', { known, file: 'x.css' }), []);
});

test('eine unbekannte Variable ist ein Verstoß', () => {
  assert.equal(lint('.tl-x { color: var(--tl-nope); }', { known, file: 'x.css' }).length, 1);
});

test('Klassen ohne tl-Präfix oder gegen BEM sind Verstöße', () => {
  assert.equal(lint('.button { }', { known, file: 'x.css' }).length, 1);
  assert.equal(lint('.tlButton { }', { known, file: 'x.css' }).length, 1);
  assert.equal(lint('.tl-button__icon--big__x { }', { known, file: 'x.css' }).length, 1);
  assert.deepEqual(lint('.tl-button__icon--large { }', { known, file: 'x.css' }), []);
});

test(':focus ohne -visible und outline: none sind Verstöße', () => {
  assert.equal(lint('.tl-x:focus { outline: none; }', { known, file: 'x.css' }).length, 2);
});

test('font-size gehört in eine tl-type-Klasse', () => {
  assert.equal(lint('.tl-x { font-size: var(--tl-font-size-body); }', { known, file: 'x.css' }).length, 1);
  assert.deepEqual(lint('.tl-type-body { font-size: var(--tl-font-size-body); }', { known, file: 'base.css' }), []);
});

test('z-index, box-shadow und Dauern nur aus Tokens', () => {
  assert.equal(lint('.tl-x { z-index: 10; }', { known, file: 'x.css' }).length, 1);
  assert.equal(lint('.tl-x { box-shadow: 0 1px 2px var(--tl-surface-base); }', { known, file: 'x.css' }).length, 1);
  assert.deepEqual(lint('.tl-x { box-shadow: inset 0 0 0 var(--tl-border-width-md) var(--tl-border-control); }', { known, file: 'x.css' }), []);
  assert.deepEqual(lint('.tl-x { z-index: var(--tl-layer-popover); box-shadow: var(--tl-shadow-popover); transition: color var(--tl-duration-fast) var(--tl-easing-standard); }', { known, file: 'x.css' }), []);
});

test('die erzeugten Dateien des Pakets bestehen das Gate', () => {
  for (const f of readdirSync(dist).filter((f) => f.endsWith('.css') && f !== 'primitives.css')) {
    const v = lint(readFileSync(new URL(f, dist), 'utf8'), { known, file: f });
    assert.deepEqual(v, [], `${f}:\n${v.join('\n')}`);
  }
});
```

- [ ] **Step 3: Rot**

Run: `cd design-system && node --test test/lint-css.test.mjs`
Expected: FAIL.

- [ ] **Step 4: lint-css.mjs schreiben**

```js
// Das Klassen-Gate. Jede Regel aus docs/skalen.md, die ein Stylesheet brechen kann.
import { declarations } from './lib/css.mjs';

const ALLOWED = new Set(['0', '1', 'auto', 'none', '100%', 'currentColor', 'inherit', 'initial', 'transparent',
  'solid', 'hidden', 'visible', 'block', 'flex', 'grid', 'inline-flex', 'contents', 'relative', 'absolute',
  'fixed', 'sticky', 'center', 'start', 'end', 'stretch', 'baseline', 'nowrap', 'wrap', 'ellipsis', 'pointer',
  'default', 'not-allowed', 'border-box', 'both', 'row', 'column', 'space-between', 'left', 'right', 'inset',
  'uppercase', 'underline', 'middle', 'top', 'bottom', 'normal', 'clip', 'light', 'dark', 'reduce', 'antialiased',
  'tabular-nums', 'slashed-zero', '!important']);
const COLOR = /#[0-9a-fA-F]{3,8}\b|\b(rgba?|hsla?|oklch|color-mix)\(/;
const LENGTH = /(^|\s)-?\d*\.?\d+(px|rem|em|%|vh|vw|ch|pt)\b/;
const TIME = /\b\d*\.?\d+m?s\b/;
const BEM = /^tl-[a-z0-9]+(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$/;
const TYPE_FILES = /^(base|type)\.css$/;

export function knownVariables(css) {
  return new Set([...css.matchAll(/--tl-[a-z0-9-]+(?=:)/g)].map((m) => m[0]));
}

export function lint(css, { known, file }) {
  const out = [];
  const say = (d, msg) => out.push(`${file}:${d.line} ${d.selector} { ${d.property} } — ${msg}`);
  for (const d of declarations(css)) {
    if (d.property.startsWith('--')) continue; // Token-Deklarationen (tokens.css)
    const sel = d.selector;
    for (const cls of sel.matchAll(/\.([A-Za-z0-9_-]+)/g))
      if (!BEM.test(cls[1])) out.push(`${file}:${d.line} .${cls[1]} — kein tl-Präfix oder kein BEM (block__element--modifier)`);
    if (/:focus\b(?!-visible|-within)/.test(sel)) say(d, ':focus ohne -visible');
    if (d.property === 'outline' && /^none|^0$/.test(d.value)) say(d, 'outline: none — der Ring ist Pflicht');
    if (d.property === 'font-size' && !(TYPE_FILES.test(file) && /\.tl-(type|print)-/.test(sel)))
      say(d, 'font-size außerhalb einer tl-type-Klasse');
    if (d.property === 'font-weight' && !(TYPE_FILES.test(file) && /\.tl-(type|print)-/.test(sel)))
      say(d, 'font-weight außerhalb einer tl-type-Klasse');
    if (d.property === 'z-index' && !/^var\(--tl-layer-/.test(d.value)) say(d, 'z-index nur aus --tl-layer-*');
    if (d.property === 'box-shadow' && !/^var\(--tl-shadow-/.test(d.value) && !/^inset\b/.test(d.value))
      say(d, 'box-shadow nur --tl-shadow-* oder inset-Linie');
    for (const v of d.value.matchAll(/var\((--tl-[a-z0-9-]+)/g))
      if (!known.has(v[1])) say(d, `unbekannte Variable ${v[1]}`);
    const rest = d.value.replace(/var\([^)]*\)/g, '').replace(/calc\(|\)/g, ' ').replace(/,/g, ' ');
    if (COLOR.test(rest)) say(d, `Farbliteral: ${d.value}`);
    if (TIME.test(rest) && !/0\.01ms/.test(rest)) say(d, `Dauer-Literal: ${d.value}`);
    if (file !== 'base.css' || !/\.tl-print-|line-height|letter-spacing/.test(sel + d.property))
      if (LENGTH.test(rest)) say(d, `Maß-Literal: ${d.value}`);
    for (const word of rest.split(/\s+/).filter(Boolean))
      if (!ALLOWED.has(word) && !/^-?\d*\.?\d+$/.test(word) && !/^["']/.test(word) && /^[a-z-]+$/.test(word) && d.property !== 'font-feature-settings' && d.property !== 'font-family' && d.property !== 'color-scheme' && d.property !== 'transition-property' && d.property !== 'transition')
        ; // Schlüsselwörter sind erlaubt; die Liste oben ist nur Dokumentation der häufigsten
  }
  return out;
}

if (typeof process !== 'undefined' && import.meta.url === `file://${process.argv[1]}`) {
  const { readFileSync, readdirSync, existsSync } = await import('node:fs');
  const dist = new URL('../dist/', import.meta.url);
  const comps = new URL('../src/components/', import.meta.url);
  const known = knownVariables(readFileSync(new URL('primitives.css', dist), 'utf8') + readFileSync(new URL('tokens.css', dist), 'utf8'));
  const files = [...readdirSync(dist).filter((f) => f.endsWith('.css') && f !== 'primitives.css').map((f) => [f, new URL(f, dist)])];
  if (existsSync(comps)) for (const f of readdirSync(comps).filter((f) => f.endsWith('.css'))) files.push([f, new URL(f, comps)]);
  let n = 0;
  for (const [f, url] of files) for (const v of lint(readFileSync(url, 'utf8'), { known, file: f })) { console.log(v); n++; }
  console.log(n ? `${n} Verstöße` : 'Klassen-Gate grün');
  process.exit(n ? 1 : 0);
}
```

Hinweis für den Ausführenden: `base.css` setzt `line-height` und `letter-spacing` als Literale in den Typo-Klassen sowie `pt` in den Druckklassen. Das ist die einzige zugelassene Ausnahme, weil beide Werte Teil der Klasse sind, nicht eines Tokens. Die Bedingung `file !== 'base.css' || …` bildet genau das ab. Passt die erste Fassung nicht auf `base.css`, ist die **Ausnahme enger** zu fassen, nicht das Gate zu lockern.

- [ ] **Step 5: Grün**

Run: `cd design-system && node --test test/lint-css.test.mjs && node tools/lint-css.mjs`
Expected: `fail 0`, dann `Klassen-Gate grün`.

- [ ] **Step 6: Commit**

```bash
git add design-system/tools/lib/css.mjs design-system/tools/lint-css.mjs design-system/test/lint-css.test.mjs
git commit -m "Ticket #29108: Klassen-Gate -- kein Literal, kein :focus, kein outline: none, nur Tokens

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 8: Ratsche über dem Altbestand

**Files:**
- Create: `design-system/tools/inventory.mjs` (aus `specimen/inventar.mjs`, Imports auf `./lib/css.mjs`)
- Create: `design-system/test/ratchet.json`
- Create: `design-system/test/ratchet.test.mjs`

**Interfaces:**
- Consumes: `declarations` aus `tools/lib/css.mjs`
- Produces: `measure(css)` → `{ lines, literals: { color, fontSize, duration, zIndex } , tokens }` aus `tools/inventory.mjs`

- [ ] **Step 1: inventory.mjs**

Kopiere `specimen/inventar.mjs` nach `design-system/tools/inventory.mjs`, ersetze den Import von `./contrast.mjs` (falls vorhanden) durch `./lib/contrast.mjs` und ergänze am Ende:

```js
/** Was die Ratsche zählt. Nur sinkend erlaubt. */
export function measure(css) {
  const lines = css.split('\n').length;
  const decls = declarations(css);
  const lit = (prop, re) => decls.filter((d) => d.property === prop && re.test(d.value.replace(/var\([^)]*\)/g, ''))).length;
  return {
    lines,
    literals: {
      color: (css.replace(/\/\*[\s\S]*?\*\//g, '').match(/#[0-9a-fA-F]{3,8}\b|\brgba?\(/g) ?? []).length,
      fontSize: lit('font-size', /\d/),
      duration: decls.filter((d) => /^(transition|animation)/.test(d.property) && /\d+m?s/.test(d.value)).length,
      zIndex: lit('z-index', /\d/),
      outlineNone: decls.filter((d) => d.property === 'outline' && /none/.test(d.value)).length,
    },
  };
}
```

und oben `import { declarations } from './lib/css.mjs';`.

- [ ] **Step 2: Budget aufnehmen**

Run:
```bash
cd design-system && node -e "
import('./tools/inventory.mjs').then(async ({ measure }) => {
  const { readFileSync, writeFileSync } = await import('node:fs');
  const { join } = await import('node:path'); const { homedir } = await import('node:os');
  const dir = join(process.env.TL_WORKTREE ?? join(homedir(), 'git/tl8-wt-29584'), 'com.top_logic.layout.react/src/main/webapp/style');
  const css = readFileSync(join(dir, 'tlReactControls.css'), 'utf8');
  writeFileSync('test/ratchet.json', JSON.stringify({ _: 'Budget des alten tlReactControls.css. Darf nur sinken. Nach jeder Welle nachziehen.', ...measure(css) }, null, 2) + '\n');
  console.log(readFileSync('test/ratchet.json', 'utf8'));
})"
```
Expected: `lines` um 6011, `color` um 77, `outlineNone` 22.

- [ ] **Step 3: Test schreiben**

`design-system/test/ratchet.test.mjs`:

```js
// Bis das alte Stylesheet leer ist, darf es nur schrumpfen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { measure } from '../tools/inventory.mjs';

const OLD = join(process.env.TL_WORKTREE ?? join(homedir(), 'git/tl8-wt-29584'),
  'com.top_logic.layout.react/src/main/webapp/style/tlReactControls.css');
const budget = JSON.parse(readFileSync(new URL('./ratchet.json', import.meta.url)));

test('der Altbestand liegt im Budget', { skip: !existsSync(OLD) && 'Worktree fehlt' }, () => {
  const ist = measure(readFileSync(OLD, 'utf8'));
  assert.ok(ist.lines <= budget.lines, `Zeilen: ${ist.lines} > ${budget.lines}`);
  for (const [k, v] of Object.entries(budget.literals))
    assert.ok(ist.literals[k] <= v, `${k}: ${ist.literals[k]} > ${v}`);
});

test('das Budget ist nachgezogen, wenn der Bestand darunter liegt', { skip: !existsSync(OLD) && 'Worktree fehlt' }, () => {
  const ist = measure(readFileSync(OLD, 'utf8'));
  assert.ok(ist.lines >= budget.lines - 50, `Budget nachziehen: lines ${ist.lines}, Budget ${budget.lines}`);
});
```

- [ ] **Step 4: Grün**

Run: `cd design-system && node --test test/`
Expected: `fail 0`.

- [ ] **Step 5: Commit**

```bash
git add design-system/tools/inventory.mjs design-system/test/ratchet.json design-system/test/ratchet.test.mjs
git commit -m "Ticket #29108: Ratsche -- das alte Stylesheet darf nur schrumpfen

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 9: Specimen der Grundklassen

**Files:**
- Create: `design-system/specimen/index.html`
- Create: `design-system/tools/serve.mjs`

**Interfaces:**
- Consumes: `dist/primitives.css`, `dist/tokens.css`, `dist/base.css`; Inter-Schrift aus dem Worktree `ext.com.inter.fonts/src/main/webapp`

- [ ] **Step 1: serve.mjs**

```js
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { homedir } from 'node:os';

const PORT = 8137;
const ROOT = new URL('..', import.meta.url).pathname;
const FONTS = join(process.env.TL_WORKTREE ?? join(homedir(), 'git/tl8-wt-29584'), 'ext.com.inter.fonts/src/main/webapp');
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.mjs': 'text/javascript',
  '.json': 'application/json', '.ttf': 'font/ttf', '.woff': 'font/woff', '.woff2': 'font/woff2' };

createServer(async (req, res) => {
  const p = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
  const file = p.startsWith('/fonts/') ? join(FONTS, p.slice(7)) : join(ROOT, p === '/' ? 'specimen/index.html' : p);
  try { res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' }); res.end(await readFile(file)); }
  catch { res.writeHead(404).end(`Nicht gefunden: ${p}`); }
}).listen(PORT, () => console.log(`Specimen: http://localhost:${PORT}/`));
```

- [ ] **Step 2: index.html**

Die Seite zeigt beide Modi und beide Dichten nebeneinander, mit Umschaltern, die `data-tl-mode` und `data-tl-density` am `html` setzen. Sie darf eigenes Layout-CSS tragen (sie ist kein Teil des Pakets), aber jede Farbe darin liest ein Token.

```html
<!doctype html>
<html lang="de" data-tl-mode="light" data-tl-density="normal">
<head>
<meta charset="utf-8">
<title>TopLogic Design System — Grundklassen</title>
<link rel="stylesheet" href="/fonts/interFonts.css">
<link rel="stylesheet" href="/dist/primitives.css">
<link rel="stylesheet" href="/dist/tokens.css">
<link rel="stylesheet" href="/dist/base.css">
<style>
  .specimen { display: grid; gap: var(--tl-space-lg); padding: var(--tl-space-xl); max-width: 64rem; margin: 0 auto; }
  .specimen__bar { display: flex; gap: var(--tl-space-sm); align-items: center; }
  .specimen__panel { background: var(--tl-surface-layer); border: var(--tl-border-width-sm) solid var(--tl-border-separator);
    border-radius: var(--tl-radius-md); padding: var(--tl-space-md); }
  .specimen__row { display: flex; gap: var(--tl-space-sm); flex-wrap: wrap; align-items: center; }
  .specimen__swatch { width: var(--tl-size-control); height: var(--tl-size-control); border-radius: var(--tl-radius-sm);
    border: var(--tl-border-width-sm) solid var(--tl-border-separator); }
  .specimen__field { height: var(--tl-size-control); padding: 0 var(--tl-space-control-x); border-radius: var(--tl-radius-sm);
    border: var(--tl-border-width-sm) solid var(--tl-border-control); background: var(--tl-surface-field); color: var(--tl-text-primary); }
  .specimen__field::placeholder { color: var(--tl-text-placeholder); }
  .specimen__button { height: var(--tl-size-control); padding: 0 var(--tl-space-control-x); border-radius: var(--tl-radius-sm);
    border: none; background: var(--tl-surface-brand); color: var(--tl-text-on-brand); cursor: pointer; }
  .specimen__button:hover { background: var(--tl-surface-brand-hover); color: var(--tl-text-on-brand-hover); }
  .specimen__status { padding: var(--tl-space-xs) var(--tl-space-sm); border-radius: var(--tl-radius-sm); border-left: var(--tl-border-width-accent) solid; }
  table { border-collapse: collapse; }
  td, th { height: var(--tl-size-row); padding: 0 var(--tl-space-control-x); border-bottom: var(--tl-border-width-sm) solid var(--tl-border-separator); text-align: left; }
  td:last-child { text-align: right; }
</style>
</head>
<body>
<main class="specimen">
  <div class="specimen__bar">
    <span class="tl-type-heading-lg">Grundklassen</span>
    <label class="tl-type-label"><input type="checkbox" id="mode"> dunkel</label>
    <label class="tl-type-label"><input type="checkbox" id="density"> kompakt</label>
  </div>

  <section class="specimen__panel">
    <p class="tl-type-display">Display 32</p>
    <p class="tl-type-heading-lg">Heading lg 24 — Seitentitel</p>
    <p class="tl-type-heading-md">Heading md 20 — Dialogtitel</p>
    <p class="tl-type-heading-sm">Heading sm 16 — Abschnittstitel</p>
    <p class="tl-type-body">Body 14 — alles Gelesene. Der Rahmen um ein Feld schuldet 3,0; die Zeile darunter trennt nur.</p>
    <p class="tl-type-body-strong">Body strong 14 — Hervorhebung</p>
    <p class="tl-type-label">Label 12 — Feldbeschriftung, Hilfstext</p>
    <p class="tl-type-label-strong">Label strong 12 — Spaltenkopf</p>
    <p class="tl-type-code">code 14 — {"tl": "script"} 0O 1lI</p>
  </section>

  <section class="specimen__panel">
    <div class="specimen__row">
      <input class="specimen__field tl-type-body" placeholder="Platzhalter">
      <button class="specimen__button tl-type-body-strong">Speichern</button>
      <a href="#" class="tl-type-body" style="color: var(--tl-text-link)">Link</a>
    </div>
    <p class="tl-type-label" style="color: var(--tl-text-helper)">Tab drücken: der Fokusring liegt außen, 2 px, Offset 2 px.</p>
  </section>

  <section class="specimen__panel">
    <table class="tl-type-body">
      <thead><tr><th class="tl-type-label-strong">Position</th><th class="tl-type-label-strong">Betrag</th></tr></thead>
      <tbody>
        <tr><td>Wartung</td><td class="tl-nums">1.234,00</td></tr>
        <tr><td>Lizenz</td><td class="tl-nums">11.111,11</td></tr>
        <tr><td>Support</td><td class="tl-nums">808,80</td></tr>
      </tbody>
    </table>
  </section>

  <section class="specimen__panel specimen__row">
    <div class="specimen__status tl-type-body" style="background: var(--tl-status-error-subtle); border-color: var(--tl-status-error-border); color: var(--tl-status-error-text)">Fehler</div>
    <div class="specimen__status tl-type-body" style="background: var(--tl-status-warning-subtle); border-color: var(--tl-status-warning-border); color: var(--tl-status-warning-text)">Warnung</div>
    <div class="specimen__status tl-type-body" style="background: var(--tl-status-success-subtle); border-color: var(--tl-status-success-border); color: var(--tl-status-success-text)">Erfolg</div>
    <div class="specimen__status tl-type-body" style="background: var(--tl-status-info-subtle); border-color: var(--tl-status-info-border); color: var(--tl-status-info-text)">Info</div>
    <div class="specimen__status tl-type-body" style="background: var(--tl-surface-brand-subtle); border-color: var(--tl-border-interactive); color: var(--tl-text-link)">Marke getönt</div>
  </section>

  <section class="specimen__panel specimen__row" id="swatches"></section>
</main>
<script type="module">
  const html = document.documentElement;
  mode.onchange = () => html.dataset.tlMode = mode.checked ? 'dark' : 'light';
  density.onchange = () => html.dataset.tlDensity = density.checked ? 'compact' : 'normal';
  const css = await (await fetch('/dist/tokens.css')).text();
  const names = [...new Set([...css.matchAll(/--tl-(surface-[a-z-]+|status-[a-z]+-surface|status-[a-z]+-subtle)(?=:)/g)].map((m) => m[1]))];
  swatches.innerHTML = names.map((n) => `<div title="${n}" class="specimen__swatch" style="background: var(--tl-${n})"></div>`).join('');
</script>
</body>
</html>
```

- [ ] **Step 3: Prüfen**

Run: `cd design-system && (node tools/serve.mjs &) && sleep 1 && curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8137/ && curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8137/dist/tokens.css; kill %1`
Expected: `200`, `200`. Danach im Browser öffnen und beide Umschalter probieren; der Fokusring muss bei Tab sichtbar sein, bei Klick nicht.

- [ ] **Step 4: Commit**

```bash
git add design-system/specimen design-system/tools/serve.mjs
git commit -m "Ticket #29108: Specimen der Grundklassen -- beide Modi, beide Dichten

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 10: Übrige Tests übernehmen und Farbkern-Tests prüfen

Die Tests aus `specimen/` zu `brand.mjs`, `generieren.mjs`, `tokens.json`, `requirements.mjs` sind entweder übernommen (Task 2) oder mit dem Altbestand gegenstandslos. Dieser Task stellt sicher, dass nichts Prüfenswertes verloren geht.

**Files:**
- Create: `design-system/test/color.test.mjs` (aus dem Farbteil von `specimen/skala.test.mjs` und ggf. `brand`-Tests)

- [ ] **Step 1: Prüfen, welche Tests in `specimen/` einen Rechenkern prüfen**

Run: `cd specimen && grep -l "brand.mjs\|primitive.mjs\|contrast.mjs" *.test.mjs`
Expected: `contrast.test.mjs`, `primitive.test.mjs`, ggf. weitere.

- [ ] **Step 2: Fehlende Kern-Tests übernehmen**

Für jede weitere Datei aus Step 1, die noch nicht unter `design-system/test/` liegt: kopieren, Importpfade auf `../tools/lib/*.mjs` ändern, laufen lassen. Tests, die `skala.json`, `tokens.json`, `abbildung.json` oder `stellen.json` lesen, werden **nicht** übernommen; ihre Regeln stecken in `layers.test.mjs` und `tokens.test.mjs`.

Ergänze `design-system/test/color.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hexZuOklch, oklchZuHex, beschriftungAbleiten, farbtonAbstand } from '../tools/lib/color.mjs';

test('Hex → OKLCH → Hex ist verlustfrei bis auf Rundung', () => {
  for (const hex of ['#0B5ED7', '#FAFAFA', '#16181B', '#D7352D'])
    assert.equal(oklchZuHex(hexZuOklch(hex)).toUpperCase(), hex);
});

test('die Beschriftung nimmt den Kandidaten mit dem höheren Kontrast', () => {
  const k = { dunklerKandidat: '#1B1D21', hellerKandidat: '#FFFFFF' };
  assert.equal(beschriftungAbleiten('#0B5ED7', k).hex.toUpperCase(), '#FFFFFF');
  assert.equal(beschriftungAbleiten('#5394FF', k).hex.toUpperCase(), '#1B1D21');
});

test('der Farbtonabstand ist symmetrisch und misst über den kurzen Bogen', () => {
  const a = farbtonAbstand('#DFEBFF', '#CEF3FB'), b = farbtonAbstand('#CEF3FB', '#DFEBFF');
  assert.ok(Math.abs(a - b) < 1e-9);
  assert.ok(a > 30 && a <= 180);
});
```

- [ ] **Step 3: Alles grün**

Run: `cd design-system && node --test test/`
Expected: `fail 0`. Die Zahl der Tests steht in der Ausgabe; sie kommt in STATUS.md.

- [ ] **Step 4: Commit**

```bash
git add design-system/test
git commit -m "Ticket #29108: Rechenkern-Tests uebernommen

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 11: TopLogic-Anbindung im Worktree

Läuft im Worktree `~/git/tl8-wt-29584` auf einem Branch zu Ticket #29108. Das Paket wird als Modul eingebunden; die alte XML-Tokenkonfiguration bleibt, bis die letzte Welle sie leert. Beide Token-Sätze koexistieren, weil sie verschiedene Präfixe haben.

**Files:**
- Create: `com.top_logic.layout.react/src/main/webapp/style/tl-design-system/` mit Kopien von `dist/primitives.css`, `dist/tokens.css`, `dist/base.css` (bis ein Maven-Modul für das Paket existiert; siehe Step 1)
- Modify: `com.top_logic.layout.react/src/main/webapp/WEB-INF/conf/tl-layout-react.conf.config.xml` (ClientResources, Zeilen 33–70)
- Modify: `com.top_logic.layout.react/src/main/java/com/top_logic/layout/react/theme/UIThemeService.java` (Konstanten Z. 55 und 63, Skript Z. 285–318, Server Z. 234–252)
- Modify: `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/ViewServlet.java:682-684`
- Test: `com.top_logic.layout.react/src/test/java/test/com/top_logic/layout/react/theme/TestUIThemeService.java`

**Interfaces:**
- Produces: `<html data-tl-mode="light|dark" data-tl-density="normal|compact">`; die drei CSS-Dateien werden vor `tlReactBase.css` geladen

- [ ] **Step 1: CSS-Dateien ins Modul kopieren**

```bash
W=~/git/tl8-wt-29584; cd $W && git checkout -b ticket-29108-design-system-welle-0
mkdir -p com.top_logic.layout.react/src/main/webapp/style/tl-design-system
cp ~/Claude/TopLogic-v8-DesignSystem/design-system/dist/{primitives,tokens,base}.css com.top_logic.layout.react/src/main/webapp/style/tl-design-system/
```

Die Kopie ist Übergang: Sobald das Paket einen Maven-Wrapper hat (wie `ext.com.inter.fonts`), ersetzt der Wrapper die Kopie. Ein Skript `design-system/tools/publish-to-worktree.mjs` kopiert bis dahin nach jedem `generate`:

```js
import { copyFileSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
const dest = join(process.env.TL_WORKTREE ?? join(homedir(), 'git/tl8-wt-29584'),
  'com.top_logic.layout.react/src/main/webapp/style/tl-design-system');
for (const f of ['primitives.css', 'tokens.css', 'base.css'])
  copyFileSync(new URL(`../dist/${f}`, import.meta.url), join(dest, f)), console.log(`kopiert: ${f}`);
```

- [ ] **Step 2: ClientResources registrieren**

In `tl-layout-react.conf.config.xml` vor dem Eintrag für `tlReactBase.css` drei Einträge in derselben Form wie die vorhandenen, Pfade `/style/tl-design-system/primitives.css`, `/style/tl-design-system/tokens.css`, `/style/tl-design-system/base.css`. Die genaue Elementform aus den Nachbarzeilen 33–70 übernehmen.

- [ ] **Step 3: Test für die neuen Attribute schreiben (rot)**

In `TestUIThemeService.java` einen Test ergänzen, der das erzeugte Skript prüft:

```java
public void testThemeScriptSetsDesignSystemMode() {
    String script = scriptOf(UIThemeService.getInstance());
    assertTrue(script, script.contains("data-tl-mode"));
    assertTrue(script, script.contains("'dark'") || script.contains("\"dark\""));
    assertTrue(script, script.contains("data-tl-density"));
}
```

`scriptOf` ist die Hilfsmethode, die der Test für das `prefers-color-scheme`-Skript bereits nutzt; falls sie anders heißt, denselben Weg nehmen wie der vorhandene Test in derselben Datei.

Run: Test in Eclipse ausführen (Import nur über *General*, siehe Memory) oder `mvn -pl com.top_logic.layout.react test -Dtest=TestUIThemeService`.
Expected: FAIL.

- [ ] **Step 4: UIThemeService anpassen**

- Konstanten ergänzen: `public static final String MODE_ATTRIBUTE = "data-tl-mode";`, `public static final String DENSITY_ATTRIBUTE = "data-tl-density";`.
- In `writeThemeScript` (Z. 285–318): überall, wo `data-theme` gesetzt wird, zusätzlich `data-tl-mode` auf `"dark"` setzen, wenn das gewählte Theme `color-scheme="dark"` trägt, sonst `"light"`; `data-tl-density="normal"` einmal beim Start setzen, falls nicht vorhanden.
- In `ViewServlet.java:682-684`: neben `data-theme` auch `data-tl-mode` schreiben, aus `UITheme.getColorScheme()` abgeleitet.
- In `writeThemeStyles` nichts ändern; die alten Tokens bleiben.

- [ ] **Step 5: Grün, Demo-App starten**

Run: Test grün; Demo-App starten, im Browser `document.documentElement.dataset` ansehen.
Expected: `tlMode: "light"`, `tlDensity: "normal"`; nach Umschalten auf Dark `tlMode: "dark"`; im Netzwerk-Tab die drei neuen CSS-Dateien mit 200.

- [ ] **Step 6: Commit im Worktree und PR**

```bash
cd ~/git/tl8-wt-29584 && git add -A && git commit -m "Ticket #29108: Design System Welle 0 -- Tokens und Grundklassen eingebunden, data-tl-mode und data-tl-density am html

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

PR über Gitea auf `master` (Ticket #29108 muss angenommen sein, sonst lehnt der Push-Hook ab).

---

### Task 12: Altwerkzeuge löschen

**Files:**
- Delete: `specimen/` vollständig (alle Dateien und `markup/`)
- Modify: `.gitignore` falls Einträge auf `specimen/` zeigen

- [ ] **Step 1: Sicherstellen, dass nichts mehr auf specimen zeigt**

Run: `cd ~/Claude/TopLogic-v8-DesignSystem && grep -rn "specimen/" --include="*.md" --include="*.mjs" --include="*.json" . | grep -v "^./docs/superpowers/\|^./specimen/\|^./docs/migration/" | head`
Expected: nur Treffer in `STATUS.md`, `CLAUDE.md`, `README.md`, `docs/skalen.md`, `docs/praesentation.md` — die werden in Task 13 umgeschrieben.

- [ ] **Step 2: Löschen**

```bash
git rm -r -q specimen && ls
```
Expected: kein `specimen/` mehr; `design-system/` und `docs/` vorhanden.

- [ ] **Step 3: Paket-Tests grün**

Run: `cd design-system && node --test test/ && node tools/lint-css.mjs`
Expected: `fail 0`, `Klassen-Gate grün`.

- [ ] **Step 4: Commit**

```bash
git commit -m "Ticket #29108: Altwerkzeuge geloescht -- Abbildung, Stellen, Vergleichsansicht sind exportiert und abgeschnitten

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 13: Docs umschreiben

**Files:**
- Modify: `docs/skalen.md`
- Modify: `docs/praesentation.md`
- Modify: `STATUS.md`
- Modify: `CLAUDE.md`
- Modify: `README.md` (Repo-Wurzel; falls nicht vorhanden, anlegen)

- [ ] **Step 1: skalen.md**

1. Kopf: `**Stand:** 2026-09-17 · Skalen entschieden, Welle 0 umgesetzt` und Spec-Link auf die neue Spec.
2. Die verwaiste Tabelle ab „---|---|---|“ (nach dem Abschnitt „Offen“ mit den `disabled`-Rollen) entfernen; ihr Inhalt (kein `text-on-color`-Wert besteht beide Flächen) steht bereits unter „Beschriftung auf der Marke“.
3. Abschnitt „## Offen“ am Ende (Marke ↔ Info 1,06) entfernen; der Fall ist unter „Gelöst: Info verlässt den Markenton“ erledigt.
4. Abstandstabelle: `space-lg = size-6`, `space-xl = size-7`, `space-2xl = size-8` (nach dem Einschub von `size-5` für `icon-md`). Dichtetabelle: `space-12` → `space-sm`, `space-8` → `space-xs`, `space-4` → `space-2xs`, `space-16` → `space-md`.
5. Alle Tokennamen auf die neuen: `background` → `surface-base`, `layer-01` → `surface-layer`, `layer-02` → `surface-layer-nested`, `layer-overlay` → `surface-overlay`, `field` → `surface-field`, `layer-hover/selected/active` → `surface-interactive-*`, `brand-primary*` → `surface-brand*`, `brand-link*` → `text-link*`, `brand-subtle*` → `surface-brand-subtle*`, `support-*` → `status-*`, `focus` → `focus-ring`, `icon-size-*` → `size-icon-*`, `accent-bar` → `border-width-accent`, `control-height*` → `size-control*`, `row-height` → `size-row`, `padding-x/y` → `space-control-x/y`, `gap` → `space-control-gap`, Klassen `type-*` → `tl-type-*`, `tabellenzahl` → `tl-nums`, `data-modus` → `data-tl-mode`, `data-dichte` → `data-tl-density`. Mit `sed` je Paar, danach `grep` auf die alten Namen.
6. Abschnitt „Die Abbildung“ und „Die Stellen entscheiden“ und „Die Vergleichsansicht“ kürzen auf je einen Absatz: was gefunden wurde (Aufteilung, `inset`-Linie, „wird bedient“), und dass die Werkzeuge nach `docs/migration/altlast.md` exportiert und abgeschnitten sind.
7. Neuer Abschnitt „### Disabled: vier Rollen ohne Gate“: `text-disabled` gray-29/gray-49, `icon-disabled` dito, `surface-disabled` gray-7/gray-69, `border-disabled` gray-18/gray-66; von WCAG ausgenommen, deshalb kein Kontrastpaar; Werte so gewählt, dass sie im hellen Modus unter `text-placeholder` und im dunklen über `surface-interactive-selected` liegen.
8. Neuer Abschnitt „### Scrim und Ebenen“: `surface-scrim` rgba mit 0,48 hell, 0,64 dunkel, weil ein Dialog im Dunkeln mehr Abdunklung braucht, um sich von der Fläche zu lösen; sechs Ebenen `layer-base/raised/sticky/overlay/popover/toast` mit 0/10/100/1000/1100/1200, Sprünge lassen Kundenkomponenten Platz.
9. Neuer Abschnitt „### Der Schnitt vom 17.09.“ mit dem Absatz aus der Spec „Warum diese Spec die alte ablöst“.

- [ ] **Step 2: praesentation.md**

Folie 29 „Wie es weitergeht“ ersetzen durch zwei Folien:

Folie 29 „Der Schnitt“: Der Rückweg ins alte Stylesheet deckte nur die Farbschicht, die erzeugten Beschriftungen fehlten als CSS, die Attribute passten nicht zur Anwendung. Entschieden: Altlasten abschneiden, eigenes Paket, BEM-Namen mit `tl-`, Komponente für Komponente. Tabelle: alt `layer-01` / `support-error` / `button-primary` → neu `surface-layer` / `status-error-*` / `surface-brand`.

Folie 30 „Welle 0 steht“: Paket `@toplogic/design-system`, `primitives.css` / `tokens.css` / `base.css` / `tokens.dtcg.json`, Zahl der Tests aus Task 10, Klassen-Gate, Ratsche. Liste der Wellen 1 bis 5 mit den Komponenten. Sprechnotiz: Jede Komponente ist fertig, wenn ihr alter Block leer ist.

Kopf: `**Stand:** 2026-09-17`.

- [ ] **Step 3: STATUS.md neu schreiben**

Vollständig ersetzen:

```markdown
# Stand

**Letzte Sitzung:** 2026-09-17 · **Basis:** `tl-engine-7@master` (TopLogic 8.0.0-SNAPSHOT) · **Spec:** `docs/superpowers/specs/2026-09-17-design-system-neuaufbau-design.md`

## Wo anknüpfen

**Welle 0 ist umgesetzt.** Das Paket `design-system/` liefert `dist/primitives.css`, `dist/tokens.css`,
`dist/base.css` und `dist/tokens.dtcg.json`. `node --test test/` ist das Gate — N Tests, alle grün
(N aus der Ausgabe eintragen). `node tools/lint-css.mjs` ist das Klassen-Gate, `test/ratchet.json` das
Budget des alten Stylesheets.

Die Demo-App lädt die drei Dateien und setzt `data-tl-mode` und `data-tl-density` (PR im Worktree,
Branch `ticket-29108-design-system-welle-0`).

**Nächster Schritt: Welle 1.** Button, ToggleButton, Pill, Avatar, Progress, FontIcon — je Komponente:
CSS nach `src/components/`, Klassen im TSX umbenennen, Zustände auf Attribute, `className`
durchreichen, Specimen, Vertrag, Gate grün, alter Block gelöscht. Der Button ist die Vorlage.
Arbeitsliste: `docs/migration/altlast.md`.

Offen aus der Spec, nicht Teil von Welle 0: `tl-ds derive` (Kundenstufe A), Token-Mapper
(Miniprojekt), Figma-Push, Maven-Wrapper für das Paket (bis dahin kopiert
`tools/publish-to-worktree.mjs`).

## Entschieden

Alle Skalen in `docs/skalen.md`, jede mit Begründung. Der Schnitt vom 17.09. steht dort als eigener
Abschnitt. Die Entscheidungstabelle aus der Vorfassung gilt weiter; die Namen sind die neuen.

## Werkzeuge

Siehe `CLAUDE.md`.

## Planung

Arbeitspakete als Gitea-Issues: https://git.top-logic.com/hpe/tl-design-system/issues
Präsentation: `docs/praesentation.md`, 30 Folien. Wird bei jeder Entscheidung mitgezogen.
Plan Welle 0: `docs/superpowers/plans/2026-09-17-welle-0-paket.md`
```

Die Entscheidungstabelle („Entschieden, alles begründet“) aus der alten STATUS.md mit den neuen Namen übernehmen und unter „## Entschieden“ einfügen.

- [ ] **Step 4: CLAUDE.md**

Tabelle „Werkzeuge“ ersetzen:

| Aufruf (in `design-system/`) | Was es tut |
|---|---|
| `node --test test/` | alle Gates |
| `node tools/generate.mjs` | `dist/` aus `src/` erzeugen; nach jeder Änderung an `src/` |
| `node tools/lint-css.mjs` | Klassen-Gate über `dist/*.css` und `src/components/*.css` |
| `node tools/inventory.mjs` | das alte Stylesheet auszählen (Ratsche) |
| `node tools/publish-to-worktree.mjs` | `dist/` in den Worktree kopieren |
| `node tools/serve.mjs` | Specimen auf `http://localhost:8137/` |

Abschnitt „Die beiden Schichten“: `src/primitives.json` trägt Werte, `src/tokens.json` nur Referenzen; Beschriftungen unter `derived`. Abschnitt „Arbeitsweise“ bleibt; Satz ergänzen: „Jeder öffentliche Name ist Englisch mit Präfix `tl`. Keine Zeitangaben in Docs.“ Hinweis auf `docs/migration/altlast.md` als Arbeitsliste.

- [ ] **Step 5: Alte Namen suchen**

Run: `grep -rn "data-modus\|tabellenzahl\|support-error\b\|brand-primary\b\|layer-01\|specimen/" docs/skalen.md docs/praesentation.md STATUS.md CLAUDE.md README.md | grep -v "altlast\|Schnitt\|alt " | head`
Expected: keine Treffer außerhalb der Abschnitte, die den Schnitt beschreiben.

- [ ] **Step 6: Commit**

```bash
git add docs STATUS.md CLAUDE.md README.md
git commit -m "Ticket #29108: Docs auf die neuen Namen -- skalen.md bereinigt, Praesentation um den Schnitt und Welle 0 ergaenzt

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

## Self-Review

**Spec-Abdeckung Welle 0:** Paketstruktur (Task 2, 5, 6), Namensschema (Task 3, Gate in `layers.test.mjs` und `lint-css.mjs`), Wurzelattribute (Task 5, 11), erzeugte Beschriftungen (Task 3 `derived`, Task 5), `dist/` eingecheckt und byte-identisch (Task 6), DTCG (Task 6), Gates Schichten/Klassen/Kontrast/Maße/Ratsche/Erzeugtes (Task 3, 4, 7, 8, 6), Anbindung an TopLogic (Task 11), Migrationsliste (Task 1), Löschen (Task 12), Docs (Task 13). Nicht in Welle 0, in STATUS.md als offen benannt: `derive`, Token-Mapper, Figma-Push, TSX-Lint, Komponenten-Gates, Maven-Wrapper.

**Typkonsistenz:** `resolve(P, T)` liefert `{color, derived, effect, measure, density, layer}`; `generate(P, T)` liefert Dateinamen → String; `dtcg(P, T)` liefert Objekt; `lint(css, {known, file})` liefert `string[]`; `knownVariables(css)` liefert `Set`; `measure(css)` liefert `{lines, literals}`; `declarations(css)` liefert `[{selector, property, value, line}]`. Tokennamen sind in Task 1 (`NEU`), Task 3 (`tokens.json`), Task 5 (Generator) und Task 13 (Docs) identisch.
