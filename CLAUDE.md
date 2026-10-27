# TopLogic Design System

## Zuerst lesen

| Datei | Inhalt |
|---|---|
| `STATUS.md` | Wo die Arbeit steht und wo anzuknüpfen ist |
| `docs/superpowers/specs/2026-09-17-design-system-neuaufbau-design.md` | Die Spec: Paket, Namensschema, Kundenvertrag, Wellen, Gates |
| `docs/skalen.md` | Jede Entscheidung mit ihrer Begründung — die maßgebliche Quelle |
| `docs/praesentation-v2.md` | Die PowerPoint für alle Kollegen, auch ohne Fachhintergrund: **was** das Design System ist, **wie** es funktioniert, **welche Vorteile** es bringt (z. B. unabhängig von der Basisversion). Oberflächlich und leicht verständlich, keine Beschreibung je Komponente, keine Entscheidungsquelle. Mitgezogen nur, wenn sich am Gesamtbild etwas ändert (Hendrik 19.10.) |
| `docs/praesentation.md` | Version 1, die ausführliche Fassung mit Sprechnotizen je Welle — **Backup**, wird nicht mehr gepflegt |
| `docs/migration/altlast.md` | Arbeitsliste für die Wellen 1–5: alte Rolle → neues Token je Lesestelle |
| `docs/ui-durchgang.md` | Sammelliste für den UI-Durchgang nach Welle 5: was sicher eine Anpassung braucht. Jeder solche Befund einer Welle kommt hier dazu |

## Werkzeuge — nichts davon von Hand nachbauen

Alle in `design-system/`, alle mit `node` ohne Abhängigkeiten:

| Aufruf | Was es tut |
|---|---|
| `node --test` | **Alle Gates.** Sie sind das Gate, nicht nur Prüfung. |
| `node tools/generate.mjs` | Erzeugt `dist/` aus `src/`. Nach jeder Änderung an `src/` aufrufen; ein Test hält `dist/` byte-identisch. |
| `node tools/lint-css.mjs` | **Klassen-Gate** über `dist/*.css` und `src/components/*.css`: kein Literal, kein `:focus` ohne `-visible`, kein `outline: none`, nur Tokens. |
| `node tools/inventory.mjs` | Meldet „gelöscht“: `tlReactControls.css` ist seit Welle 5d weg. `test/ratchet.test.mjs` ist die Wache — rot, wenn die Datei wiederkommt oder jemand außerhalb von `dist/` ein `--tl-…` definiert. |
| `node tools/publish-to-worktree.mjs` | Kopiert `dist/` in den Worktree, bis das Paket einen Maven-Wrapper hat. Nach jedem `generate` aufrufen; `test/published.test.mjs` hält die Kopie byte-gleich. Jede Datei endet mit einem Siegel (SHA-256); `TestDesignSystemCopy` in der Engine bricht den Jenkins-Build bei einer Handänderung an der Kopie. |
| `node tools/serve.mjs` | Specimen auf `http://localhost:8137/` |
| `node tools/derive.mjs <theme>.primitives.json [<ausgabe>.css] [--strict]` | **Kundenstufe A.** Rechnet aus Hausfarbe und Grauwahl ein Theme und schreibt `<theme>.theme.css` mit Rollen unter `[data-tl-theme]`. Gerechnetes hält die Paarliste, Geliefertes darf sie verfehlen (Befund im Kopf). Beispiel: `test/fixtures/probe.primitives.json` → `specimen/probe.theme.css`. |
| `tools/check-messages-en.sh` | **Push-Gate für den Worktree.** Erzeugt `messages_en.properties` aus dem JavaDoc für jedes Modul mit Java-Änderungen und schlägt fehl, wenn ein Diff bleibt. Jenkins scheitert sonst mit „Files have been changed during build“. Prüft auch die Sortierung aller `messages_*.properties` (Ressourcen-Check; sonst wird der PR-Build UNSTABLE). Vor **jedem** Push in den Worktree aufrufen — auch nach reinen JavaDoc-Änderungen. |

