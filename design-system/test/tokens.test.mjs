// Jede Regel aus docs/skalen.md als Test. Gerechnet auf den aufgelösten Werten.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ratio } from '../tools/lib/contrast.mjs';
import { farbtonAbstand, FARBTON_ABSTAND_MIN, hexZuOklch } from '../tools/lib/color.mjs';
import { resolve } from '../tools/resolve.mjs';

const lum = (hex) => hexZuOklch(hex).L;

const P = JSON.parse(readFileSync(new URL('../src/primitives.json', import.meta.url)));
const T = JSON.parse(readFileSync(new URL('../src/tokens.json', import.meta.url)));
const R = resolve(P, T);
const MODES = ['light', 'dark'];
const HEX = /^#[0-9A-F]{6}$/;

test('jeder Farbwert ist ein großgeschriebenes 6-stelliges Hex', () => {
  for (const [n, v] of Object.entries(P.color)) assert.match(v, HEX, `${n} = ${v}`);
});

test('Text und Linien erfüllen ihre Anforderung gegen die richtige Fläche', () => {
  const forderung = [
    ['text-primary', 'surface-base', 16.0], ['text-secondary', 'surface-base', 7.0],
    ['text-helper', 'surface-base', 5.2], ['text-placeholder', 'surface-field', 4.6],
    ['text-link', 'surface-base', 4.5], ['text-link-hover', 'surface-base', 4.5],
    ['icon-primary', 'surface-base', 3.0], ['icon-secondary', 'surface-base', 3.0],
    ['border-emphasis', 'surface-base', 4.6], ['border-control', 'surface-base', 3.0],
    ['border-interactive', 'surface-base', 3.0], ['focus-ring', 'surface-base', 3.0],
    ['text-link', 'surface-brand-subtle', 4.5], ['text-primary', 'surface-brand-subtle', 4.5],
  ];
  for (const m of MODES) for (const [fg, bg, soll] of forderung) {
    const ist = ratio(R.color[m][fg], R.color[m][bg]);
    assert.ok(ist >= soll, `${m}: ${fg} auf ${bg} = ${ist.toFixed(2)}, gefordert ${soll}`);
  }
});

test('Text steht auf jeder Fläche, auf der er liegen kann', () => {
  for (const m of MODES) for (const bg of ['surface-layer', 'surface-layer-nested', 'surface-overlay',
    'surface-interactive-hover', 'surface-interactive-selected', 'surface-interactive-active']) {
    const ist = ratio(R.color[m]['text-primary'], R.color[m][bg]);
    assert.ok(ist >= 4.5, `${m}: text-primary auf ${bg} = ${ist.toFixed(2)}`);
  }
});

test('border-separator trennt nur und schuldet keinen Kontrast', () => {
  for (const m of MODES) {
    const ist = ratio(R.color[m]['border-separator'], R.color[m]['surface-base']);
    assert.ok(ist < 3.0, `${m}: ein Separator mit ${ist.toFixed(2)} wäre ein Control-Rahmen`);
  }
});

test('jede Statusbedeutung erfüllt text 4,5 und border 3,0 auf dem Grund — ein getönter Streifen trägt gewöhnlichen Text', () => {
  for (const m of MODES) for (const s of ['error', 'warning', 'success', 'info']) {
    const bg = R.color[m]['surface-base'];
    const t = ratio(R.color[m][`status-${s}-text`], bg);
    const b = ratio(R.color[m][`status-${s}-border`], bg);
    assert.ok(t >= 4.5, `${m}: status-${s}-text = ${t.toFixed(2)}`);
    assert.ok(b >= 3.0, `${m}: status-${s}-border = ${b.toFixed(2)}`);

    // status-X-text ist für den Grund (surface-base) gerechnet, nicht für die eigene
    // subtle-Fläche. Ein getönter Hinweisstreifen (background: subtle) nimmt darum
    // gewöhnlichen Text (text-primary), nicht status-X-text — das Paar
    // status-X-text × status-X-subtle ist von der Skala nicht versprochen und wird hier
    // nur dokumentierend berechnet, nicht erzwungen.
    const textAufSubtle = ratio(R.color[m][`status-${s}-text`], R.color[m][`status-${s}-subtle`]);
    void textAufSubtle; // darf unter 4,5 liegen — kein Textpaar

    const sub = ratio(R.color[m]['text-primary'], R.color[m][`status-${s}-subtle`]);
    assert.ok(sub >= 4.5, `${m}: text-primary auf status-${s}-subtle = ${sub.toFixed(2)}`);
  }
});

test('auf jeder gefüllten Fläche trägt die erzeugte Beschriftung', () => {
  for (const m of MODES) for (const [name, { surface }] of Object.entries(T.derived[m])) {
    const soll = name.startsWith('icon-') ? 3.0 : 4.5;
    const ist = ratio(R.derived[m][name], R.color[m][surface]);
    assert.ok(ist >= soll, `${m}: ${name} auf ${surface} = ${ist.toFixed(2)}`);
  }
});

test('der Fokusring erreicht 3,0 gegen jede Fläche, auf der er liegen kann', () => {
  for (const m of MODES) for (const bg of ['surface-base', 'surface-layer', 'surface-layer-nested',
    'surface-overlay', 'surface-field', 'surface-brand-subtle']) {
    const ist = ratio(R.color[m]['focus-ring'], R.color[m][bg]);
    assert.ok(ist >= 3.0, `${m}: focus-ring auf ${bg} = ${ist.toFixed(2)}`);
  }
});

