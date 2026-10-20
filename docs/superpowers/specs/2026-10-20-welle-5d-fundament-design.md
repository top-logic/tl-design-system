# Welle 5d · Fundament und Abschluss — Spec

**Stand:** Entwurf 20.10.2026 · Ticket #29914 · Engine-Branch `CWS/CWS_29914_design_system_welle_5d` (auf 5c)
**Grundlage:** Prognose Welle 5 (V13, V15, V16, V17, V21; entschieden 17.10.) und Nachprüfung 5d (V31–V40; entschieden
20.10.) in `docs/migration/altlast.md`.

## 1 · Ziel und Abgrenzung

**Ziel:** `tlReactControls.css` wird gelöscht. Was darin noch steht, zieht ins Paket; die fremden Stylesheets lesen
Paket-Tokens statt alter; wo ein Modul Leiste, Menü, Popup oder Zustand selbst baut, nimmt es die Bausteine des Pakets.

**Wie 5b und 5c: kein neues Bedienkonzept.** Umzug, Zusammenlegen, Fokus, Ansage. Bedienung, die heute kaputt ist,
wird repariert (§12), neue Gesten gibt es nicht.

**Nicht in 5d:**

- Die alten Theme-Tokens und `UIThemeService` bleiben als Brücke (V17). Was aus ihnen wird, entscheiden #29850 und
  #29909 (Lebenszyklus der Kundenthemes); dort auch `data-tl-theme` und der Versionsstempel.
- Das Glass-Theme der Demo (`shadow-glow`, `surface-blur`, Hintergrundbild) bleibt auf seinen alten Tokens.
- Der PDF-Export des Flow-Diagramms (Batik kennt kein `var()`) ist ein eigener Befund.
- Neue Funktionen im Wysiwyg (Tabellen-Operationen, Farbwahl) kommen nicht dazu.

## 2 · Wie die Welle geliefert wird

Ein Branch, gestapelt auf 5c; Welle 5 geht danach als **ein** PR (Hendrik 17.10.). Paket auf `main`, Kopie über
`publish-to-worktree`. Jeder Task endet committet in beiden Repos, die Ratsche fällt Block für Block auf null; am Ende
gibt es die Datei nicht mehr.

## 3 · Fundament: Füllen, Viewport, Mount, Anker (V15, V32, V37)

- **Füllen:** Die Marke `tlFill` heißt `tl-fill` (`FILL_CLASS` in `bridge/fill.ts`); die Regeln `.tl-fill { flex: 1;
  min-height: 0 }` und `.tl-item:has(> .tl-fill) { flex: 1 }` stehen in `layout.css`. Die Vitest-Ausnahme für `tlFill`
  fällt.
- **Viewport und Mount:** `html, body { height: 100%; overflow: hidden }`, `.is-control` und `[data-react-module]` mit
  voller Höhe stehen in `baseCss` (Generator). `is-control` und `data-react-module` setzt weiter der Server.
- **Anker:** Das Aufblitzen nach einem Sprung ist ein Zustand, keine Klasse: `[data-tl-anchor][data-tl-state~="flash"]`
  (`scroll.ts` setzt und entfernt ihn). Ring aus `--tl-focus-width` in `--tl-focus-ring`, Dauer `--tl-duration-loop`
  (1200 ms), Ecke `--tl-radius-sm`. Die eigene Reduced-Motion-Regel fällt; die globale in `baseCss` gilt.
- `tlReactBase.css` verliert die `body`-Regel (steht schon in `baseCss`); es bleibt nur `background-image` für das
  Glass-Theme der Demo, bis #29850 entscheidet.

## 4 · Ebenen und Ziehen (V13, V33, V34, V35)

**Die Ebenenskala bekommt zwei Stufen über dem Toast:**

