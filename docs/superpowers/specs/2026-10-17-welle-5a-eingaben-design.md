# Welle 5a · Eingaben — Design

**Ticket:** Trac #29875 · **Branch:** `CWS/CWS_29875_design_system_welle_5a` auf `CWS/CWS_29870_design_system_welle_4c`
(!1911; nach dessen Merge gegen master) · **Grundlage:** Prognose in `docs/migration/altlast.md` „Welle 5“ (V1, V4, V6,
V7, V9, V11; von Hendrik am 17.10. entschieden: alle wie vorgeschlagen, Schnitt 5a–5d) · **Stand:** Entwurf 17.10.,
wartet auf Hendriks Freigabe.

## 1 · Ziel und Abgrenzung

Farbfeld, Icon-Feld und Slider lesen das Paket; ihre alten Blöcke fallen aus `tlReactControls.css`:

| Block | Zeilen | Control |
|---|---|---|
| TLColorInput | 354 | `TLColorInput.tsx`, `color/ColorPopup.tsx`, `color/ColorPalette.tsx`, `color/ColorMixer.tsx` |
| TLIconSelect | 340 | `TLIconSelect.tsx`, `icon/IconSelectPopup.tsx` |
| TLSlider | 204 | `TLSlider.tsx` |

Zusammen rund 900 Zeilen. Mit ihnen fallen die vier Fremdnamen `--tlSlider-thumb`, `--tlSlider-fill`,
`--tlSlider-fill-color`, `--tlSlider-rest-color` (`foreignTl` in `test/ratchet.json`).

**Hendrik, 17.10.: kein neues Bedienkonzept.** Farb- und Icon-Auswahl „sehen aus wie im alten, und zwar langweilig“ —
das ist Sache des UI-Durchgangs nach Welle 5. 5a zieht die drei Felder ins Paket, legt Gleiches zusammen und schließt
die Lücken in Tastatur, Fokus und Zustand. Das Bild bleibt im Wesentlichen, wie es ist.

**Java ändert sich nur an i18n:** neue Namen für die Palette, das Farbfeld des Mischers und den Farbton-Regler (§4),
die deutsche Fassung von `js.iconSelect.loadError` wird repariert („Klicken Sie auf , um…“). Zustände, Befehle und
Proto bleiben. Schlüssel entstehen über JavaDoc, `messages_en` wird erzeugt.

**Außerhalb des Pakets nachzuziehen:** der MUI-Test `busy-indicators.test.tsx` sucht `.tlIconSelect__loading` — er
prüft künftig `tl-status`; `text-inputs.test.tsx` (Filter fokussiert beim Öffnen, Optionen, Löschknopf) muss
unverändert grün bleiben.

**Die Tooltip-Regeln** (`.tl-tooltip-*`, rund 54 Zeilen) stehen am Ende des Blocks TLIconSelect, gehören aber zu
`bridge/TooltipPopover.tsx`. Sie bleiben im alten Stylesheet unter eigener Überschrift „Tooltip“ (neuer Block in der
Ratsche) und gehen mit 5d (V15).

**Nicht in 5a:** neue Funktionen (zuletzt benutzte Farben, Icon-Kategorien, Pipette, Kurzform `#RGB`); Umsortieren der
Palette per Tastatur (heute nur Ziehen); der MUI-Adapter des Sliders (`MuiSliderAdapter`) bleibt, wie er ist.

## 2 · Wie die Welle geliefert wird

Ein PR in tl-engine-7, zuerst gegen den 4c-Branch (!1911), nach dessen Merge gegen master. Das Paket entsteht auf `main`
von `TopLogic/tl-design-system` und wird mit `tools/publish-to-worktree.mjs` in den Worktree kopiert (versiegelt).
Commits tragen `Ticket #29875:`. Push nur nach Hendriks Freigabe; Subagenten committen lokal.

## 3 · Eine Picker-Hülle für Farbe und Icon (V1, V7)

Beide Popups zeichnen heute denselben Rahmen, dieselbe Tab-Leiste und dieselbe Aktionszeile, beide rechnen ihre Lage von
Hand. Künftig teilen sie eine Hülle:

```
div.tl-popover.tl-picker[role="dialog"][aria-label]      (Portal unter body, data-tl-anchored-overlay)
  div.tl-tabs.tl-picker__tabs                             (nur wo es Tabs gibt)
    div.tl-tabs__list[role="tablist"]
      button.tl-tabs__tab[role="tab"][aria-selected][aria-controls][tabindex 0/-1]
    div.tl-tabs__panel[role="tabpanel"][aria-labelledby]
  … Inhalt (Farbe §4, Icon §5)
  div.tl-button-bar.tl-picker__actions                    (wo es Aktionen gibt)
    Part Button  „Leeren“ (ghost, danger; am Anfang)  „Abbrechen“  „OK“ (primary)
```

- **Lage:** `usePopover({ open, anchor: Feldknopf, placement: 'bottom-start' })` — folgt Scroll und Größenänderung,
  klappt um, wenn unten kein Platz ist (heute einmal gerechnet). Fläche, Rand, Rundung, Schatten und Ebene kommen aus
  `tl-popover`; die feste Breite 480/420 px fällt (§4, §5).
- **Rolle:** `role="dialog"` mit `aria-label` aus `js.colorInput.chooseColor` bzw. `js.iconSelect.chooseIcon`, nicht
  modal (kein Scrim, die Seite bleibt sichtbar).
- **Fokus:** `useFocusTrap(open, ref, …)` — beim Öffnen auf den aktiven Tab (Farbe) bzw. das Filterfeld (Icon, wie
  heute), Tab bleibt im Popup, beim Schließen zurück auf den Feldknopf (heute bleibt der Fokus, wo er war).
- **Schließen:** Escape über `useStandaloneKeyboardScope`, Druck außerhalb über `useCloseOnOutsidePress` — wie heute,
  einmal in der Hülle statt zweimal kopiert. Der Druck auf den Feldknopf schließt und öffnet nicht neu
  (`pressClosedSurface`, wie heute).
- **Tabs:** das Markup von `tl-tabs` (Welle 3a). Die Tastatur — Pfeile, Pos1, Ende wählen und fokussieren, zyklisch —
  steht heute nur in `TLTabBar.tsx`. Sie wird ein Hook `useTabList` in `bridge/`, den `TLTabBar` und beide Picker
  nutzen: eine Tastatur für jede Tab-Leiste. Gewählt ist `aria-selected`, ohne fetten Text (der alte aktive Tab war
  600, `tl-tabs` ändert das Gewicht nicht).
- **Aktionen:** Part `Button`, als Leiste `tl-button-bar` (4c). „Leeren“ steht nur, wo leeren erlaubt ist.

## 4 · Farbfeld (V1, V6, V11)

```
Feld:   button.tl-swatch.tl-swatch--color[data-tl-state~="empty"][aria-invalid][aria-required][style=background]
        (lesend: span.tl-swatch.tl-swatch--color, ohne Knopf)
Popup:  tl-picker (§3), Tabs „Palette“ | „Mischer“
  Palette:  div.tl-color-picker__palette[role="listbox"][aria-label]   (Spalten aus paletteColumns, inline)
              div.tl-swatch.tl-swatch--color[role="option"][aria-selected][tabindex 0/-1]  (gefüllt)
              div.tl-swatch.tl-swatch--color[data-tl-state~="empty"]                        (leer, nur Ablageziel)
            Part Button „Zurücksetzen“ (link)
  Mischer:  div.tl-color-picker__mixer
              div.tl-color-picker__field[role="slider"][aria-label][aria-valuetext][tabindex=0]
                div.tl-color-picker__handle
              div.tl-color-picker__hue[role="slider"][aria-orientation="vertical"][aria-valuenow 0–360][tabindex=0]
                div.tl-color-picker__handle
  Rechts:   div.tl-color-picker__preview   (Aktuell / Neu, je tl-swatch tl-swatch--color tl-swatch--wide)
            tl-divider
            div.tl-color-picker__inputs    (Rot, Grün, Blau, Hex — Part TextInput mit Label, wie heute)
  Aktionen: Leeren · Abbrechen · OK
```

