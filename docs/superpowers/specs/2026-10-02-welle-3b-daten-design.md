# Welle 3b — Daten: ein Raster, ein Baum, eine Optik für Ziehen und Laden

**Stand:** 2026-10-02 · Ticket #29617
**Baut auf:** [`2026-10-01-welle-3a-navigation-popups-design.md`](2026-10-01-welle-3a-navigation-popups-design.md)
(Popover-Helfer, Menü, Toggle, Icon-Knopf, Fokusregel §5, `size-bar`); `docs/skalen.md` „Zeigen auf allen Gründen“,
„Gleiches wird zusammengelegt“, „Leisten und Hilfe“, „Typo“, „Dichte“; Prognosen `docs/migration/altlast.md`
„Konsolidierung (01.10.)“ W3 (Tabelle/Baum), W6, W7, W8, W10, W11, N1
**Entschieden mit Hendrik:** 01.10. (Welle-3-Brainstorming: `role=grid`, Zustand = ARIA, Konsolidierungszeilen);
02.10. in dieser Sitzung: TLText mit in 3b, Umsortieren per Tastatur, Zeilenhöhe misst der Client, Ton `accent` fällt;
Spec freigegeben 02.10.; nach dem Plan-Review entschieden 07.10.: Fehler- und Warnlinie auf ausgewählter Zeile
(Tausch + `red-34`), Raster innen (A2), `docs/plans` außerhalb des Gates (A3), `strong` als Klasse und Ton
`placeholder` (A4), eine Filter-Glyphe (A5), nur `indeterminate`, Pill als Wurzel — `docs/skalen.md` „Welle 3b“
Nach dem Vorziehen auf master (07.10.): baut auf Bernhards Paket-Branch `hoefe` (Merge `80749da`); Alert-Teile aus
#29652 und `.tl-choice-group--vertical` ins Paket; Entfernen in der Kapsel = Bernhards Kreis; nur `error` ist
`role="alert"`; der Toggle in Zeilen zeigt mit `surface-state-*`

---

## 1 · Ziel und Abgrenzung

3b schneidet die Datendarstellung aus `tlReactControls.css` heraus. Fertig ist 3b, wenn die Blöcke unten leer und
aus `test/ratchet.json` gestrichen sind — nicht, wenn die Tabelle aussieht wie vorher.

| Gruppe | Controls (`react-src/controls/`) | Alte Regeln (`tlReactControls.css`, master `b29546f2ad`) |
|---|---|---|
| Tabelle | `TLTableView.tsx` (1710 Zeilen) | Block TLTableView 2693–3178 (ohne die `.tlText`-Grundregel 3180–3188) **und** ein Teil ohne Überschrift 3565–3846 (282 Zeilen), den die Ratsche heute dem Block TLJobStatus zuschlägt |
| Baum | `TLTreeView.tsx` | TLTreeView 4084–4204 (121) |
| Spaltenwahl | `TLColumnSelect.tsx`, `bridge/list-reorder.ts` | TLColumnSelect 3848–3960 (113) |
| Spalten-Layout | `TLColumns.tsx` | TLColumns 1851–1877 (27) |
| Text | `TLText.tsx` | `.tlText` 3180–3188 und die drei Blöcke „What the text is for“, „…color…“, „The shape…“ 3190–3282 (94) |

Summe rund 1130 Zeilen. Der Block TLJobStatus fällt dabei von 400 auf 118 Zeilen; die Ratsche bekommt für ihn den neuen
Stand mit Vermerk „Tabellenregeln ausgeschnitten, keine Änderung an TLJobStatus“.

**Nachzüge im selben PR** (Konsolidierung): Select-Popup-Status wird `tl-status` (W10); `withPill` und die
Pill-Verschachtelung in Chip, Segment, Select-Chip, TLText fallen (W7); `ReadonlyValue` und `TLResourceCell` gehen in
`FieldValue` auf (N1); die Filterlogik des Select-Popups wird der gemeinsame Helfer `filterOptions` (W8); die Select-Chips
lesen die gemeinsame Ziehen-Optik (W11).

**Nicht Ziel:** Upload und `TLFileChips` (N3, Welle 5); Icon-Select und dessen Spinner und Status (W10, Welle 5);
Dashboard-Kacheln, Kalender, Farbpalette (eigene Ziehen-Optik, Welle 4/5); Spaltenbreite und Fixiergrenze per
Tastatur; senkrechtes Auto-Scrollen beim Zeilenziehen; Zell-Navigation und Typeahead (Welle-3-Brainstorming).
`TLValueList` behält seinen Block bis Welle 5, bekommt aber das Umsortieren per Tastatur über den gemeinsamen Hook (§8).

