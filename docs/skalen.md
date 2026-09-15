# Die Skalen des Design Systems

**Stand:** 2026-09-15 · Stufe A, in Arbeit
**Spec:** [`superpowers/specs/2026-09-15-style-overhaul-design.md`](superpowers/specs/2026-09-15-style-overhaul-design.md)

Jede Skala hat eine Stufenzahl, eine Regel, wann welche Stufe gilt, und ein Gate, das Abweichungen
bricht. Eine Skala ohne diese Regel wird beim nächsten Control wieder umgangen — genau deshalb gibt
es heute 44 literale `font-weight` und kein einziges Gewichts-Token.

Das Vorbild steht in `docs/faq/react-theme-tokens.md` von `tl-engine-7`, bei Radius und Elevation.

---

## Entschieden

### Elevation: Fläche plus Schatten

Höhe wird über die **Flächenhelligkeit** ausgedrückt, der Schatten begleitet sie.

**Warum:** Ein Schatten ist auf dunklem Grund physikalisch begrenzt — Schwarz auf Fast-Schwarz
erzeugt kaum Kontur. Das heutige Dark-Theme erbt `rgba(0,0,0,…)` aus dem hellen und verliert damit
jede Elevation. Das ist kein falscher Wert, sondern der falsche Mechanismus.

**Folge:** Die drei Elevationsstufen bekommen je eine zugehörige Flächenstufe. Die geerbten
Schatten im Dark-Theme werden gegenstandslos und durch eigene, schwächere Werte ersetzt.

### Dark: zwei vollständige Paletten

Beide Modi belegen **jede** Rolle vollständig. Nichts wird geerbt.

**Warum:** Die acht Kontrastverstöße sind allesamt Vererbungsfehler — jemand überschrieb 36 Werte
und übersah den siebenunddreißigsten, der davon abhing. Der schlimmste Fall, `text-inverse` auf
`background-inverse` mit 1,13, entstand genau so: Die Fläche wurde invertiert, die Schrift darauf
nicht. Bei vollständigen Paletten ist dieses Vergessen strukturell unmöglich.

**Folge:** Mehr Pflegeaufwand pro Token, dafür entfällt die Frage, ob eine Überschreibung
Folgeüberschreibungen braucht. Ein Kunden-Theme erbt weiterhin — die Vollständigkeit gilt für die
beiden ausgelieferten Modi.

### Rampenregel: Sättigung zurücknehmen statt klemmen

Wird eine Stufe zu hell für ihre Sättigung, senkt die Ableitung das **Chroma**, bis die Farbe im
darstellbaren Raum liegt. Helligkeit und Farbton bleiben unangetastet — sie tragen die Bedeutung
der Stufe.

**Warum:** Die erste Fassung der Ableitung hielt das Chroma und ließ den Rest klemmen. Für die
heutige Markenfarbe `#2968C8` lagen dadurch **alle drei** Dunkel-Stufen mit dem Blaukanal auf 255:

| | R | G | B |
|---|---|---|---|
| abgeleitet, klemmend | 90 / 108 / 126 | 154 / 173 / 193 | **255 / 255 / 255** |
| heute im Theme | 91 / 122 / 63 | 155 / 174 / 134 | 240 / 243 / 230 |

Beim Aufhellen konnte das Blau nicht mitwachsen, also wuchsen nur Rot und Grün: Die Rampe hörte
auf, heller zu werden, und fing an zu entsättigen. Sie sah noch aus wie eine Rampe, war aber keine
mehr.

Die heutigen Werte liegen alle sauber im Raum — sie wurden nach Augenmaß gewählt und machen faktisch
genau diese Abbildung. Die Regel schreibt nur fest, was dort schon richtig gemacht wurde.

### Rampenrichtung: Gedrücktes tritt zurück

Im **hellen** Modus dunkeln `hover` und `active` beide ab. Im **dunklen** Modus hellt `hover` auf,
`active` dunkelt ab.

**Warum:** Ein gedrückter Zustand, der zurücktritt, ist die verbreitete Konvention — Drücken
suggeriert ein Eindrücken. Die Alternative, im Dunkeln monoton weiter aufzuhellen, kostet Farbkraft:
Die abgeleitete Active-Stufe lag dort bei Chroma 0,095 gegen 0,163 im Grundton und wirkte deutlich
blasser.

Die Rampe läuft im Dunkelmodus damit in zwei Richtungen. Das ist Absicht und entspricht dem, was
heute im Theme steht.

### Beschriftung auf der Marke: dunkel im Dunkelmodus

