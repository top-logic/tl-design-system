import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { report, REQUIREMENTS } from './requirements.mjs';

const tokens = JSON.parse(readFileSync(new URL('./tokens.json', import.meta.url)));

test('Beide Modi deklarieren denselben Satz Tokens, keiner erbt', () => {
  const hell = Object.keys(tokens.light).sort();
  const dunkel = Object.keys(tokens.dark).sort();
  assert.deepEqual(dunkel, hell);
});

test('Jede Anforderung findet ihre Tokens in beiden Modi', () => {
  for (const modus of ['light', 'dark']) {
    const fehlend = report(modus, tokens[modus], REQUIREMENTS).filter((p) => p.includes('kein Token'));
    assert.deepEqual(fehlend, [], `${modus}: ${fehlend.join('\n')}`);
  }
});

test('Der Ausgangsstand ist auf genau den acht bekannten Paaren rot', () => {
  const probleme = [...report('light', tokens.light, REQUIREMENTS),
                    ...report('dark', tokens.dark, REQUIREMENTS)];
  assert.equal(probleme.length, 8, probleme.join('\n'));
});
