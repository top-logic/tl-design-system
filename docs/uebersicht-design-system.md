# Das Design System, kurz erklärt

Was wir mit dem Paket `tl-design-system` erreichen wollen, welche Regeln gelten, wie wir in Wellen
dahin kommen, wo wir stehen, und was das für TL Views bedeutet. Tickets je Welle siehe §6.

## 1 · Der Anlass

Wer heute eine neue Maske baut, liest zuerst, wie es die bestehenden machen, und findet in den beiden
React-Stylesheets 17 Schriftgrößen, fünf Arten, einen Fokusrahmen zu zeichnen, und Farben, die
gleichzeitig Text, Rahmen und Fläche sind. Er trifft dann eine Wahl, die plausibel aussieht und eine
weitere unentschiedene Variante ist. Zunehmend ist dieser Jemand ein Sprachmodell: Es liest den
Bestand und ahmt ihn nach. Der Bestand ist damit keine Altlast mehr, sondern eine Vorlage, die sich
selbst vervielfältigt.

**Gemessen im ausgelieferten CSS**

| | Bestand |
|---|---|
| Schriftgrößen | 113 Deklarationen auf 17 Werten |
| Fokus | 5 Mechanismen für dieselbe Sache |
| Motion | 19 Übergänge, 13 Animationen, 0 Tokens |
| Eingabefelder | keines erfüllte den Rahmenkontrast 3,0 (WCAG 1.4.11) |
| Warnungstext | 2,27 statt 4,5 |

**Das wiederkehrende Muster:** Ein Token trägt mehrere Aufgaben, und die schwächste Anforderung
gewinnt. `border-subtle` trennt Tabellenzeilen *und* umrandet Felder; `support-warning` ist Text,
Rahmen, Fläche und Akzent zugleich. Drei unabhängige Fehler, eine Ursache. Deshalb ist die Antwort
eine Regel, kein korrigierter Wert.

## 2 · Das Ziel

Ein eigenes npm-Paket ohne Abhängigkeiten, gebaut mit `node`, dessen Ausgabe TopLogic als
`ClientResources` lädt.

| Datei | Inhalt |
|---|---|
| `primitives.css` | Reine Werte: `--tl-blue-49: #0B5ED7`. Die einzige Stelle mit Zahlen, und die Stelle, an der Kundenprojekte eingreifen. |
| `tokens.css` | Rollen, die nur auf Primitive zeigen: `--tl-surface-brand: var(--tl-blue-49)`. Hell, dunkel über `data-tl-mode`, Dichte über `data-tl-density`. |
| `base.css` | Reset, Typografieklassen `.tl-type-*`, Icon-Größen `.tl-icon-*`, ein Fokusring für alles, Reduced Motion, Druck. |
| `components.css` | Die Komponenten, eine nach der anderen: `.tl-button`, bald `.tl-pill` … |
| `tokens.dtcg.json` | W3C Design Tokens für Figma und Kundenwerkzeuge. |

**Zwei Schichten, und warum das mehr als Ordnung ist.** Der erste Entwurf schrieb Hex-Werte direkt an
die Rollen und reproduzierte damit den Befund: `#0B5ED7` stand viermal, ein Markenwechsel hätte vier
Stellen gebraucht und die vergessene fünfte wäre der Fehler gewesen. Jetzt schreibt ein Kunde seine
Hausfarbe in eine JSON, `derive` rechnet daraus alle Markenrollen, und ein Test spielt genau diesen
Tausch durch.

**Der Kundenvertrag in drei Stufen**

