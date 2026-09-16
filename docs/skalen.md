# Die Skalen des Design Systems

**Stand:** 2026-09-16 · Stufe A, in Arbeit
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
Schatten im Dark-Theme werden gegenstandslos und durch eigene Werte ersetzt.

#### Schatten bekommt nur, was wirklich schwebt

Drei Flächenstufen — `background`, `layer-01`, `layer-02` — liegen *in* der Oberfläche. Sie werfen
keinen Schatten. Einen Schatten bekommt ausschließlich, was **über** der Oberfläche liegt und sie
verdeckt: Popover, Dropdown, Kontextmenü, Tooltip, Dialog, Toast, das Element am Ziehzeiger.

Der Bestand hält sich nicht daran. `--shadow-raised` liegt heute auf:

| Stelle | Warum das falsch ist |
|---|---|
| `.tlTableView__row--cursor` | Eine Tabellenzeile schwebt nicht. Der Cursor ist ein Zustand, keine Höhe. |
| `.tlTableView__row--selected` | dito — Auswahl ist Fläche (`layer-selected`), nicht Elevation. |
| `.tlCard--elevated` | Eine Karte liegt in der Oberfläche. Sie bekommt einen Rahmen. |
| `.tlAppBar--elevated` | Eine Leiste ist Teil des Gerüsts, nichts schwebt darüber. |

Übrig bleiben vier Stellen, die zu Recht einen Schatten tragen: `.tlDropdownSelect__dropdown`,
`.tlColorInput__popup`, `.tlIconSelect__popup`, `.tl-tooltip-popover`. **`--shadow-raised` wird
ersatzlos gestrichen** — es gibt keine Rolle mehr dafür.

#### Die drei Stufen

| Token | hell | dunkel | Gilt für |
|---|---|---|---|
| `shadow-popover` | `0 2px 8px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)` | `0 2px 8px rgba(0,0,0,0.40)` | Dropdown, Kontextmenü, Tooltip, Popover |
| `shadow-dialog` | `0 8px 24px rgba(0,0,0,0.16)` | `0 8px 24px rgba(0,0,0,0.56)` | Modaler Dialog, Drawer, Seitenpanel |
| `shadow-drag` | `0 12px 32px rgba(0,0,0,0.20)` | `0 12px 32px rgba(0,0,0,0.64)` | Element am Ziehzeiger, Toast |

Dunkel steigt die Deckkraft, weil ein schwacher Schwarzschatten auf `#16181B` unsichtbar bleibt —
aber er trägt dort nicht allein, sondern begleitet die hellere Fläche.

Das heutige `--shadow-menu` mit `rgba(0,0,0,0.32)` auf nur 6 px Weichzeichnung ist für eine
Corporate-Oberfläche zu hart: viel Deckkraft auf kurzer Strecke ergibt eine sichtbare Kante statt
einer Tiefe. Die neue Popover-Stufe verteilt dieselbe Wirkung auf 8 px und eine zweite, engere
Lage.

#### Overlays brauchen eine eigene Fläche

Ein Popover liegt im dunklen Modus über `layer-02` (`#242729`) — und dort trägt die **Fläche** die
Höhe. Es gibt aber keine Stufe darüber. Die Skala bekommt deshalb eine:

| Token | hell | dunkel |
|---|---|---|
| `layer-overlay` | `#FFFFFF` | `#2B2F33` |

Ohne sie wäre das Dark-Theme an genau der Stelle mechanismuslos, an der die Elevation zählt.

#### Hell trennt der Rahmen, dunkel die Fläche

`layer-01` und `layer-02` sind im hellen Modus beide weiß — über `#FAFAFA` liegt bis Weiß nur eine
Stufe. Da sie jetzt auch keinen Schatten mehr tragen dürfen, trennt sie im hellen Modus ein
**Rahmen**: `border-separator` (`#CBCED3`, ~1,5:1), eine Linie, die trennt und nichts behauptet.

| | hell | dunkel |
|---|---|---|
| Karte, Panel, Gruppe | 1 px `border-separator` | keine Linie, hellere Fläche |
| Popover, Dialog, Toast | Schatten **und** Rahmen | Schatten **und** `layer-overlay` |

