# Vertrag: Progress

Eine Kundenkomponente, die unter dem TopLogic-Namen `TLProgress` registriert ist (Stufe C der Spec),
bekommt den Zustand unten, rendert einen Balken mit optionaler Beschriftung und trägt die genannten
Attribute. TopLogic garantiert dann Funktion und Zugänglichkeit — nicht das Aussehen. Wer ins Bild
passen will, liest die Tokens.

## Zustand

| Schlüssel | Typ | Bedeutung |
|---|---|---|
| `fraction` | number 0…1 \| null | Der gefüllte Anteil der Spur. `null` ist der unbestimmte Balken: etwas läuft, ohne zu sagen, wie weit. |
| `label` | string, optional | Beschriftung neben dem Balken; ohne sie steht der Balken allein. |

Die Breite der Füllung ist Daten, kein Gestaltungswert: die Komponente setzt sie am `__fill` als
`style="width: <Anteil in Prozent>%"` — dasselbe, was `aria-valuenow` sagt. Farbe, Höhe, Form und Bewegung
setzt sie nie inline. Ein Anteil außerhalb 0…1 ist Sache des Controls (es klemmt), nicht des Stylesheets.

## Aktionen

Keine. Ein Progress ist Anzeige.

## Tokens

| Teil | Token |
|---|---|
| Spur | `--tl-surface-interactive-selected` (die neutrale Fläche von Pill und Avatar), Höhe `--tl-size-progress` (8 px), Mindestbreite `--tl-size-control`, Form `--tl-radius-full` |
| Füllung | `--tl-surface-brand`, Übergang `--tl-duration-base` `--tl-easing-standard` |
| Beschriftung | `--tl-text-secondary`; Klasse `.tl-type-label .tl-nums`, von außen gesetzt |
| Abstand | `--tl-space-xs` zwischen Balken und Beschriftung |
| Unbestimmt | Schwung `--tl-duration-loop` (1200 ms) `--tl-easing-standard`, endlos; ohne Bewegung ruht die Füllung bei drei Vierteln der Spur |

Keine Tönung: ein Balken sagt, wie weit, nicht ob gut oder schlecht. Das sagt der Text daneben oder
der Status, der den Balken zeigt.

## Attribute

| Attribut | Wann |
|---|---|
| `role="progressbar"` | immer, am Wurzelelement |
| `aria-valuemin="0"`, `aria-valuemax="100"`, `aria-valuenow` | bestimmter Balken: `aria-valuenow` ist der Anteil in Prozent, gerundet |
| `aria-valuetext` | nie: die Beschriftung ist der Name, derselbe Text als Wertetext würde doppelt angesagt; den Wert sagt `aria-valuenow` |
| `aria-labelledby` | wenn eine Beschriftung da ist: die `id` des `tl-progress__label` (der Name, siehe unten) |
| `aria-hidden="true"` | wenn ein umgebendes Element den Namen trägt (Ladezeile im Baum, `status.contract.md`); dann ohne eigenen Namen |
| `aria-busy="true"` | unbestimmter Balken; `aria-valuenow` fehlt dann. Das Attribut ist zugleich der Selektor der Schwung-Animation — es gibt keine Klasse dafür. |

**Name (ARIA 1.2, `progressbar` verlangt einen).** Mit Beschriftung zeigt `aria-labelledby` auf die
`id` des `tl-progress__label`; die Komponente vergibt die `id` selbst. Den Wert sagt `aria-valuenow`
(unbestimmt `aria-busy`), kein `aria-valuetext` — er wäre der Name ein zweites Mal. Ohne Beschriftung
gibt der Ort den Namen (`aria-label`), oder der Balken ist `aria-hidden="true"` in einem Element, das
den Namen trägt — dann hat er keinen eigenen, damit nichts doppelt angesagt wird.

## Konformität

Eine Komponente besteht den Vertrag, wenn sie im Specimen-Harness des Pakets `role="progressbar"` mit den
drei Wertattributen trägt, inline nur die Breite des `__fill` setzt, unbestimmt `aria-busy="true"`
ohne `aria-valuenow` trägt, die Beschriftung als `tl-progress__label` rendert, mit Beschriftung über
`aria-labelledby` benannt ist, kein `aria-valuetext` trägt und im Klassen-Gate keine
Klasse ohne `tl-`-Präfix hinterlässt.
