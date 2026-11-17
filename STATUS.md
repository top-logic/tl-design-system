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
  `jenkins` angefragt. 17.11. 13:25 bhu erneut REQUEST_CHANGES („only demo“, kein App-Name): lokal `3e4fdf78f0` + Wortmarke
  — Framework-Login mit Hintergrund, Titel der Anwendung oben, „Powered by“ mit TL-Wortmarke unten (skalen 17.11.), lokal in der
  Demo geprüft; **nicht gepusht**, PR-Text-Entwurf im Scratchpad der Sitzung. Signal für PR 2 (Einstieg mit TL-Zeichen): Framework-
  Ticket #30388 (Auftritt der geladenen Seite, nur Standard-Login, skalen 17.11.), CC bhu. Skizze
  `.superpowers/brainstorm/14150-1794476958/content/login-marke.html`.

**Kette UI-Durchgang** (nur die zwei untersten Ebenen haben Build und Review, Ketten höchstens 2–3 PRs):
!2207 (#30229) → !2208 (#30230) → !2226 (#30236) → !2227 (#30102) → !2228 (#30234) → !2229 (#30235) →
!2230 (#30233) → !2231 (#30232, Draft). Rückt nach jedem Merge zwei Ebenen nach. Vor jeder Arbeit dort pullen
— Bernhard merged master selbst hinein. !2149 bleibt als Draft offen (Hendrik); !2014 am 16.11. geschlossen, sein Inhalt steckt vollständig in der Kette.

**Lokal, ohne PR:** Grenztest C (#30325, Branch `CWS/CWS_30325_limits_test_customer_ui`, Worktree `tl8-wt-30325`):
MUI-Demo und Theme `weich`, Befunde U69–U83 in `docs/ui-durchgang.md`; Kommentar an Bernhard auf Trac #29650.

**#30383 Felder in der bearbeiteten Tabellenzeile** (tri, Hendrik zugeteilt): entschieden 17.11. (`skalen.md`
„Felder in der bearbeiteten Tabellenzeile“) — Feld wie im Formular, 28/24 px, Rahmen grau, Auswahl bleibt blau, Stern
im Spaltenkopf. `border-emphasis` dunkel → `gray-36`. Spec `docs/superpowers/specs/2026-11-17-row-edit-felder-design.md`;
PR 1 (Paket) umgesetzt, lokal auf `CWS/CWS_30383_row_edit_fields` (4 Commits, nicht gepusht; offen: Dunkel-Durchsicht
aller Views, Instanzprüfung der Fixes). PR 2 (eigenes Ticket **#30391**, angenommen): Stern im Kopf nur für „immer Pflicht“, dazu
Ecke im Feld für jede Pflicht der Zeile (Z3, 3:1 als Symbol); Plan `docs/superpowers/plans/2026-11-17-row-edit-felder-pr2.md`,
Plan-Review eingearbeitet, bereit zur Umsetzung. PR 1 dazu: Fokusring der Fehlermarke innen, Öffner des
kompakten Felds kürzer (d4750e539f). U85 (Zebra-Hover) gehört zu !2226.

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
  Erhebung in `docs/migration/icon-erhebung.md` (491 Glyphen, Lucide deckt fast alle). Kundensysteme (z. B. MBUI)
  behalten FA/BI und eigene Icons, nur die Engine wird umgestellt. Offen: Strichstärke 1,5/2, `tl-icon`-Font, Startliste.
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
