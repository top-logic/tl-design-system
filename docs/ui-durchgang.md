# UI-Durchgang nach Welle 5 — Sammelliste

Die Wellen 0–5 ziehen die Controls ins Paket, ohne neues Bedienkonzept. Was dabei auffällt und **sicher** eine
Anpassung braucht, aber in keiner Welle entschieden wird, steht hier. Der UI-Durchgang nach Welle 5 arbeitet die Liste
ab (Prämisse: modern und großartig zu bedienen, auch bei komplexen Views). Bekannte Grenzen, die eine Welle bewusst
hinnimmt, stehen mit Verweis dabei.

Neue Einträge: Datum, Welle, woher (Sichtprüfung, Hendrik, Review), Quelle in `altlast.md` oder `skalen.md`.

## Reihenfolge (Hendrik, 26.10.)

0. **Bestandsaufnahme:** die meistgenutzten Views der Demo in hell, dunkel und kompakt fotografieren, Kritik und
   Audit darüber; Befunde kommen als neue U-Einträge hierher, Doppelungen mit Konsolidierungs-Prognose. **Tabellen
   zuerst** — in echten Anwendungen die meistgenutzte Komponente; bei Konflikten gewinnt die Tabelle.
1. **Systemweit:** Bewegung (U6, U19); Zustandssprache als ein Paket (U3, U13, U14); Icon-Bibliothek entscheiden;
   Pfeiltasten in Leisten (U15); Tabellen-Befunde aus Schritt 0.
2. **Signature-Komponenten:** Farb- und Icon-Picker (U1, U4); Kalender (U23, U12); Player (U7).
3. **Kleine Korrekturen, ein Paket:** U8, U9, U11, U17, U22, U5, U10, U18.
4. **Wartet auf Klärung oder Server:** U2, U20, U21, U24.

## Tabellen (Bestandsaufnahme 26.10.)

Demo auf master `7def158f02`, Views „Objektliste“ (`tickets.view.xml`) und „Tabellenspalten“, hell und dunkel.

