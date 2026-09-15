import { REQUIREMENTS, report } from './requirements.mjs';
import { markenRampe, rampeAnwenden } from './brand.mjs';

/** Die heutige Markenfarbe — Ausgangspunkt des Reglers, nicht ein empfohlener Wert. */
const MARKE_STARTWERT = '#2968C8';

/** Token-Namen, an denen die Marke hängt — für die "welche Paare fallen"-Anzeige hervorgehoben. */
const MARKEN_TOKENS = new Set([
  'button-primary', 'button-primary-hover', 'button-primary-active',
  'button-secondary', 'button-secondary-hover', 'button-secondary-active',
  'border-interactive', 'focus', 'interactive', 'link-primary', 'link-primary-hover',
]);

const rohTokens = await fetch('./tokens.json').then((a) => a.json());
const fragmente = await Promise.all(
  ['buttons', 'form', 'table'].map((n) => fetch(`./markup/${n}.html`).then((a) => a.text())));
const typoProbe = await fetch('./markup/typo.html').then((a) => a.text());

const buehne = document.getElementById('buehne');
const ansichten = { fragmente: fragmente.join('\n<hr>\n'), typo: typoProbe };

/**
 * Misst die tatsächliche, gerenderte Zeilenhöhe je Typo-Stufe und schreibt sie in die
 * dazugehörige Anzeige. Ausgelesen mit getComputedStyle, nicht hingeschrieben — sonst würde
 * die Probe genau die Frage vortäuschen, die sie eigentlich beantworten soll.
 */
function zeilenhoeheMessen() {
  for (const stufe of buehne.querySelectorAll('.specimenTypoStufe')) {
    const zeile = stufe.querySelector('.tlTableView__row');
    const anzeige = stufe.querySelector('.specimenTypoStufe__messung');
    if (!zeile || !anzeige) continue;
    const hoehe = getComputedStyle(zeile).height;
    const reihe = anzeige.dataset.messungReihe === 'auto' ? 'abgeleitet' : 'fest';
    anzeige.textContent = `Gemessene Zeilenhöhe (${reihe}): ${hoehe}`;
  }
}

/** Wechselt zwischen den Fragmenten (Buttons/Formular/Tabelle) und der Typo-Probe. */
function ansichtAnwenden(name) {
  buehne.innerHTML = ansichten[name];
  if (name === 'typo') zeilenhoeheMessen();
}

document.getElementById('ansicht').addEventListener('change', (e) => ansichtAnwenden(e.target.value));
ansichtAnwenden('fragmente');

/** Trägt die gewählte Schriftfamilie als Custom Property auf das Wurzelelement. */
function schriftAnwenden(stapel) {
  document.documentElement.style.setProperty('--specimenSchrift', stapel);
  // Die Schriftgröße/-metrik kann die abgeleitete Zeilenhöhe ändern — neu messen, falls die
  // Typo-Probe gerade sichtbar ist.
  if (document.getElementById('ansicht').value === 'typo') zeilenhoeheMessen();
}

document.getElementById('schrift').addEventListener('change', (e) => schriftAnwenden(e.target.value));
schriftAnwenden(document.getElementById('schrift').value);

// -------------------------------------------------------------------------------------------
// Marken-Explorer: Grundfarbe wählen, Rampe ableiten, Tokens beider Modi zur Laufzeit ersetzen,
// Oberfläche und Gate neu rechnen. tokens.json bleibt dabei unangetastet — rohTokens ist der
// unveränderte Ausgangsstand, effektiveTokens() rechnet bei jeder Änderung neu darüber.
// -------------------------------------------------------------------------------------------

let markenfarbe = MARKE_STARTWERT;
let aktuellerModus = 'light';

/** Die Tokens beider Modi mit der aktuellen Markenfarbe eingesetzt — rohTokens bleibt unberührt. */
function effektiveTokens() {
  const rampe = markenRampe(markenfarbe);
  return {
    light: rampeAnwenden(rohTokens.light, rampe.light),
    dark: rampeAnwenden(rohTokens.dark, rampe.dark),
    rampe,
  };
}

/**
 * Prüft alle 22 Paare für einen Modus gegen die gegebenen Tokens.
 *
 * Ruft requirements.report() auf — dieselbe Funktion, dieselbe Meldung, derselbe Schutz gegen
 * ein Token, das es nicht gibt. Kein zweiter, selbst mitgeführter Prüfweg, an dem Gate und
 * Anzeige auseinanderdriften könnten. Die Marken-Markierung (★) entsteht danach, indem jede
 * Meldung auf einen der MARKEN_TOKENS-Namen geprüft wird — report() formatiert jeden
 * Tokennamen immer als '<name>' in Anführungszeichen, das Muster ist stabil.
 */
function gatePruefen(modus, tokensDesModus) {
  const meldungen = report(modus, tokensDesModus, REQUIREMENTS);
  const fehlend = meldungen.map((text) => ({
    text,
    marke: [...MARKEN_TOKENS].some((name) => text.includes(`'${name}'`)),
  }));
  return { haltend: REQUIREMENTS.length - fehlend.length, gesamt: REQUIREMENTS.length, fehlend };
}

/**
 * Eine kopierbare Hex-Anzeige für einen Rampen-Wert, mit Warnung bei Gamut-Anpassung.
 * `eintrag` ist { hex, reduziert, geklemmt, kollabiert } aus brand.mjs.
 *
 * Drei Zustände, klar unterschieden:
 *   - kollabiert (rot, kräftig): diese Stufe ist von einer anderen nicht mehr zu unterscheiden.
 *   - reduziert (gedeckter, informativ): normaler Zustand — dieser Ton ist in dieser Helligkeit
 *     nicht in voller Sättigung darstellbar, die Chroma wurde gesenkt, L und H blieben stehen.
 *   - geklemmt (Fehlerfall, sollte praktisch nie auftreten): selbst entsättigt außerhalb des
 *     Gamuts — ein Fehler in der Ableitung, keine normale Gamut-Anpassung.
 */
