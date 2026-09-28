# UI-Paket — Stufe C mit fremder Komponentenbibliothek

**Stand:** 2026-09-25 · Ticket #29617
**Fortgeschrieben 28.09.:** abgestimmt auf #29643/!1698; Begründung `docs/skalen.md` ‚Ein Vertrag, zwei Hälften‘
**Baut auf:** [`2026-09-17-design-system-neuaufbau-design.md`](2026-09-17-design-system-neuaufbau-design.md) §3 Stufe C,
`docs/skalen.md` „Zwei Wege, kein dritter“, „Themes: eine dritte Achse“, „Ein Vertrag, zwei Hälften“

---

## 1 · Ziel und Abgrenzung

Ein Kunde bringt eine eigene React-Komponentenbibliothek mit — der Anlass ist Mercedes-Benz mit
MBUI auf Material-Basis — und will sie in TopLogic 8 betreiben, mit Layouts, Formularen, Dialogen,
Rechten und Skript-Tests vom Server. Das ist der **Shell-Weg**. Diese Spec macht ihn gangbar: Sie
legt fest, was der Kunde liefert, was die Engine dafür können muss, was TopLogic garantiert, und
womit der Kunde vor jedem Framework-Update prüft, dass es noch läuft.

**Nicht Ziel:** der Headless-Weg (eigenes Frontend über REST/OpenAPI). Er ist die Grenze dieser
Spec, nicht ihr Gegenstand: Wer den Draht nicht will, geht dorthin, und die API ist sein Vertrag.
Ebenfalls nicht Ziel: ein Schalter, der das UI-System abschaltet. Warum nicht, steht in
`docs/skalen.md`; kurz: Er schaltet die falsche Schicht ab, ist erst bei 77 von 77 ersetzten Controls
wahr und lässt keinen Zustand übrig, den TopLogic garantieren könnte.

## 2 · Begriffe

| Begriff | Bedeutung |
|---|---|
| **Shell** | TopLogic treibt die Oberfläche: Der Server schickt je Control `{ module, state }`, der Client rendert und schickt Kommandos zurück. Welche Komponente rendert, entscheidet die Registry: eine mit `replace()` ersetzte vor der mit `register()` registrierten. |
| **Headless** | Der Kunde treibt die Oberfläche selbst und liest und schreibt Daten über REST/OpenAPI. Kein Control-Protokoll, kein Vertrag je Komponente. |
| **Draht** | Der Teil des Control-Protokolls, den jede Komponente unter einem TopLogic-Namen einhalten muss: welcher Zustand kommt (`useTLState`, beschrieben durch die Nachricht in `state.proto`), welche Kommandos zurückgehen (`useTLCommand`), und für Overlays der Stapel der Bridge (Fokusfalle, Dialog-Manager, Generationszähler). |
| **Muss / Kann** | Die zwei Hälften eines Vertrags. Muss ist der Draht: der Zustand als Verweis auf `state.proto`, die Aktionen und der Stapel als Konformitätsfälle. Kann ist, was eine Komponente ins Bild und in die Werkzeuge einpasst: Tokens, Attribute für Tastatur und Fokus, Attribute für die Skript-Aufzeichnung. |
| **`state.proto`** | Der Zustandsvertrag aus #29643/!1698: je ersetzbarer Komponente eine msgbuf-Nachricht (`ButtonState` für `TLButton` …), aus der Java-Konstanten und TypeScript-Typen (`control-state.ts`, exportiert aus `tl-react-bridge`) erzeugt werden. `TestControlStateSchema` prüft, dass der Server nur Deklariertes sendet. |
| **UI-Paket** | Ein Kundenmodul, das Skripte und Stylesheets als `ClientResources` beiträgt, Komponenten unter TopLogic-Namen mit `replace()` ersetzt, Provider seiner Bibliothek mit `registerRootWrapper()` einhängt und benannte TopLogic-Ressourcen ersetzt oder entfernt. |

## 3 · Architektur

### 3a · Das Kundenmodul

Ein Maven-Modul des Kunden, wie jedes andere TopLogic-Modul, mit einer `config.xml`, die den
`ClientResources` beiträgt:

```xml
<module-script name="mbui-controls"
    resource="/script/mbui-controls.js"
    requires="tl-react-bridge"/>
<stylesheet name="mbui-styles"
    resource="/style/mbui.css"
    requires="tl-design-system-tokens"/>
```

Das Kundenbundle ruft beim Laden für jede ersetzte Komponente `replace('TLButton', MBButton)` und für
die Provider seiner Bibliothek (Theme, Intl, CSS-in-JS-Cache) `registerRootWrapper(MBProvider)`
(`bridge/registry.ts`, `bridge/root-wrapper.ts`, beide aus !1698). `replace` gewinnt gegen jedes
`register` desselben Namens, **unabhängig von der Reihenfolge**, in der die Skripte laden; ein zweites
`replace` desselben Namens meldet eine Warnung. Die Spec stützte sich am 25.09. auf „letzter `register`
gewinnt“ plus `requires`-Reihenfolge — das ist fragil und entfällt. `requires="tl-react-bridge"` sichert
nur, dass die Bridge da ist. Ein Wurzel-Wrapper liegt über jeder React-Wurzel der Bridge; über `TLChild`
geschachtelte Controls und Portale erben seinen Kontext. Was der Kunde nicht ersetzt, bleibt TopLogic.
Die Anleitung dazu ist Bernhards Leitfaden `docs/faq/customer-component-library.md` im Framework, das
laufende Beispiel `com.top_logic.demo.react.corporate` (Maven-Profil `corporate-example`).

Das Bundle des Kunden importiert React aus `tl-react-bridge` (externalisiert, dieselbe Instanz wie
alles andere) und bündelt seine Bibliothek — bei Material: MUI und Emotion — selbst. Ein zweites
React im Bundle bricht Hooks zur Laufzeit; !1618 hat das gezeigt und beseitigt. Das ist eine
Alias-Zeile in der Vite-Konfiguration des Kunden und steht in der Anleitung.

### 3b · Ressourcen-Override

Wer `TLButton` ersetzt, will `button.css` nicht mehr laden; wer alle Blätter ersetzt, will
`components.css` nicht mehr laden. Das Kundenmodul entfernt oder ersetzt dafür **benannte**
Einträge unserer Ressourcenliste:

```xml
<stylesheet name="tl-design-system-components" config:operation="remove"/>
```

`tokens.css` und `base.css` bleiben, solange irgendein TopLogic-Control im Baum steht — und das ist
der Normalfall, weil Container (Grid, Stack, Deck, Dialog-Manager, Sidebar) zu den 77 Controls
gehören und niemand sie am ersten Tag ersetzt. Stufe C steht damit auf Stufe A oder B: Was der Kunde
nicht ersetzt, sieht über seine Tokens trotzdem nach ihm aus.

**Befund in der Engine (25.09., `~/git/tl8-wt-29584`):** TypedConfiguration kennt für Listen die
Operationen `addOrUpdate` (Default), `add`, `update`, `remove` über das Attribut
`config:operation` (`ListOperation`, `ConfigurationReader.readListEntry`); das Framework nutzt es
selbst (`top-logic.no-cluster.config.xml`: `<component name="cluster" config:operation="remove"/>`).
Voraussetzung ist ein Schlüssel-Property der Liste, das nur `@Key` setzt. `ClientResources.Config.getResources()`
ist `List<ResourceConfig>` **ohne** `@Key`; `ResourceConfig` erbt zwar `name` aus
`NamedConfigMandatory`, aber ohne die Annotation gibt es keinen Schlüssel, und `update`/`remove`
laufen ins Leere. **Braucht Änderung:** `@Key(NamedConfiguration.NAME_ATTRIBUTE)` an
`getResources()`, wie es `UIThemeService.Config.getThemes()` schon trägt. Ein Test im Framework
prüft danach, dass ein zweites Konfigurationsfragment `tl-design-system-components` entfernt und
`tl-react-controls` behält, und dass die topologische Ordnung (`requires`) mit dem Rest weiter
aufgeht. Ein `requires` auf einen entfernten Eintrag ist ein Konfigurationsfehler, kein stilles Weglassen.

