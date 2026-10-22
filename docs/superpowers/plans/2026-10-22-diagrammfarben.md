# Diagrammfarben Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Diagrammreihen lesen eine neue Rolle `category-N-mark` je Modus, gerechnet aus den acht Kategorietönen; die
Kategorien werden nach der Rechnung nummeriert; `derive` rechnet dasselbe für Kundenthemes; die Engine malt damit.

**Architecture:** Zwei neue Bibliotheken im Paket: `tools/lib/cvd.mjs` (Farbsehschwäche simulieren, ΔE) und
`tools/lib/diagramm.mjs` (Paarliste, Prüfer, deterministische Suche nach Reihenfolge und Helligkeiten). Dieselbe Funktion
`diagrammReihen` liefert die TopLogic-Werte (ein Test hält `tokens.json`/`primitives.json` gleich ihrem Ergebnis) und
läuft in `derive` nach `kategorienVerteilen`. Die Engine liest `--tl-category-N-mark` in `useThemeDefaults.ts`.

**Tech Stack:** Node ≥ 22 ohne Abhängigkeiten (`node --test`), JSON-Tokens, Chart.js 4 über React (TypeScript, Vitest
im Modul `com.top_logic.layout.react.mui`).

**Spec:** `docs/superpowers/specs/2026-10-22-diagrammfarben-design.md` (freigegeben 22.10.). Abschnittsnummern unten
(§N) verweisen dorthin.

## Global Constraints

- Schwellen (§2): Kontrast ≥ 3,0 gegen `surface-base` und `surface-layer` je Modus; Rot-Grün (min aus protan, deutan;
  Machado 2009, Schwere 1,0) ΔE ≥ 8; normal ΔE ≥ 15; ΔE = euklidisch in OKLab × 100; Chroma ≥ 0,10.
- Paarliste (§2): (i, i+1) für alle benachbarten Reihen, dazu (1, j) für j ≥ 3 (Ring schließt sich).
- Chroma (§6): `clamp(C der Marke, 0,10, 0,15)`; wo der Farbraum weniger hergibt, sinkt C (wie `oklchZuHex`).
- Helligkeitsbereiche (aus dem gewählten Prototyp C): hell L ∈ [0,43; 0,77], dunkel L ∈ [0,48; 0,77]; der Kontrast
  beschränkt sie zusätzlich.
- Ziel der Suche (§11): maximiere `abstand = min über Modi und Paare (ΔE_rotgruen / 8, ΔE_normal / 15)`; Gleichstand auf
  zwei Nachkommastellen → kleinerer größter Helligkeitssprung (L normiert auf den zulässigen Bereich des Modus, 0 dunkelste,
  1 hellste zulässige Stufe), dann höheres mittleres Chroma.
- Reihe 1 (§4): der freie Ton, der der Marke (Grad) am nächsten liegt, es sei denn `category-1` ist geliefert.
- Deterministisch: gleiche Eingabe → gleiche Ausgabe, unabhängig von der Reihenfolge der Eingabetöne; kein `Math.random`.
- Keine Werte in `tokens.json`, nur Referenzen; Primitivnamen über `primitiveAbleiten` (`tools/lib/naming.mjs`).
- Namen öffentlich englisch, kebab-case, Präfix `tl`: Rolle `category-N-mark`, Variable `--tl-category-N-mark`.
- Kein Handwert in erzeugten Dateien (`dist/`, `specimen/probe.theme.css`, Engine-Kopie): immer über `generate.mjs`,
  `derive.mjs`, `publish-to-worktree.mjs`.
- Commits: Paket `Ticket #29914: …` (deutsch), Engine `Ticket #29914: …` (englisch); Trailer
  `Co-Authored-By: Claude <Modell> <noreply@anthropic.com>` des ausführenden Modells.
- **Kein Push.** Subagenten pushen nie; der Push ist ein eigener Schritt nach Hendriks Freigabe.

## Review Focus

1. **Unbunte Marke** (C < `UNBUNT_C`): ihr Farbton ist Rauschen. Erwartet: Chroma 0,10, Reihe 1 wird von der Suche
   frei gewählt, keine Ausnahme. → Test in Task 3.
2. **Alle acht Kategorien geliefert:** keine freien Töne. Erwartet: Reihenfolge = Nummern der Lieferung, nur die
   Helligkeiten werden gesucht, Ergebnis mit `abstand`. → Test in Task 3.
