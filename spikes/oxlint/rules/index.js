/**
 * TopLogic Design System — oxlint JS plugin (Spike).
 * Bewusst in ESLint-Rule-Shape geschrieben, damit ein Port nach ESLint
 * ein Config-Wechsel bleibt und kein Rewrite.
 */
const BANNED = new Set(['react', 'react-dom', 'react/jsx-runtime']);

/** Controls muessen React ueber die Bridge beziehen, nie direkt. */
const noReactImport = {
  meta: {
    type: 'problem',
    docs: { description: "React nur aus 'tl-react-bridge' importieren." },
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        const source = node.source.value;
        if (!BANNED.has(source)) return;
        context.report({
          node: node.source,
          message:
            `Import React from 'tl-react-bridge', never from '${source}'. ` +
            `A second React copy breaks all hooks at runtime ("useState is null").`,
        });
      },
    };
  },
};

export default {
  meta: { name: 'tl' },
  rules: { 'no-react-import': noReactImport },
};