### 3c · Theme benennt UI-Paket

`UIThemeService` führt Themes je Anwendung (`Map<String, UITheme.Config>`, `@Key name`), speichert
die Wahl je Person und setzt das Attribut am `html`. Zwei Ergänzungen: Ein Ressourceneintrag
(`ResourceConfig`) bekommt ein optionales Attribut `package="<id>"`; ein Theme bekommt ein
optionales Feld `ui-package="<id>"`. Ressourcen ohne `package` werden immer geladen, wie heute.
Ressourcen mit `package` werden nur geladen, wenn das aktive Theme dieses Paket nennt. Wählt eine
Person ein Theme mit Paket, lädt die Seite neu; ohne Feld gilt die Liste wie konfiguriert. Ein Kunde,
der sein Paket fest will, lässt `package` einfach weg (§3a).

**Korrektur (25.09.):** `config:operation="remove"` aus §3b wirkt beim Lesen der Konfiguration, einmal
für die Anwendung, und kann deshalb **nicht** vom Theme abhängen. Je Theme filtert nur das Attribut
`package=` am Eintrag. Wer unsere Komponenten-Styles nur unter dem Kundenpaket ausblenden will,
ersetzt unseren Eintrag per `config:operation="update"` und gibt ihm `package="default"`; das
Default-Theme nennt `ui-package="default"`. Dann lädt `components.css` unter TopLogic und nicht unter
„mbui“. Wer es immer ausblenden will, nimmt `remove` wie in §3b.

Damit lässt sich während einer Migration zwischen TopLogic und Kundenpaket wechseln, ohne dass „aus“
je ein Zustand ist: Es gibt immer ein Paket, das rendert. `data-tl-theme` bleibt die dritte Achse
neben Modus und Dichte; das Paket hängt am Theme, nicht umgekehrt. Ein Reload beim Wechsel ist
Absicht: Die Registry kennt kein Abmelden (auch `replace` nicht), und zwei Bundles nebeneinander wären
genau der Mischzustand, den die Entscheidung ausschließt.

Dieser Schritt ist der letzte der Reihenfolge (§7) und optional für Mercedes: Ein Kunde mit einem
Paket konfiguriert es fest nach §3a und §3b und braucht §3c nicht.

## 4 · Verträge

Je Komponente eine Datei `<name>.contract.md` neben ihrem CSS im Paket
(`design-system/src/components/<name>/`). Die fünf bestehenden (Button, Pill, Avatar, Progress,
Icon) tragen heute die Abschnitte Zustand, Aktionen, Tokens, Attribute, Konformität gleichrangig.
Ab jetzt sind sie geteilt:

```
## Muss
### Zustand      — Verweis auf die Nachricht in state.proto, keine eigene Schlüsseltabelle
### Aktionen     — Auslöser → `sendCommand(...)`; was `false` zurückgeben muss
### Stapel       — nur Overlays: Fokusfalle, Dialog-Manager, `ANCHORED_OVERLAY_ATTR`, Generationszähler
## Kann
### Tokens       — welche Rollen die Komponente liest, damit sie ins Bild passt
### Attribute    — Tastatur und Fokus: `disabled`, `aria-pressed`, `:focus-visible`, `data-tl-state`
### Aufzeichnung — Attribute, die `ReactOptionByLabelNaming` und `ModelResolver` lesen
## Konformität   — genau ein JSON-Block mit den Fällen, die der Harness prüft
```

**Der Zustand ist Proto.** `### Zustand` nennt genau eine Nachricht, etwa „`ButtonState` in
`state.proto`, TypeScript `ButtonState` aus `tl-react-bridge`“, und im Fließtext die Schlüssel, die die
Konformitätsfälle setzen. Typ, Bedeutung und Vorgabe jedes Schlüssels stehen an der Nachricht, nicht
im Vertrag: Zwei Beschreibungen desselben Drahts driften, und Proto ist die, die der Build prüft. Was
Proto nicht sagen kann, trägt der Vertrag: welche Kommandos ein Auslöser sendet und was bei `hidden`
oder `editable: false` schweigen muss (als Fälle, vom Harness ausgeführt), welche Rollen eine
Ersatzkomponente liest, welche Attribute Tastatur, Fokus und Aufzeichnung brauchen.

