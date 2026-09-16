// Prüft die entschiedene Skala (skala.json) gegen die Entscheidungen aus
// docs/skalen.md. Anders als tokens.json, das den Ist-Zustand hält, ist
// skala.json der Soll-Zustand — und dieser Test ist sein Gate.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ratio } from './contrast.mjs';

const skala = JSON.parse(readFileSync(new URL('./skala.json', import.meta.url)));
const HEX = /^#[0-9A-F]{6}$/;
const MODI = ['hell', 'dunkel'];

test('beide Modi belegen dieselben Farbrollen vollständig', () => {
  const hell = Object.keys(skala.farbe.hell).sort();
  const dunkel = Object.keys(skala.farbe.dunkel).sort();
  assert.deepEqual(dunkel, hell, 'Dark erbt nichts — jede Rolle muss in beiden Modi stehen');
});

test('jeder Farbwert ist ein großgeschriebenes 6-stelliges Hex', () => {
  for (const modus of MODI)
    for (const [name, wert] of Object.entries(skala.farbe[modus]))
      assert.match(wert, HEX, `${modus}.${name} = ${wert}`);
});

test('Text und Linien erfüllen ihre Anforderung gegen die richtige Fläche', () => {
  // Jede Stufe ist der hellste Wert, der ihre Anforderung noch erfüllt.
  const forderung = [
    ['text-primary', 'background', 16.0],
    ['text-secondary', 'background', 7.0],
    ['text-helper', 'background', 5.2],
    ['text-placeholder', 'field', 4.6],
    ['border-emphasis', 'background', 4.6],
    ['border-control', 'background', 3.0],
  ];
  for (const modus of MODI)
    for (const [token, grund, soll] of forderung) {
      const ist = ratio(skala.farbe[modus][token], skala.farbe[modus][grund]);
      assert.ok(ist >= soll, `${modus}: ${token} auf ${grund} = ${ist.toFixed(2)}, gefordert ${soll}`);
    }
});

test('border-separator trennt nur und schuldet keinen Kontrast', () => {
  for (const modus of MODI) {
    const ist = ratio(skala.farbe[modus]['border-separator'], skala.farbe[modus].background);
    assert.ok(ist < 3.0, `${modus}: ein Separator mit ${ist.toFixed(2)} wäre ein Control-Rahmen`);
  }
});

test('jede Semantik-Bedeutung erfüllt text 4,5 und border 3,0', () => {
  for (const modus of MODI)
    for (const bedeutung of ['error', 'warning', 'success', 'info']) {
      const grund = skala.farbe[modus].background;
      const text = ratio(skala.farbe[modus][`support-${bedeutung}-text`], grund);
      const rand = ratio(skala.farbe[modus][`support-${bedeutung}-border`], grund);
      assert.ok(text >= 4.5, `${modus}: ${bedeutung}-text = ${text.toFixed(2)}`);
      assert.ok(rand >= 3.0, `${modus}: ${bedeutung}-border = ${rand.toFixed(2)}`);
    }
});

test('auf jeder gefüllten Fläche trägt eine der beiden Beschriftungen', () => {
  // Die Beschriftung wird abgeleitet, nie geschrieben: von zwei Kandidaten
  // gewinnt der mit dem höheren Verhältnis, und er muss 4,5 erreichen.
  const flaechen = ['brand-primary', 'support-error-surface', 'support-warning-surface',
                    'support-success-surface', 'support-info-surface'];
  for (const modus of MODI)
    for (const flaeche of flaechen) {
      const hex = skala.farbe[modus][flaeche];
      const best = Math.max(ratio('#FFFFFF', hex), ratio(skala.farbe.hell['text-primary'], hex));
      assert.ok(best >= 4.5, `${modus}: ${flaeche} trägt keine Beschriftung (bestes ${best.toFixed(2)})`);
    }
});

test('der Fokusring erreicht 3,0 gegen jede Fläche, auf der er liegen kann', () => {
  for (const modus of MODI)
    for (const grund of ['background', 'layer-01', 'layer-02']) {
      const ist = ratio(skala.farbe[modus].focus, skala.farbe[modus][grund]);
      assert.ok(ist >= 3.0, `${modus}: Fokus auf ${grund} = ${ist.toFixed(2)}`);
    }
});