| Token | Wert | Wofür |
|---|---|---|
| `layer-toast` | 1200 | wie heute |
| `layer-tooltip` (neu) | 1300 | Tooltip, auch über Toast und Popover; heute `layer-popover + 1` |
| `layer-drag` (neu) | 1400 | Zieh-Schild, Zieh-Bild, Picker-Markierung, Ablehnungshinweis |

**Ziehen:** Ein Bild für Maus und Finger, ein Zustand für die Quelle.

- Schild `tl-drag-shield` (`pointer-drag.ts`), Bild `tl-drag-image` mit `--tl-shadow-drag` (`touch-drag.ts`), beide auf
  `layer-drag`, Regeln in `drag.css`.
- Die Quelle beim Ziehen mit dem Finger trägt `data-tl-state~="dragging"` wie beim Ziehen mit der Maus (heute
  `data-touch-drag="source"`); „bereit“ nach dem langen Drücken ist `data-tl-state~="drag-armed"` mit `--tl-shadow-drag`
  und leichter Vergrößerung. `data-touch-drag` fällt.
- Auf Geräten ohne Maus (`pointer: coarse`) verhindert `drag.css` das Markieren und das Kontextmenü auf ziehbaren
  Elementen (heute im alten Sheet).
- **Der Ablehnungshinweis liegt über dem Zieh-Bild** (V34): `tl-drop-hint` liest `layer-drag` und steht im DOM nach dem
  Bild. Heute verdeckt das Bild beim Ziehen mit dem Finger den Grund.

**Element-Picker** (Entwicklerwerkzeug): Markierung `tl-pick-highlight` auf `layer-drag`, Rand `--tl-border-width-md`
in `--tl-border-interactive`, Fläche `--tl-surface-brand-subtle` mit Deckkraft — in beiden Modi aus dem Theme statt
einem festen Blau. Der Zeiger „Fadenkreuz“ ist ein Zustand am `body` (`data-tl-state~="picking"`). Escape läuft über
den Tastatur-Dispatcher (`createScope`/`registerScope` der Bridge, der Picker hat keinen React-Host) statt über einen
eigenen Capture-Listener.

## 5 · Tooltip (V31)

**Der Tooltip bleibt dunkel** (Hendrik 20.10.) — die einzige invertierte Fläche: Hinweis, nicht Menü.

- Neue Rollen **`surface-inverse`** und **`text-inverse`**: hell `{gray-77}` und `{gray-0}`, dunkel `{gray-1}` und
  `{gray-77}`. Das Paar steht in der Paarliste (4,5:1); `derive` rechnet beide für Kundenthemes aus den Kandidaten
  (`text-contrast-light`/`-dark`), wie die gefüllten Kategorien.
- Block `tl-tooltip` im Paket: `__caption` (`tl-type-label-strong`), `__body` (`tl-type-label`; erlaubtes HTML vom
  Server erbt Farbe und Schrift), `__arrow` (Füllung `surface-inverse`). Ebene `layer-tooltip`, Ecke `--tl-radius-md`,
  Schatten `--tl-shadow-popover` als `drop-shadow` (damit der Pfeil ihn trägt), Breite höchstens `--tl-size-13`
  (24 rem, statt 500 px), Abstände `--tl-space-2xs`/`--tl-space-sm`, Einblenden in `--tl-duration-fast`.
- `TooltipPopover.tsx` setzt die neuen Klassen; der interaktive Tooltip ist ein Zustand (`data-tl-state~="interactive"`:
  Zeiger und Textauswahl), keine Klasse ohne Regel mehr. `--tl-tt-padding` fällt aus dem Namensraum.
- **Fehler (Hendrik 20.10.): Der Tooltip folgt dem neuen Anker nicht.** Wechselt der Zeiger von einem Element zum
  nächsten, während der Tooltip offen ist (Beispiel: von Spaltenkopf zu Spaltenkopf), zeigt er den neuen Inhalt, bleibt
  aber am alten Element stehen. Ursache wird beim Bau gesucht (vermutlich bleibt die Referenz von floating-ui beim
  Ankerwechsel stehen); Fertig-Bedingung: ein Vitest, der den Zeiger von einem Anker zum nächsten bewegt und prüft,
  dass die Lage dem neuen folgt.