3. **Zwei gelieferte Kategorien mit demselben Ton:** keine Palette hält die Schwellen. Erwartet: `derive` schreibt die
   Datei, Exit 0, ein Hinweis nennt das schwächste Paar; kein Wurf. → Test in Task 5.
4. **Kundengrau** (Probe: `warm`): die Gründe ändern sich. Erwartet: jede `mark` hält 3,0 gegen die Gründe des Kunden.
   → über die Paarliste (Task 4) und Test in Task 5.
5. **Eingabetöne in anderer Reihenfolge:** Erwartet: identisches Ergebnis. → Test in Task 3.

---

### Task 1: Farbsehschwäche simulieren — `tools/lib/cvd.mjs`

**Files:**
- Create: `design-system/tools/lib/cvd.mjs`
- Test: `design-system/test/cvd.test.mjs`

**Interfaces:**
- Produces: `simuliere(hex: string, art: 'protan' | 'deutan'): [r, g, b]` (linear RGB, geklemmt 0..1);
  `deltaE(a: string, b: string, art?: 'protan' | 'deutan'): number` (OKLab × 100; ohne `art` normales Sehen);
  `rotGruen(a: string, b: string): number` = `min(deltaE(a,b,'protan'), deltaE(a,b,'deutan'))`.

- [ ] **Step 1: Write the failing test** `test/cvd.test.mjs`

```js
test('ΔE stimmt mit dem Prüfer überein', () => {
  const nah = (ist, soll) => assert.ok(Math.abs(ist - soll) < 0.02, `${ist} statt ${soll}`);
  nah(deltaE('#A45502', '#5B7400'), 14.35);
  nah(deltaE('#A45502', '#5B7400', 'protan'), 4.67);
  nah(deltaE('#A45502', '#5B7400', 'deutan'), 2.36);
  nah(rotGruen('#6760B5', '#8756A6'), 2.53);
  nah(deltaE('#FFFFFF', '#000000'), 100);
});
test('ΔE ist symmetrisch und null für gleiche Farben', () => {
  assert.equal(deltaE('#0B5ED7', '#0B5ED7', 'deutan'), 0);
  assert.equal(deltaE('#0B5ED7', '#E8541E'), deltaE('#E8541E', '#0B5ED7'));
});
```

- [ ] **Step 2: Run, expect FAIL** — `cd design-system && node --test test/cvd.test.mjs` → „Cannot find module“.
- [ ] **Step 3: Implement** mit den Machado-Matrizen (Schwere 1,0) auf linearem sRGB und der OKLab-Umrechnung; die
  Umrechnung hex → OKLab gibt es schon in `tools/lib/color.mjs` (wiederverwenden, nicht nachbauen; ist sie nicht
  exportiert, exportieren). Matrizen:
  protan `[[0.152286,1.052583,-0.204868],[0.114503,0.786281,0.099216],[-0.003882,-0.048116,1.051998]]`,
  deutan `[[0.367322,0.860646,-0.227968],[0.280085,0.672501,0.047413],[-0.011820,0.042940,0.968881]]`.
- [ ] **Step 4: Run, expect PASS.**
- [ ] **Step 5: Commit** `Ticket #29914: Paket -- cvd.mjs: Rot-Grün-Schwäche simulieren, ΔE in OKLab`

### Task 2: Paarliste und Prüfer — `tools/lib/diagramm.mjs` (Teil 1)

**Files:**
- Create: `design-system/tools/lib/diagramm.mjs`
- Test: `design-system/test/diagramm.test.mjs`

**Interfaces:**
- Consumes: `deltaE`, `rotGruen` (Task 1); `ratio` (`tools/lib/contrast.mjs`); `hexZuOklch`, `oklchZuHex` (`color.mjs`).
- Produces:
  - `DIAGRAMM = { KONTRAST: 3.0, ROT_GRUEN: 8, NORMAL: 15, CHROMA_MIN: 0.10, CHROMA_MAX: 0.15, BAND: { light: [0.43, 0.77], dark: [0.48, 0.77] } }`
  - `diagrammPaare(n: number): [number, number][]` (0-basiert)
  - `pruefeReihen(farben: string[]): { abstand: number, schwaechstes: { art: 'rot-gruen' | 'normal', reihen: [number, number], wert: number, soll: number } }`
    (`abstand` wie Global Constraints, für einen Modus; `reihen` 1-basiert)
  - `zulaessigeStufen(tonGrad: number, chroma: number, modus: 'light' | 'dark', gruende: string[]): { L: number, hex: string }[]`
    (L in 0,01-Schritten im Band; nur Stufen mit Kontrast ≥ 3,0 gegen jeden Grund und tatsächlichem C ≥ 0,10)

