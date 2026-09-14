# TopLogic 8 — LLM-sicheres Design System

## Context

TopLogic 8 bekommt mit Ticket #29108 (TL Views) eine React-basierte UI-Schicht. Der Code existiert:
62 registrierte Controls in `com.top_logic.layout.react`, React 19 + Vite, angebunden ans
Java-Backend über Server-Sent Events. Was fehlt, ist ein Design System, das ihn trägt.

Zwei Kräfte machen das dringend:

1. **Der Autor hat sich geändert.** Ein wachsender Teil der UI-Arbeit entsteht durch LLM-Agenten.
   Ein LLM schreibt fließend CSS — ohne Kenntnis der Entscheidungen dahinter. Es greift zu
   `padding: 16px`, `#0f62fe`. Jeder Wert plausibel, keiner unbedingt unserer. Der Polar-Artikel
   zieht die Konsequenz: *„A design system has to become a set of decisions that are the only ones
   expressible."* Nicht Dokumentation, sondern Compiler und CI.
2. **TopLogic wird beim Kunden deployed.** Jeder Kunde bringt einen eigenen Styleguide mit. Das
   Einspielen muss ein Datei-Austausch sein, kein Frontend-Build.

### Was bereits trägt

**Die Token-Schicht existiert** — in `theme-settings.xml` (2.615 Zeilen, 172 `<color>`,
46 `<string>`, 586 `<icon>`). Ab Zeile 1965 bereits semantisch benannt: `text-primary`,
`layer-hover`, `button-primary`, `border-subtle`, `spacing-01..07`, `body-02-font-size`.

**Der Runtime-Austausch existiert.** `CSSBuffer.java` generiert serverseitig
`:root { --token: value; }`. Vererbung über drei Ebenen: Modul-Overlay
(`FileManager.getDataOverlays`), Parent-Theme (`theme.xml/@extends`, Mehrfachvererbung),
Java-`@DefaultValue`. Eine Kunden-App überschreibt Tokens per eigener `theme-settings.xml` —
ohne Codeänderung, ohne Rebuild.

**Referenzen existieren.** `ThemeSetting.expand()` löst `%VAR%` auf, inklusive `calc()`, mit
Zyklenerkennung. Die Primitive→Semantic-Aliaskette braucht keine neue Infrastruktur.

**Der Stack ist schlank.** React 19, Vite 6, TypeScript 5.7 strict, eine Runtime-Dependency
(`@floating-ui/react`). Kein Tailwind, kein CSS-in-JS, keine Komponentenbibliothek. Es gibt keine
fremde Styling-Konvention, gegen die ein neues System ankämpfen müsste.

### Was defekt ist (alles verifiziert)

| # | Befund | Beleg |
|---|---|---|
| 1 | `#2968c8` steht **12× hart kodiert**, in zwei Schreibweisen | `theme-settings.xml` Z. 1971, 1986, 2043, 2058, 2067, 2076, 2112, 2168, 2180, 2186, 2399, 2420 |
| 2 | `tlReactControls.css` nutzt **177 `var()` mit Fallback** gegen 600 ohne. Fallbacks sind IBM Carbon: `#0f62fe` 14×, `#da1e28` 16× | `grep` über 4.273 Zeilen |
| 3 | **15 konsumierte Tokens sind nirgends definiert** und laufen *permanent* auf den Carbon-Fallback: `support-error`, `text-error`, `layer-01`, `layer-02`, `field-disabled`, `border-subtle-01`, `border-radius-02`, … | für alle existiert ein TL-Pendant |
| 4 | `state: Record<string, unknown>` ist die faktische Props-Fläche aller 62 Controls, untypisiert | `bridge/types.ts` |
| 5 | Varianten sind String-konkatenierte BEM-Modifier. **Bereits ein stiller Bug**: TS erzeugt `tlReactButton--iconOnly`, CSS definiert `.tlReactButton--icon` | `TLButton.tsx` vs. `tlReactControls.css:119` |
| 6 | **`tsc --noEmit` läuft nirgends.** Vite transpiliert nur → `strict: true` ist Dekoration | `package.json`, `vite.config.*.ts` |
| 7 | Kein Linter, keine Frontend-Tests, kein Storybook | verifiziert per `find` |
| 8 | Kein Dark Mode (`prefers-color-scheme` → 0 Treffer) | `react-src/`, `tlReactControls.css` |
| 9 | Dichte-Themes sind zu ~95 % Copy-Paste: `coreCondensed` und `coreSidebarCondensed` sind bis auf 4 Zeilen identisch (2×110 Zeilen) | beide `theme-settings.xml` |
| 10 | **Im Deploy-Modus wird kein Theme-CSS generiert.** `Theme.java:237` referenziert nur den Dateinamen; ein `JSDeploy`-Pendant für CSS fehlt | bedroht die Kernanforderung direkt |
| 11 | Der Theme-Editor schreibt `theme-settings.xml` per `ConfigurationWriter` zurück und verliert dabei Kommentare, Reihenfolge und Header | `com.top_logic.layout.themeedit` |
| 12 | Keine Theming-Dokumentation in `com.top_logic.doc` oder `tl-doc` — nur Javadoc | — |

### Getroffene Entscheidungen

| Thema | Entscheidung |
|---|---|
| Farbbasis | Eigenständige TopLogic-Palette, algorithmisch aus **einem** Markenanker abgeleitet. Carbon-Fallbacks werden eliminiert. |
| Markenanker | **Noch offen.** `#2968C8` bleibt Interimswert. Entscheidung in AP 6a am Bild, nicht am Hex-Wert. Kein Carbon-Klon: `#0f62fe` ist exakt IBM Carbon Blue 60 und scheidet aus. |
| Source of Truth | Hybrid. Figma Variables = Master für **Werte**. Git (DTCG) = Master für **Namen, Struktur, Typen**. |
| Figma-Sync | Über die **Plugin-API**, nicht REST — die Variables REST API ist Enterprise-only, der TopLogic-Plan ist Pro. |
| Figma-Datei | `02fjeGJYJVtkS13LqMk7G4` — „Component Library - TL Design System (2026)". Verifiziert **leer** (eine Seite, keine Inhalte). |
| Figma-Bestand | **Von 0.** Die alte Library `lk-5545b55f…` wird als Abo entfernt, nicht als Basis genutzt. Variablennamen kommen aus der DTCG-Quelle im Git, nicht aus Figma — das ist ohnehin die Source-of-Truth-Regel. |
| Storybook | Ja, in Stufe 2. Arbeitsteilung: Storybook dokumentiert, Demo-Gallery prüft den Java-Vertrag. |
| Kunden-Theming | Zur Laufzeit, ohne Rebuild, über den bestehenden Theme-Overlay-Mechanismus. |
| Dark Mode | `light-dark()` pro Token, generiert aus der Token-Quelle. |
| Dichte | Bleibt Theme-Layer (Server braucht die Maße), aber entdoppelt über Mehrfachvererbung. |
| Migration | Neue Primitive-Schicht, bestehende Controls Datei für Datei. Kein Big-Bang. |
| Verortung | Gitea, liefert ein Maven-Artefakt an die Engine. **Aktuell `hpe/tl-design-system`** — der Owner liess sich beim Anlegen nicht auf `TopLogic` setzen (Repo-Limit der Organisation). Transfer nach `TopLogic` steht aus, siehe offene Punkte. |
| Zuschnitt Stufe 1 | Fundament. Noch keine Komponenten-Migration. |
| Schrift | Offen — Entscheidung über Specimen-Test bei 12/13/14px mit echten TopLogic-Inhalten. |