## 6 · Compact field und „Aktion beim Zeigen“ (V36)

- Block `tl-compact-field` im Paket (`__preview`, `__opener`; bearbeitbar `tl-field` mit Zustand). Der Öffner nimmt
  dieselbe Regel wie der Knopf im Select (`tl-select__controls`): ein Selektor, zwei Leser. Die Klassen setzt
  `ReactCompactFieldControl.java`; `TestCompactField` prüft die neuen Namen.
- **Eine Regel für „Aktion erscheint beim Zeigen“:** `tl-reveal-on-hover` am Element — sichtbar beim Zeigen auf die
  Zeile (`tl-table__row`), auf das eigene Feld, mit Tastaturfokus, und immer auf Geräten ohne Hover. Der Öffner des
  Compact field und der Griff der Liste (`tl-reorder-list__handle`) lesen sie; die zwei Fassungen fallen.

## 6a · Dichte im Benutzermenü (Hendrik 20.10., vorläufig)

Die Dichte (`data-tl-density`, normal/kompakt) hat bisher keinen Schalter: `UIThemeService` setzt einmal `normal`
(verschoben am 30.09., „Kandidat Benutzermenü unter der Themewahl“). 5d bringt ihn dorthin, **vorläufig** — der
UI-Durchgang kann ihn noch verschieben.

- Im Benutzermenü neben der Themewahl (`ThemeCommands`) ein Umschalter „Kompakt“ (`menuitemcheckbox`), Deutsch und
  Englisch über `I18NConstants`.
- Gespeichert je Person wie die Themewahl (`PersonalConfiguration`, eigener Schlüssel); der Server schreibt den Wert vor
  dem ersten Bild an `html` (wie heute `normal`), damit nichts springt. Der Wechsel wirkt sofort ohne Neuladen;
  Maße, die das TSX über `useTokenPx` liest, folgen (der Hook beobachtet `data-tl-density` schon).
- Kein neues Bedienkonzept: ein Eintrag mehr in einem bestehenden Menü.

## 7 · Wysiwyg-Editor (V38)

**Tiptap 3 ist headless:** Die Bibliothek liefert die Schreibfläche (`.ProseMirror`) und Befehle; Leiste, Menüs und
Popup zeichnet unser Code. Ein Update der Bibliothek kann die Styles deshalb nicht brechen; ein Vitest bindet den
Editor ein und prüft Paketklassen und `.ProseMirror` (Hendriks Bedingung, 20.10.).

- **Leiste:** `tl-toolbar` mit `tl-toolbar__group` und senkrechtem `tl-divider` zwischen den Gruppen; Knöpfe als Part
  `Button` (ghost, icon-only) unter `ButtonDefaults`; Umschalter (fett, kursiv, unterstrichen, durchgestrichen, Zitat,
  Code) mit `checked` → `aria-pressed`. Die Leiste bricht um wie heute (`tl-toolbar--wrap`, neu, nur `flex-wrap`); die
  Befehle des Servers bleiben die eingebettete `TLToolbar`.
- **Menüs** (Absatzformat, Liste): Part `MenuTrigger` und `tl-menu` über `usePopover`. Dafür exportiert die Bridge
  `Menu`, `MenuItem` und `useRovingMenu` (heute nur im Controls-Bundle). Genau-eine-Wahl ist **`menuitemradio`** mit
  `aria-checked` — neu im Menü-Vertrag (Absatz/H1–H6, Aufzählung/Nummerierung).
- **Link:** `tl-popover tl-popover--content` mit `label` + `tl-field` (`type="url"`) und Part-Knöpfen „Übernehmen“
  (primary) und „Entfernen“ (danger). Der Fokus kehrt in den Text zurück, nicht zum Auslöser — der Popover-Vertrag
  bekommt dafür ein Rückgabeziel. Den Pfeil des Popups gibt es nicht mehr (kein Popover des Pakets hat einen).
