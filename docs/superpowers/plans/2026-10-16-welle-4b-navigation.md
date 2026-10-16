# Welle 4b · Navigation — Umsetzungsplan (#29866)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** AppShell, AppBar, Sidebar (mit mobilem Drawer und Flyout) und BottomBar der React-Schicht lesen das Paket;
ihre acht Blöcke (553 Zeilen) fallen aus `tlReactControls.css`.

**Architecture:** Das Paket bekommt vier Blöcke (`tl-app-shell`, `tl-app-bar`, `tl-sidebar`, `tl-bottom-bar`), den
Behälter `tl-icon-badge` (Icon mit Zähler an der Ecke) und zwei Maße (`size-shell-bar`, `size-sidebar`). In der Engine
misst nur `TLAppShell` den Breakpoint und gibt ihn als Kontext (`useDisplayClass`) und als `data-tl-display` weiter; die
Sidebar rendert kompakt ihre Nav im modalen Drawer (Klassen aus 4a), eingeklappt ihre Gruppen als `Menu` an der neuen
Lage `right-start`. Einträge tragen die Anatomie von `tl-menu__item`, die aktuelle Seite ist `aria-current="page"`.

**Tech Stack:** Paket: CSS, `node --test`, `tools/*.mjs`, Chrome über CDP (`test/lib/browser.mjs`). Engine: React/TSX
über `tl-react-bridge`, TypeScript, Vite, Java 17, Maven, Vitest (MUI-Modul).

**Spec:** `docs/superpowers/specs/2026-10-16-welle-4b-navigation-design.md` (entschieden 16.10.); Begründungen in
`docs/skalen.md` „Welle 4b: Navigation“; Prognose Q10–Q14 in `docs/migration/altlast.md` „Welle 4“.

## Abweichungen von der Spec (beim Planen am Code gefunden)

1. **`tl-icon-badge` statt `tl-badge--corner`.** `view-layer/parts.md` (Engine) verlangt: die Lage eines Parts — auch
   „the absolute position over a corner“ — gehört dem Element **um** das Part; eine Komponentenbibliothek setzt die
   Position ihres Badges selbst (MUI: `position: relative`) und gewinnt gegen unsere Klasse. Darum ein kleiner Block in
   `badge.css`: `span.tl-icon-badge` (positioniert, um Icon und Zähler) mit `span.tl-icon-badge__count` (die Ecke, um
   das Part `Badge`). Versatz oben `space-2xs`, zum Ende `space-xs` (alt −0,375/−0,5 rem).
2. **Der Hamburger braucht Zustand vom Server.** `aria-expanded` und `aria-controls` (Spec §3) kennt
   `TLDrawerToggle` heute nicht: `drawerOpen` steht nur in der Sidebar. `DrawerToggleControl` bekommt die Schlüssel
   `open` und `controls`, `ReactSidebarControl` führt `open` nach (zwei Java-Klassen, ein neuer Java-Test). Spec §1
   sagte „Java bleibt bis auf i18n“.
3. **Kein Gleiten des mobilen Drawers.** Kompakt und offen rendert die Sidebar `div.tl-dialog > aside.tl-drawer`
   (offen), geschlossen gar nichts: ein geschlossener Drawer ohne Scrim neben einem offenen mit Scrim wären zwei
   Bäume, das Umhängen risse den Übergang ab. Die Schublade erscheint mit dem Scrim. Eine Bewegung folgt, wenn die
   Sichtprüfung sie verlangt.
4. **`aria-controls` am Hamburger nur, solange offen** — geschlossen gibt es die Nav kompakt nicht im DOM, ein
   Verweis ins Leere wäre falsch.
5. **Trenner der Rail ist `MenuSeparator`** (`tl-menu__separator` um das Part `Divider`), Kopfzeilen sind
   `tl-menu__header tl-type-label` wie im Menü — nicht mehr in Großbuchstaben mit Sperrung.
6. **Einträge in `text-primary`** wie im Menü (alt: `text-secondary`, unter dem Zeiger primär).
7. **Schrumpfen der AppBar:** die Aktionen mit einer überlaufenden Toolbar sind `flex: 1 1 0` mit `min-width:
   size-control` — sie nehmen nur den Rest und halten am Überlaufknopf; erst dann schrumpfen Titel und Kinder. Ein
   Browser-Test misst die Reihenfolge. Die Kinder wachsen nicht mehr (`flex: 0 1 auto`), sonst teilten sie den Rest mit
   den Aktionen.
8. **BottomBar-Icon ohne Java-Änderung:** `ThemeIcon` nimmt eine rohe CSS-Klasse („Fallback: try as CSS class“), die
   `BottomBarElement` liefert. Offener Punkt der Spec §10 damit erledigt.
9. **`tl-app-shell__content` behält `overflow: hidden`** (alt ebenso): der Bereich begrenzt die aktive Ansicht, die
   ihren Abstand selbst trägt (Abstandsmodell). `focus-clip.test.mjs` misst es mit.
10. **Flyout und Rail-Tastatur:** Tastenereignisse aus dem portalierten Menü laufen in React durch die Komponente
    hinauf zur Rail. Die Rail behandelt nur Ereignisse, deren Ziel in ihrem eigenen DOM liegt.

## Global Constraints

- Ticket **#29866**; Commits beider Repos mit Präfix `Ticket #29866:`, Paket-Commits deutsch, Engine-Commits englisch,
  Trailer `Co-Authored-By: <Modell des Ausführenden> <noreply@anthropic.com>`.
- Engine-Branch `CWS/CWS_29866_design_system_welle_4b` im Worktree `_Working-Tree/tl8-wt-29584` (lokal, auf
  `origin/CWS/CWS_29825_design_system_spaltenwahl`, erster Commit `1fdae596a9`). **Kein Push** — weder Engine noch
  Paket; Subagenten committen lokal und melden.
- Paket: `tokens.json` nur Referenzen; im CSS nur Tokens (Lint); `dist/` nur über `node tools/generate.mjs`, danach
  `node tools/publish-to-worktree.mjs` (`test/published.test.mjs` hält die Kopie byte-gleich).
- Zustände sind Attribute (`data-tl-state` als Wortliste, `aria-current`, `aria-expanded`), nie `--active`,
  `--collapsed`, `--drawerOpen`, `--open`.
- Keine Komponentendatei enthält eine Breiten-Media-Query; den Breakpoint `768` kennt nur `TLAppShell.tsx`.
- `z-index` nur `var(--tl-layer-*)`; `transition` nur mit `var(--tl-duration-*)` und `var(--tl-easing-*)`; kein
  `outline: none`; der Ring kommt aus `base.css`.
- Die Lage eines Parts (`Badge`, `Divider`, `Button`, `DisclosureToggle`) steht am Element um das Part, nie an seiner
  `className` (`view-layer/parts.md`).
- React in Controls nur aus `'tl-react-bridge'`; in `bridge/*.ts` aus `'react'` wie die Nachbardateien.
- `messages_en.properties` nie von Hand; `design-system/tools/check-messages-en.sh` vor dem Abschluss; Deutsch in
  `messages_de.properties` von Hand, sortiert.
- Keine Zeitangaben in Docs und Commits.

## Review Focus

1. **Der Hamburger sitzt in einem Slot der AppBar** (über `SlotContentControl`). Erreicht ihn der Kontext der
   AppShell? Wenn der Slot in einen eigenen React-Baum rendert, sieht `useDisplayClass()` dort `regular` und der
   Knopf fehlt kompakt. Task 5 Schritt 1 prüft das am Code, Task 9 Punkt 3 in der laufenden Demo.
2. **Fokus kehrt zurück, wenn der Drawer schließt, obwohl die Schublade dabei aus dem DOM fällt** (Escape, Scrim,
   Auswahl eines Eintrags). `useFocusTrap` merkt sich den Auslöser beim Aktivieren; Task 6 nutzt genau diesen Pfad,
   Task 9 Punkt 3 prüft ihn.
3. **Klick auf den Gruppenknopf bei offenem Flyout** schließt es und öffnet es nicht im selben Klick wieder
   (`pressClosedSurface()`); Task 6 Schritt 3.
4. **Pfeiltasten im Flyout** bewegen nur das Menü, nicht zugleich den Cursor der Rail (Abweichung 10); Task 6.
5. **Die AppBar gibt in der richtigen Reihenfolge nach** — erst die Toolbar bis zum Überlaufknopf, dann der Titel;
   Browser-Test in Task 2.

## Datei-Übersicht

| Datei | Aufgabe |
|---|---|
| `design-system/src/tokens.json` | `size-sidebar`, `size-shell-bar` (normal/kompakt) |
| `design-system/tools/lint-css.mjs` | Modifier der vier Blöcke und `tl-icon-badge` |
| `design-system/src/components/badge/badge.css`, `badge.contract.md`, `badge.spec.html` | `tl-icon-badge` |
| `design-system/src/components/app-shell/app-shell.{css,contract.md,spec.html}` | neu |
| `design-system/src/components/app-bar/app-bar.{css,contract.md,spec.html}` | neu |
| `design-system/src/components/sidebar/sidebar.{css,contract.md,spec.html}` | neu |
| `design-system/src/components/bottom-bar/bottom-bar.{css,contract.md,spec.html}` | neu |
| `design-system/src/components/menu/menu.contract.md` | Leser in der Rail |
| `design-system/specimen/index.html` | Links auf die vier Seiten |
| `design-system/test/navigation.test.mjs` | Maße, Media-Query-Gate, CSS der vier Blöcke |
| `design-system/test/app-bar-shrink.test.mjs` | Browser-Test: Reihenfolge des Nachgebens |
| `design-system/test/contracts-4b.test.mjs` | Pflichtbegriffe der Verträge, Specimen-Harness |
| `design-system/test/ratchet.json`, `test/engine-classes.test.mjs` | Ratsche, alte Klassen, Engine-Prüfungen |
| Engine `react-src/bridge/display-class.ts` (neu), `bridge/popover.ts`, `bridge-entry.ts` | Kontext, `right-start` |
| Engine `react-src/controls/menu/Menu.tsx` | `MenuItem`: `current="page"`, `trailing`, `tooltip` |
| Engine `react-src/controls/TLAppShell.tsx`, `TLDrawerToggle.tsx` | §3 |
| Engine `react-src/controls/TLSidebar.tsx` | §4 |
| Engine `react-src/controls/TLAppBar.tsx`, `TLBottomBar.tsx` | §5 |
| Engine `…/control/sidebar/DrawerToggleControl.java`, `ReactSidebarControl.java`, `I18NConstants.java` | Abweichung 2, i18n |
| Engine `src/test/java/test/…/control/sidebar/TestDrawerToggleState.java` (neu) | Java-Test |
| Engine `com.top_logic.layout.react.mui/react-src/adapters/MuiAppBarAdapter.tsx` und fünf `*.test.tsx`, `wire-test-support.tsx` | Adapter, Tests |
| Engine `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/app.view.xml` | Kommentar zum Hamburger |
| Engine `src/main/webapp/style/tlReactControls.css` | acht Blöcke streichen |

---

### Task 1: Paket — Maße, Lint, `tl-icon-badge`, Media-Query-Gate

**Files:**
- Modify: `design-system/src/tokens.json` (Zeilen `measure` und `density`)
- Modify: `design-system/tools/lint-css.mjs` (`MODIFIERS`)
- Modify: `design-system/src/components/badge/badge.css`, `badge.contract.md`, `badge.spec.html`
- Create: `design-system/test/navigation.test.mjs`

**Interfaces:**
- Produces: Tokens `--tl-size-sidebar`, `--tl-size-shell-bar`; Klassen `tl-icon-badge`, `tl-icon-badge__count`
  (Tasks 2, 3, 6, 7); Testdatei `navigation.test.mjs`, die Tasks 2 und 3 erweitern.

- [ ] **Step 1: Failing test** — `design-system/test/navigation.test.mjs` anlegen:

```js
// Welle 4b (Spec 2026-10-16): Navigation aus dem Paket. Jede Regel hier steht in der Spec; die Verträge prüft
// contracts-4b.test.mjs, die Reihenfolge des Nachgebens der AppBar app-bar-shrink.test.mjs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readGenerated, declarationsOf, componentCssFiles } from './lib/component.mjs';

const T = JSON.parse(readFileSync(new URL('../src/tokens.json', import.meta.url)));
const decl = (dir, sel) => declarationsOf(readGenerated(dir, `${dir}.css`), sel) ?? '';
const ohneKommentar = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');

test('Maße der Navigation: size-sidebar fest, size-shell-bar folgt der Dichte (48/40 px)', () => {
  assert.equal(T.measure['size-sidebar'], '{size-12}');
  assert.equal(T.density.normal['size-shell-bar'], '{size-8}');
  assert.equal(T.density.compact['size-shell-bar'], '{height-5}');
});

test('keine Komponentendatei kennt einen Breakpoint: kein @media auf Breite oder Höhe', () => {
  const treffer = [];
  for (const [name, css] of componentCssFiles())
    for (const m of ohneKommentar(css).matchAll(/@media[^{]*\b(min-|max-)?(width|height)\b[^{]*\{/g)) treffer.push(`${name}: ${m[0]}`);
  assert.deepEqual(treffer, []);
});

test('tl-icon-badge: der Behälter ist positioniert, der Zähler sitzt an der Ecke — Lage am Element um das Part', () => {
  assert.match(decl('badge', '.tl-icon-badge'), /position:\s*relative/);
  assert.match(decl('badge', '.tl-icon-badge'), /display:\s*inline-flex/);
  const z = decl('badge', '.tl-icon-badge__count');
  assert.match(z, /position:\s*absolute/);
  assert.match(z, /top:\s*calc\(-1 \* var\(--tl-space-2xs\)\)/);
  assert.match(z, /inset-inline-end:\s*calc\(-1 \* var\(--tl-space-xs\)\)/);
  assert.doesNotMatch(ohneKommentar(readGenerated('badge', 'badge.css')), /\.tl-badge--/);
});
```

- [ ] **Step 2: Run** `cd design-system && node --test test/navigation.test.mjs` — Expected: FAIL (`size-sidebar`
  fehlt, `.tl-icon-badge` fehlt); der Media-Query-Test ist schon grün.

- [ ] **Step 3: Tokens** — in `src/tokens.json` im Objekt `measure` nach `"size-drawer-narrow": …,
  "size-drawer-wide": "{size-14}",` die Zeile `"size-sidebar": "{size-12}",` ergänzen; in `density.normal` nach
  `"size-bar": "{height-5}",` den Schlüssel `"size-shell-bar": "{size-8}",`, in `density.compact` nach
  `"size-bar": "{height-4}",` den Schlüssel `"size-shell-bar": "{height-5}",`.

- [ ] **Step 4: `tl-icon-badge`** — an `src/components/badge/badge.css` anhängen:

```css

/* Ein Icon mit Zähler an der Ecke (eingeklappte Sidebar, BottomBar) — Spec 2026-10-16 Welle 4b §6. Die Lage gehört
   dem Element um das Part Badge, nicht dem Badge: eine Komponentenbibliothek setzt die Position ihres Badges selbst
   (view-layer/parts.md). Der Behälter umschließt Icon und Zähler; der Zähler steht über der Ecke oben am Ende. */
.tl-icon-badge {
  position: relative;
  display: inline-flex;
  flex: none;
}
.tl-icon-badge[hidden] { display: none; }

.tl-icon-badge__count {
  position: absolute;
  top: calc(-1 * var(--tl-space-2xs));
  inset-inline-end: calc(-1 * var(--tl-space-xs));
  display: flex;
}
```

- [ ] **Step 5: Lint** — in `tools/lint-css.mjs` in `MODIFIERS` nach `'tl-notice-bar': …` ergänzen:

```js
  'tl-app-shell': new Set([]), // Kompakt ist ein Attribut (data-tl-display) der Wurzel.
  'tl-app-bar': new Set(['elevated']), // Eine Variante, kein Zustand.
  'tl-sidebar': new Set([]), // Eingeklappt: data-tl-state~="collapsed"; aktuell: aria-current.
  'tl-bottom-bar': new Set([]), // Aktuell: aria-current.
  'tl-icon-badge': new Set([]),
```

- [ ] **Step 6: Vertrag und Specimen des Badge** — in `badge.contract.md` den Abschnitt „## Zustand“ ersetzen (das
  Part existiert seit #29787):

```markdown
## Zustand

Das Part `Badge` (`BadgePart.tsx`, `usePart('Badge')`) zeichnet es mit `content`; Sidebar, BottomBar und Reiter
setzen es.

| Schlüssel | Typ | Bedeutung |
|---|---|---|
| `content` | integer oder kurzer string | Die Ziffern oder das Kürzel; Text gehört in eine Pill. |
```

  und in „## Attribute“ zwei Zeilen anfügen:

