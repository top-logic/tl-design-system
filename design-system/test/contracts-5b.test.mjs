// Die Verträge der Welle 5b nennen ihre Pflichtbegriffe; die neuen Specimen bestehen den Harness.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { missingInContract, specimenProblems } from './lib/component.mjs';
const datei = (d, f) => readFileSync(new URL(`../src/components/${d}/${f}`, import.meta.url), 'utf8');
const SOLL = {
  'media/media.contract.md': ['tl-media', 'tl-media__frame', 'tl-media__placeholder', 'tl-media--cover',
    'tl-media--contain', 'tl-status', '--tl-surface-document'],
  'prose/prose.contract.md': ['tl-prose', 'heading-lg', 'heading-md', 'heading-sm', 'text-link', 'border-separator'],
  'overlay/overlay.contract.md': ['tl-overlay--fill', 'tl-overlay__base', 'tl-overlay__action'],
};
const SPECIMEN = ['media', 'prose', 'overlay'];

for (const [file, names] of Object.entries(SOLL)) test(`${file} nennt ${names.length} Pflichtbegriffe`, () => {
  const [d, f] = file.split('/');
  assert.deepEqual(missingInContract(datei(d, f), names), []);
});
for (const name of SPECIMEN)
  test(`${name}.spec.html besteht den Specimen-Harness`, () => assert.deepEqual(specimenProblems(datei(name, `${name}.spec.html`)), []));
