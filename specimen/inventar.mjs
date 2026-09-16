// Zählt aus, was im ausgelieferten CSS tatsächlich steht.
//
// Jede Zahl in docs/skalen.md und docs/praesentation.md stammt aus einer
// solchen Auszählung. Solange die von Hand mit grep entstand, war sie weder
// wiederholbar noch überprüfbar — und die Präsentation behauptet von sich,
// dass ihre Zahlen gemessen sind.
//
// Aufruf: node inventar.mjs [--json]

const ZAHL = /^-?[0-9]*\.?[0-9]+/;

/** Alle Werte einer Eigenschaft, Kurzformen wie border-top-width ausgenommen. */
export function deklarationen(css, eigenschaft) {
  const muster = new RegExp(`(^|[;{\\s])${eigenschaft}\\s*:\\s*([^;}]+)`, 'g');
  return [...css.matchAll(muster)].map((t) => t[2].trim());
}

/** Wert in Pixel, oder null wenn er nicht davon abhängt (inherit, em, %). */
export function inPixel(wert, wurzel = 16) {
  const roh = String(wert).trim();
  if (!ZAHL.test(roh)) return null;
  const zahl = parseFloat(roh);
  if (roh.endsWith('rem')) return +(zahl * wurzel).toFixed(4);
  if (roh.endsWith('px')) return zahl;
  if (zahl === 0) return 0;
  return null;
}

/**
 * Die name/value-Paare der Theme-Konfiguration, gleich welchen Typs.
 *
 * Die Konfiguration führt <text>, <length> und <color> nebeneinander. Wer nur
 * <text> liest, übersieht sämtliche Typo- und Maßtokens — und zählt dann die
 * 33 Verwendungen von --body-compact-01-font-size als nicht umrechenbar.
 */
export function themeTokens(xml) {
  const raus = {};
  for (const t of xml.matchAll(/<[a-zA-Z]+\s+name="([^"]+)"\s+value="([^"]*)"/g)) raus[t[1]] = t[2];
  return raus;
}

/**
 * Ersetzt var(--x) durch den Token-Wert.
 *
 * Was sich nicht auflösen lässt — unbekanntes Token oder eine Referenzschleife
 * — kommt unverändert zurück, so wie es hereinkam. Ein halb aufgelöster Wert
 * wäre schlimmer als gar keiner: Er sähe aus wie ein Ergebnis.
 */
export function aufloesen(wert, tokens) {
  const ursprung = wert;
  let aktuell = String(wert).trim();
  const gesehen = new Set();
  for (;;) {
    const treffer = /^var\(--([^),]+)\)$/.exec(aktuell);
    if (!treffer) return aktuell;
    const name = treffer[1];
    if (gesehen.has(name) || !(name in tokens)) return ursprung;
    gesehen.add(name);
    aktuell = String(tokens[name]).trim();
  }
}

function gruppieren(rohwerte, tokens, wurzel) {
  const nachPx = new Map();
  let unaufloesbar = 0;
  for (const roh of rohwerte) {
    const px = inPixel(aufloesen(roh, tokens), wurzel);
    if (px === null) { unaufloesbar += 1; continue; }
    if (!nachPx.has(px)) nachPx.set(px, { px, anzahl: 0, herkunft: new Set() });
    const eintrag = nachPx.get(px);
    eintrag.anzahl += 1;
    eintrag.herkunft.add(roh);
  }
  return {
    deklarationen: rohwerte.length,
    unaufloesbar,
    werte: [...nachPx.values()].sort((a, b) => a.px - b.px)
      .map((e) => ({ ...e, herkunft: [...e.herkunft] })),
  };
}