**Das ist keine Gestaltungsentscheidung, sondern eine Rechnung.** Weiße Schrift fällt im Dunkelmodus
auf **jeder** Stufe durch, bei der abgeleiteten Rampe wie bei der heutigen:

| Stufe | weiße Schrift | dunkle Schrift |
|---|---|---|
| abgeleitet `#5A9AFF` / `#7BAFFF` / `#9CC3FF` | 2,80 · 2,23 · 1,80 | 6,75 · 8,47 · 10,49 |
| heute `#5B9BF0` / `#7AAEF3` / `#3F86E6` | 2,84 · 2,29 · 3,64 | 6,65 · 8,25 · 5,19 |

Die Alternative wäre, den Button so weit abzudunkeln, dass Weiß trägt — bei `#2968C8` fällt er dann
mit 3,18 gegen den dunklen Grund und hört auf, als Fläche zu lesen.

`text-on-color` und `icon-on-color` werden deshalb **abgeleitet statt festgeschrieben**: Von zwei
Kandidaten — `text-primary` des hellen Modus und Weiß — gewinnt der mit dem höheren Verhältnis
gegen `brand-primary` des jeweiligen Modus.

**Warum abgeleitet:** Die nötige Beschriftungsfarbe hängt vom gewählten Markenton ab. Ein fester
Wert wäre beim nächsten Ton wieder falsch und in jedem Kunden-Theme erst recht. Nachgewiesen an
zwei Gegenproben: Ein sehr heller Ton (`#F5E663`) schaltet **beide** Modi auf dunkle Schrift, ein
sehr dunkler (`#1A0F3D`) beide auf weiße.

### Offene Folge: ein Token kann nicht zwei Flächen bedienen

Mit der abgeleiteten Beschriftung sank die Zahl der Verstöße im Dunkelmodus von 7 auf 5 — vier
markenbezogene verschwanden, zwei neue kamen: `text-on-color` auf `button-danger` und
`button-danger-hover`.

| Fläche im Dunkelmodus | weiße Schrift | dunkle Schrift |
|---|---|---|
| `button-primary` `#5A9AFF` (hell) | 2,80 ✗ | **6,75 ✓** |
| `button-danger` `#D3181B` (dunkel) | **5,36 ✓** | 3,52 ✗ |
| `button-danger-hover` `#BC1518` | **6,44 ✓** | 2,93 ✗ |

**Kein Wert besteht auf beiden Flächen.** Ein einzelnes `text-on-color` soll hier eine helle und
eine dunkle Fläche gleichzeitig bedienen; das ist strukturell unmöglich. Im hellen Theme fiel es
nicht auf, weil dort beide Flächen dunkel sind und Weiß überall trägt.

Nachgeprüft und als strukturell bestätigt, nicht als Umsetzungsfehler. Die Auflösung gehört zur
Semantikskala und steht noch aus.

### Marke: `#0B5ED7`, vorläufig

Farbton 260°, Chroma 0,200, Helligkeit 0,515.

| | hell | dunkel |
|---|---|---|
| `brand-primary` | `#0B5ED7` | `#5394FF` |
| `brand-primary-hover` | `#004DBA` | `#75A9FF` |
| `brand-primary-active` | `#003A8F` | `#2471EC` |
| `brand-link` | `#0B5ED7` | `#75A9FF` |
| `brand-link-hover` | `#004DBA` | `#95BDFF` |
| Beschriftung darauf | `#FFFFFF` (5,84) | `#101113` (6,34) |

**Warum dieser Ton.** Gegenüber dem heutigen `#2968C8` steigt das Chroma von 0,163 auf 0,200 bei
fast gleichem Farbton — das Blau wird klarer, ohne die Familie zu wechseln. Zwei Alternativen
schieden aus:

* **Violettstichige Töne** (Indigo `#4338CA` bei 277°, Violett `#6D28D9` bei 293°) — gewünscht war
  ein frisches Blau, kein Violett.
* **Hellere Töne** (`#0A72F0` mit 4,49 und `#0E7BE8` mit 4,19 auf Weiß) — sie fallen als Linkfarbe
  durch. *Frisch wird ein Blau über Chroma, nicht über Helligkeit*; Chroma kostet keinen Kontrast,
  Helligkeit sofort.

Der Linkkontrast trägt auch einen gedämpften Grund: 5,84 auf Weiß, 5,59 auf `#FAFAFA`, 5,45 auf
`#F7F7F8`.

**Ausdrücklich vorläufig.** Der Ton kann sich ändern, sobald die Tokens in Figma liegen. Das kostet
nichts: Rampe, Beschriftung und Kontrastprüfung sind abgeleitet, der Wechsel ist ein Wert.

