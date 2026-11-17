# Plan PR 1: Felder in der bearbeiteten Tabellenzeile (#30383)

Spec: `docs/superpowers/specs/2026-11-17-row-edit-felder-design.md`. Entscheidung: `docs/skalen.md` „Felder in der
bearbeiteten Tabellenzeile (17.11., #30383)“. Nur das Paket `tl-design-system` (CSS, Tokens, Primitive, Tests,
Specimen, Vertrag) — kein Java, kein TSX. PR 2 (Pflicht im Spaltenkopf) ist ein eigener Plan.

Alle Befehle im Modul `tl-design-system/` des Worktrees, wenn nicht anders gesagt. Commits englisch, Präfix
`Ticket #30383:`. **Nicht pushen** — melden, Hendrik gibt frei.

## Schritt 0: Ticket und Worktree

1. Trac #30383 annehmen (Status `accepted`, Owner `hpe`), Keyword `design-system` setzen. Der Git-Hook verlangt ein
   angenommenes Ticket. Kein `NoPreview` (sichtbare Änderung).
2. Hauptrepo `_Working-Tree/TopLogic 8 (NewUI)`: `git fetch origin master`, dann
   `git worktree add ../tl8-wt-30383 -b CWS/CWS_30383_row_edit_fields origin/master`.
3. Im Worktree `tl-design-system/`: `node tools/generate.mjs && npm test && npm run test:dom` — **Ausgangslage
   festhalten**: Alles muss grün sein. Ist etwas rot, anhalten und melden.

**Fertig, wenn:** Worktree auf `origin/master`, Ticket `accepted`, Gates grün.

## Schritt 1: `border-emphasis` dunkel `gray-36`, Paare, Primitive

Dateien: `src/tokens.json`, `src/primitives.json`, `tools/lib/pairs.mjs`, `test/pairs.test.mjs`,
`specimen/probe.theme.css`.

1. `src/tokens.json`, Block `dark` (heute Zeile 57): `"border-emphasis": "{gray-39}"` → `"{gray-36}"`. Hell
   (`{gray-45}`) bleibt.
2. `src/primitives.json`: den Eintrag `"gray-39": "#7F8286", ` entfernen. Vorher prüfen, dass `gray-39` sonst
   nirgends gelesen wird: `grep -rn "gray-39" src tools test` darf nach dem Schritt nur Erzeugtes treffen.
3. `tools/lib/pairs.mjs`, direkt nach `paar('border-emphasis', 'surface-layer', 3.0);`:

   ```js
   // Feldrahmen in der gezeigten und gewählten Tabellenzeile (#30383), auch auf der gezeigten Zebrazeile (U85).
   for (const bg of [...AUSWAHL, 'surface-interactive-hover', 'surface-interactive-strong']) paar('border-emphasis', bg, 3.0);
   ```

4. `test/pairs.test.mjs`: neuer Test nach dem Muster „3b: die Paare der Daten stehen in der Liste“:

   ```js
   test('#30383: der Feldrahmen der Tabellenzeile ist gegen jede Zeilenfläche geprüft', () => {
     const namen = new Set(kontrastPaare(T).map((p) => `${p.fg}|${p.bg}`));
     for (const bg of ['surface-selected', 'surface-selected-hover', 'surface-interactive-hover', 'surface-interactive-strong'])
       assert.ok(namen.has(`border-emphasis|${bg}`), bg);
   });
   ```

5. `node tools/generate.mjs`, dann das Probe-Theme neu rechnen:
   `node tools/derive.mjs test/fixtures/probe.primitives.json specimen/probe.theme.css`.
6. `npm test`.

**Erwartet** (Probelauf 17.11. an einer Kopie von master): grün; ohne Schritt 2 ist „keine Primitive ohne Leser“ rot,
ohne Schritt 5 „probe.theme.css ist byte-identisch“. Gemessen dunkel mit `gray-36`: hover 3,37, strong 3,16,
selected 4,27, selected-hover 3,93.

Commit: `Ticket #30383: Lighten border-emphasis in dark mode to gray-36 so field frames hold 3:1 on hovered and selected rows.`

