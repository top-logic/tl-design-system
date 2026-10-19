# Welle 5b · Medien — Design

**Ticket:** Trac #29904 · **Branch:** `CWS/CWS_29904_design_system_welle_5b` auf `CWS/CWS_29875_design_system_welle_5a`
(der auf dem 4c-Branch von !1911 steht) · **Grundlage:** Prognose in `docs/migration/altlast.md` „Welle 5“ (V2, V3, V4,
V10, V14, V18; von Hendrik am 17.10. entschieden), dazu V22 (neu, 19.10. entschieden: zusammenlegen) ·
**Freigegeben:** 19.10.2026 von Hendrik, abschnittsweise, mit den Entscheidungen aus §12.

## 1 · Ziel und Abgrenzung

Die Medien-Controls lesen das Paket; ihre Blöcke fallen aus `tlReactControls.css`:

| Block (Ratsche) | Zeilen | Control |
|---|---|---|
| TLAudioRecorder | 114 | `TLAudioRecorder.tsx` |
| TLAudioPlayer | 98 | `TLAudioPlayer.tsx` |
| TLPhotoCapture | 224 | `TLPhotoCapture.tsx` (mit Kamera-Overlay) |
| TLDownload | 29 | `TLDownload.tsx`, **`TLBinaryField.tsx`** (nutzt `tlDownload*`) |
| TLFileChips | 21 | `TLFileChips.tsx` |
| TLImage | 32 | `TLImage.tsx` |
| TLPdfViewer | 26 | `TLPdfViewer.tsx` |
| TLHtml | 174 | `TLHtml.tsx` (Dokument, Vorschau, eingebettet, Fehler) |
| TLJobStatus (what a long-running job reports) | 107 | `TLJobStatus.tsx` |
| TLCounter | 56 | `TLCounter.tsx` — **gestrichen** (V18) |

Zusammen 881 Zeilen. Alle TSX unter `com.top_logic.layout.react/react-src/controls/`.

**BinaryField gehört dazu,** obwohl die Prognose ihn nicht nennt: er trägt `tlDownload`, `tlDownload--empty`,
`tlDownload__fileName(--empty)` (`TLBinaryField.tsx:135–154`); ohne ihn bleibt der Block TLDownload stehen.

**Hendrik, 19.10.: kein neues Bedienkonzept.** Nutzung der Medien-Controls ist unbekannt (keine Metriken, selbst
ungenutzt). 5b zieht sie ins Paket, legt Gleiches zusammen und schließt die Lücken in Fokus, Ansage und Bewegung.
Was sicher neu gestaltet werden muss, steht in `docs/ui-durchgang.md` (U2 Medien-Controls, U7 moderner Medien-Player).

**Java ändert sich nur, wo ein Zustand fehlt:** `FileListControl` (`layout.view`, Leser `TLFileChips`) bekommt die
Upload-Zustände der übrigen Upload-Controls — `error` (Text des gescheiterten Hochladens, heute nur geloggt) und
`maxSize` über `UploadSupport` (§6). Sonst bleiben Zustände, Befehle, Upload-Kanal und Teilnamen (`audio`, `photo`,
`file`). Neue i18n-Schlüssel entstehen über JavaDoc, `messages_en` wird erzeugt; der Dialogtitel der Kamera nutzt
`js.photoCapture.open`.

**Außerhalb des Pakets nachzuziehen:** die MUI-Tests `busy-indicators.test.tsx` (sucht `.tlJobStatus__bar`) und
`chips.test.tsx` (sucht `tlFileChips__add`) prüfen künftig die neuen Klassen bzw. Rollen. `TestReactStylesheetTokens`
(`layout.react`) verliert die Radius-Ausnahme für `.tlAudioRecorder__icon--stop` und `.tlPhotoCapture__cameraIcon`.

**Nicht in 5b:** neue Bedienformen (Scrubber, Dauer, Lautstärke, Vorschau vor dem Hochladen, Aufnahmedauer, Video-
Player) — U2/U7; eine eigene Form für Medienknöpfe; die Java-Statusverwaltung (`putState(STATUS, …)` steht dreimal
gleich, bleibt).