```markdown
| `tl-icon-badge` | Behälter um ein Icon und seinen Zähler an der Ecke (eingeklappte Sidebar, BottomBar); positioniert |
| `tl-icon-badge__count` | Element um das Part an der Ecke oben am Ende; die Lage gehört hierher, nicht ans Part |
```

  In `badge.spec.html` vor `</main>` eine Sektion ergänzen:

```html
  <section class="specimen__panel"><p class="tl-type-heading-sm">An der Ecke eines Icons (tl-icon-badge)</p>
    <div class="specimen__row">
      <span class="tl-icon-badge"><i class="tl-icon-md bi bi-inbox" aria-hidden="true"></i><span class="tl-icon-badge__count"><span class="tl-badge tl-type-label-strong tl-nums" role="img" aria-label="3 neue Meldungen">3</span></span></span>
      <span class="tl-icon-badge"><i class="tl-icon-sm bi bi-bell" aria-hidden="true"></i><span class="tl-icon-badge__count"><span class="tl-badge tl-type-label-strong tl-nums" role="img" aria-label="12 Hinweise">12</span></span></span>
    </div>
  </section>
```

  (Lädt `badge.spec.html` noch kein `bootstrap-icons.css`, die Zeile
  `<link rel="stylesheet" href="/fonts/style/bootstrap-icons.css">` nach `interFonts.css` ergänzen.)

- [ ] **Step 7: Gates** — `node tools/generate.mjs && node tools/lint-css.mjs && node tools/publish-to-worktree.mjs &&
  node --test 2>&1 | grep -E '^ℹ (pass|fail)|^✖'` — Expected: alles grün. Meldet ein Test, dass ein Token keinen
  Leser hat oder die Dichte-Schlüssel fest gezählt sind (`tokens.test.mjs`, `generate.test.mjs`), den Test um die zwei
  Namen ergänzen — Leser kommen in Task 2 und 3; reicht das nicht, Task 1 erst nach Task 3 committen.

- [ ] **Step 8: Commit** (Paket)

```bash
git add design-system && git commit -m "Ticket #29866: Paket -- Maße size-sidebar und size-shell-bar, tl-icon-badge, kein Breakpoint in Komponenten

Co-Authored-By: <Modell> <noreply@anthropic.com>"
```

  und im Worktree die Paketkopie: `git -C _Working-Tree/tl8-wt-29584 add com.top_logic.layout.react/src/main/webapp/style/tl-design-system && git -C _Working-Tree/tl8-wt-29584 commit -m "Ticket #29866: Design system package -- sizes for sidebar and shell bars, icon with a count at its corner."` (mit Trailer).

---

### Task 2: Paket — `tl-app-shell`, `tl-app-bar`, Browser-Test des Nachgebens

**Files:**
- Create: `design-system/src/components/app-shell/app-shell.css`, `app-shell.contract.md`, `app-shell.spec.html`
- Create: `design-system/src/components/app-bar/app-bar.css`, `app-bar.contract.md`, `app-bar.spec.html`
- Create: `design-system/test/app-bar-shrink.test.mjs`
- Modify: `design-system/test/navigation.test.mjs`, `design-system/specimen/index.html`

**Interfaces:**
- Consumes: `--tl-size-shell-bar` (Task 1); `launch` aus `test/lib/browser.mjs`, `specimenServer` aus `tools/serve.mjs`.
- Produces: Klassen `tl-app-shell`, `__header`, `__notices`, `__content`, `__footer`, Attribut `data-tl-display`;
  `tl-app-bar`, `--elevated`, `__leading`, `__title`, `__children`, `__actions`, `__trailing` (Tasks 5, 7).

- [ ] **Step 1: Failing tests** — an `test/navigation.test.mjs` anhängen:

```js
test('tl-app-shell: Spalte, füllt; der Inhalt ist begrenzt, Hinweise stehen bündig', () => {
  const s = decl('app-shell', '.tl-app-shell');
  assert.match(s, /display:\s*flex/);
  assert.match(s, /flex-direction:\s*column/);
  assert.match(s, /height:\s*100%/);
  const c = decl('app-shell', '.tl-app-shell__content');
  assert.match(c, /flex:\s*1 1 auto/);
  assert.match(c, /min-height:\s*0/);
  assert.match(decl('app-shell', '.tl-app-shell .tl-app-shell__notices > *'), /gap:\s*0/);
});

test('tl-app-bar: Höhe size-shell-bar, Fläche surface-layer; --elevated ist eine Linie, kein Schatten', () => {
  const b = decl('app-bar', '.tl-app-bar');
  assert.match(b, /height:\s*var\(--tl-size-shell-bar\)/);
  assert.match(b, /background:\s*var\(--tl-surface-layer\)/);
  assert.match(decl('app-bar', '.tl-app-bar--elevated'), /border-bottom:\s*var\(--tl-border-width-sm\) solid var\(--tl-border-separator\)/);
  assert.doesNotMatch(ohneKommentar(readGenerated('app-bar', 'app-bar.css')), /box-shadow|100000/);
});

test('tl-app-bar: eine überlaufende Toolbar nimmt nur den Rest und hält am Überlaufknopf', () => {
  const a = decl('app-bar', '.tl-app-bar__actions:has(> .tl-toolbar[data-tl-overflow])');
  assert.match(a, /flex:\s*1 1 0/);
  assert.match(a, /min-width:\s*var\(--tl-size-control\)/);
  assert.match(decl('app-bar', '.tl-app-bar__title'), /min-width:\s*0/);
  assert.match(decl('app-bar', '.tl-app-bar__children'), /flex:\s*0 1 auto/);
  assert.match(decl('app-bar', '.tl-app-bar__actions:empty'), /display:\s*none/);
});
```

  Und `design-system/test/app-bar-shrink.test.mjs` anlegen:

```js
// Wer in der AppBar nachgibt (Spec 2026-10-16 Welle 4b §5): erst die überlaufende Toolbar bis zu ihrem Überlaufknopf,
// dann der Titel. Gemessen im Browser an app-bar.spec.html, Abschnitt #shrink, bei zwei Breiten.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { specimenServer } from '../tools/serve.mjs';
import { launch } from './lib/browser.mjs';

let server, browser, origin;
before(async () => {
  server = specimenServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
  browser = await launch();
});
after(async () => {
  await browser?.close();
  await new Promise((resolve) => (server ? server.close(resolve) : resolve()));
});

const MESSE = (px) => `(() => {
  const stage = document.querySelector('#shrink');
  stage.style.width = '${px}px';
  const bar = stage.querySelector('.tl-app-bar');
  const title = bar.querySelector('.tl-app-bar__title');
  const actions = bar.querySelector('.tl-app-bar__actions');
  const control = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--tl-size-control')) * 16;
  return { titelGekuerzt: title.scrollWidth > title.clientWidth + 0.5, aktionen: actions.getBoundingClientRect().width, control };
})()`;

test('AppBar: bei 640 px ist der Titel ganz und die Toolbar breiter als ihr Knopf; bei 300 px hält die Toolbar am Knopf, der Titel kürzt', async () => {
  await browser.goto(origin + '/src/components/app-bar/app-bar.spec.html');
  const breit = await browser.evaluate(MESSE(640));
  assert.equal(breit.titelGekuerzt, false, 'Titel gekürzt, obwohl die Toolbar noch Platz hergeben kann');
  assert.ok(breit.aktionen > breit.control + 1, `Aktionen ${breit.aktionen} px, Knopf ${breit.control} px`);
  const schmal = await browser.evaluate(MESSE(300));
  assert.ok(Math.abs(schmal.aktionen - schmal.control) < 1, `Aktionen ${schmal.aktionen} px statt ${schmal.control} px`);
  assert.equal(schmal.titelGekuerzt, true, 'bei 300 px muss der Titel kürzen');
});
```

  (`--tl-size-control` ist `2rem`; `* 16` setzt die Standardwurzel voraus, die das Specimen hat.)

- [ ] **Step 2: Run** `node --test test/navigation.test.mjs test/app-bar-shrink.test.mjs` — Expected: FAIL (Dateien
  fehlen; der Browser-Test scheitert an `#shrink`).

- [ ] **Step 3: `app-shell.css`**

```css
/* AppShell — Spec 2026-10-16 Welle 4b §3. Der Rahmen der Anwendung: Kopf, Hinweise, Inhalt (main), Fuß. Den Breakpoint
   misst nur TLAppShell (matchMedia) und setzt data-tl-display="compact" | "regular" an dieser Wurzel; keine
   Komponentendatei enthält eine Breiten-Media-Query (navigation.test.mjs). Eine Regel für schmale Bildschirme liest
   [data-tl-display~="compact"]. */

.tl-app-shell {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
}
.tl-app-shell[hidden] { display: none; }

.tl-app-shell__header,
.tl-app-shell__footer {
  flex: none;
}

/* Hinweise zwischen Kopf und Inhalt: ohne eigenen Rand und Abstand, damit der Bereich verschwindet, wenn kein Hinweis
   sichtbar ist. */
.tl-app-shell__notices {
  display: flex;
  flex: none;
  flex-direction: column;
}

/* Mehrere Hinweise stehen bündig: Balken über die volle Breite; die Lücke eines Stapels zeigte die Seite als Streifen
   zwischen zwei Ansagen. Zwei Klassen, damit die Regel die Lücke des Stapels schlägt, wo immer er steht. */
.tl-app-shell .tl-app-shell__notices > * {
  gap: 0;
}

/* Begrenzte Spalte: die aktive Ansicht löst ihre Höhe gegen diesen Bereich auf, füllt ihn und rollt in sich, die
   AppBar bleibt stehen. Bündig: die Ansicht trägt ihren Abstand selbst (Abstandsmodell). */
.tl-app-shell__content {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}
```

- [ ] **Step 4: `app-bar.css`**

```css
/* AppBar — Spec 2026-10-16 Welle 4b §5. Die Leiste am oberen Rand: Anfang (Hamburger), Titel, Kinder (Breadcrumb),
   Aktionen (tl-toolbar), Ende (Benutzermenü). Höhe size-shell-bar, Fläche surface-layer. Die Variante --elevated
   trennt mit einer Linie, nicht mit einem Schatten: die Leiste schwebt nicht (docs/skalen.md „Welle 4b“). */

.tl-app-bar {
  display: flex;
  flex: none;
  align-items: center;
  gap: var(--tl-space-xs);
  box-sizing: border-box;
  height: var(--tl-size-shell-bar);
  padding: 0 var(--tl-space-sm);
  background: var(--tl-surface-layer);
  color: var(--tl-text-primary);
}
.tl-app-bar[hidden] { display: none; }

.tl-app-bar--elevated {
  border-bottom: var(--tl-border-width-sm) solid var(--tl-border-separator);
}

.tl-app-bar__leading {
  display: flex;
  flex: none;
  align-items: center;
}

.tl-app-bar__title {
  flex: 0 1 auto;
  min-width: 0;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Die Kinder (Breadcrumb) wachsen nicht: den Rest der Leiste nehmen die Aktionen. */
.tl-app-bar__children {
  display: flex;
  flex: 0 1 auto;
  align-items: center;
  gap: var(--tl-space-xs);
  min-width: 0;
}

.tl-app-bar__actions {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: end;
  margin-inline-start: auto;
}

/* Ohne Befehl rendert die Toolbar nichts; dann trägt die Hülle keine Lücke zur Leiste bei. */
.tl-app-bar__actions:empty {
  display: none;
}

/* Wer nachgibt, wenn die Leiste zu schmal wird: eine Toolbar, die überlaufen kann, nimmt nur den Platz, der übrig ist
   (Basis 0, sie wächst in den Rest) und misst daran, was sie zeigt — erst fallen die Labels, dann wandern Befehle ins
   Überlaufmenü. Bei ihrem Überlaufknopf (min-width) hält sie; erst dann schrumpfen Titel und Kinder
   (app-bar-shrink.test.mjs). Ohne die Zahl 100000 des Altbestands. */
.tl-app-bar__actions:has(> .tl-toolbar[data-tl-overflow]) {
  flex: 1 1 0;
  min-width: var(--tl-size-control);
}

.tl-app-bar__trailing {
  display: flex;
  flex: none;
  align-items: center;
  gap: var(--tl-space-xs);
  margin-inline-start: auto;
}

/* Aktionen vor dem Ende haben den freien Platz schon genommen; ein zweiter automatischer Rand teilte ihn und ließe die
   Aktionen in der Mitte stehen. Eine leere Hülle nimmt nichts, dann behält das Ende seinen Rand. */
.tl-app-bar__actions:not(:empty) + .tl-app-bar__trailing {
  margin-inline-start: 0;
}
```

- [ ] **Step 5: Verträge** — `app-shell.contract.md`:

```markdown
# Vertrag: AppShell

Der Rahmen einer Anwendung: Kopf, systemweite Hinweise, Inhalt, Fuß, Snackbar. Er misst als einziger, ob der
Bildschirm schmal ist. TopLogic garantiert Landmarken und Verhalten, nicht das Aussehen.

## Zustand

Das Control ist `TLAppShell` (`ReactAppShellControl`).

| Schlüssel | Typ | Bedeutung |
|---|---|---|
| `header` | Kind, optional | Kopf, meist die AppBar |
| `notices` | Kind, optional | Hinweise zwischen Kopf und Inhalt |
| `content` | Kind | Inhalt, füllt den Rest |
| `footer` | Kind, optional | Fuß, meist die BottomBar |
| `snackbar` | Kind | Meldungsdienst |

## Aktionen

| Aktion | Wann |
|---|---|
| `reportDisplayClass` | beim Start und bei jedem Wechsel über den Breakpoint: `COMPACT` oder `REGULAR` |

## Verhalten

- Der Breakpoint (768 px Fensterbreite) steht nur hier. Die Shell meldet ihn dem Server, gibt ihn den Komponenten in
  ihr als Kontext (`useDisplayClass`) und setzt `data-tl-display` an ihrer Wurzel. Eine Komponente außerhalb einer
  Shell ist `regular`.
- Der Inhalt ist das Landmark `<main>`.

## Tokens

Keine Fläche, kein Maß der Shell selbst; Kopf und Fuß bringen ihre (`--tl-size-shell-bar`).

## Attribute

| Attribut | Wann |
|---|---|
| `tl-app-shell` | immer |
| `data-tl-display="compact"` \| `"regular"` | immer; eine Regel für schmale Bildschirme liest `[data-tl-display~="compact"]` |
| `tl-app-shell__header`, `tl-app-shell__notices`, `tl-app-shell__footer` | um Kopf, Hinweise, Fuß |
| `tl-app-shell__content` | an `<main>` um den Inhalt |

## Konformität

Eine Shell besteht den Vertrag, wenn ihr Inhalt in `<main>` steht, sie `data-tl-display` setzt und keine Regel des
Pakets den Breakpoint wiederholt.
```

  `app-bar.contract.md`:

```markdown
# Vertrag: AppBar

Die Leiste am oberen Rand einer Anwendung. TopLogic garantiert Landmarke, Reihenfolge und Nachgeben, nicht das
Aussehen.

## Zustand

Das Control ist `TLAppBar` (`ReactAppBarControl`, Zustand `AppBarState` in `state.proto`).

| Schlüssel | Typ | Bedeutung |
|---|---|---|
| `title` | string | Titel, Überschrift `h1` |
| `variant` | `flat` \| `elevated` | `elevated`: `tl-app-bar--elevated`, eine Linie unten |
| `leading` | Kind, optional | Anfang, z. B. der Hamburger der Sidebar |
| `children` | Kinder | neben dem Titel, z. B. die Breadcrumb |
| `actions` | Kind, optional | eine `tl-toolbar`, Knöpfe ghost |
| `trailing` | Kind, optional | Ende, z. B. das Benutzermenü |

## Aktionen

Keine eigenen; die Kinder senden ihre.

## Verhalten

- Wird die Leiste schmal, gibt zuerst eine Toolbar mit `data-tl-overflow` nach (Labels, dann Überlaufmenü) bis zu
  ihrem Überlaufknopf; erst dann kürzt der Titel mit Ellipse.
- Eine Toolbar ohne Befehl rendert nichts; ihre Hülle verschwindet.

## Tokens

| Teil | Token |
|---|---|
| Höhe | `--tl-size-shell-bar` |
| Fläche, Schrift | `--tl-surface-layer`, `--tl-text-primary`; Titel `tl-type-heading-sm` |
| Linie (`--elevated`) | `--tl-border-width-sm`, `--tl-border-separator` |
| Abstände | `--tl-space-xs`, `--tl-space-sm` |

## Attribute

| Attribut | Wann |
|---|---|
| `tl-app-bar` | immer, an `<header>` |
| `tl-app-bar--elevated` | Variante `elevated` |
| `tl-app-bar__leading`, `tl-app-bar__children`, `tl-app-bar__trailing` | um die Kinder |
| `tl-app-bar__title` | am `h1`, mit `tl-type-heading-sm` |
| `tl-app-bar__actions` | um die Toolbar; mit `data-tl-overflow` an der Toolbar gibt sie zuerst nach |

## Konformität

Eine AppBar besteht den Vertrag, wenn sie `<header>` mit genau einem `h1` ist, eine überlaufende Toolbar vor dem
Titel nachgibt und im Klassen-Gate keine Klasse ohne `tl-`-Präfix bleibt.
```

