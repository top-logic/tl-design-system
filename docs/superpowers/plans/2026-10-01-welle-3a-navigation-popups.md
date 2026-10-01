# Welle 3a — Navigation und Popups: Implementierungsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sechs alte Blöcke (`TLMenu`, `TLMenuRegion`, `User menu`, `TLToolbar` samt Dropdown, `TLTabBar`, `TLBreadcrumb`) aus `tlReactControls.css` abschneiden und durch Paket-Komponenten ersetzen, die **ein** Popup, **ein** Menü, **einen** Fokusring und **einen** Icon-Knopf kennen — mit den Nachzügen aus Welle 2 (Select-Popup, FormGroup-Toggle, drei Icon-Knopf-Blöcke).

**Architecture:** Paket (`design-system/`): neue Komponentendateien `popover.css`, `menu.css`, `toggle.css`, `toolbar.css`, `tabs.css`, `breadcrumb.css`, Modifier `tl-button--icon`, drei neue Tokens, Verträge, Specimen, Gates. Engine (`_Working-Tree/tl8-wt-29584`, Branch `CWS/CWS_29617_design_system_welle_3a` von `welle_2`): ein Hook `bridge/popover.ts` auf `@floating-ui/react`, eine darstellende Komponente `controls/menu/Menu.tsx` mit Roving-Fokus, die `TLMenu`, das Spalten-Kontextmenü und der Toolbar-Overflow teilen; `ButtonDefaults` lernt `iconOnly` und `appearance: 'menu-item'`; Java liefert dem Menü ein Element als Anker und der Region den Offen-Zustand.

**Tech Stack:** Node (ohne Abhängigkeiten) im Paket; React 19, TypeScript, Vite, `@floating-ui/react ^0.27` in der Engine; Java 21/Maven für `I18NConstants` und `MenuRegionControl`.

**Spec:** `docs/superpowers/specs/2026-10-01-welle-3a-navigation-popups-design.md` — Prognosen in `docs/migration/altlast.md` „Konsolidierung (01.10.)“.

## Global Constraints

- Alles Öffentliche: Englisch, kebab-case, Präfix `tl` (`--tl-…`, `.tl-…`, `data-tl-…`); Zustände sind Attribute, nie Klassen (CLAUDE.md „Namen“).
- `src/tokens.json` trägt nur Referenzen `{name}`; Werte stehen in `src/primitives.json`.
- Nach jeder Änderung an `src/`: `node tools/generate.mjs`; `node --test` und `node tools/lint-css.mjs` sind das Gate (heute 245 Tests, Lint grün).
- Kein Literal in Komponenten-CSS (Farbe, Maß, Dauer), kein `:focus` ohne `-visible`, kein `outline: none`, kein `!important` außerhalb des Reduced-Motion-Blocks, kein `cursor: not-allowed`.
- Außerhalb von `dist/` wird nichts im Namensraum `--tl` definiert; `dist/` wird nur über `node tools/publish-to-worktree.mjs` in den Worktree kopiert.
- Engine: `messages_en.properties` nie von Hand; JavaDoc schreiben, `tools/check-messages-en.sh` laufen lassen, Diff committen, Deutsch in `messages_de.properties` nachziehen. Vor jedem Push `git fetch` (Bernhard committet auf unsere Branches); Push macht Hendrik.
- Commits mit Präfix `Ticket #29617:`; Trailer `Co-Authored-By: <Modell, das den Task gebaut hat>`.
- Keine Zeit- oder Aufwandsangaben in Docs oder Kommentaren.

## Review Focus

Was die Spec impliziert, aber kein Test im Paket allein beweist — je Zeile der Test, der es im Task festhält:

1. **Menü am unteren Fensterrand klappt nach oben** und bleibt nach dem Scrollen am Anker (`autoUpdate`) — Task E1: Specimen-Hinweis und Sichtprüfung (Task E9); im Paket nicht prüfbar.
2. **Ein deaktivierter Menüeintrag wird übersprungen**, der Fokus landet nie darauf — Task E1: `Menu.tsx` sucht `[role="menuitem"]:not([disabled])`; Sichtprüfung.
3. **Overflow-Einträge bleiben live** (bleiben gemountet, nur `hidden`), sonst zeigen sie veraltete Ausführbarkeit — Task E3: der Portal-Inhalt bleibt gemountet; `layout.react` grün.
4. **Kompakte Toolbar misst richtig**: Einheit mit Icon = `size-control`, Einheit ohne Icon = volle Breite — Task E3: `compactWidths` liest `.tl-button__icon` je Einheit.
5. **Tab-Pfeiltasten wählen den Reiter** und setzen den Fokus; `Home`/`End` springen — Task E6: `TLTabBar` Roving; Sichtprüfung.

---

## Dateistruktur

**Paket `design-system/`** (neu, sofern nicht „ändern“):

| Datei | Verantwortung |
|---|---|
| `src/primitives.json` (ändern) | `gray-64`, `gray-60`, `view-1` |
| `src/tokens.json` (ändern) | dunkle Interaktionsstufen, `size-popover-min`, `size-popover-max` |
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
| `test/focus.test.mjs`, `test/square.test.mjs`, `test/popover.test.mjs` | neue Gates |
| `test/engine-classes.test.mjs`, `test/ratchet.json` (ändern) | Engine-Gate, Ratsche |

**Engine `com.top_logic.layout.react/`** (Branch `CWS/CWS_29617_design_system_welle_3a`):

| Datei | Verantwortung |
|---|---|
| `react-src/bridge/popover.ts` (neu) | `usePopover` auf floating-ui |
| `react-src/controls/menu/Menu.tsx` (neu) | darstellendes Menü mit Roving-Fokus |
| `react-src/controls/TLMenu.tsx` (ändern) | Server-Menü über `Menu` |
| `react-src/controls/TLTableView.tsx` (ändern, nur 1701–1741 und 397–400) | Spaltenmenü über `Menu` |
| `react-src/controls/button/ButtonDefaults.tsx`, `TLButton.tsx` (ändern) | `iconOnly`, `menu-item`, `--icon` |
| `react-src/controls/TLToolbar.tsx` (ändern) | Klassen, Trigger, Kompakt über Kontext, Overflow über `Menu` |
| `react-src/controls/TLDropdownSelect.tsx`, `TLTextInput.tsx`, `TLFormGroup.tsx` (ändern) | Nachzüge |
| `react-src/controls/TLTabBar.tsx`, `TLBreadcrumb.tsx`, `TLMenuRegion.tsx` (ändern) | Leisten |
| `src/main/java/com/top_logic/layout/react/I18NConstants.java` (ändern) | `js.breadcrumb.label` |
| `src/main/java/com/top_logic/layout/react/control/overlay/ContextMenuOpener.java` (ändern) | Anker-Element, Offen-Zustand |
| `com.top_logic.layout.view/.../command/MenuRegionControl.java`, `ViewServlet.java` (ändern) | `anchorId`, `menuOpen` |
| `com.top_logic.layout.view/.../views/user-menu.view.xml` (ändern) | Benutzermenü ohne eigene Klasse |
| `src/main/webapp/style/tlReactControls.css` (ändern) | sechs Blöcke löschen, Host-Literale, Tooltip-Ebene |

---

## Teil P — Paket

### Task P1: Tokens — Zeigen auf allen Gründen, zwei Popover-Maße

**Files:**
- Modify: `design-system/src/primitives.json:15-16` (Grau), `:30-38` (measure)
- Modify: `design-system/src/tokens.json:35-36` (dunkel), `:93-110` (measure)
- Test: `design-system/test/tokens.test.mjs` (ergänzen)

**Interfaces:**
- Produces: Tokens `--tl-size-popover-min`, `--tl-size-popover-max`; dunkle `surface-interactive-hover/-selected/-active` auf `gray-67/-64/-60`.

- [ ] **Step 1: Test schreiben** — in `test/tokens.test.mjs` anhängen:

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

(`R`, `T`, `ratio` sind in der Datei schon importiert — prüfen, sonst wie in `components.test.mjs` importieren.)

- [ ] **Step 2: Rot sehen** — `cd design-system && node --test test/tokens.test.mjs` → FAIL (`gray-73` auf Overlay 1,13 ist dunkler, `size-popover-min` fehlt).

- [ ] **Step 3: Primitive und Tokens ändern**

