// Die Verträge der Welle 5c nennen ihre Pflichtbegriffe; die neuen Specimen bestehen den Harness.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { missingInContract, specimenProblems } from './lib/component.mjs';
const datei = (d, f) => readFileSync(new URL(`../src/components/${d}/${f}`, import.meta.url), 'utf8');
const SOLL = {
  'calendar/calendar.contract.md': ['tl-calendar', 'tl-calendar__event', 'tl-toolbar', 'tl-segmented', 'role="listbox"',
    'role="option"', 'aria-selected', 'aria-current="date"', 'data-tl-role', 'useRovingFocus', 'textOn', 'categoryOf',
    'useStandaloneKeyboardScope'],
  'choice/choice.contract.md': ['TLCalendar'],
  'drag/drag.contract.md': ['TLCalendar'],
};
const SPECIMEN = ['calendar'];

for (const [file, names] of Object.entries(SOLL)) test(`${file} nennt ${names.length} Pflichtbegriffe`, () => {
  const [d, f] = file.split('/');
  let md = '';
  try { md = datei(d, f); } catch { /* fehlt: alle Begriffe fehlen */ }
  assert.deepEqual(missingInContract(md, names), []);
});
for (const name of SPECIMEN) test(`${name}.spec.html besteht den Specimen-Harness`, () => {
  let html = '';
  try { html = datei(name, `${name}.spec.html`); } catch { /* fehlt */ }
  assert.ok(html, `${name}.spec.html fehlt`);
  assert.deepEqual(specimenProblems(html), []);
});