- [ ] **Step 6: Specimen** — `app-bar.spec.html` (Gerüst wie `drawer.spec.html`: `lang="de"`, beide Schalter,
  `bootstrap-icons.css`, `/dist/components.css`, `/specimen/specimen.css`, Skript für Modus und Dichte am Ende):

```html
<style>
  .stage { background: var(--tl-surface-base); }
  #shrink { max-width: 100%; }
</style>
…
  <section class="specimen__panel"><p class="tl-type-heading-sm">Flach, mit Breadcrumb, Toolbar und Benutzermenü</p>
    <div class="stage">
      <header class="tl-app-bar">
        <div class="tl-app-bar__leading"><button type="button" class="tl-button tl-button--ghost tl-button--icon" aria-label="Navigation öffnen" aria-expanded="false" data-tooltip="text:Navigation öffnen"><i class="tl-icon-md bi bi-list tl-button__icon" aria-hidden="true"></i></button></div>
        <h1 class="tl-app-bar__title tl-type-heading-sm">TopLogic Demo</h1>
        <div class="tl-app-bar__children"><nav class="tl-breadcrumb tl-type-body" aria-label="Pfad"><ol class="tl-breadcrumb__list"><li class="tl-breadcrumb__item"><a class="tl-breadcrumb__link" href="#">Start</a></li><li class="tl-breadcrumb__item"><span class="tl-breadcrumb__current" aria-current="page">Aufträge</span></li></ol></nav></div>
        <div class="tl-app-bar__actions"><div class="tl-toolbar" role="toolbar" aria-label="Befehle" data-tl-overflow="trailing"><button type="button" class="tl-button tl-button--ghost"><span class="tl-button__label">Neu</span></button><button type="button" class="tl-button tl-button--ghost"><span class="tl-button__label">Export</span></button></div></div>
        <div class="tl-app-bar__trailing"><button type="button" class="tl-button tl-button--ghost"><span class="tl-button__label">Hendrik</span></button></div>
      </header>
    </div>
  </section>
  <section class="specimen__panel"><p class="tl-type-heading-sm">Erhöht (--elevated: Linie unten)</p>
    <div class="stage">
      <header class="tl-app-bar tl-app-bar--elevated">
        <h1 class="tl-app-bar__title tl-type-heading-sm">Einstellungen</h1>
        <div class="tl-app-bar__actions"></div>
        <div class="tl-app-bar__trailing"><button type="button" class="tl-button tl-button--ghost tl-button--icon" aria-label="Hilfe" data-tooltip="text:Hilfe"><i class="tl-icon-md bi bi-question-circle tl-button__icon" aria-hidden="true"></i></button></div>
      </header>
    </div>
  </section>
  <section class="specimen__panel"><p class="tl-type-heading-sm">Nachgeben (app-bar-shrink.test.mjs setzt die Breite)</p>
    <div class="stage" id="shrink">
      <header class="tl-app-bar">
        <h1 class="tl-app-bar__title tl-type-heading-sm">Ein langer Titel der Anwendung, der zuletzt kürzt</h1>
        <div class="tl-app-bar__actions"><div class="tl-toolbar" role="toolbar" aria-label="Befehle" data-tl-overflow="trailing"><button type="button" class="tl-button tl-button--ghost"><span class="tl-button__label">Neu anlegen</span></button><button type="button" class="tl-button tl-button--ghost"><span class="tl-button__label">Exportieren</span></button><button type="button" class="tl-button tl-button--ghost"><span class="tl-button__label">Drucken</span></button></div></div>
      </header>
    </div>
  </section>
```

  (Die Breadcrumb-Klassen vor dem Einfügen gegen `src/components/breadcrumb/breadcrumb.spec.html` abgleichen und
  dessen Anatomie übernehmen.) `app-shell.spec.html`:

```html
<style>
  .stage { position: relative; height: 24rem; transform: translateZ(0); }
  .stage p { margin: var(--tl-space-md); }
</style>
…
  <section class="specimen__panel"><p class="tl-type-heading-sm">Kopf, zwei Hinweise bündig, Inhalt, Fuß</p>
    <div class="stage">
      <div class="tl-app-shell" data-tl-display="regular">
        <div class="tl-app-shell__header"><header class="tl-app-bar tl-app-bar--elevated"><h1 class="tl-app-bar__title tl-type-heading-sm">TopLogic Demo</h1></header></div>
        <div class="tl-app-shell__notices"><div class="specimen__notices">
          <div role="status"><div class="tl-alert tl-notice-bar tl-type-body" data-tl-role="info"><span class="tl-alert__message">Wartung heute ab 18 Uhr.</span></div></div>
          <div role="status"><div class="tl-alert tl-notice-bar tl-type-body" data-tl-role="warning"><span class="tl-alert__message">Die Sitzung läuft bald ab.</span></div></div>
        </div></div>
        <main class="tl-app-shell__content"><p class="tl-type-body">Inhalt (main). Die Ansicht trägt ihren Abstand selbst.</p></main>
        <div class="tl-app-shell__footer"><nav class="tl-bottom-bar" aria-label="Navigation unten"></nav></div>
      </div>
    </div>
  </section>
```

  (Die Notice-Anatomie vor dem Einfügen gegen `notice-bar.spec.html` abgleichen. `.specimen__notices` ist eine
  Stapel-Attrappe mit Lücke: in den `<style>` des Specimens `.specimen__notices { display: flex; flex-direction:
  column; gap: var(--tl-space-sm); }` aufnehmen — die Paketregel muss sie auf 0 setzen.)

  In `specimen/index.html` nach dem Overlay-Link: `<a class="tl-type-label" href="/src/components/app-shell/app-shell.spec.html">AppShell →</a>`, `<a class="tl-type-label" href="/src/components/app-bar/app-bar.spec.html">AppBar →</a>`.

- [ ] **Step 7: Gates** — `node tools/generate.mjs && node tools/lint-css.mjs && node tools/publish-to-worktree.mjs &&
  node --test 2>&1 | grep -E '^ℹ (pass|fail)|^✖'` — Expected: alles grün, auch `focus-clip` über die zwei neuen Seiten
  und `app-bar-shrink`. Scheitert `app-bar-shrink` bei 640 px am gekürzten Titel, die Breite der Toolbar-Knöpfe im
  Specimen prüfen (sie müssen zusammen breiter als ein Knopf sein und die Leiste bei 640 px nicht füllen).

- [ ] **Step 8: Commit** (Paket und Paketkopie im Worktree, wie Task 1).

```bash
git add design-system && git commit -m "Ticket #29866: Paket -- tl-app-shell und tl-app-bar mit Vertrag und Specimen; die AppBar gibt erst mit der Toolbar nach, Browser-Test

Co-Authored-By: <Modell> <noreply@anthropic.com>"
```

---

### Task 3: Paket — `tl-sidebar`, `tl-bottom-bar`, Verträge-Test

**Files:**
- Create: `design-system/src/components/sidebar/sidebar.css`, `sidebar.contract.md`, `sidebar.spec.html`
- Create: `design-system/src/components/bottom-bar/bottom-bar.css`, `bottom-bar.contract.md`, `bottom-bar.spec.html`
- Create: `design-system/test/contracts-4b.test.mjs`
- Modify: `design-system/test/navigation.test.mjs`, `design-system/src/components/menu/menu.contract.md`,
  `design-system/specimen/index.html`

**Interfaces:**
- Consumes: `tl-menu__item`, `tl-menu__icon`, `tl-menu__label`, `tl-menu__header`, `tl-menu__separator` (menu.css),
  `tl-drawer` und `tl-dialog` (4a), `tl-icon-badge` (Task 1), `--tl-size-sidebar`, `--tl-size-shell-bar`.
- Produces: `tl-sidebar`, `__nav`, `__header`, `__items`, `__item`, `__group`, `__chevron`, `__children`, `__footer`,
  `__collapse`, `__content`; Zustände `data-tl-state~="collapsed"` (Wurzel), `~="contains-current"` (Gruppenkopf);
  `tl-bottom-bar`, `__item`, `__icon`, `__label` (Tasks 6, 7).

- [ ] **Step 1: Failing tests** — an `test/navigation.test.mjs` anhängen:

```js
test('tl-sidebar: Nav size-sidebar auf surface-layer mit Linie; eingeklappt eine Rechnung aus size-row und space-2xs', () => {
  const n = decl('sidebar', '.tl-sidebar__nav');
  assert.match(n, /width:\s*var\(--tl-size-sidebar\)/);
  assert.match(n, /background:\s*var\(--tl-surface-layer\)/);
  assert.match(n, /border-inline-end:\s*var\(--tl-border-width-sm\) solid var\(--tl-border-separator\)/);
  assert.match(n, /transition:\s*width var\(--tl-duration-base\) var\(--tl-easing-standard\)/);
  assert.match(decl('sidebar', '.tl-sidebar[data-tl-state~="collapsed"] .tl-sidebar__nav'),
    /width:\s*calc\(var\(--tl-size-row\) \+ 2 \* var\(--tl-space-2xs\)\)/);
  assert.match(decl('sidebar', '.tl-sidebar[data-tl-state~="collapsed"] .tl-sidebar__item'), /width:\s*var\(--tl-size-row\)/);
});

test('tl-sidebar: die aktuelle Seite und der Kopf einer zugeklappten Gruppe, die sie enthält, tragen die Fläche der Auswahl — kein Balken', () => {
  const css = readGenerated('sidebar', 'sidebar.css');
  const regel = declarationsOf(css, '.tl-sidebar__item[aria-current="page"]') ?? '';
  assert.match(regel, /background:\s*var\(--tl-surface-interactive-selected\)/);
  assert.notEqual(declarationsOf(css, '.tl-sidebar__item[data-tl-state~="contains-current"]'), null);
  assert.doesNotMatch(ohneKommentar(css), /border-left|border-width-accent|font-weight/);
});

test('tl-sidebar: der Chevron folgt tl-toggle — rechts zu, bei aria-expanded="true" 90° nach unten', () => {
  assert.match(decl('sidebar', '.tl-sidebar__chevron'), /transition:\s*rotate var\(--tl-duration-fast\) var\(--tl-easing-standard\)/);
  assert.match(decl('sidebar', '.tl-sidebar__item[aria-expanded="true"] > .tl-sidebar__chevron'), /rotate:\s*90deg/);
  assert.doesNotMatch(ohneKommentar(readGenerated('sidebar', 'sidebar.css')), /180deg/);
});

test('tl-sidebar: im Drawer füllt die Nav die Schublade, Breite und Linie trägt der Drawer', () => {
  const d = decl('sidebar', '.tl-drawer > .tl-sidebar__nav');
  assert.match(d, /width:\s*auto/);
  assert.match(d, /border-inline-end:\s*0/);
});

test('tl-bottom-bar: Höhe size-shell-bar; die aktuelle Seite trägt die Fläche hinter dem Icon', () => {
  assert.match(decl('bottom-bar', '.tl-bottom-bar'), /height:\s*var\(--tl-size-shell-bar\)/);
  assert.match(decl('bottom-bar', '.tl-bottom-bar__item[aria-current="page"] .tl-bottom-bar__icon'),
    /background:\s*var\(--tl-surface-interactive-selected\)/);
  assert.match(decl('bottom-bar', '.tl-bottom-bar__item:focus-visible'), /outline-offset:\s*calc\(-1 \* var\(--tl-focus-offset\)\)/);
});
```

  Und `design-system/test/contracts-4b.test.mjs` anlegen:

```js
// Die Verträge der Welle 4b nennen ihre Pflichtbegriffe; die neuen Specimen bestehen den Harness und zeigen die
// Zustände, die die Spec verlangt.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { missingInContract, specimenProblems } from './lib/component.mjs';
const datei = (d, f) => readFileSync(new URL(`../src/components/${d}/${f}`, import.meta.url), 'utf8');
const SOLL = {
  'app-shell/app-shell.contract.md': ['tl-app-shell', 'tl-app-shell__content', 'data-tl-display', '<main>', 'reportDisplayClass', 'useDisplayClass'],
  'app-bar/app-bar.contract.md': ['tl-app-bar', 'tl-app-bar--elevated', 'tl-app-bar__title', 'tl-app-bar__actions', 'data-tl-overflow', '--tl-size-shell-bar'],
  'sidebar/sidebar.contract.md': ['tl-sidebar', 'tl-sidebar__nav', 'tl-menu__item', 'aria-current="page"', 'data-tl-state~="collapsed"',
    'data-tl-state~="contains-current"', 'aria-expanded', 'aria-controls', 'tl-drawer', 'role="dialog"', '--tl-size-sidebar',
    'selectItem', 'executeCommand', 'toggleGroup', 'toggleCollapse', 'toggleDrawer'],
  'bottom-bar/bottom-bar.contract.md': ['tl-bottom-bar', 'aria-current="page"', 'tl-icon-badge', '--tl-size-shell-bar', 'selectItem'],
  'badge/badge.contract.md': ['tl-icon-badge', 'tl-icon-badge__count'],
  'menu/menu.contract.md': ['tl-sidebar'],
};
for (const [file, names] of Object.entries(SOLL)) test(`${file} nennt ${names.length} Pflichtbegriffe`, () => {
  const [d, f] = file.split('/');
  assert.deepEqual(missingInContract(datei(d, f), names), []);
});
for (const name of ['app-shell', 'app-bar', 'sidebar', 'bottom-bar'])
  test(`${name}.spec.html besteht den Specimen-Harness`, () => assert.deepEqual(specimenProblems(datei(name, `${name}.spec.html`)), []));

test('sidebar.spec.html zeigt die aktuelle Seite, eine zugeklappte Gruppe mit ihr, die eingeklappte Rail und den modalen Drawer', () => {
  const html = datei('sidebar', 'sidebar.spec.html');
  assert.match(html, /class="tl-menu__item[^"]*tl-sidebar__item[^"]*"[^>]*aria-current="page"/);
  assert.doesNotMatch(html, /aria-current="(true|step)"[^>]*tl-sidebar__item|tl-sidebar__item[^>]*aria-current="true"/);
  assert.match(html, /aria-expanded="false"[^>]*data-tl-state="contains-current"|data-tl-state="contains-current"[^>]*aria-expanded="false"/);
  assert.match(html, /class="tl-sidebar" data-tl-state="collapsed"/);
  assert.match(html, /<div class="tl-dialog">\s*<aside class="tl-drawer tl-drawer--start tl-drawer--narrow[^"]*" data-tl-state="open" role="dialog" aria-modal="true"/);
  assert.match(html, /<aside class="tl-drawer[^>]*>\s*<nav [^>]*class="tl-sidebar__nav"/);
  assert.match(html, /class="tl-icon-badge"/);
});

test('bottom-bar.spec.html: genau eine aktuelle Seite, ein Zähler an der Ecke', () => {
  const html = datei('bottom-bar', 'bottom-bar.spec.html');
  assert.equal((html.match(/aria-current="page"/g) ?? []).length, 1);
  assert.match(html, /class="tl-icon-badge__count"/);
});
```

- [ ] **Step 2: Run** `node --test test/navigation.test.mjs test/contracts-4b.test.mjs` — Expected: FAIL (Dateien
  fehlen).

- [ ] **Step 3: `sidebar.css`**

