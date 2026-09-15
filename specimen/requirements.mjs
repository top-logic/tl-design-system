import { ratio, AA_TEXT, AA_NON_TEXT } from './contrast.mjs';

/** Eine Anforderung an normalen Text auf seinem Grund. */
export const text = (foreground, background) => ({ foreground, background, minimum: AA_TEXT });

/** Eine Anforderung an ein Icon oder die Begrenzung eines Controls. */
export const nonText = (foreground, background) => ({ foreground, background, minimum: AA_NON_TEXT });

/**
 * Die Paare, die Bedeutung tragen, und das Verhältnis, das jedes schuldet.
 *
 * War bis Stufe A deckungsgleich mit TestReactThemeContrast.REQUIREMENTS in tl-engine-7. Ein
 * deaktiviertes Control ist von WCAG ausgenommen und fehlt deshalb.
 *
 * AB STUFE A WEICHT DIESE LISTE ABSICHTLICH VOM JAVA-GATE AB. Grund: der Marken-Explorer im
 * Specimen leitet die Beschriftung einer gefüllten Fläche jetzt JE FLÄCHE ab (Entscheidung
 * Hendrik), nicht mehr über ein einziges globales `text-on-color`. Diese Liste bildet den
 * entschiedenen Zielzustand ab, den die Engine noch nicht hat — TestReactThemeContrast.java
 * kennt `text-on-brand`, `icon-on-brand` und `text-on-danger` noch nicht und muss beim
 * Nachziehen dieser Änderung entsprechend erweitert werden. Genau sechs Paare sind betroffen,
 * durch Umbenennen des Vordergrund-Tokens, nicht durch Hinzufügen oder Entfernen von Paaren:
 *   - text('text-on-color', 'button-primary')        → text('text-on-brand', 'button-primary')
 *   - text('text-on-color', 'button-primary-hover')   → text('text-on-brand', 'button-primary-hover')
 *   - text('text-on-color', 'button-primary-active')  → text('text-on-brand', 'button-primary-active')
 *   - text('text-on-color', 'button-danger')          → text('text-on-danger', 'button-danger')
 *   - text('text-on-color', 'button-danger-hover')    → text('text-on-danger', 'button-danger-hover')
 *   - nonText('icon-on-color', 'button-primary')      → nonText('icon-on-brand', 'button-primary')
 * `text('layer-accent-text', 'layer-accent')` bleibt unverändert — geprüft, dass der heutige
 * `layer-accent-text`-Wert bereits genau der ist, den dieselbe Ableitungsregel liefern würde
 * (siehe task-7-brand-report.md, Korrekturrunde 5), also keine Abweichung vom Java-Gate an
 * dieser Stelle. Bis dahin blieb die Gesamtzahl der Paare bei 22 — reine Umbenennung, keine
 * Erweiterung.
 *
 * EINE WEITERE, UNABHÄNGIGE ABWEICHUNG (Ticket #29108): `nonText('border-subtle', 'background')`
 * ist NEU in dieser Liste — eine ECHTE ERGÄNZUNG, keine Umbenennung. `border-subtle` ist der
 * Rahmen von `.tlReactTextInput` (`border: 1px solid var(--border-subtle)`) und damit die
 * Begrenzung eines Bedienelements im Sinn von WCAG 2.1, Kriterium 1.4.11 (Non-text Contrast,
 * Schwelle 3,0) — bislang prüfte das Gate nur `border-interactive` und `border-strong`, nicht
 * `border-subtle`, und deckte damit einen echten Mangel nicht auf: `#C4C7CC` gegen `background`
 * erreicht im hellen Modus nur 1,70. TestReactThemeContrast.java kennt dieses Paar noch nicht und
 * muss es beim Nachziehen von Stufe A ebenfalls aufnehmen. Die Gesamtzahl der Paare steigt dadurch
 * von 22 auf 23.
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

  // Beschriftung auf einer gefüllten Fläche — je Fläche eigenes Token, siehe Kommentar oben.
  text('text-on-brand', 'button-primary'),
  text('text-on-brand', 'button-primary-hover'),
  text('text-on-brand', 'button-primary-active'),
  text('text-on-danger', 'button-danger'),
  text('text-on-danger', 'button-danger-hover'),
  text('layer-accent-text', 'layer-accent'),

  // Text, der einen Zustand trägt, und die invertierte Fläche.
  text('text-error', 'background'),
  text('text-inverse', 'background-inverse'),

  // Links.
  text('link-primary', 'background'),
  text('link-primary-hover', 'background'),

  // Icons und Begrenzungen, die zeigen, wo ein Control ist.
  nonText('icon-on-brand', 'button-primary'),
  nonText('icon-primary', 'background'),
  nonText('border-interactive', 'background'),
  nonText('border-strong', 'background'),
  nonText('border-subtle', 'background'),
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
