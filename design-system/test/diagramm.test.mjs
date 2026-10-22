import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DIAGRAMM, diagrammPaare, pruefeReihen, zulaessigeStufen, diagrammReihen, groessterSprung } from '../tools/lib/diagramm.mjs';
import { ratio } from '../tools/lib/contrast.mjs';
import { hexZuOklch } from '../tools/lib/color.mjs';

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
  assert.equal(r.schwaechstes.soll, DIAGRAMM.ROT_GRUEN);
  assert.ok(Math.abs(r.abstand - r.schwaechstes.wert / r.schwaechstes.soll) < 1e-12);
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

test('zulässige Stufen: Raster 0,02 ab der Untergrenze, aufsteigend, ohne Drift', () => {
  for (const [modus, gruende] of [['light', ['#FAFAFA', '#FFFFFF']], ['dark', ['#16181B', '#1D2023']]]) {
    const [unten, oben] = DIAGRAMM.BAND[modus];
    const s = zulaessigeStufen(238, 0.15, modus, gruende);
    for (let i = 0; i < s.length; i++) {
      // L ist exakt die Hundertstel-Zahl durch 100, keine aufsummierte Drift.
      assert.ok(Math.abs(Math.round(s[i].L * 100) - s[i].L * 100) < 1e-9, `L ${s[i].L}`);
      assert.equal(s[i].L, Math.round(s[i].L * 100) / 100);
      assert.equal((Math.round(s[i].L * 100) - Math.round(unten * 100)) % 2, 0, `${modus} ${s[i].L}`);
      if (i > 0) assert.equal(Math.round((s[i].L - s[i - 1].L) * 100), 2);
    }
    assert.ok(s.at(-1).L <= oben);
  }
  // Dunkel: 0,77 liegt zwischen zwei Stufen, die letzte ist 0,76; hell reicht das Band bis 0,77.
  assert.equal(zulaessigeStufen(238, 0.15, 'dark', ['#16181B', '#1D2023']).at(-1).L, 0.76);
});

test('zulässige Stufen: der Kontrast schneidet die dunkle Seite ab', () => {
  // 0,48 auf #1D2023 bringt nur 2,55:1, 0,52 trägt 3:1.
  assert.equal(zulaessigeStufen(238, 0.15, 'dark', ['#16181B', '#1D2023'])[0].L, 0.52);
  // Hell: 0,43 und 0,44 bleiben unter C 0,098 (0,0958 und 0,0979), erst 0,45 reicht.
  const hell = zulaessigeStufen(238, 0.15, 'light', ['#FAFAFA', '#FFFFFF']);
  assert.equal(hell[0].L, 0.45);
  assert.ok(hexZuOklch(hell[0].hex).C >= DIAGRAMM.CHROMA_MIN - 2e-3);
});

test('zulässige Stufen: keine Stufe unter Chroma 0,10 abzüglich Toleranz', () => {
  // Gelbgrün (H 125) trägt auf der dunklen Seite des Hellbands nicht C 0,10: die Stufen fallen weg.
  const alle = zulaessigeStufen(125, 0.15, 'light', ['#FAFAFA', '#FFFFFF']);
  for (const { hex } of alle) assert.ok(hexZuOklch(hex).C >= DIAGRAMM.CHROMA_MIN - 2e-3, hex);
  // Mit Chroma-Wunsch 0,05 ist jede Stufe zu blass: nichts bleibt übrig.
  assert.deepEqual(zulaessigeStufen(238, 0.05, 'light', ['#FAFAFA', '#FFFFFF']), []);
});

// --- Die Suche: Reihenfolge und Helligkeit je Modus ---

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
    assert.ok(C >= 0.10 - 2e-3 && C <= 0.15 + 2e-3, `${hex} C ${C}`);
  }
});
test('eine unbunte Marke wirft nicht, nimmt Chroma 0,10 und beginnt mit dem kleinsten Ton', () => {
  const r = diagrammReihen({ ...TL, marke: '#6B6B6B' });
  assert.equal(r.toene[0], 2);
  for (const hex of r.light) assert.ok(hexZuOklch(hex).C <= 0.10 + 2e-3);
});
test('der Helligkeitssprung je Reihe bleibt bei TopLogic und der Probe-Marke ≤ 0,5', () => {
  for (const eingabe of [TL, { ...TL, toene: [111, 136, 187, 242, 271, 301, 330, 359], marke: '#E8541E' }])
    assert.ok(groessterSprung(diagrammReihen(eingabe), eingabe) <= 0.5);
});
test('acht gelieferte Kategorien behalten ihre Nummern', () => {
  const fest = Object.fromEntries(TL.toene.map((t, i) => [i + 1, t]));
  assert.deepEqual(diagrammReihen({ ...TL, toene: [], fest }).toene, TL.toene);
});
test('eine gelieferte Kategorie behält ihre Nummer, die anderen ordnen sich um sie', () => {
  const r = diagrammReihen({ ...TL, toene: TL.toene.filter((t) => t !== 123), fest: { 4: 123 } });
  assert.equal(r.toene[3], 123);
});

test('abstand und schwaechstes sind die des Prüfers, über beide Modi', () => {
  const r = diagrammReihen(TL);
  const je = { light: pruefeReihen(r.light), dark: pruefeReihen(r.dark) };
  assert.equal(r.abstand, Math.min(je.light.abstand, je.dark.abstand));
  assert.deepEqual(r.schwaechstes, { modus: r.schwaechstes.modus, ...je[r.schwaechstes.modus].schwaechstes });
  assert.equal(je[r.schwaechstes.modus].abstand, r.abstand);
  // Jede Marke ist eine zulässige Stufe ihres Tons: Kontrast und Chroma hält die Suche nie verfehlt.
  r.toene.forEach((ton, k) => {
    for (const m of ['light', 'dark']) {
      const stufen = zulaessigeStufen(ton, 0.15, m, TL.gruende[m]).map((s) => s.hex);
      assert.ok(stufen.includes(r[m][k]), `${m} Reihe ${k + 1}`);
    }
  });
});

test('das gemerkte Ergebnis lässt sich vom Aufrufer nicht verändern', () => {
  const r = diagrammReihen(TL);
  const vorher = structuredClone(r);
  r.light[0] = '#000000';
  r.toene.reverse();
  assert.deepEqual(diagrammReihen(TL), vorher);
});

test('nicht genau acht Töne oder eine Nummer außerhalb 1–8 werfen', () => {
  assert.throws(() => diagrammReihen({ ...TL, toene: TL.toene.slice(1) }), /8/);
  assert.throws(() => diagrammReihen({ ...TL, toene: TL.toene.slice(1), fest: { 9: 56 } }), /1–8/);
});
