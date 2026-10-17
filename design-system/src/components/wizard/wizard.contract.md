# Vertrag: Wizard

Oben, was zeigt, wo man ist (Zähler, Fortschritt, Schrittliste), darunter der Schritt. TopLogic garantiert die
Zugänglichkeit der Position, nicht das Aussehen.

## Zustand

`steps`, `activeIndex`, `activeChild`, `counter`, `progress`, `stepList`, `direction`, `autoAdvance`.

## Aktionen

| Befehl | Wann |
|---|---|
| `gotoStep` | ein erledigter Schritt in der Liste (Knopf `tl-button--link`) |
| `advanceStep` | Zeitgeber (`autoAdvance`) |

## Attribute

| Attribut | Wann |
|---|---|
| `tl-wizard` | Wurzel; zurück: `data-tl-state~="backward"` |
| `tl-wizard__counter` | mit `tl-type-label` `tl-nums`, `aria-hidden` |
| `tl-wizard__progress` | Hülle des Fortschrittsbalkens |
| `tl-wizard__steps` | an `ol`, `aria-label` aus i18n `js.wizard.steps` |
| `tl-wizard__step-item` | an `li`; erledigt `data-tl-state~="done"`, aktuell `aria-current="step"` |
| `tl-wizard__disc` | an `span`, mit `tl-type-label` `tl-nums`, `aria-hidden` |
| `tl-button--link` | der Name eines erledigten Schritts |
| `tl-wizard__step-name` | an `span`, der Name sonst, mit `tl-type-body` oder `tl-type-body-strong` |
| `tl-wizard__body`, `tl-wizard__step` | Bereich und Schritt; Übergang `data-tl-state~="entering"` / `"exiting"` |

## Tokens

| Teil | Token |
|---|---|
| Scheibe kommend | `--tl-surface-layer-nested`, `--tl-border-control`, `--tl-text-secondary` |
| Scheibe erledigt | `--tl-surface-brand-subtle`, `--tl-text-primary` |
| Scheibe aktuell | `--tl-surface-brand`, `--tl-text-on-brand` |
| Balken | `--tl-size-wizard-progress` |
