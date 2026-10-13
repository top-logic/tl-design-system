# Welle 4a · Overlays — Umsetzungsplan (#29836)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dialog, Fenster, Drawer, Snackbar, NoticeBar und Overlay der React-Schicht lesen das Paket; ihre sieben
Blöcke (481 Zeilen) fallen aus `tlReactControls.css`.

**Architecture:** Das Paket bekommt sechs Bausteine — `tl-dialog` (Scrim, Fläche, Körper, Fuß, Griffe), `tl-titlebar`
(der eine Kopf für Dialog und Drawer, Q3), `tl-drawer`, `tl-snackbar` und `tl-notice-bar` (je als Hülle um
`tl-alert`), `tl-overlay` (Ebenen-Container). Die Engine behält ihre Java-Controls und TSX-Module; die TSX schreiben
Paketklassen, Zustände als `data-tl-state`. In `bridge/` wird `EscapeToClose` geteilt, `useFocusTrap` bekommt einen
Modus ohne Falle, `useKeyedTransition` markiert über `data-tl-state`, `tokenMs` liest Dauern.

**Tech Stack:** Paket: CSS, `node --test`, `tools/*.mjs`. Engine: React/TSX über `tl-react-bridge`, TypeScript, Vite,
Java 17 (eine Konstante), Maven.

**Spec:** `docs/superpowers/specs/2026-10-13-welle-4a-overlays-design.md` (entschieden 13.10.); Prognose Q1–Q9 in
`docs/migration/altlast.md` „Welle 4“.

## Abweichungen von der Spec (beim Planen am Code gefunden)

1. **`useDismiss` entfällt.** Escape von Dialog und Fenster muss in den Scope binden, den die Komponente selbst mit
   `KeyboardScopeProvider` öffnet; ein Hook in derselben Komponente bindet in den Scope **darum herum**. Deshalb gibt
   es die Komponente `EscapeToClose` einmal in `bridge/` (statt zweimal kopiert, Q6). Drawer und Fotoaufnahme nutzen
   schon den gemeinsamen `useStandaloneKeyboardScope`; Außenklick hat schon `useCloseOnOutsidePress`.
2. **Fuß mit `:empty`.** Der Fuß hält eine Toolbar, die ohne Befehl nichts rendert; das TSX weiß das nicht vorher.
   Darum bleibt `.tl-dialog__footer:empty { display: none; }` (Spec §3 sagte „nicht gerendert“).
3. **`tl-titlebar` statt `tl-dialog__header` und `tl-drawer__header`.** Q3 verlangt einen Kopf; zwei Elementklassen
   wären zweimal dieselben zehn Zeilen. `tl-titlebar` mit `__title` und `__actions` trägt beide, 4b nimmt ihn für
   Panel und Card.
4. **Maximieren ohne `aria-pressed`.** Der Knopf wechselt sein Label („Maximieren“/„Wiederherstellen“) wie heute;
   WAI-ARIA rät, bei `aria-pressed` das Label nicht zu wechseln. Spec §3 nannte `aria-pressed`.
5. **Rahmen der Fläche in beiden Modi** wie beim Popover (`border-separator`), nicht nur hell.
6. **Kamera-Knöpfe bleiben.** Spiegeln, Auslösen und Schließen der Fotoaufnahme sind runde Kamera-Knöpfe auf dem
   Video (Block TLPhotoCapture, Welle 5); 4a nimmt dort nur Scrim, Fokus und Escape (Q1, Q2, Q5).
7. **Snackbar ohne Icon.** `SnackbarStateJson` liefert kein Icon; ein Icon im TSX hart zu wählen, umginge das Theme.
   `tl-alert` erlaubt kein Icon (die Spalten folgen dem Inhalt); die Bedeutung steht im Text.
8. **Modaler Drawer nur im Paket.** `ReactDrawerControl` kennt keine Scrim-Option (Java bleibt); die Variante mit Scrim
   steht in CSS, Vertrag und Specimen und wird in 4b von der mobilen Sidebar gerendert.
9. **Rahmen der Snackbar ist die Linie der Bedeutung** (aus `tl-alert`), nicht `border-separator` (Spec §5): ein
   getönter Alert mit Statuslinie ist schon abgegrenzt; ein zweiter Rahmen wäre doppelt.
10. **Drawer-Körper behält Innenabstand und `overscroll-behavior: contain`** wie bisher (`--tl-space-md`); das
    Abstandsmodell „Behälter sind bündig“ gilt für den Dialog-Körper schon, für den Drawer prüft 4b es mit Panel/Card.

**Plan-Review** 13.10. durch einen frischen Agenten (Fable): Probelauf des Pakets in einer Kopie (Lint grün, 379/380,
nur `published` erwartet rot), Engine-Änderungen in einer Kopie (`tsc` 0, beide Vite-Builds grün), Ratsche gegen eine
Nachbildung. Befunde 2–12 eingearbeitet (Grep mit `-P`, Zustandswörter im Lint, `*.view.xml` im Gate, Button-Vertrag,
Snackbar-Rahmen, Umbruch in `skalen.md`, Ratschenzahlen, Drawer-Körper, Kommentare im Blur-Test, `useEffect` im Drawer,
Kommentar im Dialog-Stapel). Befund 1 (Branch-Basis) entscheidet Hendrik.

## Global Constraints

- Ticket **#29836**; Commits beider Repos mit Präfix `Ticket #29836:`, Paket-Commits deutsch, Engine-Commits englisch,
  Trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` (bzw. das Modell des Subagenten).
- Engine-Branch `CWS/CWS_29836_design_system_welle_4a`, **gestapelt auf** `origin/CWS/CWS_29825_design_system_spaltenwahl`
  (!1852 auf !1838; entschieden 13.10. nach Plan-Review, Befund 1: auf 3b wäre das Paket-Gate der Spaltenwahl rot).
  Merge-Reihenfolge 3b → Spaltenwahl → 4a. **Kein Push** — weder Engine noch Paket; Subagenten committen lokal und melden.
- Paket: `tokens.json` nur Referenzen; im CSS nur Tokens (Lint); `dist/` nur über `node tools/generate.mjs`, danach
  `node tools/publish-to-worktree.mjs` (`test/published.test.mjs` hält die Kopie byte-gleich).
- Zustände sind Attribute: `data-tl-state` als Wortliste (`~=`), nie `--open`, `--exiting`, `--maximized`, `--clickable`.
- `z-index` nur `var(--tl-layer-*)`; `transition`/`animation` nur mit `var(--tl-duration-*)` und `var(--tl-easing-*)`.
- Kein `outline: none`; der Ring kommt aus `base.css`.
- React in Controls nur aus `'tl-react-bridge'` importieren, nie aus `'react'`.
- `messages_en.properties` nie von Hand; `design-system/tools/check-messages-en.sh` vor dem Abschluss.
- Java-Aufrufer des Fensters bleiben unverändert (Kompaktfeld, Spaltenwahl, Filter, `I18NEditorDialog`,
  `ConfirmDialogControl`, `DirtyConfirmDialogControl`, `MessageDialogControl`).
- Keine Zeitangaben in Docs und Commits.

## Review Focus

1. **Escape in Schichten:** Ein offenes Select oder Menü im Dialog schließt mit Escape zuerst sich, dann erst der
   Dialog; zwei gestapelte Dialoge schließen von oben. Gesichert durch dieselbe `EscapeToClose`-Bindung wie heute (Task
   6, Typprüfung) und Sichtprüfung Task 10, Punkt 3.
2. **Fokus kehrt zurück:** nach Schließen von Fenster, Drawer und Fotoaufnahme steht der Fokus wieder am Auslöser —
   auch wenn der Drawer per Escape schließt. Task 6 (Option `trap: false` behält die Rückgabe), Task 10 Punkt 2 und 6.
3. **Bewegung ohne Rest:** Die Kopie eines geschlossenen Dialogs verschwindet nach der Ausblendung (animationend) und
   lässt den Zeiger durch; bei reduzierter Bewegung entsteht keine Kopie. Task 3 (Test: `pointer-events: none` an der
   Kopie), Task 6 (Hook), Task 10 Punkt 1.
4. **Fenster nach Ziehen und Maximieren:** Ein gezogenes Fenster bleibt im Viewport, Maximieren füllt ohne Rand und
   stellt wieder her; die Ränder kommen jetzt aus `--tl-space-lg` (24 px bei Standardwurzel). Task 7, Task 10 Punkt 4.
5. **Snackbar mit Fehlerliste:** Die HTML-Meldung aus `CommandErrors` (Titel + `<ul>`) bricht sauber um, der Titel ist
   kräftig, kein Zeilenumbruch aus `white-space: pre-line` zerreißt die Liste. Task 5 (Regel), Task 10 Punkt 7.

---

## Datei-Übersicht

| Datei | Verantwortung |
|---|---|
| `design-system/src/primitives.json`, `src/tokens.json` | `size-12..15`; `size-drawer-narrow/-medium/-wide`, `size-toast-max` |
| `design-system/tools/lint-css.mjs` | `MODIFIERS` für die neuen Blöcke |
| `design-system/src/components/overlay/overlay.{css,contract.md,spec.html}` | Ebenen-Container |
| `design-system/src/components/titlebar/titlebar.{css,contract.md}` | der eine Kopf (Titel, Aktionen) |
| `design-system/src/components/dialog/dialog.{css,contract.md,spec.html}` | Scrim, Fläche, Körper, Fuß, Griffe, Bewegung |
| `design-system/src/components/drawer/drawer.{css,contract.md,spec.html}` | Schublade mit und ohne Scrim |
| `design-system/src/components/snackbar/snackbar.{css,contract.md,spec.html}` | Hülle um `tl-alert`, schwebend |
| `design-system/src/components/notice-bar/notice-bar.{css,contract.md,spec.html}` | Hülle um `tl-alert`, Balken |
| `design-system/src/components/alert/alert.contract.md` | Hüllen und Ansage-Regel nachgezogen |
| `design-system/test/overlays.test.mjs` (neu), `test/contracts-4a.test.mjs` (neu) | Regeln und Verträge |
| `design-system/test/ratchet.json`, `test/engine-classes.test.mjs` | Ratsche, alte Klassen |
| `react-src/bridge/tl-react-bridge.ts`, `bridge/transition.ts`, `bridge/token-px.ts`, `bridge/icons.ts`, `bridge-entry.ts` | Helfer |
| `react-src/controls/TLDialog.tsx`, `TLDialogManager.tsx`, `TLWindow.tsx` | Dialog |
| `react-src/controls/TLDrawer.tsx`, `TLSnackbar.tsx`, `TLNoticeBar.tsx`, `TLOverlay.tsx`, `TLPhotoCapture.tsx` | übrige Overlays |
| `src/main/java/.../control/CommandErrors.java` | Titelklasse der Fehlermeldung |
| `src/main/webapp/style/tlReactControls.css` | sieben Blöcke gestrichen, Foto-Scrim gestrichen, eine Regel umgezogen |
| `com.top_logic.layout.view/.../tl-docs/view-layer/app-shell.md`, `display.md` | Doku der Klassen |
| `com.top_logic.demo.react/src/main/webapp/style/tl-demo-react.css` | eigene Dialog-Bewegung gestrichen |

Pfade der Engine relativ zu `_Working-Tree/tl8-wt-29584/com.top_logic.layout.react/`, wo nicht anders genannt.

---

### Task 1: Branch anlegen

**Files:** keine.

**Interfaces:**
- Produces: Branch `CWS/CWS_29836_design_system_welle_4a` im Worktree `_Working-Tree/tl8-wt-29584`.

- [ ] **Step 1: Ticket prüfen** — Trac `get_ticket 29836`: Status muss `accepted` sein (angelegt und angenommen 13.10.).
- [ ] **Step 2: Branch anlegen**

```bash
cd _Working-Tree/tl8-wt-29584
git fetch origin
git status --porcelain | grep -v corporate   # muss leer sein
git switch -c CWS/CWS_29836_design_system_welle_4a origin/CWS/CWS_29825_design_system_spaltenwahl
git log --oneline -1   # erwartet: 00f3c902e4 oder neuer (Spaltenwahl, Review-Fix)
```

- [ ] **Step 3: Paket auf den Branch veröffentlichen** — prüfen, dass die Kopie dem Stand von `main` entspricht:

```bash
cd ../../design-system && node tools/generate.mjs && node tools/publish-to-worktree.mjs && node --test test/published.test.mjs
```

Expected: PASS. Zeigt `git -C ../_Working-Tree/tl8-wt-29584 status` eine geänderte Paketkopie, ist das der Stand von
`main`; sie wird mit dem ersten Engine-Commit (Task 7) eingecheckt.

---

### Task 2: Paket — Maße, Lint, `tl-overlay`, `tl-titlebar`

**Files:**
- Modify: `design-system/src/primitives.json`, `design-system/src/tokens.json`, `design-system/tools/lint-css.mjs`
- Create: `design-system/src/components/overlay/overlay.css`, `overlay.contract.md`, `overlay.spec.html`
- Create: `design-system/src/components/titlebar/titlebar.css`, `titlebar.contract.md`
- Create: `design-system/test/overlays.test.mjs`

**Interfaces:**
- Produces: Tokens `--tl-size-drawer-narrow|-medium|-wide`, `--tl-size-toast-max`; Klassen `tl-overlay`,
  `tl-overlay__base`, `tl-overlay__layer`, `tl-overlay__layer--{fill|top-left|top|top-right|left|center|right|bottom-left|bottom|bottom-right}`,
  `tl-titlebar`, `tl-titlebar__title`, `tl-titlebar__actions`. Lint kennt `tl-dialog`, `tl-drawer`
  (`start`, `end`, `bottom`, `narrow`, `medium`, `wide`, `container`), `tl-snackbar`, `tl-notice-bar`, `tl-overlay`,
  `tl-titlebar`.

- [ ] **Step 1: Failing tests schreiben** — `design-system/test/overlays.test.mjs` anlegen:

```js
// Welle 4a (Spec 2026-10-13): Overlays aus dem Paket. Jede Regel hier steht in der Spec; die Verträge prüft
// contracts-4a.test.mjs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readGenerated, declarationsOf, rulesOf } from './lib/component.mjs';

const P = JSON.parse(readFileSync(new URL('../src/primitives.json', import.meta.url)));
const T = JSON.parse(readFileSync(new URL('../src/tokens.json', import.meta.url)));
const decl = (dir, sel) => declarationsOf(readGenerated(dir, `${dir}.css`), sel) ?? '';

test('Maße der Overlays: Drawer-Breiten und Toast-Breite als Tokens über Primitive', () => {
  assert.deepEqual(['size-12', 'size-13', 'size-14', 'size-15'].map((n) => P.measure[n]), ['16rem', '24rem', '36rem', '40rem']);
  assert.equal(T.measure['size-drawer-narrow'], '{size-12}');
  assert.equal(T.measure['size-drawer-medium'], '{size-13}');
  assert.equal(T.measure['size-drawer-wide'], '{size-14}');
  assert.equal(T.measure['size-toast-max'], '{size-15}');
});

