// Die Komponente ist fertig, wenn jede Erscheinung × Tönung × Modus die Anforderung erfüllt —
// gegen beide Flächen, auf denen ein Button liegen kann.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ratio, AA_TEXT, AA_NON_TEXT } from '../tools/lib/contrast.mjs';
import { resolve } from '../tools/resolve.mjs';

const P = JSON.parse(readFileSync(new URL('../src/primitives.json', import.meta.url)));
const T = JSON.parse(readFileSync(new URL('../src/tokens.json', import.meta.url)));
const R = resolve(P, T); // R.color[mode] / R.derived[mode]: Rolle → Hex

const GRUND = ['surface-base', 'surface-layer'];

/** Was jede Kombination liest — dieselben Namen wie in button.css. */
const BUTTON = {
  primary:            { fill: 'surface-brand', text: 'text-on-brand' },
  'primary-hover':    { fill: 'surface-brand-hover', text: 'text-on-brand-hover' },
  'primary-active':   { fill: 'surface-brand-active', text: 'text-on-brand-active' },
  secondary:          { text: 'text-primary', line: 'border-control' },
  'secondary-hover':  { fill: 'surface-interactive-hover', text: 'text-primary', line: 'border-control' },
  'secondary-active': { fill: 'surface-interactive-active', text: 'text-primary', line: 'border-control' },
  ghost:              { text: 'text-primary' },
  'ghost-hover':      { fill: 'surface-interactive-hover', text: 'text-primary' },
  'ghost-active':     { fill: 'surface-interactive-active', text: 'text-primary' },
  link:               { text: 'text-link' },
  'link-hover':       { text: 'text-link-hover' },
  pressed:            { fill: 'surface-brand-subtle', text: 'text-primary', line: 'border-interactive' },
  'pressed-hover':    { fill: 'surface-brand-subtle-hover', text: 'text-primary', line: 'border-interactive' },
  'danger-primary':   { fill: 'status-error-surface', text: 'text-on-status-error' },
  'danger-primary-hover':  { fill: 'status-error-surface-hover', text: 'text-on-status-error-hover' },
  'danger-primary-active': { fill: 'status-error-surface-active', text: 'text-on-status-error-active' },
  'danger-secondary': { text: 'status-error-text', line: 'status-error-border' },
  'danger-secondary-hover': { fill: 'status-error-surface', text: 'text-on-status-error' },
  'danger-secondary-active': { fill: 'status-error-surface-active', text: 'text-on-status-error-active' },
  'danger-ghost':     { text: 'status-error-text' },
  'danger-ghost-hover': { fill: 'status-error-surface', text: 'text-on-status-error' },
  'danger-ghost-active': { fill: 'status-error-surface-active', text: 'text-on-status-error-active' },
  // Disabled ist vom Kontrast-Gate ausgenommen (WCAG 1.4.3 nimmt inaktive Bedienelemente aus;
  // skalen.md „Disabled: vier Rollen ohne Gate“) — nur Token-Existenz wird geprüft, keine Ratio.
  disabled:           { fill: 'surface-disabled', text: 'text-disabled', line: 'border-disabled', exempt: true },
  'ghost-disabled':   { text: 'text-disabled', exempt: true },
};

for (const mode of ['light', 'dark']) {
  const C = { ...R.color[mode], ...R.derived[mode] };
  test(`Button ${mode}: Text 4,5 und Linie 3,0 in jeder Erscheinung × Tönung, auf base und layer`, () => {
    for (const [name, k] of Object.entries(BUTTON)) {
      for (const g of GRUND) {
        // Exempt (disabled, ghost-disabled): nur prüfen, dass die Token existieren, keine Ratio-Assertion.
        if (k.exempt) {
          if (k.fill) assert.ok(C[k.fill], `${name}: Token ${k.fill} fehlt`);
          assert.ok(C[k.text], `${name}: Token ${k.text} fehlt`);
          if (k.line) assert.ok(C[k.line], `${name}: Token ${k.line} fehlt`);
          continue;
        }
        const flaeche = k.fill ? C[k.fill] : C[g];
        assert.ok(C[k.text], `${name}: Token ${k.text} fehlt`);
        const t = ratio(C[k.text], flaeche);
        assert.ok(t >= AA_TEXT, `${mode} ${name} auf ${g}: Text ${k.text} ${t.toFixed(2)} < 4,5`);
        if (k.line) {
          const l = ratio(C[k.line], C[g]);
          assert.ok(l >= AA_NON_TEXT, `${mode} ${name} auf ${g}: Linie ${k.line} ${l.toFixed(2)} < 3,0`);
        }
        if (k.fill && !k.line) {
          // Eine gefüllte Fläche ohne Linie muss sich vom Grund abheben, sonst ist der Button unsichtbar.
          const f = ratio(C[k.fill], C[g]);
          assert.ok(f >= AA_NON_TEXT || /hover|active|pressed/.test(name), `${mode} ${name} auf ${g}: Fläche ${k.fill} ${f.toFixed(2)} < 3,0`);
        }
      }
    }
  });
}

