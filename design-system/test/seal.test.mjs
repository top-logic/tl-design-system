// Die Kopie im Engine-Repo ist ein Erzeugnis, kein Quelltext (16.10., Anlass: #29787 und #29859 änderten sie dort von
// Hand; published.test.mjs läuft nur hier, die Engine baute es grün). Jede erzeugte CSS-Datei endet mit einem Siegel:
// SHA-256 über alles davor. TestDesignSystemCopy in com.top_logic.layout.react rechnet es in Jenkins nach — eine
// Handänderung an der Kopie scheitert dort, der Weg führt über src/ und generate.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const FILES = ['primitives.css', 'tokens.css', 'base.css', 'components.css'];
const SIEGEL = /\/\* tl-design-system sha256:([0-9a-f]{64}) [^\n]*\*\/\n$/;
const WT = process.env.TL_WORKTREE ?? fileURLToPath(new URL('../../_Working-Tree/tl8-wt-29584', import.meta.url));
const ENGINE_TEST = join(WT, 'com.top_logic.layout.react/src/test/java/test/com/top_logic/layout/react/TestDesignSystemCopy.java');

const prüfe = (text) => {
  const m = SIEGEL.exec(text);
  if (!m) return 'kein Siegel';
  const body = text.slice(0, m.index);
  return createHash('sha256').update(body).digest('hex') === m[1] ? 'ok' : 'Siegel bricht';
};

test('jede erzeugte CSS-Datei endet mit ihrem Siegel (SHA-256 über alles davor)', () => {
  for (const f of FILES) assert.equal(prüfe(readFileSync(new URL(`../dist/${f}`, import.meta.url), 'utf8')), 'ok', f);
});

test('eine Änderung von Hand bricht das Siegel', () => {
  const text = readFileSync(new URL('../dist/components.css', import.meta.url), 'utf8');
  assert.equal(prüfe(text.replace('.tl-button', '.tl-buttom')), 'Siegel bricht');
});

test('die Engine rechnet das Siegel nach (TestDesignSystemCopy)', { skip: !existsSync(WT) && 'kein Worktree' }, () => {
  assert.ok(existsSync(ENGINE_TEST), 'TestDesignSystemCopy.java fehlt in com.top_logic.layout.react');
  const java = readFileSync(ENGINE_TEST, 'utf8');
  assert.match(java, /sha256:\(\[0-9a-f\]\{64\}\)/, 'gleiches Siegelmuster wie hier');
  for (const f of FILES) assert.ok(java.includes(`"${f}"`), `${f} wird geprüft`);
});
