# Die Skalen des Design Systems

**Stand:** 2026-09-17 · Skalen entschieden, Welle 0 umgesetzt
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
| `border-control` | `#8C8F94` | `#64676B` | 3,11 / 3,13 | **Begrenzt ein Bedienelement.** Eingabefelder, Auswahlfelder, Schaltflächen mit Umriss. |
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
Separator, der 3,0 erfüllen müsste, wäre keiner mehr.

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
| `text-helper` | `#676A6F` | `#888B90` | 5,2 | Grund |
| `text-placeholder` | `#6B6E73` | `#8E9196` | 4,6 | **`surface-field`**, nicht Grund |
| `border-emphasis` | `#6F7277` | `#7F8286` | 4,6 | Grund |
| `border-control` | `#8C8F94` | `#64676B` | 3,1 | Grund |
| `border-separator` | `#C1C4C9` | `#34383C` | — | trennt nur |

`text-placeholder` und `border-emphasis` landen im hellen Modus dicht beieinander. Das sind
trotzdem zwei Tokens: Sie messen gegen **verschiedene** Flächen und würden auseinanderlaufen,
sobald sich eine davon ändert.

#### Flächen

| Token | hell | dunkel |
|---|---|---|
| `surface-base` | `#FAFAFA` | `#16181B` |
| `surface-layer` | `#FFFFFF` | `#1D2023` |
| `surface-layer-nested` | `#FFFFFF` | `#242729` |
| `surface-overlay` | `#FFFFFF` | `#2B2F33` |
| `surface-field` | `#F0F4F9` | `#27292D` |
| `surface-interactive-hover` | `#F0F2F6` | `#22262A` |
| `surface-interactive-selected` | `#E5E8ED` | `#2B3034` |
| `surface-interactive-active` | `#D9DDE3` | `#343A3F` |

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
| **Info** | `text` | `#007F92` | `#008DA2` | 4,52 / 4,52 |
| | `border` | `#159FB6` | `#006E80` | 3,02 / 3,00 |
| | `surface` | `#33C1DB` | `#33C1DB` | Beschriftung dunkel 7,87 / 7,87 |
| | `subtle` | `#CEF3FB` | `#002830` | 14,34 / 14,03 |

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

**Warum das mehr ist als Ordnung: Es ist die Eingriffsstelle für Kundenprojekte.** Ein Kunde, der seine Hausfarbe einsetzen will, überschreibt `--tl-blue-49` — und `surface-brand`, `text-link`, `focus-ring` und `border-interactive` ziehen mit, ohne dass eine Klasse angefasst wird. Deshalb **löst das erzeugte CSS die Referenzen nicht auf**: Dort steht `var(--tl-blue-49)`, nicht `#0B5ED7`. Aufgelöst wird nur zum Rechnen, wo Kontraste echte Werte brauchen.

**Eine Ausnahme, benannt:** Die Beschriftungen auf Flächen (`--tl-text-on-*`, `--tl-icon-on-*`) stehen als gerechnete Hex-Werte in `tokens.css`. Überschreibt ein Kunde nur `--tl-blue-49`, folgt `surface-brand`, die Beschriftung darauf aber nicht — auf einer hellen Hausfarbe wäre Weiß unlesbar. Deshalb rechnet `derive` (Kundenstufe A) die Beschriftungen mit und schreibt sie in eine Datei, die **nach** `tokens.css` geladen wird. Die Ladereihenfolge ist Teil des Kundenvertrags, nicht Kosmetik.

Die Primitivnamen werden **abgeleitet, nicht vergeben** (`design-system/tools/lib/naming.mjs`): Familie aus dem Farbton, Stufe aus der Helligkeit, wobei eine höhere Stufe dunkler ist. Kollidieren zwei Werte auf derselben Stufe, rückt der zweite auf — sonst hinge die Zuordnung an der Reihenfolge, in der die Werte hereinkommen.

