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
