# Welle 3a — Navigation und Popups: ein Popup, ein Menü, ein Ring

**Stand:** 2026-10-01 · Ticket #29617
**Baut auf:** [`2026-09-17-design-system-neuaufbau-design.md`](2026-09-17-design-system-neuaufbau-design.md) §4 Wellen,
§5 Gates; [`2026-09-30-welle-2-formulare-design.md`](2026-09-30-welle-2-formulare-design.md) §2 (Wellen überlappen,
ein PR je Welle); `docs/skalen.md` „Zeigen auf allen Gründen“, „Gleiches wird zusammengelegt“, „Fokus: ein Ring“,
„Button: vier Erscheinungen“, „Scrim und Ebenen“; Prognosen `docs/migration/altlast.md` „Konsolidierung (01.10.)“
**Entschieden mit Hendrik:** 01.10., in dieser Sitzung (Fragen 1–2, Konsolidierungsbündel, Abschnitte 1–7 freigegeben)

---

## 1 · Ziel und Abgrenzung

Welle 3 schneidet Datendarstellung und Navigation aus `tlReactControls.css` heraus. Sie läuft als **eine Welle in
zwei gestapelten PRs**: **3a Navigation und Popups** (diese Spec) und **3b Daten** (Tabelle, Baum, Spaltenwahl,
Spalten; eigene Spec). 3b baut auf 3a, weil Tabelle und Baum das Popup, den Toggle, den Icon-Knopf und die
Fokusregel aus 3a lesen.

Fertig ist 3a, wenn die sechs Blöcke unten leer und aus `test/ratchet.json` gestrichen sind — nicht, wenn die
neuen Leisten aussehen wie die alten.

| Gruppe | Controls (TSX, `react-src/controls/`) | Alte Blöcke (Zeilen) |
|---|---|---|
| Popup und Menü | `TLMenu`, `TLMenuRegion`, Spalten-Kontextmenü in `TLTableView.tsx:1701–1741` (nur der Popup-Teil) | TLMenu 117, TLMenuRegion 29, User menu 17 |
| Toolbar | `TLToolbar` samt Overflow-Dropdown | TLToolbar 137 + Dropdown-Teil (`tlReactControls.css` 5641–5680) |
| Leisten | `TLTabBar`, `TLBreadcrumb` | TLTabBar 125 (+ `__content` 291–307), TLBreadcrumb 50 |

Summe 475 Zeilen plus Dropdown-Teil. Dazu zwei Fremddefinitionen im Namensraum `--tl` (`--tl-toolbar-trigger-size`,
`--tl-toolbar-shrink-priority`, `tlReactControls.css` 4634–4647), die mit der Toolbar fallen.

**Nachzüge aus Welle 2 im selben PR** (Konsolidierung W1, W4, W5): das Select-Popup liest den Popover-Helfer und
die Fläche `tl-popover`; `TLFormGroup` liest den Toggle; `tl-select__chip-remove`, `tl-select__clear` und
`tl-field-group__action` werden Icon-Knöpfe — drei CSS-Blöcke des Pakets fallen.

**Nicht Ziel:** Tabelle, Baum, Spaltenwahl, Spalten (3b); Untermenüs, Typeahead, Reiter-Überlauf; Sidebar-Flyout,
Color- und Icon-Popup (Welle 4/5, Konsolidierung N4); Dialog und Drawer (Welle 4). Der Zustand wird nicht neu
geschnitten; Verträge verweisen auf `state.proto`, wo es liegt (UI-Paket-Spec §4).

## 2 · Wie die Welle geliefert wird

**Zwei PRs, eine Welle** (Hendrik, 01.10.): Die Konsolidierung (W1–W12, N1, N8 in `altlast.md`) macht Welle 3
größer als fünf Komponenten; ein Review über alles wäre nicht mehr abschnittsweise lesbar. 3b wird auf dem Branch
von 3a gebaut, wie 3a auf dem von Welle 2.

**Branch:** `CWS/CWS_29617_design_system_welle_3a`, von `CWS/CWS_29617_design_system_welle_2` (!1740, im Review),
weil 3a `TLDropdownSelect.tsx`, `TLFormGroup.tsx` und `button.css` anfasst, die dort geändert sind. Nach dem Merge
von !1740 auf master umstellen; der PR geht gegen master. Vor jedem Push `git fetch` — Bernhard committet direkt
auf unsere Branches.

