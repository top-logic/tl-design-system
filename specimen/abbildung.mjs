// Setzt abbildung.json in Werte um: aus den Rollen der Skala werden die
// Tokennamen, die das ausgelieferte CSS heute liest.
//
// Das ausgelieferte tlReactControls.css kennt nur die alten Namen. Wer die
// Skala an echten Komponenten sehen will, muss sie deshalb auf diese Namen
// zurückführen — und genau an dieser Rückführung wird sichtbar, welche
// Entscheidungen die Abbildung noch offen lässt. Der Umweg ist kein Behelf,
// er ist die Probe: Was hier nicht auflösbar ist, ist in Stufe B eine
// Änderung am Stylesheet, keine am Token.

import { beschriftungAbleiten } from './brand.mjs';

/** Was ein Token trägt, das keinen Wert mehr bekommen soll.
 *
 *  Nicht weglassen: Die Vergleichsansicht trägt die Werte auf einen Container,
 *  nicht auf :root. Ein weggelassenes Token erbt dort den Wert des heutigen
 *  Themes und zeigt die alte Farbe als neue — still und unbemerkt. `initial`
 *  macht das var() ungültig, die Stelle fällt sichtbar aus. */
export const VORGABE = { ENTFAELLT: 'initial' };

/**
 * Die Tokens, die eine Entscheidung je Verwendungsstelle brauchen — mit ihrer Regel.
 *
 * `natur` trennt zwei Fälle, die bisher unter einem Namen liefen:
 *   alternative — an jeder Stelle gilt genau ein Ziel, die Regel sagt welches.
 *   aufteilung  — an derselben Stelle gelten beide gleichzeitig, für verschiedene
 *                 Eigenschaften. Hier ist nichts zu wählen; hier teilt Stufe B das
 *                 Stylesheet auf. Der Umschalter zeigt dann nur einen Ausschnitt.
 */
export function mehrdeutige(abbildung) {
  return Object.entries(abbildung.farbe)
    .filter(([, e]) => e.art === 'mehrdeutig')
    .map(([name, e]) => ({
      name, ziele: e.ziele, regel: e.regel, warum: e.warum,
      natur: e.natur, naturWarum: e.naturWarum,
    }));
}

/** Welches Ziel für ein mehrdeutiges Token gilt: das gewählte, sonst das erste genannte. */
function zielWaehlen(name, eintrag, wahl) {
  const gewaehlt = wahl[name];
  if (gewaehlt === undefined) return eintrag.ziele[0];
  if (!eintrag.ziele.includes(gewaehlt))
    throw new Error(`${name}: '${gewaehlt}' ist keines der genannten Ziele (${eintrag.ziele.join(', ')})`);
  return gewaehlt;
}

/** Die Fläche, gegen die eine Beschriftung gerechnet wird. '@name' verweist auf
 *  ein Ist-Token und folgt damit dessen (womöglich gewählter) Auflösung. */
function flaecheAufloesen(name, eintrag, abbildung, wahl, farben) {
  const { flaeche } = eintrag;
  if (!flaeche) throw new Error(`${name}: keine Fläche genannt, gegen die abgeleitet wird`);
  if (!flaeche.startsWith('@')) return farben[flaeche];
  const verweis = flaeche.slice(1);
  const ziel = abbildung.farbe[verweis];
  if (!ziel) throw new Error(`${name} verweist auf ${verweis}, das es im Ist nicht gibt`);
  return farben[ziel.art === 'mehrdeutig' ? zielWaehlen(verweis, ziel, wahl) : ziel.ziel];
}

/**
 * Bildet EINEN Modus ab: aus den Farbrollen der Skala werden die Ist-Tokennamen.
 *
 * @param farben     aufgelöste Farbrollen eines Modus aus der Skala (Rolle → Hex)
 * @param abbildung  abbildung.json
 * @param optionen   wahl: Ist-Token → gewähltes Ziel (nur für mehrdeutige);
 *                   istFarben: die Werte des heutigen Themes (für 'offen');
 *                   kandidaten: { dunklerKandidat, hellerKandidat } der Ableitung
 * @returns { tokens, herkunft } — tokens ist fertig zum Auftragen, herkunft sagt
 *          je Token, woher der Wert kommt und was daran noch offen ist.
 */
export function themaAusSkala(farben, abbildung, { wahl = {}, istFarben = {}, kandidaten } = {}) {
  const tokens = {};
  const herkunft = {};
  // Zwei Durchgänge: abgeleitete Tokens brauchen die Flächen, die der erste setzt.
  for (const [name, e] of Object.entries(abbildung.farbe)) {
    if (e.art === 'abgeleitet') continue;
    if (e.art === 'bleibt' || e.art === 'umbenannt') {
      tokens[name] = farben[e.ziel];
      herkunft[name] = { art: e.art, ziel: e.ziel, warum: e.warum };
    } else if (e.art === 'mehrdeutig') {
      const ziel = zielWaehlen(name, e, wahl);
      tokens[name] = farben[ziel];
      herkunft[name] = { art: e.art, ziel, ziele: e.ziele, regel: e.regel, warum: e.warum };
    } else if (e.art === 'entfaellt') {
      tokens[name] = VORGABE.ENTFAELLT;
      herkunft[name] = { art: e.art, warum: e.warum };
    } else if (e.art === 'offen') {
      // Der Ist-Wert steht hier als Platzhalter, nicht als Entscheidung — sonst
      // wäre die Fläche unlesbar und der Vergleich daneben unbrauchbar.
      tokens[name] = istFarben[name];
      herkunft[name] = { art: e.art, warum: e.warum };
    } else {
      throw new Error(`${name}: unbekannte Art ${e.art}`);
    }
    if (tokens[name] === undefined)
      throw new Error(`${name}: die Abbildung liefert keinen Wert (Ziel ${e.ziel ?? '—'})`);
  }
  for (const [name, e] of Object.entries(abbildung.farbe)) {
    if (e.art !== 'abgeleitet') continue;
    const flaeche = flaecheAufloesen(name, e, abbildung, wahl, farben);
    const abgeleitet = beschriftungAbleiten(flaeche, kandidaten);
    tokens[name] = abgeleitet.hex;
    herkunft[name] = {
      art: e.art, flaeche: e.flaeche, flaecheHex: flaeche,
      verhaeltnis: abgeleitet.verhaeltnis, warum: e.warum,
    };
  }
  return { tokens, herkunft };
}
