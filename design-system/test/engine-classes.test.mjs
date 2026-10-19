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

test('die Spaltenwahl ist ein Ebenen-Panel: kein Kästchen, kein Zeilen-Gruppieren, kein Gruppier-Icon, kein aria-pressed (#29825)', { skip: !existsSync(M) && 'kein Worktree' }, () => {
  const tsx = readFileSync(join(M, 'react-src/controls/TLColumnSelect.tsx'), 'utf8');
  assert.doesNotMatch(tsx, /aria-pressed|tl-checkbox|tl-choice|grouped|groupBy|ICON_GROUP/);
});

// Welle 4a (#29836): keine alte Overlay-Klasse mehr — im TSX jedes Moduls, im alten Stylesheet, in den Java-Quellen,
// den Entwickler-Artikeln (tl-docs) und im Stylesheet der Demo. Modulnamen (TLWindow) treffen nicht: großes TL.
const ALT_4A = /\btl(Dialog|DialogManager|Window|Drawer|Snackbar|NoticeBar|Overlay)(__|--|\b)|\btlPhotoCapture__overlay(Backdrop)?\b/;

function* tree(dir, pattern) {
  if (!existsSync(dir)) return;
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) yield* tree(p, pattern);
    else if (pattern.test(f)) yield p;
  }
}

test('keine alte Klasse der Welle 4a in react-src, Stylesheets, Java, tl-docs und Views', { skip: !existsSync(M) && 'kein Worktree' }, () => {
  const quellen = [
    ...reactSources(),
    join(M, 'src/main/webapp/style/tlReactControls.css'),
    join(WT, 'com.top_logic.demo.react/src/main/webapp/style/tl-demo-react.css'),
    ...tree(join(M, 'src/main/java'), /\.java$/),
    ...tree(join(WT, 'com.top_logic.layout.view/src/main/java/META-INF/tl-docs'), /\.md$/),
    ...tree(join(WT, 'com.top_logic.demo.react/src/main/webapp'), /\.view\.xml$/),
    ...tree(join(WT, 'com.top_logic.layout.view/src/main/webapp'), /\.view\.xml$/),
  ];
  const hits = [];
  for (const p of quellen) readFileSync(p, 'utf8').split('\n').forEach((line, i) => { if (ALT_4A.test(line)) hits.push(`${p.slice(WT.length + 1)}:${i + 1}`); });
  assert.deepEqual(hits, []);
});

// Welle 4b (#29866): keine alte Klasse der Navigation mehr — im TSX jedes Moduls (MUI eingeschlossen), im alten
// Stylesheet, in Java, tl-docs und Views. Modulnamen (TLSidebar) treffen nicht: großes TL.
const ALT_4B = /\btl(Sidebar|AppBar|BottomBar|AppShell|DrawerToggle)(__|--|\b)/;

test('keine alte Klasse der Welle 4b in react-src, Stylesheets, Java, tl-docs und Views', { skip: !existsSync(M) && 'kein Worktree' }, () => {
  const quellen = [
    ...reactSources(),
    join(M, 'src/main/webapp/style/tlReactControls.css'),
    join(WT, 'com.top_logic.demo.react/src/main/webapp/style/tl-demo-react.css'),
    ...tree(join(M, 'src/main/java'), /\.java$/),
    ...tree(join(WT, 'com.top_logic.layout.view/src/main/java'), /\.(java|md)$/),
    ...tree(join(WT, 'com.top_logic.demo.react/src/main/webapp'), /\.view\.xml$/),
    ...tree(join(WT, 'com.top_logic.layout.view/src/main/webapp'), /\.view\.xml$/),
  ];
  const hits = [];
  for (const p of quellen) readFileSync(p, 'utf8').split('\n').forEach((line, i) => { if (ALT_4B.test(line)) hits.push(`${p.slice(WT.length + 1)}:${i + 1}`); });
  assert.deepEqual(hits, []);
});

