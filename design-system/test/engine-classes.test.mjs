// Welle 2 ist fertig, wenn keine alte Formular-Klasse mehr in der Engine steht — weder im TSX noch
// im alten Stylesheet. Ohne Worktree (Kundenrechner, CI des Pakets) wird der Test übersprungen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const WT = process.env.TL_WORKTREE ?? fileURLToPath(new URL('../../_Working-Tree/tl8-wt-29584', import.meta.url));
const M = join(WT, 'com.top_logic.layout.react');
// Kein schließendes \b: vor `__` und `--` liegt keine Wortgrenze, tlFormField__error muss treffen.
const ALT = /\b(tlReactTextInput|tlReactNumberInput|tlReactDatePicker|tlReactSelect|tlReactCheckbox|tlBooleanChoice|tlSegmentedChoice|tlOptionChips|tlDropdownSelect|tlOptionValue|tlOptionImage|tlOptionIcon|tlResourceCell|tlFormField|tlFormGroup|tlFormLayout|tlFieldList|tlFileUpload|tlVisuallyHidden)/;

function* files(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) yield* files(p);
    else if (/\.(tsx?|css)$/.test(f)) yield p;
  }
}

test('keine alte Formular-Klasse in react-src und tlReactControls.css', { skip: !existsSync(M) && 'kein Worktree' }, () => {
  const hits = [];
  for (const p of [...files(join(M, 'react-src')), join(M, 'src/main/webapp/style/tlReactControls.css')]) {
    readFileSync(p, 'utf8').split('\n').forEach((line, i) => { if (ALT.test(line)) hits.push(`${p.slice(M.length + 1)}:${i + 1}`); });
  }
  assert.deepEqual(hits, []);
});
