# UI-Durchgang nach Welle 5 — Sammelliste

Die Wellen 0–5 ziehen die Controls ins Paket, ohne neues Bedienkonzept. Was dabei auffällt und **sicher** eine
Anpassung braucht, aber in keiner Welle entschieden wird, steht hier. Der UI-Durchgang nach Welle 5 arbeitet die Liste
ab (Prämisse: modern und großartig zu bedienen, auch bei komplexen Views). Bekannte Grenzen, die eine Welle bewusst
hinnimmt, stehen mit Verweis dabei.

Neue Einträge: Datum, Welle, woher (Sichtprüfung, Hendrik, Review), Quelle in `altlast.md` oder `skalen.md`.

## Bedienkonzept neu

| # | Was | Woher | Quelle |
|---|---|---|---|
| U1 | **Farb- und Icon-Auswahl** sehen aus wie im alten System, „langweilig“ — neues Bedienkonzept für beide Picker | Hendrik 17.10. nach 5a | `skalen.md` „Welle 5a“, `altlast.md` „Welle 5a“ |
| U2 | **Medien-Controls** (Aufnahme, Wiedergabe, Foto, Dateien, PDF, HTML-Dokument): Nutzung unbekannt, keine Metriken; 5b migriert nur. Klären, welche gebraucht werden, und dann gestalten — fehlende Bedienformen u. a. Scrubber und Dauer im Player, Vorschau vor dem Hochladen, Aufnahmedauer | Hendrik 19.10. vor 5b | Spec 5b |
| U7 | **Medien-Player** (heute nur `TLAudioPlayer` mit einem Knopf; ein Video-Player fehlt): soll aussehen und funktionieren wie ein moderner Player — was heute Standard ist, u. a. Play/Pause per Leertaste, Spulen per Pfeiltasten, Zeitleiste zum Skimmen, Dauer und Position, Lautstärke, Tempo, Vollbild (Video) | Hendrik 19.10., Spec 5b Abschnitt 3 | Spec 5b |

## Darstellung