```css
/* Sidebar — Spec 2026-10-16 Welle 4b §4. Die Navigationsleiste: Einträge mit der Anatomie von tl-menu__item (Icon,
   Label, Badge), Gruppen mit dem Chevron von tl-toggle, unten der Knopf zum Ein- und Ausklappen. Zustände sind
   Attribute: data-tl-state~="collapsed" an der Wurzel, aria-current="page" an der aktuellen Seite,
   data-tl-state~="contains-current" am Kopf einer zugeklappten Gruppe, die sie enthält, aria-expanded am Gruppenkopf.
   Kompakt (data-tl-display="compact" an der AppShell) steht die Nav im modalen tl-drawer; dieses Stylesheet kennt
   keinen Breakpoint. */

.tl-sidebar {
  display: flex;
  width: 100%;
  height: 100%;
}
.tl-sidebar[hidden] { display: none; }

.tl-sidebar__nav {
  display: flex;
  flex: none;
  flex-direction: column;
  box-sizing: border-box;
  width: var(--tl-size-sidebar);
  border-inline-end: var(--tl-border-width-sm) solid var(--tl-border-separator);
  background: var(--tl-surface-layer);
  color: var(--tl-text-primary);
  overflow-x: hidden;
  transition: width var(--tl-duration-base) var(--tl-easing-standard);
}

/* Eingeklappt ist ein Eintrag ein Quadrat aus size-row, die Rail hat dazu space-2xs Rand je Seite — eine Rechnung aus
   zwei Maßen, die der Dichte folgt, kein drittes Maß. */
.tl-sidebar[data-tl-state~="collapsed"] .tl-sidebar__nav {
  width: calc(var(--tl-size-row) + 2 * var(--tl-space-2xs));
}

/* Im modalen Drawer (kompakt) füllt die Nav die Schublade; Breite, Fläche und Schatten trägt tl-drawer. */
.tl-drawer > .tl-sidebar__nav {
  flex: 1 1 auto;
  width: auto;
  min-height: 0;
  border-inline-end: 0;
}

.tl-sidebar__header,
.tl-sidebar__footer {
  flex: none;
  padding: var(--tl-space-xs) var(--tl-space-control-x);
}

.tl-sidebar__header {
  border-bottom: var(--tl-border-width-sm) solid var(--tl-border-separator);
}

.tl-sidebar__footer {
  border-top: var(--tl-border-width-sm) solid var(--tl-border-separator);
}

/* Eingeklappt ist die Rail so breit wie ein Icon-Eintrag: was im Kopf oder Fuß steht, sitzt mittig darunter. */
.tl-sidebar[data-tl-state~="collapsed"] .tl-sidebar__header,
.tl-sidebar[data-tl-state~="collapsed"] .tl-sidebar__footer {
  display: flex;
  justify-content: center;
  padding: var(--tl-space-2xs);
}

/* Die Einträge rollen in sich; ein Wischen, das das Ende erreicht, läuft nicht in die Seite weiter. */
.tl-sidebar__items {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
  padding: var(--tl-space-2xs);
  overflow-y: auto;
  overscroll-behavior: contain;
}

/* Der Eintrag ist ein tl-menu__item (Fläche, Zeigen, Ring innen, Deaktiviert); hier nur, was die Rail anders macht. */
.tl-sidebar__item {
  flex: none;
}

/* Die aktuelle Seite und der Kopf einer zugeklappten Gruppe, die sie enthält: die Fläche der Auswahl wie in Baum und
   Tabelle, kein Balken. Das Gewicht der Seite trägt die Typo-Klasse (tl-type-body-strong), die das TSX setzt; der
   Gruppenkopf bleibt im Grundgewicht. */
.tl-sidebar__item[aria-current="page"],
.tl-sidebar__item[data-tl-state~="contains-current"] {
  background: var(--tl-surface-interactive-selected);
}

.tl-sidebar[data-tl-state~="collapsed"] .tl-sidebar__item {
  justify-content: center;
  width: var(--tl-size-row);
  padding: 0;
}

/* Kopfzeilen: die des Menüs, mit Icon in einer Reihe; eingeklappt nur das Icon, mittig. */
.tl-sidebar .tl-menu__header {
  display: flex;
  align-items: center;
  gap: var(--tl-space-xs);
}

.tl-sidebar[data-tl-state~="collapsed"] .tl-menu__header {
  justify-content: center;
  padding-inline: 0;
}

/* Trenner: die Linie zeichnet das Part Divider, den Abstand die Hülle tl-menu__separator. */
.tl-sidebar__items .tl-menu__separator {
  margin-block: var(--tl-space-2xs);
}

/* Der Chevron einer Gruppe folgt tl-toggle: rechts heißt zu, bei aria-expanded="true" dreht er nach unten. */
.tl-sidebar__chevron {
  flex: none;
  margin-inline-start: auto;
  transition: rotate var(--tl-duration-fast) var(--tl-easing-standard);
}

.tl-sidebar__item[aria-expanded="true"] > .tl-sidebar__chevron {
  rotate: 90deg;
}

.tl-sidebar__children {
  display: flex;
  flex-direction: column;
  padding-inline-start: var(--tl-space-md);
}

/* Die Leiste am Fuß der Rail mit dem Knopf zum Ein- und Ausklappen (Part DisclosureToggle). */
.tl-sidebar__collapse {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  min-height: var(--tl-size-bar);
  border-top: var(--tl-border-width-sm) solid var(--tl-border-separator);
}

/* Der Inhalt: die aktive Ansicht füllt ihn und trägt ihren Abstand selbst (Abstandsmodell). */
.tl-sidebar__content {
  position: relative;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-width: 0;
  overflow: auto;
}

.tl-sidebar__content > * {
  flex: 1 1 0;
  min-height: 0;
}
```

- [ ] **Step 4: `bottom-bar.css`**

```css
/* BottomBar — Spec 2026-10-16 Welle 4b §5. Die Navigation am unteren Rand kleiner Bildschirme: Einträge mit Icon über
   Label. Die aktuelle Seite (aria-current="page") trägt die Fläche der Auswahl hinter dem Icon; das Label wird
   kräftig (tl-type-label-strong, im TSX). Höhe size-shell-bar wie die AppBar. */

.tl-bottom-bar {
  display: flex;
  flex: none;
  align-items: stretch;
  box-sizing: border-box;
  height: var(--tl-size-shell-bar);
  border-top: var(--tl-border-width-sm) solid var(--tl-border-separator);
  background: var(--tl-surface-layer);
}
.tl-bottom-bar[hidden] { display: none; }

/* Reset ohne Spezifität: die Typo-Klasse am Label gewinnt. */
:where(.tl-bottom-bar__item) { font: inherit; }

.tl-bottom-bar__item {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--tl-space-2xs);
  min-width: 0;
  padding: 0 var(--tl-space-2xs);
  border: 0;
  background: transparent;
  color: var(--tl-text-primary);
  cursor: pointer;
}

.tl-bottom-bar__item:hover {
  background: var(--tl-surface-interactive-hover);
}

.tl-bottom-bar__item:active {
  background: var(--tl-surface-interactive-active);
}

/* Der Eintrag liegt bündig an der Kante der Leiste: der Ring innen. */
.tl-bottom-bar__item:focus-visible {
  outline-offset: calc(-1 * var(--tl-focus-offset));
}

.tl-bottom-bar__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 var(--tl-space-sm);
  border-radius: var(--tl-radius-full);
}

.tl-bottom-bar__item[aria-current="page"] .tl-bottom-bar__icon {
  background: var(--tl-surface-interactive-selected);
}

.tl-bottom-bar__label {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

- [ ] **Step 5: Verträge** — `sidebar.contract.md`:

```markdown
# Vertrag: Sidebar

Die Navigationsleiste einer Anwendung: Seiten, Befehle, Gruppen; eingeklappt eine Icon-Rail, auf schmalen
Bildschirmen eine modale Schublade. TopLogic garantiert Tastatur, Landmarke und „hier bist du“, nicht das Aussehen.

## Zustand

Das Control ist `TLSidebar` (`ReactSidebarControl`).

| Schlüssel | Typ | Bedeutung |
|---|---|---|
| `items` | Liste | Einträge: `nav` (Seite), `command` (Befehl), `header`, `separator`, `group` mit `children` und `expanded` |
| `activeItemId` | string | die aktuelle Seite: `aria-current="page"` |
| `collapsed` | boolean | eingeklappt (gespeichert): `data-tl-state~="collapsed"` |
| `drawerOpen` | boolean | kompakt: die Schublade ist offen (flüchtig) |
| `headerContent`, `footerContent` | Kind, optional | Kopf und Fuß; eingeklappt `headerCollapsedContent`, `footerCollapsedContent` |
| `activeContent` | Kind | die Ansicht der aktuellen Seite |

## Aktionen

| Aktion | Wann |
|---|---|
| `selectItem` | Klick, Enter oder Leertaste auf einer Seite |
| `executeCommand` | dasselbe auf einem Befehl |
| `toggleGroup` | eine Gruppe auf- oder zuklappen (ausgeklappte Rail) |
| `toggleCollapse` | der Knopf am Fuß der Rail |
| `toggleDrawer` | Escape oder Klick auf den Scrim schließt die Schublade; der Hamburger (`TLDrawerToggle`) sendet `toggle` |

## Verhalten

- **Rail:** Roving-Tabindex; Pfeil auf/ab zyklisch, Pos1, Ende; Enter und Leertaste lösen aus; Pfeil rechts/links
  öffnet und schließt eine Gruppe. Eingeklappt öffnet eine Gruppe ihr Flyout: das Menü (`Menu`, `role="menu"`) an der
  Lage `right-start`, mit dem ersten Eintrag im Fokus; Escape und Außenklick geben den Fokus an den Gruppenknopf zurück.
- **Hier bist du:** die aktuelle Seite trägt `aria-current="page"` (Fläche und Gewicht); liegt sie in einer
  zugeklappten Gruppe, trägt der Gruppenkopf `data-tl-state~="contains-current"` (Fläche).
- **Kompakt** (die AppShell meldet `compact`): die Nav steht in einem `tl-drawer` mit Scrim (`tl-dialog`),
  `role="dialog"`, `aria-modal="true"`; der Fokus ist gefangen, Escape und Scrim schließen, der Fokus kehrt zum
  Hamburger zurück. Der Hamburger trägt `aria-expanded` und, solange offen, `aria-controls` auf die Nav.

## Tokens

| Teil | Token |
|---|---|
| Fläche, Linie | `--tl-surface-layer`, `--tl-border-separator` |
| Breite | `--tl-size-sidebar`; eingeklappt `--tl-size-row` plus `--tl-space-2xs` je Seite |
| Aktuelle Seite | `--tl-surface-interactive-selected`, `tl-type-body-strong` |
| Bewegung | Breite `--tl-duration-base` `--tl-easing-standard`; Chevron `--tl-duration-fast` |
| Fuß | `--tl-size-bar` |

## Attribute

| Attribut | Wann |
|---|---|
| `tl-sidebar` | Wurzel |
| `data-tl-state~="collapsed"` | eingeklappt |
| `tl-sidebar__nav` | an `<nav aria-label>`; `id` = Control-Id + `-nav` |
| `tl-menu__item tl-sidebar__item` | jeder Eintrag, `button type="button"` |
| `aria-current="page"` | an der aktuellen Seite |
| `aria-expanded` | am Gruppenkopf; eingeklappt mit `aria-haspopup="menu"` (Flyout offen) |
| `data-tl-state~="contains-current"` | am Kopf einer zugeklappten Gruppe mit der aktuellen Seite |
| `tl-sidebar__chevron` | Chevron im Gruppenkopf |
| `tl-icon-badge` | eingeklappt um Icon und Zähler |
| `tl-sidebar__collapse` | um den Knopf am Fuß; `aria-controls` des Knopfs auf die Nav |
| `tl-drawer tl-drawer--start tl-drawer--narrow` in `tl-dialog`, `role="dialog"`, `aria-modal="true"` | kompakt, offen |

## Konformität

Eine Sidebar besteht den Vertrag, wenn die aktuelle Seite `aria-current="page"` trägt, jeder Gruppenkopf
`aria-expanded`, die Rail per Tastatur vollständig bedienbar ist, kompakt die Schublade modal ist und den Fokus
zurückgibt und im Klassen-Gate keine Klasse ohne `tl-`-Präfix bleibt.
```

  `bottom-bar.contract.md`:

```markdown
# Vertrag: BottomBar

Die Navigation am unteren Rand kleiner Bildschirme: wenige Seiten mit Icon und Label. TopLogic garantiert Landmarke
und „hier bist du“, nicht das Aussehen.

## Zustand

Das Control ist `TLBottomBar` (`ReactBottomBarControl`).

| Schlüssel | Typ | Bedeutung |
|---|---|---|
| `items` | Liste `{id, label, icon, badge?}` | Einträge; `icon` als Theme-Icon oder CSS-Klasse |
| `activeItemId` | string | die aktuelle Seite: `aria-current="page"` |

## Aktionen

| Aktion | Wann |
|---|---|
| `selectItem` | Klick, Enter oder Leertaste auf einem anderen als dem aktuellen Eintrag |

## Tokens

| Teil | Token |
|---|---|
| Höhe | `--tl-size-shell-bar` |
| Fläche, Linie | `--tl-surface-layer`, `--tl-border-separator` |
| Aktuelle Seite | `--tl-surface-interactive-selected` hinter dem Icon, Label `tl-type-label-strong` |
| Icon, Label | `tl-icon-md`, `tl-type-label` |

## Attribute

| Attribut | Wann |
|---|---|
| `tl-bottom-bar` | an `<nav>` mit übersetztem `aria-label` |
| `tl-bottom-bar__item` | jeder Eintrag, `button type="button"` |
| `aria-current="page"` | an der aktuellen Seite |
| `tl-bottom-bar__icon` | um das Icon; mit Zähler darin `tl-icon-badge` |
| `tl-bottom-bar__label` | um das Label |

## Konformität

Eine BottomBar besteht den Vertrag, wenn sie `<nav>` mit übersetztem Namen ist, genau die aktuelle Seite
`aria-current="page"` trägt und im Klassen-Gate keine Klasse ohne `tl-`-Präfix bleibt.
```

  In `menu.contract.md` am Ende von „## Verhalten“ (oder, fehlt der Abschnitt, vor „## Tokens“) die Zeile anfügen:
  `- Die Rail der Sidebar (`tl-sidebar`) trägt ihre Einträge in derselben Anatomie (`tl-menu__item`, `tl-menu__header`, `tl-menu__separator`); dort heißt `aria-current="page"` „hier bist du“ und bekommt zusätzlich die Fläche der Auswahl.`

- [ ] **Step 6: Specimen** — `sidebar.spec.html` (Gerüst wie Task 2) mit drei Sektionen. Stil-Block:

```html
<style>
  .stage { position: relative; height: 26rem; overflow: hidden; transform: translateZ(0); background: var(--tl-surface-base); }
  .stage .tl-dialog { position: absolute; }
  .stage .tl-drawer { position: absolute; }
  .stage .tl-popover { position: absolute; inset-inline-start: 3.5rem; top: 4rem; }
  .stage p { margin: var(--tl-space-md); }
</style>
```

  Sektion 1 „Ausgeklappt: aktuelle Seite, Befehl deaktiviert, Gruppe offen, Gruppe zu mit der aktuellen Seite darin“:

```html
    <div class="stage">
      <div class="tl-sidebar">
        <nav id="sb1-nav" class="tl-sidebar__nav" aria-label="Seitenleisten-Navigation">
          <div class="tl-sidebar__header"><span class="tl-type-body-strong">TopLogic</span></div>
          <div class="tl-sidebar__items">
            <button type="button" class="tl-menu__item tl-type-body tl-sidebar__item" tabindex="0"><i class="tl-menu__icon tl-icon-sm bi bi-house" aria-hidden="true"></i><span class="tl-menu__label">Start</span></button>
            <button type="button" class="tl-menu__item tl-type-body-strong tl-sidebar__item" tabindex="-1" aria-current="page"><i class="tl-menu__icon tl-icon-sm bi bi-inbox" aria-hidden="true"></i><span class="tl-menu__label">Eingang</span><span class="tl-badge tl-type-label-strong tl-nums">3</span></button>
            <button type="button" class="tl-menu__item tl-type-body tl-sidebar__item" tabindex="-1" disabled data-tooltip="text:Keine Berechtigung"><i class="tl-menu__icon tl-icon-sm bi bi-trash" aria-hidden="true"></i><span class="tl-menu__label">Papierkorb leeren</span></button>
            <div class="tl-menu__separator" role="none"><hr class="tl-divider"></div>
            <div class="tl-menu__header tl-type-label" role="presentation">Verwaltung</div>
            <div class="tl-sidebar__group">
              <button type="button" class="tl-menu__item tl-type-body tl-sidebar__item" tabindex="-1" aria-expanded="true"><i class="tl-menu__icon tl-icon-sm bi bi-people" aria-hidden="true"></i><span class="tl-menu__label">Benutzer</span><i class="tl-sidebar__chevron tl-icon-sm bi bi-chevron-right" aria-hidden="true"></i></button>
              <div class="tl-sidebar__children">
                <button type="button" class="tl-menu__item tl-type-body tl-sidebar__item" tabindex="-1"><span class="tl-menu__label">Konten</span></button>
                <button type="button" class="tl-menu__item tl-type-body tl-sidebar__item" tabindex="-1"><span class="tl-menu__label">Rollen</span></button>
              </div>
            </div>
          </div>
          <div class="tl-sidebar__collapse"><button type="button" class="tl-toggle tl-toggle--end" aria-expanded="true" aria-controls="sb1-nav" aria-label="Seitenleiste einklappen" data-tooltip="text:Seitenleiste einklappen"><i class="tl-icon-sm bi bi-chevron-right" aria-hidden="true"></i></button></div>
        </nav>
        <div class="tl-sidebar__content"><p class="tl-type-body">Ansicht der aktuellen Seite.</p></div>
      </div>
    </div>