**Folge für die Komponenten:** `.tlCard--outlined` wird der Normalfall und `.tlCard--elevated`
entfällt. Eine Karte, die sich abheben soll, tut das über ihren Rahmen — oder sie ist gar keine
Karte, sondern ein Dialog.

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
| `layer-overlay` | `#FFFFFF` | `#2B2F33` |
| `field` | `#F0F4F9` | `#27292D` |
| `layer-hover` | `#F0F2F6` | `#22262A` |
| `layer-selected` | `#E5E8ED` | `#2B3034` |
| `layer-active` | `#D9DDE3` | `#343A3F` |

**`layer-01`, `layer-02` und `layer-overlay` bleiben im hellen Modus alle weiß — und das ist
diesmal richtig.** Über `#FAFAFA` liegt bis Weiß nur eine Stufe; drei Ebenen lassen sich dort durch
Helligkeit nicht ausdrücken. Im hellen Modus trennt deshalb der **Rahmen**, im dunklen die
**Fläche** — und der Schatten bleibt beiden vorbehalten, was wirklich über der Oberfläche schwebt.
Die Regel steht vollständig unter „Elevation".

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

### Schrift: Inter bleibt

Geprüft am 2026-09-15 an der ausgelieferten Datei, nicht nach Eindruck:

* **Version 3.019, SIL OFL** — auch kommerziell auslieferbar.
* **Tabellenziffern (`tnum`) und geschlitzte Null (`zero`) sind vorhanden.**
* **TopLogic nutzt `tabular-nums` genau zweimal** — in einem Countdown und einem Label, *nicht* in
  der Datentabelle. Die Zahlenspalten stehen also mit proportionalen Ziffern da und fluchten nicht.
* **Zwei von neun Schnitten** sind ausgeliefert, und keine `woff2`-Dateien.

**Der System-Font-Stack scheidet aus.** Nicht wegen der Qualität — Segoe UI und SF sind
ausgezeichnet —, sondern wegen der **Metrik-Varianz**: Dieselbe Tabelle wird auf Windows, macOS und
Linux verschieden breit. Ein Design System, das Abstände und Control-Höhen als Tokens festlegt,
verliert damit seine Grundlage, und Dokumentation, Figma und Kundendemos zeigen jeweils etwas
anderes.

**Ein anderes Typeface scheidet vorerst aus**, weil Inter jede funktionale Anforderung erfüllt. Der
Grund für einen Wechsel wäre Charakter, nicht Funktion — und die drei offenen Punkte oben sind
Konfiguration, keine Eigenschaften der Schrift.

Zu tun, wenn die Typo-Skala gebaut wird: `tnum` und `zero` in den Zahlenspalten einschalten, das
fehlende Gewicht ergänzen, `woff2` nachliefern.

**In Kundenprojekten wird die Schrift des Kunden verwendet.** Was dabei bricht und wie es
abgefedert wird, steht in Issue #12 — Metrik-Normalisierung über `size-adjust` und die
`*-override`-Deskriptoren, einheitenlose Zeilenhöhen, abgeleitete Control-Höhen, Feature-Rückfall
und eine Validierung des Kunden-Themes.

### Typo: sechs Größen, neun Klassen, zwei Familien

Die erste Fassung dieser Skala hatte sieben Größen und war aus dem Bestand abgeleitet: 14 px stand
48-mal im CSS, also wurde 14 px zum Fließtext. **Häufigkeit ist kein Qualitätsargument.** Jede
dieser Größen entstand als Einzelentscheidung, und dass 12, 13 und 14 px nebeneinander existieren,
belegt nicht, dass eine Oberfläche drei Arbeitsgrößen braucht — es belegt, dass nie jemand
entschieden hat.

Neu entschieden, gegen den Bestand:

**Zwei Arbeitsgrößen, nicht drei.** 13 px fällt weg. Der Unterschied zu 14 px ist für niemanden
sichtbar, aber jede Komponente muss ihn trotzdem entscheiden. Wer dichter will, schaltet die
**Dichte** — die regelt Zeilenhöhe und Polsterung, nicht die Schriftgröße. Eine Tabelle wird eng,
indem Luft verschwindet, nicht indem Text schrumpft.