## Schritt 2: Feld in der Zelle — Regeln in `table.css`

Datei: `src/components/table/table.css`, Block ab „Ein Feld in der Zelle ist die Zelle: randlos …“ bis
einschließlich der Regel `:where(.tl-table__row:hover, …) .tl-table__cell .tl-field:not(:disabled, [readonly])`
(heute Zeilen **675–707**, Review S8). **Unverändert bleiben** 709–720: Warnung, Fehler,
`.tl-table__cell .tl-field-group { height: 100%; }`, die Marken-Regel (sonst wird `table.test.mjs:41–43` rot).
Kommentare deutsch, wie im Paket.

Ersetzen durch (Fassung nach Plan-Review 17.11.: B1, B2, B3, S1, S2, S7, H1 eingearbeitet und im Headless-Chrome
am Produkt-DOM gemessen):

```css
/* Ein Feld in der Zelle sieht aus wie im Formular, eine Stufe niedriger (#30383): Fläche surface-field, voller Rahmen,
   Höhe size-control − space-2xs (28 px normal, 24 px kompakt) — niedriger als die Zeile, damit oben und unten Luft
   bleibt und benachbarte Zeilen nicht zu einem Raster aus Kästchen zusammenwachsen. Es steht space-2xs −
   border-width-sm (3 px) unter der Oberkante und hält unten 4 px bis zur Trennlinie — ganze Pixel statt 3,5 mittig;
   das trägt, solange size-row eine Rasterstufe über size-control liegt (tokens.test.mjs). Seitlich space-2xs Luft,
   um die der Innenabstand des Felds kleiner ist: der Text steht wie beim Lesen. Die Höhe sitzt fest am direkten
   Kind der Zelle (Feld oder Hülle: tl-form-field--compact, tl-field-group, tl-table__tree).
   Fokus ist der Basis-Ring nach innen (3a §5.2); Warnung und Fehler zeichnen einen inneren Rahmen in Statusfarbe. */
.tl-table__cell:has(.tl-field) {
  padding: calc(var(--tl-space-2xs) - var(--tl-border-width-sm)) var(--tl-space-2xs) 0;
  align-items: flex-start;
}

/* (0,3,0): schlägt .tl-table__cell .tl-field { height: 100% }, wenn das Feld selbst direktes Kind ist (S2). */
.tl-table__cell:has(.tl-field) > :not([hidden]) {
  height: calc(var(--tl-size-control) - var(--tl-space-2xs));
}

/* Innenabstand an (0,2,0): field.css (Gruppe mit Knopf oder Icon, (0,3,0)) behält Platz für Endknopf und Icon (B1);
   readonly und disabled rücken so wie beschreibbare Felder (S1). */
.tl-table__cell .tl-field {
  height: 100%;
  min-height: 0;
  padding-inline: calc(var(--tl-space-control-x) - var(--tl-space-2xs));
  border: 0;
  border-radius: var(--tl-radius-sm);
  background: transparent;
}

/* Die Auswahl hat einen Mindestinhalt aus padding-block und Knopf; in der Zelle ohne padding-block, sonst wird sie
   30/26 px statt 28/24 hoch (B2). Der Pfeil steht space-2xs vor dem Ende wie in jedem anderen Zellfeld. */
.tl-table__cell .tl-select {
  padding-block: 0;
  padding-inline-end: var(--tl-space-2xs);
}

.tl-table__cell .tl-field:focus-visible {
  outline-offset: calc(-1 * var(--tl-focus-offset));
}

/* Knöpfe im Feld (Leeren, Kalender, Pfeil): kompakt so hoch wie das Feld, sie deckten dessen Rahmen oben und unten
   (S7) — eine Rahmenbreite kürzer. Ihr Fokusring liegt nach innen wie im kompakten Feld (compact-field.css), sonst
   schneidet die Zelle ihn oben und unten (B3, focus-clip). */
.tl-table__cell .tl-field-group > .tl-button,
.tl-table__cell .tl-select__controls > .tl-button {
  max-height: calc(100% - 2 * var(--tl-border-width-sm));
}

.tl-table__cell .tl-field-group > .tl-button:focus-visible,
.tl-table__cell .tl-select__controls > .tl-button:focus-visible {
  outline-offset: calc(-1 * var(--tl-focus-offset));
}

/* Der native Kalenderknopf des Datumsfelds rechnet mit dem Innenabstand des Formularfelds (field.css); in der Zelle
   ist der um space-2xs kleiner (S7). */
.tl-table__cell .tl-field::-webkit-calendar-picker-indicator {
  margin-inline-end: calc(2 * var(--tl-space-2xs) - var(--tl-space-control-x));
}

/* Ein Feld, in das man schreiben kann: Fläche und Rahmen in border-control. Ein Feld mit disabled, readonly oder
   aria-disabled (die Auswahl ist ein div, H1) bleibt durchsichtig und ohne Rahmen — es liest sich wie eine
   Lesezelle. Auf gezeigter und gewählter Zeile trägt border-emphasis den Rahmen (border-control hielte dort hell
   2,84 / dunkel 2,60); das Blau bleibt Auswahl und Fokusring vorbehalten. Gleich spezifisch wie Warnung und Fehler,
   die danach stehen und mit ihrem Rahmen gewinnen. */
.tl-table__cell .tl-field:not(:disabled, [readonly], [aria-disabled="true"]) {
  background: var(--tl-surface-field);
  box-shadow: inset 0 0 0 var(--tl-border-width-sm) var(--tl-border-control);
}

:where(.tl-table__row:hover, .tl-table__row[aria-selected="true"]) .tl-table__cell .tl-field:not(:disabled, [readonly], [aria-disabled="true"]) {
  box-shadow: inset 0 0 0 var(--tl-border-width-sm) var(--tl-border-emphasis);
}
```

