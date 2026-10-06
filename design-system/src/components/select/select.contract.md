# Vertrag: Select

Eine Kundenkomponente, die unter dem TopLogic-Namen `TLDropdownSelect` registriert ist (Stufe C der
Spec), bekommt vom Server den Zustand unten, löst die genannten Aktionen aus und trägt die genannten
Attribute. TopLogic garantiert dann Funktion, Tastatur und Fokus — nicht das Aussehen. Wer ins Bild
passen will, liest die Tokens. Die Wurzel ist ein Feld: `tl-field tl-select` mit `role="combobox"`;
Rahmen, Fehler, Warnung und Fokusring kommen aus dem Vertrag des Feldes (`field.contract.md`). Dasselbe
Java-Control rendert mit `display` auch `TLOptionChips` und `TLSegmentedChoice`; deren Vertrag steht
in `choice.contract.md`.

## Zustand

Vom Server über `useTLState()`. Die Basisschlüssel aus `ReactFormFieldControl` — `value`, `editable`,
`mandatory`, `hasError`, `hasWarnings`, `label`, `hidden` und die übrigen — stehen im Vertrag des
Feldes (`field.contract.md`, Abschnitt Zustand) und gelten hier. Aus `ReactDropdownSelectControl`:

| Schlüssel | Typ | Bedeutung |
|---|---|---|
| `value` | Liste von Deskriptoren | Die gewählten Optionen, je ein Deskriptor (unten). Leer: nichts gewählt. Bei Einfachwahl höchstens einer. |
| `options` | Liste von Deskriptoren | Alle Optionen; erst nach `loadOptions` aktuell. |
| `optionsLoaded` | boolean | Ob `options` aktuell ist. `false`: der Client fordert die Liste beim Öffnen an und zeigt solange den Ladezustand. Der Server setzt es zurück, wenn der Wert oder die Optionen sich ändern. |
| `multiSelect` | boolean | Mehrfachwahl: die Werte erscheinen als Wert-Chips, jeder mit Entfernen-Knopf. |
| `customOrder` | boolean | Die Wahl behält ihre Reihenfolge: Wert-Chips lassen sich ziehen (`tl-select__drag-handle`). Sonst sortiert der Server. |
| `emptyOptionLabel` | string | Beschriftung für „nichts gewählt“: Platzhalter der Wurzel. |
| `display` | string, optional | Fehlt bei `TLDropdownSelect`; `chips` bzw. `segmented` wählen die anderen Formen. |
| `editable` | boolean | `false`: kein Combobox, sondern der Lesewert `tl-field-value` (unten). |
| `mandatory` | boolean | Pflichtfeld: `aria-required="true"` an der Wurzel. |
| `hasError` | boolean | Fehler: `aria-invalid="true"` an der Wurzel. |
| `hasWarnings` | boolean | Warnung: `data-tl-state="warning"` an der Wurzel, nur ohne Fehler. |
| `disabled` | boolean | Inaktiv, wie beim Button (`button.contract.md`): der Client liest `state.disabled` (siehe Attribute). |

Deskriptor einer Option (`OptionDescriptor`), in `value` und `options` gleich:

| Feld | Typ | Bedeutung |
|---|---|---|
| `value` | string | Id der Option in dieser Sitzung; `valueChanged` nennt sie. |
| `label` | string | Beschriftung. |
| `image` | string, optional | Kodiertes ThemeImage (`ThemeIcon` in `tl-icon-sm`) vor der Beschriftung. |
| `colorRole` | string, optional | Farbrolle des Wertes (`ReactValueColor`): der Wert erscheint als `tl-pill` dieser Rolle. Fehlt sie, ist der Wert Text. |
| `link` | boolean, optional | Nur im Lesewert: die Option führt dorthin, wo die Anwendung sie zeigt (`goto`). |

**Pill:** ein Wert mit `colorRole` erscheint als `tl-pill` der Rolle — in der Optionsliste, als
gewählter Einzelwert (`tl-select__value`), im Wert-Chip und im Lesewert. Ein Wert-Chip ohne Rolle ist
die neutrale `tl-pill`.

