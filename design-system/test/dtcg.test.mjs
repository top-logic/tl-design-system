import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dtcg } from '../tools/dtcg.mjs';

const P = JSON.parse(readFileSync(new URL('../src/primitives.json', import.meta.url)));
const T = JSON.parse(readFileSync(new URL('../src/tokens.json', import.meta.url)));
const D = dtcg(P, T);

function tokens(o, path = []) {
  const out = [];
  for (const [k, v] of Object.entries(o)) {
    if (k.startsWith('$')) continue;
    if (v && typeof v === 'object' && '$value' in v) out.push([[...path, k].join('.'), v]);
    else if (v && typeof v === 'object') out.push(...tokens(v, [...path, k]));
  }
  return out;
}

test('jedes Token hat $value und $type', () => {
  for (const [path, t] of tokens(D)) {
    assert.ok('$value' in t, path);
    assert.ok(typeof t.$type === 'string', `${path} ohne $type`);
  }
});

test('Primitive tragen Werte, Rollen tragen Aliase in geschweiften Klammern', () => {
  for (const [path, t] of tokens(D.primitive)) assert.ok(!String(t.$value).startsWith('{'), path);
  for (const [path, t] of tokens(D.semantic.light.color))
    assert.match(String(t.$value), /^\{primitive\.color\.[a-z]+-\d+\}$/, path);
});

test('jeder Alias zeigt auf ein vorhandenes Token', () => {
  const all = new Set(tokens(D).map(([p]) => p));
  for (const [path, t] of tokens(D)) {
    const m = /^\{(.+)\}$/.exec(String(t.$value));
    if (m) assert.ok(all.has(m[1]), `${path} → ${m[1]} fehlt`);
  }
});

test('Farben sind $type color, Maße dimension, Schriften fontFamily, Dauern duration, Kurven cubicBezier', () => {
  for (const [p, t] of tokens(D.primitive.color)) assert.equal(t.$type, 'color', p);
  for (const [p, t] of tokens(D.primitive.measure)) assert.ok(['dimension', 'number'].includes(t.$type), p);
  for (const [p, t] of tokens(D.primitive.font)) assert.equal(t.$type, 'fontFamily', p);
  for (const [p, t] of tokens(D.primitive.motion)) assert.ok(['duration', 'cubicBezier'].includes(t.$type), p);
});

test('beide Modi sind vollständig und die Blattnamen sind die Tokennamen', () => {
  const light = tokens(D.semantic.light).map(([p]) => p.replace('semantic.light.', '')).sort();
  const dark = tokens(D.semantic.dark).map(([p]) => p.replace('semantic.dark.', '')).sort();
  assert.deepEqual(dark, light);
  assert.ok(light.some((p) => p.endsWith('.surface-brand')));
});