- **Radix fällt** (`@radix-ui/react-dropdown-menu`, `-popover`, `-separator`); kein anderes Modul nutzt es.
- **Glyphen** über Konstanten in `bridge/icons.ts` (Font Awesome wie überall), statt Remix-Klassen im Markup.
- **Schreibfläche:** Rahmen und Fehler wie ein Feld (`tl-field`, `aria-invalid`); der Text trägt `tl-prose` (Überschriften,
  Listen, Code, Zitat, Link, Tabelle aus dem Paket). Was nur der Editor braucht — Innenabstand, Mindesthöhe, Kopfzelle,
  Bildauswahl (`.ProseMirror-selectednode`), Spaltengriffe der Tabelle — steht im Block `tl-rich-text` des Pakets.
  Die Ansicht (nicht bearbeitbar) trägt `tl-prose` ohne Rahmen.
- Namen auf Deutsch und Englisch über `I18NConstants` (auch „Editor toolbar“, heute hart englisch). `--tl-wysiwyg-*`
  fällt aus dem Namensraum.

## 8 · Diagramme (V39, V40)

- **Reihenfarben aus den Kategorien:** Die Reihen lesen `--tl-category-1..8-surface` im Browser (wie `textOn` die
  Kandidaten liest) und lesen neu, wenn `data-tl-mode` oder `data-tl-theme` wechselt. Gitter `--tl-border-separator`,
  Beschriftung `--tl-text-secondary`. Die Hex-Palette in Java (`CHART_COLOR_1..10`, `CHART_GRID_COLOR`,
  `CHART_TEXT_COLOR`) entfällt; aus zehn Farben werden acht (die neunte Reihe nimmt wieder die erste). Diagramme
  erscheinen damit auch im Kundentheme in dessen Farben und sind im dunklen Modus lesbar (heute Beschriftung
  `#374151` auf Dunkel).
- **Tooltip im Diagramm:** die Fläche von `tl-popover` (Rand, Schatten, Ecke), Lage weiter am Datenpunkt.
- **Leer und Fehler:** `tl-status` wie in 5b (`role="status"` bzw. `role="alert"`); das Canvas ist `role="img"` mit
  Namen.

## 9 · Code- und Script-Editor (V39)

- Rahmen, Fokusring und Fehler wie ein Feld (`tl-field`, `aria-invalid`); der Script-Editor bekommt den Fehlerzustand,
  den heute nur der Code-Editor hat.
- Die CodeMirror-Klassen (`.cm-*`) bleiben (Bibliothek) und lesen Paket-Tokens; Schrift und Zeilenhöhe über
  `tl-type-code` am Editor statt alter Typo-Tokens. Aktive Zeile `--tl-surface-interactive-selected`; Auswahl im
  Script-Editor `--tl-surface-brand-subtle`.
- Die Stylesheets bleiben ungeschichtet (sie müssen das Laufzeit-Theme von CodeMirror schlagen); das Script-Editor-CSS
  deklariert `requires` auf das Code-Editor-CSS.

## 10 · Fremde Stylesheets auf Paket-Tokens (V16, V40)

Jede Datei liest Rollen des Pakets (Zuordnung in `altlast.md` V40 und unten); Klassen der Bibliotheken bleiben.