test('jede rem-Größe ist ein glattes Sechzehntel', () => {
  const rem = [];
  const sammeln = (o) => Object.values(o).forEach((v) =>
    typeof v === 'object' ? sammeln(v) : typeof v === 'string' && v.endsWith('rem') && rem.push(v));
  sammeln(skala.mass);
  assert.ok(rem.length > 0, 'keine rem-Werte gefunden');
  for (const v of rem) {
    const px = parseFloat(v) * 16;
    assert.equal(px, Math.round(px), `${v} ergibt ${px}px und ist kein ganzes Pixel`);
  }
});

test('Abstände, Zeilen- und Control-Höhen liegen auf dem 4-px-Raster', () => {
  const raster = { ...skala.mass.space, ...skala.mass['line-height-px'],
                   ...skala.mass['control-height'].standard, ...skala.mass['control-height'].kompakt };
  for (const [name, wert] of Object.entries(raster)) {
    const px = wert.endsWith('rem') ? parseFloat(wert) * 16 : parseFloat(wert);
    assert.equal(px % 4, 0, `${name} = ${wert} (${px}px) liegt nicht auf dem 4-px-Raster`);
  }
});

test('keine Schriftgröße unterschreitet 12 px', () => {
  for (const [name, wert] of Object.entries(skala.mass['font-size'])) {
    const px = parseFloat(wert) * 16;
    assert.ok(px >= 12, `${name} = ${wert} ergibt ${px}px, Untergrenze ist 12`);
  }
});

test('jede Typo-Klasse nennt Familie, Größe, Gewicht und Zeilenhöhe', () => {
  for (const [name, k] of Object.entries(skala.typo)) {
    for (const feld of ['familie', 'groesse', 'gewicht', 'zeilenhoehe'])
      assert.ok(k[feld] !== undefined, `Klasse ${name} hat kein Feld ${feld}`);
    assert.ok(skala.mass['font-size'][k.groesse], `Klasse ${name} nennt unbekannte Größe ${k.groesse}`);
    assert.ok([400, 600].includes(k.gewicht), `Klasse ${name}: Inter trägt nur 400 und 600`);
  }
});

test('Linien stehen in px, nicht in rem', () => {
  for (const [name, wert] of Object.entries(skala.mass['border-width']))
    assert.ok(wert.endsWith('px'), `${name} = ${wert} — eine Linie soll eine Linie bleiben`);
  assert.ok(skala.mass.focus.breite.endsWith('px'));
  assert.ok(skala.mass.focus.offset.endsWith('px'));
});

test('Schatten trägt nur, was schwebt — drei Stufen je Modus', () => {
  for (const modus of MODI) {
    const stufen = Object.keys(skala.schatten[modus]).sort();
    assert.deepEqual(stufen, ['dialog', 'drag', 'popover']);
  }
  assert.ok(!JSON.stringify(skala).includes('shadow-raised'), 'shadow-raised entfällt ersatzlos');
});

test('getönte Flächen verschiedener Bedeutung trennen sich im Farbton', async () => {
  // Nicht im Kontrast: Der misst Helligkeit, und zwei gleich helle Tönungen
  // erreichen immer rund 1,0 — auch blau gegen orange. Getrennt wird im Ton.
  const { farbtonAbstand, FARBTON_ABSTAND_MIN } = await import('./brand.mjs');
  const getoent = ['brand-subtle', 'support-error-subtle', 'support-warning-subtle',
                   'support-success-subtle', 'support-info-subtle'];
  for (const modus of MODI)
    for (let i = 0; i < getoent.length; i++)
      for (let j = i + 1; j < getoent.length; j++) {
        const abstand = farbtonAbstand(skala.farbe[modus][getoent[i]], skala.farbe[modus][getoent[j]]);
        assert.ok(abstand >= FARBTON_ABSTAND_MIN,
          `${modus}: ${getoent[i]} und ${getoent[j]} trennen nur ${abstand.toFixed(1)}° — sie sehen gleich aus`);
      }
});