**Geplante Nachrichten.** Sechs Verträge der Liste unten haben ihre Nachricht in `state.proto` noch
nicht: `TextState` (Pill), `AvatarState`, `ProgressState`, `IconState`, `BooleanChoiceState`,
`SliderState`. Vorlage sind die Zustands-Drafts in Bernhards Review 38871 zu !1698 (für `IconState`
gibt es keinen). Bis sie landen, nennt `### Zustand` die geplante Nachricht, und der Test führt sie in
einer Liste, die schrumpft und nicht wächst (Ratsche): Landet eine Nachricht, wird sie gestrichen; ein
neuer Vertrag braucht eine Nachricht, die es gibt. Wo ein Draft hinter dem Paket liegt, folgt die
Nachricht dem Paket — `TextState.color` wird `colorRole`, wie !1694 es festgelegt hat.

**Größen: zwei Namensräume** (entschieden 28.09.). Extern — XML `size="…"`, Java-Enum `@Name` und damit
die Proto-Nachricht — stehen ganze Wörter: `AvatarState.Size` `small | medium | large | x-large`,
`IconState.Size` `small | medium | large | glyph`. `medium` ist der Name der mittleren Stufe; „default“
ist kein Name (Bernhards Draft nennt `default`, wir schlagen `medium` vor). Im Paket bleiben die
Skalenkürzel: `tl-avatar--sm/lg/xl`, `tl-icon-sm/md/lg/glyph`; das TSX bildet ab (`x-large → xl`). Ein
Konformitätsfall sendet den externen Namen und erwartet die Paketklasse. Für `IconState` gibt es
keinen Draft; der Plan trägt einen Vorschlag (`size`, `image`), als Vorschlag markiert.

Der Test `components.test.mjs` prüft heute die alten Überschriften; er wird mit der Umstellung auf
`## Muss`, `## Kann`, die sechs `###` und `## Konformität` geändert. Die Token-Prüfung (jedes
`var(--tl-…)` im CSS steht im Vertrag) bleibt und zieht in den Kann-Teil.

**Was TopLogic garantiert:** die Bridge (Registry mit `replace`, Wurzel-Wrapper, Kommandokanal, SSE,
Fokusfalle, Stapel) und dass der Zustand so kommt, wie die Nachricht in `state.proto` sagt —
`TestControlStateSchema` prüft den Server, der Harness die Kundenseite. Ändert sich ein Schlüssel,
ändert sich die Nachricht, `control-state.ts` wird neu erzeugt, und der Harness des Kunden schlägt an.
Nicht garantiert: Aussehen, und die Aufzeichnung ohne die Kann-Attribute.

**Verträge für die MBUI-Schnittmenge**, abgeleitet aus `controls-entry.ts` (Namen geprüft): die
Blätter, die eine Material-Bibliothek typisch mitbringt.