| Altes Token | Paket |
|---|---|
| `border-subtle` | `border-control` (Feldrahmen) bzw. `border-separator` (Trenner) |
| `corner-radius`, `border-radius-02`, `border-radius-03` | `radius-sm`, `radius-md`, `radius-md` |
| `focus` | `focus-ring` (Breite `focus-width`) |
| `spacing-01/02/03/04/06` | `space-2xs/xs/md/lg/2xl` |
| `support-error`, `support-warning`, `support-success` | `status-*-text` bzw. `-border` je Verwendung |
| `text-primary`, `text-secondary`, `link-primary`, `text-accent` | `text-primary`, `text-secondary`, `text-link`, `text-link` |
| `layer-01`, `layer-02`, `layer`, `field` | `surface-layer`, `surface-overlay`, `surface-layer-nested`, `surface-field` |
| `layer-hover`, `background-selected`, `layer-selected(-hover)` | `surface-interactive-hover`, `-selected`, `surface-brand-subtle(-hover)` |
| `layer-accent`, `layer-accent-text` | `surface-interactive-selected`, `text-primary` |
| `shadow-menu` | `shadow-popover` |
| `background-inverse`, `text-inverse` | `surface-inverse`, `text-inverse` (neu, §5) |
| `button-primary(-hover)`, `interactive`, `border-interactive` | `surface-brand(-hover)`, `text-link` bzw. `border-interactive` |
| `font-family`, `font-family-mono` | `font-family-sans`, `font-family-mono` |
| Schriftgrößen und Zeilenhöhen | Typo-Klasse am Element; wo das nicht geht (Bibliothek), `--tl-font-size-*` |
| `text-on-color` (`MuiTextAdapter`) | `text-on-brand` |

- Ebenen: das Wysiwyg-Literal 10000 fällt mit dem Umbau (§7); Chart 100/10 → `layer-sticky`/`layer-raised`.
- Die fünf Audit-Tests (`Test*StylesheetTokens`) lesen `tl-design-system/tokens.css` mit; sonst schlüge jedes
  `var(--tl-…)` fehl.
- Die Demo (`tl-demo-react.css`) liest Paket-Tokens bis auf das Glass-Theme (§1).

## 11 · `tlReactControls.css` wird gelöscht

- Datei, Eintrag `tl-react-controls-css` in `tl-layout-react.conf.config.xml`, das `requires` darauf in der Demo-Config,
  die Prüfung in `TestReactStylesheetTokens`, Verweise in der Engine-Doku (`tl-docs`).
- Die Ratsche hat danach nichts mehr zu zählen: `test/ratchet.json` und `tools/inventory.mjs` prüfen, dass die Datei
  fehlt (der Test wird zur Wache: wer sie wieder anlegt, bricht ihn).
- `test/engine-classes.test.mjs` bekommt `ALT_5D` (alte Klassen dieser Welle, `tlFill`, `data-touch-drag`,
  `tlDragShield`, `tlTouchDragImage`, `tlPick--active`, `tlAnchor--flash`, `tl-tooltip-popover`, `tlCompactField`,
  `tlWysiwygToolbar`, `tlReactChart__tooltip`).

## 12 · Bedien-Gewinne (ohne neues Bedienkonzept)

- **Wysiwyg mit der Tastatur:** Enter und Leertaste auf einem Knopf der Leiste tun heute nichts (nur `mousedown`); mit
  dem Part `Button` funktionieren sie. Umschalter sagen ihren Zustand an (`aria-pressed`), die Menüs ihre Wahl.
- **Tooltip im Kundentheme lesbar** und über Toasts sichtbar.
- **Diagramme im dunklen Modus und im Kundentheme lesbar.**
- **Ablehnungsgrund beim Ziehen mit dem Finger sichtbar.**
- **Tooltip bleibt am Element**, auf das man zeigt (heute bleibt er beim Wechsel von Spaltenkopf zu Spaltenkopf stehen).
- **Kompakte Darstellung wählbar** im Benutzermenü.
- **Ein Fokusring überall**, auch im Wysiwyg (heute fünf Stellen ohne) und in den Editoren.

## 13 · Gates

Paket `node --test` (neu: `tl-tooltip`, `tl-rich-text`, `tl-compact-field`, Paar `text-inverse`/`surface-inverse`,
Ebenen, `menuitemradio` im Vertrag, `tl-reveal-on-hover`); `lint-css`; `tsc` in allen React-Modulen; MUI-Vitest
(neu: Wysiwyg, Chart, Tooltip, Picker-Escape, Touch-Zustände); Maven `layout.react`, `layout.react.wysiwyg`,
`layout.react.chartjs`, `layout.react.codeedit`, `model.search.react`, `react.flow.server`, `layout.view`,
`demo.react`; `check-messages-en.sh`; Sichtprüfung in der lokalen Demo.

