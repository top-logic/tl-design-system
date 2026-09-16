// Prüft die Trennung der Schichten. Sie ist die Stelle, an der ein
// Kundenprojekt eingreift: Primitive tauschen, nicht Klassen anpassen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { aufloesen } from './generieren.mjs';

const skala = JSON.parse(readFileSync(new URL('./skala.json', import.meta.url)));
const HEX = /#[0-9A-Fa-f]{3,8}\b/;
const REFERENZ = /^\{([a-z0-9-]+)\}$/;

function blaetter(o, pfad = '') {
  const raus = [];
  for (const [k, v] of Object.entries(o)) {
    if (k.startsWith('_')) continue;
    if (v && typeof v === 'object') raus.push(...blaetter(v, `${pfad}${k}.`));
    else raus.push([`${pfad}${k}`, v]);
  }
  return raus;
}

test('die semantische Farbschicht enthält kein einziges Hex', () => {
  for (const [pfad, wert] of blaetter(skala.farbe))
    assert.ok(!HEX.test(String(wert)), `${pfad} = ${wert} — Farben gehören in die Primitive`);
});

test('die semantische Maßschicht enthält keinen nackten Wert', () => {
  for (const [pfad, wert] of blaetter(skala.mass)) {
    if (typeof wert !== 'string' || pfad.includes('focus.stil') || pfad.includes('focus.ausloeser')) continue;
    assert.ok(REFERENZ.test(wert) || wert.startsWith('var('),
      `${pfad} = ${wert} — Maße gehören in die Primitive`);
  }
});

test('jede Referenz zeigt auf ein vorhandenes Primitiv', () => {
  const bekannt = new Set(Object.keys({ ...skala.primitiv.farbe, ...skala.primitiv.mass }));
  for (const [pfad, wert] of [...blaetter(skala.farbe), ...blaetter(skala.mass)]) {
    const treffer = REFERENZ.exec(String(wert));
    if (treffer) assert.ok(bekannt.has(treffer[1]), `${pfad} zeigt auf unbekanntes ${treffer[1]}`);
  }
});

test('kein Primitiv steht ungenutzt herum', () => {
  const benutzt = new Set();
  for (const [, wert] of [...blaetter(skala.farbe), ...blaetter(skala.mass)]) {
    const treffer = REFERENZ.exec(String(wert));
    if (treffer) benutzt.add(treffer[1]);
  }
  for (const name of Object.keys({ ...skala.primitiv.farbe, ...skala.primitiv.mass }))
    assert.ok(benutzt.has(name), `${name} wird von keiner Rolle benutzt`);
});

test('Primitivnamen behaupten nichts über ihre Rolle', () => {
  const rollenwoerter = /(primary|secondary|brand|focus|border|background|layer|support|field|helper|placeholder|control|row|padding|gap)/;
  for (const name of Object.keys({ ...skala.primitiv.farbe, ...skala.primitiv.mass }))
    assert.ok(!rollenwoerter.test(name), `${name} trägt eine Rolle im Namen — dann ist es kein Primitiv`);
});

test('ein Kunde tauscht ein Primitiv und alle Rollen ziehen mit', () => {
  // Die eigentliche Zusage an Kundenprojekte, hier als Test.
  const kunde = structuredClone(skala);
  const markenPrimitiv = REFERENZ.exec(kunde.farbe.hell['brand-primary'])[1];
  kunde.primitiv.farbe[markenPrimitiv] = '#7A1FA2';
  const aufgeloest = aufloesen(kunde);
  for (const rolle of ['brand-primary', 'brand-link', 'focus', 'border-interactive'])
    assert.equal(aufgeloest.farbe.hell[rolle], '#7A1FA2',
      `${rolle} ist dem getauschten Primitiv nicht gefolgt`);
});
