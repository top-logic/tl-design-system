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
| `editable` | boolean | `false`: kein Eingabefeld, sondern der Lesewert `tl-field-value`. |
| `mandatory` | boolean | Pflichtfeld: `aria-required="true"`. |
| `hasError` | boolean | Der Wert ist ungültig: `aria-invalid="true"`. |
| `errorMessage` | string, optional | Text des Fehlers; das Formular zeigt ihn. |
| `hasWarnings` | boolean | Der Wert ist gültig, aber auffällig: `data-tl-state="warning"`, nur ohne Fehler. |
| `placeholder` | string, optional | Platzhalter im leeren Feld. |
| `icon` | string, optional | Kodiertes ThemeImage vor dem Wert (`ThemeIcon` in `tl-icon-sm`), im `tl-field-group__icon`. |
| `clearable` | boolean, optional | Endknopf zum Löschen, `tl-field-group__action`. |
| `multiline` | boolean, optional | `textarea` statt `input`, Klasse `tl-field--multiline`. |
| `rows` | number, optional | Zeilen des mehrzeiligen Feldes. |

Zusätze je Control:

| Control | Schlüssel | Bedeutung |
|---|---|---|
| `TLTextInput`, `TLPasswordInput`, `TLDatePicker` | `inputType` | Das `type` des `input`. |
| `TLNumberInput` | `inputMode` | Wählt die Bildschirmtastatur; `value` ist die Zahl im Format des Feldes als Text. |
| `TLDatePicker` | `displayValue` | Der Wert in der Form, in der das Feld ihn zeigt. |
| `TLSelect` | `options` | Die Auswahlmöglichkeiten. |

## Aktionen

| Auslöser | Aktion |
|---|---|
| Eingabe | `sendCommand('valueChanged', { value })`, entprellt um `debounceMs`; mit `sendValueOnBlur` erst beim Verlassen. |
| Verlassen des Feldes (Blur) | `sendCommand('commit')`, wenn `commitOnBlur` gesetzt ist. |
| Enter | `sendCommand('submit')`, wenn `submitOnEnter` gesetzt ist. |

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
| reservierter Platz im Feld | `--tl-size-icon-sm` plus `--tl-space-xs` (Icon) bzw. `--tl-space-sm` und `--tl-space-2xs` (Endknopf) |
| Lesewert | Text `--tl-text-primary`, Abstand `--tl-space-xs` |
| Lesewert als Link | `--tl-text-link`, `--tl-text-link-hover` |

Schrift: Klasse `.tl-type-body` am Feld, von außen gesetzt; `tl-field` hat keine Schriftregel.
Rand-Rollen halten am Gate 3,0 auf `surface-field` und jeder umgebenden Fläche (`surface-base`,
`surface-layer`, `surface-layer-nested`, `surface-overlay`).

## Attribute

| Attribut | Wann |
|---|---|
| `aria-invalid="true"` | `hasError`. Das CSS liest es selbst — Screenreader und Bild haben eine Quelle. Wo ARIA es an der Rolle nicht erlaubt: `data-tl-state="error"`. |
| `data-tl-state="warning"` | `hasWarnings && !hasError`. Der Fehler verdrängt die Warnung. ARIA kennt keine Warnung. |
| `disabled` | `state.disabled`, das native Attribut. |
| `aria-required="true"` | `mandatory`. |
| `placeholder` | `placeholder`, wenn gesetzt. |
| `:focus-visible` | den Ring liefert `base.css`; das Feld setzt und entfernt keinen Fokusstil. |

Bei `editable: false` rendert kein Eingabefeld, sondern der Lesewert: ein `span` (als Link ein `a`)
mit `tl-field-value`, der Text darin in `tl-field-value__text`.

Klassen:

| Klasse | Element |
|---|---|
| `tl-field` | das echte `input`, `textarea` oder `select`; die Wurzel von `TLDropdownSelect` |
| `tl-field--multiline` | das `textarea` bei `multiline` |
| `tl-field-group` | `span` um Feld mit Icon oder Endknopf; das Feld darin trägt Rahmen und Fokusring |
| `tl-field-group__icon` | `span` mit dem Icon vor dem Wert |
| `tl-field-group__action` | `button type="button"` am Ende: Löschen oder Öffnen, mit `aria-label` |
| `tl-field-value` | der Lesewert bei `editable: false` |
| `tl-field-value__text` | der Text im Lesewert, endet mit Ellipse |

## Konformität

Eine Komponente besteht den Vertrag, wenn sie im Specimen-Harness des Pakets für jeden Zustand
oben das jeweilige Attribut trägt, der Fehler die Warnung verdrängt, bei `editable: false` kein
`input` rendert und im Klassen-Gate keine Klasse ohne `tl-`-Präfix hinterlässt. Der Test dazu folgt
mit der ersten Kundenkomponente; bis dahin gilt dieser Text.