```

  Sektion 1b „Zugeklappte Gruppe mit der aktuellen Seite darin“ (eigene Bühne, damit jede Bühne genau eine
  aktuelle Seite zeigt):

```html
    <div class="stage">
      <div class="tl-sidebar">
        <nav id="sb1b-nav" class="tl-sidebar__nav" aria-label="Seitenleisten-Navigation">
          <div class="tl-sidebar__items">
            <button type="button" class="tl-menu__item tl-type-body tl-sidebar__item" tabindex="0"><i class="tl-menu__icon tl-icon-sm bi bi-house" aria-hidden="true"></i><span class="tl-menu__label">Start</span></button>
            <div class="tl-sidebar__group">
              <button type="button" class="tl-menu__item tl-type-body tl-sidebar__item" tabindex="-1" aria-expanded="false" data-tl-state="contains-current"><i class="tl-menu__icon tl-icon-sm bi bi-gear" aria-hidden="true"></i><span class="tl-menu__label">Einstellungen</span><i class="tl-sidebar__chevron tl-icon-sm bi bi-chevron-right" aria-hidden="true"></i></button>
            </div>
          </div>
        </nav>
        <div class="tl-sidebar__content"><p class="tl-type-body">Die aktuelle Seite liegt in „Einstellungen“; der Kopf zeigt es.</p></div>
      </div>
    </div>
```

  Sektion 2 „Eingeklappt: Zähler an der Ecke, Gruppe mit offenem Flyout“:

```html
    <div class="stage">
      <div class="tl-sidebar" data-tl-state="collapsed">
        <nav id="sb2-nav" class="tl-sidebar__nav" aria-label="Seitenleisten-Navigation">
          <div class="tl-sidebar__items">
            <button type="button" class="tl-menu__item tl-type-body-strong tl-sidebar__item" tabindex="0" aria-current="page" aria-label="Eingang" data-tooltip="text:Eingang"><span class="tl-icon-badge"><i class="tl-menu__icon tl-icon-sm bi bi-inbox" aria-hidden="true"></i><span class="tl-icon-badge__count"><span class="tl-badge tl-type-label-strong tl-nums">3</span></span></span></button>
            <div class="tl-sidebar__group">
              <button type="button" class="tl-menu__item tl-type-body tl-sidebar__item" tabindex="-1" aria-haspopup="menu" aria-expanded="true" aria-label="Verwaltung" data-tooltip="text:Verwaltung"><i class="tl-menu__icon tl-icon-sm bi bi-people" aria-hidden="true"></i></button>
            </div>
          </div>
          <div class="tl-sidebar__collapse"><button type="button" class="tl-toggle tl-toggle--end" aria-expanded="false" aria-controls="sb2-nav" aria-label="Seitenleiste ausklappen" data-tooltip="text:Seitenleiste ausklappen"><i class="tl-icon-sm bi bi-chevron-right" aria-hidden="true"></i></button></div>
        </nav>
        <div class="tl-sidebar__content"><p class="tl-type-body">Das Flyout ist das Menü an der Lage right-start.</p></div>
      </div>
      <div class="tl-popover tl-menu" role="menu">
        <div class="tl-menu__header tl-type-label" role="presentation">Verwaltung</div>
        <button type="button" class="tl-menu__item tl-type-body" role="menuitem" tabindex="0"><span class="tl-menu__label">Konten</span></button>
        <button type="button" class="tl-menu__item tl-type-body-strong" role="menuitem" tabindex="-1" aria-current="page"><span class="tl-menu__label">Rollen</span></button>
      </div>
    </div>
```

  Sektion 3 „Kompakt: die Nav im modalen Drawer“:

```html
    <div class="stage">
      <div class="tl-sidebar">
        <div class="tl-dialog">
          <aside class="tl-drawer tl-drawer--start tl-drawer--narrow" data-tl-state="open" role="dialog" aria-modal="true" aria-label="Seitenleisten-Navigation" tabindex="-1">
            <nav id="sb3-nav" class="tl-sidebar__nav" aria-label="Seitenleisten-Navigation">
              <div class="tl-sidebar__items">
                <button type="button" class="tl-menu__item tl-type-body-strong tl-sidebar__item" tabindex="0" aria-current="page"><i class="tl-menu__icon tl-icon-sm bi bi-inbox" aria-hidden="true"></i><span class="tl-menu__label">Eingang</span></button>
                <button type="button" class="tl-menu__item tl-type-body tl-sidebar__item" tabindex="-1"><i class="tl-menu__icon tl-icon-sm bi bi-house" aria-hidden="true"></i><span class="tl-menu__label">Start</span></button>
              </div>
            </nav>
          </aside>
        </div>
        <div class="tl-sidebar__content"><p class="tl-type-body">Die Seite liegt unter dem Scrim.</p></div>
      </div>
    </div>
```

  `bottom-bar.spec.html` — eine Sektion, Bühne `max-width: 24rem`:

```html
    <div class="stage">
      <nav class="tl-bottom-bar" aria-label="Navigation unten">
        <button type="button" class="tl-bottom-bar__item" aria-current="page"><span class="tl-bottom-bar__icon"><i class="tl-icon-md bi bi-house" aria-hidden="true"></i></span><span class="tl-bottom-bar__label tl-type-label-strong">Start</span></button>
        <button type="button" class="tl-bottom-bar__item"><span class="tl-bottom-bar__icon"><span class="tl-icon-badge"><i class="tl-icon-md bi bi-inbox" aria-hidden="true"></i><span class="tl-icon-badge__count"><span class="tl-badge tl-type-label-strong tl-nums" role="img" aria-label="3 neue">3</span></span></span></span><span class="tl-bottom-bar__label tl-type-label">Eingang</span></button>
        <button type="button" class="tl-bottom-bar__item"><span class="tl-bottom-bar__icon"><i class="tl-icon-md bi bi-person" aria-hidden="true"></i></span><span class="tl-bottom-bar__label tl-type-label">Profil</span></button>
      </nav>
    </div>
```

  Im `app-shell.spec.html` (Task 2) die leere BottomBar im Fuß durch diese drei Einträge ersetzen. In
  `specimen/index.html` die Links `Sidebar →` und `BottomBar →` ergänzen. `<hr class="tl-divider">` vor dem Einfügen
  gegen `divider.spec.html` abgleichen.

- [ ] **Step 7: Gates** — `node tools/generate.mjs && node tools/lint-css.mjs && node tools/publish-to-worktree.mjs &&
  node --test 2>&1 | grep -E '^ℹ (pass|fail)|^✖'` — Expected: alles grün, `focus-clip` über alle neuen Seiten in
  beiden Dichten. Meldet `focus-clip` die Rail (`tl-sidebar__nav`/`__items` schneidet einen Ring), zuerst prüfen, ob
  der Ring dort innen liegt (`tl-menu__item:focus-visible` hat `outline-offset` negativ, `tl-toggle` hat 8 px Luft
  in der Leiste); eine Regel nur dann ändern, wenn die Messung einen Ring außen zeigt.

- [ ] **Step 8: Sichtprüfung im Specimen** — `node tools/serve.mjs`, die vier Seiten hell/dunkel, normal/kompakt
  ansehen (Claude-in-Chrome): Fläche der aktuellen Seite sichtbar, Kopf der zugeklappten Gruppe getönt ohne Gewicht,
  Chevron rechts/unten, Rail eingeklappt mit Zähler an der Ecke, Drawer mit Scrim, AppBar flach/erhöht, BottomBar mit
  Fläche hinter dem Icon. Bilder nicht ins Repo.

- [ ] **Step 9: Commit** (Paket und Paketkopie im Worktree).

```bash
git add design-system && git commit -m "Ticket #29866: Paket -- tl-sidebar und tl-bottom-bar mit Vertrag und Specimen; aktuelle Seite als Fläche, Chevron wie tl-toggle, Rail eingeklappt aus size-row; Verträge-Test 4b

Co-Authored-By: <Modell> <noreply@anthropic.com>"
```

---
### Task 4: Engine — Bridge: Anzeigeklasse, `right-start`, `MenuItem`

Alle Engine-Pfade relativ zu `_Working-Tree/tl8-wt-29584/com.top_logic.layout.react/` (kurz `R/`), Branch
`CWS/CWS_29866_design_system_welle_4b`.

**Files:**
- Create: `R/react-src/bridge/display-class.ts`
- Modify: `R/react-src/bridge/popover.ts:21`, `R/react-src/bridge-entry.ts` (nach Zeile 77),
  `R/react-src/controls/menu/Menu.tsx` (`MenuItem`)

**Interfaces:**
- Produces: `type DisplayClass = 'compact' | 'regular'`; `DisplayClassProvider({ value, children })`;
  `useDisplayClass(): DisplayClass` (Default `regular`) — exportiert aus `tl-react-bridge`.
  `PopoverOptions['placement']` kennt `'right-start'`.
  `MenuItem` Props zusätzlich `current?: boolean | 'page'`, `trailing?: React.ReactNode`, `tooltip?: string`.

- [ ] **Step 1: `display-class.ts`**

```ts
import React, { createContext, useContext } from 'react';

/**
 * The display class of the application: `compact` on a small screen, `regular` otherwise.
 *
 * <p>The app shell measures it - the one place the breakpoint stands (TLAppShell) - and gives it to everything
 * inside. A component rendered outside a shell is `regular`.</p>
 */
export type DisplayClass = 'compact' | 'regular';

const DisplayClassContext = createContext<DisplayClass>('regular');

/** Gives the components inside the display class the shell measured. */
export function DisplayClassProvider({ value, children }: React.PropsWithChildren<{ value: DisplayClass }>) {
  return React.createElement(DisplayClassContext.Provider, { value }, children);
}

/** The display class of the shell around the rendered component; `regular` outside a shell. */
export function useDisplayClass(): DisplayClass {
  return useContext(DisplayClassContext);
}
```

- [ ] **Step 2: Export** — in `bridge-entry.ts` nach `export type { PopoverAnchor, PopoverOptions } from './bridge/popover';`:

```ts
export { DisplayClassProvider, useDisplayClass } from './bridge/display-class';
export type { DisplayClass } from './bridge/display-class';
```

- [ ] **Step 3: `right-start`** — in `popover.ts` Zeile 21:
  `placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'right-start';` und im Kopfkommentar des Typs nichts
  weiter; `offset(gap)` gilt dann seitlich, `flip()` wechselt nach links, `shift()` hält die Höhe im Fenster.

- [ ] **Step 4: `MenuItem`** — in `Menu.tsx` `MenuItem` ersetzen (Import um `tooltipProps` ergänzen):

```tsx
/**
 * An entry of a menu. `current` marks the entry in force (`true`, reported as aria-current="true") or the page the
 * user is on (`'page'`, the flyout of a sidebar group). `trailing` stands after the label (the badge of a sidebar
 * page); `tooltip` explains a disabled entry.
 */
export const MenuItem: React.FC<{ id?: string; icon?: string; label: string; disabled?: boolean; current?: boolean | 'page';
  danger?: boolean; className?: string; trailing?: React.ReactNode; tooltip?: string; onSelect: () => void }> =
  ({ id, icon, label, disabled, current, danger, className, trailing, tooltip, onSelect }) => (
    <button
      type="button"
      id={id}
      className={menuItemClassName(!!current, className, danger)}
      role="menuitem"
      aria-current={current === 'page' ? 'page' : current ? 'true' : undefined}
      disabled={disabled}
      tabIndex={-1}
      onClick={onSelect}
      {...tooltipProps(tooltip)}
    >
      {icon && <ThemeIcon encoded={icon} className="tl-menu__icon tl-icon-sm" />}
      <span className="tl-menu__label">{label}</span>
      {trailing}
    </button>
  );
```

- [ ] **Step 5: Prüfen** — `cd _Working-Tree/tl8-wt-29584/com.top_logic.layout.react && npx tsc --noEmit -p tsconfig.json`
  — Expected: 0 Fehler. `grep -rn "MenuItem" react-src | grep -v "Menu.tsx"` — jeder Aufrufer übergibt `current` als
  boolean oder gar nicht (unverändert gültig).

- [ ] **Step 6: Commit** (Engine)

```bash
git -C _Working-Tree/tl8-wt-29584 add -A com.top_logic.layout.react/react-src
git -C _Working-Tree/tl8-wt-29584 commit -m "Ticket #29866: Bridge -- the display class the app shell measures as context, popovers placed right-start, menu entries for the current page with a trailing badge and a tooltip.

Co-Authored-By: <Modell> <noreply@anthropic.com>"
```

---

### Task 5: Engine — AppShell und Hamburger (§3, Abweichung 2)

**Files:**
- Modify: `R/react-src/controls/TLAppShell.tsx`, `R/react-src/controls/TLDrawerToggle.tsx`
- Modify: `R/src/main/java/com/top_logic/layout/react/control/sidebar/DrawerToggleControl.java`,
  `ReactSidebarControl.java` (Felder, `toggleDrawer`, `closeDrawerIfOpen`)
- Create: `R/src/test/java/test/com/top_logic/layout/react/control/sidebar/TestDrawerToggleState.java`
- Modify: `R/src/main/webapp/style/tlReactControls.css` (Blöcke `TLAppShell` und `Drawer toggle (…)` streichen)
- Modify: `design-system/test/ratchet.json` (zwei Blöcke streichen)
- Modify: `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/app.view.xml:104-108` (Kommentar)

**Interfaces:**
- Consumes: `DisplayClassProvider`, `useDisplayClass` (Task 4); Klassen `tl-app-shell*` (Task 2).
- Produces: Zustand des Hamburgers `{ open: boolean, controls: string }`; `ReactSidebarControl.setDrawerToggle(DrawerToggleControl)`
  (package-private); `DrawerToggleControl.setOpen(boolean)` (package-private).

- [ ] **Step 1: Kontext erreicht den Slot?** — prüfen, wie `SlotContentControl` und der Platzhalter `<slot>` den
  Inhalt rendern (`grep -rn "class SlotContentControl\|TLSlot" R/src/main/java R/react-src`): steht der Hamburger im
  selben React-Baum wie die AppShell (`TLChild`, oder `createPortal` aus einer Komponente unter der Shell), erreicht
  ihn `useDisplayClass()`. Rendert der Slot einen **eigenen** Root (`createRoot`), Arbeit anhalten und melden — dann
  muss die Anzeigeklasse zusätzlich über das Attribut an `document.documentElement` laufen (Entscheidung beim
  Orchestrator).

- [ ] **Step 2: Failing Java-Test** — `TestDrawerToggleState.java`:

```java
/*
 * SPDX-FileCopyrightText: 2026 (c) Business Operation Systems GmbH <info@top-logic.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-BOS-TopLogic-1.0
 */
package test.com.top_logic.layout.react.control.sidebar;

import java.util.List;
import java.util.Map;

import junit.framework.TestCase;

import com.top_logic.basic.json.JSON;
import com.top_logic.layout.react.DefaultReactContext;
import com.top_logic.layout.react.ReactContext;
import com.top_logic.layout.react.control.sidebar.DrawerToggleControl;
import com.top_logic.layout.react.control.sidebar.ReactSidebarControl;
import com.top_logic.layout.react.servlet.SSEUpdateQueue;
import com.top_logic.layout.react.window.ReactWindowRegistry;

/**
 * Tests that the hamburger button of a {@link ReactSidebarControl} reports whether the drawer it opens is open, and
 * which navigation it controls.
 *
 * <p>
 * A screen reader announces the button as expanded or collapsed; without the state the button cannot say it.
 * </p>
 */
public class TestDrawerToggleState extends TestCase {

	/** The button names the navigation of its sidebar and starts out closed. */
	public void testTheToggleStartsClosedAndNamesTheNavigation() {
		ReactContext context = context();
		ReactSidebarControl sidebar = sidebar(context);
		DrawerToggleControl toggle = new DrawerToggleControl(context, sidebar);

		assertEquals(Boolean.FALSE, state(toggle).get("open"));
		assertEquals(sidebar.getID() + "-nav", state(toggle).get("controls"));
	}

	/** Opening and closing the drawer reaches the button. */
	public void testTheToggleFollowsTheDrawer() {
		ReactContext context = context();
		ReactSidebarControl sidebar = sidebar(context);
		DrawerToggleControl toggle = new DrawerToggleControl(context, sidebar);

		sidebar.toggleDrawer();
		assertEquals("The drawer was opened, but the button still reports it closed.",
			Boolean.TRUE, state(toggle).get("open"));

		sidebar.toggleDrawer();
		assertEquals(Boolean.FALSE, state(toggle).get("open"));
	}

	private static Map<?, ?> state(DrawerToggleControl toggle) {
		try {
			return (Map<?, ?>) JSON.fromString(toggle.stateAsJSON());
		} catch (JSON.ParseException ex) {
			throw new AssertionError("The state sent to the client is not JSON.", ex);
		}
	}

	private static ReactContext context() {
		return new DefaultReactContext("", "test", new SSEUpdateQueue(), new ReactWindowRegistry("test"));
	}

