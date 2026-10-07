# Welle 3b — Daten: Implementierungsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Die Datendarstellung — Tabelle (beide Teile), Baum, Spaltenwahl, Spalten-Layout, Text — aus `tlReactControls.css` abschneiden und durch Paket-Komponenten ersetzen, die **ein** Raster, **einen** Cursor-Ring, **eine** Ziehen-Optik, **einen** Lesewert und Tönung **als Attribut** kennen; mit den Nachzügen W7, W8, W10, W11, N1 im selben PR.

**Architecture:** Paket (`design-system/`): `generate.mjs` erzeugt Rollenregeln als `[data-tl-role="…"]` (auch für Elemente), `base.css` gibt den Fokusring eines Behälters mit `aria-activedescendant` an dessen Cursor-Element ab; neue Komponenten `status`, `drag`, `reorder-list`, `text`, `columns`, `table`, `tree`; Kapsel mit zwei Knöpfen in `choice.css`. Engine (`_Working-Tree/tl8-wt-29584`, Branch `CWS/CWS_29617_design_system_welle_3b` = master `b29546f2ad`): Helfer `bridge/token-px.ts`, `bridge/filter-options.ts`, `stateAttr` in `bridge/css.ts`, Tastatur und Live-Bereich in `bridge/list-reorder.ts`; `FieldValue` als einziger Lesewert; `TLText`, `TLColumns`, `TLColumnSelect`, `TLTreeView`, `TLTableView` auf die Paketklassen; Java: `rowHeight` fällt, `TextTone.ACCENT` fällt, neue Resource-Keys.

**Tech Stack:** Node ohne Abhängigkeiten im Paket; React 19, TypeScript, Vite, `@floating-ui/react` in der Engine; Java 21/Maven (JUnit 4) für `TableViewControl`, `TextTone`, `I18NConstants`.

**Spec:** `docs/superpowers/specs/2026-10-02-welle-3b-daten-design.md` (freigegeben 02.10.). Vorlage und Lehren: Plan und Ledger der Welle 3a (`docs/superpowers/plans/2026-10-01-welle-3a-navigation-popups.md`, `.superpowers/sdd/2026-10-01-welle-3a-navigation-popups/progress.md`).

**Vorgeprüft (02.10., beim Schreiben):** Alles Paket-CSS dieses Plans, die Generator-Änderung und jeder neue oder geänderte Paket-Test liefen in einer Kopie des Pakets: `node tools/lint-css.mjs` grün, `node --test` grün bis auf die Vertragstexte, die die Tasks schreiben; die neuen Tests scheitern gegen das unveränderte Paket (rot zuerst). Die Engine-TSX (Helfer, Select, Lesewert, Text, Spalten, Spaltenwahl, Baum, Tabelle) lief in einer Kopie von `react-src` durch `tsc --noEmit` (0 Befunde) und beide Vite-Builds. Java, Maven und `check-messages-en.sh` sind **nicht** vorgeprüft.

**Plan-Review 02.10. eingearbeitet am 07.10.** (B1, M1–M5, Punkte 1–19, Entscheidungen 16/22/23; Review: `.superpowers/sdd/2026-10-02-welle-3b-daten/plan-review.md`). Nachgeprüft in Scratch-Kopien: P9 mit Fehler- und Warnlinie (`red-34`) und allen Paaren — `node --test` 270/270 (5 skipped), Lint grün, Probe-Theme ändert nur `focus-ring` hell samt Hinweiszeile; die neue `drag.css` (Fläche `::before`) und ihr Test, die Regel für das deaktivierte Segment (P1) — Lint und Tests grün; `useListReorder` mit Tastatur und Fokusrückgabe (E2, M2) samt Aufrufern Spaltenwahl und Werteliste — `tsc --noEmit` 0 Befunde. Jeder neue Grep lief gegen `b29546f2ad`.

---

## Abweichungen von der Spec (entschieden 07.10.)

Jede Zeile nennt den Befund, den Beleg und die Variante, die dieser Plan baut. Hendrik hat alle fünf am 07.10. entschieden (Spec-Kopf, `docs/skalen.md` „Welle 3b“).

| # | Spec | Befund (Beleg) | Variante (entschieden 07.10.) |
|---|---|---|---|
| A1 | §13 Kontrast: `status-error-border` auf `surface-interactive-selected` ≥ 3,0 und `text-placeholder` auf `surface-interactive-selected` ≥ 4,5, beide Modi | Mit den heutigen Tokens: `status-error-border` 2,88 hell / 2,43 dunkel; `text-placeholder` 4,17 hell / 3,42 dunkel (gerechnet mit `tools/resolve.mjs` + `tools/lib/contrast.mjs`; `tokens.json:18,46`). Für den Platzhalter dunkel wäre ≥ 4,5 auf `gray-64` erst mit `gray-18` erreicht — heller als `text-secondary` (`gray-29`, 4,27 auf derselben Fläche). Plan-Review (M5): auch `status-warning-border` auf selected 2,71 / 2,44 und `status-error-border` auf `surface-interactive-hover` dunkel 2,59; der erste Tausch (dunkel `red-35`) hätte dunkel Rand = Fläche `status-error-surface` gesetzt — die Doppelrolle, die `skalen.md` ausschließt. | **Entschieden 07.10. — Fehler- und Warnlinie:** neue Primitive `red-34` (`#F2554A`); hell `status-error-border` `{red-35}`→`{red-41}`, `status-warning-border` `{amber-36}`→`{amber-43}`; dunkel `status-error-border` `{red-41}`→`{red-34}`, `status-warning-border` `{amber-43}`→`{amber-36}`. Kein Primitiv trägt in einem Modus zwei Rollen (dunkel bleibt `red-35` allein `status-error-surface`). Gemessen (ausgewählt / Zeigen / Layer): hell Fehler `red-41` 3,63 / 3,97 / 4,45, dunkel Fehler `red-34` 3,18 / 3,39 / 4,81; hell Warnung `amber-43` 3,60 / 3,95 / 4,42, dunkel Warnung `amber-36` 3,25 / 3,46 / 4,91. Paare: beide Linien auf `surface-interactive-selected` und `-hover` — **Task P9 Steps 3–4**. **Platzhalter auf ausgewählter Fläche: Paar entfällt**; stattdessen `text-placeholder` ≥ 4,5 auf `surface-base`, `-layer`, `-layer-nested` (4,90/5,12/5,12 hell, 5,62/5,18/4,75 dunkel). Nebenbefund: auch `text-secondary` (4,27) und `text-helper` (3,64) liegen dunkel auf `surface-interactive-selected` unter 4,5 — die Gruppenzeilen-Anzahl ist `text-secondary`; Kandidat für `altlast.md` „Offen“. |
| A2 | §3 „die Wurzel ist `role=grid`“; „Der Körper behält den Fokus (`tabindex=0`) und zeigt mit `aria-activedescendant` auf die Cursorzeile“ | (a) Ein Raster darf nur Zeilen besitzen; Filterleiste, Spaltenwahl-Knopf und Griff der Fixiergrenze liegen heute in der Wurzel außerhalb jeder Zeile (`TLTableView.tsx:1272–1366`, `1532–1534`, `1524–1531`) — axe meldet `aria-required-children`. (b) `aria-activedescendant` ist in ARIA 1.2 nur an `composite` (grid, tree …), `group`, `combobox`, `textbox`, `application` erlaubt; der Körper wäre `role=rowgroup` — nicht erlaubt. | **Entschieden 07.10.:** `role=grid`/`treegrid` am Element **`tl-table__grid`** (Kopf + Körper); Filterleiste, Spaltenwahl-Knopf, Fixiergrenze und Vorschau liegen im **Rahmen** `tl-table__frame` außerhalb des Rasters. **Den Fokus (`tabindex=0`, `aria-activedescendant`) hält das Raster**, der Körper scrollt nur (`tabindex=-1`). Pfeil links/rechts ohne Auf-/Zuklappen schiebt den Körper um `size-control` waagerecht (sonst ginge das Scrollen per Tastatur verloren) — Tasks P7, E7. |
| A3 | §13 Engine-Gate: `grep` über … „und `docs/`“ findet keine alte Klasse | `docs/plans/2026-03-*.md` (15 historische Pläne) enthalten 158 Treffer (`git grep -c`; Plan-Review: tatsächlich 14 Dateien, 149 Treffer, dazu 9 in `docs/faq`); 3a hat dort die Namen nur markiert („alt (bis Welle 3a)“, Commit `21a8aa52c3`). | **Entschieden 07.10.:** `docs/faq/` wird umgeschrieben und ist im Gate; `docs/plans/` bekommt je Datei einen Vermerk wie in 3a und ist **nicht** im Gate — Task E10. |
| A4 | §11 „`tlText--strong` … und `tlText--placeholder` … werden auf die Form-Attribute bzw. `tl-type-*` umgestellt“ | `TextElement.Config` kennt kein Form-Attribut (`label`, `input`, `overflow`, `variant`, `tone`, `appearance`; `TextElement.java:78–153`). | **Entschieden 07.10.:** **Stark** = Typo-Klasse als `css-class` (`tl-type-body-strong`; alle fünf Stellen haben die Variante `body`). **Platzhalter** = neuer Ton `TextTone.PLACEHOLDER("placeholder")` — das Vokabular gewinnt einen Wert (§15 nennt nur den Verlust von `accent`); `ConfigListEditorControl` setzt den Ton — Task E4. |
| A5 | §4 Filterknopf: aktiv „gefüllte Glyphe in `icon-primary`, sonst die leere in `icon-secondary`“ | Font Awesome Free 6.7.1 (`ext.com.fontawesome/src/main/webapp/style/fontawesome.css`) hat keinen leeren Trichter (`fa-regular fa-filter` gibt es nur in Pro); `bi-*` ist im TSX verboten (§12). | **Entschieden 07.10.:** Eine Glyphe `fa-solid fa-filter`; aktiv: `icon-primary` über `data-tl-state~="filtered"` **und** Beschriftung/Tooltip „Filter (aktiv)“ (neuer Key `js.table.filterActive`), damit der Zustand nicht an der Farbe allein hängt (WCAG 1.4.1) — Tasks P7, E8. |

**Weitere Entscheidungen 07.10.** (Spec-Fragen des Plan-Reviews):

- **(22) Kopf-Kästchen:** nur `indeterminate`, **kein** `aria-checked="mixed"` — ARIA in HTML verbietet `aria-checked` am nativen Kästchen, der Browser meldet `indeterminate` selbst als „gemischt“. Tasks P1 (Vertrag `choice`), P7 (Vertrag `table`), P9 (Pflichtbegriff `indeterminate`), E1 (`TLCheckbox`), E8 (Kopf).
- **(23) Pill als Wurzel:** TLText mit `appearance=pill` (oder mit Farbrolle) rendert `span.tl-pill` selbst als Wurzel — mit `data-tl-role` und den übrigen Text-Attributen (`id`, `role`, `data-tooltip`, Klasse aus `css-class`); keine Hülle `span.tl-text`. Tasks P6 (Vertrag `text`), E4.
- **(16) Icons:** Zahnrad und Speichern/Bestätigen/Abbrechen nach Spec §12 `tl-icon-sm`, nicht `tl-icon-md` — Tasks E8, E9.

**Präzisierungen (keine Entscheidung nötig, im Review zu sehen):**

- **Cursor-Ring über `::after`:** Chromium malt positionierte Kinder (haftende Zellen) über den eigenen Umriss einer Zeile — der Altbestand zeichnete den Cursor deshalb an den Zellen (`tlReactControls.css:3016–3020`). `base.css` zeichnet den Ring darum an einer Fläche `::after` des Cursor-Elements (Ebene `layer-sticky`, der Behälter isoliert den Stapel). `generate.test.mjs` zählt danach zwei `:focus-visible` (zwei Selektoren einer Regel), `focus.test.mjs` weiter genau **eine** Ring-Deklaration — Task P5.
- **`data-tl-axis="horizontal"`** am Behälter von Einträgen, die nebeneinander stehen (Select-Chips, Kopfzeile): woran die Ziehen-Optik „waagerecht: links/rechts“ (§9) erkennt — Task P4.
- **Spaltenzug ohne Sonderzonen:** mit `useListReorder` fallen die Ablagezonen „vor der ersten Spalte“ (Kopfzelle der Auswahl, `TLTableView.tsx:1383–1390`) und „hinter der letzten“ (`1504–1519`); die Hälften der ersten und letzten Spalte leisten dasselbe — Task E8.
- **Übergangsblock** „Table cells holding legacy controls“ im alten Stylesheet: Zellregeln, die Altklassen anderer Wellen lesen (`.tlStack--row`, `.tlValueList--block`, `tlRowCommandCell` aus `RowCommandColumn.java:68`), bleiben dort und lesen `tl-table__cell` — Task E7.
- **Block „Controls placed on the primary (accent) app bar“** (`tlReactControls.css:2066–2079`) enthält nur das Umfärben über `--tlText-tone`; er fällt mit ihm (Text ohne Ton erbt die Farbe) — Task E4.
- **`TLValueList`** verschiebt per Tastatur heute mit Pfeil **ohne** Alt (`TLValueList.tsx:87–102`); mit dem gemeinsamen Hook gilt Alt + Pfeil wie überall — Task E2.
- **Name des Baums:** `ReactTreeControl` führt keinen Namen im Zustand (Schlüssel `ReactTreeControl.java:44–110`); `aria-label` ist darum immer `js.tree.label` — Task E6.
- **Basis:** heute 270 Tests (nicht 268), Lint grün; `tsc --noEmit` in der Engine 0 Befunde.

---

## Global Constraints

- Alles Öffentliche: Englisch, kebab-case, Präfix `tl` (`--tl-…`, `.tl-…`, `data-tl-…`); Zustände sind Attribute, nie Klassen (CLAUDE.md „Namen“). Tönung ist `data-tl-role`, Ton ist `data-tl-tone`.
- `src/tokens.json` trägt nur Referenzen `{name}`; Werte stehen in `src/primitives.json`. Keine neuen Tokens (Spec §12): Zeilen `size-row`, Kopf `size-bar`, Einzug und Toggle `size-control-sm`, Griffe `space-xs`, Ebenen `layer-raised`/`-sticky`/`-popover`.
- Nach jeder Änderung an `src/`: `node tools/generate.mjs`; `node --test` und `node tools/lint-css.mjs` sind das Gate (Basis 270 Tests, Lint grün). **Kein Commit mit rotem Test.**
- Kein Literal in Komponenten-CSS (Farbe, Maß, Dauer) außer einheitenlosen Anteilen (`opacity: 0.4`, `lint-css.mjs:44`); kein `:focus` ohne `-visible`, kein `outline` außer dem Basis-Ring und `outline-offset` als ±`focus-offset`; `focus-ring` nur in `base.css`; `font-weight`/`font-size` nur in `tl-type-*`; Schrift-Reset nur in `:where(…)`; jeder Block mit `display` setzt `[hidden] { display: none }`.
- Außerhalb von `dist/` wird nichts im Namensraum `--tl` definiert — auch nicht inline im TSX: Zeilenhöhe und Einzug rechnet das TSX aus Token-Pixeln (`useTokenPx`).
- Icons über `ThemeIcon` mit `tl-icon-sm` (Knopf-Icons `tl-button__icon`); Glyphen als Konstanten `css:fa-solid …`; keine `bi-*`-Klassen, keine Textzeichen (▲▼▾▸▶▼×), keine Inline-SVGs (Spec §12).
- `dist/` kommt nur über `node tools/publish-to-worktree.mjs` in den Worktree (Task E1).
- Engine: `messages_en.properties` nie von Hand — JavaDoc schreiben, `design-system/tools/check-messages-en.sh` laufen lassen, Diff committen, Deutsch in `messages_de.properties` von Hand nachziehen. Vor jedem Push `git fetch` (Bernhard committet auf unsere Branches); Push macht Hendrik.
- Commits mit Präfix `Ticket #29617:`; Paket-Commits auf `main` des Projekts (deutsch), Engine-Commits im Worktree (englisch); Trailer `Co-Authored-By: <Modell, das den Task gebaut hat>` (Opus: `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`).
- Keine Zeit- oder Aufwandsangaben in Docs oder Kommentaren. `docs/skalen.md`, `docs/praesentation.md`, `STATUS.md` zieht der Orchestrator (CLAUDE.md), nicht ein Task.

**Befehle (in jedem E-Task gleich; `$SCRATCH` = Scratchpad der Sitzung):**

```bash
WT=/Users/hendrik/Claude/TopLogic-v8-DesignSystem/_Working-Tree/tl8-wt-29584
# TypeScript (0 Befunde) und beide Bundles
cd $WT/com.top_logic.layout.react && PATH=$PWD/node:$PATH ./node_modules/.bin/tsc --noEmit -p .
PATH=$PWD/node:$PATH ./node_modules/.bin/vite build -c vite.config.bridge.ts --outDir $SCRATCH/vite-bridge
PATH=$PWD/node:$PATH ./node_modules/.bin/vite build -c vite.config.controls.ts --outDir $SCRATCH/vite-controls
# Modul-Tests (offline, lokales Repo des Worktrees); eine Klasse nur mit voll qualifiziertem Namen
cd $WT && MVN="mvn -o -B -Dmaven.repo.local=$WT/.m2/repository -Dskip.npm -Dskip.installnodenpm"
$MVN test -DskipTests=false -pl com.top_logic.layout.react 2>&1 | tee $SCRATCH/mvn-react.log | tail -20
$MVN install -pl com.top_logic.layout.react 2>&1 | tail -3   # vor Tests nachgelagerter Module
$MVN test -DskipTests=false -pl com.top_logic.layout.view 2>&1 | tee $SCRATCH/mvn-view.log | tail -20
# messages_en
cd $WT && MAVEN_ARGS="-Dmaven.repo.local=$WT/.m2/repository -Dskip.npm -Dskip.installnodenpm" ../../design-system/tools/check-messages-en.sh
# Paket-Gates, die den Worktree lesen (Ratsche, Engine-Klassen)
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem/design-system && node tools/inventory.mjs && node --test test/ratchet.test.mjs test/engine-classes.test.mjs
```

---

## Review Focus

1. **Cursor-Ring über fixierten Spalten, nur mit Tastatur:** Tab in die Tabelle, Pfeil ab — der Ring liegt innen um die ganze Zeile, auch über fixierten und angehefteten Zellen; Klick mit der Maus zeigt keinen; der Ring im Select-Suchfeld (auch `aria-activedescendant`) bleibt. Gate: `focus.test.mjs` „der Cursor-Ring …“ (P5) prüft beide Selektoren und die Fläche; Sichtprüfung E11 Punkt 1 klickt, tippt dann Pfeil (Chromium setzt `:focus-visible` nach einem Mausklick nicht in jedem Fall — fällt der Ring dann aus, ist das ein Befund für Fable, nicht für einen Fix im Task).
2. **Dichte umschalten bei offener Tabelle:** Zeilen und Einzug springen auf 32 px/24 px, die Zeilen liegen weiter lückenlos, der Server bekommt das neue Fenster. Gate: `useTokenPx` beobachtet `data-tl-density` am `html` (E2 Step 1); E7 Step 4 sendet `scroll` bei neuer Zeilenhöhe; Sichtprüfung E11 Punkt 3.
3. **Schnelles Scrollen:** Zeilen, die noch nicht da sind, sind Skeleton-Zeilen, das Raster ist `aria-busy` und verliert es, sobald alle da sind; eine leere Tabelle sagt „Keine Einträge“ statt einer leeren Fläche. Gate: E7 Step 4 (`missing`), Sichtprüfung E11 Punkt 6.
4. **Alt + Pfeil an den Enden und waagerecht:** am ersten/letzten Eintrag passiert nichts (kein Befehl, keine Ansage); bei Select-Chips verschiebt Alt + Pfeil links/rechts und löst **nicht** die Browser-Navigation „Zurück“ aus (Alt + Links unter Windows/Linux). Gate: `keyboardMove` prüft die Grenzen und ruft `preventDefault` (E2 Step 3); Sichtprüfung E11 Punkt 8.
5. **Tönung ohne Pill in der Kapsel:** ein Chip mit Rolle zeigt die Rolle, gedrückt die Marke; Zeigen bleibt sichtbar; ein Segment mit Rolle ebenso; ein deaktivierter Chip und ein deaktiviertes Segment zeigen keine Rolle mehr. Gate: `roles.test.mjs` prüft die Rollenregeln an Chip und Segment und das deaktivierte Segment (P1), die Reihenfolge Rolle → Zeigen → Gewählt steht in `choice.css` (P1 Step 3); Sichtprüfung E11 Punkt 9.

---

## Dateistruktur

**Paket `design-system/`** (neu, sofern nicht „ändern“):

| Datei | Verantwortung |
|---|---|
| `tools/generate.mjs` (ändern) | `expandRoles` erzeugt `<ziel>[data-tl-role="<rolle>"]`, Ziel Block oder Element, Rollenart `brand`; `baseCss` gibt den Ring an das Cursor-Element ab |
| `tools/lint-css.mjs` (ändern) | Modifier-Listen (`tl-pill`, `tl-avatar`, `tl-alert` ohne Rollen; neue Blöcke), Zustandswörter der Welle |
| `tools/lib/pairs.mjs`, `src/primitives.json`, `src/tokens.json`, `specimen/probe.theme.css` (ändern/erzeugen) | Kontrastpaare der Daten, Fehler- und Warnlinie mit neuer Stufe `red-34` (A1) |
| `src/components/pill/pill.css`, `avatar/avatar.css`, `alert/alert.css` (ändern) | Rolle als Attribut |
| `src/components/choice/choice.css` (ändern) | Rollen an Chip und Segment, entfernbare Kapsel `tl-chip__toggle`/`__remove` |
| `src/components/select/select.css` (ändern) | `tl-select__status` und Chip-Ziehen fallen, Griff als Knopf |
| `src/components/status/status.{css,contract.md,spec.html}` | Laden, leer, Fehler als Zeile |
| `src/components/drag/drag.{css,contract.md}` | die eine Ziehen-Optik |
| `src/components/reorder-list/reorder-list.{css,contract.md,spec.html}` | umsortierbare Liste |
| `src/components/text/text.{css,contract.md,spec.html}`, `columns/columns.{css,contract.md,spec.html}` | Text, Spalten-Layout |
| `src/components/table/table.{css,contract.md,spec.html}`, `tree/tree.{css,contract.md,spec.html}` | Raster, Baum |
| Verträge und Specimen `pill`, `avatar`, `alert`, `choice`, `select`, `field`, `skeleton` (ändern) | Nachzüge |
| `specimen/index.html` (ändern) | Links auf die neuen Specimen |
| `test/roles.test.mjs`, `components.test.mjs`, `feedback.test.mjs`, `lint-css.test.mjs`, `choice.test.mjs`, `select.test.mjs`, `generate.test.mjs`, `focus.test.mjs`, `pairs.test.mjs` (ändern) | Gates an den neuen Stand |
| `test/status.test.mjs`, `drag.test.mjs`, `text.test.mjs`, `table.test.mjs`, `tree.test.mjs`, `contracts-3b.test.mjs` | neue Gates |
| `test/engine-classes.test.mjs`, `test/ratchet.json` (ändern, **erst in E-Tasks**) | Engine-Gate, Ratsche |

**Engine `com.top_logic.layout.react/`** (Branch `CWS/CWS_29617_design_system_welle_3b`):

| Datei | Verantwortung |
|---|---|
| `react-src/bridge/token-px.ts` (neu) | `tokenPx`, `useTokenPx` — eine Fassung statt drei (Toolbar, Popover, neu Tabelle/Baum) |
| `react-src/bridge/filter-options.ts` (neu) | `filterOptions` |
| `react-src/bridge/css.ts`, `bridge/list-reorder.ts`, `bridge-entry.ts`, `bridge/popover.ts` (ändern) | `stateAttr`; Tastatur, Live-Bereich, `reorderState`; Exporte; `gapPx` über `tokenPx` |
| `react-src/controls/pill/TLPill.tsx`, `selectOptions.tsx`, `form/FieldValue.tsx`, `TLResourceCell.tsx` (ändern) | `roleAttr`, `OptionLabel`; ein Lesewert mit zwei Link-Arten |
| `react-src/controls/TLDropdownSelect.tsx`, `TLOptionChips.tsx`, `TLSegmentedChoice.tsx`, `TLAvatar.tsx`, `TLValueList.tsx`, `TLToolbar.tsx` (ändern) | Rollen, Status, Filter, Umsortieren |
| `react-src/controls/TLText.tsx`, `TLColumns.tsx`, `TLColumnSelect.tsx`, `TLTreeView.tsx`, `TLTableView.tsx` (ändern) | die fünf Controls der Welle |
| `src/main/java/com/top_logic/layout/react/I18NConstants.java`, `META-INF/messages_de.properties` (ändern) | `js.reorder.*`, `js.tree.label`, `js.table.selectAll|selectRow|empty|filterActive` |
| `…/control/common/TextTone.java`, `ReactTextControl.java`, `…/control/table/TableViewControl.java` (ändern) | `ACCENT` fällt, `PLACEHOLDER` neu; `rowHeight` fällt |
| `com.top_logic.layout.view/…/element/TextElement.java`, `…/inspector/InspectedNodeElement.java`, `…/views/admin/access-control/coverage.view.xml` (ändern) | JavaDoc, starker Text |
| `com.top_logic.layout.configedit/…/ConfigListEditorControl.java` (ändern) | Platzhalter als Ton |
| `com.top_logic.demo.react/…/views/demo/{styling-demo,html-demo,repeater-card}.view.xml`, `…/views/tickets/comment.view.xml` (ändern) | `accent` und `tlText--strong` fallen |
| `src/main/webapp/style/tlReactControls.css` (ändern) | die Blöcke aus Spec §1, der Block der Primär-App-Bar, neuer Übergangsblock |
| `docs/faq/react-view-layer.md`, `docs/faq/react-theme-tokens.md`, `docs/plans/*.md` (ändern) | Doku auf die Paketnamen |

**Zeilenangaben** im alten Stylesheet beziehen sich auf master `b29546f2ad`; Löschungen innerhalb eines Tasks von unten nach oben, danach mit `grep -n` prüfen. **Ab E3 sind sie nur Orientierung:** E2 löscht im Block TLValueList (895–911) und verschiebt alles danach; jeder Task findet seine Regeln über die Überschrift und den Selektor, die der Step nennt (`grep -n` auf beide), nicht über die Zeilennummer.

---

## Teil P — Paket

### Task P1: Rolle als Attribut — Generator, Pill, Avatar, Alert, Chip, Segment

**Files:**
- Modify: `design-system/tools/generate.mjs:22-42` (Rollenregeln), `tools/lint-css.mjs:74-80,98`
- Modify: `src/components/pill/pill.css:32-40`, `avatar/avatar.css:40-41`, `alert/alert.css:1-25`, `choice/choice.css:197-203`, nach `.tl-chip[hidden]` und nach `.tl-segmented__segment:disabled`
- Modify: Specimen `pill.spec.html`, `avatar.spec.html`, `alert.spec.html`, `select.spec.html`, `field.spec.html`, `choice.spec.html:35`; Verträge `pill.contract.md`, `avatar.contract.md`, `alert.contract.md`, `choice.contract.md`
- Test: `test/roles.test.mjs`, `test/components.test.mjs`, `test/feedback.test.mjs`, `test/lint-css.test.mjs`

**Interfaces:**
- Produces: `.tl-pill[data-tl-role="brand|error|warning|success|info|category-1…8"]`, `.tl-avatar[data-tl-role="category-1…8"]`, `.tl-alert[data-tl-role="error|warning|success|info"]` (Pflicht), `.tl-chip[data-tl-role=…]`, `.tl-segmented__segment[data-tl-role=…]`; Marker `/* @tl-roles: brand|status|category <.tl-block oder .tl-block__element> */`. Die Klassen `tl-pill--<rolle>`, `tl-avatar--category-*`, `tl-alert--<status>` gibt es nicht mehr. Leser: E1.

- [ ] **Step 1: Tests umstellen (rot)** — `test/roles.test.mjs`: die zwei Schleifen 22–34 ersetzen durch

```js
// Die Tönung ist ein Attribut (3b §11, W7): data-tl-role an Pill, Avatar, Alert, Chip und Segment.
const rolle = (ziel, r) => regel(`${ziel}[data-tl-role="${r}"]`);

for (const ziel of ['.tl-pill', '.tl-avatar', '.tl-chip', '.tl-segmented__segment']) {
  test(`components.css: ${ziel} hat je Kategorie genau eine Regel aus Fläche und Linie`, () => {
    for (const k of KATEGORIEN)
      assert.deepEqual(rolle(ziel, k), [`background: var(--tl-${k}-subtle); border-color: var(--tl-${k}-border);`], k);
  });
}

for (const ziel of ['.tl-pill', '.tl-alert', '.tl-chip', '.tl-segmented__segment']) {
  test(`components.css: ${ziel} hat je Bedeutung genau eine Regel aus Fläche und Linie`, () => {
    for (const s of STATUS)
      assert.deepEqual(rolle(ziel, s), [`background: var(--tl-status-${s}-subtle); border-color: var(--tl-status-${s}-border);`], s);
  });
}

for (const ziel of ['.tl-pill', '.tl-chip', '.tl-segmented__segment']) {
  test(`components.css: ${ziel} kennt die Marke als Rolle`, () => {
    assert.deepEqual(rolle(ziel, 'brand'), ['background: var(--tl-surface-brand-subtle); border-color: var(--tl-border-interactive);']);
  });
}

test('keine Rolle ist mehr ein Modifier: weder im Generat noch in den Quellen', () => {
  assert.doesNotMatch(OUT, /\.tl-(pill|avatar|alert|chip)--(brand|error|warning|success|info|category-\d)\b/);
  for (const [name, css] of componentCssFiles()) assert.doesNotMatch(css, /\.tl-pill--brand\b/, name);
});

// Plan-Review Punkt 18: die Rollenregel (0,2,0) schlüge sonst das deaktivierte Segment, das nur die
// Schriftfarbe setzt. Der Chip braucht das nicht: .tl-chip:disabled setzt Rahmen und Fläche und steht später.
test('ein deaktiviertes Segment zeigt keine Rolle (wie der Chip); gewählt bleibt es erkennbar', () => {
  assert.deepEqual(regel('.tl-segmented__segment[data-tl-role]:disabled:not([aria-checked="true"]):not([aria-pressed="true"])'),
    ['border-color: transparent; background: transparent;']);
});
```

und im Fall „der Marker wird ersetzt“ die drei ersten Zeilen ersetzen durch

