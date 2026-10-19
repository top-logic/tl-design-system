# Welle 5b · Medien — Umsetzungsplan (#29904)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Die Medien-Controls der React-Schicht lesen das Paket; ihre zehn Blöcke (881 Zeilen) fallen aus
`tlReactControls.css`.

**Architecture:** Das Paket bekommt `tl-media`, `tl-prose` (Typo über den Generator), `tl-file`, `tl-steps`,
`tl-job-status`, die Rolle `surface-document`, am Overlay `tl-overlay__action` und `tl-overlay--fill`, am Knopf
`tl-button--danger[aria-pressed]`. In der Engine bündeln `useUpload` und `downloadBlob` die Upload- und Download-Kopien;
Recorder, Player, Kamera und Druckknopf werden Part-Knöpfe, die Kamera ein clientseitiger Paket-Dialog; Wizard und
JobStatus teilen `tl-steps`.

**Tech Stack:** Paket: CSS, `node --test`, `tools/*.mjs`, Chrome über CDP. Engine: React/TSX über `tl-react-bridge`,
TypeScript, Vite, Java 17, Maven, Vitest im MUI-Modul.

**Spec:** `docs/superpowers/specs/2026-10-19-welle-5b-medien-design.md` (freigegeben 19.10.); Begründungen in
`docs/skalen.md` „Welle 5b: Medien“; Prognose in `docs/migration/altlast.md` „Welle 5“ (V2, V3, V4, V10, V14, V18,
V22). Bestand: Scratchpad-Notizen `5b-inventory.md`, `5b-engine-facts.md` (nur Orchestrator).

## Global Constraints

- Ticket **#29904**; Commits beider Repos mit Präfix `Ticket #29904:`, Paket-Commits deutsch, Engine-Commits englisch,
  Trailer `Co-Authored-By: <Modell des Ausführenden> <noreply@anthropic.com>`.
- Engine-Branch `CWS/CWS_29904_design_system_welle_5b` im Worktree `_Working-Tree/tl8-wt-29584` (auf dem 5a-Branch,
  Head `dce3322bc7`). **Kein Push** — Subagenten committen lokal und melden.
- Paket: `tokens.json` nur Referenzen; im CSS nur Tokens; `dist/` nur über `node tools/generate.mjs`, danach
  `node tools/publish-to-worktree.mjs` (Kopie versiegelt, `test/published.test.mjs`, `TestDesignSystemCopy`).
- **Kein neues Bedienkonzept** (Hendrik 19.10.): Umzug, Zusammenlegen, Fokus, Ansage, Bewegung. Kein Scrubber, keine
  Dauer, keine Vorschau vor dem Hochladen.
- Zustände sind Attribute (`aria-pressed`, `aria-busy`, `aria-current`, `data-tl-state`), nie Klassen `--recording`,
  `--uploading`, `--playing`, `--loading`, `--dragover`, `--empty`, `--done`, `--active`, `--pending`, `--mirrored`.
- Typo nur über Typo-Klassen: `font-size`, `font-weight`, `line-height` außerhalb `base.css`/`.tl-type-*` bricht das Lint
  (`tools/lint-css.mjs`); `tl-prose` bekommt seine Schrift deshalb über den Generator (Task 1).
- Jeder Block, der `display` setzt, setzt direkt danach `.tl-x[hidden] { display: none; }` (`test/hidden.test.mjs`).
- Jeder Pflichtbegriff eines Vertrags steht unmittelbar nach einem Backtick, eine Klasse je Backtick-Paar
  (`missingInContract`).
- Die Lage eines Parts (`Button`, `ProgressBar`, `Chip`) steht am Element um das Part, nie an seiner `className`.
- React in Controls nur aus `'tl-react-bridge'`; in `bridge/*.ts` aus `'react'` wie die Nachbardateien.
- Glyphen nur über Konstanten in `bridge/icons.ts` (Font Awesome, `css:fa-…`); keine lokale Glyphen-Konstante, kein
  `bi bi-…` in den Controls dieser Welle.
- Kein englisches Literal als `aria-label` oder sichtbarer Text; alles über `useI18N` und `I18NConstants`.
- `messages_en.properties` nie von Hand; `design-system/tools/check-messages-en.sh` vor dem Abschluss jeder Task mit
  Java; Deutsch in `messages_de.properties` von Hand, sortiert.
- Keine Zeitangaben in Docs und Commits.

## Review Focus

1. **Aufnahme ohne Mikrofonrecht** (`getUserMedia` wirft): der Recorder steht wieder auf „bereit“, nicht gedrückt, die
   Meldung `js.audioRecorder.error.denied` steht in `role="alert"`. Vitest in Task 5.
2. **Kamera-Dialog in einem Server-Dialog** (`TLWindow`): Escape schließt nur den Kamera-Dialog, das Fenster bleibt; der
   Fokus kehrt zum Kamera-Knopf zurück. Vitest in Task 5.
3. **Ablegen mehrerer Dateien auf FileChips, während ein Upload läuft:** nichts wird gesendet, `dragover` endet. Ablegen
   auf ein lesendes FileChips (`editable: false`): kein `dragover`, kein Upload. Vitest in Task 4.
4. **JobStatus mit Laufzeit:** die sekündlich wechselnde Laufzeit liegt außerhalb jedes Live-Bereichs; ein
   Schrittwechsel ändert den Text der `role="status"`-Zeile. Vitest in Task 7.
5. **Unmount während der Aufnahme:** der Recorder stoppt den Mikrofon-Stream (heute bleibt er offen). Vitest in Task 5.

---

### Task 1: Paket — Anzeige: `tl-media`, `surface-document`, `tl-prose`, Overlay

**Files:**
- Create: `design-system/src/components/media/media.{css,contract.md,spec.html}`,
  `design-system/src/components/prose/prose.{css,contract.md,spec.html}`
- Modify: `design-system/src/tokens.json` (Rolle `surface-document` in `light` und `dark`; Abschnitt `prose`),
  `tools/generate.mjs` (Prose-Selektoren an die Typo-Klassen), `tools/lint-css.mjs` (Blockliste),
  `tools/lib/pairs.mjs` (falls die Rolle dort deklariert werden muss), `src/components/overlay/overlay.{css,contract.md,spec.html}`,
  `test/popover.test.mjs` (Ausnahme), `specimen/index.html`
