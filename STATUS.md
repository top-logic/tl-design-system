# Stand

**Letzte Sitzung:** 2026-09-17 · **Basis:** `tl-engine-7@master` (TopLogic 8.0.0-SNAPSHOT) ·
**Spec:** `docs/superpowers/specs/2026-09-17-design-system-neuaufbau-design.md`

## Zuerst

**Welle 0 ist auf `master`.** PR [!1641](https://git.top-logic.com/TopLogic/tl-engine-7/pulls/1641) wurde als
Merge-Commit `59404c7f` gemerged (Trac #29617, angenommen). Der Worktree `~/git/tl8-wt-29584` steht auf
`master`; die Branches der Welle 0 sind lokal gelöscht. Alle Commits in beiden Repos tragen `Ticket #29617:`.
Jede weitere Welle bekommt einen eigenen Branch `CWS/CWS_29617_design_system_welle_<n>` von `master`.

Offen geblieben, nicht blockierend: die Trailer der Commits `5ab2ae3` und `6d709f4` („Claude Haiku 4.5“)
bleiben stehen — sie sind auf `origin/main`, Umschreiben hieße Force-Push.

**Neu:** Der Namensraum `--tl` gehört dem Paket (skalen.md, Folie 31); die Ratsche prüft das. Bernhard kennt
die Konvention noch nicht — mit ihm klären, sobald die erste Welle auf `master` liegt.

**Jetzt: Welle 1** mit dem Button als Vorlage (siehe unten). **Die Button-Varianten sind entschieden** (skalen.md
„Button: vier Erscheinungen, eine Tönung, keine Größe“, Folie 32): `primary`/`secondary`/`ghost`/`link`, Tönung
`danger`, keine Größen-Modifier, Zustände als Attribute, keine Kontextselektoren, AppBar wird `surface-layer`.
Der Umsetzungsplan liegt unter `docs/superpowers/plans/2026-09-18-welle-1-button.md` (acht Tasks: Pipeline für
`components.css`, Danger-Rampe und Icon-Klassen, `button.css` mit Gate-Regeln, Specimen, Vertrag, Java-Seite, TSX mit
`ButtonDefaults`, alter Block leer). Nächster Schritt: Plan ausführen. Prüfliste je Komponente:
`docs/migration/altlast.md`, Abschnitt „Sichtbare Befunde aus der laufenden Anwendung“.

## Wo anknüpfen

**Welle 0 ist umgesetzt.** Das Paket `design-system/` liefert `dist/primitives.css`,
`dist/tokens.css`, `dist/base.css` und `dist/tokens.dtcg.json`. `cd design-system && node --test`
ist das Gate — **81 Tests, alle grün**. `node tools/lint-css.mjs` ist das Klassen-Gate,
`test/ratchet.json` das Budget des alten Stylesheets (6088 Zeilen nach einmaligem Fremdzuwachs aus #29597, darf
nur sinken) und die Einfang-Liste `foreignTl` der vier fremden `--tl`-Namen im Altbestand.

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

* `tl-ds derive` — Kundenstufe A, die Ableitung einer Palette aus Hausfarbe und Grauwahl; muss die
  Beschriftungen mitrechnen und nach `tokens.css` laden — siehe skalen.md „Zwei Schichten“
* Token-Mapper — Miniprojekt, Browserwerkzeug für Kunden-Styleguides
* Figma-Push aus `tokens.dtcg.json`
* Maven-Wrapper für das Paket; bis dahin kopiert `tools/publish-to-worktree.mjs`
* TSX-Lint-Regel (kein Hex, kein `style={{ color }}`, nur `tl-`-Klassen)
* Prüfung in der laufenden Demo-App (Browser); bisher ist nur das Specimen im Browser geprüft
* `tools/lib/color.mjs`: `markenRampe`, `rampeAnwenden`, `nurHex` tragen noch alte Rollennamen;
  vor `derive` umbenennen
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
  Issue verloren haben.
* Zwei Commits von Welle 0 (`5ab2ae3`, `6d709f4`) tragen den Trailer eines anderen Modells; ein
  Umschreiben der Historie wurde nicht durchgeführt.

## Planung

Arbeitspakete als Gitea-Issues: https://git.top-logic.com/hpe/tl-design-system/issues
Präsentation: `docs/praesentation.md` — 30 Folien. **Wird bei jeder Entscheidung mitgezogen.**
Spec: `docs/superpowers/specs/2026-09-17-design-system-neuaufbau-design.md`
Plan Welle 0: `docs/superpowers/plans/2026-09-17-welle-0-paket.md`
Arbeitsliste Wellen 1–5: `docs/migration/altlast.md`
