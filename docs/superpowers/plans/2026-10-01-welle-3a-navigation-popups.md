# Welle 3a — Navigation und Popups: Implementierungsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sechs alte Blöcke (`TLMenu`, `TLMenuRegion`, `User menu`, `TLToolbar` samt Dropdown, `TLTabBar`, `TLBreadcrumb`) aus `tlReactControls.css` abschneiden und durch Paket-Komponenten ersetzen, die **ein** Popup, **ein** Menü, **einen** Fokusring und **einen** Icon-Knopf kennen — mit den Nachzügen aus Welle 2 (Select-Popup, FormGroup-Toggle, drei Icon-Knopf-Blöcke).

**Architecture:** Paket (`design-system/`): neue Komponentendateien `popover.css`, `menu.css`, `toggle.css`, `toolbar.css`, `tabs.css`, `breadcrumb.css`, Modifier `tl-button--icon`, drei neue Tokens, Verträge, Specimen, Gates. Engine (`_Working-Tree/tl8-wt-29584`, Branch `CWS/CWS_29617_design_system_welle_3a` von `welle_2`): ein Hook `bridge/popover.ts` auf `@floating-ui/react`, eine darstellende Komponente `controls/menu/Menu.tsx` mit Roving-Fokus, die `TLMenu`, das Spalten-Kontextmenü und der Toolbar-Overflow teilen; `ButtonDefaults` lernt `iconOnly` und `appearance: 'menu-item'`; Java liefert dem Menü ein Element als Anker und der Region den Offen-Zustand.

**Tech Stack:** Node (ohne Abhängigkeiten) im Paket; React 19, TypeScript, Vite, `@floating-ui/react ^0.27` (installiert 0.27.19) in der Engine; Java 21/Maven für `I18NConstants`, `ContextMenuOpener`, `MenuRegionControl`.

**Spec:** `docs/superpowers/specs/2026-10-01-welle-3a-navigation-popups-design.md` — Prognosen in `docs/migration/altlast.md` „Konsolidierung (01.10.)“.

**Plan-Review (01.10., Opus, frisch):** 16 Gate-Brüche gefunden und hier eingearbeitet; drei Entscheidungen daraus (Fable): (1) kompakt wird nur ein Knopf, der sein Icon **zeigt** (`icon-label`, `icon-only`), nie `label-only` mit Bild — wie die alte Regel; die kompakte Breite wird in einem zweiten Messdurchlauf mit Kontext gemessen, nicht geraten. (2) `menu-item` als Container-Erscheinung schlägt die Server-Erscheinung — ein Eintrag ist Struktur, kein Stil; ein Umschalter im Menü ist `role="menuitemcheckbox"` mit `aria-checked`. (3) Ein Drop-Ziel ist kein Fokus: `outline` in `border-interactive` bleibt erlaubt, `focus-ring` setzt nur `base.css`. Die Spec ist dazu fortgeschrieben.

## Global Constraints

- Alles Öffentliche: Englisch, kebab-case, Präfix `tl` (`--tl-…`, `.tl-…`, `data-tl-…`); Zustände sind Attribute, nie Klassen (CLAUDE.md „Namen“).
- `src/tokens.json` trägt nur Referenzen `{name}`; Werte stehen in `src/primitives.json`; jede Primitive hat einen Leser (`layers.test.mjs`).
- Nach jeder Änderung an `src/`: `node tools/generate.mjs`; `node --test` und `node tools/lint-css.mjs` sind das Gate (heute 245 Tests, Lint grün). **Kein Commit mit rotem Test.**
- Kein Literal in Komponenten-CSS (Farbe, Maß, Dauer), kein `:focus` ohne `-visible`, kein `outline: none`, kein `!important` außerhalb des Reduced-Motion-Blocks, kein `cursor: not-allowed`, `font-weight` nur in `tl-type-*`-Klassen; jeder Block mit `display` setzt `[hidden] { display: none }`.
- Außerhalb von `dist/` wird nichts im Namensraum `--tl` definiert; `dist/` wird nur über `node tools/publish-to-worktree.mjs` in den Worktree kopiert.
- Engine: `messages_en.properties` nie von Hand; JavaDoc schreiben, `tools/check-messages-en.sh` laufen lassen, Diff committen, Deutsch in `messages_de.properties` nachziehen. Vor jedem Push `git fetch` (Bernhard committet auf unsere Branches); Push macht Hendrik.
- Commits mit Präfix `Ticket #29617:`; Trailer `Co-Authored-By: <Modell, das den Task gebaut hat>`.
- Keine Zeit- oder Aufwandsangaben in Docs oder Kommentaren.

## Review Focus

1. **Menü am unteren Fensterrand klappt nach oben** und bleibt nach dem Scrollen am Anker — E1 (`strategy: 'fixed'`, `autoUpdate`), Sichtprüfung E9.
2. **Ein deaktivierter Menüeintrag wird übersprungen** — E1: `ITEM`-Selektor `:not([disabled])`.
3. **Overflow-Einträge bleiben live** (gemountet, nur `hidden`) und `autoUpdate` läuft nur, solange offen — E5: `setFloating` nur bei `open`.
4. **Kompakte Toolbar misst richtig** — E5: zweiter Messdurchlauf mit `iconOnly`-Kontext, kein Raten.
5. **Tab-Pfeiltasten wählen den Reiter** und setzen den Fokus — E6: `focusTab`.

---

## Dateistruktur

**Paket `design-system/`** (neu, sofern nicht „ändern“):

| Datei | Verantwortung |
|---|---|
| `src/primitives.json` (ändern) | `gray-64`, `gray-60`, `view-1`; `gray-73` fällt (ohne Leser) |
| `src/tokens.json` (ändern) | dunkle Interaktionsstufen, `size-popover-min`, `size-popover-max` |
| `tools/dtcg.mjs:66` (ändern) | `vh` als Dimension |
| `specimen/probe.theme.css` (erzeugen) | Probe-Theme mit den neuen Stufen |
| `src/components/button/button.css` (ändern) | `tl-button--icon` |
| `src/components/toggle/toggle.css`, `toggle.contract.md`, `toggle.spec.html` | Auf-/Zuklappen |
| `src/components/popover/popover.css`, `popover.contract.md` | die eine Popup-Fläche |
| `src/components/menu/menu.css`, `menu.contract.md`, `menu.spec.html` | Menü, Eintrag, Kopf, Auslöser (`tl-menu-region`) |
| `src/components/toolbar/toolbar.css`, `toolbar.contract.md`, `toolbar.spec.html` | Werkzeugleiste |
| `src/components/tabs/tabs.css`, `tabs.contract.md`, `tabs.spec.html` | Reiter |
| `src/components/breadcrumb/breadcrumb.css`, `breadcrumb.contract.md`, `breadcrumb.spec.html` | Breadcrumb |
| `src/components/select/select.css`, `field/field.css`, `form/form.css` (ändern) | Nachzüge: Popup liest `tl-popover`; drei Icon-Knopf-Blöcke fallen |
| `specimen/specimen.css` | gemeinsame Specimen-Stile (N8) |
| `tools/lint-css.mjs` (ändern) | neue Blöcke und Modifier |
| `test/focus.test.mjs`, `test/square.test.mjs`, `test/popover.test.mjs`, `test/contracts-3a.test.mjs` | neue Gates |
| `test/engine-classes.test.mjs`, `test/ratchet.json` (ändern, **erst in E9 bzw. je E-Task**) | Engine-Gate, Ratsche |

**Engine `com.top_logic.layout.react/`** (Branch `CWS/CWS_29617_design_system_welle_3a`):

| Datei | Verantwortung |
|---|---|
| `react-src/bridge/popover.ts` (neu) | `usePopover` auf floating-ui |
| `react-src/controls/menu/Menu.tsx` (neu) | darstellendes Menü, `useRovingMenu` |
| `react-src/controls/TLMenu.tsx` (ändern) | Server-Menü über `Menu` |
| `react-src/controls/TLDropdownSelect.tsx`, `TLTextInput.tsx`, `TLFormField.tsx`, `TLFormGroup.tsx` (ändern) | Nachzüge Welle 2 |
| `react-src/controls/TLTableView.tsx` (ändern, 397–400, 1120–1121, 1701–1741) | Spaltenmenü über `Menu` |
| `react-src/controls/button/ButtonDefaults.tsx`, `TLButton.tsx`, `TLToggleButton.tsx`, `TLUploadButton.tsx` (ändern) | `iconOnly`, `menu-item`, `--icon` |
| `react-src/controls/TLToolbar.tsx` (ändern) | Klassen, Trigger, Kompakt über Kontext mit zwei Messdurchläufen, Overflow über Portal + `useRovingMenu` |
| `react-src/controls/TLTabBar.tsx`, `TLBreadcrumb.tsx`, `TLMenuRegion.tsx` (ändern) | Leisten |
| `src/main/java/com/top_logic/layout/react/I18NConstants.java` (ändern) | `js.breadcrumb.label` |
| `src/main/java/com/top_logic/layout/react/control/overlay/ContextMenuOpener.java` (ändern) | Anker-Element, Offen-Zustand |
| `com.top_logic.layout.view/.../command/MenuRegionControl.java`, `ViewServlet.java` (ändern) | `anchorId`, `menuOpen` |
| `com.top_logic.layout.view/.../views/user-menu.view.xml` (ändern) | Benutzermenü ohne eigene Klasse |
| `src/main/webapp/style/tlReactControls.css` (ändern) | sechs Blöcke löschen, zwei Überschriften neu (`TLViewError`, `TLInset`), Host-Literale, drei Altklassen-Reste, Tooltip-Ebene |

**Zeilenangaben** beziehen sich auf den Stand `60a36b308e` (Welle-2-Branch, 01.10.); wer später baut, prüft sie mit `grep -n` nach.

---

## Teil P — Paket

### Task P1: Tokens — Zeigen auf allen Gründen, zwei Popover-Maße

**Files:**
- Modify: `design-system/src/primitives.json:15-16` (Grau), `:30-38` (measure); `design-system/src/tokens.json:35-36`, `:93-110`; `design-system/tools/dtcg.mjs:66`
- Create (erzeugt): `design-system/specimen/probe.theme.css`
- Test: `design-system/test/tokens.test.mjs` (ergänzen)

**Interfaces:**
- Produces: Tokens `--tl-size-popover-min`, `--tl-size-popover-max`; dunkle `surface-interactive-hover/-selected/-active` auf `gray-67/-64/-60`.

- [ ] **Step 1: Test** — in `test/tokens.test.mjs` anhängen (`R`, `T`, `ratio` sind dort importiert):

```js
test('Zeigen auf allen Gründen (01.10.): dunkel liegen hover, selected, active über dem Overlay', () => {
  const C = R.color.dark;
  for (const rolle of ['surface-interactive-hover', 'surface-interactive-selected', 'surface-interactive-active']) {
    assert.ok(ratio(C[rolle], C['surface-overlay']) >= 1.1, `${rolle} auf surface-overlay < 1,1`);
  }
  assert.ok(ratio(C['border-interactive'], C['surface-interactive-selected']) >= 3.0);
  assert.equal(T.measure['size-popover-min'], '{size-11}');
  assert.equal(T.measure['size-popover-max'], '{view-1}');
});
```

