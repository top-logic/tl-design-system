# Welle 2 — Formulare: ein Feldrahmen, Zustände als Attribute

**Stand:** 2026-09-30 · Ticket #29617
**Baut auf:** [`2026-09-17-design-system-neuaufbau-design.md`](2026-09-17-design-system-neuaufbau-design.md) §4 Wellen,
§5 Gates; `docs/skalen.md` „Rahmen: vier Stufen“, „Fokus: ein Ring“, „Disabled: vier Rollen ohne Gate“,
„Icon: die Stufe ist die Rolle“, „Pill: Rolle statt Farbe“; Befunde `docs/migration/altlast.md` „Sichtbare Befunde“
**Entschieden mit Hendrik:** 30.09., in dieser Sitzung (Abschnitte 1–4 freigegeben)

---

## 1 · Ziel und Abgrenzung

Welle 2 schneidet die Formular-Controls aus `tlReactControls.css` heraus und schreibt sie im Paket neu.
Fertig ist sie, wenn die zwölf Blöcke unten leer und aus `test/ratchet.json` gestrichen sind — nicht,
wenn die neuen Felder aussehen wie die alten.

| Gruppe | Controls (TSX) | Alte Blöcke (Zeilen) |
|---|---|---|
| Feld | `TLTextInput`, `TLPasswordInput`, `TLNumberInput`, `TLDatePicker`, `TLSelect` | Simple input controls 176, Error / Warning states for simple inputs 43 |
| Auswahl | `TLCheckbox`, `TLBooleanChoice`, `TLSegmentedChoice`, `TLOptionChips` | Checkbox 72, TLBooleanChoice 46, TLSegmentedChoice 100, TLOptionChips 70 |
| Select | `TLDropdownSelect`, `selectOptions.tsx` | TLDropdownSelect 303 |
| Formular | `TLFormField`, `TLFormGroup`, `TLFormLayout`, `TLFieldList` | TLFormField 305, TLFormGroup 112, TLFormLayout 35, TLFieldList 22 |
| Upload | `TLFileUpload`, `TLBinaryField`, `TLUploadButton` | TLFileUpload 57 |

