# Übergabe: Sitzung „Zwei Wege / Kacheln / UI-Paket v1“ (25.09.–30.09.)

**Temporär.** Löschen, sobald die konsolidierte Sitzung den einen offenen Faden unten übernommen hat.
Diese Sitzung ist damit geschlossen; sie hat keinen eigenen Branch und keine unversionierten Änderungen.

## Was diese Sitzung geliefert hat — alles auf `main`, alles von der 28.09.-Sitzung übernommen

| Commit | Inhalt | Stand heute |
|---|---|---|
| `fb2bfd3` | Entscheidung „Zwei Wege, kein dritter“ in `docs/skalen.md`, Folie 13b, Übersicht §2b, Spec §3 Fortschreibung, STATUS | gilt; Wiki nachgezogen |
| `1912773` | Spec `2026-09-25-ui-paket-design.md` v1 (Fork) | am 28.09. auf !1698/#29643 umgeschrieben; die drei Korrekturen aus dem Planen (remove wirkt beim Lesen; Fokusfalle in `TLWindow`; Snackbar ohne Fokusfalle) stehen drin (§3c Korrektur, §4 Tabelle) |
| `b846159` | Drei Kacheln (Marke / Komponenten / Headless) in Präsentation, Übersicht, Skalen; Wiki | gilt |
| `c6fbb61` | Plan `2026-09-25-ui-paket.md` v1, 24 Tasks (Fork) | am 28.09. auf 23 Tasks umgeschrieben (`0c359e1`); Gruppe A fertig (!1710), B/C/E warten auf !1698 |

Nicht mehr zu tun: die Frage „subagent oder nativ“ (entschieden: SDD, Ledger `.superpowers/sdd/2026-09-25-ui-paket/`),
die MUI-Adapter-Diskussion (ersetzt durch #29661/#29662 und „Ein Vertrag, zwei Hälften“ vom 28.09.),
die Sicherungsdateien `messages_en.properties~` im Worktree (gelöscht, sind ignoriert, kommen vom Generator wieder).

## Der eine offene Faden: Wo rechnet `derive`?

Bernhard, mündlich am 25.09.: „TL-Script ist dynamischer Code und muss beim Client generiert werden.“
Gemeint ist vermutlich, dass ein Theme in TopLogic kein Bauartefakt ist — Theme-Variablen werden in der
laufenden Anwendung bearbeitet. Eine vorab erzeugte `acme.theme.css` passt nicht in dieses Modell, wenn
ein Admin die Hausfarbe im Theme-Editor ändern soll, ohne neu zu bauen.

Das ändert an der Rechnung nichts. Der Kern (`tools/lib/color.mjs`, `pairs.mjs`, `contrast.mjs`) ist
reines ES-Modul ohne Abhängigkeiten und läuft in Node und im Browser gleich. Drei Orte:

1. **Bauzeit** (heute): Node-Werkzeug, Datei im Kundenprojekt. Kein Theme-Editor zur Laufzeit.
2. **Browser beim Laden:** Engine liefert die Primitiv-JSON, jeder Client rechnet die Rollen. Gleicher Code.
   Kosten: Bericht mit Befunden geht verloren, kurzer Flash vor dem Setzen.
3. **Browser beim Speichern im Theme-Editor:** der Admin-Client rechnet einmal, die Engine speichert das
   Ergebnis als CSS und liefert es statisch aus. Gleicher Code, Befunde als Meldung im Editor, kein Flash.

Empfehlung: Option 3. Abgelehnt: Java-Port des Kerns (zweite Wahrheit, zwei Paarlisten, zwei
Kontrastrechnungen). Zu klären mit Bernhard: meint er den Endnutzer beim Laden (2) oder die Bearbeitung
zur Laufzeit (3), und soll TL-Script die Primitive liefern (Ausdruck statt Hex)? Seine Antwort gehört als
Entscheidung in `docs/skalen.md` unter „Themes: eine dritte Achse“ (dort ist „wie die Engine die Themes
erfährt“ bewusst offen, Zeile ~791) — mit Präsentation und STATUS.

## Zwei Antworten aus dem Gespräch, die wiederkommen werden (in docs schon gedeckt)

* „Neuer Enum-Wert bekommt Rolle `warning` — wie erfährt das CSS davon?“ Gar nicht: geschlossene Rollenliste,
  `TLText`/`TLPill.tsx` setzt nur `tl-pill--<rolle>`, `pill.css` kennt alle 14 Rollen. `docs/skalen.md` „Pill: Rolle statt Farbe“.
* „Kann Mercedes MBUI einfach dranlegen?“ Läuft (Präfixe kollidieren nicht, ein React, Portale unter `html`-Attributen),
  passt aber nur mit Adapter (MUI-Theme aus unseren Rollen) — jetzt Richtung #29662 / „Ein Vertrag, zwei Hälften“.
