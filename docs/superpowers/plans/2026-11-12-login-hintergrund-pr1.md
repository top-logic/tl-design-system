# Login-Hintergrund PR 1 (#30294) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ein neues View-Element `<login-backdrop>` zeichnet hinter Logo und Login-Karte ein Halbton-Raster in der Hausfarbe, mit Highlight unter dem Zeiger, Klick-Welle und Formwechsel als Easter Egg; zuerst nur auf der Demo-Login-Seite.

**Architecture:** Farbe, Maße und Dauern sind Tokens des Pakets (neue Rollen `surface-halftone`, `surface-halftone-strong`, von `derive` für Kundenthemes mitgerechnet). Der Client zeichnet auf ein `<canvas>`, liest die Tokens zur Laufzeit (`tokenPx`, `tokenMs`, `getComputedStyle`) und zeichnet nur bei Anlass neu. Die Rechnung (Punktgröße, Highlight, Welle, Formen) liegt als reine Funktionen in `bridge/halftone.ts` und ist mit vitest getestet; Element und Control folgen dem Muster `<inset>`/`ReactInsetControl`.

**Tech Stack:** Paket `tl-design-system` (node, ohne Abhängigkeiten), React/TS in `com.top_logic.layout.react`, Java in `com.top_logic.layout.react` und `com.top_logic.layout.view`, Demo `com.top_logic.demo.react`.

**Spec:** `docs/superpowers/specs/2026-11-12-login-hintergrund-design.md` (Doku-Repo). Nicht in diesem PR: der Einstieg nach der Anmeldung (PR 2).

