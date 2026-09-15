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

## Was das Specimen nicht beweist

- Kein SSE, keine Server-Push-Aktualisierung.
- Keine Interaktion: die Fragmente sind statische Momentaufnahmen, Klicks, Eingaben,
  Sortierung, Dropdowns etc. tun nichts.
- Keine Zustände, die der Server setzt — was im Fragment steht, stand so in der Demo-App zum
  Zeitpunkt der Entnahme (ohne Anmeldung; die Tabelle zeigt deshalb keine Datenzeilen).

## Vor Stufe B

Der Sieger aus diesem Specimen wird vor Stufe B einmal in der echten Demo-App gegengeprüft,
nicht nur im Specimen selbst.
