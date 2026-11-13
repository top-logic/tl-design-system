# U65 — Die Gates prüfen, was sie vorgeben (#30323, #30324)

Zwei PRs, gestapelt:

| PR | Ticket | Branch | Basis | Inhalt |
|---|---|---|---|---|
| A | #30323 | `CWS/CWS_30323_gates_check_what_they_claim` | master `97d7bb1037` | Teile (a), (b), (d), (e) |
| B | #30324 | `CWS/CWS_30324_contracts_name_every_token` | Branch A | Teil (c) |

Worktree A: `_Working-Tree/tl8-wt-30323`, Modul `tl-design-system/`. Ausgang `npm run build && npm test` = 687 grün.
Commit-Präfix je Ticket, Nachrichten englisch. **Kein Push.** Keine erzeugten Dateien einchecken.

Die Bestandsaufnahme (Opus, 13.11., Stand `9743cb73a6`, Zeilen dort können um wenige Zeilen von master abweichen) ist
die Grundlage; ihre Belege stehen je Teil unten.

**Nicht im Umfang:** Wertprüfung der Nicht-Farb-Familien in der Theme-Eingabe (`theme-input.mjs:66-69` nimmt in
`measure`, `motion`, `font`, `effect` jeden Wert an, z. B. `"; color: red"` oder `"}"`) — eigener Punkt U68.
Umgekehrte Richtung von (c) (Vertrag nennt Token, das CSS nicht liest) wird kein Gate; nur die vier Verdachtsfälle
werden in Task B1 geprüft.

## PR A — #30323

### Task A1 — (a) Modifier jedes Blocks und Elements sind entschieden (Sonnet)

**Befund:** `tools/lint-css.mjs` Punkt 11 (`MODIFIERS`, ~Z. 85–171; Prüfung ~Z. 205–207 `m && MODIFIERS[m[1]] && …`)
prüft nur Blöcke mit Eintrag. Ohne Eintrag sind 12 Komponenten-Blöcke: `tl-copy-button`, `tl-field-hint`,
`tl-field-hint-host`, `tl-field-value-group` (field); `tl-drag-image`, `tl-drag-shield`, `tl-pick-highlight` (drag);
`tl-fab`, `tl-floating-rail` (floating-action); `tl-fill` (layout, table); `tl-region` (layout, tabs, dialog);
`tl-reveal-on-hover` (layout). Keiner nutzt heute einen Modifier. Dazu die Klassen aus `base.css` (`tl-type-*`,
`tl-print-*`, `tl-icon-*`, `tl-nums`, `tl-visually-hidden`). Element-Modifier (`__x--y`) laufen nie durch Punkt 11:
heute 17 in 7 Blöcken (z. B. `tl-card__body--pad-default`).

**Entscheidung:**
1. Jeder Block, der in einer Komponentenquelle (`src/components/**`, bzw. `components.css`) vorkommt, **muss** einen
   Eintrag in `MODIFIERS` haben; fehlt er, meldet das Gate „Block tl-x ohne Eintrag in MODIFIERS“. Die 12 Blöcke
   bekommen `new Set([])` mit Kommentar, wo sie definiert sind. Die Klassen aus `base.css` sind keine Blöcke im Sinne
   dieser Regel (Grundklassen) und brauchen keinen Eintrag — die Ausnahme hängt an der Datei `base.css`, nicht an
   einer Namensliste.
2. Neue Tabelle `ELEMENT_MODIFIERS` (`'tl-card__body': new Set(['pad-default', …])`) mit genau den 17 heutigen
   Element-Modifiern. Ein Element-Modifier ohne Eintrag ist ein Verstoß „Element-Modifier tl-x__y--z nicht entschieden“.
   Die Zustandsprüfung `ELEMENT_STATE_MODIFIER` (Punkt 10a) bleibt davor und unverändert.
3. Tests in `test/lint-css.test.mjs`: Block ohne Eintrag mit Modifier → rot; Block ohne Eintrag ohne Modifier → rot
   (Pflicht-Eintrag); `base.css`-Klasse ohne Eintrag → grün; Element-Modifier ohne Eintrag → rot; mit Eintrag → grün.