**12 px ist die Untergrenze, ausnahmslos.** TopLogic steht bei Kunden im öffentlichen Sektor, wo
BITV 2.0 und EN 301 549 gelten. Die sieben Werte zwischen 9 und 11,52 px fallen alle auf 12. Ein
Badge, das kleiner sein will, bekommt engere Polsterung, nicht kleinere Schrift.

#### Die Größen

| Token | `rem` | px | Zeilenhöhe px |
|---|---|---|---|
| `font-size-label` | `0.75rem` | 12 | 16 |
| `font-size-body` | `0.875rem` | 14 | 20 |
| `font-size-heading-sm` | `1rem` | 16 | 24 |
| `font-size-heading-md` | `1.25rem` | 20 | 28 |
| `font-size-heading-lg` | `1.5rem` | 24 | 32 |
| `font-size-display` | `2rem` | 32 | 40 |

Sechs Werte, davon fünf für die Oberfläche und `display` für Login, Leerbild und Report-Deckblatt.
Jede Größe ist ein Vielfaches von `0,0625rem` — einem Pixel bei Standardwurzel —, und **jede
Zeilenhöhe liegt auf dem 4-px-Raster**. Damit rastet Typografie in dasselbe Raster wie Abstände und
Control-Höhen ein, statt daneben zu laufen.

`rem` statt `px`, weil eine px-Skala die Schriftgrößen-Einstellung des Browsers ignoriert und die
Control-Höhen mit `height: 2rem` ohnehin schon an der Wurzel hängen.

#### Die Klassen

Eine Größe ist keine Klasse. Eine Klasse legt Familie, Größe, Gewicht, Zeilenhöhe, Laufweite und
die Regel fest, wann sie gilt — sonst entscheidet jede Komponente das Gewicht neu, und genau so
entstanden die 44 literalen `font-weight`.

| Klasse | Größe | Gewicht | Zeilenhöhe | Laufweite | Gilt für |
|---|---|---|---|---|---|
| `type-display` | 32 | 600 | 1.25 | −0.01em | Login, Leerbild, Report-Deckblatt |
| `type-heading-lg` | 24 | 600 | 1.3333 | −0.005em | Seitentitel |
| `type-heading-md` | 20 | 600 | 1.4 | 0 | Dialogtitel |
| `type-heading-sm` | 16 | 600 | 1.5 | 0 | Abschnittstitel, Gruppenrahmen |
| `type-body` | 14 | 400 | 1.4286 | 0 | alles Gelesene |
| `type-body-strong` | 14 | 600 | 1.4286 | 0 | Hervorhebung im Fließtext, aktive Zeile |
| `type-label` | 12 | 400 | 1.3333 | +0.01em | Feldbeschriftung, Hilfstext, Badge |
| `type-label-strong` | 12 | 600 | 1.3333 | +0.01em | Spaltenkopf, Registerreiter |
| `type-code` | 14 | 400 | 1.4286 | 0 | TL-Script, XML, Stacktrace |

Neun Klassen aus sechs Größen und zwei Gewichten. Mehr Gewichte gibt es nicht — Inter liefert nur
Regular und SemiBold, das ist eine Feststellung, keine Entscheidung.

Die Laufweite folgt einer Regel statt dem Gefühl: **kleine Größen laufen weiter, große enger.** Bei
12 px öffnet `+0.01em` das Wortbild, bei 24 und 32 px schließt negatives Tracking die Lücken, die
bei großer Darstellung auffallen. Zwischen 14 und 20 px bleibt sie unverändert.

**Zahlen sind eine Eigenschaft, keine eigene Klasse.** Jede Klasse kennt einen numerischen Zustand,
der `font-feature-settings: "tnum" 1, "zero" 1` setzt — tabellarische Ziffern und geschlitzte Null.
**In Tabellenspalten mit Zahlen ist er Pflicht, nicht Option.** Heute nutzt TopLogic
`tabular-nums` genau zweimal, in einem Countdown und einem Label, und nicht in der Datentabelle —
die Zahlenspalten fluchten also nicht. Inter trägt beide Merkmale, sie sind nur nie eingeschaltet
worden.

#### Die Familien

| | Stack |
|---|---|
| `--font-family` | `'Inter', ui-sans-serif, system-ui, 'Segoe UI', Roboto, sans-serif` |
| `--font-family-mono` | `'JetBrains Mono', ui-monospace, SFMono-Regular, Consolas, monospace` |

