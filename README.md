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
node tools/serve.mjs        # Specimen auf http://localhost:8137/
```

Das Paket `@toplogic/design-system` liegt in `design-system/`: `src/` ist die Quelle
(Primitive und Tokens als JSON), `dist/` das eingecheckte Erzeugnis (`primitives.css`,
`tokens.css`, `base.css`, `tokens.dtcg.json`). Details in [`CLAUDE.md`](CLAUDE.md), die Spec in
[`docs/superpowers/specs/2026-09-17-design-system-neuaufbau-design.md`](docs/superpowers/specs/2026-09-17-design-system-neuaufbau-design.md).

## Die eine nicht verhandelbare Regel

**Jeder Design-Wert in TopLogic wird hier definiert. Keine Fremdpaletten. Keine Fallbacks.**

Das ist keine Stilfrage, sondern die Voraussetzung dafür, dass ein Kunde sein Theme durch
Austausch von Tokens einspielen kann. Ein hartkodierter Wert ist eine Stelle, die der Kunde
nicht erreicht.

Im Bestand wurden **drei konkurrierende Paletten** gefunden:

| Palette | Fundstellen | Status |
|---|---|---|
| IBM Carbon | 21 Tokens, u. a. `--layer-01`, `--support-error`, `--border-radius-02`; 177 `var()`-Fallbacks in `tlReactControls.css` | wird entfernt |
| Tailwind | 16 Tokens in `tl-react-chartjs.css` und `tl-react-wysiwyg.css` (`#2563eb`, `#6b7280`, `#374151`) | wird entfernt |
| TopLogic | `theme-settings.xml` | bleibt, wird zur einzigen Quelle |

Durchgesetzt wird das durch die tatsächlichen Gates in `design-system/`:

| Prüfung | Wirkung |
|---|---|
| `node --test` | Schichten, Kontrast, Maße, Erzeugtes, Ratsche — alles aus `docs/skalen.md` als Test |
| `node tools/lint-css.mjs` | Klassen-Gate: Literale, Fremdvariablen, Fokusring, `!important`, Kurven u. a. im ausgelieferten CSS |
| TSX-Lint | geplant, siehe `STATUS.md` |

Die Verzeichnisse `tools/` und `inventory/` auf Repo-Ebene sind Vorarbeit der ersten
Arbeitspakete (Auszählung des Altbestands, nicht Teil des laufenden Gates).

## Stand

**Siehe `STATUS.md`** — Sitzungsstand, offene PRs, wo anzuknüpfen ist.

| Artefakt | Inhalt |
|---|---|
| `STATUS.md` | Sitzungsstand: was erledigt ist, wo weitergeht |
| `docs/skalen.md` | jede Skala mit Regel und Begründung |
| `docs/praesentation.md` | dieselben Inhalte folienweise |
| `docs/migration/altlast.md` | Arbeitsliste für die Migration der Komponenten |
| `design-system/` | das Paket: Quelle, Erzeugnis, Werkzeuge, Gates, Specimen |

## Offene organisatorische Punkte

**Repo-Transfer nach `TopLogic`.** Das Repo liegt derzeit unter `TopLogic/tl-design-system`, weil sich
der Owner beim Anlegen nicht umstellen liess (Repo-Limit der Organisation). Es gehoert nach
`TopLogic`, sobald das geklaert ist — *Settings -> Transfer Ownership*.

**Sichtbarkeit.** Die Gitea-Instanz erzwingt private Repos beim Anlegen. Wenn das System spaeter
fuer Partner oder Kunden lesbar sein soll, ueber *Settings -> Make public* umstellen.

## Verwandte Tickets

| Ticket | Inhalt |
|---|---|
| #29576 | Zweite React-Instanz im Controls-Bundle (Fix liegt vor) |
| #29577 | Deploy-Modus generiert kein Theme-CSS — blockiert Kunden-Theming |
| #29617 | Design System — Tokens und Grundklassen als eigenes Paket (Welle 0); alle Commits dieses Repos und der Worktree-Branch tragen diese Nummer |
| #29108 | TL Views — die React-Schicht, auf der dieses System aufsetzt (geschlossen) |
