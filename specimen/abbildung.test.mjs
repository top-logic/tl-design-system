// Die Abbildung vom heutigen Theme auf die entschiedene Skala.
//
// Ihr Zweck ist nicht Vollständigkeit um ihrer selbst willen: Jedes Token des
// Ist-Zustands muss eine ausdrückliche Entscheidung tragen. Ein Token, das
// niemand einordnet, verschwindet in Stufe B still — und still verschwundene
// Tokens sind genau die Vererbungsfehler, die das Gate gefunden hat.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const ist = JSON.parse(readFileSync(new URL('./tokens.json', import.meta.url)));
const soll = JSON.parse(readFileSync(new URL('./skala.json', import.meta.url)));
const abbildung = JSON.parse(readFileSync(new URL('./abbildung.json', import.meta.url)));

const ARTEN = ['bleibt', 'umbenannt', 'mehrdeutig', 'abgeleitet', 'entfaellt', 'offen'];
const rollen = new Set(Object.keys(soll.farbe.hell));
const eintraege = Object.entries(abbildung.farbe);

test('jedes Token des Ist-Zustands ist eingeordnet', () => {
  const eingeordnet = new Set(Object.keys(abbildung.farbe));
  for (const name of Object.keys(ist.light))
    assert.ok(eingeordnet.has(name), `${name} trägt keine Entscheidung`);
});

test('die Abbildung erfindet keine Tokens, die es im Ist nicht gibt', () => {
  for (const name of Object.keys(abbildung.farbe))
    assert.ok(name in ist.light, `${name} steht nicht im Ist-Zustand`);
});

test('jeder Eintrag nennt eine bekannte Art und eine Begründung', () => {
  for (const [name, e] of eintraege) {
    assert.ok(ARTEN.includes(e.art), `${name}: unbekannte Art ${e.art}`);
    assert.ok(e.warum && e.warum.length > 10, `${name}: keine Begründung`);
  }
});

test('was bleibt oder umbenannt wird, zeigt auf eine vorhandene Rolle', () => {
  for (const [name, e] of eintraege) {
    if (e.art !== 'bleibt' && e.art !== 'umbenannt') continue;
    assert.ok(rollen.has(e.ziel), `${name} → ${e.ziel} gibt es in der Skala nicht`);
    if (e.art === 'bleibt') assert.equal(e.ziel, name, `${name} heißt nicht wie sein Ziel`);
  }
});

test('ein mehrdeutiges Token nennt mindestens zwei Ziele und die Regel dazwischen', () => {
  // Das ist der wiederkehrende Befund: ein Token, mehrere Aufgaben. Wer hier
  // nur ein Ziel angibt, entscheidet die Mehrdeutigkeit nicht, er verdeckt sie.
  for (const [name, e] of eintraege) {
    if (e.art !== 'mehrdeutig') continue;
    assert.ok(Array.isArray(e.ziele) && e.ziele.length >= 2, `${name}: weniger als zwei Ziele`);
    for (const ziel of e.ziele) assert.ok(rollen.has(ziel), `${name} → ${ziel} gibt es nicht`);
    assert.ok(e.regel && e.regel.length > 20, `${name}: keine Regel, wie zu entscheiden ist`);
  }
});

test('jede Rolle der Skala wird von der Abbildung erreicht oder ist ausdrücklich neu', () => {
  const erreicht = new Set();
  for (const [, e] of eintraege) {
    if (e.ziel) erreicht.add(e.ziel);
    (e.ziele ?? []).forEach((z) => erreicht.add(z));
  }
  const neu = new Set(abbildung.neu);
  for (const rolle of rollen)
    assert.ok(erreicht.has(rolle) || neu.has(rolle),
      `${rolle} ist weder Ziel einer Abbildung noch als neu vermerkt`);
});

test('kein Token ist gleichzeitig abgebildet und als neu vermerkt', () => {
  const ziele = new Set(eintraege.flatMap(([, e]) => [e.ziel, ...(e.ziele ?? [])].filter(Boolean)));
  for (const rolle of abbildung.neu)
    assert.ok(!ziele.has(rolle), `${rolle} ist Ziel einer Abbildung und trotzdem als neu vermerkt`);
});