**Beide Familien werden lokal ausgeliefert**, wie Inter heute in `ext.com.inter.fonts`. Kein CDN,
keine Google-Fonts-Einbindung — TopLogic läuft in Installationen ohne Internetzugang, und eine
Schrift, die von außen nachgeladen wird, ist ein Datenschutz- und ein Verfügbarkeitsproblem
zugleich.

Zwei Fehler im Bestand, die dabei mitfallen:

* **`font-family: 'Inter'` hat heute keinen Fallback** — keine generische Familie, kein Stack. Lädt
  Inter nicht, rendert TopLogic in der Standardschrift des Browsers, also meist Times.
* **`font-family-mono: monospace` ist keine Entscheidung**, sondern der Verzicht darauf. Auf Windows
  bedeutet das Courier New. Für eine Plattform mit TL-Script-Editor, Konfigurations-XML und
  Stacktraces ist das zu wenig — genutzt wird die Familie heute an genau einer Stelle
  (`.tlViewError__detail`).

**JetBrains Mono**, OFL, wegen der Zeichen, an denen TL-Script-Fehler entstehen: geschlitzte Null,
unterscheidbares `l`/`1`/`I` und `O`/`0`. Die x-Höhe liegt über der von Inter, deshalb wird die
Familie per `size-adjust` metrisch angeglichen, statt `type-code` eine Stufe kleiner zu setzen —
dieselbe Technik, die Issue #12 für Kundenschriften vorsieht.

#### Druck und Report

TopLogic erzeugt PDFs und Exporte, und dort trägt keine der obigen Größen: `rem` hat im Druck keine
Wurzel, und 14 px sind auf Papier weder eine Größe noch eine Aussage über Lesbarkeit.

Die Druckklassen rechnen deshalb in **pt** und bilden eine eigene, kürzere Leiter — Papier braucht
weniger Abstufung als eine Oberfläche, weil es keine Bedienelemente hat:

| Klasse | Größe | Gewicht | Zeilenhöhe |
|---|---|---|---|
| `print-title` | 18pt | 600 | 1.25 |
| `print-heading` | 12pt | 600 | 1.35 |
| `print-body` | 10pt | 400 | 1.4 |
| `print-caption` | 8pt | 400 | 1.35 |

`print-caption` darf die 12-px-Untergrenze unterschreiten, weil sie für den Bildschirm gilt: Papier
hat eine höhere Auflösung und keinen Zoom-Ersatz nötig. Zahlen im Druck tragen `tnum` ohne Ausnahme.

#### Was daraus folgt

Das Gate bekommt eine Regel mehr: **Ein `font-size` oder `font-weight` außerhalb einer Klasse ist
ein Verstoß.** Ohne sie wandert die nächste Komponente wieder auf `.72rem`, so wie es der
Größenbefund oben für sieben Werte zwischen 9 und 11,52 px zeigt.

### Radius: zwei Stufen, zwei Formen

TopLogic steht in Konzernen im Tagesbetrieb — acht Stunden Formulare, Tabellen und Dialoge. Ein
weicher, verspielter Radius ermüdet dort und wirkt außerdem falsch neben der Corporate Identity der
Kunden. Ein Radius von 0 wiederum wirkt hart und unfertig. **Die Skala bleibt bewusst am
zurückhaltenden Ende**, dort wo Carbon (4 px) und Fluent (4 px) auch stehen.

| Token | Wert | Gilt für |
|---|---|---|
| `radius-sm` | `0.25rem` (4 px) | Feld, Schaltfläche, Auswahlfeld, Checkbox, Reiter, Tabellenzelle, Chip-Ecke |
| `radius-md` | `0.5rem` (8 px) | Karte, Dialog, Popover, Panel, Drawer |
| `radius-full` | `999px` | Badge, Zähler, Umschalter, Fortschrittsbalken |
| `radius-round` | `50%` | Avatar, Statuspunkt, runder Icon-Knopf |

**Die Regel ist die Rolle, nicht die Größe:** Was bedient wird, bekommt `radius-sm`. Was etwas
umschließt, bekommt `radius-md`. Ein Dialog ist ein Behälter, auch wenn er klein ist; eine
Schaltfläche bleibt eine Schaltfläche, auch wenn sie breit ist. Damit hat die Regel dieselbe Form
wie die Rahmenregel — *trennt oder umschließt* —, und das ist Absicht.

