# Welle 1 — Button als Vorlage

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Der Button ist die erste fertige Komponente des Pakets: `src/components/button/` mit CSS, Specimen und Vertrag; `dist/components.css` wird erzeugt und von der Demo-App geladen; `TLButton`, `TLToggleButton` und `TLUploadButton` tragen die neuen Klassen und Zustände als Attribute; der alte Button-Block in `tlReactControls.css` ist leer, die fünf Kontextblöcke sind weg.

**Architecture:** Die Komponente lebt im Paket als Ordner `src/components/button/` (CSS, Specimen, Vertrag). `tools/generate.mjs` hängt alle Komponenten-CSS zu `dist/components.css` zusammen; das Klassen-Gate prüft die Quelle, ein Kontrasttest prüft jede Erscheinung × Tönung × Modus gegen die Tokens. Im Worktree wählt der **Container** die Erscheinung über einen React-Kontext `ButtonDefaults` (Toolbar → `ghost`, Dialogfuß → `secondary`), der Server-Zustand `appearance` gewinnt über den Kontext. Zustände sind Attribute: `disabled`, `aria-pressed`, `aria-busy`.

**Tech Stack:** Paket: Node 22, `node:test`, keine Abhängigkeit. Worktree: React 19 + TypeScript (Vite), Java 17 + Maven; React-Bundle entsteht mit `mvn compile` im Modul `com.top_logic.layout.react`.

**Spec:** `docs/superpowers/specs/2026-09-17-design-system-neuaufbau-design.md` (Abschnitte 1, 4, 5) und `docs/skalen.md`, Abschnitt „Button: vier Erscheinungen, eine Tönung, keine Größe“.

## Global Constraints

- Alle öffentlichen Namen Englisch, kebab-case, Präfix `tl`: Klassen `.tl-button`, `.tl-button__icon`, `.tl-button__label`, Modifier `--primary|--secondary|--ghost|--link|--danger|--sm`.
- Der Namensraum `--tl` gehört dem Paket. Kein `--tl…` außerhalb von `dist/`; die Ratsche prüft das (`test/ratchet.json`, `foreignTl`).
- Zustände sind Attribute, nie Klassen: `:disabled`, `[aria-pressed="true"]`, `[aria-busy="true"]`, `:focus-visible`, `:hover`, `:active`. Ein Modifier mit Zustandsnamen bricht das Gate.
- Kein Selektor von außen auf `.tl-button`. Der Container wählt die Erscheinung.
- Kein Literal in einer Klasse außer `0`, `1`, `auto`, `none`, `100%`, `currentColor`, `inherit`, `transparent`. `font-size`, `font-weight`, `line-height` nur in `.tl-type-*`- und `.tl-icon-*`-Klassen in `base.css`.
- Kein `:focus` ohne `-visible`, kein `outline: none`. Der Fokusring kommt aus `base.css`; `button.css` schreibt keinen.
- Kontrast: Text 4,5, Linie und Icon 3,0 — geprüft gegen `surface-base` **und** `surface-layer`, in beiden Modi.
- `dist/` eingecheckt und byte-identisch mit dem Erzeugnis aus `src/`.
- Commits im Design-System-Repo: deutsch, beginnen mit `Ticket #29617: `, enden mit `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`. Commits im Worktree: dasselbe Präfix, Branch `CWS/CWS_29617_design_system_welle_1` von `master`.
- Keine Zeitangaben in Docs. `docs/praesentation.md` und `STATUS.md` werden mit jeder Doc-Änderung mitgezogen.
- Nach jeder Änderung an `src/`: `node tools/generate.mjs`, dann `node --test` und `node tools/lint-css.mjs` — beide müssen grün sein, bevor committet wird.

---

## Dateiübersicht

**Paket `design-system/`**

| Datei | Aufgabe |
|---|---|
| `src/components/button/button.css` | Die Komponente. Liest nur `var(--tl-*)`. |
| `src/components/button/button.spec.html` | Specimen: Erscheinung × Tönung × Zustand, beide Modi, beide Dichten. |
| `src/components/button/button.contract.md` | Vertrag für Kundenkomponenten: Zustand, Aktionen, Tokens, Attribute. |
| `src/primitives.json` | + vier Rot-Stufen für Danger-Hover/-Active. |
| `src/tokens.json` | + `status-error-surface-hover`, `status-error-surface-active` (beide Modi) und ihre abgeleiteten Beschriftungen. |
| `tools/generate.mjs` | + `components.css` aus `src/components/**/*.css`; + Icon-Klassen in `base.css`. |
| `tools/lint-css.mjs` | Läuft über `src/components/**/*.css`; erlaubt `font-size` in `.tl-icon-*`; verbietet Zustandsnamen als Modifier; Modifier-Liste je Block. |
| `tools/publish-to-worktree.mjs` | Kopiert `components.css` mit. |
| `tools/serve.mjs` | Unverändert — liefert jeden Pfad unter dem Paket, also auch `/src/components/button/button.spec.html`. |
| `specimen/index.html` | + Link auf das Button-Specimen. |
| `test/components.test.mjs` | Neu: Kontrast je Erscheinung × Tönung × Modus; Specimen zeigt alles; Vertrag nennt jedes Token. |
| `test/generate.test.mjs`, `test/lint-css.test.mjs`, `test/dist.test.mjs` | Erweitert um `components.css` und die neuen Gate-Regeln. |

**Worktree `~/git/tl8-wt-29584/com.top_logic.layout.react/`** (Branch `CWS/CWS_29617_design_system_welle_1`)

| Datei | Aufgabe |
|---|---|
| `react-src/controls/button/ButtonDefaults.tsx` | Neu: React-Kontext, mit dem ein Container Erscheinung und Icon-Kollaps für seine Buttons vorgibt. |
| `react-src/controls/TLButton.tsx` | Neue Klassen, Kontext, `aria-busy`, keine Größen außer `sm` bei icon-only. |
| `react-src/controls/TLToggleButton.tsx` | `tl-button tl-button--secondary`, `aria-pressed`, keine `--active`-Klasse. |
| `react-src/controls/TLUploadButton.tsx` | Dieselbe Chrome wie TLButton, `aria-busy` beim Hochladen, kein Inline-Style. |
| `react-src/controls/TLToolbar.tsx` | Setzt `ButtonDefaults appearance="ghost"` um Inline- und Dropdown-Items. |
| `react-src/controls/TLPanel.tsx` | Setzt `ButtonDefaults appearance="secondary"` um die Button-Leiste. |
| `react-src/controls/TLAppShell.tsx`, `TLAppBar.tsx` | Kompakt-Zustand als Kontext; AppBar setzt `collapseToIcon` statt der `:has`-CSS-Regel. |
| `src/main/java/.../control/button/ButtonAppearance.java` | + `GHOST("ghost")`. |
| `src/main/java/.../control/button/ButtonTone.java` | Neu: `DEFAULT`, `DANGER`. |
| `src/main/java/.../control/button/ButtonSize.java` | `LARGE` entfällt. |
| `src/main/java/.../control/button/ReactButtonControl.java` | + `setTone`, State-Key `tone`. |
| `src/main/java/.../RowCommandColumn.java` | Zeilenkommandos: `GHOST` + `SMALL` statt Kontextselektor. |
| `src/main/webapp/WEB-INF/conf/tl-layout-react.conf.config.xml` | + Stylesheet `tl-design-system-components`. |
| `src/main/webapp/style/tlReactControls.css` | Button-Block (Zeilen 100–270), „TLButton enhancements“ (5746–5772) und vier Kontextblöcke gelöscht. |
| `src/test/java/.../TestReactButtonControl.java` | Neu: Zustand für Erscheinung, Tönung, Größe. |

---

### Task 1: `components.css` — die Pipeline für Komponenten

**Files:**
- Create: `design-system/src/components/button/button.css` (Saat, wird in Task 3 gefüllt)
- Modify: `design-system/tools/generate.mjs`
- Modify: `design-system/tools/lint-css.mjs` (CLI-Teil, Zeilen 6–12 des CLI-Blocks)
- Modify: `design-system/tools/publish-to-worktree.mjs`
- Modify: `design-system/test/generate.test.mjs`, `design-system/test/dist.test.mjs`

**Interfaces:**
- Produces: `generate(P, T, components)` liefert zusätzlich `'components.css'`; `componentSources(dir)` liest `src/components/**/*.css` sortiert nach Pfad und gibt `[{ name, css }]`.
- Consumes: nichts Neues.

- [ ] **Step 1: Saat der Komponente anlegen**

`design-system/src/components/button/button.css`:

```css
/* Button — siehe docs/skalen.md „Button: vier Erscheinungen, eine Tönung, keine Größe“. */
.tl-button {
  display: inline-flex;
}
```

- [ ] **Step 2: Failing Test für die Pipeline**

In `design-system/test/generate.test.mjs` ergänzen:

```js
import { componentSources } from '../tools/generate.mjs';

test('components.css hängt jede Komponente unter src/components/**/ in Pfadreihenfolge zusammen', () => {
  const comps = componentSources(new URL('../src/components/', import.meta.url));
  assert.ok(comps.some((c) => c.name === 'button/button.css'), 'button.css fehlt');
  const out = generate(P, T, comps)['components.css'];
  assert.ok(out.startsWith('/* Erzeugt aus src/components/ — nicht von Hand ändern. */'), 'Kopfzeile fehlt');
  assert.ok(out.includes('/* --- button/button.css --- */'), 'Abschnittsmarke fehlt');
  assert.ok(out.includes('.tl-button {'), 'Inhalt fehlt');
  const names = comps.map((c) => c.name);
  assert.deepEqual(names, [...names].sort(), 'nicht nach Pfad sortiert');
});
```

- [ ] **Step 3: Test läuft rot**

Run: `cd design-system && node --test test/generate.test.mjs`
Expected: FAIL — `componentSources is not a function` bzw. `generate(...)['components.css']` ist `undefined`.