- **A · Primitive.** Der Kunde liefert Hausfarbe, Grau-Temperatur (`warm`, `neutral`, `cool`), Schrift,
  Radius in einer JSON. `node tools/derive.mjs acme.primitives.json` rechnet Hover, Active, Dunkelmodus,
  acht Kategorien, die der Marke ausweichen, und die Beschriftungen — und schreibt `acme.theme.css`:
  nur die Rollen, die von TopLogic abweichen, unter `[data-tl-theme="acme"]`. Was wir rechnen, erfüllt
  WCAG immer, notfalls um einen Helligkeitsschritt nachgeführt, mit Hinweis. Was der Kunde liefert,
  gilt, auch unter WCAG: der Befund steht im Bericht und im Dateikopf, `--strict` macht ihn zum
  Fehler. Gebaut seit 25.09.; die Engine setzt `data-tl-theme` noch nicht (Issue #16).
- **B · Rollen.** Ein `customer.tokens.css` nach unserem `tokens.css`. Der Kunde trägt die Rechnung
  selbst, das Gate prüft trotzdem.
- **C · Eigene Komponenten.** Je Komponente ein Vertrag (`button.contract.md`) in zwei Hälften: **Muss**
  (Zustand vom Server, Aktionen zurück) und **Kann** (Tokens, Attribute für Tastatur, Fokus und
  Skript-Aufzeichnung). TopLogic garantiert Funktion, nicht Aussehen; der Konformitätstest prüft das Muss
  und ist das Werkzeug des Kunden vor seinem Deploy.

In allen Stufen gilt: Der Kunde fasst kein TopLogic-CSS an. Er legt Dateien daneben, und ein Update
ändert seine Dateien nicht.

## 2a · Das Vokabular ist der Vertrag, nicht das Design

Das Design System besteht aus drei Dingen, und nur eines davon ist Gestaltung:

| | Was es ist | Wer es ändert |
|---|---|---|
| **Werte** | Primitive: `blue-49: #0B5ED7`, `size-4: 1rem` | der Kunde (Stufe A), oder Stufe B für einzelne Rollen |
| **Vokabular** | Rollen: `surface-brand`, `status-error-text`, `category-3`; Zustände: `aria-pressed`, `aria-busy`; Erscheinungen: `primary`, `ghost` | TopLogic, als Entscheidung mit Gate |
| **Komponenten** | `tl-button`, `tl-pill`, `tl-avatar` — lesen Rollen, kennen keine Werte | TopLogic; oder der Kunde (Stufe C) gegen denselben Vertrag |

**Das Vokabular ist die Schnittstelle zwischen Engine und Paket.** Die Engine sagt „dieser Wert trägt die Rolle `warning`“, „dieser Button ist `ghost`“, „dieser Balken ist `aria-busy`“ — und nichts über Farben oder Pixel. Das Paket sagt, wie `warning` aussieht, hell und dunkel, und beweist es im Gate. Ein Kundendesign (Stufe A, B oder ein ganz eigenes Paket) **implementiert dasselbe Vokabular mit anderen Werten** — genau wie eine Kundenkomponente in Stufe C denselben Zustandsvertrag mit anderem Markup implementiert. Deshalb ist die Frage „Design System *für* TopLogic oder das *einzige mögliche*?“ falsch gestellt: Das Vokabular ist für TopLogic; das Design ist austauschbar.

**Warum das Vokabular geschlossen ist und im Code steht.** Eine Rolle ist nur dann eine Zusage, wenn jemand sie einlöst: das Paket mit zwei Tokens je Modus, das Gate mit dem Kontrastbeweis, die Komponenten mit der Abbildung Rolle → Klasse, das Specimen und die Doku. Eine Rolle, die eine Anwendung per Konfiguration hinzufügt, hat nichts davon — sie ist ein Wort ohne Deckung, und in der Oberfläche eine Farbe, die keinem Modus folgt und durch kein Gate ging. Das ist die *zweite Wahrheit*, die das Design System abstellt (§1). Deshalb stehen Rollen als Enum in der Engine und als Tokens im Paket, und ein Test hält beide Listen deckungsgleich. Eine neue Rolle ist eine Entscheidung von TopLogic: Tokens, Gate, Specimen, Vertrag — an einer Stelle, für alle Leser zugleich.

![Dreizehn Farbtöne auf dem Kreis mit ihren Abständen](https://git.top-logic.com/TopLogic/tl-design-system/raw/branch/main/docs/bilder/farbkreis-13.svg)

**Die acht Kategorien sind gerechnet, nicht gewählt.** Dreizehn getönte Flächen (Marke, vier Bedeutungen, acht Kategorien) teilen sich 360° Farbton; die Kategorien halten 20° zueinander und zu jeder Bedeutung, damit keine an Fehlerrot oder Erfolgsgrün erinnert. Eine neunte hat keinen Platz mehr.

**Warum acht genug sind.** Eine Kategorie ist ein Farbtopf, in den die Anwendung ihre eigenen Werte legt: Ein Enum `Fachbereich` mit zwölf Werten bekommt je Wert `<color role="category-N"/>`, und bei acht Töpfen teilen sich einige Werte einen. Das ist in Ordnung, weil auf der Pille der Name steht — man liest „Vertrieb“, nicht „blau“. Zwölf oder zwanzig Töpfe würden das Auge überfordern und beim nächsten Kunden wieder nicht reichen. Darum darf Farbe nie das Einzige sein, woran man einen Wert erkennt (WCAG 1.4.1); sie hilft beim Wiedererkennen, sie identifiziert nicht. Pill, Avatar und die Diagramme der Welle 5 lesen dieselben acht Töpfe, ein Wert sieht überall gleich aus.

**Und wenn ein Kunde eine eigene Marke mitbringt?** Dann wandert der Punkt „Marke“ auf dem Kreis, und das Tool der Stufe A (`tl-ds derive`) muss die acht Kategorien um ihn herum neu verteilen — die vier Bedeutungen bleiben, wo sie sind, weil Rot, Gelb, Grün und Cyan ihre Bedeutung aus dem Farbton beziehen. Das Gate prüft danach dieselben Abstände wie bei uns. Eine Marke, die auf einer Bedeutung liegt (ein rotes Logo), meldet das Gate; der Kunde entscheidet dann in Stufe B, ob seine Fehlerfarbe ein anderes Rot wird. So gebaut in `derive` (25.09.): die Lücken zwischen den festen Tönen bekommen reihum den nächsten Punkt, immer die Lücke mit dem größten verbleibenden Abstand; reicht der Kreis nicht für 20°, sinkt der Abstand in 2°-Schritten, und das steht als Hinweis im Bericht. Das Grau bleibt dabei auf unseren 28 Helligkeiten und wechselt nur den Ton — warm 70°, kühl 250°, neutral ohne Chroma.

**Dynamisch heißt: eine Rolle wählen.** `x -> if($x.overdue, 'error', 'category-3')` ist dynamisch und bleibt im Vokabular. Ein Ausdruck, der einen Hex-Wert liefert, verlässt es — und mit ihm Dunkelmodus, Kontrast und Kundenstufe A, die den Wert nie zu sehen bekommt.

## 2b · Drei Kacheln, und was der Kunde mitbringt, entscheidet

| | **TopLogic mit eigener Marke** | **TopLogic mit eigenen Komponenten** | **Eigenes Frontend, headless** |
|---|---|---|---|
| Der Kunde bringt | seine Marke: eine JSON (Stufe A, B) | seine Komponentenbibliothek — MBUI, MUI, was er will (Stufe C) | sein Frontend |
| Oberfläche | TopLogic | TopLogic, Komponenten vom Kunden | vom Kunden, über REST/OpenAPI |
| Wir garantieren | alles: Aussehen, Funktion, Gate | Funktion über den Vertrag; Aussehen ist seins | die API |
| Komplexität beim Kunden | klein | mittel | groß |

Komplexität steigt von links nach rechts, Garantie sinkt von links nach rechts, und jede Kachel hat
genau einen Vertrag. Die Kachel wählt, was der Kunde mitbringt, nicht, was er will: nichts oder eine
Marke, dann links; eine Komponentenbibliothek, dann Mitte; ein Frontend-Team mit eigenem Stack, dann
rechts. Links ist der Regelfall.

**Die Mitte ist der Shell-Weg mit fremder Bibliothek.** Der Kunde hält den Draht-Teil der Verträge
ein: welcher Zustand kommt, welche Kommandos zurückgehen, wie Dialoge den Stapel bedienen. Aussehen,
CSS und Bibliothek sind frei. Dafür bekommt er Layouts, Formulare, Dialoge, Validierung, Rechte,
Skript-Tests und Theming vom Server, und ein Framework-Update ist prüfbar: Der Konformitätstest zeigt
Brüche, bevor er ausliefert.

**Rechts endet die Garantie an der API, sie fehlt nicht.** Wer seine Konventionen behalten will,
bringt sein Frontend mit; die UI ist dann nicht unser Thema, und die API ist der Vertrag.

Einen vierten Weg — Shell nutzen, Draht ignorieren — gibt es nicht, und einen Schalter, der das
UI-System abschaltet, gibt es nicht: Er schaltete die falsche Schicht ab, wäre erst bei 77 von 77
ersetzten Controls wahr und ließe keinen Zustand übrig, den wir garantieren könnten. Die Grenze liegt
nicht zwischen flexibel und unflexibel, sondern zwischen „hat einen Vertrag“ und „hat keinen“.
Begründung in `docs/skalen.md` „Zwei Wege, kein dritter“.

**Der Vertrag der Mitte hat zwei Hälften (28.09., abgestimmt auf #29643).** Der Zustand ist die
msgbuf-Nachricht in `state.proto` — eine Quelle für Java und TypeScript, `TestControlStateSchema` prüft,
dass der Server nur sendet, was deklariert ist. Die Ersetzung läuft über `replace()` und
`registerRootWrapper()`. Was Proto nicht sagen kann, trägt der Vertrag des Pakets: welche Kommandos ein
Auslöser sendet und was bei `disabled` schweigt (Konformitätsfälle, vom Harness ausgeführt), welche Rollen
eine Ersatzkomponente liest, damit sie ins Bild passt, und welche Attribute Tastatur, Fokus und
Skript-Aufzeichnung brauchen. Der Harness prüft die Kundenseite; beides zusammen ist die Update-Garantie.
Die Marke fließt in eine Richtung — `derive` → Rollen → fremde Bibliothek (`roles-to-mui`), nie
umgekehrt —, damit Paarliste und Gate auch für die fremde Bibliothek gelten. Das Referenzprojekt lebt im
Framework neben `demo.react.corporate`. Begründung in `docs/skalen.md` „Ein Vertrag, zwei Hälften“.

## 3 · Die Regeln

| Regel | Was sie konkret heißt |
|---|---|
| Der Bestand ist kein Maßstab | Dass ein Wert 48-mal im CSS steht, belegt nur, dass niemand entschieden hat. Ablauf immer: Inventar, Befund als Muster, Entscheidung *gegen* den Befund, Regel als Test. |
| Namen | Englisch, kebab-case, Präfix `tl`: `--tl-surface-brand`, `.tl-button--primary`, `data-tl-mode`. BEM für Klassen, Modifier nur für Varianten, die der Autor wählt. |
| Geschlossene Kategorien | `surface`, `text`, `icon`, `border`, `focus`, `shadow`, `space`, `radius`, `size`, `font`, `duration`, `easing`, `layer`, `status`. Eine neue Kategorie ist eine Entscheidung, kein Nebeneffekt. |
| Zustände sind Attribute | `:disabled`, `[aria-pressed]`, `[aria-busy]`, `:focus-visible`, sonst `data-tl-state`. Eine Klasse `--active` bricht das Gate. Kundenkomponenten bekommen dieselben Zustände geschenkt. |
| Kein Literal in einer Klasse | Farben, Maße, Dauern, `z-index`, Kurven nur aus Tokens. Schriftgröße und -gewicht nur in `.tl-type-*`. Kein `:focus` ohne `-visible`, kein `outline: none`. |
| Der Namensraum `--tl` gehört dem Paket | Jede Custom Property, die so beginnt, ist Design System. Außerhalb von `dist/` wird darin nichts definiert; lesen darf der Altbestand, was das Paket definiert. Was er heute selbst darin führt (`--tl-item-index`, `--tlGrid-gap`, `--tlPill-color`, `--tl-tt-padding`), steht auf einer Einfang-Liste und wird in seiner Welle zum Token mit Kategorie oder umbenannt. Neues bricht den Test. |
| Kein Selektor von außen | Nicht `.tlToolbar .tl-button`. Der Container wählt die Erscheinung: Die Toolbar sagt `ghost`, der Dialogfuß `secondary`, über einen React-Kontext. |
| Altlast wird abgeschnitten, nicht übersetzt | Keine Aliase alter Namen, kein Übergang. Eine Komponente ist fertig, wenn ihr alter Block in `tlReactControls.css` leer ist. |

Jede Regel läuft als Test. `node --test` im Paket ist das Gate, nicht nur eine Prüfung: Kontraste
gegen die richtige Fläche in beiden Modi, das 4-px-Raster, die 12-px-Untergrenze, kein Wert in der
Rollenschicht, keine Primitive ohne Leser, der Kundentausch, das Klassen-Gate über jedes CSS,
byte-identisches `dist/`, und die Ratsche über dem alten Stylesheet.

## 4 · Wie wir es erreichen: Wellen

Welle 0 hat Paket, Tokens und Grundklassen geliefert und ist auf `master`. Danach kommt Komponente
für Komponente, jede nach demselben Rhythmus, bis `tlReactControls.css` leer ist. Die Ratsche zählt
es und lässt es nur schrumpfen.

| Welle | Komponenten | Stand |
|---|---|---|
| 0 | Paket, `primitives.css`, `tokens.css`, `base.css`, DTCG, Gates, Einbindung in die Demo-App, `data-tl-mode` und `data-tl-density` am `html` | gemerged, PR !1641 |
| 1 | Button, ToggleButton, Pill, Avatar, Progress, FontIcon | auf master (!1649, !1694, !1695) |
| 2 | Felder, Checkbox, BooleanChoice, DropdownSelect, FormField, FormGroup, FormLayout, dazu Chips, Segmented, Slider, Switch | auf master (!1740, mit 3a) |
| 3 | TableView, TreeView, Menu, Toolbar, TabBar, Breadcrumb, Tooltip | 3a Navigation und Popups auf master (!1760); 3b Daten im Review (!1838), darauf die Spaltenwahl als Ebenen-Panel (!1852) |
| 4 | Dialog, Window, Drawer, Snackbar, NoticeBar, Shell, Layoutcontainer, Übergangszustände | Konsolidierung entschieden (13.10.); 4a Overlays: Spec und Plan stehen (#29836); 4b Gerüst folgt |
| 5 | Calendar, ColorInput, IconSelect, Medien, Dashboard, dann `tlReactControls.css` löschen | geplant |

**Der Rhythmus je Komponente**

1. Varianten und Zustände *entscheiden* und in `docs/skalen.md` begründen, gegen den Befund im Bestand.
2. CSS ins Paket unter neuen Namen, nur Tokens; Gate-Regeln für die Modifier des Blocks.
3. Kontrasttest jeder Erscheinung × Zustand × Modus, gegen jede Fläche, auf der die Komponente liegen kann.
4. Specimen: alle Kombinationen auf einer Seite, hell und dunkel, normal und kompakt.
5. Vertrag für Kundenkomponenten; ein Test hält Vertrag und CSS deckungsgleich.
6. TSX auf die neuen Klassen, Zustände auf Attribute, `className` durchgereicht; Java-Enums nachgezogen.
7. Alter Block gelöscht, Ratsche nachgezogen, PR mit Bernhard als Reviewer.

**Beispiel Button.** Vorher: drei Erscheinungen, zwei kaum genutzte Größen, ein gedrückter Zustand
als Klasse, die den Primary-Stil dupliziert, fünf Kontextblöcke mit `rgba`-Literalen. Entschieden:
vier Erscheinungen (`primary`, `secondary`, `ghost`, `link`), eine Tönung `danger`, die jede
Erscheinung umfärbt, keine Größe außer `sm` für Icon-Buttons in Tabellenzeilen, Zustände als
Attribute, kein Selektor von außen. Der Kontrasttest des Buttons hat dabei vier Lücken der Welle 0
aufgedeckt, alle im Dunkelmodus auf `surface-layer`: Welle 0 hatte Status-Text, Status-Linie und
Rahmen nur gegen den Grund gemessen, Buttons liegen aber auf Panels. Die Werte wurden angehoben, die
Regel steht jetzt als Test. Genau dafür ist der Rhythmus da.

## 5 · Was das für TL Views bedeutet

Beide Systeme koexistieren, bis die letzte Welle durch ist: die alte XML-Tokenkonfiguration mit
`data-theme` und das Paket mit `data-tl-mode`. Die Koexistenz beruht auf getrennten Präfixen.

| Thema | Vorschlag |
|---|---|
| `css-class` an jedem Element (#29596, Phase 1), Layout-Optionen (Phase 3), Suchfeld (Phase 5) | Deckungsgleich mit unserem Rhythmus (`className` durchreichen). Unabhängig von den Wellen, jederzeit. |
| Text-Varianten, Ton, Pille, neue Theme-Tokens (#29596, Phase 2) | `variant` auf `.tl-type-*` abbilden, `tone` auf `--tl-text-*` und `--tl-status-*-text`, `appearance=pill` auf die Pill der Welle 1. Von den fünf neuen Tokens nur eine Display-Schrift als Primitive; Blur, Glow, Hintergrundbild bleiben App-CSS über `css-class`. Reihenfolge: nach Welle 1. |
| Chips, Segmented, Slider, Switch (Phase 4) | Das sind Komponenten der Welle 2. Im Paket bauen, nicht in `tlReactControls.css`. |
| Übergangs-Zustandsklassen (Phase 6) | **Entschieden 13.10. (Welle 4):** `data-tl-state~="entering"`/`~="exiting"` statt Klassen — die Wörter, die `useKeyedTransition` schon kennt —, Dauern und Kurven aus den Motion-Tokens; das Paket bringt eine Standardbewegung, eine Anwendung überschreibt sie. Dialog in 4a, Wizard und TileStack in 4b. |
| `<color token>` validieren (#29606) | **Überholt am 24.09. durch „Rolle statt Farbe“** (Welle 1, Pill, PR !1694): Eine Konfiguration benennt kein Token mehr, sondern eine Rolle aus dem Vokabular (§2a). Das Token-Register fällt mit seinem letzten Leser; die Rollen bietet das Enum `ValueColor` im Modell-Editor an. Begründung: `docs/skalen.md` „Pill: Rolle statt Farbe“. |
| Namensraum `--tl` | `--tl-item-index` und `--tlGrid-gap` aus #29597 stehen auf der Einfang-Liste; sie werden in Welle 4 zu Tokens oder umbenannt. Neues bitte ohne `--tl`-Präfix, sonst schlägt die Ratsche an. |

## 6 · Wo alles liegt

| | |
|---|---|
| Paket | Gitea `TopLogic/tl-design-system`, Ordner `design-system/`; `node --test`, `node tools/generate.mjs`, `node tools/lint-css.mjs`, `node tools/serve.mjs` für das Specimen |
| Entscheidungen | `docs/skalen.md`, jede mit Begründung; folienweise in `docs/praesentation.md` |
| Spec | `docs/superpowers/specs/2026-09-17-design-system-neuaufbau-design.md` |
| Arbeitsliste | `docs/migration/altlast.md`: alte Tokens → neue, Befunde aus der laufenden App je Welle, Einfang-Liste |
| Ticket | Eins je Welle: Wellen 0–3a Trac #29617 (mit alpha10 geschlossen), 3b #29821, 4a #29836; Branch `CWS/CWS_<ticket>_design_system_welle_<n>` |
| Einbindung | `com.top_logic.layout.react`: `style/tl-design-system/*.css` als `ClientResources`, `UIThemeService` setzt `data-tl-mode` und `data-tl-density` |
| Anleitung für Claude | `docs/anleitung-claude-komponenten.md`, Regeldatei `docs/claude/tl-design-system-SKILL.md` |