- [ ] **Step 2: Rot sehen** — `cd design-system && node --test test/tokens.test.mjs` → FAIL.

- [ ] **Step 3: `tools/dtcg.mjs:66`** — `parseDimension` kennt rem, px, em, %; `vh` ergänzen, mit demselben `$extensions`-Vermerk wie bei `%` (Datei lesen, das Muster übernehmen). Test in `test/dtcg.test.mjs` **über den Export** (`parseDimension` ist nicht exportiert), wie `dtcg.test.mjs:60` es für `%` tut: `D.primitive.measure['view-1'].$value` ist `{ value: 70, unit: 'vh' }` plus der Vermerk.

- [ ] **Step 4: Primitive und Tokens** — `src/primitives.json` Zeile 15–16: `"gray-60": "#44484C", "gray-64": "#393E42",` zwischen `gray-55` und `gray-66` einfügen; **`"gray-73": "#22262A"` streichen** (danach ohne Leser; `layers.test.mjs` bricht sonst). measure: `"view-1": "70vh",` nach `"size-11": "10rem",`. `src/tokens.json` dunkel: `"surface-interactive-hover": "{gray-67}", "surface-interactive-selected": "{gray-64}", "surface-interactive-active": "{gray-60}",`; measure: `"size-popover-min": "{size-11}", "size-popover-max": "{view-1}",`.

- [ ] **Step 5: Erzeugen** — `node tools/generate.mjs && node tools/derive.mjs test/fixtures/probe.primitives.json specimen/probe.theme.css` (das Probe-Theme trägt die Stufen mit; `derive.test.mjs` prüft die Datei).

- [ ] **Step 6: Gates** — `node --test && node tools/lint-css.mjs` → grün (Reviewer: 246 Tests).

- [ ] **Step 7: Commit** — `git add design-system/src design-system/dist design-system/specimen/probe.theme.css design-system/tools/dtcg.mjs design-system/test && git commit -m "Ticket #29617: Welle 3a -- Zeigen auf allen Gruenden (gray-67/64/60 dunkel), size-popover-min/max, vh im DTCG"`

### Task P2: `tl-button--icon` — der quadratische Icon-Knopf

**Files:**
- Modify: `design-system/src/components/button/button.css` (nach dem `--sm`-Block, ~125), `tools/lint-css.mjs:76`, `button.contract.md`
- Test: `design-system/test/square.test.mjs` (neu; der Toggle-Fall kommt in P3)

**Interfaces:**
- Produces: `tl-button--icon` (quadratisch `size-control`; mit `--sm` `size-control-sm`). Leser: E2 (Select, Feld, Hilfe), E5 (Toolbar-Trigger), 3b.

- [ ] **Step 1: Test** — `test/square.test.mjs`:

```js
// Ein Icon-Knopf (und ab P3 der Toggle) ist quadratisch: Breite und Höhe lesen dasselbe Maß.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readGenerated, declarationsOf } from './lib/component.mjs';

export const SQUARE = [
  ['button', 'button.css', '.tl-button--icon', 'size-control'],
  ['button', 'button.css', '.tl-button--icon.tl-button--sm', 'size-control-sm'],
];

for (const [dir, file, sel, mass] of SQUARE) {
  test(`${sel} ist quadratisch aus ${mass}`, () => {
    const d = declarationsOf(readGenerated(dir, file), sel);
    assert.ok(d, `${sel} fehlt`);
    assert.match(d, new RegExp(`width:\\s*var\\(--tl-${mass}\\)`));
    assert.match(d, new RegExp(`height:\\s*var\\(--tl-${mass}\\)`));
    assert.match(d, /padding:\s*0\b/);
  });
}
```

- [ ] **Step 2: Rot sehen** — `node --test test/square.test.mjs` → FAIL.

- [ ] **Step 3: CSS, Lint, Vertrag** — `button.css`:

```css
/* --- Form: der Icon-Knopf ------------------------------------------------ */

/* Quadratisch, ohne Label: der Knopf ist sein Icon. Pflicht am Element: aria-label und Tooltip
   (Vertrag). Mit --sm 24 px — die Mindest-Trefferfläche (WCAG 2.5.8). */
.tl-button--icon {
  width: var(--tl-size-control);
  height: var(--tl-size-control);
  padding: 0;
}

.tl-button--icon.tl-button--sm {
  width: var(--tl-size-control-sm);
  height: var(--tl-size-control-sm);
  min-height: var(--tl-size-control-sm);
  padding: 0;
}
```

`tools/lint-css.mjs:76`: `'tl-button': new Set(['primary', 'secondary', 'ghost', 'link', 'danger', 'sm', 'icon']),`. `button.contract.md`: Zeile `| `tl-button--icon` | quadratisch, ohne `__label`; Pflicht `aria-label` und Tooltip; mit `--sm` 24 px |`; „Konformität“: „Ein Icon-Knopf ohne `aria-label` fällt durch.“; Absatz „Container-Kontext (`ButtonDefaults`)“: `appearance` (Erscheinung; `menu-item` rendert als `button.tl-menu__item`, siehe `menu.contract.md`, und **schlägt die Server-Erscheinung** — ein Eintrag ist Struktur), `iconOnly` (ein Knopf, der sein Icon zeigt, lässt sein Label weg und wird `--icon`; ein Knopf ohne Icon oder mit `label-only` bleibt, wie er ist).

- [ ] **Step 4: Gates, Commit** — `node tools/generate.mjs && node --test && node tools/lint-css.mjs` → grün. `git commit -m "Ticket #29617: Welle 3a -- tl-button--icon, quadratisch aus size-control"`

### Task P3: `tl-toggle` — Auf-/Zuklappen

**Files:**
- Create: `src/components/toggle/toggle.css`, `toggle.contract.md`, `toggle.spec.html`
- Modify: `tools/lint-css.mjs` (`'tl-toggle': new Set([])`), `specimen/index.html`, `test/square.test.mjs` (Zeile ergänzen), `test/components.test.mjs`

**Interfaces:**
- Produces: `button.tl-toggle[aria-expanded]` mit Kind `.tl-icon-sm` (Chevron rechts). Leser: E3 (`TLFormGroup`), 3b (Baum, Baum-Tabelle).

- [ ] **Step 1: Tests** — in `square.test.mjs` SQUARE um `['toggle', 'toggle.css', '.tl-toggle', 'size-control-sm']` ergänzen; in `components.test.mjs` (Import `readGenerated` vorhanden):

```js
test('Toggle: offen dreht das Icon, Reduced Motion gilt über base.css', () => {
  const css = readGenerated('toggle', 'toggle.css');
  assert.match(css, /\.tl-toggle\[aria-expanded="true"\] > \.tl-icon-sm\s*\{[^}]*rotate:\s*90deg/);
  assert.match(css, /transition:\s*rotate var\(--tl-duration-fast\) var\(--tl-easing-standard\)/);
});
```

- [ ] **Step 2: Rot sehen** — `node --test test/square.test.mjs test/components.test.mjs` → FAIL.

- [ ] **Step 3: CSS** (Tokens `--tl-icon-primary`, `--tl-icon-disabled` existieren):

```css
/* Toggle — docs/skalen.md „Gleiches wird zusammengelegt“ (W4).
   Ein Knopf, ein Glyph: der Chevron zeigt rechts (zu) und dreht bei aria-expanded auf unten (offen).
   24 px quadratisch — die Mindest-Trefferfläche. Ghost-Optik; den Fokusring liefert base.css.
   Ein Dropdown-Indikator (Select-Pfeil) ist kein Toggle: er zeigt unten = zu, oben = offen. */

.tl-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--tl-size-control-sm);
  height: var(--tl-size-control-sm);
  padding: 0;
  border: var(--tl-border-width-sm) solid transparent;
  border-radius: var(--tl-radius-sm);
  background: transparent;
  color: var(--tl-icon-primary);
  cursor: pointer;
}
.tl-toggle[hidden] { display: none; }

.tl-toggle:hover {
  background: var(--tl-surface-interactive-hover);
}

.tl-toggle:active {
  background: var(--tl-surface-interactive-active);
}

.tl-toggle:disabled {
  color: var(--tl-icon-disabled);
  background: transparent;
  cursor: default;
}

.tl-toggle > .tl-icon-sm {
  transition: rotate var(--tl-duration-fast) var(--tl-easing-standard);
}

.tl-toggle[aria-expanded="true"] > .tl-icon-sm {
  rotate: 90deg;
}
```

- [ ] **Step 4: Vertrag und Specimen** — `toggle.contract.md` nach dem Muster von `divider.contract.md`: Zustand (`expanded`, `disabled`), Aktionen (`toggle`), Tastatur (Enter/Space nativ), Tokens, Attribute (`tl-toggle`, `aria-expanded`, `aria-controls`, `aria-label` + Tooltip Pflicht; Kind `tl-icon-sm` mit dem Chevron-rechts-Glyph der Theme-Konfiguration), Konformität; Satz „Zwei Wörter, zwei Richtungen“ aus Spec §6. `toggle.spec.html` nach `divider.spec.html` (Zeilen „zu“, „offen“, „deaktiviert“; Glyph `bi bi-chevron-right`); Index-Link nach Divider.

- [ ] **Step 5: Gates, Commit** — `node tools/generate.mjs && node --test && node tools/lint-css.mjs` → grün. `git commit -m "Ticket #29617: Welle 3a -- tl-toggle: ein Knopf, ein Chevron, 24 px"`

### Task P4: `tl-popover` und `tl-menu`

**Files:**
- Create: `src/components/popover/popover.css`, `popover.contract.md`; `src/components/menu/menu.css`, `menu.contract.md`, `menu.spec.html`
- Modify: `tools/lint-css.mjs` (Blöcke `tl-popover`, `tl-menu`, `tl-menu-region`), `specimen/index.html`
- Test: `test/popover.test.mjs` (neu; Fall „nur tl-popover liest shadow-popover“ kommt in P6)

**Interfaces:**
- Produces: `.tl-popover`; `.tl-menu`, `.tl-menu__item`, `.tl-menu__icon`, `.tl-menu__label`, `.tl-menu__header`, `.tl-menu > .tl-divider`; `.tl-menu-region[data-tl-trigger="contextmenu"|"click"]`. In Kraft ist `aria-current="true"` **plus** `tl-type-label-strong` am Eintrag (das TSX setzt die Typo-Klasse; `font-weight` steht nur in `tl-type-*`). Leser: E1, E4, E5, E7.

- [ ] **Step 1: Test** — `test/popover.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readGenerated, declarationsOf, missingInContract } from './lib/component.mjs';

test('tl-popover: Overlay-Fläche, Schatten, Ebene popover, Maße aus den Tokens', () => {
  const d = declarationsOf(readGenerated('popover', 'popover.css'), '.tl-popover');
  for (const t of ['surface-overlay', 'border-separator', 'radius-md', 'shadow-popover', 'layer-popover',
    'size-popover-min', 'size-popover-max']) assert.match(d, new RegExp(`var\\(--tl-${t}\\)`));
});

test('tl-menu__item: Zeilenhöhe size-row, Zustand nur als Attribut, In-Kraft über die Typo-Klasse', () => {
  const css = readGenerated('menu', 'menu.css');
  assert.match(declarationsOf(css, '.tl-menu__item'), /min-height:\s*var\(--tl-size-row\)/);
  assert.doesNotMatch(css, /--(focused|active|disabled)\b/);
  assert.doesNotMatch(css, /font-weight/);
  const md = readFileSync(new URL('../src/components/menu/menu.contract.md', import.meta.url), 'utf8');
  assert.deepEqual(missingInContract(md, ['aria-current', 'tl-type-label-strong', 'tl-menu-region', 'data-tl-trigger']), []);
});
```

