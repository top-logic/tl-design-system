# Vertrag: Ziehen und Ablegen

Eine Optik für jedes Ziel, im Paket einmal gezeichnet (`drag.css`, 3b §9): Tabellenzeile, Baumknoten,
Spaltenkopf, Eintrag der Spaltenwahl (`tl-reorder-list`), Select-Chip, die Tabelle als Ganzes. Ein
Block zeichnet weder ein Drop-Ziel noch die gezogene Quelle selbst; er setzt nur den Zustand. TopLogic
garantiert Funktion und Zugänglichkeit, nicht das Aussehen; wer ins Bild passen will, liest die Tokens.

## Zustand

Ein Rechner: `dropPositionAt` (Drittel: davor, darauf, danach) für Ablageziele — Tabellenzeile,
Baumknoten; `useListReorder` (Hälften) für Reihenfolgen — Spaltenwahl, Spaltenköpfe, Select-Chips,
`TLValueList`. Der Rechner setzt am Ziel bzw. an der Quelle einen der fünf Zustände:

| `data-tl-state~=` | Wort | Bild | Token |
|---|---|---|---|
| `drop-before` | landet davor | Linie innen oben (waagerecht: links) | `--tl-border-width-accent` in `--tl-border-interactive` |
| `drop-after` | landet danach | Linie innen unten (waagerecht: rechts) | `--tl-border-width-accent` in `--tl-border-interactive` |
| `drop-onto` | landet darauf | Fläche und innerer Rahmen | Fläche `--tl-surface-interactive-selected`, Rahmen `--tl-border-width-md` in `--tl-border-interactive` |
| `drop-refused` | hier nicht | innerer Rahmen | `--tl-border-width-md` in `--tl-status-error-border` |
| `dragging` | wird gezogen | die Quelle wird blass | `opacity: 0.4` — ein Anteil, kein Maß; steht einmal hier statt in jedem Block |

Ablegen auf die ganze Tabelle trägt dieselben Zustände an ihrer Wurzel.

## Bild

Marke und Rahmen liegen auf `::before` über dem Ziel (über den Hintergründen seiner Kinder und
haftenden Zellen, `--tl-layer-sticky`, ohne Zeigerereignisse, mit der Ecke des Ziels — `border-radius: inherit`, die Marke folgt der runden Pille), `::after` bleibt dem Cursor-Ring
(`base.css`); ein Ziel braucht kein eigenes `position` — `drag.css` setzt es über `:where` ohne
Spezifität, eine Lage, die der Block setzt (absolute Zeile, haftende Kopfzelle), bleibt. Die Fläche von
`drop-onto` steht am Ziel selbst; ein Block, dessen eigene Fläche sie übermalen würde, stellt diese in
`:where`.

Ein Drop-Ziel ist kein Fokus: kein `outline`, kein `--tl-focus-ring`. Fokus und Ziel können zugleich
an einem Element stehen und bleiben unterscheidbar.

## Attribute

| Attribut | Wann |
|---|---|
| `data-tl-state` | am Ziel bzw. an der Quelle, mit einem der Wörter oben; neben anderen Wörtern (`~=`) |
| `data-tl-axis="horizontal"` | am Behälter von Einträgen, die nebeneinander stehen (Select-Chips, Spaltenköpfe): die Einfügemarke steht links und rechts statt oben und unten |

Klassen gibt es nicht: die Optik liest nur die Attribute.

## Konformität

Ein Ziehen besteht den Vertrag, wenn Quelle und Ziel ihren Zustand allein über `data-tl-state`
ausdrücken, ein Behälter nebeneinanderstehender Einträge `data-tl-axis="horizontal"` trägt, kein Block
eine eigene Regel für diese Zustände hat (Test `drag.test.mjs`) und jede Reihenfolge, die sich ziehen
lässt, auch mit der Tastatur verschiebbar ist (`reorder-list.contract.md`, Tastatur).
