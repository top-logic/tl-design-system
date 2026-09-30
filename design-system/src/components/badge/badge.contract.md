# Vertrag: Badge

Ein Zähler an einem Icon oder einem Reiter: eine Marke-gefüllte Pille mit Ziffern. TopLogic garantiert
Zugänglichkeit, nicht das Aussehen; wer ins Bild passen will, liest die Tokens.

## Zustand

Es gibt noch kein Control; ein Control entsteht, wenn eine Ansicht es braucht, und trägt dann diese Klassen und Attribute.

Was ein Badge bekäme:

| Schlüssel | Typ | Bedeutung |
|---|---|---|
| `count` | integer oder kurzer string | Die Ziffern oder das Kürzel; Text gehört in eine Pill. |

## Aktionen

Keine. Ein Badge ist Anzeige.

## Tokens

| Teil | Token |
|---|---|
| Fläche | `--tl-surface-brand` |
| Beschriftung | `--tl-text-on-brand` (abgeleitet, nie geschrieben) |
| Form | `--tl-radius-full`, Höhe und Mindestbreite `--tl-size-icon-sm`, Innenabstand `--tl-space-2xs` |
| Schrift | `.tl-type-label-strong .tl-nums`, von außen gesetzt; die Ziffern stehen tabellarisch |

## Attribute

| Attribut | Wann |
|---|---|
| `tl-badge` | immer; es gibt keine Modifier |
| `role="img"` und `aria-label` | wenn das Badge allein an einem Icon steht: der Name sagt, was gezählt wird („3 neue Meldungen“); ein `aria-label` an einem `<span>` ohne Rolle wird ignoriert |
| nichts | wenn es Teil eines beschrifteten Reiters ist: die Zahl ist dann sichtbarer Text und Inhalt, weder `aria-hidden` noch eigener Name |

## Konformität

Ein Badge besteht den Vertrag, wenn es die Schrift über `tl-type-label-strong tl-nums` bekommt, allein an einem
Icon `role="img"` mit einem `aria-label` trägt, der das Gezählte nennt (im beschrifteten Reiter bleibt die Zahl schlichter Text), und im Klassen-Gate keine Klasse ohne `tl-`-Präfix
hinterlässt.
