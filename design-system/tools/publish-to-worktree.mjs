// Kopiert dist/ in den TopLogic-Worktree. Übergang, bis das Paket einen Maven-Wrapper hat
// (wie ext.com.inter.fonts); dann ersetzt der Wrapper diese Kopie.
import { copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

const dest = join(process.env.TL_WORKTREE ?? join(homedir(), 'git/tl8-wt-29584'),
  'com.top_logic.layout.react/src/main/webapp/style/tl-design-system');
mkdirSync(dest, { recursive: true });
for (const f of ['primitives.css', 'tokens.css', 'base.css', 'components.css']) {
  copyFileSync(new URL(`../dist/${f}`, import.meta.url), join(dest, f));
  console.log(`kopiert: ${f}`);
}
