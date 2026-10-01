import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from '../tools/resolve.mjs';
import { readComponent, readGenerated, colorVarsOf, declarationsOf, specimenProblems, missingInContract, varsOf } from './lib/component.mjs';

const css = readComponent('select', 'select.css');
const P = JSON.parse(readFileSync(new URL('../src/primitives.json', import.meta.url)));
const T = JSON.parse(readFileSync(new URL('../src/tokens.json', import.meta.url)));

test('select.css liest genau diese Farbrollen', () => {
  assert.deepEqual(colorVarsOf(css), [
    'border-interactive', 'icon-secondary', 'status-error-text', 'surface-interactive-hover',
    'surface-interactive-selected', 'text-placeholder', 'text-secondary',
  ]);
});

test('das Popup schwebt als tl-popover: der Vertrag nennt beide Klassen, kein z-index-Literal', () => {
  const md = readComponent('select', 'select.contract.md');
  assert.deepEqual(missingInContract(md, ['tl-popover tl-select__popup']), []);
  assert.doesNotMatch(css, /z-index/);
});

test('das Select-Popup trägt die Fläche nicht selbst: tl-popover liefert sie', () => {
  const d = declarationsOf(readGenerated('select', 'select.css'), '.tl-select__popup');
  assert.doesNotMatch(d, /shadow-popover|surface-overlay|layer-popover|border-radius|position/);
  assert.match(d, /max-height:\s*calc\(8 \* var\(--tl-size-row\)/);
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
    'tl-popover tl-select__popup', 'tl-button--icon', 'data-tl-state="highlighted"', 'aria-busy="true"', 'tl-select__status', 'aria-invalid="true"',
    'tl-field-value', 'aria-activedescendant'])
    assert.ok(html.includes(s), `Specimen zeigt ${s} nicht`);
  // Die Liste führt nur ungewählte Optionen: keine trägt aria-selected="true", jede aria-selected="false".
  assert.doesNotMatch(html, /aria-selected="true"/);
  const optionen = [...html.matchAll(/<[^>]*role="option"[^>]*>/g)].map((m) => m[0]);
  assert.ok(optionen.length > 0, 'Specimen zeigt keine Option');
  for (const o of optionen) assert.match(o, /aria-selected="false"/, o);
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

test('Entfernen und Löschen sind tl-button--icon: die eigenen Knopfklassen gibt es in src/ nicht mehr', () => {
  const src = new URL('../src/', import.meta.url);
  const treffer = readdirSync(src, { recursive: true }).filter((f) => /\.(css|html|md|json)$/.test(f))
    .filter((f) => /tl-select__chip-remove|tl-select__clear/.test(readFileSync(new URL(f, src), 'utf8')));
  assert.deepEqual(treffer, []);
  const md = readComponent('select', 'select.contract.md');
  assert.deepEqual(missingInContract(md, ['tl-button--icon']), []);
});

test('ein Feld mit entfernbaren Chips bleibt size-control hoch, in jeder Dichte', () => {
  const R = resolve(P, T);
  const px = (v) => (v.endsWith('rem') ? parseFloat(v) * 16 : v.endsWith('px') ? parseFloat(v) : NaN);
  const rand = px(R.measure['border-width-sm']);
  for (const [dichte, d] of Object.entries(R.density)) {
    const feld = px(d['size-control']);
    const pille = px(d['size-control-sm']);
    const innen = (feld - pille) / 2 - rand; // padding-block von .tl-select
    assert.ok(innen >= 0, `${dichte}: Innenabstand ${innen}px < 0`);
    assert.ok(pille + 2 * innen + 2 * rand <= feld, `${dichte}: ${pille} + 2 × ${innen} + 2 × ${rand} > ${feld}`);
  }
  // Die Pille wächst nicht: der Knopf (tl-button--icon --sm) ist size-control-sm hoch und ragt um die
  // Randbreite über ihren Inhalt.
  const button = readComponent('button', 'button.css');
  assert.match(declarationsOf(button, '.tl-button--icon.tl-button--sm') ?? '', /height:\s*var\(--tl-size-control-sm\)/);
  assert.match(declarationsOf(css, '.tl-select__chip > .tl-button') ?? '', /margin-block:\s*calc\(-1 \* var\(--tl-border-width-sm\)\)/);
  // Die Lesewert-Liste im Formular steht so hoch wie ein Feld.
  const form = readComponent('form', 'form.css');
  const liste = declarationsOf(form, '.tl-form-field__input > .tl-select__values') ?? '';
  assert.match(liste, /min-height:\s*var\(--tl-size-control\)/);
  assert.match(liste, /align-items:\s*center/);
});