---

## Architektur

### Drei Token-Ebenen — Primitives erzeugen *keine* CSS-Variable

Das ist der Kern der LLM-Sicherheit: existiert `--blue-60` im `:root` nicht, kann es niemand
benutzen. Primitives leben ausschließlich im XML-/`%VAR%`-Raum.

| Ebene | XML-Name | CSS-Variable | Anzahl | Wer ändert |
|---|---|---|---|---|
| 1 Primitive | `tl.primitive.*` (FQN) | **keine** (`css="false"`) | ~165 | Kunde, DS-Team |
| 2 Semantic | unqualifiziert — **exakt der heutige Namensraum** | `--text-primary`, … | ~225 | nur DS-Team |
| 3 Component | unqualifiziert, Komponente im letzten Segment | `--table-row-height`, … | ~70 | nur DS-Team |
| Legacy | `*.Icons.SCREAMING_SNAKE` | schrumpfend → 0 | 377 → 0 | niemand |

**Ebene 2 bekommt bewusst keinen Präfix.** `ThemeSetting.getLocalName()` kürzt FQN auf das letzte
Segment — ein Rename auf `tl.semantic.background-brand` erzeugt dieselbe CSS-Variable, aber ein
*anderes* Setting. Jedes bestehende Kunden-Theme, das `background-brand` überschreibt, griffe ins
Leere. Die Migration ist deshalb **rein wertneutral: nur `value=` → `expr=`.** Kein CSS, kein JSP,
kein Kunden-Theme wird angefasst.

Als Absicherung bekommt `CSSBuffer.appendVariables()` eine **Kollisionsprüfung auf `getLocalName()`**
mit Startabbruch. Heute überschreibt die alphabetisch letzte Definition still die andere.

Vorher/Nachher für das Brand-Blau:

```xml
<!-- vorher, 12× verstreut -->
<color name="background-brand" value="#2968c8"/>
<color name="button-primary"   value="#2968c8"/>
<color name="focus"            value="#2968C8"/>

<!-- nachher, generiert -->
<color name="tl.primitive.color.blue-60" value="#2968C8" css="false"/>  <!-- Interimsanker, AP 6a -->
<color name="background-brand" expr="%tl.primitive.color.blue-60%"/>
<color name="button-primary"   expr="%tl.primitive.color.blue-60%"/>
<color name="focus"            expr="%tl.primitive.color.blue-60%"/>
```

CSS-Ergebnis identisch. Kundenwirkung: **eine Zeile ersetzt die Marke an allen zwölf Stellen** —
und dieselbe Zeile trägt später die Markenentscheidung aus AP 6a.

### Dark Mode: `light-dark()` mit `@supports`-Doppelblock

Neue optionale Attribute `dark` / `dark-expr` auf `ThemeSetting.Config`, parallel zu `value`/`expr`.
`getCssValue()` gibt `light-dark(hell, dunkel)` aus, sonst nur den Light-Wert. Fehlt der Dark-Wert,
gilt dark = light → **jedes bestehende Theme erzeugt byteidentisches CSS.**

```css
:root { color-scheme: light dark; --background: #ffffff; }
@supports (color: light-dark(#000, #fff)) {
  :root { --background: light-dark(#ffffff, #101113); }
}
```

Der `@supports`-Block ist nicht optional: `light-dark()` ist Baseline seit Mai 2024, ältere Browser
verwerfen die **gesamte Deklaration** → Variable undefiniert → unbedienbare UI ohne Degradieren.

Drei Punkte, die man leicht übersieht:
- `ColorSetting.getValue()` liefert `java.awt.Color` und wird für gerenderte Bitmaps genutzt
  (`reporting.Icons.GRAD0..4`, `PASSWORD_BAR_*`). **`light-dark()` darf nur in `getCssValue()`
  entstehen, nie im Wertmodell.** Charts und Bitmaps bleiben hell — bewusste, dokumentierte Lücke.
- `ThemeSetting.copy()` teilt heute Instanzen, solange `getExpr() == null`. Mit Dark-Expressions
  führt das zu themenübergreifend falsch aufgelösten Werten. Bedingung muss
  `getExpr() == null && getDarkExpr() == null` werden.
- String-Tokens mit eingebetteter Farbe (`shadow-menu: 0 2px 6px rgba(0,0,0,.32)`, `icon-outline`
  mit 13× `#fff`) müssen die Farbe herausziehen: `<color name="shadow-menu-color" dark="…"/>` +
  `<string name="shadow-menu" value="0 2px 6px var(--shadow-menu-color)"/>`. Daraus folgt die
  Lint-Regel *kein Hex-Literal in einem `<string>`-Setting*.

Benutzerwahl Hell/Dunkel/System läuft über `color-scheme` auf `<html>`
(`MainLayout.writeHtmlStartTag`) + `PersonalConfiguration`-Key, analog zu
`MultiThemeFactory.PERSONAL_THEME_KEY`. **Audit nötig:** weitere `<html>`-Erzeuger (`index.jsp`,
`SystemState.jsp`, Error-Pages, Popup-Fenster) — ein vergessener Ort erscheint hell in dunkler App.

### Dichte bleibt Theme-Layer — aber entdoppelt

Dark und Dichte sehen symmetrisch aus, sind es nicht. Dark ist ein Farbraumwechsel, rein
clientseitig lösbar. **Dichte ist ein Maßwechsel, und die Maße werden serverseitig gebraucht**:
`MAIN_NAVIGATION_BAR_HEIGHT`, `TABBAR_HEIGHT`, `FROZEN_TABLE_ROW_HEIGHT` fließen als
`ThemeVar<Integer>` in Java-Layoutberechnungen (gefrorene Tabellen, Scroll-Offsets). Ein reiner
CSS-Schalter ließe Server und Client auseinanderlaufen — Server rechnet 32px, DOM rendert 24px.
Das Fehlerbild debuggt man wochenlang.

Stattdessen: abstraktes Theme `tlTokensCompact` mit **~25 Settings statt 110**, eingebunden per
Mehrfachvererbung (`coreCondensed extends="core tlTokensCompact"`). **220 Zeilen Duplikat
verschwinden.** `coreCondensed.css` wird tokenisiert und dann gelöscht.

### Primitive-Schicht: Utilities + Rezepte, getrennt nach Ausdruckbarkeit

