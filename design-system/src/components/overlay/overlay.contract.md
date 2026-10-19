# Vertrag: Overlay

Ein Stapel aus einer Basis und Ebenen darüber: ein Abzeichen auf einem Bild, eine Beschriftung über einem Foto.
TopLogic garantiert Lage und Zeigerverhalten, nicht das Aussehen; das gibt die Anwendung über die Klasse der Ebene.

## Zustand

Das Control ist `TLOverlay` (`ReactOverlayControl`, View-Element `<overlay>` mit `<layer position="…">`).

| Schlüssel | Typ | Bedeutung |
|---|---|---|
| `base` | Control | Die Basis; sie gibt dem Overlay die Höhe. |
| `layers[].control` | Control | Inhalt einer Ebene. |
| `layers[].anchor` | `fill` \| `top-left` \| `top` \| `top-right` \| `left` \| `center` \| `right` \| `bottom-left` \| `bottom` \| `bottom-right` | Wohin die Ebene ihren Inhalt legt. |
| `layers[].cssClass` | string, optional | Klasse der Anwendung an der Ebene. |

## Verhalten

- Jede Ebene deckt die Fläche der Basis; die Breite gibt das umgebende Layout.
- Wo eine Ebene nichts zeigt, geht der Zeiger zur Basis durch; ihr Inhalt nimmt ihn zurück.
- Mit `tl-overlay--fill` füllt das Overlay seinen Behälter statt die Höhe der Basis zu nehmen, und die Basis füllt
  das Overlay (Spec 5b §4): so trägt es ein Dokument, das seinen Platz füllt (`useFill`).

## Leser

| Control | Form |
|---|---|
| `TLHtml` | Dokument mit Druckknopf: `tl-overlay tl-overlay--fill`, das Dokument (`tl-media--document`) ist die Basis `tl-overlay__base`, der Knopf liegt in `tl-overlay__layer--top-right` in einem `tl-overlay__action` — darin ein Part `Button` `ghost`, icon-only (`tl-button--ghost tl-button--icon`). |

Die Ausblenden-Knöpfe der Dashboard-Kachel (Welle 5c) nutzen `tl-overlay--fill` und `tl-overlay__action` ebenso.

## Tokens

Der Stapel hat keine Fläche und keine Ebene (`z-index`); die Ebenen stapeln nach ihrer Reihenfolge.

Einzige Fläche ist `tl-overlay__action`, der Knopf über einer Fläche: er schwebt wie ein Popover, ohne Portal. Ohne
sie stünde im Dunkelmodus helle Schrift auf dem weißen Dokument (`--tl-surface-document`).

| Teil von `tl-overlay__action` | Token |
|---|---|
| Fläche | `--tl-surface-overlay` |
| Rand | `--tl-border-width-sm` in `--tl-border-separator` |
| Ecke | `--tl-radius-md` |
| Schatten | `--tl-shadow-popover` |
| Innenabstand | `--tl-space-2xs` |

## Attribute

| Attribut | Wann |
|---|---|
| `tl-overlay` | immer, am Behälter |
| `tl-overlay--fill` | am Behälter, wenn er seinen Platz füllt |
| `tl-overlay__base` | um die Basis; Block, mit `tl-overlay--fill` füllt sie das Overlay |
| `tl-overlay__action` | um einen Knopf in einer Ebene, der über der Basis eine eigene Fläche braucht |
| `tl-overlay__layer` + `tl-overlay__layer--<anker>` | je Ebene; dazu `cssClass` der Anwendung |

## Konformität

Ein Overlay besteht den Vertrag, wenn die Ebenen die Basis decken, der Zeiger durch freie Fläche geht und im
Klassen-Gate keine Klasse ohne `tl-`-Präfix bleibt.