test('Welle 4b im TSX: main in der Shell, aria-current an den Seiten, aria-expanded am Hamburger, kein englischer Name, 768 nur in der Shell', { skip: !existsSync(M) && 'kein Worktree' }, () => {
  const tsx = (n) => readFileSync(join(M, `react-src/controls/${n}.tsx`), 'utf8');
  assert.match(tsx('TLAppShell'), /<main className="tl-app-shell__content"/);
  assert.match(tsx('TLSidebar'), /aria-current=\{active \? 'page' : undefined\}/);
  assert.match(tsx('TLBottomBar'), /aria-current=\{isActive \? 'page' : undefined\}/);
  assert.match(tsx('TLDrawerToggle'), /aria-expanded=\{open\}/);
  for (const n of ['TLAppShell', 'TLAppBar', 'TLSidebar', 'TLBottomBar', 'TLDrawerToggle'])
    assert.doesNotMatch(tsx(n), /aria-label="[A-Za-z]/, `${n}: Name als Literal`);
  const mit768 = [...reactSources()].filter((p) => /\b768\b/.test(readFileSync(p, 'utf8'))).map((p) => p.slice(WT.length + 1));
  assert.deepEqual(mit768, ['com.top_logic.layout.react/react-src/controls/TLAppShell.tsx']);
});

// Welle 4c (#29870): keine alte Klasse der Behälter mehr — im TSX jedes Moduls (MUI eingeschlossen), im alten
// Stylesheet, in Java, tl-docs, Views und der Demo; kein --page-inset, kein --tl-item-index, kein Dialog-Fuß der 4a.
const ALT_4C = /\btl(Panel|Card|Stack|Grid|Inset|Bounded|Item|DeckPane|SplitPanel|TileStack|Wizard|AdaptiveDetail|ViewError)(__|--|\b)|\btlHtml__error\b|--page-inset\b|--tl-item-index\b|--tlGrid-gap\b|\btl-dialog__footer\b/;

test('keine alte Klasse der Welle 4c in react-src, Stylesheets, Java, tl-docs und Views', { skip: !existsSync(M) && 'kein Worktree' }, () => {
  const quellen = [
    ...reactSources(),
    join(M, 'src/main/webapp/style/tlReactControls.css'),
    join(WT, 'com.top_logic.demo.react/src/main/webapp/style/tl-demo-react.css'),
    ...tree(join(M, 'src/main/java'), /\.java$/),
    ...tree(join(WT, 'com.top_logic.layout.view/src/main/java'), /\.(java|md)$/),
    ...tree(join(WT, 'com.top_logic.demo.react/src/main/webapp'), /\.view\.xml$/),
    ...tree(join(WT, 'com.top_logic.layout.view/src/main/webapp'), /\.view\.xml$/),
  ];
  const hits = [];
  for (const p of quellen) readFileSync(p, 'utf8').split('\n').forEach((line, i) => { if (ALT_4C.test(line)) hits.push(`${p.slice(WT.length + 1)}:${i + 1}`); });
  assert.deepEqual(hits, []);
});

test('Welle 4c im TSX: Griffe mit role=separator und Tastatur, Minimieren mit aria-expanded, Fensterfuß direkt an der Fläche, kein englischer Name', { skip: !existsSync(M) && 'kein Worktree' }, () => {
  const tsx = (n) => readFileSync(join(M, `react-src/controls/${n}.tsx`), 'utf8');
  assert.match(tsx('TLSplitPanel'), /role="separator"[\s\S]*tabIndex=\{0\}[\s\S]*onKeyDown=/);
  assert.match(tsx('TLSplitPanel'), /onDoubleClick=\{handleReset\}/);
  assert.match(tsx('TLTableView'), /onKeyDown=\{\(e\) => handleResizeKeyDown\(/);
  assert.match(tsx('TLPanel'), /aria-expanded=\{!isMinimized\}/);
  assert.match(tsx('TLWindow'), /querySelector<HTMLElement>\(':scope > \.tl-button-bar'\)/);
  for (const n of ['TLPanel', 'TLCard', 'TLSplitPanel', 'TLWizard', 'TLAdaptiveDetail', 'TLAccordion'])
    assert.doesNotMatch(tsx(n), /aria-label="[A-Za-z]/, `${n}: Name als Literal`);
});

test('der Abstand des Grids im TSX ist der des Stylesheets', { skip: !existsSync(M) && 'kein Worktree' }, async () => {
  const { readGenerated, declarationsOf } = await import('./lib/component.mjs');
  const tsx = readFileSync(join(M, 'react-src/controls/TLGrid.tsx'), 'utf8');
  const map = Object.fromEntries([...tsx.matchAll(/(compact|default|loose): 'var\((--tl-space-[a-z0-9]+)\)'/g)].map((m) => [m[1], m[2]]));
  const css = readGenerated('layout', 'layout.css');
  for (const stufe of ['compact', 'default', 'loose']) {
    const gap = /gap:\s*var\((--tl-space-[a-z0-9]+)\)/.exec(declarationsOf(css, `.tl-grid--gap-${stufe}`) ?? '')?.[1];
    assert.equal(map[stufe], gap, stufe);
  }
});

// Welle 5a (#29875): keine alte Klasse der Eingaben mehr — Farbfeld, Icon-Feld, Slider samt --tlSlider-*.
const ALT_5A = /\btl(ColorInput|IconSelect|Slider)(__|--|\b)|--tlSlider-/;

test('keine alte Klasse der Welle 5a in react-src, Stylesheets, Java, tl-docs und Views', { skip: !existsSync(M) && 'kein Worktree' }, () => {
  const quellen = [
    ...reactSources(),
    join(M, 'src/main/webapp/style/tlReactControls.css'),
    join(WT, 'com.top_logic.demo.react/src/main/webapp/style/tl-demo-react.css'),
    ...tree(join(M, 'src/main/java'), /\.java$/),
    ...tree(join(WT, 'com.top_logic.layout.view/src/main/java'), /\.(java|md)$/),
    ...tree(join(WT, 'com.top_logic.demo.react/src/main/webapp'), /\.view\.xml$/),
    ...tree(join(WT, 'com.top_logic.layout.view/src/main/webapp'), /\.view\.xml$/),
  ];
  const hits = [];
  for (const p of quellen) readFileSync(p, 'utf8').split('\n').forEach((line, i) => { if (ALT_5A.test(line)) hits.push(`${p.slice(WT.length + 1)}:${i + 1}`); });
  assert.deepEqual(hits, []);
});

test('Welle 5a im TSX: Picker als Dialog mit usePopover, Reiter mit useTabList, kein englischer Name', { skip: !existsSync(M) && 'kein Worktree' }, () => {
  const tsx = (n) => {
    const p = [...reactSources()].find((q) => q.endsWith(`/${n}.tsx`));
    assert.ok(p, `${n}.tsx nicht in den React-Quellen gefunden`);
    return readFileSync(p, 'utf8');
  };
  const pp = tsx('PickerPopover');
  assert.match(pp, /role="dialog"/);
  assert.match(pp, /usePopover/);
  assert.match(tsx('TLTabBar'), /useTabList/);
  for (const n of ['TLColorInput', 'ColorPopup', 'TLIconSelect', 'IconSelectPopup', 'TLSlider'])
    assert.doesNotMatch(tsx(n), /aria-label="[A-Za-z]/, `${n}: Name als Literal`);
});

// Welle 5b (Medien): \btl ist klein geschrieben und trifft die Control-Namen TLImage, TLHtml … in
// register('TLImage', …) nicht; TLCounter ist als Control ganz gestrichen und darum groß geschrieben gelistet.
const ALT_5B = /\btl(AudioRecorder|AudioPlayer|PhotoCapture|Download|FileChips|Image|PdfViewer|Html|JobStatus|Counter|BinaryField)(__|--|\b)|\bTLCounter\b|\btl-wizard__(steps|step-item|disc|step-name)\b/;

test('keine alte Klasse der Welle 5b in react-src, Stylesheets, Java, tl-docs und Views', { skip: !existsSync(M) && 'kein Worktree' }, () => {
  const quellen = [
    ...reactSources(),
    join(M, 'src/main/webapp/style/tlReactControls.css'),
    join(WT, 'com.top_logic.demo.react/src/main/webapp/style/tl-demo-react.css'),
    ...tree(join(M, 'src/main/java'), /\.java$/),
    ...tree(join(WT, 'com.top_logic.layout.view/src/main/java'), /\.(java|md)$/),
    ...tree(join(WT, 'com.top_logic.demo.react/src/main/webapp'), /\.view\.xml$/),
    ...tree(join(WT, 'com.top_logic.layout.view/src/main/webapp'), /\.view\.xml$/),
  ];
  const hits = [];
  for (const p of quellen) readFileSync(p, 'utf8').split('\n').forEach((line, i) => { if (ALT_5B.test(line)) hits.push(`${p.slice(WT.length + 1)}:${i + 1}`); });
  assert.deepEqual(hits, []);
});

test('Welle 5b im TSX: Medienknöpfe ohne Bootstrap-Glyphe und SVG, Kamera als Dialog im Portal, kein englischer Name', { skip: !existsSync(M) && 'kein Worktree' }, () => {
  const tsx = (n) => {
    const p = [...reactSources()].find((q) => q.endsWith(`/${n}.tsx`));
    assert.ok(p, `${n}.tsx nicht in den React-Quellen gefunden`);
    return readFileSync(p, 'utf8');
  };
  for (const n of ['TLAudioRecorder', 'TLAudioPlayer', 'TLPhotoCapture', 'TLHtml']) {
    const s = tsx(n);
    assert.doesNotMatch(s, /css:bi /, `${n}: Bootstrap-Glyphe`);
    assert.doesNotMatch(s, /<svg/, `${n}: eigenes SVG`);
  }
  const pc = tsx('TLPhotoCapture');
  assert.match(pc, /tl-dialog__surface/);
  assert.match(pc, /createPortal/);
  for (const n of ['TLAudioRecorder', 'TLAudioPlayer', 'TLPhotoCapture', 'TLDownload', 'TLFileChips', 'TLFileUpload', 'TLBinaryField', 'TLImage', 'TLPdfViewer', 'TLHtml', 'TLJobStatus'])
    assert.doesNotMatch(tsx(n), /aria-label="[A-Za-z]/, `${n}: Name als Literal`);
});

// Welle 5c (Planen und Ziehen): \btl ist klein geschrieben und trifft register('TLCalendar', …) und die
// Java-Klassen CalendarViewControl, DashboardElement nicht. --cal-ev-bg war die Terminfarbe am Element,
// tl-table__hint der Ablagehinweis der Tabelle (heute tl-drop-hint).
const ALT_5C = /\btl(Cal[A-Z]\w*|Calendar|KanbanBoard|Dashboard|ValueList|RowCommandCell)(__|--|\b)|--cal-ev-bg|\btl-table__hint\b/;

test('keine alte Klasse der Welle 5c in react-src, Stylesheets, Java, tl-docs und Views', { skip: !existsSync(M) && 'kein Worktree' }, () => {
  const quellen = [
    ...reactSources(),
    join(M, 'src/main/webapp/style/tlReactControls.css'),
    join(WT, 'com.top_logic.demo.react/src/main/webapp/style/tl-demo-react.css'),
    ...tree(join(M, 'src/main/java'), /\.java$/),
    ...tree(join(WT, 'com.top_logic.layout.view/src/main/java'), /\.(java|md)$/),
    ...tree(join(WT, 'com.top_logic.demo.react/src/main/webapp'), /\.view\.xml$/),
    ...tree(join(WT, 'com.top_logic.layout.view/src/main/webapp'), /\.view\.xml$/),
  ];
  const hits = [];
  for (const p of quellen) readFileSync(p, 'utf8').split('\n').forEach((line, i) => { if (ALT_5C.test(line)) hits.push(`${p.slice(WT.length + 1)}:${i + 1}`); });
  assert.deepEqual(hits, []);
});

test('Welle 5c im TSX: Interaktiv-Prüfung und Ablagehinweis zusammengelegt, keine feste Farbe im Kalender, kein englischer Name', { skip: !existsSync(M) && 'kein Worktree' }, () => {
  const tsx = (n) => {
    const p = [...reactSources()].find((q) => q.endsWith(`/${n}.tsx`));
    assert.ok(p, `${n}.tsx nicht in den React-Quellen gefunden`);
    return readFileSync(p, 'utf8');
  };
  assert.ok(!existsSync(join(M, 'react-src/controls/interactive.ts')), 'controls/interactive.ts lebt in bridge/interactive.ts');
  assert.ok(!existsSync(join(M, 'react-src/controls/drop-hint.ts')), 'controls/drop-hint.ts lebt in controls/DropHint.tsx');
  assert.doesNotMatch(tsx('TLCalendar'), /#[0-9a-f]{6}/, 'TLCalendar: feste Farbe');
  for (const n of ['TLKanbanBoard', 'TLDashboard', 'TLCalendar'])
    assert.doesNotMatch(tsx(n), /aria-label="[A-Za-z]/, `${n}: Name als Literal`);
});
