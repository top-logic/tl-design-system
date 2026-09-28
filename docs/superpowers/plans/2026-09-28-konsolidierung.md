# Konsolidierung — eine Linie statt fünf Fäden

**Stand:** 2026-09-28 · Repo `main@c6fbb61` sauber · Worktree auf `CWS/CWS_29617_design_system_welle_1_avatar` (f0d955b795)

## Context

Seit dem 24.09. laufen fünf Fäden gleichzeitig: Pill-PR, Avatar-PR, `derive`, die Spec und der 24-Task-Plan
„UI-Paket“, dazu Bernhards Strang #29643/#29650. Der Plan UI-Paket wurde geschrieben, **ohne** dass
!1698 (#29643) und #29650 bekannt waren — beide decken dieselbe Fläche ab (Ersetzung, Zustandsvertrag,
MUI-Referenz). Zwei Pläne für dieselbe Sache sind der Grund für das Gefühl „zu viele offene Punkte“.

Ziel dieses Plans: (1) Welle 1 zu Ende bringen, (2) UI-Paket gegen Bernhards Strang konsolidieren — ein
Vertrag, ein Referenzprojekt, eine Theme-Richtung —, (3) erst dann Welle 2. Nichts Neues anfangen, bis
ein Faden geschlossen ist.

## Befund (28.09., aus Gitea und Trac)

