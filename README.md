# TopLogic Design System

Design-Tokens, Generatoren und Enforcement für TopLogic 8.

Der Ansatz folgt [Polar „Orbit"](https://polar.sh/blog/orbit-llm-safe-design-system):
Ein Design System, dessen Entscheidungen die **einzigen ausdrückbaren** sind. Nicht weil es
dokumentiert ist, sondern weil alles andere nicht durch CI kommt.

> *„Anything you put in a doc is a probability, not a guarantee."*

## Werkzeuge

```bash
cd design-system
node --test                 # alle Gates
node tools/generate.mjs     # dist/ aus src/ erzeugen
node tools/lint-css.mjs     # Klassen-Gate
node tools/inventory.mjs    # Ratsche: Altbestand in tlReactControls.css je Block zählen
node tools/publish-to-worktree.mjs   # dist/ in den tl-engine-7-Worktree kopieren
node tools/derive.mjs acme.primitives.json   # Kundentheme aus Hausfarbe und Grauwahl rechnen
node tools/serve.mjs        # Specimen auf http://localhost:8137/
bash tools/check-messages-en.sh      # Push-Gate für Java-Änderungen im Worktree
```

Das Paket `@toplogic/design-system` liegt in `design-system/`: `src/` ist die Quelle
(Primitive und Tokens als JSON, Komponenten unter `src/components/`), `dist/` das eingecheckte
Erzeugnis (`primitives.css`, `tokens.css`, `base.css`, `components.css`, `tokens.dtcg.json`). Details in [`CLAUDE.md`](CLAUDE.md), die Spec in
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

Durchgesetzt wird das durch die tatsächlichen Gates in `design-system/`:

| Prüfung | Wirkung |
|---|---|
| `node --test` | Schichten, Kontrast, Maße, Erzeugtes, Ratsche — alles aus `docs/skalen.md` als Test |
| `node tools/lint-css.mjs` | Klassen-Gate: Literale, Fremdvariablen, Fokusring, `!important`, Kurven u. a. im ausgelieferten CSS |
| Ratsche (`test/ratchet.json`) | `tlReactControls.css` darf je Block nur schrumpfen; ein geleerter Block wird gestrichen |
| TSX-Lint | geplant, siehe `STATUS.md` |

Die Verzeichnisse `tools/` und `inventory/` auf Repo-Ebene sind Vorarbeit der ersten
Arbeitspakete (Auszählung des Altbestands, nicht Teil des laufenden Gates).

## Stand

**Siehe `STATUS.md`** — Sitzungsstand, offene PRs, wo anzuknüpfen ist.

| Artefakt | Inhalt |
|---|---|
| `STATUS.md` | Sitzungsstand: was erledigt ist, wo weitergeht |
| `docs/skalen.md` | jede Skala mit Regel und Begründung |
| `docs/praesentation.md` | die künftige Präsentation für die Kollegen: was sich ändert und warum (Botschaft, keine Entscheidungsquelle) |
| `docs/migration/altlast.md` | Arbeitsliste für die Migration der Komponenten |
| `design-system/` | das Paket: Quelle, Erzeugnis, Werkzeuge, Gates, Specimen |

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
