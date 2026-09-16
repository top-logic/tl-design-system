// Prüft den Generator, der aus skala.json das ausliefernde CSS erzeugt.
// Die Tests prüfen nicht, wie das CSS aussieht, sondern dass es die
// Entscheidungen durchsetzt: keine Farbe ohne Token, keine Größe ohne Klasse.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { cssErzeugen } from './generieren.mjs';

const skala = JSON.parse(readFileSync(new URL('./skala.json', import.meta.url)));
const css = cssErzeugen(skala);

test('jede Farbrolle steht in beiden Modi als Custom Property', () => {
  const hell = css.slice(css.indexOf(':root'), css.indexOf('[data-modus="dunkel"]'));
  const dunkel = css.slice(css.indexOf('[data-modus="dunkel"]'));
  for (const name of Object.keys(skala.farbe.hell)) {
    assert.ok(hell.includes(`--${name}:`), `--${name} fehlt im hellen Block`);
    assert.ok(dunkel.includes(`--${name}:`), `--${name} fehlt im dunklen Block`);
  }
});

test('außerhalb der Token-Blöcke steht keine einzige Farbe', () => {
  // Das ist die Leitplanke: Wer eine Farbe braucht, muss ein Token nehmen.
  const regeln = css.slice(css.indexOf('/* Klassen */'));
  const farben = regeln.match(/#[0-9A-Fa-f]{3,8}\b|\brgba?\(|\bhsla?\(/g) ?? [];
  const erlaubt = farben.filter((f) => f.startsWith('rgba')); // nur in den Schattenwerten
  assert.deepEqual(farben.filter((f) => !erlaubt.includes(f)), [],
    'Farbliterale außerhalb der Token-Blöcke gefunden');
});

test('jede Typo-Klasse erzeugt alle fünf Eigenschaften', () => {
  for (const [name, k] of Object.entries(skala.typo)) {
    const block = css.slice(css.indexOf(`.${name} {`));
    const ende = block.indexOf('}');
    const regel = block.slice(0, ende);
    assert.ok(block.startsWith(`.${name} {`), `Klasse ${name} fehlt`);
    for (const eigenschaft of ['font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing'])
      assert.ok(regel.includes(eigenschaft), `${name} setzt kein ${eigenschaft}`);
    assert.ok(regel.includes(`var(--font-size-${k.groesse})`), `${name} greift nicht auf das Größen-Token zu`);
  }
});

test('Zahlen-Spalten schalten tnum und zero ein', () => {
  assert.match(css, /font-feature-settings: *"tnum" 1, *"zero" 1/);
});

test('die Dichte überschreibt nur Maße, nie eine Schriftgröße', () => {
  const block = css.slice(css.indexOf('[data-dichte="kompakt"]'));
  const ende = block.indexOf('}');
  const regel = block.slice(0, ende);
  assert.ok(regel.includes('--control-height:'), 'Kompakt ändert die Control-Höhe nicht');
  assert.ok(!regel.includes('--font-size'), 'Eine Tabelle wird eng durch Luft, nicht durch kleineren Text');
});

test('reduced motion schaltet global ab, mit 0.01ms statt 0', () => {
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  const block = css.slice(css.indexOf('@media (prefers-reduced-motion'));
  assert.match(block, /animation-duration: *0\.01ms *!important/);
  assert.match(block, /transition-duration: *0\.01ms *!important/);
  assert.match(block, /animation-iteration-count: *1 *!important/);
});

test('der Fokus steht genau einmal und nur als :focus-visible', () => {
  assert.equal((css.match(/:focus-visible/g) ?? []).length, 1);
  assert.ok(!/[^-]:focus[^-]/.test(css), 'ein blankes :focus zeigt den Ring auch bei der Maus');
  assert.match(css, /outline: *var\(--focus-width\) *solid *var\(--focus\)/);
});

test('shadow-raised kommt nicht vor', () => {
  assert.ok(!css.includes('shadow-raised'));
});

test('die eingecheckte skala.css ist aktuell erzeugt', () => {
  // Ohne diesen Test driftet die ausgelieferte Datei von ihrer Quelle ab, und
  // die Begründung in docs/skalen.md beschriebe etwas, das so nicht mehr gilt.
  const eingecheckt = readFileSync(new URL('./skala.css', import.meta.url), 'utf8');
  assert.equal(eingecheckt, css, 'skala.css ist veraltet — "node generieren.mjs" ausführen');
});
