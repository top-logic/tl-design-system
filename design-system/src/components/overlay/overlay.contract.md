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

## Tokens

Keine: das Overlay hat keine Fläche und keine Ebene (`z-index`); die Ebenen stapeln nach ihrer Reihenfolge.

## Attribute

| Attribut | Wann |
|---|---|
| `tl-overlay` | immer, am Behälter |
| `tl-overlay__base` | um die Basis |
| `tl-overlay__layer` + `tl-overlay__layer--<anker>` | je Ebene; dazu `cssClass` der Anwendung |

## Konformität

Ein Overlay besteht den Vertrag, wenn die Ebenen die Basis decken, der Zeiger durch freie Fläche geht und im
Klassen-Gate keine Klasse ohne `tl-`-Präfix bleibt.