Summe 1.341 Zeilen. Dazu im Paket, **ohne** Control in der Engine: Alert, Badge, Divider, Skeleton
(Richtung 1 von #29650) — CSS, Vertrag, Specimen. Radio gehört fachlich zu Welle 2 und wird Control (§4).

**Nicht Ziel:** die Tabellenzelle als Ganzes (Welle 3), Kalender, Farbe, Icon-Auswahl (Welle 5), Java-Zustand
über das Nötige hinaus. Der Zustand wird nicht neu geschnitten; wo `state.proto` (!1698) landet, verweisen
die Verträge nachträglich darauf (UI-Paket-Spec §4).

> **Fortgeschrieben 30.09.:** Zur Summe kamen beim Bauen `TLResourceCell` und „Visually hidden text“ (beide gestrichen) und
> `TLToolbar` −6; die Ratsche steht bei 5994 Zeilen (davor 7252).

## 2 · Wie die Welle geliefert wird

**Ein PR für die ganze Welle** (Hendrik, 30.09.): Ein Review wartet etwa gleich lang, ob klein oder groß;
fünf kleine PRs stehen hintereinander. Die Commits sind nach den Gruppen oben geordnet, damit der Review
abschnittsweise lesbar bleibt.

**Wellen überlappen, gemergt wird der Reihe nach.** Die Regel der Neuaufbau-Spec §4 „Keine Welle beginnt,
bevor die vorherige grün ist“ wird zu: **Keine Welle wird gemergt, bevor die vorherige gemergt ist.** Welle
n+1 baut auf dem Branch von Welle n, solange diese im Review liegt, und wird nach deren Merge auf master
umgestellt — wie Avatar auf Pill. Muster aus Welle n fließen so trotzdem in Welle n+1. Anlass: das ganze
System soll bis Ende der Woche ab 05.10. stehen; nacheinander passt das bei der Review-Wartezeit nicht.

**Branch:** `CWS/CWS_29617_design_system_welle_2`, von `CWS/CWS_29617_design_system_welle_1_avatar` (!1695),
weil Welle 2 `TLFormField.tsx` und `ThemeIcon` anfasst, die dort geändert sind. Nach dem Merge von !1695
auf master umstellen.

> **Fortgeschrieben 30.09.:** !1695 ist auf master (`95146ca38c`); der Branch hat `origin/master` gemergt (`bf970e6f54`).
> Das PR-Ziel ist master.

## 3 · Feldrahmen und Zustände

### 3a · Eine Klasse für den Rahmen

`tl-field` liegt direkt am `input`, `textarea` oder `select` von Text, Passwort, Zahl, Datum und Select und
an der Wurzel von `TLDropdownSelect`. Die Selektorliste `.tlReactTextInput, .tlReactNumberInput, …` fällt;
DropdownSelect baut den Rahmen nicht mehr nach.

| Teil | Token |
|---|---|
| Höhe | `size-control` (folgt der Dichte); mehrzeilig `min-height` |
| Innenabstand | `space-control-x` / `space-control-y` |
| Radius | `radius-sm` (bedient) |
| Fläche | `surface-field` |
| Rand | `border-control`, `border-width-sm` — am Gate 3,0 gegen `surface-field` und die umgebende Fläche; ersetzt den Befund 1,38:1 |
| Rand beim Zeigen | `border-emphasis` |
| Text / Platzhalter | `text-primary` / `text-placeholder` |
| Schrift | `tl-type-body`, von außen gesetzt wie beim Button; `tl-field` hat keine Schriftregel |
| Fokus | der Ring aus `base.css`, `:focus-visible`; `:focus` und `outline: none` fallen |
| Icon im Feld, Endknopf (Löschen, Öffnen) | `ThemeIcon` in `tl-icon-sm`; Wrapper `tl-field-group`, Elemente `tl-field-group__icon`, `tl-field-group__action` |

Die Varianten des Textfelds (`--multiline`, `--withIcon`, `--clearable`) werden `tl-field--multiline`; Icon
und Endknopf brauchen keinen Modifier. Den Rahmen trägt auch hier das echte `input.tl-field`: ein Wrapper
`span.tl-field-group` legt Icon (`tl-field-group__icon`) und Endknopf (`tl-field-group__action`) absolut
darüber, und das Feld reserviert ihren Platz über `.tl-field-group:has(> .tl-field-group__icon) > .tl-field`.
Ein Wrapper `span.tl-field` mit rahmenlosem Input fällt: der Fokusring läge innen um den Input, und ihn dort
abzuschalten verlangte ein `outline: none`, das das Gate verbietet.

> **Fortgeschrieben 30.09.:** Die Feldgruppe hat einen Endplatz (Löschen ersetzt Öffnen), und die Wurzel des Textfelds
> trägt `tl-field-group` selbst. Felder haben keinen `padding-block`: die Höhe ist `size-control`,
> `space-control-y` gilt nur mehrzeilig; das Select hält mit Chips (`size-control-sm`) dieselbe Höhe.

### 3b · Zustände sind Attribute, jeder aus einer Quelle

| Zustand | Attribut | CSS |
|---|---|---|
| Fehler | `aria-invalid="true"` — wo ARIA es erlaubt (`textbox`, `combobox`, `checkbox`, `switch`, `radiogroup`, `listbox`); sonst `data-tl-state~="error"` | Rand `status-error-border` |
| Warnung | `data-tl-state~="warning"` — ARIA kennt keine Warnung | Rand `status-warning-border` |
| Deaktiviert | natives `disabled` | `surface-disabled`, `text-disabled`, `border-disabled` (ohne Gate) |
| Zeigen | `:hover` | Rand `border-emphasis` |

`data-tl-state` ist die schon festgelegte Attributform für Zustände ohne ARIA-Gegenstück (Neuaufbau-Spec
§2, Übersicht „Zustände sind Attribute“); ihr Wert ist eine Wortliste, das CSS liest `~=`. Die Klassen
`--error`, `--warning`, `--disabled`, `--selected` fallen überall.

Das CSS liest `aria-invalid` selbst, damit Screenreader und Bild dieselbe Quelle haben und keiner von beiden
vergessen wird. Warnung erscheint nur ohne Fehler (heute schon: `!hasError && hasWarnings`).

**DropdownSelect bekommt einen Fehlerzustand** — heute hat er keinen, obwohl der Server `hasError` sendet.

`disabled` sendet kein Formular-Control heute (die Bestandsaufnahme fand es nur bei Button, Menü, Sidebar,
Dashboard). Die Regel bleibt im Vertrag, weil sie eine Zeile kostet und Kundenmodule sie brauchen.

> **Fortgeschrieben 30.09.:** Deaktiviert schlägt Fehler und Warnung — am Element durch die Reihenfolge, in Gruppen durch
> `:not(:disabled)`. Alle Controls lesen `state.disabled`, auch wenn es heute niemand sendet.

### 3c · Schreibgeschützt ist ein anderes Element

Bei `editable: false` rendert kein Eingabefeld, sondern Text. Klasse `tl-field-value`: kein Rahmen,
`text-primary`, eine Zeile mit Ellipse (`min-width: 0`, `overflow: hidden`, `text-overflow: ellipsis`). Als
Link (`option.link`, heute `a.tlOptionValue.tlResourceCell`) liest sie `text-link` / `text-link-hover`.
Damit fallen zwei Befunde: der Browser-Link-Standard 1,29:1 im Dunkelmodus und die hart abgeschnittene Pill
in der 120-px-Zelle. `--immutable` fällt überall, `.tlOptionValue` und `.tlResourceCell` ebenfalls.

> **Fortgeschrieben 30.09.:** Die Checkbox bleibt schreibgeschützt ein Kästchen, aber mit `aria-readonly="true"` statt
> `disabled` — die Markenfüllung und ihr Kontrast bleiben. Mehrzeilig ist `tl-field-value--multiline` und
> bricht um (in der Zelle eine Reihe ohne Umbruch). Der Link-Lesewert ist unterstrichen. Der Lesewert von
> Dropdown, Segmenten und Chips ist eine Liste in `tl-select__values`.

### 3d · Tabellenzellen

Die Zell-Regeln (`:has(...)`-Ringe für Fokus, Fehler, Warnung; kein Innenabstand) im Block TLTableView lesen
danach `tl-field` und die Attribute aus 3b statt der alten Klassen. Umbenannt wird an Ort und Stelle; der
Block wächst nicht. Der Rest der Zelle ist Welle 3.

## 4 · Auswahl

**Checkbox, Radio, Schalter** zeichnen sich per `appearance: none` aus Tokens statt über `accent-color`
und Browser-Standard.

| Teil | Token |
|---|---|
| Kästchen, Kreis | `size-choice` (neu, `{size-4}`); Rand `border-control`; Radius `radius-sm` bzw. `radius-round` |
| Angekreuzt | Fläche `surface-brand`, Haken bzw. Punkt `text-on-brand`; Haken aus zwei Rändern, kein Bild |
| Gemischt (`triState`) | `aria-checked="mixed"`, Strich statt Haken |
| Schalter | Variante `tl-checkbox--switch`, `role="switch"`; Spur `radius-full`, Breite `size-switch` (neu, `{size-7}`); Bewegung `duration-fast`, `easing-standard`; Reduced Motion über den globalen Schalter |
| Trefferfläche | das Label gehört dazu; Höhe `size-control` |

Klassen: `tl-checkbox`, `tl-radio` (neu), `tl-choice-group` für die Gruppe (`role="radiogroup"`, Abstand
`space-control-gap`). `TLBooleanChoice` als Radio rendert zwei `tl-radio`; als Select ein `tl-field`. Damit
fällt der Befund „Radio ohne Rand, reiner Browser-Standard“.

**SegmentedChoice → `tl-segmented`, OptionChips → `tl-chip`.** Gewählt ist, was `aria-checked="true"`
(Einfachwahl, `role="radio"`) bzw. `aria-pressed="true"` (Mehrfachwahl) trägt — das setzen sie heute schon,
das CSS liest es künftig. Gewählt: `surface-brand-subtle`, Rand `border-interactive`; sonst `surface-field`,
Rand `border-control`. Der **gleitende Marker fällt** (Inline-`left`/`width`, 160-ms-Animation): das gewählte
Segment trägt die Fläche selbst. Fehler an `tl-chip`-Gruppen (`role="group"`) über `data-tl-state~="error"`.

> **Fortgeschrieben 30.09.:** Ein gewählter Chip ist die Marke (`surface-brand`, `text-on-brand`), wie ein angekreuztes
> Kästchen; das gewählte Segment bleibt `surface-brand-subtle`. Die Prüfzustände der Chip-Gruppe treffen nur
> ungewählte, nicht deaktivierte Chips; `aria-invalid` an der Chip-Gruppe fällt (ARIA verbietet es dort).

## 5 · Select

**`TLDropdownSelect` → `tl-field tl-select`**, `role="combobox"` bleibt.

| Teil | Entscheidung |
|---|---|
| Popup | `surface-overlay`, `shadow-popover`, `layer-popover` statt `z-index: 10000`, `radius-md` (umschließt) |
| Symbole | ▲▼, ×, 🔍, ⋮⋮ werden `ThemeIcon` in `tl-icon-sm`; Namen aus dem Theme |
| Laden | der unbestimmte Fortschritt (`tl-progress`, `aria-busy`) statt eines eigenen Spinners |
| Hervorhebung | `aria-activedescendant` am Suchfeld, `data-tl-state~="highlighted"` an der Option; `aria-selected` meint wieder „gewählt“ |
| Option | Höhe `size-row`; Treffer im Label `tl-type-body-strong` statt `<strong>` mit eigener Regel |
| Mehrfachwert | Chip = `tl-pill` der Rolle (neutral ohne Rolle) plus Entfernen-Knopf; Ziehen: `data-tl-state~="dragging"`, Marker `border-width-accent` in `border-interactive` |
| Leer, Fehler, keine Treffer | `text-placeholder`, `status-error-text`, `text-secondary` |
| Suchfeld im Popup | ein `tl-field`; das `outline: none` fällt |

**Ein gewählter Einzelwert mit Rolle erscheint als Pill.** Liste, Chips und Tabellenzelle zeigen die Rolle;
nur der gewählte Wert verlor sie (`tlDropdownSelect__value`, Befund „Select (Einzelwert)“). Das dreht die
Regel vom 10.09. um und wird im PR begründet: eine Rolle, die beim Wählen verschwindet, ist keine Rolle.

**Einfaches `TLSelect`:** `tl-field`, der Pfeil bleibt nativ.

> **Fortgeschrieben 30.09.:** Das Popup auf `layer-popover` lag unter dem Dialog-Backdrop des Altbestands; acht Regeln des
> Altbestands lesen darum jetzt die Ebenen-Tokens (`docs/skalen.md` „Stapel-Übergang“). Die Symbole sind feste
> ThemeImages (`css:fa-solid …`) wie in `TLValueList`, nicht Namen aus dem Theme.

## 6 · Formular

**`TLFormField` → `tl-form-field`.**

| Teil | Entscheidung |
|---|---|
| Label-Lage | Variante: `tl-form-field--side`, `--top`, `--after`, `--hidden`; `--fullLine` bleibt Variante `--full` |
| Label | `tl-type-label`, `text-secondary` |
| Pflicht | Stern `status-error-text`, `aria-hidden="true"`; am Eingabefeld `aria-required="true"` |
| Fehler / Warnung / Hilfe | `status-error-text` / `status-warning-text` / `text-helper`, Icons `tl-icon-sm`; `role="alert"` und `aria-live="polite"` bleiben |
| Geändert | `data-tl-state~="dirty"` an der Wurzel; Punkt `surface-brand`, Maß `size-indicator` (neu, `{size-2}`) — statt `layer-accent` (offener Punkt aus dem Final-Review) |
| Label-Spalte | Tokens `size-field-label-min` / `size-field-label-max` (neu) statt `minmax(6rem, 10rem)`; die Skala bekommt dafür neue Primitive |
| Hilfe-Knopf | `tl-button` ghost mit `ThemeIcon`, nicht das Inline-SVG |
| Unsichtbares Label | `tl-visually-hidden`, neu in `base.css`; `tlVisuallyHidden` fällt |

Die toten Klassen `tlFormField--error` / `--warning` (keine Regel) fallen ohne Ersatz; der Zustand steht am
Eingabefeld. `TLPanel` liest heute `tlFormField__error` mit — er bekommt `tl-form-field__error` mit.

**`TLFormGroup` → `tl-form-group`.** Rahmen `none` / `subtle` / `outlined` → keiner / `border-separator` /
`border-control`, Radius `radius-md`. Einklappen: `aria-expanded` am Knopf, `hidden` am Körper; der Chevron
ist ein `ThemeIcon`, die getauschte Klasse `__chevron--collapsed` fällt. Titel `tl-type-heading-sm`.

**`TLFormLayout` → `tl-form-layout`**, Grid mit `space-md`-Abstand. Die Spaltenbreite bleibt ein Inline-Maß,
weil sie aus dem Zustand gerechnet wird (`max(16, 64 / maxColumns)` rem) — Daten wie die Breite der
Fortschrittsfüllung, kein Stil. Tote Klassen (`--readonly` ohne Regel) fallen.

**`TLFieldList` → `tl-field-list`**, Titel `tl-type-heading-sm`, Trennlinie `border-separator`.

**Upload.** `tl-upload` wird definiert (Wrapper, `inline-flex`, `space-control-gap`). Die Knöpfe von
`TLFileUpload` und `TLBinaryField` werden `tl-button` `secondary`; Hochladen ist `aria-busy` am Knopf (kann
der Button). Die Drop-Zone zeigt `data-tl-state~="dragover"`: Rand `border-interactive`, gestrichelt,
`border-width-md`. Das `outline: none` am Upload-Knopf fällt.

> **Fortgeschrieben 30.09.:** `aria-required` steht nur an Rollen, die es führen — nicht an `role="group"`; die Pflicht
> zeigt dort der Stern. Jede Warnung ist ein eigenes `tl-form-field__message` mit Id und steht in
> `aria-describedby` (Fehler, Warnungen, Hilfe). Der gestrichelte Rand der Drop-Zone ist ein `outline`
> (`border-width-md`, `border-interactive`, Abstand `focus-offset`), kein `border`.

## 7 · Neu im Paket: Alert, Badge, Divider, Skeleton

Je CSS, Vertrag, Specimen, Gate — kein Control, kein TSX, keine Zeile in der Engine. Controls entstehen,
wenn eine Ansicht sie braucht (Regel aus dem Konsolidierungsplan: zuerst im Paket, dann als Control).

| Komponente | Kern |
|---|---|
| Alert | vier Bedeutungen × `status-*-subtle` / `-border` / `-text`, Icon `tl-icon-md`, `role="alert"` bzw. `status` |
| Badge | Zahl an einem Icon oder Reiter; `surface-brand` + `text-on-brand`, `tl-nums`, `radius-full` |
| Divider | `border-separator`, `border-width-sm`, horizontal und vertikal, `role="separator"` |
| Skeleton | `surface-interactive-selected`, Puls über `duration-loop`, `aria-hidden`; Reduced Motion: kein Puls |

## 8 · Gates

Neu, alle im Paket (`node --test`):

- **Kontrast:** `border-control` ≥ 3,0 gegen `surface-field`, `surface-base`, `surface-layer`; `status-error-border`
  und `status-warning-border` ≥ 3,0 gegen `surface-field`; `text-placeholder` ≥ 4,5 gegen `surface-field`;
  `text-on-brand` ≥ 3,0 gegen `surface-brand` für Haken und Punkt — beide Modi, jedes Theme.
- **Klassen:** jede neue Komponentendatei liest nur Tokens, kein Literal, kein `:focus` ohne `-visible`, kein
  `outline: none`; keine Zustandsklasse (`--error`, `--warning`, `--selected`, `--disabled`, `--immutable`,
  `--open`) — das Lint kennt die Liste.
- **Verträge:** je Komponente `*.contract.md` mit Zustand, Aktionen, Tokens, Attributen, Konformität, wie Pill.
- **Ratsche:** die zwölf Blöcke aus §1 sind gestrichen; `foreignTl` unverändert.
- **Engine:** `grep` über `react-src`, `tlReactControls.css` und `docs/` findet keine der alten Klassen
  (`tlReactTextInput`, `tlReactNumberInput`, `tlReactDatePicker`, `tlReactSelect`, `tlReactCheckbox`,
  `tlBooleanChoice`, `tlSegmentedChoice`, `tlOptionChips`, `tlDropdownSelect`, `tlOptionValue`,
  `tlResourceCell`, `tlFormField`, `tlFormGroup`, `tlFormLayout`, `tlFieldList`, `tlFileUpload`,
  `tlVisuallyHidden`); Modul-Tests `layout.react`, `layout.view`, `demo.react` grün; `check-messages-en.sh`
  ohne Diff; `tsc --noEmit` ohne Befund in den angefassten Dateien.

> **Fortgeschrieben 30.09.:** Das Kontrast-Gate prüft Feldränder auf fünf Feldgründen (`surface-field`, `-base`, `-layer`,
> `-layer-nested`, `-overlay`) und Text, Hilfetext und Status-Text auf vier Flächen; die Marke als Vordergrund
> prüft ein eigener Test. Fehler und Warnung als Modifier regelt `MODIFIERS` je Block, nicht `STATE_MODIFIER`;
> am Element ist jeder Zustand ein Verstoß. Das Engine-Gate liest jedes `react-src` im Worktree.

## 9 · Reihenfolge mit Fertig-Bedingungen

1. **Paket: Feld.** `field.css`, `tl-field-value`, `tl-visually-hidden` in `base.css`, neue Maße, Kontrast-Gates.
   Fertig: Specimen zeigt Ruhe, Zeigen, Fokus, Fehler, Warnung, deaktiviert, schreibgeschützt, mehrzeilig, mit
   Icon, hell und dunkel, beide Dichten; Gates grün.
2. **Paket: Auswahl, Select, Formular, Upload.** Je CSS, Vertrag, Specimen. Fertig: Gates grün, Lint kennt
   alle Modifier.
3. **Paket: Alert, Badge, Divider, Skeleton.** Fertig: wie 2. Läuft parallel zu 4–6.
4. **Engine: Feld.** Branch von !1695; TSX der fünf Feld-Controls, Zell-Regeln im TableView-Block, Blöcke
   „Simple input controls“ und „Error / Warning states“ leer. Fertig: Modul-Tests grün, Ratsche gesenkt.
5. **Engine: Auswahl, Select, Formular, Upload**, je Gruppe ein Commit. Fertig: alle zwölf Blöcke gestrichen,
   `grep` aus §8 leer, Tests grün, `messages_en` ohne Diff.
6. **Sichtprüfung** in der Docker-Instanz des PRs, hell und dunkel: Dialog „Neues Demo-Objekt“ (Feldränder,
   Radio, Checkbox), Objektliste (Filter „Status“ mit Pill, Tabelle „Geschlossen“ mit Ellipse, Eigentümer-Link),
   ein Formular mit Fehler und Warnung, Upload. Fertig: jede Zeile aus `altlast.md` „Sichtbare Befunde“ der
   Welle 2 ist als erledigt markiert.
7. **PR** gegen den Branch von !1695 (nach dessen Merge gegen master), Bernhard Reviewer, Trac #29617 CC;
   Beschreibung englisch, Migration für Anwendungs-Stylesheets (alte → neue Klassen).

> **Fortgeschrieben 30.09.:** zu 4 und 7: !1695 ist auf master (`95146ca38c`), der Branch hat `origin/master` gemergt
> (`bf970e6f54`); der PR geht gegen master.

## 10 · Nicht-Ziele und Offenes

- Zell-Editoren der Tabelle über die Umbenennung hinaus: Welle 3.
- Die Welle-1-Hinweise AppBar-Kollaps, AppBar auf `surface-layer`, `ButtonTone.DANGER` bleiben in STATUS.
- Die `derive`-Resthinweise (Kollaps-Hinweis, achromatische 20°-Prüfung) nimmt Welle 2 im Paket mit, weil
  die neuen Kontrast-Gates je Theme laufen.
- Offen, nicht blockierend: wo `derive` rechnet (Bernhard, 25.09., Übergabe in `docs/uebergabe/`).
