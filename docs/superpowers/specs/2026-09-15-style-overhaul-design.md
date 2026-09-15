# TopLogic 8 — Style Overhaul

**Stand:** 2026-09-15 · Basis: `tl-engine-7@master` (TopLogic 8.0.0-SNAPSHOT)
**Ersetzt:** `plan.md` — der reparierte die vorhandene Palette; hier wird sie ersetzt.

---

## Warum dieser Plan den alten ablöst

Der alte Plan war als Reparatur angelegt: Dark-Theme korrigieren, Audit erweitern, fehlende
Token-Kategorien nachziehen. Das Ziel ist inzwischen ein anderes — **ein vollständiger Wechsel des
Erscheinungsbilds**: neue Farben, neue Schrift, neue Formensprache.

Damit wird ein Teil der alten Arbeit gegenstandslos. Wer Werte einer Palette korrigiert, die
verschwindet, arbeitet für den Papierkorb. Das ist während der Umsetzung von AP 3 aufgefallen und
hat drei Commits gekostet.

Nicht gegenstandslos ist die **Maschinerie**: das Kontrast-Gate, die Audit-Regeln, die
Token-Struktur. Ihr Wert steigt sogar. Eine neue Palette ohne Gate macht dieselben Fehler wieder —
der Beweis liegt vor, siehe [Was das Gate gefunden hat](#was-das-gate-gefunden-hat).

## Leitplanken

Fünf Entscheidungen, die den Zuschnitt bestimmen:

| | |
|---|---|
| **Designquelle** | Es gibt keinen Entwurf. Die Designarbeit gehört ins Vorhaben. |
| **Tiefe** | Werte **plus Formensprache**. Der vollständige Neuentwurf der Oberfläche ist ein eigenes, späteres Projekt — dieses hier muss ihm den Weg bahnen, nicht verbauen. |
| **Umstellung** | Sauberer Schnitt. Das neue Aussehen wird der Standard, das alte verfällt. Kein `classic`-Theme, keine doppelte Pflege. |
| **Freiheitsgrad** | Freie Hand, auch die Marke darf sich ändern. Entscheidung liegt bei hpe, keine externe Freigabeschleife. |
| **Zeitanker** | Fundament zuerst, kein festes Datum. |

## Leitprinzip

Die vorhandene Doktrin in `docs/faq/react-theme-tokens.md` macht etwas Bemerkenswertes: Sie
definiert keine Werte, sondern **Skalen mit einer Regel, wann welche Stufe gilt.**

* Zwei Radius-Stufen, mit dem Merksatz: *eine Box, auf die der Zeiger wirkt, ist ein Control; eine
  Box, die andere Boxen hält, ist eine Fläche.*
* Drei Elevationsstufen, jede mit einer Anwendungsliste.
* Und die Abgrenzung: *eine Form ist kein Radius* — ein Kreis bleibt literal `50%`, damit er ein
  eckiges Theme überlebt.

Genau diese Regel fehlt allen Kategorien, die ergänzt werden. Es gibt 44 literale `font-weight`
nicht, weil jemand Tokens vergessen hätte, sondern weil niemand entschieden hat, **wie viele
Gewichte es geben soll und wann welches gilt.** Ein Token ohne diese Regel wird beim nächsten
Control wieder umgangen.

> **Fertig-Test einer Kategorie:** Sie hat eine Skala, eine Regel, wann welche Stufe gilt, ein
> Gate, das Abweichungen bricht — und steht in der FAQ.

## Zuschnitt

**Drin:** Farbe, Typografie, Abstand, Radius, Elevation, Rahmen, Fokus, Motion, Z-Ebenen, Dichte,
Komponenten-Maße.

**Draußen:** was wo steht. Kein Control wird umgebaut, keine Navigation neu gedacht, keine
Komponenten-Anatomie angefasst.

### Die drei Bringschulden

Drei Dinge lassen sich später nicht nachrüsten, ohne alles erneut anzufassen. Sie gehören deshalb
in dieses Vorhaben, obwohl sie für das heutige Aussehen nicht nötig wären:

| | Warum jetzt |
|---|---|
| **Komponenten-Tokens** (`control-height`, `field-height`, `control-padding-inline`) | Ein Redesign, das Höhen nicht über Tokens ändern kann, muss 6.011 CSS-Zeilen anfassen |
| **Dichte als Dimension** | Nachträglich eingezogen verlangt sie, jede Abstandsentscheidung erneut zu treffen |
| **`@layer`-Struktur** | Ohne Kaskadenschichten kollidiert jedes neue Stylesheet über Spezifität statt über Reihenfolge |

## Ausgangslage, gemessen

Literale in `tlReactControls.css` (6.011 Zeilen), Stand `master` am 2026-09-15:

| Kategorie | Literal | Anmerkung |
|---|---|---|
| Farben | **57 Hex + 20 `rgba()`** | die teure Kategorie |
| `font-size` | **56 von 113** | der Rest nutzt bereits Tokens |
| `font-weight` | **44 von 44** | kein einziges Token |
| `z-index` | **28 von 28** | der alte Plan sagte 14 |
| `transition` | **18 von 18** | 5 Dauern × 3 Easings, ohne System |
| Abstände | **57 von 312** | der alte Plan sagte 111; die Differenz sind legitime `0`/`auto` |
| `@layer` | **0** | |

Von fünf React-Stylesheets sind vier vollständig sauber. Die gesamte Last liegt in
`tlReactControls.css`.

### Was das Gate gefunden hat

Die Kontrastprüfung lief erstmals am 2026-09-15 und war auf **acht** Paaren rot — der alte Plan
kannte eines:

| Theme | Paar | Ist | Schuldet |
|---|---|---|---|
| `default` | `text-placeholder` auf `field` | **2,04** | 4,5 |
| `dark` | `text-placeholder` auf `field` | 3,03 | 4,5 |
| `dark` | `text-on-color` auf `button-primary` | 2,84 | 4,5 |
| `dark` | `text-on-color` auf `button-primary-hover` | **2,29** | 4,5 |
| `dark` | `text-on-color` auf `button-primary-active` | 3,64 | 4,5 |
| `dark` | `text-error` auf `background` | 3,19 | 4,5 |
| `dark` | `text-inverse` auf `background-inverse` | **1,13** | 4,5 |
| `dark` | `icon-on-color` auf `button-primary` | 2,84 | 3,0 |

Zwei Befunde, die den Plan mitprägen:

* **Der schlimmste Fall stand nirgends.** `text-inverse` auf `background-inverse` erreicht 1,13 —
  das Dark-Theme invertiert die Fläche auf `#F0F1F2`, also hell, und erbt die weiße Schrift, die zu
  einer dunklen gehört. Weiß auf Fast-Weiß.
* **`text-placeholder` fällt auch im hellen Theme durch.** Es ist kein Dark-Theme-Problem.

Die früher genannten „2,4:1" waren geschätzt; gemessen sind es 2,84.

---

## Stufe A — Richtung

**Zweck:** Stufe A entscheidet nicht, wie TopLogic aussieht. Sie entscheidet, **wie viele Stufen
jede Skala hat und wann welche gilt** — denn genau das dimensioniert Stufe B.

### Was entschieden werden muss

| Skala | Die Frage | Heute |
|---|---|---|
| Marke | Farbe, und wie viele Stufen die Rampe hat | 1 Farbe, 3 Stufen |
| Neutrale | Wie viele Graustufen trägt die Oberfläche | 11, gewachsen |
| Semantik | Fehler/Warnung/Erfolg/Info — je wie viele Varianten | 3, nur je ein Wert |
| Typo-Größen | Wie viele Stufen, welche Schrittweite | 8, unvollständig |
| Typo-Gewichte | Wie viele, wann welches | **0 Tokens, 44 Literale** |
| Radius | Bleiben es zwei Stufen | 2, mit Regel |
| Elevation | Bleiben es drei — und wie im Dark-Theme | 3, mit Regel |
| Rahmen | Breiten, und wann Rahmen statt Fläche | 0 Tokens |
| Fokus | Breite, Offset, Stil | Farbe ja, Breite literal |
| Motion | Wie viele Dauern, wie viele Easings | 0 Tokens, 18 Literale |
| Dichte | Wie viele Stufen, und was genau variiert | keine |

### Zwei Entscheidungen, die strukturell sind

**1. Elevation im Dark-Theme ist ein Mechanismusproblem, kein Wertproblem.** Ein Schatten ist auf
dunklem Grund fast unsichtbar; reife Dark-Themes drücken Höhe durch **hellere Flächen** aus. Der
heutige Zustand erbt `rgba(0,0,0,…)` ins Dunkle — das ist nicht ein falscher Wert, sondern der
falsche Mechanismus. Zu entscheiden: bleibt Elevation „Schatten", oder wird sie „Fläche plus
Schatten", wobei im Dunkeln die Fläche trägt? *Empfehlung: Fläche plus Schatten.*

**2. Ist Dark eine Ableitung oder eine eigene Palette?** Heute ist es eine Überschreibungsliste —
und daher kommen die acht Verstöße: Jemand überschreibt 36 Werte und übersieht, dass ein
siebenunddreißigster davon abhängt. Die Alternative sind zwei gleichwertige Paletten, die dieselben
Rollen vollständig belegen. Teurer in der Pflege, aber Vergessen wird strukturell unmöglich.
*Empfehlung: zwei vollständige Paletten.*

### Das Specimen

Eine eigenständige HTML-Seite im Design-System-Repo — **nicht** in der Demo-App. Kein
TopLogic-Build, keine 56 Sekunden pro Durchlauf, Änderung sofort sichtbar. Sie zieht echtes
Tabellen-Markup und echte Control-Klassen heran, damit die Typo-Skala an der wirklichen Dichte
geprüft wird und nicht an Blindtext.

Der Sieger wird danach **einmal** als Theme in der Demo-App gegengeprüft. Ein Specimen kann lügen;
die laufende Anwendung nicht.

### Abnahme

1. Jede Skala hat Stufenzahl **und** Regel — beides in einem Satz formulierbar
2. Das Kontrast-Gate ist grün für die neue Palette, in beiden Modi, mit derselben Paarliste, die
   heute acht Verstöße meldet
3. Die Typo-Skala besteht den Lesbarkeitstest bei 12/13/14 px an echten TopLogic-Tabellen
4. Das Ergebnis ist in der Demo-App gesehen, nicht nur im Specimen

### Grenze

Stufe A zeigt **Tokens auf vorhandenen Controls**, nicht neue Controls. Sobald das Specimen
anfängt, eine bessere Tabelle zu entwerfen, ist es aus dem Ruder gelaufen. Die Grenze ist hart,
weil genau hier ein kleines Specimen zum halben Redesign wird.

---

## Stufe B — Fundament

### Warum blindes Ersetzen scheitert

Die 44 `font-weight`-Literale verteilen sich so:

```
600 × 31    bold × 6    normal × 4    400 × 2    700 × 1
```

Das sind **zwei Gewichte und ein Ausreißer**. Ein Ersetzen nach Wert würde die eine `700` zu einem
dritten Token erheben und den Ausreißer für immer festschreiben.

> **Ein Literal wird nicht durch seinen Wert ersetzt, sondern durch seine Rolle.**

Bei Farben ist das ernst: `#878D96` steht an mehreren Stellen und meint mal „Icon deaktiviert",
mal „starker Rahmen". Wer nach Wert ersetzt, verschmilzt zwei Rollen zu einem Token und friert den
Fehler ein.

### Vorgehen je Kategorie

1. **Inventar** — ein Skript zieht jedes Literal mit Selektor und Eigenschaft heraus und gruppiert
   nach Rolle. Das ist der Unterschied zwischen drei Wochen blind und drei Tagen informiert.
   `tools/token-inventory.mjs` und `tools/check-foreign-values.mjs` existieren, sind aber auf die
   Legacy-Seite ausgerichtet und werden umgestellt.
2. **Rollen benennen** — die Gruppen durchgehen, Stufe der Skala aus Stufe A zuordnen. Handarbeit,
   der eigentliche Aufwand.
3. **Ersetzen und messen** — Budget der Regel von heute auf null.
4. **FAQ-Eintrag** — Skala, Regel, Anwendungsliste, im Stil der bestehenden Abschnitte.

### Ratschen-Mechanismus

Jede Regel wird einzeln scharf geschaltet, mit dem heutigen Stand als Budget, das **nur sinken
darf**. `tools/check-foreign-values.mjs` setzt das um: `--budget N` bricht in beide Richtungen,
also auch, wenn jemand unter das Budget fällt, ohne es nachzuziehen. Damit wird der Bestand nie auf
einen Schlag rot, und niemand kann neue Literale nachschieben.

### Reihenfolge

| Schnitt | Inhalt | Warum hier |
|---|---|---|
| **B1** | Fokusring, Z-Ebenen | Klein, mechanisch, sofort messbar. Räumt `9999999999999999` ab |
| **B2** | Typo: Gewichte, Größen vervollständigen | Die Daten geben die Skala vor |
| **B3** | Motion | 18 Literale, 5 Dauern × 3 Easings |
| **B4** | Abstände | 57 Stellen, meist mechanisch |
| **B5** | Rahmen, Komponenten-Tokens, Dichte | Die Bringschulden |
| **B6** | **Farbe** + Lint-Regel für TSX | Zuletzt — braucht die Rollen aus Stufe A |
| **B7** | `@layer` | Nach dem Spike, siehe unten |

Jeder Schnitt ist ein PR mit eigenem Trac-Ticket und endet mit dem Fertig-Test: Skala, Regel,
FAQ-Eintrag, Budget auf null.

### Zwei Risiken, offen benannt

**`@layer` ist riskant, nicht nur Arbeit.** Unlayered CSS gewinnt gegen jedes `@layer`. Sobald
TopLogics Stylesheets in Schichten liegen, gewinnen die Fremd-Stylesheets — CKEditor, Ace,
Chart.js — pauschal gegen unsere Regeln, unabhängig von Spezifität. Das kehrt das heutige Verhalten
um. **Deshalb vorgezogen als Spike**, bevor B7 überhaupt geschätzt wird.

**Der Audit erreicht die TSX-Seite prinzipiell nicht** — er liest nur Stylesheets. Zwei Hardcodes
sitzen im TSX (`#1565c0` in `TLTableView.tsx:1355`, `#000000` in `ColorPopup.tsx`), und nichts
hindert den nächsten. Dafür braucht es eine Lint-Regel; der oxlint-Spike in `spikes/oxlint/` trägt
das (125 ms für 96 Dateien, ESLint-Rule-Shape). Kleiner Zusatz zu B6, kein eigenes Vorhaben.

---

## Stufe C — Gießen und anbinden

### Ein-Weg-Sync nach Figma

Der alte Plan sah vor: *„Git besitzt Namen und Struktur, Figma die Werte."* Das war für eine Welt
gedacht, in der jemand in Figma entwirft. Der Entwurf entsteht jetzt im Specimen, gegen die Gates
gerechnet. Damit besitzt Git alles, und **Figma wird zum Veröffentlichungsziel, nicht zur Quelle.**

Das spart die gesamte Zwei-Wege-Synchronisation: keine Konfliktauflösung, keine Frage, wer gewinnt.

| | |
|---|---|
| **Quelle** | `tl-react-theme.config.xml` |
| **Zwischenformat** | DTCG-JSON (W3C, stabil seit 2025.10) |
| **Ziel** | Figma `02fjeGJYJVtkS13LqMk7G4`, Collections `Theme` (Modes Light/Dark), `Spacing`, `Typography` |
| **Weg** | Plugin-API — die Variables-REST-API ist Enterprise-only, TopLogic ist auf Pro |
| **Abnahme** | Export → Import → Export byte-identisch; Blattname der Figma-Variable identisch mit dem Tokennamen |

Das Abo der alten Library `lk-5545b55f…` wird entfernt.

**Das Gießen selbst ist klein** — und damit der Beweis, dass Stufe B funktioniert hat. Läuft nach
B6 jede Farbe über eine Rolle, ist die neue Palette eine Wertliste. Ist sie es nicht, war Stufe B
nicht fertig.

---

## Gates

| Gate | Prüft | Ab wann |
|---|---|---|
| `TestReactThemeContrast` | WCAG 2.1 AA, jede Paarung, **jedes** Theme | existiert, Stufe A |
| `ThemeTokenAudit` — bestehende Regeln | `var()`-Referenz definiert, Radius aus Token | existiert |
| `ThemeTokenAudit` — neue Regeln, je Budget | Literale je Kategorie | B1–B6 |
| Lint `tl/no-hex-literal` | Hardcodes im TSX | B6 |
| `tsc --noEmit` | `strict: true` wird tatsächlich ausgeführt | B6 |
| Export-Rundlauf | DTCG byte-identisch | C |

---

## Was mit dem Bestand passiert

| Gegenstand | Entscheidung |
|---|---|
| **PR !1618** (#29576, doppelte React-Instanz) | Mergen. Fundament, verifiziert. |
| **PR !1621** (#29579, Marken-Primitives) | Mergen **vor** Stufe A. Ohne sie beginnt B6 bei elf Literalen statt bei fünf Primitives. |
| **Branch `CWS/CWS_29584`** | Eindampfen auf Commit 1 (das Gate). Commits 2 und 3 fallen — sie reparieren Werte einer Palette, die verschwindet. |
| **Trac #29584** | Umschreiben von „Dark-Theme reparieren" auf „Kontrast-Gate". |
| **Trac #29578** (Fremdpaletten) | Geht in B6 auf. |
| **Trac #29577** (Deploy-Modus) | Bleibt liegen. Reines Legacy, out of scope. |
| **Gitea #1, #11** | Bleiben geschlossen — erledigte Arbeit, Historie. |
| **Gitea #2–#10** | Auf die neue Struktur umschreiben (A, B1–B7, C), statt elf Leichen liegen zu lassen. |
| **`plan.md`** | Nach `archive/`, ersetzt durch dieses Dokument. |

---

## Was den Takt vorgibt

Personentage sind hier die falsche Einheit — die Umsetzung erfolgt durch Claude, nicht durch einen
tippenden Menschen. Was den Durchsatz tatsächlich begrenzt, ist ein anderes:

| Bremse | Warum sie zählt |
|---|---|
| **Entscheidungen, die dir gehören** | Markenfarbe, Schrift, Stufenzahl je Skala, die zwei strukturellen Fragen aus Stufe A. Jede davon hält die Arbeit an, bis sie beantwortet ist. |
| **Rollenentscheidungen in B6** | 77 Farbstellen, jede einzeln zuzuordnen. Das ist Urteilsarbeit, keine Tipparbeit — und sie lässt sich nicht parallelisieren, weil die Rollen voneinander abhängen. |
| **Verifikationszyklen** | Ein Modulbau dauert ~1 min, ein Vollbau 3:20 min, eine Sichtprüfung in der Demo-App einige Minuten. Das summiert sich über viele Schnitte. |
| **PR-Durchlauf** | Review und Merge durch Kollegen liegen außerhalb unserer Kontrolle. Bei 8–10 PRs ist das die längste Wanduhr-Zeit im ganzen Vorhaben. |
| **Der `@layer`-Spike** | Die einzige echte Unbekannte. Bis er gelaufen ist, weiß niemand, ob B7 klein oder groß ist. |

**Die Reihenfolge ist deshalb nicht nach Aufwand sortiert, sondern nach Abhängigkeit.** Stufe B
kann erst geplant werden, wenn Stufe A die Stufenzahl jeder Skala festgelegt hat — vorher wären
ihre Aufgaben erfunden. Das ist der Grund für den Schnitt zwischen den Stufen, nicht die Größe.

**Zahl der Schnitte:** Stufe A ein Block, Stufe B sieben PRs, Stufe C zwei. Dazu der Spike.

## Offene Punkte

1. **Die zwei strukturellen Entscheidungen** (Elevation, Dark als eigene Palette) fallen in
   Stufe A, nicht vorher.
2. **Markenfarbe und Schrift** sind frei. `#0f62fe` scheidet aus — das ist exakt IBM Carbon Blue 60,
   und alle Werte sollen von TopLogic definiert sein.
3. **Token-Namen** sind Carbon-Nomenklatur (`layer-01`, `spacing-01..06`, `support-*`). Empfehlung
   unverändert: behalten. Das ist eine Namenskonvention, keine Palette, und ein Umbenennen kostet
   81 Tokens, 6.011 CSS-Zeilen und 6 Audit-Tests ohne Gegenwert.
4. **Repo-Transfer** nach `TopLogic/` und Sichtbarkeit — unabhängig von diesem Vorhaben, aber offen.
