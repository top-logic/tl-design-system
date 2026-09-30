import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = 8137;
const ROOT = new URL('..', import.meta.url).pathname;
const FONTS = join(process.env.TL_WORKTREE ?? fileURLToPath(new URL('../../engine', import.meta.url)), 'ext.com.inter.fonts/src/main/webapp');
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.mjs': 'text/javascript',
  '.json': 'application/json', '.ttf': 'font/ttf', '.woff': 'font/woff', '.woff2': 'font/woff2' };

createServer(async (req, res) => {
  const p = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
  const file = p.startsWith('/fonts/') ? join(FONTS, p.slice(7)) : join(ROOT, p === '/' ? 'specimen/index.html' : p);
  try { res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' }); res.end(await readFile(file)); }
  catch { res.writeHead(404).end(`Nicht gefunden: ${p}`); }
}).listen(PORT, () => console.log(`Specimen: http://localhost:${PORT}/`));
