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
   Die Werkzeuge brauchen nur `node` (22+), keine Installation. `TL_WORKTREE` sagt der Wache und
   dem Kopierwerkzeug, wo TopLogic liegt.
2. **Regeldatei als persönlichen Skill ablegen.** `docs/claude/tl-design-system-SKILL.md` aus diesem
   Repo nach `~/.claude/skills/tl-design-system/SKILL.md` kopieren. Claude lädt sie von selbst, sobald
   ein Auftrag CSS, Klassen, Farben, Maße oder eine neue Komponente betrifft; die `description` im Kopf
   ist der Auslöser. In tl-engine-7 wird sie **nicht** eingecheckt: dort liest Claude
   `view-layer/theme-tokens.md`, das noch das alte Token-Modell lehrt, und zwei Regelwerke widersprächen
   sich. Die Regeln kommen mit Trac #29850 als Entwicklerdoc in die Engine, abgestimmt mit Bernhard.

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
Kein CSS in Engine-Stylesheets außer Bibliotheksklassen. Kein Literal, nur var(--tl-*).
```

**Was Claude dann von selbst tut:** liest die Tokennamen aus `dist/tokens.css` statt Werte zu raten;
legt fehlende Tokens in `tokens.json` an, nie lokal in der Klasse; schreibt Zustände als Attribute
und lässt das Gate darüber laufen; misst Kontraste in beiden Modi auf Grund und Panel; meldet
Skalen-Befunde, statt Tests zu lockern.

**Woran man merkt, dass es schiefläuft:** ein neues Engine-Stylesheet mit eigenen Klassen; ein
Hex-Wert, ein `px`, ein `rgba` in einer Klasse; eine Klasse `--active`, `--open`, `--loading`; eine
neue `--tl-…`-Variable außerhalb des Pakets; `node tools/lint-css.mjs` oder die Wache (`ratchet.test.mjs`) sind rot.
Jeder dieser Punkte ist ein Testfehler im Paket; die Gates sind die Prüfung, nicht der Review.

## 3 · Parallel zu den Wellen arbeiten

| Situation | So geht es ohne Doppelarbeit |
|---|---|
| Neue Komponente, die in keiner Welle steht (etwa ein Steuerelement aus einem Kundenprojekt) | Gleich im Paket bauen, nach dem Skill. Kurz an hpe: Name und Welle, dann steht sie in der Wellentabelle und in `altlast.md`. |
| Änderung an einer Komponente, die schon im Paket ist (Button ab Welle 1) | Im Paket ändern, Gates laufen lassen, `publish-to-worktree`, beide Repos committen. Der Kontrasttest der Komponente ist der Review. |
| Änderung an einer alten Komponente | Seit Welle 5d gibt es kein altes Stylesheet mehr (`tlReactControls.css` ist gelöscht, eine Wache schlägt an, wenn es wiederkommt): jede Änderung im Paket. |
| App-spezifischer Look (Glas, Serifen, Hintergrundbild) | App-Stylesheet über `css-class` am Element. Keine Engine-Tokens dafür; eine Display-Schrift kommt als Primitive. |
| Ein Token fehlt oder ein Wert wirkt falsch | Nicht lokal überschreiben. In `tokens.json` anlegen oder in `docs/skalen.md` entscheiden; Beschriftungen auf Flächen werden gerechnet, nicht geschrieben. |
| PR | tl-engine-7-PR mit `hpe` und `jenkins` als Reviewer (ohne `jenkins` baut Jenkins den PR nicht), Design-System-PR mit `bhu`. Beide Repos nennen dieselbe Ticketnummer. |

Der eine Satz, der alles trägt: Aussehen entsteht im Paket, Verhalten in tl-engine-7. Wer `tlReactControls.css`
wieder anlegt, scheitert an der Wache.

## 4 · Die Regeldatei

Inhalt und Pflege: `docs/claude/tl-design-system-SKILL.md`. Wer sie als persönlichen Skill nutzt, kopiert sie nach
Änderungen neu. In tl-engine-7 kommt sie nicht als Datei, sondern mit #29850 als Entwicklerdoc.