- [ ] **Step 4: Generator erweitern**

In `design-system/tools/generate.mjs` vor `export function generate` einfügen:

```js
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Alle CSS-Dateien unter src/components/, rekursiv, sortiert nach Pfad. Name relativ mit '/'. */
export function componentSources(dirUrl) {
  const root = fileURLToPath(dirUrl);
  const files = [];
  (function walk(dir) {
    for (const entry of readdirSync(dir).sort()) {
      const p = join(dir, entry);
      if (statSync(p).isDirectory()) walk(p);
      else if (entry.endsWith('.css')) files.push(p);
    }
  })(root);
  return files.sort().map((p) => ({ name: relative(root, p).split(sep).join('/'), css: readFileSync(p, 'utf8') }));
}

function componentsCss(components) {
  return '/* Erzeugt aus src/components/ — nicht von Hand ändern. */\n\n'
    + components.map((c) => `/* --- ${c.name} --- */\n${c.css.trimEnd()}\n`).join('\n');
}
```

`generate` ändern:

```js
export function generate(P, T, components = []) {
  const R = resolve(P, T);
  return {
    'primitives.css': primitivesCss(P),
    'tokens.css': tokensCss(P, T, R),
    'base.css': baseCss(T),
    'components.css': componentsCss(components),
  };
}
```

Im CLI-Block `generate(P, T)` durch `generate(P, T, componentSources(new URL('../src/components/', import.meta.url)))` ersetzen.

- [ ] **Step 5: `dist.test.mjs` und `publish-to-worktree.mjs` nachziehen**

In `design-system/test/dist.test.mjs` den Aufruf `generate(P, T)` durch `generate(P, T, componentSources(new URL('../src/components/', import.meta.url)))` ersetzen und `componentSources` mit importieren.

In `design-system/tools/publish-to-worktree.mjs` die Liste `['primitives.css', 'tokens.css', 'base.css']` um `'components.css'` ergänzen.

- [ ] **Step 6: Klassen-Gate liest Unterordner**

In `design-system/tools/lint-css.mjs`, CLI-Block: die Zeile

```js
if (existsSync(comps)) for (const f of readdirSync(comps).filter((f) => f.endsWith('.css'))) files.push([f, new URL(f, comps)]);
```

ersetzen durch

```js
if (existsSync(comps)) {
  const { componentSources } = await import('./generate.mjs');
  for (const c of componentSources(comps)) files.push([c.name, new URL(c.name, comps)]);
}
```

Das Gate soll `dist/components.css` **nicht** prüfen (Dublette der Quelle): in derselben Funktion den Filter `f !== 'primitives.css'` um `&& f !== 'components.css'` erweitern.

- [ ] **Step 7: Erzeugen, Tests, Gate**

Run: `cd design-system && node tools/generate.mjs && node --test && node tools/lint-css.mjs`
Expected: `geschrieben: dist/components.css`; alle Tests grün (83 oder mehr); `Klassen-Gate grün`.

- [ ] **Step 8: Commit**

```bash
git add design-system && git commit -m "Ticket #29617: components.css -- Komponenten aus src/components/**/ zusammengehaengt, Gate und Publish lesen mit

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 2: Tokens für Danger-Rampe und Icon-Klassen

**Files:**
- Modify: `design-system/src/primitives.json` (Abschnitt `color`)
- Modify: `design-system/src/tokens.json` (`color.light`, `color.dark`, `derived.light`, `derived.dark`)
- Modify: `design-system/tools/generate.mjs` (`baseCss`)
- Modify: `design-system/tools/lint-css.mjs` (`TYPE_SELECTOR`)
- Modify: `design-system/test/tokens.test.mjs`, `design-system/test/lint-css.test.mjs`

**Interfaces:**
- Produces: Tokens `--tl-status-error-surface-hover`, `--tl-status-error-surface-active`, `--tl-text-on-status-error-hover`, `--tl-text-on-status-error-active`; Klassen `.tl-icon-glyph`, `.tl-icon-sm`, `.tl-icon-md`, `.tl-icon-lg` in `base.css`.

- [ ] **Step 1: Failing Test für die Danger-Rampe**

In `design-system/test/tokens.test.mjs` ergänzen:

```js
test('die Fehlerfläche hat eine Rampe wie die Marke: hover und active je Modus, Beschriftung abgeleitet', () => {
  for (const m of ['light', 'dark']) {
    for (const k of ['status-error-surface-hover', 'status-error-surface-active'])
      assert.ok(T.color[m][k], `${m}: ${k} fehlt`);
    for (const k of ['text-on-status-error-hover', 'text-on-status-error-active'])
      assert.ok(T.derived[m][k], `${m}: ${k} fehlt`);
  }
  const R = resolve(P, T);
  // Rampenrichtung wie surface-brand: hell wird beim Zeigen dunkler, dunkel wird heller.
  assert.ok(lum(R.light['status-error-surface-hover']) < lum(R.light['status-error-surface']), 'hell: hover muss dunkler sein');
  assert.ok(lum(R.dark['status-error-surface-hover']) > lum(R.dark['status-error-surface']), 'dunkel: hover muss heller sein');
});
```

Dazu oben im Test die Hilfe (nach den Imports):

```js
import { hexZuOklch } from '../tools/lib/color.mjs';
const lum = (hex) => hexZuOklch(hex).L;
```

Prüfe vorher mit `grep -n "R.light\|resolve(P, T)" test/tokens.test.mjs`, wie `resolve` seine Modi liefert (`R.light[...]`/`R.dark[...]` oder `R.color.light[...]`), und passe die zwei Zugriffe an.

- [ ] **Step 2: Test läuft rot**

Run: `cd design-system && node --test test/tokens.test.mjs`
Expected: FAIL — `light: status-error-surface-hover fehlt`.

- [ ] **Step 3: Rot-Stufen rechnen und eintragen**

Die Werte kommen aus demselben Kern wie die Markenrampe:

```bash
cd design-system && node -e "
import('./tools/lib/color.mjs').then(async ({ markenRampe }) => {
  const { stufe } = await import('./tools/lib/naming.mjs');
  const P = JSON.parse(require('fs').readFileSync('src/primitives.json'));
  const T = JSON.parse(require('fs').readFileSync('src/tokens.json'));
  const kandidaten = { light: P.color[T.derived.candidates.light.slice(1,-1)], dark: P.color[T.derived.candidates.dark.slice(1,-1)] };
  const r = markenRampe(P.color['red-45'], kandidaten);
  console.log(JSON.stringify(r, null, 2));
  for (const m of ['light','dark']) for (const k of Object.keys(r[m])) if (/hover|active/.test(k)) console.log(m, k, r[m][k], 'red-' + stufe(r[m][k]));
});"
```

Lies die Ausgabe: `markenRampe` liefert je Modus die Flächen `surface-brand`, `-hover`, `-active` (Namen wie in `color.mjs:270 ff.`). Übernimm **hell** `hover` und `active` sowie **dunkel** `hover` und `active` als neue Primitive in `src/primitives.json` unter `color`, benannt `red-<stufe>` (die `stufe()` aus der Ausgabe). Stimmt eine Stufe mit einem vorhandenen Namen überein, nimm den vorhandenen Wert und lege nichts Neues an. Der Dark-Grundton ist dabei nicht `red-45`, sondern `status-error-surface` dunkel = `red-35`: rufe `markenRampe(P.color['red-35'], kandidaten)` ein zweites Mal und nimm daraus den Dark-Teil.

In `src/tokens.json`:

```json
"color": {
  "light": { "...": "...", "status-error-surface-hover": "{red-<hell-hover>}", "status-error-surface-active": "{red-<hell-active>}" },
  "dark":  { "...": "...", "status-error-surface-hover": "{red-<dunkel-hover>}", "status-error-surface-active": "{red-<dunkel-active>}" }
},
"derived": {
  "light": { "...": "...", "text-on-status-error-hover": { "surface": "status-error-surface-hover" }, "text-on-status-error-active": { "surface": "status-error-surface-active" } },
  "dark":  { "...": "...", "text-on-status-error-hover": { "surface": "status-error-surface-hover" }, "text-on-status-error-active": { "surface": "status-error-surface-active" } }
}
```

(`"..."` steht für die vorhandenen Einträge, die unverändert bleiben. Die Einträge direkt hinter `status-error-surface` bzw. `text-on-status-error` einfügen.)

- [ ] **Step 4: Tokens-Tests grün, Farbton-Test beachten**

Run: `cd design-system && node tools/generate.mjs && node --test test/tokens.test.mjs test/naming.test.mjs test/color.test.mjs`
Expected: PASS. Bricht „getönte Flächen verschiedener Bedeutung trennen sich im Farbton“ oder „kein Name wird zweimal vergeben“, ist ein neuer Name falsch — zurück zu Step 3, Stufe prüfen.

- [ ] **Step 5: Failing Test für die Icon-Klassen**

In `design-system/test/generate.test.mjs`:

```js
test('base.css führt vier Icon-Klassen mit Größe aus size-icon-*, line-height 1, quadratisch', () => {
  const base = generate(P, T)['base.css'];
  for (const s of ['glyph', 'sm', 'md', 'lg']) {
    const re = new RegExp(`\\.tl-icon-${s}\\s*\\{[^}]*font-size:\\s*var\\(--tl-size-icon-${s}\\)[^}]*\\}`);
    assert.ok(re.test(base), `.tl-icon-${s} liest nicht --tl-size-icon-${s}`);
  }
  assert.ok(/\.tl-icon-glyph, \.tl-icon-sm, \.tl-icon-md, \.tl-icon-lg\s*\{[^}]*line-height:\s*1;[^}]*width:\s*1em;[^}]*height:\s*1em;[^}]*display:\s*inline-block;/.test(base),
    'gemeinsame Regel fehlt (line-height 1, 1em-Quadrat, inline-block)');
});
```

In `design-system/test/lint-css.test.mjs`:

```js
test('font-size ist in .tl-icon-* in base.css erlaubt, außerhalb nicht', () => {
  assert.deepEqual(lint('.tl-icon-sm { font-size: var(--tl-size-icon-sm); }', { known: new Set(['--tl-size-icon-sm']), file: 'base.css' }), []);
  assert.equal(lint('.tl-button__icon { font-size: var(--tl-size-icon-sm); }', { known: new Set(['--tl-size-icon-sm']), file: 'button/button.css' }).length, 1);
});
```

- [ ] **Step 6: Tests rot**

Run: `cd design-system && node --test test/generate.test.mjs test/lint-css.test.mjs`
Expected: FAIL an beiden neuen Tests.

- [ ] **Step 7: Icon-Klassen erzeugen und im Gate erlauben**

In `tools/generate.mjs`, Funktion `baseCss`, nach den Typo-Klassen und vor dem Reduced-Motion-Block einfügen:

```js
/* Icons: drei Stufen nach Rolle plus Glyph im Control — siehe skalen.md „Icons“.
   line-height 1, sonst erbt der Glyph die Zeilenhöhe des Fließtexts; das 1em-Quadrat hält
   Menü- und Baumspalten in Flucht. Die Fläche einer Icon-Schaltfläche ist Sache des Controls. */
