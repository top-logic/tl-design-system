// Einmaliger Export: Was die Altwerkzeuge über den Altbestand wissen, als Arbeitsliste.
// Wird nach dem Lauf zusammen mit den Altwerkzeugen gelöscht (Task 12).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { stellenBericht } from './stellen.mjs';

const MODUL = join(process.env.TL_WORKTREE ?? join(homedir(), 'git/tl8-wt-29584'),
  'com.top_logic.layout.react/src/main/webapp/style');
const css = ['tlReactBase.css', 'tlReactControls.css']
  .map((d) => readFileSync(join(MODUL, d), 'utf8')).join('\n');
const abbildung = JSON.parse(readFileSync(new URL('./abbildung.json', import.meta.url)));
const entscheidungen = JSON.parse(readFileSync(new URL('./stellen.json', import.meta.url)));

/** Alte Skalen-Rolle → neuer Tokenname. Die Entscheidung dahinter steht in skalen.md. */
export const NEU = {
  'background': 'surface-base',
  'layer-01': 'surface-layer',
  'layer-02': 'surface-layer-nested',
  'layer-overlay': 'surface-overlay',
  'layer-hover': 'surface-interactive-hover',
  'layer-selected': 'surface-interactive-selected',
  'layer-active': 'surface-interactive-active',
  'field': 'surface-field',
  'text-primary': 'text-primary',
  'text-secondary': 'text-secondary',
  'text-helper': 'text-helper',
  'text-placeholder': 'text-placeholder',
  'border-separator': 'border-separator',
  'border-control': 'border-control',
  'border-emphasis': 'border-emphasis',
  'border-interactive': 'border-interactive',
  'focus': 'focus-ring',
  'brand-primary': 'surface-brand',
  'brand-primary-hover': 'surface-brand-hover',
  'brand-primary-active': 'surface-brand-active',
  'brand-link': 'text-link',
  'brand-link-hover': 'text-link-hover',
  'brand-subtle': 'surface-brand-subtle',
  'brand-subtle-hover': 'surface-brand-subtle-hover',
  ...Object.fromEntries(['error', 'warning', 'success', 'info'].flatMap((s) =>
    ['text', 'border', 'surface', 'subtle'].map((r) => [`support-${s}-${r}`, `status-${s}-${r}`]))),
  'shadow-popover': 'shadow-popover', 'shadow-dialog': 'shadow-dialog', 'shadow-drag': 'shadow-drag',
};

const zeilen = ['# Altlast — Arbeitsliste für die Wellen 1 bis 5', '',
  'Einmalig exportiert aus abbildung.json, stellen.json und dem Inventar am ' + new Date().toISOString().slice(0, 10) + '.',
  'Die Werkzeuge dahinter sind gelöscht; diese Datei ist ihr Erbe.', '',
  '## Alte Theme-Tokens → neue Tokens', '', '| Alt (tl-react-theme.config.xml) | Art | Neu (`--tl-…`) | Regel |', '|---|---|---|---|'];
for (const [alt, e] of Object.entries(abbildung.farbe)) {
  const ziel = e.ziel ? NEU[e.ziel] ?? e.ziel : e.ziele ? e.ziele.map((z) => NEU[z] ?? z).join(' / ') : e.art;
  zeilen.push(`| \`${alt}\` | ${e.art} | \`${ziel}\` | ${(e.regel ?? e.warum ?? '').replace(/\|/g, '\\|')} |`);
}
zeilen.push('', '## Lesestellen der mehrdeutigen Tokens', '', '| Selektor | Eigenschaft | Alt | Neu |', '|---|---|---|---|');
for (const [alt, b] of Object.entries(stellenBericht(css, abbildung, entscheidungen)))
  for (const s of b.stellen) {
    const ziel = s.ziel ? NEU[s.ziel] ?? s.ziel : s.zweckfremd ? `zweckfremd → ${NEU[s.zweckfremd.vorschlag] ?? s.zweckfremd.vorschlag}` : 'OFFEN';
    zeilen.push(`| \`${s.selektor}\` | \`${s.eigenschaft}\` | \`${alt}\` | \`${ziel}\` |`);
  }
zeilen.push('', '## Nicht abgebildete Alt-Tokens (Maße, Schatten, Typo)', '',
  'Diese 31 Tokens las das alte CSS ohne Ziel in der Skala. Sie fallen mit ihrer Komponente:', '',
  '| Alt | Neu |', '|---|---|',
  '| `spacing-01` … `spacing-06` | `space-2xs`, `space-xs`, `space-md`, `space-lg`, `space-xl`, `space-2xl` (Lücke 12 px = `space-sm`) |',
  '| `corner-radius` | `radius-sm` |', '| `border-radius-02` | `radius-md` |',
  '| `body-compact-01-*`, `body-02-*` | Klasse `.tl-type-body` |',
  '| `label-01-font-size` | Klasse `.tl-type-label` |',
  '| `heading-compact-02-*` | Klasse `.tl-type-body-strong` (14/600) |',
  '| `heading-compact-03-font-size` | Klasse `.tl-type-heading-sm` |',
  '| `heading-03-font-size` | Klasse `.tl-type-heading-md` |',
  '| `shadow-raised` | entfällt (Elevation nur für Schwebendes) |',
  '| `shadow-menu` | `shadow-popover` |', '| `shadow-dialog` | `shadow-dialog` |',
  '| `overlay` | `surface-scrim` |', '| `font-family`, `font-family-mono` | `font-family-sans`, `font-family-mono` |',
  '| `border-subtle-01`, `border-color`, `color-border` | `border-separator` |',
  '| `text-muted` | `text-secondary` |', '| `link-color` | `text-link` |',
  '| `color-drop-zone` | `surface-brand-subtle` |');
mkdirSync(new URL('../docs/migration/', import.meta.url), { recursive: true });
writeFileSync(new URL('../docs/migration/altlast.md', import.meta.url), zeilen.join('\n') + '\n');
console.log('geschrieben: docs/migration/altlast.md');
