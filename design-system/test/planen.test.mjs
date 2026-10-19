// Welle 5c (Spec 2026-10-19 Planen und Ziehen §4, §8): gefüllte Kategorien für Termine und die beiden
// Kandidaten der Beschriftung als Rollen. Was derive daraus rechnet, prüft derive.test.mjs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

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
