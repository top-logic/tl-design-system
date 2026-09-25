// Die Paarliste des Kontrast-Gates als Daten. tokens.test.mjs prüft das Paket damit, derive das
// Kundentheme — dieselben Paare, dieselben Schwellen (docs/skalen.md).
const GRUENDE_TEXT = ['surface-layer', 'surface-layer-nested', 'surface-overlay',
  'surface-interactive-hover', 'surface-interactive-selected', 'surface-interactive-active'];
const GRUENDE_FOKUS = ['surface-base', 'surface-layer', 'surface-layer-nested', 'surface-overlay',
  'surface-field', 'surface-brand-subtle'];
const STATUS = ['error', 'warning', 'success', 'info'];
const KATEGORIEN = [1, 2, 3, 4, 5, 6, 7, 8];

export function kontrastPaare(T) {
  const p = [];
  const paar = (fg, bg, soll) => p.push({ fg, bg, soll });
  paar('text-primary', 'surface-base', 16.0); paar('text-secondary', 'surface-base', 7.0);
  paar('text-helper', 'surface-base', 5.2); paar('text-placeholder', 'surface-field', 4.6);
  paar('text-link', 'surface-base', 4.5); paar('text-link-hover', 'surface-base', 4.5);
  paar('icon-primary', 'surface-base', 3.0); paar('icon-secondary', 'surface-base', 3.0);
  paar('border-emphasis', 'surface-base', 4.6); paar('border-control', 'surface-base', 3.0);
  paar('border-interactive', 'surface-base', 3.0); paar('focus-ring', 'surface-base', 3.0);
  paar('text-link', 'surface-brand-subtle', 4.5); paar('text-primary', 'surface-brand-subtle', 4.5);
  for (const bg of GRUENDE_TEXT) paar('text-primary', bg, 4.5);
  for (const s of STATUS) {
    for (const bg of ['surface-base', 'surface-layer']) {
      paar(`status-${s}-text`, bg, 4.5); paar(`status-${s}-border`, bg, 3.0);
    }
    paar('text-primary', `status-${s}-subtle`, 4.5);
  }
  for (const bg of GRUENDE_FOKUS) paar('focus-ring', bg, 3.0);
  for (const k of KATEGORIEN) {
    paar('text-primary', `category-${k}-subtle`, 4.5);
    for (const bg of ['surface-base', 'surface-layer']) paar(`category-${k}-border`, bg, 3.0);
  }
  for (const [name, { surface }] of Object.entries(T.derived.light))
    paar(name, surface, name.startsWith('icon-') ? 3.0 : 4.5);
  return p;
}

/** Hex einer Rolle aus einem aufgelösten Ergebnis, Farbe oder Beschriftung. */
export function werte(R, mode, name) {
  if (name in R.color[mode]) return R.color[mode][name];
  if (name in R.derived[mode]) return R.derived[mode][name];
  throw new Error(`${mode}: Rolle ${name} unbekannt`);
}