**Worktree / Branch:** `_Working-Tree/tl8-wt-30294`, `CWS/CWS_30294_login_backdrop`, Basis `CWS/CWS_30281_ui_pass_small_fixes` (#30281). Commits `Ticket #30294: …`, englisch. **Kein Push.**

## Global Constraints

- Farben, Maße, Dauern nur über Tokens; `tokens.json` trägt nur Referenzen `{primitive}` (Test fängt Literale).
- Namen englisch, Präfix `tl`; Klassen `tl-login-backdrop…`; Zustände als Attribute, nicht Klassen.
- React immer aus `'tl-react-bridge'` importieren, nie aus `'react'`.
- `messages_en.properties` nie von Hand: JavaDoc schreiben, `TL_WORKTREE=$PWD /Users/hendrik/Claude/TopLogic-v8-DesignSystem/tools/check-messages-en.sh` (nach einem Commit), Diff committen, Deutsch in `messages_de.properties` an sortierter Stelle nachziehen.
- Maven nur `clean install`, JDK 21 (`JAVA_HOME=/opt/homebrew/Cellar/openjdk@21/21.0.13.0.2/libexec/openjdk.jdk/Contents/Home`), aus `tl-parent-engine` mit `-pl ../<modul>`.
- Neue `.java`-Dateien: SPDX-Kopf und Klassen-JavaDoc; Felder mit `_`; `{@link}` statt `{@code}` für Symbole.
- Paket-Gates nach jeder Paketänderung: `cd tl-design-system && node tools/generate.mjs && node tools/lint-css.mjs && npm test`.
- Ruhezustand: kein `requestAnimationFrame`-Kreislauf ohne Anlass.
- `prefers-reduced-motion: reduce`: kein Highlight, keine Welle, Formwechsel ohne Überblenden.

## Review Focus

1. Theme- oder Moduswechsel zur Laufzeit (`data-tl-mode`, `data-tl-theme`): das Raster muss die neue Farbe zeigen, ohne Neuladen → Test in Task 3 (`useTokenSwitch`-Pfad), Sichtprüfung Task 5.
2. Klick auf Karte, Feld, Knopf, Logo oder Link löst **keine** Welle aus und zählt nicht fürs Easter Egg → vitest in Task 3 (`isBackgroundTarget`).
3. Fenstergröße ändert sich (Drehen, Zoomen, Seitenleiste): Raster neu gemessen, scharf bei `devicePixelRatio` 2 → Task 3 (ResizeObserver), Sichtprüfung Task 5.
4. Kein Design System geladen / Token fehlt: `tokenPx`/`tokenMs` liefern den Rückfall, das Raster zeichnet nicht in einer Fremdfarbe → Task 3 (`readHalftoneTheme` liefert `null` ohne Farbe, dann wird nichts gezeichnet).
5. Viele schnelle Klicks: Wellen überlagern sich begrenzt, alte enden → vitest in Task 3 (`activeRipples` entfernt beendete).

## Nachträge aus dem Plan-Review (Fable, 12.11.) — verbindlich, gehen den Tasks unten vor

Geprüft mit Probelauf in einer Kopie: Task 1 und 2 grün durch alle Paket-Gates (nach den Korrekturen), Rechenfunktionen von Task 3 grün in vitest und `typecheck`; OKLCH-Werte bestätigt; `derive` schreibt jede Rolle aus `markenRollen` von selbst; kein Test verlangt ein Kontrastpaar je `surface-*`.

- **R0 (neu, vor Task 1):** einmal aus `tl-parent-engine`: `mvn -B clean install -pl ../tl-design-system,../com.top_logic.layout.react` (JDK 21) — legt `node_modules` an; ohne das laufen `npm test`/`typecheck` im React-Modul nicht.
- **R1 Task 2 (Gate-Bruch):** `.tl-login-backdrop[hidden] { display: none; }` in Test und CSS (`hidden.test.mjs`).
- **R2 Task 2:** Es gibt keinen allgemeinen Vertragstest. `login-backdrop.test.mjs` prüft selbst mit `missingInContract` (Klassen, alle Tokens inkl. der nur vom Client gelesenen, `TLLoginBackdrop`) und `specimenProblems` (Muster `test/contracts-5d.test.mjs:7-37`). Link `/src/components/login-backdrop/login-backdrop.spec.html` in `specimen/index.html`, mit Test. Eintrag `'tl-login-backdrop': new Set([])` in `MODIFIERS` (`tools/lint-css.mjs:85`), mit Test.
- **R3 Task 2/3 Logo je Modus (meine Entscheidung):** **ein** `img`, dessen Quelle dem Modus folgt (im TSX über `useTokenSwitch`, das `data-tl-mode` an `<html>` liest: `dark` und `logoDark` gesetzt → `logoDark`, sonst `logo`). Kein Attribut `data-tl-logo-mode`, kein `[data-tl-mode]`-Selektor im CSS.
- **R4 Task 2 Logo-Unterlage (meine Entscheidung, aus Befund Kontrast 1,95 dunkel gegen die Punkte):** das Logo steht auf einer eigenen Fläche wie in der Skizze: `.tl-login-backdrop__logo` als `img` in `.tl-login-backdrop__brand` mit `background: var(--tl-surface-layer)`, `border-radius: var(--tl-radius-md)`, `padding: var(--tl-space-sm) var(--tl-space-md)`, `border: var(--tl-border-width-sm) solid var(--tl-border-separator)`. Ohne Logo wird `__brand` nicht gerendert. Sichtprüfung zeigt Hendrik das Ergebnis.
- **R5 Task 2 Höhe/Ränder:** `padding: var(--tl-space-lg)` an die **Wurzel** (nicht an `__content`); `__content` mit `max-height: 100%`, `overflow-y: auto`, `min-height: 0`. Sichtprüfung: Fenster niedriger als die Karte → scrollt statt abzuschneiden.
- **R6 Task 3 Ablage:** `react-src/controls/halftone.ts` und `controls/halftone.test.ts` (wie `link-href.ts`), nicht `bridge/` — Controls importieren nicht produktiv aus `../bridge/`.
- **R7 Task 3 Farbe ohne Mischen:** Grundpunkt in `surface-halftone`, darüber derselbe Punkt in `surface-halftone-strong` mit `globalAlpha = k` (k aus Highlight/Welle, gekappt auf 1). Kein Farbparser.
- **R8 Task 3 Lesen der Tokens:** exportiert `readHalftoneTheme(root: Element): HalftoneTheme | null` mit `interface HalftoneTheme { color: string; strong: string; step: number; glow: number; rippleMs: number; morphMs: number; dark: boolean }`; `null`, wenn `--tl-surface-halftone` leer ist. vitest (jsdom): Literale per `<style>` setzen (jsdom löst `var()` nicht auf); `null` ohne Farbe; Wechsel von `data-tl-mode` liefert neue Werte. `ResizeObserver` und `matchMedia` stubben (Muster `bridge/scroll-strip.test.tsx:103`), Guard wie `scroll-strip.ts:129`; die Komponente hält `getContext('2d') === null` aus (zeichnet dann nichts, wirft nicht) — Render-Test der Komponente in jsdom.
- **R9 Task 3 Hintergrund-Klick:** `isBackgroundTarget(target, root, content)` ist wahr für `root`, `content` selbst und alles außerhalb von `content`, falsch für Nachfahren von `content` (Karte, Logo, Link).
- **R10 Task 4 Maven:** erst `mvn -B clean install -pl ../com.top_logic.layout.react` (ohne `-Dtest`), dann `mvn -B clean install -DskipTests=false -pl ../com.top_logic.layout.view -Dtest=test.com.top_logic.layout.view.element.TestLoginBackdropElement`. Der Zusatz „falls `-Dtest` die Suite umgeht“ entfällt.
- **R11 Task 4 `logo-alt`:** ein `ResKey` ist ein Unterelement: `<logo-alt><en>…</en><de>…</de></logo-alt>`. Test mit `ResKey.text(…)`; Suite nimmt `ResourcesModule.Module.INSTANCE` dazu (Aufzählung wie `TestLoadViews.java`, `viewSuite`).
- **R12 Task 4 `@InApp` (meine Entscheidung):** nein — das Element gehört zur Login-Anzeige wie `LoginCommandsElement`/`LoginMethodsElement`.
- **R13 Task 5 Struktur:** `<login-backdrop logo="/images/TL-Logo-without-text.svg"><logo-alt>…</logo-alt><stack align="center" gap="default">` Karte, Link `</stack></login-backdrop>` (ohne inneren Stack stünde der Link links, `ContentControls.java:92`). Logo-Datei `/images/TL-Logo-without-text.svg` (aus `com.top_logic`, ausgeliefert; `appLogo.svg` trägt eine 5-px-Unterzeile). View mit `XMLPrettyPrinter` normalisieren.

---

### Task 1: Tokens und `derive` für die Punktfarbe

**Files:**
- Modify: `tl-design-system/src/primitives.json` (`motion`: `dur-5`, `dur-6`)
- Modify: `tl-design-system/src/tokens.json` (Farben je Modus, Dauern, Maße)
- Modify: `tl-design-system/tools/lib/color.mjs` (`MARKE_HALFTONE`, `markenRollen`)
- Test: `tl-design-system/test/color.test.mjs`, `tl-design-system/test/tokens.test.mjs` (oder die Datei, die Rollen je Modus prüft)

**Interfaces:**
- Produces: CSS-Variablen `--tl-surface-halftone`, `--tl-surface-halftone-strong` (beide Modi), `--tl-duration-morph` (700ms), `--tl-duration-ripple` (1800ms), `--tl-size-halftone-step` (1rem), `--tl-size-halftone-glow` (2.5rem), `--tl-size-login-logo` (3rem).

- [ ] **Step 1: Failing tests**
  - `color.test.mjs`: „markenRollen rechnet die Halbton-Rollen aus dem Farbton der Saat“: für die TopLogic-Saat (`surface-brand` hell) gilt `|L(light['surface-halftone']) − 0.794| < 0.01`, `|L(light['surface-halftone-strong']) − 0.735| < 0.01`, `|L(dark['surface-halftone']) − 0.375| < 0.01`, `|L(dark['surface-halftone-strong']) − 0.454| < 0.01`; Farbton aller vier innerhalb 2° der Saat. Für eine unbunte Saat ist `C < 0.002`. Die Liste der zurückgegebenen Rollen (Test um Zeile 147) enthält beide neuen Namen.
  - Tokens-Test: beide Rollen existieren in `light` und `dark` als Referenz; `duration-morph`, `duration-ripple`, `size-halftone-step`, `size-halftone-glow`, `size-login-logo` existieren als Referenz.
- [ ] **Step 2:** `npm test` — die neuen Tests scheitern.
- [ ] **Step 3: Werte**
  - `primitives.json` `motion`: `"dur-5": "700ms"`, `"dur-6": "1800ms"`.
  - `tokens.json` hell: `"surface-halftone": "{blue-21}"`, `"surface-halftone-strong": "{blue-27}"`; dunkel: `"surface-halftone": "{blue-62}"`, `"surface-halftone-strong": "{blue-55}"` (gewählt nach OKLCH: Ton 260 wie die Marke; hell L 0,794/0,735, dunkel L 0,375/0,454 — entspricht der Skizze mit 38 % bzw. 45 % Deckkraft).
  - `tokens.json` Maße/Bewegung: `"duration-morph": "{dur-5}"`, `"duration-ripple": "{dur-6}"`, `"size-halftone-step": "{size-4}"`, `"size-halftone-glow": "{height-5}"`, `"size-login-logo": "{size-8}"`.
  - `color.mjs`: `export const MARKE_HALFTONE = { light: { base: { L: 0.794, C: 0.104 }, strong: { L: 0.735, C: 0.137 } }, dark: { base: { L: 0.375, C: 0.151 }, strong: { L: 0.454, C: 0.184 } } };` mit JavaDoc-artigem Kommentar (Herkunft: TopLogic-Primitive blue-21/27/62/55). In `markenRollen` je Modus `'surface-halftone'` und `'surface-halftone-strong'` über `bei(mode, rolle, L, unbunt ? 0 : C)` — wie `surface-brand-subtle`.
  - Die Rollen sind Dekoration: **nicht** in `tools/lib/pairs.mjs` aufnehmen. Prüfen, ob ein Test „jede `surface-*`-Rolle hat ein Paar“ verlangt; wenn ja, die Rollen dort als Dekoration ausnehmen und den Grund als Kommentar nennen.
- [ ] **Step 4:** Paket-Gates grün; `node tools/derive.mjs test/fixtures/probe.primitives.json specimen/probe.theme.css` erzeugt die Datei neu, `derive.test` (byte-gleich) grün.
- [ ] **Step 5: Commit** `Ticket #30294: Halftone roles, durations and sizes of the login backdrop; derive computes the roles for customer themes.`

### Task 2: Paket-Komponente `login-backdrop`

**Files:**
- Create: `tl-design-system/src/components/login-backdrop/login-backdrop.css`, `.contract.md`, `.spec.html`
- Test: `tl-design-system/test/login-backdrop.test.mjs`

**Interfaces:**
- Produces (Klassen): `tl-login-backdrop` (Wurzel), `tl-login-backdrop__canvas`, `tl-login-backdrop__content`, `tl-login-backdrop__logo`; Attribut `data-tl-logo-mode="light|dark"` am Logo-`img`, wenn zwei Fassungen angegeben sind.

- [ ] **Step 1: Failing test** `login-backdrop.test.mjs` (Muster `behaelter.test.mjs`, `declarationsOf`/`readGenerated`):
  - `.tl-login-backdrop`: `position: relative`, `overflow: hidden`, `display: grid`, `place-items: center`, `background: var(--tl-surface-base)`.
  - `.tl-login-backdrop__canvas`: `position: absolute`, `inset: 0`, `pointer-events: none`.
  - `.tl-login-backdrop__content`: `position: relative`, `display: flex`, `flex-direction: column`, `align-items: center`, `gap: var(--tl-space-md)`, `padding: var(--tl-space-lg)`.
  - `.tl-login-backdrop__logo`: `max-height: var(--tl-size-login-logo)`, `max-width: 100%`. Neues Token `size-login-logo` → `{size-8}` (3rem) in Task 1 mit anlegen.
  - Logo je Modus: `[data-tl-mode="light"] .tl-login-backdrop__logo[data-tl-logo-mode="dark"]` und umgekehrt `display: none` (die Modi stehen als `data-tl-mode` an `<html>`, siehe `dist/tokens.css`).
  - Vertrag nennt jedes gelesene Token (bestehender Vertragstest).
- [ ] **Step 2:** `npm test` scheitert.
- [ ] **Step 3:** CSS, Vertrag (Zustand: `logo`, `logoDark`, `logoAlt`, `child`; Aktionen: keine Server-Aktion; Tokens inkl. `surface-halftone`, `surface-halftone-strong`, `size-halftone-step`, `size-halftone-glow`, `duration-ripple`, `duration-morph`, die der Client liest; „Eine Dekoration schuldet keinen Kontrast“), Specimen-Seite mit Logo-Platzhalter und Karte (Canvas bleibt im Specimen leer; Hinweis im Seitentext).
- [ ] **Step 4:** Paket-Gates grün, `npm run test:dom` grün (Specimen-Seite fokussierbar ohne Clip).
- [ ] **Step 5: Commit** `Ticket #30294: Design system component tl-login-backdrop.`

### Task 3: Client — Rechnung und Komponente

**Files:**
- Create: `com.top_logic.layout.react/react-src/bridge/halftone.ts`, `bridge/halftone.test.ts`
- Create: `com.top_logic.layout.react/react-src/controls/TLLoginBackdrop.tsx`
- Modify: `com.top_logic.layout.react/react-src/controls-entry.ts` (`register('TLLoginBackdrop', TLLoginBackdrop)`)

**Interfaces (halftone.ts, alle exportiert):**
- `type HalftoneShape = 'dot' | 'plus' | 'square'`; `const SHAPES: HalftoneShape[] = ['dot', 'plus', 'square']`; `const CLICKS_PER_SHAPE = 5`.
- `dotRadius(distance: number, halfDiagonal: number, step: number): number` — `rmax = 0.33 · step`; `d = distance / halfDiagonal`; `d ≥ 1 → 0`; sonst `rmax · (1 − d)^1.3`; Ergebnis `< 0.35 → 0`.
- `glowFactor(dx: number, dy: number, radius: number): number` — `exp(−(√(dx²+dy²)/radius)²)`.
- `interface Ripple { x: number; y: number; start: number }`; `rippleFactor(r: Ripple, px: number, py: number, now: number, durationMs: number, reach: number): number` — `p = (now − start)/durationMs`; außerhalb `[0,1)` → 0; Front `p · reach · 0.55`; `exp(−((dist − front)/20)²) · (1 − p)`.
- `activeRipples(ripples: Ripple[], now: number, durationMs: number): Ripple[]` — ohne beendete; höchstens 8 (älteste fallen).
- `nextShape(clicks: number): HalftoneShape` — `SHAPES[floor(clicks / CLICKS_PER_SHAPE) % 3]`.
- `isBackgroundTarget(target: EventTarget | null, root: Element, content: Element): boolean` — wahr, wenn `target` in `root`, aber nicht in `content`.
- `drawShape(g: CanvasRenderingContext2D, shape: HalftoneShape, x: number, y: number, r: number): void` — Punkt Kreis `r`; Plus zwei Balken Länge `2.6 r`, Stärke `max(0.7, 0.5 r)`; Quadrat Kante `1.8 r`.
- `prefersReducedMotion(): boolean`.
- Ausgeprägt in der Komponente (nicht exportiert nötig): Highlight addiert `0.8 · k` px zum Radius und mischt die Farbe zu `surface-halftone-strong` mit Anteil `k`; Welle addiert `2.2 · k` px und mischt ebenso.

- [ ] **Step 1: Failing vitest** `halftone.test.ts`: `dotRadius(0, 500, 16) ≈ 5.28`; `dotRadius(500, 500, 16) === 0`; monoton fallend; `glowFactor(0,0,40) === 1`, `glowFactor(40,0,40) ≈ e^−1`; `rippleFactor` 0 vor Start und nach `durationMs`; Maximum an der Front; `activeRipples` entfernt beendete und kappt bei 8; `nextShape(0..4)='dot'`, `(5)='plus'`, `(10)='square'`, `(15)='dot'`; `isBackgroundTarget` falsch für ein Element in `content`, wahr für `root` selbst.
- [ ] **Step 2:** `cd com.top_logic.layout.react && npm test` scheitert.
- [ ] **Step 3: `halftone.ts` implementieren.**
- [ ] **Step 4: `TLLoginBackdrop.tsx`** — State: `child`, `logo`, `logoDark`, `logoAlt` (Strings oder `null`). Rendert `div.tl-login-backdrop` mit `useFillHost(true)` + `FillProvider`, darin `canvas.tl-login-backdrop__canvas` (`aria-hidden="true"`) und `div.tl-login-backdrop__content` mit Logo(s) (`img.tl-login-backdrop__logo`, `alt={logoAlt ?? ''}`; mit `logoDark` zwei `img` mit `data-tl-logo-mode`) und `TLChild`.
  - Farbe/Maße/Dauern: `useTokenSwitch` liest `{ color, strong, step, glow, ripple, morph }` aus `getComputedStyle(root)` (`--tl-surface-halftone`, `--tl-surface-halftone-strong`) und `tokenPx`/`tokenMs`; ohne Farbe → nichts zeichnen.
  - Größe: `ResizeObserver` auf die Wurzel; Canvas in `devicePixelRatio`.
  - Zeichnen nur auf Anlass (Mount, Größe, Token-Wechsel, Zeiger, Welle, Formwechsel); `requestAnimationFrame` läuft nur, solange Highlight ausklingt, eine Welle aktiv ist oder überblendet wird.
  - Raster: Mitte = Mitte der Wurzel; Gitter `step`, Punkte über `dotRadius`; Farbe `color`, gemischt zu `strong` per Highlight/Welle (Mischung in sRGB genügt).
  - Zeiger: `pointermove`/`pointerleave` an der Wurzel (nur `pointerType === 'mouse'`); Highlight klingt beim Verlassen aus.
  - Klick: `click` an der Wurzel, nur wenn `isBackgroundTarget`; neue Welle am Klickpunkt; Zähler +1; bei Vielfachen von 5 Formwechsel mit Überblenden über `duration-morph`.
  - Reduced Motion: kein Highlight, keine Welle; Formwechsel sofort.
- [ ] **Step 5:** `npm test` (vitest) und `npm run typecheck` grün.
- [ ] **Step 6: Commit** `Ticket #30294: Client component TLLoginBackdrop drawing the halftone grid.`

### Task 4: Element und Control

**Files:**
- Create: `com.top_logic.layout.react/src/main/java/com/top_logic/layout/react/control/layout/ReactLoginBackdropControl.java`
- Create: `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/LoginBackdropElement.java`
- Test: `com.top_logic.layout.view/src/test/java/test/com/top_logic/layout/view/element/TestLoginBackdropElement.java` (Muster `TestImageElement`, `TestStackElement`; in die `TestAll`-Suite des Moduls aufnehmen, falls sie Klassen einzeln listet)
- Modify: `com.top_logic.layout.view/src/main/java/META-INF/messages_de.properties` (Deutsch)

**Interfaces:**
- `ReactLoginBackdropControl(ReactContext context, ReactControl child)`, React-Modul `"TLLoginBackdrop"`, Setter `setLogo(String url)`, `setLogoDark(String url)`, `setLogoAlt(String alt)` (State-Schlüssel `logo`, `logoDark`, `logoAlt`, `child`); `scriptingTransparent()` → `true`; `scriptingPresentationKeys` enthält `logo`, `logoDark`, `logoAlt`.
- `LoginBackdropElement extends ContainerElement`, `@TagName("login-backdrop")`, Config: `logo` (`@Nullable String`, Pfad einer Ressource der Webanwendung wie bei `<image resource>`), `logo-dark` (`@Nullable String`), `logo-alt` (`@Nullable ResKey`). `createControl`: Kinder über `ContentControls.combine`, URL = `context.getContextPath() + resource`.

- [ ] **Step 1: Failing test** `TestLoginBackdropElement`: ohne Optionen sind `logo`, `logoDark`, `logoAlt` `null`; mit `logo="/images/a.svg"` steht `<contextPath>/images/a.svg` im State; `logo-alt` wird übersetzt; ein Kind steht als `child`.
- [ ] **Step 2:** `mvn -B clean install -DskipTests=false -pl ../com.top_logic.layout.react,../com.top_logic.layout.view -Dtest=test.com.top_logic.layout.view.element.TestLoginBackdropElement` (aus `tl-parent-engine`; falls `-Dtest` die Suite umgeht und scheitert: über `TestAll` laufen lassen) — scheitert.
- [ ] **Step 3:** Control und Element mit JavaDoc (Tooltip-Texte der Optionen; der Klassen-JavaDoc des Elements beschreibt Wirkung und Verhalten für Entwickler: Raster, Highlight, Klick-Welle, kein Ruhe-Animieren, Reduced Motion; das Easter Egg nur als „hidden shape change after repeated clicks“).
- [ ] **Step 4:** Test grün; commit; `check-messages-en.sh` → Diff committen; Deutsch nachziehen; Messages-Gate erneut ohne Diff.
- [ ] **Step 5: Commit** `Ticket #30294: View element login-backdrop with its control.` und `Ticket #30294: Messages of login-backdrop.`

### Task 5: Demo, Doku, Sichtprüfung

**Files:**
- Modify: `com.top_logic.demo.react/src/main/webapp/WEB-INF/views/demo-login-page.view.xml`
- Modify: `com.top_logic.layout.view/src/main/java/META-INF/tl-docs/view-layer/app-shell.md` (Abschnitt Login-Seite: `<login-backdrop>` nennen; Framework-Seite nutzt ihn noch nicht)

- [ ] **Step 1:** Demo-Login: `<login-backdrop logo="/images/appLogo.svg" logo-alt=…>` ersetzt `<inset><stack fill …>`; darin Karte und Link wie bisher (der Link bleibt direkt unter der Karte). Vorher prüfen, welche Logo-Datei unter dem Pfad wirklich ausgeliefert wird und wie sie aussieht; gibt es eine bessere TopLogic-Datei mit Pfad, die nehmen.
- [ ] **Step 2:** `mvn -B clean install -pl ../tl-design-system,../com.top_logic.layout.react,../com.top_logic.layout.view,../com.top_logic.demo.react`; Demo starten (H2-Autoconf, `-Dtl_initial_password=root1234`, Port 8080 oder 8091).
- [ ] **Step 3: Sichtprüfung im Browser**, hell und dunkel: Raster mittig hinter der Karte, Karte klar vorne; Highlight 40 px leise; Klick auf Hintergrund → Welle; Klick auf Karte/Feld/Link → keine Welle; 5./10./15. Klick → Plus, Quadrat, Punkt; Moduswechsel im Benutzermenü bzw. per `data-tl-mode` → neue Farbe ohne Neuladen; Fenster verkleinern → Raster neu; Leerlauf: kein Dauer-`requestAnimationFrame` (Performance-Aufzeichnung oder Zähler); Reduced Motion (DevTools-Emulation) → stehendes Raster, Formwechsel ohne Überblenden; Anmeldung funktioniert wie zuvor.
- [ ] **Step 4:** Alle Gates: Paket `npm test`, `npm run test:dom`, `lint-css`; react `npm test`, `npm run typecheck`; Maven `layout.react`, `layout.view` mit Tests; Messages ohne Diff.
- [ ] **Step 5: Commit** `Ticket #30294: Demo login page shows the halftone backdrop with the TopLogic logo.`

### Task 6: Entscheidungen festhalten (Doku-Repo)

- [ ] `docs/skalen.md`: Abschnitt „Login-Hintergrund: Halbton aus der Hausfarbe“ (Rollen und Wahl der Stufen, Dekoration ohne Kontrastpaar, Ruhe ohne Bewegung, Reduced Motion, Easter Egg), `STATUS.md` nachziehen; `docs/ui-durchgang.md` U33 um den Hintergrund ergänzen. Commit `Ticket #30294: …` im Doku-Repo, nicht pushen.
