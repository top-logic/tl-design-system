# Vertrag: Feld

Eine Kundenkomponente, die unter einem der TopLogic-Namen `TLTextInput`, `TLPasswordInput`,
`TLNumberInput`, `TLDatePicker` oder `TLSelect` registriert ist (Stufe C der Spec), bekommt vom
Server den Zustand unten, löst die genannten Aktionen aus und trägt die genannten Attribute.
TopLogic garantiert dann Funktion, Tastatur und Fokus — nicht das Aussehen. Wer ins Bild passen
will, liest die Tokens. Alle Felder teilen einen Rahmen, `tl-field`; die Wurzel von
`TLDropdownSelect` trägt ihn ebenso.

## Zustand

Vom Server über `useTLState()`, gemeinsam aus `ReactFormFieldControl`:

| Schlüssel | Typ | Bedeutung |
|---|---|---|
| `value` | je Control | Der Wert des Feldes. |
| `placeholder` | string, optional | Platzhalter, solange das Feld leer ist (nur beim Bearbeiten). |
| `icon` | string, optional | Icon im Feld, vor dem Getippten: kodiertes ThemeImage (`ThemeIcon` in `tl-icon-sm`) im `tl-field-group__icon`. |
| `clearable` | boolean, optional | Das Feld bietet einen Knopf, der es leert: `tl-field-group__action`. |
| `debounceMs` | number, optional | Wie lange ein getippter Wert zurückgehalten wird, bevor er gesendet wird, in Millisekunden. |
| `multiline` | boolean, optional | Das Textfeld ist ein mehrzeiliges `textarea`, Klasse `tl-field--multiline`. |
| `rows` | number, optional | Sichtbare Zeilen des mehrzeiligen Feldes. |
| `editable` | boolean | Ob das Feld bearbeitbar ist. `false`: kein Eingabefeld, sondern der Lesewert `tl-field-value`. |
| `mandatory` | boolean | Pflichtfeld: `aria-required="true"`. |
| `nullable` | boolean | Ob `null` ein gültiger Wert des Feldes ist. |
| `hasError` | boolean | Das Feld hat einen Validierungsfehler: `aria-invalid="true"`. |
| `errorMessage` | string, optional | Text des Fehlers. |
| `hasWarnings` | boolean | Das Feld hat Validierungswarnungen: `data-tl-state="warning"`, nur ohne Fehler. |
| `label` | string | Beschriftung des Feldes. |
| `tooltip` | string, optional | Tooltip-Text. |
| `hidden` | boolean | Das Control ist auf dem Client verborgen: es rendert nichts. |
| `submitOnEnter` | boolean, optional | Enter im Feld sendet `submit`. |
| `commitOnBlur` | boolean, optional | Verlässt der Fokus das Feld, sendet es `commit`. |
| `sendValueOnBlur` | boolean, optional | Der getippte Wert wird bis zum Verlassen des Feldes zurückgehalten, statt schon beim Tippen gesendet zu werden. |

Zusätze je Control:

| Control | Schlüssel | Bedeutung |
|---|---|---|
| `TLTextInput`, `TLPasswordInput` | `inputType` | Welche Art Wert das Feld bearbeitet: das HTML-`type` des `input`. Fehlt er, gilt `text`. |
| `TLDatePicker` | `inputType` | Welches HTML-`input` der Client rendert. |
| `TLDatePicker` | `displayValue` | Der Wert als lokalisierter Text für die Leseansicht. |
| `TLNumberInput` | `inputMode` | Welche Bildschirmtastatur das Feld anfordert: `numeric`, `decimal` oder `text`. |
| `TLSelect` | `options` | Die Auswahlmöglichkeiten, je ein Eintrag mit `value` und `label`. |

## Aktionen

| Auslöser | Aktion |
|---|---|
| Eingabe | `sendCommand('valueChanged', { value })`, entprellt um `debounceMs`; bei `sendValueOnBlur: true` erst beim Verlassen des Feldes. |
| Verlassen des Feldes (Blur) | `sendCommand('commit')`, wenn `commitOnBlur: true`. |
| Enter | `sendCommand('submit')`, wenn `submitOnEnter: true`. |

## Tokens