- **Ein Swatch statt fünf Fassungen.** Feldknopf, lesende Anzeige, Palettenzelle und Vorschau sind derselbe Block
  `tl-swatch`; das Schachbrett „keine Farbe“ steht einmal, aus Tokens (`data-tl-state~="empty"`) statt zweimal mit
  `#ccc`/`#eee`. Das Schachbrett ist Schmuck (hell 1,58 wie das alte `#ccc` auf Weiß, dunkel 1,23); den Zustand trägt
  der Rahmen des Swatches in `border-control` (≥ 3:1 auf `surface-overlay` und `surface-field`) zusammen mit dem Namen. Der rote Schrägstrich am leeren Feldknopf entfällt — „keine Farbe“ ist kein Fehler; das Schachbrett
  sagt es, der Name sagt es dem Screenreader (`js.colorInput.noColor`, heute ungenutzt).
- **Feldzustand:** der Feldknopf trägt `fieldStateAttrs` — Fehler, Warnung, Pflicht wie jedes andere Feld (heute zeigt
  das Farbfeld keinen davon). Die Optik folgt `tl-field` (Rand in der Statusfarbe).
- **Palette per Tastatur:** `useRovingFocus` über die gefüllten Zellen — Pfeile im Raster, Pos1/Ende; Leertaste übernimmt
  die Farbe in „Neu“ (wie ein Klick), Enter übernimmt und bestätigt (wie heute der Doppelklick). Leere Zellen sind
  keine Option, nur Ablageziel beim Ziehen. Ziehen und Tauschen bleiben, wie sie sind; das Zugbild ist ein `tl-swatch`
  statt eines Inline-`div` mit Literalen.
- **Mischer per Tastatur:** das Sättigung/Helligkeit-Feld ist ein `role="slider"` mit `aria-valuetext`
  („Sättigung 40 %, Helligkeit 80 %“): links/rechts ändern die Sättigung, hoch/runter die Helligkeit, je 1 %, mit
  Bild auf/ab 10 %. Der Farbton ist ein senkrechter `role="slider"` 0–360°, Pfeile je 1°, Bild auf/ab 10°, Pos1/Ende.
  Der Mischer merkt sich den Farbton über Schwarz und Grau hinweg (heute geht er bei Sättigung oder Helligkeit 0
  verloren — mit der Tastatur fiele das sofort auf).
- **Griff auf jeder Datenfarbe sichtbar:** ein Doppelring — innen eine helle, außen eine dunkle Linie (Rand plus
  `inset`-Linie, das Lint erlaubt keinen äußeren Schatten). Zwei neue Rollen `border-handle-light` und
  `border-handle-dark`, in beiden Modi gleich (der Griff steht auf Datenfarben, nicht auf Flächen des Themes). Gate: die
  beiden Rollen erreichen gegeneinander mindestens 9:1, in beiden Modi und in jedem abgeleiteten Theme — dann hat auf
  jeder beliebigen Farbe einer der beiden Ringe mindestens 3:1 (das Produkt der beiden Kontraste zu einer Farbe
  dazwischen ist der Kontrast der Ringe zueinander).
- **Datenfarben bleiben inline:** der Wert des Swatches, der reine Farbton hinter dem Feld, die Verläufe Weiß→Farbe und
  Farbe→Schwarz und das Farbtonspektrum sind Daten, kein Design — das TSX setzt sie als `style`. Das CSS des Pakets
  zeichnet nur Geometrie, Griffe und Rahmen aus Tokens.
- **Maße:** keine feste Breite; die Palette ergibt sich aus `paletteColumns` × Zellmaß `size-control`, der Mischer aus
  seinem Feld (`size-11`) und dem Farbtonregler (`size-control-sm` breit).
- **Commit wie heute:** alles im Popup ändert nur den Entwurf „Neu“; OK übernimmt (und trägt die Farbe in die erste
  freie Palettenzelle ein, wie heute), Abbrechen und Escape verwerfen.

## 5 · Icon-Feld (V1, V4, V6)

