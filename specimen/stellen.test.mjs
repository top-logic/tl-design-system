// Die Zuordnung jeder einzelnen Lesestelle auf eine Rolle der Skala.
//
// abbildung.json entscheidet je TOKEN. Bei den mehrdeutigen reicht das nicht:
// Dort entscheidet erst die Stelle. stellen.json trägt diese Entscheidungen —
// und der Test hier ist die Zusage, dass keine Stelle ohne eine bleibt. Eine
// Stelle ohne Entscheidung wird beim Umschreiben still zu irgendetwas.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { klasseVon, zuordnen, stellenBericht, KLASSEN } from './stellen.mjs';

const MODUL = join(process.env.TL_WORKTREE ?? join(homedir(), 'git/tl8-wt-29584'),
  'com.top_logic.layout.react/src/main/webapp');
const da = existsSync(join(MODUL, 'style/tlReactControls.css'));
const css = da ? ['style/tlReactBase.css', 'style/tlReactControls.css']
  .map((d) => readFileSync(join(MODUL, d), 'utf8')).join('\n') : null;

const abbildung = JSON.parse(readFileSync(new URL('./abbildung.json', import.meta.url)));
const stellen = JSON.parse(readFileSync(new URL('./stellen.json', import.meta.url)));
const skala = JSON.parse(readFileSync(new URL('./skala.json', import.meta.url)));
const rollen = new Set(Object.keys(skala.farbe.hell));
const mehrdeutig = Object.entries(abbildung.farbe).filter(([, e]) => e.art === 'mehrdeutig');

test('jede Eigenschaft fällt in genau eine Klasse: Linie, Text oder Fläche', () => {
  assert.equal(klasseVon({ eigenschaft: 'border-color', wert: 'var(--x)' }), 'linie');
  assert.equal(klasseVon({ eigenschaft: 'outline', wert: 'var(--x)' }), 'linie');
  assert.equal(klasseVon({ eigenschaft: 'color', wert: 'var(--x)' }), 'text');
  assert.equal(klasseVon({ eigenschaft: 'background', wert: 'var(--x)' }), 'flaeche');
  assert.equal(klasseVon({ eigenschaft: 'accent-color', wert: 'var(--x)' }), 'flaeche');
});

test('ein inset-Schatten ist eine Linie, ein äußerer ist keine', () => {
  // Der Bestand baut Rahmen als box-shadow: inset 0 0 0 2px — an 25 Stellen.
  // Wer den Schatten pauschal als Elevation liest, ordnet jede Umriss-
  // Schaltfläche falsch zu; wer ihn pauschal als Linie liest, ebenso.
  assert.equal(klasseVon({ eigenschaft: 'box-shadow', wert: 'inset 0 0 0 2px var(--x)' }), 'linie');
  assert.equal(klasseVon({ eigenschaft: 'box-shadow', wert: '0 2px 4px var(--x)' }), null);
});

test('jedes mehrdeutige Token trägt eine Zuordnung in stellen.json', () => {
  for (const [name] of mehrdeutig)
    assert.ok(stellen.token[name], `${name} hat keine Zuordnung`);
});

test('jedes genannte Ziel gibt es in der Skala', () => {
  for (const [name, e] of Object.entries(stellen.token)) {
    for (const ziel of Object.values(e.nachKlasse ?? {}))
      assert.ok(rollen.has(ziel), `${name} → ${ziel} gibt es in der Skala nicht`);
    for (const ziel of Object.keys(e.nachSelektor ?? {}))
      assert.ok(rollen.has(ziel), `${name} → ${ziel} gibt es in der Skala nicht`);
  }
});

test('eine Zuordnung nennt nur Ziele, die die Abbildung für dieses Token führt', () => {
  // Sonst entscheidet die Stelle etwas, das die Abbildung nie zugelassen hat —
  // und die Begründung in abbildung.json deckt die Entscheidung nicht mehr.
  for (const [name, e] of Object.entries(stellen.token)) {
    const erlaubt = new Set(abbildung.farbe[name].ziele);
    for (const ziel of [...Object.values(e.nachKlasse ?? {}), ...Object.keys(e.nachSelektor ?? {})])
      assert.ok(erlaubt.has(ziel), `${name} → ${ziel} steht nicht in den Zielen der Abbildung`);
  }
});