`src/primitives.json` Zeile 15–16, zwischen `gray-55` und `gray-66` einfügen (Farbton der Rampe, aus `oklchZuHex` wie in skalen.md gerechnet):

```json
"gray-60": "#44484C", "gray-64": "#393E42",
```

`src/primitives.json` measure, nach `"size-11": "10rem",`:

```json
"view-1": "70vh",
```

`src/tokens.json` dunkel (Zeile 35–36):

```json
"surface-interactive-hover": "{gray-67}", "surface-interactive-selected": "{gray-64}",
"surface-interactive-active": "{gray-60}", "surface-disabled": "{gray-69}",
```

`src/tokens.json` measure, nach `"size-field-label-max": "{size-11}",`:

```json
"size-popover-min": "{size-11}", "size-popover-max": "{view-1}",
```

- [ ] **Step 4: Erzeugen, Gates** — `node tools/generate.mjs && node --test && node tools/lint-css.mjs`. Erwartung: grün; `derive.test.mjs` grün (Probe-Theme rechnet die neuen Stufen über `grauRampe`). Scheitert ein Kontrastpaar in `pairs.test.mjs`, die Messwerte in `docs/skalen.md` „Zeigen auf allen Gründen“ nachlesen — sie halten.

- [ ] **Step 5: Commit**

```bash
git add design-system/src design-system/dist design-system/test/tokens.test.mjs
git commit -m "Ticket #29617: Welle 3a -- Zeigen auf allen Gruenden (gray-67/64/60 dunkel), size-popover-min/max"
```

### Task P2: `tl-button--icon` — der quadratische Icon-Knopf

**Files:**
- Modify: `design-system/src/components/button/button.css:120-125` (nach `--sm`)
- Modify: `design-system/tools/lint-css.mjs:76` (`'tl-button'`-Modifier)
- Modify: `design-system/src/components/button/button.contract.md`
- Test: `design-system/test/square.test.mjs` (neu)

**Interfaces:**
- Produces: Klasse `tl-button--icon` (quadratisch `size-control`; mit `--sm` `size-control-sm`), Leser: Toolbar-Trigger, Hilfeknopf, Select-Clear/Chip-Remove, Feld-Aktion (Tasks E3, E4), 3b.

- [ ] **Step 1: Test schreiben** — `test/square.test.mjs`:

```js
// Ein Icon-Knopf und ein Toggle sind quadratisch: Breite und Höhe lesen dasselbe Maß. Trefferfläche
// mindestens size-control-sm (24 px, WCAG 2.5.8).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readGenerated, declarationsOf } from './lib/component.mjs';

const SQUARE = [
  ['button', 'button.css', '.tl-button--icon', 'size-control'],
  ['button', 'button.css', '.tl-button--icon.tl-button--sm', 'size-control-sm'],
  ['toggle', 'toggle.css', '.tl-toggle', 'size-control-sm'],
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

- [ ] **Step 2: Rot sehen** — `node --test test/square.test.mjs` → FAIL (Selektor fehlt; `toggle.css` fehlt — der Toggle-Fall bleibt rot bis Task P3).

- [ ] **Step 3: CSS und Lint** — `button.css` nach dem `--sm`-Block:

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

`tools/lint-css.mjs` Zeile 76: `'tl-button': new Set(['primary', 'secondary', 'ghost', 'link', 'danger', 'sm', 'icon']),`

`button.contract.md`: Zeile in der Attribut-Tabelle `| `tl-button--icon` | quadratisch, ohne `__label`; Pflicht `aria-label` und Tooltip; mit `--sm` 24 px |` und unter „Konformität“: „Ein Icon-Knopf ohne `aria-label` fällt durch.“ Dazu im Vertrag der Satz: „`appearance="menu-item"` (Container `ButtonDefaults`): der Knopf rendert als `button.tl-menu__item` — siehe `menu.contract.md`.“

- [ ] **Step 4: Gates** — `node tools/generate.mjs && node --test test/square.test.mjs test/lint-css.test.mjs && node tools/lint-css.mjs` → Button-Fälle grün, Toggle-Fall rot (erwartet bis P3).

- [ ] **Step 5: Commit** — `git commit -m "Ticket #29617: Welle 3a -- tl-button--icon, quadratisch aus size-control"`

### Task P3: `tl-toggle` — Auf-/Zuklappen

**Files:**
- Create: `design-system/src/components/toggle/toggle.css`, `toggle.contract.md`, `toggle.spec.html`
- Modify: `design-system/tools/lint-css.mjs` (`'tl-toggle': new Set([])`), `specimen/index.html` (Link)

**Interfaces:**
- Produces: `button.tl-toggle[aria-expanded]` mit einem Kind `.tl-icon-sm` (Chevron rechts). Leser: `TLFormGroup` (E5), Baum und Baum-Tabelle (3b).

- [ ] **Step 1: Test** — `test/square.test.mjs` deckt die Quadratur (P2). Zusätzlich in `test/components.test.mjs` anhängen:

```js
test('Toggle: offen dreht das Icon, Reduced Motion gilt über base.css', () => {
  const css = readGenerated('toggle', 'toggle.css');
  assert.match(css, /\.tl-toggle\[aria-expanded="true"\] > \.tl-icon-sm\s*\{[^}]*rotate:\s*90deg/);
  assert.match(css, /transition:\s*rotate var\(--tl-duration-fast\) var\(--tl-easing-standard\)/);
});
```

- [ ] **Step 2: Rot sehen** — `node --test test/components.test.mjs test/square.test.mjs` → FAIL.

- [ ] **Step 3: CSS**

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

Prüfen: existiert `--tl-icon-primary`/`--tl-icon-disabled` in `tokens.json`? (`grep '"icon-primary"' src/tokens.json`). Falls nicht, `--tl-text-primary`/`--tl-text-disabled` lesen.

- [ ] **Step 4: Vertrag** — `toggle.contract.md` nach dem Muster von `divider.contract.md`: Zustand (`expanded: boolean`, `disabled`), Aktionen (`toggle`), Tastatur (Enter/Space nativ), Tokens (Tabelle), Attribute (`tl-toggle`, `aria-expanded`, `aria-controls`, `aria-label` + Tooltip Pflicht; Kind `tl-icon-sm` mit dem Chevron-rechts-Glyph der Theme-Konfiguration), Konformität. Satz „Zwei Wörter, zwei Richtungen“ aus Spec §6.

- [ ] **Step 5: Specimen** — `toggle.spec.html` nach `divider.spec.html`: Zeilen „zu“, „offen“, „deaktiviert“, je auf layer/base/overlay; Glyph `bi bi-chevron-right`. In `specimen/index.html` nach dem Divider-Link: `<a class="tl-type-label" href="/src/components/toggle/toggle.spec.html">Toggle →</a>`.

- [ ] **Step 6: Gates** — `node tools/generate.mjs && node --test && node tools/lint-css.mjs` → grün (auch `square.test.mjs` komplett).

- [ ] **Step 7: Commit** — `git commit -m "Ticket #29617: Welle 3a -- tl-toggle: ein Knopf, ein Chevron, 24 px"`

### Task P4: `tl-popover` und `tl-menu`

**Files:**
- Create: `src/components/popover/popover.css`, `popover.contract.md`; `src/components/menu/menu.css`, `menu.contract.md`, `menu.spec.html`
- Modify: `tools/lint-css.mjs` (Blöcke `tl-popover`, `tl-menu`, `tl-menu-region`), `specimen/index.html`
- Test: `test/popover.test.mjs` (neu)

**Interfaces:**
- Produces: `.tl-popover` (Fläche, Ebene, Maße), `.tl-menu` (= Popover + Liste), `.tl-menu__item`, `.tl-menu__icon`, `.tl-menu__label`, `.tl-menu__header`, `.tl-menu > .tl-divider`, `.tl-menu-region`. Leser: Tasks E1–E3, E4 (Select-Popup), E7.

- [ ] **Step 1: Test** — `test/popover.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readGenerated, declarationsOf, componentCssFiles } from './lib/component.mjs';

test('tl-popover: Overlay-Fläche, Schatten, Ebene popover, Maße aus den Tokens', () => {
  const d = declarationsOf(readGenerated('popover', 'popover.css'), '.tl-popover');
  for (const t of ['surface-overlay', 'border-separator', 'radius-md', 'shadow-popover', 'layer-popover',
    'size-popover-min', 'size-popover-max']) assert.match(d, new RegExp(`var\\(--tl-${t}\\)`));
});

