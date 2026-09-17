import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { lint, knownVariables } from '../tools/lint-css.mjs';

const dist = new URL('../dist/', import.meta.url);
const known = knownVariables(readFileSync(new URL('primitives.css', dist), 'utf8') + readFileSync(new URL('tokens.css', dist), 'utf8'));

test('ein Literal in einer Klasse ist ein Verstoß', () => {
  const v = lint('.tl-x { color: #fff; padding: 12px; transition: all 0.2s; }', { known, file: 'x.css' });
  assert.equal(v.length, 3, v.join('\n'));
});

test('erlaubte Literale: 0, 1, auto, none, 100%, currentColor, inherit', () => {
  assert.deepEqual(lint('.tl-x { margin: 0; flex: 1; width: auto; border: none; max-width: 100%; color: currentColor; font: inherit; }', { known, file: 'x.css' }), []);
});

test('eine unbekannte Variable ist ein Verstoß', () => {
  assert.equal(lint('.tl-x { color: var(--tl-nope); }', { known, file: 'x.css' }).length, 1);
});

test('Klassen ohne tl-Präfix oder gegen BEM sind Verstöße', () => {
  assert.equal(lint('.button { }', { known, file: 'x.css' }).length, 1);
  assert.equal(lint('.tlButton { }', { known, file: 'x.css' }).length, 1);
  assert.equal(lint('.tl-button__icon--big__x { }', { known, file: 'x.css' }).length, 1);
  assert.deepEqual(lint('.tl-button__icon--large { }', { known, file: 'x.css' }), []);
});

test(':focus ohne -visible und outline: none sind Verstöße', () => {
  assert.equal(lint('.tl-x:focus { outline: none; }', { known, file: 'x.css' }).length, 2);
});

test('font-size gehört in eine tl-type-Klasse', () => {
  assert.equal(lint('.tl-x { font-size: var(--tl-font-size-body); }', { known, file: 'x.css' }).length, 1);
  assert.deepEqual(lint('.tl-type-body { font-size: var(--tl-font-size-body); }', { known, file: 'base.css' }), []);
});

test('z-index, box-shadow und Dauern nur aus Tokens', () => {
  assert.equal(lint('.tl-x { z-index: 10; }', { known, file: 'x.css' }).length, 1);
  assert.ok(lint('.tl-x { box-shadow: 0 1px 2px var(--tl-surface-base); }', { known, file: 'x.css' }).length >= 1);
  assert.deepEqual(lint('.tl-x { box-shadow: inset 0 0 0 var(--tl-border-width-md) var(--tl-border-control); }', { known, file: 'x.css' }), []);
  assert.deepEqual(lint('.tl-x { z-index: var(--tl-layer-popover); box-shadow: var(--tl-shadow-popover); transition: color var(--tl-duration-fast) var(--tl-easing-standard); }', { known, file: 'x.css' }), []);
});

test('benannte Farben sind ein Verstoß — transparent und currentColor bleiben erlaubt', () => {
  assert.equal(lint('.tl-x { color: white; }', { known, file: 'x.css' }).length, 1);
  assert.equal(lint('.tl-x { border: 1px solid red; }', { known, file: 'x.css' }).length >= 1, true);
  assert.equal(lint('.tl-x { background: black; }', { known, file: 'x.css' }).length, 1);
  assert.deepEqual(lint('.tl-x { background: transparent; color: currentColor; }', { known, file: 'x.css' }), []);
});

test('ein Fallback im var() ist ein Verstoß', () => {
  assert.equal(lint('.tl-x { color: var(--tl-text-primary, #fff); }', { known, file: 'x.css' }).length, 1);
  assert.equal(lint('.tl-x { width: var(--tl-space-md, 12px); }', { known, file: 'x.css' }).length, 1);
  assert.deepEqual(lint('.tl-x { color: var(--tl-text-primary); }', { known, file: 'x.css' }), []);
});

test('eine fremde Variable ohne tl-Präfix ist ein Verstoß', () => {
  assert.equal(lint('.tl-x { color: var(--foo); }', { known, file: 'x.css' }).length, 1);
});

test('eine eigene Variable in einer Klasse ist ein Verstoß — Tokens gehören nach src/tokens.json', () => {
  assert.equal(lint('.tl-x { --foo: 12px; }', { known, file: 'x.css' }).length, 1);
  assert.equal(lint('.tl-x { --tl-button-gap: 4px; }', { known, file: 'x.css' }).length, 1);
  assert.deepEqual(lint(':root { --tl-button-gap: 4px; }', { known, file: 'tokens.css' }), []);
  assert.deepEqual(lint('[data-tl-mode="dark"] { --tl-button-gap: 4px; }', { known, file: 'tokens.css' }), []);
});