- [ ] **Step 2: Rot sehen** — `node --test test/popover.test.mjs` → FAIL.

- [ ] **Step 3: popover.css**

```css
/* Popover — docs/skalen.md „Scrim und Ebenen“, „Gleiches wird zusammengelegt“ (W1).
   Die eine Fläche für alles, was über der Oberfläche schwebt und einen Anker hat: Menü, Select-Popup,
   Toolbar-Überlauf. Die Lage setzt bridge/popover.ts (floating-ui, fixed) inline; hier stehen Fläche,
   Ebene und Grenzen. Mindestbreite und Höhe sind Maße, keine Literale. */

.tl-popover {
  position: fixed;
  z-index: var(--tl-layer-popover);
  box-sizing: border-box;
  min-width: var(--tl-size-popover-min);
  max-height: var(--tl-size-popover-max);
  overflow: auto;
  padding: var(--tl-space-xs);
  border: var(--tl-border-width-sm) solid var(--tl-border-separator);
  border-radius: var(--tl-radius-md);
  background: var(--tl-surface-overlay);
  box-shadow: var(--tl-shadow-popover);
  color: var(--tl-text-primary);
}
.tl-popover[hidden] { display: none; }
```

- [ ] **Step 4: menu.css**

```css
/* Menu — docs/skalen.md „Gleiches wird zusammengelegt“ (W2, W3).
   Ein Menü ist ein tl-popover mit Einträgen. Der Fokus ist echt (Roving-Tabindex): der Ring aus
   base.css ist der Cursor, innen, weil der Behälter scrollt. Zustände sind Attribute: aria-current
   (in Kraft; das Gewicht trägt tl-type-label-strong), disabled. Zeigen ist surface-interactive-hover —
   seit „Zeigen auf allen Gründen“ auch dunkel auf dem Overlay sichtbar. */

.tl-menu {
  display: flex;
  flex-direction: column;
}
.tl-menu[hidden] { display: none; }

.tl-menu__item {
  display: flex;
  align-items: center;
  gap: var(--tl-space-xs);
  width: 100%;
  min-height: var(--tl-size-row);
  padding: 0 var(--tl-space-control-x);
  border: 0;
  border-radius: var(--tl-radius-sm);
  background: transparent;
  color: var(--tl-text-primary);
  font: inherit;
  text-align: start;
  cursor: pointer;
}
.tl-menu__item[hidden] { display: none; }

.tl-menu__item:hover {
  background: var(--tl-surface-interactive-hover);
}

.tl-menu__item:active {
  background: var(--tl-surface-interactive-active);
}

.tl-menu__item:focus-visible {
  outline-offset: calc(-1 * var(--tl-focus-offset));
}

.tl-menu__item:disabled {
  color: var(--tl-text-disabled);
  background: transparent;
  cursor: default;
}

.tl-menu__icon {
  flex-shrink: 0;
}

.tl-menu__label {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tl-menu__header {
  padding: var(--tl-space-2xs) var(--tl-space-control-x);
  color: var(--tl-text-secondary);
}

.tl-menu > .tl-divider {
  margin-block: var(--tl-space-2xs);
}

/* --- Auslöser --------------------------------------------------------------- */

/* Eine Kontextmenü-Region ist reine Durchreiche: keine eigene Box. Ein Klick-Auslöser ist ein
   nativer Knopf mit tl-button tl-button--ghost (Vertrag) — die Klasse markiert ihn nur. */
.tl-menu-region[data-tl-trigger="contextmenu"] {
  display: contents;
}
.tl-menu-region[hidden] { display: none; }
```

- [ ] **Step 5: Lint** — `'tl-popover': new Set([]), 'tl-menu': new Set([]), 'tl-menu-region': new Set([]),`.

- [ ] **Step 6: Verträge** — `popover.contract.md` (Zustand `open`, Anker Element oder Punkt; Verhalten: Escape, Außenklick, Fokus zurück zum Auslöser, folgt Scroll und Resize, klappt um, bleibt im Viewport; Tokens; Attribute `tl-popover`, `data-tl-anchored-overlay` im Portal; Konformität). `menu.contract.md`: Zustand (`items`, `open`, `anchorId`/`anchorX`/`anchorY`), Aktionen (`selectItem`, `close`), **Tastatur** (Pfeile zyklisch, Home/End, Enter/Space, Escape; Fokus wandert mit, deaktivierte Einträge werden übersprungen), Tokens, Attribute (`tl-menu` am `role=menu`; `tl-menu__item` am `role=menuitem`, in Kraft `aria-current="true"` + `tl-type-label-strong`, Umschalter `role=menuitemcheckbox` + `aria-checked`; `tl-menu__header` `role=presentation`; `tl-divider`; `tl-menu-region` mit `data-tl-trigger`, bei `click` ein `button.tl-button--ghost` mit `aria-haspopup="menu"`, `aria-expanded`, Kinder nicht interaktiv (Avatar, Text); Kontextmenü per `Shift+F10` und Kontextmenü-Taste), Konformität. Satz: „Ein `TLButton` unter `ButtonDefaults appearance="menu-item"` ist ein Eintrag; der Container schlägt die Server-Erscheinung.“

- [ ] **Step 7: Specimen** — `menu.spec.html`: statisch geöffnetes `div.tl-popover.tl-menu[role=menu]` mit Header, Einträgen (einer `aria-current` + `tl-type-label-strong`, einer `disabled`, einer mit Icon), `hr.tl-divider`; Auslöser `button.tl-menu-region.tl-button.tl-button--ghost[data-tl-trigger=click][aria-haspopup=menu][aria-expanded=true]`; auf layer/base/overlay; Index-Link.

- [ ] **Step 8: Gates, Commit** — `node tools/generate.mjs && node --test && node tools/lint-css.mjs` → grün. `git commit -m "Ticket #29617: Welle 3a -- tl-popover und tl-menu: eine Flaeche, ein Eintrag, echter Fokus"`

### Task P5: `tl-toolbar`, `tl-tabs`, `tl-breadcrumb`

**Files:**
- Create: `src/components/toolbar/{toolbar.css,toolbar.contract.md,toolbar.spec.html}`, `src/components/tabs/{…}`, `src/components/breadcrumb/{…}`
- Modify: `tools/lint-css.mjs`, `specimen/index.html`, `test/components.test.mjs` (**Import erweitern:** `import { readGenerated, declarationsOf } from './lib/component.mjs';`)

**Interfaces:**
- Produces: `.tl-toolbar[data-tl-overflow][data-tl-compact]`, `.tl-toolbar__group`; `.tl-tabs`, `__list`, `__tab[aria-selected]`, `__panel`; `.tl-breadcrumb`, `__list`, `__entry`, `__separator`, `__current`. Leser: E5, E6.

- [ ] **Step 1: Test** — in `components.test.mjs`:

```js
test('Toolbar, Tabs, Breadcrumb lesen nur Tokens und kennen keine Zustandsklasse', () => {
  for (const [dir, file] of [['toolbar', 'toolbar.css'], ['tabs', 'tabs.css'], ['breadcrumb', 'breadcrumb.css']]) {
    assert.doesNotMatch(readGenerated(dir, file), /--(active|compact|collapsible)\b/, `${file}: Zustand als Klasse`);
  }
  const tabs = readGenerated('tabs', 'tabs.css');
  const aktiv = declarationsOf(tabs, '.tl-tabs__tab[aria-selected="true"]');
  assert.match(aktiv, /border-color:\s*var\(--tl-border-interactive\)/);
  assert.doesNotMatch(aktiv, /font-weight/);
  assert.match(declarationsOf(tabs, '.tl-tabs__panel'), /flex-direction:\s*column/);
});
```

- [ ] **Step 2: Rot sehen** — `node --test test/components.test.mjs` → FAIL.

- [ ] **Step 3: toolbar.css**

```css
/* Toolbar — docs/skalen.md „Gleiches wird zusammengelegt“ (W12).
   Die Einträge sind Button-Controls; die Toolbar gibt ihnen die Erscheinung (ButtonDefaults) und sagt
   ihnen, wann sie kompakt sind (iconOnly) — keine Regel hier liest tl-button__label. Trenner sind
   tl-divider--vertical. Zustände sind Attribute: data-tl-overflow (kollabiert an diesem Ende),
   data-tl-compact (Icons statt Label). */

.tl-toolbar {
  display: flex;
  align-items: center;
  gap: var(--tl-space-xs);
  padding-block: var(--tl-space-2xs);
  flex-shrink: 0;
}
.tl-toolbar[hidden] { display: none; }

/* Eine kollabierende Toolbar nennt ihre natürliche Breite (Inline-Stil aus TLToolbar) und gibt sie bis
   zum Überlauf-Trigger wieder her; ihr Inhalt sitzt am Ende, zu dem sie kollabiert. */
.tl-toolbar[data-tl-overflow] {
  flex-shrink: 1;
  min-width: var(--tl-size-control);
  justify-content: flex-end;
}

.tl-toolbar[data-tl-overflow="leading"] {
  justify-content: flex-start;
}

.tl-toolbar__group {
  display: flex;
  align-items: center;
  gap: var(--tl-space-2xs);
}

.tl-toolbar__group > :empty {
  display: none;
}
```

- [ ] **Step 4: tabs.css**

```css
/* Tabs — docs/skalen.md „Gleiches wird zusammengelegt“ (W2, W3).
   role=tablist/tab/tabpanel; Roving-Tabindex, Pfeile wählen. Aktiv ist aria-selected: Akzentlinie
   unten und text-primary, kein Fettdruck — nichts springt beim Wechsel. Den Fokusring liefert base.css.
   Das Panel ist eine Flex-Spalte, damit füllende Kinder (die virtualisierte Tabelle) ihre Höhe bekommen. */

.tl-tabs {
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.tl-tabs[hidden] { display: none; }

.tl-tabs__list {
  display: flex;
  gap: var(--tl-space-xs);
  padding: 0 var(--tl-space-sm);
  border-bottom: var(--tl-border-width-sm) solid var(--tl-border-separator);
  flex-shrink: 0;
}

.tl-tabs__tab {
  display: inline-flex;
  align-items: center;
  gap: var(--tl-space-xs);
  min-height: var(--tl-size-control);
  padding: 0 var(--tl-space-md);
  border: 0;
  border-bottom: var(--tl-border-width-accent) solid transparent;
  background: transparent;
  color: var(--tl-text-secondary);
  font: inherit;
  white-space: nowrap;
  cursor: pointer;
}

.tl-tabs__tab:hover {
  color: var(--tl-text-primary);
  background: var(--tl-surface-interactive-hover);
}

.tl-tabs__tab[aria-selected="true"] {
  color: var(--tl-text-primary);
  border-color: var(--tl-border-interactive);
}

.tl-tabs__panel {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
}
```

