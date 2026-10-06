import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readComponent, colorVarsOf, declarationsOf, specimenProblems, missingInContract, varsOf, componentCssFiles } from './lib/component.mjs';
import { declarations } from '../tools/lib/css.mjs';
import { resolve } from '../tools/resolve.mjs';

const T = JSON.parse(readFileSync(new URL('../src/tokens.json', import.meta.url)));
const css = readComponent('choice', 'choice.css');

test('drei Maße der Auswahl sind Tokens der Skala und folgen nicht der Dichte', () => {
  assert.equal(T.measure['size-choice'], '{size-4}');
  assert.equal(T.measure['size-switch'], '{size-7}');
  assert.equal(T.measure['size-switch-knob'], '{size-3}');
  for (const d of Object.values(T.density)) for (const k of ['size-choice', 'size-switch', 'size-switch-knob']) assert.ok(!(k in d), k);
});

test('choice.css liest genau diese Farbrollen', () => {
  assert.deepEqual(colorVarsOf(css), [
    'border-control', 'border-disabled', 'border-emphasis', 'border-interactive', 'icon-secondary',
    'status-error-border', 'status-warning-border', 'surface-brand', 'surface-brand-hover', 'surface-brand-subtle',
    'surface-disabled', 'surface-field', 'surface-interactive-hover', 'surface-state-active', 'surface-state-hover', 'text-disabled', 'text-on-brand', 'text-on-brand-hover', 'text-primary',
  ]);
});