test('nur tl-popover setzt die Popup-Fläche: kein anderer Block liest shadow-popover', () => {
  const hits = [];
  for (const [name, css] of componentCssFiles()) {
    if (name.startsWith('popover/')) continue;
    if (/--tl-shadow-popover/.test(css)) hits.push(name);
  }
  assert.deepEqual(hits, []);
});

test('tl-menu__item: Zeilenhöhe size-row, Zustand nur als Attribut', () => {
  const css = readGenerated('menu', 'menu.css');
  assert.match(declarationsOf(css, '.tl-menu__item'), /min-height:\s*var\(--tl-size-row\)/);
  assert.doesNotMatch(css, /--(focused|active|disabled)\b/);
  assert.match(css, /\.tl-menu__item\[aria-current="true"\]/);
});
```

- [ ] **Step 2: Rot sehen** — `node --test test/popover.test.mjs` → FAIL (zweiter Fall rot wegen `select.css:134`, bis Task P6).

- [ ] **Step 3: popover.css**

```css
/* Popover — docs/skalen.md „Scrim und Ebenen“, „Gleiches wird zusammengelegt“ (W1).
   Die eine Fläche für alles, was über der Oberfläche schwebt und einen Anker hat: Menü, Select-Popup,
   Toolbar-Überlauf. Die Lage setzt bridge/popover.ts (floating-ui) inline; hier stehen Fläche, Ebene
   und Grenzen. Mindestbreite und Höhe sind Maße, keine Literale. */

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
   (in Kraft), disabled. Zeigen ist surface-interactive-hover — seit „Zeigen auf allen Gründen“ auch
   dunkel auf dem Overlay sichtbar. */

.tl-menu {
  display: flex;
  flex-direction: column;
}

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

