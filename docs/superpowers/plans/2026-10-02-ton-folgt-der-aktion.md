# Ton folgt der Aktion — Implementierungsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eine destruktive Aktion ist überall als destruktiv erkennbar — Toolbar, Toolbar-Überlauf, Kontextmenü, Dialogfuß, Rückfrage —, ohne dass ein Autor an einem Knopf etwas einstellt: der Ton folgt dem, was das Kommando tut.

**Architecture:** Paket (`design-system/`): ein Modifier `tl-menu__item--danger` mit den drei Token-Paaren von `tl-button--ghost.tl-button--danger`, Vertrag, Specimen, Gate. Engine (`_Working-Tree/tl8-wt-29584`, Branch `CWS/CWS_29617_design_system_ton` von `welle_3a`): `ViewAction.getTone()` ist der dritte Fakt einer Aktion neben `appliesFormState()` und `getIntrinsicRule()`, aggregiert in `ViewActions.tone`, durchgereicht über `ViewCommand` → `ViewCommandModel` (Clique `delete` als zweite Quelle) → `CommandModel.getTone()` → `ReactButtonControl` und `MenuEntry`; die Rückfrage liest den Ton des Kettenrests über `Continuation.tone()`. Client: `menuItemClassName(current, extra, danger)` ist die eine Stelle, an der Kontextmenü und Toolbar-Überlauf den Ton zeichnen.

**Tech Stack:** Node (ohne Abhängigkeiten) im Paket; Java 21/Maven (JUnit 3, `ServiceTestSetup`), msgbuf 1.3.0 (`state.proto` → Java und `control-state.ts`), React 19/TypeScript/Vite in `com.top_logic.layout.react`.

**Spec:** `docs/superpowers/specs/2026-10-02-ton-folgt-der-aktion-design.md` — Begründung `docs/skalen.md` „Ton folgt der Aktion“.

**Plan-Review:** ausstehend. Vor der SDD prüft ein frischer Agent (Opus) jeden Task gegen die Gates (CLAUDE.md „Kein Plan geht ohne Plan-Review in die Ausführung“).

**Zwei Lücken der Spec, im Plan geschlossen (Fable bestätigt oder streicht im Plan-Review):**
1. **Zusammengesetzte Aktionen.** `WithTransactionAction`, `IfAction` und `SwitchAction` reichen `appliesFormState()` bzw. `getIntrinsicRule()` ihrer inneren Aktionen schon heute weiter. Ohne dasselbe für den Ton wäre `<with-transaction><delete-object/></with-transaction>` nicht rot. Task 3 lässt sie `getTone()` aus ihren inneren Aktionen bilden — `If`/`Switch` wie bei `appliesFormState`: jeder Zweig zählt, auch der nicht genommene.
2. **Verschachtelte Rückfrage.** Steht `<confirm>` in einem `<if>`-Zweig und folgt das Löschen erst in der äußeren Kette, kennt `ChainContinuation` des Zweigs nur den Zweigrest. Task 5 gibt `ViewActionChain.nest` den Ton der äußeren Fortsetzung mit; `ResumeWith` (Navigation) reicht `tone()` durch.

Außerdem: Der Delegations-Test für `FormScopedCommandModel` (Spec §7) **gibt es schon** — `TestFormScopedCommands.testEveryCommandAccessorIsDelegated`. Task 2 macht ihn rot (neue Methode an `CommandModel`) und im selben Task grün (Delegation); kein neuer Test.

## Global Constraints

- Alles Öffentliche: Englisch, kebab-case, Präfix `tl` (`--tl-…`, `.tl-…`, `data-tl-…`); Zustände sind Attribute, nie Klassen (CLAUDE.md „Namen“). „Ton ist kein Zustand, darum eine Klasse wie am Knopf, kein `data-tl-tone`.“
- „Genau die drei Token-Paare von `tl-button--ghost.tl-button--danger`, keine neuen Tokens. Deaktiviert gewinnt `text-disabled` weiter.“
- „**Kein Attribut `tone`/`appearance` am Kommando.**“ „**Keine weiteren Töne.** `ButtonTone` behält `DEFAULT` und `DANGER`.“
- „Nicht geändert: `ViewCommand.Config`, `ButtonTone`, `ButtonState` (hat `tone`), `ToolbarBuilder` (Enter → `primary`; ein Löschen auf Enter wird damit `primary` + `danger`), `CliqueRegistry`.“
- „serialisiert wird `tone` nur, wenn er nicht `DEFAULT` ist („absent means default“, wie am Knopf)“; das Proto-Feld ist `ButtonState.Tone tone;` — „das vorhandene Enum, kein zweites“.
- „Der Ton ist je Kommando fest; `handleModelChange` zieht ihn nicht nach.“ „`markAsDefault()` bleibt: Enter bestätigt, der Knopf ist `primary` + `danger`.“
- Branch „`CWS/CWS_29617_design_system_ton` auf `CWS/CWS_29617_design_system_welle_3a`, bis !1760 gemergt ist; dann gegen `master`.“
- Paket: nach jeder Änderung an `src/` `node tools/generate.mjs`; `node --test` und `node tools/lint-css.mjs` sind das Gate (heute 266 Tests, Lint grün). **Kein Commit mit rotem Test.** `dist/` kommt nur über `node tools/publish-to-worktree.mjs` in den Worktree.
- Kein Literal in Komponenten-CSS (Farbe, Maß, Dauer), kein `:focus` ohne `-visible`, kein `outline: none`, `font-weight` nur in `tl-type-*`-Klassen.
- Engine-Maven immer im Modulverzeichnis und mit ausgeschriebenen Argumenten (zsh spaltet eine Variable nicht in mehrere Argumente):
  `JAVA_HOME=/opt/homebrew/Cellar/openjdk@21/21.0.10/libexec/openjdk.jdk/Contents/Home mvn -o -B -Dmaven.repo.local=/Users/hendrik/Claude/TopLogic-v8-DesignSystem/_Working-Tree/tl8-wt-29584/.m2/repository -Dskip.npm -Dskip.installnodenpm …`. Tests brauchen zusätzlich `-DskipTests=false test -Dtest=<Klasse>`. Ein layout.view-Test sieht Änderungen in layout.react erst nach `… -q install` in `com.top_logic.layout.react` (Tests dort per POM übersprungen).
- `messages_en.properties` nie von Hand: nach dem Commit eines Engine-Tasks `MAVEN_ARGS="-Dmaven.repo.local=/Users/hendrik/Claude/TopLogic-v8-DesignSystem/_Working-Tree/tl8-wt-29584/.m2/repository -Dskip.npm -Dskip.installnodenpm" JAVA_HOME=/opt/homebrew/Cellar/openjdk@21/21.0.10/libexec/openjdk.jdk/Contents/Home design-system/tools/check-messages-en.sh` (aus dem Projektordner); bleibt ein Diff, wird er committet und `messages_de.properties` desselben Moduls nachgezogen. Neue Methoden ohne Konfigurationseigenschaft erzeugen erfahrungsgemäß keinen Diff (Welle 3a, E7).
- Erzeugte Dateien (`state/MenuState.java`, `state/impl/MenuState_Impl.java`, `react-src/state/control-state.ts`) werden nie von Hand geändert, nur über msgbuf erzeugt und dann committet.
- Vor jedem Push `git fetch` (Bernhard committet auf unsere Branches); **Push und PR macht Hendrik** bzw. der Orchestrator nach Hendriks Ja.
- Commits mit Präfix `Ticket #29617:`; Paket-/Doku-Commits deutsch im Projekt-Repo, Engine-Commits englisch; Trailer `Co-Authored-By: <Modell, das den Task gebaut hat> <noreply@anthropic.com>`.
- Keine Zeit- oder Aufwandsangaben in Docs, Kommentaren oder Commits.

## Review Focus

1. **Ein Löschen in einer Transaktion oder einem Zweig ist rot** (`<with-transaction><delete-object/></with-transaction>`, `<if>`/`<switch>` mit `delete-object` in irgendeinem Zweig) — Task 3, `TestActionTone.testCompositesCarryTheToneOfTheActionsTheyRun`.
2. **Eine Rückfrage in einem `<if>`-Zweig vor einem Löschen der äußeren Kette ist rot** — Task 5, `TestActionTone.testANestedConfirmationSeesTheRestOfTheEnclosingChain`.
3. **Ein deaktivierter destruktiver Menüeintrag bleibt grau, auch unter dem Zeiger** — Task 1, `popover.test.mjs` „deaktiviert steht nach dem Ton“.
4. **Ein Löschen, das ein Formular anbietet, bleibt rot** (`FormScopedCommandModel` delegiert `getTone`) — Task 2 Step 8 rot, Step 9 grün: `TestFormScopedCommands.testEveryCommandAccessorIsDelegated`.
5. **In „Wirklich löschen?“ ist nur Bestätigen rot, Abbrechen nie; eine gewöhnliche Rückfrage bleibt `primary` ohne Ton** — Task 5, `TestDialogButtonTone.testTheConfirmationOfADestructionIsRedAndStaysOnEnter` und `testAnOrdinaryConfirmationStaysPrimary`.

---

## Dateistruktur

Pfadkürzel: **WT** = `_Working-Tree/tl8-wt-29584`; **R** = `WT/com.top_logic.layout.react/src/main/java/com/top_logic/layout/react`; **RT** = `WT/com.top_logic.layout.react/src/test/java/test/com/top_logic/layout/react`; **RS** = `WT/com.top_logic.layout.react/react-src`; **V** = `WT/com.top_logic.layout.view/src/main/java/com/top_logic/layout/view`; **VT** = `WT/com.top_logic.layout.view/src/test/java/test/com/top_logic/layout/view`.

**Paket `design-system/`**

| Datei | Verantwortung |
|---|---|
| `src/components/menu/menu.css` (ändern) | `.tl-menu__item--danger` ruhend, Zeigen, Drücken; vor `:disabled` |
| `src/components/menu/menu.contract.md` (ändern) | Feld `tone`, Tokens, Attribut, Konformität |
| `src/components/menu/menu.spec.html` (ändern) | roter Eintrag, aktiv und deaktiviert, auf drei Flächen, hell/dunkel per Schalter |
| `test/popover.test.mjs` (ändern) | Gate für den Modifier (hier liegen die Menü-Tests; ein `menu.test.mjs` gibt es nicht) |
| `dist/components.css` (erzeugt) | |

**Engine, `com.top_logic.layout.react`**

| Datei | Verantwortung |
|---|---|
| `R/control/button/CommandModel.java` (ändern) | `default ButtonTone getTone()`; Hinweis „destruktiv per CSS-Klasse“ an `getCssClasses()` fällt |
| `R/control/button/ReactButtonControl.java:79-95` (ändern) | `setTone(model.getTone())` im Konstruktor |
| `R/control/button/MessageButtons.java:166-171` (ändern) | `discard` setzt `DANGER` |
| `R/control/overlay/ReactMenuControl.java` (ändern) | `MenuEntry` mit Komponente `tone`, Überladung `item(…, tone)`, Serialisierung |
| `R/control/overlay/ContextMenuOpener.java:279-286` (ändern) | reicht `cmd.getTone()` durch |
| `R/control/overlay/ConfirmDialogControl.java:55-92` (ändern) | Parameter `ButtonTone confirmTone` |
| `R/state/state.proto` (ändern), `R/state/MenuState.java`, `R/state/impl/MenuState_Impl.java`, `RS/state/control-state.ts` (erzeugt) | `MenuState.Entry.tone` |
| `RS/controls/menu/Menu.tsx`, `RS/controls/TLMenu.tsx`, `RS/controls/button/ButtonDefaults.tsx`, `RS/controls/TLButton.tsx` (ändern) | Ton im Eintrag |
| `RT/control/button/TestReactButtonState.java` (ändern) | Knopf übernimmt den Ton des Modells |
| `RT/control/overlay/TestDialogButtonTone.java` (neu) | Verwerfen und Rückfrage |
| `RT/state/TestControlStateSchema.java` (ändern) | `tone` im Eintrag deklariert, `DEFAULT` nicht gesendet |

**Engine, `com.top_logic.layout.view`**