**Konsolidierung vor Haut:** jede Stelle, die diese Spec zusammenlegt, steht mit Befund und Prognose in
`altlast.md` „Konsolidierung (01.10.)“ (W1 Popups, W2 Einträge, W3 Fokus, W4 Toggles, W5 Icon-Knöpfe, W9 Trenner,
W12 Toolbar, N8 Verträge). Diese Spec sagt, *wie*; die Tabelle sagt, *warum*.

## 3 · Ein Popup, ein Menü

### 3a · Der Helfer

Heute rechnen acht Stellen die Position von Hand (`TLMenu.tsx:37–76` in zwei Modi, `TLToolbar.tsx:122–152`,
`TLDropdownSelect.tsx:276–296`, `TLTableView.tsx` ohne Rechnung bei `zIndex: 10000`, `placeDropHint`, Color-,
Icon-Popup, Sidebar). Nur der Tooltip (`bridge/TooltipPopover.tsx`) nutzt `@floating-ui/react` — die Abhängigkeit
ist da.

Neu: **`bridge/popover.ts`**, ein Hook auf floating-ui: Portal nach `document.body`, Anker = Element-Rechteck oder
Punkt, `offset` = `space-xs`, `flip`, `shift` (bleibt im Viewport), `autoUpdate` (Scroll, Resize), Ebene
`layer-popover`. Dazu **ein** Verhalten: Escape schließt, Außenklick schließt (`useCloseOnOutsidePress`), der Fokus
kehrt zum Auslöser zurück. Leser in 3a: `TLMenu`, Spalten-Kontextmenü, Toolbar-Overflow, Select-Popup. Die
Handrechnungen dieser vier fallen; Color, Icon, Sidebar folgen in Welle 4/5.

### 3b · Die Fläche

`tl-popover`: `surface-overlay`, Rand `border-width-sm` `border-separator`, `radius-md`, `shadow-popover`,
`min-width: size-popover-min`, `max-height: size-popover-max`, `overflow: auto`, `z-index: layer-popover`. Das
Select-Popup (`select.css:121–138`) liest sie und verliert seine eigenen Flächenregeln.

### 3c · Das Menü

`menu.css`: `.tl-menu` (= `tl-popover` + `role=menu`), `.tl-menu__item` (`role=menuitem`, `min-height: size-row`,
`gap: space-xs`, Icon `tl-icon-sm`, Label mit Ellipse wie `tl-button__label`), `.tl-menu__header`
(`role=presentation`, `tl-type-label`, `text-secondary`), Trenner `tl-divider` (§6). Zustände **nur als Attribute**:
`aria-current="true"` (aktiver Eintrag, Typo-Klasse `tl-type-body-strong` statt `tl-type-body`), `disabled` (`text-disabled`,
`cursor: default`). Die Klassen `--active`, `--disabled`, `--focused` fallen.

**Echter Fokus:** Roving-Tabindex; Pfeile auf/ab (zyklisch), Home/End, Enter/Space wählen, Escape schließt. Der
DOM-Fokus wandert mit, `:focus-visible` zeichnet den Ring (§5), Zeigen mit der Maus ist
`surface-interactive-hover` — nach „Zeigen auf allen Gründen“ auch dunkel auf dem Overlay sichtbar.
`scrollIntoView` auf eine Cursor-Klasse entfällt; der Browser scrollt den fokussierten Eintrag.

**Drei Menüs, eine Komponente:** das Spalten-Kontextmenü der Tabelle wird eine `TLMenu`-Instanz (Einträge aus dem
Zustand, kein handgebauter Popup). Der Toolbar-Overflow rendert seine Button-Controls über
`ButtonDefaults appearance="menu-item"`: `TLButton` gibt dann `button.tl-menu__item` mit Icon und Label aus; die
Welle-1-Übergangsregel „Dropdown-Eintrag füllt die Zeile“ (`tlReactControls.css` 5659–5674) fällt.

## 4 · Toolbar

- **Klassen:** `tl-toolbar` (`role=toolbar`), `__group`; die Einträge sind die Button-Controls selbst; Trenner
  `tl-divider--vertical` (streckt sich; die Toolbar gibt `padding-block: space-2xs`). Zustände als Attribute:
  `data-tl-overflow="leading|trailing"` statt `--collapsible`, `data-tl-compact` statt `--compact`.
