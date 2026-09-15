import { ratio, AA_TEXT, AA_NON_TEXT } from './contrast.mjs';

/** Eine Anforderung an normalen Text auf seinem Grund. */
export const text = (foreground, background) => ({ foreground, background, minimum: AA_TEXT });

/** Eine Anforderung an ein Icon oder die Begrenzung eines Controls. */
export const nonText = (foreground, background) => ({ foreground, background, minimum: AA_NON_TEXT });

/**
 * Die Paare, die Bedeutung tragen, und das Verhältnis, das jedes schuldet.
 *
 * Deckungsgleich mit TestReactThemeContrast.REQUIREMENTS in tl-engine-7. Ein deaktiviertes
 * Control ist von WCAG ausgenommen und fehlt deshalb.
 */
export const REQUIREMENTS = [
  // Fließtext auf den Flächen, auf denen er steht.
  text('text-primary', 'background'),
  text('text-primary', 'layer-01'),
  text('text-primary', 'layer-02'),
  text('text-secondary', 'background'),
  text('text-secondary', 'layer-01'),
  text('text-helper', 'background'),
  text('text-placeholder', 'field'),

  // Beschriftung auf einer gefüllten Fläche.
  text('text-on-color', 'button-primary'),
  text('text-on-color', 'button-primary-hover'),
  text('text-on-color', 'button-primary-active'),
  text('text-on-color', 'button-danger'),
  text('text-on-color', 'button-danger-hover'),
  text('layer-accent-text', 'layer-accent'),

  // Text, der einen Zustand trägt, und die invertierte Fläche.
  text('text-error', 'background'),
  text('text-inverse', 'background-inverse'),

  // Links.
  text('link-primary', 'background'),
  text('link-primary-hover', 'background'),

  // Icons und Begrenzungen, die zeigen, wo ein Control ist.
  nonText('icon-on-color', 'button-primary'),
  nonText('icon-primary', 'background'),
  nonText('border-interactive', 'background'),
  nonText('border-strong', 'background'),
  nonText('focus', 'background'),
];

/**
 * Meldet jede Anforderung, die das gegebene Theme verfehlt.
 *
 * Eine Anforderung, die ein Token benennt, das es nicht gibt, ist ein Fehler für sich — ein still
 * übersprungenes Paar wäre ein Gate, das aufhört zu wachen, sobald jemand ein Token umbenennt.
 */
export function report(themeId, tokens, requirements) {
  const problems = [];
  for (const { foreground, background, minimum } of requirements) {
    const vorne = tokens[foreground];
    const hinten = tokens[background];
    if (vorne === undefined || hinten === undefined) {
      const fehlt = vorne === undefined ? foreground : background;
      problems.push(`${themeId}: kein Token '${fehlt}', benannt von '${foreground}' auf '${background}'.`);
      continue;
    }
    const ist = ratio(vorne, hinten);
    if (ist < minimum) {
      problems.push(
        `${themeId}: '${foreground}' (${vorne}) auf '${background}' (${hinten}) erreicht `
        + `${ist.toFixed(2)}, unter den ${minimum.toFixed(1)}, die WCAG 2.1 AA verlangt.`);
    }
  }
  return problems;
}