.tl-icon-glyph, .tl-icon-sm, .tl-icon-md, .tl-icon-lg {
  display: inline-block;
  line-height: 1;
  width: 1em;
  height: 1em;
  text-align: center;
  flex-shrink: 0;
}
.tl-icon-glyph { font-size: var(--tl-size-icon-glyph); }
.tl-icon-sm { font-size: var(--tl-size-icon-sm); }
.tl-icon-md { font-size: var(--tl-size-icon-md); }
.tl-icon-lg { font-size: var(--tl-size-icon-lg); }
```

(`1em` ist hier kein Verstoß: das Gate nimmt in `base.css` die `.tl-print-`-, `line-height`- und `letter-spacing`-Fälle aus. Erweitere die Ausnahme in `lint-css.mjs`, letzte Zeile der Maßprüfung, um `.tl-icon-`: `!/\.tl-print-|\.tl-icon-|line-height|letter-spacing/.test(sel + d.property)`.)

In `tools/lint-css.mjs`:

```js
const TYPE_SELECTOR = /\.tl-(type|print|icon)-/;
```

- [ ] **Step 8: Erzeugen, alle Tests, Gate**

Run: `cd design-system && node tools/generate.mjs && node --test && node tools/lint-css.mjs`
Expected: alle grün, `Klassen-Gate grün`.

- [ ] **Step 9: Docs nachziehen und committen**

In `docs/skalen.md`, Abschnitt „Semantik: vier Bedeutungen, vier Rollen“, einen Absatz anhängen:

> **Ergänzt für den Button:** `status-error-surface` bekommt `-hover` und `-active` nach der Rampenregel der Marke, mit abgeleiteter Beschriftung. Die übrigen Bedeutungen bleiben ohne Rampe, bis eine Komponente sie als bedienbare Fläche braucht.

In `docs/skalen.md`, Abschnitt „Icons“, einen Satz: „Die vier Stufen stehen als Klassen `.tl-icon-glyph|sm|md|lg` in `base.css`; `font-size` ist nur dort erlaubt.“ Dasselbe in einer Zeile in `docs/praesentation.md`, Folie 23 (Icons). `STATUS.md`: Testzahl aktualisieren.

```bash
git add -A && git commit -m "Ticket #29617: Danger-Rampe und Icon-Klassen -- status-error-surface hover/active mit Beschriftung, .tl-icon-* in base.css

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 3: `button.css` und die Gate-Regeln für Modifier

**Files:**
- Modify: `design-system/src/components/button/button.css`
- Modify: `design-system/tools/lint-css.mjs`
- Create: `design-system/test/components.test.mjs`
- Modify: `design-system/test/lint-css.test.mjs`

**Interfaces:**
- Produces: Klassen `.tl-button`, `.tl-button__icon`, `.tl-button__label`, Modifier `--primary`, `--secondary`, `--ghost`, `--link`, `--danger`, `--sm`. Zustände `:disabled`, `[aria-pressed="true"]`, `[aria-busy="true"]`.
- Consumes: Tokens aus Task 2.

- [ ] **Step 1: Failing Gate-Tests (Zustand als Modifier, Modifier-Liste)**

In `design-system/test/lint-css.test.mjs`:

```js
test('ein Zustandsname als Modifier bricht — Zustände sind Attribute', () => {
  for (const z of ['active', 'disabled', 'loading', 'hover', 'focus', 'pressed', 'selected', 'open', 'checked', 'busy'])
    assert.equal(lint(`.tl-button--${z} { color: var(--tl-text-primary); }`, { known: new Set(['--tl-text-primary']), file: 'button/button.css' })
      .filter((m) => /Zustand als Modifier/.test(m)).length, 1, z);
});

test('am Block tl-button sind nur die entschiedenen Modifier erlaubt', () => {
  const known = new Set(['--tl-text-primary']);
  for (const ok of ['primary', 'secondary', 'ghost', 'link', 'danger', 'sm'])
    assert.deepEqual(lint(`.tl-button--${ok} { color: var(--tl-text-primary); }`, { known, file: 'button/button.css' }), [], ok);
  assert.equal(lint('.tl-button--large { color: var(--tl-text-primary); }', { known, file: 'button/button.css' })
    .filter((m) => /kein Modifier von tl-button/.test(m)).length, 1);
});
```

- [ ] **Step 2: Tests rot**

Run: `cd design-system && node --test test/lint-css.test.mjs`
Expected: FAIL — keine Meldung „Zustand als Modifier“, keine „kein Modifier von tl-button“.

- [ ] **Step 3: Gate-Regeln**

In `tools/lint-css.mjs` bei den Konstanten:

```js
// Punkt 10: Zustände sind Attribute (:disabled, [aria-pressed], [aria-busy], :focus-visible), nie Klassen.
const STATE_MODIFIER = /--(active|disabled|loading|hover|focus|focused|pressed|selected|open|closed|checked|busy|invalid|dirty)$/;
// Punkt 11: Die Modifier eines Blocks sind entschieden (docs/skalen.md), nicht gewachsen.
const MODIFIERS = { 'tl-button': new Set(['primary', 'secondary', 'ghost', 'link', 'danger', 'sm']) };
```

In `lint`, in der Schleife über `sel2.matchAll(/\.([A-Za-z0-9_-]+)/g)` nach der BEM-Prüfung:

```js
if (STATE_MODIFIER.test(cls[1])) out.push(`${file}:${d.line} .${cls[1]} — Zustand als Modifier; Zustände sind Attribute`);
const m = /^(tl-[a-z0-9-]+?)--([a-z0-9-]+)$/.exec(cls[1]);
if (m && MODIFIERS[m[1]] && !MODIFIERS[m[1]].has(m[2]))
  out.push(`${file}:${d.line} .${cls[1]} — kein Modifier von ${m[1]}; erlaubt: ${[...MODIFIERS[m[1]]].join(', ')}`);
```

Achtung: `^(tl-[a-z0-9-]+?)--` ist non-greedy, damit `tl-button--sm` als Block `tl-button` gelesen wird und nicht `tl-button--sm` als Block ohne Modifier.

- [ ] **Step 4: Gate-Tests grün**

Run: `cd design-system && node --test test/lint-css.test.mjs`
Expected: PASS.

- [ ] **Step 5: Failing Kontrasttest für die Komponente**

`design-system/test/components.test.mjs` anlegen:

```js
// Die Komponente ist fertig, wenn jede Erscheinung × Tönung × Modus die Anforderung erfüllt —
// gegen beide Flächen, auf denen ein Button liegen kann.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ratio, AA_TEXT, AA_NON_TEXT } from '../tools/lib/contrast.mjs';
import { resolve } from '../tools/resolve.mjs';

const P = JSON.parse(readFileSync(new URL('../src/primitives.json', import.meta.url)));
const T = JSON.parse(readFileSync(new URL('../src/tokens.json', import.meta.url)));
const R = resolve(P, T); // R.light / R.dark: Rolle → Hex, inkl. derived

const GRUND = ['surface-base', 'surface-layer'];

/** Was jede Kombination liest — dieselben Namen wie in button.css. */
const BUTTON = {
  primary:            { fill: 'surface-brand', text: 'text-on-brand' },
  'primary-hover':    { fill: 'surface-brand-hover', text: 'text-on-brand-hover' },
  'primary-active':   { fill: 'surface-brand-active', text: 'text-on-brand-active' },
  secondary:          { text: 'text-primary', line: 'border-control' },
  'secondary-hover':  { fill: 'surface-interactive-hover', text: 'text-primary', line: 'border-control' },
  ghost:              { text: 'text-primary' },
  'ghost-hover':      { fill: 'surface-interactive-hover', text: 'text-primary' },
  link:               { text: 'text-link' },
  'link-hover':       { text: 'text-link-hover' },
  pressed:            { fill: 'surface-brand-subtle', text: 'text-primary', line: 'border-interactive' },
  'danger-primary':   { fill: 'status-error-surface', text: 'text-on-status-error' },
  'danger-primary-hover':  { fill: 'status-error-surface-hover', text: 'text-on-status-error-hover' },
  'danger-primary-active': { fill: 'status-error-surface-active', text: 'text-on-status-error-active' },
  'danger-secondary': { text: 'status-error-text', line: 'status-error-border' },
  'danger-secondary-hover': { fill: 'status-error-subtle', text: 'status-error-text', line: 'status-error-border' },
  'danger-ghost':     { text: 'status-error-text' },
  'danger-ghost-hover': { fill: 'status-error-subtle', text: 'status-error-text' },
};

for (const mode of ['light', 'dark']) {
  const C = R[mode];
  test(`Button ${mode}: Text 4,5 und Linie 3,0 in jeder Erscheinung × Tönung, auf base und layer`, () => {
    for (const [name, k] of Object.entries(BUTTON)) {
      for (const g of GRUND) {
        const flaeche = k.fill ? C[k.fill] : C[g];
        assert.ok(C[k.text], `${name}: Token ${k.text} fehlt`);
        const t = ratio(C[k.text], flaeche);
        assert.ok(t >= AA_TEXT, `${mode} ${name} auf ${g}: Text ${k.text} ${t.toFixed(2)} < 4,5`);
        if (k.line) {
          const l = ratio(C[k.line], C[g]);
          assert.ok(l >= AA_NON_TEXT, `${mode} ${name} auf ${g}: Linie ${k.line} ${l.toFixed(2)} < 3,0`);
        }
        if (k.fill && !k.line) {
          // Eine gefüllte Fläche ohne Linie muss sich vom Grund abheben, sonst ist der Button unsichtbar.
          const f = ratio(C[k.fill], C[g]);
          assert.ok(f >= AA_NON_TEXT || /hover|active|pressed/.test(name), `${mode} ${name} auf ${g}: Fläche ${k.fill} ${f.toFixed(2)} < 3,0`);
        }
      }
    }
  });
}

test('disabled liest die drei Disabled-Rollen und sonst nichts', () => {
  const css = readFileSync(new URL('../src/components/button/button.css', import.meta.url), 'utf8');
  const block = /\.tl-button:disabled[^{]*\{([^}]*)\}/.exec(css);
  assert.ok(block, ':disabled-Regel fehlt');
  const vars = [...block[1].matchAll(/var\((--tl-[a-z0-9-]+)\)/g)].map((m) => m[1]).sort();
  assert.deepEqual(vars, ['--tl-border-disabled', '--tl-surface-disabled', '--tl-text-disabled'].sort());
});
```

