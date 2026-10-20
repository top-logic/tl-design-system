// Die Verträge der Welle 5d nennen ihre Pflichtbegriffe.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { missingInContract } from './lib/component.mjs';
const datei = (d, f) => readFileSync(new URL(`../src/components/${d}/${f}`, import.meta.url), 'utf8');
const SOLL = {
  'layout/layout.contract.md': ['tl-fill', 'tl-reveal-on-hover'],
  'drag/drag.contract.md': ['tl-drag-shield', 'tl-drag-image', 'data-tl-armed', 'tl-pick-highlight', '--tl-layer-drag',
    'data-tl-state~="picking"'],
};

for (const [file, names] of Object.entries(SOLL)) test(`${file} nennt ${names.length} Pflichtbegriffe`, () => {
  const [d, f] = file.split('/');
  let md = '';
  try { md = datei(d, f); } catch { /* fehlt: alle Begriffe fehlen */ }
  assert.deepEqual(missingInContract(md, names), []);
});