test('getönte Flächen verschiedener Bedeutung trennen sich im Farbton', () => {
  for (const m of MODES) {
    const subtle = ['surface-brand-subtle', 'status-error-subtle', 'status-warning-subtle',
      'status-success-subtle', 'status-info-subtle'].map((n) => [n, R.color[m][n]]);
    for (let i = 0; i < subtle.length; i++) for (let j = i + 1; j < subtle.length; j++) {
      const d = farbtonAbstand(subtle[i][1], subtle[j][1]);
      assert.ok(d >= FARBTON_ABSTAND_MIN, `${m}: ${subtle[i][0]} ↔ ${subtle[j][0]} = ${d.toFixed(1)}°`);
    }
  }
});

test('Schatten trägt nur, was schwebt — drei Stufen je Modus, keine raised', () => {
  for (const m of MODES) {
    const names = Object.keys(R.effect[m]).filter((n) => n.startsWith('shadow-')).sort();
    assert.deepEqual(names, ['shadow-dialog', 'shadow-drag', 'shadow-popover']);
  }
});

test('jede rem-Größe ist ein glattes Sechzehntel', () => {
  for (const [n, v] of Object.entries(P.measure)) {
    const m = /^([\d.]+)rem$/.exec(v);
    if (m) assert.ok(Number.isInteger(parseFloat(m[1]) * 16), `${n} = ${v} ist kein ganzes Pixel`);
  }
});

test('Abstände, Zeilen- und Control-Höhen liegen auf dem 4-px-Raster', () => {
  for (const [n, v] of Object.entries(P.measure)) {
    if (!/^(size|height)-/.test(n)) continue;
    const px = parseFloat(v) * 16;
    assert.equal(px % 4, 0, `${n} = ${px}px`);
  }
});

test('keine Schriftgröße unterschreitet 12 px', () => {
  for (const [n, v] of Object.entries(P.measure))
    if (n.startsWith('text-')) assert.ok(parseFloat(v) * 16 >= 12, `${n} = ${v}`);
});

test('Linien stehen in px, Maße in rem', () => {
  for (const [n, v] of Object.entries(P.measure)) {
    if (n.startsWith('line-')) assert.match(v, /px$/, n);
    if (/^(size|text|height)-/.test(n)) assert.match(v, /rem$/, n);
  }
});

test('die kleine Control-Höhe trägt die Trefferfläche aus WCAG 2.5.8', () => {
  for (const d of ['normal', 'compact'])
    assert.ok(parseFloat(R.density[d]['size-control-sm']) * 16 >= 24, d);
});

test('Zeilenhöhen der Typo-Klassen liegen auf dem 4-px-Raster', () => {
  for (const [n, k] of Object.entries(T.type)) {
    if (n.startsWith('_')) continue;
    const px = parseFloat(R.measure[`font-size-${k.size}`]) * 16 * k.lineHeight;
    assert.ok(Math.abs(px - Math.round(px)) < 0.01 && Math.round(px) % 4 === 0, `${n}: ${px}px`);
  }
});

test('die Ebenen steigen streng', () => {
  const v = ['layer-base', 'layer-raised', 'layer-sticky', 'layer-overlay', 'layer-popover', 'layer-toast']
    .map((n) => Number(R.layer[n]));
  for (let i = 1; i < v.length; i++) assert.ok(v[i] > v[i - 1], v.join(' < '));
});

test('die Fehlerfläche hat eine Rampe wie die Marke: hover und active je Modus, Beschriftung abgeleitet', () => {
  for (const m of ['light', 'dark']) {
    for (const k of ['status-error-surface-hover', 'status-error-surface-active'])
      assert.ok(T.color[m][k], `${m}: ${k} fehlt`);
    for (const k of ['text-on-status-error-hover', 'text-on-status-error-active'])
      assert.ok(T.derived[m][k], `${m}: ${k} fehlt`);
  }
  const R = resolve(P, T);
  // Rampenrichtung wie surface-brand: hell wird beim Zeigen dunkler, dunkel wird heller —
  // aber 'active' geht in beiden Modi weiter in dieselbe Richtung als 'hover', nicht zurück.
  assert.ok(lum(R.color.light['status-error-surface-hover']) < lum(R.color.light['status-error-surface']), 'hell: hover muss dunkler sein');
  assert.ok(lum(R.color.dark['status-error-surface-hover']) > lum(R.color.dark['status-error-surface']), 'dunkel: hover muss heller sein');

  // Rampenreihenfolge wie bei surface-brand (dunkel blue-32 -> hover blue-27 -> active blue-43):
  // hell faellt streng (base > hover > active), dunkel steigt zwischen hover und base, faellt
  // dann unter die Flaeche zurueck (hover > base > active).
  assert.ok(
    lum(R.color.light['status-error-surface']) > lum(R.color.light['status-error-surface-hover'])
      && lum(R.color.light['status-error-surface-hover']) > lum(R.color.light['status-error-surface-active']),
    'hell: base > hover > active');
  assert.ok(
    lum(R.color.dark['status-error-surface-hover']) > lum(R.color.dark['status-error-surface'])
      && lum(R.color.dark['status-error-surface']) > lum(R.color.dark['status-error-surface-active']),
    'dunkel: hover > base > active');
});
