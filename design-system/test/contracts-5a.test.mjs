// Die Verträge der Welle 5a nennen ihre Pflichtbegriffe; die neuen Specimen bestehen den Harness.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { missingInContract, specimenProblems } from './lib/component.mjs';
const datei = (d, f) => readFileSync(new URL(`../src/components/${d}/${f}`, import.meta.url), 'utf8');
const SOLL = {
  'swatch/swatch.contract.md': ['tl-swatch', 'tl-swatch--color', 'tl-swatch--wide', 'data-tl-state~="empty"',
    'aria-invalid', 'aria-required', '--tl-border-control'],
  'picker/picker.contract.md': ['tl-picker', 'tl-popover', 'role="dialog"', 'aria-label', 'tl-tabs', 'tl-button-bar',
    'useTabList', 'PickerPopover', 'Escape'],
  'tabs/tabs.contract.md': ['useTabList'],
  'popover/popover.contract.md': ['tl-picker'],
  'button-bar/button-bar.contract.md': ['tl-picker'],
};
const SPECIMEN = ['swatch', 'picker'];

for (const [file, names] of Object.entries(SOLL)) test(`${file} nennt ${names.length} Pflichtbegriffe`, () => {
  const [d, f] = file.split('/');
  assert.deepEqual(missingInContract(datei(d, f), names), []);
});
for (const name of SPECIMEN)
  test(`${name}.spec.html besteht den Specimen-Harness`, () => assert.deepEqual(specimenProblems(datei(name, `${name}.spec.html`)), []));