- Create: `design-system/test/medien.test.mjs`, `design-system/test/contracts-5b.test.mjs`

**Interfaces:**
- Produces (Klassen): `tl-media`, `tl-media__frame`, `tl-media__placeholder`, `tl-media--cover`, `tl-media--contain`;
  `tl-prose`; `tl-overlay--fill`, `tl-overlay__base`, `tl-overlay__action`. Rolle `--tl-surface-document`.

- [ ] **Step 1: Failing tests** in `test/medien.test.mjs` (Helfer wie `test/eingaben.test.mjs`: `readGenerated`,
  `declarationsOf`, lokal `decl`, `ohneKommentar`):
  - `surface-document: weiß in beiden Modi` — `tokens.json` `color.light['surface-document']` ===
    `color.dark['surface-document']` === `'{gray-0}'`.
  - `media: Rahmen füllt, Ecke radius-sm, Einpassung als Variante` — `.tl-media__frame` liest `--tl-radius-sm`;
    `.tl-media--cover .tl-media__frame` setzt `object-fit: cover`, `.tl-media--contain …` `contain`;
    `.tl-media--document .tl-media__frame` liest `--tl-surface-document`; `.tl-media__frame[data-tl-state~="mirrored"]`
    setzt `transform: scaleX(-1)`; kein `px`, kein Hex.
  - `prose: Schrift nur aus den Typo-Klassen` — in `dist/base.css` enthält die Regel von `.tl-type-heading-lg` den
    Selektor `.tl-prose h1`, `heading-md` `.tl-prose h2`, `heading-sm` `.tl-prose h3` bis `h6`, `body` `.tl-prose p` und
    `.tl-prose li`, `code` `.tl-prose code` und `.tl-prose pre`; `prose.css` enthält kein `font-size`, `font-weight`,
    `line-height`; `a` liest `--tl-text-link` und `:hover` `--tl-text-link-hover`; Tabellenlinie und Zitat
    `--tl-border-separator`.
  - `overlay: fill, base, action` — `.tl-overlay--fill` setzt `display: flex` (oder `block`) und füllt
    (`inline-size: 100%`, `block-size: 100%`); `.tl-overlay__action` liest `--tl-surface-overlay`, `--tl-radius-md`,
    `--tl-shadow-popover`, `--tl-space-2xs`.
  - In `test/contracts-5b.test.mjs` (Aufbau wie `contracts-5a.test.mjs`): `SOLL` für `media` (`tl-media`,
    `tl-media__frame`, `tl-media__placeholder`, `tl-media--cover`, `tl-media--contain`, `tl-status`,
    `--tl-surface-document`), `prose` (`tl-prose`, `heading-lg`, `heading-md`, `heading-sm`, `text-link`,
    `border-separator`), `overlay` (`tl-overlay--fill`, `tl-overlay__base`, `tl-overlay__action`); `SPECIMEN =
    ['media', 'prose', 'overlay']`.
- [ ] **Step 2: Run** `cd design-system && node --test test/medien.test.mjs test/contracts-5b.test.mjs` — FAIL.
- [ ] **Step 3: Rolle.** `surface-document` = `{gray-0}` in `light` und `dark`, Kommentar „Papier hinter fremdem HTML,
  in beiden Modi weiß (Spec 5b §5); kein Textpaar, der Inhalt kommt nicht vom Paket.“ Ist sie nach `pairs.test.mjs`
  („nennt jede Rolle, die tokens.test prüft“) oder einem Rollen-Test zu deklarieren, dort als Fläche ohne Paar
  eintragen, mit demselben Kommentar. Probe-Theme neu rechnen
  (`node tools/derive.mjs test/fixtures/probe.primitives.json specimen/probe.theme.css`) und mitcommitten.
- [ ] **Step 4: Prose über den Generator.** `tokens.json` bekommt `"prose": { "_": "Selektoren in .tl-prose je
  Typo-Klasse (Spec 5b §5)", "heading-lg": ["h1"], "heading-md": ["h2"], "heading-sm": ["h3", "h4", "h5", "h6"],
  "body": ["p", "li", "td", "th", "blockquote"], "code": ["code", "pre"] }`. `baseCss` in `tools/generate.mjs` hängt an
  die Selektorliste jeder `.tl-type-<n>`-Regel `, .tl-prose <el>` für jedes Element aus `T.prose[n]` (das Lint
  erlaubt Typo, weil die Regel `.tl-type-` trägt und in `base.css` steht).
- [ ] **Step 5: `prose.css`** — nur Abstände und Farben: Absatz- und Listenabstand aus `--tl-space-sm`, Überschrift oben
  `--tl-space-md`, erstes Kind ohne Abstand oben; `a` `--tl-text-link`, `a:hover` `--tl-text-link-hover`; `code`, `pre`
  auf `--tl-surface-layer-nested` mit `--tl-radius-sm`, `pre` mit `overflow: auto`; `table` `border-collapse`, Zellen
  `--tl-border-width-sm` `--tl-border-separator`, Innenabstand `--tl-space-2xs` `--tl-space-xs`; `blockquote` Linie
  am Anfang `--tl-border-width-md` `--tl-border-separator`, Einzug `--tl-space-sm`.
- [ ] **Step 6: `media.css`** — `.tl-media` `display: block`, `max-inline-size: 100%`, `position: relative` (+ `[hidden]`);
  `.tl-media__frame` `display: block`, `inline-size: 100%`, `block-size: 100%`, `border: 0`, Ecke `--tl-radius-sm`;
  Variante `.tl-media--document .tl-media__frame { background: var(--tl-surface-document); }` (fremdes HTML: Dokument
  und Vorschau); `.tl-media__frame[data-tl-state~="mirrored"] { transform: scaleX(-1); }` (Kamera-Video, Spec §4);
  `.tl-media__placeholder` `inline-size: 100%`, `block-size: 100%`.