| Datei | Verantwortung |
|---|---|
| `V/command/ViewAction.java`, `ViewActions.java`, `DeleteObjectAction.java` (ändern) | der Fakt und seine Aggregation |
| `V/command/WithTransactionAction.java`, `IfAction.java`, `SwitchAction.java` (ändern) | Ton der inneren Aktionen (Lücke 1) |
| `V/command/ViewCommand.java`, `GenericViewCommand.java`, `ViewCommandModel.java` (ändern) | Kommando und Modell, Clique `delete` |
| `V/element/FormElement.java:541-650` (ändern, Task 2) | `FormScopedCommandModel.getTone` |
| `V/command/Continuation.java`, `ViewActionChain.java`, `ConfirmAction.java` (ändern), `V/navigation/ResumeWith.java` (ändern) | Ton des Kettenrests (Lücke 2) |
| `VT/command/TestActionTone.java` (neu) | Aktion, Kette, Modell, Fortsetzung |
| `VT/command/FakeCommandModels.java`, `TestContextMenuOpener.java` (ändern) | Eintrag eines destruktiven Kommandos |

**Projekt:** `docs/migration/altlast.md`, `STATUS.md` (Task 6); `docs/skalen.md` „Entschieden beim Bauen“ und `docs/praesentation.md` nur, wenn Fable die beiden Lücken bestätigt.

**Zeilenangaben** beziehen sich auf `a998872f72` (Kopf von `welle_3a`, 02.10.); wer später baut, prüft sie mit `grep -n`.

---

### Task 1: Paket — `tl-menu__item--danger`, Engine-Branch, publizieren

**Files:**
- Modify: `design-system/src/components/menu/menu.css` (nach `.tl-menu__item:active`, vor `.tl-menu__item:focus-visible`), `menu.contract.md`, `menu.spec.html`
- Test: `design-system/test/popover.test.mjs`
- Erzeugt: `design-system/dist/components.css`; im Worktree `com.top_logic.layout.react/src/main/webapp/style/tl-design-system/components.css`

**Interfaces:**
- Produces: Klasse `tl-menu__item--danger` (neben `tl-menu__item`, vor der Typo-Klasse); Leser: `menuItemClassName` in Task 4. Engine-Branch `CWS/CWS_29617_design_system_ton`.

- [ ] **Step 1: Test schreiben** — in `design-system/test/popover.test.mjs` die Importzeile erweitern und zwei Tests anhängen:

```js
import { readGenerated, declarationsOf, missingInContract, componentCssFiles, colorVarsOf, rulesOf } from './lib/component.mjs';
```

```js
test('tl-menu__item--danger: genau die drei Paare von tl-button--ghost.tl-button--danger', () => {
  const menu = readGenerated('menu', 'menu.css');
  const button = readGenerated('button', 'button.css');
  const paar = (css, sel) => colorVarsOf(declarationsOf(css, sel) ?? '');
  assert.deepEqual(paar(menu, '.tl-menu__item--danger'), ['status-error-text']);
  assert.deepEqual(paar(menu, '.tl-menu__item--danger'), paar(button, '.tl-button--danger.tl-button--ghost'));
  assert.deepEqual(paar(menu, '.tl-menu__item--danger:hover'), ['status-error-surface', 'text-on-status-error']);
  assert.deepEqual(paar(menu, '.tl-menu__item--danger:hover'), paar(button, '.tl-button--danger.tl-button--ghost:hover'));
  assert.deepEqual(paar(menu, '.tl-menu__item--danger:active'), ['status-error-surface-active', 'text-on-status-error-active']);
  assert.deepEqual(paar(menu, '.tl-menu__item--danger:active'), paar(button, '.tl-button--danger.tl-button--ghost:active'));
  const md = readFileSync(new URL('../src/components/menu/menu.contract.md', import.meta.url), 'utf8');
  assert.deepEqual(missingInContract(md, ['tl-menu__item--danger', 'tone']), []);
});

test('tl-menu__item--danger: deaktiviert steht nach dem Ton, der Ton nach dem Eintrag', () => {
  // Gleiche Spezifität (0,2,0): ohne diese Reihenfolge färbte Zeigen einen deaktivierten Eintrag rot,
  // oder der Grundeintrag überschriebe das Rot.
  const order = rulesOf(readGenerated('menu', 'menu.css')).map(([sel]) => sel);
  const ton = ['.tl-menu__item--danger', '.tl-menu__item--danger:hover', '.tl-menu__item--danger:active'].map((s) => order.indexOf(s));
  assert.ok(ton.every((i) => i >= 0), 'eine Regel des Tons fehlt');
  assert.ok(order.indexOf('.tl-menu__item:active') < Math.min(...ton), 'der Ton steht vor dem Grundeintrag');
  assert.ok(order.indexOf('.tl-menu__item:disabled') > Math.max(...ton), 'deaktiviert steht vor dem Ton');
});
```

- [ ] **Step 2: Rot sehen** — `cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem/design-system && node --test test/popover.test.mjs` → FAIL: „eine Regel des Tons fehlt“ bzw. `deepEqual` mit `[]` gegen `['status-error-text']`.

- [ ] **Step 3: CSS** — in `src/components/menu/menu.css` direkt nach der Regel `.tl-menu__item:active { background: var(--tl-surface-interactive-active); }` einfügen:

```css

/* Ton folgt der Aktion (docs/skalen.md): der Eintrag einer destruktiven Aktion trägt die drei Paare
   von tl-button--ghost.tl-button--danger. Eine Klasse wie am Knopf, kein Attribut — Ton ist kein
   Zustand. Steht nach dem Grundeintrag und vor :disabled: bei gleicher Spezifität gewinnt
   deaktiviert, auch unter dem Zeiger. */
.tl-menu__item--danger {
  color: var(--tl-status-error-text);
}

.tl-menu__item--danger:hover {
  background: var(--tl-status-error-surface);
  color: var(--tl-text-on-status-error);
}

.tl-menu__item--danger:active {
  background: var(--tl-status-error-surface-active);
  color: var(--tl-text-on-status-error-active);
}
```

und im Kopfkommentar der Datei den Satz „Zustände sind Attribute: aria-current (…), disabled.“ ergänzen um „ Der Ton (destruktiv) ist kein Zustand und darum der Modifier tl-menu__item--danger.“

- [ ] **Step 4: Vertrag** — `src/components/menu/menu.contract.md`:
  - Tabelle **Zustand**, Zeile `items`: die Feldliste wird `… \`disabled\`, \`active\` (in Kraft), \`tone\` (\`danger\` für eine destruktive Aktion; fehlt er, ist der Eintrag gewöhnlich).`
  - Tabelle **Tokens**, nach der Zeile „gedrückt“ drei Zeilen:

```markdown
| Eintrag destruktiv, Text | `--tl-status-error-text` |
| destruktiv, Zeiger darüber | `--tl-status-error-surface` mit `--tl-text-on-status-error` |
| destruktiv, gedrückt | `--tl-status-error-surface-active` mit `--tl-text-on-status-error-active` |
```

  - Tabelle **Attribute**, nach der Zeile `aria-current="true"`:

```markdown
| `tl-menu__item--danger` | am Eintrag einer destruktiven Aktion; folgt dem Ton des Kommandos (`tone`), nie vom Autor gesetzt. Deaktiviert gewinnt `--tl-text-disabled`; ein Eintrag kann in Kraft und destruktiv zugleich sein |
```

  - **Konformität**, im Satz nach „… `aria-current="true"` und `tl-type-body-strong` trägt,“ einfügen: „ein destruktiver Eintrag (`tone` ist `danger`) `tl-menu__item--danger` trägt,“.

- [ ] **Step 5: Specimen** — in `src/components/menu/menu.spec.html` im `<template id="rows">` nach dem Eintrag „Drucken mit einem sehr langen Namen …“ einfügen:

```html
          <hr class="tl-divider">
          <button type="button" class="tl-menu__item tl-menu__item--danger tl-type-body" role="menuitem" tabindex="-1"><i class="tl-menu__icon tl-icon-sm bi bi-trash" aria-hidden="true"></i><span class="tl-menu__label">Löschen</span></button>
          <button type="button" class="tl-menu__item tl-menu__item--danger tl-type-body" role="menuitem" tabindex="-1" disabled><i class="tl-menu__icon tl-icon-sm bi bi-trash" aria-hidden="true"></i><span class="tl-menu__label">Löschen (deaktiviert)</span></button>
```

- [ ] **Step 6: Erzeugen und Gates** — `node tools/generate.mjs && node --test && node tools/lint-css.mjs` → 268 Tests grün, „Klassen-Gate grün“. (`tl-menu__item--danger` ist ein Element-Modifier; `lint-css.mjs` prüft nur Block-Modifier gegen `MODIFIERS` und `danger` steht nicht in `ELEMENT_STATE_MODIFIER` — keine Lint-Änderung nötig.) Sichtprobe: `node tools/serve.mjs`, `http://localhost:8137/src/components/menu/menu.spec.html`, hell und dunkel: Löschen rot, beim Zeigen rot gefüllt, deaktiviert grau.

- [ ] **Step 7: Commit Projekt-Repo**

```bash
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem
git add design-system/src/components/menu design-system/dist design-system/test/popover.test.mjs
git commit -m "Ticket #29617: Ton folgt der Aktion -- tl-menu__item--danger (drei Paare von ghost danger, deaktiviert gewinnt), Vertrag, Specimen, Gate

Co-Authored-By: <Modell> <noreply@anthropic.com>"
```

- [ ] **Step 8: Engine-Branch und Paket publizieren**

```bash
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem/_Working-Tree/tl8-wt-29584
git fetch
git checkout -b CWS/CWS_29617_design_system_ton origin/CWS/CWS_29617_design_system_welle_3a
git log --oneline -1    # a998872f72 oder ein neuerer Commit von Bernhard
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem/design-system && node tools/publish-to-worktree.mjs
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem/_Working-Tree/tl8-wt-29584
git status --short      # erwartet: nur tl-design-system/components.css
git add com.top_logic.layout.react/src/main/webapp/style/tl-design-system
git commit -m "Ticket #29617: Design System tone -- package republished (tl-menu__item--danger)

Co-Authored-By: <Modell> <noreply@anthropic.com>"
```

---

### Task 2: Ton am React-Kommando — `CommandModel`, Knopf, Formular, Verwerfen

**Files:**
- Modify: `R/control/button/CommandModel.java:204-215` (JavaDoc `getCssClasses`), neue Methode nach `getKeyGesture` (:226-228); `R/control/button/ReactButtonControl.java:19-32` (Klassen-JavaDoc), `:93`; `R/control/button/MessageButtons.java:157-171`; `V/element/FormElement.java:623-626` (danach)
- Test: `RT/control/button/TestReactButtonState.java` (ändern), `RT/control/overlay/TestDialogButtonTone.java` (neu), `VT/element/TestFormScopedCommands.java` (vorhanden, unverändert)

**Interfaces:**
- Consumes: `ButtonTone` (`DEFAULT`, `DANGER`, `getExternalName()`), `ReactButtonControl.setTone(ButtonTone)` (vorhanden, :254).
- Produces: `default ButtonTone CommandModel.getTone()` → `DEFAULT`. Jeder `ReactButtonControl(ReactContext, CommandModel[, String])` trägt ab Konstruktion `tone` des Modells. `FormScopedCommandModel.getTone()` delegiert. `MessageButtons.discard(ReactContext, ButtonAction)` trägt `tone = "danger"`. Test-Fixture `TestDialogButtonTone` (Task 5 erweitert sie).

- [ ] **Step 1: Test Knopf** — in `RT/control/button/TestReactButtonState.java`:
  - Importe ergänzen: `com.top_logic.layout.basic.ThemeImage`, `com.top_logic.layout.react.control.button.CommandModel`, `com.top_logic.layout.react.control.button.CommandPlacement`.
  - In der inneren Klasse `Button` einen zweiten Konstruktor:

```java
		Button(ReactContext context, CommandModel model) {
			super(context, model);
		}
```

  - Test und Modell anhängen (vor `suite()`):