**Fertig, wenn:** `node tools/lint-css.mjs` grün, `npm test` grün, Gegenprobe im Bericht: `.tl-fab--bogus` in
`floating-action.css` → Gate rot; zurückgenommen.

### Task A2 — (b) Vertragsbegriffe als ganzes Wort (Sonnet)

**Befund:** `test/lib/component.mjs:39` `missingInContract` prüft `md.includes('`' + n)` — Präfix genügt. Nur am
Präfix hängen heute: `contracts-5a:36` (`tl-picker` nur über `` `tl-picker__actions` `` in `button-bar.contract.md:25`
— echte Lücke) und `contracts-3a:17` (`tl-menu` steht in `menu.contract.md:71` als `` `tl-popover tl-menu` `` —
gültig, wenn Ganzwort innerhalb von Codespans). Inline-Kopien des Musters: `medien.test:185`, `planen.test:157`, `:168`.

**Entscheidung:** Ein Begriff gilt als genannt, wenn er in einem Codespan (`` `…` ``) als ganzes Wort steht: vor ihm
Spananfang oder ein Zeichen außerhalb `[a-z0-9_-]`, nach ihm Spanende oder ein Zeichen außerhalb `[a-z0-9_-]`
(`tl-picker` in `` `tl-picker__actions` `` zählt nicht, in `` `tl-popover tl-menu` `` zählt `tl-menu`). Ein Helfer in
`test/lib/component.mjs` (`namedInContract(md, term)`), `missingInContract` und die drei Inline-Kopien nutzen ihn
(Kopien ersetzen, nicht nachbauen). Der Begriff kann Sonderzeichen enthalten (`data-tl-state~="interactive"`,
`--tl-surface-inverse`, `role="tooltip"`) — escapen, und vor dem Umstellen alle heutigen Aufrufe einmal mit altem
und neuem Abgleich vergleichen; jeder Unterschied außer den zwei oben ist zu melden, nicht zu lösen.

`button-bar.contract.md`: `tl-picker` dort nennen, wo der Vertrag über den Picker spricht (ein Satz, Inhalt prüfen).

**Fertig, wenn:** `npm test` grün; Unterschiedsliste alt/neu im Bericht.

### Task A3 — (d) Tests, die scheitern können (Sonnet)

**Befund und Entscheidung je Stelle** (Zeilen nach Bestandsaufnahme; vor dem Ändern im Code nachsehen):

| Stelle | Heute | Neu |
|---|---|---|
| `eingaben.test:49` (swatch, Warnung vor Fehler) | `indexOf` −1 bleibt grün | beide Indizes `>= 0` prüfen, dann Reihenfolge |
| `eingaben.test:60-62` (picker ohne eigene `[hidden]`-Regel) | hält eine Schreibweise fest | jede Regel des Picker-Blocks parsen (`rulesOf`), keine Regel, deren Selektor `[hidden]` enthält |
| `behaelter.test:140` | `decl` mit `?? ''`, `declarationsOf` liest nur die erste Regel | alle Regeln mit diesem Selektor lesen, Vorhandensein prüfen, dann `display` in keiner |
| `tokens.test:87` (`void textAufSubtle`) | rechnet, prüft nie | Regel: keine Regel im erzeugten CSS setzt `color: var(--tl-status-X-text)` zusammen mit `background: var(--tl-status-X-subtle)`; die Rechnung bleibt als Begründung im Kommentar mit den Werten |
| `choice:71`, `drag:116`, `field:76`, `fundament:54`, `planen:78`, `planen:170`, `table:143`, `table:187`, `tree:31` | negative Prüfung auf `?? ''`/`join` ohne Vorhandensein | vorher `assert.ok(<regel gefunden>, '<selektor> fehlt')` |
| `popover:63` (`.tl-menu__item:active`, `indexOf`) | −1 ungesichert | `>= 0` prüfen |

Gemeinsames Muster: wenn mehrere Stellen dasselbe brauchen, ein Helfer in `test/lib/component.mjs`
(z. B. `declarationsOfAll(css, selector)` mit Vorhandensein-Pflicht), nicht neun Kopien.