## 2 · Wie die Welle geliefert wird

**Welle 5 kommt als ein PR** (Hendrik 17.10.): 5b baut auf dem 5a-Branch, gepusht wird erst nach 5d mit Freigabe. Das
Paket entsteht auf `main` von `TopLogic/tl-design-system` und wird mit `tools/publish-to-worktree.mjs` in den Worktree
kopiert (versiegelt). Commits tragen `Ticket #29904:`. Subagenten committen lokal.

## 3 · Knöpfe und Icons (V2, V14)

Recorder, Player und Kamera zeichnen heute eigene runde Knöpfe (2,5 rem) mit eigenem Fokus (`inset`-Schatten,
`outline:none`), Icons aus `border`/`background`, der Player grün beim Spielen (`#198038`, `#42be65`, `#24a148`).

Künftig ist jeder ein **Part `Button`, icon-only** (`tl-button--icon`, quadratisch, `size-control`):

| Control | Erscheinung | Icon | Zustände |
|---|---|---|---|
| Recorder | `secondary`, Tönung `danger` | record → stop | Aufnahme läuft: `aria-pressed="true"` (Umschaltknopf nach ARIA: der Name bleibt `js.audioRecorder.record`, der Tooltip sagt `js.audioRecorder.stop`), Icon stop; Upload: `aria-busy="true"` (der Knopf ist `disabled`) |
| Player | `secondary` | play → pause | spielt: Icon pause, Name `js.audioPlayer.pause`; lädt: `aria-busy="true"`; ohne Audio `disabled` mit Tooltip `js.audioPlayer.noAudio` |
| Kamera | `secondary` | camera | Upload: `aria-busy="true"` |

- **Icons** über `ThemeIcon` mit Font-Awesome-Glyphen (record, stop, play, pause, camera, Spiegeln), als Konstanten in
  `bridge/icons.ts` wie die übrigen (die Datei hält die Bibliothek an einer Stelle, `docs/ui-durchgang.md` „Icon-
  Bibliothek“).
- **Fokus** nur aus `base.css`.
- **Gedrückt in Tönung `danger`:** heute gewinnt `.tl-button[aria-pressed="true"]` (Marken-Fläche) gegen die Tönung —
  ein aufnehmender Recorder würde blau. Das Paket bekommt `tl-button--danger[aria-pressed="true"]`: Fläche
  `status-error-subtle`, Rahmen `status-error-border`, Text/Icon `status-error-text` (Paar im Gate).
- **Bewegung:** Ripple (Recorder), Wackeln (Recorder, Kamera) und Kreisen (Player) fallen; Laden und Hochladen zeigt
  das Pulsieren des Icons, das `tl-button[aria-busy]` schon hat (Opazität 1 ↔ 0,4, `duration-loop`, Reduced-Motion aus
  `base.css`). **„Aufnahme läuft“** zeigt der gedrückte Recorder in roter Fläche mit Stopp-Icon — §12 Frage A.

## 4 · Kamera-Overlay und Knopf über Fläche (V2, V10)

**Kamera:** heute ein eigener Kasten im Scrim (`tlPhotoCapture__overlayContent`, kein `tl-dialog__surface`), drei
Knöpfe über dem Video mit `rgba`-Literalen und Inline-SVG. Fokusfalle und Escape funktionieren schon.

Künftig ein **Paket-Dialog** nach `dialog.contract.md`:

- Scrim `tl-dialog`, Fläche `tl-dialog__surface` (`role="dialog"`, `aria-modal`, `aria-labelledby` auf den Titel),
  Titelleiste `tl-titlebar` mit Titel `js.photoCapture.open` und Schließen-Knopf (`js.photoCapture.close`) wie in jedem
  Dialog.
- Körper: das Video als `tl-media__frame` (§5), so groß, wie die Fläche erlaubt; Spiegeln ist ein Zustand
  `data-tl-state~="mirrored"` am Video.
- Fuß: `tl-button-bar` — „Spiegeln“ `secondary` mit Icon und Label, `aria-pressed`; „Aufnehmen“ `primary` mit Icon und
  Label (`js.photoCapture.capture`). Der Startfokus liegt nach Dialogvertrag auf dem primären Knopf: Enter löst aus.