```java
	/**
	 * A button built from a command takes the command's tone, so that a destructive command is
	 * drawn as such wherever it is offered; an ordinary command sends no tone.
	 */
	public void testToneFollowsTheModel() {
		ReactContext context = new DefaultReactContext("", "test", new SSEUpdateQueue(), new ReactWindowRegistry("test"));
		assertEquals("danger", new Button(context, new TonedModel(ButtonTone.DANGER)).tone());
		assertNull(new Button(context, new TonedModel(ButtonTone.DEFAULT)).tone());
	}

	/**
	 * A command of the given tone, offered and executable.
	 */
	private static final class TonedModel implements CommandModel {

		private final ButtonTone _tone;

		TonedModel(ButtonTone tone) {
			_tone = tone;
		}

		@Override
		public ButtonTone getTone() {
			return _tone;
		}

		@Override
		public String getName() {
			return "toned";
		}

		@Override
		public String getLabel() {
			return "Toned";
		}

		@Override
		public ThemeImage getImage() {
			return null;
		}

		@Override
		public boolean isExecutable() {
			return true;
		}

		@Override
		public boolean isVisible() {
			return true;
		}

		@Override
		public HandlerResult perform(ReactContext context) {
			return HandlerResult.DEFAULT_RESULT;
		}

		@Override
		public CommandPlacement getPlacement() {
			return CommandPlacement.NONE;
		}

		@Override
		public void addStateChangeListener(Runnable listener) {
			// The tone never changes.
		}

		@Override
		public void removeStateChangeListener(Runnable listener) {
			// The tone never changes.
		}
	}
```

- [ ] **Step 2: Test Verwerfen** — `RT/control/overlay/TestDialogButtonTone.java` neu:

```java
/*
 * SPDX-FileCopyrightText: 2026 (c) Business Operation Systems GmbH <info@top-logic.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-BOS-TopLogic-1.0
 */
package test.com.top_logic.layout.react.control.overlay;

import java.util.Map;

import junit.framework.Test;
import junit.framework.TestCase;

import test.com.top_logic.basic.ModuleTestSetup;
import test.com.top_logic.basic.module.ServiceTestSetup;

import com.top_logic.basic.json.JSON;
import com.top_logic.basic.reflect.TypeIndex;
import com.top_logic.basic.thread.ThreadContextManager;
import com.top_logic.basic.util.ResourcesModule;
import com.top_logic.gui.ThemeFactory;
import com.top_logic.layout.react.DefaultReactContext;
import com.top_logic.layout.react.ReactContext;
import com.top_logic.layout.react.control.ReactControl;
import com.top_logic.layout.react.control.button.ButtonTone;
import com.top_logic.layout.react.control.button.MessageButtons;
import com.top_logic.layout.react.control.button.ReactButtonControl;
import com.top_logic.layout.react.servlet.SSEUpdateQueue;
import com.top_logic.layout.react.state.ButtonState;
import com.top_logic.layout.react.window.ReactWindowRegistry;
import com.top_logic.tool.boundsec.HandlerResult;

/**
 * Tests the tone of the buttons a dialog offers: an answer that destroys or discards what the user
 * has is drawn as destructive, every other answer is not.
 */
public class TestDialogButtonTone extends TestCase {

	/** Discarding unsaved changes is destructive, without a command chain telling so. */
	public void testDiscardIsDestructive() {
		ReactButtonControl discard = MessageButtons.discard(createContext(), ctx -> HandlerResult.DEFAULT_RESULT);

		assertEquals(ButtonTone.DANGER.getExternalName(), state(discard).get(ButtonState.TONE__PROP));
	}

	private static ReactContext createContext() {
		return new DefaultReactContext("", "test", new SSEUpdateQueue(), new ReactWindowRegistry("test"));
	}

	/** The state the control sends to the client. */
	static Map<?, ?> state(ReactControl control) {
		try {
			return (Map<?, ?>) JSON.fromString(control.stateAsJSON());
		} catch (JSON.ParseException ex) {
			throw new AssertionError("The state sent to the client is not JSON.", ex);
		}
	}

	/**
	 * Test suite requiring the {@link TypeIndex} module, the resources the standard labels are
	 * resolved from, and the {@link ThemeFactory} the buttons take their icons from.
	 */
	public static Test suite() {
		return ModuleTestSetup.setupModule(
			ServiceTestSetup.createSetup(TestDialogButtonTone.class, TypeIndex.Module.INSTANCE,
				ThreadContextManager.Module.INSTANCE, ResourcesModule.Module.INSTANCE,
				ThemeFactory.Module.INSTANCE));
	}
}
```

- [ ] **Step 3: Rot sehen**

```bash
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem/_Working-Tree/tl8-wt-29584/com.top_logic.layout.react && \
JAVA_HOME=/opt/homebrew/Cellar/openjdk@21/21.0.10/libexec/openjdk.jdk/Contents/Home \
mvn -o -B -Dmaven.repo.local=/Users/hendrik/Claude/TopLogic-v8-DesignSystem/_Working-Tree/tl8-wt-29584/.m2/repository \
  -Dskip.npm -Dskip.installnodenpm -DskipTests=false test "-Dtest=TestReactButtonState,TestDialogButtonTone"
```

Expected: Compilation failure in `TestReactButtonState.java` — „Methode überschreibt oder implementiert keine Methode aus einem Supertyp“ an `getTone()`.

- [ ] **Step 4: `CommandModel`** — in `R/control/button/CommandModel.java`:
  - Import ist nicht nötig (`ButtonTone` liegt im selben Paket).
  - JavaDoc von `getCssClasses()` (:204-212) ersetzen durch:

```java
	/**
	 * Additional CSS classes for the UI element rendering this command, separated by spaces.
	 *
	 * <p>
	 * Appended to the class list of the command's button, and of a menu entry rendering the
	 * command. Returns {@code null} by default (no additional classes). Whether the command is
	 * destructive is not a class but its {@link #getTone() tone}.
	 * </p>
	 */
```

  - nach `getKeyGesture()` einfügen:

```java
	/**
	 * The kind of action this command stands for.
	 *
	 * <p>
	 * {@link ButtonTone#DANGER} for a command that destroys or discards what the user has: every UI
	 * element offering it - its button, a menu entry, the confirmation asking for it - shows it as
	 * destructive. The tone follows from what the command does, not from a presentation option, and
	 * does not change while the model lives. Returns {@link ButtonTone#DEFAULT} by default.
	 * </p>
	 */
	default ButtonTone getTone() {
		return ButtonTone.DEFAULT;
	}
```

- [ ] **Step 5: `ReactButtonControl`** — im Konstruktor `ReactButtonControl(ReactContext, CommandModel, String)` nach `setCssClasses(model.getCssClasses());` (:93):

```java
		// Fixed per command: handleModelChange() does not pull it again.
		setTone(model.getTone());
```

  und im Klassen-JavaDoc (:27-31) den Absatz ersetzen durch:

```java
 * <p>
 * When constructed with a {@link CommandModel}, the button automatically reads the label, the
 * disabled state, and the {@link CommandModel#isActive() active} state from the model, listens for
 * state changes, and removes its listener during cleanup. The {@link CommandModel#getTone() tone}
 * is taken once, at construction: it is what the command does and does not change.
 * </p>
```

- [ ] **Step 6: `MessageButtons.discard`** — `R/control/button/MessageButtons.java:157-171`:

```java
	/**
	 * Creates a Discard button (trash icon), drawn in the {@link ButtonTone#DANGER destructive}
	 * tone: discarding throws away what the user entered.
	 *
	 * @param context
	 *        The React context.
	 * @param action
	 *        The discard action.
	 * @return A new discard button with standard label and icon.
	 */
	public static ReactButtonControl discard(ReactContext context, ButtonAction action) {
		String label = Resources.getInstance().getString(I18NConstants.BUTTON_DISCARD);
		ReactButtonControl button = new ReactButtonControl(context, label, action);
		button.setImage(Icons.BUTTON_DISCARD);
		button.setTone(ButtonTone.DANGER);
		return button;
	}
```

- [ ] **Step 7: Grün sehen** — Befehl aus Step 3 → `Tests run: 4, Failures: 0, Errors: 0` für `TestReactButtonState`, `Tests run: 1 …` für `TestDialogButtonTone`, BUILD SUCCESS. Danach ganzes Modul: derselbe Befehl mit `"-Dtest=test.com.top_logic.layout.react.**.Test*"` → 0 Failures, 0 Errors.

- [ ] **Step 8: Installieren und den Delegations-Test rot sehen** — layout.view sieht die neue Methode erst nach dem Install:

```bash
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem/_Working-Tree/tl8-wt-29584/com.top_logic.layout.react && \
JAVA_HOME=/opt/homebrew/Cellar/openjdk@21/21.0.10/libexec/openjdk.jdk/Contents/Home \
mvn -o -B -q -Dmaven.repo.local=/Users/hendrik/Claude/TopLogic-v8-DesignSystem/_Working-Tree/tl8-wt-29584/.m2/repository \
  -Dskip.npm -Dskip.installnodenpm install
cd ../com.top_logic.layout.view && \
JAVA_HOME=/opt/homebrew/Cellar/openjdk@21/21.0.10/libexec/openjdk.jdk/Contents/Home \
mvn -o -B -Dmaven.repo.local=/Users/hendrik/Claude/TopLogic-v8-DesignSystem/_Working-Tree/tl8-wt-29584/.m2/repository \
  -Dskip.npm -Dskip.installnodenpm -DskipTests=false test -Dtest=TestFormScopedCommands
```

Expected: FAIL — „A command offered through a form loses what it states through 'getTone': FormScopedCommandModel does not delegate it.“ Das ist der Beweis, dass der vorhandene Test die Lücke fängt.

- [ ] **Step 9: `FormScopedCommandModel` delegiert** — `V/element/FormElement.java`: Import `com.top_logic.layout.react.control.button.ButtonTone` oben in der Datei; in `FormScopedCommandModel` nach `getKeyGesture()` (:623-626):

```java
		@Override
		public ButtonTone getTone() {
			return _inner.getTone();
		}
```

Befehl aus Step 8 (nur der layout.view-Teil) → `TestFormScopedCommands` 1/1 grün. Damit trägt kein Commit dieses Tasks einen roten Test.

- [ ] **Step 10: Commit Engine**

```bash
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem/_Working-Tree/tl8-wt-29584
git add com.top_logic.layout.react/src/main/java/com/top_logic/layout/react/control/button \
  com.top_logic.layout.react/src/test/java/test/com/top_logic/layout/react/control/button/TestReactButtonState.java \
  com.top_logic.layout.react/src/test/java/test/com/top_logic/layout/react/control/overlay/TestDialogButtonTone.java \
  com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/element/FormElement.java
git commit -m "Ticket #29617: Design System tone -- CommandModel states its tone, the button takes it, a form delegates it, discard is destructive

Co-Authored-By: <Modell> <noreply@anthropic.com>"
```

- [ ] **Step 11: messages_en** — aus `/Users/hendrik/Claude/TopLogic-v8-DesignSystem`: `MAVEN_ARGS="-Dmaven.repo.local=/Users/hendrik/Claude/TopLogic-v8-DesignSystem/_Working-Tree/tl8-wt-29584/.m2/repository -Dskip.npm -Dskip.installnodenpm" JAVA_HOME=/opt/homebrew/Cellar/openjdk@21/21.0.10/libexec/openjdk.jdk/Contents/Home design-system/tools/check-messages-en.sh` → „messages_en.properties stimmt mit dem JavaDoc ueberein.“; bei Diff: erzeugte Datei committen (`Ticket #29617: Design System tone -- generated messages_en`), Deutsch in `messages_de.properties` desselben Moduls nachziehen, mitcommitten.

---

### Task 3: Ton aus der Aktionskette — `ViewAction`, Kommando, Modell, Formular

**Files:**
- Modify: `V/command/ViewAction.java:102-105` (danach), `V/command/ViewActions.java` (nach `appliesFormState`), `V/command/DeleteObjectAction.java:79-85` (danach), `V/command/WithTransactionAction.java:86-93` (danach), `V/command/IfAction.java:148-151` (danach), `V/command/SwitchAction.java:278-282` (danach), `V/command/ViewCommand.java:213-215` (danach), `V/command/GenericViewCommand.java:93-96` (danach), `V/command/ViewCommandModel.java:246-252` (danach)
- Test: `VT/command/TestActionTone.java` (neu); `VT/element/TestFormScopedCommands.java` (vorhanden, unverändert, läuft mit)

