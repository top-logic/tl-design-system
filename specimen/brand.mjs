/**
 * Leitet die Marken-Primitives (Button und Link, beide Modi) aus einer einzigen Grundfarbe ab.
 *
 * Gerechnet wird in OKLCH, nicht in HSL. HSL-Rampen sind perzeptuell ungleichmäßig: derselbe
 * Schritt in L (HSL) macht Gelb kaum dunkler und Blau stark dunkler, weil HSL keine
 * Wahrnehmungsgleichheit kennt. OKLCH ist so konstruiert, dass ein Schritt in L über alle Farbtöne
 * ungefähr gleich stark wahrgenommen wird — die Rampen von Rot, Grün und Blau werden damit
 * vergleichbar. Die Umrechnung sRGB ↔ lineares RGB ↔ OKLab ↔ OKLCH ist geschlossene Mathematik
 * (Björn Ottossons Matrizen für OKLab) und zieht keine Abhängigkeit nach sich.
 */

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

/**
 * OKLab → sRGB, mit Diagnose. Liefert zusätzlich `geklemmt`: true, wenn mindestens einer der
 * drei LINEAREN Kanäle vor der Begrenzung außerhalb von 0…1 lag — also außerhalb dessen, was ein
 * Bildschirm in sRGB überhaupt darstellen kann. Diese Information entsteht ohnehin an dieser
 * Stelle; sie wird hier nur nicht mehr weggeworfen (siehe markenRampe()).
 */
function oklabZuRgb({ L, a, b }) {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;

  const lr = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const lb = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  const inGamut = (kanal) => kanal >= 0 && kanal <= 1;

  return {
    r: linearKanalZuSrgb(lr),
    g: linearKanalZuSrgb(lg),
    b: linearKanalZuSrgb(lb),
    geklemmt: !(inGamut(lr) && inGamut(lg) && inGamut(lb)),
  };
}

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
 * OKLCH zu Hexwert, mit Diagnose statt stillem Verlust.
 *
 * Kanäle werden beim Zurückrechnen nach sRGB auf 0–255 begrenzt (Clipping, keine
 * Gamut-Anpassung von C/H). Das ist NICHT unauffällig: bei einer sehr hellen oder stark
 * gesättigten Grundfarbe kann eine einzelne Stufe schon den Farbraum verlassen, und mehrere
 * Stufen einer Rampe können dabei auf denselben geklemmten Hexwert (typischerweise Weiß)
 * zusammenfallen — die Rampe verliert dann lautlos ihre Abstufung, obwohl L, C und H der
 * Eingabe nach wie vor fünf verschiedene Punkte beschreiben. Deshalb liefert diese Funktion
 * `geklemmt` mit zurück, statt es zu verschweigen; markenRampe() macht daraus die Anzeige.
 */
export function oklchZuHex(oklch) {
  const { r, g, b, geklemmt } = oklabZuRgb(oklchZuOklab(oklch));
  return { hex: rgbZuHex({ r, g, b }), geklemmt };
}

// ---------------------------------------------------------------------------------------------
// Die Schrittweiten der Ableitung — an einer Stelle, benannt, mit Begründung.
//
// Alle Schritte bewegen ausschließlich L (Helligkeit in OKLCH); C (Sättigung) und H (Farbton)
// bleiben über die ganze Rampe erhalten. Das hält die Rampe an EINEM Farbton entlang einer
// Helligkeitslinie, statt nebenbei den Ton zu verschieben — genau das Problem, das HSL hat.
//
// Kalibriert gegen den heutigen Startwert #2968C8: mit diesen Werten ergeben sich exakt die
// heute geltenden Gate-Zahlen (hell 1 Verstoß, dunkel 7 Verstöße). Das ist kein Zufall, sondern
// die Leitplanke, an der die Schrittweiten gewählt wurden — sie sind trotzdem nur ein Vorschlag,
// keine Festlegung.
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

/** Dunkel: jeder weitere Schritt (hover, dann active, dann die beiden Link-Stufen) hellt um
 *  denselben Betrag weiter auf. Ein einziger Schrittwert für die ganze dunkle Rampe, statt vier
 *  verschiedener — die Rampe bleibt dadurch gleichmäßig, wie im hellen Modus auch. */
export const DUNKEL_SCHRITT = 0.06;

