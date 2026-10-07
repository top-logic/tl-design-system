// Ziehen und Ablegen: ein Rechner, eine Optik — 3b §9 (W11). Die Optik steht einmal, in drag.css, und
// liest nur Zustände; kein Block zeichnet ein Drop-Ziel oder die gezogene Quelle selbst.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readGenerated, declarationsOf, componentCssFiles } from './lib/component.mjs';

const css = readGenerated('drag', 'drag.css');

// Alle Deklarationen aller Regeln, die den Selektor nennen (die Fläche teilen sich vier Zustände;
// declarationsOf gibt nur die erste Regel).
const alle = (sel) => [...css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/([^{}]+)\{([^}]*)\}/g)]
  .filter((m) => m[1].split(',').map((s) => s.trim()).includes(sel)).map((m) => m[2]).join(';');

// Plan-Review M4: ein inset-Schatten am Ziel läge unter den Hintergründen seiner Kinder (Filterleiste,
// Kopf und Zeilen an der Tabellenwurzel; haftende Zellen an einer Zeile). Marke und Rahmen liegen darum
// auf einer Fläche ::before über dem Ziel; ::after ist der Cursor-Ring (base.css).
test('drag.css: Einfügemarke, Ablegen darauf, Ablehnung auf einer Fläche über dem Ziel, gezogene Quelle blass', () => {
  for (const z of ['drop-before', 'drop-after', 'drop-onto', 'drop-refused']) {
    const flaeche = alle(`[data-tl-state~="${z}"]::before`);
    for (const d of [/content:\s*""/, /position:\s*absolute/, /inset:\s*0/, /z-index:\s*var\(--tl-layer-sticky\)/, /pointer-events:\s*none/])
      assert.match(flaeche, d, z);
    // Die Marke folgt der Form des Ziels (runde Pille, Option mit radius-sm); eckige Ziele bleiben eckig.
    assert.match(flaeche, /border-radius:\s*inherit/, z);
    assert.match(declarationsOf(css, `:where([data-tl-state~="${z}"])`) ?? '', /position:\s*relative/, z);
    assert.doesNotMatch(alle(`[data-tl-state~="${z}"]`), /box-shadow/, `${z}: der Rahmen liegt auf ::before, nicht am Ziel`);
  }
  assert.match(alle('[data-tl-state~="drop-before"]::before'),
    /box-shadow:\s*inset 0 var\(--tl-border-width-accent\) 0 0 var\(--tl-border-interactive\)/);
  assert.match(alle('[data-tl-state~="drop-after"]::before'),
    /box-shadow:\s*inset 0 calc\(-1 \* var\(--tl-border-width-accent\)\) 0 0 var\(--tl-border-interactive\)/);
  assert.match(alle('[data-tl-axis="horizontal"] > [data-tl-state~="drop-before"]::before'),
    /box-shadow:\s*inset var\(--tl-border-width-accent\) 0 0 0 var\(--tl-border-interactive\)/);
  assert.match(alle('[data-tl-axis="horizontal"] > [data-tl-state~="drop-after"]::before'),
    /box-shadow:\s*inset calc\(-1 \* var\(--tl-border-width-accent\)\) 0 0 0 var\(--tl-border-interactive\)/);
  assert.match(alle('[data-tl-state~="drop-onto"]'), /background:\s*var\(--tl-surface-interactive-selected\)/);
  assert.match(alle('[data-tl-state~="drop-onto"]::before'),
    /box-shadow:\s*inset 0 0 0 var\(--tl-border-width-md\) var\(--tl-border-interactive\)/);
  assert.match(alle('[data-tl-state~="drop-refused"]::before'),
    /box-shadow:\s*inset 0 0 0 var\(--tl-border-width-md\) var\(--tl-status-error-border\)/);
  assert.match(alle('[data-tl-state~="dragging"]'), /opacity:\s*0\.4/);
});

test('kein anderer Block zeichnet die Ziehen-Zustände', () => {
  const offen = [];
  for (const [name, src] of componentCssFiles()) {
    if (name === 'drag/drag.css') continue;
    const ohne = src.replace(/\/\*[\s\S]*?\*\//g, '');
    if (/data-tl-state~="(drop-[a-z]+|dragging)"/.test(ohne)) offen.push(name);
  }
  assert.deepEqual(offen, []);
});

test('tl-reorder-list: Liste ohne Aufzählung, Einträge size-row, Griff innen fokussiert, höchstens size-popover-max', () => {
  const liste = readGenerated('reorder-list', 'reorder-list.css');
  const d = declarationsOf(liste, '.tl-reorder-list') ?? '';
  assert.match(d, /list-style:\s*none/);
  assert.match(d, /max-height:\s*var\(--tl-size-popover-max\)/);
  assert.match(declarationsOf(liste, '.tl-reorder-list__item') ?? '', /min-height:\s*var\(--tl-size-row\)/);
  assert.match(declarationsOf(liste, '.tl-reorder-list__handle:focus-visible') ?? '', /outline-offset:\s*calc\(-1 \* var\(--tl-focus-offset\)\)/);
  assert.doesNotMatch(liste, /--(dragover|drag-over|group-by|fixed|active)\b/);
});
