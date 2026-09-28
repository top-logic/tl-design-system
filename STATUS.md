# Stand

**Letzte Sitzung:** 2026-09-28 (Konsolidierung: eine Linie, UI-Paket mit #29643 abgestimmt) · **Basis:** `tl-engine-7@master` (TopLogic 8.0.0-SNAPSHOT) ·
**Specs:** `docs/superpowers/specs/2026-09-17-design-system-neuaufbau-design.md`,
`docs/superpowers/specs/2026-09-25-derive-design.md`,
`docs/superpowers/specs/2026-09-25-ui-paket-design.md`

## Zuerst

**Entschieden (28.09.): eine Linie, drei Stränge.** Plan `docs/superpowers/plans/2026-09-28-konsolidierung.md`.
Strang 0 schließt Welle 1 (**!1694 gemerged am 28.09.**, Merge-Commit `c38ad05ddd`, Pill-Branch gelöscht; !1695
steht jetzt auf Basis `master` und ist mergeable; !1695 hat
Request Changes mit drei Punkten: px im JavaDoc von `IconSize`, `lg` unlesbar, `size="xl"` in der Bild-Demo —
Entscheidung mit Hendrik 28.09.: zwei Namensräume — extern ganze Wörter `small|medium|large|x-large`, im Paket die Skalenkürzel; Umsetzung in Task 2 des Plans, noch nicht begonnen). Strang 1
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
(`d3c33be37f..532e5f1895`); PR [!1710](https://git.top-logic.com/TopLogic/tl-engine-7/pulls/1710) auf master,
Bernhard Reviewer (Request gesetzt). Ledger `.superpowers/sdd/2026-09-25-ui-paket/progress.md`.
Gruppen B, C, E warten auf den Merge von !1698 (msgbuf 1.2.3). Gruppen B/C/E warten auf den Merge von !1698
(blockiert auf msgbuf 1.2.3).

**Welle 1 (Button) ist auf `master`.** PR [!1649](https://git.top-logic.com/TopLogic/tl-engine-7/pulls/1649)
wurde am 23.09. gemerged (Merge-Commit `0fa0085060`). Der Weg dahin: drei Build-Nachbesserungen
(`1041fb64d4` Token-Audit kennt `tokens.css`, `64f5c32b33` Resource-Keys, `2900f5ded1` der Build erzeugt
`messages_en.properties` aus dem JavaDoc) und zwei Merges von master (`9c3d023936`: #29626 kollabierende
Toolbar übernimmt den Kollaps zum Icon, `collapseToIcon`/`AppShellContext` gestrichen; `b88ac7dbb1`: #29497
Bridge-Tooltips, #29596 `rootClassName`, Audit-Tests im master-Stand). Der Worktree stand danach auf `master`, der
Branch dieses Merges ist gelöscht. Ratsche damals: 79 Blöcke, Summe 7404 Zeilen — alles Fremdzuwachs seit 5766.
Seither ist der Worktree weitergezogen: er steht auf `CWS/CWS_29617_design_system_welle_1_avatar`, und die
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

**Worktree:** `~/git/tl8-wt-29584` steht derzeit auf `CWS/CWS_29617_design_system_welle_1_avatar`; die Ratsche
ist gegen diesen Stand kalibriert. Vor Pill-Arbeit erst zurück auf den Pill-Branch wechseln.

**PR-Stand 25.09. mittags:** !1618 (doppeltes React) gemerged, Branch gelöscht. !1694 (Pill): Bernhard hat am
25.09. 07:41 approved („Na gut – wir werden sehen wo's hinführt“), das Approval gilt seit dem `messages_en`-Commit
`c637a17e7e` als stale; Build 16232 grün; Merge braucht Bernhards erneutes Approval (Klassifikator lehnt den Merge
ohne ab). !1695 (Avatar): Bernhards Review „erster Enum-Wert ist der Default“ beantwortet mit `81f80b3f0e`
(`MEDIUM` vorn, `@FormattedDefault` weg, `messages_en` neu erzeugt — Build 16225 war daran gescheitert);
Merge-Reihenfolge im PR vorgeschlagen: erst !1694, dann !1695 auf master rebasen.

Jetzt:

1. Bernhards erneutes Approval auf !1694 abwarten, dann mergen; dann !1695 (Avatar + Progress + Icon) auf master
   rebasen, Basis umstellen, Docker-Instanz sichtprüfen (Kommentarköpfe, Bild-Demo `xl`, Fortschrittsbalken in
   Objektliste und Long-Job-Demo, unbestimmt mit und ohne Reduced Motion); nach dem Merge Worktree auf `master`, Branch löschen, Ratsche
   gegen master prüfen, Pill-Absatz in altlast.md als gemerged markieren.
2. Nicht geprüft, offen: AppBar-Kollaps bei Platzmangel, AppBar auf `surface-layer`, `ButtonTone.DANGER`
   (kein Aufrufer — `setTone` einmal setzen).
3. Welle 1 abschließen: nach den Merges Ratsche gegen master, Welle-1-Abschnitt in altlast.md; dann Welle 2 (Eingabefelder, Select) planen — Befunde stehen in altlast.md „Sichtbare Befunde“.

Das Repo liegt jetzt unter `TopLogic/tl-design-system`; Wiki (Home, Übersicht, Anleitung Komponenten mit
Claude, Regeldatei) ist der Einstieg für Bernhard, `docs/*.md` die gepflegte Quelle.

Offen, nicht blockierend: Trailer der Commits `5ab2ae3`/`6d709f4` bleiben stehen. Aus dem Final-Review für
spätere Wellen: `surface-overlay` ins Kontrast-Gate (Welle 4), Icon-Schrift im Specimen, zwei
`--layer-accent`-Leser außerhalb der AppBar (Avatar, Dirty-Dot), Element-Modifier im Gate, TSX-Lint-Regel.

## Wo anknüpfen

**Welle 0 ist umgesetzt.** Das Paket `design-system/` liefert `dist/primitives.css`,
`dist/tokens.css`, `dist/base.css` und `dist/tokens.dtcg.json`. `cd design-system && node --test`
ist das Gate — **95 Tests, alle grün**. `node tools/lint-css.mjs` ist das Klassen-Gate,
`test/ratchet.json` das Budget des alten Stylesheets (5766 Zeilen nach Welle 1 Final-Review, Budget davor 6088 nach
einmaligem Fremdzuwachs aus #29597, darf nur sinken) und die Einfang-Liste `foreignTl` der vier fremden
`--tl`-Namen im Altbestand.

Die Demo-App lädt die drei Dateien als `ClientResources` und setzt `data-tl-mode` und
`data-tl-density` am `html`. Das ist mit PR !1641 auf `master` (Commits `2a8ac53c8`, `fa851a4ef`, Merge `59404c7f`); verifiziert wurden
CSS-Reihenfolge, `data-tl-mode`/`data-tl-density` samt Theme-Wechsel und System-Modus, `TestUIThemeService` 9/9,
Jenkins-Build, kein Layoutbruch.

**Prüfliste für die Wellen:** `docs/migration/altlast.md`, Abschnitt „Sichtbare Befunde aus der laufenden
Anwendung“ — sieben Kontrast- und Fokusbefunde aus dem Darkmode, je Welle zugeordnet. Lightmode und Dichte
sind noch nicht erhoben.

**Nächster Schritt: Welle 1.** Button, ToggleButton, Pill, Avatar, Progress, FontIcon. Je
Komponente: CSS nach `src/components/`, Klassen im TSX umbenennen, Zustände auf Attribute,
`className` durchreichen, Specimen, Vertrag, Gate grün, alter Block in `tlReactControls.css`
gelöscht. Der Button ist die Vorlage. Arbeitsliste: `docs/migration/altlast.md`.

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
Präsentation: `docs/praesentation.md` — 30 Folien. **Wird bei jeder Entscheidung mitgezogen.**
Spec: `docs/superpowers/specs/2026-09-17-design-system-neuaufbau-design.md`
Plan Welle 0: `docs/superpowers/plans/2026-09-17-welle-0-paket.md`
Plan UI-Paket: `docs/superpowers/plans/2026-09-25-ui-paket.md`
Arbeitsliste Wellen 1–5: `docs/migration/altlast.md`