**Nachmessen beim Umsetzen** (vom Review nicht gegen diese Gesamtfassung gelaufen): `max-height` der Knöpfe und der
Kalender-Abstand (S7) — Knopf kompakt 22 px, Rahmen oben und unten sichtbar, Kalenderknopf 4 px vom Feldrand; der
Löschknopf hat 36 px Platz am Ende (B1). `lint-css` grün. Zeigt `max-height` keine Wirkung (Knopf mit fester
`height`), melden statt eine weitere Regel zu erfinden.

**Zu prüfen beim Umsetzen, bevor der Schritt als fertig gilt** (im Specimen und an der Instanz, Schritt 4/6):

- **Datumsfeld** (`tl-field-group`, Eingabe plus Löschknopf; der Kalenderknopf ist nativ in der Eingabe): Der Rahmen
  sitzt an der Eingabe, der Löschknopf liegt in ihr (Platz 36 px, B1). Sichtprüfung, dass der Rahmen beide umschließt.
- **Baumspalte**: rückt beim Bearbeiten gemessen 5,63 px (master 9,3), weil der Toggle schrumpft — Bestand, hingenommen
  (Review H6). Nur nachmessen, keine Regel.
- **Mehrsprachiger Text** (`.tl-table__cell > .tl-stack--row`) und bearbeitende `tl-value-list` bekämen als direktes Kind
  ebenfalls 28 px: in einer Instanz mit `row-edit` prüfen, ob es sie dort gibt, und melden.
- **Feld mit Marke**: Die Marke sitzt an der oberen Ecke der Wurzel `tl-form-field--compact`; die Wurzel ist jetzt
  28/24 px hoch und steht 3 px tiefer. Prüfen, dass die Marke nicht oben abgeschnitten wird.
- **Mehrzeiliger Text** in der Zelle: gibt es ihn in einer Zeile mit `row-edit`? Wenn ja, melden (die feste Höhe
  schnitte ihn).

`node tools/generate.mjs && node tools/lint-css.mjs` — grün.

## Schritt 3: Tests und Vertrag zu Schritt 2

