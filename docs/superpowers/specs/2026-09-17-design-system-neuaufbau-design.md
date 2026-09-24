# TopLogic Design System — Neuaufbau

**Stand:** 2026-09-17 · Ticket #29617
**Ersetzt:** [`2026-09-15-style-overhaul-design.md`](2026-09-15-style-overhaul-design.md)

---

## Warum diese Spec die alte ablöst

Die Spec vom 15.09. plante, das ausgelieferte `tlReactControls.css` an Ort und Stelle auf die neue
Skala umzuschreiben. Dafür entstanden eine Abbildung der 54 alten Farbtokens auf die Skala, eine
Vergleichsansicht und eine Entscheidung je Lesestelle — ein Rückweg vom Neuen ins Alte.

Die Prüfung vor der Ersetzung (17.09.) ergab: Der Rückweg deckt nur die Farbschicht; 31 gelesene
Maß-, Schatten- und Typo-Tokens haben kein Ziel, die abgeleiteten Beschriftungen existieren nicht
als CSS, und die Skala schreibt Attribute, die die Anwendung nicht setzt. Der Weg wäre reparierbar
gewesen — aber er führt an einen Ort, an dem niemand hin will: alte Namen mit neuen Werten.

**Entschieden:** Altlasten werden abgeschnitten, nicht übersetzt. Die Skalen aus `skalen.md`
bleiben; sie sind der Teil, der stimmt. Neu sind das Ziel (ein eigenes Paket), die Namen (BEM,
Englisch, Präfix `tl`) und die Reihenfolge (Tokens und Grundklassen, dann Komponente für
Komponente).

## Leitplanken

| | |
|---|---|
| **Anspruch** | Design- und UI-System auf Stand der Technik für die TopLogic-Anwendung selbst |
| **Kunden** | tauschbar gegen ein einfaches Kundentheme; eigene Themes müssen leicht zu bauen sein |
| **Altlast** | harter Schnitt. Keine Aliase, kein Übergang, keine Übersetzung alter Namen |
| **React-Schicht** | ist Konsument. Die 76 Komponenten behalten ARIA, Tastatur und Fokuslogik und tauschen ihre Haut |
| **Schichten** | Primitive → semantische Tokens → Klassen. Jede Klasse liest nur Variablen |
| **Ort** | eigenes Repo, eigenes Paket, eigene Version. TopLogic bindet das Ergebnis ein |
| **Figma** | Veröffentlichungsziel, nie Quelle. Variablen sobald `tokens.css` steht, Komponenten im Gleichschritt mit dem Paket |

Ein Figma-Komponent ohne Code-Gegenstück ist ein Fehler, kein Vorsprung.

## 1 · Paketstruktur

Ein npm-Paket `@toplogic/design-system`, Quelle in diesem Repo, ohne Abhängigkeiten, gebaut mit
`node`.

```
design-system/
  src/
    primitives.json       Werte: Farben, Maße, Schriften, Dauern. Einzige Stelle mit Zahlen.
    tokens.json           Rollen → {referenz}. Kein Wert. Modi light/dark, Dichte normal/compact.
    components/
      button.css          liest nur var(--tl-*). BEM. Ein Ordner je Komponente.
      button.spec.html    Specimen: alle Varianten × Zustände × Modi auf einer Seite.
      button.contract.md  Zustandsvertrag für Kundenkomponenten (siehe 3, Stufe C).
  dist/                   erzeugt UND eingecheckt
    primitives.css        :root { --tl-blue-49: #0B5ED7; … }
    tokens.css            :root, [data-tl-mode="dark"], [data-tl-density="compact"]
    base.css              Reset, Typografieklassen, Fokusring, Reduced Motion, Zahlenklasse
    components.css        alle Komponenten
    tokens.dtcg.json      W3C Design Tokens, Quelle für Figma und Kundenwerkzeuge
  tools/                  generieren, inventar, gate, derive, figma-push
  test/                   die Gates
docs/
  skalen.md               bleibt, auf neue Namen umgeschrieben
```

**`dist/` wird eingecheckt**, weil TopLogic-Module CSS aus dem Klassenpfad laden und im Java-Build
kein npm laufen soll. Ein Gate hält `dist/` byte-identisch mit dem, was `src/` erzeugt.

**Alle Variablen tragen `--tl-`**, weil Kundenprojekte eigene Variablen daneben legen und ein
`--background` ohne Präfix kollidiert.

**Entfällt:** `abbildung.json`, `stellen.json`, die Vergleichsansicht, `tokens.json` des alten
Themes. Vorher werden sie einmal als Arbeitsliste für die Migration exportiert (welche alte Rolle
an welcher Stelle welche neue meinte), danach gelöscht.

## 2 · Namensschema