	private static ReactSidebarControl sidebar(ReactContext context) {
		return new ReactSidebarControl(context, List.of(), null, false, Map.of(),
			null, null, null, null, null, null);
	}

}
```

  (Konstruktor wie in `TestSidebarGroupState`; ist `stateAsJSON()` an `DrawerToggleControl` nicht sichtbar, dieselbe
  Methode wie dort über `ReactControl` nutzen.)

- [ ] **Step 3: Run** `cd _Working-Tree/tl8-wt-29584 && mvn -B test -DskipTests=false -pl com.top_logic.layout.react -Dtest=test.com.top_logic.layout.react.control.sidebar.TestDrawerToggleState 2>&1 | tail -20`
  — Expected: FAIL (`open`/`controls` sind `null`).

- [ ] **Step 4: Java** — `DrawerToggleControl.java`: Klassen-JavaDoc ersetzen und Zustand ergänzen:

```java
/**
 * Hamburger button that opens and closes the drawer of a target {@link ReactSidebarControl}.
 *
 * <p>
 * Placed inside a {@code SlotContentControl} contributing to the slot the sidebar addresses via
 * {@code drawer-open-slot-name}, so the button surfaces in the matched placeholder (typically the app bar's leading
 * area) while the sidebar itself lives in the content area. The client renders the button only while the app shell
 * is compact; there the sidebar's navigation is a modal drawer this button opens. The drawer state is independent of
 * the desktop rail's persisted {@code collapsed} preference.
 * </p>
 *
 * <p>
 * State: {@code open} - whether the drawer is open (the button's {@code aria-expanded}); {@code controls} - the id of
 * the sidebar's navigation ({@code aria-controls} while open).
 * </p>
 */
public class DrawerToggleControl extends ReactControl {

	private static final String REACT_MODULE = "TLDrawerToggle";

	/** State key: whether the drawer is open. */
	private static final String OPEN = "open";

	/** State key: the id of the navigation the button opens. */
	private static final String CONTROLS = "controls";

	private final ReactSidebarControl _target;

	/**
	 * Creates a drawer-toggle button bound to the given sidebar.
	 *
	 * @param target
	 *        The sidebar whose drawer this button opens and closes.
	 */
	public DrawerToggleControl(ReactContext context, ReactSidebarControl target) {
		super(context, null, REACT_MODULE);
		_target = target;
		putState(OPEN, Boolean.FALSE);
		putState(CONTROLS, target.getID() + "-nav");
		target.setDrawerToggle(this);
	}

	/**
	 * Reports whether the drawer this button opens is open.
	 */
	void setOpen(boolean open) {
		putState(OPEN, Boolean.valueOf(open));
	}

	/**
	 * Handles toggle clicks from the client.
	 */
	@ReactCommandHandler("toggle")
	void handleToggle() {
		_target.toggleDrawer();
	}
}
```

  `ReactSidebarControl.java`: Feld nach `_drawerOpen` (Zeile 123):

```java
	/**
	 * The hamburger button opening the drawer, told whenever the drawer opens or closes; {@code null} without one.
	 */
	private DrawerToggleControl _drawerToggle;
```

  Methode nach `setDrawerToggleContribution(…)`:

```java
	/**
	 * Registers the button that opens the drawer, so it can report the drawer's state.
	 */
	void setDrawerToggle(DrawerToggleControl toggle) {
		_drawerToggle = toggle;
	}

	private void updateDrawerToggle() {
		if (_drawerToggle != null) {
			_drawerToggle.setOpen(_drawerOpen);
		}
	}
```

  und in `closeDrawerIfOpen()` sowie `toggleDrawer()` nach `putState(DRAWER_OPEN, …)` je `updateDrawerToggle();`.
  JavaDoc von `toggleDrawer()`: „Triggered by the hamburger button in the app bar, by Escape in the drawer or by a
  click on its scrim.“

- [ ] **Step 5: Run** den Test aus Step 3 — Expected: PASS (2 Tests).

- [ ] **Step 6: `TLAppShell.tsx`** — vollständig:

```tsx
import { React, useTLState, useTLCommand, TLChild, useFill, FillBarrier, rootClassName, DisplayClassProvider } from 'tl-react-bridge';
import type { TLCellProps, DisplayClass } from 'tl-react-bridge';

/**
 * Viewport width (px) at or below which the UI is COMPACT.
 *
 * The one place the breakpoint stands: the shell reports it to the server, gives it to the components inside
 * (useDisplayClass) and marks its root (data-tl-display). No stylesheet repeats it.
 */
const COMPACT_MAX_WIDTH = 768;

const QUERY = `(max-width: ${COMPACT_MAX_WIDTH}px)`;

/**
 * Application shell with header / notices / content / footer layout and built-in snackbar.
 *
 * State:
 * - header:   ChildDescriptor | null  (optional, fixed height)
 * - notices:  ChildDescriptor | null  (optional, system-wide notices between header and content)
 * - content:  ChildDescriptor         (required, fills the rest; the main landmark)
 * - footer:   ChildDescriptor | null  (optional, fixed height)
 * - snackbar: ChildDescriptor         (built-in notification service)
 *
 * Always fills its container - the shell spans the viewport, so the app bar stays put and overflowing content
 * scrolls inside the content region rather than moving the page. That region is bounded by it and ends the fill
 * chain.
 */
