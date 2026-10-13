# Welle 4a · Overlays — Design

**Ticket:** Trac #29836 · **Branch:** `CWS/CWS_29836_design_system_welle_4a` auf `CWS/CWS_29825_design_system_spaltenwahl`
(!1852 auf !1838; Merge-Reihenfolge 3b → Spaltenwahl → 4a, entschieden 13.10. nach dem Plan-Review) · **Entschieden:** 13.10.2026 mit Hendrik, Abschnitt für Abschnitt ·
**Grundlage:** Konsolidierungs-Prognose Q1–Q19 in `docs/migration/altlast.md` „Welle 4“ (alle wie vorgeschlagen).

## 1 · Ziel und Abgrenzung

Die Overlays der React-Schicht lesen das Paket; ihre alten Blöcke fallen aus `tlReactControls.css`:

| Block | Zeilen | Control |
|---|---|---|
| TLOverlay | 34 | `TLOverlay.tsx` |
| TLDialog (overlay-only) | 26 | `TLDialog.tsx` |
| TLDialogManager | 6 | `TLDialogManager.tsx` |
| TLWindow | 183 | `TLWindow.tsx` |
| TLDrawer | 98 | `TLDrawer.tsx` |
| TLSnackbar | 101 | `TLSnackbar.tsx` |
| TLNoticeBar (system-wide notice) | 33 | `TLNoticeBar.tsx` |

Zusammen 481 Zeilen. Dazu der Overlay-Teil von `TLPhotoCapture` (Hülle, Scrim, Schließen-Knopf), der auf den Dialog
zieht; der übrige Block TLPhotoCapture bleibt bis Welle 5.

**Nicht in 4a:** die mobile Sidebar als Drawer (Q10) und das Sidebar-Flyout (Q11) — 4b, die nutzen, was 4a baut;
Wizard- und TileStack-Übergänge — 4b; Color- und Icon-Popup (N4), Kanban-Hinweis und `DropState` — Welle 5.

**Java bleibt, wie es ist**, bis auf eine Konstante (§7). Die Aufrufer des Fensters — Kompaktfeld
(`ReactCompactFieldControl`), Spaltenwahl und Filter (`TableViewControl`), `I18NEditorDialog`,
`ConfirmDialogControl`, `DirtyConfirmDialogControl`, `MessageDialogControl` — öffnen weiter über
`ReactDialogManagerControl` und `ReactWindowControl`.

## 2 · Wie die Welle geliefert wird

Ein PR in tl-engine-7, gestapelt auf 3b (wie 3a auf 2). Das Paket entsteht zuerst auf `main` von
`TopLogic/tl-design-system` und wird mit `tools/publish-to-worktree.mjs` in den Worktree kopiert. Commits tragen
`Ticket #29836:`. Push nur nach Hendriks Freigabe; Subagenten committen lokal.

## 3 · Dialog (Q1, Q2, Q3, Q4)

**Ansatz:** ein Paketbaustein, zwei TSX bleiben. `TLDialog` zeichnet den Scrim, `TLWindow` die Fläche. Verworfen:
beide TSX verschmelzen (zieht `ReactDialogControl` und `ReactWindowControl` mit, Java-Umbau); natives `<dialog>` mit
`showModal()` (Top-Layer: Menüs, Selects und Tooltips im Dialog hängen per `usePopover` am `body` und lägen darunter).

**Anatomie:**

```
div.tl-dialog[data-tl-state~="entering|exiting"]          ← TLDialog: Scrim, fixed, inset 0, layer-overlay
  div.tl-dialog__surface[role=dialog][aria-modal=true]     ← TLWindow
       [aria-labelledby=<id>-title][data-tl-state~="maximized"]
    div.tl-dialog__header
      h2.tl-dialog__title.tl-type-heading-sm#<id>-title   ← Ellipse, Ziehgriff (cursor: grab)
      div.tl-toolbar …                                    ← Fensteraktionen (ToolbarControl)
      button.tl-button.tl-button--ghost.tl-button--icon.tl-button--sm   ← Maximieren (aria-pressed)
      button.tl-button.tl-button--ghost.tl-button--icon.tl-button--sm   ← Schließen
    div.tl-dialog__body                                   ← FillBarrier
    div.tl-dialog__footer                                 ← fehlt, wenn leer; ButtonDefaults secondary
    div.tl-dialog__resize[data-tl-edge="n|ne|e|se|s|sw|w|nw"] × 8
```