| Was | Wie | Warum |
|---|---|---|
| Layout, Abstände, Farben, Radius, Schatten | **generierte Utility-Klassen** `.tl-p-m { padding: var(--spacing-03) }` | kombinatorisch; nur Utilities sind darin beschränkt |
| Zustände (`:hover`, `:focus-visible`, `:disabled`), Pseudo-Elemente, Animationen | **generierte Rezept-Klassen** | als Props prinzipiell nicht ausdrückbar |
| Zur Laufzeit berechnete Geometrie | **`unsafeGeometry`-Prop, ausschließlich `number`** | echte Notwendigkeit in `TLTableView` |

Beide kommen aus **demselben Generator und derselben Token-Quelle** — Drift zwischen Utility und
Rezept ist strukturell ausgeschlossen.

**StyleX scheidet aus:** compile-time, kann Werte nicht ohne Rebuild tauschen. Inline-`style` mit
`var()` scheidet aus: kann `:hover`/`:focus-visible`/`@media` nicht ausdrücken — ein Design System,
das die Fokusringe nicht besitzt, ist keins.

Größenordnung: ~300 Regeln, **~15 KB roh / 2,5 KB gzip**, statisch. Gegen die 93 KB von
`tlReactControls.css` ein Rundungsfehler — und netto negativ, sobald migrierte Komponenten ihr
BEM-CSS verlieren.

Fünf Primitives: **`Box`** (Layout, ohne `margin`, ohne numerischen `zIndex`), **`Text`**
(`variant` setzt size/line-height/weight/letter-spacing *gemeinsam*), **`Icon`** (`label: string |
null` pflichtig → keine a11y-Entscheidung per Versehen), **`Pressable`** (Fokusring, disabled,
Touch-Target — Pseudo-Klassen-Logik, die als Props nicht ausdrückbar ist), **`Overlay`**
(Focus-Trap, `role="dialog"`, `aria-modal`, Escape, Scroll-Lock).

`Overlay` schließt **alle fünf heute offenen a11y-Lücken** in `TLDialog`/`TLWindow`/`TLDrawer` mit
einer Komponente. Bester Return-on-Investment im ganzen Plan.

### Spezifitätskonflikt: `@layer`

```css
@layer tl.legacy, tl.recipe, tl.util;
```

`tlReactControls.css` bekommt einen **zweizeiligen Diff** (`@layer tl.legacy {` … `}`). Danach
gewinnt jede Utility gegen jeden der 124 erhöhten Legacy-Selektoren, unabhängig von Spezifität.
Es gibt **0× `!important`** im Bestand — die Ausgangslage ist besser als befürchtet.

**Fallstrick:** ungelayertes CSS gewinnt gegen gelayertes. Die 14 Stylesheets aus
`com.top_logic.themes.core` (`core.css`, `form.css`, `tables.css`) sind ungelayert. Bestandsaufnahme
in Stufe 1: welche Nicht-React-Stylesheets greifen auf React-Klassen? Erwartung gering (die
BEM-Namen sind exklusiv), aber das muss **gemessen**, nicht angenommen werden.

### Enforcement: was CI durchsetzt

Reihenfolge nach Nutzen pro Aufwand — bewusst nicht nach Sichtbarkeit:

1. **`tsc --noEmit` in `mvn compile`.** Eine Zeile. Ohne sie ist `strict: true` Dekoration und der
   ganze Rest Dokumentation.
2. **`tl/no-react-import`.** Zehn Zeilen. Die Regel steht seit Jahren dreimal in `CLAUDE.md`, mit
   Ausrufezeichen, in Codeblöcken — und ist nie durchgesetzt. Das perfekte Lehrstück für
   *„anything you put in a doc is a probability"*.
3. **`defineState` + State-Verträge.** Schließt die eigentliche, heute völlig offene Prop-Fläche.
4. **`components.json` + `check:variants`.** Beseitigt die `--iconOnly`-Bugklasse strukturell.
5. **`Box`/`Text` + Utilities.** Der sichtbarste, aber am wenigsten dringende Teil.

**Linter: oxlint.** Greenfield (keine ESLint-Config zu migrieren), sechs npm-Projekte ohne
Workspaces (ESLint wären 6×150 MB `node_modules` bei jedem `mvn compile`), eingebaute
`jsx-a11y`-Regeln. Geprüft: **keine** unserer 15 Custom-Rules braucht Typinformation — alle sind
syntaktisch. Version exakt pinnen, Rules in ESLint-Rule-Shape schreiben, damit ein Port ein
Config-Wechsel bleibt und kein Rewrite.

Kernregeln (Auszug — vollständig im Repo):

| Regel | Meldung |
|---|---|
| `tl/no-react-import` | *Import React from `'tl-react-bridge'`, never from `'react'`. A second React copy breaks all hooks at runtime.* |
| `tl/no-design-literals` | *`#0f62fe` is not a color, it is a guess. Use `color="text-primary"`.* |
| `tl/no-computed-class` | *Class names must come from a generated variant map, never from string concatenation. This is how `tlReactButton--iconOnly` happened.* |
| `tl/no-class-name` | *`className` is not part of the component API. If no prop exists, that is a gap in the design system — open a ticket.* |
| `tl/no-untyped-state` | *`useTLState()` needs a state schema: `useTLState(TLCardState)`.* |
| `stylelint tl/no-token-fallback` | *Remove the fallback. The Carbon fallbacks are the drift this system exists to remove.* |
| `stylelint tl/known-token` | *Unknown design token `--foo`. A typo here fails silently at runtime.* |

Die Fehlermeldungen sagen bewusst *warum*, nicht nur *was* — das ist der Satz, der im frischen
Kontextfenster überlebt.

**Der State-Vertrag** ist der Teil, den Polar nicht hat. TopLogic hat zwei Prop-Flächen; die
gefährlichere ist `state: Record<string, unknown>`. Lösung: Vertrag als **Laufzeit-Schema-Objekt**,
nicht als TS-Typ — daraus fällt der Typ ab, *und* es ist maschinenlesbar, also später nach Java
generierbar.

```ts
export const TLCardState = defineState('TLCard', {
  title:   s.string().nullable(),
  variant: s.enum(CardVariant).default('outlined'),
  padding: s.enum(CardPadding).default('default'),
  child:   s.child(),
});
// const state = useTLState(TLCardState);  ->  state.variant: 'outlined' | 'elevated'
```

~250 LOC ohne Dependencies (kein Zod — neue Runtime-Dependency in einem bewusst minimalen Stack,
und wir bräuchten 5 % davon). Dev-Modus validiert jedes State-Event gegen das Schema und meldet
unbekannte Keys — **schließt die Lücke zu Java ohne Generator**. Im Production-Build per
`process.env.NODE_ENV` herauskompiliert.

Das JSDoc in `TLCard.tsx`, `TLStack.tsx`, `TLFormField.tsx` *ist* bereits das Schema, nur in Prosa.
Es wird von unverbindlicher Doku zu geprüftem Code.

### Escape-Hatch-Ratchet

Drei Hatches, alle zählbar: `oxlint-disable` mit Pflicht-Begründung + Ticket, `unsafeGeometry`
(nur `number`, keine Strings — kann ausschließlich Geometrie ausdrücken), `unsafeClassName` (nur
für Dateien in `legacy-files.json`, wird am Ende gelöscht).