```
Feld:   button.tl-swatch[data-tl-state~="empty"][aria-invalid][aria-required] > ThemeIcon
        (leer: ThemeIcon ICON_CHOOSE_ICON statt <i class="fa-solid fa-icons">; lesend: span.tl-swatch)
Popup:  tl-picker (§3), Tabs „Einfach“ | „Erweitert“
  div.tl-icon-picker__filter     Part TextInput (Lupe, Löschknopf — wie heute)
  div.tl-icon-picker__grid[role="listbox"][aria-label]
    div.tl-icon-picker__cell[role="option"][aria-selected][aria-label][tabindex 0/-1] > ThemeIcon
    div.tl-status (lädt: Part Spinner · keine Treffer · Fehler mit Part Button „Erneut laden“, link)
  Erweitert: div.tl-icon-picker__advanced  (Klasse: Part TextInput · Vorschau)
  Aktionen (nur Erweitert): Leeren · Abbrechen · OK
```

- **Raster per Roving:** `useRovingFocus` statt `tabIndex=0` an jeder Zelle — ein Tab-Halt für das Raster, Pfeile
  bewegen. Enter/Leertaste wählen wie heute (Einfach: sofort, Erweitert: in das Klassenfeld).
- **Gewählt** ist `aria-selected` mit `surface-interactive-selected`, wie in Select und Menü (heute `#d0e2ff` plus
  eigenem Ring).
- **Laden, leer, Fehler** sind `tl-status`; der Fehler nennt den Knopf „Erneut laden“ als Part `Button` statt eines
  `<a href="#">`.
- **Maße:** Zelle `size-control` (heute 40 px, wie die Palette), Glyphe `tl-icon-md`; Popup `size-13` × `size-13` und
  weiter von Hand größer zu ziehen (`resize: both`, wie heute). Die eigene Scrollbar-Optik fällt.
- **Feldzustand** wie §4.

## 6 · Slider (V9)

```
span.tl-slider[data-tl-state~="warning"]
  span.tl-slider__track                       (Ruhespur)
    span.tl-slider__fill[style="inline-size: <Anteil> %"]
  input.tl-slider__input[type="range"][aria-invalid][aria-required][aria-valuetext]
  output.tl-slider__value
    span.tl-slider__text · span.tl-slider__sizer (min) · span.tl-slider__sizer (max)
```

- **Neue Komponente im Paket**, es gibt keine Vorlage. Der Slider bleibt ein natives `range` (Tastatur, Screenreader,
  `aria-valuetext` — heute gut, bleibt).
- **Die Füllung ist ein Element**, wie bei `tl-progress`: das TSX setzt ihre Breite inline. Heute schreibt es
  `--tlSlider-fill` in den Namensraum des Pakets, und 27 Pseudo-Regeln malen die Spur zweimal (WebKit, Firefox). Künftig
  ist die Spur des `range` durchsichtig, Ruhespur und Füllung liegen darunter; die Pseudo-Regeln zeichnen nur noch den
  Daumen.
- **Zustand über `fieldStateAttrs`** statt der Klassen `--error`/`--warning`: Fehler `aria-invalid`, Warnung
  `data-tl-state="warning"`, Pflicht `aria-required` (heute nicht gesetzt).
- **Daumen:** `size-choice`; halo beim Zeigen und Drücken wie heute aus `surface-state-hover`/`-active` (ein Daumen ist
  eine Marke, kein Eintrag). **Fokusring aus `base.css` um das ganze `range`** (Spur eingeschlossen), nicht mehr am
  Daumen: der alte Weg schaltete den Ring des Inputs mit `outline: none` ab, und das Lint verbietet das ohne Ausnahme.

## 7 · Bedien-Gewinne

- **U1 Enter bestätigt:** im Hex- und den RGB-Feldern des Farb-Pickers wirkt Enter wie OK; Enter auf einer Palettenfarbe
  bestätigt sie (heute nur Doppelklick).
- **U2 Das Popup bleibt am Feld:** es folgt Scrollen und Größenänderung und klappt um (heute an der Stelle, wo es
  geöffnet wurde).
- **U3 Der Fokus kehrt zurück:** nach OK, Abbrechen oder Escape steht der Fokus wieder auf dem Feldknopf.

Mehr nicht — größere Gewinne kommen mit dem UI-Durchgang nach Welle 5.

## 8 · Gates

