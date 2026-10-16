# Welle 4c · Behälter — Design

**Ticket:** Trac #29870 · **Branch:** `CWS/CWS_29870_design_system_welle_4c` auf `CWS/CWS_29866_design_system_welle_4b`
(!1906) · **Grundlage:** Konsolidierungs-Prognose in `docs/migration/altlast.md` „Welle 4c“ (Q3, Q7, Q8, Q13–Q23; von
Hendrik am 16.10. angekreuzt: alle wie vorgeschlagen) · **Stand:** Entwurf zur Freigabe; was beim Schreiben entschieden
wurde, steht in §12.

## 1 · Ziel und Abgrenzung

Die Behälter der React-Schicht lesen das Paket; ihre alten Blöcke fallen aus `tlReactControls.css`:

| Block | Zeilen | Control |
|---|---|---|
| TLPanel | 130 | `TLPanel.tsx` |
| TLPanel button bar | 16 | `TLPanel.tsx` |
| TLSplitPanel | 26 | `TLSplitPanel.tsx` |
| Collapsed panel in horizontal split | 28 | `TLSplitPanel.tsx`, `TLPanel.tsx` |
| TLStack | 33 | `TLStack.tsx` |
| TLGrid | 14 | `TLGrid.tsx` |
| TLDeckPane | 13 | `TLDeckPane.tsx` |
| TLTileStack | 76 | `TLTileStack.tsx` |
| TLInset | 60 | `TLInset.tsx` |
| TLCard | 52 | `TLCard.tsx` |
| TLAdaptiveDetail (responsive master-detail) | 51 | `TLAdaptiveDetail.tsx` |
| TLAccordion | 105 | `TLAccordion.tsx` (Q20: zieht nur ins Paket) |
| TLWizard | 185 | `TLWizard.tsx` |
| TLViewError | 29 | `ViewLoadError.java` (kein TSX) |
| Bounded width | 14 | `TLStack.tsx`, `TLGrid.tsx` |
| Repeated items | 20 | `items.tsx` (Regeln mit `tlFill` bleiben, §5) |

Zusammen rund 850 Zeilen. Mit ihnen fallen die Regel `.tlHtml__error` aus dem Block TLHtml, die Fremdnamen
`--tlGrid-gap` und `--tl-item-index` (`foreignTl` in `test/ratchet.json`) und `--page-inset`.

**Java ändert sich an drei Stellen:** `ViewLoadError` baut ein `ReactAlertControl` statt eines Stacks mit Klassen (§7);
der Standard-Kopf der Breadcrumb in `ReactAdaptiveDetailControl` wird ein Text statt `‹` (§7); neue i18n-Schlüssel
(Name des Teilers, Name der Schrittliste). Schlüssel entstehen über JavaDoc, `messages_en` wird erzeugt
(`tools/check-messages-en.sh`). Zustände und Proto bleiben.

**Außerhalb des Pakets nachzuziehen:** `tl-demo-react.css` (`.tlGrid > .tlObjectList__item`, `--tl-item-index`); der
MUI-Test `inline-buttons.test.tsx` prüft `tlPanel__actionButton` und `tlPanel__actions` — er prüft künftig den Slot,
nicht die Klasse; die Doku `view-layer/basics.md`, `layout.md`, `app-shell.md`, `navigation.md` und `theme-tokens.md`
nennt `tlStack`, `tlGrid`, `tlInset`, `tlBounded`, `tlItem`, `tlDeckPane`, `tlWizard__step--*`,
`tlTileStack__frame--*`, `tlCard--outlined` und `--page-inset` als API (dazu der Fehler `tlStack--gap-normal`,
`basics.md:200`).

