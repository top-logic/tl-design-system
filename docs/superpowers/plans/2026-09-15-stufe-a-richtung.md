# Stufe A — Richtung: Umsetzungsplan

> **Für ausführende Agenten:** ERFORDERLICHE SUB-SKILL: `superpowers:subagent-driven-development`
> (empfohlen) oder `superpowers:executing-plans`, um diesen Plan Aufgabe für Aufgabe abzuarbeiten.
> Schritte nutzen Checkbox-Syntax (`- [ ]`) zur Nachverfolgung.

**Ziel:** Ein Specimen, das die echte TopLogic-Oberfläche mit einer Kandidaten-Palette zeigt und
jede Kontrastanforderung live prüft — damit die Stufenzahl jeder Skala entschieden werden kann.

**Architektur:** Das Specimen lädt **das echte `tlReactControls.css`** aus dem Worktree und ersetzt
nur die Token-Werte. Dadurch zeigt es die wirkliche Oberfläche, nicht eine Nachbildung. Die
Kontrastrechnung existiert zweimal — in Java als verbindliches Gate, in JavaScript für die
Live-Anzeige —, und ein Test hält beide auf denselben WCAG-Referenzwerten fest.

**Tech-Stack:** Node 26 (eingebauter Test-Runner `node --test`, keine Abhängigkeiten), reines
HTML/CSS/ES-Module, Java/JUnit 3 auf der Engine-Seite.

**Spec:** `docs/superpowers/specs/2026-09-15-style-overhaul-design.md`

## Global Constraints

- **Keine Fremdpaletten.** Jeder Design-Wert wird von TopLogic definiert. `#0f62fe` scheidet aus —
  das ist exakt IBM Carbon Blue 60.
- **Kein `var(--token, literal)`.** Fehlt ein Token, wird es definiert, nicht umgangen. Einzige
  Ausnahme: eine selbst deklarierte Property mit Default (`var(--cal-ev-bg, #4589ff)`).
- **Token-Namen bleiben** in der bestehenden Carbon-Nomenklatur (`layer-01`, `spacing-01..06`,
  `support-*`). Das ist eine Namenskonvention, keine Palette.
- **Gate-Schwellen:** WCAG 2.1 AA — `4.5` für normalen Text, `3.0` für Icons und Begrenzungen.
- **Commits im Design-System-Repo:** deutsch, Präfix `Ticket #29108: `.
- **Commits in `tl-engine-7`:** englisch, Präfix `Ticket #<nr>: `, Branch `CWS/CWS_<nr>_<text>`,
  Push erst nach Ticketstatus `accepted`.
- **Referenzwerte der Kontrastrechnung**, in beiden Implementierungen identisch:
  `#FFFFFF`/`#000000` = 21.0 · gleiche Farbe = 1.0 · `#767676`/`#FFFFFF` = 4.5422 ·
  `#808080`/`#FFFFFF` = 3.9494 · `#FFFFFF`/`#2968C8` = 5.3730

---

## Dateistruktur

Alles Neue liegt im Design-System-Repo unter `specimen/`, außer Aufgabe 8.

| Datei | Verantwortung |
|---|---|
| `specimen/contrast.mjs` | Relativluminanz und Kontrastverhältnis. Kennt keine Tokens. |
| `specimen/requirements.mjs` | Die Paarliste und der Report. Kennt keine Farbmathematik. |
| `specimen/tokens.json` | Die Kandidaten-Palette, beide Modi. Einzige Wertquelle. |
| `specimen/serve.mjs` | Statischer Server; bildet `/style/` auf den Worktree ab. |
| `specimen/markup/*.html` | Aus der Demo-App entnommene Fragmente echter Oberfläche. |
| `specimen/index.html` | Die Specimen-Seite. |
| `specimen/specimen.mjs` | Trägt `tokens.json` in die Seite ein und zeichnet das Gate-Panel. |
| `specimen/*.test.mjs` | Tests, `node --test`. |
| `specimen/README.md` | Wie man es startet, was es beweist, was es nicht beweist. |

Die Trennung zwischen `contrast.mjs` und `requirements.mjs` ist Absicht: Die Farbmathematik ist
allgemein und testbar ohne Tokens; die Paarliste ist eine Designaussage und ändert sich oft.

---

## Aufgabe 0: Bestand aufräumen

Das Spec hat entschieden, was mit der laufenden Arbeit passiert. Diese Aufgabe führt es aus,
bevor Neues entsteht.

**Files:**
- Modify: Branch `CWS/CWS_29584_dark_theme_contrast` in `~/git/tl8-wt-29584`
- Modify: Trac #29584
- Modify: Gitea `hpe/tl-design-system` Issues #2–#10
- Move: `plan.md` → `archive/plan-v2-vor-overhaul.md`

- [ ] **Schritt 1: Die beiden Wertecommits vom Branch nehmen**

Commit 1 (`21598dc7d`, das Gate) bleibt, die Commits `a14a22bf4` und `4b24d1a2a` fallen.

```bash
cd ~/git/tl8-wt-29584
git log --oneline -3
git reset --hard 21598dc7d
git log --oneline -1   # muss 21598dc7d zeigen
```

