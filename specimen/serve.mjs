import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { homedir } from 'node:os';

const PORT = 8137;
const WORKTREE = process.env.TL_WORKTREE ?? join(homedir(), 'git/tl8-wt-29584');
const STYLE = join(WORKTREE, 'com.top_logic.layout.react/src/main/webapp/style');
const HIER = new URL('.', import.meta.url).pathname;

const TYPEN = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8' };

createServer(async (anfrage, antwort) => {
  const pfad = normalize(decodeURIComponent(new URL(anfrage.url, 'http://x').pathname));
  const datei = pfad.startsWith('/style/')
    ? join(STYLE, pfad.slice('/style/'.length))
    : join(HIER, pfad === '/' ? 'index.html' : pfad);
  try {
    const inhalt = await readFile(datei);
    antwort.writeHead(200, { 'content-type': TYPEN[extname(datei)] ?? 'application/octet-stream' });
    antwort.end(inhalt);
  } catch {
    antwort.writeHead(404).end(`Nicht gefunden: ${pfad}`);
  }
}).listen(PORT, () => {
  console.log(`Specimen: http://localhost:${PORT}/`);
  console.log(`Stylesheets aus: ${STYLE}`);
});