- Verhalten wie im Dialogvertrag: Escape, Klick auf den Scrim, Tab bleibt in der Fläche, Fokus zurück zum
  Kamera-Knopf. Der Dialog ist rein clientseitig; er nutzt **die Hooks, die er heute schon nutzt**
  (`useFocusTrap`, `useStandaloneKeyboardScope` — wie die Picker in 5a, Escape im Dispatcher, ein Popup in einem
  Server-Dialog schließt zuerst) und das Markup des Pakets, nicht `TLDialogManager`/`TLWindow` (die verwalten
  Server-Dialoge). Er wird per Portal an `body` gehängt wie die übrigen Popups. Einblenden über
  `data-tl-state~="entering"` beim Einhängen; Ausblenden darf fehlen (Bewegung rudimentär, U6).
- Der Fallback ohne `getUserMedia` (`input type="file" capture`) bleibt.

**Knopf über Fläche:** der Druckknopf des HTML-Dokuments sitzt heute in einer eigenen Hülle (`--layer-01`,
`--shadow-raised`); 5c braucht dasselbe für den Ausblenden-Knopf der Dashboard-Kachel.

Künftig **im Paket als Teil von `tl-overlay`:** das Dokument ist die Basis (`tl-overlay__base`), der Knopf liegt in
einer Ebene `tl-overlay__layer--top-right`; um ihn das neue Teil **`tl-overlay__action`** — Fläche `surface-overlay`,
Ecke und Schatten aus den Popover-Tokens, kleiner Innenabstand —, darin ein Part `Button` `ghost`, icon-only. Die Fläche
ist nötig, weil das Dokument in beiden Modi weiß ist (§5); ohne sie stünde im Dunkelmodus helle Schrift auf Weiß.

`tl-overlay` ist heute `inline-block` und nimmt die Höhe der Basis; das HTML-Dokument füllt aber seinen Platz
(`useFill`). Das Paket bekommt die Variante **`tl-overlay--fill`** (Block, füllt den Behälter, die Basis füllt das
Overlay) und eine Regel für `tl-overlay__base` (heute im Vertrag, ohne CSS). 5c nutzt beides für die Kachel.

## 5 · Anzeige: Bild, PDF, HTML

Ein Block **`tl-media`** für eingebettete Inhalte (Bild, PDF, HTML-Dokument und -Vorschau, Kamera-Video):

- `tl-media` an der Wurzel; `tl-media__frame` am `img`, `iframe` oder `video`; Ecke `radius-sm`.
- Einpassung als Variante `tl-media--cover` / `tl-media--contain` (heute `tlImage--fit-*`). Größe weiter inline vom
  Server.
- Reservierter Platz ohne Bild: ein leeres Element `tl-media__placeholder` (heute `tlImage__placeholder`).
- Platzhalter mit Text (PDF ohne Dokument, `js.pdfViewer.noDocument`): eine `tl-status`-Zeile (leer).
- Die PDF-Ansicht füllt (`useFill` bleibt).

**Neue Rolle `surface-document`:** das Papier hinter fremdem HTML (Dokument und Vorschau), in beiden Modi weiß — fremde
Dokumente setzen Weiß voraus. Kein Textpaar: der Inhalt kommt nicht vom Paket. Ersetzt die zwei `#ffffff`.

**Neuer Block `tl-prose`** für Fließtext vom Server (`TLHtml` eingebettet, heute ~150 Zeilen `.tlHtml--inline …`).
Keine eigenen Größen, nur Typo-Tokens und Rollen:

| Element | Form |
|---|---|
| `h1` / `h2` / `h3`–`h6` | `heading-lg` / `heading-md` / `heading-sm` |
| `p`, `ul`, `ol`, `li` | `body`; Abstände aus der Space-Skala |
| `a` | `text-link`, `text-link-hover` |
| `code`, `pre` | Typo `code`, leicht abgesetzte Fläche |
| `table`, `th`, `td`, `blockquote` | Linie `border-separator` |

5d kann `tl-prose` für die Anzeige des Wysiwyg-Inhalts wiederverwenden.