| TopLogic-Name | Material-Gegenstück | Nachricht in `state.proto` | Vertrag |
|---|---|---|---|
| `TLButton` | Button, IconButton | `ButtonState` | vorhanden, wird umgestellt |
| `TLToggleButton` | ToggleButton | `ToggleButtonState` | neu |
| `TLTextInput`, `TLPasswordInput`, `TLNumberInput` | TextField | `TextInputState`, `PasswordInputState`, `NumberInputState` | neu, ein Vertrag je Control |
| `TLSelect`, `TLDropdownSelect` | Select, Autocomplete | `SelectState`, `DropdownSelectState` | neu |
| `TLCheckbox`, `TLBooleanChoice` | Checkbox, Switch, RadioGroup | `CheckboxState`, `BooleanChoiceState` (geplant) | neu |
| `TLDatePicker` | DatePicker | `DatePickerState` | neu |
| `TLSlider` | Slider | `SliderState` (geplant) | neu |
| `TLOptionChips`, `TLSegmentedChoice` | Chip, ToggleButtonGroup | `DropdownSelectState` | neu |
| `TLTabBar` | Tabs | `TabBarState` | neu |
| `TLDialog` | Dialog | `DialogState` | neu, mit Stapel (Tastatur-Scope; die Fokusfalle liegt in `TLWindow`) |
| `TLSnackbar` | Snackbar | `SnackbarState` | neu, mit Stapel (Generationszähler, keine Fokusfalle) |
| `TLText` (Pill) | Chip | `TextState` (geplant) | vorhanden als `pill.contract.md`, wird umgestellt |
| `TLAvatar` | Avatar | `AvatarState` (geplant) | vorhanden, wird umgestellt |
| `TLProgress` | LinearProgress, CircularProgress | `ProgressState` (geplant) | vorhanden, wird umgestellt |
| `TLIcon` | Icon | `IconState` (geplant, ohne Draft) | vorhanden, wird umgestellt |

**Korrekturen (25.09.):** Die Fokusfalle gehört nicht `TLDialog`, sondern der Fensterhülle `TLWindow`
(`useFocusTrap`), die als Kind des Dialogs kommt; der Dialog-Vertrag verlangt sie nur von einer
Komponente, die Hülle und Fenster in einem zeichnet. `TLSnackbar` ist keine modale Fläche und hat
keine Fokusfalle; ihr Stapel ist der Generationszähler: `dismiss` trägt die `generation`, damit der
Server eine schon ersetzte Meldung nicht schließt. Felder kennen kein `disabled` — der Server sendet
für ein Feld `editable: false`; ein Vertrag prüft das Schweigen eines Felds daran.

Container (`TLGrid`, `TLStack`, `TLDeckPane`, `TLDialogManager`, `TLSidebar`, `TLAppShell`,
`TLSplitPanel`, `TLPanel`, `TLFormLayout` …), Tabelle und Baum bleiben TopLogic und bekommen in
dieser Spec keinen Vertrag. Wer sie ersetzen will, stellt den Antrag mit dem konkreten Fall; das
Format ist dann dasselbe. `TLWindow` und `TLMenu` haben eine Nachricht in `state.proto`, aber in
dieser Spec keinen Vertrag.

Neue Komponenten aus #29650 Richtung 1 (Accordion, Alert, Badge, Divider, Skeleton, Radio) entstehen
zuerst im Paket — CSS, Vertrag, Specimen —, dann als Control mit ihrer Nachricht in `state.proto`;
sonst wachsen sie als Blöcke in `tlReactControls.css`, und die Ratsche hält sie.

## 5 · Konformitätstest-Harness

Der Harness liegt im Framework bei der Bridge (`com.top_logic.layout.react/react-src/test/`), nicht
im Paket: Er muss `useTLState` und `useTLCommand` stubben und die Registry befragen, und das sind
Bridge-Interna. Das Paket bleibt ohne Abhängigkeiten.

**Befund (25.09.):** `react-src` hat heute keine Test-Infrastruktur — `package.json` kennt nur
`build` und `dev` über Vite, keine Testdateien, kein Vitest, kein Jest. Der Harness bringt als
devDependencies Vitest, `@testing-library/react`, `@testing-library/user-event` und jsdom mit; Vitest,
weil Vite schon da ist und dieselbe Konfiguration liest. **Das Muster steht in !1705:**
`com.top_logic.demo.react.corporate/vitest.config.ts` löst `tl-react-bridge` auf die Quelle auf und
`react`/`react-dom` auf `node_modules` des Moduls (eine React-Instanz), `react-src/test-setup.ts`
trennt die Dokument-Observer der Bridge vor dem jsdom-Teardown, und `BrandButtonAdapter.test.tsx`
mountet eine Komponente im `TLControlContext` mit gestubbtem `fetch` und liest die gesendeten
Kommandos. Der Harness übernimmt das für `com.top_logic.layout.react` und macht aus dem einen Fall
einen Lauf über alle Verträge.

Was er tut, je Vertrag:

1. Liest `<name>.contract.md` (Kopie aus dem Paket in `react-src/contracts/`): aus `### Zustand` den
   Namen der Nachricht, aus `## Konformität` den JSON-Block mit den Fällen. Einen Beispielzustand aus
   einer Tabelle baut er nicht — jeder Fall bringt seinen Zustand mit.
2. Liest das Schema aus `react-src/state/control-state.ts`, den exportierten Interfaces, die msgbuf aus
   `state.proto` erzeugt, samt `extends`-Kette. Jeder Schlüssel eines Falls muss in der Nachricht
   deklariert sein; ein undeklarierter (`disabled` an einem Feld) ist ein Fehler. Eine geplante
   Nachricht (§4) fehlt dort noch: Die Fälle laufen, die Schlüssel bleiben ungeprüft, der Harness sagt es.
3. Holt die unter dem TopLogic-Namen registrierte Komponente aus der Registry — die mit `replace()`
   ersetzte des Kunden oder unsere.
4. Mountet sie wie die Bridge (Wurzel-Wrapper, `TLControlContext`, Tastatur-Scope), stubbt `fetch`,
   löst den Auslöser des Falls aus (Klick, Enter, Leertaste, Escape, Tastengeste, Eingabe, Auswahl)
   und prüft, dass genau das genannte Kommando mit den genannten Argumenten ankommt — und dass bei
   `hidden`, `editable: false` oder `disabled` (wo die Nachricht es kennt) nichts ankommt.
5. Für Overlays: prüft den Stapel des Falls (Fokusfalle registriert oder nicht; `generation` im
   Kommando).
6. Optional (`TL_CONFORMANCE_KANN=1`): prüft die Klassen aus dem Kann-Teil am gerenderten DOM.

Unsere eigenen Controls bestehen den Harness zuerst; das ist die Bedingung, bevor ein Vertrag als
geschrieben gilt. `TestControlStateSchema` bleibt Bernhards Gate für den Server; der Harness ist die
Hälfte auf der Kundenseite. Für den Kunden ist er ein npm-Skript (`npm run conformance -- --bundle
dist/mbui-controls.js`), das er vor jedem Deploy und nach jedem Framework-Update laufen lässt. Er ist
sein Werkzeug, nicht unser Gate: Ein roter Harness beim Kunden bricht keinen TopLogic-Build.

## 6 · Referenzprojekt: #29661 im Framework; im Paket `roles-to-mui.mjs`

**Das Referenzprojekt lebt im Framework.** Das MUI-Adaptermodul ist Trac #29661: ein Modul neben
`com.top_logic.demo.react.corporate`, auf `replace()` und `registerRootWrapper()`, im Maven-Build und
in der echten Demo lauffähig. Ein zweites Referenzprojekt im Design-System-Repo (`examples/mui-adapter/`,
Stand 25.09.) entfällt: dieselbe Sache zweimal, und außerhalb des Builds die schwächere.

**Im Paket bleibt `design-system/tools/roles-to-mui.mjs`,** weil es aus dem Erzeugnis des Pakets
rechnet. MUI rechnet `contrastText` und Hover-Töne selbst aus Hexwerten und kann mit `var(--tl-…)`
nichts anfangen; das Werkzeug löst die Rollen deshalb zur Bauzeit als Werte je Modus auf
(`{ light, dark }`, aus `primitives.css` und `tokens.css`). `dist/` ist vollständig erzeugt und wird
vom Byte-Identitäts-Test gehalten: Für das TopLogic-Theme ruft `generate.mjs` den Schreiber aus
`roles-to-mui.mjs` und erzeugt `dist/roles.generated.json` wie jede andere Datei in `dist/`. Für ein
Kundentheme aus `derive` schreibt `node tools/roles-to-mui.mjs <theme>.theme.css [<ausgabe>.json]` die
Datei **neben** die Theme-Datei (Default `<theme>.roles.json`), nie nach `dist/`. Ein Werkzeug des
Pakets wie `derive`: kein npm, keine Abhängigkeit, Test in `design-system/test/`, Erzeugnis nie von
Hand geändert.

