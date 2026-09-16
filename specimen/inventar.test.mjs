import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deklarationen, inPixel, themeTokens, aufloesen, inventarisieren } from './inventar.mjs';

test('liest Deklarationen samt Kurzform und Mehrfachwerten', () => {
  const css = `.a { font-size: 14px; }
.b { font-size: var(--label-01-font-size); color: red }
.c{font-size:.72rem}`;
  assert.deepEqual(deklarationen(css, 'font-size'),
    ['14px', 'var(--label-01-font-size)', '.72rem']);
});

test('zählt eine Eigenschaft nicht, wenn sie nur Teil eines längeren Namens ist', () => {
  const css = '.a { border-top-width: 2px; width: 100px; }';
  assert.deepEqual(deklarationen(css, 'width'), ['100px']);
});

test('rechnet in Pixel um und erkennt, was sich nicht umrechnen lässt', () => {
  assert.equal(inPixel('14px'), 14);
  assert.equal(inPixel('.875rem'), 14);
  assert.equal(inPixel('0.72rem'), 11.52);
  assert.equal(inPixel('1.5rem', 10), 15);
  assert.equal(inPixel('inherit'), null);
  assert.equal(inPixel('0.875em'), null);
});

test('liest die Token-Werte aus der Theme-Konfiguration, gleich welcher Typ', () => {
  // Die Konfiguration führt je nach Art des Wertes <text>, <length> oder
  // <color>. Wer nur <text> liest, übersieht genau die Typo-Tokens.
  const xml = `<theme>
    <text name="font-family" value="'Inter'"/>
    <length name="body-compact-01-font-size" value=".875rem"/>
    <length name="label-01-font-size" value=".75rem"/>
    <color name="interactive" value="#2968C8"/>
  </theme>`;
  assert.deepEqual(themeTokens(xml), {
    'font-family': "'Inter'",
    'body-compact-01-font-size': '.875rem',
    'label-01-font-size': '.75rem',
    interactive: '#2968C8',
  });
});

test('löst var() über die Theme-Tokens auf, auch verschachtelt', () => {
  const tokens = { a: 'var(--b)', b: '12px' };
  assert.equal(aufloesen('var(--a)', tokens), '12px');
  assert.equal(aufloesen('14px', tokens), '14px');
  assert.equal(aufloesen('var(--unbekannt)', tokens), 'var(--unbekannt)');
});

test('bricht eine Referenzschleife ab, statt hängen zu bleiben', () => {
  assert.equal(aufloesen('var(--a)', { a: 'var(--b)', b: 'var(--a)' }), 'var(--a)');
});

test('das Inventar gruppiert nach Pixelwert und nennt die Herkunft', () => {
  const css = `.a { font-size: 14px } .b { font-size: var(--body) } .c { font-size: .875rem }`;
  const bericht = inventarisieren(css, { body: '.875rem' });
  const vierzehn = bericht.schriftgroessen.werte.find((w) => w.px === 14);
  assert.equal(vierzehn.anzahl, 3);
  assert.deepEqual(vierzehn.herkunft.sort(), ['.875rem', '14px', 'var(--body)']);
  assert.equal(bericht.schriftgroessen.deklarationen, 3);
});

test('das Inventar findet die Lücken in einer Abstandsleiter', () => {
  const css = `.a{padding:6px}.b{gap:12px}.c{margin:10px}.d{padding:8px}.e{gap:16px}`;
  const { luecke } = inventarisieren(css, {}, { leiter: [4, 8, 16, 24] }).abstaende;
  assert.deepEqual(luecke.map((l) => l.px).sort((a, b) => a - b), [6, 10, 12]);
});