**Interfaces:**
- Consumes: `CommandModel.getTone()` (Task 2), `CommandCliques.DELETE`.
- Produces:
  - `default ButtonTone ViewAction.getTone()` → `DEFAULT`; `DeleteObjectAction.getTone()` → `DANGER`.
  - `public static ButtonTone ViewActions.tone(List<ViewAction> actions)` — `DANGER`, sobald eine Aktion `DANGER` sagt.
  - `WithTransactionAction.getTone()`, `IfAction.getTone()`, `SwitchAction.getTone()` — Ton ihrer inneren Aktionen (jeder Zweig zählt).
  - `default ButtonTone ViewCommand.getTone()` → `DEFAULT`; `GenericViewCommand.getTone()` → `ViewActions.tone(_actions)`.
  - `ViewCommandModel.getTone()` — Ton des Kommandos; `DEFAULT` mit Clique `delete` → `DANGER`. Ein Formular reicht ihn über `FormScopedCommandModel.getTone()` (Task 2) weiter.
  - Test-Fixture `TestActionTone` mit `parseCommand(String)`, `instantiate(GenericViewCommand.Config)`, `ORDINARY`, `Destroying`, `TRUE` (Task 5 erweitert sie).

- [ ] **Step 1: Test schreiben** — `VT/command/TestActionTone.java` neu:

```java
/*
 * SPDX-FileCopyrightText: 2026 (c) Business Operation Systems GmbH <info@top-logic.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-BOS-TopLogic-1.0
 */
package test.com.top_logic.layout.view.command;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import junit.framework.Test;
import junit.framework.TestCase;

import test.com.top_logic.basic.ModuleTestSetup;
import test.com.top_logic.basic.module.ServiceTestSetup;

import com.top_logic.basic.config.ConfigurationDescriptor;
import com.top_logic.basic.config.ConfigurationReader;
import com.top_logic.basic.config.DefaultInstantiationContext;
import com.top_logic.basic.config.TypedConfiguration;
import com.top_logic.basic.io.character.CharacterContents;
import com.top_logic.basic.reflect.TypeIndex;
import com.top_logic.basic.thread.ThreadContextManager;
import com.top_logic.basic.util.ResourcesModule;
import com.top_logic.gui.ThemeFactory;
import com.top_logic.layout.react.ReactContext;
import com.top_logic.layout.react.control.button.ButtonTone;
import com.top_logic.layout.view.ViewElement;
import com.top_logic.layout.view.command.ActionScript;
import com.top_logic.layout.view.command.CommandCliques;
import com.top_logic.layout.view.command.DeleteObjectAction;
import com.top_logic.layout.view.command.GenericViewCommand;
import com.top_logic.layout.view.command.IfAction;
import com.top_logic.layout.view.command.SwitchAction;
import com.top_logic.layout.view.command.SwitchAction.SwitchCase;
import com.top_logic.layout.view.command.ViewAction;
import com.top_logic.layout.view.command.ViewActions;
import com.top_logic.layout.view.command.ViewCommand;
import com.top_logic.layout.view.command.ViewCommandModel;
import com.top_logic.layout.view.command.ViewExecutabilityRule;
import com.top_logic.layout.view.element.PanelElement;
import com.top_logic.tool.boundsec.HandlerResult;

/**
 * Tests that the tone of a command follows what the command does: an author says what a command
 * is - it deletes, it sits in the clique of deleting commands - and never which color it has.
 */
public class TestActionTone extends TestCase {

	/** An ordinary action, standing in for writing a channel or running a script. */
	static final ViewAction ORDINARY = (context, input) -> input;

	/** A condition that always holds. */
	static final ActionScript TRUE = (context, input) -> Boolean.TRUE;

	/** Deleting is destructive; an action saying nothing is ordinary. */
	public void testDeletingIsDestructive() throws Exception {
		assertEquals(ButtonTone.DANGER, instantiate(parseCommand("<delete-object/>")).getTone());
		assertEquals(ButtonTone.DEFAULT, ORDINARY.getTone());
	}

	/** A chain is destructive as soon as one of its actions is, wherever it stands in the chain. */
	public void testAChainIsDestructiveAsSoonAsOneOfItsActionsIs() {
		assertEquals(ButtonTone.DANGER, ViewActions.tone(List.of(ORDINARY, new Destroying(), ORDINARY)));
		assertEquals(ButtonTone.DEFAULT, ViewActions.tone(List.of(ORDINARY, ORDINARY)));
		assertEquals(ButtonTone.DEFAULT, ViewActions.tone(List.of()));
	}

	/**
	 * An action made of actions carries their tone: a deletion wrapped in a transaction, or placed
	 * in any branch of a condition - the branch not taken decides the button as well, as it decides
	 * whether the command applies the form.
	 */
	public void testCompositesCarryTheToneOfTheActionsTheyRun() throws Exception {
		assertEquals(ButtonTone.DANGER,
			instantiate(parseCommand("<with-transaction><delete-object/></with-transaction>")).getTone());
		assertEquals(ButtonTone.DEFAULT, instantiate(parseCommand("<with-transaction/>")).getTone());

		assertEquals(ButtonTone.DANGER, new IfAction(TRUE, List.of(ORDINARY), List.of(new Destroying())).getTone());
		assertEquals(ButtonTone.DANGER, new IfAction(TRUE, List.of(new Destroying()), List.of()).getTone());
		assertEquals(ButtonTone.DEFAULT, new IfAction(TRUE, List.of(ORDINARY), List.of(ORDINARY)).getTone());

		assertEquals(ButtonTone.DANGER, new SwitchAction(TRUE,
			List.of(new SwitchCase(value -> true, List.of(new Destroying()))), List.of()).getTone());
		assertEquals(ButtonTone.DANGER, new SwitchAction(TRUE, List.of(), List.of(new Destroying())).getTone());
		assertEquals(ButtonTone.DEFAULT, new SwitchAction(TRUE,
			List.of(new SwitchCase(value -> true, List.of(ORDINARY))), List.of(ORDINARY)).getTone());
	}

	/** The model of a command offers the command's tone to every UI element showing it. */
	public void testTheModelTakesTheToneOfTheChain() throws Exception {
		ViewCommand delete = instantiate(parseCommand("<delete-object/>"));

		assertEquals(ButtonTone.DANGER, model(delete, null).getTone());
	}

	/**
	 * A command stating its meaning only by its clique - a chain without a destructive action of
	 * its own, placed among the deleting commands - is destructive as well; any other clique is not.
	 */
	public void testTheDeleteCliqueIsTheSecondSource() {
		ViewCommand ordinary = (context, input) -> HandlerResult.DEFAULT_RESULT;

		assertEquals(ButtonTone.DANGER, model(ordinary, CommandCliques.DELETE).getTone());
		assertEquals(ButtonTone.DEFAULT, model(ordinary, CommandCliques.EDIT).getTone());
		assertEquals(ButtonTone.DEFAULT, model(ordinary, null).getTone());
	}

	private static ViewCommandModel model(ViewCommand command, String clique) {
		ViewCommand.Config config = TypedConfiguration.newConfigItem(ViewCommand.Config.class);
		if (clique != null) {
			config.update(config.descriptor().getProperty(ViewCommand.Config.CLIQUE), clique);
		}
		return new ViewCommandModel(command, config, null, ViewExecutabilityRule.ALWAYS_EXECUTABLE);
	}

	/** The command a view declares with the given actions, as an author writes it. */
	static GenericViewCommand.Config parseCommand(String actionsXml) throws Exception {
		String view = """
				<view>
					<panel>
						<commands>
							<generic-command name="tested">
								%s
							</generic-command>
						</commands>
					</panel>
				</view>
				""".formatted(actionsXml);

		DefaultInstantiationContext context = new DefaultInstantiationContext(TestActionTone.class);
		Map<String, ConfigurationDescriptor> descriptors = Collections.singletonMap(
			"view", TypedConfiguration.getConfigurationDescriptor(ViewElement.Config.class));
		ConfigurationReader reader = new ConfigurationReader(context, descriptors);
		reader.setSource(CharacterContents.newContent(view, "test-tone.view.xml"));
		ViewElement.Config config = (ViewElement.Config) reader.read();
		context.checkErrors();

		PanelElement.Config panel = (PanelElement.Config) config.getContent();
		return (GenericViewCommand.Config) panel.getCommands().get(0);
	}

	/** The command built from the given configuration; nothing of it is executed. */
	static ViewCommand instantiate(GenericViewCommand.Config config) throws Exception {
		DefaultInstantiationContext context = new DefaultInstantiationContext(TestActionTone.class);
		ViewCommand command = context.getInstance(config);
		context.checkErrors();
		return command;
	}

	/** Destructive without touching any storage: stands in for deleting in a chain that runs. */
	static final class Destroying implements ViewAction {

		@Override
		public Object execute(ReactContext context, Object input) {
			return input;
		}

		@Override
		public ButtonTone getTone() {
			return ButtonTone.DANGER;
		}
	}

	/**
	 * Test suite requiring the {@link TypeIndex} module, the resources labels are resolved from,
	 * and the {@link ThemeFactory} a parsed view resolves its images with.
	 */
	public static Test suite() {
		return ModuleTestSetup.setupModule(
			ServiceTestSetup.createSetup(TestActionTone.class, TypeIndex.Module.INSTANCE,
				ThreadContextManager.Module.INSTANCE, ResourcesModule.Module.INSTANCE,
				ThemeFactory.Module.INSTANCE));
	}
}
```

- [ ] **Step 2: Rot sehen**

```bash
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem/_Working-Tree/tl8-wt-29584/com.top_logic.layout.view && \
JAVA_HOME=/opt/homebrew/Cellar/openjdk@21/21.0.10/libexec/openjdk.jdk/Contents/Home \
mvn -o -B -Dmaven.repo.local=/Users/hendrik/Claude/TopLogic-v8-DesignSystem/_Working-Tree/tl8-wt-29584/.m2/repository \
  -Dskip.npm -Dskip.installnodenpm -DskipTests=false test "-Dtest=TestActionTone,TestFormScopedCommands"
```

Expected: Compilation failure — `getTone()` in `Destroying` überschreibt nichts; `ViewActions.tone` und `ViewCommand.getTone` unbekannt.

- [ ] **Step 3: Der Fakt und seine Aggregation**
  - `V/command/ViewAction.java`: Import `com.top_logic.layout.react.control.button.ButtonTone`; nach `getIntrinsicRule()`:

```java
	/**
	 * The kind of action this is.
	 *
	 * <p>
	 * {@link ButtonTone#DANGER} for an action that destroys or discards what the user has - deleting
	 * its input, say. A command running the action takes this tone (see
	 * {@link ViewActions#tone(java.util.List)}), so that every surface offering the command - its
	 * button, a menu entry, the confirmation asking for it - shows it as destructive, without the
	 * author choosing a color.
	 * </p>
	 *
	 * @return {@link ButtonTone#DEFAULT} for an ordinary action.
	 */
	default ButtonTone getTone() {
		return ButtonTone.DEFAULT;
	}
```

  - `V/command/ViewActions.java`: Import `com.top_logic.layout.react.control.button.ButtonTone`; nach `appliesFormState(List)`:

```java
	/**
	 * The tone of a chain made of the given actions: {@link ButtonTone#DANGER} as soon as one of
	 * them {@link ViewAction#getTone() is destructive}, {@link ButtonTone#DEFAULT} otherwise.
	 */
	public static ButtonTone tone(List<ViewAction> actions) {
		return actions.stream().anyMatch(action -> action.getTone() == ButtonTone.DANGER)
			? ButtonTone.DANGER
			: ButtonTone.DEFAULT;
	}
```

  - `V/command/DeleteObjectAction.java`: Import `ButtonTone`; nach `getIntrinsicRule()`:

```java
	/**
	 * Deleting is destructive.
	 */
	@Override
	public ButtonTone getTone() {
		return ButtonTone.DANGER;
	}
```

