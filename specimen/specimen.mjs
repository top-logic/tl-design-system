import { REQUIREMENTS } from './requirements.mjs';
import { ratio } from './contrast.mjs';
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
    light: rampeAnwenden(rohTokens.light, rampe.light, 'light'),
    dark: rampeAnwenden(rohTokens.dark, rampe.dark, 'dark'),
    rampe,
  };
}

/**
 * Prüft alle 22 Paare für einen Modus gegen die gegebenen Tokens.
 *
 * Baut auf denselben REQUIREMENTS und derselben ratio() auf wie requirements.report() — nur mit
 * strukturiertem Ergebnis statt fertigem Text, damit sich Marken-Paare separat hervorheben und
 * beide Modi gleichzeitig anzeigen lassen.
 */
function gatePruefen(tokensDesModus) {
  let haltend = 0;
  const fehlend = [];
  for (const { foreground, background, minimum } of REQUIREMENTS) {
    const vorne = tokensDesModus[foreground];
    const hinten = tokensDesModus[background];
    const ist = ratio(vorne, hinten);
    if (ist >= minimum) {
      haltend++;
    } else {
      const marke = MARKEN_TOKENS.has(foreground) || MARKEN_TOKENS.has(background);
      fehlend.push({ foreground, background, vorne, hinten, ist, minimum, marke });
    }
  }
  return { haltend, gesamt: REQUIREMENTS.length, fehlend };
}

/** Eine kopierbare Hex-Anzeige für einen Rampen-Wert. */
function schwatch(name, hex) {
  const span = document.createElement('span');
  span.className = 'specimenMarke__schwatch';
  const feld = document.createElement('span');
  feld.className = 'specimenMarke__farbe';
  feld.style.background = hex;
  const text = document.createElement('span');
  text.className = 'specimenMarke__hex';
  text.title = 'Zum Kopieren markieren';
  text.textContent = `${name}: ${hex}`;
  span.append(feld, text);
  return span;
}

/** Zeichnet die Rampen-Ausgabe (hell + dunkel), kopierbar als Hexwerte. */
function rampeZeichnen(rampe) {
  const hell = document.getElementById('rampeHell');
  const dunkel = document.getElementById('rampeDunkel');
  hell.replaceChildren(...Object.entries(rampe.light).map(([n, h]) => schwatch(n, h)));
  dunkel.replaceChildren(...Object.entries(rampe.dark).map(([n, h]) => schwatch(n, h)));
}

/** Zeichnet das Gate-Panel: Zahlen für beide Modi getrennt, fehlende Paare mit Verhältnis,
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
      zeile.textContent = `'${f.foreground}' (${f.vorne}) auf '${f.background}' (${f.hinten}) `
        + `erreicht ${f.ist.toFixed(2)}, unter den ${f.minimum.toFixed(1)}, die WCAG 2.1 AA verlangt.`;
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
  gateZeichnen(gatePruefen(light), gatePruefen(dark));
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