/**
 * Berechnet die fünf Marken-Primitives für beide Modi aus einer Grundfarbe.
 *
 * Rückgabeform: { light: {…}, dark: {…} }, je mit den Schlüsseln
 * brand-primary, brand-primary-hover, brand-primary-active, brand-link, brand-link-hover.
 * Jeder Eintrag ist { hex, geklemmt, kollabiert }:
 *   - geklemmt: dieser einzelne Wert lag beim Rückweg nach sRGB außerhalb des Gamuts.
 *   - kollabiert: dieser Wert ist (als Hex) identisch mit mindestens einem anderen Wert
 *     DERSELBEN Rampe (light oder dark) — die Rampe hat an dieser Stelle ihre Abstufung
 *     verloren. Das wird eigenständig markiert, weil es schwerer wiegt als einzelnes Klemmen:
 *     zwei Stufen, die sich nicht mehr unterscheiden, sind für die Ableitung nicht mehr nutzbar,
 *     auch wenn jede für sich genommen ein gültiger Hexwert ist.
 *
 * Link-Regel: im hellen Modus folgt der Link exakt der Marke (link = primary, link-hover = hover
 * — wie im heutigen Bestand). Im dunklen Modus liegt der Link eine Stufe über dem Button: er
 * teilt sich den hover-Ton, und link-hover geht einen Schritt weiter als der Button-hover.
 */
export function markenRampe(grundfarbeHex) {
  const { L, C, H } = hexZuOklch(grundfarbeHex);
  const bei = (l) => oklchZuHex({ L: l, C, H });

  const hellPrimary = { hex: grundfarbeHex.toUpperCase(), geklemmt: false };
  const hellHover = bei(L - HELL_HOVER_SCHRITT);
  const hellActive = bei(L - HELL_ACTIVE_SCHRITT);

  const dunkelBasis = L + DUNKEL_GRUNDTON_SCHRITT;
  const dunkelPrimary = bei(dunkelBasis);
  const dunkelHover = bei(dunkelBasis + DUNKEL_SCHRITT);
  const dunkelActive = bei(dunkelBasis + 2 * DUNKEL_SCHRITT);
  const dunkelLink = dunkelHover;
  const dunkelLinkHover = bei(dunkelBasis + 3 * DUNKEL_SCHRITT);

  return {
    // Im hellen Modus ist brand-link IMMER = brand-primary und brand-link-hover IMMER =
    // brand-primary-hover — das ist die Link-Regel selbst (siehe oben), keine Kollision, die
    // beim Klemmen entstanden wäre. Deshalb von der Kollisionsprüfung ausgenommen.
    light: mitKollisionen({
      'brand-primary': hellPrimary,
      'brand-primary-hover': hellHover,
      'brand-primary-active': hellActive,
      'brand-link': hellPrimary,
      'brand-link-hover': hellHover,
    }, [['brand-primary', 'brand-link'], ['brand-primary-hover', 'brand-link-hover']]),
    // Im dunklen Modus ist brand-link IMMER = brand-primary-hover (die Link-Regel: "eine Stufe
    // heller als der Button") — ebenfalls Design, keine Kollision.
    dark: mitKollisionen({
      'brand-primary': dunkelPrimary,
      'brand-primary-hover': dunkelHover,
      'brand-primary-active': dunkelActive,
      'brand-link': dunkelLink,
      'brand-link-hover': dunkelLinkHover,
    }, [['brand-primary-hover', 'brand-link']]),
  };
}

/**
 * Markiert jeden Eintrag einer Rampe mit `kollabiert`, wenn sein Hex mit dem eines anderen
 * Eintrags DERSELBEN Rampe übereinstimmt UND mindestens einer der beiden geklemmt ist.
 *
 * `designGleich` nennt die Paare, die per Konstruktion immer denselben Wert tragen (die
 * Link-Regel) — die sind KEINE Kollision, egal ob geklemmt oder nicht, und werden deshalb von
 * der Prüfung ausgenommen. Ohne diese Ausnahme würde z. B. brand-link im dunklen Modus jedes
 * Mal fälschlich als "kollabiert" gemeldet, wenn brand-primary-hover geklemmt ist — nicht weil
 * die Rampe ihre Abstufung verloren hätte, sondern weil beide von Anfang an denselben Ton
 * tragen sollen.
 */
function mitKollisionen(eintraege, designGleich) {
  const namen = Object.keys(eintraege);
  const istDesignGleich = (a, b) => designGleich.some(
    ([x, y]) => (x === a && y === b) || (x === b && y === a));
  const ergebnis = {};
  for (const name of namen) {
    const eigener = eintraege[name];
    const kollabiert = namen.some((anderer) => anderer !== name
      && !istDesignGleich(name, anderer)
      && eintraege[anderer].hex === eigener.hex
      && (eigener.geklemmt || eintraege[anderer].geklemmt));
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
 */
export function rampeAnwenden(tokens, rampeModus) {
  const { 'brand-primary': primary, 'brand-primary-hover': hover, 'brand-primary-active': active,
    'brand-link': link, 'brand-link-hover': linkHover } = nurHex(rampeModus);

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
  };
}
