import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DIAGRAMM, diagrammPaare, pruefeReihen, zulaessigeStufen } from '../tools/lib/diagramm.mjs';
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
