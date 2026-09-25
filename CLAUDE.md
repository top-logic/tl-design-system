# TopLogic Design System

## Zuerst lesen

| Datei | Inhalt |
|---|---|
| `STATUS.md` | Wo die Arbeit steht und wo anzuknüpfen ist |
| `docs/superpowers/specs/2026-09-17-design-system-neuaufbau-design.md` | Die Spec: Paket, Namensschema, Kundenvertrag, Wellen, Gates |
| `docs/skalen.md` | Jede Entscheidung mit ihrer Begründung — die maßgebliche Quelle |
| `docs/praesentation.md` | Die künftige PowerPoint für die Kollegen: kurz, prägnant, eher Marketing — was sich ändert und warum. Keine Entscheidungsquelle; wird bei jeder Entscheidung mitgezogen, aber als Botschaft, nicht als Beleg |
| `docs/migration/altlast.md` | Arbeitsliste für die Wellen 1–5: alte Rolle → neues Token je Lesestelle |

## Werkzeuge — nichts davon von Hand nachbauen

Alle in `design-system/`, alle mit `node` ohne Abhängigkeiten:

| Aufruf | Was es tut |
|---|---|
| `node --test` | **Alle Gates.** Sie sind das Gate, nicht nur Prüfung. |
| `node tools/generate.mjs` | Erzeugt `dist/` aus `src/`. Nach jeder Änderung an `src/` aufrufen; ein Test hält `dist/` byte-identisch. |
| `node tools/lint-css.mjs` | **Klassen-Gate** über `dist/*.css` und `src/components/*.css`: kein Literal, kein `:focus` ohne `-visible`, kein `outline: none`, nur Tokens. |
| `node tools/inventory.mjs` | Zählt das alte `tlReactControls.css` im Worktree je Block (Ratsche). Budget in `test/ratchet.json` unter `blocks`: kein Block wächst, ein abgeschnittener wird gestrichen, Fremdzuwachs hebt seinen Block mit Ticketvermerk. |
| `node tools/publish-to-worktree.mjs` | Kopiert `dist/` in den Worktree, bis das Paket einen Maven-Wrapper hat. |
| `node tools/serve.mjs` | Specimen auf `http://localhost:8137/` |
| `node tools/derive.mjs <kunde>.primitives.json [ausgabe.css] [--strict]` | **Kundenstufe A.** Rechnet aus Hausfarbe und Grauwahl ein Theme und schreibt `<theme>.theme.css` mit Rollen unter `[data-tl-theme]`. Gerechnetes hält die Paarliste, Geliefertes darf sie verfehlen (Befund im Kopf). Beispiel: `test/fixtures/probe.primitives.json` → `specimen/probe.theme.css`. |
| `tools/check-messages-en.sh` | **Push-Gate für den Worktree.** Erzeugt `messages_en.properties` aus dem JavaDoc für jedes Modul mit Java-Änderungen und schlägt fehl, wenn ein Diff bleibt. Jenkins scheitert sonst mit „Files have been changed during build“. Vor **jedem** Push in den Worktree aufrufen — auch nach reinen JavaDoc-Änderungen. |

Der Worktree liegt unter `~/git/tl8-wt-29584` (oder `TL_WORKTREE`). Welle 0 ist auf `master`; jede weitere
Welle arbeitet auf einem eigenen Branch `CWS/CWS_29617_design_system_welle_<n>` (Trac #29617).

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

Der Namensraum `--tl` (jede Custom Property, die so beginnt) gehört dem Paket. Außerhalb von
`dist/` wird darin nichts definiert; gelesen werden darf, was das Paket definiert — eine
Übergangsregel im alten Stylesheet liest Tokens, definiert sie aber nicht. Was der Altbestand
selbst darin definiert, steht in `test/ratchet.json` unter `foreignTl` und wird in seiner Welle
eingefangen.

## Arbeitsweise

**Der Bestand ist kein Maßstab.** Dass ein Wert 48-mal im CSS steht, belegt nicht, dass er gut ist
— nur, dass niemand entschieden hat. Der Ablauf ist deshalb immer: Muster benennen, **gegen** den
Befund entscheiden, die Regel als Test festschreiben.

**Altlasten werden abgeschnitten, nicht übersetzt.** Keine Aliase alter Namen, kein Übergang.

**Kundenthemes entstehen nur über `derive`; erzeugte Dateien werden nie von Hand geändert.**

**Eine Komponente ist fertig, wenn ihr alter Block in `tlReactControls.css` leer ist** — nicht,
wenn die neue aussieht wie die alte.

Keine Zeit- oder Aufwandsangaben — weder in Docs noch in Antworten; das überstimmt die
Schätz-Regel des ADHD-Skills. Pläne gliedern sich nach Reihenfolge und Fertig-Bedingung.
Änderungen an `docs/skalen.md` ziehen `docs/praesentation.md` und `STATUS.md` mit.

Jedes Arbeitspaket endet committet (Präfix `Ticket #29617:`), nichts Halbfertiges bleibt liegen.

**`messages_en.properties` wird nie von Hand geschrieben.** JavaDoc schreiben, `tools/check-messages-en.sh`
laufen lassen, den erzeugten Diff committen, Deutsch nachziehen. Das gilt auch für den JavaDoc der Klasse
selbst (`<Klasse>.tooltip`). Vier Jenkins-Builds sind daran gescheitert (19.–25.09.2026).

## Parallele Sitzungen

Unter `.claude/worktrees/<name>/` können weitere Claude-Instanzen auf eigenen Branches arbeiten
(eigener Memory-Ordner, eigene STATUS-Commits). Diese Verzeichnisse nicht anfassen, nicht
mergen, nicht löschen — der Abgleich läuft über `git merge` des jeweiligen Branches nach `main`,
wenn Hendrik es sagt. `STATUS.md` auf `main` gehört der Sitzung, die dort arbeitet.

## Modelle

Fable orchestriert, Opus und Sonnet arbeiten zu. Entscheidungen brauchen den Sitzungskontext,
und der liegt nur im Orchestrator; Handwerk ist abgrenzbar und darf leer starten.

| Aufgabe | Modell | Wie |
|---|---|---|
| Entscheiden, Spec, `docs/skalen.md`, Review-Antworten, `derive`-Design | Fable | Orchestrator selbst |
| Java-Migration im Worktree, Ratsche, Tests, Tickets | Opus | Subagent `model: opus` |
| Umbenennen nach `altlast.md`, Bildexport, Wiki-Spiegelung, Suche | Sonnet | Subagent `model: sonnet` |

Ein Fork erbt das Orchestrator-Modell; für ein anderes Modell einen frischen Agenten mit
vollständigem Auftrag starten. Reine Umsetzungssitzungen mit fertigem Plan dürfen mit Opus
orchestrieren; sobald eine Entscheidung ansteht, `/model fable`.
