# Komponenten mit Claude bauen

Wie Claude in tl-engine-7 neue oder geänderte React-Komponenten direkt richtig auf das Design System
setzt, auch wenn parallel zu den Wellen gearbeitet wird. Drei Teile: einmal einrichten, je Komponente
so prompten, und die Regeldatei, die Claude dabei selbst liest.

## 1 · Einmal einrichten

1. **Design-System-Repo neben den Worktree legen.**
   ```
   git clone https://git.top-logic.com/TopLogic/tl-design-system.git ~/git/tl-design-system
   export TL_WORKTREE=~/git/<dein-tl-engine-7-worktree>
   ```
   Die Werkzeuge brauchen nur `node` (22+), keine Installation. `TL_WORKTREE` sagt der Ratsche und
   dem Kopierwerkzeug, wo TopLogic liegt.
2. **Regeldatei als Skill in tl-engine-7 ablegen.** `docs/claude/tl-design-system-SKILL.md` aus diesem
   Repo nach `.claude/skills/tl-design-system/SKILL.md` in tl-engine-7 kopieren. Claude lädt sie von
   selbst, sobald ein Auftrag CSS, Klassen, Farben, Maße oder eine neue Komponente betrifft; die
   `description` im Kopf ist der Auslöser. Eingecheckt gilt sie für jeden, der im Repo mit Claude arbeitet.
3. **Zwei Zeilen in die `CLAUDE.md` von tl-engine-7**, Abschnitt „Development Patterns“:
   ```
   ### Styling React controls
   Any CSS, className, color, size or state on a React control follows the skill
   `tl-design-system` (.claude/skills/tl-design-system/SKILL.md). Styling never goes
   into tlReactControls.css; new components are built in the design-system package.
   ```

## 2 · Je Komponente: so prompten

Der Skill übernimmt die Regeln. Der Prompt muss nur Ziel und Grenze nennen:

```
Baue <Komponente> als Design-System-Komponente. Lies zuerst den Skill tl-design-system
und docs/skalen.md im Design-System-Repo (~/git/tl-design-system).

Varianten: <welche der Autor wählt, z. B. default | segmented>
Zustände: <disabled, aria-checked, aria-busy … — als Attribute>
Kontexte: <wo sie liegt: Formular, Toolbar, Tabellenzeile>

Ablauf: Entscheidung in docs/skalen.md begründen → CSS unter
design-system/src/components/<name>/ → Kontrasttest, Specimen, Vertrag →
node tools/generate.mjs && node --test && node tools/lint-css.mjs grün →
publish-to-worktree → TSX auf tl-<name>-Klassen → beide Repos committen.
Kein CSS in tlReactControls.css. Kein Literal, nur var(--tl-*).
```

**Was Claude dann von selbst tut:** liest die Tokennamen aus `dist/tokens.css` statt Werte zu raten;
legt fehlende Tokens in `tokens.json` an, nie lokal in der Klasse; schreibt Zustände als Attribute
und lässt das Gate darüber laufen; misst Kontraste in beiden Modi auf Grund und Panel; meldet
Skalen-Befunde, statt Tests zu lockern.

**Woran man merkt, dass es schiefläuft:** ein Diff an `tlReactControls.css`, der wächst; ein
Hex-Wert, ein `px`, ein `rgba` in einer Klasse; eine Klasse `--active`, `--open`, `--loading`; eine
neue `--tl-…`-Variable außerhalb des Pakets; `node tools/lint-css.mjs` oder die Ratsche sind rot.
Jeder dieser Punkte ist ein Testfehler im Paket; die Gates sind die Prüfung, nicht der Review.

## 3 · Parallel zu den Wellen arbeiten

| Situation | So geht es ohne Doppelarbeit |
|---|---|
| Neue Komponente, die in keiner Welle steht (Chips, Segmented, Slider) | Gleich im Paket bauen, nach dem Skill. Kurz an hpe: Name und Welle, dann steht sie in der Wellentabelle und in `altlast.md`. |
| Änderung an einer Komponente, die schon im Paket ist (Button ab Welle 1) | Im Paket ändern, Gates laufen lassen, `publish-to-worktree`, beide Repos committen. Der Kontrasttest der Komponente ist der Review. |
| Änderung an einer alten Komponente, deren Welle noch nicht dran ist (Tabelle, Dialog) | (a) klein und dringend: im alten CSS, aber ohne neue Literale und ohne eigene `--tl`-Definitionen, Ratsche darf nicht steigen; (b) größer: die Komponente vorziehen und nach dem Skill komplett ins Paket holen. (b) ist fast immer billiger als zweimal anfassen. |
| App-spezifischer Look (Glas, Serifen, Hintergrundbild) | App-Stylesheet über `css-class` am Element. Keine Engine-Tokens dafür; eine Display-Schrift kommt als Primitive. |
| Ein Token fehlt oder ein Wert wirkt falsch | Nicht lokal überschreiben. In `tokens.json` anlegen oder in `docs/skalen.md` entscheiden; Beschriftungen auf Flächen werden gerechnet, nicht geschrieben. |
| PR | tl-engine-7-PR mit `hpe` als Reviewer, Design-System-PR mit `bhu`. Beide Repos nennen dieselbe Ticketnummer. |

Der eine Satz, der alles trägt: Aussehen entsteht im Paket, Verhalten in tl-engine-7. Wer CSS in
`tlReactControls.css` schreibt, baut gegen die Ratsche.

## 4 · Die Regeldatei

Inhalt und Pflege: `docs/claude/tl-design-system-SKILL.md`. Bei Änderungen dort nach tl-engine-7 neu kopieren.
