#!/usr/bin/env node
// Token-Nutzungsindex fuer TopLogic 8.
// Liest alle theme-settings.xml und alle ausgelieferten Stylesheets und
// kreuzt "definiert" gegen "konsumiert".
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { relative, join } from 'node:path';

const ROOT = process.argv[2];
const OUT  = process.argv[3];
const sh = (c) => execSync(c, { encoding: 'utf8', maxBuffer: 1 << 28 }).trim().split('\n').filter(Boolean);

// ---------- 1. Definitionen ----------
const TYPES = 'color|string|int|size|dim|boolean|float|icon|img|box|theme-image';
const settingFiles = sh(`find "${ROOT}" -name theme-settings.xml -not -path "*/target/*"`);
const defs = new Map();           // localName -> [{name,type,theme,module,value,expr,file}]
let rawCount = 0;

for (const f of settingFiles) {
  const src = readFileSync(f, 'utf8');
  const m = f.match(/\/([^/]+)\/src\/main\/webapp\/WEB-INF\/themes\/([^/]+)\//);
  const mod = m ? m[1] : relative(ROOT, f);
  const theme = m ? m[2] : '?';
  const re = new RegExp(`<(${TYPES})\\s+([^>]*?)/?>`, 'gs');
  for (const hit of src.matchAll(re)) {
    const [, type, attrs] = hit;
    const name = /name="([^"]+)"/.exec(attrs)?.[1];
    if (!name) continue;
    rawCount++;
    const local = name.includes('.') ? name.split('.').pop() : name;
    if (name.startsWith('mime.')) continue;            // CSSBuffer filtert das raus
    const rec = {
      name, local, type, theme, module: mod,
      value: /\svalue="([^"]*)"/.exec(attrs)?.[1] ?? null,
      expr:  /\sexpr="([^"]*)"/.exec(attrs)?.[1]  ?? null,
      fqn: name.includes('.'),
    };
    if (!defs.has(local)) defs.set(local, []);
    defs.get(local).push(rec);
  }
}

// ---------- 2. Verbrauch ----------
// Nur TopLogic-eigenes CSS. Fremdbibliotheken (pdf.js, diagram-js, FontAwesome, ...)
// haben eigene Custom-Property-Namensraeume und sind fuer das Design System irrelevant.
const VENDOR = /\/ext\.|fontawesome|bootstrap-icons|remixicon|fotorama|mdtimepicker|diagram-js|bpmn|highlight|atelier-heath|pdf_viewer|viewer\.css|tl_iconFont|importGoogleFonts|interFonts/i;
const cssFiles = sh(`find "${ROOT}" -name "*.css" -path "*/src/main/webapp/*" -not -path "*/target/*" -not -name "_*"`)
  .filter(f => !VENDOR.test(f));
const used = new Map();           // token -> {count, fallbacks:Set, files:Set}
for (const f of cssFiles) {
  const src = readFileSync(f, 'utf8');
  for (const hit of src.matchAll(/var\(\s*--([A-Za-z0-9_-]+)\s*(?:,([^;)]*(?:\([^)]*\))?[^;)]*))?\)/g)) {
    const [, tok, fb] = hit;
    if (!used.has(tok)) used.set(tok, { count: 0, fallbacks: new Set(), files: new Set() });
    const u = used.get(tok);
    u.count++; u.files.add(relative(ROOT, f));
    if (fb !== undefined && fb.trim()) u.fallbacks.add(fb.trim());
  }
}

