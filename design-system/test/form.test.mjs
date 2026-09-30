import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readComponent, colorVarsOf, declarationsOf, specimenProblems, missingInContract, varsOf } from './lib/component.mjs';

const P = JSON.parse(readFileSync(new URL('../src/primitives.json', import.meta.url)));
const T = JSON.parse(readFileSync(new URL('../src/tokens.json', import.meta.url)));
const form = readComponent('form', 'form.css');
const upload = readComponent('form', 'upload.css');

test('die Label-Spalte und der Geändert-Punkt sind Tokens auf der Skala', () => {
  assert.equal(P.measure['size-10'], '6rem');
  assert.equal(P.measure['size-11'], '10rem');
  assert.equal(T.measure['size-field-label-min'], '{size-10}');
  assert.equal(T.measure['size-field-label-max'], '{size-11}');
  assert.equal(T.measure['size-indicator'], '{size-2}');
});

test('form.css liest genau diese Farbrollen, layer-accent nicht mehr', () => {
  assert.deepEqual(colorVarsOf(form), [
    'border-control', 'border-separator', 'status-error-text', 'status-warning-text', 'surface-brand',
    'surface-interactive-hover', 'text-helper', 'text-primary', 'text-secondary',
  ]);
});

test('die Seitenlage nimmt die Label-Spalte aus Tokens, kein Literal', () => {
  const d = declarationsOf(form, '.tl-form-field--side') ?? '';
  assert.match(d, /minmax\(var\(--tl-size-field-label-min\),\s*var\(--tl-size-field-label-max\)\)/);
});

test('geändert und eingeklappt sind Attribute', () => {
  assert.ok(declarationsOf(form, '.tl-form-field[data-tl-state~="dirty"] .tl-form-field__dirty'), 'dirty fehlt');
  assert.ok(declarationsOf(form, '.tl-form-group__body[hidden]'), 'eingeklappt fehlt');
  assert.doesNotMatch(form, /--collapsed|--dirty|--error|--warning|--readonly/);
});

test('upload.css: die Drop-Zone zeigt dragover als Attribut, gestrichelt in der Markenlinie', () => {
  const d = declarationsOf(upload, '.tl-file-upload[data-tl-state~="dragover"]') ?? '';
  assert.match(d, /dashed/);
  assert.match(d, /--tl-border-interactive/);
  assert.ok(declarationsOf(upload, '.tl-upload'), 'tl-upload fehlt');
  assert.doesNotMatch(upload, /outline\s*:\s*(none|0)/);
});

test('das Formular-Specimen zeigt jede Label-Lage, Pflicht, Hilfe, Fehler, Warnung, geändert, Gruppe, Upload', () => {
  const html = readComponent('form', 'form.spec.html');
  assert.deepEqual(specimenProblems(html), []);
  for (const s of ['tl-form-field--side', 'tl-form-field--top', 'tl-form-field--after', 'tl-visually-hidden',
    'tl-form-field__required', 'aria-required="true"', 'tl-form-field__help-text', 'role="alert"', 'aria-live="polite"',
    'data-tl-state="dirty"', 'tl-form-group--outlined', 'aria-expanded="false"', 'hidden', 'tl-form-layout',
    'tl-field-list', 'tl-upload', 'tl-file-upload', 'data-tl-state="dragover"', 'aria-busy="true"'])
    assert.ok(html.includes(s), `Specimen zeigt ${s} nicht`);
});

test('die Verträge nennen Tokens, Klassen und Attribute', () => {
  const md = readComponent('form', 'form.contract.md');
  assert.deepEqual(missingInContract(md, [...varsOf(form), 'tl-form-field', 'tl-form-group', 'tl-form-layout',
    'tl-field-list', 'data-tl-state', 'aria-required', 'aria-expanded', 'role="alert"', 'aria-live', 'labelPosition']), []);
  const up = readComponent('form', 'upload.contract.md');
  assert.deepEqual(missingInContract(up, [...varsOf(upload), 'tl-upload', 'tl-file-upload', 'tl-button',
    'aria-busy', 'data-tl-state']), []);
});

test('die Warnung steht vor dem Fehler, der Einklappknopf zeigt nur aktiviert', () => {
  const ohne = form.replace(/\/\*[\s\S]*?\*\//g, '');
  const warnung = ohne.indexOf('.tl-form-field__message[aria-live="polite"]');
  const fehler = ohne.indexOf('.tl-form-field__message[role="alert"]');
  assert.ok(warnung >= 0 && fehler >= 0, 'Warn- oder Fehlerregel fehlt');
  assert.ok(warnung < fehler, 'bei gleicher Spezifität muss der Fehler die Warnung verdrängen');
  assert.ok(declarationsOf(form, '.tl-form-group__toggle:where(:not(:disabled)):hover'), 'Hover nicht auf Aktiviertes begrenzt');
  assert.doesNotMatch(ohne, /\.tl-form-group__toggle:hover/);
});
