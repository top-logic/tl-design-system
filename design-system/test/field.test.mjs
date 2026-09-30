import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from '../tools/resolve.mjs';
import { readComponent, colorVarsOf, declarationsOf, specimenProblems, missingInContract, varsOf } from './lib/component.mjs';

const P = JSON.parse(readFileSync(new URL('../src/primitives.json', import.meta.url)));
const T = JSON.parse(readFileSync(new URL('../src/tokens.json', import.meta.url)));
const css = readComponent('field', 'field.css');

test('field.css liest genau die Farbrollen des Feldes', () => {
  assert.deepEqual(colorVarsOf(css), [
    'border-control', 'border-disabled', 'border-emphasis', 'icon-secondary',
    'status-error-border', 'status-warning-border', 'surface-disabled', 'surface-field',
    'surface-interactive-hover', 'text-disabled', 'text-link', 'text-link-hover',
    'text-placeholder', 'text-primary',
  ]);
});

test('der Rahmen folgt der Dichte und hat keine Schriftregel', () => {
  const d = declarationsOf(css, '.tl-field');
  assert.ok(d, '.tl-field fehlt');
  for (const t of ['--tl-size-control', '--tl-space-control-x', '--tl-space-control-y', '--tl-radius-sm', '--tl-border-width-sm'])
    assert.ok(d.includes(t), `.tl-field liest ${t} nicht`);
  assert.doesNotMatch(css, /font(-size|-weight)?\s*:|line-height\s*:/);
});

test('Fehler liest aria-invalid und data-tl-state, Warnung data-tl-state, Deaktiviert :disabled', () => {
  assert.match(declarationsOf(css, '.tl-field[aria-invalid="true"]') ?? '', /status-error-border/);
  assert.match(declarationsOf(css, '.tl-field[data-tl-state~="error"]') ?? '', /status-error-border/);
  assert.match(declarationsOf(css, '.tl-field[data-tl-state~="warning"]') ?? '', /status-warning-border/);
  assert.match(declarationsOf(css, '.tl-field:disabled') ?? '', /surface-disabled/);
});

test('der Lesewert endet mit Ellipse und lässt seine Kinder schrumpfen', () => {
  assert.match(declarationsOf(css, '.tl-field-value') ?? '', /min-width:\s*0/);
  assert.match(declarationsOf(css, '.tl-field-value__text') ?? '', /text-overflow:\s*ellipsis/);
  assert.match(declarationsOf(css, '.tl-field-value > *') ?? '', /min-width:\s*0/);
});

test('tl-visually-hidden steht in base.css, ohne Maß-Literal', () => {
  const base = readFileSync(new URL('../dist/base.css', import.meta.url), 'utf8');
  const d = declarationsOf(base, '.tl-visually-hidden');
  assert.ok(d, '.tl-visually-hidden fehlt in base.css');
  assert.match(d, /clip-path:\s*inset\(50%\)/);
  assert.match(d, /position:\s*absolute/);
});

test('das Feld-Specimen zeigt jeden Zustand, jede Form, beide Flächen und eine schmale Zelle', () => {
  const html = readComponent('field', 'field.spec.html');
  assert.deepEqual(specimenProblems(html), []);
  for (const s of ['aria-invalid="true"', 'data-tl-state="warning"', 'disabled', 'placeholder=', 'tl-field--multiline',
    'tl-field-group__icon', 'tl-field-group__action', 'tl-field-value', 'tl-pill', 'specimen__cell', 'surface-layer', 'surface-overlay'])
    assert.ok(html.includes(s), `Specimen zeigt ${s} nicht`);
});

test('der Feld-Vertrag nennt jedes Token, jede Klasse und jedes Zustandsattribut', () => {
  const md = readComponent('field', 'field.contract.md');
  const names = [...varsOf(css), 'tl-field', 'tl-field--multiline', 'tl-field-group', 'tl-field-value',
    'aria-invalid', 'data-tl-state', 'disabled', 'aria-required', 'hasError', 'hasWarnings', 'editable'];
  assert.deepEqual(missingInContract(md, names), []);
});