**Fertig, wenn:** `npm test` grün (keine Assertion abgeschwächt); Gegenprobe je Zeile der Tabelle im Bericht: die
Bedingung brechen, die der Test heute nicht sieht (Selektor umbenennen bzw. Regel entfernen) → jetzt rot; zurücknehmen.

### Task A4 — (e) derive hält bei echten Fehlern an (Sonnet)

**Befund:** `tools/derive.mjs` ~Z. 187, 266, 315 fangen jede Ausnahme. Gemeint ist nur der Fehler aus `aufKontrast`
(`tools/lib/color.mjs` ~Z. 279, Meldung „… in keiner Helligkeit“, einfaches `Error`). Mit eingebautem Programmfehler:
187 schreibt das Theme mit falschen Befunden (Exit 0), 266 meldet eine falsche Ursache (Exit 3), 315 verliert alle
Vorschläge still (Exit 0).

**Entscheidung:** `color.mjs` exportiert `class KontrastNichtErreichbar extends Error`, `aufKontrast` wirft sie (Meldung
unverändert). Die drei `catch` fangen nur `e instanceof KontrastNichtErreichbar`, sonst `throw e`. Test in
`test/derive.test.mjs`: ein Programmfehler an einer der Stellen (über eine Attrappe, die statt der Kontrastrechnung
einen `TypeError` wirft — Einspeisung wählen, die ohne Umbau von `derive.mjs` geht; geht es nicht ohne Umbau, melden)
lässt `derive` scheitern; der bestehende Fall „nicht erreichbar“ läuft wie bisher. `specimen/probe.theme.css` muss
gleich herauskommen.

**Fertig, wenn:** `npm test` grün, `node tools/derive.mjs test/fixtures/probe.primitives.json <scratch>/p.css` gleich
`specimen/probe.theme.css`.

### Abschluss A

`npm run build && npm test`, `node tools/lint-css.mjs`, `npm run test:dom` grün. Ein Commit je Task.

## PR B — #30324

Branch `CWS/CWS_30324_contracts_name_every_token` auf dem Kopf von A, eigener Worktree `_Working-Tree/tl8-wt-30324`.

### Task B1 — (c) Ein Test für alle Verträge, Verträge vervollständigen (Sonnet)

**Befund:** Kein eigener Test; die Prüfung „Vertrag nennt jedes gelesene Token“ steckt in 12 Einzeltests
(`components.test:136/204/277/360`, `feedback:47`, `choice:194`, `field:101`, `form:78/81`, `select:82`).
Über alle CSS-Dateien gerechnet, auf dem erzeugten CSS (Rollenregeln expandiert): 159 fehlende Tokens in 25 Dateien;
ohne die per Rolle erzeugten (`category-N-*`, `status-*-subtle/border`) 99 in 24 Dateien. Alles Doku-Lücken.

**Entscheidung:**
1. Ein Test (neue Datei `test/contracts.test.mjs` oder in `component-lib.test.mjs`, wo `componentCssFiles` schon
   gebraucht wird): für jede CSS-Datei unter `src/components/` mit ihren Rollenregeln expandiert (`expandRoles`, wie das
   erzeugte `components.css`), jedes gelesene `var(--tl-…)` muss im `*.contract.md` desselben Verzeichnisses genannt
   sein (Abgleich über `namedInContract` aus A2). Ein per `@tl-roles` erzeugtes Token gilt als genannt, wenn das Muster
   im Vertrag steht: `category-<n>-<suffix>` bzw. `status-<s>-<suffix>` (genau diese Schreibweise, im Codespan, mit
   oder ohne `--tl-`). Eine CSS-Datei ohne Vertrag im Verzeichnis ist ein Verstoß. Meldung: Datei → fehlende Tokens.
2. Die Verträge vervollständigen: je fehlendes Token in den Abschnitt des Vertrags, der die Tokens aufzählt (Form des
   jeweiligen Vertrags übernehmen); kein neuer Sammelabschnitt, wenn der Vertrag einen Token-Abschnitt hat. Gibt es
   keinen, einen Abschnitt „Tokens“ nach dem Muster eines vorhandenen Vertrags (z. B. `button.contract.md`) anlegen.
   Nur nennen, wofür das Token im Block gelesen wird, wenn das aus dem CSS-Kommentar oder dem Selektor eindeutig ist;
   sonst nur nennen.