**Wert-Chip:** ein gewählter Wert bei `multiSelect`, eine `tl-pill` mit `tl-select__chip` und einem
Entfernen-Knopf darin. Er ist passiv bis auf diesen Knopf — nicht der wählbare `tl-chip` von
`TLOptionChips` (`choice.contract.md`).

**Knöpfe und Popup:** Wert-Chip entfernen und Leeren sind `tl-button tl-button--ghost tl-button--sm tl-button--icon`
mit `aria-label` (`button.contract.md`); das Popup trägt `tl-popover tl-select__popup`
(`popover.contract.md`) — Fläche, Ebene und Lage kommen aus `tl-popover`.

## Aktionen

| Auslöser | Aktion |
|---|---|
| erstes Öffnen, solange `optionsLoaded: false` | `sendCommand('loadOptions')`; der Server antwortet mit `options` und `optionsLoaded: true`. |
| „Erneut versuchen“ im Ladefehler | `sendCommand('loadOptions')` noch einmal. |
| Wahl einer Option, Entfernen eines Wert-Chips, Löschen, Umordnen | `sendCommand('valueChanged', { value })`, `value` die Liste der gewählten Options-Ids in ihrer Reihenfolge. |
| Wahl über stabile Schlüssel (Skript, Agent, Aufzeichnung) | `sendCommand('selectByKey', { keys })`; der Client sendet es nicht selbst — eine aufgezeichnete `valueChanged` wird als `selectByKey` gespeichert. |
| Link einer Option im Lesewert | `sendCommand('goto', { option })`, `option` die Id; nur bei `editable: false` und `link` im Deskriptor. |

## Tastatur

Der Fokus bleibt an der Wurzel bzw. am Suchfeld; die Hervorhebung wandert über
`aria-activedescendant`, nicht der Fokus.

| Taste | geschlossen | offen |
|---|---|---|
| `ArrowDown` / `ArrowUp` | öffnet | bewegt die Hervorhebung, am Ende weiter am Anfang |
| `Enter` / Leertaste | öffnet (auf einem Knopf in der Wurzel: löst den Knopf aus) | `Enter` wählt die hervorgehobene Option |
| `Escape` | — | schließt, der Fokus kehrt zur Wurzel zurück |
| `Tab` | verlässt das Feld | schließt und verlässt das Feld |
| `Backspace` | — | im leeren Suchfeld bei `multiSelect`: entfernt den letzten Wert-Chip |
| Tippen | — | filtert die Optionen im Suchfeld; der Treffer im Label nimmt die kräftige Variante der Typo-Klasse seines Trägers: `tl-type-body-strong` in einem schlichten Label, `tl-type-label-strong` in einer Pill |

## Tokens

