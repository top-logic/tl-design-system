# Welle 4c · Behälter — Umsetzungsplan (#29870)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Panel, SplitPanel, Card, Stack, Grid, DeckPane, TileStack, Inset, AdaptiveDetail, Accordion, Wizard und
ViewError der React-Schicht lesen das Paket; ihre Blöcke (rund 850 Zeilen) fallen aus `tlReactControls.css`.

**Architecture:** Das Paket bekommt die Blöcke `tl-panel`, `tl-button-bar`, `tl-card`, `tl-accordion`, `tl-stack`,
`tl-grid`, `tl-inset`, `tl-bounded`, `tl-item`, `tl-deck`, `tl-split`, `tl-tile-stack`, `tl-wizard`,
`tl-adaptive-detail`, vier Keyframes `tl-slide-*` und das Maß `size-wizard-progress`; `tl-titlebar` lernt Inhalt,
Kopfknöpfe, gleiche Höhe und Nachgeben. In der Engine sagt ein React-Kontext (`useSurface`) jeder Karte, auf welcher
Fläche sie liegt (Stufe nach Verschachtelung, Weg B), und jedem Inset, wie weit es einrückt; ein Helfer
(`separatorMove`) gibt Split-Teiler und Spaltengriff dieselbe Tastatur. Panels bedienen sich wie Fenster (U1, U3), der
Split-Griff setzt per Doppelklick zurück (U2, neuer Befehl `resetSizes`).

**Tech Stack:** Paket: CSS, `node --test`, `tools/*.mjs`, Chrome über CDP (`test/lib/browser.mjs`). Engine: React/TSX
über `tl-react-bridge`, TypeScript, Vite, Java 17, Maven, Vitest im MUI-Modul.

**Spec:** `docs/superpowers/specs/2026-10-16-welle-4c-behaelter-design.md` (freigegeben 16.10.); Begründungen in
`docs/skalen.md` „Welle 4c: Behälter“; Prognose in `docs/migration/altlast.md` „Welle 4c“.

**Plan-Review** 16.10. durch einen frischen Agenten (Fable), Probelauf in Kopien: Paket mit allen Dateien der Tasks
1–4 wörtlich (Lint grün; `node --test` 473, 466 grün — rot `hidden` (11 Blöcke ohne `[hidden]`), `card`- und
`wizard`-Vertrag, `focus-clip` am Master-Detail, `titlebar-height` ×2 (41 statt 40 px), `published` erwartet); Paket
mit Task 10 gegen eine Engine-Kopie mit allen Tasks (476, 469 grün — dieselben plus `engine-classes` an
`ObjectListElement.java:118`); Engine `tsc` 0, beide Vite-Builds grün, MUI-Vitest 43/44 Dateien (`containers.test.tsx`
7/12 ohne registrierte Parts, mit `replacePart` 12/12), `javac` grün, `TestSplitPanelReset` 2/2, `TestViewLoadError`
1/1, `TestSplitSizePersonalization` 8/8. **Befunde 1–13 und f eingearbeitet** (Abweichungen 17–22, Global
Constraints, Tasks 1–4, 6–8, 10, 12); `calc` der Kopfhöhe und des Drawer-Rings sowie die erweiterten Zustandswörter am
Lint einer Paketkopie geprüft (grün, `lint-css.test.mjs` 35/35).

**Nachgezogen auf master `2bf2151a2e` (16.10.)** — !1906 (4b) ist gemergt, der 4c-Branch per Fast-Forward darauf.
Seit dem bisherigen Basis-Commit `9c6776f258` kamen !1905 (#29755, Bernhard: auswählbare Einträge in Stack, Grid und
Spalten — `renderItems` wurde `useItems(state, wrapper?)` mit `containerProps`, die Hüllen sind als Listbox
`role="option"` mit `aria-selected`; der Block „Repeated items“ wuchs um `.tlItem--selectable/--selected` auf 48 Zeilen)
und #29713 (`.tlDashboard__hide`, Welle 5). Geändert: Task 3 (die Auswahl der Einträge nach Q24 in `layout.css`, Test,
Vertrag `layout` und `columns`, Specimen), Task 8 (`items.tsx` nach `useItems`: Klasse `tl-item`, `--item-index`,
keine Zustandsklassen der Auswahl; Zeilenangaben in Java und Doku; „Repeated items“ verliert auch Bernhards
Auswahlregeln; Vitest der Auswahl), Task 10 (Ratsche ab dem gehobenen Budget), Task 11 (Auswahl in der Demo prüfen;
Karte im schlichten Panel), Task 12 (Basis `2bf2151a2e`, PR gegen master, Hinweis an Bernhard zu Q24); Abweichung 23,
Review Focus 7. Die Toolbar meldet ohne Befehl weiter `null` (`TLToolbar.tsx:492`, jetzt nach sichtbaren Gruppen) —
die Annahmen zu Kopf und Knopfleiste bleiben.

## Abweichungen von der Spec (beim Planen am Code gefunden)

1. **Ein Vertrag `layout` statt `stack`, `grid`, `inset`.** Stack, Grid, Inset, Bounded, Item und Deck sind sechs
   kleine Blöcke ohne eigenes Verhalten; sie stehen in `src/components/layout/` mit einer CSS-Datei, einem Vertrag,
   einem Specimen. Keine sichtbare Folge.
2. **Die Kopfknöpfe des Panels stehen in `tl-titlebar__buttons`.** Minimieren, Maximieren und Lösen sind das Part
   `Button`; die Lage eines Parts gehört dem Element um das Part (`view-layer/parts.md`), also bekommen sie eine Hülle
   statt der Regel `.tl-titlebar > .tl-button`, die ein MUI-Knopf nicht trägt. Sie sind `small` (24 px) wie die
   Kopfknöpfe von Fenster und Drawer (Vertrag `titlebar`).
3. **Die Höhenregel trifft auch den Fensterkopf mit Toolbar.** `.tl-titlebar__actions > .tl-toolbar` verliert Mindesthöhe
   und Innenabstand; ein Dialog mit Toolbar im Kopf (Spaltenwahl) misst dann `size-bar` statt `size-bar + 2 × space-2xs`
   — wie Spec §3 („gilt für jeden `tl-titlebar`“) es verlangt.
4. **Das Nachgeben steht am Titelkopf, nicht am Panel.** Die Regel der AppBar (Aktionen mit überlaufender Toolbar
   `flex: 1 1 0`, Mindestbreite `size-control`; der Titel dann `flex: 0 1 auto`) steht in `titlebar.css` und gilt
   damit auch für Fenster mit überlaufender Toolbar.
5. **`tl-card` beschneidet am Radius (`overflow: clip`).** Damit fallen am Accordion die vier Eckregeln des Kopfs und
   mit ihnen der Modifier `tl-accordion__section--expanded` (das Lint verbietet `--expanded` ohnehin als Zustand).
6. **Die Wizard-Scheibe ist ein `span`, kein `::before`.** Die Zahl braucht `tl-type-label tl-nums`; eine Typo-Klasse
   lässt sich an kein Pseudo-Element setzen, und `font-size` außerhalb einer Typo-Klasse bricht das Lint. Der Zähler
   `counter()` entfällt; das TSX schreibt die Position. Die Scheibe ist `aria-hidden` (die Liste ist geordnet).
7. **Die Keyframes stehen in einem eigenen Ordner `slide/`** (`tl-slide-in-forward`, `-in-backward`, `-out-forward`,
   `-out-backward`), gelesen von TileStack und Wizard — ein Versatz, eine Stelle (Q21).
8. **U2 braucht Java an zwei Klassen.** `ReactSplitPanelControl` kennt die konfigurierte Größe nicht, wenn
   `SplitSizePersonalization` eine gezogene einsetzt: jede Fläche merkt sich ihre Ausgangsgröße
   (`setDefaultSize`), der Befehl `resetSizes` setzt sie ein und ruft einen neuen Rückruf; die Personalisierung
   vergisst darauf ihre Größen (`forgetSizes`). Zwei Java-Tests.
9. **`aria-valuenow` des Split-Griffs** rechnet beim Rendern aus den Gewichten des Servers (gleiche Einheit) mit
   Grenzen 0/100; erst eine Pfeiltaste setzt Wert und Grenzen aus den gemessenen Pixeln. Ohne Messung beim Rendern —
   jsdom und der erste Durchlauf kennen keine Breiten.
10. **Übergangsregeln im alten Stylesheet lesen ein Token statt `--page-inset`.** `scroll-margin-top` in TLHtml und
    `padding` im Dashboard (beide Welle 5) lesen `var(--tl-space-lg)`. In einem Panel stand der Sprungabstand von
    TLHtml bisher bei 1 rem, künftig 1,5 rem.
11. **Tote Regel fällt:** `.tlSplitPanel--allCollapsed > .tlSplitPanel__child { overflow: hidden }` wirkte nie (das TSX
    setzt `overflow` inline). Die Richtung des Splits kommt aus Modifiern statt aus einem Inline-Stil.
12. **`tlPanel__error` hatte keine Regel;** die Meldung bleibt `tl-form-field__message tl-type-label` ohne eigene
    Klasse.
13. **Der Fußwähler des Fensters wird `:scope > .tl-button-bar`.** `initialFocus` in `TLWindow.tsx` sucht den Fuß
    heute mit `.tl-dialog__footer`; mit einer gemeinsamen Klasse träfe `querySelector` die Knopfleiste eines Panels im
    Körper zuerst.
14. **Der Kontext der Fläche**: Fenster und Drawer setzen `overlay` mit Inset `page` (Insets im Dialog bleiben bei
    1,5 rem wie heute); das Accordion setzt `layer` und lässt das Inset der Umgebung.
15. **ViewError**: `ReactAlertControl` hat Titel und Meldung, kein Feld für Monospace. Pfad und Ursache stehen als
    Meldung untereinander (`white-space: pre-line` der Meldung); der Abstand zum Rand kommt aus einem
    `ReactInsetControl` (Seite: `space-lg`) statt `space-md`. Siehe „Fragen an Hendrik“ 1.
16. **Der Standard-Kopf der Breadcrumb** ist ein neuer Schlüssel `ADAPTIVE_DETAIL_HOME` in
    `com.top_logic.layout.view.element.I18NConstants`.
17. **Die Linie des Kopfs zählt zur Höhe** (Plan-Review, Befund 2). `.tl-titlebar` ist `border-box` mit `min-height:
    size-bar`, Innenabstand `space-2xs` oben und unten und einer Linie unten: der Inhalt fasst 31 statt 32 px, ein
    Toolbar-Knopf (`size-control`) drückte den Kopf auf 41 px (kompakt 37). Unten liegt darum
    `calc(var(--tl-space-2xs) - var(--tl-border-width-sm))`; jeder Kopf misst `size-bar`. Sichtbar nur 1 px weniger
    Luft unter dem Titel eines Dialogs.
18. **Der Ring des Container-Drawers liegt innen** (Befund 3). `.tl-adaptive-detail` beschneidet mit `overflow: clip`
    (der geparkte Drawer darf nie in Sicht scrollen), der Drawer liegt bündig an drei Kanten: sein Ring würde
    beschnitten. Regel „Ring innen, wo der Behälter schneidet“ wie Tabelle und Menü: `.tl-drawer--container:focus-visible
    { outline-offset: calc(-1 * var(--tl-focus-offset)); }` in `drawer.css`, Vertrag `drawer` nachgezogen.
19. **End am Spaltengriff passt die Spalte an ihren Inhalt an** (Befund 10) — dieselbe Wirkung wie der Doppelklick;
    Home setzt die Mindestbreite. Eine Spalte hat kein Maximum, „End an das Maximum“ (Spec §6) hätte nichts zu tun.
    Spec §12 nachgetragen.
20. **Das Lint kennt die Zustände der Welle** (Befund 9): `STATE_MODIFIER` und `ELEMENT_STATE_MODIFIER` um
    `minimized`, `covered`, `current`, `done`, `upcoming`, `forward`, `backward` erweitert (`maximized`, `collapsed`,
    `entering`, `exiting`, `expanded` standen schon). „Kein `transform: rotate` für Text“ (Spec §9) bleibt ein Test auf
    `split.css` (`behaelter.test.mjs`), keine Lint-Regel: eine Regel auf `rotate` träfe den Chevron, der zu Recht dreht.
21. **Escape von innen nach außen** (Review b): ein maximiertes Panel in einem Fenster stellt sich auf Escape zuerst
    wieder her; erst das nächste Escape schließt das Fenster. Das ist die Regel aus 4a („Escape schließt von innen nach
    außen“); der `keyboard-dispatcher` hängt in der Bubble-Phase am `document` und steht bei `defaultPrevented` zurück.
22. **MUI-Theme** (Review e): `MuiCardAdapter` liest `useSurface` nicht — Weg B gilt dort nicht (Adapter folgen dem
    Vertrag, nicht unseren Flächen). `TLAdaptiveDetail` rendert den Darstellungsteil `Breadcrumb` direkt: der
    `MuiBreadcrumbAdapter` ersetzt das **Control** `TLBreadcrumb` (`replace('TLBreadcrumb', …)` in `registry.ts`), kein
    Part; die Krumen des AdaptiveDetail haben keinen eigenen Control-Zustand und keinen Server-Partner, über den die
    Ersetzung greifen könnte. Ein Part `Breadcrumb` wäre Bernhards Entscheidung — Hinweis an ihn im PR (Task 12).
23. **Die Auswahl der Einträge (Q24) zeichnet ein Ring über dem Eintrag, kein Schatten und keine Fläche.** Das Lint
    erlaubt als `box-shadow` nur `--tl-shadow-*`, eine `inset`-Linie oder den Hof; ein Ring nach außen als Schatten
    fällt also weg, und `outline` ist der Fokus. Eine `inset`-Linie oder ein Rand an der Hülle läge hinter einer
    Karte mit eigener Fläche bzw. verschöbe die Einträge um 2 px. Darum: die Option ist `position: relative`, der Ring
    ein `::after` über dem ganzen Eintrag (`inset: 0`, `border: border-width-md solid border-interactive`,
    `border-radius: inherit`, `pointer-events: none`) bei `aria-selected="true"`; beim Zeigen der Hof
    `0 0 0 var(--tl-space-2xs) var(--tl-surface-state-hover)`. Bernhards Auswahlfläche (`surface-brand-subtle`) fällt
    wie entschieden. Die Regel gilt für `tl-item` und für `tl-columns__column` — `useItems` nimmt die Spalte als Hülle
    (`TLColumns.tsx`), auch sie wird Option.

## Global Constraints

- Ticket **#29870**; Commits beider Repos mit Präfix `Ticket #29870:`, Paket-Commits deutsch, Engine-Commits englisch,
  Trailer `Co-Authored-By: <Modell des Ausführenden> <noreply@anthropic.com>`.