`escape-hatch-budget.json` bricht den Build **in beide Richtungen**: über Budget = rot,
*unter* Budget ebenfalls rot mit *„Budgets only go down — commit the new budget."* Ohne den zweiten
Teil schleicht die Zahl über Monate zurück nach oben, weil jede Erhöhung unter dem alten Höchststand
bleibt.

Startwerte gemessen: 31 Inline-Styles in 19 Dateien, 29 inline-SVGs.

Quartalsauswertung: Wenn `tl/no-class-name` fünfmal für dasselbe fehlende Prop umgangen wurde, ist
das **kein Disziplinproblem, sondern ein Bug im Design System.** Der Fix ist die neue Prop.

### Figma

**Drei Dateien** im Ordner `614719290`, Plan `team::1059742473474953587`:
`TL8 · Core` (Library: Variables + Styles + Komponenten), `TL8 · Icons` (Library),
`TL8 · Patterns` (unpubliziert — Screens sind Konsumenten, nie Quelle), plus `TL8 · Sandbox`.

Foundations und Komponenten bewusst in *einer* Datei: liegen Variablen in einer anderen, sind sie
*remote* und brauchen pro Binding `importVariableByKeyAsync(key)` — bei ~200 Tokens eine
zusätzliche Fehlerquelle und ein State-Ledger, der Keys *und* IDs führen muss.

**Collections** (Pro-Tier erlaubt max. 4 Modes):

| Collection | Modes | Inhalt |
|---|---|---|
| `Primitives` | `Value` | CI-Farben + Rampen. Scopes `[]` → **unsichtbar in jedem Picker** |
| `Theme` | `Light`, `Dark` | semantische Farben, **ausschließlich Aliase** |
| `Spacing` / `Typography` | `Value` | `spacing-01..07`, 7 Skalen × 3 |
| `Density` | `Comfort`, `Condensed` | `input-height`, `form-line-height`, Zeilenhöhen |

Zwei Modes je Collection lässt Reserve für High-Contrast-Varianten.

**Die umkehrbare Namensabbildung** — der kritische Punkt für den Sync:

> Der Blattname einer Figma-Variable ist byte-identisch mit dem Code-Tokennamen. Slashes sind
> ausschließlich Präsentationsordner und tragen keine Information.

```
Code:  background-accent-1--selected--hover
Figma: color/Base/Accent 1/background-accent-1--selected--hover
Rück:  token = figmaName.split('/').pop()      // eine Zeile, verlustfrei
```

Die naheliegende Alternative (`--` → `/`) erzeugt sofort Mehrdeutigkeit: `background-accent-1`
(Familienname) und `background--accent-1` (Modifier) kollabieren auf dieselbe Slash-Form, und der
Rückweg muss raten. Die bestehende Library lebt die Blattnamen-Regel bereits.

Drei CI-prüfbare Invarianten: Blattnamen global eindeutig; jede Variable trägt WEB-Code-Syntax
`var(--<blattname>)` als redundante Zweitquelle; Ordnerpfade sind frei umsortierbar. Letzteres
verschenkt nichts — es macht *Deprecation* elegant: ein abzulösender Token wandert nach
`Theme/Deprecated/`, ohne dass sich der Code-Name ändert.

**Scopes sind der wirksamste Governance-Hebel.** Alle Variablen der bestehenden Library stehen auf
`ALL_SCOPES` — das ist der erste zu behebende Fehler. Wenn beim Setzen einer Textfarbe 130 Tokens
zur Auswahl stehen statt 7, tippt der Designer den Hex-Wert.

**Aufräumen:** Die abonnierte Fremd-Library „Component library - Mercedes MVP" hat identische
Variablennamen. `search_design_system` liefert beide vermischt — ein Agent ohne
`includeLibraryKeys` greift zufällig zum Falschen. Abo beenden, jede Suche zwingend scopen.

---

## Stufe 1: Fundament

Zielbild am Ende: Die Token-Kette Figma → DTCG → `theme-settings.xml` → `:root` → TypeScript steht,
Dark Mode ist strukturell erzwungen, die Carbon-Drift ist weg, CI setzt die ersten Regeln durch, und
ein Kunde kann sein Theme mit drei Zeilen einspielen. **Noch keine Komponenten-Migration.**

### Arbeitspaket 0 — Blocker verifizieren (2 PT)

Vor allem anderen, weil jedes Ergebnis den Plan ändern kann.

1. **Deploy-Modus-Lücke** (Befund 10). `Theme.java:237` generiert im Deploy-Modus nichts, ein
   CSS-Pendant zu `JSDeploy` existiert nicht, `production-mode.xml` wird nur über
   `deploy/prod/.../metaConf.txt` aktiviert. Klären: Wie kommt das Stylesheet heute in eine
   Prod-Installation? Fix (empfohlen): `initializeTheme()` generiert auch im Deploy-Modus, **wenn
   die Zieldatei fehlt** — ~10 Zeilen, genau die gewünschte Semantik, trägt nachgereichte
   Kunden-Themes ohne Prozessänderung.
2. **Browser-Matrix.** `@layer` Baseline 2022, `light-dark()` Baseline Mai 2024. Reicht das für
   TopLogics Kundenbasis? Fallback für beides existiert, ist aber deutlich schlechter.
3. **oxlint-Plugin-Spike.** Genau **eine** Regel (`tl/no-react-import`) durch die JS-Plugin-API
   bauen. Trägt sie nicht, fällt die Entscheidung auf ESLint — die Regeln selbst sind portabel.
4. **`@layer`-Bestandsaufnahme.** Für jede der 62 Komponenten prüfen, welche der 14 ungelayerten
   Stylesheets aus `com.top_logic.themes.core` auf sie zugreifen.