`radius-full` und `radius-round` sind keine Stufen, sondern **Formen**. Sie stehen außerhalb der
Skala, weil sie nicht mehr oder weniger Rundung bedeuten, sondern eine andere Gestalt: eine Pille
und ein Kreis. Eine Zwischenstufe zwischen `radius-md` und `radius-full` gibt es deshalb nicht.

Aus dem Bestand fallen zwei Werte:

* **`2px`**, zweimal literal. Von 4 px ist er mit bloßem Auge nicht zu unterscheiden, kostet aber in
  jeder Komponente eine Entscheidung. Er geht auf `radius-sm`.
* **`0`**, zweimal literal. Wo eine Kante wirklich scharf sein muss — eine Zelle mitten in einer
  Tabelle —, ist das kein Radiuswert, sondern das Fehlen eines Rahmens. Es wird nicht als Token
  geführt.

**Verschachtelung:** Liegt ein Element mit `radius-sm` bündig in einem Behälter mit `radius-md`,
bleibt die innere Rundung kleiner als die äußere — 4 in 8 geht auf. Der umgekehrte Fall, ein
gerundeter Behälter in einem schärferen, tritt in der Skala nicht auf.

### Fokus: ein Ring, außen, nur bei Tastatur

Der Fokus ist der unordentlichste Teil des Bestands. Fünf Mechanismen stehen nebeneinander für
dieselbe Sache:

| Mechanismus | Stellen |
|---|---|
| `outline: 2px solid var(--focus)` | 29 |
| `box-shadow: inset` 2 px plus 3 px `--focus-inset` | 8 |
| `box-shadow` außen — in 1 px, 2 px **und** 3 px | 7 |
| `border-color: var(--focus)` | 5 |
| `box-shadow: inset 0 ±2px` — nur Ober- und Unterkante | 5 |

Dazu vier Mängel, die keiner für sich entstanden ist:

* **`:focus` steht 36-mal, `:focus-visible` 28-mal.** Mehr als die Hälfte aller Stellen zeigt den
  Ring also auch beim Mausklick.
* **`outline: none` steht 22-mal**, und in den zwei Folgezeilen findet sich an keiner davon ein
  `box-shadow`-Ersatz. Das sind Kandidaten für einen vollständig fehlenden Fokus — jeder einzelne
  ein Verstoß gegen WCAG 2.4.7.
* **Vier verschiedene Fokusfarben:** `--focus`, `--interactive`, `--support-warning`,
  `--support-error`, dazu `currentColor`.
* **`2px dashed`** steht zweimal neben 29-mal `solid`.

#### Die Entscheidung

| | Wert |
|---|---|
| Mechanismus | `outline`, immer außen |
| Breite | `2px` |
| Offset | `2px` |
| Stil | `solid`, ausnahmslos |
| Farbe | `focus` — hell `#0B5ED7`, dunkel `#5394FF`, dieselbe Farbe wie `border-interactive` |
| Auslöser | `:focus-visible`, ausnahmslos |

**Ein Mechanismus, keine Ausnahme.** Die vier anderen fallen weg. `outline` folgt in allen aktuellen
Browsern dem `border-radius` von selbst, wird nicht vom Layout eingerechnet und liegt über allem —
drei Eigenschaften, die ein `box-shadow`-Nachbau je einzeln nachstellen müsste.

**Der Offset ist nicht Kosmetik, sondern der Grund, warum der Ring auf der Marke sichtbar bleibt.**
Läge der Ring an der Kante, verschwände ein blauer Ring auf einer blauen Schaltfläche. Zwei Pixel
Luft setzen ihn auf die dahinterliegende Fläche, wo er gegen `background` oder `layer-01` seinen
Kontrast hat.

**Nur `:focus-visible`.** Der Ring gehört der Tastatur- und Assistenzbedienung; wer klickt, weiß,
wo er ist. WCAG 2.4.7 verlangt ihn dort nicht, und in einer Oberfläche, in der acht Stunden lang
geklickt wird, ist ein Ring bei jedem Klick Lärm. Die 36 `:focus`-Stellen werden mechanisch
umgestellt.

