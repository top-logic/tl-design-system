# Felder in der bearbeiteten Tabellenzeile (#30383)

Stand 17.11.2026, mit Hendrik an einer Demo entschieden (Paket-CSS von master, Zebra aus !2226 nachgebildet, jede
Variante im Browser gemessen). Entscheidung und Verworfenes: `docs/skalen.md` „Felder in der bearbeiteten
Tabellenzeile (17.11., #30383)“. Ticket #30383 (Meldung tri, Hendrik zugeteilt). Branch
`CWS/CWS_30383_row_edit_fields`, zwei PRs.

## Wozu

In einer Tabelle mit `row-edit` sind die Felder der bearbeiteten Zeile randlos und durchsichtig; eine Linie von 1 px
unten fällt auf die Trennlinie der Zeile und ist praktisch unsichtbar. Wer unter `row-edit="SELECTED"` eine Zeile
wählt, sieht nicht, welche Zellen jetzt Felder sind und welche nur lesend bleiben, und eine Pflichtspalte ist
nirgends gekennzeichnet — dass ein Wert fehlt, erfährt man erst beim Speichern.

## Ziele

- Ein Feld in der Zeile ist **ohne Klick** als Feld zu erkennen, hell und dunkel, auf weißer, Zebra-, gezeigter und
  gewählter Zeile.
- Die Zeile **springt nicht**: gleiche Höhe und gleiche Textposition beim Lesen und beim Bearbeiten, in beiden Dichten,
  mit `SELECTED` und `ALL`.
- Die Auswahl sieht aus wie beim Lesen; der **Fokus ist eindeutig** (das Blau gehört Auswahl und Ring).
- Eine Pflichtspalte ist **vor** dem ersten Fehler zu erkennen.

## Nicht-Ziele

- Kein Zeichen für Pflicht, die je Zeile wechselt (dynamische Pflicht). In Reserve: Stern als Platzhalter im leeren
  Pflichtfeld (Demo B3).
- Kein Umbau von Zeilenhöhe, Dichte oder Formularfeld.
- Der unsichtbare Hover auf Zebrazeilen ist U85 und gehört zu !2226 (#30236), nicht hierher.

## Anti-Ziele (Fehlschlag, auch wenn es läuft)

- Eine bearbeitete Zeile ist höher als eine gelesene, oder der Text rückt beim Wechsel.
- Ein Rahmen verfehlt 3:1 auf irgendeiner Zeilenfläche (WCAG 1.4.11).
- Fokusring und Feldrahmen haben auf derselben Zeile dieselbe Farbe.
- Ein Wert außerhalb der Tokens oder eine Klasse für einen Zustand.

## PR 1: das Feld in der Zelle (Paket, `table.css`, Primitive)

### Aussehen

| Was | Wert | Gemessen |
|---|---|---|
| Feldfläche | `surface-field` (wie im Formular) | trägt nicht: 1,00–1,14 zur Zeile |
| Rahmen in Ruhe | voll, `border-width-sm` in `border-control`, `radius-sm` | hell 3,42 weiß / 3,10 Zebra; dunkel 3,69 / 3,29 |
| Rahmen auf gezeigter und gewählter Zeile | `border-emphasis` | siehe Primitive unten |
| Feldhöhe | `size-control` − `space-2xs` | 28 px normal, 24 px kompakt |
| Abstand oben | `space-2xs` − `border-width-sm` | 3 px; unten bleiben 4 px über der Trennlinie |
| Abstand seitlich | `space-2xs` | |
| Innenabstand des Felds | `space-control-x` − `space-2xs` | Text pixelgenau wie beim Lesen (386/586/736/886 px gemessen) |
| Fehler, Warnung | Rahmen `border-width-md` wie heute, gewinnt | 3,39–4,81 auf allen Flächen |
| Lesezelle (berechnet, ohne Recht) | Text wie beim Lesen, kein Kästchen | |

Die 3 px oben halten, solange `size-row` genau eine Rasterstufe über `size-control` liegt (normal 36/32, kompakt
32/28). Ein Test schreibt das fest (unten).

**Warum eine feste Höhe:** Heute steht `.tl-table__cell .tl-field { height: 100% }`. Die Höhe der Zelle ist nicht fest
(Flex-Element einer Zeile mit `min-height`), die Prozentangabe greift nicht; in der Demo blieb das Feld bei seinen
natürlichen 30 px und jede bearbeitete Zeile wuchs um 3 px. Die feste Höhe sitzt am direkten Kind der Zelle (das Feld
oder seine Hülle — `TLChild`, `tl-field-group`), das Feld darin behält `height: 100%`.

### Regeln (Entwurf, gegen das echte DOM im Plan-Review zu prüfen)

Ersetzt den Block „Ein Feld, in das man schreiben kann, zeigt sich durch eine Linie unten …“ in `table.css` und passt
die beiden Regeln davor an:

```css
.tl-table__cell:has(.tl-field) {
  padding: calc(var(--tl-space-2xs) - var(--tl-border-width-sm)) var(--tl-space-2xs) 0;
  align-items: flex-start;
}
.tl-table__cell:has(.tl-field) > * {
  height: calc(var(--tl-size-control) - var(--tl-space-2xs));
}
.tl-table__cell .tl-field {
  height: 100%;
  min-height: 0;
  border: 0;
  border-radius: var(--tl-radius-sm);
  background: var(--tl-surface-field);
  padding-inline: calc(var(--tl-space-control-x) - var(--tl-space-2xs));
}
.tl-table__cell .tl-field:not(:disabled, [readonly]) {
  box-shadow: inset 0 0 0 var(--tl-border-width-sm) var(--tl-border-control);
}
:where(.tl-table__row:hover, .tl-table__row[aria-selected="true"]) .tl-table__cell .tl-field:not(:disabled, [readonly]) {
  box-shadow: inset 0 0 0 var(--tl-border-width-sm) var(--tl-border-emphasis);
}
/* Warnung und Fehler danach, unverändert */
```

Ein Feld mit `disabled` oder `readonly` in der Zeile bleibt ohne Fläche und Rahmen (`background: transparent`), wie
eine Lesezelle. Im Plan zu klären, mit Blick ins DOM:

- welches Element direktes Kind der Zelle ist (Text, Datum, Auswahl, Zahl, Baumspalte, Kästchen, mehrzeiliger Text);
- die Baumspalte (`.tl-table__cell:has(> .tl-table__tree)` setzt `padding-inline-start`) — das Feld nach dem Toggle;
- das Feld mit Marke (`.tl-table__cell:has(> .tl-form-field--compact > .tl-form-field__marker)`, `padding-inline-end`);
- Kästchen und Schalter in der Zelle: sie sind keine `.tl-field` und bleiben, wie sie sind.

### Primitive: `border-emphasis` dunkel `gray-39` → `gray-36` (entschieden 17.11.)

Mit `gray-39` hält `border-emphasis` dunkel auf der gezeigten Zeile 2,98 und auf der gezeigten Zebrazeile
(`surface-interactive-strong`, U85) 2,80. `gray-36` ist die kleinste **vorhandene** Stufe, die alle Zeilenflächen
trägt (die neue Stufe `gray-37` hielte strong nur mit 3,08):

| dunkel, Rahmen auf … | `gray-39` heute | `gray-36` |
|---|---|---|
| `surface-interactive-hover` | 2,98 | 3,37 |
| `surface-interactive-strong` | 2,80 | 3,16 |
| `surface-selected` | 3,78 | 4,27 |
| `surface-selected-hover` | 3,48 | 3,93 |
| `surface-layer` / `surface-base` | 4,24 / 4,61 | 4,79 / 5,20 |
| Abstand zu `border-control` (`gray-43`) | 1,15 | 1,30 |

Hell bleibt `gray-45` (auf denselben Flächen 3,82–4,83). Die Ordnung „Hervorhebung heller als Control-Rahmen“
(`skalen.md`, Neutrale) bleibt und wird deutlicher. `gray-39` hat danach keinen Leser und fällt aus
`primitives.json` (Präzedenz `gray-35`, das Gate „keine Primitive ohne Leser“ verlangt es).

**Reichweite:** `border-emphasis` lesen `field.css` (Rahmen beim Zeigen), `choice.css`, `table.css` (Kopf-Unterkante,
Kante fixierter Spalten) und `tl-react-flow.css` — zehn Stellen im Paket, eine außerhalb. Dunkel werden sie eine
Stufe heller. Nach der Regel „Globale Regel erst über alle Views prüfen“ vor dem Push im Dunkelmodus über alle Module
ansehen.

**Kundenthemes:** Die vier neuen Paare (unten) gelten auch für `derive`. Ein neu gerechnetes Kundentheme kann
dadurch ein helleres `border-emphasis` bekommen (nachgeführt, im Bericht genannt); ein schon ausgeliefertes
`<theme>.theme.css` ändert sich nicht, bis es neu gerechnet wird — dieselbe offene Frage wie in Trac #29909
(Lebenszyklus Kundentheme). In den PR-Text und an Trac #30383.

**Probelauf** in einer Kopie von `tl-design-system` (master): Token geändert, `gray-39` entfernt, Probe-Theme neu
gerechnet, Paarliste ergänzt — `npm test` zeigt dieselben roten Fälle wie ohne Änderung (nur Tests, die das
Engine-Repo brauchen und in der Kopie fehlen), `lint-css` grün.

### Gates und Tests

- **Paarliste** (`tools/lib/pairs.mjs`): `border-emphasis` gegen `surface-selected`, `surface-selected-hover`,
  `surface-interactive-hover`, `surface-interactive-strong`, Schwelle 3,0. Gilt auch für `derive`: ein Kundentheme,
  das sie verfehlt, wird nachgeführt oder gemeldet. `specimen/probe.theme.css` neu erzeugen.
- **`table.test.mjs`**: Regeln wie oben (Höhe aus `size-control` und `space-2xs`, Abstand oben aus `space-2xs` und
  `border-width-sm`, Rahmen `border-control` in Ruhe, `border-emphasis` auf gezeigter und gewählter Zeile, kein
  `border-interactive` an Feldern der Zelle). Die alte Erwartung „Linie unten“ fällt.
- **Rastertest** (`tokens.test.mjs`): `size-row` − `size-control` ist in beiden Dichten genau eine Rasterstufe
  (4 px) — sonst verrutscht das Feld still.
- **DOM-Gate** (`npm run test:dom`, neue Datei `row-edit.dom.test.mjs`, Specimen `table.spec.html` um eine
  bearbeitete Zeile erweitern): Zeile mit Feldern so hoch wie ohne, Feld 28/24 px, oben 3 px, Textanfang wie in der
  Lesezelle — normal und kompakt.
- `lint-css` grün; der Vertrag `table.contract.md` nennt die neuen Tokens.

### Prüfung an der laufenden Instanz

Lokale Demo (`tl-demo-react`), eine Tabelle mit `row-edit="SELECTED"` und eine mit `ALL` in einem Formular, mit
Text-, Datums-, Auswahl-, Zahl- und berechneter Spalte und einer Baumtabelle. Soll-Liste aus der Tabelle oben, hell
und dunkel, normal und kompakt; Fokus per Tab durch die gewählte Zeile. Danach alle Views im Dunkelmodus wegen
`border-emphasis`. Sichtbare Änderung — **kein** `NoPreview` am Ticket.

## PR 2: Pflicht im Spaltenkopf (Engine)

- **Server:** `ColumnView` (`com.top_logic/…/table/ColumnView.java`) bekommt `required`. Gesetzt, wo heute die
  Ausrichtung aus dem Attribut kommt (`ColumnProviderService`, `ColumnSetup`): `true`, wenn die Spalte ein Attribut
  zeigt und `TLStructuredTypePart.isMandatory()` gilt — und nur in einer Tabelle, die bearbeitet wird
  (`row-edit`; beim Lesen zeigt das Formular den Stern auch nicht, `TLFormField.tsx:97`). `TableViewControl.columnsState()`
  gibt es als `required` an den Client; `RowSetTableControl` reicht es durch.
- **Client:** `TLTableView.tsx` setzt im Kopf nach dem Titel `<span class="tl-table__required" aria-hidden="true">*</span>`.
  Neue Klasse im Paket: Farbe `status-error-text` wie `tl-form-field__required`; Kontrast auf `surface-layer-muted`
  in die Paarliste.
- **Barrierefrei:** Das Feld in der Zelle trägt `aria-required` — prüfen, ob `fieldStateAttrs` es für Felder in der
  Zelle schon setzt (`AttributeFieldModel.setMandatory`), sonst ergänzen. Der Stern bleibt `aria-hidden` wie im Formular.
- **Tests:** Java-Test, dass `columnsState` `required` für eine Pflichtspalte setzt und für eine berechnete nicht;
  Vitest für den Stern im Kopf. JavaDoc → `tools/check-messages-en.sh` vor jedem Push.
- Zu klären im Plan: Spaltengruppen und Spalten, die ein Attribut eines verbundenen Objekts zeigen (!1487), und ob
  `required` in `state.proto` gehört (U78).

## Reihenfolge und Fertig-Bedingung

1. Plan zu PR 1, Plan-Review durch frischen Agenten (Opus) gegen Gates und DOM.
2. PR 1 umsetzen: Gates grün (`npm test`, `npm run test:dom`, `lint-css`), Sichtprüfung lokal, Prüfung aller Views
   dunkel. Fertig, wenn die Soll-Liste an der Instanz stimmt und Hendrik den Push freigibt.
3. Plan zu PR 2, Plan-Review, Umsetzung; `check-messages-en.sh` grün. PR 2 baut auf PR 1 (Kette höchstens zwei).
4. Beide PRs: Label `design-system`, Reviewer `bhu`, Trac-Keyword `design-system`.