Prüfe vor dem ersten Lauf mit `node -e "import('./tools/resolve.mjs').then(m=>{const fs=require('fs');const R=m.resolve(JSON.parse(fs.readFileSync('src/primitives.json')),JSON.parse(fs.readFileSync('src/tokens.json')));console.log(Object.keys(R), Object.keys(R.light||{}).slice(0,5))})"`, wie `resolve` Modi und `derived` zurückgibt, und passe `R[mode]` und ggf. den Zugriff auf `text-on-*` an (eventuell `R.derived[mode]`).

- [ ] **Step 6: Test rot**

Run: `cd design-system && node --test test/components.test.mjs`
Expected: FAIL — `:disabled-Regel fehlt` (Kontrast der Tokens sollte bereits halten; hält er nicht, ist das ein Befund für `skalen.md` — nicht am Test drehen).

- [ ] **Step 7: `button.css` schreiben**

`design-system/src/components/button/button.css` vollständig ersetzen:

```css
/* Button — docs/skalen.md „Button: vier Erscheinungen, eine Tönung, keine Größe“.
   Vier Erscheinungen (--primary, --secondary, --ghost, --link), eine Tönung (--danger),
   eine Größe nur für die Icon-Schaltfläche (--sm). Zustände sind Attribute; den Fokusring
   liefert base.css. Kein Selektor von außen: der Container wählt die Erscheinung. */

.tl-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--tl-space-xs);
  min-height: var(--tl-size-control);
  padding: 0 var(--tl-space-control-x);
  border: var(--tl-border-width-sm) solid transparent;
  border-radius: var(--tl-radius-sm);
  background: transparent;
  color: var(--tl-text-primary);
  font: inherit;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  transition:
    background-color var(--tl-duration-fast) var(--tl-easing-standard),
    border-color var(--tl-duration-fast) var(--tl-easing-standard),
    color var(--tl-duration-fast) var(--tl-easing-standard);
}

.tl-button__icon {
  flex-shrink: 0;
}

.tl-button__label {
  overflow: hidden;
  text-overflow: ellipsis;
}

/* --- Erscheinungen ------------------------------------------------------- */

.tl-button--secondary {
  border-color: var(--tl-border-control);
}
.tl-button--secondary:hover {
  background: var(--tl-surface-interactive-hover);
}
.tl-button--secondary:active {
  background: var(--tl-surface-interactive-active);
}

.tl-button--primary {
  background: var(--tl-surface-brand);
  color: var(--tl-text-on-brand);
}
.tl-button--primary:hover {
  background: var(--tl-surface-brand-hover);
  color: var(--tl-text-on-brand-hover);
}
.tl-button--primary:active {
  background: var(--tl-surface-brand-active);
  color: var(--tl-text-on-brand-active);
}

.tl-button--ghost:hover {
  background: var(--tl-surface-interactive-hover);
}
.tl-button--ghost:active {
  background: var(--tl-surface-interactive-active);
}

.tl-button--link {
  min-height: auto;
  padding: 0;
  border: none;
  border-radius: 0;
  color: var(--tl-text-link);
  white-space: normal;
}
.tl-button--link:hover {
  color: var(--tl-text-link-hover);
  text-decoration: underline;
}

/* --- Tönung: destruktiv -------------------------------------------------- */

.tl-button--danger.tl-button--primary {
  background: var(--tl-status-error-surface);
  color: var(--tl-text-on-status-error);
}
.tl-button--danger.tl-button--primary:hover {
  background: var(--tl-status-error-surface-hover);
  color: var(--tl-text-on-status-error-hover);
}
.tl-button--danger.tl-button--primary:active {
  background: var(--tl-status-error-surface-active);
  color: var(--tl-text-on-status-error-active);
}

.tl-button--danger.tl-button--secondary {
  border-color: var(--tl-status-error-border);
  color: var(--tl-status-error-text);
}
.tl-button--danger.tl-button--ghost {
  color: var(--tl-status-error-text);
}
.tl-button--danger.tl-button--secondary:hover,
.tl-button--danger.tl-button--ghost:hover,
.tl-button--danger.tl-button--secondary:active,
.tl-button--danger.tl-button--ghost:active {
  background: var(--tl-status-error-subtle);
}

/* --- Größe: nur die Icon-Schaltfläche ------------------------------------ */

.tl-button--sm {
  min-height: var(--tl-size-control-sm);
  padding: 0 var(--tl-space-2xs);
}

/* --- Zustände als Attribute --------------------------------------------- */

.tl-button[aria-pressed="true"] {
  background: var(--tl-surface-brand-subtle);
  border-color: var(--tl-border-interactive);
  color: var(--tl-text-primary);
}
.tl-button[aria-pressed="true"]:hover {
  background: var(--tl-surface-brand-subtle-hover);
}

.tl-button[aria-busy="true"] {
  cursor: progress;
  pointer-events: none;
}

.tl-button:disabled {
  background: var(--tl-surface-disabled);
  border-color: var(--tl-border-disabled);
  color: var(--tl-text-disabled);
  cursor: default;
  pointer-events: none;
}
```

Hinweise für den Umsetzer: `transparent`, `inherit`, `none`, `auto`, `0`, `normal`, `underline`, `nowrap`, `center`, `pointer`, `progress`, `default` sind Schlüsselwörter, keine Literale; das Gate lässt sie durch (`font: inherit` ist ausdrücklich erlaubt). Steht `--tl-space-2xs` oder `--tl-size-control-sm` nicht in `dist/tokens.css`, melde das als Befund — nicht ersetzen.

- [ ] **Step 8: Erzeugen, Tests, Gate**

Run: `cd design-system && node tools/generate.mjs && node --test && node tools/lint-css.mjs`
Expected: alle grün. Schlägt der Kontrasttest für eine Kombination an, ist das ein Skalen-Befund: in `docs/skalen.md` unter dem Button-Abschnitt notieren und mit Hendrik klären, bevor ein Token geändert wird.

- [ ] **Step 9: Commit**

```bash
git add -A && git commit -m "Ticket #29617: button.css -- vier Erscheinungen, Toenung danger, Zustaende als Attribute; Gate verbietet Zustands-Modifier und fremde Modifier am Block

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 4: Specimen

**Files:**
- Create: `design-system/src/components/button/button.spec.html`
- Modify: `design-system/specimen/index.html` (Link in der Kopfleiste)
- Modify: `design-system/test/components.test.mjs`

**Interfaces:**
- Produces: `/src/components/button/button.spec.html` unter `node tools/serve.mjs` auf `http://localhost:8137/`.

- [ ] **Step 1: Failing Test — das Specimen zeigt alles**

In `design-system/test/components.test.mjs`:

```js
test('das Button-Specimen zeigt jede Erscheinung, die Tönung, sm, und jeden Zustand', () => {
  const html = readFileSync(new URL('../src/components/button/button.spec.html', import.meta.url), 'utf8');
  for (const m of ['primary', 'secondary', 'ghost', 'link', 'danger', 'sm'])
    assert.ok(html.includes(`tl-button--${m}`), `Modifier ${m} fehlt`);
  for (const attr of ['disabled', 'aria-pressed="true"', 'aria-busy="true"', 'aria-label='])
    assert.ok(html.includes(attr), `Zustand ${attr} fehlt`);
  assert.ok(html.includes('tl-button__icon') && html.includes('tl-button__label'), 'Elemente fehlen');
  assert.ok(html.includes('id="mode"') && html.includes('id="density"'), 'Schalter für Modus und Dichte fehlen');
  assert.ok(html.includes('/dist/components.css'), 'lädt components.css nicht');
  assert.ok(!/style="/.test(html.replace(/<style>[\s\S]*?<\/style>/, '')), 'Inline-Style im Specimen');
});
```

- [ ] **Step 2: Test rot**

Run: `cd design-system && node --test test/components.test.mjs`
Expected: FAIL — Datei fehlt (`ENOENT`).

- [ ] **Step 3: Specimen schreiben**

`design-system/src/components/button/button.spec.html`:

```html
<!doctype html>
<html lang="de" data-tl-mode="light" data-tl-density="normal">
<head>
<meta charset="utf-8">
<title>TopLogic Design System — Button</title>
<link rel="stylesheet" href="/fonts/style/interFonts.css">
<link rel="stylesheet" href="/dist/primitives.css">
<link rel="stylesheet" href="/dist/tokens.css">
<link rel="stylesheet" href="/dist/base.css">
<link rel="stylesheet" href="/dist/components.css">
<style>
  .specimen { display: grid; gap: var(--tl-space-lg); padding: var(--tl-space-xl); max-width: 64rem; margin: 0 auto; }
  .specimen__bar { display: flex; gap: var(--tl-space-sm); align-items: center; }
  .specimen__panel { background: var(--tl-surface-layer); border: var(--tl-border-width-sm) solid var(--tl-border-separator);
    border-radius: var(--tl-radius-md); padding: var(--tl-space-md); display: grid; gap: var(--tl-space-sm); }
  .specimen__base { padding: var(--tl-space-md); display: grid; gap: var(--tl-space-sm); }
  .specimen__row { display: flex; gap: var(--tl-space-sm); flex-wrap: wrap; align-items: center; }
  .specimen__row > .tl-type-label { min-width: 9rem; color: var(--tl-text-secondary); }
</style>
</head>
<body>
<main class="specimen">
  <div class="specimen__bar">
    <a class="tl-type-label" href="/">← Grundklassen</a>
    <span class="tl-type-heading-lg">Button</span>
    <label class="tl-type-label"><input type="checkbox" id="mode"> dunkel</label>
    <label class="tl-type-label"><input type="checkbox" id="density"> kompakt</label>
  </div>

  <!-- Jede Zeile: eine Erscheinung in Ruhe, mit Icon, icon-only, gedrückt, beschäftigt, deaktiviert. -->
  <template id="rows">
    <div class="specimen__row">
      <span class="tl-type-label">%NAME%</span>
      <button type="button" class="tl-button %MOD% tl-type-label"><span class="tl-button__label">Speichern</span></button>
      <button type="button" class="tl-button %MOD% tl-type-label"><i class="ri-save-line tl-icon-sm tl-button__icon" aria-hidden="true"></i><span class="tl-button__label">Speichern</span></button>
      <button type="button" class="tl-button %MOD% tl-type-label" aria-label="Speichern"><i class="ri-save-line tl-icon-md tl-button__icon" aria-hidden="true"></i></button>
      <button type="button" class="tl-button %MOD% tl-type-label" aria-pressed="true"><span class="tl-button__label">Gedrückt</span></button>
      <button type="button" class="tl-button %MOD% tl-type-label" aria-busy="true"><span class="tl-button__label">Beschäftigt</span></button>
      <button type="button" class="tl-button %MOD% tl-type-label" disabled><span class="tl-button__label">Deaktiviert</span></button>
    </div>
  </template>

  <section class="specimen__panel" id="on-layer"><p class="tl-type-heading-sm">Auf surface-layer</p></section>
  <section class="specimen__base" id="on-base"><p class="tl-type-heading-sm">Auf surface-base</p></section>

  <section class="specimen__panel">
    <p class="tl-type-heading-sm">Icon-Schaltfläche klein (Tabellenzeile)</p>
    <div class="specimen__row">
      <span class="tl-type-label">ghost sm</span>
      <button type="button" class="tl-button tl-button--ghost tl-button--sm tl-type-label" aria-label="Bearbeiten"><i class="ri-pencil-line tl-icon-sm tl-button__icon" aria-hidden="true"></i></button>
      <button type="button" class="tl-button tl-button--ghost tl-button--sm tl-button--danger tl-type-label" aria-label="Löschen"><i class="ri-delete-bin-line tl-icon-sm tl-button__icon" aria-hidden="true"></i></button>
      <button type="button" class="tl-button tl-button--ghost tl-button--sm tl-type-label" aria-label="Bearbeiten" disabled><i class="ri-pencil-line tl-icon-sm tl-button__icon" aria-hidden="true"></i></button>
    </div>
  </section>
</main>
<script>
  const VARIANTEN = [
    ['primary', 'tl-button--primary'], ['secondary', 'tl-button--secondary'], ['ghost', 'tl-button--ghost'], ['link', 'tl-button--link'],
    ['danger primary', 'tl-button--primary tl-button--danger'], ['danger secondary', 'tl-button--secondary tl-button--danger'], ['danger ghost', 'tl-button--ghost tl-button--danger'],
  ];
  const tpl = document.getElementById('rows').innerHTML;
  for (const id of ['on-layer', 'on-base']) {
    const host = document.getElementById(id);
    for (const [name, mod] of VARIANTEN) host.insertAdjacentHTML('beforeend', tpl.replaceAll('%NAME%', name).replaceAll('%MOD%', mod));
  }
  const html = document.documentElement;
  document.getElementById('mode').addEventListener('change', (e) => html.setAttribute('data-tl-mode', e.target.checked ? 'dark' : 'light'));
  document.getElementById('density').addEventListener('change', (e) => html.setAttribute('data-tl-density', e.target.checked ? 'compact' : 'normal'));
</script>
</body>
</html>
```

Die Remixicon-Klassen (`ri-*`) zeigen ohne die Icon-Schrift nur ein leeres Quadrat — das ist im Specimen in Ordnung; die Größe der Fläche ist sichtbar. Wer die Glyphen sehen will, verlinkt zusätzlich die Remixicon-CSS aus dem Worktree; das bleibt außerhalb des Pakets.

- [ ] **Step 4: Link aus dem Grundklassen-Specimen**

In `design-system/specimen/index.html`, in `.specimen__bar` nach den beiden Labels:

```html
    <a class="tl-type-label" href="/src/components/button/button.spec.html">Button →</a>
```

- [ ] **Step 5: Test grün, Sichtprüfung**

Run: `cd design-system && node --test test/components.test.mjs`
Expected: PASS.

Run: `node tools/serve.mjs` und `http://localhost:8137/src/components/button/button.spec.html` öffnen. Prüfen: sieben Zeilen je Fläche, dunkel und kompakt schalten, Fokusring per Tab sichtbar, `link` ohne Rahmen, `danger primary` rot gefüllt mit lesbarer Beschriftung. Server mit Ctrl+C beenden.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "Ticket #29617: Button-Specimen -- sieben Kombinationen x sechs Zustaende auf base und layer, beide Modi, beide Dichten

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 5: Vertrag

**Files:**
- Create: `design-system/src/components/button/button.contract.md`
- Modify: `design-system/test/components.test.mjs`

**Interfaces:**
- Produces: die Vertragsform, die jede weitere Komponente wiederholt: Abschnitte **Zustand**, **Aktionen**, **Tokens**, **Attribute**, **Konformität**.

- [ ] **Step 1: Failing Test — der Vertrag nennt jedes Token und jedes Attribut der CSS**

In `design-system/test/components.test.mjs`:

```js
test('der Vertrag nennt jedes Token, das button.css liest, und jedes Zustandsattribut', () => {
  const css = readFileSync(new URL('../src/components/button/button.css', import.meta.url), 'utf8');
  const md = readFileSync(new URL('../src/components/button/button.contract.md', import.meta.url), 'utf8');
  const tokens = new Set([...css.matchAll(/var\((--tl-[a-z0-9-]+)\)/g)].map((m) => m[1]));
  for (const t of tokens) assert.ok(md.includes('`' + t + '`'), `Vertrag nennt ${t} nicht`);
  for (const a of ['disabled', 'aria-pressed', 'aria-busy', 'aria-label', 'focus-visible'])
    assert.ok(md.includes(a), `Vertrag nennt ${a} nicht`);
  for (const h of ['## Zustand', '## Aktionen', '## Tokens', '## Attribute', '## Konformität'])
    assert.ok(md.includes(h), `Abschnitt ${h} fehlt`);
});
```

- [ ] **Step 2: Test rot**

Run: `cd design-system && node --test test/components.test.mjs`
Expected: FAIL — `ENOENT` für `button.contract.md`.

- [ ] **Step 3: Vertrag schreiben**

`design-system/src/components/button/button.contract.md`:

````markdown
# Vertrag: Button

Eine Kundenkomponente, die unter dem TopLogic-Namen `TLButton` registriert ist (Stufe C der Spec),
bekommt vom Server den Zustand unten, löst die genannten Aktionen aus und trägt die genannten
Attribute. TopLogic garantiert dann Funktion, Tastatur und Fokus — nicht das Aussehen. Wer ins Bild
passen will, liest die Tokens.

## Zustand

Vom Server über `useTLState()`:

| Schlüssel | Typ | Bedeutung |
|---|---|---|
| `label` | string | Beschriftung; bei icon-only der zugängliche Name (`aria-label`). |
| `image` | string, optional | Kodiertes ThemeImage für das Icon (`ThemeIcon`). |
| `displayMode` | `icon-only` \| `icon-label` \| `label-only`, optional | Standard `label-only`. Ohne `image` fällt `icon-only` auf `label-only` zurück. |
| `appearance` | `primary` \| `ghost` \| `link`, optional | Fehlt er, gilt die Vorgabe des Containers (`ButtonDefaults`), sonst `secondary`. |
| `tone` | `danger`, optional | Destruktive Aktion. Nicht mit `link`. |
| `size` | `small`, optional | Nur mit `displayMode: icon-only` wirksam (`--sm`). |
| `disabled` | boolean | Der Button ist `disabled`. |
| `active` | boolean | Der Button ist gedrückt oder die geltende Alternative: `aria-pressed="true"`. |
| `hidden` | boolean | Rendert nichts. Die Tastenbindung bleibt registriert und lehnt ab. |
| `tooltip` | string, optional | Tooltip-Text; bei icon-only Rückfall auf `label`. |
| `keyGesture` | string, optional | Tastengeste im umgebenden Scope (`useKeyboardBinding`). |
| `navigateUrl`, `navigateNewWindow` | string, boolean, optional | Klick navigiert statt zu senden. |
| `cssClasses` | string, optional | Zusätzliche Klassen des Kommandos; werden an `className` durchgereicht. |

