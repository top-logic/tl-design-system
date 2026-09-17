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

test('die erzeugten Dateien des Pakets bestehen das Gate', () => {
  for (const f of readdirSync(dist).filter((f) => f.endsWith('.css') && f !== 'primitives.css')) {
    const v = lint(readFileSync(new URL(f, dist), 'utf8'), { known, file: f });
    assert.deepEqual(v, [], `${f}:\n${v.join('\n')}`);
  }
});
