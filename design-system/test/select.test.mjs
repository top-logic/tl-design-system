import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readComponent, colorVarsOf, declarationsOf, specimenProblems, missingInContract, varsOf } from './lib/component.mjs';

const css = readComponent('select', 'select.css');

test('select.css liest genau diese Farbrollen', () => {
  assert.deepEqual(colorVarsOf(css), [
    'border-interactive', 'border-separator', 'icon-secondary', 'status-error-text', 'surface-interactive-hover',
    'surface-interactive-selected', 'surface-overlay', 'text-placeholder', 'text-primary', 'text-secondary',
  ]);
});

test('das Popup schwebt: Overlay-Fläche, Popover-Schatten, Popover-Ebene, umschließender Radius', () => {
  const d = declarationsOf(css, '.tl-select__popup') ?? '';
  for (const t of ['--tl-surface-overlay', '--tl-shadow-popover', '--tl-layer-popover', '--tl-radius-md'])
    assert.ok(d.includes(t), `Popup liest ${t} nicht`);
  assert.doesNotMatch(css, /z-index:\s*\d/);
});

test('Hervorhebung und Ziehen sind data-tl-state, gewählt ist aria-selected', () => {
  assert.ok(declarationsOf(css, '.tl-select__option[data-tl-state~="highlighted"]'), 'Hervorhebung fehlt');
  assert.ok(declarationsOf(css, '.tl-select__chip[data-tl-state~="dragging"]'), 'Ziehen fehlt');
  assert.doesNotMatch(css, /--highlighted|--dragging|--open|--drop/);
});

test('eine Option ist eine Zeile hoch, ein Treffer ist fett über die Typo-Klasse', () => {
  assert.match(declarationsOf(css, '.tl-select__option') ?? '', /min-height:\s*var\(--tl-size-row\)/);
  const ohneKommentare = css.replace(/\/\*[\s\S]*?\*\//g, '');
  assert.doesNotMatch(ohneKommentare, /\bstrong\b|font-weight/);
});

test('Wurzel und Suchfeld schalten den Fokusring nicht ab', () => {
  assert.doesNotMatch(css, /outline\s*:\s*(none|0)/);
});

test('das Select-Specimen zeigt leer, einzeln mit Pill, mehrfach, offen, laden, Fehler, keine Treffer, Lesewert', () => {
  const html = readComponent('select', 'select.spec.html');
  assert.deepEqual(specimenProblems(html), []);
  for (const s of ['tl-select__placeholder', 'tl-select__value', 'tl-pill', 'tl-select__chip', 'aria-expanded="true"',
    'tl-select__popup', 'data-tl-state="highlighted"', 'aria-busy="true"', 'tl-select__status', 'aria-invalid="true"',
    'tl-field-value', 'aria-activedescendant'])
    assert.ok(html.includes(s), `Specimen zeigt ${s} nicht`);
});

test('der Select-Vertrag nennt Tokens, Klassen, Attribute und die Tastatur', () => {
  const md = readComponent('select', 'select.contract.md');
  const names = [...varsOf(css), 'tl-select', 'tl-field', 'role="combobox"', 'aria-expanded', 'aria-activedescendant',
    'aria-selected', 'role="listbox"', 'role="option"', 'data-tl-state', 'aria-invalid', 'colorRole',
    'ArrowDown', 'ArrowUp', 'Enter', 'Escape', 'Backspace', 'valueChanged', 'loadOptions', 'goto',
    'tl-select__search-group'];
  assert.deepEqual(missingInContract(md, names), []);
});

test('der Abstand unter dem Suchfeld sitzt an seiner Gruppe, nicht am Feld', () => {
  assert.match(declarationsOf(css, '.tl-select__search-group') ?? '', /margin-bottom/);
  assert.equal(declarationsOf(css, '.tl-select__search'), null);
});