Der Worktree liegt unter `_Working-Tree/tl8-wt-29584` im Projektordner (ignoriert; oder `TL_WORKTREE`), das
Hauptrepo daneben. Beides muss dort liegen: die Sandbox sieht nur den Projektordner und `~/.m2`, nicht `~/git`. Welle 0 ist auf `master`; jede weitere
Welle arbeitet auf einem eigenen Branch `CWS/CWS_<ticket>_design_system_welle_<n>` mit eigenem Trac-Ticket (Wellen 0–3a
#29617, mit alpha10 geschlossen; 3b #29821; 4a #29836; 4b #29866; 4c #29870; 5a #29875; 5b #29904; 5c #29906; 5d #29914; UI-Durchgang 1 #30000, Branch `CWS/CWS_30000_ui_durchgang_1`). Ein Release schließt jedes Ticket, dessen Arbeit auf master liegt — darum
vor jeder Welle ein neues Ticket anlegen und annehmen.

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
`font`, `duration`, `easing`, `layer`, `status`, `category`. Zustände sind Attribute, nicht Klassen.

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

**Gleiches wird zusammengelegt, nicht zweimal neu gebaut.** Findet eine Erkundung zwei Stellen, die dasselbe
zeichnen oder tun (Popup, Knopf, Eintrag, Spinner, Trenner, Drag-Logik …), gibt es **vor der Spec** eine Prognose
je Befund: sichtbarer Unterschied heute, worauf zusammenlegen, UX-Gewinn, berührte Stellen, Urteil (lohnt / lohnt
mit der Welle / lohnt nicht). Hendrik kreuzt an, erst dann Spec. Gebautes wird bei jeder neuen Welle gegen die
neuen Komponenten nachgeprüft. Anlass 01.10.: drei Popups mit drei Verhalten in Welle 3; die Nachprüfung der
Wellen 0–2 fand acht Positionsrechnungen, drei Upload-Fassungen, vier Fokus-Formen. Tabellen in
`docs/migration/altlast.md` „Konsolidierung“.

**Eine Komponente war fertig, wenn ihr alter Block in `tlReactControls.css` leer war** — nicht,
wenn die neue aussieht wie die alte. Seit Welle 5d ist die Datei gelöscht; neue Komponenten entstehen nur im Paket.

Keine Zeit- oder Aufwandsangaben — weder in Docs noch in Antworten; das überstimmt die
Schätz-Regel des ADHD-Skills. Pläne gliedern sich nach Reihenfolge und Fertig-Bedingung.
Änderungen an `docs/skalen.md` ziehen `STATUS.md` mit; `docs/praesentation-v2.md` nur, wenn sie das Gesamtbild ändern (was, wie, Vorteile).

Jedes Arbeitspaket endet committet (Präfix `Ticket #<Wellenticket>:`, für 3b `Ticket #29821:`, für 4a `Ticket #29836:`, für 4b `Ticket #29866:`, für 4c `Ticket #29870:`, für 5a `Ticket #29875:`, für 5b `Ticket #29904:`, für 5c `Ticket #29906:`, für 5d `Ticket #29914:`, für UI-Durchgang 1 `Ticket #30000:`), nichts Halbfertiges
bleibt liegen.

**Gepusht wird nur nach Hendriks ausdrücklicher Freigabe** — Engine-Branches im Worktree wie Projekt-`main`; eine
Freigabe gilt für einen Push. **Subagenten pushen nie**, auch nicht mit Freigabe: sie committen lokal und melden; den
freigegebenen Push macht der Orchestrator. Steht „push“ als Schritt in einem Plan, ist das ein Vorschlag, keine Freigabe.
**Nie direkt auf `master` von tl-engine-7** — dort nur über PR und Merge in Gitea; gepusht werden nur die
`CWS/CWS_<ticket>_…`-Branches und `main` dieses Repos (`TopLogic/tl-design-system`). Jede Push-Frage nennt Repo und Branch.

**Kein Plan geht ohne Plan-Review in die Ausführung.** Die Selbstprüfung des Autors (`writing-plans`) prüft
gegen die Spec; sie findet nicht, was am Code scheitert. Vor dem Start der SDD prüft ein **frischer Agent**
(Opus, oder Fable selbst, wenn Opus geplant hat) jeden Plan gegen die Gates: jedes geplante CSS gegen
`tools/lint-css.mjs` und die bestehenden Komponenten, jede Regex und jeden Parser gegen ein echtes Beispiel,
jede Behauptung „dieser Test scheitert“ gegen die Datei, die den Test wirklich enthält. Anlass 30.09.: sechs
Fehler im Plan der Welle 2, zwei davon Gate-Brüche, alle erst beim Fremd-Review gefunden.

**`messages_en.properties` wird nie von Hand geschrieben.** JavaDoc schreiben, `tools/check-messages-en.sh`
laufen lassen, den erzeugten Diff committen, Deutsch nachziehen. Das gilt auch für den JavaDoc der Klasse
selbst (`<Klasse>.tooltip`). Vier Jenkins-Builds sind daran gescheitert (19.–25.09.2026).

## Parallele Sitzungen

Unter `.claude/worktrees/<name>/` können weitere Claude-Instanzen auf eigenen Branches arbeiten
(eigener Memory-Ordner, eigene STATUS-Commits). Diese Verzeichnisse nicht anfassen, nicht
mergen, nicht löschen — der Abgleich läuft über `git merge` des jeweiligen Branches nach `main`,
wenn Hendrik es sagt. `STATUS.md` auf `main` gehört der Sitzung, die dort arbeitet.

## Modelle

Fable oder Opus 5.5 orchestriert (seit 02.10.: beide gleichwertig). Verteilt wird nach der Art der
Arbeit, nicht nach ihrem Umfang (13.10.): Entscheidungen und Analysen mit Tragweite bleiben beim
Orchestrator, denn sie brauchen den Sitzungskontext, und der liegt nur dort; Produktion geht an Sonnet,
Menge ohne Urteil an Haiku. **Bedingung für jeden Orchestrator: alles wird verifiziert** — jedes
Ergebnis eines Subagenten gegen Gates, Datei und laufende Instanz geprüft, bevor es als fertig gilt.

| Art | Modell | Beispiele |
|---|---|---|
| Entscheiden, Analysieren mit Tragweite | Orchestrator selbst | Spec, `docs/skalen.md`, Review-Antworten, `derive`-Design, Konsolidierungsprognosen, Merge-Konflikte mit Entwurfsfolgen, Ursache eines roten Builds |
| Prüfen mit Tragweite | frischer Agent `model: opus` (Fable, wenn Opus geplant hat) | Plan-Review vor SDD, Code-Review von Rechenkernen (`derive`, Kontrast) |
| Alltägliche Produktion nach geprüftem Plan | Sonnet | Java-/TSX-Migration im Worktree, Ratsche, Tests, Tickets, Gates laufen lassen und berichten |
| Viel Menge, wenig Urteil | Haiku | Umbenennen nach `altlast.md`, Bildexport, Wiki-Spiegelung, Suche, Zählungen |

- **Ein Auftrag an Sonnet oder Haiku ist vollständig:** Dateien, Ziel, Gates, Fertig-Bedingung, bekannte
  Fehler. Was zu entscheiden wäre, entscheidet der Orchestrator vorher; stößt der Subagent auf eine
  Entscheidung, meldet er sie, statt sie zu treffen.
- **Haiku nur, wo das Ergebnis mechanisch prüfbar ist** (Gate, Test, Diff, Zählung) — sonst frisst die
  Nachprüfung die Ersparnis.
- **Gates gibt der Orchestrator standardmäßig ab**; ihre Logs gehören nicht in seinen Kontext.
- **Kleiner als der Auftrag → selbst:** was in wenigen Handgriffen erledigt ist, wird nicht delegiert.

Ein Fork erbt das Orchestrator-Modell; für ein anderes Modell einen frischen Agenten mit
vollständigem Auftrag starten. Das Plan-Review bleibt bei einem frischen Agenten, nicht beim Autor.
