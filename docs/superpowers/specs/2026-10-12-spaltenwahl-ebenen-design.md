# Spaltenwahl als Ebenen-Panel: Griff vorn, Auge und Schloss rechts

**Stand:** 2026-10-12 · Trac #29825 (Stufe 1) · Folge-Ticket für Stufe 2 (Spaltengruppen, Logik Bernhard)
**Baut auf:** Welle 3b (#29821, PR tl-engine-7!1838): `tl-reorder-list`, `useListReorder`, `SearchField`,
Spaltenwahl im Fenster mit fester Höhe; `docs/skalen.md` „Die Spaltenwahl neu“, „Ziehen sichtbar machen“ (Ein Griff
steht vorn, überall), „Knöpfe im Feld“, „Zeigen auf allen Gründen“
**Entschieden mit Hendrik (12.10.):** Sichtprüfung 3b — die Zeile der Spaltenwahl liest sich verkehrt herum, 54 Griffe
und 54 Gruppier-Icons; Griff vorn wie an der Tabellenzeile; statt Kästchen ein Auge rechtsbündig, beim Zeigen; ein
Schloss wie bei Figma-Ebenen, es **fixiert** die Spalte; ausgeblendete Spalten bleiben ausgegraut an ihrem Platz;
Spalten lassen sich zu **benannten Spaltengruppen** aufeinanderziehen (Stufe 2); das Gruppieren der **Zeilen** verlässt
den Dialog; ein Pivot (Zeilen über mehrere Ebenen gruppieren) geht als Idee an Bernhard — er kümmert sich um die Logik,
wir um das Aussehen

---

## 1 · Ziel und Abgrenzung

Die Spaltenwahl wird ein Ebenen-Panel, wie man es aus Figma kennt: eine Liste der Spalten, in der man sieht, was
sichtbar und was fixiert ist, und in der Griff, Auge und Schloss erst beim Zeigen erscheinen — eine ruhige Liste auch
bei 54 Spalten.

| Stufe | Inhalt | Wer | Ticket |
|---|---|---|---|
| **1** | Zeile = Griff · Name · Schloss · Auge; ausgeblendet am Platz; Bereich „Fixiert“; Zeilen-Gruppieren aus dem Dialog | wir (Paket, TSX, kleine Java-Änderung) | #29825 |
| **2** | Spaltengruppen: aufeinanderziehen, benennen, auf- und zuklappen, Band über den Köpfen der Tabelle | Logik Bernhard, Aussehen wir | Folge-Ticket |
| — | Pivot: Zeilen nach mehreren Spalten gruppieren | Idee an Bernhard | — |

**Fertig (Stufe 1), wenn:** der Dialog wie in §2 aussieht und sich so bedienen lässt, die Gates grün sind
(Paket, `tsc`, Vite, Maven `layout.react`, `check-messages-en`), die Sichtprüfung lokal hell und dunkel, normal und
kompakt durch ist und im Dialog kein Ebenen-Icon, kein `tl-checkbox` und kein `grouped` mehr steht.

**Nicht Ziel:** die Logik der Spaltengruppen und des Pivots (Bernhard); „Ziehen sichtbar machen“ an Tabellenzeilen
(#29826, nach !1825); die Werteliste (ihr Griff kommt mit Welle 5, siehe §6); der Fixiergriff zwischen den
Spaltenköpfen bleibt, wie er ist.

## 2 · Stufe 1: der Dialog

```
┌ Spalten ─────────────────────────── □ ✕ ┐
│ [🔍 Spalte finden                    ]   │
│ FIXIERT                                  │
│ ⠿  Name                      🔒  👁      │  ← Griff, Schloss, Auge beim Zeigen; gesetzt: dauerhaft
│ ──────────────────────────────────────── │
│ ⠿  Text                          👁      │
│    Aliasnamen                    ⊘       │  ← ausgeblendet: Name blass, Auge zu, dauerhaft
│ ⠿  Status                        👁      │
│ …                                        │
├──────────────────────────────────────────┤
│        Standard wiederherstellen  Abbrechen  Ok │
└──────────────────────────────────────────┘
```

### 2.1 Die Zeile

| Teil | Element | Sichtbar |
|---|---|---|
| Griff | `button.tl-button--icon --sm --ghost.tl-reorder-list__handle`, `ICON_HANDLE`; Ziehen mit der Maus an der ganzen Zeile, Alt + Pfeil am Griff | beim Zeigen der Zeile oder wenn ein Element der Zeile den Fokus hat |
| Name | `span.tl-reorder-list__label`, Ellipse | immer |
| Schloss | `button.tl-button--icon --sm --ghost` mit `aria-pressed`, `ICON_LOCK` / `ICON_UNLOCK` | beim Zeigen oder Fokus; **gesetzt immer** |
| Auge | `button.tl-button--icon --sm --ghost` mit `aria-pressed` (gedrückt = ausgeblendet), `ICON_VISIBLE` / `ICON_HIDDEN` | beim Zeigen oder Fokus; **ausgeblendet immer** |

Schloss und Auge stehen in `span.tl-reorder-list__actions` am rechten Ende der Zeile; ihre Plätze sind immer
reserviert, damit die Zeile beim Zeigen nicht springt. „Beim Zeigen sichtbar“ heißt `opacity`, **nicht**
`visibility` oder `display`: ein unsichtbarer Knopf bleibt mit Tab erreichbar und erscheint, sobald er den Fokus hat.

**Namen für Hilfstechnik:** Auge „{Spalte} ausblenden“ / „{Spalte} einblenden“, Schloss „{Spalte} fixieren“ /
„{Spalte} lösen“, Griff „{Spalte} verschieben“ (wie heute). `aria-pressed` sagt den Zustand; der Name sagt, was der
Klick tut.

### 2.2 Ausgeblendet

Eine ausgeblendete Spalte behält ihren Platz in der Liste. Der Eintrag trägt `data-tl-state~="off"`; der Name steht
in `--tl-text-disabled`, das Auge zu bleibt sichtbar. Die letzte sichtbare Spalte lässt sich nicht ausblenden: ihr Auge
ist `disabled` (wie heute das Kästchen), mit Tooltip „Mindestens eine Spalte bleibt sichtbar“.

### 2.3 Fixiert

- Fixierte Spalten stehen als Block oben, unter der Überschrift „Fixiert“ (`li.tl-reorder-list__section`,
  `role="presentation"`, `tl-type-label`, `--tl-text-secondary`). Eine Linie `--tl-border-separator` trennt den Block
  vom Rest. Ohne fixierte Spalte gibt es weder Überschrift noch Linie.
- **Schloss zu** stellt die Spalte ans Ende des Blocks, **Schloss auf** direkt dahinter. Ziehen über die Linie hinweg
  löst bzw. fixiert ebenso: wer in den Block zieht, fixiert, wer herauszieht, löst.
- Die Anzahl fixierter Spalten der Tabelle (`frozenColumnCount`) ist beim Übernehmen die Zahl der **sichtbaren**
  Einträge im Block. Eine ausgeblendete fixierte Spalte bleibt im Block, zählt aber nicht.
- Spalten, die die Tabelle ans Ende heftet (`pinnedEnd`), zählen nie zum Block. Stehen sie in
  `TableView.columnOptions()`, bekommen sie kein Schloss; der Plan prüft das als ersten Schritt und erweitert
  `ColumnOption` um `pinnedEnd`, falls nötig.

### 2.4 Suche, Tastatur, Ziehen

- Die Suche bleibt (ab elf Einträgen, wie heute). Bei aktiver Suche bleibt die Überschrift „Fixiert“ stehen, solange
  ein Treffer im Block liegt.
- Tab-Reihenfolge je Zeile: Griff, Schloss, Auge. Leertaste oder Enter schalten Schloss und Auge, Alt + Pfeil am Griff
  verschiebt — auch über die Grenze des Blocks, mit Ansage „{Spalte} fixiert, Position 2 von 54“ bzw. „gelöst“.
- Die Ziehen-Optik bleibt `drag.css` (Marke davor/danach). Ein Zug zwischen zwei Einträgen bleibt ein Zug zwischen
  Einträgen; „auf einen Eintrag“ gibt es erst in Stufe 2.

### 2.5 Was wegfällt

- Das Ebenen-Icon „Nach dieser Spalte gruppieren“ in jeder Zeile, der Befehl `groupBy`, der Zustand `grouped`. Zeilen
  gruppiert man weiter über das Kontextmenü am Spaltenkopf; die Marke im Kopf bleibt.
- Das Kästchen (`label.tl-choice` mit `tl-checkbox`) in der Zeile.
- „Standard wiederherstellen“ setzt die Spalten wie heute zurück, hebt die Gruppierung der Zeilen auf **und** setzt
  die Anzahl fixierter Spalten auf 0.

## 3 · Paket

`tl-reorder-list` bekommt drei Teile und einen Zustand; keine neue Komponente.

| Teil / Zustand | Regel |
|---|---|
| `tl-reorder-list__actions` | `margin-inline-start: auto`, `display: flex`, Lücke `--tl-space-2xs` |
| Beim Zeigen sichtbar | Griff und Knöpfe in `__actions` haben `opacity: 0`; `.tl-reorder-list__item:hover` und `:focus-within` setzen 1; ein gedrückter Knopf (`aria-pressed="true"`) bleibt 1. Übergang `--tl-duration-fast`, `prefers-reduced-motion` aus `base.css` |
| `[data-tl-state~="off"]` | Name `--tl-text-disabled`; das Auge bleibt sichtbar |
| `tl-reorder-list__section` | Überschrift des Bereichs: `tl-type-label`, `--tl-text-secondary`, Innenabstand wie der Eintrag, darunter keine Linie |
| Grenze des Blocks | der letzte Eintrag des Blocks trägt `data-tl-state~="section-end"`: Linie unten `--tl-border-width-sm` `--tl-border-separator` |

Die Hof- und Zeigen-Regeln der Knöpfe bleiben die von `button.css` (Ghost); die Liste liegt auf der Fensterfläche,
nicht auf der Feldfläche, „Knöpfe im Feld“ gilt hier nicht. Vertrag `reorder-list.contract.md` und Specimen ziehen
mit; das Specimen zeigt Zeigen, Fokus, ausgeblendet, fixiert und die letzte sichtbare Spalte, hell und dunkel.

**Icons** (`bridge/icons.ts`, Font Awesome wie die übrigen): `ICON_VISIBLE` `fa-eye`, `ICON_HIDDEN` `fa-eye-slash`,
`ICON_LOCK` `fa-lock`, `ICON_UNLOCK` `fa-lock-open`. `ICON_GROUP` bleibt für die Marke im Kopf.

## 4 · Engine

**`TLColumnSelect.tsx`:** rendert §2; kein `tl-choice`, kein Gruppier-Knopf; liest `locked` und schickt
`columnLock`. Der Bereich „Fixiert“ und die Linie entstehen aus den Einträgen (die fixierten stehen vorn, der Server
hält das).

**`ReactColumnSelectControl.java`:**

| Zustand / Befehl | Inhalt |
|---|---|
| `entries[]` | `name`, `label`, `visible`, `locked` (neu); `grouped` fällt |
| `columnVisible` | wie heute (die letzte sichtbare Spalte bleibt) |
| `columnReorder` | wie heute; ein Ziel im Block fixiert, ein Ziel dahinter löst (der Server leitet `locked` aus der Position ab) |
| `columnLock` (neu) | Argumente `column`, `locked`: zu → ans Ende des Blocks, auf → direkt dahinter |
| `groupBy` | fällt |
| `lockedVisibleCount()` (neu) | die Anzahl, die `TableViewControl` beim Übernehmen als `setFrozenColumnCount` setzt |

Der Konstruktor bekommt statt `groupedColumn` die Anzahl fixierter Spalten der Tabelle und markiert danach die
ersten so vielen **sichtbaren** Einträge als `locked`. **`TableViewControl`:** Ok setzt Spaltenreihenfolge und
`frozenColumnCount` in einem Patch; Reset wie §2.5. Neue Ressourcen über JavaDoc in `I18NConstants`
(`js.table.columnShow`, `…Hide`, `…Lock`, `…Unlock`, `…Locked` für die Überschrift, `…LastVisible`), `messages_en`
erzeugt, Deutsch nachgezogen.

## 5 · Stufe 2: Vorlage für Bernhard (Spaltengruppen)

Das Aussehen liefern wir, die Logik Bernhard. Was der Dialog dafür braucht:

- **Gesten:** eine Spalte auf eine andere ziehen (mittleres Drittel des Eintrags, Marke `drop-onto`) erzeugt eine
  Gruppe „Neue Gruppe“, deren Namensfeld sofort zum Tippen offen ist; eine Spalte auf eine Gruppe nimmt sie auf;
  aus der Gruppe herausziehen löst sie; eine leere Gruppe verschwindet. Doppelklick oder F2 auf den Namen benennt um.
- **Darstellung:** die Gruppe ist ein Eintrag mit Toggle (`tl-toggle`), Einzug `--tl-size-control-sm` für ihre
  Spalten; Auge und Schloss gelten für die ganze Gruppe; in der Tabelle steht über den Köpfen ihrer Spalten ein Band
  mit dem Namen (`tl-table__band`, Höhe `--tl-size-bar`).
- **Vertrag (Vorschlag):** `entries` wird ein Baum — `{ kind: "group" | "column", name, label, visible, locked,
  children? }`; Befehle `groupCreate(columns[], label)`, `groupRename(group, label)`, `columnMove(column, group?,
  targetIndex)`; die Tabelle bekommt die Gruppen als `columnGroups[]` mit Name und Spalten für das Band.
- **Offen für Bernhard:** Speicherung je Person (wie Spaltenreihenfolge), Gruppen in der Tabellendefinition
  (`.view.xml`), Export, Fixieren einer Gruppe als Ganzes.

**Pivot (Idee):** Zeilen über mehrere Spalten gruppieren — zuerst nach Status, darin nach Priorität. Im Dialog ein
Bereich „Gruppieren nach“, in den man Spalten zieht (`Status › Priorität`), die Reihenfolge bestimmt die Ebenen; in
der Tabelle verschachtelte Gruppenzeilen. Die Engine kennt heute eine Ebene.

## 6 · Konsolidierung (Prognose, 12.10.)

| # | Befund | Urteil |
|---|---|---|
| K1 | Griff-Knopf: Spaltenwahl und Select-Chip `tl-button--icon`, Werteliste `tlValueList__handle` (Altklasse) | lohnt mit Welle 5 (Block TLValueList fällt dort) |
| K2 | Griff beim Zeigen statt immer | lohnt für die Spaltenwahl jetzt; Werteliste mit Welle 5; Select-Chip lohnt nicht (der Chip würde beim Zeigen breiter) |
| K3 | Gruppieren an drei Stellen (Icon je Zeile, Kontextmenü, Marke) | Icon fällt (§2.5); Kontextmenü und Marke bleiben; die Marke bekommt einen Namen („Gruppiert nach {Spalte}“, offen in `altlast.md`) |
| K4 | „Auswahl, die nur im Client lebt“ | entfällt: kein Select im Dialog mehr |

## 7 · Prüfung

- **Paket:** Tests für die Teile und Zustände aus §3 (Beim-Zeigen-Regel über `opacity` und `:focus-within`, gedrückt
  bleibt sichtbar, `off`, `section-end`), Lint grün, Vertrag nennt jede Klasse, Specimen; `published.test.mjs` hält die
  Kopie im Worktree.
- **Engine:** `TestReactColumnSelect` (neu oder erweitert): Schloss zu/auf ordnet um, Ziehen über die Grenze fixiert
  und löst, ausgeblendete fixierte Spalte zählt nicht, die letzte sichtbare bleibt, Reset setzt 0; `tsc`, Vite,
  Maven `layout.react`, `check-messages-en`.
- **Sichtprüfung lokal** (Rezept Memory „Lokale Demo statt Docker“): Attribute-Tabelle mit 54 Spalten — Zeigen,
  Fokus mit Tab, Auge, Schloss, Ziehen über die Grenze, Suche, hell/dunkel, normal/kompakt; danach die Tabelle:
  fixierte Spalten stehen links, ausgeblendete fehlen.

## 8 · Risiken

- **Zwei Wege zum Fixieren** (Schloss im Dialog, Griff zwischen den Köpfen) schreiben dieselbe Zahl; der Dialog liest
  sie beim Öffnen, also kein Widerspruch — aber der Kopf-Griff kann nur einen Präfix fixieren, das Schloss ebenso
  (der Block steht vorn). Geprüft im Engine-Test.
- **Kollision mit !1825:** `TLColumnSelect.tsx` berührt Bernhards Branch nicht (dort Tabelle, Baum, Board);
  `TableViewControl.java` schon — der Plan baut auf master nach dem Merge von !1838 und prüft !1825 vor dem Push.
