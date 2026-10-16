# Die Skalen des Design Systems

**Stand:** 2026-09-28 · Skalen entschieden, Welle 0 und Button gemerged, Pill und Avatar als PR, `derive` gebaut, UI-Paket mit #29643 konsolidiert
**Spec:** [`superpowers/specs/2026-09-17-design-system-neuaufbau-design.md`](superpowers/specs/2026-09-17-design-system-neuaufbau-design.md)

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

Drei Flächenstufen — `surface-base`, `surface-layer`, `surface-layer-nested` — liegen *in* der Oberfläche. Sie werfen
keinen Schatten. Einen Schatten bekommt ausschließlich, was **über** der Oberfläche liegt und sie
verdeckt: Popover, Dropdown, Kontextmenü, Tooltip, Dialog, Toast, das Element am Ziehzeiger.

Der Bestand hält sich nicht daran. `--shadow-raised` liegt heute auf:

| Stelle | Warum das falsch ist |
|---|---|
| `.tlTableView__row--cursor` | Eine Tabellenzeile schwebt nicht. Der Cursor ist ein Zustand, keine Höhe. |
| `.tlTableView__row--selected` | dito — Auswahl ist Fläche (`surface-interactive-selected`), nicht Elevation. |
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

Ein Popover liegt im dunklen Modus über `surface-layer-nested` (`#242729`) — und dort trägt die **Fläche** die
Höhe. Es gibt aber keine Stufe darüber. Die Skala bekommt deshalb eine:

| Token | hell | dunkel |
|---|---|---|
| `surface-overlay` | `#FFFFFF` | `#2B2F33` |

Ohne sie wäre das Dark-Theme an genau der Stelle mechanismuslos, an der die Elevation zählt.

#### Hell trennt der Rahmen, dunkel die Fläche

`surface-layer` und `surface-layer-nested` sind im hellen Modus beide weiß — über `#FAFAFA` liegt bis Weiß nur eine
Stufe. Da sie jetzt auch keinen Schatten mehr tragen dürfen, trennt sie im hellen Modus ein
**Rahmen**: `border-separator` (`#CBCED3`, ~1,5:1), eine Linie, die trennt und nichts behauptet.

| | hell | dunkel |
|---|---|---|
| Karte, Panel, Gruppe | 1 px `border-separator` | keine Linie, hellere Fläche |
| Popover, Dialog, Toast | Schatten **und** Rahmen | Schatten **und** `surface-overlay` |

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

`text-on-brand` und `icon-on-brand` werden deshalb **abgeleitet statt festgeschrieben**: Von zwei
Kandidaten — `text-primary` des hellen Modus und Weiß — gewinnt der mit dem höheren Verhältnis
gegen `surface-brand` des jeweiligen Modus.

**Warum abgeleitet:** Die nötige Beschriftungsfarbe hängt vom gewählten Markenton ab. Ein fester
Wert wäre beim nächsten Ton wieder falsch und in jedem Kunden-Theme erst recht. Nachgewiesen an
zwei Gegenproben: Ein sehr heller Ton (`#F5E663`) schaltet **beide** Modi auf dunkle Schrift, ein
sehr dunkler (`#1A0F3D`) beide auf weiße.

### Offen

**Alle Skalen sind entschieden, und die letzte offene Folge ist aufgelöst.**

Was aussteht, gehört zur Umsetzung, nicht zur Entscheidung:

| | |
|---|---|
| `disabled`-Rollen | entschieden — siehe „Disabled: vier Rollen ohne Gate": `surface-disabled`, `border-disabled`, `text-disabled`, `icon-disabled`; Beschriftung auf einer deaktivierten Fläche ist `text-disabled`. |
| Syntaxhervorhebung | `script-editor-text-highlight` gehört zur Code-Klasse; die Skala führt dafür bisher keine Rolle. |

### Marke: `#0B5ED7`, vorläufig

Farbton 260°, Chroma 0,200, Helligkeit 0,515.

| | hell | dunkel |
|---|---|---|
| `surface-brand` | `#0B5ED7` | `#5394FF` |
| `surface-brand-hover` | `#004DBA` | `#75A9FF` |
| `surface-brand-active` | `#003A8F` | `#2471EC` |
| `text-link` | `#0B5ED7` | `#75A9FF` |
| `text-link-hover` | `#004DBA` | `#95BDFF` |
| Beschriftung darauf | `#FFFFFF` (5,84) | `#1B1D21` (5,66) |

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

Reines Weiß entfällt. Die vier Flächen-Tokens `surface-base`, `surface-layer`, `surface-layer-nested` und
`color-surface` waren alle `#FFFFFF` — zu grell und zu klinisch für eine Oberfläche, in der man
stundenlang arbeitet.

Neutral statt markengetönt, weil die Grundfläche gegenüber jeder Marke funktionieren muss, auch
gegenüber der eines Kunden mit ungewöhnlicher CI. Kostet fast nichts: Text fällt von 18,89 auf
18,10, der Link von 5,84 auf 5,59.

### Rahmen: vier Stufen, jede mit einer Aufgabe

`border-subtle` wird aufgelöst. Der Grund ist derselbe wie bei `text-on-brand`: **Ein Token hatte
zwei Aufgaben.** Es trennte Tabellenzeilen *und* umrandete Eingabefelder. Das erste braucht keinen
Kontrast, das zweite schuldet nach WCAG 1.4.11 mindestens 3,0. Ein Wert kann beides nicht — und
weil der schwächere gewann, erfüllte kein Eingabefeld in TopLogic die Norm, hell wie dunkel.

| Stufe | hell | dunkel | hell / dunkel | Regel |
|---|---|---|---|---|
| `border-separator` | `#C1C4C9` | `#34383C` | 1,68 / 1,51 | **Trennt**, begrenzt nicht. Tabellenzeilen, Abgrenzungen. Schuldet keinen Kontrast. |
| `border-control` | `#888B90` | `#75787D` | 3,28 / 4,01 | **Begrenzt ein Bedienelement.** Eingabefelder, Auswahlfelder, Schaltflächen mit Umriss. |
| `border-emphasis` | `#6F7277` | `#7F8286` | 4,63 / 4,61 | **Hebt hervor.** Ausgewählte Zeile, betonte Abgrenzung. |
| `border-interactive` | `#0B5ED7` | `#5394FF` | 5,59 / 5,97 | **Trägt die Marke.** Fokus, aktiver Zustand. |

> Die Werte dieser Tabelle stammen aus der späteren, aus den Anforderungen abgeleiteten
> Neutralenskala und ersetzen die zuerst notierten Schätzwerte. Die Verhältnisse sind gegen
> `surface-base` gerechnet, nicht geschätzt.

Der Merksatz: *Eine Linie, die etwas trennt, ist ein Separator. Eine Linie, die etwas umschließt,
worauf der Zeiger wirkt, ist ein Control-Rahmen.* Er hat dieselbe Form wie die vorhandene
Radius-Regel, und das ist Absicht.

Die Neutralen tragen ein sehr geringes Chroma (0,008) im Farbton der Marke. Sie wirken dadurch
nicht farbig, binden die Skala aber an die Marke statt daneben zu stehen.

**Das Gate prüft künftig `border-control` gegen den Grund**, nicht `border-separator` — ein
Separator, der 3,0 erfüllen müsste, wäre keiner mehr. (Seit 30.09. prüft es `border-control` gegen
fünf Feldgründe, siehe unten.)

Dunkel angehoben, als der Button auf `surface-layer` gemessen wurde: dort erreichte `gray-49` nur
2,88.

**Nachgezogen 30.09. (Welle 2):** Das Gate prüfte `border-control` gegen den Grund, nicht gegen die
Feldfläche und nicht im Dialog. Gemessen verfehlte er hell auf `surface-field` (2,94) und dunkel auf
`surface-overlay` (2,79). Jetzt prüft die Paarliste jeden Rand eines Felds gegen fünf Gründe —
Feldfläche, Grund, Panel, verschachteltes Panel, Dialog —, und `border-control`, `status-error-border`,
`status-warning-border` sind je um die kleinste Stufe verschoben, die alle fünf trägt. Mitgemessen,
aber nicht in die Paarliste genommen: `surface-brand` auf `surface-overlay` hält hell 5,84 und dunkel
4,53 — der angekreuzte Kasten und der Primär-Button im Dialog heben sich also auch dort ab. Ob
`surface-overlay` grundsätzlich ins Kontrast-Gate gehört, bleibt die offene Frage für Welle 4 (Dialog).

`border-control` geht hell von `gray-35` auf das vorhandene `gray-36` (`#888B90`; knappstes Paar
3,10 auf `surface-field`), dunkel von `gray-45` auf die neue Stufe `gray-43` (`#75787D`; knappstes Paar
3,04 auf `surface-overlay`). `gray-35` hat damit keinen Leser mehr und ist aus `primitives.json`
entfernt. Dunkel liegen `border-control` und `border-emphasis` (`gray-39`) jetzt nur noch 1,15
auseinander; die Ordnung bleibt — Hervorhebung heller als Control-Rahmen —, `border-emphasis`
bleibt unverändert.

### Neutrale: nach Anforderung gestuft, nicht nach gleichem Abstand

**Der Befund zuerst.** Die Neutralen umfassen **30 Tokens, aber nur 15 verschiedene Werte** im
hellen Modus und 17 im dunklen. Die Hälfte sind unerklärte Dubletten:

| Wert | Tokens |
|---|---|
| `#FFFFFF` | `surface-base`, `color-surface`, `surface-layer`, `surface-layer-nested`, `layer-accent-icon`, `layer-accent-text`, `text-inverse` |
| `#F0F1F2` | `background-selected`, `surface-field`, `field-disabled`, `layer` |
| `#C4C7CC` | `border-subtle`, `surface-interactive-active`, `text-disabled` |
| `#676B72` | `text-helper`, `text-secondary` |

Im dunklen Modus sind `surface-field`, `layer` und `surface-layer-nested` derselbe Wert — **ein Eingabefeld ist von
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
| `text-helper` | `#64676B` (seit 09.10., vorher `#676A6F`) | `#93969B` | 4,5 auf vier Flächen (Grund 5,45), hell auch auf `surface-interactive-selected` | `surface-base`, `surface-layer`, `surface-layer-nested`, `surface-overlay` |
| `text-placeholder` | `#6B6E73` | `#8E9196` | 4,6 | **`surface-field`**, nicht Grund |
| `border-emphasis` | `#6F7277` | `#7F8286` | 4,6 | Grund |
| `border-control` | `#888B90` | `#75787D` | 3,0 | alle fünf Feldgründe (knappstes Paar hell `surface-field` 3,10, dunkel `surface-overlay` 3,04) |
| `border-separator` | `#C1C4C9` | `#34383C` | — | trennt nur |

**Nachgezogen 09.10. (Hendrik): Hilfetext hell eine Stufe dunkler, `gray-48` → `gray-49`.** Auf der ausgewählten Zeile
(`surface-interactive-selected`, `gray-7`) hielt `text-helper` hell nur 4,42; mit `gray-49` sind es 4,63, auf dem Grund
5,45 statt 5,20, und der Hilfetext bleibt heller als `text-secondary` (7,04). `gray-48` hat damit keinen Leser mehr und ist
gestrichen. Dunkel bleibt offen: dort verfehlen `text-helper` (3,64) und `text-secondary` (4,27) die ausgewählte Zeile,
und eine Stufe genügt nicht, ohne die Rangfolge Primär–Nebentext–Hilfe zu verwischen; entschieden wird, wenn ein Nebentext
in einer ausgewählten Zeile gebraucht wird. `derive` zieht die Stufe im Kundentheme mit (Probe `#6D6965` → `#6A6662`).
Als Test: `tokens.test.mjs` „hell: Hilfetext steht auch auf der ausgewählten Zeile“. Das Paar gilt nur für das
TopLogic-Theme: die Paarliste (`tools/lib/pairs.mjs`) kennt keine Paare je Modus, und dunkel verfehlt es das Paar
bewusst; ein Kundentheme aus `derive` hält es, solange seine Stufen nahe an unseren liegen (Probe 4,62), geprüft wird
es dort nicht.

`text-placeholder` und `border-emphasis` landen im hellen Modus dicht beieinander. Das sind
trotzdem zwei Tokens: Sie messen gegen **verschiedene** Flächen und würden auseinanderlaufen,
sobald sich eine davon ändert.

**Nachgezogen 30.09. (Welle 2, Formular):** Hilfetext steht unter einem Feld auch im Dialog; dunkel hielt `gray-36` dort 3,94 (verschachtelt 4,40). Jetzt gelten für `text-helper` und `text-secondary` dieselben vier Flächen wie für `text-primary`, und `surface-brand` schuldet dort 3,0 (Punkt, Kästchen). `text-helper` dunkel liest `gray-33` (`#93969B`; 5,99 / 5,52 / 5,06 / 4,54); `gray-36` bleibt für `border-control` hell. Die Marke als Vordergrund (Punkt, Kästchen) prüft ein eigener Test im Paket, nicht die Paarliste — für Kundenthemes bleibt diese Prüfung im derive-Bericht offen.

#### Flächen

| Token | hell | dunkel |
|---|---|---|
| `surface-base` | `#FAFAFA` | `#16181B` |
| `surface-layer` | `#FFFFFF` | `#1D2023` |
| `surface-layer-nested` | `#FFFFFF` | `#242729` |
| `surface-overlay` | `#FFFFFF` | `#2B2F33` |
| `surface-field` | `#F0F4F9` | `#27292D` |
| `surface-interactive-hover` | `#F0F2F6` | `#343A3F` (`gray-67`, seit 01.10.; davor `gray-73`) |
| `surface-interactive-selected` | `#E5E8ED` | `#393E42` (`gray-64`, seit 01.10.; davor `gray-69`) |
| `surface-interactive-active` | `#D9DDE3` | `#44484C` (`gray-60`, seit 01.10.; davor `gray-67`) |

**`surface-layer`, `surface-layer-nested` und `surface-overlay` bleiben im hellen Modus alle weiß — und das ist
diesmal richtig.** Über `#FAFAFA` liegt bis Weiß nur eine Stufe; drei Ebenen lassen sich dort durch
Helligkeit nicht ausdrücken. Im hellen Modus trennt deshalb der **Rahmen**, im dunklen die
**Fläche** — und der Schatten bleibt beiden vorbehalten, was wirklich über der Oberfläche schwebt.
Die Regel steht vollständig unter „Elevation".

Der Unterschied zum heutigen Zustand ist, dass es jetzt eine Regel ist statt eines Zufalls.

#### Ausgenommen

`text-disabled`, `icon-disabled`, `surface-disabled`, `border-disabled` sind von WCAG ausdrücklich
ausgenommen und schulden keinen Kontrast. Sie bleiben in der Skala, aber ohne Gate.

### Semantik: vier Bedeutungen, vier Rollen

**Der Befund.** `status-warning` ist im Stylesheet gleichzeitig Textfarbe (`color`), Rahmenfarbe
(`border-color`), Fläche (`surface-base`) und Akzentfarbe (`accent-color`). **Ein Token, vier
Aufgaben** — dasselbe Muster wie bei `text-on-brand` und `border-subtle`.

Die Folgen sind messbar:

| Token | auf hellem Grund | auf dunklem Grund |
|---|---|---|
| `status-warning` | **2,27** ✗ | 7,52 (geerbt, zufällig) |
| `status-success` | **3,04** ✗ | 5,61 (geerbt, zufällig) |
| `status-error` | 5,14 ✓ | **3,32** ✗ |

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
| **Fehler** | `text` | `#D7352D` | `#FF6053` | hell 4,53 auf Grund; dunkel 5,97 auf Grund, 5,49 auf Layer, 4,53 im Dialog |
| | `border` | `#F14F43` | `#DC3B32` | alle fünf Feldgründe: hell 3,39 auf Grund, 3,20 auf Feld; dunkel 3,99 auf Grund, 3,03 im Dialog |
| | `surface` | `#CC2823` | `#F14F43` | Beschriftung weiß 5,39 / dunkel 4,77 |
| | `subtle` | `#FFEBE8` | `#35110D` | Text darauf 14,71 / 15,27 |
| **Warnung** | `text` | `#936E00` | `#BD8F0F` | hell 4,50 auf Grund; dunkel 6,01 auf Grund, 5,53 auf Layer, 4,56 im Dialog |
| | `border` | `#B28600` | `#98720C` | alle fünf Feldgründe: hell 3,19 auf Grund, 3,02 auf Feld; dunkel 4,02 auf Grund, 3,05 im Dialog |
| | `surface` | `#D9A514` | `#EAB532` | Beschriftung dunkel 7,51 / 8,96 |
| | `subtle` | `#FEEFCF` | `#281C02` | 14,84 / 15,03 |
| **Erfolg** | `text` | `#008459` | `#3DA97B` | hell 4,53 auf Grund; dunkel 6,06 auf Grund, 5,58 auf Layer, 4,60 im Dialog |
| | `border` | `#36A376` | `#008459` | hell 3,02 auf Grund; dunkel 3,76 auf Grund, 3,46 auf Layer |
| | `surface` | `#3DA97B` | `#60C99A` | Beschriftung dunkel 5,75 / 8,29 |
| | `subtle` | `#DCF8E9` | `#0C2319` | 14,99 / 14,88 |
| **Info** | `text` | `#007F92` | `#1FA4BB` | hell 4,52 auf Grund; dunkel 6,00 auf Grund, 5,52 auf Layer, 4,55 im Dialog |
| | `border` | `#159FB6` | `#007F92` | hell 3,02 auf Grund; dunkel 3,77 auf Grund, 3,47 auf Layer |
| | `surface` | `#33C1DB` | `#33C1DB` | Beschriftung dunkel 7,87 / 7,87 |
| | `subtle` | `#CEF3FB` | `#002830` | 14,34 / 14,03 |

Dunkel angehoben, als der Button auf `surface-layer` gemessen wurde: Text steht auf Panels, nicht
nur auf dem Grund; alle vier lagen dort bei etwa 4,15. `status-error-text` wechselt dafür von
`red-37` auf `red-32` (nicht `red-35`, obwohl das auch reichen würde — `red-35` ist bereits
`status-error-surface` dunkel, dieselbe Fläche wäre dann Text und Füllung zugleich).
`status-warning-text` wechselt von `amber-40` auf `amber-34`, `status-success-text` von
`green-41` auf `green-36`, `status-info-text` von `teal-41` auf `teal-35` — jeweils die dunkelste
vorhandene Stufe der Familie, die auf `surface-layer` noch 4,5 erreicht; keine neue Stufe war
nötig. Die vier nun ungelesenen Primitive (`red-37`, `amber-40`, `green-41`, `teal-41`) sind aus
`primitives.json` entfernt. **… dasselbe für die Linien: alle vier lagen auf `surface-layer` bei
2,8.** `status-error-border` wechselt von `red-47` auf `red-42` (nicht `red-45` — das reicht mit
3,04 nur knapp und trägt bereits `status-error-surface-active`), `status-warning-border` von
`amber-49` auf `amber-44`, `status-success-border` von `green-51` auf `green-46`,
`status-info-border` von `teal-51` auf `teal-45`; die vier nun ungelesenen Primitive (`red-47`,
`amber-49`, `green-51`, `teal-51`) sind ebenfalls aus `primitives.json` entfernt.

**Nachgezogen 30.09. (Welle 2, Select):** Status-Text steht auch im Dialog (`surface-overlay`) — der
Ladefehler im Popup des Select ist der erste Fall; dort lagen alle vier dunkel bei 4,26–4,29 (Fehler
4,26, Warnung 4,29, Erfolg 4,28, Info 4,28). Jetzt gelten für Status-Text dieselben vier Flächen wie
für `text-primary` (`surface-base`, `surface-layer`, `surface-layer-nested`, `surface-overlay`),
festgeschrieben in der Paarliste. Die vier dunklen Rollen sind um die kleinste Stufe heller, die auf
allen vier hält (`aufKontrast`, Namen aus `naming.mjs`): `status-error-text` `red-32` → `red-31`
(neu), `status-warning-text` `amber-34` → `amber-32` (neu), `status-success-text` `green-36` →
`green-34` (vorhanden; hell ist es `status-success-surface` — anderer Modus, keine Doppelrolle),
`status-info-text` `teal-35` → `teal-34` (neu). `red-32` und `amber-34` sind ohne Leser und entfernt;
`green-36` und `teal-35` bleiben, die hellen Linien lesen sie. `surface-field` ist kein Grund für
Status-Text: der Fehlertext steht unter dem Feld, nicht darin.

**Nachgezogen 30.09. (Welle 2), Fehler und Warnung:** Ihre Linien umranden ein Feld und schulden 3,0
auf denselben fünf Gründen wie `border-control` (siehe „Rahmen: vier Stufen“). Gemessen verfehlten sie
hell auf `surface-field` (2,86 / 2,85) und dunkel auf `surface-overlay` (2,85 / 2,87). Je die kleinste
Verschiebung, die alle fünf trägt: `status-error-border` hell von `red-32` auf das vorhandene `red-35`
(`#F14F43` — dunkel ist `red-35` `status-error-surface`, aber in einem anderen Modus, also keine
Doppelrolle), dunkel von `red-42` auf die neue Stufe `red-41` (`#DC3B32`); `status-warning-border` hell
von `amber-34` auf die neue Stufe `amber-36` (`#B28600` — `stufe()` ergibt 35, `amber-35` ist belegt,
darum rückt sie auf), dunkel von `amber-44` auf die neue Stufe `amber-43` (`#98720C`). Erfolg und Info
bleiben, bis ein Feld sie als Rand trägt. Nebenwirkung in `derive`: Ein Kunde, der nur `red-42` liefert,
bekommt dunkel `red-41` gerechnet — kein Befund, denn Gerechnetes hält die Paarliste.

**Nachgezogen 07.10. (Welle 3b), Linien auf der ausgewählten Zeile:** Ein Zelleditor ist randlos; seine Fehler- oder
Warnlinie steht direkt auf `surface-interactive-selected` bzw. `-hover`. Gemessen: Fehler 2,88 hell / 2,43 dunkel,
Warnung 2,71 / 2,44. Lösung: **Tausch der Stufen zwischen den Modi plus eine neue Stufe.** Hell nimmt
`status-error-border` `red-41` (3,63 ausgewählt / 3,97 Zeigen / 4,45 Layer), `status-warning-border` `amber-43`
(3,60 / 3,95 / 4,42); dunkel nimmt `status-warning-border` `amber-36` (3,25 / 3,46 / 4,91) und `status-error-border`
die neue Stufe **`red-34`** (`#F2554A`; 3,18 / 3,39 / 4,81). Der reine Tausch hätte dunkel `red-35` gegeben — das ist
dort `status-error-surface`, also Rand und Fläche in einem Modus aus einem Primitiv: die Doppelrolle, die diese Datei
ausschließt. `red-34` liegt eine Stufe heller und trägt nur den Rand. Verworfen: die Doppelrolle hinnehmen (das
Muster „ein Token, mehrere Aufgaben“, das alle bisherigen Kontrastmängel erzeugt hat); nur die Fehlerlinie paaren
und die Warnlinie offen lassen (derselbe Zelleditor, dieselbe Zeile). Gate: beide Linien auf ausgewählt und Zeigen
in der Paarliste, beide Modi, jedes Theme; das Probe-Theme bleibt byte-identisch.

**Die Regel, wann welche Rolle gilt:**

> *Ein Zustand, der als **Text** erscheint, nimmt `text`. Eine Linie, die ihn trägt, nimmt
> `border`. Eine gefüllte Fläche nimmt `surface` — die Beschriftung darauf wird abgeleitet, nie
> geschrieben. Ein getönter Hinweisstreifen nimmt `subtle` und trägt gewöhnlichen Text.*

**Die Beschriftung auf einer Semantikfläche wird abgeleitet**, nach derselben Regel wie auf der
Marke. Die Snackbar hatte hier ihren Fehler (weiße Schrift auf Erfolg); seit Welle 4a ist sie ein getönter Alert
und trägt gewöhnlichen Text (siehe „Welle 4“).

#### Zwei Anmerkungen

**Warnung als Text ist notwendig dunkel** (`#936E00`). Bernstein erreicht auf hellem Grund erst bei
dieser Tiefe 4,5 — was hell genug wäre, um „Bernstein" zu heißen, ist unlesbar. Die helle,
erkennbare Warnfarbe lebt deshalb in `surface`, nicht in `text`.

**Info stand zuerst im Farbton der Marke** (260°); warum es ins Türkise gewandert ist, steht unter
„Gelöst: Info verlässt den Markenton".

**Ergänzt für den Button:** `status-error-surface` bekommt `-hover` und `-active` nach der
Rampenregel der Marke, mit abgeleiteter Beschriftung. Die übrigen Bedeutungen bleiben ohne Rampe,
bis eine Komponente sie als bedienbare Fläche braucht.

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
| `tl-type-display` | 32 | 600 | 1.25 | −0.01em | Login, Leerbild, Report-Deckblatt |
| `tl-type-heading-lg` | 24 | 600 | 1.3333 | −0.005em | Seitentitel |
| `tl-type-heading-md` | 20 | 600 | 1.4 | 0 | Dialogtitel |
| `tl-type-heading-sm` | 16 | 600 | 1.5 | 0 | Abschnittstitel, Gruppenrahmen |
| `tl-type-body` | 14 | 400 | 1.4286 | 0 | alles Gelesene |
| `tl-type-body-strong` | 14 | 600 | 1.4286 | 0 | Hervorhebung im Fließtext, aktive Zeile |
| `tl-type-label` | 12 | 400 | 1.3333 | +0.01em | Feldbeschriftung, Hilfstext, Badge |
| `tl-type-label-strong` | 12 | 600 | 1.3333 | +0.01em | Spaltenkopf, Registerreiter |
| `tl-type-code` | 14 | 400 | 1.4286 | 0 | TL-Script, XML, Stacktrace |

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
Familie per `size-adjust` metrisch angeglichen, statt `tl-type-code` eine Stufe kleiner zu setzen —
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
* **Vier verschiedene Fokusfarben:** `--tl-focus-ring`, `--interactive`, `--tl-status-warning`,
  `--tl-status-error`, dazu `currentColor`.