### Grundfläche: `#FAFAFA`

Reines Weiß entfällt. Die vier Flächen-Tokens `background`, `layer-01`, `layer-02` und
`color-surface` waren alle `#FFFFFF` — zu grell und zu klinisch für eine Oberfläche, in der man
stundenlang arbeitet.

Neutral statt markengetönt, weil die Grundfläche gegenüber jeder Marke funktionieren muss, auch
gegenüber der eines Kunden mit ungewöhnlicher CI. Kostet fast nichts: Text fällt von 18,89 auf
18,10, der Link von 5,84 auf 5,59.

### Rahmen: vier Stufen, jede mit einer Aufgabe

`border-subtle` wird aufgelöst. Der Grund ist derselbe wie bei `text-on-color`: **Ein Token hatte
zwei Aufgaben.** Es trennte Tabellenzeilen *und* umrandete Eingabefelder. Das erste braucht keinen
Kontrast, das zweite schuldet nach WCAG 1.4.11 mindestens 3,0. Ein Wert kann beides nicht — und
weil der schwächere gewann, erfüllte kein Eingabefeld in TopLogic die Norm, hell wie dunkel.

| Stufe | hell | dunkel | Verhältnis | Regel |
|---|---|---|---|---|
| `border-separator` | `#CBCED3` | `#383B3F` | ~1,5 | **Trennt**, begrenzt nicht. Tabellenzeilen, Abgrenzungen. Schuldet keinen Kontrast. |
| `border-control` | `#8E9196` | `#64676B` | ~3,0 | **Begrenzt ein Bedienelement.** Eingabefelder, Auswahlfelder, Schaltflächen mit Umriss. |
| `border-emphasis` | `#717378` | `#818489` | ~4,55 | **Hebt hervor.** Ausgewählte Zeile, betonte Abgrenzung. |
| `border-interactive` | `#0B5ED7` | `#5394FF` | ~5,6 | **Trägt die Marke.** Fokus, aktiver Zustand. |

Der Merksatz: *Eine Linie, die etwas trennt, ist ein Separator. Eine Linie, die etwas umschließt,
worauf der Zeiger wirkt, ist ein Control-Rahmen.* Er hat dieselbe Form wie die vorhandene
Radius-Regel, und das ist Absicht.

Die Neutralen tragen ein sehr geringes Chroma (0,008) im Farbton der Marke. Sie wirken dadurch
nicht farbig, binden die Skala aber an die Marke statt daneben zu stehen.

**Das Gate prüft künftig `border-control` gegen den Grund**, nicht `border-separator` — ein
Separator, der 3,0 erfüllen müsste, wäre keiner mehr.

### Neutrale: nach Anforderung gestuft, nicht nach gleichem Abstand

**Der Befund zuerst.** Die Neutralen umfassen **30 Tokens, aber nur 15 verschiedene Werte** im
hellen Modus und 17 im dunklen. Die Hälfte sind unerklärte Dubletten:

| Wert | Tokens |
|---|---|
| `#FFFFFF` | `background`, `color-surface`, `layer-01`, `layer-02`, `layer-accent-icon`, `layer-accent-text`, `text-inverse` |
| `#F0F1F2` | `background-selected`, `field`, `field-disabled`, `layer` |
| `#C4C7CC` | `border-subtle`, `layer-active`, `text-disabled` |
| `#676B72` | `text-helper`, `text-secondary` |

Im dunklen Modus sind `field`, `layer` und `layer-02` derselbe Wert — **ein Eingabefeld ist von
der Fläche, auf der es liegt, nicht zu unterscheiden.**

**Die Stufen leiten sich aus ihrer Aufgabe ab, nicht aus gleichmäßigen Helligkeitsschritten.** Eine
Leiter mit festem Abstand klingt ordentlich, trifft aber die Schwellen nicht: Ein erster Versuch
mit zwölf gleichen Schritten verfehlte vier von sechs Anforderungen. Also umgekehrt — jede Stufe
ist der hellste Wert, der ihre Anforderung noch erfüllt.

#### Text und Linien

| Token | hell | dunkel | schuldet | gemessen gegen |
|---|---|---|---|---|
| `text-primary` | `#1B1D21` | `#F0F3F9` | 16,0 | Grund |
| `text-secondary` | `#54565B` | `#A0A3A8` | 7,0 | Grund |
| `text-helper` | `#676A6F` | `#888B90` | 5,2 | Grund |
| `text-placeholder` | `#6B6E73` | `#8E9196` | 4,6 | **`field`**, nicht Grund |
| `border-emphasis` | `#6F7277` | `#7F8286` | 4,6 | Grund |
| `border-control` | `#8C8F94` | `#64676B` | 3,1 | Grund |
| `border-separator` | `#C1C4C9` | `#34383C` | — | trennt nur |

