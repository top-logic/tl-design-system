# AP 1 — Token-Nutzungsindex

Erzeugt mit `tools/token-inventory.mjs`, Rohdaten in `inventory/token-inventory.json`.
Basis: `~/git/tl8-new-ui/TopLogic 8 (NewUI)`, Branch `CWS/CWS_29108_ui_flexibility`.

## Zahlen

| Messgröße | Wert |
|---|---|
| `theme-settings.xml`-Dateien | 34 |
| Settings insgesamt (roh) | 1.300 |
| davon CSS-relevant (ohne `mime.*`) | 1.014 |
| TopLogic-eigene Stylesheets | 43 |
| konsumierte Custom Properties | 291 |
| **echte Drift** (konsumiert, nirgends definiert) | **54** |
| nur über Java-`@DefaultValue` definiert | 1 |
| legitime lokale CSS-Properties | 15 |
| geparste Java-`ThemeVar`/`ThemeImage`-Deklarationen | 554 |
| **tote Tokens** (definiert, nie konsumiert) | **793** |
| `localName`-Kollisionen | **0** |
| Konsumstellen mit Fallback | 75 |
| SCREAMING_SNAKE-Settings | 787 |

Fremd-CSS (pdf.js, diagram-js/bpmn, FontAwesome, Bootstrap Icons, Fotorama, CodeMirror-Themes)
ist bewusst ausgefiltert — diese Bibliotheken haben eigene Namensräume.

## Zwei Korrekturen am Plan

**1. Die Drift ist dreimal so groß wie angenommen.**
Der Plan nannte 15 undefinierte Tokens. Das war die Zahl für `tlReactControls.css` allein.
Über alle TopLogic-Stylesheets sind es **54**.

**2. Die Drift steckt fast ausschließlich im React-CSS — aber sie ist dort massiv.**

Ein erster Messversuch legte nahe, die Engine-Stylesheets seien stark betroffen. Das war ein
Messfehler: `var(--highlight, var(--link-primary))` ist **kein** Verstoß. Der Fallback zeigt selbst
auf ein Token, der Wert bleibt von uns definiert. Das ist das bewusste Override-Muster der
Engine-Stylesheets.

Nur **literale** Fallbacks sind Drift. Nach dieser Korrektur (`tools/check-foreign-values.mjs`):

| Datei | Verstöße |
|---|---|
| `com.top_logic.layout.react/…/tlReactControls.css` | **244** |
| `com.top_logic.layout.react.wysiwyg/…/tl-react-wysiwyg.css` | 60 |
| `com.top_logic.model.search.react/…/tlScriptEditor.css` | 18 |
| `com.top_logic.layout.react.chartjs/…/tl-react-chartjs.css` | 12 |
| `com.top_logic.themes.core/…/form.css` | 7 |
| `com.top_logic.themes.core/…/tables.css` | 4 |
| `com.top_logic.themes.core/…/core.css` | 3 |
| **gesamt** | **348** |

**334 von 348 (96 %) liegen in der React-Schicht.** Die Engine-Stylesheets haben zusammen 14 —
sie sind über Jahre diszipliniert gepflegt worden. Die Drift ist mit der React-Schicht entstanden.

Aufgeteilt nach Art: 227 literale Fallbacks, 121 Fremdpaletten-Farbwerte.

## Die 54 zerfallen in drei saubere Familien

### Familie A — Tailwind-Palette (16 Tokens)

`--tl-primary-color` `#2563eb` · `--tl-text-color` `#374151` · `--tl-text-secondary` `#6b7280` ·
`--tl-border-color` `#d1d5db` · `--tl-hover-bg` `#e5e7eb`/`#f3f4f6` · `--tl-selected-bg` `#dbeafe` ·
`--tl-selected-hover-bg` `#bfdbfe` · `--tl-code-bg` `#f3f4f6` · `--tl-header-bg` `#f3f4f6` ·
`--tl-toolbar-bg` `#f9fafb` · `--tl-error-color` `#dc2626` · `--surface` `#fff` ·
`--surface-elevated` `#fff` · `--surface-hover` `#f1f5f9` · `--border-color` `#e2e8f0` ·
`--error-color` `#dc2626`

Sämtliche Werte sind **Tailwind-Standardfarben** (blue-600, gray-300/500/700, slate-100/200,
red-600, blue-100/200). Damit existiert im Code eine **dritte** Palette neben TopLogic-CI und
IBM Carbon.

Betroffen sind ausgerechnet die beiden jüngsten React-Satellitenmodule:
* `com.top_logic.layout.react.chartjs/src/main/webapp/style/tl-react-chartjs.css`
* `com.top_logic.layout.react.wysiwyg/src/main/webapp/script/tl-react-wysiwyg.css`

Das ist Drift im Entstehen, nicht Altlast — und damit der beste verfügbare Beleg dafür, dass
Dokumentation als Steuerungsmittel nicht ausreicht.

### Familie B — Carbon-Namen (21 Tokens)

`--layer-01` (13×, Fallback `#fff`/`#f4f4f4`) · `--layer-02` (5×) · `--support-error` (13×, `#da1e28`) ·
`--text-error` (5×) · `--field-disabled` (2×) · `--border-subtle-01` (3×) · `--border-radius-02` (12×) ·
`--body-compact-01-font-size` (24×) · `--body-compact-01-line-height` (4×) · `--label-01-font-size` (10×) ·
`--heading-compact-03-font-size` · `--heading-02-*` (3×) · `--layer-icon` · `--layer-text` ·
`--color-surface` · `--color-border` · `--color-drop-zone` · `--border-radius` · `--body-0-line-height`

