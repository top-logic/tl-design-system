import { report, REQUIREMENTS } from './requirements.mjs';

const tokens = await fetch('./tokens.json').then((a) => a.json());
const fragmente = await Promise.all(
  ['buttons', 'form', 'table'].map((n) => fetch(`./markup/${n}.html`).then((a) => a.text())));
const typoProbe = await fetch('./markup/typo.html').then((a) => a.text());

const buehne = document.getElementById('buehne');
const ansichten = { fragmente: fragmente.join('\n<hr>\n'), typo: typoProbe };

/** Wechselt zwischen den Fragmenten (Buttons/Formular/Tabelle) und der Typo-Probe. */
function ansichtAnwenden(name) {
  buehne.innerHTML = ansichten[name];
}

document.getElementById('ansicht').addEventListener('change', (e) => ansichtAnwenden(e.target.value));
ansichtAnwenden('fragmente');

/** Trägt die gewählte Schriftfamilie als Custom Property auf das Wurzelelement. */
function schriftAnwenden(stapel) {
  document.documentElement.style.setProperty('--specimenSchrift', stapel);
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
