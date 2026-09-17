import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hexZuOklch, oklchZuHex, beschriftungAbleiten, farbtonAbstand } from '../tools/lib/color.mjs';

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
