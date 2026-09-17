/**
 * Leitet die Marken-Primitives (Button und Link, beide Modi) aus einer einzigen Grundfarbe ab.
 *
 * Gerechnet wird in OKLCH, nicht in HSL. HSL-Rampen sind perzeptuell ungleichmäßig: derselbe
 * Schritt in L (HSL) macht Gelb kaum dunkler und Blau stark dunkler, weil HSL keine
 * Wahrnehmungsgleichheit kennt. OKLCH ist so konstruiert, dass ein Schritt in L über alle Farbtöne
 * ungefähr gleich stark wahrgenommen wird — die Rampen von Rot, Grün und Blau werden damit
 * vergleichbar. Die Umrechnung sRGB ↔ lineares RGB ↔ OKLab ↔ OKLCH ist geschlossene Mathematik
 * (Björn Ottossons Matrizen für OKLab) und zieht keine Abhängigkeit nach sich.
 *
 * Daneben leitet dieses Modul auch die Beschriftungsfarbe (text-on-color, icon-on-color) ab —
 * dafür wird contrast.mjs importiert, nicht neu erfunden.
 */

import { ratio } from './contrast.mjs';

// ---------------------------------------------------------------------------------------------
// sRGB ↔ linear ↔ OKLab ↔ OKLCH — reine Zahlenumrechnung, keine Bibliothek.
// ---------------------------------------------------------------------------------------------

function srgbKanalZuLinear(kanal) {
  const wert = kanal / 255;
  return wert <= 0.04045 ? wert / 12.92 : ((wert + 0.055) / 1.055) ** 2.4;
}

function linearKanalZuSrgb(wert) {
  const begrenzt = Math.max(0, Math.min(1, wert));
  const kodiert = begrenzt <= 0.0031308 ? begrenzt * 12.92 : 1.055 * begrenzt ** (1 / 2.4) - 0.055;
  return Math.round(Math.max(0, Math.min(1, kodiert)) * 255);
}

