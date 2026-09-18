# Das Design System, kurz erklärt

Was wir mit dem Paket `tl-design-system` erreichen wollen, welche Regeln gelten, wie wir in Wellen
dahin kommen, wo wir stehen, und was das für TL Views bedeutet. Trac #29617.

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
Stellen gebraucht und die vergessene fünfte wäre der Fehler gewesen. Jetzt überschreibt ein Kunde
`--tl-blue-49`, und alle Markenrollen ziehen mit. Ein Test spielt genau diesen Tausch durch.

**Der Kundenvertrag in drei Stufen**

- **A · Primitive.** Der Kunde liefert Hausfarbe, Grau-Temperatur, Schrift, Radius. Ein Werkzeug
  rechnet die Rampen, Beschriftungen auf Flächen werden immer abgeleitet, das Kontrast-Gate prüft
  das Ergebnis.
- **B · Rollen.** Ein `customer.tokens.css` nach unserem `tokens.css`. Der Kunde trägt die Rechnung
  selbst, das Gate prüft trotzdem.
- **C · Eigene Komponenten.** Je Komponente ein Vertrag (`button.contract.md`): Zustand vom Server,
  Aktionen, Tokens, Attribute für Tastatur und Fokus. TopLogic garantiert Funktion, nicht Aussehen.

In allen Stufen gilt: Der Kunde fasst kein TopLogic-CSS an. Er legt Dateien daneben, und ein Update
ändert seine Dateien nicht.

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
| 1 | Button, ToggleButton, Pill, Avatar, Progress, FontIcon | Button fertig, PR offen |
| 2 | Felder, Checkbox, BooleanChoice, DropdownSelect, FormField, FormGroup, FormLayout, dazu Chips, Segmented, Slider, Switch | geplant |
| 3 | TableView, TreeView, Menu, Toolbar, TabBar, Breadcrumb, Tooltip | geplant |
| 4 | Dialog, Window, Drawer, Snackbar, NoticeBar, Shell, Layoutcontainer, Übergangszustände | geplant |
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
| Übergangs-Zustandsklassen (Phase 6) | `data-tl-state="opening|closing"` statt Klassen, Dauern und Kurven aus den Motion-Tokens. Mit Welle 4. |
| `<color token>` validieren (#29606) | Der `DesignTokenService` als Naht ist richtig. Bitte vokabular-neutral bauen (Art plus Namen aus einem Provider), damit die Pill in Welle 1 unsere Rollen anbietet statt `support-*`. Kein neues `support-info`, `status-info-*` existiert bereits. Sonst landet das alte Vokabular in Kundenmodellen, und jede Welle, die ein altes Token löscht, bricht sie. |
| Namensraum `--tl` | `--tl-item-index` und `--tlGrid-gap` aus #29597 stehen auf der Einfang-Liste; sie werden in Welle 4 zu Tokens oder umbenannt. Neues bitte ohne `--tl`-Präfix, sonst schlägt die Ratsche an. |

## 6 · Wo alles liegt

| | |
|---|---|
| Paket | Gitea `hpe/tl-design-system`, Ordner `design-system/`; `node --test`, `node tools/generate.mjs`, `node tools/lint-css.mjs`, `node tools/serve.mjs` für das Specimen |
| Entscheidungen | `docs/skalen.md`, jede mit Begründung; folienweise in `docs/praesentation.md` |
| Spec | `docs/superpowers/specs/2026-09-17-design-system-neuaufbau-design.md` |
| Arbeitsliste | `docs/migration/altlast.md`: alte Tokens → neue, Befunde aus der laufenden App je Welle, Einfang-Liste |
| Ticket | Trac #29617, ein Branch je Welle: `CWS/CWS_29617_design_system_welle_<n>` |
| Einbindung | `com.top_logic.layout.react`: `style/tl-design-system/*.css` als `ClientResources`, `UIThemeService` setzt `data-tl-mode` und `data-tl-density` |
| Anleitung für Claude | `docs/anleitung-claude-komponenten.md`, Regeldatei `docs/claude/tl-design-system-SKILL.md` |