| Teil | Token |
|---|---|
| Wurzel | Rahmen aus `tl-field` (`field.contract.md`); Abstand der Teile `--tl-space-xs`; `--tl-space-control-y` liest sie nicht (nur mehrzeilig, im `tl-field--multiline`) |
| Höhe | `--tl-size-control`, Wert-Chips `--tl-size-control-sm`: Innenabstand oben und unten (`--tl-size-control` − `--tl-size-control-sm`) / 2 − `--tl-border-width-sm`, damit eine Reihe Wert-Chips das Feld nicht über `--tl-size-control` wachsen lässt |
| Werte, Wert-Chips, Knöpfe | Lücke `--tl-space-2xs`; Einzelwert `--tl-space-xs` |
| Platzhalter | `--tl-text-placeholder` |
| Entfernen, Löschen | `tl-button--icon` mit `--sm` und `--ghost`: Trefferfläche `--tl-size-control-sm` im Quadrat (WCAG 2.5.8), Farben, Zeigen und Deaktiviert aus `button.contract.md`; der Entfernen-Knopf ragt oben und unten um `--tl-border-width-sm` und am Ende um `--tl-space-2xs` über den Inhalt der Pille, damit sie nicht wächst |
| Knöpfe im Feld: Löschen und Pfeil | am Ende der Wurzel, `--tl-space-2xs` vom Rand (Innenabstand am Ende der Wurzel); beim Zeigen `--tl-surface-interactive-selected`, beim Drücken `--tl-surface-interactive-active` statt der Ghost-Stufen, die auf `surface-field` hell nicht zu sehen sind (`docs/skalen.md` „Knöpfe im Feld zeigen eine Stufe kräftiger“). Nicht am deaktivierten Knopf und nicht in der Wurzel mit `aria-disabled="true"` |
| Entfernen im Wert-Chip | liegt auf der Pille, nicht auf dem Feld: beim Zeigen **und** beim Drücken `--tl-surface-interactive-active` — die einzige Stufe, die sich auf allen 14 Pillenflächen abhebt (die neutrale Pille ist selbst `--tl-surface-interactive-selected`). Keine kräftigere Drücken-Stufe. Nicht am deaktivierten Knopf |
| Pfeil | Quadrat `--tl-size-control-sm`, Ecke `--tl-radius-sm`, das Icon mittig; Übergang der Fläche `--tl-duration-fast`, `--tl-easing-standard`. Er bleibt `aria-hidden` und ohne Fokus; der Klick trifft die Wurzel |
| Ziehgriff, Pfeil | `--tl-icon-secondary` |
| Einfügemarke beim Ziehen | Linie `--tl-border-width-accent` in `--tl-border-interactive` |
| Popup | aus `tl-popover` (`popover.contract.md`): Fläche, Schatten, Ebene, Ecke, Rand, Innenabstand, Text; `tl-select__popup` setzt nur Spalte und Höhe |
| Popup-Höhe | höchstens 8 × `--tl-size-row` + `--tl-size-control` + 2 × `--tl-space-xs` (acht Optionen und das Suchfeld) |
| Suchfeld | ein `tl-field`; Abstand zur Liste `--tl-space-xs` |
| Option | Höhe `--tl-size-row` (als `min-height`), Innenabstand `--tl-space-control-x`, Ecke `--tl-radius-sm`, Lücke `--tl-space-xs`; beim Zeigen `--tl-surface-interactive-hover` |
| hervorgehobene Option | Fläche `--tl-surface-interactive-selected`, Akzentlinie `--tl-border-width-accent` in `--tl-border-interactive` |
| Status (Laden, keine Treffer) | Text `--tl-text-secondary`, Höhe `--tl-size-row` |
| Ladefehler | Text `--tl-status-error-text` |

Schrift: Klasse `.tl-type-body` an Wurzel, Suchfeld und Liste, `.tl-type-label` an Pill und Wert-Chip, von
außen gesetzt; `tl-select` hat keine Schriftregel. `--tl-status-error-text` und `--tl-text-secondary`
halten am Gate 4,5 auf `surface-overlay`.

## Attribute

| Attribut | Wann |
|---|---|
| `role="combobox"` | an der Wurzel `tl-field tl-select`, mit `tabindex="0"`. |
| `aria-expanded` | an der Wurzel: `"true"`, solange das Popup offen ist. |
| `aria-haspopup="listbox"` | an der Wurzel. |
| `aria-controls` | an Wurzel und Suchfeld: die Id der Liste, solange sie offen ist. |
| `aria-activedescendant` | am Suchfeld: die Id der hervorgehobenen Option. |
| `role="listbox"` | an `tl-select__list`. |
| `role="option"` | an jeder `tl-select__option`. |
| `aria-selected` | `"false"` an jeder `tl-select__option`: die Liste führt nur ungewählte Optionen; Gewähltes steht als Wert oder Wert-Chip in der Wurzel. Hervorgehoben ist nicht gewählt. |
| `data-tl-state="highlighted"` | an der hervorgehobenen Option (Tastatur oder Zeiger). Der Indikator ist die Akzentlinie (`--tl-border-interactive`, Gate 3,0 auf `surface-overlay` und `surface-interactive-selected`); die Tönung ist ein Zusatz, weil `--tl-surface-interactive-selected` auf `surface-layer` abgestimmt ist, nicht auf die gehobene Overlay-Fläche. |
| `data-tl-state="dragging"` | am Wert-Chip, der gerade gezogen wird. |
| `data-tl-state="drop-before"` / `"drop-after"` | am Wert-Chip, vor bzw. hinter dem der gezogene landet. |
| `aria-invalid="true"` | `hasError`, an der Wurzel. Das CSS von `tl-field` liest es selbst. |
| `data-tl-state="warning"` | `hasWarnings && !hasError`, an der Wurzel. Der Fehler verdrängt die Warnung. |
| `aria-required="true"` | `mandatory`, an der Wurzel. |
| `aria-busy="true"` | am `tl-progress` im `tl-select__status`, solange `optionsLoaded: false`. |
| `role="alert"` | am `tl-select__status` des Ladefehlers; darin ein Link „Erneut versuchen“. |
| `aria-label` | an Entfernen- und Löschen-Knopf, am Suchfeld. |
| `aria-disabled="true"` | `state.disabled`, wie beim Button. Die Wurzel ist ein `div` und kennt `:disabled` nicht: sie trägt `aria-disabled="true"` und `tabindex="-1"`, öffnet kein Popup und zeigt weder Entfernen- noch Löschen-Knopf. Offen: `aria-disabled` bekommt in dieser Welle keine Regel. |
| `:focus-visible` | den Ring liefert `base.css`; Wurzel und Suchfeld setzen und entfernen keinen Fokusstil. |

