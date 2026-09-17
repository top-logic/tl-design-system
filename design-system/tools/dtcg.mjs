// W3C Design Tokens (DTCG). Quelle für Figma und Kundenwerkzeuge. Aliase bleiben Aliase.
const REF = /^\{([a-z0-9-]+)\}$/;

function primType(group, name, value) {
  if (group === 'color') return 'color';
  if (group === 'font') return 'fontFamily';
  if (group === 'motion') return name.startsWith('dur-') ? 'duration' : 'cubicBezier';
  if (group === 'effect') return name.startsWith('shadow-') ? 'shadow' : 'color';
  return /^\d+$/.test(value) ? 'number' : 'dimension';
}

function primGroupOf(P, name) {
  for (const [g, o] of Object.entries(P)) if (typeof o === 'object' && name in o) return g;
  throw new Error(`Primitive ${name} in keiner Gruppe`);
}

function alias(P, v) {
  const m = REF.exec(String(v));
  return m ? { alias: `{primitive.${primGroupOf(P, m[1])}.${m[1]}}`, name: m[1] } : null;
}

function semantic(P, o, typeOf) {
  const out = {};
  for (const [n, v] of Object.entries(o)) {
    if (n.startsWith('_')) continue;
    const a = alias(P, v);
    out[n] = { $type: typeOf(n, a?.name), $value: a ? a.alias : v };
  }
  return out;
}

export function dtcg(P, T) {
  const primitive = {};
  for (const [g, o] of Object.entries(P)) {
    if (typeof o !== 'object') continue;
    primitive[g] = {};
    for (const [n, v] of Object.entries(o)) primitive[g][n] = { $type: primType(g, n, v), $value: v };
  }
  const colorType = () => 'color';
  const measureType = (n) => n.startsWith('font-family') ? 'fontFamily' : n.startsWith('duration') ? 'duration' : n.startsWith('easing') ? 'cubicBezier' : 'dimension';
  const effectType = (n) => n.startsWith('shadow') ? 'shadow' : 'color';
  const mode = (m) => ({
    $extensions: { 'com.top-logic.mode': m },
    color: semantic(P, T.color[m], colorType),
    effect: semantic(P, T.effect[m], effectType),
  });
  const measure = semantic(P, T.measure, measureType);
  const layer = semantic(P, T.layer, () => 'number');
  const density = {
    normal: semantic(P, T.density.normal, () => 'dimension'),
    compact: semantic(P, T.density.compact, () => 'dimension'),
  };
  return {
    $description: 'TopLogic Design System. Quelle: design-system/src. Erzeugt, nicht von Hand ändern.',
    primitive,
    semantic: { light: mode('light'), dark: mode('dark'), measure, layer, density },
  };
}
