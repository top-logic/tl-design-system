// Bis das alte Stylesheet leer ist, darf es nur schrumpfen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { measure } from '../tools/inventory.mjs';

const OLD = join(process.env.TL_WORKTREE ?? join(homedir(), 'git/tl8-wt-29584'),
  'com.top_logic.layout.react/src/main/webapp/style/tlReactControls.css');
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
