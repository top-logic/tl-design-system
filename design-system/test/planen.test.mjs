// Welle 5c (Spec 2026-10-19 Planen und Ziehen §4, §8): gefüllte Kategorien für Termine und die beiden
// Kandidaten der Beschriftung als Rollen. Was derive daraus rechnet, prüft derive.test.mjs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readComponent, readGenerated, declarationsOf, rulesOf } from './lib/component.mjs';

const T = JSON.parse(readFileSync(new URL('../src/tokens.json', import.meta.url)));
const P = JSON.parse(readFileSync(new URL('../src/primitives.json', import.meta.url)));
const TOKENS_CSS = readFileSync(new URL('../dist/tokens.css', import.meta.url), 'utf8');
const MODES = ['light', 'dark'];
const KATEGORIEN = [1, 2, 3, 4, 5, 6, 7, 8];

/** Der Block eines Modus in dist/tokens.css: von seinem Selektor bis zur schließenden Klammer. */
const blockVon = (selektor) => {
  const start = TOKENS_CSS.indexOf(selektor);
  assert.ok(start >= 0, `${selektor} fehlt in dist/tokens.css`);
  return TOKENS_CSS.slice(start, TOKENS_CSS.indexOf('\n}', start));
};

test('kategorie: gefüllte Fläche je Kategorie in beiden Modi', () => {
  // Die heutigen dunklen -border-Stufen: weiße Schrift hält dort 5,3–5,4:1 (Spec 5c §4).
  const soll = ['{red-46}', '{amber-47}', '{green-48}', '{teal-48}', '{blue-48}', '{blue-46}', '{magenta-46}', '{magenta-47}'];
  for (const m of MODES) for (const k of KATEGORIEN)
    assert.equal(T.color[m][`category-${k}-surface`], soll[k - 1], `${m}: category-${k}-surface`);
});

test('kategorie: Schrift gerechnet', () => {
  for (const m of MODES) for (const k of KATEGORIEN)
    assert.deepEqual(T.derived[m][`text-on-category-${k}`], { surface: `category-${k}-surface` }, `${m}: text-on-category-${k}`);
  // Helle Schrift in beiden Modi, wie heute (Spec 5c §4).
  for (const sel of ['[data-tl-mode="light"] {', '[data-tl-mode="dark"] {'])
    assert.match(blockVon(sel), new RegExp(`--tl-text-on-category-1: ${P.color['gray-0']};`), sel);
});

test('kandidaten: als Rollen', () => {
  for (const m of MODES) {
    assert.equal(T.color[m]['text-contrast-light'], T.derived.candidates.light, `${m}: text-contrast-light`);
    assert.equal(T.color[m]['text-contrast-dark'], T.derived.candidates.dark, `${m}: text-contrast-dark`);
  }
  assert.equal(T.derived.candidates.light, '{gray-0}');
  assert.equal(T.derived.candidates.dark, '{gray-77}');
});

// --- tl-calendar (Spec 5c §3) -------------------------------------------------------------------------
// Der Block liest nur Tokens; die Kategorie-Regeln schreibt der Generator (Marker in calendar.css).

const KALENDER = (() => { try { return readGenerated('calendar', 'calendar.css'); } catch { return ''; } })();
const kalenderQuelle = () => readComponent('calendar', 'calendar.css');
/** Alle Deklarationen aller Regeln, deren Selektorliste `sel` enthält. */
const kalenderRegel = (sel) => rulesOf(KALENDER)
  .filter(([s]) => s.split(',').map((x) => x.trim()).includes(sel)).map(([, d]) => d).join(';');

