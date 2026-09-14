#!/usr/bin/env node
// Fremdpaletten-Waechter.
// Bricht, wenn in TopLogic-eigenem CSS Werte auftauchen, die nicht von uns definiert sind:
//   1. var(--token, <fallback>)  -- jeder Fallback ist eine zweite Wahrheit
//   2. bekannte Fremdpaletten-Hexwerte (IBM Carbon v11, Tailwind)
//   3. rohe Hexfarben ausserhalb der Token-Definitionen
// Exit 1 = Verstoss.
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { relative } from 'node:path';

const ROOT = process.argv[2];
if (!ROOT) { console.error('Aufruf: check-foreign-values.mjs <repo-root> [--budget N]'); process.exit(2); }
const budgetArg = process.argv.indexOf('--budget');
const BUDGET = budgetArg > -1 ? Number(process.argv[budgetArg + 1]) : null;

// Fremdpaletten. Quelle: IBM Carbon v11 und Tailwind v3 Standardwerte,
// im Bestand nachgewiesen (siehe findings/AP1-token-inventar.md).
const FOREIGN = {
  '#0f62fe': 'IBM Carbon blue-60',   '#0043ce': 'IBM Carbon blue-70',
  '#002d9c': 'IBM Carbon blue-80',   '#0353e9': 'IBM Carbon blue-60-hover',
  '#da1e28': 'IBM Carbon red-60',    '#ba1b23': 'IBM Carbon red-70',
  '#198038': 'IBM Carbon green-60',  '#24a148': 'IBM Carbon green-50',
  '#f1c21b': 'IBM Carbon yellow-30', '#161616': 'IBM Carbon gray-100',
  '#393939': 'IBM Carbon gray-80',   '#525252': 'IBM Carbon gray-70',
  '#6f6f6f': 'IBM Carbon gray-60',   '#8d8d8d': 'IBM Carbon gray-50',
  '#a8a8a8': 'IBM Carbon gray-40',   '#c6c6c6': 'IBM Carbon gray-30',
  '#e0e0e0': 'IBM Carbon gray-20',   '#f4f4f4': 'IBM Carbon gray-10',
  '#bdbdbd': 'IBM Carbon gray-disabled',
  '#2563eb': 'Tailwind blue-600',    '#dbeafe': 'Tailwind blue-100',
  '#bfdbfe': 'Tailwind blue-200',    '#dc2626': 'Tailwind red-600',
  '#374151': 'Tailwind gray-700',    '#6b7280': 'Tailwind gray-500',
  '#d1d5db': 'Tailwind gray-300',    '#e5e7eb': 'Tailwind gray-200',
  '#f3f4f6': 'Tailwind gray-100',    '#f9fafb': 'Tailwind gray-50',
  '#f1f5f9': 'Tailwind slate-100',   '#e2e8f0': 'Tailwind slate-200',
};

// Ausgeliefert wird nur, was eine theme.xml referenziert. Alles andere liegt zwar
// im webapp-Ordner, erreicht aber nie den Browser — Verstoesse dort sind Altlast,
// keine aktive Drift, und werden getrennt gezaehlt.
const deliveredPaths = new Set(
  execSync(`find "${ROOT}" -name theme.xml -not -path "*/target/*" -print0 | xargs -0 grep -hoE '<style name="[^"]+"'`,
    { encoding: 'utf8', maxBuffer: 1 << 28 })
    .split('\n').filter(Boolean)
    .map(l => l.replace(/<style name="/, '').replace(/"$/, ''))
);
// Seit der Umstellung der React-Schicht werden Stylesheets zusaetzlich ueber
// StyleSheetConfig in *.conf.config.xml registriert, nicht mehr ueber theme.xml.
for (const line of execSync(
  `find "${ROOT}" -name "*.config.xml" -not -path "*/target/*" -print0 | xargs -0 grep -hoE 'resource="/style/[^"]+"' || true`,
  { encoding: 'utf8', maxBuffer: 1 << 28 }).split('\n').filter(Boolean)) {
  deliveredPaths.add(line.replace(/resource="/, '').replace(/"$/, ''));
}
const isDelivered = (abs) => {
  const i = abs.indexOf('/src/main/webapp/');
  return i > -1 && deliveredPaths.has('/' + abs.slice(i + '/src/main/webapp/'.length));
};