**Die Theme-Richtung ist fest:** Hausfarbe und Grauwahl → `derive` → Rollen → `roles-to-mui.mjs`
(Hex je Modus) → `createTheme`. Nie umgekehrt: Ein MUI-Theme als Quelle der TL-Tokens (#29662) hebelt
Paarliste, Kontrast-Gate und gerechnete Beschriftungen aus, weil MUI `contrastText` selbst rechnet
und niemand es prüft.

Die Abbildung, die #29661 für `createTheme` übernimmt:

| MUI | Rolle |
|---|---|
| `palette.primary.main`, `.light`, `.dark`, `.contrastText` | `surface-brand`, `surface-brand-hover`, `surface-brand-active`, `text-on-brand` |
| `palette.error`/`warning`/`success`/`info` `.main`, `.contrastText` | `status-*-surface`, `text-on-status-*` |
| `palette.background.default`, `.paper` | `surface-base`, `surface-layer` |
| `palette.text.primary`, `.secondary`, `.disabled` | `text-primary`, `text-secondary`, `text-disabled` |
| `palette.divider` | `border-separator` |
| `shape.borderRadius`, `typography.fontFamily` | `radius-sm`, `font-family-sans` |

Zwei Themes, hell und dunkel, umgeschaltet nach `data-tl-mode` am `html`; ein Dialog, der per Portal an
`body` rendert, liegt unter `html` und folgt dem Modus. Der Theme-Provider hängt als Wurzel-Wrapper
über jeder Wurzel (`registerRootWrapper`).

## 7 · Reihenfolge mit Fertig-Bedingungen

1. **Entscheidung.** Erledigt (25.09.): `docs/skalen.md` „Zwei Wege, kein dritter“, Folie 13b,
   Übersicht §2b, Spec §3 fortgeschrieben. Fortgeschrieben (28.09.): „Ein Vertrag, zwei Hälften“.
2. **Ressourcen-Override.** `@Key` an `ClientResources.Config.getResources()`. Fertig: ein Test im
   Framework entfernt `tl-design-system-components` aus einem zweiten Fragment und behält
   `tl-react-controls`; `requires` auf einen entfernten Eintrag ist ein Fehler. Branch
   `CWS/CWS_29617_design_system_ui_paket`, `tools/check-messages-en.sh` vor dem Push.
3. **Harness und Verträge.** **Voraussetzung: !1698 ist gemerged** (`state.proto`, `control-state.ts`,
   `replace`, `registerRootWrapper`); bis dahin zweigt die Arbeit von
   `CWS/CWS_29643_customer_component_library` ab. Vitest in `react-src` nach dem Muster von !1705,
   Harness nach §5, die fünf bestehenden Verträge auf Muss/Kann umgestellt, `### Zustand` als Verweis
   auf die Nachricht, `components.test.mjs` nachgezogen, dann die neuen Verträge der Tabelle in §4.
   Fertig: jeder Vertrag der Tabelle existiert, nennt eine Nachricht in `state.proto` oder eine
   geplante, und jedes unserer Controls besteht seinen.
4. **Werkzeug im Paket.** `tools/roles-to-mui.mjs` nach §6, von `generate.mjs` aufgerufen. Fertig:
   `dist/roles.generated.json` ist Teil von `dist/` und vom Byte-Identitäts-Test gehalten, ein
   `derive`-Theme ergibt `<theme>.roles.json` neben sich, `node --test` grün. Das Beispiel — Material-Button und -Dialog im TopLogic-Layout, hell und dunkel — baut
   #29661 im Framework auf diesem Erzeugnis.
5. **Theme benennt Paket.** `ui-package` an `UITheme.Config`, Reload beim Wechsel. Fertig: eine
   Person wählt „mbui“ und sieht nach dem Reload das Kundenbundle; wählt sie „default“, TopLogic.

Jeder Schritt endet committet. Schritt 2 und 5 laufen im Framework-Worktree, 3 in beiden Repos, 4 im
Design-System-Repo.

## 8 · Nicht-Ziele und Offenes

* **Headless-Reife.** Der Skill `toplogic-react-frontend` belegt, dass der Weg gegangen wurde
  (OpenAPI-Server über TL-Script, Dev-Proxy, Auth-Naht). Ob Rechte, Paging, Dateien und Ereignisse für
  eine echte Anwendung reichen, weiß nur, wer die Projekte gemacht hat. Nicht Teil dieser Spec.
* **msgbuf 1.2.3 ist die Abhängigkeit.** `state.proto` braucht das TypeScript-Ziel von msgbuf 1.2.3;
  ohne das Release baut !1698 nicht, und ohne !1698 gibt es weder `control-state.ts` für den Harness
  noch `replace`. Schritt 3 wartet darauf; Schritt 2, 4 und 5 nicht.
* **Dichte in MUI.** MUI kennt `data-tl-density` nicht; sein 8-px-Raster ist fest. Das Referenzprojekt
  (#29661) zeigt eine Dichte. Was der Kunde daraus macht, ist seins.
* **Java-Port des Harness.** Verworfen: Der Vertrag ist ein Client-Vertrag und wird im Client geprüft.
  Eine zweite Prüfung in Java wäre eine zweite Wahrheit.
* **Skript-Aufzeichnung mit fremden Komponenten.** Funktioniert nur mit den Kann-Attributen. Welche
  das je Komponente sind, steht im Vertrag; ob Mercedes sie setzt, entscheidet Mercedes.
* **Container-Verträge.** Nicht in dieser Spec (§4). Erst mit einem konkreten Fall.

## 9 · Tests

**Im Paket (`node --test` in `design-system/`):**

* `contracts.test.mjs`: jeder `*.contract.md` trägt `## Muss` mit `### Zustand` und `### Aktionen`,
  `## Kann` mit `### Tokens`, `### Attribute` und `### Aufzeichnung`, und `## Konformität` mit genau
  einem JSON-Block; Overlays tragen `### Stapel`. `### Zustand` nennt genau eine Nachricht, führt keine
  Schlüsseltabelle, und die Nachricht steht in `test/fixtures/state.proto` oder in der Liste
  geplanter Nachrichten; die Liste wächst nicht, und eine gelandete Nachricht muss aus ihr heraus.
  `test/fixtures/state.proto` ist byte-identisch mit dem Worktree (`publish-to-worktree.mjs` holt sie
  zurück); fehlt `state.proto` im Worktree (master vor !1698), wird dieser Test mit Hinweis
  übersprungen, und `node --test` bleibt grün. Kein Token im Muss-Teil: Der Draht kennt keine Farben.
* `components.test.mjs`: die neuen Überschriften; jedes `var(--tl-…)` im CSS der Komponente steht im
  Kann-Teil.
* `roles-to-mui.test.mjs`: Referenzen je Modus aufgelöst, dunkel erbt, ein `derive`-Theme überschreibt,
  `generate()` liefert `roles.generated.json` aus seinem eigenen Erzeugnis.
* `dist.test.mjs`: `dist/` ist byte-identisch mit dem Erzeugnis aus `src/` — jetzt einschließlich
  `dist/roles.generated.json`.

**Im Framework (Vitest in `react-src`, Java-Tests im Modul):**

* Harness: jedes unserer Controls mit Vertrag besteht seinen Muss-Teil; kein Fall setzt einen
  Schlüssel, den seine Nachricht in `control-state.ts` nicht deklariert; `replace` gewinnt gegen
  `register`; der Dialog-Vertrag prüft Escape und Backdrop, der Snackbar-Vertrag die `generation`.
* `TestControlStateSchema` (aus !1698): der Server sendet nur Deklariertes.
* `ClientResources`: Override aus zweitem Fragment (§7 Schritt 2).
* `UIThemeService`: Theme mit `ui-package` ergänzt die Ressourcenliste, Theme ohne lässt sie
  unverändert (§7 Schritt 5).

**Im Referenzprojekt (#29661, im Framework):** Harness gegen die MUI-Komponenten des Moduls, Theme aus
`roles.generated.json`. Nicht Teil dieser Spec.
