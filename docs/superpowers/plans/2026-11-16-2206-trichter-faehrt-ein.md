# !2206: Der Trichter fährt ein — Titel einer Zahlenspalte bündig mit den Ziffern

Ticket #30228, Branch `CWS/CWS_30228_ui_pass_1_column_alignment`, Worktree `_Working-Tree/tl8-wt-30228`. Entschieden
von Hendrik am 16.11.: Lösung A.

## Ziel

Bernhards zwei Reviews auf !2206 gelten zusammen:

1. **09.11.:** dieselbe Reihenfolge in jeder Spalte — Titel, dann Trichter. Keine Spiegelung (U53).
2. **13.11.:** in einer Zahlenspalte endet der Titel bündig mit den Ziffern. Trichter nur beim Hover ist „OK“.

Ursache des zweiten Befunds: der Trichter ist verborgen nur per `opacity: 0` (`tl-reveal-on-hover`) und hält seine
Breite (24 px) samt Abstand (`space-2xs`); hinter dem Titel schiebt er ihn um 28 px von den Ziffern (gemessen im
Specimen).

**Lösung A:** der verborgene Trichter hat keine Breite. Beim Zeigen auf die Kopfzelle, bei Tastaturfokus in ihr, bei
aktivem Filter und ohne Zeigen (Touch) fährt sein Platz auf. Reihenfolge und TSX bleiben unverändert.

## Nicht-Ziele

- Reihenfolge im TSX bleibt; einzige TSX-Änderung ist die Messung (1b). Keine Änderung an `layout.css` oder an `tl-reveal-on-hover` (Reorder-Liste, Compact field
  bleiben, wie sie sind).
- Sortierte oder gefilterte Spalte: Pfeil bzw. Trichter stehen dauerhaft hinter dem Titel, der dann nicht bündig ist.
  Das ist Zustandsanzeige, in jeder Spalte gleich; nicht Teil dieses Plans.

## Schritte

### 1. CSS in `tl-design-system/src/components/table/table.css` (nach Plan-Review: Form (b))

Nach der Regel `.tl-table__header-cell[data-tl-state~="filtered"] .tl-table__filter`:

```css
.tl-table__header-cell > .tl-table__filter {
  transition:
    opacity var(--tl-duration-fast) var(--tl-easing-standard),
    width var(--tl-duration-fast) var(--tl-easing-standard),
    margin-inline-start var(--tl-duration-fast) var(--tl-easing-standard),
    border-width var(--tl-duration-fast) var(--tl-easing-standard),
    background-color var(--tl-duration-fast) var(--tl-easing-standard),
    border-color var(--tl-duration-fast) var(--tl-easing-standard),
    color var(--tl-duration-fast) var(--tl-easing-standard);
}
@media (hover: hover) {
  .tl-table__header-cell:not(:hover, :has(:focus-visible), [data-tl-state~="filtered"]) > .tl-table__filter {
    width: 0;
    min-width: 0;
    padding-inline: 0;
    border-width: 0;
    margin-inline-start: calc(-1 * var(--tl-space-2xs));
    overflow: hidden;
  }
}
```

- Nur der verborgene Zustand wird beschrieben; aufgedeckt gilt wieder, was `button.css` (bzw. ein MUI-`IconButton`)
  sagt — keine Wiederholung von `size-control-sm`/`border-width-sm`, der MUI-Innenabstand kommt zurück (Review S3).
- Touch (`hover: none`) bleibt unberührt: der Trichter steht dort immer, der Titel dann 28 px vor den Ziffern.
  Nicht-Ziel, im Vertrag genannt (Review H4).
- Der negative Rand nimmt den `gap: space-2xs` der Kopfzelle zurück; `border-width: 0`, weil `.tl-button` einen
  transparenten Rand hat; `padding-inline: 0` für MUI.
- Die Übergangsliste gewinnt gegen `.tl-reveal-on-hover` durch Spezifität (0,2,0 gegen 0,1,0) und ersetzt dessen
  Liste vollständig; die Breitenregel gewinnt gegen `.tl-button--icon.tl-button--sm` durch die Bundle-Reihenfolge
  (button vor table; Review H2). `border-width` läuft mit, sonst springt der Rand vor der Breite (H6).
- Kommentar über der Regel: warum keine Breite (Review !2206), warum nicht gespiegelt (U53), Touch.

### 1b. „Breite an Inhalt anpassen“ misst den Trichter mit (`TLTableView.tsx`, `measureColumnContentWidth`)