- **Klassen (Lint):** kennt `tl-swatch` (`--color`, `--wide`), `tl-picker`, `tl-color-picker`, `tl-icon-picker`,
  `tl-slider`; keine Zustandsklasse (`--active`, `--selected`, `--empty`, `--noColor`, `--immutable`, `--error`,
  `--warning`); keine Literale (die Datenfarben stehen im TSX, §4); kein `outline: none`.
- **Kontrast:** `border-handle-light` gegen `border-handle-dark` ≥ 9:1 (Griff auf jeder Datenfarbe, §4);
  `border-control` als Rahmen des Swatches auf `surface-overlay` und `surface-field` ≥ 3:1; gewählte Icon-Zelle; Daumen und Füllung des Sliders auf `surface-field`;
  Statusrand am Swatch; beide Modi, jedes Theme.
- **`focus-clip.test.mjs`** misst die neuen Specimen-Seiten (Palette, Raster und Mischer liegen in einem Popover mit
  `overflow:auto`).
- **Verträge:** `swatch`, `picker`, `color-picker`, `icon-picker`, `slider` neu; `tabs` (Leser Picker, Hook
  `useTabList`), `popover` (Leser Picker), `button-bar` (Leser Picker) nachgezogen. Specimen prüft `role="dialog"`,
  `role="tablist"`/`tab` mit `aria-selected`, `role="listbox"`/`option` mit genau einem Tab-Halt, `role="slider"` mit
  `aria-valuetext` am Mischer, kein englisches Literal als `aria-label`.
- **Vitest (MUI-Modul):** Picker öffnet mit Fokus auf Tab bzw. Filter und gibt ihn beim Schließen an den Feldknopf
  zurück; Tab bleibt im Popup; Pfeile in Palette und Icon-Raster bewegen, Enter bestätigt; Mischer per Tastatur ändert
  den Entwurf; Feldzustand als Attribut an Swatch und Slider; `useTabList` in `TLTabBar` unverändert bedienbar.
- **Ratsche:** TLColorInput, TLIconSelect, TLSlider gestrichen; neuer Block „Tooltip“ (bis 5d); `foreignTl` ohne die
  vier `--tlSlider-*`.
- **Engine:** `engine-classes.test.mjs` meldet `tlColorInput`, `tlIconSelect`, `tlSlider` und `--tlSlider-` in
  `react-src` jedes Moduls, im alten Stylesheet, in Java, Views, tl-docs und der Demo. Modul-Tests `layout.react`,
  `layout.view`, `layout.configedit`, `demo.react` grün; MUI-Vitest grün; `tsc` 0; Vite grün; `check-messages-en.sh`
  ohne Diff; `published.test.mjs` und `TestDesignSystemCopy` grün.

## 9 · Reihenfolge mit Fertig-Bedingungen

1. **Paket: Swatch und Picker-Hülle.** `tl-swatch`, `tl-picker` auf `tl-popover`, `tabs`/`button-bar` nachgezogen.
   Fertig: Specimen mit Swatch gefüllt, leer, lesend, Fehler, Warnung; Picker mit Tabs und Aktionen; hell und dunkel,
   beide Dichten.
2. **Paket: Farb-Picker, Icon-Picker, Slider.** `tl-color-picker`, `tl-icon-picker`, `tl-slider`. Fertig: Specimen mit
   Palette, Mischer, Raster (lädt, leer, Fehler), Slider in allen Zuständen; `focus-clip` grün.
3. **Engine: Hook `useTabList`** in `bridge/`, `TLTabBar` darauf. Fertig: Reiter unverändert bedienbar, Vitest.
4. **Engine: Picker-Hülle** (Popover, Fokus, Schließen, Tabs, Aktionen) als gemeinsame Komponente. Fertig: Vitest Fokus
   und Schließen.
5. **Engine: Farbfeld** nach §4 mit Palette- und Mischer-Tastatur. Fertig: Block TLColorInput leer.
6. **Engine: Icon-Feld** nach §5. Fertig: Block TLIconSelect leer bis auf die Tooltip-Regeln (eigene Überschrift),
   MUI-Tests grün.
