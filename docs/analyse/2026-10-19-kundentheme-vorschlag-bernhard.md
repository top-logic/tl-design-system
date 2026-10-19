# Entwurf für Bernhard: Lebenszyklus eines Kundenthemes

**Status:** gesendet 19.10. als Trac **#29909** (Owner hpe, CC bhu). Text dort maßgeblich; Fassung hier wie angelegt (englisch,
Trac-WikiFormatting), CC `bhu`. Deutsche Grundlage: `docs/analyse/2026-10-19-kundentheme-lebenszyklus.md`.

---

**Summary:** Design System: lifecycle of customer themes — where and when `derive` computes, and how a stale theme is detected

= Problem =

A customer theme starts from one small file the customer owns, the ''base file'' (`<theme>.primitives.json`: brand
color, gray choice, single steps, font, radius). From it, `derive` (in the design system package) computes the theme:
every role that differs from TopLogic, with its value, for light and dark, and checks every text/surface pair against
the contrast list. The base file is the contract; the computed theme is a result.

The package keeps evolving. Wave 5c alone added roles (`category-N-surface`, `text-on-category-N`,
`text-contrast-light/-dark`). A theme computed before such a change is ''stale'':

 * a new role falls back to the TopLogic value (the cascade ends at `:root`) — readable, but not in the customer's brand;
 * a new pair of a customer role and a TopLogic role mixes both — its contrast was never checked.

Nothing breaks, but two promises no longer hold: brand everywhere, and readability checked. So the theme has to be
recomputed whenever the package changes. Today `derive` only runs as a Node command at build time, and nothing in the
engine knows a theme belongs to an older package version.

= What exists =

 * `UIThemeService` reads themes from XML (`tl-react-theme.config.xml`, `extends`, `color-scheme`), writes them as an
   inline `<style>` under `[data-theme]`, stores the user's choice in `PersonalConfiguration` (`react.theme`). The
   selection mechanics are right and stay; the token values in that XML are the old roles and go with wave 5d.
 * `ClientResources` lets any module contribute a stylesheet (`<stylesheet … requires="tl-design-system-tokens"/>`).
 * The server runs no JavaScript (no GraalJS/Nashorn). Node exists at build time: every React module builds with
   `frontend-maven-plugin`.
 * The React stack has no theme editor; the legacy one (`com.top_logic.layout.themeedit`) writes `theme-settings.xml`.

= Options =

||= =||= A · application build =||= B · browser on load =||= C · theme editor on save =||
|| base file lives || in the application module || module or database || database / `WEB-INF/themes` ||
|| who computes || a Maven step (Node via `frontend-maven-plugin`) with the `derive` of exactly the package version built against || every client, every page load || the admin's browser, once; the engine serves the result statically ||
|| after an update || recomputed by the build — cannot be stale || recomputed anyway — cannot be stale || '''stale''' until someone saves again ||
|| findings || build log; `--strict` fails the build || lost (console at best) || shown to the admin in the editor ||
|| change without rebuild || no || yes || yes ||

Rejected: computing on the server at runtime. Without a JS engine that means a Java port of the color core — a second
implementation of the contrast rules and the pair list that will drift from the first — or a new GraalJS dependency
only for themes.

= Proposal =

 1. '''A as the regular case.''' The base file sits in the application module; the build computes and registers the
    theme. A TopLogic update means a rebuild anyway, so every update recomputes.
 2. '''A fingerprint for every way.''' `tokens.css` and every theme file carry a hash of the role and pair list in their
    header. Mismatch = stale. Checked by a test in the application module (like `TestDesignSystemCopy`) and logged by
    the engine at startup. Wave 5d can add it at no risk.
 3. '''C where themes must change at runtime''', with the same JS core in the admin's browser. The stored result keeps
    its fingerprint; after an update with a mismatch, the client computes on load (B) until the admin saves again, and
    the admin sees a hint.
 4. '''Until recomputed, TopLogic applies.''' `derive` keeps writing only the roles that differ, so any new role falls
    back to a readable TopLogic value instead of nothing.

In short: the base file is configuration, the computed theme is a cache with a version stamp — one computation, in
JavaScript, wherever it runs.

= To decide together =

 1. Must an admin change a theme in the running application, without a rebuild? Who: the customer's admin or only the
    project team? (yes → plan C with B as fallback; no → A is enough)
 2. On 25.09. you said TL-Script is dynamic and has to be generated on the client. Did you mean
    (a) themes are edited at runtime, or (b) TL-Script delivers the base values (an expression instead of a hex)?
    For (b): the contrast check needs fixed values per theme. A color that depends on the object or the user is not a
    theme but the choice of a role (`data-tl-role`), which the controls already support.
 3. Where should the base file live at runtime: as typed configuration in the application (XML, like today's themes)
    or in the database?
 4. Wave 5d: `UIThemeService` keeps choice, inheritance and OS following, sets `data-tl-theme` instead of `data-theme`,
    and lists the computed themes instead of XML token values. Agreed?