- [ ] **Step 1: Failing tests**

```js
test('Paarliste: Nachbarn und der Ring', () => {
  assert.deepEqual(diagrammPaare(2), [[0, 1]]);
  assert.deepEqual(diagrammPaare(4), [[0, 1], [1, 2], [2, 3], [0, 2], [0, 3]]);
  assert.equal(diagrammPaare(8).length, 7 + 6);
});
test('der Prüfer nennt das schwächste Paar der heutigen 5d-Palette', () => {
  const heute = ['#AA4969', '#A45502', '#5B7400', '#00786F', '#0071A3', '#6760B5', '#8756A6', '#9D4D8A'];
  const r = pruefeReihen(heute);
  assert.ok(r.abstand < 0.5);
  assert.equal(r.schwaechstes.art, 'rot-gruen');
  assert.deepEqual(r.schwaechstes.reihen, [2, 3]);
});
test('zulässige Stufen halten 3:1 auf beiden Gründen und liegen im Band', () => {
  for (const [modus, gruende] of [['light', ['#FAFAFA', '#FFFFFF']], ['dark', ['#16181B', '#1D2023']]]) {
    const s = zulaessigeStufen(238, 0.15, modus, gruende);
    assert.ok(s.length >= 5, modus);
    for (const { L, hex } of s) {
      assert.ok(L >= DIAGRAMM.BAND[modus][0] && L <= DIAGRAMM.BAND[modus][1]);
      for (const g of gruende) assert.ok(ratio(hex, g) >= 3.0, `${modus} ${hex} auf ${g}`);
    }
  }
});
```

- [ ] **Step 2: Run, expect FAIL.**
- [ ] **Step 3: Implement** die drei Funktionen und `DIAGRAMM`.
- [ ] **Step 4: Run, expect PASS.**
- [ ] **Step 5: Commit** `Ticket #29914: Paket -- diagramm.mjs: Paarliste, Prüfer, zulässige Stufen`

### Task 3: Die Suche — `diagrammReihen`

**Files:**
- Modify: `design-system/tools/lib/diagramm.mjs`
- Test: `design-system/test/diagramm.test.mjs`

**Interfaces:**
- Consumes: Task 2.
- Produces: `diagrammReihen({ toene: number[], fest?: Record<number, number>, marke: string, gruende: { light: string[], dark: string[] } }):
  { toene: number[], light: string[], dark: string[], abstand: number, schwaechstes: { modus, art, reihen, wert, soll } }`
  - `toene`: freie Töne in Grad; `fest`: Nummer (1–8) → Grad, geliefert, behält die Nummer; zusammen genau 8.
  - Rückgabe in Reihenfolge der Kategorien 1–8: Ton, `mark` hell, `mark` dunkel.
  - `abstand ≥ 1` heißt: alle Schwellen erfüllt. `schwaechstes` über beide Modi.

- [ ] **Step 1: Failing tests**