## 2 · Wie die Welle geliefert wird

**Branch** `CWS/CWS_29617_design_system_welle_3b` von `master` (`b29546f2ad`, 3a gemergt). Ein PR gegen master,
Bernhard Reviewer, Trac #29617 CC, Beschreibung englisch mit Migrationsliste alt → neu. Vor jedem Push `git fetch`.

## 3 · Tabelle: Raster, Cursor, Auswahl

**Semantik** (Welle-3-Brainstorming 01.10.; Ort entschieden 07.10.): `role=grid`, im Baum- und Gruppierungsmodus
`role=treegrid`, sitzt am inneren Element `tl-table__grid` (Kopf + Körper) — ein Raster darf nur Zeilen besitzen;
Filterleiste, Spaltenwahl-Knopf, Fixiergrenze und Vorschau liegen im Rahmen `tl-table__frame` außerhalb. Das Raster
tragen auch die Zähler: Kopfzeile und Zeilen `role=row`, Kopfzellen `role=columnheader`, Zellen `role=gridcell`. Weil virtuell
gerendert wird, trägt es `aria-rowcount` (Zeilen + 1) und `aria-colcount`, jede Zeile `aria-rowindex`
(Kopf = 1). `aria-multiselectable` bei Mehrfachauswahl, `aria-selected` an jeder Zeile, im Baummodus `aria-level` und
`aria-expanded`. Die Klassen `--selected`, `--group` fallen.

**Cursor** (3a §5.4): Das Raster hält den Fokus (`tabindex=0`) und zeigt mit `aria-activedescendant` auf die
Cursorzeile (am Körper `rowgroup` wäre das Attribut nicht erlaubt; der Körper scrollt nur, `tabindex=-1`); Zeilen bekommen eine `id` (`<controlId>-row-<index>`). Die Zeile trägt `data-tl-state~="cursor"`. Den
Ring zeichnet **`base.css`**, nicht die Komponente (3a-Gate: `focus-ring` nur im Basis-Ring): Hat ein Behälter
`aria-activedescendant` und ist er `:focus-visible`, liegt der Ring innen am Cursor-Element statt außen am Behälter.
Mit der Maus angeklickt erscheint kein Ring; die Auswahl zeigt die Fläche. Der Inset-Schatten in `--focus` aus vier
Regeln fällt.

**Flächen:** Zeile `min-height: size-row`; Zeigen `surface-interactive-hover`, ausgewählt
`surface-interactive-selected`, Trennlinie `border-width-sm` `border-separator`. Eine Zeile schwebt nicht
(skalen.md „Elevation“): kein Schatten.

**Auswahlkästchen** (W6): Kopf und Zeile sind `input.tl-checkbox` aus dem Paket; der Kopf zeigt „teilweise“ mit
`indeterminate` — **kein** `aria-checked` (ARIA in HTML verbietet es am nativen Kästchen; der Browser meldet
`indeterminate` als „gemischt“; entschieden 07.10.). Beide bekommen ein `aria-label` über Resource-Keys
`js.table.selectAll` und `js.table.selectRow` (JavaDoc → `check-messages-en.sh`). Die Zeilenkästchen bleiben
`tabindex=-1` (Leertaste am Cursor wählt). `accent-color` und `tlTableView__checkbox` fallen.

**Zeilenhöhe misst der Client** (Hendrik, 02.10.): die virtuelle Liste liest `--tl-size-row` als Pixelwert am
Raster (ein Helfer `tokenPx(element, name)` in `bridge/`) und misst neu, wenn sich `data-tl-density` am `html`
ändert. Der Statusschlüssel `rowHeight` in `TableViewControl` fällt ersatzlos (Java; im PR für Bernhard benannt).
Damit folgt die Tabelle der Dichte: 36 px normal, 32 px kompakt.

## 4 · Tabelle: Kopf, Sortieren, Filter, Spaltenmenü

- **Kopfzeile** `min-height: size-bar` — so hoch wie Reiterleiste und Toolbar darüber (skalen.md „Leisten und
  Hilfe“). Text `tl-type-label-strong` (skalen.md Typo: Spaltenkopf), Linie unten `border-width-sm`
  `border-emphasis`. Die Literale `2.5rem`, `600` und der 2-px-Rand fallen.
