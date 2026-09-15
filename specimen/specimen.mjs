import { report, REQUIREMENTS } from './requirements.mjs';

const tokens = await fetch('./tokens.json').then((a) => a.json());
const fragmente = await Promise.all(
  ['buttons', 'form', 'table'].map((n) => fetch(`./markup/${n}.html`).then((a) => a.text())));

document.getElementById('buehne').innerHTML = fragmente.join('\n<hr>\n');

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
