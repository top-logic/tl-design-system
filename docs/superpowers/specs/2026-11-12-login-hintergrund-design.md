# Login-Hintergrund: Halbton-Raster mit Logo, Wellen und Easter Egg

Stand 12.11.2026, mit Hendrik im Brainstorming entschieden. Vorschau der entschiedenen Fassung:
`.superpowers/brainstorm/14150-1794476958/content/login-einstieg.html` (Canvas-Skizze, kein Produktcode).
Ticket: neu anzulegen (eigener PR, nicht #30281).

## Wozu

Die Login-Seite ist der erste Eindruck jeder TopLogic-8-Anwendung. Seit #30281 steht die Karte mittig, aber auf
einer leeren, flachen Fläche — die Seite wirkt trist. Ziel: ein Hintergrund, der lebendig und hochwertig wirkt, beim
Anmelden nicht stört und sich jedem Kunden anpasst. „Nur eine Login-Seite“ heißt nicht, weniger als das Maximum
herauszuholen (Hendrik).

## Ziele

- Ein **Halbton-Raster** hinter der Karte: gerades, quadratisches Raster; die Punkte sind in der Mitte am größten
  und werden nach außen kleiner, bis sie zum Rand hin auslaufen (Referenz: klassisches Halbton-Muster, flach —
  ausdrücklich **keine** Kugelprojektion).
- **Farbe aus der Hausfarbe**: Ein Kunde mit eigenem Theme (Kundenstufe A, `derive`) bekommt das Raster in seiner
  Hausfarbe, ohne Zusatzarbeit. Hell und dunkel aus demselben Farbton.
- **Logo** über der Karte: App-, Kunden- oder TopLogic-Logo.
- **Ruhig, bis man etwas tut** — Interaktion siehe unten.
- **Easter Egg**: Formwechsel der Punkte.
- **Einstieg**: Nach erfolgreicher Anmeldung löscht eine Welle das Raster von innen nach außen, dann erscheint die App.

## Nicht-Ziele

- Keine Animation im Ruhezustand (kein Atmen, Wandern, Pulsieren).
- Kein sichtbares Bedienelement für die Spielerei (kein Formen-Dropdown) — Hendrik hat ein Dropdown erwogen, entschieden
  ist das versteckte Easter Egg.
- Keine Bilddatei als Hintergrund, die von Hand gepflegt wird.
- Kein Umbau des Login-Formulars selbst (`login-form.view.xml` bleibt, wie es ist).

## Anti-Ziele (wäre ein Fehlschlag, auch wenn es läuft)

- Das Raster konkurriert mit der Karte: Felder, Beschriftungen oder der Anmelde-Knopf werden schlechter lesbar.
- Eine Farbe, die nicht aus dem Theme kommt (Fremdpalette, Literal) — ein Kundentheme sähe dann TopLogic-blau.
- Bewegung für Menschen, die im System „Bewegung reduzieren“ eingestellt haben.
- Die Anmeldung wird langsamer oder hängt an der Animation (ein Fehler in der Animation darf den Login nie blockieren).

## Aussehen

- Raster: Abstand etwa 14 px; größter Punktradius etwa 4,6 px in der Mitte; Größe fällt mit der Entfernung zur Mitte
  ab (Skizze: `r = rmax · (1 − d)^1,3`, `d` = Abstand / halbe Bilddiagonale); Punkte unter etwa 0,35 px entfallen.
  Die Mitte des Rasters ist die Mitte des Fensters (hinter der Karte).
- Deckkraft: zurückhaltend — Skizze dunkel 45 %, hell 38 % auf der Hausfarbe. Endgültige Werte so, dass die
  Karte klar vorne liegt; im Hellen und Dunkeln mit Augen prüfen.
- Logo: über der Karte, mittig, mit Abstand zur Karte (Skizze: 14 px). Karte und Logo zusammen stehen mittig im
  Fenster (wie heute die Karte über `<stack fill justify=center>`, #30281).
- Schmale Bildschirme: das Raster bleibt, gleiche Punktgröße, nur der Ausschnitt ist kleiner.

## Verhalten

| Auslöser | Wirkung |
|---|---|
| Ruhezustand | nichts bewegt sich; kein Neuzeichnen ohne Anlass |
| Mauszeiger über dem Hintergrund | **Highlight**: Punkte im Umkreis von etwa **40 px** um den Zeiger werden leicht größer und kräftiger (weich auslaufend, Skizze: Gauß über 40 px, +0,8 px Radius, +14 % Deckkraft). Sehr subtil. Verlässt der Zeiger die Fläche, klingt es aus |
| Klick auf den Hintergrund (nicht auf Karte, Logo oder Link) | **Welle** vom Klickpunkt nach außen: an der Front schwellen die Punkte kurz an, die Welle klingt dabei aus (Skizze: 1,8 s) |
| jeder **5.** Klick auf den Hintergrund | **Easter Egg**: die Form der Punkte wechselt **Punkt → Plus → Quadrat → Punkt** … Übergang als kurzes Überblenden (Skizze: 0,7 s). Nach dem Neuladen wieder Punkt; nichts wird gespeichert |
| erfolgreiche Anmeldung | **Einstieg**: Welle von der Mitte, an der Front schwellen die Punkte an, **hinter der Front verschwinden sie**; die Karte blendet aus; ist das Raster leer, erscheint die App (Skizze: Welle 1,1 s, App nach etwa 1 s) |
| Anmeldung scheitert | keine Welle; das Formular zeigt seinen Fehler wie heute |
| `prefers-reduced-motion: reduce` | stehendes Raster; kein Highlight, keine Wellen; Easter Egg wechselt die Form ohne Überblenden; Einstieg ohne Welle (sofort in die App) |

Formen (Größe aus demselben Radius `r`): Punkt = Kreis `r`; Plus = zwei Balken, Länge `2,6 r`, Stärke `max(0,7 px, 0,5 r)`;
Quadrat = Kantenlänge `1,8 r`. Ein Ring wurde verworfen (fällt aus der Reihe der geschlossenen Formen), ebenso Dreieck
(wirkt gerichtet), Raute und Strich.

## Einsatz und Schnitt

- **Zuerst nur die Demo** (`demo-login-page.view.xml`), damit die Kollegen es dort sehen und freigeben. Die Login-Seite
  des Frameworks (`login-page.view.xml`) bleibt vorerst unverändert.
- **Gebaut wird es aber vollwertig im Paket und in der Engine**, nicht als Demo-Code: nach der Freigabe genügt eine
  Zeile in `login-page.view.xml`, und jede TL-8-Anwendung hat es. Dafür umschließt der neue Baustein Logo und Karte.
- **Zwei PRs** (Entscheidung nach dem Gegenlesen, Hendrik folgt dem Vorschlag):
  - **PR 1:** Raster, Logo, Highlight, Klick-Welle, Easter Egg. Kein Eingriff in den Login-Ablauf.
  - **PR 2:** Einstieg nach erfolgreicher Anmeldung. Vorher Abstimmung mit Bernhard über das Signal (siehe
    Stolpersteine).
- **Basis** (meine Entscheidung): PR 1 setzt auf #30281 auf (mittiges Layout, `<stack fill>`, neu gefasste
  `demo-login-page.view.xml`) — zwei Ebenen, im Rahmen der Kettenregel. PR 2 auf PR 1.
- Eigenes Ticket je PR, Label `design-system`; Sichtprüfung auf der Docker-Instanz des PR.

## Logo

- Option am neuen Baustein: eine Bildreferenz, optional eine zweite für den dunklen Modus.
- **Ohne Angabe kein Logo** (meine Entscheidung; ein TopLogic-Logo auf der Login-Seite eines Kunden wäre oft
  unerwünscht). Die Demo setzt ausdrücklich das TopLogic-Logo (vorhanden u. a. `com.top_logic.layout.icons/icons/logo-tl-big.svg`).

## Einstieg: welche Anmeldewege (meine Entscheidung)

- Die Welle läuft erst, wenn die Anmeldung **ganz** abgeschlossen ist — nach zweitem Faktor
  (`SecondFactorLoginStep`), Passwortwechsel (`ChangePasswordStep`) und Login-Meldungen (`loginmessages`). Solange ein
  solcher Schritt-Dialog offen ist, bleibt die Karte stehen.
- Keine Welle nach Rückkehr von SSO (Weiterleitung, `login-methods`), nicht mit `LANDING_PAGE`, nicht im
  Login-Dialog innerhalb einer laufenden App (`login.view.xml`).

## Vorgaben aus dem Design System (gelten unverändert)

- Farben nur über Tokens; `tokens.json` trägt nur Referenzen auf Primitive. Für die Punktfarbe gibt es heute keine
  passende Rolle — eine neue Rolle in der Kategorie `surface` ist nötig, je Modus aus der Markenfarbe; `derive` muss sie
  für Kundenthemes mitrechnen. Sie ist Dekoration, kein Text: nicht in die Kontrast-Paarliste.
- Dauern und Kurven nur über Tokens (`duration-*`, `easing-*`); fehlende Dauern als Primitive anlegen.
- Der Client liest die Farbe zur Laufzeit aus dem Theme (berechneter Wert der Rolle), damit Moduswechsel und
  Kundentheme ohne eigenen Code wirken.
- Klassen- und Lint-Gate des Pakets, Vertrag (`*.contract.md`) und Specimen-Seite für den neuen Baustein, Tests der
  Regeln; Demo-Ansicht ist die Demo-Login-Seite.
- Englische Namen, Präfix `tl` (Klassen `tl-…`, Zustände als Attribute).

## Bekannte Stolpersteine (aus der Erkundung)

- **Die Anmeldung lädt die Seite neu.** Erfolg und Fehler entscheidet `LoginFlow.complete()`: bei Fehler
  `LOGIN_FAILED` (das Formular zeigt die Meldung), bei Erfolg direkt `ReactWindowRegistry#rebuildWindow`
  (`LoginFlow.java:326`; mit `LANDING_PAGE` stattdessen ein `PageNavigationEvent`). Ein eigenes Erfolgssignal gibt es
  nicht. Vorschlag für PR 2: der Neuaufbau trägt einen Hinweis „nach Anmeldung“; der Client spielt die Welle
  (höchstens etwa 1 s) und baut dann neu auf; bei Fehler, Zeitüberschreitung oder verdecktem Tab sofort. Der Einstieg
  darf den Login nie verhindern. Die Form des Signals stimmt Bernhard ab, bevor PR 2 geplant wird.
- **Es gibt heute keine Logo-Option** für die Login-Seite; die Demo trägt im App-Kopf nur den Text „TL Demo“.
  Vorhandene Grafiken: `com.top_logic.layout.icons/icons/logo-tl-big.svg`, `com.top_logic/src/main/webapp/images/appLogo.svg`
  u. a. Entschieden: Option am Baustein (siehe „Logo“).
- Der neue Baustein ist eine Erweiterung der View-Sprache (wie `<stack fill>` in #30281) — Bernhard prüft solche
  Ergänzungen genau.

## Dem Bauenden überlassen

- Technik der Darstellung (Canvas, SVG, CSS) — Bedingung: Farbe aus dem Theme, Wellen und Highlight flüssig, im
  Ruhezustand keine Last.
- Name und Schnitt des Bausteins (eigenes View-Element, Option an `<inset>`/`<stack>` o. Ä.) und der neuen Rolle.
- Genaue Kurven und Feinabstimmung der Werte oben, solange der Eindruck der Skizze erhalten bleibt.