- **Sortieren per Tastatur:** In einer sortierbaren Kopfzelle ist die Beschriftung ein `button` (Klick sortiert,
  Umschalt + Klick oder Umschalt + Enter fügt eine Stufe an). Die Kopfzelle trägt `aria-sort`
  (`ascending|descending|none`, nur an der ersten Stufe; WAI-ARIA kennt keine Stufen). Der Pfeil ist ein `ThemeIcon`
  `tl-icon-sm` in `icon-secondary`, die Stufe ein `tl-badge`. Textzeichen ▲▼ und die Literale `0.625rem`,
  `0.5625rem`, `999px` fallen.
- **Filterknopf** `tl-button--icon tl-button--sm tl-button--ghost` mit `aria-label` und Tooltip. Ein aktiver
  Filter ist ein Zustand der Spalte: die Kopfzelle trägt `data-tl-state~="filtered"`, der Knopf zeigt dann die
  Glyphe `fa-solid fa-filter` in `icon-primary` **und** heißt „Filter (aktiv)“ (`js.table.filterActive`), sonst dieselbe
  Glyphe in `icon-secondary` (FA Free hat keinen leeren Trichter; WCAG 1.4.1; entschieden 07.10.). Der Inline-Stil mit `#1565c0` fällt.
- **Spaltenknopf** (Zahnrad) und die drei Knöpfe der Filterleiste: `tl-button--icon --ghost` (Leiste `size-control`,
  in der Kopfzelle `--sm`). Gruppierungsmarke: `ThemeIcon tl-icon-sm` in `icon-secondary`, `aria-hidden`.
- **Spaltenmenü** bleibt die `Menu`-Instanz aus 3a.
- **Breite ziehen und Fixiergrenze:** beide `role=separator` mit `aria-orientation="vertical"` und `aria-label`
  (bleiben Zeigerbedienung, §1 Nicht-Ziel). Griffbreite `space-xs`, Linie unter dem Zeiger `border-width-md`
  `border-interactive`; die Vorschau der Fixiergrenze ebenso. Die Literale `5px`, `7px`, `-2px` und die
  Deckkraft `0.3` fallen.
- **Fixierte und angeheftete Spalten** sind Lage, kein Zustand der Bedienung; sie tragen `data-tl-state~="frozen"`
  (`frozen-last`, `pinned`, `pinned-first`). Die Kante zur scrollenden Fläche ist eine Linie `border-width-sm`
  `border-emphasis`, kein Schatten (`--shadow-raised` und `clip-path` fallen). Gestapelt wird mit `layer-raised`
  statt `zIndex: 2` inline; die Vorschau liest `layer-sticky`.

## 5 · Tabelle: Filterleiste

- **Benannte Filter** (W7) sind `tl-chip` in einer `tl-chip-group`. Ein entfernbarer Filter ist eine Kapsel mit
  zwei Knöpfen (§11): Umschalten mit `aria-pressed`, Entfernen `tl-button--icon --sm --ghost` mit `ThemeIcon`
  (24 px, Ziel WCAG 2.5.8). Feste Höhe `1.75rem`, `&times;` und die Kapselfarben aus Alt-Tokens fallen.
- **Suche und Speichern** (W8) sind `tl-field-group` + `tl-field`: Lupe als `tl-field-group__icon` (`ThemeIcon`),
  Löschknopf als Endknopf der Gruppe (`.tl-field-group > .tl-button`). Den Fokus zeichnet der Basis-Ring am Feld;
  `outline: none` (2×) und die eigenen Rahmen fallen. Die Suche filtert weiter auf dem Server (300 ms).
- **Leiste:** `display: flex; gap: space-xs; padding: space-xs space-sm`, Linie unten `border-width-sm`
  `border-separator`, Fläche `surface-layer`.

## 6 · Tabelle: Zellen, Lesewert, Baum- und Gruppenzeilen

- **Ein Lesewert** (N1): `FieldValue` ist der einzige Renderer von `tl-field-value`. Er kennt zwei Arten von Link:
  einen **äußeren** (`href`, neuer Tab, wie heute im Formular) und einen **inneren** (`onGoto`, Kommando `goto`, wie
  heute in Select und Zelle). Dazu Tooltip, mehrzeilig, Icon über `ThemeIcon`, Tönung über `data-tl-role` (§11).
  `ReadonlyValue`/`ReadonlyValues` und `TLResourceCell` rendern über `FieldValue`; das nackte `<i class=…>` in
  `TLResourceCell` fällt.