- [ ] **Step 7: Overlay.** `.tl-overlay--fill` füllt seinen Behälter (`display: flex`, `inline-size: 100%`,
  `block-size: 100%`, `min-block-size: 0`), `.tl-overlay--fill > .tl-overlay__base` `flex: 1 1 auto`, `min-block-size: 0`;
  `.tl-overlay__base` sonst `display: block`. `.tl-overlay__action`: `display: flex`, Innenabstand `--tl-space-2xs`,
  Fläche `--tl-surface-overlay`, Rand `--tl-border-width-sm` `--tl-border-separator`, Ecke `--tl-radius-md`, Schatten
  `--tl-shadow-popover` (+ `[hidden]`). `test/popover.test.mjs` „nur tl-popover setzt die Popup-Fläche“ bekommt die
  Ausnahme `name !== 'overlay/overlay.css'` mit Kommentar `// Ausnahme 19.10. (Welle 5b): der Knopf über einer Fläche
  (tl-overlay__action) schwebt wie ein Popover, ohne Portal.`
- [ ] **Step 8: Lint.** Blockliste: `'tl-media': new Set(['cover', 'contain', 'document'])`, `'tl-prose': new Set([])`,
  `'tl-overlay': new Set(['fill'])` (Kommentar bleibt: Anker sind Element-Modifier).
- [ ] **Step 9: Verträge und Specimen.** `media.spec.html`: Bild `cover` und `contain` (Bild als Daten-URI ohne
  `style`), Platzhalter, PDF-Platzhalter als `tl-status`, Dokument-Rahmen `tl-media--document`. `prose.spec.html`:
  h1–h4, Absatz mit Link, Liste, Code, `pre`, Tabelle, Zitat. `overlay.spec.html` um ein Dokument mit
  `tl-overlay--fill` und `tl-overlay__action` mit Icon-Knopf (`tl-button tl-button--ghost tl-button--icon`,
  `aria-label` deutsch) ergänzen. Verträge nennen die Tokens und Leser (`TLImage`, `TLPdfViewer`, `TLHtml`,
  `TLPhotoCapture`). Links in `specimen/index.html`.
- [ ] **Step 10: Run** `node tools/generate.mjs && node tools/lint-css.mjs && node tools/publish-to-worktree.mjs &&
  node --test` — alles grün (auch `focus-clip`, `pairs`, `contrast`).
- [ ] **Step 11: Commit** Paket „Ticket #29904: Paket -- tl-media, tl-prose, surface-document, Overlay mit fill und
  action“; Engine (Kopie) „Ticket #29904: Design system package -- media, prose, document surface, overlay fill and
  action.“

### Task 2: Paket — Knopf gedrückt in `danger`, Dateizeile, Ziehen an der Chip-Gruppe

**Files:**
- Modify: `design-system/src/components/button/button.{css,contract.md,spec.html}`,
  `src/components/form/upload.{css,contract.md}`, `src/components/choice/choice.contract.md` (Ziehen an der
  Chip-Gruppe), `tools/lint-css.mjs`, `test/components.test.mjs` (BUTTON-Map, falls sie jedes Farb-Token verlangt),
  `specimen/index.html`
- Create: `design-system/src/components/file/file.{css,contract.md,spec.html}`
- Test: `test/medien.test.mjs`, `test/contracts-5b.test.mjs`

**Interfaces:**
- Produces: `tl-button--danger[aria-pressed="true"]` (gefüllt rot); `tl-file`, `tl-file__name`, Zustand
  `data-tl-state~="empty"`; `tl-chip-group[data-tl-state~="dragover"]`.

- [ ] **Step 1: Failing tests** in `test/medien.test.mjs`:
  - `button: gedrückt in danger ist gefüllt rot` — Regel `.tl-button--danger[aria-pressed="true"]` liest
    `--tl-status-error-surface` und `--tl-text-on-status-error`; `:hover` `-hover`, `:active` `-active` (dieselben
    sechs Rollen wie `.tl-button--danger.tl-button--primary`); die Regel steht in `button.css` **nach**
    `.tl-button[aria-pressed="true"]` (gleiche Spezifität, die spätere gewinnt).
  - `file: Name mit Ellipse, leer in text-secondary, nicht kursiv` — `.tl-file__name` setzt `text-overflow: ellipsis`,
    `overflow: hidden`, `white-space: nowrap`, `max-inline-size` aus einem Maß-Token (`--tl-size-13`);
    `.tl-file[data-tl-state~="empty"]` liest `--tl-text-secondary`; `file.css` ohne `font-style`.
  - `upload: Ziehen an Drop-Zone und Chip-Gruppe gleich` — eine Regel mit beiden Selektoren
    `.tl-file-upload[data-tl-state~="dragover"]` und `.tl-chip-group[data-tl-state~="dragover"]`.
  - `contracts-5b`: `file` (`tl-file`, `tl-file__name`, `data-tl-state~="empty"`, `TLDownload`, `TLBinaryField`),
    `upload` (`TLFileChips`, `TLAudioRecorder`, `TLPhotoCapture`, `audio`, `photo`, `tl-chip-group`), `button`
    (`aria-pressed`, `TLAudioRecorder`); `SPECIMEN` + `file`.
- [ ] **Step 2: Run** — FAIL.
- [ ] **Step 3: Implement.** `button.css`: die drei Regeln nach dem Block „Zustände als Attribute“. `file.css`:
  `.tl-file` `display: inline-flex`, `align-items: center`, `gap: var(--tl-space-control-gap)`, `min-block-size:
  var(--tl-size-control)` (+ `[hidden]`). `upload.css`: Selektorliste erweitern. Lint: `'tl-file': new Set([])`.
  Specimen `file.spec.html` (gefüllt mit Download-Knopf, leer, lang mit Ellipse); `button.spec.html` um einen
  gedrückten `danger`-Icon-Knopf. Verträge: `button` (Leser Medienknöpfe, gedrückt in `danger`), `upload` (Leser mit
  Teilnamen `file`/`audio`/`photo`), `choice` (Chip-Gruppe als Drop-Zone von `TLFileChips`).
- [ ] **Step 4: Run** `node tools/generate.mjs && node tools/lint-css.mjs && node tools/publish-to-worktree.mjs &&
  node --test` — grün (die Paare `text-on-status-error` auf `status-error-surface*` stehen schon in `pairs.mjs`).
- [ ] **Step 5: Commit** Paket „Ticket #29904: Paket -- Knopf gedrückt in danger, tl-file, Ziehen an der
  Chip-Gruppe“; Engine (Kopie) „Ticket #29904: Design system package -- pressed danger button, file row, chip group
  drop zone.“

### Task 3: Paket und Engine — `tl-steps` (Wizard umgestellt), `tl-job-status`

