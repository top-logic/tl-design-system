import { REQUIREMENTS, report } from './requirements.mjs';
import { markenRampe, rampeAnwenden, beschriftungAbleiten, hexZuOklch, oklchZuHex } from './brand.mjs';

/** Die heutige Markenfarbe — Ausgangspunkt des Reglers, nicht ein empfohlener Wert. */
const MARKE_STARTWERT = '#2968C8';

/** Token-Namen, an denen die Marke hängt — für die "welche Paare fallen"-Anzeige hervorgehoben.
 *  text-on-brand/icon-on-brand gehören dazu: ihr Wert hängt vom Kontrast gegen brand-primary ab.
 *  text-on-danger und layer-accent-text NICHT — die werden zwar genauso abgeleitet (zwei
 *  Kandidaten, höherer Kontrast gewinnt), aber gegen eine Fläche, die sich mit der Marke gar
 *  nicht ändert (button-danger, layer-accent sind fest). Nur was WIRKLICH von der gewählten
 *  Marke abhängt, verdient hier den Stern. */
const MARKEN_TOKENS = new Set([
  'button-primary', 'button-primary-hover', 'button-primary-active',
  'button-secondary', 'button-secondary-hover', 'button-secondary-active',
  'border-interactive', 'focus', 'interactive', 'link-primary', 'link-primary-hover',
  'text-on-brand', 'icon-on-brand',
]);

// -------------------------------------------------------------------------------------------
// Grundflächen-Regler (Ticket #29108): vier Stufen für die vier heute reinweißen Tokens
// (background, layer-01, layer-02, color-surface) — reines Weiß, zwei neutrale Abtönungen und
// eine markengetönte Stufe. Wirkt NUR im hellen Modus: die vier Tokens sind dort #FFFFFF, im
// dunklen Modus sind ihre heutigen Werte bereits dunkel (#1A1C1E/#1F2327/#262A2E) und keine
// "gedämpft"-Lesart aus der Aufgabe übersetzt sich sinnvoll auf sie — es gibt keine natürliche
// Entsprechung zu "etwas weniger weiß" auf einer Fläche, die schon fast schwarz ist. Der Regler
// bleibt im dunklen Modus deshalb bewusst wirkungslos (siehe Bericht).
// -------------------------------------------------------------------------------------------

/** Die vier Tokens, auf die der Grundflächen-Regler wirkt — heute reines #FFFFFF. */
const GRUNDFLAECHEN_TOKENS = ['background', 'layer-01', 'layer-02', 'color-surface'];

/** Ziel-Helligkeit/-Chroma der markengetönten Stufe, in OKLCH. Sehr geringes Chroma (0,01) hält
 *  die Fläche praktisch neutral, aber erkennbar zur Marke hin verschoben; L=0,975 liegt zwischen
 *  den beiden neutralen Stufen (0,98 und 0,97 in sRGB-Prozent gedacht) und bleibt weit im Gamut
 *  (keine Chroma-Reduktion nötig, siehe oklchZuHex()). Derselbe Farbton (H) wie die Marke —
 *  Chroma und Farbton sind unabhängig von L, deshalb ändert sich diese Stufe automatisch mit,
 *  wenn die Markenfarbe wechselt, ohne dass hexZuOklch/oklchZuHex hier neu geschrieben werden.
 */
const GRUNDFLAECHE_MARKENTON_L = 0.975;
const GRUNDFLAECHE_MARKENTON_C = 0.01;

/** Die vier Stufen des Reglers. `marke` ist eine Funktion, weil sie von der aktuellen
 *  Markenfarbe abhängt — die anderen drei sind feste Hexwerte. */
const GRUNDFLAECHEN_STUFEN = {
  weiss: { name: 'reines Weiß', hex: () => '#FFFFFF' },
  n98: { name: 'neutral 98 %', hex: () => '#FAFAFA' },
  n97: { name: 'neutral 97 %', hex: () => '#F7F7F8' },
  marke: {
    name: 'markengetönt',
    hex: (markenfarbeHex) => {
      const { H } = hexZuOklch(markenfarbeHex);
      return oklchZuHex({ L: GRUNDFLAECHE_MARKENTON_L, C: GRUNDFLAECHE_MARKENTON_C, H }).hex;
    },
  },
};

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
let grundflaecheStufe = 'weiss';

