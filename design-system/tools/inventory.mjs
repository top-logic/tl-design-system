// Die Ratsche über dem Altbestand: zählt, was im alten tlReactControls.css an
// Literalen steckt (Farben, Schriftgrößen, Zeitangaben, z-index, outline: none).
//
// specimen/inventar.mjs zählt CSS-Werte gruppiert nach px für die Skalen-
// Dokumentation aus; das ist eine andere Frage als "wie viele Literale sind
// noch übrig, bevor die Datei leer ist". deklarationen() dort ist ein
// hand-geschriebener Regex-Parser, der Werte direkt aus dem CSS-Text zieht
// (auch außerhalb von Regel-Blöcken) und für Kürzel wie border-width Werte
// aufteilt — ihn Stück für Stück auf declarations() aus ./lib/css.mjs
// umzubauen wäre kein Anpassen von Imports und Pfaden mehr, sondern ein
// Nachbau der Kernlogik mit dem Risiko, die gezählten Werte stillschweigend
// zu verschieben. Deshalb bleibt hier nur das, was die Ratsche braucht:
// measure() auf Basis von declarations(), plus eine CLI, die das Ergebnis
// als JSON ausgibt.
//
// Aufruf: node inventory.mjs [pfad-zum-css]

import { declarations } from './lib/css.mjs';

/** Was die Ratsche zählt. Nur sinkend erlaubt. */
export function measure(css) {
  const lines = css.split('\n').length;
  const decls = declarations(css);
  const lit = (prop, re) => decls.filter((d) => d.property === prop && re.test(d.value.replace(/var\([^)]*\)/g, ''))).length;
  return {
    lines,
    literals: {
      color: (css.replace(/\/\*[\s\S]*?\*\//g, '').match(/#[0-9a-fA-F]{3,8}\b|\brgba?\(/g) ?? []).length,
      fontSize: lit('font-size', /\d/),
      duration: decls.filter((d) => /^(transition|animation)/.test(d.property) && /\d+m?s/.test(d.value)).length,
      zIndex: lit('z-index', /\d/),
      outlineNone: decls.filter((d) => d.property === 'outline' && /none/.test(d.value)).length,
    },
  };
}

// ---------------------------------------------------------------------------
// Aufruf von der Kommandozeile: node inventory.mjs [pfad]
// ---------------------------------------------------------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
  const { readFileSync } = await import('node:fs');
  const { join } = await import('node:path');
  const { homedir } = await import('node:os');

  const pfad = process.argv[2] ?? join(
    process.env.TL_WORKTREE ?? join(homedir(), 'git/tl8-wt-29584'),
    'com.top_logic.layout.react/src/main/webapp/style/tlReactControls.css',
  );
  const css = readFileSync(pfad, 'utf8');
  console.log(JSON.stringify(measure(css), null, 2));
}