**`--focus-inset` entfällt.** Es existierte nur als Konterlinie des Inset-Rings, und den gibt es
nicht mehr.

#### Was das an Komponenten nach sich zieht

Ein außen liegender Ring kann von einem Vorfahren mit `overflow: hidden` beschnitten werden — in
Tabellenzellen, Listenzeilen und Reiterleisten genau dort, wo der Bestand heute zum Inset-Ring
greift. Der Ring weicht deswegen nicht aus; **`overflow: hidden` an einem Behälter mit
fokussierbaren Kindern wird zum Befund.** Der Ersatz ist `overflow: clip` mit einem
`overflow-clip-margin`, das die vier Pixel aus Offset und Breite freihält.

Das Gate bekommt zwei Regeln: **`outline: none` ohne Ersatz im selben Block ist ein Verstoß**, und
**jede Fokusdarstellung, die nicht `outline` ist, ebenso.**

### Motion: drei Dauern, drei Kurven, ein Schalter

Es gibt Motion in TopLogic — nur kein System dafür. 19 `transition` und 13 `@keyframes` stehen im
CSS, und **kein einziger Wert ist ein Token.**

| | Bestand |
|---|---|
| Dauern | acht verschiedene: 0,1 · 0,15 · 0,2 · 0,25 · 0,5 · 0,6 · 0,8 · 2 s |
| Kurven | vier Browser-Defaults: `ease`, `ease-out`, `ease-in-out`, `linear` |
| `cubic-bezier` | keins |
| `prefers-reduced-motion` | **einmal** — bei 13 Animationen, davon **sechs mit `infinite`** |

#### Die Dauern

| Token | Wert | Gilt für |
|---|---|---|
| `duration-fast` | `100ms` | Hover, Aktiv, Fokus — alles, was direkt am Zeiger hängt |
| `duration-base` | `150ms` | Normalfall: Farbe, Rahmen, Deckkraft, kleine Verschiebung |
| `duration-slow` | `250ms` | Popover, Dialog, Drawer — alles, was eine Fläche bewegt |

Drei Dauern decken die acht des Bestands vollständig ab. Die langen Werte (0,5 bis 2 s) gehören zu
Endlos-Animationen und sind keine Übergänge — sie stehen bei ihrer Animation, nicht in der Skala.

**Die Regel ist die Fläche, nicht die Wichtigkeit:** Je mehr Pixel sich bewegen, desto länger darf
es dauern. Ein Farbwechsel am Knopf ist bei 100 ms fertig, ein Drawer braucht 250 ms, sonst wirkt
er gerissen.

#### Die Kurven

| Token | Wert | Gilt für |
|---|---|---|
| `easing-standard` | `cubic-bezier(0.2, 0, 0.38, 0.9)` | Normalfall — alles, was bleibt und sich ändert |
| `easing-entrance` | `cubic-bezier(0, 0, 0.38, 0.9)` | was erscheint: Popover öffnet, Toast kommt |
| `easing-exit` | `cubic-bezier(0.2, 0, 1, 0.9)` | was verschwindet: Dialog schließt, Menü klappt zu |
| `easing-linear` | `linear` | nur Endlosdrehung — ein Spinner mit Beschleunigung ruckelt |

**`ease` ist kein Ausweg.** Es ist auf jeder Engine derselbe Wert und deshalb verlässlich — aber es
startet und endet gleich träge, was jede kurze Bewegung weich und unentschlossen aussehen lässt.

Die Aufteilung folgt einer physikalischen Regel: **Was erscheint, bremst ab. Was verschwindet,
beschleunigt weg.** Etwas, das ankommt, wird langsamer, bis es liegt; etwas, das geht, muss nicht
sanft enden, weil niemand mehr hinsieht. Deshalb hat `entrance` keine Anlaufzeit (`0, 0`) und `exit`
kein Abbremsen (`1, 0.9`).

#### Der Schalter

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Eine Regel, global, mit `!important`. Sie greift auf jede bestehende Animation, auf jede, die Stufe
B baut, und auf jede, die ein Kunde ergänzt — ohne dass eine Komponente daran denken muss.

