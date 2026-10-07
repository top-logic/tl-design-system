// Text und Spalten-Layout — 3b §11, §12.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readGenerated, declarationsOf } from './lib/component.mjs';

test('tl-text: Ton als data-tl-tone, ohne Ton erbt der Text; Ellipse ist --truncate; leer nimmt keinen Platz', () => {
  const css = readGenerated('text', 'text.css');
  const TOENE = { secondary: 'text-secondary', helper: 'text-helper', placeholder: 'text-placeholder',
    success: 'status-success-text', warning: 'status-warning-text', error: 'status-error-text', 'on-brand': 'text-on-brand' };
  for (const [ton, rolle] of Object.entries(TOENE))
    assert.match(declarationsOf(css, `.tl-text[data-tl-tone="${ton}"]`) ?? '', new RegExp(`color:\\s*var\\(--tl-${rolle}\\)`), ton);
  assert.equal(declarationsOf(css, '.tl-text'), null, 'ohne Ton keine Farbregel: der Text erbt');
  assert.doesNotMatch(css, /accent|font-style|font-weight/);
  assert.match(declarationsOf(css, '.tl-text--truncate') ?? '', /text-overflow:\s*ellipsis/);
  // master #29752: ein Text ohne Wert nimmt keinen Platz, einer mit Rolle (Live-Bereich) bleibt.
  assert.match(declarationsOf(css, '.tl-text:empty:not([role])') ?? '', /display:\s*none/);
});

test('tl-columns: drei Abstände aus der Skala, Spalten schrumpfen', () => {
  const css = readGenerated('columns', 'columns.css');
  assert.match(declarationsOf(css, '.tl-columns--gap-compact') ?? '', /gap:\s*var\(--tl-space-sm\)/);
  assert.match(declarationsOf(css, '.tl-columns--gap-default') ?? '', /gap:\s*var\(--tl-space-md\)/);
  assert.match(declarationsOf(css, '.tl-columns--gap-loose') ?? '', /gap:\s*var\(--tl-space-lg\)/);
  assert.match(declarationsOf(css, '.tl-columns__column') ?? '', /min-width:\s*0/);
});