- **Scrim:** `--tl-surface-scrim`, Ebene `--tl-layer-overlay`, **ohne Blur** — die Skala kennt keinen
  (`skalen.md` „Scrim und Ebenen“), und Blur kostet beim Ziehen des Fensters Leistung. Klick auf den Scrim schließt,
  wenn der Server es erlaubt (`closable` und `closeOnBackdrop`, wie heute).
- **Fläche:** `--tl-surface-overlay`, `--tl-radius-md`, `--tl-shadow-dialog`; hell zusätzlich
  `--tl-border-width-sm solid --tl-border-separator` (`skalen.md`: „Popover, Dialog, Toast: Schatten **und** Rahmen“;
  dunkel trennt `surface-overlay`). Größte Ausdehnung: Viewport minus Rand `--tl-space-lg` je Seite.
- **Kopf:** Abstand `--tl-space-sm` `--tl-space-md`, Linie unten `--tl-border-separator`, Mindesthöhe `--tl-size-bar`.
  Der Titel ist `h2` (die AppBar hat `h1`). Ziehen am Kopf außer auf Knöpfen; Doppelklick maximiert (wie heute).
- **Kopfknöpfe (Q4):** `tl-button--icon --sm` (24 px, `--tl-size-control-sm`) mit `ThemeIcon`
  (`css:fa-solid fa-xmark` wie `TLAlert`, Maximieren `css:fa-regular fa-window-maximize` / `-restore`); Tooltip und
  `aria-label` über `useI18N` wie heute; Maximieren trägt `aria-pressed`. Keine Inline-SVG mehr.
- **Fuß:** rechtsbündig, Lücke `--tl-space-xs`, Abstand `--tl-space-sm` `--tl-space-md`, Linie oben; leer → nicht
  gerendert statt `:empty`.
- **Ziehen und Größe:** die Mechanik von `TLWindow` bleibt (`startPointerDrag`, Klemmen im Viewport, symmetrisch bei
  zentrierter Lage, `resize`-Befehl, Doppelklick auf Griff setzt zurück). Die Griffe sind `tl-dialog__resize` mit
  `data-tl-edge`; ihre Maße stehen im Paket als `--tl-space-xs` breit, Ecken `--tl-space-sm`. Die Rand-Konstante 24
  im TSX fällt: `useTokenPx(ref, '--tl-space-lg', …)` misst den Rand, den das CSS hält.
- **Maximiert:** `data-tl-state~="maximized"` an der Fläche statt Inline-`100vw/100vh`; Rand 0, Rundung 0.
- **Foto-Overlay:** `TLPhotoCapture` öffnet seine Kamera in `tl-dialog` + `tl-dialog__surface` mit Kopf und
  Schließen-Knopf, ohne Fuß. Sein Body-Scroll-Lock und `rgba(0,0,0,.85)` fallen. Fokus und Escape über §6.

## 4 · Drawer (Q5, Q10-Vorbereitung)

```
div.tl-dialog[data-tl-state~="entering|exiting"]   ← nur mit Scrim
aside.tl-drawer.tl-drawer--start|--end|--bottom.tl-drawer--narrow|--medium|--wide
     [data-tl-state~="open"][aria-labelledby][tabindex=-1]  (mit Scrim zusätzlich role=dialog, aria-modal=true)
  div.tl-drawer__header  → h2.tl-type-heading-sm, Schließen wie §3
  div.tl-drawer__body
```

- **Regel: mit Scrim modal, ohne Scrim nicht modal.** Mit Scrim: Fokusfalle, `role=dialog`, `aria-modal`, Klick auf
  den Scrim schließt. Ohne Scrim (heute der einzige Fall): Fokus beim Öffnen hinein, beim Schließen zurück, keine
  Falle, kein Außenklick. Geschlossen: `inert` statt nur `aria-hidden`, damit kein Fokus hineinfällt.
