import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hexZuOklch, oklchZuHex, beschriftungAbleiten, farbtonAbstand, aufKontrast } from '../tools/lib/color.mjs';
import { ratio } from '../tools/lib/contrast.mjs';

test('Hex → OKLCH → Hex ist verlustfrei bis auf Rundung', () => {
  for (const hex of ['#0B5ED7', '#FAFAFA', '#16181B', '#D7352D'])
    assert.equal(oklchZuHex(hexZuOklch(hex)).hex.toUpperCase(), hex);
});

test('die Beschriftung nimmt den Kandidaten mit dem höheren Kontrast', () => {
  const k = { dunklerKandidat: '#1B1D21', hellerKandidat: '#FFFFFF' };
  assert.equal(beschriftungAbleiten('#0B5ED7', k).hex.toUpperCase(), '#FFFFFF');
  assert.equal(beschriftungAbleiten('#5394FF', k).hex.toUpperCase(), '#1B1D21');
});

test('der Farbtonabstand ist symmetrisch und misst über den kurzen Bogen', () => {
  const a = farbtonAbstand('#DFEBFF', '#CEF3FB'), b = farbtonAbstand('#CEF3FB', '#DFEBFF');
  assert.ok(Math.abs(a - b) < 1e-9);
  assert.ok(a > 30 && a <= 180);
});

test('aufKontrast senkt L einer hellen Marke, bis Text auf Weiß 4,5 erreicht, und hält den Farbton', () => {
  const hell = '#F39C6B';
  const r = aufKontrast(hell, ['#FFFFFF', '#FAFAFA'], 4.5, 'dunkler');
  assert.ok(r.angepasst);
  assert.ok(ratio(r.hex, '#FFFFFF') >= 4.5 && ratio(r.hex, '#FAFAFA') >= 4.5);
  assert.ok(Math.abs(hexZuOklch(r.hex).H - hexZuOklch(hell).H) < 0.05);
});

test('aufKontrast lässt einen Wert, der schon trägt, unverändert', () => {
  const r = aufKontrast('#0B5ED7', ['#FFFFFF'], 4.5, 'dunkler');
  assert.equal(r.hex, '#0B5ED7');
  assert.equal(r.angepasst, false);
});

test('aufKontrast hebt L im dunklen Modus', () => {
  const r = aufKontrast('#3A2A1A', ['#16181B'], 3.0, 'heller');
  assert.ok(r.angepasst && ratio(r.hex, '#16181B') >= 3.0);
});