- [ ] **Step 4: Zusammengesetzte Aktionen** (Lücke 1)
  - `V/command/WithTransactionAction.java`: Import `ButtonTone`; nach `getIntrinsicRule()`:

```java
	/**
	 * Destructive as soon as one of the actions run in the transaction is.
	 */
	@Override
	public ButtonTone getTone() {
		return ViewActions.tone(_actions);
	}
```

  - `V/command/IfAction.java`: Importe `java.util.stream.Stream`, `ButtonTone`; nach `appliesFormState()`:

```java
	/**
	 * Destructive as soon as one of the branches is: the branch that is not taken decides the
	 * command's tone as well, as it decides {@link #appliesFormState()}.
	 */
	@Override
	public ButtonTone getTone() {
		return ViewActions.tone(Stream.concat(_then.stream(), _else.stream()).toList());
	}
```

  - `V/command/SwitchAction.java`: Importe `java.util.stream.Stream`, `ButtonTone`; nach `appliesFormState()`:

```java
	/**
	 * Destructive as soon as one of the cases or the default is, see {@link #appliesFormState()}.
	 */
	@Override
	public ButtonTone getTone() {
		return ViewActions.tone(Stream.concat(_default.stream(),
			_cases.stream().flatMap(candidate -> candidate.actions().stream())).toList());
	}
```

- [ ] **Step 5: Kommando, Modell, Formular**
  - `V/command/ViewCommand.java`: Import `com.top_logic.layout.react.control.button.ButtonTone`; nach `getIntrinsicRule()`:

```java
	/**
	 * The kind of action this command stands for, decided by what the command does.
	 *
	 * <p>
	 * {@link ButtonTone#DANGER} for a command that destroys or discards what the user has. There is
	 * no configuration for it: an author states what a command does, the command's UI shows it.
	 * </p>
	 *
	 * @return {@link ButtonTone#DEFAULT} for an ordinary command.
	 *
	 * @see ViewAction#getTone()
	 */
	default ButtonTone getTone() {
		return ButtonTone.DEFAULT;
	}
```

  - `V/command/GenericViewCommand.java`: Import `ButtonTone`; nach `getIntrinsicRule()`:

```java
	/**
	 * Destructive as soon as one of the actions of the chain is.
	 */
	@Override
	public ButtonTone getTone() {
		return ViewActions.tone(_actions);
	}
```

  - `V/command/ViewCommandModel.java`: Import `com.top_logic.layout.react.control.button.ButtonTone`; nach `getClique()`:

```java
	/**
	 * {@inheritDoc}
	 *
	 * <p>
	 * The tone the command {@link ViewCommand#getTone() takes from what it does}. A command that
	 * states its meaning only by its {@link ViewCommand.Config#getClique() clique} - one without a
	 * destructive action of its own, placed in {@link CommandCliques#DELETE} - is destructive as
	 * well.
	 * </p>
	 */
	@Override
	public ButtonTone getTone() {
		ButtonTone tone = _command.getTone();
		if (tone == ButtonTone.DEFAULT && CommandCliques.DELETE.equals(_config.getClique())) {
			return ButtonTone.DANGER;
		}
		return tone;
	}
```

- [ ] **Step 6: Grün sehen** — Befehl aus Step 2 → `TestActionTone` 5/5, `TestFormScopedCommands` 1/1 (seit Task 2 grün), BUILD SUCCESS. Danach das ganze Modul mit `"-Dtest=test.com.top_logic.layout.view.**.Test*"` → 0 Failures, 0 Errors.

- [ ] **Step 7: Commit Engine**

```bash
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem/_Working-Tree/tl8-wt-29584
git add com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/command \
  com.top_logic.layout.view/src/test/java/test/com/top_logic/layout/view/command/TestActionTone.java
git commit -m "Ticket #29617: Design System tone -- the tone follows the action: delete-object is destructive, chains and composites carry it, the delete clique is the second source

Co-Authored-By: <Modell> <noreply@anthropic.com>"
```

- [ ] **Step 8: messages_en** — wie Task 2 Step 11 (Module layout.react, layout.view).

- [ ] **Step 9: Fertig-Bedingung (Spec §8.2) vormerken** — die Toolbar-Löschen in `attributes.view.xml` (×2), `demo/calendar.view.xml`, `tickets.view.xml`, `demo/tree-demo.view.xml` sind jetzt `ghost` + `danger`; geprüft wird im Docker in Task 6 Step 5. `npm run build` ist hier nicht nötig (kein TSX geändert), `TLButton` liest `state.tone` schon.

---

### Task 4: Menüeintrag — `state.proto`, `MenuEntry`, Kontextmenü, Überlauf

**Files:**
- Modify: `R/state/state.proto` (in `message Entry` nach `string cssClasses;`, ~:858), `R/control/overlay/ReactMenuControl.java:70-97`, `:154-233`, `R/control/overlay/ContextMenuOpener.java:279-286`, `RS/controls/menu/Menu.tsx:85-109`, `RS/controls/TLMenu.tsx:21-22`, `RS/controls/button/ButtonDefaults.tsx:32-43`, `RS/controls/TLButton.tsx:86-88` (Kommentar)
- Erzeugt (committet): `R/state/MenuState.java`, `R/state/impl/MenuState_Impl.java`, `RS/state/control-state.ts`
- Test: `RT/state/TestControlStateSchema.java` (ändern), `VT/command/FakeCommandModels.java`, `VT/command/TestContextMenuOpener.java` (ändern)

**Interfaces:**
- Consumes: `CommandModel.getTone()` (Task 2), Klasse `tl-menu__item--danger` (Task 1, publiziert).
- Produces:
  - Proto `MenuState.Entry.tone : ButtonState.Tone` → Java `MenuState.Entry.TONE__PROP = "tone"`, TS `MenuStateJson.Entry.tone: ButtonStateJson.Tone`.
  - `record MenuEntry(EntryType type, String id, String label, String icon, ExecutableState state, String cssClasses, boolean active, ButtonTone tone)`; `MenuEntry.item(String id, String label, String icon, ExecutableState state, String cssClasses, boolean active, ButtonTone tone)`; die bisherigen Fabriken setzen `ButtonTone.DEFAULT`.
  - TS: `menuItemClassName(current?: boolean, extra?: string, danger?: boolean): string`; `MenuItem`-Prop `danger?: boolean`.

- [ ] **Step 1: Proto und Erzeugung** — in `R/state/state.proto`, `message MenuState` → `message Entry`, nach

```
		/**
		 * Additional CSS classes of the item, separated by spaces.
		 */
		string cssClasses;
```

einfügen:

```

		/**
		 * The kind of action the item stands for. Absent means `default`, an ordinary action;
		 * `danger` marks an item whose command destroys or discards what the user has.
		 */
		ButtonState.Tone tone;
```

(Qualifizierter Verweis auf das Enum einer anderen Nachricht: die msgbuf-1.3.0-Grammatik nimmt `qName()` als Typ; am 02.10. mit dem Generator aus `.m2` gegen eine Kopie geprüft — er erzeugt `com.top_logic.layout.react.state.ButtonState.Tone getTone()`, `TONE__PROP = "tone"`, `Tone.readTone(in)` und in TS `tone: ButtonStateJson.Tone;`, sonst keine Änderung.) Erzeugen:

```bash
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem/_Working-Tree/tl8-wt-29584/com.top_logic.layout.react && \
JAVA_HOME=/opt/homebrew/Cellar/openjdk@21/21.0.10/libexec/openjdk.jdk/Contents/Home \
mvn -o -B -Dmaven.repo.local=/Users/hendrik/Claude/TopLogic-v8-DesignSystem/_Working-Tree/tl8-wt-29584/.m2/repository \
  -Dskip.npm -Dskip.installnodenpm generate-sources
git status --short
```

Expected: genau `state.proto`, `state/MenuState.java`, `state/impl/MenuState_Impl.java`, `react-src/state/control-state.ts` geändert. Fehlt eine der drei erzeugten Dateien (das Plugin hängt nicht an `generate-sources`), direkt erzeugen — `-out .` legt das TypeScript über die Option `TypeScript = "../../../react-src/state/control-state.ts"` relativ zu `src/main/java` ab:

```bash
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem/_Working-Tree/tl8-wt-29584/com.top_logic.layout.react/src/main/java && \
M=/Users/hendrik/Claude/TopLogic-v8-DesignSystem/_Working-Tree/tl8-wt-29584/.m2/repository/de/haumacher/msgbuf && \
/opt/homebrew/Cellar/openjdk@21/21.0.10/libexec/openjdk.jdk/Contents/Home/bin/java \
  -cp $M/msgbuf-generator/1.3.0/msgbuf-generator-1.3.0.jar:$M/msgbuf-api/1.3.0/msgbuf-api-1.3.0.jar \
  de.haumacher.msgbuf.generator.Generator -out . com/top_logic/layout/react/state/state.proto
```

`git diff --stat` danach: nur die vier Dateien.

- [ ] **Step 2: Tests schreiben**
  - `RT/state/TestControlStateSchema.java`: in `testMenuKeys` die Zeile `MenuEntry.item("a", "A", "css:fas fa-home", ExecutableState.NOT_EXEC_DISABLED, "css", true),` ersetzen durch `MenuEntry.item("a", "A", "css:fas fa-home", ExecutableState.NOT_EXEC_DISABLED, "css", true, ButtonTone.DANGER),` (jeder gesendete Schlüssel, `tone` eingeschlossen, ist deklariert); danach anhängen:

```java
	/**
	 * A destructive entry says so; an ordinary one sends no tone, since an absent tone means the
	 * default.
	 */
	public void testMenuEntryTone() {
		ReactMenuControl control = new ReactMenuControl(createContext(), null, List.of(
			MenuEntry.item("a", "Delete", null, ExecutableState.EXECUTABLE, null, false, ButtonTone.DANGER),
			MenuEntry.item("b", "Edit", null, ExecutableState.EXECUTABLE, null, false)),
			id -> HandlerResult.DEFAULT_RESULT, () -> {
				// Never closed.
			});

		List<?> items = (List<?>) state(control).get(MenuState.ITEMS__PROP);
		assertEquals(ButtonTone.DANGER.getExternalName(), ((Map<?, ?>) items.get(0)).get(MenuState.Entry.TONE__PROP));
		assertFalse(((Map<?, ?>) items.get(1)).containsKey(MenuState.Entry.TONE__PROP));
	}
```

  - `VT/command/FakeCommandModels.java`: Import `com.top_logic.layout.react.control.button.ButtonTone`; die Fabrik mit fünf Parametern delegiert, die anonyme Klasse zieht in eine Fabrik mit Ton um. Die beiden Fabriken mit fünf und sechs Parametern ersetzen die bisherige Fünf-Parameter-Fabrik vollständig:

```java
	static CommandModel contextMenu(String name, String label, boolean visible, boolean executable,
			boolean active) {
		return contextMenu(name, label, visible, executable, active, ButtonTone.DEFAULT);
	}

	static CommandModel contextMenu(String name, String label, boolean visible, boolean executable,
			boolean active, ButtonTone tone) {
		return new CommandModel() {
			@Override
			public String getName() {
				return name;
			}

			@Override
			public String getLabel() {
				return label;
			}

			@Override
			public ThemeImage getImage() {
				return null;
			}

			@Override
			public boolean isExecutable() {
				return executable;
			}

			@Override
			public boolean isVisible() {
				return visible;
			}

			@Override
			public boolean isActive() {
				return active;
			}

			@Override
			public ButtonTone getTone() {
				return tone;
			}

			@Override
			public HandlerResult perform(ReactContext context) {
				return HandlerResult.DEFAULT_RESULT;
			}

			@Override
			public CommandPlacement getPlacement() {
				return CommandPlacement.CONTEXT_MENU;
			}

			@Override
			public void addStateChangeListener(Runnable listener) {
				// No-op for fake.
			}

			@Override
			public void removeStateChangeListener(Runnable listener) {
				// No-op for fake.
			}
		};
	}
```

  - `VT/command/TestContextMenuOpener.java`: Import `com.top_logic.layout.react.control.button.ButtonTone`; anhängen:

```java
	/**
	 * The entry of a destructive command is destructive, the entry of an ordinary one is not -
	 * within one group, so that nothing but the tone tells them apart.
	 */
	public void testADestructiveCommandMakesADestructiveEntry() {
		AtomicReference<Object> target = new AtomicReference<>();
		CommandModel edit = FakeCommandModels.contextMenu("edit", "Edit", true, true);
		CommandModel delete = FakeCommandModels.contextMenu("delete", "Delete", true, true, false, ButtonTone.DANGER);
		ContextMenuContribution contribution = new ContextMenuContribution(target::set, List.of(edit, delete));

		RecordingRenderer renderer = new RecordingRenderer();
		new ContextMenuOpener(renderer).open(0, 0, List.of(new Targeted(contribution, "row")));

		List<MenuEntry> items = renderer.lastItems;
		assertEquals(2, items.size());
		assertEquals(ButtonTone.DEFAULT, items.get(0).tone());
		assertEquals(ButtonTone.DANGER, items.get(1).tone());
	}
```

- [ ] **Step 3: Rot sehen** — layout.react:

```bash
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem/_Working-Tree/tl8-wt-29584/com.top_logic.layout.react && \
JAVA_HOME=/opt/homebrew/Cellar/openjdk@21/21.0.10/libexec/openjdk.jdk/Contents/Home \
mvn -o -B -Dmaven.repo.local=/Users/hendrik/Claude/TopLogic-v8-DesignSystem/_Working-Tree/tl8-wt-29584/.m2/repository \
  -Dskip.npm -Dskip.installnodenpm -DskipTests=false test -Dtest=TestControlStateSchema
```

Expected: Compilation failure — `item(String,String,String,ExecutableState,String,boolean,ButtonTone)` nicht gefunden.

- [ ] **Step 4: `MenuEntry` und Serialisierung** — `R/control/overlay/ReactMenuControl.java`, Import `com.top_logic.layout.react.control.button.ButtonTone`:
  - in `updateItems`, im `ITEM`-Zweig nach dem `cssClasses`-Block:

```java
				if (entry.tone() != ButtonTone.DEFAULT) {
					map.put(MenuState.Entry.TONE__PROP, entry.tone().getExternalName());
				}
```

  - JavaDoc des Records um `@param tone` ergänzen (nach `@param active`):

```java
	 * @param tone
	 *        The kind of action the command this entry renders stands for; a
	 *        {@link ButtonTone#DANGER destructive} entry is drawn as such. Never {@code null}.
```

  - Record und Fabriken:

```java
	public record MenuEntry(EntryType type, String id, String label, String icon, ExecutableState state,
			String cssClasses, boolean active, ButtonTone tone) {

		/**
		 * Whether the item is displayed as disabled, see {@link #state()}.
		 */
		public boolean disabled() {
			return !state.isExecutable();
		}

		/**
		 * Creates a simple menu item.
		 */
		public static MenuEntry item(String id, String label) {
			return item(id, label, null);
		}

		/**
		 * Creates a menu item with an icon.
		 */
		public static MenuEntry item(String id, String label, String icon) {
			return item(id, label, icon, false);
		}

		/**
		 * Creates a menu item with an icon and an explicit disabled state.
		 */
		public static MenuEntry item(String id, String label, String icon, boolean disabled) {
			return item(id, label, icon, disabled ? ExecutableState.NOT_EXEC_DISABLED : ExecutableState.EXECUTABLE,
				null, false);
		}

		/**
		 * Creates a menu item for an ordinary command in the given {@link MenuEntry#state() state},
		 * carrying additional CSS classes, marked as {@link MenuEntry#active() active} when its
		 * command is the one in force.
		 */
		public static MenuEntry item(String id, String label, String icon, ExecutableState state,
				String cssClasses, boolean active) {
			return item(id, label, icon, state, cssClasses, active, ButtonTone.DEFAULT);
		}

		/**
		 * Creates a menu item for a command of the given {@link MenuEntry#tone() tone}, see
		 * {@link #item(String, String, String, ExecutableState, String, boolean)}.
		 */
		public static MenuEntry item(String id, String label, String icon, ExecutableState state,
				String cssClasses, boolean active, ButtonTone tone) {
			return new MenuEntry(EntryType.ITEM, id, label, icon, state, cssClasses, active, tone);
		}

		/**
		 * Creates a separator.
		 */
		public static MenuEntry separator() {
			return new MenuEntry(EntryType.SEPARATOR, null, null, null, ExecutableState.EXECUTABLE, null, false,
				ButtonTone.DEFAULT);
		}

		/**
		 * Creates a header: a caption naming the entries that follow it, which cannot be selected
		 * or focused.
		 */
		public static MenuEntry header(String label) {
			return new MenuEntry(EntryType.HEADER, null, label, null, ExecutableState.EXECUTABLE, null, false,
				ButtonTone.DEFAULT);
		}
	}
```

- [ ] **Step 5: `ContextMenuOpener`** — `appendCliqued`, der Aufruf `MenuEntry.item(…)` (:279-286):

```java
			out.add(MenuEntry.item(
				contributionIndex + ":" + j,
				cmd.getLabel(),
				encodeIcon(cmd.getImage()),
				cmd.getExecutableState(),
				cmd.getCssClasses(),
				cmd.isActive(),
				cmd.getTone()));
```

- [ ] **Step 6: Client**
  - `RS/controls/menu/Menu.tsx` (:85-109):

```tsx
/**
 * The class list of a menu entry: block, tone - an entry of a destructive command (`danger`) is
 * tl-menu__item--danger -, typography - an entry in force (`current`, reported as `aria-current`)
 * reads strong -, passed-through classes. Shared by MenuItem and every button that renders as an
 * entry (ButtonDefaults `menu-item`), so the two cannot drift apart.
 */
export function menuItemClassName(current?: boolean, extra?: string, danger?: boolean): string {
  return ['tl-menu__item', danger ? 'tl-menu__item--danger' : '', current ? 'tl-type-body-strong' : 'tl-type-body', extra ?? '']
    .filter(Boolean).join(' ');
}

export const MenuItem: React.FC<{ id?: string; icon?: string; label: string; disabled?: boolean; current?: boolean; danger?: boolean; className?: string; onSelect: () => void }> =
  ({ id, icon, label, disabled, current, danger, className, onSelect }) => (
    <button
      type="button"
      id={id}
      className={menuItemClassName(current, className, danger)}
      role="menuitem"
      aria-current={current ? 'true' : undefined}
      disabled={disabled}
      tabIndex={-1}
      onClick={onSelect}
    >
      {icon && <ThemeIcon encoded={icon} className="tl-menu__icon tl-icon-sm" />}
      <span className="tl-menu__label">{label}</span>
    </button>
  );
```

  - `RS/controls/TLMenu.tsx` (:21-22):

```tsx
        : <MenuItem key={item.id} icon={item.icon} label={item.label} disabled={item.disabled} current={item.active}
            danger={item.tone === 'danger'} className={item.cssClasses} onSelect={() => sendCommand('selectItem', { itemId: item.id })} />)}
```

  - `RS/controls/button/ButtonDefaults.tsx` (:32-43):

```tsx
/**
 * The class list of a button: block, appearance, tone, size, shape, typography, passed-through
 * classes. `icon` is a button showing only an icon: a square of the control height. A `menu-item`
 * is an entry of a menu (tl-menu__item, as MenuItem draws it): it keeps its tone - a destructive
 * entry is tl-menu__item--danger - but has no size or shape of its own; `current` marks the entry
 * in force, which reads strong.
 */
export function buttonClassName(opts: {
  appearance: ButtonAppearance; danger?: boolean; small?: boolean; icon?: boolean; current?: boolean; extra?: string;
}): string {
  if (opts.appearance === 'menu-item') {
    return menuItemClassName(opts.current, opts.extra, opts.danger);
  }
```

(der Rest der Funktion bleibt).
  - `RS/controls/TLButton.tsx` (:86-87): den Kommentar „Additional CSS classes declared on the command this button renders, e.g. to mark a destructive action.“ ersetzen durch „Additional CSS classes declared on the command this button renders. A destructive command is not a class but its tone (`state.tone`).“

- [ ] **Step 7: Grün sehen**
  - layout.react: Befehl aus Step 3 → `TestControlStateSchema` grün; dann ganzes Modul `"-Dtest=test.com.top_logic.layout.react.**.Test*"` → 0 Failures, 0 Errors; dann `… -q install` in `com.top_logic.layout.react` (Befehl wie Task 2 Step 8).
  - layout.view: `… -DskipTests=false test -Dtest=TestContextMenuOpener` in `com.top_logic.layout.view` → alle Fälle grün (bisher 12, jetzt 13).
  - Client: `cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem/_Working-Tree/tl8-wt-29584/com.top_logic.layout.react && npm run build` → grün (enthält `tsc --noEmit -p tsconfig.json`); zusätzlich `npx tsc --noEmit` → keine neue Meldung (bekannt aus Welle 1: zwei `string | undefined` in `TLFormField.tsx` 146/154, Altbestand).

- [ ] **Step 8: Commit Engine**

```bash
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem/_Working-Tree/tl8-wt-29584
git add com.top_logic.layout.react/src/main/java/com/top_logic/layout/react/state \
  com.top_logic.layout.react/react-src/state/control-state.ts \
  com.top_logic.layout.react/src/main/java/com/top_logic/layout/react/control/overlay/ReactMenuControl.java \
  com.top_logic.layout.react/src/main/java/com/top_logic/layout/react/control/overlay/ContextMenuOpener.java \
  com.top_logic.layout.react/react-src/controls \
  com.top_logic.layout.react/src/test/java/test/com/top_logic/layout/react/state/TestControlStateSchema.java \
  com.top_logic.layout.view/src/test/java/test/com/top_logic/layout/view/command/FakeCommandModels.java \
  com.top_logic.layout.view/src/test/java/test/com/top_logic/layout/view/command/TestContextMenuOpener.java
git status --short   # erwartet: leer (die Vite-Bundles unter src/main/webapp/script sind per .gitignore ausgenommen)
git commit -m "Ticket #29617: Design System tone -- a menu entry carries the tone of its command; context menu and toolbar overflow draw tl-menu__item--danger

Co-Authored-By: <Modell> <noreply@anthropic.com>"
```

- [ ] **Step 9: messages_en** — wie Task 2 Step 11.

---

### Task 5: Rückfrage — `Continuation.tone`, Kette, `ConfirmAction`, `ConfirmDialogControl`

**Files:**
- Modify: `V/command/Continuation.java:53` (danach), `V/command/ViewActionChain.java:43-134`, `:160-213`, `V/navigation/ResumeWith.java:49-52` (danach), `V/command/ConfirmAction.java:139-145`, `R/control/overlay/ConfirmDialogControl.java:21-92`
- Test: `VT/command/TestActionTone.java` (erweitern), `RT/control/overlay/TestDialogButtonTone.java` (erweitern)

**Interfaces:**
- Consumes: `ViewActions.tone(List<ViewAction>)`, `TestActionTone.ORDINARY/TRUE/Destroying` (Task 3), `TestDialogButtonTone.state(ReactControl)` (Task 2).
- Produces:
  - `default ButtonTone Continuation.tone()` → `DEFAULT`.
  - `ChainContinuation.tone()` → `DANGER`, wenn `ViewActions.tone(actions.subList(index + 1, size))` `DANGER` ist oder die umschließende Kette nach der verschachtelnden Aktion zerstört; sonst `DEFAULT`.
  - `ConfirmDialogControl.openDialog(ReactContext context, DialogManager dialogManager, String title, String message, String confirmLabel, String cancelLabel, Runnable onConfirm, Runnable onCancel, ButtonTone confirmTone)` — ersetzt die Fassung ohne Ton (einziger Aufrufer: `ConfirmAction`).

- [ ] **Step 1: Test Kette** — in `VT/command/TestActionTone.java` Importe `com.top_logic.layout.view.DefaultViewContext`, `com.top_logic.layout.view.command.Continuation`, `com.top_logic.layout.view.command.InterruptibleViewAction`, `com.top_logic.layout.view.command.ViewActionChain` ergänzen und anhängen (vor `suite()`):