3. Die 12 Einzelprüfungen entfernen, soweit sie genau das prüfen (übrige Assertions derselben Tests bleiben).
4. Die vier Verdachtsfälle der umgekehrten Richtung prüfen und berichten, nichts ändern ohne Rückfrage:
   `titlebar.contract.md` nennt `size-control-sm`, `titlebar.css:83` liest `size-control`; dialog `space-md`;
   tree `layer-sticky`; compact-field `surface-interactive-strong/-active`.

**Fertig, wenn:** `npm test` grün; Gegenprobe: ein Token aus einem Vertrag entfernen → Test rot mit Datei und Token;
zurückgenommen. Ein Commit für Test + Verträge (oder zwei: Test rot zuerst nicht möglich, weil Gate — darum ein Commit).

## Doku (Orchestrator)

`docs/skalen.md` (Gates: Modifier-Pflicht, Element-Modifier, Vertrag nennt jedes Token mit Rollenmuster),
`docs/ui-durchgang.md` U65 erledigt, U68 neu (Wertprüfung Nicht-Farb-Familien), `STATUS.md`.

## Korrekturen aus dem Plan-Review (Fable, 13.11.) — gelten vor dem Text oben

Prototypen gelaufen (A1, A2, A4, B1) in Kopien unter
`/private/tmp/claude-501/-Users-hendrik-Claude-TopLogic-v8-DesignSystem/31df8c30-1a2c-44e1-b279-11e7428416d8/scratchpad/`
(`a1copy`, `a2copy`, `a4copy`, `copy`) — als Vorlage lesen, nicht blind übernehmen. In Kopien `TL_WORKTREE` setzen
(`engine-classes.test`, `ratchet.test:12`).

**Allgemein:** `fundament:54` heißt auf master `test/fundament.test.mjs:65`. B1-Test in neuer Datei `test/contracts.test.mjs`.

**A1 (entschieden):**
- Ausnahme für Grundklassen: `lint` bekommt die Menge der Klassen, die `dist/base.css` definiert (`baseClasses(css)`,
  gerechnet wie `knownVariables`), als Option; CLI (`lint-css.mjs` ~Z. 271–280) und `test/lint-css.test.mjs:149`
  reichen sie herein. Grund: `.tl-icon-sm` steht auch in `toggle/toggle.css:39,43,49`. Keine Namensliste.
- Die Pflicht gilt überall, nicht nur in Komponentenquellen. Der Platzhalterblock `.tl-x` in `test/lint-css.test.mjs`
  (51 Zeilen, ~20 Tests) und `test/choice.test.mjs:39/42` wird zu `.tl-item` (Eintrag vorhanden, leer) — Aussage der
  Tests unverändert, nur der Name.
- `lint-css.test.mjs:26` und `:191` (`.tl-button__icon--large` → `[]`) auf `.tl-card__body--pad-default` umstellen.
- Die Element-Modifier-Prüfung steht im `else`-Zweig nach 10a (`lint-css.test.mjs:184–189` verlangt genau eine Meldung
  für `tl-…__y--selected`).
- Meldung **einmal je Datei und Block** bzw. je Datei und Element-Modifier, nicht je Deklaration. Blockname
  `cls.split('__')[0].split('--')[0]`.
- Die 17 Element-Modifier: `tl-card__body` {pad-default, pad-compact}; `tl-form-field__input` {resettable};
  `tl-menu__item` {danger}; `tl-overlay__layer` {bottom, bottom-left, bottom-right, center, fill, left, right, top,
  top-left, top-right}; `tl-rich-text__markup` {inline}; `tl-table__cell` {command}; `tl-tooltip__body` {text}.

