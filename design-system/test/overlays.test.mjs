// Welle 4a (Spec 2026-10-13): Overlays aus dem Paket. Jede Regel hier steht in der Spec; die Verträge prüft
// contracts-4a.test.mjs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readGenerated, declarationsOf, rulesOf } from './lib/component.mjs';

const P = JSON.parse(readFileSync(new URL('../src/primitives.json', import.meta.url)));
const T = JSON.parse(readFileSync(new URL('../src/tokens.json', import.meta.url)));
const decl = (dir, sel) => declarationsOf(readGenerated(dir, `${dir}.css`), sel) ?? '';

test('Maße der Overlays: Drawer-Breiten und Toast-Breite als Tokens über Primitive', () => {
  assert.deepEqual(['size-12', 'size-13', 'size-14', 'size-15'].map((n) => P.measure[n]), ['16rem', '24rem', '36rem', '40rem']);
  assert.equal(T.measure['size-drawer-narrow'], '{size-12}');
  assert.equal(T.measure['size-drawer-medium'], '{size-13}');
  assert.equal(T.measure['size-drawer-wide'], '{size-14}');
  assert.equal(T.measure['size-toast-max'], '{size-15}');
});

test('tl-overlay: Ebenen decken die Basis, lassen den Zeiger durch, zehn Anker, keine Ebene und keine Fläche', () => {
  assert.match(decl('overlay', '.tl-overlay'), /position:\s*relative/);
  assert.match(decl('overlay', '.tl-overlay__layer'), /inset:\s*0/);
  assert.match(decl('overlay', '.tl-overlay__layer'), /pointer-events:\s*none/);
  assert.match(decl('overlay', '.tl-overlay__layer > *'), /pointer-events:\s*auto/);
  for (const a of ['fill', 'top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right'])
    assert.notEqual(declarationsOf(readGenerated('overlay', 'overlay.css'), `.tl-overlay__layer--${a}`), null, a);
  assert.doesNotMatch(readGenerated('overlay', 'overlay.css').replace(/\/\*[\s\S]*?\*\//g, ''), /z-index|background/);
});

test('tl-titlebar: Leistenhöhe, Linie unten, Titel mit Ellipse, Aktionen am Ende', () => {
  assert.match(decl('titlebar', '.tl-titlebar'), /min-height:\s*var\(--tl-size-bar\)/);
  assert.match(decl('titlebar', '.tl-titlebar'), /border-bottom:\s*var\(--tl-border-width-sm\) solid var\(--tl-border-separator\)/);
  assert.match(decl('titlebar', '.tl-titlebar__title'), /flex:\s*1 1 auto/);
  assert.match(decl('titlebar', '.tl-titlebar__title'), /margin:\s*0/);
  assert.match(decl('titlebar', '.tl-titlebar__actions'), /display:\s*flex/);
});