7. **Engine: Slider** nach §6. Fertig: Block TLSlider leer, `foreignTl` kürzer.
8. **Gates gesamt** nach §8, i18n mit `check-messages-en.sh`.
9. **Sichtprüfung lokal** (`tl-demo-react`, hell und dunkel, beide Dichten): Farbe und Icon im Formular „Attribute“
   (bearbeiten), Slider unter „Gestaltung“; Popup am Feld beim Scrollen; Tastatur durch Tabs, Palette, Mischer, Raster;
   Fokus zurück; Feldfehler sichtbar; im Konfigurationseditor einmal Farbe und Icon.
10. **Lokal committen, melden.** Push nur nach Freigabe; PR gegen den 4c-Branch (nach dessen Merge gegen master),
    Reviewer bhu. Trac #29875 bekommt `== Migration ==` und `RequiresMigration`.

Vor dem Start: Plan-Review durch einen frischen Agenten gegen die Gates (CLAUDE.md), dann SDD.

## 10 · Was das für die Anwendungen heißt

Steht im Trac-Text unter `== Migration ==` und als Alt→neu-Liste in `altlast.md`:

- Die Klassen `tlColorInput*`, `tlIconSelect*`, `tlSlider*` gibt es nicht mehr; `--tlSlider-*` ebenso.
- Sichtbar: das Popup ist so breit wie sein Inhalt und bleibt beim Scrollen am Feld; Tabs ohne fetten Text; die
  gewählte Icon-Zelle in der Auswahlfarbe des Systems; der leere Farbknopf ohne roten Schrägstrich; Farb- und Icon-Feld
  zeigen Fehler und Pflicht wie andere Felder.

## 11 · Offen und entschieden

Beim Schreiben entschieden (Orchestrator, Hendrik prüft beim Lesen):

1. **`role="dialog"`, nicht modal**, mit Fokusfalle — das Popup hat mehrere Bedienelemente und Aktionen, wie ein kleiner
   Dialog; ein Scrim wäre für ein Feld-Popup zu schwer.
2. **`useTabList` als gemeinsamer Hook**, auch für `TLTabBar` — sonst stünde die Tab-Tastatur dreimal. Kostet: ein
   migriertes Control (3a) wird angefasst.
3. **Ein Block `tl-swatch`** für Feldknopf, lesende Anzeige, Palettenzelle, Vorschau und Icon-Feld; das Schachbrett aus
   `surface-field` und `border-separator` in Kacheln von `space-xs`.
4. **Der rote Schrägstrich fällt** — Rot heißt im System Fehler, „keine Farbe“ ist keiner.
5. **Datenfarben inline** (Wert, Farbton, Verläufe, Spektrum); das Lint bleibt ohne Ausnahme.
6. **Slider-Füllung als Element** statt Variable — kein Fremdname im Namensraum, Pseudo-Regeln nur für den Daumen.
7. **Zellmaß `size-control`** für Palette und Icon-Raster (heute 33 und 40 px) — ein Rastermaß, dichteabhängig.
8. **Popup-Maße:** Farbe ohne feste Breite; Icon `size-13` × `size-13`, weiter von Hand größer zu ziehen; die eigene
   Scrollbar fällt.
9. **Tooltip-Regeln** bleiben bis 5d im alten Stylesheet, unter eigener Überschrift.
10. **Fokusring des Sliders um das ganze `range`** statt am Daumen — keine neue Ausnahme im Lint. Kostet: der Ring
    umschließt die Spur, nicht nur den Daumen.
11. **Griff des Mischers als Doppelring** aus zwei neuen, modusgleichen Rollen; das Gate rechnet 9:1 zwischen ihnen statt
    gegen jede Datenfarbe (die der Gate nicht kennt).
12. **Schachbrett ist Schmuck**, den Zustand „keine Farbe“ tragen Rahmen und Name; gemessen wird der Rahmen.

Aus der Builder-Prüfung (vom Bauenden zu entscheiden): der 2D-`role="slider"` braucht `aria-valuenow` (Sättigung als
Wert, beides in `aria-valuetext`); `useTabList` nimmt einen Rückruf für die Wahl — `TLTabBar` sendet den Befehl
`selectTab`, die Picker wählen lokal.