Für jeden existiert ein TopLogic-Pendant (`layer`, `support-danger`, `background-disabled`,
`border-subtle`, `corner-radius`, `body-02-*`, `body-01-*`). Reiner Namensdrift.

Dateien: `core.css`, `form.css`, `tables.css`, `tlReactControls.css`, `tlScriptEditor.css`.

### Familie C — tote Legacy-Variablen (15 Tokens)

`--ACCORDION_BACKGROUND_COLOR` · `--ACCORDION_BEVEL_COLOR` · `--ACCORDION_INDENT` ·
`--ANCHOR_TEXT_DECORATION_TABLE_HEADER_LINK` · `--BUTTON_COLOR` · `--BUTTON_COLOR_HOVER` ·
`--FILTER_SORT_DIALOG_SORT_STATE` · `--FONT_SIZE_SMALL` · `--FRAME_BACK` · `--GROUP_RADIUS` ·
`--INVERT_TEXT` · `--TABLE_BORDER_COLOR` · `--TABLE_HEADER` · `--TEXT_FAMILY` (11×) ·
`--TR_TBLTR_LASTROW_BORDERBOTTOM`

Diese Theme-Variablen wurden entfernt, die CSS-Referenzen blieben stehen. Sie lösen heute zu
nichts auf — die betroffenen Regeln greifen also gar nicht.

Geprüft: **14 der 15 sind wirklich tot** — kein `ThemeVar`, kein `ThemeImage`, keine
`theme-settings.xml`-Definition. Die betroffenen CSS-Regeln greifen nicht.

Dateien: `tables.css`, `tabbar.css`, `form.css`, `contact.css`, `pdfExport.css`.

### Der fünfzehnte Fall ist kein toter, sondern ein aktiver Konflikt

`--TEXT_FAMILY` steht in keiner `theme-settings.xml`, ist aber in
`com.top_logic/src/main/java/com/top_logic/layout/Icons.java:44` deklariert:

```java
/** General font. */
@DefaultValue("Arial,Helvetica,sans-serif")
public static ThemeVar<String> TEXT_FAMILY;
```

Java-`@DefaultValue` ist die unterste Vererbungsebene (`Theme.initDefaults()` →
`settings.addDefaults(_variables.values())`), landet also sehr wohl im `:root`.

**Konsequenz:** `--TEXT_FAMILY` löst zu **Arial** auf, `--font-family` zu **Inter**.
`com.top_logic.contact/src/main/webapp/style/contact.css` nutzt `var(--TEXT_FAMILY)` an
**11 Stellen** — dieses Modul rendert damit in Arial, während der Rest der Anwendung in Inter
rendert. Der Arial-gegen-Inter-Konflikt aus der Planungsphase ist keine Doku-Inkonsistenz,
sondern steht sichtbar im ausgelieferten CSS.

Fix in AP 2: `--TEXT_FAMILY` per `expr="%font-family%"` auf den Typo-Token umbiegen, oder die
11 Stellen direkt auf `var(--font-family)` umstellen. Ersteres ist rückwärtskompatibel für
Kunden-Themes, die `TEXT_FAMILY` überschreiben.

### Rest (3)

`--border-disabled` · `--font-family-mono` · `--ttArrow-top` — Einzelfälle, je nach Kontext
definieren oder entfernen.

## 793 tote Tokens

Definiert, aber von keinem TopLogic-Stylesheet konsumiert. Der überwiegende Teil davon sind die
787 SCREAMING_SNAKE-Settings — also Java-seitige Layoutkonstanten, die korrekt über `ThemeVar`
gelesen werden und nie im CSS auftauchen.

Genau diese Menge bekommt in AP 3 `css="false"` und verschwindet damit aus dem `:root`-Block.
Der Index liefert die Arbeitsliste.

**Achtung vor einem Trugschluss:** „tot" heißt hier nur „nicht in einem TopLogic-Stylesheet
referenziert". Ein Token kann trotzdem über Java (`ThemeVar.get()`), über `%VAR%` in Layout-XML
oder aus einer Kunden-App heraus benutzt werden. Der Index parst inzwischen die 554
Java-Deklarationen mit, die Layout-XMLs aber nicht. Vor dem Löschen ist jeweils gegen den
Java-Code und die Layout-XMLs zu prüfen — `css="false"` ist dagegen risikolos, weil es nur die
CSS-Ausgabe betrifft.

## Null `localName`-Kollisionen

Risiko R3 ist im Ist-Zustand **nicht** akut. Es entsteht erst, wenn die FQN-Primitives
(`tl.primitive.color.blue-60`) hinzukommen. Die Kollisionsprüfung in `CSSBuffer` bleibt trotzdem
Pflicht — sie ist die Absicherung genau dieses Schritts, nicht die Reparatur eines Bestandsproblems.

## Arbeitsliste für AP 2

1. `--TEXT_FAMILY` zuerst — 11 Stellen rendern heute in Arial statt Inter. Sichtbarer Fehler,
   kleinster Fix.
2. Familie C: die 14 toten Referenzen entfernen. Risikofrei, die Regeln greifen ohnehin nicht.
3. Familie B auf die TopLogic-Namen umbiegen, Fallbacks ersatzlos streichen.
4. Familie A: Entscheidung erzwingen — die beiden Satellitenmodule auf Theme-Tokens umstellen.
   Ihre Tailwind-Fallbacks sind die jüngste und damit gefährlichste Drift.