const TLAppShell: React.FC<TLCellProps> = ({ controlId }) => {
  const state = useTLState();
  const sendCommand = useTLCommand();
  const fillClass = useFill(true);
  const [displayClass, setDisplayClass] = React.useState<DisplayClass>(
    () => (window.matchMedia(QUERY).matches ? 'compact' : 'regular'));

  // Report the display class to the server once on mount and whenever the breakpoint is crossed, so adaptive
  // controls can switch presentation; the components inside read it from the context.
  React.useEffect(() => {
    const query = window.matchMedia(QUERY);
    const report = (compact: boolean) => {
      setDisplayClass(compact ? 'compact' : 'regular');
      sendCommand('reportDisplayClass', { displayClass: compact ? 'COMPACT' : 'REGULAR' });
    };
    report(query.matches);
    const onChange = (e: MediaQueryListEvent) => report(e.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, [sendCommand]);

  const header = state.header as unknown;
  const notices = state.notices as unknown;
  const content = state.content as unknown;
  const footer = state.footer as unknown;
  const snackbar = state.snackbar as unknown;

  return (
    <div id={controlId} className={rootClassName(state, 'tl-app-shell', fillClass)} data-tl-display={displayClass}>
      <DisplayClassProvider value={displayClass}>
        {!!header && (
          <div className="tl-app-shell__header">
            <TLChild control={header} />
          </div>
        )}
        {!!notices && (
          <div className="tl-app-shell__notices">
            <TLChild control={notices} />
          </div>
        )}
        <main className="tl-app-shell__content">
          <FillBarrier>
            <TLChild control={content} />
          </FillBarrier>
        </main>
        {!!footer && (
          <div className="tl-app-shell__footer">
            <TLChild control={footer} />
          </div>
        )}
        <TLChild control={snackbar} />
      </DisplayClassProvider>
    </div>
  );
};

export default TLAppShell;
```

- [ ] **Step 7: `TLDrawerToggle.tsx`** — vollständig:

```tsx
import { React, useTLCommand, useI18N, rootClassName, usePart, useDisplayClass } from 'tl-react-bridge';
import type { TLCellProps } from 'tl-react-bridge';

const I18N_KEYS = {
  'js.sidebar.openDrawer': 'Open navigation',
};

/** Icon of the button opening the drawer. */
const MENU_ICON = 'css:fa-solid fa-bars';

/**
 * Hamburger button that opens and closes the drawer of a target sidebar by sending {@code toggle}. Rendered into the
 * slot the sidebar addresses via {@code drawer-open-slot-name} (typically the app bar's leading slot).
 *
 * The button exists only while the app shell is compact (useDisplayClass): on a wide screen the sidebar is a rail
 * and there is no drawer to open.
 *
 * State:
 * - open: boolean - whether the drawer is open (aria-expanded)
 * - controls: string - the id of the sidebar's navigation (aria-controls, set while the drawer is open; closed, the
 *   navigation is not in the document)
 */
const TLDrawerToggle: React.FC<TLCellProps> = ({ controlId, state }) => {
  const sendCommand = useTLCommand();
  const i18n = useI18N(I18N_KEYS);
  const Button = usePart('Button');
  const compact = useDisplayClass() === 'compact';

  if (!compact) {
    return null;
  }
  const open = state.open === true;
  return (
    <Button
      id={controlId}
      className={rootClassName(state) || undefined}
      label={i18n['js.sidebar.openDrawer']}
      image={MENU_ICON}
      display="icon-only"
      appearance="ghost"
      aria-expanded={open}
      aria-controls={open ? (state.controls as string) : undefined}
      onClick={() => sendCommand('toggle', {})}
    />
  );
};

export default TLDrawerToggle;
```

  (Tippt `tsc` `state.open` als `unknown`, `state` wie in `TLDrawer.tsx` über `useTLState()` lesen statt aus den Props.)

- [ ] **Step 8: Altbestand** — in `R/src/main/webapp/style/tlReactControls.css` die Blöcke
  `/* --- Drawer toggle (mobile hamburger contributed via the sidebar's drawer-open-slot-name) --- */` (bis vor die
  nächste Überschrift) und `/* --- TLAppShell --- */` (samt `.tlAppShell .tl-breadcrumb`) vollständig löschen. In
  `design-system/test/ratchet.json` beide Schlüssel aus `blocks` streichen.

- [ ] **Step 9: View-Kommentar** — `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/app.view.xml` Zeilen
  104–108: „CSS makes it visible only at small viewports“ ersetzen durch „it renders only while the app shell is
  compact (below its breakpoint)“. Danach `mvn exec:java@normalize-layouts` nicht nötig (nur Kommentartext); die
  Einrückung mit Tabs beibehalten.

- [ ] **Step 10: Prüfen** — `npx tsc --noEmit -p tsconfig.json` (0 Fehler);
  `grep -rn "tlAppShell\|tlDrawerToggle" R/react-src R/src/main/webapp/style` — leer.
  Paket: `cd design-system && node --test test/ratchet.test.mjs` — grün.

- [ ] **Step 11: Commit** (Engine, dann Paket)

```bash
git -C _Working-Tree/tl8-wt-29584 add -A com.top_logic.layout.react com.top_logic.layout.view/src/main/webapp/WEB-INF/views/app.view.xml
git -C _Working-Tree/tl8-wt-29584 commit -m "Ticket #29866: The app shell measures the breakpoint alone -- display class as context and data-tl-display, content as main landmark; the hamburger exists only while compact and reports aria-expanded and aria-controls.

Co-Authored-By: <Modell> <noreply@anthropic.com>"
git add design-system/test/ratchet.json && git commit -m "Ticket #29866: Ratsche -- TLAppShell und Drawer toggle gestrichen

Co-Authored-By: <Modell> <noreply@anthropic.com>"
```

---

### Task 6: Engine — Sidebar (§4)

**Files:**
- Modify: `R/react-src/controls/TLSidebar.tsx` (vollständig, siehe unten)
- Modify: `R/src/main/webapp/style/tlReactControls.css` (Blöcke `TLSidebar`, `Collapsed mode: center icon-only items`,
  `Drawer backdrop (…)`, `Responsive: sidebar becomes an off-canvas drawer on small viewports` streichen)
- Modify: `design-system/test/ratchet.json` (vier Blöcke streichen)

**Interfaces:**
- Consumes: `Menu`, `MenuItem` (mit `current`, `trailing`, `tooltip`), `MenuHeader`, `MenuSeparator`,
  `menuItemClassName` aus `./menu/Menu`; `useDisplayClass`, `useFocusTrap`, `useStandaloneKeyboardScope`,
  `pressClosedSurface`, `ICON_EXPAND` aus `tl-react-bridge`; Klassen aus Task 1 und 3.
- Produces: DOM nach Spec §4 und `sidebar.contract.md`.

- [ ] **Step 1: Teilkomponenten** — in `TLSidebar.tsx`:
  - Importe: `import { React, useTLState, useTLCommand, TLChild, useI18N, useStandaloneKeyboardScope, FillBarrier,
    rootClassName, tooltipProps, ThemeIcon, usePart, useDisplayClass, useFocusTrap, pressClosedSurface, ICON_EXPAND }
    from 'tl-react-bridge';` und `import { Menu, MenuItem, MenuHeader, MenuSeparator, menuItemClassName } from
    './menu/Menu';` — `useCloseOnOutsidePress` entfällt.
  - `SidebarIcon`: `className="tl-menu__icon tl-icon-sm"`.
  - Hilfsfunktion (nach `collectFocusable`):

```tsx
/** Whether the page the user is on lies in the given group, at any depth. */
function containsCurrent(item: GroupItemInfo, activeItemId: string): boolean {
  return item.children.some(child => (child.type === 'nav' && child.id === activeItemId)
    || (child.type === 'group' && containsCurrent(child as GroupItemInfo, activeItemId)));
}
```

  - `SidebarNavItem` rendert:

```tsx
    <button
      type="button"
      className={menuItemClassName(active, 'tl-sidebar__item')}
      aria-current={active ? 'page' : undefined}
      onClick={() => onSelect(item.id)}
      aria-label={collapsed ? item.label : undefined}
      {...tooltipProps(collapsed ? item.label : undefined)}
      tabIndex={tabIndex}
      ref={itemRef}
      onFocus={() => onFocus(item.id)}
    >
      {collapsed && item.badge ? (
        // The count over the corner of the icon: the element around the part places it (view-layer/parts.md).
        <span className="tl-icon-badge">
          <SidebarIcon icon={item.icon} />
          <span className="tl-icon-badge__count">
            <Badge content={item.badge} />
          </span>
        </span>
      ) : (
        <SidebarIcon icon={item.icon} />
      )}
      {!collapsed && <span className="tl-menu__label">{item.label}</span>}
      {!collapsed && item.badge && <Badge content={item.badge} />}
    </button>
```

  - `SidebarCommandItem`: `type="button"`, `className={menuItemClassName(false, 'tl-sidebar__item')}`, `disabled`
    nativ, Label `tl-menu__label`; sonst unverändert.
  - `SidebarHeaderItem`: `<div className="tl-menu__header tl-type-label" role="presentation" {...tooltipProps(collapsed ? item.label : undefined)}>`
    mit `<SidebarIcon icon={item.icon} />` und `{!collapsed && item.label}`.
  - `SidebarSeparator` entfällt; Aufrufer rendern `<MenuSeparator />`.

- [ ] **Step 2: Flyout als Menü** — `SidebarGroupFlyout` ersetzen:

```tsx
/** The entries of a group in its flyout: the menu at the group's button, right of the collapsed rail. */
const SidebarGroupFlyout: React.FC<{
  item: GroupItemInfo;
  activeItemId: string;
  anchor: HTMLElement | null;
  onSelect: (id: string) => void;
  onExecute: (id: string) => void;
  onClose: () => void;
}> = ({ item, activeItemId, anchor, onSelect, onExecute, onClose }) => {
  const Badge = usePart('Badge');
  return (
    <Menu open anchor={anchor} placement="right-start" onClose={onClose}>
      <MenuHeader label={item.label ?? ''} />
      {item.children.map(child => {
        if (child.type === 'nav') {
          const nav = child as NavItem;
          if (nav.hidden) return null;
          return (
            <MenuItem key={nav.id} icon={nav.icon} label={nav.label ?? ''}
              current={nav.id === activeItemId ? 'page' : false}
              trailing={nav.badge ? <Badge content={nav.badge} /> : undefined}
              onSelect={() => { onSelect(nav.id); onClose(); }} />
          );
        }
        if (child.type === 'command') {
          const command = child as CommandItemInfo;
          if (command.hidden) return null;
          return (
            <MenuItem key={command.id} icon={command.icon} label={command.label ?? ''}
              disabled={command.disabled} tooltip={command.tooltip}
              onSelect={() => { onExecute(command.id); onClose(); }} />
          );
        }
        if (child.type === 'header') return <MenuHeader key={child.id} label={child.label ?? ''} />;
        if (child.type === 'separator') return <MenuSeparator key={child.id} />;
        return null;
      })}
    </Menu>
  );
};
```

- [ ] **Step 3: Gruppe** — in `SidebarGroup`: `anchorRect`/`setAnchorRect` entfallen. `handleClick`:

```tsx
  const handleClick = useCallback(() => {
    if (collapsed) {
      if (flyoutGroupId === item.id) {
        onCloseFlyout();
      } else if (!pressClosedSurface()) {
        // The press of this click may just have closed the flyout from outside; it must not reopen it.
        onOpenFlyout(item.id);
      }
    } else {
      onToggleGroup(item.id);
    }
  }, [collapsed, flyoutGroupId, item.id, onToggleGroup, onOpenFlyout, onCloseFlyout]);
```

  Render:

```tsx
  const showFlyout = collapsed && flyoutGroupId === item.id;
  // Where the page the user is on hides in a closed group, the group's head shows it.
  const marked = containsCurrent(item, activeItemId) && (collapsed || !expanded);

  return (
    <div className="tl-sidebar__group">
      <button
        type="button"
        className={menuItemClassName(false, 'tl-sidebar__item')}
        data-tl-state={marked ? 'contains-current' : undefined}
        onClick={handleClick}
        aria-label={collapsed ? item.label : undefined}
        aria-haspopup={collapsed ? 'menu' : undefined}
        {...tooltipProps(collapsed ? item.label : undefined)}
        aria-expanded={collapsed ? showFlyout : expanded}
        tabIndex={tabIndex}
        ref={combinedRef}
        onFocus={() => onFocus(item.id)}
      >
        <SidebarIcon icon={item.icon} />
        {!collapsed && <span className="tl-menu__label">{item.label}</span>}
        {!collapsed && <ThemeIcon encoded={ICON_EXPAND} className="tl-sidebar__chevron tl-icon-sm" />}
      </button>
      {showFlyout && (
        <SidebarGroupFlyout item={item} activeItemId={activeItemId} anchor={headerBtnRef.current}
          onSelect={onSelect} onExecute={onExecute} onClose={onCloseFlyout} />
      )}
      {expanded && !collapsed && (
        <div className="tl-sidebar__children">
          {/* … SidebarItemRenderer wie bisher … */}
        </div>
      )}
    </div>
  );
```

  `SidebarItemRenderer` rendert für `separator` `<MenuSeparator />`.

- [ ] **Step 4: Hauptkomponente** — in `TLSidebar`:
  - nach `const DisclosureToggle = usePart('DisclosureToggle');`:

```tsx
  const compact = useDisplayClass() === 'compact';
```

  - `const collapsed = drawerOpen ? false : persistedCollapsed;` ersetzen durch

```tsx
  // Compact, the navigation is a drawer showing labels whatever the rail preference; the preference stays for the
  // wide screen.
  const collapsed = compact ? false : persistedCollapsed;
  const drawerVisible = compact && drawerOpen;
  const drawerRef = useRef<HTMLElement | null>(null);

  // The drawer is modal: focus moves in and is kept there; closing - Escape, the scrim, choosing an entry - gives it
  // back to the hamburger it came from.
  useFocusTrap(drawerVisible, drawerRef, 'first');
```

  - nach `handleToggleDrawer`: `useStandaloneKeyboardScope(drawerVisible, { ESCAPE: handleToggleDrawer });`
  - in `handleKeyDown` den Escape-Zweig für das Flyout streichen und als erste Zeile setzen:

```tsx
    // Keys from the flyout bubble up the React tree from its portal; the menu handles them, the rail does not.
    if (!(e.currentTarget as HTMLElement).contains(e.target as Node)) return;
```

  - im `switch` den Fall `ArrowRight` ersetzen:

```tsx
      case 'ArrowRight': {
        if (current.type === 'group') {
          if (collapsed) {
            e.preventDefault();
            handleOpenFlyout(current.id);
          } else if (!(groupStates.get(current.id) ?? false)) {
            e.preventDefault();
            handleToggleGroup(current.id);
          }
        }
        break;
      }
```

  - der Render-Teil ab `const rootClass = …` wird:

```tsx
  const nav = (
    <nav id={navId} className="tl-sidebar__nav" aria-label={i18n['js.sidebar.ariaLabel']}>
      {collapsed ? (
        !!state.headerCollapsedContent && (
          <div className="tl-sidebar__header">
            <TLChild control={state.headerCollapsedContent} />
          </div>
        )
      ) : (
        !!state.headerContent && (
          <div className="tl-sidebar__header">
            <TLChild control={state.headerContent} />
          </div>
        )
      )}

      <div className="tl-sidebar__items" onKeyDown={handleKeyDown}>
        {items.map(item => (
          <SidebarItemRenderer
            key={item.id}
            item={item}
            activeItemId={activeItemId}
            collapsed={collapsed}
            onSelect={handleSelect}
            onExecute={handleExecute}
            onToggleGroup={handleToggleGroup}
            focusedId={focusedId}
            setItemRef={setItemRef}
            onItemFocus={onItemFocus}
            groupStates={groupStates}
            flyoutGroupId={flyoutGroupId}
            onOpenFlyout={handleOpenFlyout}
            onCloseFlyout={handleCloseFlyout}
          />
        ))}
      </div>

      {collapsed ? (
        !!state.footerCollapsedContent && (
          <div className="tl-sidebar__footer">
            <TLChild control={state.footerCollapsedContent} />
          </div>
        )
      ) : (
        !!state.footerContent && (
          <div className="tl-sidebar__footer">
            <TLChild control={state.footerContent} />
          </div>
        )
      )}

      {/* Collapsing is a preference of the wide screen; a drawer has nothing to collapse. */}
      {!compact && (
        <div className="tl-sidebar__collapse">
          <DisclosureToggle expanded={!collapsed} opens="end" label={collapseLabel} onClick={handleToggleCollapse}
            aria-controls={navId} />
        </div>
      )}
    </nav>
  );

  return (
    <div id={controlId} className={rootClassName(state, 'tl-sidebar')} data-tl-state={collapsed ? 'collapsed' : undefined}>
      {!!state.drawerToggleContribution && (
        <TLChild control={state.drawerToggleContribution} />
      )}
      {!compact && nav}
      {drawerVisible && (
        // The modal drawer of the design system (wave 4a): the scrim closes it, the drawer holds the navigation.
        <div className="tl-dialog" onClick={(e) => { if (e.target === e.currentTarget) handleToggleDrawer(); }}>
          <aside
            ref={drawerRef}
            className="tl-drawer tl-drawer--start tl-drawer--narrow"
            data-tl-state="open"
            role="dialog"
            aria-modal="true"
            aria-label={i18n['js.sidebar.ariaLabel']}
            tabIndex={-1}
          >
            {nav}
          </aside>
        </div>
      )}

      {/* The region stretches the active view to its own bounded height either way, which ends the fill chain here. */}
      <div className="tl-sidebar__content">
        <FillBarrier>
          {!!state.activeContent && <TLChild control={state.activeContent} />}
        </FillBarrier>
      </div>
    </div>
  );
```

  - `useEffect` „Close flyout when sidebar expands“ bleibt.

- [ ] **Step 5: Altbestand** — die vier Sidebar-Blöcke in `tlReactControls.css` vollständig löschen (vom Kopf
  `/* --- TLSidebar --- */` bis vor die Überschrift nach `Responsive: …`); in `design-system/test/ratchet.json` die vier
  Schlüssel streichen.

- [ ] **Step 6: Prüfen** — `npx tsc --noEmit -p tsconfig.json` (0); `npx vite build --config vite.config.bridge.ts &&
  npx vite build --config vite.config.controls.ts` (grün; nur Prüfung, die Bundles sind Build-Produkte);
  `grep -rn "tlSidebar" R/react-src R/src/main/webapp/style` — leer.

- [ ] **Step 7: Commit** (Engine, dann Paket-Ratsche)

```bash
git -C _Working-Tree/tl8-wt-29584 add -A com.top_logic.layout.react
git -C _Working-Tree/tl8-wt-29584 commit -m "Ticket #29866: The sidebar reads the design system package -- entries as menu items with aria-current page, the head of a closed group marks the page inside, chevron as the toggle's, the flyout is the menu placed right-start, compact the navigation is a modal drawer with focus and Escape.

Co-Authored-By: <Modell> <noreply@anthropic.com>"
git add design-system/test/ratchet.json && git commit -m "Ticket #29866: Ratsche -- vier Sidebar-Blöcke gestrichen

Co-Authored-By: <Modell> <noreply@anthropic.com>"
```

---

### Task 7: Engine — AppBar, BottomBar, MUI-Adapter und -Tests (§5, §6)

**Files:**
- Modify: `R/react-src/controls/TLAppBar.tsx`, `R/react-src/controls/TLBottomBar.tsx`
- Modify: `R/src/main/java/com/top_logic/layout/react/I18NConstants.java` (Schlüssel `js.bottomBar.ariaLabel`),
  `R/src/main/java/META-INF/messages_de.properties` (Deutsch, sortiert)
- Modify: `R/src/main/webapp/style/tlReactControls.css` (Blöcke `TLAppBar`, `TLBottomBar`)
- Modify: `com.top_logic.layout.react.mui/react-src/adapters/MuiAppBarAdapter.tsx`, `MuiAppBarAdapter.test.tsx`,
  `chips.test.tsx`, `dividers.test.tsx`, `inline-buttons.test.tsx`, `wire-test-support.tsx`
- Modify: `design-system/test/ratchet.json`

**Interfaces:**
- Consumes: `tl-app-bar*`, `tl-bottom-bar*`, `tl-icon-badge*` (Tasks 1–3); `DisplayClassProvider` (Task 4).
- Produces: `MountOptions.displayClass?: DisplayClass` im MUI-Testhelfer.

- [ ] **Step 1: `TLAppBar.tsx`** — die Klassen umstellen:

```tsx
  const className = ['tl-app-bar', variant === 'elevated' ? 'tl-app-bar--elevated' : ''].filter(Boolean).join(' ');

  return (
    <header id={controlId} className={rootClassName(state, className)}>
      {!!leading && (
        <div className="tl-app-bar__leading">
          <TLChild control={leading} />
        </div>
      )}
      <h1 className="tl-app-bar__title tl-type-heading-sm">{title}</h1>
      {children.length > 0 && (
        <div className="tl-app-bar__children">
          {children.map((child, i) => (
            <TLChild key={i} control={child} />
          ))}
        </div>
      )}
      {actions != null && (
        <ButtonDefaults appearance="ghost">
          <div className="tl-app-bar__actions">
            <TLChild control={actions} />
          </div>
        </ButtonDefaults>
      )}
      {!!trailing && (
        <div className="tl-app-bar__trailing">
          <TLChild control={trailing} />
        </div>
      )}
    </header>
  );
```

  Im Kopfkommentar ergänzen: „When the bar is short of room, a collapsing toolbar gives way first, down to its
  overflow button; the title truncates last (design system, app-bar.css).“

- [ ] **Step 2: i18n** — in `I18NConstants.java` nach `JS_SIDEBAR_COLLAPSE`:

```java
	/**
	 * @en Bottom navigation
	 */
	@CustomKey("js.bottomBar.ariaLabel")
	public static ResKey JS_BOTTOM_BAR_ARIA_LABEL;
```

  In `messages_de.properties` sortiert einfügen: `js.bottomBar.ariaLabel = Navigation unten`.

- [ ] **Step 3: `TLBottomBar.tsx`** — vollständig:

```tsx
import { React, useTLState, useTLCommand, useI18N, rootClassName, usePart, ThemeIcon } from 'tl-react-bridge';
import type { TLCellProps } from 'tl-react-bridge';

const { useCallback } = React;

const I18N_KEYS = {
  'js.bottomBar.ariaLabel': 'Bottom navigation',
};

interface BottomBarItem {
  id: string;
  label: string;
  icon: string;
  badge?: string;
}

/**
 * Bottom navigation bar for small screens: a few pages with icon above label.
 *
 * State:
 * - items: { id, label, icon, badge? }[]  - icon as a theme image or a CSS class
 * - activeItemId: string                  - the page the user is on (aria-current="page")
 *
 * The badge of an item is the part `Badge`, over the corner of the icon; the element around it (tl-icon-badge__count)
 * places it, so that the badge keeps the position any implementation of the part gives its own root.
 */
const TLBottomBar: React.FC<TLCellProps> = ({ controlId }) => {
  const state = useTLState();
  const sendCommand = useTLCommand();
  const i18n = useI18N(I18N_KEYS);
  const Badge = usePart('Badge');

  const items = (state.items as BottomBarItem[]) ?? [];
  const activeItemId = state.activeItemId as string;

  const handleSelect = useCallback((itemId: string) => {
    if (itemId !== activeItemId) {
      sendCommand('selectItem', { itemId });
    }
  }, [sendCommand, activeItemId]);

  return (
    <nav id={controlId} className={rootClassName(state, 'tl-bottom-bar')} aria-label={i18n['js.bottomBar.ariaLabel']}>
      {items.map(item => {
        const isActive = item.id === activeItemId;
        const icon = <ThemeIcon encoded={item.icon} className="tl-icon-md" />;
        return (
          <button
            key={item.id}
            type="button"
            className="tl-bottom-bar__item"
            onClick={() => handleSelect(item.id)}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="tl-bottom-bar__icon">
              {item.badge ? (
                <span className="tl-icon-badge">
                  {icon}
                  <span className="tl-icon-badge__count">
                    <Badge content={item.badge} />
                  </span>
                </span>
              ) : icon}
            </span>
            <span className={'tl-bottom-bar__label ' + (isActive ? 'tl-type-label-strong' : 'tl-type-label')}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default TLBottomBar;
```

- [ ] **Step 4: Altbestand** — Blöcke `/* --- TLAppBar --- */` und `/* --- TLBottomBar --- */` in
  `tlReactControls.css` löschen; in `ratchet.json` beide Schlüssel streichen.

- [ ] **Step 5: MUI-Adapter** — `MuiAppBarAdapter.tsx`: die vier Slot-`div` werden `Box` aus `@mui/material/Box`
  mit eigener Anordnung, ohne Klassen des Pakets (Memory „MUI-Adapter nur Vertrag“):

```tsx
/** The slots of the bar, laid out by MUI: the actions take the room left and give way first, the title last. */
const LEADING_SX: SxProps<Theme> = { display: 'flex', flex: 'none', alignItems: 'center' };
const CHILDREN_SX: SxProps<Theme> = { display: 'flex', flex: '0 1 auto', alignItems: 'center', gap: 1, minWidth: 0 };
const ACTIONS_SX: SxProps<Theme> = { display: 'flex', flex: '1 1 0', justifyContent: 'flex-end', minWidth: 0, '&:empty': { display: 'none' } };
const TRAILING_SX: SxProps<Theme> = { display: 'flex', flex: 'none', alignItems: 'center', gap: 1, ml: 'auto' };
```

  und im JSX `<Box data-slot="leading" sx={LEADING_SX}>`, `data-slot="children"`, `data-slot="actions"`,
  `data-slot="trailing"` statt der `div`s mit `tlAppBar__*`. Der Kopfkommentar verliert den Absatz über „The parts keep
  the slot elements and classes of the design system's app bar“ und sagt stattdessen: „The adapter lays out its slots
  with MUI; it follows the state contract (state.proto), not the stylesheets of TopLogic.“

- [ ] **Step 6: MUI-Tests**
  - `MuiAppBarAdapter.test.tsx` Zeilen 71–78: `slot.className.split(' ')[0]` → `slot.getAttribute('data-slot')`,
    erwartet `leading`, `children`, `actions`, `trailing`; die vier `querySelector('.tlAppBar__x > #id')` →
    `querySelector('[data-slot="x"] > #id')`.
  - `wire-test-support.tsx`: `MountOptions` um

```tsx
  /** The display class of the app shell around the adapter; absent: none (regular). */
  displayClass?: DisplayClass;
```

    erweitern (Import `DisplayClassProvider`, Typ `DisplayClass` aus `tl-react-bridge`) und in `mountAdapter` den
    Baum `adapter` bei gesetzter Option in `<DisplayClassProvider value={options.displayClass}>…</DisplayClassProvider>`
    hüllen.
  - `chips.test.tsx`: Zeile 492 `expect(badge.parentElement!.classList).toContain('tl-sidebar__item');`; Zeile 501
    `expectPlacedByCorner(…, 'tl-icon-badge__count')`; Zeile 508 ebenso; Zeile 491 `not.toContain('tl-sidebar__item')`.
  - `dividers.test.tsx` Zeilen 174f.: `tlSidebar__separator` → `tl-menu__separator`.
  - `inline-buttons.test.tsx` ab Zeile 233: `mountAdapter(TLDrawerToggle, { open: false, controls: 'nav' }, { displayClass: 'compact' })`;
    statt der Wrapper-Prüfung `expect(button.id).toBe(CONTROL_ID); expect(button.getAttribute('aria-expanded')).toBe('false');`;
    ein zweiter Test „renders nothing on a wide screen“: `mountAdapter(TLDrawerToggle, { open: false }); await settle();
    expect(screen.queryByRole('button', { name: LABEL_OPEN_DRAWER })).toBeNull();`
  - `disclosure-toggles.test.tsx`: unverändert (prüft `aria-controls` auf `-nav` und die MUI-Drehung).

- [ ] **Step 7: Prüfen** — Engine `npx tsc --noEmit -p tsconfig.json` (0) in `com.top_logic.layout.react` und
  `com.top_logic.layout.react.mui`; MUI-Vitest:
  `cd _Working-Tree/tl8-wt-29584/com.top_logic.layout.react.mui && NODE_OPTIONS=--no-experimental-webstorage npx vitest run 2>&1 | tail -8`
  — Expected: alle grün. `grep -rn "tlAppBar\|tlBottomBar\|tlSidebar\|tlDrawerToggle" com.top_logic.layout.react*/react-src` — leer.

- [ ] **Step 8: Commit** (Engine, dann Paket-Ratsche)

```bash
git -C _Working-Tree/tl8-wt-29584 add -A com.top_logic.layout.react com.top_logic.layout.react.mui
git -C _Working-Tree/tl8-wt-29584 commit -m "Ticket #29866: App bar and bottom bar read the design system package -- the toolbar gives way before the title, elevated is a line; the bottom bar marks the current page and names itself in the user's language; the MUI app bar lays out its slots itself.

Co-Authored-By: <Modell> <noreply@anthropic.com>"
git add design-system/test/ratchet.json && git commit -m "Ticket #29866: Ratsche -- TLAppBar und TLBottomBar gestrichen

Co-Authored-By: <Modell> <noreply@anthropic.com>"
```

---
### Task 8: Gates gesamt — Engine-Gate, Ratsche, Maven, Messages, Doku, Trac

**Files:**
- Modify: `design-system/test/engine-classes.test.mjs`, `design-system/test/ratchet.json`
- Modify: `docs/migration/altlast.md`, `STATUS.md`
- Trac #29866 (Beschreibung: `== Migration ==`, Keyword `RequiresMigration`) — **nur der Orchestrator**

- [ ] **Step 1: Engine-Gate** — an `design-system/test/engine-classes.test.mjs` anhängen (nutzt `tree`, `reactSources`,
  `M`, `WT` aus der Datei):

```js
// Welle 4b (#29866): keine alte Klasse der Navigation mehr — im TSX jedes Moduls (MUI eingeschlossen), im alten
// Stylesheet, in Java, tl-docs und Views. Modulnamen (TLSidebar) treffen nicht: großes TL.
const ALT_4B = /\btl(Sidebar|AppBar|BottomBar|AppShell|DrawerToggle)(__|--|\b)/;

test('keine alte Klasse der Welle 4b in react-src, Stylesheets, Java, tl-docs und Views', { skip: !existsSync(M) && 'kein Worktree' }, () => {
  const quellen = [
    ...reactSources(),
    join(M, 'src/main/webapp/style/tlReactControls.css'),
    join(WT, 'com.top_logic.demo.react/src/main/webapp/style/tl-demo-react.css'),
    ...tree(join(M, 'src/main/java'), /\.java$/),
    ...tree(join(WT, 'com.top_logic.layout.view/src/main/java'), /\.(java|md)$/),
    ...tree(join(WT, 'com.top_logic.demo.react/src/main/webapp'), /\.view\.xml$/),
    ...tree(join(WT, 'com.top_logic.layout.view/src/main/webapp'), /\.view\.xml$/),
  ];
  const hits = [];
  for (const p of quellen) readFileSync(p, 'utf8').split('\n').forEach((line, i) => { if (ALT_4B.test(line)) hits.push(`${p.slice(WT.length + 1)}:${i + 1}`); });
  assert.deepEqual(hits, []);
});

test('Welle 4b im TSX: main in der Shell, aria-current an den Seiten, aria-expanded am Hamburger, kein englischer Name, 768 nur in der Shell', { skip: !existsSync(M) && 'kein Worktree' }, () => {
  const tsx = (n) => readFileSync(join(M, `react-src/controls/${n}.tsx`), 'utf8');
  assert.match(tsx('TLAppShell'), /<main className="tl-app-shell__content"/);
  assert.match(tsx('TLSidebar'), /aria-current=\{active \? 'page' : undefined\}/);
  assert.match(tsx('TLBottomBar'), /aria-current=\{isActive \? 'page' : undefined\}/);
  assert.match(tsx('TLDrawerToggle'), /aria-expanded=\{open\}/);
  for (const n of ['TLAppShell', 'TLAppBar', 'TLSidebar', 'TLBottomBar', 'TLDrawerToggle'])
    assert.doesNotMatch(tsx(n), /aria-label="[A-Za-z]/, `${n}: Name als Literal`);
  const mit768 = [...reactSources()].filter((p) => /\b768\b/.test(readFileSync(p, 'utf8'))).map((p) => p.slice(WT.length + 1));
  assert.deepEqual(mit768, ['com.top_logic.layout.react/react-src/controls/TLAppShell.tsx']);
});
```

  Trifft der 768-Test weitere Dateien (`reactSources()` liest auch `.css` unter `react-src`), die Treffer ansehen:
  ist es ein anderer Breakpoint als die Sidebar (z. B. AdaptiveDetail), die Liste im Test um ihn ergänzen und den
  Fund in `altlast.md` „Offen für 4c“ vermerken.

- [ ] **Step 2: Ratsche** — `cd design-system && node tools/inventory.mjs`; in `test/ratchet.json`:
  - `literals` auf die gemessenen Zahlen (erwartet: duration 23→20, zIndex 14→11, fontSize 31→28, color und
    outlineNone unverändert — die Messung zählt);
  - `lines` = Summe der Budgets = gemessen;
  - Vermerk an `_blocks`: „16.10. Welle 4b (#29866): TLSidebar, Collapsed mode: center icon-only items, Drawer
    backdrop, Drawer toggle, Responsive: sidebar becomes an off-canvas drawer, TLAppBar, TLBottomBar, TLAppShell
    gestrichen — app-shell.css, app-bar.css, sidebar.css, bottom-bar.css und tl-icon-badge (badge.css) im Paket; mit
    TLAppShell fällt die Übergangsregel .tlAppShell .tl-breadcrumb. Literale … lines = Summe = gemessen <n>.“

- [ ] **Step 3: Paket-Gates**

```bash
cd design-system && node tools/generate.mjs && node tools/lint-css.mjs && node tools/publish-to-worktree.mjs && node --test 2>&1 | grep -E '^ℹ (pass|fail)|^✖'
```

  Expected: alles grün, darunter `ratchet`, `published`, `engine-classes` (alle Tests), `focus-clip`,
  `app-bar-shrink`. Kontrast: keine neuen Paare — `text-primary` und `focus-ring` auf `surface-interactive-selected`
  und `surface-layer` stehen in `tools/lib/pairs.mjs`; Icons erben die Textfarbe.

- [ ] **Step 4: Maven und Messages**

```bash
cd _Working-Tree/tl8-wt-29584
mvn -B install -pl com.top_logic.layout.react 2>&1 | tee com.top_logic.layout.react/target/mvn-4b.log | grep -E 'BUILD|ERROR' | head
mvn -B test -DskipTests=false -pl com.top_logic.layout.react,com.top_logic.layout.view,com.top_logic.demo.react 2>&1 | tee /tmp/mvn-4b-test.log | grep -E 'Tests run:|BUILD|FAIL' | tail -8
../design-system/tools/check-messages-en.sh
```

  Expected: BUILD SUCCESS; Tests grün außer dem bekannten #29651 in `layout.view` (`TestAccordionElement`,
  JVM-Locale); `layout.react` zählt `TestDrawerToggleState` mit. `check-messages-en.sh` erzeugt
  `js.bottomBar.ariaLabel = Bottom navigation` in `messages_en.properties`: den Diff committen, danach erneut ohne Diff.
  Scheitert der Lauf offline an fehlenden vorgelagerten Modulen, erst diese per `mvn -o install -pl <Liste>`
  installieren; JDK 21 setzen (Memory „Gate nach master-Merge“).

- [ ] **Step 5: `altlast.md`** — Abschnitt „## Welle 4b · Navigation — gebaut <Datum>“ vor „## Konsolidierung“
  einfügen, mit „Gestrichene Blöcke“ (die acht, mit Zeilen), „Neu im Paket“ (vier Blöcke, `tl-icon-badge`, zwei Maße)
  und der Tabelle „Alt → neu für Anwendungs-Stylesheets“:

| Alt | Neu |
|---|---|
| `.tlAppShell`, `__header`, `__notices`, `__content`, `__footer` | `.tl-app-shell`, `__header`, `__notices`, `__content` (`<main>`), `__footer` |
| `@media (max-width: 768px)` für Sidebar und Hamburger | `.tl-app-shell[data-tl-display~="compact"] …` |
| `.tlAppBar`, `--primary` | `.tl-app-bar` |
| `.tlAppBar--elevated` (Schatten) | `.tl-app-bar--elevated` (Linie unten) |
| `.tlAppBar__leading`, `__title`, `__children`, `__actions`, `__trailing` | `.tl-app-bar__leading`, `__title`, `__children`, `__actions`, `__trailing` |
| `.tlSidebar`, `__nav`, `__content` | `.tl-sidebar`, `__nav`, `__content` |
| `.tlSidebar--collapsed` | `.tl-sidebar[data-tl-state~="collapsed"]` |
| `.tlSidebar--drawerOpen`, `__backdrop` | `.tl-dialog > .tl-drawer.tl-drawer--start > .tl-sidebar__nav` |
| `.tlSidebar__headerSlot`, `__footerSlot` (`--collapsed`) | `.tl-sidebar__header`, `__footer` |
| `.tlSidebar__item`, `__navItem`, `__commandItem` | `.tl-menu__item.tl-sidebar__item` |
| `.tlSidebar__navItem--active` | `.tl-sidebar__item[aria-current="page"]` |
| `.tlSidebar__item--disabled` | `.tl-sidebar__item:disabled` |
| `.tlSidebar__headerItem` | `.tl-menu__header` |
| `.tlSidebar__separator` | `.tl-menu__separator` |
| `.tlSidebar__group`, `__groupChildren`, `__chevron` (`--open`) | `.tl-sidebar__group`, `__children`, `__chevron` (`[aria-expanded="true"] >`) |
| `.tlSidebar__icon`, `__label`, `__badge` | `.tl-menu__icon`, `.tl-menu__label`, Part `Badge` |
| `.tlSidebar__iconWrap`, `__cornerBadge` | `.tl-icon-badge`, `.tl-icon-badge__count` |
| `.tlSidebar__collapseBar` | `.tl-sidebar__collapse` |
| `.tlSidebar__flyout`, `__flyoutHeader`, `__flyoutItem` (`--active`), `__flyoutSectionHeader` | `.tl-popover.tl-menu`, `.tl-menu__header`, `.tl-menu__item[aria-current="page"]`, `.tl-menu__header` |
| `.tlDrawerToggle` | entfällt (nur kompakt im DOM; `aria-expanded`) |
| `.tlBottomBar`, `__item` (`--active`) | `.tl-bottom-bar`, `__item` (`[aria-current="page"]`) |
| `.tlBottomBar__iconWrap`, `__icon`, `__badge`, `__label` | `.tl-bottom-bar__icon`, `.tl-icon-md`, `.tl-icon-badge__count`, `.tl-bottom-bar__label` |

  Dazu „Sichtbar“: AppBar 48/40 statt 56 px; `--elevated` Linie; aktuelle Seite Fläche statt Balken; Einträge in
  `text-primary`; Kopfzeilen ohne Großbuchstaben; mobile Sidebar modal über der AppBar, ohne Gleiten (Abweichung 3);
  BottomBar-Label 12 px. „Offen für 4c“: was Step 1 an weiteren Breakpoints fand.

- [ ] **Step 5a: Spec, `skalen.md`, Präsentation an die Abweichungen** — Spec §6 und `skalen.md` „Welle 4b:
  Navigation“, Absatz „Das Eck-Badge einmal“: `tl-badge--corner` → Behälter `tl-icon-badge` mit `__count`, Begründung
  aus Abweichung 1 (die Lage gehört dem Element um das Part, `view-layer/parts.md`); Spec §3: Hamburger mit Zustand
  `open`/`controls` vom Server (Abweichung 2), kein Gleiten (Abweichung 3); Spec §10 „Offen bis zum Plan“ als erledigt
  (Abweichungen 7 und 8). `docs/praesentation.md` nur, wenn sich eine Botschaft ändert (hier nicht).

- [ ] **Step 6: Trac** (Orchestrator) — `update_ticket 29866` mit der vollständigen Beschreibung plus Abschnitt
  (Trac-Syntax):

```
== Migration ==

 * The CSS classes `tlAppShell*`, `tlAppBar*`, `tlSidebar*`, `tlBottomBar*` and `tlDrawerToggle` no longer exist. Application stylesheets that target them must be rewritten against the package classes and attributes; the full old → new list is in the package (`docs/migration/altlast.md`, "Welle 4b").
 * The breakpoint is measured by the app shell alone. Rules for small screens read `[data-tl-display~="compact"]` on `.tl-app-shell` instead of `@media (max-width: 768px)`.
 * Visible: the app bar is 48px high instead of 56 (40 in compact density); the elevated app bar is separated by a line instead of a shadow; the current page carries the selection surface instead of a bar at its left; on small screens the sidebar is a modal drawer over the app bar; the hamburger button exists only on small screens; bottom bar labels are 12px.
```

  und `attributes: {"keywords": "RequiresMigration"}`; mit `get_ticket` prüfen.

- [ ] **Step 7: Commits** — Paket (`engine-classes.test.mjs`, `ratchet.json`, `dist`, `altlast.md`, `STATUS.md` mit
  „4b gebaut, lokal, nicht gepusht“) und Engine (`messages_en.properties`, Paketkopie, falls geändert):

```bash
git add design-system docs/migration/altlast.md STATUS.md
git commit -m "Ticket #29866: Ratsche und Engine-Gate Welle 4b -- acht Navigations-Blöcke gestrichen, alte Klassen gesperrt, 768 nur in der Shell; altlast Welle 4b

Co-Authored-By: <Modell> <noreply@anthropic.com>"
```

---

### Task 9: Sichtprüfung lokal

**Files:** keine (Befunde gehen in `altlast.md`, Korrekturen als eigene Commits).

- [ ] **Step 1: Demo starten** — wie Memory „Lokale Demo statt Docker“ (`tl-demo-react` aus dem Worktree,
  `-Pide,with-h2`); Hendrik loggt ein.
- [ ] **Step 2: Prüfen**, hell und dunkel, normal und kompakt (Chrome-Erweiterung, Fenster breit):
  1. Sidebar ausgeklappt: aktuelle Seite mit Fläche und kräftig; Zeigen; Befehl deaktiviert mit Tooltip; Gruppe auf
     und zu (Chevron rechts/unten); Gruppe zu, die die aktuelle Seite enthält: Kopf getönt.
  2. Einklappen und Ausklappen (Breite gleitet; mit „prefers-reduced-motion: reduce“ ohne Bewegung); eingeklappt:
     Quadrate, Tooltip mit Namen, Zähler an der Ecke; Gruppe öffnet das Flyout rechts, am unteren Fensterrand
     geflippt; per Tastatur (Pfeil rechts, Enter) mit Fokus auf dem ersten Eintrag; Pfeile bewegen nur das Menü;
     Escape gibt den Fokus an den Gruppenknopf; ein zweiter Klick auf den Gruppenknopf schließt nur.
  3. Fenster schmal (unter 768 px): Hamburger erscheint in der AppBar, `aria-expanded="false"`; öffnen → Scrim über
     AppBar und Seite, Fokus auf dem ersten Eintrag, Tab bleibt drin; Escape schließt, Fokus am Hamburger; Klick auf
     den Scrim schließt; Auswahl einer Seite schließt und navigiert; zurück auf breit: Rail wie vorher (eingeklappt,
     wenn sie es war).
  4. AppBar: Höhe 48/40; Fenster langsam schmaler — erst verlieren die Toolbar-Knöpfe ihre Labels, dann wandern sie
     ins Überlaufmenü, erst dann kürzt der Titel.
  5. BottomBar (sofern eine Ansicht sie nutzt; sonst im Specimen): Fläche hinter dem Icon, Zähler an der Ecke,
     Screenreader-Name übersetzt.
- [ ] **Step 3: Befunde** — jede Abweichung als Zeile in `altlast.md` „Welle 4b“; Fehler beheben, Gates erneut, je
  ein Commit. Gleiten des Drawers (Abweichung 3) Hendrik vorlegen.

---

### Task 10: Abschluss — melden, nicht pushen

- [ ] **Step 1:** `git log --oneline origin/CWS/CWS_29825_design_system_spaltenwahl..HEAD` (Engine) und
  `git log --oneline origin/main..HEAD` (Paket) zusammenfassen.
- [ ] **Step 2:** Hendrik melden: Branch, Commits, Gates, Sichtprüfung, offene Befunde. **Push nur nach seiner
  ausdrücklichen Freigabe**, je Repo und Branch benannt; PR gegen `CWS/CWS_29825_design_system_spaltenwahl` (nach deren
  Merge gegen master), Reviewer bhu, danach `add_reviewers bhu`.
