# Vertrag: Reihen und Abstände

Stack, Grid, Inset, Bounded, Item und Deck — die Bausteine, mit denen Ansichten ihre Kinder ordnen. Kein Aussehen,
nur Lage und Abstand. Die Gap-Skala teilen sie mit `tl-columns`.

## Zustand

| Control | Schlüssel | Klasse |
|---|---|---|
| `TLStack` | `direction`, `gap`, `align`, `justify`, `wrap`, `growFirst`, `maxWidth`, `itemClass` | `tl-stack` mit `tl-stack--<richtung>`, `--gap-<stufe>`, `--align-<wert>`, `--justify-<wert>`, `--wrap`, `--grow-first`; mit `maxWidth` zusätzlich `tl-bounded` |
| `TLGrid` | `columns`, `minColumnWidth`, `maxColumns`, `gap`, `maxWidth`, `itemClass` | `tl-grid tl-grid--gap-<stufe>`; die Spaltenvorlage inline; Abstand im TSX aus derselben Stufe |
| `TLInset` | `child` | `tl-inset`, in einem Panel `tl-inset--panel`, in einer Karte `tl-inset--card` (aus `useSurface()`) |
| `TLDeckPane` | `activeChild` | `tl-deck` |
| Hülle wiederholter Kinder | `itemClass` | `tl-item` und die konfigurierte Klasse; Position als `--item-index` (0-basiert) |
| Haken der ausgewählten Option | `selectable`, `selected` | `tl-item__check`: ein dekoratives `<span aria-hidden="true">` in der Hülle, nur bei `aria-selected="true"`; sitzt oben am Ende, fängt keinen Klick; die Auswahl bleibt allein in `aria-selected` |
| Auswahl unter den Einträgen | `selectable`, `itemKeys`, `selected`, `multiSelect` | der Behälter `role="listbox"` (mehrfach: `aria-multiselectable`), jede Hülle `role="option"` mit `aria-selected`; kein Modifier |

## Aktionen

| Befehl | Wann |
|---|---|
| `selectItem` | Klick auf einen Eintrag (mit Strg/Cmd umschalten, mit Umschalt erweitern), Enter oder Leertaste am Eintrag, langes Drücken (mehrfach); Argumente `key`, `toggle`, `range`. Ein Klick auf ein bedienbares Element im Eintrag gehört diesem |

## Tokens

| Stufe | Token |
|---|---|
| `compact` | `--tl-space-sm` |
| `default` | `--tl-space-md` |
| `loose` | `--tl-space-lg` |
| Inset Seite / Panel / Karte | `--tl-space-lg` / `--tl-space-md` / `--tl-space-xs` `--tl-space-md` |
| Option beim Zeigen | Halo `--tl-space-2xs` in `--tl-surface-state-hover-strong` (der halo um Flächen; Marken lesen `-hover`) |
| Haken der Option | `--tl-surface-brand` (Kreis, `--tl-size-icon-md`, `--tl-radius-round`), `--tl-text-on-brand` (Haken, Rand `--tl-border-width-md`), Lage `--tl-space-xs` oben am Ende |
| Option ausgewählt | Ring `--tl-border-width-md` in `--tl-border-interactive` über dem Eintrag, Radius `--tl-radius-md` |

## Konformität

Ein Behälter besteht den Vertrag, wenn er seinen Abstand aus der Skala oben nimmt und keine eigene Custom Property
im Namensraum `--tl` setzt; ein auswählbarer meldet die Auswahl über `aria-selected`, nicht über eine Klasse.