function schwatch(name, eintrag) {
  const { hex, reduziert, geklemmt, kollabiert } = eintrag;
  const span = document.createElement('span');
  span.className = 'specimenMarke__schwatch'
    + (reduziert ? ' specimenMarke__schwatch--reduziert' : '')
    + (geklemmt ? ' specimenMarke__schwatch--geklemmt' : '')
    + (kollabiert ? ' specimenMarke__schwatch--kollabiert' : '');
  const feld = document.createElement('span');
  feld.className = 'specimenMarke__farbe';
  feld.style.background = hex;
  const text = document.createElement('span');
  text.className = 'specimenMarke__hex';
  text.title = 'Zum Kopieren markieren';
  text.textContent = `${name}: ${hex}`;
  span.append(feld, text);
  if (kollabiert) {
    const warnung = document.createElement('span');
    warnung.className = 'specimenMarke__warnung';
    warnung.textContent = '⚠ kollabiert — nicht mehr von einer anderen Stufe zu unterscheiden';
    span.appendChild(warnung);
  } else if (geklemmt) {
    const warnung = document.createElement('span');
    warnung.className = 'specimenMarke__warnung';
    warnung.textContent = '⚠ Fehler: selbst entsättigt außerhalb des Farbraums';
    span.appendChild(warnung);
  } else if (reduziert) {
    const warnung = document.createElement('span');
    warnung.className = 'specimenMarke__hinweis';
    warnung.textContent = 'ⓘ Sättigung zurückgenommen — in voller Sättigung hier nicht darstellbar';
    span.appendChild(warnung);
  }
  return span;
}

/** Zeichnet die Rampen-Ausgabe (hell + dunkel), kopierbar als Hexwerte, mit Warnung je Stufe. */
function rampeZeichnen(rampe) {
  const hell = document.getElementById('rampeHell');
  const dunkel = document.getElementById('rampeDunkel');
  hell.replaceChildren(...Object.entries(rampe.light).map(([n, e]) => schwatch(n, e)));
  dunkel.replaceChildren(...Object.entries(rampe.dark).map(([n, e]) => schwatch(n, e)));
}

/** Zeichnet das Gate-Panel: Zahlen für beide Modi getrennt, fehlende Paare als Meldung,
 *  Marken-beteiligte Paare mit ★ hervorgehoben. */
function gateZeichnen(ergebnisHell, ergebnisDunkel) {
  const gate = document.getElementById('gate');
  gate.replaceChildren();
  gate.className = 'specimenGate';

  for (const [titel, ergebnis] of [['hell', ergebnisHell], ['dunkel', ergebnisDunkel]]) {
    const kopf = document.createElement('div');
    kopf.className = 'specimenGate__kopf';
    kopf.textContent = `${titel}: ${ergebnis.haltend}/${ergebnis.gesamt} Paare halten AA`
      + (ergebnis.fehlend.length ? ` — ${ergebnis.fehlend.length} Verstöße` : ' — grün');
    gate.appendChild(kopf);

    for (const f of ergebnis.fehlend) {
      const zeile = document.createElement('div');
      zeile.className = `specimenGate__zeile${f.marke ? ' specimenGate__marke' : ''}`;
      zeile.textContent = f.text;
      gate.appendChild(zeile);
    }
  }

  document.getElementById('gateKurz').textContent =
    `hell ${ergebnisHell.haltend}/${ergebnisHell.gesamt} · dunkel ${ergebnisDunkel.haltend}/${ergebnisDunkel.gesamt} halten AA`;
}

/** Trägt die Tokens des aktuell angezeigten Modus als Custom Properties auf das Wurzelelement,
 *  rechnet die Rampe neu und zeichnet Rampen-Ausgabe und Gate für beide Modi. */
function neuZeichnen() {
  const { light, dark, rampe } = effektiveTokens();
  const wurzel = document.documentElement;
  const tokensDesModus = aktuellerModus === 'light' ? light : dark;
  for (const [name, wert] of Object.entries(tokensDesModus)) {
    wurzel.style.setProperty(`--${name}`, wert);
  }
  wurzel.dataset.theme = aktuellerModus;

  rampeZeichnen(rampe);
  gateZeichnen(gatePruefen('light', light), gatePruefen('dark', dark));
}

document.getElementById('modus').addEventListener('change', (e) => {
  aktuellerModus = e.target.value;
  neuZeichnen();
});

const markeFarbeEingabe = document.getElementById('markeFarbe');
const markeHexEingabe = document.getElementById('markeHex');
const HEX_MUSTER = /^#[0-9a-f]{6}$/i;

function markenfarbeSetzen(hex) {
  markenfarbe = hex.toUpperCase();
  markeFarbeEingabe.value = markenfarbe;
  markeHexEingabe.value = markenfarbe;
  neuZeichnen();
}

markeFarbeEingabe.addEventListener('input', (e) => markenfarbeSetzen(e.target.value));
markeHexEingabe.addEventListener('input', (e) => {
  const wert = e.target.value.trim();
  if (HEX_MUSTER.test(wert)) markenfarbeSetzen(wert);
});
document.getElementById('markeZuruecksetzen').addEventListener('click', () => markenfarbeSetzen(MARKE_STARTWERT));

neuZeichnen();
