// Das Klassen-Gate. Jede Regel aus docs/skalen.md, die ein Stylesheet brechen kann.
import { declarations } from './lib/css.mjs';

const ALLOWED = new Set(['0', '1', 'auto', 'none', '100%', 'currentColor', 'inherit', 'initial', 'transparent',
  'solid', 'hidden', 'visible', 'block', 'flex', 'grid', 'inline-flex', 'contents', 'relative', 'absolute',
  'fixed', 'sticky', 'center', 'start', 'end', 'stretch', 'baseline', 'nowrap', 'wrap', 'ellipsis', 'pointer',
  'default', 'not-allowed', 'border-box', 'both', 'row', 'column', 'space-between', 'left', 'right', 'inset',
  'uppercase', 'underline', 'middle', 'top', 'bottom', 'normal', 'clip', 'light', 'dark', 'reduce', 'antialiased',
  'tabular-nums', 'slashed-zero', '!important']);
const COLOR = /#[0-9a-fA-F]{3,8}\b|\b(rgba?|hsla?|oklch|color-mix)\(/;
const LENGTH = /(^|\s)-?\d*\.?\d+(px|rem|em|%|vh|vw|ch|pt)\b/;
const TIME = /\b\d*\.?\d+m?s\b/;
const BEM = /^tl-[a-z0-9]+(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$/;
const TYPE_FILES = /^(base|type)\.css$/;

export function knownVariables(css) {
  return new Set([...css.matchAll(/--tl-[a-z0-9-]+(?=:)/g)].map((m) => m[0]));
}

export function lint(css, { known, file }) {
  const out = [];
  const say = (d, msg) => out.push(`${file}:${d.line} ${d.selector} { ${d.property} } — ${msg}`);
  for (const d of declarations(css)) {
    if (d.property.startsWith('--')) continue; // Token-Deklarationen (tokens.css)
    const sel = d.selector;
    for (const cls of sel.matchAll(/\.([A-Za-z0-9_-]+)/g))
      if (!BEM.test(cls[1])) out.push(`${file}:${d.line} .${cls[1]} — kein tl-Präfix oder kein BEM (block__element--modifier)`);
    if (/:focus\b(?!-visible|-within)/.test(sel)) say(d, ':focus ohne -visible');
    if (d.property === 'outline' && /^none|^0$/.test(d.value)) say(d, 'outline: none — der Ring ist Pflicht');
    if (d.property === 'font-size' && !(TYPE_FILES.test(file) && /\.tl-(type|print)-/.test(sel)))
      say(d, 'font-size außerhalb einer tl-type-Klasse');
    if (d.property === 'font-weight' && !(TYPE_FILES.test(file) && /\.tl-(type|print)-/.test(sel)))
      say(d, 'font-weight außerhalb einer tl-type-Klasse');
    if (d.property === 'z-index' && !/^var\(--tl-layer-/.test(d.value)) say(d, 'z-index nur aus --tl-layer-*');
    if (d.property === 'box-shadow' && !/^var\(--tl-shadow-/.test(d.value) && !/^inset\b/.test(d.value))
      say(d, 'box-shadow nur --tl-shadow-* oder inset-Linie');
    for (const v of d.value.matchAll(/var\((--tl-[a-z0-9-]+)/g))
      if (!known.has(v[1])) say(d, `unbekannte Variable ${v[1]}`);
    let rest = d.value.replace(/var\([^)]*\)/g, '').replace(/calc\(|\)/g, ' ').replace(/,/g, ' ');
    rest = rest.split(/\s+/).filter((word) => word && !ALLOWED.has(word)).join(' ');
    if (COLOR.test(rest)) say(d, `Farbliteral: ${d.value}`);
    if (TIME.test(rest) && !/0\.01ms/.test(rest)) say(d, `Dauer-Literal: ${d.value}`);
    if (file !== 'base.css' || !/\.tl-print-|line-height|letter-spacing/.test(sel + d.property))
      if (LENGTH.test(rest)) say(d, `Maß-Literal: ${d.value}`);
  }
  return out;
}

if (typeof process !== 'undefined' && import.meta.url === `file://${process.argv[1]}`) {
  const { readFileSync, readdirSync, existsSync } = await import('node:fs');
  const dist = new URL('../dist/', import.meta.url);
  const comps = new URL('../src/components/', import.meta.url);
  const known = knownVariables(readFileSync(new URL('primitives.css', dist), 'utf8') + readFileSync(new URL('tokens.css', dist), 'utf8'));
  const files = [...readdirSync(dist).filter((f) => f.endsWith('.css') && f !== 'primitives.css').map((f) => [f, new URL(f, dist)])];
  if (existsSync(comps)) for (const f of readdirSync(comps).filter((f) => f.endsWith('.css'))) files.push([f, new URL(f, comps)]);
  let n = 0;
  for (const [f, url] of files) for (const v of lint(readFileSync(url, 'utf8'), { known, file: f })) { console.log(v); n++; }
  console.log(n ? `${n} Verstöße` : 'Klassen-Gate grün');
  process.exit(n ? 1 : 0);
}
