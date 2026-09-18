// Die Ratsche über dem Altbestand: zählt, was im alten tlReactControls.css an
// Literalen steckt (Farben, Schriftgrößen, Zeitangaben, z-index, outline: none).
//
// Das frühere Abbildungswerkzeug (ein hand-geschriebener Regex-Parser, der Werte
// gruppiert nach px auszählte) ist nach dem Schnitt vom 17.09. exportiert und
// abgeschnitten — siehe docs/migration/altlast.md. Was die Ratsche hier braucht,
// bleibt: measure() auf Basis von declarations() aus ./lib/css.mjs, plus eine CLI,
// die das Ergebnis als JSON ausgibt.
//
// Aufruf: node inventory.mjs [pfad-zum-css]

import { declarations } from './lib/css.mjs';
import { knownVariables } from './lint-css.mjs';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

/** Der Namensraum des Design Systems: jede Custom Property, die mit `--tl` beginnt. */
const TL_NAME = /--tl[A-Za-z0-9-]*/g;

/**
 * Custom Properties im Namensraum `--tl`, die im Altbestand vorkommen — definiert oder
 * gelesen, ungefiltert. Lesen ist erlaubt (siehe `foreignOf`); erst gefiltert gegen die
 * bekannten Paket-Tokens ist das Ergebnis `foreignTl` aus test/ratchet.json.
 */
export function foreignTlNames(css) {
  return uniq(css.replace(/\/\*[\s\S]*?\*\//g, '').match(TL_NAME) ?? []);
}

/** Dasselbe für die TSX-Quellen: jeder String-Literal mit `--tl` zählt. */
export function foreignTlInSources(dir) {
  const names = [];
  for (const file of walk(dir, /\.(tsx?|css)$/)) names.push(...(readFileSync(file, 'utf8').match(TL_NAME) ?? []));
  return uniq(names);
}

/**
 * Lesen ist erlaubt — dafür sind Tokens da; fremd ist nur, was der Altbestand selbst im
 * Namensraum definiert oder was kein Paket-Token ist. `known` kommt aus `knownVariables()`
 * (tools/lint-css.mjs) über die erzeugten Dateien des Pakets.
 */
export function foreignOf(names, known) {
  return uniq(names.filter((n) => !known.has(n)));
}

function* walk(dir, re) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (name === 'node_modules') continue;
    if (statSync(p).isDirectory()) yield* walk(p, re);
    else if (re.test(name)) yield p;
  }
}

const uniq = (xs) => [...new Set(xs)].sort();

/** Was die Ratsche zählt. Nur sinkend erlaubt. */
export function measure(css) {
  const lines = css.split('\n').length;
  const decls = declarations(css);
  const lit = (prop, re) => decls.filter((d) => d.property === prop && re.test(d.value.replace(/var\([^)]*\)/g, ''))).length;
  return {
    lines,
    literals: {
      color: (css.replace(/\/\*[\s\S]*?\*\//g, '').match(/#[0-9a-fA-F]{3,8}\b|\brgba?\(/g) ?? []).length,
      fontSize: lit('font-size', /\d/),
      duration: decls.filter((d) => /^(transition|animation)/.test(d.property) && /\d+m?s/.test(d.value)).length,
      zIndex: lit('z-index', /\d/),
      outlineNone: decls.filter((d) => d.property === 'outline' && /none/.test(d.value)).length,
    },
  };
}

// ---------------------------------------------------------------------------
// Aufruf von der Kommandozeile: node inventory.mjs [pfad]
// ---------------------------------------------------------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
  const { homedir } = await import('node:os');

  const pfad = process.argv[2] ?? join(
    process.env.TL_WORKTREE ?? join(homedir(), 'git/tl8-wt-29584'),
    'com.top_logic.layout.react/src/main/webapp/style/tlReactControls.css',
  );
  const css = readFileSync(pfad, 'utf8');
  const sources = join(pfad, '../../../../../react-src');
  const dist = new URL('../dist/', import.meta.url);
  const known = knownVariables(
    readFileSync(new URL('primitives.css', dist), 'utf8')
    + readFileSync(new URL('tokens.css', dist), 'utf8')
    + readFileSync(new URL('base.css', dist), 'utf8'),
  );
  const alle = [...foreignTlNames(css), ...foreignTlInSources(sources)];
  console.log(JSON.stringify({ ...measure(css), foreignTl: foreignOf(alle, known) }, null, 2));
}
