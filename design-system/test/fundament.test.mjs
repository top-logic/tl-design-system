// Welle 5d (Spec 2026-10-20): Fundament für Tooltip und Ziehen — zwei Ebenen über dem Toast und die inversen
// Rollen, auf denen der Tooltip steht.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from '../tools/resolve.mjs';
import { ratio } from '../tools/lib/contrast.mjs';
import { readComponent, readGenerated, declarationsOf } from './lib/component.mjs';

const P = JSON.parse(readFileSync(new URL('../src/primitives.json', import.meta.url)));
const T = JSON.parse(readFileSync(new URL('../src/tokens.json', import.meta.url)));
const dist = (f) => readFileSync(new URL(`../dist/${f}`, import.meta.url), 'utf8');

/** Wert einer Custom Property aus dist/, var(--x) bis zum Literal verfolgt. */
function ebene(name) {
  const css = dist('primitives.css') + dist('tokens.css');
  let wert = `var(--tl-${name})`;
  for (let i = 0; i < 5; i++) {
    const ref = /^var\(--([a-z0-9-]+)\)$/.exec(wert);
    if (!ref) break;
    const m = new RegExp(`--${ref[1]}:\\s*([^;]+);`).exec(css);
    assert.ok(m, `--${ref[1]} fehlt in dist/`);
    wert = m[1].trim();
  }
  return Number(wert);
}

test('Ebenen: tooltip über toast, drag über tooltip', () => {
  const [toast, tooltip, drag] = ['layer-toast', 'layer-tooltip', 'layer-drag'].map(ebene);
  assert.deepEqual([toast, tooltip, drag], [1200, 1300, 1400]);
});

test('inverse Rollen halten 4,5:1 in beiden Modi', () => {
  const R = resolve(P, T);
  for (const m of ['light', 'dark']) {
    const fg = R.color[m]['text-inverse'], bg = R.color[m]['surface-inverse'];
    assert.ok(fg && bg, `${m}: text-inverse oder surface-inverse fehlt`);
    const ist = ratio(fg, bg);
    assert.ok(ist >= 4.5, `${m}: text-inverse auf surface-inverse = ${ist.toFixed(2)}`);
  }
});

// --- Task 2: Füllen, Anker, Ziehen, Picker, „Aktion beim Zeigen“ (Spec 5d §3, §4, §6; Plan-Review K1, K2, K6, K15) ---

const ohneKommentar = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');
const layout = () => readGenerated('layout', 'layout.css');
const drag = () => readGenerated('drag', 'drag.css');
const decl = (css, sel) => declarationsOf(css, sel) ?? '';

test('Füllen: tl-fill im Paket, die Hülle eines füllenden Kindes füllt mit; kein tlFill mehr', () => {
  const d = decl(layout(), '.tl-fill');
  assert.match(d, /flex:\s*1(;|$)/);
  assert.match(d, /min-height:\s*0/);
  assert.match(decl(layout(), '.tl-item:has(> .tl-fill)'), /flex:\s*1(;|$)/);
  for (const [k, f] of [['layout', 'layout.css'], ['form', 'form.css']])
    assert.doesNotMatch(readComponent(k, f), /tlFill/, `${f} nennt tlFill noch`);
});