- **Trigger** = gewöhnlicher `tl-button` in der Erscheinung der Toolbar (`ButtonDefaults`, meist `ghost`); der
  Overflow-Trigger ist `tl-button--icon` (§6) mit dem Overflow-Glyph, der beschriftete Gruppentrigger trägt einen
  Chevron als `tl-icon-sm`. Der Eigenbau-Secondary (`tlToolbar__menuTrigger`, Inset-Rahmen, eigene Schrift) fällt.
- **Kompakt heißt: der Container wählt.** Die Toolbar reicht `iconOnly` über `ButtonDefaults`; `TLButton` rendert
  dann ohne `__label`, mit `aria-label` und Tooltip. Die Übergangsregel „kompakte Toolbar blendet `tl-button__label`
  aus“ (`tlReactControls.css` 4659–4671) fällt. Die Messphase (`measureUnits`) schaltet den Kontext statt der Klasse
  und misst volle und kompakte Breite wie heute.
- **Kollaps-Logik bleibt** — sie ist die einzige im Bestand (`TLToolbar.tsx:266–452`, `ResizeObserver`).
  `--tl-toolbar-trigger-size` fällt: das TSX misst den gerenderten Trigger (`measureUnits` liest ihn schon).
  `--tl-toolbar-shrink-priority` fällt: die zwei Host-Regeln (`.tlPanel__header …` 1116–1121, `.tlAppBar__actions`
  2113–2118) bekommen bis Welle 4 ein Literal `flex-shrink` mit Übergangskommentar — keine `--tl`-Definition mehr
  außerhalb des Pakets; `foreignTl` wird um beide Namen gekürzt.
- **Overflow-Menü** = `tl-menu` (§3c) über den Helfer, Gruppen durch `tl-divider`, bleibt gemountet und `[hidden]`,
  damit die Controls leben (wie heute).

> **Fortgeschrieben 01.10. (Plan-Review):** Kompakt wird nur ein Knopf, der sein Icon **zeigt** (`icon-label`,
> `icon-only`) — ein `label-only`-Knopf mit Bild behält sein Label, wie die alte Regel. Die kompakte Breite wird in
> einem **zweiten Messdurchlauf** mit `iconOnly`-Kontext gemessen, nicht aus dem Icon geraten (Upload- und
> Umschaltknöpfe lesen den Kontext mit). Die Breite des noch nicht gerenderten Überlauf-Triggers ist das Maß
> `size-control`, aus den Tokens gelesen. `menu-item` als Container-Erscheinung schlägt die Server-Erscheinung — ein
> Eintrag ist Struktur, kein Stil; ein Umschalter im Menü ist `role="menuitemcheckbox"` mit `aria-checked`.

## 5 · Fokus und Cursor: eine Regel

1. **Ein Ring, eine Farbe:** der `:focus-visible`-Ring aus `base.css` (`focus-ring`, `focus-width`, `focus-offset`)
   ist die einzige Fokuszeichnung. `outline: none` an Baum, Menü und Suchfeldern und die Tab-Regel mit `:focus`
   fallen mit ihren Blöcken; das alte `--focus` (`#2968C8`) verschwindet mit ihnen.
2. **Zwei Lagen, ein Maß:** außen (`outline-offset: focus-offset`) an freistehenden Controls — Knöpfe, Tabs,
   Breadcrumb-Einträge, Felder; **innen** (`calc(-1 * focus-offset)`) an Einträgen in scrollenden Behältern —
   Menüeintrag, Zeile, Knoten. Keine anderen Offsets.
3. **Echter Fokus bei kleinen Listen:** Menü und Reiter bewegen den DOM-Fokus (Roving-Tabindex); der Ring ist der
   Cursor.
4. **Virtueller Cursor bei großen Listen** (3b): Tabelle und Baum behalten den Container-Fokus mit Zeilen-Cursor,
   dazu `aria-activedescendant`; der Cursor-Ring (innen, `data-tl-state~="cursor"`) erscheint nur bei
   `:focus-within` des Containers.
5. **Hervorhebung ist kein Fokus:** die Akzentlinie im Select-Popup (`highlighted`) bleibt — dort liegt der
   DOM-Fokus im Suchfeld.

> **Fortgeschrieben 01.10. (Plan-Review):** Ein **Drop-Ziel ist kein Fokus**: die Dragover-Markierung des Uploads
> (und in 3b die Drop-Ziele von Tabelle und Baum) setzt `outline` in `border-interactive`; `focus-ring` liest nur
> `base.css`. Das Gate verbietet `focus-ring` in Komponenten und `outline` in jeder anderen Farbe. In Kraft (Menü)
> trägt die Typo-Klasse `tl-type-body-strong` (sonst `tl-type-body`), nicht eine `font-weight`-Regel am Eintrag.

