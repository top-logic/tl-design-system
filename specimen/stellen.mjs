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
 * Was die Eigenschaft allein schon entscheidet.
 *
 * Bei den Semantikfarben trennt die Regel nach der Aufgabe — Text, Linie,
 * Fläche — und genau die steht in der Eigenschaft. Diese Stellen brauchen
 * keinen Menschen. Was hier nicht abgedeckt ist, braucht einen.
 */
export const NACH_EIGENSCHAFT = {
  color: 'text',
  'border-color': 'border',
  border: 'border',
  'border-top': 'border', 'border-right': 'border', 'border-bottom': 'border', 'border-left': 'border',
  outline: 'border',
  'outline-color': 'border',
  background: 'surface',
  'background-color': 'surface',
  'accent-color': 'surface',
};

/** Ordnet eine Stelle einem Ziel zu, soweit die Eigenschaft das hergibt. */
export function zuordnen(stelle, ziele) {
  const rolle = NACH_EIGENSCHAFT[stelle.eigenschaft];
  if (!rolle) return null;
  // Die Semantikfarben tragen die Aufgabe im Namen: support-error-text usw.
  const treffer = ziele.filter((z) => z.endsWith(`-${rolle}`));
  return treffer.length === 1 ? treffer[0] : null;
}

/**
 * Alle Lesestellen der mehrdeutigen Tokens, je Stelle mit dem Ziel, das die
 * Eigenschaft hergibt — oder `null`, wo eine Entscheidung am Bild nötig ist.
 */
export function stellenBericht(css, abbildung) {
  const raus = {};
  for (const [name, e] of Object.entries(abbildung.farbe)) {
    if (e.art !== 'mehrdeutig') continue;
    const stellen = lesestellen(css, name).map((s) => ({ ...s, ziel: zuordnen(s, e.ziele) }));
    raus[name] = {
      natur: e.natur,
      ziele: e.ziele,
      regel: e.regel,
      stellen,
      zugeordnet: stellen.filter((s) => s.ziel).length,
      offen: stellen.filter((s) => !s.ziel).length,
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
  const bericht = stellenBericht(css, abbildung);

  const nur = process.argv.slice(2).find((a) => !a.startsWith('--'));
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(nur ? { [nur]: bericht[nur] } : bericht, null, 2));
  } else {
    let gesamt = 0; let offen = 0;
    for (const [name, b] of Object.entries(bericht)) {
      if (nur && name !== nur) continue;
      gesamt += b.stellen.length; offen += b.offen;
      console.log(`\n== ${name} == ${b.stellen.length} Stellen · ${b.zugeordnet} durch die Eigenschaft entschieden`
        + `, ${b.offen} offen${b.natur === 'aufteilung' ? '  [AUFTEILUNG — nicht zu wählen]' : ''}`);
      for (const s of b.stellen) {
        const marke = s.ziel ? `→ ${s.ziel}` : '?';
        console.log(`  ${marke.padEnd(26)} ${s.eigenschaft.padEnd(14)} ${s.selektor.replace(/\s+/g, ' ')}`);
      }
    }
    console.log(`\n${gesamt} Lesestellen, davon ${offen} ohne Zuordnung durch die Eigenschaft.`);
  }
}