**Vier Regeln setzt das Gate durch:** kein Hex in der Rollenschicht, jede Referenz zeigt auf ein vorhandenes Primitiv, kein Primitiv steht ungenutzt herum, und kein Primitivname enthält ein Rollenwort. Dazu ein Test, der einen Kundentausch durchspielt und prüft, dass alle vier markenbezogenen Rollen mitziehen.

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
| Polsterung waagerecht | `space-sm` | `space-xs` |
| Polsterung senkrecht | `space-xs` | `space-2xs` |
| Abstand im Formular | `space-md` | `space-sm` |
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
neu definiert und nichts gelesen. Was heute schon darin steht, ist Fremdgut und steht in
`test/ratchet.json` unter `foreignTl` als Einfang-Liste: Die Welle, die die Komponente holt,
entscheidet, ob der Name ein Token wird (dann trägt er eine geschlossene Kategorie, etwa
`--tl-space-…`) oder ein Mechanismus bleibt (dann heißt er anders). Neues auf der Liste bricht
den Test; Eingefangenes wird gestrichen, sonst bricht er ebenfalls.

Das Ratschen-Budget wurde dabei einmalig von 6065 auf 6088 Zeilen gehoben, mit Vermerk der
Herkunft. Die Regel „darf nur sinken" gilt für die Wellen; Fremdzuwachs wird vermerkt und
gehoben, nicht stillschweigend eingerechnet.

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
| Zustände | `:disabled`, `[aria-pressed="true"]` (ersetzt `--active`; ein ToggleButton ist ein Button mit `aria-pressed`, kein eigenes CSS), `data-tl-state="loading"`, `:focus-visible`, `:hover`, `:active`. |
| Kontext | Kein Selektor von außen. Der Container wählt die Erscheinung — die Toolbar setzt `ghost`, der Dialogfuß `primary` und `secondary`. |

Warum die Tönung keine fünfte Erscheinung ist: Ein Löschen steht im Bestand mal in der Toolbar
(Umriss), mal im Dialog (gefüllt). Eine Erscheinung `danger` müsste beides sein und wäre die
nächste Dublette nach dem Muster `--active` zu `--primary`. Die Tönung hat dieselbe Form wie die
Semantik: eine Bedeutung, vier Rollen.

**Die AppBar ist keine Markenfläche.** Der Fall „Schaltfläche auf Marke“ mit weißen Literalen
entfällt, statt ein Kontextattribut zu bekommen: Die Kopfleiste wird `surface-layer` wie jede
Fläche. Das gilt für die Shell in Welle 4 und ist hier festgehalten, weil der Button sonst eine
zweite Farbwelt bräuchte.

**Als Test:** Das Klassen-Gate erlaubt am Block `tl-button` nur die vier Erscheinungs-Modifier
und `danger`; ein Zustandsname als Modifier (`--active`, `--disabled`, `--loading`) bricht. Der
Kontrasttest prüft `primary`, `secondary` und `ghost` je mit und ohne `danger` in beiden Modi.
`TLUploadButton` rendert dieselbe Chrome und bekommt damit dieselben Regeln.

---

**Befund aus `test/components.test.mjs` (Task 3, offen — nicht am Test oder Token gedreht):**
Zwei Kombinationen unterschreiten die Anforderung mit den heutigen Tokens:

- Hell, `danger-secondary` im Hover (Fläche `status-error-subtle`, Text `status-error-text`) auf
  `surface-base`: 4,12 statt 4,5. Der Hover-Subtle-Ton der Fehlerfläche trägt `status-error-text`
  nicht mehr, sobald er heller ist als der reine Grund.
- Dunkel, `secondary` (Linie `border-control`) auf `surface-layer`: 2,88 statt 3,0. `border-control`
  ist gegen `surface-base` entschieden (siehe oben, 3,0 erfüllt), trägt aber die zusätzliche Fläche
  `surface-layer` im Dunkelmodus nicht mit.

Beide sind Skalen-Befunde, nicht Bugs in `button.css` — mit Hendrik klären, bevor `status-error-subtle`,
`status-error-text` oder `border-control` (dunkel) angefasst werden.

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

### Die Vergleichsansicht: was sie gezeigt hat

Die Vergleichsansicht stellte dieselben Fragmente der Demo-App links unter dem alten Theme und
rechts unter der Skala nebeneinander, indem sie die Skala auf die alten Tokennamen zurückführte.
Sie hat zwei Dinge sichtbar gemacht, die auf dem Papier nicht zu sehen waren: dass drei der zwölf
mehrdeutigen Tokens keine Wahl, sondern eine Aufteilung sind, und dass eine Beschriftung immer der
Fläche folgen muss, auf der sie steht. Mit dem Schnitt entfällt der Rückweg, und die Ansicht mit
ihm. Was sie gezeigt hat, steht oben unter „Die Abbildung der alten Tokens“.