- [ ] **Step 5: breadcrumb.css** (`--tl-icon-secondary` existiert)

```css
/* Breadcrumb — docs/skalen.md „Gleiches wird zusammengelegt“ (W2, W4).
   nav > ol > li; die Einträge sind tl-button--link, die aktuelle Seite ein Text mit aria-current,
   der Trenner ein tl-icon-sm (aria-hidden). Keine eigene Schrift, keine eigene Fokusregel. */

.tl-breadcrumb__list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--tl-space-2xs);
  margin: 0;
  padding: 0;
  list-style: none;
}

.tl-breadcrumb__entry {
  display: inline-flex;
  align-items: center;
  gap: var(--tl-space-2xs);
}

.tl-breadcrumb__separator {
  color: var(--tl-icon-secondary);
}

.tl-breadcrumb__current {
  color: var(--tl-text-primary);
}
```

- [ ] **Step 6: Lint** — `'tl-toolbar': new Set([]), 'tl-tabs': new Set([]), 'tl-breadcrumb': new Set([]),`.

- [ ] **Step 7: Verträge und Specimen** — drei Verträge nach dem Muster von P4; Tastatur: Tabs Pfeile links/rechts + Home/End wählen und fokussieren; Toolbar: Tab-Reihenfolge der Knöpfe, Overflow-Menü wie `menu.contract.md`, Kompakt heißt „jeder Knopf, der sein Icon zeigt, wird `--icon`“; Breadcrumb: native Knöpfe. Specimen: Toolbar in drei Erscheinungen mit `tl-divider--vertical`, eine mit `data-tl-compact` (Knöpfe `tl-button--icon`), eine mit Overflow-Trigger (`tl-button--icon`, `bi bi-three-dots`); Tabs mit drei Reitern (einer `aria-selected`); Breadcrumb mit drei Stufen. Index-Links.

- [ ] **Step 8: Gates, Commit** — `node tools/generate.mjs && node --test && node tools/lint-css.mjs` → grün. `git commit -m "Ticket #29617: Welle 3a -- tl-toolbar, tl-tabs, tl-breadcrumb im Paket"`

### Task P6: Nachzüge Welle 2 im Paket — Select-Popup liest `tl-popover`, drei Icon-Knopf-Blöcke fallen, Toggle in der FormGroup

**Files:**
- Modify: `src/components/select/select.css:52-86` (Chip, `__chip-remove`, `__clear`), `:117-138` (Popup); `src/components/field/field.css:63-103` (Gruppe: `__action` in 70–71, 84–96, 103); `src/components/form/form.css:160-178` (`__toggle`)
- Modify: `select.contract.md`, `field.contract.md`, `form.contract.md`; Specimen `select.spec.html`, `field.spec.html`, `form.spec.html`
- Test: `test/select.test.mjs` (Import `readGenerated` **ergänzen**), `test/field.test.mjs`, `test/form.test.mjs`, `test/popover.test.mjs` (Fall 2 jetzt)

**Interfaces:**
- Consumes: `tl-popover` (P4), `tl-button--icon` (P2), `tl-toggle` (P3).
- Produces: `.tl-select__popup` = nur Layout, am Element zusammen mit `tl-popover` (E2 setzt beide); `.tl-select__chip > .tl-button`, `.tl-field-group > .tl-button` als Lage-Regeln; die Klassen `tl-select__chip-remove`, `tl-select__clear`, `tl-field-group__action`, `tl-form-group__toggle` existieren nicht mehr.

- [ ] **Step 1: Tests** — betroffen sind (Reviewer): `select.test.mjs` „select.css liest genau diese Farbrollen“, „das Popup schwebt …“ (Zeile 18), 65/84/86; `field.test.mjs` „field.css liest genau die Farbrollen des Feldes“, 97; `form.test.mjs` „form.css liest genau diese Farbrollen …“, 75/76. Jeden Fall auf den neuen Stand bringen: Rollenlisten ohne `shadow-popover`/`surface-overlay`/`layer-popover` (Select) und ohne die Hover-Rollen der gestrichenen Knöpfe (Feld, Form), Abwesenheitsprüfung der vier Klassen in `src/`, Ersatz über `missingInContract(md, ['tl-button--icon'])` bzw. `['tl-toggle']`. In `select.test.mjs` ergänzen:

```js
test('das Select-Popup trägt die Fläche nicht selbst: tl-popover liefert sie', () => {
  const d = declarationsOf(readGenerated('select', 'select.css'), '.tl-select__popup');
  assert.doesNotMatch(d, /shadow-popover|surface-overlay|layer-popover|border-radius|position/);
  assert.match(d, /max-height:\s*calc\(8 \* var\(--tl-size-row\)/);
});
```

In `popover.test.mjs` anhängen:

```js
test('nur tl-popover setzt die Popup-Fläche: kein anderer Block liest shadow-popover', () => {
  const hits = [];
  for (const [name, css] of componentCssFiles()) if (!name.startsWith('popover/') && /--tl-shadow-popover/.test(css)) hits.push(name);
  assert.deepEqual(hits, []);
});
```

(`componentCssFiles` importieren.)

- [ ] **Step 2: Rot sehen** — `node --test test/select.test.mjs test/field.test.mjs test/form.test.mjs test/popover.test.mjs` → FAIL.

- [ ] **Step 3: CSS** — `select.css` Popup:

```css
/* Höchstens acht Optionszeilen plus Suchfeld und Innenabstand; die 8 ist eine Anzahl Zeilen,
   einheitenlos, kein Maß. Fläche, Ebene und Lage: tl-popover (bridge/popover.ts). */
.tl-select__popup {
  display: flex;
  flex-direction: column;
  max-height: calc(8 * var(--tl-size-row) + var(--tl-size-control) + 2 * var(--tl-space-xs));
  overflow: hidden;
}
```

`select.css` 61–86 löschen und ersetzen durch die Lage des Entfernen-Knopfs in der Pille (negatives `margin-block`, sonst wächst die Pille über `size-control-sm`):

```css
/* Der Entfernen-Knopf ist ein tl-button--icon --sm --ghost; er liegt in der Pille, ohne sie zu heben. */
.tl-select__chip > .tl-button {
  margin-block: calc(-1 * var(--tl-border-width-sm));
  margin-inline-end: calc(-1 * var(--tl-space-2xs));
}
```

`field.css`: in 70–71 `.tl-field-group__action` aus der Selektorliste streichen; 84–96 ersetzen durch:

```css
/* Die Aktion in der Gruppe (Löschen, Link öffnen) ist ein tl-button--icon --sm --ghost und sitzt im
   Feld, am Ende; das Feld macht ihr Platz (:has unten). */
.tl-field-group > .tl-button {
  position: absolute;
  inset-inline-end: var(--tl-space-2xs);
  top: 50%;
  translate: 0 -50%;
}
```

Zeile 103: `:has(> .tl-field-group__action)` → `:has(> .tl-button)`. `form.css` 160–178 löschen (`.tl-form-group__header` behält `gap`).

- [ ] **Step 4: Verträge (inkl. Doku-Pass N8)** — Select: „Chip entfernen und Leeren sind `tl-button tl-button--ghost tl-button--sm tl-button--icon` mit `aria-label`; das Popup trägt `tl-popover tl-select__popup`“; „Wert-Chip“ statt „Chip“; „die Liste führt nur ungewählte Optionen, `aria-selected="false"` an jeder“; `disabled` liest `state.disabled` wie der Button. Feld: „Die Aktion in der Gruppe ist ein `tl-button--icon --sm --ghost`“; `hidden`: bleibt im DOM (wie `form.contract.md`). Form: „Der Einklappknopf ist ein `tl-toggle`.“ Choice: `disabled` wie oben.

- [ ] **Step 5: Specimen** — die drei Specimen auf die neuen Klassen umstellen.

- [ ] **Step 6: Gates, Commit** — `node tools/generate.mjs && node --test && node tools/lint-css.mjs` → **alles grün**. `git commit -m "Ticket #29617: Welle 3a -- Nachzuege Welle 2: Select-Popup auf tl-popover, Icon-Knoepfe und Toggle aus dem Paket"`

### Task P7: Fokus-Gate, Verträge-Gate, Specimen-CSS

**Files:**
- Create: `test/focus.test.mjs`, `test/contracts-3a.test.mjs`, `specimen/specimen.css`
- Modify: alle 18 `*.spec.html` (13 bestehende, 5 neue: Style-Block → `<link rel="stylesheet" href="/specimen/specimen.css">`), ggf. `src/components/form/upload.css:22`
- **Nicht** anfassen: `test/engine-classes.test.mjs` (erst E9), `test/ratchet.json` (je E-Task).

- [ ] **Step 1: focus.test.mjs** (Spec §5, fortgeschrieben: ein Drop-Ziel ist kein Fokus — `outline` in `border-interactive` ist erlaubt, `focus-ring` setzt nur `base.css`):

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { declarations } from '../tools/lib/css.mjs';
import { componentCssFiles } from './lib/component.mjs';

const OFFSET = /^(calc\(-1 \* var\(--tl-focus-offset\)\)|var\(--tl-focus-offset\))$/;

test('kein Komponentenblock setzt den Fokusring; outline nur als Drop-Ziel in border-interactive', () => {
  const bad = [];
  for (const [name, css] of componentCssFiles()) {
    for (const d of declarations(css)) {
      if (/^outline(-color|-width)?$/.test(d.property) && !/--tl-border-interactive/.test(d.value)) bad.push(`${name}:${d.line} ${d.property}: ${d.value}`);
      if (/--tl-focus-ring/.test(d.value)) bad.push(`${name}:${d.line} liest focus-ring`);
      if (d.property === 'outline-offset' && !OFFSET.test(d.value.trim())) bad.push(`${name}:${d.line} ${d.value}`);
    }
  }
  assert.deepEqual(bad, []);
});

test('base.css trägt den Ring genau einmal', () => {
  const base = readFileSync(new URL('../dist/base.css', import.meta.url), 'utf8');
  assert.equal((base.match(/outline:\s*var\(--tl-focus-width\) solid var\(--tl-focus-ring\)/g) ?? []).length, 1);
});
```

Rot sehen; `upload.css:22` (Dragover) prüfen: liest es `--tl-border-interactive`, ist es grün; liest es `focus-ring`, auf `border-interactive` umstellen (Kommentar „Drop-Ziel, kein Fokus“).

- [ ] **Step 2: contracts-3a.test.mjs** — je neuem Vertrag `missingInContract`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { missingInContract } from './lib/component.mjs';
const md = (d, f) => readFileSync(new URL(`../src/components/${d}/${f}`, import.meta.url), 'utf8');
const SOLL = {
  'popover/popover.contract.md': ['tl-popover', 'data-tl-anchored-overlay', 'layer-popover'],
  'menu/menu.contract.md': ['tl-menu', 'tl-menu__item', 'role="menu"', 'aria-current', 'Home', 'End', 'Escape', 'tl-menu-region', 'aria-expanded'],
  'toolbar/toolbar.contract.md': ['tl-toolbar', 'data-tl-overflow', 'data-tl-compact', 'tl-divider--vertical', 'iconOnly'],
  'tabs/tabs.contract.md': ['tl-tabs', 'role="tablist"', 'aria-selected', 'aria-controls', 'ArrowRight', 'Home'],
  'breadcrumb/breadcrumb.contract.md': ['tl-breadcrumb', 'aria-current="page"', 'tl-button--link', 'js.breadcrumb.label'],
  'toggle/toggle.contract.md': ['tl-toggle', 'aria-expanded', 'aria-controls', 'aria-label'],
};
for (const [file, names] of Object.entries(SOLL)) test(`${file} nennt ${names.length} Pflichtbegriffe`, () => {
  const [d, f] = file.split('/');
  assert.deepEqual(missingInContract(md(d, f), names), []);
});
```