/**
 * Kandidaten, zwischen denen JEDE Beschriftungs-Ableitung entscheidet — die Regel verlangt
 * ausdrücklich die Werte, die tokens.json schon führt: text-primary des hellen Modus als
 * dunklen Kandidaten, Weiß als hellen. Aus rohTokens gelesen, nicht fest hingeschrieben —
 * ändert sich tokens.json, zieht jede Ableitung automatisch mit. Dieselben zwei Kandidaten für
 * alle Flächen (brand, danger, accent) — nur die Fläche, gegen die geprüft wird, wechselt.
 */
const BESCHRIFTUNGS_KANDIDATEN = {
  dunklerKandidat: rohTokens.light['text-primary'],
  hellerKandidat: '#FFFFFF',
};

/**
 * Die Tokens beider Modi mit der aktuellen Markenfarbe eingesetzt — rohTokens bleibt unberührt.
 *
 * Beschriftung wird JE FLÄCHE abgeleitet, nicht mehr einmal global (Entscheidung Hendrik,
 * Korrekturrunde 5): rampeAnwenden() liefert schon text-on-brand/icon-on-brand (hängt an der
 * Marke, daher Teil der Rampe selbst). text-on-danger und layer-accent-text hängen NICHT an der
 * Marke — button-danger und layer-accent ändern sich nicht, wenn der Regler bewegt wird — und
 * werden deshalb hier, direkt gegen die (unveränderten) Flächen-Hexwerte, separat abgeleitet.
 */
function beschriftungenAbleiten(tokensDesModus) {
  return {
    ...tokensDesModus,
    'text-on-danger': beschriftungAbleiten(tokensDesModus['button-danger'], BESCHRIFTUNGS_KANDIDATEN).hex,
    'layer-accent-text': beschriftungAbleiten(tokensDesModus['layer-accent'], BESCHRIFTUNGS_KANDIDATEN).hex,
  };
}

/** Trägt die gewählte Grundflächen-Stufe in die vier betroffenen Tokens EINES Modus ein — als
 *  neues Objekt, das gegebene bleibt unverändert. Nur der helle Modus wird tatsächlich verändert
 *  (siehe Kommentar über GRUNDFLAECHEN_TOKENS); der dunkle Modus kommt unverändert zurück. */
function grundflaecheAnwenden(tokensDesModus, modus) {
  if (modus !== 'light') return tokensDesModus;
  const hex = GRUNDFLAECHEN_STUFEN[grundflaecheStufe].hex(markenfarbe);
  const ergebnis = { ...tokensDesModus };
  for (const name of GRUNDFLAECHEN_TOKENS) ergebnis[name] = hex;
  return ergebnis;
}