Der Fehlermodus von `TLHtml` ist schon `tl-alert` mit `role="alert"` und bleibt.

## 6 · Dateien und gemeinsame Technik (V3, V4)

**Technik:**

1. **Hook `useUpload`** in `bridge/`: nimmt Datei oder Blob mit Teilname und Dateiname, baut `FormData`, ruft den
   Upload-Kanal (über `useTLUpload`, der Größenlimit und Ablehnung schon kennt), hält den lokalen Status (bereit /
   lädt hoch) gegen den Server-Status `received` und gibt die Fehlermeldung zurück. Nutzer: `TLFileUpload`,
   `TLBinaryField`, `TLFileChips`, `TLAudioRecorder`, `TLPhotoCapture`. Die Statusformel (heute dreimal, in
   `TLFileUpload` tot) steht danach einmal.
2. **Funktion `downloadBlob(url, fileName)`** in `bridge/` für `TLDownload`, `TLBinaryField`, `TLFileChips` (heute drei
   Kopien desselben Anker-Schnipsels). `bridge/download.ts` (SSE, Navigation ohne Blob) bleibt, wie es ist. Der Player
   holt seine Daten weiter selbst — er spielt ab, er speichert nicht.
3. **Ein Drop-Weg:** `TLFileChips` nutzt dieselben Drop-Handler wie das Upload-Feld; Ziehen heißt überall
   `data-tl-state~="dragover"` mit der gestrichelten Linie aus `upload.contract.md`. FileChips bleibt `tl-chip-group`;
   das Paket gibt `tl-chip-group[data-tl-state~="dragover"]` dieselbe Regel wie `tl-file-upload` (eine Regel, zwei
   Selektoren). `tlFileChips__add--uploading` (Zeiger „progress“) übernimmt `tl-button[aria-busy]`.

**Darstellung:**

4. **Dateizeile `tl-file`** für `TLDownload` und `TLBinaryField`: `tl-file__name` mit Ellipse und Höchstbreite, die Knöpfe
   daneben (Part `Button`, schon heute). Leer: `data-tl-state~="empty"` an `tl-file`, Text `text-secondary`, nicht
   kursiv (heute Deaktiviert-Farbe, verfehlt den Kontrast für lesbaren Text).
5. **Upload-Fehler** in Recorder, Foto und FileChips in derselben Zeile wie beim Upload-Feld:
   `tl-file-upload__status` mit `role="alert"`. Ebenso die Gerätefehler von Recorder und Foto (`…error.denied`,
   `…error.insecure`).
6. **Upload-Vertrag:** `TLFileChips`, `TLAudioRecorder`, `TLPhotoCapture` als Leser, mit ihren Teilnamen.
7. **`FileListControl` (Java):** setzt `error`, wenn `handleUpload` scheitert (heute nur geloggt), und `maxSize` über
   `UploadSupport` wie `ReactFileUploadControl`; der Fehler gilt bis zum nächsten erfolgreichen Hochladen. Einen Status
   `received` braucht FileChips nicht — die neue Chip-Liste ist die Bestätigung; `useUpload` setzt dort beim Eintreffen
   der neuen `chips` zurück. Test in `layout.view`.

## 7 · Schritte und JobStatus (V4, V22)

**V22 (neu, Hendrik 19.10.: zusammenlegen):** Die Phasen des JobStatus (Punkt, senkrecht, Klassen `--done`/`--active`/
`--pending`) und die Schrittliste des Wizards aus 4c (Scheibe mit Nummer, waagrecht, `data-tl-state~="done"`,
`aria-current="step"`) sind dasselbe Muster.

Künftig ein Block **`tl-steps`** im Paket: `tl-steps` (`ol`), `tl-steps__item`, `tl-steps__disc`, `tl-steps__name`;
erledigt `data-tl-state~="done"`, aktuell `aria-current="step"`, offen ohne Attribut; Ausrichtung waagrecht (Standard,
Wizard) oder `tl-steps--vertical` (JobStatus). Der Wizard liest ihn statt `tl-wizard__steps`, `__step-item`, `__disc`,
`__step-name` — Bild und Bedienung des Wizards bleiben gleich.

