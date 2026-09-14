# Stand

**Letzte Sitzung:** 2026-09-14 · **Basis:** `tl-engine-7@master` (TopLogic 8.0.0-SNAPSHOT)

---

## Wo anknüpfen

Nächster Schritt ist **AP 3 — Dark-Theme reparieren** (`plan.md`). Größerer fachlicher Nutzen als
AP 2, weil dort ein echter Barrierefreiheitsmangel steckt: `text-on-color` auf `button-primary`
liegt im Dark-Theme bei etwa **2,4:1** und damit unter WCAG AA.

Alternativ AP 2 (Audit erweitern) — mechanischer, aber breiter wirksam.

## Erledigt

| | Inhalt | Ergebnis |
|---|---|---|
| **PR !1618** | #29576 — doppelte React-Instanz durch direkten `createPortal`-Import | −16.743 B (−7,0 %), drei Duplikat-Marker eliminiert. **Offen** |
| **PR !1621** | #29579 — Marken-Token + `<ref>`-Zielvalidierung | 11 Tokens auf 5 Primitives, alle Werte beweisbar identisch, 15 Tests grün. **Offen** |
| Analyse | `master` vollständig inventarisiert | `findings/` |
| Repo | angelegt, Werkzeuge gebaut | `tools/`, `spikes/` |

**Beide PRs sind nicht visuell verifiziert.** `CLAUDE.md` schreibt für UI-Änderungen eine
Prüfung in der Demo-App vor. Das steht so in beiden PRs und Tickets.

## Worktrees

```
~/git/tl8-wt-29576   CWS/CWS_29576_duplicate_react   (von master)
~/git/tl8-wt-29579   CWS/CWS_29579_brand_token       (von master)
```

Das Verzeichnis des Nutzers `~/git/tl8-new-ui` bleibt unberührt — es steht auf einem veralteten
Branch und enthält fremde uncommittete Änderungen.

## Die drei Befunde, die den Plan tragen

**1. Was existiert, ist ein Token-*Delivery*-System, kein Design System.**
`UIThemeService` löst Deklaration mit Typprüfung, Vererbung, Auslieferung, Umschaltung ohne
Reload, OS-Präferenz, Persistenz und Modulbeitrag — plus einen Audit, der in 6 Modulen ausgerollt
ist und bereits einen Build gebrochen hat (#29573). Was darüber liegt, fehlt.

**2. Der Audit prüft genau zwei Regeln.** Eine `var()`-Referenz ohne Definition, ein literaler
`border-radius`. Ungeprüft durch `tlReactControls.css`:

| Kategorie | literal | Tokens vorhanden? |
|---|---|---|
| `font-size` | 56 von 113 | 8, unvollständige Skala |
| `font-weight` | 44 | **keine** |
| `padding`/`gap`/`margin` | 111 | ja, gut angenommen |
| Farben | 57 Hex + 20 `rgba()` | ja |
| `transition` | 19 | **keine** |
| `z-index` | 14, darunter `9999999999999999` | **keine** |
| Fokusring-Breite | überall `2px`/`3px` | **keine** |

Von fünf React-Stylesheets sind **vier vollständig sauber**. Die gesamte Last liegt in
`tlReactControls.css`.

**3. Das Dark-Theme erbt, was es nicht erben darf.** 36 Farben überschrieben, aber unverändert
geerbt: die drei Schatten (`rgba(0,0,0,…)` — auf dunklem Grund unsichtbar), `overlay`,
`support-error/-warning/-success`, `text-error`, `button-danger*`, `layer-accent*`.
Dazu `color-drop-zone: rgba(41,104,200,0.08)` — das ist `#2968C8` in rgba-Tarnung, ein zwölfter
hartkodierter Marken-Fundort, im Dark-Theme mit der *hellen* Markenfarbe getönt.

## Was diese Sitzung teuer gemacht hat

Die erste komplette Analyse lief gegen `~/git/tl8-new-ui` — **399 Commits hinter `master`**.
Token-Zahlen, Komponenten-Inventar und Drift-Messungen stimmten alle nicht, und ein großer Teil
des ersten Plans war bereits auf `master` anders gelöst.

**Lehre:** Vor jeder Analyse `git fetch origin master` und dagegen prüfen. Siehe
`findings/AP-korrektur-master.md`.

## Werkzeuge

| Datei | Zweck | Anmerkung |
|---|---|---|
| `tools/token-inventory.mjs` | Nutzungsindex aus `theme-settings.xml` + 554 Java-Deklarationen gegen CSS-Verbrauch | kennt beide Auslieferungswege (`theme.xml`, `StyleSheetConfig`) |
| `tools/check-foreign-values.mjs` | Fremdpaletten-Wächter mit Budget-Ratchet | `--budget N` bricht in **beide** Richtungen |
| `spikes/oxlint/` | oxlint-JS-Plugins tragen: 125 ms für 96 Dateien, Exit 1 | hat #29576 gefunden |

Beide Werkzeuge sind auf die Legacy-Analyse ausgelegt. Für AP 2 müssen sie auf das
React-Token-System umgestellt werden — oder besser: die Regeln wandern in `ThemeTokenAudit`,
wo sie hingehören und wo sie bereits in 6 Modulen laufen.

## Offene Entscheidungen

1. **Token-Namen.** Carbon-Nomenklatur (`layer-01`, `spacing-01..06`, `support-*`). Empfehlung:
   behalten — Namenskonvention, keine Palette.
2. **Schrift.** `'Inter'` ist gesetzt. Specimen-Test bei 12/13/14px mit echten TopLogic-Tabellen
   steht aus.
3. **Markenfarbe.** `#2968C8` ist der Ist-Wert, Auffrischung gewünscht. `#0f62fe` scheidet aus
   (IBM Carbon Blue 60). Nach PR !1621 ist das eine Ein-Wert-Änderung.
4. **Repo-Transfer** nach `TopLogic/` und Sichtbarkeit.
