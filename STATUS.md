# Status

Nur der aktuelle Stand: was offen ist, worauf gewartet wird, wo es weitergeht. Erledigtes wird gestrichen, nicht
angehängt — die Geschichte steht in `git log` und bis 16.11. in `archive/status-verlauf-bis-2026-11-16.md`.
Entscheidungen stehen in `docs/skalen.md`, Befunde des UI-Durchgangs in `docs/ui-durchgang.md`.

Lagebild: http://localhost:8138/ (liest „## Gesamtplan“)

## Jetzt (Stand 17.11.)

**Auf master seit 13.11.:** !2274 (#30281 Login-Karte mittig), !2282 (#30322 Schrift-Primitive), !2283 (#30323
Gates prüfen, was sie behaupten), !2284 (#30324 Verträge nennen jedes Token); 16.11. !2276 (#30296 Login-Formular), !2206 (#30228 Spaltenausrichtung).

**Wartet auf Bernhard (`bhu`):**

* **!2207** (#30229, jetzt auf master) und **!2208** (#30230): `jenkins` angefragt 16.11., Builds stehen aus.
* **!2275** (#30294 Login-Hintergrund, Worktree `tl8-wt-30294`): REQUEST_CHANGES 13.11. („sieht aus wie Masern“).
  17.11. `4211250db3` gepusht (Formwechsel raus, Ruhezustand reduziert), PR-Text/Titel und Trac #30294 neu, `bhu` +
  `jenkins` angefragt. 17.11. umgesetzt (App-Name oben, „Powered by“ mit TL-Wortmarke). 18.11. Bernhard
  baut selbst um (`tl.title` statt `ViewConfig#getTitle()`, Logo als ThemeImage, `tl.title = TopLogic` in der Engine);
  Handy-Befund von bhu: Scroll-Kasten des Hintergrunds behoben (`43672e7aaa`, gepusht), feste Kartenbreite gehört zum
  Formular → **#30422** (Anmeldeformular überarbeiten, eigenes Ticket). **`jenkins` erst, wenn die Login-Seite
  insgesamt fertig ist** (bhu darf vorher selbst anfragen). Signal für PR 2 (Einstieg mit TL-Zeichen): Framework-
  Ticket #30388 (Auftritt der geladenen Seite, nur Standard-Login, skalen 17.11.), CC bhu. Skizze
  `.superpowers/brainstorm/14150-1794476958/content/login-marke.html`.

**#30422 Anmeldestrecke** (angenommen 18.11.): Neubau als `<login-card>`, Folgeschritte und Fehler in der Karte,
`<form>` + `autocomplete`, Passkey-Autofill, alle Karten der Strecke (skalen 18.11.). Spec
`docs/superpowers/specs/2026-11-18-anmeldestrecke-design.md`, Skizze `.superpowers/brainstorm/30422-anmeldestrecke/`.
19.11.: alle Vorgänge live durchgespielt (Instanz 8092 aus Worktree `tl8-wt-30422`, Branch
`CWS/CWS_30422_login_flow`, Mail-Fänger im Scratchpad), Fallkatalog `docs/migration/anmeldestrecke-bestand.md`,
16 moderne Funktionen entschieden, Schnitt 0–4 in der Spec. **Neubau wartet** (20.11.): Hendrik klärt, wo die
Anmeldung beim Kunden überhaupt zu sehen ist (SSO davor?); erst danach Plan PR 0 + Plan-Review. **Kein Push, bevor
Hendrik lokal getestet hat** (gilt auch für #30424). Abgespalten **#30424** (Reset-Code unbegrenzt, keine Bremse;
Worktree `tl8-wt-30424`, lokaler Commit `5772c78930` ist falsch und wird ersetzt: Versuchsgrenze + Bremse).
Snackbar-Warteschlange als **#30452** (neue Meldung wartet hinter der alten).
Vorgezogen fürs Handy (skalen 20.11.), beide auf master-Basis, `bhu` + `jenkins` angefragt:
**!2439** (#30476, Karte schneidet bei 375 px nicht mehr ab) und **!2441** (#30477, kein Zoom ins Feld auf dem iPhone,
dort bestätigt). Lokaler Hilfsbranch `local/phone-test` (beide Fixes, Demo 8094) nach dem Merge löschen.

**Kette UI-Durchgang** (nur die zwei untersten Ebenen haben Build und Review, Ketten höchstens 2–3 PRs):
!2207 (#30229) → !2208 (#30230) → !2226 (#30236) → !2227 (#30102) → !2228 (#30234) → !2229 (#30235) →
!2230 (#30233) → !2231 (#30232, Draft). Rückt nach jedem Merge zwei Ebenen nach. Vor jeder Arbeit dort pullen
— Bernhard merged master selbst hinein. !2149 bleibt als Draft offen (Hendrik); !2014 am 16.11. geschlossen, sein Inhalt steckt vollständig in der Kette.
!2226: bhu-Review 18.11. (Zebrastreifen nicht das Wichtigste) → Spaltenwahl zuerst im Popover, Startfokus darauf
(ac7b59ca68, master gemergt cf5fe2cc0e), gepusht 19.11., jenkins + bhu angefragt; Worktree `tl8-wt-30236`.
Stapel !2227–!2231 am 19.11. lokal nachgezogen (Worktree `tl8-wt-30102`, Branches 30102_menus, 30234, 30235,
30233, 30232; master über !2226 mit drin). Ab !2228 Seiten getauscht (Plan `docs/superpowers/plans/2026-11-19-ansicht-seiten-tauschen.md`):
Zahnrad „Spalten“ öffnet die Spaltenliste, Fuß „Spalten zurücksetzen“ + „Ansicht ›“, dahinter Dichte/Streifen/Linien; „n von m“ entfernt.
!2227 bekommt die Einrückung der Schalter zurück (Menü-TSX kommt erst mit !2228). Sichtprüfung 8093 (Demo vom 30232-Stand) ohne Bruch.
20.11.: Bernhard hat master in !2226 gemergt und Icons an den Befehlen verlangt; Hendrik: Plus/Minus statt Plus/Auge (skalen.md,
Abschnitt 19./20.11.). Alle sechs Branches gepusht 20.11. (!2226 b225806444 … !2231 436dcc4275), PR-Texte !2226–!2228, Trac
#30234/#30236 nachgezogen; !2226: Kommentar, jenkins + bhu angefragt; !2227: bhu angefragt.
„eye“ → `tl-reorder-list__visibility` lokal (30234 e0e1d4ddfd … 30232 be451b3ae9), Sichtprüfung 8093 ok (Minus/Plus, Icons, hell/dunkel);
mui-`tsc`-Fehler aus master an Bernhard (Trac #30415). Eine Breite für beide Seiten (Token `size-popover-view` = 24rem,
30234 534c6037d6 … 30232 125bfdc560), an der Demo 384/384 px. **Nächster Schritt:** Push der vier Branches nach Freigabe.

**Lokal, ohne PR:** Grenztest C (#30325, Branch `CWS/CWS_30325_limits_test_customer_ui`, Worktree `tl8-wt-30325`):
MUI-Demo und Theme `weich`, Befunde U69–U83 in `docs/ui-durchgang.md`; Kommentar an Bernhard auf Trac #29650.

**#30383 Felder in der bearbeiteten Tabellenzeile** (tri, Hendrik zugeteilt): entschieden 17.11. (`skalen.md`
„Felder in der bearbeiteten Tabellenzeile“) — Feld wie im Formular, 28/24 px, Rahmen grau, Auswahl bleibt blau, Stern
im Spaltenkopf. `border-emphasis` dunkel → `gray-36`. Spec `docs/superpowers/specs/2026-11-17-row-edit-felder-design.md`;
PR 1 (Paket) **!2371** (`CWS/CWS_30383_row_edit_fields`, gepusht 17.11., Reviewer tri + bhu, jenkins angefragt;
an der Instanz geprüft: Tabelle, Baumtabelle, Formular dunkel, normal und kompakt). PR 2 **!2394** (Ticket #30391, `CWS/CWS_30391_row_edit_required`, Basis master seit Merge von !2371; Ecke unter Fokusring 811382ec2d, master gemergt 673a67905d, Ecke am kompakten Feld (data-tl-state~="required") 7dbbbc35d0, Ticket- und PR-Text nachgezogen, bhu und jenkins angefragt 19.11.; bhu hat master hineingemergt (fb8d7fe484), Build 1655 grün; offen: tri-Review und bhu-Approval des neuen Stands): Stern im Kopf nur für „immer Pflicht“, dazu
Ecke im Feld für jede Pflicht der Zeile (Z3, 3:1 als Symbol); Plan `docs/superpowers/plans/2026-11-17-row-edit-felder-pr2.md`,
Plan-Review eingearbeitet, bereit zur Umsetzung. PR 1 dazu: Fokusring der Fehlermarke innen, Öffner des
kompakten Felds kürzer (d4750e539f). U85 (Zebra-Hover) gehört zu !2226.
Folge **#30454** (angelegt 19.11.): kompaktes Pflichtfeld in der Zeile für Screenreader stumm (nur Ecke, `role=group`
erlaubt kein `aria-required`) — Öffner nennt bei Pflicht „(Pflicht)“; **!2419** (`CWS/CWS_30454_compact_field_required_label`, Basis `CWS/CWS_30391_row_edit_required`, bhu angefragt 19.11.). **Nach Merge von !2394:** Basis von !2419 auf master prüfen, dann `jenkins` (kein `NoPreview`, Beschriftung sichtbar).

**Weiter — Hendrik wählt:**

1. U69 `radius-mark` als erste Stellschraube aus dem Grenztest (Ticket, Plan, Plan-Review).
2. Kleine Korrekturen U8, U9, U11, U17, U22, U10 (Kalender-ARIA) — je eigener PR von master.
3. U68 Theme-Eingabe prüft Nicht-Farbwerte nicht (Entscheidung); U84 Filter per Rechtsklick zurücksetzen (eigener PR).

In der Hinterhand, kein Ticket: Datumsfeld zeigt `mm/dd/yyyy` nach Browsersprache (natives `input type=date`).

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
| 4c | Behälter: Panel, SplitPanel, Card, Stack, Grid, DeckPane, TileStack, Inset, AdaptiveDetail, Accordion, Wizard, ViewError; Q3, Q7, Q8, Q13–Q23 (!1911, auf master) | 12 | master | #29870 |
| 5 | Calendar, ColorInput, IconSelect, Medien (Audio, Photo, PDF, Upload N3), Dashboard; fremde `tl…`-Stylesheets (`TLWysiwygEditor.css` u. a.), Ebene `layer-drag`, `drop-hint`; danach `tlReactControls.css` gelöscht (!1939, auf master 23.10., Merge `9f4da7c480`) | 8 | master | #29875 (5a), #29904 (5b), #29906 (5c), #29914 (5d) |

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
* Icon-Set: entschieden 17.11. — eigenes Set auf Lucide-Basis, gefüllt nur als Zustand (`skalen.md` „Icon-Set“).
  Erhebung in `docs/migration/icon-erhebung.md` (491 Glyphen, Lucide deckt fast alle). Kunden mit eigener
  Bibliothek (z. B. MB) berührt es nur über Theme-Schlüssel und `ThemeIcon`-Quellen. FA/BI verschwinden ganz (20.11.):
  Migration inkl. Modelldaten, danach Ratsche. Das Set ist die Basis für alle Icons, auch
  `tl-icon`-Font und PNG-Icons (20.11.). Schnitt entschieden (Bild-Erhebung in
  `docs/migration/`): tote Dateien gelöscht in #30478,
  PR !2442 (210 Dateien; `beacon/` bleibt, Pfade werden zur Laufzeit zusammengesetzt), wartet auf Review; Font und Spinner-GIFs fallen. Offen: Strichstärke 1,5/2, 124 unsichere
  Dateien, Startliste.
* Kunden-Typografie: was bricht, wenn ein Kunde die Schrift tauscht (Issue #12).

**Nebenstränge** (ohne eigene Welle):

* #29826 „Ziehen sichtbar machen“ nach Merge von !1825; #29828 Tabellenzustand mit Bernhard; #29827 Spaltengruppen
  und Pivot bei Bernhard.
* Token-Mapper (Browserwerkzeug für Kunden-Styleguides, Spec §3). Das Paket baut seit 02.11. als Engine-Modul mit
  Maven (#30098); offen: Chrome auf dem Jenkins-Knoten, dann `test:dom` in `npm test`.
* Kleinpunkte je Welle: `altlast.md` „Offen für spätere Wellen und Pakete“ und „Offen nach 3b“.

## Offene Fäden

* **Gantt und Flow nativ neu bauen** (Hendrik, 23.10.) statt SVG über den GWT-Client — eigenes Projekt, Bernhard
  gehört an den Tisch; bis dahin nur funktionale Fixes (U24).
* **Wo `derive` rechnet** und wie veraltete Kundenthemes erkannt werden — Vorschlag Trac #29909 an Bernhard.
* **Spaltenfilter:** keine neue Gestaltung, bis Bernhard die Semantik entscheidet (U64).
* Gitea-Issues im Design-System-Repo: #7 Figma-Push, #9 TSX-Lint, #12 Kunden-Typografie, #16 Themes in der Engine,
  #18 Dichte-Schalter.

## Verweise

| Was | Wo |
|---|---|
| Spec | `docs/superpowers/specs/2026-09-17-design-system-neuaufbau-design.md` (dazu `2026-09-25-derive-design.md`, `2026-09-25-ui-paket-design.md`) |
| Entscheidungen | `docs/skalen.md` |
| UI-Durchgang | `docs/ui-durchgang.md` |
| Arbeitsliste Wellen | `docs/migration/altlast.md` |
| Pläne | `docs/superpowers/plans/` |
| Werkzeuge | `CLAUDE.md`, Engine-Modul `tl-design-system/` |
| Issues | https://git.top-logic.com/TopLogic/tl-design-system/issues |
