# #29850 — Regeln fürs Stylen als Entwicklerdoc in tl-engine-7 (Entwurf)

Stand 14.10.2026, Entwurf zur Abstimmung mit Bernhard. Nichts davon liegt in der Engine.

## Was in die Engine soll

| Datei hier | Ziel in tl-engine-7 | Art |
|---|---|---|
| `design-system.md` | `com.top_logic.layout.view/src/main/java/META-INF/tl-docs/view-layer/design-system.md` | neu, `order: 34` (direkt vor `theme-tokens`) |
| `theme-tokens.md` | `…/tl-docs/view-layer/theme-tokens.md` | Überarbeitung von Bernhards Artikel; Änderungen in `theme-tokens.diff` |
| unten | `CLAUDE.md`, Abschnitt „React Controls“, nach dem Verweis auf `theme-tokens.md` | ein Satz |

**Zeile für `CLAUDE.md`:**

```
Before writing CSS, a className or a state of a React control, read
[view-layer/design-system.md](com.top_logic.layout.view/src/main/java/META-INF/tl-docs/view-layer/design-system.md):
new and migrated controls are styled with the design-system package (`tl-` classes, `--tl-*` tokens, states as
attributes), and nothing new goes into `tlReactControls.css`.
```

## Was `theme-tokens.md` dabei ändert

- **Beschreibung** (der Auslöser für Claude): nicht mehr „vor jedem CSS eines React-Controls“, sondern Layer, Rollen in
  der Modellkonfiguration, Themes in `tl-react-theme.config.xml` und Controls, die noch nicht umgestellt sind.
- **Einleitung:** zwei Quellen; neue und umgestellte Controls → `design-system.md`.
- **Radius und Elevation:** bleiben stehen, mit dem Vermerk „Legacy“ und der Zuordnung alt → neu (aus `altlast.md`
  „Nicht abgebildete Alt-Tokens“).
- **Typografie:** Die Tabelle war seit Welle 3b falsch. `<text>` setzt die Klassen `tl-type-*`
  (`TLText.tsx`, `TYPE_CLASS`), kein Stylesheet liest mehr `display-01-font-size` oder `heading-04-font-size`.
  Neu ist die Tabelle Variante → Klasse. Der Anker `#typography-tokens` bleibt, weil `display.md` darauf verweist.
- **Flaches Theme:** Vermerk, dass es nur Controls erreicht, die noch nicht umgestellt sind.
- **Unverändert:** Cascade Layers, Rollen statt Farben, Seitenhintergrund, Audit-Test.

## Belege (14.10., Worktree auf `welle_4a`)

- Die Stylesheets des Pakets lesen nur `--tl-*` (`grep 'var(--' dist/*.css`: keine fremde Variable).
- Der `UIThemeService` schreibt `data-tl-mode` aus dem Farbschema des Themes. `data-tl-density` setzt er einmal auf
  `normal`, nicht aus dem Theme.
- Alte Tokens werden noch gelesen, also bleiben die Abschnitte als „Legacy“ stehen. Lesestellen außerhalb des Pakets:
  `corner-radius` 61, `border-radius-02` 20, `shadow-menu` 21, `shadow-raised` 13, `body-compact-01-font-size` 17,
  `label-01-font-size` 15.

## Offene Fragen an Bernhard

Englisch, zum Einfügen in den Ticket-Kommentar oder den PR:

> 1. **Customer themes split.** A theme in `tl-react-theme.config.xml` now reaches only the controls not migrated
>    yet; the package follows just its colour scheme (`data-tl-mode`). With every wave, a customer theme written
>    there loses reach. The package's own route (`derive`, `[data-tl-theme]`) is not wired into the engine yet
>    (package issue #16), and where `derive` runs is still open from your TL-Script remark of 25.09. Do you want
>    the article to say this openly, or should we first decide where a customer theme lives?
> 2. **Place.** `design-system.md` goes into `view-layer` next to `theme-tokens.md`, although its rules concern the
>    controls of `com.top_logic.layout.react`. Would you rather have it in that module's `tl-docs`?
> 3. **Your article.** The changes to `theme-tokens.md` keep your sections and mark radius tiers, elevation and the
>    flat theme as legacy; the typography table is replaced because `<text>` reads the package's type classes since
>    wave 3b. Fine with you, or do you prefer to cut the legacy sections once the last reader is gone?

## Danach

Abgestimmt → Engine-Branch `CWS/CWS_29850_design_system_entwicklerdoc` auf master, Dateien übernehmen, `TestDocumentation`
(läuft mit `TestAll` von `layout.view`) grün, PR mit bhu und `jenkins`. Die Anleitung im Paket-Repo verweist dann auf
den Artikel statt auf „kommt mit #29850“.
