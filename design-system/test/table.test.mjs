// Die Tabelle — 3b §3–§6: Zeile size-row, Kopf size-bar, Lage und Cursor als Attribute.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readGenerated, declarationsOf, rulesOf } from './lib/component.mjs';

const css = readGenerated('table', 'table.css');

test('tl-table: Zeile size-row, Kopf size-bar, Zustände als Attribute, keine Literale des Altbestands', () => {
  assert.match(declarationsOf(css, '.tl-table__row') ?? '', /min-height:\s*var\(--tl-size-row\)/);
  // Positioniert: Bezug für den Ring (::after) und die Ziehen-Marke (::before), auch im Specimen.
  assert.match(declarationsOf(css, '.tl-table__row') ?? '', /position:\s*relative/);
  // Jedes Element, das display setzt, setzt auch [hidden] (3a-Regel; hidden.test prüft nur Blöcke).
  for (const el of ['filter-bar', 'save', 'frame', 'grid', 'header-row', 'header-cell', 'sort', 'row', 'cell', 'tree', 'placeholder'])
    assert.match(declarationsOf(css, `.tl-table__${el}[hidden]`) ?? '', /display:\s*none/, el);
  assert.match(declarationsOf(css, '.tl-table__row') ?? '', /border-bottom:\s*var\(--tl-border-width-sm\) solid var\(--tl-border-separator\)/);
  assert.match(declarationsOf(css, ':where(.tl-table__row:hover)') ?? '', /surface-interactive-hover/);
  assert.match(declarationsOf(css, ':where(.tl-table__row[aria-selected="true"])') ?? '', /surface-interactive-selected/);
  assert.match(declarationsOf(css, ':where(.tl-table__row)') ?? '', /background:\s*var\(--tl-surface-layer\)/);
  assert.match(declarationsOf(css, '.tl-table__header-row') ?? '', /min-height:\s*var\(--tl-size-bar\)/);
  assert.match(declarationsOf(css, '.tl-table__header') ?? '', /border-bottom:\s*var\(--tl-border-width-sm\) solid var\(--tl-border-emphasis\)/);
  const haftend = declarationsOf(css, '.tl-table__cell[data-tl-state~="frozen"]') ?? '';
  assert.match(haftend, /position:\s*sticky/);
  assert.match(haftend, /z-index:\s*var\(--tl-layer-raised\)/);
  assert.match(haftend, /background:\s*inherit/);
  assert.match(declarationsOf(css, '.tl-table__cell[data-tl-state~="frozen-last"]') ?? '', /border-emphasis/);
  assert.match(declarationsOf(css, '.tl-table__cell[data-tl-state~="pinned-first"]') ?? '', /border-emphasis/);
  assert.match(declarationsOf(css, '.tl-table__freeze-preview') ?? '', /z-index:\s*var\(--tl-layer-sticky\)/);
  assert.match(declarationsOf(css, '.tl-table__spacer') ?? '', /width:\s*var\(--tl-size-control-sm\)/);
  assert.match(declarationsOf(css, '.tl-table__cell .tl-field[aria-invalid="true"]') ?? '',
    /box-shadow:\s*inset 0 0 0 var\(--tl-border-width-md\) var\(--tl-status-error-border\)/);
  assert.match(declarationsOf(css, '.tl-table__cell .tl-field[data-tl-state~="warning"]') ?? '', /status-warning-border/);
  assert.doesNotMatch(css, /shadow-raised|clip-path|accent-color|outline\s*:|font-weight|--(selected|cursor|group|frozen|pinned|active)\b/);
  assert.match(declarationsOf(css, '.tl-table__header-cell[data-tl-state~="filtered"] .tl-table__filter') ?? '', /icon-primary/);
});

test('der Körper isoliert seinen Stapel, Spaltenwahl und Fixiergrenze sind so hoch wie die Kopfzeile', () => {
  assert.match(declarationsOf(css, '.tl-table__body') ?? '', /isolation:\s*isolate/);
  // Der Rahmen isoliert die Ebenen von Kopf, Griff und Vorschau: eine haftende Kopfzelle (layer-raised)
  // liegt nie über einem Popover oder einem Nachbarn der Seite (E7, Orchestrator-Entscheid 6).
  assert.match(declarationsOf(css, '.tl-table__frame') ?? '', /isolation:\s*isolate/);
  // Der Kopf steht außerhalb des Rollbehälters: der Körper schneidet Ring (::after) und Marke (::before) seiner
  // Zeilen ab, die unter den Kopf rollen. Darum braucht der Kopf keine eigene Ebene (table.contract.md „Stapel“).
  assert.match(declarationsOf(css, '.tl-table__body') ?? '', /overflow:\s*auto/);
  assert.doesNotMatch(declarationsOf(css, '.tl-table__header') ?? '', /z-index|position/);
  assert.match(declarationsOf(css, '.tl-table__columns') ?? '', /height:\s*var\(--tl-size-bar\)/);
  assert.match(declarationsOf(css, '.tl-table__freeze') ?? '', /height:\s*var\(--tl-size-bar\)/);
  assert.match(declarationsOf(css, '.tl-table__hint') ?? '', /status-error-border/);
});

