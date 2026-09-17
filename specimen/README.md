# Specimen

## Start

```bash
cd specimen
node serve.mjs
```

Läuft auf `http://localhost:8137/`. `/style/*` liefert dabei das echte Stylesheet-Verzeichnis
aus dem Worktree (`TL_WORKTREE`, Vorgabe `~/git/tl8-wt-29584`), nicht eine Kopie im Specimen.
Prüfung:

```bash
curl -s -o /dev/null -w "%{http_code} %{size_download}\n" http://localhost:8137/style/tlReactControls.css
```

Erwartet `200` und eine Größe über 100000 Byte.

## Was das Specimen beweist

Die neue Farbpalette (`tokens.json`) wird auf echtem Material gezeigt: dem echten, ausgelieferten
`tlReactControls.css` aus dem Worktree und echten Markup-Fragmenten aus der laufenden
Demo-App (`markup/table.html`, `markup/form.html`, `markup/buttons.html` — Abzüge, keine
Nachbildungen; entfernt wurden nur `id`-Attribute, Inline-`style` und Sitzungs-/Fenster-Attribute).
Wer das Specimen öffnet, sieht also Token-Werte auf vorhandenen Controls, nicht auf einer
Attrappe.

## Die Vergleichsansicht

Ansicht → *Vergleich* zeigt dieselben Fragmente zweimal: links unter dem heutigen Theme
(`tokens.json`), rechts unter der entschiedenen Skala (`skala.json`). Das ausgelieferte
`tlReactControls.css` kennt nur die heutigen Tokennamen — die Skala nimmt deshalb den Rückweg
über `abbildung.json`. Der Umweg ist die Probe: **Was sich nicht zurückführen lässt, ist in
Stufe B eine Änderung am Stylesheet, keine an der Skala.**

Die Custom Properties liegen **je Seite auf dem Container**, nicht auf `:root` — nur so gelten
zwei Token-Sätze gleichzeitig. Deshalb setzt `abbildung.mjs` jedes der 54 Ist-Tokens
ausdrücklich: Ein fehlendes würde vom heutigen Theme erben und die alte Farbe als neue zeigen.
Was entfällt, bekommt `initial` und fällt sichtbar aus; was offen ist, trägt den heutigen Wert
und wird als offen ausgewiesen.

Die Leiste darüber führt die zwölf mehrdeutigen Tokens mit ihrer Regel. **Drei davon sind rot
markiert:** Dort gelten beide Ziele gleichzeitig für verschiedene Eigenschaften, der Umschalter
zeigt nur einen Ausschnitt.

## Was das Specimen nicht beweist

- Kein SSE, keine Server-Push-Aktualisierung.
- Keine Interaktion: die Fragmente sind statische Momentaufnahmen, Klicks, Eingaben,
  Sortierung, Dropdowns etc. tun nichts.
- Keine Zustände, die der Server setzt — was im Fragment steht, stand so in der Demo-App zum
  Zeitpunkt der Entnahme (ohne Anmeldung; die Tabelle zeigt deshalb keine Datenzeilen).

## Vor Stufe B

Der Sieger aus diesem Specimen wird vor Stufe B einmal in der echten Demo-App gegengeprüft,
nicht nur im Specimen selbst.

## Werkzeuge

| Aufruf | Was es tut |
|---|---|
| `node --test` | alles prüfen — 105 Tests |
| `node inventar.mjs` | das ausgelieferte CSS auszählen (`--json` für die Rohdaten) |
| `node stellen.mjs [token]` | auszählen, wo das CSS die mehrdeutigen Tokens liest, und was dort gilt |
| `node generieren.mjs` | `skala.css` aus `skala.json` neu erzeugen |
| `node serve.mjs` | Specimen auf `http://localhost:8137/` |

`skala.json` hält den **entschiedenen Soll-Zustand** in zwei Schichten: `primitiv` trägt die
Werte, alles darüber nur Referenzen. `tokens.json` daneben hält den **Ist-Zustand** des
ausgelieferten Themes.

Das Inventar erwartet den Worktree unter `~/git/tl8-wt-29584` oder in `TL_WORKTREE`. Fehlt er,
werden die Beleg-Tests übersprungen statt zu scheitern.
