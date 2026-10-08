// Die Wellen 2, 3a und 3b sind fertig, wenn keine ihrer alten Klassen (Formular, Menü, Toolbar, Tabs,
// Breadcrumb, Tabelle, Baum, Spaltenwahl, Spalten, Text) mehr in der Engine steht — weder im TSX noch im alten Stylesheet. Ohne Worktree (Kundenrechner, CI des Pakets) wird der Test übersprungen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const WT = process.env.TL_WORKTREE ?? fileURLToPath(new URL('../../_Working-Tree/tl8-wt-29584', import.meta.url));
const M = join(WT, 'com.top_logic.layout.react');
// Kein schließendes \b: vor `__` und `--` liegt keine Wortgrenze, tlFormField__error und tlTableView__row
// müssen treffen. tlColumns trifft tlColumnSelect nicht (das S ist groß).
const ALT = /\b(tlReactTextInput|tlReactNumberInput|tlReactDatePicker|tlReactSelect|tlReactCheckbox|tlBooleanChoice|tlSegmentedChoice|tlOptionChips|tlDropdownSelect|tlOptionValue|tlOptionImage|tlOptionIcon|tlResourceCell|tlFormField|tlFormGroup|tlFormLayout|tlFieldList|tlFileUpload|tlVisuallyHidden|tlMenu|tlMenuRegion|tlUserMenu|tlToolbar|tlReactTabBar|tlBreadcrumb|tlTableView|tlTreeView|tlColumnSelect|tlColumns|tlText)/;

function* files(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) yield* files(p);
    else if (/\.(tsx?|css)$/.test(f)) yield p;
  }
}

// Jedes Modul mit react-src: die Satelliten (Demo, Kundenmodule im Worktree) nutzen die Controls
// ebenso und dürfen keine alte Klasse behalten.
function* reactSources() {
  for (const d of readdirSync(WT)) {
    if (!d.startsWith('com.top_logic.')) continue;
    const src = join(WT, d, 'react-src');
    if (existsSync(src) && statSync(src).isDirectory()) yield* files(src);
  }
}

test('keine alte Klasse der Wellen 2, 3a und 3b in react-src eines Moduls und in tlReactControls.css', { skip: !existsSync(M) && 'kein Worktree' }, () => {
  const hits = [];
  for (const p of [...reactSources(), join(M, 'src/main/webapp/style/tlReactControls.css')]) {
    readFileSync(p, 'utf8').split('\n').forEach((line, i) => { if (ALT.test(line)) hits.push(`${p.slice(WT.length + 1)}:${i + 1}`); });
  }
  assert.deepEqual(hits, []);
});