- [ ] **Schritt 2: Prüfen, dass das Gate weiterhin rot ist und alle acht Paare meldet**

```bash
cd ~/git/tl8-wt-29584
mvn -B test -pl com.top_logic.layout.react -DskipTests=false \
  -Dtest=test.com.top_logic.layout.react.theme.TestReactThemeContrast 2>&1 \
  | grep -oE "^(default|dark): '[a-z-]+' \([^)]*\) on '[a-z-]+'" | sort -u | wc -l
```

Erwartet: `8`. Ein schlichtes `grep -c "reaches"` zählt doppelt — JUnit gibt jede Meldung
einmal im Text und einmal im `assertEquals`-Vergleich aus.

- [ ] **Schritt 3: Trac #29584 umschreiben**

Zusammenfassung auf `React-Theme: Ein Kontrast-Gate für die Theme-Tokens, WCAG 2.1 AA, jedes Theme`
ändern. Kommentar ergänzen, der festhält: Die acht Befunde bleiben dokumentiert, ihre Behebung
entfällt, weil die Palette im Style Overhaul ersetzt wird. Das Gate bleibt und wird zur Abnahme
der neuen Palette.

- [ ] **Schritt 4: Gitea-Issues #2–#10 auf die neue Struktur umschreiben**

Abbildung:

| Issue | Neu |
|---|---|
| #2 | B1 — Fokusring und Z-Ebenen |
| #3 | Stufe A — Richtung |
| #4 | B2 — Typografie |
| #5 | B4 — Abstände |
| #6 | B5 — Rahmen, Komponenten-Tokens, Dichte |
| #7 | C — Export und Figma |
| #8 | B3 — Motion |
| #9 | B6 — Farbe und TSX-Lint |
| #10 | B7 — `@layer` (Spike zuerst) |

- [ ] **Schritt 5: Die zwei offenen PRs zum Merge bringen**

Das Spec hat entschieden, dass beide vor Stufe A gemergt werden — !1621 führt die
Marken-Primitives ein, auf denen B6 aufsetzt.

```bash
cd ~/git/tl8-wt-29584
git fetch origin master
git log --oneline origin/master -3
```

Erwartet nach dem Merge: beide Commits sind auf `origin/master`. Sind sie es nicht, beim
Reviewer nachfassen — der Merge liegt nicht in unserer Hand. Stufe A kann ohne sie beginnen;
**B6 nicht**.

- [ ] **Schritt 6: `plan.md` archivieren**

```bash
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem
git mv plan.md archive/plan-v2-vor-overhaul.md
```

In `archive/README.md` eine Zeile ergänzen, warum: *„Reparierte die vorhandene Palette. Abgelöst
durch den Style Overhaul, siehe `docs/superpowers/specs/2026-09-15-style-overhaul-design.md`."*

- [ ] **Schritt 7: Commit**

```bash
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem
git add -A
git commit -m "Ticket #29108: Bestand auf den Style Overhaul umgestellt"
```

---

## Aufgabe 1: Kontrastrechnung in JavaScript

**Files:**
- Create: `specimen/contrast.mjs`
- Test: `specimen/contrast.test.mjs`

**Interfaces:**
- Consumes: nichts
- Produces:
  - `AA_TEXT = 4.5`, `AA_NON_TEXT = 3`
  - `color(cssValue: string) -> {r: number, g: number, b: number}`
  - `ratio(foreground: string, background: string) -> number` — beide Argumente Hex-Strings

- [ ] **Schritt 1: Den fehlschlagenden Test schreiben**

`specimen/contrast.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ratio, color, AA_TEXT, AA_NON_TEXT } from './contrast.mjs';

const nah = (ist, soll) => assert.ok(Math.abs(ist - soll) < 0.005,
  `${ist} weicht von ${soll} ab`);

test('Schwarz auf Weiß ist der größte Kontrast, den WCAG kennt', () => {
  nah(ratio('#FFFFFF', '#000000'), 21.0);
});

test('Eine Farbe auf sich selbst ist der kleinste', () => {
  nah(ratio('#FFFFFF', '#FFFFFF'), 1.0);
});

test('Die Reihenfolge der Farben ändert das Ergebnis nicht', () => {
  nah(ratio('#FFFFFF', '#2968C8'), 5.3730);
  nah(ratio('#2968C8', '#FFFFFF'), 5.3730);
});

test('Das Grau, das AA für normalen Text auf Weiß gerade zulässt', () => {
  nah(ratio('#767676', '#FFFFFF'), 4.5422);
});

test('Die Luminanz rechnet auf linearisierten Kanälen', () => {
  // Ein lineares (r+g+b)/3 käme hier auf einen anderen Wert.
  nah(ratio('#808080', '#FFFFFF'), 3.9494);
});

test('Ein Hexwert wird in seine Kanäle gelesen, kurz wie lang', () => {
  assert.deepEqual(color('#2968c8'), { r: 0x29, g: 0x68, b: 0xc8 });
  assert.deepEqual(color('#abc'), { r: 0xaa, g: 0xbb, b: 0xcc });
});

test('Die Schwellen sind die von WCAG 2.1 AA', () => {
  assert.equal(AA_TEXT, 4.5);
  assert.equal(AA_NON_TEXT, 3);
});
```