- **Zellinhalt:** Innenabstand `0 space-control-x`. Ein Editor in der Zelle ist randlos; sein Fokus ist der
  Basis-Ring nach innen versetzt (3a §5.2: Einträge in scrollenden Behältern). Fehler und Warnung im Zelleditor
  zeichnen eine innere Linie `box-shadow: inset … border-width-md status-error-border` bzw. `status-warning-border`
  — kein `outline` in Statusfarbe (3a-Gate). `:has(.tl-field:focus)` und die drei Outline-Regeln fallen.
- **Baum- und Gruppenzeilen:** der Auf-/Zuklapper ist `tl-toggle` aus 3a (`aria-expanded`, `aria-label`,
  `tabindex=-1`; Pfeil rechts/links am Cursor klappt, wie im Baum). Einzug je Ebene = `size-control-sm`, die Breite
  des Toggles — so steht jedes Kind unter der Beschriftung seiner Eltern. Das TSX rechnet den Einzug aus dem Token
  (`tokenPx`), keine `--tl`-Variable inline. Gruppenzeile: `tl-type-body-strong`, Anzahl `tl-type-label`
  `text-secondary`. Textzeichen ▾▸, `20px` und `font-weight` fallen.

## 7 · Baum

- **Semantik:** `ul role=tree` mit `aria-label` (Resource-Key aus dem Zustand oder `js.tree.label`),
  `aria-multiselectable` im Mehrfachmodus, `aria-activedescendant` auf den Cursorknoten; Knoten `li role=treeitem`
  mit `id`, `aria-level`, `aria-expanded`, `aria-selected`. Die Tastatur bleibt wie sie ist (sie ist vollständig).
- **Cursor und Auswahl** wie in der Tabelle (§3): `data-tl-state~="cursor"`, Ring aus `base.css` nur bei
  Tastaturfokus; ausgewählt `surface-interactive-selected` — der 3-px-Balken links fällt, weil Tabelle und Baum
  Auswahl gleich zeigen. `outline: none` an der Wurzel und `--focused` fallen.
- **Knoten** `min-height: size-row`, Einzug wie §6, Toggle `tl-toggle`. `▶▼` als `::before`, `14px`, `12px`, `32px`
  fallen.
- **Lädt:** ein Knoten, dessen Kinder kommen, trägt `aria-busy="true"`; unter ihm steht eine `tl-status`-Zeile mit
  unbestimmtem `tl-progress` (§10). Der Ring-Spinner `tlTreeSpin` fällt.

## 8 · Spaltenwahl und Umsortieren per Tastatur

- **Liste** `tl-reorder-list` (`ul`), Einträge `__item` mit Griff `__handle`, Gruppierungsknopf
  `tl-button--icon --sm --ghost` mit `aria-pressed`, Kästchen `label.tl-choice` > `input.tl-checkbox`. Die Suche ab
  elf Einträgen ist `tl-field-group` (§5) und filtert mit `filterOptions` (§9). Höhe höchstens `size-popover-max`.
- **Umsortieren per Tastatur** (Hendrik, 02.10.; WCAG 2.2, 2.5.7): `useListReorder` macht den Griff zu einem
  fokussierbaren `button` mit `aria-label` und `aria-describedby` (Hinweis „Alt + Pfeil verschiebt“). Alt + Pfeil
  auf/ab (waagerecht: links/rechts) verschiebt den Eintrag um eine Stelle und sendet denselben Befehl wie das
  Ziehen; ein Live-Bereich (`role=status`) sagt „<Name>, Position n von m“ an (Resource-Key
  `js.reorder.moved`). Leser: Spaltenwahl, `TLValueList`, Select-Chips (§9).
- Die Klassen `--dragOver-before/after`, `--groupBy--active`, `--fixed` und die Alt-Token-Regeln fallen.

## 9 · Ziehen und Ablegen: ein Rechner, eine Optik

**Ein Rechner:** `dropPositionAt` (Drittel: davor, darauf, danach) für Ziele, auf die man ablegen kann — Tabellenzeile,
Baumknoten (die eigene Drittelrechnung im Baum fällt); `useListReorder` (Hälften) für Reihenfolgen — Spaltenwahl,
Spaltenköpfe (statt der Handrechnung `TLTableView.tsx:630–689`), Select-Chips, `TLValueList`.

