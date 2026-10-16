import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = 8137;
const ROOT = new URL('..', import.meta.url).pathname;
const WORKTREE = process.env.TL_WORKTREE ?? fileURLToPath(new URL('../../_Working-Tree/tl8-wt-29584', import.meta.url));
// /fonts/ liegt in zwei Modulen: Inter zuerst, dann Bootstrap Icons (style/bootstrap-icons.css, fonts/).
const FONTS = ['ext.com.inter.fonts', 'ext.com.bootstrap.icons'].map((m) => join(WORKTREE, m, 'src/main/webapp'));
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.mjs': 'text/javascript',
  '.json': 'application/json', '.ttf': 'font/ttf', '.woff': 'font/woff', '.woff2': 'font/woff2' };

/** Der Specimen-Server, noch nicht gestartet — der DOM-Test (focus-clip.test.mjs) startet ihn auf Port 0. */
export const specimenServer = () => createServer(async (req, res) => {
  const p = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
  const files = p.startsWith('/fonts/') ? FONTS.map((f) => join(f, p.slice(7))) : [join(ROOT, p === '/' ? 'specimen/index.html' : p)];
  for (const file of files) {
    try { const data = await readFile(file); res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' }); return res.end(data); }
    catch { /* nächstes Modul */ }
  }
  res.writeHead(404).end(`Nicht gefunden: ${p}`);
});

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  specimenServer().listen(PORT, () => console.log(`Specimen: http://localhost:${PORT}/`));
}