Bei `editable: false` rendert kein Combobox, sondern der Lesewert (`tl-field-value`, siehe
`field.contract.md`): jeder Wert als Text oder als `tl-pill` seiner `colorRole`, Werte mit `link` als
`a`, der `goto` sendet.

Klassen:

| Klasse | Element |
|---|---|
| `tl-select` | die Wurzel, zusammen mit `tl-field` |
| `tl-select__values` | `span` um Platzhalter, Einzelwert oder Wert-Chips |
| `tl-select__placeholder` | `span` mit `emptyOptionLabel` |
| `tl-select__value` | `span` um den gewählten Einzelwert: Text oder `tl-pill` |
| `tl-select__chip` | der Wert-Chip bei `multiSelect`: eine `tl-pill` mit dieser Klasse, darin Label und Entfernen-Knopf |
| `tl-select__drag-handle` | Ziehgriff im Wert-Chip, nur bei `customOrder` |
| `tl-select__controls` | `span` um Löschen-Knopf und Pfeil; Entfernen- und Löschen-Knopf sind `button type="button"` mit `tl-button--icon` (oben) |
| `tl-select__arrow` | `span` mit `aria-hidden="true"` um das Pfeil-Icon: das Quadrat, das beim Zeigen die Fläche trägt |
| `tl-select__popup` | das schwebende Popup, zusammen mit `tl-popover` |
| `tl-select__search-group` | `span.tl-field-group` um Lupe und Suchfeld; trägt den Abstand zur Liste |
| `tl-select__search` | das Suchfeld, zusammen mit `tl-field` |
| `tl-select__list` | die Liste, `role="listbox"` |
| `tl-select__option` | eine Option, `role="option"` |
| `tl-select__status` | Laden, keine Treffer, Ladefehler |

Symbole (Pfeil, Löschen, Entfernen, Suche, Ziehgriff) sind `ThemeIcon` in `tl-icon-sm`. Das Control
setzt feste ThemeImages (`css:fa-solid fa-chevron-down` / `fa-chevron-up`, `fa-xmark`,
`fa-magnifying-glass`, `fa-grip-vertical`), wie `TLValueList` — sie kommen nicht aus dem Theme.

## Konformität

Eine Komponente besteht den Vertrag, wenn sie im Specimen-Harness des Pakets für jeden Zustand oben
das jeweilige Attribut trägt, die Hervorhebung allein über `data-tl-state` und `aria-activedescendant`
ausdrückt, jede Option der Liste mit `aria-selected="false"` führt, die Tastatur wie oben bedient, den Treffer in der kräftigen Variante der Typo-Klasse seines Trägers zeigt, der Fehler die
Warnung verdrängt, bei `editable: false` kein Combobox rendert und im Klassen-Gate keine Klasse ohne
`tl`-Präfix hinterlässt. Der Test dazu folgt mit der ersten Kundenkomponente; bis dahin gilt dieser
Text.
