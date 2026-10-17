**Letzte Sitzung:** 2026-10-17 (SDD 4c, Tasks 1–12 gebaut, Push offen) · **Basis:** `tl-engine-7@master` (TopLogic 8.0.0-SNAPSHOT) ·
**Specs:** `docs/superpowers/specs/2026-09-17-design-system-neuaufbau-design.md`,
`docs/superpowers/specs/2026-09-25-derive-design.md`,
`docs/superpowers/specs/2026-09-25-ui-paket-design.md`

## Zuerst

Lagebild: http://localhost:8138/

**Wartet auf Bernhard (nichts selbst tun, außer er antwortet):**
1. **!1852** (#29825 Spaltenwahl, trägt seit 14.10. 19:01 auch Welle 4a): **3b (!1838) ist seit 14.10. auf master**, !1882
   (4a) von Bernhard freigegeben, in die Spaltenwahl gemergt (Jenkins 138 grün). Bernhards Claude meldete 14.10. 19:21
   Konflikte mit master (#29792 Standard-Übergänge) und vier Fragen. **Gelöst und gepusht 15.10.** (Engine `b228f6a8d4..1419fb49fe`): `54f593ed17` (4a in die Spaltenwahl),
   master-Merge `76afcad8c2` (master `2e9619c6ad`): Dialog-Fade bleibt beim Paket (`data-tl-state`), `transition.ts`
   übernimmt Sofort-Ende und den Marken-Wächter je Attribut (`class` oder `data-tl-state`), Kachelstapel-Slide in der
   Engine statt in der Demo; `1419fb49fe` zieht `app-shell.md` nach. Ratsche TLTileStack 38→76, TLWizard 183→185 (#29792).
   Gates: Paket 386/0, react 674/0, configedit 341/0, view 1457/1 (#29651), demo.react 13/0, `tsc` 0, Vite grün, Messages
   ohne Diff. Der Server-Hook lehnte zuerst ab: jeder neue Commit in `CWS_29825` muss `#29825` tragen, unser lokaler
   4a-Merge `9626e67a15` trug `#29836` — Merges mit gleichem Baum neu gebaut. Basis von !1852 auf master, PR-Text
   nachgezogen (Reset stellt die deklarierten Spalten wieder her), Antwort an Bernhard, `bhu` und `jenkins` angefragt.
   Der Worktree `tl8-wt-29584` steht ohne Branch auf `1419fb49fe` (Paket-Gates prüfen dort). Jenkins 148 grün.
   **Review 15.10. (Bernhard, Request Changes):** fixieren und ausblenden waren unabhängig — der Dialog zeigte
   „fixiert und ausgeblendet“, die Tabelle vergaß es. Hendrik entschied Weg A: gekoppelt, bis #29828 den vollen
   Tabellenzustand bringt (`skalen.md` „Nachgetragen im Review !1852“). Engine `b6bf05bbc2` lokal: Ausblenden löst,
   Fixieren (Schloss oder Ablegen im Block) blendet ein, Namen „… einblenden und fixieren“ / „… ausblenden und Fixierung
   lösen“, Fokus bleibt auch am Auge; `62aec19ae3`/`c7879859bb`: Tooltips an Auge und Schloss ohne Spaltennamen (Hendrik); gepusht bis `62aec19ae3`, Antwort an Bernhard steht (Hendrik aktualisiert sie selbst). Gates: react 677/0, Messages-Diff erzeugt und committet, Paket 386/0, `tsc` 0;
   Sichtprüfung lokal (Name fixiert → Auge zu → gelöst, Schloss → eingeblendet und fixiert, Ok und neu öffnen hält).
   Gepusht bis `c7879859bb`, Antwort an Bernhard steht.
   **master-Merge mit #29787 (Parts, 15.10.):** Konflikte in TLColumnSelect, TLDrawer, TLSnackbar, tlReactControls.css;
   Merge `39a6657d37` (Schloss, Auge, Schließknöpfe über den Part `Button`), `9a5cab25c9` (sechs Fremdstellen aus
   #29787 ins Paket: tl-spinner, tl-toggle--end, tl-chip__detail, tl-menu__separator/tl-toolbar__separator,
   tl-table__columns, tl-alert__close; MUI-Tests nachgezogen). Hendrik: „2“ = gleich sauber ins Paket. `skalen.md`
   „Parts: Bernhards Atome zeichnen mit dem Paket“. Gates: Paket 386/0, react 677/0, configedit 341/0, view 1457/1
   (#29651), demo.react 13/0, MUI-Vitest 506/506 (mit `NODE_OPTIONS=--no-experimental-webstorage`), Messages ohne Diff.
   **Nächstes:** Push mit Freigabe, Kommentar an Bernhard (Entwurf im Scratchpad: Tabelle der sechs Stellen, Vorschlag
   Paket-Gates in den Engine-Jenkins), `bhu` neu anfragen.
2. Branch `CWS/CWS_29836_design_system_welle_4a`: erledigt, 4a steckt über !1882 in der Spaltenwahl; der lokale
   Merge `9626e67a15` wird nicht gepusht. Ticket #29836 schließt mit dem Release, sobald !1852 auf master ist.
3. **#29851** (Snackbar-Ansage): wartet.
4. **!1841** (#29815): 13.10. auf master, in 3b als `data-tl-role` eingearbeitet.
5. **#29850** (Entwicklerdoc): drei Fragen im Ticket, 14.10. — die wichtigste: wo Kundenthemes leben.

**Wenn er antwortet:** Befunde einarbeiten, Gates, lokal committen, Push nur mit Hendriks Freigabe (Repo und Branch
nennen; nie tl-engine-7 master), danach `add_reviewers bhu`.

**master-Merges:** Bernhard merged master auch selbst in unsere Branches — vor eigener Arbeit dort `git fetch`.

**Welle 4 begonnen (13.10.):** Konsolidierungs-Prognose Q1–Q19 in `altlast.md` („Welle 4“), entschieden „alle wie
vorgeschlagen“; Schnitt **4a Overlays** (Trac **#29836**, accepted, CC bhu) und **4b Gerüst** (Trac **#29866**). Graphify einmal gelaufen, ohne neuen Befund, gelöscht. **Fertig zur Umsetzung:** Spec
`docs/superpowers/specs/2026-10-13-welle-4a-overlays-design.md` (von Hendrik abschnittsweise freigegeben, §13 trägt die
Nachträge aus dem Planen), Plan `docs/superpowers/plans/2026-10-13-welle-4a-overlays.md` (elf Tasks, Plan-Review durch
Fable mit Probelauf: Lint grün, `tsc` 0, Befunde eingearbeitet). **Entschieden:** Branch
`CWS/CWS_29836_design_system_welle_4a` auf `origin/CWS/CWS_29825_design_system_spaltenwahl` (auf 3b wäre das
Paket-Gate der Spaltenwahl rot), Merge-Reihenfolge 3b → Spaltenwahl → 4a; Ausführung **Subagent-driven**.
**Stand 14.10.: 4a gebaut, gepusht, PR [!1882](https://git.top-logic.com/TopLogic/tl-engine-7/pulls/1882)** gegen
`CWS/CWS_29825_design_system_spaltenwahl` (Engine-Head `e29345b7a8`, Paket `main` bis `70f5b3e`), Reviewer bhu und
`jenkins`. Gates: Paket 386/0, Lint grün, `tsc` 0, Vite grün, Maven `layout.react` 612, `demo.react` 13, `layout.view`
nur #29651 rot, Messages ohne Diff. Sichtprüfung lokal erledigt (Befund S1 Dialoghöhe behoben). Trac #29836 hat
`== Migration ==` und `RequiresMigration`. Rulings stehen in `altlast.md` „Welle 4a“, der Ledger ist gelöscht.
**Entschieden 14.10.:** Startfokus verlegt (Engine `e29345b7a8`, gepusht, PR-Text nachgezogen, bhu und `jenkins` erneut angefragt; skalen.md „Der Startfokus liegt dort,
wo Enter wirkt“); Snackbar-Ansage als Folgeticket **#29851** (CC bhu). Rest-Minor: Kommentar `tlReactControls.css:2263` zur leeren
NoticeBar veraltet. **15.10.:** !1882 in die Spaltenwahl gemergt, weiter über !1852 (oben, Punkt 1).

**#29850 (angelegt 14.10., accepted, CC bhu):** Die Regeln fürs Stylen von React-Controls kommen als Entwicklerdoc
nach tl-engine-7 (`view-layer/design-system.md`), `theme-tokens.md` verweist darauf und führt die alten Tokens als
Altbestand, eine Zeile in der Engine-`CLAUDE.md`. Die Regeldatei wird **nicht** in die Engine kopiert (widerspräche
`theme-tokens.md`, setzt das Paket-Repo voraus, schließt MUI nicht aus); die Anleitung empfiehlt sie als persönlichen
Skill. **Entwurf steht (14.10.):** `docs/uebergabe/2026-10-14-29850-entwicklerdoc/` (Artikel `design-system.md`,
überarbeitete `theme-tokens.md` mit Diff, Zeile für die Engine-`CLAUDE.md`, drei offene Fragen an Bernhard — die
wichtigste: Kundenthemes in `tl-react-theme.config.xml` erreichen umgestellte Controls nicht mehr). Gepusht, Fragen
als Kommentar in #29850 an Bernhard (14.10.). **Nächstes:** seine Antwort; nach Abstimmung Engine-Branch `CWS/CWS_29850_…`.

**16.10. — DOM-Test `focus-clip.test.mjs` (Paket `main`):** misst im Browser jeden Fokusring jeder Specimen-Seite in
beiden Dichten gegen schneidende Vorfahren (`skalen.md` „gemessen statt gelesen“). Fand die leere Tabelle: Ring
des Rasters, des Körpers und der Spaltenwahl von `tl-table` abgeschnitten — jetzt innen. Paket 388/0. Die
Worktree-Kopie (`components.css`) liegt als erster Commit `1fdae596a9` auf dem 4b-Branch, nicht in !1852. `derive`-Hinweise danach erledigt (Kollaps-Text, `UNBUNT_C`). Weiter: 4b.

**Welle 4b gestartet (16.10.):** Trac **#29866** (accepted, CC bhu). Engine-Branch
`CWS/CWS_29866_design_system_welle_4b` im Worktree `tl8-wt-29584`, lokal, auf `origin/…_spaltenwahl` (`f9d0a99ab0`),
nicht gepusht. **Schnitt entschieden (Hendrik, 16.10.):** 4b = Navigation (AppShell, AppBar, Sidebar,
BottomBar, ~550 Zeilen Altbestand), 4c = Behälter (~780, eigenes Ticket beim Start) — zusammen ~1.330 Zeilen, das Dreifache
von 4a. Ticket #29866 auf Navigation umbenannt, Kommentar dazu. **Spec steht (16.10.):**
`docs/superpowers/specs/2026-10-16-welle-4b-navigation-design.md`, mit Hendrik Abschnitt für Abschnitt entschieden
(Breakpoint nur in der AppShell, Sidebar kompakt als modaler TLDrawer; `size-shell-bar` 48/40; aktuelle Seite als
Fläche, auch am Kopf einer zugeklappten Gruppe; `--elevated` als Linie; `tl-badge--corner`); `skalen.md` „Welle 4b:
Navigation“, Präsentation nachgezogen. Spec von Hendrik freigegeben. **Plan steht:** `docs/superpowers/plans/2026-10-16-welle-4b-navigation.md` (zehn Tasks,
zehn Abweichungen beim Planen gefunden, u. a. `tl-icon-badge` statt `tl-badge--corner`, Hamburger mit Zustand vom
Server). Plan-Review (Fable, 16.10.) mit Probeläufen in Kopien:
Paket 416/417 (nur `published` erwartet rot), `tsc` 0, Vite grün, MUI-Vitest 507/507, Java-Test 2/2; zehn Befunde
eingearbeitet (Kopf des Plans). Hendrik: „plan sieht gut aus“, **nicht automatisch starten**.

**4b gebaut (16.10., Tasks 1–8), lokal, nicht gepusht; Sichtprüfung (Task 9) offen.** Engine-Head `6cd6fcf9ff`
(Branch `CWS/CWS_29866_design_system_welle_4b`), Paket `main` bis `ffbe602` (Ratsche, Engine-Gate,
altlast, Spec und `skalen.md` an die Abweichungen). Gates: Paket 418/0, Lint grün, Ratsche `lines` 3698 → 3145 (fontSize
28, duration 20, zIndex 11, color 67, outlineNone 8), Maven `layout.react` 679/0, `layout.view` 1457/0 (unter englischer
Locale; deutsche Locale rot an `TestAll.testSectionsReachTheClient`, #29651-Art), `demo.react` 13/0, Messages-Diff
einmal (`js.bottomBar.ariaLabel`, Sidebar-Tooltip) committet, zweiter Lauf ohne Diff. Der 768-Test fand nur `TLAppShell.tsx`.
Trac #29866: `== Migration ==` und `RequiresMigration` gesetzt, Beschreibung auf Navigation eingegrenzt (Behälter → 4c).
Sichtprüfung (Task 9) 16.10. bestanden, Befunde S1–S5 in `altlast.md` „Welle 4b“ (S4 behoben: Drawer gleitet herein; S2 AppBar-Ende bleibt, Randfall unter 300 px). Gepusht 16.10. (Paket `main` bis `a585b8f`, Engine-Branch bis `b6df949d58`). Danach war !1852 auf master (`b36e6a55b8`); master in 4b gemergt (`ac094d5c5d`), Konflikt nur in der Paketkopie: Bernhards Haken der Einfachauswahl (#29859, `tl-select__option-check`) direkt in `components.css` — ins Paket übernommen (`select.css`, Vertrag), Kopie wieder byte-gleich. Gates: Paket 419/0, `tsc` 0, MUI-Vitest 510/510. **Kopie versiegelt (16.10., Hendrik):** `generate` hängt jeder CSS-Datei ein SHA-256-Siegel an, `TestDesignSystemCopy` (Engine, `layout.react`) prüft es in Jenkins — rot ohne Siegel, grün nach `publish`, rot nach Handänderung; `skalen.md` „Die Kopie in der Engine ist versiegelt“. Gates: Paket 422/0, `layout.react` 680/0. Gepusht 16.10. (Paket `main` bis `a918ab6`, Engine bis `9c6776f258`), **PR [!1906](https://git.top-logic.com/TopLogic/tl-engine-7/pulls/1906)** gegen master, Reviewer `bhu`; `jenkins` erst, wenn keine Änderungen mehr folgen. Weiter: Bernhards Review.

**Welle 4c gestartet (16.10.):** Trac **#29870** (accepted, CC bhu). Engine-Branch
`CWS/CWS_29870_design_system_welle_4c` im Worktree `tl8-wt-29584`, lokal. **!1906 ist auf master** (`2bf2151a2e`, 16.10.);
der 4c-Branch ist per Fast-Forward auf master vorgezogen. master brachte !1905 (#29755, Bernhard: auswählbare
Einträge in `items.tsx` — `renderItems` → `useItems`, `.tlItem--selectable/--selected` mit `--shadow-raised`) und #29713
(`.tlDashboard__hide`); Ratsche mit Vermerk gehoben (Repeated items 20→48, Dashboard 84→96, duration 20→21,
zIndex 11→12), Paket 422/0. Der Plan (Task 8) muss auf `useItems` und die Auswahl nachgezogen werden.
Prognose Q3, Q7, Q8, Q13–Q23 (`altlast.md` „Welle 4c“) von Hendrik angekreuzt: alle wie vorgeschlagen. **Spec-Entwurf
steht:** `docs/superpowers/specs/2026-10-16-welle-4c-behaelter-design.md`; elf beim Schreiben getroffene Entscheidungen
in §12. **Spec freigegeben 16.10. (Hendrik)**, mit Weg B (Karte: Stufe nach Verschachtelung) und den Bedien-Gewinnen
U1–U3 (Doppelklick Panelkopf/Escape, Doppelklick Split-Griff, Klick auf ganzen Kopf öffnet minimiertes Panel);
`skalen.md` „Welle 4c: Behälter“, Präsentation nachgezogen. **Plan steht (16.10.):**
`docs/superpowers/plans/2026-10-16-welle-4c-behaelter.md` (zwölf Tasks, 16 Abweichungen beim Planen, zwei Fragen an
Hendrik am Planende — beide wie empfohlen: ViewError ohne Monospace; nur was eine Fläche malt, hebt die Stufe,
`panelSurface`). Plan-Review 1 (Fable, Probelauf Paket 469/476, Engine `tsc` 0): Befunde 1–13, f eingearbeitet
(`6ffad95`; u. a. Kopfhöhe per `padding-bottom`, Ring des Container-Drawers innen, End am Spaltengriff = passend).
Nach dem Merge von !1906 auf master `2bf2151a2e` nachgezogen (`useItems` aus #29755) und **Q24** entschieden
(auswählbare Einträge: Hof beim Zeigen, Ring bei `aria-selected`; `2ad291d`). Plan-Review 2 (Fable, 474/480, MUI
513/516 nur erwartet rot): Befunde 1–5 eingearbeitet (`bcbfda2`). **Bereit für die SDD. Start freigegeben (Hendrik 17.10.): alle zwölf Tasks in einer neuen Sitzung**, Subagent-driven.
In der Sitzung vom 16.10. war die Trac-Anbindung (MCP) getrennt — vor Task 12 prüfen.
**4c gebaut (17.10., SDD Tasks 1–11, Task 12 bis auf Trac und Push), lokal, nicht gepusht.** Engine-Branch
`CWS/CWS_29870_design_system_welle_4c` bis `fba772fb0f` (16 Commits auf master `2bf2151a2e`), Paket `main` mit den
Commits der Welle vor `origin/main`. Jeder Task reviewt, Abschlussprüfung der ganzen Welle (Opus): bereit nach Fixes,
Fixes eingearbeitet und nachgeprüft (Split-ARIA, Panelkopf ohne Textmarkierung, Doku der Übergänge, Panel-Vertrag).
Gates: Paket 481/0, Lint grün, Ratsche `lines` 3185 → 2405 (14 Blöcke gestrichen, TLAccordion ins Paket); Maven
(JDK 21, englische Locale) `layout.react` 706, `layout.view` 1493, `demo.react` 13 grün; MUI-Vitest 531; `tsc` 0;
Messages ohne Diff. Sichtprüfung lokal (Task 11) in `altlast.md` „Welle 4c“, Befunde S1–S5.
Ledger mit allen Rulings, deferred Minors und Triage: `.superpowers/sdd/2026-10-16-welle-4c-behaelter-plans/`
(`progress.md`, `final-review.md`, Entwurf `trac-29870-migration.txt` für `== Migration ==`).
**Offen für Hendrik (17.10., „Entscheidungen aufsparen“):**
1. **Escape im maximierten Panel gegen Popups am Keyboard-Dispatcher** (ColorPopup, IconSelectPopup, Drawer,
   PhotoCapture verlieren Escape an das Panel). Weg A: Panel-Escape als Scope im Dispatcher, nur solange maximiert
   (Empfehlung, auch der Abschlussprüfung); Weg B: die Popups verhindern Escape selbst. Heute erreicht keine View das
   Maximieren (S5).
2. **Wizard-Zähler** nur `aria-hidden`, wenn die Schrittliste steht (Vorgabe: Liste aus, Zähler an — dann erfährt ein
   Screenreader die Position nur als Prozent). Empfehlung ja; ändert TLWizard und `wizard.contract.md`.
3. **S2** Fokusring und Auswahlring einer Karte kaum zu unterscheiden; **S3** Hof beim Zeigen sehr schwach.
4. Danach: Trac #29870 `== Migration ==` und `RequiresMigration`, Push (Engine-Branch `CWS/CWS_29870_…`, Paket
   `main`), PR gegen master mit den Hinweisen an Bernhard aus Plan Task 12 Step 2 (Accordion im Paket, `MuiCardAdapter`
   ohne `useSurface`, Breadcrumb als Part wäre seine Entscheidung, Q24-Auswahl) und S5; Reviewer `bhu`.
Die lokale Demo lief zur Sichtprüfung (Port 8080) — vor einem Neubau beenden.

**Weitere Kandidaten, solange gewartet wird (Hendrik entscheidet):** #29826 „Ziehen sichtbar“ erst nach Merge von !1825;
#29828 (Tabellenzustand) mit Bernhard abstimmen; offene Kleinpunkte der Spaltenwahl in `altlast.md` (Firefox-Tooltip,
axe auf `li role="presentation"`, `format()` dreifach).

## Gesamtplan: alles, was bis zur Abnahme offen ist

Das Lagebild (http://localhost:8138/) liest diesen Abschnitt für Fortschritt und Gesamtkontext. Bei jeder Änderung des
Stands nachziehen. Quellen: Spec §4 und „Abnahme“, `skalen.md` „Welle 4“, `altlast.md`.

**Wellen** (Phase: master · PR · gebaut · geplant · offen; Teile = Komponenten laut Spec §4 und Schnitt, Gewicht im Fortschrittsbalken):

| Welle | Inhalt | Teile | Phase | Ticket |
|---|---|---|---|---|
| 0 | Paket: Primitive, Tokens, Base | 3 | master | #29617 |
| 1 | Button, ToggleButton, Pill, Avatar, Progress, Icon | 6 | master | #29617 |
| 2 | Formulare (Felder, Select, Checkbox, FormField, FormLayout …) | 11 | master | #29617 |
| 3a | Menü, Toolbar, Reiter, Breadcrumb, Popups, Ton folgt der Aktion | 5 | master | #29617 |
| 3b | Tabelle, Baum, Text (!1838, auf master 14.10.) | 3 | master | #29821 |
| 4a | Overlays: Dialog, DialogManager, Fenster, Drawer, Snackbar, NoticeBar, Overlay; mit der Spaltenwahl als Ebenen-Panel in !1852 (auf master 16.10.) | 7 | master | #29836, #29825 |
| 4b | Navigation: AppShell, AppBar, Sidebar (mobiler Drawer, Flyout), BottomBar; Q10–Q13, Leiste aus Q14 (!1906, auf master 16.10.) | 4 | master | #29866 |
| 4c | Behälter: Panel, SplitPanel, Card, Stack, Grid, DeckPane, TileStack, Inset, AdaptiveDetail, Accordion, Wizard, ViewError; Q3, Q7, Q8, Q13–Q23 | 12 | gebaut | #29870 |
| 5 | Calendar, ColorInput, IconSelect, Medien (Audio, Photo, PDF, Upload N3), Dashboard; fremde `tl…`-Stylesheets (`TLWysiwygEditor.css` u. a.), Ebene `layer-drag`, `drop-hint`; danach `tlReactControls.css` gelöscht | 8 | offen | — |

**Abnahme außerhalb der Wellen** (Spec „Abnahme“):

| Punkt | Teile | Phase | Wo |
|---|---|---|---|
| Kundenprojekt Stufe A in der Demo-App gezeigt (JSON mit Hausfarbe → `derive` → Gate grün → Kundenlook) | 1 | offen | Spec §3 |
| Themes in der Engine: `UIThemeService` setzt `data-tl-theme` (Paketseite fertig) | 1 | offen | Issue #16 |
| Tokens in Figma, Modi Hell/Dunkel, Blattnamen = Tokennamen | 1 | offen | Issue #7 |
| TSX-Lint: kein Hex, kein `style={{ color }}`, nur `tl-`-Klassen | 1 | offen | Issue #9 |

**Offen zu entscheiden** (Hendrik):

* Wo `derive` rechnet — Bauzeit, Browser oder Theme-Editor (Bernhards TL-Script-Einwand 25.09.; Empfehlung
  Theme-Editor; Übergabe `docs/uebergabe/`).
* Dichte-Schalter in der Oberfläche (Issue #18; Kandidat Benutzermenü unter der Themewahl).
* Icon-Bibliothek: Wechsel z. B. auf Lucide prüfen; bis dahin bindet nichts an Glyphnamen.
* Kunden-Typografie: was bricht, wenn ein Kunde die Schrift tauscht (Issue #12).

**Nebenstränge** (ohne eigene Welle):

* #29826 „Ziehen sichtbar machen“ nach Merge von !1825; #29828 Tabellenzustand mit Bernhard; #29827 Spaltengruppen
  und Pivot bei Bernhard.
* Token-Mapper (Browserwerkzeug für Kunden-Styleguides, Spec §3); Maven-Wrapper für das Paket (bis dahin
  `publish-to-worktree`).
* Kleinpunkte je Welle: `altlast.md` „Offen für spätere Wellen und Pakete“ und „Offen nach 3b“.


**Stand 12.10.: #29825 „Spaltenwahl als Ebenen-Panel“ ist gebaut und gepusht als PR [!1852](https://git.top-logic.com/TopLogic/tl-engine-7/pulls/1852)**
(gegen `welle_3b`, Reviewer bhu, Trac-Kommentar; nach dem Merge von !1838 Basis auf master). Push nur nach Hendriks
Freigabe (CLAUDE.md, seit 12.10.; Subagenten pushen nie).
1. **Engine** Branch `CWS/CWS_29825_design_system_spaltenwahl` auf `welle_3b` (Bernhards master-Merge `2af20a4447`),
   Commits `26e1c73a0f..05a7db4cb7` (sieben): Server mit Schloss und Block „Fixiert“ (`columnLock`, ohne
   Zustandswechsel wirkungslos), Übernehmen setzt Reihenfolge und `frozenColumnCount` in einem Patch, `groupBy` fällt;
   `TLColumnSelect.tsx` als Ebenen-Panel (Fokus bleibt nach Umordnen am Schloss, nur wenn der Klick ihn gab);
   Deutsch einheitlich „fixieren“ (auch Kontextmenü); Paketkopie. Gates: `layout.react` 612/0, `tsc` + Vite grün,
   `check-messages-en.sh` ohne Diff, check-resources ohne „Not normalized“.
2. **Paket** `main` `9b0d21e..a4d189c`: `tl-reorder-list` mit `__actions/__lock/__eye/__section`, Zuständen
   `off/locked/section-end`, Beim-Zeigen-Regel (opacity, Touch immer), ausgeblendet in `text-secondary`; Vertrag,
   Specimen, Gate gegen Kästchen/Gruppieren/`aria-pressed`/`ICON_GROUP`; Doku `skalen.md` „Nachgetragen beim Bau“.
   Gates 357/0, Lint grün.
3. **Entschieden 12.10. beim Bau (Hendrik):** ausgeblendet `--tl-text-secondary` statt `--tl-text-disabled` (der Eintrag
   bleibt bedienbar); „am Platz“ gilt im Dialog — volle Reihenfolge im Tabellenzustand ist **Trac #29828** (CC bhu).
4. **Sichtprüfung lokal** (Chrome, dunkel/normal und hell/kompakt): Zeigen, Tab-Reihenfolge mit Ring innen, Schloss
   und Block, Fokus nach Lösen, Auge, Ok → fixiert und ausgeblendet in der Tabelle, Suche mit „Fixiert“, letzte
   sichtbare Spalte gesperrt mit Tooltip, Standard → nichts fixiert, Kontextmenü gruppiert und sagt „Bis hier
   fixieren“. Offen: Firefox (Tooltip am gesperrten Auge), axe auf `li role="presentation"` (altlast.md).
5. **Nächstes:** Bernhards Review auf !1852 abwarten; nach jeder Antwort `add_reviewers bhu`. Die verworfene Fassung im
   Trac-Text von #29825 ist per Kommentar richtiggestellt (Beschreibung selbst unverändert).
6. Rundherum offen: !1838 (3b) wartet auf Bernhards Review; #29826 „Ziehen sichtbar machen“ nach !1825; #29827
   Spaltengruppen und Pivot bei Bernhard; !1825/!1801/!1830 kollidieren mit !1838. Lokale Demo: Memory „Lokale Demo
   statt Docker“ (Maven aus `tl-parent-engine` mit `-pl ../<modul>`).


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

**Welle 3 — Brainstorming 01.10., drei Entscheidungen, Spec steht aus.** (1) **Zeigen auf allen Gründen:** eine Skala, dunkel hover `gray-67`, selected `gray-64` (neu), active `gray-60` (neu), hell unverändert — `skalen.md` „Zeigen auf allen Gründen“. (2) **Zustand = ARIA-Attribut, wo ARIA eins hat** (`aria-selected`, `aria-sort`, `aria-expanded`, `aria-current`; `data-tl-state` nur für Cursor, Drop-Ziele, frozen/pinned); Tabelle bekommt `role=grid`, TabBar Roving-Tabindex und Pfeile, Menü Home/End; keine Zell-Navigation, kein Typeahead. (3) **Gleiches wird zusammengelegt** — neue Regel in CLAUDE.md, `skalen.md`, Folie 10a; Prognosetabellen in `altlast.md` „Konsolidierung“, **alle Zeilen angenommen**: W1–W12, N1, N8 mit Welle 3 (inkl. Welle-2-Nachzüge Select-Popup, FormGroup-Toggle, Icon-Knöpfe, Kapseln), N7 Paket-intern **vorher**, N2+N9 eigenes Paket **nach !1740**, N3/N4 Welle 4/5. Deaktiviert-Cursor `default` überall. **Schnitt: zwei gestapelte PRs — 3a Navigation und Popups (Popover-Helfer auf floating-ui, ein Menü, Toolbar, Tabs, Breadcrumb, Fokusregel, Icon-Knöpfe, Toggle, Trenner), 3b Daten (Tabelle, Baum, ColumnSelect, Columns, Checkbox, Kapseln, Suche, DnD, Laden/Leer, Lesewert).**
   **N7 ist umgesetzt** (`6bb0862`, 245 Tests, Lint grün; Rollenfarben kommen jetzt aus dem Generator über Marker `/* @tl-roles: … */`; `dist/` ist **nicht** in den Worktree publiziert, das kommt mit 3a/E1). **3a ist entworfen, spezifiziert und geplant:** Spec `docs/superpowers/specs/2026-10-01-welle-3a-navigation-popups-design.md` (`c7a16c0`, fortgeschrieben `2db51e1`), Plan `docs/superpowers/plans/2026-10-01-welle-3a-navigation-popups.md` (16 Tasks P1–P7/E1–E9; Plan-Review durch frischen Opus-Agenten: 16 Gate-Brüche gefunden und eingearbeitet, Nachprüfung grün; Stand `273e06b`). Alpha9 (01.10.) bringt nur drei Release-Commits; `welle_2` vor Bernhards Merge mit master nachziehen.
   **SDD 3a, Paketteil P1–P7 gebaut (01.10., Hendriks Ja; Halt nach P7 auf Hendriks Wunsch — Fable-Tokens knapp).** Ledger `.superpowers/sdd/2026-10-01-welle-3a-navigation-popups/progress.md` (Briefs, Reports, Review-Pakete, alle Rulings). Paket auf `main`: P1 `07b48ab` Tokens (gray-67/64/60 dunkel, `size-popover-min/max`, `vh` im DTCG, `gray-73` weg), P2 `0c66e82` `tl-button--icon`, P3 `f1c8eec` `tl-toggle`, P4 `4b5e8c6`+`1d96acf` `tl-popover`/`tl-menu` (Fix: Schrift-Reset in `:where`, **Knopf und Eintrag lesen `tl-type-body`** — skalen.md „Entschieden beim Bauen (01.10., Welle 3a)“), P5 `3582bdf`+`66661f9` `tl-toolbar`/`tl-tabs`/`tl-breadcrumb` (Fix: `[hidden]` an Elementen), P6 `13e7989` Nachzüge Welle 2 (Select-Popup auf `tl-popover`, Icon-Knöpfe und FormGroup-Toggle aus dem Paket, Verträge N8), P7 `1625a77` Gates (Fokus, Verträge, `%`-Lücke im Lint), `specimen/specimen.css`. **266 Tests, Lint grün. `dist/` ist nicht publiziert** — das macht E1 zusammen mit `tl-type-label` → `tl-type-body` an drei Engine-Stellen (`ButtonDefaults.tsx:31`, `TLDropdownSelect.tsx:591`, `TLHtml.tsx:113`), sonst schrumpfen alle Knöpfe auf 12 px.
   **SDD 3a, Engine-Teil E1–E9 gebaut (01.10. nachmittags, Opus orchestriert; Halt nach E9 auf Hendriks Wunsch).** Branch `CWS/CWS_29617_design_system_welle_3a` im Worktree, **nicht gepusht**, ohne Upstream (Absicht). Engine `60a36b308e..21a8aa52c3`: E1 `6477f8e977` Paket publiziert + Knöpfe lesen `tl-type-body`, `5a41219ee5` `usePopover`/`Menu`/`TLMenu`; E2 `8e8817d17c`+`6b6dd7cb77` Select-Popup über `usePopover`, Icon-Knöpfe; E3 `c7aceef406` FormGroup `tl-toggle`; E4 `51596fbe67` Spaltenmenü über `Menu`; E5 `7a692b7c9b`+`f9132512e9` Toolbar (kompakt, Überlauf als Menü, aktiver Eintrag `aria-current`, `js.toolbar.label`); E6 `751092eb8f`+`53ebb55d18` Reiter mit Pfeiltasten, Breadcrumb; E7 `dccc0d5b7d` Menü-Auslöser am Element, `aria-expanded`, `Shift+F10`; E8 `fe431e0582` Benutzermenü ohne Block; E9 `21a8aa52c3` Tooltip auf `layer-popover`, alte Namen in `docs/plans` markiert. Projekt: Ratsche `61416c2`…`4d143d0`, E9 `0796de9` (Engine-Gate kennt die alten Namen, `altlast.md` „Welle 3a gebaut“), Spec §7 `ed23930`. **Gates grün:** Paket 266/266, Lint; Engine Build + `tsc --noEmit`, layout.react 470, layout.view 1032, demo.react 11, `messages_en` ohne Diff. **Ratsche 5994 → 5537**, sechs Blöcke weg (TLMenu, TLToolbar, TLTabBar, TLBreadcrumb, TLMenuRegion, User menu), neu TLViewError 29 und TLInset 58, `foreignTl` 6 → 4. Sandbox-Hinweis: `check-messages-en.sh` läuft nur mit `MAVEN_ARGS="-Dmaven.repo.local=<worktree>/.m2/repository -Dskip.npm -Dskip.installnodenpm"` (`.mvn/maven.config` zeigt noch auf `~/git`).
   ~~**Offen für Hendrik (geht in die Knopffarben-Runde):** Gefahrton im Toolbar-Überlauf geht verloren (der Menüvertrag kennt keinen danger-Eintrag) — hinnehmen oder `data-tl-tone="danger"` am `tl-menu__item` im Paket? Vorläufig hingenommen, Vermerk in `altlast.md`.~~ **Erledigt mit „Ton folgt der Aktion“, `tl-menu__item--danger` (02.10.).**
   **02.10.: Welle 3a abgenommen.** Review E9 clean; Schluss-Review (Fable) „with fixes“ → Fix-Welle Engine `393827ab8c` (Roving überspringt versteckte Einträge, Popover-Abstand einmal je Öffnen, Paket republiziert), Projekt `629b4ff` (menu.css-Kopf und Spec auf `tl-type-body`, engine-classes-Titel, altlast präzisiert und um fünf spätere Punkte ergänzt); Re-Review: alles behoben. Gates: Build, `tsc`, layout.react 480, Paket 266, Lint. Engine-Head `393827ab8c`, **nicht gepusht**.
   **Neu 02.10. (Hendrik): Knöpfe in Menüs, Dialogen, Modals lassen sich nicht einfärben.** Befund: `ReactButtonControl` kann `setAppearance`/`setTone(DANGER)` seit Welle 1, aber `ViewCommand.Config` und `CommandModel` tragen weder Erscheinung noch Ton (nur Enter-Taste → `primary` über `markAsDefault`); `MenuEntry` hat keinen Ton, der Menüvertrag kennt keinen; `ConfirmDialogControl` macht die Bestätigung immer `primary`, nie `danger`. Bernhard hat nichts dazu in Arbeit. Entwurfsfrage für Fable (Brainstorming → Prognose nach „Gleiches wird zusammengelegt“ → Spec → Plan-Review); schließt „Gefahrton im Toolbar-Überlauf“ ein.
   **02.10., Brainstorming „Ton folgt der Aktion“ (Fable) — entschieden und spezifiziert:** Bedeutung statt Farbe (kein Attribut am Kommando; `DeleteObjectAction` → `DANGER`, Clique `delete` als zweite Quelle), nur destruktiv wird rot, Enter bleibt auf Löschen (`primary` + `danger`), Menüeintrag `tl-menu__item--danger`, Rückfrage erbt den Ton des Kettenrests über `Continuation.tone()`. Prognose (fünf Doppelungen) angekreuzt: #1 Ton, #2+#5 Menü/Confirm, #3 Delegations-Test; #4 Dialog-Gerüst → Welle 4. Spec `docs/superpowers/specs/2026-10-02-ton-folgt-der-aktion-design.md`, `skalen.md` „Ton folgt der Aktion“, Folie 15. **Stand 02.10.: gebaut, Gates grün, nicht gepusht.** Plan `docs/superpowers/plans/2026-10-02-ton-folgt-der-aktion.md` (Plan-Review eingearbeitet `1e762fd`), Ledger `.superpowers/sdd/2026-10-02-ton-folgt-der-aktion/`. Branch `CWS/CWS_29617_design_system_ton` im Worktree `_Working-Tree/tl8-wt-ton` (auf `welle_3a`), Engine-Head `33a843464f` (nach Schluss-Review). Task 1 Paket `tl-menu__item--danger`: Projekt `ec2c5a3`, Engine `6b2d6fb465` (republiziert); Task 2 `d43162fe03` (`CommandModel.getTone()`, Knopf übernimmt ihn, Formular delegiert, `MessageButtons.discard` danger); Task 3 `95d9065a5a` (`ViewAction.getTone()`, `delete-object` → `DANGER`, Kette und Komposita reichen ihn hoch, Clique `delete`); Task 4 `af40305db8` (Menüeintrag trägt den Ton, Kontextmenü und Überlauf zeichnen `tl-menu__item--danger`); Task 5 `23640b494f` + `3669ff8ccc` (Rückfrage nimmt den Ton des Kettenrests, auch aus einem Zweig; `messages_en`/`_de`). `skalen.md` um zwei Zeilen ergänzt (Komposita, Rückfrage im Zweig), `altlast.md` „Ton folgt der Aktion — gebaut 02.10.“ mit fünf offenen Punkten aus den Reviews (`UploadCommand`, `<confirm>` in `<with-transaction>`, `MenuEntry.tone` ohne `requireNonNull`, Tests, Specimen). **Gates grün:** Paket 270/270, Lint, Ratsche unverändert (auch gegen `tl8-wt-ton`); Engine layout.react 487, layout.view 1065, demo.react 11 (Reaktor offline, ohne install), `tsc --noEmit`, Vite-Build, `messages_en` ohne Diff, Worktree sauber. **Schluss-Review (Fable) „Ready to merge: Yes“;** Fix-Welle Engine `33a843464f` (`MenuEntry` weist `null`-Ton zurück, deutsche Formulierung) und Projekt `60cbe64` (Specimen „in Kraft und destruktiv“, altlast zwei Punkte erledigt), Re-Review 4/4. Maven-Lehre: `-DskipTests=false` ist Pflicht, sonst Exit 0 ohne Tests. **PR [!1763](https://git.top-logic.com/TopLogic/tl-engine-7/pulls/1763) von Bernhard approved und am 02.10. 11:29 nach `welle_3a` gemergt** (Merge `519e5ec24f`; Branch `ton` auf origin gelöscht, Worktree `tl8-wt-ton` kann nach dem Merge von !1760 weg). Damit ist der Ton Teil von !1760. **Offen:** Sichtprüfung mit der PR-Instanz (Liste im PR-Text und Plan Task 6 Step 5).
   **02.10.: Bernhards Sichtprüfung von !1760 nachgezogen.** Zwei Punkte, beide entschieden (skalen.md „Leisten und Hilfe“, Bilder `docs/bilder/2026-10-02-*.png`): neues Dichte-Token `size-bar` (40/36 px = `size-control` + 2 × `space-2xs`) an Reiter und Toolbar; Hilfeknopf `fa-regular` in `icon-secondary` (Zeiger: `icon-primary`), Klasse `tl-form-field__help`. Paket 268 Tests, Lint grün; Engine `tsc` und Vite-Build grün. Engine `be55ce1f65` gepusht, Antwort in !1760 (#147616), Review bei Bernhard neu angefordert. Sichtprüfung Build 9474 auf `docker:8008` erledigt: beide Reiterleisten 40 px (Leiste 41 mit Linie), drei Toolbars 40 px, Hilfeknopf 24 px mit `fa-regular` 16 px in `icon-secondary` (dunkel `#A0A3A8`, hell `#54565B` wie das Label), Zeiger-Regel auf `icon-primary` geladen. Hell nur über die Tokens gemessen (Moduswechsel per Attribut zeichnet den Altbestand nicht mit).
   **02.10. 13:5x: !1760 gemerged** (Merge-Commit `b29546f2ad` auf master, Branch `welle_3a` gelöscht). Head war `519e5ec24f` mit !1763 (Ton folgt der Aktion, aus der parallelen Sitzung, von Bernhard hineingemergt); Bernhard approved 11:30 auf diesem Head, Jenkins Build 16444 grün. Gitea meldete „out of date“ (master einen fremden Merge voraus, !1761), der API-Merge ging trotzdem durch. Der Worktree steht noch auf dem gelöschten Branch; für 3b frisch von master abzweigen.
   **06.10.: Auswahlmarken zeigen einen Hof (Trac #29752, für Bernhards Branch `CWS/CWS_29752_snackbar_close`).** Kästchen, Radio und Schalter zeigen beim Zeigen (`surface-interactive-hover`) und Drücken (`surface-interactive-active`) einen deckenden Hof bis `size-control`, ausgelöst an der Marke und am `tl-choice`; nicht bei `disabled`/`aria-readonly`, nicht bei Fokus allein. Zeichnung `box-shadow` in der Form der Marke (Schalter: um die Spur). Lint kennt den Hof als dritte Schattenform, Paarliste hält `focus-ring` auf dem Hof (Probe-Theme nachgeführt). `skalen.md` „Auswahlmarken zeigen einen Hof“, Folie 9. Paket-Gates grün; **nicht committet, nicht publiziert** — das macht die Hauptsitzung.
   **06.10.: Knöpfe im Feld zeigen eine Stufe kräftiger (Trac #29752).** Endknopf des Textfelds, Löschen und Pfeil im Select, Kalenderknopf des Datumsfelds zeigen `surface-interactive-selected` und drücken `surface-interactive-active` (hell auf `surface-field` 1,11 / 1,23 statt 1,01). Pfeil als Quadrat `size-control-sm`, Kalenderknopf über `::-webkit-calendar-picker-indicator` (Firefox: nativer Knopf, ohne Ersatz). Paarliste: `icon-secondary` auf beiden Flächen. Entfernen-Knopf im Chip: Zeigen und Drücken beide `surface-interactive-active` (hell 1,11–1,21, dunkel 1,17–1,84 auf allen 14 Pillenflächen); eine neue Rolle `surface-interactive-strong` verworfen, die Kategorie bleibt geschlossen. Nach Sichtprüfung: der Chip-Knopf ist ein Kreis von 18 px ganz innerhalb des Pillenrandes (Lücke 2 px), kein Quadrat mehr über dem Rand. Folie 9. Paket-Gates grün; Feld-Teil `b985047`, Chip-Fläche `130944a`, Chip-Kreis **nicht committet, nicht publiziert.**
   **06.10.: Höfe sind durchscheinend (Trac #29752, Entscheidung Bernhard).** Ein deckender Hof verdeckt die Wertlinie unter dem Knopf des Schiebers. Zwei Rollen unter den Effekten: `surface-state-hover` / `surface-state-active` = `veil-1..4` (Textgrau des Modus, 6 % / 12 %; hell 1,12–1,13 / 1,27–1,28, dunkel 1,16–1,19 / 1,39–1,44 auf allen fünf Gründen, gemessen als Zusammensetzung). Regeländerung: Lint erlaubt `surface-state-*` nur im Hof und den Hof nur daraus; `color-mix`/`rgba` in Komponenten bleiben verboten. Paarliste misst den Ring auf `<Schicht>/<Grund>`; `derive` färbt die Schleier mit dem Kundengrau nach (Probe neu erzeugt, Ring `#DB4809`). Auswahlmarken umgestellt, Feldknöpfe bleiben deckend. `skalen.md` „Höfe sind durchscheinend“, Folie 9. Paket-Gates grün; **nicht committet, nicht publiziert.**
   **02.10.: Welle 3b gestartet.** Branch `CWS/CWS_29617_design_system_welle_3b` im Worktree von master `b29546f2ad`. Bestand vermessen (drei Explore-Agenten, Stichproben selbst geprüft); Befund: 282 Tabellenzeilen (3565–3846) ohne Überschrift, die Ratsche zählt sie zu TLJobStatus. Hendrik entschied: TLText mit in 3b, Umsortieren per Alt+Pfeil (WCAG 2.5.7) in `useListReorder`, Zeilenhöhe misst der Client (`rowHeight` fällt). **Spec** `docs/superpowers/specs/2026-10-02-welle-3b-daten-design.md`, **freigegeben 02.10.** (Ton `accent` fällt), skalen.md „Welle 3b: Daten“, Folie 10a, altlast „Welle 3b“ (`069fcd4`). **Plan** `docs/superpowers/plans/2026-10-02-welle-3b-daten.md` (P1–P9, E1–E11, `ceea25e`; Autor Opus, in Scratch-Kopien gebaut). **Plan-Review** (frischer Opus-Agent, Fable-Kontingent erschöpft) `.superpowers/sdd/2026-10-02-welle-3b-daten/plan-review.md` (lokal, ignoriert wie die Ledger): bereit mit Korrekturen — B1, M1–M4 einarbeiten; **Entscheidung Hendrik:** M5/A1 Fehlerlinie auf ausgewählter Fläche (Tausch erzeugt dunkel die ausgeschlossene Doppelrolle), dazu Plan-Abweichungen A2–A5 bestätigen und Fragen 16/22/23. **Heute keine Umsetzung (Hendrik).** Morgen: Entscheidungen → Plan korrigieren → SDD ab P1. Engine-Branch `welle_3b` ist lokal, ohne Commits.
   **07.10.: Entscheidungen gefallen** (`e6833b1`, skalen.md „Welle 3b“ und Status-Rollen „Nachgezogen 07.10.“): Fehler- und Warnlinie auf ausgewählter Zeile = Tausch der Stufen + neue Stufe `red-34` (dunkel `status-error-border`), keine Doppelrolle, vier Paare (ausgewählt/Zeigen); A2–A5 bestätigt; Kopf-Kästchen nur `indeterminate`; Pill als Wurzel; Icons `tl-icon-sm`. Review-Korrekturen B1, M1–M5, Punkte 1–19 im Plan (Opus-Agent, Stichproben geprüft). **Branch per Fast-Forward auf master `eef176e2ad`** (164 Commits, keine eigenen); Ratsche gehoben (`a80c0f8`): TLTableView +14 (#29654, #29752), TLSlider/Snackbar/Inset/Panel (#29752), TLIconSelect und zIndex (#29743), foreignTl +8. **Befunde aus master:** (1) ~~Slider-Halo ohne Farbe~~ — falsch: `--tl-surface-state-*` kommen aus Bernhards Paket-Branch (`hoefe`), auf master publiziert, in `main` erst mit dem Merge vom 07.10.; (2) TLAlert-Block (#29652) definiert `tl-alert__*` im alten Stylesheet — **Frage an Hendrik: mit 3b ins Paket?**; (3) `calc(var(--tl-layer-popover) + 1)` für den Tooltip (#29743) — Ebene fehlt in der Skala; (4) TLAccordion (105) neu, unlisted. `.omc/` (Plugin) liegt untracked im Worktree, nicht committen. **Plan neu verankert** auf master `eef176e2ad` und Paket `80749da` (Merge von Bernhards `hoefe`-Branch): frischer Opus-Prüfer, P1–P9 in Scratch-Kopie 331/331, Lint grün, E1 in einer `react-src`-Kopie `tsc` 0; Greps auf `/**` korrigiert (vorher immer leer). Weitere Entscheidungen 07.10.: TLAlert-Teile ins Paket (`:has` statt `--closable`), Entfernen in der Kapsel = Bernhards Kreis, `.tl-choice-group--vertical` ins Paket, nur `error` ist `role="alert"`, `tl-toggle` zeigt überall mit `surface-state-*` (eine Lint-Ausnahme, zwei Selektoren). Orchestrator nachgeprüft: P9 Probe byte-gleich 285/285, Toggle-Lint nimmt Toggle an und lehnt `.tl-button:hover` ab. Nicht vorgeprüft: Java, Maven, `check-messages-en.sh`. **Nächster Schritt: SDD ab P1** (Plan `docs/superpowers/plans/2026-10-02-welle-3b-daten.md`).
   **08.10.: Welle 3b gebaut (SDD, Opus orchestriert).** Paket auf `main` (bis Fix-Welle `603df85`, danach Doku), 346 Tests, Lint grün. Engine-Branch `welle_3b` lokal bis `20b0804d2b` (auf master `eef176e2ad`; master inzwischen 2 Commits weiter, ohne Berührung). Gates: `tsc` 0, beide Vite-Builds, Maven offline react 537/0, configedit 313/0, demo.react 11/0, view 1217 mit einem fremden Fehlschlag (`TestAccordionElement`, Locale, master #29651), `check-messages-en` ohne Diff, Ratsche 4490 Zeilen, kein `tlTableView/tlTreeView/tlColumnSelect/tlColumns/tlText` mehr. Jeder Task reviewt (Fix-Runden im Ledger), Schluss-Review (Fable) „With fixes“ → eine Fix-Welle, nachgeprüft 13/14; Rest geparkt (s. u.). Entscheidungen beim Bau: `skalen.md` „Beim Bau entschieden (07.–08.10.)“; Migrationsliste und „Offen nach 3b“: `altlast.md` „Welle 3b · Daten — gebaut 08.10.2026“. Ledger und Sichtprüfungsliste: `.superpowers/sdd/2026-10-02-welle-3b-daten/` (lokal). **Für Hendrik offen:** (1) Gruppenwert aus Fabrik-Zellen (Lesewert) bleibt normal statt stark — wie nehmen Lesewerte eine Typo-Klasse von außen an? (2) beschrifteter Fortschritt sagt Name und Wertetext doppelt an — `aria-valuetext` bei Gleichheit weglassen? (3) hell `text-helper` auf ausgewählter Zeile 4,42 < 4,5; (4) `ProgressBar` ohne Beschriftung kann keinen Namen tragen (`TLJobStatus`), Welle-1-Nachzug. Befunde an master: #29651 Locale-Test, #29743 Tooltip-Ebene `calc(layer-popover + 1)`. **Nächster Schritt: E11** — ab 09.10.: `git fetch`, ggf. master mergen und Gates wiederholen, Push (Hendrik), PR gegen master mit Bernhard, Sichtprüfung 1–28 im Docker (Brief `task-E11-brief.md`).
   **07.10.: Bernhards Branch `CWS/CWS_29752_hoefe` lokal nach `main` gemergt** (Hendrik); die drei Absätze vom 06.10. darüber sind damit committet (`6791acf..3af3180`), ihr `dist` ist byte-identisch mit dem, was Bernhard auf master publiziert hat (`9e1700c157`, `f51fadda9e`, `5dd9557741`, `cf604585f6`).
   **09.10.: E11, lokaler Teil.** !1760 (3a) ist seit 02.10. 13:51 auf master (`b29546f2ad`, von Hendrik gemergt) — die „Nächsten Schritte Welle 3a“ unten sind erledigt bis auf die Sichtprüfung. master (191 Commits, `652ef4832a`) in `welle_3b` gemergt (`0d7e94467f`): 14 Konflikte in 7 Dateien. Aufgelöst: Tabelle behält `tl-table` und den `tl-popover`-Hinweis, nimmt #29693 (Klick auf bedienbares Control in der Zelle wählt nicht) und #29760 (Reserve des Spaltenknopfs zählt in die Mindestbreite); Bernhards `state.proto` (#29661) kannte für `TextState.Tone` noch `accent` und kein `placeholder` → nachgezogen, `TextState`/`control-state.ts` per msgbuf neu erzeugt (Maven online, offline fehlt `jackson-bom 2.22.3`); `buttonClassName` liegt jetzt unter `button/buttonClassName`; die Entwicklerdocs liegen unter `META-INF/tl-docs/view-layer/`, 3b-Wortlaut übertragen; Compact field (#29693) las `tlTableView__row` → `tl-table__row`; Kanban (#29730) behält `.tlKanbanBoard__dropHint`. Ratsche gehoben: TLHtml 162→182, fontSize 40→41 (#29765), TLCalendar 254→255 (#29730); unlisted neu: Touch drag, Compact field, TLKanbanBoard. Entschieden (Hendrik), alles gebaut: **kein `aria-valuetext` neben der Beschriftung** (Engine `0b32b7a48e`, Paket `106a0f6`); **`text-helper` hell `gray-49`**, 4,63 auf der ausgewählten Zeile, `gray-48` gestrichen, dunkel offen (`1794f98`); **der Lesewert erbt die Schrift vom Ort** — `tl-field-value` ohne Typo-Klasse, `tl-form-field__input` `tl-type-body`, Zellen der Gruppenzeile `tl-type-body-strong` (Engine `c6709d4317`); **der Balken des Job-Status zeigt „42 %“ und heißt nach dem Status**, eine Wert-Beschriftung ist `aria-hidden` (Engine `33e4d0bb4d`); alles in skalen.md. `messages_en` aus dem Proto (`27963f71dd`), Deutsch nachgezogen (`e789b4d7c0`). Gates: Paket 348/348 gegen den Worktree, Lint, `tsc` 0, beide Vite-Builds, Maven react 601/0, configedit 341/0, demo.react 13/0, view 1318 mit dem bekannten fremden Fehlschlag (#29651, Locale), `check-messages-en` ohne Diff. Maven-Lehre: der Worktree hat ein eigenes lokales Repo (`.mvn/maven.config`), nach einem master-Merge erst `-am` installieren, dann `clean test` — sonst laufen alte Testklassen gegen neue Jars (`NoSuchMethod`); offline fehlen `jackson-bom 2.22.3` und `surefire-junit-platform 3.6.0`. **Befund für die Konsolidierung:** Kanban bringt mit `placeDropHint` (`controls/drop-hint.ts`) die neunte handgeschriebene Positionsrechnung und eine eigene Ablage-Optik. **In der Sichtprüfung ansehen:** ein Lesewert außerhalb von Formularfeld, Tabelle und Baum erbt keine Größe mehr (Fallback des Browsers); `TLProgress` ohne Beschriftung vom Server bleibt ohne Namen (`ProgressState.label` „Absent: the bar stands alone“). **Nächster Schritt:** Push ab 10.10. (Hendrik), PR gegen master mit Bernhard, Sichtprüfung 1–28.
   **12.10.: E11, Push.** `main` gepusht (`069fcd4..e07a887`, enthält Bernhards !17 `hoefe` über den Merge `80749da` vom 07.10.). Der Hook lehnte `welle_3b` ab: **#29617 wurde am 09.10. von der Release-Routine für TL_8.0.0-alpha10 geschlossen** (Konto `claude.code`, alle 72 Tickets des Release), wiederöffnen geht nicht. Entschieden (Hendrik): **jede Welle ein eigenes Ticket, 3b ist #29821** (accepted, CC bhu, hpe); Branch `CWS/CWS_29821_design_system_welle_3b`, die Engine-Commits der Welle tragen `Ticket #29821:`. master unverändert seit dem Merge vom 09.10. **Fremd-Review (Opus) der Arbeit nach dem Schluss-Review**, behoben: Paket war nicht im Worktree publiziert (`text-helper` `gray-49` fehlte dort) — neues Gate `test/published.test.mjs`; Regel `tl-select__separator` (#29693) beim Merge verloren — im Paket; Lesewert im Dialog der Kompaktzelle ohne Typo-Klasse — Inset trägt `tl-type-body`; Job-Status rundete anders als `aria-valuenow`; Ratsche TLAppBar 89→83; skalen.md Hilfetext 5,45; Tabellenvertrag nennt `tl-table__body`. **MUI (Hendrik):** Bernhards Adapter folgen nur dem Vertrag — nachgezogen nur `placeholder` statt `accent` im `MuiTextAdapter`, Rest als Hinweis an Bernhard (altlast.md). Offen: Wizard-Fortschritt ohne Namen. **Kollisionen mit offenen PRs** (Simulation mit `git merge-tree`): !1825 Bernhards Drag & Drop #29776 (TLTableView 9, TLTreeView 5 Stellen, bringt `--dragOver-onto` neu), !1801 Zeilenzahl #29757, !1830 Coverage-Baum #29760 — wer als Zweiter merged, löst auf. **Gepusht** als `CWS/CWS_29821_design_system_welle_3b` (Head `1235e7e88d`, 29 Commits, Präfixe per `filter-branch` von #29617 auf #29821 umgeschrieben, Baum unverändert; lokale Sicherung `backup/welle_3b_vor_29821`). **PR [!1838](https://git.top-logic.com/TopLogic/tl-engine-7/pulls/1838)** gegen master, Bernhard Reviewer, Trac-Kommentar in #29821. Paket-PR !17 (`hoefe`) ist inhaltlich in `main`, wird von Gitea aber nicht als gemergt erkannt — Hendrik schließt oder merged ihn. **Sichtprüfung lokal statt Docker** (Jenkins baute !1838 nicht; Rezept im Memory „Lokale Demo statt Docker“): 1–5, 8, 9, 11, 14–16, 22–24, 26, 28 wie entschieden. Behoben und gepusht (Engine `6432b07bd0`, `af14cd395f`, `d28bed5cf0`; Paket `512166f`, `98b6252`): Leerzeile klebt links; Spaltenwahl ein Scrollbereich (Fenster 70 %, Liste füllt, Suche eingerückt); Kapsel und Segment zeigen auf der Feldfläche `-selected`/`-active` (Hendrik); Kästchen springt beim Ankreuzen nicht (`vertical-align: middle`); der Körper folgt dem Kopf beim Tab. Entschieden (Hendrik): **Spaltenwahl neu** — Ebenen-Panel (Griff vorn, Auge und Schloss rechts beim Zeigen, Fixiert-Block; Stufe 2 Spaltengruppen mit Bernhard; Spec 2026-10-12); Ticket **#29825**, skalen.md. Offen für Hendrik von Hand: Ziehen (7, 13, 17, 18), nicht gesehen 6, 12, 19, 20, 21, 25, 27. Befunde an Bernhard im PR: URL-Sprung mit ungespeicherten Änderungen → „Internal error“, Rückfrage ohne Formularnamen. **Nächster Schritt:** Review von Bernhard, Ziehen von Hand, dann #29825 (Spec, Plan-Review).
   **Nächste Schritte Welle 3a:** (1) **Gepusht 02.10., PR [!1760](https://git.top-logic.com/TopLogic/tl-engine-7/pulls/1760) gegen `master`** (Head `a998872f72`, mergeable), Bernhard Reviewer, Trac-Kommentar gesetzt. Vor jedem weiteren Push `git fetch` (Bernhard committet auf unsere Branches); nach jedem Push `add_reviewers bhu`. (2) Sichtprüfung E9 Step 6 im Docker der PR-Instanz (Liste im Brief `task-E9-brief.md`, dazu: Tooltip über Menü, Benutzername-Breite, doppeltes Kontextmenü bei `Shift+F10`, Pfeiltasten über versteckten Überlauf-Eintrag, FormGroup-Pfeil dreht); Befunde als Fix-Commits. (3) `/model fable`: Brainstorming Knopffarbe. (4) 3b. Ledger `.superpowers/sdd/2026-10-01-welle-3a-navigation-popups/progress.md` bleibt bis nach der Sichtprüfung.

0. **Welle 2 als PR [!1740](https://git.top-logic.com/TopLogic/tl-engine-7/pulls/1740) gegen master (30.09. 14:49, Head `ed8ea63828`, Bernhard Reviewer).** Push kam von Hendrik (die Sandbox erreicht den Schlüsselbund nicht). **Sichtprüfung 30.09. auf `docker:8017` erledigt, hell und dunkel, alles wie entschieden:** Feldränder sichtbar, Fokusring, Pflichtstern, Fehlerzustand (roter Rand, Meldung mit Icon), Checkbox/Tri-State/Radio aus Tokens, Selects mit Icons, Select-Popup liegt im Dialog über dem Backdrop, Suchfeld-Icon mittig, gewählter Filterwert als Pill, Pill in der 120-px-Zelle mit Ellipse, gewählter Chip als Marke, schreibgeschützte Checkboxen lesbar, Upload- und Hilfe-Knopf. Nicht prüfbar in der Demo: kompakte Dichte — bisher waren das eigenständige Themes („kompakt“, „comfort“), die Demo bietet keines an; **offen, später:** ein Dichte-Schalter wird gebraucht (Hendrik, 30.09.); Kandidat: im Benutzermenü unter der Themewahl (System/Hell/Dunkel) ein Block „Dichte: Normal/Kompakt“, der `data-tl-density` setzt — `UIThemeService` kennt das Attribut schon; Specimen deckt die Dichte bis dahin, Eigentümer-Link (Spalte nicht eingeblendet), Ziehen im Mehrfach-Select. Danach master (#29680) in den Branch gemergt (`3c87200bbb`), Push durch Hendrik, Review neu angefordert.
   - **01.10.:** Bernhard hat den `disabled`-Pfad selbst auf den Branch gelegt (`FieldModel.isDisabled`, `FieldState.disabled`, Controls lesen es typisiert, Demo-Flag „Fields locked“, 8 Commits bis `3e1218b549`); unser Doppel-Merge verworfen (Tag `welle2-local-merge-backup`). Danach Rest von master gemergt (`1c961245e4`: #29646 tsc-Gate, tsc 23→0, 0 Konflikte) und Paket republiziert (`60a36b308e`). Suiten layout.react 480 / layout.view 1062 / demo.react 11, `messages_en` 6 Module ohne Diff. Head `60a36b308e`, Review erneut angefordert. **Sichtprüfung des `disabled`-Pfads 01.10. (Docker 9446, dunkel):** „Felder gesperrt“ schaltet Text, Zahl, Datum, Checkbox und Listen auf inaktive Eingabefelder (`surface-disabled`/`text-disabled`), nicht auf Lesewerte — wie entschieden; nicht gesperrte Felder bleiben bedienbar. Mein Ruling „alle Controls lesen state.disabled“ aus der Fix-Welle war falsch begründet und ist durch Bernhards echten Zustand ersetzt.
   Verworfen (01.10.): der eigene zweite master-Merge `e06a4f3833` samt `f89f9ad21e` (`state.disabled` überall gestrichen) — ersetzt durch Bernhards typisierten `disabled`-Pfad; nur als Tag `welle2-local-merge-backup` erhalten. **Branch und `origin` stehen gleich auf `60a36b308e`, nichts steht zum Push aus** (geprüft 01.10.).

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
* `derive`, Rest aus dem Abschluss-Review (25.09.): **erledigt 16.10.** — Kollaps-Hinweis nennt volle
  Rollennamen und bleibt bei geliefertem `blue-49`; Gradprüfungen überspringen unbunte Flächen (`UNBUNT_C`)
  Review (Fable): Kollaps jetzt am fertigen Ergebnis geprüft, unbunt auch auf der Bedeutungsseite. **Offen, Bestand:**
  `kategorienVerteilen` blockiert für eine graue Marke oder Bedeutung deren Rauschton (≈ 90°) statt keinen; zwei
  Kategorien, die über gelieferte Stufen gleich grau werden, meldet nur der `setze`-Hinweis, keine eigene Prüfung
* Token-Mapper — Miniprojekt, Browserwerkzeug für Kunden-Styleguides
* Figma-Push aus `tokens.dtcg.json`
* Maven-Wrapper für das Paket; bis dahin kopiert `tools/publish-to-worktree.mjs`
* TSX-Lint-Regel (kein Hex, kein `style={{ color }}`, nur `tl-`-Klassen)
* Prüfung in der laufenden Demo-App (Browser); bisher ist nur das Specimen im Browser geprüft
* Spec §5 abgeschnittener Fokusring: **erledigt 16.10.** als `focus-clip.test.mjs` (Chrome über CDP, misst)

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

* **!1618** (#29576, `createPortal` aus der Bridge) am 25.09. gemergt; **!1621** (#29579, Marke als Token im alten
  Theme-XML) am 24.09. ohne Merge geschlossen — durch das Paket überholt.
* **Gitea-Issues abgeglichen (12.10., Hendrik):** geschlossen #2, #3, #4, #5, #6, #8 (erledigt bzw. durch den Schnitt
  überholt), #10 (`@layer` nicht geplant), #13 (Theming → #16, Accessibility → Welle 4, Storybook gestrichen — das
  Specimen ist das Schaufenster). Neu gefasst: #7 Figma-Push, #9 TSX-Lint, #12 Kunden-Typografie, #16 Themes (Paket
  fertig, Engine offen). Neu: #18 Dichte-Schalter. Issues im Design-System-Repo sind deutsch wie ihre Docs.
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