// E8 (08.10.): fixierte und angeheftete Kopfzellen sind deckend — sie erben die Fläche der Kopfzeile, über die
// scrollende Überschriften laufen. Jede Kopfzelle isoliert ihren Stapel: die Einfügemarke eines Spaltenzugs
// (::before, layer-sticky) einer Überschrift, die unter die fixierten rollt, malt nicht über deren Zellen.
test('Kopf: haftende Zellen deckend, Einfügemarke einer Überschrift bleibt in ihrer Zelle', () => {
  assert.match(declarationsOf(css, '.tl-table__header-row') ?? '', /background:\s*var\(--tl-surface-layer\)/);
  for (const lage of ['frozen', 'pinned']) {
    const d = declarationsOf(css, `.tl-table__header-cell[data-tl-state~="${lage}"]`) ?? '';
    assert.match(d, /position:\s*sticky/, lage);
    assert.match(d, /z-index:\s*var\(--tl-layer-raised\)/, lage);
    assert.match(d, /background:\s*inherit/, lage);
  }
  assert.match(declarationsOf(css, '.tl-table__header-cell') ?? '', /isolation:\s*isolate/);
});

// Fix-Runde 1 (07.10.): Füllen ist für Lesewerte ohne eigene Form. Eine Kapsel (Pill — seit P6 die Wurzel eines
// TLText als Pill —, Badge, Chip) direkt in der Zelle würde sonst zum Block über die ganze Zellbreite.
test('der Lesewert füllt die Zelle: nur span ohne Klasse und tl-text, keine Kapsel', () => {
  assert.equal(declarationsOf(css, '.tl-table__cell > span'), null, 'keine Füll-Regel für jeden span');
  for (const sel of ['.tl-table__cell > :where(span):not([class])', '.tl-table__cell > .tl-text']) {
    const d = declarationsOf(css, sel) ?? '';
    for (const re of [/display:\s*block/, /width:\s*100%/, /text-overflow:\s*ellipsis/, /white-space:\s*nowrap/]) assert.match(d, re, sel);
  }
  for (const [sels, body] of rulesOf(css))
    if (/\.tl-(pill|badge|chip)\b/.test(sels)) assert.doesNotMatch(body, /display\s*:|(^|[^-])width\s*:\s*100%/, sels);
});

test('Kapseln in der Zelle behalten ihre Form und bleiben in der Zelle (max-width), die Pill kürzt mit Ellipse', () => {
  const kapsel = declarationsOf(css, '.tl-table__cell > .tl-pill') ?? '';
  assert.match(kapsel, /max-width:\s*100%/);
  for (const k of ['.tl-table__cell > .tl-badge', '.tl-table__cell > .tl-chip']) assert.equal(declarationsOf(css, k), kapsel, k);
  assert.match(declarationsOf(css, '.tl-table__cell > .tl-pill > .tl-pill__label') ?? '', /min-width:\s*0/);
});

// Ablegen auf eine Zeile färbt sie surface-interactive-selected (drag.css, [data-tl-state~="drop-onto"], eine
// Attribut-Spezifität). Eine Fläche der Zeile selbst — Grund, gezeigt, ausgewählt — stünde mit
// Klasse plus Pseudo-Klasse oder Attribut darüber und verdeckte das Ziel unter dem Zeiger (drag.contract.md
// „Bild“): jede Regel, die der Zeile selbst eine Fläche gibt, steht darum ganz in :where.
test('tl-table: jede Fläche der Zeile steht in :where, Ablegen darauf übermalt sie', () => {
  const ohne = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const offen = [];
  for (const m of ohne.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
    if (!/(^|;)\s*background(-color)?\s*:/.test(m[2])) continue;
    for (const sel of m[1].split(',').map((x) => x.trim())) {
      // Die Zeile selbst ist das Subjekt: kein Kombinator hinter .tl-table__row.
      const subjekt = sel.replace(/^:where\((.*)\)$/, '$1');
      if (!/\.tl-table__row(?![\w-])[^\s>+~]*$/.test(subjekt)) continue;
      if (!/^:where\(.*\)$/.test(sel)) offen.push(sel);
    }
  }
  assert.deepEqual(offen, []);
});