**Ein Aussehen für beide:** die Scheibe des Wizards mit Nummer, erledigt `surface-brand-subtle`, aktuell
`surface-brand`, offen umrandet. Die Ausrichtung ändert nur die Anordnung, nicht die Farben — sonst wären es wieder zwei
Formen. Damit fällt das Grün der erledigten Phasen (Vorschlag aus der Besprechung, §7 vor der Zusammenlegung), §12 Nr. 6.

**JobStatus** als Block **`tl-job-status`**:

- Kopf: Zustand `body-strong`, Laufzeit in Ziffern fester Breite (`tl-nums`), Abbrechen (Part `Button`, schon heute) am
  Ende.
- **Live-Bereich nur für Text, der etwas sagt:** heute liegt die ganze Wurzel in `role="status"` `aria-live="polite"`,
  und die Laufzeit ändert sich jede Sekunde — ein Screenreader kann sie im Sekundentakt ansagen. Künftig trägt nur eine
  Zeile `role="status"`: Zustand und Name des aktuellen Schritts (die Schrittzeile sichtbar, der Präfix „Schritt“ als
  `tl-visually-hidden`), dazu die Meldung. Laufzeit, Schrittliste und Balken liegen außerhalb. So wird ein
  Schrittwechsel als Text angesagt (G4); `aria-current="step"` in der Liste sagt die Lage beim Durchwandern.
- Schritte als `tl-steps tl-steps--vertical`. Das Pulsieren der Scheibe des aktuellen Schritts bleibt, Dauer und Kurve
  aus Tokens, bei `prefers-reduced-motion` aus (wie heute).
- Balken: Part `ProgressBar` (schon heute). Meldung `text-secondary`.
- **Fehler als eigene Zeile mit `role="alert"`**, außerhalb der `status`-Zeile — heute im höflichen Live-Bereich ohne
  Rolle.

## 8 · Bedien-Gewinne

- **G1** Jeder Fehler beim Aufnehmen, Fotografieren und Hochladen und das Scheitern eines Jobs wird sofort angesagt.
- **G2** Foto: Enter löst aus, Escape schließt, der Fokus kehrt zum Kamera-Knopf zurück; keine Knöpfe mehr auf dem Bild.
- **G3** Eine Datei ziehen sieht überall gleich aus.
- **G4** Der JobStatus sagt den aktuellen Schritt an.
- **G5** Ein Fokusring, Icons wachsen mit der Schrift.

Mehr nicht — der Rest gehört in den UI-Durchgang (U2, U7).

## 9 · Gates

- **Klassen (Lint):** kennt `tl-media`, `tl-prose`, `tl-file`, `tl-steps`, `tl-job-status`, `tl-overlay__action`;
  keine Zustandsklasse (`--recording`, `--uploading`, `--playing`, `--loading`, `--dragover`, `--empty`, `--done`,
  `--active`, `--pending`, `--mirrored`); keine Literale; kein `outline: none`.
- **Kontrast:** `tl-steps` erbt die Paare der Wizard-Scheibe; der Knopf in `tl-overlay__action` auf `surface-overlay`;
  Recorder `danger` als Icon-Knopf, gedrückt (`status-error-text` auf `status-error-subtle`, Rahmen
  `status-error-border` gegen die Umgebung); `tl-prose`-Link
  und Code-Fläche; `tl-file` leer in `text-secondary`. `surface-document` steht als Fläche ohne Textpaar im Gate
  ausgewiesen. Beide Modi, jedes Theme.
- **`focus-clip.test.mjs`** misst die neuen Specimen-Seiten (Dialog mit Video, Overlay mit Knopf, Dateizeile, Schritte).
- **Verträge:** `media`, `prose`, `file`, `steps`, `job-status` neu; `upload` (Leser, Teilnamen), `overlay` (`__action`,
  `--fill`, `__base`), `wizard` (liest `tl-steps`), `dialog` (Leser Kamera, clientseitig), `button` (gedrückt in
  `danger`, Leser Medienknöpfe) nachgezogen.