Eine Sprache für alles Öffentliche: **Englisch**, kebab-case, Präfix `tl`. Deutsch bleibt in Doku
und Begründung.

### Primitive: Familie plus Stufe, nie eine Rolle

`--tl-blue-49`, `--tl-gray-07`, `--tl-size-4`, `--tl-text-2`, `--tl-line-1`, `--tl-corner-2`,
`--tl-duration-2`. Die Farbstufe ist die Helligkeit; höher ist dunkler. Maße tragen eine laufende
Nummer, keinen Wert — ein Kunde darf `--tl-size-4` auf 18 px setzen, ohne dass der Name lügt.

### Semantische Tokens: Kategorie, Rolle, Variante, Zustand

In dieser Reihenfolge; die ersten beiden sind Pflicht.

| Muster | Beispiele |
|---|---|
| `--tl-{kategorie}-{rolle}` | `--tl-surface-base`, `--tl-text-primary`, `--tl-border-control`, `--tl-space-md`, `--tl-radius-sm` |
| `…-{variante}` | `--tl-surface-brand-subtle`, `--tl-status-error-text`, `--tl-status-error-border` |
| `…-{zustand}` | `--tl-surface-brand-hover`, `--tl-surface-brand-active`, `--tl-surface-selected` |

**Kategorien, geschlossen:** `surface`, `text`, `icon`, `border`, `focus`, `shadow`, `space`,
`radius`, `size` (Control- und Zeilenhöhen), `font`, `duration`, `easing`, `layer` (z-index),
`status` (error, warning, success, info mit je text/border/surface/subtle).

Ein neuer Name passt in eine Kategorie oder es gibt eine neue — sonst ist er falsch.

Beschriftungen auf Flächen (`--tl-text-on-brand`, `--tl-text-on-status-error`) werden **erzeugt,
nie geschrieben**: Von zwei Kandidaten gewinnt der mit dem höheren Kontrast gegen die Fläche.

### Klassen: BEM mit Block-Präfix

`.tl-button`, `.tl-button__icon`, `.tl-button--primary`. Modifier nur für **Varianten**, die der
Autor wählt. Zustände sind keine Modifier.

### Zustände: Attribute, nicht Klassen

Native, wo es sie gibt: `:disabled`, `:checked`, `[aria-expanded]`, `[aria-invalid]`,
`[aria-selected]`, `:focus-visible`. Sonst `data-tl-state="open|loading|dirty"`. Das CSS stylt,
was das DOM ohnehin weiß; Kundenkomponenten (Stufe C) bekommen dieselben Zustände geschenkt.

### Wurzel

`data-tl-mode="light|dark"` und `data-tl-density="normal|compact"` am `html`. Das Skript, das
heute `data-theme` vor dem ersten Paint setzt, setzt künftig diese beiden.

### Typografie als Klassen

`.tl-type-display`, `.tl-type-heading-lg/md/sm`, `.tl-type-body`, `.tl-type-body-strong`,
`.tl-type-label`, `.tl-type-label-strong`, `.tl-type-code`, dazu `.tl-nums` für Tabellenziffern.
Ein `font-size` oder `font-weight` außerhalb dieser Klassen ist ein Verstoß.

## 3 · Kundenvertrag

Drei Stufen, jede mit eigener Datei und eigenem Gate. Der Kunde wählt eine Stufe, nicht Teile aus
mehreren. In allen Stufen gilt: **Der Kunde fasst kein TopLogic-CSS an. Er legt Dateien daneben.
Ein Update des Pakets ändert seine Dateien nicht.**

### Stufe A — Regelfall: Primitive

Der Kunde liefert `customer.primitives.json` mit dem, was er ändern will: Hausfarbe,
Grau-Temperatur, Schrift, Radius-Grundwert. `tl-ds derive` rechnet daraus alles Fehlende — Rampen
für Hover, Active, Dunkel, getönte Flächen, Beschriftungen — und schreibt
`customer.primitives.css`. Geladen **nach** `primitives.css`.

**Was der Kunde schreibt, gilt. Was er nicht schreibt, wird gerechnet. Was gerechnet oder
geschrieben wurde, wird geprüft.**

* Steht eine komplette Rampe in der JSON, nimmt `derive` sie unverändert.
* Steht nur ein Wert, rechnet es die übrigen Stufen.
* Hat der Kunde eigene Rampennamen, reicht eine Zuordnungstabelle Stufe → Rolle
  (`surface-brand: acme-blue-600`). Das ist technisch Stufe B, aber mechanisch, ohne CSS.
* Beschriftungen auf Flächen werden **immer** abgeleitet, auch bei Kundenrampen. Wer das nicht
  will, setzt sie in Stufe B ausdrücklich.

Das Kontrast-Gate läuft über den gelieferten Werten und meldet jedes verfehlte Paar mit Verhältnis
und Vorschlag.

