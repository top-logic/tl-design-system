# Vertrag: Titelleiste

Der Kopf über einer Fläche, die einen Titel trägt: Dialog, Drawer; in Welle 4b Panel und Card. Titel links, Aktionen
rechts, eine Linie darunter. Kein Control für sich — die Fläche rendert ihn.

## Tokens

| Teil | Token |
|---|---|
| Höhe | mindestens `--tl-size-bar` |
| Abstand | `--tl-space-2xs` oben und unten, `--tl-space-md` vor dem Titel, `--tl-space-xs` hinter den Aktionen und zwischen ihnen |
| Linie | `--tl-border-width-sm` `--tl-border-separator` unten |
| Titel | `tl-type-heading-sm`, Ellipse |

## Attribute

| Attribut | Wann |
|---|---|
| `tl-titlebar` | immer, am Kopf |
| `tl-titlebar__title` | am Titel; ein `h2` mit `id`, auf die die Fläche mit `aria-labelledby` zeigt |
| `tl-titlebar__actions` | um eine Toolbar der Fläche (Fensteraktionen), wenn es eine gibt |

Kopfknöpfe (Maximieren, Schließen) stehen hinter den Aktionen als `tl-button tl-button--ghost tl-button--sm tl-button--icon`
mit `ThemeIcon` (`tl-icon-sm`), `aria-label` und Tooltip.

## Konformität

Eine Titelleiste besteht den Vertrag, wenn der Titel ein `h2` mit `id` ist, auf den die Fläche zeigt, und die
Kopfknöpfe 24 px groß (`--tl-size-control-sm`) und benannt sind.