/* In Kraft: der Eintrag, dessen Befehl gerade gilt (das aktive Theme). Gewicht der Typo-Stufe label. */
.tl-menu__item[aria-current="true"] {
  font-weight: var(--tl-font-weight-strong);
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

/* Eine Kontextmenü-Region ist reine Durchreiche: keine eigene Box. */
.tl-menu-region {
  display: contents;
}

/* Ein Klick-Auslöser ist ein Knopf: er trägt tl-button tl-button--ghost (Vertrag), hier steht nur,
   was ihn vom Knopf unterscheidet — nichts. Die Klasse markiert ihn für Tests und den Hook. */
.tl-menu-region[role="button"] {
  display: inline-flex;
}
```

Prüfen: gibt es `--tl-font-weight-strong`? (`grep font-weight src/tokens.json`). Wenn die Typo-Stufen das Gewicht nur in `.tl-type-*` tragen, stattdessen `.tl-menu__item[aria-current="true"] > .tl-menu__label { font-weight: 600; }` — **nein**, Literal: dann die Klasse `tl-type-label-strong` prüfen (`grep "label-strong" dist/base.css`); existiert sie, setzt das TSX sie am Eintrag und die CSS-Regel entfällt. Ergebnis im Vertrag festhalten.

- [ ] **Step 5: Lint** — in `MODIFIERS`: `'tl-popover': new Set([]), 'tl-menu': new Set([]), 'tl-menu-region': new Set([]),`.

- [ ] **Step 6: Verträge** — `popover.contract.md` (Zustand `open`, Anker; Verhalten: Escape, Außenklick, Fokus zurück; Tokens; Attribute `tl-popover`, `data-tl-anchored-overlay` bei Portal in modaler Fläche; Konformität). `menu.contract.md`: Zustand (`items`, `open`, `anchorId`/`anchorX`/`anchorY`), Aktionen (`selectItem`, `close`), **Tastatur** (Pfeile zyklisch, Home/End, Enter/Space, Escape; Fokus wandert mit, deaktivierte Einträge werden übersprungen), Tokens, Attribute (`tl-menu` am `role=menu`; `tl-menu__item` am `role=menuitem` mit `aria-current`/`disabled`; `tl-menu__header` `role=presentation`; `tl-divider`; `tl-menu-region` mit `role=button`, `aria-haspopup="menu"`, `aria-expanded`; Kontextmenü per `Shift+F10`), Konformität. Satz: „Ein `TLButton` mit `appearance="menu-item"` ist ein Eintrag.“

- [ ] **Step 7: Specimen** — `menu.spec.html`: ein statisch geöffnetes `div.tl-popover.tl-menu[role=menu]` mit Header, drei Einträgen (einer `aria-current`, einer `disabled`), `hr.tl-divider`, einem mit Icon; daneben ein Auslöser `button.tl-menu-region.tl-button.tl-button--ghost[aria-haspopup=menu][aria-expanded=true]`; auf layer/base/overlay; Link im Index.

- [ ] **Step 8: Gates** — `node tools/generate.mjs && node --test && node tools/lint-css.mjs` → alles grün außer `popover.test.mjs` Fall 2 (Select, P6).

- [ ] **Step 9: Commit** — `git commit -m "Ticket #29617: Welle 3a -- tl-popover und tl-menu: eine Flaeche, ein Eintrag, echter Fokus"`

### Task P5: `tl-toolbar`, `tl-tabs`, `tl-breadcrumb`

**Files:**
- Create: `src/components/toolbar/{toolbar.css,toolbar.contract.md,toolbar.spec.html}`, `src/components/tabs/{tabs.css,tabs.contract.md,tabs.spec.html}`, `src/components/breadcrumb/{breadcrumb.css,breadcrumb.contract.md,breadcrumb.spec.html}`
- Modify: `tools/lint-css.mjs`, `specimen/index.html`

**Interfaces:**
- Produces: `.tl-toolbar[data-tl-overflow][data-tl-compact]`, `.tl-toolbar__group`; `.tl-tabs`, `.tl-tabs__list`, `.tl-tabs__tab[aria-selected]`, `.tl-tabs__panel`; `.tl-breadcrumb`, `__list`, `__entry`, `__separator`, `__current`. Leser: E3, E6.

- [ ] **Step 1: Test** — in `test/components.test.mjs` anhängen:

```js
test('Toolbar, Tabs, Breadcrumb lesen nur Tokens und kennen keine Zustandsklasse', () => {
  for (const [dir, file] of [['toolbar', 'toolbar.css'], ['tabs', 'tabs.css'], ['breadcrumb', 'breadcrumb.css']]) {
    const css = readGenerated(dir, file);
    assert.doesNotMatch(css, /--(active|compact|collapsible)\b/, `${file}: Zustand als Klasse`);
  }
  const tabs = readGenerated('tabs', 'tabs.css');
  assert.match(declarationsOf(tabs, '.tl-tabs__tab[aria-selected="true"]'), /border-color:\s*var\(--tl-border-interactive\)/);
  assert.doesNotMatch(declarationsOf(tabs, '.tl-tabs__tab[aria-selected="true"]'), /font-weight/);
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
   unten und text-primary, kein Fettdruck — nichts springt beim Wechsel. Den Fokusring liefert base.css. */

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
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
}
```

- [ ] **Step 5: breadcrumb.css**

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

(`--tl-icon-secondary` prüfen wie in P3; sonst `--tl-text-secondary`.)

- [ ] **Step 6: Lint** — `'tl-toolbar': new Set([]), 'tl-tabs': new Set([]), 'tl-breadcrumb': new Set([]),`.

- [ ] **Step 7: Verträge und Specimen** — drei Verträge nach dem Muster von P4 (Zustand aus `TabBarStateJson`/Toolbar-State/Breadcrumb-Items, Aktionen `selectTab`/`navigate`, Tastatur: Tabs Pfeile links/rechts + Home/End wählen und fokussieren; Toolbar: Tab-Reihenfolge der Knöpfe, Overflow-Menü wie `menu.contract.md`; Breadcrumb: native Knöpfe), Tokens, Attribute, Konformität. Specimen: Toolbar in drei Erscheinungen (ghost/secondary/primary-Container) mit `tl-divider--vertical`, eine mit `data-tl-compact` (Knöpfe als `tl-button--icon`), eine mit Overflow-Trigger (`tl-button--icon` + Glyph `bi bi-three-dots`); Tabs mit drei Reitern (einer `aria-selected`), Breadcrumb mit drei Stufen. Links im Index.

- [ ] **Step 8: Gates** — `node tools/generate.mjs && node --test && node tools/lint-css.mjs` → grün (Ausnahme weiter `popover.test.mjs` Fall 2).

- [ ] **Step 9: Commit** — `git commit -m "Ticket #29617: Welle 3a -- tl-toolbar, tl-tabs, tl-breadcrumb im Paket"`

### Task P6: Nachzüge Welle 2 im Paket — Select-Popup liest `tl-popover`, drei Icon-Knopf-Blöcke fallen, Toggle in der FormGroup

**Files:**
- Modify: `src/components/select/select.css:117-138` (Popup), `:61-86` (`__chip-remove`, `__clear`)
- Modify: `src/components/field/field.css:84-96` (`__action`)
- Modify: `src/components/form/form.css:160-178` (`__toggle`)
- Modify: `select.contract.md`, `field.contract.md`, `form.contract.md`
- Test: `test/select.test.mjs`, `test/field.test.mjs`, `test/form.test.mjs` (Fälle, die die gestrichenen Klassen erwarten, umstellen)

**Interfaces:**
- Consumes: `tl-popover` (P4), `tl-button--icon` (P2), `tl-toggle` (P3).
- Produces: `.tl-select__popup` = nur noch Layout (`display:flex; flex-direction:column; overflow:hidden`) **plus** Klasse `tl-popover` am selben Element (E4 setzt beide); die Klassen `tl-select__chip-remove`, `tl-select__clear`, `tl-field-group__action`, `tl-form-group__toggle` existieren nicht mehr.

- [ ] **Step 1: Tests umstellen** — `grep -n "chip-remove\|__clear\|field-group__action\|form-group__toggle" test/*.mjs`; jeden Fall so umschreiben, dass er die **Abwesenheit** der Klasse in `src/` prüft und für den Ersatz den Vertrag liest (`missingInContract(md, ['tl-button--icon'])`). In `test/select.test.mjs` ergänzen:

```js
test('das Select-Popup trägt die Fläche nicht selbst: tl-popover liefert sie', () => {
  const d = declarationsOf(readGenerated('select', 'select.css'), '.tl-select__popup');
  assert.doesNotMatch(d, /shadow-popover|surface-overlay|layer-popover|border-radius/);
  assert.match(d, /max-height:\s*calc\(8 \* var\(--tl-size-row\)/);
});
```

- [ ] **Step 2: Rot sehen** — `node --test test/select.test.mjs test/field.test.mjs test/form.test.mjs` → FAIL.

- [ ] **Step 3: CSS** — `select.css` Popup-Block ersetzen durch:

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

`select.css` 61–86 (`.tl-select__chip-remove, .tl-select__clear` samt Hover) löschen; was davon bleibt, ist nur Lage: `.tl-select__chip > .tl-button { margin-inline-end: calc(-1 * var(--tl-border-width-sm)); }` falls die Kante gebraucht wird (Specimen prüfen). `field.css` 84–96 löschen; `.tl-field-group > .tl-button { margin: var(--tl-space-2xs); }` behalten, falls der Abstand gebraucht wird. `form.css` 160–178 löschen (`.tl-form-group__header` behält `gap`).

- [ ] **Step 4: Verträge** — Select: „Chip entfernen und Leeren sind `tl-button tl-button--ghost tl-button--sm tl-button--icon` mit `aria-label`; das Popup trägt `tl-popover tl-select__popup`.“ Feld: „Die Aktion in der Gruppe (Löschen, Link öffnen) ist ein `tl-button--icon --sm --ghost`.“ Form: „Der Einklappknopf ist ein `tl-toggle`.“ Doku-Pass N8 in denselben Verträgen: `disabled` („der Zustand liest `state.disabled`“, wie der Button), `hidden` (Feld: bleibt im DOM — wie `form.contract.md`), „Chip“ (Select nennt ihn „Wert-Chip“), `aria-selected` (Select: „die Liste führt nur ungewählte Optionen; `aria-selected="false"` an jeder“).

- [ ] **Step 5: Specimen** — `select.spec.html`, `field.spec.html`, `form.spec.html` auf die neuen Klassen umstellen (Popup `tl-popover tl-select__popup`; Knöpfe `tl-button tl-button--ghost tl-button--sm tl-button--icon`; Toggle `tl-toggle`).

- [ ] **Step 6: Gates** — `node tools/generate.mjs && node --test && node tools/lint-css.mjs` → **alles grün**, inkl. `popover.test.mjs`.

- [ ] **Step 7: Commit** — `git commit -m "Ticket #29617: Welle 3a -- Nachzuege Welle 2: Select-Popup auf tl-popover, Icon-Knoepfe und Toggle aus dem Paket"`

### Task P7: Fokus-Gate, Specimen-CSS, Engine-Gate vorbereiten

**Files:**
- Create: `test/focus.test.mjs`, `specimen/specimen.css`
- Modify: alle 19 `*.spec.html` (Style-Block → `<link rel="stylesheet" href="/specimen/specimen.css">`), `tools/serve.mjs` (prüfen, dass `/specimen/` ausgeliefert wird — `probe.theme.css` liegt dort schon)
- Modify: `test/engine-classes.test.mjs:12` (ALT-Regex um die sechs Klassen)

- [ ] **Step 1: focus.test.mjs**

```js
// Ein Ring, ein Maß (Spec §5): outline setzt nur der Basis-Ring in base.css; Komponenten dürfen den
// Ring nur nach innen legen (−focus-offset) — kein anderer Offset, keine eigene Farbe.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { declarations } from '../tools/lib/css.mjs';
import { componentCssFiles } from './lib/component.mjs';

test('kein Komponentenblock setzt outline; outline-offset nur als −focus-offset', () => {
  const bad = [];
  for (const [name, css] of componentCssFiles()) {
    for (const d of declarations(css)) {
      if (d.property === 'outline' || d.property === 'outline-color' || d.property === 'outline-width') bad.push(`${name}:${d.line} ${d.property}`);
      if (d.property === 'outline-offset' && d.value.trim() !== 'calc(-1 * var(--tl-focus-offset))') bad.push(`${name}:${d.line} ${d.value}`);
    }
  }
  assert.deepEqual(bad, []);
});

test('base.css trägt den Ring genau einmal', () => {
  const base = readFileSync(new URL('../dist/base.css', import.meta.url), 'utf8');
  assert.equal((base.match(/outline:\s*var\(--tl-focus-width\) solid var\(--tl-focus-ring\)/g) ?? []).length, 1);
});
```

Rot sehen, dann jeden Treffer in den bestehenden Komponenten beheben (erwartet: keiner — sonst ist es ein Welle-2-Nachzug, im Commit nennen).

- [ ] **Step 2: specimen.css** — die gemeinsamen Regeln aus `divider.spec.html` (`.specimen`, `__bar`, `__panel`, `__base`, `__overlay`, `__row`, `__stack`, `__toolbar`) in `specimen/specimen.css`; jede `*.spec.html` lädt sie statt des `<style>`-Blocks; Abweichungen (`__row`-Spaltenbreiten) als Modifier `.specimen__row--wide` dort aufnehmen. `node tools/serve.mjs` starten und zwei Specimen im Browser öffnen (Hendrik oder Chrome-Werkzeug): nichts verschoben.

- [ ] **Step 3: Engine-Gate** — in `test/engine-classes.test.mjs` die Regex um `|tlMenu|tlMenuRegion|tlUserMenu|tlToolbar|tlReactTabBar|tlBreadcrumb` erweitern. Der Test wird **rot** gegen den Worktree, bis Teil E fertig ist — das ist gewollt; Kommentar im Test: „Welle 3a: rot bis zum Merge der Engine-Tasks“. Damit `node --test` im Paket bis dahin trotzdem läuft, den Fall mit `{ skip: process.env.TL_WAVE3A_PENDING && 'Welle 3a läuft' }` markieren und in STATUS vermerken, dass die Variable nach E8 gestrichen wird.

- [ ] **Step 4: Gates, Commit** — `node --test && node tools/lint-css.mjs`; `git commit -m "Ticket #29617: Welle 3a -- Fokus-Gate, specimen.css, Engine-Gate um die sechs Bloecke"`

---

## Teil E — Engine (Branch `CWS/CWS_29617_design_system_welle_3a`)

### Task E1: Branch, Paket publizieren, `usePopover`, `Menu`, `TLMenu`

**Files:**
- Create: `com.top_logic.layout.react/react-src/bridge/popover.ts`, `react-src/controls/menu/Menu.tsx`
- Modify: `react-src/bridge-entry.ts` (Export), `react-src/controls/TLMenu.tsx`, `src/main/webapp/style/tlReactControls.css:2794-2910` (Block `TLMenu`), `design-system/test/ratchet.json`
- Test: `cd com.top_logic.layout.react && npm run build` (tsc + Vite), Modul-Tests `layout.react`

**Interfaces:**
- Produces:
  ```ts
  // bridge/popover.ts
  export type PopoverAnchor = Element | { x: number; y: number };
  export interface PopoverOptions { open: boolean; anchor: PopoverAnchor | null; onClose: () => void;
    placement?: 'bottom-start' | 'bottom-end' | 'top-start'; }
  export function usePopover(opts: PopoverOptions): {
    setFloating: (el: HTMLElement | null) => void; style: React.CSSProperties; };
  // controls/menu/Menu.tsx
  export interface MenuProps { open: boolean; anchor: PopoverAnchor | null; onClose: () => void;
    placement?: PopoverOptions['placement']; id?: string; className?: string; children: React.ReactNode; }
  export const Menu: React.FC<MenuProps>;            // div.tl-popover.tl-menu[role=menu] im Portal, Roving-Fokus
  export const MenuItem: React.FC<{ id?: string; icon?: string; label: string; disabled?: boolean;
    current?: boolean; className?: string; onSelect: () => void }>;  // button.tl-menu__item[role=menuitem]
  export const MenuHeader: React.FC<{ label: string }>; export const MenuSeparator: React.FC;
  ```

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
 * viewport, following scroll and resize. Surface, layer and shadow are the design system's
 * (tl-popover); this hook only yields the position.
 */
import React from 'react';
import { useFloating, autoUpdate, offset, flip, shift } from '@floating-ui/react';

export type PopoverAnchor = Element | { x: number; y: number };

export interface PopoverOptions {
  open: boolean;
  anchor: PopoverAnchor | null;
  onClose: () => void;
  placement?: 'bottom-start' | 'bottom-end' | 'top-start';
}

/** The gap between anchor and surface: space-xs, read from the tokens so it follows the density. */
function gapPx(): number {
  const v = getComputedStyle(document.documentElement).getPropertyValue('--tl-space-xs').trim();
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  const n = parseFloat(v);
  return isNaN(n) ? 8 : v.endsWith('rem') ? n * rem : n;
}

export function usePopover(opts: PopoverOptions): { setFloating: (el: HTMLElement | null) => void; style: React.CSSProperties } {
  const { open, anchor, onClose, placement = 'bottom-start' } = opts;
  const reference = anchor instanceof Element ? anchor : null;
  const virtual = anchor && !(anchor instanceof Element)
    ? { getBoundingClientRect: () => ({ x: anchor.x, y: anchor.y, left: anchor.x, top: anchor.y,
        right: anchor.x, bottom: anchor.y, width: 0, height: 0 }) }
    : null;
  const { refs, floatingStyles } = useFloating({
    open,
    onOpenChange: (o) => { if (!o) onClose(); },
    placement,
    elements: { reference: reference ?? undefined },
    middleware: [offset(gapPx()), flip(), shift({ padding: gapPx() })],
    whileElementsMounted: autoUpdate,
  });
  React.useLayoutEffect(() => {
    if (virtual) refs.setPositionReference(virtual);
  }, [virtual?.getBoundingClientRect().x, virtual?.getBoundingClientRect().y]);
  return { setFloating: refs.setFloating, style: floatingStyles };
}
```

`bridge-entry.ts`: `export { usePopover } from './bridge/popover'; export type { PopoverAnchor, PopoverOptions } from './bridge/popover';`

- [ ] **Step 3: `controls/menu/Menu.tsx`**

```tsx
import { React, useCloseOnOutsidePress, useFocusTrap, createPortal, usePopover, ThemeIcon, anchoredOverlayProps } from 'tl-react-bridge';
import type { PopoverAnchor, PopoverOptions } from 'tl-react-bridge';

const { useCallback, useEffect, useRef } = React;

const ITEM = '[role="menuitem"]:not([disabled])';

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
 * The one menu: a tl-popover with entries, portaled to the body, placed by usePopover. Keyboard
 * moves the real DOM focus (roving tabindex): arrows cycle, Home/End jump, Enter/Space choose,
 * Escape closes; disabled entries are skipped. Mounted only while open - a caller that needs its
 * entries to stay live (the toolbar overflow) keeps them mounted itself and passes `hidden`.
 */
/**
 * Roving tabindex over the entries of a menu: exactly one entry is in the tab order, the one that
 * has focus; arrows cycle, Home/End jump, Escape closes. Shared by Menu and the toolbar overflow.
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

export const Menu: React.FC<MenuProps> = ({ open, anchor, onClose, placement, id, className, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { setFloating, style } = usePopover({ open, anchor, onClose, placement });
  useCloseOnOutsidePress(open, [ref], onClose);
  useFocusTrap(open, ref, 'first');
  const { onKeyDown: handleKeyDown } = useRovingMenu(ref, open, onClose);

  if (!open) return null;
  return createPortal(
    <div
      id={id}
      ref={(el) => { (ref as React.MutableRefObject<HTMLDivElement | null>).current = el; setFloating(el); }}
      className={'tl-popover tl-menu' + (className ? ' ' + className : '')}
      role="menu"
      style={style}
      onKeyDown={handleKeyDown}
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
      className={'tl-menu__item tl-type-label' + (className ? ' ' + className : '')}
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

Enter/Space auf einem fokussierten `button` lösen `click` nativ aus — keine eigene Behandlung.

- [ ] **Step 4: `TLMenu.tsx` umschreiben**

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

`rootClassName(state)` ohne weitere Klasse liefert nur `cssClass` aus dem Zustand (css.ts:25–32).

- [ ] **Step 5: Altes CSS** — in `tlReactControls.css` die Regeln `.tlMenu`, `.tlMenu__item*`, `.tlMenu__separator`, `.tlMenu__header`, `.tlMenu__icon`, `.tlMenu__label` löschen (2823–2910). Die `.tlViewError*`-Regeln (2797–2821) bleiben und bekommen die Überschrift `/* --- TLViewError ----- */` (drei Striche wie die anderen); die Überschrift `TLMenu` fällt. `design-system/test/ratchet.json`: `"TLMenu"` streichen, `"TLViewError": <Zeilen aus node tools/inventory.mjs>` eintragen, `_blocks`-Vermerk: „01.10. Welle 3a: TLMenu gestrichen; TLViewError stand ohne eigene Überschrift im TLMenu-Block“.

- [ ] **Step 6: Bauen und testen** — `cd com.top_logic.layout.react && npm run build` (tsc 0 neue Befunde); Modul-Tests: `mvn -o -q test -pl com.top_logic.layout.react -Dtest='test.com.top_logic.layout.react.control.overlay.*'` (oder die Suite wie in STATUS: `layout.react`). `cd design-system && node --test test/ratchet.test.mjs`.

- [ ] **Step 7: Commit** — `git commit -m "Ticket #29617: Design System wave 3a -- one popover (floating-ui), one menu with roving focus; TLMenu reads it, old block removed"`

### Task E2: Spalten-Kontextmenü der Tabelle über `Menu`

**Files:**
- Modify: `react-src/controls/TLTableView.tsx:397-400` (State), `:1115-1121` (Hooks), `:1701-1741` (Markup)

- [ ] **Step 1: Markup ersetzen** — Zeilen 1701–1741 durch:

```tsx
<Menu open={!!contextMenu} anchor={contextMenu ? { x: contextMenu.x, y: contextMenu.y } : null}
    onClose={() => setContextMenu(null)}>
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

Import: `import { Menu, MenuItem } from './menu/Menu';`. Zeilen 1120–1121 (`useCloseOnOutsidePress`, `useStandaloneKeyboardScope`) und `contextMenuRef` (400) löschen — `Menu` schließt selbst. Die Handler `handleFreezeUpTo` usw. müssen `setContextMenu(null)` weiter aufrufen (prüfen, 1044–1047).

- [ ] **Step 2: Bauen, Tests** — `npm run build`; `layout.react`-Tests `control.table.*` grün. `grep -n "tlMenu" react-src/controls/TLTableView.tsx` → leer.

- [ ] **Step 3: Commit** — `git commit -m "Ticket #29617: Design System wave 3a -- the column context menu is a Menu: placed, clamped, keyboard-reachable like every menu"`

### Task E3: Button-Kontext und Toolbar

**Files:**
- Modify: `react-src/controls/button/ButtonDefaults.tsx`, `react-src/controls/TLButton.tsx:52-152`, `react-src/controls/TLToolbar.tsx` (ganz), `tlReactControls.css` (Blöcke `TLToolbar` 4625–4760, Dropdown 5636–5680, Host-Regeln 1116–1121 und 2113–2118), `design-system/test/ratchet.json`

**Interfaces:**
- Produces: `ButtonDefaultsValue { appearance?: ButtonAppearance; iconOnly?: boolean }`, `ButtonAppearance` um `'menu-item'`; `buttonClassName({ appearance, danger, small, icon, extra })`.

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
```

- [ ] **Step 2: TLButton** — nach Zeile 72: `const compact = defaults.iconOnly === true && !!resolvedImage; const resolvedMode2 = compact ? 'icon-only' : resolvedMode;` und alle folgenden Leser von `resolvedMode` auf `resolvedMode2` (Name danach zu `mode` vereinfachen). `const iconOnly = mode === 'icon-only'; const icon = iconOnly && !!resolvedImage;` `small = state.size === 'small' && iconOnly`. Klassen: `buttonClassName({ appearance: resolvedAppearance, danger: resolvedDanger, small, icon, extra: cssClasses })`. Teile: `const part = resolvedAppearance === 'menu-item' ? 'tl-menu' : 'tl-button';` → `className={part + '__icon ' + (showLabel ? 'tl-icon-sm' : 'tl-icon-md')}` und `<span className={part + '__label'}>`. Menüeintrag: `role="menuitem"` und `tabIndex={-1}` wenn `menu-item`. Der Tooltip bei `compact` ist der Label-Text (`iconOnly` → `tooltipProps[TOOLTIP_ATTR]` ohne `WHEN_TRUNCATED`): die bestehende Logik (120–127) deckt das, weil `iconOnly` dann wahr ist.

- [ ] **Step 3: TLToolbar** — Änderungen (Zeilen des heutigen Stands):
  - Konstanten 12–18: `OVERFLOW_ICON` bleibt; `COMPACT_CLASS`, `TRIGGER_SIZE_PROPERTY` löschen.
  - `MenuGroup` (107–248): `menuStyle`, `useLayoutEffect`, `useCloseOnOutsidePress`, `useStandaloneKeyboardScope`, `useFocusTrap` löschen. Trigger:
    ```tsx
    <button ref={triggerRef} type="button"
      className={buttonClassName({ appearance: inheritedAppearance, icon: iconOnly })}
      onMouseDown={(e) => e.preventDefault()} onClick={handleToggle}
      aria-expanded={open} aria-haspopup="menu" aria-label={iconOnly ? label : undefined}
      {...tooltipProps(iconOnly ? label : undefined)}>
      {iconOnly ? <ThemeIcon encoded={group.icon!} className="tl-button__icon tl-icon-md" />
        : <><span className="tl-button__label">{label}</span><ThemeIcon encoded={CHEVRON_ICON} className="tl-icon-sm" /></>}
    </button>
    ```
    mit `const CHEVRON_ICON = 'css:fa-solid fa-chevron-down';` und `inheritedAppearance = useButtonDefaults().appearance ?? 'ghost'`. Dropdown: bleibt gemountet, ein Portal mit `usePopover`:
    ```tsx
    const { setFloating, style } = usePopover({ open, anchor: triggerRef.current, onClose: () => setOpen(false), placement: align === 'start' ? 'bottom-start' : 'bottom-end' });
    useCloseOnOutsidePress(open, [menuRef, triggerRef], () => setOpen(false));
    useFocusTrap(open, menuRef, 'first');
    {createPortal(
      <div ref={(el) => { menuRef.current = el; setFloating(el); }} className="tl-popover tl-menu" role="menu"
           hidden={!open} style={open ? style : undefined} onClick={() => setOpen(false)} onKeyDown={menuKeyDown} {...anchoredOverlayProps}>
        <ButtonDefaults appearance="menu-item" iconOnly={false}>
          {visibleItems.map((item, i) => <TLChild key={i} control={item} />)}
          {sections.map((items, si) => <React.Fragment key={`sub-${si}`}>
            {(visibleItems.length > 0 || si > 0) && <hr className="tl-divider" />}
            {items.map((item, i) => <TLChild key={i} control={item} />)}
          </React.Fragment>)}
        </ButtonDefaults>
      </div>, document.body)}
    ```
    `menuKeyDown` kommt aus `useRovingMenu(menuRef, open, () => setOpen(false))` (E1, `Menu.tsx`) — keine Kopie. `iconOnly={false}` im Dropdown, damit kompakte Toolbars ihre Overflow-Einträge mit Label zeigen.
  - Root (455–478): `className={rootClassName(state, 'tl-toolbar')}`, Attribute `data-tl-overflow={collapsible ? overflowEnd : undefined}` und `data-tl-compact={compact ? '' : undefined}`; `<ButtonDefaults appearance={appearance} iconOnly={compact}>`; Trenner `<hr className="tl-divider tl-divider--vertical" aria-orientation="vertical" />`; Gruppen `tl-toolbar__group` (ohne `--inline/--menu`; `data-tlunit` bleibt).
  - `measureUnits` (485–512): kompakte Breiten nicht mehr durch Klassenwechsel, sondern:
    ```ts
    const control = tokenPx(rootStyle, '--tl-size-control');
    const compact = full.map((w, i) => {
      const el = root.querySelector<HTMLElement>(`[data-tlunit="${i}"]`);
      return el?.querySelector('.tl-button__icon') ? control : w;
    });
    const separatorElement = root.querySelector('.tl-divider--vertical');
    return { full, compact, gap, itemGap, separator, trigger: control };
    ```
    `tokenPx(style, name)` ersetzt `triggerSize`: liest `style.getPropertyValue(name)`, rechnet `rem` in px, Fallback `2 * rem`. Dazu `itemGap` aus `.tl-toolbar__group`.
- [ ] **Step 4: Altes CSS** — Block `TLToolbar` (4625–4760) komplett löschen, Dropdown-Teil (5636–5680, inkl. `.tlToolbar__chevron` davor ab 5630) löschen. Host-Regeln ersetzen:

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

`ratchet.json`: `"TLToolbar"` streichen; `foreignTl` ohne die zwei Toolbar-Namen; die Dropdown-Zeilen zählten zum Block „Dashboard“ o. ä. — `node tools/inventory.mjs` zeigt, welcher Block sinkt; dessen Zahl senken.

- [ ] **Step 5: Bauen, Tests** — `npm run build`; `layout.react` (`TestReactToolbarControl`), `layout.view` (`TestAppBarElement`); Paket `node --test test/ratchet.test.mjs` grün (foreignTl leer bis auf `--tlText-tone` u. a.).

- [ ] **Step 6: Commit** — `git commit -m "Ticket #29617: Design System wave 3a -- toolbar: buttons choose compact via ButtonDefaults, trigger is a tl-button, overflow is a Menu; --tl-toolbar-* gone"`

### Task E4: Nachzug Select, Textfeld — Popup über `usePopover`, Icon-Knöpfe

**Files:**
- Modify: `react-src/controls/TLDropdownSelect.tsx:268-296` (Position), `:548-556` (Popup-Root), `:57-87` (Chip), `:684-692` (Clear); `react-src/controls/TLTextInput.tsx:248-273` (`__action`)

- [ ] **Step 1: Select-Popup** — `useEffect` 276–296 und `dropdownStyle` löschen; `const { setFloating, style } = usePopover({ open: isOpen, anchor: containerRef.current, onClose: () => { setIsOpen(false); setSearchTerm(''); } });` Popup-Root: `className="tl-popover tl-select__popup"`, `ref={(el) => { dropdownRef.current = el; setFloating(el); }}`, `style={{ ...style, width: containerRef.current?.getBoundingClientRect().width }}` (Breite = Feld; `anchoredOverlayProps` bleibt).
- [ ] **Step 2: Knöpfe** — Chip-Entfernen (75–83) und Leeren (684–692): `className={buttonClassName({ appearance: 'ghost', small: true, icon: true })}` mit `aria-label` wie heute und `<ThemeIcon … className="tl-button__icon tl-icon-sm" />`. `TLTextInput` 248–273: Löschknopf und Link-Aktion ebenso; das native `title` (255) streichen (Tooltip über `tooltipProps`).
- [ ] **Step 3: Bauen, Tests, Commit** — `npm run build`; `layout.react` grün; `grep -rn "tl-select__chip-remove\|tl-select__clear\|tl-field-group__action" react-src` → leer. `git commit -m "Ticket #29617: Design System wave 3a -- select popup placed by usePopover on tl-popover; remove/clear/field actions are icon buttons"`

### Task E5: Nachzug FormGroup — `tl-toggle`

**Files:**
- Modify: `react-src/controls/TLFormGroup.tsx:11-12`, `:69-78`

- [ ] **Step 1** — Konstanten: nur `const CHEVRON = 'css:fa-solid fa-chevron-right';`. Knopf: `className="tl-toggle"`, Inhalt `<ThemeIcon encoded={CHEVRON} className="tl-icon-sm" />`; `aria-expanded`, `aria-controls`, `aria-label`, Tooltip bleiben.
- [ ] **Step 2** — `npm run build`; `grep -rn "tl-form-group__toggle" react-src` leer; Commit `"Ticket #29617: Design System wave 3a -- form group collapses with tl-toggle"`.

### Task E6: TabBar und Breadcrumb

**Files:**
- Modify: `react-src/controls/TLTabBar.tsx`, `react-src/controls/TLBreadcrumb.tsx`, `tlReactControls.css` (Blöcke 184–233, 291–307, 2160–2208), `src/main/java/com/top_logic/layout/react/I18NConstants.java`, `META-INF/messages_de.properties`, `design-system/test/ratchet.json`

- [ ] **Step 1: TabBar**

```tsx
const listRef = React.useRef<HTMLDivElement>(null);
const focusTab = (index: number) => {
  const tabsEl = Array.from(listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? []);
  const el = tabsEl[(index + tabsEl.length) % tabsEl.length];
  el?.focus();
  const id = el?.dataset.tabId; if (id) handleTabClick(id);
};
const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
  if (e.key === 'ArrowRight') focusTab(index + 1); else if (e.key === 'ArrowLeft') focusTab(index - 1);
  else if (e.key === 'Home') focusTab(0); else if (e.key === 'End') focusTab(tabs.length - 1); else return;
  e.preventDefault();
};
// Markup
<div id={controlId} className={rootClassName(state, 'tl-tabs ' + fillClass)}>
  <div ref={listRef} className="tl-tabs__list" role="tablist">
    {tabs.map((tab, index) => (
      <button key={tab.id} type="button" role="tab" id={`${controlId}-tab-${tab.id}`} data-tab-id={tab.id}
        aria-selected={tab.id === activeTabId} aria-controls={`${controlId}-panel`}
        tabIndex={tab.id === activeTabId ? 0 : -1}
        className="tl-tabs__tab tl-type-label" onClick={() => handleTabClick(tab.id)} onKeyDown={(e) => handleKeyDown(e, index)}>
        {tab.icon && <ThemeIcon encoded={tab.icon} className="tl-icon-sm" />}
        <span>{tab.label}</span>
      </button>))}
  </div>
  <div id={`${controlId}-panel`} className="tl-tabs__panel" role="tabpanel" aria-labelledby={activeTabId ? `${controlId}-tab-${activeTabId}` : undefined}>
    <FillBarrier>{!!state.activeContent && <TLChild control={state.activeContent} />}</FillBarrier>
  </div>
</div>
```

- [ ] **Step 2: Breadcrumb** — `I18NConstants.java` im Block „Client-side i18n keys“:

```java
	/**
	 * @en Breadcrumb
	 */
	@CustomKey("js.breadcrumb.label")
	public static ResKey JS_BREADCRUMB_LABEL;
```

`messages_de.properties`: `js.breadcrumb.label = Navigationspfad` (alphabetisch bei den `js.`-Keys). TSX: `const I18N_KEYS = { 'js.breadcrumb.label': 'Breadcrumb' }; const i18n = useI18N(I18N_KEYS);` Markup: `<nav className={rootClassName(state, 'tl-breadcrumb')} aria-label={i18n['js.breadcrumb.label']}>`, `ol.tl-breadcrumb__list`, `li.tl-breadcrumb__entry`, Trenner `<ThemeIcon encoded={SEPARATOR_ICON} className="tl-breadcrumb__separator tl-icon-sm" aria-hidden />` mit `const SEPARATOR_ICON = 'css:fa-solid fa-chevron-right';`, Eintrag `<button type="button" className={buttonClassName({ appearance: 'link' })} …>`, aktuell `<span className="tl-breadcrumb__current tl-type-label" aria-current="page">`.

- [ ] **Step 3: Altes CSS, Ratsche** — Blöcke `TLTabBar` (184–233 und `.tlReactTabBar__content` 291–307) und `TLBreadcrumb` (2160–2208) löschen; `ratchet.json` beide streichen (291–307 zählt zu einem Nachbarblock — `inventory.mjs` zeigt, welcher sinkt).

- [ ] **Step 4: messages_en** — `design-system/tools/check-messages-en.sh` → erzeugt `messages_en.properties` mit `js.breadcrumb.label = Breadcrumb`; Diff committen. Scheitert Maven offline, zuerst die vorgelagerten Module installieren (Memory „Gate nach master-Merge“).

- [ ] **Step 5: Bauen, Tests, Commit** — `npm run build`; `layout.react` (`TestTabBarRouteVeto`), `layout.view`; `git commit -m "Ticket #29617: Design System wave 3a -- tabs with roving focus and arrow keys, breadcrumb with link buttons and a localized label"`

### Task E7: Menü-Auslöser — Anker-Element, `aria-expanded`, Tastatur

**Files:**
- Modify: `react-src/controls/TLMenuRegion.tsx`, `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/command/MenuRegionControl.java:56-100`, `com.top_logic.layout.react/src/main/java/com/top_logic/layout/react/control/overlay/ContextMenuOpener.java:53-70, 114-150, ~190`, `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/ViewServlet.java:399-414`, `tlReactControls.css:2911-2938`
- Test: `com.top_logic.layout.view/src/test/java/test/com/top_logic/layout/view/command/TestContextMenuOpener.java` (RecordingRenderer um `show(String anchorId, …)`; neuer Fall „open with anchor records the anchor and reports closed“)

- [ ] **Step 1: Java** — `ContextMenuOpener.MenuRenderer`: zweite Methode `void show(String anchorId, List<MenuEntry> items, Function<String, HandlerResult> selectHandler, Runnable closeHandler);` (JavaDoc: „Show a menu at the element with the given ID.“). `ContextMenuOpener`: `public void open(String anchorId, List<Targeted> contributions, Runnable closed)` und `open(int x, int y, List<Targeted>, Runnable closed)`; beide bauen die Einträge über eine gemeinsame private Methode `List<MenuEntry> assemble(List<Targeted>)`; `_closed` wird in `handleClose()` (Zeile ~190) aufgerufen und genullt. Die bestehende `open(int, int, List)` delegiert mit `closed = null`. `ViewServlet` 400–414: zweite `show`-Implementierung `menu.updateItems(items); menu.setSelectHandler(selectHandler); menu.setCloseHandler(closeHandler); menu.setAnchorId(anchorId); menu.open();`. `MenuRegionControl`: `private static final String ARG_ANCHOR = "anchorId"; private static final String MENU_OPEN = "menuOpen";` — `handleOpen`: liest `anchorId` (String, optional); ruft `_opener.open(anchorId, targeted, () -> putState(MENU_OPEN, false))` bzw. die x/y-Variante; danach `putState(MENU_OPEN, true)`, nur wenn der Opener wirklich geöffnet hat (`open` gibt `boolean` zurück: `anything`). JavaDoc an jeder neuen Methode (englisch, `@en` nur bei `I18NConstants`).

- [ ] **Step 2: Test** — in `TestContextMenuOpener`: `RecordingRenderer` erhält die zweite `show`; neuer Fall: `opener.open("anchor-1", contributions, closed)` → Renderer hat `anchorId == "anchor-1"`; `opener.close()` (oder der Close-Pfad des Tests) → `closed` wurde einmal gerufen. Rot sehen, dann Step 1 fertigstellen, grün: `mvn -o -q test -pl com.top_logic.layout.view -Dtest=TestContextMenuOpener`.

- [ ] **Step 3: TSX**

```tsx
const menuOpen = state.menuOpen === true;
const openAtRegion = useCallback(() => sendCommand('openMenu', { anchorId: controlId }), [sendCommand, controlId]);
const openAtTarget = useCallback((target: Element) => {
  const r = target.getBoundingClientRect();
  sendCommand('openMenu', { x: Math.round(r.left), y: Math.round(r.bottom) });
}, [sendCommand]);
const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
  if (isClick && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openAtRegion(); return; }
  if (!isClick && (e.key === 'ContextMenu' || (e.key === 'F10' && e.shiftKey))) { e.preventDefault(); e.stopPropagation(); openAtTarget(e.target as Element); }
}, [isClick, openAtRegion, openAtTarget]);
// click-Variante: ein echter Knopf
return isClick
  ? <button type="button" id={controlId} ref={regionRef as React.RefObject<HTMLButtonElement>}
      className={rootClassName(state, 'tl-menu-region', buttonClassName({ appearance: defaults.appearance ?? 'ghost' }))}
      aria-haspopup="menu" aria-expanded={menuOpen} onClick={handleClick} onKeyDown={handleKeyDown}>
      {!!child && <TLChild control={child} />}
    </button>
  : <div id={controlId} className={rootClassName(state, 'tl-menu-region')} ref={regionRef}
      onContextMenu={handleContextMenu} onKeyDown={handleKeyDown}>
      {!!child && <TLChild control={child} />}
    </div>;