**Eine Optik** (W11), als Attribute, im Paket einmal gezeichnet:

| `data-tl-state~=` | Bild |
|---|---|
| `drop-before` / `drop-after` | Linie innen oben/unten (waagerecht: links/rechts), `border-width-accent` in `border-interactive` — wie heute die Select-Chips |
| `drop-onto` | Fläche `surface-interactive-selected` und innerer Rahmen `border-width-md` `border-interactive` |
| `drop-refused` | innerer Rahmen `border-width-md` `status-error-border` |
| `dragging` | die gezogene Quelle wird blass, `opacity: 0.4` — einheitenlos, das Lint lässt das bewusst zu (`lint-css.mjs:44`); die Zahl steht damit einmal statt dreimal |

Ablegen auf die ganze Tabelle trägt dieselben Zustände an der Wurzel. Der Ablehnungshinweis wird ein `tl-popover`
über den 3a-Helfer (`role=status`, Text `status-error-text`, Rand `status-error-border`); `placeDropHint`,
`z-index: 13000` und `--support-error` fallen.

**Ein Filter:** `filterOptions(options, needle)` in `bridge/` (trim, Kleinschreibung, „enthält“) ersetzt die
Filter von Select-Popup und Spaltenwahl. Icon-Select folgt in Welle 5.

## 10 · Laden und Leer

- **`tl-status`** ist eine neue Komponente im Paket, herausgelöst aus `tl-select__status`: eine Zeile mit
  `min-height: size-row`, `gap: space-xs`, `padding-inline: space-control-x`, `text-secondary`; mit `role=alert`
  `status-error-text`. „Lädt“ ist immer ein unbestimmter `tl-progress` darin. Leser: Select-Popup (Nachzug,
  `tl-select__status` fällt), Baum (§7), Tabelle.
- **Tabelle leer:** hat sie keine Zeilen, steht im Körper eine `tl-status`-Zeile „Keine Einträge“ (Resource-Key
  `js.table.empty`) statt einer leeren Fläche.
- **Tabelle lädt nach:** Zeilen im sichtbaren Fenster, die der Server noch nicht geschickt hat, zeichnet der Client
  als `tl-skeleton` in Zeilenhöhe; das Raster trägt `aria-busy="true"`, bis sie da sind. Damit hat der Skeleton
  seinen ersten Aufrufer.

## 11 · Kapseln und Text

- **Tönung ist ein Attribut** (W7): `data-tl-role="error|warning|success|info|brand|category-1…8"` an Pill, Chip,
  Segment und Select-Chip. `generate.mjs` erzeugt die Rollenregeln einmal je Block über den vorhandenen Marker
  `@tl-roles` (`generate.mjs:22–42`), künftig als `[data-tl-role="<rolle>"]` statt `--<rolle>`. Weil der Generator
  einer ist, wechseln auch **Avatar und Alert** (Welle 1/0) auf das Attribut — sonst gäbe es zwei Mechanismen für
  dieselbe Tönung. Die Klassen `tl-pill--<rolle>`, `tl-avatar--category-*`, `tl-alert--<status>` und der Helfer
  `pillClassName` fallen; `--brand` an der Pill wird `data-tl-role="brand"`.
  **Keine Pill in der Kapsel:** `withPill` fällt; Chip, Segment und Select-Chip tragen die Rolle selbst. Icon und
  Beschriftung stehen als Geschwister mit `gap: space-2xs` (Pill, Chip, Segment) — das Icon steckt nicht mehr im
  Label.
- **Entfernbare Kapsel:** `span.tl-chip` mit Umschalt-Knopf `tl-chip__toggle` (`aria-pressed`) und Entfernen-Knopf
  `tl-chip__remove` (`tl-button--icon --sm --ghost`); gedrückt sieht sie aus wie ein gedrückter Knopf-Chip. Leser:
  Filterleiste (§5). Der Select-Chip bleibt eine passive Pill mit Entfernen-Knopf.
