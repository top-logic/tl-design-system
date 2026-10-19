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

## Bewegung

| # | Was | Woher | Quelle |
|---|---|---|---|
| U6 | **Bewegung im Ganzen:** die Wellen bauen nur Minimalfassungen (z. B. Drawer gleitet per `@starting-style` nur herein, kein Ausgang); Choreografie, Ein- und Ausgänge, Dauern je Komponente | Hendrik 16.10. nach 4b | `skalen.md` (Bewegung), `altlast.md` „Welle 4b“ S4 |

## Offen außerhalb des Durchgangs, aber mit UI-Folge

- Dichte-Schalter für `data-tl-density` fehlt (Kandidat Benutzermenü unter der Themewahl), auf später verschoben (30.09.).
- Icon-Bibliothek: Wechsel z. B. zu Lucide prüfen (01.10.); die Wellen binden nichts an Glyphnamen.
- Fokusfalle ohne Tab-Zyklus am Dokumentende (alle portalierten Popups): Trac #29879.