`text-placeholder` und `border-emphasis` landen im hellen Modus dicht beieinander. Das sind
trotzdem zwei Tokens: Sie messen gegen **verschiedene** Flächen und würden auseinanderlaufen,
sobald sich eine davon ändert.

#### Flächen

| Token | hell | dunkel |
|---|---|---|
| `background` | `#FAFAFA` | `#16181B` |
| `layer-01` | `#FFFFFF` | `#1D2023` |
| `layer-02` | `#FFFFFF` | `#242729` |
| `field` | `#F0F4F9` | `#27292D` |
| `layer-hover` | `#F0F2F6` | `#22262A` |
| `layer-selected` | `#E5E8ED` | `#2B3034` |
| `layer-active` | `#D9DDE3` | `#343A3F` |

**`layer-01` und `layer-02` bleiben im hellen Modus beide weiß — und das ist diesmal richtig.**
Über `#FAFAFA` liegt bis Weiß nur eine Stufe; drei Elevationsebenen lassen sich dort durch
Helligkeit nicht ausdrücken. Im hellen Modus trägt deshalb der **Schatten** die Höhe, im dunklen
die **Fläche**. Genau das meint die Entscheidung „Fläche plus Schatten": Jeder Modus nutzt das
Mittel, das dort funktioniert.

Der Unterschied zum heutigen Zustand ist, dass es jetzt eine Regel ist statt eines Zufalls.

#### Ausgenommen

`text-disabled`, `icon-disabled`, `field-disabled`, `button-disabled` sind von WCAG ausdrücklich
ausgenommen und schulden keinen Kontrast. Sie bleiben in der Skala, aber ohne Gate.

### Semantik: vier Bedeutungen, vier Rollen

**Der Befund.** `support-warning` ist im Stylesheet gleichzeitig Textfarbe (`color`), Rahmenfarbe
(`border-color`), Fläche (`background`) und Akzentfarbe (`accent-color`). **Ein Token, vier
Aufgaben** — dasselbe Muster wie bei `text-on-color` und `border-subtle`.

Die Folgen sind messbar:

| Token | auf hellem Grund | auf dunklem Grund |
|---|---|---|
| `support-warning` | **2,27** ✗ | 7,52 (geerbt, zufällig) |
| `support-success` | **3,04** ✗ | 5,61 (geerbt, zufällig) |
| `support-error` | 5,14 ✓ | **3,32** ✗ |

Warnung und Erfolg sind im **hellen** Theme als Text unlesbar. Das Gate meldet es nicht, weil nur
`text-error` in der Paarliste steht.

**Und der Beleg, dass jemand das Problem kannte:**

```css
.tlSnackbar--success { background: var(--support-success); color: #fff; }
.tlSnackbar--warning { background: var(--support-warning); color: #000; }
```

Zwei hartkodierte Literale, weil ein Token für „Beschriftung auf dieser Fläche" fehlte. Die
Unterscheidung war richtig gedacht — aber das Weiß auf Erfolgsgrün erreicht nur **3,17** und fällt
durch. Die Ableitungsregel hätte beide getroffen.

#### Die Skala

Vier Bedeutungen — Fehler, Warnung, Erfolg, Info — mit je vier Rollen.

| | Rolle | hell | dunkel | Prüfung |
|---|---|---|---|---|
| **Fehler** | `text` | `#D7352D` | `#E8463C` | 4,53 / 4,55 auf Grund |
| | `border` | `#FB594D` | `#C51E1C` | 3,03 / 3,03 |
| | `surface` | `#CC2823` | `#F14F43` | Beschriftung weiß 5,39 / dunkel 4,77 |
| | `subtle` | `#FFEBE8` | `#35110D` | Text darauf 14,71 / 15,27 |
| **Warnung** | `text` | `#936E00` | `#A27A00` | 4,50 / 4,51 |
| | `border` | `#B88A00` | `#805F00` | 3,01 / 3,01 |
| | `surface` | `#D9A514` | `#EAB532` | Beschriftung dunkel 7,51 / 8,96 |
| | `subtle` | `#FEEFCF` | `#281C02` | 14,84 / 15,03 |
| **Erfolg** | `text` | `#008459` | `#1E9266` | 4,53 / 4,54 |
| | `border` | `#36A376` | `#00734D` | 3,02 / 3,01 |
| | `surface` | `#3DA97B` | `#60C99A` | Beschriftung dunkel 5,75 / 8,29 |
| | `subtle` | `#DCF8E9` | `#0C2319` | 14,99 / 14,88 |
| **Info** | `text` | `#216EE8` | `#307CF8` | 4,51 / 4,54 |
| | `border` | `#4C8FFF` | `#0C5DD6` | 3,01 / 3,01 |
| | `surface` | `#1C69E3` | `#448BFF` | Beschriftung weiß 5,02 / dunkel 5,13 |
| | `subtle` | `#E8F1FF` | `#0C1D3A` | 14,83 / 15,08 |