**Nicht in 4c:** `tlFill`, „Viewport-filling layout“ und „React mount point“ (rund 20 Controls über `bridge/fill.ts`;
Welle 5, als letzter Schritt vor dem Löschen, Q22); ein gemeinsamer Pfeiltasten-Fokus (Q23, eigener Strang); die
Ansage beim Schrittwechsel des Wizards (wie #29851 bei der Snackbar); der Rest von TLHtml (Welle 5).

## 2 · Wie die Welle geliefert wird

Ein PR in tl-engine-7 gegen 4b (!1906), nach dessen Merge gegen master. Das Paket entsteht zuerst auf `main` von
`TopLogic/tl-design-system` und wird mit `tools/publish-to-worktree.mjs` in den Worktree kopiert; die Kopie ist
versiegelt. Commits tragen `Ticket #29870:`. Push nur nach Hendriks Freigabe; Subagenten committen lokal.

## 3 · Panel: Kopf, Fuß, Zustände (Q3, Q8, Q13, Q14)

```
div.tl-panel[data-tl-state~="minimized"|"maximized"][.tl-card][.tl-panel--hover-actions][.tl-panel--full-line]
  div.tl-titlebar                                  (nur wenn er etwas trägt, wie heute)
    h2.tl-titlebar__title.tl-type-heading-sm
    div.tl-titlebar__content                       (titleContent)
    div.tl-titlebar__actions > Toolbar · Button[aria-expanded][aria-controls] (Minimieren) · Maximieren · Lösen
  div#<id>-body.tl-panel__body
  div.tl-form-field__message.tl-panel__error[role=alert]
  div.tl-button-bar > Toolbar
```

- **Der Kopf ist `tl-titlebar` aus 4a** (Q3) — derselbe Kopf wie in Fenster und Drawer: keine eigene Fläche, eine Linie
  darunter, Titel als `h2` mit `tl-type-heading-sm`, Kopfknöpfe als Part `Button` (`--ghost --icon --sm`). Die getönte
  Kopffläche (`layer-02`) und der fette Titel entfallen. `titlebar` bekommt den Slot `__content` für frei gestalteten
  Inhalt neben dem Titel.
- **Gleich hoch mit und ohne Toolbar.** Der Kopf misst `size-bar`, ob er eine Toolbar trägt oder nicht; eine Toolbar im
  Kopf bringt keine eigene Leistenhöhe mit. Heute reserviert `.tlPanel__toolbar` dafür `size-control`; künftig gilt die
  Regel für jeden `tl-titlebar` und wird gemessen (§9).
- **Wer beim Schrumpfen nachgibt,** bleibt wie in der AppBar (4b): zuerst die überlaufende Toolbar, der Titel zuletzt —
  ohne das Literal `100000`, in der Form, die der 4b-Plan für die AppBar fand.
- **Minimieren** ist ein Auf- und Zuklappen: der Knopf trägt `aria-expanded` (zu = minimiert) und `aria-controls` auf
  den Körper (Q13); Name und Glyph wechseln wie heute.
- **Zustände sind Attribute:** `data-tl-state~="minimized"|"maximized"` statt `tlPanel--normalized|minimized|…`.
  Maximiert liegt das Panel `position: absolute; inset: 0` auf `layer-raised` (Q8) mit `surface-base`; das Inline-Style
  `zIndex: 10` entfällt.
- **Die Knopfleiste unten** wird der neue Block `tl-button-bar` (Q14): rechtsbündig, Abstand `space-xs`, Innenabstand
  `space-sm space-md`, Linie oben `border-separator`; ohne Befehl verschwindet sie. **Der Dialog-Fuß aus 4a
  (`tl-dialog__footer`) wird derselbe Block** — eine Fußleiste für Dialog und Panel. Sichtbar im Panel: Abstand 1 →
  0,5 rem, Innenabstand 1/1,5 → 0,75/1 rem.
- **Knöpfe beim Zeigen** (`hoverActions`): die Regel der Ebenen-Liste aus der Spaltenwahl — unsichtbar, sichtbar beim
  Zeigen auf das Panel und bei Fokus darin, auf Touch-Geräten immer; `duration-base` statt `0.15s ease-in-out`.
- **`fullLine`** bleibt Modifier (`tl-panel--full-line`, über die ganze Zeile eines Formular-Rasters) — eine
  Variante, kein Zustand.
- **Eingeklappt in einem waagrechten Split** steht der Kopf als schmale Spalte: Titel senkrecht über
  `writing-mode: vertical-rl` statt `rotate(90deg)` mit `width: 0`, Knöpfe untereinander. Die Regel liest
  `.tl-split__pane[data-tl-state~="collapsed"]` (§6).

## 4 · Die Kartenfläche (Q15, Q20)

- **`tl-card` ist die eine Kartenfläche:** `surface-layer`, Linie `border-width-sm` `border-separator`, `radius-md`,
  Inhalt am Radius beschnitten. Es ist die Fläche, die das Accordion heute schon zeichnet.
- **`TLCard`**: Wurzel `tl-card`, Kopf `tl-titlebar` (Titel `h2`, Kopfaktionen in `__actions`), Körper
  `tl-card__body` mit `--pad-default|compact|none`. Die Polsterung folgt der Regel „der Inhalt beginnt, wo der Titel
  beginnt“: `default` = `space-md` (heute 1,5 rem), `compact` = `space-xs` (heute 1 rem), `none` = 0.
- **`elevated`** zeichnet wie `outlined`: Schatten gehören den schwebenden Ebenen (4b: AppBar `--elevated` als Linie,
  kein `shadow-raised`). Der Zustandswert bleibt im Proto (`CardState.variant`), die Spec bekommt keine zweite
  Erscheinung.
- **Panel als Karte** (`appearance="card"`): die Wurzel trägt zusätzlich `tl-card`.
- **Das Accordion zieht ins Paket** (Q20): `components/accordion/` mit CSS, Vertrag und Specimen; Bernhards Anatomie
  und Tastatur bleiben. Die Wurzel trägt `tl-card`; `tl-accordion` behält nur, was die Abschnitte anders machen (Linien
  dazwischen, Kopf auf `size-bar`, Körper `space-md`). Der Block im alten Stylesheet fällt, Lint und Fokus-Test greifen.
  Hinweis an Bernhard im PR.

## 5 · Abstände und Reihen (Q16, Q16b, Q22)

- **Eine Gap-Skala für Stack, Grid und Spalten:** `compact` = `space-sm`, `default` = `space-md`, `loose` = `space-lg`
  — die Werte von `tl-columns` aus 3b. **Sichtbar in jeder Ansicht:** der Standardabstand von Stack und Grid wird 1 rem
  statt 1,5; kompakt 0,75 statt 0,5; locker 1,5 statt 3. Die Stufennamen bleiben (Server-Enum).
- **`tl-stack`** mit `--row|column`, `--gap-*`, `--align-*`, `--justify-*`, `--wrap`, `--grow-first` — Varianten aus der
  Konfiguration, also Modifier. `role="group"` mit `aria-labelledby` im Feldslot bleibt.
- **`tl-grid`** mit `--gap-*`. Die Spaltenvorlage rechnet das TSX weiter inline; den Abstand liest es als
  `var(--tl-space-sm|md|lg)` nach der Stufe, nicht mehr über `--tlGrid-gap`. Ein Test hält die Zuordnung im TSX gleich
  der im CSS.
- **`tl-inset`**: der Abstand einer Seite zu ihrem Rand. Wie weit, sagt die nächste Fläche über React-Kontext statt
  über die geerbte Eigenschaft `--page-inset`: auf der Seite `space-lg` (wie heute), im Panel `space-md`, in der Karte
  `space-xs space-md` (wie heute) — `tl-inset--page|panel|card`.
- **`tl-bounded`** (begrenzte Breite) und **`tl-item`** (Wrapper wiederholter Einträge) ziehen ins Paket. Die
  Positionsnummer heißt künftig `--item-index`: sie ist ein Datum der Engine für Anwendungs-CSS (Verzögerung einer
  Animation), kein Wort des Pakets, und gehört darum nicht in den Namensraum `--tl`. Regeln, die `tlFill` lesen
  (`.tlItem:has(> .tlFill)`, `.is-control > .tlStack`), bleiben bis Welle 5 im alten Stylesheet und lesen die neuen
  Klassen.
- **`tl-deck`** (DeckPane): ein Kind zur Zeit, eine Spalte ohne eigene Größe.

## 6 · Der Teiler (Q17)

```
div.tl-split.tl-split--horizontal|vertical[data-tl-state~="all-collapsed"]
  div#<id>.tl-split__pane[data-tl-state~="collapsed"]
  div.tl-split__handle[role=separator][tabindex=0][aria-orientation][aria-controls=<id>]
                      [aria-valuenow][aria-valuemin][aria-valuemax][aria-label]
  div.tl-split__pane
```

- **Ein Griff, zwei Leser.** SplitPanel-Teiler und Spaltengriff der Tabelle bekommen dieselbe Bedienung aus einem
  Helfer in `bridge/`: `role=separator`, fokussierbar, Pfeiltasten verschieben um `space-md`, Home und End an Minimum
  und Maximum, Escape während des Ziehens bricht ab (wie heute mit der Maus). Erledigt „Spaltenbreite per Tastatur“
  aus „Offen nach 3b“.
- **Werte:** im Split `aria-valuenow` = Anteil der ersten Fläche in Prozent; in der Tabelle die Spaltenbreite in px mit
  Minimum. Name aus i18n.
- **Senden:** wie beim Ziehen ein Befehl je abgeschlossener Bewegung (`updateSizes`, Spaltenbreite) — bei Tasten nach
  dem Loslassen.
- **Aussehen:** Trefferzone `space-xs`. Der Split-Teiler zeigt in Ruhe eine Linie `border-width-sm` in
  `border-separator` (die Flächen brauchen eine Grenze), der Tabellengriff in Ruhe keine (die Zellen haben eigene
  Linien). Unter dem Zeiger, beim Ziehen und mit Fokus beide `border-width-md` in `border-interactive`; der Fokusring
  liegt innen. Heute: ein 4-px-Dauerbalken in `border-subtle`.
- `tlSplitPanel__child--collapsedHorizontal` wird `data-tl-state~="collapsed"` an der Fläche.

## 7 · Breadcrumb und Fehler (Q18, Q7)

- **AdaptiveDetail zeigt die Breadcrumb des Pakets** (Q18): `TLBreadcrumb.tsx` gibt seinen Darstellungsteil als
  Komponente her; `TLAdaptiveDetail` rendert ihn mit den Krumen des Servers. `nav` mit i18n-Namen, Trenner als Icon,
  `aria-current="page"` an der letzten Krume. Der Server behält `{depth, label}`; das TSX nimmt `depth` als Schlüssel —
  ohne Java-Änderung am Zustand. Der Standard-Kopf `‹` wird der i18n-Text „Übersicht“ / „Overview“: ein Glyph ist kein
  Name einer Seite. Die Leiste darüber: `size-bar`, Innenabstand wie `tl-titlebar`, Linie darunter.
- **`tl-adaptive-detail`** bleibt der Behälter des Drawers (`position: relative; overflow: clip`, `tl-drawer--container`
  aus 4a).
- **ViewError wird `tl-alert`** (Q7): `ViewLoadError` baut ein `ReactAlertControl` mit `data-tl-role="error"`: Titel
  „Ansicht nicht geladen“, darunter Pfad und Ursache als Text (Monospace über eine Typo-Klasse, falls das Paket eine hat;
  sonst prüft der Plan). Außenabstand `space-md`. Heute: Linie links 1 rem, neutrale Fläche, keine Rolle.
- **Der Fehler in TLHtml** (`tlHtml__error`) wird ebenso `tl-alert` mit `data-tl-role="error"`.

## 8 · Wizard, TileStack, Deck (Q19, Q21)

- **Wizard (`tl-wizard`):** eigenes Muster bleibt (Q19), auf Tokens. Kopf mit Linie unten und `space-md` Innenabstand.
  Die Scheibe: `size-icon-lg`, `radius-full`, Zahl `tl-type-label` mit `tl-nums`. Drei unterscheidbare Stufen — aktuell
  `surface-brand` mit `text-on-brand`, erledigt die schwächere Markenfläche mit der zugehörigen Schrift, kommend
  `surface-layer-nested` mit Linie `border-control` und `text-secondary`; welche Paare `pairs.mjs` schon hält, prüft
  der Plan. Erledigte Schritte sind `tl-button--link`, der aktuelle trägt `tl-type-body-strong`, kommende
  `text-secondary`. Fokus ist der Ring aus `base.css` (eigener 2-px-Ring entfällt). Die Liste bekommt einen Namen aus
  i18n; der Zähler „02 — 05“ bleibt und ist `aria-hidden` (die Liste sagt mit `aria-current="step"`, wo man ist). Die
  Breite des Fortschrittsbalkens wird ein Token `size-wizard-progress` = `{size-13}` (24 rem).
- **Übergänge** (Wizard und TileStack): `useKeyedTransition` markiert mit `data-tl-state~="entering"|"exiting"` statt
  mit Klassen (der Hook kann beides seit 4a); die Richtung ist `data-tl-state~="backward"` (vorwärts ohne Marke).
  **Ein Versatz** für beide (Q21): `space-md` statt 24 und 12 px, gespiegelt in Schreibrichtung rechts-nach-links wie
  der Drawer; Dauer `duration-slow`, Kurven `easing-entrance`/`-exit` wie heute. Reduzierte Bewegung schaltet ab. Mehr
  Bewegung erst im UI-Durchgang nach Welle 5.
- **TileStack (`tl-tile-stack`):** verdeckte Rahmen `data-tl-state~="covered"` (unsichtbar, nicht fokussierbar, bleiben
  gemountet wie heute).

## 9 · Gates

Neu im Paket (`node --test`) und im Engine-Gate:

- **Klassen (Lint):** kennt `tl-panel`, `tl-button-bar`, `tl-card`, `tl-accordion`, `tl-stack`, `tl-grid`, `tl-inset`,
  `tl-bounded`, `tl-item`, `tl-deck`, `tl-split`, `tl-tile-stack`, `tl-wizard`, `tl-adaptive-detail`; keine
  Zustandsklasse (`--minimized`, `--maximized`, `--collapsed`, `--entering`, `--exiting`, `--covered`, `--current`,
  `--done`); `z-index` nur `var(--tl-layer-*)`; Dauern nur `var(--tl-duration-*)`; kein `transform: rotate` für Text.
- **Kontrast:** die drei Stufen der Wizard-Scheibe, `border-interactive` als Griff-Linie auf `surface-layer`,
  Fokusring auf `surface-layer`; beide Modi, jedes Theme.
- **Kopfhöhe (DOM-Test):** jeder `tl-titlebar` im Specimen misst `size-bar`, mit und ohne Toolbar, in beiden Dichten.
- **`focus-clip.test.mjs`** misst die neuen Specimen-Seiten — Split, Karte, Accordion und Panel sind Behälter, die
  schneiden können; der Griff des Teilers ist der Fall, den der Test fangen soll.
- **Verträge:** `panel`, `button-bar`, `card`, `accordion`, `stack`, `grid`, `inset`, `split`, `tile-stack`, `wizard`,
  `adaptive-detail` neu; `titlebar` (Slot `__content`, Leser Panel und Card), `dialog` (Fuß ist `tl-button-bar`),
  `breadcrumb` (Leser AdaptiveDetail), `alert` (Leser ViewError, Html), `table` (Griff mit Tastatur) nachgezogen.
  `contracts-4c.test.mjs` prüft im Specimen: `aria-expanded` und `aria-controls` am Minimieren, `role=separator` mit
  `aria-valuenow` und `tabindex` am Griff, `aria-current` in Breadcrumb und Wizard, kein englisches Literal als
  `aria-label`.
- **Ratsche:** die Blöcke aus §1 gestrichen; `foreignTl` ohne `--tlGrid-gap` und `--tl-item-index`.
- **Engine:** `engine-classes.test.mjs` meldet `tlPanel`, `tlCard`, `tlStack`, `tlGrid`, `tlInset`, `tlBounded`,
  `tlItem`, `tlDeckPane`, `tlSplitPanel`, `tlTileStack`, `tlWizard`, `tlAdaptiveDetail`, `tlViewError`,
  `tlHtml__error` und `--page-inset` in `react-src` jedes Moduls (MUI eingeschlossen), im alten Stylesheet außer den
  Fill-Regeln, in `*.java`, `*.view.xml`, `tl-docs` und der Demo. Modul-Tests `layout.react`, `layout.view`,
  `demo.react` grün; MUI-Vitest grün (`NODE_OPTIONS=--no-experimental-webstorage`); `tsc --noEmit` 0; beide Vite-Builds
  grün; `check-messages-en.sh` ohne Diff; `published.test.mjs` und `TestDesignSystemCopy` grün.

## 10 · Reihenfolge mit Fertig-Bedingungen

1. **Paket: Fläche und Leisten.** `tl-card`, `tl-button-bar` (Dialog-Fuß umgestellt), `titlebar` mit `__content` und
   Höhenregel, `tl-panel`, `tl-accordion` ins Paket. Fertig: Specimen Panel (Kopf mit und ohne Toolbar, minimiert,
   maximiert, Karte, Knöpfe beim Zeigen, Knopfleiste), Card in allen Polsterungen, Accordion; hell und dunkel, beide
   Dichten; `node --test` grün.
2. **Paket: Reihen und Abstände.** `tl-stack`, `tl-grid`, `tl-inset`, `tl-bounded`, `tl-item`, `tl-deck`. Fertig:
   Specimen mit allen drei Stufen nebeneinander, Inset auf Seite, Panel, Karte.
3. **Paket: Teiler, Wizard, TileStack, AdaptiveDetail.** Token `size-wizard-progress`; `tl-split`, `tl-wizard`,
   `tl-tile-stack`, `tl-adaptive-detail`. Fertig: Specimen mit Split waagrecht und senkrecht, eingeklappt; Wizard mit
   drei Stufen; `focus-clip` grün.
4. **Engine: Helfer.** Teiler-Bedienung in `bridge/`; Darstellungsteil aus `TLBreadcrumb`; `useKeyedTransition` mit
   Attributen für Wizard und TileStack. Fertig: Tabelle und Breadcrumb unverändert; `layout.react` grün.
5. **Engine: Panel, Card, Accordion, Split** nach §3, §4, §6 — mit Tabellengriff. Fertig: ihre Blöcke leer, MUI-Test auf
   Slots.
6. **Engine: Stack, Grid, Inset, Deck, Items** nach §5, Demo-CSS und Doku. Fertig: Blöcke leer, `foreignTl` kürzer.
7. **Engine: Wizard, TileStack, AdaptiveDetail, ViewError, Html-Fehler** nach §7, §8 mit Java und i18n. Fertig: alle
   Blöcke aus §1 gestrichen, `engine-classes` ohne Treffer.
8. **Gates gesamt** nach §9.
9. **Sichtprüfung lokal** (`tl-demo-react`, hell und dunkel, beide Dichten): Panelköpfe nebeneinander gleich hoch;
   Minimieren, Maximieren, eingeklappt im Split; Teiler mit Maus und Tastatur, Fokus sichtbar; Spaltenbreite per
   Tastatur; Abstände einer Formularseite vorher/nachher; Karte und Kommentar-Karte; Accordion; Wizard vorwärts und
   zurück, auch mit reduzierter Bewegung; AdaptiveDetail schmal mit Breadcrumb; eine kaputte Ansicht (ViewError).
10. **Lokal committen, melden.** Push nur nach Freigabe; PR gegen 4b (nach dessen Merge gegen master), Reviewer bhu.
    Trac #29870 bekommt `== Migration ==` und `RequiresMigration`.

Vor dem Start: Plan-Review durch einen frischen Agenten gegen die Gates (CLAUDE.md), dann SDD.

## 11 · Was das für die Anwendungen heißt

Steht im Trac-Text unter `== Migration ==` und als Alt→neu-Liste in `altlast.md` „Welle 4c“:

- Die Klassen `tlPanel*`, `tlCard*`, `tlStack*`, `tlGrid*`, `tlInset`, `tlBounded`, `tlItem`, `tlDeckPane`,
  `tlSplitPanel*`, `tlTileStack*`, `tlWizard*`, `tlAdaptiveDetail*`, `tlViewError*`, `tlHtml__error` gibt es nicht
  mehr; der Dialog-Fuß heißt `tl-button-bar`.
- `--page-inset` gibt es nicht mehr; den Abstand setzt die Fläche (§5). `--tl-item-index` heißt `--item-index`.
- Sichtbar: Abstände in Stack und Grid enger (Standard 1 statt 1,5 rem); Panelköpfe ohne Tönung, Titel nicht mehr fett,
  40 statt 48 px; Knopfleiste im Panel enger; Kartenkörper 1 statt 1,5 rem gepolstert; `elevated` ohne Schatten; der
  Teiler eine Linie statt eines Balkens; Fehler einer Ansicht als Fehlermeldung des Pakets.

## 12 · Offen und entschieden

- **Angekreuzt 16.10. (Hendrik):** Prognose Q3, Q7, Q8, Q13–Q23 wie vorgeschlagen.
- **Beim Schreiben entschieden, mit der Spec zur Freigabe:**
  1. Panelkopf ohne Tönung (wie Fenster und Drawer), Titel `h2`.
  2. Ein Block `tl-button-bar` für Panel-Knopfleiste und Dialog-Fuß; `tl-dialog__footer` entfällt.
  3. Karte `elevated` = `outlined`, kein Schatten.
  4. Polsterung der Karte `space-md`/`space-xs`/0 statt 1,5/1/0 rem.
  5. Gap-Werte von `tl-columns` für alle drei Behälter.
  6. Inset über React-Kontext (`tl-inset--page|panel|card`) statt geerbter Eigenschaft.
  7. `--tl-item-index` → `--item-index` (Engine-Datum, nicht Paket-Vokabular).
  8. Breadcrumb: Server behält `{depth, label}` (abweichend von der Prognose Q18, die `{id, label}` vorsah — die
     Zuordnung im TSX genügt); Standard-Kopf „Übersicht“ statt `‹`.
  9. Teiler in Ruhe eine Linie, Tabellengriff in Ruhe unsichtbar; Tastaturschritt `space-md`.
  10. Ein Versatz `space-md` für Wizard und TileStack; Richtung als `data-tl-state~="backward"`.
  11. Wizard-Zähler `aria-hidden`, Liste mit Namen; Token `size-wizard-progress`.
