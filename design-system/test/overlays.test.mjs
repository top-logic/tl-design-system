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

test('tl-dialog: Scrim deckt den Viewport auf der Overlay-Ebene, ohne Blur, mit Rand space-lg', () => {
  const d = decl('dialog', '.tl-dialog');
  assert.match(d, /position:\s*fixed/);
  assert.match(d, /inset:\s*0/);
  assert.match(d, /z-index:\s*var\(--tl-layer-overlay\)/);
  assert.match(d, /background:\s*var\(--tl-surface-scrim\)/);
  assert.match(d, /padding:\s*var\(--tl-space-lg\)/);
  assert.doesNotMatch(readGenerated('dialog', 'dialog.css').replace(/\/\*[\s\S]*?\*\//g, ''), /backdrop-filter|blur/i);
});

test('tl-dialog: Ein- und Ausblenden über data-tl-state mit Tokens; die Kopie lässt den Zeiger durch', () => {
  assert.match(decl('dialog', '.tl-dialog[data-tl-state~="entering"]'), /animation:\s*tl-dialog-in var\(--tl-duration-base\) var\(--tl-easing-entrance\)/);
  const aus = decl('dialog', '.tl-dialog[data-tl-state~="exiting"]');
  assert.match(aus, /animation:\s*tl-dialog-out var\(--tl-duration-base\) var\(--tl-easing-exit\) forwards/);
  assert.match(aus, /pointer-events:\s*none/);
});

test('tl-dialog__surface: Overlay-Fläche mit Rahmen, Schatten dialog, Ecke md; maximiert ohne Rand und Ecke', () => {
  const s = decl('dialog', '.tl-dialog__surface');
  assert.match(s, /background:\s*var\(--tl-surface-overlay\)/);
  assert.match(s, /border:\s*var\(--tl-border-width-sm\) solid var\(--tl-border-separator\)/);
  assert.match(s, /box-shadow:\s*var\(--tl-shadow-dialog\)/);
  assert.match(s, /border-radius:\s*var\(--tl-radius-md\)/);
  assert.match(s, /max-height:\s*100%/);
  const m = decl('dialog', '.tl-dialog__surface[data-tl-state~="maximized"]');
  assert.match(m, /inset:\s*0/);
  assert.match(m, /border-radius:\s*0/);
});

test('tl-dialog: Kopf zum Ziehen, Fuß rechtsbündig und leer verborgen, acht Griffe', () => {
  assert.match(decl('dialog', '.tl-dialog__surface > .tl-titlebar'), /cursor:\s*grab/);
  assert.match(decl('dialog', '.tl-dialog__surface[data-tl-state~="maximized"] > .tl-titlebar'), /cursor:\s*default/);
  assert.match(decl('dialog', '.tl-dialog__footer'), /justify-content:\s*end/);
  assert.match(decl('dialog', '.tl-dialog__footer:empty'), /display:\s*none/);
  for (const e of ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'])
    assert.match(decl('dialog', `.tl-dialog__resize[data-tl-edge="${e}"]`), /cursor:\s*[a-z]+-resize/, e);
});