## 6 · Drei Bausteine: Icon-Knopf, Toggle, Trenner

- **Icon-Knopf** `tl-button--icon`: quadratisch `size-control` (32 px), mit `--sm` `size-control-sm` (24 px,
  WCAG 2.5.8), `padding: 0`, Icon `tl-icon-md` bzw. `-sm`, kein `__label`; Pflicht `aria-label` und Tooltip (im
  Vertrag; TSX-Lint später). Hover, Pressed, Disabled und `aria-pressed` (Markenfläche subtil + `border-interactive`)
  erbt er von `tl-button`. Leser 3a: Overflow-Trigger, Hilfeknopf (`TLFormField.tsx:143`, schon `--ghost --sm`),
  Nachzug: `tl-select__chip-remove`, `tl-select__clear` (`select.css:61–86`), `tl-field-group__action`
  (`field.css:84–96`) → `tl-button--icon tl-button--sm tl-button--ghost`; die drei Blöcke fallen. 3b:
  `barButton`, `columnsButton`, `filterButton`, `groupBy`.
- **Toggle** `tl-toggle` (Auf-/Zuklappen): ein `button`, 24 px quadratisch, Ghost-Optik, `aria-expanded`,
  `aria-controls`, `aria-label` + Tooltip; **ein** Glyph (Chevron rechts, `tl-icon-sm`), der bei
  `aria-expanded="true"` um 90° dreht (`duration-fast`, Reduced-Motion-Block gilt). Zwei Wörter, zwei Richtungen:
  ein **Toggle** zeigt rechts = zu, unten = offen; ein **Dropdown-Indikator** (Select-Pfeil, `aria-hidden`) zeigt
  unten = zu, oben = offen. Leser 3a: `TLFormGroup` (Nachzug; `tl-form-group__toggle`, `form.css:161–178`, fällt).
  3b: Baumknoten, Baum-Tabelle. Welle 4: Sidebar.
- **Trenner** `tl-divider` als `<hr>`: horizontal im Menü und Overflow, `--vertical` in der Toolbar; Abstände setzt
  der Behälter (`.tl-menu > .tl-divider { margin-block: space-2xs }`), nicht der Trenner. Die drei zeilengleichen
  `<hr>`-Blöcke (`tlReactControls.css` 2880, 5676, 1380) und `tlToolbar__separator` (4673) fallen; Sidebar in
  Welle 4.

## 7 · Reiter, Breadcrumb, Menü-Auslöser, Benutzermenü

- **Reiter** `tl-tabs` (`role=tablist`), `__tab` (`role=tab`, `aria-selected`, `aria-controls`, Roving-Tabindex,
  Pfeile links/rechts, Home/End), `__panel` (`role=tabpanel`, `aria-labelledby`, scrollt). Aktiv = Akzentlinie
  unten (`border-width-accent`, `border-interactive`) und `text-primary`; inaktiv `text-secondary`; **kein
  Fettdruck** (nichts springt). Höhe `size-control`, Abstände `space-sm`/`space-md`, Icon `tl-icon-sm`, Hover
  `surface-interactive-hover`. Die Klasse `--active` fällt (Zustand ist `aria-selected`).
- **Breadcrumb** `tl-breadcrumb` (`nav` > `ol` > `li`): Einträge `tl-button--link`, aktuelle Seite
  `span[aria-current="page"]` in `text-primary`, Trenner `tl-icon-sm`-Chevron (`aria-hidden`) statt Inline-SVG.
  Das hartkodierte `aria-label="Breadcrumb"` (`TLBreadcrumb.tsx:28`) wird ein Resource-Key `js.breadcrumb.label`
  (JavaDoc → `check-messages-en.sh`).
- **Menü-Auslöser** `tl-menu-region`: bei `trigger='click'` `role=button`, `aria-haspopup="menu"`, **neu
  `aria-expanded`** (heute nie gesetzt; die alte Regel `.tlMenuRegion--click[aria-expanded="true"]` griff nie),
  Fokusring, Hover. Die Region gibt dem Menü ihr Element als Anker, nicht `rect.left/bottom` als Punkt — damit das
  Menü umklappt. Kontextmenü-Variante: `Shift+F10` und die Kontextmenü-Taste öffnen am Element (heute keine
  Tastatur).