| # | Was | Woher | Quelle |
|---|---|---|---|
| U3 | **Auswahlring der Palettenzelle** und Fokusring kaum zu unterscheiden (bei Karten in 4c mit Haken-Badge gelöst, S2) | Sichtprüfung 5a, 17.10. | `altlast.md` „Nach Welle 5a offen“ |
| U4 | **Mischer des Farb-Popups** fest `size-12` im Quadrat: unter etwa 595 px Fensterhöhe scrollt das Reiterfeld, der Fokusring des Feldes kann abgeschnitten werden | Sichtprüfung 5a, 17.10. (bekannte Grenze) | `altlast.md` „Welle 5a · Sichtprüfung“ |
| U5 | **AppBar kompakt unter 300 px:** `tl-app-bar__trailing` gibt nicht nach, der Titel verschwindet zuerst | Sichtprüfung 4b, S2 (Randfall, bleibt) | `altlast.md` „Welle 4b“ |
| U8 | **Greif-Cursor am nicht ziehbaren Dialog:** `.tl-dialog__surface > .tl-titlebar { cursor: grab }` trifft auch den Kamera-Dialog von `TLPhotoCapture`, der sich nicht ziehen lässt | Review 5b Task 6, 19.10. | `altlast.md` „Welle 5b · Offen“ |
| U9 | **JobStatus nennt den aktuellen Schritt zweimal sichtbar:** die Live-Zeile (Spec 5b §7, Schrittzeile sichtbar) und die Schrittliste darunter; prüfen, ob die Live-Zeile sichtbar nur die Meldung trägt und den Schritt nur vorliest | Sichtprüfung 5b, S3, 19.10. | `altlast.md` „Welle 5b · Sichtprüfung“ |
| U10 | **Kalender, Monat: die Termin-Liste (`role="listbox"`) umschließt auch Tagesknöpfe, „+n weitere“ und das Anlegen-Feld** — ARIA erlaubt in einer Listbox nur Optionen und Gruppen. Sauber wäre eine eigene Schicht für alle Termine des Monats (oder ein Raster mit `gridcell`); das ändert Aufbau und Paket-CSS des Monats | Review 5c Task 8, 19.10. | `calendar.contract.md`, Spec 5c §3 |
| U11 | **Dashboard-Kachel heißt beim Verschieben „Kachel n“** nach ihrer Position, nicht nach ihrem Titel — der Server liefert der Kachel keinen Namen (nur der Aktion); nach dem Verschieben ändert sich der Name mit der Stelle | Sichtprüfung 5c, 19.10. | `dashboard.contract.md`, `TLDashboard.tsx` `labelOf` |
| U12 | **Kalender, Zeitraster öffnet bei 0 Uhr**, nicht am Beginn der Arbeitszeit — wie vorher, aber man rollt bei jedem Öffnen | Sichtprüfung 5c, 19.10. | `TLCalendar.tsx` |
| U13 | **Link-Knopf im Rich-Text-Editor zeigt nicht mehr, dass der Cursor in einem Link steht** (vor 5d: aktive Form). `tl-button` hat keine rein sichtbare aktive Form ohne `aria-pressed`; ein Popup-Auslöser darf kein Umschalter sein — eine Form für „in Kraft“ ohne ARIA-Aussage braucht es | Schluss-Review 5d, 20.10. (bewusster Verlust) | `skalen.md` „Welle 5d“ |
| U14 | **Einträge mit Haken:** `menuitemcheckbox`-Einträge haben keine sichtbare Marke, Radio-Einträge nur die „in Kraft“-Schrift — ein echter Haken für beide | Task 8 5d, 20.10. | `menu.contract.md` |
| U15 | **Leisten ohne Pfeiltasten:** `tl-toolbar` (auch im Rich-Text) hat kein Roving mit Pfeiltasten (WAI-ARIA Toolbar); war vorher so | Review 5d Task 9, 20.10. | `TLToolbar.tsx`, `WysiwygToolbar.tsx` |
| U16 | **`tl-toolbar--wrap` lässt den Trenner am Zeilenende stehen**, wenn die Leiste umbricht | Task 3 5d, 20.10. | `toolbar.css` |
| U17 | **Überschrift-Auslöser nennt die gültige Ebene nicht** mehr im Tooltip (vor 5d schon) | Review 5d Task 9, 20.10. | `WysiwygToolbar.tsx` |
| U18 | **Code- und Script-Editor:** CodeMirrors `defaultHighlightStyle` ist eine Fremdpalette, im Dunkelmodus etwa 2:1 — Syntaxfarben aus Rollen; Nur-Lese-Editor trägt bis dahin den Feldrahmen, eine eigene Lese-Form fehlt (z. B. wie `tl-prose pre`, ohne Leerraum unter kurzem Inhalt); Doc-Popups könnten `tl-type-*` tragen statt Schriftgrößen zu lesen | Review 5d Task 11, 20.10. | `tlCodeEditor.css`, `tlScriptEditor.css` |
| U20 | **Mengenskala aus der Marke:** ein Ton hell → dunkel für Heatmaps und Stufen; heute braucht sie kein Diagramm (Chart.js ohne Heatmap-Plugin) | Spec Diagrammfarben, 22.10. | `docs/superpowers/specs/2026-10-22-diagrammfarben-design.md` |
| U21 | **Hervorheben:** alle Reihen grau, eine in Farbe (NN/g „Highlighter“); braucht eine Aussage des Servers, welche Reihe zählt | Spec Diagrammfarben, 22.10. | `docs/superpowers/specs/2026-10-22-diagrammfarben-design.md` |
| U22 | **Fuge im Ring bei Serverfarben:** gibt der Server einem Ring nur `backgroundColor` mit, setzt das Theme keine Fuge, Chart.js zeichnet sie weiß — im Dunkelmodus sichtbar. Die Fuge sollte auch dann aus `--tl-surface-layer` kommen | Final-Review Diagrammfarben, 23.10. | `useThemeDefaults.ts`, `chart.contract.md` |

## Bewegung

| # | Was | Woher | Quelle |
|---|---|---|---|
| U6 | **Bewegung im Ganzen:** die Wellen bauen nur Minimalfassungen (z. B. Drawer gleitet per `@starting-style` nur herein, kein Ausgang); Choreografie, Ein- und Ausgänge, Dauern je Komponente | Hendrik 16.10. nach 4b | `skalen.md` (Bewegung), `altlast.md` „Welle 4b“ S4 |
| U19 | **Anker-Aufblitzen unter `prefers-reduced-motion`** ist weg (die globale Regel in `base.css` setzt 0,01 ms; vor 5d bewusst 0,6 s) — ein Sprung ohne Scrollen gibt dann keine Rückmeldung; Farbwechsel ist keine Bewegung, braucht eine Ausnahme der globalen Regel | Review 5d Task 2, 20.10. | `generate.mjs` (baseCss) |

## Offen außerhalb des Durchgangs, aber mit UI-Folge

- Dichte-Schalter: in 5d als Gruppe „Dichte“ im Benutzermenü gebaut (vorläufig, 20.10.); der Durchgang kann ihn verschieben.
- Script-Editor: der Fehlerrahmen ist verdrahtet, der Server meldet `hasError` aber nie (Syntaxfehler kommen als Diagnose) — Server-Seite als Folgeticket.
- Icon-Bibliothek: Wechsel z. B. zu Lucide prüfen (01.10.); die Wellen binden nichts an Glyphnamen.
- Fokusfalle ohne Tab-Zyklus am Dokumentende (alle portalierten Popups): Trac #29879.
