import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readGenerated, declarationsOf, missingInContract } from './lib/component.mjs';

test('tl-popover: Overlay-Fläche, Schatten, Ebene popover, Maße aus den Tokens', () => {
  const d = declarationsOf(readGenerated('popover', 'popover.css'), '.tl-popover');
  for (const t of ['surface-overlay', 'border-separator', 'radius-md', 'shadow-popover', 'layer-popover',
    'size-popover-min', 'size-popover-max']) assert.match(d, new RegExp(`var\\(--tl-${t}\\)`));
});

test('tl-menu__item: Zeilenhöhe size-row, Zustand nur als Attribut, In-Kraft über die Typo-Klasse', () => {
  const css = readGenerated('menu', 'menu.css');
  assert.match(declarationsOf(css, '.tl-menu__item'), /min-height:\s*var\(--tl-size-row\)/);
  assert.doesNotMatch(css, /--(focused|active|disabled)\b/);
  assert.doesNotMatch(css, /font-weight/);
  const md = readFileSync(new URL('../src/components/menu/menu.contract.md', import.meta.url), 'utf8');
  assert.deepEqual(missingInContract(md, ['aria-current', 'tl-type-label-strong', 'tl-menu-region', 'data-tl-trigger']), []);
});