1. `test/table.test.mjs`: Den Test „ein bearbeitbares Feld in der Zelle zeigt sich durch eine Linie unten, auf
   gezeigter und ausgewählter Zeile in border-interactive“ (heute ab Zeile 48) **ersetzen** durch:

   ```js
   test('#30383: ein bearbeitbares Feld in der Zelle hat Fläche und Rahmen wie im Formular, eine Stufe niedriger', () => {
     // Gemessen 17.11.: border-control hält hell 3,42 weiß / 3,10 Zebra, dunkel 3,69 / 3,29; auf gezeigter und
     // gewählter Zeile trägt border-emphasis (dunkel gray-36: 3,16–4,27). Das Blau bleibt Auswahl und Fokusring.
     const zelle = declarationsOf(css, '.tl-table__cell:has(.tl-field)') ?? '';
     assert.match(zelle, /padding:\s*calc\(var\(--tl-space-2xs\) - var\(--tl-border-width-sm\)\) var\(--tl-space-2xs\) 0/);
     assert.match(zelle, /align-items:\s*flex-start/);
     assert.match(declarationsOf(css, '.tl-table__cell:has(.tl-field) > :not([hidden])') ?? '',
       /height:\s*calc\(var\(--tl-size-control\) - var\(--tl-space-2xs\)\)/);
     // Innenabstand an (0,2,0), damit field.css Platz für Endknopf und Icon behält (Plan-Review B1).
     assert.match(declarationsOf(css, '.tl-table__cell .tl-field') ?? '',
       /padding-inline:\s*calc\(var\(--tl-space-control-x\) - var\(--tl-space-2xs\)\)/);
     assert.match(declarationsOf(css, '.tl-table__cell .tl-select') ?? '', /padding-block:\s*0/);
     const feld = '.tl-table__cell .tl-field:not(:disabled, [readonly], [aria-disabled="true"])';
     const d = declarationsOf(css, feld) ?? '';
     assert.match(d, /background:\s*var\(--tl-surface-field\)/);
     assert.match(d, /box-shadow:\s*inset 0 0 0 var\(--tl-border-width-sm\) var\(--tl-border-control\)/);
     assert.doesNotMatch(d, /padding/);
     assert.match(declarationsOf(css, `:where(.tl-table__row:hover, .tl-table__row[aria-selected="true"]) ${feld}`) ?? '',
       /box-shadow:\s*inset 0 0 0 var\(--tl-border-width-sm\) var\(--tl-border-emphasis\)/);
     // Kein Blau am Feldrahmen der Zelle: der Fokusring hätte sonst dieselbe Farbe (Kontrast 1,00).
     for (const [sel, decl] of rulesOf(css))
       if (sel.includes('.tl-table__cell') && sel.includes('.tl-field')) assert.doesNotMatch(decl, /border-interactive/, sel);
     // Warnung und Fehler stehen danach und gewinnen.
     assert.ok(css.indexOf(`:where(.tl-table__row:hover, .tl-table__row[aria-selected="true"]) ${feld}`)
       < css.indexOf('.tl-table__cell .tl-field[data-tl-state~="warning"]'));
   });
   ```

   Vorher in der Datei nachsehen, wie `declarationsOf` und `rulesOf` Selektoren normalisieren (Leerzeichen nach
   Komma in `:where(…)`), und die Strings genau so schreiben, wie der bisherige Test sie schreibt.
2. `test/tokens.test.mjs`, nach „eine Leiste ist Control-Höhe plus space-2xs oben und unten“:

   ```js
   test('#30383: eine Zeile ist eine Rasterstufe höher als ein Control, in beiden Dichten', () => {
     // Das Feld in der bearbeiteten Zeile steht space-2xs − border-width-sm unter der Oberkante; das ergibt ganze
     // Pixel (3 oben, 4 unten) nur, solange size-row − size-control = space-2xs.
     for (const d of ['normal', 'compact']) {
       const row = parseFloat(R.density[d]['size-row']);
       const control = parseFloat(R.density[d]['size-control']);
       assert.equal(row - control, parseFloat(R.measure['space-2xs']), d);
     }
   });
   ```

   Vorher prüfen, dass `R.density[d]['size-row']` so heißt und in `rem` vorliegt (wie `size-bar` im Nachbartest).