- [ ] **Schritt 2: Test laufen lassen, Fehlschlag bestätigen**

```bash
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem/specimen
node --test contrast.test.mjs
```

Erwartet: Fehler `Cannot find module './contrast.mjs'`.

- [ ] **Schritt 3: Die minimale Implementierung schreiben**

`specimen/contrast.mjs`:

```js
/** Die Schwelle, die WCAG 2.1 AA für normalen Text verlangt. */
export const AA_TEXT = 4.5;

/** Die Schwelle für große Schrift, Icons und die Begrenzung eines Controls. */
export const AA_NON_TEXT = 3;

const KANAL_GEWICHT = { r: 0.2126, g: 0.7152, b: 0.0722 };
const LINEAR_GRENZE = 0.03928;
const LINEAR_STEIGUNG = 12.92;
const GAMMA_VERSATZ = 0.055;
const GAMMA_EXPONENT = 2.4;

/** Hebt beide Luminanzen von der Null weg, damit das Verhältnis endlich bleibt. */
const STREULICHT = 0.05;

/**
 * Die Farbe, die ein CSS-Hexwert benennt.
 *
 * Nimmt die Schreibweisen `#rgb`, `#rrggbb` und `#rrggbbaa`; der Alphakanal wird für die
 * Kontrastrechnung verworfen, weil WCAG über der tatsächlich gezeichneten Farbe rechnet.
 */