`derive` ist die eigentliche Neuentwicklung dieser Stufe. Der OKLCH-Kern aus `brand.mjs` bleibt;
neu ist die Ableitung der ganzen Palette aus Hausfarbe plus Grauwahl. Ohne `derive` ist Stufe A
eine Behauptung.

### Stufe B — Ausnahme: Rollen

Zusätzlich `customer.tokens.css`, geladen nach `tokens.css`. Jede semantische Variable ist
erlaubt; das Gate prüft danach alle Paare erneut. Die Doku nennt die gedachten Fälle: Radius auf
0, andere Info-Farbe, eigenes Dunkel. Der Kunde trägt hier die Rechnung selbst.

### Stufe C — Regelung: eigene Komponenten

Der Kunde registriert seine React-Komponente unter dem TopLogic-Namen in der Registry
(`controls-entry.ts`). Der Server liefert nur Zustand, kein Markup — die Mechanik existiert.

Was fehlt und das Paket liefert: je Komponente `*.contract.md` mit

* dem Zustand, den sie vom Server bekommt,
* den Aktionen, die sie auslösen muss,
* den Tokens, die sie lesen soll, damit sie ins Bild passt,
* den Attributen, an denen Tastatur und Fokus hängen,

und ein **Konformitätstest je Vertrag**, den eine Kundenkomponente bestehen kann. TopLogic
garantiert dann Funktion, nicht Aussehen. Mischbetrieb bleibt möglich, indem der Kunde seine
Tokens über Stufe B auf unsere übersetzt.

### Miniprojekt, abtrennbar: Token-Mapper

Ein Browserwerkzeug im Repo: Import der Kunden-Tokens (DTCG-JSON, CSS-Variablen oder
Figma-Export), visuelle Zuordnung seiner Stufen auf unsere Rollen mit Live-Kontrastanzeige, Export
der fertigen `customer.primitives.json`. Macht bestehende Kunden-Styleguides schnell anschließbar.
Grob; wird ausgearbeitet, sobald `derive` steht.

## 4 · Migration der Komponenten

Ein Rhythmus für jede Komponente, keine Ausnahme:

1. CSS ins Paket, neue Namen
2. Klassen im TSX umbenennen, Zustände auf Attribute, `className` durchreichen
3. Specimen
4. Vertrag
5. Gates grün
6. alter Block aus `tlReactControls.css` gelöscht

**Fertig ist eine Komponente, wenn ihr alter Block leer ist.** Das Inventar zählt das alte
Stylesheet je Block; kein Block darf wachsen, ein leerer fällt aus dem Budget.

| Welle | Komponenten | Warum hier |
|---|---|---|
| 0 | `primitives.css`, `tokens.css`, `base.css` | ohne sie liest keine Klasse etwas |
| 1 | Button, ToggleButton, Pill, Avatar, Progress, FontIcon | kleinste Bausteine; Button wird die Vorlage für alle Muster |
| 2 | TextInput, NumberInput, DatePicker, Select, Checkbox, BooleanChoice, DropdownSelect, FormField, FormGroup, FormLayout, FieldList | Formulare sind der Großteil der Oberfläche; hier liegen die Kontrastfehler der Felder |
| 3 | TableView, TreeView, ColumnSelect, Menu, MenuRegion, Toolbar, TabBar, Breadcrumb | Datendarstellung und Navigation; TableView ist mit 1.615 Zeilen der größte Brocken |
| 4 | Dialog, Window, Drawer, Snackbar, NoticeBar, AppShell, AppBar, Sidebar, BottomBar, Layoutcontainer | Gerüst und Overlays; Dialog bekommt `role`, `aria-modal`, Fokus-Trap |
| 5 | Calendar, ColorInput, IconSelect, Medien (Audio, Photo, PDF, Upload), Dashboard | fachlich, mit den meisten Literalen, zuletzt |

**Innerhalb einer Welle keine Reihenfolge**, damit parallel gearbeitet werden kann. **Keine
Welle beginnt, bevor die vorherige grün ist**, damit Muster aus Welle 1 nicht in Welle 3 neu
erfunden werden.

Mitfallend, ohne eigenes Ticket: der 20-px-Tree-Toggle (WCAG 2.5.8), die 22 `outline: none`,
`shadow-raised`, die Kalender-Hexfarben, die Debug-Farben am Drag-Marker, `z-index:
9999999999999999`.

### Anbindung an TopLogic