```js
const TL = { toene: [2, 56, 123, 186, 238, 285, 311, 337], marke: '#0B5ED7',
  gruende: { light: ['#FAFAFA', '#FFFFFF'], dark: ['#16181B', '#1D2023'] } };
test('TopLogic: alle Schwellen erfüllt, Reihe 1 neben der Marke', () => {
  const r = diagrammReihen(TL);
  assert.ok(r.abstand >= 1, JSON.stringify(r.schwaechstes));
  assert.equal(r.toene[0], 238);
  assert.deepEqual([...r.toene].sort((a, b) => a - b), TL.toene);
  for (const m of ['light', 'dark']) assert.ok(pruefeReihen(r[m]).abstand >= 1, m);
});
test('Probe-Marke (orange): alle Schwellen erfüllt', () => {
  const r = diagrammReihen({ ...TL, toene: [111, 136, 187, 242, 271, 301, 330, 359], marke: '#E8541E' });
  assert.ok(r.abstand >= 1, JSON.stringify(r.schwaechstes));
});
test('deterministisch, unabhängig von der Reihenfolge der Eingabe', () => {
  assert.deepEqual(diagrammReihen(TL), diagrammReihen({ ...TL, toene: [...TL.toene].reverse() }));
});
test('Chroma zwischen 0,10 und 0,15', () => {
  for (const hex of [...diagrammReihen(TL).light, ...diagrammReihen(TL).dark]) {
    const { C } = hexZuOklch(hex);
    assert.ok(C >= 0.10 - 1e-3 && C <= 0.15 + 1e-3, `${hex} C ${C}`);
  }
});
test('eine unbunte Marke wirft nicht und nimmt Chroma 0,10', () => {
  const r = diagrammReihen({ ...TL, marke: '#6B6B6B' });
  for (const hex of r.light) assert.ok(hexZuOklch(hex).C <= 0.10 + 1e-3);
});
test('acht gelieferte Kategorien behalten ihre Nummern', () => {
  const fest = Object.fromEntries(TL.toene.map((t, i) => [i + 1, t]));
  assert.deepEqual(diagrammReihen({ ...TL, toene: [], fest }).toene, TL.toene);
});
test('eine gelieferte Kategorie behält ihre Nummer, die anderen ordnen sich um sie', () => {
  const r = diagrammReihen({ ...TL, toene: TL.toene.filter((t) => t !== 123), fest: { 4: 123 } });
  assert.equal(r.toene[3], 123);
});
test('eine Palette rechnet in höchstens 1 s', () => {
  const t0 = performance.now(); diagrammReihen(TL);
  assert.ok(performance.now() - t0 < 1000);
});
```

- [ ] **Step 2: Run, expect FAIL.**
- [ ] **Step 3: Implement.** Eingabetöne zuerst sortieren (Determinismus). Chroma aus der Marke (Global Constraints;
  unbunt → 0,10). Je Ton und Modus die Stufen aus `zulaessigeStufen`. Suche über Reihenfolge (Reihe 1 und gelieferte
  Nummern fest, bei acht Tönen höchstens 7! = 5040) und Helligkeiten beider Modi zugleich, Ziel und Gleichstand wie
  Global Constraints. Verfahren frei (Spec: dem Bauenden überlassen), z. B. Branch-and-Bound über die Positionen mit
  vorab berechneten Paarmatrizen; das Raster darf gröber als 0,01 sein, solange TopLogic `abstand ≥ 1` hält. Bezugswert:
  der zufällig gefundene Prototyp C erreichte `abstand` 1,04.
- [ ] **Step 4: Run, expect PASS** — `node --test test/diagramm.test.mjs`.
- [ ] **Step 5: Commit** `Ticket #29914: Paket -- diagrammReihen: Reihenfolge und Helligkeit je Modus gerechnet`

### Task 4: TopLogic-Werte — Rolle `category-N-mark`, neue Nummerierung

**Files:**
- Modify: `design-system/src/tokens.json` (beide Modi), `design-system/src/primitives.json`,
  `design-system/tools/lib/pairs.mjs`
- Test: `design-system/test/tokens.test.mjs`, `design-system/test/planen.test.mjs`
- Regenerate: `design-system/dist/` (`node tools/generate.mjs`)

**Interfaces:**
- Consumes: `diagrammReihen`, `pruefeReihen` (Tasks 2–3).
- Produces: `category-N-mark` in `T.color.light` und `T.color.dark`; Kategorie N trägt den Ton `diagrammReihen(TL).toene[N-1]`.

- [ ] **Step 1: Failing tests** in `tokens.test.mjs`
  - „eine Kategorie hat genau vier Rollen: subtle, border, surface und mark“: 32 Rollen je Modus, Muster
    `/^category-[1-8]-(subtle|border|surface|mark)$/` (ersetzt den Test mit drei Rollen).
  - „Diagrammreihen: TopLogic ist das Ergebnis der Rechnung“: Töne `t_k` = Farbton (Grad, gerundet) von
    `R.color.light['category-k-border']`; `diagrammReihen({ toene: t, marke: R.color.light['surface-brand'], gruende })`
    mit `gruende[m] = [surface-base, surface-layer]`; erwartet `toene` = `t` in derselben Reihenfolge (die Nummerierung ist
    schon die gerechnete) und `R.color[m]['category-k-mark'] === r[m][k-1]` für beide Modi.
  - „Diagrammreihen halten die Schwellen“: `pruefeReihen` über `category-1..8-mark` je Modus, `abstand ≥ 1`; dazu
    `ratio(mark, surface-base|surface-layer) ≥ 3.0`; kein `mark` gleicht einem Wert `status-*` desselben Modus (§2).
  - `planen.test.mjs` „gefüllte Fläche je Kategorie“: `soll` permutiert wie die Kategorien (die Liste unten in Step 3).