// K1: Viewport und Mount bleiben Seitenrahmen der Engine (tlReactBase.css), nicht im Paket.
test('base.css: kein Seitenrahmen der Engine (Viewport, Mount)', () => {
  const base = ohneKommentar(dist('base.css'));
  assert.doesNotMatch(base, /\.is-control|\[data-react-module\]/);
  assert.doesNotMatch(base, /html,\s*body\s*\{/);
  assert.doesNotMatch(decl(base, 'body'), /overflow/);
});

// K2: das Aufblitzen ist ein Hof (focus-width in surface-state-hover-strong), kein Ring aus focus-ring.
test('Anker: Aufblitzen als Zustand, Hof aus focus-width, Dauer duration-loop, Ecke radius-sm', () => {
  const base = dist('base.css');
  const d = decl(base, '[data-tl-anchor][data-tl-state~="flash"]');
  assert.match(d, /animation:\s*tl-anchor-flash var\(--tl-duration-loop\) var\(--tl-easing-[a-z]+\)/);
  assert.match(d, /border-radius:\s*var\(--tl-radius-sm\)/);
  const kf = /@keyframes tl-anchor-flash\s*\{([\s\S]*?)\n\}/.exec(ohneKommentar(base));
  assert.ok(kf, '@keyframes tl-anchor-flash fehlt in base.css');
  assert.match(kf[1], /from\s*\{\s*box-shadow:\s*0 0 0 var\(--tl-focus-width\) var\(--tl-surface-state-hover-strong\);?\s*\}/);
  assert.doesNotMatch(kf[1], /--tl-focus-ring/);
});

test('drag.css: Schild und Zieh-Bild auf layer-drag', () => {
  const s = decl(drag(), '.tl-drag-shield');
  for (const r of [/position:\s*fixed/, /inset:\s*0/, /z-index:\s*var\(--tl-layer-drag\)/, /user-select:\s*none/]) assert.match(s, r);
  const b = decl(drag(), '.tl-drag-image');
  for (const r of [/z-index:\s*var\(--tl-layer-drag\)/, /opacity:\s*0\.9/, /box-shadow:\s*var\(--tl-shadow-drag\)/]) assert.match(b, r);
});

// K15: „bereit“ ist ein eigenes Attribut (data-tl-armed); data-tl-state gehört dem Control.
test('drag.css: bereit nach langem Drücken ist data-tl-armed — Schatten, leicht vergrößert, Übergang duration-fast', () => {
  const a = decl(drag(), '[data-tl-armed]');
  assert.match(a, /box-shadow:\s*var\(--tl-shadow-drag\)/);
  assert.match(a, /transform:\s*scale\(1\.02\)/);
  assert.match(a, /transition:[^;]*var\(--tl-duration-fast\)/);
  assert.doesNotMatch(ohneKommentar(drag()), /drag-armed|data-touch-drag/);
});

test('drag.css: ohne Maus kein Markieren und kein Kontextmenü auf ziehbaren Elementen', () => {
  const m = /@media \(pointer: coarse\)\s*\{\s*\[draggable="true"\]\s*\{([^}]*)\}/.exec(ohneKommentar(drag()));
  assert.ok(m, '@media (pointer: coarse) { [draggable="true"] { … } } fehlt');
  assert.match(m[1], /-webkit-touch-callout:\s*none/);
  assert.match(m[1], /user-select:\s*none/);
});

test('drag.css: der Ablehnungshinweis liegt über dem Zieh-Bild', () => {
  assert.match(decl(drag(), '.tl-popover.tl-drop-hint'), /z-index:\s*var\(--tl-layer-drag\)/);
});

// Spec 5d §4: der Rand deckend in border-interactive, nur die Fläche durchscheinend (auf ::before).
test('drag.css: Picker-Markierung auf layer-drag aus dem Theme, Fadenkreuz als Zustand am body', () => {
  const p = decl(drag(), '.tl-pick-highlight');
  for (const r of [/position:\s*fixed/, /pointer-events:\s*none/, /z-index:\s*var\(--tl-layer-drag\)/,
    /border:\s*var\(--tl-border-width-md\) solid var\(--tl-border-interactive\)/]) assert.match(p, r);
  assert.doesNotMatch(p, /opacity|background/, 'der Rand bleibt deckend, die Fläche liegt auf ::before');
  const f = decl(drag(), '.tl-pick-highlight::before');
  for (const r of [/content:\s*""/, /position:\s*absolute/, /inset:\s*0/, /background:\s*var\(--tl-surface-brand-subtle\)/,
    /opacity:\s*0?\.\d+(;|$)/, /pointer-events:\s*none/]) assert.match(f, r);
  assert.match(decl(drag(), 'body[data-tl-state~="picking"]'), /cursor:\s*crosshair/);
  assert.match(decl(drag(), 'body[data-tl-state~="picking"] *'), /cursor:\s*crosshair/);
});

test('die geänderten Dateien tragen kein z-index-Literal, kein #hex, kein rgba(', () => {
  const dateien = { 'base.css': dist('base.css'), 'layout.css': layout(), 'drag.css': drag(),
    'reorder-list.css': readGenerated('reorder-list', 'reorder-list.css'), 'form.css': readGenerated('form', 'form.css') };
  for (const [f, css] of Object.entries(dateien)) {
    const o = ohneKommentar(css);
    assert.doesNotMatch(o, /z-index:\s*\d/, f);
    assert.doesNotMatch(o, /#[0-9a-fA-F]{3,8}\b/, f);
    assert.doesNotMatch(o, /rgba\(/, f);
  }
});

// K6: „Aktion beim Zeigen“ einmal. Übernimmt, was reorder-list.css für Griff und Knöpfe hatte.
test('tl-reveal-on-hover: verborgen über opacity, sichtbar beim Zeigen, bei Tastaturfokus und ohne Hover', () => {
  const l = layout();
  const d = decl(l, '.tl-reveal-on-hover');
  assert.match(d, /opacity:\s*0(;|$)/);
  assert.match(d, /transition:[^;]*opacity var\(--tl-duration-fast\)[^;]*background-color var\(--tl-duration-fast\)/);
  for (const sel of [
    ':hover > .tl-reveal-on-hover',
    ':has(:focus-visible) > .tl-reveal-on-hover',
    '.tl-table__row:hover .tl-reveal-on-hover',
    '.tl-reveal-on-hover:focus-visible',
  ]) assert.match(decl(l, sel), /opacity:\s*1/, sel);
  const m = /@media \(hover: none\)\s*\{\s*\.tl-reveal-on-hover\s*\{([^}]*)\}/.exec(ohneKommentar(l));
  assert.ok(m, '@media (hover: none) { .tl-reveal-on-hover { … } } fehlt');
  assert.match(m[1], /opacity:\s*1/);
  assert.doesNotMatch(ohneKommentar(l), /visibility:\s*hidden|:focus-within/);
});