- Engine-Branch `CWS/CWS_29870_design_system_welle_4c` im Worktree `_Working-Tree/tl8-wt-29584` (lokal, auf master
  `2bf2151a2e` mit 4b und #29755). **Kein Push** — weder Engine noch Paket; Subagenten committen lokal und melden.
- Paket: `tokens.json` nur Referenzen; im CSS nur Tokens (Lint, keine eigene Variable in einer Klasse); `dist/` nur
  über `node tools/generate.mjs`, danach `node tools/publish-to-worktree.mjs` (`test/published.test.mjs` hält die Kopie
  byte-gleich, `TestDesignSystemCopy` in der Engine prüft das Siegel).
- Zustände sind Attribute (`data-tl-state` als Wortliste, `aria-current`, `aria-expanded`), nie `--minimized`,
  `--maximized`, `--collapsed`, `--entering`, `--exiting`, `--covered`, `--expanded`, `--current`, `--done`,
  `--upcoming`, `--forward`, `--backward` — das Lint fängt sie an Block und Element (Task 1).
- Jeder Block, der `display` setzt, setzt direkt nach seiner Grundregel `.tl-x[hidden] { display: none; }`
  (`test/hidden.test.mjs`).
- Jeder Pflichtbegriff eines Vertrags (`SOLL` in `contracts-4c.test.mjs`) steht im Vertrag unmittelbar nach einem
  Backtick: eine Klasse je Backtick-Paar, ohne Elementpräfix — `` `tl-card` `tl-card--nested` ``, nicht
  `` `tl-card tl-card--nested` ``; `` `tl-wizard__steps` (an `ol`) ``, nicht `` `ol.tl-wizard__steps` ``
  (`missingInContract` sucht „\`<Begriff>“).
- `z-index` nur `var(--tl-layer-*)`; `transition`/`animation` nur mit `var(--tl-duration-*)` und
  `var(--tl-easing-*)`; kein `outline: none`; der Ring kommt aus `base.css`; `font-size`/`font-weight` nur über
  Typo-Klassen; keine Breiten-Media-Query in einer Komponentendatei.
- Die Lage eines Parts (`Button`, `Badge`, `Divider`) steht am Element um das Part, nie an seiner `className`.
- React in Controls nur aus `'tl-react-bridge'`; in `bridge/*.ts` aus `'react'` wie die Nachbardateien.
- `messages_en.properties` nie von Hand; `design-system/tools/check-messages-en.sh` vor dem Abschluss; Deutsch in
  `messages_de.properties` von Hand, sortiert.
- Keine Zeitangaben in Docs und Commits.

## Review Focus

1. **Der Fensterfuß ist nicht die Knopfleiste eines Panels im Fenster.** `initialFocus` sucht den Fuß mit
   `:scope > .tl-button-bar`; ein Panel mit Knopfleiste im Körper darf den Startfokus nicht bekommen. Task 6 Step 5,
   geprüft im Engine-Gate (Task 10).
2. **Escape in einem maximierten Panel** stellt wieder her, aber nicht, wenn ein Element darin Escape schon
   verbraucht hat (offenes Popup, `defaultPrevented`); dann bleibt das Panel maximiert und das Fenster offen.
   Vitest in Task 6.
3. **Doppelklick auf einen Kopfknopf** löst nur den Knopf aus, nicht zusätzlich das Maximieren des Kopfs;
   Klick auf einen Knopf im minimierten Kopf löst nur den Knopf aus. Vitest in Task 6.
4. **Pfeiltasten am Spaltengriff** ändern die Spaltenbreite und laufen nicht in die Tastatur der Tabelle weiter
   (`stopPropagation`); erst das Loslassen sendet `columnResize`. Vitest in Task 7.
5. **Eine Karte im Dialog sinkt nicht ein:** im Kontext `overlay` trägt sie `tl-card--overlay`, in einer Fläche
   `tl-card--nested`, auf der Seite keines von beiden; ein schlichtes Panel hebt die Stufe nicht (`panelSurface`).
   Vitest in Task 6, Specimen in Task 2.
6. **Ein Klick auf die leere Fläche der Toolbar im Kopf** eines minimierten Panels öffnet es nicht, ein Doppelklick
   dort maximiert nicht — alles in `.tl-titlebar__actions` gehört der Toolbar (Spec §3). Vitest in Task 6.
7. **Ein ausgewählter Eintrag trägt seinen Zustand nur als `aria-selected`** — keine Klasse `tlItem--selected` oder
   `tl-item--selected`, die Hülle heißt `tl-item` (Spalten: `tl-columns__column`); ein Klick wählt, ein Klick auf einen
   Knopf im Eintrag nicht. Vitest in Task 8; Ring neben dem Fokusring auf einer Karte in Task 11.

## Datei-Übersicht

| Datei | Aufgabe |
|---|---|
| `design-system/src/tokens.json` | `size-wizard-progress` |
| `design-system/tools/lint-css.mjs` | Modifier der neuen Blöcke |
| `design-system/src/components/titlebar/titlebar.{css,contract.md}` | `__content`, `__buttons`, Höhe, Nachgeben |
| `design-system/src/components/button-bar/button-bar.{css,contract.md}` | neu |
| `design-system/src/components/dialog/dialog.{css,contract.md,spec.html}` | Fuß ist `tl-button-bar` |
| `design-system/src/components/panel/panel.{css,contract.md,spec.html}` | neu |
| `design-system/src/components/card/card.{css,contract.md,spec.html}` | neu |
| `design-system/src/components/accordion/accordion.{css,contract.md,spec.html}` | neu (aus dem alten Stylesheet) |
| `design-system/src/components/layout/layout.{css,contract.md,spec.html}` | neu (mit der Auswahl der Einträge, Q24) |
| `design-system/src/components/columns/columns.contract.md` | eine auswählbare Spalte liest die Auswahlregel aus `layout.css` |
| `design-system/src/components/split/split.{css,contract.md,spec.html}` | neu |
| `design-system/src/components/slide/slide.{css,contract.md}` | neu |
| `design-system/src/components/tile-stack/tile-stack.{css,contract.md}` | neu |
| `design-system/src/components/wizard/wizard.{css,contract.md,spec.html}` | neu |
| `design-system/src/components/adaptive-detail/adaptive-detail.{css,contract.md,spec.html}` | neu |
| `design-system/src/components/{breadcrumb,alert,table}/*.contract.md` | Leser nachgezogen |
| `design-system/specimen/index.html` | Links |
| `design-system/test/behaelter.test.mjs` | CSS-Regeln der Welle |
| `design-system/test/titlebar-height.test.mjs` | Browser: Kopfhöhe, Nachgeben |
| `design-system/test/contracts-4c.test.mjs` | Verträge, Specimen |
| `design-system/test/overlays.test.mjs` | Fuß-Prüfungen auf `tl-button-bar` |
| `design-system/test/ratchet.json`, `test/engine-classes.test.mjs` | Ratsche, Engine-Gate |
| Engine `react-src/bridge/surface.ts`, `bridge/separator.ts` (neu), `bridge-entry.ts` | Helfer |
| Engine `react-src/controls/TLBreadcrumb.tsx` | Darstellungsteil `Breadcrumb` |
| Engine `react-src/controls/TLPanel.tsx`, `TLCard.tsx`, `TLAccordion.tsx`, `TLWindow.tsx`, `TLDrawer.tsx` | Task 6 |
| Engine `react-src/controls/TLSplitPanel.tsx`, `TLTableView.tsx` | Task 7 |
| Engine `…/control/layout/ReactSplitPanelControl.java`, `…/view/element/SplitSizePersonalization.java` | U2 |
| Engine `react-src/controls/TLStack.tsx`, `TLGrid.tsx`, `TLInset.tsx`, `TLDeckPane.tsx`, `items.tsx` | Task 8 |
| Engine `react-src/controls/TLWizard.tsx`, `TLTileStack.tsx`, `TLAdaptiveDetail.tsx`, `TLHtml.tsx` | Task 9 |
| Engine `…/layout/view/ViewLoadError.java`, `…/view/element/ReactAdaptiveDetailControl.java`, `…/element/I18NConstants.java` | Task 9 |
| Engine `com.top_logic.layout.react/src/main/java/com/top_logic/layout/react/I18NConstants.java`, `messages_de.properties` (zwei Module) | i18n |
| Engine `com.top_logic.layout.react.mui/react-src/adapters/inline-buttons.test.tsx`, `containers.test.tsx` (neu) | Vitest |
| Engine `com.top_logic.layout.view/src/main/java/META-INF/tl-docs/view-layer/{basics,layout,app-shell,navigation,theme-tokens}.md` | Doku |
| Engine `com.top_logic.demo.react/src/main/webapp/style/tl-demo-react.css` | `tl-grid`, `--item-index` |
| Engine `com.top_logic.layout.react/src/main/webapp/style/tlReactControls.css` | Blöcke streichen, Übergangsregeln |

---

### Task 1: Paket — Titelleiste, Knopfleiste, Maß, Lint

**Files:**
- Modify: `design-system/src/tokens.json` (Zeile `"size-sidebar": "{size-12}",` in `measure`)
- Modify: `design-system/tools/lint-css.mjs` (`MODIFIERS`, nach `'tl-icon-badge': new Set([]),`; Zustandswörter in
  `STATE_MODIFIER` und `ELEMENT_STATE_MODIFIER`, Zeilen 80 und 83)
- Modify: `design-system/test/lint-css.test.mjs` (anfügen)
- Modify: `design-system/src/components/titlebar/titlebar.css`, `titlebar.contract.md`
- Create: `design-system/src/components/button-bar/button-bar.css`, `button-bar.contract.md`
- Modify: `design-system/src/components/dialog/dialog.css` (Fußregeln Zeilen 86–97), `dialog.contract.md` (Zeile
  `tl-dialog__body`, `tl-dialog__footer`), `dialog.spec.html` (zwei Füße)
- Modify: `design-system/test/overlays.test.mjs` (Zeilen 74–75)
- Create: `design-system/test/behaelter.test.mjs`

**Interfaces:**
- Produces: Token `--tl-size-wizard-progress` (Task 4); Klassen `tl-titlebar__content`, `tl-titlebar__buttons`,
  `tl-button-bar` (Tasks 2, 6); Modifier im Lint für alle Blöcke der Welle (Tasks 2–4); Testdatei
  `behaelter.test.mjs`, die Tasks 2–4 erweitern.

- [ ] **Step 1: Failing test** — `design-system/test/behaelter.test.mjs` anlegen:

```js
// Welle 4c (Spec 2026-10-16): Behälter aus dem Paket. Jede Regel hier steht in der Spec; die Verträge prüft
// contracts-4c.test.mjs, Kopfhöhe und Nachgeben titlebar-height.test.mjs im Browser.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readGenerated, declarationsOf } from './lib/component.mjs';

const T = JSON.parse(readFileSync(new URL('../src/tokens.json', import.meta.url)));
const decl = (dir, sel, file = `${dir}.css`) => declarationsOf(readGenerated(dir, file), sel) ?? '';
const ohneKommentar = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');

test('size-wizard-progress ist eine eigene Rolle: 24 rem', () => {
  assert.equal(T.measure['size-wizard-progress'], '{size-13}');
});

test('tl-titlebar: eine Toolbar im Kopf bringt keine eigene Leistenhöhe mit', () => {
  const t = decl('titlebar', '.tl-titlebar__actions > .tl-toolbar');
  assert.match(t, /min-height:\s*0/);
  assert.match(t, /padding-block:\s*0/);
  // Die Linie unten zählt zur Höhe (border-box): unten space-2xs abzüglich der Linie, sonst misst ein Kopf mit
  // Toolbar-Knopf size-bar + 1 px (Plan-Review, Befund 2).
  assert.match(decl('titlebar', '.tl-titlebar'),
    /padding-bottom:\s*calc\(var\(--tl-space-2xs\) - var\(--tl-border-width-sm\)\)/);
});

test('tl-titlebar: Inhalt neben dem Titel, Kopfknöpfe in einer Hülle, ohne Titel alles am Ende', () => {
  assert.match(decl('titlebar', '.tl-titlebar__content'), /flex:\s*1 1 auto/);
  assert.match(decl('titlebar', '.tl-titlebar__title:has(+ .tl-titlebar__content)'), /flex:\s*0 1 auto/);
  const b = decl('titlebar', '.tl-titlebar__buttons');
  assert.match(b, /flex:\s*none/);
  assert.match(b, /gap:\s*var\(--tl-space-xs\)/);
  // Die Selektorliste in :not(…) enthält ein Komma; declarationsOf trennt daran, darum per Regex über die Datei.
  assert.match(ohneKommentar(readGenerated('titlebar', 'titlebar.css')),
    /\.tl-titlebar > :first-child:not\(\.tl-titlebar__title, \.tl-titlebar__content\)\s*\{[^}]*margin-inline-start:\s*auto/);
});

test('tl-titlebar: eine überlaufende Toolbar gibt vor dem Titel nach, ohne 100000', () => {
  const a = decl('titlebar', '.tl-titlebar__actions:has(> .tl-toolbar[data-tl-overflow])');
  assert.match(a, /flex:\s*1 1 0/);
  assert.match(a, /min-width:\s*var\(--tl-size-control\)/);
  assert.match(decl('titlebar', '.tl-titlebar:has(> .tl-titlebar__actions > .tl-toolbar[data-tl-overflow]) > .tl-titlebar__title'),
    /flex:\s*0 1 auto/);
  assert.doesNotMatch(ohneKommentar(readGenerated('titlebar', 'titlebar.css')), /100000/);
});

test('tl-button-bar: rechtsbündig, Linie oben, verschwindet ohne Knopf — Fuß des Dialogs und des Panels', () => {
  const b = decl('button-bar', '.tl-button-bar');
  assert.match(b, /justify-content:\s*end/);
  assert.match(b, /gap:\s*var\(--tl-space-xs\)/);
  assert.match(b, /padding:\s*var\(--tl-space-sm\) var\(--tl-space-md\)/);
  assert.match(b, /border-top:\s*var\(--tl-border-width-sm\) solid var\(--tl-border-separator\)/);
  assert.match(decl('button-bar', '.tl-button-bar:not(:has(button))'), /display:\s*none/);
  assert.doesNotMatch(ohneKommentar(readGenerated('dialog', 'dialog.css')), /tl-dialog__footer/);
});
```

- [ ] **Step 2: Run** `cd design-system && node --test test/behaelter.test.mjs` — Expected: FAIL (`size-wizard-progress`
  `undefined`; `button-bar/button-bar.css` fehlt: ENOENT).

- [ ] **Step 3: Token** — in `src/tokens.json` die Zeile `"size-sidebar": "{size-12}",` ersetzen durch:

```json
    "size-sidebar": "{size-12}", "size-wizard-progress": "{size-13}",
```

- [ ] **Step 4: Lint** — in `tools/lint-css.mjs` nach `'tl-icon-badge': new Set([]),` einfügen:

```js
  'tl-button-bar': new Set([]), // Leer verborgen über :has, kein Modifier.
  'tl-panel': new Set(['hover-actions', 'full-line']), // Minimiert, maximiert: data-tl-state.
  'tl-card': new Set(['nested', 'overlay']), // Die Stufe folgt der Verschachtelung (Weg B), keine Erscheinung.
  'tl-accordion': new Set([]), // Offen: aria-expanded am Auslöser.
  'tl-stack': new Set(['row', 'column', 'gap-compact', 'gap-default', 'gap-loose', 'align-start', 'align-center',
    'align-end', 'align-stretch', 'justify-start', 'justify-center', 'justify-end', 'justify-space-between',
    'justify-space-around', 'justify-space-evenly', 'wrap', 'grow-first']),
  'tl-grid': new Set(['gap-compact', 'gap-default', 'gap-loose']),
  'tl-inset': new Set(['panel', 'card']), // Ohne Modifier: die Seite.
  'tl-bounded': new Set([]),
  'tl-item': new Set([]),
  'tl-deck': new Set([]),
  'tl-split': new Set(['horizontal', 'vertical']), // Alle eingeklappt: data-tl-state.
  'tl-tile-stack': new Set([]), // Richtung und Übergang: data-tl-state.
  'tl-wizard': new Set([]), // Richtung: data-tl-state; Schritt erledigt: data-tl-state, aktuell: aria-current.
  'tl-adaptive-detail': new Set([]),
```

  In beiden Zustands-Regexen (Zeilen 80 und 83) `|drop-onto|drop-refused)$/;` ersetzen durch
  `|drop-onto|drop-refused|minimized|covered|current|done|upcoming|forward|backward)$/;` (Abweichung 20). An
  `test/lint-css.test.mjs` anfügen:

```js
test('Zustände der Behälter als Modifier brechen das Gate (Welle 4c) — an Block und Element', () => {
  for (const sel of ['.tl-panel--minimized', '.tl-panel--maximized', '.tl-split__pane--collapsed', '.tl-tile-stack__frame--covered',
    '.tl-tile-stack--forward', '.tl-wizard--backward', '.tl-wizard__step-item--done', '.tl-wizard__step-item--current',
    '.tl-wizard__step-item--upcoming', '.tl-wizard__step--entering'])
    assert.ok(lint(`${sel} { display: none; }`, { known, file: 'x.css' }).some((v) => /Zustand als/.test(v)), sel);
});
```

  (Am Lint einer Paketkopie geprüft: der Bestand bleibt grün, der neue Test 1/1, `lint-css.test.mjs` 35/35.)

- [ ] **Step 5: Titelleiste** — `src/components/titlebar/titlebar.css`: den Kopfkommentar ersetzen und Regeln anfügen.
  Neuer Kopfkommentar (Zeilen 1–3):

```css
/* Titelleiste — Spec 2026-10-13 Welle 4a §3 (Q3), Spec 2026-10-16 Welle 4c §3. Der eine Kopf über einer Fläche:
   Titel links mit Ellipse, daneben frei gestalteter Inhalt, Aktionen (Toolbar) und Kopfknöpfe (tl-button--icon --sm)
   am Ende, eine Linie darunter. Dialog, Drawer, Panel und Karte tragen ihn. Er ist size-bar hoch, mit und ohne
   Toolbar; eine überlaufende Toolbar gibt vor dem Titel nach. Die Typo-Klasse des Titels setzt das Markup. */
```

  In `.tl-titlebar` nach der Zeile `border-bottom: …;` ergänzen (Abweichung 17):

```css
  /* Die Linie unten zählt zur Höhe (border-box): unten liegt space-2xs abzüglich der Linie, damit ein Control der
     Toolbar (size-control) Platz hat und der Kopf size-bar misst, mit und ohne Toolbar. */
  padding-bottom: calc(var(--tl-space-2xs) - var(--tl-border-width-sm));
```

  In `.tl-titlebar__actions` die Zeile `gap: var(--tl-space-2xs);` ergänzen (nach `align-items: center;`) und ans Ende
  der Datei anfügen:

```css

/* Eine Toolbar im Kopf bringt keine eigene Leistenhöhe mit: der Kopf misst size-bar (Control plus space-2xs oben und
   unten), ob er eine Toolbar trägt oder nicht — Köpfe nebeneinander stehen auf einer Linie. */
.tl-titlebar__actions > .tl-toolbar {
  min-height: 0;
  padding-block: 0;
}

/* Frei gestalteter Inhalt neben dem Titel (Panel: titleContent). Steht er da, nimmt der Titel seine Breite und der
   Inhalt den Rest. */
.tl-titlebar__content {
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  min-width: 0;
}

.tl-titlebar__title:has(+ .tl-titlebar__content) {
  flex: 0 1 auto;
}

/* Die Kopfknöpfe eines Behälters (Part Button: Minimieren, Maximieren, Lösen). Sie behalten ihre Maße; die Lage steht
   an dieser Hülle, nicht am Part (view-layer/parts.md). */
.tl-titlebar__buttons {
  display: flex;
  flex: none;
  align-items: center;
  gap: var(--tl-space-xs);
}

/* Ohne Titel stehen Aktionen und Knöpfe am Ende: das erste Kind schiebt alles dorthin. */
.tl-titlebar > :first-child:not(.tl-titlebar__title, .tl-titlebar__content) {
  margin-inline-start: auto;
}

/* Wer nachgibt (wie die AppBar, 4b): eine überlaufende Toolbar nimmt nur den Rest und hält an ihrem Überlaufknopf;
   erst dann kürzt der Titel. */
.tl-titlebar__actions:has(> .tl-toolbar[data-tl-overflow]) {
  flex: 1 1 0;
  min-width: var(--tl-size-control);
}

.tl-titlebar:has(> .tl-titlebar__actions > .tl-toolbar[data-tl-overflow]) > .tl-titlebar__title {
  flex: 0 1 auto;
}
```

  `titlebar.contract.md`: Satz „in Welle 4b Panel und Card“ → „Panel und Karte (Welle 4c)“; Abschnitt `## Tokens`
  Zeile „Höhe“ → „`--tl-size-bar`, mit und ohne Toolbar (eine Toolbar im Kopf hat keine eigene Leistenhöhe)“; unter
  `## Attribute` ergänzen:

```markdown
| `tl-titlebar__content` | um frei gestalteten Inhalt neben dem Titel (Panel: `titleContent`) |
| `tl-titlebar__buttons` | um die Kopfknöpfe eines Behälters (Part `Button`, `small`): Minimieren mit `aria-expanded`, Maximieren, Lösen |
```

  und unter `## Konformität` anfügen: „Ein Kopf ist `--tl-size-bar` hoch, mit und ohne Toolbar; eine Toolbar mit
  `data-tl-overflow` gibt vor dem Titel nach.“

- [ ] **Step 6: Knopfleiste** — `src/components/button-bar/button-bar.css`:

```css
/* Knopfleiste — Spec 2026-10-16 Welle 4c §3, Konsolidierung Q14. Die untere Befehlsleiste einer Fläche: Fuß des
   Dialogs, Knopfleiste des Panels. Sie hält eine Toolbar; rechtsbündig, Linie oben. Hält sie keinen Knopf — eine
   Toolbar ohne Befehl rendert nichts oder nur ihre Hülle —, verschwindet sie samt Linie. */

.tl-button-bar {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: end;
  gap: var(--tl-space-xs);
  padding: var(--tl-space-sm) var(--tl-space-md);
  border-top: var(--tl-border-width-sm) solid var(--tl-border-separator);
}
.tl-button-bar[hidden] { display: none; }

.tl-button-bar:not(:has(button)) {
  display: none;
}
```

  `button-bar.contract.md`:

```markdown
# Vertrag: Knopfleiste

Die untere Befehlsleiste einer Fläche — Fuß des Dialogs, Knopfleiste des Panels. Kein Control für sich: die Fläche
rendert sie um ihre Toolbar. TopLogic garantiert Lage und Verschwinden, nicht das Aussehen.

## Tokens

| Teil | Token |
|---|---|
| Abstand | `--tl-space-xs` zwischen den Knöpfen, `--tl-space-sm` `--tl-space-md` innen |
| Linie | `--tl-border-width-sm` `--tl-border-separator` oben |

## Attribute

| Attribut | Wann |
|---|---|
| `tl-button-bar` | um die Toolbar am Fuß einer Fläche (`tl-dialog__surface`, `tl-panel`); im Dialog direktes Kind der Fläche |

## Konformität

Eine Knopfleiste besteht den Vertrag, wenn sie die Knöpfe rechtsbündig zeigt und ohne Knopf samt Linie verschwindet.
```

- [ ] **Step 7: Dialog** — in `dialog.css` die Regeln `.tl-dialog__footer` und `.tl-dialog__footer:empty` samt Kommentar
  „Der Fuß hält eine Toolbar …“ löschen. In `dialog.contract.md` die Zeile
  ``| `tl-dialog__body`, `tl-dialog__footer` | Körper, Fuß (leer verborgen) |`` ersetzen durch
  ``| `tl-dialog__body`, `tl-button-bar` | Körper; Fuß als direktes Kind der Fläche (ohne Knopf verborgen, Vertrag `button-bar`) |``.
  In `dialog.spec.html` beide `class="tl-dialog__footer"` durch `class="tl-button-bar"` ersetzen. In
  `test/overlays.test.mjs` die Zeilen 74–75 ersetzen durch:

```js
  assert.match(decl('button-bar', '.tl-button-bar'), /justify-content:\s*end/);
```

  (der Helfer `decl` der Datei liest `<dir>/<dir>.css`; die Prüfung auf Leer-Verbergen steht in `behaelter.test.mjs`).

- [ ] **Step 8: Run** `node --test test/behaelter.test.mjs test/overlays.test.mjs test/contracts-4a.test.mjs` —
  Expected: PASS.

- [ ] **Step 9: Gates** — `node tools/generate.mjs && node tools/lint-css.mjs && node tools/publish-to-worktree.mjs &&
  node --test 2>&1 | grep -E '^ℹ (pass|fail)|^✖'` — Expected: alles grün (auch `focus-clip`, `published`).

- [ ] **Step 10: Commit**

```bash
git add design-system && git commit -m "Ticket #29870: Paket -- Titelleiste mit Inhalt, Kopfknöpfen, gleicher Höhe und Nachgeben; Knopfleiste tl-button-bar als Fuß des Dialogs; size-wizard-progress; Lint kennt die Blöcke der Welle 4c

Co-Authored-By: <Modell> <noreply@anthropic.com>"
git -C _Working-Tree/tl8-wt-29584 add com.top_logic.layout.react/src/main/webapp/style/tl-design-system
git -C _Working-Tree/tl8-wt-29584 commit -m "Ticket #29870: Design system package -- title bar with content, header buttons, one height and the toolbar giving way first; tl-button-bar as dialog footer.

Co-Authored-By: <Modell> <noreply@anthropic.com>"
```

  Hinweis: der Fensterfuß heißt im Paket ab hier `tl-button-bar`, `TLWindow.tsx` schreibt bis Task 6 noch
  `tl-dialog__footer` (ohne Regel: der leere Fuß bleibt dann sichtbar). Task 6 zieht nach; zwischen den Tasks wird
  nicht gepusht.

---

### Task 2: Paket — Panel, Karte, Accordion

**Files:**
- Create: `design-system/src/components/panel/panel.{css,contract.md,spec.html}`
- Create: `design-system/src/components/card/card.{css,contract.md,spec.html}`
- Create: `design-system/src/components/accordion/accordion.{css,contract.md,spec.html}`
- Create: `design-system/test/titlebar-height.test.mjs`, `design-system/test/contracts-4c.test.mjs`
- Modify: `design-system/test/behaelter.test.mjs`, `design-system/specimen/index.html` (nach dem Link „BottomBar“)

**Interfaces:**
- Consumes: `tl-titlebar__buttons`, `tl-button-bar` (Task 1).
- Produces: Klassen `tl-panel`, `tl-panel__body`, `tl-panel--hover-actions`, `tl-panel--full-line`, `tl-card`,
  `tl-card--nested`, `tl-card--overlay`, `tl-card__body--pad-default|compact|none`, `tl-accordion*` (Task 6).

- [ ] **Step 1: Failing tests** — an `behaelter.test.mjs` anfügen:

```js
test('tl-panel: Spalte; maximiert über dem Behälter auf layer-raised, Grund surface-base; minimiert ist der Kopf ein Ziel', () => {
  assert.match(decl('panel', '.tl-panel'), /flex-direction:\s*column/);
  const m = decl('panel', '.tl-panel[data-tl-state~="maximized"]');
  assert.match(m, /position:\s*absolute/);
  assert.match(m, /inset:\s*0/);
  assert.match(m, /z-index:\s*var\(--tl-layer-raised\)/);
  assert.match(m, /background:\s*var\(--tl-surface-base\)/);
  assert.match(decl('panel', '.tl-panel[data-tl-state~="minimized"] > .tl-titlebar'), /cursor:\s*pointer/);
  const b = decl('panel', '.tl-panel__body');
  assert.match(b, /overflow:\s*auto/);
  assert.match(b, /flex:\s*1/);
  assert.match(decl('panel', '.tl-panel__body > *'), /flex-shrink:\s*0/);
  assert.match(decl('panel', '.tl-panel--full-line'), /grid-column:\s*1 \/ -1/);
});

test('tl-panel--hover-actions: Aktionen und Knöpfe beim Zeigen und bei Tastaturfokus, auf Touch immer', () => {
  const css = ohneKommentar(readGenerated('panel', 'panel.css'));
  assert.match(css, /\.tl-panel--hover-actions > \.tl-titlebar > :is\(\.tl-titlebar__actions, \.tl-titlebar__buttons\)\s*\{[^}]*opacity:\s*0/);
  assert.match(css, /transition:\s*opacity var\(--tl-duration-base\) var\(--tl-easing-standard\)/);
  assert.match(css, /:has\(:focus-visible\)/);
  assert.match(css, /@media \(hover: none\)/);
  assert.doesNotMatch(css, /focus-within/);
});

test('tl-card: Linie, Radius, beschnitten; die Fläche folgt der Verschachtelung (Weg B), kein Schatten', () => {
  const c = decl('card', '.tl-card');
  assert.match(c, /background:\s*var\(--tl-surface-layer\)/);
  assert.match(c, /border:\s*var\(--tl-border-width-sm\) solid var\(--tl-border-separator\)/);
  assert.match(c, /border-radius:\s*var\(--tl-radius-md\)/);
  assert.match(c, /overflow:\s*clip/);
  assert.match(decl('card', '.tl-card--nested'), /background:\s*var\(--tl-surface-layer-nested\)/);
  assert.match(decl('card', '.tl-card--overlay'), /background:\s*var\(--tl-surface-overlay\)/);
  assert.match(decl('card', '.tl-card__body--pad-default'), /padding:\s*var\(--tl-space-md\)/);
  assert.match(decl('card', '.tl-card__body--pad-compact'), /padding:\s*var\(--tl-space-xs\)/);
  assert.doesNotMatch(ohneKommentar(readGenerated('card', 'card.css')), /box-shadow|--elevated/);
});

test('tl-accordion: die Fläche ist tl-card; nur Linien, Kopf auf size-bar, Körper space-md, Ring innen', () => {
  const css = ohneKommentar(readGenerated('accordion', 'accordion.css'));
  assert.doesNotMatch(css, /\.tl-accordion\s*\{/); // keine eigene Fläche
  assert.doesNotMatch(css, /--expanded|border-top-left-radius/);
  assert.match(decl('accordion', '.tl-accordion__header'), /min-height:\s*var\(--tl-size-bar\)/);
  assert.match(decl('accordion', '.tl-accordion__panel'), /padding:\s*var\(--tl-space-md\)/);
  assert.match(decl('accordion', '.tl-accordion__trigger:focus-visible'), /outline-offset:\s*calc\(-1 \* var\(--tl-focus-offset\)\)/);
  assert.match(decl('accordion', '.tl-accordion__trigger[aria-expanded="true"] > .tl-accordion__chevron'), /rotate:\s*90deg/);
});
```

  `design-system/test/contracts-4c.test.mjs` anlegen:

```js
// Die Verträge der Welle 4c nennen ihre Pflichtbegriffe; die neuen Specimen bestehen den Harness und zeigen die
// Zustände, die die Spec verlangt. Tasks 3 und 4 erweitern SOLL und SPECIMEN.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { missingInContract, specimenProblems } from './lib/component.mjs';
const datei = (d, f) => readFileSync(new URL(`../src/components/${d}/${f}`, import.meta.url), 'utf8');
const SOLL = {
  'panel/panel.contract.md': ['tl-panel', 'tl-titlebar', 'tl-titlebar__buttons', 'tl-panel__body', 'tl-button-bar',
    'data-tl-state~="minimized"', 'data-tl-state~="maximized"', 'aria-expanded', 'aria-controls', 'tl-panel--hover-actions',
    'tl-panel--full-line', '--tl-layer-raised', 'toggleMinimize', 'toggleMaximize', 'popOut', 'Escape'],
  'card/card.contract.md': ['tl-card', 'tl-card--nested', 'tl-card--overlay', 'tl-card__body', '--tl-surface-layer',
    '--tl-surface-layer-nested', '--tl-surface-overlay', 'elevated', 'useSurface'],
  'accordion/accordion.contract.md': ['tl-accordion', 'tl-card', 'tl-accordion__trigger', 'aria-expanded',
    'aria-controls', 'role="region"', 'toggleSection'],
  'button-bar/button-bar.contract.md': ['tl-button-bar'],
  'titlebar/titlebar.contract.md': ['tl-titlebar__content', 'tl-titlebar__buttons'],
  'dialog/dialog.contract.md': ['tl-button-bar'],
};
const SPECIMEN = ['panel', 'card', 'accordion'];

for (const [file, names] of Object.entries(SOLL)) test(`${file} nennt ${names.length} Pflichtbegriffe`, () => {
  const [d, f] = file.split('/');
  assert.deepEqual(missingInContract(datei(d, f), names), []);
});
for (const name of SPECIMEN)
  test(`${name}.spec.html besteht den Specimen-Harness`, () => assert.deepEqual(specimenProblems(datei(name, `${name}.spec.html`)), []));

test('panel.spec.html: Minimieren mit aria-expanded, aria-controls nur offen; minimiert, maximiert, als Karte', () => {
  const html = datei('panel', 'panel.spec.html');
  assert.match(html, /aria-expanded="true" aria-controls="p1-body"/);
  assert.match(html, /class="tl-panel" data-tl-state="minimized"/);
  assert.doesNotMatch(html, /aria-expanded="false" aria-controls=/);
  assert.match(html, /data-tl-state="maximized"/);
  assert.match(html, /class="tl-panel tl-card tl-panel--hover-actions"/);
  assert.match(html, /<div class="tl-button-bar">/);
  assert.match(html, /id="shrink"/);
});

test('card.spec.html: Karte auf der Seite, in einer Fläche (nested), im Dialog (overlay)', () => {
  const html = datei('card', 'card.spec.html');
  assert.match(html, /class="tl-card"/);
  assert.match(html, /class="tl-card tl-card--nested"/);
  assert.match(html, /tl-dialog__surface[\s\S]*class="tl-card tl-card--overlay"/);
});
```

  `design-system/test/titlebar-height.test.mjs` anlegen:

```js
// Jeder Kopf ist size-bar hoch, mit und ohne Toolbar (Spec 2026-10-16 Welle 4c §3, §9), und eine überlaufende
// Toolbar gibt vor dem Titel nach. Gemessen im Browser an panel.spec.html und dialog.spec.html, beide Dichten.
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

const HOEHEN = (density) => `(() => {
  document.documentElement.dataset.tlDensity = '${density}';
  const bar = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--tl-size-bar')) * 16;
  const koepfe = [...document.querySelectorAll('.tl-titlebar')]
    .filter((t) => t.getBoundingClientRect().height > 0 && !t.closest('[data-tl-state~="collapsed"]'))
    .map((t) => [t.querySelector('.tl-titlebar__title')?.textContent ?? '(ohne Titel)', t.getBoundingClientRect().height]);
  return { bar, koepfe };
})()`;

for (const page of ['/src/components/panel/panel.spec.html', '/src/components/dialog/dialog.spec.html'])
  for (const density of ['normal', 'compact'])
    test(`${page} [${density}]: jeder Kopf ist size-bar hoch`, async () => {
      await browser.goto(origin + page);
      const { bar, koepfe } = await browser.evaluate(HOEHEN(density));
      assert.ok(koepfe.length > 0, 'kein Kopf gefunden');
      const falsch = koepfe.filter(([, h]) => Math.abs(h - bar) > 0.5).map(([n, h]) => `${n}: ${h} px statt ${bar}`);
      assert.deepEqual(falsch, []);
    });

const NACHGEBEN = (px) => `(() => {
  const stage = document.querySelector('#shrink');
  stage.style.width = '${px}px';
  const title = stage.querySelector('.tl-titlebar__title');
  const actions = stage.querySelector('.tl-titlebar__actions');
  const control = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--tl-size-control')) * 16;
  return { titelGekuerzt: title.scrollWidth > title.clientWidth + 0.5, aktionen: actions.getBoundingClientRect().width, control };
})()`;

test('Panelkopf: bei 640 px ist der Titel ganz, bei 260 px hält die Toolbar am Knopf und der Titel kürzt', async () => {
  await browser.goto(origin + '/src/components/panel/panel.spec.html');
  const breit = await browser.evaluate(NACHGEBEN(640));
  assert.equal(breit.titelGekuerzt, false);
  assert.ok(breit.aktionen > breit.control + 1, `Aktionen ${breit.aktionen} px`);
  const schmal = await browser.evaluate(NACHGEBEN(260));
  assert.ok(Math.abs(schmal.aktionen - schmal.control) < 1, `Aktionen ${schmal.aktionen} px statt ${schmal.control}`);
  assert.equal(schmal.titelGekuerzt, true);
});
```

- [ ] **Step 2: Run** `node --test test/behaelter.test.mjs test/contracts-4c.test.mjs test/titlebar-height.test.mjs` —
  Expected: FAIL (`panel/panel.css` fehlt).

- [ ] **Step 3: `panel/panel.css`**

```css
/* Panel — Spec 2026-10-16 Welle 4c §3 (Q3, Q8, Q13, Q14). Eine Fläche mit Kopf (tl-titlebar), Körper und
   Knopfleiste (tl-button-bar). Minimiert und maximiert sind Zustände in data-tl-state; als Karte trägt die Wurzel
   zusätzlich tl-card. Bedienung wie ein Fenster (U1, U3): Doppelklick auf den Kopf maximiert, Escape stellt wieder
   her, ein minimiertes Panel öffnet ein Klick auf den ganzen Kopf — das TSX; hier steht nur der Zeiger. */

.tl-panel {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.tl-panel[hidden] { display: none; }

/* Maximiert deckt das Panel den Behälter, der es maximiert, über dessen Inhalt. */
.tl-panel[data-tl-state~="maximized"] {
  position: absolute;
  inset: 0;
  z-index: var(--tl-layer-raised);
  background: var(--tl-surface-base);
}

.tl-panel[data-tl-state~="minimized"] > .tl-titlebar {
  cursor: pointer;
}

/* Der Körper ist die Box, gegen die ein füllendes Kind seine Höhe auflöst: er nimmt, was das Panel übrig lässt, und
   scrollt, was nicht hineinpasst. Ein Kind, das nicht füllt, behält die Höhe seines Inhalts, statt gestaucht zu
   werden; ein füllendes (flex 1 1 0) braucht kein Schrumpfen. */
.tl-panel__body {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  overflow: auto;
}

.tl-panel__body > * {
  flex-shrink: 0;
}

/* Über die ganze Zeile eines Formular-Rasters: eine Variante, kein Zustand. */
.tl-panel--full-line {
  grid-column: 1 / -1;
}

/* Knöpfe beim Zeigen: die Regel der Ebenen-Liste (reorder-list.css) — unsichtbar, sichtbar beim Zeigen auf das Panel
   und bei Tastaturfokus darin (:focus-visible, nicht :focus-within: nach einem Mausklick bliebe der Fokus sonst
   stehen), auf Touch-Geräten immer. */
.tl-panel--hover-actions > .tl-titlebar > :is(.tl-titlebar__actions, .tl-titlebar__buttons) {
  opacity: 0;
  transition: opacity var(--tl-duration-base) var(--tl-easing-standard);
}

.tl-panel--hover-actions:hover > .tl-titlebar > :is(.tl-titlebar__actions, .tl-titlebar__buttons),
.tl-panel--hover-actions > .tl-titlebar > :is(.tl-titlebar__actions, .tl-titlebar__buttons):has(:focus-visible) {
  opacity: 1;
}

@media (hover: none) {
  .tl-panel--hover-actions > .tl-titlebar > :is(.tl-titlebar__actions, .tl-titlebar__buttons) {
    opacity: 1;
  }
}
```

  Vorher prüfen: `declarationsOf` trennt die Selektorliste an Kommas — `:is(…, …)` enthält ein Komma. Der Test aus
  Step 1 liest die Hover-Regeln deshalb mit einer Regex über die ganze Datei, nicht mit `decl`.

- [ ] **Step 4: `card/card.css`**

```css
/* Karte — Spec 2026-10-16 Welle 4c §4 (Q15), Weg B. Die eine Kartenfläche: Karte, Panel als Karte, Accordion. Die
   Fläche folgt der Verschachtelung — auf der Seite surface-layer, in einer Fläche (Karte, Accordion, Panel als Karte;
   ein schlichtes Panel malt keine und hebt nicht) surface-layer-nested, im Dialog die Fläche des Dialogs (nested läge dunkel unter surface-overlay und sänke ein).
   Hell sind layer und nested weiß; dort trennt die Linie (skalen.md „Elevation“). Kein Schatten: eine Karte liegt in
   der Oberfläche, darum zeichnet elevated wie outlined. Den Modifier der Stufe setzt das TSX aus useSurface(). */

.tl-card {
  min-height: min-content;
  overflow: clip;
  border: var(--tl-border-width-sm) solid var(--tl-border-separator);
  border-radius: var(--tl-radius-md);
  background: var(--tl-surface-layer);
  color: var(--tl-text-primary);
}

.tl-card--nested {
  background: var(--tl-surface-layer-nested);
}

.tl-card--overlay {
  background: var(--tl-surface-overlay);
}

/* Der Inhalt beginnt, wo der Titel beginnt: der Kopf rückt den Titel um space-md ein, der Körper ebenso. */
.tl-card__body--pad-default {
  padding: var(--tl-space-md);
}

.tl-card__body--pad-compact {
  padding: var(--tl-space-xs);
}
```

- [ ] **Step 5: `accordion/accordion.css`** — aus `tlReactControls.css` (Block „TLAccordion“, Worktree-Zeilen
  1021–1125) übernehmen, mit diesen Änderungen: Regel `.tl-accordion { … }` entfällt (die Wurzel trägt `tl-card`);
  die vier Regeln mit `border-*-radius` und `:first-child`/`:last-child:not(.tl-accordion__section--expanded)` entfallen
  (die Karte beschneidet); `padding-right` am Aktionsbereich wird `padding-inline-end`. Ergebnis:

```css
/* Accordion — Spec 2026-10-16 Welle 4c §4 (Q20). Bernhards Accordion (#29651) aus dem alten Stylesheet ins Paket;
   Anatomie und Tastatur (WAI-ARIA Accordion) bleiben. Die Fläche ist tl-card an der Wurzel — sie beschneidet am
   Radius, darum keine Eckregeln am Kopf. Hier steht, was die Abschnitte anders machen: Linien dazwischen, Kopf auf
   size-bar, Körper space-md. Der Ring liegt innen im Auslöser, weil der Kopf die ganze Breite spannt. */

.tl-accordion__section + .tl-accordion__section {
  border-top: var(--tl-border-width-sm) solid var(--tl-border-separator);
}

.tl-accordion__header {
  display: flex;
  align-items: center;
  gap: var(--tl-space-xs);
  min-height: var(--tl-size-bar);
}

.tl-accordion__header:hover {
  background: var(--tl-surface-interactive-hover);
}

.tl-accordion__heading {
  display: flex;
  flex: 1 1 auto;
  align-self: stretch;
  min-width: 0;
}

/* Reset ohne Spezifität: die Typo-Klasse am Element gewinnt. */
:where(.tl-accordion__trigger) { font: inherit; }

.tl-accordion__trigger {
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  gap: var(--tl-space-xs);
  min-width: 0;
  padding: 0 var(--tl-space-md);
  border: 0;
  background: transparent;
  color: inherit;
  text-align: start;
  cursor: pointer;
}

.tl-accordion__trigger:focus-visible {
  outline-offset: calc(-1 * var(--tl-focus-offset));
}

.tl-accordion__chevron {
  flex: none;
  color: var(--tl-icon-primary);
  transition: rotate var(--tl-duration-fast) var(--tl-easing-standard);
}

.tl-accordion__trigger[aria-expanded="true"] > .tl-accordion__chevron {
  rotate: 90deg;
}

.tl-accordion__icon {
  flex: none;
  color: var(--tl-icon-primary);
}

.tl-accordion__label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tl-accordion__actions {
  display: flex;
  flex: none;
  align-items: center;
  padding-inline-end: var(--tl-space-sm);
}

/* Ein Abschnitt ohne Befehle rendert eine leere Toolbar: kein Platz dafür. */
.tl-accordion__actions:empty {
  display: none;
}

.tl-accordion__panel {
  padding: var(--tl-space-md);
  border-top: var(--tl-border-width-sm) solid var(--tl-border-separator);
}
```

- [ ] **Step 6: Verträge** — `panel/panel.contract.md`:

```markdown
# Vertrag: Panel

Eine Fläche mit Kopf, Körper und Knopfleiste. TopLogic garantiert Kopf, Zustände und Bedienung, nicht das Aussehen.

## Zustand

Das Control ist `TLPanel` (`ReactPanelControl`).

| Schlüssel | Typ | Bedeutung |
|---|---|---|
| `title` | string | Titel, `h2` im `tl-titlebar` |
| `titleContent` | Kind, optional | frei gestalteter Inhalt neben dem Titel (`tl-titlebar__content`) |
| `toolbar` | Kind, optional | Toolbar im Kopf (`tl-titlebar__actions`) |
| `buttonBar` | Kind, optional | Toolbar am Fuß (`tl-button-bar`, Knöpfe secondary) |
| `expansionState` | `NORMALIZED` \| `MINIMIZED` \| `MAXIMIZED` \| `HIDDEN` | `data-tl-state~="minimized"`, `data-tl-state~="maximized"`; versteckt rendert nichts |
| `showMinimize`, `showMaximize`, `showPopOut` | boolean | Kopfknöpfe (`tl-titlebar__buttons`, Part `Button`, `small`) |
| `appearance` | `default` \| `card` | `card`: die Wurzel trägt `tl-card` (Vertrag `card`) |
| `hoverActions` | boolean | `tl-panel--hover-actions` |
| `fullLine` | boolean | `tl-panel--full-line` |

## Aktionen

| Befehl | Wann |
|---|---|
| `toggleMinimize` | Minimieren-Knopf; minimiert auch ein Klick auf den Kopf außerhalb seiner Knöpfe |
| `toggleMaximize` | Maximieren-Knopf; Doppelklick auf den Kopf außerhalb seiner Knöpfe; `Escape` im maximierten Panel, sofern kein Element darin Escape verbraucht hat |
| `popOut` | Lösen-Knopf |

## Tokens

| Teil | Token |
|---|---|
| Ebene maximiert | `--tl-layer-raised` |
| Grund maximiert | `--tl-surface-base` |
| Knöpfe beim Zeigen | `--tl-duration-base`, `--tl-easing-standard` |

## Attribute

| Attribut | Wann |
|---|---|
| `tl-panel` | immer |
| `tl-titlebar` | der Kopf, wenn er etwas trägt |
| `tl-titlebar__buttons` | um die Kopfknöpfe; Minimieren trägt `aria-expanded` (zu = minimiert) und, solange offen, `aria-controls` auf den Körper |
| `tl-panel__body` | der Körper, mit `id` |
| `tl-button-bar` | um die Knopfleiste |
| `data-tl-state~="minimized"`, `data-tl-state~="maximized"` | Zustand |

## Konformität

Ein Panel besteht den Vertrag, wenn sein Kopf `size-bar` hoch ist, Minimieren `aria-expanded` meldet und
Doppelklick, Escape und Kopfklick wie oben wirken, ohne einen Kopfknopf doppelt auszulösen.
```

  `card/card.contract.md`:

```markdown
# Vertrag: Karte

Eine Fläche, die in der Oberfläche liegt: Karte, Panel als Karte, Accordion. TopLogic garantiert Fläche nach Lage und
Kopf, nicht das Aussehen.

## Zustand

Das Control ist `TLCard` (`CardState` in `state.proto`): `title`, `headerActions`, `child`, `padding`
(`default` \| `compact` \| `none` → `tl-card__body--pad-<stufe>`), `variant` (`outlined` \| `elevated`; `elevated`
zeichnet wie `outlined` — eine Karte schwebt nicht).

## Fläche nach Lage (Weg B)

Die Stufe folgt der Verschachtelung, nicht einer Variante. Das TSX liest sie aus `useSurface()`:

| Lage | Klasse | Fläche |
|---|---|---|
| auf der Seite | `tl-card` | `--tl-surface-layer` |
| in einer Fläche (Karte, Accordion, Panel als Karte) | `tl-card` `tl-card--nested` | `--tl-surface-layer-nested` |
| in einem schlichten Panel | wie dort, wo das Panel liegt | (das Panel malt keine Fläche) |
| im Dialog oder Drawer | `tl-card` `tl-card--overlay` | `--tl-surface-overlay` |

Hell sind `layer` und `nested` weiß; dort trennt die Linie (`--tl-border-width-sm` `--tl-border-separator`).

## Attribute

| Attribut | Wann |
|---|---|
| `tl-card` | die Wurzel; beschneidet am Radius (`--tl-radius-md`) |
| `tl-titlebar` | Kopf mit Titel (`h2`) und Kopfaktionen (`tl-titlebar__actions`) |
| `tl-card__body` | Körper, mit `tl-card__body--pad-default` (`--tl-space-md`), `--pad-compact` (`--tl-space-xs`) oder `--pad-none` |

## Konformität

Eine Karte besteht den Vertrag, wenn sie keinen Schatten trägt und ihre Fläche aus der Tabelle oben nimmt.
```

  `accordion/accordion.contract.md`:

```markdown
# Vertrag: Accordion

Abschnitte untereinander, jeder klappt seinen Körper auf und zu (WAI-ARIA Accordion). Gebaut von Bernhard
(#29651), seit Welle 4c im Paket.

## Zustand

Das Control ist `TLAccordion` (`AccordionState`): `sections[]` mit `id`, `label`, `icon`, `expanded`, `actions`,
`content`; `exclusive`. Der Inhalt eines Abschnitts kommt beim ersten Öffnen und bleibt dann gemountet.

## Aktionen

| Befehl | Wann |
|---|---|
| `toggleSection` | Klick oder Enter/Leertaste am Auslöser; Argumente `sectionId`, `expanded` |

Pfeil auf/ab, Home und End bewegen den Fokus zwischen den Auslösern.

## Attribute

| Attribut | Wann |
|---|---|
| `tl-card` `tl-accordion` | an der Wurzel; die Fläche ist die Karte (Vertrag `card`) |
| `tl-accordion__section`, `tl-accordion__header`, `tl-accordion__heading` (`role="heading"`) | je Abschnitt |
| `tl-accordion__trigger` | der Auslöser, `button` mit `aria-expanded` und `aria-controls` auf den Körper |
| `tl-accordion__panel` | der Körper, `role="region"`, `aria-labelledby` auf den Auslöser, zu: `hidden` |

## Konformität

Ein Accordion besteht den Vertrag, wenn jeder Auslöser `aria-expanded` meldet und auf seinen Körper zeigt.
```

- [ ] **Step 7: Specimen** — drei Seiten nach dem Gerüst von `dialog.spec.html` (Kopf mit fünf Stylesheets, Leiste
  mit `id="mode"`/`id="density"`, Skript am Ende, kein `style="…"` außerhalb `<style>`). Inhalte:

  `panel/panel.spec.html` (`<title>TopLogic Design System — Panel</title>`; `<style>`: `.stage { position: relative;
  height: 14rem; } #shrink { max-width: 100%; height: auto; }`), Abschnitte `section.specimen__base`:

```html
  <section class="specimen__base"><p class="tl-type-heading-sm">Kopf mit Titel, Toolbar und Knöpfen; Körper; Knopfleiste</p>
    <div class="tl-panel">
      <div class="tl-titlebar">
        <h2 class="tl-titlebar__title tl-type-heading-sm" id="p1-title">Kunden</h2>
        <div class="tl-titlebar__actions"><div class="tl-toolbar" role="toolbar" aria-label="Befehle"><div class="tl-toolbar__group"><button type="button" class="tl-button tl-button--ghost"><span class="tl-button__label">Neu</span></button><button type="button" class="tl-button tl-button--ghost"><span class="tl-button__label">Export</span></button></div></div></div>
        <div class="tl-titlebar__buttons">
          <button type="button" class="tl-button tl-button--ghost tl-button--sm tl-button--icon" aria-label="Minimieren" aria-expanded="true" aria-controls="p1-body" data-tooltip="text:Minimieren"><i class="tl-icon-sm bi bi-dash-lg tl-button__icon" aria-hidden="true"></i></button>
          <button type="button" class="tl-button tl-button--ghost tl-button--sm tl-button--icon" aria-label="Maximieren" data-tooltip="text:Maximieren"><i class="tl-icon-sm bi bi-window tl-button__icon" aria-hidden="true"></i></button>
        </div>
      </div>
      <div class="tl-panel__body" id="p1-body"><div class="tl-inset tl-inset--panel"><p class="tl-type-body">Inhalt des Panels.</p></div></div>
      <div class="tl-button-bar"><div class="tl-toolbar" role="toolbar" aria-label="Aktionen"><div class="tl-toolbar__group"><button type="button" class="tl-button tl-button--secondary"><span class="tl-button__label">Abbrechen</span></button><button type="button" class="tl-button tl-button--primary"><span class="tl-button__label">Speichern</span></button></div></div></div>
    </div>
  </section>
  <section class="specimen__base"><p class="tl-type-heading-sm">Kopf ohne Toolbar — gleich hoch; nur Toolbar — am Ende</p>
    <div class="tl-panel">
      <div class="tl-titlebar"><h2 class="tl-titlebar__title tl-type-heading-sm">Ohne Toolbar</h2>
        <div class="tl-titlebar__buttons"><button type="button" class="tl-button tl-button--ghost tl-button--sm tl-button--icon" aria-label="Maximieren" data-tooltip="text:Maximieren"><i class="tl-icon-sm bi bi-window tl-button__icon" aria-hidden="true"></i></button></div>
      </div>
      <div class="tl-panel__body"><p class="tl-type-body">Körper.</p></div>
    </div>
    <div class="tl-panel">
      <div class="tl-titlebar"><div class="tl-titlebar__actions"><div class="tl-toolbar" role="toolbar" aria-label="Befehle"><div class="tl-toolbar__group"><button type="button" class="tl-button tl-button--ghost"><span class="tl-button__label">Aktualisieren</span></button></div></div></div></div>
      <div class="tl-panel__body"><p class="tl-type-body">Ein Kopf ohne Titel: die Toolbar steht am Ende.</p></div>
    </div>
  </section>
  <section class="specimen__base"><p class="tl-type-heading-sm">Minimiert: der ganze Kopf öffnet</p>
    <div class="tl-panel" data-tl-state="minimized">
      <div class="tl-titlebar"><h2 class="tl-titlebar__title tl-type-heading-sm">Minimiert</h2>
        <div class="tl-titlebar__buttons"><button type="button" class="tl-button tl-button--ghost tl-button--sm tl-button--icon" aria-label="Wiederherstellen" aria-expanded="false" data-tooltip="text:Wiederherstellen"><i class="tl-icon-sm bi bi-window-stack tl-button__icon" aria-hidden="true"></i></button></div>
      </div>
    </div>
  </section>
  <section class="specimen__base"><p class="tl-type-heading-sm">Als Karte, Knöpfe beim Zeigen</p>
    <div class="tl-panel tl-card tl-panel--hover-actions">
      <div class="tl-titlebar"><h2 class="tl-titlebar__title tl-type-heading-sm">Kommentar</h2>
        <div class="tl-titlebar__actions"><div class="tl-toolbar" role="toolbar" aria-label="Befehle"><div class="tl-toolbar__group"><button type="button" class="tl-button tl-button--ghost tl-button--icon" aria-label="Bearbeiten" data-tooltip="text:Bearbeiten"><i class="tl-icon-sm bi bi-pencil tl-button__icon" aria-hidden="true"></i></button></div></div></div>
      </div>
      <div class="tl-panel__body"><div class="tl-inset tl-inset--card"><p class="tl-type-body">Ein Eintrag einer Liste.</p></div></div>
    </div>
  </section>
  <section class="specimen__base"><p class="tl-type-heading-sm">Maximiert über dem Behälter</p>
    <div class="stage"><p class="tl-type-body">Darunter liegender Inhalt.</p>
      <div class="tl-panel" data-tl-state="maximized">
        <div class="tl-titlebar"><h2 class="tl-titlebar__title tl-type-heading-sm">Maximiert</h2>
          <div class="tl-titlebar__buttons"><button type="button" class="tl-button tl-button--ghost tl-button--sm tl-button--icon" aria-label="Wiederherstellen" data-tooltip="text:Wiederherstellen"><i class="tl-icon-sm bi bi-window-stack tl-button__icon" aria-hidden="true"></i></button></div>
        </div>
        <div class="tl-panel__body"><p class="tl-type-body">Escape stellt wieder her.</p></div>
      </div>
    </div>
  </section>
  <section class="specimen__base"><p class="tl-type-heading-sm">Nachgeben (titlebar-height.test.mjs setzt die Breite)</p>
    <div class="stage" id="shrink">
      <div class="tl-panel">
        <div class="tl-titlebar"><h2 class="tl-titlebar__title tl-type-heading-sm">Ein langer Titel des Panels, der zuletzt kürzt</h2>
          <div class="tl-titlebar__actions"><div class="tl-toolbar" role="toolbar" aria-label="Befehle" data-tl-overflow="trailing"><button type="button" class="tl-button tl-button--ghost"><span class="tl-button__label">Neu anlegen</span></button><button type="button" class="tl-button tl-button--ghost"><span class="tl-button__label">Exportieren</span></button><button type="button" class="tl-button tl-button--ghost"><span class="tl-button__label">Drucken</span></button></div></div>
        </div>
      </div>
    </div>
  </section>
```

  `card/card.spec.html` (`<style>`: `.stage { position: relative; height: 16rem; overflow: hidden; transform:
  translateZ(0); } .stage .tl-dialog { position: absolute; }`): drei Karten auf der Seite (`class="tl-card"`, Kopf mit
  `h2` und einem Kopfaktionen-Knopf in `tl-titlebar__actions`, Körper `tl-card__body tl-card__body--pad-default`,
  `--pad-compact`, `--pad-none` mit reinem Text); ein Panel (`tl-panel`, Körper `tl-panel__body`) mit einer Karte
  `class="tl-card tl-card--nested"`; ein Dialog wie in `dialog.spec.html` (`div.tl-dialog > div.tl-dialog__surface
  [role=dialog][aria-modal=true][aria-labelledby]` mit `tl-titlebar` und `tl-dialog__body`), im Körper eine Karte
  `class="tl-card tl-card--overlay"`. Ein Satz im Abschnittstitel: „elevated zeichnet wie outlined“.

  `accordion/accordion.spec.html`: `div.tl-card.tl-accordion` mit drei Abschnitten nach dem Markup von
  `TLAccordion.tsx` (Task 6 Step 4): der erste offen (`aria-expanded="true"`, Körper ohne `hidden`, Aktionen mit einem
  Ghost-Knopf), zwei zu (`hidden` am Körper). Ids `ac1-header-a`, `ac1-panel-a` usw.

- [ ] **Step 8: Index** — in `specimen/index.html` nach `BottomBar →` drei Links: `Panel →`
  (`/src/components/panel/panel.spec.html`), `Karte →`, `Accordion →`.

- [ ] **Step 9: Run** `node --test test/behaelter.test.mjs test/contracts-4c.test.mjs test/titlebar-height.test.mjs
  test/focus-clip.test.mjs` — Expected: PASS. Scheitert `focus-clip` an der Karte (`overflow: clip` schneidet einen Ring
  im Kopf), liegt ein Knopf zu nah am Rand: der Kopf rückt rechts um `space-xs` ein, der Ring reicht 4 px — der Befund
  heißt, das Markup im Specimen weicht vom Kopf ab.

- [ ] **Step 10: Gates und Commit** wie Task 1 Step 9/10; Paket-Commit „Ticket #29870: Paket -- tl-panel, tl-card
  (Stufe nach Verschachtelung), tl-accordion aus dem alten Stylesheet; Verträge, Specimen, Kopfhöhe im Browser“; Engine
  „Ticket #29870: Design system package -- panel, card with its surface from its nesting, accordion moved into the
  package.“

---

### Task 3: Paket — Reihen, Abstände, Teiler

**Files:**
- Create: `design-system/src/components/layout/layout.{css,contract.md,spec.html}`
- Create: `design-system/src/components/split/split.{css,contract.md,spec.html}`
- Modify: `design-system/src/components/columns/columns.contract.md` (Abschnitt „Klassen“, Q24)
- Modify: `design-system/tools/lib/pairs.mjs` (Zeile mit `paar('border-interactive', 'surface-overlay', 3.0)`)
- Modify: `design-system/test/behaelter.test.mjs`, `test/contracts-4c.test.mjs`, `specimen/index.html`

**Interfaces:**
- Produces: `tl-stack*`, `tl-grid*`, `tl-inset`, `tl-inset--panel|card`, `tl-bounded`, `tl-item`, `tl-deck`, die
  Auswahl `.tl-item[role="option"]`/`[aria-selected="true"]` und dieselbe an `.tl-columns__column` (Task 8);
  `tl-split`, `tl-split--horizontal|vertical`, `tl-split__pane`, `tl-split__handle` (Task 7).

- [ ] **Step 1: Failing tests** — an `behaelter.test.mjs` anfügen:

```js
test('eine Gap-Skala: Stack, Grid und Spalten lesen space-sm, -md, -lg', () => {
  for (const [stufe, token] of [['compact', 'sm'], ['default', 'md'], ['loose', 'lg']]) {
    for (const block of ['tl-stack', 'tl-grid'])
      assert.match(decl('layout', `.${block}--gap-${stufe}`), new RegExp(`gap:\\s*var\\(--tl-space-${token}\\)`), `${block} ${stufe}`);
    assert.match(decl('columns', `.tl-columns--gap-${stufe}`), new RegExp(`gap:\\s*var\\(--tl-space-${token}\\)`));
  }
});

test('tl-inset: auf der Seite space-lg, im Panel space-md, in der Karte space-xs space-md — keine eigene Variable', () => {
  assert.match(decl('layout', '.tl-inset'), /padding:\s*var\(--tl-space-lg\)/);
  assert.match(decl('layout', '.tl-inset--panel'), /padding:\s*var\(--tl-space-md\)/);
  assert.match(decl('layout', '.tl-inset--card'), /padding:\s*var\(--tl-space-xs\) var\(--tl-space-md\)/);
  assert.doesNotMatch(ohneKommentar(readGenerated('layout', 'layout.css')), /page-inset|--tl-grid-gap|tlFill/);
});

test('tl-bounded, tl-item, tl-deck: Breite mittig begrenzt, Hülle durchlässig, ein Kind ohne eigene Größe', () => {
  assert.match(decl('layout', '.tl-bounded'), /margin-inline:\s*auto/);
  assert.match(decl('layout', '.tl-item'), /min-height:\s*0/);
  assert.match(decl('layout', '.tl-deck'), /flex-direction:\s*column/);
});

// Q24 (#29755): eine Option schwebt nicht — beim Zeigen ein Hof; ausgewählt ein Ring über dem Eintrag, Zustand aus
// aria-selected; Fokus aus base.css. Für die Hülle tl-item und die Spalte von tl-columns, die useItems als Hülle nimmt.
test('auswählbare Einträge (Q24): Hof beim Zeigen, Ring bei aria-selected, kein Schatten, keine Zustandsklasse', () => {
  for (const host of ['.tl-item', '.tl-columns__column']) {
    assert.match(decl('layout', `${host}[role="option"]`), /position:\s*relative/, host);
    assert.match(decl('layout', `${host}[role="option"]`), /cursor:\s*pointer/, host);
    assert.match(decl('layout', `${host}[role="option"]`), /transition:\s*box-shadow var\(--tl-duration-fast\) var\(--tl-easing-standard\)/, host);
    assert.match(decl('layout', `${host}[role="option"]:hover`), /box-shadow:\s*0 0 0 var\(--tl-space-2xs\) var\(--tl-surface-state-hover\)/, host);
    const ring = decl('layout', `${host}[aria-selected="true"]::after`);
    assert.match(ring, /border:\s*var\(--tl-border-width-md\) solid var\(--tl-border-interactive\)/, host);
    assert.match(ring, /inset:\s*0/, host);
    assert.match(ring, /pointer-events:\s*none/, host);
  }
  const css = ohneKommentar(readGenerated('layout', 'layout.css'));
  assert.doesNotMatch(css, /--selectable|--selected|--tl-shadow|outline|surface-brand-subtle/);
});

test('tl-split: Richtung aus dem Modifier, Griff space-xs mit Linie; unter dem Zeiger, beim Ziehen, mit Fokus kräftig', () => {
  assert.match(decl('split', '.tl-split--horizontal'), /flex-direction:\s*row/);
  assert.match(decl('split', '.tl-split--vertical[data-tl-state~="all-collapsed"]'), /flex-direction:\s*row/);
  assert.match(decl('split', '.tl-split--horizontal > .tl-split__handle'), /width:\s*var\(--tl-space-xs\)/);
  assert.match(decl('split', '.tl-split--horizontal > .tl-split__handle'), /cursor:\s*col-resize/);
  assert.match(decl('split', '.tl-split__handle::after'), /background:\s*var\(--tl-border-separator\)/);
  const aktiv = ohneKommentar(readGenerated('split', 'split.css'));
  assert.match(aktiv, /\.tl-split__handle:focus-visible::after[\s\S]*?background:\s*var\(--tl-border-interactive\)/);
  assert.match(decl('split', '.tl-split__handle:focus-visible'), /outline-offset:\s*calc\(-1 \* var\(--tl-focus-offset\)\)/);
});

test('die kräftige Linie des Griffs steht im Kontrast-Gate auf Grund und Layer (Spec §9)', async () => {
  const { kontrastPaare } = await import('../tools/lib/pairs.mjs');
  const P = kontrastPaare(T).map((p) => `${p.fg}|${p.bg}`);
  for (const bg of ['surface-base', 'surface-layer']) assert.ok(P.includes(`border-interactive|${bg}`), bg);
});

test('eingeklappt im waagrechten Split: Titel senkrecht über writing-mode, nicht gedreht', () => {
  const css = ohneKommentar(readGenerated('split', 'split.css'));
  assert.match(css, /writing-mode:\s*vertical-rl/);
  assert.doesNotMatch(css, /rotate/);
});
```

  In `contracts-4c.test.mjs` `SOLL` ergänzen:

```js
  'layout/layout.contract.md': ['tl-stack', 'tl-grid', 'tl-inset', 'tl-inset--panel', 'tl-inset--card', 'tl-bounded',
    'tl-item', 'tl-deck', '--item-index', '--tl-space-sm', '--tl-space-md', '--tl-space-lg', 'useSurface',
    'role="listbox"', 'role="option"', 'aria-selected', 'selectItem', '--tl-surface-state-hover', '--tl-border-interactive'],
  'split/split.contract.md': ['tl-split', 'tl-split__pane', 'tl-split__handle', 'role="separator"', 'aria-valuenow',
    'aria-orientation', 'aria-controls', 'data-tl-state~="collapsed"', 'updateSizes', 'resetSizes', 'Home', 'End'],
```

  und `'layout', 'split'` an `SPECIMEN` anhängen, dazu:

```js
test('layout.spec.html: eine Liste auswählbarer Karten, eine ausgewählt, ohne Zustandsklasse', () => {
  const html = datei('layout', 'layout.spec.html');
  assert.match(html, /role="listbox"/);
  assert.equal((html.match(/class="tl-item" role="option"/g) ?? []).length >= 3, true);
  assert.match(html, /class="tl-item" role="option" aria-selected="true" tabindex="0"/);
  assert.doesNotMatch(html, /--selectable|--selected/);
});

test('split.spec.html: Griff fokussierbar mit Wert; eine eingeklappte Fläche im waagrechten Split', () => {
  const html = datei('split', 'split.spec.html');
  assert.match(html, /class="tl-split__handle" role="separator" tabindex="0" aria-orientation="vertical"[^>]*aria-valuenow="30"/);
  assert.match(html, /class="tl-split__pane" data-tl-state="collapsed"/);
});
```

- [ ] **Step 2: Run** `node --test test/behaelter.test.mjs test/contracts-4c.test.mjs` — Expected: FAIL (`layout.css`
  fehlt).

- [ ] **Step 3: `layout/layout.css`**

```css
/* Reihen und Abstände — Spec 2026-10-16 Welle 4c §5 (Q16, Q22). Stack und Grid ordnen Kinder mit der einen
   Gap-Skala, die tl-columns seit 3b liest: compact space-sm, default space-md, loose space-lg. Inset ist der Abstand
   eines Inhalts zum Rand; wie weit, sagt die nächste Fläche über React-Kontext (useSurface) als Modifier — ohne
   Modifier die Seite. Bounded begrenzt die Breite und mittelt, Item umhüllt wiederholte Kinder, Deck zeigt eines zur
   Zeit und nimmt seine Größe. Wer füllt, entscheidet der Fill-Vertrag (tlFill, bis Welle 5 im alten Stylesheet). */

.tl-stack {
  display: flex;
}
.tl-stack[hidden] { display: none; }

.tl-stack--column { flex-direction: column; }
.tl-stack--row { flex-direction: row; }

.tl-stack--gap-compact, .tl-grid--gap-compact { gap: var(--tl-space-sm); }
.tl-stack--gap-default, .tl-grid--gap-default { gap: var(--tl-space-md); }
.tl-stack--gap-loose, .tl-grid--gap-loose { gap: var(--tl-space-lg); }

.tl-stack--align-start { align-items: start; }
.tl-stack--align-center { align-items: center; }
.tl-stack--align-end { align-items: end; }
.tl-stack--align-stretch { align-items: stretch; }

/* Wie der freie Platz entlang der Richtung verteilt wird. */
.tl-stack--justify-start { justify-content: start; }
.tl-stack--justify-center { justify-content: center; }
.tl-stack--justify-end { justify-content: end; }
.tl-stack--justify-space-between { justify-content: space-between; }
.tl-stack--justify-space-around { justify-content: space-around; }
.tl-stack--justify-space-evenly { justify-content: space-evenly; }

.tl-stack--wrap { flex-wrap: wrap; }

/* Das erste Kind füllt die Hauptachse (Eingabe mit Knopf daneben). */
.tl-stack--grow-first.tl-stack--row > :first-child { flex: 1 1 auto; min-width: 0; }
.tl-stack--grow-first.tl-stack--column > :first-child { flex: 1 1 auto; min-height: 0; }

/* Die Spaltenvorlage rechnet das TSX inline (sie hängt an Mindestbreite und Höchstzahl); den Abstand liest es aus
   derselben Stufe wie die Regeln oben. */
.tl-grid {
  display: grid;
}
.tl-grid[hidden] { display: none; }

/* Gibt den Platz, den es bekommt, an seinen Inhalt weiter: eine begrenzte Spalte, gegen die ein füllender Inhalt
   seine Höhe auflöst. */
.tl-inset {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: var(--tl-space-lg);
}
.tl-inset[hidden] { display: none; }

.tl-inset--panel {
  padding: var(--tl-space-md);
}

.tl-inset--card {
  padding: var(--tl-space-xs) var(--tl-space-md);
}

/* Die Breite eines Stacks oder Grids, begrenzt durch ein Inline-max-width, in seinem Behälter mittig. Ohne die
   Breite schrumpften die automatischen Ränder ihn auf seinen Inhalt. */
.tl-bounded {
  width: 100%;
  margin-inline: auto;
}

/* Die Hülle eines wiederholten Kindes (useItems); sie gibt den Platz an das Kind weiter. Ihre Position trägt sie
   als --item-index, ein Datum der Engine für Anwendungs-CSS. */
.tl-item {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
}
.tl-item[hidden] { display: none; }

/* Auswählbar (Q24, #29755): ist der Behälter eine Listbox, ist jeder Eintrag eine Option, und die ganze Fläche nimmt
   den Klick. Ein Eintrag schwebt nicht: beim Zeigen ein Hof, kein Schatten. Ausgewählt liegt ein Ring über dem Rand
   des Eintrags — eine Auswahlfläche läge hinter einer Karte mit eigener Fläche —, der Zustand ist aria-selected; der
   Fokus ist der Ring aus base.css. Die Spalte von tl-columns ist dieselbe Hülle (useItems) und trägt dieselbe Regel. */
.tl-item[role="option"],
.tl-columns__column[role="option"] {
  position: relative;
  border-radius: var(--tl-radius-md);
  cursor: pointer;
  transition: box-shadow var(--tl-duration-fast) var(--tl-easing-standard);
}

.tl-item[role="option"]:hover,
.tl-columns__column[role="option"]:hover {
  box-shadow: 0 0 0 var(--tl-space-2xs) var(--tl-surface-state-hover);
}

.tl-item[aria-selected="true"]::after,
.tl-columns__column[aria-selected="true"]::after {
  content: "";
  position: absolute;
  inset: 0;
  border: var(--tl-border-width-md) solid var(--tl-border-interactive);
  border-radius: inherit;
  pointer-events: none;
}

/* Zeigt ein Kind zur Zeit und nimmt dessen Größe: neben einer Breadcrumb, in der AppBar so groß wie sein Inhalt. */
.tl-deck {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
}
.tl-deck[hidden] { display: none; }
```

- [ ] **Step 4: `split/split.css`**

```css
/* Split — Spec 2026-10-16 Welle 4c §6 (Q17). Flächen nebeneinander oder untereinander, dazwischen ein Griff mit
   role=separator: fokussierbar, Pfeiltasten, Home und End (bridge/separator.ts, derselbe wie der Spaltengriff der
   Tabelle). In Ruhe eine Linie — Flächen brauchen eine Grenze —, unter dem Zeiger, beim Ziehen und mit Fokus kräftig.
   Sind alle Flächen eingeklappt, kippt die Achse (data-tl-state~="all-collapsed"); eine eingeklappte Fläche im
   waagrechten Split zeigt den Kopf ihres Panels als schmale Spalte mit senkrechtem Titel. */

.tl-split {
  display: flex;
  width: 100%;
  height: 100%;
}
.tl-split[hidden] { display: none; }

.tl-split--horizontal { flex-direction: row; }
.tl-split--vertical { flex-direction: column; }
.tl-split--horizontal[data-tl-state~="all-collapsed"] { flex-direction: column; }
.tl-split--vertical[data-tl-state~="all-collapsed"] { flex-direction: row; }

.tl-split__handle {
  position: relative;
  flex: none;
  touch-action: none;
}

.tl-split--horizontal > .tl-split__handle {
  width: var(--tl-space-xs);
  cursor: col-resize;
}

.tl-split--vertical > .tl-split__handle {
  height: var(--tl-space-xs);
  cursor: row-resize;
}

.tl-split__handle::after {
  content: "";
  position: absolute;
  background: var(--tl-border-separator);
}

.tl-split--horizontal > .tl-split__handle::after {
  top: 0;
  bottom: 0;
  left: 50%;
  width: var(--tl-border-width-sm);
  translate: -50% 0;
}

.tl-split--vertical > .tl-split__handle::after {
  right: 0;
  left: 0;
  top: 50%;
  height: var(--tl-border-width-sm);
  translate: 0 -50%;
}

.tl-split__handle:hover::after,
.tl-split__handle:active::after,
.tl-split__handle:focus-visible::after {
  background: var(--tl-border-interactive);
}

.tl-split--horizontal > .tl-split__handle:is(:hover, :active, :focus-visible)::after {
  width: var(--tl-border-width-md);
}

.tl-split--vertical > .tl-split__handle:is(:hover, :active, :focus-visible)::after {
  height: var(--tl-border-width-md);
}

/* Der Ring liegt innen: der Griff ist space-xs breit, der Ring reicht nicht über ihn hinaus. */
.tl-split__handle:focus-visible {
  outline-offset: calc(-1 * var(--tl-focus-offset));
}

/* Eingeklappt im waagrechten Split: der Kopf als schmale Spalte, Knöpfe oben, Titel senkrecht darunter. */
.tl-split__pane[data-tl-state~="collapsed"] .tl-titlebar {
  flex-direction: column-reverse;
  justify-content: start;
  align-items: center;
  height: 100%;
  padding: var(--tl-space-xs);
  border-bottom: 0;
}

.tl-split__pane[data-tl-state~="collapsed"] .tl-titlebar__title {
  flex: 0 1 auto;
  writing-mode: vertical-rl;
}

.tl-split__pane[data-tl-state~="collapsed"] :is(.tl-titlebar__actions, .tl-titlebar__buttons) {
  flex-direction: column;
}
```

  Vor dem Lauf prüfen: `declarationsOf` findet `.tl-split__handle::after` als eigenen Selektor (er steht allein), den
  Fokus-Hover-Selektor liest der Test per Regex.

  `tools/lib/pairs.mjs`: in der Zeile `paar('border-interactive', 'surface-overlay', 3.0); …` davor
  `paar('border-interactive', 'surface-layer', 3.0); // Griff des Splits auf einer Fläche (Welle 4c)` einfügen.
  Beim Planen gemessen: hell 5,84, dunkel 5,49 (die drei Stufen der Wizard-Scheibe: `border-control` auf `nested`
  3,42/3,39, `text-secondary` auf `nested` 7,34/5,94, `text-on-brand` auf `surface-brand` 5,84/5,66). Scheitert
  `contrast.test.mjs` trotzdem in einem Modus, **nicht** an Token oder Primitiv drehen: Befund mit Messwert an den
  Orchestrator melden (Entscheidung mit sichtbarer Folge).

- [ ] **Step 5: Verträge** — `layout/layout.contract.md`:

```markdown
# Vertrag: Reihen und Abstände

Stack, Grid, Inset, Bounded, Item und Deck — die Bausteine, mit denen Ansichten ihre Kinder ordnen. Kein Aussehen,
nur Lage und Abstand. Die Gap-Skala teilen sie mit `tl-columns`.

## Zustand

| Control | Schlüssel | Klasse |
|---|---|---|
| `TLStack` | `direction`, `gap`, `align`, `justify`, `wrap`, `growFirst`, `maxWidth`, `itemClass` | `tl-stack` mit `tl-stack--<richtung>`, `--gap-<stufe>`, `--align-<wert>`, `--justify-<wert>`, `--wrap`, `--grow-first`; mit `maxWidth` zusätzlich `tl-bounded` |
| `TLGrid` | `columns`, `minColumnWidth`, `maxColumns`, `gap`, `maxWidth`, `itemClass` | `tl-grid tl-grid--gap-<stufe>`; die Spaltenvorlage inline; Abstand im TSX aus derselben Stufe |
| `TLInset` | `child` | `tl-inset`, in einem Panel `tl-inset--panel`, in einer Karte `tl-inset--card` (aus `useSurface()`) |
| `TLDeckPane` | `activeChild` | `tl-deck` |
| Hülle wiederholter Kinder | `itemClass` | `tl-item` und die konfigurierte Klasse; Position als `--item-index` (0-basiert) |
| Auswahl unter den Einträgen | `selectable`, `itemKeys`, `selected`, `multiSelect` | der Behälter `role="listbox"` (mehrfach: `aria-multiselectable`), jede Hülle `role="option"` mit `aria-selected`; kein Modifier |

## Aktionen

| Befehl | Wann |
|---|---|
| `selectItem` | Klick auf einen Eintrag (mit Strg/Cmd umschalten, mit Umschalt erweitern), Enter oder Leertaste am Eintrag, langes Drücken (mehrfach); Argumente `key`, `toggle`, `range`. Ein Klick auf ein bedienbares Element im Eintrag gehört diesem |

## Tokens

| Stufe | Token |
|---|---|
| `compact` | `--tl-space-sm` |
| `default` | `--tl-space-md` |
| `loose` | `--tl-space-lg` |
| Inset Seite / Panel / Karte | `--tl-space-lg` / `--tl-space-md` / `--tl-space-xs` `--tl-space-md` |
| Option beim Zeigen | Hof `--tl-space-2xs` in `--tl-surface-state-hover` |
| Option ausgewählt | Ring `--tl-border-width-md` in `--tl-border-interactive` über dem Eintrag, Radius `--tl-radius-md` |

## Konformität

Ein Behälter besteht den Vertrag, wenn er seinen Abstand aus der Skala oben nimmt und keine eigene Custom Property
im Namensraum `--tl` setzt; ein auswählbarer meldet die Auswahl über `aria-selected`, nicht über eine Klasse.
```

  `split/split.contract.md`:

```markdown
# Vertrag: Split

Flächen nebeneinander (`horizontal`) oder untereinander (`vertical`), dazwischen ein Griff. TopLogic garantiert
Bedienung mit Maus und Tastatur, nicht das Aussehen.

## Zustand

Das Control ist `TLSplitPanel` (`ReactSplitPanelControl`): `orientation`, `resizable`, `children[]` mit `size`,
`unit`, `minSize`, `scrolling`, `collapsed`.

## Aktionen

| Befehl | Wann |
|---|---|
| `updateSizes` | nach dem Ziehen und nach dem Loslassen einer Taste; Argument `sizes` (Pixel je Fläche) |
| `resetSizes` | Doppelklick auf den Griff: die konfigurierte Aufteilung gilt wieder, die persönliche wird vergessen |

Tasten am Griff: Pfeile quer zum Griff um `--tl-space-md` (rechts-nach-links gespiegelt), `Home` an die kleinste,
`End` an die größte Größe der Fläche davor.

## Attribute

| Attribut | Wann |
|---|---|
| `tl-split` `tl-split--horizontal` \| `tl-split--vertical` | Wurzel; alle eingeklappt: `data-tl-state~="all-collapsed"` |
| `tl-split__pane` | je Fläche, mit `id`; eingeklappt im waagrechten Split `data-tl-state~="collapsed"` |
| `tl-split__handle` | zwischen zwei offenen Flächen: `role="separator"`, `tabindex="0"`, `aria-orientation` (`vertical` zwischen Flächen nebeneinander), `aria-controls` auf die Fläche davor, `aria-valuenow` (Anteil der Fläche davor in Prozent), `aria-valuemin`, `aria-valuemax`, `aria-label` aus i18n |

## Tokens

| Teil | Token |
|---|---|
| Trefferzone | `--tl-space-xs` |
| Linie | `--tl-border-width-sm` `--tl-border-separator`; aktiv `--tl-border-width-md` `--tl-border-interactive` |

## Konformität

Ein Split besteht den Vertrag, wenn jeder Griff mit der Tastatur bedienbar ist und seinen Wert meldet.
```

  `columns/columns.contract.md`, Abschnitt „Klassen“, Zeile anfügen:

```markdown
| `tl-columns__column` mit `role="option"` und `aria-selected` | die Reihe ist auswählbar (`selectable`, `useItems`): die Spalte ist Option; Zeigen und Auswahl zeichnet die Regel der Einträge in `layout.css` (Vertrag `layout`) |
```

- [ ] **Step 6: Specimen** — `layout/layout.spec.html` (`<style>`: `.box { min-height: 2rem; min-width: 4rem;
  background: var(--tl-surface-brand-subtle); border: 1px dashed var(--tl-border-interactive); }
  .wrap { background: var(--tl-surface-layer); }`): je Stufe ein `div.tl-stack.tl-stack--row.tl-stack--gap-<stufe>`
  mit drei `div.box`; ein `div.tl-grid.tl-grid--gap-default` mit `grid-template-columns` über eine `<style>`-Klasse
  `.cols3 { grid-template-columns: repeat(3, 1fr); }` und sechs Boxen; `div.wrap > div.tl-inset > div.box`,
  `div.tl-panel > div.tl-panel__body > div.tl-inset.tl-inset--panel > div.box`, dasselbe in `div.tl-card` mit
  `tl-inset--card`; `div.tl-stack.tl-stack--column.tl-bounded.narrow` (`.narrow { max-width: 20rem; }`) mit Boxen in
  `div.tl-item`; `div.tl-deck > div.box`; eine Liste auswählbarer Karten (Q24) — keine Inline-Styles
  (`specimenProblems`), also ohne `--item-index`:

```html
<div class="tl-stack tl-stack--column tl-stack--gap-compact narrow" role="listbox" aria-label="Exposés">
  <div class="tl-item" role="option" aria-selected="false" tabindex="-1"><div class="tl-card"><div class="tl-card__body tl-card__body--pad-default"><p class="tl-type-body">Altbau am Park</p></div></div></div>
  <div class="tl-item" role="option" aria-selected="true" tabindex="0"><div class="tl-card"><div class="tl-card__body tl-card__body--pad-default"><p class="tl-type-body">Loft am Hafen</p></div></div></div>
  <div class="tl-item" role="option" aria-selected="false" tabindex="-1"><div class="tl-card"><div class="tl-card__body tl-card__body--pad-default"><p class="tl-type-body">Reihenhaus am Feld</p></div></div></div>
</div>
```

  `focus-clip` misst den Fokusring der fokussierbaren Option (`tabindex="0"`): der Stack schneidet nicht.

  `split/split.spec.html` (`<style>`: `.stage { height: 12rem; } .stage .tl-split__pane { flex: 1 1 0; min-width: 0;
  min-height: 0; } .stage .tl-split__pane[data-tl-state~="collapsed"] { flex: 0 0 auto; }`): (1) waagrecht, zwei
  Flächen mit je einem `tl-panel` (Kopf, Körper), dazwischen

```html
<div class="tl-split__handle" role="separator" tabindex="0" aria-orientation="vertical" aria-controls="s1-a" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100" aria-label="Größe der Bereiche ändern"></div>
```

  (Flächen `id="s1-a"`, `id="s1-b"`); (2) senkrecht (`aria-orientation="horizontal"`); (3) waagrecht, die erste Fläche
  `class="tl-split__pane" data-tl-state="collapsed"` mit einem minimierten Panel (Kopf mit Titel „Navigation“ und
  einem Wiederherstellen-Knopf), kein Griff daneben.

- [ ] **Step 7: Index** — Links `Reihen →` (`layout`), `Split →`.

- [ ] **Step 8: Run** `node --test test/behaelter.test.mjs test/contracts-4c.test.mjs test/focus-clip.test.mjs` —
  Expected: PASS.

- [ ] **Step 9: Gates und Commit** wie Task 1; Paket „Ticket #29870: Paket -- Reihen und Abstände aus einer Skala
  (tl-stack, tl-grid, tl-inset, tl-bounded, tl-item, tl-deck), tl-split mit fokussierbarem Griff“; Engine „Ticket
  #29870: Design system package -- stacks and grids on one gap scale, insets set by their surface, a split handle
  that takes the keyboard.“

---

### Task 4: Paket — Bewegung, TileStack, Wizard, AdaptiveDetail; Leser nachgezogen

**Files:**
- Create: `design-system/src/components/slide/slide.{css,contract.md}`
- Create: `design-system/src/components/tile-stack/tile-stack.{css,contract.md}`
- Create: `design-system/src/components/wizard/wizard.{css,contract.md,spec.html}`
- Create: `design-system/src/components/adaptive-detail/adaptive-detail.{css,contract.md,spec.html}`
- Modify: `design-system/src/components/breadcrumb/breadcrumb.contract.md`, `alert/alert.contract.md`,
  `table/table.contract.md` (Leser)
- Modify: `design-system/src/components/drawer/drawer.css` (nach `.tl-drawer--container`), `drawer.contract.md`
  (Abweichung 18)
- Modify: `design-system/test/behaelter.test.mjs`, `test/contracts-4c.test.mjs`, `specimen/index.html`

**Interfaces:**
- Consumes: `--tl-size-wizard-progress` (Task 1).
- Produces: `tl-slide-*` (Keyframes), `tl-tile-stack`, `tl-tile-stack__frame`, `tl-wizard*`, `tl-adaptive-detail*`
  (Task 9).

- [ ] **Step 1: Failing tests** — an `behaelter.test.mjs` anfügen:

```js
test('ein Versatz für Wizard und TileStack: tl-slide-* aus space-md, keine px', () => {
  const css = ohneKommentar(readGenerated('slide', 'slide.css'));
  for (const name of ['tl-slide-in-forward', 'tl-slide-in-backward', 'tl-slide-out-forward', 'tl-slide-out-backward'])
    assert.match(css, new RegExp(`@keyframes ${name}\\b`));
  assert.match(css, /translateX\(var\(--tl-space-md\)\)/);
  assert.match(css, /translateX\(calc\(-1 \* var\(--tl-space-md\)\)\)/);
  for (const dir of ['tile-stack', 'wizard'])
    assert.doesNotMatch(ohneKommentar(readGenerated(dir, `${dir}.css`)), /\d+px|@keyframes/, dir);
});

test('Übergänge als Attribute: entering/exiting/backward in data-tl-state, verdeckter Rahmen ebenso', () => {
  const t = ohneKommentar(readGenerated('tile-stack', 'tile-stack.css'));
  assert.match(t, /\.tl-tile-stack__frame\[data-tl-state~="entering"\]\s*\{[^}]*animation:\s*tl-slide-in-forward var\(--tl-duration-slow\) var\(--tl-easing-entrance\)/);
  assert.match(t, /\.tl-tile-stack\[data-tl-state~="backward"\] > \.tl-tile-stack__frame\[data-tl-state~="entering"\]/);
  assert.match(t, /:dir\(rtl\)/);
  assert.match(decl('tile-stack', '.tl-tile-stack__frame[data-tl-state~="covered"]'), /visibility:\s*hidden/);
  const w = ohneKommentar(readGenerated('wizard', 'wizard.css'));
  assert.match(w, /\.tl-wizard__step\[data-tl-state~="exiting"\]\s*\{[^}]*animation:\s*tl-slide-out-forward var\(--tl-duration-slow\) var\(--tl-easing-exit\) forwards/);
});

test('Wizard: drei Stufen der Scheibe aus Rollen, Breite des Balkens als Token', () => {
  const d = decl('wizard', '.tl-wizard__disc');
  assert.match(d, /width:\s*var\(--tl-size-icon-lg\)/);
  assert.match(d, /border-radius:\s*var\(--tl-radius-full\)/);
  assert.match(d, /background:\s*var\(--tl-surface-layer-nested\)/);
  assert.match(d, /border:\s*var\(--tl-border-width-sm\) solid var\(--tl-border-control\)/);
  assert.match(decl('wizard', '.tl-wizard__step-item[data-tl-state~="done"] > .tl-wizard__disc'), /background:\s*var\(--tl-surface-brand-subtle\)/);
  const c = decl('wizard', '.tl-wizard__step-item[aria-current="step"] > .tl-wizard__disc');
  assert.match(c, /background:\s*var\(--tl-surface-brand\)/);
  assert.match(c, /color:\s*var\(--tl-text-on-brand\)/);
  assert.match(decl('wizard', '.tl-wizard__progress'), /max-width:\s*var\(--tl-size-wizard-progress\)/);
});

test('Wizard: die Paare der Scheibe stehen im Kontrast-Gate', async () => {
  const { kontrastPaare } = await import('../tools/lib/pairs.mjs');
  const P = kontrastPaare(T).map((p) => `${p.fg}|${p.bg}`);
  for (const p of ['text-on-brand|surface-brand', 'text-primary|surface-brand-subtle', 'text-secondary|surface-layer-nested',
    'border-control|surface-layer-nested', 'border-control|surface-base', 'border-control|surface-layer'])
    assert.ok(P.includes(p), p);
});

test('AdaptiveDetail: Behälter des Drawers, Leiste der Breadcrumb auf size-bar mit Linie', () => {
  const r = decl('adaptive-detail', '.tl-adaptive-detail');
  assert.match(r, /position:\s*relative/);
  assert.match(r, /overflow:\s*clip/);
  // Der Behälter beschneidet; der Ring der Schublade darin liegt innen (Abweichung 18, focus-clip).
  assert.match(decl('drawer', '.tl-drawer--container:focus-visible'), /outline-offset:\s*calc\(-1 \* var\(--tl-focus-offset\)\)/);
  const b = decl('adaptive-detail', '.tl-adaptive-detail__bar');
  assert.match(b, /min-height:\s*var\(--tl-size-bar\)/);
  assert.match(b, /border-bottom:\s*var\(--tl-border-width-sm\) solid var\(--tl-border-separator\)/);
});
```

  In `contracts-4c.test.mjs` `SOLL` ergänzen:

```js
  'slide/slide.contract.md': ['tl-slide-in-forward', 'tl-slide-out-backward', '--tl-space-md'],
  'tile-stack/tile-stack.contract.md': ['tl-tile-stack', 'tl-tile-stack__frame', 'data-tl-state~="covered"',
    'data-tl-state~="entering"', 'data-tl-state~="exiting"', 'data-tl-state~="backward"', 'useKeyedTransition'],
  'wizard/wizard.contract.md': ['tl-wizard', 'tl-wizard__steps', 'tl-wizard__disc', 'aria-current="step"',
    'data-tl-state~="done"', 'aria-hidden', 'tl-button--link', '--tl-size-wizard-progress', 'gotoStep', 'advanceStep'],
  'adaptive-detail/adaptive-detail.contract.md': ['tl-adaptive-detail', 'tl-adaptive-detail__bar', 'tl-breadcrumb',
    'aria-current="page"', 'tl-drawer--container', 'navigate'],
  'breadcrumb/breadcrumb.contract.md': ['tl-adaptive-detail'],
  'alert/alert.contract.md': ['ViewLoadError', 'TLHtml'],
  'table/table.contract.md': ['tabindex="0"', 'aria-valuenow', 'columnResize'],
```

  `'wizard', 'adaptive-detail'` an `SPECIMEN` anhängen, dazu:

```js
test('wizard.spec.html: erledigt, aktuell, kommend; die Liste hat einen Namen, Zähler und Scheiben sind still', () => {
  const html = datei('wizard', 'wizard.spec.html');
  assert.match(html, /<ol class="tl-wizard__steps" aria-label="[^"]+"/);
  assert.match(html, /class="tl-wizard__step-item" data-tl-state="done"/);
  assert.match(html, /class="tl-wizard__step-item" aria-current="step"/);
  assert.match(html, /class="tl-wizard__counter tl-type-label tl-nums" aria-hidden="true"/);
  assert.match(html, /class="tl-wizard__disc tl-type-label tl-nums" aria-hidden="true"/);
});

test('adaptive-detail.spec.html: die letzte Krume ist die aktuelle Seite, der Drawer liegt im Behälter', () => {
  const html = datei('adaptive-detail', 'adaptive-detail.spec.html');
  assert.match(html, /<div class="tl-adaptive-detail__bar">\s*<nav class="tl-breadcrumb" aria-label="[^"]+"/);
  assert.match(html, /tl-breadcrumb__current[^"]*" aria-current="page"|aria-current="page"[^>]*tl-breadcrumb__current/);
  assert.match(html, /class="tl-drawer [^"]*tl-drawer--container[^"]*" data-tl-state="open"/);
});
```

- [ ] **Step 2: Run** `node --test test/behaelter.test.mjs test/contracts-4c.test.mjs` — Expected: FAIL.

- [ ] **Step 3: `slide/slide.css`**

```css
/* Gleiten — Spec 2026-10-16 Welle 4c §8 (Q21). Ein Versatz für jeden Wechsel, der vorwärts oder zurück führt:
   Wizard-Schritt, Rahmen des Kachelstapels. Das Ankommende kommt von der Seite, zu der es geht, das Gehende blendet
   zur anderen aus. Dauer und Kurve setzt die Regel, die die Keyframes nennt; in Schreibrichtung rechts-nach-links
   nennt sie die gespiegelten. Mehr Bewegung im UI-Durchgang nach Welle 5. */

@keyframes tl-slide-in-forward {
  from { opacity: 0; transform: translateX(var(--tl-space-md)); }
  to { opacity: 1; transform: none; }
}

@keyframes tl-slide-in-backward {
  from { opacity: 0; transform: translateX(calc(-1 * var(--tl-space-md))); }
  to { opacity: 1; transform: none; }
}

@keyframes tl-slide-out-forward {
  from { opacity: 1; transform: none; }
  to { opacity: 0; transform: translateX(calc(-1 * var(--tl-space-md))); }
}

@keyframes tl-slide-out-backward {
  from { opacity: 1; transform: none; }
  to { opacity: 0; transform: translateX(var(--tl-space-md)); }
}
```

  `slide/slide.contract.md`: eine Tabelle der vier Namen in Backticks (`` `tl-slide-in-forward` `` … `` `tl-slide-out-backward` ``)
  mit „Wann“ (ankommend vorwärts …), Leser `tl-wizard`, `tl-tile-stack`, Token `` `--tl-space-md` ``; Satz: „Ein Wechsel ohne Bewegung (reduzierte Bewegung) setzt keine Marken
  (`useKeyedTransition`); die Keyframes laufen dann nie.“

- [ ] **Step 4: `tile-stack/tile-stack.css`**

```css
/* Kachelstapel — Spec 2026-10-16 Welle 4c §8. Rahmen übereinander, der aktive oben; verdeckte behalten ihren
   Steuerbaum und ihre Box (Scroll- und Eingabezustand bleiben), unsichtbar und nicht fokussierbar. Der Wechsel
   gleitet (slide.css): useKeyedTransition markiert den ankommenden Rahmen und eine Kopie des gehenden in
   data-tl-state, die Wurzel die Richtung (backward; vorwärts ohne Marke). */

.tl-tile-stack {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
}
.tl-tile-stack[hidden] { display: none; }

.tl-tile-stack__frame {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.tl-tile-stack__frame[data-tl-state~="covered"] {
  position: absolute;
  inset: 0;
  visibility: hidden;
}

.tl-tile-stack__frame[data-tl-state~="entering"] {
  animation: tl-slide-in-forward var(--tl-duration-slow) var(--tl-easing-entrance);
}

.tl-tile-stack[data-tl-state~="backward"] > .tl-tile-stack__frame[data-tl-state~="entering"],
.tl-tile-stack__frame[data-tl-state~="entering"]:dir(rtl) {
  animation-name: tl-slide-in-backward;
}

.tl-tile-stack[data-tl-state~="backward"] > .tl-tile-stack__frame[data-tl-state~="entering"]:dir(rtl) {
  animation-name: tl-slide-in-forward;
}

/* Ein Bild des gehenden Rahmens über dem Stapel: kein Platz im Layout, keine Eingabe. */
.tl-tile-stack__frame[data-tl-state~="exiting"] {
  position: absolute;
  inset: 0;
  pointer-events: none;
  animation: tl-slide-out-forward var(--tl-duration-slow) var(--tl-easing-exit) forwards;
}

.tl-tile-stack[data-tl-state~="backward"] > .tl-tile-stack__frame[data-tl-state~="exiting"],
.tl-tile-stack__frame[data-tl-state~="exiting"]:dir(rtl) {
  animation-name: tl-slide-out-backward;
}

.tl-tile-stack[data-tl-state~="backward"] > .tl-tile-stack__frame[data-tl-state~="exiting"]:dir(rtl) {
  animation-name: tl-slide-out-forward;
}
```

  `tile-stack.contract.md`: Zustand `frames[]`, `activeIndex`; Attribute in Backticks — `` `tl-tile-stack` `` (mit
  `` `data-tl-state~="backward"` ``), `` `tl-tile-stack__frame` `` (mit `` `data-tl-state~="covered"` ``,
  `` `data-tl-state~="entering"` ``, `` `data-tl-state~="exiting"` ``), gesetzt von `` `useKeyedTransition` ``; „Die Kopie des gehenden Rahmens ist
  ein inertes Bild (`useKeyedTransition`): `aria-hidden`, `inert`, ohne ids.“

- [ ] **Step 5: `wizard/wizard.css`**

```css
/* Wizard — Spec 2026-10-16 Welle 4c §8 (Q19: eigenes Muster, auf Tokens). Oben, was zeigt, wo man ist — Zähler,
   Fortschritt, Schrittliste —, darunter der Schritt. Die Scheibe nennt die Position in drei Stufen: aktuell die
   Marke, erledigt die schwächere Markenfläche, kommend eine Linie. Der Schritt gleitet beim Wechsel (slide.css). */

.tl-wizard {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 0;
}
.tl-wizard[hidden] { display: none; }

.tl-wizard__header {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: var(--tl-space-sm);
  padding: var(--tl-space-md);
  border-bottom: var(--tl-border-width-sm) solid var(--tl-border-separator);
}

.tl-wizard__counter {
  color: var(--tl-text-secondary);
}

/* Der Balken steht für eine gegangene Strecke: er bekommt eine Länge, statt die Breite der Seite zu nehmen. */
.tl-wizard__progress {
  display: flex;
  max-width: var(--tl-size-wizard-progress);
}

.tl-wizard__progress > * {
  flex: 1 1 auto;
  min-width: 0;
}

.tl-wizard__steps {
  display: flex;
  flex-wrap: wrap;
  gap: var(--tl-space-xs) var(--tl-space-xl);
  margin: 0;
  padding: 0;
  list-style: none;
}

.tl-wizard__step-item {
  display: flex;
  align-items: center;
  gap: var(--tl-space-xs);
}

.tl-wizard__disc {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: var(--tl-size-icon-lg);
  height: var(--tl-size-icon-lg);
  border: var(--tl-border-width-sm) solid var(--tl-border-control);
  border-radius: var(--tl-radius-full);
  background: var(--tl-surface-layer-nested);
  color: var(--tl-text-secondary);
}

.tl-wizard__step-item[data-tl-state~="done"] > .tl-wizard__disc {
  border-color: transparent;
  background: var(--tl-surface-brand-subtle);
  color: var(--tl-text-primary);
}

.tl-wizard__step-item[aria-current="step"] > .tl-wizard__disc {
  border-color: transparent;
  background: var(--tl-surface-brand);
  color: var(--tl-text-on-brand);
}

.tl-wizard__step-name {
  display: flex;
  align-items: center;
  gap: var(--tl-space-xs);
  color: var(--tl-text-secondary);
  white-space: nowrap;
}

.tl-wizard__step-item[aria-current="step"] > .tl-wizard__step-name {
  color: var(--tl-text-primary);
}

/* Der Bereich des Schritts: begrenzt, damit ein füllender Schritt hier seine Höhe auflöst; er positioniert die Kopie
   des gehenden Schritts, die über dem ankommenden ausblendet. */
.tl-wizard__body {
  position: relative;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
}

.tl-wizard__step {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
}

.tl-wizard__step[data-tl-state~="entering"] {
  animation: tl-slide-in-forward var(--tl-duration-slow) var(--tl-easing-entrance);
}

.tl-wizard[data-tl-state~="backward"] .tl-wizard__step[data-tl-state~="entering"],
.tl-wizard__step[data-tl-state~="entering"]:dir(rtl) {
  animation-name: tl-slide-in-backward;
}

.tl-wizard[data-tl-state~="backward"] .tl-wizard__step[data-tl-state~="entering"]:dir(rtl) {
  animation-name: tl-slide-in-forward;
}

.tl-wizard__step[data-tl-state~="exiting"] {
  position: absolute;
  inset: 0;
  pointer-events: none;
  animation: tl-slide-out-forward var(--tl-duration-slow) var(--tl-easing-exit) forwards;
}

.tl-wizard[data-tl-state~="backward"] .tl-wizard__step[data-tl-state~="exiting"],
.tl-wizard__step[data-tl-state~="exiting"]:dir(rtl) {
  animation-name: tl-slide-out-backward;
}

.tl-wizard[data-tl-state~="backward"] .tl-wizard__step[data-tl-state~="exiting"]:dir(rtl) {
  animation-name: tl-slide-out-forward;
}
```

  `wizard.contract.md`: Zustand (`steps`, `activeIndex`, `activeChild`, `counter`, `progress`, `stepList`,
  `direction`, `autoAdvance`), Aktionen `gotoStep` (erledigter Schritt, Knopf `tl-button--link`) und `advanceStep`
  (Zeitgeber), Attribute — je Klasse ein Backtick-Paar, ohne Elementpräfix (Global Constraints): `tl-wizard` mit
  `data-tl-state~="backward"`, `tl-wizard__counter` (mit `tl-type-label` `tl-nums`) `aria-hidden`,
  `tl-wizard__progress`, `tl-wizard__steps` (an `ol`) mit `aria-label` aus i18n `js.wizard.steps`,
  `tl-wizard__step-item` (an `li`) mit `data-tl-state~="done"` oder `aria-current="step"`, darin `tl-wizard__disc` (an
  `span`, mit `tl-type-label` `tl-nums`) `aria-hidden`, der Name als `tl-button--link` (erledigt) oder
  `tl-wizard__step-name` (an `span`) mit `tl-type-body`/`tl-type-body-strong`; `tl-wizard__body`, `tl-wizard__step`,
  Tokens der drei Stufen, `--tl-size-wizard-progress`.

- [ ] **Step 6: `adaptive-detail/adaptive-detail.css`**

```css
/* Responsives Master-Detail — Spec 2026-10-16 Welle 4c §7 (Q18). Den Wechsel zwischen Split, Auswahl mit Drawer und
   Auswahl/Detail entscheidet der Server (DisplayClass der AppShell). Kompakt steht über dem Inhalt die Breadcrumb des
   Pakets (tl-breadcrumb) in einer Leiste. Der Behälter ist der Anker des Detail-Drawers (tl-drawer--container) und
   beschneidet ihn mit clip: der geparkte Drawer lässt sich nie in Sicht scrollen, auch nicht durch Fokus. */

.tl-adaptive-detail {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: clip;
}
.tl-adaptive-detail[hidden] { display: none; }

.tl-adaptive-detail__bar {
  display: flex;
  flex: none;
  align-items: center;
  min-height: var(--tl-size-bar);
  padding-inline: var(--tl-space-md);
  border-bottom: var(--tl-border-width-sm) solid var(--tl-border-separator);
}

.tl-adaptive-detail__content {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
```

  `adaptive-detail.contract.md`: Zustand (`content`, `overlay`, `breadcrumb[{depth,label}]`), Aktion `navigate`
  (Argument `depth`), Attribute (`tl-adaptive-detail`, `tl-adaptive-detail__bar` um `tl-breadcrumb` mit
  `aria-current="page"` an der letzten Krume und `aria-label` aus `js.breadcrumb.label`, `tl-adaptive-detail__content`,
  der Drawer `tl-drawer--container`); Satz: „Der erste Eintrag heißt ohne Konfiguration ‚Übersicht‘.“

  `drawer/drawer.css` nach der Regel `.tl-drawer--container` (Abweichung 18):

```css

/* Der Behälter beschneidet (Master-Detail: overflow: clip); der Ring der Schublade liegt darum innen. */
.tl-drawer--container:focus-visible {
  outline-offset: calc(-1 * var(--tl-focus-offset));
}
```

  `drawer.contract.md`: Zeile `` | `tl-drawer--container` | im Behälter verankert | `` →
  `` | `tl-drawer--container` | im Behälter verankert; der Fokusring liegt innen (der Behälter beschneidet) | ``.

- [ ] **Step 7: Leser nachziehen** — `breadcrumb.contract.md`: unter Konformität oder Zustand den Satz „Leser:
  `TLBreadcrumb` und die Leiste von `tl-adaptive-detail` (Darstellungsteil `Breadcrumb`).“ `alert.contract.md`: „Leser
  auch: `ViewLoadError` (eine Ansicht, die nicht lädt, `data-tl-role=\"error\"`) und `TLHtml` (ein Fragment, das nicht
  gezeigt wird).“ `table.contract.md` beim Griff der Breite: „`tabindex=\"0\"`, `aria-valuenow` (Breite in px),
  `aria-valuemin`; Pfeile links/rechts um `--tl-space-md`, Home an die Mindestbreite, End passt die Spalte an ihren
  Inhalt an (wie der Doppelklick); das Loslassen einer Pfeiltaste sendet `columnResize`.“

- [ ] **Step 8: Specimen** — `wizard/wizard.spec.html`:

```html
  <section class="specimen__base"><p class="tl-type-heading-sm">Kopf: Zähler, Fortschritt, Schrittliste</p>
    <div class="tl-wizard">
      <div class="tl-wizard__header">
        <span class="tl-wizard__counter tl-type-label tl-nums" aria-hidden="true">02 — 04</span>
        <div class="tl-wizard__progress"><div class="tl-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" aria-labelledby="w1-p"><span class="tl-progress__track"><span class="tl-progress__fill"></span></span><span class="tl-progress__label tl-type-label tl-nums" id="w1-p">Schritt 2 von 4</span></div></div>
        <ol class="tl-wizard__steps" aria-label="Schritte">
          <li class="tl-wizard__step-item" data-tl-state="done"><span class="tl-wizard__disc tl-type-label tl-nums" aria-hidden="true">1</span><button type="button" class="tl-button tl-button--link"><span class="tl-button__label">Willkommen</span></button></li>
          <li class="tl-wizard__step-item" aria-current="step"><span class="tl-wizard__disc tl-type-label tl-nums" aria-hidden="true">2</span><span class="tl-wizard__step-name tl-type-body-strong">Profil</span></li>
          <li class="tl-wizard__step-item"><span class="tl-wizard__disc tl-type-label tl-nums" aria-hidden="true">3</span><span class="tl-wizard__step-name tl-type-body">Fragen</span></li>
          <li class="tl-wizard__step-item"><span class="tl-wizard__disc tl-type-label tl-nums" aria-hidden="true">4</span><span class="tl-wizard__step-name tl-type-body">Zusammenfassung</span></li>
        </ol>
      </div>
      <div class="tl-wizard__body"><div class="tl-wizard__step"><div class="tl-inset"><p class="tl-type-body">Inhalt des Schritts.</p></div></div></div>
    </div>
  </section>
```

  Der Fortschritt setzt die Breite des Balkens im echten Control inline; im Specimen steht ein Füllstand über eine
  `<style>`-Regel `#w1-p` ist nicht nötig — `tl-progress__fill` ohne Breite zeigt einen leeren Balken, das genügt.

  `adaptive-detail/adaptive-detail.spec.html` (`<style>`: `.stage { height: 16rem; }`): `div.stage > div.tl-adaptive-detail`
  mit `div.tl-adaptive-detail__bar > nav.tl-breadcrumb[aria-label="Navigationspfad"]` (drei Einträge wie in
  `breadcrumb.spec.html`, erster „Übersicht“, die letzte Krume `tl-breadcrumb__current` mit `aria-current="page"` — der
  Test aus Step 1 liest genau diese Form; am Markup von `breadcrumb.spec.html` prüfen), `div.tl-adaptive-detail__content` mit Text, und einem offenen
  `aside.tl-drawer.tl-drawer--end.tl-drawer--medium.tl-drawer--container[data-tl-state="open"]` mit Titelleiste und
  Körper wie im Drawer-Specimen.

- [ ] **Step 9: Index** — Links `Wizard →`, `Master-Detail →`.

- [ ] **Step 10: Run** `node --test test/behaelter.test.mjs test/contracts-4c.test.mjs test/focus-clip.test.mjs
  test/contrast.test.mjs` — Expected: PASS.

- [ ] **Step 11: Gates und Commit** wie Task 1; Paket „Ticket #29870: Paket -- ein Versatz tl-slide-*, tl-tile-stack
  und tl-wizard mit Übergängen in data-tl-state, Wizard-Scheibe in drei Stufen, tl-adaptive-detail; Leser in
  Breadcrumb, Alert, Tabelle“; Engine „Ticket #29870: Design system package -- one slide for wizard and tile stack,
  the wizard's step disc in three stages, the adaptive detail.“

---

### Task 5: Engine — Fläche als Kontext, Tastatur des Teilers, Breadcrumb als Teil

**Files:**
- Create: `com.top_logic.layout.react/react-src/bridge/surface.ts`, `bridge/separator.ts`
- Modify: `com.top_logic.layout.react/react-src/bridge-entry.ts` (nach der Zeile `export type { DisplayClass } …`)
- Modify: `com.top_logic.layout.react/react-src/controls/TLBreadcrumb.tsx`

Alle Pfade dieser und der folgenden Engine-Tasks relativ zu `_Working-Tree/tl8-wt-29584/`.

**Interfaces:**
- Produces (aus `'tl-react-bridge'`):
  - `type SurfaceLevel = 'base' | 'layer' | 'overlay'`, `type InsetKind = 'page' | 'panel' | 'card'`,
    `interface Surface { level: SurfaceLevel; inset: InsetKind }`
  - `SurfaceProvider({ value: Surface, children })`, `useSurface(): Surface`
  - `cardSurfaceClass(level: SurfaceLevel): string | undefined`, `insetClass(inset: InsetKind): string | undefined`
  - `panelSurface(outer: Surface, card: boolean): Surface` — was ein Panel seinem Inhalt sagt (Hendrik 16.10.: nur
    was eine Fläche malt, hebt die Stufe)
  - `type SeparatorOrientation = 'horizontal' | 'vertical'`,
    `type SeparatorMove = { to: 'step'; steps: number } | { to: 'min' } | { to: 'max' }`
  - `separatorMove(key: string, orientation: SeparatorOrientation, element: Element | null): SeparatorMove | null`
  - `separatorStep(element: Element | null): number`, `movedSize(size, move, min, max, step): number`
- Produces (aus `./TLBreadcrumb`): `interface BreadcrumbEntry { id: string; label: string }`,
  `Breadcrumb: React.FC<{ id?: string; className: string; label: string; items: BreadcrumbEntry[]; onNavigate: (id: string) => void }>`

- [ ] **Step 1: `bridge/surface.ts`**

```ts
import React, { createContext, useContext } from 'react';

/**
 * Where a component is drawn, and how far an inset placed there keeps its content from the border.
 *
 * <p>A surface of the page - a panel, a card, an accordion - and a surface floating above it - a window, a drawer -
 * tell the components inside. A card takes its surface from the level: on the page the layer, inside a surface the
 * nested step, on a floating surface that surface's own (the nested step would lie below it in the dark mode and
 * sink in). An inset takes its padding from the inset kind. Outside any surface both are the page's.</p>
 */
export type SurfaceLevel = 'base' | 'layer' | 'overlay';

/** How far an inset keeps its content from the border: as on the page, in a panel, in a card. */
export type InsetKind = 'page' | 'panel' | 'card';

/** The surface a component is drawn on. */
export interface Surface {
  level: SurfaceLevel;
  inset: InsetKind;
}

const PAGE: Surface = { level: 'base', inset: 'page' };

const SurfaceContext = createContext<Surface>(PAGE);

/** Gives the components inside the surface they are drawn on. The value should keep its identity across renders. */
export function SurfaceProvider({ value, children }: React.PropsWithChildren<{ value: Surface }>) {
  return React.createElement(SurfaceContext.Provider, { value }, children);
}

/** The surface around the rendered component; the page outside any. */
export function useSurface(): Surface {
  return useContext(SurfaceContext);
}

/**
 * What a panel tells the components inside. Only what paints a surface raises the level: a panel drawn as a card
 * does, a plain panel paints none and passes on the level it lies on. Its insets are those of a card or a panel.
 */
export function panelSurface(outer: Surface, card: boolean): Surface {
  return { level: card ? 'layer' : outer.level, inset: card ? 'card' : 'panel' };
}

/** The class giving a card the surface of its level: none on the page. */
export function cardSurfaceClass(level: SurfaceLevel): string | undefined {
  if (level === 'layer') {
    return 'tl-card--nested';
  }
  if (level === 'overlay') {
    return 'tl-card--overlay';
  }
  return undefined;
}

/** The class giving an inset the padding of its surface: none on the page. */
export function insetClass(inset: InsetKind): string | undefined {
  return inset === 'page' ? undefined : `tl-inset--${inset}`;
}
```

- [ ] **Step 2: `bridge/separator.ts`**

```ts
import { tokenPx } from './token-px';

/**
 * The keyboard of a separator that resizes the areas beside it - the handle of a split panel, the width handle of a
 * table column (role="separator", focusable). One place for both, so that they move alike.
 *
 * <p>The arrows across the separator move it by one step, `--tl-space-md`; Home and End move it to the smallest and
 * the largest size the area before it may take. A separator between areas side by side
 * (`aria-orientation="vertical"`) moves with left and right - mirrored in a right-to-left page -, one between areas
 * on top of each other (`horizontal`) with up and down.</p>
 */
export type SeparatorOrientation = 'horizontal' | 'vertical';

/** What a key does to the size of the area before the separator. */
export type SeparatorMove = { to: 'step'; steps: number } | { to: 'min' } | { to: 'max' };

/**
 * The move a key makes, or `null` for a key that does not move the separator.
 *
 * @param element The separator; its writing direction decides which arrow grows the area before it.
 */
export function separatorMove(key: string, orientation: SeparatorOrientation, element: Element | null): SeparatorMove | null {
  if (orientation === 'vertical') {
    const rtl = element != null && getComputedStyle(element).direction === 'rtl';
    if (key === 'ArrowRight') {
      return { to: 'step', steps: rtl ? -1 : 1 };
    }
    if (key === 'ArrowLeft') {
      return { to: 'step', steps: rtl ? 1 : -1 };
    }
  } else {
    if (key === 'ArrowDown') {
      return { to: 'step', steps: 1 };
    }
    if (key === 'ArrowUp') {
      return { to: 'step', steps: -1 };
    }
  }
  if (key === 'Home') {
    return { to: 'min' };
  }
  if (key === 'End') {
    return { to: 'max' };
  }
  return null;
}

/** The length one arrow moves a separator by, in pixels: `--tl-space-md` at the separator. */
export function separatorStep(element: Element | null): number {
  return tokenPx(element, '--tl-space-md', 16);
}

/** The size of the area before the separator after the move, bounded by its smallest and largest size. */
export function movedSize(size: number, move: SeparatorMove, min: number, max: number, step: number): number {
  const next = move.to === 'min' ? min : move.to === 'max' ? max : size + move.steps * step;
  return Math.round(Math.min(max, Math.max(min, next)));
}
```

- [ ] **Step 3: Exporte** — in `bridge-entry.ts` nach `export type { DisplayClass } from './bridge/display-class';`:

```ts
export { SurfaceProvider, useSurface, cardSurfaceClass, insetClass, panelSurface } from './bridge/surface';
export type { Surface, SurfaceLevel, InsetKind } from './bridge/surface';
export { separatorMove, separatorStep, movedSize } from './bridge/separator';
export type { SeparatorMove, SeparatorOrientation } from './bridge/separator';
```

- [ ] **Step 4: Breadcrumb als Teil** — `controls/TLBreadcrumb.tsx` ab `/**\n * A navigation trail …` bis zum Ende
  ersetzen durch:

```tsx
/** One entry of a trail: what it is called, and the id a jump back names it by. */
export interface BreadcrumbEntry {
  id: string;
  label: string;
}

/**
 * The trail itself (tl-breadcrumb): every entry before the current page is a link button that jumps back to it; the
 * current page is plain text marked `aria-current="page"` and no jump target.
 *
 * Rendered by TLBreadcrumb and by the bar of TLAdaptiveDetail, which builds its trail from the levels it shows.
 */
export const Breadcrumb: React.FC<{
  id?: string;
  className: string;
  label: string;
  items: BreadcrumbEntry[];
  onNavigate: (id: string) => void;
}> = ({ id, className, label, items, onNavigate }) => (
  <nav id={id} className={className} aria-label={label}>
    <ol className="tl-breadcrumb__list">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <li key={item.id} className="tl-breadcrumb__entry">
            {index > 0 && (
              <ThemeIcon encoded={SEPARATOR_ICON} className="tl-breadcrumb__separator tl-icon-sm" />
            )}
            {isLast ? (
              <span className="tl-breadcrumb__current tl-type-body" aria-current="page">{item.label}</span>
            ) : (
              <button
                type="button"
                className={buttonClassName({ appearance: 'link' })}
                onClick={() => onNavigate(item.id)}
              >
                <span className="tl-button__label">{item.label}</span>
              </button>
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);

/**
 * A navigation trail showing the current location in a hierarchy (tl-breadcrumb).
 *
 * The state is described by BreadcrumbStateJson.
 */
const TLBreadcrumb: React.FC<TLCellProps> = ({ controlId }) => {
  const state = useTLState<Partial<BreadcrumbStateJson>>();
  const sendCommand = useTLCommand();
  const i18n = useI18N(I18N_KEYS);

  const handleNavigate = useCallback((itemId: string) => {
    sendCommand(NAVIGATE_COMMAND, { [ITEM_ID_ARG]: itemId });
  }, [sendCommand]);

  return (
    <Breadcrumb
      id={controlId}
      className={rootClassName(state, 'tl-breadcrumb')}
      label={i18n['js.breadcrumb.label']}
      items={state.items ?? []}
      onNavigate={handleNavigate}
    />
  );
};

export default TLBreadcrumb;
```

- [ ] **Step 5: Prüfen** — `cd com.top_logic.layout.react && npx tsc --noEmit -p tsconfig.json` — Expected: 0 Fehler.
  `cd ../com.top_logic.layout.react.mui && NODE_OPTIONS=--no-experimental-webstorage npx vitest run
  react-src/adapters/MuiBreadcrumbAdapter.test.tsx` — Expected: PASS (der Adapter ersetzt TLBreadcrumb, unverändert).

- [ ] **Step 6: Commit**

```bash
git -C _Working-Tree/tl8-wt-29584 add -A com.top_logic.layout.react/react-src
git -C _Working-Tree/tl8-wt-29584 commit -m "Ticket #29870: Bridge -- the surface a component is drawn on as context, one keyboard for separators, the breadcrumb trail as a component of its own.

Co-Authored-By: <Modell> <noreply@anthropic.com>"
```

---

### Task 6: Engine — Panel, Karte, Accordion; Fläche in Fenster und Drawer

**Files:**
- Modify: `com.top_logic.layout.react/react-src/controls/TLPanel.tsx` (ganz), `TLCard.tsx` (ganz), `TLAccordion.tsx`
  (Render-Teil), `TLWindow.tsx` (Zeile 25 und Fuß), `TLDrawer.tsx` (Körper)
- Modify: `com.top_logic.layout.react.mui/react-src/adapters/inline-buttons.test.tsx` (Zeilen 82–84)
- Create: `com.top_logic.layout.react.mui/react-src/adapters/containers.test.tsx`
- Modify: `com.top_logic.layout.react/src/main/webapp/style/tlReactControls.css` (Blöcke „TLPanel“, „TLAccordion“,
  „TLCard“, „TLPanel button bar“ und die Regel `.tlPanel__buttonBar:not(:has(button))` samt Kommentar im Block „Element
  picker …“)
- Modify: `design-system/test/ratchet.json`

**Interfaces:**
- Consumes: `SurfaceProvider`, `useSurface`, `cardSurfaceClass`, `isInteractiveWithin`, `stateAttr` (Task 5,
  Bestand); Paketklassen aus Tasks 1–2.

- [ ] **Step 1: Failing Vitest** — `com.top_logic.layout.react.mui/react-src/adapters/containers.test.tsx`:

```tsx
// The containers of wave 4c (spec 2026-10-16): a panel handles like a window, a card takes its surface from where it
// lies. The test registry has no parts of its own, so the parts the controls look up are the MUI ones, as in
// inline-buttons.test.tsx; what is tested here is the behaviour of the controls, not the drawing of the parts.

import { describe, it, expect, vi, afterEach } from 'vitest';
import { screen, cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { React, SurfaceProvider, panelSurface, replacePart } from 'tl-react-bridge';
import type { TLCellProps } from 'tl-react-bridge';
import TLPanel from '../../../com.top_logic.layout.react/react-src/controls/TLPanel';
import TLCard from '../../../com.top_logic.layout.react/react-src/controls/TLCard';
import MuiButtonAdapter from './MuiButtonAdapter';
import MuiDisclosureToggleAdapter from './MuiDisclosureToggleAdapter';
import MuiCheckboxAdapter from './MuiCheckboxAdapter';
import MuiTextInputAdapter from './MuiTextInputAdapter';
import MuiChipAdapter from './MuiChipAdapter';
import { childControl, mountAdapter, settle } from './wire-test-support';

// The panel looks up the part Button; the table (Task 7) also the toggle of its tree rows, the selection boxes of its
// rows, the boxes of its search and the chips of its named filters. Without them a control throws ("No component
// registered for the part …") instead of failing an expectation.
replacePart('Button', MuiButtonAdapter);
replacePart('DisclosureToggle', MuiDisclosureToggleAdapter);
replacePart('Checkbox', MuiCheckboxAdapter);
replacePart('TextInput', MuiTextInputAdapter);
replacePart('Chip', MuiChipAdapter);

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const PANEL = { title: 'Kunden', showMinimize: true, showMaximize: true, child: childControl('x', 'Inhalt') };

function head(): HTMLElement {
  return screen.getByRole('heading', { name: 'Kunden' }).parentElement!;
}

describe('a panel handles like a window', () => {
  it('maximizes on a double click on its head', async () => {
    const sent = mountAdapter(TLPanel, { ...PANEL, expansionState: 'NORMALIZED' });
    await settle();
    await userEvent.dblClick(head());
    await settle();
    expect(sent).toHaveBeenCalledWith('toggleMaximize', expect.anything());
  });

  it('does not maximize on a double click on one of its head buttons', async () => {
    const sent = mountAdapter(TLPanel, { ...PANEL, expansionState: 'NORMALIZED' });
    await settle();
    await userEvent.dblClick(screen.getByRole('button', { name: 'js.panel.minimize' }));
    await settle();
    expect(sent).not.toHaveBeenCalledWith('toggleMaximize', expect.anything());
  });

  it('restores on Escape while maximized, unless something inside used the key', async () => {
    const sent = mountAdapter(TLPanel, { ...PANEL, expansionState: 'MAXIMIZED' });
    await settle();
    const used = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    used.preventDefault();
    screen.getByText('Inhalt').dispatchEvent(used);
    await settle();
    expect(sent).not.toHaveBeenCalledWith('toggleMaximize', expect.anything());

    fireEvent.keyDown(screen.getByText('Inhalt'), { key: 'Escape' });
    await settle();
    expect(sent).toHaveBeenCalledWith('toggleMaximize', expect.anything());
  });

  it('opens when minimized on a click anywhere on its head, and reports the state at its button', async () => {
    const sent = mountAdapter(TLPanel, { ...PANEL, expansionState: 'MINIMIZED' });
    await settle();
    const restore = screen.getByRole('button', { name: 'js.panel.restore' });
    expect(restore.getAttribute('aria-expanded')).toBe('false');
    expect(restore.hasAttribute('aria-controls')).toBe(false);
    await userEvent.click(head());
    await settle();
    expect(sent).toHaveBeenCalledWith('toggleMinimize', expect.anything());
  });

  // Review Focus 6: the toolbar's slot belongs to the toolbar, its empty space too.
  it('neither opens nor maximizes on a gesture in the toolbar of its head', async () => {
    const withToolbar = { ...PANEL, toolbar: childControl('t', 'Werkzeuge') };
    const sent = mountAdapter(TLPanel, { ...withToolbar, expansionState: 'MINIMIZED' });
    await settle();
    await userEvent.click(screen.getByText('Werkzeuge'));
    await settle();
    expect(sent).not.toHaveBeenCalledWith('toggleMinimize', expect.anything());
    cleanup();

    const sentOpen = mountAdapter(TLPanel, { ...withToolbar, expansionState: 'NORMALIZED' });
    await settle();
    await userEvent.dblClick(screen.getByText('Werkzeuge'));
    await settle();
    expect(sentOpen).not.toHaveBeenCalledWith('toggleMaximize', expect.anything());
  });

  it('names the body it controls while open', async () => {
    mountAdapter(TLPanel, { ...PANEL, expansionState: 'NORMALIZED' });
    await settle();
    const minimize = screen.getByRole('button', { name: 'js.panel.minimize' });
    expect(minimize.getAttribute('aria-expanded')).toBe('true');
    const body = document.getElementById(minimize.getAttribute('aria-controls')!);
    expect(body?.classList).toContain('tl-panel__body');
  });

  it('does not open when normal on a click on its head', async () => {
    const sent = mountAdapter(TLPanel, { ...PANEL, expansionState: 'NORMALIZED' });
    await settle();
    await userEvent.click(head());
    await settle();
    expect(sent).not.toHaveBeenCalledWith('toggleMinimize', expect.anything());
  });
});

describe('a card takes its surface from where it lies', () => {
  const CARD = { title: 'Notiz', child: childControl('y', 'Text') };
  const within = (level: 'layer' | 'overlay'): React.FC<TLCellProps> => (props) => (
    <SurfaceProvider value={{ level, inset: 'page' }}><TLCard {...props} /></SurfaceProvider>
  );

  it('on the page: the layer', async () => {
    mountAdapter(TLCard, CARD);
    await settle();
    const card = document.querySelector('.tl-card')!;
    expect(card.classList).not.toContain('tl-card--nested');
    expect(card.classList).not.toContain('tl-card--overlay');
  });

  it('inside a surface: the nested step', async () => {
    mountAdapter(within('layer'), CARD);
    await settle();
    expect(document.querySelector('.tl-card')!.classList).toContain('tl-card--nested');
  });

  it('in a dialog: the surface of the dialog, never the nested step', async () => {
    mountAdapter(within('overlay'), CARD);
    await settle();
    const card = document.querySelector('.tl-card')!;
    expect(card.classList).toContain('tl-card--overlay');
    expect(card.classList).not.toContain('tl-card--nested');
  });

  // Hendrik 16.10.: only what paints a surface raises the level - a plain panel paints none.
  it('a plain panel passes on the level it lies on; a panel drawn as a card raises it', () => {
    const page = { level: 'base', inset: 'page' } as const;
    const dialog = { level: 'overlay', inset: 'page' } as const;
    expect(panelSurface(page, false)).toEqual({ level: 'base', inset: 'panel' });
    expect(panelSurface(dialog, false)).toEqual({ level: 'overlay', inset: 'panel' });
    expect(panelSurface(page, true)).toEqual({ level: 'layer', inset: 'card' });
  });
});
```

  Vorher prüfen: `wire-test-support.tsx` exportiert `mountAdapter`, `childControl`, `settle` (ja, Zeilen 109, 222,
  157) und die Stub-Übersetzung gibt jeden Schlüssel als Text zurück (ja). `childControl` rendert einen Stand-in mit
  dem Text (Zeile 222). Die Überschrift `h2` ist per `getByRole('heading')` erreichbar.

- [ ] **Step 2: Run** `cd com.top_logic.layout.react.mui && NODE_OPTIONS=--no-experimental-webstorage npx vitest run
  react-src/adapters/containers.test.tsx` — Expected: FAIL an Erwartungen, nicht an Ausnahmen: „Unable to find role
  heading“ (das alte Panel schreibt `span.tlPanel__title`), keine `tl-card`-Klassen, kein `aria-expanded`. Wirft ein
  Test „No component registered for the part“, fehlt ein `replacePart` oben.

- [ ] **Step 3: `TLPanel.tsx`** — Importzeile und Komponente ersetzen (Konstanten `I18N_KEYS`, Icons und der
  JavaDoc-Kopf bleiben; im JavaDoc `appearance` „card renders a bordered, rounded panel with compact insets“ →
  „card draws the panel as a card (tl-card), insets inside compact“ und am Ende ergänzen: „ * Handles like a window:
  a double click on the head maximizes and restores, Escape restores a maximized panel, a click anywhere on the head
  of a minimized panel opens it. The buttons stay the way for the keyboard.“):

```tsx
import {
  React, useTLState, useTLCommand, TLChild, useI18N, useFillHost, FillProvider, FillBarrier, rootClassName, stateAttr,
  ThemeIcon, ButtonDefaults, usePart, SurfaceProvider, useSurface, cardSurfaceClass, panelSurface, isInteractiveWithin,
} from 'tl-react-bridge';
import type { TLCellProps, Surface } from 'tl-react-bridge';

const { useCallback, useMemo } = React;
```

```tsx
/**
 * Whether a pointer gesture on the head of a panel is the head's: not on a button or another interactive element of
 * the head, and not anywhere in the toolbar's slot - its empty space included (spec §3: clicks on the toolbar stay
 * its own).
 */
function ownedByHead(event: React.MouseEvent<HTMLElement>): boolean {
  return !isInteractiveWithin(event.target, event.currentTarget)
    && !(event.target instanceof Element && event.target.closest('.tl-titlebar__actions'));
}

const TLPanel: React.FC<TLCellProps> = ({ controlId }) => {
  const state = useTLState();
  const sendCommand = useTLCommand();
  const i18n = useI18N(I18N_KEYS);
  const surface = useSurface();

  const title = state.title as string;
  const expansionState = (state.expansionState as string) ?? 'NORMALIZED';
  const showMinimize = state.showMinimize === true;
  const showMaximize = state.showMaximize === true;
  const showPopOut = state.showPopOut === true;
  const fullLine = state.fullLine === true;
  const alwaysFill = state.fill === true;
  const neverFill = state.fill === false;
  const hoverActions = state.hoverActions === true;
  const card = state.appearance === 'card';
  const width = (state.width as string | undefined) ?? undefined;
  const errorMessage = state.errorMessage as string | undefined;

  const isMinimized = expansionState === 'MINIMIZED';
  const isMaximized = expansionState === 'MAXIMIZED';
  const isHidden = expansionState === 'HIDDEN';
  const bodyId = `${controlId}-body`;

  // What the panel is for the components inside: drawn as a card it is a surface and raises the level, plain it
  // paints none and passes on the level it lies on; its insets are those of a card or a panel.
  const inner = useMemo<Surface>(() => panelSurface(surface, card), [surface, card]);

  const handleMinimize = useCallback(() => {
    sendCommand('toggleMinimize');
  }, [sendCommand]);

  const handleMaximize = useCallback(() => {
    sendCommand('toggleMaximize');
  }, [sendCommand]);

  const handlePopOut = useCallback(() => {
    sendCommand('popOut');
  }, [sendCommand]);

  // The head as a window's: a double click maximizes or restores, a click opens a minimized panel (ownedByHead).
  const handleHeadDoubleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    if (!showMaximize || isMinimized || !ownedByHead(event)) {
      return;
    }
    handleMaximize();
  }, [showMaximize, isMinimized, handleMaximize]);

  const handleHeadClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    if (!showMinimize || !isMinimized || !ownedByHead(event)) {
      return;
    }
    handleMinimize();
  }, [showMinimize, isMinimized, handleMinimize]);

  // Escape restores a maximized panel - unless something inside used the key already, a popup closing, say.
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key !== 'Escape' || !isMaximized || event.defaultPrevented) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    handleMaximize();
  }, [isMaximized, handleMaximize]);

  // The panel takes part in the fill contract as a container: it fills while it is configured to,
  // or while its content fills - a table, a split - which can only resolve its height against a
  // body of definite height. A hidden panel renders no content and occupies no space, so it asks
  // its container for none either. A panel configured not to fill ends the chain at its body
  // instead: the request of its content reaches no container.
  const [fillClass, fillHost] = useFillHost(alwaysFill && !isHidden);
  const Button = usePart('Button');

  if (isHidden) {
    return null;
  }

  // The size spans a container of definite height that is no flex column - a split pane - where the fill class
  // cannot size the panel. Maximized, the design system places the panel over its container.
  const panelStyle: React.CSSProperties | undefined = isMaximized
    ? undefined
    : { width: width ?? '100%', ...(width ? { maxWidth: '100%' } : {}), height: '100%' };

  // Render the head only when it carries something: a title, a toolbar, or a button. A chrome-less panel (a fill
  // panel whose tab already labels it) then shows just its content.
  const hasTitle = !!title && title.trim() !== '';
  const hasButtons = (showMinimize && !isMaximized) || (showMaximize && !isMinimized) || showPopOut;
  const hasHeader = hasTitle || !!state.titleContent || !!state.toolbar || hasButtons;

  const minimizeLabel = isMinimized ? i18n['js.panel.restore'] : i18n['js.panel.minimize'];
  const maximizeLabel = isMaximized ? i18n['js.panel.restore'] : i18n['js.panel.maximize'];

  return (
    <div
      id={controlId}
      className={rootClassName(state, 'tl-panel', card && 'tl-card', card && cardSurfaceClass(surface.level),
        fullLine && 'tl-panel--full-line', hoverActions && 'tl-panel--hover-actions', fillClass)}
      data-tl-state={stateAttr(isMinimized && 'minimized', isMaximized && 'maximized')}
      style={panelStyle}
      onKeyDown={handleKeyDown}
    >
      {hasHeader && (
        <div className="tl-titlebar" onDoubleClick={handleHeadDoubleClick} onClick={handleHeadClick}>
          {hasTitle && <h2 className="tl-titlebar__title tl-type-heading-sm">{title}</h2>}
          {!!state.titleContent && (
            <div className="tl-titlebar__content">
              <TLChild control={state.titleContent} />
            </div>
          )}
          {!!state.toolbar && (
            <div className="tl-titlebar__actions">
              <TLChild control={state.toolbar} />
            </div>
          )}
          {hasButtons && (
            <div className="tl-titlebar__buttons">
              {showMinimize && !isMaximized && (
                <Button
                  label={minimizeLabel}
                  image={isMinimized ? RESTORE_ICON : MINIMIZE_ICON}
                  display="icon-only"
                  appearance="ghost"
                  small
                  aria-expanded={!isMinimized}
                  aria-controls={isMinimized ? undefined : bodyId}
                  onClick={handleMinimize}
                />
              )}
              {showMaximize && !isMinimized && (
                <Button
                  label={maximizeLabel}
                  image={isMaximized ? RESTORE_ICON : MAXIMIZE_ICON}
                  display="icon-only"
                  appearance="ghost"
                  small
                  onClick={handleMaximize}
                />
              )}
              {showPopOut && (
                <Button
                  label={i18n['js.panel.popOut']}
                  image={POP_OUT_ICON}
                  display="icon-only"
                  appearance="ghost"
                  small
                  onClick={handlePopOut}
                />
              )}
            </div>
          )}
        </div>
      )}
      {!isMinimized && (
        <div id={bodyId} className="tl-panel__body">
          <SurfaceProvider value={inner}>
            {neverFill ? (
              <FillBarrier>
                <TLChild control={state.child} />
              </FillBarrier>
            ) : (
              <FillProvider host={fillHost}>
                <TLChild control={state.child} />
              </FillProvider>
            )}
          </SurfaceProvider>
        </div>
      )}
      {!isMinimized && errorMessage && (
        <div className="tl-form-field__message tl-type-label" role="alert">
          {typeof state.errorIcon === 'string' && <ThemeIcon encoded={state.errorIcon} className="tl-icon-sm" />}
          <span>{errorMessage}</span>
        </div>
      )}
      {!isMinimized && !!state.buttonBar && (
        <ButtonDefaults appearance="secondary">
          <div className="tl-button-bar">
            <TLChild control={state.buttonBar} />
          </div>
        </ButtonDefaults>
      )}
    </div>
  );
};

export default TLPanel;
```

  Prüfen: `isInteractiveWithin` ist aus `'tl-react-bridge'` exportiert (`bridge-entry.ts` Zeile 71) — ja. Die Part-
  Props nehmen `aria-*` (`PartAttributes`) — ja.

- [ ] **Step 4: `TLCard.tsx`, `TLAccordion.tsx`** — `TLCard.tsx` ganz:

```tsx
import { React, useTLState, TLChild, FillBarrier, rootClassName, SurfaceProvider, useSurface, cardSurfaceClass } from 'tl-react-bridge';
import type { TLCellProps, CardStateJson, ChildControlJson, Surface } from 'tl-react-bridge';

/** What a card is for the components inside: a surface of the page with compact insets. */
const CARD_SURFACE: Surface = { level: 'layer', inset: 'card' };

/**
 * A content container lighter than TLPanel: a card (tl-card) with an optional head.
 *
 * The card takes its surface from where it lies - the layer on the page, the nested step inside a surface, the
 * surface of a dialog in a dialog. `variant` `elevated` draws like `outlined`: a card lies in the page, only what
 * floats above it casts a shadow.
 *
 * The state is described by CardStateJson.
 */
const TLCard: React.FC<TLCellProps> = ({ controlId }) => {
  const state = useTLState<Partial<CardStateJson>>();
  const surface = useSurface();

  const title = state.title ?? null;
  const padding = state.padding ?? 'default';
  const headerActions: ChildControlJson[] = state.headerActions ?? [];

  const hasHeader = title != null || headerActions.length > 0;

  return (
    <div id={controlId} className={rootClassName(state, 'tl-card', cardSurfaceClass(surface.level))}>
      {hasHeader && (
        <div className="tl-titlebar">
          {title && <h2 className="tl-titlebar__title tl-type-heading-sm">{title}</h2>}
          {headerActions.length > 0 && (
            <div className="tl-titlebar__actions">
              {headerActions.map((action, i) => (
                <TLChild key={i} control={action} />
              ))}
            </div>
          )}
        </div>
      )}
      <div className={`tl-card__body tl-card__body--pad-${padding}`}>
        <SurfaceProvider value={CARD_SURFACE}>
          <FillBarrier>
            <TLChild control={state.child} />
          </FillBarrier>
        </SurfaceProvider>
      </div>
    </div>
  );
};

export default TLCard;
```

  `TLAccordion.tsx`: Importzeile um `useSurface, SurfaceProvider, cardSurfaceClass` erweitern, `Surface` aus den
  Typen, `useMemo` neben `useCallback, useRef`; in der Komponente nach `const triggers = …`:

```tsx
  const surface = useSurface();
  // The accordion is a surface of the page; its sections keep the insets of where it stands.
  const inner = useMemo<Surface>(() => ({ level: 'layer', inset: surface.inset }), [surface.inset]);
```

  die Wurzel `className={rootClassName(state, 'tl-card', cardSurfaceClass(surface.level), 'tl-accordion')}`, die
  Abschnitts-Klasse `className="tl-accordion__section"` (ohne `--expanded`), und den Körperinhalt
  `<FillBarrier>…</FillBarrier>` in `<SurfaceProvider value={inner}>…</SurfaceProvider>` einschließen.

- [ ] **Step 5: Fenster und Drawer** — `TLWindow.tsx`: Zeile 25
  `surface.querySelector<HTMLElement>('.tl-dialog__footer')` → `surface.querySelector<HTMLElement>(':scope > .tl-button-bar')`;
  im Render `<div className="tl-dialog__footer">` → `<div className="tl-button-bar">`; den Körper
  `<FillBarrier><TLChild control={child} /></FillBarrier>` in `<SurfaceProvider value={OVERLAY_SURFACE}>…</SurfaceProvider>`
  einschließen; oben `SurfaceProvider` importieren, `Surface` als Typ, und

```tsx
/** What a window is for the components inside: a surface floating above the page, with the insets of a page. */
const OVERLAY_SURFACE: Surface = { level: 'overlay', inset: 'page' };
```

  `TLDrawer.tsx` ebenso um den `FillBarrier` im `tl-drawer__body` (eigene Konstante gleichen Inhalts).

- [ ] **Step 6: MUI-Test** — in `inline-buttons.test.tsx` Zeilen 82–84 ersetzen durch:

```tsx
      // The element around the buttons places them; the buttons carry no class of their own.
      expect(button.parentElement!.classList).toContain('tl-titlebar__buttons');
```

- [ ] **Step 7: Altbestand streichen** — in `tlReactControls.css` die Blöcke „TLPanel“, „TLAccordion“, „TLCard“ und
  „TLPanel button bar“ je von ihrer Kopfzeile `/* --- Name --- */` bis vor die nächste Kopfzeile löschen; im Block
  „Element picker: click an element in this window to report it“ die Regel `.tlPanel__buttonBar:not(:has(button))`
  samt ihrem Kommentar („The button bar control always exists …“) löschen. Danach
  `cd ../../design-system && node tools/inventory.mjs` — Expected: `missing` nennt `TLPanel`, `TLCard`, `TLPanel button
  bar`; `unlisted` nennt `TLAccordion` nicht mehr. In `test/ratchet.json` diese drei aus `blocks` streichen und
  „Element picker …“ auf den gemessenen Wert setzen.

- [ ] **Step 8: Run**

```bash
cd _Working-Tree/tl8-wt-29584/com.top_logic.layout.react && npx tsc --noEmit -p tsconfig.json && npm run build 2>&1 | tail -3
cd ../com.top_logic.layout.react.mui && NODE_OPTIONS=--no-experimental-webstorage npx vitest run 2>&1 | tail -5
cd ../../../design-system && node --test 2>&1 | grep -E '^ℹ (pass|fail)|^✖'
```

  Expected: `tsc` 0, Vite grün, Vitest alle grün (darunter `containers.test.tsx` 9), Paket grün (`ratchet` grün).

- [ ] **Step 9: Commit**

```bash
git -C _Working-Tree/tl8-wt-29584 add -A com.top_logic.layout.react com.top_logic.layout.react.mui
git -C _Working-Tree/tl8-wt-29584 commit -m "Ticket #29870: Panel, card and accordion read the design system package -- one head for panel and card, minimize reports aria-expanded, a panel handles like a window (double click on the head, Escape, a click opens it when minimized); a card takes its surface from where it lies; the window footer is tl-button-bar.

Co-Authored-By: <Modell> <noreply@anthropic.com>"
git add design-system/test/ratchet.json && git commit -m "Ticket #29870: Ratsche -- TLPanel, TLPanel button bar, TLCard gestrichen, TLAccordion ins Paket

Co-Authored-By: <Modell> <noreply@anthropic.com>"
```

---

### Task 7: Engine — Split und Spaltengriff mit Tastatur, Zurücksetzen (U2)

**Files:**
- Modify: `com.top_logic.layout.react/react-src/controls/TLSplitPanel.tsx` (ganz)
- Modify: `com.top_logic.layout.react/react-src/controls/TLTableView.tsx` (Griff Zeilen 1710–1722, Handler nach
  `fitColumnToContent` Zeile 718)
- Modify: `com.top_logic.layout.react/src/main/java/com/top_logic/layout/react/control/layout/ReactSplitPanelControl.java`
- Modify: `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/SplitSizePersonalization.java`
- Modify: `com.top_logic.layout.react/src/main/java/com/top_logic/layout/react/I18NConstants.java`,
  `com.top_logic.layout.react/src/main/java/META-INF/messages_de.properties`
- Create: `com.top_logic.layout.react/src/test/java/test/com/top_logic/layout/react/control/layout/TestSplitPanelReset.java`
- Modify: `com.top_logic.layout.view/src/test/java/test/com/top_logic/layout/view/element/TestSplitSizePersonalization.java`
- Modify: `com.top_logic.layout.react.mui/react-src/adapters/containers.test.tsx`
- Modify: `tlReactControls.css` (Blöcke „TLSplitPanel“, „Collapsed panel in horizontal split“), `design-system/test/ratchet.json`
- Modify (Paket): `design-system/src/components/table/table.css` (Griff mit Fokus, Step 7),
  `design-system/src/components/table/table.spec.html` (Griffe fokussierbar, Step 7)

**Interfaces:**
- Consumes: `separatorMove`, `separatorStep`, `movedSize` (Task 5).
- Produces: Befehl `resetSizes` am `ReactSplitPanelControl`; `ReactSplitPanelControl.setDefaultSize(ReactControl, float,
  DisplayUnit)`; Konstruktor mit `Runnable onSizesReset`; `SplitSizePersonalization.forgetSizes()`.

- [ ] **Step 1: Failing Java-Tests** — `TestSplitPanelReset.java`:

```java
/*
 * SPDX-FileCopyrightText: 2026 (c) Business Operation Systems GmbH <info@top-logic.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-BOS-TopLogic-1.0
 */
package test.com.top_logic.layout.react.control.layout;

import java.util.List;
import java.util.Map;

import junit.framework.TestCase;

import com.top_logic.basic.json.JSON;
import com.top_logic.layout.DisplayUnit;
import com.top_logic.layout.react.DefaultReactContext;
import com.top_logic.layout.react.ReactContext;
import com.top_logic.layout.react.control.common.ReactTextControl;
import com.top_logic.layout.react.control.layout.ReactSplitPanelControl;
import com.top_logic.layout.react.control.layout.ReactSplitPanelControl.ChildConstraint;
import com.top_logic.layout.react.servlet.SSEUpdateQueue;
import com.top_logic.layout.react.window.ReactWindowRegistry;
import com.top_logic.layout.structure.OrientationAware.Orientation;

/**
 * Tests that a double click on the handle of a {@link ReactSplitPanelControl} gives the panes the sizes they started
 * with, and that the split reports the reset so that a personalization forgets the dragged sizes.
 */
public class TestSplitPanelReset extends TestCase {

	/** A drag turns the panes into pixel sizes; the reset gives them their configured percentages back. */
	public void testResetGivesTheConfiguredSizesBack() {
		ReactContext context = context();
		int[] resets = { 0 };
		ReactSplitPanelControl split = new ReactSplitPanelControl(context, Orientation.HORIZONTAL, true, null, null,
			() -> resets[0]++);
		ReactTextControl a = new ReactTextControl(context, "a");
		ReactTextControl b = new ReactTextControl(context, "b");
		split.addChild(a, ChildConstraint.percent(30));
		split.addChild(b, ChildConstraint.percent(70));

		split.executeCommand("updateSizes", Map.of("sizes", Map.of(a.getID(), 400, b.getID(), 600)));
		assertEquals(DisplayUnit.PIXEL.getExternalName(), child(split, 0).get("unit"));

		split.executeCommand("resetSizes", Map.of());
		assertEquals(30.0, ((Number) child(split, 0).get("size")).doubleValue(), 0.001);
		assertEquals(DisplayUnit.PERCENT.getExternalName(), child(split, 0).get("unit"));
		assertEquals(70.0, ((Number) child(split, 1).get("size")).doubleValue(), 0.001);
		assertEquals("The personalization must learn of the reset.", 1, resets[0]);
	}

	/** A pane added with a remembered size resets to the default given for it, not to the remembered one. */
	public void testResetUsesTheDefaultOfAPersonalizedPane() {
		ReactContext context = context();
		ReactSplitPanelControl split = new ReactSplitPanelControl(context, Orientation.HORIZONTAL, true);
		ReactTextControl a = new ReactTextControl(context, "a");
		split.addChild(a, ChildConstraint.pixels(420));
		split.setDefaultSize(a, 25, DisplayUnit.PERCENT);

		split.executeCommand("resetSizes", Map.of());
		assertEquals(25.0, ((Number) child(split, 0).get("size")).doubleValue(), 0.001);
		assertEquals(DisplayUnit.PERCENT.getExternalName(), child(split, 0).get("unit"));
	}

	private static Map<?, ?> child(ReactSplitPanelControl split, int index) {
		try {
			Map<?, ?> state = (Map<?, ?>) JSON.fromString(split.stateAsJSON());
			return (Map<?, ?>) ((List<?>) state.get("children")).get(index);
		} catch (JSON.ParseException ex) {
			throw new AssertionError("The state sent to the client is not JSON.", ex);
		}
	}

	private static ReactContext context() {
		return new DefaultReactContext("", "test", new SSEUpdateQueue(), new ReactWindowRegistry("test"));
	}
}
```

  In `TestSplitSizePersonalization.java` vor dem schließenden `}` der Klasse:

```java
	/**
	 * Forgetting the sizes gives the configured constraints back, also to a personalization created later.
	 */
	public void testForgetSizes() {
		List<ChildConstraint> configured = configured(32);
		SplitSizePersonalization personalization = create(configured);
		personalization.saveSizes(dragged(400, 600));

		personalization.forgetSizes();

		assertConstraint(configured.get(0), personalization.constraint(0));
		assertConstraint(configured.get(0), create(configured).constraint(0));
	}
```

  Vorher prüfen: `ChildConstraint.percent(float)` und `pixels(float)` sind öffentlich (`ReactSplitPanelControl.java`
  Zeilen 400, 410); `ReactTextControl(ReactContext, String)` öffentlich (Zeile 55); `executeCommand(String, Map)` und
  `stateAsJSON()` werden in `TestObjectLinks` und `TestDrawerToggleState` so benutzt.

- [ ] **Step 2: Run** `cd _Working-Tree/tl8-wt-29584 && JAVA_HOME=$(ls -d /opt/homebrew/Cellar/openjdk@21/*/libexec/openjdk.jdk/Contents/Home | tail -1)
  mvn -o -B test -pl com.top_logic.layout.react -Dtest=TestSplitPanelReset 2>&1 | grep -E 'Tests run|ERROR' | head` —
  Expected: Kompilierfehler (Konstruktor mit sechs Argumenten, `setDefaultSize` fehlen).

- [ ] **Step 3: `ReactSplitPanelControl.java`**
  - Konstante unter `SIZES_ARG`: `/** Command resetting the panes to their default sizes. */ private static final String RESET_SIZES = "resetSizes";` — nicht nötig, der Befehl steht im Annotationswert; auslassen.
  - Feld nach `_onChildCollapsed`: `private final Runnable _onSizesReset;`
  - Der bisherige Fünf-Argument-Konstruktor delegiert: Körper ersetzen durch
    `this(context, orientation, resizable, onSizesChanged, onChildCollapsed, null);` und davor den neuen einfügen:

```java
	/**
	 * Creates a new {@link ReactSplitPanelControl} with persistence callbacks.
	 *
	 * @param orientation
	 *        The layout orientation (horizontal or vertical).
	 * @param resizable
	 *        Whether draggable splitters are shown between children.
	 * @param onSizesChanged
	 *        Called after a drag-resize with a map of control ID to new pixel size. May be
	 *        {@code null}.
	 * @param onChildCollapsed
	 *        Called when a child collapses or expands, with ({@code childIndex}, collapsed). May be
	 *        {@code null}.
	 * @param onSizesReset
	 *        Called after the user reset the panes to their default sizes, so that remembered sizes
	 *        are forgotten. May be {@code null}.
	 */
	public ReactSplitPanelControl(ReactContext context, Orientation orientation, boolean resizable,
			Consumer<Map<String, Float>> onSizesChanged,
			BiConsumer<Integer, Boolean> onChildCollapsed, Runnable onSizesReset) {
		super(context, null, REACT_MODULE);
		_resizable = resizable;
		_onSizesChanged = onSizesChanged;
		_onChildCollapsed = onChildCollapsed;
		_onSizesReset = onSizesReset;

		putState(ORIENTATION, orientation == Orientation.HORIZONTAL ? "horizontal" : "vertical");
		putState(RESIZABLE, Boolean.valueOf(resizable));
		putState(CHILDREN, _childDescriptors);
	}
```

  - In `ChildEntry` nach `DisplayUnit _savedUnit;`:

```java
		float _defaultSize;

		DisplayUnit _defaultUnit;
```

    und im Konstruktor `ChildEntry(…)` nach `_constraint = constraint;`:
    `_defaultSize = constraint._size;` und `_defaultUnit = constraint._unit;`
  - Nach `removeChild` einfügen:

```java
	/**
	 * Sets the size the given child returns to when the user resets the panes.
	 *
	 * <p>
	 * By default it is the size the child was added with. A child added with a size the user dragged it to earlier is
	 * given its configured size here.
	 * </p>
	 */
	public void setDefaultSize(ReactControl child, float size, DisplayUnit unit) {
		for (ChildEntry entry : _children) {
			if (entry._control == child) {
				entry._defaultSize = size;
				entry._defaultUnit = unit;
				return;
			}
		}
		throw new IllegalArgumentException("Not a child of this split panel: " + child.getID());
	}
```

  - Nach `handleUpdateSizes` einfügen:

```java
	/**
	 * Handles the resetSizes command sent by the React client on a double click on a splitter: every pane gets its
	 * default size back, a collapsed one the size it expands to.
	 */
	@ReactCommandHandler(value = "resetSizes")
	void handleResetSizes() {
		for (ChildEntry entry : _children) {
			if (entry._collapsed) {
				entry._savedSize = entry._defaultSize;
				entry._savedUnit = entry._defaultUnit;
			} else {
				entry._constraint._size = entry._defaultSize;
				entry._constraint._unit = entry._defaultUnit;
			}
		}
		_childDescriptors.clear();
		for (ChildEntry entry : _children) {
			_childDescriptors.add(entry.toDescriptor());
		}
		patchChildren();
		if (_onSizesReset != null) {
			_onSizesReset.run();
		}
	}
```

  Prüfen: `ChildConstraint._size` und `_unit` sind nicht `final` (Zeilen 339, 341 — ja, `childCollapsed` schreibt sie).

- [ ] **Step 4: `SplitSizePersonalization.java`** — `private final Map<Integer, Float> _sizes;` → ohne `final`;
  `createSplitPanel` ruft den neuen Konstruktor mit `this::forgetSizes` als letztem Argument; in `addPane` nach jedem
  `split.addChild(…)`:

```java
		ChildConstraint configuredSize = _configured.get(index);
		split.setDefaultSize(content, configuredSize.getSize(), configuredSize.getUnit());
```

  (im Zweig `isCollapsed` steht `configured` schon — dort `split.setDefaultSize(content, configured.getSize(),
  configured.getUnit());` nach dem `addChild`); und nach `saveSizes`:

```java
	/**
	 * Forgets the pane sizes the user dragged, after the panes were reset to their configured sizes.
	 */
	public void forgetSizes() {
		_sizes = Map.of();
		_store.save(_key + SIZES_SUFFIX, null);
		_store.save(_key + CONFIG_SIGNATURE_SUFFIX, null);
	}
```

- [ ] **Step 5: i18n** — in `com.top_logic.layout.react/.../I18NConstants.java` nach `JS_PANEL_POP_OUT`:

```java
	// -- Split panel client-side i18n keys --

	/**
	 * @en Change the size of the areas
	 */
	@CustomKey("js.splitPanel.handle")
	public static ResKey JS_SPLIT_PANEL_HANDLE;
```

  `messages_de.properties` (Modul `layout.react`), alphabetisch nach `js.snackbar…`/vor `js.table…` einsortieren:
  `js.splitPanel.handle = Größe der Bereiche ändern`. (Die genaue Stelle zeigt `grep -n '^js\.s' …messages_de.properties`.)

- [ ] **Step 6: `TLSplitPanel.tsx`** ganz:

```tsx
import {
  React, useTLState, useTLCommand, useI18N, TLChild, useFill, startPointerDrag, rootClassName, stateAttr,
  separatorMove, separatorStep, movedSize,
} from 'tl-react-bridge';
import type { TLCellProps } from 'tl-react-bridge';

const { useCallback, useRef } = React;

const I18N_KEYS = {
  'js.splitPanel.handle': 'Change the size of the areas',
};

interface ChildDescriptor {
  control: unknown;
  size: number;
  unit: string;
  minSize: number;
  scrolling: string;
  collapsed: boolean;
}

/**
 * The share of the area before a handle, in percent of the two areas beside it, as the weights of the server state
 * give it; `null` where the two are given in different units and no share can be read from them.
 */
function share(before: ChildDescriptor, after: ChildDescriptor): number | null {
  if (before.unit !== after.unit || before.size + after.size <= 0) {
    return null;
  }
  return Math.round((100 * before.size) / (before.size + after.size));
}

/**
 * A split panel that arranges children along a single axis with resizable handles between them (tl-split).
 *
 * State:
 * - orientation: "horizontal" | "vertical"
 * - resizable: boolean
 * - children: ChildDescriptor[]
 *
 * A handle is a separator (role="separator"): dragged with the pointer, moved with the arrow keys by one step, with
 * Home and End to the smallest and the largest size of the pane before it, reset to the configured sizes by a double
 * click. The sizes reach the server when a drag ends and when a key is released.
 *
 * Always fills its container: the panes are sized proportionally and the handle between them has to span the
 * available extent. Each pane scrolls what does not fit into it, which ends the fill chain there.
 */
const TLSplitPanel: React.FC<TLCellProps> = ({ controlId }) => {
  const state = useTLState();
  const sendCommand = useTLCommand();
  const i18n = useI18N(I18N_KEYS);
  const fillClass = useFill(true);

  const orientation = state.orientation as string;
  const resizable = state.resizable === true;
  const children = (state.children as ChildDescriptor[]) ?? [];
  const isHorizontal = orientation === 'horizontal';
  const allCollapsed = children.length > 0 && children.every(c => c.collapsed);
  const effectiveHorizontal = allCollapsed ? !isHorizontal : isHorizontal;

  const containerRef = useRef<HTMLDivElement>(null);

  /** The sizes moved by keys and not yet sent, in pixels per pane. */
  const keySizes = useRef<number[] | null>(null);

  const paneId = (index: number) => `${controlId}-pane-${index}`;

  const panes = useCallback((): HTMLElement[] => {
    const container = containerRef.current;
    return container ? [...container.querySelectorAll<HTMLElement>(':scope > .tl-split__pane')] : [];
  }, []);

  const measure = useCallback((): number[] =>
    panes().map(el => (isHorizontal ? el.offsetWidth : el.offsetHeight)), [panes, isHorizontal]);

  const sendSizes = useCallback((sizes: number[]) => {
    const map: Record<string, number> = {};
    children.forEach((child, i) => {
      const ctrl = child.control as { controlId: string };
      if (ctrl?.controlId) {
        map[ctrl.controlId] = sizes[i];
      }
    });
    sendCommand('updateSizes', { sizes: map });
  }, [children, sendCommand]);

  const computeChildStyle = (child: ChildDescriptor): React.CSSProperties => {
    const style: React.CSSProperties = { overflow: child.scrolling || 'auto' };
    if (child.collapsed) {
      // Horizontal split, all collapsed -> flipped to rows: share the height equally.
      style.flex = allCollapsed && !effectiveHorizontal ? '1 0 0%' : '0 0 auto';
    } else {
      // Size as proportional flex-grow weight (works for % and px alike), so the layout scales with the viewport.
      style.flex = `${child.size} 1 0%`;
    }
    if (child.minSize > 0 && !child.collapsed) {
      style.minWidth = isHorizontal ? child.minSize : undefined;
      style.minHeight = !isHorizontal ? child.minSize : undefined;
    }
    return style;
  };

  const handlePointerDown = useCallback((e: React.PointerEvent, index: number) => {
    e.preventDefault();
    const els = panes();
    const sizes = measure();
    const before = els[index];
    const after = els[index + 1];
    // The proportional sizing the panes are rendered with, to fall back on when the gesture is cancelled: the drag
    // writes pixel sizes onto the elements, past the React rendering.
    const flexBefore = before?.style.flex ?? '';
    const flexAfter = after?.style.flex ?? '';
    const startPos = isHorizontal ? e.clientX : e.clientY;
    const total = sizes[index] + sizes[index + 1];
    const minBefore = children[index].minSize || 0;
    const minAfter = children[index + 1].minSize || 0;

    startPointerDrag(e, {
      cursor: isHorizontal ? 'col-resize' : 'row-resize',
      onMove: (moveEvent) => {
        const delta = (isHorizontal ? moveEvent.clientX : moveEvent.clientY) - startPos;
        const size = Math.min(total - minAfter, Math.max(minBefore, sizes[index] + delta));
        sizes[index] = size;
        sizes[index + 1] = total - size;
        if (before) before.style.flex = `0 0 ${size}px`;
        if (after) after.style.flex = `0 0 ${total - size}px`;
      },
      // A press that stayed where it was leaves the panes alone: it would turn the proportional sizes into pixels.
      onEnd: (_event, dragged) => {
        if (dragged) {
          sendSizes(sizes);
        }
      },
      onCancel: () => {
        if (before) before.style.flex = flexBefore;
        if (after) after.style.flex = flexAfter;
      },
    });
  }, [panes, measure, isHorizontal, children, sendSizes]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLElement>, index: number) => {
    const handle = e.currentTarget;
    const move = separatorMove(e.key, isHorizontal ? 'vertical' : 'horizontal', handle);
    if (!move) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    const sizes = keySizes.current ?? measure();
    const total = sizes[index] + sizes[index + 1];
    const minBefore = children[index].minSize || 0;
    const maxBefore = Math.max(minBefore, total - (children[index + 1].minSize || 0));
    const size = movedSize(sizes[index], move, minBefore, maxBefore, separatorStep(handle));
    sizes[index] = size;
    sizes[index + 1] = total - size;
    keySizes.current = sizes;
    const els = panes();
    if (els[index]) els[index].style.flex = `0 0 ${size}px`;
    if (els[index + 1]) els[index + 1].style.flex = `0 0 ${total - size}px`;
    if (total > 0) {
      handle.setAttribute('aria-valuenow', String(Math.round((100 * size) / total)));
      handle.setAttribute('aria-valuemin', String(Math.round((100 * minBefore) / total)));
      handle.setAttribute('aria-valuemax', String(Math.round((100 * maxBefore) / total)));
    }
  }, [isHorizontal, measure, panes, children]);

  const handleKeyUp = useCallback(() => {
    const sizes = keySizes.current;
    keySizes.current = null;
    if (sizes) {
      sendSizes(sizes);
    }
  }, [sendSizes]);

  const handleReset = useCallback(() => {
    sendCommand('resetSizes');
  }, [sendCommand]);

  const elements: React.ReactElement[] = [];
  children.forEach((child, i) => {
    elements.push(
      <div
        key={`child-${i}`}
        id={paneId(i)}
        className="tl-split__pane"
        data-tl-state={stateAttr(child.collapsed && effectiveHorizontal && 'collapsed')}
        style={computeChildStyle(child)}
      >
        <TLChild control={child.control} />
      </div>
    );

    // A handle between two panes that are both open.
    if (resizable && i < children.length - 1 && !child.collapsed && !children[i + 1].collapsed) {
      elements.push(
        <div
          key={`handle-${i}`}
          className="tl-split__handle"
          role="separator"
          tabIndex={0}
          aria-orientation={isHorizontal ? 'vertical' : 'horizontal'}
          aria-controls={paneId(i)}
          aria-valuenow={share(child, children[i + 1]) ?? 50}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={i18n['js.splitPanel.handle']}
          onPointerDown={e => handlePointerDown(e, i)}
          onKeyDown={e => handleKeyDown(e, i)}
          onKeyUp={handleKeyUp}
          onDoubleClick={handleReset}
        />
      );
    }
  });

  return (
    <div
      ref={containerRef}
      id={controlId}
      className={rootClassName(state, 'tl-split', `tl-split--${orientation}`, fillClass)}
      data-tl-state={stateAttr(allCollapsed && 'all-collapsed')}
    >
      {elements}
    </div>
  );
};

export default TLSplitPanel;
```

  Hinweis: die gezogene Größe wird vom Server als neues Gewicht zurückgeschickt; ein Re-Render setzt `style.flex` aus
  dem Zustand. Zwischen Taste und Antwort steht die Pixelgröße inline — wie beim Ziehen heute.

- [ ] **Step 7: Spaltengriff** — in `TLTableView.tsx` nach `fitColumnToContent` (Zeile 718) einfügen:

```tsx
  // The width handle takes the keyboard like any separator (bridge/separator.ts): the arrows widen and narrow the
  // column by one step, Home narrows it to the minimum. A column has no maximum, so End fits it to its content - what a
  // double click on the handle does - and reports it at once. The arrows reach the server when the key is released.
  const keyResizeRef = React.useRef<{ column: string; width: number } | null>(null);

  const handleResizeKeyDown = React.useCallback((columnName: string, colWidth: number, event: React.KeyboardEvent<HTMLElement>) => {
    const handle = event.currentTarget;
    const move = separatorMove(event.key, 'vertical', handle);
    if (!move) {
      return;
    }
    // The table's own keyboard (cursor, selection) does not see the key.
    event.preventDefault();
    event.stopPropagation();
    if (move.to === 'max') {
      keyResizeRef.current = null;
      fitColumnToContent(columnName);
      return;
    }
    const from = keyResizeRef.current?.column === columnName ? keyResizeRef.current.width : colWidth;
    const width = movedSize(from, move, MIN_COL_WIDTH, Number.MAX_SAFE_INTEGER, separatorStep(handle));
    keyResizeRef.current = { column: columnName, width };
    setColumnWidthOverrides((prev) => ({ ...prev, [columnName]: width }));
  }, [fitColumnToContent]);

  const handleResizeKeyUp = React.useCallback(() => {
    const info = keyResizeRef.current;
    keyResizeRef.current = null;
    if (info) {
      sendCommand('columnResize', { column: info.column, width: info.width });
    }
  }, [sendCommand]);
```

  `separatorMove`, `separatorStep`, `movedSize` in die Importzeile aus `'tl-react-bridge'` aufnehmen; am Griff (Zeile
  1710ff.) ergänzen:

```tsx
                    tabIndex={0}
                    aria-valuenow={w}
                    aria-valuemin={MIN_COL_WIDTH}
                    aria-valuemax={Math.max(w, scrollContainerRef.current?.clientWidth ?? w)}
                    onKeyDown={(e) => handleResizeKeyDown(col.name, w, e)}
                    onKeyUp={handleResizeKeyUp}
```

  `table.css` im Paket: `.tl-table__resize:focus-visible { outline-offset: calc(-1 * var(--tl-focus-offset)); }` und
  in die Regel `.tl-table__resize:hover::after, …` den Selektor `.tl-table__resize:focus-visible::after` aufnehmen —
  im Paket (Task-eigener Paket-Commit, generate, publish, Engine-Kopie mitcommitten). `table.spec.html`: an die drei
  `<span class="tl-table__resize" role="separator" …>` (Zeilen 56, 61, 66) `tabindex="0"`, `aria-valuenow` (die
  Breite der Spalte im Specimen, z. B. `160`) und `aria-valuemin="50"` (`MIN_COL_WIDTH` in `TLTableView.tsx` Zeile 186)
  anfügen — erst fokussierbar misst `focus-clip.test.mjs` den Innen-Ring im Kopf (Kopfzelle `overflow: hidden`).

- [ ] **Step 8: Vitest** — an `containers.test.tsx` anfügen (Importe um `TLSplitPanel`, `TLTableView` ergänzen;
  `NoResizeObserver` wie in `inline-buttons.test.tsx`):

```tsx
class NoResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe('a split handle is a separator', () => {
  const SPLIT = {
    orientation: 'horizontal', resizable: true,
    children: [
      { control: childControl('a', 'A'), size: 30, unit: '%', minSize: 0, scrolling: 'auto', collapsed: false },
      { control: childControl('b', 'B'), size: 70, unit: '%', minSize: 0, scrolling: 'auto', collapsed: false },
    ],
  };

  it('is focusable, says its share and the pane it controls', async () => {
    mountAdapter(TLSplitPanel, SPLIT);
    await settle();
    const handle = screen.getByRole('separator', { name: 'js.splitPanel.handle' });
    expect(handle.getAttribute('tabindex')).toBe('0');
    expect(handle.getAttribute('aria-valuenow')).toBe('30');
    expect(handle.getAttribute('aria-orientation')).toBe('vertical');
    expect(document.getElementById(handle.getAttribute('aria-controls')!)?.classList).toContain('tl-split__pane');
  });

  it('sends the sizes when a key is released, and resets on a double click', async () => {
    const sent = mountAdapter(TLSplitPanel, SPLIT);
    await settle();
    const handle = screen.getByRole('separator', { name: 'js.splitPanel.handle' });
    handle.focus();
    await userEvent.keyboard('{ArrowRight}');
    await settle();
    expect(sent).toHaveBeenCalledWith('updateSizes', expect.objectContaining({ sizes: expect.any(Object) }));
    fireEvent.doubleClick(handle);
    await settle();
    expect(sent).toHaveBeenCalledWith('resetSizes', expect.anything());
  });
});

describe('the width handle of a table column takes the keyboard', () => {
  it('widens the column by one step and reports it when the key is released', async () => {
    vi.stubGlobal('ResizeObserver', NoResizeObserver);
    const sent = mountAdapter(TLTableView, {
      columns: [{ name: 'name', label: 'Name', width: 120, sortable: false }],
      rows: [],
      totalRowCount: 0,
    });
    await settle();
    const handle = screen.getByRole('separator', { name: 'js.table.columnWidth' });
    handle.focus();
    await userEvent.keyboard('{ArrowRight}');
    await settle();
    expect(sent).toHaveBeenCalledWith('columnResize', { column: 'name', width: 136 });
  });

  it('fits the column to its content on End, at once', async () => {
    vi.stubGlobal('ResizeObserver', NoResizeObserver);
    const sent = mountAdapter(TLTableView, {
      columns: [{ name: 'name', label: 'Name', width: 120, sortable: false }],
      rows: [],
      totalRowCount: 0,
    });
    await settle();
    const handle = screen.getByRole('separator', { name: 'js.table.columnWidth' });
    handle.focus();
    await userEvent.keyboard('{End}');
    await settle();
    // jsdom measures no content: the fitted width is the minimum. What counts is that End reports the column at once.
    expect(sent).toHaveBeenCalledWith('columnResize', expect.objectContaining({ column: 'name' }));
  });
});
```

  (In jsdom liefert `tokenPx` den Rückfallwert 16 für `--tl-space-md`; `getColWidth` gibt ohne Überschreibung
  `col.width` zurück (`TLTableView.tsx` Zeile 559), also 120 + 16. Der Griff steht nur an nicht angehefteten Spalten —
  die Testspalte ist es nicht.)

- [ ] **Step 9: Altbestand** — Blöcke „TLSplitPanel“ und „Collapsed panel in horizontal split“ löschen; in
  `ratchet.json` streichen.

- [ ] **Step 10: Run**

```bash
cd _Working-Tree/tl8-wt-29584 && export JAVA_HOME=$(ls -d /opt/homebrew/Cellar/openjdk@21/*/libexec/openjdk.jdk/Contents/Home | tail -1)
mvn -o -B install -pl com.top_logic.layout.react -DskipTests 2>&1 | grep -E 'BUILD|ERROR' | head -3
mvn -o -B test -pl com.top_logic.layout.react -Dtest=TestSplitPanelReset 2>&1 | grep -E 'Tests run|BUILD' | tail -2
mvn -o -B test -pl com.top_logic.layout.view -Dtest=TestSplitSizePersonalization 2>&1 | grep -E 'Tests run|BUILD' | tail -2
cd com.top_logic.layout.react && npx tsc --noEmit -p tsconfig.json && npm run build 2>&1 | tail -2
cd ../com.top_logic.layout.react.mui && NODE_OPTIONS=--no-experimental-webstorage npx vitest run 2>&1 | tail -4
```

  Expected: BUILD SUCCESS; `TestSplitPanelReset` 2/2, `TestSplitSizePersonalization` alle (eine mehr); `tsc` 0; Vite
  grün; Vitest alle grün.

- [ ] **Step 11: Commit** — Engine „Ticket #29870: The split handle is a separator -- focusable, moved by the arrow
  keys, Home and End, reset to the configured sizes by a double click (resetSizes; the personalization forgets the
  dragged sizes); the width handle of a table column takes the same keyboard, End fitting the column to its content.“ (mit `com.top_logic.layout.view`); Paket
  „Ticket #29870: Ratsche -- TLSplitPanel und Collapsed panel gestrichen; Griff der Tabelle mit Fokus“.

---

### Task 8: Engine — Stack, Grid, Inset, Deck, Hüllen; Übergangsregeln; Doku

**Files:**
- Modify: `com.top_logic.layout.react/react-src/controls/TLStack.tsx`, `TLGrid.tsx`, `TLInset.tsx`, `TLDeckPane.tsx`,
  `items.tsx` (seit #29755 `useItems`; `TLColumns.tsx` bleibt — seine Hülle ist `tl-columns__column`)
- Modify: `com.top_logic.layout.react/src/main/java/com/top_logic/layout/react/control/layout/ReactLayoutControl.java`
  (JavaDoc Zeile 371)
- Modify: `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/list/ObjectListElement.java` (JavaDoc
  Zeile 141, `ITEM_CSS_CLASS`) — Plan-Review, Befund 5: das Engine-Gate `ALT_4C` sucht `--tl-item-index` in
  `layout.view/src/main/java`
- Modify: `com.top_logic.layout.react.mui/react-src/adapters/containers.test.tsx` (Auswahl, Review Focus 7)
- Modify: `com.top_logic.demo.react/TRIAGE.md` (Zeile 32, Repeater)
- Modify: `tlReactControls.css` (Blöcke „Viewport-filling layout“, „Bounded width“, „Repeated items“, „TLInset“,
  „TLStack“, „TLGrid“, „TLDeckPane“, „Table cells holding legacy controls …“, „TLHtml“, „Dashboard“)
- Modify: `com.top_logic.demo.react/src/main/webapp/style/tl-demo-react.css` (Zeilen 27–45)
- Modify: `com.top_logic.layout.view/src/main/java/META-INF/tl-docs/view-layer/basics.md` (121, 126, 200, 228),
  `layout.md` (74, 142, 171–179, 213), `theme-tokens.md` (30)
- Modify: `design-system/test/ratchet.json` (Blöcke, `foreignTl`)

- [ ] **Step 1: TSX**
  - `items.tsx` (Stand master: `useItems`, Zeilen 20–41 und 186):
    - Zeile 27: `ITEM_INDEX_PROPERTY = '--item-index'`; im JavaDoc darüber (Zeile 25)
      `calc(var(--tl-item-index) * 60ms)` → `calc(var(--item-index) * 60ms)` und als letzten Satz des JavaDoc
      ergänzen: „ * Outside the design system's namespace (the `tl` prefix of its custom properties): it is data of the
      engine for an application stylesheet, not a word of the package.“ — ohne das Literal `--tl`:
      `foreignTlInSources` liest `react-src` mit `/--tl[A-Za-z0-9-]*/` und meldete `--tl` als neuen Fremdnamen
      (Plan-Review, Befund 4).
    - Zeile 35: `ITEM_CLASS = 'tl-item'`; der JavaDoc darüber: „The layout stylesheet uses it …“ → „The design system
      draws it (layout.css): the wrapper passes the space it is given on to the item, and in a selectable container it
      is the option the user presses.“
    - Zeilen 37–41 (`ITEM_SELECTABLE_CLASS`, `ITEM_SELECTED_CLASS` samt JavaDoc) löschen — Q24: der Zustand ist
      `aria-selected`, „auswählbar“ ist `role="option"`; beides setzt die Hülle schon.
    - Zeile 186: `className={wrapperClass(wrapper, itemClass, ITEM_SELECTABLE_CLASS, isSelected && ITEM_SELECTED_CLASS)}`
      → `className={wrapperClass(wrapper, itemClass)}`.
    - Sonst nichts: `role`, `aria-selected`, `tabIndex`, `data-tl-item`, Tastatur und langes Drücken bleiben
      Bernhards.
  - `TLStack.tsx` (Zeilen 46–57): `'tlStack'` → `'tl-stack'`, jede `tlStack--…` → `tl-stack--…`, `'tlBounded'` →
    `'tl-bounded'`. `useItems` und `containerProps` bleiben.
  - `TLGrid.tsx`: oberhalb der Komponente

```tsx
/**
 * The gap of each step, the same as the rules of tl-grid in the design system read (layout.css); the column template
 * computes with it. Kept equal to the stylesheet by a test of the package (engine-classes.test.mjs).
 */
const GAP_TOKEN: Record<string, string> = {
  compact: 'var(--tl-space-sm)',
  default: 'var(--tl-space-md)',
  loose: 'var(--tl-space-lg)',
};
```

    Zeile 38: `var(--tlGrid-gap)` → `${GAP_TOKEN[gap] ?? GAP_TOKEN.default}`; Zeile 51: Klassen `'tl-grid'`,
    `` `tl-grid--gap-${gap}` ``, `'tl-bounded'`. `useItems` und `containerProps` bleiben.
  - `TLInset.tsx`: Import `useSurface, insetClass`; `className={rootClassName(state, 'tl-inset', insetClass(useSurface().inset), fillClass)}`
    — den Hook-Aufruf oben in der Komponente (`const surface = useSurface();`), nicht im JSX.
  - `TLDeckPane.tsx`: `'tlDeckPane'` → `'tl-deck'` (über `rootClassName(state, 'tl-deck', fillClass)`).
  - `ReactLayoutControl.java` Zeile 371: `{@code --tl-item-index}` → `{@code --item-index}`.
  - `ObjectListElement.java` Zeile 141: `{@code --tl-item-index}` → `{@code --item-index}`. Der JavaDoc einer
    Konstante landet nicht in `messages_en`; `check-messages-en.sh` in Task 10 bestätigt es.

  - Vitest an `containers.test.tsx` anfügen (Import `TLStack` aus
    `'../../../com.top_logic.layout.react/react-src/controls/TLStack'` neben `TLPanel`; `childControl`, `mountAdapter`,
    `settle` sind schon importiert):

```tsx
// Q24 (#29755): a selectable stack is a list box; the state of an item is aria-selected, not a class.
describe('the items of a selectable container', () => {
  const LIST = {
    children: [childControl('a', 'Altbau'), childControl('b', 'Loft')],
    selectable: true,
    itemKeys: ['ka', 'kb'],
    selected: ['kb'],
  };

  it('are options of a list box, the selected one by aria-selected only', async () => {
    mountAdapter(TLStack, LIST);
    await settle();
    expect(screen.getByRole('listbox')).toBeTruthy();
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(2);
    expect(options[1].getAttribute('aria-selected')).toBe('true');
    expect(options[0].getAttribute('aria-selected')).toBe('false');
    for (const option of options) {
      expect(option.classList).toContain('tl-item');
      expect(option.className).not.toMatch(/--selectable|--selected|tlItem/);
    }
  });

  it('select an item on a click', async () => {
    const sent = mountAdapter(TLStack, LIST);
    await settle();
    await userEvent.click(screen.getByText('Altbau'));
    await settle();
    expect(sent).toHaveBeenCalledWith('selectItem', { key: 'ka', toggle: false, range: false });
  });
});
```

    Vorher prüfen: `childControl('a', 'Altbau')` rendert den Text „Altbau“ im Stand-in (wie `'Inhalt'` in Task 6), und
    `mountAdapter` gibt den Mock zurück, mit dem `useTLCommand` sendet (`sent` in Task 6). Läuft der Test vor der
    Änderung an `items.tsx`, scheitert er an `tl-item` und `tlItem--selected` — das ist das erwartete Scheitern.

- [ ] **Step 2: Altbestand** — in `tlReactControls.css`:
  - „Viewport-filling layout“: `.is-control > .tlStack {` → `.is-control > .tl-stack {`
  - „Bounded width“ ganz löschen.
  - „Repeated items“ (48 Zeilen, mit Bernhards `.tlItem--selectable/--selected` aus #29755 — die Auswahl zeichnet jetzt
    `layout.css`, Q24): Inhalt nach der Kopfzeile ersetzen durch

```css

/* The wrapper of a repeated item (tl-item, design system package) fills while its item fills, so that the fill
   contract survives the wrapper. Leaves with the fill contract in wave 5. */
.tl-item:has(> .tlFill) {
	flex: 1;
}

```

  - „TLInset“ ganz löschen (Kommentare „Spacing model“ und „Overlay surfaces“ eingeschlossen; beide beschreiben Tokens
    und Mechanik, die es nicht mehr gibt).
  - „TLStack“, „TLGrid“, „TLDeckPane“ ganz löschen.
  - „Table cells holding legacy controls …“: `.tlStack--row` → `.tl-stack--row`,
    `.tlStack--grow-first.tlStack--row` → `.tl-stack--grow-first.tl-stack--row`.
  - „TLHtml“: beide `scroll-margin-top: var(--page-inset);` → `scroll-margin-top: var(--tl-space-lg);`
  - „Dashboard“: `padding: var(--page-inset);` → `padding: var(--tl-space-lg);`
  - Prüfen: `grep -n "page-inset\|tlStack\|tlGrid\|tlInset\|tlBounded\|tlItem\b\|tlDeckPane" tlReactControls.css` — leer.

- [ ] **Step 3: Demo** — `tl-demo-react.css`: Kommentar „--tl-item-index“ → „--item-index“, beide `.tlGrid >
  .tlObjectList__item` → `.tl-grid > .tlObjectList__item`, `calc(var(--tl-item-index) * 60ms)` →
  `calc(var(--item-index) * 60ms)`. `TRIAGE.md` Zeile 32: `` `--tl-item-index` `` → `` `--item-index` ``.

- [ ] **Step 4: Doku** (`view-layer/*.md`, englisch):
  - `basics.md:121`: „keeps the page inset (`--page-inset`) as distance to the border“ → „keeps the page inset as
    distance to the border (`tl-inset`; how far is decided by the surface it stands on: 1.5rem on a page, 1rem in a
    panel, compact in a card)“.
  - `basics.md:126`: `(.tlInset)` → `(.tl-inset)`; „A card (…) reduces `--page-inset`, so an inset inside it is
    compact.“ → „In a card (`appearance="card"`, `<card>`) an inset is compact; the card tells it (React context
    `useSurface`).“
  - `basics.md:200`: `tlStack tlStack--column tlStack--gap-normal` → `tl-stack tl-stack--column tl-stack--gap-default`.
  - `basics.md:228`: `` `tlCard--outlined` `` → `` `tl-card__body--pad-compact` ``.
  - `layout.md:74`: `` `tlBounded` `` → `` `tl-bounded` ``.
  - `layout.md:143`: `<div class="tlItem tlObjectList__item" style="--tl-item-index: 0">` →
    `<div class="tl-item tlObjectList__item" style="--item-index: 0">`; `.tlGrid` → `.tl-grid`, `.tlStack` → `.tl-stack`.
  - `layout.md:142` (Auswahl, #29755): nach „… is marked as selected“ ergänzen „(`aria-selected`; the design system
    draws a ring over the element, `layout.css`)“.
  - `layout.md:172–179` (CSS-Beispiel): wie Step 3.
  - `layout.md:214`: `` `.tlDeckPane` `` → `` `.tl-deck` ``.
  - `theme-tokens.md:30`: „(`--page-inset`, `--cal-ev-bg`, …)“ → „(`--cal-ev-bg`, …)“.

- [ ] **Step 5: Ratsche** — `node tools/inventory.mjs` im Paket; in `ratchet.json` „Bounded width“, „TLInset“,
  „TLStack“, „TLGrid“, „TLDeckPane“ streichen, „Repeated items“ (Budget 48 seit dem Vorziehen auf master) auf den
  gemessenen Wert; `literals.duration` sinkt um die `120ms` von `.tlItem--selectable`; `foreignTl` ohne
  `--tl-item-index` und `--tlGrid-gap`.

- [ ] **Step 6: Run** — `tsc`, beide Vite-Builds, MUI-Vitest, Paket `node --test` wie Task 6 Step 8 — Expected: grün.
  `grep -rn "tlStack\|tlGrid\|tlInset\|tlBounded\|tlDeckPane\|tlItem\|page-inset\|tl-item-index" com.top_logic.layout.react*/react-src
  com.top_logic.layout.react/src/main/java com.top_logic.demo.react/src com.top_logic.demo.react/TRIAGE.md
  com.top_logic.layout.view/src/main/java` — leer. Und `foreignTl`: `node --test test/ratchet.test.mjs` im Paket grün
  (kein neuer Fremdname, auch nicht `--tl` aus einem Kommentar).

- [ ] **Step 7: Commit** — Engine „Ticket #29870: Stacks, grids, insets and decks read the design system package --
  one gap scale with the columns, the inset set by the surface it stands on instead of --page-inset, the item index
  as --item-index outside the package's namespace; a selected item is marked by aria-selected alone, the package draws
  a halo under the pointer and a ring when selected (#29755).“ (mit `com.top_logic.demo.react`, `com.top_logic.layout.view`);
  Paket „Ticket #29870: Ratsche -- Bounded width, TLInset, TLStack, TLGrid, TLDeckPane gestrichen, Repeated items
  gekürzt; foreignTl ohne --tl-item-index und --tlGrid-gap“.

---

### Task 9: Engine — Wizard, TileStack, AdaptiveDetail, ViewError, Html-Fehler

**Files:**
- Modify: `com.top_logic.layout.react/react-src/controls/TLWizard.tsx`, `TLTileStack.tsx`, `TLAdaptiveDetail.tsx`,
  `TLHtml.tsx` (Zeilen 203–207)
- Modify: `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/ViewLoadError.java`
- Modify: `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/ReactAdaptiveDetailControl.java`
  (Zeilen 81, 350), `element/I18NConstants.java`
- Modify: `I18NConstants.java` (layout.react: `js.wizard.steps`), beide `messages_de.properties`
- Create: `com.top_logic.layout.view/src/test/java/test/com/top_logic/layout/view/TestViewLoadError.java`
- Modify: `com.top_logic.layout.view/src/main/java/META-INF/tl-docs/view-layer/app-shell.md` (180–198),
  `navigation.md` (61, 76)
- Modify: `tlReactControls.css` (Blöcke „TLTileStack“, „TLWizard“, „TLAdaptiveDetail …“, „TLViewError“; Regel
  `.tlHtml__error` samt Kommentar), `design-system/test/ratchet.json`

- [ ] **Step 1: Failing Java-Test** — `TestViewLoadError.java`:

```java
/*
 * SPDX-FileCopyrightText: 2026 (c) Business Operation Systems GmbH <info@top-logic.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-BOS-TopLogic-1.0
 */
package test.com.top_logic.layout.view;

import junit.framework.TestCase;

import com.top_logic.layout.react.DefaultReactContext;
import com.top_logic.layout.react.control.common.ReactAlertControl;
import com.top_logic.layout.react.control.overlay.ReactSnackbarControl.Variant;
import com.top_logic.layout.react.servlet.SSEUpdateQueue;
import com.top_logic.layout.react.window.ReactWindowRegistry;
import com.top_logic.layout.view.ViewLoadError;

/**
 * Tests that a view that cannot be loaded is reported as an error message of the design system, naming the view and
 * the cause.
 */
public class TestViewLoadError extends TestCase {

	/** The message is an error, titled, with the view path and the root cause below each other. */
	public void testTheViewAndItsCauseAreAnError() {
		ReactAlertControl alert = ViewLoadError.createAlert(
			new DefaultReactContext("", "test", new SSEUpdateQueue(), new ReactWindowRegistry("test")),
			"Not loaded", "app/broken.view.xml",
			new RuntimeException("wrap", new IllegalStateException("No such channel: 'x'")));

		assertEquals(Variant.ERROR, alert.getVariant());
		assertEquals("Not loaded", alert.getTitle());
		assertEquals("app/broken.view.xml\nNo such channel: 'x'", alert.getMessage());
	}
}
```

- [ ] **Step 2: `ViewLoadError.java`** — Klasse ersetzen (Lizenzkopf und Klassen-JavaDoc bleiben; den Absatz „The
  placeholder names the view …“ ergänzen um „ — as an error message of the design system (`tl-alert`), inset from the
  border like a page.“):

```java
package com.top_logic.layout.view;

import com.top_logic.basic.config.ConfigurationException;
import com.top_logic.layout.react.ReactContext;
import com.top_logic.layout.react.control.ReactControl;
import com.top_logic.layout.react.control.common.ReactAlertControl;
import com.top_logic.layout.react.control.layout.ReactInsetControl;
import com.top_logic.layout.react.control.overlay.ReactSnackbarControl.Variant;
import com.top_logic.util.Resources;

public class ViewLoadError {

	/**
	 * Creates the placeholder control for a view that could not be loaded.
	 *
	 * @param context
	 *        The context to create the controls in.
	 * @param viewPath
	 *        The view that failed to load.
	 * @param problem
	 *        The reason loading failed.
	 * @return A control to render instead of the view.
	 */
	public static ReactControl createControl(ReactContext context, String viewPath, Throwable problem) {
		String title = Resources.getInstance().getString(I18NConstants.ERROR_VIEW_NOT_LOADED);
		return new ReactInsetControl(context, createAlert(context, title, viewPath, problem));
	}

	/**
	 * The error message naming the view and, below it, the cause of the failure.
	 *
	 * @param title
	 *        The title of the message.
	 */
	public static ReactAlertControl createAlert(ReactContext context, String title, String viewPath, Throwable problem) {
		ReactAlertControl alert = new ReactAlertControl(context);
		alert.setVariant(Variant.ERROR);
		alert.setTitle(title);
		String detail = detail(problem);
		alert.setMessage(detail.isEmpty() ? viewPath : viewPath + "\n" + detail);
		alert.show();
		return alert;
	}

	/**
	 * The message of the root cause, which names the offending setting; the wrapping
	 * {@link ConfigurationException}s only repeat the view path.
	 */
	private static String detail(Throwable problem) {
		Throwable cause = problem;
		while (cause.getCause() != null) {
			cause = cause.getCause();
		}
		String message = cause.getMessage();
		return message == null ? "" : message;
	}
}
```

  Prüfen: `ReactInsetControl(ReactContext, ReactControl)` öffentlich (Zeile 37) — ja; `show()` öffentlich (Zeile 238)
  — ja; `setMessage` schreibt `null` als `""` — ja.

- [ ] **Step 3: Standard-Kopf** — `element/I18NConstants.java` vor dem `static`-Block:

```java
	/**
	 * @en Overview
	 */
	public static ResKey ADAPTIVE_DETAIL_HOME;
```

  `ReactAdaptiveDetailControl.java`: Konstante `DEFAULT_HOME_LABEL` löschen; Zeile 350 →
  `items.add(0, crumb(0, _homeLabel != null ? _homeLabel : Resources.getInstance().getString(I18NConstants.ADAPTIVE_DETAIL_HOME)));`
  (`com.top_logic.util.Resources` importieren, falls noch nicht); JavaDoc von `AdaptiveDetailElement.Config#getHomeLabel`
  um „Without one, the first crumb reads ‚Overview‘.“ ergänzen. `messages_de.properties` (layout.view) einsortieren:
  `class.com.top_logic.layout.view.element.I18NConstants.ADAPTIVE_DETAIL_HOME = Übersicht`.

- [ ] **Step 4: i18n Wizard** — layout.react `I18NConstants.java`:

```java
	// -- Wizard client-side i18n keys --

	/**
	 * @en Steps
	 */
	@CustomKey("js.wizard.steps")
	public static ResKey JS_WIZARD_STEPS;
```

  `messages_de.properties` (layout.react): `js.wizard.steps = Schritte`, einsortiert.

- [ ] **Step 5: `TLWizard.tsx`** — Importe um `useI18N`, `stateAttr` ergänzen und
  `import { buttonClassName } from './button/buttonClassName';`; oben `const I18N_KEYS = { 'js.wizard.steps': 'Steps' };`;
  `useKeyedTransition({ keys: …, node: () => stepRef.current, container: () => bodyRef.current, state: true });`
  (statt `enterClass`/`exitClass`); in der Komponente `const i18n = useI18N(I18N_KEYS);`; Render ab `const hasHeader`:

```tsx
  const hasHeader = showCounter || progress || showStepList;

  return (
    <FillProvider host={fillHost}>
      <div id={controlId} className={rootClassName(state, 'tl-wizard', fillClass)}
        data-tl-state={stateAttr(direction === 'backward' && 'backward')}>
        {hasHeader && (
          <div className="tl-wizard__header">
            {showCounter && (
              // The list says with aria-current where the user is; the counter repeats it for the eye only.
              <span className="tl-wizard__counter tl-type-label tl-nums" aria-hidden="true">
                {counterText(activeIndex, steps.length)}
              </span>
            )}
            {progress && (
              <div className="tl-wizard__progress">
                <TLChild control={progress} />
              </div>
            )}
            {showStepList && (
              <ol className="tl-wizard__steps" aria-label={i18n['js.wizard.steps']}>
                {steps.map((step, position) => {
                  const status = stepState(position, activeIndex);
                  return (
                    <li
                      key={step.key}
                      className="tl-wizard__step-item"
                      data-tl-state={stateAttr(status === 'done' && 'done')}
                      aria-current={status === 'current' ? 'step' : undefined}
                    >
                      <span className="tl-wizard__disc tl-type-label tl-nums" aria-hidden="true">{position + 1}</span>
                      {status === 'done' ? (
                        <button type="button" className={buttonClassName({ appearance: 'link' })} onClick={() => goTo(step.key)}>
                          {step.icon && <ThemeIcon encoded={step.icon} className="tl-button__icon tl-icon-sm" />}
                          <span className="tl-button__label">{step.label}</span>
                        </button>
                      ) : (
                        <span className={'tl-wizard__step-name ' + (status === 'current' ? 'tl-type-body-strong' : 'tl-type-body')}>
                          {step.icon && <ThemeIcon encoded={step.icon} className="tl-icon-sm" />}
                          {step.label}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        )}
        <div className="tl-wizard__body" ref={bodyRef}>
          <div key={activeStepId ?? ''} className="tl-wizard__step" ref={stepRef}>
            {activeChild && <TLChild control={activeChild} />}
          </div>
        </div>
      </div>
    </FillProvider>
  );
```

  Im JavaDoc „the direction as a modifier on the root“ → „the direction as `data-tl-state~="backward"` on the root“.
  Prüfen: `buttonClassName({ appearance: 'link' })` liefert `tl-button tl-button--link` (wie in `TLBreadcrumb.tsx`).

- [ ] **Step 6: `TLTileStack.tsx`** — `TileFrame`: `className={['tl-tile-stack__frame', fillClass].filter(Boolean).join(' ')}`
  und `data-tl-state={covered ? 'covered' : undefined}` am Wrapper; `useKeyedTransition({ keys, node, container, state: true })`;
  Wurzel `className={rootClassName(state, 'tl-tile-stack', fillClass)}` und
  `data-tl-state={direction.current === 'backward' ? 'backward' : undefined}`; den JavaDoc-Absatz über Klassen
  (Zeilen 45–50) auf `data-tl-state` (`entering`, `exiting`, `backward`, `covered`) umschreiben.

- [ ] **Step 7: `TLAdaptiveDetail.tsx`** ganz:

```tsx
import { React, useTLState, useTLCommand, useI18N, TLChild, rootClassName } from 'tl-react-bridge';
import type { TLCellProps } from 'tl-react-bridge';
import { Breadcrumb } from './TLBreadcrumb';

const I18N_KEYS = {
  'js.breadcrumb.label': 'Breadcrumb',
};

interface Crumb {
  depth: number;
  label: string;
}

/**
 * Renders the current presentation of a responsive master-detail (`<adaptive-detail>`).
 *
 * The server decides which presentation to build (a split or a full-width selector with a drawer for
 * wide viewports, or the selector/detail toggle for narrow ones) and pushes it as the `content`
 * child. A presentation that overlays the content rather than dividing it pushes the overlaying part
 * as the `overlay` child, positioned inside this element's own area. In compact mode the outermost
 * (coordinator) control also pushes a `breadcrumb` spanning all nested levels, drawn as the
 * breadcrumb of the design system; choosing a crumb sends a `navigate` command that clears the
 * selections from that level down.
 *
 * State:
 * - content:    ChildDescriptor        - the active presentation control (split, selector, or detail)
 * - overlay:    ChildDescriptor | null - the part overlaying the content (the detail drawer)
 * - breadcrumb: Crumb[] | null         - the unified breadcrumb (compact, coordinator only)
 */
const TLAdaptiveDetail: React.FC<TLCellProps> = ({ controlId }) => {
  const state = useTLState();
  const sendCommand = useTLCommand();
  const i18n = useI18N(I18N_KEYS);

  const content = state.content as unknown;
  const overlay = state.overlay as unknown;
  const crumbs = ((state.breadcrumb as Crumb[] | null) ?? []).map((crumb) => ({ id: String(crumb.depth), label: crumb.label }));

  return (
    <div id={controlId} className={rootClassName(state, 'tl-adaptive-detail')}>
      {crumbs.length > 0 && (
        <div className="tl-adaptive-detail__bar">
          <Breadcrumb
            className="tl-breadcrumb"
            label={i18n['js.breadcrumb.label']}
            items={crumbs}
            onNavigate={(id) => sendCommand('navigate', { depth: Number(id) })}
          />
        </div>
      )}
      <div className="tl-adaptive-detail__content">{!!content && <TLChild control={content} />}</div>
      {overlay ? <TLChild control={overlay} /> : null}
    </div>
  );
};

export default TLAdaptiveDetail;
```

- [ ] **Step 8: `TLHtml.tsx`** — Zeilen 203–207:

```tsx
  if (error) {
    // A fragment that is not shown says why in its place, as an error message of the design system.
    return (
      <div id={controlId} className={rootClassName(state, 'tl-alert')} data-tl-role="error" role="alert">
        <div className="tl-alert__body"><div className="tl-alert__message tl-type-body">{error}</div></div>
      </div>
    );
  }
```

- [ ] **Step 9: Doku** — `app-shell.md` 184–198: Tabellenzeilen Wizard und Tile-Stack auf
  `.tl-wizard__step[data-tl-state~="entering"]` / `~="exiting"` / `.tl-wizard[data-tl-state~="backward"]` und
  `.tl-tile-stack__frame[data-tl-state~="entering"]` / `~="exiting"` / `.tl-tile-stack[data-tl-state~="backward"]`;
  der Satz „the engine slides the wizard step and the tile frame (`tlReactControls.css`, `--tl-duration-slow`)“ → „the
  design system package slides the wizard step and the tile frame (`tl-slide-*`, `--tl-duration-slow`, offset
  `--tl-space-md`)“; „Restyling a change“ auf die neuen Selektoren. `navigation.md:61`: `.tlTileStack__frame--covered`
  → `.tl-tile-stack__frame[data-tl-state~="covered"]`; `navigation.md:76`: Klassen wie oben, „fade plus a 12px slide
  in the direction moved, 200ms“ → „fade plus a slide by `--tl-space-md` in the direction moved, `--tl-duration-slow`“.

- [ ] **Step 10: Altbestand** — Blöcke „TLTileStack“, „TLWizard“, „TLAdaptiveDetail (responsive master-detail)“,
  „TLViewError“ löschen; im Block „TLHtml“ die Regel `.tlHtml__error` samt Kommentar („A fragment that is not shown
  …“). `ratchet.json`: vier Blöcke streichen, „TLHtml“ auf den gemessenen Wert.

- [ ] **Step 11: Run** — Maven `install` für `layout.react` und `layout.view` offline (`-DskipTests`), dann
  `-Dtest=TestViewLoadError` im Modul `layout.view` (Expected 1/1); `tsc`, Vite, MUI-Vitest, Paket `node --test` —
  Expected: grün.

- [ ] **Step 12: Commit** — Engine „Ticket #29870: Wizard, tile stack and adaptive detail read the design system
  package -- transitions marked in data-tl-state with one slide, the wizard's steps named and its disc in three
  stages, the adaptive detail draws the package breadcrumb whose first crumb reads Overview; a view that cannot be
  loaded and a fragment that is not shown are error alerts.“; Paket „Ticket #29870: Ratsche -- TLTileStack,
  TLWizard, TLAdaptiveDetail, TLViewError gestrichen, TLHtml ohne Fehlerbox“.

---

### Task 10: Gates gesamt — Engine-Gate, Ratsche, Maven, Messages, altlast

**Files:**
- Modify: `design-system/test/engine-classes.test.mjs` (anfügen), `design-system/test/ratchet.json`
- Modify: `docs/migration/altlast.md` (neuer Abschnitt vor „## Konsolidierung“)

- [ ] **Step 1: Engine-Gate** — an `engine-classes.test.mjs` anfügen:

```js
// Welle 4c (#29870): keine alte Klasse der Behälter mehr — im TSX jedes Moduls (MUI eingeschlossen), im alten
// Stylesheet, in Java, tl-docs, Views und der Demo; kein --page-inset, kein --tl-item-index, kein Dialog-Fuß der 4a.
const ALT_4C = /\btl(Panel|Card|Stack|Grid|Inset|Bounded|Item|DeckPane|SplitPanel|TileStack|Wizard|AdaptiveDetail|ViewError)(__|--|\b)|\btlHtml__error\b|--page-inset\b|--tl-item-index\b|--tlGrid-gap\b|\btl-dialog__footer\b/;

test('keine alte Klasse der Welle 4c in react-src, Stylesheets, Java, tl-docs und Views', { skip: !existsSync(M) && 'kein Worktree' }, () => {
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
  for (const p of quellen) readFileSync(p, 'utf8').split('\n').forEach((line, i) => { if (ALT_4C.test(line)) hits.push(`${p.slice(WT.length + 1)}:${i + 1}`); });
  assert.deepEqual(hits, []);
});

test('Welle 4c im TSX: Griffe mit role=separator und Tastatur, Minimieren mit aria-expanded, Fensterfuß direkt an der Fläche, kein englischer Name', { skip: !existsSync(M) && 'kein Worktree' }, () => {
  const tsx = (n) => readFileSync(join(M, `react-src/controls/${n}.tsx`), 'utf8');
  assert.match(tsx('TLSplitPanel'), /role="separator"[\s\S]*tabIndex=\{0\}[\s\S]*onKeyDown=/);
  assert.match(tsx('TLSplitPanel'), /onDoubleClick=\{handleReset\}/);
  assert.match(tsx('TLTableView'), /onKeyDown=\{\(e\) => handleResizeKeyDown\(/);
  assert.match(tsx('TLPanel'), /aria-expanded=\{!isMinimized\}/);
  assert.match(tsx('TLWindow'), /querySelector<HTMLElement>\(':scope > \.tl-button-bar'\)/);
  for (const n of ['TLPanel', 'TLCard', 'TLSplitPanel', 'TLWizard', 'TLAdaptiveDetail', 'TLAccordion'])
    assert.doesNotMatch(tsx(n), /aria-label="[A-Za-z]/, `${n}: Name als Literal`);
});

test('der Abstand des Grids im TSX ist der des Stylesheets', { skip: !existsSync(M) && 'kein Worktree' }, async () => {
  const { readGenerated, declarationsOf } = await import('./lib/component.mjs');
  const tsx = readFileSync(join(M, 'react-src/controls/TLGrid.tsx'), 'utf8');
  const map = Object.fromEntries([...tsx.matchAll(/(compact|default|loose): 'var\((--tl-space-[a-z0-9]+)\)'/g)].map((m) => [m[1], m[2]]));
  const css = readGenerated('layout', 'layout.css');
  for (const stufe of ['compact', 'default', 'loose']) {
    const gap = /gap:\s*var\((--tl-space-[a-z0-9]+)\)/.exec(declarationsOf(css, `.tl-grid--gap-${stufe}`) ?? '')?.[1];
    assert.equal(map[stufe], gap, stufe);
  }
});
```

  Regex am echten Beispiel geprüft: `compact: 'var(--tl-space-sm)',` (Task 8 Step 1) trifft `(compact|default|loose):
  'var\((--tl-space-[a-z0-9]+)\)'`; `ALT_4C` trifft `tlObjectList__item` nicht (kein Name der Liste), `tlItem` nur als
  ganzes Wort, `tl-item` nicht.

- [ ] **Step 2: Ratsche** — `node tools/inventory.mjs`; `literals` auf die gemessenen Zahlen (erwartet sinkt
  `duration` um die `0.15s` des Panels und die `120ms` der auswählbaren Einträge, `fontSize` um `0.875em` des
  ViewError — die Messung zählt; Ausgang ist das gehobene Budget vom Vorziehen auf master: duration 21, zIndex 12,
  lines 3185); `lines` = Summe
  der Budgets = gemessen; Vermerk an `_blocks`: „16.10. Welle 4c (#29870): TLPanel, TLPanel button bar, TLCard,
  TLSplitPanel, Collapsed panel in horizontal split, TLStack, TLGrid, TLDeckPane, TLTileStack, TLInset, TLAdaptiveDetail,
  TLWizard, TLViewError und Bounded width gestrichen, TLAccordion (unlisted, #29651) ins Paket — panel.css, card.css,
  accordion.css, layout.css, split.css, slide.css, tile-stack.css, wizard.css, adaptive-detail.css, button-bar.css;
  Repeated items 48->… auf die Fill-Regel gekürzt (liest tl-item; Bernhards Auswahlregeln aus #29755 zeichnet layout.css
  nach Q24), TLHtml ohne .tlHtml__error, Element picker ohne die Regel
  der Panel-Knopfleiste; --page-inset gestrichen (TLHtml und Dashboard lesen --tl-space-lg). Literale … lines = <n>.“

- [ ] **Step 3: Paket-Gates**

```bash
cd design-system && node tools/generate.mjs && node tools/lint-css.mjs && node tools/publish-to-worktree.mjs && node --test 2>&1 | grep -E '^ℹ (pass|fail)|^✖'
```

  Expected: alles grün, darunter `ratchet`, `published`, `engine-classes` (alle), `focus-clip`, `titlebar-height`,
  `contracts-4c`, `behaelter`, `contrast`.

- [ ] **Step 4: Maven und Messages**

```bash
cd _Working-Tree/tl8-wt-29584 && export JAVA_HOME=$(ls -d /opt/homebrew/Cellar/openjdk@21/*/libexec/openjdk.jdk/Contents/Home | tail -1)
mvn -o -B install -pl com.top_logic.layout.react,com.top_logic.layout.view -DskipTests 2>&1 | grep -E 'BUILD|ERROR' | head -3
mvn -o -B test -pl com.top_logic.layout.react,com.top_logic.layout.view,com.top_logic.demo.react 2>&1 | grep -E 'Tests run:|BUILD|FAIL' | tail -8
cd ../.. && design-system/tools/check-messages-en.sh
```

  Expected: BUILD SUCCESS; Tests grün (unter englischer JVM-Locale; deutsche Locale rot nur am bekannten #29651);
  `layout.react` zählt `TestSplitPanelReset`, `TestDesignSystemCopy`; `layout.view` `TestViewLoadError`,
  `TestSplitSizePersonalization`. `check-messages-en.sh` erzeugt `js.splitPanel.handle`, `js.wizard.steps` (layout.react)
  und `…element.I18NConstants.ADAPTIVE_DETAIL_HOME = Overview` (layout.view): Diff committen (Engine, englisch),
  zweiter Lauf ohne Diff. Scheitert der Lauf offline an vorgelagerten Modulen, diese erst per
  `mvn -o install -pl <Liste>` installieren (Memory „Gate nach master-Merge“).

- [ ] **Step 5: `altlast.md`** — Abschnitt „## Welle 4c · Behälter — gebaut <Datum>“ vor „## Konsolidierung“: „Gestrichene
  Blöcke“ (die Liste aus Step 2 mit Zeilen), „Neu im Paket“ (die zehn Dateien, `size-wizard-progress`, Titelleiste
  mit `__content`/`__buttons`), „Alt → neu für Anwendungs-Stylesheets“:

| Alt | Neu |
|---|---|
| `.tlPanel`, `--normalized` | `.tl-panel` |
| `.tlPanel--minimized`, `--maximized`, `--hidden` | `.tl-panel[data-tl-state~="minimized"]`, `~="maximized"`; versteckt rendert nichts |
| `.tlPanel--card` | `.tl-panel.tl-card` |
| `.tlPanel--hoverActions`, `--fullLine` | `.tl-panel--hover-actions`, `--full-line` |
| `.tlPanel__header`, `__title`, `__titleContent`, `__toolbar`, `__actions`, `__actionButton` | `.tl-titlebar`, `__title` (`h2`), `__content`, `__actions`, `__buttons` |
| `.tlPanel__content` | `.tl-panel__body` |
| `.tlPanel__buttonBar`, `.tl-dialog__footer` | `.tl-button-bar` |
| `.tlCard`, `--outlined`, `--elevated` | `.tl-card` (Fläche nach Lage: `--nested`, `--overlay`), kein Schatten |
| `.tlCard__header`, `__title`, `__headerActions` | `.tl-titlebar`, `__title`, `__actions` |
| `.tlCard__body--pad-*` | `.tl-card__body--pad-*` |
| `.tl-accordion` (Fläche), `.tl-accordion__section--expanded` | `.tl-card.tl-accordion`; offen: `[aria-expanded="true"]` am Auslöser |
| `.tlStack`, `--*` | `.tl-stack`, `--*` (Abstände `space-sm/md/lg`) |
| `.tlGrid`, `--gap-*`, `--tlGrid-gap` | `.tl-grid`, `--gap-*` |
| `.tlInset`, `--page-inset` | `.tl-inset`, `--panel`, `--card` |
| `.tlBounded`, `.tlItem`, `--tl-item-index` | `.tl-bounded`, `.tl-item`, `--item-index` |
| `.tlDeckPane` | `.tl-deck` |
| `.tlSplitPanel`, `--horizontal`, `--vertical`, `--allCollapsed` | `.tl-split`, `--horizontal`, `--vertical`, `[data-tl-state~="all-collapsed"]` |
| `.tlSplitPanel__child`, `--collapsedHorizontal` | `.tl-split__pane`, `[data-tl-state~="collapsed"]` |
| `.tlSplitPanel__splitter`, `--horizontal`, `--vertical` | `.tl-split__handle` (`role="separator"`) |
| `.tlTileStack`, `--forward`, `--backward` | `.tl-tile-stack`, `[data-tl-state~="backward"]` |
| `.tlTileStack__frame`, `--covered`, `--entering`, `--exiting` | `.tl-tile-stack__frame`, `[data-tl-state~="covered"]`, `~="entering"`, `~="exiting"` |
| `.tlWizard`, `--forward`, `--backward` | `.tl-wizard`, `[data-tl-state~="backward"]` |
| `.tlWizard__header`, `__counter`, `__progress`, `__steps` | `.tl-wizard__header`, `__counter`, `__progress`, `__steps` |
| `.tlWizard__stepItem--done`, `--current`, `--upcoming` | `.tl-wizard__step-item[data-tl-state~="done"]`, `[aria-current="step"]`, ohne Marke |
| `.tlWizard__stepItem::before` (Zähler) | `.tl-wizard__disc` |
| `.tlWizard__stepButton`, `__stepName`, `__stepIcon` | `.tl-button--link`, `.tl-wizard__step-name`, `.tl-icon-sm` |
| `.tlWizard__step--entering`, `--exiting` | `.tl-wizard__step[data-tl-state~="entering"]`, `~="exiting"` |
| `.tlAdaptiveDetail`, `__content` | `.tl-adaptive-detail`, `__content` |
| `.tlAdaptiveDetail__breadcrumb`, `__crumb`, `--current`, `__sep` | `.tl-adaptive-detail__bar > .tl-breadcrumb` |
| `.tlViewError`, `__title`, `__view`, `__detail`; `.tlHtml__error` | `.tl-alert[data-tl-role="error"]` |

  Dazu in `altlast.md` „Offen nach 3b“ die Zeile **„Spaltenbreite und Fixiergrenze per Tastatur“** nachziehen: die
  Breite ist mit 4c erledigt (Pfeile, Home, End am fokussierten Griff, `aria-valuenow`; Befund 13 des Plan-Reviews),
  offen bleibt die Fixiergrenze — die Zeile heißt dann „Fixiergrenze per Tastatur“ mit dem Vermerk „Breite erledigt
  in Welle 4c (#29870)“.

- [ ] **Step 6: Commit** — Paket „Ticket #29870: Ratsche und Engine-Gate Welle 4c -- Behälter-Blöcke gestrichen,
  alte Klassen gesperrt, Grid-Abstand gleich dem Stylesheet; altlast Welle 4c“; Engine (Messages-Diff) „Ticket
  #29870: Generated messages_en for the split handle, the wizard's step list and the adaptive detail's first crumb.“

---

### Task 11: Sichtprüfung lokal

**Files:** keine (Befunde in `altlast.md` „Welle 4c“, Korrekturen als eigene Commits).

- [ ] **Step 1: Demo starten** — wie Memory „Lokale Demo statt Docker“; Hendrik loggt ein.
- [ ] **Step 2: Prüfen**, hell und dunkel, normal und kompakt:
  1. Panelköpfe nebeneinander (mit und ohne Toolbar) auf einer Linie, 40/36 px; Titel `h2`; Kopfknöpfe 24 px.
  2. Doppelklick auf einen Panelkopf maximiert, Escape stellt wieder her; Doppelklick auf einen Kopfknopf löst nur ihn
     aus; minimiert öffnet ein Klick auf den Kopf; Screenreader (VoiceOver) meldet „erweitert/reduziert“ am Minimieren.
  3. Panel mit Knopfleiste und Dialog mit Fuß: gleiche Leiste; Dialog mit Panel im Körper: Startfokus im Fuß des
     Dialogs.
  4. Karte auf der Seite, Karte im schlichten Panel (wie auf der Seite), Karte in einer Karte oder einem Panel als Karte
     (dunkel eine Stufe heller), Karte im Dialog (keine dunklere Fläche); Kommentar-Karten; Accordion.
  4a. Auswählbare Karten (`demo/html-demo.view.xml`, Liste der Exposés, Q24): beim Zeigen ein Hof, kein Schatten; ein
     Klick wählt, der Ring liegt über dem Rand der Karte; mit Tab und Pfeilen der Fokusring neben dem Ring sichtbar;
     Strg/Cmd-Klick in einer Mehrfachliste (`test-object-list.view.xml`-Muster) schaltet um.
  5. Split: Griff als Linie, unter dem Zeiger kräftig; Tab auf den Griff, Pfeile, Home, End, Loslassen speichert;
     Doppelklick stellt die Ausgangsaufteilung her und überlebt ein Neuladen; eingeklappte Fläche mit senkrechtem
     Titel; Spaltenbreite einer Tabelle per Tastatur.
  6. Abstände einer Formularseite und einer Kartenliste vorher/nachher (Standard 1 statt 1,5 rem); Insets in Seite,
     Panel, Karte.
  7. Wizard vorwärts und zurück (gleitet, mit reduzierter Bewegung ohne); Scheiben in drei Stufen; Kachelstapel.
  8. AdaptiveDetail schmal: Breadcrumb mit „Übersicht“; eine kaputte Ansicht zeigt die Fehlermeldung.
- [ ] **Step 3: Befunde** — jede Abweichung als Zeile in `altlast.md` „Welle 4c“; beheben, Gates, je ein Commit.

---

### Task 12: Abschluss — melden, nicht pushen

- [ ] **Step 1:** `git log --oneline 2bf2151a2e..HEAD` (Engine) und `git log --oneline origin/main..HEAD` (Paket)
  zusammenfassen.
- [ ] **Step 2 (Orchestrator):** Trac #29870 `== Migration ==` (Text aus Spec §11 und der Tabelle aus Task 10 Step 5)
  und Keyword `RequiresMigration`; `skalen.md`, Präsentation und STATUS nachziehen; Hinweise an Bernhard für den PR
  (englisch): das Accordion steht im Paket; `MuiCardAdapter` liest `useSurface` nicht, die Stufe nach Verschachtelung
  gilt im MUI-Theme nicht; die Breadcrumb im AdaptiveDetail ist der Darstellungsteil von `TLBreadcrumb` und lässt
  sich nicht über `replace('TLBreadcrumb', …)` ersetzen — ein Part `Breadcrumb` wäre der Weg, seine Entscheidung
  (Abweichung 22); die auswählbaren Einträge aus #29755 zeichnet jetzt das Paket (Q24): beim Zeigen ein Hof statt
  `--shadow-raised` (ein Eintrag schwebt nicht), ausgewählt der Ring über dem Eintrag aus `aria-selected` statt der
  Klassen `tlItem--selectable/--selected` und ohne die Fläche `surface-brand-subtle` (sie läge hinter einer Karte),
  Fokus aus `base.css` — sein Verhalten (Listbox, Tastatur, langes Drücken) bleibt unverändert.
- [ ] **Step 3:** Hendrik melden: Branch, Commits, Gates, Sichtprüfung, offene Befunde. **Push nur nach seiner
  ausdrücklichen Freigabe**, je Repo und Branch benannt; PR gegen master (4b ist mit !1906 gemergt), Reviewer bhu,
  danach `add_reviewers bhu`.

---

## Fragen an Hendrik — entschieden 16.10.

Beide wie empfohlen (Hendrik: „1 und 2 ja“): ViewError ohne Monospace, Abstand aus dem Inset der Seite; nur was eine
Fläche malt, hebt die Stufe — eine Karte im schlichten Panel bleibt auf der Stufe, auf der das Panel liegt
(`panelSurface`, Task 5 und 6).

1. **ViewError ohne Monospace.** Das Alert des Pakets hat Titel und Meldung; Pfad und Ursache stehen als Meldung
   untereinander in normaler Schrift (heute Monospace), und der Abstand zum Rand kommt aus dem Inset der Seite
   (1,5 rem statt der in der Spec genannten 1 rem). Alternative: `AlertState` bekommt ein Feld für einen Detailtext
   in `tl-type-code` — eine Proto-Änderung, die Spec §1 ausschloss. Der Plan folgt dem Alert ohne Änderung.
2. **Karte in einem Panel ohne eigene Fläche.** Spec §4 zählt das Panel als Fläche: eine Karte darin wird `nested`.
   Ein Panel (nicht als Karte) malt aber keine Fläche — dunkel liegt die Karte dann zwei Stufen über dem Grund statt
   einer. Der Plan folgt der Spec; Alternative: nur Karte und Accordion heben die Stufe.
