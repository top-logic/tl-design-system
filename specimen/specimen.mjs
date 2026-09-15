import { report, REQUIREMENTS } from './requirements.mjs';

const tokens = await fetch('./tokens.json').then((a) => a.json());
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

/** Trägt die Tokens eines Modus als Custom Properties auf das Wurzelelement. */
function anwenden(modus) {
  const wurzel = document.documentElement;
  for (const [name, wert] of Object.entries(tokens[modus])) {
    wurzel.style.setProperty(`--${name}`, wert);
  }
  wurzel.dataset.theme = modus;

  const probleme = report(modus, tokens[modus], REQUIREMENTS);
  const gate = document.getElementById('gate');
  gate.textContent = probleme.length === 0
    ? `Gate grün — ${REQUIREMENTS.length} Paare geprüft.`
    : probleme.join('\n');
  gate.className = `specimenGate specimenGate--${probleme.length === 0 ? 'gruen' : 'rot'}`;
  document.getElementById('gateKurz').textContent =
    `${REQUIREMENTS.length - probleme.length}/${REQUIREMENTS.length} Paare halten AA`;
}

document.getElementById('modus').addEventListener('change', (e) => anwenden(e.target.value));
anwenden('light');