- **Benutzermenü** (`user-menu.view.xml`) ist kein Block mehr: der Auslöser (Avatar + Name) wird ein
  `tl-button--ghost` mit Avatar im Icon-Slot und Name als `__label` (Ellipse). Eine eigene Breitengrenze gibt es
  nicht; die Regel `@media (max-width: 640px)` (`max-width: 12rem`) und `tlUserMenu__name` fallen.

> **Fortgeschrieben 01.10. (Plan-Review):** Das Benutzermenü liegt im `trailing` der AppBar, nicht in einer
> Toolbar — der Kompaktmodus aus §4 erreicht es nicht. „Bei Platzmangel nur der Avatar“ ist damit eine Regel der
> AppBar (Breakpoints) und geht nach **Welle 4**; bis dahin schneidet der Name mit Ellipse ab. Vermerk in
> `altlast.md` „Offen für spätere Wellen“.
>
> **Fortgeschrieben 01.10. (beim Bauen, E8):** Die Ellipse greift nicht von selbst. `tl-button__label` schneidet
> erst ab, wenn etwas die Breite begrenzt, und mit `max-width: 12rem` fiel die einzige Grenze. Ein langer Name
> verbreitert den Auslöser deshalb bis Welle 4. Die Breitengrenze gehört zur AppBar-Regel der Welle 4 und nicht
> in einen neuen Block im alten Stylesheet; `altlast.md` führt sie beim AppBar-Breakpoint mit.

## 8 · Tokens und Maße

1. **Zeigen auf allen Gründen** (skalen.md, 01.10.): `primitives.json` bekommt `gray-64` und `gray-60` (aus der
   Rampe, gleicher Farbton wie `gray-70`); `tokens.json` dunkel: `surface-interactive-hover` → `{gray-67}`,
   `-selected` → `{gray-64}`, `-active` → `{gray-60}`. Hell unverändert. Paarliste: `text-primary` auf allen drei
   (vorhanden), `border-interactive` auf `-selected` 3,63. `derive` rechnet die Stufen über `grauRampe` mit.
   `surface-disabled` dunkel bleibt `gray-69` — liegt jetzt zwischen Overlay und Hover; Satz in skalen.md „Disabled“.
2. **Zwei Maße:** `size-popover-min` (`10rem`, Mindestbreite eines Menüs) und `size-popover-max` (`70vh`, Höhe) in
   `primitives.json`, Leser `tl-popover`. Sonst keine neuen Maße: Einträge `size-row`, Knöpfe und Toggle
   `size-control`/`-sm`, Abstände `space-*`, Akzent `border-width-accent` — alles folgt `data-tl-density`.
3. **Ebenen:** jedes Popup liest `layer-popover`. Das `zIndex: 10000` des Tabellenmenüs fällt mit ihm; die
   Tooltip-Regel im Altbestand (`9999999999999999`, `tlReactControls.css` 5507) liest ab 3a `layer-popover`, ihr
   Block bleibt bis Welle 4.
4. **Icons:** jedes Icon der Welle läuft über `ThemeIcon` mit `tl-icon-sm`/`-md`; keine nackten `<i class="bi …">`,
   keine Textzeichen (▾ ▸ ×), keine Inline-SVGs. Glyphnamen stehen in der Theme-Konfiguration, nie im CSS — ein
   späterer Wechsel der Icon-Bibliothek (Hendrik: z. B. Lucide prüfen) trifft dann nur die Konfiguration. Specimen
   laden einheitlich Bootstrap Icons; `button`- und `pill`-Specimen werden nachgezogen (altlast „Paket“).

## 9 · Gates

Neu, alle im Paket (`node --test`):

- **Kontrast:** die drei neuen Dunkelstufen gegen `text-primary` (≥ 4,5) und `border-interactive` auf
  `surface-interactive-selected` (≥ 3,0), beide Modi, jedes Theme; `focus-ring` auf `surface-overlay` (vorhanden).
- **Klassen:** Lint kennt die Blöcke `tl-popover`, `tl-menu`, `tl-menu-region`, `tl-toolbar`, `tl-tabs`,
  `tl-breadcrumb`, `tl-toggle` und den Modifier `--icon` am Button; `outline` nur im Basis-Ring, `outline-offset`
  nur `focus-offset` oder dessen Negativ; `tl-button--icon` und `tl-toggle` sind quadratisch aus
  `size-control`/`-sm`; keine Zustandsklasse.