**A2:** Es gibt genau **einen** Unterschied (`tl-picker` in `button-bar.contract.md:25`); `tl-menu` bleibt genannt.
Span-Regex `` /`([^`]*)`/g `` (Spans über Zeilen, `form.contract.md:36–37`). Wortgrenze `[A-Za-z0-9_-]`.

**A3 (entschieden):**
- `eingaben.test:60–62`: `rulesOf(picker).filter(([s]) => s.includes('[hidden]')).map(([s]) => s)` deepEqual
  `['.tl-picker[hidden]']` (die Regel verlangt `hidden.test:27–38`).
- Aufgenommen: `text.test:13`, `table.test:74`, `:144`, `:188`, `navigation.test:81–82` (gleiches Muster).
- Helfer `declarationsOfAll` in `test/lib/component.mjs` auf `rulesOf`, Selektoren trennen mit `/,(?![^(]*\))/` wie
  `declarationsOf`, findet auch Regeln in `@media`. Er löst die lokalen Fassungen `planen.test:52`, `:127`,
  `medien.test:12` ab.
- `tokens.test:87`: auf `dist/components.css` + `dist/base.css` über `rulesOf`, je Status `s`:
  (1) getönte Ziele = Selektoren der Regeln mit `background(-color): var(--tl-status-s-subtle)`, `:where(…)` entfernt —
  mindestens eines muss es geben; (2) jede Regel mit `(^|[;\s])color:\s*var(--tl-status-s-text)` ist ein Verstoß, wenn
  sie selbst subtle setzt oder ein Selektorteil ein getöntes Ziel enthält; (3) erlaubt nur Subjekte aus
  `['.tl-alert__icon']` (Icon, Paar 3,0 in `feedback.test:19`). Kommentar: die Kombination im Markup
  (`tl-text[data-tl-tone]` in getönter Pill) ist aus dem CSS nicht lesbar; Werte der Rechnung (hell 4,01–4,20,
  dunkel 5,26–5,70) als Begründung.

**A4 (entschieden):** Testweg ohne Umbau: Fixture `test/fixtures/color-attrappe.mjs`
(`export * from '../../tools/lib/color.mjs'; export function aufKontrast() { throw new TypeError(…) }`), im Test
`registerHooks` aus `node:module` mit `resolve`, das `./lib/color.mjs` nur für den Elternteil
`…/tools/derive.mjs?attrappe` umlenkt; `await import('../tools/derive.mjs?attrappe')`, `assert.throws(…, TypeError)`,
`deregister()` im `finally`. Node ≥ 22.15 nötig (Maven nimmt 24.21.0): `engines` in `package.json` auf `>=22.15`
setzen. Exit-Code bei Programmfehler bleibt 1 (ungefangen; 2 = Eingabe, 3 = Befunde) — so lassen. `color.mjs:348/395`
rufen `aufKontrast` ohne `catch`: nicht im Umfang.

**B1 (entschieden):**
- Zuordnung CSS ↔ Vertrag über **gleichen Basisnamen** (`upload.css` ↔ `upload.contract.md`), nicht über das Verzeichnis.
- „Per Rolle erzeugt“ = Tokens im expandierten CSS minus Tokens der Quelle. Nur für diese gelten Muster, und zwar mit
  konkretem Suffix: `category-<n>-<suffix>` (z. B. `category-<n>-subtle`), `status-<s>-<suffix>`,
  `text-on-category-<n>`; die Rolle `brand` erzeugt `surface-brand-subtle` und `border-interactive` — wörtlich nennen.
- Heutige abweichende Schreibweisen umschreiben: `calendar.contract.md:132` (`--tl-category-N-surface`,
  `--tl-text-on-category-N`), `table.contract.md:261` (`--tl-<rolle>-subtle`).
- Gewollte Lockerung: pill und avatar verlangten jedes erzeugte Token wörtlich; jetzt genügt das Muster.
- Entfernen der Einzelprüfungen: in `components.test:136–140, 204–208, 277–281, 360–364` die ganzen Prüfungen; in
  `choice`, `field`, `form`, `select`, `feedback` nur `...varsOf(css)` aus der Namensliste — Klassen und Attribute bleiben.
- Erwartete Lücken je Datei (Probelauf master): accordion 11, adaptive-detail 4, app-bar 1, bottom-bar 8, calendar 17,
  card 1, choice 22, color-picker 9, dialog 1, drag 1, drawer 3, icon-picker 6, job-status 1, overlay 1, picker 3,
  popover 1, sidebar 5, slider 14, snackbar 3, split 1, steps 1, swatch 12, table 24, titlebar 1, wizard 8 (vor Abzug
  der Muster). Ohne Token-Abschnitt: accordion, adaptive-detail, card, drag, picker, swatch.