`UIThemeService` schreibt heute Tokens aus `tl-react-theme.config.xml` als Inline-Style. Künftig
liefert das Paket die CSS-Dateien, TopLogic bindet sie als `ClientResources` ein, und der Service
setzt nur noch `data-tl-mode` und `data-tl-density`. Die XML-Tokenkonfiguration und
`TestReactStylesheetTokens` entfallen; das Gate lebt im Paket. Die Kontrastprüfung
`TestReactThemeContrast` wird durch das Paket-Gate ersetzt, nicht dupliziert. Wie Kundenprojekte
ihre `customer.*.css` einbinden, wird mit der ersten Welle festgelegt: eine weitere
`ClientResources`-Registrierung, nach den Paketdateien.

## 5 · Gates

Jede Regel aus `skalen.md` ist ein Test, und ein Test bricht den Build des Pakets. Kein Gate,
keine Regel.

**Schichten.** Kein Hex, keine Zahl in `tokens.json`, nur Referenzen. Jede Referenz zeigt auf
eine Primitive. Keine Primitive ohne Leser. Kein Primitivname mit Rollenwort. Beide Modi belegen
jede Rolle. Kompakt überschreibt nur Maße, nie Schrift.

**Klassen.** Kein Literal in einer Komponentendatei außer `0`, `1`, `auto`, `none`, `100%`,
`currentColor`, `inherit`. Jedes `var(--tl-…)` existiert. Jede Klasse beginnt mit `tl-` und folgt
BEM. Kein `:focus` ohne `-visible`. Kein `outline: none`. Kein `overflow: hidden` an einem Behälter
mit fokussierbaren Kindern. Kein `font-size` außerhalb einer `tl-type-*`-Klasse. Kein `z-index`
außer `var(--tl-layer-*)`. Kein `box-shadow` außer `var(--tl-shadow-*)` und `inset`-Linien. Keine
Dauer außer `var(--tl-duration-*)`.

**Kontrast.** Die Paarliste gegen beide Modi: Text 4,5, Icon und Linie 3,0, Beschriftung auf
jeder Fläche, Fokusring gegen jede Fläche, auf der er liegen kann, getönte Flächen 30°
Farbtonabstand. Derselbe Code läuft über Kundenwerten.

**Maße.** 12 px Untergrenze, 4-px-Raster für Zeilen und Höhen, glatte Sechzehntel bei `rem`,
Linien in `px`, kleine Control-Höhe mindestens 24 px.

**Komponente.** Specimen vorhanden und zeigt alle Modifier × Zustände × Modi. Vertrag vorhanden
mit Zustand, Aktionen, Tokens, Attributen. Alter Block leer. `className` durchgereicht. Bei
Overlays: `role`, `aria-modal`, Fokus-Trap.

**TSX.** Eine Lint-Regel im React-Modul: kein Hex, kein `style={{ color }}`, keine Klasse ohne
`tl-`-Präfix, keine Größe an einem SVG außer über Klasse. Baut auf dem oxlint-Spike auf.

**Ratsche.** Bis das alte Stylesheet leer ist, zählt das Inventar je Block (`/* --- Name --- */`)
die Zeilen und über die Blöcke die Literale. Kein Block wächst; ein abgeschnittener Block wird aus
dem Budget gestrichen. Fremdzuwachs hebt einen Block mit Ticketvermerk, nicht die Datei
(skalen.md „Die Ratsche misst Blöcke").

**Erzeugtes.** `dist/` byte-identisch mit dem Erzeugnis aus `src/`. `tokens.dtcg.json` validiert
gegen das W3C-Schema.

## Was aus der bisherigen Arbeit wird

| | |
|---|---|
| `skalen.md` | bleibt Quelle der Entscheidungen; Namen werden umgeschrieben, die verwaisten und widersprüchlichen Stellen bereinigt |
| `skala.json`, `generieren.mjs`, `primitive.mjs`, `brand.mjs`, `contrast.mjs` | werden zu `src/` und `tools/` |
| die 105 Tests | werden zu `test/`, ergänzt um die Klassen-, Komponenten- und Ratschen-Gates |
| `inventar.mjs` | bleibt als Ratsche über dem alten Stylesheet |
| `abbildung.json`, `stellen.json`, `abbildung.mjs`, Vergleichsansicht | einmal als Migrationsliste exportiert, dann gelöscht |
| `praesentation.md` | bekommt eine Folie zum Schnitt und wird weiter mitgezogen |

## Abnahme

1. Welle 0 ist ausgeliefert, die Demo-App läuft mit `primitives.css`, `tokens.css`, `base.css`
   und setzt `data-tl-mode` und `data-tl-density`.
2. Jede Komponente hat Specimen, Vertrag und leeren Altblock; `tlReactControls.css` ist gelöscht.
3. Ein Kundenprojekt der Stufe A ist gezeigt: eine JSON mit Hausfarbe, `derive`, Gate grün, Demo-App
   im Kundenlook.
4. Die Tokens liegen in Figma mit Modi Hell/Dunkel, Blattnamen identisch mit den Tokennamen.