5. ~~**Figma-fileKey.**~~ **Erledigt.** `02fjeGJYJVtkS13LqMk7G4`. Datei ist verifiziert leer
   (eine Seite „Page 1", keine Inhalte) und abonniert noch die alte Library `lk-5545b55f…` —
   dieses Abo ist in AP 1 zu entfernen. Mercedes MVP ist hier **nicht** abonniert.

### Arbeitspaket 1 — Repo und Inventur (3 PT)

Gitea-Repo `TopLogic/tl-design-system` anlegen, Trac-Ticket, Branch `CWS/CWS_<nr>_design_system`.

Nutzungsindex über alle `theme-settings.xml` und alle Engine-`*.css`: definiert / konsumiert / tot.
Das ist jetzt die **einzige** Inventurquelle — die Figma-Datei ist leer, es gibt nichts abzugleichen.
Der ursprünglich geplante Gap-Report Figma↔Code entfällt ersatzlos.

Figma-Aufräumen: Abo der alten Library `lk-5545b55f…` aus `02fjeGJYJVtkS13LqMk7G4` entfernen, damit
keine Carbon-Werte und kein Fremd-Namensschema einlecken. Die Datei `r0LCAH2pa4nxcUU2JNkBZu`
(Mercedes-Abo, Alt-Foundations) wird archiviert und nicht weiter referenziert.

### Arbeitspaket 2 — Carbon-Drift schließen (2 PT) ⚡ *höchster Nutzen pro Aufwand*

Die 15 undefinierten Tokens auf den Bestand umbiegen (`support-error`→`support-danger`,
`layer-01`→`layer`, `field-disabled`→`background-disabled`, `border-subtle-01`→`border-subtle`, …),
**alle 177 `var(--x, #hex)`-Fallbacks entfernen**.

*Verifikation:* `grep -c "var(--[a-z0-9-]*, *#" tlReactControls.css` == 0. Screenshot-Diff.
Unabhängig von allem anderen auslieferbar.

### Arbeitspaket 3 — `css="false"` + Kollisionsprüfung (2 PT)

`ThemeSetting.Config#isCss()`, `CSSBuffer` bricht bei doppeltem `localName` mit Fehler ab. Reine
Java-Konstanten (`QUICK_SEARCH_MAX_RESULTS`, `FILTER_DIALOG_WIDTH`, `TOOL_ROW_HEIGHT`, …)
markieren — der größte Teil der 377 Legacy-Settings, kostet fast nichts.

*Verifikation:* `_<Theme>_theme.css` schrumpft messbar, `TestTheme` grün, App startet ohne
Kollisionsfehler.

### Arbeitspaket 4 — Token-Modul und Generator (8 PT)

Neues Maven-Artefakt `tl-themes-tokens` aus dem Design-System-Repo, eigenes Theme `tlTokens`,
`core/theme.xml` bekommt `extends="tlTokens"`.

**Physische Trennung statt Merge-Werkzeug:** `tlTokens/theme-settings.xml` ist **100 % generiert**,
`core/theme-settings.xml` bleibt **100 % handgepflegt** (586 Icons, Templates, schrumpfende Legacy).

Werkzeug: **Style Dictionary 4** (nativer DTCG-Support, Custom Formats in ~50 Zeilen — und genau
die braucht man, weil ein `theme-settings.xml`-Format nirgends fertig existiert). Node v20.10.0 über
`frontend-maven-plugin` 1.15.4, identisch konfiguriert wie `com.top_logic.layout.react/pom.xml`.
**`nodeDownloadRoot` auf internen Nexus-Mirror** — sonst bricht der Offline-Build.

Generierte Artefakte: `tlTokens/theme-settings.xml`, `tlTokensCompact/theme-settings.xml`,
`tokens.ts` + `tokens.d.ts`, `.stylelintrc.tokens.json` (Allowlist), aufgelöstes `tokens.dtcg.json`,
`figma-variables.json`, `TOKENS.md` + Galerie, `contrast-report.json`.

*Verifikation Stufe A:* `:root` **byteidentisch** zum Vorher-Stand (Primitives sind `css="false"`).

### Arbeitspaket 5 — Semantics auf `expr`, Golden File (6 PT)

Die ~172 Farb-Settings von `value=` auf `expr=` umschreiben.

Neuer Test **`TestThemeCssSnapshot`** hält den `:root`-Block als Golden File pro Theme.
**Dieser Test sichert alles Folgende ab** — ohne ihn sind die Wertänderungen danach reine
Vertrauenssache.

*Verifikation:* `:root` byteidentisch nach Hex-Normalisierung.

### Arbeitspaket 6a — Markenblau bestimmen (2 PT + Entscheidung)

Läuft parallel zu AP 4/5 und blockiert nur AP 6. Die Architektur ist wertneutral — der Anker ist
**ein** Token (`tl.primitive.color.blue-60`), alles andere wird daraus gerechnet.

Vorgabe: Charakter eines kräftigen, elektrischen Blaus, aber **klar unterscheidbar von IBM Carbon**.
Carbon Blue 60 (`#0f62fe`) ist OKLCH `L 0.556 / C 0.243 / H 262` — Chroma und Lightness tragen den
Charakter, der Hue trägt die Identität. Kandidaten werden deshalb bei gehaltenem `L`/`C` über eine
Hue-Verschiebung von 15–25° erzeugt (kühler Richtung H 275–285, wärmer Richtung H 240–248), plus
je eine Variante mit leicht abgesenktem Chroma für dichte Masken.

Entscheidung wie beim Specimen-Test **am Bild**: 5–6 Kandidaten, jeweils vollständige Rampe 10–100,
angewandt auf denselben realen TopLogic-Ausschnitt (Tabelle mit Selektion und Hover,
Formular mit Fokusring, Primary- und Danger-Button, Link im Fließtext), Light **und** Dark.
Bewertungskriterien: Unterscheidbarkeit von Carbon und von Microsoft-Blau, Fokusring-Sichtbarkeit
auf `layer`, Kontrast `text-on-color` gegen `button-primary` ≥ 4.5, Verhalten neben den
Statusfarben (Blau darf nicht mit `support-info` verschwimmen).

*Ergebnis:* ein Hex-Wert. Alles Weitere ist Rechnung.

### Arbeitspaket 6 — Palette generieren und einziehen (4 PT + Design)

Aus dem Anker werden alle Rampen algorithmisch erzeugt — **OKLCH, nicht geraten**. Die
Ableitungsregel (Lightness-Stufen, Chroma-Profil, Gamut-Clipping per Binärsuche) liegt im Repo,
damit Figma und Code dieselbe Rampe erzeugen. Ein Prototyp der Berechnung existiert bereits und
trifft den Anker exakt.

| Rampe | Rolle | Hue-Bestimmung |
|---|---|---|
| `blue` | Marke, Interaktion, Fokus, Links, `support-info` | Anker aus AP 6a |
| `neutral` | Flächen, Text, Rahmen | Anker-Hue, Chroma ≈ 0.01 — kühle Neutrale statt reinem Grau |
| `red` | `support-danger`, `button-danger` | ~H 27 |
| `amber` | `support-warning` | ~H 85 |
| `green` | `support-success` | ~H 149 |
| `teal` / `violet` | Akzentfamilien 2 und 3 | ~H 195 / ~H 300 |

Je Rampe 10 Stufen (10–100), Anker auf Stufe 60. Die ~84 systematischen Familientokens
(`{background|text}-<family>[--selected][--hover][--lighter]` × 7 Familien) haben heute ein
Namensschema, aber **keine** Werte-Spezifikation — sie werden aus den Rampen abgeleitet, nach einer
im Repo dokumentierten Zuordnung (z. B. `--hover` = eine Stufe dunkler, `--lighter` = Stufe 20).
Ohne diese Regel entstehen zwangsläufig zwei divergierende Rampen in Figma und Code.

*Verifikation:* Kontrast-Gate grün in Light **und** Dark. Golden File bewusst aktualisiert, mit
Vorher/Nachher-Bildpaar im PR.

### Arbeitspaket 7 — Dark-Infrastruktur in Java (6 PT)

`getDarkValue()`/`getDarkExpr()`, `ColorSetting.Config`-Override, schema-parametrisiertes
`expand()`, `getRawValue(scheme)`, **`copy()`-Fix**, `getCssValue()` mit `light-dark()`,
`ThemeConfig#supportsDark()`, `CSSBuffer` mit `color-scheme` + `@supports`,
`MainLayout.writeHtmlStartTag` + `PersonalConfiguration`-Key + Audit aller `<html>`-Erzeuger.

*Verifikation:* Neue Tests in `TestTheme.java` (Dark-Vererbung, `expr`-Dark-Auflösung, Fallback auf
Light, Zyklen). **Ein Theme ohne Dark erzeugt identisches CSS wie vorher.**

### Arbeitspaket 8 — Dark-Werte (6 PT + Design)

`dark-expr` für ~172 Semantics. `shadow-menu` und `icon-outline` refaktorieren.

*Verifikation:* Kontrast-Gate Dark grün. Lint „kein Hex in `<string>`" grün.

### Arbeitspaket 9 — Dichte entdoppeln (4 PT)

`tlTokensCompact`, `coreCondensed`/`coreSidebarCondensed` auf `extends` umstellen, 220 Zeilen
löschen, `coreCondensed.css` tokenisieren und danach löschen.

*Verifikation:* `:root` beider Condensed-Themes vorher/nachher identisch.

### Arbeitspaket 10 — Enforcement-Grundgerüst (5 PT)

`tsc --noEmit` in `mvn compile` (**zuerst**, eine Zeile), oxlint + Stylelint + die Custom-Rules,
`@layer`-Wrapper um `tlReactControls.css`, `legacy-files.json` / `migrated-files.json`,
`escape-hatch-budget.json`, Generator-Checks (`check:generated`, `check:tokens`, `check:variants`).

Verdrahtung als `frontend-maven-plugin`-Executions in `generate-resources`, **vor** dem bestehenden
`npm-build`. Exit-Code ≠ 0 bricht den Maven-Build — mehr braucht CI nicht.

Tooling nur in `com.top_logic.layout.react` installieren und die Geschwister-Module per relativem
Glob mitlinten (ein `npm install`, ein Lauf, eine Config). `tsc --noEmit` dagegen **pro Modul**
(eigene `tsconfig.json`, eigenes `paths`-Mapping).

**Regelstufung über eingecheckte Dateilisten, nicht über globale Schweregrade:**

| Dateizustand | `tl/*`-Regeln |
|---|---|
| in `migrated-files.json` | **error** — kann nie zurückfallen |
| in `legacy-files.json` | **off** (nur `tl/no-react-import` sofort error) |
| in **keiner** Liste (= neue Datei) | **error**, vollständig, ab Tag 1 |

Dazu `check:legacy-snapshot`: **Aus `legacy-files.json` darf nur entfernt, nie hinzugefügt werden.**
Ohne diese Regel legalisiert der erste Eintrag eine neue Datei und der Mechanismus ist wirkungslos.

*Der eigentliche Hebel:* Es gibt 62 alte und 43 neue Komponenten. Wenn die 43 neuen ab Tag 1 im
neuen Stil entstehen, kippt die Mehrheit innerhalb eines Jahres — unabhängig vom Migrationstempo.

### Arbeitspaket 11 — Figma-Foundations (6 PT + Specimen)

Collections und Modes anlegen, Werte auf CI, Scopes setzen, Code-Syntax `var(--<blatt>)` auf jede
Variable, Alias-Disziplin (`Theme` enthält **null** Rohwerte — CI-Regel, denn ein vergessener
Dark-Wert fällt sonst still auf Light zurück).

**Specimen-Test parallel** (1 PT Aufbau + 2 Tage Bewertung), eigene Datei, fünf Frames,
**Kandidaten anonymisiert als A–E** — „Inter" wird sonst bewertet, bevor jemand hinsieht. Sieben
Blöcke mit echten TopLogic-Inhalten: Tabellenraster 20×36px in 12 und 14px mit Zahlenkolonnen
(`1.234.567,89`, negative Werte) — **Tabular Figures sind K.-o.-Kriterium**; Glyphen-Disambiguierung
`0 O o / 1 l I | / 5 S / 8 B / rn m` bei 12px; deutsche Komposita mit Umlauten
(`Übertragungsschlüssel`, `Größenänderung`) in 120px-Spalten; Formularlabels in 24px/32px;
Überschriftenskala mit nur 400/600 — das ist die eigentliche Frage; Comfort vs. Condensed;
Dark Mode.

Gewichtung: Ziffernlesbarkeit 25 %, Glyphen 20 %, Diakritika 15 %, Hierarchie mit zwei Schnitten
15 %, Dark 10 %, Dichte 10 %, Lizenz/Verfügbarkeit 5 %. **Tie-Break vorab festgelegt:** liegen zwei
innerhalb 0,3 Punkten, gewinnt Inter (wird bereits ausgeliefert). Diese Regel muss *vor* der
Bewertung stehen, sonst wird sie zur Rationalisierung.

Vorbedingung: `listAvailableFontsAsync()` gegen alle Kandidaten — Geist ist das Risiko, und
Style-Strings unterscheiden sich (`Semi Bold` mit Leerzeichen bei Inter).

### Arbeitspaket 12 — Kundenpaket und Doku (5 PT)

```
<kunde>-theme/
  WEB-INF/themes/<kundeId>/theme.xml            # extends="coreSidebar" supports-dark="true"
  WEB-INF/themes/<kundeId>/theme-settings.xml   # NUR Overrides, bevorzugt Primitives
  WEB-INF/themes/<kundeId>/theme-resources/     # logo.svg, favicon.svg
  WEB-INF/conf/<kunde>.theme.config.xml         # default-theme
  style/<kundeId>-fonts.css + fonts/*.woff2
  README.md  validate.sh
```

1:1 nach `deploy/<stage>/webapp/` kopieren. Kein Rebuild, kein Maven.

`tl-archetype-app` hat heute **keinen** `themes/`-Ordner — ergänzen, inklusive `<fileSet>` in
`archetype-metadata.xml`, damit jede neue App ab Tag 1 ein Theme-Skelett hat.

Validierungs-CLI `mvn tl-maven-plugin:theme-validate` (das Modul existiert, `CheckResources` ist das
Muster), **ohne laufende App**: Vollständigkeit, Typen, Schichtdisziplin (Override auf Ebene 2/3 →
Warnung „besser Primitive überschreiben"), Kontrast nach deklarativer Paarliste — **WCAG 2.1 als
verbindliches Gate** (BITV / EN 301 549), APCA als Zusatzinformation, jeweils Light *und* Dark —,
Dark-Vollständigkeit, Ressourcen, HTML-Report mit Farbkacheln und Kontrastmatrix.

**Generierte Doku** (`TOKENS.md`, `COMPONENTS.md`, `RULES.md`, `RECIPES.md`) plus `check:docs`, das
prüft, dass jede Lint-Regel in `RULES.md` steht und umgekehrt. Doku kann damit unvollständig sein,
aber nicht *falsch* in der Behauptung, etwas sei durchgesetzt.

**Generat-Schutz, fünf Schichten** — eine allein reicht nicht:
Header-Kommentar · `.gitattributes` (`linguist-generated`, `merge=ours`) · CI-Gate
(`git diff --exit-code` nach Neugenerierung) · Pre-commit-Hook · **`read-only="true"` auf
`tlTokens` mit Guards in den drei `*ThemeVariableHandler`-Klassen**. Der letzte Punkt wird garantiert
vergessen: ohne ihn ersetzt der erste Klick in der Theme-Verwaltung die generierte Datei durch
`ConfigurationWriter`-Output — Kommentare weg, Header weg, nächster CI-Lauf rot ohne erkennbare
Ursache.

### Arbeitspaket 13 — Figma-Sync (6 PT)

Über die **Plugin-API**, nicht REST. Export nach DTCG als PR ins Gitea-Repo — entweder über
`use_figma` (agentengetrieben) oder ein Community-Plugin („Token to Code", „Tokens Brücke").

Dreifacher Namensschutz: Allowlist-Vergleich (*in Figma, nicht in Git* → **Job schlägt fehl**,
kein PR: „Tokens werden im Git angelegt, nicht in Figma"), Strukturvergleich (Collection, Mode,
`resolvedType`), Figma-seitige Prävention (Leserechte + Code-Syntax im Inspector).

Nur **Wertänderungen** erzeugen einen PR, mit Tabelle „Token | alt | neu | Δ Kontrast | betroffene
Komponenten". Merge ist der einzige Weg, wie Figma-Werte in Produktion kommen.

**Rundungsregel festschreiben:** Figma-RGBA sind Floats 0..1. Ohne fixierte Rundung erzeugt der
Job Rausch-PRs und wird nach zwei Wochen ignoriert.

### Aufwand Stufe 1

| Block | PT |
|---|---|
| AP 0–3 Blocker, Inventur, Drift, `css="false"` | 9 |
| AP 4–6 Token-Modul, `expr`-Migration, Markenblau, Palette | 20 |
| AP 7–9 Dark Mode, Dichte | 16 |
| AP 10 Enforcement-Grundgerüst | 5 |
| AP 11–13 Figma, Kundenpaket, Sync | 17 |
| **Engineering gesamt** | **~67 PT** |
| Design (Markenblau, Palette, Dark-Mapping, Specimen) | 12–17 PT |

Kritischer Pfad: **AP 0 → 2 → 3 → 4 → 5.** Ohne das Golden File aus AP 5 sind AP 6–9 nicht
überprüfbar. AP 2 ist unabhängig und hat den höchsten Nutzen pro Aufwand — zuerst ausliefern.
AP 6a (Markenblau) und AP 11 (Figma) laufen parallel; AP 6a blockiert nur AP 6, AP 11 braucht
den fileKey.

**Das Gerüst wartet nicht auf die Marke.** AP 0–5 und 7–13 sind vollständig wertneutral: der
Markenanker ist ein einziges Token. Wird er spät entschieden, kostet das genau einen Generatorlauf.

---

## Spätere Stufen (Skizze, nach Neubewertung)

**Stufe 2 — Primitives, Storybook und Leitkomponenten.** `Box`/`Text`/`Icon`/`Pressable`/`Overlay`,
`defineState`, `components.json` + `check:variants`, Migration von `TLButton` (behebt den
`--iconOnly`-Bug als Beweis, dass das System trägt) und den acht Overlay-Komponenten (schließt alle
a11y-Lücken auf einmal).

Dazu **zwei Schaufenster mit getrennten Aufgaben**, beide aus `components.json` generiert, damit
sie nicht auseinanderlaufen:

| | Storybook | Demo-Gallery |
|---|---|---|
| Zweck | Dokumentation, Schaufenster, Onboarding | Prüfung des Java↔React-Vertrags |
| State | gemockte Bridge (`defineState`-Schema erzeugt den Mock) | echter SSE-State aus `ReactControl` |
| Zugang | statische Site, publizierbar für Designer, Partner, Kunden | nur mit laufender TopLogic-Instanz |
| Prüft | Rendering, Varianten, a11y (Addon), visuelle Regression | dass der Server liefert, was die Komponente erwartet |
| Figma | Ziel für Code Connect (Docs-Link je Komponente) | — |

Bewusst erst in Stufe 2: Ein Storybook über die heutigen BEM-Komponenten wäre die Dokumentation
eines Zustands, den wir gerade abschaffen. Es dokumentiert das neue System oder es entsteht nicht.

Der Mock ist kein Zugeständnis, sondern fällt ab: `defineState` ist ein Laufzeit-Schema-Objekt, aus
dem sich Default-States mechanisch erzeugen lassen. Eine Story ohne passendes Schema kann damit gar
nicht existieren — dieselbe Durchsetzungslogik wie bei den Lint-Regeln.

**Stufe 3 — Komponenten-Migration in Wellen.** Atome → Layout → Overlays → Formulare → Navigation →
Rest → Hotspots (`TLDropdownSelect` 680, `TLTableView` 581 + `Table.*`-Primitives). Eine PR pro
Datei, nie eine Welle in einem Commit. Dateien mit offenem TL-Views-Ticket werden zurückgestellt,
nicht koordiniert — warten ist billiger als ein Merge-Konflikt in 680 LOC.

**Stufe 4 — Figma-Komponenten und Code Connect.** Wellen analog. Varianten-Schnitte: `TLButton`
von 90 auf 24 (displayMode → zwei Booleans, `disabled` in die State-Achse, `active` gar nicht
gebaut), `TLFormField` von 128 auf 6 (`error`/`warning` gehören in *eine* Achse, nicht in zwei
Booleans). Code Connect realistisch: Variable Code Syntax (80 % des Nutzens, sofort), Simple
Mapping, plus ein zweites Mapping mit `label: "Markdown"` auf eine generierte Varianten-Tabelle
Figma ↔ CSS-Modifier ↔ Java-Enum. Ein Template-Mapping wäre **aktiv irreführend** — es zeigte
Props, die es nicht gibt.

**Stufe 5 — Java-Rückrichtung.** `npm run generate:java-state` erzeugt aus den `*.state.ts`
typisierte Setter nach `target/generated-sources`. Ab da kompiliert ein Java-Tippfehler nicht mehr.

---

## Verifikation

**Golden File als Rückgrat.** `TestThemeCssSnapshot` hält den `:root`-Block pro Theme. Jede
Änderung an Tokens ist damit ein lesbarer Diff, keine Vertrauenssache.

**Computed-Style-Snapshot statt primärem Pixelvergleich.** Playwright liest ~20 berechnete
Eigenschaften pro Komponente und schreibt sie als sortiertes JSON. Deterministisch (kein
Font-Rendering, kein Antialiasing), und der Diff ist im PR lesbar: `padding-left: 16px → 12px` sagt
sofort, was passiert ist. Ein Pixel-Diff sagt „0,4 % anders".

**Pixelvergleich als Gate**, Light und Dark, Schwelle 0,2 %. Determinismus erzwingen: Inter
self-hosted (`importGoogleFonts.css` lädt übers Netz — im CI nicht reproduzierbar),
`await document.fonts.ready`, alle 12 `@keyframes` stilllegen, Caret ausblenden,
`prefers-color-scheme` per Playwright emulieren.

**Zwei Modi, im PR explizit:** *Strukturmigration* erwartet keine visuelle Änderung (Diff ≤ 0,2 %
→ grün). *Token-Korrektur* erwartet eine — PR trägt Label `visual-change`, enthält das
Vorher/Nachher-Bildpaar, aktualisiert die Baseline im selben Commit, DS-Owner gibt frei.
**Baselines werden nie stillschweigend aktualisiert** — das ist die einzige Regel, die verhindert,
dass die Suite nach drei Monaten bedeutungslos wird.

Das ist besonders wichtig, weil die Carbon-Fallbacks heute *sichtbar* sind: Nach AP 2 rendert
TopLogic-Blau statt Carbon-Blau. Ein Pixelvergleich würde das als Fehler melden — es ist aber der
Zweck der Übung.

**Gallery-Layout als Voraussetzung.** Es gibt keinen Ort, an dem eine Komponente isoliert sichtbar
ist. `designSystemGallery.layout.xml` in `com.top_logic.demo`, generiert aus `components.json`,
gebaut aus echten `ReactControl`-Instanzen mit echtem SSE-State. Das testet mehr als Storybook —
nämlich auch den Java-seitigen Vertrag. Ein Storybook mit Fake-Props hätte den `--iconOnly`-Bug
ebenfalls nicht gefunden.

**Manuelle Verifikation** gemäß `CLAUDE.md` (Demo-App, `root`/`root1234`, Playwright) bleibt
Pflicht und wird durch die Gallery *beschleunigt*, nicht ersetzt.

---

## Risiken

| # | Risiko | Mitigation |
|---|---|---|
| R1 | **Deploy-Modus generiert kein Theme-CSS** — kippt die Kernanforderung „Theming ohne Rebuild" | AP 0, zuerst. Fix: generieren, wenn Zieldatei fehlt (~10 Zeilen) |
| R2 | Fehlendes Golden File macht AP 6–9 unüberprüfbar | AP 5 vor jeder Wertänderung |
| R3 | `localName`-Kollisionen — `CSSBuffer` überschreibt heute still, Symptom „Farbe stimmt manchmal nicht" | AP 3 vorziehen, Startabbruch |
| R4 | **Theme-Editor zerstört generierte Dateien** durch einen einzigen UI-Klick | `read-only`-Guards, AP 12 |
| R5 | `ThemeSetting.copy()` teilt Instanzen → mit Dark-Expressions falsch aufgelöste Werte. Leicht zu übersehen, schwer zu debuggen | expliziter Fix + Test in AP 7 |
| R6 | `light-dark()` in Alt-Browsern verwirft die ganze Deklaration → unbedienbare UI ohne Degradieren | `@supports`-Doppelblock; Browser-Matrix in AP 0 |
| R7 | Ungelayertes CSS aus `themes.core` schlägt gelayerte Utilities | Bestandsaufnahme in AP 0, betroffene Regeln in `tl.legacy` |
| R8 | Serverseitige Farben kennen kein Dark (Charts, Gantt, Passwortbalken) | bewusste, dokumentierte Lücke — sonst entsteht eine uneinlösbare Kundenerwartung |
| R9 | Bestehende Kunden-Themes überschreiben Semantics und bekommen **keinen** Dark-Wert | Validator-Warnung + Migrationsanleitung „überschreibe Primitives" |
| R10 | Figma Pro: kein Branching, max. 4 Modes, keine REST-Variables-API | Plugin-API-Sync; Sandbox + Gitea-Issues statt Branching; Collection-Schnitt mit Reserve. Skaliert schlecht über ~3 Designer — dann Enterprise evaluieren |
| R11 | Rundungsrauschen im Figma-Pull erzeugt tägliche Rausch-PRs | Rundungsregel festschreiben, Diff auf gerundeten Werten |
| R12 | Zwei Zustandsschreibweisen (`button-primary-hover` vs. `background-danger--hover`) bleiben | Rename wäre Breaking Change. Mitigation ist die generierte TS-Union + stylelint-Allowlist — deshalb nicht optional |
| R13 | oxlint-Plugin-API jung | Version pinnen, Rules in ESLint-Shape, Spike in AP 0 |
| R14 | Node-Download im Offline-Build | `nodeDownloadRoot` auf internen Mirror (Problem besteht heute schon in `layout.react`) |
| R15 | Konflikt mit laufender TL-Views-Entwicklung | Stufe 1 ist fast vollständig additiv. Die Migration darf nie auf dem kritischen Pfad eines Views-Releases liegen |

---

## Kritische Dateien

**Java-Kern**
- `com.top_logic/src/main/java/com/top_logic/gui/config/ThemeSetting.java` — `dark`/`dark-expr`, `css`-Flag, schema-parametrisiertes `expand()`, `copy()`-Fix, `getCssValue()`
- `com.top_logic/src/main/java/com/top_logic/gui/CSSBuffer.java` — `light-dark()`, `color-scheme`, `@supports`, `localName`-Kollisionsprüfung
- `com.top_logic/src/main/java/com/top_logic/gui/Theme.java:237` — Deploy-Modus-Lücke (R1), Overlay-Laden, Stylesheet-Erzeugung
- `com.top_logic/src/main/java/com/top_logic/mig/html/layout/MainLayout.java:1020` — `color-scheme` auf `<html>`
- `com.top_logic.layout.themeedit/.../providers/{Create,Update,Delete}ThemeVariableHandler.java` — `read-only`-Guards

**Tokens und Themes**
- `com.top_logic.themes.core/src/main/webapp/WEB-INF/themes/core/theme-settings.xml` — Quelle der Migration, wird auf Icons + Legacy reduziert
- `com.top_logic.themes.core/.../themes/{coreCondensed,coreSidebarCondensed}/theme-settings.xml` — 220 Zeilen Duplikat
- `com.top_logic.themes.core/src/main/webapp/style/coreCondensed.css` — hartcodierte Maße, wird tokenisiert und gelöscht

**React**
- `com.top_logic.layout.react/src/main/webapp/style/tlReactControls.css` — 4.273 Zeilen, 177 Fallbacks, `@layer`-Wrapper
- `com.top_logic.layout.react/pom.xml` — `frontend-maven-plugin`-Executions; das einzige Tor zu CI-Rot
- `com.top_logic.layout.react/react-src/bridge/tl-react-bridge.ts` — `useTLState` mit Schema-Überladung
- `com.top_logic.layout.react/react-src/controls/TLButton.tsx` — Referenzfall: Konkatenation, `as string`, `--iconOnly`-Bug
- `com.top_logic.layout.react/src/main/java/com/top_logic/layout/react/control/button/` — `ButtonAppearance`, `ButtonSize`, `ButtonDisplayMode`

**Neu**
- Gitea `TopLogic/tl-design-system` — DTCG-Quellen, Generator, Figma-Inventar, Lint-Plugins
- `tl-archetype-app/src/main/resources/archetype-resources/src/main/webapp/WEB-INF/themes/` — fehlt heute

**Figma**
- Library „Component library - TL Design System" (`lk-5545b55f…0669`) — Basis für `Theme` und `Spacing`; **fileKey fehlt, ist Voraussetzung**
- Datei `r0LCAH2pa4nxcUU2JNkBZu` — Alt-Werte für den Gap-Report, danach archivieren