- [ ] **Step 2: Run, expect FAIL** — `cd design-system && node --test test/tokens.test.mjs test/planen.test.mjs`.
- [ ] **Step 3: Werte setzen.**
  1. `diagrammReihen` für TopLogic laufen lassen, mit genau den Eingaben des Tests: Töne = Farbton der heutigen
     `category-1..8-border` (hell), auf ganze Grad gerundet (≈ 2°, 56°, 123°, 186°, 238°, 285°, 311°, 337°); Marke
     `R.color.light['surface-brand']`; Gründe aus `resolve`. Sonst weichen Test und Werte um Rundungen ab.
  2. Neue Kategorie N = alte Kategorie, deren Ton `toene[N-1]` ist: `subtle`, `border` und `surface` beider Modi werden
     als Block umgehängt (Referenzen permutieren, keine neuen Werte).
  3. Die 16 `mark`-Werte als Primitive in `primitives.json`, Namen über `primitiveAbleiten` (alle Farbwerte zusammen
     neu ableiten, damit keine Stufe doppelt vergeben ist; bestehende Namen dürfen sich dabei nicht ändern — sonst stoppen
     und melden). `category-N-mark` je Modus referenziert sie.
  4. `pairs.mjs`: für k = 1..8 `paar('category-k-mark', 'surface-base', 3.0)` und `paar('category-k-mark', 'surface-layer', 3.0)`.
- [ ] **Step 4: Generate und alle Gates** — `node tools/generate.mjs && node tools/lint-css.mjs && node --test`.
  Erwartet grün bis auf `published.test.mjs` (die Kopie folgt in Task 7). Rot an anderer Stelle (Specimen, Kalender,
  Avatar, Pill mit Sollwerten je Nummer) → die Sollwerte permutieren wie in Step 3.2, nie die Rechnung ändern.
- [ ] **Step 5: Commit** `Ticket #29914: Paket -- category-N-mark je Modus, Kategorien nach der Rechnung nummeriert`

### Task 5: `derive` rechnet die Reihen für Kundenthemes

**Files:**
- Modify: `design-system/tools/derive.mjs` (Schritt 3, nach `kategorienVerteilen`)
- Test: `design-system/test/derive.test.mjs`
- Regenerate: `design-system/specimen/probe.theme.css` (`node tools/derive.mjs test/fixtures/probe.primitives.json specimen/probe.theme.css`)

**Interfaces:**
- Consumes: `diagrammReihen`, `pruefeReihen`.
- Produces: im Theme-CSS `--tl-category-N-mark` beider Modi; Hinweis bei verfehlter Schwelle.

- [ ] **Step 1: Failing tests** in `derive.test.mjs`
  - „das Probe-Theme trägt Diagrammreihen, die die Schwellen halten“: aus dem Ergebnis von `derive` je Modus
    `pruefeReihen(category-1..8-mark).abstand ≥ 1` und jede `mark` ≥ 3,0 auf den Gründen des Probe-Themes (warmes Grau).
  - „die Kategorie N trägt in allen vier Rollen denselben Ton“: Farbton von `category-N-border` und `-mark` (hell)
    höchstens 3° auseinander, für N = 1..8, im Probe-Ergebnis.
  - „zwei gelieferte Kategorien mit demselben Ton: Datei, Exit 0, Hinweis mit dem schwächsten Paar“:
    Eingabe `{ theme: 'gleich', color: { category: { 'category-1': '#0B5ED7', 'category-2': '#0B5ED7' } } }`;
    erwartet kein Wurf, ein Hinweis, der `Diagrammreihen` und die Werte nennt.
  - „Markentöne von 0° bis 355°: Befunde festgehalten“: je 5° eine Marke mit L 0,55, C 0,19 (`oklchZuHex`), TopLogic-Grau;
    die Liste der Töne mit Hinweis wird als Konstante im Test festgehalten (erst laufen lassen, dann eintragen);
    TopLogic-Blau und die Probe-Marke stehen nicht darin. Laufzeit der ganzen Schleife < 60 s.