test('tl-overlay: Ebenen decken die Basis, lassen den Zeiger durch, zehn Anker, keine Ebene und keine Fläche', () => {
  assert.match(decl('overlay', '.tl-overlay'), /position:\s*relative/);
  assert.match(decl('overlay', '.tl-overlay__layer'), /inset:\s*0/);
  assert.match(decl('overlay', '.tl-overlay__layer'), /pointer-events:\s*none/);
  assert.match(decl('overlay', '.tl-overlay__layer > *'), /pointer-events:\s*auto/);
  for (const a of ['fill', 'top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right'])
    assert.notEqual(declarationsOf(readGenerated('overlay', 'overlay.css'), `.tl-overlay__layer--${a}`), null, a);
  assert.doesNotMatch(readGenerated('overlay', 'overlay.css').replace(/\/\*[\s\S]*?\*\//g, ''), /z-index|background/);
});

test('tl-titlebar: Leistenhöhe, Linie unten, Titel mit Ellipse, Aktionen am Ende', () => {
  assert.match(decl('titlebar', '.tl-titlebar'), /min-height:\s*var\(--tl-size-bar\)/);
  assert.match(decl('titlebar', '.tl-titlebar'), /border-bottom:\s*var\(--tl-border-width-sm\) solid var\(--tl-border-separator\)/);
  assert.match(decl('titlebar', '.tl-titlebar__title'), /flex:\s*1 1 auto/);
  assert.match(decl('titlebar', '.tl-titlebar__title'), /margin:\s*0/);
  assert.match(decl('titlebar', '.tl-titlebar__actions'), /display:\s*flex/);
});
```

- [ ] **Step 2: Tests laufen lassen, sie scheitern**

Run: `cd design-system && node --test test/overlays.test.mjs 2>&1 | grep -E '^ℹ (pass|fail)|^✖'`
Expected: FAIL — drei Tests (Maße fehlen, `overlay.css` und `titlebar.css` fehlen: `readComponent` wirft ENOENT).

- [ ] **Step 3: Primitive und Tokens** — in `src/primitives.json` unter `measure` hinter `"size-11": "10rem",`
  einfügen: `"size-12": "16rem", "size-13": "24rem", "size-14": "36rem", "size-15": "40rem",`. In `src/tokens.json`
  unter `measure` hinter `"size-popover-min": "{size-11}", "size-popover-max": "{view-1}",` einfügen:

```json
    "size-drawer-narrow": "{size-12}", "size-drawer-medium": "{size-13}", "size-drawer-wide": "{size-14}",
    "size-toast-max": "{size-15}",
```

- [ ] **Step 4: Lint-Modifier** — in `tools/lint-css.mjs` in `MODIFIERS` hinter `'tl-tree': new Set([]),` einfügen:

```js
  'tl-overlay': new Set([]), // Die Anker sind Element-Modifier (tl-overlay__layer--<anker>), keine des Blocks.
  'tl-titlebar': new Set([]),
  'tl-dialog': new Set([]), // Ein- und Ausblenden, maximiert: data-tl-state.
  'tl-drawer': new Set(['start', 'end', 'bottom', 'narrow', 'medium', 'wide', 'container']), // offen: data-tl-state.
  'tl-snackbar': new Set([]), // Die Bedeutung trägt tl-alert (data-tl-role).
  'tl-notice-bar': new Set([]), // klickbar: role="button", kein Modifier.
```

- [ ] **Step 4a: Zustandswörter im Lint** — in `tools/lint-css.mjs` in **beiden** Regexen `STATE_MODIFIER` und
  `ELEMENT_STATE_MODIFIER` hinter `|open|closed` die Wörter `|entering|exiting|maximized|clickable|visible` einfügen.
  In `test/lint-css.test.mjs` anhängen:

```js
test('Zustände der Overlays als Modifier brechen das Gate (Welle 4a)', () => {
  for (const sel of ['.tl-dialog--entering', '.tl-dialog__surface--maximized', '.tl-notice-bar--clickable', '.tl-snackbar--visible', '.tl-x__y--exiting'])
    assert.ok(lint(`${sel} { display: none; }`, { known, file: 'x.css' }).some((v) => /Zustand als/.test(v)), sel);
});
```

- [ ] **Step 5: `overlay.css`** anlegen:

```css
/* Overlay — Spec 2026-10-13 Welle 4a §8. Ein Stapel aus Basis und Ebenen, kein Overlay im Sinn eines Dialogs:
   die Basis gibt die Höhe, das umgebende Layout die Breite; jede Ebene deckt genau diese Fläche und legt ihren
   Inhalt an einen Rand, eine Ecke oder die Mitte. Wo eine Ebene nichts zeigt, geht der Zeiger zur Basis durch.
   Keine Fläche, keine Ebene (z-index): das Aussehen gibt die Anwendung über die Klasse der Ebene. */

.tl-overlay {
  position: relative;
  display: inline-block;
  max-width: 100%;
}
.tl-overlay[hidden] { display: none; }

.tl-overlay__layer {
  position: absolute;
  inset: 0;
  display: flex;
  pointer-events: none;
}

/* Was die Ebene zeigt, nimmt den Zeiger zurück. */
.tl-overlay__layer > * {
  pointer-events: auto;
}

.tl-overlay__layer--fill { align-items: stretch; justify-content: stretch; }
.tl-overlay__layer--top-left { align-items: start; justify-content: start; }
.tl-overlay__layer--top { align-items: start; justify-content: center; }
.tl-overlay__layer--top-right { align-items: start; justify-content: end; }
.tl-overlay__layer--left { align-items: center; justify-content: start; }
.tl-overlay__layer--center { align-items: center; justify-content: center; }
.tl-overlay__layer--right { align-items: center; justify-content: end; }
.tl-overlay__layer--bottom-left { align-items: end; justify-content: start; }
.tl-overlay__layer--bottom { align-items: end; justify-content: center; }
.tl-overlay__layer--bottom-right { align-items: end; justify-content: end; }
```

- [ ] **Step 6: `titlebar.css`** anlegen:

```css
/* Titelleiste — Spec 2026-10-13 Welle 4a §3, Konsolidierung Q3. Der eine Kopf über einer Fläche: Titel links mit
   Ellipse, Aktionen (Toolbar, Kopfknöpfe tl-button--icon --sm) rechts, eine Linie darunter. Dialog und Drawer
   tragen ihn; Panel und Card folgen in 4b. Die Typo-Klasse des Titels (tl-type-heading-sm) setzt das Markup. */

.tl-titlebar {
  display: flex;
  align-items: center;
  gap: var(--tl-space-xs);
  box-sizing: border-box;
  min-height: var(--tl-size-bar);
  padding: var(--tl-space-2xs) var(--tl-space-xs) var(--tl-space-2xs) var(--tl-space-md);
  border-bottom: var(--tl-border-width-sm) solid var(--tl-border-separator);
}
.tl-titlebar[hidden] { display: none; }

.tl-titlebar__title {
  flex: 1 1 auto;
  min-width: 0;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tl-titlebar__actions {
  display: flex;
  flex: 0 1 auto;
  align-items: center;
  min-width: 0;
}
```

- [ ] **Step 7: Verträge** — `overlay.contract.md`:

```markdown
# Vertrag: Overlay

Ein Stapel aus einer Basis und Ebenen darüber: ein Abzeichen auf einem Bild, eine Beschriftung über einem Foto.
TopLogic garantiert Lage und Zeigerverhalten, nicht das Aussehen; das gibt die Anwendung über die Klasse der Ebene.

## Zustand

Das Control ist `TLOverlay` (`ReactOverlayControl`, View-Element `<overlay>` mit `<layer position="…">`).

| Schlüssel | Typ | Bedeutung |
|---|---|---|
| `base` | Control | Die Basis; sie gibt dem Overlay die Höhe. |
| `layers[].control` | Control | Inhalt einer Ebene. |
| `layers[].anchor` | `fill` \| `top-left` \| `top` \| `top-right` \| `left` \| `center` \| `right` \| `bottom-left` \| `bottom` \| `bottom-right` | Wohin die Ebene ihren Inhalt legt. |
| `layers[].cssClass` | string, optional | Klasse der Anwendung an der Ebene. |

## Verhalten

- Jede Ebene deckt die Fläche der Basis; die Breite gibt das umgebende Layout.
- Wo eine Ebene nichts zeigt, geht der Zeiger zur Basis durch; ihr Inhalt nimmt ihn zurück.

## Tokens

Keine: das Overlay hat keine Fläche und keine Ebene (`z-index`); die Ebenen stapeln nach ihrer Reihenfolge.

## Attribute

| Attribut | Wann |
|---|---|
| `tl-overlay` | immer, am Behälter |
| `tl-overlay__base` | um die Basis |
| `tl-overlay__layer` + `tl-overlay__layer--<anker>` | je Ebene; dazu `cssClass` der Anwendung |

## Konformität

Ein Overlay besteht den Vertrag, wenn die Ebenen die Basis decken, der Zeiger durch freie Fläche geht und im
Klassen-Gate keine Klasse ohne `tl-`-Präfix bleibt.
```

  `titlebar.contract.md`:

```markdown
# Vertrag: Titelleiste

Der Kopf über einer Fläche, die einen Titel trägt: Dialog, Drawer; in Welle 4b Panel und Card. Titel links, Aktionen
rechts, eine Linie darunter. Kein Control für sich — die Fläche rendert ihn.

## Tokens

| Teil | Token |
|---|---|
| Höhe | mindestens `--tl-size-bar` |
| Abstand | `--tl-space-2xs` oben und unten, `--tl-space-md` vor dem Titel, `--tl-space-xs` hinter den Aktionen und zwischen ihnen |
| Linie | `--tl-border-width-sm` `--tl-border-separator` unten |
| Titel | `tl-type-heading-sm`, Ellipse |

## Attribute

| Attribut | Wann |
|---|---|
| `tl-titlebar` | immer, am Kopf |
| `tl-titlebar__title` | am Titel; ein `h2` mit `id`, auf die die Fläche mit `aria-labelledby` zeigt |
| `tl-titlebar__actions` | um eine Toolbar der Fläche (Fensteraktionen), wenn es eine gibt |

Kopfknöpfe (Maximieren, Schließen) stehen hinter den Aktionen als `tl-button tl-button--ghost tl-button--sm tl-button--icon`
mit `ThemeIcon` (`tl-icon-sm`), `aria-label` und Tooltip.

## Konformität

Eine Titelleiste besteht den Vertrag, wenn der Titel ein `h2` mit `id` ist, auf den die Fläche zeigt, und die
Kopfknöpfe 24 px groß (`--tl-size-control-sm`) und benannt sind.
```

- [ ] **Step 8: Specimen `overlay.spec.html`** — Kopf wie `alert.spec.html` (Zeilen 1–24: `<!doctype>`, sechs
  Stylesheets, `<main class="specimen">`, `specimen__bar` mit Titel „Overlay“ und den Schaltern `id="mode"`,
  `id="density"`); `<style>` für die Bühne; Inhalt:

```html
<style>
  .stage { display: block; width: 20rem; height: 12rem; background: var(--tl-surface-layer-nested); }
  .badge { padding: var(--tl-space-2xs) var(--tl-space-xs); background: var(--tl-surface-overlay); border-radius: var(--tl-radius-sm); }
</style>
…
  <section class="specimen__panel">
    <p class="tl-type-heading-sm">Basis mit vier Ebenen</p>
    <div class="tl-overlay">
      <div class="tl-overlay__base"><span class="stage"></span></div>
      <div class="tl-overlay__layer tl-overlay__layer--top-right"><span class="badge tl-type-label">oben rechts</span></div>
      <div class="tl-overlay__layer tl-overlay__layer--bottom-left"><span class="badge tl-type-label">unten links</span></div>
      <div class="tl-overlay__layer tl-overlay__layer--center"><button type="button" class="tl-button tl-button--secondary">Mitte, klickbar</button></div>
      <div class="tl-overlay__layer tl-overlay__layer--bottom"><span class="badge tl-type-label">unten</span></div>
    </div>
  </section>
```

  Am Ende das Skript für `mode` und `density` wie in `alert.spec.html` (letzte zwei `addEventListener`-Zeilen).

- [ ] **Step 9: Erzeugen, Lint, Tests, Veröffentlichen**

```bash
cd design-system
node tools/generate.mjs && node tools/lint-css.mjs && node tools/publish-to-worktree.mjs
node --test 2>&1 | grep -E '^ℹ (pass|fail)|^✖'
```

Expected: `Klassen-Gate grün`; alle Tests grün. Scheitert `layers.test.mjs` „keine Primitive ohne Leser“, fehlt eine
Referenz aus Step 3.

- [ ] **Step 10: Commit (Paket-Repo)**

```bash
git add design-system/src design-system/dist design-system/tools/lint-css.mjs design-system/test/overlays.test.mjs design-system/test/lint-css.test.mjs
git commit -m "Ticket #29836: Overlay und Titelleiste im Paket, Maße für Drawer und Toast, Lint kennt die Blöcke der Welle 4a

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Paket — `tl-dialog`

**Files:**
- Create: `design-system/src/components/dialog/dialog.css`, `dialog.contract.md`, `dialog.spec.html`
- Modify: `design-system/test/overlays.test.mjs`

**Interfaces:**
- Consumes: `tl-titlebar` (Task 2).
- Produces (Task 7 rendert): `tl-dialog` (Scrim, Wurzel von `TLDialog`, `data-tl-state~="entering|exiting"`),
  `tl-dialog__surface` (Wurzel von `TLWindow`, `role="dialog"`, `data-tl-state~="maximized"`),
  `tl-dialog__body`, `tl-dialog__footer`, `tl-dialog__resize` mit `data-tl-edge="n|ne|e|se|s|sw|w|nw"`.

- [ ] **Step 1: Failing tests** — an `overlays.test.mjs` anhängen:

```js
test('tl-dialog: Scrim deckt den Viewport auf der Overlay-Ebene, ohne Blur, mit Rand space-lg', () => {
  const d = decl('dialog', '.tl-dialog');
  assert.match(d, /position:\s*fixed/);
  assert.match(d, /inset:\s*0/);
  assert.match(d, /z-index:\s*var\(--tl-layer-overlay\)/);
  assert.match(d, /background:\s*var\(--tl-surface-scrim\)/);
  assert.match(d, /padding:\s*var\(--tl-space-lg\)/);
  assert.doesNotMatch(readGenerated('dialog', 'dialog.css').replace(/\/\*[\s\S]*?\*\//g, ''), /backdrop-filter|blur/i);
});

test('tl-dialog: Ein- und Ausblenden über data-tl-state mit Tokens; die Kopie lässt den Zeiger durch', () => {
  assert.match(decl('dialog', '.tl-dialog[data-tl-state~="entering"]'), /animation:\s*tl-dialog-in var\(--tl-duration-base\) var\(--tl-easing-entrance\)/);
  const aus = decl('dialog', '.tl-dialog[data-tl-state~="exiting"]');
  assert.match(aus, /animation:\s*tl-dialog-out var\(--tl-duration-base\) var\(--tl-easing-exit\) forwards/);
  assert.match(aus, /pointer-events:\s*none/);
});

test('tl-dialog__surface: Overlay-Fläche mit Rahmen, Schatten dialog, Ecke md; maximiert ohne Rand und Ecke', () => {
  const s = decl('dialog', '.tl-dialog__surface');
  assert.match(s, /background:\s*var\(--tl-surface-overlay\)/);
  assert.match(s, /border:\s*var\(--tl-border-width-sm\) solid var\(--tl-border-separator\)/);
  assert.match(s, /box-shadow:\s*var\(--tl-shadow-dialog\)/);
  assert.match(s, /border-radius:\s*var\(--tl-radius-md\)/);
  assert.match(s, /max-height:\s*100%/);
  const m = decl('dialog', '.tl-dialog__surface[data-tl-state~="maximized"]');
  assert.match(m, /inset:\s*0/);
  assert.match(m, /border-radius:\s*0/);
});

test('tl-dialog: Kopf zum Ziehen, Fuß rechtsbündig und leer verborgen, acht Griffe', () => {
  assert.match(decl('dialog', '.tl-dialog__surface > .tl-titlebar'), /cursor:\s*grab/);
  assert.match(decl('dialog', '.tl-dialog__surface[data-tl-state~="maximized"] > .tl-titlebar'), /cursor:\s*default/);
  assert.match(decl('dialog', '.tl-dialog__footer'), /justify-content:\s*end/);
  assert.match(decl('dialog', '.tl-dialog__footer:empty'), /display:\s*none/);
  for (const e of ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'])
    assert.match(decl('dialog', `.tl-dialog__resize[data-tl-edge="${e}"]`), /cursor:\s*[a-z]+-resize/, e);
});
```

- [ ] **Step 2: Laufen lassen, scheitert** — `node --test test/overlays.test.mjs` → FAIL (ENOENT `dialog.css`).

- [ ] **Step 3: `dialog.css`** anlegen:

```css
/* Dialog — Spec 2026-10-13 Welle 4a §3, docs/skalen.md „Scrim und Ebenen“, Konsolidierung Q1/Q2.
   Ein Paketbaustein, zwei Controls: TLDialog rendert den Scrim (.tl-dialog), TLWindow die Fläche darin
   (.tl-dialog__surface mit tl-titlebar, Körper, Fuß, Griffen). Der Scrim hat keinen Blur — die Skala kennt keinen.
   Er hält den Rand space-lg zum Viewport; die Fläche ist höchstens so groß wie das, was er freilässt. */

.tl-dialog {
  position: fixed;
  inset: 0;
  z-index: var(--tl-layer-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: var(--tl-space-lg);
  background: var(--tl-surface-scrim);
}
.tl-dialog[hidden] { display: none; }

/* Die Standardbewegung (Spec §7). useKeyedTransition setzt die Wörter; eine Anwendung überschreibt sie auf denselben
   Attributen. Bei reduzierter Bewegung setzt der Hook nichts. */
.tl-dialog[data-tl-state~="entering"] {
  animation: tl-dialog-in var(--tl-duration-base) var(--tl-easing-entrance);
}

/* Die Kopie eines geschlossenen Dialogs ist ein Bild über der Seite: sie lässt den Zeiger zur Seite und zu einem
   Dialog darunter durch. */
.tl-dialog[data-tl-state~="exiting"] {
  animation: tl-dialog-out var(--tl-duration-base) var(--tl-easing-exit) forwards;
  pointer-events: none;
}

@keyframes tl-dialog-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes tl-dialog-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

/* Die Fläche. Breite und Höhe setzt TLWindow inline (Server-Maß, vom Benutzer gezogen); nach dem ersten Ziehen liegt
   sie absolut im Scrim (left/top inline). Rahmen und Schatten wie beim Popover (skalen.md: Dialog trägt beides). */
.tl-dialog__surface {
  position: relative;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  max-width: 100%;
  max-height: 100%;
  border: var(--tl-border-width-sm) solid var(--tl-border-separator);
  border-radius: var(--tl-radius-md);
  background: var(--tl-surface-overlay);
  box-shadow: var(--tl-shadow-dialog);
  color: var(--tl-text-primary);
}

.tl-dialog__surface[data-tl-state~="maximized"] {
  position: absolute;
  inset: 0;
  border-radius: 0;
}

/* Am Kopf wird das Fenster gezogen; maximiert nicht. */
.tl-dialog__surface > .tl-titlebar {
  cursor: grab;
  user-select: none;
}

.tl-dialog__surface[data-tl-state~="maximized"] > .tl-titlebar {
  cursor: default;
}

.tl-dialog__body {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
  overflow: auto;
}

/* Der Fuß hält eine Toolbar; ohne Befehl rendert sie nichts, dann verschwindet er. */
.tl-dialog__footer {
  display: flex;
  justify-content: end;
  gap: var(--tl-space-xs);
  padding: var(--tl-space-sm) var(--tl-space-md);
  border-top: var(--tl-border-width-sm) solid var(--tl-border-separator);
}

.tl-dialog__footer:empty {
  display: none;
}

/* Acht Griffe zum Ändern der Größe, halb über dem Rand. Kanten xs breit, Ecken sm groß. */
.tl-dialog__resize {
  position: absolute;
}

.tl-dialog__resize[data-tl-edge="n"],
.tl-dialog__resize[data-tl-edge="s"] {
  left: var(--tl-space-sm);
  right: var(--tl-space-sm);
  height: var(--tl-space-xs);
  cursor: ns-resize;
}

.tl-dialog__resize[data-tl-edge="e"],
.tl-dialog__resize[data-tl-edge="w"] {
  top: var(--tl-space-sm);
  bottom: var(--tl-space-sm);
  width: var(--tl-space-xs);
  cursor: ew-resize;
}

.tl-dialog__resize[data-tl-edge="n"] { top: calc(-1 * var(--tl-space-2xs)); }
.tl-dialog__resize[data-tl-edge="s"] { bottom: calc(-1 * var(--tl-space-2xs)); }
.tl-dialog__resize[data-tl-edge="e"] { right: calc(-1 * var(--tl-space-2xs)); }
.tl-dialog__resize[data-tl-edge="w"] { left: calc(-1 * var(--tl-space-2xs)); }

/* Die Ecken: je eine Regel mit Lage und Zeiger, dann die gemeinsame Größe (die Einzelregeln stehen zuerst — der
   Test liest die erste Regel, die den Selektor nennt, und erwartet dort den Zeiger). */
.tl-dialog__resize[data-tl-edge="ne"] { top: calc(-1 * var(--tl-space-2xs)); right: calc(-1 * var(--tl-space-2xs)); cursor: nesw-resize; }
.tl-dialog__resize[data-tl-edge="se"] { bottom: calc(-1 * var(--tl-space-2xs)); right: calc(-1 * var(--tl-space-2xs)); cursor: nwse-resize; }
.tl-dialog__resize[data-tl-edge="sw"] { bottom: calc(-1 * var(--tl-space-2xs)); left: calc(-1 * var(--tl-space-2xs)); cursor: nesw-resize; }
.tl-dialog__resize[data-tl-edge="nw"] { top: calc(-1 * var(--tl-space-2xs)); left: calc(-1 * var(--tl-space-2xs)); cursor: nwse-resize; }

.tl-dialog__resize[data-tl-edge="ne"],
.tl-dialog__resize[data-tl-edge="se"],
.tl-dialog__resize[data-tl-edge="sw"],
.tl-dialog__resize[data-tl-edge="nw"] {
  width: var(--tl-space-sm);
  height: var(--tl-space-sm);
}
```

  Bei den Kanten steht der Zeiger in der Gruppenregel (`n` mit `s`, `e` mit `w`), die zuerst kommt; die Einzelregeln
  danach tragen nur die Lage. So findet der Test für jede der acht Richtungen den Zeiger.

- [ ] **Step 4: Vertrag `dialog.contract.md`:**

```markdown
# Vertrag: Dialog

Eine modale Fläche über der Seite: Rückfrage, Formular, Spaltenwahl, Editor. TopLogic garantiert Zugänglichkeit und
Verhalten, nicht das Aussehen; wer ins Bild passen will, liest die Tokens.

Zwei Controls, ein Baustein: `TLDialog` (`ReactDialogControl`) rendert den Scrim `tl-dialog`, `TLWindow`
(`ReactWindowControl`) die Fläche `tl-dialog__surface` darin. `TLDialogManager` stapelt die offenen Dialoge.

## Zustand

| Schlüssel | Typ | Bedeutung |
|---|---|---|
| `open` (Dialog) | boolean | Der Scrim steht. |
| `closable` | boolean | Escape, Klick auf den Scrim und der Schließen-Knopf schließen; `false`, solange Arbeit läuft (Knopf deaktiviert). |
| `closeOnBackdrop` | boolean | Ob ein Klick auf den Scrim schließt. |
| `title` | string | Titel der Fläche. |
| `width`, `height` | CSS-Maß | Größe vom Server. |
| `customWidth`, `customHeight` | number | Vom Benutzer gezogene Größe; gilt, solange sie in den Viewport passt. |
| `resizable` | boolean | Griffe, Maximieren, Doppelklick. |
| `toolbar`, `footer`, `child` | Control | Aktionen im Kopf, Knopfleiste im Fuß, Inhalt. |

## Aktionen

| Aktion | Wann |
|---|---|
| `close` | Escape, Scrim, Schließen-Knopf |
| `resize` | Ende eines Zugs an einem Griff, mit `width`/`height` in px |
| `resetSize` | Doppelklick auf einen Griff |

## Verhalten

- Beim Öffnen geht der Fokus auf das erste Feld, sonst auf die Fläche; Tab bleibt in der Fläche; beim Schließen kehrt
  er zum Auslöser zurück.
- Escape schließt den obersten Dialog; ein Popup darin (Select, Menü) schließt zuerst.
- Ziehen am Kopf verschiebt die Fläche im Viewport; die Griffe ändern die Größe (mindestens 200 × 100 px, höchstens
  Viewport minus Rand); Doppelklick auf den Kopf maximiert.
- Ein- und Ausblenden: `data-tl-state~="entering"` am neuen Scrim, eine inerte Kopie mit `~="exiting"` beim Schließen;
  das Paket blendet über `--tl-duration-base` ein und aus, eine Anwendung überschreibt das. Bei reduzierter Bewegung
  entfällt beides.

## Tokens

| Teil | Token |
|---|---|
| Scrim | `--tl-surface-scrim`, Ebene `--tl-layer-overlay`, Rand `--tl-space-lg` |
| Fläche | `--tl-surface-overlay`, Rahmen `--tl-border-width-sm` `--tl-border-separator`, Ecke `--tl-radius-md`, Schatten `--tl-shadow-dialog` |
| Kopf | `tl-titlebar` |
| Fuß | Abstand `--tl-space-sm` `--tl-space-md`, Lücke `--tl-space-xs`, Linie oben `--tl-border-separator` |
| Griffe | Kanten `--tl-space-xs`, Ecken `--tl-space-sm`, über den Rand um `--tl-space-2xs` |
| Bewegung | `--tl-duration-base`, `--tl-easing-entrance`, `--tl-easing-exit` |

## Attribute

| Attribut | Wann |
|---|---|
| `tl-dialog` | am Scrim |
| `tl-dialog__surface` + `role="dialog"` + `aria-modal="true"` + `aria-labelledby` | an der Fläche; `aria-labelledby` zeigt auf `tl-titlebar__title` |
| `data-tl-state~="entering"` / `~="exiting"` | am Scrim, während er kommt bzw. als Kopie geht |
| `data-tl-state~="maximized"` | an der Fläche, maximiert |
| `tl-dialog__body`, `tl-dialog__footer` | Körper, Fuß (leer verborgen) |
| `tl-dialog__resize` + `data-tl-edge` | Griff je Kante und Ecke: `n`, `ne`, `e`, `se`, `s`, `sw`, `w`, `nw` |

## Konformität

Ein Dialog besteht den Vertrag, wenn die Fläche `role="dialog"`, `aria-modal="true"` und `aria-labelledby` trägt, der
Fokus gefangen ist und zurückkehrt, Escape von innen nach außen schließt und im Klassen-Gate keine Klasse ohne
`tl-`-Präfix bleibt.
```

- [ ] **Step 5: Specimen `dialog.spec.html`** — Kopf wie `alert.spec.html` (Titel „Dialog“). Der Scrim ist `fixed`;
  im Specimen steht er in einer Bühne, die ihn einfängt:

```html
<style>
  .stage { position: relative; height: 24rem; overflow: hidden; transform: translateZ(0); }
  .stage .tl-dialog { position: absolute; }
  .stage .tl-dialog__surface.wide { width: 28rem; }
  .stage p { margin: var(--tl-space-md); }
</style>
…
  <section class="specimen__base"><p class="tl-type-heading-sm">Fenster mit Toolbar, Körper, Fuß, Griffen</p>
    <div class="stage">
      <div class="tl-dialog">
        <div class="tl-dialog__surface wide" role="dialog" aria-modal="true" aria-labelledby="d1-title">
          <div class="tl-titlebar">
            <h2 class="tl-titlebar__title tl-type-heading-sm" id="d1-title">Spalten wählen, mit einem Titel, der mit Ellipse endet</h2>
            <button type="button" class="tl-button tl-button--ghost tl-button--sm tl-button--icon" aria-label="Maximieren" data-tooltip="text:Maximieren"><i class="tl-icon-sm bi bi-window tl-button__icon" aria-hidden="true"></i></button>
            <button type="button" class="tl-button tl-button--ghost tl-button--sm tl-button--icon" aria-label="Schließen" data-tooltip="text:Schließen"><i class="tl-icon-sm bi bi-x-lg tl-button__icon" aria-hidden="true"></i></button>
          </div>
          <div class="tl-dialog__body"><p class="tl-type-body">Inhalt des Fensters.</p></div>
          <div class="tl-dialog__footer">
            <button type="button" class="tl-button tl-button--secondary">Abbrechen</button>
            <button type="button" class="tl-button tl-button--primary">Ok</button>
          </div>
          <div class="tl-dialog__resize" data-tl-edge="n"></div><div class="tl-dialog__resize" data-tl-edge="ne"></div>
          <div class="tl-dialog__resize" data-tl-edge="e"></div><div class="tl-dialog__resize" data-tl-edge="se"></div>
          <div class="tl-dialog__resize" data-tl-edge="s"></div><div class="tl-dialog__resize" data-tl-edge="sw"></div>
          <div class="tl-dialog__resize" data-tl-edge="w"></div><div class="tl-dialog__resize" data-tl-edge="nw"></div>
        </div>
      </div>
    </div>
  </section>
  <section class="specimen__base"><p class="tl-type-heading-sm">Maximiert, ohne Fuß</p>
    <div class="stage">
      <div class="tl-dialog">
        <div class="tl-dialog__surface" role="dialog" aria-modal="true" aria-labelledby="d2-title" data-tl-state="maximized">
          <div class="tl-titlebar">
            <h2 class="tl-titlebar__title tl-type-heading-sm" id="d2-title">Editor</h2>
            <button type="button" class="tl-button tl-button--ghost tl-button--sm tl-button--icon" aria-label="Wiederherstellen" data-tooltip="text:Wiederherstellen"><i class="tl-icon-sm bi bi-window-stack tl-button__icon" aria-hidden="true"></i></button>
            <button type="button" class="tl-button tl-button--ghost tl-button--sm tl-button--icon" aria-label="Schließen" data-tooltip="text:Schließen"><i class="tl-icon-sm bi bi-x-lg tl-button__icon" aria-hidden="true"></i></button>
          </div>
          <div class="tl-dialog__body"><p class="tl-type-body">Maximiert füllt die Fläche den Scrim ohne Rand und Ecke.</p></div>
          <div class="tl-dialog__footer"></div>
        </div>
      </div>
    </div>
  </section>
```

  Schluss-Skript wie in `alert.spec.html`. `transform: translateZ(0)` macht die Bühne zum Bezug für `position: fixed`.

- [ ] **Step 6: Erzeugen, Lint, Tests, Veröffentlichen** — wie Task 2 Step 9. Expected: grün. `hidden.test.mjs`
  verlangt `.tl-dialog[hidden]` — steht in Step 3.

- [ ] **Step 7: Gegenprobe** — in `dialog.css` `pointer-events: none;` aus der `exiting`-Regel nehmen,
  `node tools/generate.mjs && node --test test/overlays.test.mjs` muss rot werden; zurücknehmen, neu erzeugen.

- [ ] **Step 8: Commit (Paket)**

```bash
git add design-system/src/components/dialog design-system/dist design-system/test/overlays.test.mjs
git commit -m "Ticket #29836: Dialog im Paket -- Scrim ohne Blur, Fläche mit Rahmen und Schatten, Titelleiste, Fuß, acht Griffe, Bewegung über data-tl-state

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Paket — `tl-drawer`

**Files:**
- Create: `design-system/src/components/drawer/drawer.css`, `drawer.contract.md`, `drawer.spec.html`
- Modify: `design-system/test/overlays.test.mjs`

**Interfaces:**
- Consumes: `tl-titlebar`, `tl-dialog` (Scrim des modalen Drawers), Maße aus Task 2.
- Produces (Task 8 rendert): `aside.tl-drawer.tl-drawer--{start|end|bottom}.tl-drawer--{narrow|medium|wide}[.tl-drawer--container]`
  mit `data-tl-state~="open"`, darin `tl-titlebar` und `tl-drawer__body`.

- [ ] **Step 1: Failing tests** — anhängen:

```js
test('tl-drawer: Overlay-Ebene am Viewport, raised im Behälter, schiebt mit Tokens, offen ohne Versatz', () => {
  const d = decl('drawer', '.tl-drawer');
  assert.match(d, /position:\s*fixed/);
  assert.match(d, /z-index:\s*var\(--tl-layer-overlay\)/);
  assert.match(d, /background:\s*var\(--tl-surface-overlay\)/);
  assert.match(d, /box-shadow:\s*var\(--tl-shadow-dialog\)/);
  assert.match(d, /transition:\s*transform var\(--tl-duration-base\) var\(--tl-easing-exit\)/);
  assert.match(decl('drawer', '.tl-drawer[data-tl-state~="open"]'), /transform:\s*none/);
  assert.match(decl('drawer', '.tl-drawer--container'), /z-index:\s*var\(--tl-layer-raised\)/);
  assert.match(decl('drawer', '.tl-drawer--narrow'), /width:\s*var\(--tl-size-drawer-narrow\)/);
  assert.match(decl('drawer', '.tl-drawer--bottom.tl-drawer--wide'), /height:\s*var\(--tl-size-drawer-wide\)/);
});
```

- [ ] **Step 2: Laufen lassen, scheitert** (ENOENT `drawer.css`).

- [ ] **Step 3: `drawer.css`:**

```css
/* Drawer — Spec 2026-10-13 Welle 4a §4. Eine Schublade vom Rand des Viewports oder des Behälters, in dem sie steht
   (tl-drawer--container). Ohne Scrim ist sie nicht modal: Fokus hinein und zurück, keine Falle. Mit Scrim (die
   Schublade steht dann in einem .tl-dialog) ist sie modal: Falle, role="dialog", aria-modal — die mobile Sidebar in
   Welle 4b. Die Seiten heißen nach der Schreibrichtung (start, end), die Breiten sind Maße. */

.tl-drawer {
  position: fixed;
  z-index: var(--tl-layer-overlay);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background: var(--tl-surface-overlay);
  box-shadow: var(--tl-shadow-dialog);
  color: var(--tl-text-primary);
  transition: transform var(--tl-duration-base) var(--tl-easing-exit);
}
.tl-drawer[hidden] { display: none; }

.tl-drawer--start,
.tl-drawer--end {
  top: 0;
  bottom: 0;
  max-width: 100%;
}

.tl-drawer--start { inset-inline-start: 0; transform: translateX(-100%); }
.tl-drawer--end { inset-inline-end: 0; transform: translateX(100%); }

.tl-drawer--bottom {
  left: 0;
  right: 0;
  bottom: 0;
  max-height: 100%;
  transform: translateY(100%);
}

/* Offen: an seinem Platz, kommend mit der Eingangskurve. */
.tl-drawer[data-tl-state~="open"] {
  transform: none;
  transition-timing-function: var(--tl-easing-entrance);
}

.tl-drawer--narrow { width: var(--tl-size-drawer-narrow); }
.tl-drawer--medium { width: var(--tl-size-drawer-medium); }
.tl-drawer--wide { width: var(--tl-size-drawer-wide); }
.tl-drawer--bottom.tl-drawer--narrow { width: auto; height: var(--tl-size-drawer-narrow); }
.tl-drawer--bottom.tl-drawer--medium { width: auto; height: var(--tl-size-drawer-medium); }
.tl-drawer--bottom.tl-drawer--wide { width: auto; height: var(--tl-size-drawer-wide); }

/* Im Behälter verankert: deckt nur ihn, liegt über seinem Inhalt und unter Dialog und Snackbar. Die Grenzen
   (max-width/-height 100 %) gelten dann gegen den Behälter. */
.tl-drawer--container {
  position: absolute;
  z-index: var(--tl-layer-raised);
}

.tl-drawer__body {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
  overflow: auto;
  /* Wischen im Drawer läuft nicht in die Seite weiter. Der Innenabstand bleibt wie bisher; ob der Drawer bündig wird
     wie der Dialog-Körper, prüft 4b mit Panel und Card. */
  overscroll-behavior: contain;
  padding: var(--tl-space-md);
}
```

- [ ] **Step 4: Vertrag `drawer.contract.md`:**

```markdown
# Vertrag: Drawer

Eine Schublade vom Rand: Detail zu einer Liste, Navigation auf kleinen Bildschirmen. TopLogic garantiert
Zugänglichkeit und Verhalten, nicht das Aussehen.

## Zustand

Das Control ist `TLDrawer` (`ReactDrawerControl`).

| Schlüssel | Typ | Bedeutung |
|---|---|---|
| `open` | boolean | Offen: `data-tl-state~="open"`. |
| `position` | `left` \| `right` \| `bottom` | Rand; gerendert als `tl-drawer--start`, `--end`, `--bottom`. |
| `size` | `narrow` \| `medium` \| `wide` | Maß. |
| `anchor` | `viewport` \| `container` | Am Viewport oder im Behälter (`tl-drawer--container`). |
| `width` | number, optional | Ausdehnung in px statt des Maßes (Breite, unten Höhe). |
| `title` | string, optional | Mit Titel steht ein `tl-titlebar` mit Schließen-Knopf. |

## Aktionen

| Aktion | Wann |
|---|---|
| `close` | Escape, Schließen-Knopf |

## Verhalten

- **Ohne Scrim (nicht modal):** beim Öffnen geht der Fokus auf das erste fokussierbare Element, sonst auf die
  Schublade; keine Falle, die Seite bleibt bedienbar; beim Schließen kehrt der Fokus zurück. Geschlossen ist sie
  `inert`.
- **Mit Scrim (modal):** sie steht in einem `tl-dialog`, trägt `role="dialog"` und `aria-modal="true"`, der Fokus ist
  gefangen, ein Klick auf den Scrim schließt.
- Escape schließt.

## Tokens

| Teil | Token |
|---|---|
| Fläche | `--tl-surface-overlay`, Schatten `--tl-shadow-dialog` |
| Ebene | `--tl-layer-overlay`; im Behälter `--tl-layer-raised` |
| Maße | `--tl-size-drawer-narrow`, `--tl-size-drawer-medium`, `--tl-size-drawer-wide` |
| Bewegung | `transform` über `--tl-duration-base`, kommend `--tl-easing-entrance`, gehend `--tl-easing-exit` |
| Kopf | `tl-titlebar` |

## Attribute

| Attribut | Wann |
|---|---|
| `tl-drawer` + `tl-drawer--start` \| `--end` \| `--bottom` + `tl-drawer--narrow` \| `--medium` \| `--wide` | immer, an `aside` |
| `tl-drawer--container` | im Behälter verankert |
| `data-tl-state~="open"` | offen |
| `inert` | geschlossen |
| `aria-labelledby` | mit Titel, auf `tl-titlebar__title` |
| `role="dialog"` + `aria-modal="true"` | nur mit Scrim |
| `tl-drawer__body` | Inhalt |

## Konformität

Ein Drawer besteht den Vertrag, wenn er geschlossen `inert` ist, ohne Scrim den Fokus nicht fängt und zurückgibt, mit
Scrim modal ist, Escape schließt und im Klassen-Gate keine Klasse ohne `tl-`-Präfix bleibt.
```

- [ ] **Step 5: Specimen `drawer.spec.html`** — Kopf wie `alert.spec.html` (Titel „Drawer“); Bühne wie im Dialog:

```html
<style>
  .stage { position: relative; height: 20rem; overflow: hidden; transform: translateZ(0); background: var(--tl-surface-base); }
  .stage .tl-dialog { position: absolute; }
  .stage p { margin: var(--tl-space-md); }
</style>
…
  <section class="specimen__panel"><p class="tl-type-heading-sm">Ende, mittel, offen, ohne Scrim</p>
    <div class="stage"><p class="tl-type-body">Die Seite bleibt bedienbar.</p>
      <aside class="tl-drawer tl-drawer--end tl-drawer--medium tl-drawer--container" data-tl-state="open" aria-labelledby="dr1-title" tabindex="-1">
        <div class="tl-titlebar">
          <h2 class="tl-titlebar__title tl-type-heading-sm" id="dr1-title">Details</h2>
          <button type="button" class="tl-button tl-button--ghost tl-button--sm tl-button--icon" aria-label="Schließen" data-tooltip="text:Schließen"><i class="tl-icon-sm bi bi-x-lg tl-button__icon" aria-hidden="true"></i></button>
        </div>
        <div class="tl-drawer__body"><p class="tl-type-body">Inhalt.</p></div>
      </aside>
    </div>
  </section>
  <section class="specimen__panel"><p class="tl-type-heading-sm">Anfang, schmal, offen, mit Scrim (modal)</p>
    <div class="stage">
      <div class="tl-dialog">
        <aside class="tl-drawer tl-drawer--start tl-drawer--narrow tl-drawer--container" data-tl-state="open" role="dialog" aria-modal="true" aria-labelledby="dr2-title" tabindex="-1">
          <div class="tl-titlebar"><h2 class="tl-titlebar__title tl-type-heading-sm" id="dr2-title">Navigation</h2></div>
          <div class="tl-drawer__body"><p class="tl-type-body">Mobile Sidebar (4b).</p></div>
        </aside>
      </div>
    </div>
  </section>
  <section class="specimen__panel"><p class="tl-type-heading-sm">Unten, schmal, offen</p>
    <div class="stage">
      <aside class="tl-drawer tl-drawer--bottom tl-drawer--narrow tl-drawer--container" data-tl-state="open" tabindex="-1">
        <div class="tl-drawer__body"><p class="tl-type-body">Ohne Titel, ohne Kopf.</p></div>
      </aside>
    </div>
  </section>
```

- [ ] **Step 6: Erzeugen, Lint, Tests, Veröffentlichen** — wie Task 2 Step 9; grün.
- [ ] **Step 7: Commit (Paket)**

```bash
git add design-system/src/components/drawer design-system/dist design-system/test/overlays.test.mjs
git commit -m "Ticket #29836: Drawer im Paket -- Seiten start/end/bottom, Maße als Tokens, offen über data-tl-state, im Behälter auf raised; mit Scrim modal

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Paket — Snackbar, NoticeBar, Alert-Vertrag, Verträge-Test, `skalen.md`

**Files:**
- Create: `design-system/src/components/snackbar/snackbar.css`, `snackbar.contract.md`, `snackbar.spec.html`
- Create: `design-system/src/components/notice-bar/notice-bar.css`, `notice-bar.contract.md`, `notice-bar.spec.html`
- Modify: `design-system/src/components/alert/alert.contract.md`, `design-system/test/overlays.test.mjs`
- Create: `design-system/test/contracts-4a.test.mjs`

**Interfaces:**
- Consumes: `tl-alert` (Fläche, Linie, Rolle, `__body`, `__title`, `__message`, `__close`).
- Produces (Task 8 rendert): `div.tl-alert.tl-snackbar[data-tl-role][data-tl-state~="exiting"]`,
  `div.tl-alert.tl-notice-bar[data-tl-role]` mit `tl-notice-bar__countdown`.

- [ ] **Step 1: Failing tests** — an `overlays.test.mjs` anhängen:

```js
test('tl-snackbar: schwebt unten mittig auf der Toast-Ebene, Schatten drag, steigt und blendet mit Tokens', () => {
  const s = decl('snackbar', '.tl-snackbar');
  assert.match(s, /position:\s*fixed/);
  assert.match(s, /z-index:\s*var\(--tl-layer-toast\)/);
  assert.match(s, /bottom:\s*var\(--tl-space-md\)/);
  assert.match(s, /margin-inline:\s*auto/);
  assert.match(s, /max-width:\s*min\(var\(--tl-size-toast-max\)/);
  assert.match(s, /box-shadow:\s*var\(--tl-shadow-drag\)/);
  assert.match(s, /animation:\s*tl-snackbar-in var\(--tl-duration-base\) var\(--tl-easing-entrance\)/);
  assert.match(decl('snackbar', '.tl-snackbar[data-tl-state~="exiting"]'), /animation:\s*tl-snackbar-out var\(--tl-duration-base\) var\(--tl-easing-exit\) forwards/);
  assert.match(decl('snackbar', '.tl-snackbar .tl-alert__message'), /white-space:\s*normal/);
});

test('tl-notice-bar: Balken ohne Ecke, Linie nur unten und am Anfang, klickbar zeigt den Zeiger', () => {
  const n = decl('notice-bar', '.tl-notice-bar');
  assert.match(n, /border-radius:\s*0/);
  assert.match(n, /border-block-start-width:\s*0/);
  assert.match(n, /border-inline-end-width:\s*0/);
  assert.match(decl('notice-bar', '.tl-notice-bar[role="button"]'), /cursor:\s*pointer/);
  assert.match(decl('notice-bar', '.tl-notice-bar__countdown'), /white-space:\s*nowrap/);
});

test('keine Farbe, kein Literal: Snackbar und NoticeBar lesen ihre Farben nur aus tl-alert', () => {
  for (const d of ['snackbar', 'notice-bar']) {
    const css = readGenerated(d, `${d}.css`).replace(/\/\*[\s\S]*?\*\//g, '');
    assert.doesNotMatch(css, /--tl-(status|surface|text)-/, d);
  }
});
```

  `design-system/test/contracts-4a.test.mjs` anlegen:

```js
// Die Verträge der Welle 4a nennen ihre Pflichtbegriffe; die neuen Specimen bestehen den Harness.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { missingInContract, specimenProblems } from './lib/component.mjs';
const datei = (d, f) => readFileSync(new URL(`../src/components/${d}/${f}`, import.meta.url), 'utf8');
const SOLL = {
  'dialog/dialog.contract.md': ['tl-dialog', 'tl-dialog__surface', 'role="dialog"', 'aria-modal="true"', 'aria-labelledby',
    'tl-titlebar__title', 'data-tl-state~="entering"', 'data-tl-state~="maximized"', 'tl-dialog__resize', 'data-tl-edge',
    '--tl-surface-scrim', '--tl-layer-overlay', '--tl-shadow-dialog', 'close', 'resize', 'resetSize'],
  'drawer/drawer.contract.md': ['tl-drawer', 'tl-drawer--start', 'tl-drawer--container', 'data-tl-state~="open"', 'inert',
    'role="dialog"', 'aria-modal="true"', '--tl-size-drawer-medium', '--tl-layer-raised', 'close'],
  'snackbar/snackbar.contract.md': ['tl-snackbar', 'tl-alert', 'data-tl-role', 'role="alert"', 'role="status"',
    'data-tl-state~="exiting"', '--tl-layer-toast', '--tl-shadow-drag', 'dismiss', 'generation'],
  'notice-bar/notice-bar.contract.md': ['tl-notice-bar', 'tl-alert', 'data-tl-role', 'role="button"', 'role="alert"',
    'tl-notice-bar__countdown', 'tl-nums', 'action', 'deadlinePassed'],
  'overlay/overlay.contract.md': ['tl-overlay', 'tl-overlay__base', 'tl-overlay__layer'],
  'titlebar/titlebar.contract.md': ['tl-titlebar', 'tl-titlebar__title', 'tl-titlebar__actions', '--tl-size-bar'],
  'alert/alert.contract.md': ['tl-snackbar', 'tl-notice-bar'],
};
for (const [file, names] of Object.entries(SOLL)) test(`${file} nennt ${names.length} Pflichtbegriffe`, () => {
  const [d, f] = file.split('/');
  assert.deepEqual(missingInContract(datei(d, f), names), []);
});
for (const name of ['dialog', 'drawer', 'snackbar', 'notice-bar', 'overlay'])
  test(`${name}.spec.html besteht den Specimen-Harness`, () => assert.deepEqual(specimenProblems(datei(name, `${name}.spec.html`)), []));
```

  **Wichtig:** `missingInContract` verlangt einen Backtick **unmittelbar** vor dem Begriff. Jeder Begriff aus `SOLL`
  muss in seinem Vertrag mindestens einmal als `` `Begriff`` (Code-Span, der genau mit ihm beginnt) stehen. Nach
  Step 3 und 4: `node --test test/contracts-4a.test.mjs` zeigt fehlende Begriffe einzeln.

- [ ] **Step 2: Laufen lassen, scheitert** — `node --test test/overlays.test.mjs test/contracts-4a.test.mjs` → FAIL
  (Dateien fehlen; `dialog`, `drawer`, `overlay`, `titlebar` sollten schon grün sein, sonst Verträge aus Task 2–4
  nachziehen).

- [ ] **Step 3: `snackbar.css`:**

```css
/* Snackbar — Spec 2026-10-13 Welle 4a §5, Konsolidierung Q7. Ein Alert mit eigener Hülle: Farbe, Linie, Titel, Text,
   Schließen-Knopf und Ansage kommen aus tl-alert (data-tl-role, role="alert" nur bei error); hier stehen Lage,
   Ebene, Schatten und Bewegung. Toast: Schatten und Rahmen (skalen.md) — der Rahmen ist die Linie der Bedeutung. */

.tl-snackbar {
  position: fixed;
  inset-inline: 0;
  bottom: var(--tl-space-md);
  z-index: var(--tl-layer-toast);
  box-sizing: border-box;
  width: fit-content;
  max-width: min(var(--tl-size-toast-max), calc(100% - 2 * var(--tl-space-md)));
  margin-inline: auto;
  box-shadow: var(--tl-shadow-drag);
  animation: tl-snackbar-in var(--tl-duration-base) var(--tl-easing-entrance);
}

.tl-snackbar[data-tl-state~="exiting"] {
  animation: tl-snackbar-out var(--tl-duration-base) var(--tl-easing-exit) forwards;
}

@keyframes tl-snackbar-in {
  from { opacity: 0; transform: translateY(var(--tl-space-sm)); }
  to { opacity: 1; transform: none; }
}

@keyframes tl-snackbar-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

/* Die Meldung kann HTML sein (CommandErrors: Titel und eine Liste der Einzelmeldungen); deren Umbrüche stehen im
   Markup, nicht im Text. */
.tl-snackbar .tl-alert__message {
  white-space: normal;
}

.tl-snackbar .tl-alert__message ul {
  margin: var(--tl-space-2xs) 0 0;
  padding-inline-start: var(--tl-space-lg);
}

.tl-snackbar .tl-alert__message li + li {
  margin-top: var(--tl-space-2xs);
}
```

- [ ] **Step 4: `notice-bar.css`:**

```css
/* NoticeBar — Spec 2026-10-13 Welle 4a §5, Konsolidierung Q7. Ein Alert als Balken über die volle Breite: ohne Ecke,
   Linie unten und am Zeilenanfang (die Linie der Bedeutung). Farbe, Ansage und Text aus tl-alert. Klickbar ist der
   Balken ein role="button"; den Ring gibt base.css jedem [tabindex]. */

.tl-notice-bar {
  border-radius: 0;
  border-block-start-width: 0;
  border-inline-end-width: 0;
}

.tl-notice-bar[role="button"] {
  cursor: pointer;
}

/* Der Countdown springt nicht, weil seine Ziffern gleich breit sind (tl-nums im Markup). */
.tl-notice-bar__countdown {
  white-space: nowrap;
}
```

- [ ] **Step 5: Verträge** — `snackbar.contract.md`:

```markdown
# Vertrag: Snackbar

Eine kurze Meldung unten über der Seite, die von selbst geht: „Gespeichert“, ein Fehler eines Befehls. Ein `tl-alert`
mit eigener Hülle: Bedeutung, Farbe und Ansage wie beim Alert, dazu Lage, Ebene, Schatten und Bewegung.

## Zustand

Das Control ist `TLSnackbar` (`ReactSnackbarControl`, `SnackbarStateJson`).

| Schlüssel | Typ | Bedeutung |
|---|---|---|
| `variant` | `info` \| `success` \| `warning` \| `error` | Bedeutung, gerendert als `data-tl-role`. |
| `message` / `content` | string / HTML | Text oder HTML (z. B. Titel `tl-alert__title` und Liste aus `CommandErrors`). |
| `duration` | number | ms bis zum Gehen; `0` bleibt stehen. |
| `visible` | boolean | Sichtbar. |
| `generation` | number | Fassung der Meldung; `dismiss` nennt sie. |

## Aktionen

| Aktion | Argument | Wann |
|---|---|---|
| `dismiss` | `generation` | nach der Dauer, oder Klick auf `tl-alert__close`, jeweils nach dem Ausblenden |

## Verhalten

- Zeigen hält die Meldung an; nach dem Verlassen geht sie nach kurzer Frist.
- Beim Gehen trägt sie `data-tl-state~="exiting"` für `--tl-duration-base`; das TSX liest die Dauer aus dem Token.
- Der Fokus bleibt, wo er ist; die Meldung wird angesagt: `role="alert"` bei `error`, sonst `role="status"`.

## Tokens

| Teil | Token |
|---|---|
| Fläche, Linie, Text, Knopf | aus `tl-alert` |
| Lage | unten mittig, Abstand `--tl-space-md`, höchstens `--tl-size-toast-max` breit |
| Ebene | `--tl-layer-toast` |
| Schatten | `--tl-shadow-drag` |
| Bewegung | `--tl-duration-base`, `--tl-easing-entrance`, `--tl-easing-exit` |

## Attribute

| Attribut | Wann |
|---|---|
| `tl-alert` + `tl-snackbar` + `data-tl-role` | immer |
| `role="alert"` | `error` |
| `role="status"` | `info`, `success`, `warning` |
| `data-tl-state~="exiting"` | während sie geht |

## Konformität

Eine Snackbar besteht den Vertrag, wenn sie den Alert-Vertrag erfüllt, Fehler sofort und alles andere höflich ansagt,
den Fokus nicht nimmt und im Klassen-Gate keine Klasse ohne `tl-`-Präfix bleibt.
```

  `notice-bar.contract.md`:

```markdown
# Vertrag: NoticeBar

Ein Hinweis der ganzen Anwendung als Balken über die volle Breite, z. B. eine angekündigte Wartung mit Countdown. Ein
`tl-alert` mit eigener Hülle.

## Zustand

Das Control ist `TLNoticeBar` (`ReactNoticeBarControl`).

| Schlüssel | Typ | Bedeutung |
|---|---|---|
| `severity` | `info` \| `warning` \| `error` | Bedeutung, gerendert als `data-tl-role`. |
| `text` | string | Der Hinweis. |
| `deadline`, `serverNow`, `leadMs`, `pingGraceMs` | number | Countdown gegen die Serverzeit, Vorlauf, Nachfrage nach Ablauf. |
| `actionLabel` | string, optional | Macht den Balken zum Knopf; das Label ist sein Tooltip. |

## Aktionen

| Aktion | Wann |
|---|---|
| `action` | Klick, Enter oder Leertaste auf den klickbaren Balken |
| `deadlinePassed` | einmal je Frist, nach Ablauf und Nachfrist |

## Verhalten

- Ohne Aktion: `role="alert"` bei `error`, sonst `role="status"`.
- Mit Aktion: `role="button"`, `tabindex="0"`, Enter und Leertaste lösen aus; der Ring kommt aus `base.css`.
- Der Countdown steht in `tl-notice-bar__countdown` mit `tl-nums` und `tl-type-body-strong`.

## Tokens

Aus `tl-alert`; der Balken hat keine Ecke und die Linie nur unten und am Zeilenanfang.

## Attribute

| Attribut | Wann |
|---|---|
| `tl-alert` + `tl-notice-bar` + `data-tl-role` | immer |
| `role="button"` + `tabindex="0"` + `aria-label` | mit Aktion |
| `role="alert"` / `role="status"` | ohne Aktion |
| `tl-notice-bar__countdown` | mit Frist |

## Konformität

Eine NoticeBar besteht den Vertrag, wenn sie den Alert-Vertrag erfüllt, klickbar mit der Tastatur bedienbar ist und
einen sichtbaren Ring hat, und im Klassen-Gate keine Klasse ohne `tl-`-Präfix bleibt.
```

  In `alert/alert.contract.md` hinter dem Absatz „Das Control ist `TLAlert` …“ einfügen:

```markdown
Zwei Controls tragen den Alert mit eigener Hülle (Welle 4a): `tl-snackbar` (schwebend, geht von selbst; Vertrag
`snackbar`) und `tl-notice-bar` (Balken über die volle Breite; Vertrag `notice-bar`). Für alle drei gilt dieselbe
Ansage-Regel: nur `error` ist `role="alert"`.
```

  In `button/button.contract.md` unter „Attribute“ eine Zeile ergänzen:
  `` | Kopfknopf | `tl-button--ghost tl-button--sm tl-button--icon` mit `ThemeIcon` in `tl-titlebar` (Maximieren, Schließen) und als `tl-alert__close`: 24 px (`--tl-size-control-sm`), `aria-label` und Tooltip Pflicht | ``
  und in `contracts-4a.test.mjs` `SOLL` um `'button/button.contract.md': ['tl-titlebar', '--tl-size-control-sm'],`
  erweitern.

- [ ] **Step 6: Specimen** — `snackbar.spec.html` (Titel „Snackbar“) mit Bühne wie im Dialog
  (`.stage { position: relative; height: 8rem; transform: translateZ(0); }`), vier Snackbars je Rolle
  übereinander in vier Bühnen, Beispiel `error`:

```html
<div class="stage">
  <div class="tl-alert tl-snackbar tl-type-body" data-tl-role="error" role="alert">
    <div class="tl-alert__body"><div class="tl-alert__message"><div class="tl-alert__title tl-type-body-strong">Speichern fehlgeschlagen</div><ul><li>Name fehlt.</li><li>Frist liegt in der Vergangenheit.</li></ul></div></div>
    <button type="button" class="tl-button tl-button--ghost tl-button--sm tl-button--icon tl-alert__close" aria-label="Schließen" data-tooltip="text:Schließen"><i class="tl-icon-sm bi bi-x-lg tl-button__icon" aria-hidden="true"></i></button>
  </div>
</div>
```

  dazu `success` („Gespeichert.“, `role="status"`), `warning`, `info`. `notice-bar.spec.html` (Titel „NoticeBar“) ohne
  Bühne, drei Balken:

```html
<div class="tl-alert tl-notice-bar tl-type-body" data-tl-role="warning" role="button" tabindex="0" aria-label="Wartung in 4:59 Jetzt abmelden">
  <div class="tl-alert__body"><div class="tl-alert__message">Wartung in <span class="tl-notice-bar__countdown tl-nums tl-type-body-strong">4:59</span></div></div>
</div>
```

  dazu `info` (`role="status"`) und `error` (`role="alert"`).

- [ ] **Step 7: `skalen.md` und Präsentation prüfen** — beide sind am 13.10. vor der Umsetzung nachgezogen
  (`skalen.md` „Welle 4: Gerüst und Overlays — Schnitt, Konsolidierung, 4a“ und der korrigierte Snackbar-Satz unter
  „Die Regel, wann welche Rolle gilt“; `praesentation.md` §10a drei Zeilen und §14 Welle 4). Nur ändern, was der Bau
  anders entschieden hat; sonst nichts tun.

- [ ] **Step 8: Erzeugen, Lint, Tests, Veröffentlichen** — wie Task 2 Step 9; alle grün.
- [ ] **Step 9: Commit (Paket)**

```bash
git add design-system   # enthält button.contract.md
git commit -m "Ticket #29836: Snackbar und NoticeBar als Alert mit Hülle, Verträge der Welle 4a

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Engine — Helfer in `bridge/`

**Files:**
- Modify: `react-src/bridge/tl-react-bridge.ts`, `react-src/bridge/transition.ts`, `react-src/bridge/token-px.ts`,
  `react-src/bridge/icons.ts`, `react-src/bridge-entry.ts`

**Interfaces:**
- Produces:
  - `EscapeToClose: React.FC<{ onClose: () => void }>` (aus `'tl-react-bridge'`).
  - `useFocusTrap(active, ref, mode = 'container', options: { trap?: boolean; preventScroll?: boolean } = {})`.
  - `useKeyedTransition(options)` mit `options = { keys, node, container } & ({ enterClass, exitClass } | { state: true })`;
    `state: true` schreibt die Wörter `entering`/`exiting` in `data-tl-state`.
  - `tokenMs(name: string, fallback: number): number`.
  - `ICON_CLOSE`, `ICON_MAXIMIZE`, `ICON_RESTORE` (aus `bridge/icons.ts`, über `export *`).

- [ ] **Step 1: `EscapeToClose`** — in `bridge/tl-react-bridge.ts` direkt vor `function useFocusTrap(` einfügen:

```ts
/**
 * Binds Escape to {@code onClose} in the enclosing keyboard scope.
 *
 * <p>A component, not a hook: a dialog or window opens its own scope with a
 * {@link KeyboardScopeProvider} and renders this as the provider's first child, so the binding lands
 * in that scope - a hook called by the same component would bind into the scope around it. Being the
 * first child, it is overridden by an explicit action bound to Escape that mounts later.</p>
 */
const EscapeToClose: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  useKeyboardBinding('ESCAPE', () => {
    onClose();
    return true;
  });
  return null;
};
```

  und `EscapeToClose,` in den `export { … }`-Block am Ende der Datei (neben `useFocusTrap,`) und in
  `bridge-entry.ts` in die Liste `from './bridge/tl-react-bridge'` (neben `useFocusTrap,`).

- [ ] **Step 2: `useFocusTrap` ohne Falle** — Signatur und Rumpf ändern:

```ts
 * @param options
 *        {@code trap: false} moves focus in and gives it back, but does not confine it - a surface that
 *        is not modal (a drawer without scrim). {@code preventScroll: true} moves focus in without
 *        scrolling, for a surface that slides in from outside the clipped box of its area.
 */
function useFocusTrap(
  active: boolean,
  ref: { current: HTMLElement | null },
  mode: 'field' | 'first' | 'container' = 'container',
  options: { trap?: boolean; preventScroll?: boolean } = {}
): void {
```

  im Effekt `const unpush = pushTrap(() => ref.current, preferredTarget);` ersetzen durch

```ts
    const unpush = options.trap === false ? () => {} : pushTrap(() => ref.current, preferredTarget);
```

  und `target.focus();` durch `target.focus({ preventScroll: options.preventScroll === true });`.

- [ ] **Step 3: `useKeyedTransition` mit Attribut** — in `bridge/transition.ts`:
  1. Die Schnittstelle aufteilen:

```ts
/** What a control displays: the keys, where each is shown, and where the copies of what left go. */
interface KeyedTransitionBase {
  /** (Doc der bisherigen Felder keys, node, container unverändert hierher verschieben.) */
  keys: readonly string[];
  node(key: string): HTMLElement | null;
  container(): HTMLElement | null;
}

/**
 * How the change is marked: by two classes (the wizard and the tile stack, until wave 4b), or by the
 * words `entering` and `exiting` in `data-tl-state` (`state: true`, the design system package).
 */
export type KeyedTransitionOptions = KeyedTransitionBase
  & ({ enterClass: string; exitClass: string } | { state: true });
```

  2. Hilfen über `snapshot` einfügen:

```ts
/** The attribute the package reads states from. */
const STATE_ATTR = 'data-tl-state';

/** How a change is marked on the DOM. */
interface Marks {
  enter: string;
  exit: string;
  add(element: HTMLElement, mark: string): void;
  remove(element: HTMLElement, mark: string): void;
}

const CLASS_MARKS = (enter: string, exit: string): Marks => ({
  enter,
  exit,
  add: (element, mark) => element.classList.add(mark),
  remove: (element, mark) => element.classList.remove(mark),
});

const STATE_MARKS: Marks = {
  enter: 'entering',
  exit: 'exiting',
  add: (element, mark) => {
    const words = (element.getAttribute(STATE_ATTR) ?? '').split(/\s+/).filter(Boolean);
    if (!words.includes(mark)) {
      words.push(mark);
    }
    element.setAttribute(STATE_ATTR, words.join(' '));
  },
  remove: (element, mark) => {
    const words = (element.getAttribute(STATE_ATTR) ?? '').split(/\s+/).filter((word) => word && word !== mark);
    if (words.length > 0) {
      element.setAttribute(STATE_ATTR, words.join(' '));
    } else {
      element.removeAttribute(STATE_ATTR);
    }
  },
};

function marksOf(options: KeyedTransitionOptions): Marks {
  return 'state' in options ? STATE_MARKS : CLASS_MARKS(options.enterClass, options.exitClass);
}
```

  3. `snapshot(element, enterClass, exitClass)` → `snapshot(element, marks: Marks)`, im Rumpf
     `copy.classList.remove(enterClass); copy.classList.add(exitClass);` → `marks.remove(copy, marks.enter);
     marks.add(copy, marks.exit);`.
  4. Im `useLayoutEffect`: `const { keys, node, container, enterClass, exitClass } = latest.current;` →
     `const { keys, node, container } = latest.current; const marks = marksOf(latest.current);`;
     `snapshot(left, enterClass, exitClass)` → `snapshot(left, marks)`;
     `arrived.classList.add(enterClass);` → `marks.add(arrived, marks.enter);`;
     `arrived.classList.remove(enterClass);` → `marks.remove(arrived, marks.enter);`.
  5. Kopfkommentar der Datei: „a class on the element that arrived“ → „a class or a word in data-tl-state on the
     element that arrived“; „the classes are the contract“ → „the marks are the contract“.

- [ ] **Step 4: `tokenMs`** — in `bridge/token-px.ts` nach `tokenPx` einfügen:

```ts
/**
 * The duration a token holds, in milliseconds - `150ms` or `0.15s` - read at the document root.
 *
 * @param name The custom property, e.g. `--tl-duration-base`.
 * @param fallback The value without a design system.
 */
export function tokenMs(name: string, fallback: number): number {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const n = parseFloat(value);
  if (isNaN(n)) {
    return fallback;
  }
  return value.endsWith('ms') ? n : value.endsWith('s') ? n * 1000 : n;
}
```

  und in `bridge-entry.ts` `export { tokenPx, useTokenPx } from './bridge/token-px';` →
  `export { tokenPx, tokenMs, useTokenPx } from './bridge/token-px';`.

- [ ] **Step 5: Icons** — in `bridge/icons.ts` am Ende:

```ts
/** Closes a surface: dialog, window, drawer, snackbar. */
export const ICON_CLOSE = 'css:fa-solid fa-xmark';

/** Maximizes a window. */
export const ICON_MAXIMIZE = 'css:fa-regular fa-window-maximize';

/** Gives a maximized window its size back. */
export const ICON_RESTORE = 'css:fa-regular fa-window-restore';
```

- [ ] **Step 6: Typprüfung**

Run: `cd _Working-Tree/tl8-wt-29584/com.top_logic.layout.react && npx tsc --noEmit -p tsconfig.json`
Expected: 0 Fehler — `TLDialogManager`, `TLWizard`, `TLTileStack` rufen den Hook weiter mit Klassen, das ist der
Klassen-Zweig der Union.

- [ ] **Step 7: Commit (Engine)**

```bash
git add react-src/bridge react-src/bridge-entry.ts
git commit -m "Ticket #29836: Design System wave 4a -- bridge helpers: shared EscapeToClose, focus without trap, keyed transition marking data-tl-state, tokenMs, close and window icons

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Engine — Dialog, Fenster, Dialog-Stapel

**Files:**
- Modify: `react-src/controls/TLDialog.tsx`, `TLDialogManager.tsx`, `TLWindow.tsx`
- Modify: `src/main/webapp/style/tlReactControls.css` (Blöcke TLDialog, TLDialogManager, TLWindow)
- Modify: `com.top_logic.layout.view/src/main/java/META-INF/tl-docs/view-layer/app-shell.md`
- Modify: `com.top_logic.demo.react/src/main/webapp/style/tl-demo-react.css`
- Modify: die Paketkopie im Worktree (aus Task 1–5)

**Interfaces:**
- Consumes: `EscapeToClose`, `useKeyedTransition({ …, state: true })`, `useTokenPx`, `ICON_CLOSE`, `ICON_MAXIMIZE`,
  `ICON_RESTORE` (Task 6); Klassen aus Task 2–3.

- [ ] **Step 1: `TLDialog.tsx`** ganz ersetzen:

```tsx
import {
  React, useTLState, useTLCommand, TLChild, KeyboardScopeProvider, EscapeToClose, FillBarrier, rootClassName,
} from 'tl-react-bridge';
import type { TLCellProps, DialogStateJson } from 'tl-react-bridge';

const { useCallback } = React;

/**
 * The scrim of a dialog (`tl-dialog` of the design system package) with the dialog's content, in
 * practice a {@code TLWindow} rendering the surface.
 *
 * State:
 * - open: boolean
 * - closeOnBackdrop: boolean  (default: true)
 * - closable: boolean  (default: true)
 * - child: ChildDescriptor
 *
 * Escape is bound in this dialog's scope; a window inside binds it in its own, inner scope first, so
 * this binding only fires for plain content.
 */
const TLDialog: React.FC<TLCellProps> = ({ controlId }) => {
  const state = useTLState<Partial<DialogStateJson>>();
  const sendCommand = useTLCommand();

  const open = state.open === true;
  const closeOnBackdrop = state.closeOnBackdrop !== false;
  // A dialog held open by ongoing work: neither Escape nor a click on the scrim dismisses it.
  const closable = state.closable !== false;
  const child = state.child;

  const handleClose = useCallback(() => {
    sendCommand('close');
  }, [sendCommand]);

  const handleScrimClick = useCallback((e: React.MouseEvent) => {
    if (closable && closeOnBackdrop && e.target === e.currentTarget) {
      handleClose();
    }
  }, [closable, closeOnBackdrop, handleClose]);

  if (!open) return null;

  return (
    <KeyboardScopeProvider>
      {closable && <EscapeToClose onClose={handleClose} />}
      <div id={controlId} className={rootClassName(state, 'tl-dialog')} onClick={handleScrimClick} tabIndex={-1}>
        <FillBarrier>
          <TLChild control={child} />
        </FillBarrier>
      </div>
    </KeyboardScopeProvider>
  );
};

export default TLDialog;
```

- [ ] **Step 2: `TLDialogManager.tsx`** — **Pflicht, sonst trifft das Engine-Gate die Kommentarzeilen 13/14:** im
  Kommentar die Sätze über `tlDialog__backdrop--entering`/`--exiting`
  ersetzen durch „the scrim of a dialog that opened carries `entering` in `data-tl-state` while it arrives, and a
  dialog that closed is held on screen as an inert copy of its scrim marked `exiting` while it leaves; the design
  system package animates both, an application may override it“. Im Hook die zwei Zeilen
  `enterClass: …, exitClass: …,` durch `state: true,` ersetzen. Die Wurzel:
  `className={rootClassName(state, 'tlDialogManager')}` → `className={rootClassName(state)}`.

- [ ] **Step 3: `TLWindow.tsx`** — Änderungen:
  1. Importe:

```tsx
import {
  React, useTLState, useTLCommand, TLChild, useI18N, KeyboardScopeProvider, EscapeToClose, useFocusTrap,
  FillBarrier, startPointerDrag, rootClassName, tooltipProps, ButtonDefaults, ThemeIcon, useTokenPx,
  ICON_CLOSE, ICON_MAXIMIZE, ICON_RESTORE,
} from 'tl-react-bridge';
import type { TLCellProps, WindowStateJson } from 'tl-react-bridge';
import { buttonClassName } from './button/buttonClassName';
```

  2. `VIEWPORT_MARGIN = 24` und die beiden Funktionen ersetzen:

```tsx
/**
 * The space a window keeps free towards each edge of the browser window before the stylesheet is
 * measured: the scrim's padding, `--tl-space-lg`.
 */
const DEFAULT_MARGIN = 24;

/** The largest width a window may take in a browser window of the given width. */
function maxWindowWidth(viewportWidth: number, margin: number): number {
  return Math.max(MIN_WIDTH, viewportWidth - 2 * margin);
}

/** The largest height a window may take in a browser window of the given height. */
function maxWindowHeight(viewportHeight: number, margin: number): number {
  return Math.max(MIN_HEIGHT, viewportHeight - 2 * margin);
}
```

  3. Die lokale `EscapeToClose` (Zeilen 41–51) löschen.
  4. Nach `const windowRef = useRef<HTMLDivElement>(null);` einfügen:

```tsx
  // The margin the scrim keeps (--tl-space-lg); read for resizing and for checking a remembered size.
  const margin = useTokenPx(windowRef, '--tl-space-lg', DEFAULT_MARGIN);
  const marginRef = useRef(margin);
  marginRef.current = margin;
```

     `viewport`/`customFits` stehen **vor** `windowRef`: die Zeilen `const viewport = …` bis `… maxWindowHeight(viewport.height);`
     hinter diesen Block verschieben und dort `maxWindowWidth(viewport.width, margin)` /
     `maxWindowHeight(viewport.height, margin)` schreiben.
  5. Im Resize-`onMove`: `maxWindowWidth(window.innerWidth)` → `maxWindowWidth(window.innerWidth, marginRef.current)`,
     ebenso Höhe.
  6. `style`: den Zweig `maximized ? { position: 'absolute' … borderRadius: 0 }` durch `maximized ? {}` ersetzen und
     die Zeile `...(localHeight != null ? { maxHeight: '100vh' } : {}),` samt ihrem Kommentar löschen (die Fläche hält
     `max-height: 100%` im Scrim; eine gezogene Höhe passt schon hinein).
  7. JSX ab `return (` ersetzen:

```tsx
  return (
    <KeyboardScopeProvider modal>
      {closable && <EscapeToClose onClose={handleClose} />}
      <div
        id={controlId}
        className={rootClassName(state, 'tl-dialog__surface')}
        style={style}
        ref={windowRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-tl-state={maximized ? 'maximized' : undefined}
      >
        <div
          className="tl-titlebar"
          onPointerDown={maximized ? undefined : handleTitlePointerDown}
          onDoubleClick={resizable ? handleToggleMaximize : undefined}
        >
          <h2 className="tl-titlebar__title tl-type-heading-sm" id={titleId}>{title}</h2>
          {!!toolbar && (
            <div className="tl-titlebar__actions">
              <TLChild control={toolbar} />
            </div>
          )}
          {/* Maximizing only makes sense for resizable windows; fixed-size dialogs (e.g. login) omit it. */}
          {resizable && (
            <button
              type="button"
              className={buttonClassName({ appearance: 'ghost', small: true, icon: true })}
              onClick={handleToggleMaximize}
              aria-label={maximizeLabel}
              {...tooltipProps(maximizeLabel)}
            >
              <ThemeIcon encoded={maximized ? ICON_RESTORE : ICON_MAXIMIZE} className="tl-button__icon tl-icon-sm" />
            </button>
          )}
          <button
            type="button"
            className={buttonClassName({ appearance: 'ghost', small: true, icon: true })}
            onClick={handleClose}
            disabled={!closable}
            aria-label={i18n['js.window.close']}
            {...tooltipProps(i18n['js.window.close'])}
          >
            <ThemeIcon encoded={ICON_CLOSE} className="tl-button__icon tl-icon-sm" />
          </button>
        </div>
        <div className="tl-dialog__body">
          <FillBarrier>
            <TLChild control={child} />
          </FillBarrier>
        </div>
        {!!footer && (
          <ButtonDefaults appearance="secondary">
            <div className="tl-dialog__footer">
              <TLChild control={footer} />
            </div>
          </ButtonDefaults>
        )}
        {resizable && !maximized && RESIZE_HANDLES.map(dir => (
          <div
            key={dir}
            className="tl-dialog__resize"
            data-tl-edge={dir}
            onPointerDown={(e) => handleResizePointerDown(dir, e)}
            onDoubleClick={handleResetSize}
          />
        ))}
      </div>
    </KeyboardScopeProvider>
  );
```

  8. Kopfkommentar „The footer … the stylesheet hides it.“ bleibt (der Fuß ist leer verborgen, `:empty`).
     `useKeyboardBinding` aus dem Import entfernen, falls unbenutzt.

- [ ] **Step 4: Alte Blöcke streichen** — in `tlReactControls.css` die Blöcke
  `/* --- TLDialog (overlay-only) … */`, `/* --- TLDialogManager … */` und `/* --- TLWindow … */` vollständig löschen
  (je von der Überschrift bis vor die nächste Überschrift `/* --- `).

- [ ] **Step 5: Doku und Demo**
  - `app-shell.md`, Tabelle „Transitions“: Zeile `| dialog | \`tlDialog__backdrop--entering\` | \`tlDialog__backdrop--exiting\` | — |`
    → `| dialog | \`.tl-dialog[data-tl-state~="entering"]\` | \`.tl-dialog[data-tl-state~="exiting"]\` | — |`;
    Satz „The classes are the API; the engine ships a default animation for the wizard only.“ →
    „The classes and states are the API; the engine ships a default animation for the wizard, and the design system
    package one for the dialog (a fade over `--tl-duration-base`), which an application overrides with rules on the
    same state.“; in „What leaves is a copy“: „`pointer-events: none` for the dialog backdrop“ → „`pointer-events: none`
    for the dialog scrim (`tl-dialog`, in the package)“; im Absatz „One hook does this for all three“: „and the two
    class names“ → „and how to mark: two class names, or `state: true` for the words `entering` and `exiting` in
    `data-tl-state`“; „An example stylesheet“: „a 150ms opacity fade for the dialog backdrop and“ streichen.
  - `tl-demo-react.css`: den Kommentarblock „Dialogs and drill-down frames …“ auf „Drill-down frames of this application
    fade and slide …“ kürzen und die vier Regeln `.tlDialog__backdrop--entering`, `.tlDialog__backdrop--exiting`,
    `@keyframes tlDemoDialogIn`, `@keyframes tlDemoDialogOut` löschen.

- [ ] **Step 6: Typprüfung und Build**

```bash
cd _Working-Tree/tl8-wt-29584/com.top_logic.layout.react
npx tsc --noEmit -p tsconfig.json
npx vite build --config vite.config.bridge.ts && npx vite build --config vite.config.controls.ts
grep -n 'tlDialog\|tlWindow' react-src -r src/main/webapp/style/tlReactControls.css | grep -v '^react-src/controls/TLPhotoCapture'
```

Expected: `tsc` 0 Fehler, beide Builds grün, `grep` leer. (Vite hier nur als Prüfung; die gebauten Bundles sind
ignoriert.)

- [ ] **Step 7: Commit (Engine)**

```bash
git add -A react-src src/main/webapp ../com.top_logic.layout.view/src/main/java/META-INF/tl-docs/view-layer/app-shell.md ../com.top_logic.demo.react/src/main/webapp/style/tl-demo-react.css
git commit -m "Ticket #29836: Design System wave 4a -- dialog, window and dialog stack read tl-dialog and tl-titlebar: scrim without blur, 24px header buttons with theme icons, maximized and opening/closing as data-tl-state, margins from --tl-space-lg; old TLDialog, TLDialogManager and TLWindow blocks cut

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Engine — Drawer, Snackbar, NoticeBar, Overlay, Fotoaufnahme

**Files:**
- Modify: `react-src/controls/TLDrawer.tsx`, `TLSnackbar.tsx`, `TLNoticeBar.tsx`, `TLOverlay.tsx`, `TLPhotoCapture.tsx`
- Modify: `src/main/java/com/top_logic/layout/react/control/CommandErrors.java`
- Modify: `src/main/webapp/style/tlReactControls.css`
- Modify: `com.top_logic.layout.view/src/main/java/META-INF/tl-docs/view-layer/display.md`

**Interfaces:**
- Consumes: `useFocusTrap(…, { trap: false, preventScroll: true })`, `tokenMs`, `ICON_CLOSE` (Task 6); Klassen aus
  Task 2, 4, 5.

- [ ] **Step 1: `TLDrawer.tsx`** — Importe: `firstFocusable` raus, `useFocusTrap`, `ThemeIcon`, `ICON_CLOSE` rein,
  `import { buttonClassName } from './button/buttonClassName';`; `const { useCallback, useEffect, useRef } = React;` →
  `const { useCallback, useRef } = React;`. Den `useEffect` (Fokus hinein und zurück, Zeilen
  51–73) und `restoreRef` ersetzen durch:

```tsx
  // Opening hands the keyboard to the drawer, closing gives it back to wherever it came from (typically
  // the list the drawer details). Without a trap: what lies underneath stays reachable. Without
  // scrolling: the drawer is still parked outside the clipped box of its area while it slides in.
  useFocusTrap(open, rootRef, 'first', { trap: false, preventScroll: true });
```

  Klassen und JSX:

```tsx
  const side = position === 'left' ? 'start' : position === 'bottom' ? 'bottom' : 'end';
  const className = [
    'tl-drawer',
    `tl-drawer--${side}`,
    `tl-drawer--${size}`,
    anchor === 'container' ? 'tl-drawer--container' : '',
  ].filter(Boolean).join(' ');
  const titleId = controlId + '-title';
  …
    <aside
      id={controlId}
      className={rootClassName(state, className)}
      data-tl-state={open ? 'open' : undefined}
      inert={!open}
      aria-labelledby={title !== null ? titleId : undefined}
      tabIndex={-1}
      ref={rootRef}
      style={style}
    >
      {title !== null && (
        <div className="tl-titlebar">
          <h2 className="tl-titlebar__title tl-type-heading-sm" id={titleId}>{title}</h2>
          <button
            type="button"
            className={buttonClassName({ appearance: 'ghost', small: true, icon: true })}
            onClick={handleClose}
            aria-label={i18n['js.drawer.close']}
            {...tooltipProps(i18n['js.drawer.close'])}
          >
            <ThemeIcon encoded={ICON_CLOSE} className="tl-button__icon tl-icon-sm" />
          </button>
        </div>
      )}
      <div className="tl-drawer__body">
```

  `rootRef` bleibt `useRef<HTMLElement | null>(null)`. Kommentar „the stylesheet caps both at the extent of the area“
  bleibt richtig.

- [ ] **Step 2: `TLSnackbar.tsx`** — Importe ergänzen um `ThemeIcon, tokenMs, ICON_CLOSE`. `FADEOUT_MS = 200` ersetzen:

```tsx
/** The fade-out before the dismiss is sent: the package animates it over --tl-duration-base. */
const FADEOUT_TOKEN = '--tl-duration-base';

/** The fade-out without the design system. */
const FADEOUT_FALLBACK_MS = 150;
```

  in `handleDismiss` `}, FADEOUT_MS);` → `}, tokenMs(FADEOUT_TOKEN, FADEOUT_FALLBACK_MS));`. JSX ab `return (`:

```tsx
  return (
    <div id={controlId}
      className={rootClassName(state, 'tl-alert tl-snackbar tl-type-body')}
      data-tl-role={variant}
      data-tl-state={exiting ? 'exiting' : undefined}
      role={variant === 'error' ? 'alert' : 'status'}
      onMouseEnter={() => { wasHovered.current = true; setHovered(true); }}
      onMouseLeave={() => setHovered(false)}>
      <div className="tl-alert__body">
        {content
          ? <div className="tl-alert__message" dangerouslySetInnerHTML={{ __html: content }} />
          : <div className="tl-alert__message">{message}</div>
        }
      </div>
      <button type="button"
        className={buttonClassName({ appearance: 'ghost', small: true, icon: true, extra: 'tl-alert__close' })}
        onClick={handleDismiss}
        aria-label={i18n['js.snackbar.dismiss']}
        {...tooltipProps(i18n['js.snackbar.dismiss'])}>
        <ThemeIcon encoded={ICON_CLOSE} className="tl-button__icon tl-icon-sm" />
      </button>
    </div>
  );
```

  Kommentar am `FADEOUT_AFTER_HOVER_MS` bleibt.

- [ ] **Step 3: `CommandErrors.java`** — Konstante und JavaDoc:

```java
	/**
	 * CSS classes of the summary line of a command-error message, separating it from the detail
	 * messages listed below it: the title of the alert the snackbar is (design system package).
	 */
	private static final String CSS_SNACKBAR_TITLE = "tl-alert__title tl-type-body-strong";
```

- [ ] **Step 4: `TLNoticeBar.tsx`** — JSX ab `return (`:

```tsx
  const role = clickable ? 'button' : severity === 'error' ? 'alert' : 'status';

  return (
    <div id={controlId}
      className={rootClassName(state, 'tl-alert tl-notice-bar tl-type-body')}
      data-tl-role={severity}
      role={role}
      tabIndex={clickable ? 0 : undefined}
      {...tooltipProps(actionLabel)}
      aria-label={clickable ? `${text} ${actionLabel}` : undefined}
      onClick={clickable ? handleAction : undefined}
      onKeyDown={clickable
        ? (event: React.KeyboardEvent) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              handleAction();
            }
          }
        : undefined}>
      <div className="tl-alert__body">
        <div className="tl-alert__message">
          {text}
          {remaining !== null && <> <span className="tl-notice-bar__countdown tl-nums tl-type-body-strong">{remaining}</span></>}
        </div>
      </div>
    </div>
  );
```

  (`aria-live="polite"` entfällt: `role="status"` bringt es mit, `role="alert"` ist sofort.)

- [ ] **Step 5: `TLOverlay.tsx`** — `'tlOverlay'` → `'tl-overlay'`, `"tlOverlay__base"` → `"tl-overlay__base"`,
  `['tlOverlay__layer', \`tlOverlay__layer--${layer.anchor}\`, …]` → `['tl-overlay__layer', \`tl-overlay__layer--${layer.anchor}\`, …]`.

- [ ] **Step 6: `TLPhotoCapture.tsx`** — Scrim, Fokus, Escape; die Kamera-Knöpfe bleiben (Welle 5).
  1. Import ergänzen um `useFocusTrap`.
  2. Den Effekt „Focus overlay and lock body scroll when overlay is open.“ (mit `overlayRef.current?.focus()` und
     `document.body.style.overflow`) ersetzen durch:

```tsx
  // The camera is a modal surface: focus moves in, stays in, and returns to the camera button.
  useFocusTrap(localStatus === 'overlayOpen', overlayRef, 'first');
```

  3. Das Overlay-Markup ersetzen (Inhalt von `tlPhotoCapture__overlayContent` unverändert):

```tsx
      {localStatus === 'overlayOpen' && (
        <div className="tl-dialog" onClick={(e) => { if (e.target === e.currentTarget) closeOverlay(); }}>
          <div
            ref={overlayRef}
            className="tlPhotoCapture__overlayContent"
            role="dialog"
            aria-modal="true"
            aria-label={cameraLabel}
            tabIndex={-1}
          >
            {/* video und tlPhotoCapture__overlayToolbar wie bisher */}
          </div>
        </div>
      )}
```

     `cameraLabel` ist vor dem `return` definiert (Zeile „const cameraLabel =“); steht es erst danach, die Definition
     nach oben ziehen.
  4. In `tlReactControls.css` (Block TLPhotoCapture) die Regeln `.tlPhotoCapture__overlay { … }` und
     `.tlPhotoCapture__overlayBackdrop { … }` samt Kommentar „/* Fullscreen overlay */“ löschen. Die Regeln für
     `__overlayContent`, `__overlayVideo`, `__overlayToolbar` und die Knöpfe bleiben.

- [ ] **Step 7: Alte Blöcke streichen** — in `tlReactControls.css`:
  1. Die Regel `.tlAppShell .tl-breadcrumb { … }` (3 Zeilen, steht am Ende des Blocks TLNoticeBar) ans Ende des Blocks
     `/* --- TLAppShell` verschieben (vor die Überschrift von TLNoticeBar), Kommentar unverändert.
  2. Die Blöcke `/* --- TLOverlay`, `/* --- TLDrawer`, `/* --- TLSnackbar`, `/* --- TLNoticeBar (system-wide notice)`
     vollständig löschen.

- [ ] **Step 8: `display.md`** — Zeile 60: „(`.tlOverlay__layer` is `pointer-events: none`, its content `auto`)“ →
  „(`.tl-overlay__layer` is `pointer-events: none`, its content `auto`)“; Zeile 92: „`.tlOverlay` / `.tlOverlay__layer` /
  `.tlOverlay__layer--<anchor>`“ → „`.tl-overlay` / `.tl-overlay__layer` / `.tl-overlay__layer--<anchor>` (design
  system, `overlay.css`)“.

- [ ] **Step 9: Typprüfung, Build, Suche**

```bash
cd _Working-Tree/tl8-wt-29584/com.top_logic.layout.react
npx tsc --noEmit -p tsconfig.json
npx vite build --config vite.config.bridge.ts && npx vite build --config vite.config.controls.ts
cd .. && git grep -n -P '\btl(Dialog|DialogManager|Window|Drawer|Snackbar|NoticeBar|Overlay)(__|--|\b)|\btlPhotoCapture__overlay(Backdrop)?\b' -- ':!docs/' ':!*.jar'
```

Expected: 0 Fehler, Builds grün, `git grep` leer (React-Modulnamen wie `TLWindow` treffen nicht: großes `TL`;
`-P`, weil `git grep -E` auf macOS `\b` nicht kennt; `docs/` hält Pläne der Engine mit alten Namen).

- [ ] **Step 10: Commit (Engine)**

```bash
git add -A com.top_logic.layout.react/react-src com.top_logic.layout.react/src com.top_logic.layout.view/src/main/java/META-INF/tl-docs/view-layer/display.md
git commit -m "Ticket #29836: Design System wave 4a -- drawer, snackbar, notice bar, overlay and the camera overlay read the package: drawer start/end with inert and focus without trap, snackbar and notice bar as alerts (only an error interrupts), overlay classes tl-overlay; old blocks cut

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Gates gesamt — Ratsche, Engine-Gate, Maven, Messages, Doku

**Files:**
- Modify: `design-system/test/ratchet.json`, `design-system/test/engine-classes.test.mjs`
- Modify: `docs/migration/altlast.md`, `STATUS.md`
- Trac #29836 (Beschreibung: `== Migration ==`, Keyword `RequiresMigration`)

- [ ] **Step 1: Engine-Gate erweitern** — in `design-system/test/engine-classes.test.mjs` anhängen:

```js
// Welle 4a (#29836): keine alte Overlay-Klasse mehr — im TSX jedes Moduls, im alten Stylesheet, in den Java-Quellen,
// den Entwickler-Artikeln (tl-docs) und im Stylesheet der Demo. Modulnamen (TLWindow) treffen nicht: großes TL.
const ALT_4A = /\btl(Dialog|DialogManager|Window|Drawer|Snackbar|NoticeBar|Overlay)(__|--|\b)|\btlPhotoCapture__overlay(Backdrop)?\b/;

function* tree(dir, pattern) {
  if (!existsSync(dir)) return;
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) yield* tree(p, pattern);
    else if (pattern.test(f)) yield p;
  }
}

