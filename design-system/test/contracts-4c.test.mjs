// Die Verträge der Welle 4c nennen ihre Pflichtbegriffe; die neuen Specimen bestehen den Harness und zeigen die
// Zustände, die die Spec verlangt. Tasks 3 und 4 erweitern SOLL und SPECIMEN.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { missingInContract, specimenProblems } from './lib/component.mjs';
const datei = (d, f) => readFileSync(new URL(`../src/components/${d}/${f}`, import.meta.url), 'utf8');
const SOLL = {
  'panel/panel.contract.md': ['tl-panel', 'tl-titlebar', 'tl-titlebar__buttons', 'tl-panel__body', 'tl-button-bar',
    'data-tl-state~="minimized"', 'data-tl-state~="maximized"', 'aria-expanded', 'aria-controls', 'tl-panel--hover-actions',
    'tl-panel--full-line', '--tl-layer-raised', 'toggleMinimize', 'toggleMaximize', 'popOut', 'Escape'],
  'card/card.contract.md': ['tl-card', 'tl-card--nested', 'tl-card--overlay', 'tl-card__body', '--tl-surface-layer',
    '--tl-surface-layer-nested', '--tl-surface-overlay', 'elevated', 'useSurface'],
  'accordion/accordion.contract.md': ['tl-accordion', 'tl-card', 'tl-accordion__trigger', 'aria-expanded',
    'aria-controls', 'role="region"', 'toggleSection'],
  'button-bar/button-bar.contract.md': ['tl-button-bar'],
  'titlebar/titlebar.contract.md': ['tl-titlebar__content', 'tl-titlebar__buttons'],
  'dialog/dialog.contract.md': ['tl-button-bar'],
};
const SPECIMEN = ['panel', 'card', 'accordion'];

for (const [file, names] of Object.entries(SOLL)) test(`${file} nennt ${names.length} Pflichtbegriffe`, () => {
  const [d, f] = file.split('/');
  assert.deepEqual(missingInContract(datei(d, f), names), []);
});
for (const name of SPECIMEN)
  test(`${name}.spec.html besteht den Specimen-Harness`, () => assert.deepEqual(specimenProblems(datei(name, `${name}.spec.html`)), []));

test('panel.spec.html: Minimieren mit aria-expanded, aria-controls nur offen; minimiert, maximiert, als Karte', () => {
  const html = datei('panel', 'panel.spec.html');
  assert.match(html, /aria-expanded="true" aria-controls="p1-body"/);
  assert.match(html, /class="tl-panel" data-tl-state="minimized"/);
  assert.doesNotMatch(html, /aria-expanded="false" aria-controls=/);
  assert.match(html, /data-tl-state="maximized"/);
  assert.match(html, /class="tl-panel tl-card tl-panel--hover-actions"/);
  assert.match(html, /<div class="tl-button-bar">/);
  assert.match(html, /id="shrink"/);
});

test('card.spec.html: Karte auf der Seite, in einer Fläche (nested), im Dialog (overlay)', () => {
  const html = datei('card', 'card.spec.html');
  assert.match(html, /class="tl-card"/);
  assert.match(html, /class="tl-card tl-card--nested"/);
  assert.match(html, /tl-dialog__surface[\s\S]*class="tl-card tl-card--overlay"/);
});
