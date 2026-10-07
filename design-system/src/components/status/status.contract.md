# Vertrag: Status

Eine Zeile, die sagt, was statt Inhalt da ist: es lädt, es ist nichts da, oder das Laden ist
gescheitert. TopLogic garantiert Zugänglichkeit, nicht das Aussehen; wer ins Bild passen will, liest
die Tokens.

## Zustand

| Schlüssel | Typ | Bedeutung |
|---|---|---|
| `loading` | boolean | Es lädt. Die Zeile trägt einen unbestimmten `tl-progress` mit `aria-busy="true"`; seine Beschriftung ist optional und sagt, was lädt. |
| `empty` | boolean | Es ist nichts da. Die Zeile trägt nur Text („Keine Einträge“, „Nichts gefunden“). |
| `error` | boolean | Das Laden ist gescheitert. Die Zeile trägt `role="alert"` und darf einen `tl-button--link` zum Wiederholen tragen. |

## Aktionen

| Aktion | Wirkung |
|---|---|
| `retry` | nur im Fehlerzustand, über den `tl-button--link`; lädt erneut |

## Tokens

| Teil | Token |
|---|---|
| Höhe der Zeile | `--tl-size-row` (als `min-height`) |
| Lücke | `--tl-space-xs` |
| Innenabstand seitlich | `--tl-space-control-x` |
| Text | `--tl-text-secondary` |
| Fehlertext | `--tl-status-error-text` |

Die Schrift setzt der Ort (`.tl-type-body`); `tl-status` hat keine Schriftregel. Der Fortschritt in
der Zeile füllt sie.

## Leser

| Ort | Form |
|---|---|
| Select-Popup | eine `tl-status`-Zeile statt der Optionen |
| Baum | eine `li` mit `role="treeitem"`, eine Ebene unter einem Knoten mit `aria-busy`; der Name kommt aus `js.tree.loading` |
| Tabelle | eine `role="row"` mit einer `role="gridcell"`, die die `tl-status`-Zeile trägt |

## Attribute

| Attribut | Wann |
|---|---|
| `tl-status` | immer; an einem Block-Element |
| `aria-busy="true"` | am `tl-progress` im Ladezustand |
| `aria-label` | am `tl-progress`; der Name der Ladezeile, Pflicht. Der Text stammt aus dem Resource-Key des Lesers, im Baum `js.tree.loading`. Steht eine sichtbare Beschriftung da, geht stattdessen `aria-labelledby` auf deren `id`. |
| `aria-valuetext` | am `tl-progress` nur als Wertetext, wenn eine Beschriftung da ist (siehe `progress.contract.md`); nie als Name |
| `role="alert"` | am `tl-status` des Fehlers |
| `tl-button--link` | im Fehler, zum Wiederholen |
| `tl-icon-sm` | am Fehler-Glyph, `aria-hidden` |

## Konformität

Eine Statuszeile besteht den Vertrag, wenn sie im Ladezustand einen `tl-progress` mit
`aria-busy="true"` und einem Namen (`aria-label` oder `aria-labelledby`) trägt, im Fehlerzustand `role="alert"` hat und im
Klassen-Gate keine Klasse ohne `tl-`-Präfix hinterlässt.