function effektiveTokens() {
  const rampe = markenRampe(markenfarbe, BESCHRIFTUNGS_KANDIDATEN);
  return {
    light: grundflaecheAnwenden(beschriftungenAbleiten(rampeAnwenden(rohTokens.light, rampe.light)), 'light'),
    dark: grundflaecheAnwenden(beschriftungenAbleiten(rampeAnwenden(rohTokens.dark, rampe.dark)), 'dark'),
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

/**
 * Eine kopierbare Anzeige für eine abgeleitete Beschriftungsfarbe (text-on-brand/icon-on-brand,
 * text-on-danger, layer-accent-text/text-on-accent): Hexwert, welcher der beiden Kandidaten
 * gewonnen hat, und das erreichte Kontrastverhältnis gegen DIESE Fläche — die Zahl, die die
 * Entscheidung erklärt. `beschriftung` benennt die betroffenen Token(s) für die Anzeige.
 */
function beschriftungSchwatch(beschriftung, flaeche, eintrag) {
  const { hex, verhaeltnis, kandidat } = eintrag;
  const span = document.createElement('span');
  span.className = 'specimenMarke__schwatch';
  const feld = document.createElement('span');
  feld.className = 'specimenMarke__farbe';
  feld.style.background = hex;
  const text = document.createElement('span');
  text.className = 'specimenMarke__hex';
  text.title = 'Zum Kopieren markieren';
  text.textContent = `${beschriftung}: ${hex}`;
  const hinweis = document.createElement('span');
  hinweis.className = 'specimenMarke__hinweis';
  hinweis.textContent = `ⓘ Kandidat „${kandidat}" gewinnt — Verhältnis ${verhaeltnis.toFixed(2)} gegen ${flaeche}`;
  span.append(feld, text, hinweis);
  return span;
}

/**
 * Zeichnet die Rampen-Ausgabe (hell + dunkel), kopierbar als Hexwerte, mit Warnung je Stufe,
 * plus je Modus DREI unabhängig abgeleitete Beschriftungen: für button-primary (an der Marke,
 * Teil der Rampe selbst), für button-danger und für layer-accent (beide unabhängig von der
 * Marke, separat berechnet — `beschriftungenSonstige`).
 *
 * Grundsatz, den diese drei Zeilen zeigen: Hover und Active erben die Beschriftung ihrer
 * Grundfläche (brand-text-on-brand gilt für button-primary UND -hover UND -active) — eine
 * Schriftfarbe, die beim Überfahren umspringt, würde flackern.
 */
function rampeZeichnen(rampe, beschriftungenSonstige) {
  const hell = document.getElementById('rampeHell');
  const dunkel = document.getElementById('rampeDunkel');
  const primitiven = (rampeModus) => Object.entries(rampeModus).filter(([n]) => n !== 'brand-text-on-brand');
  hell.replaceChildren(
    ...primitiven(rampe.light).map(([n, e]) => schwatch(n, e)),
    beschriftungSchwatch('text-on-brand / icon-on-brand', 'button-primary', rampe.light['brand-text-on-brand']),
    beschriftungSchwatch('text-on-danger', 'button-danger', beschriftungenSonstige.light.danger),
    beschriftungSchwatch('layer-accent-text (text-on-accent)', 'layer-accent', beschriftungenSonstige.light.accent));
  dunkel.replaceChildren(
    ...primitiven(rampe.dark).map(([n, e]) => schwatch(n, e)),
    beschriftungSchwatch('text-on-brand / icon-on-brand', 'button-primary', rampe.dark['brand-text-on-brand']),
    beschriftungSchwatch('text-on-danger', 'button-danger', beschriftungenSonstige.dark.danger),
    beschriftungSchwatch('layer-accent-text (text-on-accent)', 'layer-accent', beschriftungenSonstige.dark.accent));
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

/** Leitet die Beschriftung für button-danger und layer-accent ab — für die Anzeige, mit
 *  Verhältnis und gewonnenem Kandidaten. Unabhängig von der Marke: beide Flächen ändern sich
 *  nicht, wenn der Regler bewegt wird, deshalb reicht rohTokens (nicht der Modus-Rampen-Wert). */
function beschriftungenAnzeigen(modus) {
  return {
    danger: beschriftungAbleiten(rohTokens[modus]['button-danger'], BESCHRIFTUNGS_KANDIDATEN),
    accent: beschriftungAbleiten(rohTokens[modus]['layer-accent'], BESCHRIFTUNGS_KANDIDATEN),
  };
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

  rampeZeichnen(rampe, { light: beschriftungenAnzeigen('light'), dark: beschriftungenAnzeigen('dark') });
  gateZeichnen(gatePruefen('light', light), gatePruefen('dark', dark));
  grundflaecheAnzeigen();
}

/** Zeichnet die Anzeige des Grundflächen-Reglers: Farbfeld, Hexwert der aktuellen Stufe, und im
 *  dunklen Modus einen Hinweis, dass der Regler dort ohne Wirkung bleibt. */
function grundflaecheAnzeigen() {
  const hex = GRUNDFLAECHEN_STUFEN[grundflaecheStufe].hex(markenfarbe);
  document.getElementById('grundflaecheFarbe').style.background = hex;
  document.getElementById('grundflaecheHex').textContent = hex;
  document.getElementById('grundflaecheHinweis').textContent = aktuellerModus === 'dark'
    ? 'ⓘ im dunklen Modus ohne Wirkung — die vier Tokens sind dort bereits dunkel, keine "gedämpft"-Lesart passt.'
    : '';
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

document.getElementById('grundflaeche').addEventListener('change', (e) => {
  grundflaecheStufe = e.target.value;
  neuZeichnen();
});

neuZeichnen();
