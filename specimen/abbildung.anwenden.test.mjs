// Die Abbildung als Funktion, nicht als Dokument.
//
// abbildung.json sagt, was aus jedem Ist-Token wird. Solange das nur Prosa ist,
// prüft es niemand an Farbe und Fläche nach. themaAusSkala() setzt es in Werte
// um — damit die Vergleichsansicht dieselben Fragmente einmal unter dem heutigen
// Theme und einmal unter der Skala zeigen kann, ohne dass ein Token still von
// der einen Seite auf die andere durchschlägt.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { themaAusSkala, mehrdeutige, VORGABE } from './abbildung.mjs';
import { aufloesen } from './generieren.mjs';
import { ratio } from './contrast.mjs';

const ist = JSON.parse(readFileSync(new URL('./tokens.json', import.meta.url)));
const skala = aufloesen(JSON.parse(readFileSync(new URL('./skala.json', import.meta.url))));
const abbildung = JSON.parse(readFileSync(new URL('./abbildung.json', import.meta.url)));

const KANDIDATEN = { dunklerKandidat: skala.farbe.hell['text-primary'], hellerKandidat: '#FFFFFF' };
const hell = () => themaAusSkala(skala.farbe.hell, abbildung, { istFarben: ist.light, kandidaten: KANDIDATEN });

test('jedes Ist-Token bekommt einen Wert — keines erbt still vom heutigen Theme', () => {
  // Die Vergleichsansicht trägt die Werte auf einen Container, nicht auf :root.
  // Ein Token ohne Wert erbt dort vom Ist-Theme und zeigt die alte Farbe als
  // neue — genau die stille Vererbung, die das Gate schon einmal gefunden hat.
  const { tokens } = hell();
  for (const name of Object.keys(ist.light))
    assert.ok(name in tokens, `${name} bleibt ohne Wert und würde geerbt`);
});

test('bleibt und umbenannt tragen genau den Wert ihrer Ziel-Rolle', () => {
  const { tokens } = hell();
  for (const [name, e] of Object.entries(abbildung.farbe)) {
    if (e.art !== 'bleibt' && e.art !== 'umbenannt') continue;
    assert.equal(tokens[name], skala.farbe.hell[e.ziel], `${name} → ${e.ziel}`);
  }
});

test('mehrdeutig nimmt ohne Wahl das erste Ziel und mit Wahl das gewählte', () => {
  const ohne = hell().tokens['border-subtle'];
  assert.equal(ohne, skala.farbe.hell['border-separator']);
  const mit = themaAusSkala(skala.farbe.hell, abbildung,
    { istFarben: ist.light, kandidaten: KANDIDATEN, wahl: { 'border-subtle': 'border-control' } });
  assert.equal(mit.tokens['border-subtle'], skala.farbe.hell['border-control']);
});

test('eine Wahl, die kein genanntes Ziel ist, wird nicht stillschweigend geschluckt', () => {
  assert.throws(() => themaAusSkala(skala.farbe.hell, abbildung,
    { istFarben: ist.light, kandidaten: KANDIDATEN, wahl: { 'border-subtle': 'text-primary' } }),
    /border-subtle/);
});

test('abgeleitet rechnet gegen seine Fläche und nimmt den stärkeren Kandidaten', () => {
  const { tokens } = hell();
  const flaeche = skala.farbe.hell['brand-primary'];
  const erwartet = ratio(KANDIDATEN.dunklerKandidat, flaeche) >= ratio(KANDIDATEN.hellerKandidat, flaeche)
    ? KANDIDATEN.dunklerKandidat.toUpperCase() : '#FFFFFF';
  assert.equal(tokens['text-on-brand'], erwartet);
});

test('die Beschriftung einer Akzentfläche folgt der Wahl, die für die Fläche getroffen wurde', () => {
  // layer-accent-text hängt an layer-accent. Wer die Fläche auf brand-subtle
  // stellt und die Beschriftung weiter gegen layer-overlay rechnet, sieht im
  // Vergleich eine Kombination, die es so nie gibt.
  const a = themaAusSkala(skala.farbe.hell, abbildung,
    { istFarben: ist.light, kandidaten: KANDIDATEN, wahl: { 'layer-accent': 'layer-overlay' } });
  const b = themaAusSkala(skala.farbe.hell, abbildung,
    { istFarben: ist.light, kandidaten: KANDIDATEN, wahl: { 'layer-accent': 'brand-subtle' } });
  for (const [wahlName, ergebnis] of [['layer-overlay', a], ['brand-subtle', b]]) {
    const erwartet = ratio(KANDIDATEN.dunklerKandidat, skala.farbe.hell[wahlName])
      >= ratio(KANDIDATEN.hellerKandidat, skala.farbe.hell[wahlName])
      ? KANDIDATEN.dunklerKandidat.toUpperCase() : '#FFFFFF';
    assert.equal(ergebnis.tokens['layer-accent-text'], erwartet, `Fläche ${wahlName}`);
  }
});

