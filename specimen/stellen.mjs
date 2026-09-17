// Zählt aus, WO das ausgelieferte CSS die mehrdeutigen Tokens liest.
//
// abbildung.json sagt, welche Ziele ein mehrdeutiges Token hat und nach welcher
// Regel zwischen ihnen zu entscheiden ist. Anwenden lässt sich diese Regel erst
// an den Stellen selbst — und die Stellen sind der Punkt, an dem sich zeigt, ob
// die Regel überhaupt trägt. Eine am Schreibtisch gebildete Regel, die an der
// Hälfte der Stellen nicht greift, ist keine Entscheidung, sondern eine Absicht.
//
// Aufruf: node stellen.mjs [token] [--json]

import { lesestellen } from './inventar.mjs';

/**
 * Wonach eine Eigenschaft gelesen wird: als Linie, als Text oder als Fläche.
 *
 * Überall dort, wo die Ziele eines Tokens verschiedene Aufgaben haben, ist das
 * schon die ganze Entscheidung — die Aufgabe steht in der Eigenschaft. Nur wo
 * beide Ziele dieselbe Aufgabe haben (border-separator gegen border-control),
 * muss der Selektor ran.
 */
export const KLASSEN = {
  linie: ['border', 'border-top', 'border-right', 'border-bottom', 'border-left',
          'border-color', 'outline', 'outline-color'],
  text: ['color'],
  flaeche: ['background', 'background-color', 'accent-color'],
};

/**
 * Die Klasse einer Stelle, oder null.
 *
 * box-shadow zählt NUR mit `inset` als Linie: Der Bestand baut die
 * Umriss-Schaltfläche an 25 Stellen als `inset 0 0 0 2px`. Wer den Schatten
 * pauschal als Elevation liest, ordnet jede davon falsch zu; wer ihn pauschal
 * als Linie liest, verwechselt ihn mit einem echten Schatten.
 */
export function klasseVon({ eigenschaft, wert }) {
  if (eigenschaft === 'box-shadow') return /\binset\b/.test(wert) ? 'linie' : null;
  for (const [klasse, eigenschaften] of Object.entries(KLASSEN))
    if (eigenschaften.includes(eigenschaft)) return klasse;
  return null;
}

/**
 * Das Ziel einer Stelle, nach der Entscheidung aus stellen.json.
 *
 * @returns {{ziel: string|null, zweckfremd: object|null}}
 */
export function zuordnen(stelle, eintrag) {
  if (!eintrag) return { ziel: null, zweckfremd: null };
  const fremd = eintrag.zweckfremd?.[stelle.selektor];
  if (fremd) return { ziel: null, zweckfremd: fremd };
  for (const [ziel, selektoren] of Object.entries(eintrag.nachSelektor ?? {}))
    if (selektoren.includes(stelle.selektor)) return { ziel, zweckfremd: null };
  const klasse = klasseVon(stelle);
  const nachKlasse = klasse && eintrag.nachKlasse?.[klasse];
  return { ziel: nachKlasse ?? null, zweckfremd: null };
}

/**
 * Alle Lesestellen der mehrdeutigen Tokens, je Stelle mit dem Ziel, das die
 * Eigenschaft hergibt — oder `null`, wo eine Entscheidung am Bild nötig ist.
 */
export function stellenBericht(css, abbildung, entscheidungen) {
  const raus = {};
  for (const [name, e] of Object.entries(abbildung.farbe)) {
    if (e.art !== 'mehrdeutig') continue;
    const eintrag = entscheidungen?.token?.[name];
    const stellen = lesestellen(css, name).map((s) => ({ ...s, ...zuordnen(s, eintrag) }));
    raus[name] = {
      natur: e.natur,
      ziele: e.ziele,
      regel: e.regel,
      entscheidung: eintrag?.entscheidung ?? null,
      stellen,
      zugeordnet: stellen.filter((s) => s.ziel).length,
      zweckfremd: stellen.filter((s) => s.zweckfremd).length,
      offen: stellen.filter((s) => !s.ziel && !s.zweckfremd).length,
    };
  }
  return raus;
}

// ---------------------------------------------------------------------------
if (typeof process !== 'undefined' && import.meta.url === `file://${process.argv[1]}`) {
  const { readFileSync } = await import('node:fs');
  const { join } = await import('node:path');
  const { homedir } = await import('node:os');

  const MODUL = join(process.env.TL_WORKTREE ?? join(homedir(), 'git/tl8-wt-29584'),
    'com.top_logic.layout.react/src/main/webapp');
  const css = ['style/tlReactBase.css', 'style/tlReactControls.css']
    .map((d) => readFileSync(join(MODUL, d), 'utf8')).join('\n');
  const abbildung = JSON.parse(readFileSync(new URL('./abbildung.json', import.meta.url)));
  const entscheidungen = JSON.parse(readFileSync(new URL('./stellen.json', import.meta.url)));
  const bericht = stellenBericht(css, abbildung, entscheidungen);

  const nur = process.argv.slice(2).find((a) => !a.startsWith('--'));
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(nur ? { [nur]: bericht[nur] } : bericht, null, 2));
  } else {
    let gesamt = 0; let offen = 0; let fremd = 0;
    for (const [name, b] of Object.entries(bericht)) {
      if (nur && name !== nur) continue;
      gesamt += b.stellen.length; offen += b.offen; fremd += b.zweckfremd;
      console.log(`\n== ${name} == ${b.stellen.length} Stellen · ${b.zugeordnet} zugeordnet`
        + (b.zweckfremd ? `, ${b.zweckfremd} zweckfremd` : '')
        + (b.offen ? `, ${b.offen} OFFEN` : '')
        + (b.natur === 'aufteilung' ? '  [AUFTEILUNG — je Deklaration eindeutig, je Token nicht]' : ''));
      for (const s of b.stellen) {
        const marke = s.ziel ? `→ ${s.ziel}` : s.zweckfremd ? `ZWECKFREMD → ${s.zweckfremd.vorschlag}` : '?  OHNE ENTSCHEIDUNG';
        console.log(`  ${marke.padEnd(30)} ${s.eigenschaft.padEnd(14)} ${s.selektor}`);
      }
    }
    console.log(`\n${gesamt} Lesestellen · ${gesamt - offen - fremd} zugeordnet · ${fremd} zweckfremd · ${offen} ohne Entscheidung.`);
  }
}