## 14 · Reihenfolge mit Fertig-Bedingungen

1. **Paket:** Ebenen, Rollen `surface-inverse`/`text-inverse` (mit `derive`), Blöcke `tl-tooltip`, `tl-rich-text`,
   `tl-compact-field`, `tl-reveal-on-hover`, `tl-drag-shield`/`-image`, `tl-pick-highlight`, Füllen/Viewport/Anker,
   `menuitemradio`, `tl-toolbar--wrap`. Fertig: Gates grün, Specimen.
2. **Fundament in der Engine:** `tl-fill`, Viewport, Anker, Picker (mit Escape), Ziehen (Schild, Touch, Hinweis).
   Fertig: Blöcke leer, Vitest.
3. **Tooltip.** Fertig: Block leer, Vitest.
4. **Compact field und „Aktion beim Zeigen“.** Fertig: Block leer, `TestCompactField`.
4a. **Dichte im Benutzermenü** (§6a). Fertig: Menüeintrag, Speicherung je Person, Wert vor dem ersten Bild, Test.
5. **Bridge-Exporte** (`Menu`, `MenuItem`, `useRovingMenu`, Rückgabeziel des Popovers). Fertig: `tsc`, Vitest.
6. **Wysiwyg.** Fertig: Radix weg, Vitest, Wysiwyg-Audit grün.
7. **Diagramme.** Fertig: Java-Palette weg, Vitest, Chart-Audit grün.
8. **Code- und Script-Editor, Flow, Demo, `tlReactBase.css`, `MuiTextAdapter`.** Fertig: Audits grün.
9. **Löschen:** `tlReactControls.css`, Ratsche, `ALT_5D`. Fertig: alle Gates.
10. **Sichtprüfung und Abschluss** (Orchestrator).

## 15 · Was das für die Anwendungen heißt

- Stylesheets, die `tlFill`, `tl-tooltip-popover`, `tlCompactField*`, `tlWysiwyg*`, `tlReactChart*` oder
  `data-touch-drag` ansprechen, ziehen auf die neuen Namen und Zustände um.
- Eine eigene Diagrammpalette über `CHART_COLOR_*` gibt es nicht mehr; die Farben kommen aus den Kategorien des Themes
  (Kundenthemes über `derive`).
- `tlReactControls.css` gibt es nicht mehr; wer sie per `requires` verlangt, verlangt `tl-design-system-components`.
- Bridge-API neu: `Menu`, `MenuItem`, `useRovingMenu`.

## 16 · Offen und entschieden

| # | Frage | Entscheidung |
|---|---|---|
| 1 | Tooltip hell oder dunkel | dunkel, neue Rollen (Hendrik 20.10.) |
| 2 | Wysiwyg umbauen oder nur Tokens | umbauen; Bedingung „Update der Bibliothek bricht die Styles nicht“ erfüllt (Hendrik 20.10.) |
| 3 | Diagrammfarben | in 5d auf Kategorien (Hendrik 20.10.) |
| 4 | Ebenen | `layer-tooltip` 1300, `layer-drag` 1400 (Orchestrator) |
| 5 | Tooltip-Breite | `size-13` (24 rem) statt 500 px (Orchestrator) |
| 6 | Pfeil am Link-Popup | entfällt (Orchestrator) |
| 7 | Zehn Diagrammfarben → acht | acht, die neunte Reihe wiederholt (Orchestrator) |
| 8 | Tooltip folgt dem Anker nicht | in 5d beheben, mit Vitest (Hendrik 20.10.) |
| 9 | Dichte-Schalter | in 5d ins Benutzermenü, vorläufig bis zum UI-Durchgang (Hendrik 20.10.) |