test('der Fokusring darf nicht per Einzeleigenschaft abgeschaltet werden', () => {
  assert.equal(lint('.tl-x:focus-visible { outline-width: 0; }', { known, file: 'x.css' }).length, 1);
  assert.equal(lint('.tl-x:focus-visible { outline-style: none; }', { known, file: 'x.css' }).length, 1);
  assert.equal(lint('.tl-x:focus-visible { outline-color: transparent; }', { known, file: 'x.css' }).length, 1);
  assert.equal(lint('.tl-x:focus-visible { outline: 0 0; }', { known, file: 'x.css' }).length, 1);
  assert.equal(lint('.tl-x:focus-visible { outline: 0px; }', { known, file: 'x.css' }).length >= 1, true);
  assert.equal(lint('.tl-x:focus-visible { outline: 0 none; }', { known, file: 'x.css' }).length >= 1, true);
  assert.equal(lint('.tl-x:focus-visible { outline: solid 0 currentColor; }', { known, file: 'x.css' }).length >= 1, true);
  assert.deepEqual(lint('.tl-x:focus-visible { outline: var(--tl-focus-width) solid var(--tl-focus-ring); }', { known, file: 'x.css' }), []);
  assert.deepEqual(lint('.tl-x:focus-visible { outline: var(--tl-focus-width) solid var(--tl-focus-ring); }', { known, file: 'x.css' }), []);
});

test('die font-Kurzform ist außerhalb einer Typo-Klasse ein Verstoß — inherit/initial/unset/normal bleiben erlaubt', () => {
  assert.equal(lint('.tl-x { font: 12px sans-serif; }', { known, file: 'x.css' }).length >= 1, true);
  assert.deepEqual(lint('.tl-x { font: inherit; }', { known, file: 'x.css' }), []);
  // In der Typo-Klasse feuert nur die font-Kurzform-Regel nicht mehr — ein Literal bleibt
  // ein Literal (Maß-Literal-Regel) und muss weiter aus Tokens kommen.
  assert.deepEqual(
    lint('.tl-type-body { font: 12px sans-serif; }', { known, file: 'base.css' })
      .filter((v) => v.includes('font-Kurzform')),
    [],
  );
});

test('line-height gehört in eine Typo-Klasse — body ist die einzige Ausnahme', () => {
  assert.equal(lint('.tl-x { line-height: 1.4; }', { known, file: 'x.css' }).length, 1);
  assert.deepEqual(lint('.tl-type-body { line-height: 1.4; }', { known, file: 'base.css' }), []);
  assert.deepEqual(lint('body { line-height: 1.4; }', { known, file: 'base.css' }), []);
});

test('!important ist nur im Reduced-Motion-Block erlaubt', () => {
  assert.equal(lint('.tl-x { color: red !important; }', { known, file: 'x.css' }).length >= 1, true);
  assert.deepEqual(lint('*, *::before, *::after { animation-duration: 0.01ms !important; }', { known, file: 'base.css' }), []);
  assert.equal(lint('.tl-x { animation-duration: 0.01ms !important; }', { known, file: 'base.css' }).length, 1);
});

test('Kurven-Literale in transition/animation sind ein Verstoß — der Token bleibt erlaubt', () => {
  assert.equal(lint('.tl-x { transition: color 0.2s ease-in-out; }', { known, file: 'x.css' }).length >= 1, true);
  assert.equal(lint('.tl-x { transition: color 0.2s linear; }', { known, file: 'x.css' }).length >= 1, true);
  assert.equal(lint('.tl-x { transition: color 0.2s cubic-bezier(0.2, 0, 1, 1); }', { known, file: 'x.css' }).length >= 1, true);
  assert.deepEqual(lint('.tl-x { transition: color var(--tl-duration-fast) var(--tl-easing-linear); }', { known, file: 'x.css' }), []);
});

test('ein Attributselektor auf Klassen ist ein Verstoß', () => {
  assert.equal(lint('[class*="tl-button"] { color: red; }', { known, file: 'x.css' }).length >= 1, true);
  assert.equal(lint('[class^="tl-"] { color: red; }', { known, file: 'x.css' }).length >= 1, true);
  assert.equal(lint('[class~="tl-x"] { color: red; }', { known, file: 'x.css' }).length >= 1, true);
});

test('einheitenlose Literale bei opacity/flex bleiben erlaubt (Punkt 10, nicht verschärft)', () => {
  assert.deepEqual(lint('.tl-x { opacity: 0.5; flex: 2; }', { known, file: 'x.css' }), []);
});

test('die erzeugten Dateien des Pakets bestehen das Gate', () => {
  for (const f of readdirSync(dist).filter((f) => f.endsWith('.css') && f !== 'primitives.css')) {
    const v = lint(readFileSync(new URL(f, dist), 'utf8'), { known, file: f });
    assert.deepEqual(v, [], `${f}:\n${v.join('\n')}`);
  }
});
