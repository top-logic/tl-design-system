# UI-Paket — Stufe C mit fremder Komponentenbibliothek

**Stand:** 2026-09-25 · Ticket #29617
**Baut auf:** [`2026-09-17-design-system-neuaufbau-design.md`](2026-09-17-design-system-neuaufbau-design.md) §3 Stufe C,
`docs/skalen.md` „Zwei Wege, kein dritter“, „Themes: eine dritte Achse“

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
| **Shell** | TopLogic treibt die Oberfläche: Der Server schickt je Control `{ module, state }`, der Client rendert und schickt Kommandos zurück. Welche Komponente rendert, entscheidet die Registry. |
| **Headless** | Der Kunde treibt die Oberfläche selbst und liest und schreibt Daten über REST/OpenAPI. Kein Control-Protokoll, kein Vertrag je Komponente. |
| **Draht** | Der Teil des Control-Protokolls, den jede Komponente unter einem TopLogic-Namen einhalten muss: welcher Zustand kommt (`useTLState`), welche Kommandos zurückgehen (`useTLCommand`), und für Overlays der Stapel der Bridge (`pushTrap`, Dialog-Manager). |
| **Muss / Kann** | Die zwei Hälften eines Vertrags. Muss ist der Draht. Kann ist, was eine Komponente ins Bild und in die Werkzeuge einpasst: Tokens, Attribute für Tastatur und Fokus, Attribute für die Skript-Aufzeichnung. |
| **UI-Paket** | Ein Kundenmodul, das Skripte und Stylesheets als `ClientResources` beiträgt, Komponenten unter TopLogic-Namen registriert und benannte TopLogic-Ressourcen ersetzt oder entfernt. |

## 3 · Architektur

### 3a · Das Kundenmodul

Ein Maven-Modul des Kunden, wie jedes andere TopLogic-Modul, mit einer `config.xml`, die den
`ClientResources` beiträgt:

```xml
<module-script name="mbui-controls"
    resource="/script/mbui-controls.js"
    requires="tl-react-controls"/>
<stylesheet name="mbui-styles"
    resource="/style/mbui.css"
    requires="tl-design-system-tokens"/>
```

`requires="tl-react-controls"` stellt sicher, dass das Kundenbundle **nach** unserem läuft. Es ruft
für jede ersetzte Komponente `register('TLButton', MBButton)`; die Registry ist eine Map, der letzte
Eintrag gewinnt (`bridge/registry.ts`). Was der Kunde nicht registriert, bleibt TopLogic.

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
Ressourcen mit `package` — und die Overrides aus §3b, die in demselben Eintrag stehen — werden nur
geladen, wenn das aktive Theme dieses Paket nennt. Wählt eine Person ein Theme mit Paket, lädt die
Seite neu; ohne Feld gilt die Liste wie konfiguriert. Ein Kunde, der sein Paket fest will, lässt
`package` einfach weg (§3a).

Damit lässt sich während einer Migration zwischen TopLogic und Kundenpaket wechseln, ohne dass „aus“
je ein Zustand ist: Es gibt immer ein Paket, das rendert. `data-tl-theme` bleibt die dritte Achse
neben Modus und Dichte; das Paket hängt am Theme, nicht umgekehrt. Ein Reload beim Wechsel ist
Absicht: Die Registry ist eine Map ohne Abmelden, und zwei Bundles nebeneinander wären genau der
Mischzustand, den die Entscheidung ausschließt.

Dieser Schritt ist der letzte der Reihenfolge (§7) und optional für Mercedes: Ein Kunde mit einem
Paket konfiguriert es fest nach §3a und §3b und braucht §3c nicht.

## 4 · Verträge

Je Komponente eine Datei `<name>.contract.md` neben ihrem CSS im Paket
(`design-system/src/components/<name>/`). Die fünf bestehenden (Button, Pill, Avatar, Progress,
Icon) tragen heute die Abschnitte Zustand, Aktionen, Tokens, Attribute, Konformität gleichrangig.
Ab jetzt sind sie geteilt:

```
## Muss
### Zustand      — Schlüssel, Typ, Bedeutung; was `useTLState()` liefert
### Aktionen     — Auslöser → `sendCommand(...)`; was `false` zurückgeben muss
### Stapel       — nur Overlays: `pushTrap`, Dialog-Manager, `ANCHORED_OVERLAY_ATTR`
## Kann
### Tokens       — welche Rollen die Komponente liest, damit sie ins Bild passt
### Attribute    — Tastatur und Fokus: `disabled`, `aria-pressed`, `:focus-visible`, `data-tl-state`
### Aufzeichnung — Attribute, die `ReactOptionByLabelNaming` und `ModelResolver` lesen
## Konformität   — was der Harness prüft, und was TopLogic garantiert
```

Der Test `components.test.mjs` prüft heute die alten Überschriften; er wird mit der Umstellung auf
`## Muss`, `## Kann`, die sechs `###` und `## Konformität` geändert. Die Token-Prüfung (jedes
`var(--tl-…)` im CSS steht im Vertrag) bleibt und zieht in den Kann-Teil.

**Was TopLogic garantiert:** die Bridge (Registry, Kommandokanal, SSE, Fokusfalle, Stapel) und dass
der Zustand so kommt, wie der Muss-Teil sagt. Ändert sich ein Schlüssel im Zustand, ändert sich der
Vertrag, und der Harness des Kunden schlägt an. Nicht garantiert: Aussehen, und die Aufzeichnung ohne
die Kann-Attribute.

**Verträge für die MBUI-Schnittmenge**, abgeleitet aus `controls-entry.ts` (Namen geprüft): die
Blätter, die eine Material-Bibliothek typisch mitbringt.

| TopLogic-Name | Material-Gegenstück | Vertrag |
|---|---|---|
| `TLButton` | Button, IconButton | vorhanden, wird umgestellt |
| `TLToggleButton` | ToggleButton | neu |
| `TLTextInput`, `TLPasswordInput`, `TLNumberInput` | TextField | neu, ein Vertrag je Control |
| `TLSelect`, `TLDropdownSelect` | Select, Autocomplete | neu |
| `TLCheckbox`, `TLBooleanChoice` | Checkbox, Switch | neu |
| `TLDatePicker` | DatePicker | neu |
| `TLSlider` | Slider | neu |
| `TLOptionChips`, `TLSegmentedChoice` | Chip, ToggleButtonGroup | neu |
| `TLTabBar` | Tabs | neu |
| `TLDialog` | Dialog | neu, mit Stapel |
| `TLSnackbar` | Snackbar | neu, mit Stapel |
| `TLText` (Pill) | Chip | vorhanden als `pill.contract.md`, wird umgestellt |
| `TLAvatar` | Avatar | vorhanden, wird umgestellt |
| `TLProgress` | LinearProgress, CircularProgress | vorhanden, wird umgestellt |
| `TLIcon` | Icon | vorhanden, wird umgestellt |

Container (`TLGrid`, `TLStack`, `TLDeckPane`, `TLDialogManager`, `TLSidebar`, `TLAppShell`,
`TLSplitPanel`, `TLPanel`, `TLFormLayout` …), Tabelle und Baum bleiben TopLogic und bekommen in
dieser Spec keinen Vertrag. Wer sie ersetzen will, stellt den Antrag mit dem konkreten Fall; das
Format ist dann dasselbe.

## 5 · Konformitätstest-Harness

Der Harness liegt im Framework bei der Bridge (`com.top_logic.layout.react/react-src/test/`), nicht
im Paket: Er muss `useTLState` und `useTLCommand` stubben und die Registry befragen, und das sind
Bridge-Interna. Das Paket bleibt ohne Abhängigkeiten.

**Befund (25.09.):** `react-src` hat heute keine Test-Infrastruktur — `package.json` kennt nur
`build` und `dev` über Vite, keine Testdateien, kein Vitest, kein Jest. Der Harness bringt als
devDependencies Vitest, `@testing-library/react` und jsdom mit; Vitest, weil Vite schon da ist und
dieselbe Konfiguration liest.

Was er tut, je Vertrag:

1. Liest `<name>.contract.md` aus dem Paket (Muss-Teil: Zustandstabelle, Aktionstabelle) und baut
   daraus einen Beispielzustand je Zeile: Pflichtschlüssel gesetzt, optionale einmal mit, einmal ohne.
2. Holt die unter dem TopLogic-Namen registrierte Komponente aus der Registry — unsere oder die
   des Kunden, je nachdem, welches Bundle geladen ist.
3. Mountet sie mit dem Zustand, stubbt `sendCommand`, löst jeden Auslöser der Aktionstabelle aus
   (Klick, Enter, Leertaste, Tastengeste) und prüft, dass genau das genannte Kommando mit den
   genannten Argumenten ankommt — und dass bei `disabled` oder `hidden` nichts ankommt.
4. Für Overlays: prüft, dass `pushTrap` bei `open` gerufen und beim Schließen zurückgenommen wird.
5. Optional (`--kann`): prüft die Attribute aus dem Kann-Teil am gerenderten DOM.

Unsere eigenen Controls bestehen den Harness zuerst; das ist die Bedingung, bevor ein Vertrag als
geschrieben gilt. Für den Kunden ist er ein npm-Skript (`npm run conformance -- --bundle
dist/mbui-controls.js`), das er vor jedem Deploy und nach jedem Framework-Update laufen lässt. Er ist
sein Werkzeug, nicht unser Gate: Ein roter Harness beim Kunden bricht keinen TopLogic-Build.

## 6 · Referenzprojekt `examples/mui-adapter/`

Im Design-System-Repo, neben `design-system/`, mit eigener `package.json`. Die Paketregel „ohne
Abhängigkeiten“ gilt für `design-system/`; `examples/` darf MUI, Emotion und Vite ziehen, und die
Gates des Pakets laufen nicht darüber. Ein eigener `npm test` im Beispiel ruft den Harness aus §5.

Inhalt:

| Datei | Was sie zeigt |
|---|---|
| `src/MBButton.tsx`, `src/MBDialog.tsx` | `TLButton` und `TLDialog` auf MUI; Muss-Teil vollständig, Stapel über `pushTrap`. Der Dialog rendert per Portal an `body` — das liegt unter `html`, wo `data-tl-mode` und `data-tl-theme` stehen, also folgt er dem Modus. |
| `src/entry.ts` | `register('TLButton', MBButton)`, `register('TLDialog', MBDialog)`; React aus `tl-react-bridge`. |
| `src/theme.ts` | `createTheme` aus **unseren Rollen**: `palette.primary.main` ← `surface-brand`, `contrastText` ← `text-on-brand`, `error/warning/success/info` ← `status-*-surface` und `text-on-status-*`, `background` ← `surface-base`/`surface-layer`, `text` ← `text-primary`/`text-secondary`, `shape.borderRadius` ← `radius`, `typography.fontFamily` ← `font`. Zwei Themes, hell und dunkel, umgeschaltet nach `data-tl-mode` per `MutationObserver` am `html`. |
| `tools/roles-to-mui.mjs` | Liest `design-system/dist/tokens.css` (und optional ein `<theme>.theme.css`) und schreibt die Rollen als Hex je Modus in `src/roles.generated.json`. Zur Bauzeit, weil MUI `contrastText` und Hover-Töne selbst aus Hexwerten rechnet und mit `var(--tl-…)` nichts anfangen kann. Erzeugt, nie von Hand geändert. |
| `vite.config.ts` | Alias `react` → `tl-react-bridge`-Export, MUI und Emotion gebündelt. |
| `README.md` | Die Anleitung für Mercedes: drei Schritte vom leeren Modul zum ersten ersetzten Button. |

Das Beispiel ist die Vorlage, die Mercedes bekommt. Es beweist Mischbetrieb: Button und Dialog sind
Material, alles andere TopLogic, und beides teilt eine Palette.

## 7 · Reihenfolge mit Fertig-Bedingungen

1. **Entscheidung.** Erledigt (25.09.): `docs/skalen.md` „Zwei Wege, kein dritter“, Folie 13b,
   Übersicht §2b, Spec §3 fortgeschrieben.