3. `src/components/table/table.contract.md`, Zeile „Feld in der Zelle“: neu fassen nach Schritt 2 (Fläche
   `--tl-surface-field`, Rahmen `--tl-border-width-sm` in `--tl-border-control`, auf gezeigter und gewählter Zeile
   `--tl-border-emphasis`, Radius `--tl-radius-sm`, Höhe `--tl-size-control` − `--tl-space-2xs`, oben
   `--tl-space-2xs` − `--tl-border-width-sm`, seitlich `--tl-space-2xs`, Innenabstand `--tl-space-control-x` −
   `--tl-space-2xs`; `disabled`/`readonly` ohne Fläche und Rahmen; Fokusring innen; Warnung/Fehler wie bisher).
   Das Gate „Verträge nennen jedes Token“ (`contracts.test.mjs:29`) meldet sonst `radius-sm`, `surface-field`.
   Außerdem `table.contract.md:285` (zweite Fundstelle zum Feld) nachziehen.
4. Veraltete Kommentare nachziehen (kein Gate, Review H2): `table.css:754–758` (Baumspalte „so hoch wie die Zeile“),
   `form.css:180` und `compact-field.css:30` (Feldzelle „hat keinen Innenabstand“), `tools/lib/pairs.mjs:66,84`
   (Begründung `border-interactive` auf der Zeile).
5. `npm test` — grün.

Commit: `Ticket #30383: Fields in an edited table row get the form field's surface and frame, one step lower; the row keeps its height.`

## Schritt 4: Specimen mit bearbeiteter Zeile