* **`2px dashed`** steht zweimal neben 29-mal `solid`.

#### Die Entscheidung

| | Wert |
|---|---|
| Mechanismus | `outline`, immer außen |
| Breite | `2px` |
| Offset | `2px` |
| Stil | `solid`, ausnahmslos |
| Farbe | `focus-ring` — hell `#0B5ED7`, dunkel `#5394FF`, dieselbe Farbe wie `border-interactive` |
| Auslöser | `:focus-visible`, ausnahmslos |

**Ein Mechanismus, keine Ausnahme.** Die vier anderen fallen weg. `outline` folgt in allen aktuellen
Browsern dem `border-radius` von selbst, wird nicht vom Layout eingerechnet und liegt über allem —
drei Eigenschaften, die ein `box-shadow`-Nachbau je einzeln nachstellen müsste.

**Der Offset ist nicht Kosmetik, sondern der Grund, warum der Ring auf der Marke sichtbar bleibt.**
Läge der Ring an der Kante, verschwände ein blauer Ring auf einer blauen Schaltfläche. Zwei Pixel
Luft setzen ihn auf die dahinterliegende Fläche, wo er gegen `surface-base` oder `surface-layer` seinen
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

**Nachgetragen 16.10. — gemessen statt gelesen.** Die Regel „kein `overflow: hidden` an einem Behälter mit
fokussierbaren Kindern“ ist als Text zu grob und zu eng zugleich. Zu grob: fast alle Stellen, die sie im
Specimen trifft, schneiden nichts — Zelle, Kopfzelle und Popup haben genug Innenabstand, und ihr `hidden` trägt
die Ellipse oder die Ecken. Zu eng: ein Rollbehälter (`overflow: auto`) schneidet genauso, und der Baum hätte
den Ring seines Umschalters links abgeschnitten, wäre der Umschalter je fokussierbar. Darum **misst**
`focus-clip.test.mjs` im Browser (Chrome ohne Fenster, über das DevTools-Protokoll, keine npm-Abhängigkeit):
jede Specimen-Seite, beide Dichten, jedes fokussierbare Element einmal mit Tastaturfokus. Reicht der Ring
(`outline-offset` + `outline-width`) über die Kante eines Vorfahren, der schneidet (`overflow` nicht `visible`;
`clip` zählt seinen `overflow-clip-margin`), ist das ein Befund. Ausgenommen ist, wohin Tastaturfokus nie kommt
(`tabindex="-1"` unter `aria-activedescendant`: der Cursor ist virtuell), und das Gerüst der Specimen-Seite
(Vorfahren ohne `tl-`-Klasse). Fehlt Chrome, scheitert der Test (`TL_CHROME` nennt ihn) — ein Gate, das still
besteht, prüft nichts.

**Was die Messung fand:** die leere Tabelle. Ihr Vertrag versprach „ohne Cursor zeigt das Raster den Ring
selbst“, und `tl-table` (`overflow: hidden`) schnitt ihn auf allen vier Seiten ab — der Fokus war unsichtbar
(WCAG 2.4.7). Ebenso der Rollkörper und die Spaltenwahl in der Ecke (rechts und oben). **Was bündig an der
schneidenden Kante liegt, trägt den Ring innen** (`outline-offset: calc(-1 * var(--tl-focus-offset))`) —
dieselbe Form wie das Feld in der Zelle und der Cursor-Ring. `clip` mit Rand wäre hier keine Lösung: der Ring
ragte über die Tabelle hinaus in einen Nachbarn, der seinerseits schneiden kann.

**Verworfen:** die Textregel als Lint-Regel über die Specimen-Struktur (fände die falschen und nicht den
Baum); die Messung nur für `overflow: hidden` (Rollbehälter schneiden gleich).

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
Endlos-Animationen und sind keine Übergänge. **Nachgetragen (24.09., Progress):** „stehen bei ihrer
Animation“ hieß Literal, und das Klassen-Gate lässt kein Dauer-Literal zu — zu Recht. Endlos-Animationen
lesen deshalb eine vierte Dauer, `duration-loop` = 1200 ms (`dur-4`): ein Durchlauf des Schwungs im
Fortschrittsbalken, eine Umdrehung des Spinners. Vier Dauern, nicht acht; die vierte ist keine
Übergangsdauer und steht in keiner `transition`.

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

### Zwei Schichten: Primitive und Rollen

**Der erste Entwurf der Skala schrieb Hex-Werte direkt an die Rollen — und reproduzierte damit genau den Befund, den er beseitigen sollte.** Bei den Neutralen stand als Kritik: *30 Tokens, aber nur 15 verschiedene Werte.* Gemessen an der neuen Skala:

| Wert | Rollen, die ihn als Literal trugen |
|---|---|
| `#0B5ED7` | `border-interactive`, `focus-ring`, `surface-brand`, `text-link` |
| `#004DBA` | `surface-brand-hover`, `text-link-hover` |
| `#FFFFFF` | `surface-layer`, `surface-layer-nested`, `surface-overlay` |

Der Markenton ist **ausdrücklich vorläufig**. Bei einem Wechsel wären vier Stellen von Hand nachzuziehen, und die vergessene fünfte wäre genau der Vererbungsfehler, der die acht Dunkel-Verstöße erzeugt hat.

Die Skala hat deshalb zwei Schichten:

| Schicht | Beispiel | Regel |
|---|---|---|
| **1 · Primitive** | `blue-49: #0B5ED7` | reine Werte. Der Name nennt Familie und Helligkeitsstufe und behauptet **nichts** über eine Rolle. |
| **2 · Rollen** | `surface-brand: {blue-49}` | Bedeutung. **Kein einziger Wert**, nur Referenzen. |

70 Farb- und 30 Maß-Primitive tragen 80 Rollen je Modus.

**Warum das mehr ist als Ordnung: Es ist die Eingriffsstelle für Kundenprojekte.** Ein Kunde, der seine Hausfarbe einsetzen will, schreibt sie als Primitive in seine JSON — `derive` rechnet daraus die Rollen (`surface-brand`, `text-link`, `focus-ring`, `border-interactive` und was daran hängt) und schreibt sie als Werte in seine Theme-Datei. Keine Klasse wird angefasst, und keine Rolle wird vergessen, weil die Referenzen sagen, welche mitziehen muss.

Im Paket selbst **löst das erzeugte CSS die Referenzen nicht auf**: In `tokens.css` steht `var(--tl-blue-49)`, nicht `#0B5ED7`, weil die Primitivschicht der Ort der Werte ist und die Rollenschicht nur auf sie zeigt — eine Datei, zwei Schichten, an einer Stelle geändert. Aufgelöst wird nur zum Rechnen, wo Kontraste echte Werte brauchen.

**Eine Ausnahme, benannt:** Die Beschriftungen auf Flächen (`--tl-text-on-*`, `--tl-icon-on-*`) stehen als gerechnete Hex-Werte in `tokens.css`. Ändert ein Kunde nur den Markenton, folgt `surface-brand` über die Referenz, die Beschriftung darauf aber nicht — auf einer hellen Hausfarbe wäre Weiß unlesbar. Deshalb rechnet `derive` (Kundenstufe A) die Beschriftungen mit und schreibt sie in eine Datei, die **nach** `tokens.css` geladen wird. Die Ladereihenfolge ist Teil des Kundenvertrags, nicht Kosmetik.

Die Primitivnamen werden **abgeleitet, nicht vergeben** (`design-system/tools/lib/naming.mjs`): Familie aus dem Farbton, Stufe aus der Helligkeit, wobei eine höhere Stufe dunkler ist. Kollidieren zwei Werte auf derselben Stufe, rückt der zweite auf — sonst hinge die Zuordnung an der Reihenfolge, in der die Werte hereinkommen.

**Vier Regeln setzt das Gate durch:** kein Hex in der Rollenschicht, jede Referenz zeigt auf ein vorhandenes Primitiv, kein Primitiv steht ungenutzt herum, und kein Primitivname enthält ein Rollenwort. Dazu ein Test, der einen Kundentausch durchspielt und prüft, dass alle vier markenbezogenen Rollen mitziehen.

### Kategorien folgen der Marke: eine Anforderung an `derive`

Die acht Kategorien liegen heute als feste Farbtöne in `primitives.json` (2°, 56°, 123°, 186°, 238°,
285°, 311°, 337°), gerechnet um unsere Marke bei 260° und die vier Bedeutungen bei 28°, 85°, 162°,
213°. Bringt ein Kunde in Stufe A eine eigene Marke mit, wandert ihr Punkt auf dem Kreis — ein
orangefarbenes Logo läge bei 56° auf Kategorie 2, und das Gate schlüge an, obwohl der Kunde nichts
falsch gemacht hat.

**Entschieden:** `tl-ds derive` verteilt die acht Kategorien um die Kundenmarke neu, nach derselben
Regel wie bei uns — mindestens 20° zueinander, zur Marke und zu jeder Bedeutung, Fläche und Linie auf
denselben Helligkeiten (`subtle` L 0,955 hell / 0,27 dunkel, `border` der hellste Wert mit 3,0 auf
beiden Gründen). Die vier Bedeutungen bleiben, wo sie sind: Rot, Gelb, Grün und Cyan beziehen ihre
Bedeutung aus dem Farbton, sie folgen keiner Marke. Liegt die Marke selbst näher als 20° an einer
Bedeutung (ein rotes Logo), meldet `derive` das als Befund und rechnet trotzdem; der Kunde entscheidet
in Stufe B, ob seine Fehlerfarbe ein anderes Rot wird. Der Test `tokens.test.mjs` „Kategorien trennen
sich“ läuft dann über die erzeugten Primitive genauso wie über unsere.

**Wie verteilt wird:** Die Lücken zwischen den festen Tönen (Marke, vier Bedeutungen, gelieferte
Kategorien) bekommen reihum den nächsten Punkt, immer die Lücke, in der der Abstand danach am
größten bleibt; die Punkte einer Lücke liegen gleichmäßig. Reicht der Kreis nicht für 20°, sinkt
der Abstand in 2°-Schritten, und das steht als Hinweis im Bericht. Neu verteilt wird nur, wenn die
Eingabe Farbe anfasst: `color.brand`, `color.gray` oder `color.category`. Eine Datei, die
ausschließlich `font` oder `measure` ändert, lässt jede Farbrolle in Ruhe.

**Verworfen:** Kategorien als feste Werte auch für Kunden (kollidieren mit jeder Marke, die nicht
blau ist); Kategorien aus der Marke ableiten (acht Abstufungen einer Hausfarbe sind nicht
unterscheidbar — die Kategorien müssen den ganzen Kreis nutzen, gerade weil die Marke einen Ton
davon besetzt).

Bild: `docs/bilder/farbkreis-13.svg` — die dreizehn Punkte mit ihren Abständen.

### Themes: eine dritte Achse, nicht ein Tausch

**Entschieden (24.09.): Ein Theme ist ein Attribut am `html`, `data-tl-theme="<id>"`, neben `data-tl-mode` und `data-tl-density`. Mehrere Themes stehen in einer Anwendung nebeneinander, der Nutzer wählt.**

Die Spec vom 17.09. kennt den Kunden nur als Tausch: `customer.primitives.css` nach `primitives.css` geladen, auf `:root`, für alle Nutzer. Das reicht für eine Installation mit einem Look. Es reicht nicht für den Fall, der gebraucht wird: eine TopLogic-Anwendung mit dem TopLogic-Theme **und** einem oder mehreren Kundenthemes, zwischen denen umgeschaltet wird.

**Was die Engine heute kann**, und was dabei nicht verloren gehen darf: `UIThemeService` (tl-engine-7, `com.top_logic.layout.react.theme`) führt beliebig viele benannte Themes aus XML mit `extends`-Vererbung und `color-scheme` je Theme, speichert die Wahl je Person (`PersonalConfiguration`, Schlüssel `react.theme`), folgt ohne Wahl dem Betriebssystem und schreibt jedes Theme als `<style>`-Block unter `[data-theme="<id>"]`. Die Demo-App zeigt damit vier Themes: `default`, `dark`, `flat`, `glass`. Die Werte darin sind die alten Rollen und fallen mit ihren Wellen; die Mechanik der Auswahl bleibt richtig.

**Was das Paket heute kann:** zwei Achsen. `tokens.css` kennt `[data-tl-mode]` und `[data-tl-density]`, sonst nichts. Der Test in `layers.test.mjs` spielt den Tausch *einer* Primitive durch; Koexistenz zweier Wertesätze prüft niemand.

**Die Regel:**

| | |
|---|---|
| Achse | `data-tl-theme="<id>"` am `html`. Ohne Attribut gilt das TopLogic-Theme; es steht auf `:root`. |
| Kundentheme | eine erzeugte Datei je Theme, `<id>.theme.css`, Selektoren `[data-tl-theme="acme"]` und `[data-tl-theme="acme"][data-tl-mode="dark"]`, geladen nach `tokens.css`. Sie trägt **Rollen mit Werten**, nur die, die von TopLogic abweichen; beide Blöcke dieselben Farbrollen. `derive` schreibt sie aus `acme.primitives.json`. |
| Beschriftungen | `--tl-text-on-*` und `--tl-icon-on-*` werden je Theme × Modus gerechnet; darum sind sie die Datei, nicht der Kunde. |
| Gate | Die Paarliste (`tools/lib/pairs.mjs`) läuft über das Ergebnis. Gerechnete Werte bestehen sie immer, notfalls durch Nachführung in der Helligkeit, mit Hinweis; gelieferte dürfen sie verfehlen, der Befund steht im Bericht und im Dateikopf, `--strict` macht ihn zum Fehler. |
| Engine | `UIThemeService` setzt künftig `data-tl-theme` statt `data-theme` und behält Nutzerwahl, Vererbung und Systemfolge. Vererbung wird zur Frage an `derive`, nicht an CSS: Was das Kundentheme nicht setzt, bleibt beim Wert von `:root`, weil die Kaskade es so löst. |
| Ort der Definition | im Paket als JSON, nicht in XML. Die XML-Tokenkonfiguration entfällt mit den Wellen (Spec §4). Wie die Engine die Liste der verfügbaren Themes erfährt, entscheidet die Welle, die `derive` bringt. |

**Warum ein Attribut:** Zustände sind Attribute, nicht Klassen — das gilt bereits für Modus und Dichte. Ein Theme ist ein Zustand der Seite. Die Klassen bleiben unberührt; keine liest ein Theme, jede liest Rollen — der Eingriff steht unter einem Selektor statt auf `:root`. (Dass er die Rollen trägt und nicht die Primitive, ist die Korrektur vom 25.09. weiter unten.)

**Verworfen:** ein Kundentheme, das TopLogic ersetzt (die Spec-Fassung: kann nicht umschalten, und eine Kundeninstallation verliert die Referenz, wie TopLogic aussieht); ein Theme je Datei-Ladereihenfolge (welches CSS zuletzt geladen wird, ist kein Nutzerzustand); Themes als Klassen am `body` (bricht die Attributregel und die Vor-dem-ersten-Paint-Logik, die `UIThemeService` schon am `html` setzt); Rollen je Theme in `tokens.json` (jedes Kundentheme wäre eine Änderung am Paket — genau das schließt der Kundenvertrag aus).

**Korrektur (25.09.): Rollen statt Primitive, Befund statt Verbot.** Die Familie `blue` trägt die Marke und die Kategorien 5 und 6 zugleich — eine Familie ist keine Rolle, und `derive` kann keine „Markenfamilie“ ersetzen. Rollennamen sind der Vertrag, Stufennamen sind intern: eine Rollen-Datei überlebt jede Umnummerierung, eine Primitiv-Datei verlöre die Marke lautlos. Und ein Kunde mit eigenem Styleguide bekommt seinen Styleguide, mit Hinweis: Was er schreibt, gilt; nur was wir rechnen, muss die Paarliste bestehen. Verworfen bleibt, was oben verworfen ist. Spec: `2026-09-25-derive-design.md`.

**Als Test (`derive.test.mjs`):** aus `test/fixtures/probe.primitives.json` entsteht das Theme `probe`; geprüft wird, dass die Datei genau die abweichenden Rollen trägt, beide Blöcke dieselben Farbrollen, `:root` und `dist/` unberührt, jede gerechnete Rolle die Paarliste besteht, die Kategorien 20° halten, der gelieferte Wert unter AA in Datei und Bericht steht und `--strict` ihn ablehnt. Der bestehende Tausch-Test bleibt und wird zum Test des Falls „ohne Attribut".

**Was dadurch offen wird:** Spec §2 „Wurzel" nennt zwei Attribute und §3 Stufe A eine Datei auf `:root`; §3 Stufe A ist mit der Spec vom 25.09. fortgeschrieben, §2 folgt mit der Engine-Welle. Issue #13 (Kunden-Theming ohne Issue) ist damit für den Scope-Teil beantwortet.

### Zwei Wege, kein dritter: Shell oder Headless

**Entschieden (25.09.): Wer TopLogic 8 als Shell nutzt, hält den Draht-Teil unserer Verträge ein — gleich, welche Komponentenbibliothek er mitbringt. Wer das nicht will, bindet sein eigenes Frontend headless über die REST-/OpenAPI-Schnittstelle an. Einen dritten Weg gibt es nicht, und einen Schalter, der das UI-System abschaltet, gibt es nicht.**

**Der Anlass.** Ein Kunde wie Mercedes-Benz bringt MBUI mit (Material-basiert), eigene React-Komponenten und eigene Styles. Die naheliegende Idee: eine Option in den Admin-Einstellungen, die das tl-UI-System abschaltet, wenn der Kunde „alles“ selbst mitbringt; was dann nicht läuft, ist sein Risiko.

**Der Befund in der Engine.** Der Server schickt `{ module: 'TLButton', state: { label, disabled, … } }`; `TLChild` holt die Komponente aus der Registry (`registry.ts`: eine Map, der letzte `register` gewinnt); Aktionen gehen über `sendCommand` zurück. `controls-entry.ts` registriert 77 Controls, darunter Grid, Stack, Deck, Dialog-Manager, Sidebar — Container, nicht nur Blätter. Tastatur, Fokusfalle, Dialog-Stapel und Drag & Drop leben in der Bridge; die Skript-Aufzeichnung (`ReactOptionByLabelNaming`, `ModelResolver`) liest unser DOM. Skripte und Stylesheets sind eine benannte Liste mit `requires` in `tl-layout-react.conf.config.xml`.

**Warum kein Schalter:**

* Er schaltet die falsche Schicht ab. Ein Schalter kann CSS weglassen; der Draht — Zustand rein, Kommando raus, Stapel bedienen — bleibt, weil der Server die Oberfläche treibt.
* Er wäre erst bei 77 von 77 ersetzten Controls wahr. Vorher steht jedes nicht ersetzte Control nackt da, und das Layout-System gehört zu den 77.
* „Aus“ ist kein garantierbarer Zustand. Eine Update-Garantie braucht etwas, wogegen man prüfen kann, und das ist ein Vertrag.

**Der Vertrag hat zwei Hälften.** Bisher listet `*.contract.md` vier Dinge gleichrangig. Ab jetzt sind sie geteilt:

| | Inhalt | Wer es braucht |
|---|---|---|
| **Muss** | Zustand vom Server, Aktionen zurück; für Dialoge und Overlays der Stapel der Bridge | jeder, der die Komponente unter dem TopLogic-Namen registriert |
| **Kann** | Tokens, damit sie ins Bild passt; Attribute für Tastatur und Fokus; Attribute, die die Skript-Aufzeichnung liest | wer Mischbetrieb, Dichte oder aufgezeichnete Tests will |

Der Konformitätstest prüft nur das Muss, und er ist das Werkzeug des Kunden, nicht unser Gate: Er läuft vor seinem Deploy und zeigt, was ein Framework-Update gebrochen hat. TopLogic garantiert die Bridge — Registry, Kommandokanal, Ereignisse — und dass der Zustand so kommt, wie der Vertrag sagt. Nicht das Aussehen, nicht die Aufzeichnung ohne die Kann-Attribute.

**Die zwei Wege:**

| | Shell | Headless |
|---|---|---|
| Schnittstelle | Control-Protokoll: Registry, Zustand, Kommandos | REST / OpenAPI |
| Der Kunde bringt | Komponenten, die das Muss erfüllen — MBUI, MUI, was er will | das ganze Frontend |
| TopLogic liefert | Layouts, Formulare, Dialoge, Validierung, Rechte, Skript-Tests, Theming | Daten, Modell, Rechte, TL-Script-Logik |
| Garantie beim Update | Vertrag bleibt stabil; der Konformitätstest zeigt Brüche vor dem Deploy | API bleibt stabil; die UI ist nicht unser Thema |

Die Grenze liegt nicht zwischen flexibel und unflexibel, sondern zwischen „hat einen Vertrag“ und „hat keinen“. Die Einschränkung im Shell-Weg ist klein: Sie betrifft den Draht, nicht Aussehen, CSS oder Bibliothek. Wer sich an ihr stört, stört sich daran, dass der Server die UI treibt — und genau das ist die Leistung des Shell-Wegs. Wer das nicht will, ist auf dem Headless-Weg richtig.

**Was das für Stufe C heißt:**

* Stufe C ist der Shell-Weg mit fremder Bibliothek. Sie steht auf Stufe A oder B: Was der Kunde nicht ersetzt, bleibt TopLogic und sieht über seine Tokens trotzdem nach ihm aus. Mischbetrieb ist der Normalfall, nicht die Ausnahme.
* Paket statt Schalter. Das Kundenmodul deklariert seine Skripte und Stylesheets in seiner `config.xml` und ersetzt benannte Einträge unserer Liste — `tl-design-system-components`, wenn nichts mehr davon gelesen wird. `tokens.css` und `base.css` bleiben, solange ein TopLogic-Control im Baum steht.
* Ein Theme darf ein UI-Paket benennen. `UIThemeService` kennt Themes; die Wahl im Admin lädt die Seite mit dem anderen Bundle. Damit lässt sich während einer Migration zwischen TopLogic und Kundenpaket wechseln, ohne dass „aus“ je ein Zustand ist.
* Für Material: React kommt aus `tl-react-bridge`, MUI und Emotion bündelt der Kunde (!1618 zeigt, was ein zweites React anrichtet). Ein Adapter füttert `createTheme` aus unseren Rollen, als Hex je Modus zur Bauzeit, weil MUI `contrastText` selbst rechnet. Dichte kennt MUI nicht; das bleibt beim Kunden.

**Als Bild (25.09.): drei Kacheln wie eine Preistafel.** Links „TopLogic mit eigener Marke“ (Stufe A, B), Mitte „TopLogic mit eigenen Komponenten“ (Stufe C), rechts „eigenes Frontend, headless“. Komplexität steigt von links nach rechts, Garantie sinkt von links nach rechts, jede Kachel hat genau einen Vertrag. Zwei Beschriftungen sind bewusst anders als bei einer Preistafel: Links ist nicht „wie ausgeliefert“, weil Hausfarbe, Grau und Schrift über `derive` zur kleinsten Stufe gehören; und rechts fehlt die Garantie nicht, sie endet an der API. Und „empfohlen“ steht auf keiner Kachel: Die Kachel wählt, was der Kunde mitbringt, nicht, was er will — links ist der Regelfall. Folie 13b, Übersicht §2b.

**Verworfen:** der Admin-Schalter (falsche Schicht, erst bei 77/77 wahr, kein prüfbarer Zustand); Shell ohne Draht als geduldeter dritter Weg (nicht garantierbar, nicht testbar, jedes Update ein Blindflug); ein Java-Port des Konformitätstests (der Vertrag ist ein Client-Vertrag und wird im Client geprüft).

**Nicht verifiziert:** ob ein Kundenmodul über TypedConfiguration einen benannten Listeneintrag der `ClientResources` ersetzen oder entfernen kann — der erste Engine-Punkt der Umsetzung. Und wie vollständig der Headless-Weg ist: Der Skill `toplogic-react-frontend` (OpenAPI-Server über TL-Script, Dev-Proxy, Auth-Naht) belegt, dass er gegangen wurde; ob Rechte, Paging, Dateien und Ereignisse für eine echte Anwendung reichen, sagt nur, wer die Projekte gemacht hat.