**Files:**
- Create: `design-system/src/components/steps/steps.{css,contract.md,spec.html}`,
  `design-system/src/components/job-status/job-status.{css,contract.md,spec.html}`
- Modify: `design-system/src/components/wizard/wizard.{css,contract.md,spec.html}`, `test/behaelter.test.mjs:215–221`,
  `test/contracts-4c.test.mjs:29,91–95`, `tools/lint-css.mjs`, `specimen/index.html`
- Modify (Engine): `com.top_logic.layout.react/react-src/controls/TLWizard.tsx` (Schrittliste)
- Test: `test/medien.test.mjs`, `test/contracts-5b.test.mjs`

**Interfaces:**
- Produces: `tl-steps` (`ol`), `tl-steps__item`, `tl-steps__disc`, `tl-steps__name`, `tl-steps--vertical`; erledigt
  `data-tl-state~="done"`, aktuell `aria-current="step"`. `tl-job-status`, `tl-job-status__header`, `__state`,
  `__elapsed`, `__cancel`, `__live`, `__bar`, `__message`, `__error`, `__result`.

- [ ] **Step 1: Failing tests:**
  - `steps: ein Aussehen in beiden Ausrichtungen` — `.tl-steps__item[data-tl-state~="done"] > .tl-steps__disc` liest
    `--tl-surface-brand-subtle`, `[aria-current="step"] > .tl-steps__disc` `--tl-surface-brand` und
    `--tl-text-on-brand`; `.tl-steps--vertical` setzt nur Anordnung (`flex-direction: column`, `gap`), keine Farbe.
  - `steps: aktuelle Scheibe pulsiert nur senkrecht` — `.tl-steps--vertical .tl-steps__item[aria-current="step"] >
    .tl-steps__disc` hat `animation` mit `var(--tl-duration-loop)` und `var(--tl-easing-standard)`; waagrecht keine
    Animation (der Wizard bleibt ruhig).
  - `wizard: liest tl-steps` — `wizard.css` enthält keinen Selektor `tl-wizard__steps`, `__step-item`, `__disc`,
    `__step-name`; Anpassung von `behaelter.test.mjs:215–221` und `contracts-4c.test.mjs:29,91–95` auf die
    `tl-steps`-Namen (dieselben Rollen, dieselbe Größe `--tl-size-icon-lg`).
  - `job-status: Live-Zeile, Fehler als alert` — Vertrag nennt `role="status"` an `tl-job-status__live`,
    `role="alert"` an `tl-job-status__error`, `tl-steps--vertical`, `tl-nums`, `tl-visually-hidden`; `.tl-job-status__error`
    liest `--tl-status-error-text`; `.tl-job-status__elapsed` und `__message` `--tl-text-secondary`.
  - `contracts-5b`: `steps`, `job-status`, `wizard` (`tl-steps`); `SPECIMEN` + `steps`, `job-status`.
- [ ] **Step 2: Run** — FAIL.
- [ ] **Step 3: Paket.** Die Regeln der Schrittliste ziehen aus `wizard.css` nach `steps.css` (Namen ersetzt,
  Werte gleich: Scheibe `--tl-size-icon-lg`, Rand `--tl-border-control`, Fläche `--tl-surface-layer-nested`, Text
  `--tl-text-secondary`; erledigt und aktuell wie oben; Name `--tl-text-secondary`, aktuell `--tl-text-primary`);
  waagrecht `flex-wrap: wrap`, `gap: var(--tl-space-xs) var(--tl-space-xl)`; senkrecht `flex-direction: column`, `gap:
  var(--tl-space-2xs)`, Scheibe dort `--tl-size-icon-md`. Puls: `@keyframes tl-steps-pulse` (Opazität 1 → 0,4,
  `infinite alternate`); Reduced-Motion regelt `base.css` global. `job-status.css`: Spalte, `gap: var(--tl-space-xs)`;
  Kopf Zeile mit `gap: var(--tl-space-sm)`, `__cancel` `margin-inline-start: auto`. Lint:
  `'tl-steps': new Set(['vertical'])`, `'tl-job-status': new Set([])`. Specimen: `steps.spec.html` (waagrecht und
  senkrecht, je erledigt/aktuell/offen), `job-status.spec.html` (läuft mit Schritten und Balken, gescheitert mit
  Fehler, abgeschlossen), `wizard.spec.html` auf `tl-steps`.
- [ ] **Step 4: Engine.** `TLWizard.tsx`: `ol.tl-steps` statt `tl-wizard__steps`, `li.tl-steps__item`, Scheibe
  `span.tl-steps__disc tl-type-label tl-nums`, Name `span.tl-steps__name …`; Attribute und Link-Knopf bleiben.
  MUI-Vitest `containers.test.tsx` (Wizard) muss unverändert grün bleiben; er prüft `tl-wizard__counter`, der bleibt.
- [ ] **Step 5: Run** Paket `node tools/generate.mjs && node tools/lint-css.mjs && node tools/publish-to-worktree.mjs
  && node --test`; Engine `tsc --noEmit`, MUI-Vitest (`NODE_OPTIONS=--no-experimental-webstorage`) — grün.
- [ ] **Step 6: Commit** Paket „Ticket #29904: Paket -- tl-steps (Wizard liest sie), tl-job-status“; Engine „Ticket
  #29904: The wizard's step list reads tl-steps; design system copy with steps and job status.“

### Task 4: Engine — `useUpload`, `downloadBlob`; Upload-Feld, BinaryField, FileChips, Download

**Files:**
- Create: `com.top_logic.layout.react/react-src/bridge/upload.ts` (`useUpload`), `bridge/download-blob.ts`
  (`downloadBlob`)
- Modify: `react-src/bridge-entry.ts`, `bridge/icons.ts` (`ICON_UPLOAD`, `ICON_DOWNLOAD`, `ICON_FILE`, `ICON_ATTACH`),
  `controls/TLFileUpload.tsx`, `controls/TLBinaryField.tsx`, `controls/TLFileChips.tsx`, `controls/TLDownload.tsx`
- Modify (Java): `com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/form/FileListControl.java`
- Modify: `tlReactControls.css` (Blöcke „TLDownload“, „TLFileChips“ löschen), `design-system/test/ratchet.json`
- Modify: `com.top_logic.layout.react.mui/react-src/adapters/chips.test.tsx:401`; Vitest neu in
  `com.top_logic.layout.react.mui/react-src/adapters/media.test.tsx`