- **Seiten** heißen `--start`/`--end` (Schreibrichtung) statt `--left`/`--right`; die Server-Konfiguration bleibt.
- **Breiten** `--narrow|--medium|--wide` als Maße im Paket (`--tl-size-drawer-*`, neu in `tokens.json` über
  Primitive). Ein Inline-`width`/`height` des Servers bleibt erlaubt.
- **Ebene:** am Viewport `--tl-layer-overlay`; im Container (`anchor="container"`, TLAdaptiveDetail) `--tl-layer-raised`
  statt `10`.
- **Bewegung:** `transform` mit `--tl-duration-base` und `--tl-easing-entrance`/`-exit`.
- Der Scrim des modalen Drawers ist dieselbe `tl-dialog`-Fläche; 4b nutzt diese Variante für die mobile Sidebar.

## 5 · Meldungen (Q7)

Snackbar und NoticeBar sind **Alerts mit eigener Hülle**: Farbe, Icon, Titel, Ansage kommen aus `tl-alert`, Lage,
Timer und Countdown bleiben bei ihren Controls.

**Snackbar:** `div.tl-alert.tl-snackbar[data-tl-role][data-tl-state~="exiting"]` mit `tl-alert__icon`,
`tl-alert__body` (`__title`, `__message`), Schließen als `tl-alert__close` (`tl-button--icon --sm`, `ThemeIcon`).
`tl-snackbar` setzt: `position: fixed`, unten mittig mit `--tl-space-md` Abstand, `max-width` als Maß, Ebene
`--tl-layer-toast`, Fläche zusätzlich `--tl-shadow-drag` (`skalen.md`: der Schatten für „Element am Ziehzeiger, Toast“) und
Rahmen `--tl-border-separator`. Die Varianten
`info|success|warning|error` werden `data-tl-role`. Dauer, Pause beim Zeigen und Ausblenden bleiben im TSX; die
Ausblend-Dauer liest das TSX per `getComputedStyle` aus `--tl-duration-base`, nicht als `200`.

**NoticeBar:** `div.tl-alert.tl-notice-bar[data-tl-role]` — volle Breite, ohne Rundung, Linie nur unten, Rand am
Zeilenanfang bleibt (`tl-alert`). Der Countdown steht in `tl-alert__message` mit `tl-nums`. Klickbar:
`role=button`, `tabindex=0`, Enter/Leertaste wie heute, Fokusring aus `base.css` (heute fehlt er).

**Ansage-Regel**, gleich für Alert, Snackbar, NoticeBar: `error` → `role=alert`, alles andere → `role=status`
(`aria-live=polite` implizit). Heute meldet die Snackbar auch Fehler höflich.

**Fehlerboxen:** `tlHtml__error` und `tlViewError` zeichnen dieselbe Box wie `tl-alert` `error`. `TLHtml` gehört nicht
zu 4a (Welle 5), `tlViewError` zu 4b — beide stehen hier nur als Ziel; 4a ändert sie nicht.

`skalen.md` „Status“ bekommt einen Nachtrag: der Satz „das korrigiert den Fehler in der Snackbar: Erfolg bekommt
dunkle Schrift“ gilt nicht mehr — die Snackbar hat keine gefüllte Fläche, ihr Text ist `text-primary` auf `subtle`.

## 6 · Helfer in `bridge/` (Q5, Q6)

1. **`useDismiss({ open, onDismiss, escape, outsidePress, ref })`** fasst Escape (über den Tastatur-Dispatcher, wie
   `EscapeToClose` heute) und Außenklick (`useCloseOnOutsidePress`) zusammen. `TLDialog` und `TLWindow` verlieren
   ihre Kopien von `EscapeToClose`; Drawer und Foto-Overlay rufen ihn statt `useStandaloneKeyboardScope`. Die
   Vereinbarung bleibt: ein Widget, das Escape selbst braucht (Menü, Select im Dialog), ruft `preventDefault`, der
   Dispatcher steht dann still — so schließt Escape erst das Popup, dann den Dialog.
2. **`useFocusTrap(active, ref, mode, { trap: false })`** — neuer Modus: Startfokus und Rückgabe wie heute, aber kein
   Festhalten. Der Drawer verliert seine eigene Kopie (`TLDrawer.tsx:53–73`).
