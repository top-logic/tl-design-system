# TopLogic Design System

Design-Tokens, Generatoren und Enforcement für TopLogic 8.

Der Ansatz folgt [Polar „Orbit"](https://polar.sh/blog/orbit-llm-safe-design-system):
Ein Design System, dessen Entscheidungen die **einzigen ausdrückbaren** sind. Nicht weil es
dokumentiert ist, sondern weil alles andere nicht durch CI kommt.

> *„Anything you put in a doc is a probability, not a guarantee."*

## Werkzeuge

**Das Paket ist seit 02.11.2026 ein Modul in tl-engine-7** (`tl-design-system/`, Ticket #30098). Quelle,
Werkzeuge, Gates und Specimen liegen dort; Maven erzeugt die Stylesheets beim Build, nichts Erzeugtes ist
eingecheckt. Dieses Repo trägt die Doku (`docs/`), den Stand (`STATUS.md`) und das Push-Gate.

```bash
cd <tl-engine-7>/tl-design-system
npm test                    # alle Gates ohne Browser (läuft auch im Maven-Build)
npm run test:dom            # die Gates mit Chrome (Fokusringe, Titelleisten)
node tools/generate.mjs     # dist/ und src/main/webapp/style/tl-design-system/ aus src/ erzeugen
node tools/lint-css.mjs     # Klassen-Gate
node tools/derive.mjs acme.primitives.json   # Kundentheme aus Hausfarbe und Grauwahl rechnen
node tools/serve.mjs        # Specimen auf http://localhost:8137/

# in diesem Repo:
bash tools/check-messages-en.sh      # Push-Gate für Java-Änderungen im Worktree
```

Das Paket `@toplogic/design-system`: `src/` ist die Quelle (Primitive und Tokens als JSON, Komponenten unter
`src/components/`), das Erzeugnis sind `primitives.css`, `tokens.css`, `base.css`, `components.css` und
`tokens.dtcg.json`. Details in [`CLAUDE.md`](CLAUDE.md), die Spec in
[`docs/superpowers/specs/2026-09-17-design-system-neuaufbau-design.md`](docs/superpowers/specs/2026-09-17-design-system-neuaufbau-design.md).

## Die eine nicht verhandelbare Regel

**Jeder Design-Wert in TopLogic wird hier definiert. Keine Fremdpaletten. Keine Fallbacks.**

Das ist keine Stilfrage, sondern die Voraussetzung dafür, dass ein Kunde sein Theme durch
Austausch von Tokens einspielen kann. Ein hartkodierter Wert ist eine Stelle, die der Kunde
nicht erreicht.

Im Bestand wurden zu Beginn (09/2026) **drei konkurrierende Paletten** gefunden:

| Palette | Fundstellen damals | Stand 14.10.2026 |
|---|---|---|
| IBM Carbon | 21 Tokens, u. a. `--layer-01`, `--support-error`, `--border-radius-02`; 177 `var()`-Fallbacks in `tlReactControls.css` | 4 Fallbacks übrig; die Namen werden in noch nicht migrierten Blöcken 51-mal gelesen und fallen mit ihren Wellen |
| Tailwind | 16 Tokens in `tl-react-chartjs.css` und `tl-react-wysiwyg.css` (`#2563eb`, `#6b7280`, `#374151`) | entfernt |
| TopLogic | `theme-settings.xml` | bleibt, wird zur einzigen Quelle |

Durchgesetzt wird das durch die tatsächlichen Gates im Modul `tl-design-system`:

| Prüfung | Wirkung |
|---|---|
| `npm test` | Schichten, Kontrast, Maße, Erzeugtes, Ratsche — alles aus `docs/skalen.md` als Test |
| `node tools/lint-css.mjs` | Klassen-Gate: Literale, Fremdvariablen, Fokusring, `!important`, Kurven u. a. im ausgelieferten CSS |
| Ratsche (`test/ratchet.json`) | `tlReactControls.css` bleibt gelöscht; niemand außerhalb des Pakets definiert ein `--tl-…` |
| TSX-Lint | geplant, siehe `STATUS.md` |

Die Verzeichnisse `tools/` und `inventory/` auf Repo-Ebene sind Vorarbeit der ersten
Arbeitspakete (Auszählung des Altbestands, nicht Teil des laufenden Gates).

## Stand

**Siehe `STATUS.md`** — Sitzungsstand, offene PRs, wo anzuknüpfen ist.

| Artefakt | Inhalt |
|---|---|
| `STATUS.md` | Sitzungsstand: was erledigt ist, wo weitergeht |
| `docs/skalen.md` | jede Skala mit Regel und Begründung |
| `docs/praesentation-v2.md` | die Präsentation für alle Kollegen: was, wie, Vorteile (Botschaft, keine Entscheidungsquelle) |
| `docs/migration/altlast.md` | Arbeitsliste für die Migration der Komponenten |
| tl-engine-7 `tl-design-system/` | das Paket: Quelle, Werkzeuge, Gates, Specimen |

## Sichtbarkeit

Die Gitea-Instanz erzwingt private Repos beim Anlegen. Wenn das System später für Partner oder Kunden
lesbar sein soll, über *Settings → Make public* umstellen.

## Tickets

Jede Welle hat ein eigenes Trac-Ticket; Commits in beiden Repos tragen dessen Nummer (`Ticket #<nr>:`),
der Engine-Branch heißt `CWS/CWS_<nr>_design_system_welle_<n>`. Den Stand der PRs führt `STATUS.md`.

| Ticket | Inhalt |
|---|---|
| #29617 | Wellen 0–3a: Paket, Button bis Formular, Navigation und Popups (mit alpha10 geschlossen) |
| #29821 | Welle 3b: Tabelle, Baum, Text |
| #29825 | Spaltenwahl als Ebenen-Panel |
| #29836 | Welle 4a: Overlays (Dialog, Fenster, Drawer, Snackbar, NoticeBar, Overlay) |
| #29108 | TL Views — die React-Schicht, auf der dieses System aufsetzt (geschlossen) |