**Interfaces:**
- Produces:
  ```ts
  // bridge/upload.ts
  export interface UploadState { uploading: boolean; error: string | null; }
  export function useUpload(): {
    uploading: boolean;
    error: string | null;            // state.error des Servers, sonst null
    upload: (parts: Array<{ name: string; file: Blob; fileName: string }>) => Promise<void>;
  };
  // bridge/download-blob.ts
  export async function downloadBlob(url: string, fileName: string): Promise<boolean>; // false bei Fehler
  ```
  `useUpload` liest `status` und `error` aus `useTLState()`; `uploading` ist lokal `true` von `upload(...)` bis zum
  Ende des `useTLUpload`-Aufrufs, und ein Server-`status === 'received'` setzt ihn zurück (die eine Statusformel).
  Für FileChips (kein `status`) endet `uploading` mit dem Aufruf. `useTLUpload` bleibt unverändert (Limit,
  `uploadRejected`, Server-Hinweis).
- Glyphen: `ICON_UPLOAD = 'css:fa-solid fa-upload'`, `ICON_DOWNLOAD = 'css:fa-solid fa-download'`,
  `ICON_FILE = 'css:fa-regular fa-file'`, `ICON_ATTACH = 'css:fa-solid fa-paperclip'` (je mit JavaDoc-Kommentar wie die
  Nachbarn).

- [ ] **Step 1: Failing Vitest** `media.test.tsx` (Testregistry ohne Parts: `replacePart` für `Button`, `Chip` mit den
  MUI-Adaptern, Muster `containers.test.tsx:1–30`; `fetch` und `URL.createObjectURL` gestubbt):
  - `useUpload`: `upload` setzt `uploading`, ruft `useTLUpload` mit `FormData` (Teilname und Dateiname wie übergeben);
    Server-`error` erscheint; `status: 'received'` setzt `uploading` zurück.
  - `downloadBlob`: holt die URL, legt einen Anker mit `download=fileName` an, klickt, entfernt ihn, gibt die
    Blob-URL frei; HTTP-Fehler → `false`, kein Anker.
  - TLDownload: leer `div.tl-file[data-tl-state="empty"]` mit `js.download.noFile`; gefüllt `span.tl-file__name`.
  - TLBinaryField lesend ohne Daten: `tl-file` leer; kein `tlDownload`, kein `tlBinaryField` im DOM.
  - TLFileChips: Wurzel `tl-chip-group`; `dragover` setzt `data-tl-state="dragover"`, `dragleave` nimmt es weg; Drop
    mit zwei Dateien sendet beide unter `file`. **Review Focus 3:** während `uploading` sendet ein Drop nichts und
    `dragover` endet; `editable: false` → kein `dragover`, kein Upload. Server-`error` → `role="alert"` mit dem Text.
- [ ] **Step 2: Run** — FAIL.
- [ ] **Step 3: Implement** `useUpload`, `downloadBlob` (Muster: `TLDownload.tsx:27–56`, Blob-URL nach dem Klick
  freigeben), Export in `bridge-entry.ts`. Die vier Controls darauf: TLFileUpload und TLBinaryField verlieren die
  eigene Statusformel und `doUpload`; TLBinaryField und TLDownload zeichnen `tl-file`/`tl-file__name`
  (`data-tl-state` über `stateAttr`), Marker `tlBinaryField`, `tlBinaryField--view` fallen; TLFileChips: Wurzel
  `tl-chip-group` mit `role="group"` und `data-tl-state="dragover"`, die Drop-Handler wie TLFileUpload (mit
  `editable`- und `uploading`-Wächter, alle Dateien), Fehlerzeile `tl-file-upload__status tl-type-label` mit
  `role="alert"` unter der Gruppe; der Hinzufügen-Knopf ohne `className` (Lage nicht nötig), `aria-busy` beim
  Hochladen. FileChips-Download über `downloadBlob(dataUrl + '&key=' + encodeURIComponent(chip.key), chip.name)`.
- [ ] **Step 4: Java.** `FileListControl` setzt im Konstruktor bzw. beim Aufbau
  `putState(UploadSupport.MAX_UPLOAD_SIZE, UploadSupport.maxUploadSize())` (Schlüssel `maxUploadSize`, den
  `useTLUpload` liest) und in `handleUpload` bei `IOException` `putState("error", ex.getMessage())`, bei Erfolg
  `putState("error", null)` — Konstante `ERROR = "error"` mit JavaDoc wie `ReactFileUploadControl`. Die Umwandlung
  `Part` → `BinaryData` über `UploadSupport.toBinaryData(Part)` statt der eigenen Kopie. Test: ist ein `FileListControl`
  mit dem Fixture aus `AbstractTicketFormTest` (Feld einer Binärliste) zu bauen, Test `TestFileListUpload` (Upload mit
  einem `Part`, dessen `getInputStream()` wirft → `error` gesetzt; danach erfolgreicher Upload → `error` null); sonst
  **melden** (NEEDS_CONTEXT), nicht ausweichen.
- [ ] **Step 5: Alt löschen** — Blöcke „TLDownload“ und „TLFileChips“ in `tlReactControls.css`; in `ratchet.json`
  streichen, Literale auf den Messwert (`node tools/inventory.mjs`), Vermerk an `_blocks`. `chips.test.tsx:401` prüft
  den Knopf künftig über seine Rolle und seinen Namen (`js.fileChips.add`), nicht über die Klasse.
- [ ] **Step 6: Run** Vitest (alle), `tsc`, `node --test` im Paket, Maven `install` `layout.view` mit Tests
  (`-DskipTests=false`, nur die neue Testklasse und `TestAll` des Moduls nach Bedarf), `check-messages-en.sh` — grün;
  Messages-Diff committen, Deutsch nachziehen.
- [ ] **Step 7: Commit** Engine „Ticket #29904: One upload hook and one blob download -- file upload, binary field,
  file chips and download share them; file chips announce upload errors and honour the size limit.“; Paket „Ticket
  #29904: Ratsche -- TLDownload, TLFileChips gestrichen“.

### Task 5: Engine — Recorder, Player, Kamera; `TLCounter` gestrichen