const ABSTANDS_EIGENSCHAFTEN = ['padding', 'padding-top', 'padding-right', 'padding-bottom',
  'padding-left', 'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'gap'];

/**
 * @param {string} css     Inhalt der Stylesheets
 * @param {object} tokens  Theme-Tokens zum Auflösen von var()
 * @param {object} [opt]   { wurzel, leiter } — leiter: die erwarteten Abstandsstufen in px
 */
export function inventarisieren(css, tokens = {}, opt = {}) {
  const wurzel = opt.wurzel ?? 16;
  const g = (eigenschaft) => gruppieren(deklarationen(css, eigenschaft), tokens, wurzel);

  const abstandsWerte = ABSTANDS_EIGENSCHAFTEN.flatMap((e) =>
    deklarationen(css, e).flatMap((v) => v.split(/\s+/)));
  const abstaende = gruppieren(abstandsWerte, tokens, wurzel);
  const leiter = opt.leiter ?? null;

  const fokusMechanismen = {
    outline: deklarationen(css, 'outline').filter((v) => /focus/i.test(v)).length,
    'box-shadow inset': deklarationen(css, 'box-shadow').filter((v) => /focus/i.test(v) && v.includes('inset')).length,
    'box-shadow aussen': deklarationen(css, 'box-shadow').filter((v) => /focus/i.test(v) && !v.includes('inset')).length,
    'border-color': deklarationen(css, 'border-color').filter((v) => /focus/i.test(v)).length,
  };

  return {
    schriftgroessen: g('font-size'),
    schriftgewichte: gruppieren(deklarationen(css, 'font-weight'), tokens, wurzel),
    radien: g('border-radius'),
    rahmenbreiten: gruppieren(
      deklarationen(css, 'border').concat(deklarationen(css, 'border-width'))
        .map((v) => v.split(/\s+/)[0]), tokens, wurzel),
    abstaende: {
      ...abstaende,
      luecke: leiter ? abstaende.werte.filter((w) => w.px > 0 && !leiter.includes(w.px)) : [],
    },
    fokus: {
      mechanismen: fokusMechanismen,
      'outline: none': deklarationen(css, 'outline').filter((v) => v.trim() === 'none').length,
      ':focus': (css.match(/:focus(?![-a-z])/g) ?? []).length,
      ':focus-visible': (css.match(/:focus-visible/g) ?? []).length,
    },
    motion: {
      transitions: deklarationen(css, 'transition').length,
      animationen: deklarationen(css, 'animation').length,
      keyframes: (css.match(/@keyframes/g) ?? []).length,
      endlos: deklarationen(css, 'animation').filter((v) => v.includes('infinite')).length,
      'prefers-reduced-motion': (css.match(/prefers-reduced-motion/g) ?? []).length,
    },
    familien: gruppieren([], {}, wurzel) && [...new Set(deklarationen(css, 'font-family'))],
  };
}

// ---------------------------------------------------------------------------
// Aufruf von der Kommandozeile: node inventar.mjs [--json]
// ---------------------------------------------------------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
  const { readFileSync } = await import('node:fs');
  const { join } = await import('node:path');
  const { homedir } = await import('node:os');

  const WORKTREE = process.env.TL_WORKTREE ?? join(homedir(), 'git/tl8-wt-29584');
  const MODUL = join(WORKTREE, 'com.top_logic.layout.react/src/main/webapp');
  const css = ['style/tlReactBase.css', 'style/tlReactControls.css']
    .map((d) => readFileSync(join(MODUL, d), 'utf8')).join('\n');
  const tokens = themeTokens(readFileSync(join(MODUL, 'WEB-INF/conf/tl-react-theme.config.xml'), 'utf8'));
  const bericht = inventarisieren(css, tokens, { leiter: [4, 8, 16, 24, 32, 48] });

  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(bericht, null, 2));
  } else {
    const zeile = (e) => `${String(e.px).padStart(7)} px  ${String(e.anzahl).padStart(3)}   ${e.herkunft.join(', ')}`;
    for (const [titel, schluessel] of [['Schriftgrößen', 'schriftgroessen'], ['Radien', 'radien'],
                                       ['Rahmenbreiten', 'rahmenbreiten']]) {
      const b = bericht[schluessel];
      console.log(`\n== ${titel} == ${b.deklarationen} Deklarationen, ${b.werte.length} Werte`
        + (b.unaufloesbar ? `, ${b.unaufloesbar} nicht umrechenbar` : ''));
      b.werte.forEach((e) => console.log(zeile(e)));
    }
    console.log(`\n== Abstände == ${bericht.abstaende.deklarationen} Werte, `
      + `${bericht.abstaende.luecke.length} außerhalb der Leiter`);
    bericht.abstaende.luecke.forEach((e) => console.log(zeile(e)));
    console.log('\n== Fokus ==');
    Object.entries({ ...bericht.fokus.mechanismen, ...bericht.fokus })
      .filter(([, v]) => typeof v === 'number')
      .forEach(([k, v]) => console.log(`${String(v).padStart(5)}  ${k}`));
    console.log('\n== Motion ==');
    Object.entries(bericht.motion).forEach(([k, v]) => console.log(`${String(v).padStart(5)}  ${k}`));
    console.log('\n== Schriftfamilien ==');
    bericht.familien.forEach((f) => console.log(`       ${f}`));
  }
}