- [ ] **Step 2a: Lint-Lücke Prozent** (Plan-Review): die Maß-Regel `LENGTH` in `tools/lint-css.mjs` endet auf `\b`; nach `%` liegt keine Wortgrenze, darum meldet das Lint **kein** Prozent-Literal (`width: 37%` geht durch). Regel: `(^|\s)-?\d*\.?\d+(px|rem|em|vh|vw|ch|pt)\b|(^|\s)-?\d*\.?\d+%(?=\s|;|$|\))` und in `ALLOWED` zusätzlich `'50%'`, `'-50%'` (P6 liest sie; `100%` steht schon). Test in `test/lint-css.test.mjs`: `.tl-x{width:37%}` wird gemeldet, `translate: 0 -50%` nicht. Danach `node tools/lint-css.mjs` über alles — ein Treffer im Bestand ist ein Welle-2-Nachzug (im Commit nennen).

- [ ] **Step 3: specimen.css** — gemeinsame Regeln aus `divider.spec.html` nach `specimen/specimen.css`; jede der 18 `*.spec.html` lädt sie; Abweichungen als `.specimen__row--wide` dort. `node tools/serve.mjs`, zwei Specimen im Browser prüfen (nichts verschoben).

- [ ] **Step 4: Gates, Commit** — `node --test && node tools/lint-css.mjs` → grün (245 + neue). `git commit -m "Ticket #29617: Welle 3a -- Fokus-Gate, Vertraege-Gate, specimen.css"`

---

## Teil E — Engine (Branch `CWS/CWS_29617_design_system_welle_3a`)

**Reihenfolge:** E1 (Popup, Menü) → E2, E3 (Nachzüge Welle 2 — sofort, weil `dist/` ab E1 die alten Welle-2-Klassen nicht mehr stylt) → E4 (Tabellenmenü) → E5 (Toolbar) → E6 (Tabs, Breadcrumb) → E7 (Region) → E8 (Benutzermenü) → E9 (Gates, PR).

### Task E1: Branch, Paket publizieren, `usePopover`, `Menu`, `TLMenu`

**Files:**
- Create: `react-src/bridge/popover.ts`, `react-src/controls/menu/Menu.tsx`
- Modify: `react-src/bridge-entry.ts`, `react-src/controls/TLMenu.tsx`, `tlReactControls.css:2794-2910`, `design-system/test/ratchet.json`
- Test: `npm run build` (tsc + Vite), Modul-Tests `layout.react`

**Interfaces:**
```ts
// bridge/popover.ts
export type PopoverAnchor = Element | { x: number; y: number };
export interface PopoverOptions { open: boolean; anchor: PopoverAnchor | null; placement?: 'bottom-start' | 'bottom-end' | 'top-start'; }
export function usePopover(opts: PopoverOptions): { setFloating: (el: HTMLElement | null) => void; style: React.CSSProperties };
// controls/menu/Menu.tsx
export function useRovingMenu(ref: React.RefObject<HTMLElement | null>, open: boolean, onClose: () => void): { onKeyDown: (e: React.KeyboardEvent) => void };
export const Menu: React.FC<MenuProps>; export const MenuItem, MenuHeader, MenuSeparator;
```
Schließen (Escape, Außenklick) macht der Aufrufer bzw. `Menu` — der Hook positioniert nur.

- [ ] **Step 1: Branch und Paket**

```bash
cd _Working-Tree/tl8-wt-29584 && git fetch && git checkout -b CWS/CWS_29617_design_system_welle_3a origin/CWS/CWS_29617_design_system_welle_2
cd ../../design-system && node tools/publish-to-worktree.mjs
cd ../_Working-Tree/tl8-wt-29584 && git add com.top_logic.layout.react/src/main/webapp/style/tl-design-system && git commit -m "Ticket #29617: design system republished from the package (wave 3a: popover, menu, toolbar, tabs, breadcrumb, toggle, icon button)"
```

- [ ] **Step 2: `bridge/popover.ts`**

```ts
/**
 * The one way a transient surface - a menu, a select popup, a toolbar overflow - is placed: at an
 * anchor element or a viewport point, flipped when it does not fit, shifted to stay inside the
 * viewport, following scroll and resize while open. Surface, layer and shadow are the design
 * system's (tl-popover); this hook only yields the position. Closing is the caller's.
 */
import React from 'react';
import { useFloating, autoUpdate, offset, flip, shift } from '@floating-ui/react';

export type PopoverAnchor = Element | { x: number; y: number };

export interface PopoverOptions {
  open: boolean;
  anchor: PopoverAnchor | null;
  placement?: 'bottom-start' | 'bottom-end' | 'top-start';
}

/** The gap between anchor and surface: space-xs, read from the tokens so it follows the density. */
function gapPx(): number {
  const root = getComputedStyle(document.documentElement);
  const v = root.getPropertyValue('--tl-space-xs').trim();
  const rem = parseFloat(root.fontSize) || 16;
  const n = parseFloat(v);
  return isNaN(n) ? 8 : v.endsWith('rem') ? n * rem : n;
}

export function usePopover(opts: PopoverOptions): { setFloating: (el: HTMLElement | null) => void; style: React.CSSProperties } {
  const { open, anchor, placement = 'bottom-start' } = opts;
  const { refs, floatingStyles } = useFloating({
    open,
    placement,
    strategy: 'fixed',
    middleware: [offset(gapPx()), flip(), shift({ padding: gapPx() })],
    whileElementsMounted: open ? autoUpdate : undefined,
  });
  // floating-ui keeps the position reference as state: set it on every change, element or point,
  // or a menu once opened at a point stays there when it is next opened at an element.
  const x = anchor && !(anchor instanceof Element) ? anchor.x : null;
  const y = anchor && !(anchor instanceof Element) ? anchor.y : null;
  React.useLayoutEffect(() => {
    if (!open || !anchor) return;
    if (anchor instanceof Element) { refs.setPositionReference(anchor); return; }
    const r = { x: anchor.x, y: anchor.y, left: anchor.x, top: anchor.y, right: anchor.x, bottom: anchor.y, width: 0, height: 0 };
    refs.setPositionReference({ getBoundingClientRect: () => r });
  }, [open, anchor instanceof Element ? anchor : null, x, y, refs]);
  // Only an open surface is observed: a mounted-but-hidden overflow menu must not run autoUpdate.
  const setFloating = React.useCallback((el: HTMLElement | null) => refs.setFloating(open ? el : null), [open, refs]);
  return { setFloating, style: floatingStyles };
}
```

`bridge-entry.ts`: `export { usePopover } from './bridge/popover'; export type { PopoverAnchor, PopoverOptions } from './bridge/popover';`

- [ ] **Step 3: `controls/menu/Menu.tsx`**

```tsx
import { React, useCloseOnOutsidePress, useFocusTrap, createPortal, usePopover, ThemeIcon, anchoredOverlayProps } from 'tl-react-bridge';
import type { PopoverAnchor, PopoverOptions } from 'tl-react-bridge';

const { useCallback, useEffect, useRef } = React;

const ITEM = '[role="menuitem"]:not([disabled]), [role="menuitemcheckbox"]:not([disabled])';

/**
 * Roving tabindex over the entries of a menu: exactly one entry is in the tab order, the one that
 * has focus; arrows cycle, Home/End jump, Escape closes; disabled entries are skipped. Shared by
 * Menu and the toolbar overflow.
 */
export function useRovingMenu(ref: React.RefObject<HTMLElement | null>, open: boolean, onClose: () => void): { onKeyDown: (e: React.KeyboardEvent) => void } {
  const items = useCallback(() => Array.from(ref.current?.querySelectorAll<HTMLElement>(ITEM) ?? []), [ref]);

  useEffect(() => {
    if (!open) return;
    items().forEach((el, i) => el.setAttribute('tabindex', i === 0 ? '0' : '-1'));
  }, [open, items]);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    const all = items();
    if (all.length === 0) return;
    const current = all.indexOf(document.activeElement as HTMLElement);
    let next = -1;
    if (e.key === 'ArrowDown') next = (current + 1) % all.length;
    else if (e.key === 'ArrowUp') next = (current - 1 + all.length) % all.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = all.length - 1;
    else if (e.key === 'Escape') { e.preventDefault(); onClose(); return; }
    if (next < 0) return;
    e.preventDefault();
    all.forEach((el, i) => el.setAttribute('tabindex', i === next ? '0' : '-1'));
    all[next].focus();
  }, [items, onClose]);

  return { onKeyDown };
}

export interface MenuProps {
  open: boolean;
  anchor: PopoverAnchor | null;
  onClose: () => void;
  placement?: PopoverOptions['placement'];
  id?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * The one menu: a tl-popover with entries, portaled to the body, placed by usePopover, closed on
 * Escape and on a press outside. Mounted only while open - a caller that needs its entries to stay
 * live (the toolbar overflow) keeps them mounted itself and uses useRovingMenu directly.
 */
export const Menu: React.FC<MenuProps> = ({ open, anchor, onClose, placement, id, className, children }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { setFloating, style } = usePopover({ open, anchor, placement });
  useCloseOnOutsidePress(open, [ref], onClose);
  useFocusTrap(open, ref, 'first');
  const { onKeyDown } = useRovingMenu(ref, open, onClose);

  if (!open) return null;
  return createPortal(
    <div
      id={id}
      ref={(el) => { ref.current = el; setFloating(el); }}
      className={'tl-popover tl-menu' + (className ? ' ' + className : '')}
      role="menu"
      style={style}
      onKeyDown={onKeyDown}
      {...anchoredOverlayProps}
    >
      {children}
    </div>,
    document.body,
  );
};

export const MenuItem: React.FC<{ id?: string; icon?: string; label: string; disabled?: boolean; current?: boolean; className?: string; onSelect: () => void }> =
  ({ id, icon, label, disabled, current, className, onSelect }) => (
    <button
      type="button"
      id={id}
      className={'tl-menu__item ' + (current ? 'tl-type-label-strong' : 'tl-type-label') + (className ? ' ' + className : '')}
      role="menuitem"
      aria-current={current ? 'true' : undefined}
      disabled={disabled}
      tabIndex={-1}
      onClick={onSelect}
    >
      {icon && <ThemeIcon encoded={icon} className="tl-menu__icon tl-icon-sm" />}
      <span className="tl-menu__label">{label}</span>
    </button>
  );

export const MenuHeader: React.FC<{ label: string }> = ({ label }) => (
  <div className="tl-menu__header tl-type-label" role="presentation">{label}</div>
);

export const MenuSeparator: React.FC = () => <hr className="tl-divider" />;
```

