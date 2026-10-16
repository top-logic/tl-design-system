# Welle 4b · Navigation — Design

**Ticket:** Trac #29866 · **Branch:** `CWS/CWS_29866_design_system_welle_4b` auf `CWS/CWS_29825_design_system_spaltenwahl`
(!1852; trägt 4a) · **Entschieden:** 16.10.2026 mit Hendrik, Abschnitt für Abschnitt · **Grundlage:**
Konsolidierungs-Prognose Q10–Q14 in `docs/migration/altlast.md` „Welle 4“ (alle wie vorgeschlagen), Schnitt 4b/4c vom
16.10. (4b Navigation, 4c Behälter).

## 1 · Ziel und Abgrenzung

Die vier Navigations-Komponenten der React-Schicht lesen das Paket; ihre alten Blöcke fallen aus
`tlReactControls.css`:

| Block | Zeilen | Control |
|---|---|---|
| TLSidebar | 196 | `TLSidebar.tsx` |
| Collapsed mode: center icon-only items | 95 | `TLSidebar.tsx` |
| Drawer backdrop (only used in mobile drawer mode; hidden on desktop). | 6 | `TLSidebar.tsx` |
| Drawer toggle (mobile hamburger contributed via the sidebar's drawer-open-slot-name) | 8 | `TLDrawerToggle.tsx` |
| Responsive: sidebar becomes an off-canvas drawer on small viewports | 61 | `TLSidebar.tsx` |
| TLAppBar | 83 | `TLAppBar.tsx` |
| TLBottomBar | 67 | `TLBottomBar.tsx` |
| TLAppShell | 37 | `TLAppShell.tsx` |

Zusammen 553 Zeilen; mit ihnen fallen die Übergangsregel `.tlAppShell .tl-breadcrumb` und die Literale der Blöcke
(drei Dauern, drei `z-index`, drei Schriftgrößen, `3.5rem` zweimal, Breakpoint `768` im CSS).

**Java bleibt, wie es ist,** bis auf neue i18n-Schlüssel (z. B. `js.bottomBar.ariaLabel`): Zustände bleiben Maps,
AppBar behält sein Proto (`AppBarState`). Schlüssel entstehen über JavaDoc, `messages_en` wird erzeugt
(`tools/check-messages-en.sh`).

**Der MUI-AppBar-Adapter** (`com.top_logic.layout.react.mui`, `MuiAppBarAdapter.tsx`) rendert heute die Slot-Klassen
`tlAppBar__*` und verlässt sich auf deren CSS. Fremde Adapter folgen dem Vertrag aus `state.proto`, nie unseren
CSS-Konventionen: er ordnet seine Slots mit eigenen MUI-Mitteln an; seine Tests prüfen Slots statt Klassen. Ebenso
verlieren `chips.test.tsx`, `dividers.test.tsx`, `inline-buttons.test.tsx` und `disclosure-toggles.test.tsx` ihre
Prüfungen auf `tlSidebar__*`, `tlBottomBar__*` und `tlDrawerToggle`.

**Nicht in 4b:** alle Behälter — Panel, SplitPanel, Card, Stack, Grid, DeckPane, TileStack, Inset, AdaptiveDetail,
Accordion, Wizard, ViewError (Welle 4c, Q14–Q18); die Klassenart von `useKeyedTransition` (4c, Wizard und TileStack);
`layer-drag` (Welle 5).

## 2 · Wie die Welle geliefert wird

Ein PR in tl-engine-7 gegen die Spaltenwahl (!1852, trägt 4a), nach deren Merge gegen master. Das Paket entsteht
zuerst auf `main` von `TopLogic/tl-design-system` und wird mit `tools/publish-to-worktree.mjs` in den Worktree kopiert.
Commits tragen `Ticket #29866:`. Der erste Commit des Branches (`1fdae596a9`) ist der Fokusring der leeren Tabelle aus
`focus-clip.test.mjs`. Push nur nach Hendriks Freigabe; Subagenten committen lokal.

## 3 · AppShell und Breakpoint (Q10, Vorbedingung)

```
div.tl-app-shell[data-tl-display="compact"|"regular"]
  div.tl-app-shell__header      (Slot)
  div.tl-app-shell__notices     (Hinweise bündig untereinander)
  main.tl-app-shell__content > FillBarrier
  div.tl-app-shell__footer      (Slot)
  Snackbar
```

- **Eine Quelle für den Breakpoint.** `TLAppShell` misst `(max-width: 768px)` wie heute und meldet `COMPACT`/`REGULAR`
  an den Server (`reportDisplayClass`). Neu gibt sie den Wert als React-Kontext `useDisplayClass()` weiter und setzt
  `data-tl-display` an ihrer Wurzel. Keine Komponentendatei im Paket enthält eine Breiten-Media-Query; die `768` steht
  einmal, im TSX.
- **`<main>`** ist das bisher fehlende Landmark.
- **Hinweise:** mehrere stehen bündig (heute `.tlAppShell__notices .tlStack { gap: 0 }`); das wird eine Paketregel
  auf dem Kind von `tl-app-shell__notices`, nicht auf `.tlStack`.
- **Der Hamburger** (`TLDrawerToggle`) rendert nur, wenn der Kontext kompakt meldet — kein CSS dafür. Er trägt
  `aria-expanded` (offen = `drawerOpen`) und `aria-controls` auf die Nav der Sidebar. Die Klasse `tlDrawerToggle`
  entfällt; der Knopf ist der Part `Button` (`tl-button--ghost --icon`).
- **Sidebar kompakt:** die Nav steht im modalen `TLDrawer` aus 4a — Seite `--start`, Breite `--narrow`, Scrim
  (`tl-dialog`), Fokusfalle, Escape, geschlossen `inert`; der Fokus kehrt zum Hamburger zurück. `drawerOpen` bleibt
  flüchtig, `closeDrawerIfOpen()` auf dem Server bleibt. Der Drawer deckt die AppBar mit: `top: 3.5rem` und der eigene
  Backdrop (`tlSidebar__backdrop`, z-index 50/49) entfallen.

## 4 · Sidebar (Q11, Q12, Q13)

```
div.tl-sidebar[data-tl-state~="collapsed"]
  nav#<id>-nav.tl-sidebar__nav[aria-label]           ← kompakt im tl-drawer (§3)
    div.tl-sidebar__header                          (Slot; eingeklappt die zweite Fassung)
    div.tl-sidebar__items                           (Roving-Tabindex wie heute)
      button.tl-menu__item.tl-sidebar__item[type=button][aria-current="page"]
        ThemeIcon.tl-menu__icon · span.tl-menu__label · Badge (tl-badge)
      div.tl-menu__header                           (Kopfzeile)
      tl-divider                                    (Trenner)
      div.tl-sidebar__group
        button.tl-menu__item.tl-sidebar__item[aria-expanded] … ThemeIcon.tl-sidebar__chevron
        div.tl-sidebar__children
    div.tl-sidebar__footer                          (Slot; eingeklappt die zweite Fassung)
    div.tl-sidebar__collapse > DisclosureToggle     (bleibt)
  div.tl-sidebar__content > FillBarrier
```

- **Einträge** tragen die Anatomie von `tl-menu__item` (Q12); `tl-sidebar__item` ergänzt nur, was die Rail anders
  macht (Quadrat eingeklappt, Fläche der aktuellen Seite). Nav- und Befehlseintrag sind beide `button type="button"`;
  deaktiviert nur nativ `disabled`. Die Klassen `--active`, `--disabled`, `__navItem`, `__commandItem`,
  `__headerItem`, `__icon`, `__label`, `__badge` entfallen.
- **Die aktuelle Seite** ist `aria-current="page"`: Fläche `surface-interactive-selected` und `tl-type-body-strong`
  (die Typo-Klasse setzt das TSX), kein Balken links — dieselbe Auswahlform wie Baum und Tabelle seit 3b. Im Menü
  bleibt `aria-current` nur Gewicht („in Kraft“), in der Navigation ist es „hier bist du“.
- **Neu: die aktuelle Seite in einer zugeklappten Gruppe.** Liegt sie in einer Gruppe, die zu ist (ausgeklappte Rail:
  `aria-expanded="false"`; eingeklappte Rail: jede Gruppe), trägt der Gruppenkopf die Fläche, nicht das Gewicht —
  `data-tl-state~="contains-current"`. Heute zeigt dann nichts, wo man ist.
- **Chevron (Q13):** die Regel von `tl-toggle` — rechts heißt zu, bei `aria-expanded="true"` 90° nach unten,
  `duration-fast`, `easing-standard`. Die Inline-SVG und die Drehung um 180° (unten = zu) entfallen; das Glyph ist
  `ICON_EXPAND` über `ThemeIcon`.
- **Eingeklappt** ist `data-tl-state~="collapsed"` statt `tlSidebar--collapsed`. Jeder Eintrag wird ein Quadrat aus
  `size-row`, mittig das Icon; Label und Tooltip werden `aria-label` und Tooltip wie heute. Das Badge sitzt als
  `tl-badge--corner` am Icon (§6).
- **Breiten:** ausgeklappt das neue Token `size-sidebar` = `{size-12}` (16 rem; eine eigene Rolle, kein Lesen von
  `size-drawer-narrow`, das zufällig gleich ist). Eingeklappt ist die Breite eine Rechnung aus `size-row` und
  `space-2xs` (Eintrag plus Rand) — sie folgt der Dichte ohne drittes Maß. Der Übergang der Breite nimmt
  `duration-base` und `easing-standard`; reduzierte Bewegung schaltet ihn ab wie überall.
- **Flyout (Q11):** eine eingeklappte Gruppe öffnet `Menu.tsx` am Gruppenknopf. `usePopover` bekommt dafür die Lage
  `right-start` (flip, shift, Nachführen wie die übrigen). Portaliert, `layer-popover`, Einträge `MenuItem` mit
  `aria-current`, Abschnittsköpfe `MenuHeader`, Trenner `MenuSeparator`. Per Tastatur geöffnet (Enter, Leertaste,
  Pfeil rechts) steht der Fokus auf dem ersten Eintrag; Escape und Außenklick geben ihn an den Gruppenknopf zurück.
  Damit entfallen die eigene Lagerechnung (die beim Öffnen per Tastatur heute gar keine Lage hat), Escape doppelt
  (Rail-Handler und `useStandaloneKeyboardScope`), z-index 1000 und `tlSidebar__flyout*`.
- **Tastatur der Rail** bleibt: Pfeil auf/ab zyklisch, Home, End, Enter und Leertaste, Pfeil rechts/links öffnet und
  schließt Gruppen. Neu nur: Pfeil rechts auf einer Gruppe der eingeklappten Rail öffnet das Flyout.
- **Ebenen und Literale:** `letter-spacing`, `border-left: 3px`, `2px solid var(--focus)` und die `font-size` des Icons
  entfallen; Fokus ist der Ring aus `base.css` (innen, wie im Menü).

## 5 · AppBar und BottomBar (Q14)

**Leistenhöhe.** Neues Token `size-shell-bar` für die beiden Rahmenleisten, dichteabhängig: normal `{size-8}` (3 rem,
48 px), kompakt `{height-5}` (2,5 rem, 40 px). Keine neue Primitive. Die Leisten von Toolbar und Panel bleiben
`size-bar` (40/36 px).

**AppBar**

```
header.tl-app-bar[.tl-app-bar--elevated]
  div.tl-app-bar__leading                 (Hamburger-Slot u. a.)
  h1.tl-app-bar__title.tl-type-heading-sm
  div.tl-app-bar__children                (Breadcrumb u. a.)
  div.tl-app-bar__actions > tl-toolbar[data-tl-overflow]
  div.tl-app-bar__trailing                (Dev-, Benutzermenü)
```

- Höhe `size-shell-bar`; Innenabstand und Lücken aus `space-*`; Fläche `surface-layer`, Text `text-primary`
  (`tlAppBar--primary` entfällt).
- **`FLAT`/`ELEVATED`** bleibt als Modifier `tl-app-bar--elevated` — eine Variante, kein Zustand. `--elevated` ist eine
  Linie unten (`border-width-sm`, `border-separator`), kein Schatten: Schatten gehören den schwebenden Ebenen (Dialog,
  Popover, Ziehen), die Leiste schwebt nicht. Ein Token `shadow-raised` gibt es nicht und kommt nicht.
- **Wer beim Schrumpfen nachgibt,** bleibt: zuerst die überlaufende Toolbar (Labels, dann Überlaufmenü), der Titel
  zuletzt. `flex-shrink: 100000` ist ein Literal außerhalb von 0/1; die Form ohne Literal wählt der Plan, das Lint
  prüft sie.
- `:empty` an den Aktionen und `__actions:not(:empty) + __trailing` werden Paketregeln.
  `.tlAppShell .tl-breadcrumb` entfällt; den Abstand trägt die Leiste.

**BottomBar**

```
nav.tl-bottom-bar[aria-label=i18n]
  button.tl-bottom-bar__item[type=button][aria-current="page"]
    span.tl-bottom-bar__icon > ThemeIcon.tl-icon-md · Badge.tl-badge--corner
    span.tl-bottom-bar__label.tl-type-label            (aktiv: tl-type-label-strong)
```

- Höhe `size-shell-bar`; Icon `tl-icon-md` statt `font-size: 1.25rem`; Label `tl-type-label` statt 11 px (Untergrenze
  12 px).
- Aktiv ist `aria-current="page"`: Fläche `surface-interactive-selected` hinter dem Icon, Label kräftig. Die
  Markenfarbe `--button-primary` entfällt.
- `aria-label` wird ein i18n-Schlüssel (`js.bottomBar.ariaLabel`) statt „Bottom navigation“.
- Das Icon läuft über `ThemeIcon` wie in der Sidebar; ob `BottomBarElement` dieselbe Form liefert (heute eine rohe
  CSS-Klasse), prüft der Plan.

## 6 · Zusammengelegt: das Eck-Badge

Das Badge an einem Icon steht zweimal mit eigenen Literalen (`tlSidebar__cornerBadge`, `tlBottomBar__badge`, je
`top: -0.375rem; right: -0.5rem`). Es wird ein Modifier `tl-badge--corner` in `badge.css`: absolut an einem
positionierten Icon-Behälter, versetzt um `space-2xs` nach oben und außen. Der Vertrag `badge` nennt beide Leser.

## 7 · Gates

Neu im Paket (`node --test`) und im Engine-Gate:

- **Klassen (Lint):** kennt `tl-app-shell`, `tl-app-bar`, `tl-sidebar`, `tl-bottom-bar`, `tl-badge--corner`; keine
  Zustandsklasse (`--active`, `--collapsed`, `--drawerOpen`, `--open`, `--flyoutOpen`); `z-index` nur
  `var(--tl-layer-*)`; Dauern nur `var(--tl-duration-*)`. **Neu:** keine Breiten-Media-Query
  (`@media (max-width|min-width …)`) in einer Komponentendatei — den Breakpoint kennt nur die AppShell.
- **Kontrast:** `text-primary` und `icon-primary` auf `surface-interactive-selected`, Fokusring auf `surface-layer`,
  `border-separator` als Trennlinie ohne Paar. Der Plan prüft, was in `tools/lib/pairs.mjs` schon steht; beide Modi,
  jedes Theme.
- **`focus-clip.test.mjs`** misst die neuen Specimen-Seiten ohne eigenes Zutun — die Rail ist ein Behälter, der
  schneiden kann.
- **Verträge:** `app-shell`, `app-bar`, `sidebar`, `bottom-bar` neu; `badge` (`--corner`) und `menu` (Leser in der
  Rail) nachgezogen. `contracts-4b.test.mjs` prüft im Specimen: `aria-current` an Nav-Einträgen, `aria-expanded` an
  Gruppenkopf und Hamburger, `aria-controls` auf die Nav, ein `<main>`, kein englisches Literal als `aria-label`.
- **Ratsche:** die acht Blöcke gestrichen.
- **Engine:** `engine-classes.test.mjs` meldet `tlSidebar`, `tlAppBar`, `tlBottomBar`, `tlAppShell` und
  `tlDrawerToggle` in `react-src` jedes Moduls (MUI eingeschlossen), im alten Stylesheet, in `*.java`, `*.view.xml`
  und `tl-docs`; `docs/plans/` behält seine Vermerke. Modul-Tests `layout.react`, `layout.view`, `demo.react` grün;
  MUI-Vitest grün (`NODE_OPTIONS=--no-experimental-webstorage`); `tsc --noEmit` 0; beide Vite-Builds grün;
  `check-messages-en.sh` ohne Diff; `published.test.mjs` grün.

## 8 · Reihenfolge mit Fertig-Bedingungen

1. **Paket.** Tokens `size-shell-bar`, `size-sidebar`; `tl-badge--corner`; die vier Blöcke mit CSS, Vertrag und
   Specimen — Sidebar aus- und eingeklappt mit Flyout und einer zugeklappten Gruppe, die die aktuelle Seite enthält;
   Shell kompakt mit offenem Drawer; AppBar flach und `--elevated` mit überlaufender Toolbar; BottomBar mit Badge.
   Fertig: hell und dunkel, beide Dichten; `node --test` grün.
2. **Engine: Helfer.** `usePopover` mit `right-start`; Kontext `useDisplayClass`. Fertig: Menü, Select, Toolbar
   unverändert; `layout.react` grün.
3. **Engine: AppShell und DrawerToggle** nach §3. Fertig: Blöcke TLAppShell und Drawer toggle leer.
4. **Engine: Sidebar** nach §4 (Rail, Gruppen, Flyout, kompakter Drawer). Fertig: die fünf Sidebar-Blöcke leer.
5. **Engine: AppBar mit MUI-Adapter, dann BottomBar** nach §5, §6. Fertig: alle acht Blöcke gestrichen,
   `engine-classes` ohne Treffer.
6. **Gates gesamt** nach §7.
7. **Sichtprüfung lokal** (`tl-demo-react`, hell und dunkel, beide Dichten): Ein- und Ausklappen, auch mit
   reduzierter Bewegung; Flyout per Maus und Tastatur, am Fensterrand geflippt, Fokus zurück; schmales Fenster —
   Hamburger, Drawer, Escape, Fokus zurück, Auswahl schließt den Drawer; aktuelle Seite in einer zugeklappten Gruppe;
   AppBar schrumpft (Toolbar zuerst, Titel zuletzt); Badge in Rail und BottomBar.
8. **Lokal committen, melden.** Push nur nach Freigabe; PR gegen die Spaltenwahl (nach deren Merge gegen master),
   Reviewer bhu, danach `add_reviewers bhu` nach jeder Antwort.

Vor dem Start: Plan-Review durch einen frischen Agenten gegen die Gates (CLAUDE.md), dann SDD.

## 9 · Was das für die Anwendungen heißt

Steht im Trac-Text unter `== Migration ==` (Keyword `RequiresMigration`) und als Alt→neu-Liste in `altlast.md`
„Welle 4b“:

- Die Klassen `tlSidebar*`, `tlAppBar*`, `tlBottomBar*`, `tlAppShell*` und `tlDrawerToggle` gibt es nicht mehr.
- Eigene Regeln für schmale Bildschirme lesen `[data-tl-display~="compact"]` an der Shell statt
  `@media (max-width: 768px)`.
- Sichtbar: AppBar 48 statt 56 px (kompakt 40); `--elevated` eine Linie statt eines Schattens; die aktuelle Seite mit
  Fläche statt Balken; die mobile Sidebar ein modaler Drawer über der AppBar; der Hamburger nur auf schmalen
  Bildschirmen im DOM; das Label der BottomBar 12 px.

## 10 · Offen und entschieden

- **Entschieden 16.10.:** Schnitt 4b Navigation / 4c Behälter; Breakpoint nur in der AppShell, Sidebar kompakt als
  modaler `TLDrawer`; `size-shell-bar` 48/40 px; aktuelle Seite als Fläche und Gewicht ohne Balken, auch die Fläche am
  Kopf einer zugeklappten Gruppe; `--elevated` als Linie; Eck-Badge zusammengelegt.
- **Offen bis zum Plan:** die Schrumpfform der AppBar ohne `100000`; die Icon-Form von `BottomBarElement`.