```

`handleClick` ruft `openAtRegion` (statt `openBelowRegion`); `defaults = useButtonDefaults()`. Ein `<button>` darf keine interaktiven Kinder haben — die Kinder des Benutzermenüs sind Avatar und Text (E8), keine Knöpfe; Vertrag nennt die Regel.

- [ ] **Step 4: Altes CSS, Ratsche** — Block `TLMenuRegion` (2911–2938) löschen; `ratchet.json` streichen.
- [ ] **Step 5: Gates** — `npm run build`; `check-messages-en.sh` (Java-Änderungen in zwei Modulen) → Diff committen; `layout.view` grün. Commit `"Ticket #29617: Design System wave 3a -- menu region anchors the menu to its element, reports aria-expanded, opens by keyboard"`.

### Task E8: Benutzermenü ohne eigenen Block

**Files:**
- Modify: `com.top_logic.layout.view/src/main/webapp/WEB-INF/views/user-menu.view.xml:60-65`, `tlReactControls.css:2940-2955`, `design-system/test/ratchet.json`

- [ ] **Step 1** — `<text css-class="tl-button__label" input="currentUser" overflow="ellipsis"/>`; der Avatar davor bleibt (`tl-avatar` im Icon-Slot, Vertrag `menu.contract.md` nennt „Avatar + Label“ als zulässige Kinder des Klick-Auslösers). Prüfen: trägt `overflow="ellipsis"` eine eigene Klasse am `TLText`? (`grep -n "ellipsis" react-src/controls/TLText.tsx`) — wenn ja, reicht `tl-button__label` und das Attribut kann bleiben.
- [ ] **Step 2** — Block `User menu` löschen, Ratsche streichen. Die `@media (max-width: 640px)`-Regel fällt ersatzlos: Breakpoints entscheidet Welle 4 mit der AppBar — Eintrag in `docs/migration/altlast.md` „Offen für spätere Wellen“: „AppBar-Breakpoint für den Benutzernamen (war 640 px)“.
- [ ] **Step 3** — `layout.view`-Tests; Sichtprüfung in E9. Commit `"Ticket #29617: Design System wave 3a -- user menu trigger is a ghost button; no own stylesheet block"`.

### Task E9: Gates, Ebene des Tooltips, Sichtprüfung, PR

**Files:**
- Modify: `tlReactControls.css:5507` (`z-index: var(--tl-layer-popover);`), `design-system/test/engine-classes.test.mjs` (Skip-Variable entfernen), `docs/migration/altlast.md`, `STATUS.md`

- [ ] **Step 1: Tooltip-Ebene** — Zeile 5507 `z-index: var(--tl-layer-popover);`; Ratsche: der Block sinkt nicht, Literal-Zähler `zIndex` in `ratchet.json` (falls geführt) um 1 senken.
- [ ] **Step 2: Paket-Gates gegen den Worktree** — `cd design-system && node --test && node tools/lint-css.mjs` (ohne `TL_WAVE3A_PENDING`; Skip in `engine-classes.test.mjs` entfernen): `engine-classes` grün (keine der sechs Klassen), `ratchet` grün (sechs Blöcke weg, `foreignTl` −2, kein Block gewachsen).
- [ ] **Step 3: Engine-Gates** — `npm run build` (tsc), Modul-Tests `layout.react`, `layout.view`, `demo.react`; `tools/check-messages-en.sh` ohne Diff; `git grep -n "tlMenu\|tlMenuRegion\|tlUserMenu\|tlToolbar\|tlReactTabBar\|tlBreadcrumb" -- '*.tsx' '*.ts' '*.css' '*.xml' 'docs/'` leer (Treffer in `docs/plans/*.md` des Worktrees: alte Pläne — dort die Klassennamen als „alt (bis Welle 3a)“ markieren, nicht umschreiben).
- [ ] **Step 4: Doku** — `altlast.md`: Abschnitt „Welle 3a · Navigation und Popups — gebaut <Datum>“ mit gestrichenen Blöcken, „Neu im Paket“, „Alt → neu für Anwendungs-Stylesheets“ (Tabelle alt → neu), Offen (AppBar-Breakpoint, Tab-Overflow); `STATUS.md` Stand; `docs/skalen.md` „Entschieden beim Bauen“ nur, wenn beim Bauen entschieden wurde.
- [ ] **Step 5: Push und PR** — `git fetch`; Push durch Hendrik; PR gegen `CWS/CWS_29617_design_system_welle_2` (ist !1740 gemergt: gegen `master`, vorher `git merge origin/master`), Bernhard Reviewer, Trac #29617 CC; Beschreibung englisch: Ziel, Konsolidierung (W1–W5, W9, W12, N8 mit Link auf `altlast.md`), Migrationsliste, Sichtprüfungsliste aus Spec §10.5.
- [ ] **Step 6: Sichtprüfung** in der Docker-Instanz (hell, dunkel, beide Dichten): Menü am Fensterrand klappt um, folgt dem Scrollen; Kontextmenü per `Shift+F10`; Spaltenmenü der Tabelle bleibt im Fenster; Toolbar kompakt und Überlauf (Einträge live); Reiter per Pfeilen; Benutzermenü-Knopf mit `aria-expanded`; Select-Popup folgt dem Scrollen; Hilfe-, Entfernen-, Leeren-Knopf 24 px; FormGroup-Toggle dreht. Befunde als Fix-Commits auf dem Branch.

---

## Self-Review

**Spec coverage:** §3a–c → P4, E1, E2, E3 (Overflow); §4 → P5, E3; §5 → P7, menu.css/tabs.css (innen/außen), E1/E6 (Roving); §6 → P2, P3, P6, E4, E5; §7 → P5, E6, E7, E8; §8 → P1, P4 (Maße), E9 (Tooltip-Ebene), Icons in jedem E-Task über `ThemeIcon`; §9 Gates → P2 (square), P4 (popover), P7 (focus, engine-classes), E3/E6/E7/E8 (Ratsche), E9; §10 Reihenfolge = P1–P7, E1–E9; §11 Offenes → E8 (Breakpoint), E9 Doku.

**Placeholder scan:** keine „TBD“; zwei Prüfaufträge mit Alternative (Token `icon-primary`/`font-weight-strong`) sind benannt und enden in einer Entscheidung im Task.

**Type consistency:** `usePopover`/`PopoverAnchor` (E1) gleich in E2, E3, E4; `buttonClassName({ icon })` (E3) in E4, E6, E7; `Menu`/`MenuItem` (E1) in E2; `useRovingMenu` (E3) wird in E1 angelegt — **Korrektur:** `useRovingMenu` gehört in `Menu.tsx` aus E1; E1 Step 3 nutzt ihn intern (`const { onKeyDown } = useRovingMenu(ref, open, onClose)`), E3 importiert ihn.

**Review Focus:** 1 → E1/E9 (Sichtprüfung); 2 → E1 (`ITEM`-Selektor); 3 → E3 (`hidden`, gemountet); 4 → E3 (`compact`-Rechnung); 5 → E6 (`focusTab`).
