import { test } from 'node:test';
import assert from 'node:assert/strict';
import { text, nonText, report, REQUIREMENTS } from './requirements.mjs';

test('Ein Paar unter seiner Schwelle wird gemeldet, mit beiden Werten und dem Verhältnis', () => {
  const problems = report('dark',
    { 'text-on-color': '#ffffff', 'button-primary': '#5b9bf0' },
    [text('text-on-color', 'button-primary')]);

  assert.equal(problems.length, 1);
  assert.match(problems[0], /dark/);
  assert.match(problems[0], /text-on-color/);
  assert.match(problems[0], /#5b9bf0/);
  assert.match(problems[0], /2\.84/);
});

test('Ein Paar, das seine Schwelle hält, wird nicht gemeldet', () => {
  const problems = report('default',
    { 'text-primary': '#101113', background: '#ffffff' },
    [text('text-primary', 'background')]);

  assert.deepEqual(problems, []);
});

test('Ein Token, das es nicht gibt, ist ein Fehler und kein stilles Überspringen', () => {
  const problems = report('default', { background: '#ffffff' },
    [text('gibt-es-nicht', 'background')]);

  assert.equal(problems.length, 1);
  assert.match(problems[0], /gibt-es-nicht/);
});

test('Text schuldet 4,5, ein Icon oder eine Begrenzung 3', () => {
  assert.equal(text('a', 'b').minimum, 4.5);
  assert.equal(nonText('a', 'b').minimum, 3);
});

test('Die Paarliste deckt Text, Fläche, Zustand, Links und Begrenzungen ab', () => {
  // Ab Stufe A leitet der Marken-Explorer die Beschriftung je Fläche ab (siehe Kommentar über
  // REQUIREMENTS in requirements.mjs): 'text-on-color' auf button-primary ist deshalb durch
  // 'text-on-brand' ersetzt — dieselbe Fläche, dasselbe Paar, nur umbenanntes Vordergrund-Token.
  // Die Gesamtzahl bleibt 22: sechs Paare wurden umbenannt, keines hinzugefügt oder entfernt.
  assert.equal(REQUIREMENTS.length, 22);
  const paare = REQUIREMENTS.map((r) => `${r.foreground}|${r.background}`);
  assert.ok(paare.includes('text-on-brand|button-primary'));
  assert.ok(paare.includes('text-on-danger|button-danger'));
  assert.ok(paare.includes('text-inverse|background-inverse'));
  assert.ok(paare.includes('text-placeholder|field'));
  assert.ok(paare.includes('focus|background'));
});
