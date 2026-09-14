# Korrektur: Die Planungsgrundlage war veraltet

**Datum:** 2026-09-14

## Was passiert ist

Die gesamte Analyse in `findings/AP0-blocker.md` und `findings/AP1-token-inventar.md` wurde gegen
`/Users/hendrik/git/tl8-new-ui` erhoben — Branch `CWS/CWS_29108_ui_flexibility`.

Dieser Branch liegt **399 Commits hinter `master`**, allein im Modul `com.top_logic.layout.react`.

Ich habe das Arbeitsverzeichnis für den aktuellen Stand gehalten und nie gegen `master` geprüft.
Das ist der Fehler.

`tl-engine-7@master` ist `tl-parent-all:8.0.0-SNAPSHOT` — der Repo-Name ist historisch,
TopLogic 8 wird dort entwickelt. Die 7.x-Linie lebt auf `TL/TL_7.12_x` und `TL/TL_7.12.0_hotfix`.

## Was auf master bereits existiert

Ein vollständiges, typisiertes Design-Token-System für die React-Schicht, gebaut von bhu:

```
com.top_logic.layout.react/src/main/java/com/top_logic/layout/react/theme/
  UITheme.java  UIThemeService.java  ThemeToken.java  ColorToken.java
  LengthToken.java  NumberToken.java  TextToken.java  RefToken.java  ColorScheme.java
```

Token-Quelle: `com.top_logic.layout.react/src/main/webapp/WEB-INF/conf/tl-react-theme.config.xml`,
160 Zeilen — 87 `<color>`, 18 `<length>`, 7 `<text>`, 5 `<ref>`. Zwei Themes: `default` und `dark`
mit `color-scheme="dark"`.

Aus dem Javadoc von `UITheme`:

> A token is named by what it is for, not by what it looks like, and a stylesheet consumes it as
> `var(--name)` without a fallback. Rounding comes in two tiers, `corner-radius` for controls and
> `border-radius-02` for surfaces; elevation comes in three steps, `shadow-raised` for a surface
> lifted off the page, `shadow-menu` for a popup and `shadow-dialog` for a layer covering it.

Dazu ein Audit als JUnit-Test:
`src/test/java/test/com/top_logic/layout/react/theme/ThemeTokenAudit.java` +
`TestReactStylesheetTokens.java`. Er meldet genau zwei Vertragsbrüche: eine `var()`-Referenz, die
weder ein Theme-Token noch eine eigene Deklaration auflöst, und eine literale Eckenrundung statt
eines Radius-Tokens. Mit Ausnahmeliste (`allowedLiteralSelectors()`) und `SHAPE_RADII` für Formen,
die literal bleiben müssen.

## Deckungsgleichheit mit dem Plan

| Planvorschlag | Auf `master` vorhanden |
|---|---|
| Primitive→Semantic-Aliaskette | `RefToken`, z. B. `<ref name="border-color" ref="border-subtle"/>` |
| Dark Mode | Theme `dark`, `color-scheme` |
| `var(--x)` ohne Fallback erzwingen | `ThemeTokenAudit` |
| Token-Allowlist in CI | `TestReactStylesheetTokens` |
| Typisierte Token-Werte | `ColorToken`, `LengthToken`, `TextToken`, `NumberToken` |
| Escape-Hatch-Ausnahmeliste | `allowedLiteralSelectors()`, `SHAPE_RADII` |

## Was das für die Zahlen heißt

| Kennzahl | CWS_29108 | master |
|---|---|---|
| Control-Dateien (`*.tsx`) | 58 | **74** |
| registrierte Controls | 53 | **67** |
| TS/TSX-Dateien gesamt | 73 | **96** |
| `tlReactControls.css` | 4.273 Z. | **6.011 Z.** |
| React-Stylesheets | 1 | **2** (`tlReactBase.css`, `tlReactControls.css`) |
| Fremdpaletten-Verstöße | 348 | **14 + 13** |
| Build-Artefakte eingecheckt | ja | **nein** |

Carbon- und Tailwind-Werte sind auf `master` weg. Die Basislinie 348 in
`inventory/foreign-values-budget.json` ist Branch-Realität und **ungültig**.

Auch die Auslieferung hat sich geändert: Das React-Modul hat keine `theme.xml` mehr, die
Stylesheets werden über `StyleSheetConfig` in `tl-layout-react.conf.config.xml` registriert.
Die Erkennung in `tools/check-foreign-values.mjs` und `tools/token-inventory.mjs` kennt diesen
Weg noch nicht und meldet `tlReactControls.css` fälschlich als „nicht ausgeliefert".

## Was überlebt

* Die Analyse der **Engine-Seite**: `theme-settings.xml`, `CSSBuffer`, Theme-Vererbung, die 793
  toten Tokens, die `@layer`-Bestandsaufnahme — das alte System existiert unverändert weiter und
  trägt die nicht-React-UI.
* **Deploy-Lücke #29577** — betrifft `Theme.java`, unabhängig von der React-Schicht.
* Der **oxlint-Spike** und die Erkenntnis, dass die Plugin-API trägt.
* Der **`createPortal`-Bug** — auf `master` sogar in zwei Dateien. Behoben, PR !1618.

## Was hinfällig ist

* Die geplante Token-Architektur für die React-Schicht (drei Ebenen über `theme-settings.xml`)
* Die Dark-Mode-Strategie über `light-dark()` in `CSSBuffer`
* Die Enforcement-Planung für React-CSS (Stylelint-Regeln `tl/known-token`, `tl/no-token-fallback`)
* Die Basislinie von 348 Fremdpaletten-Verstößen

## Prozessbefund: der Push-Hook

Beim Pushen des Fixes abgelehnt. Der Hook `tl-githooks` prüft serverseitig:

```
messageRegex   ^(?:Administrative change: .*|Tagged … |Ticket #([0-9]+): .*|Merge pull request …)
branchRegex    ^(?:master|CWS/CWS_([0-9]+)(?:_.*)?|renovate/.*|TL/TL_…)$
componentRegex ^tl|tl-addons|tl-bpe|…$
statusRegex    ^(?:accepted|testing|approved)$
emailRegex     ^(?:Jenkins …)|(?:[^\s]+( [^\s]+)+ <\w+\.\w+@top-logic\.com>)$
checkTrac      true
```

Der Push scheiterte an `Status: new`. **Ein Branch lässt sich erst pushen, wenn das Trac-Ticket
angenommen ist.** Relevant für jede Automatisierung: Ticket akzeptieren gehört zum Ablauf.

## Nächster Schritt

Vollständige Neuanalyse von `master` läuft. Der Plan wird danach neu geschrieben: was bereits
gebaut ist, wo echte Lücken bleiben, und wie das Design System ergänzt statt dupliziert.

Arbeitskopie von `master`: `/Users/hendrik/git/tl8-wt-29576` (git worktree).