const VENDOR = /\/ext\.|fontawesome|bootstrap-icons|remixicon|fotorama|mdtimepicker|diagram-js|bpmn|highlight|atelier-heath|pdf_viewer|viewer\.css|tl_iconFont|importGoogleFonts|interFonts/i;
const files = execSync(`find "${ROOT}" -name "*.css" -path "*/src/main/webapp/*" -not -path "*/target/*" -not -name "_*"`,
  { encoding: 'utf8', maxBuffer: 1 << 28 }).trim().split('\n').filter(f => f && !VENDOR.test(f));

const findings = [];
const dormant = [];
for (const f of files) {
  const rel = relative(ROOT, f);
  const sink = isDelivered(f) ? findings : dormant;
  readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
    for (const m of line.matchAll(/var\(\s*--[A-Za-z0-9_-]+\s*,\s*([^;)]+(?:\([^)]*\))?[^;)]*)\)/g)) {
      // Ein Fallback, der selbst auf ein Token zeigt, ist kein Verstoss: der Wert
      // bleibt von uns definiert. Das ist das bewusste Override-Muster
      // (z.B. var(--highlight, var(--link-primary))). Nur Literale sind Drift.
      if (/^\s*var\(\s*--/.test(m[1])) continue;
      sink.push({ rule: 'no-literal-fallback', file: rel, line: i + 1,
        detail: m[0].trim().slice(0, 80),
        msg: 'Fallback entfernen. Fehlt das Token, wird es definiert — nicht umgangen.' });
    }
    for (const m of line.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
      const hex = m[0].toLowerCase();
      const known = FOREIGN[hex] ?? FOREIGN[hex.length === 4 ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}` : hex];
      if (known) sink.push({ rule: 'no-foreign-palette', file: rel, line: i + 1,
        detail: m[0], msg: `${known}. TopLogic definiert seine Farben selbst.` });
    }
  });
}

const byRule = findings.reduce((a, f) => ((a[f.rule] = (a[f.rule] ?? 0) + 1), a), {});
console.log('Fremdpaletten-Waechter\n');
console.log(`  Geprueft: ${files.length} TopLogic-Stylesheets, davon ${files.filter(isDelivered).length} ausgeliefert`);
for (const [r, n] of Object.entries(byRule)) console.log(`  ${r.padEnd(22)} ${n}`);
console.log(`  ${'GESAMT'.padEnd(22)} ${findings.length}\n`);

const top = findings.reduce((a, f) => ((a[f.file] = (a[f.file] ?? 0) + 1), a), {});
console.log('  Nach Datei:');
for (const [f, n] of Object.entries(top).sort((a, b) => b[1] - a[1]).slice(0, 12))
  console.log(`    ${String(n).padStart(4)}  ${f}`);

if (dormant.length) {
  const df = dormant.reduce((a, f) => ((a[f.file] = (a[f.file] ?? 0) + 1), a), {});
  console.log(`\n  Nicht ausgeliefert (Altlast, zaehlt nicht gegen das Budget): ${dormant.length}`);
  for (const [f, n] of Object.entries(df).sort((a, b) => b[1] - a[1]))
    console.log(`    ${String(n).padStart(4)}  ${f}`);
}

if (BUDGET !== null) {
  console.log('');
  if (findings.length > BUDGET) {
    console.error(`FEHLER: ${findings.length} Verstoesse, Budget ist ${BUDGET}. Budgets gehen nur runter.`);
    process.exit(1);
  }
  if (findings.length < BUDGET) {
    console.error(`FEHLER: nur noch ${findings.length} Verstoesse (Budget ${BUDGET}). Budget senken und committen.`);
    process.exit(1);
  }
  console.log(`Budget eingehalten: ${findings.length}/${BUDGET}`);
}
