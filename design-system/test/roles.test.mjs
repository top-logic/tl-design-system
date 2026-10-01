// Rollenfarben einmal erzeugt, nicht zweimal geschrieben — docs/skalen.md „Gleiches wird zusammengelegt“.
// Pill, Avatar und Alert lesen je Rolle dieselben zwei Tokens. Der Generator schreibt diese Regeln aus
// src/tokens.json an die Stelle eines Marker-Kommentars; die Quelle nennt nur, welche Rollen ein Block hat.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { generate, componentSources, expandRoles } from '../tools/generate.mjs';
import { componentCssFiles, rulesOf } from './lib/component.mjs';

const P = JSON.parse(readFileSync(new URL('../src/primitives.json', import.meta.url)));
const T = JSON.parse(readFileSync(new URL('../src/tokens.json', import.meta.url)));
const OUT = generate(P, T, componentSources(new URL('../src/components/', import.meta.url)))['components.css'];
const KATEGORIEN = Object.keys(T.color.light).filter((n) => /^category-\d+-subtle$/.test(n)).map((n) => n.replace(/-subtle$/, ''));
const STATUS = ['error', 'warning', 'success', 'info'];

const regel = (sel) => rulesOf(OUT).filter(([s]) => s === sel).map(([, d]) => d.trim().replace(/\s+/g, ' '));

test('tokens.json trägt acht Kategorien, je mit subtle und border', () => {
  assert.equal(KATEGORIEN.length, 8);
  for (const k of KATEGORIEN) assert.ok(T.color.light[`${k}-border`] && T.color.dark[`${k}-border`], k);
});

for (const block of ['tl-pill', 'tl-avatar']) {
  test(`components.css: .${block} hat je Kategorie genau eine Regel aus Fläche und Linie`, () => {
    for (const k of KATEGORIEN)
      assert.deepEqual(regel(`.${block}--${k}`), [`background: var(--tl-${k}-subtle); border-color: var(--tl-${k}-border);`], k);
  });
}

for (const block of ['tl-pill', 'tl-alert']) {
  test(`components.css: .${block} hat je Bedeutung genau eine Regel aus Fläche und Linie`, () => {
    for (const s of STATUS)
      assert.deepEqual(regel(`.${block}--${s}`), [`background: var(--tl-status-${s}-subtle); border-color: var(--tl-status-${s}-border);`], s);
  });
}

test('keine Komponentendatei schreibt eine Rollenregel aus, die der Generator erzeugt', () => {
  const offen = [];
  for (const [name, css] of componentCssFiles()) {
    const ohne = css.replace(/\/\*[\s\S]*?\*\//g, '');
    ohne.split('\n').forEach((l, i) => {
      if (/--tl-category-\d+-(subtle|border)\b/.test(l)) offen.push(`${name}:${i + 1} Kategorie`);
      if (/^\s*background\s*:\s*var\(--tl-status-[a-z]+-subtle\)/.test(l)) offen.push(`${name}:${i + 1} Status`);
    });
  }
  assert.deepEqual(offen, []);
});

test('der Marker wird ersetzt, ein unbekannter Marker bricht den Build', () => {
  const css = expandRoles('.tl-x { }\n/* @tl-roles: status .tl-x */\n', T);
  assert.ok(!css.includes('@tl-roles'), 'Marker steht noch im Generat');
  assert.ok(css.includes('.tl-x--info { background: var(--tl-status-info-subtle); border-color: var(--tl-status-info-border); }'));
  assert.throws(() => expandRoles('/* @tl-roles: farbe .tl-x */', T), /farbe/);
  assert.ok(!OUT.includes('@tl-roles'), 'Marker im dist-Generat');
});