## Aktionen

| Auslöser | Aktion |
|---|---|
| Klick, Enter, Leertaste | `sendCommand('click')` — oder `navigateUrl` öffnen, wenn gesetzt. |
| Tastengeste `keyGesture` | dasselbe wie Klick; `false` zurückgeben, wenn `disabled` oder `hidden`. |

## Tokens

Fläche, Beschriftung und Linie je Erscheinung; Hover und Active eine Stufe weiter auf derselben Rampe.

| Erscheinung | Fläche | Beschriftung | Linie |
|---|---|---|---|
| `secondary` (Default) | `--tl-surface-interactive-hover` / `--tl-surface-interactive-active` beim Zeigen und Drücken | `--tl-text-primary` | `--tl-border-control`, Breite `--tl-border-width-sm` |
| `primary` | `--tl-surface-brand`, `--tl-surface-brand-hover`, `--tl-surface-brand-active` | `--tl-text-on-brand`, `--tl-text-on-brand-hover`, `--tl-text-on-brand-active` | — |
| `ghost` | wie secondary beim Zeigen und Drücken | `--tl-text-primary` | — |
| `link` | — | `--tl-text-link`, `--tl-text-link-hover` | — |
| `danger` + `primary` | `--tl-status-error-surface`, `--tl-status-error-surface-hover`, `--tl-status-error-surface-active` | `--tl-text-on-status-error`, `--tl-text-on-status-error-hover`, `--tl-text-on-status-error-active` | — |
| `danger` + `secondary` / `ghost` | `--tl-status-error-subtle` beim Zeigen und Drücken | `--tl-status-error-text` | `--tl-status-error-border` (nur secondary) |
| gedrückt (`aria-pressed`) | `--tl-surface-brand-subtle`, `--tl-surface-brand-subtle-hover` | `--tl-text-primary` | `--tl-border-interactive` |
| `disabled` | `--tl-surface-disabled` | `--tl-text-disabled` | `--tl-border-disabled` |

Maße: Höhe `--tl-size-control` (klein `--tl-size-control-sm`), Innenabstand `--tl-space-control-x` (klein `--tl-space-2xs`), Abstand Icon–Text `--tl-space-xs`, Ecke `--tl-radius-sm`. Bewegung: `--tl-duration-fast` mit `--tl-easing-standard`. Icon: Klasse `.tl-icon-sm` neben Text, `.tl-icon-md` allein. Text: Klasse `.tl-type-label`.

## Attribute

| Attribut | Wann |
|---|---|
| `type="button"` | immer — kein Submit. |
| `disabled` | `state.disabled`. Nicht `aria-disabled`: der Button soll wirklich nicht bedienbar sein. |
| `aria-pressed="true"` | `state.active`. Fehlt sonst ganz (nicht `false`), damit ein gewöhnlicher Button kein Umschalter wird. |
| `aria-busy="true"` | während einer laufenden Aktion (Upload). Der Button nimmt keine Zeiger an. |
| `aria-label` | bei icon-only oder wenn ein Icon gesetzt ist: der `label`. |
| `data-tooltip` | `text:<tooltip>`; das Tooltip-System liest es. |
| `:focus-visible` | den Ring liefert `base.css`; die Komponente setzt und entfernt keinen Fokusstil. |

## Konformität

Eine Komponente besteht den Vertrag, wenn sie im Specimen-Harness des Pakets für jeden Zustand
oben das jeweilige Attribut trägt, auf Klick und Enter `click` sendet, bei `hidden` nichts rendert
und im Klassen-Gate keine Klasse ohne `tl-`-Präfix hinterlässt. Der Test dazu folgt mit der
ersten Kundenkomponente; bis dahin gilt dieser Text.
````

- [ ] **Step 4: Test grün, dann Commit**

Run: `cd design-system && node --test`
Expected: alle grün.

```bash
git add -A && git commit -m "Ticket #29617: Button-Vertrag -- Zustand, Aktionen, Tokens, Attribute; Test haelt Vertrag und CSS deckungsgleich

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 6: Worktree — Java-Seite und Einbindung von `components.css`

**Files (alle unter `~/git/tl8-wt-29584/com.top_logic.layout.react/`):**
- Create: `src/main/java/com/top_logic/layout/react/control/button/ButtonTone.java`
- Modify: `src/main/java/com/top_logic/layout/react/control/button/ButtonAppearance.java`
- Modify: `src/main/java/com/top_logic/layout/react/control/button/ButtonSize.java`
- Modify: `src/main/java/com/top_logic/layout/react/control/button/ReactButtonControl.java`
- Modify: `src/main/webapp/WEB-INF/conf/tl-layout-react.conf.config.xml` (Zeilen 62–76)
- Create: `src/test/java/test/com/top_logic/layout/react/control/button/TestReactButtonControl.java`

**Interfaces:**
- Produces: State-Keys `appearance` ∈ {`primary`,`ghost`,`link`} (Default → kein Key), `tone` ∈ {`danger`} (Default → kein Key), `size` ∈ {`small`} (Default → kein Key). Java-API `setAppearance(ButtonAppearance)`, `setTone(ButtonTone)`, `setSize(ButtonSize)`.
- Consumes: `dist/components.css` aus Task 1–3.

- [ ] **Step 1: Branch anlegen und `dist/` veröffentlichen**

```bash
cd ~/git/tl8-wt-29584 && git checkout master && git pull --ff-only origin master && git checkout -b CWS/CWS_29617_design_system_welle_1
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem/design-system && node tools/publish-to-worktree.mjs
```

Expected: vier Zeilen `kopiert: …`, darunter `components.css`.

- [ ] **Step 2: Failing Java-Test**

`src/test/java/test/com/top_logic/layout/react/control/button/TestReactButtonControl.java`. Lies zuerst `src/test/java/test/com/top_logic/layout/react/theme/TestUIThemeService.java`, Zeilen 1–35, und übernimm dessen Kopf (SPDX, Imports, Basisklasse, Setup); dann:

```java
/**
 * Erscheinung, Tönung und Größe eines {@link ReactButtonControl} landen als externe Namen im
 * Zustand — und der Standardwert lässt den Schlüssel weg, damit der Container die Vorgabe macht.
 */
public class TestReactButtonControl extends /* Basisklasse wie TestUIThemeService */ {

	public void testAppearanceDefaultLeavesKeyUnset() {
		ReactButtonControl button = newButton();
		button.setAppearance(ButtonAppearance.DEFAULT);
		assertNull(button.getState().get("appearance"));
		button.setAppearance(ButtonAppearance.GHOST);
		assertEquals("ghost", button.getState().get("appearance"));
	}

	public void testToneDangerIsExternalName() {
		ReactButtonControl button = newButton();
		assertNull(button.getState().get("tone"));
		button.setTone(ButtonTone.DANGER);
		assertEquals("danger", button.getState().get("tone"));
		button.setTone(ButtonTone.DEFAULT);
		assertNull(button.getState().get("tone"));
	}

	public void testSizeKnowsOnlySmall() {
		assertEquals(2, ButtonSize.values().length);
		ReactButtonControl button = newButton();
		button.setSize(ButtonSize.SMALL);
		assertEquals("small", button.getState().get("size"));
	}

	private ReactButtonControl newButton() {
		// Wie ReactButtonControl in ReauthenticationPromptDialogControl.java:90 ff. gebaut wird:
		// grep -n "new ReactButtonControl" ~/git/tl8-wt-29584/com.top_logic.layout.view/src/main/java -r | head -3
		// und den kürzesten Konstruktor übernehmen.
		return /* … */;
	}
}
```

Prüfe mit `grep -n "getState\|putState" src/main/java/com/top_logic/layout/react/control/button/ReactButtonControl.java`, wie der Zustand gelesen wird (`getState()` oder ein Test-Accessor der Basisklasse), und ersetze `button.getState().get(...)` entsprechend. Steht kein Lese-Accessor bereit, füge `ReactButtonControl` ein paketprivates `Object stateForTest(String key)` hinzu — mit Javadoc „nur für Tests“.

- [ ] **Step 3: Test rot**

Run: `cd ~/git/tl8-wt-29584/com.top_logic.layout.react && mvn -q -o test -Dtest=TestReactButtonControl -DfailIfNoTests=false 2>&1 | tail -20`
Expected: Kompilierfehler — `ButtonTone` und `GHOST` existieren nicht.

- [ ] **Step 4: Enums und Control**

`ButtonAppearance.java`: nach `PRIMARY` einfügen

```java
	/** No frame and no fill until pointed at: for toolbars and icon buttons. */
	GHOST("ghost"),
```

`ButtonSize.java`: die Konstante `LARGE` samt Javadoc entfernen. Danach `grep -rn "ButtonSize.LARGE" ~/git/tl8-wt-29584 --include='*.java'` — jeden Treffer löschen (erwartet: keiner).

`ButtonTone.java` neu (Kopf wie `ButtonAppearance.java`):

```java
package com.top_logic.layout.react.control.button;

import com.top_logic.basic.config.ExternallyNamed;

/**
 * Tone of a {@link ReactButtonControl}: whether the action it triggers is destructive.
 *
 * <p>The tone recolors the chosen {@link ButtonAppearance}; it is not an appearance of its own.
 * It is not combined with {@link ButtonAppearance#LINK}.</p>
 */
public enum ButtonTone implements ExternallyNamed {
	/** An ordinary action. */
	DEFAULT("default"),
	/** A destructive action: delete, discard, revoke. */
	DANGER("danger");

	private final String _externalName;

	ButtonTone(String externalName) {
		_externalName = externalName;
	}