- [ ] **Step 2: Run, expect FAIL.**
- [ ] **Step 3: Implement.** Nach der Verteilung: freie Töne = `toene` aus `kategorienVerteilen`, `fest` = gelieferte
  Kategorien (Nummer → Grad); `diagrammReihen({ toene, fest, marke: Rk.color.light['surface-brand'], gruende })`.
  `toneJeKategorie[k] = r.toene[k-1]` **vor** `kategorieRollen`, damit alle Rollen der Nummer folgen; dann
  `setze(mode, 'category-k-mark', r[mode][k-1])`. `r.abstand < 1` →
  `hinweise.push(\`Diagrammreihen ${a} und ${b} trennen sich ${modus} nur mit ΔE ${wert} (${art}, gefordert ${soll}); Ursache ist die gelieferte Farbe\`)`
  (Spec §8: Befund, kein Abbruch). Kontrast und Chroma kann die Suche nicht verfehlen (nur zulässige Stufen).
- [ ] **Step 4: Probe neu erzeugen, alle Gates** — Befehl oben, dann `node --test`. Erwartet grün bis auf `published`.
- [ ] **Step 5: Commit** `Ticket #29914: Paket -- derive rechnet Diagrammreihen; Probe-Theme neu`

### Task 6: Verträge, Specimen, Doku

**Files:**
- Modify: `design-system/src/components/chart/chart.contract.md`, `design-system/src/components/chart/chart.spec.html`,
  `design-system/test/contracts-5d.test.mjs`, `docs/skalen.md`, `docs/ui-durchgang.md`
- Check: `design-system/src/components/pill/pill.contract.md`, `avatar.contract.md` (nennen sie Töne je Nummer?)

- [ ] **Step 1: Failing test** — in `contracts-5d.test.mjs` den Begriff `'--tl-category-1-surface', '--tl-category-8-surface'`
  für `chart/chart.contract.md` durch `'--tl-category-1-mark', '--tl-category-8-mark'` ersetzen; FAIL erwartet.
- [ ] **Step 2: Vertrag** `chart.contract.md`: Tabelle „Farben im Canvas“: Reihe N `--tl-category-N-mark`; Flächen
  deckend; Punkte deckend (`pointBackgroundColor`); Fläche unter Linie/Radar bei `fill` 20 % Deckkraft; Fuge zwischen
  Segmenten (Ring, Torte, Polar) in `--tl-surface-layer`; Absatz „Konformität“ entsprechend. Spec §9.
- [ ] **Step 3: Specimen** `chart.spec.html`: liest `--tl-category-N-mark`, malt deckend; ein Ring mit sechs Segmenten
  und Fuge, hell und dunkel nebeneinander, damit Hendrik abnehmen kann.
- [ ] **Step 4: `skalen.md`** neuer Abschnitt „Diagramme rechnen ihre Reihen (22.10., Hendrik)“ unter Welle 5d: Befund,
  Entscheidung (§1–§11 knapp), Verworfen (Termin-Füllung, fremde Palette, Marke als Reihe, harte Hälften-Regel);
  Kategorietabelle (Ton je Nummer) auf die neue Nummerierung. `ui-durchgang.md`: Mengenskala aus der Marke;
  Hervorheben (alles grau, eine Reihe farbig).
- [ ] **Step 5: Gates** — `cd design-system && node tools/lint-css.mjs && node --test` grün bis auf `published`.
- [ ] **Step 6: Commit** `Ticket #29914: Paket -- Vertrag und Specimen der Diagrammreihen; skalen.md, ui-durchgang.md`

### Checkpoint: Sichtabnahme durch Hendrik

`cd design-system && node tools/serve.mjs` → `http://localhost:8137/` Chart-Specimen hell und dunkel, dazu Kalender,
Pill und Avatar (neue Nummerierung). Erst nach Hendriks Ok weiter. Befunde → zurück in Task 3 (Ziel) oder Task 6.

### Task 7: Engine malt mit `category-N-mark`