3. **`useKeyedTransition`** schreibt statt der Klassen `…--entering`/`--exiting` das Token `entering`/`exiting` in
   `data-tl-state` (Liste mit Leerzeichen, damit `maximized` und `open` daneben stehen können). Wizard und TileStack
   rufen den Hook bis 4b weiter mit Klassen; der Hook kennt beide Arten, bis 4b die Klassenart streicht.
4. **`useTokenPx`** wie in 3b, für den Fensterrand.

## 7 · Ebenen, Bewegung, Engine-Nebenstellen (Q8, Q9)

- **Ebenen:** Scrim und Drawer `layer-overlay`, Snackbar `layer-toast`, Drawer im Container `layer-raised`. Kein
  Literal mehr in den sieben Blöcken. Die Literale außerhalb (Sidebar 1000/50/49 → 4b; Drag 12000–13000 → Welle 5)
  bleiben.
- **Bewegung:** Das Paket liefert die Standardbewegung auf `data-tl-state`: Dialog-Scrim blendet mit
  `--tl-duration-base` und `--tl-easing-entrance` ein, mit `--tl-easing-exit` aus (nur Deckkraft); Drawer schiebt;
  Snackbar steigt um `--tl-space-sm`. Eine Anwendung überschreibt sie mit eigenen Regeln auf denselben
  Attributen. `prefers-reduced-motion` braucht keine Regel: `useKeyedTransition` setzt dann kein Token.
- **Java:** `CommandErrors.CSS_SNACKBAR_TITLE` wird `tl-alert__title`. JavaDoc unverändert; `check-messages-en.sh`
  trotzdem.
- **Docs in der Engine:** `view-layer/app-shell.md` „Transitions“ — die Dialog-Zeile nennt
  `.tl-dialog[data-tl-state~="entering"]` / `~="exiting"` und sagt, dass das Paket eine Standardbewegung bringt;
  `view-layer/display.md` nennt `.tl-overlay`, `.tl-overlay__layer`, `.tl-overlay__layer--<anker>`.
- **Demo:** `tl-demo-react.css` streicht die eigene Dialog-Bewegung (das Paket bringt sie); die Tile-Bewegung bleibt
  bis 4b.
- **Ratsche:** Die Regel `.tlAppShell .tl-breadcrumb` (3 Zeilen, heute im Block TLNoticeBar) zieht in den Block
  TLAppShell; der wächst um 3 mit Vermerk „aus TLNoticeBar, fällt in 4b“.

## 8 · Overlay (Ebenen-Container)

`TLOverlay` ist kein Overlay im Sinn dieser Welle, sondern ein Stapel aus Basis und Ebenen; er steht im selben
Code-Bereich und zieht mit. `div.tl-overlay > div.tl-overlay__base + div.tl-overlay__layer.tl-overlay__layer--<anker>`
mit den neun Ankern und `fill`. Die Ebene lässt den Zeiger durch, wo sie nichts zeigt (`pointer-events: none`, Kinder
`auto`), wie heute. Kein `z-index`, keine Fläche. `display.md` nennt die Klassen als Anwendungs-API.

## 9 · Gates

Neu im Paket (`node --test`) und im Engine-Gate:

- **Klassen (Lint):** kennt `tl-dialog`, `tl-drawer`, `tl-snackbar`, `tl-notice-bar`, `tl-overlay`; keine
  Zustandsklasse (`--open`, `--entering`, `--exiting`, `--maximized`, `--clickable`, `--visible`); `z-index` nur
  `var(--tl-layer-*)`; `transition`/`animation` nur mit `var(--tl-duration-*)` und `var(--tl-easing-*)`;
  `outline` nur im Basis-Ring.
- **Kontrast:** Text, Fokusring und `border-interactive` auf `surface-overlay` stehen schon in der Paarliste
  (`tools/lib/pairs.mjs`), `text-primary` auf `status-*-subtle` aus 3b; `border-separator` trennt nur und hat kein
  Paar (wie beim Popover). Neu nur, falls es fehlt: `icon-secondary` auf `surface-overlay` (≥ 3,0, die Kopfknöpfe) —
  der Plan prüft die Liste. Beide Modi, jedes Theme.