**Als Test:** jeder `*.contract.md` trägt die Abschnitte „Muss“ und „Kann“; ein Konformitätstest-Harness mountet eine registrierte Komponente mit dem Zustand aus dem Vertrag und prüft die Aktionen; unsere eigenen Controls bestehen ihn zuerst. Ein Referenzprojekt registriert `TLButton` und `TLDialog` auf MUI-Basis, folgt `data-tl-mode` und besteht die Verträge. Spec: `2026-09-25-ui-paket-design.md`; Plan: `docs/superpowers/plans/2026-09-25-ui-paket.md`. **Fortgeschrieben am 28.09.** in „Ein Vertrag, zwei Hälften“: der Zustand kommt aus `state.proto` (#29643), das Referenzprojekt lebt im Framework.

### Ein Vertrag, zwei Hälften: der Zustand ist Proto, der Rest ist Prosa

**Entschieden (28.09.): Der Muss-Teil „Zustand“ eines Vertrags ist die msgbuf-Nachricht in `state.proto` (#29643, !1698) — eine Quelle für Java und TypeScript, vom Build geprüft. `<name>.contract.md` trägt, was Proto nicht sagen kann: die Aktionen und den Stapel als Konformitätsfälle, den Kann-Teil (Rollen, Attribute, Aufzeichnung) und die Konformität. Die Ersetzung läuft über `replace()` und `registerRootWrapper()`, nicht über die Reihenfolge der Skripte. Das Referenzprojekt lebt im Framework neben `demo.react.corporate`. Und die Theme-Richtung bleibt: `derive` ist die Quelle, ein fremdes Theme wird aus den Rollen gerechnet, nie umgekehrt.**

**Der Anlass.** Bernhard hat am 24./25.09. mit #29643 dieselbe Fläche bearbeitet wie unsere Spec `2026-09-25-ui-paket-design.md`: eine Kundenbibliothek als Darstellungsschicht unter dem Komponentenvertrag. Sein PR !1698 bringt drei Dinge, die wir in der Spec erst vorhatten oder schwächer hatten: `state.proto` mit 14 Zuständen und `TestControlStateSchema` (jeder gesendete Schlüssel ist deklariert, jeder Java-Enum-Name steht im Schema); `replace(name, component)`, das gegen `register` immer gewinnt und Doppelungen meldet — unsere Spec §3a stützte sich auf „letzter `register` gewinnt“ plus `requires`-Reihenfolge, und das ist fragil; ein Beispielmodul mit Maven-Profil, das in der echten Demo läuft — unser `examples/` außerhalb des Builds wäre schwächer gewesen. Dazu das Sammelticket #29650 „TopLogic UI on MUI“ mit zwölf Untertickets: Richtung 1 ergänzt Komponenten, die MUI hat und TopLogic nicht; Richtung 2 baut ein MUI-Adaptermodul (#29661) und macht das MUI-Theme zur Quelle der TL-Tokens (#29662).

**Der Befund in seinem PR.** Die Mechanik ist richtig, die Wertschicht fehlt. `tl-demo-react-corporate.css` nennt sich im Kopf „independent of the TopLogic theme tokens“ und trägt `#fff`, `#b42318`, `#fee4e2`, `outline: none` am Fokus und Deckkraft 0,45 für disabled: kein Dunkelmodus, kein Kontrast-Gate, ein fremder Fokusring. Stufe 1 seines Leitfadens („Theme aus den Tokens des Kunden“, `<theme extends="default">`) ist das alte Theme-System, das der Schnitt vom 17.09. abschneidet, und sie tut für diesen Button nichts. Sein `BrandButtonAdapter` hält den Draht vollständig ein — `useKeyboardBinding`, `rootClassName`, Tooltip-Attribute, `hidden` rendert nichts — aber aus Kenntnis der Bridge, nicht aus einem Vertrag; ein Kunde ohne diese Kenntnis hat nur die Feldkommentare der Proto-Datei. Und die 19 Zustands-Drafts im Review-Kommentar sind aus dem alten Code abgeleitet: `TextState.color` ist dort „the CSS color … drawn as a pill in that color“, was !1694 mit `colorRole` gerade abgeschafft hat. Ohne das Paket als Quelle reproduziert sich der Altbestand von selbst.

**Warum Proto den Zustand trägt:** Zwei Beschreibungen desselben Drahts driften — die Drafts belegen es innerhalb eines Tages. Proto ist die, die der Build prüft; eine Markdown-Tabelle prüft niemand. Was Proto nicht kann, bleibt bei uns: welche Kommandos ein Auslöser sendet und was bei `disabled` schweigen muss (Konformitätsfälle, vom Harness ausgeführt); welche Rollen eine Ersatzkomponente liest, damit sie ins Bild passt; welche Attribute Tastatur, Fokus und Skript-Aufzeichnung brauchen. `TestControlStateSchema` prüft den Server; der Harness prüft die Kundenseite. Beides zusammen ist die Update-Garantie.

**Warum die Theme-Richtung bleibt:** #29662 dreht die Abhängigkeit um — dann bestimmt ein MUI-Theme den Look auch für Kunden, die kein MUI haben, und Paarliste, Kontrast-Gate und gerechnete Beschriftungen (`text-on-brand`) gelten nicht mehr, weil MUI `contrastText` selbst rechnet und niemand es prüft. Die Richtung ist: Hausfarbe und Grauwahl → `derive` → Rollen → `roles-to-mui` als Hex je Modus zur Bauzeit → `createTheme`. Eine Quelle, ein Gate, und die Bibliothek folgt `data-tl-mode` und `data-tl-theme` wie jedes TopLogic-Control.

**Warum Beweis statt Argument.** Bernhard liest Code und Tickets; die Doku des Pakets ist für ihn Prosa („Na gut — wir werden sehen, wo's hinführt“, Approval auf !1694). Also drei Commits auf seinem Branch statt eines Absatzes hier: sein Stylesheet liest die Rollen des Pakets, und Dunkelmodus und ein `derive`-Theme wirken auf seine Bibliothek ohne `<theme extends>`; `outline: none` fällt, der Ring kommt aus `base.css`; ein Vitest-Fall mountet seinen Adapter mit dem Zustand aus dem Draht und prüft, dass `click` ankommt und `disabled` mit Tastengeste schweigt — grün, weil er es richtig gemacht hat, und der Keim des Harness. Dann der Kommentar in #29650.

**Was das für die Spec `2026-09-25-ui-paket-design.md` heißt:** §3a ersetzt „letzter `register` gewinnt“ durch `replace()` und den Wurzel-Wrapper; §4 macht `### Zustand` zu einem Verweis auf die Proto-Nachricht; §5 liest das Schema aus `react-src/state/control-state.ts` und die Fälle aus `## Konformität`; §6 `examples/mui-adapter/` entfällt und wird #29661 im Framework, nur `roles-to-mui.mjs` bleibt im Paket, weil es `dist/tokens.css` liest; §3b Ressourcen-Override und §3c Theme benennt Paket bleiben, weil !1698 beides nicht hat. Neue Komponenten aus #29650 Richtung 1 (Accordion, Alert, Badge, Divider, Skeleton, Radio) entstehen zuerst im Paket — CSS, Vertrag, Specimen —, dann als Control; sonst wachsen sie als Blöcke in `tlReactControls.css`, und die Ratsche hält sie.

**Verworfen:** beide Beschreibungen des Zustands pflegen (Drift garantiert); das MUI-Theme als Quelle der TL-Tokens (#29662: Richtung umgekehrt, Gate verloren); ein zweites Referenzprojekt im Design-System-Repo (dieselbe Sache zweimal); gegen !1698 argumentieren, wo er recht hat.

**Nicht verifiziert:** ob msgbuf 1.2.3 (TypeScript-Ziel) erscheint, bevor Welle 2 die Verträge braucht — !1698 baut bis dahin nicht; ob `TestControlStateSchema` mit `colorRole` aus !1694 zusammenläuft (Bernhards eigener Probe-Merge meldet den Schlüssel als undeklariert; wer zweiter landet, löst es).

**Als Test:** `contracts.test.mjs` prüft je `*.contract.md`, dass `### Zustand` genau eine Proto-Nachricht nennt und keine eigene Schlüsseltabelle führt, gegen eine Kopie von `state.proto` unter `test/fixtures/` (erzeugt, byte-identisch zum Worktree, solange !1698 dort ausgecheckt ist; sonst übersprungen mit Hinweis); geplante Nachrichten ohne Draft in `state.proto` stehen auf einer Liste, die nur schrumpfen darf; der Harness liest das Schema aus `control-state.ts` und die Fälle aus `## Konformität`; `TestControlStateSchema` bleibt Bernhards Gate für den Server. Plan: `docs/superpowers/plans/2026-09-28-konsolidierung.md`, Strang 1.

### Graurampe: Temperatur statt Farbe

Unser Grau ist ein kühles Grau: 28 Stufen mit Chroma 0,008 bei etwa 260°. Ein Kunde wählt in Stufe A
keine Graufarbe, sondern eine Temperatur — `warm` (70°), `neutral` (Chroma 0), `cool` (250°).
`derive` behält jede Helligkeit der TopLogic-Rampe und ändert nur den Ton.

**Warum:** jedes Kontrastpaar ist über Helligkeit gerechnet; ein Grau mit eigener Helligkeit oder
eigener Chroma kippt Text auf Flächen, und niemand will diese 28 Entscheidungen treffen. Die
Temperatur lässt die Helligkeiten stehen — aber sie hält deshalb nicht von selbst jedes Paar: OKLCH-
Helligkeit ist nicht die Leuchtdichte, die WCAG rechnet. Unser eigenes Paar `status-warning-text` auf
`surface-base` steht bei 4,500011; jede Temperatur schiebt es darunter.

**Deshalb der Nachführ-Pass:** Nachdem Marke, Grau, Kategorien und Beschriftungen gerechnet sind,
geht `derive` die Paarliste durch und schiebt jede **gerechnete** Farbrolle, die ihr Paar noch
verfehlt, mit `aufKontrast` um den kleinsten Helligkeitsschritt, bis es hält; jede Verschiebung
steht als Hinweis im Bericht. Gelieferte Werte werden nie geschoben — sie bleiben stehen und werden
zum Befund. So gilt die Regel ohne Ausnahme: ein Befund entsteht nur aus einem gelieferten Wert,
ein verfehltes Paar aus einem gerechneten ist ein Fehler in `derive` (Exit 3).

**Verworfen:** eine Graurampe aus einer einzelnen Kundenfarbe rechnen (wer sein Grau selbst kennt,
liefert in Stufe A ein Objekt Stufe → Hex, und das bleibt unverändert stehen); Grau in Richtung der
Marke (ein orangefarbenes Grau ist ein warmes Grau, aber ein grünes Grau ist kein Grau mehr) —
darum feste Töne, 70° und 250°, statt „Markenton und Gegenton“.

### Abstände: sieben Stufen, und eine fehlte

Die Skala des Bestands — `spacing-01` bis `-06` — ist 4 · 8 · 16 · 24 · 32 · 48 px. **Zwischen 8 und 16 liegt nichts**, und genau dort nehmen sich die Komponenten, was sie brauchen: 18 literale Abstände stehen in dieser Lücke.

| Literal | Stellen |
|---|---|
| `12px` / `0.75rem` | 6 |
| `6px` / `0.375rem` | 7 |
| `10px` / `0.625rem` | 3 |
| `5px` | 1 |

Die neue Skala schließt sie:

| Rolle | Primitiv | px |
|---|---|---|
| `space-2xs` | `size-1` | 4 |
| `space-xs` | `size-2` | 8 |
| **`space-sm`** | **`size-3`** | **12** |
| `space-md` | `size-4` | 16 |
| `space-lg` | `size-6` | 24 |
| `space-xl` | `size-7` | 32 |
| `space-2xl` | `size-8` | 48 |

**Die Namen sind relativ, nicht absolut** — und das ist eine Korrektur. Zuerst standen hier `space-4` bis `space-48`, mit der Begründung, ein Name solle seinen Wert tragen und eine `01`…`06`-Leiter lasse sich nicht erweitern, ohne bestehende Namen still zu verschieben. Das galt, solange die Werte fest sind. **Mit austauschbaren Primitiven gilt es nicht mehr:** Setzt ein Kundenprojekt `size-3` auf 14 px, hieße ein Token `space-12` etwas, das es nicht ist. Ein relativer Name lügt nie.

Alle sieben Werte sind durch vier teilbar. Damit liegen **Abstände, Zeilenhöhen und Control-Höhen auf demselben 4-px-Raster**.

### Dichte: zwei Stufen, und die Schrift bleibt gleich

**Eine Tabelle wird eng, indem Luft verschwindet — nicht indem Text schrumpft.** Das ist die Folge der Typo-Entscheidung: Weil dort nur zwei Arbeitsgrößen stehen und 12 px die Untergrenze ist, kann Verdichtung nicht über die Schriftgröße laufen.

| | Standard | Kompakt |
|---|---|---|
| Control-Höhe | `2rem` (32) | `1.75rem` (28) |
| Control-Höhe klein | `1.5rem` (24) | `1.5rem` (24) |
| Tabellenzeile | `2.25rem` (36) | `2rem` (32) |
| Leiste (Toolbar, Reiter) | `2.5rem` (40) | `2.25rem` (36) |
| Polsterung waagerecht | `space-sm` | `space-xs` |
| Polsterung senkrecht | `space-xs` | `space-2xs` |
| Abstand im Formular | `space-md` | `space-sm` |
| Schriftgröße | **12 / 14 px** | **12 / 14 px** |

**Zwei Stufen, nicht drei.** Jede Stufe muss in jeder Komponente umgesetzt und geprüft werden; eine dritte kostet die Hälfte mehr Pflege für einen Fall, den der Bestand nicht einmal andeutet.

Die Zeilenhöhe ist **abgeleitet, nicht gesetzt**: Control-Höhe plus 4 px. Deshalb trägt die Zeile ihren Inhalt in beiden Stufen, statt ihn abzuschneiden. Ebenso die Leiste: Control-Höhe plus `space-2xs` oben und unten (seit 02.10., siehe „Leisten und Hilfe“).

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

### Rahmenbreiten: zwei, und ein Balken ist kein Rahmen

Der Bestand nutzt 1 px 77-mal, 2 px 17-mal, 3 px fünfmal — dazu `1.5px`, `4px`, `0.15rem`, `0.4rem` und `0.65rem`.

| Token | Wert | Gilt für |
|---|---|---|
| `border-width-sm` | `1px` | der Regelfall: trennen, umschließen |
| `border-width-md` | `2px` | aktiv, betont, ausgewählt |

**Die breiten Werte sind keine Rahmen.** `0.4rem` (6,4 px) und `0.65rem` (10,4 px) stehen als `border-left` an Karten und Hinweisen — das ist ein **farbiger Akzentbalken**, der eine Bedeutung trägt, keine Umrandung. Er bekommt eine eigene Rolle `border-width-accent` mit `4px` und ist damit von der Rahmenskala unabhängig.

**`1.5px` fällt ersatzlos.** Ein halbes Pixel rastert auf keinem Bildschirm sauber; je nach Zoomstufe wird die Linie mal dicker, mal blasser als ihre Nachbarn. Die fünf `3px` gehen auf `border-width-md`.

Beide Breiten stehen in `px`, nicht in `rem` — nach der Einheitenregel: Eine Linie soll eine Linie bleiben.

### Marke: fünf Rollen plus zwei getönte Flächen

Die Rampe bekommt **keine abstrakten Stufen.** Was fehlte, waren zwei Rollen — eine markig getönte Fläche und ihr Hover-Zustand:

| Token | hell | dunkel | Gilt für |
|---|---|---|---|
| `surface-brand` | `#0B5ED7` | `#5394FF` | gefüllte Fläche, Schaltfläche |
| `surface-brand-hover` | `#004DBA` | `#75A9FF` | |
| `surface-brand-active` | `#003A8F` | `#2471EC` | |
| `text-link` | `#0B5ED7` | `#75A9FF` | Linktext |
| `text-link-hover` | `#004DBA` | `#95BDFF` | |
| **`surface-brand-subtle`** | **`#DFEBFF`** | **`#162338`** | aktiver Navigationspunkt, ausgewählter Reiter, getönter Streifen |
| **`surface-brand-subtle-hover`** | **`#CEE1FF`** | **`#1E2F4B`** | |

Gemessen im Specimen:

| | hell | dunkel |
|---|---|---|
| Text auf `surface-brand-subtle` | 15,71 | 14,35 |
| Text auf `surface-brand-subtle-hover` | 14,25 | 12,22 |
| `text-link` auf `surface-brand-subtle` | 4,86 | 5,29 |
| gegen die Grundfläche | 1,15 | 1,13 |

Die letzte Zeile ist Absicht: Eine getönte Fläche soll sich abheben, ohne eine Kante zu ziehen — dafür ist der Rahmen da.

**Eine volle Rampe mit zehn Stufen schied aus.** Die Hälfte hätte keine Aufgabe, und ein Token ohne Aufgabe ist genau die Beliebigkeit, die dieses System abstellen soll. Für Diagrammfarben, das übliche Argument für lange Rampen, gibt es im React-Theme bislang keine Tokens.

#### Gelöst: Info verlässt den Markenton

`surface-brand-subtle` und `status-info-subtle` waren nicht zu unterscheiden — beide Blau, beide hell, beide wenig gesättigt. **Ein markig getönter Reiter und ein Info-Hinweis sahen gleich aus**, hell wie dunkel.

**Das Maß dafür war zuerst falsch gewählt.** Notiert stand ein Kontrastverhältnis von 1,06, und daraus ließ sich nichts schließen: **Das WCAG-Verhältnis misst Helligkeit.** Zwei gleich helle Flächen erreichen immer rund 1,0 — auch wenn die eine blau und die andere orange ist. Der Gegencheck machte es sichtbar: Ein türkiser Kandidat, deutlich anders aussehend, kam auf 1,02 und damit auf einen noch *kleineren* Wert.

Das richtige Maß ist der **Farbtonabstand**:

| | ΔH |
|---|---|
| `surface-brand-subtle` ↔ `status-info-subtle`, vorher | **1,5°** |
| `info-subtle` ↔ `success-subtle` | 96,8° |
| `info-subtle` ↔ `warning-subtle` | 173,3° |
| `surface-brand-subtle` ↔ `status-info-subtle`, **jetzt** | **48,5°** hell, 45,2° dunkel |

**Info wandert ins Türkise.** Es bleibt kühl und damit als neutrale Mitteilung lesbar, kollidiert aber nicht mehr mit der Marke. Alle vier Rollen sind nach demselben Prinzip abgeleitet wie die Neutralen — jede Stufe ist der hellste Wert, der ihre Anforderung noch erfüllt.

**Das Gate hat jetzt eine Regel mehr:** Getönte Flächen verschiedener Bedeutung müssen **mindestens 30° im Farbton** auseinanderliegen. Ohne sie wäre dieser Fehler beim nächsten Markenton wieder möglich — und genau das war er: kein falscher Wert, sondern eine fehlende Prüfung.

### Icons: drei Stufen nach Rolle, eine Ausnahme, und die Trefferfläche gehört nicht dazu

**Der Mechanismus zuerst.** TopLogic-Icons sind Font-Glyphen: Ihre Größe ist eine `font-size`. Ohne Regel ist ein Icon deshalb so groß wie der Text, neben dem es zufällig steht.

Gemessen an Regeln, deren Selektor ein Icon, einen Umschalter oder eine Ladeanzeige nennt: **22 Deklarationen auf acht Werten** — 10, 12, 13, 14, 16, 18, 20, 24 px. Der Beleg, dass niemand entschieden hat, sind die drei Ladeanzeigen: `.tlTreeView__spinner` misst 14 px, `.tlDropdownSelect__spinner` 20 px, `.tlIconSelect__spinner` 24 px. Dieselbe Sache, dreimal anders, und keine der drei Komponenten wusste von den anderen.

| Token | Maß | px | Gilt für |
|---|---|---|---|
| `size-icon-sm` | `size-4` | 16 | **Der Regelfall.** Icon neben einer Beschriftung: Menüeintrag, Schaltfläche, Reiter, Tabellenzelle, Chip |
| `size-icon-md` | `size-5` | 20 | **Das Icon ist das Bedienelement.** Symbolleiste, eingeklappte Sidebar — überall ohne Text daneben |
| `size-icon-lg` | `size-6` | 24 | **Das Icon ist eine Aussage, keine Bedienung.** Dialogkopf, Vorschau, großer Statushinweis |
| `size-icon-glyph` | `size-3` | 12 | Richtungszeichen **innerhalb** eines Controls |

**Die Regel ist die Rolle, nicht die Größe:** *Steht Text daneben, gilt `sm`. Steht keiner daneben, gilt `md`. Wird nichts bedient, gilt `lg`.* Dieselbe Form wie die Radius- und die Rahmenregel.

Drei Bestandswerte fallen zusammen: **18 → 20** (beide 18er stehen im Icon-Wähler neben einem 20er, der Unterschied ist unsichtbar), **14 → 16** (ein Icon ist kein Buchstabe — bei gleicher Zahl wirkt es kleiner als die Schrift, weil seine Zeichnung im Geviert liegt), **13 und 10 → 12** (für beide gibt es keinen Grund außer der Reihenfolge, in der sie geschrieben wurden).

#### Ein Richtungszeichen ist kein Icon

`size-icon-glyph` gilt für eine **geschlossene Liste**: Chevron am Baumknoten, Pfeil am Auswahlfeld, Sortierzeiger im Spaltenkopf, Ziehgriff. Diese Zeichen benennen nichts — sie zeigen eine Richtung an einem Control, das seine Bedeutung schon hat. Sie stehen neben 12 px starker Beschriftung, und ein 16-px-Pfeil würde den Text dominieren, den er begleitet.

> *Ein Zeichen, das etwas benennt, ist ein Icon. Ein Zeichen, das eine Richtung anzeigt, ist ein Glyph.*

Wer die Liste erweitern will, erweitert die Skala — nicht die Ausnahme.

#### Die Trefferfläche ist nicht die Icon-Größe

Das ist der eigentliche Mangel im Bestand, und er ist ein Mechanismusfehler. Zwei Baum-Umschalter mit derselben Aufgabe:

| | Fläche |
|---|---|
| `.tlTableView__treeToggle` | **20 × 20 px** ✗ |
| `.tlTreeView__toggle` | 24 × 24 px ✓ |
| `.tlFormGroup__collapseToggle` | `1.5rem` = 24 px ✓ |

**20 × 20 px unterschreitet die 24 CSS-Pixel aus WCAG 2.5.8** — dasselbe Argument, das in der Typo-Skala die 12-px-Untergrenze gesetzt hat. Nachgeprüft: Von neun quadratischen Flächen unter 24 px ist dies die **einzige bedienbare**; die übrigen sind Anzeigen, die der Norm nicht unterliegen. Bei `.tlFormField__helpIcon` (20 px) hängt es daran, ob es einen Tooltip öffnet — das ist bei der Umsetzung zu prüfen.

**Die Skala bekommt dafür kein eigenes Token.** Eine Schaltfläche mit Icon ist ein Control und nimmt eine **Control-Höhe** aus der Dichte:

| | Fläche | Icon |
|---|---|---|
| Icon-Schaltfläche, Standard | `2rem` / kompakt `1.75rem` | `size-icon-md` |
| Icon-Schaltfläche, klein | `1.5rem` = 24 px | `size-icon-sm` |
| Glyph im Control | keine eigene — das Control ist die Fläche | `size-icon-glyph` |

Die kleine Control-Höhe liegt bei genau 24 px. **Solange eine Icon-Schaltfläche eine Control-Höhe nimmt, kann sie die Norm nicht verfehlen** — und der einzige Verstoß im Bestand ist genau der, der keine genommen hat.

#### Zwei Eigenschaften, die zur Stufe gehören

* **`line-height: 1` ist Pflicht.** Ein Font-Glyph erbt sonst die Zeilenhöhe des Fließtextes und macht die Zeile um ihre Differenz höher. Das steht in der Klasse, nicht in jeder Komponente.
* **In einer Liste ist der Kasten quadratisch.** Font-Glyphen sind verschieden breit; ohne feste Breite fluchten die Beschriftungen einer Menü- oder Baumspalte nicht. Dieselbe Sorte Fehler wie die fehlenden Tabellenziffern, und derselbe einzeilige Ersatz.

#### Was daraus folgt

Das Gate bekommt drei Regeln: **eine `font-size` an einem Icon, die keine Icon-Stufe ist, ist ein Verstoß**; **ein fokussierbares Element mit Icon und ohne Beschriftung unter 24 × 24 px ist ein Verstoß**; und **kein Icon nimmt eine Schriftgrößen-Rolle** — `var(--heading-compact-03-font-size)` an einem Symbolleisten-Icon ergibt zufällig 16 px und zieht mit, sobald jemand die Überschriftengröße ändert.

**Eine Nebenwirkung, die die Schichtung belegt:** `size-icon-md` brauchte 20 px, und die Maßleiter sprang von 16 auf 24. Der Wert wurde als `size-5` eingefügt, wodurch die früheren `size-5` bis `size-7` aufrückten — **ohne dass ein einziger Rollenname sich ändern musste.** `space-lg` heißt weiter `space-lg` und zeigt jetzt auf `size-6`.

Die vier Stufen stehen als Klassen `.tl-icon-glyph|sm|md|lg` in `base.css`; `font-size` ist nur dort erlaubt.

### Die Abbildung der alten Tokens: erledigt und abgeschnitten

Bevor der Schnitt entschieden war, wurde jedes der 54 alten Farbtokens einer Rolle der Skala
zugeordnet und jede der 131 Lesestellen der zwölf mehrdeutigen Tokens einzeln entschieden. Drei
Befunde daraus bleiben gültig und sind in die Regeln eingegangen:

* **Mehrdeutig heißt nicht immer dasselbe.** Neun Tokens waren eine *Alternative* (an jeder
  Stelle gilt genau ein Ziel), drei eine *Aufteilung* (`button-secondary` samt Zuständen trug
  Linie **und** Beschriftung). Eine Aufteilung ist am Token nicht lösbar, nur im Stylesheet — ein
  Grund mehr, das Stylesheet neu zu schreiben statt Tokens zu tauschen.
* **Der `inset`-Schatten ist eine Linie.** Der Bestand baut Umriss-Schaltflächen an 25 Stellen als
  `box-shadow: inset 0 0 0 2px`. Das Klassen-Gate liest ihn deshalb als Linie, nicht als Elevation.
* **„Wird bedient“, nicht „umschließt“.** WCAG 1.4.11 verlangt die 3,0 für Bedienelemente, nicht
  für Umrandungen. Der Rahmen einer Karte ist ein Separator; der eines Feldes ist ein Control-Rahmen.

Die Werkzeuge dahinter (Abbildung, Lesestellen, Vergleichsansicht) sind nach
[`docs/migration/altlast.md`](migration/altlast.md) exportiert und gelöscht. Die Datei ist die
Arbeitsliste der Wellen 1 bis 5; sie nennt je alter Rolle und je Lesestelle das neue Token.

### Disabled: vier Rollen ohne Gate

| Token | hell | dunkel |
|---|---|---|
| `text-disabled`, `icon-disabled` | `gray-29` | `gray-49` |
| `surface-disabled` | `gray-7` | `gray-69` |
| `border-disabled` | `gray-18` | `gray-66` |

Deaktivierte Elemente sind von WCAG 1.4.3 und 1.4.11 ausgenommen und tragen deshalb kein
Kontrastpaar. Die Werte sind so gewählt, dass deaktivierter Text im hellen Modus schwächer als
`text-placeholder` bleibt und die deaktivierte Fläche in beiden Modi neben `surface-interactive-selected`
liegt — ein Zustand, der zurücktritt, ohne zu verschwinden.

**Nachgezogen 01.10.: ein Zeiger.** Der Bestand hatte zwei — `not-allowed` an Feld und Auswahl, `default` am
Button (#29675). Entschieden: **`default` überall.** Der Hinweis am deaktivierten Element trägt die Erklärung,
nicht der Zeiger; ein Verbotszeichen auf einem Feld, das man nur gerade nicht bearbeiten darf, ist eine falsche
Botschaft. Umsetzung im Paket vor Welle 3 (`altlast.md` „Konsolidierung“ N7).

### Scrim und Ebenen

Ein modaler Dialog dunkelt die Seite darunter ab. Diese Fläche fehlte der Skala; sie heißt
`surface-scrim` und steht unter den Effekten, weil sie als einzige Rolle Deckkraft trägt: hell
`rgba(22, 24, 27, 0.48)`, dunkel `rgba(0, 0, 0, 0.64)`. Dunkel mehr, weil ein Dialog sich sonst
nicht von der Fläche löst, über der er liegt.

Die Stapelordnung bekommt sechs Ebenen statt 28 literaler `z-index` bis `9999999999999999`:

| Token | Wert | Gilt für |
|---|---|---|
| `layer-base` | 0 | die Fläche |
| `layer-raised` | 10 | festes Kopfband, eingefrorene Spalte |
| `layer-sticky` | 100 | Elemente, die beim Rollen haften |
| `layer-overlay` | 1000 | Scrim, Drawer |
| `layer-popover` | 1100 | Menü, Dropdown, Tooltip |
| `layer-toast` | 1200 | Snackbar — liegt über allem, weil sie nichts verdeckt außer kurz |

Die Sprünge lassen Kundenkomponenten Platz, ohne dass eine Ebene umbenannt werden muss. Ein
`z-index`, der kein `var(--tl-layer-*)` ist, ist ein Verstoß.

### Der Schnitt vom 17.09.

Die Spec vom 15.09. plante, das ausgelieferte `tlReactControls.css` an Ort und Stelle auf die
Skala umzuschreiben. Die Prüfung vor der Ersetzung ergab: Der Rückweg vom Neuen ins Alte deckte nur
die Farbschicht — 31 gelesene Maß-, Schatten- und Typo-Tokens hatten kein Ziel —, die
abgeleiteten Beschriftungen existierten nicht als CSS, und die Skala schrieb Attribute, die die
Anwendung nicht setzt. Reparierbar, aber der Weg führte an einen Ort, an den niemand will: alte
Namen mit neuen Werten.

**Entschieden:** Altlasten werden abgeschnitten, nicht übersetzt. Die Skalen bleiben. Neu sind das
Ziel (ein eigenes Paket `@toplogic/design-system`), die Namen (Englisch, kebab-case, Präfix `tl`,
BEM für Klassen, geschlossene Kategorien für Tokens) und die Reihenfolge (Tokens und Grundklassen
zuerst, dann Komponente für Komponente, bis das alte Stylesheet leer ist). Die Spec dazu:
[`superpowers/specs/2026-09-17-design-system-neuaufbau-design.md`](superpowers/specs/2026-09-17-design-system-neuaufbau-design.md).

---

### Der Namensraum `--tl` gehört dem Paket

Beim Nachziehen des Worktrees auf `master` schlug die Ratsche an: 23 Zeilen Zuwachs im alten
Stylesheet aus Ticket #29597 (Repeater-Grid). Der Zuwachs war legitim und kam von außen — die
Ratsche kennt keinen Absender. Dabei fiel auf, dass der Altbestand Custom Properties mit dem
Präfix `--tl` führt: `--tl-item-index`, `--tlGrid-gap`, `--tlPill-color`, `--tl-tt-padding`.
Die Koexistenz beider Token-Sätze beruht auf getrennten Präfixen; ein Name aus dem Altbestand,
der unser Präfix trägt, kann jederzeit mit einem Token kollidieren, das eine spätere Welle
einführt.

**Entschieden:** Der Namensraum `--tl` — jede Custom Property, die mit `--tl` beginnt, gleich
welcher Schreibweise — gehört dem Design-System-Paket. Außerhalb von `dist/` wird darin nichts
definiert; gelesen werden darf, was das Paket definiert — eine Übergangsregel im alten
Stylesheet liest Tokens, definiert sie aber nicht. Was heute schon darin steht, ist Fremdgut und steht in
`test/ratchet.json` unter `foreignTl` als Einfang-Liste: Die Welle, die die Komponente holt,
entscheidet, ob der Name ein Token wird (dann trägt er eine geschlossene Kategorie, etwa
`--tl-space-…`) oder ein Mechanismus bleibt (dann heißt er anders). Neues auf der Liste bricht
den Test; Eingefangenes wird gestrichen, sonst bricht er ebenfalls.

Das Ratschen-Budget wurde dabei einmalig von 6065 auf 6088 Zeilen gehoben, mit Vermerk der
Herkunft. Die Regel „darf nur sinken" gilt für die Wellen; Fremdzuwachs wird vermerkt und
gehoben, nicht stillschweigend eingerechnet.

---

### Die Ratsche misst Blöcke, nicht die Datei

Der Befund nach Welle 1: Zwischen dem 19. und dem 24.09. musste das Zeilenbudget dreimal für
fremden Zuwachs gehoben werden (5766 → 6692 → 7390 → 7405) — kollabierende Toolbar (#29626),
Sidebar (#29523), Gestaltungsoptionen (#29596), Tooltips (#29497), zuletzt 15 Zeilen aus #29615
nach dem Merge. Ein Budget über der ganzen Datei kennt keinen Absender: Jede Hebung steht bei
der Welle, die gerade läuft, und die Regel „darf nur sinken" wird zur Formalie.

**Entschieden:** Die Ratsche misst je Block des alten Stylesheets. Ein Block ist, was eine
Überschrift `/* --- Name ------ */` eröffnet und die nächste beendet; was vor der ersten steht,
ist der Block `Kopf`. `test/ratchet.json` führt unter `blocks` jeden Block mit seinem
Zeilenstand, die Literale werden über die gelisteten Blöcke gezählt.

* **Kein Block wächst.** Wächst einer, nennt der Test seinen Namen. Kommt der Zuwachs von außen,
  wird dieser eine Block mit Vermerk des Tickets gehoben — der Absender ist zurechenbar, die
  übrigen Blöcke bleiben unberührt.
* **Ein abgeschnittener Block wird gestrichen.** Fehlt ein gelisteter Block in der Datei,
  bricht der Test, bis er aus `blocks` fällt: Das ist der Nachweis „alter Block leer" je
  Komponente, den die Spec als Fertig-Bedingung nennt.
* **Neue Blöcke von außen brechen nicht.** `node tools/inventory.mjs` zeigt sie unter
  `unlisted`; die Welle, die die Komponente holt, trägt den Block ein. Bis dahin ist er
  Fremdgut wie die Namen in `foreignTl`.

Verworfen: das Budget je Welle einmal gegen den master-Stand beim Branch-Start zu eichen. Das
misst weiterhin die Datei und verliert zwischen zwei Eichungen jeden Absender.

---

### Button: vier Erscheinungen, eine Tönung, keine Größe

Der Befund vor Welle 1: Der alte Block (Zeilen 100–270 plus fünf Kontextblöcke) kennt drei
Erscheinungen — Umriss als Default, `primary` gefüllt, `link` — und dazu `small`/`large`, die
serverseitig genau einmal gesetzt werden. Der gedrückte Zustand ist eine Klasse `--active`, die den
Primary-Stil fast vollständig wiederholt, obwohl `aria-pressed` daneben gesetzt wird. Icon-only,
icon-label und label-only sind Klassen. Fünf Selektoren von außen (`.tlAppBar--primary
.tlReactButton`, Fenster-Toolbar, Tabellenzelle, Dropdown, Dialogfuß) überschreiben den Button je
Kontext; die AppBar liest dabei weiße `rgba`-Literale. Eine Darstellung für destruktive Aktionen
gibt es nicht.

**Entschieden:**

| Achse | Regel |
|---|---|
| Erscheinung | Vier Modifier, vom Autor gewählt: `primary` (gefüllt, `surface-brand`), `secondary` (Umriss, `border-control`; der Default), `ghost` (kein Rahmen; Toolbars, Icon-Schaltflächen), `link` (Textlink). |
| Tönung | `danger` färbt die gewählte Erscheinung um und liest die Status-Rollen: mit `primary` die Fläche `status-error-surface` samt abgeleiteter Beschriftung, mit `secondary` Text `status-error-text` und Linie `status-error-border`, mit `ghost` nur den Text. Mit `link` nicht erlaubt — ein Textlink löscht nichts. |
| Größe | Kein Modifier. Die Höhe kommt aus der Dichte (Control-Höhe). Einzig die Icon-Schaltfläche kennt `sm` (24 px) für Tabellenzeilen — siehe Icons. |
| Darstellung | Keine Klassen. Icon und Beschriftung sind Elemente `__icon` und `__label`; icon-only heißt: kein `__label`, und `aria-label` ist Pflicht. |
| Zustände | `:disabled`, `[aria-pressed="true"]` (ersetzt `--active`; ein ToggleButton ist ein Button mit `aria-pressed`, kein eigenes CSS), `aria-busy="true"`, `:focus-visible`, `:hover`, `:active`. |
| Kontext | Kein Selektor von außen. Der Container wählt die Erscheinung — die Toolbar setzt `ghost`, wenn kein Container etwas anderes vorgibt; AppBar `ghost`, Fensterfuß und Panel-Buttonleiste `secondary`, die Hauptaktion `primary`. |
| Kollaps | Nicht Sache des Buttons. Ob eine beschriftete Schaltfläche zum Icon wird, entscheidet die Toolbar nach ihrem Platz (#29626, `tlToolbar--compact`), nicht ein Viewport-Breakpoint und kein Kontext am Button. Bis Welle 3 liest die Toolbar dafür `tl-button__label` als Übergangsregel. |

Warum die Tönung keine fünfte Erscheinung ist: Ein Löschen steht im Bestand mal in der Toolbar
(Umriss), mal im Dialog (gefüllt). Eine Erscheinung `danger` müsste beides sein und wäre die
nächste Dublette nach dem Muster `--active` zu `--primary`. Die Tönung hat dieselbe Form wie die
Semantik: eine Bedeutung, vier Rollen.

**Die AppBar ist keine Markenfläche.** Der Fall „Schaltfläche auf Marke“ mit weißen Literalen
entfällt, statt ein Kontextattribut zu bekommen: Die Kopfleiste wird `surface-layer` wie jede
Fläche. Das gilt für die Shell in Welle 4 und ist hier festgehalten, weil der Button sonst eine
zweite Farbwelt bräuchte.

Umgesetzt mit Welle 1 als Übergangsregel im alten AppBar-Block; Welle 4 schreibt die Shell neu.

**Als Test:** Das Klassen-Gate erlaubt am Block `tl-button` nur die vier Erscheinungs-Modifier
und `danger`; ein Zustandsname als Modifier (`--active`, `--disabled`, `--loading`) bricht. Der
Kontrasttest prüft `primary`, `secondary` und `ghost` je mit und ohne `danger` in beiden Modi.
`TLUploadButton` rendert dieselbe Chrome und bekommt damit dieselben Regeln.

---

**Befunde aus `test/components.test.mjs` (Task 3) — entschieden (Fix-Runde 1):**

- Entschieden: Umriss und Ghost füllen sich mit `danger` beim Zeigen (`status-error-surface` im
  Hover, `status-error-surface-active` im Aktiv-Zustand statt `status-error-subtle`) — roter Text
  trug auf keiner Hover-Fläche 4,5 (`status-error-subtle` 4,12, `surface-interactive-hover` hell
  4,22 / dunkel 3,90). `status-error-subtle` bleibt dem Hinweisstreifen vorbehalten und wird im
  Button nicht mehr gelesen.
- Entschieden: `border-control` dunkel von `gray-49` auf `gray-45` (`#6F7277`) angehoben — auf
  `surface-layer` erreichte `gray-49` nur 2,88 statt 3,0; `gray-45` erreicht 3,39 (Grund 3,68,
  `surface-field` 3,02).

**Entschieden (Fix-Runde 2, Ruling 3):** Der Befund war systemisch, nicht auf `danger-secondary`
beschränkt — im Dunkelmodus verfehlten alle vier `status-*-text` auf `surface-layer` die 4,5
(Fehler 4,19, Warnung 4,15, Erfolg 4,18, Info 4,16), weil Welle 0 nur gegen `surface-base` gemessen
hatte. Die Regel gilt jetzt für beide Flächen und ist als Test festgeschrieben (siehe
„Semantik: vier Bedeutungen, vier Rollen“ oben); alle vier dunklen Text-Rollen wurden auf die
dunkelste noch ausreichende vorhandene Stufe angehoben.

**Entschieden (Fix-Runde 3, Ruling 4):** Dieselbe Klasse wie Ruling 3, jetzt für die Linien —
im Dunkelmodus verfehlten alle vier `status-*-border` auf `surface-layer` die 3,0 (Fehler 2,79,
Warnung 2,77, Erfolg 2,77, Info 2,76). Die Regel gilt jetzt für beide Flächen und ist als Test
festgeschrieben (siehe „Semantik: vier Bedeutungen, vier Rollen“ oben); alle vier dunklen
Border-Rollen wurden auf die dunkelste noch ausreichende vorhandene Stufe angehoben.

---

### Ton folgt der Aktion: Bedeutung, nicht Farbe

Der Befund (02.10., nach Welle 3a): Der Knopf kann `danger` seit Welle 1, aber nichts ruft es auf.
`ReactButtonControl.setTone` hat keinen Aufrufer, das React-`CommandModel` kennt keinen Ton,
`ViewCommand.Config` kennt weder Erscheinung noch Ton, und im Überlauf der Toolbar verwirft
`buttonClassName` einen `danger` ausdrücklich. Hervorgehoben ist ein Knopf nur über Enter
(`markAsDefault()` → `primary`). Der Bestätigungsdialog macht „Löschen“ immer `primary`, Verwerfen im
Dirty-Dialog hat keinen Ton. Löschen sieht aus wie Speichern — in Toolbar, Kontextmenü, Dialogfuß
und Rückfrage.

**Entschieden:**

| Frage | Regel |
|---|---|
| Steuerung | Der Autor sagt, *was* ein Kommando ist, nicht welche Farbe es hat. Kein Attribut `tone`/`appearance` am Kommando. Der Ton kommt aus der Aktionskette: `DeleteObjectAction` sagt `DANGER`, `ViewActions.tone` aggregiert wie `appliesFormState`, das Kommando reicht es durch. Zweite Quelle: Clique `delete`. |
| Umfang | Nur destruktiv → `danger`. Hervorhebung bleibt Enter → `primary`. Keine Tabelle Clique → Erscheinung: die meisten Zeilen hießen „secondary, kein Ton“. |
| Rückfrage | „Wirklich löschen?“: Enter bleibt auf Löschen, der Knopf wird `primary` + `danger` (rot gefüllt). Rot ist er genau dann, wenn das, was **nach** dem Bestätigen in der Kette kommt, zerstört — die `Continuation` kennt den Rest der Kette. |
| Menüeintrag | `tl-menu__item--danger`, gezeichnet mit den drei Token-Paaren von `tl-button--ghost.tl-button--danger`. Ton ist kein Zustand, darum eine Klasse wie am Knopf, kein Attribut. Beide Pipelinen (Kontextmenü, Toolbar-Überlauf) enden in `menuItemClassName`. |
| Zusammengesetzte Aktionen | `with-transaction`, `if`, `switch` tragen den Ton ihrer inneren Aktionen — bei `if`/`switch` zählt jeder Zweig, auch der nicht genommene, wie bei `appliesFormState`. Sonst wäre ein Löschen in einer Transaktion nicht rot. |
| Rückfrage in einem Zweig | Sie sieht den Rest des Zweigs und den Rest der umschließenden Kette: `nest` gibt den Ton der äußeren Fortsetzung mit. |

Begründung: dieselbe Linie wie bei der Pill („Rolle statt Farbe“) und bei Enter → `primary`. Eine
freie Farbwahl je Knopf erzeugt Uneinheitlichkeit und muss an jeder Stelle gepflegt werden; eine
Bedeutung steht schon da — in der Aktion, die das Kommando ausführt. Spec
`docs/superpowers/specs/2026-10-02-ton-folgt-der-aktion-design.md`.


### Pill: Rolle statt Farbe

**Der Befund.** Die Pill ist seit #29596 kein eigenes Control mehr: `TLText` zeichnet einen Wert als
Kapsel, wenn das Modell ihm eine Farbe gibt (`<color token="support-warning"/>`, alternativ ein
Hex-Literal) oder der View `appearance="pill"` setzt. Die Farbe kommt als `var(--support-warning)`
oder Hexwert in die Custom Property `--tlPill-color`, und das Stylesheet mischt daraus per
`color-mix` Fläche (16 %), Linie (40 %) und Text (72 %) gegen alte Tokens. Der Kontrast ist damit
ein Nebenprodukt der Mischung, nicht eine Eigenschaft der Skala — und ein Tokenname, den das Theme
nicht ausliefert, macht die Pille still farblos, was #29606 mit einem Register der ausgelieferten
Tokens repariert hat. Gemessen: `status-*-text` auf der eigenen `subtle`-Fläche erreicht hell
4,01 bis 4,20 — ein getönter Text auf getönter Fläche fiele durch das Gate.

**Entschieden:**

| Achse | Regel |
|---|---|
| Farbe | Eine **Rolle** aus geschlossener Liste: `neutral` (Default), `brand`, `error`, `warning`, `success`, `info`, `category-1` … `category-8`. Kein Tokenname, kein Literal, keine Mischung. |
| Ableitung | Jede Rolle liest zwei Tokens — die getönte Fläche und ihre Linie: `neutral` `surface-interactive-selected`/`border-control`, `brand` `surface-brand-subtle`/`border-interactive`, die vier Bedeutungen `status-*-subtle`/`status-*-border`, die Kategorien `category-N-subtle`/`category-N-border`. |
| Text | `text-primary` in jeder Rolle — die Pill ist ein kleiner getönter Streifen, und die Regel der Semantik gilt: *ein getönter Streifen trägt gewöhnlichen Text*. Die Farbe lebt in Fläche und Linie. |
| Klassen | `.tl-pill`, Modifier `--brand`, `--error`, `--warning`, `--success`, `--info`, `--category-1` … `--category-8`; Elemente `__icon`, `__label`. Ohne Modifier neutral. |
| Maße | Höhe `size-control-sm`, Innenabstand `space-xs`, Linie `border-width-sm`, Form `radius-full`. Im Fließtext erbt sie die Schriftgröße. |
| Modell | Die Annotation nennt die Rolle, nicht die Farbe. Das Register aus #29606 schrumpft auf ein Enum; `support-info` als Token entfällt, weil `info` eine Rolle ist. |

**Acht Kategorien, deren Bedeutung die Anwendung festlegt.** Kunden haben Werte, die sich unterscheiden
sollen, ohne dass die Farbe etwas bedeutet — Projektfarben, Sparten, Diagrammreihen. Das Paket liefert dafür acht
Kategorien mit je zwei Rollen (`subtle`, `border`), gerechnet wie die Statusfarben: die Linie ist
der hellste Wert, der auf `surface-base` und `surface-layer` 3,0 hält; die Fläche liegt hell bei
L 0,955 und dunkel bei L 0,27 in OKLCH, mit `text-primary` darauf bei 13 bis 15. Die Farbtöne
stehen zwischen den Bedeutungen: 2°, 56°, 123°, 186°, 238°, 285°, 311°, 337°.

| Kategorie | Farbton | hell `subtle` / `border` | dunkel `subtle` / `border` |
|---|---|---|---|
| 1 | 2° | `red-5` / `red-33` | `red-73` / `red-46` |
| 2 | 56° | `amber-5` / `amber-35` | `amber-73` / `amber-47` |
| 3 | 123° | `green-6` / `green-37` | `green-73` / `green-48` |
| 4 | 186° | `teal-5` / `teal-36` | `teal-73` / `teal-48` |
| 5 | 238° | `blue-4` / `blue-35` | `blue-75` / `blue-48` |
| 6 | 285° | `blue-7` / `blue-33` | `blue-73` / `blue-46` |
| 7 | 311° | `magenta-5` / `magenta-33` | `magenta-73` / `magenta-46` |
| 8 | 337° | `magenta-4` / `magenta-34` | `magenta-74` / `magenta-47` |

**Das Gate wird für die Kategorien weicher, und das steht hier.** Dreizehn getönte Flächen
(Marke, vier Bedeutungen, acht Kategorien) teilen sich 360°; im Mittel bleiben 27,7°, die 30° der
Bedeutungen sind also nicht zu halten. Kategorien halten **20°** zueinander und zu jeder Bedeutung
(`KATEGORIE_ABSTAND_MIN`). Das reicht, um zwei Pillen nebeneinander zu unterscheiden; es reicht
nicht, damit eine Kategorie niemals an eine Bedeutung erinnert — Kategorie 1 liegt 26° neben dem
Fehlerrot. Deshalb trägt eine Kategorie ihre Bedeutung nie in der Farbe, sondern im Text, und
deshalb sind es Kategorien und keine „Farben“: Wer Rot meint, nimmt `error`.

**Verworfen:** nur Rollen ohne Kategorien (jede Kundenfarbe wäre eine neue Rampe im Paket, und
Welle 5 bräuchte für Diagramme trotzdem eine Palette); Kategorien mit eigener Textrolle (dritte
Rolle je Kategorie, ohne Leser — der Text auf der Pill ist gewöhnlich, ein Diagramm beschriftet
nicht in seiner Reihenfarbe); Literal als Fluchtweg (ein Wert außerhalb der Primitive ist genau
die zweite Wahrheit, die das System abstellt).

**Als Test:** `components.test.mjs` prüft je Rolle × Modus Text 4,5 auf der Fläche und Linie 3,0
gegen `surface-base` und `surface-layer`; `tokens.test.mjs` prüft die Kategorien auf zwei Rollen,
Text und Linie, und die 20°. `pill.css` darf nur die Tokens der Rollen lesen, kein `color-mix`,
kein Literal; das Specimen zeigt jede Rolle auf beiden Flächen und im Fließtext.

### Avatar: die Farbe ist eine Kategorie

**Der Befund.** `TLAvatar` zeichnet Initialen auf `hsl(<hash des Namens>, 45%, 45%)` als
Inline-Style, Text `#fff` als Literal; vier Größen 24/32/48/64 px mit Schriftgrößen 9/12/18/24 px als
Literale — die 9 px unterschreiten die Untergrenze der Typo-Skala; der leere Avatar liest
`layer-accent` (zweckfremd, die AppBar-Fläche) und `border-subtle`. Der Farbwert aus dem Hash ist
die zweite Wahrheit neben der Palette: er kennt keinen Modus, sein Kontrast zum weißen Text ist
Zufall des Namens (45 % Helligkeit ergibt 3,9 bis 5,1), und er steht im DOM, nicht im Stylesheet.

**Entschieden:**

| Achse | Regel |
|---|---|
| Farbe | Eine der acht **Kategorien**, aus dem Namen gerechnet (`1 + hash(name) mod 8`), als Klasse `tl-avatar--category-<n>`. Dieselben zwei Tokens wie die Pill: `category-N-subtle` als Fläche, `category-N-border` als Linie; Initialen `text-primary`. Kein Farbwert aus dem Namen, kein Inline-Style. |
| Ohne Namen, mit Bild | Die neutrale Rolle der Pill: `surface-interactive-selected`, `border-control`. Das Bild füllt den Kreis (`object-fit: cover`), die Linie bleibt, damit ein helles Foto auf heller Fläche eine Kante hat. |
| Größen | Vier Maß-Tokens `size-avatar-sm/md/lg/xl` = `size-6/7/8/9` (24/32/48/64 px); `size-9` = 4 rem kommt neu in die Primitive. Modifier `--sm`, `--lg`, `--xl`; `md` ohne Modifier. **Nicht** an der Dichte: ein Avatar ist kein Bedienelement. |
| Initialen | Typo-Klasse je Größe, von außen wie beim Button: `sm` `label-strong` (12), `md` `body-strong` (14), `lg` `heading-md` (20), `xl` `heading-lg` (24). Keine Schriftregel in `avatar.css`. |
| Form | `radius-round`, wie in der Radius-Skala vorgesehen. |
| Zugänglichkeit | Initialen-Avatar `role="img"` + `aria-label`, Bild-Avatar `alt`, Avatar ohne Namen `aria-hidden`; der volle Name als Tooltip. |
| Modell | `AvatarSize` heißt `sm`, `md`, `lg`, `xl` — der View schreibt `size="xl"`; die alten Namen `small`/`default`/`large`/`x-large` fallen ohne Alias. |

**Warum eine Kategorie und keine eigene Avatar-Palette.** Der Avatar braucht genau das, was die
Kategorien sind: Werte, die sich unterscheiden, ohne etwas zu bedeuten. Acht reichen — zwei Personen
in derselben Kategorie unterscheidet der Text, nicht die Farbe, und das gilt für jede Palette mit
endlich vielen Tönen. Der Gewinn: ein Avatar und eine Pill derselben Kategorie sehen gleich aus,
das Kontrast-Gate der Kategorien deckt den Avatar mit ab, und die Farbe wechselt mit dem Modus.

**Verworfen:** ein gerechneter Farbwert je Name (die zweite Wahrheit, siehe Pill); weiße Initialen
auf gesättigter Fläche (`text-on-*` je Kategorie wäre eine dritte Rolle ohne weiteren Leser);
Größen an der Dichte (ein Avatar in einer kompakten Tabelle ist `sm`, nicht ein geschrumpftes `md`).

**Zwei Namensräume für die Größen (entschieden 28.09., Review !1695).** Was jemand tippt — `size="…"` in der View, `@Name` am Java-Enum — sind ganze Wörter: `small | medium | large | x-large`; `medium` ist der Name der mittleren Stufe, „Default“ ist kein Name, sondern das fehlende Attribut. Was das Paket erzeugt — Klassen und Tokens — behält die Skalenkürzel `sm/md/lg/xl`, konsistent mit `space-sm` und `radius-sm`; das TSX bildet `x-large → xl` je Control ab. Der JavaDoc nennt keine Pixel, sondern die Rolle der Stufe; die Pixel stehen in `primitives.json`. Verworfen: ganze Wörter im Paket (bricht die Skalennamen), Kürzel extern (unlesbar in der View, Bernhards Einwand ist berechtigt).

**Als Test:** `components.test.mjs` prüft je Rolle × Modus Initialen 4,5 und Linie 3,0 gegen
`surface-base` und `surface-layer`; die vier Größen sind genau `size-6/7/8/9` und stehen nicht in
der Dichte; `avatar.css` liest nur die Tokens der Rollen und `size-avatar-*`, keine Schriftregel,
kein `hsl`, kein Literal; das Specimen zeigt acht Kategorien × vier Größen, ohne Namen und mit Bild,
auf beiden Flächen.

### Progress: ein Anteil, kein Urteil

**Der Befund.** `.tlProgress` steht ohne eigenen Block im Block `TLHtml`: Spur `--layer-active`,
Füllung `--interactive`, Höhe `0.5rem`, Mindestbreite `2rem`, Radius `999px`, Übergang `0.2s ease-out`,
Schwung `1.4s ease-in-out infinite`, Beschriftung `--label-01-font-size` — sieben Literale, und ein
eigener `prefers-reduced-motion`-Block, der die Füllung bei 75 % ruhen lässt. Unbestimmt ist eine Klasse
`--indeterminate`, obwohl das Element `aria-busy` schon trägt.

**Entschieden:**

| Achse | Regel |
|---|---|
| Spur | `surface-interactive-selected` — die neutrale Fläche, die auch Pill und Avatar ohne Rolle tragen. `surface-layer-nested` schied aus: hell identisch mit `surface-layer`, die Spur wäre auf einem Panel unsichtbar. |
| Füllung | `surface-brand`. Kontrast Füllung zu Spur 4,75 hell / 4,47 dunkel; Gate 3,0. |
| Tönung | **Keine.** Ein Balken sagt, wie weit, nicht ob gut oder schlecht; das sagt der Text daneben oder der Status, der ihn zeigt. |
| Maße | Höhe `size-progress` = `size-2` (8 px), Mindestbreite `size-control`, Abstand `space-xs`, Form `radius-full` (in der Radius-Skala für den Balken vorgesehen). |
| Beschriftung | `text-secondary`, Klasse `.tl-type-label .tl-nums` von außen — Zähler sind Zahlenspalten. |
| Breite der Füllung | **Daten, kein Gestaltungswert:** das Control setzt `style="width: 25%"`, dasselbe wie `aria-valuenow`. Eine Custom Property `--tl-progress-fraction` schied aus, weil der Namensraum `--tl` den Tokens gehört und das Gate komponenteneigene Variablen zu Recht ablehnt. |
| Unbestimmt | Ein **Zustand**: `[aria-busy="true"]` ist der Selektor, keine Klasse. Die Füllung ist zwei Fünftel breit, ruht bei drei Vierteln und wandert mit `duration-loop` `easing-standard` endlos. |
| Reduced Motion | **Kein eigener Block.** Der globale Schalter beendet die Animation nach einem Durchlauf, der Fill-Mode lässt die Füllung auf ihre Ruhelage zurückfallen — der Balken liest sich weiter als beschäftigt. Das ist die Probe, ob der Schalter aus Welle 0 trägt: er trägt. |

**Verworfen:** eine Tönung je Status (der Bestand hat keine, und `TLJobStatus` sagt Scheitern im
Text); der Anteil als Custom Property (siehe oben); Spur mit Linie (`border-separator` liegt bei 1,7
gegen den Grund — eine Linie um 8 px Spur zeichnet nur Rauschen); eine eigene Klasse für unbestimmt.

**Als Test:** `components.test.mjs` prüft Füllung 3,0 gegen Spur, Spur verschieden vom Grund,
Beschriftung 4,5 auf base und layer, je Modus; `progress.css` liest genau drei Farbrollen, keine
Breite, keine eigene Variable, den Schwung nur aus `duration-loop`, keinen eigenen Motion-Schalter;
`duration-loop` ist `dur-4` = 1200 ms; das Specimen zeigt fünf Anteile, unbestimmt, ohne Beschriftung
und eine schmale Zelle, auf beiden Flächen.

**Nachgezogen 09.10. (Hendrik): kein Wertetext neben dem Namen.** Seit der Fix-Welle 3b ist die
Beschriftung der Name (`aria-labelledby`). Stand derselbe Text zusätzlich in `aria-valuetext`, sagte der
Screenreader ihn zweimal an („2 / 8, Fortschritt, 2 / 8“). Der Wert kommt jetzt allein aus
`aria-valuenow` (unbestimmt `aria-busy`). Als Test: das Specimen trägt kein `aria-valuetext`, jeder
beschriftete Balken ein `aria-labelledby`.

**Nachgezogen 09.10. (Hendrik): jeder Balken hat einen Namen; ist die Beschriftung der Wert, kommt der Name vom
Ort.** Der Balken des Job-Status stand ohne Beschriftung und ohne Namen. Er zeigt jetzt den Anteil („42 %“, in der
Sprache des Browsers), und benannt ist er nach dem Status darüber („Läuft“) — sonst sagte der Screenreader
„42 %, Fortschritt, 42 %“. Eine Beschriftung, die nur den Wert zeigt, ist `aria-hidden`: den Wert sagt
`aria-valuenow`, und in der Live-Region des Status würde jede Änderung angesagt. Unbestimmt, ohne Wert, steht der
Balken ohne Beschriftung, vom Ort benannt. Verworfen: die Prozentzahl als Name (doppelte Ansage). Als Test: jeder
Balken im Specimen hat `aria-labelledby`, eine Wert-Beschriftung ist `aria-hidden`, ihr Name steht am Ort.

### Icon: die Stufe ist die Rolle, das Control trägt keine eigene Klasse

**Der Befund.** Die Icon-Skala ist seit Welle 0 entschieden und liegt als vier Klassen in `base.css`
(siehe „Icons: drei Stufen nach Rolle“). Auf der Engine-Seite lag daneben: `TLIcon` mit eigener Klasse
`.tlIcon` und drei Regeln, die `base.css` schon hat; `FontIcon.tsx` als zweite Implementierung von
`ThemeIcon` (vier Leser); `ThemeIcon` setzt einem Bild-Icon `width: 1em; height: 1em` **inline**; kein
Icon trägt eine Stufe — `<theme-icon>` ist so groß wie der Text, neben dem es zufällig steht.

**Entschieden:**

| Achse | Regel |
|---|---|
| Stufe | `<theme-icon size="sm|md|lg|glyph">`, Default `sm` (steht neben Text); `IconSize` heißt so. Das Control rendert `tl-icon-<stufe>` und sonst nichts — **kein eigenes CSS**, der Vertrag verweist auf `base.css`. |
| Bild-Icon | Kein Inline-Maß. Die Stufenklasse macht ein `<img>` zum Quadrat ihrer Größe, weil `width: 1em` an einer Klasse mit `font-size` steht. |
| Zugänglichkeit | Jeder Font-Glyph `<i>` ist `aria-hidden`; der Name steht am Element darum herum (`role="img"` + `aria-label` bei Tooltip, sonst `aria-hidden`). |
| Dublette | `FontIcon.tsx` fällt; die vier Leser (ValueList, Panel, TextInput, FormField) nehmen `ThemeIcon`. Ihre eigenen Icon-Klassen (`tlReactTextInput__icon` …) bleiben bis zu ihrer Welle. |

**Nicht in dieser Welle:** Menü, Toolbar, Sidebar, Reiter und Select geben `ThemeIcon` eine eigene Klasse
statt einer Stufe; sie bekommen `tl-icon-sm|md` in Welle 2 bis 4. Bis dahin fehlt einem Bild-Icon dort
das 1-em-Maß — sichtbar nur bei `theme:`-Bildern, nicht bei Font-Glyphen.

**Namen:** extern `small | medium | large | glyph`, im Paket `tl-icon-sm/md/lg/glyph` — siehe „Zwei Namensräume für die Größen“ beim Avatar.

**Als Test:** `components.test.mjs` prüft, dass die vier Klassen in `base.css` stehen und `size-icon-*`
lesen, dass `components.css` keine `font-size` enthält, und dass Specimen und Vertrag die vier Stufen,
das Bild-Icon ohne Inline-Breite und die Attribute zeigen.

### Wellen überlappen, gemergt wird der Reihe nach

**Der Befund (30.09.).** Ein PR wartet etwa drei Tage auf den Review; die Regel „Keine Welle beginnt,
bevor die vorherige grün ist“ reiht vier Wellen hintereinander, und das ganze System soll bis Ende der
Woche ab 05.10. stehen.

**Entschieden:** **Keine Welle wird gemergt, bevor die vorherige gemergt ist** — gebaut wird gestapelt.
Welle n+1 zweigt vom Branch der Welle n ab, solange diese im Review liegt, und wird nach deren Merge auf
master umgestellt (wie Avatar auf Pill). Der Zweck der alten Regel bleibt: Muster aus Welle n fließen in
Welle n+1, weil diese auf ihrem Stand baut. Je Welle **ein** PR, die Commits nach Gruppen geordnet.

### Formulare: ein Feldrahmen, Zustände als Attribute

**Der Befund.** Text, Zahl, Datum und Select teilen sich eine Selektorliste; DropdownSelect,
SegmentedChoice, OptionChips und der Radio bauen den Rahmen je selbst nach. Fehler und Warnung sind
Klassen (`--error`, `--warning`); `aria-invalid` wird gesetzt, aber von keiner Regel gelesen, und
DropdownSelect hat keinen Fehlerzustand. Der Feldrand misst im Dunkelmodus 1,38:1, der Radio ist
Browser-Standard, der Link im Lesemodus Browser-Blau (1,29:1).

**Entschieden** (Spec `docs/superpowers/specs/2026-09-30-welle-2-formulare-design.md`):

| Achse | Regel |
|---|---|
| Rahmen | eine Klasse `tl-field` am Eingabeelement bzw. an der Wurzel des DropdownSelect: `surface-field`, `border-control` (Gate 3,0), `size-control`, `radius-sm`, Fokus aus `base.css` |
| Fehler | `aria-invalid="true"`, wo ARIA es erlaubt, sonst `data-tl-state~="error"` — das CSS liest das Attribut, das auch der Screenreader braucht |
| Warnung | `data-tl-state~="warning"`; ARIA kennt keine Warnung |
| Schreibgeschützt | kein Zustand, ein anderes Element: `tl-field-value`, Text mit Ellipse, als Link `text-link` |
| Auswahl | Checkbox, Radio, Schalter aus Tokens (`appearance: none`); gewählt ist, was `aria-checked`/`aria-pressed` trägt; der gleitende Marker der SegmentedChoice fällt |
| Einzelwert | trägt er eine Rolle, erscheint er als Pill — eine Rolle, die beim Wählen verschwindet, ist keine Rolle |
| Symbole | Pfeil, Löschen, Suche, Griff sind `ThemeIcon` in `tl-icon-sm`, keine Textzeichen |

**Neu im Paket, ohne Control:** Alert, Badge, Divider, Skeleton. Controls entstehen, wenn eine Ansicht sie braucht.

#### Entschieden beim Bauen (30.09.)

Beim Bauen der Welle kamen Fragen, die die Spec nicht beantwortet hatte. Jede Antwort steht hier mit
ihrem Grund; die Werte der Kontrast-Nachzüge (5a, 7a) stehen in „Semantik“ und „Neutrale“ und werden
nicht wiederholt.

**Neue Maße — sie folgen nicht der Dichte.** Sieben Tokens in `measure`, alle nur Referenzen:

| Token | Referenz | Wofür | Warum nicht an der Dichte |
|---|---|---|---|
| `size-hidden` | `{line-1}` (1 px) | `tl-visually-hidden`: Breite und Höhe | Die Hülle soll **nichts** sein; ohne Maß erzeugt sie Scrollbalken. `border-width-sm` wäre Zweckentfremdung |
| `size-choice` | `{size-4}` | Kästchen, Kreis von Checkbox und Radio | Ein gezeichnetes Symbol, keine Bedienhöhe; die Trefferfläche ist das Label, `size-control` |
| `size-switch` | `{size-7}` | Breite der Schalterspur | Wie `size-choice` |
| `size-switch-knob` | `{size-3}` | Durchmesser des Schalterknopfs | Bleibt in der Spur, die nicht mitwächst |
| `size-indicator` | `{size-2}` | Punkt „Geändert“ am Feld-Label | Ein Zeichen am Text, kein Bedienelement; ersetzt `layer-accent` |
| `size-field-label-min` / `-max` | `{size-10}` / `{size-11}` | Label-Spalte des Formulars | Sie folgt der Textbreite, nicht der Zeilenhöhe; zwei neue Primitive `6rem` / `10rem` statt des Literals `minmax(6rem, 10rem)` |

Die Regel dahinter, wie bei `size-avatar-*`: ein Maß folgt der Dichte, wenn es eine Bedienhöhe ist
(`size-control`, `size-row`); ein gezeichnetes Symbol oder eine Spalte tut es nicht.

**Reihenfolge der Zustandsregeln.** *Befund:* Fehler und Warnung haben dieselbe Spezifität; stand die
Warnregel nach der Fehlerregel, gewann bei beiden Attributen die Warnung — das Attribut des Screenreaders
und das Bild widersprachen sich. *Entschieden:* Die Warnung steht **vor** dem Fehler, der Fehler gewinnt
durch die Reihenfolge; das CSS setzt „Fehler verdrängt Warnung“ selbst durch, nicht nur das TSX. **Deaktiviert
schlägt Fehler und Warnung:** Die Zustandsregeln der Gruppen (`tl-radio`, `tl-chip`) treffen nur
`:not(:disabled)`, und der Hover-Wächter steht in `:where(:not(:disabled))`, damit die Spezifität bleibt.
*Warum:* Ein deaktiviertes Element trägt keinen Prüfzustand; ohne die Regel schlug eine Gruppenregel
(0,3,0) das `:disabled` (0,2,0), und ein deaktiviertes Segment zeigte die Hover-Fläche.

**`aria-required` nur, wo ARIA es erlaubt.** `fieldStateAttrs(state, roleAllowsAria)` setzt `aria-invalid`
und `aria-required` nur an Rollen, die sie führen (`textbox`, `combobox`, `checkbox`, `switch`,
`radiogroup`, `listbox`); an `role="group"` verbietet ARIA beide. *Entschieden:* Die Pflicht einer Gruppe
zeigt der Stern im Feld-Label (`tl-form-field__required`), und `aria-labelledby` verweist auf das Label.
*Warum:* ARIA verbietet das Attribut an der Rolle; es bliebe ohne Wirkung und wäre ungültig. Der Parameter hieß zuerst `ariaInvalidAllowed`; er steuert zwei Attribute und heißt deshalb
`roleAllowsAria`.

**Der Lesewert ist ein anderes Element, und er hat fünf Regeln.** Die Ausgangsregel steht oben
(`tl-field-value`, kein Zustand). Beim Bauen dazu:

| Achse | Regel | Warum |
|---|---|---|
| Mehrzeilig | `tl-field-value--multiline`: eine Spalte, je Zeile ein `tl-field-value__text`, jede Zeile bricht um (`pre-wrap`, `overflow-wrap: anywhere`); in der Tabellenzelle wieder eine Reihe ohne Umbruch | Als `inline-flex`-Reihe lagen die Zeilen nebeneinander; eine Zelle hat eine Zeile. Ein langer Absatz, der mit Ellipse endete, verlöre seinen Inhalt |
| Link | **unterstrichen** | Farbe allein kennzeichnet keinen Link (WCAG 1.4.1); `text-link` löst den Kontrast, nicht die Kennzeichnung |
| Dropdown, Segmente, Chips | Der Lesewert aller drei Formen ist eine Liste in `span.tl-select__values`; Pill, Bild und `goto`-Link bleiben erhalten | Ein Lesewert „Bezeichnung, Komma“ hätte Rolle, Bild und Verweis verloren — das wäre ein Vertragsbruch |
| Checkbox | **Ausnahme:** `editable: false` bleibt ein Kästchen mit Haken — seit dem Final-Review schreibgeschützt, nicht deaktiviert (siehe unten) | Der Wert eines Booleans ist als Haken lesbarer denn als Text |
| Ein Helfer | `FieldValue` in `react-src/controls/form/` | Sonst wäre das Markup in fünf Controls kopiert worden |

**Die Feldgruppe hat einen Endplatz.** *Entschieden:* Solange Text im Feld steht und `clearable` gilt,
ersetzt der Löschknopf den Öffnen-Link; und die **Wurzel** des Textfelds trägt `tl-field-group` selbst.
*Warum:* Ein Wrapper, der beim ersten Tastendruck erschiene, würde das Feld neu einhängen und ihm den
Fokus nehmen; zwei Knöpfe am selben Ende brauchten zwei Reservierungen und verschöben den Text.

**Jeder Block, der `display` setzt, setzt auch `[hidden] { display: none }`.** *Befund:* `.tl-upload`
setzt `display: inline-flex` und schlägt damit das `hidden`-Attribut — der verborgene Upload-Knopf war
sichtbar. *Entschieden:* Die Regel gilt für jede Wurzelklasse des Pakets mit `display`; `hidden.test.mjs`
prüft sie an allen 24 Blöcken. Kein globales `!important`. *Warum:* Der Fehler entsteht in jedem Block, der
`display` setzt, und er ist im Specimen leicht zu übersehen — also ein Test, keine Erinnerung. Die
Elementklassen (`__message`, `__popup`, `__option`, `__fill`) sind nicht erfasst; sie sind unkritisch,
solange die Engine bedingt rendert.

**Busy: der Puls ist der Hinweis.** *Befund:* Ein Upload-Knopf in `aria-busy` zeigte keinen Zustand; die
Regel `.tl-button[aria-busy]` (`cursor: progress`) stand vor `:disabled` und verlor. *Entschieden:*
`aria-busy="true"` steht **nach** `:disabled`, und das Icon pulsiert (`opacity`, `duration-loop`,
`easing-standard`, alternierend, wie der Skeleton). Bei `disabled` ist der Puls der **einzige** Hinweis:
`.tl-button:disabled:hover { cursor: default }` (Spezifität 0,3,0) schlägt `[aria-busy]` (0,2,0), denn
#29675 braucht das Zeigen auf einen deaktivierten Knopf für den Tooltip mit dem Grund, und ein
Fortschrittszeiger über einem nicht bedienbaren Knopf wäre eine falsche Einladung; die Regeln aus #29675
stehen seit 01.10. in `button.css`. Der Vertrag sagt darum „Puls“, nicht „Zeiger“.

**Stapel-Übergang: acht Regeln des Altbestands lesen die Ebenen.** *Befund:* Der Altbestand stapelt bei
9000–12000, das Paket bei 1000–1200 (`layer-*`). Das Popup des Select, auf `layer-popover` gestellt,
lag dadurch **unter** dem Dialog-Backdrop (Literal 10000) — eine Regression gegenüber dem alten Popup.
*Entschieden:* Acht Regeln des alten Stylesheets lesen jetzt Tokens, definieren sie aber nicht (die
Übergangsregel aus CLAUDE.md):

| Ebene | Leser |
|---|---|
| `layer-overlay` | `.tlDialog__backdrop`, `.tlDrawer`, `.tlPhotoCapture__overlay` |
| `layer-popover` | `.tlMenu`, `.tlToolbar__dropdown`, `.tlColorInput__popup`, `.tlIconSelect__popup` |
| `layer-toast` | `.tlSnackbar` |

*Warum so viele:* Nur den Dialog umzustellen hätte Farb- und Icon-Popup (9000) und die Fotoaufnahme
(10000) über die Snackbar (`layer-toast`) gelegt. Bewusst geblieben sind DragShield (12000), Tooltip,
Pick-Highlight und der Sidebar-Flyout (1000): Er liegt auf der Ebene des Dialogs, und
**gleiche Ebene heißt DOM-Reihenfolge** — das Portal des Dialogs steht nach der Shell. Dasselbe gilt für
Dialog, Drawer und Foto-Overlay untereinander; ein Dialog aus dem Drawer hängt an der Reihenfolge der
Hosts (Sichtprüfung).

**Ein gewählter Chip ist die Marke.** *Befund:* Der gewählte Chip trug `surface-brand-subtle` mit Rand
`border-interactive` — neben einem angekreuzten Kästchen (volle Marke) sah „gewählt“ zweierlei aus, und in
einer Gruppe mit Fehler färbte der Fehlerrand auch den gewählten Chip, der dann wie ein ungewählter wirkte.
*Entschieden:* `.tl-chip[aria-pressed="true"]` ist `surface-brand` mit `text-on-brand`, beim Zeigen
`surface-brand-hover`; deaktiviert und gewählt wie `.tl-checkbox:disabled:checked`. Die Prüfzustände der
Gruppe treffen nur ungewählte, nicht deaktivierte Chips; `aria-invalid` an der Chip-Gruppe fällt, weil ARIA
es an `role="group"` verbietet. Das gewählte Segment bleibt, wie es ist (`surface-brand-subtle`); diese
Entscheidung betrifft nur Chips. *Warum:* Gewählt ist eine Aussage, und sie sieht an
jedem Control gleich aus; die Kontrastpaare für `text-on-brand` auf `surface-brand` und für `surface-brand`
auf den vier Gründen bestehen schon.

**Die Checkbox ist schreibgeschützt, nicht deaktiviert.** *Befund:* `editable: false` renderte das Kästchen
mit `disabled`; angekreuzt wurde die Füllung `border-disabled` — der Wert, den das Kästchen zeigen soll, lag
im vom Gate ausgenommenen Deaktiviert-Grau. *Entschieden:* Das Kästchen trägt `aria-readonly="true"` statt
`disabled`, die Engine blockiert Änderung und Klick; das Paket gibt ihm `cursor: default` und nimmt es aus
dem Zeigen (`:where(:not(:disabled):not([aria-readonly="true"])):hover`). `disabled` bleibt der inaktive
Zustand. *Warum:* Schreibgeschützt heißt „lesbar, nicht änderbar“, deaktiviert heißt „gerade nicht
verfügbar“ — nur das erste gilt für eine Leseansicht, und die Markenfüllung hält ihren Kontrast. Die
Schreibweise mit zwei `:not()` statt einer Liste hält Selektorlisten ohne Komma in Klammern.

**Felder haben keinen `padding-block`.** *Befund:* Mit `space-control-y` oben und unten wuchs ein Feld über
`size-control`, sobald ein Kind höher war als eine Textzeile — das Select mit Chips (`size-control-sm`) war
höher als das Textfeld daneben, und der Lesewert stand niedriger als das Feld, das er ersetzt.
*Entschieden:* `.tl-field` hat nur seitlichen Innenabstand; `space-control-y` gilt nur für
`tl-field--multiline`. Das Select rechnet seinen Innenabstand aus `size-control`, `size-control-sm` und
`border-width-sm`; der Lesewert im Formular hat `min-height: size-control`. Ein Test hält
`size-control-sm` + 2 × `border-width-sm` ≤ `size-control` in beiden Dichten. *Warum:* Die Höhe eines
Felds ist ein Token, keine Summe aus Innenabstand und Inhalt; eine Formularzeile springt sonst beim Wählen
und beim Wechsel in die Leseansicht.

**Die Marke als Vordergrund** (Punkt, Kästchen) prüft ein eigener Test im Paket, nicht die Paarliste:
`surface-brand` ist Grund für `text-on-brand`, und die Liste verbietet, dass ein Grund anderswo Vordergrund
ist. Werte und Gründe: „Text und Linien“, Nachgezogen 30.09.

**Offen für Welle 3:** gehobene Flächen — `surface-interactive-hover`/`-selected` auf `surface-overlay`
messen dunkel 1,13 / 1,01. Im Select-Popup trägt die Akzentlinie (`border-interactive`, 4,53) die
Hervorhebung, die Tönung ist nur ein Zusatz; die Paarliste hält die Linie mit 3,0 auf `surface-overlay`
und `surface-interactive-selected`. Menü und Dialog brauchen eigene Rollen für Zeigen und Auswahl auf
gehobenen Flächen — Entscheidung mit dem Menü. Zweiter Leser dieser Entscheidung ist der Skeleton: `surface-interactive-selected` ist auf dunklem `surface-overlay` kaum sichtbar (1,01).

### Zeigen auf allen Gründen: eine Skala, auf den hellsten Grund gestimmt (01.10.)

**Der Befund zuerst.** Das Problem ist nicht nur das Overlay. Die drei dunklen Interaktionsstufen sind auf
`surface-layer` (`gray-76`) gestimmt und versagen auf jedem helleren Grund:

| dunkel | `surface-base` 79 | `surface-layer` 76 | `-nested` 74 | `surface-overlay` 70 |
|---|---|---|---|---|
| `surface-interactive-hover` `gray-73` | 1,17 | 1,07 | **1,01** | 1,13 (dunkler als der Grund) |
| `surface-interactive-selected` `gray-69` | 1,33 | 1,23 | 1,13 | **1,01** |

Eine Tabelle in einem verschachtelten Panel hat dunkel also auch heute keinen sichtbaren Hover.

**Entschieden (Hendrik, 01.10.): eine Skala, nach der Regel der Neutralen** — die dunkelste Stufe, die auf
allen vier Gründen noch sichtbar ist. Dunkel: `surface-interactive-hover` → `gray-67` (vorhanden; 1,17 auf dem
Overlay, 1,42 auf `surface-layer`), `-selected` → `gray-64` (neu; 1,25 / 1,51; `border-interactive` darauf 3,63),
`-active` → `gray-60` (neu; 1,46 / 1,77). Hell bleibt unverändert (1,07–1,12 / 1,18–1,23 / 1,31–1,36). Preis:
auf `surface-layer` wird Zeigen dunkel kräftiger (1,42 statt 1,07).

**Verworfen: eigene Rollen je Grund** (`surface-overlay-hover`, `-nested-hover`, …). Sechs neue Rollen, und die
Komponente müsste ihren Grund kennen — eine Tabelle weiß nicht, ob sie in einem verschachtelten Panel liegt.
Die Kategorie bleibt geschlossen, `derive` rechnet die neuen Graustufen über `grauRampe` automatisch mit, der
Skeleton ist mitgelöst. Umsetzung mit Welle 3 (Menü ist der erste Leser).

### Gleiches wird zusammengelegt, nicht zweimal neu gebaut (01.10.)

**Der Befund zuerst.** Welle 3 fand drei Popups mit drei Verhalten (`TLMenu` ohne Portal, Spalten-Kontextmenü mit
`zIndex: 10000` inline und ohne Positionsrechnung, Toolbar-Dropdown als Portal mit Scroll-Folge). Die Nachprüfung
der Wellen 0–2 fand dasselbe Muster überall: acht handgeschriebene Positionsrechnungen (nur der Tooltip nutzt
`@floating-ui/react`), drei zeilengleiche Upload-Fassungen, vier Fokus-Zeichnungen in zwei Blautönen, sieben
Chevron-Zeichnungen in vier Zeichensätzen, acht Icon-Knopf-Arten mit Trefferflächen von 22 bis 32 px. Die
React-Controls sind analog zu den alten entstanden — jedes mit eigenem Verhalten.

**Entschieden (Hendrik, 01.10.):** Eine neue Haut macht nichts gleich. Findet eine Erkundung zwei Stellen, die
dasselbe zeichnen oder tun, gibt es vor der Spec eine Prognose je Befund — sichtbarer Unterschied heute, worauf
zusammenlegen, UX-Gewinn, berührte Stellen, Urteil *lohnt / lohnt mit der Welle / lohnt nicht* — und Hendrik
entscheidet. Gebautes wird bei jeder neuen Welle gegen die neuen Komponenten nachgeprüft. Die Tabellen vom 01.10.
stehen in `docs/migration/altlast.md` „Konsolidierung“: alle Zeilen angenommen; Welle 3 läuft als zwei gestapelte
PRs (3a Navigation und Popups, 3b Daten), Paket-internes vorher, der Welle-2-Nachzug Fehlermeldung als eigenes
Paket nach !1740, Upload und die restlichen Popups in Welle 4/5.

**Warum nicht einfach „mit der Welle“ erledigen:** Die Welle misst am leeren Block, nicht am gleichen Verhalten.
Ohne die Prognose wäre der Tabellen-Kontextmenü-Block leer geworden, und das Menü hätte weiter aus dem Viewport
geragt — mit neuer Klasse.

#### Entschieden beim Bauen (01.10., Welle 3a, Paket)

**Der Schrift-Reset hat keine Spezifität.** Befund im Review von P4: `.tl-button { font: inherit }` (Welle 1) und
`.tl-menu__item { font: inherit }` haben dieselbe Spezifität wie `.tl-type-*` in `base.css` und laden danach — der
Shorthand setzte Gewicht, Größe und Zeilenhöhe der Typo-Klasse zurück. Seit Welle 1 wurden Knöpfe darum in der
geerbten Body-Größe gezeichnet, nicht in `tl-type-label`, und so abgenommen. Entschieden: Resets stehen in
`:where(.tl-x) { font: inherit }`, ein Gate verbietet den `font`-Shorthand außerhalb von `:where`; **Knopf und
Menüeintrag lesen `tl-type-body`**, in Kraft `tl-type-body-strong` — `label` bleibt Feldbeschriftung, Hilfstext,
Badge und Menükopf. Reiter und Breadcrumb lesen ebenfalls `body`; Spaltenkopf bleibt `label-strong`.

**`[hidden]` auch an Elementen.** Das Gate `hidden.test.mjs` prüft nur Blockklassen; ein Reiter-Panel mit
`display: flex` blieb trotz `hidden` sichtbar (Review P5). Jedes Element, das `display` setzt, trägt jetzt die
Regel; die Gate-Erweiterung auf Elemente steht in `altlast.md` (N8).

**Prozent-Literale.** Die Maß-Regel des Lints endete auf `\b` und fing kein `%` (Review des Plans). Geschlossen in
P7; `50%` und `-50%` sind erlaubte Werte (Mittelachse), `100%` war es schon.

### Leisten und Hilfe: eine Höhe für Reiter und Toolbar, der Hilfeknopf ist leise (02.10.)

**Der Befund zuerst.** Bernhards Sichtprüfung von !1760 (02.10., Bilder `docs/bilder/2026-10-02-bernhard-*.png`):
„die Hilfe-Buttons sind jetzt aber echt massiv“ und „dafür, dass alles relativ viel Platz hat, sind die Tabbars
recht gestaucht“. Gemessen auf `docker:8008`: Ein Reiter war `size-control` hoch (32 px), die Toolbar daneben
40 px (`size-control` plus `space-2xs` oben und unten), die App-Leiste 56 px. Zwei gestapelte Reiterleisten
waren damit die engste Stelle im ganzen Rahmen. Der Hilfeknopf war ein gefüllter Kreis (`fa-solid`) mit 16 px in
`text-primary`. Daneben stand das Label mit 12 px in `text-secondary`: die kräftigste Farbe neben der leisesten
Schrift. Die Sidebar-Einträge mit 52 px sind Altbestand und kein Maßstab.

**Entschieden (Hendrik, 02.10.):**

* **`size-bar`, ein Dichte-Token für Leisten:** Control-Höhe plus `space-2xs` oben und unten, also 40 px
  normal und 36 px kompakt (`height-5` = `2.5rem` neu). Reiter lesen ihn als `min-height`, die Toolbar
  ebenfalls. Damit stehen Reiterleiste und Toolbar auf einer Höhe und laufen nicht wieder auseinander.
* **Der Hilfeknopf zeichnet den Umriss (`fa-regular fa-circle-question`) in `icon-secondary`,** unter dem
  Zeiger `icon-primary`. Die Größe bleibt `size-icon-sm` (Regel „Text daneben → `sm`“), die Trefferfläche bleibt
  `size-control-sm`. Leise wird er über Füllung und Farbe, nicht über die Größe: eine 12-px-Glyphe wäre ein
  Richtungszeichen, und die Icon-Regel bliebe nicht mehr eine Regel.

**Als Test:** `tokens.test.mjs` hält `size-bar` = `size-control` + 2 × `space-2xs` in beiden Dichten;
`components.test.mjs` hält `min-height: size-bar` an Reiter und Toolbar; `form.test.mjs` hält die Farben des
Hilfeknopfs.

### Welle 3b: Daten (02.10.)

Spec `docs/superpowers/specs/2026-10-02-welle-3b-daten-design.md`. Neu entschieden über das Welle-3-Brainstorming
(01.10.) hinaus:

* **TLText kommt mit** (Hendrik). Fast jede Tabellenzelle ist ein TLText; ließe man seine drei Alt-Blöcke stehen,
  stünde die neue Tabelle voll alter Schrift und alter Tonfarben. Varianten werden `tl-type-*`, Töne `data-tl-tone`.
  Der Platzhalter verliert das Kursiv: die Typo kennt keinen Schnitt (siehe „Typo“).
* **Ton `accent` fällt** (Hendrik). „In der Farbe der Bedienelemente“ heißt `text-link` — nicht klickbarer Text sähe
  aus wie ein Link. Hervorhebung ist `strong`. Bedeutung statt Farbe.
* **Umsortieren auch ohne Ziehen** (Hendrik). WCAG 2.2, 2.5.7 (AA) verlangt für jede Ziehbewegung einen Weg ohne
  sie. Alt + Pfeil verschiebt um eine Stelle, ein Live-Bereich sagt die Position an — einmal in `useListReorder`,
  damit für Spaltenwahl, Werteliste und Select-Chips zugleich.
* **Die Zeilenhöhe misst der Client** (Hendrik). Der Server schickte fest 36 px, unabhängig von `data-tl-density`;
  kompakt wäre die Tabelle die einzige Stelle ohne Verdichtung gewesen. Zwei Quellen für dasselbe Maß driften —
  darum fällt `rowHeight` aus dem Zustand, und der Browser liest `--tl-size-row`.
* **Der Cursor-Ring gehört `base.css`.** Tabelle und Baum führen den Cursor virtuell (`aria-activedescendant`); den
  Ring zeichnet der Basis-Ring innen am Cursor, sobald der Behälter `:focus-visible` ist — die Fokusregel aus 3a
  („`focus-ring` nur im Basis-Ring“) bleibt ohne Ausnahme.
* **Tönung ist ein Attribut.** `data-tl-role` an Pill, Chip, Segment, Avatar und Alert, erzeugt aus einem Generator;
  Avatar und Alert wechseln mit, weil ein Generator zwei Mechanismen nicht rechtfertigt. Keine Pill in der Kapsel.
* **Eine Zeile schwebt nicht, auch nicht fixiert.** Die Kante fixierter Spalten ist eine Linie `border-emphasis`,
  kein Schatten (vgl. „Elevation“).
* **Die Deckkraft beim Ziehen bleibt eine Zahl** (`0.4`): einheitenlose Werte lässt das Lint bewusst zu; die Regel
  steht jetzt einmal statt dreimal.

**Nach dem Plan-Review entschieden (07.10., Hendrik):**

* **Fehler- und Warnlinie halten auch auf der ausgewählten Zeile 3,0** — Tausch der Stufen und neue Stufe `red-34`,
  begründet unter „Nachgezogen 07.10. (Welle 3b)“ bei den Status-Rollen. Der Platzhalter auf ausgewählter Fläche ist
  kein Paar: er müsste dunkel heller werden als `text-secondary`; gepaart wird er auf Grund, Layer und
  verschachteltem Layer.
* **„Teilweise“ ist `indeterminate`, kein `aria-checked`.** ARIA in HTML verbietet `aria-checked` am nativen
  Kästchen; der Browser meldet `indeterminate` selbst als „gemischt“. Eine Quelle statt zwei, die sich widersprechen
  können.
* **Die Pill ist die Wurzel.** TLText mit `appearance=pill` rendert `span.tl-pill` direkt und hängt die
  Text-Attribute daran — keine Hülle `tl-text` um die Pill.
* **Das Raster ist innen.** `role=grid`/`treegrid` sitzt am Element aus Kopf und Körper (`tl-table__grid`), weil ein
  Raster nur Zeilen besitzen darf; Filterleiste, Spaltenwahl und Fixiergrenze liegen im Rahmen darum. Das Raster
  hält auch den Fokus und `aria-activedescendant` (am Körper `rowgroup` wäre es nicht erlaubt).
* **Stark ist eine Typo-Klasse, Platzhalter ein Ton.** `TextElement` hat kein Form-Attribut: `strong` wird
  `tl-type-body-strong`, der Platzhalter der neue Ton `placeholder` — das Vokabular gewinnt einen Wert, nachdem es
  `accent` verloren hat.
* **Eine Filter-Glyphe.** Font Awesome Free hat keinen leeren Trichter; aktiv heißt `icon-primary` **und**
  Beschriftung „Filter (aktiv)“, damit der Zustand nicht an der Farbe allein hängt (WCAG 1.4.1).
* **Historische Pläne sind nicht im Gate.** `docs/plans/` bekommt je Datei einen Vermerk wie in 3a; `docs/faq/` wird
  umgeschrieben und geprüft.
* **Gleiches mit master zusammengelegt (07.10., nach dem Vorziehen auf master):** Bernhards Paket-Branch
  `CWS/CWS_29752_hoefe` ist nach `main` gemergt; 3b baut darauf. Der Entfernen-Knopf der Kapsel übernimmt Bernhards
  Kreis aus dem Select-Chip — eine Regel für beide. Die Alert-Teile, die #29652 ins alte Stylesheet gelegt hat
  (`tl-alert__body`, `__message`, `__actions`, `__close`), wandern ins Paket; die dritte Spalte des schließbaren
  Alerts folgt aus dem Inhalt (`:has(> .tl-alert__close)`), nicht aus einem Modifier. `.tl-choice-group--vertical`
  (#29654) stand im Tabellenblock und geht ebenfalls ins Paket.
* **Nur ein Fehler unterbricht.** `role="alert"` hat allein der Alert `error`; `warning`, `info`, `success` sind
  `role="status"`. Ein Alert unterbricht den Screenreader sofort — eine Warnung ist nicht dringend genug dafür.
* **Der Auf-/Zuklapper in einer Zeile zeigt mit dem Schleier.** Eine gezeigte oder ausgewählte Zeile hat schon die
  Fläche, die der Toggle zum Zeigen nähme; deckend wäre er dort unsichtbar. `surface-state-hover`/`-active` ist
  durchscheinend und trägt auf jedem Zeilengrund (Bernhards Höfe, „Höfe sind durchscheinend“).

**Beim Bau entschieden (07.–08.10., Orchestrator, aus den Task-Reviews):**

* **Kein Browser-Outline am Behälter mit Cursor.** Tabelle und Baum führen den Fokus am Behälter, den Ring zeichnet
  der Cursor. `base.css` setzt genau dort `outline-style: none` — die einzige Ausnahme vom Lint „der Ring ist
  Pflicht“, an einem Selektor, mit Test, der den Cursor-Ring daneben verlangt. Ohne gerenderte, **sichtbare**
  Cursorzeile setzt die Engine `aria-activedescendant` nicht; dann trägt der Behälter den gewöhnlichen Ring (WCAG
  2.4.7).
* **Ablageziele haben ihre eigene Fläche in `:where`.** Zeigen und Auswahl an Zeile, Knoten und Listeneintrag dürfen
  die Ablage-Marke nicht verdecken; ein gemeinsamer Test hält das für alle Ziele von `drag.css`.
* **Stapel:** Tabellenwurzel, Rahmen, Körper und jede Kopfzelle isolieren ihren Stapel. Marke (`::before`) und Ring
  (`::after`) liegen auf `layer-sticky`, haftende Zellen auf `layer-raised`; der Kopf liegt außerhalb des
  Rollbehälters und wird darum nie übermalt.
* **Gleiches zusammengelegt, beim Bauen gefunden:** ein Helfer für „ist das ein Editor“ (Tabelle, Baum), einer für
  den Zeitpunkt von „wird gezogen“ (`afterDragImage`: Tabelle, Baum, Liste), einer für „Fokus nach Entfernen“
  (Select-Chip, Filterkapsel), ein `SearchField` (Tabellensuche, Spaltenwahl), eine Datei für Glyphnamen
  (`bridge/icons.ts`) — Letztere auch für den späteren Wechsel der Icon-Bibliothek.
* **Fokus geht nie verloren:** Löschen, Entfernen, Formular schließen geben den Fokus an Feld, Nachbarn oder Raster.
* **Die Liste mit Suche hält ihre Höhe** — **nachgezogen 12.10. (Sichtprüfung):** nicht mehr die Liste selbst
  (`size-popover-max`), sondern ihr Behälter. Die feste Listenhöhe lief im kleineren Fensterkörper über: zwei
  Scrollbereiche ineinander, die Suche scrollte nach einer Pause weg. Jetzt füllen Suche und Liste ihren Behälter als
  Spalte mit Innenabstand `space-md` (der Fokusring der Suche steht ganz im Bild), nur die Liste scrollt, und die
  Spaltenwahl öffnet ihr Fenster 70 % hoch — so springt es beim Tippen nicht.
* **Kopf und Körper scrollen gemeinsam** (12.10., Sichtprüfung, Hendrik): der Kopf folgte nur dem Körper — ein Tab auf
  einen Kopfknopf außerhalb des Bildes verschob ihn gegen die Zeilen (auch master), und über dem Kopf tat das Mausrad
  nichts. Jetzt scrollt der Kopf selbst (ohne eigenen Balken), und der Körper folgt ihm.
* **`aria-sort` nur an der ersten Sortierstufe** (ARIA: eine Spalte zur Zeit); weitere Stufen zeigt das Badge.
* **Die Tabelle hat keine Ladezeile**: fehlende Zeilen sind Platzhalter (`aria-hidden`), das Raster ist `aria-busy`.
  Wo eine Ladezeile eine eigene Rolle mit Namen hat (Baum), ist der Fortschritt darin `aria-hidden`; sonst trägt der
  Fortschritt den Namen (`aria-labelledby` auf seine Beschriftung).
* **Alert ohne Modifier:** Spalten folgen dem Inhalt (`:has` für Icon und Schließen), das Icon darf fehlen; der
  Schließen-Knopf ist derselbe Icon-Knopf wie Entfernen im Select.
* **Gruppenzeile stark** über `css-class` `tl-type-body-strong` am Text der Zelle (A4-Muster). Gruppenwerte
  aus Fabrik-Zellen (Lesewert) blieben normal — **entschieden 09.10. (Hendrik): der Lesewert erbt die Schrift vom
  Ort.** `tl-field-value` setzt keine Typo-Klasse; `tl-form-field__input`, Tabellenkörper und Baum tragen
  `tl-type-body`, jede Zelle einer Gruppenzeile `tl-type-body-strong`. Verworfen: der Server reicht jedem Lesewert
  die Klasse einzeln durch (eine Leitung je Control, wie heute beim Text). Ein Eingabefeld behält seine Klasse —
  Eingaben erben die Schrift nicht —, ein Text (`tl-text`) auch: er setzt seine Variante selbst und bekommt die
  starke Klasse weiter vom Server. Als Test: `field.test.mjs` „der Lesewert erbt die Schrift vom Ort“.

**Befund dazu:** 282 Zeilen Tabellenregeln (3565–3846) standen ohne Überschrift im alten Stylesheet; die Ratsche
schlug sie TLJobStatus zu. Die Blockmessung trifft nur, was eine Überschrift trägt — beim Ausschneiden wird TLJobStatus
auf seinen wahren Stand gesetzt.

#### Ziehen sichtbar machen (entschieden 12.10., Hendrik — gebaut mit #29826 nach Bernhards !1825)

**Befund der Sichtprüfung.** Eine ziehbare Zeile zeigt nur den Mauszeiger `grab`; es gibt keinen Griff, und kein Ziel
zeigt sich, bevor der Zeiger es berührt. Hendrik fand nicht heraus, wo er ein Ticket fassen und wohin er es legen kann;
sein Versuch, ein Ticket auf eine andere Gruppe derselben Tabelle zu legen, lief ins Leere (die Gruppe ist kein Ziel).

**Entschieden:**
* **Griff beim Zeigen:** eine ziehbare Zeile (Tabelle, Baum, Baumtabelle) zeigt vorn den Griff der Spaltenwahl, solange
  der Zeiger über ihr steht oder sie den Tastatur-Cursor hat; der Mauszeiger `grab` bleibt.
* **Ziele zeigen sich mit dem Zugbeginn:** jedes Element, das die gezogene Art annimmt, trägt einen ruhigen gestrichelten
  Rand (neuer Zustand in `drag.css`); über dem Ziel übernehmen die Marken davor/danach/darauf/abgelehnt wie bisher.
* **Ein Griff steht vorn, überall** (Hendrik 12.10., Konsistenz): Tabellenzeile, Baumknoten, Eintrag der Spaltenwahl,
  Werteliste, Select-Chip. Zeilen und Listeneinträge zeigen ihn beim Zeigen oder bei Fokus.
* **Gebaut nach !1825** auf Bernhards Ablage-Protokoll, nicht davor. Vorschlag an Bernhard: Ablegen auf eine
  Gruppenzeile setzt den Gruppenwert.

**Verworfen:** Griff immer sichtbar (unruhig bei vielen Zeilen); nur der Mauszeiger (reicht nicht, gezeigt).

#### Die Spaltenwahl neu: ein Ebenen-Panel (entschieden 12.10., Hendrik — #29825, Spec `2026-10-12-spaltenwahl-ebenen-design.md`)

**Befund der Sichtprüfung.** Die Zeile der Spaltenwahl liest sich verkehrt herum: vorn der Griff, dann ein
Ebenen-Icon „nach dieser Spalte gruppieren“, erst an dritter Stelle das Kästchen, dann der Name. Griffe stehen in jeder
der 54 Zeilen; das Gruppier-Icon steht 54-mal für eine Wahl, die nur eine Spalte haben kann, und sagt nicht, was es tut.

**Entschieden — die Spaltenwahl wird ein Ebenen-Panel wie in Figma:**
* **Zeile = Griff · Name · Schloss · Auge.** Der Griff vorn („Ein Griff steht vorn, überall“), Schloss und Auge
  rechtsbündig; alle drei erscheinen beim Zeigen oder bei Fokus, ein gesetzter Zustand (Auge zu, Schloss zu) bleibt
  sichtbar. Kein Kästchen mehr.
* **Ausgeblendet bleibt am Platz,** der Name blass — keine getrennten Bereiche Sichtbar/Ausgeblendet.
* **Das Schloss fixiert die Spalte:** fixierte Spalten stehen als Block „Fixiert“ oben; Schloss und Fixiergriff
  zwischen den Köpfen schreiben dieselbe Anzahl.
* **Das Gruppieren der Zeilen verlässt den Dialog;** es bleibt im Kontextmenü am Spaltenkopf.
* **Stufe 2: Spaltengruppen** — Spalten aufeinanderziehen ergibt eine benannte Gruppe, in der Tabelle ein Band über
  ihren Köpfen. Die Logik baut Bernhard, das Aussehen wir; ein Pivot (Zeilen über mehrere Ebenen gruppieren) geht als
  Idee an ihn.

**Verworfen (am selben Tag zuerst entschieden, dann ersetzt):** Gruppieren als ein Select über der Liste; Kästchen vorn
und Griff rechts; zwei Bereiche Sichtbar/Ausgeblendet. Ebenso verworfen: Gruppieren ins Kopf-Menü allein ohne
Spaltengruppen, das Icon behalten und nur erklären.

**Nachgetragen beim Bau (12.10., Hendrik):**
* **Ausgeblendet ist blass, nicht deaktiviert:** der Name steht in `--tl-text-secondary`, nicht in `--tl-text-disabled`.
  Der Eintrag bleibt bedienbar — ziehen, fixieren, einblenden —, und die WCAG-Ausnahme, unter der `text-disabled` ohne
  Gate steht, gilt nur für inaktive Elemente; mit `text-disabled` (hell etwa 1,7:1) wären bei vielen ausgeblendeten
  Spalten große Teile der Liste kaum lesbar. Das zugeklappte Auge trägt den Zustand mit. Wieder das Muster „ein Token,
  mehrere Aufgaben“: `text-disabled` heißt „nicht bedienbar“, nicht „blass“.
* **„Am Platz“ gilt im Dialog.** Die Tabelle merkt sich nur die gezeigten Spalten: nach „Ok“ und erneutem Öffnen stehen
  ausgeblendete Spalten hinten, eine ausgeblendete fixierte verliert ihr Schloss. Dass der Tabellenzustand die volle
  Reihenfolge samt ausgeblendeter und fixierter Spalten trägt, ist ein Eingriff in den Kern (`TableViewState`,
  Persistenz je Person) und geht als eigenes Ticket an Bernhard — kein zweiter Zustand in `layout.react`.
* **Fokus heißt Tastaturfokus (Review !1852, Bernhard):** Griff, Schloss und Auge erscheinen beim Zeigen oder wenn ein
  Element der Zeile den *Tastatur*fokus hat (`:has(:focus-visible)`), nicht bei jedem Fokus (`:focus-within`). Nach einem
  Mausklick bleibt der Fokus im Knopf; mit `:focus-within` blieben Auge und Schloss der Zeile stehen, auch wenn der Zeiger
  weg ist — dauerhaft sichtbar sind aber nur gesetzte Zustände (Schloss zu, Auge zu).
* **Ein Wort fürs Fixieren:** auch das Kontextmenü am Spaltenkopf sagt „Bis hier fixieren“ / „Fixierung aufheben“
  statt „feststellen“.

**Nachgetragen im Review !1852 (15.10., Bernhard; Hendrik entschied Weg A):**
* **Fixiert heißt sichtbar — vorerst.** Bernhard fand: eine ausgeblendete Spalte ließ sich fixieren, sie rückte in den
  Block, blieb unsichtbar und war nach erneutem Öffnen wieder gelöst; eine fixierte ließ sich ausblenden und blieb im
  Dialog fixiert. Der Dialog zeigte damit einen Zustand, den die Tabelle nicht speichern kann: `frozenColumnCount` zählt
  einen Anfang *sichtbarer* Spalten, eine ausgeblendete trägt kein Schloss. Jetzt gekoppelt: Ausblenden einer fixierten
  Spalte löst sie (sie rückt direkt hinter den Block), Fixieren einer ausgeblendeten — per Schloss oder per Ablegen im
  Block — blendet sie ein. Die Namen sagen beides („… ausblenden und Fixierung lösen“, „… einblenden und fixieren“).
* **Die Tooltips an Auge und Schloss sagen nur „Einblenden“ / „Ausblenden“ bzw. „Fixieren“ / „Lösen“ (Hendrik).** Sie
  stehen neben der Zeile, der Spaltenname wäre doppelt. Die zugänglichen Namen (`aria-label`) behalten Spalte und Kopplung, denn ein Screenreader liest den
  Knopf für sich allein.
* **Das Ziel bleibt unabhängig wie in Figma.** Eine fixierte Spalte kurz auszublenden und sie beim Einblenden wieder im
  Block zu haben, ist ein berechtigter Fall (Hendrik). Er braucht den Tabellenzustand aus #29828 (volle Reihenfolge,
  ausgeblendete und fixierte Namen); mit ihm wird die Kopplung zurückgenommen. Verworfen: gleich entkoppeln (B — !1852
  wartet auf Kernarbeit), Schloss an ausgeblendeten Spalten sperren (C — dieselbe spätere Rücknahme, ohne Vorteil).

**Nachgetragen beim master-Merge in 3b (14.10.):**
* **Hervorgehobene Zeilen sind eine Rolle, die API bleibt eine Klasse (#29815).** Auf master gibt `row-class` einer
  Zeile oder Zelle eine Klasse; `tl-status-error|warning|success|info` tönen sie. Die Klassen bleiben die API — sie
  stehen in Bernhards Doku und in Anwendungen —, aber `TLTableView` übersetzt sie in `data-tl-role` an Zeile bzw.
  Zelle, und das Paket zeichnet die Rolle über `@tl-roles: status` wie Pill, Chip und Alert. So bleibt „Rollen sind
  Attribute“ ohne Ausnahme, und kein Status steht zweimal als Regel. Die Auswahl gewinnt (an einer ausgewählten Zeile
  setzt das TSX keine Rolle), Zeigen ändert die Tönung nicht, haftende Zellen erben sie. Sichtbar anders als auf master:
  die Linie unter einer getönten Zeile nimmt `status-<rolle>-border` an. Der Generator kennt dafür die Form
  `@tl-roles: <art> :where(<ziel>)` — Regeln ohne Spezifität für ein Ablage-Ziel, dessen Fläche das Ablegen übermalt.
* **Verlauf statt Maske vor der Spaltenwahl (#29757).** Laufen Spalten unter der Spaltenwahl weiter (Kopf
  `data-tl-state~="covered"`), blenden die Überschriften vor ihr aus. master tut das mit einer Maske am Kopf, weil seine
  Zeilen durchsichtig sind und die Fläche darunter je Ort wechselt. Im Paket ist die Tabelle immer `surface-layer`:
  ein Verlauf in dieser Fläche vor dem Knopf genügt, und die Linie unter dem Kopf bleibt stehen (eine Maske nähme sie
  mit).
* **Kein `--tl-current-surface` (#29757).** master malt haftende Zellen in der Fläche „unter“ der Tabelle, die jeder
  Behälter als `--tl-current-surface` setzt. Im Paket malt jede Zeile ihre Fläche selbst und haftende Zellen erben
  sie (`background: inherit`) — die Variable hätte keinen Leser und stünde im Namensraum `--tl` außerhalb des Pakets.
* **Zeilenzahl unter der Tabelle (#29757)** als `tl-table__footer` (Live-Bereich) mit `tl-table__row-count` und
  `tl-table__selection-count`, in `surface-layer` wie die Filterleiste.

### Auswahlmarken zeigen einen Hof (06.10.)

> **Farbe des Hofs geändert (06.10., Bernhard):** der Hof ist durchscheinend, `surface-state-hover` /
> `surface-state-active` statt der deckenden `surface-interactive-hover` / `-active`. Begründung, Werte und
> Messung unter „Höfe sind durchscheinend“ (06.10.). Wer, Auslöser, Größe, Form, Wächter und Fokus unten gelten
> weiter; „Warum deckend und neutral“ und der verworfene durchscheinende Hof sind damit überholt.

**Der Befund zuerst.** Kästchen, Radio und Schalter zeigten das Zeigen nur am Rand (`border-control` →
`border-emphasis`), und am angekreuzten Kästchen gar nicht — dort ist der Rand die Marke. Die Trefferfläche ist
das Label (`size-control`), gezeichnet sind 16 px (`size-choice`): wer über den Text fährt, sah an der Marke
nichts. MUI, Material und Fluent zeigen an derselben Stelle eine Fläche um die Marke. Anlass: Trac #29752
(„kleine React-UI-Verbesserungen“).

**Entschieden (06.10.):**

| Achse | Regel |
|---|---|
| Wer | `.tl-checkbox`, `.tl-radio`, der Schalter (`.tl-checkbox--switch`) — sonst niemand |
| Auslöser | `:hover`/`:active` an der Marke **und** am `tl-choice` um sie; die Trefferfläche ist das Label |
| Farbe | Zeigen `surface-interactive-hover`, Drücken `surface-interactive-active` — deckend, angekreuzt wie leer |
| Größe | Ausdehnung (`size-control` − `size-choice`) / 2: der Hof füllt die Marke auf die Trefferfläche auf, folgt damit der Dichte (8 px normal, 6 px kompakt) |
| Zeichnung | `box-shadow: 0 0 0 <Ausdehnung> <Fläche>` — zeichnet nur außerhalb der Marke, verschiebt nichts, braucht kein Pseudo-Element; Übergang `duration-fast`, `easing-standard` |
| Form | die der Marke: Kreis am Radio, Quadrat mit `radius-sm` + Ausdehnung am Kästchen, Pille um die Spur am Schalter |
| Wächter | kein Hof bei `:disabled` und `aria-readonly="true"`, dieselbe `:where`-Klammer wie beim Rand |
| Fokus | Fokus allein zeigt keinen Hof; der Fokus bleibt der eine Ring aus `base.css` |

**Warum deckend und neutral.** Das Lint verbietet `color-mix`, `rgba` und Farbliterale in Komponenten, und Zeigen
ist hier eine deckende Fläche. „Zeigen auf allen Gründen“ (01.10.) hat `surface-interactive-hover` genau dafür
gestimmt, auf allen vier Gründen sichtbar zu sein (hell 1,07–1,12, dunkel 1,17–1,54; Drücken 1,31–1,36 bzw.
1,46–1,93). Der Markenton für angekreuzte Marken, wie MUI ihn tönt, fällt an genau dieser Regel durch:
`surface-brand-subtle-hover` misst dunkel auf `surface-overlay` **1,00**, `surface-brand-subtle` dunkel auf
`surface-layer` 1,04 — im Dialog wäre der Hof weg. Ein Drücken-Gegenstück dazu gäbe es auch nicht; es wäre ein
neues Token für eine schwächere Lösung.

**Warum die Form der Marke und kein Kreis am Kästchen.** Ein echter Kreis um ein Quadrat braucht ein eigenes,
positioniertes Pseudo-Element (`::after` trägt den Haken), und es müsste mit negativem `z-index` hinter der Marke
liegen. Dann malt es unter dem Hintergrund jedes Vorfahren im selben Stapelkontext — TLCheckbox rendert das
Kästchen ohne Label in Tabellenzellen und Formularen, dort verschwände der Hof hinter der Zeile. Der Schatten hat
das Problem nicht. 4 + 8 px Ecke an 32 px wirken ohnehin fast rund.

**Warum am Schalter die Spur, nicht der Knopf.** MUI legt den Hof um den Knopf, durchscheinend über die Spur. Ein
deckender Hof um den 12-px-Knopf mit 32 px Durchmesser verdeckte die 16 px hohe Spur fast ganz; hinter die Spur
legen ginge nur mit dem `z-index`-Weg oben. Der Hof umschließt darum die ganze Marke — beim Schalter ist das die
Spur.

**Fokus und Hof.** Der Ring liegt mit Abstand und Breite 4 px außerhalb der Marke, der Hof reicht 6–8 px: wird
eine fokussierte Marke gezeigt oder gedrückt, liegt der Ring ganz auf dem Hof. Die Paarliste hält deshalb
`focus-ring` mit 3,0 auch auf `surface-interactive-hover` und `-active` (hell 5,21 / 4,28, dunkel 3,87 / 3,10);
`derive` führt den Ring im Probe-Theme dafür nach (`#E8541E` → `#DD4A0D`). Fokus allein bekommt keinen Hof, anders
als bei MUI: der Fokus ist ein Ring, und „jede Fokusdarstellung, die nicht `outline` ist“, bleibt ein Verstoß.

**Verworfen:**

* ~~**Durchscheinender Hof aus `currentColor` wie MUI** (`alpha(primary, 0.04)`): verbietet das Lint, und zu Recht —
  eine Deckkraft über unbekanntem Grund hat keinen messbaren Kontrast.~~ Umgekehrt am 06.10.: der Grund ist
  bekannt (die vier Gründe und das Feld), gemessen wird die Schicht über ihm — „Höfe sind durchscheinend“.
* **Hof auch an Icon-Knöpfen, Toggles, Chips, Toolbar-Knöpfen:** die sind in W4/W5 (`altlast.md`) quadratisch
  zusammengelegt und zeigen das Zeigen als eigene Fläche. Ein Hof dort wäre eine zweite Zeigen-Form für dasselbe.
* **Ein eigenes Token für die Ausdehnung:** sie ist eine Rechnung aus zwei bestehenden Maßen und folgt so der
  Dichte von selbst; ein drittes Maß könnte davon abweichen.

**Preis:** Der Hof ragt 6–8 px über die Marke hinaus — links über die Kante des Labels, rechts bis an den Text
(`space-xs` = 8 px Abstand). Er verschiebt nichts, aber ein Behälter mit `overflow: hidden` schneidet ihn, wie den
Fokusring (siehe „Fokus“).

**Als Test:** `choice.test.mjs` hält die acht Auslöser (Marke und Label, Zeigen und Drücken, Kästchen und Radio)
mit Ausdehnung und Fläche, den Wächter an jedem, Drücken nach Zeigen, keinen Hof an Fokus, Knopf, Segment oder
Chip und den Hof über dem Ring in beiden Dichten; ein zweiter Test hält den Hof aus jedem anderen Block heraus. Das
Lint kennt den Hof als dritte erlaubte `box-shadow`-Form (`0 0 0 <Maß aus Tokens>` in `surface-interactive-hover`
oder `-active`), `lint-css.test.mjs` prüft Literal, Unschärfe, Versatz und Fokusfarbe als Verstöße. `pairs.mjs`
führt die zwei neuen Fokus-Gründe.

### Knöpfe im Feld zeigen eine Stufe kräftiger (06.10.)

**Der Befund zuerst.** Die Icon-Knöpfe im Feld — Löschen im Select (`tl-select__controls`), Löschen und Link
öffnen im Textfeld (`tl-field-group`), der Entfernen-Knopf im Chip — sind `tl-button--icon --sm --ghost` und
zeigen beim Zeigen `surface-interactive-hover`. „Zeigen auf allen Gründen“ (01.10.) hat diese Stufe auf
`surface-base`, `-layer`, `-nested` und `-overlay` gestimmt, nicht auf `surface-field`. Hell liegt sie dort
bei **1,01** (`gray-4` auf `gray-3`): kein sichtbares Zeigen. Dunkel 1,26 — sichtbar. Der Pfeil des Select
(`tl-select__arrow`) zeigte gar nichts, der Kalenderknopf des Datumsfelds war das ungestaltete
`::-webkit-calendar-picker-indicator`. Anlass: Trac #29752.

| auf `surface-field` | hell | dunkel |
|---|---|---|
| `surface-interactive-hover` | **1,01** | 1,26 |
| `surface-interactive-selected` | 1,11 | 1,35 |
| `surface-interactive-active` | 1,23 | 1,58 |
| `-active` auf `-selected` (Drücken gegen Zeigen) | 1,11 | 1,17 |

**Entschieden (06.10.): im Feld rückt die Skala eine Stufe vor** — Zeigen `surface-interactive-selected`,
Drücken `surface-interactive-active`. Vorhandene Rollen, kein neues Token; 1,11 hell entspricht dem, was
Zeigen auf den anderen Gründen hat (1,07–1,12). Es gilt für jedes Icon im Feld, das man treffen kann:

| Wer | Selektor | Form |
|---|---|---|
| Endknopf des Textfelds | `.tl-field-group > .tl-button--ghost:not(:disabled)` | der Knopf selbst |
| Löschen im Select | `.tl-select__controls > .tl-button--ghost:not(:disabled)` | der Knopf selbst |
| Pfeil des Select | `.tl-select:not([aria-disabled="true"]) .tl-select__arrow` | `span` wird ein Quadrat `size-control-sm`, Ecke `radius-sm`, Icon mittig; bleibt `aria-hidden`, ohne Fokus, der Klick trifft die Wurzel |
| Kalenderknopf (Datum, Zeit, Zeitpunkt) | `.tl-field:enabled::-webkit-calendar-picker-indicator` | Quadrat `size-control-sm`, Ecke `radius-sm`, natives Icon auf `size-icon-sm` eingerückt, `cursor: pointer`; `background-color`, weil das Icon das Hintergrundbild ist |

Am Ende des Feldes stehen die Knöpfe `space-2xs` vom Rand: im Select als `padding-inline-end` der Wurzel, am
Kalenderknopf als negativer Rand um `space-control-x` − `space-2xs`. Der Wächter `:not(:disabled)` ist
Pflicht: `field.css` und `select.css` stehen nach `button.css` und schlügen sonst dessen leeren
Deaktiviert-Zustand bei gleicher Spezifität. Das Pfeil-Icon (`icon-secondary`) hält auf beiden Flächen 3,0
(hell 5,98 / 5,39, dunkel 4,27 / 3,64); die Paarliste führt die zwei Paare. Die Sichtbarkeit selbst hält
`tokens.test.mjs` (≥ 1,1 auf `surface-field` und Drücken gegen Zeigen, wie der Test vom 01.10.) — nicht die
Paarliste: dort ist jede `surface-interactive-*` ein Grund, und ein Grund darf kein Vordergrund sein.

Das Icon des Kalenderknopfs zeichnet der Browser; es folgt `color-scheme`, das `tokens.css` je Modus setzt
(dunkel hell gezeichnet, im Specimen geprüft). Jede Regel mit dem Pseudo-Element steht allein: ein
unbekanntes Pseudo-Element verwirft die ganze Selektorliste. **Firefox** kennt es nicht und zeichnet einen
eigenen Knopf, den kein Stylesheet erreicht — dort bleibt das native Bild, ohne Ersatz.

**Der Entfernen-Knopf im Chip liegt auf der Pille, nicht auf dem Feld.** Die neutrale Pille *ist*
`surface-interactive-selected`: die Feld-Stufe misst darauf 1,00. Auf allen 14 Pillenflächen (neutral, Marke,
vier Bedeutungen, acht Kategorien):

| auf den Pillenflächen | hell | dunkel |
|---|---|---|
| `surface-interactive-hover` (Ghost-Stufe) | 1,00–1,10 | 1,07–1,47 |
| `surface-interactive-selected` | 1,00–1,09 (neutral 1,00, Marke 1,02) | 1,00–1,57 |
| `surface-interactive-active` | 1,11–1,21 | 1,17–1,84 |

**Entschieden (06.10.): am Chip zeigen und drücken beide `surface-interactive-active`** — die einzige
vorhandene Stufe, die sich auf jeder Pille abhebt. Selektor `.tl-select__chip > .tl-button--ghost:not(:disabled)`
mit `:hover` und `:active` in einer Regel. Drücken hat am Chip keine eigene, kräftigere Stufe; der Knopf
entfernt den Chip beim Loslassen ohnehin, ein Drücken-Bild sieht man kaum.

**Form am Chip (06.10., nach Sichtprüfung):** der Knopf liegt ganz innerhalb des Pillenrandes — ein Kreis
(`radius-round`), konzentrisch zum runden Ende, Durchmesser `size-control-sm` − 2 × `border-width-sm` −
`space-2xs` (18 px in beiden Dichten), Lücke `space-2xs` / 2 (2 px; ein `space-3xs` gibt es nicht) oben, unten
und als Innenabstand am Ende. Das Icon bleibt `size-icon-sm`. Die Trefferfläche sinkt damit von 24 auf 18 px;
WCAG 2.5.8 hält über die Ausnahme „Abstand“, denn der nächste Knopf liegt um das Label der Nachbarpille weiter.

**Verworfen:**

* **Der quadratische Icon-Knopf mit negativem Rand über dem Pillenrand** (24 px, `radius-sm`): beim Zeigen
  übermalte die Fläche den Rand oben und unten und schnitt das runde Ende ab.
* **Eine neue Rolle `surface-interactive-strong` für das Drücken am Chip** (hell `gray-18`, dunkel `gray-55`;
  1,28 / 1,26 über `-active`, auf den Pillen 1,42–1,55 bzw. 1,47–2,31): eine vierte Stufe der Interaktionsskala
  für einen einzigen Knopf. Die Kategorie bleibt geschlossen; Zeigen und Drücken teilen sich am Chip `-active`.
* **Der Hof aus „Auswahlmarken zeigen einen Hof“:** die Knöpfe sind in W4/W5 (`altlast.md`) quadratisch
  zusammengelegt und zeigen das Zeigen als eigene Fläche; ein Hof wäre eine zweite Form für dasselbe.
* **Die Ghost-Stufe für alle Knöpfe anheben:** auf `surface-layer` und `-overlay` wäre Zeigen dann 1,23 statt
  1,12 — in Menü und Toolbar kräftiger als entschieden, nur um das Feld zu retten.
* **Eine eigene Rolle für „Zeigen im Feld“:** die vorhandene Stufe trägt; die Kategorie bleibt geschlossen.
* **Zeigen am Pfeil über die ganze Wurzel** (`.tl-select:hover .tl-select__arrow`): die Wurzel zeigt ihr
  Zeigen schon am Rand (`border-emphasis`); der Pfeil soll nur aufleuchten, wenn der Zeiger auf ihm steht.

**Nachgezogen 12.10. (Hendrik, Sichtprüfung): Kapsel und Segment folgen derselben Regel.** Beide sind selbst
Feldfläche (`surface-field`, das Segment auf der Spur der Leiste) und zeigten mit `surface-interactive-hover` hell
1,01 — nichts. Zeigen ist jetzt `-selected`, Drücken `-active`, wie die Knöpfe im Feld; der gedrückte Chip und das
gewählte Segment bleiben bei Marke bzw. `surface-brand-subtle`. Test: `choice.test.mjs` „Kapsel und Segment zeigen
auf der Feldfläche eine Stufe kräftiger“. Dabei gesehen: das Kästchen „Felder gesperrt“ sprang beim Ankreuzen um
2,6 px — `inline-grid` nimmt die Grundlinie vom ersten Kind, und das ist erst mit Haken das `::after`. Kästchen und
Kreis stehen jetzt mittig auf der Zeile (`vertical-align: middle`); Test „springen beim Ankreuzen nicht“.

**Als Test:** `field.test.mjs` und `select.test.mjs` halten Selektoren, Flächen, Quadrat und Wächter, auch am Chip; `tokens.test.mjs` hält `-active` mit ≥ 1,1 auf allen 14 Pillenflächen; ein
Test hält jede Regel mit `::-webkit-` allein und ohne die Kurzform `background`; das Specimen rendert den
Pfeil als `span` um das Icon wie `TLDropdownSelect`. `lint-css.test.mjs` prüft, dass Literale am
Pseudo-Element so brechen wie an der Klasse.

### Höfe sind durchscheinend (06.10.)

**Der Befund zuerst.** Der deckende Hof aus „Auswahlmarken zeigen einen Hof“ verdeckt, was unter ihm liegt. Am
Schieberegler der Engine sitzt der Hof um den Knopf auf der Wertlinie: deckend schneidet er die Linie rechts und
links des Knopfes 8 px weit heraus — die Linie bricht am Knopf ab, das sieht falsch aus (Linie unter dem Hof:
1,00 gegen den Hof). Dazu streut der deckende Hof je Grund: hell 1,01 (Feld) bis 1,12, dunkel 1,17 (Dialog) bis
1,54.

**Entschieden (Bernhard, 06.10.): ein Hof ist durchscheinend.** Eine bewusste Änderung der Regel „Zeigen ist eine
deckende Fläche, kein `rgba`“ — für den Hof, nicht für Flächen. Zwei neue Rollen, je Modus, unter den Effekten
wie `surface-scrim` (die einzigen Rollen mit Deckkraft):

| Rolle | hell | dunkel |
|---|---|---|
| `surface-state-hover` | `{veil-1}` = `rgba(27, 29, 33, 0.06)` | `{veil-3}` = `rgba(240, 243, 249, 0.06)` |
| `surface-state-active` | `{veil-2}` = `rgba(27, 29, 33, 0.12)` | `{veil-4}` = `rgba(240, 243, 249, 0.12)` |

Die Farbe ist die Textstufe des Modus (`gray-77` hell, `gray-5` dunkel), die Deckkraft 6 % / 12 % — MUI nimmt
4–8 % fürs Zeigen und 12 % für Fokus und Drücken; 4 % misst hell 1,08 und fällt unter die Schwelle 1,1, die
„Zeigen auf allen Gründen“ (01.10.) und „Knöpfe im Feld“ (06.10.) für Zeigen halten. Die Primitive heißen
`veil-*` (Familie plus Stufe, keine Rolle), die Werte stehen in `primitives.json`, `tokens.json` trägt nur die
Referenz. CSS: `--tl-surface-state-hover`, `--tl-surface-state-active`.

**Gemessen als Zusammensetzung:** die Schicht über dem Grund gegen den Grund (`ueberlagert` in
`tools/lib/contrast.mjs`, sRGB wie der Browser).

| | `surface-base` | `-layer` | `-layer-nested` | `-overlay` | `surface-field` |
|---|---|---|---|---|---|
| hell Zeigen | 1,12 | 1,13 | 1,13 | 1,13 | 1,12 |
| hell Drücken | 1,28 | 1,27 | 1,27 | 1,27 | 1,27 |
| hell Drücken gegen Zeigen | 1,14 | 1,13 | 1,13 | 1,13 | 1,13 |
| dunkel Zeigen | 1,16 | 1,18 | 1,18 | 1,19 | 1,19 |
| dunkel Drücken | 1,39 | 1,41 | 1,42 | 1,44 | 1,42 |
| dunkel Drücken gegen Zeigen | 1,20 | 1,19 | 1,20 | 1,21 | 1,20 |
| `focus-ring` auf dem Drücken-Hof | hell 4,16–4,59 | | | dunkel 3,14–4,31 | |

Durchscheinend heißt auch: der Hof hebt sich auf **jedem** Grund gleich stark ab (hell 1,12–1,13 statt 1,01–1,12),
und eine Linie darunter bleibt eine Linie — `surface-brand` auf `surface-layer` 5,84 / unter dem Zeigen-Hof
5,55 / unter dem Drücken-Hof 5,30 (dunkel 5,49 / 4,96 / 4,40), `border-control` 3,42 → 3,20 (dunkel 3,69 → 3,22).

**Regeln:**

* Das Lint erlaubt `--tl-surface-state-*` **nur** im Hof (`box-shadow: 0 0 0 <Maß aus Tokens> var(--tl-surface-state-hover|-active)`)
  und den Hof **nur** aus diesen Rollen; als Fläche, Rand oder Text ist eine Deckkraft ein Verstoß. Zeigen auf einer
  Fläche (Knopf, Zeile, Chip) bleibt deckend, `surface-interactive-*`.
* `color-mix`, `rgba` und Farbliterale bleiben in Komponenten verboten: die Deckkraft steht im Token, nie im CSS.
* Die Paarliste misst den Ring auf dem Hof als Zusammensetzung `<Schicht>/<Grund>` über allen fünf Gründen, statt
  auf `surface-interactive-hover`/`-active`. Im Probe-Theme führt `derive` den Ring dafür etwas weiter nach
  (`#E8541E` → `#DB4809` statt `#DD4A0D`).
* `derive` färbt die Schleier mit dem Kundengrau nach: ein Schleier ist eine Graustufe mit Deckkraft; ändert der
  Kunde das Grau, folgt er seiner Stufe und behält die Deckkraft (Probe warm: `rgba(31, 28, 25, …)` /
  `rgba(247, 242, 237, …)`). Einen gelieferten `veil-*` lässt `derive` stehen.
* Der Schieberegler der Engine liest dieselben zwei Rollen — ein Hof-Begriff überall.

**Die Knöpfe im Feld bleiben deckend** (`surface-interactive-selected`/`-active`, „Knöpfe im Feld zeigen eine
Stufe kräftiger“): sie zeigen das Zeigen als ihre eigene Fläche, nicht als Hof um etwas, und unter ihnen liegt nur
das Feld — es gibt nichts zu durchscheinen.

**Am Schalter bleibt der Hof um die Spur.** Der Grund für „Spur, nicht Knopf“ war die Deckkraft; der durchscheinende
Hof ließe sich nun wie bei MUI um den Knopf legen. Offen gelassen: der Hof folgt bei allen drei Marken der Form der
Marke, und ein Hof am `::after`-Knopf wäre eine zweite Form.

**Verworfen:**

* **Der deckende Hof:** verdeckt die Linie unter dem Knopf des Schiebers und streut je Grund (siehe Befund).
* **`color-mix(in srgb, var(--tl-text-primary) 8%, transparent)` in der Komponente:** die Deckkraft stünde in jeder
  Komponente neu, ein Kunde könnte sie nicht über die Primitive ändern, und das Lint verlöre die Regel
  „kein Farbwert im CSS“. Die Durchsicht gehört ins Token.
* **Deckkraft aus `currentColor` wie MUI:** die Farbe hinge an der Textfarbe des Elements — am angekreuzten
  Kästchen `text-on-brand`, am deaktivierten Label `text-disabled`; der Hof wäre je Zustand ein anderer.

**Als Test:** `tokens.test.mjs` hält die Deckkraft (0 < a ≤ 0,25), Zeigen ≥ 1,1, Drücken ≥ 1,2 und Drücken gegen
Zeigen ≥ 1,1 auf allen fünf Gründen in beiden Modi; `lint-css.test.mjs` den deckenden Hof, `color-mix` und
`rgba` im Hof sowie `surface-state-*` als Fläche, Rand, Text und `inset`-Linie als Verstöße; `choice.test.mjs` den
Hof aus den Schichten und keinen anderen Leser im Paket; `pairs.test.mjs` die Zusammensetzungen;
`derive.test.mjs` die Schleier im Kundengrau. Das Specimen zeigt den Hof über einer Linie.

### Welle 4: Gerüst und Overlays — Schnitt, Konsolidierung, 4a (13.10.)

Erkundung mit drei Agenten (Overlays, Gerüst und Layout, Nachprüfung der Wellen 0–3b) und einem Graphify-Lauf über die
React-Controls; die Prognose Q1–Q19 steht in `docs/migration/altlast.md` „Welle 4“, entschieden „alle wie
vorgeschlagen“ (Hendrik). Spec 4a `docs/superpowers/specs/2026-10-13-welle-4a-overlays-design.md`.

* **Zwei PRs wie bei Welle 3.** Rund 1.900 Zeilen in etwa 30 Blöcken: **4a Overlays** (Dialog, Fenster, Drawer,
  Snackbar, NoticeBar, Overlay; Trac #29836) und **4b Gerüst** (Shell, AppBar, Sidebar, BottomBar, Panel,
  SplitPanel, Card, Stack, Grid, Wizard …; eigenes Ticket beim Start, damit ein Release zwischen den Merges das Ticket
  der offenen nicht schließt). 4a setzt auf die Spaltenwahl (!1852) auf; Merge-Reihenfolge 3b → Spaltenwahl → 4a.
* **Ein Dialog, zwei Controls.** `TLDialog` zeichnet den Scrim (`tl-dialog`), `TLWindow` die Fläche
  (`tl-dialog__surface`); Java bleibt, die fünf Aufrufer merken nichts. Verworfen: die Controls verschmelzen
  (Java-Umbau, mehr Fläche fürs Review), natives `<dialog>` (Top-Layer legt Menüs und Selects im Dialog darunter).
  Die Fotoaufnahme bekommt denselben Scrim und dieselbe Fokusfalle.
* **Scrim ohne Blur.** Die Skala kennt keinen (siehe „Scrim und Ebenen“), und Blur kostet beim Ziehen des Fensters.
  Das Glass-Theme der Demo verliert damit den Weichzeichner hinter Dialogen.
* **Ein Kopf.** `tl-titlebar` (Titel `h2` mit Ellipse, Aktionen, Linie) trägt Dialog und Drawer, in 4b Panel und Card —
  vorher sechs Kopfzeilen mit zwei Gewichten, vier Abständen, vier Höhen. Kopfknöpfe sind `tl-button--icon --sm` mit
  Theme-Icons, 24 px — vorher sieben Eigenbauten in 28, 32 und 40 px, das Kreuz dreimal von Hand gezeichnet.
* **Drawer: mit Scrim modal, ohne nicht.** Ohne Scrim geht der Fokus hinein und zurück, ohne Falle; geschlossen ist er
  `inert`. Mit Scrim (die mobile Sidebar in 4b) fängt er den Fokus. Die Seiten heißen `start`/`end`.
* **Meldungen sind Alerts.** Snackbar und NoticeBar sind getönte Alerts mit eigener Hülle (Lage, Timer, Countdown);
  `#fff`/`#000` und `--tlSnackbar-*` fallen. **Nur ein Fehler unterbricht** — auch in der Snackbar, die bisher jeden
  Fehler höflich ansagte (`role="status"`).
* **Bewegung als Standard des Pakets** auf `data-tl-state` (`entering`, `exiting`, `open`). Bisher war das Ein- und
  Ausblenden des Dialogs allein Sache der Anwendung (`tlDialog__backdrop--entering`); eine Anwendung überschreibt den
  Standard auf denselben Attributen. Reduzierte Bewegung regelt der Hook (keine Markierung) und `base.css`.
* **Lint kennt die Zustandswörter der Overlays** (`entering`, `exiting`, `maximized`, `clickable`, `visible`) als
  Verstoß, auch an Elementen.

**Nachgetragen beim Bau (14.10.):**
* **Der Titel kürzt zuerst.** In der Titelleiste hat der Titel `flex: 1 1 0`, Kopfknöpfe `flex: none` — sonst liefen bei
  langem Titel die Fensteraktionen über die Kopfknöpfe, und die Knöpfe fielen unter 24 px.
* **Die Dialogfläche begrenzt sich selbst.** Der Scrim hat keinen Innenabstand; die Fläche nimmt höchstens
  `calc(var(--tl-size-viewport-width) - 2 * var(--tl-space-lg))` (und Höhe; `view-2`/`view-3`), maximiert ohne Grenze.
  Prozent scheiden aus: sie wuchsen beim ersten Ziehen um den Rand (andere Box), und zwischen Scrim und Fläche kann ein
  Behälter der Anwendung liegen; `vw`/`vh` sind im Lint Literale, darum Tokens wie `size-popover-max`.
* **Drawer: Richtung und Schatten.** Das Hinausschieben folgt der Schreibrichtung (`:dir(rtl)`), der Schatten erscheint nur
  offen — sonst schien der Schatten eines geschlossenen Drawers vom Rand herein.
* **Der Countdown der NoticeBar schweigt.** Er trägt `aria-live="off"`: die Rolle sagt den Hinweis einmal an, das Ticken
  nicht; ein Fehler (`role="alert"`) unterbräche sonst jede Sekunde. Die Rolle sitzt auf einer bleibenden Hülle
  (`div[role=status|alert]`, leer ohne Balken), nicht auf dem Balken: ein klickbarer Balken ist ein Knopf, und eine
  Region, die schon gefüllt eingefügt wird, wird oft nicht angesagt.
* **Der Startfokus liegt dort, wo Enter wirkt (Hendrik, 14.10.).** Ein Dialog ohne Feld fokussierte seine ganze Fläche;
  per Tastatur geöffnet, zeigte sie einen Ring um alles. Jetzt: erstes Feld, sonst der primäre Knopf im Fuß, sonst das
  erste Bedienelement im Körper, sonst der erste Fußknopf, der nicht destruktiv ist; die Fläche nur, wenn nichts davon
  da ist. Begründung: ein fokussierter Knopf nimmt Enter für sich (`keyboard-dispatcher`), und der Server koppelt
  „primär“ und „Enter“ fest (`ReactButtonControl.markAsDefault`) — nur der primäre Knopf behält also, was Enter
  vorher tat. Hat der Dialog keinen Standard (die Rückfrage „Ungespeicherte Änderungen“: Abbrechen, Verwerfen,
  Speichern, alle sekundär), bekommt Enter die harmloseste Antwort statt keiner. Der Material-UI-Adapter behält sein
  `'field'` — er folgt nur dem Vertrag in `state.proto`.
* **Die Snackbar sagt noch nicht zuverlässig an** — Rollenwechsel `status` → `alert` am lebenden Element, Einfügen schon
  gefüllt. Wie bei der NoticeBar zu lösen, Folgeticket #29851.

**Als Test (mit dem Bau):** `overlays.test.mjs` hält Scrim, Fläche, Kopf, Griffe, Drawer, Snackbar und NoticeBar fest,
`contracts-4a.test.mjs` die Verträge, `engine-classes.test.mjs` sperrt die alten Klassen in TSX, Stylesheets, Java,
Entwickler-Artikeln und Views; die Ratsche streicht sieben Blöcke.

### Parts: Bernhards Atome zeichnen mit dem Paket (15.10., Hendrik — #29787)

**Befund.** Auf master zeichnet seit #29787 ein austauschbares **Part** jedes Atom der Oberfläche: `Button`,
`MenuTrigger`, `DisclosureToggle`, `Checkbox`, `TextInput`, `FieldValue`, `Chip`, `Badge`, `Divider`,
`ProgressBar`, `Spinner` (`view-layer/parts.md`). Jede Stelle, die einen Knopf zeigt, zieht `usePart('Button')`;
eine Komponentenbibliothek (MUI) ersetzt das Part einmal und erreicht alle Stellen. Die Default-Parts zeichnen
mit den Paketklassen (`tl-button`, `tl-checkbox`, `tl-chip`, `tl-pill`, `tl-field`, `tl-divider`, `tl-badge`,
`tl-progress`, `tl-toggle`).

**Entschieden — das passt zu uns und gilt:** Parts sind die Umsetzung von „Gleiches wird zusammengelegt“ für die
Atome, und der typisierte Props-Vertrag ist „MUI-Adapter nur Vertrag“. Ab jetzt zeichnen unsere Komponenten ihre
Atome über Parts, nicht mit `buttonClassName` und eigenem `<button>`.

**Entschieden — was #29787 außerhalb des Pakets definierte, zieht ins Paket (Hendrik: „2“):** Die Paket-Gates
fanden sechs Stellen; sie laufen nicht im Engine-Jenkins, darum sah Bernhard sie nicht.
* `tlSpinner` (eigener Block, feste `0.8s`) → `tl-spinner`/`--sm` in `progress.css`, Dauer `--tl-duration-loop`,
  Kurve `--tl-easing-linear`.
* `tlDisclosureToggle--end` → Variante `tl-toggle--end` (`toggle.css`): eine Form, kein Zustand.
* `tlChip__detail` → `tl-chip__detail` (`choice.css`).
* Hüllen der Trenner `tlMenu__separator`, `tlToolbar__separator` (alte Klassen der Welle 3a) → `tl-menu__separator`
  (`menu.css`), `tl-toolbar__separator` (Marke ohne Regel, an ihr misst die Toolbar).
* `tlTableView__columns` (alte Klasse der Welle 3b) → das Zentrieren steht an `tl-table__columns` (`table.css`).
* `.tl-alert__close { display: flex }` im alten Stylesheet → `alert.css`.
* Feste Icons `css:fa-solid fa-xmark` an Alert und Drawer → Theme-Icon `ICON_CLOSE` (Welle 4a).

Gehoben, weil echt fremd: TLHtml 182→184 (Hülle des Druckknopf-Parts). Gesenkt, weil Bernhard abschnitt: TLDownload,
TLPanel, TLFileChips, TLColorInput, TLIconSelect und vier Literale (`ratchet.json`).

**Folge für Welle 4b:** Panel, Sidebar und BottomBar zeichnen ihre Knöpfe, Trenner und Badges schon über Parts; 4b
baut darauf auf und migriert die Hüllen. **Vorschlag an Bernhard:** die Paket-Gates (`node --test` gegen den
Worktree) in den Engine-Jenkins hängen, damit ein Bruch vor dem Merge auffällt.

### Welle 4b: Navigation (16.10., Hendrik — #29866)

**Schnitt.** Welle 4b, wie am 13.10. geschnitten, umfasste 17 Komponenten und rund 1.330 Zeilen Altbestand, das
Dreifache von 4a. Geteilt: **4b Navigation** (AppShell, AppBar, Sidebar mit mobilem Drawer und Flyout, BottomBar;
553 Zeilen, Q10–Q13, die Leiste aus Q14) und **4c Behälter** (Panel bis ViewError, Q14–Q18). Zuerst die Navigation,
weil dort die sichtbaren Fehler liegen: das Flyout läuft aus dem Fenster und hat, per Tastatur geöffnet, gar keine
Lage; die mobile Sidebar hat weder Escape noch Fokus noch `inert`. Spec
`docs/superpowers/specs/2026-10-16-welle-4b-navigation-design.md`.

**Der Breakpoint steht einmal.** Heute schaltet das CSS die Sidebar bei `@media (max-width: 768px)` zum Off-Canvas,
und die AppShell misst dieselben 768 noch einmal im TSX, um dem Server `COMPACT` zu melden („must stay in sync“).
Zwei Quellen, und die eine (CSS) weiß nichts von Fokus und Escape. **Entschieden:** nur die AppShell misst; sie gibt
den Wert als Kontext und als `data-tl-display` an ihrer Wurzel weiter. Die Sidebar wird kompakt der modale
`TLDrawer` aus 4a — Scrim, Falle, Escape, `inert`, Fokus zurück zum Hamburger — und deckt die AppBar mit, also
entfällt die Kopplung `top: 3.5rem`. Keine Komponentendatei enthält eine Breiten-Media-Query; das Lint hält es.
**Verworfen:** die Media-Query behalten und im TSX zusätzlich messen (768 an drei Stellen); eine Container-Query
(Fokus und Escape brauchen trotzdem JS — wieder zwei Quellen).

**Die Rahmenleisten bekommen eine Höhe: `size-shell-bar`, 48/40 px.** AppBar und BottomBar standen mit `3.5rem`
(56 px) als Literal, zweimal. Ein Token für beide, das der Dichte folgt: normal `{size-8}`, kompakt `{height-5}` —
keine neue Primitive. Kompakt ist die Rahmenleiste so hoch wie eine Toolbar-Leiste normal. **Verworfen:** 56 px
halten (eine Primitive außerhalb der Höhenstufen); `size-bar` für alle Leisten (die BottomBar mit Icon über Label wäre
kompakt mit 36 px eng).

**Die aktuelle Seite ist eine Fläche, kein Balken.** Die Sidebar markierte sie mit einem 3-px-Balken links in der
Marke; Baum und Tabelle haben seit 3b „aria-selected die Fläche — kein Balken links“. Eine Auswahlform in der ganzen
Oberfläche: `aria-current="page"` trägt `surface-interactive-selected` und `tl-type-body-strong`, in der BottomBar die
Fläche hinter dem Icon. Eingeklappt bleibt die Fläche hinter dem Icon sichtbar; ein Balken wäre dort nur ein Strich.
Im Menü bleibt `aria-current` Gewicht allein — dort heißt es „in Kraft“, nicht „hier bist du“. **Neu:** steckt die
aktuelle Seite in einer zugeklappten Gruppe, trägt der Gruppenkopf die Fläche (ohne Gewicht) — sonst zeigt die
eingeklappte Rail nicht, wo man ist. **Verworfen:** Balken als Akzent (`border-width-accent` ist Bedeutung an Karten
und Hinweisen, keine Auswahl); Gewicht allein (eingeklappt unsichtbar).

**Einträge wie das Menü.** Rail und Flyout zeichnen ihre Einträge als `tl-menu__item` (Q12); das Flyout ist
`Menu.tsx` mit `usePopover` an der neuen Lage `right-start` (Q11). Der Chevron folgt `tl-toggle`: rechts zu, unten
offen (Q13) — die Sidebar-Gruppe drehte als einzige um 180° und zeigte unten für zu.

**Eine Leiste schwebt nicht.** `ELEVATED` an der AppBar wird eine Trennlinie (`border-separator`), kein Schatten:
Schatten gehören den Ebenen, die über etwas liegen (Dialog, Popover, Ziehen). Ein Token `shadow-raised` gibt es
nicht und kommt nicht.

**Das Eck-Badge einmal.** Eingeklappte Sidebar und BottomBar setzten ein Badge mit je eigenen Literalen
(`-0.375rem`/`-0.5rem`) an ein Icon. Es wird der Behälter `tl-icon-badge` mit `tl-icon-badge__count` (`badge.css`),
oben versetzt um `space-2xs`, zum Ende um `space-xs`. **Warum ein Behälter und kein Modifier am Badge (beim Planen
16.10.):** `view-layer/parts.md` der Engine gibt die Lage eines Parts — auch „die absolute Position über einer Ecke“ —
dem Element **um** das Part; eine Komponentenbibliothek setzt die Position ihres Badges selbst (MUI:
`position: relative`) und gewönne gegen unsere Klasse am Badge. `span.tl-icon-badge` (positioniert, um Icon und Zähler)
trägt die Lage, `span.tl-icon-badge__count` die Ecke um das Part `Badge`. **Der Hamburger kennt seinen Zustand vom
Server:** `aria-expanded` und `aria-controls` brauchen `open` und `controls` in `DrawerToggleControl` (die Sidebar führt
`open` nach); `aria-controls` steht nur, solange offen — geschlossen gibt es die Nav kompakt nicht im DOM. **Der mobile
Drawer gleitet herein, nicht hinaus:** kompakt und offen rendert die Sidebar `div.tl-dialog > aside.tl-drawer`, geschlossen
nichts. Damit die offen eingefügte Schublade trotzdem kommt, beginnt ihr Übergang per `@starting-style` außerhalb
des Randes — eine Regel in `drawer.css`, die jede offen eingefügte Schublade trifft, ohne TSX. Das Schließen nimmt sie
mit dem Scrim ohne Bewegung (Hendrik nach der Sichtprüfung 16.10.: „gleiten sollte er trotzdem, zumindest rudimentär“;
die Bewegung im Ganzen gehört zum UI-Durchgang nach Welle 5).
**Die AppBar gibt der Reihe nach nach:** die Aktionen mit einer überlaufenden Toolbar sind `flex: 1 1 0` mit
`min-width: size-control` — sie nehmen den Rest und halten am Überlaufknopf; erst dann schrumpfen Titel und Kinder (die
Kinder wachsen nicht mehr, `flex: 0 1 auto`); ein Browser-Test misst die Reihenfolge. **BottomBar-Icon ohne
Java-Änderung:** `ThemeIcon` nimmt die rohe CSS-Klasse, die `BottomBarElement` liefert.

**Als Test (mit dem Bau):** `contracts-4b.test.mjs` (aktuelle Seite, `aria-expanded`, `aria-controls`, `<main>`,
kein englisches `aria-label`), Lint ohne Breiten-Media-Query, `focus-clip.test.mjs` über die neuen Specimen-Seiten,
`engine-classes.test.mjs` sperrt `tlSidebar`, `tlAppBar`, `tlBottomBar`, `tlAppShell`, `tlDrawerToggle`; die Ratsche
streicht acht Blöcke.

### Welle 4c: Behälter (16.10., Hendrik — #29870)

**Grundlage.** Prognose Q3, Q7, Q8, Q13–Q23 (`altlast.md` „Welle 4c“), alle wie vorgeschlagen; Spec
`docs/superpowers/specs/2026-10-16-welle-4c-behaelter-design.md`. Rund 850 Zeilen Altbestand, zwölf Behälter.

**Ein Kopf, eine Fußleiste.** Panel und Karte tragen den Kopf aus 4a (`tl-titlebar`): ohne eigene Fläche, Linie
darunter, Titel `h2`. Die Tönung `layer-02` des Panelkopfs fällt — sie sollte ihn vom dunklen AppBar absetzen, den es
nicht mehr gibt, und machte Panels zu einer vierten Kopfform neben Fenster, Drawer und Karte. Jeder Kopf misst
`size-bar`, mit und ohne Toolbar; ein DOM-Test misst es. Panel-Knopfleiste und Dialog-Fuß werden ein Block
`tl-button-bar` (`tl-dialog__footer` entfällt). **Verworfen:** die Tönung behalten (eine Kopfform mehr); eine
Fußklasse je Behälter (zwei Abstände für dieselbe Leiste).

**Die Verschachtelung bestimmt die Stufe, nicht eine Variante.** Eine Karte auf dem Grund liegt auf `surface-layer`,
eine in einer Fläche (Karte, Accordion, Panel als Karte) auf `surface-layer-nested` — ein schlichtes Panel malt keine
Fläche und hebt die Stufe darum nicht (beim Planen 16.10.: sonst läge die Karte dunkel zwei Stufen über dem Grund); im Dialog bleibt sie auf dessen Fläche, weil
`nested` dunkel unter `surface-overlay` liegt und die Karte einsänke. Hell ändert das nichts — `layer` und `nested`
sind weiß, dort trennt der Rahmen —, dunkel hebt sich die innere Karte um eine Stufe. Das ist die Regel aus
„Elevation“ (hell der Rahmen, dunkel die Fläche) zum ersten Mal ausgenutzt. `elevated` zeichnet wie `outlined`: „Eine
Karte liegt in der Oberfläche“ (Welle 0), Schatten nur für Schwebendes (4b). Die Fläche erfährt die Karte über einen
React-Kontext, denselben, aus dem das Inset seinen Abstand liest. **Verworfen:** `elevated` als Schatten (gestrichen
seit Welle 0); jede Karte auf `layer` (dunkel verschwimmt eine Karte im Panel).

**Eine Gap-Skala.** Stack und Grid hatten 0,5/1,5/3 rem, die Spalten aus 3b 0,75/1/1,5 rem — gleiche Stufennamen,
andere Werte. Alle drei nehmen `space-sm`/`-md`/`-lg`. Sichtbar in jeder Ansicht: der Standardabstand wird 1 statt 1,5
rem. Der Grid-Abstand kommt im TSX aus der Stufe statt über die Fremdeigenschaft `--tlGrid-gap`. **Verworfen:** die
Spalten auf die alten Werte ziehen (3 rem „locker“ ist ein Loch, kein Abstand).

**Der Rand kommt von der Fläche.** `--page-inset` war an drei Stellen definiert und erbte sich durch: Inset 1,5 rem auf
der Seite, 1 rem im Panel, 0,5/1 rem in der Karte. Die Werte bleiben, der Weg wird ein React-Kontext
(`tl-inset--page|panel|card`) — kein Fremdname im Namensraum, und die nächste Fläche gewinnt wie bisher. Die
Kartenpolsterung folgt „der Inhalt beginnt, wo der Titel beginnt“: `space-md` statt 1,5 rem, kompakt `space-xs`.

**Ein Griff mit Tastatur.** SplitPanel-Teiler und Spaltengriff der Tabelle teilen eine Bedienung aus `bridge/`:
`role=separator`, fokussierbar, Pfeiltasten um `space-md`, Home/End, `aria-valuenow`. Der Split-Teiler ist in Ruhe eine
Linie (Flächen brauchen eine Grenze), der Tabellengriff unsichtbar (Zellen haben Linien); beide werden unter dem Zeiger,
beim Ziehen und mit Fokus `border-width-md` in `border-interactive`.

**Bedienung, die man erwartet (U1–U3, Hendrik: „modern und großartig zu bedienen“).** Doppelklick auf den Panelkopf
maximiert und stellt wieder her, Escape beendet das Maximieren; Doppelklick auf den Split-Griff stellt die
Ausgangsaufteilung her; ein minimiertes Panel öffnet ein Klick auf den ganzen Kopf. Der Knopf bleibt der Weg für
Tastatur und Screenreader.

**Kleineres.** Breadcrumb in AdaptiveDetail ist `TLBreadcrumb` (der Server behält `{depth, label}`, der Standard-Kopf
„Übersicht“ statt `‹`); ViewError und der Html-Fehler sind `tl-alert` `error`; das Accordion zieht ins Paket (Bernhard
baute es im alten Stylesheet); Wizard und TileStack gleiten um einen Versatz `space-md` und markieren Übergänge als
Attribute; `--tl-item-index` heißt `--item-index` — ein Datum der Engine für Anwendungs-CSS, kein Wort des Pakets.
`tlFill`, Viewport und Mount bleiben bis Welle 5.

### Die Kopie in der Engine ist versiegelt (16.10.)

**Befund:** Zweimal wurde die Kopie des Pakets in tl-engine-7 von Hand geändert — #29787 (sechs Stellen) und #29859
(Haken der Einfachauswahl in `components.css`). `published.test.mjs` hält Kopie und `dist/` byte-gleich, läuft aber nur
im Paket-Repo; Jenkins baut die Engine ohne das Paket, die Handänderung ging grün durch. Der nächste `publish` hätte sie
still überschrieben, oder der Merge bricht wie in 4b. #29752 zeigt, dass der richtige Weg bekannt ist: fünf Commits im
Paket, dann neu publiziert.

**Entschieden (Hendrik: „die Trennung so sauber wie möglich, der falsche Weg soll scheitern“):** `generate` schließt
jede CSS-Datei mit einem Siegel — SHA-256 über alles davor, als letzte Kommentarzeile, damit der Herkunftskopf und
`derive` unberührt bleiben. `TestDesignSystemCopy` in `com.top_logic.layout.react` rechnet es in Jenkins nach (CRLF als
LF) und nennt bei einem Bruch den Weg: Quelle in `design-system/src`, `generate`, `publish-to-worktree`. Kein
Paket-Repo in Jenkins nötig. Die beiden Fremdänderungen stehen in der Quelle (#29787 seit 15.10., #29859 mit 4b,
`select.css` und Vertrag); der Merge von 4b hat gegenüber master keine Zeile der Kopie verloren.

**Als Test:** `seal.test.mjs` (Siegel jeder Datei, eine Änderung bricht es, die Engine prüft dieselben vier Dateien mit
demselben Muster); in der Engine `TestDesignSystemCopy` — rot ohne Siegel, grün nach `publish`, rot nach einer
Handänderung (16.10. so gelaufen).

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

### Die Vergleichsansicht: was sie gezeigt hat

Die Vergleichsansicht stellte dieselben Fragmente der Demo-App links unter dem alten Theme und
rechts unter der Skala nebeneinander, indem sie die Skala auf die alten Tokennamen zurückführte.
Sie hat zwei Dinge sichtbar gemacht, die auf dem Papier nicht zu sehen waren: dass drei der zwölf
mehrdeutigen Tokens keine Wahl, sondern eine Aufteilung sind, und dass eine Beschriftung immer der
Fläche folgen muss, auf der sie steht. Mit dem Schnitt entfällt der Rückweg, und die Ansicht mit
ihm. Was sie gezeigt hat, steht oben unter „Die Abbildung der alten Tokens“.