- **Vitest (MUI-Modul):** `useUpload` (Status, Fehler, `received` setzt zurück), `downloadBlob`; Recorder
  (`aria-pressed`, `aria-busy`, Fehler `role="alert"`), Player (Name wechselt, `aria-busy`), Foto (Dialog öffnet mit
  Fokus auf „Aufnehmen“, Escape schließt, Fokus zurück); Ablegen auf FileChips setzt `dragover` und lädt hoch, ein
  `error` vom Server erscheint mit `role="alert"`; JobStatus (`aria-current`, Laufzeit außerhalb der `status`-Zeile,
  Schrittwechsel ändert deren Text, Fehler `role="alert"`); Wizard unverändert; MUI-Tests `busy-indicators`, `chips`
  nachgezogen.
- **Java (`layout.view`):** `FileListControl` setzt `error` bei gescheitertem Hochladen und `maxSize`.
- **Ratsche:** die zehn Blöcke gestrichen; `TestReactStylesheetTokens` ohne die Radius-Ausnahme.
- **Engine:** `engine-classes.test.mjs` (`ALT_5B`) meldet `tlAudioRecorder`, `tlAudioPlayer`, `tlPhotoCapture`,
  `tlDownload`, `tlFileChips`, `tlImage`, `tlPdfViewer`, `tlHtml`, `tlJobStatus`, `tlCounter` und `TLCounter` in
  `react-src` jedes Moduls, im alten Stylesheet, in Java, Views, tl-docs und der Demo. Modul-Tests `layout.react`,
  `layout.view`, `layout.configedit`, `demo.react` grün; MUI-Vitest grün; `tsc` 0; Vite grün; `check-messages-en.sh`
  ohne Diff; `published.test.mjs` und `TestDesignSystemCopy` grün.

## 10 · Reihenfolge mit Fertig-Bedingungen

1. **Paket: Anzeige und Knopf.** `tl-media`, `surface-document`, `tl-prose`, `tl-overlay__action`, `tl-overlay--fill`,
   `tl-button--danger[aria-pressed]`. Fertig: Specimen hell und
   dunkel, beide Dichten; Kontrast und Lint grün.
2. **Paket: Dateien und Schritte.** `tl-file`, `dragover` an `tl-chip-group`, `tl-steps` (Wizard im Paket umgestellt),
   `tl-job-status`. Fertig: Specimen und Verträge, `focus-clip` grün.
3. **Engine: Technik.** `useUpload`, `downloadBlob`; `TLFileUpload`, `TLBinaryField`, `TLFileChips`, `TLDownload` darauf;
   `FileListControl` mit `error` und `maxSize`.
   Fertig: Blöcke TLDownload und TLFileChips leer, Vitest.
4. **Engine: Aufnahme und Wiedergabe.** Recorder, Player, Foto mit Dialog; `TLCounter` gestrichen. Fertig: Blöcke
   TLAudioRecorder, TLAudioPlayer, TLPhotoCapture, TLCounter leer; Radius-Ausnahme weg.
5. **Engine: Anzeige.** Image, PdfViewer, HTML. Fertig: Blöcke TLImage, TLPdfViewer, TLHtml leer.
6. **Engine: Schritte.** JobStatus und Wizard auf `tl-steps`. Fertig: Block TLJobStatus leer, Wizard unverändert
   bedienbar, MUI-Tests grün.
7. **Gates gesamt** nach §9, i18n mit `check-messages-en.sh`.
8. **Sichtprüfung lokal** (`tl-demo-react`, hell und dunkel, beide Dichten): aufnehmen und abspielen, Foto (Mikrofon
   und Kamera gehen auf `localhost`), Datei auf FileChips ziehen, herunterladen, Bild, PDF, HTML-Dokument mit
   Druckknopf und eingebettetes HTML, ein laufender Job, Wizard.
9. **Lokal committen, melden.** Kein Push (Welle 5 als ein PR nach 5d). Trac #29904 bekommt Solution,
   `== Migration ==` und `RequiresMigration`.

Vor dem Start: Plan-Review durch einen frischen Agenten gegen die Gates (CLAUDE.md), dann SDD.

## 11 · Was das für die Anwendungen heißt

Steht im Trac-Text unter `== Migration ==` und als Alt→neu-Liste in `altlast.md`:

- Die Klassen `tlAudioRecorder*`, `tlAudioPlayer*`, `tlPhotoCapture*`, `tlDownload*`, `tlFileChips*`, `tlImage*`,
  `tlPdfViewer*`, `tlHtml*`, `tlJobStatus*`, `tlCounter*` gibt es nicht mehr; das Control `TLCounter` ebenso. Die
  Wizard-Klassen `tl-wizard__steps`, `__step-item`, `__disc`, `__step-name` werden zu `tl-steps*`.
- Sichtbar: Medienknöpfe quadratisch 32 statt rund 40 px, Icons aus dem Icon-System, ein Fokusring; der Player wird beim
  Spielen nicht mehr grün; die Kamera öffnet als Dialog mit Titel und Knopfleiste statt Knöpfen auf dem Bild;
  Überschriften im eingebetteten HTML folgen der Typo-Skala; „Keine Datei“ nicht mehr kursiv; die Phasen des
  JobStatus als Schrittliste wie im Wizard; Fehler werden angesagt.

## 12 · Offen und entschieden

Mit Hendrik entschieden (19.10., abschnittsweise): Umfang mit BinaryField (§1); Part-Knöpfe quadratisch (§3; Pulsieren für „Aufnahme läuft“:
Frage A unten); Kamera als Paket-Dialog, `tl-overlay__action` (§4); `tl-media`, `surface-document`,
`tl-prose` (§5); `useUpload`, `downloadBlob`, `tl-file`, ein Drop-Weg (§6); V22 `tl-steps` (§7).

Beim Schreiben entschieden (Orchestrator, Hendrik prüft beim Lesen):

1. **Recorder `secondary` mit Tönung `danger`,** nicht `primary` — der rote Punkt bleibt rot, der Knopf drängt sich in
   einem Formular nicht vor.
2. **Player ohne `aria-pressed`:** Play/Pause wechselt Icon und Namen; ein gedrückter Zustand wäre eine zweite Ansage
   desselben.
3. **Dialogtitel der Kamera** aus `js.photoCapture.open` — kein neuer Schlüssel.
4. **Teilnamen des Uploads bleiben** (`audio`, `photo`, `file`), obwohl der Vertrag `file` nennt — die Java-Seite bleibt
   unverändert; der Vertrag nennt die Teilnamen je Leser.
5. **`tl-steps` waagrecht als Standard,** senkrecht als Variante — der Wizard ist der ältere Leser, sein Markup ändert nur
   die Klassen.
6. **Ein Aussehen für `tl-steps`** (Builder-Prüfung): die Wizard-Scheibe mit Nummer in beiden Ausrichtungen; das Grün
   für erledigte Phasen fällt. Kostet: der JobStatus zeigt Nummern statt Punkten.
7. **Kamera-Dialog clientseitig** mit Paket-Markup und den vorhandenen Hooks, nicht über `TLDialogManager` — der
   verwaltet Server-Dialoge; das Verhalten (Fokus, Escape) teilen beide schon über die Hooks. Kostet: das Ausblenden
   fehlt (Einblenden reicht, U6).
8. **Live-Bereich des JobStatus** auf eine Textzeile verkleinert — die sekündlich tickende Laufzeit wird nicht mehr
   angesagt, ein Schrittwechsel schon.
9. **`FileListControl` bekommt `error` und `maxSize`** (fehlender Zustand, Abschnitt 1 der Besprechung: Java nur, wo
   ein Zustand fehlt) — sonst hätte FileChips keine Fehlerzeile (G1).
10. **Font Awesome** statt Bootstrap für die neuen Glyphen — `bridge/icons.ts` hält Font Awesome, ein Bibliothekswechsel
    ändert nur diese Datei.
11. **`tl-overlay--fill`** für das füllende Dokument; 5c nutzt es für die Kachel.

**Frage A an Hendrik (offen):** Das Paket zeigt „beschäftigt“ (`aria-busy`) schon als pulsierendes Icon. Ein Pulsieren
für „Aufnahme läuft“ sähe genauso aus wie „lädt hoch“. Vorschlag: „Aufnahme läuft“ ohne Bewegung, nur durch den
gedrückten Knopf in roter Fläche mit Stopp-Icon (§3).