// ---------- 1b. Java-Deklarationen (@DefaultValue ist die unterste Vererbungsebene) ----------
// Theme.initDefaults() -> settings.addDefaults(_variables.values()). Ein ThemeVar mit
// @DefaultValue landet also im :root, auch wenn es in keiner theme-settings.xml steht.
// Ohne diesen Schritt meldet der Index solche Tokens faelschlich als Drift.
const iconsFiles = sh(`find "${ROOT}" -name Icons.java -not -path "*/target/*"`);
const javaDefs = new Map();       // localName -> {file, defaultValue}
for (const f of iconsFiles) {
  const src = readFileSync(f, 'utf8');
  for (const hit of src.matchAll(/(?:@DefaultValue\("([^"]*)"\)\s*)?public\s+static\s+(?:ThemeVar<[^>]+>|ThemeImage)\s+([A-Za-z0-9_]+)\s*;/g)) {
    javaDefs.set(hit[2], { file: relative(ROOT, f), defaultValue: hit[1] ?? null });
  }
}

// ---------- 2b. Lokal im CSS deklarierte Custom Properties ----------
// Muster wie `.tl-table__cell a { --highlight: var(--highlight-fg); }` sind legitime
// komponentenlokale Hooks und keine Theme-Tokens. Sie muessen getrennt werden,
// sonst repariert man in AP 2 etwas, das absichtlich so ist.
const cssDeclared = new Map();    // token -> Set<datei>
for (const f of cssFiles) {
  const src = readFileSync(f, 'utf8');
  for (const hit of src.matchAll(/(^|[;{\s])--([A-Za-z0-9_-]+)\s*:/g)) {
    const tok = hit[2];
    if (!cssDeclared.has(tok)) cssDeclared.set(tok, new Set());
    cssDeclared.get(tok).add(relative(ROOT, f));
  }
}

// ---------- 3. Kreuzung ----------
const defined = new Set(defs.keys());
const consumed = new Set(used.keys());
const allUndefined = [...consumed].filter(t => !defined.has(t)).sort();
const javaOnly        = allUndefined.filter(t => !cssDeclared.has(t) &&  javaDefs.has(t));
const undefinedTokens = allUndefined.filter(t => !cssDeclared.has(t) && !javaDefs.has(t));  // echte Drift
const localProps      = allUndefined.filter(t =>  cssDeclared.has(t));   // legitime lokale Hooks
const deadTokens = [...defined].filter(t => !consumed.has(t)).sort();
const collisions = [...defs.entries()]
  .filter(([, v]) => new Set(v.map(r => r.name)).size > 1)
  .map(([local, v]) => ({ local, names: [...new Set(v.map(r => r.name))] }));
const withFallback = [...used.entries()].filter(([, u]) => u.fallbacks.size > 0);
const screaming = [...defined].filter(t => /^[A-Z][A-Z0-9_]*$/.test(t)).sort();

const report = {
  generated: new Date().toISOString(),
  root: ROOT,
  counts: {
    settingFiles: settingFiles.length,
    settingsRaw: rawCount,
    cssFiles: cssFiles.length,
    definedCssRelevant: defined.size,
    consumed: consumed.size,
    undefinedRealDrift: undefinedTokens.length,
    localCssProps: localProps.length,
    javaDefaultOnly: javaOnly.length,
    javaDeclarations: javaDefs.size,
    dead: deadTokens.length,
    localNameCollisions: collisions.length,
    consumedWithFallback: withFallback.length,
    screamingSnake: screaming.length,
  },
  undefinedTokens: undefinedTokens.map(t => ({
    token: t, uses: used.get(t).count,
    fallbacks: [...used.get(t).fallbacks],
    files: [...used.get(t).files],
  })),
  javaDefaultOnly: javaOnly.map(t => ({
    token: t, uses: used.get(t).count, ...javaDefs.get(t),
    files: [...used.get(t).files],
  })),
  localCssProps: localProps.map(t => ({
    token: t, uses: used.get(t).count, declaredIn: [...cssDeclared.get(t)],
  })),
  localNameCollisions: collisions,
  screamingSnake: screaming,
  deadTokens,
  consumedWithFallback: withFallback.map(([t, u]) => ({ token: t, fallbacks: [...u.fallbacks], uses: u.count })),
};
mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, 'token-inventory.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report.counts, null, 2));
console.log('\n--- ECHTE DRIFT: konsumiert, weder im Theme noch im CSS definiert ---');
for (const u of report.undefinedTokens) console.log(`  --${u.token.padEnd(32)} ${String(u.uses).padStart(3)}x   fallback: ${u.fallbacks.join(' | ') || '-'}`);
console.log(`\n--- Nur ueber Java @DefaultValue definiert (${javaOnly.length}) ---`);
for (const t of javaOnly) console.log(`  --${t.padEnd(28)} ${String(used.get(t).count).padStart(3)}x  default=${JSON.stringify(javaDefs.get(t).defaultValue)}  ${javaDefs.get(t).file}`);
console.log(`\n--- Legitime lokale CSS-Properties (ignorieren): ${localProps.length} ---`);
console.log('  ' + localProps.join(', '));
console.log('\n--- localName-Kollisionen ---');
for (const c of collisions) console.log(`  --${c.local}  <-  ${c.names.join('  ||  ')}`);
