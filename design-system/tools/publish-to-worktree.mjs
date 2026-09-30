// Kopiert dist/ in den TopLogic-Worktree. Übergang, bis das Paket einen Maven-Wrapper hat
// (wie ext.com.inter.fonts); dann ersetzt der Wrapper diese Kopie.
import { copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dest = join(process.env.TL_WORKTREE ?? fileURLToPath(new URL('../../_Working-Tree/tl8-wt-29584', import.meta.url)),
  'com.top_logic.layout.react/src/main/webapp/style/tl-design-system');
mkdirSync(dest, { recursive: true });
for (const f of ['primitives.css', 'tokens.css', 'base.css', 'components.css']) {
  copyFileSync(new URL(`../dist/${f}`, import.meta.url), join(dest, f));
  console.log(`kopiert: ${f}`);
}