Der Klon der Kopfzelle ist nie unter dem Zeiger, sein Trichter hätte Breite 0; nach Doppelklick auf den Griff würde
der Titel beim Zeigen gekürzt (Review S2, 28 px). Im Klon das Zustandswort `filtered` ergänzen, mit Kommentar
„measured as revealed“ — der Klon ist unsichtbar, die Farbe spielt keine Rolle. vitest-Test dazu, falls die
Messung schon einen hat; sonst Sichtprüfung Punkt 7.

### 2. Tests

- `test/table.test.mjs` Test ab Zeile 164 bleibt grün (kein `hover: none` in `table.css`). Kommentar Zeile 165
  „Keine eigene Reveal-Regel in table.css“ anpassen: die Sichtbarkeit (opacity) kommt aus `layout.css`, die Breite
  regelt `table.css`. Neue Prüfung: der verborgene Selektor trägt `width: 0` (`declarationsOf`, Regex
  `/(?<![-\w])width:\s*0/`, Review H1) und steht in `@media (hover: hover)`.
- `test/table-align.test.mjs` (DOM, ungetrackt): Ruhe bündig (±1 px), beide Dichten. Zusatz: nach
  `focus({ focusVisible: true })` auf den Sortierknopf und `getAnimations().forEach(a => a.finish())` hat der Trichter
  seine volle Breite (Review S1, wie `focus-clip.test.mjs:27`).
- Vor dem Fix `table-align` rot (28 px), danach grün (Review H9 bestätigt).

### 3. Vertrag und Specimen

- `table.contract.md` Zeile „Sortiermarke, Trichter“: verborgen ohne Breite, fährt beim Zeigen, bei Fokus und bei
  aktivem Filter auf; auf Touch steht er immer. `layout.contract.md:34` („kein Block verbirgt oder zeigt eine Aktion
  selbst“) um die Ausnahme Breite des Trichters ergänzen (Review H8). Zeile „Zelle … Zahlenspalte“: der Titel endet bündig mit den Ziffern, weil der
  verborgene Trichter keine Breite hält; Folge wie jede Spalte.
- `table.spec.html`: Beschreibung der Tiefe-Tafel um den Satz ergänzen. Markup unverändert.

### 4. Gates

`node tools/generate.mjs`, `npm test`, `node tools/lint-css.mjs`, `npm run test:dom` im Modul. Maven `layout.react` mit
vitest und `tsc` (wegen 1b). `tools/check-messages-en.sh` vor dem Push.

### 5. Sichtprüfung lokale Demo (tl-demo-react)

Soll-Liste, je hell und dunkel, normal und kompakt, Bilder an Hendrik:

1. Ruhe: Zahlentitel bündig mit den Ziffern (Bernhards Ansicht mit BETRAG/DATUM/ANHÄNGE).
2. Hover über der Zahlen-Kopfzelle: Trichter fährt hinter dem Titel auf, Titel gleitet nach links, kein Springen der
   Zeilenhöhe.
3. Hover über einer Textspalte: Titel bleibt stehen, Trichter erscheint rechts daneben.
4. Tab durch den Kopf: Sortieren → Trichter → Breitengriff, Trichter sichtbar, solange der Fokus in der Zelle ist.
5. Aktiver Filter: Trichter steht dauerhaft in `text-link`.
6. Schmale Spalte: Titel kürzt mit Ellipse, Trichter bleibt erreichbar.
7. Doppelklick auf den Breitengriff einer Zahlenspalte, dann Zeigen: Titel bleibt ganz.
8. MUI-Theme (`mui`-Profil): Ruhe bündig, Trichter beim Zeigen mit seinem Innenabstand.

### 6. Doku (Repo `TopLogic/tl-design-system`)

`docs/skalen.md` neuer Abschnitt „Der Titel einer Zahlenspalte endet bündig mit den Ziffern“ mit A und den verworfenen
Wegen (Spiegelung U53, Überlagerung, Spaltenmenü); `docs/ui-durchgang.md` U53 auf erledigt; `STATUS.md`.

### 7. Nach Hendriks Okay

- Trac #30228 und !2206: den Punkt „keeps the order of every other column …“ ergänzen um „the funnel takes no width
  while hidden, so the title of an end column ends flush with its digits“; „Checked“ mit neuen Zahlen.
- Push `CWS/CWS_30228_ui_pass_1_column_alignment` nur nach Freigabe; danach !2206 in !2207 mergen, Push mit eigener
  Freigabe; `bhu` und `jenkins` neu anfragen; Antwort englisch auf !2206.

## Fertig, wenn

`table-align` und `table.test` grün, alle Gates grün, die sechs Bilder der Sichtprüfung liegen Hendrik vor, und er
hat Text und Push freigegeben.
