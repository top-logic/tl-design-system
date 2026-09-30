# Vertrag: Alert

Eine Meldung, die im Fluss einer Seite oder eines Dialogs steht: Icon, Titel, Text. TopLogic garantiert
Zugänglichkeit, nicht das Aussehen; wer ins Bild passen will, liest die Tokens.

## Zustand

Es gibt noch kein Control; ein Control entsteht, wenn eine Ansicht es braucht, und trägt dann diese Klassen und Attribute.

Was ein Alert bekäme:

| Schlüssel | Typ | Bedeutung |
|---|---|---|
| `meaning` | `error` \| `warning` \| `success` \| `info` | Die Bedeutung, Pflicht. Es gibt keinen Alert ohne Bedeutung; die Basisklasse `tl-alert` trägt darum keine Fläche, erst der Modifier. |
| `title` | string, optional | Kurzer Titel, Klasse `.tl-type-body-strong`, von außen gesetzt. |
| `text` | string | Der Text der Meldung. |

## Aktionen

Keine.

## Tokens

| Teil | Token |
|---|---|
| Fläche | `--tl-status-error-subtle`, `--tl-status-warning-subtle`, `--tl-status-success-subtle`, `--tl-status-info-subtle` |
| Linie | `--tl-status-error-border`, `--tl-status-warning-border`, `--tl-status-success-border`, `--tl-status-info-border`; Breite `--tl-border-width-sm`, am Zeilenanfang `--tl-border-width-accent` |
| Icon | `--tl-status-error-text`, `--tl-status-warning-text`, `--tl-status-success-text`, `--tl-status-info-text` (3,0 auf der Fläche, Nicht-Text) |
| Text | `--tl-text-primary` (4,5 auf jeder subtle-Fläche) |
| Form und Abstand | `--tl-radius-md`, `--tl-space-xs` zwischen Icon und Text, `--tl-space-sm` und `--tl-space-md` Innenabstand |

## Attribute

| Attribut | Wann |
|---|---|
| `tl-alert`, `tl-alert--error`, `tl-alert--warning`, `tl-alert--success`, `tl-alert--info` | `tl-alert` immer, genau ein Bedeutungs-Modifier dazu |
| `tl-alert__icon`, `tl-alert__body`, `tl-alert__title` | Elemente; das Icon ist `aria-hidden="true"`, denn die Bedeutung steht im Text |
| `role="alert"` | `error`: die Meldung wird sofort vorgelesen |
| `role="status"` | `warning`, `success`, `info`: höflich vorgelesen |

## Konformität

Ein Alert besteht den Vertrag, wenn er genau einen Bedeutungs-Modifier trägt, `role="alert"` bei `error` und
sonst `role="status"`, das Icon mit `aria-hidden="true"` rendert, Bedeutung nie allein über die Farbe
vermittelt (Titel oder Text nennt sie) und im Klassen-Gate keine Klasse ohne `tl-`-Präfix hinterlässt.
