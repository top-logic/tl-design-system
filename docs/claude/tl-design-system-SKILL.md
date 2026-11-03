---
name: tl-design-system
description: Use whenever a React control in com.top_logic.layout.react gets CSS, class names, colors, sizes, states or a new component is created — before writing any CSS or className. Enforces the TopLogic Design System (package tl-design-system): tokens only, tl- classes, states as attributes, no styling in tlReactControls.css. Examples - "style the new chip control", "add a hover color", "create a segmented switch", "fix the tooltip contrast".
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# TopLogic Design System — Regeln für Komponenten

Das Aussehen der React-Oberfläche kommt aus dem Paket `tl-design-system`, einem Modul in tl-engine-7
(Verzeichnis `tl-design-system/` neben `com.top_logic.layout.react`). Sein Build erzeugt
`primitives.css`, `tokens.css`, `base.css`, `components.css` unter
`src/main/webapp/style/tl-design-system/` (nicht eingecheckt), die `com.top_logic.layout.react` als
`ClientResources` lädt. Das alte `tlReactControls.css` ist seit Welle 5d gelöscht; eine Ratsche hält es draußen.
Die Doku (`docs/skalen.md`, Specs) liegt im Repo `TopLogic/tl-design-system`.

## Bevor du CSS schreibst

1. Lies im Doku-Repo `TopLogic/tl-design-system` `CLAUDE.md`, dann `docs/skalen.md` (Abschnitt der
   Komponente, falls vorhanden; sonst `git clone https://git.top-logic.com/TopLogic/tl-design-system.git`),
   und im Modul `tl-design-system/dist/tokens.css` (die Namen, die du lesen darfst; entsteht mit
   `node tools/generate.mjs` oder dem Maven-Build).
2. Prüfe, ob die Komponente schon im Paket ist: `ls tl-design-system/src/components/`. Wenn ja, ändere
   sie dort. Wenn nein, entsteht sie dort — nie in `tlReactControls.css`.
3. Ist die Komponente neu, sag dem Design-System-Verantwortlichen (hpe) Bescheid: Name und Zweck. Die
   Entscheidung (Varianten, Zustände) kommt nach `docs/skalen.md`.

## Die Regeln (jede läuft als Test im Paket)

| Regel | Konkret |
|---|---|
| Nur Tokens | Farbe, Maß, Dauer, Kurve, `z-index`, Schatten nur als `var(--tl-…)`. Kein Hex, kein `px`/`rem`, kein `ms`, kein `rgba`. Erlaubte Schlüsselwörter: `0`, `1`, `auto`, `none`, `100%`, `currentColor`, `inherit`, `transparent`. |
| Fehlendes Token | Wird in `tl-design-system/src/tokens.json` angelegt (nur als `{referenz}` auf `primitives.json`), nie lokal in einer Klasse deklariert. Kategorien sind geschlossen: `surface text icon border focus shadow space radius size font duration easing layer status category`. |
| Namen | Englisch, kebab-case, BEM: `.tl-<block>`, `.tl-<block>__<element>`, `.tl-<block>--<modifier>`. Modifier nur für Varianten, die der Autor wählt (`--primary`, `--danger`), nie für Zustände. |
| Zustände | Attribute: `:disabled`, `[aria-pressed="true"]`, `[aria-busy="true"]`, `[aria-expanded]`, `[aria-selected]`, `[aria-invalid]`, `:focus-visible`; sonst `data-tl-state="…"`. Eine Klasse `--active`/`--open`/`--loading` bricht das Gate. |
| Schrift | `font-size`, `font-weight`, `line-height` nur über die Klassen `.tl-type-*` aus `base.css`; Icons über `.tl-icon-glyph|sm|md|lg`. Die Komponente setzt höchstens `font: inherit`. |
| Fokus | Nie `:focus` ohne `-visible`, nie `outline: none`. Den Ring liefert `base.css` für alles Fokussierbare. |
| Namensraum | Jede Custom Property, die mit `--tl` beginnt, gehört dem Paket. Außerhalb der erzeugten Stylesheets des Pakets wird darin nichts definiert; gelesen werden darf, was das Paket definiert — eine Übergangsregel im alten Stylesheet liest Tokens, definiert sie aber nicht. Eigene Mechanik-Variablen heißen anders (`--item-index`, nicht `--tl-item-index`); sonst schlägt die Ratsche an. |
| Kein Selektor von außen | Nicht `.tlToolbar .tl-button`. Der Container gibt Varianten per React-Kontext vor (`ButtonDefaults`); die Komponente stylt sich selbst. |
| Kontrast | Text 4,5, Linie und Icon 3,0 — gegen `surface-base` UND `surface-layer`, hell und dunkel. Ein Test je Komponente prüft das (`test/components.test.mjs`). |
| Altlast | Keine Aliase alter Namen, kein Übergang. Wenn du eine alte Komponente anfasst: neuer Block im Paket, alter Block in `tlReactControls.css` gelöscht. |

## Eine neue Komponente, Schritt für Schritt

1. **Entscheiden, nicht abschreiben.** Welche Varianten und Zustände hat sie wirklich? Zwei Sätze
   Begründung nach `docs/skalen.md` (neuer Abschnitt `### <Komponente>`), `docs/praesentation-v2.md`
   nur mitziehen, wenn sich das Gesamtbild ändert.
2. `tl-design-system/src/components/<name>/<name>.css` — liest nur `var(--tl-*)`, BEM, Zustände als
   Attribute. Modifier-Liste in `tools/lint-css.mjs` (`MODIFIERS`) eintragen.
3. `test/components.test.mjs`: Kontrast jeder Variante × Zustand × Modus, mit der Token-Map, die
   die CSS tatsächlich liest.
4. `<name>.spec.html` daneben: alle Kombinationen, Schalter für Modus und Dichte; Test prüft
   Vollständigkeit.
5. `<name>.contract.md`: Zustand vom Server, Aktionen, Tokens, Attribute. Test hält Vertrag und CSS
   deckungsgleich.
6. `cd tl-design-system && node tools/generate.mjs && npm test && npm run test:dom && node tools/lint-css.mjs`
   — alles grün. `test:dom` braucht Chrome. Die laufende Demo sieht den neuen Stand nach `generate`.
7. TSX: `className` aus `tl-<block>` + Modifiern, `className`-Prop durchreichen, Zustände als
   Attribute, Icon mit `.tl-icon-sm|md`, Text mit `.tl-type-label`. Keine Inline-Styles für Farbe
   oder Maß.
8. Ein Commit in tl-engine-7 (Branch `CWS/CWS_<nr>_…`, Paket und TSX zusammen); PR mit `hpe` als Reviewer
   und `jenkins` (ohne diese Anfrage baut Jenkins den PR nicht). Neue Entscheidungen in `docs/skalen.md` gehen
   als eigener Commit ins Doku-Repo.

## Wenn etwas nicht passt

- Ein Kontrasttest schlägt an: Das ist ein Skalen-Befund. Nicht den Test lockern, nicht das Token
  lokal überschreiben. Befund in `docs/skalen.md` notieren, Wert dort entscheiden.
- Ein Token fehlt (z. B. eine Rampe für Hover): in `tokens.json` anlegen, Beschriftungen auf
  Flächen unter `derived` (werden gerechnet). Neue Primitive aus dem OKLCH-Kern
  (`tools/lib/color.mjs`, `markenRollen`), Namen aus `tools/lib/naming.mjs`.
- Eine App braucht einen eigenen Look (Glas, Serifen, Hintergrundbild): App-Stylesheet über
  `css-class` am Element, nie neue Engine-Tokens dafür.