/** Hexwert (#rgb, #rrggbb) zu {r,g,b}, jeweils 0–255. */
function hexZuRgb(hex) {
  const ziffern = hex.trim().replace(/^#/, '');
  const voll = ziffern.length === 3 ? [...ziffern].map((z) => z + z).join('') : ziffern;
  return {
    r: parseInt(voll.slice(0, 2), 16),
    g: parseInt(voll.slice(2, 4), 16),
    b: parseInt(voll.slice(4, 6), 16),
  };
}

function rgbZuHex({ r, g, b }) {
  const zweistellig = (kanal) => kanal.toString(16).padStart(2, '0').toUpperCase();
  return `#${zweistellig(r)}${zweistellig(g)}${zweistellig(b)}`;
}

// Ottossons OKLab-Matrizen (linear sRGB → LMS → OKLab und zurück).
function rgbZuOklab({ r, g, b }) {
  const lr = srgbKanalZuLinear(r);
  const lg = srgbKanalZuLinear(g);
  const lb = srgbKanalZuLinear(b);

  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  return {
    L: 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_,
  };
}

/** OKLab {L,a,b} → lineares sRGB {lr,lg,lb}, UNBEGRENZT — kann außerhalb von 0…1 liegen. Reine
 *  Zahlenumrechnung, damit die Gamut-Suche unten dieselbe Rechnung beliebig oft wiederholen kann,
 *  ohne jedes Mal auch schon zu runden oder zu klemmen. */
function oklabZuLinearRgb({ L, a, b }) {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;

  return {
    lr: 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    lg: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    lb: -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  };
}

const KANAL_IM_GAMUT = (kanal) => kanal >= 0 && kanal <= 1;
const ALLE_KANAELE_IM_GAMUT = ({ lr, lg, lb }) => KANAL_IM_GAMUT(lr) && KANAL_IM_GAMUT(lg) && KANAL_IM_GAMUT(lb);

/** OKLab {L,a,b} als Zylinder {L,C,H} — H in Radiant, damit die Trigonometrie ohne Umrechnung passt. */
function oklabZuOklch({ L, a, b }) {
  return { L, C: Math.sqrt(a * a + b * b), H: Math.atan2(b, a) };
}

function oklchZuOklab({ L, C, H }) {
  return { L, a: C * Math.cos(H), b: C * Math.sin(H) };
}

/** Hexwert zu OKLCH. */
export function hexZuOklch(hex) {
  return oklabZuOklch(rgbZuOklab(hexZuRgb(hex)));
}

/**
 * Anzahl der Intervallhalbierungen bei der Chroma-Suche (siehe oklchZuHex()).
 *
 * Jeder Schritt halbiert das Unsicherheitsintervall der Chroma. 20 Schritte drücken es auf das
 * 2^-20-fache seiner Ausgangsbreite zusammen — bei einer Ausgangs-Chroma von realistisch bis zu
 * 0,4 sind das rund 4·10⁻⁷, weit unterhalb dessen, was ein 8-Bit-Farbkanal (Auflösung 1/255 ≈
 * 0,0039) überhaupt unterscheiden kann. Eine analytische Lösung des Gamut-Rands in OKLCH gibt es
 * nicht geschlossen (die Hin- und Rückmatrizen sind über die Kubikwurzel verschachtelt); die
 * Suche ist dafür unabhängig vom Farbton immer gleich schnell und gleich genau.
 */
export const CHROMA_SUCH_SCHRITTE = 20;

/**
 * OKLCH zu Hexwert — mit Gamut-Anpassung statt stillem Verlust.
 *
 * Liegt {L,C,H} außerhalb dessen, was sRGB darstellen kann, wird NICHT geklemmt (das würde L und
 * H verzerren, denn nach der Rundung ist der Kanal nicht mehr auf der ursprünglichen L/H-Linie).
 * Statt dessen wird C bei gehaltenem L und H per Intervallhalbierung so weit verringert, bis alle
 * drei linearen Kanäle in 0…1 liegen — das genau ist die Bedeutung von "Helligkeit und Farbton
 * bleiben unangetastet, Chroma ist die Stellschraube". Das Ergebnis ist blasser als angefragt,
 * aber auf derselben L/H-Linie: der schwächere, ehrliche Ersatz für einen Ton, den es an dieser
 * Helligkeit in dieser Sättigung in sRGB nicht gibt.
 *
 * Rückgabe: { hex, reduziert, geklemmt }.
 *   - reduziert: die Chroma wurde gesenkt, um im Gamut zu bleiben (normal, informativ).
 *   - geklemmt: auch bei C=0 (vollständig entsättigt, ein Grauton auf derselben Helligkeit) bleibt
 *     der Kanal außerhalb von 0…1 — das kann nur passieren, wenn L selbst außerhalb von 0…1 liegt.
 *     Dann hilft keine Chroma-Reduktion mehr; das ist ein Fehlerfall, kein normaler Bestandteil
 *     der Ableitung, und wird als solcher weiterhin gemeldet.
 */
export function oklchZuHex({ L, C, H }) {
  const angefragt = oklabZuLinearRgb(oklchZuOklab({ L, C, H }));
  if (ALLE_KANAELE_IM_GAMUT(angefragt)) {
    return { hex: rgbZuHex(rundeLinearRgb(angefragt)), reduziert: false, geklemmt: false };
  }

  // Fehlerfall zuerst ausschließen: wenn schon der vollständig entsättigte Punkt (C=0) auf
  // dieser Helligkeit außerhalb des Gamuts liegt, ist L selbst nicht darstellbar — keine
  // Chroma-Reduktion kann das beheben.
  const achromatisch = oklabZuLinearRgb(oklchZuOklab({ L, C: 0, H }));
  if (!ALLE_KANAELE_IM_GAMUT(achromatisch)) {
    return { hex: rgbZuHex(rundeLinearRgb(angefragt)), reduziert: false, geklemmt: true };
  }

  // Intervallhalbierung: unten ist immer im Gamut (Invariante, durch den Test oben gesichert),
  // oben immer außerhalb (die Anfrage selbst, laut erstem Test). Nach CHROMA_SUCH_SCHRITTE
  // Schritten ist "unten" die größte im Gamut liegende Chroma, bis auf die oben berechnete
  // Rundungstoleranz.
  let unten = 0;
  let oben = C;
  for (let schritt = 0; schritt < CHROMA_SUCH_SCHRITTE; schritt++) {
    const mitte = (unten + oben) / 2;
    const probe = oklabZuLinearRgb(oklchZuOklab({ L, C: mitte, H }));
    if (ALLE_KANAELE_IM_GAMUT(probe)) unten = mitte; else oben = mitte;
  }

  const gefunden = oklabZuLinearRgb(oklchZuOklab({ L, C: unten, H }));
  return { hex: rgbZuHex(rundeLinearRgb(gefunden)), reduziert: true, geklemmt: false };
}

/** Rundet lineares RGB auf sRGB-Kanäle 0–255. Wird nur auf Werte angewendet, die bereits (durch
 *  oklchZuHex() sichergestellt) im Gamut liegen — bis auf den gemeldeten Fehlerfall, wo trotzdem
 *  gerundet werden muss, um überhaupt einen Hexwert anzuzeigen. */
function rundeLinearRgb({ lr, lg, lb }) {
  return { r: linearKanalZuSrgb(lr), g: linearKanalZuSrgb(lg), b: linearKanalZuSrgb(lb) };
}

// ---------------------------------------------------------------------------------------------
// Die Schrittweiten der Ableitung — an einer Stelle, benannt, mit Begründung.
//
// Alle Schritte bewegen ausschließlich L (Helligkeit in OKLCH); C (Sättigung) und H (Farbton)
// bleiben über die ganze Rampe erhalten. Das hält die Rampe an EINEM Farbton entlang einer
// Helligkeitslinie, statt nebenbei den Ton zu verschieben — genau das Problem, das HSL hat.
//
// Ursprünglich gegen die heute geltenden Gate-Zahlen für #2968C8 kalibriert (hell 1 Verstoß,
// dunkel 7 Verstöße). Seit oklchZuHex() bei Bedarf die Chroma senkt statt zu klemmen, weichen
// diese Zahlen für #2968C8 leicht ab (siehe task-7-brand-report.md, Korrekturrunde 2) — die
// Schrittweiten selbst sind unverändert, nur der Weg zum Hexwert an den Stufen, die den Gamut
// verlassen, ist ein anderer. Die Werte bleiben trotzdem nur ein Vorschlag, keine Festlegung.
// ---------------------------------------------------------------------------------------------

/** Hell: hover ist um diesen Betrag dunkler als der Grundton. */
export const HELL_HOVER_SCHRITT = 0.06;

/** Hell: active ist um diesen Betrag dunkler als der Grundton (nicht nur als hover). */
export const HELL_ACTIVE_SCHRITT = 0.14;

/**
 * Dunkel: der Grundton selbst wird um diesen Betrag aufgehellt, weil die Richtung sich umkehrt —
 * ein Button, der im hellen Modus durch Verdunkeln "gedrückt" wirkt, braucht im dunklen Modus vor
 * dem fast schwarzen Hintergrund die gegenteilige Bewegung, um überhaupt als Fläche lesbar zu sein.
 */
export const DUNKEL_GRUNDTON_SCHRITT = 0.16;

/** Dunkel: hover und link-hover hellen vom Grundton aus jeweils um diesen Betrag weiter auf
 *  (link-hover zwei solcher Schritte). Ein einziger Schrittwert für die aufhellende Seite der
 *  dunklen Rampe, statt mehrerer verschiedener. */
export const DUNKEL_SCHRITT = 0.06;

/**
 * Dunkel: 'active' tritt vom Grundton aus zurück — dunkler, nicht heller wie hover. Das ist die
 * Umkehr gegenüber der ersten Fassung dieser Ableitung: dort hellte active im dunklen Modus
 * weiter auf als hover, was dem gängigen "gedrückt wirkt dunkler"-Verständnis widerspricht und
 * zusätzlich Farbkraft kostete (Chroma musste bei der sehr viel höheren Helligkeit stark
 * zurückgenommen werden). Ein Schritt zurück in Richtung Grundton braucht dagegen kaum
 * Chroma-Reduktion, weil er sich von einem Punkt entfernt, an dem noch reichlich Gamut-Raum ist.
 * Der Betrag liegt über dem Hover-Schritt (0,06) — der Unterschied zwischen "gedrückt" und
 * "Maus drüber" soll deutlich bleiben — aber unter dem hellen Active-Schritt (0,14), weil der
 * dunkle Grundton bereits angehoben ist und dieselbe Distanz ihn zu nah an Schwarz drücken würde.
 */
export const DUNKEL_ACTIVE_SCHRITT = 0.10;

/**
 * Wählt die Beschriftungsfarbe für EINE Fläche — für jede gefüllte Fläche einzeln aufzurufen
 * (button-primary, button-danger, layer-accent, …), nicht einmal global. Eine Fläche, die sich
 * nicht mit der Marke ändert (button-danger, layer-accent), bekommt trotzdem eine ABGELEITETE
 * Beschriftung, keinen fest hingeschriebenen Wert — falls sich diese Fläche selbst einmal
 * ändert (anderes Theme, andere Statusfarbe), stimmt die Beschriftung dann automatisch weiter.
 *
 * Zwei feste Kandidaten — ein naher-schwarzer und ein weißer — treten gegeneinander an; es
 * gewinnt der mit dem höheren Kontrastverhältnis gegen die Fläche. Das ist bewusst KEIN fester
 * Wert je Modus: welcher Kandidat gewinnt, hängt von der Fläche ab (eine sehr helle Marke
 * verlangt auch im hellen Modus dunkle Beschriftung auf button-primary), und ein fest
 * hingeschriebener Wert wäre beim nächsten Markenton, oder in einem anderen Theme, wieder falsch.
 */
export function beschriftungAbleiten(flaecheHex, { dunklerKandidat, hellerKandidat }) {
  const kontrastDunkel = ratio(dunklerKandidat, flaecheHex);
  const kontrastHell = ratio(hellerKandidat, flaecheHex);
  return kontrastDunkel >= kontrastHell
    ? { hex: dunklerKandidat.toUpperCase(), verhaeltnis: kontrastDunkel, kandidat: 'dunkel' }
    : { hex: hellerKandidat.toUpperCase(), verhaeltnis: kontrastHell, kandidat: 'hell' };
}

/**
 * Berechnet die Marken-Primitives für beide Modi aus einer Grundfarbe.
 *
 * `kandidaten` sind die zwei Werte, zwischen denen beschriftungAbleiten() für die Beschriftung
 * von button-primary (text-on-brand/icon-on-brand) entscheidet — { dunklerKandidat,
 * hellerKandidat }, beide als Hex. Die Regel verlangt ausdrücklich, dass das die Werte sind, die
 * tokens.json bereits führt (heute: tokens.light['text-primary'] und '#FFFFFF'); dieses Modul
 * liest tokens.json selbst nicht, deshalb übergibt der Aufrufer sie. Für andere Flächen
 * (button-danger, layer-accent) ruft der Aufrufer beschriftungAbleiten() selbst auf — die
 * hängen nicht an der Marke, gehören deshalb nicht in diese Funktion.
 *
 * Rückgabeform: { light: {…}, dark: {…} }, je mit den Schlüsseln
 * brand-primary, brand-primary-hover, brand-primary-active, brand-link, brand-link-hover,
 * brand-text-on-brand. Die ersten fünf sind { hex, reduziert, geklemmt, kollabiert }:
 *   - reduziert: die Chroma wurde gesenkt, um diese Stufe in sRGB darstellen zu können — normal
 *     und informativ, kein Fehler (siehe oklchZuHex()).
 *   - geklemmt: echter Fehlerfall — selbst vollständig entsättigt liegt die Stufe außerhalb des
 *     Gamuts (nur möglich, wenn L selbst außerhalb 0…1 liegt). Sollte in der Praxis nicht
 *     vorkommen; wenn doch, ist das ein Fehler in der Ableitung und muss auffallen.
 *   - kollabiert: dieser Wert ist (als Hex) identisch mit mindestens einem anderen Wert
 *     DERSELBEN Rampe (light oder dark), UND mindestens einer der beiden wurde reduziert oder
 *     geklemmt — die Rampe hat an dieser Stelle ihre Abstufung verloren. Das wird eigenständig
 *     markiert, weil es schwerer wiegt als eine einzelne Chroma-Reduktion: zwei Stufen, die sich
 *     nicht mehr unterscheiden, sind für die Ableitung nicht mehr nutzbar, auch wenn jede für
 *     sich genommen ein gültiger, im Gamut liegender Hexwert ist.
 * `brand-text-on-brand` ist { hex, verhaeltnis, kandidat } — siehe beschriftungAbleiten().
 *
 * Link-Regel: im hellen Modus folgt der Link exakt der Marke (link = primary, link-hover = hover
 * — wie im heutigen Bestand). Im dunklen Modus liegt der Link eine Stufe über dem Button: er
 * teilt sich den hover-Ton, und link-hover geht einen Schritt weiter als der Button-hover — der
 * Link hellt im Dunkeln also durchgehend auf, unabhängig davon, dass 'active' das nicht mehr tut.
 */
export function markenRampe(grundfarbeHex, kandidaten) {
  const { L, C, H } = hexZuOklch(grundfarbeHex);
  const bei = (l) => oklchZuHex({ L: l, C, H });

  const hellPrimary = { hex: grundfarbeHex.toUpperCase(), reduziert: false, geklemmt: false };
  const hellHover = bei(L - HELL_HOVER_SCHRITT);
  const hellActive = bei(L - HELL_ACTIVE_SCHRITT);

  const dunkelBasis = L + DUNKEL_GRUNDTON_SCHRITT;
  const dunkelPrimary = bei(dunkelBasis);
  const dunkelHover = bei(dunkelBasis + DUNKEL_SCHRITT);
  const dunkelActive = bei(dunkelBasis - DUNKEL_ACTIVE_SCHRITT);
  const dunkelLink = dunkelHover;
  const dunkelLinkHover = bei(dunkelBasis + 2 * DUNKEL_SCHRITT);

  const light = mitKollisionen({
    // Im hellen Modus ist brand-link IMMER = brand-primary und brand-link-hover IMMER =
    // brand-primary-hover — das ist die Link-Regel selbst (siehe oben), keine Kollision, die
    // beim Klemmen entstanden wäre. Deshalb von der Kollisionsprüfung ausgenommen.
    'brand-primary': hellPrimary,
    'brand-primary-hover': hellHover,
    'brand-primary-active': hellActive,
    'brand-link': hellPrimary,
    'brand-link-hover': hellHover,
  }, [['brand-primary', 'brand-link'], ['brand-primary-hover', 'brand-link-hover']]);

  const dark = mitKollisionen({
    // Im dunklen Modus ist brand-link IMMER = brand-primary-hover (die Link-Regel: "eine Stufe
    // heller als der Button") — ebenfalls Design, keine Kollision.
    'brand-primary': dunkelPrimary,
    'brand-primary-hover': dunkelHover,
    'brand-primary-active': dunkelActive,
    'brand-link': dunkelLink,
    'brand-link-hover': dunkelLinkHover,
  }, [['brand-primary-hover', 'brand-link']]);

  // Die Beschriftung gehört nicht zur Chroma-Gamut-Maschinerie von mitKollisionen() (sie ist eine
  // Wahl zwischen zwei festen Kandidaten, kein reduzierter/geklemmter Farbpunkt) — deshalb erst
  // danach ergänzt, gegen die jeweils schon fertige (ggf. reduzierte) Fläche des Modus.
  light['brand-text-on-brand'] = beschriftungAbleiten(light['brand-primary'].hex, kandidaten);
  dark['brand-text-on-brand'] = beschriftungAbleiten(dark['brand-primary'].hex, kandidaten);

  return { light, dark };
}

/**
 * Markiert jeden Eintrag einer Rampe mit `kollabiert`, wenn sein Hex mit dem eines anderen
 * Eintrags DERSELBEN Rampe übereinstimmt UND mindestens einer der beiden reduziert oder
 * geklemmt wurde — reiner Zufall bei zwei eigentlich verschiedenen, aber beide unverändert im
 * Gamut liegenden Werten wäre keine Kollision, sondern nur eine sehr feine Rundung.
 *
 * `designGleich` nennt die Paare, die per Konstruktion immer denselben Wert tragen (die
 * Link-Regel) — die sind KEINE Kollision, egal was mit ihnen passiert ist, und werden deshalb
 * von der Prüfung ausgenommen. Ohne diese Ausnahme würde z. B. brand-link im dunklen Modus
 * jedes Mal fälschlich als "kollabiert" gemeldet, wenn brand-primary-hover reduziert wird —
 * nicht weil die Rampe ihre Abstufung verloren hätte, sondern weil beide von Anfang an denselben
 * Ton tragen sollen.
 */
function mitKollisionen(eintraege, designGleich) {
  const namen = Object.keys(eintraege);
  const istDesignGleich = (a, b) => designGleich.some(
    ([x, y]) => (x === a && y === b) || (x === b && y === a));
  const veraendert = (eintrag) => eintrag.reduziert || eintrag.geklemmt;
  const ergebnis = {};
  for (const name of namen) {
    const eigener = eintraege[name];
    const kollabiert = namen.some((anderer) => anderer !== name
      && !istDesignGleich(name, anderer)
      && eintraege[anderer].hex === eigener.hex
      && (veraendert(eigener) || veraendert(eintraege[anderer])));
    ergebnis[name] = { ...eigener, kollabiert };
  }
  return ergebnis;
}

/** Reduziert eine Rampe (mit Diagnose-Feldern) auf die reinen Hexwerte — für alles, was nur den
 *  darstellbaren Farbwert braucht, nicht seine Herkunft. */
export function nurHex(rampeModus) {
  return Object.fromEntries(Object.entries(rampeModus).map(([name, eintrag]) => [name, eintrag.hex]));
}

/**
 * Trägt eine Marken-Rampe in die Tokens EINES Modus ein — als neues Objekt, das gegebene bleibt
 * unverändert. Jedes Token, das heute an der Marke hängt, wird ersetzt; welche das sind, ist in
 * dieser Liste sichtbar gehalten, statt über den Aufrufer verstreut zu sein.
 *
 * text-on-brand und icon-on-brand bekommen denselben abgeleiteten Wert (brand-text-on-brand) —
 * beide sind Beschriftung auf derselben Fläche (button-primary/-hover/-active, die die Marke
 * teilen), dieselbe Kontrastfrage gilt für beide. Andere Flächen (button-danger, layer-accent)
 * bekommen ihre Beschriftung NICHT hier, sondern über einen eigenen Aufruf von
 * beschriftungAbleiten() beim Aufrufer — sie hängen nicht an der Marke.
 *
 * text-on-color/icon-on-color werden HIER ebenfalls auf denselben Wert gesetzt — nicht, weil sie
 * noch in REQUIREMENTS vorkämen (tun sie seit Korrekturrunde 5 nicht mehr), sondern weil die
 * echte tlReactControls.css an einigen wenigen, keiner der drei neuen Rollen eindeutig
 * zuzuordnenden Stellen ausschließlich diese beiden liest (siehe index.html, Kommentar über der
 * Zielzustand-Bindung, und task-7-brand-report.md). Ohne diese Zeile bliebe --text-on-color beim
 * statischen Wert aus tokens.json stehen, während der Rest der Bühne dem Regler folgt — genau
 * das Auseinanderlaufen, das in Korrekturrunde 6 aufgefallen ist.
 */
export function rampeAnwenden(tokens, rampeModus) {
  const { 'brand-primary': primary, 'brand-primary-hover': hover, 'brand-primary-active': active,
    'brand-link': link, 'brand-link-hover': linkHover, 'brand-text-on-brand': beschriftung }
    = nurHex(rampeModus);

  return {
    ...tokens,
    'button-primary': primary,
    'button-secondary': primary,
    'border-interactive': primary,
    focus: primary,
    interactive: primary,
    'button-primary-hover': hover,
    'button-secondary-hover': hover,
    'button-primary-active': active,
    'button-secondary-active': active,
    'link-primary': link,
    'link-primary-hover': linkHover,
    'text-on-brand': beschriftung,
    'icon-on-brand': beschriftung,
    'text-on-color': beschriftung,
    'icon-on-color': beschriftung,
  };
}

/**
 * Abstand zweier Farben im Farbton, in Grad (0 bis 180).
 *
 * Für getönte Flächen ist das WCAG-Kontrastverhältnis das falsche Maß: Es
 * misst Helligkeit. Zwei Flächen gleicher Helligkeit erreichen immer rund
 * 1,0 — auch wenn die eine blau und die andere orange ist. Ob zwei Tönungen
 * als verschieden gelesen werden, entscheidet der Farbton.
 */
export function farbtonAbstand(hexA, hexB) {
  const a = hexZuOklch(hexA), b = hexZuOklch(hexB);
  const grad = ((a.H - b.H) * 180) / Math.PI;
  return Math.abs(((grad % 360) + 540) % 360 - 180);
}

/** Ab diesem Farbtonabstand lesen sich zwei getönte Flächen als verschieden. */
export const FARBTON_ABSTAND_MIN = 30;
