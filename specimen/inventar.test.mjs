import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { deklarationen, inPixel, themeTokens, aufloesen, inventarisieren, lesestellen } from './inventar.mjs';

/** Das echte Stylesheet, wenn der Worktree da ist — sonst wird übersprungen statt zu scheitern. */
const MODUL = join(process.env.TL_WORKTREE ?? join(homedir(), 'git/tl8-wt-29584'),
  'com.top_logic.layout.react/src/main/webapp');
const ECHT = existsSync(join(MODUL, 'style/tlReactControls.css'))
  ? readFileSync(join(MODUL, 'style/tlReactControls.css'), 'utf8') : null;

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

// ---------------------------------------------------------------------------
// Lesestellen: wo liest das CSS welches Token, und als was?
//
// Die Abbildung sagt, WAS aus einem mehrdeutigen Token wird, aber nicht, an
// welcher Stelle welches Ziel gilt. Die Regel dazu ("trennt → separator,
// umschließt Bedientes → control") lässt sich nur anwenden, wenn die Stellen
// vorliegen — mit Selektor und Eigenschaft, nicht als Trefferzahl.
// ---------------------------------------------------------------------------

test('lesestellen findet Selektor, Eigenschaft und Token je Stelle', () => {
  const css = `.a { border-color: var(--border-subtle); }
               .b, .c { color: var(--text-primary); background: var(--border-subtle); }`;
  const stellen = lesestellen(css, 'border-subtle');
  assert.equal(stellen.length, 2);
  assert.deepEqual(stellen[0], { selektor: '.a', eigenschaft: 'border-color', wert: 'var(--border-subtle)', token: 'border-subtle' });
  assert.equal(stellen[1].selektor, '.b, .c');
  assert.equal(stellen[1].eigenschaft, 'background');
});

test('lesestellen sieht in Kurzformen hinein, nicht nur auf ganze Werte', () => {
  // border: 1px solid var(--x) ist die häufigste Schreibweise im Bestand.
  // Wer nur auf den ganzen Wert prüft, übersieht sie und zählt zu wenig.
  const stellen = lesestellen('.a { border: 1px solid var(--border-subtle); }', 'border-subtle');
  assert.equal(stellen.length, 1);
  assert.equal(stellen[0].eigenschaft, 'border');
});

test('lesestellen trennt Tokens mit gemeinsamem Anfang', () => {
  // --border-subtle und --border-subtle-hover sind zwei Tokens. Ein Muster,
  // das nur auf den Anfang prüft, wirft sie zusammen und verdirbt jede Zählung.
  const css = '.a { color: var(--border-subtle); } .b { color: var(--border-subtle-hover); }';
  assert.equal(lesestellen(css, 'border-subtle').length, 1);
  assert.equal(lesestellen(css, 'border-subtle-hover').length, 1);
});

test('lesestellen findet Regeln auch innerhalb von @media', () => {
  const css = '@media (max-width: 600px) { .a { border-color: var(--border-subtle); } }';
  const stellen = lesestellen(css, 'border-subtle');
  assert.equal(stellen.length, 1);
  assert.equal(stellen[0].selektor, '.a');
});

test('lesestellen nennt jede Eigenschaft einer Regel einzeln', () => {
  const css = '.a { border-color: var(--border-subtle); background: var(--border-subtle); }';
  assert.equal(lesestellen(css, 'border-subtle').length, 2);
});

test('lesestellen nimmt den Kommentar über einer Regel nicht für ihren Selektor', () => {
  // Im ausgelieferten CSS steht über fast jeder Regel ein Kommentar. Bleibt er
  // am Selektor kleben, ist die Stelle nicht mehr zuzuordnen — und genau das
  // Zuordnen ist der einzige Zweck dieser Auszählung.
  const css = `/* --- TLSplitPanel --- */\n\n.tlSplitPanel__splitter { background: var(--border-subtle); }`;
  assert.deepEqual(lesestellen(css, 'border-subtle').map((s) => s.selektor), ['.tlSplitPanel__splitter']);
});

test('lesestellen übersieht keine Stelle, deren Kommentar selbst geschweifte Klammern enthält', () => {
  const css = '/* nimmt { und } mit */ .a { color: var(--x); }';
  assert.deepEqual(lesestellen(css, 'x').map((s) => s.selektor), ['.a']);
});

test('lesestellen am echten Stylesheet — border-subtle steht dort dreistellig oft', { skip: !ECHT && 'Worktree nicht da' }, () => {
  const stellen = lesestellen(ECHT, 'border-subtle');
  assert.ok(stellen.length > 50, `nur ${stellen.length} Stellen gefunden`);
  for (const s of stellen) {
    assert.ok(s.selektor.length > 0, 'Stelle ohne Selektor');
    assert.ok(s.eigenschaft.length > 0, 'Stelle ohne Eigenschaft');
    assert.ok(!s.selektor.includes('/*') && !s.selektor.includes('*/'),
      `Kommentar im Selektor: ${s.selektor.slice(0, 60)}`);
  }
});
