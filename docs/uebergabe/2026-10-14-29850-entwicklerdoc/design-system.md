---
description: Read before writing or changing CSS, a className or a state of a React control in com.top_logic.layout.react, or before creating a new client component - the design-system package (tl- classes, --tl-* tokens, states as attributes, type classes) that new and migrated controls are styled with, and what must not be added to tlReactControls.css.
order: 34
---

# The design-system package

The look of the React controls comes from the package of the repository `TopLogic/tl-design-system`
(folder `design-system/`). The engine serves its output from
`com.top_logic.layout.react/src/main/webapp/style/tl-design-system/` - `primitives.css` (values),
`tokens.css` (roles referring to the values, per mode and density), `base.css` (type classes, icon
sizes, the focus ring, reduced motion) and `components.css` (the components) - as `ClientResources`
in the layer `tl` ([cascade layers](doc:view-layer/theme-tokens#cascade-layers)).

These files are a **copy**. They are generated in the package and published into the engine; an edit
to the copy is overwritten by the next publish, and a test of the package fails while the copy
differs. A change to the look is made in the package.

The old stylesheet `tlReactControls.css` is emptied component by component. A control is migrated when
its block there is gone, not when it looks like before. A ratchet in the package counts the lines of
every block and fails when one grows. Controls not migrated yet still read the theme tokens of
`tl-react-theme.config.xml` ([theme tokens](doc:view-layer/theme-tokens)); new code does not.

## The rules

Each rule runs as a test or as the class gate of the package (`node --test`,
`node tools/lint-css.mjs`).

| Rule | In practice |
| --- | --- |
| Names | English, kebab-case, BEM with the prefix `tl`: `.tl-<block>`, `.tl-<block>__<element>`, `.tl-<block>--<modifier>`. A modifier is a variant the author chooses (`--primary`, `--danger`, `--start`), never a state. |
| States are attributes | `:disabled`, `[aria-pressed]`, `[aria-expanded]`, `[aria-selected]`, `[aria-invalid]`, `[aria-busy]`, `:focus-visible`; any other state is a word in `data-tl-state` (several words, matched with `~=`: `entering`, `exiting`, `open`). A role the server sends is `data-tl-role` (`error`, `category-3`). A class `--active`, `--open` or `--loading` breaks the gate. |
| Values only from tokens | Colour, spacing, size, radius, shadow, layer, duration and easing are `var(--tl-…)`. No hex, no `px`/`rem`, no `ms`, no `rgba`, no literal `z-index`. Allowed keywords: `0`, `1`, `auto`, `none`, `100%`, `currentColor`, `inherit`, `transparent`. |
| Closed categories | `surface`, `text`, `icon`, `border`, `focus`, `shadow`, `space`, `radius`, `size`, `font`, `duration`, `easing`, `layer`, `status`, `category`. A colour is a role (`--tl-surface-field`, `--tl-text-secondary`, `--tl-status-error-border`), not a hue. |
| Type through classes | Font size, weight and line height only through the classes of `base.css` on the element: `tl-type-body`, `tl-type-body-strong`, `tl-type-label`, `tl-type-label-strong`, `tl-type-heading-sm`, `tl-type-heading-md`, `tl-type-heading-lg`, `tl-type-display`, `tl-type-code`. A component sets at most `font: inherit`. Icons take `tl-icon-sm`, `tl-icon-md` or `tl-icon-lg`. |
| One focus ring | `base.css` draws the ring for everything focusable on `:focus-visible`. Never `:focus` without `-visible`, never `outline: none`. |
| No selector from outside | Not `.tlToolbar .tl-button`. A container chooses the appearance of the buttons in it through `ButtonDefaults` (a React context): the toolbar says `ghost`, a dialog footer `secondary`. |

Radius and elevation keep the scale the package decided: `--tl-radius-sm` for what is operated
(field, button, cell), `--tl-radius-md` for what holds other boxes (card, dialog, popover, panel,
drawer); `--tl-radius-full` (pill) and `--tl-radius-round` (circle) are shapes, not steps. A shadow is
only for what floats: `--tl-shadow-popover`, `--tl-shadow-dialog`, `--tl-shadow-drag`. A backdrop is
`--tl-surface-scrim`.

In TSX, a button takes its classes from `buttonClassName(…)`, the root of a control from
`rootClassName(state, …)`, an icon is a `ThemeIcon`; there is no inline style for a colour or a size.

## The `--tl` namespace

Every custom property starting with `--tl` belongs to the package. A stylesheet outside it - an engine
module's, an application's - reads them and never declares one. The
[audit test](doc:view-layer/theme-tokens#the-audit-test) accepts them through `tokenStylesheets()`.

## When something is missing

| Situation | Where it goes |
| --- | --- |
| The package has no component for it | Into the package (`design-system/src/components/<block>/`: CSS, contract, specimen, test), published, then used by the control. Not into `tlReactControls.css`. Look at `src/components/` first - the component may already exist under the new name. |
| The package has no token for it | Into the package's `src/tokens.json` as a reference to a primitive, decided with its reason in `docs/skalen.md`. Never a token declared locally in a class. |
| A small, urgent fix to a control not migrated yet | May stay in `tlReactControls.css`, without a new literal and without a new `--tl` declaration; the ratchet must not rise. A larger change migrates the control. |
| An application wants a look of its own (glass, a serif face, a background image) | An application stylesheet on the element's `css-class`, reading `--tl-*` tokens. No new engine token for it. |

## Scope

The rules are for the controls of the engine and the components of the package. They do not apply to
a customer's component library: the Material UI module `com.top_logic.layout.react.mui` and the
adapters an application registers through `replace` follow the state contract (`state.proto`) and the
library's own styling, see [customer component library](doc:view-layer/customer-component-library).

## Where the decisions are

In the package repository: `docs/skalen.md` (each scale and rule with its reason),
`design-system/src/components/<block>/<block>.contract.md` (markup, states and behaviour of a
component), the specimen (`node tools/serve.mjs`, every component in every state, light and dark,
normal and compact) and `docs/migration/altlast.md` (old class and token to new, per wave).
