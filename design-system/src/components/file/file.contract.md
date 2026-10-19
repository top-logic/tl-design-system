# Vertrag: File

Die Dateizeile (Spec 5b §6): der Name einer Datei und die Knöpfe daneben. TopLogic garantiert Lage, Ellipse und den
Leer-Zustand; die Knöpfe sind Parts `Button` (`button.contract.md`).

## Leser

| Control | Form |
|---|---|
| `TLDownload` (`ReactDownloadControl`) | `tl-file` mit dem Namen in `tl-file__name` und dem Download-Knopf daneben. Ohne Datei `data-tl-state~="empty"` an `tl-file`. |
| `TLBinaryField` (`ReactBinaryFieldControl`) | die Zeile innerhalb der Drop-Zone `tl-file-upload` (`upload.contract.md`): `tl-file` mit Name, Download- und Upload-Knopf. Ohne Datei (`hasData` falsch) `data-tl-state~="empty"` mit dem Hinweis „Keine Datei“. |

## Klassen

| Klasse | Teil |
|---|---|
| `tl-file` | Wurzel; Zeile aus Name und Knöpfen, mindestens so hoch wie ein Knopf |
| `tl-file__name` | der Dateiname oder der Leer-Hinweis; einzeilig mit Ellipse, höchstens `--tl-size-13` breit |

## Attribute

| Attribut | Wann |
|---|---|
| `data-tl-state~="empty"` | an `tl-file`, wenn keine Datei da ist; der Text steht in `--tl-text-secondary`, nicht kursiv |
| `hidden` | verbirgt die Wurzel |

## Tokens

| Teil | Token |
|---|---|
| Abstand Name–Knöpfe | `--tl-space-control-gap` |
| Mindesthöhe | `--tl-size-control` |
| Höchstbreite des Namens | `--tl-size-13` |
| Leer | Text `--tl-text-secondary` |

## Konformität

Eine Dateizeile besteht den Vertrag, wenn der Name einzeilig mit Ellipse endet, „leer“ ein Attribut an `tl-file` ist
und im Klassen-Gate keine Klasse ohne `tl-`-Präfix bleibt.