Enter/Space auf einem fokussierten `button` lösen `click` nativ aus. Escape: `preventDefault` hält den Keyboard-Dispatcher an (`keyboard-dispatcher.ts:191`). Die Ref-Funktion `(el) => { ref.current = el; setFloating(el); }` robuster über `useMergeRefs([ref, setFloating])` aus `@floating-ui/react` (exportiert) — dann auch in E2 und E5 so.

- [ ] **Step 4: `TLMenu.tsx`**

```tsx
import { React, useTLState, useTLCommand, rootClassName } from 'tl-react-bridge';
import type { TLCellProps, MenuStateJson } from 'tl-react-bridge';
import { Menu, MenuItem, MenuHeader, MenuSeparator } from './menu/Menu';

type MenuItemState = Partial<MenuStateJson.Entry> & Required<Pick<MenuStateJson.Entry, 'type' | 'id' | 'label'>>;

/** A popup menu the server opens at an anchor element (anchorId) or a viewport point (anchorX/Y). */
const TLMenu: React.FC<TLCellProps> = ({ controlId }) => {
  const state = useTLState<Partial<MenuStateJson>>();
  const sendCommand = useTLCommand();
  const open = state.open === true;
  const items = (state.items ?? []) as MenuItemState[];
  const anchor = state.anchorId
    ? document.getElementById(state.anchorId)
    : state.anchorX != null && state.anchorY != null ? { x: state.anchorX, y: state.anchorY } : null;
  const close = React.useCallback(() => sendCommand('close'), [sendCommand]);
  return (
    <Menu id={controlId} className={rootClassName(state)} open={open} anchor={anchor} onClose={close}>
      {items.map((item, i) => item.type === 'separator' ? <MenuSeparator key={i} />
        : item.type === 'header' ? <MenuHeader key={i} label={item.label} />
        : <MenuItem key={item.id} icon={item.icon} label={item.label} disabled={item.disabled} current={item.active}
            className={item.cssClasses} onSelect={() => sendCommand('selectItem', { itemId: item.id })} />)}
    </Menu>
  );
};

export default TLMenu;
```

- [ ] **Step 5: Altes CSS, Ratsche** — `tlReactControls.css`: Regeln `.tlMenu*` (2823–2910) löschen; die `.tlViewError*`-Regeln (2797–2821) bleiben unter neuer Überschrift `/* --- TLViewError ----- */`; Überschrift `TLMenu` fällt. `design-system/test/ratchet.json`: `"TLMenu"` streichen, `"TLViewError": <Zahl aus node tools/inventory.mjs>` eintragen, `_blocks`-Vermerk „01.10. Welle 3a: TLMenu gestrichen; TLViewError stand ohne eigene Überschrift im TLMenu-Block“.

- [ ] **Step 6: Bauen, testen, Commit** — `cd com.top_logic.layout.react && npm run build`; Modul-Tests `layout.react` (`control.overlay.*`); Paket `node --test test/ratchet.test.mjs`. `git commit -m "Ticket #29617: Design System wave 3a -- one popover (floating-ui), one menu with roving focus; TLMenu reads it, old block removed"`

### Task E2: Nachzug Select, Textfeld, Hilfeknopf — Popup über `usePopover`, Icon-Knöpfe

**Files:**
- Modify: `react-src/controls/button/ButtonDefaults.tsx` (nur `buttonClassName` um `icon`), `TLDropdownSelect.tsx:57-87` (Chip), `:269-296` (Position), `:549-557` (Popup-Root), `:684-692` (Clear); `TLTextInput.tsx:249-271` (`__action`, `title` in 255); `TLFormField.tsx:143-149` (Hilfeknopf)

- [ ] **Step 1: `buttonClassName`** — Signatur `{ appearance; danger?; small?; icon?; extra? }`; `opts.icon ? 'tl-button--icon' : ''` in der Liste (die `menu-item`-Verzweigung kommt in E5).
- [ ] **Step 2: Select-Popup** — `useEffect` 276–296 und `dropdownStyle` löschen; `const { setFloating, style } = usePopover({ open: isOpen, anchor: containerRef.current });` Root: `className="tl-popover tl-select__popup"`, `ref={(el) => { dropdownRef.current = el; setFloating(el); }}`, `style={{ ...style, width: containerRef.current?.getBoundingClientRect().width }}`; `anchoredOverlayProps` bleibt; Außenklick bleibt bei `useCloseOnOutsidePress` (270).
- [ ] **Step 3: Knöpfe** — Chip-Entfernen (75–83), Leeren (684–692), `TLTextInput` Löschen/Link (249–271): `className={buttonClassName({ appearance: 'ghost', small: true, icon: true })}`, `aria-label` wie heute, Icon `className="tl-button__icon tl-icon-sm"`; das native `title` (255) streichen. Hilfeknopf `TLFormField.tsx:143`: `icon: true` ergänzen.
- [ ] **Step 4: Bauen, Tests, Commit** — `npm run build`; `layout.react` grün; `grep -rn "tl-select__chip-remove\|tl-select__clear\|tl-field-group__action" react-src` leer. `git commit -m "Ticket #29617: Design System wave 3a -- select popup placed by usePopover on tl-popover; remove, clear, field and help actions are icon buttons"`

### Task E3: Nachzug FormGroup — `tl-toggle`

**Files:**
- Modify: `react-src/controls/TLFormGroup.tsx:11-12`, `:69-78`

- [ ] **Step 1** — `const CHEVRON = 'css:fa-solid fa-chevron-right';`; Knopf `className="tl-toggle"`, Inhalt `<ThemeIcon encoded={CHEVRON} className="tl-icon-sm" />`; `aria-expanded`, `aria-controls`, `aria-label`, Tooltip bleiben.
- [ ] **Step 2** — `npm run build`; `grep -rn "tl-form-group__toggle" react-src` leer; Commit `"Ticket #29617: Design System wave 3a -- form group collapses with tl-toggle"`.

### Task E4: Spalten-Kontextmenü der Tabelle über `Menu`

**Files:**
- Modify: `react-src/controls/TLTableView.tsx:397-400`, `:1120-1121`, `:1701-1741`

- [ ] **Step 1** — Zeilen 1701–1741 ersetzen:

```tsx
<Menu open={!!contextMenu} anchor={contextMenu ? { x: contextMenu.x, y: contextMenu.y } : null} onClose={() => setContextMenu(null)}>
  {contextMenu && contextMenu.colIdx + 1 !== frozenColumnCount && !columns[contextMenu.colIdx]?.pinnedEnd && (
    <MenuItem label={i18n['js.table.freezeUpTo']} onSelect={handleFreezeUpTo} />)}
  {contextMenu && frozenColumnCount > 0 && <MenuItem label={i18n['js.table.unfreezeAll']} onSelect={handleUnfreezeAll} />}
  {contextMenu && !columns[contextMenu.colIdx]?.pinnedEnd && (
    <MenuItem label={i18n['js.table.fitColumn']} onSelect={() => { fitColumnToContent(columns[contextMenu.colIdx].name); setContextMenu(null); }} />)}
  {contextMenu && columns[contextMenu.colIdx]?.groupable && columns[contextMenu.colIdx].name !== grouping && (
    <MenuItem label={i18n['js.table.groupBy']} onSelect={() => handleGroupBy(columns[contextMenu.colIdx].name)} />)}
  {contextMenu && grouping !== '' && <MenuItem label={i18n['js.table.ungroup']} onSelect={handleUngroup} />}
</Menu>
```

Import `{ Menu, MenuItem } from './menu/Menu'`; 1120–1121 und `contextMenuRef` (400) löschen; die Handler (1043–1047) rufen weiter `setContextMenu(null)`.

- [ ] **Step 2** — `npm run build`; `layout.react` `control.table.*` grün; `grep -n "tlMenu" react-src/controls/TLTableView.tsx` leer. Commit `"Ticket #29617: Design System wave 3a -- the column context menu is a Menu: placed, clamped, keyboard-reachable like every menu"`.

### Task E5: Button-Kontext und Toolbar

**Files:**
- Modify: `react-src/controls/button/ButtonDefaults.tsx`, `TLButton.tsx:52-152`, `TLToggleButton.tsx`, `TLUploadButton.tsx:68-79`, `TLToolbar.tsx` (MenuGroup 108–251, Root 454–476, `measureUnits` 485–512), `tlReactControls.css` (Block `TLToolbar` 4625–4760, Dropdown 5626–5680, Host 1116–1121 und 2113–2118), `design-system/test/ratchet.json` (`TLToolbar` streichen, Block „Dashboard“ um die Dropdown-Zeilen senken, `foreignTl` −2)

**Interfaces:**
- Produces: `ButtonAppearance` um `'menu-item'`; `ButtonDefaultsValue { appearance?; iconOnly?: boolean }`; `menuItemProps(defaults)` liefert `{ role, tabIndex }` für Einträge.

- [ ] **Step 1: ButtonDefaults**

```ts
export type ButtonAppearance = 'primary' | 'secondary' | 'ghost' | 'link' | 'menu-item';
export interface ButtonDefaultsValue { appearance?: ButtonAppearance; iconOnly?: boolean; }
// merged: useMemo(() => ({ ...parent, ...value }), [parent, value.appearance, value.iconOnly])
export function buttonClassName(opts: { appearance: ButtonAppearance; danger?: boolean; small?: boolean; icon?: boolean; extra?: string }): string {
  if (opts.appearance === 'menu-item') return ['tl-menu__item', 'tl-type-label', opts.extra ?? ''].filter(Boolean).join(' ');
  return ['tl-button', `tl-button--${opts.appearance}`, 'tl-type-label',
    opts.danger && opts.appearance !== 'link' ? 'tl-button--danger' : '',
    opts.small ? 'tl-button--sm' : '', opts.icon ? 'tl-button--icon' : '',
    opts.extra ?? ''].filter(Boolean).join(' ');
}
/** What an entry of a menu carries besides its classes: the role and the roving tabindex. */
export function menuItemProps(defaults: ButtonDefaultsValue, pressed?: boolean): { role?: string; tabIndex?: number } {
  if (defaults.appearance !== 'menu-item') return {};
  return { role: pressed === undefined ? 'menuitem' : 'menuitemcheckbox', tabIndex: -1 };
}
```