```js
  const css = expandRoles('.tl-x { }\n/* @tl-roles: status .tl-x */\n/* @tl-roles: brand .tl-x__y */\n', T);
  assert.ok(!css.includes('@tl-roles'), 'Marker steht noch im Generat');
  assert.ok(css.includes('.tl-x[data-tl-role="info"] { background: var(--tl-status-info-subtle); border-color: var(--tl-status-info-border); }'));
  assert.ok(css.includes('.tl-x__y[data-tl-role="brand"] { background: var(--tl-surface-brand-subtle); border-color: var(--tl-border-interactive); }'));
  assert.throws(() => expandRoles('/* @tl-roles: farbe .tl-x */', T), /farbe/);
  assert.throws(() => expandRoles('/* @tl-roles: status .tl-x--y */', T), /weder Block- noch Elementklasse/);
```

`test/components.test.mjs`: in „pill.css liest je Rolle …“ (Zeile 185–186) `css.includes(`.tl-pill--${k}`)` → `css.includes(`.tl-pill[data-tl-role="${k}"]`)` mit Meldung `Rolle ${k} fehlt`; im Pill-Specimen-Test (191–192) die Schleife ersetzen durch

```js
  // Name und Rolle stehen als Paar in VARIANTEN (['brand', 'brand', 'Eigenes']): an der alten Datei
  // (['brand', 'tl-pill--brand', …]) greift die Prüfung nicht.
  for (const k of Object.keys(PILL).filter((n) => n !== 'neutral'))
    assert.ok(html.includes(`['${k}', '${k}',`), `Rolle ${k} fehlt`);
  assert.ok(html.includes('data-tl-role="%ROLE%"'), 'Specimen setzt die Rolle nicht als Attribut');
  assert.doesNotMatch(html, /tl-pill--/, 'Specimen zeigt noch einen Rollen-Modifier');
```

im Avatar-Test (253) `css.includes(`.tl-avatar--${k}`)` → `css.includes(`.tl-avatar[data-tl-role="${k}"]`)`. `test/feedback.test.mjs:14,16`: `.tl-alert--${s}` → `.tl-alert[data-tl-role="${s}"]` (beide Stellen). `test/lint-css.test.mjs:156` ersetzen durch

```js
  // Seit 3b ist die Rolle ein Attribut (data-tl-role): auch die Bedeutung an der Pill ist kein Modifier mehr.
  assert.ok(lint('.tl-pill--error { color: var(--tl-text-primary); }', { known, file: 'x.css' })
    .some((v) => v.includes('kein Modifier von tl-pill')), 'Rolle als Modifier der Pill');
  assert.deepEqual(lint('.tl-pill[data-tl-role="error"] { color: var(--tl-text-primary); }', { known, file: 'x.css' }), []);
```

und 165 durch `assert.deepEqual(lint('.tl-alert[data-tl-role="error"] { color: var(--tl-text-primary); }', { known, file: 'x.css' }), []);`.

- [ ] **Step 2: Rot sehen** — `cd design-system && node --test test/roles.test.mjs test/components.test.mjs test/feedback.test.mjs test/lint-css.test.mjs` → FAIL (u. a. „kennt die Marke als Rolle“, „der Marker wird ersetzt“, Alert, `kein Modifier von tl-pill`, „ein deaktiviertes Segment …“).

- [ ] **Step 3: Generator, CSS, Lint** — `tools/generate.mjs` Zeilen 22–42 (Kommentar, `ROLLEN`, `MARKER`, `expandRoles`) ersetzen durch

```js
// Rollenregeln: Pill, Avatar, Alert, Chip und Segment lesen je Rolle dieselben zwei Tokens, Fläche und
// Linie. Statt sie in jeder Datei auszuschreiben, steht dort ein Marker-Kommentar
// `/* @tl-roles: <art> <.tl-ziel> */`, und hier entsteht je Rolle aus src/tokens.json eine Regel
// `<ziel>[data-tl-role="<rolle>"]` — die Tönung ist ein Attribut, kein Modifier (3b §11, W7); eine neue
// Kategorie ist eine Zeile in tokens.json, nicht fünf. Ziel ist ein Block (tl-chip) oder ein Element
// (tl-segmented__segment), nie ein Modifier. Kommentar, damit Klassen-Gate und Tests auf src/ ihn
// überlesen. docs/skalen.md „Gleiches wird zusammengelegt“.
const ROLLEN = {
  brand: () => [['brand', 'surface-brand-subtle', 'border-interactive']],
  category: (T) => Object.keys(T.color.light).map((n) => /^(category-\d+)-subtle$/.exec(n)?.[1])
    .filter((r) => r && `${r}-border` in T.color.light).map((r) => [r, `${r}-subtle`, `${r}-border`]),
  status: (T) => Object.keys(T.color.light).map((n) => /^status-([a-z]+)-subtle$/.exec(n)?.[1])
    .filter((s) => s && `status-${s}-border` in T.color.light).map((s) => [s, `status-${s}-subtle`, `status-${s}-border`]),
};
const MARKER = /\/\*\s*@tl-roles:\s*(\S+)\s+(\S+)\s*\*\//g;
const ZIEL = /^\.tl-[a-z0-9]+(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?$/;

/** Ersetzt jeden Marker `/* @tl-roles: <art> <.tl-ziel> *\/` durch die Rollenregeln aus T. */
export function expandRoles(css, T) {
  return css.replace(MARKER, (_, art, sel) => {
    if (!ROLLEN[art]) throw new Error(`@tl-roles: unbekannte Rollenart ${art} (bekannt: ${Object.keys(ROLLEN).join(', ')})`);
    if (!ZIEL.test(sel)) throw new Error(`@tl-roles: ${sel} ist weder Block- noch Elementklasse`);
    return ROLLEN[art](T).map(([rolle, flaeche, linie]) =>
      `${sel}[data-tl-role="${rolle}"] { background: var(--tl-${flaeche}); border-color: var(--tl-${linie}); }`).join('\n');
  });
}
```

(`ZIEL` lehnt `.tl-x--y` ab: nach `-` muss ein Zeichen aus `[a-z0-9]` folgen.)

`pill.css` 32–40 (`.tl-pill--brand`-Regel und der Kommentar mit dem Marker) ersetzen durch

```css
/* Die Rolle ist ein Attribut, data-tl-role (3b §11): je Rolle Fläche und Linie, erzeugt aus
   src/tokens.json (tools/generate.mjs). Ohne Attribut ist die Pill neutral. */
/* @tl-roles: brand .tl-pill */
/* @tl-roles: status .tl-pill */
```

(die Zeile `/* @tl-roles: category .tl-pill */` bleibt). `avatar.css:40` Kommentar (der Marker in Zeile 41 bleibt): „Je Kategorie (data-tl-role) Fläche und Linie, erzeugt aus src/tokens.json (tools/generate.mjs).“ `alert.css`: im Kopfkommentar „Die Bedeutung ist ein Modifier und Pflicht —“ → „Die Bedeutung ist ein Attribut (data-tl-role) und Pflicht —“; 19–25 ersetzen durch

```css
/* Je Bedeutung (data-tl-role, Pflicht) Fläche und Linie, erzeugt aus src/tokens.json (tools/generate.mjs). */
/* @tl-roles: status .tl-alert */

.tl-alert[data-tl-role="error"] .tl-alert__icon { color: var(--tl-status-error-text); }
.tl-alert[data-tl-role="warning"] .tl-alert__icon { color: var(--tl-status-warning-text); }
.tl-alert[data-tl-role="success"] .tl-alert__icon { color: var(--tl-status-success-text); }
.tl-alert[data-tl-role="info"] .tl-alert__icon { color: var(--tl-status-info-text); }
```

`choice.css`: direkt nach `.tl-chip[hidden] { display: none; }` einfügen

```css

/* Die Tönung trägt der Chip selbst (data-tl-role, 3b §11) — keine Pill in der Kapsel. Die Rollenregeln
   stehen vor Zeigen und Gewählt: beide schlagen die Tönung bei gleicher Spezifität. */
/* @tl-roles: brand .tl-chip */
/* @tl-roles: status .tl-chip */
/* @tl-roles: category .tl-chip */
```

und die Regel `.tl-segmented__segment > .tl-pill, .tl-chip > .tl-pill { min-width: 0; }` (197–203, mitsamt Leerzeile) ersetzen durch

```css
/* Die Tönung trägt das Segment selbst (data-tl-role), vor Zeigen und Gewählt. */
/* @tl-roles: brand .tl-segmented__segment */
/* @tl-roles: status .tl-segmented__segment */
/* @tl-roles: category .tl-segmented__segment */

```

und direkt nach der Regel `.tl-segmented__segment:disabled { color: …; cursor: default; }` einfügen (vorgeprüft: Lint grün, `choice.test` unverändert grün):

```css

/* Deaktiviert zeigt ein Segment keine Rolle (wie der Chip): ohne Wahl weder Fläche noch Linie der
   Rolle. Gewählt bleibt es erkennbar. */
.tl-segmented__segment[data-tl-role]:disabled:not([aria-checked="true"]):not([aria-pressed="true"]) {
  border-color: transparent;
  background: transparent;
}
```

`tools/lint-css.mjs`: Zeile 74 (`const KATEGORIEN = …`) löschen; `'tl-pill': new Set([]), // Die Rolle ist ein Attribut (data-tl-role), kein Modifier.`; `'tl-avatar': new Set(['sm', 'lg', 'xl']), // Die Kategorie ist ein Attribut (data-tl-role).`; `'tl-alert': new Set([]), // Die Bedeutung ist Pflicht und ein Attribut (data-tl-role).`

- [ ] **Step 4: Specimen** — `pill.spec.html`: im Template (29–31) `class="tl-pill %MOD% tl-type-label"` → `class="tl-pill tl-type-label" data-tl-role="%ROLE%"`; `VARIANTEN` (45–54) trägt statt der Klasse den Rollennamen (`['brand', 'brand', 'Eigenes']`, `['error', 'error', 'Abgelehnt']` …, neutral `''`); im Skript `.replaceAll('%MOD%', mod)` → `.replaceAll('%ROLE%', mod)`; Fließtext 40: `<span class="tl-pill" data-tl-role="warning">`, `data-tl-role="category-6"`. `avatar.spec.html`: Template `%MOD%` aus der Klasse nehmen und `data-tl-role="%ROLE%"` anhängen, `KATEGORIEN` als `['category-1', …]` und `.replaceAll('%ROLE%', mod)`; Zeile 55 `data-tl-role="category-3"`. `alert.spec.html` 30–70: aus `<div class="tl-alert tl-alert--error tl-type-body" role="alert">` wird `<div class="tl-alert tl-type-body" data-tl-role="error" role="alert">`, ebenso für `warning`, `success`, `info`. `select.spec.html` (41, 60, 70, 100, 109, 153) und `field.spec.html:85`: aus `class="tl-pill tl-pill--warning tl-type-label"` wird `class="tl-pill tl-type-label" data-tl-role="warning"` (übrige Klassen bleiben, die Rolle wandert ins Attribut). (Der Grep auf leere Modifier folgt am Ende von Step 5: die Verträge nennen die alten Namen noch.)

- [ ] **Step 5: Verträge** — `pill.contract.md`: Attribut-Tabelle `data-tl-role` (`brand`, `error`, `warning`, `success`, `info`, `category-1` … `category-8`; ohne Attribut neutral), Konformität 56 „…`data-tl-role` seiner Rolle trägt…“. `avatar.contract.md:61`: „…das Attribut `data-tl-role="category-<n>"` seines Hashes trägt…“; Größen bleiben Modifier (`small` → `tl-avatar--sm` usw., Test `components.test.mjs:281`). `alert.contract.md:36`: Zeile `| `tl-alert` + `data-tl-role` | `tl-alert` immer, `data-tl-role` genau eine Bedeutung (`error`, `warning`, `success`, `info`), Pflicht |`. `choice.contract.md`: Tabelle „Klassen“ um `tl-chip`/`tl-segmented__segment` mit `data-tl-role` („die Rolle des Werts; keine Pill im Chip oder Segment, Bild und Beschriftung stehen nebeneinander mit `--tl-space-2xs`“), Absatz 89 „…je gewählter Wert Text oder `tl-pill` mit `data-tl-role` seiner `colorRole`…“; Attribut-Zeile 67 `:indeterminate` + `aria-checked="mixed"` ersetzen durch `| `:indeterminate` | `triState` und `value: null`. `indeterminate` ist eine Eigenschaft des `input` (kein HTML-Attribut); der Browser meldet es dem Screenreader als „gemischt“. **Kein** `aria-checked` am nativen Kästchen (ARIA in HTML; entschieden 07.10.). |` und in `choice.spec.html:35` `aria-checked="mixed"` streichen (`data-indeterminate` bleibt). Danach: `grep -rn 'tl-pill--\|tl-alert--\|tl-avatar--category' src` → leer.

- [ ] **Step 6: Gates, Commit** — `node tools/generate.mjs && node --test && node tools/lint-css.mjs` → grün (279 Tests: 278 laut Plan-Review, dazu „ein deaktiviertes Segment …“). `git add design-system && git commit -m "Ticket #29617: Welle 3b -- Toenung als Attribut: @tl-roles erzeugt [data-tl-role], Chip und Segment tragen die Rolle selbst"`

### Task P2: Entfernbare Kapsel — `tl-chip__toggle`, `tl-chip__remove`

**Files:**
- Modify: `src/components/choice/choice.css` (Ende), `choice.contract.md`, `choice.spec.html`
- Test: `test/choice.test.mjs:11-17,140-147`

**Interfaces:**
- Produces: `span.tl-chip` > `button.tl-chip__toggle[aria-pressed]` + `button.tl-chip__remove.tl-button.tl-button--ghost.tl-button--sm.tl-button--icon`. Leser: E9 (Filterleiste).

- [ ] **Step 1: Tests (rot)** — `test/choice.test.mjs` „choice.css liest genau diese Farbrollen“ ersetzen durch

```js
test('choice.css liest genau diese Farbrollen', () => {
  assert.deepEqual(colorVarsOf(css), [
    'border-control', 'border-disabled', 'border-emphasis', 'border-interactive', 'icon-secondary',
    'status-error-border', 'status-warning-border', 'surface-brand', 'surface-brand-active', 'surface-brand-hover',
    'surface-brand-subtle', 'surface-disabled', 'surface-field', 'surface-interactive-hover', 'text-disabled',
    'text-on-brand', 'text-on-brand-active', 'text-on-brand-hover', 'text-primary',
  ]);
});
```

und anhängen

```js
test('entfernbare Kapsel: umschalten und entfernen in einem span.tl-chip, gedrückt wie ein gedrückter Chip', () => {
  assert.match(declarationsOf(css, '.tl-chip:has(> .tl-chip__toggle)') ?? '', /padding:\s*0/);
  assert.match(declarationsOf(css, '.tl-chip__toggle') ?? '', /border-radius:\s*var\(--tl-radius-full\)/);
  // Der Knopf setzt display: [hidden] des Browsers verlöre sonst (3a-Regel, auch am Element).
  assert.match(declarationsOf(css, '.tl-chip__toggle[hidden]') ?? '', /display:\s*none/);
  const gedrueckt = declarationsOf(css, '.tl-chip:has(> .tl-chip__toggle[aria-pressed="true"])') ?? '';
  assert.match(gedrueckt, /background:\s*var\(--tl-surface-brand\)/);
  assert.match(gedrueckt, /color:\s*var\(--tl-text-on-brand\)/);
  assert.match(declarationsOf(css, '.tl-chip:has(> .tl-chip__toggle[aria-pressed="true"]) > .tl-chip__remove') ?? '', /color:\s*inherit/);
  assert.match(declarationsOf(css, '.tl-chip__remove') ?? '', /margin-block:\s*calc\(-1 \* var\(--tl-border-width-sm\)\)/);
});
```

und in „der Auswahl-Vertrag nennt …“ die Namensliste um `'tl-chip__toggle', 'tl-chip__remove', 'data-tl-role'` ergänzen.

- [ ] **Step 2: Rot sehen** — `node --test test/choice.test.mjs` → FAIL (Farbrollen, Kapsel, Vertrag).

- [ ] **Step 3: CSS** — an `choice.css` anhängen:

```css

/* --- Entfernbare Kapsel -------------------------------------------------------- */

/* Zwei Knöpfe in einer Kapsel (Filterleiste der Tabelle, 3b §11): span.tl-chip mit dem Umschalt-Knopf
   tl-chip__toggle (aria-pressed) und dem Entfernen-Knopf tl-chip__remove (tl-button--icon --sm --ghost).
   Die Kapsel zeichnet Rahmen und Fläche; gedrückt sieht sie aus wie ein gedrückter Knopf-Chip, und der
   Entfernen-Knopf liest dann die Beschriftung auf der Marke. Er liegt in der Kapsel, ohne sie zu heben. */
.tl-chip:has(> .tl-chip__toggle) {
  padding: 0;
  cursor: default;
}

:where(.tl-chip__toggle) {
  font: inherit;
}

.tl-chip__toggle {
  display: inline-flex;
  align-items: center;
  align-self: stretch;
  gap: var(--tl-space-2xs);
  min-width: 0;
  padding: 0 var(--tl-space-sm);
  border: 0;
  border-radius: var(--tl-radius-full);
  background: transparent;
  color: inherit;
  cursor: pointer;
}
.tl-chip__toggle[hidden] { display: none; }

.tl-chip__remove {
  margin-block: calc(-1 * var(--tl-border-width-sm));
  margin-inline-start: calc(-1 * var(--tl-space-xs));
}

.tl-chip:has(> .tl-chip__toggle[aria-pressed="true"]) {
  border-color: var(--tl-surface-brand);
  background: var(--tl-surface-brand);
  color: var(--tl-text-on-brand);
}

.tl-chip:has(> .tl-chip__toggle[aria-pressed="true"]):hover {
  border-color: var(--tl-surface-brand-hover);
  background: var(--tl-surface-brand-hover);
  color: var(--tl-text-on-brand-hover);
}

.tl-chip:has(> .tl-chip__toggle[aria-pressed="true"]) > .tl-chip__remove {
  color: inherit;
}

.tl-chip:has(> .tl-chip__toggle[aria-pressed="true"]) > .tl-chip__remove:hover {
  background: var(--tl-surface-brand-active);
  color: var(--tl-text-on-brand-active);
}
```

(Kontrast: `text-on-brand-active` auf `surface-brand-active` steht als abgeleitetes Paar schon in der Liste.)

- [ ] **Step 4: Vertrag, Specimen** — `choice.contract.md` Tokens: Zeile „Entfernbare Kapsel | Rahmen und Fläche wie der Chip; gedrückt `--tl-surface-brand`, Text `--tl-text-on-brand`, Zeigen `--tl-surface-brand-hover`/`--tl-text-on-brand-hover`; Entfernen gedrückt beim Zeigen `--tl-surface-brand-active`/`--tl-text-on-brand-active`“; Klassen: `tl-chip__toggle` („`button` in einem `span.tl-chip`, `aria-pressed`; trägt das Label“), `tl-chip__remove` („`tl-button tl-button--ghost tl-button--sm tl-button--icon`, `aria-label` und Tooltip Pflicht, 24 px“). `choice.spec.html`: Zeile „entfernbar“ mit zwei Kapseln (eine `aria-pressed="false"`, eine `"true"`), der Entfernen-Knopf mit `bi bi-x-lg` wie die übrigen Specimen-Icons.

- [ ] **Step 5: Gates, Commit** — `node tools/generate.mjs && node --test && node tools/lint-css.mjs` → grün. `git commit -m "Ticket #29617: Welle 3b -- entfernbare Kapsel: tl-chip__toggle und tl-chip__remove"`

### Task P3: `tl-status` — Laden, leer, Fehler; Nachzug Select

**Files:**
- Create: `src/components/status/status.css`, `status.contract.md`, `status.spec.html`
- Modify: `src/components/select/select.css:146-159` (Status fällt), `select.contract.md`, `select.spec.html`, `tools/lint-css.mjs` (Blockliste), `specimen/index.html`
- Test: `test/status.test.mjs` (neu), `test/select.test.mjs:11-17,49`

**Interfaces:**
- Produces: `.tl-status` (Zeile `size-row`, `text-secondary`), `.tl-status[role="alert"]` (`status-error-text`), `.tl-status > .tl-progress` füllt. Leser: E1 (Select), E6 (Baum), E7 (Tabelle leer).

- [ ] **Step 1: Test (rot)** — `test/status.test.mjs`:

```js
// Laden und Leer — 3b §10 (W10): eine Zeile, herausgelöst aus tl-select__status.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readGenerated, declarationsOf } from './lib/component.mjs';

test('tl-status: eine Zeile size-row in text-secondary, als Alarm status-error-text', () => {
  const css = readGenerated('status', 'status.css');
  const d = declarationsOf(css, '.tl-status') ?? '';
  assert.match(d, /min-height:\s*var\(--tl-size-row\)/);
  assert.match(d, /gap:\s*var\(--tl-space-xs\)/);
  assert.match(d, /padding-inline:\s*var\(--tl-space-control-x\)/);
  assert.match(d, /color:\s*var\(--tl-text-secondary\)/);
  assert.match(declarationsOf(css, '.tl-status[role="alert"]') ?? '', /color:\s*var\(--tl-status-error-text\)/);
  assert.equal(declarationsOf(readGenerated('select', 'select.css'), '.tl-select__status'), null, 'tl-select__status ist aufgegangen');
});
```

`test/select.test.mjs`: in „select.css liest genau diese Farbrollen“ `'status-error-text'` und `'text-secondary'` streichen (Ergebnis `['border-interactive', 'icon-secondary', 'surface-interactive-hover', 'surface-interactive-selected', 'text-placeholder']`); im Specimen-Test `'tl-select__status'` → `'tl-status'`.

- [ ] **Step 2: Rot sehen** — `node --test test/status.test.mjs test/select.test.mjs` → FAIL (ENOENT `status.css`, Farbrollen).

- [ ] **Step 3: CSS** — `src/components/status/status.css`:

```css
/* Status — docs/skalen.md „Gleiches wird zusammengelegt“ (W10), 3b §10.
   Eine Zeile, die sagt, was statt Inhalt da ist: lädt (immer ein unbestimmter tl-progress darin), leer
   („Keine Einträge“, „Nichts gefunden“), Fehler (role=alert). Herausgelöst aus tl-select__status; Leser:
   Select-Popup, Baum, Tabelle. Die Schrift setzt der Ort (tl-type-body). */

.tl-status {
  display: flex;
  align-items: center;
  gap: var(--tl-space-xs);
  min-height: var(--tl-size-row);
  padding-inline: var(--tl-space-control-x);
  color: var(--tl-text-secondary);
}
.tl-status[hidden] { display: none; }

.tl-status[role="alert"] {
  color: var(--tl-status-error-text);
}

/* Der Fortschritt füllt die Zeile; seine Beschriftung sagt, was lädt. */
.tl-status > .tl-progress {
  flex: 1 1 auto;
}
```

`select.css`: den Abschnitt „Laden, keine Treffer, Ladefehler: eine Zeile im Popup.“ mit `.tl-select__status` und `.tl-select__status[role="alert"]` (146–159) löschen. `tools/lint-css.mjs` MODIFIERS: `'tl-status': new Set([]),` nach `'tl-skeleton'`.

- [ ] **Step 4: Vertrag, Specimen** — `status.contract.md` nach dem Muster von `toggle.contract.md` (Abschnitte Zustand, Aktionen, Tokens, Attribute, Konformität): Zustand „lädt“ (Kind `tl-progress` mit `aria-busy="true"`, Beschriftung optional), „leer“ (Text), „Fehler“ (`role="alert"`, darf einen `tl-button--link` zum Wiederholen tragen); Tokens `--tl-size-row`, `--tl-space-xs`, `--tl-space-control-x`, `--tl-text-secondary`, `--tl-status-error-text`; Leser Select-Popup, Baum (eine `li` mit `role="treeitem"` eine Ebene unter einem Knoten mit `aria-busy`, Name aus `js.tree.loading`), Tabelle (eine `role="row"` > `role="gridcell"` mit `tl-status`). `status.spec.html` nach `toggle.spec.html`: drei Zeilen (lädt mit `tl-progress[aria-busy="true"]`, leer, Fehler mit Link) auf layer/base/overlay; `select.spec.html`: `tl-select__status` → `tl-status` (drei Stellen 124, 135, 148); `select.contract.md`: „Laden, keine Treffer und Ladefehler sind eine `tl-status`-Zeile“; Index-Link „Status →“.

- [ ] **Step 5: Gates, Commit** — `node tools/generate.mjs && node --test && node tools/lint-css.mjs` → grün. `git commit -m "Ticket #29617: Welle 3b -- tl-status: Laden, leer, Fehler als eine Zeile; Select liest ihn"`

### Task P4: Eine Ziehen-Optik und die umsortierbare Liste

**Files:**
- Create: `src/components/drag/drag.css`, `drag.contract.md`; `src/components/reorder-list/reorder-list.css`, `reorder-list.contract.md`, `reorder-list.spec.html`
- Modify: `src/components/select/select.css:60-79` (Chip-Ziehen fällt), `select.contract.md`, `select.spec.html:39` (`data-tl-axis`), `tools/lint-css.mjs`, `specimen/index.html`
- Test: `test/drag.test.mjs` (neu), `test/select.test.mjs:30-34` (der Test „Hervorhebung und Ziehen sind data-tl-state, gewählt ist aria-selected“)

**Interfaces:**
- Produces: `[data-tl-state~="drop-before|drop-after|drop-onto|drop-refused|dragging"]` — Marke und Rahmen auf `::before` über dem Ziel (`layer-sticky`, das Ziel wird über `:where` positioniert, ohne eine Lage des Blocks zu überschreiben), `[data-tl-axis="horizontal"] > …` (links/rechts); `ul.tl-reorder-list`, `li.tl-reorder-list__item`, `.tl-reorder-list__handle` (an einem `tl-button--icon --sm --ghost`), `.tl-reorder-list__label`, `.tl-reorder-list__search`; `.tl-select__chip > .tl-select__drag-handle`. Leser: E2 (Select-Chips, `TLValueList`), E5 (Spaltenwahl), E6 (Baum), E8/E9 (Tabelle).

- [ ] **Step 1: Tests (rot)** — `test/drag.test.mjs`:

```js
// Ziehen und Ablegen: ein Rechner, eine Optik — 3b §9 (W11). Die Optik steht einmal, in drag.css, und
// liest nur Zustände; kein Block zeichnet ein Drop-Ziel oder die gezogene Quelle selbst.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readGenerated, declarationsOf, componentCssFiles } from './lib/component.mjs';

const css = readGenerated('drag', 'drag.css');

// Alle Deklarationen aller Regeln, die den Selektor nennen (die Fläche teilen sich vier Zustände;
// declarationsOf gibt nur die erste Regel).
const alle = (sel) => [...css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/([^{}]+)\{([^}]*)\}/g)]
  .filter((m) => m[1].split(',').map((s) => s.trim()).includes(sel)).map((m) => m[2]).join(';');

// Plan-Review M4: ein inset-Schatten am Ziel läge unter den Hintergründen seiner Kinder (Filterleiste,
// Kopf und Zeilen an der Tabellenwurzel; haftende Zellen an einer Zeile). Marke und Rahmen liegen darum
// auf einer Fläche ::before über dem Ziel; ::after ist der Cursor-Ring (base.css).
test('drag.css: Einfügemarke, Ablegen darauf, Ablehnung auf einer Fläche über dem Ziel, gezogene Quelle blass', () => {
  for (const z of ['drop-before', 'drop-after', 'drop-onto', 'drop-refused']) {
    const flaeche = alle(`[data-tl-state~="${z}"]::before`);
    for (const d of [/content:\s*""/, /position:\s*absolute/, /inset:\s*0/, /z-index:\s*var\(--tl-layer-sticky\)/, /pointer-events:\s*none/])
      assert.match(flaeche, d, z);
    assert.match(declarationsOf(css, `:where([data-tl-state~="${z}"])`) ?? '', /position:\s*relative/, z);
    assert.doesNotMatch(alle(`[data-tl-state~="${z}"]`), /box-shadow/, `${z}: der Rahmen liegt auf ::before, nicht am Ziel`);
  }
  assert.match(alle('[data-tl-state~="drop-before"]::before'),
    /box-shadow:\s*inset 0 var\(--tl-border-width-accent\) 0 0 var\(--tl-border-interactive\)/);
  assert.match(alle('[data-tl-state~="drop-after"]::before'),
    /box-shadow:\s*inset 0 calc\(-1 \* var\(--tl-border-width-accent\)\) 0 0 var\(--tl-border-interactive\)/);
  assert.match(alle('[data-tl-axis="horizontal"] > [data-tl-state~="drop-before"]::before'),
    /box-shadow:\s*inset var\(--tl-border-width-accent\) 0 0 0 var\(--tl-border-interactive\)/);
  assert.match(alle('[data-tl-axis="horizontal"] > [data-tl-state~="drop-after"]::before'),
    /box-shadow:\s*inset calc\(-1 \* var\(--tl-border-width-accent\)\) 0 0 0 var\(--tl-border-interactive\)/);
  assert.match(alle('[data-tl-state~="drop-onto"]'), /background:\s*var\(--tl-surface-interactive-selected\)/);
  assert.match(alle('[data-tl-state~="drop-onto"]::before'),
    /box-shadow:\s*inset 0 0 0 var\(--tl-border-width-md\) var\(--tl-border-interactive\)/);
  assert.match(alle('[data-tl-state~="drop-refused"]::before'),
    /box-shadow:\s*inset 0 0 0 var\(--tl-border-width-md\) var\(--tl-status-error-border\)/);
  assert.match(alle('[data-tl-state~="dragging"]'), /opacity:\s*0\.4/);
});

test('kein anderer Block zeichnet die Ziehen-Zustände', () => {
  const offen = [];
  for (const [name, src] of componentCssFiles()) {
    if (name === 'drag/drag.css') continue;
    const ohne = src.replace(/\/\*[\s\S]*?\*\//g, '');
    if (/data-tl-state~="(drop-[a-z]+|dragging)"/.test(ohne)) offen.push(name);
  }
  assert.deepEqual(offen, []);
});

test('tl-reorder-list: Liste ohne Aufzählung, Einträge size-row, Griff innen fokussiert, höchstens size-popover-max', () => {
  const liste = readGenerated('reorder-list', 'reorder-list.css');
  const d = declarationsOf(liste, '.tl-reorder-list') ?? '';
  assert.match(d, /list-style:\s*none/);
  assert.match(d, /max-height:\s*var\(--tl-size-popover-max\)/);
  assert.match(declarationsOf(liste, '.tl-reorder-list__item') ?? '', /min-height:\s*var\(--tl-size-row\)/);
  assert.match(declarationsOf(liste, '.tl-reorder-list__handle:focus-visible') ?? '', /outline-offset:\s*calc\(-1 \* var\(--tl-focus-offset\)\)/);
  assert.doesNotMatch(liste, /--(dragover|drag-over|group-by|fixed|active)\b/);
});
```

`test/select.test.mjs`: den Test „Hervorhebung und Ziehen sind data-tl-state, gewählt ist aria-selected“ (Zeilen 30–34 — **nicht** 24–28, das ist das Gate „das Select-Popup trägt die Fläche nicht selbst“) ersetzen durch

```js
test('Hervorhebung ist data-tl-state, das Ziehen zeichnet drag.css, gewählt ist aria-selected', () => {
  assert.ok(declarationsOf(css, '.tl-select__option[data-tl-state~="highlighted"]'), 'Hervorhebung fehlt');
  assert.doesNotMatch(css.replace(/\/\*[\s\S]*?\*\//g, ''), /data-tl-state~="(dragging|drop-)/, 'die Ziehen-Optik steht in drag.css');
  assert.match(declarationsOf(css, '.tl-select__chip > .tl-select__drag-handle') ?? '', /margin-inline-start/);
  assert.doesNotMatch(css, /--highlighted|--dragging|--open|--drop/);
});
```

- [ ] **Step 2: Rot sehen** — `node --test test/drag.test.mjs test/select.test.mjs` → FAIL (ENOENT `drag.css`; „kein anderer Block“ meldet `select/select.css`).

- [ ] **Step 3: drag.css** (vorgeprüft in einer Kopie: Lint grün, der Test aus Step 1 grün)

```css
/* Ziehen und Ablegen — docs/skalen.md „Gleiches wird zusammengelegt“ (W11), 3b §9.
   Eine Optik für jedes Ziel, einmal gezeichnet und nur über Zustände (data-tl-state): Tabellenzeile,
   Baumknoten, Spaltenkopf, Eintrag der Spaltenwahl, Select-Chip, die Tabelle als Ganzes. Einträge, die
   nebeneinander stehen, haben einen Behälter mit data-tl-axis="horizontal": ihre Einfügemarke steht
   links und rechts statt oben und unten. Ein Drop-Ziel ist kein Fokus (3a §5): kein outline, kein
   focus-ring.
   Marke und Rahmen liegen auf einer Fläche ::before über dem Ziel: ein inset-Schatten am Ziel selbst
   läge unter den Hintergründen seiner Kinder — an der Tabellenwurzel unter Filterleiste, Kopf und
   Zeilen, an einer Zeile unter ihren haftenden Zellen (layer-raised). ::after ist der Cursor-Ring
   (base.css). Die Fläche von drop-onto steht am Ziel; eine Fläche, die sie übermalen soll, steht beim
   Block in :where (Tabellenzeile). */

/* Die Fläche braucht ein positioniertes Ziel. :where hat keine Spezifität: eine Lage, die der Block
   setzt (absolute Zeile, haftende Kopfzelle), bleibt. */
:where([data-tl-state~="drop-before"]),
:where([data-tl-state~="drop-after"]),
:where([data-tl-state~="drop-onto"]),
:where([data-tl-state~="drop-refused"]) {
  position: relative;
}

[data-tl-state~="drop-before"]::before,
[data-tl-state~="drop-after"]::before,
[data-tl-state~="drop-onto"]::before,
[data-tl-state~="drop-refused"]::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: var(--tl-layer-sticky);
  pointer-events: none;
}

[data-tl-state~="drop-before"]::before {
  box-shadow: inset 0 var(--tl-border-width-accent) 0 0 var(--tl-border-interactive);
}

[data-tl-state~="drop-after"]::before {
  box-shadow: inset 0 calc(-1 * var(--tl-border-width-accent)) 0 0 var(--tl-border-interactive);
}

[data-tl-axis="horizontal"] > [data-tl-state~="drop-before"]::before {
  box-shadow: inset var(--tl-border-width-accent) 0 0 0 var(--tl-border-interactive);
}

[data-tl-axis="horizontal"] > [data-tl-state~="drop-after"]::before {
  box-shadow: inset calc(-1 * var(--tl-border-width-accent)) 0 0 0 var(--tl-border-interactive);
}

[data-tl-state~="drop-onto"] {
  background: var(--tl-surface-interactive-selected);
}

[data-tl-state~="drop-onto"]::before {
  box-shadow: inset 0 0 0 var(--tl-border-width-md) var(--tl-border-interactive);
}

[data-tl-state~="drop-refused"]::before {
  box-shadow: inset 0 0 0 var(--tl-border-width-md) var(--tl-status-error-border);
}

/* Die gezogene Quelle wird blass. 0.4 ist ein Anteil, kein Maß (lint-css.mjs, Punkt 10) — und steht
   hier einmal statt in jedem Block. */
[data-tl-state~="dragging"] {
  opacity: 0.4;
}
```

- [ ] **Step 4: reorder-list.css**

```css
/* Umsortierbare Liste — docs/skalen.md „Gleiches wird zusammengelegt“ (W2, W11), 3b §8.
   ul.tl-reorder-list > li.tl-reorder-list__item: vorn der Griff (tl-reorder-list__handle, ein
   tl-button--icon --sm --ghost: Ziehen mit der Maus, Alt + Pfeil mit der Tastatur), dahinter, was der
   Eintrag trägt (Gruppierungsknopf, label.tl-choice mit tl-checkbox). Die Ziehen-Optik zeichnet
   drag.css, den Ring base.css — am Griff innen, weil die Liste scrollt. Höchstens size-popover-max
   hoch; dann scrollt die Liste in sich, und ein Dialog um sie springt nicht beim Suchen. */

.tl-reorder-list {
  display: flex;
  flex-direction: column;
  max-height: var(--tl-size-popover-max);
  margin: 0;
  padding: 0;
  overflow-y: auto;
  list-style: none;
}
.tl-reorder-list[hidden] { display: none; }

.tl-reorder-list__item {
  display: flex;
  align-items: center;
  gap: var(--tl-space-xs);
  min-height: var(--tl-size-row);
  padding: 0 var(--tl-space-control-x);
}
.tl-reorder-list__item[hidden] { display: none; }

.tl-reorder-list__item:hover {
  background: var(--tl-surface-interactive-hover);
}

.tl-reorder-list__handle {
  color: var(--tl-icon-secondary);
  cursor: grab;
}

.tl-reorder-list__handle:active {
  cursor: grabbing;
}

.tl-reorder-list__handle:focus-visible {
  outline-offset: calc(-1 * var(--tl-focus-offset));
}

/* Das Kästchen mit seiner Beschriftung nimmt den Rest der Zeile; die Beschriftung endet mit Ellipse. */
.tl-reorder-list__item > .tl-choice {
  flex: 1 1 auto;
  min-width: 0;
}

.tl-reorder-list__label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Die Suche ab elf Einträgen steht vor der Liste: eine tl-field-group mit Lupe; der Abstand sitzt an
   der Gruppe, nicht am Feld (wie im Select-Popup). */
.tl-reorder-list__search {
  margin-bottom: var(--tl-space-xs);
}
```

(`.tl-reorder-list__handle` steht in `components.css` nach `button/` und schlägt die Farbe von `tl-button--ghost` bei gleicher Spezifität.)

- [ ] **Step 5: Select** — `select.css` die Regeln `.tl-select__chip[data-tl-state~="dragging"]`, den Kommentar „Die Einfügemarke beim Ziehen …“ und die zwei `drop-before`/`drop-after`-Regeln (60–79 nach P3) ersetzen durch

```css

/* Der Griff ist ein tl-button--icon --sm --ghost (Ziehen und Alt + Pfeil, 3b §8); er liegt vorn in der
   Pille, ohne sie zu heben. Gezogen, Einfügemarke: drag.css; tl-select__values trägt
   data-tl-axis="horizontal", die Marke steht links oder rechts. */
.tl-select__chip > .tl-select__drag-handle {
  margin-inline-start: calc(-1 * var(--tl-space-2xs));
  margin-inline-end: 0;
}
```

(`.tl-select__drag-handle { color: icon-secondary; cursor: grab }` bleibt; die neue Regel steht nach `.tl-select__chip > .tl-button` und überschreibt dessen `margin-inline-end`.) Kopfkommentar `select.css:6–7`: „…die Tastatur-Hervorhebung; Ziehen zeichnet drag.css“. `select.spec.html:39` (`tl-select__values` des Mehrfachwerts) bekommt `data-tl-axis="horizontal"`, der Chip-Griff wird `<button type="button" class="tl-button tl-button--ghost tl-button--sm tl-button--icon tl-select__drag-handle" aria-label="Verschieben">`. `tools/lint-css.mjs` MODIFIERS: `'tl-reorder-list': new Set([]),`.

- [ ] **Step 6: Verträge, Specimen** — `drag.contract.md`: Tabelle der fünf Zustände wie Spec §9 (Wort, Bild, Token), „Marke und Rahmen liegen auf `::before` über dem Ziel (über den Hintergründen seiner Kinder und haftenden Zellen), `::after` bleibt dem Cursor-Ring; ein Ziel braucht kein eigenes `position`“, `data-tl-axis="horizontal"` am Behälter, „Ein Rechner: `dropPositionAt` (Drittel) für Ablageziele, `useListReorder` (Hälften) für Reihenfolgen“, „Ein Drop-Ziel ist kein Fokus“. `reorder-list.contract.md`: Zustand (`entries`, je Eintrag Name, sichtbar, gruppiert), Aktionen (`columnReorder`, `columnVisible`, `groupBy`), **Tastatur** (Griff ist ein `button` mit `aria-label` „<Name> verschieben“ und `aria-describedby` auf den Hinweis; Alt + Pfeil auf/ab verschiebt um eine Stelle und sendet denselben Befehl wie das Ziehen; Live-Bereich `role="status"` sagt „<Name>, Position n von m“ an, Key `js.reorder.moved`; Enden: nichts), Tokens, Attribute (`tl-reorder-list` am `ul`, `tl-reorder-list__item` am `li`, `tl-reorder-list__handle` am Griff, `tl-reorder-list__label`, `tl-reorder-list__search` an der `tl-field-group`; Gruppierungsknopf `tl-button--icon --sm --ghost` mit `aria-pressed`; Kästchen `label.tl-choice` > `input.tl-checkbox`), Konformität. `reorder-list.spec.html`: Liste mit fünf Einträgen, einer `data-tl-state="dragging"`, einer `"drop-before"`, einer mit gedrücktem Gruppierungsknopf, einer mit deaktiviertem Kästchen; davor die Suche. `select.contract.md`: „Der Chip-Griff ist ein Knopf (`useListReorder`, Alt + Pfeil links/rechts); `tl-select__values` trägt `data-tl-axis="horizontal"`“. Index-Link „Liste →“.

- [ ] **Step 7: Gates, Commit** — `node tools/generate.mjs && node --test && node tools/lint-css.mjs` → grün. `git commit -m "Ticket #29617: Welle 3b -- eine Ziehen-Optik (drag.css) und tl-reorder-list"`

### Task P5: Der Cursor-Ring in `base.css`

**Files:**
- Modify: `design-system/tools/generate.mjs` (`baseCss`, Ring-Regel)
- Test: `test/focus.test.mjs` (Fall anhängen), `test/generate.test.mjs:70`

**Interfaces:**
- Produces: Ein Behälter mit `aria-activedescendant`, der kein `input`/`textarea` ist, trägt bei `:focus-visible` keinen Ring; das Element darin mit `data-tl-state~="cursor"` trägt ihn über `::after` innen. Das Cursor-Element muss positioniert sein (Tabellenzeile `absolute`, Baumknoten `relative`). Leser: P7, P8, E6, E7.

- [ ] **Step 1: Test (rot)** — an `test/focus.test.mjs` anhängen:

```js

test('der Cursor-Ring: ein Behälter mit aria-activedescendant gibt den Ring an das Cursor-Element ab', () => {
  const base = readFileSync(new URL('../dist/base.css', import.meta.url), 'utf8');
  const ring = /([^{}]+)\{\s*outline:\s*var\(--tl-focus-width\) solid var\(--tl-focus-ring\);/.exec(base);
  assert.ok(ring, 'Ring-Regel fehlt');
  const selektoren = ring[1].split(/,\n/).map((s) => s.trim());
  assert.ok(selektoren.some((s) => s.includes(':where(:not(:not(input, textarea)[aria-activedescendant])):focus-visible')),
    'der Behälter mit aria-activedescendant trägt den Ring nicht selbst');
  assert.ok(selektoren.some((s) => s === ':where(:not(input, textarea)[aria-activedescendant]:focus-visible [data-tl-state~="cursor"])::after'),
    'das Cursor-Element trägt den Ring');
  const flaeche = /:where\(:not\(input, textarea\)\[aria-activedescendant\] \[data-tl-state~="cursor"\]\)::after\s*\{([^}]*)\}/.exec(base);
  assert.ok(flaeche, 'Fläche des Cursor-Rings fehlt');
  for (const d of [/content:\s*""/, /position:\s*absolute/, /inset:\s*0/, /z-index:\s*var\(--tl-layer-sticky\)/,
    /outline-offset:\s*calc\(-1 \* var\(--tl-focus-offset\)\)/, /pointer-events:\s*none/])
    assert.match(flaeche[1], d);
});
```

- [ ] **Step 2: Rot sehen** — `node --test test/focus.test.mjs` → FAIL („Ring-Regel …“ trifft, die Selektoren fehlen).

- [ ] **Step 3: Generator** — in `baseCss` die Regel

```
/* Der Ring gehört der Tastatur. Ein Mechanismus, außen, nur beim Tastaturfokus. */
:where(a, button, input, select, textarea, summary, [tabindex], [contenteditable]):focus-visible {
  outline: var(--tl-focus-width) solid var(--tl-focus-ring);
  outline-offset: var(--tl-focus-offset);
}
```

ersetzen durch

```
/* Der Ring gehört der Tastatur. Ein Mechanismus, außen, nur beim Tastaturfokus.
   Ein Behälter mit virtuellem Cursor (Tabelle, Baum: aria-activedescendant, 3a §5.4, 3b §3) trägt ihn
   nicht selbst: der Ring liegt innen am Element mit data-tl-state~="cursor". Gezeichnet wird er von
   dessen ::after, einer Fläche über dem Element — haftende Zellen überdecken den eigenen Umriss einer
   Zeile. Ein Suchfeld mit aria-activedescendant (Select) ist kein Behälter und behält den Ring. */
:where(a, button, input, select, textarea, summary, [tabindex], [contenteditable]):where(:not(:not(input, textarea)[aria-activedescendant])):focus-visible,
:where(:not(input, textarea)[aria-activedescendant]:focus-visible [data-tl-state~="cursor"])::after {
  outline: var(--tl-focus-width) solid var(--tl-focus-ring);
  outline-offset: var(--tl-focus-offset);
}

/* Die Fläche des Cursor-Rings: deckungsgleich mit dem Element, über seinen haftenden Zellen
   (layer-sticky; der Behälter isoliert den Stapel), für den Zeiger durchlässig, der Ring nach innen. */
:where(:not(input, textarea)[aria-activedescendant] [data-tl-state~="cursor"])::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: var(--tl-layer-sticky);
  outline-offset: calc(-1 * var(--tl-focus-offset));
  pointer-events: none;
}
```

(Spezifität: der erste Selektor bleibt (0,1,0) wie bisher; beide `::after`-Selektoren (0,0,1), die zweite Regel steht später und gewinnt `outline-offset`. Die Fläche liegt immer am Cursor-Element, unsichtbar ohne Ring.)

- [ ] **Step 4: Bestehenden Test nachziehen** — `node tools/generate.mjs && node --test test/focus.test.mjs test/generate.test.mjs` → `focus` grün, `generate.test.mjs` „base.css: Zahlenklasse, Fokusring …“ FAIL (`:focus-visible` zählt 2). Zeile 70 ersetzen durch

```js
  // Zwei Selektoren, eine Regel: der Ring am fokussierten Element und am Cursor-Element eines Behälters
  // mit aria-activedescendant (3b §3). Die Deklaration steht genau einmal (focus.test.mjs).
  assert.equal((base.match(/:focus-visible/g) ?? []).length, 2, 'ein Fokusring, zwei Selektoren');
```

- [ ] **Step 5: Gates, Commit** — `node --test && node tools/lint-css.mjs` → grün (`base.css` besteht das Gate: kein Klassenselektor, `z-index` aus `--tl-layer-*`). `git commit -m "Ticket #29617: Welle 3b -- Cursor-Ring: der Behaelter mit aria-activedescendant gibt den Ring an sein Cursor-Element ab"`

### Task P6: `tl-text` und `tl-columns`

**Files:**
- Create: `src/components/text/text.{css,contract.md,spec.html}`, `src/components/columns/columns.{css,contract.md,spec.html}`
- Modify: `tools/lint-css.mjs`, `specimen/index.html`
- Test: `test/text.test.mjs` (neu)

**Interfaces:**
- Produces: `span.tl-text.tl-type-<variante>[data-tl-tone="secondary|helper|placeholder|success|warning|error|on-brand"]`, `.tl-text--truncate`; als Pill (`appearance=pill` oder Farbrolle) ist `span.tl-pill[data-tl-role]` selbst die Wurzel, ohne `tl-text` darum (Entscheidung 23, 07.10.); `.tl-columns.tl-columns--gap-compact|default|loose`, `.tl-columns__column`. Leser: E4, E5.

- [ ] **Step 1: Test (rot)** — `test/text.test.mjs`:

```js
// Text und Spalten-Layout — 3b §11, §12.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readGenerated, declarationsOf } from './lib/component.mjs';

test('tl-text: Ton als data-tl-tone, ohne Ton erbt der Text; Ellipse ist --truncate', () => {
  const css = readGenerated('text', 'text.css');
  const TOENE = { secondary: 'text-secondary', helper: 'text-helper', placeholder: 'text-placeholder',
    success: 'status-success-text', warning: 'status-warning-text', error: 'status-error-text', 'on-brand': 'text-on-brand' };
  for (const [ton, rolle] of Object.entries(TOENE))
    assert.match(declarationsOf(css, `.tl-text[data-tl-tone="${ton}"]`) ?? '', new RegExp(`color:\\s*var\\(--tl-${rolle}\\)`), ton);
  assert.equal(declarationsOf(css, '.tl-text'), null, 'ohne Ton keine Farbregel: der Text erbt');
  assert.doesNotMatch(css, /accent|font-style|font-weight/);
  assert.match(declarationsOf(css, '.tl-text--truncate') ?? '', /text-overflow:\s*ellipsis/);
});

test('tl-columns: drei Abstände aus der Skala, Spalten schrumpfen', () => {
  const css = readGenerated('columns', 'columns.css');
  assert.match(declarationsOf(css, '.tl-columns--gap-compact') ?? '', /gap:\s*var\(--tl-space-sm\)/);
  assert.match(declarationsOf(css, '.tl-columns--gap-default') ?? '', /gap:\s*var\(--tl-space-md\)/);
  assert.match(declarationsOf(css, '.tl-columns--gap-loose') ?? '', /gap:\s*var\(--tl-space-lg\)/);
  assert.match(declarationsOf(css, '.tl-columns__column') ?? '', /min-width:\s*0/);
});
```

- [ ] **Step 2: Rot sehen** — `node --test test/text.test.mjs` → FAIL (ENOENT).

- [ ] **Step 3: CSS** — `src/components/text/text.css`:

```css
/* Text — docs/skalen.md „Typo“, 3b §11.
   span.tl-text mit der Typo-Klasse seiner Variante (tl-type-*) und dem Ton als Attribut data-tl-tone.
   Ohne Ton erbt der Text die Farbe seiner Umgebung — im Panel text-primary, auf einer Markenfläche deren
   Beschriftung; das Umfärben der Primär-App-Bar entfällt damit. Platzhalter ist ein Ton, kein Schnitt:
   die Typo kennt keine Kursive. Eine Zeile mit Ellipse ist der Modifier --truncate. */

.tl-text[data-tl-tone="secondary"] { color: var(--tl-text-secondary); }
.tl-text[data-tl-tone="helper"] { color: var(--tl-text-helper); }
.tl-text[data-tl-tone="placeholder"] { color: var(--tl-text-placeholder); }
.tl-text[data-tl-tone="success"] { color: var(--tl-status-success-text); }
.tl-text[data-tl-tone="warning"] { color: var(--tl-status-warning-text); }
.tl-text[data-tl-tone="error"] { color: var(--tl-status-error-text); }
.tl-text[data-tl-tone="on-brand"] { color: var(--tl-text-on-brand); }

/* Eine Zeile, die mit Ellipse endet: als Block, sonst schneidet ein Inline-Element nicht ab. */
.tl-text--truncate {
  display: block;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tl-text--truncate[hidden] { display: none; }
```

`src/components/columns/columns.css`:

```css
/* Spalten — 3b §12.
   Eine umbrechende Reihe von Spalten, jede wächst nach ihrem Gewicht. Die Flex-Basis einer Spalte setzt
   das Control inline, weil sie mit der konfigurierten Umbruchbreite rechnet: solange der Behälter
   mindestens so breit ist, ist der Term negativ und damit null, die Reihe teilt sich nach Gewicht;
   darunter übersteigt er die Reihe, und jede Spalte steht in einer eigenen Zeile. Die Spalten stehen
   oben und behalten die Höhe ihres Inhalts. Der Abstand ist ein Modifier aus drei Stufen. */

.tl-columns {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
}
.tl-columns[hidden] { display: none; }

.tl-columns--gap-compact { gap: var(--tl-space-sm); }
.tl-columns--gap-default { gap: var(--tl-space-md); }
.tl-columns--gap-loose { gap: var(--tl-space-lg); }

/* Das Minimum hält breiten Inhalt (ein langes Wort, eine Tabelle) davon ab, mehr als seinen Anteil zu
   nehmen; das Maximum begrenzt die Basis einer gestapelten Spalte auf die Breite der Reihe. */
.tl-columns__column {
  min-width: 0;
  max-width: 100%;
}
```

`tools/lint-css.mjs` MODIFIERS: `'tl-text': new Set(['truncate']), 'tl-columns': new Set(['gap-compact', 'gap-default', 'gap-loose']),`.

- [ ] **Step 4: Verträge, Specimen** — `text.contract.md`: Zustand (`text`, `variant` → Typo-Klasse nach der Tabelle in Spec §11 inklusive `caption` → `tl-type-label`, `tone` → `data-tl-tone` mit `on-color` → `on-brand` und `primary` ohne Attribut, `overflow` → `tl-text--truncate`, `appearance: pill` oder eine Farbrolle → `span.tl-pill` **als Wurzel** mit `data-tl-role` (Ton → Rolle: `success`/`warning`/`error` behalten ihren Namen, sonst neutral) und den übrigen Text-Attributen (`id`, `role`, `data-tooltip`, Klasse aus `css-class`), die Beschriftung in `tl-pill__label`; keine Hülle `tl-text`, entschieden 07.10.), „Stark ist die Typo-Klasse als `css-class` (`tl-type-body-strong`)“, „`accent` gibt es nicht (02.10.)“, Tokens, Attribute, Konformität. `columns.contract.md`: Zustand (`weights`, `breakpoint`, `gap`, `children`), die Formel aus dem Kopfkommentar, Klassen, Konformität. `text.spec.html`: jede Variante je Zeile, jeder Ton, `--truncate` in einer schmalen Zelle, eine Pill als Wurzel (`span.tl-pill tl-type-label` mit `data-tl-role="warning"`, kein `tl-text` darum), auf layer/base/overlay; `columns.spec.html`: drei Spalten in drei Abständen, eine Umbruchbreite per Skript als Inline-Basis gesetzt (Skripte zählen nicht als Inline-Style). Index-Links.

- [ ] **Step 5: Gates, Commit** — `node tools/generate.mjs && node --test && node tools/lint-css.mjs` → grün. `git commit -m "Ticket #29617: Welle 3b -- tl-text (Ton als data-tl-tone) und tl-columns"`

### Task P7: `tl-table`

**Files:**
- Create: `src/components/table/table.css`, `table.contract.md`, `table.spec.html`
- Modify: `tools/lint-css.mjs`, `specimen/index.html`, `src/components/skeleton/skeleton.contract.md` (erster Aufrufer), `test/feedback.test.mjs:40-49`
- Test: `test/table.test.mjs` (neu)

**Interfaces:**
- Consumes: P4 (`drag.css`), P5 (Cursor-Ring über `::after`), `tl-toggle`, `tl-checkbox`, `tl-button--icon`, `tl-badge`, `tl-status`, `tl-skeleton`, `tl-field-group`, `tl-chip` + `__toggle/__remove`, `tl-popover`.
- Produces (für E7–E9): `.tl-table` (Wurzel, Ziehen-Zustand der ganzen Tabelle), `__filter-bar`, `__search`, `__save`, `__frame`, `__grid` (`role=grid|treegrid`, Fokus), `__header` (`role=rowgroup`), `__header-row` (`role=row`, `data-tl-axis="horizontal"`), `__header-cell` (`role=columnheader`, `aria-sort`, `data-tl-state~="frozen frozen-last pinned pinned-first filtered"`), `__sort`, `__label`, `__mark`, `__filter`, `__columns`, `__resize`, `__freeze`, `__freeze-preview`, `__body` (`role=rowgroup`), `__canvas`, `__row` (`role=row`, `aria-selected`, `data-tl-state~="cursor"`), `__cell` (`role=gridcell`), `__select`, `__tree`, `__spacer`, `__value`, `__count`, `__placeholder`, `__hint`.

- [ ] **Step 1: Test (rot)** — `test/table.test.mjs`:

```js
// Die Tabelle — 3b §3–§6: Zeile size-row, Kopf size-bar, Lage und Cursor als Attribute.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readGenerated, declarationsOf } from './lib/component.mjs';

const css = readGenerated('table', 'table.css');

test('tl-table: Zeile size-row, Kopf size-bar, Zustände als Attribute, keine Literale des Altbestands', () => {
  assert.match(declarationsOf(css, '.tl-table__row') ?? '', /min-height:\s*var\(--tl-size-row\)/);
  // Positioniert: Bezug für den Ring (::after) und die Ziehen-Marke (::before), auch im Specimen.
  assert.match(declarationsOf(css, '.tl-table__row') ?? '', /position:\s*relative/);
  // Jedes Element, das display setzt, setzt auch [hidden] (3a-Regel; hidden.test prüft nur Blöcke).
  for (const el of ['filter-bar', 'save', 'frame', 'grid', 'header-row', 'header-cell', 'sort', 'row', 'cell', 'tree', 'placeholder'])
    assert.match(declarationsOf(css, `.tl-table__${el}[hidden]`) ?? '', /display:\s*none/, el);
  assert.match(declarationsOf(css, '.tl-table__row') ?? '', /border-bottom:\s*var\(--tl-border-width-sm\) solid var\(--tl-border-separator\)/);
  assert.match(declarationsOf(css, '.tl-table__row:hover') ?? '', /surface-interactive-hover/);
  assert.match(declarationsOf(css, '.tl-table__row[aria-selected="true"]') ?? '', /surface-interactive-selected/);
  assert.match(declarationsOf(css, ':where(.tl-table__row)') ?? '', /background:\s*var\(--tl-surface-layer\)/);
  assert.match(declarationsOf(css, '.tl-table__header-row') ?? '', /min-height:\s*var\(--tl-size-bar\)/);
  assert.match(declarationsOf(css, '.tl-table__header') ?? '', /border-bottom:\s*var\(--tl-border-width-sm\) solid var\(--tl-border-emphasis\)/);
  const haftend = declarationsOf(css, '.tl-table__cell[data-tl-state~="frozen"]') ?? '';
  assert.match(haftend, /position:\s*sticky/);
  assert.match(haftend, /z-index:\s*var\(--tl-layer-raised\)/);
  assert.match(haftend, /background:\s*inherit/);
  assert.match(declarationsOf(css, '.tl-table__cell[data-tl-state~="frozen-last"]') ?? '', /border-emphasis/);
  assert.match(declarationsOf(css, '.tl-table__cell[data-tl-state~="pinned-first"]') ?? '', /border-emphasis/);
  assert.match(declarationsOf(css, '.tl-table__freeze-preview') ?? '', /z-index:\s*var\(--tl-layer-sticky\)/);
  assert.match(declarationsOf(css, '.tl-table__spacer') ?? '', /width:\s*var\(--tl-size-control-sm\)/);
  assert.match(declarationsOf(css, '.tl-table__cell .tl-field[aria-invalid="true"]') ?? '',
    /box-shadow:\s*inset 0 0 0 var\(--tl-border-width-md\) var\(--tl-status-error-border\)/);
  assert.match(declarationsOf(css, '.tl-table__cell .tl-field[data-tl-state~="warning"]') ?? '', /status-warning-border/);
  assert.doesNotMatch(css, /shadow-raised|clip-path|accent-color|outline\s*:|font-weight|--(selected|cursor|group|frozen|pinned|active)\b/);
  assert.match(declarationsOf(css, '.tl-table__header-cell[data-tl-state~="filtered"] .tl-table__filter') ?? '', /icon-primary/);
});

test('der Körper isoliert seinen Stapel, Spaltenwahl und Fixiergrenze sind so hoch wie die Kopfzeile', () => {
  assert.match(declarationsOf(css, '.tl-table__body') ?? '', /isolation:\s*isolate/);
  assert.match(declarationsOf(css, '.tl-table__columns') ?? '', /height:\s*var\(--tl-size-bar\)/);
  assert.match(declarationsOf(css, '.tl-table__freeze') ?? '', /height:\s*var\(--tl-size-bar\)/);
  assert.match(declarationsOf(css, '.tl-table__hint') ?? '', /status-error-border/);
});
```

- [ ] **Step 2: Rot sehen** — `node --test test/table.test.mjs` → FAIL (ENOENT).

- [ ] **Step 3: table.css** — `src/components/table/table.css` (vorgeprüft: Lint grün, `hidden.test`, `ellipsis.test`, `focus.test` grün; die `[hidden]`-Zeilen der Elemente und `position: relative` der Zeile kamen mit dem Plan-Review dazu, Punkte 17 und 19):

```css
/* Tabelle — docs/skalen.md „Gleiches wird zusammengelegt“ (W3, W5, W6, W8, W10, W11), 3b §3–§6.
   Ein Raster (tl-table__grid, role=grid, im Baum- und Gruppenmodus treegrid): ein Kopf und ein virtuell
   gerenderter Körper. Zustände sind Attribute — aria-selected (ausgewählt), aria-sort, aria-expanded,
   data-tl-state~="cursor" (Tastaturposition; den Ring zeichnet base.css), "frozen" / "frozen-last" /
   "pinned" / "pinned-first" (Lage), "filtered" (Spalte mit aktivem Filter); die Ziehen-Zustände zeichnet
   drag.css. Breiten, Versätze und die Lage der Zeilen sind Daten und stehen inline; alles andere hier.
   Eine Zeile schwebt nicht (skalen.md „Elevation“): kein Schatten, Kanten sind Linien. */

.tl-table {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  color: var(--tl-text-primary);
}
.tl-table[hidden] { display: none; }

/* --- Filterleiste ---------------------------------------------------------------- */

/* Benannte Filter als entfernbare Kapseln (tl-chip-group), die Suche über die angezeigten Spalten und
   das Speichern der aktuellen Kriterien. Außerhalb beider Rollbehälter: sie scrollt nicht mit. */
.tl-table__filter-bar {
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--tl-space-xs);
  padding: var(--tl-space-xs) var(--tl-space-sm);
  border-bottom: var(--tl-border-width-sm) solid var(--tl-border-separator);
  background: var(--tl-surface-layer);
}
.tl-table__filter-bar[hidden] { display: none; }

/* Suche und Speichern stehen am rechten Ende, gleich wie viele Filter davor stehen. */
.tl-table__search {
  flex: 0 1 auto;
  margin-inline-start: auto;
}

.tl-table__save {
  display: flex;
  align-items: center;
  gap: var(--tl-space-2xs);
}
.tl-table__save[hidden] { display: none; }

/* --- Rahmen und Raster ------------------------------------------------------------ */

/* Der Rahmen trägt das Raster und, was über ihm liegt, aber keine Zelle ist: die Spaltenwahl, den Griff
   der Fixiergrenze und ihre Vorschau. Das Raster (role=grid) besteht nur aus Kopf und Körper. */
.tl-table__frame {
  position: relative;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
}
.tl-table__frame[hidden] { display: none; }

.tl-table__grid {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
}
.tl-table__grid[hidden] { display: none; }

/* --- Kopf ------------------------------------------------------------------------ */

.tl-table__header {
  flex-shrink: 0;
  min-width: 0;
  overflow: hidden;
  border-bottom: var(--tl-border-width-sm) solid var(--tl-border-emphasis);
}

/* So hoch wie Reiterleiste und Toolbar darüber (skalen.md „Leisten und Hilfe“); haftende Kopfzellen
   erben ihre Fläche. */
.tl-table__header-row {
  display: flex;
  min-height: var(--tl-size-bar);
  background: var(--tl-surface-layer);
}
.tl-table__header-row[hidden] { display: none; }

.tl-table__header-cell {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--tl-space-2xs);
  min-width: 0;
  padding: 0 var(--tl-space-control-x);
  overflow: hidden;
  border-right: var(--tl-border-width-sm) solid var(--tl-border-separator);
  user-select: none;
}
.tl-table__header-cell[hidden] { display: none; }

.tl-table__header-cell[draggable="true"] {
  cursor: grab;
}

.tl-table__header-cell[draggable="true"]:active {
  cursor: grabbing;
}

/* Sortierbar ist die Beschriftung ein Knopf: Klick oder Enter sortiert, mit Umschalt kommt eine Stufe
   dazu. Die Kopfzelle trägt aria-sort. */
:where(.tl-table__sort) {
  font: inherit;
}

.tl-table__sort {
  display: flex;
  align-items: center;
  gap: var(--tl-space-2xs);
  min-width: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  text-align: start;
  cursor: pointer;
}
.tl-table__sort[hidden] { display: none; }

.tl-table__header-cell:has(> .tl-table__sort:hover) {
  background: var(--tl-surface-interactive-hover);
}

/* Nur die Beschriftung gibt nach, wenn die Spalte schmaler ist als ihr Inhalt: Trichter, Sortiermarke
   und Griff bleiben erreichbar. */
.tl-table__label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Sortierpfeil und Gruppierungsmarke: tl-icon-sm, aria-hidden. Die Stufe einer mehrstufigen Sortierung
   ist ein tl-badge. */
.tl-table__mark {
  color: var(--tl-icon-secondary);
}

/* Der Trichter ist ein tl-button--icon --sm --ghost. Ein aktiver Filter ist ein Zustand der Spalte:
   gefüllte Glyphe in icon-primary statt der leeren in icon-secondary. */
.tl-table__filter {
  flex-shrink: 0;
  color: var(--tl-icon-secondary);
}

.tl-table__header-cell[data-tl-state~="filtered"] .tl-table__filter {
  color: var(--tl-icon-primary);
}

/* Die Spaltenwahl (Zahnrad) ist ein tl-button--icon --ghost über der rechten Kante des Kopfes, so hoch
   wie die Kopfzeile, die Linie darunter bleibt frei. Sie nimmt dem Kopf keine Breite — sonst bliebe die
   letzte Überschrift abgeschnitten — und ist deckend, weil eine Beschriftung unter ihr durchlaufen kann.
   In der Kopfzelle einer angehefteten letzten Spalte steht sie als --sm in der Zelle. */
.tl-table__columns {
  position: absolute;
  top: 0;
  right: 0;
  height: var(--tl-size-bar);
  border-radius: 0;
  background: var(--tl-surface-layer);
}

.tl-table__columns:hover {
  background: var(--tl-surface-interactive-hover);
}

.tl-table__header-cell > .tl-table__columns {
  position: static;
  margin-inline: auto;
  background: transparent;
}

/* Breite ziehen und Fixiergrenze: Griffe mit role=separator, Zeigerbedienung. Der Griff ist space-xs
   breit; unter dem Zeiger und beim Ziehen eine Linie border-width-md in border-interactive. */
.tl-table__resize {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: var(--tl-layer-raised);
  width: var(--tl-space-xs);
  cursor: col-resize;
}

.tl-table__freeze {
  position: absolute;
  top: 0;
  height: var(--tl-size-bar);
  z-index: var(--tl-layer-sticky);
  width: var(--tl-space-xs);
  cursor: col-resize;
}

.tl-table__resize::after,
.tl-table__freeze::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  width: var(--tl-border-width-md);
}

.tl-table__resize::after {
  right: 0;
}

.tl-table__freeze::after {
  left: 0;
}

.tl-table__resize:hover::after,
.tl-table__resize:active::after,
.tl-table__freeze:hover::after,
.tl-table__freeze:active::after {
  background: var(--tl-border-interactive);
}

/* Wo die Fixiergrenze landet, wenn der Griff jetzt losgelassen wird: über Kopf und Zeilen. */
.tl-table__freeze-preview {
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: var(--tl-layer-sticky);
  width: var(--tl-border-width-md);
  margin-inline-start: calc(-0.5 * var(--tl-border-width-md));
  background: var(--tl-border-interactive);
  pointer-events: none;
}

/* --- Körper ---------------------------------------------------------------------- */

/* Der Körper scrollt; den Fokus hält das Raster (aria-activedescendant auf die Cursorzeile).
   isolation hält die Fläche des Cursor-Rings (base.css) und die haftenden Zellen in seinem Stapel. */
.tl-table__body {
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
  isolation: isolate;
}

.tl-table__canvas {
  position: relative;
}

/* Die Fläche der Zeile steht in :where: Ziehen (drag.css) übermalt sie ohne Spezifitätskampf, und
   haftende Zellen erben sie und bleiben deckend. Eine Zeile schneidet nicht ab: ein abschneidender
   Vorfahr zwischen haftender Zelle und Rollbehälter machte die Zeile zum Bezug, und die Zelle scrollte
   mit. Die Zeile ist positioniert — Bezug der Flächen von Cursor-Ring (base.css, ::after) und
   Ziehen-Marke (drag.css, ::before); das TSX setzt sie im Körper absolute, im Specimen bleibt relative. */
:where(.tl-table__row) {
  background: var(--tl-surface-layer);
}

.tl-table__row {
  position: relative;
  display: flex;
  min-height: var(--tl-size-row);
  border-bottom: var(--tl-border-width-sm) solid var(--tl-border-separator);
  cursor: pointer;
}
.tl-table__row[hidden] { display: none; }

.tl-table__row:hover {
  background: var(--tl-surface-interactive-hover);
}

.tl-table__row[aria-selected="true"] {
  background: var(--tl-surface-interactive-selected);
}

.tl-table__row[draggable="true"] {
  cursor: grab;
}

.tl-table__row[draggable="true"]:active {
  cursor: grabbing;
}

.tl-table__cell {
  display: flex;
  align-items: center;
  min-width: 0;
  padding: 0 var(--tl-space-control-x);
  overflow: hidden;
  border-right: var(--tl-border-width-sm) solid var(--tl-border-separator);
  white-space: nowrap;
}
.tl-table__cell[hidden] { display: none; }

.tl-table__cell:last-child,
.tl-table__header-cell:last-child {
  border-right: 0;
}

/* Die Auswahlspalte: input.tl-checkbox, mittig. */
.tl-table__select {
  flex-shrink: 0;
  justify-content: center;
  padding: 0;
}

/* Lage, kein Zustand der Bedienung: fixierte und angeheftete Zellen haften (Versatz inline), liegen mit
   layer-raised über den scrollenden und erben die Fläche ihrer Zeile. Die Kante zur scrollenden Fläche
   ist eine Linie border-emphasis, kein Schatten. */
.tl-table__cell[data-tl-state~="frozen"],
.tl-table__cell[data-tl-state~="pinned"],
.tl-table__header-cell[data-tl-state~="frozen"],
.tl-table__header-cell[data-tl-state~="pinned"] {
  position: sticky;
  z-index: var(--tl-layer-raised);
  background: inherit;
}

.tl-table__cell[data-tl-state~="frozen-last"],
.tl-table__header-cell[data-tl-state~="frozen-last"] {
  border-right: var(--tl-border-width-sm) solid var(--tl-border-emphasis);
}

.tl-table__cell[data-tl-state~="pinned-first"],
.tl-table__header-cell[data-tl-state~="pinned-first"] {
  border-left: var(--tl-border-width-sm) solid var(--tl-border-emphasis);
}

/* --- Zellinhalt ------------------------------------------------------------------ */

/* Der Wurzelknoten eines Lesewerts füllt die Zelle: ein Wert, breiter als seine Spalte, endet mit
   Ellipse. Ein Link bleibt so breit wie sein Text — sonst folgte ein Klick irgendwo in der Zelle der
   Adresse, wo der Nutzer die Zeile meint. Eine eigene Flex-Reihe (Wert mit Icon, Werteliste, Radios)
   bleibt eine Reihe und bricht nicht um; eine Liste von Werten wird an der Spaltenkante abgeschnitten. */
.tl-table__cell > span {
  display: block;
  width: 100%;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tl-table__cell > a {
  width: auto;
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tl-table__cell > .tl-field-value,
.tl-table__cell > .tl-select__values,
.tl-table__cell > .tl-choice-group {
  display: flex;
  flex-wrap: nowrap;
}

.tl-table__cell > .tl-select__values {
  width: 100%;
  overflow: hidden;
}

.tl-table__cell > .tl-select__values > * {
  flex-shrink: 0;
}

.tl-table__cell .tl-field-value--multiline {
  flex-direction: row;
  white-space: nowrap;
}

.tl-table__cell > [hidden] {
  display: none;
}

/* Ein Feld in der Zelle ist die Zelle: randlos, so hoch wie die Zeile. Sein Fokus ist der Basis-Ring
   nach innen (3a §5.2); Fehler und Warnung zeichnen eine innere Linie in Statusfarbe — kein outline in
   Statusfarbe (3a-Gate). Warnung vor Fehler: der Fehler steht später und gewinnt. */
.tl-table__cell:has(.tl-field) {
  padding: 0;
}

.tl-table__cell .tl-field {
  height: 100%;
  min-height: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
}

.tl-table__cell .tl-field:focus-visible {
  outline-offset: calc(-1 * var(--tl-focus-offset));
}

.tl-table__cell .tl-field[data-tl-state~="warning"] {
  box-shadow: inset 0 0 0 var(--tl-border-width-md) var(--tl-status-warning-border);
}

.tl-table__cell .tl-field[aria-invalid="true"],
.tl-table__cell .tl-field[data-tl-state~="error"] {
  box-shadow: inset 0 0 0 var(--tl-border-width-md) var(--tl-status-error-border);
}

.tl-table__cell .tl-field-group {
  height: 100%;
}

/* --- Baum- und Gruppenzeilen ----------------------------------------------------- */

/* Der Auf-/Zuklapper ist ein tl-toggle (size-control-sm). Der Einzug je Ebene ist seine Breite,
   gerechnet im TSX und inline gesetzt: so steht jedes Kind unter der Beschriftung seiner Eltern. Ein
   Blatt hält den Platz des Toggles frei. Gruppenzeile: tl-type-body-strong; die Anzahl tl-type-label. */
.tl-table__tree {
  display: flex;
  align-items: center;
  min-width: 0;
  height: 100%;
}
.tl-table__tree[hidden] { display: none; }

.tl-table__spacer {
  flex-shrink: 0;
  width: var(--tl-size-control-sm);
}

.tl-table__value {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tl-table__count {
  flex-shrink: 0;
  margin-inline-start: var(--tl-space-xs);
  color: var(--tl-text-secondary);
}

/* --- Leer und lädt nach ---------------------------------------------------------- */

/* Zeilen im sichtbaren Fenster, die der Server noch nicht geschickt hat: ein tl-skeleton in
   Zeilenhöhe. Ohne Zeilen steht im Körper eine tl-status-Zeile. */
.tl-table__placeholder {
  display: flex;
  align-items: center;
  padding: 0 var(--tl-space-control-x);
  border-bottom: var(--tl-border-width-sm) solid var(--tl-border-separator);
}
.tl-table__placeholder[hidden] { display: none; }

.tl-table__placeholder > .tl-skeleton {
  flex: 1 1 auto;
}

/* --- Ablehnung beim Ziehen ------------------------------------------------------- */

/* Warum das Ziel unter dem Zeiger ablehnt: ein tl-popover (Lage aus bridge/popover.ts), Text und Rand
   in Fehlerfarbe; der Zeiger geht hindurch. */
.tl-table__hint {
  border-color: var(--tl-status-error-border);
  color: var(--tl-status-error-text);
  pointer-events: none;
}
```

`tools/lint-css.mjs` MODIFIERS: `'tl-table': new Set([]),`.

- [ ] **Step 4: Vertrag, Specimen, Skeleton** — `table.contract.md`: Zustand (die Schlüssel von `TableViewControl` aus `TLTableView.tsx:309–330` ohne `rowHeight`), Aktionen (`select`, `selectAll`, `moveSelection`, `activate`, `expand`, `sort`, `columnResize`, `columnReorder`, `setFrozenColumnCount`, `openFilter`, `openColumnSelect`, `search`, `applyNamedFilter`, `clearFilter`, `saveNamedFilter`, `deleteNamedFilter`, `drop`, `dropProbe`, `scroll`), **Tastatur** (Raster fokussierbar; Pfeile, Pos1/Ende, Bild auf/ab bewegen den Cursor, Umschalt erweitert, Strg bewegt nur den Cursor, Leertaste wählt, Strg+A alle, Enter öffnet; Pfeil rechts/links klappt eine Baum- oder Gruppenzeile auf/zu und schiebt sonst waagerecht; Sortieren: Enter am Kopf-Knopf, Umschalt + Enter fügt eine Stufe an), **Semantik** (`role="grid"`/`role="treegrid"` am `tl-table__grid`, `aria-rowcount` = Zeilen + 1 (ohne Zeilen 2: die Statuszeile `aria-rowindex="2"` zählt mit), `aria-colcount`, `aria-multiselectable`, `aria-busy` beim Nachladen, `aria-activedescendant` = `<controlId>-row-<index>`; Kopf `role="rowgroup"` > `role="row"` `aria-rowindex="1"` > `role="columnheader"` mit `aria-sort` nur an der ersten Stufe; Körper `role="rowgroup"` mit `tabindex="-1"` (scrollt nur, kein eigener Tab-Halt) > `role="row"` mit `aria-rowindex`, `aria-selected`, im Baum `aria-level`, `aria-expanded` > `role="gridcell"`), Tokens (jede `var()` aus `table.css`), Attribute (`data-tl-state`-Wörter `cursor`, `frozen`, `frozen-last`, `pinned`, `pinned-first`, `filtered` und die Ziehen-Wörter aus `drag.contract.md`; `tl-checkbox` mit `aria-label` `js.table.selectAll`/`js.table.selectRow`, Kopf „teilweise“ nur als `indeterminate` — **kein** `aria-checked` (ARIA in HTML verbietet es am nativen Kästchen, der Browser meldet `indeterminate` als „gemischt“; entschieden 07.10.); Toggle `tl-toggle` mit `tabindex=-1` und `aria-expanded`, ohne `aria-controls` (er zeigte auf die eigene Zeile); Lehre `tl-status` mit `js.table.empty`; `tl-skeleton` in `tl-table__placeholder`; Filterleiste `tl-chip` + `tl-chip__toggle`/`__remove`, `tl-field-group`), Konformität. `table.spec.html`: Raster mit Kopf (eine sortierte Spalte mit Pfeil und Badge, eine gefilterte, eine fixierte mit `frozen-last`, eine angeheftete), fünf statische Zeilen (eine `aria-selected`, eine `cursor` im fokussierten Raster mit `aria-activedescendant`, eine `drop-before`, eine Baumzeile mit Toggle, eine Gruppenzeile mit Anzahl), eine Zelle mit Feld im Fehler, eine Skeleton-Zeile, darunter die leere Tabelle; Spaltenbreiten setzt das Skript über `el.style.width` (kein `style=` im HTML). `skeleton.contract.md`: Satz „Es gibt noch kein Control“ ersetzen durch „Erster Aufrufer: die Tabelle zeichnet Zeilen, die der Server noch nicht geschickt hat, als `tl-skeleton` in `tl-table__placeholder` (3b §10); das Raster trägt `aria-busy`“. `test/feedback.test.mjs` 40–49: die Prüfung `/kein Control/i` nur für `alert`, `badge`, `divider` (Bedingung `if (name !== 'skeleton')`). Index-Link „Tabelle →“.

- [ ] **Step 5: Gates, Commit** — `node tools/generate.mjs && node --test && node tools/lint-css.mjs` → grün. `git commit -m "Ticket #29617: Welle 3b -- tl-table: Raster, Kopf, Zeile, Zellen, Lage als Attribut"`

### Task P8: `tl-tree`

**Files:**
- Create: `src/components/tree/tree.css`, `tree.contract.md`, `tree.spec.html`
- Modify: `tools/lint-css.mjs`, `specimen/index.html`
- Test: `test/tree.test.mjs` (neu)

**Interfaces:**
- Produces: `ul.tl-tree[role=tree]` (isoliert), `li.tl-tree__node[role=treeitem]` (positioniert), `.tl-tree__spacer`, `.tl-tree__content`; Lädt: `li.tl-status[role=treeitem]` nach dem Knoten, eine Ebene tiefer (`aria-level` = Ebene des Knotens + 1), Name `js.tree.loading` (Plan-Review M3: ein `li role=none` mit Fortschritt direkt im `tree` ist ungültiges ARIA). Leser: E6.

- [ ] **Step 1: Test (rot)** — `test/tree.test.mjs`:

```js
// Der Baum — 3b §7: Cursor und Auswahl wie in der Tabelle, kein Balken, kein eigener Spinner.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readGenerated, declarationsOf, colorVarsOf } from './lib/component.mjs';

test('tl-tree: Knoten size-row, positioniert für den Cursor-Ring, Auswahl als Fläche ohne Balken', () => {
  const css = readGenerated('tree', 'tree.css');
  const knoten = declarationsOf(css, '.tl-tree__node') ?? '';
  assert.match(knoten, /min-height:\s*var\(--tl-size-row\)/);
  assert.match(knoten, /position:\s*relative/);
  assert.match(declarationsOf(css, '.tl-tree__node[aria-selected="true"]') ?? '', /background:\s*var\(--tl-surface-interactive-selected\)/);
  assert.match(declarationsOf(css, '.tl-tree') ?? '', /isolation:\s*isolate/);
  assert.match(declarationsOf(css, '.tl-tree__spacer') ?? '', /width:\s*var\(--tl-size-control-sm\)/);
  assert.doesNotMatch(css, /border-left|outline|--(selected|focused|cursor)\b|@keyframes/);
  assert.deepEqual(colorVarsOf(css), ['surface-interactive-hover', 'surface-interactive-selected', 'text-primary']);
});
```

- [ ] **Step 2: Rot sehen** — `node --test test/tree.test.mjs` → FAIL (ENOENT).

- [ ] **Step 3: tree.css**

```css
/* Baum — docs/skalen.md „Gleiches wird zusammengelegt“ (W3, W4, W10), 3b §7.
   ul.tl-tree[role=tree] > li.tl-tree__node[role=treeitem], flach, die Ebene in aria-level. Cursor und
   Auswahl wie in der Tabelle: data-tl-state~="cursor" (den Ring zeichnet base.css über ::after, darum
   ist der Knoten positioniert), aria-selected die Fläche — kein Balken links. Der Einzug je Ebene ist die
   Breite des Toggles, inline aus dem TSX; ein Blatt hält ihren Platz mit tl-tree__spacer frei. Ein
   Knoten, dessen Kinder kommen, trägt aria-busy; unter ihm steht eine tl-status-Zeile mit unbestimmtem
   tl-progress — selbst ein treeitem eine Ebene tiefer, benannt „Lädt“ (js.tree.loading). Ziehen und
   Ablegen zeichnet drag.css. */

.tl-tree {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  isolation: isolate;
  list-style: none;
  color: var(--tl-text-primary);
}

.tl-tree__node {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--tl-space-2xs);
  min-height: var(--tl-size-row);
  padding-inline-end: var(--tl-space-control-x);
  cursor: pointer;
}
.tl-tree__node[hidden] { display: none; }

.tl-tree__node:hover {
  background: var(--tl-surface-interactive-hover);
}

.tl-tree__node[aria-selected="true"] {
  background: var(--tl-surface-interactive-selected);
}

.tl-tree__spacer {
  flex-shrink: 0;
  width: var(--tl-size-control-sm);
}

.tl-tree__content {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

(`.tl-tree` setzt kein `display`: das `[hidden]` des Browsers bleibt wirksam.) `tools/lint-css.mjs` MODIFIERS: `'tl-tree': new Set([]),`.

- [ ] **Step 4: Vertrag, Specimen** — `tree.contract.md`: Zustand (`nodes` mit `id`, `depth`, `expandable`, `expanded`, `loading`, `selected`, `content`; `selectionMode`, `dragEnabled`, `dropEnabled`, `dropIndicatorNodeId`, `dropIndicatorPosition` `above|within|below` → `drop-before|drop-onto|drop-after`), Aktionen (`expand`, `collapse`, `select`, `activate`, `contextMenu`, `dragOver`, `drop`, `dragEnd`), Tastatur (unverändert, Spec §7: Pfeile, Rechts/Links klappt bzw. springt, Pos1/Ende, Enter öffnet, Leertaste wählt), Semantik (`role="tree"` mit `aria-label` = `js.tree.label`, `aria-multiselectable`, `aria-activedescendant` = `<controlId>-node-<id>`; `role="treeitem"` mit `id`, `aria-level`, `aria-expanded`, `aria-selected`, `aria-busy`; die Ladezeile ist ein `role="treeitem"` mit `aria-level` = Ebene des Knotens + 1 und `aria-label` = `js.tree.loading`, darin der unbestimmte `tl-progress`), Attribute (`tl-toggle` mit `tabindex=-1` und `aria-expanded`, ohne `aria-controls` — er zeigte auf den eigenen Knoten; `tl-status` als Ladezeile unter einem ladenden Knoten), Tokens, Konformität. `tree.spec.html`: fokussierter Baum (`tabindex="0"`, `aria-activedescendant`) mit drei Ebenen, ein Knoten `cursor`, einer `aria-selected`, einer `aria-busy` mit Ladezeile `<li class="tl-status" role="treeitem" aria-level="…" aria-label="Lädt">` samt `tl-progress`, einer `drop-onto`; Einzug per Skript. Index-Link „Baum →“.

- [ ] **Step 5: Gates, Commit** — `node tools/generate.mjs && node --test && node tools/lint-css.mjs` → grün. `git commit -m "Ticket #29617: Welle 3b -- tl-tree: Cursor und Auswahl wie die Tabelle"`

### Task P9: Gates — Kontrast, Zustandswörter, Verträge

**Files:**
- Modify: `tools/lib/pairs.mjs:55-56`, `src/primitives.json:24` (neue Stufe `red-34`), `src/tokens.json:18,20,46,48` (A1, entschieden 07.10.), `specimen/probe.theme.css` (erzeugt), `tools/lint-css.mjs:69,72`
- Test: `test/pairs.test.mjs` (Fall anhängen), `test/lint-css.test.mjs` (Fall anhängen), `test/contracts-3b.test.mjs` (neu)

- [ ] **Step 1: Tests (rot)** — an `test/pairs.test.mjs` anhängen:

```js

test('3b: die Paare der Daten stehen in der Liste', () => {
  const namen = new Set(kontrastPaare(T).map((p) => `${p.fg}|${p.bg}`));
  for (const k of ['icon-secondary|surface-interactive-selected', 'icon-secondary|surface-layer',
    'status-error-border|surface-interactive-selected', 'status-error-border|surface-interactive-hover',
    'status-warning-border|surface-interactive-selected', 'status-warning-border|surface-interactive-hover',
    'focus-ring|surface-interactive-selected',
    'focus-ring|surface-interactive-hover', 'border-emphasis|surface-layer',
    'text-placeholder|surface-base', 'text-placeholder|surface-layer', 'text-placeholder|surface-layer-nested'])
    assert.ok(namen.has(k), k);
});
```

an `test/lint-css.test.mjs` anhängen:

```js

test('3b: Cursor, Lage, Filter und Ziehen sind Zustände, keine Modifier — an Block und Element', () => {
  const known = new Set(['--tl-text-primary']);
  for (const z of ['cursor', 'frozen', 'frozen-last', 'pinned', 'pinned-first', 'filtered', 'expanded', 'drop-before', 'drop-after', 'drop-onto', 'drop-refused']) {
    assert.equal(lint(`.tl-table--${z} { color: var(--tl-text-primary); }`, { known, file: 'x.css' })
      .filter((m) => /Zustand als Modifier/.test(m)).length, 1, `Block ${z}`);
    assert.equal(lint(`.tl-table__row--${z} { color: var(--tl-text-primary); }`, { known, file: 'x.css' })
      .filter((m) => /Zustand als Element-Modifier/.test(m)).length, 1, `Element ${z}`);
  }
  assert.deepEqual(lint('.tl-table__row[data-tl-state~="cursor"] { color: var(--tl-text-primary); }', { known, file: 'x.css' }), []);
});
```

`test/contracts-3b.test.mjs`:

```js
// Die Verträge der Welle 3b nennen ihre Pflichtbegriffe; die neuen Specimen bestehen den Harness.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { missingInContract, specimenProblems } from './lib/component.mjs';
const datei = (d, f) => readFileSync(new URL(`../src/components/${d}/${f}`, import.meta.url), 'utf8');
const SOLL = {
  'status/status.contract.md': ['tl-status', 'role="alert"', 'tl-progress', 'aria-busy', '--tl-size-row', '--tl-text-secondary', '--tl-status-error-text'],
  'drag/drag.contract.md': ['drop-before', 'drop-after', 'drop-onto', 'drop-refused', 'dragging', 'data-tl-axis', 'dropPositionAt', 'useListReorder'],
  'reorder-list/reorder-list.contract.md': ['tl-reorder-list', 'tl-reorder-list__item', 'tl-reorder-list__handle', 'tl-reorder-list__search', 'aria-describedby', 'role="status"', 'js.reorder.moved', 'tl-checkbox'],
  'text/text.contract.md': ['tl-text', 'data-tl-tone', 'tl-text--truncate', 'tl-type-body-strong', 'placeholder', 'on-brand', 'tl-pill', 'data-tl-role'],
  'columns/columns.contract.md': ['tl-columns', 'tl-columns--gap-compact', 'tl-columns--gap-default', 'tl-columns--gap-loose', 'tl-columns__column'],
  'table/table.contract.md': ['tl-table', 'tl-table__grid', 'role="grid"', 'role="treegrid"', 'aria-rowcount', 'aria-rowindex', 'aria-activedescendant',
    'aria-selected', 'aria-sort', 'data-tl-state', 'cursor', 'frozen', 'pinned', 'filtered', 'tl-checkbox', 'indeterminate',
    'js.table.selectAll', 'js.table.selectRow', 'js.table.empty', 'tl-toggle', 'tl-skeleton', 'tl-status', 'tl-chip__toggle', 'tl-field-group',
    '--tl-size-row', '--tl-size-bar'],
  'tree/tree.contract.md': ['tl-tree', 'role="tree"', 'role="treeitem"', 'aria-level', 'aria-expanded', 'aria-selected', 'aria-busy',
    'aria-activedescendant', 'js.tree.label', 'js.tree.loading', 'tl-toggle', 'tl-status', 'cursor'],
  'pill/pill.contract.md': ['data-tl-role'],
  'avatar/avatar.contract.md': ['data-tl-role'],
  'alert/alert.contract.md': ['data-tl-role'],
  'select/select.contract.md': ['tl-status', 'data-tl-axis', 'useListReorder', 'filterOptions'],
  'field/field.contract.md': ['onGoto', 'href', 'data-tl-role', 'ThemeIcon'],
  'skeleton/skeleton.contract.md': ['tl-table__placeholder'],
};
for (const [file, names] of Object.entries(SOLL)) test(`${file} nennt ${names.length} Pflichtbegriffe`, () => {
  const [d, f] = file.split('/');
  assert.deepEqual(missingInContract(datei(d, f), names), []);
});
for (const name of ['status', 'reorder-list', 'text', 'columns', 'table', 'tree'])
  test(`${name}.spec.html besteht den Specimen-Harness`, () => assert.deepEqual(specimenProblems(datei(name, `${name}.spec.html`)), []));
```

- [ ] **Step 2: Rot sehen** — `node --test test/pairs.test.mjs test/lint-css.test.mjs test/contracts-3b.test.mjs` → FAIL (Paare fehlen; die neuen Zustandswörter melden nur „kein Modifier von tl-table“, nicht „Zustand als …“; `field.contract.md` nennt `onGoto` noch nicht — Step 5 zieht ihn nach).

- [ ] **Step 3: Fehler- und Warnlinie (A1, entschieden 07.10.)** — `src/primitives.json` Zeile 24: vor `"red-35": "#F14F43"` in derselben Zeile `"red-34": "#F2554A", ` einfügen (Name = 100 − OKLCH-L · 100). `src/tokens.json` hell: Zeile 18 `"status-error-border": "{red-35}"` → `"{red-41}"`, Zeile 20 `"status-warning-border": "{amber-36}"` → `"{amber-43}"`; dunkel: Zeile 46 `"status-error-border": "{red-41}"` → `"{red-34}"`, Zeile 48 `"status-warning-border": "{amber-43}"` → `"{amber-36}"`. Kein Primitiv trägt danach in einem Modus zwei Rollen: dunkel bleibt `red-35` allein `status-error-surface` (`skalen.md:372–374`). Dann `node tools/generate.mjs`. Gemessen (ausgewählt / Zeigen / Layer): hell Fehler `red-41` 3,63 / 3,97 / 4,45, dunkel Fehler `red-34` 3,18 / 3,39 / 4,81; hell Warnung `amber-43` 3,60 / 3,95 / 4,42, dunkel Warnung `amber-36` 3,25 / 3,46 / 4,91. (Mit den alten Stufen läge die Fehlerlinie auf ausgewählt bei 2,88 hell / 2,43 dunkel, die Warnlinie bei 2,71 / 2,44, die Fehlerlinie auf Zeigen dunkel bei 2,59 — die Paare aus Step 4 schlügen fehl.)

- [ ] **Step 4: Paare, Probe-Theme** — `tools/lib/pairs.mjs` nach `paar('border-interactive', 'surface-brand-subtle', 3.0); // gewählter Chip, gewähltes Segment`:

```js
  // Daten (3b §13): ausgewählte Zeile und Knoten, Cursor-Ring, Marken im Kopf, Kante fixierter Spalten,
  // Fehler- und Warnlinie im Zelleditor und Ablehnung beim Ziehen auf einer ausgewählten oder gezeigten
  // Zeile (Stufen seit 07.10.: hell red-41/amber-43, dunkel red-34/amber-36), Platzhalter-Ton im Text.
  for (const bg of ['surface-interactive-selected', 'surface-interactive-hover']) paar('focus-ring', bg, 3.0);
  for (const bg of ['surface-layer', 'surface-interactive-selected']) paar('icon-secondary', bg, 3.0);
  paar('border-emphasis', 'surface-layer', 3.0);
  for (const bg of ['surface-interactive-selected', 'surface-interactive-hover']) {
    paar('status-error-border', bg, 3.0);
    paar('status-warning-border', bg, 3.0);
  }
  for (const bg of ['surface-base', 'surface-layer', 'surface-layer-nested']) paar('text-placeholder', bg, 4.5);
```

Dann `node tools/derive.mjs test/fixtures/probe.primitives.json specimen/probe.theme.css` — das Probe-Theme ändert genau `--tl-focus-ring` hell `#E8541E` → `#E6521C` und bekommt die zugehörige Hinweiszeile im Kopf („focus-ring in der Helligkeit nachgeführt …“). Das kommt allein vom neuen Paar `focus-ring` auf `surface-interactive-selected`/`-hover`; Fehler- und Warnlinie aus Step 3 ändern das Probe-Theme nicht (nachgerechnet 07.10. in Kopien des Pakets: Step 3 mit den Rand-Paaren allein → byte-identisch; mit allen Paaren dieses Steps → genau diese Änderung). `git diff specimen/probe.theme.css` → eine geänderte Zeile (`--tl-focus-ring`), eine neue Hinweiszeile. `node --test test/pairs.test.mjs test/derive.test.mjs` → grün (`derive.test.mjs` verlangt die Datei byte-identisch).

- [ ] **Step 5: Lint und Verträge** — `tools/lint-css.mjs` Zeile 69 (`STATE_MODIFIER`) und 72 (`ELEMENT_STATE_MODIFIER`): in beiden Alternativen nach `collapsed` ergänzen `|expanded|cursor|filtered|frozen|frozen-last|pinned|pinned-first|drop-before|drop-after|drop-onto|drop-refused`. Verträge, die noch Begriffe aus Step 1 vermissen, nachziehen — `field.contract.md`: Abschnitt „Lesewert“ um „ein Renderer (`FieldValue`): äußerer Link `href` (neuer Tab), innerer Link `onGoto` (Kommando `goto`), Icon über `ThemeIcon`, Tönung als `tl-pill` mit `data-tl-role`“; `select.contract.md`: „Filter: `filterOptions` (trim, Kleinschreibung, enthält)“, sofern P3/P4 es nicht schon schrieben.

- [ ] **Step 6: Gates, Commit** — `node --test && node tools/lint-css.mjs` → grün (die Testzahl steht im Commit-Text; sie wächst gegenüber 270 um die Fälle aus P1–P9). `git add design-system && git commit -m "Ticket #29617: Welle 3b -- Gates: Kontrast der Daten (Fehler- und Warnlinie auf ausgewaehlt/Zeigen: hell red-41/amber-43, dunkel neue Stufe red-34/amber-36), Zustandswoerter, Vertraege"`

---

## Teil E — Engine (Branch `CWS/CWS_29617_design_system_welle_3b`)

**Reihenfolge:** E1 (Publizieren, Rollen, Status — sofort, weil `dist/` ab E1 `tl-pill--*`, `tl-avatar--category-*` und `tl-select__status` nicht mehr stylt) → E2 (Helfer) → E3 (Lesewert) → E4 (Text) → E5 (Spaltenwahl, Spalten) → E6 (Baum) → E7–E9 (Tabelle) → E10 (Gates, Doku) → E11 (Push, PR, Sichtprüfung). **Nicht pushen vor E9:** dazwischen ist die Tabelle teils alt, teils neu gestylt.

Jeder E-Task mit Änderung am alten Stylesheet endet mit: `node tools/inventory.mjs` → Zahlen in `design-system/test/ratchet.json` eintragen (gestrichene Blöcke löschen, gesunkene nachziehen, neue eintragen, `_blocks`-Vermerk „02.10. Welle 3b: …“; **die Literal-Budgets unter `literals` sinken mit** — Zahl aus `inventory.mjs`, nach E9 laut Plan-Review `fontSize` 47→41, `outlineNone` 20→16, `duration` 33→32, `zIndex` 21→14; TLJobStatus landet nach E9 bei ≈ 122, nicht 118 — Leerzeilen) → `node --test test/ratchet.test.mjs` grün → Commit im Projekt-Repo `git commit -m "Ticket #29617: Welle 3b -- Ratsche nach E<n> (…)"`.

### Task E1: Paket publizieren; Rollen als Attribut; Select-Status

**Files:**
- Modify: `com.top_logic.layout.react/src/main/webapp/style/tl-design-system/*` (publiziert)
- Modify: `react-src/controls/pill/TLPill.tsx`, `selectOptions.tsx`, `TLDropdownSelect.tsx` (Chip 57–87, `OptionRow` 139, Einzelwert 633, Status 567–582), `TLOptionChips.tsx:3,98-106`, `TLSegmentedChoice.tsx:3,134-147`, `TLAvatar.tsx:91-99`, `TLCheckbox.tsx:78` (`aria-checked` fällt, Entscheidung 22), `TLText.tsx:66` (nur `TLPill`-Aufruf bleibt gültig)
- Modify: `docs/faq/react-theme-tokens.md:45`, `docs/faq/react-view-layer.md:555,585,719`

**Interfaces:**
- Produces: `roleAttr(role?: string): string | undefined` und `TLPill({ role, className, icon, children })` in `controls/pill/TLPill.tsx` (rendert `span.tl-pill[data-tl-role]` > Icon + `span.tl-pill__label`); `pillClassName` fällt. In `selectOptions.tsx`: `OptionContent` (Bild + Label als Geschwister, für Elemente, die die Rolle selbst tragen), `OptionLabel` (Pill bei Rolle, sonst `OptionContent`), `optionRoleAttr(option)`. `withPill` bleibt bis E3 (Leser `TLResourceCell`).

- [ ] **Step 1: Publizieren** — `cd design-system && node tools/publish-to-worktree.mjs`.

- [ ] **Step 2: Pill** — `react-src/controls/pill/TLPill.tsx` ganz ersetzen:

```tsx
import { React } from 'tl-react-bridge';

/**
 * The data-tl-role of a value's color role: the role by its external name - brand, error, warning,
 * success, info, category-1 to category-8 - or `undefined` for a neutral value, which carries no
 * role attribute (pill.css draws it neutral).
 */
export function roleAttr(role?: string): string | undefined {
  return role && role !== 'neutral' ? role : undefined;
}

/**
 * Displays a value the model gives a color role as a pill of that role.
 *
 * <p>
 * The role arrives from the server by its external name and becomes the attribute
 * {@code data-tl-role}; how a role looks is the design system's (pill.css, generated by
 * {@code @tl-roles}). Nothing but the attribute is set: no color value, no custom property, no
 * modifier class. Icon and label stand side by side, the icon is not part of the label.
 * </p>
 */
export function TLPill({
  role,
  className,
  icon,
  children,
}: {
  role?: string;
  className?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <span className={className ? 'tl-pill ' + className : 'tl-pill'} data-tl-role={roleAttr(role)}>
      {icon}
      <span className="tl-pill__label">{children}</span>
    </span>
  );
}

export default TLPill;
```

- [ ] **Step 3: Optionen** — `selectOptions.tsx`: Import `import { TLPill, roleAttr } from './pill/TLPill';`; `withPill` bleibt vorerst; `OptionContent` (56–69) ersetzen und dahinter `OptionLabel`, `optionRoleAttr` einfügen:

```tsx
/**
 * Renders an option as its image followed by its label, for an element that carries the option's
 * color role itself (data-tl-role, see {@link optionRoleAttr}): a chip, a segment. Image and label
 * are siblings; nothing is nested in a pill.
 */
export function OptionContent({
  option,
  label,
  labelClassName,
}: {
  option: OptionDescriptor;
  label?: React.ReactNode;
  labelClassName?: string;
}) {
  return (
    <>
      <OptionImage image={option.image} />
      <span className={labelClassName}>{label ?? option.label}</span>
    </>
  );
}

/**
 * Renders an option where the element showing it carries no role of its own - a row of the open list,
 * the single chosen value: a `tl-pill` of the option's color role (image and label side by side in
 * it), or image and label as they are for a value without a role.
 */
export function OptionLabel({
  option,
  label,
  labelClassName,
}: {
  option: OptionDescriptor;
  label?: React.ReactNode;
  labelClassName?: string;
}) {
  if (!option.colorRole) {
    return <OptionContent option={option} label={label} labelClassName={labelClassName} />;
  }
  return (
    <TLPill role={option.colorRole} className="tl-type-label" icon={<OptionImage image={option.image} />}>
      {label ?? option.label}
    </TLPill>
  );
}

/** The data-tl-role an element showing the option carries: its color role, none for a neutral one. */
export function optionRoleAttr(option: OptionDescriptor): string | undefined {
  return roleAttr(option.colorRole);
}
```

`ReadonlyValue` (95) liest jetzt `<OptionLabel option={option} labelClassName="tl-field-value__text" />` (bis E3).

- [ ] **Step 4: Leser** — `TLOptionChips.tsx`: Import um `optionRoleAttr` ergänzen; am `button.tl-chip` `data-tl-role={optionRoleAttr(option)}`. `TLSegmentedChoice.tsx`: ebenso am `button.tl-segmented__segment`. `TLDropdownSelect.tsx`: Import `pillClassName` streichen, `OptionContent` → `OptionLabel` in `OptionRow` (139) und im Einzelwert (633), `optionRoleAttr` importieren; Chip-Wurzel `className="tl-pill tl-type-label tl-select__chip"` mit `data-tl-role={optionRoleAttr(option)}`, Label bleibt `span.tl-pill__label`; die drei Status-Zeilen (567, 572, 579) `className="tl-select__status tl-type-body"` → `className="tl-status tl-type-body"`. `TLAvatar.tsx:93`: `` `tl-avatar--category-${categoryOf(name)}` `` aus der Klassenliste nehmen und am `span` `data-tl-role={`category-${categoryOf(name)}`}` setzen. `TLCheckbox.tsx:78`: die Zeile `aria-checked={triState && value !== true && value !== false ? 'mixed' : value === true}` löschen — `indeterminate` setzt der Effekt über `boxRef` (36–37) schon, der Browser meldet es als „gemischt“ und `checked` selbst; ARIA in HTML verbietet `aria-checked` am nativen Kästchen (Entscheidung 22, 07.10.; `choice.contract.md` seit P1).

- [ ] **Step 5: Doku** — `docs/faq/react-theme-tokens.md:45`: „…carries the role as the attribute `data-tl-role`, `<span class="tl-pill" data-tl-role="warning">`, and nothing else…“. `docs/faq/react-view-layer.md`: 555 „…category roles of the design system (`data-tl-role="category-<n>"`, derived …)“, 585 `` `.tl-avatar[data-tl-role="category-<n>"]` `` statt `` `.tl-avatar--category-<n>` ``, 719 „…draws it everywhere as `tl-pill` with `data-tl-role="<role>"` and a `tl-pill__label`, and nothing but that attribute is set…“.

- [ ] **Step 6: Prüfen, Commit** — `tsc --noEmit` 0 Befunde, beide Vite-Builds; `git grep -n "tl-pill--\|tl-avatar--category\|tl-alert--\|pillClassName\|tl-select__status" -- 'com.top_logic.*/react-src' docs/faq` → leer; `git grep -n "aria-checked=" -- com.top_logic.layout.react/react-src/controls/TLCheckbox.tsx` → leer; `layout.react`-Tests grün. `git add -A com.top_logic.layout.react docs/faq && git commit -m "Ticket #29617: Design System wave 3b -- package republished; color roles are data-tl-role (pill, avatar, chip, segment, select chip), select status reads tl-status, the checkbox leaves its mixed state to indeterminate (no aria-checked)"`

### Task E2: Helfer — Token-Pixel, Filter, Zustandsattribut, Umsortieren per Tastatur

**Files:**
- Create: `react-src/bridge/token-px.ts`, `react-src/bridge/filter-options.ts`
- Modify: `react-src/bridge/css.ts`, `bridge/list-reorder.ts`, `bridge/popover.ts:18-28`, `bridge-entry.ts:42,77`, `controls/TLToolbar.tsx:519-528`, `controls/TLDropdownSelect.tsx` (Chips 20–87, 202–205, 226–234, 446–506, 260, 600–664), `controls/TLValueList.tsx:75-102,122-146`, `controls/TLColumnSelect.tsx:82` (nur `count`/`labelOf`, sonst E5)
- Modify: `src/main/java/com/top_logic/layout/react/I18NConstants.java` (Block „Value list“), `META-INF/messages_de.properties`, `tlReactControls.css:895-911` (TLValueList), `design-system/test/ratchet.json`

**Interfaces:**
- Produces (aus `tl-react-bridge`): `tokenPx(element: Element | null, name: string, fallback: number): number`; `useTokenPx(ref: React.RefObject<Element | null>, name: string, fallback: number): number`; `filterOptions<T extends { label: string }>(options: readonly T[], needle: string): T[]`; `stateAttr(...words: (string | false | null | undefined)[]): string | undefined`; `reorderState(state: ReorderItemState): 'dragging' | 'drop-before' | 'drop-after' | undefined`; `ListReorderOptions` um `count: number` (Pflicht), `labelOf?(index): string` und `keyOf?(index): string` (`onMove(from, to)` bleibt); `ReorderHandleProps` um `onKeyDown`, `'aria-describedby'`, `'aria-label'` und `ref` (Fokusrückgabe nach Alt + Pfeil, Plan-Review M2); `ListReorder.announcer: React.ReactElement`. Resource-Keys `js.reorder.handle|hint|moved|position`.

- [ ] **Step 1: token-px.ts** (neu):

```ts
/**
 * Lengths of the design system read where they apply.
 *
 * A control that lays out by numbers - a virtual list placing its rows, a tree indenting its nodes, a
 * toolbar measuring what fits - takes those numbers from the tokens rather than from constants or the
 * server: the density (`data-tl-density`) and a customer theme change the tokens, and the control
 * follows them. A custom property's computed value has its `var()` references substituted, so the
 * token reads as the length it resolves to (`2.25rem`, `36px`).
 */
import React from 'react';

/**
 * The pixel value of a length token at the given element.
 *
 * @param element Where the token is read; the document root for `null`.
 * @param name The custom property, e.g. `--tl-size-row`.
 * @param fallback What is returned while the token is not defined (no design system loaded).
 */
export function tokenPx(element: Element | null, name: string, fallback: number): number {
  const at = element ?? document.documentElement;
  const value = getComputedStyle(at).getPropertyValue(name).trim();
  const n = parseFloat(value);
  if (isNaN(n)) {
    return fallback;
  }
  if (value.endsWith('rem')) {
    return n * (parseFloat(getComputedStyle(document.documentElement).fontSize) || 16);
  }
  if (value.endsWith('em')) {
    return n * (parseFloat(getComputedStyle(at).fontSize) || 16);
  }
  return n;
}

/** The attributes of the document root that switch the tokens. */
const TOKEN_SWITCHES = ['data-tl-density', 'data-tl-theme', 'data-tl-mode'];

/**
 * A length token as state: measured at the element once it is mounted, and again whenever the
 * document root switches density or theme.
 *
 * @param ref The element the token is read at.
 * @param name The custom property, e.g. `--tl-size-row`.
 * @param fallback The value before the first measurement and without a design system.
 */
export function useTokenPx(ref: React.RefObject<Element | null>, name: string, fallback: number): number {
  const [px, setPx] = React.useState(fallback);
  React.useLayoutEffect(() => {
    const measure = () => {
      const next = tokenPx(ref.current, name, fallback);
      setPx((previous) => (previous === next ? previous : next));
    };
    measure();
    const observer = new MutationObserver(measure);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: TOKEN_SWITCHES });
    return () => observer.disconnect();
  }, [ref, name, fallback]);
  return px;
}
```

Eine Fassung statt drei: `TLToolbar.tsx` — die lokale Funktion `tokenPx(style, name)` samt Kommentar (523–528) löschen, Aufruf 519 `tokenPx(root, '--tl-size-control', 32)`, `tokenPx` in den Import aus `tl-react-bridge`. `bridge/popover.ts` — Rumpf von `gapPx` ersetzen durch `return tokenPx(document.documentElement, '--tl-space-xs', 8);` (Kommentar bleibt), Import `import { tokenPx } from './token-px';`.

- [ ] **Step 2: filter-options.ts und stateAttr** — `bridge/filter-options.ts` (neu):

```ts
/**
 * The one way a list of options is narrowed by a typed term: the select popup and the column
 * selection (and, from wave 5, the icon select) show the options whose label contains the term,
 * ignoring case and surrounding blanks.
 */

/**
 * The options whose label contains the needle.
 *
 * @param options The options in their order.
 * @param needle The typed term; blank or empty keeps every option.
 * @returns The matching options in their order, a new array.
 */
export function filterOptions<T extends { label: string }>(options: readonly T[], needle: string): T[] {
  const term = needle.trim().toLowerCase();
  if (term === '') {
    return options.slice();
  }
  return options.filter((option) => option.label.toLowerCase().includes(term));
}
```

an `bridge/css.ts` anhängen:

```ts

/**
 * The value of a `data-tl-state` attribute: the state words that apply, separated by spaces, or
 * `undefined` - which leaves the attribute out - when none does. The design system reads each word
 * with `[data-tl-state~="word"]`.
 */
export function stateAttr(...words: (string | false | null | undefined)[]): string | undefined {
  const all = words.filter(Boolean).join(' ');
  return all === '' ? undefined : all;
}
```

`bridge-entry.ts`: `export { useListReorder, reorderState } from './bridge/list-reorder';` und nach `rootClassName`: `export { rootClassName, stateAttr } from './bridge/css';`, `export { tokenPx, useTokenPx } from './bridge/token-px';`, `export { filterOptions } from './bridge/filter-options';`.

- [ ] **Step 3: list-reorder.ts** (vorgeprüft in einer Kopie von `react-src` mit den Aufrufern aus Step 4 für Spaltenwahl und Werteliste: `tsc --noEmit` 0 Befunde) — Import `import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';` und `import { useI18N } from './i18n';`, danach:

```ts
/** Texts of the keyboard gesture; the server translates them (I18NConstants, js.reorder.*). */
const I18N_KEYS = {
  'js.reorder.handle': 'Move {0}',
  'js.reorder.hint': 'Alt + arrow key moves the entry',
  'js.reorder.moved': '{0}, position {1} of {2}',
  'js.reorder.position': 'Position {0} of {1}',
};

/** Fills the placeholders {0}, {1}, ... of a translated text. */
function format(template: string, ...args: string[]): string {
  return args.reduce((text, arg, i) => text.replace('{' + i + '}', arg), template);
}
```

`ReorderHandleProps` erweitern:

```ts
export interface ReorderHandleProps {
  onPointerDown?(event: React.PointerEvent): void;
  /** Alt + arrow moves the item by one position (WCAG 2.5.7: dragging has a single-pointer-free alternative). */
  onKeyDown?(event: React.KeyboardEvent): void;
  /** Points at the hint naming the keyboard gesture, rendered by {@link ListReorder.announcer}. */
  'aria-describedby'?: string;
  /** "Move <name>", present where {@link ListReorderOptions.labelOf} names the item. */
  'aria-label'?: string;
  /**
   * Registers the handle, so that the focus can return to it after a keyboard move; a control spreads
   * it onto the handle and sets no ref of its own there.
   */
  ref?: (element: HTMLElement | null) => void;
}
```

In `ListReorderOptions` nach `onMove` (dessen Signatur bleibt) drei Felder:

```ts

  /** The number of items; a keyboard move stops at both ends. */
  count: number;

  /** The name of the item at the given position, for the handle's label and the announcement of a move. */
  labelOf?(index: number): string;

  /**
   * The React key of the item at the given position, for a list keyed by its values: after a keyboard
   * move the hook gives the focus back to the moved item's handle once the list shows the item at its
   * new position. Without it the list is keyed by position, and the focus goes to the handle at the
   * new position right away.
   */
  keyOf?(index: number): string;
```

In `ListReorder` nach `containerProps`:

```ts

  /**
   * The hint the handles point at and the live region announcing a keyboard move ("<name>, position n
   * of m"); the control renders it once, next to the list.
   */
  announcer: React.ReactElement;
}

/** The `data-tl-state` word of an item's drag state (drag.css), `undefined` while it takes no part. */
export function reorderState(state: ReorderItemState): 'dragging' | 'drop-before' | 'drop-after' | undefined {
  return state.dragging ? 'dragging' : state.dropBefore ? 'drop-before' : state.dropAfter ? 'drop-after' : undefined;
}
```

Im Hook: `const { axis = 'vertical', onMove, enabled = true, handle = false, count, labelOf, keyOf } = options;` plus `const t = useI18N(I18N_KEYS); const hintId = useId(); const [announcement, setAnnouncement] = useState('');`; nach `onMoveRef.current = onMove;` die Refs im gleichen Muster:

```ts
  const countRef = useRef(count);
  countRef.current = count;
  const labelOfRef = useRef(labelOf);
  labelOfRef.current = labelOf;
  const keyOfRef = useRef(keyOf);
  keyOfRef.current = keyOf;
```

`handleDrop` bleibt (`onMoveRef.current(from, to)`). `handleProps` ersetzen durch die Fokusrückgabe (Plan-Review M2: die Spaltenwahl ist nach Name, die Select-Chips nach Wert geschlüsselt; React verschiebt den DOM-Knoten des bewegten Eintrags, sobald die neue Reihenfolge da ist, und der Browser lässt den Fokus eines verschobenen Knotens fallen — ohne Rückgabe landet er auf `body`, und die Tastatur-Alternative ist nach einem Schritt unbrauchbar), die Tastatur und die neuen `handleProps`:

```ts
  // -- After a keyboard move the focus returns to the moved item's handle (3b §8). A list keyed by
  //    value moves the item's DOM node once the new order arrives, and the browser drops the focus of
  //    a node it moves; a list keyed by position keeps its nodes, and the moved value now sits under
  //    the handle at the new position. --
  const handlesRef = useRef(new Map<string, HTMLElement>());
  const pendingFocusRef = useRef<{ key: string; to: number } | null>(null);
  const keyAt = useCallback((index: number) => keyOfRef.current?.(index) ?? String(index), []);

  useLayoutEffect(() => {
    const pending = pendingFocusRef.current;
    if (pending === null) {
      return;
    }
    const target = handlesRef.current.get(pending.key);
    if (keyAt(pending.to) === pending.key) {
      pendingFocusRef.current = null;
      if (target?.isConnected) {
        target.focus();
      }
      return;
    }
    // The user went on before the new order arrived: the focus is not the list's to take back.
    const active = document.activeElement;
    if (active !== null && active !== document.body && active !== target) {
      pendingFocusRef.current = null;
    }
  });

  // Alt + arrow moves the item by one position, the same move a drop makes, and announces where it
  // landed. Back and forth follow the axis: up/down in a column, left/right in a row.
  const keyboardMove = useCallback((index: number, event: React.KeyboardEvent) => {
    if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }
    const back = axis === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
    const forth = axis === 'vertical' ? 'ArrowDown' : 'ArrowRight';
    if (event.key !== back && event.key !== forth) {
      return;
    }
    // The list takes Alt + arrow over from the page: no scrolling, no step in the browser history.
    event.preventDefault();
    event.stopPropagation();
    const to = index + (event.key === back ? -1 : 1);
    const total = countRef.current;
    if (to < 0 || to >= total) {
      return;
    }
    pendingFocusRef.current = { key: keyOfRef.current ? keyOfRef.current(index) : String(to), to };
    onMoveRef.current(index, to);
    const name = labelOfRef.current?.(index) ?? '';
    setAnnouncement(name
      ? format(t['js.reorder.moved'], name, String(to + 1), String(total))
      : format(t['js.reorder.position'], String(to + 1), String(total)));
  }, [axis, t]);

  const handleProps = useCallback((index: number): ReorderHandleProps => {
    if (!enabled) {
      return {};
    }
    const name = labelOfRef.current?.(index);
    return {
      // The primary button starts a drag; a context menu or a middle click does not.
      onPointerDown: handle ? (event) => { if (event.button === 0) arm(index); } : undefined,
      onKeyDown: (event) => keyboardMove(index, event),
      'aria-describedby': hintId,
      ...(name ? { 'aria-label': format(t['js.reorder.handle'], name) } : {}),
      ref: (element) => {
        if (element) {
          handlesRef.current.set(keyAt(index), element);
        }
      },
    };
  }, [arm, enabled, handle, hintId, keyAt, keyboardMove, t]);
```

(Der Effekt ohne Abhängigkeitsliste läuft nach jedem Rendern des Controls, also auch, wenn die neue Reihenfolge vom Server kommt; er wartet, bis an `to` der bewegte Schlüssel steht. Eine nach Position geschlüsselte Liste erfüllt das sofort.) Das `return` des Hooks:

```ts
  const announcer = React.createElement(React.Fragment, null,
    React.createElement('span', { id: hintId, hidden: true }, t['js.reorder.hint']),
    React.createElement('span', { role: 'status', className: 'tl-visually-hidden' }, announcement));

  return { dragIndex, dropTarget, itemProps, handleProps, itemState, containerProps, announcer };
```

Den Modul-Kommentar oben um einen Absatz ergänzen: „The handle is a button: Alt + arrow moves the item, the live region announces the new position, and the focus stays on the moved item's handle (3b §8).“

- [ ] **Step 4: Leser** — `TLColumnSelect.tsx:82` (die Liste ist nach `entry.name` geschlüsselt, Zeile 118):

```tsx
  const reorder = useListReorder({
    axis: 'vertical',
    onMove: handleMove,
    count: entries.length,
    labelOf: (i) => entries[i]?.label ?? '',
    keyOf: (i) => entries[i]?.name ?? String(i),
  });
```

(der Rest in E5). `TLValueList.tsx`: Import um `reorderState`; die Zeilen sind nach Position geschlüsselt — der Hook gibt den Fokus ohne `keyOf` sofort an den Griff der neuen Position. Darum den Ref `handles` samt Kommentar (75–77) und `handleKeyDown` (87–102) löschen; `move` bleibt, wie es ist (79–81); den Hook ersetzen:

```tsx
  // A value is edited in a text field, so the row is picked up by its handle rather than anywhere:
  // a row that is draggable throughout would drag itself when text within it is selected. Alt + arrow
  // on the handle moves it by keyboard, and the focus follows the value to the handle of the row it
  // now sits in (the common hook, 3b §8).
  const reorder = useListReorder({ axis: 'vertical', onMove: move, enabled: arrangeable, handle: true, count: elements.length });
```

die Zeile: `<div key={index} className="tlValueList__row" data-tl-state={reorderState(reorder.itemState(index))} {...reorder.itemProps(index)}>` (die drei `--dragging`/`--dragOver-*`-Zweige fallen); am Griff `ref={(handle) => { handles.current[index] = handle; }}` und `onKeyDown={…}` streichen (das Spread liefert `ref` und `onKeyDown`; ein eigener `ref` vor dem Spread würde ohnehin überschrieben; `aria-label={t['js.valueList.move']}` steht vor dem Spread und bleibt, weil der Hook ohne `labelOf` keines setzt); nach dem Hinzufügen-Knopf `{arrangeable && reorder.announcer}`.

`TLDropdownSelect.tsx`: Import um `useListReorder, reorderState, filterOptions` und `import type { ReorderItemProps, ReorderHandleProps } from 'tl-react-bridge';`; `ChipDragState` und die Chip-Props `draggable/onDragStart/onDragOver/onDrop/onDragEnd/dragState` ersetzen durch `reorderable: boolean; itemProps?: ReorderItemProps; handleProps?: ReorderHandleProps; dragState?: string;`; im Chip an der Wurzel `{...itemProps}` statt der vier Handler **und** statt der Zeile `draggable={draggable || undefined}` (das Spread setzt `draggable`; bliebe die alte Zeile, verwiese sie auf eine Prop, die es nicht mehr gibt), und den Griff als Knopf:

```tsx
      {reorderable && (
        <button
          type="button"
          className={buttonClassName({ appearance: 'ghost', small: true, icon: true, extra: 'tl-select__drag-handle' })}
          onClick={(e) => e.stopPropagation()}
          {...tooltipProps(handleProps?.['aria-label'])}
          {...handleProps}
        >
          <ThemeIcon encoded={HANDLE_ICON} className="tl-button__icon tl-icon-sm" />
        </button>
      )}
```

(`const HANDLE_ICON = 'css:fa-solid fa-grip-vertical';` oben.) Die drei Zustände `dragIndex`, `dropTargetIndex`, `dropPosition` (202–205) und die vier Handler 446–506 löschen; an ihre Stelle:

```tsx
  // -- Reordering the chips: the common gesture (useListReorder), along the row of chips --

  const moveChip = useCallback(
    (from: number, to: number) => {
      const reordered = [...valueRef.current];
      const [moved] = reordered.splice(from, 1);
      reordered.splice(to, 0, moved);
      valueRef.current = reordered;
      sendCommand(CMD_VALUE_CHANGED, { value: reordered.map((v) => v.value) });
    },
    [sendCommand]
  );

  // The chips are keyed by value: after Alt + arrow the hook gives the focus back to the moved chip's
  // handle once the server's new order has arrived.
  const reorder = useListReorder({
    axis: 'horizontal',
    onMove: moveChip,
    enabled: dragEnabled,
    count: value.length,
    labelOf: (i) => value[i]?.label ?? '',
    keyOf: (i) => value[i]?.value ?? String(i),
  });
```

Die Filterung 226–234:

```tsx
  // Derived: the options not chosen, narrowed by the search (filterOptions, shared with the column
  // selection).
  const filteredOptions = useMemo(
    () => filterOptions(allOptions.filter((o) => !selectedIds.has(o.value)), searchTerm),
    [allOptions, selectedIds, searchTerm]
  );
```

Die Hervorhebung des Treffers in `OptionRow` (`labelContent`, 118–130) markiert dasselbe Wort, das `filterOptions` sucht — getrimmt:

```tsx
  const labelContent = useMemo(() => {
    // The term the filter matches (filterOptions trims it): blanks around it mark nothing.
    const term = searchTerm.trim();
    if (!term) return option.label;
    const idx = option.label.toLowerCase().indexOf(term.toLowerCase());
    if (idx < 0) return option.label;
    const matchClass = option.colorRole ? 'tl-type-label-strong' : 'tl-type-body-strong';
    return (
      <>
        {option.label.substring(0, idx)}
        <span className={matchClass}>{option.label.substring(idx, idx + term.length)}</span>
        {option.label.substring(idx + term.length)}
      </>
    );
  }, [option.label, option.colorRole, searchTerm]);
```

 Fokus nach dem Entfernen (260): `'.tl-select__chip > .tl-button:not(.tl-select__drag-handle)'`. `span.tl-select__values`: `data-tl-axis={multiSelect ? 'horizontal' : undefined} {...reorder.containerProps}`; die Chip-Schleife:

```tsx
            value.map((v, idx) => (
              <Chip
                key={v.value}
                option={v}
                removable={!disabled}
                onRemove={removeOption}
                removeLabel={removeChipLabel(v.label)}
                reorderable={dragEnabled}
                itemProps={dragEnabled ? reorder.itemProps(idx) : undefined}
                handleProps={dragEnabled ? reorder.handleProps(idx) : undefined}
                dragState={dragEnabled ? reorderState(reorder.itemState(idx)) : undefined}
              />
            ))
```

und vor dem Portal `{dragEnabled && reorder.announcer}`.

- [ ] **Step 5: Keys und altes CSS** — `I18NConstants.java` nach `JS_VALUE_LIST_MOVE` ein Block `// -- Reordering client-side i18n keys --` mit vier Konstanten nach dem Muster von `js.dropdownSelect.removeChip` (`@en Move {0}` → `js.reorder.handle`, `JS_REORDER_HANDLE`; `@en Alt + arrow key moves the entry` → `js.reorder.hint`; `@en {0}, position {1} of {2}` → `js.reorder.moved`; `@en Position {0} of {1}` → `js.reorder.position`). `messages_de.properties`: `js.reorder.handle = {0} verschieben`, `js.reorder.hint = Alt + Pfeiltaste verschiebt den Eintrag`, `js.reorder.moved = {0}, Position {1} von {2}`, `js.reorder.position = Position {0} von {1}`. `check-messages-en.sh` → Diff committen. `tlReactControls.css` im Block TLValueList: den Kommentar und die zwei `border-*: 2px solid transparent` in `.tlValueList__row` (895–898) und die drei Regeln `--dragging`, `--dragOver-before`, `--dragOver-after` (901–911) löschen — die Optik zeichnet `drag.css`. Ratsche (TLValueList sinkt).

- [ ] **Step 6: Prüfen, Commit** — `tsc --noEmit` 0, beide Builds, `layout.react`-Tests grün, `git grep -n "tlValueList__row--" -- 'com.top_logic.layout.react/'` leer, `git grep -n "handles.current\|handleKeyDown" -- com.top_logic.layout.react/react-src/controls/TLValueList.tsx` leer, `git grep -n "draggable={draggable" -- com.top_logic.layout.react/react-src/controls/TLDropdownSelect.tsx` leer. `git commit -m "Ticket #29617: Design System wave 3b -- helpers: tokenPx/useTokenPx (one version), filterOptions, stateAttr; reorder by Alt + arrow with a live region for select chips and value lists"`

### Task E3: Ein Lesewert — `FieldValue` mit zwei Link-Arten

**Files:**
- Modify: `react-src/controls/form/FieldValue.tsx`, `selectOptions.tsx` (`withPill` 25–36 fällt, `ReadonlyValue` 74–104), `TLResourceCell.tsx`

**Interfaces:**
- Consumes: `TLPill` (E1).
- Produces: `FieldValue({ id?, className?, text, href?, onGoto?, multiline?, icon?, role?, tooltip? })` — `href` äußerer Link (neuer Tab), `onGoto` innerer Link (`goto`), `icon` kodiertes Theme-Bild (`ThemeIcon`), `role` Farbrolle (Pill mit `data-tl-role`, nur um Inhalt), `tooltip` der `data-tooltip`-Wert. Bestehende Aufrufer (`TLTextInput`, `TLNumberInput`, `TLDatePicker`, `TLSelect`, `TLPasswordInput`, `TLBooleanChoice`) bleiben unverändert gültig.

- [ ] **Step 1: FieldValue** — `form/FieldValue.tsx` ganz ersetzen:

```tsx
import { React, ThemeIcon } from 'tl-react-bridge';
import { TLPill } from '../pill/TLPill';

/** What stands in an empty line, so that the line keeps its height. */
const EMPTY_LINE = ' ';

/**
 * The one renderer of a read-only value (design system: tl-field-value): the form field that is not
 * editable, the chosen values of a select, the business object in a table cell.
 *
 * The value is a `span`, or an `a` where it leads somewhere - either out of the application (`href`,
 * opened in a new tab, as a web address in a form) or to the place the application displays the value
 * at (`onGoto`, the command `goto`, as a select value or a table cell). Its text stands in a
 * `tl-field-value__text` that ends with an ellipsis; a multi-line value is a `div` with
 * `tl-field-value--multiline` and one text per line. An icon comes through ThemeIcon. A value the
 * model gives a color role is a `tl-pill` carrying the role as `data-tl-role`, icon and label side by
 * side within it.
 *
 * @param id the id of the element, the control id of the field
 * @param className further classes after the design system's, e.g. the result of rootClassName
 * @param text the value as text
 * @param href the address the value points at outside the application; no link where absent
 * @param onGoto leads to the place the value is displayed at; no link where absent
 * @param multiline whether the text is shown with its line breaks
 * @param icon the encoded theme image of the value (ThemeIcon), none where absent
 * @param role the color role of the value; plain where absent
 * @param tooltip the data-tooltip of the value (`key:tooltip` for a tooltip the server provides)
 */
export function FieldValue({
  id,
  className,
  text,
  href,
  onGoto,
  multiline = false,
  icon,
  role,
  tooltip,
}: {
  id?: string;
  className?: string;
  text: string;
  href?: string | null;
  onGoto?: () => void;
  multiline?: boolean;
  icon?: string;
  role?: string;
  tooltip?: string;
}) {
  const cls = (base: string) => (className ? base + ' ' + className : base);
  if (multiline) {
    return (
      <div id={id} className={cls('tl-field-value tl-field-value--multiline tl-type-body')} data-tooltip={tooltip}>
        {text.split('\n').map((line, index) => (
          <span key={index} className="tl-field-value__text">{line === '' ? EMPTY_LINE : line}</span>
        ))}
      </div>
    );
  }
  const image = icon ? <ThemeIcon encoded={icon} className="tl-icon-sm" /> : null;
  const label = text !== '' ? <span className="tl-field-value__text">{text}</span> : null;
  // A pill is drawn around content only: a value without a label shows no empty tinted box.
  const content = role && text !== ''
    ? <TLPill role={role} className="tl-type-label" icon={image}>{text}</TLPill>
    : <>{image}{label}</>;
  if (href != null) {
    return (
      <a id={id} className={cls('tl-field-value tl-type-body')} href={href} target="_blank" rel="noopener noreferrer"
        data-tooltip={tooltip}>
        {content}
      </a>
    );
  }
  if (onGoto) {
    const follow = (e: React.MouseEvent) => {
      e.preventDefault();
      onGoto();
    };
    return (
      <a id={id} className={cls('tl-field-value tl-type-body')} href="#" onClick={follow} data-tooltip={tooltip}>
        {content}
      </a>
    );
  }
  return (
    <span id={id} className={cls('tl-field-value tl-type-body')} data-tooltip={tooltip}>
      {content}
    </span>
  );
}
```

- [ ] **Step 2: ReadonlyValue und TLResourceCell** — `selectOptions.tsx`: `withPill` samt Kommentar löschen; Import `import { FieldValue } from './form/FieldValue';`; `ReadonlyValue` ersetzen:

```tsx
export function ReadonlyValue({
  option,
  onGoto,
}: {
  option: OptionDescriptor;
  onGoto: (value: string) => void;
}) {
  const goto = useCallback(() => onGoto(option.value), [onGoto, option.value]);
  return (
    <FieldValue
      text={option.label}
      icon={option.image}
      role={option.colorRole}
      onGoto={option.link ? goto : undefined}
    />
  );
}
```

(Kommentar darüber: „…rendered by FieldValue, the one read-only value (N1)…“.) `TLResourceCell.tsx`: Import `withPill` → `import { FieldValue } from './form/FieldValue';`; ab `const icon = iconCss …` bis vor `export default` ersetzen:

```tsx
  const handleGoto = React.useCallback(() => {
    sendCommand(CMD_GOTO, {});
  }, [sendCommand]);

  // One renderer of a read-only value (N1): the icon through ThemeIcon, a colored object as a pill
  // carrying data-tl-role, a link as the inner kind (goto).
  return (
    <FieldValue
      id={controlId}
      className={rootClassName(state)}
      text={label ?? ''}
      icon={iconCss ? 'css:' + iconCss : iconSrc}
      role={colorRole}
      onGoto={hasLink ? handleGoto : undefined}
      tooltip={hasTooltip ? 'key:tooltip' : undefined}
    />
  );
};
```

(`iconSrc` ist die kodierte Form eines Ressourcenbilds aus `ReactResourceCellControl.java:261–268`; `ThemeIcon` rendert eine Form mit `/` oder `theme:` als `<img>` — Sichtprüfung E11 Punkt 10.)

- [ ] **Step 3: Prüfen, Commit** — `tsc --noEmit` 0, beide Builds, `layout.react`-Tests grün (`TestTableTooltips`), `git grep -n "withPill\|<i className={iconCss" -- 'com.top_logic.layout.react/react-src'` leer. `git commit -m "Ticket #29617: Design System wave 3b -- FieldValue is the one read-only value: outer and inner links, ThemeIcon, role as data-tl-role; ReadonlyValue and TLResourceCell render through it"`

### Task E4: TLText — `tl-text`, Ton als Attribut, `accent` fällt

**Files:**
- Modify: `react-src/controls/TLText.tsx`
- Modify: `com.top_logic.layout.react/src/main/java/com/top_logic/layout/react/control/common/TextTone.java`, `ReactTextControl.java:76`, `META-INF/messages_de.properties:265-266`
- Modify: `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/TextElement.java:135`, `com.top_logic.layout.view/src/main/java/META-INF/messages_de.properties:1395`, `…/inspector/InspectedNodeElement.java:83`, `…/views/admin/access-control/coverage.view.xml:369`
- Modify: `com.top_logic.layout.configedit/src/main/java/com/top_logic/layout/configedit/ConfigListEditorControl.java:65,614-616`
- Modify: `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/demo/styling-demo.view.xml:138-143`, `html-demo.view.xml:254`, `repeater-card.view.xml:37`, `views/tickets/comment.view.xml:34`
- Modify: `tlReactControls.css:2066-2079` (Primär-App-Bar), `:3180-3283` (`.tlText` und drei Blöcke); `docs/faq/react-view-layer.md:100,121,158-180,669`; `design-system/test/ratchet.json`
- Test: `com.top_logic.layout.view/src/test/java/test/com/top_logic/layout/view/element/TestTextElement.java`, `src/test/resources/test/com/top_logic/layout/view/element/test-text.view.xml`

**Interfaces:**
- Consumes: P6 (`tl-text`, `tl-text--truncate`, `data-tl-tone`).
- Produces: `TextTone` ohne `ACCENT`, mit `PLACEHOLDER("placeholder")` (A4).

- [ ] **Step 1: Java-Test (rot)** — `test-text.view.xml`: in den `stack` als vierte Zeile `<text label="Empty" tone="placeholder"/>`. `TestTextElement.java` nach `testRolesAreIndependent`:

```java
	/**
	 * A placeholder is a tone of its own, not a shape: it arrives by its external name, and the client
	 * draws it in the placeholder color without a font style.
	 */
	public void testPlaceholderTone() {
		assertEquals(TextTone.PLACEHOLDER.getExternalName(), child(3).get(TONE));
	}
```

Rot: `$MVN install -pl com.top_logic.layout.react` und `$MVN test -DskipTests=false -pl com.top_logic.layout.view -Dtest=test.com.top_logic.layout.view.element.TestTextElement` → Kompilierfehler (`PLACEHOLDER` fehlt).

- [ ] **Step 2: Vokabular** — `TextTone.java`: die Konstante `ACCENT` samt JavaDoc löschen; nach `HELPER`:

```java
	/** Text that stands in for a value not yet there: a name not given, a list without entries. */
	PLACEHOLDER("placeholder"),
```

`TextElement.java:135`: „…{@link TextTone#HELPER hint}, an {@link TextTone#ACCENT accent}, or an outcome“ → „…{@link TextTone#HELPER hint}, a {@link TextTone#PLACEHOLDER placeholder}, or an outcome“ (Rest des Satzes lesen und grammatisch anpassen). `ReactTextControl.java:76`: „Additional CSS class to append to the design system's classes of the text, or {@code null}.“ `messages_de.properties`: die zwei Zeilen `TextTone.ACCENT` und `.tooltip` löschen, `TextTone.PLACEHOLDER = Platzhalter` und `TextTone.PLACEHOLDER.tooltip = Text, der für einen noch fehlenden Wert steht: ein nicht vergebener Name, eine Liste ohne Einträge.` einfügen. `com.top_logic.layout.view/src/main/java/META-INF/messages_de.properties:1395` (`com.top_logic.layout.view.element.TextElement.Config.tone.tooltip`): der JavaDoc von `TextElement.java:135` ist dieser Tooltip, darum von Hand „…ein erklärender Hinweis, eine Hervorhebung oder ein Ergebnis…“ → „…ein erklärender Hinweis, ein Platzhalter oder ein Ergebnis…“ (die englische Fassung schreibt `check-messages-en.sh` in Step 6). Grün — `layout.view` liest `TextTone` aus dem lokalen Repo, darum vorher neu installieren, in Abhängigkeitsreihenfolge react → configedit → view:

```bash
$MVN install -pl com.top_logic.layout.react 2>&1 | tail -3
$MVN install -pl com.top_logic.layout.configedit 2>&1 | tail -3
$MVN test -DskipTests=false -pl com.top_logic.layout.view -Dtest=test.com.top_logic.layout.view.element.TestTextElement 2>&1 | tail -20
```

→ `TestTextElement` grün.

- [ ] **Step 3: Aufrufer** — `InspectedNodeElement.java:83`: `"tl-type-body-strong"` (JavaDoc der Konstante: „The type class of the strong body text.“). `ConfigListEditorControl.java`: Konstante `PLACEHOLDER_CSS` löschen; `createHeaderControl`:

```java
	private ReactTextControl createHeaderControl(Label label) {
		ReactTextControl header = new ReactTextControl(_context, label.text(), null);
		if (label.placeholder()) {
			header.setTone(TextTone.PLACEHOLDER);
		}
		return header;
	}
```

(Import `com.top_logic.layout.react.control.common.TextTone`.) `coverage.view.xml:369`, `html-demo.view.xml:254`, `repeater-card.view.xml:37`, `comment.view.xml:34`: `css-class="tlText--strong"` → `css-class="tl-type-body-strong"`. `styling-demo.view.xml:138–143`: `<text tone="accent">` mit Label `accent` → `<text css-class="tl-type-body-strong">` mit Label `strong` (en/de). Danach `mvn exec:java@normalize-layouts` nur, wenn der Prettyprinter die geänderten Dateien anders setzt (`git diff` prüfen).

- [ ] **Step 4: TLText** — `react-src/controls/TLText.tsx` ganz ersetzen:

```tsx
import { React, useTLState, rootClassName } from 'tl-react-bridge';
import type { TLCellProps } from 'tl-react-bridge';
import { roleAttr } from './pill/TLPill';

/**
 * The type class of each variant (design system, base.css). Caption and label share the label size:
 * the type scale has one size below the body.
 */
const TYPE_CLASS: Record<string, string> = {
  display: 'tl-type-display',
  headline: 'tl-type-heading-lg',
  title: 'tl-type-heading-sm',
  body: 'tl-type-body',
  label: 'tl-type-label',
  caption: 'tl-type-label',
};

/**
 * The data-tl-tone of each tone (text.css); the primary tone carries none and inherits the color of
 * its surroundings, the text on a filled surface reads the label on the brand.
 */
const TONE_ATTR: Record<string, string | undefined> = {
  primary: undefined,
  secondary: 'secondary',
  helper: 'helper',
  placeholder: 'placeholder',
  success: 'success',
  warning: 'warning',
  error: 'error',
  'on-color': 'on-brand',
};

/**
 * The pill role a text of the given tone takes when it is drawn as a pill without a role of its own:
 * the meanings keep their name, everything else is neutral.
 */
function roleOfTone(tone: string): string {
  switch (tone) {
    case 'success': case 'warning': case 'error': return tone;
    default: return 'neutral';
  }
}

/**
 * Read-only text (design system: tl-text). A `span` with the type class of its variant and its tone
 * as `data-tl-tone`; `overflow="ellipsis"` truncates it to one line (`tl-text--truncate`). Drawn as a
 * pill - `appearance="pill"` or a value with a color role - the root is the `span.tl-pill` itself,
 * carrying the role as `data-tl-role`.
 *
 * State:
 * - text: string - the text to display
 * - overflow: "wrap" | "ellipsis"
 * - variant: "body" | "title" | "headline" | "display" | "label" | "caption"
 * - tone: "primary" | "secondary" | "helper" | "placeholder" | "success" | "warning" | "error" | "on-color"
 * - appearance: "text" | "pill" - plain text, or a pill whether or not the value carries a role
 * - role: string - optional ARIA role (e.g. "alert" for a message announced when it appears)
 * - colorRole: string - optional color role the value carries in the model; shown as a pill of that role
 *
 * A strong text is the strong type class given as the element's CSS class (`tl-type-body-strong`).
 */
const TLText: React.FC<TLCellProps> = ({ controlId }) => {
  const state = useTLState();
  const text = (state.text as string) ?? '';
  const hasTooltip = state.hasTooltip === true;
  const role = (state.role as string) || undefined;
  const colorRole = (state.colorRole as string) || undefined;
  const variant = (state.variant as string) || 'body';
  const tone = (state.tone as string) || 'primary';
  const pill = state.appearance === 'pill';
  const tooltip = hasTooltip ? 'key:tooltip' : undefined;
  // A pill is drawn around content only: a value without a label - an empty channel, a value not
  // yet chosen - shows nothing rather than an empty tinted box.
  const pillRole = text === '' ? undefined : pill ? colorRole ?? roleOfTone(tone) : colorRole;

  if (pillRole) {
    // The pill is the root itself (3b §11, 07.10.): span.tl-pill with the role as data-tl-role and
    // the attributes of the text; no tl-text around it. The pill sets its own type size.
    return (
      <span
        id={controlId}
        className={rootClassName(state, 'tl-pill', 'tl-type-label')}
        data-tl-role={roleAttr(pillRole)}
        role={role}
        data-tooltip={tooltip}
      ><span className="tl-pill__label">{text}</span></span>
    );
  }

  return (
    <span
      id={controlId}
      className={rootClassName(
        state,
        'tl-text',
        TYPE_CLASS[variant] ?? TYPE_CLASS.body,
        state.overflow === 'ellipsis' && 'tl-text--truncate',
      )}
      data-tl-tone={TONE_ATTR[tone]}
      role={role}
      data-tooltip={tooltip}
    >{text}</span>
  );
};

export default TLText;
```

(Die starke Klasse kommt über `rootClassName` nach `tl-type-body` und gewinnt, weil `body-strong` in `base.css` nach `body` steht. Die Pill ist die Wurzel — keine Verschachtelung `span.tl-text > span.tl-pill` mehr, Entscheidung 23; `TLPill` selbst bleibt für Lesewert und Optionen, hier genügt `roleAttr`, weil die Wurzel `id`, `role` und `data-tooltip` trägt.)

- [ ] **Step 5: Altes CSS, Doku** — `tlReactControls.css` (über Überschrift und Selektor, b29546f2ad-Zeilen nur Orientierung): vom Kommentar `/* The text control states how it is drawn as roles …` mit `.tlText` (3180) über `/* --- What the text is for`, `/* --- What the color of the text means`, `/* --- The shape the text takes` bis vor `/* --- TLHtml` (3283) löschen; den Block `/* --- Controls placed on the primary (accent) app bar` mit seinen Kommentaren und `.tlAppBar--primary .tlText--tone-primary` bis vor `/* --- TLBottomBar` (2066–2079) löschen. Danach `grep -n 'tlText' tlReactControls.css` → leer. `docs/faq/react-view-layer.md`: Beispiel 100 `<span class="tl-text tl-type-body tlDemoHeroTitle">`; 121 `` `tl-text--truncate` `` statt `` `tlText--ellipsis` ``; Absatz 158–180 neu: `tone` ohne `accent`, mit `placeholder`; „Every text is a `tl-text` with the type class of its variant (`tl-type-heading-lg` …) and its tone as the attribute `data-tl-tone` (`secondary`, `helper`, `placeholder`, `success`, `warning`, `error`, `on-brand`); the primary tone carries no attribute and inherits the colour of its surroundings, which is how text on the primary app bar reads in the bar's colour. A strong text names the strong type class, `css-class="tl-type-body-strong"`.“; 669 `css-class="tl-type-body-strong"`. Ratsche: drei Text-Blöcke und „Controls placed on the primary (accent) app bar“ streichen, TLTableView sinkt um die neun Zeilen der `.tlText`-Regel; `foreignTl` ohne `--tlText-tone`.

- [ ] **Step 6: Gates, Commit** — `tsc --noEmit` 0, beide Builds; `check-messages-en.sh` (Module react, view, configedit) → Diff committen; Modul-Tests in Abhängigkeitsreihenfolge, je Modul `test` und danach `install`, bevor das nächste läuft: `layout.react` → `layout.configedit` → `layout.view` grün; `git grep -n "tlText\|TextTone.ACCENT\|tone=\"accent\"" -- '*.java' '*.xml' '*.tsx' '*.ts' '*.css' docs/faq` leer. `git commit -m "Ticket #29617: Design System wave 3b -- text reads tl-text: type class per variant, tone as data-tl-tone; the accent tone is gone, placeholder is a tone, strong is the type class"`

### Task E5: Spaltenwahl und Spalten-Layout

**Files:**
- Modify: `react-src/controls/TLColumnSelect.tsx`, `TLColumns.tsx`
- Modify: `tlReactControls.css:3848-3960` (TLColumnSelect), `:1851-1877` (TLColumns); `docs/faq/react-view-layer.md:542`; `design-system/test/ratchet.json`

**Interfaces:**
- Consumes: P4 (`tl-reorder-list`), P6 (`tl-columns`), E2 (`useListReorder` mit Tastatur, `reorderState`, `filterOptions`).

- [ ] **Step 1: TLColumnSelect** — Import und Glyphen:

```tsx
import { React, useTLState, useTLCommand, useI18N, useListReorder, reorderState, filterOptions, rootClassName, tooltipProps, ThemeIcon } from 'tl-react-bridge';
import type { TLCellProps } from 'tl-react-bridge';
import { buttonClassName } from './button/ButtonDefaults';

/** The glyphs of the handle, the search and the grouping button. */
const HANDLE_ICON = 'css:fa-solid fa-grip-vertical';
const SEARCH_ICON = 'css:fa-solid fa-magnifying-glass';
const GROUP_ICON = 'css:fa-solid fa-layer-group';
```

die Suche:

```tsx
  const [search, setSearch] = React.useState('');
  const matches = new Set(filterOptions(entries, search));
  const shown = entries.map((entry, index) => ({ entry, index })).filter(({ entry }) => matches.has(entry));
```

(der Kommentar über die Position in der ganzen Liste bleibt), der Hook aus E2 (mit `keyOf` nach `entry.name`) mit Kommentar „The whole row is dragged by the pointer; its handle is the button the keyboard moves it with (Alt + arrow, announced in the live region; the focus stays on the moved entry's handle).“, und das `return` (das Spread `{...handle}` bringt `onKeyDown`, `aria-*` und den `ref` der Fokusrückgabe; der Griff setzt keinen eigenen `ref`):

```tsx
  return (
    <div id={controlId} className={rootClassName(state)} {...reorder.containerProps}>
      {searchable && (
        <span className="tl-field-group tl-reorder-list__search">
          <span className="tl-field-group__icon" aria-hidden="true">
            <ThemeIcon encoded={SEARCH_ICON} className="tl-icon-sm" />
          </span>
          <input
            type="search"
            className="tl-field tl-type-body"
            placeholder={i18n['js.table.columnSearch']}
            aria-label={i18n['js.table.columnSearch']}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </span>
      )}
      <ul className="tl-reorder-list tl-type-body">
        {shown.map(({ entry, index }) => {
          // Keep the table from losing its last column: there would be nothing left to click.
          const lastVisible = entry.visible && visibleCount <= 1;
          const groupByLabel = entry.grouped ? i18n['js.table.ungroup'] : i18n['js.table.groupBy'];
          const handle = reorder.handleProps(index);
          return (
            <li
              key={entry.name}
              className="tl-reorder-list__item"
              data-tl-state={reorderState(reorder.itemState(index))}
              {...reorder.itemProps(index)}
            >
              <button
                type="button"
                className={buttonClassName({ appearance: 'ghost', small: true, icon: true, extra: 'tl-reorder-list__handle' })}
                {...tooltipProps(handle['aria-label'])}
                {...handle}
              >
                <ThemeIcon encoded={HANDLE_ICON} className="tl-button__icon tl-icon-sm" />
              </button>
              <button
                type="button"
                className={buttonClassName({ appearance: 'ghost', small: true, icon: true })}
                aria-label={groupByLabel}
                {...tooltipProps(groupByLabel)}
                aria-pressed={entry.grouped}
                onClick={() => handleGroupBy(entry.name)}
              >
                <ThemeIcon encoded={GROUP_ICON} className="tl-button__icon tl-icon-sm" />
              </button>
              <label className="tl-choice">
                <input
                  type="checkbox"
                  className="tl-checkbox"
                  checked={entry.visible}
                  disabled={lastVisible}
                  onChange={(e) => handleToggle(entry.name, e.target.checked)}
                />
                <span className="tl-reorder-list__label">{entry.label}</span>
              </label>
            </li>
          );
        })}
      </ul>
      {reorder.announcer}
    </div>
  );
```

Die Klassenkomponente-Doku oben: „…the columns as a `tl-reorder-list`: dragged by the row, moved with Alt + arrow on the handle…“.

- [ ] **Step 2: TLColumns** — ganz ersetzen:

```tsx
import { React, useTLState, TLChild, rootClassName } from 'tl-react-bridge';
import type { TLCellProps } from 'tl-react-bridge';

/** The gaps the design system has a modifier for (columns.css); anything else is the default. */
const GAPS = new Set(['compact', 'default', 'loose']);

/**
 * A page layout of columns whose widths follow a weight, and that stack below a breakpoint (design
 * system: tl-columns).
 *
 * State:
 * - weights: number[]  (the width share of each column, in the order of the children; default: 1)
 * - breakpoint: string  (CSS length the columns stack below, default: "48rem")
 * - gap: "compact" | "default" | "loose"  (default: "default")
 * - children: ChildDescriptor[]  (one child per column)
 *
 * The flex basis of a column is the width the breakpoint leaves over the current container width,
 * scaled up steeply: data from the state, set inline (columns.css explains the formula).
 */
const TLColumns: React.FC<TLCellProps> = ({ controlId }) => {
  const state = useTLState();

  const weights = (state.weights as number[]) ?? [];
  const breakpoint = (state.breakpoint as string) ?? '48rem';
  const gap = GAPS.has(state.gap as string) ? (state.gap as string) : 'default';
  const children = (state.children as unknown[]) ?? [];

  return (
    <div id={controlId} className={rootClassName(state, 'tl-columns', `tl-columns--gap-${gap}`)}>
      {children.map((child, i) => (
        <div
          key={i}
          className="tl-columns__column"
          style={{ flex: `${weights[i] ?? 1} 1 calc((${breakpoint} - 100%) * 999)` }}
        >
          <TLChild control={child} />
        </div>
      ))}
    </div>
  );
};

export default TLColumns;
```

- [ ] **Step 3: Altes CSS, Doku, Ratsche** — über die Überschriften (b29546f2ad-Zeilen nur Orientierung): Block `/* --- TLColumnSelect` bis vor `/* --- TLRelativeTime` (3848–3960) und Block `/* --- TLColumns` bis vor `/* --- TLDeckPane` (1851–1877) löschen; `grep -n 'tlColumnSelect\|tlColumns' tlReactControls.css` → leer. `react-view-layer.md:542`: „…against are `.tl-columns`, `.tl-columns--gap-<gap>` and `.tl-columns__column` (design system, `columns.css`)…“. Ratsche: TLColumnSelect und TLColumns streichen.

- [ ] **Step 4: Prüfen, Commit** — `tsc --noEmit` 0, beide Builds, `layout.react` grün (`TestReactColumnsControl`), `git grep -n "tlColumnSelect\|tlColumns" -- 'com.top_logic.*/react-src' '*.css' docs/faq` leer. `git commit -m "Ticket #29617: Design System wave 3b -- column selection is a tl-reorder-list (keyboard reorder, filterOptions, tl-field-group search); columns read tl-columns"`

### Task E6: Baum

**Files:**
- Modify: `react-src/controls/TLTreeView.tsx`
- Modify: `I18NConstants.java` (Block „Tree“), `messages_de.properties`; `tlReactControls.css:4084-4204`; `design-system/test/ratchet.json`

**Interfaces:**
- Consumes: P5, P8, E2 (`useTokenPx`, `stateAttr`), `dropPositionAt`, `ProgressBar` aus `TLProgress.tsx`.

- [ ] **Step 1: Konstanten** — Import `import { React, useTLState, useTLCommand, TLChild, rootClassName, stateAttr, useTokenPx, dropPositionAt, useI18N, tooltipProps, ThemeIcon } from 'tl-react-bridge';` und `import { ProgressBar } from './TLProgress';`; `I18N_KEYS` um `'js.tree.label': 'Tree'` und `'js.tree.loading': 'Loading entries\u2026'`; `INDENT_PX` ersetzen:

```tsx
/** The glyph of the expand toggle (tl-toggle): right is closed, the toggle turns it down when open. */
const CHEVRON_ICON = 'css:fa-solid fa-chevron-right';

/** The indent of a level until the token is read: the toggle's width, size-control-sm. */
const INDENT_FALLBACK_PX = 24;

/** The server's names of the three drop positions (ReactTreeControl), by the shared calculator's. */
const SERVER_POSITION = { before: 'above', onto: 'within', after: 'below' } as const;

/** The data-tl-state word (drag.css) of a drop position the server reports. */
const DROP_STATE: Record<string, string> = { above: 'drop-before', within: 'drop-onto', below: 'drop-after' };
```

- [ ] **Step 2: Logik** — `const TLTreeView: React.FC<TLCellProps> = ({ controlId }) => {`; nach `listRef`:

```tsx
  // One level indents by the width of the toggle, so each child stands under its parent's label; read
  // from the token, so the indent follows the density.
  const indent = useTokenPx(listRef, '--tl-size-control-sm', INDENT_FALLBACK_PX);
  const nodeId = (id: string) => `${controlId}-node-${id}`;
```

`scrollIntoView`-Selektoren: `'[role="treeitem"][aria-selected="true"]'` und `'[data-tl-state~="cursor"]'`; `computeDropPosition` über den gemeinsamen Rechner:

```tsx
  // The shared calculator (thirds: before, onto, after), in the server's names.
  const computeDropPosition = React.useCallback((e: React.DragEvent, element: HTMLElement): string => {
    const position = dropPositionAt(e.clientY, element);
    return position === 'none' ? 'within' : SERVER_POSITION[position];
  }, []);
```

- [ ] **Step 3: Markup** — das `return` ersetzen:

```tsx
  const cursorNode = cursorIndex >= 0 ? nodes[cursorIndex] : undefined;

  return (
    <ul
      ref={listRef}
      role="tree"
      aria-label={i18n['js.tree.label']}
      aria-multiselectable={isMulti || undefined}
      aria-activedescendant={cursorNode ? nodeId(cursorNode.id) : undefined}
      className={rootClassName(state, 'tl-tree', 'tl-type-body')}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {nodes.map((node, index) => (
        <React.Fragment key={node.id}>
          <li
            id={nodeId(node.id)}
            role="treeitem"
            aria-expanded={node.expandable ? node.expanded : undefined}
            aria-selected={node.selected}
            aria-level={node.depth + 1}
            aria-busy={node.loading || undefined}
            className="tl-tree__node"
            data-tl-state={stateAttr(
              index === cursorIndex && 'cursor',
              dropIndicatorNodeId === node.id && dropIndicatorPosition ? DROP_STATE[dropIndicatorPosition] : undefined,
            )}
            style={{ paddingLeft: node.depth * indent }}
            draggable={dragEnabled}
            onMouseDown={(e) => {
              // Suppress the text selection the browser would start as a side
              // effect of node-selection gestures (shift/ctrl range or toggle,
              // double-click); plain click-and-drag still selects label text.
              if (e.shiftKey || e.ctrlKey || e.metaKey || e.detail > 1) {
                e.preventDefault();
              }
            }}
            onClick={(e) => handleSelect(node.id, e)}
            onDoubleClick={() => handleActivate(node.id)}
            onContextMenu={(e) => handleContextMenu(node.id, e)}
            onDragStart={(e) => handleDragStart(node.id, e)}
            onDragOver={dropEnabled ? (e) => handleDragOver(node.id, e) : undefined}
            onDrop={dropEnabled ? (e) => handleDrop(node.id, e) : undefined}
            onDragEnd={handleDragEnd}
          >
            {node.expandable ? (
              <button
                type="button"
                className="tl-toggle"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggle(node.id, node.expanded);
                }}
                tabIndex={-1}
                aria-expanded={node.expanded}
                aria-label={toggleLabel(i18n, node.expanded)}
                {...tooltipProps(toggleLabel(i18n, node.expanded))}
              >
                <ThemeIcon encoded={CHEVRON_ICON} className="tl-icon-sm" />
              </button>
            ) : (
              <span className="tl-tree__spacer" />
            )}
            <span className="tl-tree__content">
              <TLChild control={node.content} />
            </span>
          </li>
          {/* The children are on their way: a status line one level deeper, with an indeterminate
              progress - the one sign of loading the design system has. A tree owns tree items only,
              so the line is one, named for what it says; it is no cursor stop (no id, never the
              active descendant). */}
          {node.loading && (
            <li
              role="treeitem"
              aria-level={node.depth + 2}
              aria-label={i18n['js.tree.loading']}
              className="tl-status"
              style={{ paddingLeft: (node.depth + 1) * indent + indent }}
            >
              <ProgressBar fraction={null} />
            </li>
          )}
        </React.Fragment>
      ))}
    </ul>
  );
```

- [ ] **Step 4: Keys, altes CSS, Ratsche** — `I18NConstants.java` nach `JS_TREE_VIEW_COLLAPSE`: `@en Tree` → `@CustomKey("js.tree.label") public static ResKey JS_TREE_LABEL;` und `@en Loading entries\u2026` → `@CustomKey("js.tree.loading") public static ResKey JS_TREE_LOADING;` (der Name der Ladezeile, Plan-Review M3); `messages_de.properties`: `js.tree.label = Baum`, `js.tree.loading = Einträge werden geladen…`; `check-messages-en.sh` → Diff committen (nie von Hand). Block `/* --- TLTreeView` bis vor `/* --- TLSlider` (b29546f2ad: 4084–4204) löschen; Ratsche streichen.

- [ ] **Step 5: Prüfen, Commit** — `tsc --noEmit` 0, beide Builds, `layout.react` grün (`TestReactTreeControlSelection`), `git grep -n "tlTreeView\|tlTreeSpin" -- 'com.top_logic.*/react-src' '*.css'` leer, `git grep -n 'role="none"\|aria-controls' -- com.top_logic.layout.react/react-src/controls/TLTreeView.tsx` leer. `git commit -m "Ticket #29617: Design System wave 3b -- tree reads tl-tree: aria-activedescendant cursor, tl-toggle, indent from the token, a named tl-status tree item while children load, the shared drop calculator"`

### Task E7: Tabelle I — Raster, Körper, Zeilenhöhe, Auswahl, Baum- und Gruppenzeilen, leer und lädt

**Files:**
- Modify: `react-src/controls/TLTableView.tsx` (Import 1–4, Tastatur 12–43, `I18N_KEYS` 45–62, Zustand 302–345, `handleRowClick` 843–845, Expand 1031–1035, Scroll 596–614, Render ab 1243 für Wurzel, Rahmen, Raster, Körper)
- Modify: `src/main/java/com/top_logic/layout/react/control/table/TableViewControl.java:178,539`, `I18NConstants.java` (Block „Table“), `messages_de.properties`
- Modify: `tlReactControls.css` (s. Step 6); `design-system/test/ratchet.json`
- Test: `com.top_logic.layout.react/src/test/java/test/com/top_logic/layout/react/control/table/TestPinnedColumns.java`

**Interfaces:**
- Consumes: P5, P7, E2 (`useTokenPx`, `stateAttr`), `tl-toggle`, `tl-checkbox`, `tl-status`, `tl-skeleton`.
- Produces (für E8/E9 im selben File): `gridRef`, `frameRef`, `rowHeight`, `checkboxWidth`, `treeIndentWidth`, `columnsButtonWidth`, `treegrid`, `rowId(index)`, `placeOf(colIdx) → { isFrozen, isPinned, words }`, `widthStyle(colIdx, w, isFrozen)`, `dropWord(row)`, `ICON`.

- [ ] **Step 1: Java-Test (rot)** — `TestPinnedColumns.java`: Konstante `/** State key the client once read the row height from. */ private static final String ROW_HEIGHT = "rowHeight";` und

```java
	/**
	 * Tests that the server sends no row height: the client reads it from the design system's
	 * {@code --tl-size-row}, so the table follows the density.
	 */
	public void testClientMeasuresTheRowHeight() {
		assertNull("The row height is the client's (--tl-size-row).", control().clientState(ROW_HEIGHT));
	}
```

`$MVN test -DskipTests=false -pl com.top_logic.layout.react -Dtest=test.com.top_logic.layout.react.control.table.TestPinnedColumns` → FAIL (`36`).

- [ ] **Step 2: Java** — `TableViewControl.java`: Konstante `ROW_HEIGHT` (178) und `putState(ROW_HEIGHT, Integer.valueOf(36));` (539) löschen. `I18NConstants.java` im Block „Table“: `@en Select all rows` → `js.table.selectAll` (`JS_TABLE_SELECT_ALL`), `@en Select this row` → `js.table.selectRow`, `@en No entries` → `js.table.empty`. `messages_de.properties`: `js.table.selectAll = Alle Zeilen auswählen`, `js.table.selectRow = Diese Zeile auswählen`, `js.table.empty = Keine Einträge`. Derselbe Testaufruf → grün.

- [ ] **Step 3: TSX — Kopf der Datei und Zustand** — Import:

```tsx
import { React, useTLState, useTLCommand, TLChild, useI18N, KeyboardScopeProvider, useKeyboardBinding, writeDragPayload, runningDrag, onDragEnd, readDragPayload, dragTypeAccepted, dropPositionAt, startPointerDrag, useFill, rootClassName, stateAttr, useTokenPx, useListReorder, reorderState, usePopover, ThemeIcon, tooltipProps, TOOLTIP_WHEN_CLIPPED, createPortal } from 'tl-react-bridge';
import type { TLCellProps, TLDropPosition, TLRunningDrag } from 'tl-react-bridge';
import { isInteractiveTarget } from './interactive';
import { Menu, MenuItem } from './menu/Menu';
import { buttonClassName } from './button/ButtonDefaults';

// The glyphs of the table (Font Awesome Free through ThemeIcon; no glyph is a text character).
const ICON = {
  sortAsc: 'css:fa-solid fa-arrow-up',
  sortDesc: 'css:fa-solid fa-arrow-down',
  filter: 'css:fa-solid fa-filter',
  grouped: 'css:fa-solid fa-layer-group',
  columns: 'css:fa-solid fa-gear',
  toggle: 'css:fa-solid fa-chevron-right',
  search: 'css:fa-solid fa-magnifying-glass',
  clear: 'css:fa-solid fa-xmark',
  save: 'css:fa-regular fa-bookmark',
  confirm: 'css:fa-solid fa-check',
  cancel: 'css:fa-solid fa-xmark',
};
```

(`useListReorder`, `reorderState`, `usePopover` liest erst E8/E9 — der Import darf vorab stehen.) `TableKeyBindings` bekommt `onExpand: (expanded: boolean) => void` und `onGrid: () => boolean` (Props-Typ und Destrukturierung) und vor den übrigen Bindungen:

```tsx
  // Right opens the cursor row of a tree or group, left closes it - as in the tree. Where there is
  // nothing to open or close, the arrows scroll the body sideways (the focus is on the grid, not on
  // the scrolling body). Only while the grid itself has the focus: a dropdown, a checkbox, a chip or
  // a button in the table keeps its arrows.
  useKeyboardBinding('ArrowRight', () => { if (!onGrid()) { return false; } onExpand(true); return true; });
  useKeyboardBinding('ArrowLeft', () => { if (!onGrid()) { return false; } onExpand(false); return true; });
```

und die Leertaste (Kommentar und Bindung 36–37 ersetzen) ebenso nur am Raster — sonst wählte die Leertaste am Sortierknopf (E8) oder an einem Kästchen in einer Zelle die Cursorzeile, statt den Knopf zu drücken (Plan-Review Punkt 10):

```tsx
  // Space toggles the cursor row - on the grid only: on a button or a checkbox in the table it is
  // that control's. Ctrl+A selects all (multi only).
  useKeyboardBinding('Space', () => { if (cursorIndex < 0 || !onGrid()) { return false; } onToggle(); return true; });
```

`I18N_KEYS` vorn: `'js.table.selectAll': 'Select all rows', 'js.table.selectRow': 'Select this row', 'js.table.empty': 'No entries', 'js.treeView.expand': 'Expand', 'js.treeView.collapse': 'Collapse',`. Nach `rootRef`:

```tsx
  // The grid (role=grid) holds the keyboard focus and points at the cursor row with
  // aria-activedescendant; the body inside it only scrolls.
  const gridRef = React.useRef<HTMLDivElement>(null);
  const frameRef = React.useRef<HTMLDivElement>(null);
  // Whether the keyboard focus is on the grid itself, not on a control within it (Left, Right, Space).
  const isGridFocused = React.useCallback(() => document.activeElement === gridRef.current, []);
```

und am Element `<TableKeyBindings … onGrid={isGridFocused} />`.

`rowHeight` (312) und die Breiten (338–339) ersetzen:

```tsx
  // The client measures what the design system says (3b §3): a row is size-row high, so the table
  // follows the density (36 px normal, 32 px compact). The server knows no height.
  const rowHeight = useTokenPx(gridRef, '--tl-size-row', 36);
```

```tsx
  const isMulti = selectionMode === 'multi';
  // The selection column is a square as high as the heading (size-bar); a tree level indents by the
  // width of its toggle (size-control-sm), so a child stands under its parent's label; the column
  // button is a control-sized square.
  const checkboxWidth = useTokenPx(gridRef, '--tl-size-bar', 40);
  const treeIndentWidth = useTokenPx(gridRef, '--tl-size-control-sm', 24);
  const columnsButtonWidth = useTokenPx(gridRef, '--tl-size-control', 32);
  const treegrid = treeMode || grouping !== '';
  const rowId = (index: number) => `${controlId}-row-${index}`;
```

`buttonReserve` (1232): `columnSelect && !cogInHeaderCell ? columnsButtonWidth : 0`. `handleRowClick` 844: `gridRef.current?.focus({ preventScroll: true });`. Der Effekt, der nach einem Klick in eine Zelle den Editor öffnet (Pending-Focus, 939–971), fragt in 958, ob der Fokus noch in der Tabelle ist — bisher am Körper; der Fokus liegt nach dem Klick jetzt am Raster, den Eltern des Körpers, und der Editor öffnete nie (Plan-Review M1). 955–960 ersetzen:

```tsx
    // A click that opened a control of its own (a dropdown's option list, a date picker) has moved
    // the focus out of the table on purpose; taking it back would close what was just opened. The
    // clicked row has given the focus to the grid (A2), which holds the body.
    const active = document.activeElement;
    if (active && active !== document.body && !gridRef.current?.contains(active)) {
      return;
    }
```

(`handleBodyKeyDown` 983 bleibt bei `body.contains(active)`: dort ist der Fokus in einer Zelle.) `measureColumnContentWidth` 190/205: Selektoren `'.tl-table__header-cell, .tl-table__cell'` und `'.tl-table__resize'`; `dropTargetAt` 715: `closest('.tl-table__row')`.

- [ ] **Step 4: TSX — Fenster, Scrollen, Expand** — vor `handleScroll`:

```tsx
  // -- The rows the body shows right now, by index: what the server has not sent of them yet is drawn
  //    as a skeleton row, and the grid is aria-busy until it has. Updated when the range changes, not
  //    on every scrolled pixel. --
  const [windowRange, setWindowRange] = React.useState<{ first: number; last: number }>({ first: 0, last: -1 });
  const measureWindow = React.useCallback(() => {
    const body = scrollContainerRef.current;
    if (!body || rowHeight <= 0) return;
    const first = Math.floor(body.scrollTop / rowHeight);
    const last = Math.min(totalRowCount - 1, Math.ceil((body.scrollTop + body.clientHeight) / rowHeight) - 1);
    setWindowRange((p) => (p.first === first && p.last === last ? p : { first, last }));
  }, [rowHeight, totalRowCount]);
  React.useLayoutEffect(measureWindow, [measureWindow]);
```

in `handleScroll` nach dem Kopf-Abgleich `measureWindow();`, Abhängigkeiten `[sendCommand, rowHeight, measureWindow]`, danach:

```tsx
  // A density switch changes the row height: the rows the server sends for the viewport change with
  // it. Not on mount - the height has not switched, and a scroll command then would only repeat the
  // window the server already sent.
  const reportedRowHeightRef = React.useRef(rowHeight);
  React.useEffect(() => {
    if (reportedRowHeightRef.current === rowHeight) {
      return;
    }
    reportedRowHeightRef.current = rowHeight;
    if (scrollContainerRef.current) {
      handleScroll();
    }
  }, [rowHeight]);
```

nach `handleExpand`:

```tsx
  // Right and left at the cursor: open or close its tree or group row; where there is nothing to open
  // or close, scroll the body sideways by a control's width.
  const handleExpandCursor = React.useCallback((expanded: boolean) => {
    const row = rows.find((r) => r.index === cursorIndex);
    if (row?.expandable && row.expanded !== expanded) {
      sendCommand('expand', { rowIndex: row.index, expanded });
      return;
    }
    const body = scrollContainerRef.current;
    if (body) {
      body.scrollLeft += expanded ? columnsButtonWidth : -columnsButtonWidth;
    }
  }, [rows, cursorIndex, sendCommand, columnsButtonWidth]);
```

und `onExpand={handleExpandCursor}` an `TableKeyBindings`.

- [ ] **Step 5: TSX — Render von Wurzel, Rahmen, Raster und Körper** — vor dem `return`:

```tsx
  // The cursor row as the grid's active descendant: only while it is rendered, otherwise the grid
  // keeps the ring itself (base.css).
  const cursorRendered = cursorIndex >= 0 && rows.some((r) => r.index === cursorIndex);

  // The rows of the visible window the server has not sent yet: skeleton rows of row height.
  const sentIndexes = new Set(rows.map((r) => r.index));
  const missing: number[] = [];
  for (let i = windowRange.first; i <= windowRange.last; i++) {
    if (!sentIndexes.has(i)) missing.push(i);
  }

  // Where a cell sits relative to the scrolling area: frozen at the start, pinned at the end. A state
  // of its location (data-tl-state), not of the user's handling of it.
  const placeOf = (colIdx: number) => {
    const col = columns[colIdx];
    const isFrozen = colIdx < frozenColumnCount;
    const isPinned = !!col.pinnedEnd;
    return {
      isFrozen,
      isPinned,
      words: [
        isFrozen && 'frozen',
        colIdx === frozenColumnCount - 1 && 'frozen-last',
        isPinned && 'pinned',
        isPinned && colIdx === lastUnpinnedIdx + 1 && 'pinned-first',
      ],
    };
  };

  // The width a cell takes: the last column the user arranges takes the space left over, in the
  // heading exactly as in the rows; the configured width is the flex basis, so cell and heading are
  // the same width whatever either of them holds.
  const widthStyle = (colIdx: number, w: number, isFrozen: boolean): React.CSSProperties =>
    colIdx === lastUnpinnedIdx && !isFrozen ? { flex: `1 0 ${w}px`, minWidth: w } : { width: w, minWidth: w };

  const dropWord = (row: RowState) =>
    dropState && dropState.row === row.id ? (dropRefused ? 'drop-refused' : 'drop-' + dropState.position) : undefined;
```

Wurzel: `className={rootClassName(state, 'tl-table', fillClass)}` und `data-tl-state={dropState && dropState.row === null ? (dropRefused ? 'drop-refused' : 'drop-onto') : undefined}` (statt der zwei Modifier). Die Filterleiste bleibt bis E9 unverändert. Um Kopf und Körper:

```tsx
      <div className="tl-table__frame" ref={frameRef}>
      <div
        ref={gridRef}
        className="tl-table__grid"
        role={treegrid ? 'treegrid' : 'grid'}
        // Heading plus rows; an empty table counts its status row (aria-rowindex 2).
        aria-rowcount={Math.max(totalRowCount, 1) + 1}
        aria-colcount={columns.length + (isMulti ? 1 : 0)}
        aria-multiselectable={isMulti || undefined}
        aria-busy={missing.length > 0 || undefined}
        aria-activedescendant={cursorRendered ? rowId(cursorIndex) : undefined}
        tabIndex={0}
      >
```

— darin der bisherige Kopf (bis E8 unverändert, aber **ohne** den Wrapper `tlTableView__headerArea`: `headerAreaRef` fällt, `handleFrozenSplitStart` liest `frameRef.current`; Fixiergrenze, Spaltenknopf und Vorschau rücken hinter das Raster in den Rahmen) und der Körper:

```tsx
      {/* Scrollable body; the focus stays on the grid. tabIndex -1: Chromium makes a scrolling
          element without one a tab stop of its own. */}
      <div
        ref={scrollContainerRef}
        className="tl-table__body tl-type-body"
        role="rowgroup"
        tabIndex={-1}
        onScroll={handleScroll}
        onKeyDown={handleBodyKeyDown}
      >
        {totalRowCount === 0 && (
          <div role="row" aria-rowindex={2}>
            <div role="gridcell" className="tl-status">{i18n['js.table.empty']}</div>
          </div>
        )}
        {/* Spacer for virtual scrolling; the reserve is padding, so it widens the scroll range without
            taking any cell along. */}
        <div className="tl-table__canvas" style={{ height: totalHeight, minWidth: tableWidth, paddingRight: buttonReserve }}>
          {missing.map((index) => (
            <div key={'skeleton-' + index} className="tl-table__placeholder" aria-hidden="true"
              style={{ position: 'absolute', top: index * rowHeight, height: rowHeight, left: 0, right: 0 }}>
              <span className="tl-skeleton" />
            </div>
          ))}
          {rows.map((row) => (
            <div
              key={row.id}
              id={rowId(row.index)}
              role="row"
              aria-rowindex={row.index + 2}
              aria-selected={row.selected}
              aria-level={treegrid ? (row.treeDepth ?? 0) + 1 : undefined}
              aria-expanded={treegrid && row.expandable ? !!row.expanded : undefined}
              data-drop-row={row.id}
              draggable={dragEnabled && row.draggable !== false}
              className={'tl-table__row' + (row.groupCount != null ? ' tl-type-body-strong' : '')}
              data-tl-state={stateAttr(row.index === cursorIndex && 'cursor', dropWord(row))}
              style={{
                position: 'absolute',
                top: row.index * rowHeight,
                height: rowHeight,
                // Spans the spacer, hence the body, so a pinned cell reaches its right edge. The cells
                // stop in front of the reserve, exactly as the header's do.
                left: 0,
                right: 0,
                paddingRight: buttonReserve,
              }}
```

(`onMouseDown`, `onClick`, `onDragStart`, `onDragEnd`, `onDoubleClick` wie bisher.) Auswahlzelle:

```tsx
              {isMulti && (
                <div role="gridcell"
                  className="tl-table__cell tl-table__select"
                  data-tl-state={stateAttr(frozenColumnCount > 0 && 'frozen')}
                  style={{ width: checkboxWidth, minWidth: checkboxWidth, ...(frozenColumnCount > 0 ? { left: 0 } : {}) }}
                  onClick={(e) => e.stopPropagation()}>
                  {row.groupCount == null && (
                    // Space at the cursor selects; the box is no stop of its own in the tab order.
                    <input
                      type="checkbox"
                      className="tl-checkbox"
                      aria-label={i18n['js.table.selectRow']}
                      checked={row.selected}
                      onChange={() => {/* handled by onClick */}}
                      onClick={(e) => handleCheckboxClick(row.index, e)}
                      tabIndex={-1}
                    />
                  )}
                </div>
              )}
```

Zelle (statt 1610–1681):

```tsx
              {columns.map((col, colIdx) => {
                const w = getColWidth(col);
                const { isFrozen, isPinned, words } = placeOf(colIdx);
                const isTreeColumn = treeMode && colIdx === 0;
                const treeDepth = row.treeDepth ?? 0;
                // What the cell says: the tooltip of its content where it has one, its own text while
                // the column is too narrow to read it otherwise. In the tree column the declaration
                // sits on the value, so the toggle and the group size stay out of it.
                const cellTooltip = row.tooltips?.[col.name];
                const cellTooltipProps = cellTooltip ? tooltipProps(cellTooltip) : TOOLTIP_WHEN_CLIPPED;
                const toggleLabel = row.expanded ? i18n['js.treeView.collapse'] : i18n['js.treeView.expand'];
                return (
                  <div
                    key={col.name}
                    role="gridcell"
                    className={'tl-table__cell' + (col.cssClass ? ' ' + col.cssClass : '')}
                    data-row={row.id}
                    data-col={col.name}
                    data-tl-state={stateAttr(...words)}
                    {...(isTreeColumn ? {} : cellTooltipProps)}
                    style={{
                      ...widthStyle(colIdx, w, isFrozen),
                      ...(isFrozen ? { left: frozenOffsets[colIdx] } : {}),
                      ...(isPinned ? { right: pinnedOffsets[colIdx] + buttonReserve } : {}),
                    }}
                  >
                    {isTreeColumn ? (
                      <div className="tl-table__tree" style={{ paddingLeft: treeDepth * treeIndentWidth }}>
                        {row.expandable ? (
                          <button
                            type="button"
                            className="tl-toggle"
                            tabIndex={-1}
                            aria-expanded={!!row.expanded}
                            aria-label={toggleLabel}
                            {...tooltipProps(toggleLabel)}
                            onClick={(e) => handleExpand(row.index, !row.expanded, e)}
                          >
                            <ThemeIcon encoded={ICON.toggle} className="tl-icon-sm" />
                          </button>
                        ) : (
                          <span className="tl-table__spacer" />
                        )}
                        {/* A row that predates the current columns has no control for a newly shown
                            column yet - leave that cell empty rather than tearing down the table. */}
                        <span className="tl-table__value" {...cellTooltipProps}>
                          {!!row.cells[col.name] && <TLChild control={row.cells[col.name]} />}
                        </span>
                        {row.groupCount != null && (
                          <span className="tl-table__count tl-type-label">({row.groupCount})</span>
                        )}
                      </div>
                    ) : (
                      !!row.cells[col.name] && <TLChild control={row.cells[col.name]} />
                    )}
                  </div>
                );
              })}
```

Raster und Rahmen schließen: nach dem Körper `</div>` (Raster), dann die Fixiergrenze, der Spaltenknopf (ohne `cogInHeaderCell`) und die Vorschau `className="tl-table__freeze-preview"`, dann `</div>` (Rahmen); das Spaltenmenü bleibt danach in der Wurzel. Die Vorschau und den Griff stellt E8 auf die Paketklassen um; bis dahin stehen sie mit ihren alten Klassen im Rahmen.

- [ ] **Step 6: Altes CSS, Übergangsblock, Ratsche** — in `tlReactControls.css` über Kommentar und Selektor löschen (b29546f2ad-Zeilen nur Orientierung; E2 und E4 haben davor gelöscht), von unten nach oben: (a) von `/* -- Tree table -- */` bis vor `/* Marks the column header the rows are grouped by. */` (3781–3840; `.tlTableView__groupMark` bleibt bis E8); (b) von `/* -- Frozen columns -- */` bis vor `/* Grip to drag the boundary of the frozen area …` (3677–3737: fixiert, angeheftet, `tlRowCommandCell`); (c) die Regeln `.tlTableView__checkboxCell` und `.tlTableView__checkbox` direkt nach `.tlJobStatus__error` (3565–3575; der Kopf liest sie bis E8 noch — dazwischen ist sein Kästchen ungestylt, gepusht wird erst nach E9); (d) von `.tlTableView__body {` bis vor `/* --- TLHtml` (2988–3179, endet mit `.tlTableView__cell:last-child`); (e) den Kommentar `/* The table always fills …` und die Regel `.tlTableView { … }` bis vor `/* The filter bar above the column headings …` (2695–2708). Vor der Überschrift `/* --- TLTableView` einfügen:

```css
/* --- Table cells holding legacy controls (until waves 4 and 5) ------------ */

/* Cell rules that read classes of controls not yet migrated: they read the design system's cell
   (tl-table__cell) and leave with their controls. A value beside an adornment - the language button
   of an internationalized text - sits in a row with it that follows the column width. */
.tl-table__cell > .tlStack--row {
	width: 100%;
	min-width: 0;
}

.tl-table__cell > .tlStack--grow-first.tlStack--row > *:first-child {
	overflow: hidden;
	text-overflow: ellipsis;
}

/* In a cell, a text of several values reads as the one line the row is high. */
.tl-table__cell .tlValueList--block .tlValueList__item,
.tl-table__cell .tlValueList--block .tlValueList__separator {
	display: inline;
}

/* A column offering a command on every row (RowCommandColumn.CSS_CLASS): the button is ghost and
   small, carrying its own frame, so the column needs none of its own. */
.tl-table__cell.tlRowCommandCell,
.tl-table__header-cell.tlRowCommandCell {
	padding: 0;
	justify-content: center;
}
```

Ratsche: neuer Block „Table cells holding legacy controls (until waves 4 and 5)“, TLTableView und TLJobStatus sinken, `literals` mitsenken (Zahlen aus `inventory.mjs`); `_blocks`-Vermerk.

- [ ] **Step 7: Prüfen, Commit** — `tsc --noEmit` 0, beide Builds; `layout.react` grün (`TestPinnedColumns`, `TestTableGrouping`, `TestTableTooltips`, `TestTableSelectionRetention`, `TestTableViewDragDrop`, `TestReactStylesheetTokens`); `check-messages-en.sh` → Diff committen. Greps nur auf das, was E7 entfernt (Plan-Review B1: ein Grep über `rowHeight` kann nie leer sein — die neue lokale `const rowHeight` aus `useTokenPx` und das Dashboard, `TLDashboard.tsx:161` und `ReactDashboardControl.java:40`, mit eigenem Zustandsschlüssel für die Kachelhöhe, bleiben; `tlTableView__checkbox` steht bis E8 im Kopf, die Zeilen-Ziehregeln 3618–3665 bis E9). Alle vier → leer (vorgeprüft gegen `b29546f2ad`: heute treffen sie genau die Zeilen und Regeln, die E7 ändert oder löscht):

```bash
cd $WT
# kein rowHeight im Zustand der Tabelle (Spec §13), weder gesendet noch gelesen
git grep -n "ROW_HEIGHT" -- com.top_logic.layout.react/src/main/java/com/top_logic/layout/react/control/table/TableViewControl.java
git grep -n "state\.rowHeight" -- com.top_logic.layout.react/react-src/controls/TLTableView.tsx
# die Klassen von Wurzel, Körper, Zeile, Zelle und Baumzelle im TSX
git grep -nP "tlTableView__(row|cell|body|treeCell|treeToggle|treeToggleSpacer|treeValue|groupCount)\b|tlTableView--(dragover|dropRefused)|'tlTableView\b(?!_)|tlTableView__headerArea" -- com.top_logic.layout.react/react-src/controls/TLTableView.tsx
# ihre Regeln im alten Stylesheet (ohne Kopf, Griffe und Zeilen-Ziehregeln, die E8/E9 entfernen)
git grep -nP '\.tlTableView__(cell|treeCell|treeToggle|treeToggleSpacer|treeValue|groupCount|body|checkboxCell|checkbox)\b|\.tlTableView__row(--(selected|cursor|group)\b|:hover|\s*\{|\s*,)|\.tlTableView\s*\{' -- com.top_logic.layout.react/src/main/webapp/style/tlReactControls.css
```

(`git grep -P`, weil `git grep -E` unter macOS weder `\b` noch `\s` kennt.) `git commit -m "Ticket #29617: Design System wave 3b -- table grid and body: role=grid with aria-activedescendant, rows of size-row measured by the client (rowHeight state gone), tl-checkbox selection, tl-toggle tree rows, empty status and skeleton rows"`

### Task E8: Tabelle II — Kopf: Sortieren, Filter, Spaltenwahl, Griffe, Spaltenzug

**Files:**
- Modify: `react-src/controls/TLTableView.tsx` (Spaltenzug 357–359 und 629–689, `ColumnsButton` 275–292, `handleSort` 617, Kopf-Render 1368–1535, `handleRootDragOver`/`handleRootDrop`)
- Modify: `I18NConstants.java` (`js.table.filterActive`, A5), `messages_de.properties`; `tlReactControls.css` (s. Step 4); `design-system/test/ratchet.json`

**Interfaces:**
- Consumes: E7 (`placeOf`, `widthStyle`, `ICON`, `frameRef`, `columnsButtonWidth`), E2 (`useListReorder`, `reorderState`).

- [ ] **Step 1: Spaltenzug über den gemeinsamen Hook** — 357–359 ersetzen:

```tsx
  // -- Column reordering: the common gesture (useListReorder, halves along the row of headings) --
  const columnReorder = useListReorder({
    axis: 'horizontal',
    count: columns.length,
    onMove: (from, to) => sendCommand('columnReorder', { column: columns[from].name, targetIndex: to }),
  });
  const columnDragging = columnReorder.dragIndex !== null;
```

`handleDragStart`, `handleDragOver`, `handleDrop`, `handleDragEnd` (629–689) löschen. `handleRootDragOver`: `if (dragColumnRef.current)` → `if (columnDragging)`, `columnDragging` in die Abhängigkeiten. `handleRootDrop`: der Zweig für Nicht-Zeilen endet mit `return;` und dem Kommentar „Not a row drag: a dragged column heading has ended at its heading (useListReorder).“; `handleDrop` aus den Abhängigkeiten.

- [ ] **Step 2: Sortieren, Spaltenknopf** — `handleSort` nimmt `event: { shiftKey: boolean }` (Kommentar: „Click or Enter on the label sorts by the column; with Shift it adds a level to the sort order.“). `ColumnsButton`:

```tsx
  <button
    type="button"
    className={buttonClassName({ appearance: 'ghost', small: inCell, icon: true, extra: 'tl-table__columns' })}
    {...tooltipProps(label)}
    aria-label={label}
    // In a heading, the gestures of the heading itself (sorting, dragging) are none of the
    // button's business.
    onMouseDown={(e) => e.stopPropagation()}
    onClick={onClick}
  >
    {/* Spec §12: icons are tl-icon-sm, also in a full-size icon button (Entscheidung 16). */}
    <ThemeIcon encoded={ICON.columns} className="tl-button__icon tl-icon-sm" />
  </button>
```

Vor dem `return` des Controls:

```tsx
  const ariaSort = (col: ColumnState): 'ascending' | 'descending' | 'none' | undefined => {
    if (!col.sortable) return undefined;
    // WAI-ARIA knows no levels: aria-sort names the first level only.
    if (!col.sortDirection || (col.sortPriority ?? 1) > 1) return 'none';
    return col.sortDirection === 'asc' ? 'ascending' : 'descending';
  };
```

- [ ] **Step 3: Kopf-Render** — der Kopf im Raster:

```tsx
      <div className="tl-table__header" ref={headerRef} role="rowgroup">
        {/* Fills the header even when the columns are narrower: a cell sticking to the right edge
            cannot leave its row. The reserve is padding, which a sticky cell never enters. */}
        <div className="tl-table__header-row tl-type-label-strong" role="row" aria-rowindex={1}
          data-tl-axis="horizontal" {...columnReorder.containerProps}
          style={{ minWidth: tableWidth, paddingRight: buttonReserve + scrollbarWidth }}>
          {isMulti && (
            <div role="columnheader"
              className="tl-table__header-cell tl-table__select"
              data-tl-state={stateAttr(frozenColumnCount > 0 && 'frozen')}
              style={{ width: checkboxWidth, minWidth: checkboxWidth, ...(frozenColumnCount > 0 ? { left: 0 } : {}) }}
            >
              {/* "Some selected" is the box's indeterminate property (headerCheckboxRef), which the
                  browser reports as mixed; no aria-checked on a native checkbox (ARIA in HTML,
                  Entscheidung 22). */}
              <input
                type="checkbox"
                ref={headerCheckboxRef}
                className="tl-checkbox"
                aria-label={i18n['js.table.selectAll']}
                checked={allSelected}
                onChange={handleSelectAll}
              />
            </div>
          )}
          {columns.map((col, colIdx) => {
            const w = getColWidth(col);
            const { isFrozen, isPinned, words } = placeOf(colIdx);
            const sortIcon = col.sortDirection === 'asc' ? ICON.sortAsc : ICON.sortDesc;
            const label = (
              <span className="tl-table__label"
                {...(col.tooltip ? tooltipProps(col.tooltip) : TOOLTIP_WHEN_CLIPPED)}>{col.label}</span>
            );
            return (
              <div
                key={col.name}
                role="columnheader"
                aria-sort={ariaSort(col)}
                className={'tl-table__header-cell' + (col.cssClass ? ' ' + col.cssClass : '')}
                data-col={col.name}
                data-col-idx={colIdx}
                data-tl-state={stateAttr(...words, col.filterActive && 'filtered',
                  reorderState(columnReorder.itemState(colIdx)))}
                style={{
                  ...widthStyle(colIdx, w, isFrozen),
                  ...(isFrozen ? { left: frozenOffsets[colIdx] } : {}),
                  // The header ends with the reserve the body's scrollbar and, where it is not in a
                  // heading, the column button take; its cells stick that much further from the right
                  // edge than the body's - which puts a heading above its column at every scroll position.
                  ...(isPinned ? { right: pinnedOffsets[colIdx] + buttonReserve + scrollbarWidth } : {}),
                }}
                {...(isPinned ? {} : columnReorder.itemProps(colIdx))}
                onContextMenu={(e) => handleColumnContextMenu(colIdx, e)}
              >
                {col.sortable ? (
                  <button
                    type="button"
                    className="tl-table__sort"
                    onClick={(e) => handleSort(col.name, col.sortDirection, e)}
                    onKeyDown={(e) => {
                      // Enter sorts here, with Shift as a further level: a keyboard click carries no Shift
                      // in every browser.
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSort(col.name, col.sortDirection, e);
                      }
                    }}
                  >
                    {label}
                    {col.sortDirection && <ThemeIcon encoded={sortIcon} className="tl-table__mark tl-icon-sm" />}
                    {col.sortDirection && sortedColumnCount > 1 && col.sortPriority != null && col.sortPriority > 0 && (
                      <span className="tl-badge tl-type-label-strong tl-nums" aria-hidden="true">{col.sortPriority}</span>
                    )}
                  </button>
                ) : label}
                {col.name === grouping && (
                  <span className="tl-table__mark" {...tooltipProps(i18n['js.table.grouped'])}>
                    <ThemeIcon encoded={ICON.grouped} className="tl-icon-sm" />
                  </span>
                )}
                {col.filterable && (
                  <button
                    type="button"
                    className={buttonClassName({ appearance: 'ghost', small: true, icon: true, extra: 'tl-table__filter' })}
                    {...tooltipProps(col.filterActive ? i18n['js.table.filterActive'] : i18n['js.table.filter'])}
                    aria-label={col.filterActive ? i18n['js.table.filterActive'] : i18n['js.table.filter']}
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => handleOpenFilter(col.name, e)}
                  >
                    <ThemeIcon encoded={ICON.filter} className="tl-button__icon tl-icon-sm" />
                  </button>
                )}
                {cogInHeaderCell && colIdx === columns.length - 1 && (
                  <ColumnsButton label={i18n['js.table.columns']} inCell onClick={handleOpenColumnSelect} />
                )}
                {!isPinned && (
                  <div
                    className="tl-table__resize"
                    role="separator"
                    aria-orientation="vertical"
                    aria-label={col.label}
                    onPointerDown={(e) => handleResizeStart(col.name, w, e)}
                    onClick={(e) => e.stopPropagation()}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      fitColumnToContent(col.name);
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
```

(Die zwei Sonderzonen — `onDragOver` der Auswahlzelle und die leere Zone hinter der letzten Spalte — fallen, Präzisierung oben.) Im Rahmen hinter dem Raster:

```tsx
        {/* Grip on the boundary of the frozen columns, confined to the heading: a grip running down
            the body would swallow the clicks on the cells behind it. */}
        <div
          className="tl-table__freeze"
          role="separator"
          aria-orientation="vertical"
          aria-label={i18n['js.table.freezeSplitter']}
          style={{ left: frozenWidth }}
          {...tooltipProps(i18n['js.table.freezeSplitter'])}
          onPointerDown={handleFrozenSplitStart}
        />
        {columnSelect && !cogInHeaderCell && (
          <ColumnsButton label={i18n['js.table.columns']} onClick={handleOpenColumnSelect} />
        )}
        {/* Where the frozen area would end if the grip were dropped now, over heading and rows. */}
        {frozenPreview && (
          <div className="tl-table__freeze-preview" style={{ left: frozenPreview.x }} />
        )}
```

`I18N_KEYS` um `'js.table.filterActive': 'Filter (active)'`; `I18NConstants.java`: `@en Filter (active)` → `js.table.filterActive`; `messages_de.properties`: `js.table.filterActive = Filter (aktiv)`.

- [ ] **Step 4: Altes CSS, Ratsche** — löschen über Kommentar und Selektor (b29546f2ad-Zeilen nur Orientierung), von unten: `/* Marks the column header the rows are grouped by. */` mit `.tlTableView__groupMark` (3841–3846); von `/* Grip to drag the boundary of the frozen area …` bis einschließlich der Regel `.tlTableView__frozenPreview { … }` (3739–3779: Fixiergrenze, Vorschau); von `.tlTableView__resizeHandle {` bis vor `/* -- Row drag and drop -- */` (3577–3616: Griff, gezogener Kopf, `dragOver-left/right`); von `/* The header row, with the column selection button …` bis einschließlich der Regel `.tlTableView__sortPriority { … }` (2864–2986). Ratsche: TLTableView und TLJobStatus sinken, `literals` mitsenken.

- [ ] **Step 5: Prüfen, Commit** — `tsc --noEmit` 0, beide Builds; `layout.react` grün (`TestPinnedColumns`); `check-messages-en.sh` → Diff committen; `git grep -n "tlTableView__header\|tlTableView__sort\|tlTableView__frozen\|tlTableView__resize\|tlTableView__columns\|tlTableView__checkbox\|tlTableView__groupMark\|u25B2\|u25BC" -- 'com.top_logic.layout.react/'` leer; `git grep -n "aria-checked\|tl-icon-md" -- com.top_logic.layout.react/react-src/controls/TLTableView.tsx` leer. `git commit -m "Ticket #29617: Design System wave 3b -- table header: sort button with aria-sort and Shift+Enter, filter and column icon buttons, separators with role=separator, column reorder through useListReorder"`

### Task E9: Tabelle III — Filterleiste, Ziehen der Zeilen, Ablehnungshinweis

**Files:**
- Modify: `react-src/controls/TLTableView.tsx` (`placeDropHint` 143–166, Hint-Refs 384–395, `handleRootDragOver` 748–753, Filterleiste 1261–1366)
- Modify: `tlReactControls.css` (Rest des Tabellenteils); `design-system/test/ratchet.json`

**Interfaces:**
- Consumes: P2 (`tl-chip__toggle`/`__remove`), `tl-field-group`, `tl-popover`, `usePopover` (3a), E7 (`dropWord`, Wurzel-Zustand).

- [ ] **Step 1: Ablehnungshinweis als Popover** — 143–166 (`DROP_HINT_GAP`, `placeDropHint`) ersetzen durch:

```tsx
/**
 * Why the target under the running drag refuses it: a tl-popover at the pointer, below the drag image
 * (a native tooltip is not shown while a drag runs). The table moves it through `moveRef` on every
 * dragover, so only the hint renders while the pointer moves, not the table.
 */
const DropHint: React.FC<{
  reason: string;
  start: { x: number; y: number };
  moveRef: React.MutableRefObject<((x: number, y: number) => void) | null>;
}> = ({ reason, start, moveRef }) => {
  const [at, setAt] = React.useState(start);
  React.useEffect(() => {
    moveRef.current = (x, y) => setAt((p) => (p.x === x && p.y === y ? p : { x, y }));
    return () => { moveRef.current = null; };
  }, [moveRef]);
  const { setFloating, style } = usePopover({ open: true, anchor: at, placement: 'bottom-start' });
  return createPortal(
    <div ref={setFloating} className="tl-popover tl-table__hint tl-type-body" role="status" style={style}>
      {reason}
    </div>,
    document.body);
};
```

384–395 ersetzen:

```tsx
  // -- The point below the drag image the hint on a refused target stands at, and the hint's way to
  //    follow it: dragover fires continuously, and only the hint re-renders for each move. --
  const hintPointRef = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hintMoveRef = React.useRef<((x: number, y: number) => void) | null>(null);
```

in `handleRootDragOver` 748–753:

```tsx
    const drag = runningDrag();
    // The hint stands below the drag image, which the browser draws around the pointer.
    hintPointRef.current = { x: event.clientX, y: event.clientY + (drag?.image ?? NO_DRAG_IMAGE).bottom };
    hintMoveRef.current?.(hintPointRef.current.x, hintPointRef.current.y);
```

und im Render statt des Portals 1264–1268:

```tsx
      {dropRefused && dropVerdict?.reason && (
        <DropHint reason={dropVerdict.reason} start={hintPointRef.current} moveRef={hintMoveRef} />
      )}
```

- [ ] **Step 2: Filterleiste** — `I18N_KEYS` um `'js.textInput.clear': 'Clear the input'` (bestehender Key); 1272–1366 ersetzen:

```tsx
      {filterBar && (
        <div className="tl-table__filter-bar">
          {namedFilters.length > 0 && (
            <span className="tl-chip-group">
              {namedFilters.map((named) => {
                const isActive = named.id === activeNamedFilter;
                return (
                  <span key={named.id} className="tl-chip tl-type-label">
                    <button
                      type="button"
                      className="tl-chip__toggle"
                      aria-pressed={isActive}
                      {...tooltipProps(isActive ? i18n['js.table.clearFilter'] : named.label)}
                      onClick={() => handleNamedFilter(named.id)}
                    >
                      <span className="tl-chip__label">{named.label}</span>
                    </button>
                    {/* Only a filter of the user's own can be deleted; a declared one is part of
                        the table and offers no remove affordance. */}
                    {named.deletable && (
                      <button
                        type="button"
                        className={buttonClassName({ appearance: 'ghost', small: true, icon: true, extra: 'tl-chip__remove' })}
                        {...tooltipProps(i18n['js.table.deleteFilter'])}
                        aria-label={i18n['js.table.deleteFilter']}
                        onClick={(e) => handleDeleteNamedFilter(named.id, e)}
                      >
                        <ThemeIcon encoded={ICON.clear} className="tl-button__icon tl-icon-sm" />
                      </button>
                    )}
                  </span>
                );
              })}
            </span>
          )}
          <span className="tl-field-group tl-table__search" {...tooltipProps(i18n['js.table.searchHint'])}>
            <span className="tl-field-group__icon" aria-hidden="true">
              <ThemeIcon encoded={ICON.search} className="tl-icon-sm" />
            </span>
            <input
              type="search"
              className="tl-field tl-type-body"
              placeholder={i18n['js.table.search']}
              aria-label={i18n['js.table.searchHint']}
              value={searchDraft}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
            {searchDraft !== '' && (
              <button
                type="button"
                className={buttonClassName({ appearance: 'ghost', small: true, icon: true })}
                aria-label={i18n['js.textInput.clear']}
                {...tooltipProps(i18n['js.textInput.clear'])}
                onClick={() => { setSearchDraft(''); sendSearch(''); }}
              >
                <ThemeIcon encoded={ICON.clear} className="tl-button__icon tl-icon-sm" />
              </button>
            )}
          </span>
          {filterSaving && (saveName === null ? (
            <button
              type="button"
              className={buttonClassName({ appearance: 'ghost', icon: true })}
              {...tooltipProps(i18n['js.table.saveFilter'])}
              aria-label={i18n['js.table.saveFilter']}
              onClick={() => setSaveName('')}
            >
              <ThemeIcon encoded={ICON.save} className="tl-button__icon tl-icon-sm" />
            </button>
          ) : (
            <span className="tl-table__save">
              <input
                type="text"
                className="tl-field tl-type-body"
                autoFocus
                placeholder={i18n['js.table.filterName']}
                aria-label={i18n['js.table.filterName']}
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                onKeyDown={handleSaveKeyDown}
              />
              <button
                type="button"
                className={buttonClassName({ appearance: 'ghost', icon: true })}
                {...tooltipProps(i18n['js.table.saveFilter'])}
                aria-label={i18n['js.table.saveFilter']}
                disabled={!saveName.trim()}
                onClick={handleSaveSubmit}
              >
                <ThemeIcon encoded={ICON.confirm} className="tl-button__icon tl-icon-sm" />
              </button>
              <button
                type="button"
                className={buttonClassName({ appearance: 'ghost', icon: true })}
                {...tooltipProps(i18n['js.table.cancelSave'])}
                aria-label={i18n['js.table.cancelSave']}
                onClick={() => setSaveName(null)}
              >
                <ThemeIcon encoded={ICON.cancel} className="tl-button__icon tl-icon-sm" />
              </button>
            </span>
          ))}
        </div>
      )}
```

(Die Suche filtert weiter auf dem Server, 300 ms — `handleSearchChange` bleibt. Alle Icons `tl-icon-sm`, auch in den Knöpfen voller Größe — Spec §12, Entscheidung 16.)

- [ ] **Step 3: Altes CSS, Ratsche** — löschen über Kommentar und Selektor (b29546f2ad-Zeilen nur Orientierung), von unten: von `/* -- Row drag and drop -- */` bis einschließlich der Regel `.tlTableView__dropHint { … }` (3618–3676: Zeilen ziehen, `--dragover`, `--dropRefused`, `__dropHint` mit `z-index: 13000`); die Überschrift `/* --- TLTableView` mit allem, was unter ihr bis vor `/* --- TLHtml` noch steht — nach E7 und E8 nur noch die Filterleiste ab `/* The filter bar above the column headings …` (2693–2862; der Übergangsblock aus E7 steht vor der Überschrift und bleibt). `grep -n "tlTableView" tlReactControls.css` → kein Treffer (der Übergangsblock aus E7 liest `tl-table__cell`, nicht die alte Klasse). Ratsche: TLTableView streichen, TLJobStatus auf die Zahl aus `inventory.mjs` (Plan-Review: 122, nicht 118 — die Leerzeilen zwischen den ausgeschnittenen Regeln bleiben im Block) mit Vermerk „Tabellenregeln ausgeschnitten, keine Änderung an TLJobStatus“; `literals` auf die Zahlen aus `inventory.mjs` (laut Plan-Review nach E9: `fontSize` 41, `outlineNone` 16, `duration` 32, `zIndex` 14 — Abweichungen begründen, nicht abschreiben).

- [ ] **Step 4: Prüfen, Commit** — `tsc --noEmit` 0, beide Builds; `layout.react` grün (`TestTableViewDragDrop`, `TestReactStylesheetTokens`); `git grep -n "tlTableView" -- 'com.top_logic.*/react-src' '*.css' '*.java' '*.view.xml'` leer; `git grep -n "tl-icon-md" -- com.top_logic.layout.react/react-src/controls/TLTableView.tsx` leer. `git commit -m "Ticket #29617: Design System wave 3b -- table filter bar: removable chips, tl-field-group search with clear button; drop states as data-tl-state, the refusal hint is a tl-popover; old table rules gone"`

### Task E10: Gates und Doku

**Files:**
- Modify: `design-system/test/engine-classes.test.mjs:1-12,32`, `docs/migration/altlast.md` (Abschnitt 3b), Worktree `docs/plans/2026-03-*.md` (Vermerke)

- [ ] **Step 1: Engine-Gate** — `engine-classes.test.mjs`: Kopfkommentar „Die Wellen 2, 3a und 3b sind fertig, wenn …(Formular, Menü, Toolbar, Tabs, Breadcrumb, Tabelle, Baum, Spaltenwahl, Spalten, Text)…“; `ALT` um `|tlTableView|tlTreeView|tlColumnSelect|tlColumns|tlText` erweitern (kein schließendes `\b`: `tlTableView__row` muss treffen; `tlColumns` trifft `tlColumnSelect` nicht, das `S` ist groß); Testtitel „…der Wellen 2, 3a und 3b…“. `cd design-system && node --test && node tools/lint-css.mjs` → grün (`engine-classes` grün, `ratchet` grün).

- [ ] **Step 2: Engine-Gates** — beide Builds und `tsc --noEmit` 0; Modul-Tests `layout.react`, `layout.view`, `layout.configedit`, `demo.react` (je `$MVN install` der vorgelagerten Module vorher); `check-messages-en.sh` ohne Diff; `git grep -n "tlTableView\|tlTreeView\|tlColumnSelect\|tlColumns\|tlText" -- '*.tsx' '*.ts' '*.css' '*.java' '*.view.xml' docs/faq` leer; kein `rowHeight` im Zustand **der Tabelle** (Spec §13; das Dashboard behält seinen eigenen Schlüssel für die Kachelhöhe, `ReactDashboardControl.java:40`, `TLDashboard.tsx:161` — Plan-Review B1): `git grep -n "ROW_HEIGHT\|\"rowHeight\"" -- com.top_logic.layout.react/src/main/java/com/top_logic/layout/react/control/table/` und `git grep -n "state\.rowHeight" -- com.top_logic.layout.react/react-src/controls/TLTableView.tsx` leer. In jeder Datei `docs/plans/2026-03-*.md` mit Treffern unter der Überschrift eine Zeile `> alt (bis Welle 3b): \`.tlTableView*\`, \`.tlTreeView*\`, \`.tlColumnSelect*\`, \`.tlColumns*\`, \`.tlText*\` sind jetzt \`tl-table\`, \`tl-tree\`, \`tl-reorder-list\`, \`tl-columns\`, \`tl-text\` (design system).` (A3). Commit `"Ticket #29617: Design System wave 3b -- old names marked in docs/plans"`.

- [ ] **Step 3: altlast.md** — Abschnitt „Welle 3b · Daten — gebaut <Datum>“: gestrichene Blöcke (TLTableView beide Teile, TLTreeView, TLColumnSelect, TLColumns, drei Text-Blöcke, Primär-App-Bar), „Neu im Paket“ (status, drag, reorder-list, text, columns, table, tree, Kapsel, Rolle als Attribut, Cursor-Ring), Tabelle alt → neu für Anwendungs-Stylesheets (`tlTableView__row--selected` → `.tl-table__row[aria-selected="true"]`, `--cursor` → `[data-tl-state~="cursor"]`, `--frozen*`/`--pinnedEnd*` → `[data-tl-state~="frozen|frozen-last|pinned|pinned-first"]`, `tlTreeView__node--selected` → `.tl-tree__node[aria-selected="true"]`, `tlText--<variant>` → `tl-type-*`, `tlText--tone-<t>` → `[data-tl-tone]`, `tl-pill--<r>` → `[data-tl-role]`, `rowHeight` → `--tl-size-row` …), „Offen“ (Nebenbefund A1 `text-secondary`/`text-helper` auf ausgewählter Fläche dunkel; Übergangsblock „Table cells holding legacy controls“; Spaltenzug ohne Sonderzonen; die Punkte der Spec §16). Commit im Projekt-Repo.

### Task E11: Push, PR, Sichtprüfung

- [ ] **Step 1: Push und PR** — `git fetch`; ist master weitergelaufen: `git merge origin/master` (Gates aus E10 Step 2 wiederholen); Push durch Hendrik; PR gegen `master`, Bernhard Reviewer (`add_reviewers bhu`), Trac #29617 CC; Beschreibung englisch: Ziel, Konsolidierung (W3, W6, W7, W8, W10, W11, N1, Link `altlast.md`), Migrationsliste alt → neu (aus E10 Step 3), **`rowHeight` fällt (Java, für Bernhard benannt)**, `TextTone.ACCENT` fällt / `PLACEHOLDER` neu, Sichtprüfungsliste.

- [ ] **Step 2: Sichtprüfung** (Docker-Instanz des PRs, hell und dunkel, normal und kompakt): (1) Tab in eine Tabelle, Pfeile: Ring innen um die Zeile, auch über fixierten und angehefteten Spalten; Klick mit der Maus: kein Ring; Klick, dann Pfeil: Befund notieren; Ring im Select-Suchfeld vorhanden. (2) Sortieren per Enter, Umschalt + Enter (Badge „2“), `aria-sort` im Inspektor. (3) Dichte umschalten bei offener Tabelle: Zeilen 36 → 32 px, Baumeinzug 24 px, keine Lücken. (4) Filter aktiv: Trichter `icon-primary`, Tooltip „Filter (aktiv)“. (5) Fixierte Spalte beim waagerechten Scrollen, Kante als Linie, Fixiergrenze ziehen (Vorschau), Breite ziehen; Pfeil links/rechts schiebt den Körper. (6) Schnell scrollen: Skeleton-Zeilen; leere Tabelle „Keine Einträge“. (7) Zeilen ziehen (davor/darauf/danach, Ablehnung mit Hinweis-Popover), Spalten ziehen (Marke links/rechts), Knoten ziehen im Baum. (8) Spaltenwahl: ziehen, Alt + Pfeil mit Ansage (Screenreader oder `role=status` im Inspektor), Suche ab elf Spalten; Select-Chips: Alt + Pfeil links/rechts ohne Browser-Zurück; `TLValueList`: Alt + Pfeil. (9) Kapseln mit Rollen: Chip, Segment, Select-Chip, Pill im Lesewert, Avatar-Kategorie; gedrückter Chip; Filterleiste mit entfernbaren Kapseln. (10) Lesewert mit Icon und Link in Tabellenzellen (`TLResourceCell`, Ressourcenbild). (11) TLText-Varianten in der Styling-Demo, `strong` statt `accent`, Platzhalter in der Konfigurationsliste. (12) Baum lädt: Fortschrittszeile unter dem Knoten, im Inspektor ein `treeitem` eine Ebene tiefer mit Namen „Einträge werden geladen…“. Nachgezogen aus dem Plan-Review: (13) Ziehen-Marken liegen sichtbar **über** den Kindern — an der Tabellenwurzel (`drop-onto`/`drop-refused`) über Filterleiste, Kopf und Zeilen, an einer Zeile über fixierten und angehefteten Zellen, am Spaltenkopf und Baumknoten (M4); Ring und Marke an derselben Zeile stören sich nicht. (14) Klick in eine Zelle einer editierbaren Tabelle öffnet den Editor in dieser Spalte (M1). (15) Spaltenwahl und Select-Chips: nach Alt + Pfeil bleibt der Fokus am Griff des bewegten Eintrags, ein zweites Alt + Pfeil bewegt ihn weiter (M2). (16) Pfeil links/rechts und Leertaste in einem Dropdown, an einem Kästchen, einem Chip oder dem Sortierknopf der Tabelle gehören dem Control, nicht der Tabelle (Leertaste am Sortierknopf sortiert); Tab läuft vom Raster zum nächsten Control ohne Halt am Körper. (17) Firefox: Ziehen vom Sortierknopf in einem ziehbaren Kopf startet den Spaltenzug, ein Klick sortiert. (18) Ablehnungshinweis: Lage am Punktanker unter dem Ziehbild — verdeckt das Ziehbild ihn oder er das Ziehbild, Befund. (19) Waagerechtes Scrollen mit Cursor-Ring: der Ring bleibt an beiden Rändern sichtbar (links unter fixierten Spalten, rechts unter angehefteten und dem Spaltenknopf). (20) Ein deaktiviertes Segment mit Rolle zeigt keine Tönung. Befunde als Fix-Commits.

---

## Self-Review

**Spec coverage:** §1 → E4–E9 (Blöcke), E9 Step 3 (TLJobStatus ≈ 122, Zahl aus `inventory.mjs`); Nachzüge W10 → P3/E1, W7 → P1/P2/E1/E4, N1 → E3, W8 → E2/E5/E9, W11 → P4/E2/E6/E8/E9. §3 → P5, P7, E7 (A2); §4 → P7, E8 (A5); §5 → P2, P7, E9; §6 → P7, E3, E7; §7 → P8, E6; §8 → P4, E2, E5; §9 → P4, E2, E6, E8, E9; §10 → P3, P7, E6, E7; §11 → P1, P2, P6, E1, E3, E4 (A4); §12 → P6, E5, Global Constraints; §13 → P9 (A1), P9 Step 5, P1–P8 (Verträge), E-Tasks (Ratsche), E10 (A3); §14 → Reihenfolge P1–P9, E1–E11; §15 → E10 Step 3, E11 Step 1; §16 → E4 (`accent`), E10 Step 3 (Offen).

**Placeholder-Scan:** Vertrags- und Specimen-Steps beschreiben Inhalt und Pflichtbegriffe, keinen Volltext (wie in 3a); die Pflichtbegriffe prüft `contracts-3b.test.mjs` (P9). Zahlen der Ratsche kommen je Task aus `node tools/inventory.mjs`.

**Type consistency:** `useTokenPx(ref, name, fallback)` in E2/E6/E7; `tokenPx(element, name, fallback)` in E2 (Toolbar, Popover); `stateAttr(...words)` in E6/E7/E8; `reorderState(itemState)` in E2/E5/E8; `useListReorder({ axis, onMove(from, to), count, labelOf?, keyOf?, enabled?, handle? })` in E2/E5/E8; `handleProps(i)` liefert `aria-label` nur mit `labelOf` und immer den `ref` der Fokusrückgabe (kein eigener `ref` am Griff); `FieldValue({ … onGoto, icon, role, tooltip })` in E3; `TLPill({ role, className, icon })`, `roleAttr`, `OptionContent`/`OptionLabel`/`optionRoleAttr` in E1/E3; `placeOf`, `widthStyle`, `dropWord`, `ICON`, `frameRef`, `columnsButtonWidth` in E7, gelesen in E8/E9.

**Review Focus:** fünf Punkte oben, jeder mit Gate im besitzenden Task und einem Punkt der Sichtprüfung E11.
