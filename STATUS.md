# Stand

**Letzte Sitzung:** 2026-09-16 · **Basis:** `tl-engine-7@master` (TopLogic 8.0.0-SNAPSHOT)

---

## Wo anknüpfen

**Stufe A läuft.** Die Maschinerie steht und ist geprüft; es fehlen noch fünf von elf Skalen.

Nächster Schritt: **Radius** — zwei Stufen sind der Bestand, zu belegen ist, ob sie reichen. Danach
Fokus, Motion, Dichte, Komponenten-Maße.

Die Typo-Größen stehen als Entscheidung in `docs/skalen.md`, aber **noch nicht im Specimen**: Die
sieben Stufen sind dort weder als Tokens hinterlegt noch an der Probe gezeigt.

Das Specimen starten:

```bash
cd ~/Claude/TopLogic-v8-DesignSystem/specimen && node serve.mjs
```

Dann `http://localhost:8137/` — Markenregler, Grundflächenregler, Modus-, Ansichts- und
Schriftumschalter, unten das Gate-Panel.

## Entschieden, alles begründet in `docs/skalen.md`

| | Entscheidung |
|---|---|
| Elevation | Fläche plus Schatten — hell trägt der Schatten, dunkel die Fläche |
| Dark | zweite vollständige Palette, nichts wird geerbt |
| Rampenregel | Sättigung zurücknehmen statt klemmen |
| Rampenrichtung | Gedrücktes tritt zurück |
| Beschriftung | je Fläche abgeleitet, nie geschrieben |
| **Marke** | **`#0B5ED7`**, ausdrücklich vorläufig |
| Grundfläche | `#FAFAFA`, neutral |
| Rahmen | vier Stufen: separator, control, emphasis, interactive |
| Neutrale | aus der Anforderung gestuft, nicht nach gleichem Abstand |
| Semantik | vier Bedeutungen × vier Rollen |
| Schrift | Inter bleibt; Kundenschriften siehe Issue #12 |
| Typo-Größen | sieben Stufen in `rem`, jede ein glattes Sechzehntel |

## Was das Gate gefunden hat

Zehn Verstöße, keiner davon vorher bekannt:

| Befund | Wert |
|---|---|
| `text-inverse` auf `background-inverse`, dunkel | **1,13** — Weiß auf Fast-Weiß |
| Feldumrandung `border-subtle`, beide Modi | **1,70** / 1,63 statt 3,0 |
| `support-warning` als Text, hell | **2,27** |
| `support-success` als Text, hell | 3,04 |
| `text-placeholder` auf `field`, hell | 2,04 |
| Snackbar-Erfolg, hartkodiertes `#fff` | 3,17 |
| Beschriftung auf `button-primary`, dunkel | 2,80 |

**Dreimal dieselbe Ursache:** ein Token mit mehreren Aufgaben, und die schwächste Anforderung
gewinnt — `text-on-color`, `border-subtle`, `support-warning`.

## Werkzeuge

`specimen/` — Kontrastrechnung, 23 Paare, OKLCH-Markenableitung mit Gamut-Mapping, Server auf dem
**echten** `tlReactControls.css`, Fragmente aus der laufenden Demo-App. 15 Tests, `node --test`.

## Offene Fäden

* Die Paarliste im Specimen weicht bewusst vom Java-Gate ab (sechs Umbenennungen, eine Ergänzung).
  Stufe B zieht nach — die vollständige Liste steht im Bericht im SDD-Workspace.
* PRs **!1618** und **!1621** sind verifiziert, aber weiterhin ungemergt. **B6 hängt an !1621.**
* Issue **#13** hält fest, dass Kunden-Theming, Storybook und Accessibility beim Umschreiben ihr
  Issue verloren haben.
* Vier Stellen lesen `--text-on-color` ohne eindeutige Rolle; eine davon (`.tlAudioPlayer__icon--pause`)
  hat eine hartkodierte Fläche `#24a148`.

## Planung

Arbeitspakete als Gitea-Issues: https://git.top-logic.com/hpe/tl-design-system/issues
Spec: `docs/superpowers/specs/2026-09-15-style-overhaul-design.md`
Umsetzungsplan Stufe A: `docs/superpowers/plans/2026-09-15-stufe-a-richtung.md`
Fortschritt und Rulings: `.superpowers/sdd/2026-09-15-stufe-a-richtung/progress.md`