Datei: `src/components/table/table.spec.html`. Neues Panel „Bearbeitete Zeilen (#30383)“ **am Ende der Seite** —
davor verschöbe es das Gate `table-align.test.mjs:25–26,41`, das die erste Zahlenspalte der Seite nimmt (Review S4).
Breiten: 5 Spalten nutzen den **vorhandenen** Schlüssel `5` in `WIDTHS` (`table.spec.html:287,290`); keinen zweiten
Schlüssel anlegen (S5).

Jede Feldzelle trägt das **Produkt-DOM** (Review S3; aus `TLTableView.tsx`, `TLFormField.tsx`, `TLDatePicker.tsx`,
`TLDropdownSelect.tsx`), nicht das der Feld-Specimen:
`div.tl-table__cell > div.tl-form-field.tl-form-field--hidden.tl-form-field--compact > div.tl-form-field__input > …`
mit `input.tl-field` (Text, Zahl), `span.tl-field-group > input.tl-field[type=date] + button.tl-button` (Löschknopf
wie `ClearButton.tsx`) bzw. der Auswahl direkt in `__input`. Eine Zelle mit dem Feld als direktem Kind
(wie `table.spec.html:125`) bleibt zusätzlich drin (S2).

- Spalten: Name (Text), Lieferdatum (Datum mit Löschknopf), Status (Auswahl mit Löschknopf), Menge (Zahl,
  `data-tl-align="end"`), Summe (Lesezelle, `tl-text tl-nums`).
- Zeilen: eine Lesezeile (ohne Felder), eine gewählte bearbeitete Zeile (`aria-selected="true"`), eine bearbeitete
  Zeile mit Fehler (`aria-invalid="true"` am leeren Namen), eine mit `readonly`-Feld.
- Jede Zelle und Zeile mit einem `data-test`-Attribut oder einer `id`, damit der DOM-Test sie findet.

`node tools/serve.mjs`, Seite ansehen: hell, dunkel, kompakt. Screenshot in den Bericht.

## Schritt 5: DOM-Gate `row-edit.test.mjs`

Neue Datei `test/row-edit.test.mjs` nach dem Muster von `test/titlebar-height.test.mjs` (Server auf Port 0,
`launch()` aus `test/lib/browser.mjs`; dadurch läuft sie von selbst in `npm run test:dom`). Für `normal` und
`compact` auf dem Panel aus Schritt 4:

- jede Zeile mit Feldern ist so hoch wie die Lesezeile (`size-row`);
- jedes `.tl-field` mit Rahmen ist `size-control − space-2xs` hoch (28 / 24) und steht 3 px unter der Oberkante seiner
  Zeile;
- der Textanfang (linke Kante plus `padding-left` der Eingabe) liegt auf derselben x-Position wie der Text der
  Lesezelle derselben Spalte; für die Zahlenspalte die rechte Kante;
- die Rahmenfarbe auf der gewählten Zeile ist `--tl-border-emphasis`, nicht `--tl-border-interactive` — die Farbe
  kommt als `rgb()` aus `box-shadow`; gegen ein Probe-Element mit `color: var(--tl-border-emphasis)` vergleichen (H5);
- auch die `readonly`-Zeile: Textanfang wie in der Lesezelle (S1).

`npm run test:dom` — grün, außerdem die **vier** bestehenden DOM-Gates (`focus-clip`, `app-bar-shrink`,
`titlebar-height`, `table-align`; H3). `focus-clip` läuft über das neue Panel und muss ohne Ausnahme grün sein (B3).

Commit: `Ticket #30383: Specimen and DOM gate for fields in an edited table row.`

## Schritt 6: Prüfung an der laufenden Instanz

Lokale Demo `tl-demo-react` aus dem Worktree, `mvn clean install` (Memory „Lokale Builds immer clean“; Kopf von
`components.css` muss „tl-design-system (src/“ zeigen). Anmelden als root mit Testpasswort. Ansichten mit
`row-edit`: `demo/table-columns.view.xml`, `demo/tree-grid-demo.view.xml`, `attributes.view.xml`, und im
Modell-Editor (`com.top_logic.dev.tools/…/admin/model/model-editor.view.xml`, H4).

Soll-Liste je Ansicht, hell und dunkel, normal und kompakt, `SELECTED` und `ALL` wo vorhanden:

1. Feld ohne Klick erkennbar (Fläche, grauer Rahmen); Lesezelle ohne Kästchen.
2. Zeile beim Wechsel ins Bearbeiten nicht höher; Text springt nicht (Baumspalte: Abweichung messen und melden).
3. Gewählte Zeile ganz in Auswahlfarbe, Rahmen grau; Tab durch die Zeile: Fokusring blau, eindeutig.
4. Fehler- und Warnrahmen rot/gelb, gewinnen; Marke nicht abgeschnitten.
5. Datum, Auswahl, Zahl (rechtsbündig) stehen wie die Lesewerte.

Dann **alle Views im Dunkelmodus** durchsehen wegen `border-emphasis` (Feldrahmen beim Zeigen, Kopf-Unterkante,
Kante fixierter Spalten, Kästchen, Flow): wirkt eine Linie zu hell oder zu laut, Screenshot und melden. Das MUI-Modul
liest `border-emphasis` ebenfalls (`themeProperties.ts:85`) — dort nur ansehen, nichts ändern.

**Fertig, wenn:** Soll-Liste erfüllt oder Abweichungen gemeldet, Gates grün (`npm test`, `npm run test:dom`,
`lint-css`), drei Commits lokal auf `CWS/CWS_30383_row_edit_fields`. Kein Push.

## Bekannte Fallen

- `messages_en.properties` wird hier nicht berührt (kein Java); `tools/check-messages-en.sh` trotzdem vor dem Push.
- Die Selektoren in Tests müssen exakt so geschrieben sein, wie `declarationsOf` sie liefert (Leerzeichen in
  `:where(…, …)`); im Zweifel den alten Test als Vorlage nehmen.
- `lint-css`: kein Literal — `0` in der `padding`-Kurzform ist erlaubt (prüfen); `calc()` nur mit Tokens.
- Zebra (!2226) ist nicht auf master; die Zebra-Werte der Spec sind aus der Demo und gelten, sobald !2226 kommt.
- Entscheidungen (Datumsfeld-Rahmen, Baumspalte, mehrzeiliger Text) meldet der Ausführende, er trifft sie nicht.