export function color(cssValue) {
  const ziffern = cssValue.trim().replace(/^#/, '');
  if (ziffern.length === 3) {
    const [r, g, b] = [...ziffern].map((z) => parseInt(z + z, 16));
    return { r, g, b };
  }
  if (ziffern.length === 6 || ziffern.length === 8) {
    return {
      r: parseInt(ziffern.slice(0, 2), 16),
      g: parseInt(ziffern.slice(2, 4), 16),
      b: parseInt(ziffern.slice(4, 6), 16),
    };
  }
  throw new Error(`Kein Hexwert: '${cssValue}'`);
}

function linear(kanal) {
  const wert = kanal / 255;
  return wert <= LINEAR_GRENZE
    ? wert / LINEAR_STEIGUNG
    : ((wert + GAMMA_VERSATZ) / (1 + GAMMA_VERSATZ)) ** GAMMA_EXPONENT;
}

function luminanz(hex) {
  const { r, g, b } = color(hex);
  return KANAL_GEWICHT.r * linear(r) + KANAL_GEWICHT.g * linear(g) + KANAL_GEWICHT.b * linear(b);
}

/**
 * Das Kontrastverhältnis der beiden Farben, zwischen 1 und 21.
 *
 * Welche der beiden der Vordergrund ist, ändert das Ergebnis nicht.
 */
export function ratio(foreground, background) {
  const eine = luminanz(foreground);
  const andere = luminanz(background);
  const heller = Math.max(eine, andere);
  const dunkler = Math.min(eine, andere);
  return (heller + STREULICHT) / (dunkler + STREULICHT);
}
```

- [ ] **Schritt 4: Test laufen lassen, Erfolg bestätigen**

```bash
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem/specimen
node --test contrast.test.mjs
```

Erwartet: `# pass 7`, `# fail 0`.

- [ ] **Schritt 5: Commit**

```bash
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem
git add specimen/contrast.mjs specimen/contrast.test.mjs
git commit -m "Ticket #29108: Kontrastrechnung fuer das Specimen, gegen die WCAG-Referenzwerte"
```

---

## Aufgabe 2: Anforderungsliste und Report

**Files:**
- Create: `specimen/requirements.mjs`
- Test: `specimen/requirements.test.mjs`

**Interfaces:**
- Consumes: `ratio`, `AA_TEXT`, `AA_NON_TEXT` aus `contrast.mjs`
- Produces:
  - `text(foreground: string, background: string) -> Requirement`
  - `nonText(foreground: string, background: string) -> Requirement`
  - `REQUIREMENTS: Requirement[]` — 22 Paare
  - `report(themeId: string, tokens: Record<string,string>, requirements: Requirement[]) -> string[]`
  - `Requirement = { foreground: string, background: string, minimum: number }`

Die Paarliste ist identisch mit der in
`com.top_logic.layout.react/src/test/java/test/com/top_logic/layout/react/theme/TestReactThemeContrast.java`.

- [ ] **Schritt 1: Den fehlschlagenden Test schreiben**

`specimen/requirements.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { text, nonText, report, REQUIREMENTS } from './requirements.mjs';

test('Ein Paar unter seiner Schwelle wird gemeldet, mit beiden Werten und dem Verhältnis', () => {
  const problems = report('dark',
    { 'text-on-color': '#ffffff', 'button-primary': '#5b9bf0' },
    [text('text-on-color', 'button-primary')]);

  assert.equal(problems.length, 1);
  assert.match(problems[0], /dark/);
  assert.match(problems[0], /text-on-color/);
  assert.match(problems[0], /#5b9bf0/);
  assert.match(problems[0], /2\.84/);
});

test('Ein Paar, das seine Schwelle hält, wird nicht gemeldet', () => {
  const problems = report('default',
    { 'text-primary': '#101113', background: '#ffffff' },
    [text('text-primary', 'background')]);

  assert.deepEqual(problems, []);
});

test('Ein Token, das es nicht gibt, ist ein Fehler und kein stilles Überspringen', () => {
  const problems = report('default', { background: '#ffffff' },
    [text('gibt-es-nicht', 'background')]);

  assert.equal(problems.length, 1);
  assert.match(problems[0], /gibt-es-nicht/);
});

test('Text schuldet 4,5, ein Icon oder eine Begrenzung 3', () => {
  assert.equal(text('a', 'b').minimum, 4.5);
  assert.equal(nonText('a', 'b').minimum, 3);
});

test('Die Paarliste deckt Text, Fläche, Zustand, Links und Begrenzungen ab', () => {
  assert.equal(REQUIREMENTS.length, 22);
  const paare = REQUIREMENTS.map((r) => `${r.foreground}|${r.background}`);
  assert.ok(paare.includes('text-on-color|button-primary'));
  assert.ok(paare.includes('text-inverse|background-inverse'));
  assert.ok(paare.includes('text-placeholder|field'));
  assert.ok(paare.includes('focus|background'));
});
```

- [ ] **Schritt 2: Test laufen lassen, Fehlschlag bestätigen**

```bash
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem/specimen
node --test requirements.test.mjs
```

Erwartet: `Cannot find module './requirements.mjs'`.

- [ ] **Schritt 3: Die Implementierung schreiben**

`specimen/requirements.mjs`:

```js
import { ratio, AA_TEXT, AA_NON_TEXT } from './contrast.mjs';

/** Eine Anforderung an normalen Text auf seinem Grund. */
export const text = (foreground, background) => ({ foreground, background, minimum: AA_TEXT });

/** Eine Anforderung an ein Icon oder die Begrenzung eines Controls. */
export const nonText = (foreground, background) => ({ foreground, background, minimum: AA_NON_TEXT });

/**
 * Die Paare, die Bedeutung tragen, und das Verhältnis, das jedes schuldet.
 *
 * Deckungsgleich mit TestReactThemeContrast.REQUIREMENTS in tl-engine-7. Ein deaktiviertes
 * Control ist von WCAG ausgenommen und fehlt deshalb.
 */
export const REQUIREMENTS = [
  // Fließtext auf den Flächen, auf denen er steht.
  text('text-primary', 'background'),
  text('text-primary', 'layer-01'),
  text('text-primary', 'layer-02'),
  text('text-secondary', 'background'),
  text('text-secondary', 'layer-01'),
  text('text-helper', 'background'),
  text('text-placeholder', 'field'),

  // Beschriftung auf einer gefüllten Fläche.
  text('text-on-color', 'button-primary'),
  text('text-on-color', 'button-primary-hover'),
  text('text-on-color', 'button-primary-active'),
  text('text-on-color', 'button-danger'),
  text('text-on-color', 'button-danger-hover'),
  text('layer-accent-text', 'layer-accent'),

  // Text, der einen Zustand trägt, und die invertierte Fläche.
  text('text-error', 'background'),
  text('text-inverse', 'background-inverse'),

  // Links.
  text('link-primary', 'background'),
  text('link-primary-hover', 'background'),

  // Icons und Begrenzungen, die zeigen, wo ein Control ist.
  nonText('icon-on-color', 'button-primary'),
  nonText('icon-primary', 'background'),
  nonText('border-interactive', 'background'),
  nonText('border-strong', 'background'),
  nonText('focus', 'background'),
];

/**
 * Meldet jede Anforderung, die das gegebene Theme verfehlt.
 *
 * Eine Anforderung, die ein Token benennt, das es nicht gibt, ist ein Fehler für sich — ein still
 * übersprungenes Paar wäre ein Gate, das aufhört zu wachen, sobald jemand ein Token umbenennt.
 */
export function report(themeId, tokens, requirements) {
  const problems = [];
  for (const { foreground, background, minimum } of requirements) {
    const vorne = tokens[foreground];
    const hinten = tokens[background];
    if (vorne === undefined || hinten === undefined) {
      const fehlt = vorne === undefined ? foreground : background;
      problems.push(`${themeId}: kein Token '${fehlt}', benannt von '${foreground}' auf '${background}'.`);
      continue;
    }
    const ist = ratio(vorne, hinten);
    if (ist < minimum) {
      problems.push(
        `${themeId}: '${foreground}' (${vorne}) auf '${background}' (${hinten}) erreicht `
        + `${ist.toFixed(2)}, unter den ${minimum.toFixed(1)}, die WCAG 2.1 AA verlangt.`);
    }
  }
  return problems;
}
```

- [ ] **Schritt 4: Test laufen lassen, Erfolg bestätigen**

```bash
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem/specimen
node --test requirements.test.mjs
```

Erwartet: `# pass 5`, `# fail 0`.

- [ ] **Schritt 5: Commit**

```bash
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem
git add specimen/requirements.mjs specimen/requirements.test.mjs
git commit -m "Ticket #29108: Paarliste und Report, deckungsgleich mit dem Java-Gate"
```

---

## Aufgabe 3: Die Kandidaten-Palette als Datei

Die Palette startet mit den **heutigen** Werten. Damit ist der erste Lauf rot auf genau den acht
bekannten Paaren — und das beweist, dass die JS-Seite dasselbe rechnet wie die Java-Seite.

**Files:**
- Create: `specimen/tokens.json`
- Test: `specimen/tokens.test.mjs`

**Interfaces:**
- Consumes: `report`, `REQUIREMENTS` aus `requirements.mjs`
- Produces: `tokens.json` mit der Form `{ "light": { "<token>": "#rrggbb" }, "dark": { … } }` —
  jeder Modus deklariert **jedes** Token vollständig, keine Vererbung.

- [ ] **Schritt 1: Den fehlschlagenden Test schreiben**

`specimen/tokens.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { report, REQUIREMENTS } from './requirements.mjs';

const tokens = JSON.parse(readFileSync(new URL('./tokens.json', import.meta.url)));

test('Beide Modi deklarieren denselben Satz Tokens, keiner erbt', () => {
  const hell = Object.keys(tokens.light).sort();
  const dunkel = Object.keys(tokens.dark).sort();
  assert.deepEqual(dunkel, hell);
});

test('Jede Anforderung findet ihre Tokens in beiden Modi', () => {
  for (const modus of ['light', 'dark']) {
    const fehlend = report(modus, tokens[modus], REQUIREMENTS).filter((p) => p.includes('kein Token'));
    assert.deepEqual(fehlend, [], `${modus}: ${fehlend.join('\n')}`);
  }
});

test('Der Ausgangsstand ist auf genau den acht bekannten Paaren rot', () => {
  const probleme = [...report('light', tokens.light, REQUIREMENTS),
                    ...report('dark', tokens.dark, REQUIREMENTS)];
  assert.equal(probleme.length, 8, probleme.join('\n'));
});
```

- [ ] **Schritt 2: Test laufen lassen, Fehlschlag bestätigen**

```bash
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem/specimen
node --test tokens.test.mjs
```

Erwartet: `ENOENT` für `tokens.json`.

- [ ] **Schritt 3: `tokens.json` aus dem laufenden Theme erzeugen**

Die Werte kommen aus der Theme-Konfiguration des Worktrees, damit kein Wert abgetippt wird:

```bash
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem/specimen
python3 - <<'PY'
import json, xml.etree.ElementTree as ET, pathlib
quelle = pathlib.Path.home() / "git/tl8-wt-29584/com.top_logic.layout.react/src/main/webapp/WEB-INF/conf/tl-react-theme.config.xml"
wurzel = ET.parse(quelle).getroot()
themes = {}
for theme in wurzel.iter():
    if theme.tag == 'theme':
        themes[theme.get('name')] = {c.get('name'): c.get('value')
                                     for c in theme.iter() if c.tag == 'color'}
hell = themes['default']
dunkel = dict(hell) | themes['dark']          # dark erbt heute; hier wird vollständig ausgeschrieben
pathlib.Path('tokens.json').write_text(
    json.dumps({'light': dict(sorted(hell.items())),
                'dark': dict(sorted(dunkel.items()))}, indent=2, ensure_ascii=False) + '\n')
print(f"{len(hell)} Tokens je Modus")
PY
```

Erwartet: `51 Tokens je Modus`.

- [ ] **Schritt 4: Test laufen lassen, Erfolg bestätigen**

```bash
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem/specimen
node --test tokens.test.mjs
```

Erwartet: `# pass 3`, `# fail 0`. Schlägt der dritte Test mit einer anderen Zahl als 8 fehl,
rechnen JS und Java **nicht** dasselbe — dann zuerst das klären, nicht die Zahl anpassen.

- [ ] **Schritt 5: Commit**

```bash
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem
git add specimen/tokens.json specimen/tokens.test.mjs
git commit -m "Ticket #29108: Kandidaten-Palette, Ausgangsstand mit den acht bekannten Verstoessen"
```

---

## Aufgabe 4: Server und echte Oberflächenfragmente

**Files:**
- Create: `specimen/serve.mjs`
- Create: `specimen/markup/table.html`, `specimen/markup/form.html`, `specimen/markup/buttons.html`
- Create: `specimen/README.md`

**Interfaces:**
- Consumes: nichts
- Produces: HTTP-Server auf Port 8137; `/` liefert `specimen/`, `/style/*` liefert das
  Stylesheet-Verzeichnis des Worktrees. Worktree-Pfad über `TL_WORKTREE`, Vorgabe
  `~/git/tl8-wt-29584`.

- [ ] **Schritt 1: Den Server schreiben**

`specimen/serve.mjs`:

```js
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { homedir } from 'node:os';

const PORT = 8137;
const WORKTREE = process.env.TL_WORKTREE ?? join(homedir(), 'git/tl8-wt-29584');
const STYLE = join(WORKTREE, 'com.top_logic.layout.react/src/main/webapp/style');
const HIER = new URL('.', import.meta.url).pathname;

const TYPEN = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8' };

createServer(async (anfrage, antwort) => {
  const pfad = normalize(decodeURIComponent(new URL(anfrage.url, 'http://x').pathname));
  const datei = pfad.startsWith('/style/')
    ? join(STYLE, pfad.slice('/style/'.length))
    : join(HIER, pfad === '/' ? 'index.html' : pfad);
  try {
    const inhalt = await readFile(datei);
    antwort.writeHead(200, { 'content-type': TYPEN[extname(datei)] ?? 'application/octet-stream' });
    antwort.end(inhalt);
  } catch {
    antwort.writeHead(404).end(`Nicht gefunden: ${pfad}`);
  }
}).listen(PORT, () => {
  console.log(`Specimen: http://localhost:${PORT}/`);
  console.log(`Stylesheets aus: ${STYLE}`);
});
```

- [ ] **Schritt 2: Prüfen, dass das echte Stylesheet ausgeliefert wird**

```bash
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem/specimen
node serve.mjs &
sleep 1
curl -s -o /dev/null -w "%{http_code} %{size_download}\n" http://localhost:8137/style/tlReactControls.css
kill %1
```

Erwartet: `200` und eine Größe über 100000 — das ist die echte Datei, keine Kopie.

- [ ] **Schritt 3: Echte Fragmente aus der Demo-App entnehmen**

Demo-App starten (siehe `docs/eclipse-workspace.md`), im Browser öffnen und für jede der drei
Ansichten das äußere HTML des Hauptbereichs entnehmen:

| Datei | Woher |
|---|---|
| `markup/table.html` | `Attribute ▸ Tabelle`, die Tabelle samt Kopfzeile und Filterleiste |
| `markup/form.html` | `Attribute ▸ Auswahl + Formular ▸ Neu`, der Dialoginhalt |
| `markup/buttons.html` | Die Werkzeugleiste derselben Ansicht |

Die Fragmente werden **nicht** von Hand geschrieben. Sie sind Abzüge der wirklichen Oberfläche;
nur `id`-Attribute und Inline-`style` werden entfernt, damit sie ohne Server laufen.

**Das ist zugleich die harte Grenze von Stufe A.** Sobald jemand im Specimen ein Fragment
*verbessert* — eine schönere Tabelle, eine andere Anordnung —, ist die Stufe aus dem Ruder
gelaufen: Sie zeigt Tokens auf vorhandenen Controls, nicht neue Controls. Ein geändertes Fragment
ist im Review ein Ablehnungsgrund.

- [ ] **Schritt 4: `README.md` schreiben**

Inhalt: Start (`node serve.mjs`), was das Specimen beweist (Token-Werte auf echtem CSS und echtem
Markup), was es **nicht** beweist (kein SSE, keine Interaktion, keine Zustände, die der Server
setzt), und der Hinweis, dass der Sieger vor Stufe B einmal in der Demo-App gegengeprüft wird.

- [ ] **Schritt 5: Commit**

```bash
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem
git add specimen/serve.mjs specimen/markup specimen/README.md
git commit -m "Ticket #29108: Specimen-Server auf dem echten Stylesheet, Fragmente aus der Demo-App"
```

---

## Aufgabe 5: Die Specimen-Seite mit Live-Gate

**Files:**
- Create: `specimen/index.html`
- Create: `specimen/specimen.mjs`

**Interfaces:**
- Consumes: `report`, `REQUIREMENTS` aus `requirements.mjs`; `tokens.json`
- Produces: keine — Endpunkt für den Menschen

- [ ] **Schritt 1: Die Seite schreiben**

`specimen/index.html`:

```html
<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<title>TopLogic Specimen</title>
<link rel="stylesheet" href="/style/tlReactBase.css">
<link rel="stylesheet" href="/style/tlReactControls.css">
<style>
  body { margin: 0; font-family: system-ui, sans-serif; }
  .specimenKopf { display: flex; gap: 1rem; align-items: center; padding: .75rem 1rem;
                  border-bottom: 1px solid #8884; position: sticky; top: 0; background: Canvas; }
  .specimenBuehne { padding: 1.5rem; }
  .specimenGate { font: 12px/1.5 ui-monospace, monospace; padding: 1rem;
                  border-top: 1px solid #8884; white-space: pre-wrap; }
  .specimenGate--gruen { color: #0a7; }
  .specimenGate--rot { color: #c33; }
</style>
</head>
<body>
  <header class="specimenKopf">
    <strong>Specimen</strong>
    <label>Modus
      <select id="modus"><option value="light">hell</option><option value="dark">dunkel</option></select>
    </label>
    <span id="gateKurz"></span>
  </header>
  <main class="specimenBuehne" id="buehne"></main>
  <section class="specimenGate" id="gate"></section>
  <script type="module" src="./specimen.mjs"></script>
</body>
</html>
```

- [ ] **Schritt 2: Das Skript schreiben**

`specimen/specimen.mjs`:

```js
import { report, REQUIREMENTS } from './requirements.mjs';

const tokens = await fetch('./tokens.json').then((a) => a.json());
const fragmente = await Promise.all(
  ['buttons', 'form', 'table'].map((n) => fetch(`./markup/${n}.html`).then((a) => a.text())));

document.getElementById('buehne').innerHTML = fragmente.join('\n<hr>\n');

/** Trägt die Tokens eines Modus als Custom Properties auf das Wurzelelement. */
function anwenden(modus) {
  const wurzel = document.documentElement;
  for (const [name, wert] of Object.entries(tokens[modus])) {
    wurzel.style.setProperty(`--${name}`, wert);
  }
  wurzel.dataset.theme = modus;

  const probleme = report(modus, tokens[modus], REQUIREMENTS);
  const gate = document.getElementById('gate');
  gate.textContent = probleme.length === 0
    ? `Gate grün — ${REQUIREMENTS.length} Paare geprüft.`
    : probleme.join('\n');
  gate.className = `specimenGate specimenGate--${probleme.length === 0 ? 'gruen' : 'rot'}`;
  document.getElementById('gateKurz').textContent =
    `${REQUIREMENTS.length - probleme.length}/${REQUIREMENTS.length} Paare halten AA`;
}

document.getElementById('modus').addEventListener('change', (e) => anwenden(e.target.value));
anwenden('light');
```

- [ ] **Schritt 3: Im Browser prüfen**

```bash
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem/specimen
node serve.mjs
```

`http://localhost:8137/` öffnen. Erwartet:
- Die Fragmente sehen aus wie die Demo-App
- Umschalten auf „dunkel" ändert die Oberfläche
- Das Gate-Panel meldet im hellen Modus **1** Verstoß, im dunklen **7**

- [ ] **Schritt 4: Commit**

```bash
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem
git add specimen/index.html specimen/specimen.mjs
git commit -m "Ticket #29108: Specimen-Seite mit Live-Kontrastanzeige"
```

---

## Aufgabe 6: Die Typo-Probe an echter Dichte

Dies ist eine **Entscheidungsaufgabe**, keine Implementierungsaufgabe. Sie hat keinen Test, sondern
ein Abnahmekriterium.

**Files:**
- Create: `specimen/markup/typo.html`
- Modify: `specimen/tokens.json` (Typo-Tokens)

- [ ] **Schritt 1: Die Probe bauen**

`markup/typo.html` zeigt dieselbe echte Tabelle aus `markup/table.html` dreimal untereinander, mit
12, 13 und 14 px Grundschrift, in jeder Schriftkandidatin. Mindestens 20 Zeilen, echte
TopLogic-Inhalte: lange deutsche Komposita, Zahlenspalten rechtsbündig, Datumsangaben.

- [ ] **Schritt 2: Kandidatinnen eintragen**

Mindestens drei, darunter das heutige `'Inter'`. Jede über `font-family` als Token, nicht als
Inline-Stil.

- [ ] **Schritt 3: Entscheiden**

**Abnahmekriterien:**
1. Ziffern sind bei 12 px in einer Zahlenspalte auf Anhieb unterscheidbar — besonders `1`/`7` und `0`/`O`
2. Ein 40 Zeichen langes deutsches Kompositum bricht nicht die Spaltenbreite
3. Die Skala hat eine feste Schrittweite, und jede Stufe hat einen benannten Zweck
4. Gewichte: die Zahl steht fest und jede Stufe hat eine Regel, wann sie gilt

Die heutigen Daten geben die Richtung vor: 44 Literale verteilen sich auf `600`×31, `bold`×6,
`normal`×4, `400`×2, `700`×1 — also **zwei Gewichte und ein Ausreißer**.

- [ ] **Schritt 4: Commit**

```bash
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem
git add specimen/markup/typo.html specimen/tokens.json
git commit -m "Ticket #29108: Typo-Probe an echter Tabellendichte, Schrift entschieden"
```

---

## Aufgabe 7: Die Skalen entscheiden und festhalten

Ebenfalls eine Entscheidungsaufgabe. Ihr Ergebnis dimensioniert Stufe B.

**Files:**
- Create: `docs/skalen.md`
- Modify: `specimen/tokens.json`

- [ ] **Schritt 1: Die zwei strukturellen Fragen beantworten**

1. **Elevation:** bleibt „Schatten", oder wird „Fläche plus Schatten", wobei im Dunkeln die Fläche trägt?
2. **Dark:** Ableitung durch Überschreiben, oder zwei vollständige Paletten?

Empfehlung des Specs zu beiden: Fläche plus Schatten, zwei vollständige Paletten.

- [ ] **Schritt 2: Für jede Skala Stufenzahl und Regel festlegen**

Elf Skalen: Marke, Neutrale, Semantik, Typo-Größen, Typo-Gewichte, Radius, Elevation, Rahmen,
Fokus, Motion, Dichte.

- [ ] **Schritt 3: `docs/skalen.md` schreiben**

Je Skala ein Abschnitt im Stil der bestehenden FAQ: eine Tabelle mit Stufe, Token, Wert,
Anwendungsbereich — und **ein Satz**, der die Regel benennt, wann welche Stufe gilt. Das Vorbild
steht in `docs/faq/react-theme-tokens.md` bei Radius und Elevation.

**Abnahmekriterium:** Für jede der elf Skalen lässt sich die Regel in einem Satz sagen. Geht das
nicht, ist die Skala noch nicht entschieden.

- [ ] **Schritt 4: Gate grün rechnen**

```bash
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem/specimen
node --test tokens.test.mjs
```

Der dritte Test erwartet 8 Verstöße — das ist der **Ausgangsstand**. Er wird jetzt auf `0` geändert,
und zwar erst, wenn die Palette tatsächlich grün ist:

```js
test('Die neue Palette hält AA in beiden Modi', () => {
  const probleme = [...report('light', tokens.light, REQUIREMENTS),
                    ...report('dark', tokens.dark, REQUIREMENTS)];
  assert.deepEqual(probleme, []);
});
```

- [ ] **Schritt 5: Commit**

```bash
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem
git add docs/skalen.md specimen/tokens.json specimen/tokens.test.mjs
git commit -m "Ticket #29108: Elf Skalen entschieden, Kandidaten-Palette haelt AA"
```

---

## Aufgabe 8: Gegenprobe in der Demo-App

Ein Specimen kann lügen. Bevor Stufe B beginnt, läuft die Palette einmal in der echten Anwendung.

**Files:**
- Modify: `~/git/tl8-wt-29584/com.top_logic.layout.react/src/main/webapp/WEB-INF/conf/tl-react-theme.config.xml`
- Modify: `~/git/tl8-wt-29584/…/test/…/theme/TestReactThemeContrast.java` (nur falls Tokens hinzukommen)

**Interfaces:**
- Consumes: `specimen/tokens.json`
- Produces: ein Theme `kandidat` in der Theme-Konfiguration; wird in Stufe C zum neuen `default`

- [ ] **Schritt 1: Die Palette als zusätzliches Theme eintragen**

Als eigenes Theme `kandidat`, **nicht** als Ersatz für `default` — damit die Gegenprobe den
Bestand nicht bricht und ein Vergleich per Umschalten möglich ist.

```bash
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem/specimen
python3 - <<'PY'
import json, pathlib
tokens = json.loads(pathlib.Path('tokens.json').read_text())
for modus, name in (('light', 'kandidat'), ('dark', 'kandidat-dark')):
    zeilen = '\n'.join(f'\t\t\t\t\t<color name="{k}" value="{v}"/>'
                       for k, v in sorted(tokens[modus].items()))
    print(f'<theme name="{name}">\n{zeilen}\n</theme>\n')
PY
```

Die Ausgabe in die Theme-Konfiguration einsetzen, mit `<label>` und `color-scheme` analog zu `dark`.

- [ ] **Schritt 2: Das Java-Gate gegen die neuen Themes laufen lassen**

In `TestReactThemeContrast.THEMES` die beiden Namen ergänzen:

```java
private static final List<String> THEMES = List.of("default", "dark", "kandidat", "kandidat-dark");
```

```bash
cd ~/git/tl8-wt-29584
mvn -B test -pl com.top_logic.layout.react -DskipTests=false \
  -Dtest=test.com.top_logic.layout.react.theme.TestReactThemeContrast 2>&1 | grep -E "erreicht|reaches|Tests run:"
```

Erwartet: `default` und `dark` melden weiterhin ihre acht Verstöße; `kandidat` und `kandidat-dark`
melden **nichts**. Meldet der Kandidat etwas, rechnen JS und Java auseinander — dann das klären,
bevor es weitergeht.

- [ ] **Schritt 3: Die Demo-App starten und umschalten**

Nach `docs/eclipse-workspace.md` starten, dann in der Browser-Konsole:

```js
window.tlTheme.select('kandidat')
```

**Abnahmekriterien:**
1. Tabelle, Formular, Dialog, Werkzeugleiste und Menü sehen aus wie beabsichtigt
2. Fokusring ist auf jeder Fläche sichtbar
3. Umschalten `kandidat` ↔ `kandidat-dark` ohne Reload, keine Konsolenfehler
4. Ein Screenshot je Modus liegt bei

- [ ] **Schritt 4: Commit in tl-engine-7**

```bash
cd ~/git/tl8-wt-29584
git add com.top_logic.layout.react
git commit -m "Ticket #29584: A candidate palette, checked by the gate and seen in the demo app"
```

- [ ] **Schritt 5: Stufe A abschließen**

In `STATUS.md` festhalten: Skalen entschieden, Palette grün, Gegenprobe gelaufen. Danach ist
Stufe B planbar — und **erst dann** wird ihr Umsetzungsplan geschrieben.

---

## Was dieser Plan bewusst nicht enthält

**Stufe B und C.** Ihre Aufgaben setzen die Stufenzahl jeder Skala voraus. Wie viele
Motion-Dauern es gibt, wie viele Rahmenbreiten, wie viele Dichtestufen — das entscheidet
Aufgabe 7. Vorher geschriebene Schritte für B wären erfunden, nicht geplant.

Nach Aufgabe 8 wird der Plan für B1 geschrieben, mit den dann bekannten Skalen.