- [ ] **Step 2: TLButton** (52–152) — Erscheinung: `const resolvedAppearance = defaults.appearance === 'menu-item' ? 'menu-item' : (appearance ?? serverAppearance ?? defaults.appearance ?? 'secondary');` (Container schlägt den Server, nur für `menu-item`). Modus: `const shows = resolvedMode !== 'label-only' && !!resolvedImage; const mode = defaults.iconOnly && shows ? 'icon-only' : resolvedAppearance === 'menu-item' && resolvedImage ? 'icon-label' : resolvedMode;` — kompakt wird nur ein Knopf, der sein Icon zeigt; im Menü zeigt jeder Knopf sein Label. `const iconOnly = mode === 'icon-only'; const icon = iconOnly && !!resolvedImage; const small = state.size === 'small' && iconOnly;` Klassen `buttonClassName({ appearance: resolvedAppearance, danger: resolvedDanger, small, icon, extra: cssClasses })`; Teile `const part = resolvedAppearance === 'menu-item' ? 'tl-menu' : 'tl-button';` an `__icon`/`__label`; Icon-Größe `showLabel ? 'tl-icon-sm' : 'tl-icon-md'` bleibt (ein Icon-Knopf trägt `md`). Zustand: `const pressed = resolvedActive ? true : state.active === false ? false : undefined;` — am `tl-button` `aria-pressed={resolvedActive ? true : undefined}` wie heute; als Eintrag `{...menuItemProps(defaults, pressed)}` und `aria-checked={resolvedAppearance === 'menu-item' && pressed !== undefined ? pressed : undefined}` statt `aria-pressed`. Tooltip-Logik (120–127) bleibt; bei `iconOnly` trägt sie das Label.
- [ ] **Step 3: `TLToggleButton`, `TLUploadButton`** — beide lesen `useButtonDefaults()`: `iconOnly` wie TLButton (nur wenn ein Icon gezeigt wird) und `{...menuItemProps(defaults)}` am Knopf; `TLUploadButton` 68–79 nutzt `buttonClassName` schon — `icon` ergänzen, wenn kompakt.
- [ ] **Step 4: TLToolbar**
  - Konstanten: `COMPACT_CLASS`, `TRIGGER_SIZE_PROPERTY` löschen; `const CHEVRON_ICON = 'css:fa-solid fa-chevron-down';`.
  - **Zwei Messdurchläufe** statt Klassenwechsel: Zustand `const [measurePhase, setMeasurePhase] = useState<'full' | 'compact' | null>(null);` Beim Wechsel der `groups` (`measuredRef.current !== groups`) → `measurePhase = 'full'`: Render mit `iconOnly={false}`, `useLayoutEffect` liest `full = readUnits()` und setzt `setMeasurePhase('compact')`; Render mit `iconOnly={true}`, Effekt liest `compact = readUnits()`, speichert `metricsRef`, `measuredRef.current = groups`, `setMeasurePhase(null)`; danach wie heute (`settled`). Während beider Phasen `toolbarStyle = { width: 'auto', flexShrink: 0 }` und alle Einheiten inline. `measureUnits` wird zu `readUnits(root, unitCount)` plus `metricsOf(root, full, compact)`:
    ```ts
    function metricsOf(root: HTMLElement, full: number[], compact: number[]): Metrics {
      const rootStyle = getComputedStyle(root);
      const gap = parseFloat(rootStyle.columnGap) || 0;
      const groupElement = root.querySelector('.tl-toolbar__group');
      const itemGap = groupElement ? (parseFloat(getComputedStyle(groupElement).columnGap) || gap) : gap;
      const separatorElement = root.querySelector('.tl-divider--vertical');
      const separator = separatorElement ? separatorElement.getBoundingClientRect().width : 1;
      return { full, compact, gap, itemGap, separator, trigger: tokenPx(rootStyle, '--tl-size-control') };
    }
    function tokenPx(style: CSSStyleDeclaration, name: string): number {
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const v = style.getPropertyValue(name).trim(); const n = parseFloat(v);
      return isNaN(n) ? 2 * rem : v.endsWith('rem') ? n * rem : n;
    }
    ```
    Der Trigger ist erst beim Überlauf gerendert; seine Breite ist das Maß `size-control` (gelesen, nicht geraten).
    Drei Fallen (Plan-Review): (a) der Effekt kehrt bei `!collapsible` oder ohne Gruppen vorher zurück — die Phase dort auf `null` setzen und `iconOnly` nur bei `collapsible` lesen, sonst bleibt `compact` hängen; (b) wechseln die `groups` per SSE während der Phase `compact`, passen `full` und `compact` nicht zusammen — die gemessenen `groups` mitführen und bei Wechsel wieder bei `full` beginnen; (c) der erste Render nach einem Gruppenwechsel (Phase noch `null`) zählt schon als Messung — im Render ableiten: `const phase = measuredRef.current !== groups ? (measurePhase ?? 'full') : null;`.
  - `MenuGroup` (108–251): `menuStyle`, `useLayoutEffect`, eigene Hooks löschen. Trigger `button` mit `className={buttonClassName({ appearance: inheritedAppearance, icon: iconOnly })}`, `aria-haspopup="menu"`, `aria-expanded={open}`, Icon `tl-button__icon tl-icon-md` bzw. Label + `<ThemeIcon encoded={CHEVRON_ICON} className="tl-icon-sm" />`. Dropdown bleibt gemountet:
    ```tsx
    const { setFloating, style } = usePopover({ open, anchor: triggerRef.current, placement: align === 'start' ? 'bottom-start' : 'bottom-end' });
    useCloseOnOutsidePress(open, [menuRef, triggerRef], () => setOpen(false));
    useFocusTrap(open, menuRef, 'first');
    const { onKeyDown } = useRovingMenu(menuRef, open, () => setOpen(false));
    {createPortal(
      <div ref={(el) => { menuRef.current = el; setFloating(el); }} className="tl-popover tl-menu" role="menu"
           hidden={!open} style={open ? style : undefined} onClick={() => setOpen(false)} onKeyDown={onKeyDown} {...anchoredOverlayProps}>
        <ButtonDefaults appearance="menu-item" iconOnly={false}>
          {visibleItems.map((item, i) => <TLChild key={i} control={item} />)}
          {sections.map((items, si) => <React.Fragment key={`sub-${si}`}>
            {(visibleItems.length > 0 || si > 0) && <hr className="tl-divider" />}
            {items.map((item, i) => <TLChild key={i} control={item} />)}
          </React.Fragment>)}
        </ButtonDefaults>
      </div>, document.body)}
    ```
  - Root (454–476): `className={rootClassName(state, 'tl-toolbar')}`, `data-tl-overflow={collapsible ? overflowEnd : undefined}`, `data-tl-compact={compact ? '' : undefined}`; `<ButtonDefaults appearance={appearance} iconOnly={measurePhase === 'compact' || compact}>`; Trenner `<hr className="tl-divider tl-divider--vertical" aria-orientation="vertical" />`; Gruppen `tl-toolbar__group` mit `data-tlunit`.
- [ ] **Step 5: Altes CSS, Ratsche** — Block `TLToolbar` (4625–4760) löschen; Dropdown-Teil 5626–5680 löschen (beginnt mit `button.tlToolbar__menuTrigger[aria-expanded]`, liegt im Block „Dashboard“ → dessen Zahl in `ratchet.json` senken). Host-Regeln:

```css
.tlPanel__header:has(> .tlPanel__toolbar > .tl-toolbar[data-tl-overflow]) > .tlPanel__toolbar {
	/* Übergang bis Welle 4 (Panel): Gewicht, mit dem die Toolbar vor dem Titel nachgibt. */
	flex-shrink: 100000;
	min-width: var(--tl-size-control);
}
.tlAppBar__actions:has(> .tl-toolbar[data-tl-overflow]) {
	/* Übergang bis Welle 4 (AppBar). */
	flex-shrink: 100000;
	min-width: var(--tl-size-control);
}
```

`ratchet.json`: `"TLToolbar"` streichen; `foreignTl` ohne `--tl-toolbar-trigger-size`, `--tl-toolbar-shrink-priority`.

- [ ] **Step 6: Bauen, Tests, Commit** — `npm run build`; `layout.react` (`TestReactToolbarControl`), `layout.view` (`TestAppBarElement`); `node --test test/ratchet.test.mjs`. `git commit -m "Ticket #29617: Design System wave 3a -- toolbar: buttons go compact via ButtonDefaults (two measuring passes), trigger is a tl-button, overflow entries are menu items; --tl-toolbar-* gone"`

### Task E6: TabBar und Breadcrumb

**Files:**
- Modify: `react-src/controls/TLTabBar.tsx`, `TLBreadcrumb.tsx`, `tlReactControls.css` (Block `TLTabBar` 184–308 — **darin 234–290 fremde Regeln**, Block `TLBreadcrumb` 2160–2208, Zeile 2739), `I18NConstants.java`, `messages_de.properties`, `design-system/test/ratchet.json`

- [ ] **Step 1: TabBar**

```tsx
const listRef = React.useRef<HTMLDivElement>(null);
const focusTab = (index: number) => {
  const all = Array.from(listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? []);
  const el = all[(index + all.length) % all.length];
  el?.focus();
  const id = el?.dataset.tabId; if (id) handleTabClick(id);
};
const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
  if (e.key === 'ArrowRight') focusTab(index + 1); else if (e.key === 'ArrowLeft') focusTab(index - 1);
  else if (e.key === 'Home') focusTab(0); else if (e.key === 'End') focusTab(tabs.length - 1); else return;
  e.preventDefault();
};
```

Markup: `div.tl-tabs` (+ `fillClass`), `div.tl-tabs__list[role=tablist]`, je Reiter `button.tl-tabs__tab.tl-type-label[role=tab][id=…-tab-ID][data-tab-id][aria-selected][aria-controls=…-panel][tabIndex 0/-1]` mit `<ThemeIcon … className="tl-icon-sm" />` und `<span>{label}</span>`; `div.tl-tabs__panel[role=tabpanel][id=…-panel][aria-labelledby]` mit `FillBarrier`.

- [ ] **Step 2: Breadcrumb** — `I18NConstants.java` (Block „Client-side i18n keys“): JavaDoc `@en Breadcrumb`, `@CustomKey("js.breadcrumb.label") public static ResKey JS_BREADCRUMB_LABEL;`. `messages_de.properties`: `js.breadcrumb.label = Navigationspfad`. TSX: `I18N_KEYS`, `useI18N`; `nav.tl-breadcrumb[aria-label]`, `ol.tl-breadcrumb__list`, `li.tl-breadcrumb__entry`, Trenner `<span className="tl-breadcrumb__separator" aria-hidden="true"><ThemeIcon encoded={SEPARATOR_ICON} className="tl-icon-sm" /></span>` (`ThemeIcon` kennt kein `aria-hidden` — der Span trägt es), Eintrag `button` mit `buttonClassName({ appearance: 'link' })`, aktuell `span.tl-breadcrumb__current.tl-type-label[aria-current=page]`.

- [ ] **Step 3: Altes CSS, Ratsche** — Block `TLTabBar`: 184–233 und 291–308 löschen; **234–290 bleiben** (Abstandsmodell, `:root { --page-inset }`, `.tlInset`) unter neuer Überschrift `/* --- TLInset ----- */` mit Eintrag in `ratchet.json` (Zahl aus `inventory.mjs`); `_blocks`-Vermerk. Block `TLBreadcrumb` (2160–2208) löschen. Zeile 2739 `.tlAppShell .tlBreadcrumb` → `.tlAppShell .tl-breadcrumb` (Übergangsregel, liest die Paketklasse; Kommentar „Übergang bis Welle 4 (Shell)“). `ratchet.json`: `TLTabBar`, `TLBreadcrumb` streichen.

- [ ] **Step 4: messages_en** — `design-system/tools/check-messages-en.sh` → Diff committen.
- [ ] **Step 5: Bauen, Tests, Commit** — `npm run build`; `layout.react` (`TestTabBarRouteVeto`), `layout.view`; `git commit -m "Ticket #29617: Design System wave 3a -- tabs with roving focus and arrow keys, breadcrumb with link buttons and a localized label"`

