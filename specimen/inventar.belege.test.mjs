// Prüft die Zahlen, die docs/skalen.md und docs/praesentation.md behaupten,
// gegen das tatsächlich ausgelieferte CSS.
//
// Die Präsentation sagt von sich, ihre Zahlen seien gemessen. Dieser Test ist
// die Einlösung: Ändert sich das Stylesheet, bricht er, und die Dokumente
// werden nachgezogen statt still falsch zu werden.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { themeTokens, inventarisieren } from './inventar.mjs';

const MODUL = join(process.env.TL_WORKTREE ?? join(homedir(), 'git/tl8-wt-29584'),
  'com.top_logic.layout.react/src/main/webapp');
const da = existsSync(join(MODUL, 'style/tlReactControls.css'));

const bericht = da ? (() => {
  const css = ['style/tlReactBase.css', 'style/tlReactControls.css']
    .map((d) => readFileSync(join(MODUL, d), 'utf8')).join('\n');
  const tokens = themeTokens(readFileSync(join(MODUL, 'WEB-INF/conf/tl-react-theme.config.xml'), 'utf8'));
  return inventarisieren(css, tokens, { leiter: [4, 8, 16, 24, 32, 48] });
})() : null;

const anzahl = (gruppe, px) => bericht[gruppe].werte.find((w) => w.px === px)?.anzahl ?? 0;

test('Schriftgrößen: 113 Deklarationen auf 17 Werten', { skip: !da && 'Worktree nicht da' }, () => {
  assert.equal(bericht.schriftgroessen.deklarationen, 113);
  assert.equal(bericht.schriftgroessen.werte.length, 17);
  assert.equal(bericht.schriftgroessen.unaufloesbar, 2); // inherit und 0.875em
});

test('drei Werte tragen die Oberfläche: 14, 12 und 13 px', { skip: !da && 'Worktree nicht da' }, () => {
  assert.equal(anzahl('schriftgroessen', 14), 48);
  assert.equal(anzahl('schriftgroessen', 12), 21);
  assert.equal(anzahl('schriftgroessen', 13), 8);
});

test('sieben Werte drängen sich zwischen 9 und 11,52 px', { skip: !da && 'Worktree nicht da' }, () => {
  const klein = bericht.schriftgroessen.werte.filter((w) => w.px >= 9 && w.px <= 11.52);
  assert.equal(klein.length, 7);
  assert.equal(klein.reduce((s, w) => s + w.anzahl, 0), 17);
});

test('Radius: 4 px 45-mal, 8 px 17-mal', { skip: !da && 'Worktree nicht da' }, () => {
  assert.equal(anzahl('radien', 4), 45);
  assert.equal(anzahl('radien', 8), 17);
});

test('der Fokus hat fünf Mechanismen und 22-mal outline: none', { skip: !da && 'Worktree nicht da' }, () => {
  assert.equal(bericht.fokus['outline: none'], 22);
  assert.equal(bericht.fokus[':focus'], 36);
  assert.equal(bericht.fokus[':focus-visible'], 28);
});

test('Motion: 13 Animationen, eine einzige reduced-motion-Regel', { skip: !da && 'Worktree nicht da' }, () => {
  assert.equal(bericht.motion.keyframes, 13);
  assert.equal(bericht.motion['prefers-reduced-motion'], 1);
  assert.ok(bericht.motion.endlos >= 6, `endlos = ${bericht.motion.endlos}`);
});

test('die Abstandsleiter hat eine Lücke zwischen 8 und 16 px', { skip: !da && 'Worktree nicht da' }, () => {
  const inDerLuecke = bericht.abstaende.luecke.filter((w) => w.px > 8 && w.px < 16);
  assert.ok(inDerLuecke.length > 0, 'keine Werte in der Lücke gefunden');
  assert.ok(inDerLuecke.some((w) => w.px === 12), '12 px fehlt in der Lücke');
});