	@Override
	public String getExternalName() {
		return _externalName;
	}
}
```

`ReactButtonControl.java`: neben `APPEARANCE` (Zeile 56)

```java
	/** State key for the {@link ButtonTone tone}. */
	private static final String TONE = "tone";
```

neben `setAppearance` (Zeile 281 ff.)

```java
	/**
	 * Sets the button {@link ButtonTone tone}; {@link ButtonTone#DEFAULT} leaves the key unset.
	 */
	public void setTone(ButtonTone tone) {
		putState(TONE, tone == null || tone == ButtonTone.DEFAULT ? null : tone.getExternalName());
	}
```

und in der Menge der Zustandsschlüssel (Zeile 392) `TONE` ergänzen: `java.util.Set.of(APPEARANCE, TONE, SIZE, KEY_GESTURE, IMAGE, DISPLAY_MODE, CSS_CLASSES)`.

- [ ] **Step 5: Stylesheet registrieren**

In `tl-layout-react.conf.config.xml` nach dem Block `tl-design-system-base` (endet Zeile 71) einfügen und `tl-react-base` anpassen:

```xml
					<stylesheet name="tl-design-system-components"
						resource="/style/tl-design-system/components.css"
						requires="tl-design-system-base"
					/>
					<stylesheet name="tl-react-base"
						resource="/style/tlReactBase.css"
						requires="tl-react-fonts-inter,tl-design-system-components"
					/>
```

(Der vorhandene `tl-react-base`-Block wird durch diesen ersetzt; `requires` nennt jetzt `tl-design-system-components` statt `tl-design-system-base`.)

- [ ] **Step 6: Tests grün**

Run: `cd ~/git/tl8-wt-29584/com.top_logic.layout.react && mvn -q -o test -Dtest='TestReactButtonControl,TestUIThemeService' -DfailIfNoTests=false 2>&1 | tail -20`
Expected: `Tests run: 12, Failures: 0, Errors: 0` (3 + 9).

- [ ] **Step 7: Commit im Worktree**

```bash
cd ~/git/tl8-wt-29584 && git add -A && git commit -m "Ticket #29617: Button -- ButtonTone danger, ButtonAppearance ghost, ButtonSize ohne large; components.css als ClientResource

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 7: Worktree — TSX auf die neuen Klassen, Container wählen die Erscheinung

**Files (unter `~/git/tl8-wt-29584/com.top_logic.layout.react/react-src/controls/`):**
- Create: `button/ButtonDefaults.tsx`
- Modify: `TLButton.tsx`, `TLToggleButton.tsx`, `TLUploadButton.tsx`
- Modify: `TLToolbar.tsx` (Zeilen 25–30 Inline-Items, 103–106 Einzel-Item, 159 Dropdown-Item)
- Modify: `TLPanel.tsx` (Button-Leiste `tlPanel__buttonBar`)
- Modify: `TLAppShell.tsx` (Zeilen 30–40), `TLAppBar.tsx` (Zeilen 49–55 `tlAppBar__actions`)
- Modify (Java): `RowCommandColumn.java` (Pfad: `grep -rl "class RowCommandColumn" ~/git/tl8-wt-29584 --include='*.java'`)

**Interfaces:**
- Produces: `ButtonDefaults` mit `{ appearance?: 'primary'|'secondary'|'ghost'|'link'; collapseToIcon?: boolean }`, Hook `useButtonDefaults()`. `AppShellContext` mit `{ compact: boolean }`.
- Consumes: State-Keys aus Task 6, Klassen aus Task 3.

- [ ] **Step 1: Kontext anlegen**

`button/ButtonDefaults.tsx`:

```tsx
import { React } from 'tl-react-bridge';

export type ButtonAppearance = 'primary' | 'secondary' | 'ghost' | 'link';

/**
 * What a container tells the buttons inside it. The server state of a button wins over these
 * defaults; the defaults win over the built-in default (`secondary`).
 *
 * - `appearance`: a toolbar says `ghost`, a dialog's button bar says `secondary`.
 * - `collapseToIcon`: a compact app bar shows labeled buttons that carry an icon as icon-only.
 */
export interface ButtonDefaultsValue {
  appearance?: ButtonAppearance;
  collapseToIcon?: boolean;
}

const Context = React.createContext<ButtonDefaultsValue>({});

export function ButtonDefaults({ children, ...value }: React.PropsWithChildren<ButtonDefaultsValue>) {
  const parent = React.useContext(Context);
  const merged = React.useMemo(() => ({ ...parent, ...value }), [parent, value.appearance, value.collapseToIcon]);
  return <Context.Provider value={merged}>{children}</Context.Provider>;
}

export function useButtonDefaults(): ButtonDefaultsValue {
  return React.useContext(Context);
}

/** The class list of a button: block, appearance, tone, size, typography, passed-through classes. */
export function buttonClassName(opts: {
  appearance: ButtonAppearance; danger?: boolean; small?: boolean; extra?: string;
}): string {
  return ['tl-button', `tl-button--${opts.appearance}`, 'tl-type-label',
    opts.danger && opts.appearance !== 'link' ? 'tl-button--danger' : '',
    opts.small ? 'tl-button--sm' : '',
    opts.extra ?? ''].filter(Boolean).join(' ');
}
```

- [ ] **Step 2: `TLButton.tsx` umstellen**

Import ergänzen: `import { useButtonDefaults, buttonClassName } from './button/ButtonDefaults';` und `import type { ButtonAppearance } from './button/ButtonDefaults';`.

`TLButtonProps` um zwei Props erweitern (für Komposition):

```tsx
  /** Appearance; defaults to state.appearance, then the container's ButtonDefaults, then "secondary". */
  appearance?: ButtonAppearance;
  /** Destructive action; defaults to state.tone === "danger". */
  danger?: boolean;
```

Im Rumpf die Zeilen zu `appearance`, `size`, `resolvedMode` ersetzen durch:

```tsx
  const defaults = useButtonDefaults();
  const resolvedAppearance: ButtonAppearance = appearance
    ?? (state.appearance as ButtonAppearance | undefined)
    ?? defaults.appearance ?? 'secondary';
  const resolvedDanger = danger ?? state.tone === 'danger';
  const requestedMode = displayMode ?? (state.displayMode as string | undefined) ?? 'label-only';
  // A compact app bar collapses labeled buttons that carry an icon to their icon.
  const resolvedMode = defaults.collapseToIcon && resolvedImage ? 'icon-only' : requestedMode;
  const small = state.size === 'small' && resolvedMode === 'icon-only';
```

Das `<button>`-Element:

```tsx
    <button
      type="button"
      id={controlId}
      onClick={handleClick}
      disabled={resolvedDisabled}
      className={buttonClassName({ appearance: resolvedAppearance, danger: resolvedDanger, small, extra: cssClasses })}
      data-tooltip={tooltipAttr}
      aria-pressed={resolvedActive ? true : undefined}
      aria-label={resolvedImage || iconOnly ? resolvedLabel : undefined}
    >
      {resolvedImage && !(resolvedMode === 'label-only') && (
        <ThemeIcon encoded={resolvedImage} className={'tl-button__icon ' + (showLabel ? 'tl-icon-sm' : 'tl-icon-md')} />
      )}
      {showLabel && <span className="tl-button__label">{resolvedLabel}</span>}
    </button>
```

Den Doc-Kommentar der Komponente anpassen: Der Satz „in label-only mode CSS hides it … pure CSS media query“ entfällt; stattdessen: „In `label-only` mode the icon is not rendered. A compact app bar asks for the icon presentation through `ButtonDefaults.collapseToIcon`.“

- [ ] **Step 3: `TLToggleButton.tsx` umstellen**

```tsx
import { buttonClassName, useButtonDefaults } from './button/ButtonDefaults';
// …
  const defaults = useButtonDefaults();
// …
    <button
      type="button"
      id={controlId}
      onClick={handleClick}
      disabled={resolvedDisabled}
      aria-pressed={resolvedActive ? true : undefined}
      className={buttonClassName({ appearance: defaults.appearance ?? 'secondary' })}
    >
      <span className="tl-button__label">{resolvedLabel}</span>
    </button>
```

- [ ] **Step 4: `TLUploadButton.tsx` umstellen**

Die drei Inline-Styles entfallen: der Wrapper `<span style={{ display: 'contents' }}>` wird `<span id={controlId} className="tl-upload" hidden={hidden || undefined}>` — dazu in `button.css` **nicht** eine Regel anlegen; `display: contents` kommt in Welle 2 mit dem Upload-Feld. Bis dahin genügt ein `<span>` (inline, ohne Layoutwirkung). Das `<input type="file">` bekommt `hidden` statt `style={{ display: 'none' }}`. Der Button:

```tsx
  const defaults = useButtonDefaults();
  const resolvedAppearance = (appearance as ButtonAppearance | undefined) ?? defaults.appearance ?? 'secondary';
// …
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        aria-busy={uploading ? true : undefined}
        className={buttonClassName({ appearance: resolvedAppearance, danger: state.tone === 'danger', small: state.size === 'small' && iconOnly })}
        aria-label={iconOnly ? label : undefined}
      >
        {showIcon && image && <ThemeIcon encoded={image} className={'tl-button__icon ' + (showLabel ? 'tl-icon-sm' : 'tl-icon-md')} />}
        {showLabel && <span className="tl-button__label">{label}</span>}
      </button>
```

`isDisabled = disabled || uploading` entfällt: während des Uploads ist der Button `aria-busy` und nimmt per CSS keine Zeiger an, bleibt aber im Tab-Fluss.

- [ ] **Step 5: Container wählen die Erscheinung**

`TLToolbar.tsx`: `import { ButtonDefaults } from './button/ButtonDefaults';`. Die Inline-Gruppe (Zeile 25 ff.) und das Einzel-Item (Zeile 103 ff.) sowie den Dropdown-Inhalt (ab Zeile 152, das Element mit `className="tlToolbar__dropdown"`) jeweils in `<ButtonDefaults appearance="ghost">…</ButtonDefaults>` wickeln — die Toolbar ist rahmenlos, gleich wo sie steht (Fenster-Titelzeile, Panel-Kopf, AppBar).

