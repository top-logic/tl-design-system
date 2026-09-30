# Stand

**Letzte Sitzung:** 2026-09-30 (Welle 2 gebaut und grün, PR !1740 nach Freigabe; Welle 1 vollständig auf master) · **Basis:** `tl-engine-7@master` (TopLogic 8.0.0-SNAPSHOT) ·
**Specs:** `docs/superpowers/specs/2026-09-17-design-system-neuaufbau-design.md`,
`docs/superpowers/specs/2026-09-25-derive-design.md`,
`docs/superpowers/specs/2026-09-25-ui-paket-design.md`

## Zuerst

**Entschieden (28.09.): eine Linie, drei Stränge.** Plan `docs/superpowers/plans/2026-09-28-konsolidierung.md`.
Strang 0 schließt Welle 1 (**!1694 gemerged am 28.09.**, Merge-Commit `c38ad05ddd`, Pill-Branch gelöscht; !1695
steht jetzt auf Basis `master` und ist mergeable; !1695 hat
Request Changes mit drei Punkten: px im JavaDoc von `IconSize`, `lg` unlesbar, `size="xl"` in der Bild-Demo —
**umgesetzt 28.09.**: zwei Namensräume — extern ganze Wörter `small|medium|large|x-large` bzw. `small|medium|large|glyph`, im Paket die Skalenkürzel, TSX bildet ab; Commits `01adf297bf..24ff522d42`, Verträge `db443ab`; Antwort im PR, Review bei Bernhard erneut angefordert. **Sichtprüfung 28.09. auf `docker:8012` erledigt, alles wie entschieden:** Avatar `medium` in Kopfzeile und Kommentarkopf (`category-3`, derselbe Name dieselbe Kategorie), `x-large` in der Bild-Demo mit Bild, mit Initialen (`category-1`, `heading-lg`) und leer; Fortschritt bestimmt (2/8, `aria-valuenow`, `tl-nums`) und unbestimmt (`aria-busy`, `tl-progress-sweep` 1,2 s); hell und dunkel; keine alten Klassen im DOM, Icons nur `tl-icon-sm/md`. Bernhard approved 11:07; Merge scheiterte an „out-of-date with base“ (drei Merges auf master am Vormittag), darum master gemerged (`09a39a7ead`), Jenkins grün. 29.09. erneut hinter master mit Konflikt in `TLFormField.tsx` (master-Importe aus #29665 gegen `FontIcon`→`ThemeIcon`); aufgelöst mit master-Importen plus `ThemeIcon`, Merge-Commit `3a8bf043af`, `messages_en`-Gate grün, **Jenkins grün; Bernhard approved 30.09. 09:02, **gemerged 30.09. 13:20 (`95146ca38c`).** (Gate-Hinweis: nach einem master-Merge scheitert `check-messages-en.sh` offline, bis die vorgelagerten Module mit Java-Änderungen per `mvn -o install -pl <Liste>` im lokalen Repo liegen — diesmal sieben Module, `HandlerResult.notExecutable` aus #29679 fehlte.) Offen, Altbestand des Branches: `tsc --noEmit` meldet in `TLFormField.tsx` zweimal `string | undefined` an `ThemeIcon.encoded` (Zeilen 146/154), nicht Teil des Vite-Gates. Nebenbefund, Altbestand: Klick in den WYSIWYG-Editor fokussiert die Toolbar, auf master reproduziert → Trac #29691). Strang 1
verschmilzt das UI-Paket mit Bernhards #29643/!1698 und #29650. Strang 2 ist Welle 2. Nichts Neues, bis ein
Faden geschlossen ist.

**Entschieden (28.09.): Ein Vertrag, zwei Hälften — Bernhards Mechanik, unsere Wertschicht.** !1698 bringt
`state.proto` (Zustand für Java und TypeScript, `TestControlStateSchema`), `replace()`, `registerRootWrapper()`
und ein Beispielmodul mit Maven-Profil; das übernehmen wir, und die Spec `2026-09-25-ui-paket-design.md` wird
darauf umgeschrieben: `### Zustand` verweist auf die Proto-Nachricht, der Harness liest das Schema aus
`control-state.ts` und die Fälle aus `## Konformität`, `examples/mui-adapter/` entfällt zugunsten #29661 im
Framework. Widerspruch an zwei Stellen, mit Beweis in seinem Code: sein Beispiel-Stylesheet ist „independent
of the TopLogic theme tokens“ (kein Dunkelmodus, kein Gate, `outline: none`), und #29662 dreht die
Theme-Richtung um — `derive` bleibt die Quelle, `roles-to-mui` rechnet das MUI-Theme aus den Rollen.
Begründung `docs/skalen.md` „Ein Vertrag, zwei Hälften“, Folie 13b, Übersicht §2b. Strang 1, Stand 28.09. vormittags: Beweis-Commits
liegen als PR [!1705](https://git.top-logic.com/TopLogic/tl-engine-7/pulls/1705) auf Bernhards Branch (Bernhard
Reviewer); Kommentare in #29662 (Gegenvorschlag: MUI-Theme als Eingabe für `derive`) und #29650 (Abstimmung)
gepostet — Rücksprache mit Bernhard erwartet; Wiki „Übersicht“ §2b nachgezogen. Spec und Plan UI-Paket sind umgeschrieben (23 Tasks,
`0c359e1`). **Gruppe A ist fertig:** Branch `CWS/CWS_29617_design_system_ui_paket` von master, `@Key` an
`ClientResources.Config.getResources()`, `TestClientResources` 4/4 (Override, Remove, Kundenskript nach unserem,
`requires` auf entfernten Eintrag ist ein Fehler), Modul 395/395, `messages_en` erzeugt, Review Approved
(`d3c33be37f..532e5f1895`); PR [!1710](https://git.top-logic.com/TopLogic/tl-engine-7/pulls/1710) **gemerged am 30.09.**
(Head `532e5f1895`, Branch bleibt für die Gruppen B/C/E stehen). Ledger `.superpowers/sdd/2026-09-25-ui-paket/progress.md`.
Gruppen B, C, E warten auf den Merge von !1698 (msgbuf 1.2.3). Gruppen B/C/E warten auf den Merge von !1698
(blockiert auf msgbuf 1.2.3).

**Welle 1 (Button) ist auf `master`.** PR [!1649](https://git.top-logic.com/TopLogic/tl-engine-7/pulls/1649)
wurde am 23.09. gemerged (Merge-Commit `0fa0085060`). Der Weg dahin: drei Build-Nachbesserungen
(`1041fb64d4` Token-Audit kennt `tokens.css`, `64f5c32b33` Resource-Keys, `2900f5ded1` der Build erzeugt
`messages_en.properties` aus dem JavaDoc) und zwei Merges von master (`9c3d023936`: #29626 kollabierende
Toolbar übernimmt den Kollaps zum Icon, `collapseToIcon`/`AppShellContext` gestrichen; `b88ac7dbb1`: #29497
Bridge-Tooltips, #29596 `rootClassName`, Audit-Tests im master-Stand). Der Worktree stand danach auf `master`, der
Branch dieses Merges ist gelöscht. Ratsche damals: 79 Blöcke, Summe 7404 Zeilen — alles Fremdzuwachs seit 5766.
Seither ist der Worktree weitergezogen: er steht auf `CWS/CWS_29617_design_system_welle_2` (enthält !1695, seit 30.09. in master), und die
Ratsche ist gegen diesen Stand kalibriert (siehe unten, vor „Jetzt“).

**Entschieden (24.09.): die Ratsche misst Blöcke.** `test/ratchet.json` führt unter `blocks` jeden der 79
Blöcke `/* --- Name --- */` mit seinem Zeilenstand; kein Block wächst, ein abgeschnittener wird gestrichen,
neue Blöcke von außen stehen unter `unlisted` in `node tools/inventory.mjs`, bis ihre Welle sie holt.
Fremdzuwachs hebt einen Block mit Ticketvermerk, nicht die Datei. Begründung in `docs/skalen.md` „Die
Ratsche misst Blöcke“, Folie 32a.

**Entschieden (25.09.): Zwei Wege, kein dritter.** Wer TopLogic als Shell nutzt, hält den Draht-Teil
der Verträge ein (Muss: Zustand, Aktionen, Stapel; Kann: Tokens, Attribute), gleich welche Bibliothek er
mitbringt; wer das nicht will, geht headless über REST/OpenAPI. Kein Admin-Schalter, der das UI-System
abschaltet; stattdessen ersetzt ein Kundenmodul benannte Ressourcen, und ein Theme darf ein UI-Paket
benennen. Anlass: Mercedes-Benz mit MBUI, Gespräch mit Bernhard. Begründung in `docs/skalen.md` „Zwei
Wege, kein dritter“, Folie 13b, Übersicht §2b. Spec: `docs/superpowers/specs/2026-09-25-ui-paket-design.md`
(Kundenmodul, Ressourcen-Override, Verträge Muss/Kann, Harness, Referenzprojekt `examples/mui-adapter/`).
Befund: `ClientResources.Config.getResources()` braucht `@Key(name)`, damit `config:operation="remove"` greift;
`react-src` hat keine Test-Infrastruktur, der Harness bringt Vitest mit. Plan:
`docs/superpowers/plans/2026-09-25-ui-paket.md` — 24 Tasks in fünf Gruppen (A Ressourcen-Override im
Framework, B Harness in `react-src`, C 20 Verträge im Paket, D `examples/mui-adapter/`, E Theme benennt Paket);
Framework-Branch `CWS/CWS_29617_design_system_ui_paket`, Verträge werden per `publish-to-worktree.mjs` nach
`react-src/contracts/` kopiert, Fälle stehen als JSON-Block unter `## Konformität`.

**Entschieden (24.09.): Themes sind eine dritte Achse.** `data-tl-theme="<id>"` am `html` neben Modus und
Dichte; ohne Attribut gilt TopLogic auf `:root`, ein Kundentheme ist eine mit `derive` erzeugte Datei unter
`[data-tl-theme="acme"]`, Beschriftungen je Theme × Modus, Gate je Theme. `UIThemeService` behält Nutzerwahl,
Vererbung und Systemfolge und setzt künftig `data-tl-theme` statt `data-theme`. Die Spec-Fassung „Kunde
tauscht auf `:root`“ ist damit überholt und wird mit `derive` fortgeschrieben. Begründung in `docs/skalen.md`
„Themes: eine dritte Achse“, Folie 24a, Issue #16.

**Seit 25.09. gebaut: `tools/derive.mjs`, Spec `2026-09-25-derive-design.md`; die Datei trägt Rollen, nicht
Primitive, und meldet statt zu verbieten.** Aufgaben 1–10 stehen auf `main`, ab `89e1fb5` bis `HEAD`:
Grau als Temperatur (70°/250°, Chroma 0,008), Kategorien um die Kundenmarke, Beschriftungen gerechnet,
ein Nachführ-Pass schiebt jede gerechnete Rolle, die ein Paar noch verfehlt, um den kleinsten
Helligkeitsschritt (Hinweis im Bericht) — Befunde entstehen nur aus gelieferten Werten, `--strict` macht
sie zum Fehler. Beispiel und Gate: `test/fixtures/probe.primitives.json` → `specimen/probe.theme.css`,
zwei Befunde aus der gelieferten Rotstufe, im Specimen über `data-tl-theme` umschaltbar.

**Sichtprüfung erledigt (24.09., Pill-PR-Instanz, hell und dunkel).** Kein Eclipse nötig. Jenkins baut je PR
eine Docker-Instanz (`Docker_Git_Java17`, Kontext = Branchname mit `_`); sie ist **nur intern** erreichbar,
`http://docker:80NN/<Kontext>/` (Port aus `WEB_PORT` im Build-Log, für !1694: 8007), von Hendriks Rechner per
VPN. Der Apache unter `apps.top-logic.com` kennt PR-Instanzen nicht (404 ohne `Via`) — die frühere Annahme
„bei Welle 1 hat es funktioniert“ war falsch, Welle 1 wurde nach dem Merge auf `tl-demo-react` geprüft.
Login `root`/`root1234`, Hendrik loggt selbst ein; die H2 überlebt den Neubau (Theme-Wahl bleibt gespeichert, „System“ im Benutzermenü setzt zurück), Beispieldaten über „Beispiele erzeugen“. Pillen sitzen unter **Tickets**/**Projekte** (`demo.tickets`), nicht in `attributes/table`. Nach Build 16233 (25.09.) erneut geprüft: Dropdown und Tabellen farbig, Rollen und Tokens unverändert.

Ergebnis Pill: drei Rollen (`open` warning, `inProgress` info, `closed` success) in Tabelle, Gruppenkopf,
Dropdown-Liste und Chip als `tl-pill tl-pill--<rolle>` aus `status-*-subtle`/`-border`, Text `text-primary`,
kein Inline-Style, kein `.tlPill`, beide Modi. Button dort mitgeprüft: Toolbar `ghost`, Dialogfuß zwei
`secondary` + eine `primary`, Zeilen-Icons klein und rahmenlos, kein `tlReactButton`. Zwei Befunde für die
Select-Welle in `docs/migration/altlast.md` „Sichtbare Befunde“: gewählter Einzelwert ohne Pill (bewusste
TSX-Regel), Pill in 120-px-Zelle hart abgeschnitten (`.tlOptionValue` ohne `min-width: 0`).

**Review !1694, zweite Runde (24./25.09., Bernhard):** drei Punkte — (1) „ohne Bedeutung“ war ein dummer
Tooltip → „deren Bedeutung die Anwendung festlegt“ (`e5559a886f`); (2) Enum nicht erweiterbar, Liste gehöre in
eine Konfiguration; (3) `ColorByExpression` solle weiter Farbwerte liefern dürfen. Entschieden mit Hendrik: beim
Plan bleiben. Begründung steht jetzt als **Wiki „Übersicht“ §2a „Das Vokabular ist der Vertrag, nicht das
Design“** (und `docs/uebersicht-design-system.md`): Werte / Vokabular / Komponenten, Enum = Interface,
Stylesheet = Implementierung, acht Kategorien gerechnet und genug (Farbtopf, Text trägt den Wert, WCAG 1.4.1),
dynamisch = Rolle wählen. Die alte §5-Zeile („DesignTokenService als Naht ist richtig“, 18.09.) ist als überholt
markiert. Antwort im PR gepostet (25.09.). Jenkins-Build 16231 fiel danach an „Files have been changed during build“: der geänderte Klassen-JavaDoc von `ValueColor` war in `messages_en` nicht neu erzeugt — nachgezogen (`c637a17e7e`). Damit das nicht zum fünften Mal passiert: `tools/check-messages-en.sh` als Push-Gate, Regel in CLAUDE.md.

**Review !1694, erste Runde (24.09., Bernhard):** `.DS_Store` raus, und die Frage „wofür noch `DesignTokenService`?“ —
beantwortet mit Commit `78e2f3627c`: Die Rolle bleibt Enum (geschlossene Liste, Vertrag des Pakets), der
Token-Service von #29606 fällt mit seinem letzten Leser (`DesignTokenService`, `ThemeDesignTokens`,
`UIThemeDesignTokens`, Registrierung, Test); `DesignTokenKind` bleibt für die Theme-Tokens. FAQ auf Rollen
umgeschrieben. Antwort steht im PR. Alte PRs aufgeräumt: !1621 (Brand-Token im alten Theme-Config)
geschlossen als überholt; !1618 (doppeltes React im Controls-Bundle) auf master neu aufgesetzt
(`b610c5658e`, −16.748 B, Bernhard Reviewer) — unabhängig vom Design System.

**Avatar (24.09.) steht als PR.** ToggleButton war mit dem Button erledigt (`aria-pressed`, kein eigenes CSS).
Avatar entschieden: die Farbe ist eine Kategorie aus dem Namen (`docs/skalen.md` „Avatar: die Farbe ist eine
Kategorie“, Folie 34) — `tl-avatar--category-<n>`, Tokens der Kategorie, Initialen `text-primary`; vier Größen
`size-avatar-sm/md/lg/xl` (neu `size-9`), nicht an der Dichte; Typo-Klasse je Größe. Paket: `avatar.css`, Vertrag,
Specimen, Gates 109/109. Engine: PR [!1695](https://git.top-logic.com/TopLogic/tl-engine-7/pulls/1695) auf Branch
`CWS/CWS_29617_design_system_welle_1_avatar`, **gestapelt auf den Pill-Branch** (Basis !1694) — nach dem Pill-Merge
auf master rebasen und die Basis umstellen. `AvatarSize` heißt `sm|md|lg|xl`, alter Block `TLAvatar` raus,
Ratsche auf 7325. Sichtprüfung offen (Kommentarköpfe in der Objektliste, Bild-Demo `xl`).

**Progress (24.09.) im selben PR !1695.** Entschieden: „ein Anteil, kein Urteil“ (`docs/skalen.md`) — Spur
`surface-interactive-selected`, Füllung `surface-brand`, keine Tönung; unbestimmt ist `[aria-busy="true"]`, keine
Klasse; der Schwung liest die **vierte Dauer `duration-loop`** (1200 ms, nur Endlos-Animationen; Motion-Abschnitt
nachgetragen); kein eigener Reduced-Motion-Block — der globale Schalter trägt. Breite der Füllung ist Daten
(`style="width: 25%"`), eine Custom Property `--tl-progress-fraction` schied am Gate aus. Alte Regeln aus dem
Block `TLHtml` (226 → 164), Ratsche 7263, Gates 115/115. Lint kennt jetzt die Modifier von Pill, Avatar, Progress.

**Präsentation verdichtet (24.09., `f748c08`):** 15 Folien für die Kollegen statt 34; Zweck in CLAUDE.md und
Memory festgehalten — keine Entscheidungsquelle, Marketing-Tonlage, wird PowerPoint.

**Icon (24.09.) im selben PR !1695 — Welle 1 ist damit auf der Paketseite vollständig.** Entschieden: „die Stufe
ist die Rolle“ (`docs/skalen.md`) — `<theme-icon size="sm|md|lg|glyph">`, Default `sm`, das Control rendert
`tl-icon-<stufe>` aus `base.css` und hat kein eigenes CSS; `.tlIcon` fällt, `FontIcon.tsx` fällt (vier Leser auf
`ThemeIcon`), Bild-Icons ohne Inline-Maß, Glyphen `aria-hidden`. Vertrag und Specimen ohne CSS-Datei. Ratsche
7256, Gates 118/118. Offen für Welle 2–4: Menü, Toolbar, Sidebar, Reiter, Select geben `ThemeIcon` eigene
Klassen statt einer Stufe (altlast.md „Icon“).

**Worktree (Umzug 30.09.):** Die Worktrees liegen jetzt unter `_Working-Tree/` im Projektordner, die Werkzeuge erwarten `_Working-Tree/tl8-wt-29584`, weil die Sandbox `~/git` nicht sieht. Das Hauptrepo `TopLogic 8 (NewUI)` zieht nach, dann `git worktree repair`. Der alte `~/git/tl8-wt-29584` stand auf `CWS/CWS_29617_design_system_welle_1_avatar`; die Ratsche
ist gegen diesen Stand kalibriert. Vor Pill-Arbeit erst zurück auf den Pill-Branch wechseln.

**PR-Stand 25.09. mittags:** !1618 (doppeltes React) gemerged, Branch gelöscht. !1694 (Pill): Bernhard hat am
25.09. 07:41 approved („Na gut – wir werden sehen wo's hinführt“), das Approval gilt seit dem `messages_en`-Commit
`c637a17e7e` als stale; Build 16232 grün; Merge braucht Bernhards erneutes Approval (Klassifikator lehnt den Merge
ohne ab). !1695 (Avatar): Bernhards Review „erster Enum-Wert ist der Default“ beantwortet mit `81f80b3f0e`
(`MEDIUM` vorn, `@FormattedDefault` weg, `messages_en` neu erzeugt — Build 16225 war daran gescheitert);
Merge-Reihenfolge im PR vorgeschlagen: erst !1694, dann !1695 auf master rebasen.

Jetzt:

0. **Welle 2 als PR [!1740](https://git.top-logic.com/TopLogic/tl-engine-7/pulls/1740) gegen master (30.09. 14:49, Head `ed8ea63828`, Bernhard Reviewer).** Push kam von Hendrik (die Sandbox erreicht den Schlüsselbund nicht). **Sichtprüfung 30.09. auf `docker:8017` erledigt, hell und dunkel, alles wie entschieden:** Feldränder sichtbar, Fokusring, Pflichtstern, Fehlerzustand (roter Rand, Meldung mit Icon), Checkbox/Tri-State/Radio aus Tokens, Selects mit Icons, Select-Popup liegt im Dialog über dem Backdrop, Suchfeld-Icon mittig, gewählter Filterwert als Pill, Pill in der 120-px-Zelle mit Ellipse, gewählter Chip als Marke, schreibgeschützte Checkboxen lesbar, Upload- und Hilfe-Knopf. Nicht prüfbar in der Demo: kompakte Dichte (kein Schalter; Specimen deckt sie), Eigentümer-Link (Spalte nicht eingeblendet), Ziehen im Mehrfach-Select. Danach master (#29680) in den Branch gemergt (`3c87200bbb`), Push durch Hendrik, Review neu angefordert.

1. **Welle 2 (Formulare) ist gebaut, der PR !1740 nach Hendriks Freigabe.** Paket `e8f1221..0c10c7d` auf `main`
   (Tasks 1–7 samt Kontrast-Nachzügen 5a und 7a, Gates 224/224), Engine-Branch `CWS/CWS_29617_design_system_welle_2`
   (`3a8bf043af..bf970e6f54`, master gemergt, `layout.react`, `layout.view`, `demo.react` grün, `messages_en` ohne
   Diff) — **nicht gepusht, kein PR**. Die Ratsche steht bei 5994 Zeilen (7252 davor); die zwölf Blöcke der Spec sind
   gestrichen, dazu `TLResourceCell` und `Visually hidden text`; der `tsc`-Befund in `TLFormField.tsx` ist weg (`tsc`
   32→26, keiner in Welle-2-Dateien). Fix-Welle nach dem Final-Review (Task 12d): gewählter Chip ist Marke,
   Checkbox schreibgeschützt per `aria-readonly`, Felder ohne `padding-block`, mehrzeiliger Lesewert bricht um;
   Gates 232/232, Engine `a483bc99b8`, `layout.react` 446/446. Entscheidungen beim Bauen: `docs/skalen.md` „Formulare“, Abschnitt „Entschieden
   beim Bauen (30.09.)“; Ledger `.superpowers/sdd/2026-09-30-welle-2-formulare/progress.md`; Arbeitsliste
   `docs/migration/altlast.md` „Welle 2 · Formulare“. **Danach Sichtprüfung** in der Docker-Instanz des PRs, hell und
   dunkel (Plan Task 12, Schritt 3):
   1. Dialog „Neues Demo-Objekt“: Feldränder sichtbar, Radio „Aktiv (Radio)“ gezeichnet, Checkbox, Fehler nach leerem
      Pflichtfeld.
   2. Objektliste: Filter „Status“ zeigt den gewählten Wert als Pill; Tabelle „Geschlossen“, Spalte „Status“ endet mit
      Ellipse; Spalte „Eigentümer“ Link lesbar (und unterstrichen).
   3. Select öffnen, Pfeiltasten, Enter, Escape, Rücktaste; Mehrfachauswahl ziehen; Select im Dialog liegt über dem
      Backdrop.
   4. Formulargruppe einklappen; Hilfe öffnen; Upload in einer Binär-Eigenschaft.
   5. `data-tl-density="compact"` über die Theme-Wahl.

   Vor dem Push: `tools/check-messages-en.sh`, Trac #29617 angenommen, Bernhard Reviewer, Trac CC. Die Satelliten-Tests
   `layout.react.codeedit` und `model.search.react` liefen offline nicht (kein Netz für `npm install`); `describedBy` an
   `bridge/field-label.ts` prüft der PR-Build.
2. Nicht geprüft, offen: AppBar-Kollaps bei Platzmangel, AppBar auf `surface-layer`, `ButtonTone.DANGER`
   (kein Aufrufer — `setTone` einmal setzen).
3. **Welle 3 planen** (Tabelle, Baum, Menü, Toolbar, Reiter; Branch von `CWS/CWS_29617_design_system_welle_2`, gestapelt).
   **Zuerst der offene Punkt „gehobene Flächen“:** `surface-interactive-hover`/`-selected` auf `surface-overlay`
   messen dunkel 1,13 / 1,01 — im Select-Popup trägt die Akzentlinie (`border-interactive`, 4,53) die Hervorhebung,
   der Skeleton liest dieselbe Rolle; Menü und Dialog brauchen eigene Rollen für Zeigen und Auswahl auf gehobenen
   Flächen. Entscheidung mit dem Menü, Begründung in `docs/skalen.md` „Formulare“, „Offen für Welle 3“. Dazu aus
   Welle 2: die drei Renderer von `tl-field-value`, `withPill` nach `pill/`, der Stapel-Übergang (acht Regeln des
   Altbestands lesen `layer-*`, Rest in Welle 4) und die Liste in `altlast.md` „Offen für spätere Wellen und Pakete“. Ziel: ganzes System bis Ende der Woche ab 05.10.

Das Repo liegt jetzt unter `TopLogic/tl-design-system`; Wiki (Home, Übersicht, Anleitung Komponenten mit
Claude, Regeldatei) ist der Einstieg für Bernhard, `docs/*.md` die gepflegte Quelle.

Offen, nicht blockierend: Trailer der Commits `5ab2ae3`/`6d709f4` bleiben stehen. Aus dem Final-Review für
spätere Wellen: `surface-overlay` ins Kontrast-Gate (Welle 4), Icon-Schrift im Specimen, zwei
`--layer-accent`-Leser außerhalb der AppBar (Avatar, Dirty-Dot), Element-Modifier im Gate, TSX-Lint-Regel.

## Wo anknüpfen

**Welle 0 ist umgesetzt.** Das Paket `design-system/` liefert `dist/primitives.css`,
`dist/tokens.css`, `dist/base.css` und `dist/tokens.dtcg.json`. `cd design-system && node --test`
ist das Gate — **232 Tests, alle grün**. `node tools/lint-css.mjs` ist das Klassen-Gate,
`test/ratchet.json` das Budget des alten Stylesheets (5994 Zeilen nach Welle 2, davor 7252; Fremdzuwachs aus master hebt einen
Block mit Ticketvermerk, die Summe darf sonst nur sinken) und die Einfang-Liste `foreignTl` der sechs fremden
`--tl`-Namen im Altbestand (`--tl-item-index`, `--tl-toolbar-shrink-priority`, `--tl-toolbar-trigger-size`,
`--tl-tt-padding`, `--tlGrid-gap`, `--tlText-tone`).

Die Demo-App lädt die drei Dateien als `ClientResources` und setzt `data-tl-mode` und
`data-tl-density` am `html`. Das ist mit PR !1641 auf `master` (Commits `2a8ac53c8`, `fa851a4ef`, Merge `59404c7f`); verifiziert wurden
CSS-Reihenfolge, `data-tl-mode`/`data-tl-density` samt Theme-Wechsel und System-Modus, `TestUIThemeService` 9/9,
Jenkins-Build, kein Layoutbruch.

**Prüfliste für die Wellen:** `docs/migration/altlast.md`, Abschnitt „Sichtbare Befunde aus der laufenden
Anwendung“ — sieben Kontrast- und Fokusbefunde aus dem Darkmode, je Welle zugeordnet. Lightmode und Dichte
sind noch nicht erhoben.

**Nächster Schritt: Welle 3.** Tabelle, Baum, Menü, Toolbar, Reiter. Je Komponente: CSS nach
`src/components/`, Klassen im TSX umbenennen, Zustände auf Attribute, `className` durchreichen,
Specimen, Vertrag, Gate grün, alter Block in `tlReactControls.css` gelöscht. Der Button ist die
Vorlage, Welle 2 (Feldrahmen, `tl-field-value`, Attribut-Zustände) das jüngste Muster. Welle 1 ist auf
`master`, Welle 2 gebaut (PR !1740). Arbeitsliste: `docs/migration/altlast.md`.

Offen aus der Spec, nicht Teil von Welle 0:

* `data-tl-theme` — dritte Achse für mehrere Themes je Anwendung: **Paketseite fertig** (`derive` schreibt
  je Theme eine Datei unter `[data-tl-theme="<id>"]`, das Gate läuft je Theme, das Specimen schaltet um),
  **Engine (`UIThemeService`) offen, Issue #16** — skalen.md „Themes: eine dritte Achse“
* `derive`, Rest aus dem Abschluss-Review (25.09.), kein Fehlverhalten, nur Hinweise: (1) der Kollaps-Hinweis
  „surface-brand, -hover und -active“ fällt bei geliefertem `blue-49` weg, weil die Suffixe keine Rollennamen sind;
  (2) die 20°-Prüfung meldet auch achromatische Flächen (unbunte Marke) — Chroma < 0,02 ausnehmen;
  (3) Wiki „Übersicht“ nachgezogen am 25.09. (Stufe A gebaut, derive, Graurampe)
* Token-Mapper — Miniprojekt, Browserwerkzeug für Kunden-Styleguides
* Figma-Push aus `tokens.dtcg.json`
* Maven-Wrapper für das Paket; bis dahin kopiert `tools/publish-to-worktree.mjs`
* TSX-Lint-Regel (kein Hex, kein `style={{ color }}`, nur `tl-`-Klassen)
* Prüfung in der laufenden Demo-App (Browser); bisher ist nur das Specimen im Browser geprüft
* Spec §5 `overflow: hidden` an Behältern mit fokussierbaren Kindern ist statisch nicht prüfbar —
  wird ein DOM-Test im Specimen, kein Klassen-Gate

## Der Schnitt vom 17.09.

Die Werkzeuge zur Abbildung des alten Themes (`abbildung.json`, `stellen.json`,
Vergleichsansicht) sind nach `docs/migration/altlast.md` exportiert und gelöscht. Begründung in
`docs/skalen.md` unter „Der Schnitt vom 17.09.“. Die Skalen selbst sind unverändert; nur die
Namen sind neu (Englisch, Präfix `tl`, geschlossene Kategorien).

## Entschieden, alles begründet in `docs/skalen.md`

| | Entscheidung |
|---|---|
| Elevation | Fläche plus Schatten — hell trägt der Schatten, dunkel die Fläche |
| Dark | zweite vollständige Palette, nichts wird geerbt |
| Rampenregel | Sättigung zurücknehmen statt klemmen |
| Rampenrichtung | Gedrücktes tritt zurück |
| Beschriftung | je Fläche erzeugt, nie geschrieben (`text-on-brand`, `text-on-status-*`) |
| **Marke** | **`#0B5ED7`**, ausdrücklich vorläufig |
| Grundfläche | `#FAFAFA`, neutral |
| Rahmen | vier Stufen: `border-separator`, `-control`, `-emphasis`, `-interactive` |
| Neutrale | aus der Anforderung gestuft, nicht nach gleichem Abstand |
| Semantik | vier Bedeutungen × vier Rollen: `status-{error,warning,success,info}-{text,border,surface,subtle}` |
| Schrift | Inter bleibt; Kundenschriften siehe Issue #12 |
| Typo-Größen | sechs Stufen in `rem`, Untergrenze 12 px, Zeilenhöhen auf dem 4-px-Raster |
| Typo-Klassen | neun `.tl-type-*` statt blanker Größen; `.tl-nums` in Zahlenspalten ist Pflicht |
| Schriftfamilien | Inter + JetBrains Mono, beide lokal, beide mit Fallback-Stack |
| Druck | eigene Leiter in `pt`, vier `.tl-print-*`-Klassen |
| Radius | zwei Stufen (4/8 px) plus Pille und Kreis; bedient → sm, umschließt → md |
| Elevation-Stufen | drei Schatten, und **nur** Schwebendes bekommt einen |
| Helle Flächen | trennt der Rahmen, nicht der Schatten; `surface-overlay` neu |
| Fokus | ein Ring: `outline` 2 px, Offset 2 px, solid, nur `:focus-visible` |
| Motion | drei Dauern, drei `cubic-bezier` plus `linear`, ein globaler Reduced-Motion-Schalter |
| Abstände | sieben Stufen, `space-sm` (12 px) neu eingefügt; relative Namen |
| Dichte | zwei Stufen, `data-tl-density`, Schriftgröße bleibt in beiden gleich |
| Komponenten-Maße | `size-control` je Dichte, `size-row` abgeleitet (Control + 4 px) |
| Einheiten | `rem` für alles Skalierende, `px` nur für Linien |
| Rahmenbreiten | zwei: 1 px und 2 px; der breite Balken ist `border-width-accent` |
| Markenrampe | keine Stufen, zwei getönte Rollen: `surface-brand-subtle` und `-hover` |
| Info-Ton | türkis statt blau — ΔH 48,5° zur Marke |
| Icons | drei Stufen nach Rolle plus Glyph; die Trefferfläche ist eine Control-Höhe |
| Disabled | vier Rollen ohne Gate, von WCAG ausgenommen |
| Scrim und Ebenen | `surface-scrim` mit Deckkraft; sechs Ebenen `layer-*` statt literaler `z-index` |
| Zwei Schichten | Primitive tragen Werte, Tokens nur Referenzen; Präfix `--tl-` |

## Was das Gate im Altbestand gefunden hat

| Befund | Wert |
|---|---|
| `text-inverse` auf `background-inverse`, dunkel | **1,13** — Weiß auf Fast-Weiß |
| Feldumrandung `border-subtle`, beide Modi | **1,70** / 1,63 statt 3,0 |
| `support-warning` als Text, hell | **2,27** |
| `support-success` als Text, hell | 3,04 |
| `text-placeholder` auf `field`, hell | 2,04 |
| Snackbar-Erfolg, hartkodiertes `#fff` | 3,17 |
| Beschriftung auf `button-primary`, dunkel | 2,80 |

**Dreimal dieselbe Ursache:** ein Token mit mehreren Aufgaben, und die schwächste Anforderung
gewinnt. Die neue Skala löst jedes dieser Tokens in Rollen mit je einer Aufgabe auf.

## Werkzeuge

Siehe `CLAUDE.md`. Alles in `design-system/`, alles mit `node`, keine Abhängigkeiten.

## Offene Fäden

* PRs **!1618** und **!1621** im Framework sind verifiziert, aber weiterhin ungemergt.
* Issue **#13** hält fest, dass Kunden-Theming, Storybook und Accessibility beim Umschreiben ihr
  Issue verloren haben. Der Scope-Teil des Kunden-Themings ist seit 24.09. Issue #16 (dritte Achse).
* Zwei Commits von Welle 0 (`5ab2ae3`, `6d709f4`) tragen den Trailer eines anderen Modells; ein
  Umschreiben der Historie wurde nicht durchgeführt.

## Planung

Arbeitspakete als Gitea-Issues: https://git.top-logic.com/TopLogic/tl-design-system/issues
Präsentation: `docs/praesentation.md` — 15 Folien. **Wird bei jeder Entscheidung mitgezogen.**
Spec: `docs/superpowers/specs/2026-09-17-design-system-neuaufbau-design.md`
Plan Welle 0: `docs/superpowers/plans/2026-09-17-welle-0-paket.md`
Spec und Plan Welle 2: `docs/superpowers/specs/2026-09-30-welle-2-formulare-design.md`, `docs/superpowers/plans/2026-09-30-welle-2-formulare.md`
Plan UI-Paket: `docs/superpowers/plans/2026-09-25-ui-paket.md`
Arbeitsliste Wellen 1–5: `docs/migration/altlast.md`