test('jede zweckfremde Stelle nennt Grund und Vorschlag', () => {
  // Eine Stelle, an der die Regel nicht greift, ist ein Befund — kein Anlass,
  // die Regel zu dehnen, bis sie irgendwie passt.
  for (const [name, e] of Object.entries(stellen.token)) {
    for (const [selektor, z] of Object.entries(e.zweckfremd ?? {})) {
      assert.ok(z.warum && z.warum.length > 20, `${name} / ${selektor}: kein Grund`);
      assert.ok(z.vorschlag, `${name} / ${selektor}: kein Vorschlag`);
      assert.ok(rollen.has(z.vorschlag), `${name} / ${selektor}: ${z.vorschlag} gibt es nicht`);
    }
  }
});

test('keine Lesestelle bleibt ohne Entscheidung', { skip: !da && 'Worktree nicht da' }, () => {
  // Das ist die eigentliche Zusage. Kommt eine Komponente hinzu, die ein
  // mehrdeutiges Token an neuer Stelle liest, bricht dieser Test — und die
  // Entscheidung wird getroffen, statt beim Umschreiben zu verschwinden.
  const bericht = stellenBericht(css, abbildung, stellen);
  const ohne = [];
  for (const [name, b] of Object.entries(bericht))
    for (const s of b.stellen) if (!s.ziel && !s.zweckfremd) ohne.push(`${name} @ ${s.eigenschaft} ${s.selektor}`);
  assert.deepEqual(ohne, [], `${ohne.length} Stellen ohne Entscheidung`);
});

test('die Selektorlisten nennen keine Stelle, die es nicht gibt', { skip: !da && 'Worktree nicht da' }, () => {
  // Ein Selektor, den das CSS nicht mehr enthält, ist eine Entscheidung über
  // nichts — und verdeckt, dass die Komponente umbenannt wurde.
  const bericht = stellenBericht(css, abbildung, stellen);
  for (const [name, e] of Object.entries(stellen.token)) {
    const vorhanden = new Set(bericht[name].stellen.map((s) => s.selektor));
    for (const [ziel, liste] of Object.entries(e.nachSelektor ?? {}))
      for (const sel of liste)
        assert.ok(vorhanden.has(sel), `${name} → ${ziel}: ${sel} liest das Token nicht (mehr)`);
    for (const sel of Object.keys(e.zweckfremd ?? {}))
      assert.ok(vorhanden.has(sel), `${name}: ${sel} liest das Token nicht (mehr)`);
  }
});

test('border-subtle: die Eingabefelder bekommen border-control', { skip: !da && 'Worktree nicht da' }, () => {
  // Der Kern des ganzen Befundes: Heute erreicht kein Eingabefeld die 3,0 aus
  // WCAG 1.4.11, weil border-subtle als Trennlinie bemessen ist. Genau diese
  // Stellen wechseln auf border-control.
  const bericht = stellenBericht(css, abbildung, stellen);
  const felder = bericht['border-subtle'].stellen
    .find((s) => s.selektor.includes('.tlReactTextInput'));
  assert.equal(felder.ziel, 'border-control');
});

test('border-subtle trennt öfter als es umschließt — sonst wäre die Regel falsch herum', { skip: !da && 'Worktree nicht da' }, () => {
  const b = stellenBericht(css, abbildung, stellen)['border-subtle'];
  const separator = b.stellen.filter((s) => s.ziel === 'border-separator').length;
  const control = b.stellen.filter((s) => s.ziel === 'border-control').length;
  assert.ok(separator > control, `${separator} separator gegen ${control} control`);
  assert.equal(separator + control, b.stellen.length);
});