test('keine alte Klasse der Welle 4a in react-src, Stylesheets, Java, tl-docs und Views', { skip: !existsSync(M) && 'kein Worktree' }, () => {
  const quellen = [
    ...reactSources(),
    join(M, 'src/main/webapp/style/tlReactControls.css'),
    join(WT, 'com.top_logic.demo.react/src/main/webapp/style/tl-demo-react.css'),
    ...tree(join(M, 'src/main/java'), /\.java$/),
    ...tree(join(WT, 'com.top_logic.layout.view/src/main/java/META-INF/tl-docs'), /\.md$/),
    ...tree(join(WT, 'com.top_logic.demo.react/src/main/webapp'), /\.view\.xml$/),
    ...tree(join(WT, 'com.top_logic.layout.view/src/main/webapp'), /\.view\.xml$/),
  ];
  const hits = [];
  for (const p of quellen) readFileSync(p, 'utf8').split('\n').forEach((line, i) => { if (ALT_4A.test(line)) hits.push(`${p.slice(WT.length + 1)}:${i + 1}`); });
  assert.deepEqual(hits, []);
});
```

- [ ] **Step 2: Ratsche** — `node tools/inventory.mjs` laufen lassen und `test/ratchet.json` nachziehen:
  - aus `blocks` streichen: `TLOverlay`, `TLDialog (overlay-only)`, `TLDialogManager`, `TLWindow`, `TLDrawer`,
    `TLSnackbar`, `TLNoticeBar (system-wide notice)`;
  - `TLPhotoCapture` und `TLAppShell` auf die gemessenen Zahlen (Plan-Review, Nachbildung: TLPhotoCapture 242→224,
    TLAppShell 33→37 — Regel und Leerzeile);
  - `literals` auf die gemessenen Zahlen (Nachbildung: color 74→68, fontSize 41, duration 32→29, zIndex 15→14,
    outlineNone 16→13);
  - `lines` = Summe der Budgets = gemessen (Nachbildung: 4010);
  - `foreignTl` ohne `--tlSnackbar-bg`, `--tlSnackbar-fg`;
  - Vermerk an `_blocks` anhängen: „13.10. Welle 4a (#29836): TLOverlay, TLDialog (overlay-only), TLDialogManager,
    TLWindow, TLDrawer, TLSnackbar, TLNoticeBar gestrichen — dialog.css, titlebar.css, drawer.css, snackbar.css,
    notice-bar.css, overlay.css im Paket. TLPhotoCapture <alt>-><neu>: Scrim und Hülle des Kamera-Overlays sind
    tl-dialog. TLAppShell 33-><neu>: die Übergangsregel .tlAppShell .tl-breadcrumb stand im Block TLNoticeBar und zieht
    hierher, fällt in 4b. Literale … lines = Summe = gemessen <n>.“ und an `_foreignTl`: „13.10. Welle 4a:
    --tlSnackbar-bg/-fg gestrichen, die Farbe trägt tl-alert über data-tl-role.“

- [ ] **Step 3: Paket-Gates**

```bash
cd design-system && node tools/generate.mjs && node tools/lint-css.mjs && node tools/publish-to-worktree.mjs && node --test 2>&1 | grep -E '^ℹ (pass|fail)|^✖'
```

Expected: alle grün, darunter `ratchet`, `published`, `engine-classes` (beide Tests). Kontrast: keine neuen Paare —
Ghost-Knöpfe stehen schon im Menü auf `surface-overlay`, Text und Ring auf `surface-overlay` stehen in
`tools/lib/pairs.mjs`; `tokens.test.mjs` und `pairs.test.mjs` bleiben grün.

- [ ] **Step 4: Maven und Messages**

```bash
cd _Working-Tree/tl8-wt-29584
mvn -B install -pl com.top_logic.layout.react 2>&1 | tee com.top_logic.layout.react/target/mvn-4a.log | grep -E 'BUILD|ERROR' | head
mvn -B test -DskipTests=false -pl com.top_logic.layout.react,com.top_logic.layout.view,com.top_logic.demo.react 2>&1 | tee /tmp/mvn-4a-test.log | grep -E 'Tests run:|BUILD|FAIL' | tail -8
../design-system/tools/check-messages-en.sh
```

Expected: BUILD SUCCESS; Tests grün außer dem bekannten #29651 in `layout.view` (`TestAccordionElement`, JVM-Locale);
`check-messages-en.sh` ohne Diff (die Änderung an `CommandErrors` ist eine private Konstante). Scheitert der
Messages-Lauf offline an fehlenden vorgelagerten Modulen, erst diese per `mvn -o install -pl <Liste>` installieren
(Memory „Gate nach master-Merge“).

- [ ] **Step 5: `altlast.md`** — Abschnitt „## Welle 4a · Overlays — gebaut <Datum>“ vor „## Konsolidierung“ einfügen,
  mit „Gestrichene Blöcke“ (die sieben, mit Zeilen), „Neu im Paket“ (sechs Bausteine, zwei Maß-Gruppen) und der
  Tabelle „Alt → neu für Anwendungs-Stylesheets“:

| Alt | Neu |
|---|---|
| `.tlDialog__backdrop` | `.tl-dialog` |
| `.tlDialog__backdrop--entering` / `--exiting` | `.tl-dialog[data-tl-state~="entering"]` / `~="exiting"` |
| `.tlWindow` | `.tl-dialog__surface` |
| `.tlWindow__header`, `__title`, `__toolbar` | `.tl-titlebar`, `.tl-titlebar__title`, `.tl-titlebar__actions` |
| `.tlWindow__maximizeBtn`, `__closeBtn` | `.tl-titlebar .tl-button--icon` |
| `.tlWindow__body`, `__footer` | `.tl-dialog__body`, `.tl-dialog__footer` |
| `.tlWindow__resizeHandle--<r>` | `.tl-dialog__resize[data-tl-edge="<r>"]` |
| `.tlDrawer--left` / `--right` / `--bottom` | `.tl-drawer--start` / `--end` / `--bottom` |
| `.tlDrawer--open` | `.tl-drawer[data-tl-state~="open"]` |
| `.tlDrawer--container`, `--narrow|--medium|--wide` | `.tl-drawer--container`, `.tl-drawer--narrow|--medium|--wide` |
| `.tlDrawer__header`, `__title`, `__closeBtn`, `__body` | `.tl-titlebar`, `.tl-titlebar__title`, `.tl-titlebar .tl-button--icon`, `.tl-drawer__body` |
| `.tlSnackbar.tlSnackbar--<v>` | `.tl-alert.tl-snackbar[data-tl-role="<v>"]` |
| `.tlSnackbar--exiting` | `.tl-snackbar[data-tl-state~="exiting"]` |
| `.tlSnackbar__message`, `__title`, `__close` | `.tl-alert__message`, `.tl-alert__title`, `.tl-alert__close` |
| `--tlSnackbar-bg`, `--tlSnackbar-fg` | entfällt (Rolle über `data-tl-role`) |
| `.tlNoticeBar.tlNoticeBar--<s>` | `.tl-alert.tl-notice-bar[data-tl-role="<s>"]` |
| `.tlNoticeBar--clickable` | `.tl-notice-bar[role="button"]` |
| `.tlNoticeBar__text`, `__countdown` | `.tl-alert__message`, `.tl-notice-bar__countdown` |
| `.tlOverlay`, `__base`, `__layer`, `__layer--<a>` | `.tl-overlay`, `__base`, `__layer`, `__layer--<a>` |

  Dazu „Offen für 4b“: Klassenart von `useKeyedTransition` streichen (Wizard, TileStack), mobile Sidebar auf den
  modalen Drawer, `tlViewError` auf `tl-alert`, `.tlAppShell .tl-breadcrumb`; „Sichtbar“: Glass-Theme ohne Blur hinter
  Dialogen; Snackbar ohne Icon (State liefert keins).

- [ ] **Step 6: Trac** — `update_ticket 29836` mit der vollständigen Beschreibung plus Abschnitt (Trac-Syntax):

```
== Migration ==

 * The CSS classes `tlDialog*`, `tlWindow*`, `tlDrawer*`, `tlSnackbar*`, `tlNoticeBar*` and `tlOverlay*` no longer exist. Application stylesheets that target them must be rewritten against the package classes and attributes; the full old → new list is in the package (`docs/migration/altlast.md`, "Welle 4a").
 * Opening and closing animations of dialogs: `.tlDialog__backdrop--entering` / `--exiting` become `.tl-dialog[data-tl-state~="entering"]` / `~="exiting"`. The package now ships a fade; an application overrides it with rules on the same state.
 * `--tlSnackbar-bg` and `--tlSnackbar-fg` are gone; the snackbar is a tinted alert (`data-tl-role`).
 * Visible: the snackbar is tinted instead of filled, the dialog scrim has no blur, header buttons are 24px, drawer sides are `--start`/`--end`.