2. **Ressourcen-Override.** `@Key` an `ClientResources.Config.getResources()`. Fertig: ein Test im
   Framework entfernt `tl-design-system-components` aus einem zweiten Fragment und behält
   `tl-react-controls`; `requires` auf einen entfernten Eintrag ist ein Fehler. Branch
   `CWS/CWS_29617_design_system_ui_paket`, `tools/check-messages-en.sh` vor dem Push.
3. **Harness und Verträge.** Vitest in `react-src`, Harness nach §5, die fünf bestehenden Verträge
   auf Muss/Kann umgestellt, `components.test.mjs` nachgezogen, dann die neuen Verträge der Tabelle
   in §4. Fertig: jeder Vertrag der Tabelle existiert, und jedes unserer Controls besteht seinen.
4. **Referenzprojekt.** `examples/mui-adapter/` nach §6. Fertig: `npm test` im Beispiel grün gegen
   die Verträge von Button und Dialog; die Demo-App zeigt Material-Button und -Dialog im
   TopLogic-Layout, hell und dunkel.
5. **Theme benennt Paket.** `ui-package` an `UITheme.Config`, Reload beim Wechsel. Fertig: eine
   Person wählt „mbui“ und sieht nach dem Reload das Kundenbundle; wählt sie „default“, TopLogic.

Jeder Schritt endet committet. Schritt 2 und 5 laufen im Framework-Worktree, 3 in beiden Repos, 4 im
Design-System-Repo.

## 8 · Nicht-Ziele und Offenes

* **Headless-Reife.** Der Skill `toplogic-react-frontend` belegt, dass der Weg gegangen wurde
  (OpenAPI-Server über TL-Script, Dev-Proxy, Auth-Naht). Ob Rechte, Paging, Dateien und Ereignisse für
  eine echte Anwendung reichen, weiß nur, wer die Projekte gemacht hat. Nicht Teil dieser Spec.
* **Dichte in MUI.** MUI kennt `data-tl-density` nicht; sein 8-px-Raster ist fest. Das Referenzprojekt
  zeigt eine Dichte. Was der Kunde daraus macht, ist seins.
* **Java-Port des Harness.** Verworfen: Der Vertrag ist ein Client-Vertrag und wird im Client geprüft.
  Eine zweite Prüfung in Java wäre eine zweite Wahrheit.
* **Skript-Aufzeichnung mit fremden Komponenten.** Funktioniert nur mit den Kann-Attributen. Welche
  das je Komponente sind, steht im Vertrag; ob Mercedes sie setzt, entscheidet Mercedes.
* **Container-Verträge.** Nicht in dieser Spec (§4). Erst mit einem konkreten Fall.

## 9 · Tests

**Im Paket (`node --test` in `design-system/`):**

* `components.test.mjs`: jeder `*.contract.md` trägt `## Muss` mit `### Zustand` und
  `### Aktionen`, `## Kann` mit `### Tokens` und `### Attribute`, und `## Konformität`; Overlays
  tragen `### Stapel`. Jedes `var(--tl-…)` im CSS der Komponente steht im Kann-Teil. Kein Token im
  Muss-Teil: Der Draht kennt keine Farben.
* `examples/` liegt außerhalb der Gates; `lint-css.mjs` und die Ratsche fassen es nicht an.

**Im Framework (Vitest in `react-src`, Java-Tests im Modul):**

* Harness: jedes unserer Controls mit Vertrag besteht seinen Muss-Teil; `TLDialog` ruft `pushTrap`
  bei `open` und nimmt es beim Schließen zurück.
* `ClientResources`: Override aus zweitem Fragment (§7 Schritt 2).
* `UIThemeService`: Theme mit `ui-package` ergänzt die Ressourcenliste, Theme ohne lässt sie
  unverändert (§7 Schritt 5).

**Im Referenzprojekt (`npm test` in `examples/mui-adapter/`):** Harness gegen `MBButton` und
`MBDialog`; `roles.generated.json` ist byte-identisch mit dem, was `tools/roles-to-mui.mjs` aus
`dist/` erzeugt.
