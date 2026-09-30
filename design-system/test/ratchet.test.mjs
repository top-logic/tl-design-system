// Bis das alte Stylesheet leer ist, darf keiner seiner Blöcke wachsen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { measureBlocks, blocks, foreignTlNames, foreignTlInSources, foreignOf } from '../tools/inventory.mjs';
import { knownVariables } from '../tools/lint-css.mjs';

const MODULE = join(process.env.TL_WORKTREE ?? fileURLToPath(new URL('../../_Working-Tree/tl8-wt-29584', import.meta.url)), 'com.top_logic.layout.react');
const OLD = join(MODULE, 'src/main/webapp/style/tlReactControls.css');
const SOURCES = join(MODULE, 'react-src');
const budget = JSON.parse(readFileSync(new URL('./ratchet.json', import.meta.url)));

// Die Ratsche misst Blöcke, nicht die Datei: ein Block, den eine Welle abgeschnitten hat, ist aus
// dem Budget gestrichen; ein Block, der von außen wächst, bricht mit seinem Namen — der Absender
// ist dann zurechenbar und die Hebung steht bei ihm, nicht bei der Welle.
const ist = () => measureBlocks(readFileSync(OLD, 'utf8'), Object.keys(budget.blocks));

test('kein Block des Altbestands wächst über sein Budget', { skip: !existsSync(OLD) && 'Worktree fehlt' }, () => {
  const { blocks, literals } = ist();
  const gewachsen = Object.entries(blocks).filter(([n, l]) => l > budget.blocks[n]).map(([n, l]) => `${n}: ${l} > ${budget.blocks[n]}`);
  assert.deepEqual(gewachsen, [], `Block über Budget — Absender vermerken und heben, oder abschneiden:\n${gewachsen.join('\n')}`);
  for (const [k, v] of Object.entries(budget.literals))
    assert.ok(literals[k] <= v, `${k}: ${literals[k]} > ${v}`);
});

test('das Budget ist nachgezogen, wenn ein Block gesunken oder abgeschnitten ist', { skip: !existsSync(OLD) && 'Worktree fehlt' }, () => {
  const { blocks, missing } = ist();
  assert.deepEqual(missing, [], `Abgeschnitten — aus blocks streichen: ${missing.join(', ')}`);
  const gesunken = Object.entries(blocks).filter(([n, l]) => l < budget.blocks[n] - 20).map(([n, l]) => `${n}: ${l} < ${budget.blocks[n]}`);
  assert.deepEqual(gesunken, [], `Budget nachziehen:\n${gesunken.join('\n')}`);
});

test('die Blockzerlegung kennt Kopf, Überschriften und doppelte Namen', () => {
  const css = '/* Kopf */\n.a{}\n/* --- Eins ----- */\n.b{}\n.c{}\n/* --- Zwei (mit Klammer). -- */\n.d{}\n/* --- Eins --- */\n.e{}\n';
  assert.deepEqual(blocks(css).map((b) => [b.name, b.lines]),
    [['Kopf', 2], ['Eins', 3], ['Zwei (mit Klammer).', 2], ['Eins (2)', 2]]);
  const m = measureBlocks(css, ['Eins', 'Drei']);
  assert.equal(m.lines, 3);
  assert.deepEqual(m.missing, ['Drei']);
  assert.deepEqual(m.unlisted, ['Kopf', 'Zwei (mit Klammer).', 'Eins (2)']);
});

// Der Namensraum `--tl` gehört dem Design System. Lesen ist erlaubt — dafür sind Tokens da;
// fremd ist nur, was der Altbestand selbst im Namensraum definiert oder was kein Paket-Token
// ist. Das steht als Einfang-Liste im Budget: Neues bricht, Eingefangenes wird gestrichen.
const DIST = new URL('../dist/', import.meta.url);
const KNOWN = knownVariables(
  readFileSync(new URL('primitives.css', DIST), 'utf8')
  + readFileSync(new URL('tokens.css', DIST), 'utf8')
  + readFileSync(new URL('base.css', DIST), 'utf8'),
);
const foreignTl = () => foreignOf([...foreignTlNames(readFileSync(OLD, 'utf8')), ...foreignTlInSources(SOURCES)], KNOWN);

test('der Altbestand greift nicht neu in den Namensraum --tl', { skip: !existsSync(OLD) && 'Worktree fehlt' }, () => {
  const neu = foreignTl().filter((n) => !budget.foreignTl.includes(n));
  assert.deepEqual(neu, [], `Neu im Namensraum --tl außerhalb des Pakets: ${neu.join(', ')} — eintragen in foreignTl oder umbenennen`);
});

test('die Einfang-Liste ist nachgezogen, wenn ein Name eingefangen ist', { skip: !existsSync(OLD) && 'Worktree fehlt' }, () => {
  const ist = foreignTl();
  const weg = budget.foreignTl.filter((n) => !ist.includes(n));
  assert.deepEqual(weg, [], `Aus foreignTl streichen: ${weg.join(', ')}`);
});

test('foreignOf lässt ein Paket-Token durch, das der Altbestand nur liest, und fängt ein eigenes --tl ein', () => {
  const known = new Set(['--tl-surface-layer']);
  const namen = ['--tl-surface-layer', '--tl-eigenes-ding'];
  assert.deepEqual(foreignOf(namen, known), ['--tl-eigenes-ding']);
});
