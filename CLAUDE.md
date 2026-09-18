# TopLogic Design System

## Zuerst lesen

| Datei | Inhalt |
|---|---|
| `STATUS.md` | Wo die Arbeit steht und wo anzuknüpfen ist |
| `docs/superpowers/specs/2026-09-17-design-system-neuaufbau-design.md` | Die Spec: Paket, Namensschema, Kundenvertrag, Wellen, Gates |
| `docs/skalen.md` | Jede Entscheidung mit ihrer Begründung — die maßgebliche Quelle |
| `docs/praesentation.md` | Dieselben Inhalte folienweise, wird bei jeder Entscheidung mitgezogen |
| `docs/migration/altlast.md` | Arbeitsliste für die Wellen 1–5: alte Rolle → neues Token je Lesestelle |

## Werkzeuge — nichts davon von Hand nachbauen

Alle in `design-system/`, alle mit `node` ohne Abhängigkeiten:

| Aufruf | Was es tut |
|---|---|
| `node --test` | **Alle Gates.** Sie sind das Gate, nicht nur Prüfung. |
| `node tools/generate.mjs` | Erzeugt `dist/` aus `src/`. Nach jeder Änderung an `src/` aufrufen; ein Test hält `dist/` byte-identisch. |
| `node tools/lint-css.mjs` | **Klassen-Gate** über `dist/*.css` und `src/components/*.css`: kein Literal, kein `:focus` ohne `-visible`, kein `outline: none`, nur Tokens. |
| `node tools/inventory.mjs` | Zählt das alte `tlReactControls.css` im Worktree (Ratsche). Budget in `test/ratchet.json`, darf nur sinken. |
| `node tools/publish-to-worktree.mjs` | Kopiert `dist/` in den Worktree, bis das Paket einen Maven-Wrapper hat. |
| `node tools/serve.mjs` | Specimen auf `http://localhost:8137/` |

Der Worktree liegt unter `~/git/tl8-wt-29584` (oder `TL_WORKTREE`), Branch
`CWS/CWS_29617_design_system_welle_0`.

## Die zwei Schichten

`src/primitives.json` trägt die **Werte** (Farben `blue-49`, Maße `size-4`, Schriften, Dauern,
Effekte). `src/tokens.json` trägt **nur Referenzen** wie `{blue-49}` — Farben je Modus, Effekte je
Modus, Maße, Dichte, Ebenen, Typo-Klassen, Druck. Beschriftungen auf Flächen stehen unter `derived`
und werden gerechnet, nie geschrieben.

Ein Wert in `tokens.json` ist ein Fehler, und der Test fängt ihn. Die Primitive sind die Stelle, an
der Kundenprojekte eingreifen.

## Namen

Alles Öffentliche ist Englisch, kebab-case, Präfix `tl`: Variablen `--tl-surface-brand`, Klassen
`.tl-button--primary`, Attribute `data-tl-mode`, `data-tl-density`. Kategorien der Tokens sind
geschlossen: `surface`, `text`, `icon`, `border`, `focus`, `shadow`, `space`, `radius`, `size`,
`font`, `duration`, `easing`, `layer`, `status`. Zustände sind Attribute, nicht Klassen.

## Arbeitsweise

**Der Bestand ist kein Maßstab.** Dass ein Wert 48-mal im CSS steht, belegt nicht, dass er gut ist
— nur, dass niemand entschieden hat. Der Ablauf ist deshalb immer: Muster benennen, **gegen** den
Befund entscheiden, die Regel als Test festschreiben.

**Altlasten werden abgeschnitten, nicht übersetzt.** Keine Aliase alter Namen, kein Übergang.

**Eine Komponente ist fertig, wenn ihr alter Block in `tlReactControls.css` leer ist** — nicht,
wenn die neue aussieht wie die alte.

Keine Zeitangaben in Docs. Änderungen an `docs/skalen.md` ziehen `docs/praesentation.md` und
`STATUS.md` mit.