| Teil | Token |
|---|---|
| Höhe | `--tl-size-control` (folgt der Dichte), als `min-height` |
| Innenabstand | `--tl-space-control-y` / `--tl-space-control-x` |
| Ecke | `--tl-radius-sm` |
| Fläche | `--tl-surface-field` |
| Rand | `--tl-border-control`, Breite `--tl-border-width-sm` |
| Rand beim Zeigen | `--tl-border-emphasis` |
| Text / Platzhalter | `--tl-text-primary` / `--tl-text-placeholder` |
| Fehler | Rand `--tl-status-error-border` |
| Warnung | Rand `--tl-status-warning-border` |
| deaktiviert (vom Kontrast-Gate ausgenommen) | Fläche `--tl-surface-disabled`, Text `--tl-text-disabled`, Rand `--tl-border-disabled` |
| Icon und Endknopf | Farbe `--tl-icon-secondary`; Lage `--tl-space-control-x`, `--tl-space-2xs`, Innenabstand `--tl-space-xs`; Endknopf beim Zeigen `--tl-surface-interactive-hover` |
| reservierter Platz im Feld | Icon: `--tl-space-control-x` + `--tl-size-icon-sm` + `--tl-space-xs`. Endknopf: seine Fläche (`--tl-space-2xs` + 2 × `--tl-space-xs` + `--tl-size-icon-sm`) plus eine Lücke `--tl-space-xs` |
| Lesewert | Text `--tl-text-primary`, Abstand `--tl-space-xs` |
| Lesewert als Link | `--tl-text-link`, `--tl-text-link-hover`; unterstrichen |

Schrift: Klasse `.tl-type-body` am Feld, von außen gesetzt; `tl-field` hat keine Schriftregel.
Rand-Rollen halten am Gate 3,0 auf `surface-field` und jeder umgebenden Fläche (`surface-base`,
`surface-layer`, `surface-layer-nested`, `surface-overlay`).

## Attribute

| Attribut | Wann |
|---|---|
| `aria-invalid="true"` | `hasError`. Das CSS liest es selbst — Screenreader und Bild haben eine Quelle. Wo ARIA es an der Rolle nicht erlaubt: `data-tl-state="error"`. |
| `data-tl-state="warning"` | `hasWarnings && !hasError`. Der Fehler verdrängt die Warnung. ARIA kennt keine Warnung. |
| `disabled` | heute setzt es kein Zustand des Formularmodells; die Regel `.tl-field:disabled` steht für Kundenmodule und spätere Zustände. `editable: false` ist **kein** Disabled: es rendert den Lesewert `tl-field-value`. |
| `aria-required="true"` | `mandatory`. |
| `placeholder` | `placeholder`, wenn gesetzt. |
| `:focus-visible` | den Ring liefert `base.css`; das Feld setzt und entfernt keinen Fokusstil. |

Bei `editable: false` rendert kein Eingabefeld, sondern der Lesewert: ein `span` (als Link ein `a`)
mit `tl-field-value`, der Text darin in `tl-field-value__text`. Ein mehrzeiliger Text rendert ein
`div` mit `tl-field-value tl-field-value--multiline` und je Zeile ein `tl-field-value__text`; eine
leere Zeile behält ihre Höhe. Ein Link-Lesewert ist unterstrichen — Farbe allein kennzeichnet keinen
Link.

Die Feldgruppe hat **einen** Endplatz: solange Text steht und `clearable` gilt, ersetzt der
Löschknopf den Öffnen-Link. Icon und Endknopf ändern nur die Klasse der Gruppe, nicht die Lage des
Feldes im DOM, damit das Feld beim Tippen den Fokus behält.

Klassen:

| Klasse | Element |
|---|---|
| `tl-field` | das echte `input`, `textarea` oder `select`; die Wurzel von `TLDropdownSelect` |
| `tl-field--multiline` | das `textarea` bei `multiline` |
| `tl-field-group` | `span` um Feld mit Icon oder Endknopf; das Feld darin trägt Rahmen und Fokusring |
| `tl-field-group__icon` | `span` mit dem Icon vor dem Wert |
| `tl-field-group__action` | am Ende, genau einer: `button type="button"` (Löschen) oder `a` (Öffnen), mit `aria-label` |
| `tl-field-value` | der Lesewert bei `editable: false` |
| `tl-field-value--multiline` | der mehrzeilige Lesewert (`div`): die Zeilen untereinander |
| `tl-field-value__text` | der Text im Lesewert, endet mit Ellipse; im mehrzeiligen eine Zeile |

## Konformität

Eine Komponente besteht den Vertrag, wenn sie im Specimen-Harness des Pakets für jeden Zustand
oben das jeweilige Attribut trägt, der Fehler die Warnung verdrängt, bei `editable: false` kein
`input` rendert und im Klassen-Gate keine Klasse ohne `tl-`-Präfix hinterlässt. Der Test dazu folgt
mit der ersten Kundenkomponente; bis dahin gilt dieser Text.