- **TLText** (Hendrik, 02.10.) liest das Paket: `span.tl-text` mit der Typo-Klasse und `data-tl-tone`.

  | Bestand | Neu |
  |---|---|
  | Variante `display`, `headline`, `title`, `body`, `label`, `caption` | `tl-type-display`, `-heading-lg`, `-heading-sm`, `-body`, `-label`, `-label` |
  | Form `strong` | die `-strong`-Klasse der Variante (`body-strong`, `label-strong`; Überschriften sind schon 600) |
  | Form `ellipsis` | `tl-text--truncate` (eine Zeile, Ellipse) |
  | Form `placeholder` | Ton `placeholder` (`text-placeholder`), **ohne Kursiv** — die Typo kennt keinen Schnitt |
  | Ton `primary` (Standard), `secondary`, `helper` | ohne Attribut, `data-tl-tone="secondary"`, `"helper"` |
  | Ton `success`, `warning`, `error` | `data-tl-tone` → `status-*-text` |
  | Ton `on-color` | `data-tl-tone="on-brand"` → `text-on-brand` |
  | Ton `accent` | **fällt** (Hendrik, 02.10.): `TextTone.ACCENT` aus dem Vokabular, die Styling-Demo nimmt `strong` |
  | Erscheinung `pill` | `span.tl-pill` **ist die Wurzel** und trägt `data-tl-role` (Ton → Rolle wie heute `roleOfTone`) samt der übrigen Text-Attribute; keine Hülle `tl-text` (07.10.) |

  Die Klassen `tlText--strong` (5 Stellen in `*.view.xml` und `InspectedNodeElement.java`) und `tlText--placeholder`
  (`ConfigListEditorControl.java`) werden umgestellt: stark als `css-class` `tl-type-body-strong` (`TextElement` kennt kein Form-Attribut),
  der Platzhalter als neuer Ton `TextTone.PLACEHOLDER` (07.10.); `--tlText-tone`
  (in `foreignTl`) fällt mit ihnen.

## 12 · Spalten-Layout, Tokens und Maße

- **`tl-columns`** (`TLColumns`): Flex mit Umbruch; Abstand `--gap-compact|default|loose` → `space-sm`, `space-md`,
  `space-lg`; Spalte `min-width: 0`. Die Spaltenformel (Gewicht, Umbruchbreite) bleibt im TSX, weil sie aus dem
  Zustand kommt. `TLColumns` ruft `rootClassName` wie die anderen Controls.
- **Keine neuen Tokens:** Zeilen `size-row`, Kopf `size-bar`, Einzug und Toggle `size-control-sm`, Griffe
  `space-xs`, Ebenen `layer-raised`/`-sticky`/`-popover`. Die Deckkraft beim Ziehen bleibt eine einheitenlose Zahl
  (§9).
- **Icons** über `ThemeIcon` mit `tl-icon-sm`; keine `bi-*`-Klassen im TSX, keine Textzeichen (▲▼▾▸▶▼×), keine
  Inline-SVGs (3a §8.4). Glyphnamen stehen in der Theme-Konfiguration.

## 13 · Gates

Neu, alle im Paket (`node --test`) und im Engine-Gate:

- **Kontrast:** `border-interactive` auf `surface-interactive-selected` (vorhanden, 3a), `status-error-border` und
  `status-warning-border` auf `surface-interactive-selected` und `-hover` (≥ 3,0; dafür Tausch der Stufen und neue
  Stufe `red-34`, 07.10.), `icon-secondary` auf `surface-interactive-selected` (≥ 3,0), `text-placeholder` auf
  `surface-base`, `-layer`, `-layer-nested` (≥ 4,5), beide Modi, jedes Theme.
- **Klassen:** Lint kennt `tl-table`, `tl-tree`, `tl-reorder-list`, `tl-status`, `tl-text`, `tl-columns` und
  `tl-chip__toggle`/`__remove`; keine Zustandsklasse (`--selected`, `--cursor`, `--dragOver-*`, `--active`,
  `--frozen*`, `--pinned*`); `focus-ring` nur in `base.css` (die neue Cursor-Regel liegt dort); `outline` nur
  im Basis-Ring; Rollenfarben nur über `@tl-roles`.
- **Verträge:** neu `table`, `tree`, `reorder-list`, `status`, `text`, `columns`; nachgezogen `pill`, `avatar`, `alert`, `choice`
  (Chip, Segment), `select` (Status, Chip, Filter), `field` (Lesewert, Link-Arten), `skeleton` (erster Aufrufer).
- **Ratsche:** TLTableView, TLTreeView, TLColumnSelect, TLColumns und die drei Text-Blöcke gestrichen; TLJobStatus
  auf den Stand aus `inventory.mjs` (≈ 122) mit Vermerk; `foreignTl` ohne `--tlText-tone`.