**Warum global und nicht je Komponente:** Der Bestand zeigt, was die andere Variante ergibt — 13
Animationen und eine Stelle, die die Einstellung berücksichtigt. Sechs davon laufen endlos: vier
Spinner, zwei Wobble, ein Ripple. Wer die Einstellung gesetzt hat, tut das meist wegen vestibulärer
Beschwerden, und eine dauerhaft kreisende Bewegung am Bildrand ist genau der Auslöser.

Die Spinner drehen sich dann nicht mehr. Das ist beabsichtigt: Sie bleiben als Symbol sichtbar, und
die Ladeanzeige steht ohnehin nie allein — daneben steht, worauf gewartet wird.

`0.01ms` statt `0`, weil ein `transitionend`-Ereignis sonst nie feuert und JavaScript hängen bleibt,
das darauf wartet.

### Abstände: sieben Stufen, und eine fehlte

Die Skala des Bestands — `spacing-01` bis `-06` — ist 4 · 8 · 16 · 24 · 32 · 48 px. **Zwischen 8 und 16 liegt nichts**, und genau dort nehmen sich die Komponenten, was sie brauchen: 18 literale Abstände stehen in dieser Lücke.

| Literal | Stellen |
|---|---|
| `12px` / `0.75rem` | 6 |
| `6px` / `0.375rem` | 7 |
| `10px` / `0.625rem` | 3 |
| `5px` | 1 |

Die neue Skala schließt sie:

| Token | `rem` | px |
|---|---|---|
| `space-4` | `0.25rem` | 4 |
| `space-8` | `0.5rem` | 8 |
| **`space-12`** | **`0.75rem`** | **12** |
| `space-16` | `1rem` | 16 |
| `space-24` | `1.5rem` | 24 |
| `space-32` | `2rem` | 32 |
| `space-48` | `3rem` | 48 |

**Die Namen tragen den Wert, nicht eine laufende Nummer.** Eine Skala mit `01`…`06` kann man nicht erweitern, ohne die Bedeutung bestehender Namen still zu verschieben — `spacing-03` hieße nach dem Einfügen 12 statt 16 px, und jede Verwendung wäre lautlos falsch. Mit `space-12` bricht stattdessen sichtbar, was noch `spacing-03` schreibt.

Alle sieben Werte sind durch vier teilbar. Damit liegen **Abstände, Zeilenhöhen und Control-Höhen auf demselben 4-px-Raster**.

### Dichte: zwei Stufen, und die Schrift bleibt gleich

**Eine Tabelle wird eng, indem Luft verschwindet — nicht indem Text schrumpft.** Das ist die Folge der Typo-Entscheidung: Weil dort nur zwei Arbeitsgrößen stehen und 12 px die Untergrenze ist, kann Verdichtung nicht über die Schriftgröße laufen.

| | Standard | Kompakt |
|---|---|---|
| Control-Höhe | `2rem` (32) | `1.75rem` (28) |
| Control-Höhe klein | `1.5rem` (24) | `1.5rem` (24) |
| Tabellenzeile | `2.25rem` (36) | `2rem` (32) |
| Polsterung waagerecht | `space-12` | `space-8` |
| Polsterung senkrecht | `space-8` | `space-4` |
| Abstand im Formular | `space-16` | `space-12` |
| Schriftgröße | **12 / 14 px** | **12 / 14 px** |

**Zwei Stufen, nicht drei.** Jede Stufe muss in jeder Komponente umgesetzt und geprüft werden; eine dritte kostet die Hälfte mehr Pflege für einen Fall, den der Bestand nicht einmal andeutet.

Die Zeilenhöhe ist **abgeleitet, nicht gesetzt**: Control-Höhe plus 4 px. Deshalb trägt die Zeile ihren Inhalt in beiden Stufen, statt ihn abzuschneiden.

#### Warum das den heutigen Zustand auflöst

Der Bestand hat bereits drei Dichte-Modifier — `.tlStack--gap-compact`, `.tlGrid--gap-compact`, `.tlCard__body--pad-compact`. **Drei Komponenten haben je für sich entschieden, was „kompakt" heißt**, und keine davon wirkt auf die anderen. Eine Maske, die alle drei enthält, ist nach dem Umschalten in drei verschiedenen Dichten.

