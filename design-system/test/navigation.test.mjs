// Welle 4b (Spec 2026-10-16): Navigation aus dem Paket. Jede Regel hier steht in der Spec; die Verträge prüft
// contracts-4b.test.mjs, die Reihenfolge des Nachgebens der AppBar app-bar-shrink.test.mjs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readGenerated, declarationsOf, componentCssFiles } from './lib/component.mjs';

const T = JSON.parse(readFileSync(new URL('../src/tokens.json', import.meta.url)));
const decl = (dir, sel) => declarationsOf(readGenerated(dir, `${dir}.css`), sel) ?? '';
const ohneKommentar = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');

test('Maße der Navigation: size-sidebar fest, size-shell-bar folgt der Dichte (48/40 px)', () => {
  assert.equal(T.measure['size-sidebar'], '{size-12}');
  assert.equal(T.density.normal['size-shell-bar'], '{size-8}');
  assert.equal(T.density.compact['size-shell-bar'], '{height-5}');
});

test('keine Komponentendatei kennt einen Breakpoint: kein @media auf Breite oder Höhe', () => {
  const treffer = [];
  for (const [name, css] of componentCssFiles())
    for (const m of ohneKommentar(css).matchAll(/@media[^{]*\b(min-|max-)?(width|height)\b[^{]*\{/g)) treffer.push(`${name}: ${m[0]}`);
  assert.deepEqual(treffer, []);
});

test('tl-icon-badge: der Behälter ist positioniert, der Zähler sitzt an der Ecke — Lage am Element um das Part', () => {
  assert.match(decl('badge', '.tl-icon-badge'), /position:\s*relative/);
  assert.match(decl('badge', '.tl-icon-badge'), /display:\s*inline-flex/);
  const z = decl('badge', '.tl-icon-badge__count');
  assert.match(z, /position:\s*absolute/);
  assert.match(z, /top:\s*calc\(-1 \* var\(--tl-space-2xs\)\)/);
  assert.match(z, /inset-inline-end:\s*calc\(-1 \* var\(--tl-space-xs\)\)/);
  assert.doesNotMatch(ohneKommentar(readGenerated('badge', 'badge.css')), /\.tl-badge--/);
});