| Faden | Stand | Was fehlt |
|---|---|---|
| **!1694 Pill** | Bernhard approved 25.09. 13:24 (gültig, nicht stale), Jenkins 16232 grün | **Merge.** Nichts sonst. |
| **!1695 Avatar+Progress+Icon** | Jenkins 16243 grün; Bernhard **REQUEST_CHANGES** 25.09. 17:39, drei Punkte | Antwort + Fix: (a) px-Werte im JavaDoc von `IconSize` raus, (b) `lg` „unlesbare Abkürzung“, (c) `size="xl"` in `image-demo.view.xml` — „Not a AvatarSize?“ |
| **!1698 #29643 (Bernhards Claude)** | Blockiert auf msgbuf 1.2.3-Release; Jenkins kompiliert nichts. Bringt `replace()`, `registerRootWrapper`, `state.proto` (14 Zustände, `TestControlStateSchema`), Beispielmodul `com.top_logic.demo.react.corporate` | Konflikt mit !1694: `color` → `colorRole` in `DropdownSelectState.Option`; wer zweiter landet, löst. Reviewkommentar fordert 19 weitere Zustände (Drafts liegen im PR). |
| **#29650 „TL UI on MUI“ (Sammelticket, 25.09.)** | 12 Untertickets #29651–#29662. Richtung 1: neue Komponenten (Accordion, Alert, Badge, Radio, List, Skeleton, Divider, FAB, Popover, Typo-Skala). Richtung 2: #29661 MUI-Adaptermodul, #29662 **MUI-Theme als Quelle der TL-Tokens** | Richtung 2 kollidiert mit Gruppe D unseres Plans und **kehrt unsere Theme-Richtung um** (bei uns: `derive` → Rollen → `roles-to-mui`). Richtung 1 sind künftige Wellen-Komponenten. |
| **Plan UI-Paket (24 Tasks)** | geschrieben, nicht begonnen | Gruppe A (`@Key`) und E (Theme benennt Paket) sind unabhängig und bleiben. B (Harness) bleibt, liest aber Zustand aus `state.proto`. C (20 Verträge Muss/Kann) doppelt den Muss-Teil mit `state.proto`. D (`examples/mui-adapter/`) doppelt #29661. |
| **Gitea-Issues tl-design-system** | 12 offen (#2–#13, #16), alle vom 15.09./24.09. | Die meisten sind durch Welle 0/1 und `derive` überholt; niemand hat sie geschlossen. |
| Renovate/fremde PRs | 9 Renovate, 10 fremde (bhu, sha, jhu, dbu, iwi, msi) | nicht unsere Fläche |

## Anleitung für Orchestrierung — vorhanden, eine Lücke

Vorhanden: CLAUDE.md „Modelle“ (Fable entscheidet, Opus Java/Tests, Sonnet Umbenennen/Suche),
Skill `superpowers:subagent-driven-development` §Model Selection (billig / Standard / stärkstes; **Modell immer
explizit angeben**; Transkription mit fertigem Code → billigstes Modell; Reviewer mindestens Mittelklasse),
Memory `sdd-subagenten-design-system` (Opus-Reviewer auf Rechenkernen fanden echte Planfehler).

Lücke: **Haiku kommt nirgends vor**, und die Tabelle in CLAUDE.md nennt keine Reviewer-Regel. Task 0 schließt sie.

## Die Linie

Drei Stränge, streng nacheinander. Ein Strang ist fertig, wenn seine Fertig-Bedingung committet ist.

### Strang 0 — Welle 1 schließen (jetzt)

**Task 0 · CLAUDE.md „Modelle“ ergänzen** — Fable, direkt.
Zeile für Haiku (Transkription mit fertigem Code im Plan, Ein-Datei-Fixes, Inventur/Suche mit klarem Muster,
Issue-Sweeps), Zeile für Reviewer (Rechenkern und Java-Naht → Opus; Transkription → Sonnet; nie Haiku),
Satz „`model:` wird immer angegeben“. Commit `Ticket #29617: CLAUDE — Modelle: Haiku und Reviewer-Regel`.

**Task 1 · !1694 mergen** — Fable, direkt (Merge ist ein Außeneffekt: Hendrik bestätigt im Plan-Approval).
Merge-Commit im Gitea-Format. Danach Kommentar auf !1698: „!1694 ist auf master; `DropdownSelectState.Option.color`
→ `colorRole` liegt jetzt bei euch“ (Bernhards eigener Kommentar vom 25.09. 13:08 sagt das schon zu).

**Task 2 · !1695: Bernhards drei Punkte** — Entscheidung Fable, Umsetzung **Opus**-Subagent im Worktree.
Entscheidung (siehe „Offene Entscheidungen“ 1): externe Namen in Java/XML sind ganze Wörter, CSS-Modifier
bleiben kurz. Umsetzung: `IconSize`/`AvatarSize` extern `small|medium|large|x-large`, JavaDoc ohne px
(„die kleinste Stufe: das Icon steht neben Text“), `image-demo.view.xml` zurück auf `x-large`, TSX bildet
`x-large` → `tl-avatar--xl`, `tl-icon-lg` bleibt CSS. `docs/skalen.md` „Avatar“ und „Icon“ eine Zeile:
„Extern ganze Wörter, im CSS die Skalenkürzel“. `tools/check-messages-en.sh`, Push, Antwort im PR
(Tonlage: `bernhard-review-vokabular`). Fertig: Bernhards Approval, Jenkins grün.

**Task 3 · !1695 auf master rebasen, mergen, Sichtprüfung** — **Opus**-Subagent (Rebase, Basis umstellen),
Sichtprüfung Hendrik + Fable per Chrome auf der Docker-Instanz (Kommentarköpfe, Bild-Demo, Fortschritt,
Reduced Motion). Fertig: Merge, Branch gelöscht.

**Task 4 · Welle-1-Abschluss** — **Sonnet**-Subagent.
Worktree auf `master`, `node tools/inventory.mjs` gegen master, `test/ratchet.json` nachziehen,
`docs/migration/altlast.md` Welle-1-Abschnitt „gemerged“, STATUS.md „Jetzt“ auf Strang 1 umschreiben.
Fertig: Commit, Gates grün.

**Task 5 · Gitea-Issue-Sweep** — **Haiku**-Subagent (nur lesen + Vorschlagsliste), Schließen macht Fable.
Je Issue #2–#13, #16: „überholt durch <Commit/Abschnitt in skalen.md>“ oder „offen, gehört zu Strang <n>“.
Fertig: Liste in STATUS.md „Offene Fäden“, überholte Issues geschlossen mit Verweis.

### Bernhards Weg oder unserer? — Befund

**Bei der Mechanik hat Bernhard recht, bei der Wertschicht und beim Kundenversprechen wir.** Es sind nicht
zwei Entwürfe für dieselbe Sache: Seins ist der Draht, richtig gebaut; unseres ist alles, was den Draht für
einen Kunden tragfähig macht. Also nicht gegeneinander argumentieren, sondern seins übernehmen und an zwei
Stellen mit Beweis widersprechen.

Wo sein Weg der richtigere ist:
1. **`state.proto`** — ein Zustandsvertrag für Java und TypeScript, vom Build geprüft (`TestControlStateSchema`).
   Unsere Zustandstabelle in `contract.md` wäre eine zweite Wahrheit und driftet garantiert.
2. **`replace()` + `registerRootWrapper`** — unsere Spec §3a stützt sich auf „letzter `register` gewinnt“ plus
   `requires`-Reihenfolge. Das ist fragil; seins ist explizit und warnt bei Doppelung.
3. **Referenzmodul im Framework** (`demo.react.corporate`, Maven-Profil, läuft in der echten Demo). Unser
   `examples/` außerhalb des Builds wäre schwächer.

Wo er das Ganze nicht greift (belegt in seinem eigenen PR):
1. **Wertschicht.** #29643 Stufe 1 sagt `<theme name="acme" extends="default">` und verweist auf
   `react-theme-tokens.md` — das alte Theme-System, das wir abschneiden. #29662 dreht die Richtung um: das
   MUI-Theme wird Quelle der TL-Tokens; damit fallen Paarliste, Kontrast-Gate und gerechnete Beschriftungen,
   und MUI bestimmt den Look auch für Kunden ohne MUI. Beweis: `tl-demo-react-corporate.css` ist laut Kopf
   „independent of the TopLogic theme tokens“ — `#fff`, `#b42318`, `#fee4e2`, `outline: none`, Deckkraft 0,45
   für disabled. Kein Dunkelmodus, kein Gate, fremder Fokusring. Stufe 1 tut für diesen Button nichts.
2. **Der Vertrag hat zwei Hälften.** Proto ist der Zustand; Kommandos sind Prosa im JavaDoc; nichts sagt,
   welche Rollen eine Ersatzkomponente liest, damit sie ins Bild passt, und welche Attribute Tastatur, Fokus und
   Skript-Aufzeichnung brauchen. Sein `BrandButtonAdapter` macht das richtig (`useKeyboardBinding`,
   `rootClassName`, Tooltip-Attribute) — aus Kenntnis der Bridge, nicht aus einem Vertrag. Mercedes hat diese
   Kenntnis nicht.
3. **Niemand prüft die Kundenseite.** `TestControlStateSchema` prüft, dass der Server sendet, was das Schema
   sagt. Nichts prüft, dass die Kundenkomponente `click` sendet, bei `disabled` schweigt und `pushTrap` ruft.
   Das ist unser Harness — das Werkzeug, das Mercedes vor jedem Update laufen lässt.
4. Kleiner: kein Ressourcen-Override (`button.css` lädt weiter, wenn `TLButton` ersetzt ist); neue Komponenten
   aus #29650 Richtung 1 hätten ohne Paketregel wieder Blöcke in `tlReactControls.css` (Ratsche).

Warum er es nicht greift: Er liest Code und Tickets; unsere Doku ist für ihn Prosa („Na gut — wir werden
sehen“). Seine Claude-Session hat die 19 Zustands-Drafts aus dem **alten** Code abgeleitet — `TextState.color`
ist dort „the CSS color … drawn as a pill in that color“, was !1694 (`colorRole`) gerade abgeschafft hat. Ohne
das Paket als Quelle reproduziert sich der Altbestand von selbst.

Wie er es greift: **Beweis auf seinem Boden, nicht Argument auf unserem.**

### Strang 1 — UI-Paket mit #29643/#29650 verschmelzen (nach Strang 0)

**Task 6 · Position schreiben** — Fable, direkt. Abschnitt in `docs/skalen.md` „Ein Vertrag, zwei Hälften“:
`state.proto` ist der Muss-Teil (Zustand); `<name>.contract.md` trägt Aktionen und Stapel als Konformitätsfälle,
den Kann-Teil (Rollen, Attribute, Aufzeichnung) und Konformität. Theme-Richtung: `derive` bleibt die Quelle,
ein MUI-Theme wird **aus** den Rollen gerechnet (`roles-to-mui`), nie umgekehrt. Referenzprojekt lebt im
Framework neben `demo.react.corporate`. Präsentation 13b, Übersicht §2b, STATUS.

**Task 7 · Beweis-Commit auf !1698-Basis** — **Opus**-Subagent, Branch von `CWS/CWS_29643_customer_component_library`.
Drei kleine Dinge, die Bernhard im Diff sieht statt in Prosa liest:
(a) `tl-demo-react-corporate.css` liest `--tl-*`-Rollen statt `#b42318`/`#fff` — Dunkelmodus und ein
`derive`-Theme (`probe.theme.css`) wirken sofort auf seine Bibliothek, ohne `<theme extends>`: das ist Stufe A
für eine Fremdbibliothek; (b) `outline: none` raus, Fokusring aus `base.css`; (c) eine Vitest-Datei, die
seinen `BrandButtonAdapter` gegen zwei Fälle laufen lässt (`click` kommt an; `disabled` + `keyGesture` schweigt) —
grün, weil er es richtig gemacht hat, und der Keim des Harness. Als PR auf seinen Branch, Bernhard Reviewer.

**Task 8 · Trac-Kommentar auf #29650 und #29662** — Fable schreibt, Hendrik gibt frei oder postet.
Vier Sätze: wir übernehmen `replace`, `state.proto`, das Beispielmodul; wir bringen Harness, Kann-Teil,
Ressourcen-Override, Theme benennt Paket; #29662 ist die falsche Richtung (Beweis aus Task 7);
Richtung 1 entsteht je Komponente zuerst im Paket. Verweis auf Wiki §2a/§2b. Damit hat Bernhards „Auge
drauf“ einen gemeinsamen Plan statt zweier.

**Task 9 · Plan UI-Paket überarbeiten** — Fable entwirft die Änderung, **Opus**-Subagent schreibt den Plan um.
- Gruppe A: unverändert.
- Gruppe B: Harness liest Zustandsschema aus `react-src/state/control-state.ts` (generiert aus `state.proto`),
  Fälle aus `## Konformität`. Voraussetzung: !1698 gemerged. Bis dahin: Tasks 3–5 auf einem Branch,
  der auf `CWS/CWS_29643_customer_component_library` aufsetzt, nicht auf master.
- Gruppe C: `### Zustand` wird ein Verweis auf die Proto-Nachricht; 20 Verträge bleiben, werden kürzer.
  Die 19 Zustands-Drafts aus Bernhards Review-Kommentar sind die Vorlage für die Muss-Teile, die `state.proto`
  noch nicht hat.
- Gruppe D: entfällt im DS-Repo. Wird #29661 im Framework, gebaut auf `replace()` + `registerRootWrapper`;
  `roles-to-mui.mjs` bleibt im Paket (`tools/`), weil es `dist/tokens.css` liest.
- Gruppe E: unverändert, letzter Schritt.
Fertig: Plan committet, Spec §4/§6 fortgeschrieben, drei bekannte Spec-Korrekturen aus dem 25.09. eingearbeitet
(`config:operation="remove"` nicht theme-abhängig; Fokusfalle in `TLWindow`; Snackbar ohne Falle).

**Task 10 · Gruppe A ausführen** — SDD: Implementierer **Opus**, Reviewer **Opus** (Java-Naht, TypedConfiguration).
Unabhängig von !1698, kann sofort nach Task 9 laufen. Branch `CWS/CWS_29617_design_system_ui_paket` von master.

**Task 11 · Warten auf !1698** — kein Arbeitspaket. Signal: msgbuf 1.2.3 auf Nexus, Jenkins grün, Merge.
Solange: Strang 2 beginnt.

**Task 12 · Gruppen B, C, E ausführen** — SDD nach Task 11. Harness (B): Implementierer Opus, Reviewer Opus.
Verträge (C): Implementierer **Sonnet** (Vorlage steht im Plan), Reviewer Sonnet; Konformitätsfälle für Dialog
und Snackbar (Stapel) Reviewer Opus. E: Opus/Opus. Abschluss-Review Opus.

### Strang 2 — Welle 2 (parallel zu Task 11, sonst nach Strang 1)

**Task 13 · Welle 2 planen** — Brainstorming Fable + Hendrik, Spec, dann Plan. Eingabefelder, Select;
Befunde aus `altlast.md` „Sichtbare Befunde“. Richtung 1 von #29650 (Alert, Badge, Divider, Skeleton, Radio)
wird als „Welle 2b“ eingeplant: neue Komponenten entstehen **zuerst im Paket** (CSS, Vertrag, Specimen),
dann als Control — nie umgekehrt. Fertig: Spec + Plan committet.

## Offene Entscheidungen (Empfehlung zuerst)

1. **Größen-Namen (Bernhards Review !1695).** Empfehlung: extern ganze Wörter (`small|medium|large|x-large`)
   wie in Bernhards `AvatarState`-Draft, CSS-Modifier bleiben `--sm|--md|--lg|--xl` (konsistent mit
   `space-sm`, `size-avatar-sm`). Alternative: überall ganze Wörter — bricht die Skalennamen des Pakets.
2. **Theme-Richtung (#29662).** Empfehlung: `derive` bleibt die einzige Quelle; das MUI-Theme wird aus den
   Rollen gerechnet. Begründung: Kundenthemes entstehen nur über `derive` (CLAUDE.md), sonst zwei Wahrheiten
   für dieselbe Farbe. Alternative: MUI-Theme als Quelle — dann gilt die Paarliste nicht mehr.
3. **Wo lebt das MUI-Referenzprojekt.** Empfehlung: Framework-Modul unter #29661 neben
   `demo.react.corporate`, auf `replace()`. Alternative: `examples/mui-adapter/` im DS-Repo — zweites
   Beispiel für dieselbe Sache.
4. **Verträge.** Empfehlung: `state.proto` = Muss/Zustand; `contract.md` = Aktionen, Kann, Konformität.
   Alternative: beides pflegen — Drift garantiert.

## Was liegen bleibt (bewusst)

- Token-Mapper, Figma-Push, Maven-Wrapper, TSX-Lint (#29576 nennt die oxlint-Regel) — nach Strang 1.
- `derive`-Resthinweise (Kollaps-Hinweis, achromatische 20°-Prüfung) — Welle 2 nimmt sie mit.
- Renovate- und Fremd-PRs — nicht unsere Fläche.

## Verifikation

- Strang 0: `git log master` zeigt beide Merges; `node --test` und `node tools/inventory.mjs` grün gegen master;
  STATUS.md „Jetzt“ nennt nur noch Strang 1.
- Strang 1: Trac #29650 trägt unseren Kommentar; Plan UI-Paket ohne Gruppe D, Gruppe B mit Proto-Quelle;
  `TestClientResources` entfernt einen benannten Eintrag aus einem zweiten Fragment.
- Strang 2: Spec und Plan Welle 2 auf `main`.

## Nach Freigabe außerdem

Memory-Notiz (feedback): Vor jedem Widerspruch gegen Bernhard erst prüfen, wo er recht hat, und das
übernehmen; widersprechen nur mit Beweis in seinem Code, nicht mit Prosa in unseren Docs.

## Nächster Schritt nach Freigabe

Task 0 (CLAUDE.md) und Task 1 (Merge !1694) — beides Fable, direkt.