### Task E7: Menü-Auslöser — Anker-Element, `aria-expanded`, Tastatur

**Files:**
- Modify: `react-src/controls/TLMenuRegion.tsx`; `MenuRegionControl.java:56-100`; `ContextMenuOpener.java` (53–70 Interface, 114–150 `open`, ~190 `handleClose`, `handleSelect`); `ViewServlet.java:399-414`; `tlReactControls.css:2911-2938` und `2152-2158`
- Test: `TestContextMenuOpener.java` (`RecordingRenderer` 205: zweite `show`; neuer Fall)

- [ ] **Step 1: Java** — `MenuRenderer`: `default void show(String anchorId, List<MenuEntry> items, Function<String, HandlerResult> selectHandler, Runnable closeHandler) { throw new UnsupportedOperationException("anchored menus"); }` (JavaDoc: „Show a menu at the element with the given ID.“) — `default`, damit andere Implementierungen nicht brechen; `ViewServlet` und `RecordingRenderer` überschreiben sie. `ContextMenuOpener`: `public boolean open(String anchorId, List<Targeted> contributions, Runnable closed)` und `public boolean open(int x, int y, List<Targeted> contributions, Runnable closed)`; gemeinsame private `assemble(List<Targeted>)`; `open(int, int, List)` delegiert mit `closed = null` (Aufrufer: `MenuRegionControl:112`, `DesignerTreeElement:280/303`, Tests). In `handleClose()` **und** `handleSelect()` (nach `hide()`, Zeile ~194) wird `_closed` einmal gerufen und genullt — `aria-expanded` fällt auch nach einer Auswahl. Übernimmt eine andere Region das Menü, wird das alte `_closed` **unmittelbar vor `_renderer.show(...)`** gerufen, nicht schon am Anfang von `open` — liefert das neue Öffnen nichts Sichtbares (`if (!anything) return;`), bleibt das alte Menü stehen und sein Auslöser bleibt `aria-expanded`. `ViewServlet`: zweite `show`: `menu.updateItems(items); menu.setSelectHandler(selectHandler); menu.setCloseHandler(closeHandler); menu.setAnchorId(anchorId); menu.open();`. `MenuRegionControl`: `ARG_ANCHOR = "anchorId"`, `MENU_OPEN = "menuOpen"`; `handleOpen` liest `anchorId` (optional) und ruft die passende `open`-Variante mit `() -> putState(MENU_OPEN, false)`; liefert sie `true`, `putState(MENU_OPEN, true)`. JavaDoc an allen neuen Methoden (englisch).
- [ ] **Step 2: Test** — `TestContextMenuOpener`: `RecordingRenderer` merkt `anchorId` und `closeHandler`; neuer Fall: `opener.open("anchor-1", contributions, closed)` → `renderer.anchorId == "anchor-1"`; `renderer.closeHandler.run()` → `closed` einmal gerufen; zweiter Fall: Auswahl über `renderer.selectHandler.apply(id)` → `closed` einmal gerufen. Rot sehen, Step 1 fertigstellen, grün: `mvn -o -q test -pl com.top_logic.layout.view -Dtest=TestContextMenuOpener`.
- [ ] **Step 3: TSX** — zwei Refs (`buttonRef: useRef<HTMLButtonElement>(null)`, `regionRef: useRef<HTMLDivElement>(null)` — tsc TS2352 sonst). Klick-Variante ist ein nativer `button` **ohne** eigenen Enter/Space-Handler (nativ `click`):

```tsx
const menuOpen = state.menuOpen === true;
const defaults = useButtonDefaults();
const openAtRegion = useCallback(() => sendCommand('openMenu', { anchorId: controlId }), [sendCommand, controlId]);
const openAtTarget = useCallback((target: Element) => {
  const r = target.getBoundingClientRect();
  sendCommand('openMenu', { x: Math.round(r.left), y: Math.round(r.bottom) });
}, [sendCommand]);
const handleClick = useCallback((e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); if (pressClosedSurface()) return; openAtRegion(); }, [openAtRegion]);
const handleContextKey = useCallback((e: React.KeyboardEvent) => {
  if (e.key === 'ContextMenu' || (e.key === 'F10' && e.shiftKey)) { e.preventDefault(); e.stopPropagation(); openAtTarget(e.target as Element); }
}, [openAtTarget]);
return isClick
  ? <button type="button" id={controlId} ref={buttonRef} data-tl-trigger="click"
      className={rootClassName(state, 'tl-menu-region', buttonClassName({ appearance: defaults.appearance ?? 'ghost' }))}
      aria-haspopup="menu" aria-expanded={menuOpen} onClick={handleClick}>
      {!!child && <TLChild control={child} />}
    </button>
  : <div id={controlId} ref={regionRef} data-tl-trigger="contextmenu" className={rootClassName(state, 'tl-menu-region')}
      onContextMenu={handleContextMenu} onKeyDown={handleContextKey}>
      {!!child && <TLChild control={child} />}
    </div>;
```

- [ ] **Step 4: Altes CSS, Ratsche** — Block `TLMenuRegion` (2911–2938) löschen; **2152–2158** (`.tlAppBar--primary .tlMenuRegion--click…`) löschen — der Auslöser ist ein `tl-button`, die AppBar-Primary-Regeln für `tl-button` greifen. `ratchet.json`: `TLMenuRegion` streichen; Block „TLAppBar“ sinkt (Zahl senken).
- [ ] **Step 5: Gates, Commit** — `npm run build`; `check-messages-en.sh` (zwei Module) → Diff committen; `layout.view` grün. `git commit -m "Ticket #29617: Design System wave 3a -- menu region anchors the menu to its element, reports aria-expanded, opens by keyboard"`

### Task E8: Benutzermenü ohne eigenen Block

**Files:**
- Modify: `user-menu.view.xml:60-65`, `tlReactControls.css:2940-2955`, `design-system/test/ratchet.json`, `docs/migration/altlast.md`

- [ ] **Step 1** — `<text css-class="tl-button__label" input="currentUser" overflow="ellipsis"/>`; Avatar davor bleibt. Hinweis Reviewer: `<menu>` mit zwei Kindern rendert ein `ReactStackControl` (ein `div` im `button`); die Ellipse wirkt trotzdem (`tl-button__label` mit `min-width: 0` im Flex-Stack — prüfen, ob der Stack `display: flex` ist; sonst `tl-button__label` an den Stack hängen, nicht an den Text).
- [ ] **Step 2** — Block `User menu` (2940–2955) löschen, Ratsche streichen. Die `@media (max-width: 640px)`-Regel fällt ersatzlos: das Benutzermenü liegt im `trailing` der AppBar, nicht in einer Toolbar — „bei Platzmangel nur der Avatar“ (Spec §7) ist eine AppBar-Regel für Welle 4. Eintrag in `altlast.md` „Offen für spätere Wellen“: „AppBar-Breakpoint für den Benutzernamen (war 640 px; Welle 4)“. Spec §7 fortschreiben (Fable, mit dem Commit).
- [ ] **Step 3** — `layout.view`-Tests; Commit `"Ticket #29617: Design System wave 3a -- user menu trigger is a ghost button; no own stylesheet block"`.

### Task E9: Gates, Tooltip-Ebene, Sichtprüfung, PR

**Files:**
- Modify: `tlReactControls.css:5507`, `design-system/test/engine-classes.test.mjs:12` (Regex **jetzt** erweitern), `docs/migration/altlast.md`, `STATUS.md`

- [ ] **Step 1: Tooltip-Ebene** — 5507 `z-index: var(--tl-layer-popover);`.
- [ ] **Step 2: Engine-Gate** — `ALT`-Regex um `|tlMenu|tlMenuRegion|tlUserMenu|tlToolbar|tlReactTabBar|tlBreadcrumb` erweitern; `cd design-system && node --test && node tools/lint-css.mjs` → `engine-classes` grün, `ratchet` grün (sechs Blöcke weg, zwei Überschriften neu, `foreignTl` −2, kein Block gewachsen).
- [ ] **Step 3: Engine-Gates** — `npm run build`; `layout.react`, `layout.view`, `demo.react`; `check-messages-en.sh` ohne Diff; `git grep -n "tlMenu\|tlMenuRegion\|tlUserMenu\|tlToolbar\|tlReactTabBar\|tlBreadcrumb" -- '*.tsx' '*.ts' '*.css' '*.xml'` leer; in `docs/plans/*.md` des Worktrees die Namen als „alt (bis Welle 3a)“ markieren.
- [ ] **Step 4: Doku** — `altlast.md`: Abschnitt „Welle 3a · Navigation und Popups — gebaut <Datum>“ (gestrichene Blöcke, „Neu im Paket“, Tabelle alt → neu, Offen: AppBar-Breakpoint, Tab-Overflow); `STATUS.md`; `docs/skalen.md` „Entschieden beim Bauen“ nur bei neuen Entscheidungen.
- [ ] **Step 5: Push und PR** — `git fetch`; Push durch Hendrik; PR gegen `welle_2` (ist !1740 gemergt: gegen `master`, vorher `git merge origin/master`), Bernhard Reviewer, Trac #29617 CC; Beschreibung englisch: Ziel, Konsolidierung (W1–W5, W9, W12, N8, Link `altlast.md`), Migrationsliste, Sichtprüfungsliste.
- [ ] **Step 6: Sichtprüfung** (Docker, hell/dunkel, beide Dichten): Menü am Fensterrand klappt um, folgt dem Scrollen, einmal am Punkt und danach am Element geöffnet; Kontextmenü per `Shift+F10`; Spaltenmenü im Fenster; Toolbar kompakt und Überlauf (Einträge live, Upload-Knopf richtig gemessen); Reiter per Pfeilen; Benutzermenü-Knopf mit `aria-expanded`, fällt nach Auswahl; Select-Popup folgt dem Scrollen; Hilfe-, Entfernen-, Leeren-Knopf 24 px; FormGroup-Toggle dreht. Befunde als Fix-Commits.

---

## Self-Review (nach dem Plan-Review)

**Spec coverage:** §3 → P4, E1, E4, E5; §4 → P5, E5; §5 → P7 (fortgeschrieben: Drop-Ziel), menu/tabs, E1/E6; §6 → P2, P3, P6, E2, E3; §7 → P5, E6, E7, E8 (fortgeschrieben: Breakpoint Welle 4); §8 → P1, E9; §9 → P2, P4, P7, E9; §10 → P1–P7, E1–E9; §11 → E8, E9.

**Gate-Brüche aus dem Review:** 1–3 → P1; 4 → P2/P3; 5–7 → P4, P6; 8 → P5; 9–11 → P6; 12–13 → P7/E9; 14 → E6; 15 → E7; 16 → E6 (2739), E7 (2152–2158), E5 (5626).

**Type consistency:** `usePopover({ open, anchor, placement })` ohne `onClose` in E1, E2, E5; `buttonClassName({ icon })` ab E2, `menu-item` ab E5; `useRovingMenu` in E1 definiert, E5 liest; `menuItemProps` in E5 für TLButton, TLToggleButton, TLUploadButton.