**Die Regel, wann welche Rolle gilt:**

> *Ein Zustand, der als **Text** erscheint, nimmt `text`. Eine Linie, die ihn trägt, nimmt
> `border`. Eine gefüllte Fläche nimmt `surface` — die Beschriftung darauf wird abgeleitet, nie
> geschrieben. Ein getönter Hinweisstreifen nimmt `subtle` und trägt gewöhnlichen Text.*

**Die Beschriftung auf einer Semantikfläche wird abgeleitet**, nach derselben Regel wie auf der
Marke. Das korrigiert nebenbei den Fehler in der Snackbar: Erfolg bekommt dunkle Schrift, nicht
weiße.

#### Zwei Anmerkungen

**Warnung als Text ist notwendig dunkel** (`#936E00`). Bernstein erreicht auf hellem Grund erst bei
dieser Tiefe 4,5 — was hell genug wäre, um „Bernstein" zu heißen, ist unlesbar. Die helle,
erkennbare Warnfarbe lebt deshalb in `surface`, nicht in `text`.

**Info trägt den Farbton der Marke** (260°). Das ist die Konvention und bindet das System, macht
aber Info und Marke ähnlich. Falls sich beide je beißen, ist das die Stelle zum Nachjustieren.

---

## Offen

| Skala | Zu entscheiden |
|---|---|
| Marke | Farbe, und wie viele Stufen die Rampe hat |
| Neutrale | Wie viele Graustufen die Oberfläche trägt |
| Semantik | Fehler/Warnung/Erfolg/Info — je wie viele Varianten |
| Typo-Größen | Wie viele Stufen, welche Schrittweite |
| Typo-Gewichte | **Faktisch zwei** — Inter liefert nur Regular und SemiBold, siehe unten |
| Radius | Bleiben es zwei Stufen |
| Rahmen | Breiten, und wann Rahmen statt Fläche |
| Fokus | Breite, Offset, Stil |
| Motion | Wie viele Dauern, wie viele Easings |
| Dichte | Wie viele Stufen, und was genau variiert |
| Komponenten-Maße | Control-Höhen — belegt nötig, siehe unten |

---

## Befunde aus dem Specimen

### Inter trägt nur zwei Gewichte

Das Modul `ext.com.inter.fonts` liefert `Inter-Regular` und `Inter-SemiBold`, und SemiBold ist als
`font-weight: bold` deklariert. Die 44 Literale im CSS verteilen sich auf `600`×31, `bold`×6,
`normal`×4, `400`×2, `700`×1 — **zwei Gewichte und ein Ausreißer**. Die eine `700` kann die Schrift
nicht darstellen; der Browser rechnet sie künstlich fett, und in der Typo-Probe sieht sie identisch
zu SemiBold aus.

Solange Inter bleibt, hat die Gewichtsskala zwei Stufen. Das ist keine Entscheidung mehr, sondern
eine Feststellung.

### Die Zeilenhöhe hängt nicht an der Typografie

Bei 12, 13 und 14 px Schriftgröße misst die Tabelle jeweils **33 px**. Ursache ist nicht die Zeile
— `.tlTableView__row` trägt kein `height` —, sondern ein Button darin: `.tlReactButton` mit
`height: 2rem`. Das ist an die **Wurzelschriftgröße** gekoppelt, nicht an die der Tabelle.

**Folge für die Dichte:** Eine Dichte-Dimension, die nur Abstände und Schriftgrößen regelt, ändert
an dieser Zeile nichts. Komponenten-Tokens für Control-Höhen sind damit belegt nötig, nicht
vermutet.

Zum Vergleich zeigt die Typo-Probe beide Reihen:

| | 12 px | 13 px | 14 px |
|---|---|---|---|
| heute: feste Höhe | 33 px | 33 px | 33 px |
| abgeleitet aus der Schriftgröße | 30,59 px | 31,38 px | 32,19 px |