**Files:**
- Modify: `react-src/bridge/icons.ts` (`ICON_RECORD`, `ICON_STOP`, `ICON_PLAY`, `ICON_PAUSE`, `ICON_CAMERA`,
  `ICON_MIRROR`), `controls/TLAudioRecorder.tsx`, `controls/TLAudioPlayer.tsx`, `controls/TLPhotoCapture.tsx`,
  `react-src/controls-entry.ts:34,131`
- Delete: `react-src/controls/TLCounter.tsx`
- Modify: `tlReactControls.css` (Blöcke „TLAudioRecorder“, „TLAudioPlayer“, „TLPhotoCapture“, „TLCounter“),
  `com.top_logic.layout.react/src/test/java/test/com/top_logic/layout/react/theme/TestReactStylesheetTokens.java:41`
  (Radius-Ausnahme), `design-system/test/ratchet.json`
- Test: `com.top_logic.layout.react.mui/react-src/adapters/media.test.tsx`

**Interfaces:**
- Consumes: `useUpload` (Task 4); Part `Button` (`checked` → `aria-pressed`, `aria-busy` per Durchreichen,
  `danger`, `display="icon-only"` oder `"icon-label"`, `tooltip`); `useFocusTrap(active, ref, mode, options)`,
  `useStandaloneKeyboardScope(active, bindings)`, `createPortal`, `anchoredOverlayProps` (Muster
  `controls/picker/PickerPopover.tsx`).
- Glyphen: `ICON_RECORD = 'css:fa-solid fa-circle'`, `ICON_STOP = 'css:fa-solid fa-stop'`,
  `ICON_PLAY = 'css:fa-solid fa-play'`, `ICON_PAUSE = 'css:fa-solid fa-pause'`, `ICON_CAMERA = 'css:fa-solid fa-camera'`,
  `ICON_MIRROR = 'css:fa-solid fa-left-right'`.

- [ ] **Step 1: Failing Vitest** in `media.test.tsx` (`navigator.mediaDevices`, `MediaRecorder`, `Audio`,
  `HTMLCanvasElement.toBlob`, `HTMLMediaElement.play` gestubbt):
  - Recorder: `button.tl-button--icon.tl-button--secondary.tl-button--danger`, Name `js.audioRecorder.record`; Klick →
    `aria-pressed="true"`, Tooltip `js.audioRecorder.stop`, Name unverändert; Stopp → Upload unter `audio`
    (`recording.webm`), währenddessen `aria-busy="true"` und `disabled`. **Review Focus 1:** `getUserMedia` wirft →
    nicht gedrückt, `role="alert"` mit `js.audioRecorder.error.denied`. **Review Focus 5:** Unmount während der Aufnahme
    stoppt alle Tracks.
  - Player: Name `js.audioPlayer.play`; Klick → lädt (`aria-busy`), spielt (Name `js.audioPlayer.pause`, kein
    `aria-pressed`); ohne Audio `disabled` mit Tooltip `js.audioPlayer.noAudio`.
  - Kamera: Klick öffnet einen Dialog unter `document.body`: `.tl-dialog > .tl-dialog__surface[role="dialog"][aria-modal="true"]`
    mit `aria-labelledby` auf den Titel `js.photoCapture.open`; Fokus auf „Aufnehmen“ (`tl-button--primary`); Spiegeln
    setzt `aria-pressed` am Knopf und `data-tl-state="mirrored"` am Video; Escape schließt, Fokus zurück am Kamera-Knopf.
    **Review Focus 2:** im `TLWindow` schließt Escape nur den Kamera-Dialog. Fehler `role="alert"`.
- [ ] **Step 2: Run** — FAIL.
- [ ] **Step 3: Recorder und Player** nach Spec §3: je ein Part `Button` icon-only, `secondary`; Recorder `danger`,
  `checked={recording}`, `label` immer `js.audioRecorder.record`, `tooltip` beim Aufnehmen `js.audioRecorder.stop`, Icon
  `ICON_STOP` statt `ICON_RECORD`; Upload über `useUpload` (Teil `audio`, `recording.webm`); Unmount stoppt Recorder und
  Tracks. Player: Icon und Name wechseln (`ICON_PLAY`/`ICON_PAUSE`), `aria-busy` beim Laden, `disabled` ohne Audio,
  `audio.play()`-Promise abgefangen (Fehler → `idle`). Fehlerzeile beider: `tl-file-upload__status tl-type-label` mit
  `role="alert"` (Gerätefehler aus `t[localError]`, Server-`error`). Wurzel jeweils `tl-upload` (Recorder; die Hülle des
  Upload-Vertrags) bzw. ein `span` ohne Klasse (Player).
