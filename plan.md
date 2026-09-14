# TopLogic 8 — Design System

**Stand:** 2026-09-14 · Basis: `tl-engine-7@master` (= TopLogic 8.0.0-SNAPSHOT)
**Vorgänger:** `archive/plan-v1-veraltet.md` — gegen einen 399 Commits alten Branch geschrieben, hinfällig.

---

## Context

Auf `master` existiert bereits ein Token-System für die React-Schicht, gebaut von bhu in den
Tickets #29108, #29525, #29528, #29550, #29573. Es ist gut gebaut und wird hier nicht ersetzt.

Die entscheidende Einordnung:

> **Was existiert, ist ein Token-*Delivery*-System. Ein Design System ist es noch nicht.**

Es löst die Mechanik vollständig — Deklaration, Typprüfung, Vererbung, Auslieferung, Umschaltung,
Persistenz, Modulbeitrag. Es löst nicht, welche Entscheidungen es transportiert.

### Was steht

| Baustein | Zustand |
|---|---|
| `UIThemeService` / `UITheme` | Registry, `extends`-Vererbung (einstufig, rekursiv auflösbar), Zyklenprüfung |
| Fünf Token-Arten | `ColorToken`, `LengthToken` (Regex-geprüft), `NumberToken`, `TextToken`, `RefToken` — pluggable über `@TagName` |
| Auslieferung | Inline-`<style>` im `<head>`, je Theme ein `[data-theme="x"]`-Block, Default zusätzlich auf `:root` |
| Umschaltung | `window.tlTheme.select()` / `.followSystem()`, ohne Reload über die SSE-Queue; `prefers-color-scheme`; `PersonalConfiguration`-Key `react.theme` |
| Themes | `default` (81 Tokens), `dark` (36 Overrides), `flat` (Demo — beweist Modulbeitrag) |
| **Audit** | `ThemeTokenAudit` + `AbstractStylesheetTokenTest`, **in 6 Modulen ausgerollt**, hat bereits einen Build gebrochen (#29573) |
| Entkopplung | Null Abhängigkeit zu `com.top_logic.gui.Theme`. Einzige Restkopplung: `ThemeImage` für Theme-Icons |

Die Doktrin steht schriftlich in `docs/faq/react-theme-tokens.md` und im Javadoc von `UITheme`:

> *„A token is named by what it is for, not by what it looks like, and a stylesheet consumes it as
> `var(--name)` without a fallback."*

### Was fehlt — gemessen, nicht vermutet

Der Audit prüft **genau zwei** Regeln: eine `var()`-Referenz ohne Definition, und einen literalen
`border-radius`. Alles andere passiert ungeprüft. Im ausgelieferten `tlReactControls.css`
(6.011 Zeilen):

| Kategorie | Literale | Tokens vorhanden? |
|---|---|---|
| `font-size` | **56 von 113** literal (`14px`, `13px`, `.72rem`, `0.5625rem`, …) | 8 Typo-Tokens, unvollständige Skala |
| `font-weight` | **44 literal** (`600` 31×, `bold` 6×, `normal` 4×, `400`, `700`) | **keine** |
| `padding` / `gap` / `margin` | **64 / 20 / 27 literal** | `spacing-01..06`, gut angenommen |
| Farben | **57 Hex + 19 `rgba()`** literal | 51 Farb-Tokens |
| `transition` | **19 literal**, 5 Dauern × 3 Easings | **keine** |
| `z-index` | **14 literal**, darunter `9999999999999999` | **keine** |
| Fokusring | Ringbreiten `2px`/`3px` überall literal | `focus`, `focus-inset` — aber keine Breite |

Weitere Lücken: keine Dichte-Dimension (das Legacy-System hat `coreCondensed`, die React-Schicht
nichts), keine Komponenten-Tokens (`button-height`, `field-height`), keine Kontrastprüfung, kein
`@layer`, kein CSS-Reset, kein RTL, kein High-Contrast, **kein Token-Export in irgendeinem
Standardformat**, kein Storybook, keine Figma-Anbindung.

### Drei Befunde, die sofort zählen

**1. Die Marke ist nicht abstrahiert.** `button-primary`, `button-secondary`, `interactive`,
`link-primary`, `focus`, `border-interactive` tragen alle denselben Wert `#2968C8` — als sechs
unabhängige Literale. Ein Kunde, der seine Markenfarbe setzen will, muss sechs Tokens plus deren
`-hover`/`-active`-Varianten überschreiben. **`RefToken` existiert und löst genau das — wird dafür
aber nicht genutzt** (die 5 vorhandenen `<ref>` sind reine Legacy-Aliasse).

**2. Das Dark-Theme erbt, was es nicht erben darf.** Es überschreibt 36 Farben, erbt aber
unverändert:
- die drei Schatten (`rgba(0,0,0,…)` — auf dunklem Grund praktisch unsichtbar)
- `overlay: rgba(0,0,0,0.5)` — kaum vom Dialog zu unterscheiden
- `support-error/-warning/-success`, `text-error`, `button-danger` — Light-Semantikfarben
- `text-on-color: #FFFFFF`, während `button-primary` auf `#5B9BF0` aufhellt → **Weiß auf Hellblau,
  ca. 2,4:1, unter WCAG AA**

**3. Zwei Token-Welten koexistieren ohne Verbindung.** Die React-Schicht (`UIThemeService`,
`/view/`) und die Legacy-UI (`Theme`/`theme-settings.xml`/`CSSBuffer`, `/servlet/`) haben
teilweise gleiche Token-Namen, aber keine technische Kopplung. Ein Theme-Wechsel auf einer Seite
wirkt nicht auf die andere. Die Legacy-Seite ist unverändert gedriftet: `#2968c8` steht dort
**12× hart kodiert**, 792 Tokens sind tot.

---

## Leitentscheidung

**Wir bauen auf `UIThemeService` auf, nicht daneben.**

Die Architektur ist explizit erweiterbar: `ThemeToken` ist pluggable (*„add one by adding a
subclass and tagging its configuration"*), `ThemeTokenAudit` ist eine offene Utility-Klasse, und
`ThemeToken.Config.getGroup()` liegt ungenutzt bereit — vorbereitet für einen Token-Editor.

Ein zweites System daneben wäre Doppelarbeit und würde eine dritte Token-Welt schaffen.

---

## Arbeitspakete

Reihenfolge nach Nutzen pro Aufwand. AP 1–3 sind klein und sofort wirksam.

### AP 1 — Marken-Abstraktion über `<ref>` (2 PT) ⚡

`brand-primary` und die abgeleiteten Stufen als Primitives einführen, die sechs Marken-Tokens auf
`<ref>` umstellen.

```xml
<!-- neu -->
<color name="brand-primary"        value="#2968C8"/>
<color name="brand-primary-hover"  value="#245DB2"/>
<color name="brand-primary-active" value="#09387E"/>

<!-- statt sechs Literalen -->
<ref name="button-primary"    ref="brand-primary"/>
<ref name="interactive"       ref="brand-primary"/>
<ref name="link-primary"      ref="brand-primary"/>
<ref name="focus"             ref="brand-primary"/>
<ref name="border-interactive" ref="brand-primary"/>
```

**Wirkung:** Ein Kunden-Theme wird von ~15 Zeilen auf 3. Das ist die Voraussetzung für alles
Kunden-Theming und kostet fast nichts.

*Risiko:* `RefToken` validiert sein Ziel nicht — ein Tippfehler fällt erst im Browser auf. Deshalb
AP 2 direkt danach.

*Verifikation:* `ThemeTokenAudit.themeTokens(...)` liefert für `button-primary` den Wert
`var(--brand-primary)`; gerendertes CSS unverändert.

### AP 2 — Audit erweitern (4 PT) ⚡

`ThemeTokenAudit` um Regeln ergänzen, die heute fehlen. Jede einzeln zuschaltbar, damit der
Bestand nicht auf einen Schlag rot wird.

| Regel | Findet heute |
|---|---|
| `ref`-Ziel existiert | (keine Validierung vorhanden) |
| kein Hex/`rgba()`-Literal | 57 + 19 Stellen |
| kein literaler `font-size` | 56 Stellen |
| kein literaler `font-weight` | 44 Stellen |
| kein literales `padding`/`gap`/`margin` | 111 Stellen |
| kein literaler `transition` | 19 Stellen |
| kein literaler `z-index` | 14 Stellen |
| kein `var(--x, literal)` | 4 Stellen (alle legitim, s. u.) |

Mit Budget-Datei pro Regel, die **nur runter** geht — wie in `tools/check-foreign-values.mjs`
bereits umgesetzt. Die vier `var(--cal-ev-bg, #4589ff)` sind der von der FAQ ausdrücklich
zugelassene Fall (selbst deklarierte Property mit Default) und bleiben.

*Verifikation:* Jede neue Regel meldet beim Einschalten exakt die oben gezählte Menge.

### AP 3 — Dark-Theme reparieren (3 PT + Design)

Die geerbten Light-Werte überschreiben: drei Schatten, `overlay`, `support-*`, `text-error`,
`button-danger*`, `layer-accent*`, `text-on-color`.

Dazu eine **Kontrastprüfung als Test** — `ColorToken` hält bereits `java.awt.Color`, die
Luminanzrechnung ist trivial. Deklarative Paarliste, WCAG 2.1 AA als Gate (BITV/EN 301 549),
geprüft für **jedes** Theme, nicht nur `default`.

*Verifikation:* Kontrast-Gate grün für `default`, `dark`, `flat`.

### AP 4 — Fehlende Token-Kategorien (5 PT)

Neue Token-Gruppen, jeweils mit Audit-Regel aus AP 2:

- **Motion**: `motion-duration-fast/base/slow`, `motion-easing-standard/enter/exit`. Die 19
  Literale konsolidieren (heute 5 Dauern, 3 Easings, ohne System). Dazu
  `prefers-reduced-motion` global statt an einer einzigen Stelle.
- **Fokusring**: `focus-ring-width`, `focus-ring-offset` — heute überall `2px`/`3px` literal.
- **Z-Index**: benannte Ebenen `layer-base/sticky/dropdown/overlay/toast`. Ersetzt 14 Literale
  inklusive `9999999999999999`.
- **Typografie vervollständigen**: `font-weight-regular/medium/semibold`, fehlende Line-Heights
  und Letter-Spacings. `body-02-*` ist ein totes Token — prüfen und entfernen oder verwenden.
- **Komponenten-Tokens**: `control-height`, `field-height`, `control-padding-inline`. Ohne sie ist
  Theming auf Komponentenebene unmöglich und Dichte nicht umsetzbar.

### AP 5 — Dichte (3 PT)

Erst nach AP 4 sinnvoll, weil es Komponenten-Tokens voraussetzt. Als Theme `compact extends
default`, das Spacing, Line-Heights und Control-Höhen überschreibt — analog zu `flat`.

Das Legacy-System löst das über eigene Themes (`coreCondensed`); dieselbe Mechanik, aber ohne die
dortige Duplikation.

### AP 6 — Kunden-Theming (5 PT)

Heute möglich (bewiesen durch `flat`), aber ungelöst:

- **Kein Mandanten-Scope.** Theme-Wahl liegt in `PersonalConfiguration` pro Benutzer. Ein Theme
  pro Tenant/Installation fehlt.
- **Keine Vollständigkeitsprüfung.** Ein Kunden-Theme ohne `extends="default"` erzeugt eine Seite
  mit fehlenden Properties — ohne Fehlermeldung beim Start.
- **Kein Paket.** Was ein Kunde bekommt, ist zu definieren: Theme-XML, Assets, README, Validierung.

Nach AP 1 ist das Kunden-Theme klein genug, um es von Hand zu pflegen:

```xml
<theme name="muster" extends="default" >
  <color name="brand-primary"        value="#8A1538"/>
  <color name="brand-primary-hover"  value="#6E102C"/>
  <color name="brand-primary-active" value="#4F0B1F"/>
  <text  name="font-family"          value="'Muster Sans', 'Inter', sans-serif"/>
</theme>
```

### AP 7 — Token-Export und Figma (8 PT + Design)

Der einzige Bereich ohne jede Vorarbeit. Die Tokens existieren ausschließlich als
TopLogic-Typed-Config-XML — es gibt keinen Export, kein DTCG, kein JSON.

1. **Export** `tl-react-theme.config.xml` → DTCG-JSON (W3C, stabil seit 2025.10). Als Maven-Goal
   oder Node-Skript im Design-System-Repo. Damit werden die Tokens erstmals außerhalb von
   TopLogic lesbar.
2. **Figma-Library** `02fjeGJYJVtkS13LqMk7G4` (verifiziert leer) aus dem Export befüllen:
   Collections `Theme` (Modes Light/Dark), `Spacing`, `Typography`. Abo der alten Library
   `lk-5545b55f…` entfernen.
3. **Namensabbildung** umkehrbar halten: Blattname der Figma-Variable ist byte-identisch mit dem
   Token-Namen, Slashes sind reine Präsentationsordner. Rückweg: `name.split('/').pop()`.
4. **Sync** über die Figma-Plugin-API — die Variables REST API ist Enterprise-only, der
   TopLogic-Plan ist Pro.
5. **Richtung**: Git besitzt Namen und Struktur, Figma die Werte. Ein in Figma erfundener Name ist
   per Definition ein Fehler und bricht den Sync-Job.

### AP 8 — Storybook (5 PT)

Dokumentation und Schaufenster für Designer, Partner und Kunden. Arbeitsteilung mit der
Demo-Gallery: Storybook dokumentiert mit gemockter Bridge, die Demo-App prüft den Java-Vertrag mit
echtem SSE-State.

Voraussetzung ist die TSX-Typisierung (AP 9) — sonst dokumentiert Storybook untypisierte Props.

### AP 9 — Die TSX-Seite (8 PT)

Hier ist die größte ungeschützte Fläche, und der Audit erreicht sie prinzipiell nicht: **er liest
nur Stylesheets.**

- `state: Record<string, unknown>` ist unverändert untypisiert. Jedes Feld per Cast, jede
  State-Union nur als JSDoc-Prosa. Zwei parallele Zugriffswege (`useTLState()` in 55 Dateien,
  `props.state` in 11 — genau den Eingabefeldern).
- Varianten sind ungetypte String-Arbeit über **528 `className=`-Stellen** in zwei Dialekten.
  `tlStack--gap-${gap}` interpoliert Serverwerte ungeprüft in Klassennamen.
- **Kein Linter, kein `tsc --noEmit`, keine Tests, kein Prettier.** `strict: true` steht in der
  tsconfig und wird von niemandem ausgeführt.
- Zwei Hardcodes in TSX: `#1565c0` in `TLTableView.tsx:1355` (Material-Blau, kein Token, zieht im
  Dark-Theme nicht mit), `#000000` in `ColorPopup.tsx`.

Reihenfolge nach Nutzen: `tsc --noEmit` in `mvn compile` → `tl/no-react-import` als Lint-Regel →
State-Schemata → Varianten-Maps.

Der oxlint-Spike in `spikes/oxlint/` belegt, dass das trägt: 125 ms für 96 Dateien, Exit-Code 1,
ESLint-Rule-Shape. Er hat den `createPortal`-Bug gefunden (PR !1618).

### AP 10 — Accessibility (4 PT)

Fundament ist da (`useFocusTrap` mit drei Modi, Keyboard-Scope-Dispatcher), die Anwendung ist
lückenhaft:

- `aria-describedby` und `aria-required` kommen **null Mal** im gesamten React-Code vor.
  Fehlertexte und Pflichtfeld-Markierungen sind mit ihren Feldern nicht verknüpft.
- `TLDialog` und `TLDrawer`: kein `role="dialog"`, kein `aria-modal`, kein Focus-Trap.
- `TLTabBar`: keine Pfeiltasten-Navigation, kein Roving `tabIndex`.
- `useFocusTrap` nur in 3 von 74 Controls.
- `TLFormField`: hartkodiert englisches `aria-label="Help"` in einer i18n-fähigen Schicht.

### AP 11 — Legacy-Seite (offen, eigener Zuschnitt)

Die Nicht-React-UI ist unverändert: `#2968c8` 12× hart, 792 tote Tokens, Deploy-Lücke #29577.

**Das ist eine Architekturfrage, keine Aufgabe:** Löst die React-Schicht die Legacy-UI ab, und
wenn ja, wann? Solange beide existieren, braucht Kunden-Theming zwei Einstiegspunkte. Zu klären
mit bhu, bevor hier Aufwand fließt.

---

## Aufwand

| Block | PT |
|---|---|
| AP 1–3 Marke, Audit, Dark | 9 |
| AP 4–6 Token-Kategorien, Dichte, Kunden-Theming | 13 |
| AP 7–8 Export/Figma, Storybook | 13 |
| AP 9–10 TSX-Seite, Accessibility | 12 |
| **Summe** | **~47 PT** + 8–12 PT Design |

AP 11 nicht geschätzt — hängt an der Architekturentscheidung.

---

## Offene Entscheidungen

1. **Legacy-Ablösung** (AP 11). Bestimmt, wo Kunden-Theming andockt.
2. **Token-Namen.** Die Namen sind IBM-Carbon-Nomenklatur (`layer-01`, `spacing-01..06`,
   `body-compact-01`, `support-*`). Die *Werte* sind TopLogic. Umbenennen hieße 81 Tokens,
   6.011 CSS-Zeilen und 6 Audit-Tests anfassen. **Empfehlung: behalten** — die Namen sind
   intent-basiert und funktionieren; „Carbon" ist hier eine Namenskonvention, keine Palette.
3. **Schrift.** `font-family: 'Inter'` ist gesetzt. Ob das bleibt, entscheidet ein Specimen-Test
   bei 12/13/14px mit echten TopLogic-Tabellen — Kriterium ist Lesbarkeit bei hoher Dichte.
4. **Markenfarbe.** `#2968C8` ist der Ist-Wert. Eine Auffrischung ist gewünscht, `#0f62fe`
   scheidet aus (exakt IBM Carbon Blue 60). Nach AP 1 ist das eine Ein-Wert-Änderung.

---

## Werkzeuge im Repo

| Datei | Zweck |
|---|---|
| `tools/token-inventory.mjs` | Nutzungsindex: Definitionen aus `theme-settings.xml` + 554 Java-Deklarationen gegen CSS-Verbrauch |
| `tools/check-foreign-values.mjs` | Fremdpaletten-Wächter mit Budget-Ratchet |
| `spikes/oxlint/` | Nachweis, dass oxlint-JS-Plugins tragen |

Beide Werkzeuge kennen die Auslieferungswege (`theme.xml` **und** `StyleSheetConfig`).

## Kritische Dateien auf master

- `com.top_logic.layout.react/src/main/java/com/top_logic/layout/react/theme/` — die 9 Token-Klassen
- `com.top_logic.layout.react/src/main/webapp/WEB-INF/conf/tl-react-theme.config.xml` — Token-Quelle
- `com.top_logic.layout.react/src/test/java/test/com/top_logic/layout/react/theme/ThemeTokenAudit.java` — Erweiterungspunkt für AP 2
- `com.top_logic.layout.react/src/main/webapp/style/tlReactControls.css` — 6.011 Zeilen, 81 Tokens, die gezählten Literale
- `docs/faq/react-theme-tokens.md` — die verbindliche Doktrin