```java
	/**
	 * A step asking the user before the chain goes on sees the tone of what follows it: the answer
	 * that lets a deletion happen is destructive. What ran before, and the step itself, do not count.
	 */
	public void testTheConfirmationTakesTheToneOfWhatFollows() {
		Asking ask = new Asking();
		run(List.of(ask, new Destroying()));
		assertEquals(ButtonTone.DANGER, ask._seen);

		ask = new Asking();
		run(List.of(ask, ORDINARY));
		assertEquals(ButtonTone.DEFAULT, ask._seen);

		ask = new Asking();
		run(List.of(new Destroying(), ask));
		assertEquals("What ran before the question is done already.", ButtonTone.DEFAULT, ask._seen);

		Asking destructiveAsk = new Asking() {
			@Override
			public ButtonTone getTone() {
				return ButtonTone.DANGER;
			}
		};
		run(List.of(destructiveAsk, ORDINARY));
		assertEquals("The tone of the step itself does not count.", ButtonTone.DEFAULT, destructiveAsk._seen);
	}

	/**
	 * A question in a branch sees what follows the branch in the chain it is nested in, as well as
	 * what follows it in the branch.
	 */
	public void testANestedConfirmationSeesTheRestOfTheEnclosingChain() {
		Asking ask = new Asking();
		run(List.of(new IfAction(TRUE, List.of(ask), List.of()), new Destroying()));
		assertEquals(ButtonTone.DANGER, ask._seen);

		ask = new Asking();
		run(List.of(new IfAction(TRUE, List.of(ask, new Destroying()), List.of()), ORDINARY));
		assertEquals(ButtonTone.DANGER, ask._seen);

		ask = new Asking();
		run(List.of(new IfAction(TRUE, List.of(ask), List.of()), ORDINARY));
		assertEquals(ButtonTone.DEFAULT, ask._seen);
	}

	private static void run(List<ViewAction> chain) {
		ViewActionChain.run(new DefaultViewContext(null), chain, "in", null);
	}

	/** A step that records the tone its continuation reports, then declines, as a user may. */
	static class Asking extends InterruptibleViewAction {

		ButtonTone _seen;

		@Override
		public void execute(ReactContext context, Object input, Continuation continuation) {
			_seen = continuation.tone();
			continuation.abort();
		}
	}
```

- [ ] **Step 2: Test Dialog** — in `RT/control/overlay/TestDialogButtonTone.java` Importe `com.top_logic.layout.react.control.button.ButtonAppearance`, `com.top_logic.layout.react.control.button.KeyStroke`, `com.top_logic.layout.react.control.overlay.ConfirmDialogControl`, `com.top_logic.layout.react.control.overlay.DialogHandle`, `com.top_logic.layout.react.control.overlay.DialogManager`, `com.top_logic.layout.react.control.overlay.DialogResult`, `com.top_logic.layout.react.control.overlay.DialogResultHandler` ergänzen und anhängen:

```java
	/**
	 * "Delete it?": the affirmative answer lets the deletion happen and is drawn destructive - and
	 * stays the dialog's default, primary and on Enter. Declining destroys nothing.
	 */
	public void testTheConfirmationOfADestructionIsRedAndStaysOnEnter() {
		Dialogs dialogs = new Dialogs();
		ConfirmDialogControl.openDialog(createContext(), dialogs, "Confirm", "Delete the milestone?",
			"Delete now", "Keep it", () -> {
				// Nothing to do.
			}, null, ButtonTone.DANGER);

		Map<?, ?> confirm = state(button(dialogs.opened(), "Delete now"));
		assertEquals(ButtonTone.DANGER.getExternalName(), confirm.get(ButtonState.TONE__PROP));
		assertEquals(ButtonAppearance.PRIMARY.getExternalName(), confirm.get(ButtonState.APPEARANCE__PROP));
		assertEquals(KeyStroke.ENTER.toString(), confirm.get(ButtonState.KEY_GESTURE__PROP));
		assertNull("Declining destroys nothing.", state(button(dialogs.opened(), "Keep it")).get(ButtonState.TONE__PROP));
	}

	/** An ordinary question keeps its primary answer without a tone. */
	public void testAnOrdinaryConfirmationStaysPrimary() {
		Dialogs dialogs = new Dialogs();
		ConfirmDialogControl.openDialog(createContext(), dialogs, "Confirm", "Replace the file?",
			"Replace", "Keep it", () -> {
				// Nothing to do.
			}, null, ButtonTone.DEFAULT);

		Map<?, ?> confirm = state(button(dialogs.opened(), "Replace"));
		assertNull(confirm.get(ButtonState.TONE__PROP));
		assertEquals(ButtonAppearance.PRIMARY.getExternalName(), confirm.get(ButtonState.APPEARANCE__PROP));
	}

	/** The button of the given label in the displayed tree below the given control. */
	private static ReactButtonControl button(ReactControl control, String label) {
		if (control instanceof ReactButtonControl button && button.scriptingScalarState().containsValue(label)) {
			return button;
		}
		for (ReactControl child : control.displayedChildren()) {
			ReactButtonControl found = button(child, label);
			if (found != null) {
				return found;
			}
		}
		return null;
	}

	/** Stands in for the dialogs of a window: holds the one that was opened. */
	private static class Dialogs implements DialogManager {

		private ReactControl _opened;

		@Override
		public DialogHandle openDialog(boolean closeOnBackdrop, ReactControl child,
				DialogResultHandler<Void> handler) {
			_opened = child;
			return null;
		}

		@Override
		public void closeTopDialog(DialogResult<Void> result) {
			_opened = null;
		}

		@Override
		public void closeDialogsAbove(DialogHandle dialog) {
			throw new UnsupportedOperationException("Nothing is stacked on a confirmation.");
		}

		ReactControl opened() {
			assertNotNull("The user is asked.", _opened);
			return _opened;
		}
	}
```

- [ ] **Step 3: Rot sehen** — layout.react: `… -DskipTests=false test -Dtest=TestDialogButtonTone` in `com.top_logic.layout.react` → Compilation failure, `openDialog` mit neun Argumenten unbekannt. layout.view: `… test -Dtest=TestActionTone` → Compilation failure, `Continuation.tone()` unbekannt.

- [ ] **Step 4: `ConfirmDialogControl`** — `R/control/overlay/ConfirmDialogControl.java`: Import `com.top_logic.layout.react.control.button.ButtonTone`; im Klassen-JavaDoc den Halbsatz „the affirmative button is styled as the dialog's primary action“ ersetzen durch „the affirmative button is the dialog's primary action, drawn in the tone of what it lets happen“; in der Methoden-JavaDoc nach `@param onCancel`:

```java
	 * @param confirmTone
	 *        The tone of the affirmative button: {@link ButtonTone#DANGER} when confirming lets
	 *        something be destroyed, so that the answer reads as destructive. The button stays the
	 *        dialog's default (primary, Enter) either way.
```

Signatur und Rumpf:

```java
	public static void openDialog(ReactContext context, DialogManager dialogManager, String title, String message,
			String confirmLabel, String cancelLabel, Runnable onConfirm, Runnable onCancel, ButtonTone confirmTone) {
```

und nach `confirmButton.markAsDefault();`:

```java
		confirmButton.setTone(confirmTone);
```

- [ ] **Step 5: Grün sehen layout.react und installieren** — `… test -Dtest=TestDialogButtonTone` → 3/3 grün; dann `… -q install` in `com.top_logic.layout.react` (Befehl wie Task 2 Step 8; `ConfirmAction` in layout.view kompiliert bis Step 7 nicht — der Install betrifft nur layout.react).

- [ ] **Step 6: `Continuation`, Kette, `ResumeWith`** (Lücke 2)
  - `V/command/Continuation.java`: Import `com.top_logic.layout.react.control.button.ButtonTone`; nach `onAbort`:

```java
	/**
	 * The tone of what follows the step that is executing now.
	 *
	 * <p>
	 * {@link ButtonTone#DANGER} when an action that runs after this step - in this chain, or after
	 * the action this chain is nested in - {@link ViewAction#getTone() is destructive}. A step that
	 * asks the user before the chain goes on (a {@link ConfirmAction}) draws its affirmative answer
	 * in this tone: that answer lets the destruction happen. The tone of the step itself and of the
	 * steps before it does not count.
	 * </p>
	 *
	 * @return {@link ButtonTone#DEFAULT} unless the continuation knows the rest of its chain.
	 */
	default ButtonTone tone() {
		return ButtonTone.DEFAULT;
	}
```

  - `V/command/ViewActionChain.java`: Import `com.top_logic.layout.react.control.button.ButtonTone`.
    - in `run(…, onSettled)`: `runFrom(context, actions, 0, input, compensations, settlement,` → `runFrom(context, actions, 0, input, ButtonTone.DEFAULT, compensations, settlement,`
    - in `nest`: `runFrom(context, actions, 0, input, compensations, settlementOf(continuation),` → `runFrom(context, actions, 0, input, continuation.tone(), compensations, settlementOf(continuation),` und im JavaDoc von `nest` den Satz anhängen: „A step of the nested chain sees, as {@link Continuation#tone() the tone of what follows it}, what follows it in the nested chain together with what follows the nesting action.“
    - `runFrom`:

```java
	/**
	 * @param after
	 *        The tone of what follows the chain being run: what follows the nesting action in the
	 *        enclosing chain, {@link ButtonTone#DEFAULT} for an outermost chain.
	 */
	private static void runFrom(ReactContext context, List<ViewAction> actions, int index, Object input,
			ButtonTone after, Deque<Runnable> compensations, Settlement settlement, Consumer<Object> onComplete,
			Runnable onAbort) {
		if (index >= actions.size()) {
			onComplete.accept(input);
			return;
		}
		ViewAction action = actions.get(index);
		ButtonTone rest = ViewActions.tone(actions.subList(index + 1, actions.size())) == ButtonTone.DANGER
			? ButtonTone.DANGER
			: after;
		ChainContinuation continuation = new ChainContinuation(settlement, compensations, rest,
			value -> runFrom(context, actions, index + 1, value, after, compensations, settlement, onComplete, onAbort),
			onAbort);
		try {
			action.execute(context, input, continuation);
		} catch (RuntimeException failure) {
			runCompensations(compensations);
			settlement.settle();
			throw failure;
		}
	}
```

    - `ChainContinuation`: Feld `private final ButtonTone _tone;`, Konstruktor `ChainContinuation(Settlement settlement, Deque<Runnable> compensations, ButtonTone tone, Consumer<Object> onResume, Runnable onAbort)` mit `_tone = tone;`, und:

```java
		@Override
		public ButtonTone tone() {
			return _tone;
		}
```

  - `V/navigation/ResumeWith.java`: Import `com.top_logic.layout.react.control.button.ButtonTone`; nach `onAbort`:

```java
	@Override
	public ButtonTone tone() {
		return _chain.tone();
	}
```

- [ ] **Step 7: `ConfirmAction`** — `V/command/ConfirmAction.java:139-145`:

```java
		ConfirmDialogControl.openDialog(context, dialogManager,
			title,
			resources.getString(message),
			confirmLabel,
			cancelLabel,
			() -> continuation.resume(input),
			() -> continuation.abort(),
			continuation.tone());
```

und im Klassen-JavaDoc nach dem Absatz „On confirm the chain resumes …“:

```java
 * <p>
 * The affirmative answer is drawn in the {@link Continuation#tone() tone of what follows}: before a
 * deletion it reads as destructive, and it stays the dialog's default on Enter.
 * </p>
```

- [ ] **Step 8: Grün sehen** — layout.view `… test -Dtest=TestActionTone` → 7/7; ganzes Modul `"-Dtest=test.com.top_logic.layout.view.**.Test*"` → 0 Failures, 0 Errors (die vorhandenen Ketten-Tests `TestBranchActions`, `TestNotifyAction`, `TestShowViewAction`, `TestNavigateActions`, `TestVerifyIdentityAction` halten die geänderte `runFrom`-Signatur). layout.react ganzes Modul noch einmal → grün.

- [ ] **Step 9: Commit Engine**

```bash
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem/_Working-Tree/tl8-wt-29584
git add com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/command/Continuation.java \
  com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/command/ViewActionChain.java \
  com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/command/ConfirmAction.java \
  com.top_logic.layout.view/src/main/java/com/top_logic/layout/view/navigation/ResumeWith.java \
  com.top_logic.layout.view/src/test/java/test/com/top_logic/layout/view/command/TestActionTone.java \
  com.top_logic.layout.react/src/main/java/com/top_logic/layout/react/control/overlay/ConfirmDialogControl.java \
  com.top_logic.layout.react/src/test/java/test/com/top_logic/layout/react/control/overlay/TestDialogButtonTone.java
git commit -m "Ticket #29617: Design System tone -- the confirmation takes the tone of what follows it: confirming a deletion is primary and danger

Co-Authored-By: <Modell> <noreply@anthropic.com>"
```

- [ ] **Step 10: messages_en** — wie Task 2 Step 11.

---

### Task 6: Doku, Gates, Sichtprüfung, PR

**Files:**
- Modify: `docs/migration/altlast.md:418` (Zeile „Gefahrton im Toolbar-Überlauf“), `STATUS.md`; bedingt `docs/skalen.md` (Abschnitt „Ton folgt der Aktion“), `docs/praesentation.md` (Folie 15)

**Interfaces:**
- Consumes: alles aus Task 1–5.
- Produces: grüne Gates in beiden Repos, Sichtprüfungsliste, PR-Text (englisch).

- [ ] **Step 1: `altlast.md`** — die Zeile `| **Gefahrton im Toolbar-Überlauf** | … |` aus „Offen für spätere Wellen und Pakete“ streichen und vor diesem Abschnitt einen neuen einfügen:

```markdown
### Ton folgt der Aktion — gebaut 02.10.

Spec `docs/superpowers/specs/2026-10-02-ton-folgt-der-aktion-design.md`, Branch `CWS/CWS_29617_design_system_ton`.

| Vorher | Jetzt |
|---|---|
| Gefahrton im Toolbar-Überlauf ging verloren (`buttonClassName` verwarf `danger` im `menu-item`-Zweig) | `tl-menu__item--danger`; `menuItemClassName(current, extra, danger)` ist die eine Stelle für Kontextmenü und Überlauf |
| `ReactButtonControl.setTone` ohne Aufrufer; das React-`CommandModel` kannte keinen Ton | `CommandModel.getTone()`; der Knopf übernimmt ihn bei der Konstruktion |
| Löschen sah aus wie Speichern | `DeleteObjectAction` sagt `DANGER`, `ViewActions.tone` aggregiert, Transaktion und Zweige reichen weiter; Clique `delete` ist die zweite Quelle |
| Rückfrage „Wirklich löschen?“ immer nur `primary` | `primary` + `danger`, wenn der Kettenrest zerstört (`Continuation.tone()`, auch aus einem Zweig heraus) |
| Verwerfen im Dirty-Dialog ohne Ton | `MessageButtons.discard` ist `danger` |

Nicht in dieser Welle: Attribut `tone`/`appearance` am Kommando (bewusst nicht), weitere Töne, das Dialog-Gerüst der sechs Zwei-Knopf-Dialoge (Welle 4, Prognose #4). `UploadCommand` reicht keinen Ton weiter (Löschen pro Datei hat keinen Anwendungsfall).
```

- [ ] **Step 2: Lücken festhalten (nur wenn Fable sie im Plan-Review bestätigt hat)** — `docs/skalen.md`, Abschnitt „Ton folgt der Aktion“, Tabelle „Entschieden“ um zwei Zeilen ergänzen:

```markdown
| Zusammengesetzte Aktionen | `with-transaction`, `if`, `switch` tragen den Ton ihrer inneren Aktionen — bei `if`/`switch` zählt jeder Zweig, auch der nicht genommene, wie bei `appliesFormState`. Sonst wäre ein Löschen in einer Transaktion nicht rot. |
| Rückfrage in einem Zweig | Sie sieht den Rest des Zweigs und den Rest der umschließenden Kette: `nest` gibt den Ton der äußeren Fortsetzung mit. |
```

`docs/praesentation.md` Folie 15 prüfen: die Botschaft („Löschen ist rot, überall, ohne Einstellung“) bleibt; nur ergänzen, wenn die Folie Aktionen einzeln aufzählt. `STATUS.md` zieht mit (Step 4).

- [ ] **Step 3: Gates**
  - Paket: `cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem/design-system && node tools/generate.mjs && git diff --exit-code dist && node --test && node tools/lint-css.mjs` → 268 grün, „Klassen-Gate grün“, `ratchet` unverändert (kein Altbestand berührt), `engine-classes` grün.
  - Engine, in dieser Reihenfolge (Befehlsform aus „Global Constraints“): layout.react `"-Dtest=test.com.top_logic.layout.react.**.Test*"` → 0/0, dann `-q install`; layout.view `"-Dtest=test.com.top_logic.layout.view.**.Test*"` → 0/0, dann `-q install`; demo.react `-DskipTests=false test` ohne Filter → 11/0/0; `npm run build` und `npx tsc --noEmit` in `com.top_logic.layout.react`; `check-messages-en.sh` → kein Diff; `git status --short` im Worktree leer.

- [ ] **Step 4: STATUS** — `STATUS.md`, Absatz „02.10., Brainstorming „Ton folgt der Aktion““: „Nächster Schritt“ ersetzen durch den Stand: Plan `docs/superpowers/plans/2026-10-02-ton-folgt-der-aktion.md`, Tasks 1–5 gebaut (Commits nennen), Gates grün, Sichtprüfung offen/erledigt, Push durch Hendrik offen. Die Zeile „Offen für Hendrik … Gefahrton im Toolbar-Überlauf …“ (:156) als erledigt markieren („erledigt mit Ton folgt der Aktion, `tl-menu__item--danger`“). Commit Projekt-Repo:

```bash
cd /Users/hendrik/Claude/TopLogic-v8-DesignSystem
git add docs/migration/altlast.md STATUS.md docs/skalen.md docs/praesentation.md
git commit -m "Ticket #29617: Ton folgt der Aktion -- gebaut: altlast (Gefahrton im Ueberlauf erledigt), STATUS

Co-Authored-By: <Modell> <noreply@anthropic.com>"
```

(`docs/skalen.md`/`docs/praesentation.md` nur, wenn Step 2 sie geändert hat.)

- [ ] **Step 5: Sichtprüfung** (Docker-Instanz des PR unter apps.top-logic.com, Chrome-Erweiterung; hell und dunkel, beide Dichten). Befunde als Fix-Commits:
  - **Toolbar:** Löschen in `attributes.view.xml` (Tabelle oben und verschachtelte Tabelle), `demo/calendar.view.xml`, `tickets.view.xml`, `demo/tree-demo.view.xml` ist `ghost` rot; beim Zeigen rot gefüllt; deaktiviert (keine Auswahl) grau.
  - **Toolbar-Menügruppe und Überlauf:** `switch-demo.view.xml` legt Löschen in die Clique `more` (Menügruppe) — der Eintrag ist rot; Fenster schmal ziehen, bis ein Löschen in den Überlauf fällt — rot.
  - **Kontextmenü:** keine Demo bietet heute ein löschendes Kommando im Kontextmenü (kein `<context-menu>` in `com.top_logic.demo.react`); der Weg `TLMenu` → `MenuItem` → `menuItemClassName` ist durch `TestContextMenuOpener`, `TestControlStateSchema` und `tsc` gedeckt. Optional temporär in einer lokalen Demo prüfen, nicht committen.
  - **Rückfrage:** `projects/milestone-list.view.xml`, `projects/overview.view.xml`, `demo/constraint-test.view.xml` — „Löschen?“ hat einen rot gefüllten Bestätigen-Knopf, Enter bestätigt, Escape bricht ab, Abbrechen ist nicht rot.
  - **Dirty-Dialog:** Formular ändern, wegnavigieren — Verwerfen ist rot (`secondary`-Rand rot im Dialogfuß), Speichern und Abbrechen nicht.

- [ ] **Step 6: Push und PR (Hendrik bzw. Orchestrator nach Hendriks Ja)** — `git fetch`; Push durch Hendrik; PR gegen `CWS/CWS_29617_design_system_welle_3a`, solange !1760 offen ist (danach gegen `master`, vorher `git merge origin/master` mit Gates aus Step 3), Bernhard Reviewer (`add_reviewers bhu`), Trac #29617 CC. Beschreibung englisch, Gliederung:
  1. *Goal* — a destructive action reads as destructive wherever it is offered, without an author choosing a color; the tone follows what the command does.
  2. *The fact* — `ViewAction.getTone()` next to `appliesFormState()`/`getIntrinsicRule()`; `delete-object` is `DANGER`; `ViewActions.tone`; composites; `ViewCommandModel` falls back to the `delete` clique; `CommandModel.getTone()`; the button takes it once; `MessageButtons.discard`.
  3. *Menu entry* — `MenuState.Entry.tone` (`ButtonState.Tone`, absent means default), `tl-menu__item--danger` from the package, one class function for context menu and toolbar overflow.
  4. *Confirmation* — `Continuation.tone()`: the tone of what follows, including the enclosing chain of a branch; confirm stays primary on Enter.
  5. *Not changed* — `ViewCommand.Config` (no `tone` attribute), `ButtonTone`, `ButtonState`, `ToolbarBuilder`, `CliqueRegistry`.
  6. *Tests* — `TestActionTone`, `TestDialogButtonTone`, `TestControlStateSchema.testMenuEntryTone`, `TestContextMenuOpener.testADestructiveCommandMakesADestructiveEntry`, `TestReactButtonState.testToneFollowsTheModel`, `TestFormScopedCommands` (existing, now covers `getTone`).
  7. *Visual check* — die Liste aus Step 5.

  Ende der Beschreibung: `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.

---

## Self-Review

**Spec coverage:** §1 Ziel → Task 2–5; §2 Entscheidungen → Global Constraints, Task 3 (Bedeutung, Clique), Task 5 (Enter auf Löschen, rot); §3 Tabelle → Task 2 (`CommandModel`, `ReactButtonControl`, `MessageButtons`), Task 2 (`FormScopedCommandModel`), Task 3 (`ViewAction`, `DeleteObjectAction`, `ViewActions`, `ViewCommand`, `GenericViewCommand`, `ViewCommandModel`); §4 → Task 4; §5 → Task 5 (`DirtyConfirmDialogControl` über `discard`, Task 2); §6 → Task 1; §7 → Tests in Task 1–5 (der Delegations-Test existiert schon, Task 2), `check-messages-en.sh` je Engine-Task, Engine-Gates Task 6; §8 → Tasks 1–6 in derselben Reihenfolge, Task 2/3 teilen §8.2 nach Modul; §9 → Global Constraints und `altlast.md` „Nicht in dieser Welle“.

**Lücken der Spec, geschlossen:** zusammengesetzte Aktionen (Task 3 Step 4), verschachtelte Rückfrage und `ResumeWith` (Task 5 Step 6); Menü-Tests in `popover.test.mjs` statt eines nicht vorhandenen `menu.test.mjs`; Serialisierung „kein Ton bei DEFAULT“ in `TestControlStateSchema` statt `TestContextMenuOpener` (dort liegt der Schema-Helfer `state(…)`); keine Demo mit löschendem Kontextmenü-Eintrag (Task 6 Step 5).

**Type consistency:** `ButtonTone` aus `com.top_logic.layout.react.control.button` überall; `CommandModel.getTone()`/`ViewCommand.getTone()`/`ViewAction.getTone()`/`Continuation.tone()` (Fortsetzung bewusst ohne `get`, wie `resume`/`abort`); `ViewActions.tone(List<ViewAction>)` in Task 3, 5; `MenuEntry.tone()` und Sieben-Parameter-`item` in Task 4 (Test und `ContextMenuOpener`); `openDialog(…, ButtonTone confirmTone)` als letzter Parameter in Task 5 (Test, `ConfirmDialogControl`, `ConfirmAction`); `menuItemClassName(current, extra, danger)` in `Menu.tsx` und `ButtonDefaults.tsx`; Test-Fixtures `ORDINARY`, `TRUE`, `Destroying`, `Asking` in `TestActionTone`, `state(…)`, `Dialogs` in `TestDialogButtonTone`.

**Review Focus:** fünf Zeilen, jede mit Test im besitzenden Task (Task 3, 5, 1, 2, 5).