Dazu der bereits vermessene Befund: Bei 12, 13 und 14 px Schriftgröße misst die Tabellenzeile jeweils **33 px**. Ursache ist nicht die Zeile, sondern ein Button darin mit `height: 2rem` — gekoppelt an die Wurzelschriftgröße, nicht an die der Tabelle. **Eine Dichte, die nur Abstände regelt, ändert an dieser Zeile nichts.** Deshalb gehören die Control-Höhen in dieselbe Entscheidung.

Vier Höhen aus dem Bestand fallen zusammen: `2rem` (18×) und `2.5rem` (8×) auf die Standard-Stufe, `1.5rem` (4×) auf die kleine Variante, die literalen `40px`, `32px`, `28px` und `24px` auf ihre jeweilige Stufe.

#### Die Einheitenregel

**Was mit der Schrift skalieren soll, steht in `rem`. Linien stehen in `px`.**

| | Einheit | Grund |
|---|---|---|
| Abstände, Polsterung, Gaps | `rem` | Wer die Browserschrift auf 20 px stellt, braucht auch mehr Luft — sonst wird die Oberfläche genau für den enger, der sie größer gestellt hat |
| Control- und Zeilenhöhen | `rem` | hängen ohnehin schon an der Wurzel |
| Radius | `rem` | wächst mit dem Element, die Proportion bleibt |
| Rahmenbreite, Fokusring und -offset | `px` | Eine 1-px-Linie soll eine Linie bleiben; bei 20 px Wurzel ergäbe `0.0625rem` 1,25 px und rasterte unsauber |

Jeder `rem`-Wert der Skala ist ein glattes Sechzehntel und damit bei Standardwurzel ein ganzes Pixel.

---

## Offen

| Skala | Zu entscheiden |
|---|---|
| Marke | Wie viele Stufen die Rampe hat — die Farbe steht, vorläufig |
| Rahmen | Die Breiten. Welche Stufe wann gilt, ist entschieden |

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

### Die Schriftgrößen liegen auf drei Werten und einem Schwanz

Alle 113 `font-size`-Deklarationen der beiden React-Stylesheets, die fünf Carbon-Tokens auf ihre
Werte aus `tl-react-theme.config.xml` aufgelöst, in px bei 16 px Wurzelgröße:

| px | Deklarationen | Herkunft |
|---|---|---|
| 9 | 3 | Literal |
| 10 | 3 | Literal |
| 10,40 · 10,88 · 11 · 11,20 · 11,52 | 1 · 1 · 2 · 3 · 4 | Literale, `rem` mit drei Nachkommastellen |
| **12** | **21** | 13× `--label-01-font-size`, 8× Literal |
| 12,80 | 1 | Literal |
| **13** | **8** | nur Literale — kein Token |
| **14** | **48** | 33× `--body-compact-01`, 8× `--heading-compact-02`, 7× Literal |
| 16 | 7 | 2× `--heading-compact-03`, 5× Literal |
| 17,60 | 1 | Literal |
| 18 | 2 | Literal |
| 20 | 4 | 1× `--heading-03`, 3× Literal |
| 24 · 32 | 1 · 1 | Literal |

Zwei weitere Deklarationen sind relativ (`inherit`, `0.875em`) und nicht umrechenbar.

**Drei Werte tragen 69 %** der Oberfläche: 14, 12 und 13 px. Darüber stehen fünf Größen mit
zusammen neun Vorkommen — eine Überschriftenskala, die nie als solche gebaut wurde.

**Darunter liegt der eigentliche Befund:** 17 Deklarationen verteilen sich auf **sieben**
verschiedene Werte zwischen 9 und 11,52 px. Keiner davon hat ein Token, und keiner unterscheidet
sich vom Nachbarn um mehr als ein halbes Pixel — `.65rem`, `.68rem`, `.7rem`, `.72rem` stehen in
denselben Kalendarkomponenten nebeneinander (`.tlCalMore`, `.tlCalEventTime`, `.tlCalChip`). Das
sind keine Stufen, das sind Einzelfallentscheidungen, die nacheinander getroffen wurden.

Die Skala muss diesen Schwanz auf **eine** Stufe abbilden. Wie viele Stufen es insgesamt werden und
wo die kleinste liegt, ist damit die eigentliche Frage — nicht die Schrittweite.
