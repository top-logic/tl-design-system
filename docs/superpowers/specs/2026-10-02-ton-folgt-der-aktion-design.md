# Ton folgt der Aktion — Bedeutung, nicht Farbe

Stand 02.10.2026. Nachzug zu Welle 3a (Trac #29617), eigener Branch und eigener PR. Entschieden im
Brainstorming vom 02.10.: Hendrik, Fable. Begründung in `docs/skalen.md` „Ton folgt der Aktion“.

## 1 · Befund und Ziel

Der Knopf kann seit Welle 1 zwei Dinge sagen: eine Erscheinung (`primary`, `secondary`, `ghost`,
`link`) und einen Ton (`danger`). Das Paket zeichnet jede Kombination. Aber nichts verdrahtet den
Ton: `ReactButtonControl.setTone` hat keinen Aufrufer, das React-`CommandModel` kennt keinen Ton,
`ViewCommand.Config` kennt weder Erscheinung noch Ton, und im Überlauf-Menü der Toolbar verwirft
`buttonClassName` einen `danger` ausdrücklich („ein Menüeintrag hat keinen Ton“). Hervorgehoben ist
ein Knopf nur, wenn er auf Enter liegt (`markAsDefault()` → `primary`). Der Bestätigungsdialog macht
seine Bestätigung immer `primary`, auch bei „Wirklich löschen?“. `MessageButtons.discard` (Verwerfen
im Dirty-Dialog) hat keinen Ton.

Sichtbar heißt das: Löschen sieht aus wie Speichern — in der Toolbar, im Kontextmenü, im Dialogfuß
und in der Rückfrage.

**Ziel:** Eine destruktive Aktion ist überall als destruktiv erkennbar, ohne dass ein Autor an einem
Knopf etwas einstellt. Der Ton folgt dem, was das Kommando tut.

## 2 · Drei Entscheidungen

| Frage | Entscheidung | Warum |
|---|---|---|
| Was steuert der Autor? | **Bedeutung, nicht Farbe.** Kein neues Attribut `tone`/`appearance` am Kommando. Der Ton kommt aus der Aktionskette (`<delete-object/>`), ersatzweise aus der Clique `delete`. | Dieselbe Linie wie Pill („Rolle statt Farbe“) und Enter → `primary`: Autoren sagen, *was* ein Kommando ist, das System zeichnet es. Freie Farbwahl je Knopf erzeugt Uneinheitlichkeit und Pflegeaufwand. |
| Welche Bedeutungen bekommen eine Farbe? | **Nur destruktiv → `danger`.** Hervorhebung bleibt wie heute (Enter → `primary`). Keine Tabelle Clique → Erscheinung. | Die meisten Zeilen einer solchen Tabelle hießen „secondary, kein Ton“ — viel Regel für wenig Unterschied. Zwei hervorgehobene Knöpfe nebeneinander (Enter und Speichern) wären eine neue Regel ohne Bedarf. |
| „Wirklich löschen?“ — wo liegt Enter? | **Auf Löschen, nur rot.** `primary` + `danger` = rot gefüllt; Escape bricht ab. | Verhalten wie heute, kein Umlernen; das Paket definiert die Kombination schon. Enter auf Abbrechen zu legen widerspräche „Enter = Hauptaktion“. |

## 3 · Der Fakt und sein Weg (Java)

Ein `ViewAction` liefert heute zwei Fakten an sein Kommando: `appliesFormState()` und
`getIntrinsicRule()`, aggregiert in `ViewActions`. Der Ton ist der dritte und folgt demselben Muster.

| Stelle | Änderung |
|---|---|
| `ViewAction` | `default ButtonTone getTone() { return ButtonTone.DEFAULT; }`. JavaDoc (englisch): the kind of action — `DANGER` for one that destroys or discards what the user has, so every surface offering it shows it as such. |
| `DeleteObjectAction` | `getTone()` → `DANGER`. Die einzige Aktion, die es in dieser Welle sagt. |
| `ViewActions` | `tone(List<ViewAction>)`: `DANGER`, sobald eine Aktion `DANGER` sagt, sonst `DEFAULT` (`anyMatch`, wie `appliesFormState`). |
| `ViewCommand` | `default ButtonTone getTone()` → `DEFAULT`. `GenericViewCommand` überschreibt mit `ViewActions.tone(_actions)`. |
| `ViewCommandModel` | `getTone()`: Ton des Kommandos; ist er `DEFAULT` und `_config.getClique()` ist `CommandCliques.DELETE`, dann `DANGER` — die zweite Quelle für Kommandos, die ihre Bedeutung nur als Clique tragen. |
| `CommandModel` (React) | `default ButtonTone getTone()` → `DEFAULT`. Der JavaDoc-Hinweis an `getCssClasses()`, destruktiv per CSS-Klasse zu markieren, fällt. |
| `FormScopedCommandModel` | delegiert `getTone()` wie jeden anderen Fakt. |
| `ReactButtonControl(ReactContext, CommandModel, String)` | ruft `setTone(model.getTone())` im Konstruktor. Der Ton ist je Kommando fest; `handleModelChange` zieht ihn nicht nach. |
| `MessageButtons.discard(...)` | `setTone(DANGER)` — Verwerfen ist destruktiv, ohne Kette. |

Nicht geändert: `ViewCommand.Config`, `ButtonTone`, `ButtonState` (hat `tone`), `ToolbarBuilder`
(Enter → `primary`; ein Löschen auf Enter wird damit `primary` + `danger`), `CliqueRegistry`.

## 4 · Menüeintrag

Zwei Pipelines enden in einer Funktion; der Ton geht in beide hinein und wird einmal gezeichnet.

**Server.** `state.proto`, `MenuState.Entry` bekommt `ButtonState.Tone tone;` — das vorhandene Enum,
kein zweites. Der Build erzeugt `MenuState.Entry.TONE__PROP` und den TS-Typ in
`react-src/state/control-state.ts`. `ReactMenuControl.MenuEntry` bekommt die Komponente
`ButtonTone tone` und eine `item(…)`-Überladung mit Ton; serialisiert wird `tone` nur, wenn er nicht
`DEFAULT` ist („absent means default“, wie am Knopf). `ContextMenuOpener.appendCliqued` reicht
`cmd.getTone()` durch.

**Client.**
- `menuItemClassName(current, extra, danger)` in `controls/menu/Menu.tsx` hängt
  `tl-menu__item--danger` an.
- `MenuItem` bekommt die Prop `danger`; `TLMenu.tsx` setzt `danger={item.tone === 'danger'}`.
- `buttonClassName` (`ButtonDefaults.tsx`): der `menu-item`-Zweig gibt `opts.danger` weiter statt
  ihn zu verwerfen; der Kommentar „ein Menüeintrag hat keinen Ton“ fällt. Damit ist der Überlauf der
  Toolbar ohne weitere Änderung dabei — `TLButton` liest `state.tone` heute schon.

Ein Eintrag kann aktiv **und** destruktiv sein; `aria-current` + `tl-type-body-strong` bleiben
unberührt.

## 5 · Bestätigungsdialog

`ConfirmAction` erreicht das Kommando nicht: sie bekommt `ReactContext` und `Continuation`, die
Kette ist privat. Neue Parameter an den acht `ViewActionChain.run`-Aufrufern sind nicht nötig, denn
`ViewActionChain` kennt die Kette ohnehin:

- `Continuation` bekommt `default ButtonTone tone() { return ButtonTone.DEFAULT; }` — „the tone of
  what follows this step“.
- `ChainContinuation` (in `ViewActionChain.runFrom`) antwortet mit `ViewActions.tone(actions ab
  index + 1)`: rot ist der Bestätigen-Knopf genau dann, wenn das, was **nach** dem Bestätigen kommt,
  zerstört.
- `ConfirmAction` reicht `continuation.tone()` an `ConfirmDialogControl.openDialog(…, ButtonTone
  confirmTone)` weiter (einziger Aufrufer); dort `confirmButton.setTone(confirmTone)`.
  `markAsDefault()` bleibt: Enter bestätigt, der Knopf ist `primary` + `danger`.
- `DirtyConfirmDialogControl` bekommt sein Rot über `MessageButtons.discard` (§3); kein Enter-Knopf,
  wie heute.

## 6 · Paket (`design-system/src/components/menu/`)

- `menu.css`: `.tl-menu__item--danger` — ruhend `--tl-status-error-text`; beim Zeigen
  `--tl-status-error-surface` mit `--tl-text-on-status-error`; beim Drücken
  `--tl-status-error-surface-active` mit `--tl-text-on-status-error-active`. Genau die drei
  Token-Paare von `tl-button--ghost.tl-button--danger`, keine neuen Tokens. Deaktiviert gewinnt
  `text-disabled` weiter.
- `menu.contract.md`: Zeile `tl-menu__item--danger` („Eintrag einer destruktiven Aktion; folgt dem
  Ton des Kommandos, nie vom Autor gesetzt“), `tone` in der Feldliste des Eintrags, Konformität:
  „ein destruktiver Eintrag trägt `--danger`“.
- Specimen: ein roter Eintrag im Menü-Specimen, hell und dunkel.
- Ton ist kein Zustand, darum eine Klasse wie am Knopf, kein `data-tl-tone`.

## 7 · Gates und Tests

| Gate | Was es hält |
|---|---|
| `TestViewActions` (neu) oder Erweiterung von `TestViewCommandModel` | `tone([…, delete-object])` ist `DANGER`; `tone([write-channel])` ist `DEFAULT`; `ViewCommandModel.getTone()` mit Clique `delete` ohne destruktive Aktion ist `DANGER`. |
| `TestContextMenuOpener` | der `MenuEntry` eines destruktiven Kommandos trägt `DANGER`; der eines gewöhnlichen trägt keinen Ton in der Serialisierung. |
| Test an `ViewActionChain` | `continuation.tone()` in `[confirm, delete-object]` ist `DANGER`, in `[confirm, write-channel]` `DEFAULT`; der Ton des Schritts selbst zählt nicht mit. |
| Delegations-Test `FormScopedCommandModel` | per Reflexion: jede öffentliche Methode von `CommandModel` ist in `FormScopedCommandModel` deklariert — gegen stilles Zurückfallen auf den Default (Prognose #3). |
| Paket `menu.test.mjs` | `.tl-menu__item--danger` liest die drei Paare und nichts anderes; Lint hält Literale fern; `dist/` byte-identisch. |
| `check-messages-en.sh` | neuer JavaDoc an öffentlicher API → erzeugte `messages_en`, Deutsch nachgezogen. |
| Engine | `npm run build`, `tsc --noEmit`, layout.react, layout.view, demo.react grün. Ratsche unverändert (kein Altbestand berührt). |

## 8 · Reihenfolge mit Fertig-Bedingungen

Branch `CWS/CWS_29617_design_system_ton` auf `CWS/CWS_29617_design_system_welle_3a`, bis !1760
gemergt ist; dann gegen `master`.

1. **Paket:** `tl-menu__item--danger`, Vertrag, Specimen, Test; `dist/` erzeugt und publiziert.
   Fertig: 267+ Tests, Lint grün.
2. **Fakt:** `ViewAction.getTone`, `DeleteObjectAction`, `ViewActions.tone`, `ViewCommand`,
   `GenericViewCommand`, `ViewCommandModel` (mit Clique), `CommandModel`, `FormScopedCommandModel`,
   `ReactButtonControl`, `MessageButtons.discard`; Tests aus §7. Fertig: die drei Demo-Löschen
   (`attributes.view.xml` ×2, `calendar.view.xml`) sind in der Toolbar rot.
3. **Menü:** `state.proto`, `MenuEntry`, `ContextMenuOpener`, `TLMenu.tsx`, `Menu.tsx`,
   `ButtonDefaults.tsx`. Fertig: derselbe Eintrag ist im Kontextmenü und im Toolbar-Überlauf rot.
4. **Bestätigung:** `Continuation.tone`, `ChainContinuation`, `ConfirmAction`,
   `ConfirmDialogControl`. Fertig: „Wirklich löschen?“ hat einen rot gefüllten Enter-Knopf.
5. **Doku und PR:** `altlast.md` (Zeile „Gefahrton im Toolbar-Überlauf“ → erledigt), STATUS,
   Sichtprüfung im Docker (Toolbar, Überlauf, Kontextmenü, Dialogfuß, Rückfrage; hell/dunkel),
   PR mit Bernhard als Reviewer.

## 9 · Nicht-Ziele und Offenes

- **Kein Attribut `tone`/`appearance` am Kommando.** Wer eine destruktive Aktion ohne
  `delete-object` hat, setzt `clique="delete"`. Ein ausdrückliches Attribut bleibt eine mögliche
  spätere Hintertür, nicht Teil dieser Welle.
- **Keine weiteren Töne.** `ButtonTone` behält `DEFAULT` und `DANGER`.
- **Dialog-Gerüst** (sechs Zwei-Knopf-Dialoge mit demselben `cancel + ok + markAsDefault`; Reauth
  setzt `primary` ohne Enter): Welle 4 (Dialoge). Prognose #4, von Hendrik zurückgestellt.
- **Klassische Brücke:** Es gibt keinen Adapter von klassischem `CommandHandler` zum
  React-`CommandModel`; `CommandGroupType.DELETE` ist eine Sicherheitsklasse ohne UI-Haken. Die
  Clique ist die einzige Brücke und reicht.