```

  und `attributes: {"keywords": "RequiresMigration"}`; mit `get_ticket` prüfen.

- [ ] **Step 7: Commits** — Paket-Repo (`ratchet.json`, `engine-classes.test.mjs`, `dist`, `altlast.md`, `STATUS.md`
  mit Stand „4a gebaut, lokal, nicht gepusht“) und Engine (Paketkopie, falls geändert):

```bash
git add design-system docs/migration/altlast.md STATUS.md
git commit -m "Ticket #29836: Ratsche und Engine-Gate Welle 4a -- sieben Overlay-Blöcke gestrichen, alte Klassen in Engine, Java, tl-docs und Demo-Stylesheet gesperrt; altlast Welle 4a

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Sichtprüfung lokal

**Files:** keine (Befunde gehen in `altlast.md`, Korrekturen als eigene Commits).

- [ ] **Step 1: Demo starten** — wie Memory „Lokale Demo statt Docker“ (`tl-demo-react` aus dem Worktree,
  `-Pide,with-h2`); Hendrik loggt ein.
- [ ] **Step 2: Prüfen**, hell und dunkel, normal und kompakt (Chrome-Erweiterung):
  1. Dialog öffnen und schließen (z. B. Spaltenwahl der Tabelle): Einblenden, Ausblenden, Kopie verschwindet; mit
     reduzierter Bewegung (DevTools „prefers-reduced-motion: reduce“) ohne Bewegung.
  2. Tab bleibt im Dialog; nach Schließen steht der Fokus wieder am Auslöser.
  3. Escape: Select im Dialog offen → schließt das Select; nochmal → schließt den Dialog; Rückfrage über Dialog →
     schließt nur die Rückfrage.
  4. Ziehen am Kopf (bleibt im Viewport), Größe an Kante und Ecke, Doppelklick auf Griff (zurück), Doppelklick auf
     Kopf (maximiert, ohne Rand und Ecke, Kopf ohne Greif-Zeiger), wiederherstellen.
  5. Kopfknöpfe 24 px mit Tooltip; Schließen deaktiviert, solange Arbeit läuft.
  6. Drawer (TLAdaptiveDetail, im Behälter): schiebt herein, Fokus hinein, Escape schließt, Fokus zurück an die Zeile;
     geschlossen nicht per Tab erreichbar.
  7. Snackbar in vier Rollen (Speichern, Fehler eines Befehls mit Liste): Titel kräftig, Liste umbrochen, Zeigen hält
     an, Schließen-Knopf mit Tooltip — **liegt der Tooltip unter der Snackbar** (Ebene 1101 unter 1200), Befund
     notieren und Hendrik vorlegen.
  8. NoticeBar (Sitzungsablauf): Countdown springt nicht, klickbar mit Tab erreichbar, Ring sichtbar, Enter löst aus.
  9. Fotoaufnahme: Scrim, Fokus in der Kamera, Escape schließt, Fokus zurück am Kamera-Knopf.
  10. Rückfrage „Ungespeicherte Änderungen“ (Dirty-Dialog): Kopf, Fuß, Knöpfe.
- [ ] **Step 3: Befunde** — jede Abweichung als Zeile in `altlast.md` „Welle 4a“; Fehler beheben, Gates erneut, je
  ein Commit.

---

### Task 11: Abschluss — melden, nicht pushen

- [ ] **Step 1:** `git log --oneline origin/CWS/CWS_29825_design_system_spaltenwahl..HEAD` (Engine) und
  `git log --oneline origin/main..HEAD` (Paket) zusammenfassen.
- [ ] **Step 2:** Hendrik melden: Branch, Commits, Gates, Sichtprüfung, offene Befunde. **Push nur nach seiner
  ausdrücklichen Freigabe**, je Repo und Branch benannt; PR gegen `CWS/CWS_29825_design_system_spaltenwahl`, Reviewer bhu, danach `add_reviewers bhu`.
