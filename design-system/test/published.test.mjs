// Der Worktree trägt genau das Paket, das dist/ erzeugt: jede veröffentlichte Datei byte-gleich (12.10.). Anlass:
// text-helper gray-49 stand am 09.10. in dist/, aber nicht im Worktree — publish-to-worktree.mjs war nach der
// Änderung nicht gelaufen, und kein Gate hat es gemerkt. Ohne Worktree (Kundenrechner, CI des Pakets) wird der
// Test übersprungen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const WT = process.env.TL_WORKTREE ?? fileURLToPath(new URL('../../_Working-Tree/tl8-wt-29584', import.meta.url));
const DEST = join(WT, 'com.top_logic.layout.react/src/main/webapp/style/tl-design-system');

test('der Worktree trägt dist/ byte-gleich (sonst node tools/publish-to-worktree.mjs)', { skip: !existsSync(DEST) && 'kein Worktree' }, () => {
  for (const f of ['primitives.css', 'tokens.css', 'base.css', 'components.css']) {
    const own = readFileSync(new URL(`../dist/${f}`, import.meta.url));
    assert.ok(own.equals(readFileSync(join(DEST, f))), `${f} im Worktree weicht von dist/ ab`);
  }
});