| # | Was | Woher | Quelle |
|---|---|---|---|
| U25 | ✅ UI-Durchgang 1 · **Auswahl kaum von Hover zu unterscheiden:** `surface-interactive-selected` ist ein Grau eine Stufe neben `-hover` (hell `gray-7`/`gray-4`, dunkel `gray-64`/`gray-67`); ohne Fokusring sieht man nicht, welche Zeile gewählt ist. Gewählt braucht eine eigene Aussage (Markenton, Kante links o. Ä.) — gehört zur Zustandssprache (U3, U13, U14) | Bestandsaufnahme 26.10. | `table.css` `.tl-table__row[aria-selected]`, `tokens.json` |
| U26 | **Seite springt beim Wählen:** in der Objektliste fügt die Auswahl über der Tabelle Inhalt ein (Chip, Status), die Tabelle rutscht um etwa 70 px nach unten — der nächste Klick trifft daneben. Platz reservieren oder die Anzeige an eine Stelle legen, die nichts verschiebt | Bestandsaufnahme 26.10. | `tickets.view.xml` |
| U27 | **Filter und Spaltenwahl als modaler Dialog:** für eine Liste von Häkchen verdunkelt sich die ganze Seite, angewandt wird erst mit „Ok“. Modern: Popover am Spaltenkopf, wirkt sofort, Suche bei langen Listen, Anzahl je Wert; Spaltenwahl mit viel Leerraum unter den Einträgen | Bestandsaufnahme 26.10. | `TLColumnSelect`, Filter-Dialog der Tabelle |
| U28 | ✅ UI-Durchgang 1 · **Zahlen linksbündig:** Zählspalten („Tickets“, „M1“, „M2“) stehen links, ohne Ziffern gleicher Breite. Zahlen rechtsbündig mit `tabular-nums`, Kopf mit ausgerichtet; die Spalte braucht eine Aussage ihres Typs | Bestandsaufnahme 26.10. | `table.css` (keine Ausrichtung je Typ) |
| U29 | ✅ UI-Durchgang 1 · **Kopfzeile laut:** jede Spalte zeigt Filtertrichter, Gruppierung und Sortierpfeil dauerhaft; Titel werden abgeschnitten („Statusbezeich…“, „Anfan…“). Werkzeuge nur bei Hover/Fokus oder wenn aktiv; aktiver Filter deutlich markiert, inaktiver leise | Bestandsaufnahme 26.10. | `table.css` Kopfzelle |
| U30 | **Letzte Spalte füllt die ganze Breite** bei wenigen Spalten (Map-Zeilen: zwei Spalten über 1300 px); Zeilen und Leerraum darunter ohne Ende. Füllspalte oder begrenzte Breite prüfen | Bestandsaufnahme 26.10. | Tabellenspalten-Demo |
| U31 | ✅ UI-Durchgang 1 · **Gruppenzeilen:** Gruppenwert als Chip neben einem kleinen Zähler, Summen fett in denselben Spalten wie die Werte — Hierarchie unklar. Gruppenkopf als eigene Zeilenform (Fläche, Zähler als Badge, Summen abgesetzt) | Bestandsaufnahme 26.10. | `table.css` Gruppenzeile |
| U32 | **Formular ohne Objekt übernimmt das erste Objekt nicht — Fehler im Polling-Client, kein Gestaltungsthema:** nur in Tabs, die statt des Event-Streams pollen (`sessionStorage['tl-react-sse-polling']`). `pollLoop()` verteilt alle Events einer Antwort in einer Schleife (`sse-client.ts`), die Felder sind da noch nicht gezeichnet, ihre Patches gehen verloren. Eingeführt mit b364d93daa (#29878, Polling-Rückfall, master seit !1912, 19.10.); Welle 5 nicht beteiligt. Vorschlag `flushSync` je Event, Test und Fix lokal auf Engine-Branch `local/form-empty-debug` (Vitest rot → grün); im Browser noch nicht geprüft. Gehört an den Autor von #29878, nicht in den Durchgang | Bestandsaufnahme 26.10., Ursache Opus-Agent | `sse-client.ts` `pollLoop` |
| U33 | **Anmeldung klebt oben:** die Karte steht am oberen Rand statt mittig, „Anonym stöbern“ als nackter Link darunter — erster Eindruck der Anwendung | Bestandsaufnahme 26.10. | Login-Seite |

Gut gelöst und zu halten: Pfeiltasten bewegen Auswahl und Detail sofort, der Fokusring der Zeile ist klar, Status-Chips
lesen sich in beiden Modi, die Zeilenhöhe ist ruhig.

## Weitere Views (Bestandsaufnahme 26.10.)

| # | Was | Woher | Quelle |
|---|---|---|---|
| U34 | **Board-Karten leer und laut:** Karte trägt nur Titel und den Status-Chip, der in seiner Statusspalte nichts sagt; Öffnen-Symbol auf jeder Karte; hohe Karten für eine Zeile Inhalt. Karte zeigt, was beim Sortieren hilft (Verantwortlich, Fälligkeit, Kommentare), Öffnen bei Hover/Fokus | Bestandsaufnahme 26.10. | Board-Demo, `tl-card` |
| U35 | **Leerer Zustand ohne Form:** „Kein Objekt ausgewählt“ als graue Zeile oben links, im Seitenformular sogar ohne Innenabstand. Leerzustand mit Mitte, Symbol und nächstem Schritt („Ticket links wählen oder neu anlegen“) | Bestandsaufnahme 26.10. | Detailbereiche, `tl-empty`? |
| U36 | ✅ UI-Durchgang 1 · **Zahlen und Beträge linksbündig** auch in Projekten („120.000,00“), das Budgetfeld über die ganze Breite mit zweizeiliger Beschriftung — bestätigt U28 als systemweit | Bestandsaufnahme 26.10. | Projekte |
| U37 | **Aktionsknöpfe als volle Balken:** „Fehler und Hinweise“ stapelt acht seitenbreite, mittig beschriftete Knöpfe — Knöpfe nehmen ihre Breite, nicht die der Seite | Bestandsaufnahme 26.10. | Fehler-und-Hinweise-Demo |
| U38 | **Navigation wächst ohne Halt:** aufgeklappte „Demos“ (über 30 Einträge) schieben Administration, Board, Info aus dem Blick; Klickziele verrutschen beim Aufklappen. In echten Anwendungen ähnlich bei großen Gruppen — Suche in der Navigation, Gruppen eingeklappt merken | Bestandsaufnahme 26.10. | `tl-sidebar` |
| U39 | **Nach UI-Durchgang 1, Sichtprüfung 26.10.:** (a) der Pfeil im Chip „+ n weitere“ klebt am Text; (b) im Popover „Ansicht“ sehen Titel und „Dichte“ gleich aus, der Trenner ist unsichtbar — der Inhalt (`tl-table-view-options`) hat noch keine Regel und keinen Vertrag im Paket; (c) Großbuchstaben im Kopf verbreitern die Titel, schmale Spalten kürzen stärker („STAT…“); (d) in schmalen Leisten rutscht das Lesezeichen in eine eigene Zeile; (e) Gruppenzeile und Streifen teilen `surface-layer-muted`; (f) Kante der Auswahl rollt ohne fixierte Spalte seitlich mit | Sichtprüfung 26.10. | `table.css`, `TableViewOptions.tsx`, `FilterPresets.tsx` |
| U40 | **Nach dem Final-Review UI-Durchgang 1:** (a) der Schalter im Popover „Ansicht“ trägt seine Lage über die `className` des Checkbox-Parts — vertragstreu wäre ein umgebendes `div.tl-table-view-options__switch` (`bridge/parts.ts:20–24`); (b) nach einem Server-Neustart ohne Abmelden standen Dichte und Streifen wieder auf ab Werk, nach Neuladen nicht — prüfen, ob die persönliche Konfiguration erst beim Abmelden geschrieben wird (betrifft dann auch Spaltenbreiten); (c) Seitenleiste gewählt + `:active`, Baum Ebene 0 Toggle-Hof über der Kante, dynamische Spalten ohne `align`, Fuß bei Preset + Suche, Zahnrad-Reserve an kleinen Tabellen, Home/End in der Dichte-Gruppe, `.tl-table__more` im Specimen wie in der Engine, Name „+ n weitere“ ohne „Filter“, Messung bei Kompaktbreite | Final-Review 26.10. | Ledger `.superpowers/sdd/…-tabelle/progress.md` |
| U41 | **Nach dem Merge von #29968 (27.10.):** die Presets im Menü hinter „+ n weitere“ zeigen keine Zeilenzahl — der Button-Part kennt kein `detail` (nur der Chip). Die Chips in der Zeile zeigen Zahl und CSS-Klasse; die Messung kennt beide (`shapeOf`). Entscheiden: Menüeintrag mit Detail im Part-Vertrag oder Zahl weglassen | Merge #29968 mit UI-Durchgang 1 | `FilterPresets.tsx` |
| U42 | **Häkchen nur auf Kästchen und Text klickbar:** im Popover „Ansicht“ steht der Schalter in `tl-choice` (`inline-flex`), die Klickfläche endet nach dem Text, die Einrückung der Zeile (`tl-table-view-options__switch`) und der Rest der Breite reagieren nicht, ein Hover fehlt. Regel: in Popovers und Menüs ist die ganze Zeile die Klickfläche eines Häkchens, mit Hover wie ein Menüeintrag (Mockup U27, Hendrik 02.11.) | Mockup U27, 02.11. | `components.css` `.tl-choice`, `.tl-table-view-options__switch`, `TableViewOptions.tsx` |
| U43 | **Erledigt 03.11. (`3be0a92975`).** **Zahlenspalte aus Attribut bleibt links:** in der Objektliste steht „Aufwand (h)“ (`tl.core:Long`, `<column attribute="estimate"/>` mit Options-Annotation) linksbündig, „Kommentare“ (berechnet, `tl.core:Integer`) rechts. `ColumnSetup#alignment` → `ColumnProviderService.isNumeric` greift für die Attributspalte nicht; Ursache offen | Docker !2014, 03.11. | `ColumnSetup.java`, `ColumnProviderService.java` |
| U44 | **Hover und Zebra gleich im hellen Modus:** Zebra `surface-layer-muted` #F0F4F9, Hover `surface-interactive-hover` #F0F2F6 — auf einer Zebrazeile ist der Hover unsichtbar, eine weiße Zeile im Hover sieht aus wie Zebra. Paar mit Mindestabstand ins Gate | Docker !2014, 03.11. | `table.css`, `tokens.json`, `pairs.mjs` |
| U45 | **Kleinkram Docker 03.11.:** (a) Fortschritt über der Ticket-Tabelle bleibt bei „10 / 40“, obwohl 40 erzeugt sind; (b) nach Neuladen trägt „Attribute“ in der Navigation einen Fokusring, obwohl „Objektliste“ aktiv ist; (c) Zahnrad erscheint auch anonym (Browse-Ansicht) | Docker !2014, 03.11. | `tickets.view.xml`, Seitenleiste, `TLTableView.tsx` |
| U46 | **Schwebende Tabelle kaum sichtbar:** die Form aus Mockup B (Fläche, Rundung, `shadow-1`) erscheint nur, wenn die Tabelle ihr Panel nicht füllt — in der Demo füllt jede Tabelle ihr Panel (`tl-fill`: Objektliste, Projekte), es bleibt nur der abgesetzte Kopf. Zielkonflikt: Kollegen wollen jeden Pixel für Daten (bis 200k Zeilen), Hendrik will sich vom TL7-Gefühl abheben. Kein Bau-Thema, sondern Überzeugungsarbeit; später mit Beispielen (dieselbe Ansicht schwebend und füllend nebeneinander) | Lokale Prüfung 03.11., Hendrik | `table.css` (`tl-fill`), Demo-Views |
| U47 | **Erledigt 03.11. (`a50276c967`, bis zur ersten Aggregat-Spalte).** **Gruppenwert in der Gruppenzeile gekürzt:** die Gruppenzeile zeichnet Pfeil, Kapsel und Zähler in der ersten Zelle (150 px in der Objektliste); „In Bearbeitung“ wird zu „In Bear…“, obwohl die Zeile sonst leer ist. Die Gruppenzeile sollte über die Spalten laufen | Lokale Prüfung 03.11. | `TLTableView.tsx` (Gruppenzeile), `table.css` |
| U48 | **`TLPopover` außerhalb der gemeinsamen Hülle:** #30102 legt `Menu`, `PickerPopover` und Toolbar-`MenuGroup` auf `usePopupSurface`/`usePopupTrigger` (K2); `TLPopover` (Hover-Öffnen, eigener Auslöser) baut Esc, Klick daneben, Falle und Lage weiter selbst. Prüfen, ob er die Hülle übernimmt | Plan-Review #30102, 04.11. | `TLPopover.tsx`, `bridge/popup-surface.ts` |
| U49 | **Leiser Wert der Werteliste im Hover:** ein Wert ohne Treffer bleibt `text-helper` auf der Hover-Fläche des Menüeintrags; Paar nicht im Kontrast-Gate | Task-Review #30102, 04.11. | `filter-list.css`, `pairs.mjs` |
| U50 | **Gruppenwert bei fixierten Spalten wieder gekürzt:** ist nur „Name“ fixiert, endet die Spanne der Gruppenzeile an der Fixiergrenze (Regel aus !2014, `75bf7aee41`), „In Bearbeitung“ wird „In Bear…“. Vorschlag Final-Review #30102: Zelle spannt bis zur ersten Aggregat-Zelle, das Label klebt darin (`position: sticky`, Versatz = Fixierbreite), Ellipse nur am Ende der Spanne | Lokale Sichtprüfung #30102, 04.11. | `TLTableView.tsx` (groupSpan), `table.css` |
| U51 | **Vorlagen-Chip grau, obwohl sein Filter weiter gilt:** „Diskutiert“ aktiv, dann Spaltenfilter dazu → alle Chips grau, Fuß „2 Filter aktiv“; die Vorlage wirkt unsichtbar weiter. Vorbestehend (`refreshFilterBar`). Idee: Chip bleibt als Grundlage markiert, Fuß nennt „Diskutiert + Status“ — wäre ein neuer Chip-Zustand, Entscheidung Hendrik | Lokale Sichtprüfung #30102, 04.11. (Hinweis Hendrik) | `FilterPresets.tsx`, `TableViewControl.refreshFilterBar` |
| U52 | **Regex-Werteliste „alle abgehakt“ zeigt noch Zeilen:** eine Zeile, die keinem Muster entspricht, bleibt sichtbar („1 von 1 Zeile · 1 Filter aktiv“) — folgt der Regel aus #30102 „Werte außerhalb der Liste bleiben sichtbar“, wirkt aber widersprüchlich. Idee: Eintrag „Andere“ in der Werteliste, wenn die Muster nicht alle Werte abdecken | Lokale Sichtprüfung #30102, 04.11. | `RegexpOptionsFilter`, `ReactFilterListControl`, `OptionChecks` |

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
| U17 | **Überschrift-Auslöser nennt die gültige Ebene nicht** mehr im Tooltip (vor 5d schon) | Review 5d Task 9, 20.10. | `WysiwygToolbar.tsx` |
| U18 | **Code- und Script-Editor:** CodeMirrors `defaultHighlightStyle` ist eine Fremdpalette, im Dunkelmodus etwa 2:1 — Syntaxfarben aus Rollen; Nur-Lese-Editor trägt bis dahin den Feldrahmen, eine eigene Lese-Form fehlt (z. B. wie `tl-prose pre`, ohne Leerraum unter kurzem Inhalt); Doc-Popups könnten `tl-type-*` tragen statt Schriftgrößen zu lesen | Review 5d Task 11, 20.10. | `tlCodeEditor.css`, `tlScriptEditor.css` |
| U20 | **Mengenskala aus der Marke:** ein Ton hell → dunkel für Heatmaps und Stufen; heute braucht sie kein Diagramm (Chart.js ohne Heatmap-Plugin) | Spec Diagrammfarben, 22.10. | `docs/superpowers/specs/2026-10-22-diagrammfarben-design.md` |
| U21 | **Hervorheben:** alle Reihen grau, eine in Farbe (NN/g „Highlighter“); braucht eine Aussage des Servers, welche Reihe zählt | Spec Diagrammfarben, 22.10. | `docs/superpowers/specs/2026-10-22-diagrammfarben-design.md` |
| U22 | **Fuge im Ring bei Serverfarben:** gibt der Server einem Ring nur `backgroundColor` mit, setzt das Theme keine Fuge, Chart.js zeichnet sie weiß — im Dunkelmodus sichtbar. Die Fuge sollte auch dann aus `--tl-surface-layer` kommen | Final-Review Diagrammfarben, 23.10. | `useThemeDefaults.ts`, `chart.contract.md` |
| U23 | **Kalender: „+“ und Ablage wie im macOS-Kalender.** Ein „+“-Knopf in der Leiste legt einen Termin von Hand an, ohne Ziehen über freie Zeit; daneben eine Ablage (Eingang) für neue Termine, die z. B. in geteilten Kalendern hinzukommen. Die Ablage braucht eine Aussage des Servers, was für die Person neu ist | Sichtprüfung Hendrik, 23.10. | `TLCalendar.tsx`, `calendar.contract.md` |
| U24 | **Gantt und Flow-Diagramm aus dem Paket:** Seit 23.10. kommen nur Zeilenköpfe, Zeitachse und Ecke aus Rollen (CSS über `#ffffff` des Modells, der PDF-Export bleibt weiß); die Balken der Demo sind Pastell-Literale mit schwarzem SVG-Text, Raster und Zeilen neutrales Grau mit Alpha. Offen: Balkenfarben aus den Kategorien (`category-N-*`, Text gerechnet), Vorgaben in `GanttLayoutOperations` (`#606060`, `rgba(100,100,100,0.2)`) und `FlowFactory` (`gray`, `black`) als Rollen, PDF-Export mit aufgelösten Rollen statt `var()` (Batik), Zoom-Anzeige `surface-inverse` prüfen. Hendrik 23.10.: keine großen Eingriffe; nativer Neubau von Gantt und Flow als eigenes Projekt zur Diskussion (STATUS „Offene Fäden“) | Sichtprüfung Hendrik, 23.10. | `tl-react-flow.css`, `GanttLayoutOperations.java`, `gantt-demo.view.xml` |

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
