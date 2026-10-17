// Welle 4c (Spec 2026-10-16): Behälter aus dem Paket. Jede Regel hier steht in der Spec; die Verträge prüft
// contracts-4c.test.mjs, Kopfhöhe und Nachgeben titlebar-height.test.mjs im Browser.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readGenerated, declarationsOf } from './lib/component.mjs';

const T = JSON.parse(readFileSync(new URL('../src/tokens.json', import.meta.url)));
const decl = (dir, sel, file = `${dir}.css`) => declarationsOf(readGenerated(dir, file), sel) ?? '';
const ohneKommentar = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');

test('size-wizard-progress ist eine eigene Rolle: 24 rem', () => {
  assert.equal(T.measure['size-wizard-progress'], '{size-13}');
});

test('tl-titlebar: eine Toolbar im Kopf bringt keine eigene Leistenhöhe mit', () => {
  const t = decl('titlebar', '.tl-titlebar__actions > .tl-toolbar');
  assert.match(t, /min-height:\s*0/);
  assert.match(t, /padding-block:\s*0/);
  // Die Linie unten zählt zur Höhe (border-box): unten space-2xs abzüglich der Linie, sonst misst ein Kopf mit
  // Toolbar-Knopf size-bar + 1 px (Plan-Review, Befund 2).
  assert.match(decl('titlebar', '.tl-titlebar'),
    /padding-bottom:\s*calc\(var\(--tl-space-2xs\) - var\(--tl-border-width-sm\)\)/);
});

test('tl-titlebar: Inhalt neben dem Titel, Kopfknöpfe in einer Hülle, ohne Titel alles am Ende', () => {
  assert.match(decl('titlebar', '.tl-titlebar__content'), /flex:\s*1 1 auto/);
  assert.match(decl('titlebar', '.tl-titlebar__title:has(+ .tl-titlebar__content)'), /flex:\s*0 1 auto/);
  const b = decl('titlebar', '.tl-titlebar__buttons');
  assert.match(b, /flex:\s*none/);
  assert.match(b, /gap:\s*var\(--tl-space-xs\)/);
  // Die Selektorliste in :not(…) enthält ein Komma; declarationsOf trennt daran, darum per Regex über die Datei.
  assert.match(ohneKommentar(readGenerated('titlebar', 'titlebar.css')),
    /\.tl-titlebar > :first-child:not\(\.tl-titlebar__title, \.tl-titlebar__content\)\s*\{[^}]*margin-inline-start:\s*auto/);
});

test('tl-titlebar: eine überlaufende Toolbar gibt vor dem Titel nach, ohne 100000', () => {
  const a = decl('titlebar', '.tl-titlebar__actions:has(> .tl-toolbar[data-tl-overflow])');
  assert.match(a, /flex:\s*1 1 0/);
  assert.match(a, /min-width:\s*var\(--tl-size-control\)/);
  assert.match(decl('titlebar', '.tl-titlebar:has(> .tl-titlebar__actions > .tl-toolbar[data-tl-overflow]) > .tl-titlebar__title'),
    /flex:\s*0 1 auto/);
  assert.doesNotMatch(ohneKommentar(readGenerated('titlebar', 'titlebar.css')), /100000/);
});

test('tl-button-bar: rechtsbündig, Linie oben, verschwindet ohne Knopf — Fuß des Dialogs und des Panels', () => {
  const b = decl('button-bar', '.tl-button-bar');
  assert.match(b, /justify-content:\s*end/);
  assert.match(b, /gap:\s*var\(--tl-space-xs\)/);
  assert.match(b, /padding:\s*var\(--tl-space-sm\) var\(--tl-space-md\)/);
  assert.match(b, /border-top:\s*var\(--tl-border-width-sm\) solid var\(--tl-border-separator\)/);
  assert.match(decl('button-bar', '.tl-button-bar:not(:has(button))'), /display:\s*none/);
  assert.doesNotMatch(ohneKommentar(readGenerated('dialog', 'dialog.css')), /tl-dialog__footer/);
});

