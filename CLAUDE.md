# TopLogic Design System

## Zuerst lesen

| Datei | Inhalt |
|---|---|
| `STATUS.md` | Wo die Arbeit steht und wo anzuknüpfen ist |
| `docs/skalen.md` | Jede Entscheidung mit ihrer Begründung — die maßgebliche Quelle |
| `docs/praesentation.md` | Dieselben Inhalte folienweise, wird bei jeder Entscheidung mitgezogen |

## Werkzeuge — nichts davon von Hand nachbauen

Alle im Verzeichnis `specimen/`, alle mit `node` ohne Abhängigkeiten:

| Aufruf | Was es tut |
|---|---|
| `node inventar.mjs` | **Zählt das ausgelieferte CSS aus** — Schriftgrößen, Radien, Rahmenbreiten, Abstände samt Lücken, die Fokus-Mechanismen, Motion. Löst die Theme-Tokens auf. `--json` für die Rohdaten. |
| `node generieren.mjs` | Erzeugt `skala.css` aus `skala.json`. Nach jeder Änderung an der Skala aufrufen. |
| `node stellen.mjs [token]` | **Zählt aus, WO das CSS die mehrdeutigen Tokens liest** — Selektor, Eigenschaft und die Rolle, die dort gilt. `--json` für die Rohdaten. |
| `node --test` | Alle Tests — sie sind das Gate, nicht nur Prüfung. |
| `node serve.mjs` | Specimen auf `http://localhost:8137/` |

**Vor jeder Auszählung `inventar.mjs` benutzen, statt `grep` zusammenzusetzen.** Die Zahlen in
`docs/` stammen daraus und werden von `inventar.belege.test.mjs` gegen das echte Stylesheet
gehalten; eine von Hand ermittelte Zahl bricht diese Kette.

Das ausgelieferte CSS liegt im Worktree unter `~/git/tl8-wt-29584` (oder `TL_WORKTREE`).

## Die beiden Schichten

`specimen/skala.json` hält den **Soll-Zustand**: `primitiv` trägt die Werte, alles darüber nur
Referenzen wie `{blue-49}`. `specimen/tokens.json` daneben hält den **Ist-Zustand** des
ausgelieferten Themes — die beiden nicht verwechseln.

Ein Hex-Wert in der Rollenschicht ist ein Fehler, und der Test fängt ihn. Die Primitive sind die
Stelle, an der Kundenprojekte eingreifen.

## Arbeitsweise

**Der Bestand ist kein Maßstab.** Dass ein Wert 48-mal im CSS steht, belegt nicht, dass er gut ist
— nur, dass niemand entschieden hat. Der Ablauf ist deshalb immer: Inventar erheben, das Muster
benennen, **gegen** den Befund entscheiden, die Regel als Test festschreiben.

Änderungen an `docs/skalen.md` ziehen `docs/praesentation.md` und `STATUS.md` mit.
