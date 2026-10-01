# Vertrag: Popover

Die eine Fläche für alles, was über der Oberfläche schwebt und einen Anker hat: Menü, Select-Popup,
Toolbar-Überlauf. TopLogic garantiert Zugänglichkeit, nicht das Aussehen; wer ins Bild passen will,
liest die Tokens.

Ein Popover ist kein eigenes Control. Es ist die Fläche, die ein Control öffnet; die Rolle (`menu`,
`listbox`) bringt das Control mit. Die Lage rechnet `bridge/popover.ts` (floating-ui, Abstand zum Anker
`space-xs`) und setzt sie inline; das Stylesheet trägt Fläche, Ebene `layer-popover` und Grenzen.

## Zustand

| Schlüssel | Typ | Bedeutung |
|---|---|---|
| `open` | boolean | Die Fläche ist sichtbar. Fehlt er, ist sie zu. |
| Anker | Element oder Punkt | Woran die Fläche hängt: das Rechteck eines Elements (Auslöser, Feld) oder ein Punkt (Kontextmenü an der Mausposition). |

## Aktionen

| Aktion | Wirkung |
|---|---|
| `close` | setzt `open` auf `false` |

## Verhalten

- Escape schließt.
- Ein Klick außerhalb der Fläche und ihres Auslösers schließt.
- Beim Schließen kehrt der Fokus zum Auslöser zurück.
- Die Fläche folgt ihrem Anker bei Scroll und Resize.
- Fehlt der Platz auf der bevorzugten Seite, klappt sie um.
- Sie bleibt im Viewport; reicht die Höhe nicht, scrollt sie bis `--tl-size-popover-max`.

## Tokens

| Teil | Token |
|---|---|
| Fläche | `--tl-surface-overlay` |
| Text | `--tl-text-primary` |
| Rand | `--tl-border-separator`, Breite `--tl-border-width-sm` |
| Ecke | `--tl-radius-md` |
| Schatten | `--tl-shadow-popover` |
| Ebene | `--tl-layer-popover` |
| Innenabstand | `--tl-space-xs` |
| Mindestbreite | `--tl-size-popover-min` |
| Höchste Höhe | `--tl-size-popover-max` |

## Attribute

| Attribut | Wann |
|---|---|
| `tl-popover` | immer; an der schwebenden Fläche im Portal unter `document.body` |
| `data-tl-anchored-overlay` | immer; im Portal. Die Fläche liegt unter `document.body`, gehört aber zur Fläche ihres Auslösers: Fokus, der in sie wandert, gilt nicht als Ausbruch aus der Fokusfalle eines Dialogs und wird nicht zurückgeholt |
| `hidden` | zu, wenn die Fläche gemountet bleibt (Toolbar-Überlauf: die Controls darin leben weiter) |

## Konformität

Ein Popover besteht den Vertrag, wenn es im Portal unter `document.body` liegt, `tl-popover` und
`data-tl-anchored-overlay` trägt, mit Escape und Außenklick schließt, den Fokus an den Auslöser
zurückgibt und im Klassen-Gate keine Klasse ohne `tl-`-Präfix hinterlässt.
