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
};

for (const mode of ['light', 'dark']) {
  const C = { ...R.color[mode], ...R.derived[mode] };
  test(`Button ${mode}: Text 4,5 und Linie 3,0 in jeder Erscheinung × Tönung, auf base und layer`, () => {
    for (const [name, k] of Object.entries(BUTTON)) {
      for (const g of GRUND) {
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