test('offen übernimmt den Ist-Wert und sagt es', () => {
  const { tokens, herkunft } = hell();
  assert.equal(tokens['text-disabled'], ist.light['text-disabled']);
  assert.equal(herkunft['text-disabled'].art, 'offen');
});

test('entfaellt erbt nicht, sondern wird ausdrücklich abgeschaltet', () => {
  const { tokens } = hell();
  assert.equal(tokens['focus-inset'], VORGABE.ENTFAELLT);
  assert.equal(tokens['background-inverse'], VORGABE.ENTFAELLT);
});

test('jedes abgeleitete Token nennt eine Fläche, die es in der Skala gibt', () => {
  for (const [name, e] of Object.entries(abbildung.farbe)) {
    if (e.art !== 'abgeleitet') continue;
    assert.ok(e.flaeche, `${name}: keine Fläche genannt, gegen die abgeleitet wird`);
    if (e.flaeche.startsWith('@')) {
      const verweis = e.flaeche.slice(1);
      assert.ok(abbildung.farbe[verweis], `${name} verweist auf ${verweis}, das es im Ist nicht gibt`);
    } else {
      assert.ok(e.flaeche in skala.farbe.hell, `${name} → ${e.flaeche} gibt es in der Skala nicht`);
    }
  }
});

test('beide Modi lassen sich abbilden, ohne dass ein Ziel fehlt', () => {
  for (const [modus, farben, istFarben] of
    [['hell', skala.farbe.hell, ist.light], ['dunkel', skala.farbe.dunkel, ist.dark]]) {
    const { tokens } = themaAusSkala(farben, abbildung, { istFarben, kandidaten: KANDIDATEN });
    for (const [name, wert] of Object.entries(tokens))
      assert.ok(wert !== undefined, `${modus}: ${name} ohne Wert`);
  }
});

test('mehrdeutige() listet genau die Tokens, die eine Entscheidung je Stelle brauchen', () => {
  const liste = mehrdeutige(abbildung);
  assert.equal(liste.length, Object.values(abbildung.farbe).filter((e) => e.art === 'mehrdeutig').length);
  for (const e of liste) {
    assert.ok(e.ziele.length >= 2);
    assert.ok(e.regel.length > 20, `${e.name}: die Regel muss mitkommen, sonst rät der Umschalter`);
  }
});

test('jedes mehrdeutige Token sagt, ob zu wählen oder aufzuteilen ist', () => {
  // Der Unterschied ist in der Vergleichsansicht aufgefallen und wiegt schwer: Bei einer
  // Alternative gilt je Stelle genau ein Ziel, der Umschalter entscheidet sie. Bei einer
  // Aufteilung gelten an derselben Stelle beide gleichzeitig, für verschiedene
  // Eigenschaften — dort ist nichts zu wählen, dort muss Stufe B das Stylesheet teilen.
  // Ohne diese Unterscheidung täuscht der Umschalter eine Entscheidung vor, die es nicht gibt.
  for (const e of mehrdeutige(abbildung)) {
    assert.ok(['alternative', 'aufteilung'].includes(e.natur), `${e.name}: keine Natur`);
    if (e.natur === 'aufteilung')
      assert.ok(e.naturWarum && e.naturWarum.length > 20, `${e.name}: keine Begründung der Aufteilung`);
  }
});

test('eine Aufteilung ist an der Fläche nicht auflösbar — und sagt das, statt zu raten', () => {
  // button-secondary trägt Linie UND Schrift. Welches Ziel der Umschalter auch nimmt, die
  // jeweils andere Eigenschaft bekommt den falschen Wert. Der Test hält fest, dass die
  // Abbildung diesen Fall benennt statt ihn durch eine Vorgabe zu verdecken.
  const e = mehrdeutige(abbildung).find((x) => x.name === 'button-secondary');
  assert.equal(e.natur, 'aufteilung');
  const { tokens } = hell();
  assert.equal(tokens['button-secondary'], skala.farbe.hell['border-control']);
  assert.notEqual(skala.farbe.hell['border-control'], skala.farbe.hell['brand-primary'],
    'wären beide gleich, gäbe es die Aufteilung gar nicht');
});