test('Auswahlmarken zeigen einen Hof: Zeigen und Drücken, an der Marke und am Label, nie deaktiviert oder schreibgeschützt', () => {
  const W = ':where(:not(:disabled):not([aria-readonly="true"]))';
  const AUSDEHNUNG = 'calc((var(--tl-size-control) - var(--tl-size-choice)) / 2)';
  const regeln = css.replace(/\/\*[\s\S]*?\*\//g, '');
  for (const [zustand, rolle] of [['hover', 'surface-state-hover'], ['active', 'surface-state-active']]) {
    for (const marke of ['.tl-checkbox', '.tl-radio']) {
      for (const s of [`${marke}${W}:${zustand}`, `:where(.tl-choice:${zustand}) ${marke}${W}`]) {
        // Die Marke trägt unter demselben Selektor auch den Rand beim Zeigen: alle Blöcke lesen.
        const d = declarations(css).filter((x) => x.selector.split(',').map((y) => y.trim()).includes(s))
          .map((x) => `${x.property}: ${x.value}`).join(';');
        assert.ok(d, `Hof fehlt: ${s}`);
        assert.ok(d.includes(`box-shadow: 0 0 0 ${AUSDEHNUNG} var(--tl-${rolle})`), `${s}: Hof nicht aus ${rolle}`);
      }
    }
  }
  // Drücken steht nach Zeigen; das Label liegt in :where, damit Drücken an der Marke das Zeigen am Label schlägt.
  assert.ok(regeln.indexOf('var(--tl-surface-state-hover)') < regeln.indexOf('var(--tl-surface-state-active)'));
  const schatten = declarations(css).filter((d) => d.property === 'box-shadow');
  assert.equal(schatten.length, 2, 'genau zwei Hof-Regeln');
  for (const d of schatten) {
    for (const s of d.selector.split(',').map((x) => x.trim())) {
      assert.ok(s.includes(W), `Hof ohne Wächter: ${s}`);
      assert.doesNotMatch(s, /focus|::after|::before|segment|chip/, `Hof an falscher Stelle: ${s}`);
    }
  }
  // Der Schalter trägt den Hof an der Spur (der Marke selbst), nicht am Knopf: der Hof folgt der Form der Marke.
  assert.doesNotMatch(declarationsOf(css, '.tl-checkbox--switch::after') ?? '', /box-shadow/);
  assert.match(declarationsOf(css, '.tl-checkbox') ?? '', /transition:\s*box-shadow var\(--tl-duration-fast\) var\(--tl-easing-standard\)/);
});

test('der Hof gehört nur den Auswahlmarken: kein anderer Block liest ihn', () => {
  const hits = [];
  for (const [name, text] of componentCssFiles())
    for (const d of declarations(text))
      if (/surface-state-/.test(d.value) && name !== 'choice/choice.css') hits.push(`${name}:${d.line} ${d.selector}`);
  assert.deepEqual(hits, []);
});

test('der Hof reicht über den Fokusring hinaus, in jeder Dichte: der Ring liegt ganz auf dem Hof', () => {
  const P = JSON.parse(readFileSync(new URL('../src/primitives.json', import.meta.url)));
  const R = resolve(P, T);
  const rem = (v) => (v.endsWith('rem') ? parseFloat(v) * 16 : parseFloat(v));
  const choice = rem(R.measure['size-choice']);
  const ring = rem(R.measure['focus-offset']) + rem(R.measure['focus-width']);
  for (const [dichte, d] of Object.entries(R.density)) {
    const hof = (rem(d['size-control']) - choice) / 2;
    assert.ok(hof >= ring, `${dichte}: Hof ${hof} px < Ring ${ring} px`);
  }
});

test('Kästchen und Kreis zeichnen sich selbst, ohne Bild und ohne accent-color', () => {
  assert.match(declarationsOf(css, '.tl-checkbox') ?? '', /appearance:\s*none/);
  assert.doesNotMatch(css, /accent-color|url\(/);
  assert.match(declarationsOf(css, '.tl-checkbox:checked') ?? '', /surface-brand/);
  assert.ok(declarationsOf(css, '.tl-checkbox:indeterminate'), 'gemischter Zustand fehlt');
  assert.ok(declarationsOf(css, '.tl-radio:checked::after'), 'Punkt des Radio fehlt');
});

test('gewählt ist ein Attribut: aria-checked am Segment, aria-pressed am Chip', () => {
  assert.match(declarationsOf(css, '.tl-segmented__segment[aria-checked="true"]') ?? '', /surface-brand-subtle/);
  assert.match(declarationsOf(css, '.tl-segmented__segment[aria-pressed="true"]') ?? '', /surface-brand-subtle/);
  assert.doesNotMatch(css, /__marker|--selected/);
});

test('ein gewählter Chip sieht aus wie ein angekreuztes Kästchen: die Marke als Fläche', () => {
  const d = declarationsOf(css, '.tl-chip[aria-pressed="true"]') ?? '';
  assert.match(d, /background:\s*var\(--tl-surface-brand\)/);
  assert.match(d, /color:\s*var\(--tl-text-on-brand\)/);
  const zeigen = declarationsOf(css, '.tl-chip[aria-pressed="true"]:where(:not(:disabled)):hover') ?? '';
  assert.match(zeigen, /background:\s*var\(--tl-surface-brand-hover\)/);
  assert.match(zeigen, /color:\s*var\(--tl-text-on-brand-hover\)/);
  assert.match(declarationsOf(css, '.tl-chip:disabled[aria-pressed="true"]') ?? '', /background:\s*var\(--tl-border-disabled\)/);
  // Die Prüfzustände der Gruppe treffen nur ungewählte Chips — ein gewählter trägt die Marke.
  const regeln = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const gruppe = [...regeln.matchAll(/\.tl-chip-group\[data-tl-state[^\]]*\] \.tl-chip[^,{]*/g)].map((m) => m[0].trim());
  assert.equal(gruppe.length, 2, 'Warnung und Fehler der Chip-Gruppe');
  for (const g of gruppe) assert.ok(g.includes(':not([aria-pressed="true"])'), `Gruppenregel trifft gewählte Chips: ${g}`);
  // role="group" erlaubt kein aria-invalid: die Chip-Gruppe liest es nicht.
  assert.doesNotMatch(regeln, /\.tl-chip-group\[aria-invalid/);
});

test('schreibgeschützt ist nicht deaktiviert: aria-readonly, Zeiger default, kein Zeigen', () => {
  assert.match(declarationsOf(css, '.tl-checkbox[aria-readonly="true"]') ?? '', /cursor:\s*default/);
  assert.match(declarationsOf(css, '.tl-radio[aria-readonly="true"]') ?? '', /cursor:\s*default/);
  assert.match(declarationsOf(css, '.tl-choice:has([aria-readonly="true"])') ?? '', /cursor:\s*default/);
});

test('Fehler an Gruppen: aria-invalid an radiogroup, data-tl-state an group', () => {
  assert.ok(declarationsOf(css, '.tl-choice-group[aria-invalid="true"] .tl-radio:not(:disabled)'), 'radiogroup-Fehler fehlt');
  assert.ok(declarationsOf(css, '.tl-segmented[aria-invalid="true"]'), 'Segmente als radiogroup');
  assert.ok(declarationsOf(css, '.tl-chip-group[data-tl-state~="error"] .tl-chip:not(:disabled):not([aria-pressed="true"])'), 'Chip-Gruppe (role=group) fehlt');
  // Ohne Kommentare vergleichen; je Block steht die Warnung vor dem Fehler, damit der Fehler gewinnt.
  const regeln = css.replace(/\/\*[\s\S]*?\*\//g, '');
  for (const [b, f] of [['.tl-checkbox', 'aria-invalid="true"'], ['.tl-choice-group', 'aria-invalid="true"'],
    ['.tl-segmented', 'aria-invalid="true"'], ['.tl-chip-group', 'data-tl-state~="error"']]) {
    const warnung = regeln.indexOf(`${b}[data-tl-state~="warning"]`);
    const fehler = regeln.indexOf(`${b}[${f}]`);
    assert.ok(warnung >= 0, `${b}[data-tl-state~="warning"] fehlt`);
    assert.ok(fehler >= 0, `${b}[${f}] fehlt`);
    assert.ok(warnung < fehler, `${b}: Warnung muss vor dem Fehler stehen, damit der Fehler gewinnt`);
  }
});

test('Deaktiviert schlägt Fehler und Warnung, und Deaktiviertes zeigt kein Zeigen', () => {
  for (const s of ['.tl-choice-group[data-tl-state~="warning"] .tl-radio:not(:disabled)',
    '.tl-choice-group[aria-invalid="true"] .tl-radio:not(:disabled)',
    '.tl-chip-group[data-tl-state~="warning"] .tl-chip:not(:disabled):not([aria-pressed="true"])',
    '.tl-chip-group[data-tl-state~="error"] .tl-chip:not(:disabled):not([aria-pressed="true"])'])
    assert.ok(declarationsOf(css, s), `Gruppenregel ohne :not(:disabled): ${s}`);
  // Keine Gruppenregel eines Prüfzustands trifft ein Kind ohne Wächter.
  const regeln = css.replace(/\/\*[\s\S]*?\*\//g, '');
  for (const m of regeln.matchAll(/\.tl-(choice|chip)-group\[(aria-invalid|data-tl-state)[^\]]*\] \.tl-[a-z-]+[^,{]*/g))
    assert.match(m[0].trim(), /:not\(:disabled\)(:not\(\[aria-pressed="true"\]\))?$/, `Gruppenregel ohne :not(:disabled): ${m[0].trim()}`);
  for (const s of ['.tl-checkbox:where(:not(:disabled):not([aria-readonly="true"])):hover', '.tl-radio:where(:not(:disabled):not([aria-readonly="true"])):hover',
    '.tl-segmented__segment:where(:not(:disabled)):hover', '.tl-chip:where(:not(:disabled)):hover'])
    assert.ok(declarationsOf(css, s), `Zeigen ohne Wächter: ${s}`);
  assert.doesNotMatch(regeln, /(checkbox|radio|segment|chip):hover/, 'ungeschütztes :hover');
});

test('Segment- und Chip-Label enden mit Ellipse, in einem eigenen Element', () => {
  for (const s of ['.tl-segmented__label', '.tl-chip__label']) {
    const d = declarationsOf(css, s) ?? '';
    assert.match(d, /overflow:\s*hidden/, s);
    assert.match(d, /text-overflow:\s*ellipsis/, s);
    assert.match(d, /white-space:\s*nowrap/, s);
  }
  assert.match(declarationsOf(css, '.tl-chip') ?? '', /min-width:\s*0/);
  assert.match(declarationsOf(css, '.tl-segmented__segment') ?? '', /min-width:\s*0/);
});

test('die Trefferfläche ist eine Control-Höhe und folgt der Dichte', () => {
  assert.match(declarationsOf(css, '.tl-choice') ?? '', /min-height:\s*var\(--tl-size-control\)/);
});

test('das Auswahl-Specimen zeigt jede Form in jedem Zustand', () => {
  const html = readComponent('choice', 'choice.spec.html');
  assert.deepEqual(specimenProblems(html), []);
  for (const s of ['tl-checkbox', 'tl-checkbox--switch', 'role="switch"', 'tl-radio', 'role="radiogroup"', 'checked',
    'indeterminate', 'aria-invalid="true"', 'data-tl-state="warning"', 'disabled', 'tl-segmented', 'aria-checked="true"',
    'tl-chip', 'aria-pressed="true"', 'data-tl-state="error"'])
    assert.ok(html.includes(s), `Specimen zeigt ${s} nicht`);
});

test('der Auswahl-Vertrag nennt jedes Token, jede Klasse und jedes Attribut', () => {
  const md = readComponent('choice', 'choice.contract.md');
  const names = [...varsOf(css), 'tl-checkbox', 'tl-checkbox--switch', 'tl-radio', 'tl-choice', 'tl-choice-group',
    'tl-segmented', 'tl-segmented__label', 'tl-chip', 'tl-chip__label', 'aria-checked', 'aria-pressed', 'aria-invalid', 'data-tl-state', 'role="switch"', 'role="radiogroup"'];
  assert.deepEqual(missingInContract(md, names), []);
});