`TLPanel.tsx`: das Element mit `className="tlPanel__buttonBar"` in `<ButtonDefaults appearance="secondary">…</ButtonDefaults>` wickeln. Die Hauptaktion setzt der Server per `ButtonAppearance.PRIMARY`; sie gewinnt über den Kontext.

`TLAppShell.tsx`: den Kompakt-Zustand zusätzlich als Kontext bereitstellen. Neben `COMPACT_MAX_WIDTH`:

```tsx
export const AppShellContext = React.createContext<{ compact: boolean }>({ compact: false });
```

Im Effekt (Zeile 34 ff.) den Wert in einen `useState` schreiben (`const [compact, setCompact] = React.useState(false);` und in `report` zusätzlich `setCompact(compact)`), und das gerenderte Wurzelelement in `<AppShellContext.Provider value={{ compact }}>` wickeln.

`TLAppBar.tsx`: `import { AppShellContext } from './TLAppShell'; import { ButtonDefaults } from './button/ButtonDefaults';`, dann `const { compact } = React.useContext(AppShellContext);` und das Element `tlAppBar__actions` in `<ButtonDefaults appearance="ghost" collapseToIcon={compact}>…</ButtonDefaults>` wickeln.

- [ ] **Step 6: Zeilenkommandos in Java**

In `RowCommandColumn.java` an der Stelle, die `setDisplayMode(ButtonDisplayMode.ICON_ONLY)` ruft, ergänzen:

```java
		button.setAppearance(ButtonAppearance.GHOST);
		button.setSize(ButtonSize.SMALL);
```

(Variablenname wie dort; Importe ergänzen.)

- [ ] **Step 7: Bauen und im Browser prüfen**

Run: `cd ~/git/tl8-wt-29584/com.top_logic.layout.react && mvn -q -o compile 2>&1 | tail -20`
Expected: kein Fehler; das React-Bundle wird neu erzeugt (Vite-Ausgabe unter `src/main/webapp/script/`).

Dann die Demo-App starten (wie im Team üblich, z. B. aus Eclipse oder `mvn -o -pl com.top_logic.demo jetty:run` — Aufruf vorher mit `grep -n jetty ~/git/tl8-wt-29584/com.top_logic.demo/pom.xml` prüfen) und ansehen: Toolbar-Buttons rahmenlos, Dialogfuß mit Umriss und gefüllter Hauptaktion, Tabellenzeilen-Icons klein und rahmenlos, Fenster schmaler als 768 px: AppBar-Buttons kollabieren zum Icon. `grep -rn "tlReactButton" react-src` muss leer sein.

- [ ] **Step 8: Commit**

```bash
cd ~/git/tl8-wt-29584 && git add -A && git commit -m "Ticket #29617: TLButton, TLToggleButton, TLUploadButton auf tl-button -- Zustaende als Attribute, Container waehlen die Erscheinung ueber ButtonDefaults

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 8: Der alte Block ist leer

**Files:**
- Modify: `~/git/tl8-wt-29584/com.top_logic.layout.react/src/main/webapp/style/tlReactControls.css`
- Modify: `design-system/test/ratchet.json`
- Modify: `docs/migration/altlast.md`, `docs/praesentation.md`, `STATUS.md`

**Interfaces:**
- Consumes: Task 7 (keine `tlReactButton`-Klasse mehr im TSX).

- [ ] **Step 1: Blöcke löschen**

In `tlReactControls.css` — Zeilennummern vor dem Löschen mit `grep -n "TLButton\|tlReactButton" …` neu bestimmen, dann von unten nach oben löschen, damit die oberen Nummern stehen bleiben:

1. `/* --- TLButton enhancements --- */` bis vor `/* --- TLPanel button bar --- */` (heute 5746–5774).
2. `.tlToolbar__dropdown .tlReactButton …` bis vor `.tlToolbar__dropdownSeparator` (heute 5708–5737). Der Kommentar davor („buttons inherit when the toolbar lives inside a dark panel header …“) geht mit.
3. `.tlTableView__cell.tlRowCommandCell .tlReactButton …` alle drei Regeln (heute 3390–3405).
4. `.tlWindow__toolbar .tlReactButton …` alle drei Regeln (heute 2151–2166).
5. `.tlAppBar--primary .tlReactButton …` alle sechs Regeln (heute 1899–1928) **und** im `@media (max-width: 768px)`-Block die drei `.tlAppBar .tlReactButton:has(…)`-Regeln samt Kommentar (heute 1935–1947). Bleibt der Media-Block danach leer, löschen.
6. `/* --- TLButton --- */` bis vor `/* --- TLCounter --- */` (heute 100–271).

Danach: `grep -c "tlReactButton" tlReactControls.css` → `0`.

Für den Dropdown gilt eine Ersatzregel im **Toolbar**-Block (der gehört Welle 3 und darf bis dahin alte Namen tragen): direkt nach der Regel `.tlToolbar__dropdownItem { … }` (Zeile mit `grep -n "tlToolbar__dropdownItem {"` finden) ergänzen

```css
/* Ein Menüeintrag füllt seine Zeile; der Button darin ist ghost und streckt sich. */
.tlToolbar__dropdownItem { display: grid; }
```

nur, falls die vorhandene Regel kein `display` setzt — sonst den vorhandenen Wert auf `grid` ändern.

- [ ] **Step 2: Ratsche nachziehen**

```bash
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem/design-system && node tools/inventory.mjs
```

Trage `lines` und jedes `literals`-Feld aus der Ausgabe in `test/ratchet.json` ein (alle müssen gesunken sein; der Test „das Budget ist nachgezogen“ verlangt es). `foreignTl` unverändert — `--tlPill-color` kommt mit der Pill.

Run: `node --test`
Expected: alle grün, insbesondere „der Altbestand liegt im Budget“.

- [ ] **Step 3: Docs**

`docs/migration/altlast.md`: in „Sichtbare Befunde“ die Button-Zeile (Welle 1, deaktiviert 3,03:1) mit „**erledigt** — `text-disabled` auf `surface-disabled`, geprüft im Kontrasttest der Komponente“ ergänzen. Neuen Abschnitt anhängen:

```markdown
## Welle 1 · Button — fertig

Alter Block (`TLButton`, `TLButton enhancements`) und die fünf Kontextblöcke (AppBar, Fenster-Toolbar, Tabellenzelle, Dropdown, AppBar-Kollaps) sind gelöscht. Der Container wählt die Erscheinung über `ButtonDefaults`; der Dropdown-Eintrag streckt seinen Button per `display: grid` im Toolbar-Block, bis die Toolbar in Welle 3 folgt.
```

`docs/praesentation.md`: Folie 32 um eine Zeile „Umgesetzt: … Zeilen weniger im alten Stylesheet (Zahl aus `inventory.mjs`), Kontrasttest 2 × 17 Paare grün“ ergänzen. `STATUS.md`: „Welle 1: Button fertig; nächste Komponente ToggleButton ist mit dem Button erledigt (nur `aria-pressed`), es folgt Pill“ und Testzahl.

- [ ] **Step 4: Commit beider Repos, Push des Worktrees, PR**

```bash
cd ~/git/tl8-wt-29584 && git add -A && git commit -m "Ticket #29617: Alter Button-Block und fuenf Kontextbloecke geloescht -- tlReactControls.css kennt tlReactButton nicht mehr

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" && git push -u origin CWS/CWS_29617_design_system_welle_1

cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem && git add -A && git commit -m "Ticket #29617: Welle 1 Button fertig -- Ratsche nachgezogen, Altlast und STATUS

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" && git push origin main
```

PR in Gitea (`TopLogic/tl-engine-7`, Base `master`, Titel `Ticket #29617: Design System wave 1 -- button on tl-button, containers choose the appearance`), Body auf Englisch: was der PR ändert (vier Punkte: components.css als Ressource; ButtonTone/ghost/kein large; TSX auf tl-button mit ButtonDefaults; alter Block gelöscht), wie geprüft (TestReactButtonControl 3/3, TestUIThemeService 9/9, Sichtprüfung in Toolbar, Dialogfuß, Tabellenzeile, kompakte AppBar), Abschluss `🤖 Generated with [Claude Code](https://claude.com/claude-code)`. **Reviewer `bhu` (Bernhard Haumacher) eintragen** (`pull_request_write add_reviewers`) und im Trac-Ticket #29617 `cc` auf `bhu` setzen — jedes Framework-Ticket mit PR bezieht ihn ein.

---

## Selbstprüfung gegen Spec und Skalen

- **Rhythmus (Spec 4):** CSS ins Paket → Task 1–3. Klassen im TSX, Zustände auf Attribute, `className` durchreichen → Task 7 (`cssClasses` → `extra`). Specimen → Task 4. Vertrag → Task 5. Gates grün → jede Task. Alter Block gelöscht → Task 8.
- **Skalen „Button“:** vier Erscheinungen, Tönung, keine Größe außer `sm` bei icon-only, Zustände als Attribute, kein Selektor von außen, AppBar keine Markenfläche (ihre Button-Regeln fallen in Task 8; die Fläche selbst folgt in Welle 4).
- **Gates (Spec 5, Komponente):** Specimen zeigt Modifier × Zustände × Modi (Task 4, Test). Vertrag mit Zustand, Aktionen, Tokens, Attributen (Task 5, Test). Alter Block leer (Task 8, Ratsche). `className` durchgereicht (Task 7).
- **Nicht in dieser Welle:** die TSX-Lint-Regel (Spec 5, „TSX“) — eigener Plan nach der ersten Welle, wenn drei Komponenten das Muster zeigen. `--tlPill-color` — Pill.