- **Verträge:** neu `popover`, `menu`, `toolbar`, `tabs`, `breadcrumb`, `toggle`; nachgezogen `button` (`--icon`,
  `appearance="menu-item"`, `iconOnly`), `divider`, `select` (Popup über `tl-popover`), `form` (Toggle). Je
  Zustand, Aktionen, Tastatur, Tokens, Attribute, Konformität. Doku-Pass N8: `disabled`, `hidden`, „Chip“,
  `aria-selected` in den Welle-2-Verträgen berichtigt; `specimen/specimen.css` ersetzt die 13 `<style>`-Blöcke.
- **Ratsche:** die sechs Blöcke aus §1 und der Dropdown-Teil gestrichen; `foreignTl` ohne
  `--tl-toolbar-trigger-size` und `--tl-toolbar-shrink-priority`.
- **Engine:** `grep` über `react-src`, `tlReactControls.css` und `docs/` findet keine der alten Klassen (`tlMenu`,
  `tlMenuRegion`, `tlUserMenu`, `tlToolbar`, `tlReactTabBar`, `tlBreadcrumb`); keine `--tl`-Definition außerhalb
  `tl-design-system/`; Modul-Tests `layout.react`, `layout.view`, `demo.react` grün; `check-messages-en.sh` ohne
  Diff; `tsc --noEmit` ohne neuen Befund in den angefassten Dateien.

## 10 · Reihenfolge mit Fertig-Bedingungen

1. **Paket: Grund.** Graustufen und Maße (§8), `popover.css`, `menu.css`, `toggle.css`, `tl-button--icon`,
   `tl-divider` nachgezogen, Kontrast-Gates. Fertig: Specimen zeigt Menü mit Header, Trenner, aktivem und
   deaktiviertem Eintrag, Überlauf, hell und dunkel, beide Dichten; Gates grün.
2. **Paket: Leisten.** `toolbar.css`, `tabs.css`, `breadcrumb.css`, `menu-region` in `menu.css`; Verträge; Doku-Pass
   N8. Fertig: Gates grün, Lint kennt alle Blöcke und Modifier.
3. **Engine: Popups.** Branch `CWS/CWS_29617_design_system_welle_3a` von `welle_2`; `bridge/popover.ts`; `TLMenu`
   mit Roving-Fokus; Tabellenmenü als `TLMenu`-Instanz; Toolbar-Overflow über `appearance="menu-item"`;
   Select-Popup auf Helfer und `tl-popover`. Fertig: Block `TLMenu` leer, `layout.react` grün.
4. **Engine: Leisten und Nachzüge.** Toolbar (`iconOnly`, Trigger als `tl-button`, Host-Literale), TabBar mit
   Tastatur, Breadcrumb mit Key, MenuRegion mit `aria-expanded` und Tastatur, Benutzermenü, FormGroup-Toggle, drei
   Icon-Knopf-Blöcke der Welle 2. Fertig: sechs Blöcke gestrichen, `foreignTl` −2, `grep` aus §9 leer, Tests grün,
   `messages_en` ohne Diff.
5. **Sichtprüfung** in der Docker-Instanz des PRs, hell und dunkel: Menü am Fensterrand klappt um und folgt dem
   Scrollen; Kontextmenü per `Shift+F10`; Toolbar läuft über und wird kompakt; Reiter per Pfeiltasten; Benutzermenü
   bei Platzmangel; Select-Popup folgt dem Scrollen; Hilfeknopf, Chip-Entfernen und Feld-Löschen 24 px.
6. **PR** gegen den Branch von !1740 (nach dessen Merge gegen master), Bernhard Reviewer, Trac #29617 CC;
   Beschreibung englisch, Migrationsliste alt → neu für Anwendungs-Stylesheets.

Vor dem Start: Plan-Review durch einen frischen Agenten gegen die Gates (CLAUDE.md), dann SDD.

## 11 · Nicht-Ziele und Offenes

- Untermenüs, Typeahead, Reiter-Überlauf: nicht in Welle 3; in `altlast.md` „Offen“ notiert.
- Icon-Bibliothek: Wechsel (z. B. Lucide) später prüfen — 3a bindet nichts an Glyphnamen.
- `[hidden]` je Block bleibt (Welle-2-Entscheidung mit Gate); Warnung/Fehler-Blöcke bleiben je Komponente
  (absichtlich verschieden) — N7, `altlast.md`.
- Die Fehlermeldung doppelt (N2) und `aria-disabled` am Select (N9): eigenes Paket nach Merge von !1740.
- Offen, nicht blockierend: wo `derive` rechnet (Bernhard, 25.09.); Dichte-Schalter (30.09.).
