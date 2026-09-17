// dist/ ist eingecheckt, damit TopLogic ohne Node-Build einbindet. Es darf nie veraltet sein.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { generate } from '../tools/generate.mjs';
import { dtcg } from '../tools/dtcg.mjs';

const P = JSON.parse(readFileSync(new URL('../src/primitives.json', import.meta.url)));
const T = JSON.parse(readFileSync(new URL('../src/tokens.json', import.meta.url)));

test('dist/ ist byte-identisch mit dem Erzeugnis aus src/', () => {
  for (const [name, text] of Object.entries(generate(P, T)))
    assert.equal(readFileSync(new URL(`../dist/${name}`, import.meta.url), 'utf8'), text,
      `dist/${name} ist veraltet — node tools/generate.mjs`);
  assert.equal(readFileSync(new URL('../dist/tokens.dtcg.json', import.meta.url), 'utf8'),
    JSON.stringify(dtcg(P, T), null, 2) + '\n', 'dist/tokens.dtcg.json ist veraltet');
});
