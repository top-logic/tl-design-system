// Erzeugt dist/ aus src/. Was hier nicht herauskommt, gibt es im Design System nicht.
import { resolve, primitives } from './resolve.mjs';
import { dtcg } from './dtcg.mjs';

const REF = /^\{([a-z0-9-]+)\}$/;
const line = (n, v) => `  --tl-${n}: ${v};`;
const asVar = (v) => { const m = REF.exec(String(v)); return m ? `var(--tl-${m[1]})` : v; };
const block = (o) => Object.entries(o).filter(([k]) => !k.startsWith('_')).map(([n, v]) => line(n, asVar(v))).join('\n');
const HEAD = `/* Erzeugt aus src/ mit tools/generate.mjs. Nicht von Hand ändern.
   Begründung zu jedem Wert: docs/skalen.md */\n\n`;

function primitivesCss(P) {
  return `${HEAD}/* Schicht 1: Primitive. Reine Werte ohne Bedeutung — die Stelle, an der ein
   Kundenprojekt eingreift. Wer hier einen Wert überschreibt, ändert jede Rolle mit. */
:root {
${block(primitives(P))}
}
`;
}

function tokensCss(P, T, R) {
  const derived = (mode) => Object.entries(R.derived[mode]).map(([n, v]) => line(n, v)).join('\n');
  return `${HEAD}/* Schicht 2: Rollen. Jede verweist auf eine Primitive, keine trägt einen Wert.
   Ausnahme: Beschriftungen auf Flächen (--tl-text-on-*, --tl-icon-on-*) sind gerechnet. */
:root,
[data-tl-mode="light"] {
  color-scheme: light;
${block(T.measure)}
${block(T.layer)}

${block(T.color.light)}
${derived('light')}

${block(T.effect.light)}

${block(T.density.normal)}
}

[data-tl-mode="dark"] {
  color-scheme: dark;
${block(T.color.dark)}
${derived('dark')}

${block(T.effect.dark)}
}

[data-tl-density="compact"] {
${block(T.density.compact)}
}
`;
}

function baseCss(T) {
  const type = Object.entries(T.type).filter(([k]) => !k.startsWith('_')).map(([n, k]) => `.tl-type-${n} {
  font-family: var(--tl-font-family-${k.family});
  font-size: var(--tl-font-size-${k.size});
  font-weight: ${k.weight};
  line-height: ${k.lineHeight};
  letter-spacing: ${k.tracking};
}`).join('\n\n');
  const print = Object.entries(T.print).map(([n, k]) => `  .tl-print-${n} {
    font-size: ${k.size};
    font-weight: ${k.weight};
    line-height: ${k.lineHeight};
  }`).join('\n');
  return `${HEAD}/* Grundklassen. Jede liest nur Variablen. */
html {
  -webkit-text-size-adjust: 100%;
}

body {
  margin: 0;
  background: var(--tl-surface-base);
  color: var(--tl-text-primary);
  font-family: var(--tl-font-family-sans);
}

*, *::before, *::after {
  box-sizing: border-box;
}

/* Typografie: eine Größe ist keine Klasse. Die Klasse legt alles fest. */
${type}

/* Zahlen in Spalten fluchten nur mit tabellarischen Ziffern. Pflicht, nicht Option. */
.tl-nums {
  font-feature-settings: "tnum" 1, "zero" 1;
  font-variant-numeric: tabular-nums slashed-zero;
}

/* Der Ring gehört der Tastatur. Ein Mechanismus, außen, nur beim Tastaturfokus. */
:where(a, button, input, select, textarea, summary, [tabindex], [contenteditable]):focus-visible {
  outline: var(--tl-focus-width) solid var(--tl-focus-ring);
  outline-offset: var(--tl-focus-offset);
}

/* Wer Bewegung abbestellt hat, hat sie abbestellt. 0.01ms statt 0, sonst feuert transitionend nie. */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Druck: rem hat im Druck keine Wurzel. Eigene Leiter in pt. */
@media print {
${print}
  .tl-print-title, .tl-print-heading, .tl-print-body, .tl-print-caption {
    font-variant-numeric: tabular-nums;
  }
}
`;
}

export function generate(P, T) {
  const R = resolve(P, T);
  return { 'primitives.css': primitivesCss(P), 'tokens.css': tokensCss(P, T, R), 'base.css': baseCss(T) };
}

if (typeof process !== 'undefined' && import.meta.url === `file://${process.argv[1]}`) {
  const { readFileSync, writeFileSync, mkdirSync } = await import('node:fs');
  const P = JSON.parse(readFileSync(new URL('../src/primitives.json', import.meta.url)));
  const T = JSON.parse(readFileSync(new URL('../src/tokens.json', import.meta.url)));
  const dist = new URL('../dist/', import.meta.url);
  mkdirSync(dist, { recursive: true });
  for (const [name, text] of Object.entries(generate(P, T))) {
    writeFileSync(new URL(name, dist), text);
    console.log(`geschrieben: dist/${name}`);
  }
  writeFileSync(new URL('tokens.dtcg.json', dist), JSON.stringify(dtcg(P, T), null, 2) + '\n');
  console.log('geschrieben: dist/tokens.dtcg.json');
}