**Files** (Worktree `_Working-Tree/tl8-wt-29584`, Branch `CWS/CWS_29914_design_system_welle_5d`):
- Modify: `com.top_logic.layout.react.chartjs/react-src/controls/chart/useThemeDefaults.ts`
- Test: `com.top_logic.layout.react.mui/react-src/adapters/chart.test.tsx`
- Regenerate: `com.top_logic.layout.react/src/main/webapp/style/tl-design-system/*` über `node tools/publish-to-worktree.mjs` (im Paket)

**Interfaces:**
- Consumes: `--tl-category-N-mark`, `--tl-surface-layer` am `<html>`.

- [ ] **Step 1: Failing tests** in `chart.test.tsx`: `applyTokens` setzt `--tl-category-${i+1}-mark`; Erwartungen:
  Balken `backgroundColor` = `LIGHT[i % 8]` (ohne `'cc'`); Ring `backgroundColor` = `[LIGHT[0], LIGHT[1], LIGHT[2]]`,
  `borderColor` = `COLORS.light.layer` je Segment; Linie `backgroundColor` = `LIGHT[0] + '33'`,
  `pointBackgroundColor` = `LIGHT[0]`, `fill` false; unlesbare Kategorie: `COLORS.light.grid` ohne Suffix; der Test
  „rgb() oder kurzes Hex“ auf `-mark`. Kopfkommentar des Tests nennt `-mark`.
- [ ] **Step 2: Run, expect FAIL** — `cd com.top_logic.layout.react.mui && NODE_OPTIONS=--no-experimental-webstorage npx vitest run react-src/adapters/chart.test.tsx`.
- [ ] **Step 3: Implement** in `useThemeDefaults.ts`: Token `--tl-category-${i + 1}-mark`; `FILL_ALPHA` entfällt; Ring/Torte/
  Polar: `borderColor` = gelesener `--tl-surface-layer` (fehlt er, kein `borderColor` setzen); Linie/Radar:
  `pointBackgroundColor` = Farbe, sofern der Server keinen setzt; `POINT_ALPHA` umbenennen in `AREA_ALPHA` (`'33'`,
  Fläche unter Linie/Radar). JSDoc nachziehen. Server-Farben gewinnen weiter.
- [ ] **Step 4: Kopie publizieren und Gates** — im Paket `node tools/publish-to-worktree.mjs && node --test` (jetzt auch
  `published` grün); in der Engine: Vitest wie Step 2 (ganze Suite: `npx vitest run`), in `com.top_logic.layout.react.chartjs`
  `npm run build` (tsc 0, Vite grün), `JAVA_HOME=$(/usr/libexec/java_home -v 21) mvn -o -q -Duser.language=en test -pl com.top_logic.layout.react,com.top_logic.layout.react.chartjs`,
  `tools/check-messages-en.sh` ohne Diff.
- [ ] **Step 5: Commit (Engine, englisch)** `Ticket #29914: Charts paint with the computed category marks (category-N-mark): opaque fills, filled points, a surface seam between segments`;
  Paket-Commit nur, falls `publish` dort etwas ändert.

### Task 8: master-Merge (!1966) und Abschluss

- [ ] **Step 1:** `git fetch` im Engine-Worktree; prüfen, ob Bernhard auf den Branch gepusht hat (sonst auf seinem Head aufsetzen).
- [ ] **Step 2:** `git merge origin/master` (Nachricht `Ticket #29914: Merge master (!1966 #29887 text suggestions).`);
  Konflikte in `bridge-entry.ts`, `parts.ts`, `controls-entry.ts`, `TLTableView.tsx`, `I18NConstants`/`messages_*`
  beidseitig übernehmen; die Paketkopie nur über `publish-to-worktree.mjs`.
- [ ] **Step 3: Gates** wie Task 7 Step 4, dazu Maven `layout.view`, `demo.react`; Ergebnis mit Zahlen melden.
- [ ] **Step 4:** `STATUS.md` (Paket) nachziehen: Diagrammfarben fertig, vierter master-Merge, nichts gepusht; Commit
  `Ticket #29914: STATUS -- Diagrammfarben, vierter master-Merge (!1966)`.
- [ ] **Step 5: Melden, nicht pushen.** Push von Engine-Branch und Paket-`main` nur nach Hendriks Freigabe (Repo und
  Branch nennen), danach PR-Text von !1939 ergänzen, `jenkins` neu anfragen, Merge versuchen.
