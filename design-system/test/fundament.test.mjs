// Welle 5d (Spec 2026-10-20): Fundament für Tooltip und Ziehen — zwei Ebenen über dem Toast und die inversen
// Rollen, auf denen der Tooltip steht.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from '../tools/resolve.mjs';
import { ratio } from '../tools/lib/contrast.mjs';

const P = JSON.parse(readFileSync(new URL('../src/primitives.json', import.meta.url)));
const T = JSON.parse(readFileSync(new URL('../src/tokens.json', import.meta.url)));
const dist = (f) => readFileSync(new URL(`../dist/${f}`, import.meta.url), 'utf8');

/** Wert einer Custom Property aus dist/, var(--x) bis zum Literal verfolgt. */
function ebene(name) {
  const css = dist('primitives.css') + dist('tokens.css');
  let wert = `var(--tl-${name})`;
  for (let i = 0; i < 5; i++) {
    const ref = /^var\(--([a-z0-9-]+)\)$/.exec(wert);
    if (!ref) break;
    const m = new RegExp(`--${ref[1]}:\\s*([^;]+);`).exec(css);
    assert.ok(m, `--${ref[1]} fehlt in dist/`);
    wert = m[1].trim();
  }
  return Number(wert);
}

test('Ebenen: tooltip über toast, drag über tooltip', () => {
  const [toast, tooltip, drag] = ['layer-toast', 'layer-tooltip', 'layer-drag'].map(ebene);
  assert.deepEqual([toast, tooltip, drag], [1200, 1300, 1400]);
});

test('inverse Rollen halten 4,5:1 in beiden Modi', () => {
  const R = resolve(P, T);
  for (const m of ['light', 'dark']) {
    const fg = R.color[m]['text-inverse'], bg = R.color[m]['surface-inverse'];
    assert.ok(fg && bg, `${m}: text-inverse oder surface-inverse fehlt`);
    const ist = ratio(fg, bg);
    assert.ok(ist >= 4.5, `${m}: text-inverse auf surface-inverse = ${ist.toFixed(2)}`);
  }
});
