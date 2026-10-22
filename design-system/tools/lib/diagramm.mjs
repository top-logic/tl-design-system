/**
 * Diagrammfarben: Paarliste, Prüfer und zulässige Helligkeitsstufen.
 *
 * Die Suche (Teil 2) wählt je Ton eine Stufe aus `zulaessigeStufen` so, dass der Abstand der
 * Reihen nach `pruefeReihen` möglichst groß wird. Hier steht, was dafür gilt und wie gemessen wird.
 */

import { deltaE, rotGruen } from './cvd.mjs';
import { ratio } from './contrast.mjs';
import { hexZuOklch, oklchZuHex } from './color.mjs';

export const DIAGRAMM = {
  /** Kontrast gegen `surface-base` und `surface-layer` (nicht-textliche Grafik, WCAG 1.4.11). */
  KONTRAST: 3.0,
  /** ΔE (OKLab × 100) für Rot-Grün-Schwäche, min aus protan und deutan. */
  ROT_GRUEN: 8,
  /** ΔE (OKLab × 100) bei normalem Sehen. */
  NORMAL: 15,
  CHROMA_MIN: 0.10,
  CHROMA_MAX: 0.15,
  /** Helligkeitsbereich je Modus (Prototyp C); der Kontrast engt ihn weiter ein. */
  BAND: { light: [0.43, 0.77], dark: [0.48, 0.77] },
};

/** Raster der Helligkeit (Plan-Review: 0,01 ist zu teuer, 0,03 verliert „acht geliefert“). */
/** Hundertstel je Rasterschritt: das Raster wird in ganzen Hundertsteln gezählt, nicht addiert. */
const L_RASTER_HUNDERTSTEL = 2;
/** Toleranz gegen die 8-Bit-Rundung von `oklchZuHex`, die C um bis zu 0,0015 bewegt. */
const C_TOLERANZ = 2e-3;

/**
 * Paare der Reihen (0-basiert): alle Nachbarn (i, i+1), dazu (0, j) für j ≥ 2, damit sich der
 * Ring schließt. Bei n Reihen sind das (n − 1) + (n − 2) Paare.
 */
export function diagrammPaare(n) {
  const paare = [];
  for (let i = 0; i + 1 < n; i++) paare.push([i, i + 1]);
  for (let j = 2; j < n; j++) paare.push([0, j]);
  return paare;
}

/**
 * Prüft die Reihen eines Modus gegen die Paarliste.
 *
 * `abstand` = min über alle Paare von min(ΔE_rotgrün / 8, ΔE_normal / 15); ab 1 sind beide
 * Schwellen gehalten. `schwaechstes` nennt Paar (1-basiert) und Art, die dieses Minimum bestimmen;
 * `wert` ist das rohe ΔE, `soll` seine Schwelle. Bei Gleichstand gilt das erste Paar der Liste,
 * und bei gleichem Quotienten zählt rot-grün.
 */
export function pruefeReihen(farben) {
  let besser = null;
  for (const [i, j] of diagrammPaare(farben.length)) {
    const rg = rotGruen(farben[i], farben[j]);
    const nm = deltaE(farben[i], farben[j]);
    const art = rg / DIAGRAMM.ROT_GRUEN <= nm / DIAGRAMM.NORMAL ? 'rot-gruen' : 'normal';
    const wert = art === 'rot-gruen' ? rg : nm;
    const soll = art === 'rot-gruen' ? DIAGRAMM.ROT_GRUEN : DIAGRAMM.NORMAL;
    const abstand = wert / soll;
    if (besser === null || abstand < besser.abstand) {
      besser = { abstand, schwaechstes: { art, reihen: [i + 1, j + 1], wert, soll } };
    }
  }
  return besser;
}

/**
 * Die Helligkeitsstufen, die ein Ton in einem Modus tragen darf.
 *
 * Raster 0,02 ab der Untergrenze des Bands bis höchstens zur Obergrenze (aus ganzen Hundertsteln
 * gebaut, damit keine Gleitkommadrift entsteht; die Obergrenze 0,77 liegt im dunklen Modus
 * zwischen zwei Stufen, dort ist 0,76 die letzte). `tonGrad` ist der Farbton in Grad.
 * Behalten wird eine Stufe nur, wenn ihr Hexwert gegen jeden Grund Kontrast ≥ 3,0 hält und die
 * tatsächliche Chroma des Hexwerts (der Farbraum kann sie unter `chroma` drücken) mindestens
 * 0,10 beträgt, abzüglich der Rundungstoleranz.
 */
export function zulaessigeStufen(tonGrad, chroma, modus, gruende) {
  const [unten, oben] = DIAGRAMM.BAND[modus];
  const H = (tonGrad * Math.PI) / 180;
  const vonH = Math.round(unten * 100);
  const bisH = Math.round(oben * 100);
  const stufen = [];
  for (let h = vonH; h <= bisH; h += L_RASTER_HUNDERTSTEL) {
    const L = h / 100;
    const { hex } = oklchZuHex({ L, C: chroma, H });
    if (hexZuOklch(hex).C < DIAGRAMM.CHROMA_MIN - C_TOLERANZ) continue;
    if (gruende.some((g) => ratio(hex, g) < DIAGRAMM.KONTRAST)) continue;
    stufen.push({ L, hex });
  }
  return stufen;
}
