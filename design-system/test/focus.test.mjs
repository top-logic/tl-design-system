import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { declarations } from '../tools/lib/css.mjs';
import { componentCssFiles } from './lib/component.mjs';

const OFFSET = /^(calc\(-1 \* var\(--tl-focus-offset\)\)|var\(--tl-focus-offset\))$/;

test('kein Komponentenblock setzt den Fokusring; outline nur als Drop-Ziel in border-interactive', () => {
  const bad = [];
  for (const [name, css] of componentCssFiles()) {
    for (const d of declarations(css)) {
      if (/^outline(-color|-width)?$/.test(d.property) && !/--tl-border-interactive/.test(d.value)) bad.push(`${name}:${d.line} ${d.property}: ${d.value}`);
      if (/--tl-focus-ring/.test(d.value)) bad.push(`${name}:${d.line} liest focus-ring`);
      if (d.property === 'outline-offset' && !OFFSET.test(d.value.trim())) bad.push(`${name}:${d.line} ${d.value}`);
    }
  }
  assert.deepEqual(bad, []);
});

test('base.css trägt den Ring genau einmal', () => {
  const base = readFileSync(new URL('../dist/base.css', import.meta.url), 'utf8');
  assert.equal((base.match(/outline:\s*var\(--tl-focus-width\) solid var\(--tl-focus-ring\)/g) ?? []).length, 1);
});
