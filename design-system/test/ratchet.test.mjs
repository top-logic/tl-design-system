// Bis das alte Stylesheet leer ist, darf es nur schrumpfen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { measure, foreignTlNames, foreignTlInSources } from '../tools/inventory.mjs';

const MODULE = join(process.env.TL_WORKTREE ?? join(homedir(), 'git/tl8-wt-29584'), 'com.top_logic.layout.react');
const OLD = join(MODULE, 'src/main/webapp/style/tlReactControls.css');
const SOURCES = join(MODULE, 'react-src');
const budget = JSON.parse(readFileSync(new URL('./ratchet.json', import.meta.url)));

test('der Altbestand liegt im Budget', { skip: !existsSync(OLD) && 'Worktree fehlt' }, () => {
  const ist = measure(readFileSync(OLD, 'utf8'));
  assert.ok(ist.lines <= budget.lines, `Zeilen: ${ist.lines} > ${budget.lines}`);
  for (const [k, v] of Object.entries(budget.literals))
    assert.ok(ist.literals[k] <= v, `${k}: ${ist.literals[k]} > ${v}`);
});

test('das Budget ist nachgezogen, wenn der Bestand darunter liegt', { skip: !existsSync(OLD) && 'Worktree fehlt' }, () => {
  const ist = measure(readFileSync(OLD, 'utf8'));
  assert.ok(ist.lines >= budget.lines - 50, `Budget nachziehen: lines ${ist.lines}, Budget ${budget.lines}`);
});

// Der Namensraum `--tl` gehört dem Design System. Was der Altbestand darin definiert oder liest,
// steht als Einfang-Liste im Budget: Neues bricht, Eingefangenes wird gestrichen.
const foreignTl = () => [...new Set([...foreignTlNames(readFileSync(OLD, 'utf8')), ...foreignTlInSources(SOURCES)])].sort();

test('der Altbestand greift nicht neu in den Namensraum --tl', { skip: !existsSync(OLD) && 'Worktree fehlt' }, () => {
  const neu = foreignTl().filter((n) => !budget.foreignTl.includes(n));
  assert.deepEqual(neu, [], `Neu im Namensraum --tl außerhalb des Pakets: ${neu.join(', ')} — eintragen in foreignTl oder umbenennen`);
});

test('die Einfang-Liste ist nachgezogen, wenn ein Name eingefangen ist', { skip: !existsSync(OLD) && 'Worktree fehlt' }, () => {
  const ist = foreignTl();
  const weg = budget.foreignTl.filter((n) => !ist.includes(n));
  assert.deepEqual(weg, [], `Aus foreignTl streichen: ${weg.join(', ')}`);
});
