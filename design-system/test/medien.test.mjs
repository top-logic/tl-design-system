// Welle 5b (Spec 2026-10-19 §4, §5): Anzeige aus dem Paket — tl-media, surface-document, tl-prose, Overlay mit
// fill und action. Jede Regel hier steht in der Spec; die Verträge prüft contracts-5b.test.mjs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readGenerated, declarationsOf, rulesOf } from './lib/component.mjs';

const T = JSON.parse(readFileSync(new URL('../src/tokens.json', import.meta.url)));
const BASE = readFileSync(new URL('../dist/base.css', import.meta.url), 'utf8');
const decl = (dir, sel, file = `${dir}.css`) => declarationsOf(readGenerated(dir, file), sel) ?? '';
const ohneKommentar = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');
/** Alle Deklarationen der Regeln, deren Selektorliste sel nennt — ein Element kann in mehreren Regeln stehen. */
const alle = (dir, sel) => rulesOf(readGenerated(dir, `${dir}.css`))
  .filter(([s]) => s.split(',').map((x) => x.trim()).includes(sel)).map(([, d]) => d).join('');

test('surface-document: weiß in beiden Modi', () => {
  assert.equal(T.color.light['surface-document'], '{gray-0}');
  assert.equal(T.color.dark['surface-document'], '{gray-0}');
});

test('media: Rahmen füllt, Ecke radius-sm, Einpassung als Variante', () => {
  assert.match(decl('media', '.tl-media__frame'), /var\(--tl-radius-sm\)/);
  assert.match(decl('media', '.tl-media--cover .tl-media__frame'), /object-fit:\s*cover/);
  assert.match(decl('media', '.tl-media--contain .tl-media__frame'), /object-fit:\s*contain/);
  assert.match(decl('media', '.tl-media--document .tl-media__frame'), /var\(--tl-surface-document\)/);
  assert.match(decl('media', '.tl-media__frame[data-tl-state~="mirrored"]'), /transform:\s*scaleX\(-1\)/);
  assert.doesNotMatch(ohneKommentar(readGenerated('media', 'media.css')), /\d+px|#[0-9a-f]{3,6}\b/i);
});

/** Die Selektorliste der Regel, die mit `.tl-type-<n> {` endet. */
function typoRegel(n) {
  const ohne = ohneKommentar(BASE);
  const m = [...ohne.matchAll(/([^{}]+)\{[^}]*\}/g)].find((r) => r[1].split(',').map((s) => s.trim()).includes(`.tl-type-${n}`));
  assert.ok(m, `.tl-type-${n} fehlt in base.css`);
  return m[1].split(',').map((s) => s.trim());
}

test('prose: Schrift nur aus den Typo-Klassen', () => {
  const soll = {
    'heading-lg': ['h1'], 'heading-md': ['h2'], 'heading-sm': ['h3', 'h4', 'h5', 'h6'],
    body: ['p', 'li'], 'body-strong': ['th'], code: ['code', 'pre'],
  };
  for (const [n, els] of Object.entries(soll)) {
    const sel = typoRegel(n);
    for (const el of els) assert.ok(sel.includes(`.tl-prose ${el}`), `.tl-prose ${el} fehlt an .tl-type-${n}`);
  }
  // Der Tabellenkopf ist fett: th steht an body-strong, nicht an body.
  assert.ok(!typoRegel('body').includes('.tl-prose th'), '.tl-prose th steht noch an .tl-type-body');
  const prose = ohneKommentar(readGenerated('prose', 'prose.css'));
  assert.doesNotMatch(prose, /font-size|font-weight|line-height/);
  assert.match(alle('prose', '.tl-prose a'), /var\(--tl-text-link\)/);
  assert.match(alle('prose', '.tl-prose a:hover'), /var\(--tl-text-link-hover\)/);
  assert.match(alle('prose', '.tl-prose td'), /var\(--tl-border-separator\)/);
  assert.match(alle('prose', '.tl-prose blockquote'), /var\(--tl-border-separator\)/);
});

test('overlay: fill, base, action', () => {
  const fill = decl('overlay', '.tl-overlay--fill');
  assert.match(fill, /display:\s*(flex|block)/);
  assert.match(fill, /inline-size:\s*100%/);
  assert.match(fill, /block-size:\s*100%/);
  const action = decl('overlay', '.tl-overlay__action');
  for (const t of ['surface-overlay', 'radius-md', 'shadow-popover', 'space-2xs'])
    assert.match(action, new RegExp(`var\\(--tl-${t}\\)`), t);
  // Die Basis gibt ihrem Kind die volle Höhe: sonst bliebe ein iframe darin 150 px hoch.
  assert.match(decl('overlay', '.tl-overlay--fill > .tl-overlay__base'), /flex-direction:\s*column/);
  assert.match(decl('overlay', '.tl-overlay--fill > .tl-overlay__base > *'), /flex:\s*1 1 auto/);
});

test('button: gedrückt in danger ist gefüllt rot', () => {
  const css = ohneKommentar(readGenerated('button', 'button.css'));
  const rollen = {
    '.tl-button--danger[aria-pressed="true"]': '',
    '.tl-button--danger[aria-pressed="true"]:hover': '-hover',
    '.tl-button--danger[aria-pressed="true"]:active': '-active',
  };
  for (const [sel, stufe] of Object.entries(rollen)) {
    const d = decl('button', sel);
    assert.match(d, new RegExp(`background:\\s*var\\(--tl-status-error-surface${stufe}\\)`), sel);
    assert.match(d, new RegExp(`border-color:\\s*var\\(--tl-status-error-surface${stufe}\\)`), sel);
    assert.match(d, new RegExp(`color:\\s*var\\(--tl-text-on-status-error${stufe}\\)`), sel);
  }
  // Nach dem gedrückten Zustand (sonst gewänne die Marke), vor Deaktiviert (sonst schlüge Rot den disabled-Zustand).
  const nach = css.indexOf('.tl-button[aria-pressed="true"]:hover');
  const regel = css.indexOf('.tl-button--danger[aria-pressed="true"]');
  const vor = css.indexOf('.tl-button:disabled');
  assert.ok(nach >= 0 && regel > nach && regel < vor, 'Reihenfolge in button.css');
});

test('file: Name mit Ellipse, leer in text-secondary, nicht kursiv', () => {
  const name = decl('file', '.tl-file__name');
  assert.match(name, /text-overflow:\s*ellipsis/);
  assert.match(name, /overflow:\s*hidden/);
  assert.match(name, /white-space:\s*nowrap/);
  assert.match(name, /max-inline-size:\s*var\(--tl-size-13\)/);
  assert.match(decl('file', '.tl-file[data-tl-state~="empty"]'), /var\(--tl-text-secondary\)/);
  assert.doesNotMatch(ohneKommentar(readGenerated('file', 'file.css')), /font-style/);
});

test('upload: Ziehen an Drop-Zone und Chip-Gruppe gleich', () => {
  const regel = rulesOf(readGenerated('form', 'upload.css')).find(([s]) => {
    const l = s.split(',').map((x) => x.trim());
    return l.includes('.tl-file-upload[data-tl-state~="dragover"]') && l.includes('.tl-chip-group[data-tl-state~="dragover"]');
  });
  assert.ok(regel, 'eine Regel mit beiden Selektoren fehlt');
  assert.match(regel[1], /dashed var\(--tl-border-interactive\)/);
});
