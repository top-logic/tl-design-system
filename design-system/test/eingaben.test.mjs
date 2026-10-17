// Welle 5a (Spec 2026-10-17): Eingaben aus dem Paket. Jede Regel hier steht in der Spec; die Verträge prüft
// contracts-5a.test.mjs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readGenerated, declarationsOf } from './lib/component.mjs';

const T = JSON.parse(readFileSync(new URL('../src/tokens.json', import.meta.url)));
const decl = (dir, sel, file = `${dir}.css`) => declarationsOf(readGenerated(dir, file), sel) ?? '';
const ohneKommentar = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');

test('swatch: Maß size-control, Rahmen border-control, keine px', () => {
  const d = decl('swatch', '.tl-swatch');
  assert.match(d, /inline-size:\s*var\(--tl-size-control\)/);
  assert.match(d, /block-size:\s*var\(--tl-size-control\)/);
  assert.match(d, /var\(--tl-border-control\)/);
  assert.doesNotMatch(ohneKommentar(readGenerated('swatch', 'swatch.css')), /\d+px|#[0-9a-f]{3,6}\b/i);
});

test('swatch: keine Farbe ist ein Schachbrett aus Tokens, nur am Farb-Swatch', () => {
  const d = decl('swatch', '.tl-swatch--color[data-tl-state~="empty"]');
  assert.match(d, /--tl-surface-field/);
  assert.match(d, /--tl-border-separator/);
  assert.match(d, /--tl-space-xs/);
  assert.equal(decl('swatch', '.tl-swatch[data-tl-state~="empty"]'), '');
});

test('swatch: Fehler und Warnung am Rahmen', () => {
  assert.match(decl('swatch', '.tl-swatch[aria-invalid="true"]'), /--tl-status-error-border/);
  assert.match(decl('swatch', '.tl-swatch[data-tl-state~="warning"]'), /--tl-status-warning-border/);
});

test('picker: Hülle liegt auf tl-popover, keine feste Breite', () => {
  const d = decl('picker', '.tl-picker');
  assert.notEqual(d, '');
  assert.doesNotMatch(d, /(^|[;\s])(width|inline-size)\s*:/);
  assert.match(readFileSync(new URL('../src/components/picker/picker.contract.md', import.meta.url), 'utf8'), /tl-popover/);
});

test('tokens: Griff-Rollen in beiden Modi gleich', () => {
  for (const r of ['border-handle-light', 'border-handle-dark']) {
    assert.ok(T.color.light[r]);
    assert.equal(T.color.light[r], T.color.dark[r]);
  }
});