- [ ] **Step 4: Kamera** nach Spec §4: Kamera-Knopf Part `Button` icon-only `secondary` `ICON_CAMERA`, `aria-busy`
  beim Hochladen; Wurzel `tl-upload`. Dialog per `createPortal(…, document.body)`:
  `div.tl-dialog[data-tl-state="entering"]` (Klick auf den Scrim schließt) mit `anchoredOverlayProps` >
  `div.tl-dialog__surface` (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`) > `div.tl-titlebar` (Titel
  `span.tl-titlebar__title tl-type-heading-sm` mit id, Schließen Part `Button` ghost icon-only `ICON_CLOSE`,
  `js.photoCapture.close`) + `div.tl-dialog__body` (`video.tl-media__frame`, `data-tl-state="mirrored"` beim Spiegeln)
  + `div.tl-button-bar` (Spiegeln `secondary` `icon-label` `ICON_MIRROR` `checked={mirrored}`, Aufnehmen `primary`
  `icon-label` `ICON_CAMERA` `js.photoCapture.capture`). `useFocusTrap(open, surfaceRef, el => <Aufnehmen-Knopf>)`,
  `useStandaloneKeyboardScope(open, { ESCAPE: () => { close(); return true; } })`; Fokus zurück wie
  `PickerPopover` (Mikrotask, Anker). Das Spiegeln zeichnet das Paket (`tl-media__frame[data-tl-state~="mirrored"]`,
  Task 1). Upload über `useUpload` (Teil `photo`, `capture.jpg` bzw. Dateiname des Fallbacks).
- [ ] **Step 5: TLCounter** — Datei, Import und `register` löschen.
- [ ] **Step 6: Alt löschen** — vier Blöcke; `TestReactStylesheetTokens.java:41` ohne die Ausnahme für
  `.tlAudioRecorder__icon--stop` und `.tlPhotoCapture__cameraIcon`; `ratchet.json` streichen, Literale auf den Messwert.
- [ ] **Step 7: Run** Vitest (alle), `tsc`, Paket `node --test`, Maven `test` `layout.react` (`TestReactStylesheetTokens`,
  `TestDesignSystemCopy`), `check-messages-en.sh` — grün.
- [ ] **Step 8: Commit** Engine „Ticket #29904: Recorder, player and camera are part buttons; recording shows as a
  filled red pressed button; the camera opens as a design system dialog; TLCounter removed.“; Paket „Ticket #29904:
  Ratsche -- TLAudioRecorder, TLAudioPlayer, TLPhotoCapture, TLCounter gestrichen“.

### Task 6: Engine — Bild, PDF, HTML

**Files:**
- Modify: `react-src/bridge/icons.ts` (`ICON_PRINT = 'css:fa-solid fa-print'`), `controls/TLImage.tsx`,
  `controls/TLPdfViewer.tsx`, `controls/TLHtml.tsx`
- Modify: `tlReactControls.css` (Blöcke „TLImage“, „TLPdfViewer“, „TLHtml“), `design-system/test/ratchet.json`
- Test: `media.test.tsx`

- [ ] **Step 1: Failing Vitest:**
  - TLImage: Wurzel `tl-media tl-media--cover` (Standard) bzw. `--contain`; `img.tl-media__frame`; ohne Bild
    `div.tl-media__placeholder`; `cssClass` des Servers genau einmal an der Wurzel.
  - TLPdfViewer: mit Dokument `iframe.tl-media__frame` mit Titel `js.pdfViewer.title`; ohne `div.tl-status` mit
    `js.pdfViewer.noDocument`.
  - TLHtml Dokument: Wurzel `tl-overlay tl-overlay--fill` mit Füll-Klasse; `div.tl-overlay__base` mit
    `div.tl-media.tl-media--document` > `iframe.tl-media__frame`; mit `print` eine Ebene
    `div.tl-overlay__layer.tl-overlay__layer--top-right` > `div.tl-overlay__action` > Part `Button` ghost icon-only
    `ICON_PRINT`. Vorschau: `tl-media tl-media--document`, Inline-Größe und `transform` bleiben. Eingebettet: Wurzel
    `tl-prose`. Fehler bleibt `tl-alert`.
- [ ] **Step 2: Run** — FAIL.
- [ ] **Step 3: Implement** nach Spec §5; die doppelte `rootClassName`-Anwendung in TLImage und TLHtml (Server-`cssClass`
  zweimal) entfällt.
- [ ] **Step 4: Alt löschen** — drei Blöcke; `ratchet.json`.
- [ ] **Step 5: Run** Vitest, `tsc`, Paket `node --test`, Maven `test` `layout.view` (`TestHtmlElement`,
  `TestImageElement`, `TestOverlayElement`) — grün.
- [ ] **Step 6: Commit** Engine „Ticket #29904: Image, PDF and HTML read the design system package -- tl-media,
  document surface, print button over the document, embedded HTML as tl-prose.“; Paket „Ticket #29904: Ratsche --
  TLImage, TLPdfViewer, TLHtml gestrichen“.

### Task 7: Engine — JobStatus

**Files:**
- Modify: `react-src/controls/TLJobStatus.tsx`, `com.top_logic.layout.react/src/main/java/com/top_logic/layout/react/I18NConstants.java`,
  `src/main/java/META-INF/messages_de.properties`
- Modify: `tlReactControls.css` (Block „TLJobStatus (what a long-running job reports)“), `design-system/test/ratchet.json`
- Modify: `com.top_logic.layout.react.mui/react-src/adapters/busy-indicators.test.tsx:89`
- Test: `media.test.tsx`

**Interfaces:**
- Neue i18n: `JS_JOB_STATUS_CURRENT_STEP` „Step: {0}“ (deutsch „Schritt: {0}“) — der unsichtbare Präfix der Live-Zeile.

- [ ] **Step 1: Failing Vitest:**
  - Wurzel `div.tl-job-status` ohne `role` und ohne `aria-live`; genau ein Element `role="status"`
    (`tl-job-status__live`), das Zustand, Name des aktuellen Schritts und Meldung enthält; **Review Focus 4:** die
    Laufzeit (`tl-job-status__elapsed tl-nums`) liegt nicht in einem Element mit `role="status"` oder `aria-live`; ein
    neuer Zustand mit anderem aktivem Schritt ändert den Text der Live-Zeile.
  - Schritte `ol.tl-steps.tl-steps--vertical`, erledigt `data-tl-state="done"`, aktiv `aria-current="step"`.
  - `error` → `div.tl-job-status__error[role="alert"]` außerhalb der Live-Zeile.
  - Balken: `div.tl-job-status__bar` um das Part `ProgressBar` (ohne `className` am Part).
- [ ] **Step 2: Run** — FAIL.
- [ ] **Step 3: Implement** nach Spec §7. Phasen-Status `done`/`active`/`pending` auf die Attribute abbilden; Scheibe
  mit Nummer (`tl-type-label tl-nums`, `aria-hidden`).
- [ ] **Step 4: Alt löschen** — Block, `ratchet.json`; `busy-indicators.test.tsx:89` prüft `.tl-job-status__bar`.
- [ ] **Step 5: Run** Vitest, `tsc`, Paket `node --test`, Maven `test` `layout.react` (`TestReactJobStatusControl`),
  `layout.view` (`TestJobStatusElement`), `check-messages-en.sh` — grün; Messages-Diff committen, Deutsch nachziehen.
- [ ] **Step 6: Commit** Engine „Ticket #29904: The job status reads tl-steps and tl-job-status -- one live line for
  state and current step, the elapsed time outside it, errors as alert.“; Paket „Ticket #29904: Ratsche -- TLJobStatus
  gestrichen“.

### Task 8: Gates gesamt, altlast

**Files:**
- Modify: `design-system/test/engine-classes.test.mjs` (anfügen), `design-system/test/ratchet.json`
- Modify: `docs/migration/altlast.md` (Abschnitt „## Welle 5b · Medien — gebaut <Datum>“ vor „## Welle 5a · Eingaben“
  oder direkt danach, wie die Reihenfolge der Datei es vorgibt)

- [ ] **Step 1: Engine-Gate** — Test `keine alte Klasse der Welle 5b in react-src, Stylesheets, Java, tl-docs und Views`
  nach dem Muster von `ALT_5A` mit
  `const ALT_5B = /\btl(AudioRecorder|AudioPlayer|PhotoCapture|Download|FileChips|Image|PdfViewer|Html|JobStatus|Counter|BinaryField)(__|--|\b)|\bTLCounter\b|\btl-wizard__(steps|step-item|disc|step-name)\b/;`
  über dieselben Quellen wie `ALT_5A`. Vorher prüfen, dass `TLImage`/`TLHtml` als Control-Namen (`register('TLImage', …)`)
  nicht treffen (`\btl` ist klein geschrieben; `TLCounter` bewusst groß). Und `Welle 5b im TSX`: in `TLAudioRecorder.tsx`,
  `TLAudioPlayer.tsx`, `TLPhotoCapture.tsx`, `TLHtml.tsx` kein `css:bi ` und kein `<svg`; `TLPhotoCapture.tsx` enthält
  `tl-dialog__surface` und `createPortal`; kein `aria-label="[A-Za-z]` in den Controls der Welle.
- [ ] **Step 2: Ratsche** — `node tools/inventory.mjs`; Budgets = Messwert; ein Vermerk „<Datum> Welle 5b (#29904):
  zehn Blöcke gestrichen … lines = <n>.“ (nur, was die Vermerke der Tasks 4–7 nicht schon sagen).
- [ ] **Step 3: Paket-Gates** `node tools/generate.mjs && node tools/lint-css.mjs && node tools/publish-to-worktree.mjs
  && node --test` — alles grün.
- [ ] **Step 4: Maven und Messages** (JDK 21) — `install` für `layout.react`, `layout.view`, `layout.configedit`; `test`
  für `layout.react`, `layout.view`, `layout.configedit`, `demo.react`; danach `check-messages-en.sh` ohne Diff. Fehlt
  ein Artefakt offline (Abhängigkeiten aus master), einmal online `mvn -B -q dependency:resolve -pl <Modul>`.
- [ ] **Step 5: `altlast.md`** — „Gestrichene Blöcke“, „Neu im Paket“ (`tl-media`, `tl-prose`, `tl-file`, `tl-steps`,
  `tl-job-status`, `surface-document`, `tl-overlay--fill`/`__action`, gedrückt in `danger`; Hooks `useUpload`,
  `downloadBlob`; Glyphen-Konstanten), „Alt → neu für Anwendungs-Stylesheets“:

| Alt | Neu |
|---|---|
| `.tlAudioRecorder`, `__button`, `--recording`, `--uploading`, `__icon` | `.tl-upload` mit Part `Button` (`tl-button--danger`, `[aria-pressed="true"]`, `[aria-busy="true"]`) |
| `.tlAudioPlayer`, `__button`, `--playing`, `--loading` | Part `Button` (`[aria-busy="true"]`) |
| `.tlPhotoCapture`, `__cameraBtn`, `__overlayContent`, `__overlayVideo--mirrored`, `__overlayToolbar` | `.tl-upload`, `.tl-dialog__surface`, `.tl-media__frame[data-tl-state~="mirrored"]`, `.tl-button-bar` |
| `.tlAudioRecorder__status--error`, `.tlPhotoCapture__status--error` | `.tl-file-upload__status[role="alert"]` |
| `.tlDownload`, `--empty`, `__fileName`, `__fileName--empty` | `.tl-file`, `[data-tl-state~="empty"]`, `.tl-file__name` |
| `.tlFileChips`, `--dragover`, `__add--uploading` | `.tl-chip-group`, `[data-tl-state~="dragover"]`, `[aria-busy="true"]` |
| `.tlImage`, `--fit-cover`, `--fit-contain`, `__image`, `__placeholder` | `.tl-media`, `--cover`, `--contain`, `__frame`, `__placeholder` |
| `.tlPdfViewer`, `__frame`, `__placeholder` | `.tl-media`, `__frame`, `.tl-status` |
| `.tlHtml--document`, `__frame`, `__print`, `--thumbnail`, `__page`, `--inline` | `.tl-overlay--fill`, `.tl-media--document`, `.tl-overlay__action`, `.tl-media__frame`, `.tl-prose` |
| `.tlJobStatus`, `__header`, `__phases`, `__phase--done/active/pending`, `__bar`, `__error` | `.tl-job-status`, `__header`, `.tl-steps--vertical`, `[data-tl-state~="done"]` / `[aria-current="step"]`, `__bar`, `__error[role="alert"]` |
| `.tl-wizard__steps`, `__step-item`, `__disc`, `__step-name` | `.tl-steps`, `__item`, `__disc`, `__name` |
| `.tlCounter*`, `TLCounter` | — (gestrichen) |

- [ ] **Step 6: Commit** Paket „Ticket #29904: Ratsche und Engine-Gate Welle 5b; altlast Welle 5b“; Engine (nur bei
  Messages-Diff) englisch.

### Task 9: Sichtprüfung lokal (Orchestrator)

- [ ] Demo `tl-demo-react` wie Memory „Lokale Demo statt Docker“, hell und dunkel, beide Dichten: FileChips im
  Kommentar-Formular eines Tickets (Datei ziehen, hochladen, herunterladen), Binärfeld lesend in „PDF“, Bilder
  („images“), PDF und HTML-Dokument mit Druckknopf („pdf“, „HTML-Inhalte“), eingebettetes HTML, Job („long-job“),
  Wizard. **Recorder, Player, Kamera und TLDownload haben keine Demo-Ansicht** (kein View-Element) — geprüft über die
  Specimen-Seiten (`button`, `file`, `media`, `overlay`) und die Vitests; Befund in `altlast.md` vermerken. Befunde in
  `altlast.md` „Welle 5b“, Korrekturen als eigene Commits; was sicher in den UI-Durchgang gehört, nach
  `docs/ui-durchgang.md`.

### Task 10: Abschluss (Orchestrator)

- [ ] Trac #29904: Solution, `== Migration ==` (Spec §11 und die Tabelle aus Task 8) und `RequiresMigration`;
  `skalen.md` („Beim Bauen entschieden“), Präsentation, STATUS nachziehen; Hendrik melden. **Kein Push** — Welle 5 kommt
  als ein PR nach 5d.
