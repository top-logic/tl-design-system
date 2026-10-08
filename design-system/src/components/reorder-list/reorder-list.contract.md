# Vertrag: Umsortierbare Liste

Eine Liste, deren Einträge sich ziehen und mit der Tastatur verschieben lassen; ihr erster Leser ist die
Spaltenwahl der Tabelle (3b §8). Jeder Eintrag trägt vorn einen Griff, dahinter, was er braucht:
Gruppierungsknopf, Kästchen mit Beschriftung. TopLogic garantiert Funktion, Tastatur und Fokus, nicht
das Aussehen; wer ins Bild passen will, liest die Tokens.

## Zustand

| Schlüssel | Typ | Bedeutung |
|---|---|---|
| `entries` | Liste | Die Einträge in ihrer Reihenfolge, je Eintrag: |
| `entries[].name` | string | Name des Eintrags (Spaltenname); er steht in den Befehlen und ist der Schlüssel des Eintrags. |
| `entries[].label` | string | Beschriftung des Kästchens und Teil des Griff-Namens. |
| `entries[].visible` | boolean | Sichtbar: das Kästchen ist gesetzt. Ein Eintrag, der nicht ausgeblendet werden darf, trägt ein deaktiviertes Kästchen. |
| `entries[].grouped` | boolean | Gruppiert: der Gruppierungsknopf trägt `aria-pressed="true"`. |

Ab elf Einträgen steht vor der Liste eine Suche; sie filtert mit `filterOptions` (3b §9), und die
Liste rendert nur die passenden Einträge. Jeder behält seine Position in der ganzen Liste: Ziehen und
Alt + Pfeil rechnen mit ihr, ein Eintrag lässt sich also neben einen ausgefilterten ablegen.

## Aktionen

| Auslöser | Aktion |
|---|---|
| Ziehen eines Eintrags an eine neue Stelle, Alt + Pfeil auf dem Griff | `sendCommand('columnReorder', …)` mit der neuen Reihenfolge — derselbe Befehl für Maus und Tastatur. |
| Kästchen umschalten | `sendCommand('columnVisible', …)` für diesen Eintrag. |
| Gruppierungsknopf | `sendCommand('groupBy', …)` für diesen Eintrag. |

## Tastatur

Der Griff ist ein `button` mit `aria-label` „<Name> verschieben“ und `aria-describedby` auf den
Hinweis („Alt + Pfeil verschiebt“); er ist fokussierbar wie jeder Knopf.

| Taste | auf dem Griff |
|---|---|
| `Alt` + `ArrowUp` / `ArrowDown` | verschiebt den Eintrag um eine Stelle nach oben bzw. unten und sendet denselben Befehl wie das Ziehen (`columnReorder`); der Fokus bleibt am Griff. Waagerecht (`data-tl-axis="horizontal"`): `Alt` + `ArrowLeft` / `ArrowRight`. |
| an den Enden | nichts: der erste Eintrag geht nicht weiter nach oben, der letzte nicht weiter nach unten. |
| `Tab` | weiter zu Gruppierungsknopf und Kästchen des Eintrags, dann zum nächsten Griff. |

Nach jedem Verschieben sagt ein Live-Bereich mit `role="status"` „<Name>, Position n von m“ an
(Resource-Key `js.reorder.moved`).

## Tokens

| Teil | Token |
|---|---|
| Liste | höchstens `--tl-size-popover-max` hoch, dann scrollt sie in sich |
| Eintrag | Höhe `--tl-size-row` (als `min-height`), Innenabstand seitlich `--tl-space-control-x`, Lücke `--tl-space-xs`; beim Zeigen `--tl-surface-interactive-hover` |
| Griff | `tl-button--icon --sm --ghost`, Icon in `--tl-icon-secondary`; der Fokusring aus `base.css` liegt innen (`outline-offset` −`--tl-focus-offset`), weil die Liste scrollt |
| Suche | Abstand zur Liste `--tl-space-xs`, an der `tl-field-group` |
| Gezogen, Einfügemarke | aus `drag.css` (`drag.contract.md`) |

Schrift: `.tl-type-body` an der Liste, von außen gesetzt; `tl-reorder-list` hat keine Schriftregel.
Die Beschriftung endet mit Ellipse.

## Attribute

| Attribut | Wann |
|---|---|
| `aria-label` | am Griff: „<Name> verschieben“; am Gruppierungsknopf; am Suchfeld. |
| `aria-describedby` | am Griff: die Id des Hinweises „Alt + Pfeil verschiebt“. |
| `hidden` | am Hinweis: nie gezeigt; `aria-describedby` liest ihn trotzdem vor. |
| `aria-pressed` | am Gruppierungsknopf: `"true"`, solange nach dem Eintrag gruppiert wird. |
| `disabled` | am Kästchen eines Eintrags, der nicht ausgeblendet werden darf. |
| `role="status"` | am Live-Bereich, der das Verschieben ansagt. |
| `data-tl-state="dragging"` | am Eintrag, der gerade gezogen wird (`drag.contract.md`). |
| `data-tl-state="drop-before"` / `"drop-after"` | am Eintrag, vor bzw. hinter dem der gezogene landet (`drag.contract.md`). |
| `:focus-visible` | den Ring liefert `base.css`; der Griff rückt ihn nur nach innen. |

Klassen:

| Klasse | Element |
|---|---|
| `tl-reorder-list` | das `ul` |
| `tl-reorder-list__item` | jedes `li` |
| `tl-reorder-list__handle` | der Griff, zusammen mit `tl-button tl-button--ghost tl-button--sm tl-button--icon` |
| `tl-reorder-list__label` | die Beschriftung im Kästchen |
| `tl-reorder-list__search` | an der `tl-field-group` der Suche vor der Liste |
| `tl-button--icon` | der Gruppierungsknopf, mit `--sm` und `--ghost` und `aria-pressed` |
| `tl-choice` | das Kästchen: `label.tl-choice` > `input` mit `tl-checkbox` und die Beschriftung |
| `tl-visually-hidden` | der Live-Bereich: gelesen, nicht gezeigt (der Hinweis trägt `hidden`, siehe Attribute) |

Symbole (Griff, Gruppieren, Suche) sind `ThemeIcon` in `tl-icon-sm`, Knopf-Icons mit `tl-button__icon`.

## Konformität

Eine Liste besteht den Vertrag, wenn jeder Eintrag einen Griff als `button` mit Namen und Hinweis
trägt, Alt + Pfeil denselben Befehl sendet wie das Ziehen und die neue Position über `role="status"`
ansagt, Ziehen und Einfügemarke allein über `data-tl-state` ausgedrückt sind und im Klassen-Gate keine
Klasse ohne `tl`-Präfix bleibt.
