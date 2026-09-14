# AP 0 — Blocker verifizieren

Stand: 2026-09-14. Basis: `~/git/tl8-new-ui/TopLogic 8 (NewUI)`, Branch `CWS/CWS_29108_ui_flexibility`.
Alle Aussagen sind am Code geprüft, nicht aus Doku übernommen.

---

## 0.1 Deploy-Modus generiert kein Theme-CSS — **bestätigt, mit Zusatzbefund**

### Befund

`Theme.initializeTheme()`, `com.top_logic/src/main/java/com/top_logic/gui/Theme.java:237`:

```java
if (_deployed) {
    _styleSheet = getThemeGlobalStylesheetName();   // referenziert nur den Namen
} else {
    _styleSheet = createStyleSheet(getCSSNames(), getThemeGlobalStylesheetName());
}
```

Nichts im Repo erzeugt `/style/_<Theme>_theme.css` für den Deploy-Fall:

| Geprüft | Ergebnis |
|---|---|
| `tl-maven-plugin` WAR-Tasks (`AppOverlay`, `DeployOverlay`, `FragmentOverlay`, `GenerateMetaConfTask`, `WarTask`) | **kein Treffer** für `style`/`css` |
| `JSDeploy.java` (CSS-Pendant gesucht) | existiert nur für JS, ist eine `main()`-CLI von 2008, **nirgends** in Maven/Skripten aufgerufen |
| `_*.css` im Repo | überall per `.gitignore` ausgeschlossen |
| vorgenerierte `_*_theme.css` | genau **eine** Altlast: `com.top_logic.demo/src/main/webapp/style/_default_theme.css` (Theme „default" existiert in TL8 nicht mehr) |
| `deploy/prod/webapp/WEB-INF/conf/metaConf.txt` im Archetyp | enthält **ausschließlich** `production-mode.xml` |

`production-mode.xml` setzt `ThemeFactory is-deployed="true"`.

### Zusatzbefund: die Lücke ist inkonsistent

`Theme.getStyleSheet(String destinationName, String[] cssFiles)` (Z. 550) generiert **immer**,
ohne `_deployed`-Prüfung. Genutzt von CKEditor (`StructuredTextControl`), PDFExport und
`ThemeBasedCSSTag`. Sekundäre Stylesheets entstehen im Prod-Modus also sehr wohl — nur das
Haupt-Stylesheet nicht. Das spricht dafür, dass der Prod-Pfad in der Praxis nicht benutzt wird
und die Guard-Bedingung eine Altlast ist.

### Haken beim naheliegenden Fix

`CSSBuffer.save()` schreibt über `FileManager.getInstance().getIDEFile(filename)` in das
Webapp-Verzeichnis. In einem entpackten WAR ist das meist beschreibbar, in einem gepackten oder
readonly gemounteten Container **nicht**. Ein „generiere, wenn Zieldatei fehlt" kann dort scheitern.

### Optionen

| # | Ansatz | Aufwand | Bewertung |
|---|---|---|---|
| A | `initializeTheme()` generiert auch bei `_deployed`, wenn die Zieldatei fehlt | ~10 Zeilen | Minimal, aber abhängig von Schreibrechten |
| B | `ThemeFactory is-deployed` aus `production-mode.xml` entfernen | 3 Zeilen | Sofort wirksam, kostet einmalige Generierung beim Start (Sekunden). **Pragmatisch die beste Sofortmaßnahme.** |
| C | Theme-CSS über ein Servlet aus dem Speicher ausliefern statt aus einer Datei | ~1 PT | Robust, unabhängig von Schreibrechten, invasiver |

**Empfehlung: B sofort, C als Zielbild.** A ist eine Halblösung, die auf readonly-Containern
still wieder bricht.

### Offen

Wie kommt das Stylesheet heute in reale Kundeninstallationen? Wenn Kunden `deploy/prod` nutzen,
müsste die UI ungestylt sein — das wäre aufgefallen. Vermutung: `deploy/prod` wird nicht verwendet.
**Zu klären mit dem Team, bevor B umgesetzt wird.**

---

## 0.2 Browser-Matrix — **keine vorhanden, Entscheidung nötig**

Es gibt keine dokumentierte Browser-Anforderung. `BrowserDetector.java` ist Legacy
(MSIE/Trident-Erkennung). `com.top_logic.doc` enthält nichts dazu.

Die einzige faktische Untergrenze ist der Vite-Default `build.target: 'modules'` — kein
explizites Target in `vite.config.bridge.ts` / `vite.config.controls.ts`, kein `browserslist`
in `package.json`.

| Feature | Verfügbar ab | Bewertung |
|---|---|---|
| Vite-Default `'modules'` (ES-Module, dyn. Import, `import.meta`, `??`) | Chrome 87 · Firefox 78 · Safari 14 · Edge 88 | heutige De-facto-Untergrenze |
| `@layer` | Chrome 99 · Firefox 97 · Safari 15.4 (2022) | Baseline, unkritisch |
| `light-dark()` | Chrome 123 · Firefox 120 · Safari 17.5 (Mai 2024) | **über der heutigen Untergrenze** |

**Konsequenz:** `light-dark()` ohne Absicherung würde auf Safari 14–17.4 die gesamte Deklaration
verwerfen → Variable undefiniert → unbedienbare UI. Der im Plan vorgesehene
`@supports`-Doppelblock ist damit **nicht optional, sondern zwingend** — das ist hiermit belegt,
nicht nur vermutet.

**Zu entscheiden:** verbindliche Mindestbrowser-Matrix festschreiben und als `build.target` /
`browserslist` im Repo verankern. Ohne sie ist jede künftige CSS-Entscheidung Ratespiel.

---

## 0.3 oxlint-Plugin-Spike — **trägt, und hat sofort einen echten Bug gefunden**

Spike liegt in `spikes/oxlint/`. oxlint **1.46.0**, Regel `tl/no-react-import` in ESLint-Rule-Shape.

### Toolchain-Ergebnis

| Frage | Ergebnis |
|---|---|
| JS-Plugin-API nutzbar? | **Ja.** Config-Key `jsPlugins: ["./rules/index.js"]` |
| ESLint-Rule-Shape (`meta`, `create(context)`, `context.report`)? | **Ja, unverändert übernehmbar** — ein Port nach ESLint bleibt ein Config-Wechsel |
| Bricht CI? | **Ja.** Exit-Code 1 bei Verstoß, 0 bei sauberer Datei |
| Geschwindigkeit | **125 ms für 96 Dateien** mit 94 aktiven Regeln, 10 Threads |

→ **Entscheidung: oxlint.** Kein Grund für ESLint.

### Der Fund

Regel gegen alle sechs npm-Projekte: **10 Treffer in 96 Dateien.**
Neun davon sind legitim (`bridge/`, `bridge-entry.ts` — die Bridge *besitzt* React und muss sie
direkt importieren; dafür bekommt die Regel eine Pfad-Ausnahme).

**Ein echter Verstoß**, `react-src/controls/TLDropdownSelect.tsx:2`:

```ts
import { React, useTLState, useTLCommand, useI18N } from 'tl-react-bridge';  // korrekt
import { createPortal } from 'react-dom';                                    // VERSTOSS
```

### Warum das real schadet

`vite.config.controls.ts` externalisiert **nur** `tl-react-bridge`, nicht `react`/`react-dom`.
Der direkte Import zieht daher über die Abhängigkeitskette beides ins Controls-Bundle. Im
eingecheckten Artefakt `src/main/webapp/script/tl-react-controls.js` nachgewiesen:

| Zeile | Inhalt |
|---|---|
| 2227 | Banner `react.production.js` — **vollständige zweite React-Instanz** |
| 2599 | Banner `react-dom.production.js` |
| 2655 | `__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE` — der Internals-Handshake |

| Posten | Bytes | Anteil |
|---|---|---|
| `react.production.js` | 11.280 | 7,0 % |
| `react-dom` (Portal-Pfad) | 3.328 | 2,1 % |
| **Fremdanteil gesamt** | **14.608** | **9,0 %** von 161.526 |

Das ist exakt der Fehlermodus, vor dem `CLAUDE.md` seit Jahren warnt („A second React copy breaks
all hooks at runtime"). Er steht im ausgelieferten Build-Artefakt. Ausgelöst von **einer Zeile in
einer Datei** — `TLDropdownSelect` ist das einzige Control, das Portale nutzt.

### Ursache ist eine Lücke im System, nicht Unachtsamkeit

`bridge-entry.ts` exportiert `createPortal` **nicht**. Die Entwicklerin hatte keine regelkonforme
Alternative. Genau das Muster, das Polar beschreibt: eine wiederholt umgangene Regel ist ein Bug im
Design System, nicht ein Disziplinproblem.

### Fix (klein, sofort umsetzbar)

1. `createPortal` (und `flushSync`) in `react-src/bridge-entry.ts` re-exportieren.
2. `TLDropdownSelect.tsx:2` auf `tl-react-bridge` umstellen.
3. Regel `tl/no-react-import` scharf schalten, mit Ausnahmepfad `react-src/bridge/**` +
   `bridge-entry.ts` und den Shim-Dateien der Satellitenmodule.

Erwartetes Ergebnis: Controls-Bundle **−14,6 KB**, doppelte React-Instanz weg, Regel dauerhaft grün.

---

## 0.4 `@layer`-Bestandsaufnahme — **besser und schlechter als erwartet**

### Klassennamen: null Kollisionen

44 Top-Level-Klassen sind in `tlReactControls.css` definiert (`tlReact*`, `tlCard`, `tlStack`,
`tlFormField`, `tlPanel`, `tlDialog`, …). Abgleich gegen alle Stylesheets in
`com.top_logic.themes.core/src/main/webapp/style/`:

> **0 Treffer.** Die BEM-Namen der React-Schicht sind exklusiv.

### Element-Selektoren: das eigentliche Risiko, und es ist real

Ungelayertes CSS schlägt gelayertes **unabhängig von Spezifität**. `button { }` (0,0,1, ungelayert)
gewinnt gegen `.tl-p-m { }` (0,1,0, in `@layer tl.util`). Nackte Element-Selektoren in den
Engine-Stylesheets:

| Datei | Selektoren |
|---|---|
| `core.css` | `a`, `body`, `code`, `h1`, `h2`, `h3`, `h4`, `h5`, `hr`, `progress` |
| `tables.css` | `table` |
| `coreButtons.css` | `button` |
| `form.css`, `tabbar.css` | keine |

Konkretester Konflikt: `core.css` setzt für `h1`–`h5` jeweils `font-family`, `font-size`,
`line-height`, `letter-spacing` und `font-weight: bold`. Das kollidiert frontal mit dem Zweck von
`<Text variant="…">` — bei `<Text as="h2" variant="body-m">` würde die ungelayerte `h2`-Regel
gewinnen und Heading-04-Größe erzwingen.

### Besserer Fix als im Plan vorgesehen

Der Plan sah einen zweizeiligen Diff an `tlReactControls.css` vor. Das reicht nicht — die
Engine-Stylesheets müssen ebenfalls gelayert werden. Statt 14 Dateien zu editieren:

> **`CSSBuffer.load()` wrappt jedes geladene Stylesheet automatisch in `@layer tl.legacy { … }`.**

Ein Ort, keine Dateiänderungen, und es greift automatisch auch für Kunden-Stylesheets, die über
`theme.xml/<styles>` hinzukommen. Die Design-System-Datei deklariert ihre eigenen Layer und wird
vom Wrapper ausgenommen.

**Technisch geprüft und unproblematisch:** weder die Engine-Stylesheets noch `tlReactControls.css`
enthalten `@import` oder `@charset` (0 Treffer) — beides wäre in einem `@layer`-Block ungültig.

---

## 0.5 Figma-fileKey — **blockiert, braucht Hendrik**

Die MCP-Schnittstelle liefert nur den `libraryKey`
(`lk-5545b55f…0669`, „Component library - TL Design System"). Es gibt kein Tool, das eine Library
zu ihrer Quelldatei auflöst, und der Zielordner `614719290` ist über MCP nicht enumerierbar.

**Benötigt:** die Figma-URL der Datei „Component library - TL Design System".
Blockiert AP 1 (Inventur) und AP 11 (Foundations) vollständig.

---

# AP 0 — Ergebnisse und Entscheidungen

## Umgesetzt: Bugfix Ticket #29576

Zwei Dateien in `~/git/tl8-new-ui/TopLogic 8 (NewUI)/com.top_logic.layout.react/`, **+8/−2 Zeilen**:

1. `react-src/bridge-entry.ts` — `createPortal` und `flushSync` re-exportiert
2. `react-src/controls/TLDropdownSelect.tsx` — Import auf `tl-react-bridge` umgestellt

Gebaut mit `mvn compile -pl com.top_logic.layout.react` (nicht `vite build`, gemäß `CLAUDE.md`).

| | vorher | nachher | Delta |
|---|---|---|---|
| `tl-react-controls.js` | 161.526 B | 144.826 B | **−16.700 B (−10,3 %)** |
| `react.production.js` eingebettet | 1× | **0×** | eliminiert |
| `react-dom.production.js` eingebettet | 1× | **0×** | eliminiert |
| `__DOM_INTERNALS_DO_NOT_USE` | 1× | **0×** | eliminiert |
| `tl-react-bridge.js` | 401.637 B | 401.725 B | +88 B (die Re-Exports) |

Lint-Regel `tl/no-react-import` gegen `controls/`: **0 Fehler**.

**Nicht verifiziert:** Laufzeitverhalten des Dropdown-Portals. Der Build und das Bundle sind geprüft,
die Demo-App wurde nicht gestartet. Das steht noch aus (`CLAUDE.md` verlangt Playwright-Verifikation
für UI-Änderungen).

**Nicht committet.** Der Arbeitsbaum enthielt fremde uncommittete Änderungen
(`CLAUDE.md`, `DESIGN_SYSTEM_PLAN.md`, `outputs/dsb-state.json`); Branch und Commit bleiben Hendrik
überlassen. Sicherungskopien der Originale liegen im Scratchpad.

## Nebenbefund: 25 TypeScript-Fehler im Bestand

`tsc --noEmit -p tsconfig.json` läuft heute nirgends — Vite transpiliert nur. Ad-hoc ausgeführt:

| Fehlertyp | Anzahl |
|---|---|
| `TS2322` Zuweisungsfehler | 24 |
| `TS2352` unsicherer Cast | 1 |
| **davon `Type 'unknown' is not assignable to type 'ReactNode'`** | **19** |

Keiner betrifft die geänderten Dateien.

Die 19 `unknown → ReactNode`-Fehler sind wörtlich die untypisierte `state: Record<string, unknown>`-
Fläche, vom Compiler bestätigt. Betroffen: `TLAppShell` (4), `TLSidebar` (4), `TLWindow` (3),
`TLPanel` (2), `TLAppBar`, `TLContextMenuRegion`, `TLDeckPane`, `TLDrawer`, `TLTabBar`, `TLTileStack`.

Das ist der empirische Beleg für die Priorisierung im Plan: **`tsc --noEmit` in `mvn compile` ist die
billigste wirksame Einzelmaßnahme** — eine Zeile, die 25 bestehende Fehler sichtbar macht und
verhindert, dass weitere entstehen. Die 25 müssen vorher abgearbeitet werden, sonst ist der Build
ab Tag 1 rot.

## Entscheidung: Browser-Matrix Baseline 2024

Verbindlich, im Repo zu verankern:

| Browser | Minimum |
|---|---|
| Chrome / Edge | 123 |
| Firefox | 120 |
| Safari / iOS Safari | 17.5 |

Damit sind `light-dark()` und `@layer` nativ nutzbar. Der `@supports`-Doppelblock bleibt trotzdem
als Sicherheitsgurt — er kostet ~170 Zeilen im generierten CSS und schützt gegen Altbestände, die
sich der Matrix entziehen.

Umzusetzen in AP 10 (nicht jetzt, um den Bugfix nicht mit unverwandten Änderungen zu vermischen):

```jsonc
// com.top_logic.layout.react/package.json
"browserslist": ["chrome >= 123", "edge >= 123", "firefox >= 120", "safari >= 17.5"]
```

```ts
// vite.config.bridge.ts / vite.config.controls.ts
build: { target: ['chrome123', 'edge123', 'firefox120', 'safari17.5'], /* … */ }
```

Heute existiert **kein** explizites `build.target` — der Vite-Default `'modules'` entspricht
faktisch Chrome 87 / Safari 14 und liegt damit unter dem Bedarf.

## Offene Tickets

| Ticket | Inhalt | Status |
|---|---|---|
| **#29576** | Zweite React-Instanz im Controls-Bundle | Fix umgesetzt, nicht committet, Laufzeittest offen |
| **#29577** | Deploy-Modus generiert kein Theme-CSS — Klärungsfrage ans Team | wartet auf Antwort, blockiert die Kunden-Theming-Architektur |

## Weiterhin blockiert

**Figma-fileKey** für „Component library - TL Design System". Ohne ihn stehen AP 1 (Inventur) und
AP 11 (Foundations) still.