- **Verträge:** `dialog`, `drawer`, `snackbar`, `notice-bar`, `overlay` neu; `alert` (Hüllen, Ansage-Regel) und
  `button` (Kopfknöpfe) nachgezogen. `contracts-4a.test.mjs` prüft: Dialog-Fläche mit `role=dialog`, `aria-modal`,
  `aria-labelledby`; Drawer mit Scrim modal, ohne nicht; nur `error` ist `alert`.
- **Ratsche:** die sieben Blöcke gestrichen; TLPhotoCapture auf den Stand aus `inventory.mjs` mit Vermerk; TLAppShell
  +3 mit Vermerk; `foreignTl` ohne `--tlSnackbar-bg`/`-fg`.
- **Engine:** `engine-classes.test.mjs` meldet zusätzlich `tlDialog`, `tlDialogManager`, `tlWindow`, `tlDrawer`,
  `tlSnackbar`, `tlNoticeBar`, `tlOverlay`, `tlPhotoCapture__overlay` in `react-src` jedes Moduls, im alten
  Stylesheet, in `*.java`, `*.view.xml`, `tl-docs` und in `tl-demo-react.css`; `docs/plans/` behält seine Vermerke.
  Modul-Tests `layout.react`, `layout.view`, `demo.react` grün; `tsc --noEmit` 0; beide Vite-Builds grün;
  `check-messages-en.sh` ohne Diff; `published.test.mjs` grün.

## 10 · Reihenfolge mit Fertig-Bedingungen

1. **Paket.** `dialog`, `drawer`, `snackbar`, `notice-bar`, `overlay` mit CSS, Vertrag, Specimen; Drawer-Maße in
   `primitives.json`/`tokens.json`; Lint- und Kontrastgates. Fertig: Specimen zeigt Dialog (mit Toolbar, Fuß,
   maximiert, Griffe), Drawer drei Seiten mit und ohne Scrim, Snackbar vier Rollen, NoticeBar drei Rollen klickbar und
   mit Countdown, Overlay-Anker — hell und dunkel, beide Dichten; `node --test` grün.
2. **Engine: Helfer.** `useDismiss`, `useFocusTrap({ trap: false })`, `useKeyedTransition` mit Attributart. Fertig:
   Menü, Toolbar, Wizard, TileStack unverändert; `layout.react` grün.
3. **Engine: Dialog.** `TLDialog`, `TLDialogManager`, `TLWindow` auf §3; Foto-Overlay. Fertig: TLDialog,
   TLDialogManager, TLWindow leer; Tests grün.
4. **Engine: Drawer, Snackbar, NoticeBar, Overlay** auf §4, §5, §8; `CommandErrors`; Docs und Demo nach §7. Fertig:
   alle sieben Blöcke gestrichen, `engine-classes` ohne Treffer.
5. **Gates gesamt** nach §9.
6. **Sichtprüfung lokal** (`tl-demo-react`, hell und dunkel, beide Dichten): Dialog öffnen und schließen mit und ohne
   reduzierte Bewegung; Tab bleibt im Dialog, Fokus kehrt zurück; Escape schließt erst das Popup im Dialog, dann den
   obersten Dialog; Ziehen, Größe, Doppelklick, Maximieren; Kopfknöpfe 24 px mit Tooltip; Drawer drei Seiten, Fokus
   hinein und zurück; Snackbar vier Rollen, Fehler sofort angesagt, Pause beim Zeigen, Tooltip am Schließen-Knopf
   (Ebene 1101 unter 1200 — verdeckt er, folgt eine Regel); NoticeBar mit Countdown und klickbar mit Ring; Foto-Overlay;
   Rückfrage „Ungespeicherte Änderungen“.
7. **Lokal committen, melden.** Push nur nach Freigabe; PR gegen die Spaltenwahl (nach deren Merge gegen master),
   Reviewer bhu, danach `add_reviewers bhu` nach jeder Antwort.

Vor dem Start: Plan-Review durch einen frischen Agenten gegen die Gates (CLAUDE.md), dann SDD.

## 11 · Was das für die Anwendungen heißt

Steht im Trac-Text unter `== Migration ==` (Keyword `RequiresMigration`) und als Alt→neu-Liste in `altlast.md`
„Welle 4a“:

- Die Klassen `tlDialog*`, `tlWindow*`, `tlDrawer*`, `tlSnackbar*`, `tlNoticeBar*`, `tlOverlay*` gibt es nicht mehr.
- Bewegung: `.tlDialog__backdrop--entering`/`--exiting` → `.tl-dialog[data-tl-state~="entering"]`/`~="exiting"`;
  das Paket bringt eine Standardbewegung.
- `--tlSnackbar-bg` und `--tlSnackbar-fg` entfallen.
- Sichtbar: Snackbar getönt statt gefüllt; Scrim ohne Blur; Kopfknöpfe 24 statt 32 px; Drawer-Seiten
  `--start`/`--end`.
- `.tlOverlay__layer--<anker>` → `.tl-overlay__layer--<anker>`.

## 12 · Offen und entschieden

- **Entschieden 13.10.:** Ansatz „ein Paketbaustein, zwei TSX“; Scrim ohne Blur; Drawer mit Scrim modal, ohne nicht;
  Snackbar und NoticeBar als Alert mit Hülle; nur `error` unterbricht; Bewegung als Paket-Standard auf
  `data-tl-state`, überschreibbar; Schnitt 4a/4b.
- **Offen bis zur Sichtprüfung:** Tooltip des Snackbar-Schließen-Knopfs unter der Toast-Ebene.
- **Offen für 4b:** Klassenart von `useKeyedTransition` streichen (Wizard, TileStack); mobile Sidebar auf den modalen
  Drawer; `tlViewError` auf `tl-alert`.

## 13 · Nachgetragen beim Planen (13.10.)

Am Code und im Plan-Review gefunden; der Plan (`docs/superpowers/plans/2026-10-13-welle-4a-overlays.md`, „Abweichungen
von der Spec“) setzt sie um. Wo dieser Abschnitt den Abschnitten oben widerspricht, gilt er.

1. **`EscapeToClose` statt `useDismiss` (§6.1).** Escape von Dialog und Fenster muss in den Scope binden, den die
   Komponente selbst öffnet; ein Hook derselben Komponente bindet in den Scope darum herum. Die Komponente steht einmal
   in `bridge/` statt zweimal kopiert. Drawer und Fotoaufnahme bleiben bei `useStandaloneKeyboardScope`.
2. **Fuß mit `:empty` (§3).** Die Toolbar im Fuß rendert ohne Befehl nichts; das TSX weiß das vorher nicht.
3. **`tl-titlebar` statt `tl-dialog__header`/`tl-drawer__header` (§3, §4).** Ein Kopf-Block mit `__title` und
   `__actions` für Dialog und Drawer (Q3); 4b nimmt ihn für Panel und Card.
4. **Maximieren ohne `aria-pressed` (§3).** Das Label wechselt („Maximieren“/„Wiederherstellen“) wie heute.
5. **Rahmen der Dialogfläche in beiden Modi (§3)**, wie beim Popover.
6. **Kamera-Knöpfe bleiben bis Welle 5 (§3).** Die Fotoaufnahme bekommt Scrim, Fokusfalle und Escape; Spiegeln,
   Auslösen und Schließen bleiben runde Kamera-Knöpfe auf dem Video.
7. **Snackbar ohne Icon (§5).** `SnackbarStateJson` liefert keins; ein im TSX gewähltes Icon umginge das Theme.
8. **Modaler Drawer nur im Paket (§4).** `ReactDrawerControl` kennt keine Scrim-Option; die mobile Sidebar (4b) rendert
   die modale Variante.
9. **Rahmen der Snackbar ist die Linie der Bedeutung (§5)**, kein zusätzlicher `border-separator`.
10. **Drawer-Körper behält Innenabstand `--tl-space-md` und `overscroll-behavior: contain` (§4)**; ob er bündig wird,
    prüft 4b mit Panel und Card.
11. **Lint kennt die Zustandswörter** `entering`, `exiting`, `maximized`, `clickable`, `visible` als Verstoß, auch an
    Elementen (§9).
12. **Branch-Basis ist die Spaltenwahl (§2)**, entschieden 13.10. nach dem Plan-Review: auf 3b wäre das Paket-Gate der
    Spaltenwahl rot gewesen.
