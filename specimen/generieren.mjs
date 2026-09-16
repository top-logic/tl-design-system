// Erzeugt aus skala.json das CSS, das TopLogic ausliefert.
//
// Der Generator ist die Leitplanke: Was hier nicht herauskommt, gibt es im
// Design System nicht. Deshalb steht jede Farbe als Custom Property und jede
// Schriftgröße hinter einer Klasse — ein Literal im Stylesheet hat danach
// keine Rechtfertigung mehr.

const zeile = (name, wert) => `  --${name}: ${wert};`;
const REFERENZ = /^\{([a-z0-9-]+)\}$/;

/**
 * Löst Referenzen auf die Primitiv-Schicht zu ihren Werten auf.
 *
 * Gebraucht wird das zum Rechnen — Kontraste und Farbabstände brauchen echte
 * Werte. Das erzeugte CSS löst dagegen bewusst *nicht* auf: Dort bleibt die
 * Referenz als var() stehen, damit ein Kundenprojekt ein Primitiv
 * überschreiben kann und jede Rolle mitzieht.
 */
export function aufloesen(skala) {
  const primitive = { ...skala.primitiv.farbe, ...skala.primitiv.mass };
  const gehen = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => {
    if (v && typeof v === 'object') return [k, gehen(v)];
    const treffer = REFERENZ.exec(String(v));
    if (!treffer) return [k, v];
    if (!(treffer[1] in primitive)) throw new Error(`unbekanntes Primitiv: ${treffer[1]}`);
    return [k, primitive[treffer[1]]];
  }));
  return { ...skala, farbe: gehen(skala.farbe), mass: gehen(skala.mass) };
}

/** Im CSS bleibt die Referenz eine Referenz. */
const alsVar = (wert) => {
  const treffer = REFERENZ.exec(String(wert));
  return treffer ? `var(--${treffer[1]})` : wert;
};

function farbblock(farben) {
  return Object.entries(farben).map(([n, w]) => zeile(n, alsVar(w))).join('\n');
}

function massblock(mass, familie, motion) {
  const z = [];
  for (const [n, w] of Object.entries(mass['font-size'])) z.push(zeile(`font-size-${n}`, alsVar(w)));
  for (const [n, w] of Object.entries(mass['line-height-px'])) z.push(zeile(`line-height-${n}`, alsVar(w)));
  for (const [n, w] of Object.entries(mass.space)) z.push(zeile(n, alsVar(w)));
  for (const [n, w] of Object.entries(mass.radius)) z.push(zeile(`radius-${n}`, alsVar(w)));
  for (const [n, w] of Object.entries(mass['icon-size'])) z.push(zeile(`icon-size-${n}`, alsVar(w)));
  for (const [n, w] of Object.entries(mass['border-width'])) z.push(zeile(`border-width-${n}`, alsVar(w)));
  z.push(zeile('accent-bar', alsVar(mass['accent-bar'])));
  z.push(zeile('focus-width', alsVar(mass.focus.breite)));
  z.push(zeile('focus-offset', alsVar(mass.focus.offset)));
  for (const [n, w] of Object.entries(familie)) z.push(zeile(`font-family-${n}`, w));
  for (const [n, w] of Object.entries(motion.duration)) z.push(zeile(`duration-${n}`, w));
  for (const [n, w] of Object.entries(motion.easing)) z.push(zeile(`easing-${n}`, w));
  return z.join('\n');
}

function dichteblock(hoehen, polsterung) {
  return [
    zeile('control-height', alsVar(hoehen.control)),
    zeile('control-height-sm', alsVar(hoehen['control-sm'])),
    zeile('row-height', alsVar(hoehen.row)),
    zeile('padding-x', polsterung.x),
    zeile('padding-y', polsterung.y),
    zeile('gap', polsterung.gap),
  ].join('\n');
}

function typoklassen(typo) {
  return Object.entries(typo).map(([name, k]) => `.${name} {
  font-family: var(--font-family-${k.familie});
  font-size: var(--font-size-${k.groesse});
  font-weight: ${k.gewicht};
  line-height: ${k.zeilenhoehe};
  letter-spacing: ${k.laufweite};
}`).join('\n\n');
}

function schattenblock(schatten) {
  return Object.entries(schatten).map(([n, w]) => zeile(`shadow-${n}`, w)).join('\n');
}

function primitivblock(primitiv) {
  return [...Object.entries(primitiv.farbe), ...Object.entries(primitiv.mass)]
    .map(([n, w]) => zeile(n, w)).join('\n');
}

export function cssErzeugen(skala) {
  const { farbe, mass, familie, typo, motion, schatten, zahlen, primitiv } = skala;
  return `/* Erzeugt aus skala.json. Nicht von Hand ändern — Werte und Begründung
   stehen in docs/skalen.md, erzeugt wird mit specimen/generieren.mjs. */

/* Schicht 1: Primitive. Reine Werte ohne Bedeutung — und die Stelle, an der
   ein Kundenprojekt eingreift. Wer hier einen Wert überschreibt, ändert jede
   Rolle mit, die darauf verweist, ohne eine einzige Klasse anzufassen. */
:root {
${primitivblock(primitiv)}
}

/* Schicht 2: Rollen. Jede verweist auf ein Primitiv, keine trägt einen Wert. */
:root {
${massblock(mass, familie, motion)}

${farbblock(farbe.hell)}

${schattenblock(schatten.hell)}

${dichteblock(mass['control-height'].standard, mass['dichte-polsterung'].standard)}
}

[data-modus="dunkel"] {
${farbblock(farbe.dunkel)}

${schattenblock(schatten.dunkel)}
}

[data-dichte="kompakt"] {
${dichteblock(mass['control-height'].kompakt, mass['dichte-polsterung'].kompakt)}
}

/* Klassen */

${typoklassen(typo)}

/* Zahlen in Spalten fluchten nur mit tabellarischen Ziffern. Pflicht, nicht Option. */
.tabellenzahl {
  font-feature-settings: ${zahlen['font-feature-settings']};
  font-variant-numeric: tabular-nums slashed-zero;
}

/* Der Ring gehört der Tastatur. Wer klickt, weiß, wo er ist. */
:where(a, button, input, select, textarea, summary, [tabindex]):focus-visible {
  outline: var(--focus-width) solid var(--focus);
  outline-offset: var(--focus-offset);
}

/* Wer Bewegung abbestellt hat, hat sie abbestellt — auch in Komponenten, die
   es später gibt. 0.01ms statt 0, sonst feuert transitionend nie. */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
`;
}

// Direkt aufgerufen schreibt der Generator die Datei: node generieren.mjs
if (import.meta.url === `file://${process.argv[1]}`) {
  const { readFileSync, writeFileSync } = await import('node:fs');
  const skala = JSON.parse(readFileSync(new URL('./skala.json', import.meta.url)));
  const ziel = new URL('./skala.css', import.meta.url);
  writeFileSync(ziel, cssErzeugen(skala));
  console.log(`geschrieben: ${ziel.pathname}`);
}