test('disabled liest die drei Disabled-Rollen und sonst nichts', () => {
  const css = readFileSync(new URL('../src/components/button/button.css', import.meta.url), 'utf8');
  const block = /\.tl-button:disabled[^{]*\{([^}]*)\}/.exec(css);
  assert.ok(block, ':disabled-Regel fehlt');
  const vars = [...block[1].matchAll(/var\((--tl-[a-z0-9-]+)\)/g)].map((m) => m[1]).sort();
  assert.deepEqual(vars, ['--tl-border-disabled', '--tl-surface-disabled', '--tl-text-disabled'].sort());
});

test('das Button-Specimen zeigt jede Erscheinung, die Tönung, sm, und jeden Zustand', () => {
  const html = readFileSync(new URL('../src/components/button/button.spec.html', import.meta.url), 'utf8');
  for (const m of ['primary', 'secondary', 'ghost', 'link', 'danger', 'sm'])
    assert.ok(html.includes(`tl-button--${m}`), `Modifier ${m} fehlt`);
  for (const attr of ['disabled', 'aria-pressed="true"', 'aria-busy="true"', 'aria-label='])
    assert.ok(html.includes(attr), `Zustand ${attr} fehlt`);
  assert.ok(html.includes('tl-button__icon') && html.includes('tl-button__label'), 'Elemente fehlen');
  assert.ok(html.includes('id="mode"') && html.includes('id="density"'), 'Schalter für Modus und Dichte fehlen');
  assert.ok(html.includes('/dist/components.css'), 'lädt components.css nicht');
  assert.ok(!/style="/.test(html.replace(/<style>[\s\S]*?<\/style>/, '')), 'Inline-Style im Specimen');
});

test('jedes Farb-Token in button.css kommt in der BUTTON-Map vor', () => {
  const css = readFileSync(new URL('../src/components/button/button.css', import.meta.url), 'utf8');
  const farbTokens = new Set(
    [...css.matchAll(/var\((--tl-(?:surface|text|icon|border|status)-[a-z0-9-]+)\)/g)]
      .map((m) => m[1])
      .filter((t) => !/^--tl-border-width-/.test(t)) // Maß-Rolle, kein Farbwert
  );
  const belegt = new Set();
  for (const k of Object.values(BUTTON)) {
    for (const rolle of [k.fill, k.text, k.line]) if (rolle) belegt.add(rolle);
  }
  for (const t of farbTokens) {
    const rolle = t.replace(/^--tl-/, '');
    assert.ok(belegt.has(rolle), `${t} kommt in keinem BUTTON-Map-Eintrag vor`);
  }
});

test('der Vertrag nennt jedes Token, das button.css liest, und jedes Zustandsattribut', () => {
  const css = readFileSync(new URL('../src/components/button/button.css', import.meta.url), 'utf8');
  const md = readFileSync(new URL('../src/components/button/button.contract.md', import.meta.url), 'utf8');
  const tokens = new Set([...css.matchAll(/var\((--tl-[a-z0-9-]+)\)/g)].map((m) => m[1]));
  for (const t of tokens) assert.ok(md.includes('`' + t + '`'), `Vertrag nennt ${t} nicht`);
  for (const a of ['disabled', 'aria-pressed', 'aria-busy', 'aria-label', 'focus-visible'])
    assert.ok(md.includes(a), `Vertrag nennt ${a} nicht`);
  for (const h of ['## Zustand', '## Aktionen', '## Tokens', '## Attribute', '## Konformität'])
    assert.ok(md.includes(h), `Abschnitt ${h} fehlt`);
});

// --- Pill --------------------------------------------------------------------------------------
// Jede Rolle liest eine getönte Fläche und eine Linie; der Text darauf ist gewöhnlicher Text.
// skalen.md „Pill: Rolle statt Farbe“.
const PILL = {
  neutral:  { fill: 'surface-interactive-selected', line: 'border-control' },
  brand:    { fill: 'surface-brand-subtle', line: 'border-interactive' },
  error:    { fill: 'status-error-subtle', line: 'status-error-border' },
  warning:  { fill: 'status-warning-subtle', line: 'status-warning-border' },
  success:  { fill: 'status-success-subtle', line: 'status-success-border' },
  info:     { fill: 'status-info-subtle', line: 'status-info-border' },
  ...Object.fromEntries([1, 2, 3, 4, 5, 6, 7, 8].map((k) => [`category-${k}`, { fill: `category-${k}-subtle`, line: `category-${k}-border` }])),
};

for (const mode of ['light', 'dark']) {
  const C = { ...R.color[mode], ...R.derived[mode] };
  test(`Pill ${mode}: Text 4,5 auf jeder Fläche, Linie 3,0 gegen base und layer, in jeder Rolle`, () => {
    for (const [name, k] of Object.entries(PILL)) {
      assert.ok(C[k.fill], `${name}: Token ${k.fill} fehlt`);
      assert.ok(C[k.line], `${name}: Token ${k.line} fehlt`);
      const t = ratio(C['text-primary'], C[k.fill]);
      assert.ok(t >= AA_TEXT, `${mode} ${name}: text-primary auf ${k.fill} ${t.toFixed(2)} < 4,5`);
      for (const g of GRUND) {
        const l = ratio(C[k.line], C[g]);
        assert.ok(l >= AA_NON_TEXT, `${mode} ${name} auf ${g}: Linie ${k.line} ${l.toFixed(2)} < 3,0`);
      }
    }
  });
}

test('pill.css liest je Rolle genau die Fläche und die Linie der PILL-Map, und Text nur als text-primary', () => {
  const css = readFileSync(new URL('../src/components/pill/pill.css', import.meta.url), 'utf8');
  const farbTokens = new Set([...css.matchAll(/var\((--tl-(?:surface|text|icon|border|status|category)-[a-z0-9-]+)\)/g)]
    .map((m) => m[1]).filter((t) => !/^--tl-border-width-/.test(t)));
  const belegt = new Set(['text-primary']);
  for (const k of Object.values(PILL)) { belegt.add(k.fill); belegt.add(k.line); }
  for (const t of farbTokens) assert.ok(belegt.has(t.replace(/^--tl-/, '')), `${t} kommt in keinem PILL-Map-Eintrag vor`);
  for (const rolle of belegt) assert.ok(farbTokens.has('--tl-' + rolle), `pill.css liest ${rolle} nicht`);
  assert.ok(!/color-mix|#[0-9a-fA-F]{3}/.test(css), 'kein color-mix, kein Literal');
  for (const k of Object.keys(PILL).filter((n) => n !== 'neutral'))
    assert.ok(css.includes(`.tl-pill--${k}`), `Modifier --${k} fehlt`);
});

test('das Pill-Specimen zeigt jede Rolle, Icon und Beschriftung, auf beiden Flächen', () => {
  const html = readFileSync(new URL('../src/components/pill/pill.spec.html', import.meta.url), 'utf8');
  for (const k of Object.keys(PILL).filter((n) => n !== 'neutral'))
    assert.ok(html.includes(`tl-pill--${k}`), `Rolle ${k} fehlt`);
  assert.ok(html.includes('tl-pill__icon') && html.includes('tl-pill__label'), 'Elemente fehlen');
  assert.ok(html.includes('id="on-layer"') && html.includes('id="on-base"'), 'beide Flächen fehlen');
  assert.ok(html.includes('id="mode"') && html.includes('id="density"'), 'Schalter für Modus und Dichte fehlen');
  assert.ok(html.includes('/dist/components.css'), 'lädt components.css nicht');
  assert.ok(!/style="/.test(html.replace(/<style>[\s\S]*?<\/style>/, '')), 'Inline-Style im Specimen');
});

test('der Pill-Vertrag nennt jedes Token, das pill.css liest, und jede Rolle', () => {
  const css = readFileSync(new URL('../src/components/pill/pill.css', import.meta.url), 'utf8');
  const md = readFileSync(new URL('../src/components/pill/pill.contract.md', import.meta.url), 'utf8');
  for (const t of new Set([...css.matchAll(/var\((--tl-[a-z0-9-]+)\)/g)].map((m) => m[1])))
    assert.ok(md.includes('`' + t + '`'), `Vertrag nennt ${t} nicht`);
  for (const k of Object.keys(PILL).filter((n) => !n.startsWith('category-')))
    assert.ok(md.includes('`' + k + '`'), `Vertrag nennt Rolle ${k} nicht`);
  for (const h of ['## Zustand', '## Aktionen', '## Tokens', '## Attribute', '## Konformität'])
    assert.ok(md.includes(h), `Abschnitt ${h} fehlt`);
});