test('tl-panel: Spalte; maximiert über dem Behälter auf layer-raised, Grund surface-base; minimiert ist der Kopf ein Ziel', () => {
  assert.match(decl('panel', '.tl-panel'), /flex-direction:\s*column/);
  const m = decl('panel', '.tl-panel[data-tl-state~="maximized"]');
  assert.match(m, /position:\s*absolute/);
  assert.match(m, /inset:\s*0/);
  assert.match(m, /z-index:\s*var\(--tl-layer-raised\)/);
  assert.match(m, /background:\s*var\(--tl-surface-base\)/);
  assert.match(decl('panel', '.tl-panel[data-tl-state~="minimized"] > .tl-titlebar'), /cursor:\s*pointer/);
  const b = decl('panel', '.tl-panel__body');
  assert.match(b, /overflow:\s*auto/);
  assert.match(b, /flex:\s*1/);
  assert.match(decl('panel', '.tl-panel__body > *'), /flex-shrink:\s*0/);
  assert.match(decl('panel', '.tl-panel--full-line'), /grid-column:\s*1 \/ -1/);
});

test('tl-panel--hover-actions: Aktionen und Knöpfe beim Zeigen und bei Tastaturfokus, auf Touch immer', () => {
  const css = ohneKommentar(readGenerated('panel', 'panel.css'));
  assert.match(css, /\.tl-panel--hover-actions > \.tl-titlebar > :is\(\.tl-titlebar__actions, \.tl-titlebar__buttons\)\s*\{[^}]*opacity:\s*0/);
  assert.match(css, /transition:\s*opacity var\(--tl-duration-base\) var\(--tl-easing-standard\)/);
  assert.match(css, /:has\(:focus-visible\)/);
  assert.match(css, /@media \(hover: none\)/);
  assert.doesNotMatch(css, /focus-within/);
});

test('tl-card: Linie, Radius, beschnitten; die Fläche folgt der Verschachtelung (Weg B), kein Schatten', () => {
  const c = decl('card', '.tl-card');
  assert.match(c, /background:\s*var\(--tl-surface-layer\)/);
  assert.match(c, /border:\s*var\(--tl-border-width-sm\) solid var\(--tl-border-separator\)/);
  assert.match(c, /border-radius:\s*var\(--tl-radius-md\)/);
  assert.match(c, /overflow:\s*clip/);
  assert.match(decl('card', '.tl-card--nested'), /background:\s*var\(--tl-surface-layer-nested\)/);
  assert.match(decl('card', '.tl-card--overlay'), /background:\s*var\(--tl-surface-overlay\)/);
  assert.match(decl('card', '.tl-card__body--pad-default'), /padding:\s*var\(--tl-space-md\)/);
  assert.match(decl('card', '.tl-card__body--pad-compact'), /padding:\s*var\(--tl-space-xs\)/);
  assert.doesNotMatch(ohneKommentar(readGenerated('card', 'card.css')), /box-shadow|--elevated/);
});

test('tl-accordion: die Fläche ist tl-card; nur Linien, Kopf auf size-bar, Körper space-md, Ring innen', () => {
  const css = ohneKommentar(readGenerated('accordion', 'accordion.css'));
  assert.doesNotMatch(css, /\.tl-accordion\s*\{/); // keine eigene Fläche
  assert.doesNotMatch(css, /--expanded|border-top-left-radius/);
  assert.match(decl('accordion', '.tl-accordion__header'), /min-height:\s*var\(--tl-size-bar\)/);
  assert.match(decl('accordion', '.tl-accordion__panel'), /padding:\s*var\(--tl-space-md\)/);
  assert.match(decl('accordion', '.tl-accordion__trigger:focus-visible'), /outline-offset:\s*calc\(-1 \* var\(--tl-focus-offset\)\)/);
  assert.match(decl('accordion', '.tl-accordion__trigger[aria-expanded="true"] > .tl-accordion__chevron'), /rotate:\s*90deg/);
});