test('calendar: Termin gefüllt in der Kategorie', () => {
  for (const k of KATEGORIEN) {
    const d = kalenderRegel(`.tl-calendar__event[data-tl-role="category-${k}"]`);
    assert.match(d, new RegExp(`background:\\s*var\\(--tl-category-${k}-surface\\)`), `Fläche category-${k}`);
    assert.match(d, new RegExp(`color:\\s*var\\(--tl-text-on-category-${k}\\)`), `Schrift category-${k}`);
    const punkt = kalenderRegel(`.tl-calendar__chip-dot[data-tl-role="category-${k}"]`);
    assert.match(punkt, new RegExp(`background:\\s*var\\(--tl-category-${k}-surface\\)`), `Punkt category-${k}`);
  }
  const ohne = declarationsOf(KALENDER, '.tl-calendar__event') ?? '';
  assert.match(ohne, /background:\s*var\(--tl-surface-brand\)/);
  assert.match(ohne, /color:\s*var\(--tl-text-on-brand\)/);
  assert.match(declarationsOf(KALENDER, '.tl-calendar__chip-dot') ?? '', /background:\s*var\(--tl-surface-brand\)/);
  // Die 16 + 8 Regeln stehen nicht von Hand in der Quelle, sondern als Marker.
  assert.doesNotMatch(kalenderQuelle().replace(/\/\*[\s\S]*?\*\//g, ''), /--tl-(category-\d+-surface|text-on-category-\d+)/);
});

test('calendar: ausgewählt ist ein Ring', () => {
  const d = kalenderRegel('.tl-calendar__event[aria-selected="true"]::after');
  for (const r of [/content:\s*""/, /position:\s*absolute/, /inset:\s*0/,
    /border:\s*var\(--tl-border-width-md\) solid var\(--tl-border-interactive\)/, /border-radius:\s*inherit/,
    /pointer-events:\s*none/]) assert.match(d, r);
  assert.doesNotMatch(kalenderQuelle().replace(/\/\*[\s\S]*?\*\//g, ''), /(^|[\s;{])outline\s*:/);
});

test('calendar: heute überall derselbe Kreis', () => {
  for (const sel of ['.tl-calendar__day-head[aria-current="date"] .tl-calendar__day-number',
    '.tl-calendar__day[aria-current="date"] .tl-calendar__day-number',
    '.tl-calendar__mini-day[aria-current="date"]']) {
    const d = kalenderRegel(sel);
    assert.match(d, /background:\s*var\(--tl-surface-brand\)/, sel);
    assert.match(d, /color:\s*var\(--tl-text-on-brand\)/, sel);
    assert.match(d, /border-radius:\s*var\(--tl-radius-full\)/, sel);
  }
});

test('calendar: Flächen', () => {
  assert.match(kalenderRegel('.tl-calendar__column'), /background:\s*var\(--tl-surface-base\)/);
  assert.match(kalenderRegel('.tl-calendar__work'), /background:\s*var\(--tl-surface-layer\)/);
  const jetzt = kalenderRegel('.tl-calendar__now');
  assert.match(jetzt, /var\(--tl-status-error-border\)/);
  assert.match(jetzt, /var\(--tl-border-width-md\)/);
  assert.match(kalenderRegel('.tl-calendar__hour-line'), /var\(--tl-border-separator\)/);
  const mit = (zustand) => rulesOf(KALENDER).filter(([s]) => s.includes(`[data-tl-state~="${zustand}"]`)).map(([, d]) => d).join(';');
  assert.match(mit('nonworking'), /background:\s*var\(--tl-surface-base\)/);
  assert.match(mit('other'), /color:\s*var\(--tl-text-secondary\)/);
});

test('calendar: keine Literale', () => {
  const ohne = kalenderQuelle().replace(/\/\*[\s\S]*?\*\//g, '');
  assert.doesNotMatch(ohne, /#[0-9a-f]{3,6}\b/i);
  assert.doesNotMatch(ohne, /rgba\(/);
  assert.doesNotMatch(ohne, /\d+px/);
  assert.doesNotMatch(ohne, /z-index:\s*\d/);
  assert.doesNotMatch(ohne, /font-size/);
  assert.doesNotMatch(ohne, /data-tl-state~="(drop-|dragging)/);
});