- **Engine:** `grep` über `react-src`, `tlReactControls.css`, `*.java`, `*.view.xml` und `docs/faq/` findet (`docs/plans/` trägt je Datei einen Vermerk, 07.10.) keine der
  alten Klassen (`tlTableView`, `tlTreeView`, `tlColumnSelect`, `tlColumns`, `tlText`); kein `rowHeight` im
  Zustand; Modul-Tests `layout.react`, `layout.view`, `layout.configedit`, `demo.react` grün;
  `check-messages-en.sh` ohne Diff; `tsc --noEmit` 0 Befunde.

## 14 · Reihenfolge mit Fertig-Bedingungen

1. **Paket: Grund.** `base.css` Cursor-Ring, `tl-status`, Ziehen-Optik als
   `data-tl-state`-Regeln, `@tl-roles` mit Attribut, Pill/Chip/Segment/Avatar/Alert auf `data-tl-role`, `tl-chip__toggle/__remove`,
   `tl-text`, `tl-columns`. Fertig: Specimen zeigt Status (lädt, leer, Fehler), Kapseln mit Rollen, Text in allen
   Varianten und Tönen, hell und dunkel, beide Dichten; Gates grün.
2. **Paket: Daten.** `tl-table`, `tl-tree`, `tl-reorder-list` mit Verträgen und Specimen (Cursor, Auswahl,
   Ziehen-Zustände, fixierte Spalte, Baumzeile, leer, lädt). Fertig: Gates grün, Lint kennt alle Blöcke.
3. **Engine: Helfer.** `tokenPx`, `filterOptions`, `useListReorder` mit Tastatur und Live-Bereich, `FieldValue`
   mit zwei Link-Arten. Fertig: Select-Popup, Select-Chips und `TLValueList` lesen sie; `layout.react` grün.
4. **Engine: Tabelle.** Raster-Semantik, Cursor, Kästchen, Kopf, Sortieren, Filterleiste, Zellen, Baum- und
   Gruppenzeilen, Ziehen, leer/lädt, `rowHeight` fällt (Java). Fertig: TLTableView-Regeln leer (beide Teile),
   Tests grün.
5. **Engine: Baum, Spaltenwahl, Spalten, Text.** Fertig: alle Blöcke aus §1 gestrichen, `grep` aus §13 leer,
   `messages_en` ohne Diff.
6. **Sichtprüfung** in der Docker-Instanz des PRs, hell und dunkel, beide Dichten: Tastatur durch Tabelle und Baum
   (Ring nur mit Tastatur), Sortieren per Enter, Filter aktiv, fixierte Spalte beim waagerechten Scrollen, Ziehen
   von Zeilen, Spalten, Knoten und in der Spaltenwahl, Alt + Pfeil in der Spaltenwahl mit Ansage, leere Tabelle,
   schnelles Scrollen (Skeleton), Kapseln mit Rollen, TLText-Varianten in der Styling-Demo.
7. **PR** gegen master.

Vor dem Start: Plan-Review durch einen frischen Agenten gegen die Gates (CLAUDE.md), dann SDD.

## 15 · Was das für die Anwendungen heißt

Anwendungs-Stylesheets, die `tlTableView*`, `tlTreeView*`, `tlColumnSelect*`, `tlColumns*` oder `tlText*` lesen,
brechen; die Migrationsliste steht im PR und in `altlast.md`. Wer `rowHeight` aus dem Zustand gelesen hat, liest
`--tl-size-row`. `TextVariant` bleibt als Vokabular unverändert; `TextTone` verliert `accent` (§16) — wer ihn konfiguriert hat, nimmt `strong`.

## 16 · Offen und entschieden

- ~~Ton `accent`~~ **Entschieden 02.10.: fällt.** `text-link` hätte nicht klickbaren Text wie einen Link aussehen
  lassen; Hervorhebung ist `strong` (Bedeutung statt Farbe). `TextTone.ACCENT` geht aus dem Vokabular (Java, JavaDoc,
  `messages_en` über `check-messages-en.sh`), `styling-demo.view.xml:138` nimmt `strong`.
- Spaltenbreite und Fixiergrenze per Tastatur, senkrechtes Auto-Scrollen beim Zeilenziehen, Ziehen-Optik von
  Dashboard und Kalender: in `altlast.md` „Offen“.
