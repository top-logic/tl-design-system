# TopLogic Design System

Design-Tokens, Generatoren und Enforcement für TopLogic 8.

Der Ansatz folgt [Polar „Orbit"](https://polar.sh/blog/orbit-llm-safe-design-system):
Ein Design System, dessen Entscheidungen die **einzigen ausdrückbaren** sind. Nicht weil es
dokumentiert ist, sondern weil alles andere nicht durch CI kommt.

> *„Anything you put in a doc is a probability, not a guarantee."*

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

Durchgesetzt wird das durch:

| Prüfung | Wirkung |
|---|---|
| `tools/check-foreign-values.mjs` | findet Fremdpaletten-Werte und Fallbacks, bricht den Build |
| Stylelint `tl/no-token-fallback` | `var(--x, #hex)` ist verboten — fehlt ein Token, wird es angelegt, nicht umgangen |
| Stylelint `tl/known-token` | jedes `var(--x)` muss in der generierten Allowlist stehen |
| Stylelint `color-no-hex` | rohe Farbwerte im CSS sind verboten |
| oxlint `tl/no-design-literals` | Hex- und px-Literale in TSX sind verboten |

## Stand

Stufe 1 (Fundament) läuft. Siehe `plan.md`.

| Artefakt | Inhalt |
|---|---|
| `plan.md` | vollständiger Plan, alle Stufen |
| `findings/AP0-blocker.md` | Blocker-Verifikation: Deploy-Modus, Browser-Matrix, oxlint-Spike, `@layer` |
| `findings/AP1-token-inventar.md` | Token-Nutzungsindex, die drei Drift-Familien |
| `tools/token-inventory.mjs` | erzeugt den Nutzungsindex aus Repo + Java-Deklarationen |
| `tools/check-foreign-values.mjs` | Fremdpaletten-Wächter |
| `spikes/oxlint/` | Nachweis, dass oxlint-JS-Plugins tragen |

## Offene organisatorische Punkte

**Repo-Transfer nach `TopLogic`.** Das Repo liegt derzeit unter `hpe/tl-design-system`, weil sich
der Owner beim Anlegen nicht umstellen liess (Repo-Limit der Organisation). Es gehoert nach
`TopLogic`, sobald das geklaert ist — *Settings -> Transfer Ownership*.

**Sichtbarkeit.** Die Gitea-Instanz erzwingt private Repos beim Anlegen. Wenn das System spaeter
fuer Partner oder Kunden lesbar sein soll, ueber *Settings -> Make public* umstellen.

## Verwandte Tickets

| Ticket | Inhalt |
|---|---|
| #29576 | Zweite React-Instanz im Controls-Bundle (Fix liegt vor) |
| #29577 | Deploy-Modus generiert kein Theme-CSS — blockiert Kunden-Theming |
| #29108 | TL Views — die React-Schicht, auf der dieses System aufsetzt |
